---
name: profiling-performance
description: Analyzes and optimizes application performance (loading time, FPS, memory, bottlenecks). Use when experiencing slowdowns, before releases, or optimizing arcade games
allowed-tools: Read, Grep, Glob, Bash, WebSearch
---

# Profileur de Performance

Analyse et optimise performances pour expérience utilisateur fluide (chargement, FPS, mémoire).

## Quand utiliser

- Ralentissements dans les jeux
- Avant chaque release majeure
- Ajout de features lourdes
- Optimisation FPS arcade
- Investigation memory leaks
- Mobile performance

## Métriques cibles

**Chargement :** FCP < 1.5s, TTI < 3s, TBT < 200ms
**Runtime :** FPS ≥ 60 (arcade), Memory < 50 MB (stable)
**Bundle :** Initial < 200 KB (gzipped), Total < 2 MB

## Outils d'analyse

**Chrome DevTools Performance :**

- Profile JS (Scripting), Rendering, Painting
- Identifie Long Tasks (> 50ms = problème)
- Mesure FPS en temps réel

**Lighthouse :**

- Performance > 90, Accessibility > 95, PWA > 90
- Identifie bottlenecks chargement

**Performance API :**

- `performance.mark()` / `performance.measure()`
- `performance.getEntriesByName()` pour résultats

## Zones de profiling

### 1. Chargement initial

- Lighthouse audit → FCP, TTI
- Lazy loading modules lourds (trouvé dans lazy-loader.js)
- Imports dynamiques existants

### 2. FPS arcade (< 60 FPS = problème)

- Trop de calculs dans game loop → cacher résultats
- Re-render inutiles → cherche dirty rectangles/layers
- DOM excessif → batch avec requestAnimationFrame

### 3. Memory leaks

- DevTools Memory → Heap snapshots
- Event listeners non nettoyés dans cleanup()
- Timers non clearés (setInterval/clearInterval)

### 4. Bundle size

- Scripts npm : analyze:dependencies, dead-code
- Lazy-loader configuration
- Code splitting opportunities

## Patterns essentiels

- **Debounce/Throttle :** Événements fréquents
- **Memoization :** Cache résultats coûteux
- **requestAnimationFrame :** Batch DOM updates
- **Lazy loading :** Modules > 50 KB
- **Cleanup :** Listeners/Timers en destroy

## Workflow

1. **Identifier :** Profile DevTools ou Lighthouse
2. **Mesurer :** Taille, FPS, TTI avant optimisation
3. **Optimiser :** Une stratégie à la fois
4. **Valider :** Re-mesure, seuils atteints, mobile OK

## Checklist

- [ ] Lighthouse Performance > 90
- [ ] FPS ≥ 60 (arcade)
- [ ] Lazy loading implémenté
- [ ] Cleanup() nettoyage complet
- [ ] Memory leak-free (heap snapshot stable)
- [ ] Bundle < 200 KB initial
- [ ] Debounce/throttle sur événements
- [ ] Assets optimisés

## En cas de doute

**Workflow minimal :**

```bash
# Profile avec DevTools ou Lighthouse
# Identifier bottleneck (chargement, FPS, mémoire)
# Appliquer pattern (lazy loading > debounce > cache)
# Mesurer avant/après
# Valider sur mobile (bas de gamme)
```

**Règles absolues :**

1. Profile d'abord, optimiser après
2. Mesure avant/après
3. Une optimisation à la fois
4. Tests passent
