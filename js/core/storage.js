/**
 * Module de stockage centralisé
 * Centralise toutes les opérations localStorage avec gestion d'erreurs
 * Phase 2.2 - Consolidation des utilitaires
 */

// Clés de stockage centralisées
export const STORAGE_KEYS = {
  // Utilisateurs
  PLAYERS: 'players',
  CURRENT_USER: 'currentUser',

  // Préférences globales
  LANGUAGE: 'language',
  COLOR_THEME: 'colorTheme',
  VOICE_ENABLED: 'voiceEnabled',
  VOLUME: 'volume',
  HIGH_CONTRAST: 'highContrastEnabled',
  FONT_SIZE: 'fontSize',

  // Statistiques
  MULT_STATS: 'multiplicationStats',

  // Quiz
  QUIZ_EXCLUDE_TABLES: 'quizExcludeTables',
};

/**
 * API de stockage centralisée
 */
const Storage = {
  /**
   * Obtenir une valeur du localStorage avec gestion d'erreur
   * @param {string} key - Clé de stockage
   * @param {*} defaultValue - Valeur par défaut
   * @returns {*} Valeur stockée ou valeur par défaut
   */
  get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      if (value === null) return defaultValue;

      // Tenter de parser comme JSON
      try {
        return JSON.parse(value);
      } catch {
        // Si pas JSON, retourner la string
        return value;
      }
    } catch (error) {
      console.error(`Erreur lecture localStorage [${key}]:`, error);
      return defaultValue;
    }
  },

  /**
   * Sauvegarder une valeur dans localStorage
   * @param {string} key - Clé de stockage
   * @param {*} value - Valeur à sauvegarder
   * @returns {boolean} Succès de l'opération
   */
  set(key, value) {
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Erreur écriture localStorage [${key}]:`, error);
      return false;
    }
  },

  /**
   * Supprimer une clé du localStorage
   * @param {string} key - Clé à supprimer
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Erreur suppression localStorage [${key}]:`, error);
    }
  },

  /**
   * Obtenir les données complètes d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @returns {Object} Données utilisateur ou objet vide
   */
  getUserData(userId) {
    if (!userId) return {};
    const players = this.get(STORAGE_KEYS.PLAYERS, {});

    return Object.prototype.hasOwnProperty.call(players, userId) ? players[userId] : {};
  },

  /**
   * Sauvegarder les données d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @param {Object} userData - Données à sauvegarder
   * @returns {boolean} Succès de l'opération
   */
  saveUserData(userId, userData) {
    if (!userId) return false;

    const playersObj = this.get(STORAGE_KEYS.PLAYERS, {});
    const id = String(userId)
      .replace(/[^\w ._-]/g, '')
      .slice(0, 50);
    const pMap = new Map(Object.entries(playersObj || {}));
    const existing = pMap.get(id) || {};
    pMap.set(id, { ...existing, ...userData });
    return this.set(STORAGE_KEYS.PLAYERS, Object.fromEntries(pMap));
  },

  // === FONCTIONS SPÉCIALISÉES UTILISATEURS ===

  /**
   * Charger tous les joueurs
   */
  loadPlayers() {
    return this.get(STORAGE_KEYS.PLAYERS, {});
  },

  /**
   * Sauvegarder tous les joueurs
   */
  savePlayers(playersData) {
    return this.set(STORAGE_KEYS.PLAYERS, playersData);
  },

  // === PRÉFÉRENCES GLOBALES ===

  /**
   * Charger la langue
   */
  loadLanguage() {
    return this.get(STORAGE_KEYS.LANGUAGE, 'fr');
  },

  /**
   * Sauvegarder la langue
   */
  saveLanguage(langCode) {
    return this.set(STORAGE_KEYS.LANGUAGE, langCode);
  },

  /**
   * Charger le thème couleur
   */
  loadColorTheme() {
    return this.get(STORAGE_KEYS.COLOR_THEME, 'default');
  },

  /**
   * Sauvegarder le thème couleur
   */
  saveColorTheme(themeName) {
    return this.set(STORAGE_KEYS.COLOR_THEME, themeName);
  },

  /**
   * Charger l'état de la voix
   */
  loadVoiceEnabled() {
    return this.get(STORAGE_KEYS.VOICE_ENABLED, true);
  },

  /**
   * Sauvegarder l'état de la voix
   */
  saveVoiceEnabled(enabled) {
    return this.set(STORAGE_KEYS.VOICE_ENABLED, enabled);
  },

  /**
   * Charger le volume (avec support utilisateur)
   */
  loadVolume(currentUser = null, players = null) {
    // Volume spécifique utilisateur prioritaire
    if (
      currentUser &&
      players &&
      Object.prototype.hasOwnProperty.call(players, currentUser) &&
      players[currentUser].volume !== undefined
    ) {
      return Math.max(0, Math.min(1, players[currentUser].volume));
    }

    // Volume global sinon
    const globalVolume = this.get(STORAGE_KEYS.VOLUME, 1);
    return Math.max(0, Math.min(1, globalVolume));
  },

  /**
   * Sauvegarder le volume (global + utilisateur)
   */
  saveVolume(volumeLevel, currentUser = null, players = null) {
    // Sauvegarde globale
    this.set(STORAGE_KEYS.VOLUME, volumeLevel);

    // Sauvegarde spécifique utilisateur si possible
    /**
     * Fonction if
     * @param {*} currentUser - Description du paramètre
     * @returns {*} Description du retour
     */
    if (currentUser && players && Object.prototype.hasOwnProperty.call(players, currentUser)) {
      players[currentUser].volume = volumeLevel;
      this.savePlayers(players);
    }
  },

  /**
   * Charger mode contraste élevé
   */
  loadHighContrastEnabled() {
    return this.get(STORAGE_KEYS.HIGH_CONTRAST, false);
  },

  /**
   * Sauvegarder mode contraste élevé
   */
  saveHighContrastEnabled(enabled) {
    return this.set(STORAGE_KEYS.HIGH_CONTRAST, enabled);
  },

  /**
   * Charger taille police
   */
  loadFontSize() {
    return this.get(STORAGE_KEYS.FONT_SIZE, 'medium');
  },

  /**
   * Sauvegarder taille police
   */
  saveFontSize(size) {
    return this.set(STORAGE_KEYS.FONT_SIZE, size);
  },

  // === FONCTIONS SPÉCIALISÉES JEUX ===

  /**
   * Charger statistiques multiplication
   */
  loadMultiplicationStats() {
    return this.get(STORAGE_KEYS.MULT_STATS, {});
  },

  /**
   * Sauvegarder statistiques multiplication
   */
  saveMultiplicationStats(stats) {
    return this.set(STORAGE_KEYS.MULT_STATS, stats);
  },

  /**
   * Charger tables exclues du quiz
   */
  loadQuizExcludeTables() {
    return this.get(STORAGE_KEYS.QUIZ_EXCLUDE_TABLES, []);
  },

  /**
   * Sauvegarder tables exclues du quiz
   */
  saveQuizExcludeTables(excluded) {
    return this.set(STORAGE_KEYS.QUIZ_EXCLUDE_TABLES, excluded);
  },

  /**
   * Obtenir la date actuelle comme string
   */
  getCurrentDateString() {
    return new Date().toISOString().split('T')[0];
  },
};

export default Storage;
// Named exports convenience wrappers for ESM consumers
export const loadMultiplicationStats = () => Storage.loadMultiplicationStats();
export const loadQuizExcludeTables = () => Storage.loadQuizExcludeTables();
export const saveQuizExcludeTables = excluded => Storage.saveQuizExcludeTables(excluded);
export const getCurrentDateString = () => Storage.getCurrentDateString();
