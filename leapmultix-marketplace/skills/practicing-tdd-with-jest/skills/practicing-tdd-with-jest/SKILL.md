---
name: practicing-tdd-with-jest
description: Implements features following Test-Driven Development RED/GREEN/REFACTOR cycle with Jest. Use when adding new features, fixing bugs, or refactoring existing code
allowed-tools: Read, Write, Grep, Glob, Bash
---

# Test-Driven Development avec Jest

Implémente code en suivant cycle TDD RED/GREEN/REFACTOR avec Jest.

## Table des matières

- [Quand utiliser](#quand-utiliser)
- [Cycle TDD : RED → GREEN → REFACTOR](#cycle-tdd--red--green--refactor)
- [Scripts npm](#scripts-npm)
- [Structure tests (Arrange-Act-Assert)](#structure-tests-arrange-act-assert)
- [Assertions Jest essentielles](#assertions-jest-essentielles)
- [Mocking](#mocking)
- [Tests spécialisés](#tests-spécialisés)
- [Couverture](#couverture)
- [Bonnes pratiques](#bonnes-pratiques)
- [Workflow](#workflow)
- [Checklist](#checklist)
- [En cas de doute](#en-cas-de-doute)

## Quand utiliser

- Implémentation nouvelles features
- Correction bugs avec reproduction
- Refactoring code existant
- Ajout comportements modules
- Validation logique complexe

## Cycle TDD : RED → GREEN → REFACTOR

**RED (Test échoue) :**

1. Identifier comportement
2. Écrire test AVANT code
3. Test DOIT échouer ❌

**GREEN (Test passe) :**

1. Code minimum possible
2. Pas d'optimisation/généralisation
3. Faire passer test uniquement ✅

**REFACTOR (Améliorer) :**

1. Nettoyer code (noms, structure)
2. Éliminer duplications
3. Vérifier tests passent toujours ✅

## Scripts npm

- `npm test` - Tous tests
- `npm run test:watch` - Mode watch
- `npm run test:coverage` - Avec couverture

## Structure tests (Arrange-Act-Assert)

**AAA Pattern :**

- **Arrange :** Préparer données
- **Act :** Exécuter action
- **Assert :** Vérifier résultat

**Grouping :**

- `describe()` - Grouper tests liés
- `test()` / `it()` - Tests individuels
- `beforeEach()` / `afterEach()` - Setup/cleanup

**Nommage :** Descriptif ("should do X when Y", "handles edge case Z")

## Assertions Jest essentielles

- Égalité: `toBe()` (strict), `toEqual()` (profonde)
- Booléens: `toBeTruthy()`, `toBeFalsy()`, `toBeNull()`, `toBeUndefined()`
- Nombres: `toBeGreaterThan()`, `toBeLessThan()`, `toBeCloseTo()`
- Arrays: `toContain()`, `toHaveLength()`
- Exceptions: `toThrow()`, `toThrow(ErrorClass)`

Voir documentation Jest pour liste complète.

## Mocking

**Fonctions :**

- `jest.fn()` - Mock simple
- `mockReturnValue()` - Valeur
- `mockResolvedValue()` / `mockRejectedValue()` - Promesses
- `toHaveBeenCalled()`, `toHaveBeenCalledWith(args)`, `toHaveBeenCalledTimes(n)`

**Modules :** Isoler code testé, éviter dépendances externes (API, localStorage)

## Tests spécialisés

**Async :** `async/await` recommandé, ou `expect().resolves/rejects`

**DOM/UI :** jsdom simule DOM - créer, attacher, exécuter, vérifier, cleanup

**Canvas (jeux arcade) :** Mock context, mock performance.now(), tester logique séparément rendu, tests d'état

## Couverture

**Cibles :** Branches > 80%, Functions > 80%, Lines > 80%, Statements > 80%

Lance `npm run test:coverage`, examine rapport.

## Bonnes pratiques

**Do's :**

- Test AVANT code TOUJOURS
- Un test à la fois (RED → GREEN → REFACTOR)
- Tests descriptifs (noms clairs)
- Isolés, indépendants
- Edge cases (null, undefined, limites)
- Rapides (< 100ms idéal)

**Don'ts :**

- Pas de code avant test
- Pas de tests trop larges
- Pas de tests fragiles (timing, random)
- Pas de RED ignoré (test inutile)
- Pas de .skip tests

## Workflow

1. **Requirement :** Cas normaux + edge cases
2. **Test RED :** Doit échouer
3. **Code GREEN :** Minimum pour passer
4. **REFACTOR :** Améliorer, tests verts
5. **Répéter :** Couverture > 80%

## Checklist

- [ ] Test écrit AVANT code
- [ ] Test échoue (RED)
- [ ] Code minimum
- [ ] Test passe (GREEN)
- [ ] Refactorisé si besoin
- [ ] Noms descriptifs
- [ ] AAA pattern
- [ ] Mocks isolent
- [ ] Edge cases
- [ ] Couverture > 80%
- [ ] Tests rapides

## En cas de doute

**Règles absolues :**

1. Cycle RED → GREEN → REFACTOR OBLIGATOIRE
2. Test doit échouer d'abord (sinon inutile)
3. Code minimum (pas sur-engineering)
4. Refactor après GREEN seulement
5. Tests restent verts après refactor
6. Couverture > 80%

**Références :**

- Tests existants patterns
- jest.config.cjs - Configuration
- npm run test:coverage - État actual
