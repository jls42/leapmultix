---
name: 'New Game Mode Creator'
description: 'Crée un nouveau mode de jeu en étendant la classe abstraite GameMode.js avec gestion du cycle de vie, event bus, et lazy loading'
---

# New Game Mode Creator

Cette skill guide la création de nouveaux modes de jeu suivant l'architecture établie du projet leapmultix.

## Quand utiliser cette skill

- Création d'un nouveau mode de jeu
- Extension de la fonctionnalité arcade
- Ajout de variantes de modes existants
- Migration de code legacy vers pattern GameMode

## Architecture des Game Modes

### Hiérarchie de classes

```
GameMode (abstract)
├── QuizMode.js          - Quiz multiplication basique
├── ChallengeMode.js     - Défis chronométrés avec scoring
├── DiscoveryMode.js     - Exploration orientée apprentissage
├── AdventureMode.js     - Progression narrative
└── ArcadeMode.js        - Collection mini-jeux
```

### Classe abstraite GameMode

Emplacement : `js/core/GameMode.js`

**Méthodes abstraites obligatoires :**

```javascript
class GameMode {
  // Cycle de vie
  async init() {
    throw new Error('Must implement init()');
  }
  async cleanup() {
    throw new Error('Must implement cleanup()');
  }

  // Gestion des questions
  async handleQuestion(question) {
    throw new Error('Must implement handleQuestion()');
  }
  handleCorrectAnswer(question) {
    throw new Error('Must implement handleCorrectAnswer()');
  }
  handleWrongAnswer(question) {
    throw new Error('Must implement handleWrongAnswer()');
  }

  // UI
  updateUI() {
    throw new Error('Must implement updateUI()');
  }
  showResults() {
    throw new Error('Must implement showResults()');
  }
}
```

## Processus de création d'un nouveau mode

### Étape 1 : Créer le fichier du mode

Emplacement : `js/modes/YourMode.js`

**Template de base :**

```javascript
/**
 * YourMode - Description du mode
 * @module modes/YourMode
 */

import GameMode from '../core/GameMode.js';
import { eventBus } from '../core/eventBus.js';
import { utils } from '../utils-es6.js';
import { getTranslation } from '../i18n.js';

/**
 * Description de votre mode
 */
export default class YourMode extends GameMode {
  constructor() {
    super();
    this.name = 'yourMode';
    this.isActive = false;
    // Vos propriétés spécifiques
  }

  /**
   * Initialise le mode
   */
  async init() {
    console.log(`[YourMode] Initializing`);
    this.isActive = true;

    // Configuration initiale
    this.setupUI();
    this.attachEventListeners();

    // Émettre événement d'initialisation
    eventBus.emit('mode:initialized', { mode: this.name });

    return Promise.resolve();
  }

  /**
   * Nettoie le mode
   */
  async cleanup() {
    console.log(`[YourMode] Cleaning up`);
    this.isActive = false;

    // Retirer event listeners
    this.removeEventListeners();

    // Nettoyer UI
    this.cleanupUI();

    // Émettre événement de nettoyage
    eventBus.emit('mode:cleanup', { mode: this.name });

    return Promise.resolve();
  }

  /**
   * Gère une question
   */
  async handleQuestion(question) {
    if (!this.isActive) return;

    // Logique de traitement de la question
    this.currentQuestion = question;
    this.displayQuestion(question);

    return Promise.resolve();
  }

  /**
   * Gère une réponse correcte
   */
  handleCorrectAnswer(question) {
    console.log('[YourMode] Correct answer');

    // Feedback positif
    this.showFeedback(true);

    // Mise à jour score/stats
    this.updateStats('correct');

    // Émettre événement
    eventBus.emit('mode:correctAnswer', {
      mode: this.name,
      question,
    });
  }

  /**
   * Gère une réponse incorrecte
   */
  handleWrongAnswer(question) {
    console.log('[YourMode] Wrong answer');

    // Feedback négatif
    this.showFeedback(false);

    // Mise à jour stats
    this.updateStats('wrong');

    // Émettre événement
    eventBus.emit('mode:wrongAnswer', {
      mode: this.name,
      question,
    });
  }

  /**
   * Met à jour l'interface
   */
  updateUI() {
    if (!this.isActive) return;

    // Mettre à jour éléments UI
    this.updateScore();
    this.updateProgress();
  }

  /**
   * Affiche les résultats
   */
  showResults() {
    // Afficher écran de résultats
    const results = this.calculateResults();
    this.displayResults(results);

    // Émettre événement de fin
    eventBus.emit('mode:completed', {
      mode: this.name,
      results,
    });
  }

  // === Méthodes privées ===

  setupUI() {
    // Configuration UI spécifique
  }

  cleanupUI() {
    // Nettoyage UI
  }

  attachEventListeners() {
    // Attacher listeners
  }

  removeEventListeners() {
    // Retirer listeners
  }

  displayQuestion(question) {
    // Afficher la question
  }

  showFeedback(isCorrect) {
    // Afficher feedback
  }

  updateStats(result) {
    // Mettre à jour statistiques
  }

  updateScore() {
    // Mettre à jour score
  }

  updateProgress() {
    // Mettre à jour progression
  }

  calculateResults() {
    // Calculer résultats
    return {};
  }

  displayResults(results) {
    // Afficher résultats
  }
}
```

