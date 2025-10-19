---
name: "JSDoc Generator"
description: "Génère automatiquement la documentation JSDoc pour modules ES6 avec @param, @returns, @throws et exemples. Utiliser lors de l'ajout de fonctions, refactoring, ou amélioration de la documentation"
---

# JSDoc Generator

Cette skill guide la génération et l'amélioration de la documentation JSDoc pour les modules ES6 du projet leapmultix.

## Quand utiliser cette skill
- Ajout de nouvelles fonctions ou classes
- Refactoring de code existant
- Amélioration de la documentation
- Avant une release (docs complètes)
- Onboarding de nouveaux développeurs
- Génération de documentation API

## Commandes disponibles

### Analyser la couverture JSDoc

```bash
npm run analyze:jsdoc
```

Analyse quels fichiers manquent de documentation JSDoc.

### Améliorer la documentation

```bash
npm run improve:jsdoc
```

Suggestions automatiques d'amélioration de la documentation.

## Format JSDoc standard

### Documentation de fonction

```javascript
/**
 * Brève description de la fonction (impératif)
 *
 * Description détaillée optionnelle sur plusieurs lignes.
 * Expliquer le comportement, les cas particuliers, etc.
 *
 * @param {Type} paramName - Description du paramètre
 * @param {Type} [optionalParam] - Paramètre optionnel
 * @param {Type} [paramWithDefault=valeur] - Avec valeur par défaut
 * @returns {Type} Description de la valeur retournée
 * @throws {ErrorType} Conditions qui lancent une erreur
 * @example
 * // Exemple d'utilisation
 * const result = maFonction(arg1, arg2);
 * console.log(result); // Résultat attendu
 */
export function maFonction(paramName, optionalParam, paramWithDefault = 'valeur') {
  // Implémentation
  return result;
}
```

### Documentation de classe

```javascript
/**
 * Brève description de la classe
 *
 * Description détaillée de la responsabilité de la classe.
 *
 * @class
 * @extends ParentClass
 * @example
 * const instance = new MaClasse(options);
 * instance.method();
 */
export class MaClasse extends ParentClass {
  /**
   * Constructeur de MaClasse
   *
   * @param {Object} options - Options de configuration
   * @param {string} options.name - Nom de l'instance
   * @param {number} options.value - Valeur initiale
   */
  constructor(options) {
    super();
    this.name = options.name;
    this.value = options.value;
  }

  /**
   * Méthode d'instance
   *
   * @param {string} input - Paramètre d'entrée
   * @returns {boolean} Résultat de l'opération
   */
  method(input) {
    return true;
  }

  /**
   * Getter pour la propriété
   *
   * @type {number}
   */
  get computedValue() {
    return this.value * 2;
  }
}
```

### Documentation de module

```javascript
/**
 * @module utils/helpers
 * @description Fonctions utilitaires pour calculs mathématiques
 */

/**
 * Additionne deux nombres
 *
 * @param {number} a - Premier nombre
 * @param {number} b - Deuxième nombre
 * @returns {number} La somme de a et b
 * @example
 * add(2, 3); // returns 5
 */
export function add(a, b) {
  return a + b;
}
```

## Types JSDoc

### Types primitifs

```javascript
/**
 * @param {string} text - Texte
 * @param {number} count - Nombre
 * @param {boolean} flag - Booléen
 * @param {null} value - Null
 * @param {undefined} notSet - Undefined
 * @param {*} anything - N'importe quel type
 */
```

### Types complexes

```javascript
/**
 * @param {Array<string>} items - Tableau de strings
 * @param {Object} config - Objet de configuration
 * @param {Function} callback - Fonction callback
 * @param {Promise<number>} asyncResult - Promesse qui résout en number
 * @param {string|number} mixed - Union de types
 * @param {?string} nullable - String ou null
 * @param {!string} nonNull - String non-null
 */
```

### Types d'objets

```javascript
/**
 * @typedef {Object} User
 * @property {string} name - Nom de l'utilisateur
 * @property {number} age - Âge
 * @property {string} [email] - Email optionnel
 */

/**
 * Crée un utilisateur
 *
 * @param {User} userData - Données utilisateur
 * @returns {User} Utilisateur créé
 */
function createUser(userData) {
  return userData;
}
```

### Types personnalisés

```javascript
/**
 * @typedef {Object} GameState
 * @property {number} score - Score actuel
 * @property {number} lives - Vies restantes
 * @property {boolean} isPlaying - État du jeu
 * @property {Array<Question>} questions - Questions en cours
 */

/**
 * @typedef {Object} Question
 * @property {number} num1 - Premier nombre
 * @property {number} num2 - Deuxième nombre
 * @property {number} answer - Réponse correcte
 * @property {string} operation - Type d'opération ('+', '*', etc.)
 */
```

