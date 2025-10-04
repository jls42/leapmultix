module.exports = {
  // Environnement de test
  testEnvironment: 'jsdom',

  // Configuration des paths
  roots: ['<rootDir>/js', '<rootDir>/tests', '<rootDir>/tests-esm'],
  testMatch: ['<rootDir>/tests/**/*.test.js', '<rootDir>/tests/**/*.spec.js'],
  testPathIgnorePatterns: ['/node_modules/'],

  // ESM is inferred automatically from package.json ("type": "module")

  // No transforms needed for plain ESM + JS; keep explicit empty transform
  transform: {},

  // Configuration coverage
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/tests/**',
    '!js/**/*.test.js',
    '!js/**/*.spec.js',
    '!js/bundles/**',
    '!js/optimized/**',
    '!node_modules/**',
  ],

  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  // Seuils de couverture - À augmenter progressivement
  // Note: Couverture actuelle à 0% car tests unitaires isolés
  // Objectif: Augmenter progressivement vers 80% global
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Configuration verbose
  verbose: true,

  // Timeout pour les tests
  testTimeout: 10000,
};
