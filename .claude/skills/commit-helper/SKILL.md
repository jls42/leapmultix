---
name: 'Commit Helper'
description: "Automatise la création de commits Git avec messages conventionnels. Utiliser quand l'utilisateur veut committer des changements avec analyse automatique du diff."
---

# Commit Helper

Cette skill automatise la création de commits Git avec des messages conformes aux conventions, en analysant automatiquement les changements pour générer des messages descriptifs et pertinents.

## Quand utiliser cette skill

- Quand l'utilisateur demande de "commit" ou "committer" des changements
- Après avoir terminé une feature, fix, ou refactoring
- Quand l'utilisateur dit "create a commit", "commit these changes", "commit this"
- Avant de créer une Pull Request (souvent couplé avec pr-creator Skill)
- Quand des fichiers sont staged et prêts à être commités

## Convention de Commits

### Format Conventional Commits

```
<type>(<scope>): <description>

[optional body]
```

**Types autorisés:**

- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `refactor`: Refactoring de code (pas de changement fonctionnel)
- `perf`: Amélioration de performance
- `test`: Ajout ou modification de tests
- `docs`: Documentation uniquement
- `style`: Formatting, missing semi colons, etc. (pas de changement de code)
- `chore`: Maintenance, dependencies, build process
- `ci`: CI/CD configuration changes

**Scopes courants pour leapmultix:**

- `arcade`: Jeux arcade (Multimiam, Multisnake, Invasion, Memory)
- `i18n`: Internationalisation (fr/en/es)
- `ui`: Interface utilisateur
- `a11y`: Accessibilité
- `perf`: Performance
- `pwa`: Progressive Web App (Service Worker, cache)
- `test`: Tests
- `deps`: Dépendances

**Description:**

- Commence par un verbe à l'impératif (add, fix, update, remove)
- Minuscule (pas de majuscule)
- Pas de point final
- Maximum 72 caractères

### Exemples de bons commits

```bash
# Feature
feat(arcade): add power-up system to Multimiam
feat(i18n): add Spanish translations for achievements

# Fix
fix(arcade): correct collision detection in Multisnake
fix(ui): prevent modal from closing on backdrop click

# Refactor
refactor(arcade): extract rendering logic to separate module
refactor(storage): simplify LocalStorage abstraction

# Performance
perf(arcade): optimize sprite rendering with object pooling
perf(i18n): cache translation lookups

# Tests
test(arcade): add collision detection tests for Multimiam
test(i18n): add missing key detection tests

# Chore
chore(deps): update jest to 29.7.0
chore: update .gitignore for coverage reports
```

### Exemples de mauvais commits

```bash
# ❌ Trop vague
fix: bug fixes
update: changes

# ❌ Pas de type
Add new feature
Fixed the thing

# ❌ Description trop longue (> 72 chars)
feat(arcade): add new power-up system with multiple types including speed boost and invincibility

# ❌ Pas impératif
feat: added new feature
fix: fixed bug
```

## Workflow de Création de Commit

### 1. Analyser l'état Git actuel

```bash
# Vérifier statut
git status

# Voir changements staged
git diff --staged

# Voir changements non-staged
git diff

# Voir historique récent (pour style)
git log --oneline -5
```

### 2. Déterminer le type de commit

**Analyse des fichiers modifiés:**

```javascript
// Si nouveaux fichiers ou nouvelles fonctionnalités
files.some(f => f.status === 'A' || f.diff.includes('export function'))
  → type: feat

// Si corrections de bugs
files.some(f => f.diff.includes('fix') || f.path.includes('test'))
  → type: fix

// Si refactoring (restructuration sans changement fonctionnel)
files.some(f => f.diff.includes('rename') || noNewFunctionality)
  → type: refactor

// Si tests uniquement
files.every(f => f.path.includes('test') || f.path.includes('spec'))
  → type: test

// Si dépendances
files.some(f => f.path === 'package.json' || f.path === 'package-lock.json')
  → type: chore(deps)
```

### 3. Déterminer le scope

