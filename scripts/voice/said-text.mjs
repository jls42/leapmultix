// Texte dit par la voix enregistrée : la phrase passée à speak(), réécrite là où la
// synthèse risque de mal la prononcer. Le clip reste rangé sous l'empreinte de la phrase
// de speak() ; la voix de l'appareil, en repli, lit toujours cette phrase-là.
//
// Seule réécriture aujourd'hui : l'accord en genre des nombres qui finissent par 1, que les
// chiffres ne portent pas. « Combien font 1 fois 7 ? » se dit « une fois 7 » (fois est
// féminin), « 21 pommes » se dit « vingt et une pommes » ; en espagnol « 1 caja » se dit
// « una caja » et « 21 niños » « veintiún niños ». Un nombre seul garde sa lecture par défaut.

/**
 * Mots qui peuvent suivre un nombre dans une phrase du corpus, par genre. Un mot absent de
 * ces listes fait échouer tests-esm/voice/said-text.esm.test.mjs : le classer ici.
 */
export const WORDS_AFTER_NUMBERS = {
  fr: {
    feminine: ['fois', 'boîte', 'boîtes', 'pomme', 'pommes', 'case', 'cases', 'bille', 'billes'],
    masculine: [
      'groupe',
      'groupes',
      'enfant',
      'enfants',
      'saut',
      'sauts',
      'chocolat',
      'chocolats',
      'oiseau',
      'oiseaux',
      'bonbon',
      'bonbons',
      'ballon',
      'ballons',
      'crayon',
      'crayons',
    ],
    // Mots qui ne sont pas des noms : le nombre garde sa lecture par défaut
    other: ['égale', 'plus', 'moins', 'divisé', 'autre', 'autres', 'éclate', 'éclatent', 'à'],
  },
  es: {
    feminine: ['caja', 'cajas', 'manzana', 'manzanas', 'casilla', 'casillas', 'canica', 'canicas'],
    masculine: [
      'grupo',
      'grupos',
      'niño',
      'niños',
      'salto',
      'saltos',
      'chocolate',
      'chocolates',
      'pájaro',
      'pájaros',
      'caramelo',
      'caramelos',
      'globo',
      'globos',
      'lápiz',
      'lápices',
    ],
    other: ['por', 'más', 'menos', 'dividido', 'es', 'explota', 'explotan', 'a'],
  },
};

const FR_TENS = { 2: 'vingt', 3: 'trente', 4: 'quarante', 5: 'cinquante', 6: 'soixante' };
const FR_HUNDREDS = ['', 'cent', 'deux cent', 'trois cent', 'quatre cent', 'cinq cent'];

/** Français, nombre qui finit par 1 (sauf 11, 71, 91), au féminin : « vingt et une » */
function frenchFeminine(n) {
  const rest = n % 100;
  let tail;
  if (rest === 1) tail = 'une';
  else if (rest === 81) tail = 'quatre-vingt-une';
  else tail = `${FR_TENS[Math.floor(rest / 10)]} et une`;
  const hundreds = Math.floor(n / 100);
  return hundreds ? `${FR_HUNDREDS[hundreds]} ${tail}` : tail;
}

const ES_TENS = {
  3: 'treinta',
  4: 'cuarenta',
  5: 'cincuenta',
  6: 'sesenta',
  7: 'setenta',
  8: 'ochenta',
  9: 'noventa',
};

/** Espagnol, nombre qui finit par 1 (sauf 11) devant un nom : « veintiuna », « veintiún » */
function spanishBeforeNoun(n, feminine) {
  const rest = n % 100;
  const one = feminine ? 'una' : 'un';
  let tail;
  if (rest === 1) tail = one;
  else if (rest === 21) tail = feminine ? 'veintiuna' : 'veintiún';
  else tail = `${ES_TENS[Math.floor(rest / 10)]} y ${one}`;
  // Jusqu'à 199 : au-delà, « doscientas » s'accorde aussi ; aucune phrase n'y arrive
  return n >= 100 ? `ciento ${tail}` : tail;
}

const RULES = {
  fr: {
    invariable: n => [11, 71, 91].includes(n % 100),
    feminine: frenchFeminine,
    masculine: null,
  },
  es: {
    invariable: n => n % 100 === 11,
    feminine: n => spanishBeforeNoun(n, true),
    masculine: n => spanishBeforeNoun(n, false),
  },
};

/** Un nombre en chiffres suivi d'un mot : le mot est capturé sans être consommé */
const NUMBER_BEFORE_WORD = /(?<![\p{L}\p{N}])(\d+)(?=\s+(\p{L}+))/gu;

/**
 * Mots qui suivent un nombre dans une phrase (en minuscules)
 * @param {string} text
 * @returns {string[]}
 */
export function wordsAfterNumbers(text) {
  return [...String(text).matchAll(NUMBER_BEFORE_WORD)].map(match => match[2].toLowerCase());
}

/**
 * Texte envoyé à la synthèse pour une phrase de speak()
 * @param {string} text - Phrase telle que speak() la reçoit
 * @param {string} lang
 * @returns {string}
 */
export function saidText(text, lang) {
  const rules = RULES[lang];
  const words = WORDS_AFTER_NUMBERS[lang];
  if (!rules || !words) return text;
  return String(text).replace(NUMBER_BEFORE_WORD, (digits, _group, word) => {
    const n = Number(digits);
    if (n % 10 !== 1 || n > 199 || rules.invariable(n)) return digits;
    const lower = word.toLowerCase();
    if (words.feminine.includes(lower)) return rules.feminine(n);
    if (rules.masculine && words.masculine.includes(lower)) return rules.masculine(n);
    return digits;
  });
}
