---
name: 'pr-creator'
description: "Crée des Pull Requests GitHub avec descriptions détaillées générées depuis les commits. Utiliser quand l'utilisateur veut créer une PR après avoir commité des changements."
---

# PR Creator

Automatise la création de Pull Requests GitHub avec descriptions structurées.

## Quand utiliser ce Skill

- Quand l'utilisateur demande de "create a PR", "créer une PR"
- Après commits sur feature branch
- Feature terminée et prête pour review

## Prérequis

**GitHub CLI (gh) installé et configuré**

Vérifie : `gh --version` et `gh auth status`

## Workflow de création

### 1. Vérifier état branche

- Branche actuelle (pas main)
- Branche pushed vers remote
- Commits présents depuis main

### 2. Analyser les commits

Examine TOUS commits depuis main :

```bash
git log main...HEAD --oneline
git diff main...HEAD --stat
```

Identifie :

- Types (feat/fix/refactor/test/chore)
- Scopes (arcade/i18n/ui/pwa)
- Fichiers modifiés par catégorie

### 3. Générer titre PR

**Règles :**

- 1 commit → utilise message commit
- Similaires → généralise
- Mixte → "Multiple improvements (scopes)"
- Max 72 caractères

### 4. Générer description PR

**Structure :**

```markdown
## Summary

[1-4 bullet points changements clés]

## Changes

[Fichiers modifiés groupés par catégorie]

## Test Plan

- [ ] [Tests spécifiques]
- [ ] Run `npm run verify`
```

**Catégories :** arcade/, components/, core/, i18n/, tests/

### 5. Générer test plan basé sur fichiers

- Arcade → Test jeux, 60 FPS
- i18n → Test langues, `npm run i18n:compare`
- Tests → Coverage ≥ 80%
- Toujours → `npm run verify`, no console errors

### 6. Créer PR avec gh CLI

```bash
gh pr create \
  --base main \
  --title "type(scope): description" \
  --body "$(cat <<'EOF'
## Summary
- Point 1

## Test Plan
- [ ] npm run verify
EOF
)"
```

**Options :** `--draft`, `--label`, `--reviewer`, `--assignee`, `--web`

## Exemples de PR

**1 commit feat :** `feat(arcade): implement power-up system`

**Multiple feat :** Généralise en titre synthétique

**Mixte (feat+fix+refactor) :** `Multiple improvements (arcade, ui)`

## Gestion erreurs

- Branche pas pushed → `git push -u origin $(git branch --show-current)`
- gh non auth → `gh auth login`
- PR existe → `gh pr edit` au lieu de create
- Sur main → Créer feature branch d'abord

## Checklist avant PR

- [ ] `npm run verify` passe
- [ ] `npm run i18n:compare` si i18n modifié
- [ ] Commits suivent Conventional Commits
- [ ] Branche pushed
- [ ] Pas secrets/keys
- [ ] Pas sur main

## Scripts npm utiles

```bash
npm run verify          # Quality gate
npm run i18n:compare    # Si i18n
git log main...HEAD     # Commits
gh pr list              # PRs existantes
```

## En cas de doute

**Source :** CLAUDE.md et PRs existantes (`gh pr list --state all`)

**Règles absolues :**

1. Vérifier qualité avant PR (`npm run verify`)
2. Analyser TOUS commits depuis main
3. Jamais PR depuis main
4. Jamais PR si tests échouent
5. Jamais mentionner AI

**Workflow minimal :**

```bash
npm run verify
git push -u origin $(git branch --show-current)
gh pr create --base main --title "..." --body "..."
```
