/**
 * @jest-environment node
 *
 * Déploiement (deploy.sh) : la synchronisation S3 compare les tailles (--size-only), or un
 * fichier texte peut changer sans changer de taille (une version, une date, un mot de même
 * longueur). Chaque fichier texte du site doit donc partir d'office, avec son type ; les
 * fichiers binaires s'en tiennent à la synchronisation. Le test déploie un petit site avec un
 * faux AWS CLI, qui note chaque envoi et, à taille égale, ne synchronise rien.
 */
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const FAKE_AWS = path.resolve('tests-esm/scripts/fake-aws.cjs');

/** Fichiers texte du petit site, de chaque sorte que le déploiement envoie */
const TEXT_FILES = {
  'index.html':
    '<link rel="stylesheet" href="css/main.css">\n<script type="module" src="js/main.js"></script>\n',
  'parents.html': '<title>Parents</title>\n',
  'offline.html': '<title>Hors ligne</title>\n',
  'sw.js': "const VERSION = 'v7';\n",
  'manifest.json': '{ "name": "LeapMultix" }\n',
  'robots.txt': 'User-agent: *\n',
  'sitemap.xml': '<urlset></urlset>\n',
  'js/main.js': "import './core/storage.js';\n",
  'js/core/storage.js': 'export const storage = {};\n',
  'js/cache-updater.js': "export const APP_VERSION = 'v7';\n",
  'css/main.css': 'body { color: #123456; }\n',
  'assets/translations/en.json':
    '{ "recorded_voice_hint": "Synthetic voice made with Mistral AI." }\n',
  'assets/generated-images/image-map.json': '{}\n',
  'assets/fonts/OFL.txt': 'SIL Open Font License\n',
};

/** Fichiers binaires : la synchronisation suffit */
const BINARY_FILES = ['img/logo.png', 'assets/fonts/police.woff2', 'assets/sounds/bravo.wav'];

/** Type de chaque fichier texte en ligne, d'après son extension */
const TEXT_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

let site;

