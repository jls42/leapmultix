#!/usr/bin/env node
// Pages d'écoute des clips d'une langue, à ouvrir dans le navigateur (fichier local, dans
// le dépôt privé des voix, hors git) : Whisper soupçonne, l'oreille tranche.
//
// - Page d'écoute (par défaut) : les clips signalés (Whisper : nombres entendus différents
//   ou phrase éloignée ; durée anormale), puis un échantillon des phrases dont le texte dit
//   diffère de la phrase (formes féminines « une fois 7 », que Whisper ne distingue pas ;
//   textes imposés de said-text.mjs).
// - Comparaison (--compare <fichier>) : chaque clip refait de la liste, celle passée à
//   generate.mjs --redo. L'ancien clip (mis de côté par la génération) et le nouveau, avec
//   ce que Whisper a entendu de chacun.
//
// Chaque clip a sa case « à refaire » : les cases cochées forment la liste à copier dans
// ecartes.txt, pour generate.mjs --redo. Elles restent cochées d'une ouverture à l'autre
// (stockage du navigateur), tant que le clip n'a pas changé.
//
// Usage :
//   node scripts/voice/listen-page.mjs --lang fr [--out <dépôt des voix>]
//     [--transcripts <fichier.jsonl>] [--sample <n>] [--compare <fichier>]
//   --transcripts : sortie de whisper_transcribe.py (sans elle, seules les durées signalent)
//   --sample      : taille de l'échantillon des textes dits différents (défaut : 24)
//   --compare     : empreintes des clips refaits, une par ligne
// Écrit <dépôt des voix>/ecoute/<langue>-<version>.html, ou <langue>-<version>-refaits.html
// avec --compare, et en affiche l'adresse.

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SAID_OVERRIDES } from './said-text.mjs';
import { compareTranscript } from './transcript-compare.mjs';
import { durationOutliers, readTranscripts, transcriptReport } from './check.mjs';
import { clipFile, readManifest, replacedFile, sha256, storePaths } from './clip-store.mjs';
import { DEFAULT_OUT, loadVoice } from './generate.mjs';
import {
  assertLangCode,
  integerOption,
  parseOptions,
  pathOption,
  readKeyList,
  valueOption,
} from './cli-options.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const STYLE_FILE = path.join(HERE, 'listen-page.css');
const SCRIPT_FILE = path.join(HERE, 'listen-page.client.js');

/** Taille par défaut de l'échantillon des textes dits différents */
export const DEFAULT_SAMPLE = 24;

const HTML_ESCAPES = new Map([
  ['&', '&amp;'],
  ['<', '&lt;'],
  ['>', '&gt;'],
  ['\x22', '&quot;'],
  ['\x27', '&#39;'],
]);

/** Texte sûr dans la page, en contenu comme en attribut (phrases, transcriptions) */
export function escapeHtml(value) {
  return String(value ?? '').replaceAll(/[&<>\x22\x27]/g, char => HTML_ESCAPES.get(char));
}

const decimal = (value, digits) =>
  value.toLocaleString('fr-FR', { minimumFractionDigits: digits, maximumFractionDigits: digits });

/** Transcriptions rangées par empreinte, dans l'ordre du fichier */
function transcriptsByKey(transcripts) {
  const byKey = new Map();
  for (const line of transcripts) {
    if (!byKey.has(line.key)) byKey.set(line.key, []);
    byKey.get(line.key).push(line);
  }
  return byKey;
}

/** Ce que Whisper a entendu du contenu actuel (une ligne sans sha256 vaut pour lui) */
function heardNow(lines, sha) {
  return lines.findLast(line => !line.sha256 || line.sha256 === sha)?.heard;
}

/** count éléments régulièrement espacés d'une liste (toute la liste si elle est plus courte) */
export function evenlySpaced(list, count) {
  if (count <= 0) return [];
  if (count >= list.length) return [...list];
  const step = list.length / count;
  return Array.from({ length: count }, (_, index) => list[Math.floor(index * step)]);
}

/**
 * Échantillon des phrases dont le texte dit diffère : les textes imposés d'abord (tous,
 * peu nombreux), puis les accords en genre, régulièrement espacés dans l'ordre des empreintes
 * @returns {string[]} empreintes
 */
export function saidSample(manifest, lang, size) {
  if (size <= 0) return [];
  const imposed = SAID_OVERRIDES[lang] ?? new Map();
  const differing = Object.keys(manifest.clips)
    .filter(key => manifest.clips[key].said !== manifest.clips[key].text)
    .sort((a, b) => a.localeCompare(b));
  const first = differing.filter(key => imposed.has(manifest.clips[key].text));
  const others = differing.filter(key => !imposed.has(manifest.clips[key].text));
  return [...first, ...evenlySpaced(others, size - first.length)].slice(0, size);
}

