#!/usr/bin/env node
// Vérifie en ligne les clips publiés d'une langue, comme le jeu les demandera : chaque
// adresse répond 200, en audio/mpeg, avec la taille du manifeste et un cache immuable ;
// l'index, s'il annonce la langue, pointe vers cette version.
//
// Usage :
//   node scripts/voice/check-online.mjs --lang fr [--base https://leapmultix.jls42.org/voice/]
//     [--out <dépôt des voix>] [--sample <n>] [--concurrency <n>] [--allow-other-version]
// Code de sortie 1 : un clip en échec ou non vérifié, un manifeste vide, un index
// illisible, ou un index qui annonce une autre version (--allow-other-version l'accepte :
// clips d'une nouvelle version envoyés, index pas encore publié). Un index absent (403,
// 404) n'est pas une erreur : la langue n'est simplement pas encore annoncée.
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

/** Entier ≥ 1, ou erreur (jamais de NaN silencieux) */
export function positiveInteger(value, option) {
  if (!/^\d+$/.test(String(value ?? '')) || Number(value) < 1) {
    throw new Error(`${option} attend un entier ≥ 1 (reçu : ${value})`);
  }
  return Number(value);
}

async function pool(items, concurrency, task) {
  const queue = [...items];
  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length) await task(queue.shift());
  });
  await Promise.all(workers);
}

/**
 * Index en ligne : { index } (null s'il n'est pas encore publié : 403 ou 404), ou
 * { error } s'il est injoignable, illisible ou invalide
 */
async function readOnlineIndex(fetchImpl, base, headers) {
  let res;
  try {
    res = await fetchImpl(new URL('index.json', base).href, { headers });
  } catch (error) {
    return { error: `index injoignable (${error.message})` };
  }
  if (res.status === 403 || res.status === 404) return { index: null };
  if (!res.ok) return { error: `index : HTTP ${res.status}` };
  try {
    const index = parseVoiceIndex(await res.json());
    return index ? { index } : { error: 'index invalide (schéma ou forme)' };
  } catch {
    return { error: 'index illisible (JSON)' };
  }
}

function sampled(entries, sample) {
  if (!sample || sample >= entries.length) return entries;
  const step = entries.length / sample;
  return Array.from({ length: sample }, (_, i) => entries[Math.floor(i * step)]);
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
  const workers = positiveInteger(concurrency, '--concurrency');
  const paths = storePaths(outDir, lang, voice.version);
  const manifest = readManifest(paths, lang, voice);
  const all = Object.entries(manifest.clips);
  if (!all.length) {
    throw new Error(`Manifeste vide ou absent (${paths.manifestFile}) : rien à vérifier`);
  }
  const entries = sampled(
    all,
    sample === undefined ? undefined : positiveInteger(sample, '--sample')
  );
  const headers = gameHeaders(base);
  const failures = [];
  let checked = 0;
  await pool(entries, workers, async ([key, entry]) => {
    const url = new URL(clipPath(lang, voice, key), base).href;
    checked++;
    try {
      const res = await fetchImpl(url, { method: 'HEAD', headers });
      const problem = clipResponseProblem(res, entry.bytes);
      if (problem) failures.push({ key, url, problem });
    } catch (error) {
      failures.push({ key, url, problem: error.message });
    }
  });

  const online = await readOnlineIndex(fetchImpl, base, headers);
  const listed = online.index?.languages[lang] ?? null;
  return {
    lang,
    version: voice.version,
    planned: entries.length,
    checked,
    failures,
    indexError: online.error ?? null,
    index: listed ? { ...listed, matchesVersion: listed.version === voice.version } : null,
  };
}

/**
 * Ce qui fait échouer la vérification (code de sortie 1)
 * @param {Object} report - Bilan de checkOnline
 * @param {{allowOtherVersion?: boolean}} [options]
 * @returns {string[]}
 */
export function onlineProblems(report, { allowOtherVersion = false } = {}) {
  const problems = [];
  if (report.checked !== report.planned) {
    problems.push(`${report.planned - report.checked} clips non vérifiés`);
  }
  if (report.failures.length) problems.push(`${report.failures.length} clips en échec`);
  if (report.indexError) problems.push(report.indexError);
  if (report.index && !report.index.matchesVersion && !allowOtherVersion) {
    problems.push(`l'index annonce la version ${report.index.version}, pas ${report.version}`);
  }
  return problems;
}

const VALUES = { '--lang': 'lang', '--out': 'out', '--base': 'base' };
const COUNTS = { '--sample': 'sample', '--concurrency': 'concurrency' };

/**
 * Options de la ligne de commande, vérifiées (valeurs présentes, nombres entiers ≥ 1)
 * @param {string[]} argv
 */
export function parseCheckOnlineArgs(argv) {
  const args = { out: DEFAULT_OUT, base: DEFAULT_BASE, concurrency: 16, allowOtherVersion: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--allow-other-version') {
      args.allowOtherVersion = true;
      continue;
    }
    const name = VALUES[arg] ?? COUNTS[arg];
    if (!name) throw new Error(`Option inconnue : ${arg}`);
    const value = argv[++i];
    if (value === undefined || value.startsWith('--')) throw new Error(`Valeur manquante : ${arg}`);
    args[name] = COUNTS[arg] ? positiveInteger(value, arg) : value;
  }
  if (!/^[a-z]{2}$/.test(args.lang ?? '')) throw new Error('--lang attend un code (fr, en, es)');
  args.out = path.resolve(args.out);
  return args;
}

function indexSummary(report) {
  if (report.indexError) return report.indexError;
  return report.index ? JSON.stringify(report.index) : 'langue pas encore annoncée';
}

async function main(argv) {
  const args = parseCheckOnlineArgs(argv);
  const report = await checkOnline({
    lang: args.lang,
    voice: loadVoice(args.lang),
    outDir: args.out,
    base: args.base,
    sample: args.sample,
    concurrency: args.concurrency,
  });
  console.log(
    `${report.checked}/${report.planned} clips vérifiés, ${report.failures.length} en échec ; ` +
      `index : ${indexSummary(report)}`
  );
  for (const failure of report.failures.slice(0, 20))
    console.log(`  ${failure.problem} ${failure.url}`);
  const problems = onlineProblems(report, { allowOtherVersion: args.allowOtherVersion });
  for (const problem of problems) console.log(`Échec : ${problem}`);
  return problems.length ? 1 : 0;
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
