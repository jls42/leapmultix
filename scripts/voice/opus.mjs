#!/usr/bin/env node
// Voix en Opus pour l'appli Android : les clips de la voix par défaut d'une langue, refaits en
// Opus (conteneur Ogg) depuis les mêmes bruts et par le même traitement que les MP3 publiés
// (scripts/voice/audio-process.mjs). Seul l'encodeur change : à 24 kb/s, la voix pèse un peu
// plus du tiers de son MP3. Le site garde le MP3 (les iPhone ne lisent l'Opus en Ogg que
// depuis iOS 18.4) : ces clips ne sont jamais publiés, ils ne servent qu'à l'appli.
//
//   node scripts/voice/opus.mjs --out <dépôt des voix> [--lang fr] [--concurrency 8]
//   node scripts/voice/opus.mjs --out <dépôt des voix> --check          (rien n'est écrit)
//   node scripts/voice/opus.mjs --out <dépôt des voix> --site <www>     (pose l'Opus dans un site)
//
// Rangement, dans le dépôt des voix :
//   opus/<langue>/<version>/<empreinte>.ogg   un clip
//   opus/<langue>/<version>.json              d'où vient chaque clip, et de quel MP3
// Un clip n'est refait que si son MP3 a changé, si le débit a changé ou si son fichier manque.
// Un clip dont le brut n'est plus là est réencodé depuis son MP3 (noté « mp3 » au manifeste).
// --site : après la commande « local » de publish.mjs, remplace dans <www>/voice les clips MP3
// de chaque langue par leurs Opus et note « opus » dans l'index du site.

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseVoiceIndex } from '../../js/core/voice-index.js';
import {
  checkAudioTools,
  clipProblem,
  probeClip,
  processClipToOpus,
  transcodeToOpus,
} from './audio-process.mjs';
import {
  flagOption,
  integerOption,
  parseOptions,
  pathOption,
  valueOption,
  assertLangCode,
} from './cli-options.mjs';
import {
  PART,
  clipFile,
  rawExtension,
  rawFile,
  readManifest,
  sha256,
  storePaths,
  synthesisHash,
  writeFileAtomic,
} from './clip-store.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));

/** Débit des clips de l'appli, choisi à l'écoute le 23/11/2026 (32, 24 et 16 kb/s comparés) */
export const OPUS_BITRATE_KBPS = 24;
/** Écart de durée toléré entre un clip en Opus et son MP3 (le MP3 porte un remplissage) */
export const DURATION_TOLERANCE_SECONDS = 0.15;

const OPTIONS = {
  '--out': pathOption('out'),
  '--lang': valueOption('lang'),
  '--site': pathOption('site'),
  '--concurrency': integerOption('concurrency', 1),
  '--check': flagOption('check'),
};

/** Dossier des clips en Opus d'une voix, et son manifeste */
export function opusPaths(outDir, lang, version) {
  const dir = path.join(outDir, 'opus', lang, version);
  return { dir, manifestFile: `${dir}.json` };
}

export const opusFile = (paths, key) => path.join(paths.dir, `${key}.ogg`);

/** Manifeste des clips en Opus d'une voix (vide s'il n'existe pas, ou d'un autre débit) */
export function readOpusManifest(paths, bitrateKbps = OPUS_BITRATE_KBPS) {
  const empty = { bitrateKbps, clips: {} };
  if (!fs.existsSync(paths.manifestFile)) return empty;
  const manifest = JSON.parse(fs.readFileSync(paths.manifestFile, 'utf8'));
  return manifest.bitrateKbps === bitrateKbps ? manifest : empty;
}

/**
 * Ce qu'il reste à faire : les clips à (re)faire, et les fichiers d'empreintes disparues du
 * manifeste des MP3.
 * @param {Object<string, {sha256: string}>} clips - Clips du manifeste des MP3
 * @param {Object<string, {mp3Sha256: string}>} done - Clips du manifeste des Opus
 * @param {(key: string) => boolean} exists - Le fichier Opus de l'empreinte existe-t-il ?
 */
export function planOpus(clips, done, exists) {
  const made = new Map(Object.entries(done));
  const todo = Object.entries(clips)
    .filter(([key, clip]) => made.get(key)?.mp3Sha256 !== clip.sha256 || !exists(key))
    .map(([key]) => key);
  const wanted = new Set(Object.keys(clips));
  return { todo, stale: [...made.keys()].filter(key => !wanted.has(key)) };
}

