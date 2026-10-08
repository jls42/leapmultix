/**
 * @jest-environment node
 *
 * Liste de préchargement du service worker (scripts/precache-list.mjs) : sur un petit site
 * fabriqué, chaque façon de nommer un fichier ; sur le dépôt réel, une liste à jour dans
 * sw.js, des fichiers qui existent, et chaque script, son, police et traduction dont un mode
 * a besoin (relevés ici par un détecteur indépendant).
 */
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  BLOCK_END,
  BLOCK_START,
  buildPrecacheList,
  describeToken,
  htmlReferences,
  renderPrecacheBlock,
  replacePrecacheBlock,
  toSitePath,
  totalBytes,
} from '../../scripts/precache-list.mjs';

const ROOT = path.resolve('.');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

describe('lecture des références', () => {
  test('toSitePath : chemin du site, sans paramètres ; rien pour une adresse absolue', () => {
    expect(toSitePath('js/a.js?v=v37')).toBe('/js/a.js');
    expect(toSitePath('../assets/fonts/b.woff2')).toBe('/assets/fonts/b.woff2');
    expect(toSitePath('/manifest.json')).toBe('/manifest.json');
    expect(toSitePath('https://plausible.io/js/script.js')).toBeNull();
    expect(toSitePath('//cdn.example/x.js')).toBeNull();
    expect(toSitePath('data:image/png;base64,AAAA')).toBeNull();
  });

  test('htmlReferences : src, href, et chaque adresse d’un srcset sur plusieurs lignes', () => {
    const html = `<img src="a.png" srcset="\n  b-128.webp 128w,\n  b-256.webp 256w\n" />
      <link rel="stylesheet" href="css/x.css" />`;
    expect(htmlReferences(html)).toEqual(['a.png', 'b-128.webp', 'b-256.webp', 'css/x.css']);
  });

  test('describeToken : chemin, gabarit borné, nom seul ; un gabarit trop large est écarté', () => {
    expect(describeToken('assets/sounds/a.wav')).toEqual({
      kind: 'path',
      path: '/assets/sounds/a.wav',
    });
    const template = describeToken('assets/images/arcade/\uFFFC_head_avatar_128x128.png');
    expect(template.dir).toBe('/assets/images/arcade');
    expect(template.name.test('fox_head_avatar_128x128.png')).toBe(true);
    expect(template.name.test('fox_left_128x128.png')).toBe(false);
    expect(describeToken('tete_haut.png').name.test('tete_haut.png')).toBe(true);
    // « ${nom}.png » viserait toutes les images d'un dossier
    expect(describeToken('assets/images/arcade/\uFFFC.png')).toBeNull();
    expect(describeToken('\uFFFC.png')).toBeNull();
    // Hors des images, le dossier borne le gabarit (traductions)
    expect(describeToken('assets/translations/\uFFFC.json').name.test('fr.json')).toBe(true);
    // Un trou dans le dossier : rien de sûr
    expect(describeToken('assets/\uFFFC/a.png')).toBeNull();
  });
});

