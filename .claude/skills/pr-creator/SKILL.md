---
name: 'PR Creator'
description: "Crée des Pull Requests GitHub avec descriptions détaillées générées depuis les commits. Utiliser quand l'utilisateur veut créer une PR après avoir commité des changements."
---

# PR Creator

Cette skill automatise la création de Pull Requests GitHub avec des descriptions structurées et des test plans, en analysant les commits de la branche actuelle.

## Quand utiliser cette skill

- Quand l'utilisateur demande de "create a PR", "créer une PR", "make a pull request"
- Après avoir commité plusieurs changements sur une feature branch
- Quand une feature est terminée et prête pour review
- Avant de merger une branche vers main

## Prérequis

**GitHub CLI (gh) doit être installé et configuré:**

```bash
# Installer gh (si pas déjà fait)
# macOS
brew install gh

# Linux
sudo apt install gh

# Authentifier
gh auth login
```

## Workflow de Création de PR

### 1. Vérifier l'état de la branche

```bash
# Branche actuelle
git branch --show-current

# Vérifier qu'on n'est PAS sur main
if [ "$(git branch --show-current)" = "main" ]; then
  echo "❌ Error: Cannot create PR from main branch"
  exit 1
fi

# Vérifier que la branche est pushed
git status
```

### 2. Analyser les commits

```bash
# Tous les commits depuis main
git log main...HEAD --oneline

# Diff complet depuis main
git diff main...HEAD --stat

# Fichiers modifiés
git diff main...HEAD --name-only
```

### 3. Générer le titre de la PR

**Règles pour le titre:**

- Si 1 seul commit: Utiliser le message du commit
- Si multiples commits similaires: Généraliser
- Format: Type(scope): Description
- Maximum 72 caractères

**Exemples:**

```bash
# 1 commit
git log main...HEAD --oneline
# → feat(arcade): add power-up system to Multimiam
PR Title: feat(arcade): add power-up system to Multimiam

# Multiples commits sur même feature
git log main...HEAD --oneline
# → feat(arcade): add power-up logic
# → feat(arcade): add power-up rendering
# → feat(arcade): add power-up UI
PR Title: feat(arcade): implement power-up system

# Multiples commits différents
git log main...HEAD --oneline
# → fix(arcade): collision detection
# → fix(ui): modal closing
# → refactor: utils cleanup
PR Title: Multiple improvements (arcade, ui, refactor)
```

### 4. Générer la description de la PR

**Format standard:**

```markdown
## Summary

[1-3 bullet points résumant les changements]

## Changes

[Liste détaillée des changements par catégorie]

## Test Plan

- [ ] [Étape de test 1]
- [ ] [Étape de test 2]
- [ ] [Étape de test 3]

## Screenshots

[Si applicable - changements visuels]
```

**Exemple complet:**

```markdown
## Summary

- Add power-up system to Multimiam game
- Implement speed boost and invincibility power-ups
- Add i18n support for power-up names

## Changes

### Arcade (`js/arcade/`)

- **multimiam-engine.js**: Add power-up collection logic and effects
- **multimiam-renderer.js**: Implement power-up visual rendering
- **multimiam-ui.js**: Add power-up status indicators

### Internationalization (`i18n/`)

- **fr.json**: Add French translations for power-ups
- **en.json**: Add English translations for power-ups
- **es.json**: Add Spanish translations for power-ups

### Tests (`tests/`)

- **multimiam.test.js**: Add power-up collection tests

## Test Plan

- [ ] Start Multimiam game
- [ ] Collect speed boost power-up
- [ ] Verify speed increase works correctly
- [ ] Collect invincibility power-up
- [ ] Verify invincibility effect
- [ ] Check i18n translations display correctly (fr/en/es)
- [ ] Verify all tests pass (`npm test`)
- [ ] Verify lint passes (`npm run lint`)

## Screenshots

[Add screenshots of power-ups in action]
```

### 5. Déterminer la base branch

**Par défaut: main**

```bash
# Vérifier que main existe
git branch -a | grep main

# Si pas de main, chercher master
git branch -a | grep master

# Utiliser la branche par défaut
BASE_BRANCH="main"  # ou "master"
```

### 6. Créer la PR avec gh CLI

