// multimiam-simple.js - Version simplifiée du jeu Pacman pour LeapMultix
// (c) LeapMultix - 2025

import { loadSingleAvatar } from './arcade-utils.js';
import { gameState } from './game.js';
import { InfoBar } from './components/infoBar.js';
import { getTranslation } from './utils-es6.js';
import { spriteFor } from './arcade-sprites.js';
import { MONSTER_COUNT, monsterSpec, textureSpec } from './arcade-sprite-catalog.js';
import PacmanQuestions from './multimiam-questions.js';
import PacmanRenderer from './multimiam-renderer.js';
import { initPacmanEngine } from './multimiam-engine.js';
import { shuffleInPlace } from './core/random.js';
import { initPacmanControls } from './multimiam-controls.js';
import { initPacmanUI } from './multimiam-ui.js';
import { showArcadeGameOver } from './arcade.js';
import { createArcadeToast, getArcadeText } from './arcade-message.js';
import { getArcadeCanvasBox, watchArcadeViewport, renderArcadeCanvas } from './arcade-common.js';
import { cleanupGameResources } from './game-cleanup.js';
import { chooseMazeLayout, fitMazeCells } from './multimiam-layout.js';

/** Un monstre différent pour chacun des cinq fantômes */
const GHOST_MONSTERS = 5;

/** Positions et couleurs de départ des fantômes */
const INITIAL_GHOSTS = [
  { x: 9, y: 8, color: '#FF0000' }, // Rouge (Blinky)
  { x: 10, y: 8, color: '#FFB8FF' }, // Rose (Pinky)
  { x: 8, y: 8, color: '#00FFFF' }, // Cyan (Inky)
  { x: 9, y: 7, color: '#FFB852' }, // Orange (Clyde)
  { x: 10, y: 7, color: '#800080' }, // Violet (Sue)
];

export class PacmanGame {
  constructor(
    canvasId,
    difficulty = 1,
    mode = 'operation',
    tableNumber = null,
    levelIndex = 0,
    operator = '×'
  ) {
    // Initialisation du jeu
    this.canvasId = canvasId;
    this.difficulty = difficulty;
    this.mode = mode;
    this.tableNumber = tableNumber;
    this.levelIndex = levelIndex;
    this.operator = operator; // Support multi-opérations (+, −, ×, ÷)

    // NE PLUS lire l'avatar ici, se fier à updatePlayerAvatar
    // this.avatarName = window.gameState ? window.gameState.avatar : 'fox';
    // console.log('Avatar récupéré dans le constructeur PacmanGame:', this.avatarName);

    this.isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(globalThis.navigator?.userAgent || '');

    // Éléments du jeu
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.canvas.classList.add('multimiam-canvas');

    // Images de l'avatar, des monstres et du labyrinthe (loadImages)
    this.loadImages();

    // Dimensions et grille (cases à l'écran : resizeCanvas)
    this.cellSize = 30;
    this.cols = 19;
    this.rows = 15;
    this.layoutBoard();

    // Labyrinthe (0 = vide, 1 = mur, 2 = pastille, 3 = super pastille)
    this.labyrinth = this.createLabyrinth();

    this.multimiam = this.createPlayer();
    this.ghosts = this.createGhosts();

    // Initialisation des monstres (récupération des images)

    // Paramètres du jeu
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.running = false;
    this.moveInterval = 150; // ms entre chaque mouvement
    this.lastMoveTime = 0;
    this.goodAnswersCount = 0; // Compteur de bonnes réponses mangées

    // Paramètres d'animation fluide
    this.animationProgress = 0; // 0 à 1, représente la progression entre deux positions
    this.lastPacmanPosition = { x: 0, y: 0 }; // Position précédente pour l'animation
    this.lastGhostPositions = []; // Positions précédentes des fantômes

    // Paramètres d'invincibilité
    this.isInvincible = false;
    this.invincibilityDuration = 2000; // 2 secondes (réduit pour moins gêner)
    this.invincibilityEndTime = 0;
    this.blinkInterval = 200; // Intervalle de clignotement en ms
    this.isVisible = true; // Pour le clignotement

    // Période de grâce au début de la partie
    this.graceStartTime = 0;
    this.graceDuration = 2000; // 2 secondes de grâce au début

    // Vitesse des fantômes (plus la valeur est élevée, plus ils sont lents)
    this.ghostSpeed = 6; // Vitesse initiale plus lente (6 au lieu de 2)
    this.ghostMoveCounter = 0;

    // Opération mathématique
    this.currentOperation = null;
    this.answerPositions = [];

    // Messages temporaires
    this.messages = [];

    // Initialiser les contrôles via module externe
    initPacmanControls(this);

    // Créer le renderer
    this.renderer = new PacmanRenderer(this);

    // Initialiser moteur déplacements / collisions
    initPacmanEngine(this);

    // Initialiser l'interface UI (score, vies, opération)
    initPacmanUI(this);

    // Remplacer le nom du jeu dans l'UI
    this.gameTitle = getTranslation('multimiam_mode_title');
  }

