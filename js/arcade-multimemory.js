/* =====================
   Arcade Memory Launcher (MultiMemory)
   - Contient la fonction startMemoryArcade pour lancer le jeu MultiMemory
   - Dépend de InfoBar.createArcadeTemplateElement (components/infoBar.js) et des fonctions communes
   ===================== */

import { generateQuestion } from './questionGenerator.js';
import { goToSlide } from './slides.js';
import { gameState } from './game.js';
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
import { noteArcadePlay } from './arcade-session.js';
import { AudioManager } from './core/audio.js';
import {
  showGameInstructions,
  getCanvasFont,
  prepareArcadeStage,
  getArcadeCanvasBox,
  clientToCanvasPoint,
  watchArcadeViewport,
} from './arcade-common.js';
import { getDifficultySettings } from './difficulty.js';
import { TablePreferences } from './core/tablePreferences.js';
import { UserManager } from './userManager.js';
import { UserState } from './core/userState.js';
import { randomInt, shuffleInPlace } from './core/random.js';
import { isArcadePaused, isNoTimeLimit } from './arcade-time.js';
// Dépend des helpers ESM (plus d'assignations window.*)

const FULL_TABLE_SET = Array.from({ length: 10 }, (_, i) => i + 1);

// Clavier : la carte visée se déplace aux flèches ([colonnes, lignes]), se retourne à
// Entrée ou à Espace
const CURSOR_STEPS = new Map([
  ['ArrowLeft', [-1, 0]],
  ['ArrowRight', [1, 0]],
  ['ArrowUp', [0, -1]],
  ['ArrowDown', [0, 1]],
]);
const FLIP_KEYS = new Set(['Enter', ' ']);
// Son d'une paire ratée, adouci comme l'erreur du Chrono (BAD_SOUND_VOLUME de ChronoMode.js)
const ERROR_SOUND_VOLUME = 0.35;
const KEYBOARD_HELP_KEY = 'arcade.controls.multimemory.keyboard';
// Cadre de la carte visée au clavier : un trait sombre sous un trait blanc, visible sur le
// fond violet comme sur les cartes bleues ou vertes
const CURSOR_RING = { gap: 3, outer: 7, inner: 4, dark: '#1A1A2E', light: '#FFFFFF' };

/**
 * Texte réservé aux lecteurs d'écran, posé dans la zone de jeu
 * @param {HTMLElement} parent
 * @param {string} tag
 * @param {string} text
 * @returns {HTMLElement}
 */
function createHiddenText(parent, tag, text) {
  const element = document.createElement(tag);
  element.className = 'sr-only';
  element.textContent = text;
  parent?.appendChild(element);
  return element;
}

/**
 * Ce que le lecteur d'écran dit d'une carte visée au clavier : sa place dans la grille,
 * puis ce qu'elle montre si elle est retournée ou déjà trouvée
 * @param {{content: string, isFlipped: boolean, isMatched: boolean}} card
 * @param {number} index - Rang de la carte dans la grille
 * @param {number} cols - Colonnes de la grille
 * @returns {string}
 */
export function describeCard(card, index, cols) {
  const params = { row: Math.floor(index / cols) + 1, col: (index % cols) + 1 };
  if (card.isMatched) {
    return getTranslation('arcade.multiMemory.cardFound', { ...params, content: card.content });
  }
  if (card.isFlipped) {
    return getTranslation('arcade.multiMemory.cardShown', { ...params, content: card.content });
  }
  return getTranslation('arcade.multiMemory.cardHidden', params);
}

const sanitizeTableList = list =>
  Array.isArray(list)
    ? list.map(Number).filter(table => Number.isInteger(table) && table >= 1 && table <= 10)
    : [];

const sanitizeExclusions = exclusions =>
  Array.isArray(exclusions)
    ? Array.from(
        new Set(
          exclusions
            .map(Number)
            .filter(table => Number.isInteger(table) && table >= 1 && table <= 10)
        )
      )
    : [];

