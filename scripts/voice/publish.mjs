#!/usr/bin/env node
// Publication des clips d'une langue, depuis le dépôt privé des voix. Se lance sur le poste
// du propriétaire (identifiants AWS locaux), jamais dans la CI publique.
//
//   clips   envoie les clips manquants dans s3://<bucket>/voice/<langue>/<version>/
//           (audio/mpeg, cache d'un an, immuable) ; refuse de réécrire un clip publié
//   index   écrit la langue dans voice/index.json (no-cache), puis invalide son cache
//   remove  retire la langue de l'index (coupe-circuit), puis invalide
//   local   prépare <site>/voice/ pour un essai local (?voix=local) : liens vers les
//           clips et index, rien n'est envoyé
//
// Usage :
//   node scripts/voice/publish.mjs <commande> --lang fr [--out <dépôt des voix>]
//     [--bucket <nom>] [--distribution <id CloudFront>] [--audience test|all]
//     [--default-on] [--site <dossier du jeu>] [--dry-run]
// Bucket et distribution : options, ou variables VOICE_BUCKET et CLOUDFRONT_DISTRIB.
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
import { readManifest, storePaths } from './clip-store.mjs';
import { DEFAULT_OUT, loadVoice } from './generate.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const CLIP_CACHE_CONTROL = 'public, max-age=31536000, immutable';
export const INDEX_KEY = 'voice/index.json';

const md5 = data => crypto.createHash('md5').update(data).digest('hex');

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
  const languages = { ...(current?.languages ?? {}) };
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

async function localClips(paths, manifest) {
  const clips = [];
  for (const key of Object.keys(manifest.clips)) {
    const file = path.join(paths.clipDir, `${key}.mp3`);
    clips.push({ key, file, md5: md5(await fsp.readFile(file)) });
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

async function readRemoteIndex(run, bucket) {
  try {
    return parseVoiceIndex(JSON.parse(await run(['s3', 'cp', `s3://${bucket}/${INDEX_KEY}`, '-'])));
  } catch {
    return null;
  }
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
  if (dryRun) return index;
  await fsp.mkdir(path.dirname(target), { recursive: true });
  await fsp.rm(target, { recursive: true, force: true });
  await fsp.symlink(paths.clipDir, target, 'dir');
  await fsp.writeFile(indexFile, `${JSON.stringify(index, null, 2)}\n`);
  return index;
}

function parseArgs(argv) {
  const args = {
    command: argv[0],
    out: DEFAULT_OUT,
    audience: 'test',
    defaultOn: false,
    dryRun: false,
    site: ROOT,
    bucket: process.env.VOICE_BUCKET,
    distribution: process.env.CLOUDFRONT_DISTRIB,
  };
  const values = {
    '--lang': 'lang',
    '--bucket': 'bucket',
    '--distribution': 'distribution',
    '--audience': 'audience',
  };
  for (let i = 1; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--default-on') args.defaultOn = true;
    else if (arg === '--out') args.out = path.resolve(argv[++i]);
    else if (arg === '--site') args.site = path.resolve(argv[++i]);
    else if (values[arg]) args[values[arg]] = argv[++i];
    else throw new Error(`Option inconnue : ${arg}`);
  }
  if (!['clips', 'index', 'remove', 'local'].includes(args.command)) {
    throw new Error('Commande attendue : clips, index, remove ou local');
  }
  if (!args.lang) throw new Error('--lang est requis');
  if (args.command !== 'local' && !args.bucket)
    throw new Error('--bucket (ou VOICE_BUCKET) requis');
  return args;
}

/**
 * Exécute une commande de publication
 * @param {Object} args - Voir parseArgs
 * @param {{run?: Function, log?: Function}} [io]
 */
export async function publish(args, { run = awsCli, log = console.log } = {}) {
  const voice = args.voice ?? loadVoice(args.lang);
  const paths = storePaths(args.out, args.lang, voice.version);
  const manifest = readManifest(paths, args.lang, voice);
  const ctx = { ...args, voice, paths, manifest, run, log };
  if (args.command === 'clips') return publishClips(ctx);
  if (args.command === 'local') return publishLocal(ctx);
  const current = await readRemoteIndex(run, args.bucket);
  const entry =
    args.command === 'index'
      ? indexEntry(voice, { audience: args.audience, defaultOn: args.defaultOn })
      : null;
  const index = withLanguage(current, args.lang, entry);
  await writeRemoteIndex(ctx, index);
  return index;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  Promise.resolve()
    .then(() => publish(parseArgs(process.argv.slice(2))))
    .catch(error => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
