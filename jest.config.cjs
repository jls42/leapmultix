module.exports = {
  // Environnement de test
  testEnvironment: 'jsdom',

  // Configuration des paths
  roots: ['<rootDir>/js', '<rootDir>/tests', '<rootDir>/tests-esm'],
  testMatch: ['<rootDir>/tests/**/*.test.js', '<rootDir>/tests/**/*.spec.js'],

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

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Configuration verbose
  verbose: true,

  // Timeout pour les tests
  testTimeout: 10000,
};
