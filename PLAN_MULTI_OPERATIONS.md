# Plan d'Implémentation Multi-Opérations

**Branch:** `feat/multi-operations-support`
**Objectif:** Étendre LeapMultix pour supporter ×, +, −, ÷ sans duplication de code
**Architecte/Dev:** Claude Code
**Date début:** 2025-11-25

---

## 🎯 Vision Globale

### Objectifs R1 (Release 1 - Livraison rapide)

- ✅ Support multiplication (×), addition (+), soustraction (−) dans Quiz et Défi
- ✅ Sélecteur d'opération avec persistance utilisateur
- ✅ Stats unifiées avec migration transparente
- ✅ Internationalisation complète (fr, en, es)
- ✅ Modes non supportés clairement signalés (Découverte, Aventure, Arcade)
- ✅ Tests unitaires et non-régression

### Phases futures

- **R2** (3-4 semaines) : Étendre Découverte/Aventure + migration stats complète
- **R3** (1-2 semaines) : Division (÷) avec contraintes résultats entiers
- **R4** (2-3 semaines) : Arcade multi-opérations

---

## 📐 Architecture Technique

### Principes de Conception

1. **Extensibilité** : Pattern OOP pour ajouter opérations sans toucher code existant
2. **Compatibilité** : Double-write temporaire pour migration stats douce
3. **Réutilisation** : Mutualisation maximale via classe abstraite Operation
4. **Sécurité** : Pas de régression multiplication existante

### Structure de Fichiers Créés

```
leapmultix/
├── js/
│   ├── core/
│   │   ├── operations/
│   │   │   ├── Operation.js              # Classe abstraite
│   │   │   ├── Multiplication.js         # Implémentation ×
│   │   │   ├── Addition.js               # Implémentation +
│   │   │   ├── Subtraction.js            # Implémentation −
│   │   │   ├── Division.js               # Implémentation ÷ (R3)
│   │   │   └── OperationRegistry.js      # Registry pattern
│   │   └── operation-stats.js            # Stats unifiées (double-write R1)
│   └── components/
│       └── operationSelector.js          # UI sélecteur opération
├── tests/
│   └── __tests__/
│       ├── operations.test.js            # Tests unitaires opérations
│       ├── operation-stats.test.js       # Tests stats + migration
│       └── questionGenerator-ops.test.js # Tests génération multi-op
└── PLAN_MULTI_OPERATIONS.md              # Ce fichier
```

---

## 🔧 Détail des Phases R1

### Phase 1.1 : Architecture Operations (OOP) ⏱️ J1-J2

#### Fichier: `js/core/operations/Operation.js`

**Classe abstraite définissant le contrat**

```javascript
/**
 * Classe abstraite représentant une opération arithmétique
 */
export class Operation {
  constructor() {
    this.symbol = ''; // Ex: '×', '+', '-', '÷'
    this.name = ''; // Ex: 'multiplication', 'addition'
    this.spokenForm = ''; // Ex: 'fois', 'plus', 'moins'
    this.unicodeSymbol = ''; // Ex: '\u00D7' pour ×
  }

  /**
   * Calcule le résultat de l'opération
   * @abstract
   */
  compute(a, b) {
    throw new Error('Operation.compute() must be implemented');
  }

  /**
   * Génère des opérandes selon la difficulté
   * @abstract
   * @returns {{ a: number, b: number }}
   */
  generateOperands(difficulty = 'medium') {
    throw new Error('Operation.generateOperands() must be implemented');
  }

  /**
   * Formate la question selon le type
   * @param {number} a - Premier opérande
   * @param {number} b - Second opérande
   * @param {string} type - Type de question ('classic', 'gap', 'mcq', etc.)
   * @param {number} result - Résultat (pour certains types)
   * @returns {string} Question formatée
   */
  formatQuestion(a, b, type = 'classic', result = null) {
    const r = result ?? this.compute(a, b);

    switch (type) {
      case 'classic':
        return `${a} ${this.symbol} ${b} = ?`;
      case 'gap':
        return `${a} ${this.symbol} ? = ${r}`;
      case 'mcq':
        return `${a} ${this.symbol} ${b} = ?`;
      case 'true_false':
        // Généré différemment
        return `${a} ${this.symbol} ${b} = ${result}`;
      default:
        return `${a} ${this.symbol} ${b} = ?`;
    }
  }

  /**
   * Valide que les opérandes sont valides pour cette opération
   * @param {number} a
   * @param {number} b
   * @returns {boolean}
   */
  isValid(a, b) {
    return typeof a === 'number' && typeof b === 'number' && !isNaN(a) && !isNaN(b);
  }

  /**
   * Types de questions supportés pour cette opération
   * @returns {string[]}
   */
  getSupportedTypes() {
    return ['classic', 'mcq'];
  }
}
```

