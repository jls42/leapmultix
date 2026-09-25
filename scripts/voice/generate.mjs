#!/usr/bin/env node
// Génère les clips de la voix enregistrée d'une langue, dans le dépôt privé des voix
// (rangement : voir clip-store.mjs).
//
// Idempotent : une relance ne génère que ce qui manque. Un clip n'existe sous son nom
// final qu'une fois complet et vérifié (ffprobe) ; tout reste d'une exécution
// interrompue (crédits épuisés, arrêt, plantage) est supprimé au démarrage suivant. Un
// fichier brut déjà payé est retraité sans nouvel appel.
//
// Usage :
//   node --env-file=<fichier .env> scripts/voice/generate.mjs --lang fr [options]
//     --out <dossier>      dépôt privé des voix (défaut : ../leapmultix-voices)
//     --dry-run            compte ce qui reste à générer, sans appel ni écriture
//     --max-chars <n>      caractères envoyés au plus pour cette exécution
//     --reserve <n>        crédits à laisser sur le compte (défaut : 0) ; le budget se compte
//                          en crédits réels (en-tête character-cost : Eleven v3 décompte
//                          environ 0,53 crédit par caractère, mesuré sur le français)
//     --limit <n>          appels au plus pour cette exécution
//     --concurrency <n>    appels simultanés (défaut : 4)
//     --redo <fichier>     empreintes à refaire, une par ligne (clip écarté à l'écoute) ;
//                          l'ancien clip est mis de côté dans ecoute/avant/ (listen-page.mjs)
//     --raw-from <version> reprend les bruts rangés sous l'ancien nom d'une autre version
//                          (mêmes réglages de synthèse, seul l'encodage change)
//     --reprocess          refait les clips depuis leurs bruts, sans appel (--keys <fichier> :
//                          seulement ces empreintes) ; pour des clips pas encore publiés
// Clé : variable d'environnement ELEVENLABS_API_KEY, jamais écrite ni affichée.
// Codes de sortie : 0 fait, 1 erreur ou panne, 3 crédits épuisés, 4 phrases en échec,
// 130 interrompu.

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCorpus } from './corpus.mjs';
import { saidText } from './said-text.mjs';
import {
  ClipContentError,
  checkAudioTools,
  clipProblem,
  processClip,
  probeClip,
} from './audio-process.mjs';
import { createElevenLabs, ProviderError } from './providers/elevenlabs.mjs';
import {
  flagOption,
  integerOption,
  parseOptions,
  pathOption,
  readKeyList,
  valueOption,
} from './cli-options.mjs';
import {
  PART,
  acquireLock,
  cleanLeftovers,
  migrateLegacyRaw,
  synthesisHash,
  clipFile,
  keepReplaced,
  rawFile,
  readManifest,
  reconcile,
  sha256,
  storePaths,
  writeFileAtomic,
  writeManifest,
} from './clip-store.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const VOICES_PATH = path.join(ROOT, 'scripts/voice/voices.json');
export const DEFAULT_OUT = path.resolve(ROOT, '../leapmultix-voices');

const PROVIDERS = { elevenlabs: createElevenLabs };

/** Ordre de génération : ce qu'on entend le plus d'abord, les longs énoncés en dernier */
export const FAMILY_ORDER = [
  'annonce',
  'bravo',
  'phrase fixe',
  'erreur',
  'question',
  'question à trou',
  'vrai ou faux',
  'découverte',
  'énoncé',
];
export const OPERATOR_ORDER = ['×', '÷', '+', '−'];

/** Attentes avant chaque nouvel essai (débit dépassé, serveur ou réseau en panne) */
export const RETRY_DELAYS_MS = [1000, 2000, 4000, 8000, 15000, 30000];

/** Au-delà de ce nombre de phrases en échec, l'exécution s'arrête */
const MAX_FAILURES = 20;

/** Erreurs du fournisseur qui arrêtent toute l'exécution (au lieu d'une seule phrase) */
const STOPPING_KINDS = new Set(['quota', 'auth', 'voice', 'response']);

