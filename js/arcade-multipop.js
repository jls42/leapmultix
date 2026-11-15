/**
 * MultiPop : le calcul est au bandeau ; des monstres surgissent des neuf terriers, chacun avec
 * un nombre sur sa pancarte. Taper celui qui porte la bonne réponse : 100 points, le calcul
 * complet au bandeau le temps de le lire, puis le calcul suivant. Un mauvais : jusqu'à
 * 50 points de moins, il redescend ; aucune vie perdue, seul le temps compte. Personne de
 * tapé à temps : d'autres monstres sortent pour le même calcul. Parfois un ami (un autre héros
 * du jeu, un cœur sur sa pancarte) sort avec eux : le taper coûte aussi jusqu'à 50 points.
 *
 * Souris, doigt ou clavier (flèches : monstre levé suivant ou précédent ; Entrée ou Espace :
 * le taper ; le clavier ne vise jamais l'ami). Le nombre du monstre visé est annoncé aux
 * lecteurs d'écran.
 */
import { goToSlide } from './slides.js';
import { gameState } from './game.js';
import { getTranslation, showArcadePoints } from './utils-es6.js';
import { showArcadePenalty } from './arcade-points.js';
import { setStartingMode } from './mode-orchestrator.js';
import { InfoBar } from './components/infoBar.js';
import { startArcadeTimer, showArcadeGameOver, stopArcadeMode, isArcadeActive } from './arcade.js';
import { eventBus } from './core/eventBus.js';
import { noteArcadePlay } from './arcade-session.js';
import { recordArcadeAnswer, SOLVED_PAUSE_MS, showSolvedQuestion } from './arcade-learning.js';
import { drawArcadeQuestion, arcadeAnswers } from './arcade-answers.js';
import { isArcadePaused } from './arcade-time.js';
import { spriteFor, prefetchArcadeSprite } from './arcade-sprites.js';
import { monsterSpec, avatarSpec, textureSpec, MONSTER_COUNT } from './arcade-sprite-catalog.js';
import { normalizeAvatarId } from './avatar-heads.js';
import { pickRandom, shuffleInPlace } from './core/random.js';
import {
  showGameInstructions,
  INSTRUCTIONS_MS,
  prepareArcadeStage,
  getArcadeCanvasBox,
  clientToCanvasPoint,
  watchArcadeViewport,
  sizeArcadeCanvas,
  isTouchFirstDevice,
} from './arcade-common.js';
import { getDifficultySettings } from './difficulty.js';
import { TablePreferences } from './core/tablePreferences.js';
import { UserManager } from './userManager.js';
import { UserState } from './core/userState.js';
import { MonsterField, monsterRhythm, GAP_MS } from './multipop-engine.js';
import { popLayout, cellRect, cellParts, holeAt, drawPopBoard } from './multipop-renderer.js';

/** Points d'une bonne réponse */
export const CORRECT_POINTS = 100;
/** Points retirés au plus pour une mauvaise (jamais plus que le score) */
export const MISS_PENALTY = 50;
/** Points retirés au plus pour un ami tapé (jamais plus que le score) */
export const FRIEND_PENALTY = 50;
/** Chance qu'un ami sorte avec les monstres d'une sortie */
export const FRIEND_CHANCE = 1 / 3;
// Monstres d'une partie, tirés parmi tous ceux du jeu et chargés d'avance
const CAST_SIZE = 12;
// Amis qui peuvent sortir : tous les héros sauf celui du joueur
const FRIEND_AVATARS = ['fox', 'panda', 'unicorn', 'dragon', 'astronaut'];
// Image la plus longue prise en compte entre deux images (onglet ralenti) : le jeu ne saute
// pas une sortie entière d'un coup
const MAX_FRAME_MS = 100;

