---
name: 'Asset Optimizer'
description: "Optimise images, sprites, sons et médias pour réduire bande passante et améliorer chargement. Utiliser avant d'ajouter gros assets ou lors d'optimisation mobile"
---

# Asset Optimizer

Cette skill guide l'optimisation des assets (images, sprites, sons, vidéos) pour un chargement rapide.

## Quand utiliser cette skill

- Avant d'ajouter de nouvelles images/sprites
- Assets > 100 KB individuellement
- Optimisation mobile (3G/4G)
- Audit performance Lighthouse
- Réduction bande passante PWA
- Images non responsive

## Commandes disponibles

```bash
npm run assets:generate    # Générer versions responsive
npm run assets:analyze     # Analyser utilisation assets
npm run assets:diff        # Comparer avant/après
```

## Objectifs d'optimisation

**Images :**

- PNG : < 50 KB par image
- JPG : < 30 KB par image
- WebP : -25% vs JPG
- Sprites sheets : < 100 KB total

**Audio :**

- MP3 : < 50 KB par son
- Formats multiples (MP3, OGG, WebM)
- Bitrate : 96-128 kbps suffisant

## Optimisation des images

### 1. Compression sans perte

**Outils :**

```bash
# ImageOptim (Mac)
# TinyPNG (web)
# Squoosh (web, Google)

# CLI
npm install -g imagemin-cli

imagemin assets/sprites/*.png --out-dir=assets/sprites/optimized
```

**Résultats typiques :**

- PNG : -30% à -50%
- JPG : -20% à -40%
- Qualité visuelle : identique

### 2. Formats modernes

**WebP (meilleur compression que JPG) :**

```bash
# Installer cwebp
sudo apt install webp

# Convertir PNG→WebP
cwebp -q 80 input.png -o output.webp

# Convertir JPG→WebP
cwebp -q 80 input.jpg -o output.webp
```

**Utilisation avec fallback :**

```html
<picture>
  <source srcset="monster.webp" type="image/webp" />
  <source srcset="monster.png" type="image/png" />
  <img src="monster.png" alt="Monster sprite" />
</picture>
```

**AVIF (encore meilleur que WebP) :**

```html
<picture>
  <source srcset="bg.avif" type="image/avif" />
  <source srcset="bg.webp" type="image/webp" />
  <img src="bg.jpg" alt="Background" />
</picture>
```

### 3. Images responsive

**Générer multiples résolutions :**

```bash
# Script déjà disponible
npm run assets:generate
```

**Utilisation avec srcset :**

```html
<img
  src="sprite.png"
  srcset="sprite-1x.png 1x, sprite-2x.png 2x, sprite-3x.png 3x"
  alt="Sprite"
  width="64"
  height="64"
/>
```

**Module responsive-image-loader.js (9 KB) :**

```javascript
import { loadResponsiveImage } from './responsive-image-loader.js';

// Charge image adaptée à la densité écran
loadResponsiveImage('monster', {
  '1x': 'monster-1x.png',
  '2x': 'monster-2x.png',
  '3x': 'monster-3x.png',
});
```

### 4. Lazy loading images

**Native lazy loading :**

```html
<img src="large-image.png" loading="lazy" alt="Large image" />
```

**Intersection Observer :**

```javascript
const imageObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      imageObserver.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});
```

```html
<img data-src="real-image.png" src="placeholder.png" alt="Lazy image" />
```

## Optimisation des sprites

### 1. Sprite sheets

**Combiner sprites en sheet :**

```
Avant (4 fichiers):
- monster1.png : 10 KB
- monster2.png : 10 KB
- monster3.png : 10 KB
- monster4.png : 10 KB
Total : 40 KB + 4 requêtes HTTP

Après (1 fichier):
- monsters-sheet.png : 35 KB (-12%)
Total : 35 KB + 1 requête HTTP
```

**Génération de sprite sheet :**

```bash
# Avec spritesmith
npm install --save-dev spritesmith

# Générer sheet
spritesmith monster*.png -o monsters-sheet.png --cssFormat css
```

**Utilisation CSS :**

```css
.sprite {
  background-image: url('monsters-sheet.png');
  background-repeat: no-repeat;
  display: inline-block;
}

.monster1 {
  width: 64px;
  height: 64px;
  background-position: 0 0;
}

.monster2 {
  width: 64px;
  height: 64px;
  background-position: -64px 0;
}
```

### 2. SVG pour icônes

**Avantages :**

- Taille très petite
- Scalable (pas de perte qualité)
- Modifiable via CSS

```html
<!-- Inline SVG -->
<svg width="24" height="24" viewBox="0 0 24 24">
  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
</svg>

<!-- Avec sprite SVG -->
<svg class="icon">
  <use xlink:href="icons.svg#star"></use>
</svg>
```

**Optimiser SVG :**

```bash
npm install -g svgo

# Optimiser SVG
svgo input.svg -o output.svg

# Optimiser dossier
svgo -f assets/icons/
```

## Optimisation audio

### 1. Compression MP3

**Bitrate recommandé :**

