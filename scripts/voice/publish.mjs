#!/usr/bin/env node
// Publication des clips d'une langue, depuis le dépôt privé des voix. Se lance sur le poste
// du propriétaire (identifiants AWS locaux), jamais dans la CI publique.
//
//   clips   envoie les clips manquants dans s3://<bucket>/voice/<langue>/<version>/
//           (audio/mpeg, cache d'un an, immuable) ; refuse de réécrire un clip publié,
//           et d'envoyer un fichier qui ne correspond plus au manifeste
//   index   écrit la langue dans voice/index.json (no-cache), puis invalide son cache ;
//           seulement si chaque clip du manifeste est en ligne et identique et si chaque
//           phrase du corpus a son clip (--allow-missing accepte des manques, jamais un
//           conflit)
//   remove  retire la langue de l'index (coupe-circuit), puis invalide
//   local   prépare <site>/voice/ pour un essai local (?voix=local) : liens vers les
//           clips et index, rien n'est envoyé
//   alternative
//           ajoute (ou met à jour) une autre voix de la langue, au choix du joueur :
//           --version d'une voix de alternatives.json, dont les clips sont en ligne ;
//           --remove la retire. La voix par défaut de la langue n'est pas touchée
// --version vise une autre voix de la langue (alternatives.json) avec clips (ses clips),
// local (elle rejoint les autres voix de l'index local) et alternative ; index et remove ne
// publient que la voix par défaut (voices.json).
//
// Usage :
//   node scripts/voice/publish.mjs <commande> --lang fr [--out <dépôt des voix>]
//     [--bucket <nom>] [--distribution <id CloudFront>] [--audience test|all]
//     [--default-on] [--site <dossier du jeu>] [--dry-run] [--allow-missing] [--force]
//     [--version <version d'une autre voix>] [--remove]
// Bucket et distribution : options, ou variables VOICE_BUCKET et CLOUDFRONT_DISTRIB.
// L'index distant n'est réécrit qu'après une lecture sûre : une erreur de lecture (réseau,
// droits), un JSON illisible ou un index invalide arrêtent index et remove ; --force
// repart alors d'un index vide (les autres langues seraient perdues).
// Ordre d'une mise en ligne : check.mjs, clips, check-online.mjs, index (audience test).

import crypto from 'node:crypto';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { VOICE_KEY_SCHEMA } from '../../js/core/spoken-text.js';
import {
  MAX_ALTERNATIVES,
  VOICE_AUDIENCES,
  VOICE_PROVIDERS,
  parseLanguage,
  parseVoiceIndex,
} from '../../js/core/voice-index.js';
import {
  assertLangCode,
  flagOption,
  parseOptions,
  pathOption,
  valueOption,
} from './cli-options.mjs';
import { readManifest, storePaths } from './clip-store.mjs';
import { buildCorpus } from './corpus.mjs';
import { DEFAULT_OUT, loadVoice, loadVoiceVersion } from './generate.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const CLIP_CACHE_CONTROL = 'public, max-age=31536000, immutable';
export const INDEX_KEY = 'voice/index.json';
export const COMMANDS = ['clips', 'index', 'remove', 'local', 'alternative'];
/** Commandes qui acceptent --version (une autre voix de la langue) */
const VERSION_COMMANDS = ['clips', 'local', 'alternative'];

const hash = (algorithm, data) => crypto.createHash(algorithm).update(data).digest('hex');

/** Première ligne d'une erreur de la CLI AWS (message ou sortie d'erreur) */
const firstLine = error =>
  String(error?.stderr || error?.message || error)
    .trim()
    .split('\n')[0]
    .slice(0, 200);

/** Exécute la CLI AWS et rend sa sortie standard */
export async function awsCli(args) {
  const { stdout } = await promisify(execFile)('aws', args, { maxBuffer: 64 * 1024 * 1024 });
  return stdout;
}

/**
 * Index avec la langue écrite (ou retirée si entry est null). Les autres voix de la langue
 * sont gardées si entry n'en dit rien, sauf celle qui devient la voix par défaut.
 * @param {Object|null} current - Index actuel (validé), ou null
 */
