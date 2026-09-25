/**
 * Données du mode Découverte : plages des égalités montrées et dites à voix haute.
 * Module pur, sans DOM : le mode les tire au hasard, le corpus de la voix enregistrée
 * les énumère toutes (scripts/voice/corpus.mjs).
 */

/**
 * Entiers de min à max, bornes incluses
 * @param {number} min
 * @param {number} max
 * @returns {number[]}
 */
function range(min, max) {
  return Array.from({ length: Math.max(0, max - min + 1) }, (_, i) => min + i);
}

/** Tables proposées au labo (×) et multiplicandes de chaque table */
export const DISCOVERY_TABLES = range(1, 10);
export const DISCOVERY_FACTORS = range(1, 10);

/**
 * Égalités du carrousel (+, −) : chaque niveau commence où finit le précédent,
 * pas de « 1 + 4 » en Difficile. Bornes incluses.
 */
export const EXAMPLE_BANDS = {
  '+': {
    easy: { a: [1, 5], b: [1, 5], result: [2, 10] },
    medium: { a: [1, 10], b: [1, 10], result: [11, 20] },
    hard: { a: [1, 20], b: [1, 20], result: [21, 40] },
  },
  '−': {
    easy: { a: [2, 10], b: [1, 9], result: [1, 9] },
    medium: { a: [11, 20], b: [1, 19], result: [1, 19] },
    hard: { a: [21, 50], b: [1, 49], result: [1, 49] },
  },
};

/**
 * Exploration visuelle (+, −) : les plus grands exemples qui se dessinent encore en
 * points (deux groupes de 10 au plus pour +, rangées de 10 pour −)
 */
export const VISUAL_BANDS = {
  '+': {
    easy: { a: [1, 5], b: [1, 5], result: [2, 10] },
    medium: { a: [2, 10], b: [2, 10], result: [11, 20] },
    hard: { a: [2, 10], b: [2, 10], result: [11, 20] },
  },
  '−': {
    easy: { a: [2, 10], b: [1, 5], result: [1, 9] },
    medium: { a: [11, 20], b: [2, 10], result: [1, 18] },
    hard: { a: [11, 20], b: [2, 10], result: [1, 18] },
  },
};

/**
 * Division : on explore la « table » d'un diviseur tiré dans la plage du niveau
 * (5 ÷ 5, 10 ÷ 5… 50 ÷ 5) ; le plus grand dividende reste sous le maximum du niveau.
 */
export const DIVISION_LEVELS = {
  easy: { divisor: [2, 5], quotient: [1, 10] },
  medium: { divisor: [6, 10], quotient: [1, 10] },
  hard: { divisor: [11, 12], quotient: [3, 12] },
};

/**
 * Manipulation (+, −) : premier terme fixé pour la visite et affiché d'emblée,
 * nombres à poser choisis pour que le résultat reste dans le niveau (jamais négatif).
 */
export const DROP_PLANS = {
  '+': {
    easy: { first: [1, 5], items: [1, 5] },
    medium: { first: [6, 10], items: [1, 10] },
    hard: { first: [21, 30], items: [1, 10] },
  },
  '−': {
    easy: { first: [10, 10], items: [1, 10] },
    medium: { first: [11, 20], items: [1, 10] },
    hard: { first: [21, 50], items: [1, 10] },
  },
};

/** Exemples par écran (carrousel, exploration visuelle) */
export const EXAMPLE_COUNT = 10;

/**
 * Toutes les égalités d'une bande ; pour l'addition, 3 + 5 et 5 + 3 ne comptent
 * qu'une fois (le plus grand nombre d'abord : on compte à partir de lui)
 * @param {string} operator - '+' ou '−'
 * @param {{a: number[], b: number[], result: number[]}} band
 * @param {(a: number, b: number) => number} compute
 * @returns {Array<{a: number, b: number, result: number}>}
 */
export function bandExamples(operator, band, compute) {
  const pool = new Map();
  for (const x of range(band.a[0], band.a[1])) {
    for (const y of range(band.b[0], band.b[1])) {
      const [a, b] = operator === '+' ? [Math.max(x, y), Math.min(x, y)] : [x, y];
      const result = compute(a, b);
      if (result >= band.result[0] && result <= band.result[1]) {
        pool.set(`${a}|${b}`, { a, b, result });
      }
    }
  }
  return [...pool.values()];
}

/**
 * Petites divisions (au plus 20 points) : de 2 à 5 parts de 1 à 4 points
 * @param {(a: number, b: number) => number} compute
 * @returns {Array<{a: number, b: number, result: number}>}
 */
export function divisionVisualExamples(compute) {
  return range(2, 5).flatMap(b =>
    range(1, 4).map(q => ({ a: b * q, b, result: compute(b * q, b) }))
  );
}

/**
 * Égalités de la « table » d'un diviseur : dividendes d × q pour les quotients du
 * niveau, les EXAMPLE_COUNT premiers
 * @param {number} divisor
 * @param {{quotient: number[]}} level
 * @param {(a: number, b: number) => number} compute
 * @returns {Array<{a: number, b: number, result: number}>}
 */
export function divisionTableExamples(divisor, level, compute) {
  return range(level.quotient[0], level.quotient[1])
    .map(q => ({ a: divisor * q, b: divisor, result: compute(divisor * q, divisor) }))
    .slice(0, EXAMPLE_COUNT);
}

/**
 * Nombres entiers d'une plage [min, max]
 * @param {number[]} bounds
 * @returns {number[]}
 */
export function rangeOf(bounds) {
  return range(bounds[0], bounds[1]);
}
