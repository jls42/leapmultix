---
name: 'Bundle Size Optimizer'
description: "Analyse et réduit la taille des bundles JavaScript pour chargement rapide. Utiliser lors d'ajout de dépendances, avant release, ou si bundle > 200 KB"
---

# Bundle Size Optimizer

Cette skill guide l'optimisation de la taille des bundles JavaScript pour un chargement rapide.

## Quand utiliser cette skill

- Ajout de nouvelles dépendances
- Bundle initial > 200 KB
- Temps de chargement élevé
- Avant chaque release
- Audit de code mort
- Optimisation mobile (3G/4G)

## Objectifs de taille

**Cibles leapmultix :**

- Bundle initial (critical path) : < 100 KB (gzipped)
- Bundle total (avec lazy loaded) : < 500 KB
- Modules individuels : < 50 KB
- Assets critiques : < 200 KB

## Analyse actuelle leapmultix

### Modules par taille

```javascript
// Modules les plus lourds (non-gzipped)
const moduleSizes = {
  'multisnake.js': 38, // Jeu Snake
  'arcade-invasion.js': 31, // Space Invaders
  'arcade-multimemory.js': 31, // Memory game
  'userManager.js': 19, // Gestion utilisateurs
  'multimiam-engine.js': 15, // Engine Multimiam
  'VideoManager.js': 12, // Vidéo
  'cache-updater.js': 10, // Cache PWA
  'core/utils.js': 10, // Utilitaires
};

// Total: ~167 KB de JS (avant gzip)
// Après gzip: ~50-60 KB estimé
```

### Stratégie actuelle (✅ Déjà optimisée)

Le projet utilise déjà **lazy loading** via `lazy-loader.js` :

- Jeux arcade chargés à la demande
- Modes de jeu lazy loaded
- Économie estimée : ~120 KB sur chargement initial

## Commandes d'analyse

### Analyser dépendances

```bash
npm run analyze:dependencies
```

Analyse quels modules sont importés et leur utilisation.

### Détecter code mort

```bash
npm run verify:dead-code
```

Identifie fonctions et variables non utilisées.

### Analyser globals

```bash
npm run analyze:globals
```

Vérifie variables globales et fuites potentielles.

## Stratégies d'optimisation

### 1. Tree Shaking

**Principe :** Éliminer le code non utilisé

**Import optimal :**

```javascript
// ❌ Mauvais : Importe tout le module
import * as utils from './utils.js';
utils.shuffle([1, 2, 3]);

// ✅ Bon : Importe seulement ce qui est utilisé
import { shuffle } from './utils.js';
shuffle([1, 2, 3]);

// ❌ Mauvais : Import de gros modules externes
import _ from 'lodash'; // ~70 KB !

// ✅ Bon : Import spécifique
import shuffle from 'lodash/shuffle'; // ~5 KB
```

**Exports optimisés :**

```javascript
// utils.js - Permettre tree shaking

// ❌ Mauvais : Export default d'objet
export default {
  shuffle,
  random,
  clamp,
  debounce,
};

// ✅ Bon : Named exports
export function shuffle(array) {
  /* ... */
}
export function random(min, max) {
  /* ... */
}
export function clamp(value, min, max) {
  /* ... */
}
export function debounce(func, wait) {
  /* ... */
}
```

### 2. Code Splitting

**Principe :** Diviser le code en chunks chargés à la demande

**Pattern leapmultix (déjà implémenté) :**

```javascript
// lazy-loader.js
const MODE_CONFIGS = {
  arcade: {
    module: () => import('./modes/ArcadeMode.js'),
    size: '31 KB',
  },
  invasion: {
    module: () => import('./arcade-invasion.js'),
    size: '31 KB',
  },
};

// Charger à la demande
async function loadMode(modeName) {
  const config = MODE_CONFIGS[modeName];
  const module = await config.module();
  return module.default;
}
```

**Opportunités supplémentaires :**

```javascript
// Lazy load components lourds
const VideoManager = () => import('./VideoManager.js'); // 12 KB

// Charger seulement si vidéo nécessaire
async function playVideo(videoSrc) {
  const { default: VM } = await VideoManager();
  const manager = new VM();
  manager.play(videoSrc);
}
```

### 3. Minification

**Terser (minifier moderne) :**