  // Place disponible pour le labyrinthe : sous le bandeau, avec « Abandonner », sans faire
  // défiler la page ; la consigne est posée dessus (voir js/arcade-common.js)
  calculateCanvasDimensions() {
    if (!this.canvas.parentElement) {
      return { width: 800, height: 600 };
    }
    const box = getArcadeCanvasBox(this.canvas);
    return { width: Math.floor(box.width), height: Math.floor(box.height) };
  }

  // Appliquer les styles visuels au canvas : le labyrinthe à la taille de son dessin, et le
  // plateau sur toute la hauteur disponible, jusqu'à « Abandonner », comme dans les autres
  // jeux. Si les cases, plafonnées presque carrées, ne remplissent pas toute la hauteur (écran
  // très allongé), le labyrinthe s'y centre entre deux bandes de mur (css/arcade.css) ; les
  // clics et les touchers suivent (object-fit, converti par js/arcade-common.js).
  applyCanvasStyles(width, height, boardHeight = height) {
    const shownHeight = Math.max(height, boardHeight);
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = shownHeight + 'px';
    this.canvas.style.objectFit = 'contain';
    // La texture des bandes continue les cases du labyrinthe
    this.canvas.style.backgroundSize = `${this.cellWidth}px ${this.cellHeight}px`;
    this.canvas.style.backgroundPosition = `0 ${(shownHeight - height) / 2}px`;
    this.canvas.style.boxSizing = 'content-box';
    this.canvas.style.padding = '0';
    this.canvas.style.display = 'block';
    this.canvas.style.margin = '0 auto';
    // Cadre commun des écrans de jeu (jetons) ; épaisseur fixe, comptée dans les clics
    this.canvas.style.border = '2px solid var(--color-border-strong)';
    this.canvas.style.borderRadius = 'var(--radius-md)';
  }

  // Orientation pour la place disponible : celle qui remplit le mieux le plateau (transposé,
  // 15 × 19, sur un téléphone en portrait)
  chooseTransposed() {
    if (!this.canvas.parentElement) return false;
    return chooseMazeLayout(this.cols, this.rows, getArcadeCanvasBox(this.canvas)).transposed;
  }

  // Rien n'est encore joué : aucune réponse croquée ni vie perdue
  isUnplayed() {
    return this.score === 0 && this.lives === 3 && this.goodAnswersCount === 0;
  }

  // Orientation choisie au lancement. Ensuite, l'écran peut changer (rotation, plein
  // écran) : les cases suivent ; l'orientation aussi tant que rien n'est joué, puis elle ne
  // change plus (la partie reste la même).
  layoutBoard() {
    this.transposed = this.chooseTransposed();
    this.resizeCanvas();
    // Arrêtée en fin de partie, comme dans MultiSnake et MultiMemory : le nettoyage commun
    // rend le canevas (this.canvas = null) avant que l'élément ne quitte la page
    this._stopWatchingViewport = watchArcadeViewport(this.canvas, () => {
      if (!this.canvas) return;
      if (this.isUnplayed()) this.transposed = this.chooseTransposed();
      this.resizeCanvas();
      this.renderer?.draw();
    });
  }

  // Redimensionner le canvas pour s'adapter à l'écran
  resizeCanvas() {
    const dimensions = this.calculateCanvasDimensions();
    // Colonnes et rangées à l'écran (échangées quand le labyrinthe est transposé)
    const across = this.transposed ? this.rows : this.cols;
    const down = this.transposed ? this.cols : this.rows;

    // Cases qui remplissent la place, presque carrées (js/multimiam-layout.js) ; personnages,
    // monstres et nombres se dessinent dans le carré de leur côté court, jamais déformés
    ({ cellWidth: this.cellWidth, cellHeight: this.cellHeight } = fitMazeCells(
      across,
      down,
      dimensions
    ));
    this.cellSize = Math.min(this.cellWidth, this.cellHeight);

    // Taille du dessin du labyrinthe, en unités du jeu
    this.boardWidth = this.cellWidth * across;
    this.boardHeight = this.cellHeight * down;

    // Le labyrinthe entier en unités du jeu, net à la densité de l'écran ; l'élément prend
    // ensuite la hauteur du plateau (bandes de mur éventuelles, object-fit) : les clics et
    // les touchers se convertissent en unités du jeu (js/arcade-common.js)
    renderArcadeCanvas(this.canvas, this.boardWidth, this.boardHeight);
    this.applyCanvasStyles(this.boardWidth, this.boardHeight, dimensions.height);
  }