// Clavier : monstre levé suivant ou précédent, et taper celui qui est visé
const CURSOR_STEPS = new Map([
  ['ArrowLeft', -1],
  ['ArrowUp', -1],
  ['ArrowRight', 1],
  ['ArrowDown', 1],
]);
const WHACK_KEYS = new Set(['Enter', ' ']);
const KEYBOARD_HELP_KEY = 'arcade.controls.multipop.keyboard';

// Partie en cours (une seule à la fois)
let _popInstance = null;

function hiddenText(parent, tag, text) {
  const element = document.createElement(tag);
  element.className = 'sr-only';
  element.textContent = text;
  parent?.appendChild(element);
  return element;
}

/** Tables retirées par le joueur (multiplication seulement) */
function excludedTables(operator) {
  if (operator !== '×') return [];
  const user = UserManager.getCurrentUser();
  return TablePreferences.isGlobalEnabled(user) ? TablePreferences.getActiveExclusions(user) : [];
}

/** Images des monstres d'une partie : quelques-uns des monstres du jeu, tous différents */
function drawCast() {
  const numbers = shuffleInPlace(Array.from({ length: MONSTER_COUNT }, (_, index) => index + 1));
  return numbers.slice(0, CAST_SIZE).map(number => spriteFor(monsterSpec(number)));
}

/** Images des amis : les héros du jeu, sauf celui du joueur */
function friendSprites() {
  const playerAvatar = normalizeAvatarId(gameState?.avatar);
  return FRIEND_AVATARS.filter(name => name !== playerAvatar).map(name =>
    spriteFor(avatarSpec(name))
  );
}

