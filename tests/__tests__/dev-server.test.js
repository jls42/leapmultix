/**
 * Serveur de développement (npm run serve, scripts/serve.cjs) : la boucle locale seulement,
 * jamais le réseau de la maison ou de l'école ; le port suivant si 8080 est pris ; le site
 * publié et le dossier voice/ du dépôt (?voix=local), rien d'autre (règles détaillées dans
 * static-server.test.js, même module).
 * @jest-environment node
 */

const fs = require('node:fs');
const http = require('node:http');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const { portRange, startDevServer } = require('../../scripts/serve.cjs');

const HOME_PAGE = '<p>accueil</p>';
const VOICE_INDEX = '{ "languages": {} }';

function get(port, rawPath) {
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

const close = server => new Promise(resolve => server.close(resolve));

/** Un port de la boucle locale tenu par un autre programme */
function occupyPort() {
  return new Promise(resolve => {
    const blocker = net.createServer();
    blocker.listen(0, '127.0.0.1', () => resolve(blocker));
  });
}

describe('serveur de développement', () => {
  let tmp;
  let rootDir;
  const started = [];

  async function start(options) {
    const result = await startDevServer({ rootDir, ...options });
    started.push(result.server);
    return result;
  }

  beforeAll(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dev-server-'));
    rootDir = path.join(tmp, 'depot');
    fs.mkdirSync(path.join(rootDir, 'voice'), { recursive: true });
    fs.writeFileSync(path.join(rootDir, 'index.html'), HOME_PAGE);
    fs.writeFileSync(path.join(rootDir, 'deploy.config'), 'S3_BUCKET=secret');
    fs.writeFileSync(path.join(rootDir, 'voice/index.json'), VOICE_INDEX);
  });

  afterEach(async () => {
    await Promise.all(started.splice(0).map(close));
  });

  afterAll(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  test('écoute sur 127.0.0.1 seulement', async () => {
    const { server } = await start({ ports: { first: 0, last: 0 } });
    expect(server.address().address).toBe('127.0.0.1');
  });

  test('sert le site publié et voice/ du dépôt, pas le reste', async () => {
    const { port } = await start({ ports: { first: 0, last: 0 } });
    expect(await get(port, '/')).toEqual({ status: 200, body: HOME_PAGE });
    expect(await get(port, '/deploy.config')).toEqual({ status: 200, body: HOME_PAGE });
    expect(await get(port, '/voice/index.json')).toEqual({ status: 200, body: VOICE_INDEX });
  });

  test('port pris : le suivant de la plage', async () => {
    const blocker = await occupyPort();
    started.push(blocker);
    const taken = blocker.address().port;
    const { port } = await start({ ports: { first: taken, last: taken + 5 } });
    expect(port).toBeGreaterThan(taken);
    expect(port).toBeLessThanOrEqual(taken + 5);
  });

  test('port imposé et pris : erreur, pas un autre port', async () => {
    const blocker = await occupyPort();
    started.push(blocker);
    const taken = blocker.address().port;
    await expect(start({ ports: { first: taken, last: taken } })).rejects.toMatchObject({
      code: 'EADDRINUSE',
    });
  });

  test('PORT : un port imposé, 8080 à 8099 sinon', () => {
    expect(portRange({})).toEqual({ first: 8080, last: 8099 });
    expect(portRange({ PORT: '' })).toEqual({ first: 8080, last: 8099 });
    expect(portRange({ PORT: '3000' })).toEqual({ first: 3000, last: 3000 });
    expect(portRange({ PORT: '0' })).toEqual({ first: 0, last: 0 });
    expect(() => portRange({ PORT: 'huit' })).toThrow('PORT invalide');
    expect(() => portRange({ PORT: '70000' })).toThrow('PORT invalide');
  });

  test('npm run serve lance ce serveur', () => {
    const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8'));
    expect(pkg.scripts.serve).toBe('node scripts/serve.cjs');
  });
});