export function withLanguage(current, lang, entry) {
  const languages = { ...current?.languages };
  if (!entry) {
    delete languages[lang];
    return { schema: VOICE_KEY_SCHEMA, languages };
  }
  const kept = (languages[lang]?.alternatives ?? []).filter(
    voice => voice.voice !== entry.voice && voice.version !== entry.version
  );
  languages[lang] = entry.alternatives || !kept.length ? entry : { ...entry, alternatives: kept };
  return { schema: VOICE_KEY_SCHEMA, languages };
}

/** Service d'une voix de voices.json, s'il fait partie de ceux que le jeu sait nommer */
const providerOf = voice =>
  VOICE_PROVIDERS.includes(voice.provider) ? { provider: voice.provider } : {};

/**
 * Entrée d'index d'une voix, validée avec les règles du jeu (js/core/voice-index.js) avant
 * toute écriture : une entrée que le jeu écarterait serait publiée pour rien, puis
 * bloquerait les index et remove suivants
 */
export function indexEntry(voice, { audience = 'test', defaultOn = false } = {}) {
  if (!VOICE_AUDIENCES.includes(audience)) throw new Error(`Audience inconnue : ${audience}`);
  const entry = {
    voice: voice.voice,
    version: voice.version,
    format: 'mp3',
    audience,
    defaultOn,
    ...providerOf(voice),
  };
  if (!parseLanguage(entry)) {
    throw new Error(
      `Entrée d'index refusée par les règles du jeu : voix « ${voice.voice} », version ` +
        `« ${voice.version} » (voir js/core/voice-index.js)`
    );
  }
  return entry;
}

/**
 * Entrée d'une autre voix de la langue (alternatives de l'index)
 * @param {Object} voice - Voix de alternatives.json
 * @param {string} [audience]
 */
export function alternativeEntry(voice, audience = 'test') {
  if (!VOICE_AUDIENCES.includes(audience)) throw new Error(`Audience inconnue : ${audience}`);
  return {
    voice: voice.voice,
    version: voice.version,
    format: 'mp3',
    audience,
    ...providerOf(voice),
  };
}

/** Entrée de la langue dans l'index : une autre voix ne rejoint qu'une langue déjà publiée */
function requireLanguage(current, lang) {
  const entry = current?.languages?.[lang];
  if (!entry) {
    throw new Error(
      `La langue ${lang} n'est pas dans l'index : publier d'abord sa voix par défaut`
    );
  }
  return entry;
}

/** Refuse une entrée dont les règles du jeu écarteraient l'autre voix de cette version */
function assertAlternativeKept(next, version, alternative) {
  const kept = parseLanguage(next)?.alternatives ?? [];
  if (kept.some(voice => voice.version === version)) return;
  throw new Error(
    `Autre voix refusée par les règles du jeu : « ${alternative.voice} » (${version}) ; nom ` +
      `ou version déjà pris par la voix par défaut, ou plus de ${MAX_ALTERNATIVES} voix`
  );
}

/**
 * Index avec une autre voix de la langue ajoutée ou mise à jour (même version ou même nom),
 * ou retirée si alternative est null. Refusé si la langue manque, ou si les règles du jeu
 * écarteraient la voix (nom ou version de la voix par défaut, trop de voix).
 * @param {Object|null} current - Index actuel (validé), ou null
 * @param {string} lang
 * @param {string} version - Version de l'autre voix
 * @param {Object|null} alternative - Voir alternativeEntry
 */
export function withAlternative(current, lang, version, alternative) {
  const { alternatives: previous = [], ...main } = requireLanguage(current, lang);
  const others = previous.filter(
    voice => voice.version !== version && voice.voice !== alternative?.voice
  );
  const alternatives = alternative ? [...others, alternative] : others;
  const next = alternatives.length ? { ...main, alternatives } : main;
  if (alternative) assertAlternativeKept(next, version, alternative);
  return { schema: VOICE_KEY_SCHEMA, languages: { ...current.languages, [lang]: next } };
}

