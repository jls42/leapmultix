/**
 * Questions de divisibilité (derniers niveaux de l'Aventure de la division) : une phrase à
 * juger, « 2213 est divisible par 3 », Vrai ou Faux. Module pur, sans DOM : le corpus de la
 * voix enregistrée énumère toutes ces phrases (scripts/voice/corpus.mjs). D'où une liste
 * fixe plutôt qu'un tirage libre : chaque phrase dite a son clip.
 */

import { pickRandom } from './random.js';

/**
 * Nombres à juger, par diviseur : six divisibles, puis six pièges. La réponse se calcule
 * (isDivisible), elle n'est jamais écrite ici.
 * - 2 : impairs qui commencent par des chiffres pairs (2467) ;
 * - 3 : terminés par 3 sans être multiples (2213, 703) ;
 * - 5 : un 5 ailleurs qu'à la fin (554, 3501) ;
 * - 6 : multiples de 3 impairs (345, 1005), pairs non multiples de 3 (578, 872) ;
 * - 9 : multiples de 3 qui ne sont pas multiples de 9 (345, 1632, 993) ;
 * - 10 : terminés par 5 (905, 2015) ou avec un 0 ailleurs qu'à la fin (1001, 508).
 */
export const DIVISIBILITY_NUMBERS = new Map([
  [2, [348, 576, 734, 1250, 5372, 4096, 345, 791, 2213, 1003, 567, 2467]],
  [3, [345, 1632, 279, 402, 1011, 7041, 2213, 578, 1000, 245, 703, 1234]],
  [5, [345, 1250, 905, 760, 2015, 470, 512, 2213, 554, 1056, 753, 3501]],
  [6, [576, 1632, 402, 924, 1014, 270, 345, 578, 1005, 872, 326, 2213]],
  [9, [729, 1008, 3456, 891, 2709, 504, 345, 1632, 2213, 600, 1234, 993]],
  [10, [1250, 760, 2010, 470, 300, 1000, 345, 905, 1001, 2015, 508, 3405]],
]);

/** Diviseurs vérifiés par le dernier chiffre, par la somme des chiffres, ou les deux (6) */
const LAST_DIGIT_DIVISORS = new Set([2, 5, 6, 10]);
const DIGIT_SUM_DIVISORS = new Set([3, 6, 9]);

/**
 * @param {number} number
 * @param {number} divisor
 * @returns {boolean}
 */
export function isDivisible(number, divisor) {
  return number % divisor === 0;
}

/**
 * Toutes les phrases possibles, pour le corpus de la voix
 * @returns {Array<{number: number, divisor: number}>}
 */
export function divisibilityPairs() {
  return [...DIVISIBILITY_NUMBERS].flatMap(([divisor, numbers]) =>
    numbers.map(number => ({ number, divisor }))
  );
}

/**
 * Un diviseur au hasard, puis un de ses nombres : chaque critère revient aussi souvent
 * @returns {{number: number, divisor: number}}
 */
export function pickDivisibilityPair() {
  const divisor = pickRandom([...DIVISIBILITY_NUMBERS.keys()]);
  return { number: pickRandom(DIVISIBILITY_NUMBERS.get(divisor)), divisor };
}

/**
 * Phrase à juger : « 2213 est divisible par 3 »
 * @param {number} number
 * @param {number} divisor
 * @param {(key: string, params?: Object) => string|null} translate
 * @returns {string}
 */
export function divisibilityStatement(number, divisor, translate) {
  return translate('divisibility_statement', { number, divisor });
}

/**
 * Ce qu'on regarde pour répondre, écrit en calculs insécables : le dernier chiffre (2, 5,
 * 10) et la somme des chiffres (3, 9) ; les deux pour 6
 * @param {number} number
 * @param {number} divisor
 * @returns {Array<{labelKey: string, equation: string}>}
 */
export function divisibilityFacts(number, divisor) {
  const digits = [...String(number)];
  const facts = [];
  if (LAST_DIGIT_DIVISORS.has(divisor)) {
    facts.push({ labelKey: 'divisibility_last_digit', equation: digits.at(-1) });
  }
  if (DIGIT_SUM_DIVISORS.has(divisor)) {
    const sum = digits.reduce((total, digit) => total + Number(digit), 0);
    facts.push({
      labelKey: 'divisibility_digit_sum',
      equation: `${digits.join('\u00a0+\u00a0')}\u00a0=\u00a0${sum}`,
    });
  }
  return facts;
}