/**
 * Clips de la page d'écoute : signalés (Whisper, puis durée), puis échantillon des textes
 * dits différents
 * @returns {{flagged: Object[], said: Object[], byWhisper: number}}
 */
export function listenItems({ manifest, transcripts = [], lang, sample = DEFAULT_SAMPLE }) {
  const byKey = transcriptsByKey(transcripts);
  const imposed = SAID_OVERRIDES[lang] ?? new Map();
  const card = (key, reason, detail) => {
    const entry = manifest.clips[key];
    const heard = heardNow(byKey.get(key) ?? [], entry.sha256);
    return { key, reason, detail, text: entry.text, said: entry.said, sha256: entry.sha256, heard };
  };
  const whisper = transcriptReport(transcripts, manifest, lang).flagged.map(flag =>
    card(
      flag.key,
      flag.numbersMatch ? 'Phrase éloignée' : 'Nombres entendus différents',
      `similarité ${decimal(flag.similarity, 2)}`
    )
  );
  const seen = new Set(whisper.map(item => item.key));
  const durations = durationOutliers(Object.entries(manifest.clips))
    .filter(outlier => !seen.has(outlier.key))
    .map(outlier => card(outlier.key, 'Durée anormale', `${decimal(outlier.duration, 1)} s`));
  const said = saidSample(manifest, lang, sample).map(key => {
    const entry = manifest.clips[key];
    const reason = imposed.has(entry.text) ? 'Texte imposé' : 'Accord en genre';
    return card(key, reason, `${decimal(entry.duration, 1)} s`);
  });
  return { flagged: [...whisper, ...durations], said, byWhisper: whisper.length };
}

/** Verdict de Whisper sur le nouveau clip : juste, douteux, ou pas encore transcrit */
function verdictOf(text, heard, lang) {
  if (heard === undefined) return 'pending';
  return compareTranscript(text, heard, lang).flagged ? 'doubt' : 'ok';
}

function compareItem(key, entry, { lines, paths, lang }) {
  const kept = fs.existsSync(replacedFile(paths, key));
  const keptSha = kept ? sha256(fs.readFileSync(replacedFile(paths, key))) : null;
  // Ancien clip gardé : sa transcription exacte ; sinon, la dernière d'un autre contenu
  const before = kept
    ? lines.findLast(line => line.sha256 === keptSha)
    : lines.findLast(line => line.sha256 && line.sha256 !== entry.sha256);
  const heardAfter = heardNow(lines, entry.sha256);
  return {
    key,
    text: entry.text,
    said: entry.said,
    sha256: entry.sha256,
    kept,
    heardBefore: before?.heard,
    heardAfter,
    verdict: verdictOf(entry.text, heardAfter, lang),
  };
}

/**
 * Clips refaits d'une liste, l'ancien et le nouveau ; les empreintes sans clip (génération
 * à relancer) sont rendues à part
 * @returns {{items: Object[], missing: string[]}}
 */
export function compareItems({ manifest, transcripts = [], keys, paths, lang }) {
  const byKey = transcriptsByKey(transcripts);
  const items = [];
  const missing = [];
  for (const key of new Set(keys)) {
    if (Object.hasOwn(manifest.clips, key)) {
      const context = { lines: byKey.get(key) ?? [], paths, lang };
      items.push(compareItem(key, manifest.clips[key], context));
    } else {
      missing.push(key);
    }
  }
  return { items, missing };
}

/** Adresse relative d'un fichier depuis la page, pour <audio src> */
const hrefFrom = (pageDir, file) =>
  path.relative(pageDir, file).split(path.sep).map(encodeURIComponent).join('/');

const capitalize = text => text.charAt(0).toUpperCase() + text.slice(1);

function redoBox(item, label) {
  const sha = escapeHtml((item.sha256 ?? '').slice(0, 12));
  const aria = escapeHtml(`${capitalize(label)} : ${item.text}`);
  return (
    `<label class="redo"><input type="checkbox" class="redo-box" value="${escapeHtml(item.key)}"` +
    ` data-sha="${sha}" aria-label="${aria}"> ${escapeHtml(label)}</label>`
  );
}

/** Lignes « terme : valeur » ; une valeur vide n'est pas rendue */
function rows(pairs) {
  return pairs
    .filter(([, value]) => value)
    .map(([term, value]) => `<dt>${escapeHtml(term)}</dt><dd>${escapeHtml(value)}</dd>`)
    .join('');
}

const audio = src => `<audio controls preload="none" src="${escapeHtml(src)}"></audio>`;

