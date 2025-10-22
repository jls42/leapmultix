---
name: 'TDD with Jest'
description: "Implémente les fonctionnalités en suivant le cycle Test-Driven Development RED/GREEN/REFACTOR avec Jest. Utiliser lors de l'ajout de nouvelles features, correction de bugs, ou refactoring de code existant"
---

# Test-Driven Development with Jest

Cette skill guide l'implémentation de code en suivant la méthodologie TDD avec le framework Jest.

## Quand utiliser cette skill

- Implémentation de nouvelles fonctionnalités
- Correction de bugs avec reproduction du problème
- Refactoring de code existant
- Ajout de comportements à des modules existants
- Validation de logique métier complexe

## Le cycle TDD : RED → GREEN → REFACTOR

### Phase 1 : RED (Test qui échoue)

**Objectif :** Écrire un test qui définit le comportement souhaité et échoue

```javascript
// tests/__tests__/myFeature.test.js
describe('MyFeature', () => {
  test('should do something specific', () => {
    const result = myFunction(input);
    expect(result).toBe(expectedOutput);
  });
});
```

**Étapes :**

1. Identifier le comportement à implémenter
2. Écrire le test d'abord (avant le code)
3. Exécuter le test et **vérifier qu'il échoue**
4. Documenter pourquoi il échoue (fonction non définie, mauvais résultat, etc.)

**Commande :**

```bash
npm test myFeature.test.js
```

**Résultat attendu :** ❌ Test DOIT échouer

### Phase 2 : GREEN (Test qui passe)

**Objectif :** Écrire le code minimum pour faire passer le test

```javascript
// js/myFeature.js
export function myFunction(input) {
  // Code minimum pour faire passer le test
  return expectedOutput;
}
```

**Étapes :**

1. Écrire le code le plus simple possible
2. Ne pas optimiser, ne pas généraliser
3. Faire passer le test uniquement
4. Exécuter le test et **vérifier qu'il passe**

**Commande :**

```bash
npm test myFeature.test.js
```

**Résultat attendu :** ✅ Test DOIT passer

### Phase 3 : REFACTOR (Améliorer le code)

**Objectif :** Améliorer le code sans changer le comportement

**Étapes :**

1. Nettoyer le code (noms, structure)
2. Éliminer les duplications
3. Améliorer la lisibilité
4. Optimiser si nécessaire
5. **Vérifier que les tests passent toujours**

**Commande :**

```bash
npm test myFeature.test.js
```

**Résultat attendu :** ✅ Tests DOIVENT toujours passer

## Structure des tests Jest

### Fichier de test basique

```javascript
// tests/__tests__/myModule.test.js
import MyModule from '../../js/myModule.js';

describe('MyModule', () => {
  // Setup avant chaque test
  beforeEach(() => {
    // Initialisation commune
  });

  // Cleanup après chaque test
  afterEach(() => {
    // Nettoyage
  });

  describe('Feature group', () => {
    test('should handle normal case', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = MyModule.process(input);

      // Assert
      expect(result).toBe('expected');
    });

    test('should handle edge case', () => {
      expect(() => MyModule.process(null)).toThrow();
    });
  });
});
```

### Organisation des tests

**Pattern Arrange-Act-Assert (AAA) :**

```javascript
test('descriptive test name', () => {
  // Arrange: Préparer les données
  const user = { name: 'Test', age: 10 };

  // Act: Exécuter l'action
  const result = validateUser(user);

  // Assert: Vérifier le résultat
  expect(result).toBe(true);
});
```

## Assertions Jest communes

### Égalité et comparaison

```javascript
// Égalité stricte
expect(value).toBe(42);
expect(value).toBe('string');

// Égalité profonde (objets, arrays)
expect(object).toEqual({ name: 'Test', age: 10 });
expect(array).toEqual([1, 2, 3]);

// Contenu partiel
expect(object).toMatchObject({ name: 'Test' });
```

### Vérifications booléennes

```javascript
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();
```

### Nombres

```javascript
expect(value).toBeGreaterThan(10);
expect(value).toBeLessThan(100);
expect(value).toBeCloseTo(0.3, 2); // Précision 2 décimales
```

### Strings

```javascript
expect(string).toMatch(/pattern/);
expect(string).toContain('substring');
```

### Arrays et itérables

```javascript
expect(array).toContain(element);
expect(array).toHaveLength(5);
expect(array).toContainEqual({ id: 1 });
```

### Exceptions

```javascript
expect(() => throwingFunction()).toThrow();
expect(() => throwingFunction()).toThrow(Error);
expect(() => throwingFunction()).toThrow('Error message');
```

## Mocking avec Jest

### Mock de fonctions

```javascript
// Créer un mock
const mockFn = jest.fn();

// Mock avec valeur de retour
mockFn.mockReturnValue(42);

// Mock avec implémentation
mockFn.mockImplementation(x => x * 2);

// Mock avec promesse
mockFn.mockResolvedValue('success');
mockFn.mockRejectedValue(new Error('fail'));

// Vérifications
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg');
expect(mockFn).toHaveBeenCalledTimes(2);
```