/** Une partie de MultiPop sur son canevas */
export class PopGame {
  /**
   * @param {string} canvasId
   * @param {{difficulty: string, operator: string, introMs?: number, friendChance?: number}}
   *   options - introMs : temps laissé à la consigne du début avant la première sortie de
   *   monstres ; friendChance : chance qu'un ami sorte avec eux
   */
  constructor(canvasId, { difficulty, operator, introMs = 0, friendChance = FRIEND_CHANCE }) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.operator = operator || '×';
    this.settings = getDifficultySettings(difficulty);
    this.excluded = excludedTables(this.operator);
    this.field = new MonsterField({
      ...monsterRhythm(this.settings),
      solvedMs: SOLVED_PAUSE_MS,
      friendChance,
    });
    this.introMs = introMs;
    this.score = 0;
    this.question = null;
    this.cursorHole = null;
    this.keyboardCursor = false;
    this.disposed = false;
    this.frameId = 0;
    this.lastFrame = null;
    this.cast = drawCast();
    this.friends = friendSprites();
    /** Image du personnage de chaque terrier, pour la sortie en cours */
    this.sprites = new Map();
    this.grassSprite = spriteFor(textureSpec('herbe.png'));
    this.reducedMotion = Boolean(
      globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    );
    this.layout = popLayout({ width: 300, height: 315 });
  }

  /** Plateau, écouteurs, premier calcul, puis la boucle du jeu */
  start() {
    this.resize();
    this.listen();
    this.setupKeyboard();
    this.nextQuestion(Math.max(GAP_MS, this.introMs));
    this.focusBoard();
    this.frameId = requestAnimationFrame(now => this.frame(now));
  }

  // Taille du plateau pour la place sous le bandeau ; à chaque changement d'écran
  resize() {
    if (!this.canvas?.isConnected) return;
    this.layout = popLayout(getArcadeCanvasBox(this.canvas));
    sizeArcadeCanvas(this.canvas, this.layout.width, this.layout.height);
    this.prefetchFigures();
    this.draw();
  }

  // Monstres et amis de la partie, chargés à la taille du plateau avant de sortir
  prefetchFigures() {
    const { figure } = cellParts(cellRect(this.layout, 0));
    for (const sprite of [...this.cast, ...this.friends]) {
      prefetchArcadeSprite(this.canvas, sprite, figure.width, figure.height);
    }
  }

  listen() {
    this.onPointerDown = event => this.handlePointer(event);
    this.onKeyDown = event => this.handleKeyDown(event);
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('keydown', this.onKeyDown);
    this.stopWatchingViewport = watchArcadeViewport(this.canvas, () => this.resize());
  }

  // Annonces aux lecteurs d'écran, et aide du clavier liée au plateau
  setupKeyboard() {
    const stage = this.canvas.parentElement;
    this.liveRegion = hiddenText(stage, 'p', '');
    this.liveRegion.classList.add('multipop-announcer');
    this.liveRegion.setAttribute('role', 'status');
    const help = hiddenText(stage, 'span', getTranslation(KEYBOARD_HELP_KEY));
    help.id = `${this.canvas.id}-keyboard-help`;
    help.dataset.translate = KEYBOARD_HELP_KEY;
    this.canvas.setAttribute('aria-describedby', help.id);
  }

  focusBoard() {
    try {
      this.canvas.focus({ preventScroll: true });
    } catch {
      // Focus impossible : la souris et le doigt jouent toujours
    }
  }

  /**
   * Calcul suivant : au bandeau, puis ses monstres sortent
   * @param {number} [waitMs] - attente avant la première sortie
   */
  nextQuestion(waitMs = GAP_MS) {
    const question = drawArcadeQuestion(this.operator, this.settings, this.excluded);
    this.question = question;
    this.field.ask(
      question.answer,
      () => arcadeAnswers(question, this.operator, this.settings, this.field.count),
      waitMs
    );
    const banner = document.querySelector('.arcade-question');
    if (banner) banner.textContent = `${question.a} ${this.operator} ${question.b} = ?`;
  }

  /** Une image : l'horloge du jeu avance hors pause, puis le plateau se redessine */
  frame(now) {
    if (this.disposed || !isArcadeActive()) return;
    const dt = this.lastFrame === null ? 0 : Math.min(MAX_FRAME_MS, now - this.lastFrame);
    this.lastFrame = now;
    if (!isArcadePaused()) this.step(dt);
    this.draw();
    this.frameId = requestAnimationFrame(next => this.frame(next));
  }

  /**
   * Avance le jeu de dt millisecondes
   * @param {number} dt
   */
  step(dt) {
    const event = this.field.tick(dt);
    if (event === 'solved-done') this.nextQuestion();
    else if (event === 'raised') this.onRaised();
    else if (event === 'escaped') this.cursorHole = null;
  }

  // Une sortie : chaque personnage reçoit son image, le clavier vise le premier monstre
  onRaised() {
    this.dressFigures();
    this.aimFirstMonster();
  }

  // Un monstre différent par terrier, pris dans ceux de la partie ; l'ami, un héros au hasard
  dressFigures() {
    const cast = shuffleInPlace([...this.cast]);
    this.sprites = new Map(
      this.field.monsters.map((monster, index) => [monster.hole, cast.at(index % cast.length)])
    );
    const { friend } = this.field;
    if (friend) this.sprites.set(friend.hole, pickRandom(this.friends));
  }

  // Nouveaux monstres : le clavier vise le premier ; le lecteur d'écran l'annonce
  aimFirstMonster() {
    const [first] = this.field.upMonsters();
    this.cursorHole = first ? first.hole : null;
    if (this.keyboardCursor) this.announceCursor();
  }

  draw() {
    if (!this.ctx || !this.canvas?.isConnected) return;
    drawPopBoard(this.ctx, {
      layout: this.layout,
      field: this.field,
      sprites: this.sprites,
      grassSprite: this.grassSprite,
      cursorHole: this.keyboardCursor ? this.cursorHole : null,
      reducedMotion: this.reducedMotion,
    });
  }

  // Souris, doigt ou stylet : le terrier sous le point
  handlePointer(event) {
    if (event.pointerType === 'touch') event.preventDefault();
    this.keyboardCursor = false;
    const point = clientToCanvasPoint(this.canvas, event.clientX, event.clientY);
    const hole = holeAt(this.layout, point);
    if (hole >= 0) this.whack(hole);
  }

  handleKeyDown(event) {
    const step = CURSOR_STEPS.get(event.key);
    if (step) {
      event.preventDefault();
      this.moveCursor(step);
    } else if (WHACK_KEYS.has(event.key)) {
      event.preventDefault();
      this.keyboardCursor = true;
      if (this.cursorHole !== null) this.whack(this.cursorHole);
    }
  }

  /**
   * Vise le monstre levé suivant (1) ou précédent (-1), en boucle
   * @param {number} step
   */
  moveCursor(step) {
    this.keyboardCursor = true;
    const monsters = this.field.upMonsters();
    if (monsters.length === 0) return;
    const index = monsters.findIndex(monster => monster.hole === this.cursorHole);
    const next = index === -1 ? 0 : (index + step + monsters.length) % monsters.length;
    this.cursorHole = monsters.at(next).hole;
    this.announceCursor();
  }

  // « Monstre 2 sur 3 : 42 », pour les lecteurs d'écran (pas la voix du jeu)
  announceCursor() {
    const monsters = this.field.upMonsters();
    const index = monsters.findIndex(monster => monster.hole === this.cursorHole);
    if (index === -1 || !this.liveRegion) return;
    this.liveRegion.textContent = getTranslation('arcade_pop_cursor', {
      index: index + 1,
      count: monsters.length,
      value: monsters.at(index).value,
    });
  }

  /**
   * Tape un terrier ; rien en pause ni sur un terrier sans personnage levé
   * @param {number} hole
   */
  whack(hole) {
    if (this.disposed || isArcadePaused()) return;
    const result = this.field.whack(hole);
    if (!result) return;
    // Un personnage tapé : la partie est jouée (tableau de bord)
    noteArcadePlay();
    const at = this.headPoint(hole);
    if (result.friend) this.onFriend(at);
    else this.onMonster(result, at);
    this.updateScore();
  }

  // Un monstre tapé : sa réponse compte pour le calcul du bandeau
  onMonster(result, at) {
    const { a, b } = this.question;
    recordArcadeAnswer(this.operator, a, b, result.correct);
    if (result.correct) {
      this.onRightMonster(at);
      return;
    }
    this.onWrongMonster(at);
    if (this.keyboardCursor) this.moveCursor(1);
  }

  // Bonne réponse : 100 points, le calcul complet au bandeau le temps de le lire
  onRightMonster(at) {
    this.score += CORRECT_POINTS;
    // La pastille joue aussi le son de la bonne réponse
    showArcadePoints(CORRECT_POINTS, this.canvas, at);
    const { a, b } = this.question;
    showSolvedQuestion({ operator: this.operator, a, b });
    this.cursorHole = null;
  }

  // Mauvaise réponse : jusqu'à 50 points de moins, jamais sous zéro ; aucune vie perdue
  onWrongMonster(at) {
    const removed = Math.min(this.score, MISS_PENALTY);
    this.score -= removed;
    // Le son de l'erreur, même sans point à retirer
    showArcadePenalty(removed, this.canvas, at);
  }

  // Un ami tapé : jusqu'à 50 points de moins ; ce n'est pas une erreur de calcul
  onFriend(at) {
    const removed = Math.min(this.score, FRIEND_PENALTY);
    this.score -= removed;
    showArcadePenalty(removed, this.canvas, at);
  }

  // Point du plateau où poser une pastille de points : en haut du personnage, sans cacher
  // sa pancarte
  headPoint(hole) {
    const { centerX, figure } = cellParts(cellRect(this.layout, hole));
    return { x: centerX, y: figure.y + figure.height * 0.28 };
  }

  updateScore() {
    try {
      InfoBar.update({ score: this.score }, 'multipop');
    } catch {
      // Bandeau absent (écran quitté) : le score reste dans la partie
    }
  }

  /** Arrête la boucle et retire les écouteurs ; un second appel ne fait rien */
  cleanup() {
    if (this.disposed) return;
    this.disposed = true;
    cancelAnimationFrame(this.frameId);
    this.canvas?.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas?.removeEventListener('keydown', this.onKeyDown);
    this.stopWatchingViewport?.();
  }
}

