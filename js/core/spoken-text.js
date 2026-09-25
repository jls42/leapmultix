// spoken-text.js - Phrases prononcées : leur forme, leur forme canonique, leur empreinte.
//
// La voix enregistrée retrouve chaque clip par l'empreinte de la phrase passée à
// speak(), sans manifeste : le jeu la calcule à la lecture, les scripts du corpus à
// l'enregistrement. Les deux côtés appellent donc ces mêmes fonctions, y compris pour
// composer les questions lues. Module pur, sans DOM : les scripts Node l'importent.
//
// Les fonctions qui composent une phrase reçoivent `translate(key, params)`, qui rend
// le texte traduit ou null si la clé manque.

/** Modes annoncés à leur démarrage (GameMode.start : « <mode>_mode ») */
export const ANNOUNCED_MODES = ['quiz', 'challenge', 'adventure', 'discovery', 'arcade'];

/** Mots prononcés pour les symboles d'une égalité */
const SPOKEN_SYMBOL_KEYS = [
  ['×', 'speech_times'],
  ['+', 'speech_plus'],
  ['−', 'speech_minus'],
  ['÷', 'speech_divided_by'],
  ['=', 'speech_equals'],
];

/** Questions telles qu'elles s'affichent : « 7 × 8 = ? » et, à trou, « 7 × ? = 56 » */
const DISPLAYED_QUESTION = /^\s*(\d+)\s*([×+−÷])\s*(\d+)\s*=\s*\?\s*$/;
const DISPLAYED_GAP_QUESTION = /^\s*(\d+)\s*([×+−÷])\s*\?\s*=\s*(\d+)\s*$/;

/**
 * Forme prononcée d'une égalité : « 8 × 6 = 47 » → « 8 fois 6 égale 47 ». Sans
 * traduction, le symbole reste tel quel : la synthèse le lit dans sa langue, plutôt
 * qu'un mot français dans une partie en anglais ou en espagnol.
 * @param {string} text
 * @param {(key: string, params?: Object) => string|null} translate
 * @returns {string}
 */
export function spokenEquation(text, translate) {
  let spoken = String(text ?? '');
  for (const [symbol, key] of SPOKEN_SYMBOL_KEYS) {
    if (spoken.includes(symbol)) {
      spoken = spoken.replaceAll(symbol, ` ${translate(key) ?? symbol} `);
    }
  }
  return spoken.replaceAll(/\s+/g, ' ').trim();
}

/**
 * Mot prononcé pour un opérateur (« fois », « times », « por »), ou le symbole.
 * @param {string} operator
 * @param {(key: string, params?: Object) => string|null} translate
 * @returns {string}
 */
export function spokenOperatorWord(operator, translate) {
  const entry = SPOKEN_SYMBOL_KEYS.find(([symbol]) => symbol === operator);
  return (entry && translate(entry[1])) ?? String(operator);
}

/**
 * Question lue à voix haute : « 7 × 8 = ? » → « Combien font 7 fois 8 ? ».
 * Les nombres gardent l'ordre affiché (l'Aventure inverse parfois les facteurs). Un
 * texte d'une autre forme, comme un énoncé de problème, est lu tel quel.
 * @param {string} text - Question affichée
 * @param {(key: string, params?: Object) => string|null} translate
 * @returns {string}
 */
export function spokenQuestion(text, translate) {
  const match = DISPLAYED_QUESTION.exec(String(text ?? ''));
  if (!match) return spokenEquation(text, translate);
  const [, a, operator, b] = match;
  const expression = `${a} ${spokenOperatorWord(operator, translate)} ${b}`;
  return translate('speech_question', { expression }) ?? spokenEquation(text, translate);
}

/**
 * Question à trou lue à voix haute : « 7 × ? = 56 » → « 7 fois combien égale 56 ? ».
 * La réponse n'est jamais dite : seuls le nombre connu et le résultat le sont.
 * @param {string} text - Question affichée
 * @param {(key: string, params?: Object) => string|null} translate
 * @returns {string}
 */
export function spokenGapQuestion(text, translate) {
  const match = DISPLAYED_GAP_QUESTION.exec(String(text ?? ''));
  if (!match) return spokenEquation(text, translate);
  const [, a, operator, result] = match;
  const params = { a, operator: spokenOperatorWord(operator, translate), result };
  return translate('speech_gap_question', params) ?? spokenEquation(text, translate);
}

/**
 * Forme canonique d'une phrase : Unicode NFC, apostrophes typographiques ramenées à
 * l'apostrophe droite, blancs (espaces insécables comprises) réduits à une espace.
 * @param {string} text
 * @returns {string}
 */
export function normalizeSpokenText(text) {
  return String(text ?? '')
    .normalize('NFC')
    .replaceAll(/[\u2018\u2019\u02BC]/g, "'")
    .replaceAll(/\s+/g, ' ')
    .trim();
}

// Constantes de cyrb53. Tout entier inférieur à 2^53 est exact en double : PMD (Codacy) lit
// ces littéraux comme des flottants 32 bits et croit à tort qu'ils changent de valeur à
// l'exécution. Faux positif, écarté ligne par ligne.
const SEED_1 = 0xdeadbeef; // NOPMD - entier exact en double
const SEED_2 = 0x41c6ce57; // NOPMD - entier exact en double
const PRIME_1 = 2654435761; // NOPMD - entier exact en double
const PRIME_2 = 1597334677; // NOPMD - entier exact en double
const MIX_1 = 2246822507; // NOPMD - entier exact en double
const MIX_2 = 3266489909; // NOPMD - entier exact en double
const TWO_POW_32 = 4294967296; // NOPMD - entier exact en double

/**
 * Empreinte cyrb53 (53 bits) d'une chaîne, calculée sur ses unités UTF-16.
 * Algorithme de bryc, versé au domaine public.
 * @param {string} str
 * @returns {number}
 */
function cyrb53(str) {
  let h1 = SEED_1;
  let h2 = SEED_2;
  for (let i = 0; i < str.length; i++) {
    // Unités UTF-16, pas points de code : c'est la définition du schéma d'empreinte
    const ch = str.charCodeAt(i); // NOSONAR - codePointAt changerait les empreintes
    h1 = Math.imul(h1 ^ ch, PRIME_1);
    h2 = Math.imul(h2 ^ ch, PRIME_2);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), MIX_1);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), MIX_2);
  h2 = Math.imul(h2 ^ (h2 >>> 16), MIX_1);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), MIX_2);
  return TWO_POW_32 * (2097151 & h2) + (h1 >>> 0);
}

/** Version du schéma d'empreinte : elle change si la normalisation ou le calcul change */
export const VOICE_KEY_SCHEMA = 'cyrb53-nfc-1';

/**
 * Empreinte d'une phrase prononcée, en base 36 (au plus 11 caractères).
 * @param {string} text - Phrase telle que passée à speak()
 * @returns {string}
 */
export function voiceKey(text) {
  return cyrb53(normalizeSpokenText(text)).toString(36);
}
