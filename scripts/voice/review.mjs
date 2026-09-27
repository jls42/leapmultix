#!/usr/bin/env node
// Contrôle d'une langue en une commande, après une génération ou des refaits. Trois étapes :
// - Whisper transcrit les clips nouveaux ou changés (les autres sont déjà dans le fichier) ;
// - le contrôle de voice:check juge le rangement et les transcriptions ;
// - la page d'écoute (voice:listen) montre ce qu'il faut écouter.
// Aucun appel payant, rien de publié.
//
// Usage :
//   node scripts/voice/review.mjs --lang en [--out <dépôt des voix>] [--compare <liste>]
//     [--skip-whisper] [--python <interpréteur>] [--transcripts <fichier.jsonl>]
//     [--sample <n>] [--allow-missing] [--version <version>]
//   --version      : une autre voix de la langue (alternatives.json) ; ses fichiers de
//                    travail portent la version, pour ne pas se mêler à ceux de la voix par
//                    défaut
//   --python       : interpréteur de Whisper (défaut : .venv-whisper/bin/python du dossier
//                    courant)
//   --transcripts  : transcriptions lues et complétées (défaut : transcripts-<langue>.jsonl)
//   --skip-whisper : aucune transcription de plus, celles du fichier servent telles quelles
//   --compare      : page avant/après des clips refaits de la liste, au lieu de la page d'écoute
// Fichiers du dossier courant (ignorés par git) : transcripts-<langue>.jsonl et
// a-reecouter-<langue>.txt, ou transcripts-<langue>-<version>.jsonl et
// a-reecouter-<langue>-<version>.txt avec --version. Page : <dépôt des voix>/ecoute/.
// Code de sortie : 0 ; 1 si Whisper échoue, si le rangement est incohérent ou si une phrase
// manque (sauf --allow-missing).

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildCorpus } from './corpus.mjs';
import { checkClips, exitCode, printSummary, readTranscripts, writeFlagged } from './check.mjs';
import { readManifest, storePaths } from './clip-store.mjs';
import { DEFAULT_OUT, loadVoiceVersion } from './generate.mjs';
import { DEFAULT_SAMPLE, buildComparePage, buildListenPage, writePage } from './listen-page.mjs';
import {
  assertLangCode,
  flagOption,
  integerOption,
  parseOptions,
  pathOption,
  readKeyList,
  valueOption,
} from './cli-options.mjs';

const WHISPER_SCRIPT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'whisper_transcribe.py'
);

const CLI_OPTIONS = {
  '--lang': valueOption('lang'),
  '--version': valueOption('version'),
  '--out': pathOption('out'),
  '--compare': pathOption('compare'),
  '--python': pathOption('python'),
  '--transcripts': pathOption('transcripts'),
  '--sample': integerOption('sample'),
  '--skip-whisper': flagOption('skipWhisper'),
  '--allow-missing': flagOption('allowMissing'),
};

/**
 * Options, et fichiers de travail rangés dans le dossier courant
 * @param {string[]} argv
 * @param {string} [cwd]
 */
export function parseArgs(argv, cwd = process.cwd()) {
  const args = parseOptions(argv, CLI_OPTIONS, {
    out: DEFAULT_OUT,
    sample: DEFAULT_SAMPLE,
    skipWhisper: false,
    allowMissing: false,
  });
  assertLangCode(args.lang);
  // Une autre voix a ses propres fichiers : une transcription vaut pour un clip d'une voix
  const tag = args.version ? `${args.lang}-${args.version}` : args.lang;
  args.python ??= path.join(cwd, '.venv-whisper', 'bin', 'python');
  args.transcripts ??= path.join(cwd, `transcripts-${tag}.jsonl`);
  args.flagged = path.join(cwd, `a-reecouter-${tag}.txt`);
  return args;
}

/**
 * Lance Whisper sur les clips de la version. Sa sortie reste affichée : plus de 10 minutes
 * pour 7 000 clips, même sur GPU.
 * @param {{python: string, lang: string, paths: Object, transcripts: string}} options
 * @param {typeof spawnSync} [spawn]
 */
export function runWhisper({ python, lang, paths, transcripts }, spawn = spawnSync) {
  if (!fs.existsSync(python)) {
    throw new Error(
      `Interpréteur de Whisper introuvable : ${python}\n` +
        'Installer une fois : python3 -m venv .venv-whisper && ' +
        '.venv-whisper/bin/pip install -r scripts/voice/requirements-whisper.txt\n' +
        '(ou --python <interpréteur>, ou --skip-whisper)'
    );
  }
  const args = [WHISPER_SCRIPT, '--manifest', paths.manifestFile, '--clips', paths.clipDir];
  args.push('--lang', lang, '--out', transcripts);
  const result = spawn(python, args, { stdio: 'inherit' });
  if (result.error) throw new Error(`Whisper n'a pas pu démarrer : ${result.error.message}`);
  if (result.status !== 0) throw new Error(`Whisper a échoué (code ${result.status})`);
}

/** Page d'écoute, ou page avant/après avec --compare ; rend son chemin et son bilan */
async function writeReviewPage(args, context) {
  const page = args.compare
    ? buildComparePage({ ...context, keys: readKeyList(args.compare) })
    : buildListenPage({ ...context, sample: args.sample });
  return { file: await writePage(context.pageDir, page), summary: page.summary };
}

async function main(argv) {
  const args = parseArgs(argv);
  const voice = loadVoiceVersion(args.lang, args.version);
  const paths = storePaths(args.out, args.lang, voice.version);
  if (!fs.existsSync(paths.manifestFile)) {
    throw new Error(`Manifeste introuvable : ${paths.manifestFile} (dépôt des voix : --out)`);
  }
  if (!args.skipWhisper) runWhisper({ ...args, paths });
  const transcripts = fs.existsSync(args.transcripts)
    ? readTranscripts(args.transcripts)
    : undefined;
  const phrases = buildCorpus(args.lang);
  const report = await checkClips({
    lang: args.lang,
    phrases,
    voice,
    outDir: args.out,
    transcripts,
  });
  printSummary(report);
  writeFlagged(args.flagged, report);
  const context = {
    lang: args.lang,
    voice,
    manifest: readManifest(paths, args.lang, voice),
    transcripts: transcripts ?? [],
    paths,
    pageDir: path.join(args.out, 'ecoute'),
  };
  const { file, summary } = await writeReviewPage(args, context);
  console.log(`${summary}\nÀ réécouter : ${args.flagged}\n${pathToFileURL(file).href}`);
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
