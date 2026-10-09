// multisnake-modern.js - Version moderne et fluide du jeu Snake pour LeapMultix
// (c) LeapMultix - 2025

import { generateQuestion } from './questionGenerator.js';
import { showArcadeMessage, showArcadePoints, getTranslation } from './utils-es6.js';
import { showArcadePenalty } from './arcade-points.js';
import {
  showGameInstructions,
  getCanvasFont,
  getArcadeCanvasBox,
  readableCanvasFontSize,
  canvasToClientPoint,
  watchArcadeViewport,
} from './arcade-common.js';
import { attachDirectionalTouch } from './arcade-touch.js';
import { recordOperationResult } from './core/operation-stats.js';
import { noteArcadePlay } from './arcade-session.js';
import { showArcadeGameOver } from './arcade.js';
import { cleanupGameResources } from './game-cleanup.js';
import { InfoBar } from './components/infoBar.js';
import { TablePreferences } from './core/tablePreferences.js';
import { UserManager } from './userManager.js';
import { randomInt, shuffleInPlace } from './core/random.js';
import { getDifficultySettings } from './difficulty.js';
import { plausibleWrongAnswers } from './core/GameMode.js';
import { isArcadePaused } from './arcade-time.js';
import { spriteFor, drawArcadeSprite } from './arcade-sprites.js';
import { snakePartSpec, textureSpec } from './arcade-sprite-catalog.js';
// UserState removed - unused import

// Direction donnée par chaque glissement du doigt
const SWIPE_VECTORS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};
// Rayon (pixels CSS) autour de la tête où un toucher n'indique aucune direction
const TAP_DEAD_ZONE_PX = 30;
// Direction donnée par chaque flèche du clavier
const ARROW_DIRECTIONS = new Map([
  ['ArrowUp', { x: 0, y: -1 }],
  ['ArrowDown', { x: 0, y: 1 }],
  ['ArrowLeft', { x: -1, y: 0 }],
  ['ArrowRight', { x: 1, y: 0 }],
]);
// Plateau de téléphone : des cases d'environ 30 px (le doigt, le nombre de la pomme), de 8 à
// 16 sur le petit côté et jusqu'à 22 sur le grand : plus haut que large en portrait
const MOBILE_CELL_PX = 30;
const MOBILE_GRID_MIN = 8;
const MOBILE_GRID_SHORT_MAX = 16;
const MOBILE_GRID_LONG_MAX = 22;
// Plus petite case quand l'écran rétrécit en pleine partie (la grille, elle, ne change pas)
const MIN_CELL_PX = 8;

/**
 * Case après un pas, d'un bord à l'autre du plateau.
 * @param {number} cell - Colonne ou rangée visée (un pas au-delà du plateau au plus)
 * @param {number} size - Colonnes ou rangées du plateau
 * @returns {number}
 */
function wrapCell(cell, size) {
  if (cell < 0) return size - 1;
  if (cell >= size) return 0;
  return cell;
}

/**
 * Écart entre deux segments voisins sur un axe : au-delà de la moitié du plateau, ils se
 * touchent par le bord opposé.
 * @param {number} delta - Écart de cases
 * @param {number} size - Cases sur cet axe
 * @returns {number} −1, 0 ou 1
 */
function wrappedStep(delta, size) {
  if (Math.abs(delta) > size / 2) return delta < 0 ? 1 : -1;
  return Math.round(delta);
}

// Virages du corps : image de chaque paire de directions (haut, droite, bas, gauche), dans
// un sens ou dans l'autre
const BODY_CURVES = [
  [
    'haut-droite',
    [
      [0, -1],
      [1, 0],
    ],
  ],
  [
    'droite-bas',
    [
      [1, 0],
      [0, 1],
    ],
  ],
  [
    'bas-gauche',
    [
      [0, 1],
      [-1, 0],
    ],
  ],
  [
    'gauche-haut',
    [
      [-1, 0],
      [0, -1],
    ],
  ],
];

