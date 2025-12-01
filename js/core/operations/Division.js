/**
 * Opération de division
 * Implémente les règles spécifiques à la division (contrainte : résultat entier uniquement)
 *
 * CONTRAINTE IMPORTANTE: a % b = 0
 * - On génère toujours des divisions qui tombent juste (pas de décimales)
 * - Stratégie: générer b (diviseur) et q (quotient), puis calculer a = b × q
 */

import { Operation } from './Operation.js';

export class Division extends Operation {
  constructor() {
    super();
    this.symbol = '÷';
    this.name = 'division';
    this.spokenForm = 'divisé par';
    this.unicodeSymbol = '\u00F7'; // ÷
  }

  /**
   * Calcule le quotient de deux nombres
   * @param {number} a - Dividende
   * @param {number} b - Diviseur
   * @returns {number} Quotient a ÷ b
   */
  compute(a, b) {
    if (b === 0) {
      throw new Error('Division par zéro impossible');
    }
    return a / b;
  }

  /**
   * Génère des opérandes aléatoires avec contrainte a % b = 0
   * Stratégie: générer diviseur b et quotient q, puis calculer a = b × q
   * @param {string} difficulty - 'easy', 'medium', ou 'hard'
   * @returns {{ a: number, b: number }}
   */
  generateOperands(difficulty = 'medium') {
    const constraints = {
      easy: {
        minDivisor: 2, // Éviter division par 1 (trop facile)
        maxDivisor: 5,
        minQuotient: 1,
        maxQuotient: 10,
      },
      medium: {
        minDivisor: 2,
        maxDivisor: 10,
        minQuotient: 1,
        maxQuotient: 10,
      },
      hard: {
        minDivisor: 2,
        maxDivisor: 12,
        minQuotient: 1,
        maxQuotient: 12,
      },
    };

    const c = constraints[difficulty] || constraints.medium;

    // Générer diviseur et quotient
    const b = this._randomInt(c.minDivisor, c.maxDivisor);
    const quotient = this._randomInt(c.minQuotient, c.maxQuotient);

    // Calculer dividende pour garantir a % b = 0
    const a = b * quotient;

    return { a, b };
  }

  /**
   * Types de questions supportés pour la division
   * @returns {string[]}
   */
  getSupportedTypes() {
    // Division supporte tous les types sauf 'problem' (sera ajouté avec templates)
    return ['classic', 'mcq', 'gap', 'true_false'];
  }

  /**
   * Validation spécifique: s'assurer que la division est valide
   * @param {number} a - Dividende
   * @param {number} b - Diviseur
   * @returns {boolean}
   */
  isValid(a, b) {
    if (!super.isValid(a, b)) return false;

    // Vérifier division par zéro
    if (b === 0) {
      console.warn('[Division] Division par zéro détectée');
      return false;
    }

    // Vérifier que les nombres sont positifs
    if (a < 0 || b < 0) {
      console.warn('[Division] Nombres négatifs détectés');
      return false;
    }

    // CONTRAINTE CRITIQUE: vérifier que a % b = 0 (résultat entier)
    if (a % b !== 0) {
      console.warn(`[Division] Division non entière détectée: ${a} ÷ ${b} = ${a / b}`);
      return false;
    }

    return true;
  }

  /**
   * Formate une question de division
   * @param {number} a - Dividende
   * @param {number} b - Diviseur
   * @param {string} type - Type de question
   * @param {number|null} result - Résultat (pour true_false)
   * @returns {string}
   */
  formatQuestion(a, b, type = 'classic', result = null) {
    // Pour les problèmes, on retourne une clé spéciale
    if (type === 'problem') {
      return `PROBLEM_TEMPLATE:${a}:${b}`;
    }

    return super.formatQuestion(a, b, type, result);
  }

  /**
   * Génère des distracteurs pour les QCM de division
   * Stratégie: varier le quotient de ±1, ±2
   * @param {number} correctAnswer - La bonne réponse
   * @param {number} count - Nombre de distracteurs à générer
   * @returns {number[]} Tableau de distracteurs
   */
  generateDistractors(correctAnswer, count = 3) {
    const distractors = new Set();
    const variations = [-2, -1, 1, 2, 3, -3];

    // Ajouter des variations du résultat correct
    for (const variation of variations) {
      const distractor = correctAnswer + variation;
      if (distractor > 0 && distractor !== correctAnswer) {
        distractors.add(distractor);
      }

      if (distractors.size >= count) break;
    }

    // Si pas assez de distracteurs, en générer aléatoirement
    while (distractors.size < count) {
      const random = this._randomInt(1, Math.max(correctAnswer * 2, 12));
      if (random !== correctAnswer) {
        distractors.add(random);
      }
    }

    return Array.from(distractors).slice(0, count);
  }
}
