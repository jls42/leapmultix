// Rangement des clips d'une voix dans le dépôt privé des voix :
//
//   clips/<langue>/<version>/<empreinte>.mp3   clips traités, ceux que le jeu lit
//   raw/<langue>/<réglages>/<empreinte>-<h>.mp3 sortie brute de la synthèse (h : empreinte
//                                              du texte dit), gardée pour retraiter sans payer ;
//                                              <réglages> : empreinte des seuls réglages de
//                                              synthèse, si bien qu'une nouvelle version qui
//                                              ne change que l'encodage retrouve ses bruts
//   manifests/<langue>/<version>.json          phrase, texte dit et contrôle de chaque clip
//   ecoute/avant/<langue>/<version>/<empreinte>.mp3
//                                              dernier clip remplacé (--redo, texte dit
//                                              changé), gardé en local (hors git) pour la
//                                              comparaison avant/après de listen-page.mjs
//
// Un fichier n'apparaît sous son nom final qu'une fois complet : on écrit un « .part »,
// puis on renomme. Les « .part » restants sont les traces d'une exécution interrompue, que
// cleanLeftovers supprime.

import crypto from 'node:crypto';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { VOICE_KEY_SCHEMA } from '../../js/core/spoken-text.js';
import { ClipContentError } from './audio-process.mjs';

export const PART = '.part';

/** Champs d'une voix qui ne changent pas le son : les modifier ne demande pas de version */
const DESCRIPTIVE_FIELDS = new Set(['version', 'voice', 'publicOwnerId', 'lang']);

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    const keys = Object.keys(value).sort((a, b) => a.localeCompare(b));
    const members = keys.map(k => `${JSON.stringify(k)}:${canonicalJson(value[k])}`);
    return `{${members.join(',')}}`;
  }
  return JSON.stringify(value);
}

export function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/** Champs de l'encodage : ils ne changent pas le brut de la synthèse */
const ENCODING_FIELDS = new Set(['encoding']);

/**
 * Empreinte des seuls réglages de synthèse (voix, modèle, réglages, format du brut) : le
 * dossier des bruts en dépend, pas de l'encodage des clips.
 * @param {Object} voice
 * @returns {string}
 */
export function synthesisHash(voice) {
  const synthesis = Object.fromEntries(
    Object.entries(voice).filter(
      ([key]) => !DESCRIPTIVE_FIELDS.has(key) && !ENCODING_FIELDS.has(key)
    )
  );
  return `s-${sha256(canonicalJson(synthesis)).slice(0, 12)}`;
}

/**
 * Empreinte des réglages qui font le son d'une voix. Une version de voix n'a qu'un jeu de
 * réglages : les changer impose une nouvelle version dans voices.json.
 * @param {Object} voice
 * @returns {string}
 */
export function voiceConfigHash(voice) {
  const sound = Object.fromEntries(
    Object.entries(voice).filter(([key]) => !DESCRIPTIVE_FIELDS.has(key))
  );
  return sha256(canonicalJson(sound)).slice(0, 16);
}

/** Empreinte courte du texte dit, dans le nom du fichier brut */
export function saidHash(said) {
  return sha256(said).slice(0, 12);
}

/**
 * @param {string} outDir - Racine du dépôt privé des voix
 * @param {string} lang
 * @param {string} version
 * @param {string} [rawKey] - Dossier des bruts (synthesisHash) ; par défaut la version
 */
export function storePaths(outDir, lang, version, rawKey = version) {
  return {
    rawDir: path.join(outDir, 'raw', lang, rawKey),
    legacyRawDir: path.join(outDir, 'raw', lang, version),
    clipDir: path.join(outDir, 'clips', lang, version),
    manifestFile: path.join(outDir, 'manifests', lang, `${version}.json`),
    runLogFile: path.join(outDir, 'manifests', lang, `${version}.runs.jsonl`),
    lockFile: path.join(outDir, 'manifests', lang, `${version}.lock`),
    replacedDir: path.join(outDir, 'ecoute', 'avant', lang, version),
  };
}

export const clipFile = (paths, key) => path.join(paths.clipDir, `${key}.mp3`);
export const replacedFile = (paths, key) => path.join(paths.replacedDir, `${key}.mp3`);
export const rawFile = (paths, key, said) =>
  path.join(paths.rawDir, `${key}-${saidHash(said)}.mp3`);

