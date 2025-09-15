/* eslint-env jest, node */
/**
 * Tests pour le module Storage centralisé
 * Module critique pour la persistance des données utilisateur
 */

// Mock localStorage pour les tests
const localStorageMock = {
  store: {},
  getItem: jest.fn(key => localStorageMock.store[key] || null),
  setItem: jest.fn((key, value) => {
    localStorageMock.store[key] = value;
  }),
  removeItem: jest.fn(key => {
    delete localStorageMock.store[key];
  }),
  clear: jest.fn(() => {
    localStorageMock.store = {};
  }),
};

// Mock window.localStorage
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('Storage Module', () => {
  // Simulation du module Storage basée sur js/core/storage.js
  const Storage = {
    // Version simplifiée pour les tests
    get: jest.fn((key, defaultValue = null) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.warn(`Erreur lors de la lecture de '${key}':`, error);
        return defaultValue;
      }
    }),

    set: jest.fn((key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error(`Erreur lors de la sauvegarde de '${key}':`, error);
        return false;
      }
    }),

    remove: jest.fn(key => {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.warn(`Erreur lors de la suppression de '${key}':`, error);
        return false;
      }
    }),

    clear: jest.fn(() => {
      try {
        localStorage.clear();
        return true;
      } catch (error) {
        console.error('Erreur lors du nettoyage:', error);
        return false;
      }
    }),

    // Fonctions spécifiques aux utilisateurs
    getUserData: jest.fn(username => {
      const players = Storage.get('players', {});
      return players[username] || null;
    }),

    saveUserData: jest.fn((username, userData) => {
      const players = Storage.get('players', {});
      players[username] = userData;
      return Storage.set('players', players);
    }),

    // Fonctions de préférences globales
    getPreference: jest.fn((key, defaultValue = null) => {
      const prefs = Storage.get('preferences', {});
      return prefs[key] !== undefined ? prefs[key] : defaultValue;
    }),

    setPreference: jest.fn((key, value) => {
      const prefs = Storage.get('preferences', {});
      prefs[key] = value;
      return Storage.set('preferences', prefs);
    }),
  };

  beforeEach(() => {
    // Nettoyer le localStorage mock avant chaque test
    localStorageMock.clear();
    localStorageMock.store = {};

    // Reset des mocks
    jest.clearAllMocks();
  });

  describe('Fonctions de base', () => {
    test('get() doit retourner la valeur stockée', () => {
      // Arrangement
      const testData = { name: 'test', score: 100 };
      localStorage.setItem('testKey', JSON.stringify(testData));

      // Action
      const result = Storage.get('testKey');

      // Assertion
      expect(result).toEqual(testData);
    });

    test('get() doit retourner la valeur par défaut si clé inexistante', () => {
      // Action
      const result = Storage.get('inexistentKey', 'defaultValue');

      // Assertion
      expect(result).toBe('defaultValue');
    });

    test('set() doit sauvegarder correctement les données', () => {
      // Arrangement
      const testData = { user: 'john', preferences: { theme: 'dark' } };

      // Action
      const result = Storage.set('userData', testData);

      // Assertion
      expect(result).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith('userData', JSON.stringify(testData));
    });

    test('remove() doit supprimer la clé spécifiée', () => {
      // Arrangement
      localStorage.setItem('toDelete', 'someValue');

      // Action
      const result = Storage.remove('toDelete');

      // Assertion
      expect(result).toBe(true);
      expect(localStorage.removeItem).toHaveBeenCalledWith('toDelete');
    });
  });

  describe('Gestion des utilisateurs', () => {
    test('getUserData() doit retourner les données utilisateur', () => {
      // Arrangement
      const users = {
        john: { score: 150, avatar: 'fox' },
        jane: { score: 200, avatar: 'unicorn' },
      };
      localStorage.setItem('players', JSON.stringify(users));

      // Action
      const johnData = Storage.getUserData('john');

      // Assertion
      expect(johnData).toEqual({ score: 150, avatar: 'fox' });
    });

    test('saveUserData() doit sauvegarder les données utilisateur', () => {
      // Arrangement
      const userData = { score: 300, avatar: 'dragon', theme: 'space' };

      // Action
      const result = Storage.saveUserData('newUser', userData);

      // Assertion
      expect(result).toBe(true);

      // Vérifier que les données sont sauvegardées
      const players = JSON.parse(localStorage.getItem('players'));
      expect(players.newUser).toEqual(userData);
    });
  });

  describe("Cas d'usage LeapMultix", () => {
    test('Scénario complet: création utilisateur + sauvegarde scores', () => {
      // Arrangement - Nouvel utilisateur
      const username = 'testPlayer';
      const initialData = {
        avatar: 'fox',
        nickname: username,
        bestScore: 0,
        volume: 1,
        starsByTable: {},
      };

      // Action 1: Créer utilisateur
      Storage.saveUserData(username, initialData);

      // Action 2: Mettre à jour le score
      const userData = Storage.getUserData(username);
      userData.bestScore = 150;
      userData.starsByTable['2'] = 3;
      Storage.saveUserData(username, userData);

      // Assertion
      const finalData = Storage.getUserData(username);
      expect(finalData.bestScore).toBe(150);
      expect(finalData.starsByTable['2']).toBe(3);
      expect(finalData.avatar).toBe('fox'); // Données préservées
    });
  });
});
