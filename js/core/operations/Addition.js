/**
 * Opération d'addition
 * Implémente les règles spécifiques à l'addition (contraintes de résultat)
 */

import { Operation } from './Operation.js';

/** Bornes des termes et du résultat, par difficulté (incluses) */
const TERM_CONSTRAINTS = {
  easy: { minA: 1, maxA: 5, minB: 1, maxB: 5, maxResult: 10 },
  medium: { minA: 1, maxA: 10, minB: 1, maxB: 10, maxResult: 20 },
  hard: { minA: 1, maxA: 20, minB: 1, maxB: 20, maxResult: 40 },
};

/** Entiers de min à max, bornes incluses */
const between = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i);

export class Addition extends Operation {
  constructor() {
    super();
    this.symbol = '+';
    this.name = 'addition';
    this.spokenForm = 'plus';
    this.unicodeSymbol = '+';
  }

  /**
   * Calcule la somme de deux nombres
   * @param {number} a - Premier terme
   * @param {number} b - Second terme
   * @returns {number} Somme a + b
   */
  compute(a, b) {
    return a + b;
  }

  /**
   * Génère des termes aléatoires avec contrainte de résultat maximal
   * Pour faciliter l'apprentissage, on limite la taille du résultat
   * @param {string} difficulty - 'easy', 'medium', ou 'hard'
   * @returns {{ a: number, b: number }}
   */
  generateOperands(difficulty = 'medium') {
    const c = TERM_CONSTRAINTS[difficulty] || TERM_CONSTRAINTS.medium;
    let a, b;

    // Boucle jusqu'à obtenir un résultat valide
    // Protection contre boucle infinie: max 1000 tentatives
    let attempts = 0;
    const maxAttempts = 1000;

    do {
      a = this._randomInt(c.minA, c.maxA);
      b = this._randomInt(c.minB, c.maxB);
      attempts++;

      if (attempts >= maxAttempts) {
        // Fallback: prendre n'importe quelle valeur valide
        console.warn(`[Addition] Max attempts reached, using fallback`);
        a = c.minA;
        b = c.minB;
        break;
      }
    } while (a + b > c.maxResult);

    return { a, b };
  }

  /**
   * Toutes les paires que generateOperands peut tirer (le repli après 1000 essais,
   * les deux minimums, en fait partie)
   * @param {string} difficulty - 'easy', 'medium', ou 'hard'
   * @returns {Array<{a: number, b: number}>}
   */
  enumerateOperands(difficulty = 'medium') {
    const c = TERM_CONSTRAINTS[difficulty] || TERM_CONSTRAINTS.medium;
    return between(c.minA, c.maxA).flatMap(a =>
      between(c.minB, c.maxB)
        .filter(b => a + b <= c.maxResult)
        .map(b => ({ a, b }))
    );
  }

  /**
   * Types de questions supportés pour l'addition
   * @returns {string[]}
   */
  getSupportedTypes() {
    // R2: ajout de 'true_false'
    return ['classic', 'mcq', 'gap', 'problem', 'true_false'];
  }

  /**
   * Validation spécifique: s'assurer que le résultat est raisonnable
   * @param {number} a
   * @param {number} b
   * @returns {boolean}
   */
  isValid(a, b) {
    if (!super.isValid(a, b)) return false;

    // Vérifier que les nombres sont positifs
    if (a < 0 || b < 0) return false;

    // Vérifier que le résultat n'est pas trop grand (éviter overflow)
    const result = a + b;
    return result >= 0 && result <= Number.MAX_SAFE_INTEGER;
  }
}