function sameDirection(direction, [x, y]) {
  return direction.x === x && direction.y === y;
}

/**
 * Grille du plateau sur téléphone, choisie au lancement pour la place disponible :
 * plus haute que large en portrait, plus large que haute en paysage.
 * @param {{width: number, height: number}} box - Place du plateau (pixels CSS)
 * @returns {{cols: number, rows: number}}
 */
export function chooseMobileSnakeGrid(box) {
  const portrait = box.height >= box.width;
  const cells = (size, max) =>
    Math.max(MOBILE_GRID_MIN, Math.min(max, Math.floor(size / MOBILE_CELL_PX)));
  return {
    cols: cells(box.width, portrait ? MOBILE_GRID_SHORT_MAX : MOBILE_GRID_LONG_MAX),
    rows: cells(box.height, portrait ? MOBILE_GRID_LONG_MAX : MOBILE_GRID_SHORT_MAX),
  };
}

/**
 * Tables retirées par le joueur (réglage global des tables), multiplication seulement
 * @returns {number[]}
 */
function excludedTablesOfCurrentUser() {
  const currentUser = UserManager.getCurrentUser();
  return TablePreferences.isGlobalEnabled(currentUser)
    ? TablePreferences.getActiveExclusions(currentUser)
    : [];
}

/**
 * Questions d'une partie : les tables du niveau en ×, ses nombres (facile, moyen, difficile)
 * en +, − et ÷
 * @param {{tables?: number[], difficulty?: string}} options - difficulty : niveau de l'Arcade
 * @returns {{tables: number[], questionDifficulty: string}}
 */
function questionSettingsOf(options) {
  return {
    tables: Array.isArray(options.tables) ? options.tables : [],
    questionDifficulty: getDifficultySettings(options.difficulty).questionDifficulty,
  };
}

class SnakeGame {
  constructor(canvasId, mode = 'operation', options = {}) {
    console.log('Initialisation du jeu Snake');
    this.canvasId = canvasId;
    this.mode = mode;
    this.tableNumber = options.tableNumber || null;
    this.operator = options.operator || '×'; // R4.4: Support multi-opérations (+, −, ×, ÷)
    this.isDefi = mode === 'defi';
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      globalThis.navigator?.userAgent || ''
    );

    // Questions du niveau : tables (×) et nombres (+, −, ÷)
    Object.assign(this, questionSettingsOf(options));

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
    this.setInitialSnake();

    // La consigne se pose sur le plateau sans lui prendre de place : il garde sa taille
    // quand elle part
    this.showInstructions();

    // Grille choisie une fois pour toutes, puis taille des cases pour la place actuelle
    this.layoutBoard();
    this.resizeCanvas();

    // Suivi des écouteurs pour nettoyage propre
    this.eventListeners = [];

    // Initialiser les contrôles
    this.initControls();

    // L'écran change (rotation, plein écran) : les cases suivent, et la grille aussi tant
    // que rien n'est joué
    this._onResize = () => {
      if (this._disposed) return;
      if (!this.relayoutUnplayedBoard()) this.resizeCanvas();
      this.draw();
    };
    this._stopWatchingViewport = watchArcadeViewport(this.canvas, this._onResize);