### Étape 2 : Enregistrer dans GameModeManager

Emplacement : `js/core/GameModeManager.js`

```javascript
import YourMode from '../modes/YourMode.js';

// Dans la méthode d'enregistrement
this.registerMode('yourMode', new YourMode());
```

### Étape 3 : Ajouter lazy loading

Emplacement : `js/lazy-loader.js`

```javascript
const MODE_CONFIGS = {
  yourMode: {
    module: () => import('./modes/YourMode.js'),
    size: 'XX KB', // Taille estimée
  },
};
```

### Étape 4 : Ajouter traductions i18n

Fichiers : `i18n/fr.json`, `i18n/en.json`, `i18n/es.json`

```json
{
  "modes": {
    "yourMode": {
      "title": "Titre du Mode",
      "description": "Description du mode",
      "instructions": "Instructions",
      "start": "Démarrer",
      "results": "Résultats"
    }
  }
}
```

**IMPORTANT :** Toujours ajouter d'abord à fr.json (référence), puis traduire dans les autres langues.

Vérifier avec :

```bash
npm run i18n:compare
```

### Étape 5 : Créer les tests

Emplacement : `tests/__tests__/YourMode.test.js`

```javascript
import YourMode from '../../js/modes/YourMode.js';
import { eventBus } from '../../js/core/eventBus.js';

describe('YourMode', () => {
  let mode;

  beforeEach(() => {
    mode = new YourMode();
    jest.clearAllMocks();
  });

  afterEach(async () => {
    if (mode.isActive) {
      await mode.cleanup();
    }
  });

  describe('Initialization', () => {
    test('should initialize correctly', async () => {
      await mode.init();
      expect(mode.isActive).toBe(true);
    });

    test('should emit initialization event', async () => {
      const spy = jest.spyOn(eventBus, 'emit');
      await mode.init();
      expect(spy).toHaveBeenCalledWith(
        'mode:initialized',
        expect.objectContaining({ mode: 'yourMode' })
      );
    });
  });

  describe('Cleanup', () => {
    test('should cleanup correctly', async () => {
      await mode.init();
      await mode.cleanup();
      expect(mode.isActive).toBe(false);
    });
  });

  describe('Question Handling', () => {
    test('should handle correct answer', async () => {
      await mode.init();
      const question = { num1: 3, num2: 4, answer: 12 };

      mode.handleCorrectAnswer(question);

      // Vérifier comportement attendu
    });

    test('should handle wrong answer', async () => {
      await mode.init();
      const question = { num1: 3, num2: 4, answer: 12 };

      mode.handleWrongAnswer(question);

      // Vérifier comportement attendu
    });
  });

  describe('UI Updates', () => {
    test('should update UI when active', async () => {
      await mode.init();
      expect(() => mode.updateUI()).not.toThrow();
    });

    test('should not update UI when inactive', () => {
      expect(() => mode.updateUI()).not.toThrow();
    });
  });

  describe('Results', () => {
    test('should show results', async () => {
      await mode.init();
      expect(() => mode.showResults()).not.toThrow();
    });
  });
});
```