/** Erreurs passagères du fournisseur (débit, serveur, réseau) : un nouvel essai peut réussir */
const RETRIABLE_KINDS = new Set(['rate', 'server', 'network']);

/** Panne qui n'est pas celle d'une phrase (outil, disque, manifeste) : tout s'arrête */
export class FatalError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FatalError';
  }
}

const rank = (list, value) => {
  const index = list.indexOf(value);
  return index < 0 ? list.length : index;
};

/**
 * Phrases dans l'ordre de génération
 * @param {Array<{text: string, family: string, operator?: string|null}>} phrases
 */
export function generationOrder(phrases) {
  return [...phrases].sort(
    (x, y) =>
      rank(FAMILY_ORDER, x.family) - rank(FAMILY_ORDER, y.family) ||
      rank(OPERATOR_ORDER, x.operator) - rank(OPERATOR_ORDER, y.operator) ||
      x.text.localeCompare(y.text)
  );
}

/**
 * Voix d'une langue dans voices.json
 * @param {string} lang
 * @param {string} [voicesPath]
 */
export function loadVoice(lang, voicesPath = VOICES_PATH) {
  const voices = JSON.parse(fs.readFileSync(voicesPath, 'utf8'));
  const voice = voices[lang];
  if (!voice)
    throw new Error(`Aucune voix pour « ${lang} » dans ${path.relative(ROOT, voicesPath)}`);
  return { ...voice, lang };
}

const charCount = text => [...text].length;

/** Contrôle d'un clip traité : son entrée de manifeste, ou une erreur */
async function inspectWith(probeAudio, file) {
  const info = await probeAudio(file);
  const problem = clipProblem(info);
  if (problem) throw new ClipContentError(problem);
  const data = await fsp.readFile(file);
  return {
    duration: Math.round(info.duration * 1000) / 1000,
    bytes: data.length,
    sha256: sha256(data),
  };
}

/**
 * Attente avant un nouvel essai, ou null s'il n'y en a pas : arrêt demandé, erreur qu'un
 * nouvel essai ne corrigerait pas, ou essais épuisés
 */
function retryDelay(error, attempt, { delays, signal }) {
  const retriable = error instanceof ProviderError && RETRIABLE_KINDS.has(error.kind);
  if (signal?.aborted || !retriable || attempt >= delays.length) return null;
  return Math.max(error.retryAfterMs ?? 0, delays[attempt]);
}

async function withRetries(task, options) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await task();
    } catch (error) {
      const delay = retryDelay(error, attempt, options);
      if (delay === null) throw error;
      await options.sleep(delay);
    }
  }
}

/**
 * Écarte les clips à refaire (liste d'empreintes) avant la réconciliation. Chaque clip écarté
 * est mis de côté (ecoute/avant/) pour la comparaison avant/après de la page d'écoute.
 */
async function forgetKeys(paths, manifest, keys) {
  for (const key of keys) {
    delete manifest.clips[key];
    await keepReplaced(paths, key);
    const raws = fs.existsSync(paths.rawDir) ? fs.readdirSync(paths.rawDir) : [];
    for (const name of raws.filter(n => n.startsWith(`${key}-`))) {
      await fsp.rm(path.join(paths.rawDir, name), { force: true });
    }
  }
}

function createState(options) {
  return {
    stop: null,
    chars: 0,
    reserved: 0,
    requests: 0,
    generated: 0,
    reprocessed: 0,
    failed: [],
    sinceSave: 0,
    saving: Promise.resolve(),
    credits: 0,
    reservedCredits: 0,
    // Crédits par caractère : 1 tant qu'aucun coût réel n'est connu (estimation prudente)
    ratio: 1,
    maxChars: options.maxChars ?? Infinity,
    maxCredits: options.maxCredits ?? Infinity,
    limit: options.limit ?? Infinity,
  };
}

