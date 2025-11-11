/* =====================
   Arcade Memory Launcher (MultiMemory)
   - Contient la fonction startMemoryArcade pour lancer le jeu MultiMemory
   - Dépend de getArcadeGameTemplate (arcade.js) et des fonctions communes
   ===================== */

import { generateQuestion } from './questionGenerator.js';
import { goToSlide } from './slides.js';
import { gameState } from './game.js';
import { Utils } from './utils-es6.js';
import { getTranslation, cleanupGameResources, showArcadeMessage } from './utils-es6.js';
import { arcadeSpriteLoader } from './arcade-sprite-loader.js';
import { setStartingMode } from './mode-orchestrator.js';
import { InfoBar } from './components/infoBar.js';
import {
  startArcadeTimer,
  showArcadeGameOver,
  stopArcadeMode,
  monsterSprites,
  isArcadeActive,
} from './arcade.js';
import { eventBus } from './core/eventBus.js';
import { AudioManager } from './core/audio.js';
import { showGameInstructions } from './arcade-common.js';
import { getDifficultySettings } from './difficulty.js';
import { TablePreferences } from './core/tablePreferences.js';
import { UserManager } from './userManager.js';
// Dépend des helpers ESM (plus d'assignations window.*)

// Instance locale du jeu (remplace window.memoryGame)
let _memoryGameInstance = null;

/**
 * Fonction centralisée de nettoyage du jeu Memory
 * Utilisée à la fois pour le bouton "Abandonner" et pour arcade:stop (bouton accueil)
 * @returns {number} Le score actuel du jeu
 */
function cleanupMemoryGame() {
  if (!_memoryGameInstance) return 0;

  const score = _memoryGameInstance.score ?? 0;

  // Nettoyer toutes les ressources du jeu
  try {
    if (typeof _memoryGameInstance.cleanup === 'function') {
      _memoryGameInstance.cleanup();
    }
    cleanupGameResources(_memoryGameInstance);
  } catch {
    // Erreur ignorée (non-critique)
  }

  _memoryGameInstance = null;
  return score;
}

export function startMemoryArcade() {
  try {
    stopArcadeMode();
  } catch {
    // Erreur ignorée (non-critique)
  }
  // Définir le mode avant le changement de slide pour éviter les auto-stop
  setStartingMode('multimemory');
  gameState.gameMode = 'multimemory';
  goToSlide(4);
  // arcadeActive basculé au démarrage du timer (startArcadeTimer)

  // S'assurer que la difficulté est définie et valide
  if (!['debutant', 'moyen', 'difficile'].includes(gameState.difficulty)) {
    console.warn(
      `Difficulté non valide: ${gameState.difficulty}, utilisation de 'moyen' par défaut`
    );
    gameState.difficulty = 'moyen';
    localStorage.setItem('gameState.difficulty', 'moyen');
  }

  // Nettoyer les anciennes instances de jeux et leurs ressources
  if (_memoryGameInstance) {
    // Utiliser la fonction utilitaire centralisée pour un nettoyage complet
    cleanupGameResources(_memoryGameInstance, {
      cleanAnimations: true,
      cleanEvents: true,
      cleanImages: true,
      cleanTimers: true,
    });

    // Appeler la méthode cleanup spécifique si elle existe
    if (typeof _memoryGameInstance.cleanup === 'function') {
      _memoryGameInstance.cleanup();
    }

    _memoryGameInstance = null;
  }

  // Nettoyage préventif centralisé via stopArcadeMode (déjà appelé)

  // plus de boucle globale à annuler ici

  // Nettoyer l'écran jeu
  const gameScreen = document.getElementById('game');
  while (gameScreen.firstChild) gameScreen.removeChild(gameScreen.firstChild);
  const frag = InfoBar.createArcadeTemplateElement({
    mode: 'multimemory',
    canvasId: 'multimemory-canvas',
    operationId: 'arcade-mult-display',
    scoreId: 'multimemory-info-score',
    livesId: 'multimemory-info-lives',
    timerId: 'arcade-info-timer',
    abandonId: 'multimemory-abandon-btn',
    operationLabel: '', // Supprimer le texte descriptif qui prend trop de place
    abandonLabel: getTranslation('abandon_arcade_button'),
    showLives: false, // Masquer les vies car ce jeu n'utilise pas ce concept
    showScore: true, // Activer le score comme dans les autres jeux
  });
  gameScreen.appendChild(frag);

  // Utilisation des paramètres de difficulté (Cascade 2025)
  const difficultySettings = getDifficultySettings(gameState.difficulty || 'moyen');
  // Durée de la partie selon le niveau
  startArcadeTimer(difficultySettings.timeSeconds);

  // Forcer la mise à zéro du score via InfoBar
  try {
    InfoBar.update({ score: 0 }, 'multimemory');
  } catch {
    // Erreur ignorée (non-critique)
  }

  // Bouton abandon → retour au menu Arcade avec sauvegarde du score
  const abandonBtn = document.getElementById('multimemory-abandon-btn');
  if (abandonBtn) {
    // S'assurer qu'il n'y a pas d'écouteurs dupliqués
    abandonBtn.removeEventListener('click', handleAbandonClick);
    abandonBtn.addEventListener('click', handleAbandonClick);
  }

  // Initialiser le jeu Memory
  _memoryGameInstance = new MemoryGame('multimemory-canvas', {
    difficulty: gameState.difficulty || 'moyen',
    tables: difficultySettings.tables,
    lives: difficultySettings.lives || 3,
    pairs: difficultySettings.pairs,
  });
  _memoryGameInstance.start();

  try {
    setTimeout(() => setStartingMode(null), 0);
  } catch {
    // Erreur ignorée (non-critique)
  }

  // Écouter l'arrêt arcade via EventBus (bouton accueil) → cleanup sans game over
  try {
    eventBus.on('arcade:stop', cleanupMemoryGame, { once: true });
  } catch {
    // Erreur ignorée (non-critique)
  }
}

