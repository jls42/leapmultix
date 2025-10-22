---
name: 'Dependency Management'
description: 'Gestion des dépendances npm (audit, mises à jour, breaking changes, lockfile). Utiliser avant release, après ajout packages, ou mensuellement pour maintenance'
---

# Dependency Management

Cette skill automatise la gestion sécurisée et efficace des dépendances npm pour maintenir le projet à jour, sécurisé, et sans vulnerabilities.

## Quand utiliser cette skill

- Avant chaque release en production
- Après ajout de nouvelles dépendances (`npm install package`)
- Mensuellement pour maintenance proactive
- Quand `npm audit` signale des vulnérabilités
- Après reception de notifications Dependabot/Snyk
- Lors de migrations vers nouvelles versions majeurs

## Workflows de gestion des dépendances

### 1. Audit de sécurité des dépendances

**Commande principale:**

```bash
# Audit standard (affiche vulnérabilités)
npm audit

# Audit avec rapport JSON détaillé
npm audit --json > audit-report.json

# Audit avec sortie lisible formatée
npm audit --audit-level=moderate

# Fix automatique (patch/minor versions uniquement)
npm audit fix

# Fix avec breaking changes (ATTENTION: tester après!)
npm audit fix --force
```

**Niveaux de sévérité:**

```
Critical (🔴 BLOCKER)  → Fix immédiatement avant toute release
High (🔴 HIGH)         → Fix avant release
Moderate (🟡 MEDIUM)   → Fix dans la semaine
Low (🟢 LOW)           → Fix quand possible
```

**Exemple de sortie:**

```
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ High          │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ minimatch                                                     │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=3.0.5                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > @jest/core > jest-config > glob > minimatch│
└───────────────┴──────────────────────────────────────────────────────────────┘
```

**Workflow de résolution:**

```bash
# 1. Identifier le problème
npm audit

# 2. Voir le fix disponible
npm audit fix --dry-run

# 3. Appliquer le fix (safe: patch/minor)
npm audit fix

# 4. Si fix impossible automatiquement
npm update minimatch --depth 10  # Update deep dependency

# 5. Vérifier que fix a fonctionné
npm audit

# 6. Tester l'application
npm test && npm run verify

# 7. Commit le package-lock.json
git add package-lock.json
git commit -m "fix: update minimatch to 3.0.5 (CVE-XXXX)"
```

### 2. Vérification des packages outdated

**Identifier les mises à jour disponibles:**

```bash
# Liste des packages avec mises à jour disponibles
npm outdated

# Sortie en JSON
npm outdated --json
```

**Exemple de sortie:**

```
Package        Current  Wanted  Latest  Location
eslint         8.45.0   8.57.0  9.0.0   leapmultix
jest           29.5.0   29.7.0  29.7.0  leapmultix
prettier       2.8.8    2.8.8   3.2.0   leapmultix
```

**Interprétation:**

- **Current**: Version actuellement installée
- **Wanted**: Version maximale selon `package.json` semver (^, ~)
- **Latest**: Dernière version publiée sur npm
- **Différence Wanted/Latest**: Breaking change (major version)

**Stratégie de mise à jour:**

```bash
# 1. Updates safe (Wanted = Latest, patch/minor)
npm update

# 2. Updates avec breaking changes (manual)
npm install eslint@latest  # Major version upgrade
npm test                   # Vérifier que rien n'est cassé

# 3. Si tests échouent, consulter CHANGELOG
# https://github.com/eslint/eslint/blob/main/CHANGELOG.md
```

### 3. Update automatisé avec npm-check-updates

**Installation:**

```bash
npm install -g npm-check-updates
```

**Commandes:**

```bash
# Voir toutes les mises à jour disponibles (incluant breaking changes)
ncu

# Update package.json (sans installer)
ncu -u

# Update selectif (packages spécifiques)
ncu -u eslint jest

# Update en ignorant certains packages
ncu -u --reject react,react-dom

# Update interactif (choisir package par package)
ncu -i

# Après update de package.json, installer
npm install
```