/**
 * Réserve le budget d'un appel (caractères, et crédits estimés au coût moyen observé) ;
 * null (et arrêt) si la phrase n'y tient plus. On s'arrête à la première phrase qui
 * dépasse, pour respecter l'ordre de génération.
 * @returns {{chars: number, credits: number}|null}
 */
function reserve(state, chars) {
  if (state.requests >= state.limit) {
    state.stop ??= 'limit';
    return null;
  }
  const credits = chars * state.ratio;
  const overChars = state.chars + state.reserved + chars > state.maxChars;
  const overCredits = state.credits + state.reservedCredits + credits > state.maxCredits;
  if (overChars || overCredits) {
    state.stop ??= 'budget';
    return null;
  }
  state.requests++;
  state.reserved += chars;
  state.reservedCredits += credits;
  return { chars, credits };
}

function release(state, reservation) {
  state.reserved -= reservation.chars;
  state.reservedCredits -= reservation.credits;
}

/** Compte un appel payé : caractères envoyés et crédits réels (estimés s'ils manquent) */
function account(state, chars, cost) {
  state.chars += chars;
  state.credits += cost ?? chars * state.ratio;
  if (cost !== null) state.ratio = state.credits / state.chars;
}

/** Arrête l'exécution : la première cause et le premier message sont gardés */
function stopRun(state, reason, message) {
  state.stop ??= reason;
  state.stopMessage ??= message;
}

/** Écrit le brut payé ; un échec ici est une panne (disque), pas celle d'une phrase */
async function writeRaw(raw, audio) {
  try {
    await writeFileAtomic(raw, audio);
  } catch (error) {
    throw new FatalError(`Écriture du brut impossible : ${error.message}`);
  }
}

/**
 * Demande la synthèse d'une phrase, dans la limite du budget, et écrit son brut. Rend
 * l'identifiant et le coût de l'appel, ou null si le budget ne permet plus l'appel.
 * @returns {Promise<{requestId: string|null, cost: number|null}|null>}
 */
async function synthesizeRaw(said, raw, ctx) {
  const { voice, provider, state, options } = ctx;
  const reservation = reserve(state, charCount(said));
  if (!reservation) return null;
  try {
    const { audio, requestId, cost } = await withRetries(
      () => provider.synthesize({ text: said, voice, signal: options.signal }),
      options
    );
    // Payé dès la réponse : compté même si l'écriture échoue ensuite
    account(state, reservation.chars, cost ?? null);
    await writeRaw(raw, audio);
    return { requestId, cost };
  } finally {
    release(state, reservation);
  }
}

/** Traite le brut en clip, le contrôle, puis le range sous son nom final avec son entrée */
async function finishClip({ phrase, said, raw, requestId, cost }, ctx) {
  const { voice, paths, manifest, options } = ctx;
  const target = clipFile(paths, phrase.key);
  const part = `${target}${PART}`;
  try {
    await fsp.mkdir(paths.clipDir, { recursive: true });
    await options.processAudio(raw, part, voice.encoding);
    const entry = await inspectWith(options.probeAudio, part);
    await fsp.rename(part, target);
    manifest.clips[phrase.key] = {
      text: phrase.text,
      said,
      ...entry,
      requestId,
      cost,
      at: options.now().toISOString(),
    };
  } catch (error) {
    await fsp.rm(part, { force: true });
    // Seul un contenu jugé mauvais (muet, illisible, hors bornes) rend le brut inutile ; une
    // panne d'outil (ffmpeg absent, interruption) garde le brut payé et arrête tout
    if (error instanceof ClipContentError) {
      await fsp.rm(raw, { force: true });
      throw error;
    }
    throw new FatalError(`Traitement impossible, brut gardé : ${error.message}`);
  }
}

/**
 * Génère (ou retraite) le clip d'une phrase. Rend false si la phrase n'a pas été tentée
 * (budget atteint).
 */