// Gestionnaire d'événement pour le bouton abandon
function handleAbandonClick() {
  // Désactiver le bouton pour éviter les clics multiples
  const abandonBtn = document.getElementById('multimemory-abandon-btn');
  if (abandonBtn) {
    abandonBtn.disabled = true;
  }

  // Cleanup centralisé + afficher game over
  const score = cleanupMemoryGame();
  showArcadeGameOver(score);
}

// Classe du jeu Memory
class MemoryGame {
  constructor(canvasId, options = {}) {
    this.canvasId = canvasId;
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      globalThis.navigator?.userAgent || ''
    );

    // Options et difficulté
    this.difficulty = options.difficulty || 'moyen';
    this.tables = Array.isArray(options.tables) ? options.tables : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // S'assurer que les options.pairs sont correctement appliquées
    if (typeof options.pairs === 'number') {
      this.pairs = options.pairs;
    } else {
      this.pairs = this.getPairsCount();
    }

    this.lives = options.lives || 3;

    // État du jeu
    this.score = 0;
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.isGameOver = false;
    this.isProcessingMatch = false;
    this.lastMousePos = { x: 0, y: 0 };

    // Timers et animation
    this.timers = [];
    this.animations = [];

    // Images pour les cartes
    this.cardBack = arcadeSpriteLoader.loadSpriteSync('chemin', 'ui');

    // Sons
    this.successSound = new Audio('assets/sounds/mixkit-electronic-lock-success-beeps-2852.wav');
    this.failureSound = new Audio('assets/sounds/mixkit-failure-arcade-alert-notification-240.wav');

    // Chargement des monstres via ESM (plus de dépendance à window.monsterSprites)
    this.monsterImages = monsterSprites;

    // Dimensions et layout
    this.resizeCanvas();
    // Stocker la fonction liée pour pouvoir la retirer plus tard
    this.boundResizeCanvas = this.resizeCanvas.bind(this);
    (typeof globalThis !== 'undefined'
      ? globalThis
      : typeof window !== 'undefined'
        ? window
        : undefined
    )?.addEventListener?.('resize', this.boundResizeCanvas);

