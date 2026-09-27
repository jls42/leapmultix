#!/usr/bin/env node
// Banc d'écoute : des voix candidates disent un échantillon des vraies phrases du jeu, à côté
// des voix déjà publiées (références), sur une page à publier en artifact. Le propriétaire y
// écoute sur son téléphone et choisit ; son choix reste dans le stockage partagé de la page
// (document choix/<id>), que Claude relit.
//
// Un banc se décrit dans un fichier JSON (scripts/voice/benches/<id>.json, voir
// docs/voix-enregistree.md) : langue, voix dans l'ordre de la page, questions. Une voix avec
// « provider » est candidate (réglages comme dans voices.json) ; une voix avec « version » est
// une référence, lue dans le dépôt privé des voix. Les clips des candidates sont traités comme
// ceux du jeu (encodage de la langue), puis Whisper transcrit toutes les voix : la page donne
// le débit de chacune et ce que Whisper a entendu de travers.
//
// Usage :
//   node --env-file=<fichier .env> scripts/voice/bench.mjs --config <banc.json> [options]
//     --dry-run               phrases et caractères à payer, sans appel ni écriture
//     --max-total-chars <n>   caractères payés au plus pour ce banc, relances comprises
//                             (registre billed.jsonl) ; obligatoire dès qu'il faut payer
//     --out <dossier>         dossier du banc (défaut : <dépôt des voix>/bancs/<id>)
//     --voices-repo <dossier> dépôt privé des voix (défaut : ../leapmultix-voices)
//     --python <interpréteur> Whisper (défaut : .venv-whisper/bin/python du dossier courant)
//     --skip-whisper          aucune transcription : la page ne dit rien des doutes
//   node --env-file=<fichier .env> scripts/voice/bench.mjs --list-voices google --language-code fr-FR
//     voix Google d'une langue, avec leur genre (appel gratuit)
// Écrit dans le dossier du banc : clips/<voix>/<empreinte>.mp3, raw/ (bruts payés, jamais
// rachetés), billed.jsonl, manifests/, transcripts.jsonl, index.html et files.json (fichiers
// à joindre à l'artifact). Clé du fournisseur de chaque candidate en variable d'environnement,
// jamais écrite ni affichée.
// Codes de sortie : 0 fait, 1 erreur, 3 plafond insuffisant (aucun appel fait).

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildCorpus } from './corpus.mjs';
import { hasAgreement, saidText, voiceSaidText } from './said-text.mjs';
import { checkAudioTools, processClip, probeClip } from './audio-process.mjs';
import { compareTranscript } from './transcript-compare.mjs';
import { readTranscripts } from './check.mjs';
import { ProviderError } from './providers/common.mjs';
import { createGoogle } from './providers/google.mjs';
import {
  billedChars,
  rawExtension,
  recordBilled,
  saidHash,
  sha256,
  synthesisHash,
  writeFileAtomic,
} from './clip-store.mjs';
import {
  DEFAULT_OUT,
  FAMILY_ORDER,
  OPERATOR_ORDER,
  PROVIDER_NAMES,
  RETRY_DELAYS_MS,
  loadVoice,
  loadVoiceVersion,
  openProvider,
  withRetries,
} from './generate.mjs';
import { runWhisper } from './review.mjs';
import { buildBenchPage } from './bench-page.mjs';
import {
  assertLangCode,
  flagOption,
  integerOption,
  parseOptions,
  pathOption,
  valueOption,
  wholeNumber,
} from './cli-options.mjs';

/** Phrases d'un banc, par défaut : quelques minutes d'écoute par voix */
export const DEFAULT_SIZE = 22;

/** Fichiers joints à un envoi d'artifact : 255 au plus, la page comprise */
export const FILES_PER_PUBLISH = 250;

/** Format du brut par fournisseur, quand le banc ne le donne pas */
const DEFAULT_SOURCE_FORMAT = { google: 'wav', mistral: 'mp3', elevenlabs: 'mp3_44100_128' };

/** Identifiant d'un banc, d'une voix, d'une question : il nomme des dossiers et des champs */
const SLUG = /^[a-z0-9][a-z0-9-]{0,39}$/;