**Workflow recommandé:**

```bash
# 1. Backup avant update majeur
git add -A
git commit -m "chore: backup before dependency updates"

# 2. Voir ce qui va changer
ncu

# 3. Update package.json
ncu -u

# 4. Installer nouvelles versions
npm install

# 5. Tester
npm run lint
npm test
npm run verify

# 6. Si échec, revert et update graduellement
git reset --hard HEAD~1
ncu -u eslint  # Update 1 package à la fois
npm install
npm test
```

### 4. Gestion du package-lock.json

**Importance du lockfile:**

✅ **Reproduit installations identiques** (CI/CD, autres devs)
✅ **Sécurité**: Freeze exact versions (évite attaques supply chain)
✅ **Performance**: npm ci 2-10x plus rapide que npm install

**Best practices:**

```bash
# ✅ TOUJOURS committer package-lock.json
git add package-lock.json
git commit -m "chore: update dependencies"

# ✅ Utiliser npm ci en CI/CD (plus rapide, strict)
npm ci  # Fail si package-lock.json out-of-sync

# ✅ Régénérer lockfile si corrompu
rm package-lock.json
npm install

# ❌ JAMAIS ignorer package-lock.json dans .gitignore
# ❌ JAMAIS edit manuellement package-lock.json
```

**Résoudre conflits Git sur package-lock.json:**

```bash
# Méthode 1: Régénérer depuis package.json
git checkout --theirs package.json  # Prendre leur version
rm package-lock.json
npm install
git add package-lock.json package.json
git commit -m "chore: resolve dependency conflict"

# Méthode 2: Accepter une version et update
git checkout --ours package-lock.json
npm install  # Sync avec package.json
```

## Stratégies de versioning Semver

### Comprendre Semver (Semantic Versioning)

**Format: MAJOR.MINOR.PATCH** (ex: `2.8.4`)

- **MAJOR**: Breaking changes (API change, incompatible)
- **MINOR**: Nouvelles features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

**Symboles dans package.json:**

```json
{
  "dependencies": {
    "exact": "2.8.4", // ✅ Exact version (très strict)
    "caret": "^2.8.4", // ✅ Allow MINOR + PATCH (2.x.x, pas 3.0.0)
    "tilde": "~2.8.4", // ✅ Allow PATCH only (2.8.x, pas 2.9.0)
    "range": ">=2.8.4 <3.0.0", // Range explicite
    "latest": "*" // ❌ DANGEREUX: accepte tout (supply chain risk)
  }
}
```

**Recommandations pour leapmultix:**

```json
{
  "dependencies": {
    // Production: Caret (allow minor updates)
    "core-js": "^3.30.0"
  },
  "devDependencies": {
    // Dev tools: Caret (allow minor updates)
    "eslint": "^8.45.0",
    "jest": "^29.5.0",

    // Tools sensibles: Tilde (patch only)
    "prettier": "~2.8.8" // Formatting doit être consistent
  }
}
```

## Dependabot / Renovate Configuration

### GitHub Dependabot

**Fichier `.github/dependabot.yml`:**

```yaml
version: 2
updates:
  - package-ecosystem: 'npm'
    directory: '/leapmultix'
    schedule:
      interval: 'weekly' # Vérifier chaque lundi
      day: 'monday'
      time: '06:00'
    open-pull-requests-limit: 5
    reviewers:
      - 'your-username'
    assignees:
      - 'your-username'
    commit-message:
      prefix: 'chore(deps)'
      include: 'scope'
    groups:
      # Grouper updates dev dependencies
      dev-dependencies:
        patterns:
          - 'eslint*'
          - 'prettier'
          - 'jest*'
          - '@types/*'
      # Grouper updates minor/patch
      production-dependencies:
        patterns:
          - '*'
        update-types:
          - 'minor'
          - 'patch'
    ignore:
      # Ignorer certains packages (si raison valide)
      - dependency-name: 'some-package'
        versions: ['4.x'] # Skip version 4.x (breaking)
```