#### Fichier: `js/core/operations/Multiplication.js`

```javascript
import { Operation } from './Operation.js';

export class Multiplication extends Operation {
  constructor() {
    super();
    this.symbol = '×';
    this.name = 'multiplication';
    this.spokenForm = 'fois';
    this.unicodeSymbol = '\u00D7';
  }

  compute(a, b) {
    return a * b;
  }

  generateOperands(difficulty = 'medium') {
    const ranges = {
      easy: { min: 1, max: 5 },
      medium: { min: 1, max: 10 },
      hard: { min: 1, max: 12 },
    };

    const range = ranges[difficulty] || ranges.medium;
    const a = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    const b = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

    return { a, b };
  }

  getSupportedTypes() {
    return ['classic', 'gap', 'mcq', 'true_false', 'problem'];
  }
}
```

#### Fichier: `js/core/operations/Addition.js`

```javascript
import { Operation } from './Operation.js';

export class Addition extends Operation {
  constructor() {
    super();
    this.symbol = '+';
    this.name = 'addition';
    this.spokenForm = 'plus';
    this.unicodeSymbol = '+';
  }

  compute(a, b) {
    return a + b;
  }

  generateOperands(difficulty = 'medium') {
    // Contraintes: résultat limité pour faciliter l'apprentissage
    const constraints = {
      easy: { minA: 1, maxA: 5, minB: 1, maxB: 5, maxResult: 10 },
      medium: { minA: 1, maxA: 10, minB: 1, maxB: 10, maxResult: 20 },
      hard: { minA: 1, maxA: 20, minB: 1, maxB: 20, maxResult: 40 },
    };

    const c = constraints[difficulty] || constraints.medium;
    let a, b;

    // Générer jusqu'à avoir un résultat dans les limites
    do {
      a = Math.floor(Math.random() * (c.maxA - c.minA + 1)) + c.minA;
      b = Math.floor(Math.random() * (c.maxB - c.minB + 1)) + c.minB;
    } while (a + b > c.maxResult);

    return { a, b };
  }

  getSupportedTypes() {
    // R1: classic et mcq uniquement
    // R2: ajouter gap, true_false, problem
    return ['classic', 'mcq'];
  }
}
```

#### Fichier: `js/core/operations/Subtraction.js`

```javascript
import { Operation } from './Operation.js';

export class Subtraction extends Operation {
  constructor() {
    super();
    this.symbol = '−'; // Unicode minus (U+2212), pas hyphen-minus
    this.name = 'subtraction';
    this.spokenForm = 'moins';
    this.unicodeSymbol = '\u2212';
  }

  compute(a, b) {
    return a - b;
  }

  generateOperands(difficulty = 'medium') {
    // Contrainte CRITIQUE: a >= b pour éviter résultats négatifs
    const ranges = {
      easy: { minuend: [1, 10], maxSubtrahend: 10 },
      medium: { minuend: [1, 20], maxSubtrahend: 20 },
      hard: { minuend: [1, 50], maxSubtrahend: 50 },
    };

    const range = ranges[difficulty] || ranges.medium;
    const [minMinuend, maxMinuend] = range.minuend;

    // Générer minuend (a)
    const a = Math.floor(Math.random() * (maxMinuend - minMinuend + 1)) + minMinuend;

    // Générer subtrahend (b) tel que b <= a
    const maxB = Math.min(a, range.maxSubtrahend);
    const b = Math.floor(Math.random() * maxB) + 1;

    return { a, b };
  }

  isValid(a, b) {
    return super.isValid(a, b) && a >= b; // Garantir résultat non négatif
  }

  getSupportedTypes() {
    // R1: classic et mcq uniquement
    return ['classic', 'mcq'];
  }
}
```

#### Fichier: `js/core/operations/OperationRegistry.js`

```javascript
import { Multiplication } from './Multiplication.js';
import { Addition } from './Addition.js';
import { Subtraction } from './Subtraction.js';
// import { Division } from './Division.js'; // R3

/**
 * Registry singleton pour toutes les opérations
 */
class OperationRegistryClass {
  constructor() {
    this.operations = new Map();
    this._registerDefaults();
  }

  _registerDefaults() {
    this.register(new Multiplication());
    this.register(new Addition());
    this.register(new Subtraction());
    // R3: this.register(new Division());
  }

  register(operation) {
    this.operations.set(operation.symbol, operation);
  }

  get(symbol) {
    return this.operations.get(symbol) || this.operations.get('×'); // Fallback multiplication
  }

  getAll() {
    return Array.from(this.operations.values());
  }

  getAllSymbols() {
    return Array.from(this.operations.keys());
  }

  isSupported(symbol) {
    return this.operations.has(symbol);
  }
}

// Export singleton
export const OperationRegistry = new OperationRegistryClass();

// Convenience exports
export const getOperation = symbol => OperationRegistry.get(symbol);
export const getAllOperations = () => OperationRegistry.getAll();
export const getSupportedOperators = () => OperationRegistry.getAllSymbols();
```

