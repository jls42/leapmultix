#!/usr/bin/env node
// Copie du site rapatriée du bucket par pull-from-s3.sh, contrôlée avant toute écriture dans
// le dépôt : aux changements de deploy.sh près, elle doit être celle des fichiers suivis de
// HEAD. Sinon, rien n'est écrit : un module modifié dans le bucket ne doit jamais arriver
// dans l'arbre de travail, où les tests l'exécuteraient.
//
// 1. Les changements de deploy.sh sont défaits sur la copie : version dans les adresses des
//    modules et d'index.html (unversionSite de scripts/version-module-urls.mjs), domaine
//    Plausible et adresse de la voix enregistrée (balises meta d'index.html).
// 2. Chaque fichier est comparé à git par son empreinte d'objet :
//    - suivi dans HEAD : identique, ou différent ;
//    - image générée (assets/generated-images/, ignoré par git) : à restaurer ;
//    - tout autre fichier hors de git, ou qui n'est pas un fichier ordinaire : refusé.
// 3. Une seule différence arrête tout. Sinon, --restore copie dans le dépôt les images
//    générées ; les fichiers suivis, identiques, ne sont pas touchés.
//
// Usage : node scripts/check-s3-copy.mjs <copie rapatriée> [--restore]

import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { unversionSite } from './version-module-urls.mjs';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const APP_VERSION_LINE = /^export const APP_VERSION = '([^']*)';$/m;
const PLAUSIBLE_META = /(<meta name="plausible-domain" content=")[^"]*(")/;
const VOICE_META_DEPLOYED = '<meta name="leapmultix-voice-base" content="/voice/" />';
const VOICE_META_REPO = '<meta name="leapmultix-voice-base" content="" />';

/** Seuls fichiers hors de git que l'on reprend du bucket : les images que la CI génère */
const RESTORABLE_DIR = 'assets/generated-images/';

/** Nom de fichier lisible tel quel : aucun caractère de contrôle (saut de ligne…) */
// eslint-disable-next-line no-control-regex -- les caractères de contrôle sont justement ce que l'on refuse
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;

/** Version que deploy.sh a écrite dans les adresses : APP_VERSION de la copie */
export function deployedVersion(copyDir) {
  const file = path.join(copyDir, 'js/cache-updater.js');
  if (!fs.existsSync(file)) return null;
  return APP_VERSION_LINE.exec(fs.readFileSync(file, 'utf8'))?.[1] ?? null;
}

/** Balises meta d'index.html remises comme dans le dépôt */
export function restoreDeployMetas(html) {
  return html
    .replace(PLAUSIBLE_META, '$1{{PLAUSIBLE_DOMAIN}}$2')
    .replace(VOICE_META_DEPLOYED, VOICE_META_REPO);
}

/** Défait sur la copie ce que deploy.sh change aux fichiers du dépôt ; rend la version */
export function undoDeployChanges(copyDir) {
  const version = deployedVersion(copyDir);
  if (!version) throw new Error('APP_VERSION introuvable dans js/cache-updater.js de la copie');
  unversionSite(copyDir, version);
  const page = path.join(copyDir, 'index.html');
  fs.writeFileSync(page, restoreDeployMetas(fs.readFileSync(page, 'utf8')));
  return version;
}

/** Entrées d'un dossier, chemins relatifs à la manière de git (« / ») */
function listEntries(dir, prefix = '') {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const relative = prefix + entry.name;
    if (entry.isDirectory() && !entry.isSymbolicLink()) {
      return listEntries(path.join(dir, entry.name), `${relative}/`);
    }
    return [{ file: relative, regular: entry.isFile() }];
  });
}

const GIT_OPTIONS = { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 };

function git(rootDir, args, input) {
  // git du poste, trouvé dans le PATH comme aws et node par pull-from-s3.sh, que le propriétaire
  // lance dans son propre environnement : la règle S4036 (PATH modifiable) est ici sans objet
  return execFileSync('git', args, { ...GIT_OPTIONS, cwd: rootDir, input }); // NOSONAR
}

/** Objets des fichiers suivis de HEAD : chemin → empreinte */
function trackedObjects(rootDir) {
  const lines = git(rootDir, ['ls-tree', '-r', '-z', 'HEAD']).split('\0').filter(Boolean);
  return new Map(
    lines.map(line => {
      const [meta, file] = line.split('\t');
      return [file, meta.split(' ')[2]];
    })
  );
}

