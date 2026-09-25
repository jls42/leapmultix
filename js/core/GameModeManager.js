/**
 * Gestionnaire centralisé des modes de jeu LeapMultix
 * Phase 5.1+ - Orchestration des modes refactorisés et legacy
 *
 * Gère :
 * - Chargement dynamique des modes
 * - Transition progressive legacy → refactorisé
 * - Compatibilité avec l'interface existante
 * - Nettoyage et gestion d'erreurs
 */

import { goToSlide } from '../slides.js';
import { AudioManager } from '../core/audio.js';
import { cancelSpeech } from '../speech.js';
import { getTranslation, showMessage } from '../utils-es6.js';

export class GameModeManager {
  constructor() {
    this.modes = new Map();
    this.currentMode = null;
    this.isTransitioning = false;

    // Configuration des modes disponibles
    this.modeConfig = {
      // Modes refactorisés (Phase 5+)
      quiz: {
        type: 'refactored',
        class: 'QuizMode',
        module: './modes/QuizMode.js',
        legacy: 'startQuizMode',
      },
      challenge: {
        type: 'refactored',
        class: 'ChallengeMode',
        module: './modes/ChallengeMode.js',
        legacy: 'startChallengeMode',
      },
      adventure: {
        type: 'refactored',
        class: 'AdventureMode',
        module: './modes/AdventureMode.js',
        legacy: 'startAdventureMode',
      },
      arcade: {
        type: 'refactored',
        class: 'ArcadeMode',
        module: './modes/ArcadeMode.js',
        legacy: 'startArcadeMode',
      },
      discovery: {
        type: 'refactored',
        class: 'DiscoveryMode',
        module: './modes/DiscoveryMode.js',
        legacy: 'startDiscoveryMode',
      },
    };

    // 🎉 TOUS LES MODES SONT MAINTENANT REFACTORISÉS ! 🎉
    // Phase 5 terminée avec succès
  }

  /**
   * Démarrer un mode de jeu
   */
  async startMode(modeName) {
    try {
      /**
       * Fonction if
       * @param {*} this.isTransitioning - Description du paramètre
       * @returns {*} Description du retour
       */
      if (this.isTransitioning) {
        console.warn('⚠️ Transition en cours, attente...');
        return;
      }

      this.isTransitioning = true;

      // Arrêter le mode actuel
      await this.stopCurrentMode();

      // Vérifier si le mode existe
      /**
       * Fonction if
       * @param {*} !this.modeConfig[modeName] - Description du paramètre
       * @returns {*} Description du retour
       */

      if (!this.modeConfig[modeName]) {
        throw new Error(`Mode inconnu: ${modeName}`);
      }

      const config = this.modeConfig[modeName];

      // Démarrer selon le type
      /**
       * Fonction if
       * @param {*} config.type - Description du paramètre
       * @returns {*} Description du retour
       */
      if (config.type === 'refactored') {
        await this.startRefactoredMode(modeName, config);
      } else {
        await this.startLegacyMode(modeName, config);
      }

      this.isTransitioning = false;
    } catch (error) {
      this.isTransitioning = false;
      console.error(`❌ Erreur lors du démarrage de ${modeName}:`, error);
      await this.handleError(error, modeName);
    }
  }

  /**
   * Démarrer un mode refactorisé
   */
  async startRefactoredMode(modeName, config) {
    // Charger dynamiquement le module
    if (!this.modes.has(modeName)) {
      // Mapping explicite des loaders, sans indexation d'objet dynamique
      const LOADERS = new Map([
        ['quiz', () => import('../modes/QuizMode.js')],
        ['challenge', () => import('../modes/ChallengeMode.js')],
        ['adventure', () => import('../modes/AdventureMode.js')],
        ['arcade', () => import('../modes/ArcadeMode.js')],
        ['discovery', () => import('../modes/DiscoveryMode.js')],
      ]);
      const loader = LOADERS.get(modeName);
      if (typeof loader !== 'function') {
        throw new Error(`Loader non défini pour le mode: ${modeName}`);
      }
      const module = await loader();
      const ModeClass = module.default;

      /**
       * Fonction if
       * @param {*} !ModeClass - Description du paramètre
       * @returns {*} Description du retour
       */
      if (!ModeClass) {
        throw new Error(`Classe ${config.class} non trouvée dans ${config.module}`);
      }

      this.modes.set(modeName, ModeClass);
    }

    // Créer une nouvelle instance
    const ModeClass = this.modes.get(modeName);
    const modeInstance = new ModeClass();

    // Démarrer le mode
    await modeInstance.start();

    // Sauvegarder l'instance courante
    this.currentMode = {
      name: modeName,
      type: 'refactored',
      instance: modeInstance,
    };
  }

