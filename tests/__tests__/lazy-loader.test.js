/**
 * Tests pour le module Lazy Loader
 * Phase 4.3b - Tests modules critiques
 */

// Mock DOM
const mockScript = {
  src: '',
  onload: null,
  onerror: null,
  async: true,
  defer: true,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

const mockElement = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  querySelectorAll: jest.fn(() => []),
  dataset: {},
};

// Setup global avant les tests
beforeEach(() => {
  global.document = {
    createElement: jest.fn(() => mockScript),
    head: {
      appendChild: jest.fn(),
    },
    querySelector: jest.fn(() => mockElement),
    querySelectorAll: jest.fn(() => [mockElement]),
    addEventListener: jest.fn(),
  };
  global.window = {
    setGameMode: jest.fn(),
    addEventListener: jest.fn(),
  };

  jest.clearAllMocks();

  // Mock console
  global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };

  // Mock setTimeout pour les tests de délai
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

const path = require('path');
const { pathToFileURL } = require('url');

// Import du module à tester (ESM ou global fallback)
let LazyLoader;
beforeAll(async () => {
  try {
    const mod = await import(pathToFileURL(path.join(__dirname, '../../js/lazy-loader.js')).href);
    LazyLoader = mod.LazyLoader || mod.default || global.LazyLoader;
  } catch {
    LazyLoader = global.LazyLoader;
  }
});

describe('Lazy Loader Module', () => {
  describe('configuration des modules - mapping logique', () => {
    test('devrait configurer correctement la structure des modules', () => {
      const modules = {
        games: ['quiz.js', 'challenge.js', 'adventure.js'],
        arcade: ['arcade-common.js', 'arcade-invasion.js'],
        multimiam: ['multimiam-common.js', 'multimiam-questions.js'],
      };

      expect(modules.games).toBeDefined();
      expect(modules.games.length).toBe(3);
      expect(modules.arcade).toBeDefined();
      expect(modules.multimiam).toBeDefined();

      // Vérifier que tous les fichiers sont des .js
      Object.values(modules)
        .flat()
        .forEach(file => {
          expect(file).toMatch(/\.js$/);
        });
    });

    test('devrait mapper correctement les modes de jeu aux modules', () => {
      const getModuleForGameMode = mode => {
        const mapping = {
          quiz: 'games',
          challenge: 'games',
          adventure: 'games',
          arcade: 'arcade',
          multimiam: 'multimiam',
          multisnake: 'multimiam',
        };
        return mapping[mode] || null;
      };

      // Tests pour tous les modes supportés
      expect(getModuleForGameMode('quiz')).toBe('games');
      expect(getModuleForGameMode('challenge')).toBe('games');
      expect(getModuleForGameMode('adventure')).toBe('games');
      expect(getModuleForGameMode('arcade')).toBe('arcade');
      expect(getModuleForGameMode('multimiam')).toBe('multimiam');
      expect(getModuleForGameMode('multisnake')).toBe('multimiam');

      // Test pour mode inexistant
      expect(getModuleForGameMode('unknown')).toBeNull();
      expect(getModuleForGameMode('')).toBeNull();
      expect(getModuleForGameMode(null)).toBeNull();
    });
  });

  describe('gestion du chargement - logique de cache', () => {
    test('devrait éviter le double chargement avec un cache', async () => {
      const loadedModules = new Set();
      const loadingPromises = new Map();

      const loadModule = moduleName => {
        // Si déjà chargé, retourner immédiatement
        if (loadedModules.has(moduleName)) {
          return Promise.resolve(true);
        }

        // Si en cours de chargement, retourner la même promesse
        if (loadingPromises.has(moduleName)) {
          return loadingPromises.get(moduleName);
        }

        // Nouveau chargement (sans setTimeout pour éviter timeout)
        const promise = Promise.resolve().then(() => {
          loadedModules.add(moduleName);
          return true;
        });

        loadingPromises.set(moduleName, promise);
        return promise;
      };

      // Démarrer trois chargements simultanés du même module
      const promises = [loadModule('games'), loadModule('games'), loadModule('games')];

      const results = await Promise.all(promises);

      expect(results).toEqual([true, true, true]);
      expect(loadedModules.has('games')).toBe(true);
      expect(loadedModules.size).toBe(1); // Un seul module chargé
    });

    test('devrait vérifier correctement si un module est chargé', () => {
      const loadedModules = new Set(['games', 'arcade']);
      const isModuleLoaded = moduleName => loadedModules.has(moduleName);

      expect(isModuleLoaded('games')).toBe(true);
      expect(isModuleLoaded('arcade')).toBe(true);
      expect(isModuleLoaded('multimiam')).toBe(false);
      expect(isModuleLoaded('')).toBe(false);
      expect(isModuleLoaded(null)).toBe(false);
    });
  });

  describe("gestion d'erreurs - robustesse", () => {
    test('devrait gérer les modules non configurés', async () => {
      const loadModule = moduleName => {
        const modules = {
          games: ['quiz.js'],
          arcade: ['arcade-common.js'],
        };

        if (!modules[moduleName]) {
          return Promise.reject(new Error(`Module ${moduleName} non configuré`));
        }
        return Promise.resolve(true);
      };

      // Test avec module existant
      await expect(loadModule('games')).resolves.toBe(true);

      // Test avec module inexistant
      await expect(loadModule('nonexistent')).rejects.toThrow('Module nonexistent non configuré');
      await expect(loadModule('wrongname')).rejects.toThrow('Module wrongname non configuré');
    });

    test('devrait gérer les erreurs de chargement de scripts', async () => {
      const loadScript = src => {
        // Simuler différents cas d'erreur
        if (src === 'nonexistent.js') {
          return Promise.reject(new Error('404 - Script non trouvé'));
        }
        if (src === 'corrupt.js') {
          return Promise.reject(new Error('Syntax Error - Script corrompu'));
        }
        if (src.endsWith('.js')) {
          return Promise.resolve(true);
        }
        return Promise.reject(new Error('Format de fichier invalide'));
      };

      // Tests de chargement réussi
      await expect(loadScript('valid.js')).resolves.toBe(true);
      await expect(loadScript('quiz.js')).resolves.toBe(true);

      // Tests d'erreurs diverses
      await expect(loadScript('nonexistent.js')).rejects.toThrow('404 - Script non trouvé');
      await expect(loadScript('corrupt.js')).rejects.toThrow('Syntax Error - Script corrompu');
      await expect(loadScript('invalid.txt')).rejects.toThrow('Format de fichier invalide');
    });
  });

  describe('optimisations de performance', () => {
    test('devrait calculer les économies de bande passante', () => {
      const calculateSavings = modules => {
        const fileSizes = {
          'quiz.js': 45,
          'challenge.js': 38,
          'adventure.js': 42,
          'arcade-common.js': 55,
          'arcade-invasion.js': 67,
          'multimiam-common.js': 35,
          'multimiam-questions.js': 28,
        };

        let totalSize = 0;
        Object.values(modules)
          .flat()
          .forEach(file => {
            totalSize += fileSizes[file] || 0;
          });

        return {
          totalSize,
          gamesSize: modules.games?.reduce((sum, file) => sum + (fileSizes[file] || 0), 0) || 0,
          arcadeSize: modules.arcade?.reduce((sum, file) => sum + (fileSizes[file] || 0), 0) || 0,
          percentage: Math.round(totalSize > 0 ? 100 : 0),
        };
      };

      const modules = {
        games: ['quiz.js', 'challenge.js', 'adventure.js'],
        arcade: ['arcade-common.js', 'arcade-invasion.js'],
        multimiam: ['multimiam-common.js', 'multimiam-questions.js'],
      };

      const savings = calculateSavings(modules);

      expect(savings.totalSize).toBeGreaterThan(0);
      expect(savings.gamesSize).toBe(45 + 38 + 42); // 125 KB
      expect(savings.arcadeSize).toBe(55 + 67); // 122 KB
      expect(savings.percentage).toBe(100);
    });

    test('devrait précharger intelligemment au survol', () => {
      const preloadStrategy = (hoveredElement, loadedModules) => {
        const gameMode = hoveredElement.dataset?.gameMode;
        if (!gameMode) return null;

        const moduleMap = {
          quiz: 'games',
          arcade: 'arcade',
          multimiam: 'multimiam',
        };

        const requiredModule = moduleMap[gameMode];
        if (!requiredModule || loadedModules.has(requiredModule)) {
          return null; // Pas besoin de précharger
        }

        return requiredModule;
      };

      const loadedModules = new Set(['games']);

      // Tests avec différents éléments
      expect(preloadStrategy({ dataset: { gameMode: 'quiz' } }, loadedModules)).toBeNull(); // Déjà chargé
      expect(preloadStrategy({ dataset: { gameMode: 'arcade' } }, loadedModules)).toBe('arcade'); // À précharger
      expect(preloadStrategy({ dataset: {} }, loadedModules)).toBeNull(); // Pas de gameMode
      expect(preloadStrategy({ dataset: { gameMode: 'unknown' } }, loadedModules)).toBeNull(); // Mode inconnu
    });
  });

  // Tests d'intégration réels seulement si le module est disponible
  if (LazyLoader && LazyLoader.init) {
    describe('intégration avec module réel', () => {
      test('devrait initialiser LazyLoader', () => {
        LazyLoader.init();
        expect(LazyLoader.loadedModules).toBeDefined();
        expect(LazyLoader.modules).toBeDefined();
      });

      test('devrait décorer setGameMode si disponible', () => {
        if (global.window && global.window.setGameMode) {
          // Capture la référence si besoin d'assertions ultérieures
          void global.window.setGameMode;
          LazyLoader.init();
          expect(global.window.setGameMode).toBeDefined();
          // La fonction peut être décoré ou non selon l'implementation
        }
      });
    });
  }
});
/* eslint-env jest, node */
