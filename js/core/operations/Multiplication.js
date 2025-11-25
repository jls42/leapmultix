/**
 * Opération de multiplication
 * Implémente les règles spécifiques aux tables de multiplication
 */

import { Operation } from './Operation.js';

export class Multiplication extends Operation {
  constructor() {
    super();
    this.symbol = '×';
    this.name = 'multiplication';
    this.spokenForm = 'fois';
    this.unicodeSymbol = '\u00D7'; // ×
  }

  /**
   * Calcule le produit de deux nombres
   * @param {number} a - Premier facteur
   * @param {number} b - Second facteur
   * @returns {number} Produit a × b
   */
  compute(a, b) {
    return a * b;
  }

  /**
   * Génère des facteurs aléatoires selon la difficulté
   * @param {string} difficulty - 'easy', 'medium', ou 'hard'
   * @returns {{ a: number, b: number }}
   */
  generateOperands(difficulty = 'medium') {
    const ranges = {
      easy: { min: 1, max: 5 },
      medium: { min: 1, max: 10 },
      hard: { min: 1, max: 12 },
    };

    const range = ranges[difficulty] || ranges.medium;
    const a = this._randomInt(range.min, range.max);
    const b = this._randomInt(range.min, range.max);

    return { a, b };
  }

  /**
   * Types de questions supportés pour la multiplication
   * @returns {string[]}
   */
  getSupportedTypes() {
    // Multiplication supporte tous les types
    return ['classic', 'gap', 'mcq', 'true_false', 'problem'];
  }

  /**
   * Formate une question de multiplication
   * Surcharge pour gérer le type 'problem' spécifique
   * @param {number} a
   * @param {number} b
   * @param {string} type
   * @param {number|null} result
   * @returns {string}
   */
  formatQuestion(a, b, type = 'classic', result = null) {
    // Pour les problèmes, on retourne une clé spéciale
    // La traduction sera gérée par getTranslation()
    if (type === 'problem') {
      return `PROBLEM_TEMPLATE:${a}:${b}`;
    }

    return super.formatQuestion(a, b, type, result);
  }
}