  /**
   * Démarrer un mode legacy
   */
  async startLegacyMode(modeName, config) {
    // Vérifier que la fonction existe
    /**
     * Fonction if
     * @param {*} typeof - Description du paramètre
     * @returns {*} Description du retour
     */
    if (typeof window[config.function] !== 'function') {
      throw new Error(`Fonction legacy ${config.function} non disponible`);
    }

    // Appeler la fonction legacy
    window[config.function]();

    // Sauvegarder l'instance courante
    this.currentMode = {
      name: modeName,
      type: 'legacy',
      function: config.function,
    };
  }

  /**
   * Arrêter le mode actuel
   */
  async stopCurrentMode() {
    if (!this.currentMode) return;

    // Annuler toute narration et sons restants
    cancelSpeech();
    try {
      AudioManager.stopAll();
    } catch {
      /* no-op: audio optional */
    }

    try {
      /**
       * Fonction if
       * @param {*} this.currentMode.type - Description du paramètre
       * @returns {*} Description du retour
       */
      if (this.currentMode.type === 'refactored') {
        // Mode refactorisé : utiliser la méthode stop()
        /**
         * Fonction if
         * @param {*} this.currentMode.instance - Description du paramètre
         * @returns {*} Description du retour
         */
        if (this.currentMode.instance && typeof this.currentMode.instance.stop === 'function') {
          await this.currentMode.instance.stop();
        }
      } else {
        // Mode legacy : appeler la fonction stop correspondante via une whitelist ESM
        const stopFunctionName = this.currentMode.function.replace('start', 'stop');
        const STOPPERS = new Map([
          [
            'stopQuizMode',
            async () => {
              const m = await import('../modes/QuizMode.js');
              return m.stopQuizMode?.();
            },
          ],
          [
            'stopChallengeMode',
            async () => {
              const m = await import('../modes/ChallengeMode.js');
              return m.stopChallengeMode?.();
            },
          ],
          [
            'stopAdventureMode',
            async () => {
              const m = await import('../modes/AdventureMode.js');
              return m.stopAdventureMode?.();
            },
          ],
          [
            'stopArcadeMode',
            async () => {
              const m = await import('../modes/ArcadeMode.js');
              return m.stopArcadeMode?.();
            },
          ],
          [
            'stopDiscoveryMode',
            async () => {
              const m = await import('../modes/DiscoveryMode.js');
              return m.stopDiscoveryMode?.();
            },
          ],
        ]);
        const stopper = STOPPERS.get(stopFunctionName);
        if (typeof stopper === 'function') await stopper();
      }
    } catch (error) {
      console.error(`❌ Erreur lors de l'arrêt de ${this.currentMode.name}:`, error);
    }

    this.currentMode = null;
  }

  /**
   * Obtenir des informations sur un mode
   */
  getModeInfo(modeName) {
    const config = this.modeConfig[modeName];
    if (!config) return null;

    return {
      name: modeName,
      type: config.type,
      isRefactored: config.type === 'refactored',
      isLegacy: config.type === 'legacy',
      isLoaded: this.modes.has(modeName),
      isCurrent: this.currentMode?.name === modeName,
    };
  }

  /**
   * Obtenir la liste de tous les modes
   */
  getAllModes() {
    return Object.keys(this.modeConfig).map(name => this.getModeInfo(name));
  }

