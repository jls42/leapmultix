# 📋 Plan d'Amélioration du Code - Leapmultix

**Date de création** : 2025-10-03
**Dernière mise à jour** : 2025-10-03
**Version du projet** : 1.0.0

---

## 📊 Vue d'ensemble

Ce document trace toutes les améliorations recommandées suite à l'analyse du code du 2025-10-03. Chaque amélioration est documentée avec des instructions détaillées permettant à n'importe qui de reprendre le travail.

### Légende des statuts

- 🔴 **TODO** : Non commencé
- 🟡 **IN_PROGRESS** : En cours
- 🟢 **DONE** : Terminé
- ⏸️ **ON_HOLD** : En attente (décision ou dépendance)
- ❌ **CANCELLED** : Annulé

---

## 🎯 Priorité 1 : Corrections Immédiates (< 30 min)

### 1.1 Formater les fichiers non conformes à Prettier

**Statut** : 🔴 TODO
**Priorité** : CRITIQUE
**Temps estimé** : 2 minutes
**Assigné à** : _Non assigné_

#### Contexte

Deux fichiers `.claude/` ne respectent pas le formatage Prettier, ce qui peut bloquer les commits si un pre-commit hook est configuré.

#### Fichiers concernés

- `.claude/agents/web-research-specialist.md`
- `.claude/settings.local.json`

#### Commandes à exécuter

```bash
# Depuis la racine du projet leapmultix/
npm run format
```

#### Vérification

```bash
# Doit afficher "All matched files use Prettier code style!"
npm run format:check
```

#### Critères de succès

- ✅ `npm run format:check` ne montre aucune erreur
- ✅ Les 2 fichiers sont correctement formatés
- ✅ Aucun autre fichier n'est modifié (si oui, committer les changements)

---

### 1.2 Intégrer Prettier dans ESLint

**Statut** : 🔴 TODO
**Priorité** : HAUTE
**Temps estimé** : 10 minutes
**Assigné à** : _Non assigné_
**Dépendances** : Aucune

#### Contexte

Actuellement, ESLint et Prettier fonctionnent séparément, ce qui peut créer des conflits de règles de formatage. L'intégration de `eslint-config-prettier` désactive les règles ESLint qui entrent en conflit avec Prettier.

#### Étapes détaillées

**Étape 1 : Installer la dépendance**

```bash
# Depuis la racine du projet leapmultix/
npm install -D eslint-config-prettier
```

**Étape 2 : Mettre à jour eslint.config.js**

Ouvrir le fichier `eslint.config.js` et modifier ainsi :

```javascript
// eslint.config.js
import js from '@eslint/js';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';
import eslintConfigPrettier from 'eslint-config-prettier'; // ← AJOUTER CETTE LIGNE

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // ... globals existants
      },
    },
    plugins: {
      security,
      sonarjs,
    },
    rules: {
      // ... règles existantes
    },
  },
  // Overrides pour les tests
  {
    files: ['tests/**/*.js', 'tests-esm/**/*.mjs'],
    // ... config existante
  },
  eslintConfigPrettier, // ← AJOUTER CETTE LIGNE (DOIT ÊTRE EN DERNIER!)
];
```

**⚠️ IMPORTANT** : `eslintConfigPrettier` DOIT être le dernier élément du tableau pour override les règles conflictuelles.

**Étape 3 : Tester la configuration**

```bash
# Vérifier qu'ESLint fonctionne toujours
npm run lint

# Vérifier Prettier
npm run format:check
```

#### Vérification

```bash
# Aucune erreur ne doit apparaître
npm run verify
```

#### Critères de succès

- ✅ Package `eslint-config-prettier` installé dans `package.json` (devDependencies)
- ✅ Import ajouté dans `eslint.config.js`
- ✅ Config ajoutée en dernier dans le tableau d'export
- ✅ `npm run lint` fonctionne sans erreur
- ✅ `npm run format:check` fonctionne sans erreur
- ✅ Aucun conflit entre ESLint et Prettier

#### Ressources

