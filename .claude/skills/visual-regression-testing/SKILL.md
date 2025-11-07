---
name: testing-visual-regression
description: Visual regression tests for canvas games and responsive UI. Use after canvas modifications, CSS changes, or adding new arcade games
allowed-tools: Read, Grep, Glob, Bash, WebSearch
---

# Tests de Régression Visuelle

Détecte régressions visuelles dans jeux canvas et UI responsive via captures automatiques.

## Quand utiliser

- Modifications code canvas (jeux arcade)
- Changements CSS ou styles
- Ajout nouveau jeu arcade
- Avant release majeure
- Bugs visuels reportés
- Modifications thèmes

## Ce que les tests visuels détectent

**Tests unitaires NE détectent PAS:**

- Sprites mal positionnés/manquants
- Couleurs incorrectes
- Animations cassées
- Éléments mal alignés
- Responsive breakpoints cassés
- Thèmes mal appliqués

## Architecture

**Structure :**

- `baselines/` - Images de référence
- `current/` - Captures actuelles
- `diffs/` - Différences visuelles

**Viewports :**

- Desktop: 1920×1080
- Tablet: 768×1024
- Mobile: 375×667

Trouve structure tests visuels dans projet.

## Outils et Configuration

**Outils :** Playwright (visual testing intégré)

**Configuration clés :**

- Répertoire tests visuels
- Timeout canvas
- Retry sur timing
- Base URL serveur local
- Viewports configurés

Trouve ou crée configuration Playwright.

## Tests essentiels

**Jeux arcade (par jeu):**

- Écran démarrage
- Gameplay + action
- Game over
- États spécifiques

**UI responsive (par composant):**

- Dashboard, TopBar, Customization
- Chaque viewport (desktop, tablet, mobile)
- États interactifs (menus, toggles)

**Tolérance :**

- UI statique: maxDiffPixels 50-100
- Canvas animé: maxDiffPixels 200-300
- Responsive: maxDiffPixels 100

## Gestion des faux positifs

- **Animations :** Pause avant capture
- **Contenu dynamique :** Masquer avec option mask
- **Fonts :** Font smoothing cohérent

## Debugging

**Outils :**

- Rapport HTML (diffs visuels)
- Mode UI interactif (meilleur debug)
- Inspection manuelle diffs

**Images générées :**

- baseline (référence)
- actual (capture)
- diff (différences en rouge)

## Workflow

1. **Setup :** Installe Playwright, crée structure dossiers
2. **Tests arcade :** Start, gameplay, gameover
3. **Tests UI :** Tous viewports, états interactifs
4. **CI/CD :** Ajoute stage, bloque merge si régressions
5. **Review :** Examine diffs manuellement

## Checklist

- [ ] Desktop tests passent (1920×1080)
- [ ] Tablet tests passent (768×1024)
- [ ] Mobile tests passent (375×667)
- [ ] Baselines mises à jour (si intentionnel)
- [ ] Baselines commitées descriptif
- [ ] Pas de faux positifs
- [ ] Tolérance appropriée
- [ ] Diffs reviewed manuellement

## En cas de doute

**Règles absolues :**

1. Tests visuels OBLIGATOIRES après mods visuelles
2. Review manuellement TOUS diffs
3. Update baselines uniquement si intentionnel
4. Tolérance adaptée : statique strict, animé plus souple
5. Debug avec UI interactif
6. Baselines avec messages descriptifs

**Référence :**

- Structure baselines/ existante
- Scripts npm visual-testing
- Diffs générés (baseline/actual/diff)