export function resolveMultimemoryTables(baseTables, exclusions) {
  const normalizedBase = sanitizeTableList(baseTables);
  const normalizedExclusions = sanitizeExclusions(exclusions);

  const basePool = normalizedBase.length > 0 ? normalizedBase : FULL_TABLE_SET;
  const filteredBase = basePool.filter(table => !normalizedExclusions.includes(table));
  if (filteredBase.length > 0) return filteredBase;

  const fallbackPool = FULL_TABLE_SET.filter(table => !normalizedExclusions.includes(table));
  if (fallbackPool.length > 0) return fallbackPool;

  // Cas extrême: exclusions couvrent tout; on retourne la base pour éviter un tableau vide
  return basePool;
}

// Proportions d'une carte (largeur / hauteur) : ni bande étroite, ni ruban
const CARD_RATIO_MIN = 0.75;
const CARD_RATIO_MAX = 4 / 3;
// Colonnes essayées sur téléphone : toutes celles qui ne laissent pas de trou
const MAX_MEMORY_COLUMNS = 8;

/**
 * Taille d'une carte dans une grille donnée : la place se partage entre les cartes et leurs
 * écarts, puis la carte garde des proportions de carte.
 * @param {number} cols
 * @param {number} rows
 * @param {{width: number, height: number}} box - Place du plateau (pixels)
 * @param {number} margin - Écart entre les cartes et autour d'elles
 * @returns {{width: number, height: number}}
 */
export function memoryCardSize(cols, rows, box, margin) {
  let width = (box.width - margin * (cols + 1)) / cols;
  let height = (box.height - margin * (rows + 1)) / rows;
  width = Math.min(width, height * CARD_RATIO_MAX);
  height = Math.min(height, width / CARD_RATIO_MIN);
  return { width: Math.max(1, Math.floor(width)), height: Math.max(1, Math.floor(height)) };
}

/**
 * Disposition des cartes qui donne les plus grandes cartes dans la place disponible
 * (3 × 4 pour 12 cartes sur un téléphone en portrait, 6 × 2 sur un plateau bas et large).
 * @param {number} count - Nombre de cartes
 * @param {{width: number, height: number}} box
 * @param {number} margin
 * @param {number[]} [columns] - Colonnes permises (par défaut : toutes, sans trou)
 * @returns {{cols: number, rows: number}}
 */
export function chooseMemoryGrid(count, box, margin, columns) {
  const candidates =
    columns ??
    Array.from({ length: MAX_MEMORY_COLUMNS - 1 }, (_, i) => i + 2).filter(c => count % c === 0);
  let best = null;
  for (const cols of candidates) {
    const rows = Math.ceil(count / cols);
    const card = memoryCardSize(cols, rows, box, margin);
    const area = card.width * card.height;
    if (!best || area > best.area) best = { cols, rows, area };
  }
  return best ? { cols: best.cols, rows: best.rows } : { cols: 4, rows: Math.ceil(count / 4) };
}

/**
 * Un calcul pour une paire : les tables du niveau en ×, ses nombres (facile, moyen,
 * difficile) en +, − et ÷
 * @param {{operator: string, level: string, tables: number[], excludedTables: number[]}} settings
 *   level : niveau de l'Arcade (debutant, moyen, difficile)
 * @returns {{num1: number, num2: number, operator: string, result: number}}
 */
export function drawMemoryCalculation({ operator, level, tables, excludedTables }) {
  const isMultiplication = operator === '×';
  const question = generateQuestion({
    type: 'classic',
    operator, // Support +, −, ×, ÷
    difficulty: getDifficultySettings(level).questionDifficulty,
    tables: isMultiplication ? tables : undefined,
    excludeTables: isMultiplication ? excludedTables : [],
    minNum: 1,
    maxNum: 10,
  });
  return { num1: question.a, num2: question.b, operator, result: question.answer };
}

/** Opérations où l'ordre des nombres ne change rien : 3 × 4 et 4 × 3 sont le même calcul */
const COMMUTATIVE_OPERATORS = new Set(['×', '+']);
/** Tirages permis par paire : chaque niveau offre au moins 10 calculs, pour 8 paires au plus */
const DRAWS_PER_PAIR = 100;

/**
 * Clé d'un calcul : deux paires de même clé poseraient le même calcul (dans un sens ou dans
 * l'autre, pour × et +)
 * @param {{num1: number, num2: number, operator: string}} calculation
 * @returns {string}
 */
