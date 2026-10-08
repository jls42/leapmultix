#!/usr/bin/env node
// Liste de préchargement du service worker : ce que le jeu doit trouver sans réseau après
// une première visite, pour que les 6 modes et les 4 jeux d'Arcade démarrent hors ligne.
// Produite à partir du code, jamais écrite à la main :
// - la page et ce qu'elle nomme (index.html : scripts, feuilles de style, icônes, polices
//   préchargées, images) et les icônes du manifeste ;
// - chaque module atteignable depuis les scripts de la page : imports statiques et import()
//   littéraux, comme les lit scripts/version-module-urls.mjs, plus les scripts et les
//   feuilles chargés par leur chemin (« js/….js » de lazy-loader.js, « css/….css »
//   d'optional-styles-loader.js) ;
// - les polices des feuilles de style ;
// - les sons, traductions et images que nomment ces modules : chemin écrit en entier,
//   gabarit rapproché des fichiers présents (« assets/images/arcade/${avatar}_head… »),
//   nom de fichier seul (« tete_haut.png ») ou nom de sprite (loadSpriteSync('chemin'))
//   cherchés dans assets/images ;
// - un fond illustré par avatar : le jeu en tire un au hasard, et hors ligne le service
//   worker sert celui qu'il a gardé.
//
// Deux listes : « core », des fichiers du dépôt, tous gardés ou aucun ; « images », les
// images d'assets/images (une famille chacune : à l'installation, le service worker garde
// les variantes WebP que liste assets/generated-images/image-map.json, produites au
// déploiement, ou l'original sans elles) et les images générées que nomme la page.
//
// Usage : node scripts/precache-list.mjs            résumé et taille
//         node scripts/precache-list.mjs --write    réécrit la liste dans sw.js
//         node scripts/precache-list.mjs --check    échoue si sw.js n'est pas à jour

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { relativeImportSpecifiers } from './version-module-urls.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SW_FILE = 'sw.js';
export const BLOCK_START =
  '// <precache> Produit par scripts/precache-list.mjs (npm run precache:update)';
export const BLOCK_END = '// </precache>';

/** Toujours gardés : la page, la page hors ligne, le manifeste */
const SHELL = ['/index.html', '/offline.html', '/manifest.json'];

/** Fichiers d'un dossier servi mais jamais lus par le jeu */
const NOT_FOR_PLAYERS = new Set(['/assets/translations/i18n-keep.json']);

/** Lue par le service worker lui-même à l'installation (variantes des images) */
const IMAGE_MAP = '/assets/generated-images/image-map.json';

/** Ce qu'un chemin du jeu peut désigner : script, style, image, son, police, données */
const ASSET = /\.(?:js|css|png|webp|jpe?g|svg|gif|ico|wav|woff2?|json)$/;

/** Dossiers dont les fichiers sont cherchés pour un gabarit ou un nom seul */
const IMAGE_ROOT = 'assets/images';

/** Produit au déploiement, absent du dépôt : nommé tel quel, jamais cherché */
const GENERATED = '/assets/generated-images/';

/** Un gabarit doit garder un vrai bout de nom : « ${x}.png » viserait tout un dossier */
const MIN_LITERAL_NAME = 3;

/** Marque d'un ${…} pendant l'analyse d'un gabarit (caractère « objet remplacé ») */
const HOLE = '\uFFFC';

// Guillemets écrits \x22, \x27 et \x60 : lizard (Codacy) lit un guillemet de regex comme
// le début d'une chaîne et mesurerait mal les fonctions qui suivent
/**
 * Chemin de fichier écrit dans le code, où qu'il soit : chaîne, gabarit HTML sur plusieurs
 * lignes, attribut (« onerror=\"this.src='…png'\" »). ${…} y est déjà remplacé par la marque.
 */
const PATH_TOKEN =
  /[\w\uFFFC./-]+\.(?:js|css|png|webp|jpe?g|svg|gif|ico|wav|woff2?|json)(?![\w\uFFFC.])/g;