    this.loadSnakeImages();
  }

  // Serpent de départ au milieu de la grille de base, tourné vers la droite
  setInitialSnake() {
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
  }

  // Images du serpent (tête, corps, virages et queue dans chaque direction), du logo, de
  // l'herbe et des pommes
  loadSnakeImages() {
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
      bodyCurves: new Map([
        ['haut-droite', this.loadSprite('corps_courbe_droite_bas.png')],
        ['droite-bas', this.loadSprite('corps_courbe_haut_droite.png')],
        ['bas-gauche', this.loadSprite('corps_courbe_gauche_haut.png')],
        ['gauche-haut', this.loadSprite('corps_courbe_bas_gauche.png')],
      ]),
      tail: {
        '1,0': this.loadSprite('queue_fin_droite.png'), // queue tournée vers la droite (serpent va à droite)
        '-1,0': this.loadSprite('queue_fin_gauche.png'), // queue tournée vers la gauche (serpent va à gauche)
        '0,-1': this.loadSprite('queue_fin_haut.png'), // queue tournée vers le haut (serpent monte)
        '0,1': this.loadSprite('queue_fin_bas.png'), // queue tournée vers le bas (serpent descend)
      },
    };

    // Herbe du plateau et pommes des réponses
    this.grassTexture = spriteFor(textureSpec('herbe.png'));
    this.appleTexture = spriteFor(textureSpec('snake_apple.png'));
  }

  // Grille du plateau, choisie au lancement pour toute la place : sur téléphone, plus haute
  // que large en portrait ; sur ordinateur, 14 × 11. Elle ne change plus pendant la partie
  // (le serpent et les pommes y restent).
  layoutBoard() {
    if (!this.isMobile) {
      this.cols = this.baseCols;
      this.rows = this.baseRows;
      return;
    }
    const box = getArcadeCanvasBox(this.canvas);
    ({ cols: this.cols, rows: this.rows } = chooseMobileSnakeGrid(box));
  }

  // Rien n'est encore joué : aucune pomme mangée, aucune vie perdue
  isUnplayed() {
    const allApples = this.numberPositions.length === this.answers.length;
    return this.score === 0 && this.lives === 3 && this.multisnake.length === 2 && allApples;
  }

  /**
   * Plein écran juste après le lancement, téléphone tourné avant de jouer : tant que rien
   * n'est joué, la grille se refait pour la nouvelle place (le serpent repart du milieu, les
   * pommes se replacent, le calcul reste). L'enfant ne perd rien.
   * @returns {boolean} Vrai si la grille a changé
   */
  relayoutUnplayedBoard() {
    if (!this.isUnplayed()) return false;
    const { cols, rows } = this;
    this.layoutBoard();
    if (this.cols === cols && this.rows === rows) return false;
    this.resizeCanvas();
    this.initializeSnakePosition();
    this.placeNumbers();
    return true;
  }

  // Taille des cases pour la place actuelle (sous le bandeau, avec « Abandonner ») : à
  // chaque changement d'écran, seul l'affichage suit
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

    const box = getArcadeCanvasBox(this.canvas);
    this.cellSize = Math.max(
      MIN_CELL_PX,
      Math.floor(Math.min(box.width / this.cols, box.height / this.rows))
    );

    // Le canevas correspond exactement à la grille, affiché à sa taille réelle
    this.canvas.width = this.cols * this.cellSize;
    this.canvas.height = this.rows * this.cellSize;
    this.canvas.style.width = this.canvas.width + 'px';
    this.canvas.style.height = this.canvas.height + 'px';
    if (this.isMobile) {
      // Assurer image-rendering pixel-perfect
      this.canvas.style.imageRendering = 'pixelated';
      this.canvas.style.imageRendering = '-moz-crisp-edges';
      this.canvas.style.imageRendering = 'crisp-edges';
    }

    this.canvas.style.display = 'block';
    this.canvas.style.margin = '0 auto';
    this.canvas.style.borderRadius = 'var(--radius-md)';
    // Le cadre s'ajoute autour du dessin : taille affichée = taille interne
    this.canvas.style.boxSizing = 'content-box';

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

  // Contrôles tactiles : un glissement oriente le serpent, un toucher le dirige vers le
  // point touché (gestes communs avec MultiMiam, js/arcade-touch.js)
  setupTouchControls() {
    const touchListeners = attachDirectionalTouch(this.canvas, {
      onSwipe: direction => this.steer(SWIPE_VECTORS[direction]),
      onTap: (clientX, clientY) => this.steerTowards(clientX, clientY),
    });

    // Souris (ordinateur) : même règle que le toucher
    this._onClick = e => this.steerTowards(e.clientX, e.clientY);
    this.canvas.addEventListener('click', this._onClick);
    this.eventListeners.push(...touchListeners, {
      element: this.canvas,
      type: 'click',
      callback: this._onClick,
      options: false,
    });
  }

  /**
   * Oriente le serpent, sauf demi-tour sur lui-même.
   * @param {{x: number, y: number}} direction
   * @returns {boolean} Vrai si la direction est prise
   */
  steer(direction) {
    if (this.gameOver || (direction.x === 0 && direction.y === 0)) return false;
    if (direction.x === -this.direction.x && direction.y === -this.direction.y) return false;
    this.nextDirection = { x: direction.x, y: direction.y };
    return true;
  }

  /**
   * Toucher ou clic : le serpent se dirige vers le point visé, vu depuis sa tête. L'axe
   * dominant d'abord ; l'autre axe si le premier lui ferait faire demi-tour.
   * @param {number} clientX
   * @param {number} clientY
   */
  steerTowards(clientX, clientY) {
    if (!this.canvas?.isConnected || !this.snake?.length) return;
    const head = this.snake[0];
    const center = canvasToClientPoint(
      this.canvas,
      (head.x + 0.5) * this.cellSize,
      (head.y + 0.5) * this.cellSize
    );
    const dx = clientX - center.x;
    const dy = clientY - center.y;
    // Trop près de la tête : aucune direction ne se dégage
    if (Math.hypot(dx, dy) < TAP_DEAD_ZONE_PX) return;

    const horizontal = { x: Math.sign(dx), y: 0 };
    const vertical = { x: 0, y: Math.sign(dy) };
    const [primary, secondary] =
      Math.abs(dx) > Math.abs(dy) ? [horizontal, vertical] : [vertical, horizontal];
    if (!this.steer(primary)) this.steer(secondary);
  }

  // Gérer les touches du clavier : une flèche oriente le serpent (jamais en demi-tour),
  // Espace relance une partie finie
  handleKeyDown(e) {
    const arrow = ARROW_DIRECTIONS.get(e.key);
    if (arrow) {
      e.preventDefault(); // Empêcher le scroll de la page
      if (arrow.x !== -this.direction.x || arrow.y !== -this.direction.y) {
        this.nextDirection = { ...arrow };
      }
      return;
    }
    if (e.key !== ' ') return;
    e.preventDefault(); // Empêcher le scroll de la page
    if (this.gameOver) this.start();
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
    } catch {
      /* ignoré volontairement */
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

    showGameInstructions(this.canvas, instructions);
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
        if (window.scrollY !== scrollBefore) this.scrollBackToTop();
      }
    } catch {
      this.focusCanvasPlainly();
    }
  }

  // Repli quand preventScroll n'est pas accepté : focus simple, puis haut de page
  focusCanvasPlainly() {
    try {
      if (!this.canvas) return;
      this.canvas.focus();
      // Forcer scroll à 0 même en cas d'erreur
      this.scrollBackToTop();
    } catch {
      /* no-op */
    }
  }

  // La page revient en haut si elle a défilé
  scrollBackToTop() {
    if (window.scrollY !== 0) window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // Générer une opération mathématique
  generateOperation() {
    try {
      // Utiliser generateQuestion pour cohérence avec le système centralisé (R4.4: multi-ops)
      const questionData = generateQuestion(this.questionOptions());

      this.currentOperation = {
        num1: questionData.a,
        num2: questionData.b,
        operator: this.operator,
        result: questionData.answer,
      };

      this.answers = this.generateAnswers(this.currentOperation.result);
      this.displayOperation();
    } catch (error) {
      console.error("Erreur lors de la génération de l'opération:", error);
      this.currentOperation = { num1: 1, num2: 1, operator: this.operator, result: 1 };
      this.displayOperation();
    }
  }

  // Options de la question : en ×, les tables du niveau, sans les tables retirées par le
  // joueur ; en +, − et ÷, les nombres du niveau
  questionOptions() {
    const isMultiplication = this.operator === '×';
    return {
      type: 'classic',
      operator: this.operator, // Support +, −, ×, ÷
      difficulty: this.questionDifficulty,
      excludeTables: isMultiplication ? excludedTablesOfCurrentUser() : [],
      tables: isMultiplication && this.tables.length > 0 ? this.tables : undefined,
      forceTable:
        isMultiplication && this.mode === 'table' && this.tableNumber ? this.tableNumber : null,
      minTable: 1,
      maxTable: 10,
      minNum: 1,
      maxNum: 10,
    };
  }

  // Bonne réponse et trois leurres, ceux des autres modes : des erreurs d'enfant plausibles
  // (un de plus ou de moins, une table à côté…), jamais négatifs ni égaux à la bonne
  // réponse. Avant, les leurres valaient c + 1, c − 1 et c + 10 : la bonne réponse était
  // toujours le milieu de trois nombres qui se suivent, et « −1 » sortait pour un résultat nul.
  generateAnswers(correctResult) {
    const { num1, num2 } = this.currentOperation ?? {};
    const question = { answer: correctResult, operator: this.operator, a: num1, b: num2 };
    const decoys = plausibleWrongAnswers(question, 3).map(value => ({ value, isCorrect: false }));
    return shuffleInPlace([{ value: correctResult, isCorrect: true }, ...decoys]);
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
        x = randomInt(2, this.cols - 3);
        y = randomInt(2, this.rows - 3);
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

    // En pause (Arcade), le serpent ne bouge plus : le temps de la pause ne compte pas
    if (!isArcadePaused()) this.advance(deltaTime);

    // Dessiner le jeu avec l'animation
    this.draw();

    // Continuer la boucle
    this.animationId = requestAnimationFrame(time => this.gameLoop(time));
  }

  // Fait avancer le serpent du temps écoulé, d'une case à chaque intervalle
  advance(deltaTime) {
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
  }

  // Mettre à jour la logique du jeu (sans dessiner)
  updateGameLogic() {
    if (this.gameOver) return;

    // Mettre à jour la direction
    this.direction = this.nextDirection;
    const head = this.nextHeadPosition();

    // Vérifier les collisions avec le serpent
    if (this.hitsItself(head)) {
      this.loseLife();
      return;
    }

    // Une pomme mangée occupe ce pas ; sinon le serpent avance, la queue suit
    if (!this.eatAppleAt(head)) {
      this.multisnake.unshift(head);
      this.multisnake.pop();
    }

    // Mettre à jour l'affichage du score
    this.updateScoreDisplay();
  }

  // Case suivante de la tête, dans la direction actuelle, d'un bord à l'autre du plateau
  nextHeadPosition() {
    const head = this.multisnake[0];
    return {
      x: wrapCell(head.x + this.direction.x, this.cols),
      y: wrapCell(head.y + this.direction.y, this.rows),
    };
  }

  // La tête arrive-t-elle sur le corps ?
  hitsItself(head) {
    return this.multisnake.some(segment => head.x === segment.x && head.y === segment.y);
  }

  /**
   * Pomme sous la tête : la bonne fait grandir le serpent et pose un autre calcul ; une
   * mauvaise retire des points et disparaît, et le serpent reste sur place ce pas-là.
   * @param {{x: number, y: number}} head
   * @returns {boolean} Vrai si une pomme est mangée
   */
  eatAppleAt(head) {
    const index = this.numberPositions.findIndex(pos => head.x === pos.x && head.y === pos.y);
    if (index === -1) return false;
    const pos = this.numberPositions.at(index);
    // Une bulle mangée : la partie est jouée (tableau de bord)
    noteArcadePlay();
    if (pos.isCorrect) this.eatGoodApple(head, pos);
    else this.eatWrongApple(index, pos);
    return true;
  }

  // Bonne réponse : 100 points, le serpent grandit et accélère, un autre calcul
  eatGoodApple(head, pos) {
    this.recordAnswer(true);
    this.score += 100;
    // Affichage du gain de points, au-dessus de la pomme mangée
    showArcadePoints(100, this.canvas, this.cellPoint(pos));
    // Augmenter la vitesse
    this.moveInterval = Math.max(this.minSpeed, this.moveInterval - this.speedIncrement);
    // Faire grandir le serpent
    this.multisnake.unshift(head);
    // Générer une nouvelle opération
    this.generateOperation();
    this.placeNumbers();
  }

  // Mauvaise réponse : on perd 50 points (au plus ce qu'on a) mais pas de vie, et on
  // retire la bulle ; la pastille montre ce qui a vraiment été retiré
  eatWrongApple(index, pos) {
    this.recordAnswer(false);
    const removed = Math.min(this.score, 50);
    this.score -= removed;
    showArcadePenalty(removed, this.canvas, this.cellPoint(pos));
    this.numberPositions.splice(index, 1);
  }

  // Calcul en cours compté juste ou faux dans les statistiques
  recordAnswer(correct) {
    const { num1, num2 } = this.currentOperation;
    recordOperationResult(this.operator, num1, num2, correct);
  }

  // Méthode centralisée pour nettoyer toutes les ressources du jeu
  cleanup() {
    this._disposed = true;
    // Posé par le constructeur ; un second appel ne fait rien
    this._stopWatchingViewport();
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
          } catch {
            /* ignoré volontairement */
          }
        }
        this.eventListeners = [];
      }
    } catch {
      /* ignoré volontairement */
    }

    // Utiliser la fonction utilitaire centralisée pour un nettoyage complet
    try {
      cleanupGameResources(this, {
        cleanAnimations: true,
        cleanEvents: true,
        cleanTimers: true,
        cleanDOM: true,
      });
    } catch {
      /* ignoré volontairement */
    }

    console.log('Snake - Ressources nettoyées');
  }

  // Perdre une vie
  loseLife() {
    this.lives--;
    this.updateScoreDisplay();

    // Afficher le message de vie perdue avec la fonction unifiée (ton neutre, jamais rouge)
    showArcadeMessage('arcade_life_lost', 'neutral');

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

    // L'herbe couvre tout le plateau, à ses proportions (rognée aux bords)
    const board = { x: 0, y: 0, width: this.canvas.width, height: this.canvas.height };
    if (!drawArcadeSprite(this.ctx, this.grassTexture, board, { fit: 'cover' })) {
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
      // La pomme, légèrement vers le haut ; un rond bleu tant que son image n'est pas arrivée
      const apple = { x: x - size / 2, y: y - size / 2 + appleOffsetY, width: size, height: size };
      if (!drawArcadeSprite(this.ctx, this.appleTexture, apple)) {
        this.ctx.beginPath();
        const radius = size / 2;
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.numberBubbleColor;
        this.ctx.fill();
        this.ctx.strokeStyle = '#1976D2';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }

      // Texte centré dans la pomme, au moins 16 px à l'écran
      const text = pos.value.toString();
      this.ctx.fillStyle = 'white';
      const fontSize = readableCanvasFontSize(
        this.canvas,
        this.isMobile ? this.cellSize * 0.5 : this.cellSize * 0.4
      );
      this.ctx.font = getCanvasFont(fontSize);
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
    if (!this.isBetweenCells()) {
      this.drawSnakeAtPositions(this.multisnake);
      return;
    }

    // Positions interpolées pour l'animation
    const interpolatedSnake = this.multisnake.map((current, i) => {
      const last = this.lastPositions.at(i);
      return {
        x: this.interpolateCell(last.x, current.x, this.direction.x, this.cols),
        y: this.interpolateCell(last.y, current.y, this.direction.y, this.rows),
      };
    });

    // Dessiner le serpent avec les positions interpolées
    this.drawSnakeAtPositions(interpolatedSnake);
  }

  // Entre deux cases : animation en cours et position précédente de chaque segment connue
  isBetweenCells() {
    const known = this.lastPositions.length;
    return this.animationProgress < 1 && known !== 0 && known === this.multisnake.length;
  }

  /**
   * Position d'un segment sur un axe pendant l'animation. Un bord franchi (téléportation) :
   * le segment glisse hors du plateau et revient de l'autre côté.
   * @param {number} last - Case précédente
   * @param {number} current - Case actuelle
   * @param {number} step - Direction sur cet axe (−1, 0, 1)
   * @param {number} size - Cases sur cet axe
   * @returns {number}
   */
  interpolateCell(last, current, step, size) {
    const delta = current - last;
    if (Math.abs(delta) <= 1) return last + delta * this.animationProgress;
    const extended = current + (step > 0 ? size : -size);
    const position = last + (extended - last) * this.animationProgress;
    return ((position % size) + size) % size;
  }

  // Dessiner le serpent à des positions spécifiques
  calculateSegmentDirections(prev, segment, next) {
    return {
      dirIn: this.directionToward(segment, next),
      dirOut: this.directionToward(segment, prev),
    };
  }

  // Direction d'un segment vers son voisin, par le bord opposé quand il l'a franchi
  directionToward(segment, neighbour) {
    return {
      x: wrappedStep(neighbour.x - segment.x, this.cols),
      y: wrappedStep(neighbour.y - segment.y, this.rows),
    };
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

    const curve = this.multisnakeSprites.bodyCurves.get(curveKey);
    if (curve) {
      this.drawCellSprite(curve, x, y);
    } else {
      const bodyKey = `${dirIn.x},${dirIn.y}`;

      const bodySprite = this.multisnakeSprites.body[bodyKey] || this.multisnakeSprites.body['1,0'];
      this.drawCellSprite(bodySprite, x, y);
    }
  }

  // Morceau du serpent : il remplit sa case pour se raccorder à ses voisins
  drawCellSprite(sprite, x, y) {
    const cell = { x, y, width: this.cellSize, height: this.cellSize };
    drawArcadeSprite(this.ctx, sprite, cell, { fit: 'fill' });
  }

  drawSnakeHead(head) {
    const dirKey = `${this.direction.x},${this.direction.y}`;

    const headSprite = this.multisnakeSprites.head[dirKey] || this.multisnakeSprites.body['1,0'];
    this.drawCellSprite(headSprite, head.x * this.cellSize, head.y * this.cellSize);
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
    this.drawCellSprite(tailSprite, tail.x * this.cellSize, tail.y * this.cellSize);
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
    } catch {
      /* ignoré volontairement */
    }
  }

  // Point du plateau où poser une pastille de points : au-dessus de la case
  cellPoint(cell) {
    return { x: (cell.x + 0.5) * this.cellSize, y: cell.y * this.cellSize };
  }

  // Morceau du serpent (« tete_droite.png ») : sa variante se charge à la taille d'une case
  loadSprite(filename) {
    return spriteFor(snakePartSpec(filename));
  }

  // Fonction utilitaire pour détecter la clé de courbe, peu importe le sens
  getCurveKey(dirIn, dirOut) {
    const curve = BODY_CURVES.find(
      ([, [a, b]]) =>
        (sameDirection(dirIn, a) && sameDirection(dirOut, b)) ||
        (sameDirection(dirIn, b) && sameDirection(dirOut, a))
    );
    return curve ? curve[0] : null;
  }
}

export { SnakeGame };