/**
 * Rend la partie en cours (« Abandonner » ou arrêt de l'Arcade)
 * @returns {number} Son score
 */
function cleanupPopGame() {
  const score = _popInstance?.score ?? 0;
  _popInstance?.cleanup();
  _popInstance = null;
  return score;
}

/** Quitte le jeu d'Arcade en cours et ouvre l'écran de MultiPop */
function enterPopScreen() {
  try {
    stopArcadeMode();
  } catch {
    // Attendu : le mode arcade peut ne pas être actif
  }
  // Le mode est posé avant le changement d'écran, qui sinon arrêterait le lancement
  setStartingMode('multipop');
  gameState.gameMode = 'multipop';
  void goToSlide(4);
}

/** Écran du jeu : bandeau, plateau et « Abandonner », du gabarit commun de l'Arcade */
function renderPopScreen() {
  const gameScreen = document.getElementById('game');
  while (gameScreen.firstChild) gameScreen.firstChild.remove();
  const frag = InfoBar.createArcadeTemplateElement({
    mode: 'multipop',
    canvasId: 'multipop-canvas',
    operationId: 'arcade-mult-display',
    scoreId: 'multipop-info-score',
    livesId: 'multipop-info-lives',
    timerId: 'arcade-info-timer',
    abandonId: 'multipop-abandon-btn',
    operationLabel: '',
    abandonLabel: getTranslation('abandon_arcade_button'),
    showLives: false,
    showScore: true,
  });
  gameScreen.appendChild(frag);
  prepareArcadeStage(document.getElementById('multipop-canvas'));
}