/**
 * Répartit les clips locaux selon ce qui est déjà publié
 * @param {Array<{key: string, md5: string}>} local
 * @param {Map<string, string>} remote - clé → ETag (MD5 d'un envoi en une partie)
 */
export function planUpload(local, remote) {
  const plan = { toUpload: [], identical: [], conflicts: [] };
  for (const clip of local) {
    const etag = remote.get(clip.key);
    if (etag === undefined) plan.toUpload.push(clip);
    else if (etag === clip.md5) plan.identical.push(clip);
    else plan.conflicts.push(clip);
  }
  return plan;
}

/**
 * Résumé des langues d'un index : « fr (lucie-v3-1, test, défaut non) », puis ses autres
 * voix : « en (sulafat-v1-1, all, défaut oui ; aussi jane-v1-1 test) »
 */
export function describeLanguages(index) {
  const entries = Object.entries(index?.languages ?? {});
  if (!entries.length) return 'aucune';
  return entries
    .map(([lang, e]) => {
      const others = (e.alternatives ?? []).map(v => `${v.version} ${v.audience}`).join(', ');
      const also = others ? ` ; aussi ${others}` : '';
      return `${lang} (${e.version}, ${e.audience}, défaut ${e.defaultOn ? 'oui' : 'non'}${also})`;
    })
    .join(', ');
}

/** Un manifeste vide (mauvais --out, --lang ou version) ne publie rien */
function requireClips(manifest, paths) {
  if (!Object.keys(manifest.clips).length) {
    throw new Error(
      `Manifeste vide ou absent (${paths.manifestFile}) : vérifier --out, --lang et la version`
    );
  }
}

/**
 * Clips locaux, chacun vérifié contre son entrée de manifeste (taille et sha256) : un
 * fichier remplacé ou abîmé depuis sa génération ne part jamais
 */
async function localClips(paths, manifest) {
  const clips = [];
  const mismatches = [];
  for (const [key, entry] of Object.entries(manifest.clips)) {
    const file = path.join(paths.clipDir, `${key}.mp3`);
    const data = await fsp.readFile(file).catch(() => null);
    if (!data) mismatches.push(`${key} (fichier absent)`);
    else if (data.length !== entry.bytes || hash('sha256', data) !== entry.sha256) {
      mismatches.push(`${key} (contenu différent du manifeste)`);
    } else clips.push({ key, file, md5: hash('md5', data) });
  }
  if (mismatches.length) {
    throw new Error(
      `${mismatches.length} clips ne correspondent pas au manifeste : ` +
        `${mismatches.slice(0, 5).join(', ')}${mismatches.length > 5 ? '…' : ''} ; ` +
        'lancer node scripts/voice/check.mjs --lang <langue> --probe'
    );
  }
  return clips;
}

async function remoteObjects(run, bucket, prefix) {
  const out = await run([
    's3api',
    'list-objects-v2',
    '--bucket',
    bucket,
    '--prefix',
    prefix,
    '--output',
    'json',
  ]);
  const contents = out.trim() ? (JSON.parse(out).Contents ?? []) : [];
  return new Map(
    contents.map(object => [
      path.basename(object.Key, '.mp3'),
      String(object.ETag).replaceAll('"', ''),
    ])
  );
}

