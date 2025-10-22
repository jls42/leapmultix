---
name: 'Quality Gate'
description: 'Exécute toutes les vérifications de qualité (format, lint, tests, i18n, coverage). Utiliser avant commits, avant PRs, ou avant releases pour garantir la qualité.'
---

# Quality Gate

Cette skill exécute un ensemble complet de vérifications de qualité pour garantir que le code respecte tous les standards du projet avant d'être commité ou mergé.

## Quand utiliser cette skill

- Avant de créer un commit (vérifier que tout passe)
- Avant de créer une Pull Request
- Avant de merger vers main
- Avant chaque release
- Quand l'utilisateur demande "verify", "check quality", "run quality checks"
- En CI/CD pipeline (automatisation)

## Standards de Qualité leapmultix

### Obligatoires (MUST PASS)

1. **✅ Code Formatting** - Prettier (`npm run format:check`)
2. **✅ Code Linting** - ESLint (`npm run lint`)
3. **✅ Unit Tests** - Jest (`npm test`)
4. **✅ Test Coverage** - Jest coverage ≥ 80% (`npm run test:coverage`)
5. **✅ i18n Synchronization** - Translation files sync (`npm run i18n:compare`)

### Recommandés (SHOULD PASS)

6. **🟡 No Console Errors** - Browser console clean
7. **🟡 No Dead Code** - Unused code detection (`npm run verify:dead-code`)
8. **🟡 Security Audit** - npm audit (`npm audit`)

## Workflow Quality Gate

### 1. Exécution Séquentielle

```bash
#!/bin/bash

# Quality Gate Script
# Exécute toutes les vérifications dans l'ordre

echo "🚀 Starting Quality Gate..."
echo ""

# 1. Format Check
echo "1️⃣ Checking code formatting..."
npm run format:check
if [ $? -ne 0 ]; then
  echo "❌ FAIL: Code formatting issues detected"
  echo "💡 Fix with: npm run format"
  exit 1
fi
echo "✅ PASS: Code formatting OK"
echo ""

# 2. Lint Check
echo "2️⃣ Running ESLint..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ FAIL: ESLint errors detected"
  echo "💡 Fix with: npm run lint:fix"
  exit 1
fi
echo "✅ PASS: ESLint OK"
echo ""

# 3. Tests
echo "3️⃣ Running tests..."
npm test
if [ $? -ne 0 ]; then
  echo "❌ FAIL: Tests failing"
  exit 1
fi
echo "✅ PASS: All tests passing"
echo ""

# 4. Coverage
echo "4️⃣ Checking test coverage..."
npm run test:coverage
COVERAGE=$(grep -o '"pct":[0-9.]*' coverage/coverage-summary.json | head -1 | grep -o '[0-9.]*')
if (( $(echo "$COVERAGE < 80" | bc -l) )); then
  echo "❌ FAIL: Coverage ${COVERAGE}% < 80%"
  exit 1
fi
echo "✅ PASS: Coverage ${COVERAGE}% ≥ 80%"
echo ""

# 5. i18n Sync
echo "5️⃣ Checking i18n synchronization..."
npm run i18n:compare
if [ $? -ne 0 ]; then
  echo "❌ FAIL: i18n files not synchronized"
  exit 1
fi
echo "✅ PASS: i18n files synchronized"
echo ""

# 6. Security Audit (warning only)
echo "6️⃣ Running security audit..."
npm audit --audit-level=moderate
if [ $? -ne 0 ]; then
  echo "⚠️  WARNING: Security vulnerabilities detected"
  echo "💡 Review with: npm audit"
else
  echo "✅ PASS: No security vulnerabilities"
fi
echo ""

echo "🎉 Quality Gate PASSED!"
echo "✅ Code is ready to commit/merge"
```

### 2. Rapport Consolidé

**Format du rapport:**

```
═══════════════════════════════════════
      QUALITY GATE REPORT
═══════════════════════════════════════

[1/5] Code Formatting.............. ✅ PASS
[2/5] ESLint....................... ✅ PASS
[3/5] Tests (135 suites)........... ✅ PASS
[4/5] Coverage (84.2%)............. ✅ PASS
[5/5] i18n Sync.................... ✅ PASS

═══════════════════════════════════════
Optional Checks:
[6] Security Audit................. ⚠️  2 moderate
[7] Dead Code...................... ✅ PASS

═══════════════════════════════════════
RESULT: ✅ QUALITY GATE PASSED
All mandatory checks successful!
═══════════════════════════════════════
```

## Vérifications Détaillées

### 1. Code Formatting (Prettier)

**Commande:**

```bash
npm run format:check
```

**Ce qui est vérifié:**

- JavaScript formatting (indentation, quotes, semicolons)
- JSON formatting (i18n files, package.json)
- Markdown formatting (README, docs)
- CSS formatting

**Si échec:**

```bash
# Voir quels fichiers sont mal formatés
npm run format:check

# Auto-fix
npm run format

# Re-vérifier
npm run format:check
```

**Exemple d'échec:**