/**
 * Met de côté le clip d'une empreinte avant qu'il soit refait : la page d'écoute compare
 * l'ancien et le nouveau. Seul le dernier remplacé est gardé. Même dépôt, donc même
 * disque : un simple renommage.
 * @returns {Promise<boolean>} true si un clip a été mis de côté
 */
export async function keepReplaced(paths, key) {
  if (!fs.existsSync(clipFile(paths, key))) return false;
  await fsp.mkdir(paths.replacedDir, { recursive: true });
  await fsp.rename(clipFile(paths, key), replacedFile(paths, key));
  return true;
}

/** Clé d'un fichier brut : « <empreinte>-<h>.mp3 » */
export function rawKeyOf(fileName) {
  const match = /^([0-9a-z]+)-([0-9a-f]{12})\.mp3$/.exec(fileName);
  return match ? { key: match[1], hash: match[2] } : null;
}

function listDir(dir) {
  return fs.existsSync(dir) ? fs.readdirSync(dir) : [];
}

/**
 * Supprime les fichiers « .part » laissés par une exécution interrompue
 * @returns {Promise<string[]>} fichiers supprimés
 */
export async function cleanLeftovers(paths, { dryRun = false } = {}) {
  const removed = [];
  for (const dir of [paths.rawDir, paths.clipDir, path.dirname(paths.manifestFile)]) {
    for (const name of listDir(dir).filter(n => n.endsWith(PART))) {
      removed.push(path.join(dir, name));
      if (!dryRun) await fsp.rm(path.join(dir, name), { force: true });
    }
  }
  return removed;
}

function isAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === 'EPERM';
  }
}

/**
 * Verrou d'une version de voix : deux générations simultanées paieraient deux fois et se
 * gêneraient (le nettoyage de l'une effacerait les fichiers en cours de l'autre). Un verrou
 * dont le processus n'existe plus est repris.
 * @returns {Promise<{release: () => Promise<void>}>}
 */
export async function acquireLock(paths, { pid = process.pid, alive = isAlive } = {}) {
  await fsp.mkdir(path.dirname(paths.lockFile), { recursive: true });
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const handle = await fsp.open(paths.lockFile, 'wx');
      await handle.writeFile(`${pid}\n`);
      await handle.close();
      return { release: () => fsp.rm(paths.lockFile, { force: true }) };
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      const owner = Number((await fsp.readFile(paths.lockFile, 'utf8').catch(() => '')).trim());
      if (owner && alive(owner)) {
        throw new Error(`Une génération tourne déjà (processus ${owner}) : attendre sa fin`);
      }
      await fsp.rm(paths.lockFile, { force: true });
    }
  }
  throw new Error(`Verrou impossible à prendre : ${paths.lockFile}`);
}

/**
 * Bruts rangés sous l'ancien nom (la version) : déplacés sous l'empreinte des réglages de
 * synthèse, une fois, pour qu'une autre version les retrouve
 * @returns {Promise<number>} fichiers déplacés
 */
export async function migrateLegacyRaw(paths, legacyRawDir = paths.legacyRawDir) {
  if (legacyRawDir === paths.rawDir || !fs.existsSync(legacyRawDir)) return 0;
  await fsp.mkdir(paths.rawDir, { recursive: true });
  let moved = 0;
  for (const name of listDir(legacyRawDir)) {
    const target = path.join(paths.rawDir, name);
    if (!fs.existsSync(target)) {
      await fsp.rename(path.join(legacyRawDir, name), target);
      moved++;
    }
  }
  if (!listDir(legacyRawDir).length) await fsp.rmdir(legacyRawDir);
  return moved;
}

/** Écrit un fichier en entier sous un nom temporaire, puis le renomme */
export async function writeFileAtomic(file, data) {
  await fsp.mkdir(path.dirname(file), { recursive: true });
  const part = `${file}${PART}`;
  await fsp.writeFile(part, data);
  await fsp.rename(part, file);
}

export function newManifest(lang, voice) {
  return {
    schema: VOICE_KEY_SCHEMA,
    lang,
    version: voice.version,
    config: voiceConfigHash(voice),
    clips: {},
  };
}

/**
 * Manifeste d'une version de voix (nouveau s'il n'existe pas). Refuse un manifeste écrit
 * avec d'autres réglages ou un autre schéma d'empreinte.
 */
