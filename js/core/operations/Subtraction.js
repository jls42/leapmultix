/**
 * Opération de soustraction
 * Implémente les règles spécifiques à la soustraction (résultats non négatifs)
 */

import { Operation } from './Operation.js';
import { randomFloat } from '../random.js';

/** Bornes du premier terme et plus grand second terme, par difficulté (incluses) */
const MINUEND_RANGES = new Map([
  ['easy', { minuendMin: 1, minuendMax: 10, maxSubtrahend: 10 }],
  ['medium', { minuendMin: 1, minuendMax: 20, maxSubtrahend: 20 }],
  ['hard', { minuendMin: 1, minuendMax: 50, maxSubtrahend: 50 }],
]);

/**
 * Poids d'un calcul trivial, face à 1 pour un autre. Au niveau facile, ces calculs sont la
 * moitié des 55 possibles (27) : tirés comme les autres, ils feraient une question sur deux.
 * Avec ce poids, ils restent possibles mais ne font plus qu'environ une question sur dix au
 * niveau facile (8,8 %), 3,6 % au niveau moyen et 1,3 % au niveau difficile.
 */
const TRIVIAL_WEIGHT = 0.1;

/**
 * Calcul trivial : on enlève tout (7 − 7), on enlève 1 (7 − 1), ou les deux nombres se
 * suivent (7 − 6, l'autre sens de 7 − 1)
 */
const isTrivial = ({ a, b }) => b === a || b === 1 || a - b === 1;

/** Entiers de min à max, bornes incluses */
const between = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i);

/** Paires pondérées de chaque difficulté, calculées une fois : { pairs, total } */
const weightedPools = new Map();

export class Subtraction extends Operation {
  constructor() {
    super();
    this.symbol = '−'; // Unicode minus sign (U+2212), pas hyphen-minus (-)
    this.name = 'subtraction';
    this.spokenForm = 'moins';
    this.unicodeSymbol = '\u2212'; // −
  }

  /**
   * Calcule la différence entre deux nombres
   * @param {number} a - Minuende (nombre dont on soustrait)
   * @param {number} b - Soustracteur (nombre à soustraire)
   * @returns {number} Différence a − b
   */
  compute(a, b) {
    return a - b;
  }

  /**
   * Génère des opérandes avec contrainte CRITIQUE: a >= b
   * Pour éviter les résultats négatifs (trop complexe pour débutants).
   * Le tirage se fait parmi les paires d'enumerateOperands : chaque calcul a la même chance,
   * sauf les calculs triviaux (TRIVIAL_WEIGHT). Tirer d'abord le premier terme donnait autant
   * de poids à 2 (2 − 1, 2 − 2) qu'à 10 et ses dix calculs.
   * @param {string} difficulty - 'easy', 'medium', ou 'hard'
   * @returns {{ a: number, b: number }}
   */
  generateOperands(difficulty = 'medium') {
    const { pairs, total } = this.weightedPool(difficulty);
    let cursor = randomFloat() * total;
    for (const pair of pairs) {
      cursor -= pair.weight;
      if (cursor < 0) return { a: pair.a, b: pair.b };
    }
    const last = pairs.at(-1);
    return { a: last.a, b: last.b };
  }

  /**
   * Les paires d'une difficulté avec leur poids, et la somme des poids
   * @param {string} difficulty
   * @returns {{ pairs: Array<{a: number, b: number, weight: number}>, total: number }}
   */
  weightedPool(difficulty) {
    if (!weightedPools.has(difficulty)) {
      const pairs = this.enumerateOperands(difficulty).map(pair => ({
        ...pair,
        weight: isTrivial(pair) ? TRIVIAL_WEIGHT : 1,
      }));
      const total = pairs.reduce((sum, pair) => sum + pair.weight, 0);
      weightedPools.set(difficulty, { pairs, total });
    }
    return weightedPools.get(difficulty);
  }

  /**
   * Toutes les paires que generateOperands peut tirer : 1 ≤ b ≤ a
   * @param {string} difficulty - 'easy', 'medium', ou 'hard'
   * @returns {Array<{a: number, b: number}>}
   */
  enumerateOperands(difficulty = 'medium') {
    const range = MINUEND_RANGES.get(difficulty) ?? MINUEND_RANGES.get('medium');
    return between(range.minuendMin, range.minuendMax).flatMap(a =>
      between(1, Math.min(a, range.maxSubtrahend)).map(b => ({ a, b }))
    );
  }

  /**
   * Validation stricte: a doit être >= b pour résultat non négatif
   * @param {number} a - Minuende
   * @param {number} b - Soustracteur
   * @returns {boolean}
   */
  isValid(a, b) {
    if (!super.isValid(a, b)) return false;

    // Contrainte CRITIQUE pour soustraction débutant
    return a >= b && a >= 0 && b >= 0;
  }

  /**
   * Types de questions supportés pour la soustraction
   * @returns {string[]}
   */
  getSupportedTypes() {
    // R2: ajout de 'true_false'
    // Note: 'gap' pour soustraction a 2 positions possibles (a − _ = c ou _ − b = c)
    return ['classic', 'mcq', 'gap', 'problem', 'true_false'];
  }
}