/**
 * Pièges d'une langue, pris avant l'échantillon des familles : ce qu'une voix dit le plus
 * souvent de travers (accords « une fois 7 », « 11 », nombres à trois chiffres, long énoncé)
 */
const TRAPS = [
  { count: 2, test: (phrase, lang) => hasAgreement(phrase.text, lang) },
  { count: 1, test: phrase => phrase.family === 'question' && /\b11\b/.test(phrase.text) },
  { count: 1, test: phrase => /\b\d{3}\b/.test(phrase.text) },
  { count: 1, test: phrase => phrase.family === 'énoncé', longest: true },
];

/** Plafond insuffisant : rien n'a été appelé */
export class CapError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CapError';
  }
}

const charCount = text => [...text].length;

function requireText(value, field) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`Banc : « ${field} » manquant`);
  return value;
}

function requireSlug(value, field) {
  if (typeof value !== 'string' || !SLUG.test(value)) {
    throw new Error(`Banc : « ${field} » en minuscules, chiffres et tirets (reçu : ${value})`);
  }
  return value;
}

/** Voix candidate : réglages de synthèse, et l'encodage des clips de la langue */
function candidateVoice(entry, lang, encoding) {
  const { slug, name, note, provider, voiceId, ...rest } = entry;
  if (!PROVIDER_NAMES.includes(provider)) {
    throw new Error(`Banc : fournisseur inconnu pour ${slug} : ${provider}`);
  }
  requireText(voiceId, `${slug}.voiceId`);
  const voice = {
    sourceFormat: DEFAULT_SOURCE_FORMAT[provider],
    settings: {},
    ...rest,
    provider,
    voiceId,
    version: `banc-${slug}`,
    encoding,
  };
  if (provider === 'google') voice.languageCode ??= voiceId.split('-').slice(0, 2).join('-');
  else requireText(voice.model, `${slug}.model`);
  return { slug, name, note, kind: 'candidate', voice: { ...voice, lang } };
}

/** Voix d'un banc : candidate (« provider ») ou référence publiée (« version ») */
function benchVoice(entry, lang, encoding) {
  const slug = requireSlug(entry?.slug, 'voices.slug');
  requireText(entry.name, `${slug}.name`);
  if (entry.version && entry.provider) {
    throw new Error(`Banc : ${slug} a « provider » et « version », une voix est l'un ou l'autre`);
  }
  if (!entry.version) return candidateVoice(entry, lang, encoding);
  const { name, note } = entry;
  return { slug, name, note, kind: 'reference', voice: loadVoiceVersion(lang, entry.version) };
}

function benchQuestion(entry) {
  const id = requireSlug(entry?.id, 'questions.id');
  requireText(entry.legend, `${id}.legend`);
  if (!Array.isArray(entry.options) || entry.options.length < 2) {
    throw new Error(`Banc : la question ${id} demande au moins deux réponses`);
  }
  const options = entry.options.map(option => ({
    value: requireSlug(option?.value, `${id}.value`),
    label: requireText(option.label, `${id}.label`),
  }));
  return { id, legend: entry.legend, options };
}

function assertUnique(values, what) {
  const seen = new Set();
  for (const value of values) {
    if (seen.has(value)) throw new Error(`Banc : ${what} « ${value} » en double`);
    seen.add(value);
  }
}

function benchVoices(config, lang) {
  const encoding = loadVoice(lang).encoding;
  const voices = (config.voices ?? []).map(entry => benchVoice(entry, lang, encoding));
  if (!voices.some(voice => voice.kind === 'candidate')) {
    throw new Error('Banc : aucune voix candidate (une voix avec « provider »)');
  }
  assertUnique(
    voices.map(voice => voice.slug),
    'voix'
  );
  return voices;
}

function benchQuestions(config) {
  const questions = (config.questions ?? []).map(benchQuestion);
  assertUnique(
    questions.map(question => question.id),
    'question'
  );
  return questions;
}

function benchInclude(include = []) {
  if (!Array.isArray(include) || include.some(text => typeof text !== 'string')) {
    throw new Error('Banc : « include » est une liste de phrases du corpus');
  }
  return include;
}

