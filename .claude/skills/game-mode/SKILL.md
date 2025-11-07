---
name: creating-game-modes
description: Creates new game modes by extending the abstract GameMode.js class with lifecycle management, event bus, and lazy loading
allowed-tools: Read, Write, Grep, Glob, Bash
---

# New Game Mode Creator

Guide la création de nouveaux modes de jeu suivant l'architecture établie du projet.

## Quand utiliser

- Création d'un nouveau mode de jeu
- Extension de la fonctionnalité arcade
- Ajout de variantes de modes existants
- Migration de code legacy vers pattern GameMode

## Architecture des Game Modes

### Principes fondamentaux

**Héritage** : Tous les modes héritent de `GameMode` (classe abstraite)

**Communication** :

- Utilise `eventBus` pour découplage (jamais de couplage direct)
- Pattern publish/subscribe pour événements

**Chargement** : Lazy loading via le système existant

**Cycle de vie** : `init()` → `start()` → `update()` → `cleanup()`

- Toujours nettoyer les listeners dans `cleanup()`

### Méthodes abstraites requises

À implémenter dans tout mode :

- `init()` - Initialisation
- `cleanup()` - Nettoyage et libération ressources
- `handleQuestion()` - Traitement d'une question
- `handleCorrectAnswer()` - Gestion réponse correcte
- `handleWrongAnswer()` - Gestion réponse incorrecte
- `updateUI()` - Mise à jour interface
- `showResults()` - Affichage résultats

## Workflow de création

### Étape 1 : Explorer les exemples existants

Examine les modes dans `js/modes/` :

- **QuizMode.js** : Mode simple, bon point de départ
- **ChallengeMode.js** : Mode avec timer, patterns avancés
- **ArcadeMode.js** : Collection de mini-jeux

Trouve celui qui ressemble le plus à ce que tu veux créer.

### Étape 2 : Localiser la classe abstraite

Trouve et examine `GameMode.js` pour comprendre :

- Les méthodes abstraites obligatoires
- Les méthodes utilitaires disponibles
- Le contrat d'interface

### Étape 3 : Comprendre l'intégration

Cherche dans le code existant :

- Comment les modes sont enregistrés (gestionnaire de modes)
- Comment le lazy loading fonctionne
- Comment les modes communiquent via eventBus

### Étape 4 : Créer ton mode

**Convention de nommage** : `js/modes/YourMode.js` (PascalCase)

**Structure minimale** :

- Hérite de GameMode
- Implémente toutes les méthodes abstraites
- Utilise eventBus pour communication
- Nettoie proprement dans cleanup()

Adapte un exemple existant à ton besoin.

### Étape 5 : Intégrer

- Enregistre dans le gestionnaire de modes
- Ajoute au lazy loader
- Crée les traductions (fr, en, es)
- Vérifie synchronisation i18n

### Étape 6 : Tester

```bash
npm test YourMode.test.js
npm run format:check
npm run lint
npm run i18n:compare
```

## Patterns et conventions

### Communication via Event Bus

**Principe** : Ne jamais coupler directement les composants

**Pattern typique** :

- Émettre : `eventBus.emit('mode:event', data)`
- Écouter : `eventBus.on('user:action', this.handler)`
- Nettoyer : `eventBus.off('user:action', this.handler)`

Cherche des exemples dans les modes existants.

### Gestion de l'état

Trouve comment les modes existants gèrent leur état interne.
Pattern commun : objet `this.state` avec propriétés du jeu.

### Utilisation des utilitaires

Examine `utils-es6.js` pour voir les fonctions disponibles :

- Génération de nombres aléatoires
- Mélange d'arrays
- Formatage du temps
- Etc.

## Checklist de création

### Découverte

- [ ] Examiner au moins 1 mode existant similaire
- [ ] Comprendre GameMode (classe abstraite)
- [ ] Identifier où les modes sont enregistrés
- [ ] Trouver le pattern de lazy loading

### Implémentation

- [ ] Fichier créé dans `js/modes/`
- [ ] Hérite de GameMode
- [ ] Toutes méthodes abstraites implémentées
- [ ] Event bus utilisé (pas de couplage direct)
- [ ] Cleanup proper (listeners retirés)

### Intégration

- [ ] Enregistré dans gestionnaire
- [ ] Ajouté au lazy loader
- [ ] Traductions ajoutées (fr → en → es)
- [ ] `npm run i18n:compare` passe

### Qualité

- [ ] Tests créés et passent
- [ ] Code formatté (`npm run format`)
- [ ] Lint passe (`npm run lint`)
- [ ] Documentation JSDoc
- [ ] Testé manuellement

## Debugging

### Vérifier initialisation

Cherche les patterns de logging dans les modes existants.

### Vérifier event bus

Liste tous les événements émis par les modes existants pour comprendre les conventions.

### Problèmes courants

**Mode ne se charge pas** :

- Vérifie enregistrement dans gestionnaire
- Vérifie configuration lazy loader

**Event bus ne fonctionne pas** :

- Vérifie que cleanup retire les listeners
- Cherche la bonne signature des événements

**Traductions manquantes** :

```bash
npm run i18n:compare
```

## En cas de doute

**Source de vérité = code existant**

1. Explore les modes similaires
2. Le code réel est plus fiable que toute documentation
3. Adapte les patterns, ne copie pas aveuglément
4. Teste fréquemment

## Références

Cherche dans le code :

- `js/core/GameMode.js` - Classe abstraite
- `js/modes/` - Tous les modes existants
- `js/core/GameModeManager.js` - Gestionnaire
- `js/lazy-loader.js` - Configuration lazy loading
- `js/core/eventBus.js` - Event bus
