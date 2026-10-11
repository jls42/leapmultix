/**
 * Serveur statique des tests : il ne sert que ce que deploy.sh publie, comme le site en ligne.
 * Un fichier caché, un fichier du dépôt hors de la liste, un lien qui sort du dépôt ou un clip
 * privé demandé par un détour (/%2fvoice/…, /js/..%2fvoice/…) reçoivent la réponse d'un
 * fichier absent ; /voice/ ne lit que le dossier de test (voiceDir).
 * @jest-environment node
 */

const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { startStaticServer, PUBLISHED } = require('../utils/static-server.cjs');

const HOME_PAGE = '<p>accueil</p>';
const TEST_CLIP = 'clip du dossier de test';

/** Petit dépôt : le site publié, et à côté ce qui ne doit jamais partir */
const REPO_FILES = new Map([
  ['index.html', HOME_PAGE],
  ['js/app.js', 'export const app = 1;'],
  ['js/.cache.js', 'fichier caché'],
  ['.env', 'SECRET=depot'],
  ['package.json', '{ "name": "depot" }'],
  ['voice/fr/clip.mp3', 'clip privé du dépôt'],
  ['assets/voice/fr/clip.mp3', 'clip privé des assets'],
]);

function writeFiles(dir, files) {
  for (const [name, content] of files) {
    fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
    fs.writeFileSync(path.join(dir, name), content);
  }
}

/** Requête brute : le chemin part tel quel, sans la normalisation d'un navigateur */
function get(server, rawPath) {
  const { port } = new URL(server.url);
  return new Promise((resolve, reject) => {
    http
      .get({ host: '127.0.0.1', port, path: rawPath }, res => {
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () =>
          resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString() })
        );
      })
      .on('error', reject);
  });
}

describe('serveur statique des tests', () => {
  let tmp;
  let withVoice;
  let withoutVoice;

  beforeAll(async () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'static-server-'));
    const rootDir = path.join(tmp, 'depot');
    writeFiles(rootDir, REPO_FILES);
    writeFiles(tmp, new Map([['ailleurs/secret.txt', 'hors du dépôt']]));
    fs.symlinkSync(path.join(tmp, 'ailleurs/secret.txt'), path.join(rootDir, 'js/lien.js'));
    const voiceDir = path.join(tmp, 'voix-test');
    writeFiles(voiceDir, new Map([['fr/clip.mp3', TEST_CLIP]]));
    withVoice = await startStaticServer('load', { rootDir, voiceDir });
    withoutVoice = await startStaticServer('load', { rootDir });
  });

  afterAll(async () => {
    await withVoice?.stop();
    await withoutVoice?.stop();
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  test('sert le site publié, index.html pour la racine', async () => {
    expect(await get(withVoice, '/js/app.js')).toEqual({
      status: 200,
      body: 'export const app = 1;',
    });
    expect(await get(withVoice, '/')).toEqual({ status: 200, body: HOME_PAGE });
  });

  test.each([
    '/.env',
    '/js/.cache.js',
    '/package.json',
    '/js/..%2fpackage.json',
    '/js/..%2f.env',
    '/voice/..%2f.env',
    '/assets/voice/fr/clip.mp3',
    '/js/lien.js',
  ])('%s : réponse d’un fichier absent', async rawPath => {
    expect(await get(withVoice, rawPath)).toEqual({ status: 200, body: HOME_PAGE });
  });

  test.each(['/voice/fr/clip.mp3', '/%2fvoice/fr/clip.mp3', '/js/..%2fvoice/fr/clip.mp3'])(
    '%s : clip du dossier de test, jamais ceux du dépôt',
    async rawPath => {
      expect(await get(withVoice, rawPath)).toEqual({ status: 200, body: TEST_CLIP });
    }
  );

  test.each(['/voice/fr/clip.mp3', '/%2fvoice/fr/clip.mp3', '/js/..%2fvoice/fr/clip.mp3'])(
    'sans dossier de test, %s répond 404',
    async rawPath => {
      expect((await get(withoutVoice, rawPath)).status).toBe(404);
    }
  );

  test('la liste servie est celle que deploy.sh publie', () => {
    const deploy = fs.readFileSync(path.resolve(__dirname, '../../deploy.sh'), 'utf8');
    const rsync = deploy.slice(deploy.indexOf('rsync -av'), deploy.indexOf("--exclude='*'"));
    const values = rule => [...rsync.matchAll(rule)].map(match => match[1]);
    const included = values(/--include='([^']+)'/g);
    const dirs = patterns => patterns.filter(p => p.endsWith('/***')).map(p => p.slice(0, -3));
    expect([...PUBLISHED.files]).toEqual(included.filter(p => !p.endsWith('/***')));
    expect(PUBLISHED.dirs).toEqual(dirs(included));
    expect(PUBLISHED.privateDirs).toEqual(dirs(values(/--exclude='([^']+)'/g)));
  });
});