**Tests associés:**

- Vérifier compute() pour chaque opération
- Vérifier generateOperands() respecte contraintes
- Vérifier isValid()
- Vérifier getSupportedTypes()
- Vérifier registry fallback

---

### Phase 1.2 : Stats Unifiées avec Double-Write ⏱️ J3

#### Fichier: `js/core/operation-stats.js`

```javascript
/**
 * Statistiques unifiées pour toutes les opérations
 * R1: Double-write pour compatibilité avec multiplicationStats existant
 * R2: Migration complète + suppression double-write
 */

import Storage from './storage.js';

// Clé de stockage nouvelle structure
const OPERATION_STATS_KEY = 'operationStats';

/**
 * Enregistre le résultat d'une opération (nouvelle structure)
 * Format clé: "3×5", "7+4", "10−3"
 * @param {string} operator - Symbole opérateur (×, +, −, ÷)
 * @param {number} a - Premier opérande
 * @param {number} b - Second opérande
 * @param {boolean} isCorrect - Si la réponse était correcte
 */
export function recordOperationResult(operator, a, b, isCorrect) {
  try {
    const all = Storage.get(OPERATION_STATS_KEY, {}) || {};
    const key = `${a}${operator}${b}`;

    if (!all[key]) {
      all[key] = {
        operator,
        a,
        b,
        attempts: 0,
        errors: 0,
        lastAttempt: null,
      };
    }

    all[key].attempts++;
    if (!isCorrect) all[key].errors++;
    all[key].lastAttempt = Date.now();

    Storage.set(OPERATION_STATS_KEY, all);
  } catch (err) {
    console.warn('[operation-stats] Failed to record result:', err);
  }
}

/**
 * Récupère les stats d'une opération
 * @param {string} operator
 * @param {number} a
 * @param {number} b
 * @returns {{ operator, a, b, attempts, errors, lastAttempt }}
 */
export function getOperationStats(operator, a, b) {
  try {
    const all = Storage.get(OPERATION_STATS_KEY, {}) || {};
    const key = `${a}${operator}${b}`;
    return all[key] || { operator, a, b, attempts: 0, errors: 0, lastAttempt: null };
  } catch {
    return { operator, a, b, attempts: 0, errors: 0, lastAttempt: null };
  }
}

/**
 * Récupère toutes les stats (optionnel: filtrées par opérateur)
 * @param {string|null} operatorFilter
 * @returns {Object}
 */
export function getAllOperationStats(operatorFilter = null) {
  try {
    const all = Storage.get(OPERATION_STATS_KEY, {}) || {};

    if (!operatorFilter) return all;

    return Object.fromEntries(
      Object.entries(all).filter(([, stats]) => stats.operator === operatorFilter)
    );
  } catch {
    return {};
  }
}

// ========================================
// WRAPPERS DE COMPATIBILITÉ (R1 temporaire)
// TODO R2: Supprimer après migration complète
// ========================================

/**
 * Wrapper de compatibilité pour recordMultiplicationResult
 * R1: Double-write dans les deux structures
 * @param {number} table
 * @param {number} num
 * @param {boolean} isCorrect
 */
export function recordMultiplicationResult(table, num, isCorrect) {
  // 1. Nouvelle structure
  recordOperationResult('×', table, num, isCorrect);

  // 2. Ancienne structure (temporaire)
  try {
    const old = Storage.loadMultiplicationStats() || {};
    const key = `${table}x${num}`;

    if (!old[key]) old[key] = { attempts: 0, errors: 0 };
    old[key].attempts++;
    if (!isCorrect) old[key].errors++;

    Storage.saveMultiplicationStats(old);
  } catch (err) {
    console.warn('[operation-stats] Failed to write old format:', err);
  }
}

/**
 * Wrapper de compatibilité pour getMultiplicationStats
 * R1: Lit depuis nouvelle structure en priorité, fallback ancien
 * @param {number} table
 * @param {number} num
 * @returns {{ attempts, errors }}
 */
export function getMultiplicationStats(table, num) {
  // Priorité: nouvelle structure
  const newStats = getOperationStats('×', table, num);
  if (newStats.attempts > 0) {
    return { attempts: newStats.attempts, errors: newStats.errors };
  }

  // Fallback: ancienne structure
  try {
    const old = Storage.loadMultiplicationStats() || {};
    const key = `${table}x${num}`;
    return old[key] || { attempts: 0, errors: 0 };
  } catch {
    return { attempts: 0, errors: 0 };
  }
}

/**
 * Script de migration one-shot (à appeler manuellement ou au démarrage R2)
 * Migre multiplicationStats → operationStats
 */
export function migrateMultiplicationStats() {
  try {
    const old = Storage.loadMultiplicationStats() || {};
    const neu = Storage.get(OPERATION_STATS_KEY, {}) || {};
    let migrated = 0;

    for (const [key, stats] of Object.entries(old)) {
      const [a, b] = key.split('x').map(Number);
      if (isNaN(a) || isNaN(b)) continue;

      const newKey = `${a}×${b}`;

      // Ne pas écraser si existe déjà dans nouveau format
      if (!neu[newKey]) {
        neu[newKey] = {
          operator: '×',
          a,
          b,
          attempts: stats.attempts || 0,
          errors: stats.errors || 0,
          lastAttempt: null,
        };
        migrated++;
      }
    }

    Storage.set(OPERATION_STATS_KEY, neu);
    console.log(`✅ Migration stats: ${migrated} entrées migrées`);
    return migrated;
  } catch (err) {
    console.error('❌ Erreur migration stats:', err);
    return 0;
  }
}
```