## Patterns JSDoc pour leapmultix

### Game Mode

```javascript
/**
 * Mode de jeu Quiz - Questions multiplication basiques
 *
 * Implémente le mode quiz classique avec questions multiplication
 * aléatoires et feedback immédiat.
 *
 * @class QuizMode
 * @extends GameMode
 * @example
 * const quiz = new QuizMode();
 * await quiz.init();
 * quiz.handleQuestion({ num1: 3, num2: 4, answer: 12 });
 */
export default class QuizMode extends GameMode {
  /**
   * Initialise le mode Quiz
   *
   * Configure l'interface, attache les listeners, et prépare
   * les questions initiales.
   *
   * @returns {Promise<void>}
   * @fires GameMode#mode:initialized
   * @throws {Error} Si l'initialisation échoue
   */
  async init() {
    // Implementation
  }

  /**
   * Gère une réponse correcte
   *
   * Met à jour le score, affiche le feedback positif, et
   * génère la prochaine question.
   *
   * @param {Question} question - Question répondue
   * @fires GameMode#mode:correctAnswer
   * @example
   * mode.handleCorrectAnswer({ num1: 3, num2: 4, answer: 12 });
   */
  handleCorrectAnswer(question) {
    // Implementation
  }
}
```

### Event Bus

```javascript
/**
 * Bus d'événements global pour communication inter-composants
 *
 * Implémente le pattern pub/sub pour découpler les composants.
 * Tous les événements sont centralisés ici.
 *
 * @module core/eventBus
 * @example
 * import { eventBus } from './core/eventBus.js';
 *
 * // Écouter un événement
 * eventBus.on('user:login', (data) => {
 *   console.log('User logged in:', data.username);
 * });
 *
 * // Émettre un événement
 * eventBus.emit('user:login', { username: 'John' });
 */

/**
 * Émet un événement
 *
 * Notifie tous les listeners enregistrés pour cet événement.
 * Les listeners sont appelés de manière synchrone dans l'ordre
 * d'enregistrement.
 *
 * @param {string} event - Nom de l'événement
 * @param {*} [data] - Données à passer aux listeners
 * @returns {void}
 * @example
 * eventBus.emit('game:start', { mode: 'quiz' });
 * eventBus.emit('score:update', { score: 100 });
 */
export function emit(event, data) {
  // Implementation
}
```

### Utilitaires

```javascript
/**
 * Mélange un tableau aléatoirement (algorithme Fisher-Yates)
 *
 * Modifie le tableau en place et retourne une référence au même
 * tableau mélangé. Utilise Math.random() pour la randomisation.
 *
 * @param {Array} array - Tableau à mélanger
 * @returns {Array} Le même tableau mélangé (modifié en place)
 * @throws {TypeError} Si l'argument n'est pas un tableau
 * @example
 * const cards = [1, 2, 3, 4, 5];
 * shuffleArray(cards);
 * console.log(cards); // [3, 1, 5, 2, 4] (ordre aléatoire)
 *
 * @example
 * // Créer une copie mélangée sans modifier l'original
 * const original = [1, 2, 3];
 * const shuffled = shuffleArray([...original]);
 */
export function shuffleArray(array) {
  // Implementation
}

/**
 * Génère des options de QCM incluant la bonne réponse
 *
 * Crée un tableau d'options uniques pour un questionnaire à choix
 * multiples. La bonne réponse est toujours incluse et les options
 * sont mélangées aléatoirement.
 *
 * @param {number} correctAnswer - La réponse correcte à inclure
 * @param {number} count - Nombre total d'options à générer
 * @param {Function} [generator] - Fonction pour générer options alternatives
 * @returns {Array<number>} Tableau d'options mélangées
 * @throws {Error} Si count < 2
 * @example
 * // Générer 4 options pour la réponse 12
 * const options = generateMCQOptions(12, 4);
 * // Possible: [12, 8, 15, 10]
 *
 * @example
 * // Avec générateur personnalisé
 * const options = generateMCQOptions(12, 4, (answer) => {
 *   return answer + Math.floor(Math.random() * 10) - 5;
 * });
 */
export function generateMCQOptions(correctAnswer, count, generator) {
  // Implementation
}
```

### Storage