### Mock de modules

```javascript
// Mock d'un module entier
jest.mock('../../js/audio.js', () => ({
  playSound: jest.fn(),
  setVolume: jest.fn(),
}));

// Import du mock
import { playSound } from '../../js/audio.js';

// Utilisation
test('should play sound', () => {
  myFunction();
  expect(playSound).toHaveBeenCalledWith('correct');
});
```

### Spy sur méthodes existantes

```javascript
import { eventBus } from '../../js/core/eventBus.js';

test('should emit event', () => {
  const spy = jest.spyOn(eventBus, 'emit');

  myFunction();

  expect(spy).toHaveBeenCalledWith('event:name', { data: 'value' });

  spy.mockRestore(); // Restaurer comportement original
});
```

## Tests asynchrones

### Avec async/await

```javascript
test('should load data asynchronously', async () => {
  const data = await loadData();
  expect(data).toBeDefined();
});
```

### Avec Promises

```javascript
test('should resolve promise', () => {
  return myPromise().then(result => {
    expect(result).toBe('success');
  });
});

test('should reject promise', () => {
  return expect(myPromise()).rejects.toThrow('error');
});
```

### Avec done callback

```javascript
test('should handle callback', done => {
  asyncFunction(result => {
    expect(result).toBe('expected');
    done();
  });
});
```

## Patterns TDD pour leapmultix

### Test d'un Game Mode

```javascript
describe('MyGameMode', () => {
  let mode;

  beforeEach(() => {
    mode = new MyGameMode();
  });

  afterEach(async () => {
    if (mode.isActive) {
      await mode.cleanup();
    }
  });

  describe('Initialization', () => {
    test('should initialize with default state', async () => {
      await mode.init();

      expect(mode.isActive).toBe(true);
      expect(mode.score).toBe(0);
    });
  });

  describe('Question handling', () => {
    test('should handle correct answer', async () => {
      await mode.init();
      const question = { num1: 3, num2: 4, answer: 12 };

      mode.handleCorrectAnswer(question);

      expect(mode.score).toBeGreaterThan(0);
    });
  });
});
```

### Test avec Event Bus

```javascript
import { eventBus } from '../../js/core/eventBus.js';

test('should emit initialization event', async () => {
  const spy = jest.spyOn(eventBus, 'emit');

  await mode.init();

  expect(spy).toHaveBeenCalledWith('mode:initialized', expect.objectContaining({ mode: 'myMode' }));
});
```

### Test de Storage

```javascript
describe('Storage operations', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should save and load user data', () => {
    const userData = { name: 'Test', score: 100 };

    Storage.set('user', userData);
    const loaded = Storage.get('user');

    expect(loaded).toEqual(userData);
  });
});
```

### Test d'utilitaires

```javascript
describe('generateMCQOptions', () => {
  test('should generate correct number of options', () => {
    const options = generateMCQOptions(12, 4);

    expect(options).toHaveLength(4);
    expect(options).toContain(12);
  });

  test('should not generate duplicate options', () => {
    const options = generateMCQOptions(12, 4);
    const unique = [...new Set(options)];

    expect(unique).toHaveLength(options.length);
  });
});
```

## Couverture de code

### Exécuter avec couverture

```bash
# Tous les tests avec couverture
npm run test:coverage

# Un fichier spécifique avec couverture
npm test -- --coverage myFile.test.js
```

### Objectifs de couverture

Pour leapmultix, viser :

- **Statements:** > 80%
- **Branches:** > 75%
- **Functions:** > 80%
- **Lines:** > 80%

### Ignorer du code dans la couverture

```javascript
/* istanbul ignore next */
function debugOnlyFunction() {
  // Code ignoré dans la couverture
}

// Ignorer une ligne
const debug = true; /* istanbul ignore next */
```

## Commandes Jest utiles

```bash
# Tests en mode watch
npm run test:watch

# Tests d'un fichier spécifique
npm test myFile.test.js

# Tests avec output verbose
npm run test:verbose

# Tests des core features uniquement
npm run test:core

# Tests d'intégration
npm run test:integration

# Re-exécuter seulement les tests qui ont échoué
npm test -- --onlyFailures

# Mettre à jour les snapshots
npm test -- -u
```

## Workflow TDD complet - Exemple

**Scénario :** Ajouter une fonction pour valider un score

### 1. RED - Écrire le test

```javascript
// tests/__tests__/scoreValidator.test.js
import { validateScore } from '../../js/scoreValidator.js';

describe('validateScore', () => {
  test('should accept valid score', () => {
    expect(validateScore(100)).toBe(true);
  });

  test('should reject negative score', () => {
    expect(validateScore(-10)).toBe(false);
  });

  test('should reject non-numeric score', () => {
    expect(validateScore('invalid')).toBe(false);
  });
});
```