function write(file, content) {
  const full = path.join(site, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

beforeEach(() => {
  site = fs.mkdtempSync(path.join(os.tmpdir(), 'deploy-'));
  for (const [file, content] of Object.entries(TEXT_FILES)) write(file, content);
  for (const file of BINARY_FILES) write(file, Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  fs.copyFileSync('deploy.sh', path.join(site, 'deploy.sh'));
  write('scripts/version-module-urls.mjs', fs.readFileSync('scripts/version-module-urls.mjs'));
  write('bin/aws', `#!/bin/sh\nexec "${process.execPath}" "${FAKE_AWS}" "$@"\n`);
  fs.chmodSync(path.join(site, 'bin/aws'), 0o755);
});

afterEach(() => {
  fs.rmSync(site, { recursive: true, force: true });
});

/** Déploie le petit site ; rend le résultat du script et les appels notés par le faux AWS */
function deploy(env = {}) {
  const log = path.join(site, 'aws.log');
  const result = spawnSync('bash', ['deploy.sh', '--config', 'absent.config'], {
    cwd: site,
    encoding: 'utf8',
    env: {
      PATH: `${path.join(site, 'bin')}${path.delimiter}${process.env.PATH}`,
      HOME: process.env.HOME,
      S3_BUCKET: 'site-de-test',
      AWS_LOG: log,
      ...env,
    },
  });
  const calls = fs.existsSync(log)
    ? fs.readFileSync(log, 'utf8').trim().split('\n').map(JSON.parse)
    : [];
  return { result, calls };
}

/** index.html avec les deux blocs de Plausible, comme le vrai, et une page après eux */
const INDEX_WITH_ANALYTICS = [
  '<head>',
  '    <!-- plausible:start -->',
  '    <link rel="dns-prefetch" href="https://plausible.io" />',
  '    <!-- plausible:end -->',
  '    <link rel="stylesheet" href="css/main.css">',
  '    <!-- plausible:start -->',
  '    <!-- Analytics Plausible (remplacé par le script de déploiement) -->',
  '    <script src="js/plausible-init.js"></script>',
  '    <script',
  '      defer',
  '      data-domain="{{PLAUSIBLE_DOMAIN}}"',
  '      src="https://plausible.io/js/script.js"',
  '    ></script>',
  '    <!-- plausible:end -->',
  '  </head>',
  '  <body>',
  '    <main id="main-content">Le jeu</main>',
  '    <script>',
  '      window.reste = true;',
  '    </script>',
  '  </body>',
  '',
].join('\n');

describe('deploy.sh : mesure d’audience', () => {
  beforeEach(() => {
    write('index.html', INDEX_WITH_ANALYTICS);
  });

  const deployedIndex = env => {
    const keep = path.join(site, 'envoyé');
    const { result } = deploy({ FAKE_AWS_KEEP: keep, ...env });
    expect(result.status).toBe(0);
    return fs.readFileSync(path.join(keep, 'index.html'), 'utf8');
  };

  test('sans domaine : seuls les blocs de Plausible partent, la page reste entière', () => {
    const html = deployedIndex({});
    expect(html).not.toMatch(/plausible/i);
    expect(html).toContain('<main id="main-content">Le jeu</main>');
    expect(html).toContain('window.reste = true;');
    expect(html.split('\n')).toHaveLength(INDEX_WITH_ANALYTICS.split('\n').length - 12);
  });

  test('le vrai index.html : sans domaine, plus rien de Plausible, la page entière', () => {
    const real = fs.readFileSync('index.html', 'utf8');
    write('index.html', real);
    const html = deployedIndex({});
    // Le script, son initialisation, le domaine à remplir et les préconnexions partent ; les liens
    // de la politique de confidentialité vers celle de Plausible restent
    expect(html).not.toMatch(
      /plausible\.io\/js|plausible-init|PLAUSIBLE_DOMAIN|href="https:\/\/plausible\.io"/
    );
    expect(html).toContain('https://plausible.io/data-policy');
    expect(html).toContain('<main id="main-content"');
    expect(html.trimEnd().endsWith('</html>')).toBe(true);
    const marked = real.match(/<!-- plausible:start -->[\s\S]*?<!-- plausible:end -->\n/g);
    expect(marked).toHaveLength(2);
    // Chaque bloc trouvé finit par son saut de ligne : ses lignes sont celles avant ce saut
    const removed = marked.reduce((sum, block) => sum + block.split('\n').length - 1, 0);
    expect(html.split('\n')).toHaveLength(real.split('\n').length - removed);
  });

  test('avec un domaine : les blocs restent, le domaine est écrit', () => {
    const html = deployedIndex({ PLAUSIBLE_DOMAIN: 'exemple.org' });
    expect(html).toContain('data-domain="exemple.org"');
    expect(html).toContain('<main id="main-content">Le jeu</main>');
  });
});

describe('deploy.sh : fichiers modifiés à taille constante', () => {
  test('chaque fichier texte part d’office, avec son type ; les binaires restent à la synchronisation', () => {
    const { result, calls } = deploy();
    expect(result.stderr).toBe('');
    expect(result.status).toBe(0);
    expect(calls.map(call => call.command)).toContain('s3 sync');
    const forced = Object.fromEntries(
      calls.filter(call => call.command === 'cp').map(call => [call.file, call.contentType])
    );
    const expected = Object.fromEntries(
      Object.keys(TEXT_FILES).map(file => [file, TEXT_TYPES[path.extname(file)]])
    );
    expect(forced).toEqual(expected);
  });

  test('un envoi forcé en échec arrête le déploiement', () => {
    const { result } = deploy({ FAKE_AWS_FAIL: 'cp' });
    expect(result.status).toBe(1);
    expect(result.stdout).toMatch(/en échec/);
  });
});
