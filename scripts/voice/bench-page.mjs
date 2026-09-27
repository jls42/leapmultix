// Page d'un banc d'écoute (bench.mjs), à publier en artifact : les voix côte à côte (débit,
// doutes de Whisper, tout écouter), chaque phrase dite par chacune, puis le choix du
// propriétaire. Le choix va dans le stockage partagé de l'artifact, document choix/<id> ;
// hors artifact (fichier local), il reste dans le navigateur.
//
// Le fichier est un fragment : l'artifact l'enveloppe dans son propre squelette (doctype,
// head, body), d'où le <title> et le <style> en tête.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { escapeHtml } from './listen-page.mjs';
import { saidText } from './said-text.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const STYLE_FILE = path.join(HERE, 'bench-page.css');
const SCRIPT_FILE = path.join(HERE, 'bench-page.client.js');

/** Police lisible pour les enfants comme pour l'écoute sur téléphone, avec ses replis */
const FONT_LINK =
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&amp;display=swap">';

/** Triangle de lecture en caractère texte (U+FE0E) : sans lui, certains systèmes dessinent un émoji */
const PLAY = '▶\uFE0E';

const PROVIDER_LABELS = { google: 'Google', mistral: 'Mistral', elevenlabs: 'ElevenLabs' };

const WHOLE_LANGUAGE = { fr: 'Tout le français', en: "Tout l'anglais", es: "Tout l'espagnol" };

/** Réponse « aucune voix » du choix principal */
export const NONE = 'aucune';

const number = value => value.toLocaleString('fr-FR');
const plural = (count, one, many) => `${number(count)} ${count > 1 ? many : one}`;