```javascript
// package.json - Si build ajouté
{
  "scripts": {
    "build": "rollup -c",
    "build:analyze": "rollup -c --environment ANALYZE"
  },
  "devDependencies": {
    "rollup": "^3.0.0",
    "rollup-plugin-terser": "^7.0.2"
  }
}
```

**rollup.config.js :**

```javascript
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'js/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    terser({
      compress: {
        drop_console: true, // Retirer console.log en prod
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug'],
      },
      mangle: {
        reserved: ['GameMode', 'Storage'], // Garder noms importants
      },
    }),
  ],
};
```

### 4. Éliminer duplications

**Détecter duplications :**

```bash
# Trouver code similaire
npx jscpd js/**/*.js

# Résultat :
# arcade-invasion.js et arcade-multimemory.js
# ont 15 lignes dupliquées
```

**Extraire code commun :**

```javascript
// arcade-common.js - Fonctions partagées
export class ArcadeBase {
  constructor(canvas, options) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.score = 0;
    this.isPlaying = false;
  }

  start() {
    this.isPlaying = true;
    this.gameLoop();
  }

  stop() {
    this.isPlaying = false;
  }

  gameLoop() {
    if (!this.isPlaying) return;

    this.update();
    this.render();
    requestAnimationFrame(() => this.gameLoop());
  }

  // À implémenter par sous-classes
  update() {
    throw new Error('Must implement update()');
  }

  render() {
    throw new Error('Must implement render()');
  }
}

// arcade-invasion.js - Utiliser base
import { ArcadeBase } from './arcade-common.js';

export class ArcadeInvasion extends ArcadeBase {
  update() {
    // Logic spécifique Invasion
  }

  render() {
    // Render spécifique Invasion
  }
}
```

### 5. Polyfills conditionnels

**Charger polyfills seulement si nécessaires :**

```javascript
// Vérifier support natif
async function loadPolyfillsIfNeeded() {
  const polyfills = [];

  // IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    polyfills.push(import('intersection-observer'));
  }

  // ResizeObserver
  if (!('ResizeObserver' in window)) {
    polyfills.push(import('@juggle/resize-observer'));
  }

  // Charger en parallèle
  await Promise.all(polyfills);
}

// Charger avant init
await loadPolyfillsIfNeeded();
init();
```

## Outils d'analyse

### 1. Bundle Analyzer

**Installation :**

```bash
npm install --save-dev rollup-plugin-visualizer
```

**Configuration :**

```javascript
// rollup.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  // ... config
  plugins: [
    visualizer({
      filename: 'docs/bundle-stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
};
```

**Résultat :** Graphique interactif montrant taille de chaque module

### 2. Webpack Bundle Analyzer (si migration)

```bash
npm install --save-dev webpack-bundle-analyzer
```

```javascript
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [new BundleAnalyzerPlugin()],
};
```

### 3. Source Map Explorer

```bash
npm install --save-dev source-map-explorer

# Analyser bundle
npx source-map-explorer dist/bundle.js dist/bundle.js.map
```

## Audit de code mort

### Commande existante

```bash
npm run verify:dead-code
```

### Supprimer code inutilisé

**Identifier exports non utilisés :**

```bash
# Avec grep
grep -r "export.*function" js/ | cut -d: -f2 | sort | uniq

# Comparer avec imports
grep -r "import.*from" js/ | cut -d'{' -f2 | cut -d'}' -f1
```

**Exemples à retirer :**

```javascript
// helpers.js

// ❌ Fonction jamais importée ailleurs
export function unusedHelper() {
  // Code mort - retirer
}

// ✅ Fonction utilisée - garder
export function usedHelper() {
  // Importée dans 3 fichiers
}
```

## Optimisation des imports

### Imports dynamiques

**Charger à la demande :**

```javascript
// ❌ Mauvais : Import statique lourd
import HeavyLibrary from 'heavy-library'; // 100 KB

function maybeUseLibrary(condition) {
  if (condition) {
    HeavyLibrary.doSomething();
  }
}

// ✅ Bon : Import dynamique
async function maybeUseLibrary(condition) {
  if (condition) {
    const { default: HeavyLibrary } = await import('heavy-library');
    HeavyLibrary.doSomething();
  }
}
```

### Imports groupés

