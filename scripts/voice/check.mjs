#!/usr/bin/env node
// Contrôle des clips d'une langue dans le dépôt privé des voix, avant tout envoi :
// chaque phrase du corpus a son clip, le manifeste et les fichiers concordent, et (en
// option) chaque clip est un MP3 valide dont l'empreinte n'a pas bougé, et sa
// transcription Whisper redonne les nombres de la phrase.
//
// Usage :
//   node scripts/voice/check.mjs --lang fr [--out <dépôt des voix>] [--probe]
//     [--transcripts <fichier.jsonl>] [--flagged <fichier>] [--allow-missing] [--json]
//   --transcripts : sortie de whisper_transcribe.py ({ key, heard } par ligne)
//   --flagged     : écrit les empreintes à réécouter, une par ligne (pour generate --redo)
// Code de sortie 1 si une phrase manque (sauf --allow-missing) ou si le rangement est
// incohérent ; les transcriptions douteuses se réécoutent, elles n'échouent pas.

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { buildCorpus } from './corpus.mjs';
import { saidText } from './said-text.mjs';
import { clipProblem, probeClip } from './audio-process.mjs';
import { flagOption, parseOptions, pathOption, valueOption } from './cli-options.mjs';
import { compareTranscript } from './transcript-compare.mjs';
import { clipFile, readManifest, sha256, storePaths } from './clip-store.mjs';
import { DEFAULT_OUT, loadVoice } from './generate.mjs';

/** Secondes par caractère dit hors desquelles un clip est à réécouter */
export const SECONDS_PER_CHAR = { min: 0.03, max: 0.2 };

const charCount = text => [...text].length;

function missingReport(missing, lang) {
  const byFamily = {};
  for (const phrase of missing) byFamily[phrase.family] = (byFamily[phrase.family] ?? 0) + 1;
  return {
    count: missing.length,
    chars: missing.reduce((sum, phrase) => sum + charCount(saidText(phrase.text, lang)), 0),
    byFamily,
  };
}

async function probeEntries(entries, paths, probe) {
  const invalid = [];
  const changed = [];
  for (const [key, entry] of entries) {
    const file = clipFile(paths, key);
    const problem = clipProblem(await probe(file).catch(() => ({ codec: '' })));
    if (problem) invalid.push({ key, text: entry.text, problem });
    if (sha256(await fsp.readFile(file)) !== entry.sha256) changed.push({ key, text: entry.text });
  }
  return { invalid, changed };
}

function durationOutliers(entries) {
  return entries
    .map(([key, entry]) => ({
      key,
      text: entry.text,
      duration: entry.duration,
      perChar: entry.duration / Math.max(charCount(entry.said), 1),
    }))
    .filter(({ perChar }) => perChar < SECONDS_PER_CHAR.min || perChar > SECONDS_PER_CHAR.max);
}

/**
 * Transcriptions comparées aux phrases. La dernière ligne d'un clip fait foi ; une ligne
 * écrite pour un autre contenu du clip (refait depuis) est périmée et ignorée.
 */
function transcriptReport(transcripts, manifest, lang) {
  const latest = new Map(transcripts.map(line => [line.key, line]));
  const flagged = [];
  let checked = 0;
  let stale = 0;
  for (const { key, heard, sha256: heardSha } of latest.values()) {
    const entry = manifest.clips[key];
    if (!entry) continue;
    if (heardSha && heardSha !== entry.sha256) {
      stale++;
      continue;
    }
    checked++;
    const result = compareTranscript(entry.text, heard, lang);
    if (result.flagged) flagged.push({ key, text: entry.text, said: entry.said, heard, ...result });
  }
  return { checked, stale, flagged };
}

/**
 * Contrôle des clips d'une langue
 * @param {Object} options
 * @param {string} options.lang
 * @param {Array<{text: string, key: string, family: string}>} options.phrases
 * @param {Object} options.voice
 * @param {string} options.outDir
 * @param {Function} [options.probe] - ffprobe (contrôle des fichiers), sinon non fait
 * @param {Array<{key: string, heard: string}>} [options.transcripts]
 */
