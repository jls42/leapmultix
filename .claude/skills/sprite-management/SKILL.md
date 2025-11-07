---
name: managing-sprites
description: Manages sprites, sprite sheets, sprite animations for arcade games (loading, rendering, collisions). Use when creating games or adding animated characters
allowed-tools: Read, Write, Grep, Glob, Bash
---

# Gestion des Sprites

Guide la gestion des sprites et sprite sheets pour les jeux arcade.

## Quand utiliser

- Ajout de nouveaux personnages/ennemis
- Création de sprite sheets
- Animations de sprites
- Détection de collisions
- Optimisation rendu sprites

## Sprites dans le projet

Trouve dans le code :

- Personnages joueurs
- Monstres et ennemis
- Power-ups et collectibles
- Sprite sheets existants

**Formats :**

- PNG avec transparence
- Sprite sheets (multiples frames)
- Résolutions multiples (@1x, @2x, @3x)

Examine le répertoire assets/sprites.

## Types de sprites

### 1. Sprite simple

Image statique, pas d'animation, position et taille fixes.

### 2. Sprite Sheet

**Multiple frames dans une image :**

- Layout horizontal (frames en ligne)
- Layout grille (frames en grille)
- Permet animations fluides

**Layouts courants :**

- Horizontal : 8 frames × 64px = 512×64px
- Grille 4×4 : 16 frames de 64×64px = 256×256px
- Par row : Chaque ligne = animation différente

Trouve les sprite sheets existants.

### 3. Sprite animé

**Animation frame par frame :**

- FPS configurable
- Boucle automatique
- Delta time pour smoothness

### 4. Sprite directionnel

**Différentes animations par direction :**

- Idle, Walk, Jump par direction
- Row dans sprite sheet par action
- State machine pour transitions

## Concepts clés

### Chargement d'images

**Asynchrone :**

- `Image.onload` pour savoir quand prêt
- Précharger avant utilisation
- Placeholder ou loading si nécessaire

Trouve comment le projet gère le chargement.

### Rendering

**Canvas drawImage() :**

- Source rectangle (quelle partie du sprite sheet)
- Destination rectangle (où dessiner)
- Scaling automatique si tailles différentes

Examine les fonctions de rendu dans les jeux.

### Collision Detection

**Techniques disponibles :**

- Bounding box (AABB) - Simple et rapide
- Collision circulaire - Pour objets ronds
- Pixel-perfect - Précis mais coûteux
- Hitbox personnalisée - Compromise

Trouve les fonctions de collision utilisées.

### Animation State Machine

**États et transitions :**

- IDLE → WALK → JUMP → FALL → IDLE
- Changement frame selon elapsed time
- Loop ou one-shot selon animation

Examine les state machines dans les jeux arcade.

## Classes et structures recommandées

Trouve dans le code :

- Classe Sprite de base
- Classe AnimatedSprite
- Manager de sprites (pool, loading)
- Helpers de collision

Examine l'architecture existante.

## Optimisations

### Performance

- **Sprite pooling** : Réutiliser instances au lieu de créer/détruire
- **Dirty flag** : Re-draw seulement si changement
- **Offscreen culling** : Pas de rendu si hors écran
- **Batch rendering** : Grouper draw calls

### Mémoire

- **Atlas textures** : Combiner sprites dans une texture
- **Lazy loading** : Charger sprites au besoin
- **Image scaling** : Charger résolution appropriée (@1x, @2x)
- **Cleanup** : Libérer sprites inutilisés

Cherche les optimisations déjà en place.

## Workflow de création sprite

### 1. Design sprite sheet

- Définir taille frame (64×64, 128×128, etc.)
- Organiser layout (horizontal, grille)
- Créer frames avec transparence PNG

### 2. Intégration code

- Charger sprite sheet
- Définir source rectangles par frame
- Setup animation (FPS, frames, loop)
- Render à chaque frame du jeu

### 3. Collision setup

- Définir hitbox pour collision
- Tester collisions avec autres sprites
- Ajuster hitbox si nécessaire

### 4. Tests et debug

- Afficher hitboxes en mode debug
- Vérifier timing animations
- Tester performance avec multiples sprites

## Checklist sprite

- [ ] Sprite sheet créé avec transparence PNG
- [ ] Layout défini (horizontal/grille)
- [ ] Frames chargées correctement
- [ ] Animations fluides (FPS approprié)
- [ ] Collisions détectées correctement
- [ ] Hitboxes ajustées
- [ ] Performance acceptable (60 FPS)
- [ ] Cleanup mémoire implémenté

## En cas de doute

**Source :** Jeux arcade existants + sprite utils

**Règles absolues :**

1. Toujours précharger sprites avant utilisation
2. Utiliser delta time pour animations fluides
3. Bounding box (AABB) pour la plupart des collisions
4. Sprite pooling si > 10 instances simultanées
5. Cleanup sprites inutilisés pour éviter memory leaks

**Workflow minimal :**

- Charger sprite sheet avec Image.onload
- drawImage() avec source/destination rectangles
- Collision AABB pour détection rapide
