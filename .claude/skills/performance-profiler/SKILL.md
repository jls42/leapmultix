---
name: 'Performance Profiler'
description: "Analyse et optimise les performances de l'application (temps de chargement, FPS, mémoire, bottlenecks). Utiliser lors de ralentissements, avant release, ou optimisation des jeux arcade"
---

# Performance Profiler

Cette skill guide l'analyse et l'optimisation des performances pour une expérience utilisateur fluide.

## Quand utiliser cette skill

- Ralentissements détectés dans les jeux
- Avant chaque release majeure
- Ajout de nouvelles features lourdes
- Optimisation des jeux arcade (FPS)
- Réduction du temps de chargement
- Investigation de memory leaks
- Mobile performance (appareils bas de gamme)

## Objectifs de performance

### Métriques cibles

**Chargement initial :**

- First Contentful Paint (FCP) : < 1.5s
- Time to Interactive (TTI) : < 3s
- Total Blocking Time (TBT) : < 200ms

**Performance runtime :**

- Frame Rate (FPS) : ≥ 60 FPS (jeux arcade)
- Input Latency : < 100ms
- Memory Usage : < 50 MB (stable)

**Bundle size :**

- Initial JS : < 200 KB (gzipped)
- Total assets : < 2 MB (first load)

## Outils de profiling

### Chrome DevTools Performance

**Accès :**

1. Ouvrir DevTools (F12)
2. Onglet "Performance"
3. Cliquer "Record" (Ctrl+E)
4. Effectuer actions à profiler
5. Stop recording
6. Analyser timeline

**Métriques analysées :**

- **Scripting (JS)** : Temps d'exécution JavaScript
- **Rendering** : Calcul styles, layout
- **Painting** : Dessin des pixels
- **Idle** : Temps d'inactivité
- **Frame Rate** : FPS dans le temps

**Interpréter les résultats :**

```
🟢 Vert (Idle) : CPU libre, bon signe
🟡 Jaune (Scripting) : Exécution JS, normal si court
🟠 Orange (Rendering/Painting) : Rendu visuel
🔴 Rouge (Long Task) : Tâche > 50ms, problème !
```

### Lighthouse

**Lancer Lighthouse :**

```bash
# CLI
npx lighthouse http://localhost:8000 --view

# Ou dans Chrome DevTools → Lighthouse
```

**Catégories analysées :**

- Performance (0-100)
- Accessibility
- Best Practices
- SEO
- PWA

**Seuils pour leapmultix :**

- Performance : > 90
- Accessibility : > 95
- Best Practices : > 90
- PWA : > 90

### Performance API

**Mesurer temps d'exécution :**

```javascript
// Marquer le début
performance.mark('operation-start');

// Opération à mesurer
await heavyOperation();

// Marquer la fin
performance.mark('operation-end');

// Mesurer durée
performance.measure('operation-duration', 'operation-start', 'operation-end');

// Récupérer résultats
const measure = performance.getEntriesByName('operation-duration')[0];
console.log(`Duration: ${measure.duration}ms`);

// Nettoyer
performance.clearMarks();
performance.clearMeasures();
```

**Exemple pour leapmultix :**

```javascript
// Mesurer temps d'initialisation d'un mode
export default class QuizMode extends GameMode {
  async init() {
    performance.mark('quiz-init-start');

    // Initialisation
    this.setupUI();
    this.loadQuestions();
    this.attachListeners();

    performance.mark('quiz-init-end');
    performance.measure('quiz-init', 'quiz-init-start', 'quiz-init-end');

    const measure = performance.getEntriesByName('quiz-init')[0];
    console.log(`[QuizMode] Init time: ${measure.duration.toFixed(2)}ms`);
  }
}
```

## Profiling par composant

### 1. Temps de chargement initial

**Problème :** Page met trop de temps à charger

**Diagnostic :**

```bash
# Lighthouse audit
npx lighthouse http://localhost:8000 \
  --only-categories=performance \
  --view
```

**Métriques clés :**

- **FCP** (First Contentful Paint) : Premier élément affiché
- **LCP** (Largest Contentful Paint) : Plus grand élément affiché
- **TTI** (Time to Interactive) : Page interactive

**Optimisations :**