async function produceClip(phrase, ctx) {
  const said = saidText(phrase.text, ctx.lang);
  const raw = rawFile(ctx.paths, phrase.key, said);
  const fresh = !fs.existsSync(raw);
  // Un brut déjà payé est retraité sans nouvel appel
  const call = fresh ? await synthesizeRaw(said, raw, ctx) : { requestId: null, cost: null };
  if (!call) return false;
  await finishClip({ phrase, said, raw, ...call }, ctx);
  if (fresh) ctx.state.generated++;
  else ctx.state.reprocessed++;
  return true;
}

/** Cause d'arrêt de toute l'exécution, ou null si l'erreur ne touche que sa phrase */
function stoppingReason(error) {
  if (error instanceof FatalError) return 'fatal';
  if (error instanceof ProviderError && STOPPING_KINDS.has(error.kind)) return error.kind;
  return null;
}

function recordFailure(state, phrase, error) {
  const reason = stoppingReason(error);
  if (reason) {
    stopRun(state, reason, error.message);
    return;
  }
  state.failed.push({ key: phrase.key, text: phrase.text, error: error.message });
  if (state.failed.length >= MAX_FAILURES) state.stop ??= 'failures';
}

function scheduleSave(ctx, force = false) {
  const { state, paths, manifest } = ctx;
  state.sinceSave++;
  if (!force && state.sinceSave < 20) return state.saving;
  state.sinceSave = 0;
  state.saving = state.saving
    .then(() => writeManifest(paths, manifest))
    .catch(error => stopRun(state, 'fatal', `Manifeste impossible à écrire : ${error.message}`));
  return state.saving;
}

function reportProgress(ctx, total) {
  const { state, options } = ctx;
  const done = state.generated + state.reprocessed;
  if (done % 25 !== 0) return;
  options.log(
    `  ${done}/${total} clips, ${state.chars} caractères, ${Math.round(state.credits)} crédits` +
      (state.failed.length ? `, ${state.failed.length} en échec` : '')
  );
}

/** L'arrêt a-t-il été demandé (signal) ? Si oui, il devient la cause d'arrêt */
function stopIfInterrupted({ state, options }) {
  if (!options.signal?.aborted) return false;
  state.stop ??= 'interrupted';
  return true;
}

/** Clip d'une phrase, échec compris ; false si le budget arrête la file */
async function workOn(phrase, total, ctx) {
  try {
    if (!(await produceClip(phrase, ctx))) return false;
    await scheduleSave(ctx);
    reportProgress(ctx, total);
  } catch (error) {
    if (!stopIfInterrupted(ctx)) recordFailure(ctx.state, phrase, error);
  }
  return true;
}

async function worker(queue, ctx) {
  while (!ctx.state.stop) {
    if (stopIfInterrupted(ctx)) return;
    const phrase = queue.shift();
    if (!phrase || !(await workOn(phrase, queue.total, ctx))) return;
  }
}

/**
 * Génère les clips manquants d'une langue.
 * @param {Object} options
 * @param {string} options.lang
 * @param {Array<{text: string, key: string, family: string, operator?: string|null}>} options.phrases
 * @param {Object} options.voice - Entrée de voices.json
 * @param {string} options.outDir - Dépôt privé des voix
 * @param {Object} [options.provider] - Fournisseur (inutile en dryRun)
 * @returns {Promise<Object>} bilan de l'exécution
 */
export async function runGeneration(options) {
  const opts = {
    concurrency: 4,
    dryRun: false,
    redo: [],
    delays: RETRY_DELAYS_MS,
    sleep: ms => new Promise(resolve => setTimeout(resolve, ms)),
    processAudio: processClip,
    probeAudio: probeClip,
    now: () => new Date(),
    log: console.log,
    ...options,
  };
  const { lang, voice, outDir, dryRun } = opts;
  const paths = storePaths(outDir, lang, voice.version, synthesisHash(voice));
  // Le verrou d'abord : le nettoyage ci-dessous effacerait les fichiers d'une autre exécution
  const lock = dryRun ? null : await acquireLock(paths, opts.lockOptions);
  try {
    return await generateLocked(opts, paths);
  } finally {
    await lock?.release();
  }
}

