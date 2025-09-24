import js from '@eslint/js';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        console: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        performance: 'readonly',
        Event: 'readonly',
        confirm: 'readonly',
        alert: 'readonly',
        AbortController: 'readonly',
        KeyboardEvent: 'readonly',
        process: 'readonly',
        MutationObserver: 'readonly',
        EventTarget: 'readonly',
        CustomEvent: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        Image: 'readonly',
        Audio: 'readonly',
        XMLHttpRequest: 'readonly',
        fetch: 'readonly',
        Promise: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        self: 'readonly',
        caches: 'readonly',
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
        describe: 'readonly',
        test: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
        global: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
      'no-restricted-properties': 'off',
    },
  },
];
