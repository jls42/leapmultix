---
name: 'Arcade Game Creator'
description: 'Crée des jeux arcade canvas HTML5 suivant les patterns leapmultix (Multimiam, Multisnake, Invasion). Utiliser lors de création de nouveaux mini-jeux arcade'
---

# Arcade Game Creator

Guide la création de nouveaux jeux arcade canvas pour le mode Arcade.

## Quand utiliser

- Création d'un nouveau jeu arcade
- Extension du mode Arcade
- Adaptation de jeux existants
- Prototypage de mini-jeux

## Jeux existants (références)

### Architecture simple

**Arcade Multi Memory** (31 KB) :

- Jeu de memory matching
- Structure monolithique simple
- Bon point de départ

**Arcade Invasion** (31 KB) :

- Space Invaders style
- Gestion d'entités multiples
- Pattern de vagues d'ennemis

### Architecture décomposée

**Multimiam** (architecture modulaire) :

- Point d'entrée + modules séparés
- Engine (logique), Renderer (rendu), Controls (inputs), Questions (multiplication)
- Meilleure maintenabilité

**Multisnake** (38 KB) :

- Structure plus monolithique
- Gestion de grille

## Patterns architecturaux

### Pattern monolithique

Tout dans un fichier. Simple pour jeux petits.

**Quand utiliser** : Jeux simples, prototypes

### Pattern décomposé

Séparation en modules (Engine, Renderer, Controls, Questions).

**Quand utiliser** : Jeux complexes, maintenance long terme

Examine Multimiam pour voir ce pattern en action.

## Composants essentiels

### Game Loop

Boucle continue : update → render → next frame (requestAnimationFrame)

### Système de rendu Canvas

Clear canvas → Draw entities → Draw UI

### Gestion des inputs

Support clavier ET touch pour mobile

### Intégration questions multiplication

Questions intégrées au gameplay, pas séparées

Cherche ces patterns dans les jeux existants.

## Workflow de création

### Étape 1 : Choisir un jeu de référence

Identifie le jeu existant qui ressemble le plus au tien :

- Jeu de puzzle/memory → arcade-multimemory.js
- Jeu de tir/action → arcade-invasion.js
- Jeu de grille → multisnake.js

### Étape 2 : Décider de l'architecture

**Jeu simple** : Fichier unique `arcade-new-game.js`

**Jeu complexe** : Fichiers multiples

- `new-game.js` (point d'entrée)
- `new-game-engine.js` (logique)
- `new-game-renderer.js` (rendu)
- `new-game-controls.js` (inputs)

### Étape 3 : Comprendre le pattern de référence

Examine le jeu choisi :

- Comment l'initialisation fonctionne ?
- Comment le game loop est structuré ?
- Comment le rendu est organisé ?
- Comment les questions sont intégrées ?

Adapte (ne copie pas aveuglément).

### Étape 4 : Intégrer dans mode Arcade

Trouve où les jeux arcade sont enregistrés.
Ajoute ton jeu suivant le même pattern.

### Étape 5 : Ajouter UI et traductions

- Ajoute bouton dans HTML (cherche structure existante)
- Crée traductions (fr → en → es)
- Vérifie synchronisation i18n

## Patterns de gameplay

### Collision detection

Cherche comment les jeux existants détectent les collisions (AABB pattern courant).

### Spawning d'entités

Trouve comment les ennemis/objets sont créés dans les jeux.

### Scoring et progression

Examine les systèmes de score et de niveaux dans les jeux existants.

## Performance (viser 60 FPS)

**Techniques essentielles** :

- `requestAnimationFrame` (pas `setInterval`)
- Object pooling pour entités
- Éviter allocations mémoire dans game loop
- Optimiser opérations canvas

Cherche exemples de ces optimisations dans le code existant.

## Checklist

### Découverte

- [ ] Examiner jeu similaire existant
- [ ] Comprendre architecture (monolithique ou décomposée)
- [ ] Identifier patterns de game loop et rendu

### Implémentation

- [ ] Fichiers créés avec convention de nommage
- [ ] Game loop avec requestAnimationFrame
- [ ] Rendu canvas fonctionnel
- [ ] Controls clavier ET touch
- [ ] Questions multiplication intégrées
- [ ] Sons joués (correct/wrong)

### Intégration

- [ ] Intégré dans mode Arcade
- [ ] Bouton ajouté dans HTML
- [ ] Traductions ajoutées
- [ ] `npm run i18n:compare` passe

### Qualité

- [ ] Performance 60 FPS (tester sur mobile)
- [ ] Cleanup des listeners (pas de leaks)
- [ ] Tests si logique complexe
- [ ] Code formatté et lint passe

## Debugging

### Problèmes de performance

Utilise Chrome DevTools → Performance tab
Enregistre pendant le jeu et cherche frame drops

### Problèmes de rendu

Vérifie ordre de rendu (background → entités → UI)

### Problèmes d'inputs

Vérifie event listeners attachés et retirés proprement

## Outils disponibles

Examine le code pour trouver :

- Fonctions audio (playSound)
- Event bus (communication avec UI)
- Utils généraux (utils-es6.js)
- Question generator (questionGenerator.js)
- Fonctions communes arcade (arcade-common.js, arcade-utils.js)

## En cas de doute

**Code existant = source de vérité**

1. Choisis jeu similaire comme référence
2. Comprends son architecture avant de coder
3. Adapte les patterns
4. Teste fréquemment (surtout performance)
5. Mobile-first : teste sur touch dès le début

## Références

Cherche dans le code :

- `js/arcade-multimemory.js` - Jeu simple
- `js/arcade-invasion.js` - Space invaders
- `js/multimiam*.js` - Architecture décomposée
- `js/multisnake.js` - Snake
- `js/arcade-common.js` - Fonctions communes
- `js/questionGenerator.js` - Génération questions