```bash
# Basique (avec description générée)
gh pr create \
  --base main \
  --title "feat(arcade): implement power-up system" \
  --body "$(cat <<'EOF'
## Summary

- Add power-up system to Multimiam game
- Implement speed boost and invincibility power-ups

## Test Plan

- [ ] Test power-up collection
- [ ] Verify effects work correctly
- [ ] Run `npm test`
EOF
)"

# Avec options avancées
gh pr create \
  --base main \
  --title "feat(arcade): implement power-up system" \
  --body "..." \
  --label "enhancement" \
  --label "arcade" \
  --draft  # Si PR en cours de développement
```

### 7. Vérifier la PR créée

```bash
# Voir la PR
gh pr view

# Ouvrir dans le navigateur
gh pr view --web
```

## Génération Automatique du Body

### Analyser les commits par catégorie

```javascript
// Grouper commits par type
const commits = getCommits(); // git log main...HEAD

const grouped = {
  feat: [],
  fix: [],
  refactor: [],
  test: [],
  chore: [],
  docs: [],
};

commits.forEach(commit => {
  const match = commit.match(/^(feat|fix|refactor|test|chore|docs)\(/);
  if (match) {
    grouped[match[1]].push(commit);
  }
});
```

### Générer la section Summary

```javascript
// Extraire les points clés
const summary = [];

// Features
if (grouped.feat.length > 0) {
  grouped.feat.forEach(commit => {
    const desc = commit.replace(/^feat\([^)]+\):\s*/, '');
    summary.push(`- ${capitalize(desc)}`);
  });
}

// Fixes
if (grouped.fix.length > 0) {
  summary.push(`- Fix ${grouped.fix.length} bug(s)`);
}

// Maximum 3-4 bullet points
return summary.slice(0, 4);
```

### Générer la section Changes

```bash
# Lister fichiers modifiés par catégorie
git diff main...HEAD --name-only | sort

# Grouper par dossier
js/arcade/     → Arcade Games
js/components/ → UI Components
js/core/       → Core System
i18n/          → Internationalization
tests/         → Tests
```

### Générer la section Test Plan

```javascript
// Basé sur les changements
const testPlan = [];

// Si arcade modifié
if (files.some(f => f.includes('arcade'))) {
  testPlan.push('- [ ] Test affected arcade games');
  testPlan.push('- [ ] Verify 60 FPS performance maintained');
}

// Si i18n modifié
if (files.some(f => f.includes('i18n'))) {
  testPlan.push('- [ ] Test language switching (fr/en/es)');
  testPlan.push('- [ ] Run `npm run i18n:compare`');
}

// Si tests modifiés
if (files.some(f => f.includes('test'))) {
  testPlan.push('- [ ] Verify all tests pass (`npm test`)');
  testPlan.push('- [ ] Check coverage meets 80% threshold');
}

// Toujours
testPlan.push('- [ ] Run `npm run verify` (lint + test + coverage)');
testPlan.push('- [ ] Check no console errors in browser');
```

## Cas d'Usage Spécifiques

### Cas 1: Feature Branch Simple

**Commits:**

```bash
feat(arcade): add power-up collection logic
feat(arcade): add power-up rendering
test(arcade): add power-up tests
```

**PR générée:**

```markdown
**Title:** feat(arcade): implement power-up system

**Body:**

## Summary

- Add power-up collection logic to Multimiam
- Implement visual rendering of power-ups
- Add comprehensive test coverage

## Changes

### Arcade Games

- `js/arcade/multimiam-engine.js`: Power-up collection logic
- `js/arcade/multimiam-renderer.js`: Power-up rendering

### Tests

- `tests/__tests__/multimiam.test.js`: Power-up tests

## Test Plan

- [ ] Start Multimiam game
- [ ] Collect different power-ups
- [ ] Verify effects work correctly
- [ ] Run `npm test` and verify all tests pass
- [ ] Run `npm run verify`
```

### Cas 2: Bug Fix Branch

**Commits:**

```bash
fix(arcade): correct snake wall collision detection
test(arcade): add regression tests for collision
```

**PR générée:**

```markdown
**Title:** fix(arcade): correct snake wall collision detection

**Body:**

## Summary

- Fix snake passing through walls bug
- Add regression tests to prevent future issues

## Changes

### Arcade Games

- `js/arcade/multisnake.js`: Fix collision detection algorithm

### Tests

- `tests/__tests__/multisnake.test.js`: Add collision regression tests

## Test Plan

- [ ] Play Multisnake game
- [ ] Try to pass through walls (should not work)
- [ ] Verify collision detection works at different speeds
- [ ] Run `npm test` and verify all tests pass
```

### Cas 3: Multiple Changes (Mixed Types)