/** Textes facultatifs de la page, et leur valeur sans le fichier du banc */
const TEXT_DEFAULTS = { intro: '', question: 'Quelle voix retenir ?', none: 'Aucune', note: '' };

/** Textes de la page ; seuls le nom et le titre sont obligatoires */
function pageTexts(config) {
  const optional = Object.entries(TEXT_DEFAULTS).map(([field, fallback]) => {
    const text = Object.hasOwn(config, field) ? config[field] : fallback;
    return [field, typeof text === 'string' ? text : fallback];
  });
  return {
    ...Object.fromEntries(optional),
    name: requireText(config.name, 'name'),
    title: requireText(config.title, 'title'),
  };
}

/**
 * Banc validé d'après son fichier : voix, questions et textes de la page
 * @param {Object} config - Contenu du fichier du banc
 */
export function benchSetup(config) {
  const id = requireSlug(config?.id, 'id');
  const { lang } = config;
  assertLangCode(lang);
  return {
    id,
    lang,
    voices: benchVoices(config, lang),
    questions: benchQuestions(config),
    size: config.size === undefined ? DEFAULT_SIZE : wholeNumber(config.size, 'size', 1),
    include: benchInclude(config.include),
    texts: pageTexts(config),
  };
}

/**
 * count éléments d'une liste, pris au milieu de tranches égales : le corpus commence par
 * « 1 fois 1 », un tirage depuis le début y reviendrait sans cesse
 */
export function centered(list, count) {
  if (count >= list.length) return [...list];
  const step = list.length / count;
  return Array.from({ length: count }, (_, index) => list[Math.floor((index + 0.5) * step)]);
}

/** Phrases qu'un piège vise, hors celles déjà prises */
function trapPhrases(corpus, lang, trap, taken) {
  const hits = corpus.filter(phrase => !taken.has(phrase.key) && trap.test(phrase, lang));
  if (!trap.longest) return centered(hits, trap.count);
  return hits.sort((a, b) => b.text.length - a.text.length).slice(0, trap.count);
}

/** Part de chaque liste dans la place qui reste : une chacune, tour à tour */
function shares(lists, room) {
  const counts = lists.map(() => 0);
  let left = room;
  while (left > 0 && counts.some((count, index) => count < lists[index].length)) {
    lists.forEach((list, index) => {
      if (left > 0 && counts[index] < list.length) {
        counts[index]++;
        left--;
      }
    });
  }
  return counts;
}

/** Phrases d'une famille par opération, multiplication d'abord : les calculs varient */
function byOperation(list) {
  const groups = OPERATOR_ORDER.map(operator =>
    list.filter(phrase => phrase.operator === operator)
  );
  groups.push(list.filter(phrase => !OPERATOR_ORDER.includes(phrase.operator)));
  return groups.filter(group => group.length);
}

function fillFamilies(corpus, taken, size) {
  const families = FAMILY_ORDER.map(family =>
    corpus.filter(phrase => phrase.family === family && !taken.has(phrase.key))
  ).filter(list => list.length);
  const quotas = shares(families, size - taken.size);
  families.forEach((list, index) => {
    const groups = byOperation(list);
    const counts = shares(groups, quotas[index]);
    groups.forEach((group, rank) => {
      for (const phrase of centered(group, counts[rank])) taken.set(phrase.key, phrase);
    });
  });
}

/**
 * Phrases d'un banc : celles demandées (include), les pièges de la langue, puis un
 * échantillon régulier de chaque famille ; rangées par famille, dans l'ordre du corpus
 * @param {Array<{key: string, text: string, family: string}>} corpus
 * @param {string} lang
 * @param {{size?: number, include?: string[]}} [options]
 * @returns {Array<{key: string, text: string, family: string, said: string}>}
 */