function listenCard(item, src) {
  const said = item.said === item.text ? '' : item.said;
  return `<li class="card">
<div class="head">${redoBox(item, 'à refaire')} <code>${escapeHtml(item.key)}</code> <span class="reason">${escapeHtml(item.reason)}</span> <span class="detail">${escapeHtml(item.detail)}</span></div>
<dl>${rows([
    ['Phrase', item.text],
    ['Texte dit', said],
    ['Whisper', item.heard],
  ])}</dl>
${audio(src)}
</li>`;
}

const VERDICTS = new Map([
  ['ok', { tone: 'ok', text: 'Whisper : juste' }],
  ['doubt', { tone: 'doubt', text: 'Whisper doute encore' }],
  ['pending', { tone: 'pending', text: 'Pas encore transcrit : relancer Whisper' }],
]);

function compareCard(item, { beforeSrc, afterSrc }) {
  const verdict = VERDICTS.get(item.verdict);
  const said = item.said === item.text ? '' : item.said;
  const before = item.kept ? audio(beforeSrc) : '<p class="muted">Ancien clip non gardé</p>';
  return `<li class="card">
<div class="head">${redoBox(item, 'encore à refaire')} <code>${escapeHtml(item.key)}</code> <span class="badge ${verdict.tone}">${escapeHtml(verdict.text)}</span></div>
<dl>${rows([
    ['Phrase', item.text],
    ['Texte dit', said],
    ['Whisper avant', item.heardBefore],
    ['Whisper après', item.heardAfter],
  ])}</dl>
<div class="pair">
<figure><figcaption>Avant</figcaption>${before}</figure>
<figure><figcaption>Après</figcaption>${audio(afterSrc)}</figure>
</div>
</li>`;
}

/** Section de cartes, ou une phrase qui dit qu'elle est vide */
function section(title, cards, empty) {
  const body = cards.length
    ? `<ol>${cards.join('\n')}</ol>`
    : `<p class="muted">${escapeHtml(empty)}</p>`;
  return `<h2>${escapeHtml(title)}</h2>\n${body}`;
}

/** Page complète : style et script insérés, panneau de la liste à copier */
function pageHtml({ title, voiceLabel, store, labels, intro, sections }) {
  const fullTitle = `${title} — ${voiceLabel}`;
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(fullTitle)}</title>
<style>
${fs.readFileSync(STYLE_FILE, 'utf8')}</style>
</head>
<body>
<main>
<h1>${escapeHtml(title)} <span class="nowrap">— ${escapeHtml(voiceLabel)}</span></h1>
${intro}
<div class="panel" id="redo-panel" data-store="${escapeHtml(store)}" data-one="${escapeHtml(labels.one)}" data-many="${escapeHtml(labels.many)}">
<textarea id="redo-list" readonly aria-label="Empreintes des clips à refaire"></textarea>
<p><button type="button" id="redo-copy">Copier la liste</button> <span id="redo-count" class="muted" aria-live="polite"></span> <span id="redo-status" class="muted" aria-live="polite"></span></p>
</div>
${sections.join('\n')}
</main>
<script>
${fs.readFileSync(SCRIPT_FILE, 'utf8')}</script>
</body>
</html>
`;
}

const plural = (count, one, many) => `${count} ${count > 1 ? many : one}`;

/**
 * Page d'écoute : clips signalés, puis échantillon des textes dits différents
 * @returns {{name: string, html: string, summary: string}}
 */
export function buildListenPage({ lang, voice, manifest, transcripts, sample, paths, pageDir }) {
  const { flagged, said, byWhisper } = listenItems({ manifest, transcripts, lang, sample });
  const src = item => hrefFrom(pageDir, clipFile(paths, item.key));
  const counted = `${plural(flagged.length, 'clip signalé', 'clips signalés')} (Whisper : ${byWhisper}, durée : ${flagged.length - byWhisper})`;
  const noWhisper = transcripts?.length
    ? ''
    : ' Sans transcriptions Whisper (<code>--transcripts</code>), seules les durées signalent.';
  const intro = `<p class="muted">${counted}, puis ${plural(said.length, 'phrase', 'phrases')} dont le texte dit diffère : formes féminines, que Whisper ne distingue pas («&nbsp;un&nbsp;» et «&nbsp;une&nbsp;» s'écrivent «&nbsp;1&nbsp;»), et textes imposés. Un signalement n'est pas un verdict : seule l'oreille tranche.${noWhisper}</p>
<p>Cocher «&nbsp;à refaire&nbsp;» chaque clip faux, puis copier la liste dans <code>ecartes.txt</code> : <code>node --env-file=&lt;.env&gt; scripts/voice/generate.mjs --lang ${escapeHtml(lang)} --redo ecartes.txt</code> (payant), relancer Whisper, puis comparer avec <code>npm run voice:listen -- --lang ${escapeHtml(lang)} --transcripts &lt;fichier&gt; --compare ecartes.txt</code>.</p>`;
  const html = pageHtml({
    title: 'Écoute des clips',
    voiceLabel: `${lang} ${voice.version}`,
    store: `ecoute-${lang}-${voice.version}`,
    labels: { one: 'clip à refaire', many: 'clips à refaire' },
    intro,
    sections: [
      section(
        'Signalés par Whisper ou par leur durée',
        flagged.map(item => listenCard(item, src(item))),
        'Aucun clip signalé.'
      ),
      section(
        'Texte dit différent de la phrase (échantillon)',
        said.map(item => listenCard(item, src(item))),
        'Aucune phrase dont le texte dit diffère.'
      ),
    ],
  });
  return {
    name: `${lang}-${voice.version}.html`,
    html,
    summary: `Page d'écoute ${lang} ${voice.version} : ${counted}, ${plural(said.length, 'texte dit différent', 'textes dits différents')}`,
  };
}

