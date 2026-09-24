/**
 * Opération de soustraction
 * Implémente les règles spécifiques à la soustraction (résultats non négatifs)
 */

import { Operation } from './Operation.js';

/** Bornes du premier terme et plus grand second terme, par difficulté (incluses) */
const MINUEND_RANGES = {
  easy: { minuendMin: 1, minuendMax: 10, maxSubtrahend: 10 },
  medium: { minuendMin: 1, minuendMax: 20, maxSubtrahend: 20 },
  hard: { minuendMin: 1, minuendMax: 50, maxSubtrahend: 50 },
};

/** Entiers de min à max, bornes incluses */
const between = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i);

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
   * Pour éviter les résultats négatifs (trop complexe pour débutants)
   * @param {string} difficulty - 'easy', 'medium', ou 'hard'
   * @returns {{ a: number, b: number }}
   */
  generateOperands(difficulty = 'medium') {
    const range = MINUEND_RANGES[difficulty] || MINUEND_RANGES.medium;

    // 1. Générer le minuende (a)
    const a = this._randomInt(range.minuendMin, range.minuendMax);

    // 2. Générer le soustracteur (b) tel que b <= a
    // Pour éviter résultat = 0 trop fréquent, on peut ajuster
    const maxB = Math.min(a, range.maxSubtrahend);
    const minB = 1; // Éviter b = 0 (trivial)

    // Protection: si a = 1, alors b doit être 1 (résultat 0)
    const b = a === 1 ? 1 : this._randomInt(minB, maxB);

    return { a, b };
  }

  /**
   * Toutes les paires que generateOperands peut tirer : 1 ≤ b ≤ a
   * @param {string} difficulty - 'easy', 'medium', ou 'hard'
   * @returns {Array<{a: number, b: number}>}
   */
  enumerateOperands(difficulty = 'medium') {
    const range = MINUEND_RANGES[difficulty] || MINUEND_RANGES.medium;
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
