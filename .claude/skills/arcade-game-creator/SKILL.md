---
name: "Arcade Game Creator"
description: "Crée des jeux arcade canvas HTML5 suivant les patterns leapmultix (Multimiam, Multisnake, Invasion). Utiliser lors de création de nouveaux mini-jeux arcade"
---

# Arcade Game Creator

Cette skill guide la création de nouveaux jeux arcade canvas pour le mode Arcade de leapmultix.

## Quand utiliser cette skill
- Création d'un nouveau jeu arcade
- Extension du mode Arcade
- Adaptation de jeux existants
- Prototypage de mini-jeux

## Jeux existants (références)

**Multimiam :**
- Architecture décomposée (engine, renderer, controls, questions, UI)
- `multimiam-engine.js` (15 KB) - Logique jeu
- `multimiam-renderer.js` (9 KB) - Rendu canvas
- `multimiam-controls.js` (7 KB) - Inputs
- `multimiam-questions.js` (6 KB) - Questions multiplication

**Multisnake :**
- `multisnake.js` (38 KB) - Jeu Snake complet
- Grille, serpent, pommes avec questions math

**Arcade Invasion :**
- `arcade-invasion.js` (31 KB) - Space Invaders style
- Vagues d'ennemis, tir, questions pour munitions

**Arcade Multi Memory :**
- `arcade-multimemory.js` (31 KB) - Memory matching
- Paires de multiplications à associer

## Template de base

### Structure fichiers

```
arcade-new-game/
├── arcade-new-game.js           # Point d'entrée
├── arcade-new-game-engine.js    # Logique jeu
├── arcade-new-game-renderer.js  # Rendu canvas
├── arcade-new-game-controls.js  # Inputs clavier/touch
└── arcade-new-game-questions.js # Intégration questions
```

### Point d'entrée (arcade-new-game.js)

```javascript
/**
 * New Arcade Game - [Description du jeu]
 *
 * @module arcade/new-game
 */

import { NewGameEngine } from './arcade-new-game-engine.js';
import { NewGameRenderer } from './arcade-new-game-renderer.js';
import { NewGameControls } from './arcade-new-game-controls.js';
import { playSound } from './audio.js';
import { eventBus } from './core/eventBus.js';

/**
 * Initialise et lance le nouveau jeu arcade
 *
 * @param {HTMLCanvasElement} canvas - Canvas du jeu
 * @param {Object} options - Options de configuration
 * @param {Function} options.onComplete - Callback fin de jeu
 * @param {Function} options.onScore - Callback changement score
 */
export function startNewGame(canvas, options = {}) {
  const engine = new NewGameEngine();
  const renderer = new NewGameRenderer(canvas);
  const controls = new NewGameControls(canvas);

  let gameRunning = true;

  // Lifecycle
  function init() {
    engine.init();
    controls.onInput((input) => engine.handleInput(input));

    // Événements
    eventBus.on('game:correct', handleCorrectAnswer);
    eventBus.on('game:wrong', handleWrongAnswer);

    gameLoop();
  }

  function gameLoop() {
    if (!gameRunning) return;

    // Update
    engine.update(16); // ~60 FPS

    // Render
    renderer.clear();
    renderer.render(engine.getState());

    // Next frame
    requestAnimationFrame(gameLoop);
  }

  function handleCorrectAnswer() {
    playSound('correct');
    engine.addPoints(10);

    if (options.onScore) {
      options.onScore(engine.getScore());
    }
  }

  function handleWrongAnswer() {
    playSound('wrong');
    engine.loseLife();

    if (engine.isGameOver()) {
      endGame();
    }
  }

  function endGame() {
    gameRunning = false;
    renderer.showGameOver(engine.getScore());

    if (options.onComplete) {
      options.onComplete({
        score: engine.getScore(),
        correctAnswers: engine.getCorrectCount()
      });
    }

    cleanup();
  }

  function cleanup() {
    eventBus.off('game:correct', handleCorrectAnswer);
    eventBus.off('game:wrong', handleWrongAnswer);
    controls.destroy();
  }

  // Démarrer
  init();

  // API publique
  return {
    pause: () => (gameRunning = false),
    resume: () => {
      gameRunning = true;
      gameLoop();
    },
    stop: endGame
  };
}
```

### Engine (arcade-new-game-engine.js)

