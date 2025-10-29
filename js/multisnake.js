// multisnake-modern.js - Version moderne et fluide du jeu Snake pour LeapMultix
// (c) LeapMultix - 2025

import { generateQuestion } from './questionGenerator.js';
import { showArcadeMessage, showArcadePoints, getTranslation } from './utils-es6.js';
import { showGameInstructions } from './arcade-common.js';
import { recordMultiplicationResult } from './core/mult-stats.js';
import { showArcadeGameOver } from './arcade.js';
import { cleanupGameResources } from './game-cleanup.js';
import { Utils } from './utils-es6.js';
import { InfoBar } from './components/infoBar.js';
import { TablePreferences } from './core/tablePreferences.js';
import { UserManager } from './userManager.js';
// Utilisation de la fonction shuffleArray centralisée via Utils

class SnakeGame {
  constructor(canvasId, mode = 'operation', options = {}) {
    console.log('Initialisation du jeu Snake');
    this.canvasId = canvasId;
    this.mode = mode;
    this.tableNumber = options.tableNumber || null;
    this.isDefi = mode === 'defi';
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      globalThis.navigator?.userAgent || ''
    );

    // Liste des tables autorisées (difficulté)
    this.tables = Array.isArray(options.tables) ? options.tables : [];

    // Éléments du jeu
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.canvas.style.padding = '0px';

    // Ajout des classes pour appliquer les styles communs
    this.canvas.classList.add('arcade-canvas', 'multisnake-canvas');

    // Dimensions
    this.baseCols = this.isMobile ? 8 : 14;
    this.baseRows = this.isMobile ? 8 : 11;

    // Paramètres du jeu
    this.initialSpeed = this.isMobile ? 450 : 400;
    this.minSpeed = this.isMobile ? 300 : 250;
    this.speedIncrement = 5;
    this.speed = this.initialSpeed;
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;

    // Paramètres d'animation
    this.animationId = null;
    this.lastUpdateTime = 0;
    this.moveTime = 0;
    this.moveInterval = this.initialSpeed;
    this.animationProgress = 1; // 0 à 1, représente la progression entre deux positions
    this.lastPositions = []; // Positions précédentes pour l'animation

    // Couleurs
    this.multisnakeColor = '#4CAF50';
    this.headColor = '#388E3C';
    this.numberBubbleColor = '#2196F3';

    // Initialiser les positions
    this.numberPositions = [];
    this.answers = [];
    this.currentOperation = null;