**Exécuter :** `npm test scoreValidator.test.js`
**Résultat attendu :** ❌ Tests échouent (fonction n'existe pas)

### 2. GREEN - Écrire le code minimum

```javascript
// js/scoreValidator.js
export function validateScore(score) {
  if (typeof score !== 'number') return false;
  if (score < 0) return false;
  return true;
}
```

**Exécuter :** `npm test scoreValidator.test.js`
**Résultat attendu :** ✅ Tous les tests passent

### 3. REFACTOR - Améliorer

```javascript
// js/scoreValidator.js
/**
 * Validates a game score
 * @param {number} score - Score to validate
 * @returns {boolean} True if score is valid
 */
export function validateScore(score) {
  return typeof score === 'number' && score >= 0;
}
```

**Exécuter :** `npm test scoreValidator.test.js`
**Résultat attendu :** ✅ Tous les tests passent encore

### 4. Ajouter plus de cas

```javascript
test('should accept zero score', () => {
  expect(validateScore(0)).toBe(true);
});

test('should handle decimal scores', () => {
  expect(validateScore(99.5)).toBe(true);
});
```

Répéter le cycle RED → GREEN → REFACTOR pour chaque nouveau cas.

## Bonnes pratiques TDD

### Do's ✅

1. **Écrire le test d'abord** - Toujours avant le code
2. **Un test à la fois** - Focus sur un comportement
3. **Noms descriptifs** - "should do X when Y"
4. **Tests isolés** - Pas de dépendances entre tests
5. **Cleanup approprié** - beforeEach/afterEach
6. **Mock externes** - APIs, fichiers, timers
7. **Vérifier l'échec** - S'assurer que le test échoue vraiment

### Don'ts ❌

1. **Pas de test après coup** - TDD = test first
2. **Pas de code en avance** - Attendre le test
3. **Pas de sur-engineering** - Code minimum pour GREEN
4. **Pas de tests fragiles** - Éviter tests dépendant de timing
5. **Pas de tests unitaires sur UI** - Utiliser E2E pour ça
6. **Pas ignorer les tests qui échouent** - Corriger immédiatement

## Debugging de tests

### Utiliser console.log dans les tests

```javascript
test('debug test', () => {
  console.log('Value:', value);
  expect(value).toBe(expected);
});
```

### Exécuter un seul test

```javascript
test.only('should focus on this test', () => {
  // Seul ce test sera exécuté
});
```

### Ignorer temporairement un test

```javascript
test.skip('should skip this test', () => {
  // Ce test sera ignoré
});
```

### Mode debug avec Node

```bash
node --inspect-brk node_modules/.bin/jest --runInBand myTest.test.js
```

## Intégration avec CI/CD

Les tests TDD s'intègrent dans le workflow CI/CD :

```bash
# Avant chaque commit
npm run format:check
npm run lint
npm test
npm run test:coverage

# Ou simplement
npm run verify
```

## Checklist TDD

Avant de considérer une feature terminée :

- [ ] Test écrit avant le code (RED)
- [ ] Code minimum implémenté (GREEN)
- [ ] Code refactoré et propre (REFACTOR)
- [ ] Tous les tests passent
- [ ] Couverture de code acceptable
- [ ] Cas limites testés
- [ ] Tests isolés et indépendants
- [ ] Mocks appropriés utilisés
- [ ] Documentation ajoutée (JSDoc)
- [ ] Code formatté et linté

## Agent TDD disponible

Pour appliquer cette méthodologie TDD avec expertise sur le projet leapmultix :

**Test-writer Agent :**

- Use the **test-writer agent** pour créer des tests TDD complets
- Il applique automatiquement le cycle RED → GREEN → REFACTOR
- Spécialisé dans : Jest, canvas games, event bus, storage, i18n
- Couverture > 80%, mocking approprié, patterns leapmultix

**Workflow recommandé :**

1. Décrire la feature à implémenter
2. Use the **test-writer agent** pour créer les tests (phase RED)
3. Vérifier que les tests échouent
4. Implémenter le code minimum (phase GREEN)
5. Use the **test-writer agent** pour vérifier couverture et edge cases
6. Refactorer (phase REFACTOR)

## Ressources

### Fichiers de configuration

- `jest.config.cjs` - Configuration Jest
- `tests/__tests__/` - Répertoire des tests

### Tests de référence

- `tests/__tests__/core/utils.test.js` - Tests utilitaires
- `tests/__tests__/core/storage.test.js` - Tests storage
- `tests/__tests__/lazy-loader.test.js` - Tests lazy loading
- `tests/__tests__/integration/` - Tests d'intégration

### Documentation Jest

- Jest Matchers: https://jestjs.io/docs/expect
- Jest Mocks: https://jestjs.io/docs/mock-functions
- Jest Async: https://jestjs.io/docs/asynchronous

## Voir aussi

- `code-quality/SKILL.md` - Skill qualité code avec workflow tests
- `game-mode/SKILL.md` - Skill création game mode avec tests inclus
- `CLAUDE.md` - Architecture et conventions du projet