```javascript
// ❌ Mauvais : Tout charger d'un coup
import './arcade-invasion.js';
import './arcade-multimemory.js';
import './multisnake.js';
// Total : ~100 KB chargés immédiatement

// ✅ Bon : Lazy loading
const lazyLoad = module => {
  return import(module);
};

// Charger seulement quand nécessaire
async function startArcadeInvasion() {
  const { default: ArcadeInvasion } = await lazyLoad('./arcade-invasion.js');
  // ...
}
```

**Mesurer impact :**

```javascript
// Avant lazy loading
performance.mark('init-start');
// Imports synchrones
performance.mark('init-end');
// Durée : ~500ms

// Après lazy loading
performance.mark('init-start');
// Imports asynchrones à la demande
performance.mark('init-end');
// Durée : ~50ms (-90%)
```

### 2. Performance des jeux arcade (FPS)

**Problème :** Jeu arcade laggy, FPS bas

**Diagnostic :**

```javascript
// Mesurer FPS en temps réel
let lastFrameTime = performance.now();
let fps = 60;

function measureFPS() {
  const now = performance.now();
  const delta = now - lastFrameTime;
  fps = Math.round(1000 / delta);
  lastFrameTime = now;

  // Afficher FPS
  console.log(`FPS: ${fps}`);

  // Alerter si FPS bas
  if (fps < 30) {
    console.warn('⚠️ Low FPS detected!');
  }

  requestAnimationFrame(measureFPS);
}

// Démarrer mesure
measureFPS();
```

**Causes courantes :**

1. **Trop de calculs dans loop**

```javascript
// ❌ Mauvais : Calculs dans chaque frame
function gameLoop() {
  sprites.forEach(sprite => {
    // Calcul coûteux à chaque frame
    sprite.angle = (Math.atan2(sprite.y, sprite.x) * 180) / Math.PI;
    sprite.update();
    sprite.render();
  });
  requestAnimationFrame(gameLoop);
}

// ✅ Bon : Pré-calculer ou cacher
const angleCache = new Map();

function gameLoop() {
  sprites.forEach(sprite => {
    // Utiliser cache si position n'a pas changé
    if (!sprite.moved) {
      sprite.angle = angleCache.get(sprite.id);
    } else {
      sprite.angle = (Math.atan2(sprite.y, sprite.x) * 180) / Math.PI;
      angleCache.set(sprite.id, sprite.angle);
      sprite.moved = false;
    }
    sprite.update();
  });

  // Render en batch
  renderAll(sprites);
  requestAnimationFrame(gameLoop);
}
```

2. **Re-render inutiles**

```javascript
// ❌ Mauvais : Re-dessiner tout à chaque frame
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  sprites.forEach(sprite => sprite.draw(ctx));
}

// ✅ Bon : Dirty rectangles (re-dessiner seulement zones modifiées)
function render() {
  dirtyRegions.forEach(region => {
    ctx.clearRect(region.x, region.y, region.width, region.height);
    getSpritesInRegion(region).forEach(sprite => sprite.draw(ctx));
  });
  dirtyRegions = [];
}
```

3. **Manipulation DOM excessive**

```javascript
// ❌ Mauvais : DOM dans loop
function updateScore() {
  scoreElement.textContent = score; // DOM access = lent
}
setInterval(updateScore, 16); // Chaque frame

// ✅ Bon : Batch updates
let scoreDirty = false;
let pendingScore = 0;

function updateScore(newScore) {
  pendingScore = newScore;
  scoreDirty = true;
}

function flushDOMUpdates() {
  if (scoreDirty) {
    scoreElement.textContent = pendingScore;
    scoreDirty = false;
  }
}

// Flush une fois par frame
requestAnimationFrame(flushDOMUpdates);
```

### 3. Memory leaks

**Problème :** Utilisation mémoire augmente continuellement

**Diagnostic :**

```javascript
// Mesurer mémoire
if (performance.memory) {
  console.log({
    usedJSHeapSize: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
    totalJSHeapSize: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
    limit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB',
  });
}

// Surveiller dans le temps
setInterval(() => {
  if (performance.memory) {
    const used = performance.memory.usedJSHeapSize / 1048576;
    console.log(`Memory: ${used.toFixed(2)} MB`);

    if (used > 50) {
      console.warn('⚠️ High memory usage!');
    }
  }
}, 5000);
```