  /** Pacman au point de départ, à la taille de la grille actuelle */
  createPlayer() {
    return {
      x: 2, // spawn directly on the first true intersection
      y: 1,
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      speed: 5,
      size: this.cellSize * 0.8,
      mouthAngle: 0,
      mouthSpeed: 0.15,
      isMoving: true, // Indique si Pacman est en mouvement ou arrêté à une intersection
      isAtIntersection: false, // Indique si Pacman est à une intersection
    };
  }

  /** Fantômes au point de départ : seuls les deux premiers sont actifs */
  createGhosts() {
    return INITIAL_GHOSTS.map((ghost, i) => ({
      ...ghost,
      direction: 'UP',
      vulnerable: false,
      active: i < 2,
    }));
  }

  // Créer un labyrinthe de base
  createLabyrinth() {
    // Labyrinthe simple pour le jeu éducatif
    const labyrinth = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
      [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    // Ajouter des super pastilles (valeur 3) aux quatre coins du labyrinthe
    // Coin supérieur gauche
    labyrinth[1][1] = 3;
    // Coin supérieur droit
    labyrinth[1][17] = 3;
    // Coin inférieur gauche
    labyrinth[13][1] = 3;
    // Coin inférieur droit
    labyrinth[13][17] = 3;

    // Ajouter des super pastilles sur certains axes centraux
    labyrinth[7][9] = 3; // Centre du labyrinthe
    labyrinth[3][9] = 3; // Axe central supérieur
    labyrinth[11][9] = 3; // Axe central inférieur
    labyrinth[7][3] = 3; // Axe central gauche
    labyrinth[7][15] = 3; // Axe central droit

    return labyrinth;
  }

  // Initialiser le jeu
  init() {
    // Redimensionner le canvas
    this.resizeCanvas();

    // Mettre à jour l'avatar du joueur dès l'initialisation
    this.updatePlayerAvatar();

    // Générer l'opération puis placer les réponses via le module Questions
    this.generateOperation(this.multimiam.x, this.multimiam.y);

    // Mettre à jour l'affichage
    this.displayOperationUI();
    this.updateUI();
  }

  // Mettre à jour l'avatar du joueur depuis gameState
  updatePlayerAvatar() {
    // Récupérer le nom de l'avatar ACTUEL depuis la variable globale gameState
    // Utiliser 'fox' comme fallback si gameState ou gameState.avatar n'est pas défini
    const currentAvatarName =
      typeof gameState !== 'undefined' && gameState.avatar ? gameState.avatar : 'fox';

    // Utiliser la liste des avatars chargés
    if (this.avatars) {
      // Vérifier si l'avatar sélectionné doit être mis à jour
      if (!this.selectedAvatar || this.selectedAvatar.name !== currentAvatarName) {
        // Recherche directe par nom dans la liste des avatars
        for (const avatar of this.avatars) {
          if (avatar.name === currentAvatarName) {
            this.selectedAvatar = avatar;
            break;
          }
        }
        // Si l'avatar demandé n'est pas trouvé dans la liste chargée, fallback?
        // Pour l'instant, on garde l'ancien ou on n'en a pas si c'est le premier appel.
        if (this.selectedAvatar && this.selectedAvatar.name !== currentAvatarName) {
          console.warn(
            `Avatar ${currentAvatarName} demandé mais non trouvé dans les images chargées.`
          );
          // Optionnel: assigner un avatar par défaut ici si aucun n'est sélectionné
          // if (!this.selectedAvatar) this.selectedAvatar = this.avatars.find(a => a.name === 'fox');
        }
      }
    }
  }

  // Démarrer le jeu
  start() {
    // Initialiser l'état du jeu
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.running = true;
    this.goodAnswersCount = 0; // Compteur de bonnes réponses
    this.lastMoveTime = globalThis.performance?.now?.() ?? Date.now();
    this.ghostMoveCounter = 0;

    // Activer la période de grâce au début de la partie
    this.graceStartTime = Date.now();
    console.log('Période de grâce activée pour', this.graceDuration, 'ms');

    // Réinitialiser Pacman et les fantômes
    this.multimiam = this.createPlayer();
    this.ghosts = this.createGhosts();

    // Réinitialiser la vitesse des fantômes
    this.ghostSpeed = 6;
    this.ghostMoveCounter = 0;

    // Initialiser le jeu
    this.init();

    // Démarrer la boucle de jeu
    const now = globalThis.performance?.now?.() ?? Date.now();
    this.lastMoveTime = now;
    this.lastGhostMoveTime = now; // Initialiser le temps pour le mouvement des fantômes
    this._intervalId = setInterval(() => {
      this.update();
      this.renderer.draw();
    }, 1000 / 60); // 60 FPS
  }

  // Mettre en pause
  pause() {
    this.running = false;
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  // Reprendre après pause
  resume() {
    if (!this.running && !this.gameOver) {
      this.running = true;
      this.lastMoveTime = globalThis.performance?.now?.() ?? Date.now();
      this._intervalId = setInterval(() => {
        this.update();
        this.renderer.draw();
      }, 1000 / 60); // 60 FPS
    }
  }

  // Fin du jeu, une seule fois : deux collisions dans la même image ne l'enregistrent pas deux fois
  endGame() {
    if (this.gameOver) return;
    this.gameOver = true;
    this.running = false;
    if (this._stopWatchingViewport) this._stopWatchingViewport();

    // Nettoyage centralisé (ESM)
    try {
      cleanupGameResources(this, {
        cleanAnimations: true,
        cleanEvents: true,
        cleanImages: true,
        cleanDOM: true,
        cleanTimers: true,
      });
    } catch {
      /* ignoré volontairement */
    }

    // Utiliser l'interface commune de fin de jeu
    showArcadeGameOver(this.score);
  }

  // Générer l'opération puis placer les réponses via le module Questions
  generateOperation(multimiamX = -1, multimiamY = -1) {
    // Délégation au module PacmanQuestions
    this.currentOperation = PacmanQuestions.generateOperation(this);
    this.answers = PacmanQuestions.generateAnswers(this, this.currentOperation.result);
    PacmanQuestions.placeAnswers(this, multimiamX, multimiamY);
    this.displayOperationUI();
    return this.currentOperation;
  }

  // La génération détaillée est déléguée au module externe
  generateAnswers(correctResult) {
    return PacmanQuestions.generateAnswers(this, correctResult);
  }

  // Placement délégué au module externe pour alléger ce fichier
  placeAnswersInLabyrinth(multimiamX = -1, multimiamY = -1) {
    PacmanQuestions.placeAnswers(this, multimiamX, multimiamY);
  }

  // Afficher un message temporaire (apparence : .arcade-toast dans css/arcade.css)
  showMessage(text, tone = 'neutral', duration = 1000) {
    // Ne pas afficher de message si le jeu n'est pas encore démarré
    if (!this.running) return;

    // Clé de traduction, ou texte brut si la clé est absente
    const messageElement = createArcadeToast(getArcadeText(text), tone);
    this.canvas.parentNode.appendChild(messageElement);

    // Retirer le message après la durée demandée
    setTimeout(() => {
      messageElement.remove();
    }, duration);
  }

  // Afficher l'opération mathématique
  displayOperationUI() {
    const opElement = document.getElementById('multimiam-mult-display');
    if (opElement && this.currentOperation) {
      opElement.textContent = `${this.currentOperation.num1} ${this.currentOperation.operator} ${this.currentOperation.num2} = ?`;
    }
  }

  // Mettre à jour l'affichage du score
  updateUI() {
    try {
      InfoBar.update({ score: this.score, lives: this.lives }, 'multimiam');
    } catch {
      /* ignoré volontairement */
    }
  }

  // Images de l'avatar du joueur, des monstres et du labyrinthe : une source haute définition
  // chacune (un personnage qui va à gauche est retourné au dessin), chargée à la taille où elle
  // s'affiche (js/arcade-sprites.js)
  loadImages() {
    const avatarName = gameState && gameState.avatar ? gameState.avatar : 'fox';
    this.avatar = loadSingleAvatar(avatarName);

    // Cinq monstres différents, tirés parmi les 155
    const indices = Array.from({ length: MONSTER_COUNT }, (_, i) => i + 1);
    shuffleInPlace(indices);
    this.monsters = indices
      .slice(0, GHOST_MONSTERS)
      .map(id => ({ id, sprite: spriteFor(monsterSpec(id)) }));

    this.wallTexture = spriteFor(textureSpec('mur.png'));
    this.pathTexture = spriteFor(textureSpec('chemin.png'));
  }
}

export default PacmanGame;