export function calculationKey({ num1, num2, operator }) {
  const swap = COMMUTATIVE_OPERATORS.has(operator) && num1 > num2;
  const [first, second] = swap ? [num2, num1] : [num1, num2];
  return `${first} ${operator} ${second}`;
}

/**
 * Calculs d'un plateau : jamais deux fois le même (ni 3 × 4 avec 4 × 3)
 * @param {number} pairs - Nombre de paires voulu
 * @param {Object} settings - Voir drawMemoryCalculation
 * @returns {Array<{num1: number, num2: number, operator: string, result: number}>}
 */
export function drawMemoryCalculations(pairs, settings) {
  const chosen = new Map();
  for (let draw = 0; chosen.size < pairs && draw < pairs * DRAWS_PER_PAIR; draw++) {
    const calculation = drawMemoryCalculation(settings);
    const key = calculationKey(calculation);
    if (!chosen.has(key)) chosen.set(key, calculation);
  }
  return [...chosen.values()];
}

/**
 * Une carte, face cachée : le calcul (« 7 × 8 ») ou son résultat (« 56 »)
 * @param {{num1: number, num2: number, operator: string, result: number}} calculation
 * @param {number} pairId
 * @param {'operation'|'result'} type
 * @param {number} monsterIndex - Monstre dessiné au dos
 * @returns {Object}
 */
function createMemoryCard(calculation, pairId, type, monsterIndex) {
  const { num1, num2, operator, result } = calculation;
  return {
    id: pairId * 2 + (type === 'result' ? 1 : 0),
    type,
    content: type === 'operation' ? `${num1} ${operator} ${num2}` : `${result}`,
    num1,
    num2,
    operator,
    result,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    isFlipped: false,
    isMatched: false,
    monsterIndex,
    pairId,
  };
}

/**
 * Écart entre un point et une carte (0 dedans), sur l'axe le plus éloigné.
 * @param {{x: number, y: number, width: number, height: number}} card
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
function distanceToCard(card, x, y) {
  const dx = Math.max(card.x - x, 0, x - (card.x + card.width));
  const dy = Math.max(card.y - y, 0, y - (card.y + card.height));
  return Math.max(dx, dy);
}

/**
 * Carte visée par un toucher ou un clic. La carte touchée l'emporte toujours ; dans un
 * écart ou juste à côté de la grille, la plus proche, si elle est dans la tolérance.
 * La tolérance dépasse l'écart entre les cartes sur téléphone : prendre la première carte
 * dont la zone élargie contient le point retournait la voisine de gauche ou du dessus.
 * @param {Array<{x: number, y: number, width: number, height: number, isMatched?: boolean}>} cards
 * @param {number} x - Point visé (pixels du plateau)
 * @param {number} y
 * @param {number} tolerance - Distance admise autour d'une carte (pixels du plateau)
 * @returns {object|null} La carte, ou null (rien de proche, ou carte déjà trouvée)
 */
export function findCardAt(cards, x, y, tolerance) {
  let nearest = null;
  let nearestDistance = Infinity;
  for (const card of cards) {
    const distance = distanceToCard(card, x, y);
    if (distance < nearestDistance) {
      nearest = card;
      nearestDistance = distance;
    }
  }
  if (!nearest || nearestDistance > tolerance || nearest.isMatched) return null;
  return nearest;
}

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
  void goToSlide(4);
  // arcadeActive basculé au démarrage du timer (startArcadeTimer)

  // Récupérer l'opérateur sélectionné (support multi-opérations R4.3)
  const userData = UserState.getCurrentUserData();
  const operator = userData.preferredOperator || '×';

  console.log('MultiMemory lancé avec opérateur:', operator);

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
  // Haut de page, zone de jeu sans hauteur imposée, consigne sous le plateau :
  // les cartes se dimensionnent ensuite pour que l'ensemble tienne dans l'écran
  const memoryCanvas = document.getElementById('multimemory-canvas');
  prepareArcadeStage(memoryCanvas);
  showGameInstructions(memoryCanvas, getMemoryInstructions());

  // Utilisation des paramètres de difficulté (Cascade 2025)
  const difficultySettings = getDifficultySettings(gameState.difficulty || 'moyen');

  const currentUser =
    typeof UserManager.getCurrentUser === 'function' ? UserManager.getCurrentUser() : null;
  const globalExclusions = TablePreferences.getActiveExclusions(currentUser);
  const tablesForGame = resolveMultimemoryTables(difficultySettings.tables, globalExclusions);
  // Durée de la partie selon le niveau, ou sans limite si le joueur l'a choisi
  startArcadeTimer(memoryDuration(difficultySettings));

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
    tables: tablesForGame,
    excludedTables: globalExclusions,
    lives: difficultySettings.lives || 3,
    pairs: difficultySettings.pairs,
    operator, // R4.3: Support multi-opérations (+, −, ×, ÷)
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

