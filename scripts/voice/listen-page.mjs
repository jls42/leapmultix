#!/usr/bin/env node
// Pages d'écoute des clips d'une langue, à ouvrir dans le navigateur (fichier local, dans
// le dépôt privé des voix, hors git) : Whisper soupçonne, l'oreille tranche.
//
// - Page d'écoute (par défaut) : les clips signalés, seuls à écouter (Whisper : nombres
//   entendus différents ou phrase éloignée ; durée anormale), puis, à part, un échantillon
//   facultatif, pour la forme, de clips que rien ne signale (textes imposés de la langue ou
//   de la voix, formes féminines « une fois 7 » que Whisper ne distingue pas, autres clips).
//   Avec --keys, la page se limite à un lot, les nouveaux clips par exemple.
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
//     [--version <version>] [--keys <fichier>]
//   --version     : une autre voix de la langue (alternatives.json)
//   --transcripts : sortie de whisper_transcribe.py (sans elle, seules les durées signalent)
//   --sample      : taille de l'échantillon pour la forme (défaut : 12)
//   --compare     : empreintes des clips refaits, une par ligne
//   --keys        : empreintes d'un lot, une par ligne : page limitée à ces clips (la durée
//                   se juge toujours au débit de toute la voix)
// Écrit <dépôt des voix>/ecoute/<langue>-<version>.html, <langue>-<version>-lot.html avec
// --keys, ou <langue>-<version>-refaits.html avec --compare, et en affiche l'adresse.

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SAID_OVERRIDES, hasAgreement } from './said-text.mjs';
import { compareTranscript } from './transcript-compare.mjs';
import { durationOutliers, readTranscripts, transcriptReport } from './check.mjs';
import { clipFile, readManifest, replacedFile, sha256, storePaths } from './clip-store.mjs';
import { DEFAULT_OUT, loadVoiceVersion } from './generate.mjs';
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

/**
 * Taille par défaut de l'échantillon pour la forme. Le propriétaire n'écoute que les clips
 * signalés ; l'échantillon, à part sur la page, s'écoute si l'on veut
 */
export const DEFAULT_SAMPLE = 12;

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
 * Texte dit imposé : pour toute la langue (SAID_OVERRIDES) ou pour la voix seule (son
 * saidOverrides, dans voices.json ou alternatives.json)
 * @returns {(text: string) => string|undefined} raison affichée, ou rien
 */
function imposedReason(lang, voice) {
  const language = SAID_OVERRIDES[lang] ?? new Map();
  const ownTexts = new Set(Object.keys(voice?.saidOverrides ?? {}));
  return text => {
    if (language.has(text)) return 'Texte imposé';
    if (ownTexts.has(text)) return 'Texte imposé (voix)';
    return undefined;
  };
}

/** Raison d'un clip de l'échantillon : texte imposé, accord en genre, ou clip ordinaire */
function sampleReason(entry, lang, reasonOf) {
  if (entry.said === entry.text) return 'Échantillon';
  const imposed = reasonOf(entry.text);
  if (imposed) return imposed;
  return hasAgreement(entry.text, lang) ? 'Accord en genre' : 'Échantillon';
}

/**
 * Échantillon pour la forme, parmi les clips que rien ne signale : textes imposés (de la
 * langue ou de la voix) sur la moitié au plus, puis accords en genre, puis autres clips,
 * chaque groupe régulièrement espacé dans l'ordre des empreintes. En espagnol, les nombres
 * dits en lettres font différer presque tous les textes dits : seuls les accords comptent
 * comme tels, le reste va aux autres clips.
 * @param {Object} [options]
 * @param {Object} [options.voice] - entrée de la voix, pour ses textes imposés
 * @param {Set<string>} [options.only] - empreintes d'un lot : seules proposées
 * @param {Set<string>} [options.skip] - empreintes déjà signalées, jamais proposées
 * @returns {string[]} empreintes
 */