**Tests associés:**

- Test recordOperationResult pour chaque opérateur
- Test getOperationStats
- Test double-write (vérifier les deux structures)
- Test migration (ancien → nouveau)
- Test wrapper compatibilité

---

### Phase 1.3 : Adapter questionGenerator ⏱️ J4

#### Modifications: `js/questionGenerator.js`

```javascript
// AVANT (ligne 1-15)
import Storage from './core/storage.js';
import { getTranslation } from './utils-es6.js';

// APRÈS (ajouter)
import { getOperation } from './core/operations/OperationRegistry.js';

/**
 * Génère une question selon les options fournies.
 * @param {Object} options - Options de génération
 * @param {string} options.operator - Opérateur (×, +, −, ÷) - défaut: '×'
 * @param {string} options.type - Type de question
 * @param {string} options.difficulty - Difficulté (easy, medium, hard)
 * @param {Array<number>} options.weakTables - Tables faibles (multiplication)
 * @param {Array<number>} options.excludeTables - Tables à exclure
 * @param {Array<number>} options.tables - Tables spécifiques
 * @param {number} options.minTable - Table min (multiplication)
 * @param {number} options.maxTable - Table max (multiplication)
 * @param {number} options.minNum - Num min (multiplication)
 * @param {number} options.maxNum - Num max (multiplication)
 * @param {number|null} options.forceTable - Forcer une table
 * @param {number|null} options.forceNum - Forcer un num
 * @returns {Object} { question, answer, type, operator, a, b, ... }
 */
export function generateQuestion(options = {}) {
  const {
    operator = '×', // NOUVEAU: opérateur par défaut
    type = 'auto',
    difficulty = 'medium', // NOUVEAU
    weakTables = [],
    excludeTables = [],
    tables = [],
    minTable = 1,
    maxTable = 10,
    minNum = 1,
    maxNum = 10,
    forceTable = null,
    forceNum = null,
  } = options;

  // Obtenir l'instance de l'opération
  const operation = getOperation(operator);

  // Générer opérandes selon l'opération
  let a, b;
  if (operator === '×' && (forceTable !== null || tables.length > 0)) {
    // Mode multiplication classique (compatibilité)
    const eligibleTables = getEligibleTables({
      forceTable,
      tables,
      excludeTables,
      minTable,
      maxTable,
    });
    const eligibleNums = getEligibleNums({ forceNum, minNum, maxNum });
    if (eligibleTables.length === 0 || eligibleNums.length === 0) {
      throw new Error(`generateQuestion: aucune combinaison possible`);
    }
    const picked = pickWeightedPair(eligibleTables, eligibleNums, weakTables);
    a = picked.t;
    b = picked.n;
  } else {
    // Mode opération générique
    const operands = operation.generateOperands(difficulty);
    a = operands.a;
    b = operands.b;
  }

  // Déterminer le type de question
  let chosenType = type;
  if (type === 'auto') {
    const supportedTypes = operation.getSupportedTypes();
    chosenType = supportedTypes[Math.floor(Math.random() * supportedTypes.length)];
  } else {
    // Vérifier que le type est supporté
    const supportedTypes = operation.getSupportedTypes();
    if (!supportedTypes.includes(type)) {
      console.warn(
        `[generateQuestion] Type '${type}' non supporté pour ${operator}, fallback 'classic'`
      );
      chosenType = 'classic';
    }
  }

  // Générer la question selon le type
  let question, answer;
  const result = operation.compute(a, b);

  switch (chosenType) {
    case 'classic':
      question = operation.formatQuestion(a, b, 'classic');
      answer = result;
      break;
    case 'gap':
      question = operation.formatQuestion(a, b, 'gap', result);
      answer = b;
      break;
    case 'mcq':
      question = operation.formatQuestion(a, b, 'mcq');
      answer = result;
      break;
    case 'true_false': {
      const isTrue = Math.random() > 0.5;
      const proposedAnswer = isTrue ? result : result + (Math.random() > 0.5 ? 1 : -1);
      question = operation.formatQuestion(a, b, 'true_false', proposedAnswer);
      answer = isTrue;
      break;
    }
    case 'problem':
      // Problème de mots localisé (pour l'instant multiplication uniquement)
      if (operator === '×') {
        try {
          question = getTranslation('problem_templates', { table: a, num: b });
        } catch {
          question = `Problem: ${a} ${operation.symbol} ${b} = ?`;
        }
      } else {
        // R2: ajouter templates pour autres opérations
        question = operation.formatQuestion(a, b, 'classic');
      }
      answer = result;
      break;
    default:
      question = operation.formatQuestion(a, b, 'classic');
      answer = result;
  }

  return {
    question,
    answer,
    type: chosenType,
    operator, // NOUVEAU
    a, // NOUVEAU (au lieu de table)
    b, // NOUVEAU (au lieu de num)
    // Compatibilité multiplication
    table: operator === '×' ? a : undefined,
    num: operator === '×' ? b : undefined,
  };
}

// ... (garder les helpers existants inchangés)
```