/**
 * Remet le dépôt en ordre avant la génération : bruts rangés sous un ancien nom, restes
 * d'une exécution interrompue, clips à refaire (--redo). Rend les restes trouvés.
 */
async function prepareStore(opts, paths, manifest) {
  const { lang, dryRun } = opts;
  if (!dryRun) {
    await migrateLegacyRaw(paths);
    if (opts.rawFrom) {
      await migrateLegacyRaw(paths, storePaths(opts.outDir, lang, opts.rawFrom).legacyRawDir);
    }
  }
  const leftovers = await cleanLeftovers(paths, { dryRun });
  if (!dryRun && opts.redo.length) {
    await forgetKeys(paths, manifest, opts.redo);
    // Aussitôt sur disque : un arrêt ensuite ne rendrait pas l'ancienne entrée au nouveau clip
    await writeManifest(paths, manifest);
  }
  return leftovers;
}

/** Bilan avant génération : ce qui est fait, ce qui reste, ce que la réconciliation a trouvé */
function plannedSummary({ lang, voice, phrases }, queue, leftovers, reconciled) {
  return {
    lang,
    version: voice.version,
    phrases: phrases.length,
    alreadyDone: phrases.length - queue.length,
    toDo: queue.length,
    toDoChars: queue.reduce((sum, phrase) => sum + charCount(saidText(phrase.text, lang)), 0),
    leftovers: leftovers.length,
    ...reconciled,
  };
}

/** Génère la file (plusieurs appels à la fois), puis écrit le manifeste une dernière fois */
async function generateQueue(queue, ctx) {
  if (queue.length) {
    const workers = Math.max(1, Math.min(ctx.options.concurrency, queue.length));
    await Promise.all(Array.from({ length: workers }, () => worker(queue, ctx)));
  }
  await scheduleSave(ctx, true);
}

/** Bilan de l'exécution : le bilan prévu, complété de ce qui a été fait et de la cause d'arrêt */
function finalSummary(summary, { state, manifest, options }) {
  return {
    ...summary,
    generated: state.generated,
    reprocessed: state.reprocessed,
    chars: state.chars,
    credits: Math.round(state.credits),
    requests: state.requests,
    failed: state.failed,
    stop: state.stop,
    stopMessage: state.stopMessage ?? null,
    remaining: options.phrases.filter(phrase => !manifest.clips[phrase.key]).length,
  };
}

async function generateLocked(opts, paths) {
  const { lang, voice, phrases } = opts;
  const manifest = readManifest(paths, lang, voice);
  const leftovers = await prepareStore(opts, paths, manifest);
  const reconciled = await reconcile({
    paths,
    manifest,
    phrasesByKey: new Map(phrases.map(phrase => [phrase.key, phrase])),
    said: text => saidText(text, lang),
    inspect: file => inspectWith(opts.probeAudio, file),
    dryRun: opts.dryRun,
  });

  const queue = generationOrder(phrases.filter(phrase => !manifest.clips[phrase.key]));
  queue.total = queue.length;
  const summary = plannedSummary(opts, queue, leftovers, reconciled);
  if (opts.dryRun) return { ...summary, dryRun: true, next: queue.slice(0, 20) };

  const state = createState(opts);
  const ctx = { lang, voice, paths, provider: opts.provider, state, manifest, options: opts };
  await generateQueue(queue, ctx);
  return finalSummary(summary, ctx);
}