export function benchPhrases(corpus, lang, { size = DEFAULT_SIZE, include = [] } = {}) {
  const byText = new Map(corpus.map(phrase => [phrase.text, phrase]));
  const unknown = include.filter(text => !byText.has(text));
  if (unknown.length) {
    throw new Error(`Banc : phrases absentes du corpus ${lang} : ${unknown.join(' | ')}`);
  }
  const taken = new Map(include.map(text => [byText.get(text).key, byText.get(text)]));
  for (const trap of TRAPS) {
    for (const phrase of trapPhrases(corpus, lang, trap, taken)) taken.set(phrase.key, phrase);
  }
  fillFamilies(corpus, taken, size);
  const rank = phrase => FAMILY_ORDER.indexOf(phrase.family);
  const position = new Map(corpus.map((phrase, index) => [phrase.key, index]));
  return [...taken.values()]
    .sort((a, b) => rank(a) - rank(b) || position.get(a.key) - position.get(b.key))
    .map(phrase => ({ ...phrase, said: saidText(phrase.text, lang) }));
}

/**
 * Fichiers d'un banc
 * @param {string} outDir
 */
export function benchPaths(outDir) {
  return {
    outDir,
    billedFile: path.join(outDir, 'billed.jsonl'),
    manifestDir: path.join(outDir, 'manifests'),
    whisperManifest: path.join(outDir, 'manifests', 'whisper.json'),
    transcripts: path.join(outDir, 'transcripts.jsonl'),
    page: path.join(outDir, 'index.html'),
    filesList: path.join(outDir, 'files.json'),
  };
}

/** Chemin d'un clip dans le banc, tel que la page le cite */
export const clipPath = (slug, key) => `clips/${slug}/${key}.mp3`;

const manifestFile = (paths, slug) => path.join(paths.manifestDir, `${slug}.json`);

/** Brut d'une phrase : rangé sous les réglages de synthèse et le texte dit */
function rawPath(paths, { slug, voice }, key, said) {
  const name = `${key}-${saidHash(said)}.${rawExtension(voice.sourceFormat)}`;
  return path.join(paths.outDir, 'raw', slug, synthesisHash(voice), name);
}

/** Tampon d'un clip : son brut et l'encodage ; un clip au tampon différent est refait */
const clipStamp = (paths, raw, encoding) =>
  sha256(`${path.relative(paths.outDir, raw)}\n${JSON.stringify(encoding)}`).slice(0, 16);

/** Manifeste d'une voix du banc : ses clips, avec texte dit, durée et sha256 */
export function readBenchManifest(paths, slug) {
  const file = manifestFile(paths, slug);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : { clips: {} };
}

/**
 * Travail de chaque voix candidate : les phrases sans clip à jour, et les caractères à payer
 * (une phrase dont le brut existe déjà se retraite sans appel)
 * @returns {Array<{bench: Object, todo: Object[], chars: number}>}
 */
export function planBench({ voices, phrases, lang, paths }) {
  return voices
    .filter(bench => bench.kind === 'candidate')
    .map(bench => {
      const manifest = readBenchManifest(paths, bench.slug);
      const todo = [];
      for (const phrase of phrases) {
        const said = voiceSaidText(bench.voice, phrase.text, lang);
        const raw = rawPath(paths, bench, phrase.key, said);
        const stamp = clipStamp(paths, raw, bench.voice.encoding);
        const fresh =
          manifest.clips[phrase.key]?.stamp === stamp &&
          fs.existsSync(path.join(paths.outDir, clipPath(bench.slug, phrase.key)));
        if (!fresh) todo.push({ phrase, said, raw, stamp, paid: fs.existsSync(raw) });
      }
      const chars = todo
        .filter(item => !item.paid)
        .reduce((n, item) => n + charCount(item.said), 0);
      return { bench, todo, chars };
    });
}

/**
 * Refuse de partir si le plafond ne couvre pas tout le banc : mieux vaut aucun appel qu'un
 * banc à moitié fait
 * @param {number} needed - Caractères à payer
 * @param {number} billed - Caractères déjà payés pour ce banc
 * @param {number|undefined} maxTotalChars
 */
export function assertCap(needed, billed, maxTotalChars) {
  if (needed === 0) return;
  if (maxTotalChars === undefined) {
    throw new CapError(
      `${needed} caractères à payer : --max-total-chars obligatoire (accord du propriétaire)`
    );
  }
  if (billed + needed > maxTotalChars) {
    throw new CapError(
      `Plafond insuffisant : ${billed} caractères déjà payés, ${needed} à payer, plafond ` +
        `${maxTotalChars} (--max-total-chars)`
    );
  }
}