- Effets sonores : 96 kbps (suffisant)
- Musique : 128 kbps
- Voix : 64 kbps

**Conversion :**

```bash
# Avec ffmpeg
ffmpeg -i input.wav -b:a 96k output.mp3

# Batch conversion
for f in *.wav; do
  ffmpeg -i "$f" -b:a 96k "${f%.wav}.mp3"
done
```

### 2. Formats multiples

**Compatibilité navigateurs :**

```html
<audio>
  <source src="sound.webm" type="audio/webm" />
  <source src="sound.mp3" type="audio/mpeg" />
  <source src="sound.ogg" type="audio/ogg" />
</audio>
```

**Génération formats :**

```bash
# MP3→OGG
ffmpeg -i input.mp3 -c:a libvorbis -q:a 4 output.ogg

# MP3→WebM
ffmpeg -i input.mp3 -c:a libopus -b:a 96k output.webm
```

### 3. Preload audio critique

```html
<!-- Preload son important -->
<link rel="preload" href="correct-sound.mp3" as="audio" />
```

```javascript
// Preload programmatique
const audio = new Audio();
audio.preload = 'auto';
audio.src = 'correct-sound.mp3';
```

## Module cache-updater.js

Le projet a déjà un système de versioning des assets (10 KB) :

```javascript
import { versionImageSrc, updateBackgroundImage } from './cache-updater.js';

// Ajouter version automatiquement
const imgSrc = versionImageSrc('/assets/sprite.png');
// Résultat : /assets/sprite.png?v=1.2.3

// Mettre à jour background
updateBackgroundImage(element, '/assets/bg.png');
// Applique : background-image: url(/assets/bg.png?v=1.2.3)
```

**Avantages :**

- Cache busting automatique
- Pas besoin de renommer fichiers
- Version synchronisée avec app

## Patterns d'optimisation

### 1. Placeholders et progressive loading

**LQIP (Low Quality Image Placeholder) :**

```html
<img
  src="placeholder-tiny-blurred.jpg"  <!-- 2 KB -->
  data-src="real-image.jpg"           <!-- 50 KB -->
  class="lazyload"
  alt="Image">
```

```css
.lazyload {
  filter: blur(10px);
  transition: filter 0.3s;
}

.lazyload.loaded {
  filter: blur(0);
}
```

### 2. Image CDN

**Utiliser CDN d'images :**

- Cloudinary
- imgix
- Cloudflare Images

**Avantages :**

- Optimisation automatique
- Resize à la volée
- Formats modernes auto
- Cache global

**Exemple Cloudinary :**

```javascript
// URL dynamique avec transformations
const cloudinaryUrl = (imageId, width) => {
  return `https://res.cloudinary.com/demo/image/upload/w_${width},f_auto,q_auto/${imageId}`;
};

// Générer URL
const url = cloudinaryUrl('monster', 400);
// https://res.cloudinary.com/.../w_400,f_auto,q_auto/monster
// Auto: WebP si supporté, qualité optimale
```

### 3. Base64 inline pour petits assets

**Pour icônes < 2 KB :**

```css
.icon-small {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aW...);
}
```

**Avantages :**

- 0 requête HTTP supplémentaire
- Embarqué dans CSS

**Inconvénients :**

- Augmente taille CSS
- Pas cacheable séparément
- Réservé aux très petits assets

## Checklist optimisation

**Images :**

- [ ] Compressées (TinyPNG, Squoosh)
- [ ] WebP généré avec fallback PNG/JPG
- [ ] Responsive (srcset avec 1x, 2x, 3x)
- [ ] Lazy loading implémenté
- [ ] Sprite sheets pour petites images
- [ ] SVG pour icônes
- [ ] Alt text sur toutes les images

**Audio :**

- [ ] Bitrate optimisé (96-128 kbps)
- [ ] Formats multiples (MP3, OGG, WebM)
- [ ] Preload pour sons critiques
- [ ] Taille < 50 KB par fichier

**Général :**

- [ ] Cache-updater versioning activé
- [ ] Lighthouse Performance > 90
- [ ] Total assets < 2 MB first load
- [ ] CDN configuré si disponible

## Outils recommandés

**Compression images :**

- TinyPNG (web) : https://tinypng.com
- Squoosh (web) : https://squoosh.app
- ImageOptim (Mac) : https://imageoptim.com

**Conversion formats :**

- cwebp (WebP CLI)
- ffmpeg (Audio/Vidéo)
- svgo (SVG optimization)

**Analyse :**

- Lighthouse (Chrome DevTools)
- PageSpeed Insights (Google)
- WebPageTest

## Scripts projet

```bash
# Générer assets responsive
npm run assets:generate

# Analyser utilisation
npm run assets:analyze

# Comparer changements
npm run assets:diff
```

## Voir aussi

- `bundle-size-optimizer/SKILL.md` - Optimisation JS
- `performance-profiler/SKILL.md` - Performance globale
- `pwa-service-worker/SKILL.md` - Cache assets
- `js/cache-updater.js` - Versioning assets (10 KB)
- `js/responsive-image-loader.js` - Chargement responsive (9 KB)
