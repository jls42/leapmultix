---
name: managing-dependencies
description: Manages npm dependencies (audit, updates, breaking changes, lockfile). Use before releases, after adding packages, or monthly for maintenance
allowed-tools: Read, Grep, Glob, Bash
---

# Gestion des Dépendances

Gère dépendances npm de manière sécurisée (audit, mises à jour, lockfile).

## Table des matières

- [Quand utiliser](#quand-utiliser)
- [Scripts npm](#scripts-npm)
- [Workflows essentiels](#workflows-essentiels)
- [Gestion vulnérabilités](#gestion-vulnérabilités)
- [Migrations majeures](#migrations-majeures)
- [Bonnes pratiques](#bonnes-pratiques)
- [Checklist](#checklist)
- [En cas de doute](#en-cas-de-doute)

## Quand utiliser

- Avant chaque release production
- Après ajout nouvelles dépendances
- Mensuellement maintenance proactive
- Quand vulnérabilités signalées
- Migrations versions majeures

## Scripts npm

- `npm audit` - Vue d'ensemble sécurité
- `npm audit --json` - Rapport détaillé
- `npm audit fix` - Fix auto (patch/minor)
- `npm outdated` - Packages à mettre à jour
- `npm update` - Update patches/minors
- `npm ls` / `npm ls --depth=0` - Arbre dépendances

## Workflows essentiels

**Audit sécurité :**

- CRITICAL/HIGH → Corriger immédiatement
- MODERATE → Corriger avant release
- LOW → Corriger quand possible

**Types mises à jour (SemVer) :**

- Patch (1.0.x) → Bugs, sécurisé
- Minor (1.x.0) → Features, rétrocompatible
- Major (x.0.0) → Breaking, nécessite tests

**Stratégie :**

- Patches → Auto si tests passent
- Minors → Manuel vérification
- Majors → Manuel migration plan

**Lockfile :**

- Garantit versions exactes
- Commit toujours avec package.json
- Désynchronisé → `npm install`
- Conflit merge → Résoudre + `npm install`

## Gestion vulnérabilités

**Critiques/Hautes :** Fix immédiat, tester, déployer rapidement

**Sans fix :** Package alternatif, fork + patch, monitorer, désactiver si possible

**Packages deprecated :** Chercher alternatives maintenues, planifier migration

## Migrations majeures

**Préparation :**

1. Lire CHANGELOG (breaking changes)
2. Estimer impact code
3. Créer branche dédiée

**Exécution :**

1. Update package.json
2. Adapter code aux breaking changes
3. Corriger erreurs TS/ESLint
4. Tests exhaustifs

**Validation :**

- Tests passent
- Lighthouse score OK
- Performance stable
- Pas régressions visuelles

## Bonnes pratiques

**Do's :**

- Commit lockfile toujours
- Audit hebdomadaire minimum
- Tests après update
- Un update à la fois
- Lire CHANGELOG majors
- Respecter SemVer

**Don'ts :**

- Pas `npm install --force` (sauf urgence)
- Pas updates aveugles
- Pas lockfile .gitignore
- Pas updates avant release
- Pas dépendances non maintenues

## Checklist

- [ ] `npm audit` sans CRITICAL/HIGH
- [ ] `npm outdated` vérifié
- [ ] Lockfile synchronisé
- [ ] Tests passent après update
- [ ] Build OK
- [ ] Performance stable
- [ ] Pas deprecated packages
- [ ] CHANGELOG lu (majors)
- [ ] Lockfile committé

## En cas de doute

**Règles absolues :**

1. `npm audit` AVANT release obligatoire
2. Tester APRÈS mise à jour
3. Jamais ignorer lockfile
4. CHANGELOG pour majors
5. CRITICAL/HIGH fix immédiat

**Workflow mensuel :**

```bash
npm outdated
npm audit
npm update
npm test
```

**Workflow avant release :**

```bash
npm audit --audit-level=moderate
npm outdated
npm test
npm run build
```

**Références :**

- package.json - Versions actuelles
- package-lock.json - Lockfile
- npm docs - Documentation
