#!/usr/bin/env node
// Vérifie en ligne les clips publiés d'une langue, comme le jeu les demandera : chaque
// adresse répond 200, en audio/mpeg, avec la taille du manifeste et un cache immuable ;
// l'index, s'il annonce la langue, pointe vers cette version.
//
// Usage :
//   node scripts/voice/check-online.mjs --lang fr [--base https://leapmultix.jls42.org/voice/]
//     [--out <dépôt des voix>] [--sample <n>] [--concurrency <n>]
// La distribution ne sert les clips qu'aux pages du jeu : la requête porte les en-têtes
// d'une lecture depuis le jeu (Sec-Fetch-Site: same-origin, Referer du site).

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseVoiceIndex, clipPath } from '../../js/core/voice-index.js';
import { readManifest, storePaths } from './clip-store.mjs';
import { DEFAULT_OUT, loadVoice } from './generate.mjs';

export const DEFAULT_BASE = 'https://leapmultix.jls42.org/voice/';

/** En-têtes d'une requête faite par le jeu lui-même */
export function gameHeaders(base) {
  return {
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    Referer: new URL('/', base).href,
  };
}

/** Problème d'une réponse de clip, ou null */
export function clipResponseProblem(res, expectedBytes) {
  if (res.status !== 200) return `HTTP ${res.status}`;
  const type = res.headers.get('content-type') ?? '';
  if (!type.startsWith('audio/mpeg')) return `type ${type || 'absent'}`;
  const length = Number(res.headers.get('content-length'));
  if (Number.isFinite(length) && length !== expectedBytes)
    return `taille ${length} ≠ ${expectedBytes}`;
  if (!/immutable/.test(res.headers.get('cache-control') ?? '')) return 'cache non immuable';
  return null;
}

async function pool(items, concurrency, task) {
  const queue = [...items];
  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length) await task(queue.shift());
  });
  await Promise.all(workers);
}

/**
 * @param {{lang: string, voice: Object, outDir: string, base: string, sample?: number,
 *   concurrency?: number, fetchImpl?: typeof fetch}} options
 */
export async function checkOnline({
  lang,
  voice,
  outDir,
  base,
  sample,
  concurrency = 16,
  fetchImpl = fetch,
}) {
  const manifest = readManifest(storePaths(outDir, lang, voice.version), lang, voice);
  const headers = gameHeaders(base);
  let entries = Object.entries(manifest.clips);
  if (sample && sample < entries.length) {
    const step = entries.length / sample;
    entries = Array.from({ length: sample }, (_, i) => entries[Math.floor(i * step)]);
  }
  const failures = [];
  await pool(entries, concurrency, async ([key, entry]) => {
    const url = new URL(clipPath(lang, voice, key), base).href;
    try {
      const res = await fetchImpl(url, { method: 'HEAD', headers });
      const problem = clipResponseProblem(res, entry.bytes);
      if (problem) failures.push({ key, url, problem });
    } catch (error) {
      failures.push({ key, url, problem: error.message });
    }
  });

  let index = null;
  try {
    const res = await fetchImpl(new URL('index.json', base).href, { headers });
    index = res.ok ? parseVoiceIndex(await res.json()) : null;
  } catch {
    index = null;
  }
  const listed = index?.languages[lang] ?? null;
  return {
    lang,
    version: voice.version,
    checked: entries.length,
    failures,
    index: listed ? { ...listed, matchesVersion: listed.version === voice.version } : null,
  };
}

function parseArgs(argv) {
  const args = { out: DEFAULT_OUT, base: DEFAULT_BASE };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--lang') args.lang = argv[++i];
    else if (arg === '--out') args.out = path.resolve(argv[++i]);
    else if (arg === '--base') args.base = argv[++i];
    else if (arg === '--sample') args.sample = Number(argv[++i]);
    else if (arg === '--concurrency') args.concurrency = Number(argv[++i]);
    else throw new Error(`Option inconnue : ${arg}`);
  }
  if (!args.lang) throw new Error('--lang est requis');
  return args;
}

async function main(argv) {
  const args = parseArgs(argv);
  const report = await checkOnline({
    lang: args.lang,
    voice: loadVoice(args.lang),
    outDir: args.out,
    base: args.base,
    sample: args.sample,
    concurrency: args.concurrency,
  });
  console.log(
    `${report.checked} clips vérifiés, ${report.failures.length} en échec ; index : ` +
      (report.index ? JSON.stringify(report.index) : 'langue absente')
  );
  for (const failure of report.failures.slice(0, 20))
    console.log(`  ${failure.problem} ${failure.url}`);
  return report.failures.length ? 1 : 0;
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