export async function checkClips({ lang, phrases, voice, outDir, probe, transcripts }) {
  const paths = storePaths(outDir, lang, voice.version);
  const manifest = readManifest(paths, lang, voice);
  const inCorpus = new Set(phrases.map(phrase => phrase.key));
  const entries = Object.entries(manifest.clips);
  const files = fs.existsSync(paths.clipDir)
    ? fs.readdirSync(paths.clipDir).filter(name => name.endsWith('.mp3'))
    : [];
  const fileKeys = new Set(files.map(name => name.slice(0, -'.mp3'.length)));

  const report = {
    lang,
    version: voice.version,
    phrases: phrases.length,
    clips: entries.filter(([key]) => inCorpus.has(key) && fileKeys.has(key)).length,
    missing: missingReport(
      phrases.filter(phrase => !manifest.clips[phrase.key]),
      lang
    ),
    stale: entries
      .filter(([key, entry]) => inCorpus.has(key) && entry.said !== saidText(entry.text, lang))
      .map(([key, entry]) => ({ key, text: entry.text })),
    entriesWithoutFile: entries.filter(([key]) => !fileKeys.has(key)).map(([key]) => key),
    filesWithoutEntry: [...fileKeys].filter(key => !manifest.clips[key]),
    orphans: entries
      .filter(([key]) => !inCorpus.has(key))
      .map(([key, e]) => ({ key, text: e.text })),
    durationOutliers: durationOutliers(entries),
  };
  if (probe) {
    const present = entries.filter(([key]) => fileKeys.has(key));
    Object.assign(report, await probeEntries(present, paths, probe));
  }
  if (transcripts) report.transcripts = transcriptReport(transcripts, manifest, lang);
  return report;
}

/** Listes du bilan dont un seul élément rend le rangement incohérent */
const INCONSISTENCIES = ['stale', 'entriesWithoutFile', 'filesWithoutEntry'];
/** Les mêmes, établies seulement par --probe (absentes sinon) */
const PROBE_INCONSISTENCIES = ['invalid', 'changed'];

/** Le rangement est-il cohérent (hors phrases manquantes) ? */
export function isConsistent(report) {
  return (
    INCONSISTENCIES.every(field => report[field].length === 0) &&
    PROBE_INCONSISTENCIES.every(field => !report[field]?.length)
  );
}

const CLI_OPTIONS = {
  '--lang': valueOption('lang'),
  '--out': pathOption('out'),
  '--probe': flagOption('probe'),
  '--allow-missing': flagOption('allowMissing'),
  '--json': flagOption('json'),
  '--transcripts': valueOption('transcripts'),
  '--flagged': valueOption('flagged'),
};

function parseArgs(argv) {
  const args = parseOptions(argv, CLI_OPTIONS, {
    out: DEFAULT_OUT,
    probe: false,
    allowMissing: false,
    json: false,
  });
  if (!args.lang) throw new Error('--lang est requis');
  return args;
}

function printSummary(report) {
  const lines = [
    `${report.lang} ${report.version} : ${report.clips}/${report.phrases} clips`,
    `  manquants : ${report.missing.count} (${report.missing.chars} caractères) ${JSON.stringify(report.missing.byFamily)}`,
    `  périmés : ${report.stale.length}, entrées sans fichier : ${report.entriesWithoutFile.length}, fichiers sans entrée : ${report.filesWithoutEntry.length}, hors corpus : ${report.orphans.length}`,
    `  durées à réécouter : ${report.durationOutliers.length}`,
  ];
  if (report.invalid) {
    lines.push(`  invalides : ${report.invalid.length}, modifiés : ${report.changed.length}`);
  }
  if (report.transcripts) {
    lines.push(
      `  Whisper : ${report.transcripts.checked} transcrits, ${report.transcripts.flagged.length} à réécouter` +
        (report.transcripts.stale
          ? `, ${report.transcripts.stale} transcriptions périmées (relancer Whisper)`
          : '')
    );
  }
  console.log(lines.join('\n'));
}

/** Transcriptions Whisper d'un fichier JSONL, ou undefined sans fichier */
function readTranscripts(file) {
  if (!file) return undefined;
  return fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line));
}

/** Empreintes à réécouter (transcription douteuse, durée anormale), une par ligne */
function writeFlagged(file, report) {
  const keys = [
    ...(report.transcripts?.flagged ?? []).map(f => f.key),
    ...report.durationOutliers.map(o => o.key),
  ];
  fs.writeFileSync(file, `${[...new Set(keys)].join('\n')}\n`);
}

/** 1 si le rangement est incohérent, ou si une phrase manque sans --allow-missing */
function exitCode(report, allowMissing) {
  if (!isConsistent(report)) return 1;
  return report.missing.count > 0 && !allowMissing ? 1 : 0;
}

async function main(argv) {
  const args = parseArgs(argv);
  const transcripts = readTranscripts(args.transcripts);
  const report = await checkClips({
    lang: args.lang,
    phrases: buildCorpus(args.lang),
    voice: loadVoice(args.lang),
    outDir: args.out,
    probe: args.probe ? probeClip : undefined,
    transcripts,
  });
  if (args.json) console.log(JSON.stringify(report, null, 2));
  else printSummary(report);
  if (args.flagged) writeFlagged(args.flagged, report);
  return exitCode(report, args.allowMissing);
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