/** Lance `work` sur chaque élément, `size` à la fois */
function pool(items, size, work) {
  let next = 0;
  const run = async () => {
    if (next >= items.length) return undefined;
    const item = items[next++];
    await work(item);
    return run();
  };
  return Promise.all(Array.from({ length: Math.min(size, items.length) }, run));
}

/** Refait un clip en Opus, depuis son brut s'il est là, sinon depuis son MP3 ; rend sa fiche */
async function encodeOne(voice, key, clip) {
  const raw = rawFile(voice.paths, key, clip.said);
  const from = fs.existsSync(raw) ? 'raw' : 'mp3';
  const out = opusFile(voice.opus, key);
  const part = `${out}${PART}`;
  try {
    if (from === 'raw') await processClipToOpus(raw, part, voice.encoding, OPUS_BITRATE_KBPS);
    else await transcodeToOpus(clipFile(voice.paths, key), part, OPUS_BITRATE_KBPS);
    const info = await probeClip(part);
    const problem =
      clipProblem(info, 'opus') ??
      (Math.abs(info.duration - clip.duration) > DURATION_TOLERANCE_SECONDS
        ? `durée ${info.duration} s, MP3 ${clip.duration} s`
        : null);
    if (problem) throw new Error(`${key} : ${problem}`);
    const data = await fsp.readFile(part);
    await fsp.rename(part, out);
    return { from, mp3Sha256: clip.sha256, bytes: data.length, sha256: sha256(data) };
  } finally {
    await fsp.rm(part, { force: true });
  }
}

/** Voix par défaut d'une langue : ses réglages, ses chemins et son manifeste des MP3 */
function loadVoice(outDir, lang) {
  const voices = JSON.parse(fs.readFileSync(path.join(HERE, 'voices.json'), 'utf8'));
  const voice = new Map(Object.entries(voices)).get(lang);
  if (!voice) throw new Error(`Aucune voix par défaut pour la langue ${lang} (voices.json)`);
  const paths = storePaths(
    outDir,
    lang,
    voice.version,
    synthesisHash(voice),
    rawExtension(voice.sourceFormat)
  );
  const clips = readManifest(paths, lang, voice).clips;
  if (!Object.keys(clips).length)
    throw new Error(`Manifeste vide ou absent : ${paths.manifestFile}`);
  return {
    lang,
    version: voice.version,
    encoding: voice.encoding,
    paths,
    clips,
    opus: opusPaths(outDir, lang, voice.version),
  };
}

const writeOpusManifest = (voice, manifest) =>
  writeFileAtomic(voice.opus.manifestFile, `${JSON.stringify(manifest, null, 1)}\n`);

/** Refait les clips qui manquent, retire ceux qui n'ont plus de MP3 ; rend le manifeste */
async function buildVoice(voice, { concurrency, log }) {
  const manifest = readOpusManifest(voice.opus);
  const done = new Map(Object.entries(manifest.clips));
  const plan = planOpus(voice.clips, manifest.clips, key =>
    fs.existsSync(opusFile(voice.opus, key))
  );
  log(
    `${voice.lang} ${voice.version} : ${plan.todo.length} clips à faire, ${plan.stale.length} à retirer`
  );
  await fsp.mkdir(voice.opus.dir, { recursive: true });
  const clips = new Map(Object.entries(voice.clips));
  const save = () => writeOpusManifest(voice, { ...manifest, clips: Object.fromEntries(done) });
  let made = 0;
  await pool(plan.todo, concurrency, async key => {
    done.set(key, await encodeOne(voice, key, clips.get(key)));
    made += 1;
    if (made % 500 === 0) {
      log(`${voice.lang} : ${made}/${plan.todo.length}`);
      await save();
    }
  });
  await Promise.all(
    plan.stale.map(key => {
      done.delete(key);
      return fsp.rm(opusFile(voice.opus, key), { force: true });
    })
  );
  const sorted = [...done].sort(([a], [b]) => a.localeCompare(b));
  const result = { ...manifest, clips: Object.fromEntries(sorted) };
  if (plan.todo.length || plan.stale.length) await writeOpusManifest(voice, result);
  return result;
}