    // Initialiser le serpent avant tout (évite les erreurs de undefined)
    const startX = Math.floor(this.baseCols / 2);
    const startY = Math.floor(this.baseRows / 2);
    this.snake = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
    ];
    this.multisnake = this.snake; // Alias pour compatibilité

    // Direction initiale
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };

    // Appliquer le redimensionnement du canvas
    this.resizeCanvas();

    // Suivi des écouteurs pour nettoyage propre
    this.eventListeners = [];

    // Initialiser les contrôles
    this.initControls();

    // Redimensionnement
    const Root =
      typeof globalThis !== 'undefined'
        ? globalThis
        : typeof window !== 'undefined'
          ? window
          : undefined;
    this._onResize = () => {
      if (this._disposed) return;
      this.resizeCanvas();
      this.draw();
    };
    Root?.addEventListener?.('resize', this._onResize);
    this.eventListeners.push({
      element: Root,
      type: 'resize',
      callback: this._onResize,
      options: false,
    });

    // Mapping des sprites pour chaque direction disponible
    this.multisnakeSprites = {
      head: {
        '1,0': this.loadSprite('tete_droite.png'), // tête vers la droite
        '-1,0': this.loadSprite('tete_gauche.png'), // tête vers la gauche
        '0,-1': this.loadSprite('tete_haut.png'), // tête vers le haut
        '0,1': this.loadSprite('tete_bas.png'), // tête vers le bas
      },
      body: {
        '1,0': this.loadSprite('corps_milieu_queue_gauche_tete_droite.png'), // corps horizontal (droite)
        '-1,0': this.loadSprite('corps_milieu_queue_gauche_tete_droite.png'), // corps horizontal (gauche)
        '0,-1': this.loadSprite('corps_milieu_queue_bas_tete_haut.png'), // corps vertical (haut)
        '0,1': this.loadSprite('corps_milieu_queue_bas_tete_haut.png'), // corps vertical (bas)
      },
      bodyCurves: {
        'haut-droite': this.loadSprite('corps_courbe_droite_bas.png'),
        'droite-bas': this.loadSprite('corps_courbe_haut_droite.png'),
        'bas-gauche': this.loadSprite('corps_courbe_gauche_haut.png'),
        'gauche-haut': this.loadSprite('corps_courbe_bas_gauche.png'),
      },
      tail: {
        '1,0': this.loadSprite('queue_fin_droite.png'), // queue tournée vers la droite (serpent va à droite)
        '-1,0': this.loadSprite('queue_fin_gauche.png'), // queue tournée vers la gauche (serpent va à gauche)
        '0,-1': this.loadSprite('queue_fin_haut.png'), // queue tournée vers le haut (serpent monte)
        '0,1': this.loadSprite('queue_fin_bas.png'), // queue tournée vers le bas (serpent descend)
      },
    };

    // Ajout d'une propriété pour le logo du jeu
    this.logoImg = new Image();
    this.logoImg.src = 'assets/images/arcade/logo_multimiam_128x128.png';
    // Chargement de la texture d'herbe
    this.grassTexture = new Image();
    this.grassTexture.src = 'assets/images/arcade/herbe.png';
    // Texture pour fond réponses (snake_apple)
    this.appleTexture = new Image();
    this.appleTexture.src = 'assets/images/arcade/snake_apple_128x128.png';
  }

  // Redimensionner le canvas
  resizeCanvas() {
    // Éviter tout traitement après nettoyage
    if (this._disposed) return;
    // Vérifier que le canvas existe toujours avant d'essayer d'y accéder
    if (!this.canvas || !document.body.contains(this.canvas)) {
      console.warn('Snake: Canvas supprimé pendant resizeCanvas');
      return;
    }

    // Adjust canvas to fill container for immersion
    const container = this.canvas.parentElement;
    if (!container) {
      console.warn('Snake: Container parent introuvable');
      return;
    }

    const containerWidth = Math.max(300, container.clientWidth || 300);
    const containerHeight = Math.max(300, container.clientHeight || 300);

    // Adapter la grille à la taille du canvas
    if (this.isMobile) {
      this.cols = Math.max(8, Math.min(16, Math.floor(containerWidth / 30)));
      this.rows = Math.max(8, Math.min(16, Math.floor(containerHeight / 30)));
    } else {
      this.cols = this.baseCols;
      this.rows = this.baseRows;
    }

    this.cellSize = Math.max(
      20,
      Math.floor(Math.min(containerWidth / this.cols, containerHeight / this.rows))
    );

    // Ajuster la taille du canvas pour qu'elle corresponde exactement à la grille
    this.canvas.width = this.cols * this.cellSize;
    this.canvas.height = this.rows * this.cellSize;

    // Force aspect-ratio carré pour éviter déformation sur mobile
    if (this.isMobile) {
      const size = Math.min(this.canvas.width, this.canvas.height);
      this.canvas.width = size;
      this.canvas.height = size;
      // Recalculer les dimensions de grille pour le canvas carré
      this.cols = Math.floor(size / this.cellSize);
      this.rows = Math.floor(size / this.cellSize);
      this.cellSize = Math.floor(size / Math.max(this.cols, this.rows));

      this.canvas.style.width = size + 'px';
      this.canvas.style.height = size + 'px';
      // Assurer image-rendering pixel-perfect
      this.canvas.style.imageRendering = 'pixelated';
      this.canvas.style.imageRendering = '-moz-crisp-edges';
      this.canvas.style.imageRendering = 'crisp-edges';
    } else {
      this.canvas.style.width = this.canvas.width + 'px';
      this.canvas.style.height = this.canvas.height + 'px';
    }

    this.canvas.style.display = 'block';
    this.canvas.style.margin = '0 auto';
    this.canvas.style.borderRadius = '8px';
    this.canvas.style.boxSizing = 'border-box';

    console.log(
      `Snake: Canvas redimensionné: ${this.canvas.width}x${this.canvas.height}, grille: ${this.cols}x${this.rows}, cellule: ${this.cellSize}px`
    );
  }

  // Initialiser les contrôles
  initControls() {
    // Contrôles clavier
    this._onKeyDown = this.handleKeyDown.bind(this);
    document.addEventListener('keydown', this._onKeyDown);
    this.eventListeners.push({
      element: document,
      type: 'keydown',
      callback: this._onKeyDown,
      options: false,
    });

    // Contrôles tactiles intelligents (comme Multi Miam)
    this.setupTouchControls();

    // Les contrôles tactiles intelligents sont gérés dans setupTouchControls()
  }

  // Contrôles tactiles intelligents (inspirés de Multi Miam)
  setupTouchControls() {
    let touchStartTime = 0;
    let touchMoved = false;

    const validateTouch = () => {
      if (!this.canvas || !document.body.contains(this.canvas) || this.gameOver) {
        return null;
      }

      let rect;
      try {
        rect = this.canvas.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return null;
      } catch (error) {
        console.error('Snake: Erreur getBoundingClientRect:', error);
        return null;
      }

      return rect;
    };

    const getClickCoordinates = (e, rect) => {
      let clientX, clientY;
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;

        clientY = e.touches[0].clientY;
      } else if (e.clientX !== undefined && e.clientY !== undefined) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        return null;
      }

      return {
        clickX: clientX - rect.left,
        clickY: clientY - rect.top,
      };
    };

    const calculateSnakeScreenPosition = (head, rect) => {
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      return {
        snakeScreenX: (head.x * this.cellSize + this.cellSize / 2) / scaleX,
        snakeScreenY: (head.y * this.cellSize + this.cellSize / 2) / scaleY,
      };
    };

    const isInDeadZone = (clickX, clickY, snakeScreenX, snakeScreenY) => {
      const deadZone = 30;
      const distanceFromSnake = Math.sqrt(
        Math.pow(clickX - snakeScreenX, 2) + Math.pow(clickY - snakeScreenY, 2)
      );
      return distanceFromSnake < deadZone;
    };

    const calculateDirections = (deltaX, deltaY) => {
      let primaryDirection, secondaryDirection;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          primaryDirection = { x: 1, y: 0, name: 'DROITE' };
          secondaryDirection =
            deltaY > 0 ? { x: 0, y: 1, name: 'BAS' } : { x: 0, y: -1, name: 'HAUT' };
        } else {
          primaryDirection = { x: -1, y: 0, name: 'GAUCHE' };
          secondaryDirection =
            deltaY > 0 ? { x: 0, y: 1, name: 'BAS' } : { x: 0, y: -1, name: 'HAUT' };
        }
      } else {
        if (deltaY > 0) {
          primaryDirection = { x: 0, y: 1, name: 'BAS' };
          secondaryDirection =
            deltaX > 0 ? { x: 1, y: 0, name: 'DROITE' } : { x: -1, y: 0, name: 'GAUCHE' };
        } else {
          primaryDirection = { x: 0, y: -1, name: 'HAUT' };
          secondaryDirection =
            deltaX > 0 ? { x: 1, y: 0, name: 'DROITE' } : { x: -1, y: 0, name: 'GAUCHE' };
        }
      }

      return { primaryDirection, secondaryDirection };
    };

    const canChangeDirection = direction => {
      return !(direction.x === -this.direction.x && direction.y === -this.direction.y);
    };

    const selectBestDirection = (primaryDirection, secondaryDirection) => {
      const canGoPrimary = canChangeDirection(primaryDirection);
      const canGoSecondary = canChangeDirection(secondaryDirection);

      console.log(`Snake: Direction actuelle: (${this.direction.x}, ${this.direction.y})`);
      console.log(
        `Snake: Direction primaire: (${primaryDirection.x}, ${primaryDirection.y}) - Possible: ${canGoPrimary}`
      );
      console.log(
        `Snake: Direction secondaire: (${secondaryDirection.x}, ${secondaryDirection.y}) - Possible: ${canGoSecondary}`
      );

      if (canGoPrimary) {
        console.log(
          `Snake: Direction -> ${primaryDirection.name} (primaire, par rapport au serpent)`
        );
        return { x: primaryDirection.x, y: primaryDirection.y };
      } else if (canGoSecondary) {
        console.log(
          `Snake: Direction -> ${secondaryDirection.name} (secondaire, primaire bloquée)`
        );
        return { x: secondaryDirection.x, y: secondaryDirection.y };
      } else {
        console.log('Snake: Aucune direction possible (toutes bloquées)');
        return null;
      }
    };

    const handleTouch = e => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const rect = validateTouch();
      if (!rect) return;

      const coordinates = getClickCoordinates(e, rect);
      if (!coordinates) return;

      const { clickX, clickY } = coordinates;

      if (!this.snake || this.snake.length === 0) return;

      const head = this.snake[0];

      const { snakeScreenX, snakeScreenY } = calculateSnakeScreenPosition(head, rect);

      if (isInDeadZone(clickX, clickY, snakeScreenX, snakeScreenY)) {
        console.log('Snake: Clic trop près du serpent, ignoré');
        return;
      }

      const deltaX = clickX - snakeScreenX;
      const deltaY = clickY - snakeScreenY;

      console.log(
        `Snake: Serpent à (${snakeScreenX.toFixed(1)}, ${snakeScreenY.toFixed(1)}), clic à (${clickX}, ${clickY}), delta: (${deltaX.toFixed(1)}, ${deltaY.toFixed(1)})`
      );

      const { primaryDirection, secondaryDirection } = calculateDirections(deltaX, deltaY);
      const newDirection = selectBestDirection(primaryDirection, secondaryDirection);

      if (newDirection) {
        this.nextDirection = newDirection;
        console.log('Snake: Nouvelle direction définie:', newDirection);
      } else {
        console.log('Snake: Direction bloquée (opposée à la direction actuelle)');
      }
    };

    // Gestion du swipe vs tap
    this._onTouchStart = e => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      touchStartTime = Date.now();
      touchMoved = false;
    };
    this._onTouchMove = e => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      touchMoved = true;
    };
    this._onTouchEnd = e => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const touchDuration = Date.now() - touchStartTime;

      // Si c'est un tap rapide (< 200ms) et qu'on n'a pas bougé
      if (touchDuration < 200 && !touchMoved) {
        const touch = e.changedTouches[0];
        const simulatedEvent = {
          clientX: touch.clientX,
          clientY: touch.clientY,
          preventDefault: () => {},
          stopPropagation: () => {},
          stopImmediatePropagation: () => {},
        };
        handleTouch(simulatedEvent);
      }

      touchMoved = false;
    };

    this.canvas.addEventListener('touchstart', this._onTouchStart, { passive: false });
    this.canvas.addEventListener('touchmove', this._onTouchMove, { passive: false });
    this.canvas.addEventListener('touchend', this._onTouchEnd, { passive: false });
    this.eventListeners.push({
      element: this.canvas,
      type: 'touchstart',
      callback: this._onTouchStart,
      options: { passive: false },
    });
    this.eventListeners.push({
      element: this.canvas,
      type: 'touchmove',
      callback: this._onTouchMove,
      options: { passive: false },
    });
    this.eventListeners.push({
      element: this.canvas,
      type: 'touchend',
      callback: this._onTouchEnd,
      options: { passive: false },
    });

    // Pour desktop
    this._onClick = handleTouch;
    this.canvas.addEventListener('click', this._onClick);
    this.eventListeners.push({
      element: this.canvas,
      type: 'click',
      callback: this._onClick,
      options: false,
    });
  }

  // Gérer les touches du clavier
  handleKeyDown(e) {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault(); // Empêcher le scroll de la page
        if (this.direction.y !== 1) {
          this.nextDirection = { x: 0, y: -1 };
        }
        break;
      case 'ArrowDown':
        e.preventDefault(); // Empêcher le scroll de la page
        if (this.direction.y !== -1) {
          this.nextDirection = { x: 0, y: 1 };
        }
        break;
      case 'ArrowLeft':
        e.preventDefault(); // Empêcher le scroll de la page
        if (this.direction.x !== 1) {
          this.nextDirection = { x: -1, y: 0 };
        }
        break;
      case 'ArrowRight':
        e.preventDefault(); // Empêcher le scroll de la page
        if (this.direction.x !== -1) {
          this.nextDirection = { x: 1, y: 0 };
        }
        break;
      case ' ':
        e.preventDefault(); // Empêcher le scroll de la page
        if (this.gameOver) {
          this.start();
        }
        break;
    }
  }

  // Démarrer le jeu
  start() {
    console.log('Démarrage du jeu Snake');

    // Arrêter toute boucle de jeu existante
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // Réinitialiser complètement l'état du jeu
    this.resetGameState();

    // Initialiser le serpent
    this.initializeSnakePosition();

    // Générer opération et nombres
    this.generateOperation();
    this.placeNumbers();

    // Mettre à jour la barre d'info via InfoBar (ESM)
    this.updateInfoBar();

    // Afficher les instructions du jeu
    this.showInstructions();

    // Donner le focus au canvas sans provoquer de scroll
    this.focusCanvasWithoutScroll();

    // Démarrer la boucle de jeu avec requestAnimationFrame
    this.gameLoop();
  }

  /**
   * Reset game state variables
   * @private
   */
  resetGameState() {
    this.gameOver = false;
    this.score = 0;
    this.lives = 3;
    this.moveInterval = this.initialSpeed;

    // Direction initiale
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };

    // Réinitialiser les variables d'animation
    this.lastUpdateTime = 0;
    this.moveTime = 0;
    this.animationProgress = 1;

    // Réinitialiser les nombres
    this.numberPositions = [];
  }

  /**
   * Update info bar with current score and lives
   * @private
   */
  updateInfoBar() {
    try {
      InfoBar.update({ score: 0, lives: this.lives }, 'multisnake');
    } catch (e) {
      void e;
    }
  }

  /**
   * Initialize snake position at game start
   * @private
   */
  initializeSnakePosition() {
    const startX = Math.max(1, Math.min(this.cols - 2, Math.floor(this.cols / 2)));
    const startY = Math.max(1, Math.min(this.rows - 2, Math.floor(this.rows / 2)));

    this.multisnake = [
      { x: startX, y: startY }, // tête
      { x: Math.max(0, startX - 1), y: startY }, // queue
    ];

    // Mettre à jour l'alias
    this.snake = this.multisnake;

    // Initialiser les positions précédentes pour l'animation
    this.lastPositions = [];
    for (const segment of this.multisnake) {
      this.lastPositions.push({ ...segment });
    }
  }

  /**
   * Show game instructions based on device type
   * @private
   */
  showInstructions() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      globalThis.navigator?.userAgent || ''
    );

    const instructions = isMobile
      ? getTranslation('arcade.multiSnake.controls.mobile') ||
        'Glisse dans la direction désirée pour déplacer le serpent'
      : getTranslation('arcade.multiSnake.controls.desktop') ||
        'Utilise les flèches du clavier pour déplacer le serpent';

    showGameInstructions(this.canvas, instructions, '#4CAF50', 5000);
  }

  /**
   * Focus canvas without triggering page scroll
   * @private
   */
  focusCanvasWithoutScroll() {
    try {
      if (this.canvas?.focus) {
        const scrollBefore = window.scrollY || 0;
        this.canvas.focus({ preventScroll: true });

        // Fallback: forcer le scroll à 0 si preventScroll n'a pas fonctionné
        if (window.scrollY !== scrollBefore && window.scrollY !== 0) {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      }
    } catch {
      try {
        if (this.canvas) {
          this.canvas.focus();
          // Forcer scroll à 0 même en cas d'erreur
          if (window.scrollY !== 0) {
            window.scrollTo({ top: 0, behavior: 'instant' });
          }
        }
      } catch {
        /* no-op */
      }
    }
  }

  // Générer une opération mathématique
  generateOperation() {
    try {
      // Appliquer l'exclusion globale de tables
      const currentUser = UserManager.getCurrentUser();
      const excluded = TablePreferences.isGlobalEnabled(currentUser)
        ? TablePreferences.getActiveExclusions(currentUser)
        : [];

      // Utiliser generateQuestion pour cohérence avec le système centralisé
      const questionData = generateQuestion({
        type: 'classic',
        excludeTables: excluded,
        tables: Array.isArray(this.tables) && this.tables.length > 0 ? this.tables : undefined,
        forceTable: this.mode === 'table' && this.tableNumber ? this.tableNumber : null,
        minTable: 1,
        maxTable: 10,
        minNum: 1,
        maxNum: 10,
      });

      this.currentOperation = {
        num1: questionData.table,
        num2: questionData.num,
        operator: 'x',
        result: questionData.answer,
      };

      this.answers = this.generateAnswers(this.currentOperation.result);
      this.displayOperation();
    } catch (error) {
      console.error("Erreur lors de la génération de l'opération:", error);
      this.currentOperation = { num1: 1, num2: 1, operator: 'x', result: 1 };
      this.displayOperation();
    }
  }

  // Générer les réponses
  generateAnswers(correctResult) {
    const answers = [
      { value: correctResult, isCorrect: true },
      { value: correctResult + 1, isCorrect: false },
      { value: correctResult - 1, isCorrect: false },
      { value: correctResult + 10, isCorrect: false },
    ];

    // Utiliser la fonction shuffleArray centralisée
    if (Utils?.shuffleArray) {
      return Utils.shuffleArray(answers);
    }
    // Fallback si le module Utils est indisponible
    return answers.sort(() => Math.random() - 0.5);
  }

  // Placer les nombres sur la grille
  placeNumbers() {
    this.numberPositions = [];

    // Éviter les positions du serpent
    const avoidPositions = new Set();
    for (const segment of this.multisnake) {
      avoidPositions.add(`${segment.x},${segment.y}`);

      // Éviter aussi les positions devant la tête du serpent

      const head = this.multisnake[0];
      const futureX = head.x + this.direction.x;
      const futureY = head.y + this.direction.y;
      avoidPositions.add(`${futureX},${futureY}`);
    }

    // Placer les nombres
    for (const [i] of this.answers.entries()) {
      let x, y;
      let attempts = 0;

      // Essayer de trouver une position libre
      do {
        x = Math.floor(Math.random() * (this.cols - 4)) + 2;
        y = Math.floor(Math.random() * (this.rows - 4)) + 2;
        attempts++;
      } while (avoidPositions.has(`${x},${y}`) && attempts < 100);

      this.numberPositions.push({
        x: x,
        y: y,

        value: this.answers[i].value,

        isCorrect: this.answers[i].isCorrect,
      });

      avoidPositions.add(`${x},${y}`);
    }
  }

  // Boucle de jeu principale avec requestAnimationFrame
  gameLoop(timestamp = 0) {
    if (this.gameOver) return;

    // Calculer le delta time
    const deltaTime = timestamp - this.lastUpdateTime;
    this.lastUpdateTime = timestamp;

    // Mettre à jour le temps écoulé depuis le dernier mouvement
    this.moveTime += deltaTime;

    // Calculer la progression de l'animation (entre 0 et 1)
    this.animationProgress = Math.min(1, this.moveTime / this.moveInterval);

    // Si le temps écoulé dépasse l'intervalle de mouvement, mettre à jour la position
    if (this.moveTime >= this.moveInterval) {
      // Sauvegarder les positions actuelles avant de les mettre à jour
      this.lastPositions = [];
      for (const segment of this.multisnake) {
        this.lastPositions.push({ ...segment });
      }

      // Mettre à jour la logique du jeu
      this.updateGameLogic();

      // Réinitialiser le compteur de temps
      this.moveTime = 0;
      this.animationProgress = 0;
    }

    // Dessiner le jeu avec l'animation
    this.draw();

    // Continuer la boucle
    this.animationId = requestAnimationFrame(time => this.gameLoop(time));
  }

  // Mettre à jour la logique du jeu (sans dessiner)
  updateGameLogic() {
    if (this.gameOver) return;

    // Mettre à jour la direction
    this.direction = this.nextDirection;

    // Obtenir la position de la tête

    const head = { ...this.multisnake[0] };

    // Déplacer la tête dans la direction actuelle
    head.x += this.direction.x;
    head.y += this.direction.y;

    // Vérifier les collisions avec les bords
    if (head.x < 0) {
      head.x = this.cols - 1;
    } else if (head.x >= this.cols) {
      head.x = 0;
    }
    if (head.y < 0) {
      head.y = this.rows - 1;
    } else if (head.y >= this.rows) {
      head.y = 0;
    }

    // Vérifier les collisions avec le serpent
    for (const segment of this.multisnake) {
      if (head.x === segment.x && head.y === segment.y) {
        this.loseLife();
        return;
      }
    }

    // Vérifier les collisions avec les nombres
    let numberEaten = false;

    for (let i = 0; i < this.numberPositions.length; i++) {
      const pos = this.numberPositions[i];

      if (head.x === pos.x && head.y === pos.y) {
        numberEaten = true;

        if (pos.isCorrect) {
          recordMultiplicationResult(this.currentOperation.num1, this.currentOperation.num2, true);
          // bonne réponse mangée
          this.score += 100;
          // Affichage du gain de points
          showArcadePoints(100, this.canvas);
          // Augmenter la vitesse
          this.moveInterval = Math.max(this.minSpeed, this.moveInterval - this.speedIncrement);

          // Faire grandir le serpent
          this.multisnake.unshift(head);

          // Générer une nouvelle opération
          this.generateOperation();
          this.placeNumbers();
        } else {
          recordMultiplicationResult(this.currentOperation.num1, this.currentOperation.num2, false);
          // Mauvaise réponse : on perd 50 points mais pas de vie, et on retire la bulle
          this.score = Math.max(0, this.score - 50);
          // Affichage de la perte de points
          showArcadePoints(-50, this.canvas);
          this.numberPositions.splice(i, 1);
          // On continue le déplacement normal du serpent (pas de break ni return)
        }

        break;
      }
    }

    if (!numberEaten) {
      // Déplacer le serpent
      this.multisnake.unshift(head);
      this.multisnake.pop();
    }

    // Mettre à jour l'affichage du score
    this.updateScoreDisplay();
  }

  // Méthode centralisée pour nettoyer toutes les ressources du jeu
  cleanup() {
    this._disposed = true;
    // S'assurer que le jeu est arrêté
    this.gameOver = true;

    // Annuler la boucle d'animation
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // Détacher les écouteurs suivis
    try {
      if (Array.isArray(this.eventListeners)) {
        for (const l of this.eventListeners) {
          try {
            l.element?.removeEventListener?.(l.type, l.callback, l.options || false);
          } catch (e) {
            void e;
          }
        }
        this.eventListeners = [];
      }
    } catch (e) {
      void e;
    }

    // Utiliser la fonction utilitaire centralisée pour un nettoyage complet
    try {
      cleanupGameResources(this, {
        cleanAnimations: true,
        cleanEvents: true,
        cleanTimers: true,
        cleanDOM: true,
      });
    } catch (e) {
      void e;
    }

    console.log('Snake - Ressources nettoyées');
  }

  // Perdre une vie
  loseLife() {
    this.lives--;
    this.updateScoreDisplay();

    // Afficher le message de vie perdue avec la fonction unifiée
    showArcadeMessage('arcade_life_lost', '#F44336');

    if (this.lives <= 0) {
      this.gameOver = true;

      // Nettoyer les ressources du jeu
      this.cleanup();

      // Appeler la fonction showArcadeGameOver pour utiliser l'interface commune de fin de jeu
      showArcadeGameOver(this.score);
    } else {
      // Réinitialiser le serpent - s'assurer qu'il est dans les bonnes dimensions
      const startX = Math.max(1, Math.min(this.cols - 2, Math.floor(this.cols / 2)));
      const startY = Math.max(1, Math.min(this.rows - 2, Math.floor(this.rows / 2)));

      this.multisnake = [
        { x: startX, y: startY }, // tête
        { x: Math.max(0, startX - 1), y: startY }, // queue
      ];

      // Mettre à jour l'alias
      this.snake = this.multisnake;

      // Réinitialiser aussi le serpent précédent pour éviter les animations bizarres
      this.lastPositions = JSON.parse(JSON.stringify(this.multisnake));
      this.animationProgress = 1; // Pas d'animation pendant la réinitialisation

      this.direction = { x: 1, y: 0 };
      this.nextDirection = { x: 1, y: 0 };

      // Replacer les nombres
      this.placeNumbers();
    }

    this.draw();
  }

  // Dessiner le jeu
  draw() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Dessiner le fond herbe en plein écran (pas de répétition)
    if (this.grassTexture && this.grassTexture.complete && this.grassTexture.naturalHeight !== 0) {
      this.ctx.drawImage(this.grassTexture, 0, 0, this.canvas.width, this.canvas.height);
    } else {
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Dessiner les nombres
    this.drawNumbers();

    // Dessiner le serpent
    this.drawSnake();

    // On n'utilise plus drawGameOver() ici car nous utilisons maintenant showArcadeGameOver()
  }

  // Dessiner les nombres
  drawNumbers() {
    if (!this.numberPositions || !Array.isArray(this.numberPositions)) {
      this.numberPositions = [];
      return;
    }

    for (const pos of this.numberPositions) {
      // Dessiner le fond image pour la réponse
      const x = (pos.x + 0.5) * this.cellSize;
      const y = (pos.y + 0.5) * this.cellSize;
      const size = this.cellSize * 0.9;
      // Décalages pour centrer numéros : pomme un peu plus haut, texte un peu plus bas
      const appleOffsetY = -size * 0.05;
      const textOffsetY = size * 0.05;
      if (this.appleTexture.complete && this.appleTexture.naturalWidth) {
        // Dessiner la pomme légèrement vers le haut
        this.ctx.drawImage(
          this.appleTexture,
          x - size / 2,
          y - size / 2 + appleOffsetY,
          size,
          size
        );
      } else {
        this.ctx.beginPath();
        const radius = size / 2;
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.numberBubbleColor;
        this.ctx.fill();
        this.ctx.strokeStyle = '#1976D2';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }

      // Texte centré dans la pomme
      const text = pos.value.toString();
      this.ctx.fillStyle = 'white';
      const fontSize = this.isMobile
        ? Math.max(14, this.cellSize * 0.5)
        : Math.max(12, this.cellSize * 0.4);
      this.ctx.font = `bold ${fontSize}px Arial`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 1;
      this.ctx.strokeText(text, x, y + textOffsetY);
      this.ctx.fillText(text, x, y + textOffsetY);
    }
  }

  // Dessiner le serpent avec animation fluide
  drawSnake() {
    // Si pas de positions précédentes ou animation terminée, dessiner directement
    if (
      this.animationProgress >= 1 ||
      this.lastPositions.length === 0 ||
      this.lastPositions.length !== this.multisnake.length
    ) {
      this.drawSnakeAtPositions(this.multisnake);
      return;
    }

    // Créer un tableau de positions interpolées pour l'animation
    const interpolatedSnake = [];

    for (let i = 0; i < this.multisnake.length; i++) {
      const current = this.multisnake[i];

      const last = this.lastPositions[i];
      // Détecter si on a traversé un bord (téléportation)
      const dx = current.x - last.x;
      const dy = current.y - last.y;
      const teleportX = Math.abs(dx) > 1;
      const teleportY = Math.abs(dy) > 1;
      // Calculer la position interpolée en gérant le wrap-around
      let newX;
      if (teleportX) {
        const shiftX = this.direction.x > 0 ? this.cols : -this.cols;
        const extendedX = current.x + shiftX;
        newX = last.x + (extendedX - last.x) * this.animationProgress;
        newX = ((newX % this.cols) + this.cols) % this.cols;
      } else {
        newX = last.x + dx * this.animationProgress;
      }
      let newY;
      if (teleportY) {
        const shiftY = this.direction.y > 0 ? this.rows : -this.rows;
        const extendedY = current.y + shiftY;
        newY = last.y + (extendedY - last.y) * this.animationProgress;
        newY = ((newY % this.rows) + this.rows) % this.rows;
      } else {
        newY = last.y + dy * this.animationProgress;
      }
      interpolatedSnake.push({ x: newX, y: newY });
    }

    // Dessiner le serpent avec les positions interpolées
    this.drawSnakeAtPositions(interpolatedSnake);
  }

  // Dessiner le serpent à des positions spécifiques
  calculateSegmentDirections(prev, segment, next) {
    const dirIn = {
      x: Math.round(next.x - segment.x),
      y: Math.round(next.y - segment.y),
    };
    const dirOut = {
      x: Math.round(prev.x - segment.x),
      y: Math.round(prev.y - segment.y),
    };

    // Gérer les cas spéciaux de téléportation pour les directions
    if (Math.abs(next.x - segment.x) > this.cols / 2) {
      dirIn.x = next.x < segment.x ? 1 : -1;
    }
    if (Math.abs(prev.x - segment.x) > this.cols / 2) {
      dirOut.x = prev.x < segment.x ? 1 : -1;
    }
    if (Math.abs(next.y - segment.y) > this.rows / 2) {
      dirIn.y = next.y < segment.y ? 1 : -1;
    }
    if (Math.abs(prev.y - segment.y) > this.rows / 2) {
      dirOut.y = prev.y < segment.y ? 1 : -1;
    }

    return { dirIn, dirOut };
  }

  normalizeDirection(direction) {
    if (direction.x !== 0) direction.x = direction.x / Math.abs(direction.x);
    if (direction.y !== 0) direction.y = direction.y / Math.abs(direction.y);
    return direction;
  }

  drawSnakeSegment(segment, dirIn, dirOut) {
    this.normalizeDirection(dirIn);
    this.normalizeDirection(dirOut);

    const curveKey = this.getCurveKey(dirIn, dirOut);
    const x = segment.x * this.cellSize;
    const y = segment.y * this.cellSize;

    if (curveKey && this.multisnakeSprites.bodyCurves[curveKey]) {
      this.ctx.drawImage(
        this.multisnakeSprites.bodyCurves[curveKey],
        x,
        y,
        this.cellSize,
        this.cellSize
      );
    } else {
      const bodyKey = `${dirIn.x},${dirIn.y}`;

      const bodySprite = this.multisnakeSprites.body[bodyKey] || this.multisnakeSprites.body['1,0'];
      this.ctx.drawImage(bodySprite, x, y, this.cellSize, this.cellSize);
    }
  }

  drawSnakeHead(head) {
    const dirKey = `${this.direction.x},${this.direction.y}`;

    const headSprite = this.multisnakeSprites.head[dirKey] || this.multisnakeSprites.body['1,0'];
    this.ctx.drawImage(
      headSprite,
      head.x * this.cellSize,
      head.y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  }

  calculateTailDirection(tail, beforeTail) {
    const tailDir = { x: 0, y: 0 };

    if (Math.abs(tail.x - beforeTail.x) > this.cols / 2) {
      tailDir.x = beforeTail.x < tail.x ? -1 : 1;
    } else {
      tailDir.x = Math.round(tail.x - beforeTail.x);
    }

    if (Math.abs(tail.y - beforeTail.y) > this.rows / 2) {
      tailDir.y = beforeTail.y < tail.y ? -1 : 1;
    } else {
      tailDir.y = Math.round(tail.y - beforeTail.y);
    }

    this.normalizeDirection(tailDir);
    return tailDir;
  }

  drawSnakeTail(tail, multisnakePositions) {
    const tailDir = { x: 0, y: 0 };
    if (multisnakePositions.length > 1) {
      const beforeTail = multisnakePositions[multisnakePositions.length - 2];
      const calculatedTailDir = this.calculateTailDirection(tail, beforeTail);
      tailDir.x = calculatedTailDir.x;
      tailDir.y = calculatedTailDir.y;
    }

    const tailKey = `${tailDir.x},${tailDir.y}`;

    const tailSprite = this.multisnakeSprites.tail[tailKey] || this.multisnakeSprites.tail['1,0'];
    this.ctx.drawImage(
      tailSprite,
      tail.x * this.cellSize,
      tail.y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  }

  drawSnakeAtPositions(multisnakePositions) {
    if (!multisnakePositions || multisnakePositions.length < 2) return;

    // Corps (tous les segments sauf la tête et la queue)
    for (let i = 1; i < multisnakePositions.length - 1; i++) {
      const prev = multisnakePositions[i - 1];

      const segment = multisnakePositions[i];
      const next = multisnakePositions[i + 1];

      const { dirIn, dirOut } = this.calculateSegmentDirections(prev, segment, next);
      this.drawSnakeSegment(segment, dirIn, dirOut);
    }

    // Tête

    const head = multisnakePositions[0];
    this.drawSnakeHead(head);

    // Queue
    const tail = multisnakePositions[multisnakePositions.length - 1];
    this.drawSnakeTail(tail, multisnakePositions);
  }

  // La méthode drawGameOver() a été supprimée car nous utilisons maintenant showArcadeGameOver()

  // Afficher l'opération mathématique
  displayOperation() {
    const questionSpan = document.querySelector('.arcade-question');
    if (questionSpan && this.currentOperation) {
      questionSpan.textContent = `${this.currentOperation.num1} ${this.currentOperation.operator} ${this.currentOperation.num2} = ?`;
    }
  }

  // Mettre à jour l'affichage du score
  updateScoreDisplay() {
    try {
      InfoBar.update({ score: this.score, lives: this.lives }, 'multisnake');
    } catch (e) {
      void e;
    }
  }

  // Méthode utilitaire pour charger une image
  loadSprite(filename) {
    const img = new Image();
    img.src = 'assets/images/arcade/' + filename;
    return img;
  }

  // Fonction utilitaire pour détecter la clé de courbe, peu importe le sens
  getCurveKey(dirIn, dirOut) {
    const mapping = {
      'haut-droite': [
        [
          { x: 0, y: -1 },
          { x: 1, y: 0 },
        ], // haut puis droite
        [
          { x: 1, y: 0 },
          { x: 0, y: -1 },
        ], // droite puis haut
      ],
      'droite-bas': [
        [
          { x: 1, y: 0 },
          { x: 0, y: 1 },
        ],
        [
          { x: 0, y: 1 },
          { x: 1, y: 0 },
        ],
      ],
      'bas-gauche': [
        [
          { x: 0, y: 1 },
          { x: -1, y: 0 },
        ],
        [
          { x: -1, y: 0 },
          { x: 0, y: 1 },
        ],
      ],
      'gauche-haut': [
        [
          { x: -1, y: 0 },
          { x: 0, y: -1 },
        ],
        [
          { x: 0, y: -1 },
          { x: -1, y: 0 },
        ],
      ],
    };
    for (const key in mapping) {
      for (const [a, b] of mapping[key]) {
        if (dirIn.x === a.x && dirIn.y === a.y && dirOut.x === b.x && dirOut.y === b.y) {
          return key;
        }
      }
    }
    return null;
  }
}

export { SnakeGame };