/** Appel payant d'une phrase : brut écrit, réponse inscrite au registre dès sa réception */
async function buyRaw(item, { bench, provider, paths, retry }) {
  const line = {
    at: new Date().toISOString(),
    voice: bench.slug,
    key: item.phrase.key,
    chars: charCount(item.said),
    provider: bench.voice.provider,
    voiceId: bench.voice.voiceId,
  };
  let audio;
  try {
    ({ audio } = await withRetries(
      () => provider.synthesize({ text: item.said, voice: bench.voice }),
      retry
    ));
  } catch (error) {
    // Réponse payée mais inutilisable : payée quand même, donc inscrite
    if (error instanceof ProviderError && error.kind === 'response')
      await recordBilled(paths, line);
    throw error;
  }
  await recordBilled(paths, line);
  await fsp.mkdir(path.dirname(item.raw), { recursive: true });
  await writeFileAtomic(item.raw, audio);
}

/** Clip traité comme ceux du jeu, puis inscrit au manifeste de la voix */
async function finishClip(item, { bench, paths, manifest, audio }) {
  const out = path.join(paths.outDir, clipPath(bench.slug, item.phrase.key));
  await fsp.mkdir(path.dirname(out), { recursive: true });
  await audio.process(item.raw, out, bench.voice.encoding);
  const info = await audio.probe(out);
  manifest.clips[item.phrase.key] = {
    text: item.phrase.text,
    said: item.said,
    stamp: item.stamp,
    duration: Math.round(info.duration * 1000) / 1000,
    sha256: sha256(await fsp.readFile(out)),
  };
  await writeFileAtomic(manifestFile(paths, bench.slug), JSON.stringify(manifest, null, 2));
}

/**
 * Synthèse et traitement des phrases qui manquent, voix après voix
 * @param {Array<{bench: Object, todo: Object[]}>} plan
 * @param {Object} options
 * @param {Object} options.paths
 * @param {(voice: Object) => Promise<Object>} options.open - Fournisseur d'une voix (vérifiée)
 * @param {{process: Function, probe: Function}} [options.audio]
 * @param {Object} [options.retry] - Relances (withRetries)
 * @param {(message: string) => void} [options.log]
 */
export async function synthesizeBench(plan, options) {
  const {
    paths,
    open,
    audio = { process: processClip, probe: probeClip },
    retry = { delays: RETRY_DELAYS_MS, sleep: ms => new Promise(done => setTimeout(done, ms)) },
    log = () => {},
  } = options;
  for (const { bench, todo } of plan.filter(step => step.todo.length)) {
    const manifest = readBenchManifest(paths, bench.slug);
    const provider = todo.some(item => !item.paid) ? await open(bench.voice) : null;
    for (const item of todo) {
      if (!item.paid) await buyRaw(item, { bench, provider, paths, retry });
      await finishClip(item, { bench, paths, manifest, audio });
    }
    log(`${bench.name} : ${todo.length} clips`);
  }
}

/**
 * Copie les clips des voix de référence dans le banc, avec leur entrée de manifeste ; une
 * phrase sans clip publié reste absente
 * @param {Object[]} voices
 * @param {Object[]} phrases
 * @param {{paths: Object, voicesRepo: string, lang: string}} options
 */
export async function copyReferences(voices, phrases, { paths, voicesRepo, lang }) {
  for (const bench of voices.filter(voice => voice.kind === 'reference')) {
    const { version } = bench.voice;
    const source = path.join(voicesRepo, 'manifests', lang, `${version}.json`);
    const published = fs.existsSync(source) ? JSON.parse(fs.readFileSync(source, 'utf8')) : {};
    const manifest = { clips: {} };
    for (const phrase of phrases) {
      const from = path.join(voicesRepo, 'clips', lang, version, `${phrase.key}.mp3`);
      const entry = published.clips?.[phrase.key];
      if (!entry || !fs.existsSync(from)) continue;
      const to = path.join(paths.outDir, clipPath(bench.slug, phrase.key));
      await fsp.mkdir(path.dirname(to), { recursive: true });
      await fsp.copyFile(from, to);
      manifest.clips[phrase.key] = { ...entry, sha256: sha256(await fsp.readFile(to)) };
    }
    await fsp.mkdir(paths.manifestDir, { recursive: true });
    await writeFileAtomic(manifestFile(paths, bench.slug), JSON.stringify(manifest, null, 2));
  }
}