- [eslint-config-prettier GitHub](https://github.com/prettier/eslint-config-prettier)

---

## 🎯 Priorité 2 : Améliorations Court Terme (< 2h)

### 2.1 Utiliser le package `globals` dans ESLint

**Statut** : 🔴 TODO
**Priorité** : MOYENNE
**Temps estimé** : 15 minutes
**Assigné à** : _Non assigné_
**Dépendances** : Tâche 1.2 (recommandé)

#### Contexte

Le package `globals` (v14.0.0) est déjà installé mais non utilisé. Actuellement, tous les globals (window, document, console, etc.) sont définis manuellement dans `eslint.config.js`, ce qui complique la maintenance et peut être incomplet.

#### Avantages

- ✅ Maintenance simplifiée (package maintenu à jour par la communauté)
- ✅ Couverture automatique de tous les globals browser standard
- ✅ Code plus lisible et standard
- ✅ Support automatique des nouveaux globals ES2024+

#### Étapes détaillées

**Étape 1 : Vérifier que globals est installé**

```bash
# Doit afficher: └── globals@14.0.0
npm list globals
```

**Étape 2 : Modifier eslint.config.js**

Remplacer la configuration actuelle par :

```javascript
// eslint.config.js
import js from '@eslint/js';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';
import globals from 'globals'; // ← AJOUTER CETTE LIGNE
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest', // ← CHANGER de 2022 à 'latest'
      sourceType: 'module',
      globals: {
        ...globals.browser, // ← REMPLACE toute la liste manuelle
        ...globals.node, // ← POUR les scripts Node.js (scripts/)
        // Garder uniquement les globals spécifiques non standard si nécessaire
      },
    },
    plugins: {
      security,
      sonarjs,
    },
    rules: {
      // ... règles existantes (ne pas modifier)
    },
  },
  // Overrides pour les tests
  {
    files: ['tests/**/*.js', 'tests-esm/**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.jest, // ← REMPLACE la liste manuelle des globals Jest
      },
    },
    rules: {
      'no-undef': 'off',
      'no-restricted-properties': 'off',
    },
  },
  eslintConfigPrettier,
];
```

**Étape 3 : Tester**

```bash
# Lint doit passer sans erreur
npm run lint

# Vérifier que les globals sont bien reconnus
# Tester sur un fichier qui utilise window, document, etc.
```

#### Code avant/après

**❌ Avant (manuel, lignes 8-43)** :

```javascript
globals: {
  window: 'readonly',
  console: 'readonly',
  document: 'readonly',
  navigator: 'readonly',
  // ... 30+ lignes de globals manuels
}
```

**✅ Après (automatique via globals)** :

```javascript
globals: {
  ...globals.browser, // Inclut tous les globals browser standard
  ...globals.node,    // Pour scripts Node.js
}
```

#### Vérification

```bash
# Aucune erreur de globals non définis
npm run lint

# Vérifier qu'aucun test n'échoue
npm test
```

#### Critères de succès

- ✅ Import `globals` ajouté en haut du fichier
- ✅ `ecmaVersion` changé de `2022` à `'latest'`
- ✅ Globals browser remplacés par `...globals.browser`
- ✅ Globals Node ajoutés avec `...globals.node`
- ✅ Globals Jest remplacés par `...globals.jest`
- ✅ `npm run lint` passe sans erreur
- ✅ `npm test` passe sans erreur

#### Ressources

- [globals package](https://github.com/sindresorhus/globals)
- [ESLint Language Options](https://eslint.org/docs/latest/use/configure/language-options)

---

### 2.2 Ajouter les seuils de couverture de tests (Coverage Thresholds)

**Statut** : 🔴 TODO
**Priorité** : MOYENNE
**Temps estimé** : 10 minutes
**Assigné à** : _Non assigné_
**Dépendances** : Aucune

#### Contexte

Actuellement, les tests collectent la couverture mais n'imposent aucun seuil minimum. Les meilleures pratiques 2025 recommandent 80-90% de couverture pour les projets en production. Sans seuil configuré, la couverture peut diminuer sans qu'on s'en aperçoive.

#### Avantages

- ✅ Garantit un niveau de qualité minimal
- ✅ Prévient la régression de couverture
- ✅ Fait échouer la CI/CD si couverture insuffisante
- ✅ Identifie rapidement le code non testé

#### Étapes détaillées

**Étape 1 : Analyser la couverture actuelle**

```bash
# Générer un rapport de couverture
npm run test:coverage

# Observer les pourcentages dans la sortie
# Exemple de sortie :
# Statements   : 85.2% ( XXX/XXX )
# Branches     : 78.1% ( XXX/XXX )
# Functions    : 82.5% ( XXX/XXX )
# Lines        : 84.9% ( XXX/XXX )
```

**Note** : Prendre en note les pourcentages actuels avant de définir les seuils.

**Étape 2 : Modifier jest.config.cjs**

Ouvrir `jest.config.cjs` et ajouter après `coverageReporters` :

```javascript
// jest.config.cjs
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/js', '<rootDir>/tests', '<rootDir>/tests-esm'],
  testMatch: ['<rootDir>/tests/**/*.test.js', '<rootDir>/tests/**/*.spec.js'],
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

  // ← AJOUTER À PARTIR D'ICI
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // Seuils plus stricts pour le code critique
    './js/core/**/*.js': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    // Seuils normaux pour les composants UI
    './js/components/**/*.js': {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  // ← FIN DE L'AJOUT

  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  verbose: true,
  testTimeout: 10000,
};
```

**⚠️ AJUSTEMENT DES SEUILS** :

Si votre couverture actuelle est inférieure à 80%, utilisez des seuils plus bas initialement :

```javascript
coverageThreshold: {
  global: {
    branches: 70,  // Ajuster selon votre couverture actuelle
    functions: 70,
    lines: 70,
    statements: 70,
  },
}
```

Puis augmentez progressivement les seuils au fur et à mesure que vous ajoutez des tests.

**Étape 3 : Tester**

```bash
# Doit passer si couverture >= seuils
npm run test:coverage

# Si échec, vous verrez :
# Jest: "global" coverage threshold for statements (XX%) not met: 80%
```

**Étape 4 : Augmenter la couverture si nécessaire**

Si les tests échouent à cause des seuils :

```bash
# Identifier les fichiers avec faible couverture
npm run test:coverage

# Ouvrir le rapport HTML pour analyse détaillée
open coverage/lcov-report/index.html  # macOS
xdg-open coverage/lcov-report/index.html  # Linux
start coverage/lcov-report/index.html  # Windows
```

Ensuite, écrire des tests pour les fichiers avec faible couverture.

#### Vérification

```bash
# Doit réussir si couverture >= seuils
npm run test:coverage

# Doit échouer si on commente des tests et que la couverture baisse
# (test de validation du seuil)
```

#### Critères de succès

- ✅ `coverageThreshold` ajouté dans `jest.config.cjs`
- ✅ Seuils globaux définis (80% ou ajustés selon couverture actuelle)
- ✅ Seuils spécifiques pour code critique (`js/core/`)
- ✅ `npm run test:coverage` réussit
- ✅ Seuils documentés pour futures références

#### Ressources

- [Jest Coverage Thresholds](https://jestjs.io/docs/configuration#coveragethreshold-object)
- [Code With Hugo - Coverage Thresholds](https://codewithhugo.com/guides/jest-handbook/coverage-thresholds/)

---

### 2.3 Corriger les imports dépréciés de `utils.js`

**Statut** : 🔴 TODO
**Priorité** : HAUTE
**Temps estimé** : 45 minutes
**Assigné à** : _Non assigné_
**Dépendances** : Aucune

#### Contexte

11 fichiers importent encore depuis `./utils.js` qui est déprécié selon les conventions du projet. Les imports doivent pointer vers `utils-es6.js` (agrégateur) ou `core/utils.js` (source canonique).

#### Fichiers concernés (11 fichiers)

1. `js/modes/AdventureMode.js`
2. `js/modes/QuizMode.js`
3. `js/modes/ChallengeMode.js`
4. `js/components/dashboard.js`
5. `js/userManager.js`
6. `js/multimiam.js`
7. `js/multimiam-questions.js`
8. `js/game.js`
9. `js/utils-es6.js`
10. `js/notifications.js`
11. `js/arcade-multimiam.js`

#### Étapes détaillées

**Étape 1 : Identifier tous les imports concernés**

```bash
# Lister tous les fichiers avec imports utils.js
grep -rn "import.*from.*utils\.js" js/

# Exemple de sortie :
# js/modes/AdventureMode.js:5:import { utils } from './utils.js';
```

**Étape 2 : Décider de la stratégie d'import**

Deux options selon le fichier :

**Option A : Utiliser `utils-es6.js` (agrégateur recommandé)**

- Pour la plupart des fichiers applicatifs
- Fournit un point d'entrée unique

**Option B : Utiliser `core/utils.js` (source canonique)**

- Pour les modules core
- Import direct sans intermédiaire

**Étape 3 : Corriger chaque fichier**

Pour **chaque fichier** de la liste, appliquer ce changement :

**Exemple avec `js/modes/AdventureMode.js`** :

```javascript
// ❌ AVANT
import { utils } from './utils.js';

// ✅ APRÈS (Option A - recommandée)
import { utils } from './utils-es6.js';

// OU

// ✅ APRÈS (Option B - si c'est un module core)
import { Utils } from './core/utils.js';
```

**Détail par fichier** :

| Fichier                      | Chemin relatif utils.js | Nouveau chemin    |
| ---------------------------- | ----------------------- | ----------------- |
| `js/modes/AdventureMode.js`  | `./utils.js`            | `./utils-es6.js`  |
| `js/modes/QuizMode.js`       | `./utils.js`            | `./utils-es6.js`  |
| `js/modes/ChallengeMode.js`  | `./utils.js`            | `./utils-es6.js`  |
| `js/components/dashboard.js` | `./utils.js`            | `./utils-es6.js`  |
| `js/userManager.js`          | `./utils.js`            | `./utils-es6.js`  |
| `js/multimiam.js`            | `./utils.js`            | `./utils-es6.js`  |
| `js/multimiam-questions.js`  | `./utils.js`            | `./utils-es6.js`  |
| `js/game.js`                 | `./utils.js`            | `./utils-es6.js`  |
| `js/utils-es6.js`            | `./utils.js`            | `./core/utils.js` |
| `js/notifications.js`        | `./utils.js`            | `./utils-es6.js`  |
| `js/arcade-multimiam.js`     | `./utils.js`            | `./utils-es6.js`  |

**Étape 4 : Vérifier chaque changement**

Après chaque modification :

```bash
# Vérifier la syntaxe
npm run lint

# Tester que l'application fonctionne
npm run serve
# Ouvrir http://localhost:3000 et tester la fonctionnalité du fichier modifié
```

**Étape 5 : Renforcer la règle ESLint**

Mettre à jour `eslint.config.js` pour bloquer `./utils.js` ET `../utils.js` :

```javascript
// eslint.config.js
'no-restricted-imports': [
  'error',
  {
    patterns: [
      // ... patterns existants
      {
        group: ['./utils.js', '../utils.js', '*/utils.js'], // ← MODIFIER CETTE LIGNE
        message:
          'Importer depuis utils-es6.js (agrégateur) ou core/utils.js (source canonique). utils.js est déprécié.',
      },
    ],
  },
],
```

#### Vérification

```bash
# Vérifier qu'aucun import utils.js ne reste
grep -rn "import.*from.*['\"].*utils\.js['\"]" js/
# Doit retourner : aucun résultat

# Lint doit passer
npm run lint

# Tests doivent passer
npm test

# Application doit fonctionner
npm run serve
# Tester chaque mode de jeu et fonctionnalité
```

#### Critères de succès

- ✅ Aucun fichier n'importe depuis `utils.js`
- ✅ Tous les imports pointent vers `utils-es6.js` ou `core/utils.js`
- ✅ Règle ESLint mise à jour pour bloquer les futurs imports
- ✅ `npm run lint` passe sans erreur
- ✅ `npm test` passe sans erreur
- ✅ Application fonctionne correctement (tous les modes testés)

#### Notes

- Faire un commit après chaque fichier modifié pour faciliter le rollback si nécessaire
- Tester l'application après chaque modification majeure
- Documenter tout comportement inattendu

---

### 2.4 Mettre à jour les scripts de test avec le flag ESM

**Statut** : 🔴 TODO
**Priorité** : BASSE
**Temps estimé** : 10 minutes
**Assigné à** : _Non assigné_
**Dépendances** : Aucune

#### Contexte

Le script `test:esm` utilise correctement le flag `--experimental-vm-modules` pour le support ESM de Jest, mais les autres scripts de test ne l'utilisent pas. Bien que Jest infère le mode ESM depuis `package.json` (`"type": "module"`), l'utilisation explicite du flag est recommandée en 2025 pour éviter les problèmes d'imports.

#### Avantages

- ✅ Support ESM explicite et stable
- ✅ Cohérence entre tous les scripts de test
- ✅ Évite les problèmes de mocking ESM
- ✅ Suit les recommandations Jest 2025

#### Étapes détaillées

**Étape 1 : Identifier les scripts concernés**

Ouvrir `package.json` et repérer les scripts de test (lignes 9-16) :

```json
"test": "jest --maxWorkers=50%",
"test:core": "jest --maxWorkers=50% tests/__tests__/core/",
"test:storage": "jest --maxWorkers=50% tests/__tests__/storage.test.js",
"test:watch": "jest --watch --maxWorkers=50%",
"test:coverage": "jest --coverage --maxWorkers=50%",
"test:integration": "jest --maxWorkers=50% tests/__tests__/integration",
"test:verbose": "jest --verbose --maxWorkers=50%",
```

**Étape 2 : Modifier package.json**

Remplacer les scripts ci-dessus par :

```json
"scripts": {
  "test": "NODE_OPTIONS='--experimental-vm-modules' jest --maxWorkers=50%",
  "test:core": "NODE_OPTIONS='--experimental-vm-modules' jest --maxWorkers=50% tests/__tests__/core/",
  "test:core:inband": "NODE_OPTIONS='--experimental-vm-modules' jest --runInBand tests/__tests__/core/",
  "test:storage": "NODE_OPTIONS='--experimental-vm-modules' jest --maxWorkers=50% tests/__tests__/storage.test.js",
  "test:watch": "NODE_OPTIONS='--experimental-vm-modules' jest --watch --maxWorkers=50%",
  "test:coverage": "NODE_OPTIONS='--experimental-vm-modules' jest --coverage --maxWorkers=50%",
  "test:integration": "NODE_OPTIONS='--experimental-vm-modules' jest --maxWorkers=50% tests/__tests__/integration",
  "test:verbose": "NODE_OPTIONS='--experimental-vm-modules' jest --verbose --maxWorkers=50%",
  "test:esm": "NODE_OPTIONS='--experimental-vm-modules' jest --maxWorkers=50% tests-esm --testMatch \"**/*.test.mjs\"",
  // ... autres scripts
}
```

**⚠️ Note Windows** : Sur Windows, utiliser `cross-env` pour la compatibilité :

```bash
npm install -D cross-env
```

Puis modifier les scripts :

```json
"test": "cross-env NODE_OPTIONS='--experimental-vm-modules' jest --maxWorkers=50%",
```

**Étape 3 : Tester**

```bash
# Tester chaque script modifié
npm test
npm run test:core
npm run test:coverage
npm run test:watch  # Ctrl+C pour quitter
```

#### Vérification

```bash
# Tous les tests doivent passer
npm test

# Coverage doit fonctionner
npm run test:coverage

# Verify script doit passer
npm run verify
```

#### Critères de succès

- ✅ Tous les scripts de test incluent `NODE_OPTIONS='--experimental-vm-modules'`
- ✅ `npm test` fonctionne sans warning ESM
- ✅ `npm run test:coverage` fonctionne
- ✅ `npm run verify` passe
- ✅ (Windows) `cross-env` installé si nécessaire

#### Ressources

- [Jest ESM Support](https://jestjs.io/docs/ecmascript-modules)

---

## 🎯 Priorité 3 : Améliorations Moyen Terme (< 1 jour)

### 3.1 Nettoyer les JSDoc auto-générés incorrects

**Statut** : 🔴 TODO
**Priorité** : MOYENNE
**Temps estimé** : 30 minutes
**Assigné à** : _Non assigné_
**Dépendances** : Aucune

#### Contexte

Le fichier `js/core/utils.js` contient des JSDoc auto-générés qui ne documentent pas réellement le code. Ces commentaires (lignes 79-295) sont génériques et inutiles, encombrant le code sans apporter de valeur.

#### Exemples de JSDoc incorrects

**Exemple 1 - Ligne 79-87** :

```javascript
// ❌ JSDoc incorrect actuel
/**
 * Fonction for
 * @param {*} let - Description du paramètre
 * @returns {*} Description du retour
 */
for (let i = 1; i <= 3; i++) {
  html += i <= count ? filledStar : emptyStar;
}
```

Ce JSDoc ne devrait pas exister (c'est une boucle for dans une fonction, pas une fonction).

**Exemple 2 - Ligne 126-137** :

```javascript
// ❌ JSDoc incorrect actuel
/**
 * Fonction if
 * @param {*} num - Description du paramètre
 * @returns {*} Description du retour
 */
if (num < 100) {
  const ten = Math.floor(num / 10);
  const unit = num % 10;
  return tens[ten] + (unit ? '-' + units[unit] : '');
}
```

Ce JSDoc ne devrait pas exister (c'est un bloc if, pas une fonction).

#### Étapes détaillées

**Étape 1 : Ouvrir le fichier**

```bash
# Ouvrir dans votre éditeur
code js/core/utils.js
# ou
vim js/core/utils.js
```

**Étape 2 : Identifier tous les JSDoc incorrects**

Rechercher les patterns suivants qui indiquent des JSDoc auto-générés incorrects :

- `/** Fonction for`
- `/** Fonction if`
- `/** Fonction while`
- `/** Fonction switch`
- `@param {*}` avec "Description du paramètre" générique
- `@returns {*}` avec "Description du retour" générique

**Étape 3 : Supprimer les JSDoc incorrects**

**Dans la fonction `getStarsHTML` (lignes 79-87)** :

```javascript
// ❌ AVANT
/**
 * Fonction for
 * @param {*} let - Description du paramètre
 * @returns {*} Description du retour
 */
for (let i = 1; i <= 3; i++) {
  html += i <= count ? filledStar : emptyStar;
}

// ✅ APRÈS (supprimer le JSDoc)
for (let i = 1; i <= 3; i++) {
  html += i <= count ? filledStar : emptyStar;
}
```

**Dans la fonction `numberToWords` (lignes 126-137)** :

```javascript
// ❌ AVANT
/**
 * Fonction if
 * @param {*} num - Description du paramètre
 * @returns {*} Description du retour
 */
if (num < 100) {
  const ten = Math.floor(num / 10);
  const unit = num % 10;
  return tens[ten] + (unit ? '-' + units[unit] : '');
}

// ✅ APRÈS (supprimer le JSDoc)
if (num < 100) {
  const ten = Math.floor(num / 10);
  const unit = num % 10;
  return tens[ten] + (unit ? '-' + units[unit] : '');
}
```

**Répéter pour tous les JSDoc incorrects dans le fichier.**

**Liste complète des lignes à nettoyer** :

- Lignes ~79-87 : JSDoc "Fonction for" dans `getStarsHTML`
- Lignes ~126-137 : JSDoc "Fonction if" dans `numberToWords`
- Lignes ~154-168 : JSDoc "Fonction while" dans `generateMCQOptions`
- Lignes ~192-214 : JSDoc "Mettre à jour" et "Fonction if" dans `updateFocus`
- Lignes ~217-284 : JSDoc "Gérer un événement", "Fonction switch", "Fonction if" dans `handleKeydown`
- Lignes ~290-297 : JSDoc "Fonction if" dans `addArrowKeyNavigation`

**Étape 4 : (Optionnel) Ajouter de vrais JSDoc utiles**

Si certaines fonctions internes mériteraient documentation, remplacer par des JSDoc corrects :

```javascript
// ✅ BON JSDoc (si nécessaire)
/**
 * Met à jour le focus visuel et le focus clavier sur l'élément actuellement sélectionné.
 * Retire le focus des autres éléments et applique la classe 'focused'.
 */
function updateFocus() {
  // ... code
}
```

**Étape 5 : Formater le fichier**

```bash
npm run format
```

#### Vérification

```bash
# Rechercher les JSDoc génériques restants
grep -n "Description du paramètre\|Description du retour" js/core/utils.js
# Doit retourner : aucun résultat

# Lint doit passer
npm run lint

# Tests doivent passer (aucune logique modifiée)
npm test

# Formater le code
npm run format:check
```

#### Critères de succès

- ✅ Aucun JSDoc générique "Fonction for/if/while" ne reste
- ✅ Aucun `@param {*}` avec "Description du paramètre"
- ✅ Aucun `@returns {*}` avec "Description du retour"
- ✅ Seuls les JSDoc utiles sont conservés (fonctions exportées)
- ✅ `npm run lint` passe
- ✅ `npm test` passe
- ✅ Code correctement formaté

#### Notes

- Ne pas supprimer les JSDoc des fonctions exportées (`getStarsHTML`, `numberToWords`, etc.)
- Seulement nettoyer les JSDoc auto-générés inutiles
- Committer avec un message clair : "Clean up auto-generated JSDoc in core/utils.js"

---

### 3.2 Ajouter logging dans le Service Worker

**Statut** : 🔴 TODO
**Priorité** : MOYENNE
**Temps estimé** : 20 minutes
**Assigné à** : _Non assigné_
**Dépendances** : Aucune

#### Contexte

Le service worker (`sw.js`) manque de logging pour le debug et le monitoring. En 2025, les meilleures pratiques recommandent d'ajouter des logs de cycle de vie pour faciliter le debug et le suivi des mises à jour.

#### Avantages

- ✅ Debug facile via Chrome DevTools (Console)
- ✅ Traçabilité des mises à jour de version
- ✅ Identification rapide des problèmes de cache
- ✅ Monitoring du comportement en production

#### Étapes détaillées

**Étape 1 : Ajouter le logging de version**

Au début de `sw.js`, après la déclaration de `VERSION` :

```javascript
// sw.js
const VERSION = 'v5';
const OFFLINE_CACHE = `leapmultix-offline-${VERSION}`;
const RUNTIME_CACHE = `leapmultix-runtime-${VERSION}`;
const OFFLINE_URL = '/offline.html';

// ← AJOUTER CETTE LIGNE
console.log(`[SW ${VERSION}] Service Worker loading...`);

const APP_SHELL = [
  // ...
];
```

**Étape 2 : Logger l'événement install**

```javascript
self.addEventListener('install', event => {
  console.log(`[SW ${VERSION}] Installing...`); // ← AJOUTER

  event.waitUntil(
    (async () => {
      const cache = await caches.open(OFFLINE_CACHE);
      await cache.addAll([OFFLINE_URL, ...APP_SHELL]);

      console.log(`[SW ${VERSION}] Cached ${APP_SHELL.length + 1} assets`); // ← AJOUTER
    })()
  );

  self.skipWaiting();
  console.log(`[SW ${VERSION}] Skip waiting - will activate immediately`); // ← AJOUTER
});
```

**Étape 3 : Logger l'événement activate**

```javascript
self.addEventListener('activate', event => {
  console.log(`[SW ${VERSION}] Activating...`); // ← AJOUTER

  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      const oldCaches = keys.filter(
        k =>
          (k.startsWith('leapmultix-offline-') || k.startsWith('leapmultix-runtime-')) &&
          !k.endsWith(VERSION)
      );

      console.log(`[SW ${VERSION}] Found ${oldCaches.length} old cache(s) to delete:`, oldCaches); // ← AJOUTER

      await Promise.all(oldCaches.map(k => caches.delete(k)));

      console.log(`[SW ${VERSION}] Cleaned up old caches`); // ← AJOUTER

      await self.clients.claim();

      console.log(`[SW ${VERSION}] Activated and claimed all clients`); // ← AJOUTER
    })()
  );
});
```

**Étape 4 : (Optionnel) Logger les stratégies de fetch**

Si vous voulez un logging plus détaillé (peut être verbeux en production) :

```javascript
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    console.log(`[SW ${VERSION}] Navigation request:`, request.url); // ← OPTIONNEL
    event
      .respondWith
      // ... code existant
      ();
    return;
  }

  // ... reste du code
});
```

**⚠️ Recommandation** : Ne pas logger chaque fetch en production (trop verbeux). Utiliser un flag de debug si besoin :

```javascript
const DEBUG = false; // Passer à true pour debug

if (DEBUG) {
  console.log(`[SW ${VERSION}] Fetch:`, request.url);
}
```

**Étape 5 : Incrémenter la version**

```javascript
const VERSION = 'v6'; // ← Changer de v5 à v6 pour forcer la mise à jour
```

#### Vérification

**Étape 1 : Tester localement**

```bash
# Démarrer le serveur
npm run serve

# Ouvrir dans Chrome
# http://localhost:3000
```

**Étape 2 : Inspecter la console du Service Worker**

1. Ouvrir Chrome DevTools (F12)
2. Aller dans **Application** → **Service Workers**
3. Cliquer sur **Console** dans la ligne du service worker
4. Recharger la page (Ctrl+R)

**Logs attendus** :

```
[SW v6] Service Worker loading...
[SW v6] Installing...
[SW v6] Cached 7 assets
[SW v6] Skip waiting - will activate immediately
[SW v6] Activating...
[SW v6] Found 2 old cache(s) to delete: ["leapmultix-offline-v5", "leapmultix-runtime-v5"]
[SW v6] Cleaned up old caches
[SW v6] Activated and claimed all clients
```

**Étape 3 : Tester une mise à jour**

1. Modifier `VERSION` de `v6` à `v7`
2. Rafraîchir la page
3. Vérifier les logs de nettoyage des anciens caches

#### Critères de succès

- ✅ Logs de version au chargement
- ✅ Logs lors de l'installation avec nombre d'assets cachés
- ✅ Logs lors de l'activation avec nombre de caches nettoyés
- ✅ Logs visibles dans Chrome DevTools → Application → Service Workers → Console
- ✅ VERSION incrémentée à v6 (ou supérieur)
- ✅ Service worker fonctionne correctement (test offline)

#### Test de régression

```bash
# Tester le mode offline
# Dans Chrome DevTools:
# 1. Application → Service Workers → Cocher "Offline"
# 2. Recharger la page
# 3. Vérifier que offline.html s'affiche

# Tester le cache des images
# 1. Naviguer dans l'app et charger des images
# 2. Vérifier dans Application → Cache Storage que les images sont bien cachées
```

#### Ressources

- [Service Worker Lifecycle](https://web.dev/articles/service-worker-lifecycle)
- [Debugging Service Workers](https://developer.chrome.com/docs/devtools/progressive-web-apps)

---

## 🎯 Priorité 4 : Améliorations Long Terme (Optionnel)

### 4.1 Migrer vers DOMPurify pour la sanitization HTML

**Statut** : ⏸️ ON*HOLD
**Priorité** : BASSE (Optionnel)
**Temps estimé** : 2-3 heures
**Assigné à** : \_Non assigné*
**Dépendances** : Décision sur si on garde le sanitizer custom

#### Contexte

Le projet utilise actuellement un sanitizer HTML custom dans `security-utils.js`. Il fonctionne bien, mais DOMPurify est le standard de l'industrie en 2025, maintenu activement par des experts sécurité et utilisé par Google, Microsoft, etc.

#### Avantages de DOMPurify

- ✅ Maintenu par des experts sécurité (Cure53)
- ✅ Gère les cas complexes (mutation XSS, edge cases)
- ✅ Utilisé par Google, Microsoft, Mozilla
- ✅ Plus de 15K stars GitHub
- ✅ Tests exhaustifs et audits réguliers
- ✅ Support SVG et MathML sécurisé

#### Inconvénients

- ❌ Dépendance externe supplémentaire (+45KB minifié)
- ❌ Nécessite refactoring du code existant
- ❌ Le sanitizer custom actuel fonctionne déjà bien

#### Décision requise

**⚠️ IMPORTANT** : Avant de démarrer cette tâche, décider si :

1. **ON GARDE** le sanitizer custom (plus léger, contrôlé)
   → Passer cette tâche à ❌ CANCELLED

2. **ON MIGRE** vers DOMPurify (standard industriel)
   → Passer cette tâche à 🔴 TODO et suivre les étapes

#### Étapes détaillées (si migration décidée)

**Étape 1 : Installer DOMPurify**

```bash
npm install dompurify
```

**Étape 2 : Créer un wrapper pour DOMPurify**

Créer un nouveau fichier `js/dom-purify-wrapper.js` :

```javascript
// js/dom-purify-wrapper.js
import DOMPurify from 'dompurify';

/**
 * Configuration DOMPurify pour Leapmultix
 */
const PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    'div',
    'span',
    'p',
    'br',
    'strong',
    'em',
    'b',
    'i',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'img',
    'a',
    'button',
  ],
  ALLOWED_ATTR: [
    'class',
    'id',
    'style',
    'src',
    'alt',
    'width',
    'height',
    'href',
    'title',
    'target',
  ],
  ALLOW_DATA_ATTR: false, // Pas d'attributs data-* par défaut
  SAFE_FOR_TEMPLATES: true,
};

/**
 * Sanitize HTML avec DOMPurify
 * @param {string} html - HTML à sanitizer
 * @param {Object} config - Config optionnelle
 * @returns {string} HTML sanitizé
 */
export function sanitizeHTML(html, config = {}) {
  return DOMPurify.sanitize(html, {
    ...PURIFY_CONFIG,
    ...config,
  });
}

/**
 * Crée un DocumentFragment depuis HTML sanitizé
 * @param {string} html - HTML à convertir
 * @returns {DocumentFragment}
 */
export function sanitizeToFragment(html) {
  const clean = sanitizeHTML(html);
  const template = document.createElement('template');
  template.innerHTML = clean;
  return template.content;
}

/**
 * Ajoute du HTML sanitizé à un parent
 * @param {HTMLElement} parent - Élément parent
 * @param {string} html - HTML à ajouter
 */
export function appendSanitizedHTML(parent, html) {
  if (!parent) return;
  const fragment = sanitizeToFragment(html);
  parent.appendChild(fragment);
}

export default {
  sanitizeHTML,
  sanitizeToFragment,
  appendSanitizedHTML,
};
```

**Étape 3 : Remplacer security-utils.js**

**Option A : Remplacer complètement security-utils.js**

Modifier `js/security-utils.js` pour utiliser le wrapper DOMPurify :

```javascript
// js/security-utils.js
import { sanitizeHTML, sanitizeToFragment, appendSanitizedHTML } from './dom-purify-wrapper.js';

// Ré-exporter les fonctions DOMPurify
export { sanitizeHTML, sanitizeToFragment, appendSanitizedHTML };

// Garder les autres fonctions utilitaires
export {
  escapeHtml,
  createSafeElement,
  setSafeMessage /* ... */,
} from './security-utils-original.js';
```

**Option B : Garder security-utils.js ET ajouter DOMPurify**

Utiliser DOMPurify uniquement pour `appendSanitizedHTML` :

```javascript
// Modifier dans js/security-utils.js
import { sanitizeHTML } from './dom-purify-wrapper.js';

export function appendSanitizedHTML(parent, htmlString) {
  if (!parent) return;
  const clean = sanitizeHTML(htmlString); // ← Utiliser DOMPurify
  parent.innerHTML = clean; // Safe car sanitizé par DOMPurify
}
```

**Étape 4 : Tester**

```bash
# Lint
npm run lint

# Tests
npm test

# Tester l'application manuellement
npm run serve
```

**Étape 5 : Tests de sécurité**

Créer un fichier de test `tests/__tests__/dom-purify.test.js` :

```javascript
import { sanitizeHTML, appendSanitizedHTML } from '../../js/dom-purify-wrapper.js';

describe('DOMPurify Sanitization', () => {
  test('removes script tags', () => {
    const dirty = '<div>Safe</div><script>alert(1)</script>';
    const clean = sanitizeHTML(dirty);
    expect(clean).toBe('<div>Safe</div>');
  });

  test('removes javascript: protocol', () => {
    const dirty = '<a href="javascript:alert(1)">Click</a>';
    const clean = sanitizeHTML(dirty);
    expect(clean).not.toContain('javascript:');
  });

  test('removes onerror handlers', () => {
    const dirty = '<img src=x onerror="alert(1)">';
    const clean = sanitizeHTML(dirty);
    expect(clean).not.toContain('onerror');
  });

  test('allows safe HTML', () => {
    const safe = '<div class="test"><strong>Hello</strong></div>';
    const clean = sanitizeHTML(safe);
    expect(clean).toBe(safe);
  });
});
```

Exécuter :

```bash
npm test tests/__tests__/dom-purify.test.js
```

#### Vérification

```bash
# Tests doivent passer
npm test

# Vérifier la taille du bundle
npm run build
ls -lh dist/bundle.js

# Tester XSS manuellement
# Dans la console browser :
# sanitizeHTML('<img src=x onerror=alert(1)>')
# Doit retourner: '<img src="x">' (sans onerror)
```

#### Critères de succès

- ✅ DOMPurify installé dans `package.json`
- ✅ Wrapper créé dans `js/dom-purify-wrapper.js`
- ✅ `security-utils.js` migré ou modifié
- ✅ Tests de sécurité passent
- ✅ Application fonctionne correctement
- ✅ Aucune régression XSS

#### Décision finale

- [ ] Conserver sanitizer custom (tâche CANCELLED)
- [ ] Migrer vers DOMPurify (tâche TODO)
- [ ] Approche hybride (garder les deux)

**À décider avant de démarrer cette tâche.**

#### Ressources

- [DOMPurify GitHub](https://github.com/cure53/DOMPurify)
- [DOMPurify Demo](https://cure53.de/purify)

---

### 4.2 Implémenter un Content Security Policy (CSP) strict

**Statut** : 🔴 TODO
**Priorité** : BASSE (Optionnel)
**Temps estimé** : 3-4 heures
**Assigné à** : _Non assigné_
**Dépendances** : Aucune

#### Contexte

Un Content Security Policy (CSP) strict est une défense supplémentaire contre les attaques XSS. Il permet de définir quelles sources de contenu sont autorisées à s'exécuter dans l'application.

#### Avantages

- ✅ Protection XSS multi-couches (defense in depth)
- ✅ Blocage des scripts inline non autorisés
- ✅ Prévention des clickjacking (via frame-ancestors)
- ✅ Force HTTPS (via upgrade-insecure-requests)
- ✅ Reporting des violations (monitoring)

#### Inconvénients

- ❌ Complexe à configurer correctement
- ❌ Peut casser des fonctionnalités existantes
- ❌ Nécessite de refactorer les scripts inline
- ❌ Difficile à maintenir

#### Étapes détaillées

**Étape 1 : Analyser le code actuel**

Identifier tous les usages inline qui seront bloqués par CSP :

```bash
# Rechercher scripts inline
grep -rn "onclick=" index.html
grep -rn "onload=" index.html
grep -rn "<script>" index.html | grep -v "src="

# Rechercher styles inline
grep -rn "style=" index.html
```

**Étape 2 : Démarrer en mode Report-Only**

Ajouter dans `index.html` (avant la fermeture de `</head>`) :

```html
<!-- Content Security Policy - Report Only Mode -->
<meta
  http-equiv="Content-Security-Policy-Report-Only"
  content="
  default-src 'self';
  script-src 'self' https://plausible.io;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  connect-src 'self' https://plausible.io;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
  upgrade-insecure-requests;
  report-uri /csp-violations;
"
/>
```

**Étape 3 : Créer un endpoint de reporting**

Créer `csp-violations-logger.html` pour logger les violations :

```html
<!-- csp-violations-logger.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>CSP Violation Logger</title>
  </head>
  <body>
    <h1>CSP Violations</h1>
    <pre id="log"></pre>
    <script type="module">
      // Simple logger pour développement
      // En production, envoyer à un serveur de monitoring
      if (window.location.pathname === '/csp-violations') {
        console.log('CSP Violation logged');
      }
    </script>
  </body>
</html>
```

**Étape 4 : Tester et collecter les violations**

```bash
npm run serve

# Ouvrir Chrome DevTools → Console
# Naviguer dans toutes les pages de l'app
# Noter toutes les violations CSP affichées
```

**Exemple de violations attendues** :

```
[Report Only] Refused to execute inline script because it violates the following Content Security Policy directive: "script-src 'self'"...
```

**Étape 5 : Corriger les violations**

**Scripts inline → Modules externes**

```html
<!-- ❌ AVANT -->
<button onclick="doSomething()">Click</button>

<!-- ✅ APRÈS -->
<button id="my-button">Click</button>
<script type="module">
  document.getElementById('my-button').addEventListener('click', () => {
    doSomething();
  });
</script>
```

Ou mieux, utiliser `bootstrap.js` existant pour attacher les event listeners.

**Styles inline → Classes CSS**

```html
<!-- ❌ AVANT -->
<div style="color: red;">Text</div>

<!-- ✅ APRÈS -->
<div class="text-red">Text</div>
```

**Étape 6 : Passer en mode enforcement**

Une fois toutes les violations corrigées, remplacer `Content-Security-Policy-Report-Only` par `Content-Security-Policy` :

```html
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self';
  script-src 'self' https://plausible.io;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  connect-src 'self' https://plausible.io;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
  upgrade-insecure-requests;
"
/>
```

**Étape 7 : (Optionnel) Utiliser des nonces pour les scripts**

Pour une sécurité maximale, utiliser des nonces (nécessite génération côté serveur) :

```html
<meta
  http-equiv="Content-Security-Policy"
  content="
  script-src 'nonce-{RANDOM}' 'strict-dynamic' https://plausible.io;
  object-src 'none';
  base-uri 'none';
"
/>

<script nonce="{RANDOM}" type="module" src="/js/main.js"></script>
```

**Note** : Pour une app statique, cette approche nécessite un serveur dynamique ou un build step pour générer les nonces.

#### Vérification

**Étape 1 : Tester toutes les fonctionnalités**

```bash
npm run serve

# Tester :
# - Tous les modes de jeu
# - Personnalisation (avatars, thèmes)
# - Gestion utilisateurs
# - Audio
# - Offline mode
```

**Étape 2 : Vérifier la console**

Aucune erreur CSP ne doit apparaître.

**Étape 3 : Test de sécurité XSS**

Essayer d'injecter du JavaScript dans l'app (ex: champ username) :

```javascript
// Dans un champ de texte, essayer :
<img src=x onerror=alert(1)>
<script>alert(1)</script>

// CSP doit bloquer l'exécution même si sanitization échoue
```

**Étape 4 : Test de clickjacking**

Essayer d'embedder l'app dans une iframe :

```html
<!-- Depuis une autre page -->
<iframe src="http://localhost:3000"></iframe>

<!-- Doit être bloqué par frame-ancestors 'self' -->
```

#### Critères de succès

- ✅ CSP configuré en mode Report-Only
- ✅ Toutes les violations identifiées et corrigées
- ✅ CSP passé en mode enforcement
- ✅ Application fonctionne sans erreur CSP
- ✅ Tests XSS bloqués par CSP
- ✅ Clickjacking bloqué
- ✅ (Optionnel) Nonces implémentés

#### Notes importantes

- ⚠️ Cette tâche peut prendre beaucoup de temps selon le nombre de scripts inline
- ⚠️ Tester exhaustivement avant de déployer en production
- ⚠️ Considérer l'utilisation de `'unsafe-inline'` temporairement si refactoring trop complexe
- ⚠️ Documenter toutes les décisions de sécurité

#### Ressources

- [OWASP CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [web.dev Strict CSP](https://web.dev/articles/strict-csp)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)

---

## 📈 Tableau de suivi global

| ID  | Tâche                          | Priorité | Statut     | Assigné | Temps estimé | Temps réel |
| --- | ------------------------------ | -------- | ---------- | ------- | ------------ | ---------- |
| 1.1 | Formater fichiers Prettier     | CRITIQUE | 🔴 TODO    | -       | 2 min        | -          |
| 1.2 | Intégrer Prettier dans ESLint  | HAUTE    | 🔴 TODO    | -       | 10 min       | -          |
| 2.1 | Utiliser package globals       | MOYENNE  | 🔴 TODO    | -       | 15 min       | -          |
| 2.2 | Ajouter coverage thresholds    | MOYENNE  | 🔴 TODO    | -       | 10 min       | -          |
| 2.3 | Corriger imports utils.js      | HAUTE    | 🔴 TODO    | -       | 45 min       | -          |
| 2.4 | Mettre à jour scripts test ESM | BASSE    | 🔴 TODO    | -       | 10 min       | -          |
| 3.1 | Nettoyer JSDoc incorrects      | MOYENNE  | 🔴 TODO    | -       | 30 min       | -          |
| 3.2 | Ajouter logging Service Worker | MOYENNE  | 🔴 TODO    | -       | 20 min       | -          |
| 4.1 | Migrer vers DOMPurify          | BASSE    | ⏸️ ON_HOLD | -       | 2-3h         | -          |
| 4.2 | Implémenter CSP strict         | BASSE    | 🔴 TODO    | -       | 3-4h         | -          |

**Temps total estimé (sans tâches optionnelles)** : ~2h30
**Temps total estimé (avec tâches optionnelles)** : ~8h

---

## 🔄 Workflow de mise à jour de ce document

### Quand mettre à jour ce document ?

- ✅ Quand une tâche est assignée
- ✅ Quand une tâche change de statut
- ✅ Quand une tâche est complétée
- ✅ Quand une nouvelle amélioration est identifiée
- ✅ Quand une tâche est bloquée ou annulée

### Comment mettre à jour ?

1. **Changer le statut** : Modifier l'emoji de statut (🔴 → 🟡 → 🟢)
2. **Noter la date** : Ajouter la date dans la section de la tâche
3. **Assignation** : Indiquer qui travaille sur la tâche
4. **Temps réel** : Noter le temps réellement passé une fois terminé
5. **Notes** : Ajouter toute note pertinente dans la section de la tâche

### Exemple de mise à jour

```markdown
### 1.1 Formater les fichiers non conformes à Prettier

**Statut** : 🟢 DONE
**Date de complétion** : 2025-10-05
**Assigné à** : Jean Dupont
**Temps réel** : 3 minutes

#### Notes de complétion

- Exécuté `npm run format`
- 2 fichiers formatés : `.claude/agents/web-research-specialist.md`, `.claude/settings.local.json`
- Aucun autre fichier modifié
- Commit : abc1234
```

---

## 📚 Ressources générales

### Documentation officielle

- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files)
- [Jest Configuration](https://jestjs.io/docs/configuration)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [OWASP Security](https://owasp.org/www-project-web-security-testing-guide/)

### Guides de référence

- [JavaScript Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [ES Modules Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [PWA Best Practices](https://web.dev/learn/pwa)

---

## ❓ FAQ

### Q1 : Dois-je faire toutes les tâches dans l'ordre ?

**R** : Non. Les tâches de Priorité 1 et 2 peuvent être faites dans n'importe quel ordre (sauf dépendances notées). Les tâches optionnelles (Priorité 4) peuvent être ignorées.

### Q2 : Que faire si une tâche échoue ?

**R** :

1. Noter le problème dans la section de la tâche
2. Passer le statut à ⏸️ ON_HOLD
3. Chercher de l'aide ou documenter le blocage
4. Passer à une autre tâche si possible

### Q3 : Puis-je modifier les seuils recommandés ?

**R** : Oui, ajustez selon votre contexte. Ce document donne des recommandations 2025, mais votre projet peut avoir des contraintes spécifiques.

### Q4 : Où commiter les changements ?

**R** : Créer une branche par tâche ou groupe de tâches :

```bash
git checkout -b feat/eslint-prettier-integration
# Faire les changements pour tâche 1.2
git add .
git commit -m "Integrate Prettier into ESLint config"
git push origin feat/eslint-prettier-integration
```

### Q5 : Comment tester que je n'ai rien cassé ?

**R** : Après chaque changement majeur, exécuter :

```bash
npm run verify  # Lint + Tests + Coverage
npm run serve   # Tester manuellement l'application
```

---

## 📝 Notes et décisions

### Décisions prises

- _Aucune pour le moment_

### Décisions en attente

- [ ] **Tâche 4.1** : Migrer vers DOMPurify ou garder sanitizer custom ?

### Problèmes rencontrés

- _Aucun pour le moment_

---

**Dernière mise à jour** : 2025-10-03
**Prochaine revue prévue** : _À définir après complétion des tâches Priorité 1_
