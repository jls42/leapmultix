---
name: managing-animations
description: Creates and manages CSS and JavaScript animations (keyframes, transitions, sprite animations, canvas animations). Use when adding visual animations or user feedback
allowed-tools: Read, Write, Grep, Glob, Bash
---

# Système d'Animation

Crée animations fluides (CSS, JS, sprites, particules) pour feedback utilisateur et jeux.

## Quand utiliser

- Feedback visuel (boutons, transitions)
- Animations sprites (jeux arcade)
- Transitions slides
- Effets visuels (particules, explosions)
- Micro-interactions UI
- Animations canvas jeux

## Types d'animations

**CSS Transitions :**

- Hover, focus, state changes
- Propriétés : transform, opacity (GPU), color, box-shadow
- Easing : ease-out (UI), ease-in-out (transitions), linear (rotations)

**CSS Keyframes :**

- Pulse, shake, bounce, rotate, fade
- Animations répétables sans événement
- Trouve keyframes existantes dans CSS

**JavaScript (requestAnimationFrame) :**

- Animations complexes programmées
- `performance.now()` → progress (0-1) → easing → interpolate
- Batch multiple animations dans un RAF

**Sprite Animations (Canvas) :**

- Frame-based (FPS adaptatif)
- Sprite sheets, frame index qui boucle
- Directional sprites, callbacks (onLoop, onComplete)

**Particle Systems :**

- Effets visuels (explosions, étincelles)
- Particle class (position, velocity, life, color)
- Max 100 simultanées, object pooling, cleanup

Examine animationen existantes dans le code.

## Patterns essentiels

- **Feedback :** Correct (vert, pulse), Wrong (rouge, shake), Coins (trajectoires)
- **Transitions slides :** TranslateX, fade, cleanup, historique
- **Accessibility :** Respecter `prefers-reduced-motion`, fallback simple
- **Easing :** Linear, Quad, Cubic, Elastic, Bounce (trouve dans utils)

## Optimisations

**GPU Acceleration :**

- Utiliser transform + opacity (pas left/top)
- will-change: transform, opacity (retirer après)

**Performance :**

- Batch RAF multiple animations
- Particules < 100 simultanées, cleanup chaque frame
- 60 FPS obligatoire (profile DevTools)

## Workflow

1. **Choisir type :** CSS transition (simple), CSS keyframes (feedback), RAF (complexe), Sprite (jeu), Particles (effets)
2. **Examiner existant :** Patterns, conventions, optimisations
3. **Implémenter :** Suivre mêmes patterns, cleanup, 60 FPS
4. **Tester :** Fluide, prefers-reduced-motion OK, mobile OK

## Checklist

- [ ] CSS pour animations simples
- [ ] RAF pour animations complexes
- [ ] transform + opacity (GPU)
- [ ] prefers-reduced-motion respecté
- [ ] Particules < 100, cleanup
- [ ] Easing appropriée
- [ ] 60 FPS maintenu
- [ ] Testé mobile

## En cas de doute

**Règles absolues :**

1. Examiner animations similaires dans code
2. Prioriser CSS (simplicité + perf)
3. JavaScript uniquement si nécessaire
4. Profile DevTools (60 FPS OBLIGATOIRE)
5. Toujours respecter prefers-reduced-motion

**Références :**

- CSS keyframes/transitions existantes
- Feedback animations (coins, scores)
- Slides transitions
- Jeux arcade (sprites, particules)
- Easing functions utils