/** Chemins non suivis que .gitignore écarte */
function ignoredPaths(rootDir, files) {
  if (files.length === 0) return new Set();
  // check-ignore répond 1 quand aucun chemin n'est ignoré : ce n'est pas une erreur
  try {
    const out = git(rootDir, ['check-ignore', '-z', '--stdin'], `${files.join('\0')}\0`);
    return new Set(out.split('\0').filter(Boolean));
  } catch (error) {
    if (error.status === 1) return new Set();
    throw error;
  }
}

/** Empreinte d'objet git d'un contenu, au format du dépôt (sha1 ou sha256) */
function objectId(content, format) {
  return crypto.createHash(format).update(`blob ${content.length}\0`).update(content).digest('hex');
}

/** Sort d'une entrée de la copie : refusée, hors de git, identique à HEAD ou différente */
function classify(copyDir, { file, regular }, tracked, format) {
  if (!regular || CONTROL_CHARACTERS.test(file)) return 'refused';
  if (!tracked.has(file)) return 'untracked';
  const id = objectId(fs.readFileSync(path.join(copyDir, file)), format);
  return id === tracked.get(file) ? 'same' : 'different';
}

/**
 * Compare la copie (déjà ramenée à la forme du dépôt) aux fichiers de git
 * @returns {{same: string[], different: string[], refused: string[], restorable: string[]}}
 */
export function compareWithGit(copyDir, rootDir = ROOT_DIR) {
  const format = git(rootDir, ['rev-parse', '--show-object-format']).trim();
  const tracked = trackedObjects(rootDir);
  const lists = new Map(['same', 'different', 'refused', 'untracked'].map(name => [name, []]));
  for (const entry of listEntries(copyDir)) {
    lists.get(classify(copyDir, entry, tracked, format)).push(entry.file);
  }
  const ignored = ignoredPaths(rootDir, lists.get('untracked'));
  const refused = lists.get('refused');
  const restorable = [];
  for (const file of lists.get('untracked')) {
    (file.startsWith(RESTORABLE_DIR) && ignored.has(file) ? restorable : refused).push(file);
  }
  return { same: lists.get('same'), different: lists.get('different'), refused, restorable };
}

/** Copie dans le dépôt les images générées (les fichiers suivis sont identiques) */
export function restoreGenerated(copyDir, files, rootDir = ROOT_DIR) {
  for (const file of files) {
    const target = path.join(rootDir, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(copyDir, file), target);
  }
}

function printList(title, files) {
  if (files.length === 0) return;
  console.error(`${title} (${files.length}) :`);
  for (const file of files.slice(0, 50)) console.error(`  ${JSON.stringify(file)}`);
  if (files.length > 50) console.error(`  … et ${files.length - 50} autres`);
}

function main(args) {
  const copyDir = args.find(arg => !arg.startsWith('--'));
  if (!copyDir) {
    console.error('Usage : node scripts/check-s3-copy.mjs <copie rapatriée> [--restore]');
    return 1;
  }
  // Avant toute transformation : réécrire la copie ne doit jamais passer par un lien
  const irregular = listEntries(copyDir).filter(entry => !entry.regular);
  if (irregular.length > 0) {
    printList(
      'Entrées qui ne sont pas des fichiers ordinaires',
      irregular.map(entry => entry.file)
    );
    console.error('Rien n’est écrit dans le dépôt : copie refusée.');
    return 1;
  }
  const version = undoDeployChanges(copyDir);
  const head = git(ROOT_DIR, ['rev-parse', '--short', 'HEAD']).trim();
  const result = compareWithGit(copyDir);
  console.log(`Copie comparée à HEAD (${head}), version ${version} retirée des adresses :`);
  console.log(`  ${result.same.length} fichiers suivis identiques`);
  console.log(`  ${result.restorable.length} images générées (ignorées par git)`);
  printList('Fichiers suivis différents de HEAD', result.different);
  printList('Fichiers inconnus de git ou refusés', result.refused);
  if (result.different.length > 0 || result.refused.length > 0) {
    console.error('Rien n’est écrit dans le dépôt : le bucket ne correspond pas à git.');
    return 1;
  }
  if (args.includes('--restore')) {
    restoreGenerated(copyDir, result.restorable);
    console.log(`${result.restorable.length} images générées restaurées dans le dépôt`);
  }
  return 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
