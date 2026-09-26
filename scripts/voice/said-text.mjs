// Texte dit par la voix enregistrée : la phrase passée à speak(), réécrite là où la
// synthèse risque de mal la prononcer. Le clip reste rangé sous l'empreinte de la phrase
// de speak() ; la voix de l'appareil, en repli, lit toujours cette phrase-là.
//
// Trois réécritures :
// - l'accord en genre des nombres qui finissent par 1, que les chiffres ne portent pas.
//   « Combien font 1 fois 7 ? » se dit « une fois 7 » (fois est féminin), « 21 pommes » se
//   dit « vingt et une pommes » ; en espagnol « 1 caja » se dit « una caja » et « 21 niños »
//   « veintiún niños ». Un nombre seul garde sa lecture par défaut ;
// - en espagnol, tous les autres nombres en lettres (« 7 por 8 » : « siete por ocho ») : la
//   voix anglaise qui lit l'espagnol dirait les chiffres en anglais ;
// - un texte imposé (SAID_OVERRIDES) pour une phrase que la voix prononce mal essai après
//   essai : la liste se relit, chaque entrée dit pourquoi.

/**
 * Textes dits imposés, par langue : phrase exacte de speak() → texte envoyé à la synthèse.
 * Seulement après plusieurs essais mal dits à l'écoute ; une entrée qui ne correspond plus
 * à une phrase du corpus fait échouer tests-esm/voice/said-text.esm.test.mjs.
 */
export const SAID_OVERRIDES = {
  fr: new Map([
    // « 108 » en tête de phrase : trois essais sur trois mal dits (écoute du 25/09)
    ['108 divisé par 12 égale 9', 'Cent huit divisé par douze égale neuf'],
  ]),
};

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

const ES_UNITS = [
  'cero',
  'uno',
  'dos',
  'tres',
  'cuatro',
  'cinco',
  'seis',
  'siete',
  'ocho',
  'nueve',
  'diez',
  'once',
  'doce',
  'trece',
  'catorce',
  'quince',
  'dieciséis',
  'diecisiete',
  'dieciocho',
  'diecinueve',
  'veinte',
  'veintiuno',
  'veintidós',
  'veintitrés',
  'veinticuatro',
  'veinticinco',
  'veintiséis',
  'veintisiete',
  'veintiocho',
  'veintinueve',
];
const ES_TENS = {
  3: 'treinta',
  4: 'cuarenta',
  5: 'cincuenta',
  6: 'sesenta',
  7: 'setenta',
  8: 'ochenta',
  9: 'noventa',
};
const ES_HUNDREDS = [
  '',
  'ciento',
  'doscientos',
  'trescientos',
  'cuatrocientos',
  'quinientos',
  'seiscientos',
  'setecientos',
  'ochocientos',
  'novecientos',
];
/** « 21 » selon la forme de « 1 » en fin de nombre */
const ES_TWENTY_ONE = { uno: 'veintiuno', un: 'veintiún', una: 'veintiuna' };

/** Espagnol, nombre de 0 à 99 ; one : forme de « 1 » en fin de nombre */
function spanishBelowHundred(n, one) {
  if (n === 1) return one;
  if (n === 21) return ES_TWENTY_ONE[one];
  if (n < 30) return ES_UNITS[n];
  const unit = n % 10;
  const tens = ES_TENS[Math.floor(n / 10)];
  if (unit === 0) return tens;
  return `${tens} y ${unit === 1 ? one : ES_UNITS[unit]}`;
}

/**
 * Espagnol, nombre de 0 à 999 en lettres. one : forme de « 1 » en fin de nombre, « uno »
 * seul, « un » ou « una » devant un nom (« veintiún niños », « treinta y una cajas »). Au-delà
 * de 199, « doscientas » s'accorderait aussi devant un nom féminin : aucune phrase n'y arrive.
 */
function spanishNumber(n, one = 'uno') {
  if (n === 100) return 'cien';
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  if (hundreds === 0) return spanishBelowHundred(rest, one);
  if (rest === 0) return ES_HUNDREDS[hundreds];
  return `${ES_HUNDREDS[hundreds]} ${spanishBelowHundred(rest, one)}`;
}

/**
 * Règles de chaque langue. spelled : chaque nombre qui reste en chiffres s'écrit en lettres.
 * L'espagnol en a besoin : Jane, voix anglaise, lit « 7 por 8 » en anglais (« seven ») ;
 * « siete por ocho » se dit en espagnol (banc du 26/09/2026).
 */
const RULES = {
  fr: {
    invariable: n => [11, 71, 91].includes(n % 100),
    feminine: frenchFeminine,
    masculine: null,
    spelled: null,
  },
  es: {
    invariable: n => n % 100 === 11,
    feminine: n => spanishNumber(n, 'una'),
    masculine: n => spanishNumber(n, 'un'),
    spelled: n => (n < 1000 ? spanishNumber(n) : null),
  },
};

/** Un nombre en chiffres, isolé (ni collé à une lettre, ni à un autre chiffre) */
const LONE_NUMBER = /(?<![\p{L}\p{N}])\d+(?![\p{L}\p{N}])/gu;

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
  const imposed = SAID_OVERRIDES[lang]?.get(String(text));
  if (imposed) return imposed;
  const rules = RULES[lang];
  const words = WORDS_AFTER_NUMBERS[lang];
  if (!rules || !words) return text;
  const agreed = String(text).replace(NUMBER_BEFORE_WORD, (digits, _group, word) => {
    const n = Number(digits);
    if (n % 10 !== 1 || n > 199 || rules.invariable(n)) return digits;
    const lower = word.toLowerCase();
    if (words.feminine.includes(lower)) return rules.feminine(n);
    if (rules.masculine && words.masculine.includes(lower)) return rules.masculine(n);
    return digits;
  });
  if (!rules.spelled) return agreed;
  return agreed.replace(LONE_NUMBER, digits => rules.spelled(Number(digits)) ?? digits);
}