/**
 * Whisper sur tous les clips du banc en une fois : chaque clip y porte l'empreinte
 * « <voix>/<phrase> », son chemin sous clips/. Les clips déjà transcrits dans leur état
 * actuel sont sautés.
 */
export function transcribeBench(voices, paths, { python, lang }, run = runWhisper) {
  const clips = {};
  for (const bench of voices) {
    for (const [key, entry] of Object.entries(readBenchManifest(paths, bench.slug).clips)) {
      clips[`${bench.slug}/${key}`] = { sha256: entry.sha256, text: entry.text };
    }
  }
  fs.writeFileSync(paths.whisperManifest, JSON.stringify({ clips }));
  const clipDir = path.join(paths.outDir, 'clips');
  run({
    python,
    lang,
    paths: { manifestFile: paths.whisperManifest, clipDir },
    transcripts: paths.transcripts,
  });
}

/** Ce que Whisper a entendu du contenu actuel d'un clip, s'il l'a transcrit */
function heardOf(lines, id, entry) {
  return lines.findLast(line => line.key === id && line.sha256 === entry.sha256)?.heard;
}

function clipResult(bench, phrase, entry, { lang, transcripts }) {
  const heard = heardOf(transcripts, `${bench.slug}/${phrase.key}`, entry);
  const flagged = heard === undefined ? null : compareTranscript(phrase.text, heard, lang).flagged;
  return { src: clipPath(bench.slug, phrase.key), heard, flagged };
}

/**
 * Résultats d'une voix : ses clips (chemin, ce que Whisper a entendu, doute), son débit en
 * secondes par caractère dit, le nombre de doutes et de phrases transcrites
 */
export function voiceResults(bench, phrases, { paths, lang, transcripts }) {
  const { clips: entries } = readBenchManifest(paths, bench.slug);
  const present = phrases.filter(phrase => entries[phrase.key]);
  const clips = Object.fromEntries(
    present.map(phrase => [
      phrase.key,
      clipResult(bench, phrase, entries[phrase.key], { lang, transcripts }),
    ])
  );
  const seconds = present.reduce((sum, phrase) => sum + (entries[phrase.key].duration ?? 0), 0);
  const said = phrase => entries[phrase.key].said ?? phrase.said;
  const chars = present.reduce((sum, phrase) => sum + charCount(said(phrase)), 0);
  const judged = Object.values(clips).filter(clip => clip.flagged !== null);
  return {
    ...bench,
    clips,
    rate: chars ? seconds / chars : null,
    doubts: judged.filter(clip => clip.flagged).length,
    judged: judged.length,
  };
}

/**
 * Écrit la page du banc et la liste des fichiers à joindre à l'artifact
 * @returns {Promise<{files: string[], batches: number}>}
 */
export async function writeBenchPage({ setup, phrases, results, paths, corpus }) {
  const { html, files } = buildBenchPage({ setup, phrases, voices: results, corpus });
  await writeFileAtomic(paths.page, html);
  await writeFileAtomic(paths.filesList, JSON.stringify(files.map(file => ({ path: file }))));
  return { files, batches: Math.ceil(files.length / FILES_PER_PUBLISH) };
}

const CLI_OPTIONS = {
  '--config': pathOption('config'),
  '--out': pathOption('out'),
  '--voices-repo': pathOption('voicesRepo'),
  '--python': pathOption('python'),
  '--max-total-chars': integerOption('maxTotalChars', 1),
  '--dry-run': flagOption('dryRun'),
  '--skip-whisper': flagOption('skipWhisper'),
  '--list-voices': valueOption('listVoices'),
  '--language-code': valueOption('languageCode'),
};

/**
 * @param {string[]} argv
 * @param {string} [cwd]
 */
export function parseArgs(argv, cwd = process.cwd()) {
  const args = parseOptions(argv, CLI_OPTIONS, {
    voicesRepo: DEFAULT_OUT,
    dryRun: false,
    skipWhisper: false,
  });
  if (args.listVoices) {
    if (!args.languageCode) throw new Error('--list-voices demande --language-code (fr-FR…)');
    return args;
  }
  if (!args.config) throw new Error('--config <banc.json> est requis');
  args.python ??= path.join(cwd, '.venv-whisper', 'bin', 'python');
  return args;
}