/** Nom de sprite passé au chargeur (arcade-sprite-loader.js), sans extension */
const SPRITE_CALL = /\bloadSprite(?:Sync)?\(\s*([\x22\x27\x60])([^\x22\x27\x60]+)\1/g;
/** Attributs d'adresse d'une page ; srcset en porte plusieurs */
const HTML_ATTRIBUTE = /\b(?:src|href|srcset)=\x22([^\x22]*)\x22/g;
/** url(…) d'une feuille de style */
const CSS_URL = /url\(\s*[\x22\x27]?([^\x22\x27)]+)[\x22\x27]?\s*\)/g;
/** Fond illustré : img/background_<avatar>_<numéro>.webp */
const BACKGROUND = /^background_([a-z]+)_(\d+)\.webp$/;
/** Image d'assets/images qui a ses variantes générées (une famille) */
const IMAGE_FAMILY = /^\/assets\/images\/.+\.png$/;

const escapeRegExp = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Chemin du site (« /js/a.js ») d'une référence relative à la racine ; null pour une
 * adresse absolue, une ancre ou une donnée
 * @param {string} reference
 * @returns {string|null}
 */
export function toSitePath(reference) {
  const value = reference.trim().split(/[?#]/)[0];
  if (!value || /^(?:[a-z]+:|\/\/)/i.test(value)) return null;
  return path.posix.normalize(`/${value.replace(/^(?:\.{1,2}\/)+/, '')}`);
}

/** Commentaires retirés : exemples de JSDoc, apostrophes des phrases en français */
const withoutComments = source =>
  source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');

/**
 * Références d'une page : src, href et chaque adresse d'un srcset
 * @param {string} html
 * @returns {string[]}
 */
export function htmlReferences(html) {
  return [...html.matchAll(HTML_ATTRIBUTE)].flatMap(([, value]) =>
    value.split(',').map(item => item.trim().split(/\s+/)[0])
  );
}

/**
 * Ce que désigne un chemin écrit dans le code : un chemin, un gabarit de chemin (dossier connu,
 * nom à trous) ou un nom de fichier seul, éventuellement à trous
 * @param {string} token
 * @returns {{kind: 'path', path: string}|{kind: 'pattern', dir: string|null, name: RegExp}|null}
 */
export function describeToken(token) {
  const dir = tokenDir(token);
  if (dir === undefined) return null;
  const name = token.slice(token.lastIndexOf('/') + 1);
  if (name.includes(HOLE)) return describeTemplate(dir, name);
  if (dir === null) return { kind: 'pattern', dir, name: exactName(name) };
  return { kind: 'path', path: path.posix.join(dir, name) };
}

/**
 * Dossier d'un chemin écrit dans le code
 * @param {string} token
 * @returns {string|null|undefined} null pour un nom seul, undefined pour un dossier
 *   inutilisable (adresse absolue, ou à trous)
 */
function tokenDir(token) {
  const slash = token.lastIndexOf('/');
  if (slash === -1) return null;
  const dir = toSitePath(token.slice(0, slash) || '/');
  return dir === null || dir.includes(HOLE) ? undefined : dir;
}

/**
 * Nom à trous : les fichiers du dossier (ou des images) qui lui correspondent
 * @param {string|null} dir
 * @param {string} name
 * @returns {{kind: 'pattern', dir: string|null, name: RegExp}|null} null si le gabarit
 *   viserait tout un dossier d'images
 */
function describeTemplate(dir, name) {
  if (tooVague(dir, name)) return null;
  const source = name.split(HOLE).map(escapeRegExp).join('[^/]*');
  return { kind: 'pattern', dir, name: new RegExp(`^${source}$`) };
}

const exactName = name => new RegExp(`^${escapeRegExp(name)}$`);

/**
 * Gabarit trop large parmi les images : « ${nom}.png » viserait les 700 images d'un
 * dossier. Ailleurs (traductions), le dossier suffit à le borner.
 */
function tooVague(dir, name) {
  const amongImages = dir === null || dir.startsWith(`/${IMAGE_ROOT}`);
  const literalPart = name.replaceAll(HOLE, '').replace(ASSET, '');
  return amongImages && literalPart.length < MIN_LITERAL_NAME;
}

/** Mots de chemin d'un module, plus les noms de sprites (extension .png) */
function moduleTokens(source) {
  const paths = source.replace(/\$\{[^}]*\}/g, HOLE).match(PATH_TOKEN) ?? [];
  const sprites = [...source.matchAll(SPRITE_CALL)]
    .map(([, , name]) => name.replace(/\$\{[^}]*\}/g, HOLE))
    .map(name => (ASSET.test(name) ? name : `${name}.png`));
  return [...paths, ...sprites];
}