async function publishClips(ctx) {
  const { run, bucket, lang, voice, paths, manifest, dryRun, log } = ctx;
  const prefix = `voice/${lang}/${voice.version}/`;
  const plan = planUpload(
    await localClips(paths, manifest),
    await remoteObjects(run, bucket, prefix)
  );
  log(
    `${plan.toUpload.length} clips à envoyer, ${plan.identical.length} déjà en ligne, ` +
      `${plan.conflicts.length} en conflit`
  );
  if (plan.conflicts.length) {
    throw new Error(
      `Clips déjà publiés avec un autre contenu (jamais réécrits) : ${plan.conflicts
        .slice(0, 5)
        .map(c => c.key)
        .join(', ')}… : donner une nouvelle version à la voix`
    );
  }
  if (!plan.toUpload.length || dryRun) return plan;
  // Dossier d'envoi : des liens vers les seuls clips manquants
  const staging = await fsp.mkdtemp(path.join(os.tmpdir(), 'voice-upload-'));
  try {
    for (const clip of plan.toUpload) {
      await fsp.symlink(clip.file, path.join(staging, `${clip.key}.mp3`));
    }
    await run([
      's3',
      'cp',
      staging,
      `s3://${bucket}/${prefix}`,
      '--recursive',
      '--content-type',
      'audio/mpeg',
      '--cache-control',
      CLIP_CACHE_CONTROL,
      '--only-show-errors',
    ]);
  } finally {
    await fsp.rm(staging, { recursive: true, force: true });
  }
  return plan;
}

/** La CLI AWS dit-elle seulement que l'objet n'existe pas ? */
export function isMissingObject(error) {
  const text = `${error?.message ?? ''} ${error?.stderr ?? ''}`;
  return /NoSuchKey|\(404\)|Not Found|does not exist/i.test(text);
}

function refuseUnlessForced(force, reason, fallback = null) {
  if (force) return fallback;
  throw new Error(
    `Index distant : ${reason}. Rien n'est écrit ; --force repart d'un index vide ` +
      '(les autres langues seraient perdues).'
  );
}

function parseRemoteIndex(raw, force) {
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return refuseUnlessForced(force, 'JSON illisible');
  }
  const index = parseVoiceIndex(data);
  if (!index) return refuseUnlessForced(force, 'index invalide (schéma ou forme)');
  const dropped = Object.keys(data.languages ?? {}).filter(lang => !index.languages[lang]);
  if (dropped.length) {
    return refuseUnlessForced(force, `langues invalides : ${dropped.join(', ')}`, index);
  }
  return index;
}

/**
 * Index distant validé ; null seulement s'il n'existe pas encore. Réécrire l'index sur une
 * lecture ratée couperait toutes les langues : toute autre erreur arrête la commande.
 */
async function readRemoteIndex(run, bucket, force) {
  let raw;
  try {
    raw = await run(['s3', 'cp', `s3://${bucket}/${INDEX_KEY}`, '-']);
  } catch (error) {
    if (isMissingObject(error)) return null;
    return refuseUnlessForced(force, `lecture impossible (${firstLine(error)})`);
  }
  return parseRemoteIndex(raw, force);
}

/**
 * Avant d'annoncer une langue : chaque clip du manifeste est en ligne et identique, et
 * chaque phrase du corpus a son clip. --allow-missing accepte des manques, jamais un
 * clip en ligne qui diffère du manifeste.
 */
async function assertPublishable(ctx) {
  const { run, bucket, lang, voice, paths, manifest, phrases, allowMissing, log } = ctx;
  const prefix = `voice/${lang}/${voice.version}/`;
  const plan = planUpload(
    await localClips(paths, manifest),
    await remoteObjects(run, bucket, prefix)
  );
  if (plan.conflicts.length) {
    throw new Error(
      `${plan.conflicts.length} clips en ligne diffèrent du manifeste : langue non publiée`
    );
  }
  const offline = plan.toUpload.length;
  const uncovered = phrases.filter(phrase => !manifest.clips[phrase.key]).length;
  if ((offline || uncovered) && !allowMissing) {
    throw new Error(
      `Langue non publiée : ${offline} clips pas encore en ligne, ${uncovered} phrases du ` +
        'corpus sans clip (commande clips, génération à compléter, ou --allow-missing)'
    );
  }
  log(
    `${plan.identical.length} clips en ligne et identiques` +
      (offline || uncovered ? ` ; accepté : ${offline} hors ligne, ${uncovered} sans clip` : '')
  );
}