**Tests associés:**

- Test génération pour chaque opérateur
- Test type 'auto' respecte supportedTypes
- Test fallback type non supporté → 'classic'
- Test compatibilité multiplication (table/num)

---

### Phase 1.4 : Adapter Modes Quiz/Défi ⏱️ J5

#### Modifications: `js/modes/QuizMode.js` et `ChallengeMode.js`

```javascript
// Dans getQuestionOptions()
getQuestionOptions() {
  const weakTables = getWeakTables();
  const currentUser = UserManager.getCurrentUser();
  const userData = UserState.getCurrentUserData();

  // NOUVEAU: Récupérer l'opérateur sélectionné
  const operator = userData.preferredOperator || '×';

  // Pour multiplication: filtrage tables
  if (operator === '×') {
    const globalExclusions = TablePreferences.isGlobalEnabled(currentUser)
      ? TablePreferences.getActiveExclusions(currentUser)
      : [];

    const allowedTables = Array.from({ length: 10 }, (_, i) => i + 1).filter(
      t => !globalExclusions.includes(t)
    );

    if (allowedTables.length === 0) {
      console.warn('⚠️ Aucune table disponible, utilisation du jeu complet.');
      return {
        operator,           // NOUVEAU
        weakTables,
        tables: Array.from({ length: 10 }, (_, i) => i + 1),
        excludeTables: [],
        type: 'auto',
        minNum: 1,
        maxNum: 10,
      };
    }

    return {
      operator,             // NOUVEAU
      weakTables,
      tables: allowedTables,
      excludeTables: globalExclusions,
      type: 'auto',
      minNum: 1,
      maxNum: 10,
    };
  } else {
    // Autres opérations: pas de filtrage tables
    return {
      operator,             // NOUVEAU
      type: 'auto',
      difficulty: 'medium', // NOUVEAU
    };
  }
}
```

#### Modifications: Enregistrement stats

```javascript
// Dans onAnswerSubmitted() - AVANT
import { recordMultiplicationResult } from '../core/mult-stats.js';

onAnswerSubmitted(isCorrect, userAnswer) {
  const { table, num } = this.state.currentQuestion;
  recordMultiplicationResult(table, num, isCorrect);
  // ...
}

// APRÈS
import { recordOperationResult } from '../core/operation-stats.js';

onAnswerSubmitted(isCorrect, userAnswer) {
  const { operator, a, b } = this.state.currentQuestion;
  recordOperationResult(operator, a, b, isCorrect);
  // ...
}
```

#### Modifications: Feedback et TTS