**Basé sur les fichiers modifiés:**

```javascript
// Arcade games
if (files.some(f => f.path.startsWith('js/arcade') ||
                     f.path.includes('multimiam') ||
                     f.path.includes('multisnake')))
  → scope: arcade

// i18n
if (files.some(f => f.path.startsWith('i18n/')))
  → scope: i18n

// UI components
if (files.some(f => f.path.startsWith('js/components/')))
  → scope: ui

// Tests
if (files.every(f => f.path.includes('test')))
  → scope: test

// PWA
if (files.some(f => f.path === 'sw.js' || f.path.includes('cache')))
  → scope: pwa

// Accessibility
if (files.some(f => f.path.includes('accessibility') ||
                     f.diff.includes('aria-') ||
                     f.diff.includes('role=')))
  → scope: a11y
```

### 4. Générer la description

**Règles:**

- Commencer par verbe impératif lowercase
- Être spécifique (pas "update code")
- Mentionner QUOI, pas COMMENT
- Maximum 72 caractères

**Exemples de transformation:**

```javascript
// Changement: Ajout de fonction handlePowerUp() dans multimiam-engine.js
// ❌ Mauvais: "add function"
// ✅ Bon: "add power-up collection mechanic"

// Changement: Fix dans collision detection (snake passait à travers murs)
// ❌ Mauvais: "fix collision"
// ✅ Bon: "fix snake passing through walls"

// Changement: Renommage + restructuration arcade-utils.js
// ❌ Mauvais: "refactor utils"
// ✅ Bon: "extract sprite utilities to dedicated module"
```

### 5. Valider avant commit

**Checklist:**

- [ ] Type correct (feat/fix/refactor/test/chore/docs/style/perf/ci)
- [ ] Scope pertinent (arcade/i18n/ui/a11y/pwa/test/deps ou vide)
- [ ] Description impératif lowercase < 72 chars
- [ ] Tests passent (`npm test`)
- [ ] Lint passe (`npm run lint`)

### 6. Exécuter le commit

```bash
# Si changements pas encore staged
git add <files>

# Créer commit
git commit -m "type(scope): description"

# Ou avec body si nécessaire
git commit -m "$(cat <<'EOF'
type(scope): description

Optional body explaining the change in more detail.
Why this change was necessary and what it achieves.
EOF
)"

# Vérifier le commit
git log -1 --pretty=format:"%h - %s%n%b"
```

## Cas d'Usage Spécifiques

### Cas 1: Multiples fichiers, même feature

**Changements:**

- `js/arcade/multimiam-engine.js` - Ajout power-ups logic
- `js/arcade/multimiam-renderer.js` - Rendu power-ups
- `js/arcade/multimiam-ui.js` - UI power-ups
- `i18n/fr.json`, `i18n/en.json` - Traductions power-ups

**Commit:**

```bash
feat(arcade): add power-up system to Multimiam

Includes:
- Power-up collection logic (engine)
- Visual rendering of power-ups (renderer)
- Power-up UI indicators
- i18n support for power-up names
```

### Cas 2: Multiples types de changements

**Problème:** feat + fix + refactor dans même diff

**Solution:** Créer PLUSIEURS commits séparés

```bash
# Commit 1: Feature
git add js/arcade/multimiam-engine.js (seulement power-up code)
git commit -m "feat(arcade): add power-up collection mechanic"

# Commit 2: Fix
git add js/arcade/multisnake.js (seulement collision fix)
git commit -m "fix(arcade): correct snake wall collision detection"

# Commit 3: Refactor
git add js/utils-es6.js
git commit -m "refactor: extract common sprite utilities"
```

**Pourquoi:** Chaque commit = 1 objectif clair (facilite git revert, cherry-pick, review)

### Cas 3: Changements de dépendances

**package.json + package-lock.json modifiés:**

```bash
# Si ajout de dépendance
chore(deps): add playwright for visual regression testing

# Si update de dépendance
chore(deps): update jest to 29.7.0

# Si fix de vulnérabilité
fix(deps): update minimatch to 3.0.5 (CVE-2022-3517)
```

