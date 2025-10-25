---
name: 'code-quality'
description: 'Exécute les vérifications de qualité du code (format:check, ESLint, Jest) avant chaque commit selon les standards du projet leapmultix'
---

# Code Quality Gate

Garantit code respecte standards avant commit (format, lint, tests).

## Quand utiliser

- **TOUJOURS** avant chaque commit
- Avant créer PR
- Après modification JavaScript/CSS
- À la demande

## Workflow OBLIGATOIRE (séquence)

1. **Formatage (CRITIQUE) :**
   ```bash
   npm run format:check
   # Si ✗ → npm run format
   ```

2. **Linting :**
   ```bash
   npm run lint
   # Si ✗ → npm run lint:fix
   ```

3. **Tests :**
   ```bash
   npm test
   ```

4. **Couverture (recommandé) :**
   ```bash
   npm run test:coverage
   ```

**Ou tout-en-un :** `npm run verify` (lint + test + coverage)

## Standards essentiels

**JavaScript :**
- Pas variables inutilisées (supprime ou eslint-disable avec justification)
- Pas catch blocks vides (logger erreur)
- Utiliser security-utils pour DOM (`appendSanitizedHTML()`, `setSafeMessage()`)
- Complexité cognitive < 15 (découpe fonctions complexes)

**CSS :**
- Notation couleur moderne : `rgb(255 255 255 / 0.9)` pas `rgba(...)`

**Sécurité :**
- Jamais `innerHTML` données externes (utiliser security-utils)
- Scripts externes: `crossorigin="anonymous"`
- Integrity hashes bibliothèques (pas analytics, auto-update)
- Valider entrées externes

## ESLint suppressions

**Ligne :** `// eslint-disable-next-line rule -- Justification`

**Bloc :** `/* eslint-disable rule */ ... /* eslint-enable rule */`

**Règle :** Toujours justifier avec `--` pourquoi sécurisé/intentionnel.

## Scripts disponibles

- `npm test` - Tests
- `npm run test:watch` - Mode watch
- `npm run test:coverage` - Couverture
- `npm run verify:dead-code` - Code mort
- `npm run analyze:*` - Globals, jsdoc, dependencies

## Configuration

- `eslint.config.js` - Règles ESLint
- `.prettierrc` - Formatage
- `.stylelintrc.json` - CSS
- `jest.config.cjs` - Tests

## Conventions commit

- Impératif : "Fix", "Add", "Refactor"
- Concis, descriptif
- Jamais mentionner AI/assistants

## Checklist

- [ ] format:check passe
- [ ] lint passe
- [ ] tests passent
- [ ] coverage acceptable
- [ ] Pas console.log oubliés
- [ ] Pas variables inutilisées
- [ ] security-utils pour DOM
- [ ] Message descriptif
- [ ] Pas secrets/API keys

## En cas de doute

**Règles absolues :**
1. `npm run format:check` TOUJOURS d'abord
2. Ne JAMAIS committer si échec
3. Ne JAMAIS désactiver sans justification
4. Exécuter localement AVANT pusher

**Workflow minimal :**
```bash
npm run format:check && npm run lint && npm test
```

**Workflow complet :**
```bash
npm run verify
```

**Fichiers clés :**
- CLAUDE.md - Conventions
- eslint.config.js - Règles
- security-utils.js - DOM sécurisé