```javascript
/**
 * Moteur de jeu - Logique et état
 */
export class NewGameEngine {
  constructor() {
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.correctAnswers = 0;
    this.entities = [];
  }

  init() {
    this.spawnEntities();
  }

  update(deltaTime) {
    // Mettre à jour entités
    this.entities.forEach(entity => {
      entity.update(deltaTime);
    });

    // Vérifier collisions
    this.checkCollisions();

    // Vérifier conditions victoire/défaite
    if (this.shouldLevelUp()) {
      this.levelUp();
    }
  }

  handleInput(input) {
    // Gérer inputs (left, right, up, down, action)
    switch (input.type) {
      case 'move':
        this.movePlayer(input.direction);
        break;
      case 'action':
        this.playerAction();
        break;
    }
  }

  addPoints(points) {
    this.score += points;
    this.correctAnswers++;
  }

  loseLife() {
    this.lives--;
  }

  isGameOver() {
    return this.lives <= 0;
  }

  getState() {
    return {
      score: this.score,
      lives: this.lives,
      level: this.level,
      entities: this.entities
    };
  }

  getScore() {
    return this.score;
  }

  getCorrectCount() {
    return this.correctAnswers;
  }

  // Méthodes privées
  spawnEntities() {
    // Créer entités initiales
  }

  checkCollisions() {
    // Détecter collisions
  }

  shouldLevelUp() {
    return this.score >= this.level * 100;
  }

  levelUp() {
    this.level++;
    this.spawnEntities();
  }

  movePlayer(direction) {
    // Déplacer joueur
  }

  playerAction() {
    // Action joueur (tir, saut, etc.)
  }
}
```

### Renderer (arcade-new-game-renderer.js)

```javascript
/**
 * Renderer - Rendu canvas
 */
export class NewGameRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  render(state) {
    // Dessiner background
    this.drawBackground();

    // Dessiner entités
    state.entities.forEach(entity => {
      this.drawEntity(entity);
    });

    // Dessiner UI
    this.drawUI(state);
  }

  drawBackground() {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawEntity(entity) {
    const { x, y, width, height, color } = entity;

    this.ctx.fillStyle = color || '#fff';
    this.ctx.fillRect(x, y, width, height);

    // Ou dessiner sprite si disponible
    if (entity.sprite) {
      this.ctx.drawImage(entity.sprite, x, y, width, height);
    }
  }

  drawUI(state) {
    // Score
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`Score: ${state.score}`, 10, 30);

    // Vies
    this.ctx.fillText(`Vies: ${state.lives}`, 10, 60);

    // Niveau
    this.ctx.fillText(`Niveau: ${state.level}`, 10, 90);
  }

  showGameOver(score) {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.fillStyle = '#fff';
    this.ctx.font = '40px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2);
    this.ctx.font = '24px Arial';
    this.ctx.fillText(`Score: ${score}`, this.width / 2, this.height / 2 + 40);
  }
}
```

### Controls (arcade-new-game-controls.js)

```javascript
/**
 * Gestion des inputs (clavier + touch)
 */
export class NewGameControls {
  constructor(canvas) {
    this.canvas = canvas;
    this.listeners = [];
    this.keys = new Set();

    this.setupKeyboard();
    this.setupTouch();
  }

  onInput(callback) {
    this.listeners.push(callback);
  }

  emit(input) {
    this.listeners.forEach(listener => listener(input));
  }

  setupKeyboard() {
    this.onKeyDown = (e) => {
      this.keys.add(e.key);

      switch (e.key) {
        case 'ArrowLeft':
          this.emit({ type: 'move', direction: 'left' });
          break;
        case 'ArrowRight':
          this.emit({ type: 'move', direction: 'right' });
          break;
        case 'ArrowUp':
          this.emit({ type: 'move', direction: 'up' });
          break;
        case 'ArrowDown':
          this.emit({ type: 'move', direction: 'down' });
          break;
        case ' ':
        case 'Enter':
          this.emit({ type: 'action' });
          break;
      }
    };

    this.onKeyUp = (e) => {
      this.keys.delete(e.key);
    };

    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
  }

  setupTouch() {
    let touchStartX = 0;
    let touchStartY = 0;

    this.onTouchStart = (e) => {
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    };

    this.onTouchEnd = (e) => {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;

      // Swipe detection
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 30) {
          this.emit({ type: 'move', direction: 'right' });
        } else if (deltaX < -30) {
          this.emit({ type: 'move', direction: 'left' });
        }
      } else {
        if (deltaY > 30) {
          this.emit({ type: 'move', direction: 'down' });
        } else if (deltaY < -30) {
          this.emit({ type: 'move', direction: 'up' });
        }
      }
    };

    this.canvas.addEventListener('touchstart', this.onTouchStart);
    this.canvas.addEventListener('touchend', this.onTouchEnd);
  }

  isKeyPressed(key) {
    return this.keys.has(key);
  }

  destroy() {
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
    this.canvas.removeEventListener('touchstart', this.onTouchStart);
    this.canvas.removeEventListener('touchend', this.onTouchEnd);
  }
}
```

### Intégration questions (arcade-new-game-questions.js)

```javascript
/**
 * Intégration questions multiplication
 */
import { generateQuestion } from './questionGenerator.js';
import { eventBus } from './core/eventBus.js';

export class QuestionSystem {
  constructor() {
    this.currentQuestion = null;
    this.pendingQuestion = false;
  }

  askQuestion(difficulty = 5) {
    if (this.pendingQuestion) return;

    this.currentQuestion = generateQuestion(difficulty);
    this.pendingQuestion = true;

    // Afficher question dans UI
    eventBus.emit('question:show', this.currentQuestion);

    return this.currentQuestion;
  }

  checkAnswer(userAnswer) {
    if (!this.currentQuestion) return false;

    const isCorrect = userAnswer === this.currentQuestion.answer;
    this.pendingQuestion = false;

    // Émettre événement
    eventBus.emit(isCorrect ? 'game:correct' : 'game:wrong', {
      question: this.currentQuestion,
      userAnswer
    });

    this.currentQuestion = null;
    return isCorrect;
  }

  hasPendingQuestion() {
    return this.pendingQuestion;
  }
}
```