/**
 * Fichiers d'un dossier du dépôt (chemins du site), sous-dossiers compris
 * @param {string} root
 * @param {string} dir - Relatif à la racine, sans barre initiale
 * @returns {string[]}
 */
function filesUnder(root, dir) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full, { withFileTypes: true }).flatMap(entry => {
    const rel = `${dir}/${entry.name}`;
    if (entry.isDirectory()) return filesUnder(root, rel);
    return entry.isFile() ? [`/${rel}`] : [];
  });
}

/** Index des fichiers cherchés : par dossier, et toutes les images d'assets/images */
function createFileIndex(root) {
  const byDir = new Map();
  const listDir = dir => {
    if (!byDir.has(dir)) {
      const full = path.join(root, dir);
      const names = fs.existsSync(full)
        ? fs
            .readdirSync(full, { withFileTypes: true })
            .filter(e => e.isFile())
            .map(e => e.name)
        : [];
      byDir.set(dir, names);
    }
    return byDir.get(dir);
  };
  return { listDir, images: filesUnder(root, IMAGE_ROOT) };
}

/**
 * Chemins du site que désigne un mot : le chemin s'il existe (ou s'il est produit au
 * déploiement), sinon les fichiers dont le nom correspond
 * @returns {string[]}
 */
function resolveToken(root, index, description) {
  if (description.kind === 'path') {
    const { path: sitePath } = description;
    const known = sitePath.startsWith(GENERATED) || fs.existsSync(path.join(root, sitePath));
    return known ? [sitePath] : [];
  }
  const { dir, name } = description;
  if (dir === null) return index.images.filter(file => name.test(path.posix.basename(file)));
  if (dir.startsWith(GENERATED)) return [];
  return index
    .listDir(dir.slice(1))
    .filter(file => name.test(file))
    .map(file => `${dir}/${file}`);
}

function resolveTokens(root, index, tokens) {
  return tokens.flatMap(token => {
    const description = describeToken(token);
    return description ? resolveToken(root, index, description) : [];
  });
}

/** Modules et autres chemins d'un module : imports relatifs, puis littéraux */
function moduleReferences(root, index, modulePath) {
  const source = fs.readFileSync(path.join(root, modulePath), 'utf8');
  const imports = relativeImportSpecifiers(source).map(specifier =>
    path.posix.join(path.posix.dirname(modulePath), specifier)
  );
  return [...imports, ...resolveTokens(root, index, moduleTokens(withoutComments(source)))];
}

