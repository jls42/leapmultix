/**
 * @jest-environment node
 *
 * Versionnage des adresses de modules au déploiement (scripts/version-module-urls.mjs) :
 * chaque forme d'import, la page, et surtout le dépôt réel, dont aucun import relatif ne
 * doit rester sans version (un module ancien resservi depuis le cache navigateur ferait
 * échouer le démarrage d'un mode).
 */
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  versionHtmlAssets,
  versionImports,
  versionSite,
} from '../../scripts/version-module-urls.mjs';

const SCRIPT = path.resolve('scripts/version-module-urls.mjs');

// Guillemets écrits \x27 et \x22 : lizard (Codacy) lit un guillemet de regex comme le début
// d'une chaîne et mesurerait mal les fonctions qui suivent
/** Imports relatifs sans version, toutes formes confondues (détecteur indépendant) */
const UNVERSIONED = /(?:\bfrom|\bimport)\s*\(?\s*([\x27\x22])\.{1,2}\/[^\x27\x22?]+\.js\1/g;
/** Chemins des imports versionnés d'un module réécrit */
const VERSIONED = /([\x27\x22])(\.{1,2}\/[^\x27\x22?]+\.js)\?v=v23\1/g;

/** Réécrit un module du dépôt : imports oubliés, chemins introuvables */
function checkModule(file) {
  const source = fs.readFileSync(file, 'utf8');
  const expected = source.match(UNVERSIONED)?.length ?? 0;
  const { text, count } = versionImports(source, 'v23');
  const missing = [...text.matchAll(VERSIONED)]
    .map(match => match[2])
    .filter(specifier => !fs.existsSync(path.resolve(path.dirname(file), specifier)));
  return { count, leftover: count !== expected || text.match(UNVERSIONED) !== null, missing };
}

function jsFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return jsFiles(full);
    return entry.name.endsWith('.js') ? [full] : [];
  });
}

describe('versionImports', () => {
  test('toutes les formes relatives reçoivent la version, le reste ne bouge pas', () => {
    const source = [
      "import { a } from './a.js';",
      'import b from "../b.js";',
      "import {\n  c,\n  d,\n} from '../../lib/c.js';",
      "export { e } from './e.js';",
      "export * from '../f.js';",
      "import './g.js';",
      "const h = await import('./modes/h.js');",
      "const i = () => import(\n  '../i.js'\n);",
      "import lib from 'lib';",
      "import abs from '/js/abs.js';",
      "import data from './data.json';",
      "import done from './done.js?v=v1';",
      "const url = 'https://exemple.fr/a.js';",
    ].join('\n');
    const { text, count } = versionImports(source, 'v23');
    expect(count).toBe(8);
    for (const specifier of [
      './a.js',
      '../b.js',
      '../../lib/c.js',
      './e.js',
      '../f.js',
      './g.js',
      './modes/h.js',
      '../i.js',
    ]) {
      expect(text).toContain(`${specifier}?v=v23`);
    }
    expect(text).toContain("from 'lib'");
    expect(text).toContain("from '/js/abs.js'");
    expect(text).toContain("from './data.json'");
    expect(text).toContain("from './done.js?v=v1'");
    expect(text).toContain("'https://exemple.fr/a.js'");
  });

  test('deux passages donnent le même texte (une adresse versionnée reste telle quelle)', () => {
    const once = versionImports("import a from './a.js';", 'v23').text;
    expect(versionImports(once, 'v23')).toEqual({ text: once, count: 0 });
  });

  test.each(['', '22', 'v', 'v23;alert(1)', 'v23/../x', `v${'1'.repeat(41)}`])(
    'version refusée : %p',
    version => {
      expect(() => versionImports("import a from './a.js';", version)).toThrow(/Version invalide/);
    }
  );
});

describe('versionHtmlAssets', () => {
  test('scripts et feuilles de style du site, pas les adresses externes ni les images', () => {
    const html = [
      '<link rel="stylesheet" href="css/general.css" />',
      '<link rel="preload" as="style" href="css/home.css">',
      '<link rel="modulepreload" href="js/main.js">',
      '<script type="module" src="js/bootstrap-critical.js"></script>',
      '<script src="js/done.js?v=v1"></script>',
      '<script src="https://plausible.io/js/script.js"></script>',
      '<img src="assets/images/logo.png">',
    ].join('\n');
    const { text, count } = versionHtmlAssets(html, 'v23');
    expect(count).toBe(4);
    expect(text).toContain('href="css/general.css?v=v23"');
    expect(text).toContain('href="css/home.css?v=v23"');
    expect(text).toContain('href="js/main.js?v=v23"');
    expect(text).toContain('src="js/bootstrap-critical.js?v=v23"');
    expect(text).toContain('src="js/done.js?v=v1"');
    expect(text).toContain('src="https://plausible.io/js/script.js"');
    expect(text).toContain('src="assets/images/logo.png"');
  });
});

describe('Le dépôt réel', () => {
  test('aucun import relatif ne reste sans version, et chaque chemin existe', () => {
    const results = jsFiles('js').map(file => ({ file, ...checkModule(file) }));
    expect(results.filter(result => result.leftover).map(result => result.file)).toEqual([]);
    expect(results.flatMap(result => result.missing.map(m => `${result.file} → ${m}`))).toEqual([]);
    expect(results.reduce((sum, result) => sum + result.count, 0)).toBeGreaterThan(100);
  });

  test('index.html : plus aucun script ni feuille de style du site sans version', () => {
    const { text, count } = versionHtmlAssets(fs.readFileSync('index.html', 'utf8'), 'v23');
    expect(count).toBeGreaterThan(10);
    expect(text.match(/\b(?:src|href)="(?:js\/[^"?]+\.js|css\/[^"?]+\.css)"/g)).toBeNull();
  });
});

describe('Commande', () => {
  let site;

  beforeEach(() => {
    site = fs.mkdtempSync(path.join(os.tmpdir(), 'version-urls-'));
    fs.mkdirSync(path.join(site, 'js', 'modes'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(site, { recursive: true, force: true });
  });

  const run = (...args) => spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' });

  test('réécrit la copie du site et dit combien', () => {
    fs.writeFileSync(path.join(site, 'js', 'main.js'), "import('./modes/quiz.js');\n");
    fs.writeFileSync(path.join(site, 'js', 'modes', 'quiz.js'), "import '../main.js';\n");
    fs.writeFileSync(path.join(site, 'index.html'), '<script src="js/main.js"></script>\n');
    const result = run(site, 'v23');
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('2 imports dans 2 modules, 1 adresses dans index.html');
    expect(fs.readFileSync(path.join(site, 'js', 'main.js'), 'utf8')).toBe(
      "import('./modes/quiz.js?v=v23');\n"
    );
    expect(versionSite(site, 'v23')).toEqual({ files: 0, imports: 0, htmlAssets: 0 });
  });

  test('rien à réécrire, version invalide ou arguments manquants : échec', () => {
    fs.writeFileSync(path.join(site, 'js', 'main.js'), 'console.log(1);\n');
    fs.writeFileSync(path.join(site, 'index.html'), '<p></p>\n');
    expect(run(site, 'v23').status).toBe(1);
    expect(run(site, 'x;rm -rf').status).toBe(1);
    expect(run(site).status).toBe(1);
  });
});