```javascript
/**
 * Abstraction du LocalStorage pour gestion persistante des données
 *
 * Fournit une API simplifiée pour localStorage avec sérialisation
 * JSON automatique et gestion d'erreurs.
 *
 * @module core/storage
 * @example
 * import Storage from './core/storage.js';
 *
 * Storage.set('user', { name: 'John', score: 100 });
 * const user = Storage.get('user');
 */

export default class Storage {
  /**
   * Récupère une valeur du localStorage
   *
   * Désérialise automatiquement les objets JSON. Retourne la valeur
   * par défaut si la clé n'existe pas ou si la désérialisation échoue.
   *
   * @param {string} key - Clé de la valeur
   * @param {*} [defaultValue=null] - Valeur par défaut si clé absente
   * @returns {*} Valeur stockée ou valeur par défaut
   * @example
   * Storage.get('username', 'Guest'); // returns 'Guest' si absent
   * Storage.get('settings'); // returns null si absent
   */
  static get(key, defaultValue = null) {
    // Implementation
  }

  /**
   * Stocke une valeur dans le localStorage
   *
   * Sérialise automatiquement les objets en JSON.
   *
   * @param {string} key - Clé de stockage
   * @param {*} value - Valeur à stocker
   * @returns {boolean} True si succès, false si erreur
   * @throws {QuotaExceededError} Si limite de stockage atteinte
   * @example
   * Storage.set('user', { name: 'John', age: 25 });
   * Storage.set('theme', 'dark');
   */
  static set(key, value) {
    // Implementation
  }
}
```

## Tags JSDoc spéciaux

### Documentation de callback

```javascript
/**
 * @callback QuestionCallback
 * @param {Question} question - Question générée
 * @param {boolean} isCorrect - Si la réponse était correcte
 * @returns {void}
 */

/**
 * Enregistre un callback pour les questions
 *
 * @param {QuestionCallback} callback - Fonction à appeler
 */
function onQuestion(callback) {
  // Implementation
}
```

### Événements

```javascript
/**
 * Événement émis quand le score change
 *
 * @event ScoreManager#score:changed
 * @type {Object}
 * @property {number} oldScore - Score précédent
 * @property {number} newScore - Nouveau score
 * @property {number} delta - Différence
 */

/**
 * Met à jour le score
 *
 * @fires ScoreManager#score:changed
 */
function updateScore(points) {
  // Implementation
  this.emit('score:changed', { oldScore, newScore, delta });
}
```

### Deprecated et TODO

```javascript
/**
 * Ancienne fonction de calcul (deprecated)
 *
 * @deprecated Utiliser calculateScore() à la place
 * @see {@link calculateScore}
 */
function oldCalculate() {
  // Implementation
}

/**
 * Fonction en cours de développement
 *
 * @todo Ajouter validation des paramètres
 * @todo Implémenter gestion d'erreurs
 * @todo Ajouter tests unitaires
 */
function newFeature() {
  // Implementation
}
```

### Liens et références

```javascript
/**
 * Système de questions pour modes de jeu
 *
 * @see {@link GameMode} pour l'utilisation dans les modes
 * @see {@link https://example.com/doc|Documentation externe}
 * @link module:core/utils
 */
```

## Workflow de documentation

### 1. Identifier les fonctions sans docs

```bash
npm run analyze:jsdoc
```

**Output :**
```
📊 Analyse de la couverture JSDoc

Fichiers avec documentation insuffisante:
- js/modes/NewMode.js: 60% (3/5 fonctions documentées)
- js/utils/helpers.js: 40% (2/5 fonctions documentées)
- js/arcade-new.js: 0% (0/8 fonctions documentées)

Total projet: 78% (156/200 fonctions)
```

### 2. Générer documentation de base

Pour une fonction simple :

```javascript
// Avant
export function multiply(a, b) {
  return a * b;
}

// Après - Documentation minimale
/**
 * Multiplie deux nombres
 *
 * @param {number} a - Premier nombre
 * @param {number} b - Deuxième nombre
 * @returns {number} Produit de a et b
 */
export function multiply(a, b) {
  return a * b;
}
```

### 3. Enrichir avec exemples

```javascript
/**
 * Multiplie deux nombres
 *
 * @param {number} a - Premier nombre
 * @param {number} b - Deuxième nombre
 * @returns {number} Produit de a et b
 * @example
 * multiply(3, 4); // returns 12
 * multiply(-2, 5); // returns -10
 * multiply(0, 100); // returns 0
 */
export function multiply(a, b) {
  return a * b;
}
```

### 4. Ajouter gestion d'erreurs

```javascript
/**
 * Multiplie deux nombres
 *
 * @param {number} a - Premier nombre
 * @param {number} b - Deuxième nombre
 * @returns {number} Produit de a et b
 * @throws {TypeError} Si a ou b ne sont pas des nombres
 * @example
 * multiply(3, 4); // returns 12
 * multiply('3', 4); // throws TypeError
 */
export function multiply(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Arguments must be numbers');
  }
  return a * b;
}
```