**Review checklist pour PR Dependabot:**

- [ ] CHANGELOG lu (breaking changes?)
- [ ] Tests CI passent (green)
- [ ] Version upgrade reasonable (pas 10 major versions d'un coup)
- [ ] Pas de security advisory sur nouvelle version
- [ ] Approve & merge si tout OK

### Renovate (alternative plus flexible)

**Fichier `renovate.json`:**

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:base"],
  "packageRules": [
    {
      "matchUpdateTypes": ["minor", "patch"],
      "automerge": true,
      "automergeType": "pr",
      "requiredStatusChecks": ["test", "lint"]
    },
    {
      "matchUpdateTypes": ["major"],
      "automerge": false,
      "labels": ["breaking-change"]
    }
  ],
  "schedule": ["before 6am on monday"],
  "timezone": "Europe/Paris",
  "prConcurrentLimit": 3
}
```

## Detecting Unused Dependencies

### Commande npm existante

```bash
# Déjà configuré dans leapmultix
npm run analyze:dependencies

# Ou directement
npx depcheck
```

**Sortie exemple:**

```
Unused dependencies
* unused-package
* old-library

Missing dependencies (utilisées mais pas dans package.json)
* missing-package
```

**Actions:**

```bash
# Supprimer packages inutilisés
npm uninstall unused-package old-library

# Ajouter packages manquants
npm install missing-package
```

### Outil avancé: depcheck

**Installation:**

```bash
npm install -g depcheck
```

**Configuration `.depcheckrc.json`:**

```json
{
  "ignoreDirs": ["dist", "coverage", "node_modules"],
  "ignoreMatches": [
    "@types/*", // Types TypeScript (utilisés compilation)
    "eslint-*" // Plugins ESLint (utilisés config)
  ],
  "parsers": {
    "*.js": "es6",
    "*.mjs": "es6"
  },
  "specials": ["eslint", "prettier", "jest"]
}
```

**Exécuter:**

```bash
# Analyse standard
depcheck

# JSON output (pour CI)
depcheck --json

# Ignorer false positives
depcheck --ignores="eslint-config-*,@types/*"
```

## Security Scanning Avancé

### Snyk (alternative à npm audit)

**Installation:**

```bash
npm install -g snyk
snyk auth  # Login avec compte Snyk
```

**Commandes:**

```bash
# Scan vulnerabilities
snyk test

# Scan avec fix suggestions
snyk test --severity-threshold=high

# Monitor projet (dashboard web)
snyk monitor

# Fix automatique
snyk fix
```

**Avantages Snyk vs npm audit:**

- ✅ Database vulnérabilités plus complète
- ✅ Scan transitive dependencies (deep)
- ✅ Suggestions fixes plus intelligentes
- ✅ Dashboard web avec trends

### OWASP Dependency-Check

**Pour audits très approfondis (optionnel):**

```bash
# Installation
npm install -g @owasp/dependency-check

# Scan
dependency-check --project leapmultix --scan ./leapmultix