/**
 * Les clips en Opus d'une voix sont-ils complets et intacts ? Liste des écarts : clip absent
 * du manifeste, fait depuis un autre MP3, fichier manquant ou de contenu différent, fichier
 * en trop dans le dossier.
 */
export async function opusProblems(voice) {
  const manifest = readOpusManifest(voice.opus);
  const made = new Map(Object.entries(manifest.clips));
  const problems = [];
  await Promise.all(
    Object.entries(voice.clips).map(async ([key, clip]) => {
      const entry = made.get(key);
      if (entry?.mp3Sha256 !== clip.sha256) return problems.push(`${key} (à refaire)`);
      const data = await fsp.readFile(opusFile(voice.opus, key)).catch(() => null);
      if (!data || sha256(data) !== entry.sha256)
        problems.push(`${key} (fichier absent ou changé)`);
      return undefined;
    })
  );
  const wanted = new Set(Object.keys(voice.clips).map(key => `${key}.ogg`));
  const present = fs.existsSync(voice.opus.dir) ? fs.readdirSync(voice.opus.dir) : [];
  problems.push(...present.filter(name => !wanted.has(name)).map(name => `${name} (en trop)`));
  return problems;
}

/** Résumé d'une voix : nombre de clips, poids, clips refaits depuis leur MP3 faute de brut */
function summary(voice, manifest) {
  const entries = Object.values(manifest.clips);
  const megabytes = bytes => (bytes / 1024 / 1024).toFixed(1);
  const mp3 = Object.values(voice.clips).reduce((total, clip) => total + clip.bytes, 0);
  const opus = entries.reduce((total, clip) => total + clip.bytes, 0);
  const fromMp3 = entries.filter(clip => clip.from === 'mp3').length;
  return (
    `${voice.lang} ${voice.version} : ${entries.length} clips, ${megabytes(opus)} Mo en Opus ` +
    `(${megabytes(mp3)} Mo en MP3, ${Math.round((100 * opus) / mp3)} %), ${fromMp3} depuis leur MP3`
  );
}

/**
 * Pose les clips en Opus d'une voix dans un site (celui de l'appli) : le dossier de la version
 * devient un lien vers les Opus, et l'index du site annonce le format « opus ».
 */
export async function placeInSite(site, voice) {
  const indexFile = path.join(site, 'voice', 'index.json');
  const index = parseVoiceIndex(JSON.parse(fs.readFileSync(indexFile, 'utf8')));
  const entry = index?.languages[voice.lang];
  if (entry?.version !== voice.version) {
    throw new Error(
      `${indexFile} : la langue ${voice.lang} n'y est pas en version ${voice.version} ` +
        '(lancer d’abord publish.mjs local)'
    );
  }
  const target = path.join(site, 'voice', voice.lang, voice.version);
  await fsp.rm(target, { recursive: true, force: true });
  await fsp.symlink(voice.opus.dir, target);
  const languages = { ...index.languages, [voice.lang]: { ...entry, format: 'opus' } };
  const written = { ...index, languages };
  if (!parseVoiceIndex(written)?.languages[voice.lang]) throw new Error('index refusé par le jeu');
  await writeFileAtomic(indexFile, `${JSON.stringify(written, null, 2)}\n`);
}

async function runLanguage(lang, options, log) {
  assertLangCode(lang);
  const voice = loadVoice(options.out, lang);
  const manifest = options.check
    ? readOpusManifest(voice.opus)
    : await buildVoice(voice, { ...options, log });
  const problems = await opusProblems(voice);
  if (problems.length) {
    throw new Error(
      `${lang} ${voice.version} : ${problems.length} écarts, dont ${problems.slice(0, 5).join(', ')}` +
        (options.check ? ' ; lancer node scripts/voice/opus.mjs sans --check' : '')
    );
  }
  log(summary(voice, manifest));
  if (options.site) await placeInSite(options.site, voice);
}

export async function main(argv, { log = console.log } = {}) {
  const options = parseOptions(argv, OPTIONS, { concurrency: 8 });
  if (!options.out) throw new Error('--out <dépôt des voix> est requis');
  if (!options.check) await checkAudioTools({ opus: true });
  const langs = options.lang ? [options.lang] : ['fr', 'en', 'es'];
  await langs.reduce(
    (previous, lang) => previous.then(() => runLanguage(lang, options, log)),
    Promise.resolve()
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