export function saidSample(manifest, lang, size, { voice, only, skip = new Set() } = {}) {
  if (size <= 0) return [];
  const reasonOf = imposedReason(lang, voice);
  const groups = new Map([
    ['Texte imposé', []],
    ['Texte imposé (voix)', []],
    ['Accord en genre', []],
    ['Échantillon', []],
  ]);
  Object.keys(manifest.clips)
    .filter(key => (!only || only.has(key)) && !skip.has(key))
    .sort((a, b) => a.localeCompare(b))
    .forEach(key => groups.get(sampleReason(manifest.clips[key], lang, reasonOf)).push(key));
  const imposed = [...groups.get('Texte imposé'), ...groups.get('Texte imposé (voix)')];
  const first = evenlySpaced(imposed, Math.ceil(size / 2));
  const second = evenlySpaced(groups.get('Accord en genre'), size - first.length);
  const rest = size - first.length - second.length;
  return [...first, ...second, ...evenlySpaced(groups.get('Échantillon'), rest)];
}

/**
 * Clips de la page d'écoute : signalés (Whisper, puis durée), à écouter, puis échantillon
 * pour la forme. only (empreintes d'un lot) limite les deux ; la durée se juge au débit de
 * toute la voix.
 * @returns {{flagged: Object[], said: Object[], byWhisper: number}}
 */