async function writeRemoteIndex(ctx, index) {
  const { run, bucket, distribution, dryRun, log } = ctx;
  log(JSON.stringify(index, null, 2));
  if (dryRun) return;
  const file = path.join(await fsp.mkdtemp(path.join(os.tmpdir(), 'voice-index-')), 'index.json');
  await fsp.writeFile(file, `${JSON.stringify(index, null, 2)}\n`);
  await run([
    's3',
    'cp',
    file,
    `s3://${bucket}/${INDEX_KEY}`,
    '--content-type',
    'application/json',
    '--cache-control',
    'no-cache',
  ]);
  await fsp.rm(path.dirname(file), { recursive: true, force: true });
  if (distribution) {
    await run([
      'cloudfront',
      'create-invalidation',
      '--distribution-id',
      distribution,
      '--paths',
      `/${INDEX_KEY}`,
    ]);
  } else {
    log('Pas de distribution : index non invalidé (cache CloudFront de quelques minutes)');
  }
}

/**
 * Dossier voice/ d'un site local : liens vers les clips, index de la langue. Une autre voix
 * (--version) rejoint celles de la langue, déjà dans l'index local.
 */
async function publishLocal(ctx) {
  const { site, lang, voice, paths, audience, defaultOn, dryRun, log } = ctx;
  const voiceDir = path.join(site, 'voice');
  const target = path.join(voiceDir, lang, voice.version);
  const indexFile = path.join(voiceDir, 'index.json');
  const current = fs.existsSync(indexFile)
    ? parseVoiceIndex(JSON.parse(fs.readFileSync(indexFile, 'utf8')))
    : null;
  const index = ctx.alternative
    ? withAlternative(current, lang, voice.version, alternativeEntry(voice, audience))
    : withLanguage(current, lang, indexEntry(voice, { audience, defaultOn }));
  log(`${target} → ${paths.clipDir}`);
  if (!dryRun) {
    await fsp.mkdir(path.dirname(target), { recursive: true });
    await fsp.rm(target, { recursive: true, force: true });
    await fsp.symlink(paths.clipDir, target, 'dir');
    await fsp.writeFile(indexFile, `${JSON.stringify(index, null, 2)}\n`);
  }
  return index;
}

const CLI_OPTIONS = {
  '--dry-run': flagOption('dryRun'),
  '--default-on': flagOption('defaultOn'),
  '--allow-missing': flagOption('allowMissing'),
  '--force': flagOption('force'),
  '--lang': valueOption('lang'),
  '--bucket': valueOption('bucket'),
  '--distribution': valueOption('distribution'),
  '--audience': valueOption('audience'),
  '--out': pathOption('out'),
  '--site': pathOption('site'),
  '--version': valueOption('version'),
  '--remove': flagOption('remove'),
};

/**
 * Options de la ligne de commande, vérifiées : commande connue en premier, chaque option à
 * valeur suivie d'une valeur, langue et audience valides
 * @param {string[]} argv
 * @param {Object} [env]
 */
export function parsePublishArgs(argv, env = process.env) {
  const [command, ...options] = argv;
  if (!COMMANDS.includes(command)) {
    throw new Error(`Commande attendue en premier : ${COMMANDS.join(', ')}`);
  }
  const args = parseOptions(options, CLI_OPTIONS, {
    command,
    out: DEFAULT_OUT,
    audience: 'test',
    defaultOn: false,
    dryRun: false,
    allowMissing: false,
    force: false,
    remove: false,
    site: ROOT,
    bucket: env.VOICE_BUCKET,
    distribution: env.CLOUDFRONT_DISTRIB,
  });
  assertLangCode(args.lang);
  if (!VOICE_AUDIENCES.includes(args.audience)) {
    throw new Error(`--audience attend ${VOICE_AUDIENCES.join(' ou ')}`);
  }
  if (args.command !== 'local' && !args.bucket)
    throw new Error('--bucket (ou VOICE_BUCKET) requis');
  assertVersionOption(args);
  return args;
}