# Rapport HTML généré
open dependency-check-report.html
```

## Checklist de maintenance des dépendances

### Hebdomadaire (automatisé)

- [ ] Review Dependabot PRs (si configuré)
- [ ] Merge minor/patch updates après CI green

### Mensuelle (manuel)

- [ ] `npm audit` → Fix Critical/High vulnerabilities
- [ ] `npm outdated` → Review packages avec updates disponibles
- [ ] `npm run analyze:dependencies` → Supprimer unused packages
- [ ] Update 1-2 major versions si breaking changes gérables

### Avant chaque release

- [ ] `npm audit --audit-level=moderate` → 0 vulnérabilités Medium+
- [ ] `npm outdated` → Pas de packages > 6 mois outdated
- [ ] `npm test && npm run verify` → Tous les tests passent
- [ ] `package-lock.json` commité et à jour

### Annuelle (major updates)

- [ ] Migrer Node.js vers LTS actuelle (ex: 18.x → 20.x)
- [ ] Migrer major versions (ESLint 8 → 9, Jest 29 → 30)
- [ ] Review et cleanup dependencies inutilisées accumulées

## Workflows npm recommandés

**Ajouter à `package.json`:**

```json
{
  "scripts": {
    "deps:audit": "npm audit --audit-level=moderate",
    "deps:audit:fix": "npm audit fix",
    "deps:outdated": "npm outdated",
    "deps:update": "npm update",
    "deps:update:major": "ncu -u && npm install",
    "deps:unused": "npx depcheck",
    "deps:clean": "rm -rf node_modules package-lock.json && npm install",
    "deps:check": "npm run deps:audit && npm run deps:outdated && npm run deps:unused"
  }
}
```

**Usage:**

```bash
# Check complet dépendances (audit + outdated + unused)
npm run deps:check

# Update safe (patch/minor)
npm run deps:update

# Update avec breaking changes (attention!)
npm run deps:update:major
npm test  # Vérifier que rien n'est cassé
```

## Breaking Changes - Guide de migration

### Identifier breaking changes

**1. Consulter CHANGELOG:**

```bash
# Exemple: ESLint 8 → 9
# https://github.com/eslint/eslint/blob/main/CHANGELOG.md

# Lire sections BREAKING CHANGES
```

**2. Utiliser npm-diff:**

```bash
# Voir différences entre versions
npm diff eslint@8.45.0 eslint@9.0.0
```

**3. Tester graduellement:**

```bash
# Branch de test
git checkout -b test/eslint-v9

# Update
npm install eslint@9.0.0

# Tests
npm run lint  # Voir les nouvelles erreurs
npm test      # Vérifier que tests passent

# Si OK: merge. Si KO: investigate ou postpone
```

### Exemples de breaking changes courants

**ESLint config flat (v9):**

```javascript
// eslint.config.js (nouveau format v9)
export default [
  {
    files: ['**/*.js'],
    rules: {
      'no-console': 'warn',
    },
  },
];

// .eslintrc.js (ancien format v8, déprécié)
module.exports = {
  rules: {
    'no-console': 'warn',
  },
};
```

**Jest ESM support (v29):**

```json
// package.json
{
  "jest": {
    "extensionsToTreatAsEsm": [".js"],
    "moduleNameMapper": {
      "^(\\.{1,2}/.*)\\.js$": "$1"
    }
  }
}
```

**Prettier v3:**

```json
// .prettierrc (some options removed)
{
  "semi": false,
  "singleQuote": true,
  // "jsxBracketSameLine": true  // ❌ Removed in v3, use bracketSameLine
  "bracketSameLine": true // ✅ New option
}
```

## Integration avec autres Skills

- **@security-audit** - npm audit fait partie du security workflow
- **@code-quality** - Updates peuvent casser lint rules
- **@tdd-jest** - Tester après updates dépendances

## Expert Agents recommandés

- **@code-reviewer** - Review breaking changes impact
- **@debugger** - Investigation si update casse l'app
- **@web-research-specialist** - Recherche CHANGELOGs et migration guides

## Resources

- [npm audit documentation](https://docs.npmjs.com/cli/v9/commands/npm-audit)
- [Semantic Versioning](https://semver.org/)
- [Dependabot documentation](https://docs.github.com/en/code-security/dependabot)
- [Snyk documentation](https://docs.snyk.io/)
- [npm-check-updates](https://github.com/raineorshine/npm-check-updates)

## Voir aussi

- `.claude/skills/security-audit/` - Security scanning avec npm audit
- `package.json` - Configuration dépendances
- `package-lock.json` - Lockfile à committer
- `.github/dependabot.yml` - Config Dependabot (à créer si souhaité)
