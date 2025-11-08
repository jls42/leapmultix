---
name: generating-jsdoc
description: Automatically generates JSDoc documentation for ES6 modules with @param, @returns, @throws and examples. Use when adding functions, refactoring, or improving documentation
allowed-tools: Read, Write, Grep, Glob, Bash
---

# Générateur JSDoc

Génère documentation JSDoc pour modules ES6 (functions, classes, exports).

## Table des matières

- [Quand utiliser](#quand-utiliser)
- [Scripts npm](#scripts-npm)
- [Format JSDoc essentiel](#format-jsdoc-essentiel)
- [Patterns projet](#patterns-projet)
- [Workflow](#workflow)
- [Checklist](#checklist)
- [En cas de doute](#en-cas-de-doute)

## Quand utiliser

- Ajout fonctions ou classes
- Refactoring code
- Amélioration documentation
- Avant release
- Onboarding développeurs

## Scripts npm

- `npm run analyze:jsdoc` - Couverture JSDoc
- `npm run improve:jsdoc` - Améliorer documentation
- JSDoc HTML generation (si configuré)

## Format JSDoc essentiel

**Fonction :**

```javascript
/**
 * Description brève (impératif : "Calcule", pas "Cette fonction")
 *
 * @param {Type} paramName - Description
 * @param {Type} paramName2 - Description
 * @returns {Type} Description retour
 * @throws {ErrorType} Conditions erreur
 * @example
 * functionName(value1, value2); // → result
 */
```

**Classe :**

```javascript
/**
 * Description classe
 * @class
 * @extends ParentClass
 */
export class ClassName {}
```

**Types :** `string`, `number`, `boolean`, `Array<Type>`, `{key: Type}`, `Promise<Type>`, `Type1|Type2`

## Patterns projet

**Priorités :**

- Haute : API publiques, fonctions complexes, classes
- Moyenne : Méthodes, callbacks, utilitaires
- Basse : Fonctions privées simples, getters évidents

**Tags spéciaux :**

- `@typedef` - Définir types complexes
- `@fires` - Événements émis
- `@deprecated` - Code obsolète
- `@see {@link Name}` - Références croisées

Examine code existant (modes, utils, core) pour patterns.

## Workflow

1. **Analyser :** `npm run analyze:jsdoc` → Identifier gaps
2. **Documenter :** Description + @param + @returns + @example
3. **Enrichir :** Cas limites, erreurs (@throws)
4. **Vérifier :** Code cohérent, types précis, exemples du domaine

## Checklist

- [ ] Description brève et impérative
- [ ] @param pour chaque paramètre avec type précis
- [ ] @returns avec type et description
- [ ] @throws si erreurs possibles
- [ ] @example (au moins 1 cas réaliste)
- [ ] @typedef pour types complexes
- [ ] Types précis (pas {Object} générique)
- [ ] Exemples avec valeurs du domaine
- [ ] Cas limites documentés (null, undefined)
- [ ] Cohérent avec reste projet

## En cas de doute

**Règles absolues :**

1. Description impérative (imperative mood)
2. Types explicites (jamais {\*} sauf dernier recours)
3. Exemples du domaine (réalistes)
4. @example obligatoire pour API publiques
5. Maintenir à jour avec refactoring

**Références :**

- Code existant patterns (modes, utils)
- `npm run analyze:jsdoc` - Vérifier couverture
- JSDoc.app - Syntaxe spécifique
- Examiner fichiers bien documentés du projet