    // Événements
    this.setupEventListeners();
  }

  // Détermine le nombre de paires selon la difficulté
  getPairsCount() {
    const level = (this.difficulty || '').toLowerCase().trim();
    // 8 cartes (4 paires) facile/débutant/easy
    if (level === 'debutant' || level === 'facile' || level === 'easy') return 4;
    // 12 cartes (6 paires) moyen/medium
    if (level === 'moyen' || level === 'medium') return 6;
    // 16 cartes (8 paires) difficile/hard
    if (level === 'difficile' || level === 'hard') return 8;
    console.warn(`Difficulty '${this.difficulty}' non reconnu, fallback sur moyen (6 paires)`);
    return 6;
  }

  // Méthode shuffleArray qui utilise la fonction centralisée
  shuffleArray(array) {
    if (Utils?.shuffleArray) {
      return Utils.shuffleArray(array);
    }
    // Fallback: algorithme Fisher-Yates local
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Redimensionne le canvas pour s'adapter à l'écran
  resizeCanvas() {
    // Vérifier que le canvas existe toujours avant d'essayer d'y accéder
    if (!this.canvas || !document.body.contains(this.canvas)) {
      // Canvas supprimé, désactiver l'écouteur d'événement resize
      (typeof globalThis !== 'undefined'
        ? globalThis
        : typeof window !== 'undefined'
          ? window
          : undefined
      )?.removeEventListener?.('resize', this.boundResizeCanvas);
      return;
    }

    const container = this.canvas.parentElement;
    if (!container) return; // Protection supplémentaire

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Réserver de l'espace pour les éléments UI (score en haut + bouton en bas)
    const uiSpaceReserved = 185; // pixels réservés pour UI (score: ~133px + button: 52px)
    const availableHeight = Math.max(containerHeight - uiSpaceReserved, 300);

    // Garder un ratio d'affichage correct
    const aspectRatio = this.isMobile ? 0.75 : 1.33; // hauteur / largeur

    let canvasWidth, canvasHeight;
    if (containerWidth * aspectRatio <= availableHeight) {
      canvasWidth = containerWidth * 0.95;
      canvasHeight = canvasWidth * aspectRatio;
    } else {
      canvasHeight = availableHeight * 0.95;
      canvasWidth = canvasHeight / aspectRatio;
    }

    // Garantir que le canvas ne dépasse JAMAIS la hauteur disponible
    if (canvasHeight > availableHeight * 0.95) {
      canvasHeight = availableHeight * 0.95;
      canvasWidth = canvasHeight / aspectRatio;
    }

    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.canvas.style.width = `${canvasWidth}px`;
    this.canvas.style.height = `${canvasHeight}px`;

    // Recalculer les dimensions des cartes
    if (this.cards.length > 0) {
      this.calculateCardDimensions();
      this.positionCards();
    }

    // Redessiner le jeu
    this.draw();
  }

  // Configure les écouteurs d'événements
  setupEventListeners() {
    const self = this;

    // Gestionnaire de clic pour desktop
    this.boundHandleClick = e => {
      // Seulement pour les vrais clics (non tactiles)
      if (e.isTrusted && e.type === 'click') {
        self.handleCardClick(e);
      }
    };
    this.canvas.addEventListener('click', this.boundHandleClick);

    // Gestion tactile simplifiée, traitement direct au touchend
    this.boundHandleTouchEnd = e => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (e.changedTouches && e.changedTouches.length > 0) {
        const touch = e.changedTouches[0];
        const rect = self.canvas.getBoundingClientRect();
        const x = (touch.clientX - rect.left) * (self.canvas.width / rect.width);
        const y = (touch.clientY - rect.top) * (self.canvas.height / rect.height);

        self.handleDirectTouch(x, y);
      }
    };

    // Empêcher le comportement par défaut sur touchstart (évite le zoom/défilement)
    this.boundHandleTouchStart = e => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    };

    // Ajouter les écouteurs tactiles
    this.canvas.addEventListener('touchstart', this.boundHandleTouchStart, { passive: false });
    this.canvas.addEventListener('touchend', this.boundHandleTouchEnd, { passive: false });

    // Suivi de la position de la souris pour desktop
    this.boundHandleMouseMove = e => {
      const rect = self.canvas.getBoundingClientRect();
      self.lastMousePos = {
        x: (e.clientX - rect.left) * (self.canvas.width / rect.width),
        y: (e.clientY - rect.top) * (self.canvas.height / rect.height),
      };

      // Redessiner seulement si nous sommes en hover sur une carte (desktop uniquement)
      if (!self.isMobile && self.getCardAtPosition(self.lastMousePos.x, self.lastMousePos.y)) {
        self.draw();
      }
    };

    // Seulement sur desktop
    if (!this.isMobile) {
      this.canvas.addEventListener('mousemove', this.boundHandleMouseMove);
    }

    // Redimensionnement
    this.boundResizeCanvas = this.resizeCanvas.bind(this);
    (typeof globalThis !== 'undefined'
      ? globalThis
      : typeof window !== 'undefined'
        ? window
        : undefined
    )?.addEventListener?.('resize', this.boundResizeCanvas);
  }

  // Initialise le jeu
  start() {
    this.createCards();
    this.calculateCardDimensions();
    this.positionCards();
    this.shuffleCards();
    this.draw();

    // Démarrer la boucle de jeu
    this.gameLoop();

    // Utiliser la fonction commune pour afficher les instructions au-dessus du canvas
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      globalThis.navigator?.userAgent || ''
    );
    let instructions;

    if (isMobile) {
      instructions =
        getTranslation('arcade.multiMemory.controls.mobile') ||
        'Touchez les cartes pour les retourner et trouver les paires !';
    } else {
      instructions =
        getTranslation('arcade.multiMemory.controls.desktop') ||
        'Cliquez sur les cartes pour les retourner et trouver les paires !';
    }

    showGameInstructions(this.canvas, instructions, '#4CAF50', 5000);
  }

  // Crée les cartes pour le jeu
  createCards() {
    // Forcer la réinitialisation du nombre de paires selon la difficulté actuelle
    // Cette ligne est ajoutée pour s'assurer que le bon nombre de paires est utilisé à chaque fois
    this.pairs = this.getPairsCount();

    this.cards = [];
    const selectedTables = this.tables.slice();
    this.shuffleArray(selectedTables);

    // Préparer pool de monstres uniques
    const monsterCount = this.monsterImages.length;
    const neededCards = this.pairs * 2;
    let monsterIndices = Array.from({ length: monsterCount }, (_, i) => i);
    this.shuffleArray(monsterIndices);
    if (monsterIndices.length < neededCards) {
      while (monsterIndices.length < neededCards) {
        monsterIndices.push(Math.floor(Math.random() * monsterCount));
      }
    }
    monsterIndices = monsterIndices.slice(0, neededCards);

    // Créer et décorer les cartes
    for (let i = 0; i < this.pairs; i++) {
      if (i >= selectedTables.length) this.shuffleArray(selectedTables);

      // Appliquer l'exclusion globale de tables
      const currentUser = UserManager.getCurrentUser();
      const excluded = TablePreferences.isGlobalEnabled(currentUser)
        ? TablePreferences.getActiveExclusions(currentUser)
        : [];

      // Utiliser generateQuestion pour génération cohérente
      const questionData = generateQuestion({
        type: 'classic',
        tables: this.tables,
        excludeTables: excluded,
        minNum: 1,
        maxNum: 10,
      });

      const table = questionData.table;
      const multiplicand = questionData.num;
      const result = questionData.answer;
      // Tirer des indices uniques

      const monsterMul = monsterIndices.pop();

      const monsterRes = monsterIndices.pop();
      // Carte multiplication
      this.cards.push({
        id: i * 2,
        type: 'multiplication',
        content: `${table}×${multiplicand}`,
        table,
        multiplicand,
        result,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        isFlipped: false,
        isMatched: false,
        monsterIndex: monsterMul,
        pairId: i,
      });
      // Carte résultat
      this.cards.push({
        id: i * 2 + 1,
        type: 'result',
        content: `${result}`,
        table,
        multiplicand,
        result,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        isFlipped: false,
        isMatched: false,
        monsterIndex: monsterRes,
        pairId: i,
      });
    }
  }

  // Fonction utilitaire pour compter les éléments uniques dans un tableau
  countUnique(array) {
    return new Set(array).size;
  }

  // Calcule les dimensions des cartes selon le nombre de paires
  calculateCardDimensions() {
    const cardCount = this.cards.length;
    // Fixed 4 columns, dynamic rows
    const cols = 4;
    const rows = Math.ceil(cardCount / cols);

    // Ajouter une marge entre les cartes
    const margin = this.isMobile ? 6 : 10;
    const availableWidth = this.canvas.width - margin * (cols + 1);
    const availableHeight = this.canvas.height - margin * (rows + 1);

    this.cardWidth = availableWidth / cols;
    this.cardHeight = availableHeight / rows;

    this.cols = cols;
    this.rows = rows;
    this.margin = margin;
  }

  // Positionne les cartes sur la grille (centré) avec meilleure détection mobile
  positionCards() {
    // Calculer dimensions totales de la grille sans marges externes
    const gridWidth = this.cols * this.cardWidth + (this.cols - 1) * this.margin;
    const gridHeight = this.rows * this.cardHeight + (this.rows - 1) * this.margin;

    // Calculer offset pour centrer la grille
    const offsetX = Math.floor((this.canvas.width - gridWidth) / 2);
    const offsetY = Math.floor((this.canvas.height - gridHeight) / 2);

    // Positionner chaque carte avec des coordonnées entières pour éviter les problèmes d'arrondi
    for (let i = 0; i < this.cards.length; i++) {
      const col = i % this.cols;
      const row = Math.floor(i / this.cols);

      // Utiliser Math.floor pour éviter les décalages de pixel

      this.cards[i].x = Math.floor(offsetX + col * (this.cardWidth + this.margin));

      this.cards[i].y = Math.floor(offsetY + row * (this.cardHeight + this.margin));

      this.cards[i].width = Math.floor(this.cardWidth);

      this.cards[i].height = Math.floor(this.cardHeight);
    }
  }

  // Mélange les cartes
  shuffleCards() {
    this.shuffleArray(this.cards);

    // Repositionner les cartes mélangées
    for (let i = 0; i < this.cards.length; i++) {
      const col = i % this.cols;
      const row = Math.floor(i / this.cols);

      this.cards[i].x = this.margin + col * (this.cardWidth + this.margin);

      this.cards[i].y = this.margin + row * (this.cardHeight + this.margin);
    }
  }

  // Gère le clic sur une carte
  handleCardClick(e) {
    if (this.isGameOver || this.isProcessingMatch) return;

    let x, y;

    // Pour les événements tactiles, utiliser directement les coordonnées fournies
    if (e.type === 'touchend') {
      x = e.clientX;
      y = e.clientY;
    } else {
      // Pour les clics de souris normaux
      const rect = this.canvas.getBoundingClientRect();
      x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
      y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
    }

    const clickedCard = this.getCardAtPosition(x, y);

    if (clickedCard && !clickedCard.isFlipped && !clickedCard.isMatched) {
      // Retourner la carte
      clickedCard.isFlipped = true;
      this.flippedCards.push(clickedCard);

      // Vérifier si deux cartes sont retournées
      if (this.flippedCards.length === 2) {
        this.isProcessingMatch = true;
        this.checkForMatch();
      }

      // Redessiner immédiatement
      this.draw();
    }
  }

  // Implémentation directe pour le tactile sur mobile
  handleDirectTouch(touchX, touchY) {
    if (this.isGameOver || this.isProcessingMatch) return;

    const clickedCard = this.getCardAtPosition(touchX, touchY);

    if (clickedCard && !clickedCard.isFlipped && !clickedCard.isMatched) {
      // Retourner la carte
      clickedCard.isFlipped = true;
      this.flippedCards.push(clickedCard);

      // Vérifier si deux cartes sont retournées
      if (this.flippedCards.length === 2) {
        this.isProcessingMatch = true;
        this.checkForMatch();
      }

      // Redessiner immédiatement
      this.draw();
      return true;
    }
    return false;
  }

  // Récupère la carte à la position donnée avec une zone de tolérance pour le tactile
  getCardAtPosition(x, y) {
    // Ajouter une tolérance pour faciliter la détection sur mobile (en pixels)
    const tolerance = this.isMobile ? 25 : 5; // Tolérance plus grande sur mobile

    // Vérifier d'abord avec une tolérance
    for (const card of this.cards) {
      if (
        x >= card.x - tolerance &&
        x <= card.x + card.width + tolerance &&
        y >= card.y - tolerance &&
        y <= card.y + card.height + tolerance &&
        !card.isMatched
      ) {
        return card;
      }
    }

    // Aucune carte trouvée même avec tolérance
    return null;
  }

  // Vérifie si les cartes retournées forment une paire
  checkForMatch() {
    const [card1, card2] = this.flippedCards;

    // Attendre un peu pour montrer les deux cartes
    const timer = setTimeout(() => {
      // Vérifier si les deux cartes forment une paire valide
      const isSameOrder = card1.table === card2.table && card1.multiplicand === card2.multiplicand;
      const isSwapped = card1.table === card2.multiplicand && card1.multiplicand === card2.table;
      if (
        card1.result === card2.result &&
        card1.type !== card2.type && // Une multiplication et un résultat
        (isSameOrder || isSwapped)
      ) {
        // C'est une paire !
        card1.isMatched = true;
        card2.isMatched = true;
        this.matchedPairs++;
        this.score += 10;

        // Mettre à jour l'affichage du score
        try {
          InfoBar.update({ score: this.score }, 'multimemory');
        } catch {
          // Erreur ignorée (non-critique)
        }

        // Jouer le son de succès si le son est activé
        if (!this.successSound.paused) {
          this.successSound.pause();
          this.successSound.currentTime = 0;
        }
        // Vérifier si le son est activé globalement avant de jouer
        if (!AudioManager.isMuted()) {
          this.successSound.play().catch(() => {});
        }

        // Afficher un message de félicitations
        showArcadeMessage('arcade.multiMemory.match', '#4CAF50', 1000);

        // Vérifier si toutes les paires ont été trouvées
        if (this.matchedPairs === this.pairs) {
          this.gameWon();
        }
      } else {
        // Pas une paire, retourner les cartes
        card1.isFlipped = false;
        card2.isFlipped = false;

        // Jouer le son d'échec si le son est activé
        if (!this.failureSound.paused) {
          this.failureSound.pause();
          this.failureSound.currentTime = 0;
        }
        // Vérifier si le son est activé globalement avant de jouer
        if (!AudioManager.isMuted()) {
          this.failureSound.play().catch(() => {});
        }

        // Afficher un message d'échec
        showArcadeMessage('arcade.multiMemory.mismatch', '#F44336', 1000);
      }

      // Réinitialiser pour le prochain tour
      this.flippedCards = [];
      this.isProcessingMatch = false;
      this.draw();
    }, 1000);

    this.timers.push(timer);
  }

  // Le joueur a gagné en trouvant toutes les paires
  gameWon() {
    this.isGameOver = true;

    // Bonus pour avoir terminé avec des vies restantes
    const livesBonus = this.lives * 20;
    this.score += livesBonus;

    // Mettre à jour le score final
    try {
      InfoBar.update({ score: this.score }, 'multimemory');
    } catch {
      // Erreur ignorée (non-critique)
    }

    // Montrer un message de victoire
    showArcadeMessage('arcade.multiMemory.win', '#4CAF50', 2000);

    // Animer la victoire
    this.animateVictory();

    // Attendre un peu avant d'afficher l'écran de fin
    const timer = setTimeout(() => {
      this.cleanup();
      showArcadeGameOver(this.score);
    }, 2000);

    this.timers.push(timer);
  }

  // Le joueur a perdu toutes ses vies
  gameLost() {
    // Elle est conservée pour référence ou utilisation future

    this.isGameOver = true;

    // Attendre un peu avant d'afficher l'écran de fin
    const timer = setTimeout(() => {
      this.cleanup();
      showArcadeGameOver(this.score);
    }, 1500);

    this.timers.push(timer);
  }

  // Anime la victoire avec un effet spécial
  animateVictory() {
    // Chaque carte fait un petit effet de zoom puis disparaît
    for (const card of this.cards) {
      if (card.isMatched) {
        card.victoryScale = 1.0;
        card.victoryOpacity = 1.0;
      }
    }

    const animate = () => {
      this.draw();
      let stillAnimating = false;

      for (const card of this.cards) {
        if (card.isMatched && card.victoryScale > 0) {
          card.victoryScale += 0.05;
          card.victoryOpacity -= 0.05;

          if (card.victoryOpacity > 0) {
            stillAnimating = true;
          }
        }
      }

      if (stillAnimating) {
        const animId = requestAnimationFrame(animate);
        this.animations.push(animId);
      }
    };

    const animId = requestAnimationFrame(animate);
    this.animations.push(animId);
  }

  // Dessine le jeu
  draw() {
    // Effacer le canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Dessiner l'arrière-plan
    this.drawBackground();

    // Dessiner les cartes
    for (const card of this.cards) {
      this.drawCard(card);
    }
  }

  // Dessine l'arrière-plan du jeu
  drawBackground() {
    // Dégradé de fond simple
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#4A148C');
    gradient.addColorStop(1, '#7B1FA2');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Dessine une carte
  drawCard(card) {
    const dims = this.getCardVisualState(card);
    const { cardX, cardY, cardWidth, cardHeight, opacity } = dims;

    this.ctx.save();
    this.ctx.globalAlpha = opacity;

    // Effet d'ombre pour toutes les cartes
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    this.ctx.shadowBlur = 5;
    this.ctx.shadowOffsetX = 2;
    this.ctx.shadowOffsetY = 2;

    // Forme arrondie
    this.pathRoundedRect(cardX, cardY, cardWidth, cardHeight, 10);

    // Effet de hover
    const isHovered = this.getCardAtPosition(this.lastMousePos.x, this.lastMousePos.y) === card;

    // Couleur de fond selon l'état de la carte
    this.setCardFillByState(card, isHovered);
    this.ctx.fill();

    // Dessiner le contenu de la carte
    if (card.isFlipped || card.isMatched) {
      this.drawCardFront(card, cardX, cardY, cardWidth, cardHeight);
    } else {
      this.drawCardBack(card, cardX, cardY, cardWidth, cardHeight);
    }

    // Restaurer le contexte
    this.ctx.restore();
  }

  // Helpers pour alléger drawCard
  getCardVisualState(card) {
    const { x, y, width, height } = card;
    let cardX = x,
      cardY = y,
      cardWidth = width,
      cardHeight = height,
      opacity = 1.0;
    if (card.isMatched && card.victoryScale) {
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      cardWidth = width * card.victoryScale;
      cardHeight = height * card.victoryScale;
      cardX = centerX - cardWidth / 2;
      cardY = centerY - cardHeight / 2;
      opacity = card.victoryOpacity;
    }
    return { cardX, cardY, cardWidth, cardHeight, opacity };
  }

  pathRoundedRect(x, y, w, h, r = 10) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + r, y);
    this.ctx.lineTo(x + w - r, y);
    this.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    this.ctx.lineTo(x + w, y + h - r);
    this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.ctx.lineTo(x + r, y + h);
    this.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    this.ctx.lineTo(x, y + r);
    this.ctx.quadraticCurveTo(x, y, x + r, y);
    this.ctx.closePath();
  }

  setCardFillByState(card, isHovered) {
    if (card.isMatched) {
      this.ctx.fillStyle = '#4CAF50';
    } else if (card.isFlipped) {
      this.ctx.fillStyle = '#7986CB';
    } else if (isHovered) {
      this.ctx.fillStyle = '#FF9800';
    } else {
      this.ctx.fillStyle = '#3F51B5';
    }
  }

  drawCardFront(card, cardX, cardY, cardWidth, cardHeight) {
    this.ctx.fillStyle = '#FFFFFF';
    let fontSize = Math.floor(card.type === 'multiplication' ? cardHeight / 3 : cardHeight / 2.5);
    this.ctx.font = `bold ${fontSize}px Arial`;
    while (this.ctx.measureText(card.content).width > cardWidth * 0.8 && fontSize > 10) {
      fontSize--;
      this.ctx.font = `bold ${fontSize}px Arial`;
    }
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(card.content, cardX + cardWidth / 2, cardY + cardHeight / 2);
  }

  drawCardBack(card, cardX, cardY, cardWidth, cardHeight) {
    if (
      card.monsterIndex >= 0 &&
      card.monsterIndex < this.monsterImages.length &&
      this.monsterImages[card.monsterIndex].complete
    ) {
      if (this.cardBack.complete) {
        this.ctx.drawImage(this.cardBack, cardX, cardY, cardWidth, cardHeight);
      }
      const monsterSize = Math.min(cardWidth, cardHeight) * 0.8;
      const monsterX = cardX + (cardWidth - monsterSize) / 2;
      const monsterY = cardY + (cardHeight - monsterSize) / 2;

      this.ctx.drawImage(
        this.monsterImages[card.monsterIndex],
        monsterX,
        monsterY,
        monsterSize,
        monsterSize
      );
    } else {
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.font = `${Math.floor(cardHeight / 5)}px Arial`;
      this.ctx.fillText('?', cardX + cardWidth / 2, cardY + cardHeight / 2);
    }
  }

  // Boucle principale du jeu
  gameLoop() {
    if (!this.isGameOver && isArcadeActive()) {
      this.draw();
      this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
      this.animations.push(this.gameLoopId);
    }
  }

  // Nettoie les ressources du jeu
  stopGameLoop() {
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
      this.gameLoopId = null;
    }
  }

  clearTimersAndAnimations() {
    if (this.timers && this.timers.length) {
      for (const timer of this.timers) {
        clearTimeout(timer);
      }
      this.timers = [];
    }

    if (this.animations && this.animations.length) {
      for (const animId of this.animations) {
        cancelAnimationFrame(animId);
      }
      this.animations = [];
    }
  }

  removeEventListeners() {
    if (this.canvas) {
      this.canvas.removeEventListener('click', this.boundHandleClick);
      this.canvas.removeEventListener('touchstart', this.boundHandleTouchStart);
      this.canvas.removeEventListener('touchend', this.boundHandleTouchEnd);

      if (!this.isMobile && this.boundHandleMouseMove) {
        this.canvas.removeEventListener('mousemove', this.boundHandleMouseMove);
      }
    }

    if (this.boundResizeCanvas) {
      const globalObject =
        typeof globalThis !== 'undefined'
          ? globalThis
          : typeof window !== 'undefined'
            ? window
            : undefined;
      globalObject?.removeEventListener?.('resize', this.boundResizeCanvas);
      this.boundResizeCanvas = null;
    }
  }

  stopAudioResources() {
    const stopSound = sound => {
      if (sound) {
        sound.pause();
        sound.currentTime = 0;
        sound.src = '';
        return null;
      }
      return sound;
    };

    this.successSound = stopSound(this.successSound);
    this.failureSound = stopSound(this.failureSound);
  }

  releaseImageResources() {
    if (this.cardBack) {
      this.cardBack.src = '';
      this.cardBack.onload = null;
      this.cardBack = null;
    }

    if (this.monsterImages && this.monsterImages.length) {
      this.monsterImages = null;
    }
  }

  clearGameData() {
    if (this.ctx) {
      this.ctx = null;
    }
    this.cards = [];
    this.flippedCards = [];
  }

  cleanup() {
    this.isGameOver = true;
    this.stopGameLoop();
    this.clearTimersAndAnimations();
    this.removeEventListeners();
    this.stopAudioResources();
    this.releaseImageResources();
    this.clearGameData();
  }
}

// Export global pour compatibilité
// ESM export uniquement (plus de bridge global)