export function readManifest(paths, lang, voice) {
  if (!fs.existsSync(paths.manifestFile)) return newManifest(lang, voice);
  const manifest = JSON.parse(fs.readFileSync(paths.manifestFile, 'utf8'));
  if (manifest.schema !== VOICE_KEY_SCHEMA) {
    throw new Error(
      `Schéma d'empreinte ${manifest.schema} ≠ ${VOICE_KEY_SCHEMA} : nouvelle version`
    );
  }
  if (manifest.config !== voiceConfigHash(voice)) {
    throw new Error(
      `Les réglages de la voix ${voice.version} ont changé depuis ses premiers clips : ` +
        'donner une nouvelle version dans scripts/voice/voices.json'
    );
  }
  return manifest;
}

/** Écrit le manifeste, clips triés par empreinte (diffs stables) */
export async function writeManifest(paths, manifest) {
  const clips = Object.fromEntries(
    Object.keys(manifest.clips)
      .sort((a, b) => a.localeCompare(b))
      .map(key => [key, manifest.clips[key]])
  );
  await writeFileAtomic(paths.manifestFile, `${JSON.stringify({ ...manifest, clips }, null, 2)}\n`);
}

/** Entrées du manifeste : sans fichier, retirées ; d'un autre texte dit, clip mis de côté */
async function pruneEntries({ paths, manifest, phrasesByKey, said, keep, report }) {
  for (const [key, entry] of Object.entries(manifest.clips)) {
    const phrase = phrasesByKey.get(key);
    if (!fs.existsSync(clipFile(paths, key))) {
      report.dropped++;
      delete manifest.clips[key];
    } else if (phrase && entry.said !== said(phrase.text)) {
      report.stale++;
      await keep(key);
      delete manifest.clips[key];
    }
  }
}

/** Clips complets sans entrée : repris s'ils sont valides, supprimés sinon (orphelins gardés) */
async function adoptUnlistedClips({
  paths,
  manifest,
  phrasesByKey,
  said,
  inspect,
  remove,
  report,
}) {
  for (const name of listDir(paths.clipDir).filter(n => n.endsWith('.mp3'))) {
    const key = name.slice(0, -'.mp3'.length);
    if (manifest.clips[key]) continue;
    const phrase = phrasesByKey.get(key);
    if (!phrase) {
      report.orphans++;
      continue;
    }
    // Seul un contenu jugé mauvais est rejeté ; une panne d'outil (ffprobe absent) arrête tout
    const entry = await inspect(clipFile(paths, key)).catch(error => {
      if (error instanceof ClipContentError) return null;
      throw error;
    });
    if (entry) {
      report.adopted++;
      manifest.clips[key] = {
        text: phrase.text,
        said: said(phrase.text),
        ...entry,
        requestId: null,
      };
    } else {
      report.rejected++;
      await remove(clipFile(paths, key));
    }
  }
}

/** Bruts d'un autre texte dit, ou d'une phrase sortie du corpus : supprimés */
async function pruneStaleRaw({ paths, phrasesByKey, said, remove, report }) {
  for (const name of listDir(paths.rawDir)) {
    const parsed = rawKeyOf(name);
    const phrase = parsed && phrasesByKey.get(parsed.key);
    if (!phrase || parsed.hash !== saidHash(said(phrase.text))) {
      report.staleRaw++;
      await remove(path.join(paths.rawDir, name));
    }
  }
}

/**
 * Remet le manifeste d'accord avec les fichiers, avant une génération :
 * - entrée sans fichier : retirée ;
 * - clip dont le texte dit a changé (règles de prononciation) : mis de côté (keepReplaced),
 *   à refaire ;
 * - clip complet sans entrée (arrêt entre le renommage et l'écriture du manifeste) :
 *   repris s'il est valide, supprimé sinon ;
 * - fichier brut d'un autre texte dit, ou d'une phrase sortie du corpus : supprimé.
 * Les clips hors corpus restent (orphelins, signalés par check.mjs). En dryRun, seul le
 * manifeste en mémoire change : aucun fichier n'est touché.
 * @returns {Promise<{dropped: number, stale: number, adopted: number, rejected: number, staleRaw: number, orphans: number}>}
 */
export async function reconcile({ paths, manifest, phrasesByKey, said, inspect, dryRun = false }) {
  const report = { dropped: 0, stale: 0, adopted: 0, rejected: 0, staleRaw: 0, orphans: 0 };
  const remove = async file => {
    if (!dryRun) await fsp.rm(file, { force: true });
  };
  const keep = async key => {
    if (!dryRun) await keepReplaced(paths, key);
  };
  const ctx = { paths, manifest, phrasesByKey, said, inspect, remove, keep, report };
  await pruneEntries(ctx);
  await adoptUnlistedClips(ctx);
  await pruneStaleRaw(ctx);
  return report;
}