/**
 * Page de comparaison des clips refaits d'une liste
 * @returns {{name: string, html: string, summary: string}}
 */
export function buildComparePage({ lang, voice, manifest, transcripts, keys, paths, pageDir }) {
  const { items, missing } = compareItems({ manifest, transcripts, keys, paths, lang });
  const count = verdict => items.filter(item => item.verdict === verdict).length;
  const tally =
    `Whisper : ${plural(count('ok'), 'juste', 'justes')}, ${count('doubt')} douteux, ` +
    plural(count('pending'), 'pas encore transcrit', 'pas encore transcrits');
  const absent = missing.length
    ? `<p><strong>Sans clip (génération à relancer) :</strong> <code>${escapeHtml(missing.join(' '))}</code></p>`
    : '';
  const intro = `<p class="muted">${plural(items.length, 'clip refait', 'clips refaits')} (${tally}). Écouter «&nbsp;Après&nbsp;» ; cocher «&nbsp;encore à refaire&nbsp;» si c'est toujours faux, puis relancer <code>generate.mjs --redo</code> avec la liste. Un clip encore mal dit après deux ou trois essais : lui imposer un texte dit (<code>SAID_OVERRIDES</code>, <code>scripts/voice/said-text.mjs</code>).</p>
${absent}`;
  const html = pageHtml({
    title: 'Clips refaits',
    voiceLabel: `${lang} ${voice.version}`,
    store: `ecoute-${lang}-${voice.version}-refaits`,
    labels: { one: 'clip encore à refaire', many: 'clips encore à refaire' },
    intro,
    sections: [
      section(
        'Avant et après',
        items.map(item =>
          compareCard(item, {
            beforeSrc: hrefFrom(pageDir, replacedFile(paths, item.key)),
            afterSrc: hrefFrom(pageDir, clipFile(paths, item.key)),
          })
        ),
        'Aucun clip refait dans cette liste.'
      ),
    ],
  });
  return {
    name: `${lang}-${voice.version}-refaits.html`,
    html,
    summary: `Comparaison ${lang} ${voice.version} : ${plural(items.length, 'clip refait', 'clips refaits')} (${tally}), ${missing.length} sans clip`,
  };
}

const CLI_OPTIONS = {
  '--lang': valueOption('lang'),
  '--out': pathOption('out'),
  '--transcripts': pathOption('transcripts'),
  '--sample': integerOption('sample'),
  '--compare': pathOption('compare'),
};

export function parseArgs(argv) {
  const args = parseOptions(argv, CLI_OPTIONS, { out: DEFAULT_OUT, sample: DEFAULT_SAMPLE });
  assertLangCode(args.lang);
  return args;
}

/**
 * Écrit une page dans <dépôt des voix>/ecoute/ et rend son chemin
 * @param {string} pageDir
 * @param {{name: string, html: string}} page
 */
export async function writePage(pageDir, page) {
  await fsp.mkdir(pageDir, { recursive: true });
  const file = path.join(pageDir, page.name);
  await fsp.writeFile(file, page.html);
  return file;
}

async function main(argv) {
  const args = parseArgs(argv);
  const voice = loadVoice(args.lang);
  const paths = storePaths(args.out, args.lang, voice.version);
  if (!fs.existsSync(paths.manifestFile)) {
    throw new Error(`Manifeste introuvable : ${paths.manifestFile} (dépôt des voix : --out)`);
  }
  const context = {
    lang: args.lang,
    voice,
    manifest: readManifest(paths, args.lang, voice),
    transcripts: readTranscripts(args.transcripts) ?? [],
    paths,
    pageDir: path.join(args.out, 'ecoute'),
  };
  const page = args.compare
    ? buildComparePage({ ...context, keys: readKeyList(args.compare) })
    : buildListenPage({ ...context, sample: args.sample });
  const file = await writePage(context.pageDir, page);
  console.log(`${page.summary}\n${pathToFileURL(file).href}`);
  return 0;
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