```javascript
// Dans onQuestionGenerated() - adaptation TTS
onQuestionGenerated() {
  if (this.state.currentQuestion) {
    const { a, b, operator, type, question } = this.state.currentQuestion;
    const operation = getOperation(operator);

    if (type === 'true_false') {
      const spoken = String(question)
        .replace(/×/g, ' fois ')
        .replace(/\+/g, ' plus ')
        .replace(/−/g, ' moins ')
        .replace(/÷/g, ' divisé par ')
        .replace(/=/g, ' égale ');
      speak(spoken);
    } else if (type === 'gap') {
      speak(`${a} ${operation.spokenForm}`);
    } else {
      const spoken = (question ? String(question) : `${a} ${operator} ${b} = ?`)
        .replace(/×/g, ' fois ')
        .replace(/\+/g, ' plus ')
        .replace(/−/g, ' moins ')
        .replace(/÷/g, ' divisé par ')
        .replace(/=/g, ' égale ');
      speak(spoken);
    }
  }
}
```

---

### Phase 1.5 : Internationalisation ⏱️ J6

#### Audit et Ajouts i18n

**Fichiers:** `assets/translations/fr.json`, `en.json`, `es.json`

**Nouvelles clés à ajouter:**

```json
{
  "operation_selector_title": "Choisir l'opération",
  "operation_multiplication": "Multiplication (×)",
  "operation_addition": "Addition (+)",
  "operation_subtraction": "Soustraction (−)",
  "operation_division": "Division (÷)",
  "operation_division_coming_soon": "Division (÷) - Bientôt disponible",

  "mode_not_available_for_operation": "Ce mode n'est disponible que pour la multiplication pour l'instant",
  "discovery_multiplication_only": "Mode Découverte disponible uniquement pour les tables de multiplication",
  "adventure_multiplication_only": "Mode Aventure disponible uniquement pour les tables de multiplication",
  "arcade_multiplication_only": "Mode Arcade disponible uniquement pour les tables de multiplication",

  "quiz_mode_generic": "Mode Quiz",
  "challenge_mode_generic": "Mode Défi",

  "feedback_correct_operation": "Correct ! +{points} points",
  "feedback_incorrect_operation": "Incorrect. La bonne réponse est {correctAnswer}.",

  "current_operation": "Opération actuelle",
  "switch_operation": "Changer d'opération"
}
```

**Adaptations clés existantes:**

- Garder clés spécifiques multiplication (`quiz_mode` → "Mode Quiz - Multiplication")
- Ajouter variantes génériques (`quiz_mode_generic` → "Mode Quiz")
- Logique conditionnelle dans le code pour choisir la clé appropriée

---

### Phase 1.6 : UI/UX Sélecteur Opération ⏱️ J7

#### Fichier: `js/components/operationSelector.js`

```javascript
/**
 * Composant de sélection d'opération
 */

import { getTranslation } from '../utils-es6.js';
import { UserState } from '../core/userState.js';
import { getSupportedOperators } from '../core/operations/OperationRegistry.js';
import { createSafeElement } from '../security-utils.js';

export class OperationSelector {
  /**
   * Injecte le sélecteur dans un conteneur
   * @param {string} containerId - ID du conteneur
   */
  static inject(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`[OperationSelector] Conteneur #${containerId} non trouvé`);
      return;
    }

    const userData = UserState.getCurrentUserData();
    const currentOp = userData.preferredOperator || '×';

    const wrapper = document.createElement('div');
    wrapper.className = 'operation-selector-wrapper';
    wrapper.setAttribute('role', 'region');
    wrapper.setAttribute('aria-label', getTranslation('operation_selector_title'));

    const title = createSafeElement('h3', getTranslation('operation_selector_title'));
    wrapper.appendChild(title);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'operation-selector-buttons';

    // Opérations R1
    const operations = [
      { symbol: '×', key: 'operation_multiplication', enabled: true },
      { symbol: '+', key: 'operation_addition', enabled: true },
      { symbol: '−', key: 'operation_subtraction', enabled: true },
      { symbol: '÷', key: 'operation_division_coming_soon', enabled: false }, // R3
    ];

    operations.forEach(op => {
      const btn = document.createElement('button');
      btn.className = `btn operation-btn ${currentOp === op.symbol ? 'active' : ''}`;
      btn.textContent = getTranslation(op.key);
      btn.dataset.operator = op.symbol;
      btn.disabled = !op.enabled;
      btn.setAttribute('aria-label', getTranslation(op.key));

      if (op.enabled) {
        btn.addEventListener('click', () => {
          OperationSelector.selectOperation(op.symbol);

          // Mettre à jour visuellement
          buttonsContainer
            .querySelectorAll('.operation-btn')
            .forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        });
      } else {
        btn.title = getTranslation('operation_division_coming_soon');
      }

      buttonsContainer.appendChild(btn);
    });

    wrapper.appendChild(buttonsContainer);
    container.appendChild(wrapper);
  }

  /**
   * Sélectionne une opération et la sauvegarde
   * @param {string} operator
   */
  static selectOperation(operator) {
    const userData = UserState.getCurrentUserData();
    userData.preferredOperator = operator;
    UserState.updateUserData(userData);

    console.log(`✓ Opération sélectionnée: ${operator}`);

    // Déclencher événement pour mise à jour UI
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('operation-changed', { detail: { operator } }));
    }
  }

  /**
   * Obtient l'opération actuellement sélectionnée
   * @returns {string}
   */
  static getCurrentOperation() {
    const userData = UserState.getCurrentUserData();
    return userData.preferredOperator || '×';
  }
}
```

#### Modifications: `index.html` (Slide 1)

Ajouter après le sélecteur de mode:

```html
<div id="operation-selector-container"></div>
```

#### Modifications: `js/main.js`

```javascript
import { OperationSelector } from './components/operationSelector.js';