**Chrome DevTools Memory Profiler :**

1. DevTools → Memory
2. Take heap snapshot
3. Effectuer actions (jouer, naviguer)
4. Take another snapshot
5. Comparer snapshots
6. Identifier objets qui accumulent

**Causes courantes :**

1. **Event listeners non nettoyés**

```javascript
// ❌ Mauvais : Listeners jamais retirés
export default class MyMode extends GameMode {
  async init() {
    this.onKeyPress = (e) => this.handleKey(e);
    document.addEventListener('keydown', this.onKeyPress);
  }

  // cleanup() non implémenté = listener reste !
}

// ✅ Bon : Cleanup approprié
export default class MyMode extends GameMode {
  async init() {
    this.onKeyPress = (e) => this.handleKey(e);
    document.addEventListener('keydown', this.onKeyPress);
  }

  async cleanup() {
    document.removeEventListener('keydown', this.onKeyPress);
    this.onKeyPress = null;
  }
}
```

2. **Timers non clearés**

```javascript
// ❌ Mauvais : setInterval jamais cleared
export default class GameMode {
  start() {
    setInterval(() => {
      this.update();
    }, 16);
  }
}

// ✅ Bon : Stocker référence et clear
export default class GameMode {
  start() {
    this.intervalId = setInterval(() => {
      this.update();
    }, 16);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
```

3. **Références circulaires**

```javascript
// ❌ Mauvais : Références circulaires
class Parent {
  constructor() {
    this.child = new Child(this); // Enfant garde référence au parent
  }
}

class Child {
  constructor(parent) {
    this.parent = parent; // Parent garde référence à l'enfant
  }
}

// ✅ Bon : WeakRef ou nettoyage explicite
class Parent {
  constructor() {
    this.child = new Child();
  }

  cleanup() {
    this.child.parent = null;
    this.child = null;
  }
}
```

### 4. Bundle size et code splitting

**Problème :** Bundle JavaScript trop gros

**Diagnostic :**

```bash
# Analyser taille des modules
npm run analyze:dependencies

# Vérifier dead code
npm run verify:dead-code
```

**Identifier modules lourds :**

```javascript
// Liste des modules par taille (leapmultix)
const moduleSizes = {
  'multisnake.js': 38, // KB
  'arcade-invasion.js': 31,
  'arcade-multimemory.js': 31,
  'userManager.js': 19,
  'multimiam-engine.js': 15,
  'VideoManager.js': 12,
  'cache-updater.js': 10,
  'core/utils.js': 10,
};

// Modules candidats pour code splitting
const candidates = Object.entries(moduleSizes)
  .filter(([name, size]) => size > 20)
  .sort((a, b) => b[1] - a[1]);

console.log('Code splitting candidates:', candidates);
// [['multisnake.js', 38], ['arcade-invasion.js', 31], ...]
```

**Optimisations :**

```javascript
// ✅ Déjà implémenté dans leapmultix : lazy-loader.js
const MODE_CONFIGS = {
  arcade: {
    module: () => import('./modes/ArcadeMode.js'),
    size: '31 KB',
  },
  invasion: {
    module: () => import('./arcade-invasion.js'),
    size: '31 KB',
  },
  multisnake: {
    module: () => import('./multisnake.js'),
    size: '38 KB',
  },
};

// Charger seulement à la demande
async function loadMode(modeName) {
  const config = MODE_CONFIGS[modeName];
  if (!config) return null;

  performance.mark(`load-${modeName}-start`);
  const module = await config.module();
  performance.mark(`load-${modeName}-end`);

  performance.measure(`load-${modeName}`, `load-${modeName}-start`, `load-${modeName}-end`);

  return module;
}
```

## Optimisations spécifiques leapmultix

### 1. Optimiser Multimiam/Multisnake

**Profiler le jeu :**

