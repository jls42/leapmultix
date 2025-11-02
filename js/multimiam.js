// multimiam-simple.js - Version simplifiée du jeu Pacman pour LeapMultix
// (c) LeapMultix - 2025

import { loadSingleAvatar } from './arcade-utils.js';
import { gameState } from './game.js';
import { InfoBar } from './components/infoBar.js';
import { getTranslation } from './utils-es6.js';
import PacmanQuestions from './multimiam-questions.js';
import PacmanRenderer from './multimiam-renderer.js';
import { initPacmanEngine } from './multimiam-engine.js';
import { initPacmanControls } from './multimiam-controls.js';
import { initPacmanUI } from './multimiam-ui.js';
import { showArcadeGameOver } from './arcade.js';
import { recordMultiplicationResult } from './core/mult-stats.js';
import { cleanupGameResources } from './game-cleanup.js';

export class PacmanGame {
  constructor(canvasId, difficulty = 1, mode = 'operation', tableNumber = null, levelIndex = 0) {
    // Initialisation du jeu
    this.canvasId = canvasId;
    this.difficulty = difficulty;
    this.mode = mode;
    this.tableNumber = tableNumber;
    this.levelIndex = levelIndex;

    // NE PLUS lire l'avatar ici, se fier à updatePlayerAvatar
    // this.avatarName = window.gameState ? window.gameState.avatar : 'fox';
    // console.log('Avatar récupéré dans le constructeur PacmanGame:', this.avatarName);

    this.isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(globalThis.navigator?.userAgent || '');

    // Éléments du jeu
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.canvas.classList.add('multimiam-canvas');

    // Les variables de monstres (this.monsters, this.monstersLoaded, this.totalMonsters)
    // sont initialisées dans la méthode loadImages()

    // Chargement des images d'avatars et de monstres
    this.loadImages();

    // Dimensions et grille
    this.cellSize = 30;
    this.cols = 19;
    this.rows = 15;
    this.resizeCanvas();

    // Labyrinthe (0 = vide, 1 = mur, 2 = pastille, 3 = super pastille)
    this.labyrinth = this.createLabyrinth();

    // Pacman
    this.multimiam = {
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

    // fantômes - on commence avec seulement Blinky (rouge)
    this.ghosts = [];
    // Positions et couleurs initiales des fantômes
    const initialGhostPositions = [
      { x: 9, y: 8, color: '#FF0000' }, // Rouge (Blinky)
      { x: 10, y: 8, color: '#FFB8FF' }, // Rose (Pinky)
      { x: 8, y: 8, color: '#00FFFF' }, // Cyan (Inky)
      { x: 9, y: 7, color: '#FFB852' }, // Orange (Clyde)
      { x: 10, y: 7, color: '#800080' }, // Violet (Sue) - Ajouté
    ];

    for (let i = 0; i < initialGhostPositions.length; i++) {
      this.ghosts.push({
        ...initialGhostPositions[i],
        direction: 'UP', // Direction initiale
        vulnerable: false,
        active: i < 2, // Seuls les 2 premiers sont actifs au départ
      });
    }

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

    // Utiliser le logo MultiMiam
    this.logoImg = new Image();
    this.logoImg.src = 'assets/images/arcade/logo_multimiam_128x128.png';
  }

  // Obtenir les dimensions de la fenêtre avec fallback
  getWindowDimensions() {
    const getGlobal = () => {
      if (typeof globalThis !== 'undefined') return globalThis;
      if (typeof window !== 'undefined') return window;
      return { innerWidth: 800, innerHeight: 600 };
    };
    const global = getGlobal();
    return {
      width: global.innerWidth || 800,
      height: global.innerHeight || 600,
    };
  }

  // Calculer les dimensions du canvas selon les ratios
  calculateCanvasDimensions() {
    const container = this.canvas.parentElement;
    if (!container) {
      return { width: 800, height: 600 };
    }

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const windowDimensions = this.getWindowDimensions();

    // Réserver de l'espace pour les éléments UI (barre info, boutons, marges)
    // Info bar: ~80px, boutons: ~60px, marges: ~50px
    // Mobile: réduire l'espace réservé pour maximiser le canvas
    const uiSpaceReserved = this.isMobile ? 170 : 190;
    const availableHeight = Math.max(
      Math.min(containerHeight, windowDimensions.height) - uiSpaceReserved,
      300 // Hauteur minimum
    );

    const widthRatio = this.isMobile ? 0.98 : 0.9;
    const heightRatio = this.isMobile ? 0.98 : 0.95;
    const maxWidth = Math.min(containerWidth, windowDimensions.width * widthRatio);

    // Calculer les dimensions en respectant le ratio du labyrinthe (19:15)
    const labyrinthAspectRatio = this.rows / this.cols; // 15/19 = 0.789
    let canvasWidth, canvasHeight;

    // Stratégie différente selon l'orientation
    const isPortrait = windowDimensions.height > windowDimensions.width;

    if (isPortrait || this.isMobile) {
      // Mobile/Portrait: maximiser la hauteur disponible
      canvasHeight = availableHeight * heightRatio;
      canvasWidth = canvasHeight / labyrinthAspectRatio;

      // Si la largeur dépasse, ajuster
      if (canvasWidth > maxWidth) {
        canvasWidth = maxWidth * widthRatio;
        canvasHeight = canvasWidth * labyrinthAspectRatio;
      }
    } else {
      // Desktop/Paysage: maximiser la largeur
      canvasWidth = maxWidth * widthRatio;
      canvasHeight = canvasWidth * labyrinthAspectRatio;

      // Si la hauteur dépasse l'espace disponible, ajuster
      if (canvasHeight > availableHeight) {
        canvasHeight = availableHeight * heightRatio;
        canvasWidth = canvasHeight / labyrinthAspectRatio;
      }
    }

    // S'assurer que les dimensions ne dépassent jamais l'espace disponible
    canvasWidth = Math.min(canvasWidth, maxWidth);
    canvasHeight = Math.min(canvasHeight, availableHeight);

    return { width: Math.floor(canvasWidth), height: Math.floor(canvasHeight) };
  }

  // Appliquer les styles visuels au canvas
  applyCanvasStyles(width, height) {
    // IMPORTANT: Utiliser setProperty avec !important pour surcharger le CSS externe
    // qui définit height: auto et box-sizing: border-box !important
    this.canvas.style.setProperty('width', width + 'px', 'important');
    this.canvas.style.setProperty('height', height + 'px', 'important');
    this.canvas.style.setProperty('box-sizing', 'content-box', 'important');
    this.canvas.style.setProperty('padding', '0', 'important');
    this.canvas.style.display = 'block';
    this.canvas.style.margin = '0 auto';
    this.canvas.style.border = '2px solid #3F51B5';
    this.canvas.style.borderRadius = '8px';
  }

  // Redimensionner le canvas pour s'adapter à l'écran
  resizeCanvas() {
    const dimensions = this.calculateCanvasDimensions();

    this.canvas.width = dimensions.width;
    this.canvas.height = dimensions.height;

    // Calculer la taille des cellules
    this.cellSize = Math.floor(
      Math.min(this.canvas.width / this.cols, this.canvas.height / this.rows)
    );

    // Ajuster la taille du canvas pour qu'il corresponde exactement à la grille
    const actualWidth = this.cellSize * this.cols;
    const actualHeight = this.cellSize * this.rows;

    // S'assurer que le canvas a la bonne taille pour afficher tout le labyrinthe
    this.canvas.width = actualWidth;
    this.canvas.height = actualHeight;

    // IMPORTANT: Appliquer les styles CSS APRÈS avoir défini les dimensions internes
    // pour éviter un décalage entre taille CSS et taille interne du canvas
    this.applyCanvasStyles(actualWidth, actualHeight);
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

    // Test de rendu direct pour vérifier que le contexte canvas fonctionne
    this.ctx.save();
    this.ctx.fillStyle = 'red';
    this.ctx.beginPath();
    this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, 20, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.strokeStyle = 'yellow';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
    this.ctx.restore();
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

    // Réinitialiser Pacman
    this.multimiam = {
      x: 2, // spawn directly on the first true intersection
      y: 1,
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      speed: 5,
      size: this.cellSize * 0.8,
      mouthAngle: 0,
      mouthSpeed: 0.15,
      isMoving: true,
      isAtIntersection: false,
    };

    // Réinitialiser les fantômes - commencer avec seulement Blinky (rouge)
    this.ghosts = [];
    // Positions et couleurs initiales des fantômes
    const initialGhostPositions = [
      { x: 9, y: 8, color: '#FF0000' }, // Rouge (Blinky)
      { x: 10, y: 8, color: '#FFB8FF' }, // Rose (Pinky)
      { x: 8, y: 8, color: '#00FFFF' }, // Cyan (Inky)
      { x: 9, y: 7, color: '#FFB852' }, // Orange (Clyde)
      { x: 10, y: 7, color: '#800080' }, // Violet (Sue) - Ajouté
    ];

    for (let i = 0; i < initialGhostPositions.length; i++) {
      this.ghosts.push({
        // eslint-disable-next-line security/detect-object-injection -- Safe: controlled numeric index iterating initialGhostPositions
        ...initialGhostPositions[i],
        direction: 'UP', // Direction initiale
        vulnerable: false,
        active: i < 2, // Seuls les 2 premiers sont actifs au départ
      });
    }

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

  // Fin du jeu
  endGame() {
    this.gameOver = true;
    this.running = false;

    // Nettoyage centralisé (ESM)
    try {
      cleanupGameResources(this, {
        cleanAnimations: true,
        cleanEvents: true,
        cleanImages: true,
        cleanDOM: true,
        cleanTimers: true,
      });
    } catch (e) {
      void e;
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

  // Afficher un message temporaire
  showMessage(text, color, duration = 1000) {
    // Ne pas afficher de message si le jeu n'est pas encore démarré
    if (!this.running) return;

    const messageElement = document.createElement('div');
    messageElement.className = 'multimiam-message';
    // Style fond blanc semi-transparent et contraste
    messageElement.style.background = 'rgba(255,255,255,0.92)';
    messageElement.style.borderRadius = '14px';
    messageElement.style.padding = '18px 32px';
    messageElement.style.boxShadow = '0 2px 12px rgba(0,0,0,0.13)';
    messageElement.style.border = '1px solid #eee';
    // Couleur texte par défaut sombre, mais laisse la couleur personnalisée si précisée
    if (!color) messageElement.style.color = '#222';
    // Pour le mode nuit, ajuster dynamiquement
    if (document.body.classList.contains('night') || document.body.dataset.theme === 'dark') {
      messageElement.style.background = 'rgba(255,255,255,0.92)';
      messageElement.style.color = '#111';
      messageElement.style.border = '1px solid #444';
    }
    // Utiliser i18n ESM; fallback au texte brut si clé absente
    let displayText = getTranslation(text);
    if (
      typeof displayText === 'string' &&
      displayText.startsWith('[') &&
      displayText.endsWith(']')
    ) {
      displayText = text;
    }
    messageElement.textContent = displayText;
    messageElement.style.color = color;
    messageElement.style.position = 'absolute';
    messageElement.style.top = '50%';
    messageElement.style.left = '50%';
    messageElement.style.transform = 'translate(-50%, -50%)';
    messageElement.style.fontSize = '24px';
    messageElement.style.fontWeight = 'bold';
    messageElement.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
    messageElement.style.zIndex = '100';

    this.canvas.parentNode.appendChild(messageElement);

    // Supprimer le message après 1 seconde
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
    } catch (e) {
      void e;
    }
  }

  // Chargement des images d'avatars et de monstres
  loadImages() {
    // Charger l'avatar du joueur depuis gameState
    const avatarName = gameState && gameState.avatar ? gameState.avatar : 'fox';
    this.avatar = loadSingleAvatar(avatarName);

    // Optimisation pour mobile : précharger et mettre en cache les monstres
    this.monsters = [];
    this.monstersLoaded = 0;
    this.totalMonsters = 5; // Limité à 5 monstres (un pour chaque fantôme)

    // Force la limitation à 5 monstres maximum pour éviter les problèmes de mémoire

    // Créer des images optimisées pour mobile

    // Créer un tableau d'indices disponibles (1 à 43)
    const availableIndices = [];
    for (let i = 1; i <= 155; i++) {
      availableIndices.push(i);
    }

    // Mélanger les indices disponibles (algorithme de Fisher-Yates)
    for (let i = availableIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
    }

    // Précharger les images avec des événements de chargement
    for (let i = 0; i < this.totalMonsters; i++) {
      // Prendre les premiers indices du tableau mélangé (garantit l'unicité)
      const monsterIndex = availableIndices[i];

      // Formatter le numéro avec zéro de remplissage (01, 02, etc.)
      const formattedIndex = monsterIndex.toString().padStart(2, '0');

      // Créer un objet monstre avec des images directionnelles
      const monsterObj = {
        id: monsterIndex,
        image_left: new Image(),
        image_right: new Image(),
      };

      // Charger les deux images
      monsterObj.image_left.src = `assets/images/arcade/monstre${formattedIndex}_left_128x128.png`;
      monsterObj.image_right.src = `assets/images/arcade/monstre${formattedIndex}_right_128x128.png`;

      // Événement quand les images sont chargées
      let loadedCount = 0;
      const onImageLoad = () => {
        loadedCount++;
        if (loadedCount === 2) {
          // Attend que les deux images (gauche/droite) soient chargées
          this.monstersLoaded++;
          console.log(
            `Monstre ${monsterIndex} chargé (${this.monstersLoaded}/${this.totalMonsters})`
          );
        }
      };

      monsterObj.image_left.onload = onImageLoad;
      monsterObj.image_right.onload = onImageLoad;

      // Ajout de l'objet monstre à la collection
      this.monsters.push(monsterObj);
    }

    // Chargement des textures mur et chemin
    this.wallTexture = new Image();
    this.wallTexture.src = 'assets/images/arcade/mur_128x128.png';

    this.pathTexture = new Image();
    this.pathTexture.src = 'assets/images/arcade/chemin_128x128.png';
  }

  update() {
    if (this.multimiam.isEatingDot) {
      const eaten = this.multimiam.eatenDot; // assume set earlier
      // Correct dot (should be pellet representing answer)
      if (eaten.isCorrect) {
        // Adaptive learning: record correct result
        recordMultiplicationResult(this.currentOperation.num1, this.currentOperation.num2, true);
        this.score += eaten.points;
      } else {
        // Adaptive learning: record incorrect result
        recordMultiplicationResult(this.currentOperation.num1, this.currentOperation.num2, false);
        this.lives -= eaten.penalty;
      }
      this.multimiam.isEatingDot = false;
      this.multimiam.eatenDot = null;
    }
  }
}

export default PacmanGame;