```
Checking formatting...
js/arcade/multimiam-engine.js
i18n/fr.json
Code style issues found in 2 files. Run Prettier to fix.
```

### 2. ESLint

**Commande:**

```bash
npm run lint
```

**Ce qui est vérifié:**

- Code quality (complexity, unused vars, etc.)
- ES2022 syntax correctness
- Security patterns (eslint-plugin-security)
- Best practices

**Si échec:**

```bash
# Voir erreurs détaillées
npm run lint

# Auto-fix ce qui peut l'être
npm run lint:fix

# Fichiers restants à corriger manuellement
npm run lint
```

**Exemple d'échec:**

```
/js/arcade/multimiam-engine.js
  12:7  error  'powerUpType' is assigned but never used  no-unused-vars
  45:3  error  Unexpected console statement              no-console
  67:1  error  Function has complexity of 18 (max 15)    complexity

✖ 3 problems (3 errors, 0 warnings)
```

### 3. Tests (Jest)

**Commande:**

```bash
npm test
```

**Ce qui est vérifié:**

- Tous les tests unitaires passent
- Aucun test skip ou pending
- Pas de timeout

**Si échec:**

```bash
# Run avec détails
npm run test:verbose

# Run tests spécifiques
npm test -- multimiam

# Debug un test
npm test -- --watch
```

**Exemple d'échec:**

```
FAIL tests/__tests__/multimiam.test.js
  Multimiam
    ✓ should initialize correctly (5 ms)
    ✕ should collect power-ups (23 ms)

  ● Multimiam › should collect power-ups

    expect(received).toBe(expected) // Object.is equality

    Expected: 2
    Received: 0

Test Suites: 1 failed, 134 passed, 135 total
Tests:       1 failed, 534 passed, 535 total
```

### 4. Test Coverage

**Commande:**

```bash
npm run test:coverage
```

**Ce qui est vérifié:**

- Coverage global ≥ 80%
- Coverage par fichier ≥ 60% (souhaité)
- Branches, functions, lines, statements

**Si échec:**

```bash
# Voir rapport détaillé
npm run test:coverage
open coverage/lcov-report/index.html

# Identifier fichiers sous-couverts
grep -A 3 "File" coverage/lcov-report/index.html | grep "low"
```

**Exemple de rapport:**

```
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|-------------------
All files           |   84.2  |   78.5   |   82.1  |   84.5  |
 arcade/            |   91.3  |   85.2   |   89.7  |   91.8  |
  multimiam-engine  |   95.2  |   92.1   |   93.5  |   95.6  | 45-48,67-69
  multisnake        |   87.4  |   78.3   |   85.9  |   88.1  | 123-145
 components/        |   76.8  |   65.2   |   71.3  |   77.2  |
  dashboard         |   62.1  |   48.7   |   55.3  |   63.4  | 89-156
--------------------|---------|----------|---------|---------|-------------------
```

### 5. i18n Synchronization

**Commande:**

```bash
npm run i18n:compare
```

**Ce qui est vérifié:**

- fr.json = référence complète
- en.json synchronized avec fr.json
- es.json synchronized avec fr.json
- Pas de clés manquantes
- Pas de valeurs vides
- Cohérence des types (string vs array)

**Si échec:**

```bash
# Voir détails des clés manquantes
npm run i18n:compare

# Utiliser i18n-coordinator agent pour fix
```

**Exemple d'échec:**

```
❌ Clés manquantes dans en.json (5):
  - arcade.powerUp.speed
  - arcade.powerUp.invincibility
  - achievements.newBadge.title
  - achievements.newBadge.description
  - settings.notifications.sound

❌ Valeurs vides dans es.json (2):
  - common.loading (valeur: "")
  - common.retry (valeur: "")
```

### 6. Security Audit (Optional)

**Commande:**

```bash
npm audit --audit-level=moderate
```

**Ce qui est vérifié:**

- Dépendances vulnérables
- Severity: Critical, High, Moderate

**Si échec:**

```bash
# Voir détails
npm audit

# Auto-fix si possible
npm audit fix

# Fix avec breaking changes (attention)
npm audit fix --force
```

**Exemple d'échec:**

```
found 2 moderate severity vulnerabilities

Moderate  Regular Expression Denial of Service
Package   minimatch
Patched in >=3.0.5
Dependency of jest
Path      jest > ... > minimatch
More info https://github.com/advisories/GHSA-...

Run `npm audit fix` to fix them
```

## Modes d'Exécution

### Mode Strict (Avant Commit/PR)

**Tous les checks obligatoires DOIVENT passer:**

```bash
# Exécuter en mode strict
npm run verify

# Équivalent à:
npm run format:check && \
npm run lint && \
npm test && \
npm run test:coverage && \
npm run i18n:compare

# Si UN check échoue → BLOQUER
```

### Mode Relax (Développement)

**Checks informatifs uniquement:**

```bash
# Exécuter sans bloquer
npm run format:check || true
npm run lint || true
npm test || true

# Afficher rapport mais ne pas exit 1
```

### Mode Quick (Fast Feedback)

**Checks essentiels uniquement:**