/** --version : exigé par alternative, refusé à index et remove (voix par défaut seulement) */
function assertVersionOption({ command, version }) {
  if (command === 'alternative' && !version) {
    throw new Error('alternative : --version requis (une voix de alternatives.json)');
  }
  if (version && !VERSION_COMMANDS.includes(command)) {
    throw new Error(
      `${command} : --version ne va qu'avec ${VERSION_COMMANDS.join(', ')} ; ` +
        "l'index ne publie que la voix par défaut (voices.json)"
    );
  }
}

/** Lit l'index distant, le transforme, puis l'écrit (avec le résumé avant et après) */
async function updateIndex(ctx, update) {
  const current = await readRemoteIndex(ctx.run, ctx.bucket, ctx.force);
  const index = update(current);
  ctx.log(`Langues avant : ${describeLanguages(current)}`);
  ctx.log(`Langues après : ${describeLanguages(index)}`);
  await writeRemoteIndex(ctx, index);
  return index;
}

function publishIndex(ctx, entry) {
  return updateIndex(ctx, current => withLanguage(current, ctx.lang, entry));
}

/**
 * Autre voix de la langue : ajoutée si chacun de ses clips est en ligne et identique (et
 * chaque phrase du corpus couverte), ou retirée (--remove) sans rien vérifier
 */
async function publishAlternative(ctx, phrases) {
  const { lang, version } = ctx;
  if (version === loadVoice(lang).version) {
    throw new Error(`${version} est la voix par défaut de ${lang} : commande index`);
  }
  if (ctx.remove) return updateIndex(ctx, current => withAlternative(current, lang, version, null));
  ctx.phrases = phrases ?? buildCorpus(lang);
  ctx.voice = loadVoiceVersion(lang, version);
  ctx.paths = storePaths(ctx.out, lang, version);
  ctx.manifest = readManifest(ctx.paths, lang, ctx.voice);
  requireClips(ctx.manifest, ctx.paths);
  const alternative = alternativeEntry(ctx.voice, ctx.audience);
  await assertPublishable(ctx);
  return updateIndex(ctx, current => withAlternative(current, lang, version, alternative));
}

/**
 * Exécute une commande de publication
 * @param {Object} args - Voir parsePublishArgs
 * @param {{run?: Function, log?: Function, phrases?: Array<{key: string}>}} [io]
 *   phrases : corpus de la langue (défaut : buildCorpus)
 */
export async function publish(args, { run = awsCli, log = console.log, phrases } = {}) {
  const ctx = { ...args, run, log };
  // Coupe-circuit : ni voix ni manifeste nécessaires, il doit marcher de n'importe où
  if (args.command === 'remove') return publishIndex(ctx, null);
  if (args.command === 'alternative') return publishAlternative(ctx, phrases);
  openStore(ctx);
  if (args.command === 'clips') return publishClips(ctx);
  if (args.command === 'local') return publishLocal(ctx);
  return publishLanguage(ctx, phrases);
}

/**
 * Voix visée (--version, sinon la voix par défaut), son rangement et son manifeste, dont
 * chaque clip doit être là
 */
function openStore(ctx) {
  const { lang, version } = ctx;
  ctx.voice ??= loadVoiceVersion(lang, version);
  ctx.alternative = Boolean(version) && version !== loadVoice(lang).version;
  ctx.paths = storePaths(ctx.out, lang, ctx.voice.version);
  ctx.manifest = readManifest(ctx.paths, lang, ctx.voice);
  requireClips(ctx.manifest, ctx.paths);
}

/** Voix par défaut de la langue dans l'index distant */
async function publishLanguage(ctx, phrases) {
  // L'entrée d'abord : refusée par les règles du jeu, rien n'est ni lu ni envoyé
  const entry = indexEntry(ctx.voice, { audience: ctx.audience, defaultOn: ctx.defaultOn });
  ctx.phrases = phrases ?? buildCorpus(ctx.lang);
  await assertPublishable(ctx);
  return publishIndex(ctx, entry);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  Promise.resolve()
    .then(() => publish(parsePublishArgs(process.argv.slice(2))))
    .catch(error => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