export function listenItems({
  manifest,
  transcripts = [],
  lang,
  sample = DEFAULT_SAMPLE,
  voice,
  only,
}) {
  const byKey = transcriptsByKey(transcripts);
  const reasonOf = imposedReason(lang, voice);
  const inBatch = key => !only || only.has(key);
  const card = (key, reason, detail) => {
    const entry = manifest.clips[key];
    const heard = heardNow(byKey.get(key) ?? [], entry.sha256);
    return { key, reason, detail, text: entry.text, said: entry.said, sha256: entry.sha256, heard };
  };
  const whisper = transcriptReport(transcripts, manifest, lang)
    .flagged.filter(flag => inBatch(flag.key))
    .map(flag =>
      card(
        flag.key,
        flag.numbersMatch ? 'Phrase éloignée' : 'Nombres entendus différents',
        `similarité ${decimal(flag.similarity, 2)}`
      )
    );
  const seen = new Set(whisper.map(item => item.key));
  const durations = durationOutliers(Object.entries(manifest.clips))
    .filter(outlier => !seen.has(outlier.key) && inBatch(outlier.key))
    .map(outlier => card(outlier.key, 'Durée anormale', `${decimal(outlier.duration, 1)} s`));
  const flagged = [...whisper, ...durations];
  const skip = new Set(flagged.map(item => item.key));
  const said = saidSample(manifest, lang, sample, { voice, only, skip }).map(key => {
    const entry = manifest.clips[key];
    return card(key, sampleReason(entry, lang, reasonOf), `${decimal(entry.duration, 1)} s`);
  });
  return { flagged, said, byWhisper: whisper.length };
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

/**
 * Section de cartes, ou une phrase qui dit qu'elle est vide ; tone la marque : « must » (à
 * écouter) ou « optional » (pour la forme)
 */
function section(title, cards, empty, tone = 'must') {
  const body = cards.length
    ? `<ol>${cards.join('\n')}</ol>`
    : `<p class="muted">${escapeHtml(empty)}</p>`;
  return `<section class="${tone}">\n<h2>${escapeHtml(title)}</h2>\n${body}\n</section>`;
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

/** Introduction de la page d'écoute : ce qui est à écouter, ce qui ne l'est pas */
function listenIntro({ lang, counted, sampled, hasTranscripts }) {
  const noWhisper = hasTranscripts
    ? ''
    : ' Sans transcriptions Whisper (<code>--transcripts</code>), seules les durées signalent.';
  return `<p><strong>À écouter : la première partie seulement</strong>, ${counted}. Whisper y doute d'un nombre ou de la phrase, ou la durée est anormale : seule l'oreille tranche.${noWhisper}</p>
<p class="muted">La seconde partie, ${plural(sampled, 'clip', 'clips')} que rien ne signale, n'est qu'un échantillon pour la forme, facultatif : textes imposés, formes féminines (Whisper écrit «&nbsp;1&nbsp;» pour «&nbsp;un&nbsp;» comme pour «&nbsp;une&nbsp;»), puis d'autres clips.</p>
<p>Cocher «&nbsp;à refaire&nbsp;» chaque clip faux, puis copier la liste dans <code>ecartes.txt</code> : <code>node --env-file=&lt;.env&gt; scripts/voice/generate.mjs --lang ${escapeHtml(lang)} --redo ecartes.txt --max-total-chars &lt;plafond&gt;</code> (payant, dans le plafond accordé), relancer Whisper, puis comparer avec <code>npm run voice:listen -- --lang ${escapeHtml(lang)} --transcripts &lt;fichier&gt; --compare ecartes.txt</code>.</p>`;
}

/**
 * Page d'écoute : clips signalés, à écouter, puis échantillon pour la forme ; keys (un lot)
 * limite la page à ces clips
 * @returns {{name: string, html: string, summary: string}}
 */
export function buildListenPage({
  lang,
  voice,
  manifest,
  transcripts,
  sample,
  keys,
  paths,
  pageDir,
}) {
  const only = keys ? new Set(keys) : undefined;
  const items = listenItems({ manifest, transcripts, lang, sample, voice, only });
  const { flagged, said, byWhisper } = items;
  const src = item => hrefFrom(pageDir, clipFile(paths, item.key));
  const counted = `${plural(flagged.length, 'clip signalé', 'clips signalés')} (Whisper : ${byWhisper}, durée : ${flagged.length - byWhisper})`;
  const suffix = only ? '-lot' : '';
  const batch = only ? ` (lot de ${only.size})` : '';
  const html = pageHtml({
    title: only ? `Écoute d'un lot de ${plural(only.size, 'clip', 'clips')}` : 'Écoute des clips',
    voiceLabel: `${lang} ${voice.version}`,
    store: `ecoute-${lang}-${voice.version}${suffix}`,
    labels: { one: 'clip à refaire', many: 'clips à refaire' },
    intro: listenIntro({
      lang,
      counted,
      sampled: said.length,
      hasTranscripts: transcripts?.length > 0,
    }),
    sections: [
      section(
        'À écouter : signalés par Whisper ou par leur durée',
        flagged.map(item => listenCard(item, src(item))),
        'Aucun clip signalé : rien à écouter.'
      ),
      section(
        'Pour la forme : échantillon facultatif, rien de signalé',
        said.map(item => listenCard(item, src(item))),
        'Aucun clip à proposer.',
        'optional'
      ),
    ],
  });
  return {
    name: `${lang}-${voice.version}${suffix}.html`,
    html,
    summary: `Page d'écoute ${lang} ${voice.version}${batch} : à écouter, ${counted} ; pour la forme, ${plural(said.length, 'clip', 'clips')}`,
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
  '--version': valueOption('version'),
  '--out': pathOption('out'),
  '--transcripts': pathOption('transcripts'),
  '--sample': integerOption('sample'),
  '--compare': pathOption('compare'),
  '--keys': pathOption('keys'),
};

export function parseArgs(argv) {
  const args = parseOptions(argv, CLI_OPTIONS, { out: DEFAULT_OUT, sample: DEFAULT_SAMPLE });
  assertLangCode(args.lang);
  if (args.keys && args.compare) throw new Error('--keys et --compare ne vont pas ensemble');
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
  const voice = loadVoiceVersion(args.lang, args.version);
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
    : buildListenPage({
        ...context,
        sample: args.sample,
        keys: args.keys ? readKeyList(args.keys) : undefined,
      });
  const file = await writePage(context.pageDir, page);
  console.log(`${page.summary}\n${pathToFileURL(file).href}`);
  return 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    process.exitCode = await main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
