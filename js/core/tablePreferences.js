/**
 * Module de gestion des préférences de tables de multiplication
 * Centralise la logique d'exclusion globale des tables
 */

import { UserManager } from '../userManager.js';
import eventBus from './eventBus.js';

export const TablePreferences = {
  /**
   * Obtenir les exclusions actives avec fallback intelligent
   * @param {string} currentUser - Nom de l'utilisateur
   * @param {boolean} includeGlobal - Inclure l'exclusion globale (défaut: true)
   * @returns {Array<number>} Tables exclues (1-10)
   */
  getActiveExclusions(currentUser, includeGlobal = true) {
    if (!currentUser) return [];

    if (!includeGlobal) return [];
    if (!this.isGlobalEnabled(currentUser)) return [];

    const global = this.getGlobalExclusions(currentUser);

    if (global.length >= 10) {
      console.warn(
        '⚠️ TablePreferences: toutes les tables ont été exclues. Réinitialisation automatique des préférences globales.'
      );
      this.resetGlobalPreferences(currentUser);
      return [];
    }

    return global;
  },

  /**
   * Obtenir la liste brute des exclusions globales
   * @param {string} currentUser - Nom de l'utilisateur
   * @returns {Array<number>} Tables exclues
   */
  getGlobalExclusions(currentUser) {
    if (!currentUser) return [];

    const tablePreferences = UserManager.getCurrentUserData()?.tablePreferences;
    if (!tablePreferences) return [];

    return Array.isArray(tablePreferences.globalExclusions)
      ? [...tablePreferences.globalExclusions]
      : [];
  },

  /**
   * Vérifier si l'exclusion globale est activée
   * @param {string} currentUser - Nom de l'utilisateur
   * @returns {boolean}
   */
  isGlobalEnabled(currentUser) {
    if (!currentUser) return false;

    return UserManager.getCurrentUserData()?.tablePreferences?.globalEnabled === true;
  },

  /**
   * Définir la liste des tables exclues
   * @param {string} currentUser - Nom de l'utilisateur
   * @param {Array<number>} tables - Tables à exclure (1-10)
   */
  setGlobalExclusions(currentUser, tables) {
    if (!currentUser) return;

    const userData = UserManager.getCurrentUserData();
    if (!userData) return;

    const tablePreferences = userData.tablePreferences ?? {
      globalExclusions: [],
      globalEnabled: false,
    };

    // Valider et nettoyer les tables (1-10 uniquement)
    const validTables = Array.isArray(tables)
      ? tables.filter(t => Number.isInteger(t) && t >= 1 && t <= 10).sort((a, b) => a - b)
      : [];

    tablePreferences.globalExclusions = validTables;
    userData.tablePreferences = tablePreferences;
    UserManager.updateCurrentUserData(userData);

    eventBus.emit('tablePreferences:changed');
  },

  /**
   * Activer/désactiver l'exclusion globale
   * @param {string} currentUser - Nom de l'utilisateur
   * @param {boolean} enabled - Activer (true) ou désactiver (false)
   */
  setGlobalEnabled(currentUser, enabled) {
    if (!currentUser) return;

    const userData = UserManager.getCurrentUserData();
    if (!userData) return;

    const tablePreferences = userData.tablePreferences ?? {
      globalExclusions: [],
      globalEnabled: false,
    };

    tablePreferences.globalEnabled = enabled === true;
    userData.tablePreferences = tablePreferences;
    UserManager.updateCurrentUserData(userData);

    eventBus.emit('tablePreferences:changed');
  },

  /**
   * Obtenir les exclusions pour le mode Quiz (fusion locale + globale)
   * @param {string} currentUser - Nom de l'utilisateur
   * @param {Array<number>} localExclusions - Exclusions locales du Quiz
   * @returns {Array<number>} Fusion des exclusions locale + globale
   */
  getQuizMergedExclusions(currentUser, localExclusions = []) {
    const global = this.getActiveExclusions(currentUser, true);

    // Union sans doublons
    const merged = [...new Set([...localExclusions, ...global])];

    return merged;
  },

  /**
   * Réinitialiser complètement les préférences globales
   * @param {string} currentUser - Nom de l'utilisateur
   */
  resetGlobalPreferences(currentUser) {
    if (!currentUser) return;

    const userData = UserManager.getCurrentUserData();
    if (!userData) return;

    const tablePreferences = userData.tablePreferences ?? {
      globalExclusions: [],
      globalEnabled: false,
    };

    tablePreferences.globalExclusions = [];
    tablePreferences.globalEnabled = false;
    userData.tablePreferences = tablePreferences;

    UserManager.updateCurrentUserData(userData);
    eventBus.emit('tablePreferences:changed');
  },
};

export default TablePreferences;
