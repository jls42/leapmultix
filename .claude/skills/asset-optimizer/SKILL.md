---
name: 'asset-optimizer'
description: "Optimise images, sprites, sons et médias pour réduire bande passante et améliorer chargement. Utiliser avant d'ajouter gros assets ou lors d'optimisation mobile"
---

# Asset Optimizer

Optimise images, sprites, sons, vidéos pour chargement rapide et performance mobile.

## Quand utiliser

- Avant ajouter images/sprites
- Assets > 100 KB
- Optimisation mobile (3G/4G)
- Audit Lighthouse Performance
- PWA bande passante
- Images non responsive

## Objectifs de taille

- Images PNG: < 50 KB, JPG: < 30 KB
- Audio: < 50 KB (96-128 kbps)
- Sprites: < 100 KB total
- Total first load: < 2 MB
- Lighthouse Performance: > 90

## Principes essentiels

**Images :**

- Compresse (TinyPNG, Squoosh): -30-50% PNG, -20-40% JPG
- WebP + fallback PNG/JPG (-25% vs JPG)
- Responsive (1x, 2x, 3x via srcset)
- Lazy loading (loading="lazy" ou Intersection Observer)

**Audio :**

- Bitrate: 96 kbps effets, 128 kbps musique
- Formats: MP3 + OGG/WebM (compatibilité)
- Preload sons critiques

**Sprites :**

- Combiner en sheets (moins requêtes HTTP)
- SVG icônes (scalable, modifiable CSS)
- Optimize avec SVGO

**Cache :**

- cache-updater.js (versioning auto)
- responsive-image-loader.js (chargement adapté densité)

## Workflow

1. **Analyser :** `npm run assets:analyze`
2. **Compresser :** Images TinyPNG/Squoosh, audio bitrate
3. **Intégrer :** Respecter patterns existants (loaders, versioning)
4. **Vérifier :** `npm run assets:diff`, Lighthouse > 90

## Checklist

**Images :**

- [ ] Compressées (TinyPNG/Squoosh)
- [ ] WebP + fallback PNG/JPG
- [ ] Responsive si > 50 KB (srcset)
- [ ] Lazy loading si hors-viewport
- [ ] Alt text présent
- [ ] Versioning cache-updater.js

**Audio :**

- [ ] Bitrate optimisé (96-128 kbps)
- [ ] Formats multiples (MP3 + OGG)
- [ ] < 50 KB par fichier
- [ ] Preload si critique

**Général :**

- [ ] assets:analyze exécuté
- [ ] assets:diff vérifié
- [ ] Lighthouse > 90
- [ ] First load < 2 MB

## En cas de doute

**Règles absolues :**

1. Compresse TOUJOURS (TinyPNG/Squoosh)
2. WebP + fallback PNG/JPG
3. Versioning via cache-updater.js
4. Lighthouse > 90 OBLIGATOIRE

**Outils :**

- TinyPNG/Squoosh - Compression (web)
- ffmpeg - Audio/vidéo (CLI)
- Lighthouse - Vérification

**Modules clés :**

- responsive-image-loader.js (9 KB)
- cache-updater.js (10 KB)
- npm run assets:\*

**Où chercher :**

- responsive-image-loader.js - Chargement images
- cache-updater.js - Versioning
- assets/ - Organisation actuelle
- npm run assets:analyze - État
