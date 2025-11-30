/**
 * Classe abstraite représentant une opération arithmétique
 * Définit le contrat que toutes les opérations doivent implémenter
 *
 * @abstract
 */
export class Operation {
  constructor() {
    if (new.target === Operation) {
      throw new Error('Operation is an abstract class and cannot be instantiated directly');
    }

    /**
     * Symbole mathématique de l'opération
     * @type {string}
     */
    this.symbol = '';

    /**
     * Nom de l'opération en anglais
     * @type {string}
     */
    this.name = '';

    /**
     * Forme parlée en français (pour TTS)
     * @type {string}
     */
    this.spokenForm = '';

    /**
     * Symbole Unicode (pour affichage cohérent)
     * @type {string}
     */
    this.unicodeSymbol = '';
  }

  /**
   * Calcule le résultat de l'opération
   * @abstract
   * @param {number} _a - Premier opérande (utilisé par les sous-classes)
   * @param {number} _b - Second opérande (utilisé par les sous-classes)
   * @returns {number} Résultat de l'opération
   * @throws {Error} Si la méthode n'est pas implémentée
   */
  compute(_a, _b) {
    throw new Error(`compute() must be implemented in ${this.constructor.name}`);
  }

  /**
   * Génère des opérandes aléatoires selon la difficulté
   * @abstract
   * @param {string} _difficulty - Niveau de difficulté (utilisé par les sous-classes)
   * @returns {{ a: number, b: number }} Paire d'opérandes générés
   * @throws {Error} Si la méthode n'est pas implémentée
   */
  generateOperands(_difficulty = 'medium') {
    throw new Error(`generateOperands() must be implemented in ${this.constructor.name}`);
  }

  /**
   * Formate la question selon le type demandé
   * @param {number} a - Premier opérande
   * @param {number} b - Second opérande
   * @param {string} type - Type de question ('classic', 'gap', 'mcq', 'true_false')
   * @param {number|null} result - Résultat précalculé (pour certains types)
   * @returns {string} Question formatée
   */
  formatQuestion(a, b, type = 'classic', result = null) {
    const r = result ?? this.compute(a, b);

    switch (type) {
      case 'classic':
        return `${a} ${this.symbol} ${b} = ?`;
      case 'gap':
        return `${a} ${this.symbol} ? = ${r}`;
      case 'mcq':
        return `${a} ${this.symbol} ${b} = ?`;
      case 'true_false':
        return `${a} ${this.symbol} ${b} = ${result}`;
      case 'problem':
        // Géré spécifiquement par chaque opération
        return `${a} ${this.symbol} ${b} = ?`;
      default:
        return `${a} ${this.symbol} ${b} = ?`;
    }
  }

  /**
   * Valide que les opérandes sont valides pour cette opération
   * @param {number} a - Premier opérande
   * @param {number} b - Second opérande
   * @returns {boolean} True si valides, false sinon
   */
  isValid(a, b) {
    return (
      typeof a === 'number' &&
      typeof b === 'number' &&
      !Number.isNaN(a) &&
      !Number.isNaN(b) &&
      Number.isFinite(a) &&
      Number.isFinite(b)
    );
  }

  /**
   * Retourne les types de questions supportés par cette opération
   * @returns {string[]} Liste des types supportés
   */
  getSupportedTypes() {
    // Par défaut: classic et mcq (minimun requis)
    return ['classic', 'mcq'];
  }

  /**
   * Génère un nombre aléatoire entre min et max (inclusif)
   * @protected
   * @param {number} min - Valeur minimale
   * @param {number} max - Valeur maximale
   * @returns {number} Nombre aléatoire
   */
  _randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