**Commits:**

```bash
feat(i18n): add Italian language support
fix(ui): modal backdrop click behavior
refactor(storage): simplify LocalStorage abstraction
test: increase test coverage to 85%
```

**PR générée:**

```markdown
**Title:** Multiple improvements (i18n, ui, storage, tests)

**Body:**

## Summary

- Add Italian language support
- Fix modal backdrop click behavior
- Simplify LocalStorage abstraction
- Increase test coverage to 85%

## Changes

### Internationalization

- `i18n/it.json`: Add Italian translations
- `js/i18n.js`: Add Italian language option

### UI Components

- `js/components/modal.js`: Fix backdrop click event handling

### Core System

- `js/core/storage.js`: Simplify API and reduce complexity

### Tests

- Multiple test files: Increase coverage across the board

## Test Plan

- [ ] Test language switching including new Italian option
- [ ] Test modal backdrop click (should not close)
- [ ] Verify storage still works correctly after refactor
- [ ] Run `npm test` and verify 85%+ coverage
- [ ] Run `npm run verify`
```

## Gestion des Erreurs

### Si branche pas pushed

```bash
# Push la branche d'abord
git push -u origin $(git branch --show-current)

# Puis créer PR
gh pr create ...
```

### Si gh CLI pas authentifié

```bash
# Authentifier
gh auth login

# Suivre les instructions
```

### Si PR existe déjà

```bash
# Vérifier PRs existantes
gh pr list

# Voir détails de la PR existante
gh pr view

# Update la PR existante au lieu d'en créer une nouvelle
gh pr edit --body "nouvelle description"
```

## Options Avancées gh CLI

```bash
# PR en draft (work in progress)
gh pr create --draft

# Ajouter labels
gh pr create --label "enhancement" --label "arcade"

# Assigner reviewers
gh pr create --reviewer username1,username2

# Assigner à soi-même
gh pr create --assignee @me

# Milestone
gh pr create --milestone v1.5.0

# Ouvrir dans le navigateur après création
gh pr create --web
```

## Workflow Complet (Exemple)

```bash
# 1. User demande: "Create a PR for the power-up feature"

# 2. Vérifier état
git branch --show-current
# → feat/arcade-powerups

git status
# → On branch feat/arcade-powerups
# → Your branch is up to date with 'origin/feat/arcade-powerups'

# 3. Analyser commits
git log main...HEAD --oneline
# → feat(arcade): add power-up collection logic
# → feat(arcade): add power-up rendering
# → test(arcade): add power-up tests

git diff main...HEAD --stat
# → js/arcade/multimiam-engine.js   | 45 +++++++
# → js/arcade/multimiam-renderer.js | 32 +++++
# → tests/__tests__/multimiam.test.js | 28 ++++

# 4. Générer titre
# → feat(arcade): implement power-up system

# 5. Générer body
# → [Summary + Changes + Test Plan]

# 6. Créer PR
gh pr create \
  --base main \
  --title "feat(arcade): implement power-up system" \
  --body "..." \
  --label "enhancement" \
  --label "arcade"

# 7. Afficher résultat
# → https://github.com/user/repo/pull/123
# → ✅ Pull Request created: #123

# 8. Informer user
"✅ PR #123 created: feat(arcade): implement power-up system
View: https://github.com/user/repo/pull/123"
```

## Integration avec autres Skills

- **@commit-helper** - Créer commits avant PR
- **@quality-gate** - Valider qualité avant PR
- **@i18n-sync** - Vérifier i18n avant PR
- **@visual-regression-testing** - Screenshots pour PR

## Expert Agents recommandés

- **@code-reviewer** - Review complète avant PR
- **@test-writer** - S'assurer tests suffisants
- **@i18n-coordinator** - Vérifier traductions complètes

## Scripts npm utiles

```bash
# Avant de créer PR
npm run verify          # Quality gate complet
npm run i18n:compare    # Si changements i18n
npm test                # Vérifier tests

# Git helpers
git log main...HEAD --oneline    # Voir commits
git diff main...HEAD --stat      # Voir changements
gh pr list                       # Voir PRs existantes
gh pr view --web                 # Ouvrir PR dans navigateur
```

## Voir aussi

- `.claude/skills/commit-helper/` - Créer commits avant PR
- `.claude/skills/quality-gate/` - Vérifications avant PR
- `.claude/skills/i18n-sync/` - Synchronisation traductions
- `CLAUDE.md` - Guidelines PR du projet