/** Refait le clip d'une empreinte depuis son brut ; le réécrit seulement s'il change */
async function reprocessOne(key, { opts, paths, manifest, voice, report }) {
  const entry = manifest.clips[key];
  const raw = rawFile(paths, key, entry.said);
  if (!fs.existsSync(raw)) {
    report.missingRaw.push(key);
    return;
  }
  report.checked++;
  const part = `${clipFile(paths, key)}${PART}`;
  try {
    await opts.processAudio(raw, part, voice.encoding);
    const fresh = await inspectWith(opts.probeAudio, part);
    if (fresh.sha256 === entry.sha256) {
      await fsp.rm(part, { force: true });
      return;
    }
    await fsp.rename(part, clipFile(paths, key));
    manifest.clips[key] = { ...entry, ...fresh, reprocessedAt: opts.now().toISOString() };
    report.changed++;
  } catch (error) {
    await fsp.rm(part, { force: true });
    if (!(error instanceof ClipContentError)) throw error;
    report.failed.push({ key, text: entry.text, error: error.message });
  }
}

/**
 * Refait les clips depuis leurs bruts, sans appel au fournisseur (traitement corrigé) :
 * seuls les clips dont le contenu change sont réécrits et leur entrée mise à jour. Pour des
 * clips pas encore publiés : un clip publié ne se réécrit jamais.
 * @param {Object} options - Comme runGeneration, plus keys (empreintes, toutes sinon)
 */
export async function reprocessClips(options) {
  const opts = {
    processAudio: processClip,
    probeAudio: probeClip,
    now: () => new Date(),
    ...options,
  };
  const { lang, voice, outDir } = opts;
  const paths = storePaths(outDir, lang, voice.version, synthesisHash(voice));
  const lock = await acquireLock(paths, opts.lockOptions);
  try {
    const manifest = readManifest(paths, lang, voice);
    await migrateLegacyRaw(paths);
    await cleanLeftovers(paths);
    const keys = opts.keys?.length ? opts.keys : Object.keys(manifest.clips);
    const report = { checked: 0, changed: 0, missingRaw: [], failed: [] };
    const queue = keys.filter(key => manifest.clips[key]);
    const workers = Array.from({ length: Math.max(1, opts.concurrency ?? 4) }, async () => {
      for (let key = queue.shift(); key; key = queue.shift()) {
        await reprocessOne(key, { opts, paths, manifest, voice, report });
      }
    });
    await Promise.all(workers);
    await writeManifest(paths, manifest);
    return report;
  } finally {
    await lock.release();
  }
}

const CLI_OPTIONS = {
  '--dry-run': flagOption('dryRun'),
  '--reprocess': flagOption('reprocess'),
  '--lang': valueOption('lang'),
  '--out': pathOption('out'),
  '--redo': valueOption('redoFile'),
  '--keys': valueOption('keysFile'),
  '--raw-from': valueOption('rawFrom'),
  '--max-chars': integerOption('maxChars'),
  '--limit': integerOption('limit'),
  '--concurrency': integerOption('concurrency', 1),
  '--reserve': integerOption('reserve'),
};

export function parseArgs(argv) {
  const args = parseOptions(argv, CLI_OPTIONS, {
    concurrency: 4,
    reserve: 0,
    out: DEFAULT_OUT,
    dryRun: false,
    reprocess: false,
  });
  if (!args.lang) throw new Error('--lang est requis (fr, en, es)');
  return args;
}

/**
 * Crédits que l'exécution peut dépenser : les crédits restants moins la réserve. Crédits
 * illisibles (clé sans droit user_read) : départ refusé sans plafond --max-chars.
 */
export async function creditBudget(args, provider, log) {
  const credits = await provider.credits();
  if (!credits) {
    if (args.maxChars === undefined) {
      throw new Error(
        'Crédits illisibles avec cette clé : donner --max-chars pour plafonner la dépense'
      );
    }
    log(`Crédits : illisibles avec cette clé, plafond ${args.maxChars} caractères`);
    return Infinity;
  }
  const left = credits.limit - credits.used;
  log(`Crédits : ${credits.used} utilisés sur ${credits.limit}, ${left} restants`);
  return left - args.reserve;
}

const EXIT_CODES = {
  quota: 3,
  failures: 4,
  auth: 1,
  voice: 1,
  response: 1,
  fatal: 1,
  interrupted: 130,
};