/** Polices et images d'une feuille de style, relatives à elle */
function cssReferences(root, cssPath) {
  const source = fs.readFileSync(path.join(root, cssPath), 'utf8');
  return [...source.matchAll(CSS_URL)]
    .map(([, url]) => url.trim())
    .filter(url => !url.startsWith('data:') && ASSET.test(url.split(/[?#]/)[0]))
    .map(url => path.posix.join(path.posix.dirname(cssPath), url.split(/[?#]/)[0]));
}

/** Suit les modules et les feuilles de style de proche en proche, à partir de la page */
function crawl(root, index, start) {
  const found = new Set();
  const queue = [...start];
  while (queue.length > 0) {
    const sitePath = queue.shift();
    if (found.has(sitePath) || NOT_FOR_PLAYERS.has(sitePath) || sitePath === IMAGE_MAP) continue;
    found.add(sitePath);
    if (sitePath.endsWith('.js')) queue.push(...moduleReferences(root, index, sitePath));
    else if (sitePath.endsWith('.css')) queue.push(...cssReferences(root, sitePath));
  }
  return found;
}

/** Références de la page et icônes du manifeste */
function pageReferences(root, index) {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
  const tokens = [
    ...htmlReferences(html).map(toSitePath),
    ...(manifest.icons ?? []).map(icon => toSitePath(icon.src)),
  ].filter(sitePath => sitePath && ASSET.test(sitePath));
  return resolveTokens(root, index, tokens);
}

/** Le premier fond illustré de chaque avatar */
function firstBackgrounds(index) {
  const firsts = new Map();
  const names = index.listDir('img').filter(name => BACKGROUND.test(name));
  names.sort((a, b) => a.localeCompare(b));
  for (const name of names) {
    const [, avatar] = BACKGROUND.exec(name);
    if (!firsts.has(avatar)) firsts.set(avatar, `/img/${name}`);
  }
  return [...firsts.values()];
}

/**
 * Liste de préchargement du dépôt
 * @param {string} [root]
 * @returns {{core: string[], images: string[]}}
 */
export function buildPrecacheList(root = ROOT) {
  const index = createFileIndex(root);
  const found = crawl(root, index, [...SHELL, ...pageReferences(root, index)]);
  const all = [...found, ...firstBackgrounds(index)];
  const isImage = sitePath => IMAGE_FAMILY.test(sitePath) || sitePath.startsWith(GENERATED);
  return {
    core: sortedUnique(all.filter(sitePath => !isImage(sitePath))),
    images: sortedUnique(all.filter(isImage)),
  };
}

/** Chemins sans doublon, dans l'ordre alphabétique (liste stable d'un passage à l'autre) */
function sortedUnique(list) {
  const unique = [...new Set(list)];
  unique.sort((a, b) => a.localeCompare(b));
  return unique;
}

const quoted = list => list.map(item => `  '${item}',`).join('\n');

/**
 * Bloc de sw.js qui porte la liste (mis en forme comme Prettier l'écrit)
 * @param {{core: string[], images: string[]}} list
 * @returns {string}
 */
export function renderPrecacheBlock({ core, images }) {
  return [
    BLOCK_START,
    'const PRECACHE_CORE = [',
    quoted(core),
    '];',
    'const PRECACHE_IMAGES = [',
    quoted(images),
    '];',
    BLOCK_END,
  ].join('\n');
}

/**
 * sw.js avec le bloc remplacé
 * @param {string} source
 * @param {string} block
 * @returns {string}
 */
export function replacePrecacheBlock(source, block) {
  const start = source.indexOf(BLOCK_START);
  const end = source.indexOf(BLOCK_END);
  if (start === -1 || end < start)
    throw new Error(`Bloc de préchargement introuvable dans ${SW_FILE}`);
  return source.slice(0, start) + block + source.slice(end + BLOCK_END.length);
}

/**
 * Octets des fichiers du dépôt d'une liste (une image absente compte 0)
 * @param {string} root
 * @param {string[]} list
 * @returns {number}
 */
export function totalBytes(root, list) {
  return list.reduce((sum, sitePath) => {
    const full = path.join(root, sitePath);
    return sum + (fs.existsSync(full) ? fs.statSync(full).size : 0);
  }, 0);
}

const megabytes = bytes => `${(bytes / 1024 / 1024).toFixed(2)} Mo`;

function summary(list) {
  console.log(`Fichiers : ${list.core.length} (${megabytes(totalBytes(ROOT, list.core))})`);
  const images = megabytes(totalBytes(ROOT, list.images));
  console.log(`Images (originaux du dépôt) : ${list.images.length} (${images})`);
  return 0;
}

function main(args) {
  const list = buildPrecacheList(ROOT);
  if (!args.includes('--write') && !args.includes('--check')) return summary(list);
  const swPath = path.join(ROOT, SW_FILE);
  const current = fs.readFileSync(swPath, 'utf8');
  const next = replacePrecacheBlock(current, renderPrecacheBlock(list));
  if (args.includes('--write')) {
    fs.writeFileSync(swPath, next);
    console.log(`${SW_FILE} : ${list.core.length} fichiers, ${list.images.length} images`);
    return 0;
  }
  if (next === current) return 0;
  console.error(`${SW_FILE} : liste de préchargement périmée (npm run precache:update)`);
  return 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
