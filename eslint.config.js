import js from '@eslint/js';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      security,
      sonarjs,
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'prefer-const': 'warn',
      'no-var': 'warn',
      'no-undef': 'warn',
      // Renforcements sécurité et complexité
      eqeqeq: ['error', 'smart'],
      'no-implied-eval': 'error',
      'no-eval': 'error',
      'no-new-func': 'error',
      'max-depth': ['warn', 4],
      complexity: ['warn', 15],
      // Décourage l'utilisation directe de innerHTML (préférer security-utils ou DOM API)
      'no-restricted-properties': [
        'warn',
        {
          property: 'innerHTML',
          message:
            'Éviter Element.innerHTML: utiliser security-utils.* ou DOM API (createElement/textContent).',
        },
      ],
      // Empêche toute réintroduction des modules legacy identifiés comme obsolètes/non câblés
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../modes/*', './modes/*', 'modes/*'],
              message: 'Legacy modes archivés; utiliser les entrées ESM actives ou lazy-loader.',
            },
            {
              group: ['../uiHandlers', './uiHandlers', 'uiHandlers'],
              message: 'uiHandlers legacy déprécié.',
            },
            {
              group: ['../domUtils', './domUtils', 'domUtils'],
              message: 'domUtils legacy déprécié.',
            },
            { group: ['../helpers', './helpers', 'helpers'], message: 'helpers legacy déprécié.' },
            {
              group: ['../core/GameModeManager', './core/GameModeManager', 'core/GameModeManager'],
              message: 'GameModeManager non utilisé.',
            },
            {
              group: ['./utils.js', '../utils.js'],
              message:
                'Importer depuis utils-es6.js (agrégateur) ou core/utils.js (source canonique). utils.js est déprécié.',
            },
          ],
        },
      ],
    },
  },
  // Overrides pour les tests (Jest + Node globals)
  {
    files: ['tests/**/*.js', 'tests-esm/**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      'no-undef': 'off',
      'no-restricted-properties': 'off',
    },
  },
  eslintConfigPrettier,
];
