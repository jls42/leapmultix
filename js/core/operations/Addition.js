/**
 * Opération d'addition
 * Implémente les règles spécifiques à l'addition (contraintes de résultat)
 */

import { Operation } from './Operation.js';

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
    const constraints = {
      easy: {
        minA: 1,
        maxA: 5,
        minB: 1,
        maxB: 5,
        maxResult: 10,
      },
      medium: {
        minA: 1,
        maxA: 10,
        minB: 1,
        maxB: 10,
        maxResult: 20,
      },
      hard: {
        minA: 1,
        maxA: 20,
        minB: 1,
        maxB: 20,
        maxResult: 40,
      },
    };

    const c = constraints[difficulty] || constraints.medium;
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
   * Types de questions supportés pour l'addition (R1: limité)
   * @returns {string[]}
   */
  getSupportedTypes() {
    // R1: classic et mcq uniquement
    // R2: ajouter 'gap', 'true_false', 'problem'
    return ['classic', 'mcq'];
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