Exécuter les tests :

```bash
npm test YourMode.test.js
```

### Étape 6 : Intégrer dans UI

**HTML (index.html) :**

```html
<!-- Bouton de lancement -->
<button onclick="startYourMode()" class="mode-button">
  <span data-i18n="modes.yourMode.title"></span>
</button>

<!-- Slide du mode -->
<div id="slideYourMode" class="slide" style="display:none;">
  <!-- Contenu du mode -->
</div>
```

**JavaScript (main.js ou bootstrap.js) :**

```javascript
import { GameModeManager } from './core/GameModeManager.js';

async function startYourMode() {
  const manager = GameModeManager.getInstance();
  await manager.switchMode('yourMode');
  goToSlide('slideYourMode');
}

// Enregistrer globalement si nécessaire
window.startYourMode = startYourMode;
```

## Patterns et bonnes pratiques

### Communication via Event Bus

**Émettre des événements :**

```javascript
eventBus.emit('mode:stateChange', { mode: this.name, state: 'ready' });
```

**Écouter des événements :**

```javascript
this.onUserAction = data => {
  // Gérer l'action
};
eventBus.on('user:action', this.onUserAction);
```

**Nettoyer les listeners :**

```javascript
eventBus.off('user:action', this.onUserAction);
```

### Gestion de l'état

```javascript
constructor() {
  super();
  this.state = {
    score: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    currentQuestion: null,
    isPlaying: false
  };
}
```

### Utilisation de utils

```javascript
import { utils } from '../utils-es6.js';

// Générer nombres aléatoires
const num = utils.random(1, 10);

// Mélanger array
const shuffled = utils.shuffle(array);

// Formater temps
const formatted = utils.formatTime(seconds);
```

### Audio feedback

```javascript
import { playSound } from '../core/audio.js';

handleCorrectAnswer() {
  playSound('correct');  // ou 'success', 'victory'
  // ...
}

handleWrongAnswer() {
  playSound('wrong');    // ou 'error', 'fail'
  // ...
}
```

### Navigation entre slides

```javascript
import { goToSlide } from '../core/navigation.js';

showResults() {
  // Afficher résultats
  goToSlide('slideResults');
}

exitMode() {
  // Retour au menu
  goToSlide('slide1');
}
```

## Checklist de création

- [ ] Fichier créé dans `js/modes/`
- [ ] Classe étend GameMode
- [ ] Toutes les méthodes abstraites implémentées
- [ ] Enregistré dans GameModeManager
- [ ] Ajouté au lazy loader
- [ ] Traductions ajoutées (fr, en, es)
- [ ] `npm run i18n:compare` passe
- [ ] Tests créés et passent
- [ ] UI ajoutée dans index.html
- [ ] Intégration testée manuellement
- [ ] Event bus utilisé pour communication
- [ ] Cleanup proper implémenté
- [ ] Documentation JSDoc complète
- [ ] Code formatté (`npm run format`)
- [ ] Lint passe (`npm run lint`)

## Exemples de référence

**Mode simple :** `js/modes/QuizMode.js`
**Mode complexe :** `js/modes/ChallengeMode.js`
**Mode avec sous-jeux :** `js/modes/ArcadeMode.js`

## Debugging

**Vérifier initialisation :**

```javascript
console.log(`[YourMode] isActive: ${this.isActive}`);
```

**Vérifier event bus :**

```javascript
eventBus.on('*', (event, data) => {
  console.log('Event:', event, data);
});
```

**Vérifier cleanup :**

```javascript
window.addEventListener('beforeunload', () => {
  console.log('[YourMode] Cleanup before unload');
  this.cleanup();
});
```

## Voir aussi

- `js/core/GameMode.js` - Classe abstraite
- `js/core/GameModeManager.js` - Gestionnaire de modes
- `js/lazy-loader.js` - Système de lazy loading
- `js/core/eventBus.js` - Event bus
- `js/modes/` - Modes existants comme exemples