// Dans l'initialisation
function initializeApp() {
  // ... code existant

  // Injecter le sélecteur d'opération
  OperationSelector.inject('operation-selector-container');

  // ...
}
```

#### CSS Associé: Ajouter dans `css/styles.css`

```css
/* Sélecteur d'opération */
.operation-selector-wrapper {
  margin: 20px 0;
  padding: 20px;
  background: var(--card-bg, #f9f9f9);
  border-radius: 8px;
}

.operation-selector-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 12px;
}

.operation-btn {
  min-width: 160px;
  padding: 12px 20px;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.operation-btn.active {
  background-color: var(--primary-color, #4caf50);
  color: white;
  font-weight: bold;
}

.operation-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

### Phase 1.7 : Tests Unitaires ⏱️ J8

#### Fichier: `tests/__tests__/operations.test.js`

```javascript
import { getOperation } from '../../js/core/operations/OperationRegistry.js';

describe('Operations', () => {
  describe('Multiplication', () => {
    const mult = getOperation('×');

    test('compute', () => {
      expect(mult.compute(3, 5)).toBe(15);
      expect(mult.compute(7, 8)).toBe(56);
    });

    test('generateOperands respects difficulty', () => {
      for (let i = 0; i < 50; i++) {
        const { a, b } = mult.generateOperands('easy');
        expect(a).toBeGreaterThanOrEqual(1);
        expect(a).toBeLessThanOrEqual(5);
        expect(b).toBeGreaterThanOrEqual(1);
        expect(b).toBeLessThanOrEqual(5);
      }
    });

    test('formatQuestion classic', () => {
      expect(mult.formatQuestion(3, 5, 'classic')).toBe('3 × 5 = ?');
    });

    test('getSupportedTypes includes all', () => {
      expect(mult.getSupportedTypes()).toContain('classic');
      expect(mult.getSupportedTypes()).toContain('gap');
      expect(mult.getSupportedTypes()).toContain('mcq');
    });
  });

  describe('Addition', () => {
    const add = getOperation('+');

    test('compute', () => {
      expect(add.compute(3, 5)).toBe(8);
      expect(add.compute(10, 7)).toBe(17);
    });

    test('generateOperands respects maxResult', () => {
      for (let i = 0; i < 100; i++) {
        const { a, b } = add.generateOperands('easy');
        expect(a + b).toBeLessThanOrEqual(10);
      }
    });
  });

  describe('Subtraction', () => {
    const sub = getOperation('−');

    test('compute', () => {
      expect(sub.compute(10, 3)).toBe(7);
      expect(sub.compute(15, 8)).toBe(7);
    });

    test('generateOperands never negative', () => {
      for (let i = 0; i < 100; i++) {
        const { a, b } = sub.generateOperands('medium');
        expect(a).toBeGreaterThanOrEqual(b);
        expect(a - b).toBeGreaterThanOrEqual(0);
      }
    });

    test('isValid checks a >= b', () => {
      expect(sub.isValid(10, 3)).toBe(true);
      expect(sub.isValid(3, 10)).toBe(false);
    });
  });
});
```

#### Fichier: `tests/__tests__/operation-stats.test.js`

```javascript
import {
  recordOperationResult,
  getOperationStats,
  recordMultiplicationResult,
  getMultiplicationStats,
} from '../../js/core/operation-stats.js';

describe('Operation Stats', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
  });

  test('recordOperationResult saves correctly', () => {
    recordOperationResult('×', 3, 5, true);
    const stats = getOperationStats('×', 3, 5);

    expect(stats.attempts).toBe(1);
    expect(stats.errors).toBe(0);
  });

  test('records errors correctly', () => {
    recordOperationResult('+', 7, 4, false);
    recordOperationResult('+', 7, 4, false);
    recordOperationResult('+', 7, 4, true);

    const stats = getOperationStats('+', 7, 4);
    expect(stats.attempts).toBe(3);
    expect(stats.errors).toBe(2);
  });

  test('double-write compatibility wrapper', () => {
    recordMultiplicationResult(3, 5, true);

    // Vérifier nouvelle structure
    const newStats = getOperationStats('×', 3, 5);
    expect(newStats.attempts).toBe(1);

    // Vérifier ancienne structure
    const oldStats = JSON.parse(localStorage.getItem('multiplicationStats'));
    expect(oldStats['3x5'].attempts).toBe(1);
  });

  test('getMultiplicationStats reads from new format first', () => {
    recordOperationResult('×', 7, 8, true);

    const stats = getMultiplicationStats(7, 8);
    expect(stats.attempts).toBe(1);
  });
});
```

---

### Phase 1.8 : QA et Validation ⏱️ J9-J10

#### Checklist QA

**Tests automatiques:**

- [ ] `npm run format:check` → PASS
- [ ] `npm run lint` → PASS
- [ ] `npm test` → PASS (tous les tests)
- [ ] `npm run test:coverage` → >80% de couverture
- [ ] `npm run i18n:compare` → 0 clés manquantes

**Tests manuels Quiz:**

- [ ] Quiz multiplication (×) fonctionne comme avant
- [ ] Quiz addition (+) génère questions valides
- [ ] Quiz soustraction (−) jamais de résultats négatifs
- [ ] Sélecteur opération persiste entre sessions
- [ ] Feedback adapté à l'opération
- [ ] TTS prononce correctement ("plus", "moins", "fois")
- [ ] Stats enregistrées correctement (vérifier localStorage)

**Tests manuels Défi:**

- [ ] Défi multiplication (×)
- [ ] Défi addition (+)
- [ ] Défi soustraction (−)
- [ ] Timer fonctionne
- [ ] Bonus temps fonctionne

**Tests multi-environnements:**

- [ ] Desktop Chrome
- [ ] Desktop Firefox ou Safari
- [ ] Mobile Chrome (responsive)
- [ ] Mobile Safari (iOS si possible)

**Tests i18n:**

- [ ] Français complet
- [ ] Anglais complet
- [ ] Espagnol complet

**Tests accessibilité:**

- [ ] Navigation clavier sélecteur opération
- [ ] ARIA labels corrects
- [ ] Contraste couleurs OK

**Tests modes non supportés:**

- [ ] Découverte grisée si operator ≠ ×
- [ ] Aventure grisée si operator ≠ ×
- [ ] Arcade grisé si operator ≠ ×
- [ ] Tooltip explicatif affiché

---

## 📊 Critères de Succès R1

✅ **Fonctionnels:**

- Quiz/Défi fonctionnent pour ×, +, −
- Sélecteur opération persiste
- Modes non supportés clairement signalés
- Aucune régression multiplication

✅ **Techniques:**

- Architecture OOP extensible
- Stats migrées sans perte
- Tests >80% coverage
- 0 clés i18n manquantes
- Code formaté et linté

✅ **Qualité:**

- Pas de duplication de code
- Séparation des responsabilités
- Documentation complète

---

## 🚀 Livrables R1

1. **Code source** sur branche `feat/multi-operations-support`
2. **Tests unitaires** complets
3. **Documentation** (ce plan + JSDoc)
4. **PR GitHub** avec description détaillée
5. **Vidéo démo** (optionnel)

---

## 📅 Planning Suivi

- **J1-J2:** Architecture operations (OOP)
- **J3:** Stats unifiées + double-write
- **J4:** Adapter questionGenerator
- **J5:** Adapter modes Quiz/Défi
- **J6:** Internationalisation
- **J7:** UI/UX sélecteur
- **J8:** Tests unitaires
- **J9-J10:** QA complète

**Estimation totale:** 8-10 jours ouvrés

---

## 🔮 Roadmap Future

### R2 (3-4 semaines)

- Migration stats complète (supprimer double-write)
- Étendre Découverte/Aventure
- Types de questions complets (gap, true_false pour +/−)
- Templates problem pour +/−

### R3 (1-2 semaines)

- Division (÷) avec résultats entiers
- Contraintes spécifiques division
- Tests exhaustifs edge cases

### R4 (2-3 semaines)

- Arcade multi-opérations
- Injection operator dans mini-jeux
- Pas de duplication jeux

---

**Architecte/Dev:** Claude Code
**Status:** ✅ Plan validé, prêt pour implémentation
**Dernière mise à jour:** 2025-11-25
