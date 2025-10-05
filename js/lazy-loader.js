/**
 * Système de Lazy Loading LeapMultix
 * Charge les modules de jeux uniquement quand nécessaire
 * Phase 4.1a - Optimisation des performances
 */

import { VERSION_PARAM } from './cache-updater.js';
import { eventBus } from './core/eventBus.js';

export class LazyLoader {
  constructor() {
    this.loadedModules = new Set();
    this.loadingPromises = new Map();
    this.moduleConfigs = {
      // Modules de jeux (4+26+18+22+25 = 95 KB)
      games: {
        scripts: [
          'js/questionGenerator.js',
          // Use refactored class-based game modes
          'js/modes/QuizMode.js',
          'js/modes/ChallengeMode.js',
          'js/modes/DiscoveryMode.js',
          'js/modes/AdventureMode.js',
        ],
        size: 95,
        category: 'games',
      },

      // Modules arcade (39+30+28+13+6+5+4+2+30 = 157 KB)
      arcade: {
        scripts: [
          // 'js/arcade-ui.js',  // Désactivé: nouvelle UI via ArcadeMode
          'js/arcade-utils.js', // Utilitaires requis par les sous-jeux
          'js/arcade.js', // Helpers globaux (template, game over, handlers)
          'js/arcade-invasion.js',
          'js/arcade-multimiam.js',
          'js/arcade-multisnake.js',
          'js/arcade-multimemory.js',
          'js/arcade-common.js',
          'js/multisnake.js',
        ],
        size: 157,
        category: 'arcade',
      },

      // Modules multimiam (ESM chain)
      multimiam: {
        scripts: [
          // Entrée + questions (les autres sont importés par multimiam.js)
          'js/multimiam.js',
          'js/multimiam-questions.js',
        ],
        size: 29, // taille approximative chargée directement; le reste via imports
        category: 'multimiam',
      },
    };
  }

  /**
   * Charger un module de manière asynchrone
   * @param {string} moduleId - ID du module à charger
   * @returns {Promise} - Promise résolue quand le module est chargé
   */
  async loadModule(moduleId) {
    // Si déjà chargé, retourner immédiatement
    if (this.loadedModules.has(moduleId)) {
      return Promise.resolve();
    }

    // Si en cours de chargement, retourner la promesse existante
    if (this.loadingPromises.has(moduleId)) {
      return this.loadingPromises.get(moduleId);
    }

    const config = this.moduleConfigs[moduleId];
    if (!config) {
      throw new Error(`Module ${moduleId} non configuré`);
    }

    // Créer la promesse de chargement
    const loadingPromise = this.loadScripts(config.scripts)
      .then(() => {
        this.loadedModules.add(moduleId);
        this.loadingPromises.delete(moduleId);

        // Déclencher des événements (EventBus + window fallback)
        try {
          eventBus.emit('moduleLoaded', { moduleId, config });
        } catch (e) {
          void e;
        }
        try {
          (typeof globalThis !== 'undefined'
            ? globalThis
            : typeof window !== 'undefined'
              ? window
              : undefined
          )?.dispatchEvent?.(new CustomEvent('moduleLoaded', { detail: { moduleId, config } }));
        } catch (e) {
          void e;
        }
      })
      .catch(error => {
        this.loadingPromises.delete(moduleId);
        console.error(`❌ Erreur chargement module ${moduleId}:`, error);
        throw error;
      });

    this.loadingPromises.set(moduleId, loadingPromise);
    return loadingPromise;
  }

  /**
   * Charger une liste de scripts de manière séquentielle
   * @param {string[]} scripts - Liste des chemins de scripts
   * @returns {Promise} - Promise résolue quand tous les scripts sont chargés
   */
  async loadScripts(scripts) {
    const loadPromises = scripts.map(scriptPath => this.loadScript(scriptPath));
    return Promise.all(loadPromises);
  }