/**
 * Durée d'une partie : celle du niveau, ou sans limite (Infinity) si le joueur l'a choisi
 * dans la tuile du jeu
 * @param {{timeSeconds: number}} difficultySettings
 * @returns {number}
 */
function memoryDuration(difficultySettings) {
  return isNoTimeLimit('multimemory') ? Infinity : difficultySettings.timeSeconds;
}

// Consigne du jeu, selon l'appareil (doigt ou souris)
function getMemoryInstructions() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    globalThis.navigator?.userAgent || ''
  );
  if (isMobile) {
    return (
      getTranslation('arcade.multiMemory.controls.mobile') ||
      'Touche les cartes pour les retourner et trouver les paires\u00a0!'
    );
  }
  return (
    getTranslation('arcade.multiMemory.controls.desktop') ||
    'Clique sur les cartes pour les retourner et trouver les paires\u00a0!'
  );
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
    this.operator = options.operator || '×'; // R4.3: Support multi-opérations
    const sanitizedTables = sanitizeTableList(options.tables);
    this.tables = sanitizedTables.length > 0 ? [...new Set(sanitizedTables)] : FULL_TABLE_SET;
    this.excludedTables = sanitizeExclusions(options.excludedTables);

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

    // Chargement des monstres via ESM (plus de dépendance à window.monsterSprites)
    this.monsterImages = monsterSprites;

    // Écart entre les cartes ; la disposition (colonnes, rangées) se choisit au lancement
    this.margin = this.isMobile ? 6 : 10;
    this.cols = 0;
    this.rows = 0;

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

  // Mélange en place (Fisher-Yates)
  shuffleArray(array) {
    return shuffleInPlace(array);
  }

  // Disposition des cartes, choisie au lancement pour la place qui restera une fois la
  // consigne partie : sur téléphone, celle qui donne les plus grandes cartes (3 × 4 en
  // portrait) ; sur ordinateur, les 4 colonnes habituelles. Elle ne change plus ensuite :
  // chaque carte garde sa place, que l'enfant mémorise.
  layoutBoard() {
    const box = getArcadeCanvasBox(this.canvas, { ignoreInstructions: true });
    const columns = this.isMobile ? undefined : [4];
    ({ cols: this.cols, rows: this.rows } = chooseMemoryGrid(
      this.cards.length,
      box,
      this.margin,
      columns
    ));
  }

  // Taille des cartes pour la place actuelle (sous le bandeau, avec la consigne et
  // « Abandonner ») : à chaque changement d'écran, les cartes suivent sans changer de place
  resizeCanvas() {
    // Canevas retiré (fin de partie) ou disposition pas encore choisie : rien à dessiner
    if (!this.canvas?.isConnected || !this.cols) return;

    const card = memoryCardSize(this.cols, this.rows, getArcadeCanvasBox(this.canvas), this.margin);
    this.canvas.width = this.cols * card.width + this.margin * (this.cols + 1);
    this.canvas.height = this.rows * card.height + this.margin * (this.rows + 1);
    this.canvas.style.width = `${this.canvas.width}px`;
    this.canvas.style.height = `${this.canvas.height}px`;

    this.calculateCardDimensions();
    this.positionCards();
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
        // Coordonnées écran -> cartes (cadre du canevas et réduction éventuelle compris)
        const { x, y } = clientToCanvasPoint(self.canvas, touch.clientX, touch.clientY);

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
      self.lastMousePos = clientToCanvasPoint(self.canvas, e.clientX, e.clientY);

      // Redessiner seulement si nous sommes en hover sur une carte (desktop uniquement)
      if (!self.isMobile && self.getCardAtPosition(self.lastMousePos.x, self.lastMousePos.y)) {
        self.draw();
      }
    };

    // Seulement sur desktop
    if (!this.isMobile) {
      this.canvas.addEventListener('mousemove', this.boundHandleMouseMove);
    }

    // L'écran change (consigne partie, rotation, plein écran) : les cartes suivent ; tant
    // qu'aucune carte n'a été vue, leur disposition aussi
    this._stopWatchingViewport = watchArcadeViewport(this.canvas, () => {
      if (!this.cardsSeen) this.layoutBoard();
      this.resizeCanvas();
    });
  }

  // Clavier : flèches pour choisir une carte, Entrée ou Espace pour la retourner. Ce que la
  // carte montre est annoncé aux lecteurs d'écran (région role="status", pas la voix du jeu)
  setupKeyboard() {
    this.cursorIndex = 0;
    this.keyboardCursor = false;
    const stage = this.canvas.parentElement;
    this.liveRegion = createHiddenText(stage, 'p', '');
    this.liveRegion.classList.add('multimemory-announcer');
    this.liveRegion.setAttribute('role', 'status');
    const help = createHiddenText(stage, 'span', getTranslation(KEYBOARD_HELP_KEY));
    help.id = `${this.canvasId}-keyboard-help`;
    help.dataset.translate = KEYBOARD_HELP_KEY;
    this.canvas.setAttribute('aria-describedby', help.id);
    this.boundHandleKeyDown = e => this.handleKeyDown(e);
    this.canvas.addEventListener('keydown', this.boundHandleKeyDown);
  }

  // Touches du plateau (le canevas a le focus)
  handleKeyDown(e) {
    const step = CURSOR_STEPS.get(e.key);
    if (step) {
      e.preventDefault();
      this.moveCursor(step);
    } else if (FLIP_KEYS.has(e.key)) {
      e.preventDefault();
      this.keyboardCursor = true;
      this.flipCardAtCursor();
    }
  }

  // Déplace la carte visée dans la grille, sans en sortir
  moveCursor([dx, dy]) {
    this.keyboardCursor = true;
    const cols = this.cols || 4;
    const col = (this.cursorIndex % cols) + dx;
    const row = Math.floor(this.cursorIndex / cols) + dy;
    const next = row * cols + col;
    if (col >= 0 && col < cols && row >= 0 && next < this.cards.length) this.cursorIndex = next;
    this.announceCursor();
    this.draw();
  }

  // Retourne la carte visée ; déjà visible, elle est annoncée de nouveau
  flipCardAtCursor() {
    const card = this.cards.at(this.cursorIndex);
    if (card && !this.flipCard(card)) this.announceCursor();
  }

  // Annonce la carte visée : sa place, puis ce qu'elle montre si elle est visible
  announceCursor() {
    const card = this.cards.at(this.cursorIndex);
    if (card) this.announce(describeCard(card, this.cursorIndex, this.cols || 4));
  }

  // Message lu par les lecteurs d'écran
  announce(text) {
    if (this.liveRegion) this.liveRegion.textContent = text;
  }

  // Le plateau prend le focus : le clavier joue tout de suite, sans faire défiler la page
  focusBoard() {
    try {
      this.canvas.focus({ preventScroll: true });
    } catch {
      // Focus impossible : la souris et le doigt jouent toujours
    }
  }

  // Initialise le jeu
  start() {
    this.createCards();
    this.layoutBoard();
    this.shuffleCards();
    this.resizeCanvas();
    this.setupKeyboard();
    this.draw();
    this.focusBoard();

    // Démarrer la boucle de jeu (la consigne est déjà affichée par le lanceur)
    this.gameLoop();
  }

  // Crée les cartes pour le jeu : une carte calcul et une carte résultat par paire
  createCards() {
    // Forcer la réinitialisation du nombre de paires selon la difficulté actuelle
    // Cette ligne est ajoutée pour s'assurer que le bon nombre de paires est utilisé à chaque fois
    this.pairs = this.getPairsCount();

    // Des calculs tous différents (R4.3 : +, −, ×, ÷)
    const calculations = drawMemoryCalculations(this.pairs, {
      operator: this.operator,
      level: this.difficulty,
      tables: this.tables,
      excludedTables: this.excludedTables,
    });
    // La partie se gagne en trouvant toutes les paires posées
    this.pairs = calculations.length;

    const monsterIndices = this.pickMonsterIndices(this.pairs * 2);
    this.cards = calculations.flatMap((calculation, pairId) => [
      createMemoryCard(calculation, pairId, 'operation', monsterIndices.pop()),
      createMemoryCard(calculation, pairId, 'result', monsterIndices.pop()),
    ]);
  }

  // Dos des cartes : des monstres tous différents, tant qu'il y en a assez
  pickMonsterIndices(count) {
    const monsterCount = this.monsterImages.length;
    const indices = this.shuffleArray(Array.from({ length: monsterCount }, (_, i) => i));
    while (indices.length < count) indices.push(randomInt(0, monsterCount - 1));
    return indices.slice(0, count);
  }

  // Fonction utilitaire pour compter les éléments uniques dans un tableau
  countUnique(array) {
    return new Set(array).size;
  }

  // Calcule les dimensions des cartes dans la disposition choisie (layoutBoard)
  calculateCardDimensions() {
    const availableWidth = this.canvas.width - this.margin * (this.cols + 1);
    const availableHeight = this.canvas.height - this.margin * (this.rows + 1);
    this.cardWidth = availableWidth / this.cols;
    this.cardHeight = availableHeight / this.rows;
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

  // Mélange les cartes : leur ordre donne leur place dans la grille (positionCards)
  shuffleCards() {
    this.shuffleArray(this.cards);
    if (this.cardWidth) this.positionCards();
  }

  // Gère le clic sur une carte
  handleCardClick(e) {
    if (this.isGameOver || this.isProcessingMatch) return;

    // Pour les événements tactiles, utiliser directement les coordonnées fournies ; pour les
    // clics de souris, convertir en coordonnées du plateau
    const { x, y } =
      e.type === 'touchend'
        ? { x: e.clientX, y: e.clientY }
        : clientToCanvasPoint(this.canvas, e.clientX, e.clientY);
    this.flipCardAt(x, y);
  }

  // Implémentation directe pour le tactile sur mobile
  handleDirectTouch(touchX, touchY) {
    if (this.isGameOver || this.isProcessingMatch) return false;
    return this.flipCardAt(touchX, touchY);
  }

  // Retourne la carte touchée ou cliquée ; le clavier reprendra depuis elle
  flipCardAt(x, y) {
    const card = this.getCardAtPosition(x, y);
    if (card) this.cursorIndex = this.cards.indexOf(card);
    return this.flipCard(card);
  }

  // Retourne une carte (souris, doigt ou clavier) ; faux si elle ne peut pas l'être
  flipCard(card) {
    // En pause, le plateau est caché et rien ne se retourne
    if (this.isGameOver || this.isProcessingMatch || isArcadePaused()) return false;
    if (!card || card.isFlipped || card.isMatched) return false;
    card.isFlipped = true;
    this.flippedCards.push(card);
    this.announce(card.content);

    // Vérifier si deux cartes sont retournées
    if (this.flippedCards.length === 2) {
      this.isProcessingMatch = true;
      this.checkForMatch();
    }

    // Redessiner immédiatement
    this.draw();
    return true;
  }

  // Récupère la carte à la position donnée avec une zone de tolérance pour le tactile
  getCardAtPosition(x, y) {
    // Ajouter une tolérance pour faciliter la détection sur mobile (en pixels)
    const tolerance = this.isMobile ? 25 : 5; // Tolérance plus grande sur mobile
    return findCardAt(this.cards, x, y, tolerance);
  }

  // Vérifie si les cartes retournées forment une paire
  checkForMatch() {
    const [card1, card2] = this.flippedCards;
    // Deux cartes retournées : la partie est jouée (tableau de bord)
    noteArcadePlay();

    // Attendre un peu pour montrer les deux cartes
    const timer = setTimeout(() => this.resolvePair(card1, card2), 1000);
    this.timers.push(timer);
  }

  // Une paire : le même résultat, sur une carte calcul et une carte résultat
  resolvePair(card1, card2) {
    if (card1.result === card2.result && card1.type !== card2.type) {
      this.onPairFound(card1, card2);
    } else {
      this.onPairMissed(card1, card2);
    }

    // Réinitialiser pour le prochain tour
    this.flippedCards = [];
    this.isProcessingMatch = false;
    this.draw();
  }

  // C'est une paire !
  onPairFound(card1, card2) {
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

    // Sons du gestionnaire audio : ils suivent le volume choisi dans le jeu
    AudioManager.playSound('good');
    // Afficher un message de félicitations
    showArcadeMessage('arcade.multiMemory.match', 'success', 1000);
    this.announce(getTranslation('arcade.multiMemory.match'));

    // Vérifier si toutes les paires ont été trouvées
    if (this.matchedPairs === this.pairs) {
      this.gameWon();
    }
  }

  // Pas une paire, retourner les cartes
  onPairMissed(card1, card2) {
    card1.isFlipped = false;
    card2.isFlipped = false;

    AudioManager.playSound('bad', { volume: ERROR_SOUND_VOLUME });
    // Pas une paire : une étape, pas une sanction (ton neutre, le texte encourage)
    showArcadeMessage('arcade.multiMemory.mismatch', 'neutral', 1000);
    this.announce(getTranslation('arcade.multiMemory.mismatch'));
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
    showArcadeMessage('arcade.multiMemory.win', 'success', 2000);

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

    this.drawKeyboardCursor();
  }

  // La carte visée est-elle à montrer ? Plateau au clavier : focus venu du clavier, ou une
  // touche du plateau déjà employée (jamais pour la souris ni le doigt)
  isKeyboardCursorVisible() {
    if (this.isGameOver || !this.canvas || document.activeElement !== this.canvas) return false;
    if (this.keyboardCursor) return true;
    try {
      return this.canvas.matches(':focus-visible');
    } catch {
      return false;
    }
  }

  // Cadre autour de la carte visée au clavier
  drawKeyboardCursor() {
    const card = this.cards.at(this.cursorIndex ?? 0);
    if (!card || !this.isKeyboardCursorVisible()) return;
    const { gap, outer, inner, dark, light } = CURSOR_RING;
    this.ctx.save();
    this.pathRoundedRect(
      card.x - gap,
      card.y - gap,
      card.width + 2 * gap,
      card.height + 2 * gap,
      12
    );
    this.ctx.lineWidth = outer;
    this.ctx.strokeStyle = dark;
    this.ctx.stroke();
    this.ctx.lineWidth = inner;
    this.ctx.strokeStyle = light;
    this.ctx.stroke();
    this.ctx.restore();
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
    // Une carte montrée : sa place compte désormais pour l'enfant, la disposition est fixée
    this.cardsSeen = true;
    this.ctx.fillStyle = '#FFFFFF';
    let fontSize = Math.floor(card.type === 'operation' ? cardHeight / 3 : cardHeight / 2.5);
    this.ctx.font = getCanvasFont(fontSize);
    while (this.ctx.measureText(card.content).width > cardWidth * 0.8 && fontSize > 10) {
      fontSize--;
      this.ctx.font = getCanvasFont(fontSize);
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
      this.ctx.font = getCanvasFont(cardHeight / 5);
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
      this.canvas.removeEventListener('keydown', this.boundHandleKeyDown);

      if (!this.isMobile && this.boundHandleMouseMove) {
        this.canvas.removeEventListener('mousemove', this.boundHandleMouseMove);
      }
    }

    if (this._stopWatchingViewport) this._stopWatchingViewport();
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
    this.releaseImageResources();
    this.clearGameData();
  }
}

// ESM export uniquement (plus de bridge global) ; la classe sert aussi aux tests
export { MemoryGame };