```javascript
// ❌ Mauvais : Multiples imports du même module
import { shuffle } from './utils.js';
import { random } from './utils.js';
import { clamp } from './utils.js';

// ✅ Bon : Import groupé
import { shuffle, random, clamp } from './utils.js';
```

## Compression

### Gzip

**Configuration serveur (Nginx) :**

```nginx
# nginx.conf
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types
  text/css
  text/javascript
  application/javascript
  application/json;
```

**Résultats typiques :**

- JS non compressé : 200 KB
- JS gzippé : 60 KB (-70%)

### Brotli (meilleur que gzip)

```nginx
# nginx.conf
brotli on;
brotli_comp_level 6;
brotli_types
  text/css
  text/javascript
  application/javascript
  application/json;
```

**Résultats typiques :**

- JS non compressé : 200 KB
- JS brotli : 50 KB (-75%)

## Patterns d'optimisation

### 1. Lazy evaluation

```javascript
// ❌ Calcul immédiat (pas toujours nécessaire)
const expensiveResult = computeExpensive();

function maybeUse() {
  if (condition) {
    return expensiveResult;
  }
}

// ✅ Calcul lazy (seulement si nécessaire)
let expensiveResult;

function maybeUse() {
  if (condition) {
    if (!expensiveResult) {
      expensiveResult = computeExpensive();
    }
    return expensiveResult;
  }
}
```

### 2. Module federation

**Partager modules entre applications :**

```javascript
// webpack.config.js
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'leapmultix',
      filename: 'remoteEntry.js',
      exposes: {
        './GameMode': './js/core/GameMode.js',
        './Utils': './js/core/utils.js',
      },
      shared: {
        // Partager dépendances communes
      },
    }),
  ],
};
```

### 3. Prefetch/Preload

```html
<!-- Preload : Ressource critique (haute priorité) -->
<link rel="preload" href="/js/main.js" as="script" />

<!-- Prefetch : Ressource future (basse priorité) -->
<link rel="prefetch" href="/js/arcade-invasion.js" />

<!-- Preconnect : Connection future -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
```

```javascript
// Prefetch programmatique
function prefetchModule(modulePath) {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = modulePath;
  link.as = 'script';
  document.head.appendChild(link);
}

// Prefetch au hover
document.querySelector('.arcade-btn').addEventListener(
  'mouseenter',
  () => {
    prefetchModule('/js/arcade-invasion.js');
  },
  { once: true }
);
```

## Mesurer l'impact

### Avant/Après

```javascript
// Mesurer taille bundle
const fs = require('fs');
const zlib = require('zlib');

function measureBundle(filePath) {
  const content = fs.readFileSync(filePath);
  const gzipped = zlib.gzipSync(content);

  console.log({
    file: filePath,
    raw: `${(content.length / 1024).toFixed(2)} KB`,
    gzip: `${(gzipped.length / 1024).toFixed(2)} KB`,
    ratio: `${((1 - gzipped.length / content.length) * 100).toFixed(1)}%`,
  });
}

// Mesurer
measureBundle('dist/bundle.js');
```

### Lighthouse CI

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install && npm run build
      - run: npm install -g @lhci/cli
      - run: lhci autorun
```

## Checklist optimisation

- [ ] Lazy loading implémenté (déjà ✅ dans leapmultix)
- [ ] Imports spécifiques (pas de `import *`)
- [ ] Code mort identifié et retiré
- [ ] Duplications extraites en modules communs
- [ ] Minification en production (terser/uglify)
- [ ] Gzip/Brotli activé sur serveur
- [ ] Bundle analyzer exécuté
- [ ] Source maps générées
- [ ] Polyfills conditionnels
- [ ] Prefetch modules probables
- [ ] Bundle initial < 100 KB (gzip)

## Commandes rapides

```bash
# Analyser bundle size
npm run analyze:dependencies

# Détecter code mort
npm run verify:dead-code

# Build avec analyse (si build ajouté)
npm run build:analyze

# Mesurer impact gzip
gzip -c dist/bundle.js | wc -c
```

## Voir aussi

- `performance-profiler/SKILL.md` - Analyse performance globale
- `asset-optimizer/SKILL.md` - Optimisation images et assets
- `pwa-service-worker/SKILL.md` - Stratégies de cache
- `CLAUDE.md` - Architecture et modules du projet