/** Petit site : chaque façon dont le jeu nomme un fichier */
const SITE = {
  'index.html': `<script type="module" src="js/entry.js"></script>
    <link rel="stylesheet" href="css/main.css" />
    <img src="assets/images/arcade/fox_head_avatar_128x128.png" />
    <img src="assets/generated-images/arcade/logo-256.webp" />
    <a href="parents.html">Parents</a>
    <script src="https://plausible.io/js/script.js"></script>`,
  'offline.html': '<p>Hors ligne</p>',
  'manifest.json': JSON.stringify({ icons: [{ src: '/assets/icons/panda-192.png' }] }),
  'js/entry.js': `import { a } from './a.js';
    const mode = () => import('./modes/Mode.js');
    const scripts = ['js/lazy.js'];
    // Commentaire : 'assets/sounds/commentaire.wav' n'est pas lu`,
  'js/a.js': `export const a = 1;
    const son = 'assets/sounds/bip.wav';
    const tete = \`assets/images/arcade/\${avatar}_left_128x128.png\`;
    const tout = \`assets/images/arcade/\${nom}.png\`;
    const lang = \`assets/translations/\${l}.json?v=\${v}\`;`,
  'js/modes/Mode.js': `const sprite = loader.loadSpriteSync('chemin', 'ui');
    const corps = this.loadSprite('tete_haut.png');`,
  'js/lazy.js': "export const styles = ['css/optional.css'];",
  'js/unused.js': 'export default 1;',
  'css/main.css': "@font-face { src: url('../assets/fonts/f.woff2') format('woff2'); }",
  'css/optional.css': '.x { color: red; }',
  'assets/fonts/f.woff2': 'f',
  'assets/sounds/bip.wav': 'w',
  'assets/sounds/commentaire.wav': 'w',
  'assets/icons/panda-192.png': 'p',
  'assets/translations/fr.json': '{}',
  'assets/translations/en.json': '{}',
  'assets/translations/i18n-keep.json': '{}',
  'assets/images/arcade/fox_head_avatar_128x128.png': 'i',
  'assets/images/arcade/fox_left_128x128.png': 'i',
  'assets/images/arcade/panda_left_128x128.png': 'i',
  'assets/images/arcade/chemin.png': 'i',
  'assets/images/arcade/tete_haut.png': 'i',
  'assets/images/arcade/inutile.png': 'i',
  'img/background_fox_003.webp': 'b',
  'img/background_fox_010.webp': 'b',
  'img/background_panda_002.webp': 'b',
  'img/background_panda_002.png': 'b',
  'sw.js': `const VERSION = 'v1';\n${BLOCK_START}\n${BLOCK_END}\n`,
};

describe('buildPrecacheList sur un petit site', () => {
  let root;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'precache-'));
    for (const [file, content] of Object.entries(SITE)) {
      fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
      fs.writeFileSync(path.join(root, file), content);
    }
  });

  afterEach(() => fs.rmSync(root, { recursive: true, force: true }));

  test('le code atteignable, ses styles, polices, sons, traductions, icônes et un fond par avatar', () => {
    expect(buildPrecacheList(root).core).toEqual([
      '/assets/fonts/f.woff2',
      '/assets/icons/panda-192.png',
      '/assets/sounds/bip.wav',
      '/assets/translations/en.json',
      '/assets/translations/fr.json',
      '/css/main.css',
      '/css/optional.css',
      '/img/background_fox_003.webp',
      '/img/background_panda_002.webp',
      '/index.html',
      '/js/a.js',
      '/js/entry.js',
      '/js/lazy.js',
      '/js/modes/Mode.js',
      '/manifest.json',
      '/offline.html',
    ]);
  });

  test('les images : originaux nommés (gabarit, nom seul, sprite), images générées de la page', () => {
    expect(buildPrecacheList(root).images).toEqual([
      '/assets/generated-images/arcade/logo-256.webp',
      '/assets/images/arcade/chemin.png',
      '/assets/images/arcade/fox_head_avatar_128x128.png',
      '/assets/images/arcade/fox_left_128x128.png',
      '/assets/images/arcade/panda_left_128x128.png',
      '/assets/images/arcade/tete_haut.png',
    ]);
  });

  test('le bloc de sw.js se remplace, et se relit à l’identique', () => {
    const list = buildPrecacheList(root);
    const source = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
    const block = renderPrecacheBlock(list);
    const next = replacePrecacheBlock(source, block);
    expect(next).toContain("  '/js/a.js',");
    expect(replacePrecacheBlock(next, block)).toBe(next);
    expect(() => replacePrecacheBlock('const x = 1;', block)).toThrow(/introuvable/);
  });
});

