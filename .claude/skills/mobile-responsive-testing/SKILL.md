---
name: 'Tests Responsive Mobile'
description: 'Tests de compatibilité mobile et responsive design (touch, viewports, performance mobile). Utiliser après modifications CSS responsive, touch controls, ou avant release'
---

# Tests Responsive Mobile

Guide les tests de responsive design et compatibilité mobile pour garantir une expérience optimale sur tous les appareils.

## Quand utiliser

- Modifications CSS responsive
- Ajout de touch controls
- Avant chaque release
- Bugs reportés sur mobile
- Tests performance mobile

## Viewports essentiels

**Desktop:** 1920×1080, 1366×768
**Tablet:** 768×1024, 1024×768
**Mobile:** 375×667, 390×844, 412×915

Trouve les breakpoints CSS utilisés dans le projet.

## Outils de test

### Chrome DevTools Device Mode

Émule différents appareils :
- Viewports prédéfinis
- Touch simulation
- Network/CPU throttling

### Chrome DevTools MCP

- Capture screenshots multi-device
- Tests automatisés layout
- Performance profiling

### Tests sur vrais appareils

**Essentiels :**
- iPhone (iOS récent)
- Android (version récente)

**Pourquoi :**
- Touch réel ≠ simulation
- Performance réelle
- Bugs spécifiques device

## Checklist responsive

### 1. Layout

- Layout fluide (pas de horizontal scroll)
- Contenu lisible sans zoom
- Images redimensionnées
- Colonnes en stack mobile

### 2. Touch targets

**Taille minimum :**
- 44×44 px (iOS)
- 48×48 px (Android)
- 8px espacement minimum

Trouve les tailles de touch targets dans le CSS.

### 3. Navigation mobile

- Menu burger accessible
- Animation fluide
- Fermeture backdrop ou X
- Pas de piège clavier

### 4. Touch interactions

**Supportés :**
- Tap (pas de hover requis)
- Swipe si applicable
- Pinch-zoom si pertinent

**Éviter :**
- Hover-only interactions
- Gestures complexes

Trouve les touch handlers dans le JavaScript.

### 5. Formulaires mobiles

**Optimisations :**
- Input type approprié (`email`, `tel`, `number`)
- `autocomplete` actif
- Labels visibles
- Clavier adapté au type

Examine les formulaires et leur configuration.

### 6. Images responsive

**Techniques :**
- `srcset` pour résolutions multiples
- `<picture>` pour art direction
- Lazy loading
- WebP avec fallback

Trouve la stratégie d'images responsive.

### 7. Typography

**Tailles :**
- 16px minimum corps de texte
- Line-height ≥ 1.5
- rem/em pour scalabilité

Examine les tailles de police CSS.

### 8. Performance mobile

**Métriques cibles :**
- First Contentful Paint < 2s (3G)
- Time to Interactive < 5s (3G)
- Lighthouse Performance > 80

Lance Lighthouse en mode mobile.

## Workflow de test

### 1. Tests DevTools

Pour chaque viewport clé :
- Layout adaptatif
- Touch targets simulation
- Performance
- Screenshot

### 2. Tests vrais devices

iPhone et Android :
- Navigation complète
- Touch interactions réelles
- Formulaires
- Jeux arcade si applicable

### 3. Tests throttling

Avec 3G + 4x CPU :
- Temps de chargement
- Fluidité interactions
- FPS jeux arcade

### 4. Corrections

Priorise :
1. Bloquants (layout cassé)
2. UX dégradée (touch targets petits)
3. Performance (chargement lent)

## Checklist finale

- [ ] Tous viewports testés (mobile, tablet, desktop)
- [ ] Touch targets ≥ 44×44 px
- [ ] Pas de horizontal scroll
- [ ] Menu mobile fonctionnel
- [ ] Formulaires optimisés (input types)
- [ ] Images responsive (srcset/picture)
- [ ] Typography lisible (16px min)
- [ ] Performance 3G acceptable (< 5s TTI)
- [ ] Testé sur vrais appareils (iOS + Android)
- [ ] Lighthouse Mobile > 80
- [ ] Pas de hover-only interactions

## En cas de doute

**Source :** Vrais appareils + Lighthouse Mobile

**Règles absolues :**
1. Toujours tester sur vrais appareils (iOS + Android)
2. Toujours tester avec 3G throttling
3. Touch targets minimum 44×44 px
4. Jamais hover-only interactions
5. Lighthouse Mobile > 80 obligatoire

**Workflow minimal :**
- DevTools pour iterations rapides
- Vrais appareils pour validation finale
- Lighthouse mobile pour métriques
