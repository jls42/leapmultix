---
name: 'commit-helper'
description: "Automatise la création de commits Git avec messages conventionnels. Utiliser quand l'utilisateur veut committer des changements avec analyse automatique du diff."
---

# Commit Helper

Automatise la création de commits Git avec messages conformes Conventional Commits.

## Quand utiliser ce Skill

- Utilisateur demande de "commit" ou "committer"
- Après feature, fix, ou refactoring terminé
- Avant de créer une Pull Request

## Convention Conventional Commits

### Format

```
<type>(<scope>): <description>
```

**Types :** feat, fix, refactor, perf, test, docs, style, chore, ci

**Scopes leapmultix :** arcade, i18n, ui, a11y, perf, pwa, test, deps

**Description :**

- Verbe impératif minuscule (add, fix, update, remove)
- Pas de majuscule, pas de point
- Max 72 caractères
- Spécifique (pas "update code")

## Workflow de création

### 1. Analyser état Git

```bash
git status
git diff --staged
git diff
git log --oneline -5  # Style existant
```

### 2. Déterminer type et scope

**Type :**

- Nouveaux fichiers/fonctions → feat
- Corrections bugs → fix
- Restructuration → refactor
- Tests uniquement → test
- package.json → chore(deps)

**Scope :**

- Examine chemins fichiers
- Identifie domaine principal
- Omets si générique/multiple

### 3. Générer description

- Verbe impératif minuscule
- QUOI pas COMMENT
- Spécifique < 72 chars

### 4. Valider qualité

```bash
npm run format:check  # Si échec → format
npm run lint          # Si échec → lint:fix
npm test
npm run i18n:compare  # Si i18n modifié
```

### 5. Créer commit

```bash
git add <files>
git commit -m "type(scope): description"
```

**Avec body si nécessaire :**

```bash
git commit -m "$(cat <<'EOF'
type(scope): description

Optional body explaining details.
EOF
)"
```

## Exemples

**Bons :**

```
feat(arcade): add power-up system to Multimiam
fix(arcade): correct collision detection
refactor(arcade): extract rendering logic
chore(deps): update jest to 29.7.0
feat(i18n): add Spanish translations
```

**Mauvais :**

```
fix: bug fixes              # Trop vague
Add new feature            # Pas de type
feat: added feature        # Pas impératif
```

## Cas d'usage

### Multiples fichiers, même feature

Un seul commit avec tous les fichiers.

### Multiples types (feat + fix + refactor)

Créer PLUSIEURS commits séparés. Chaque commit = 1 objectif.

### i18n modifié

```bash
npm run i18n:compare  # Vérifie sync
# Puis commit
```

### Dépendances

```bash
chore(deps): add playwright
chore(deps): update jest to 29.7.0
fix(deps): update minimatch (CVE-2022-3517)
```

## Gestion erreurs

### Tests échouent

NE PAS committer ! Fix d'abord ou WIP avec `--no-verify` (précaution).

### Lint/Format échoue

```bash
npm run lint:fix
npm run format
git add .
# Puis commit
```

## Checklist avant commit

- [ ] Type correct (feat/fix/refactor/test/chore/docs/style/perf/ci)
- [ ] Scope pertinent (ou vide)
- [ ] Description impérative < 72 chars
- [ ] `npm run format:check` passe
- [ ] `npm run lint` passe
- [ ] `npm test` passe
- [ ] `npm run i18n:compare` si i18n
- [ ] Pas secrets/keys

## En cas de doute

**Source :** CLAUDE.md et `git log` (exemples)

**Règles absolues :**

1. Vérifier qualité avant commit
2. Conventional Commits obligatoire
3. Jamais commit si tests échouent (sauf WIP)
4. Jamais secrets/keys
5. Jamais mentionner l'IA (pas de 'Generated with Claude' ou 'Co-Authored-By: Claude')

**Workflow :**

```bash
npm run verify
git add <files>
git commit -m "type(scope): description"
```