/** Code de sortie d'un bilan : une phrase en échec ne passe jamais pour un succès */
export function exitCodeFor(summary) {
  return EXIT_CODES[summary.stop] ?? (summary.failed.length ? 4 : 0);
}

function logFailures(failed, log) {
  for (const failure of failed)
    log(`  échec ${failure.key} « ${failure.text} » : ${failure.error}`);
}

/** --reprocess : clips refaits depuis leurs bruts, sans appel */
async function mainReprocess(args, base) {
  await checkAudioTools();
  const report = await reprocessClips({
    ...base,
    keys: readKeyList(args.keysFile),
    concurrency: args.concurrency,
  });
  base.log(JSON.stringify({ ...report, missingRaw: report.missingRaw.length }, null, 2));
  logFailures(report.failed, base.log);
  return report.failed.length ? 4 : 0;
}

/** --dry-run : ce qui reste à générer, sans appel ni écriture */
async function mainDryRun(base) {
  const summary = await runGeneration({ ...base, dryRun: true });
  base.log(JSON.stringify(summary, null, 2));
  return 0;
}

/** Fournisseur de la voix, après avoir vérifié que la voix est utilisable avec cette clé */
async function openProvider(voice) {
  const createProvider = PROVIDERS[voice.provider];
  if (!createProvider) throw new Error(`Fournisseur inconnu : ${voice.provider}`);
  const provider = createProvider({
    apiKey: process.env.ELEVENLABS_API_KEY,
    baseUrl: process.env.ELEVENLABS_BASE_URL || undefined,
  });
  try {
    await provider.checkVoice(voice);
  } catch (error) {
    if (error.kind !== 'voice') throw error;
    throw new Error(
      `${error.message}\nLa voix ${voice.voiceId} n'est pas utilisable avec cette clé : l'ajouter ` +
        `depuis la bibliothèque de voix (propriétaire public ${voice.publicOwnerId}).`
    );
  }
  return provider;
}

/** Signal d'arrêt levé par Ctrl+C ou SIGTERM : les appels en cours finissent, puis nettoyage */
function stopSignal(log) {
  const controller = new AbortController();
  const onSignal = () => {
    log('Arrêt demandé : fin des appels en cours, nettoyage…');
    controller.abort();
  };
  process.once('SIGINT', onSignal);
  process.once('SIGTERM', onSignal);
  return controller.signal;
}

/** Génération payante : budget en crédits, appels, trace dans le journal des exécutions */
async function mainGenerate(args, base) {
  const { voice, log } = base;
  await checkAudioTools();
  const provider = await openProvider(voice);
  const maxCredits = await creditBudget(args, provider, log);
  const signal = stopSignal(log);

  const startedAt = new Date();
  const summary = await runGeneration({
    ...base,
    provider,
    maxChars: args.maxChars,
    maxCredits,
    limit: args.limit,
    concurrency: args.concurrency,
    signal,
  });
  const credits = await provider.credits().catch(() => null);
  const record = { startedAt, endedAt: new Date(), ...summary, creditsAfter: credits };
  const { runLogFile } = storePaths(args.out, args.lang, voice.version);
  await fsp.appendFile(runLogFile, `${JSON.stringify(record)}\n`);
  log(JSON.stringify({ ...summary, failed: summary.failed.length }, null, 2));
  logFailures(summary.failed, log);
  return exitCodeFor(summary);
}

async function main(argv) {
  const args = parseArgs(argv);
  const voice = loadVoice(args.lang);
  const phrases = buildCorpus(args.lang);
  const base = {
    lang: args.lang,
    voice,
    outDir: args.out,
    phrases,
    redo: readKeyList(args.redoFile),
    log: console.log,
    rawFrom: args.rawFrom,
  };
  if (args.reprocess) return mainReprocess(args, base);
  if (args.dryRun) return mainDryRun(base);
  return mainGenerate(args, base);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2))
    .then(code => {
      process.exitCode = code;
    })
    .catch(error => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