  /**
   * Charger un script individuel
   * @param {string} scriptPath - Chemin du script
   * @returns {Promise} - Promise résolue quand le script est chargé
   */
  loadScript(scriptPath) {
    return new Promise((resolve, reject) => {
      // Vérifier si le script n'est pas déjà présent
      if (document.querySelector(`script[src="${scriptPath}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');

      // Utiliser le système de versioning global pour tous les scripts dans tous les environnements
      let finalSrc = scriptPath;
      if (VERSION_PARAM) {
        finalSrc = `${scriptPath}?${VERSION_PARAM}`;
      }

      script.src = finalSrc;
      script.async = true;

      // Détection automatique ES6 modules
      // Critères: fichiers dans /modes/, questionGenerator, arcade-es6, ou
      // certains fichiers connus migrés vers ES6
      const isES6Module =
        scriptPath.includes('/modes/') ||
        scriptPath.includes('questionGenerator') ||
        scriptPath.includes('-es6') ||
        scriptPath.includes('ES6') ||
        // Fichiers connus avec imports ES6 après migration
        scriptPath.includes('quiz.js') ||
        scriptPath.includes('challenge.js') ||
        scriptPath.includes('adventure.js') ||
        scriptPath.includes('discovery.js') ||
        scriptPath.includes('arcade-utils.js') ||
        scriptPath.includes('arcade-invasion.js') ||
        scriptPath.includes('arcade-common.js') ||
        scriptPath.includes('arcade.js') ||
        scriptPath.includes('arcade-multimemory.js') ||
        scriptPath.includes('arcade-multimiam.js') ||
        scriptPath.includes('arcade-multisnake.js') ||
        scriptPath.includes('multimiam.js') ||
        scriptPath.includes('multimiam-questions.js') ||
        scriptPath.includes('multimiam-renderer.js') ||
        scriptPath.includes('multimiam-engine.js') ||
        scriptPath.includes('multimiam-controls.js') ||
        scriptPath.includes('multimiam-ui.js') ||
        scriptPath.includes('multisnake.js');

      if (isES6Module) {
        script.type = 'module';
      }

      script.onload = () => {
        resolve();
      };

      script.onerror = () => {
        console.error(`❌ Erreur chargement script: ${scriptPath}`);
        reject(new Error(`Failed to load script: ${scriptPath}`));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Précharger un module en arrière-plan (sans bloquer)
   * @param {string} moduleId - ID du module à précharger
   */
  preloadModule(moduleId) {
    if (!this.loadedModules.has(moduleId) && !this.loadingPromises.has(moduleId)) {
      this.loadModule(moduleId).catch(error => {
        console.warn(`⚠️ Échec préchargement ${moduleId}:`, error);
      });
    }
  }

  /**
   * Charger le module pour un mode de jeu spécifique
   * @param {string} gameMode - Mode de jeu (quiz, challenge, adventure, discovery, arcade)
   * @returns {Promise} - Promise résolue quand le module requis est chargé
   */
  async loadForGameMode(gameMode) {
    switch (gameMode) {
      case 'quiz':
      case 'challenge':
      case 'adventure':
      case 'discovery':
        return this.loadModule('games');

      case 'arcade':
        // Charger arcade + éventuellement multimiam si besoin
        await this.loadModule('arcade');
        // Précharger multimiam en arrière-plan pour les jeux multimiam
        this.preloadModule('multimiam');
        return;

      default:
        console.warn(`⚠️ Mode de jeu inconnu: ${gameMode}`);
        return Promise.resolve();
    }
  }

  /**
   * Précharger intelligemment les modules selon l'usage
   */
  smartPreload() {
    // Précharger les jeux après 2 secondes si l'utilisateur navigue
    setTimeout(() => {
      const loc =
        typeof globalThis !== 'undefined'
          ? globalThis.location
          : typeof window !== 'undefined'
            ? window.location
            : null;
      if (loc && (loc.hash === '' || loc.hash === '#slide1')) {
        this.preloadModule('games');
      }
    }, 2000);

    // Précharger arcade si l'utilisateur survole le bouton arcade
    // Préférence: data-mode="arcade"; fallback: ancien onclick
    const arcadeBtn = document.querySelector('[data-mode="arcade"], [onclick*="arcade"]');
    if (arcadeBtn) {
      arcadeBtn.addEventListener(
        'mouseenter',
        () => {
          this.preloadModule('arcade');
        },
        { once: true }
      );
    }
  }

  /**
   * Obtenir les statistiques de chargement
   */
  getStats() {
    const totalSize = Object.values(this.moduleConfigs).reduce(
      (sum, config) => sum + config.size,
      0
    );
    const loadedSize = Array.from(this.loadedModules).reduce((sum, moduleId) => {
      return sum + this.moduleConfigs[moduleId]?.size || 0;
    }, 0);

    return {
      totalModules: Object.keys(this.moduleConfigs).length,
      loadedModules: this.loadedModules.size,
      totalSize,
      loadedSize,
      savedSize: totalSize - loadedSize,
      savedPercentage: Math.round(((totalSize - loadedSize) / totalSize) * 100),
    };
  }

  /**
   * Vérifier si un module est chargé
   * @param {string} moduleId - ID du module
   * @returns {boolean} - True si chargé
   */
  isLoaded(moduleId) {
    return this.loadedModules.has(moduleId);
  }

  /**
   * Obtenir la liste des modules chargés
   * @returns {string[]} - Liste des IDs des modules chargés
   */
  getLoadedModules() {
    return Array.from(this.loadedModules);
  }
}

// Instance module-scoped (ESM)
const lazyLoader = new LazyLoader();
export { lazyLoader };

// Préchargement intelligent après initialisation
document.addEventListener('DOMContentLoaded', () => {
  // Démarrer le préchargement intelligent
  setTimeout(() => {
    lazyLoader.smartPreload();
  }, 1000);
});

export default lazyLoader;
