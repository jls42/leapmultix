// Comparaison d'un clip transcrit par Whisper avec sa phrase : les nombres entendus
// doivent être ceux de la phrase, dans l'ordre, et le reste doit lui ressembler. Whisper
// écrit les nombres tantôt en chiffres, tantôt en lettres : les deux côtés passent par la
// même normalisation (minuscules, sans ponctuation, nombres en chiffres). Il ne distingue
// pas « un » de « une » : les formes féminines s'écoutent (voir docs/voix-enregistree.md).

const WORDS = {
  fr: {
    units: {
      zéro: 0,
      un: 1,
      une: 1,
      deux: 2,
      trois: 3,
      quatre: 4,
      cinq: 5,
      six: 6,
      sept: 7,
      huit: 8,
      neuf: 9,
      dix: 10,
      onze: 11,
      douze: 12,
      treize: 13,
      quatorze: 14,
      quinze: 15,
      seize: 16,
      vingt: 20,
      vingts: 20,
      trente: 30,
      quarante: 40,
      cinquante: 50,
      soixante: 60,
    },
    hundreds: ['cent', 'cents'],
    joiners: ['et'],
  },
  en: {
    units: {
      zero: 0,
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
      eleven: 11,
      twelve: 12,
      thirteen: 13,
      fourteen: 14,
      fifteen: 15,
      sixteen: 16,
      seventeen: 17,
      eighteen: 18,
      nineteen: 19,
      twenty: 20,
      thirty: 30,
      forty: 40,
      fifty: 50,
      sixty: 60,
      seventy: 70,
      eighty: 80,
      ninety: 90,
    },
    hundreds: ['hundred'],
    joiners: ['and'],
  },
  es: {
    units: {
      cero: 0,
      un: 1,
      uno: 1,
      una: 1,
      dos: 2,
      tres: 3,
      cuatro: 4,
      cinco: 5,
      seis: 6,
      siete: 7,
      ocho: 8,
      nueve: 9,
      diez: 10,
      once: 11,
      doce: 12,
      trece: 13,
      catorce: 14,
      quince: 15,
      dieciséis: 16,
      diecisiete: 17,
      dieciocho: 18,
      diecinueve: 19,
      veinte: 20,
      veintiún: 21,
      veintiuno: 21,
      veintiuna: 21,
      veintidós: 22,
      veintitrés: 23,
      veinticuatro: 24,
      veinticinco: 25,
      veintiséis: 26,
      veintisiete: 27,
      veintiocho: 28,
      veintinueve: 29,
      treinta: 30,
      cuarenta: 40,
      cincuenta: 50,
      sesenta: 60,
      setenta: 70,
      ochenta: 80,
      noventa: 90,
      cien: 100,
      ciento: 100,
    },
    hundreds: [],
    joiners: ['y'],
  },
};