## Intégration dans mode Arcade

### Ajouter à lazy-loader.js

```javascript
// lazy-loader.js
const MODE_CONFIGS = {
  // ... modes existants
  newGame: {
    module: () => import('./arcade-new-game.js'),
    size: '30 KB', // Estimer taille
    description: 'Description du nouveau jeu'
  }
};
```

### Ajouter bouton dans index.html

```html
<div class="arcade-game-card">
  <h3 data-i18n="arcade.newGame.title">New Game</h3>
  <p data-i18n="arcade.newGame.description">Description</p>
  <button onclick="startArcadeNewGame()">
    <span data-i18n="arcade.start">Démarrer</span>
  </button>
</div>
```

### Handler de démarrage

```javascript
// arcade.js ou bootstrap.js
async function startArcadeNewGame() {
  const canvas = document.getElementById('gameCanvas');
  const { startNewGame } = await import('./arcade-new-game.js');

  const game = startNewGame(canvas, {
    onScore: (score) => {
      updateScoreDisplay(score);
    },
    onComplete: (result) => {
      showGameResults(result);
      saveHighScore('newGame', result.score);
    }
  });

  // Gérer boutons pause/stop
  document.getElementById('pauseBtn').onclick = () => game.pause();
  document.getElementById('resumeBtn').onclick = () => game.resume();
  document.getElementById('stopBtn').onclick = () => game.stop();
}
```

## Patterns de jeux arcade

### Pattern : Platformer

```javascript
class Platformer {
  update(deltaTime) {
    // Gravité
    this.player.velocityY += this.gravity * deltaTime;

    // Mouvement horizontal
    if (this.keys.has('ArrowLeft')) {
      this.player.x -= this.player.speed * deltaTime;
    }
    if (this.keys.has('ArrowRight')) {
      this.player.x += this.player.speed * deltaTime;
    }

    // Saut
    if (this.keys.has(' ') && this.player.onGround) {
      this.player.velocityY = -this.jumpForce;
      this.player.onGround = false;
    }

    // Appliquer vélocité
    this.player.y += this.player.velocityY * deltaTime;

    // Collision sol
    if (this.player.y >= this.groundY) {
      this.player.y = this.groundY;
      this.player.velocityY = 0;
      this.player.onGround = true;
    }
  }
}
```

### Pattern : Shooter

```javascript
class Shooter {
  shoot() {
    const bullet = {
      x: this.player.x,
      y: this.player.y,
      velocityY: -5,
      width: 5,
      height: 10
    };

    this.bullets.push(bullet);
    playSound('shoot');
  }

  update(deltaTime) {
    // Mettre à jour projectiles
    this.bullets.forEach(bullet => {
      bullet.y += bullet.velocityY;
    });

    // Retirer projectiles hors écran
    this.bullets = this.bullets.filter(b => b.y > 0);

    // Vérifier collisions projectiles-ennemis
    this.bullets.forEach(bullet => {
      this.enemies.forEach(enemy => {
        if (this.collides(bullet, enemy)) {
          this.destroyEnemy(enemy);
          this.bullets.splice(this.bullets.indexOf(bullet), 1);
        }
      });
    });
  }
}
```

### Pattern : Puzzle

```javascript
class PuzzleGame {
  constructor() {
    this.grid = this.createGrid(10, 10);
    this.selected = [];
  }

  selectTile(x, y) {
    this.selected.push({ x, y });

    if (this.selected.length === 2) {
      this.checkMatch();
    }
  }

  checkMatch() {
    const [tile1, tile2] = this.selected;

    if (this.tilesMatch(tile1, tile2)) {
      this.removeTiles(tile1, tile2);
      eventBus.emit('game:correct');
    } else {
      this.deselectTiles();
      eventBus.emit('game:wrong');
    }

    this.selected = [];
  }
}
```

## Checklist création jeu

- [ ] Fichiers créés (engine, renderer, controls, questions)
- [ ] Point d'entrée exporté
- [ ] Intégration dans lazy-loader.js
- [ ] Bouton ajouté dans index.html
- [ ] Traductions ajoutées (fr, en, es) dans i18n/
- [ ] Controls clavier ET touch
- [ ] Questions multiplication intégrées
- [ ] Sons (correct, wrong, etc.)
- [ ] Game over et score final
- [ ] Cleanup des listeners
- [ ] Tests créés
- [ ] Performance 60 FPS

## Voir aussi

- `game-mode/SKILL.md` - Patterns GameMode
- `animation-system/SKILL.md` - Animations pour jeux
- `sprite-management/SKILL.md` - Gestion sprites
- `sound-effect-manager/SKILL.md` - Effets sonores
- `performance-profiler/SKILL.md` - Optimisation FPS
- Jeux existants : `arcade-invasion.js`, `multisnake.js`, `multimiam-*.js`