/** Minuteur du niveau, score à zéro, « Abandonner » (écran de fin avec le score) */
function startPopRound(settings) {
  startArcadeTimer(settings.timeSeconds);
  // Le lancement est fini : le mode « en cours de lancement » se retire
  setTimeout(() => setStartingMode(null), 0);
  const scoreElement = document.getElementById('multipop-info-score');
  if (scoreElement) scoreElement.textContent = '0';
  document.getElementById('multipop-abandon-btn').addEventListener('click', () => {
    const score = cleanupPopGame();
    showArcadeGameOver(score);
  });
}

// Consigne du début, selon l'appareil (elle n'est pas lue à voix haute)
function showPopInstructions(canvas) {
  const key = isTouchFirstDevice()
    ? 'arcade_pop_instructions_touch'
    : 'arcade_pop_instructions_desktop';
  showGameInstructions(canvas, getTranslation(key));
}

/**
 * Lance MultiPop : écran du jeu, minuteur du niveau, puis la partie, avec les réglages du
 * niveau et l'opération choisie à l'accueil ; l'arrêt de l'Arcade (Accueil) la rend sans
 * écran de fin
 */
export function startPopArcade() {
  enterPopScreen();
  const operator = UserState.getCurrentUserData().preferredOperator || '×';
  cleanupPopGame();
  renderPopScreen();
  const difficulty = gameState.difficulty || 'moyen';
  startPopRound(getDifficultySettings(difficulty));
  // Les premiers monstres attendent que la consigne, posée sur le plateau, soit partie
  _popInstance = new PopGame('multipop-canvas', {
    difficulty,
    operator,
    introMs: INSTRUCTIONS_MS,
  });
  _popInstance.start();
  showPopInstructions(_popInstance.canvas);
  eventBus.on('arcade:stop', cleanupPopGame, { once: true });
}