```javascript
// multimiam-engine.js
export class MultimiamEngine {
  update(deltaTime) {
    performance.mark('update-start');

    // Update logic
    this.updatePlayer(deltaTime);
    this.updateEnemies(deltaTime);
    this.checkCollisions();

    performance.mark('update-end');
    performance.measure('game-update', 'update-start', 'update-end');

    // Alert si update trop lent (> 16ms pour 60 FPS)
    const measure = performance.getEntriesByName('game-update')[0];
    if (measure.duration > 16) {
      console.warn(`⚠️ Slow update: ${measure.duration.toFixed(2)}ms`);
    }
  }
}
```

**Optimisations canvas :**

```javascript
// ❌ Mauvais : Dessiner tout à chaque frame
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawAllSprites();
  drawUI();
}

// ✅ Bon : Layers et caching
const bgCanvas = document.createElement('canvas');
const bgCtx = bgCanvas.getContext('2d');

// Pré-render background une fois
function prerenderBackground() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  drawBackground(bgCtx);
}

function render() {
  // Copier background pré-rendu (rapide)
  ctx.drawImage(bgCanvas, 0, 0);

  // Dessiner seulement éléments dynamiques
  drawSprites(ctx);
  drawUI(ctx);
}
```

### 2. Optimiser lazy loading

**Mesurer impact :**

```javascript
// lazy-loader.js
export async function lazyLoad(moduleName) {
  const startTime = performance.now();

  const module = await import(`./modes/${moduleName}.js`);

  const loadTime = performance.now() - startTime;
  console.log(`[LazyLoader] ${moduleName} loaded in ${loadTime.toFixed(2)}ms`);

  // Stocker métrique
  performance.mark(`lazy-load-${moduleName}`);

  return module;
}
```

**Préchargement intelligent :**

```javascript
// Précharger modules probablement nécessaires
const preloadQueue = ['QuizMode', 'ChallengeMode'];

async function preloadModules() {
  for (const modeName of preloadQueue) {
    // Précharger pendant idle time
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        lazyLoad(modeName);
      });
    }
  }
}

// Précharger au hover
document.querySelector('.quiz-button').addEventListener(
  'mouseenter',
  () => {
    lazyLoad('QuizMode'); // Précharger avant click
  },
  { once: true }
);
```

### 3. Optimiser Event Bus

**Profiler événements :**

```javascript
// core/eventBus.js
export function emit(event, data) {
  const startTime = performance.now();

  const listeners = eventListeners.get(event) || [];
  listeners.forEach(listener => {
    listener(data);
  });

  const duration = performance.now() - startTime;

  // Alert si event handling lent
  if (duration > 5) {
    console.warn(`⚠️ Slow event '${event}': ${duration.toFixed(2)}ms`);
  }
}
```

**Optimisation :**

```javascript
// ❌ Mauvais : Trop d'événements
eventBus.on('sprite:move', sprite => {
  updateUI(); // À chaque mouvement de sprite !
});

// ✅ Bon : Debounce ou throttle
import { debounce } from './utils.js';

const debouncedUpdateUI = debounce(updateUI, 100);

eventBus.on('sprite:move', sprite => {
  debouncedUpdateUI();
});
```

### 4. Optimiser Storage

**Profiler accès localStorage :**

```javascript
// core/storage.js
export default class Storage {
  static get(key, defaultValue = null) {
    const startTime = performance.now();

    try {
      const item = localStorage.getItem(key);
      const value = item ? JSON.parse(item) : defaultValue;

      const duration = performance.now() - startTime;
      if (duration > 10) {
        console.warn(`⚠️ Slow storage read '${key}': ${duration.toFixed(2)}ms`);
      }

      return value;
    } catch (error) {
      return defaultValue;
    }
  }
}
```

**Cache en mémoire :**

```javascript
// Cache pour réduire accès localStorage
const storageCache = new Map();

export default class Storage {
  static get(key, defaultValue = null) {
    // Vérifier cache d'abord
    if (storageCache.has(key)) {
      return storageCache.get(key);
    }

    // Lire depuis localStorage
    const value = this.readFromStorage(key, defaultValue);

    // Cacher en mémoire
    storageCache.set(key, value);

    return value;
  }

  static set(key, value) {
    // Mettre à jour cache
    storageCache.set(key, value);

    // Persister
    this.writeToStorage(key, value);
  }

  static invalidateCache(key) {
    storageCache.delete(key);
  }
}
```

## Patterns d'optimisation

