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

  // Couverture mesurée sur les tests ESM (npm run test:coverage), les seuls qui chargent les
  // vrais modules du jeu ; le code tiers copié dans js/vendor/ n'est pas le nôtre
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/tests/**',
    '!js/**/*.test.js',
    '!js/**/*.spec.js',
    '!js/bundles/**',
    '!js/optimized/**',
    '!js/vendor/**',
    '!node_modules/**',
  ],

  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  // Seuils au niveau mesuré le 14/10/2026 (lignes 85,6 %, branches 83,2 %, fonctions 84,8 %) :
  // une baisse fait échouer verify. Les remonter quand la couverture progresse.
  coverageThreshold: {
    global: {
      branches: 83,
      functions: 84,
      lines: 85,
      statements: 85,
    },
  },

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Configuration verbose
  verbose: true,

  // Timeout pour les tests
  testTimeout: 10000,
};
