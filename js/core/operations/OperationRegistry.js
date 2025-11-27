/**
 * Registry pattern pour gérer toutes les opérations arithmétiques
 * Centralise l'accès et la découverte des opérations disponibles
 */

import { Multiplication } from './Multiplication.js';
import { Addition } from './Addition.js';
import { Subtraction } from './Subtraction.js';
// R3: import { Division } from './Division.js';

/**
 * Classe singleton qui gère l'enregistrement et l'accès aux opérations
 */
class OperationRegistryClass {
  constructor() {
    /**
     * Map de symbole → instance d'opération
     * @type {Map<string, Operation>}
     */
    this.operations = new Map();

    // Enregistrer les opérations par défaut
    this._registerDefaults();
  }

  /**
   * Enregistre les opérations disponibles par défaut
   * @private
   */
  _registerDefaults() {
    this.register(new Multiplication());
    this.register(new Addition());
    this.register(new Subtraction());

    // R3: Activer division
    // this.register(new Division());
  }

  /**
   * Enregistre une nouvelle opération
   * @param {Operation} operation - Instance d'opération à enregistrer
   * @throws {Error} Si l'opération n'a pas de symbole défini
   */
  register(operation) {
    if (!operation.symbol) {
      throw new Error('Cannot register operation without a symbol');
    }
    this.operations.set(operation.symbol, operation);
    console.log(`✓ Opération enregistrée: ${operation.symbol} (${operation.name})`);
  }

  /**
   * Récupère une opération par son symbole
   * @param {string} symbol - Symbole de l'opération (×, +, −, ÷)
   * @returns {Operation} Instance de l'opération
   */
  get(symbol) {
    const operation = this.operations.get(symbol);

    if (!operation) {
      console.warn(
        `[OperationRegistry] Opération '${symbol}' non trouvée, fallback multiplication`
      );
      return this.operations.get('×'); // Fallback sécurisé
    }

    return operation;
  }

  /**
   * Récupère toutes les opérations enregistrées
   * @returns {Operation[]} Tableau de toutes les opérations
   */
  getAll() {
    return Array.from(this.operations.values());
  }

  /**
   * Récupère tous les symboles d'opérations disponibles
   * @returns {string[]} Tableau des symboles (ex: ['×', '+', '−'])
   */
  getAllSymbols() {
    return Array.from(this.operations.keys());
  }

  /**
   * Vérifie si une opération est supportée
   * @param {string} symbol - Symbole à vérifier
   * @returns {boolean} True si supportée
   */
  isSupported(symbol) {
    return this.operations.has(symbol);
  }

  /**
   * Retourne le nombre d'opérations enregistrées
   * @returns {number}
   */
  count() {
    return this.operations.size;
  }
}

// Export singleton instance
export const OperationRegistry = new OperationRegistryClass();

// Convenience exports pour utilisation simplifiée
/**
 * Récupère une opération par son symbole
 * @param {string} symbol - Symbole (×, +, −, ÷)
 * @returns {Operation}
 */
export const getOperation = symbol => OperationRegistry.get(symbol);

/**
 * Récupère toutes les opérations
 * @returns {Operation[]}
 */
export const getAllOperations = () => OperationRegistry.getAll();

/**
 * Récupère tous les symboles supportés
 * @returns {string[]}
 */
export const getSupportedOperators = () => OperationRegistry.getAllSymbols();

/**
 * Vérifie si un symbole est supporté
 * @param {string} symbol
 * @returns {boolean}
 */
export const isOperatorSupported = symbol => OperationRegistry.isSupported(symbol);