### 1. Debouncing

```javascript
/**
 * Debounce une fonction (exécute après délai d'inactivité)
 *
 * @param {Function} func - Fonction à debounce
 * @param {number} wait - Délai en ms
 * @returns {Function} Fonction debouncée
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Utilisation
const debouncedSave = debounce(saveUserData, 1000);
input.addEventListener('input', debouncedSave);
```

### 2. Throttling

```javascript
/**
 * Throttle une fonction (exécute au maximum une fois par intervalle)
 *
 * @param {Function} func - Fonction à throttle
 * @param {number} limit - Intervalle minimum en ms
 * @returns {Function} Fonction throttlée
 */
export function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Utilisation
const throttledScroll = throttle(handleScroll, 100);
window.addEventListener('scroll', throttledScroll);
```

### 3. Memoization

```javascript
/**
 * Memoize une fonction (cache résultats)
 *
 * @param {Function} func - Fonction à memoize
 * @returns {Function} Fonction memoizée
 */
export function memoize(func) {
  const cache = new Map();
  return function memoized(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func(...args);
    cache.set(key, result);
    return result;
  };
}

// Utilisation
const memoizedFactorial = memoize(n => {
  if (n <= 1) return 1;
  return n * memoizedFactorial(n - 1);
});

memoizedFactorial(10); // Calcule
memoizedFactorial(10); // Cache (instant)
```

### 4. RequestAnimationFrame batching

```javascript
// Batch des mises à jour DOM
const pendingUpdates = [];
let rafScheduled = false;

export function scheduleUpdate(updateFn) {
  pendingUpdates.push(updateFn);

  if (!rafScheduled) {
    rafScheduled = true;
    requestAnimationFrame(() => {
      pendingUpdates.forEach(fn => fn());
      pendingUpdates.length = 0;
      rafScheduled = false;
    });
  }
}

// Utilisation
function updateScore(newScore) {
  scheduleUpdate(() => {
    scoreElement.textContent = newScore;
  });
}
```

## Checklist optimisation

- [ ] Lighthouse Performance > 90
- [ ] FPS ≥ 60 dans jeux arcade
- [ ] Lazy loading implémenté pour gros modules
- [ ] Event listeners nettoyés dans cleanup()
- [ ] Timers clearés proprement
- [ ] Pas de memory leaks (heap snapshot stable)
- [ ] Bundle JS initial < 200 KB
- [ ] Debounce/throttle sur événements fréquents
- [ ] Cache utilisé pour calculs coûteux
- [ ] Assets optimisés (images compressées)
- [ ] Service Worker cache stratégique
- [ ] Performance marks sur opérations critiques

## Outils et commandes

```bash
# Lighthouse audit complet
npx lighthouse http://localhost:8000 --view

# Performance seulement
npx lighthouse http://localhost:8000 --only-categories=performance

# Analyser dépendances
npm run analyze:dependencies

# Détecter code mort
npm run verify:dead-code

# Tests de performance (Jest)
npm run test -- performance.test.js
```

## Expert Agents to Use

Quand tu travailles sur l'optimisation de performance, utilise ces agents spécialisés :

- **@performance-analyzer** - Expert performance pour :
  - Lighthouse audits et Core Web Vitals (LCP, CLS, TBT)
  - Memory leak detection (Heap snapshots, MemLab, Fuite)
  - FPS profiling et frame timing
  - Bundle size analysis
  - Service worker cache optimization
  - JavaScript execution profiling
  - Asset loading optimization
  - Network performance analysis

- **@arcade-specialist** - Pour optimiser jeux arcade :
  - Canvas rendering performance (60 FPS)
  - Game loop optimization
  - Collision detection optimization
  - Memory management dans jeux

- **@pwa-expert** - Pour optimisation PWA :
  - Service worker cache strategies
  - Offline performance
  - Cache versioning

## Voir aussi

- `bundle-size-optimizer/SKILL.md` - Optimisation taille bundles
- `asset-optimizer/SKILL.md` - Optimisation assets et images
- `pwa-service-worker/SKILL.md` - Stratégies de cache
- `tdd-jest/SKILL.md` - Tests de performance automatisés
- `CLAUDE.md` - Architecture du projet