## Génération automatique

### Prompt pour génération

**Pour une fonction :**
```
Génère JSDoc pour cette fonction en incluant:
- Description concise (impératif)
- @param pour chaque paramètre avec type et description
- @returns avec type et description
- @throws si erreurs possibles
- @example avec 2-3 cas d'usage

[Coller le code de la fonction]
```

**Pour une classe :**
```
Génère JSDoc pour cette classe en incluant:
- Description de la classe et sa responsabilité
- @class tag
- @extends si applicable
- Documenter le constructeur avec @param pour options
- Documenter chaque méthode publique
- @example pour l'utilisation de la classe

[Coller le code de la classe]
```

### Template rapide

```javascript
/**
 * [Description courte impérative]
 *
 * [Description détaillée optionnelle]
 *
 * @param {Type} param - Description
 * @returns {Type} Description
 * @example
 * // Exemple
 */
```

## Standards du projet

### Conventions leapmultix

1. **Descriptions impératives** : "Calcule le score" pas "Cette fonction calcule"
2. **Types explicites** : Toujours spécifier les types
3. **Exemples concrets** : Utiliser des valeurs du domaine (scores, questions, etc.)
4. **Paramètres d'objets** : Documenter les propriétés avec notation dot

```javascript
/**
 * Configure le mode de jeu
 *
 * @param {Object} options - Options de configuration
 * @param {string} options.mode - Type de mode ('quiz', 'challenge', etc.)
 * @param {number} options.difficulty - Niveau (1-10)
 * @param {boolean} [options.sound=true] - Activer les sons
 */
```

### Priorités de documentation

**Haute priorité :**
- API publiques (exports)
- Fonctions complexes
- Classes et constructeurs
- Fonctions avec side effects

**Moyenne priorité :**
- Méthodes de classe
- Callbacks
- Utilitaires

**Basse priorité :**
- Fonctions privées simples
- Getters/setters évidents
- One-liners évidents

## Génération de documentation HTML

### Avec JSDoc CLI

```bash
# Installer JSDoc
npm install --save-dev jsdoc

# Générer documentation HTML
npx jsdoc js/**/*.js -d docs/api
```

### Configuration JSDoc

Créer `jsdoc.json` :

```json
{
  "source": {
    "include": ["js"],
    "includePattern": ".+\\.js$",
    "excludePattern": "(node_modules|tests)"
  },
  "opts": {
    "destination": "./docs/api",
    "recurse": true,
    "template": "default"
  }
}
```

Puis :
```bash
npx jsdoc -c jsdoc.json
```

## Bonnes pratiques

### Do's ✅

1. **Documenter en même temps que le code** - Pas après coup
2. **Exemples réalistes** - Utiliser des valeurs du domaine
3. **Descriptions courtes** - Une ligne si possible
4. **Types précis** - Object est trop vague, créer @typedef
5. **Maintenir à jour** - Modifier JSDoc lors de refactoring
6. **Cas limites** - Documenter comportement avec null, undefined, etc.
7. **Liens internes** - Utiliser @see pour lier documentation

### Don'ts ❌

1. **Pas de JSDoc redondant** - Si nom de fonction clair, JSDoc minimal OK
2. **Pas de copier-coller** - Adapter description à chaque fonction
3. **Pas de JSDoc obsolète** - Mieux rien que faux
4. **Pas de types vagues** - Éviter {*} sauf vraiment nécessaire
5. **Pas de doc pour l'évident** - `getter getName()` n'a pas besoin de JSDoc

## Checklist documentation complète

- [ ] Description courte et claire
- [ ] @param pour chaque paramètre avec type
- [ ] @returns avec type et description
- [ ] @throws si erreurs possibles
- [ ] @example avec au moins 1 cas d'usage
- [ ] @typedef pour types complexes
- [ ] Liens avec @see si applicable
- [ ] Cas limites documentés
- [ ] Types précis (pas de {Object} générique)
- [ ] Cohérent avec le reste du projet

## Outils d'aide

### VS Code extensions

- **Document This** : Génère JSDoc automatiquement
- **JSDoc Generator** : Templates JSDoc
- **Better Comments** : Coloration syntaxique JSDoc

### Commandes projet

```bash
npm run analyze:jsdoc      # Analyser couverture
npm run improve:jsdoc      # Suggestions amélioration
```

## Voir aussi

- `code-quality/SKILL.md` - Standards de code incluant documentation
- `tdd-jest/SKILL.md` - Tests qui complètent la documentation
- `CLAUDE.md` - Conventions du projet
- JSDoc Official: https://jsdoc.app/
- TypeScript JSDoc: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