  /**
   * Vérifier si un mode est disponible
   */
  isModeAvailable(modeName) {
    return modeName in this.modeConfig;
  }

  /**
   * Obtenir le mode actuel
   */
  getCurrentMode() {
    return this.currentMode;
  }

  /**
   * Précharger un mode refactorisé
   */
  async preloadMode(modeName) {
    const config = this.modeConfig[modeName];
    if (!config || config.type !== 'refactored' || this.modes.has(modeName)) {
      return;
    }

    try {
      const LOADERS = new Map([
        ['quiz', () => import('../modes/QuizMode.js')],
        ['challenge', () => import('../modes/ChallengeMode.js')],
        ['adventure', () => import('../modes/AdventureMode.js')],
        ['arcade', () => import('../modes/ArcadeMode.js')],
        ['discovery', () => import('../modes/DiscoveryMode.js')],
      ]);
      const loader = LOADERS.get(modeName);
      if (!loader) return;
      const module = await loader();
      const ModeClass = module.default;

      /**
       * Fonction if
       * @param {*} ModeClass - Description du paramètre
       * @returns {*} Description du retour
       */
      if (ModeClass) {
        this.modes.set(modeName, ModeClass);
      }
    } catch (error) {
      console.error(`❌ Erreur lors du préchargement de ${modeName}:`, error);
    }
  }

  /**
   * Précharger tous les modes refactorisés
   */
  async preloadAllRefactoredModes() {
    const refactoredModes = Object.keys(this.modeConfig).filter(
      name => this.modeConfig[name].type === 'refactored'
    );

    const promises = refactoredModes.map(mode => this.preloadMode(mode));
    await Promise.allSettled(promises);
  }

  /**
   * Gestion d'erreur
   */
  async handleError(error, modeName) {
    console.error(`💥 Erreur critique dans GameModeManager pour ${modeName}:`, error);

    // Tenter de revenir à l'écran d'accueil
    try {
      /**
       * Fonction if
       * @param {*} typeof - Description du paramètre
       * @returns {*} Description du retour
       */
      await goToSlide(1);
    } catch (e) {
      console.error("❌ Impossible de revenir à l'écran d'accueil:", e);
    }

    // Afficher un message d'erreur à l'utilisateur
    /**
     * Fonction if
     * @param {*} typeof - Description du paramètre
     * @returns {*} Description du retour
     */
    try {
      showMessage(
        getTranslation('game_mode_error') ||
          `Erreur lors du chargement du mode ${modeName}. Retour à l'accueil.`
      );
    } catch {
      /* no-op: UI message optional */
    }
  }

  /**
   * Nettoyer toutes les ressources
   */
  cleanup() {
    // Arrêter le mode actuel
    this.stopCurrentMode();

    // Nettoyer le cache des modes
    this.modes.clear();
    this.currentMode = null;
    this.isTransitioning = false;
  }

  /**
   * Obtenir des statistiques sur les modes
   */
  getStats() {
    const stats = {
      totalModes: Object.keys(this.modeConfig).length,
      refactoredModes: 0,
      legacyModes: 0,
      loadedModes: this.modes.size,
      currentMode: this.currentMode?.name || null,
    };

    Object.values(this.modeConfig).forEach(config => {
      /**
       * Fonction if
       * @param {*} config.type - Description du paramètre
       * @returns {*} Description du retour
       */
      if (config.type === 'refactored') {
        stats.refactoredModes++;
      } else {
        stats.legacyModes++;
      }
    });

    return stats;
  }
}

// Instance globale
const gameModeManager = new GameModeManager();

// Nettoyage automatique lors du déchargement de la page (ESM context)
try {
  (typeof globalThis !== 'undefined'
    ? globalThis
    : typeof window !== 'undefined'
      ? window
      : undefined
  )?.addEventListener?.('beforeunload', () => {
    gameModeManager.cleanup();
  });
} catch {
  /* no-op: non-browser environment */
}

// Export pour usage avancé
export default gameModeManager;