/** --list-voices : voix d'une langue chez le fournisseur, sans frais */
async function listVoices({ listVoices: provider, languageCode }, env = process.env) {
  if (provider !== 'google') {
    throw new Error(
      '--list-voices : seul google est pris en charge (Mistral : GET /v1/audio/voices, ' +
        'ElevenLabs : bibliothèque de voix)'
    );
  }
  const google = createGoogle({
    apiKey: env.GOOGLE_TTS_API_KEY,
    baseUrl: env.GOOGLE_TTS_BASE_URL || undefined,
  });
  for (const voice of await google.listVoices(languageCode)) {
    console.log(`${voice.name.padEnd(36)} ${voice.gender}`);
  }
  return 0;
}

function printPlan({ plan, phrases, billed }) {
  console.log(`${phrases.length} phrases :`);
  for (const phrase of phrases) {
    const said = phrase.said === phrase.text ? '' : `   → dit : ${phrase.said}`;
    console.log(`  ${phrase.family.padEnd(16)} ${phrase.text}${said}`);
  }
  for (const { bench, todo, chars } of plan) {
    const provider = bench.voice.provider;
    console.log(
      `${bench.name} (${provider}) : ${todo.length} clips à faire, ${chars} caractères à payer`
    );
  }
  console.log(`Déjà payé pour ce banc : ${billed} caractères`);
}

/** Banc, dossier, phrases et travail restant, sans rien écrire */
function prepareBench(args) {
  const setup = benchSetup(JSON.parse(fs.readFileSync(args.config, 'utf8')));
  const paths = benchPaths(args.out ?? path.join(args.voicesRepo, 'bancs', setup.id));
  const corpus = buildCorpus(setup.lang);
  const phrases = benchPhrases(corpus, setup.lang, setup);
  const plan = planBench({ voices: setup.voices, phrases, lang: setup.lang, paths });
  return {
    setup,
    paths,
    corpus,
    phrases,
    plan,
    billed: billedChars({ billedFile: paths.billedFile }),
  };
}

/** Clips des candidates et des références, transcriptions, puis page */
async function runBench(args, bench) {
  const { setup, paths, phrases, plan } = bench;
  const { lang, voices } = setup;
  await checkAudioTools();
  await fsp.mkdir(paths.manifestDir, { recursive: true });
  await synthesizeBench(plan, { paths, open: voice => openProvider(voice), log: console.log });
  await copyReferences(voices, phrases, { paths, voicesRepo: args.voicesRepo, lang });
  if (!args.skipWhisper) transcribeBench(voices, paths, { python: args.python, lang });
  const transcripts = readTranscripts(paths.transcripts) ?? [];
  const results = voices.map(voice => voiceResults(voice, phrases, { paths, lang, transcripts }));
  return { results, ...(await writeBenchPage({ ...bench, results })) };
}

function printResults({ results, files, batches }, paths) {
  for (const voice of results) {
    const rate = voice.rate === null ? '—' : voice.rate.toFixed(3);
    console.log(
      `${voice.name} : ${rate} s par caractère, Whisper ${voice.doubts} doute(s) sur ${voice.judged}`
    );
  }
  console.log(`Page : ${pathToFileURL(paths.page).href}`);
  console.log(`${files.length} fichiers à joindre (${paths.filesList}), en ${batches} envoi(s)`);
}

async function main(argv) {
  const args = parseArgs(argv);
  if (args.listVoices) return listVoices(args);
  const bench = prepareBench(args);
  printPlan(bench);
  if (args.dryRun) return 0;
  const needed = bench.plan.reduce((sum, step) => sum + step.chars, 0);
  assertCap(needed, bench.billed, args.maxTotalChars);
  printResults(await runBench(args, bench), bench.paths);
  return 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2))
    .then(code => {
      process.exitCode = code;
    })
    .catch(error => {
      console.error(error.message);
      process.exitCode = error instanceof CapError ? 3 : 1;
    });
}
