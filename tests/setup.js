/**
 * Configuration globale pour les tests Jest
 * Setup minimal pour LeapMultix
 */

// Mock localStorage complet
const localStorageMock = {
  store: {},
  length: 0,
  getItem: function (key) {
    return this.store[key] || null;
  },
  setItem: function (key, value) {
    this.store[key] = value.toString();
    this.length = Object.keys(this.store).length;
  },
  removeItem: function (key) {
    delete this.store[key];
    this.length = Object.keys(this.store).length;
  },
  clear: function () {
    this.store = {};
    this.length = 0;
  },
  key: function (index) {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  },
};

// Assign localStorage to global
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Setup nettoyage après chaque test
afterEach(() => {
  // Nettoyer localStorage
  localStorageMock.clear();
  localStorageMock.store = {};

  // Reset des mocks (compatible ESM sans global jest)
  try {
    if (typeof jest !== 'undefined' && jest.clearAllMocks) jest.clearAllMocks();
  } catch (e) {
    void e;
  }
});
/* eslint-env jest, node */