/** Mots d'une phrase : minuscules, sans ponctuation (tirets compris) */
function tokens(text) {
  return String(text)
    .normalize('NFC')
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

/** Ajoute un mot-nombre à la valeur en cours (null si le mot ne s'y enchaîne pas) */
function extend(value, token, words, previous) {
  if (words.hundreds.includes(token)) return (value || 1) * 100;
  const unit = words.units[token];
  if (unit === undefined) return null;
  // Français : « quatre-vingt(s) » vaut 80, pas 4 + 20
  if (unit === 20 && previous === 'quatre') return value - 4 + 80;
  return value + unit;
}

/**
 * Phrase normalisée : minuscules, sans ponctuation, chaque nombre écrit en lettres
 * remplacé par ses chiffres (« une fois sept » → « 1 fois 7 »).
 * @param {string} text
 * @param {string} lang
 * @returns {string[]} mots
 */
export function normalizeForComparison(text, lang) {
  const words = WORDS[lang];
  const out = [];
  let value = null;
  let previous = null;
  const flush = () => {
    if (value !== null) out.push(String(value));
    value = null;
  };
  for (const token of tokens(text)) {
    const joins = value !== null && words?.joiners.includes(token);
    const next = words ? extend(value ?? 0, token, words, previous) : null;
    if (joins) {
      // « vingt et un » : « et » continue le nombre sans rien ajouter
    } else if (next !== null) {
      value = next;
    } else {
      flush();
      out.push(token);
    }
    previous = token;
  }
  flush();
  return out;
}

const numbersOf = words => words.filter(word => /^\d+$/.test(word)).map(Number);

function editDistance(a, b) {
  let row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let j = 1; j <= b.length; j++) {
      next[j] = Math.min(row[j] + 1, next[j - 1] + 1, row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    row = next;
  }
  return row[b.length];
}

/**
 * Ressemblance en dessous de laquelle un clip est à réécouter, même avec les bons nombres.
 * Basse exprès : Whisper confond souvent des homophones (« éclatent » / « éclates »,
 * « reste-t-il » / « restent-ils ») ; ce sont les nombres qui signalent un vrai défaut.
 */
export const MIN_SIMILARITY = 0.5;

/**
 * Langues au contrôle strict : ressemblance d'au moins 0,85, et pas plus d'un mot en trop.
 * Réglé sur les 7 437 clips anglais de Jane (Mistral), le 26/09/2026 : la règle de base
 * laissait passer une attaque de mot ratée (« Try again! » entendu « Cry again ») et un
 * charabia inventé par la synthèse, que les nombres ne trahissent pas. Le français garde la
 * règle de base : sans transcriptions pour le régler, ses homophones le noieraient d'alertes.
 */
const STRICT = { minSimilarity: 0.85, maxExtraWords: 1 };
export const STRICT_LANGS = { en: STRICT, es: STRICT };

/**
 * Écritures de Whisper sans défaut de voix, ramenées aux mots de la phrase avant la
 * comparaison : « watt » pour le « what » des questions à trou, « 18-4 » pour « 18 minus 4 »,
 * « 8 x 10 » pour « 8 times 10 », et en espagnol « 30 y 1 » pour « treinta y uno » (31)
 */
const WHISPER_SPELLINGS = {
  en: [
    [/\bwatt\b/gi, 'what'],
    [/(\d)\s*-\s*(\d)/g, '$1 minus $2'],
    [/(\d)\s*[x×]\s*(\d)/gi, '$1 times $2'],
  ],
  es: [
    [/\b([2-9]0) y ([1-9])\b/g, (_match, tens, unit) => String(Number(tens) + Number(unit))],
    [/(\d)\s*-\s*(\d)/g, '$1 menos $2'],
    [/(\d)\s*[x×]\s*(\d)/gi, '$1 por $2'],
  ],
};

/** Mot sans ses accents : Whisper les oublie souvent (« Facil » pour « Fácil ») */
const withoutAccents = word => word.normalize('NFD').replaceAll(/\p{M}/gu, '');

/** Transcription aux écritures de Whisper ramenées (voir WHISPER_SPELLINGS) */
function respelled(heard, lang) {
  return (WHISPER_SPELLINGS[lang] ?? []).reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    String(heard)
  );
}

/**
 * Compare la transcription d'un clip à sa phrase
 * @param {string} expected - Phrase de speak() (ou texte dit)
 * @param {string} heard - Transcription
 * @param {string} lang
 * @returns {{numbersMatch: boolean, similarity: number, extraWords: number, flagged: boolean, expectedNumbers: number[], heardNumbers: number[]}}
 */
export function compareTranscript(expected, heard, lang) {
  const a = normalizeForComparison(expected, lang);
  const b = normalizeForComparison(respelled(heard, lang), lang);
  const expectedNumbers = numbersOf(a);
  const heardNumbers = numbersOf(b);
  const numbersMatch =
    expectedNumbers.length === heardNumbers.length &&
    expectedNumbers.every((n, i) => n === heardNumbers[i]);
  // Les accents ne comptent pas dans la ressemblance ; les nombres, déjà lus, ne changent pas
  const similarity =
    1 -
    editDistance(a.map(withoutAccents), b.map(withoutAccents)) / Math.max(a.length, b.length, 1);
  const extraWords = b.length - a.length;
  const strict = STRICT_LANGS[lang];
  const doubtful = strict
    ? similarity < strict.minSimilarity || extraWords > strict.maxExtraWords
    : similarity < MIN_SIMILARITY;
  return {
    numbersMatch,
    similarity: Math.round(similarity * 1000) / 1000,
    extraWords,
    flagged: !numbersMatch || doubtful,
    expectedNumbers,
    heardNumbers,
  };
}