### Cas 4: Changements i18n

**i18n/fr.json, i18n/en.json, i18n/es.json modifiés:**

```bash
feat(i18n): add achievement system translations

# OU si juste corrections
fix(i18n): correct Spanish translation for 'arcade.start'

# OU si ajout langue
feat(i18n): add Italian language support
```

### Cas 5: Tests uniquement

**tests/**tests**/multimiam.test.js modifié:**

```bash
test(arcade): add power-up collection tests for Multimiam

# OU si fix de test
fix(test): correct collision test expectations
```

## Gestion des Erreurs

### Si tests échouent avant commit

```bash
# NE PAS committer si tests échouent !
npm test

# Si échec, deux options:

# Option 1: Fix tests d'abord
# - Corriger le code ou les tests
# - Re-run npm test
# - Commit quand vert

# Option 2: Skip tests (SEULEMENT si WIP)
git commit -m "WIP: feat(arcade): power-up system (tests failing)" --no-verify
# ⚠️ ATTENTION: Utiliser --no-verify seulement pour WIP branches
```

### Si lint échoue avant commit

```bash
# Auto-fix si possible
npm run lint:fix

# Stage fixes
git add .

# Commit
```

### Si format:check échoue

```bash
# Auto-format
npm run format

# Stage formatting
git add .

# Commit
```

## Workflow Complet (Exemple)

```bash
# 1. User demande: "Commit the power-up changes"

# 2. Analyser état
git status
# → Modified: js/arcade/multimiam-engine.js, multimiam-renderer.js, i18n/fr.json

git diff --staged
# → Vide (rien staged)

git diff
# → +handlePowerUp() function
# → +renderPowerUp() function
# → +{"arcade.powerUp.speed": "Vitesse"}

# 3. Déterminer commit
# Type: feat (nouvelle fonctionnalité)
# Scope: arcade (fichiers arcade)
# Description: add power-up collection to Multimiam

# 4. Valider qualité
npm run lint      # ✅ Pass
npm test          # ✅ Pass

# 5. Stage fichiers
git add js/arcade/multimiam-engine.js js/arcade/multimiam-renderer.js i18n/fr.json i18n/en.json

# 6. Créer commit
git commit -m "feat(arcade): add power-up collection to Multimiam"

# Ou avec body si détails nécessaires
git commit -m "$(cat <<'EOF'
feat(arcade): add power-up collection to Multimiam

Implements speed boost and invincibility power-ups with:
- Collection detection in game engine
- Visual rendering of power-ups
- i18n support for power-up names
EOF
)"

# 7. Vérifier
git log -1
# → Affiche le commit créé

# 8. Informer user
"✅ Commit created: feat(arcade): add power-up collection to Multimiam"
```

## Integration avec autres Skills

- **@quality-gate** - Exécuter avant commit pour valider qualité
- **@i18n-sync** - Vérifier i18n:compare si fichiers i18n modifiés
- **@pr-creator** - Souvent suivit de création PR
- **@tdd-jest** - Tests doivent passer avant commit

## Expert Agents recommandés

- **@code-reviewer** - Review changements avant commit
- **@debugger** - Si tests échouent, debug avant commit
- **@i18n-coordinator** - Si changements i18n, vérifier sync

## Scripts npm utiles

```bash
# Avant commit
npm run format:check  # Vérifier formatting
npm run lint          # Vérifier qualité
npm test              # Vérifier tests
npm run i18n:compare  # Vérifier i18n si changements

# Git helpers
git diff --staged                    # Voir staged changes
git diff HEAD                        # Voir tous les changes
git log --oneline -10                # Voir historique
git show HEAD                        # Voir dernier commit
```

## Voir aussi

- `.claude/skills/pr-creator/` - Créer PR après commit
- `.claude/skills/quality-gate/` - Vérifications avant commit
- `.claude/skills/i18n-sync/` - Synchronisation traductions
- `CLAUDE.md` - Guidelines commit style du projet
