---
name: 'Porte de Qualité'
description: 'Exécute toutes les vérifications de qualité (format, lint, tests, i18n, coverage). Utiliser avant commits, avant PRs, ou avant releases pour garantir la qualité'
---

# Porte de Qualité

Exécute vérifications de qualité pour garantir standards avant commit/merge/release.

## Quand utiliser

- Avant créer commit
- Avant créer PR
- Avant merger vers main
- Avant release
- En CI/CD pipeline

## Standards obligatoires

**MUST PASS :**
1. Formatage code (Prettier)
2. Linting (ESLint)
3. Tests unitaires (Jest)
4. Couverture ≥ 80% (Branches, Functions, Lines, Statements)
5. i18n synchronisé (fr.json, en.json, es.json)

**Recommandés :**
- Pas d'erreurs console
- Dead code vérifié
- Audit sécurité (`npm audit`)

## Scripts npm

Trouve et utilise :
- `npm run format:check` - Vérifier formatage
- `npm run format` - Formater automatiquement
- `npm run lint` - Linter
- `npm run lint:fix` - Auto-fix linting
- `npm test` ou `npm run verify` - Tests + coverage
- `npm run i18n:compare` - Synchronisation traductions
- `npm run dead-code` - Détection code mort

## Workflow séquentiel

1. **Format :** `npm run format:check`
   - Si ✗ : `npm run format` → commit changements
2. **Lint :** `npm run lint`
   - Si ✗ : `npm run lint:fix` ou corrige manuellement
3. **Tests :** `npm test`
   - Si ✗ : Identifier/corriger test échoué
4. **Coverage :** Vérifier rapport (≥ 80%)
   - Si < 80% : Ajouter tests manquants
5. **i18n :** `npm run i18n:compare`
   - Si désynchronisé : Ajouter clés manquantes
6. **Optionnels :** dead-code, audit

**Total : < 2 min**

## Gestion des échecs

| Problème | Solution |
|----------|----------|
| Format échoue | `npm run format` → commit |
| Lint auto-fixable | `npm run lint:fix` |
| Tests échouent | Debug test, corriger code |
| Coverage < 80% | Ajouter tests critiques |
| i18n désyncé | Ajouter clés manquantes |

## Checklist avant commit

- [ ] format:check ✅
- [ ] lint ✅
- [ ] tests ✅ (pas de .skip)
- [ ] coverage ≥ 80%
- [ ] i18n synchronisé
- [ ] console clean (pas de console.log)
- [ ] Code logiquement correct
- [ ] Commit message descriptif

## En cas de doute

**Règles absolues :**
1. Lancer TOUS les scripts avant commit
2. Ne JAMAIS bypass vérifications
3. Corriger erreurs une par une
4. Re-lancer quality gate jusqu'à 100% pass
5. CI/CD doit être vert avant merge

**Exécution rapide :**
```bash
npm run format:check && npm run lint && npm test
```

**Références :**
- Scripts npm (package.json)
- ESLint config (eslint.config.js)
- Prettier config (.prettierrc)
- Jest config (jest.config.cjs)
- CI/CD (.gitlab-ci.yml or .github/workflows)