/** Débit d'une voix, en secondes par caractère dit */
function rateText(rate) {
  if (rate === null) return 'débit inconnu';
  const value = rate.toLocaleString('fr-FR', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
  return `${value} s par caractère`;
}

function whisperText(voice) {
  if (!voice.judged) return 'Whisper : non passé';
  return `Whisper : ${plural(voice.doubts, 'doute', 'doutes')} sur ${number(voice.judged)}`;
}

function voiceCard(voice, phraseCount) {
  const origin = PROVIDER_LABELS[voice.voice.provider] ?? voice.voice.provider;
  const kind = voice.kind === 'reference' ? 'déjà dans le jeu' : 'candidate';
  const clips = Object.keys(voice.clips).length;
  const missing = phraseCount - clips;
  const absent = missing ? `<span>${plural(missing, 'phrase', 'phrases')} sans clip</span>` : '';
  return `<div class="voice ${voice.kind}">
<h3>${escapeHtml(voice.name)}</h3>
<p class="muted">${escapeHtml(origin)} · ${kind}${voice.note ? ` · ${escapeHtml(voice.note)}` : ''}</p>
<p class="stats"><span>${rateText(voice.rate)}</span><span>${whisperText(voice)}</span>${absent}</p>
<button type="button" class="all" data-voice="${voice.slug}"${clips ? '' : ' disabled'}>${PLAY} Tout écouter</button>
</div>`;
}

function playButton(voice, phrase) {
  const clip = voice.clips[phrase.key];
  if (!clip) return `<span class="missing">${escapeHtml(voice.name)} : pas de clip</span>`;
  const label = `${voice.name} : ${phrase.text}`;
  return `<button type="button" class="play${clip.flagged ? ' doubt' : ''}" data-src="${escapeHtml(clip.src)}" data-voice="${voice.slug}" data-label="${escapeHtml(label)}">${PLAY} ${escapeHtml(voice.name)}</button>`;
}

/** Ce que Whisper a entendu de travers, voix par voix */
function doubtLines(voices, phrase) {
  return voices
    .filter(voice => voice.clips[phrase.key]?.flagged)
    .map(
      voice =>
        `<p class="heard">${escapeHtml(voice.name)} : Whisper a entendu « ${escapeHtml(voice.clips[phrase.key].heard)} »</p>`
    )
    .join('\n');
}

function phraseItem(phrase, index, { voices, lang }) {
  const said =
    phrase.said === phrase.text
      ? ''
      : `<p class="muted">Texte dit : <span lang="${lang}">${escapeHtml(phrase.said)}</span></p>`;
  return `<li class="item">
<div class="head"><strong lang="${lang}">${escapeHtml(phrase.text)}</strong><span class="badge">${escapeHtml(phrase.family)}</span></div>
${said}
${doubtLines(voices, phrase)}
<div class="actions">
${voices.map(voice => playButton(voice, phrase)).join('\n')}
<button type="button" class="every" data-row="${index}">${PLAY} Toutes</button>
</div>
</li>`;
}

function radio(name, value, label, id) {
  return `<label class="pick" for="${id}"><input type="radio" name="${name}" id="${id}" value="${value}"> ${escapeHtml(label)}</label>`;
}

function choiceFieldsets({ voices, questions, texts }) {
  const candidates = voices.filter(voice => voice.kind === 'candidate');
  const main = `<fieldset>
<legend>${escapeHtml(texts.question)}</legend>
${candidates.map(voice => radio('pick', voice.slug, voice.name, `pick-${voice.slug}`)).join('\n')}
${radio('pick', NONE, texts.none, `pick-${NONE}`)}
</fieldset>`;
  const others = questions.map(
    question => `<fieldset data-question="${question.id}">
<legend>${escapeHtml(question.legend)}</legend>
${question.options.map(option => radio(`q-${question.id}`, option.value, option.label, `q-${question.id}-${option.value}`)).join('\n')}
</fieldset>`
  );
  return [main, ...others].join('\n');
}

/** Taille de la langue entière, pour mesurer ce qu'engage le choix */
function corpusLine(corpus, lang) {
  const chars = corpus.reduce((sum, phrase) => sum + [...saidText(phrase.text, lang)].length, 0);
  const whole = WHOLE_LANGUAGE[lang] ?? `Toute la langue ${lang}`;
  return `${whole} : ${plural(corpus.length, 'phrase', 'phrases')}, ${plural(chars, 'caractère dit', 'caractères dits')}.`;
}

/**
 * Page du banc et fichiers qu'elle cite
 * @param {Object} options
 * @param {Object} options.setup - Banc validé (benchSetup)
 * @param {Array<{key: string, text: string, family: string, said: string}>} options.phrases
 * @param {Object[]} options.voices - Résultats des voix (voiceResults), dans l'ordre du banc
 * @param {Array<{text: string}>} options.corpus - Corpus de la langue
 * @returns {{html: string, files: string[]}}
 */
export function buildBenchPage({ setup, phrases, voices, corpus }) {
  const { id, lang, texts } = setup;
  const files = voices.flatMap(voice => Object.values(voice.clips).map(clip => clip.src));
  const intro = texts.intro ? `<p>${escapeHtml(texts.intro)}</p>` : '';
  const note = [texts.note, corpusLine(corpus, lang)].filter(Boolean).map(escapeHtml).join(' ');
  const html = `<title>${escapeHtml(texts.name)}</title>
${FONT_LINK}
<style>
${fs.readFileSync(STYLE_FILE, 'utf8')}</style>
<main>
<header>
<h1>${escapeHtml(texts.title)}</h1>
${intro}
<p class="muted">${plural(phrases.length, 'phrase', 'phrases')} du jeu, tirées du corpus : annonces, bravos, erreurs, questions, énoncés, et les pièges (accords, 11, nombres à trois chiffres, long énoncé). Les boutons en rouge : Whisper a entendu autre chose.</p>
</header>
<section class="card" aria-labelledby="h-voix">
<h2 id="h-voix">Les voix</h2>
<div class="voices">
${voices.map(voice => voiceCard(voice, phrases.length)).join('\n')}
</div>
</section>
<section class="card" aria-labelledby="h-phrases">
<h2 id="h-phrases">Phrase par phrase</h2>
<p class="muted">« ${PLAY} Toutes » enchaîne les voix sur la même phrase, dans l'ordre des boutons.</p>
<ol class="items">
${phrases.map((phrase, index) => phraseItem(phrase, index, { voices, lang })).join('\n')}
</ol>
</section>
<section class="card decide" aria-labelledby="h-choix">
<h2 id="h-choix">Ton choix</h2>
<form id="choice" data-doc="choix/${id}" data-store="banc-${id}">
${choiceFieldsets({ voices, questions: setup.questions, texts })}
<label for="remarque">Remarque (facultatif)</label>
<textarea id="remarque" placeholder="Une phrase mal dite, un ton qui ne va pas…"></textarea>
<p class="status" id="status" aria-live="polite"></p>
<p class="muted">${note}</p>
</form>
</section>
</main>
<div id="player-bar" hidden><span id="now"></span><button type="button" id="stop">■ Stop</button></div>
<script>
${fs.readFileSync(SCRIPT_FILE, 'utf8')}</script>
`;
  return { html, files };
}