describe('Le dépôt', () => {
  const list = buildPrecacheList(ROOT);
  const core = new Set(list.core);

  test('sw.js porte la liste à jour (sinon : npm run precache:update)', () => {
    const source = read('sw.js');
    expect(replacePrecacheBlock(source, renderPrecacheBlock(list))).toBe(source);
  });

  test('chaque fichier de la liste du code existe, et aucun chemin ne porte de guillemet', () => {
    expect(list.core.filter(file => !fs.existsSync(path.join(ROOT, file)))).toEqual([]);
    expect([...list.core, ...list.images].filter(file => /['"\\]/.test(file))).toEqual([]);
  });

  test('chaque script chargé à la demande (modes, Arcade, Multimiam) est gardé', () => {
    const lazy = [...read('js/lazy-loader.js').matchAll(/^\s*'(js\/[^']+\.js)'/gm)].map(
      m => `/${m[1]}`
    );
    const dynamic = [
      'js/mode-orchestrator.js',
      'js/modes/ArcadeMode.js',
      'js/bootstrap.js',
    ].flatMap(file =>
      [...read(file).matchAll(/import\('(\.{1,2}\/[^']+\.js)'\)/g)].map(m =>
        path.posix.join('/', path.posix.dirname(file), m[1])
      )
    );
    expect(lazy.length).toBeGreaterThan(10);
    expect(dynamic).toEqual(
      expect.arrayContaining(['/js/modes/ChronoMode.js', '/js/arcade-multisnake.js'])
    );
    expect([...lazy, ...dynamic].filter(file => !core.has(file))).toEqual([]);
  });

  test('les sons, les polices, les trois traductions et la page hors ligne sont gardés', () => {
    const sounds = [...read('js/core/audio.js').matchAll(/'(assets\/sounds\/[^']+\.wav)'/g)];
    const fonts = [...read('css/general.css').matchAll(/url\('\.\.\/(assets\/fonts\/[^']+)'\)/g)];
    const expected = [...sounds, ...fonts].map(m => `/${m[1]}`);
    expect(expected.length).toBeGreaterThanOrEqual(7);
    for (const lang of ['fr', 'en', 'es']) expected.push(`/assets/translations/${lang}.json`);
    expected.push('/index.html', '/offline.html', '/manifest.json');
    expect(expected.filter(file => !core.has(file))).toEqual([]);
  });

  test('les avatars, sprites des jeux et logos sont des images gardées', () => {
    expect(list.images).toEqual(
      expect.arrayContaining([
        '/assets/images/arcade/fox_head_avatar_128x128.png',
        '/assets/images/arcade/monstre01_right_128x128.png',
        '/assets/images/arcade/spaceship_default.png',
        '/assets/images/arcade/tete_haut.png',
        '/assets/images/arcade/chemin.png',
        '/assets/images/arcade/herbe.png',
        '/assets/images/arcade/cadeau_ouvert.png',
        '/assets/generated-images/arcade/logo_mode_quizz-256.webp',
      ])
    );
    const family = /^\/assets\/(?:images\/.+\.png|generated-images\/.+)$/;
    expect(list.images.filter(file => !family.test(file))).toEqual([]);
  });

  test('taille bornée : le code sous 4 Mo, et jamais un dossier d’images entier', () => {
    expect(totalBytes(ROOT, list.core)).toBeLessThan(4 * 1024 * 1024);
    // assets/images/arcade compte plus de 700 images : un gabarit trop large les prendrait
    expect(list.images.length).toBeLessThan(500);
  });

  test('la version du service worker est celle de la page (APP_VERSION)', () => {
    // Hors ligne, un module demandé avec une autre version que celle du service worker
    // n'est pas servi par son préchargement : les deux doivent monter ensemble
    const sw = /^const VERSION = '([^']+)';/m.exec(read('sw.js'))[1];
    const page = /^export const APP_VERSION = '([^']+)';/m.exec(read('js/cache-updater.js'))[1];
    expect(sw).toBe(page);
  });
});
