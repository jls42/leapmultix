---
name: 'Validateur d\'Accessibilité'
description: "Valide l'accessibilité web selon les standards WCAG 2.1 AA pour les utilisateurs en situation de handicap. Utiliser lors de modifications UI, ajout de composants, ou audits d'accessibilité"
---

# Validateur d'Accessibilité

Guide la validation et l'amélioration de l'accessibilité web selon WCAG 2.1 niveau AA.

## Quand utiliser

- Ajout de composants UI
- Modification d'interfaces
- Avant chaque release majeure
- Audit d'accessibilité complet

## Standards WCAG 2.1 AA

**Quatre principes POUR :**
1. **Perceptible** - Information présentable
2. **Opérable** - Composants opérables
3. **Compréhensible** - Info et UI compréhensibles
4. **Robuste** - Contenu robuste

## Scripts npm disponibles

Trouve et utilise :
- Audit accessibilité complet
- Audit mobile responsive
- Vérification contraste
- Tests automatisés

## Checklist essentielle

### 1. Structure sémantique HTML

- Balises appropriées (`<header>`, `<nav>`, `<main>`, `<footer>`)
- Hiérarchie titres logique (h1 → h2 → h3)
- `<button>` pour actions, `<a>` pour navigation

### 2. Navigation clavier

- Éléments interactifs focusables
- Ordre tabulation logique
- Focus visible (outline ou custom)
- Raccourcis clavier sans conflit

### 3. ARIA (Accessible Rich Internet Applications)

**Utiliser quand sémantique HTML insuffisante**

Règles :
- Pas d'ARIA mieux que mauvais ARIA
- Vérifier support lecteurs d'écran
- Tester avec vraies technologies assistives

Attributs courants :
- `aria-label`, `aria-labelledby`
- `aria-describedby`
- `aria-hidden`
- `role` (button, dialog, alert, etc.)

### 4. Contraste couleurs

**WCAG 2.1 AA minimum :**
- Texte normal : 4.5:1
- Texte large (≥18pt ou ≥14pt gras) : 3:1
- Composants UI : 3:1

Outils : navigateur DevTools, Contrast Checker

### 5. Alternatives textuelles

- Toutes images avec `alt`
- Images décoratives : `alt=""`
- Images complexes : description détaillée
- Vidéos : sous-titres/transcription

### 6. Formulaires

- Labels explicites associés
- Messages d'erreur clairs
- Instructions visibles
- Validation côté client + serveur

### 7. Responsive et zoom

- Support zoom 200% sans perte fonctionnalité
- Contenu responsive (mobile, tablette, desktop)
- Touch targets ≥ 44×44 px mobile

## Workflow d'audit

### 1. Tests automatisés

Utilise scripts npm disponibles ou Lighthouse (Chrome DevTools).

### 2. Tests manuels

**Navigation clavier :**
- Tab à travers tous éléments interactifs
- Enter/Space pour activer
- Échap pour fermer modales/menus

**Lecteur d'écran :**
- VoiceOver (macOS/iOS)
- NVDA (Windows)
- JAWS (Windows)

**Contraste :**
- Vérifie tous textes et icônes
- Teste modes sombre/clair

### 3. Tests utilisateurs réels

- Personnes avec handicaps
- Différentes technologies assistives
- Feedback sur expérience réelle

## Checklist avant release

- [ ] Hiérarchie titres correcte
- [ ] Navigation clavier complète
- [ ] Contraste WCAG AA respecté
- [ ] Alt text sur toutes images
- [ ] Labels formulaires associés
- [ ] Focus visible partout
- [ ] Tests lecteur d'écran passés
- [ ] Zoom 200% fonctionnel
- [ ] Touch targets ≥ 44px mobile

## En cas de doute

**Source :** Standards WCAG 2.1 AA officiels

**Règles absolues :**
1. Toujours tester clavier uniquement
2. Toujours vérifier contraste
3. Toujours tester lecteur d'écran
4. Jamais cacher contenu sans `aria-hidden`
5. Jamais empêcher zoom mobile

**Workflow minimal :**
- Lighthouse audit
- Navigation clavier complète
- Test 1 lecteur d'écran minimum