```bash
# Format + Lint uniquement (rapide)
npm run format:check && npm run lint

# Tests uniquement
npm test

# Sans coverage (plus rapide)
```

## Intégration CI/CD

### GitHub Actions

```yaml
# .github/workflows/quality-gate.yml
name: Quality Gate

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  quality-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - name: Format Check
        run: npm run format:check
      - name: Lint
        run: npm run lint
      - name: Tests
        run: npm test
      - name: Coverage
        run: npm run test:coverage
      - name: i18n Sync
        run: npm run i18n:compare
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

### GitLab CI

```yaml
# .gitlab-ci.yml
quality-gate:
  stage: test
  script:
    - npm ci
    - npm run format:check
    - npm run lint
    - npm test
    - npm run test:coverage
    - npm run i18n:compare
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
```

## Auto-Fix Workflow

**Workflow complet d'auto-fix:**

```bash
#!/bin/bash
# Script: auto-fix-quality.sh

echo "🔧 Auto-fixing quality issues..."

# 1. Format
echo "Formatting code..."
npm run format

# 2. Lint auto-fix
echo "Fixing lint issues..."
npm run lint:fix

# 3. Stage auto-fixed files
echo "Staging auto-fixed files..."
git add -u

# 4. Re-verify
echo "Re-running quality gate..."
npm run format:check && \
npm run lint && \
npm test && \
npm run test:coverage && \
npm run i18n:compare

if [ $? -eq 0 ]; then
  echo "✅ All quality checks passed after auto-fix!"
else
  echo "❌ Some issues remain - manual fix required"
  exit 1
fi
```

## Cas d'Usage Spécifiques

### Cas 1: Avant Commit

```bash
# User: "I want to commit my changes"

# 1. Run quality gate
npm run verify

# 2. Si PASS → Commit
git add .
git commit -m "feat(arcade): add power-up system"

# 3. Si FAIL → Fix d'abord
npm run format        # Fix formatting
npm run lint:fix      # Fix lint
# Fix tests manuellement
npm run verify        # Re-verify
```

### Cas 2: Avant PR

```bash
# User: "Create a PR"

# 1. Quality gate obligatoire
npm run verify

# 2. Si PASS → Créer PR
gh pr create --title "..." --body "..."

# 3. Si FAIL → Ne PAS créer PR
echo "❌ Quality gate failed - fix issues before creating PR"
```

### Cas 3: Debugging Failed Check

```bash
# User: "Why is the quality gate failing?"

# 1. Run each check individually
npm run format:check  # Check 1
npm run lint          # Check 2
npm test              # Check 3
npm run test:coverage # Check 4
npm run i18n:compare  # Check 5

# 2. Identifier quel check échoue
# 3. Fournir fix suggestion spécifique
```

## Rapport d'Échec Détaillé

**Quand quality gate échoue, fournir:**

```
❌ QUALITY GATE FAILED

Failed Checks:
--------------
[2/5] ESLint...................... ❌ FAIL (3 errors)
      → js/arcade/multimiam-engine.js:12:7 - unused variable 'powerUpType'
      → js/arcade/multimiam-engine.js:45:3 - console.log statement
      → js/arcade/multimiam-engine.js:67:1 - complexity 18 > 15

[4/5] Coverage.................... ❌ FAIL (76.2% < 80%)
      → js/components/dashboard.js - 62.1% (need 80%)
      → js/arcade/multisnake.js - 73.4% (need 80%)

Suggested Fixes:
----------------
1. ESLint: Run `npm run lint:fix` to auto-fix
2. Coverage: Add tests for dashboard.js and multisnake.js

Commands to Fix:
----------------
npm run lint:fix
# Then add tests manually
npm test
```

## Integration avec autres Skills

- **@commit-helper** - Exécuter quality-gate avant commit
- **@pr-creator** - Exécuter quality-gate avant PR
- **@tdd-jest** - Tests font partie du quality gate
- **@i18n-sync** - i18n check fait partie du quality gate
- **@security-audit** - Security audit optionnel dans quality gate

## Expert Agents recommandés

- **@code-reviewer** - Si quality gate échoue, review pour comprendre pourquoi
- **@test-writer** - Si coverage insuffisant, générer tests
- **@i18n-coordinator** - Si i18n:compare échoue, fix synchronisation

## Scripts npm

```json
{
  "scripts": {
    "verify": "npm run format:check && npm run lint && npm test && npm run test:coverage && npm run i18n:compare",
    "verify:quick": "npm run format:check && npm run lint && npm test",
    "format:check": "prettier --check \"**/*.{js,json,md,css}\"",
    "format": "prettier --write \"**/*.{js,json,md,css}\"",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "i18n:compare": "node scripts/compare-translations.cjs"
  }
}
```

## Voir aussi

- `.claude/skills/commit-helper/` - Commit après quality gate
- `.claude/skills/pr-creator/` - PR après quality gate
- `.claude/skills/tdd-jest/` - Tests TDD
- `.claude/skills/security-audit/` - Security checks détaillés
- `CLAUDE.md` - Quality standards du projet
