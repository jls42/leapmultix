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
//
// Usage :
//   node scripts/voice/publish.mjs <commande> --lang fr [--out <dépôt des voix>]
//     [--bucket <nom>] [--distribution <id CloudFront>] [--audience test|all]
//     [--default-on] [--site <dossier du jeu>] [--dry-run] [--allow-missing] [--force]
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
import { VOICE_AUDIENCES, parseVoiceIndex } from '../../js/core/voice-index.js';
import {
  assertLangCode,
  flagOption,
  parseOptions,
  pathOption,
  valueOption,
} from './cli-options.mjs';
import { readManifest, storePaths } from './clip-store.mjs';
import { buildCorpus } from './corpus.mjs';
import { DEFAULT_OUT, loadVoice } from './generate.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const CLIP_CACHE_CONTROL = 'public, max-age=31536000, immutable';
export const INDEX_KEY = 'voice/index.json';
export const COMMANDS = ['clips', 'index', 'remove', 'local'];

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
 * Index avec la langue écrite (ou retirée si entry est null)
 * @param {Object|null} current - Index actuel (validé), ou null
 */
export function withLanguage(current, lang, entry) {
  const languages = { ...current?.languages };
  if (entry) languages[lang] = entry;
  else delete languages[lang];
  return { schema: VOICE_KEY_SCHEMA, languages };
}

/** Entrée d'index d'une voix */
export function indexEntry(voice, { audience = 'test', defaultOn = false } = {}) {
  if (!VOICE_AUDIENCES.includes(audience)) throw new Error(`Audience inconnue : ${audience}`);
  return { voice: voice.voice, version: voice.version, format: 'mp3', audience, defaultOn };
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

/** Résumé des langues d'un index : « fr (lucie-v3-1, test, défaut non) » */
export function describeLanguages(index) {
  const entries = Object.entries(index?.languages ?? {});
  if (!entries.length) return 'aucune';
  return entries
    .map(
      ([lang, e]) => `${lang} (${e.version}, ${e.audience}, défaut ${e.defaultOn ? 'oui' : 'non'})`
    )
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

/** Dossier voice/ d'un site local : liens vers les clips, index de la langue */
async function publishLocal(ctx) {
  const { site, lang, voice, paths, audience, defaultOn, dryRun, log } = ctx;
  const voiceDir = path.join(site, 'voice');
  const target = path.join(voiceDir, lang, voice.version);
  const indexFile = path.join(voiceDir, 'index.json');
  const current = fs.existsSync(indexFile)
    ? parseVoiceIndex(JSON.parse(fs.readFileSync(indexFile, 'utf8')))
    : null;
  const index = withLanguage(current, lang, indexEntry(voice, { audience, defaultOn }));
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
  return args;
}

async function publishIndex(ctx, entry) {
  const current = await readRemoteIndex(ctx.run, ctx.bucket, ctx.force);
  const index = withLanguage(current, ctx.lang, entry);
  ctx.log(`Langues avant : ${describeLanguages(current)}`);
  ctx.log(`Langues après : ${describeLanguages(index)}`);
  await writeRemoteIndex(ctx, index);
  return index;
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
  ctx.voice = args.voice ?? loadVoice(args.lang);
  ctx.paths = storePaths(args.out, args.lang, ctx.voice.version);
  ctx.manifest = readManifest(ctx.paths, args.lang, ctx.voice);
  requireClips(ctx.manifest, ctx.paths);
  if (args.command === 'clips') return publishClips(ctx);
  if (args.command === 'local') return publishLocal(ctx);
  ctx.phrases = phrases ?? buildCorpus(args.lang);
  await assertPublishable(ctx);
  const entry = indexEntry(ctx.voice, { audience: args.audience, defaultOn: args.defaultOn });
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
