/**
 * Socle des jeux d'Arcade à un plateau dessiné où l'on choisit une réponse (MultiPop,
 * MultiGoal) : le canevas et ses écouteurs, la boucle d'images sur l'horloge du jeu (arrêtée
 * en pause), l'annonce aux lecteurs d'écran et l'aide du clavier, le score du bandeau, et
 * l'écran du jeu avec son minuteur et son bouton « Abandonner ». Chaque jeu garde ses
 * règles : resize(), step(dt), draw(), handlePointer(event) et handleKeyDown(event).
 */
import { goToSlide } from './slides.js';
import { gameState } from './game.js';
import { getTranslation } from './utils-es6.js';
import { setStartingMode } from './mode-orchestrator.js';
import { InfoBar } from './components/infoBar.js';
import { startArcadeTimer, showArcadeGameOver, stopArcadeMode, isArcadeActive } from './arcade.js';
import { isArcadePaused } from './arcade-time.js';
import { spriteFor } from './arcade-sprites.js';
import { monsterSpec, MONSTER_COUNT } from './arcade-sprite-catalog.js';
import { shuffleInPlace } from './core/random.js';
import { prepareArcadeStage, watchArcadeViewport } from './arcade-common.js';
import { getDifficultySettings } from './difficulty.js';
import { TablePreferences } from './core/tablePreferences.js';
import { UserManager } from './userManager.js';

// Image la plus longue prise en compte entre deux images (onglet ralenti) : le jeu ne saute
// pas plusieurs secondes d'un coup
const MAX_FRAME_MS = 100;

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

/**
 * Images de quelques monstres du jeu, tous différents, pour une partie
 * @param {number} size - combien
 * @returns {import('./arcade-sprites.js').ArcadeSprite[]}
 */
export function monsterCast(size) {
  const numbers = shuffleInPlace(Array.from({ length: MONSTER_COUNT }, (_, index) => index + 1));
  return numbers.slice(0, size).map(number => spriteFor(monsterSpec(number)));
}

/** Une partie sur un canevas : ce que MultiPop et MultiGoal ont en commun */
export class ArcadeBoardGame {
  /**
   * @param {string} canvasId
   * @param {{mode: string, difficulty: string, operator: string, keyboardHelpKey: string}}
   *   options - mode : nom du jeu (bandeau, classe de l'annonce) ; keyboardHelpKey : texte
   *   de l'aide du clavier
   */
  constructor(canvasId, { mode, difficulty, operator, keyboardHelpKey }) {
    this.mode = mode;
    this.keyboardHelpKey = keyboardHelpKey;
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.operator = operator || '×';
    this.settings = getDifficultySettings(difficulty);
    this.excluded = excludedTables(this.operator);
    this.score = 0;
    this.question = null;
    this.keyboardCursor = false;
    this.disposed = false;
    this.frameId = 0;
    this.lastFrame = null;
    this.reducedMotion = Boolean(
      globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    );
  }

  /** Souris, doigt, clavier, et le plateau refait à chaque changement d'écran */
  listen() {
    this.onPointerDown = event => this.handlePointer(event);
    this.onKeyDown = event => this.handleKeyDown(event);
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('keydown', this.onKeyDown);
    this.stopWatchingViewport = watchArcadeViewport(this.canvas, () => this.resize());
  }

  /** Annonces aux lecteurs d'écran, et aide du clavier liée au plateau */
  setupKeyboard() {
    const stage = this.canvas.parentElement;
    this.liveRegion = hiddenText(stage, 'p', '');
    this.liveRegion.classList.add(`${this.mode}-announcer`);
    this.liveRegion.setAttribute('role', 'status');
    const help = hiddenText(stage, 'span', getTranslation(this.keyboardHelpKey));
    help.id = `${this.canvas.id}-keyboard-help`;
    help.dataset.translate = this.keyboardHelpKey;
    this.canvas.setAttribute('aria-describedby', help.id);
  }

  focusBoard() {
    try {
      this.canvas.focus({ preventScroll: true });
    } catch {
      // Focus impossible : la souris et le doigt jouent toujours
    }
  }

  /** Lance la boucle d'images */
  run() {
    this.frameId = requestAnimationFrame(now => this.frame(now));
  }

  /** Une image : l'horloge du jeu avance hors pause, puis le plateau se redessine */
  frame(now) {
    if (this.disposed || !isArcadeActive()) return;
    const dt = this.lastFrame === null ? 0 : Math.min(MAX_FRAME_MS, now - this.lastFrame);
    this.lastFrame = now;
    if (!isArcadePaused()) this.step(dt);
    this.draw();
    this.run();
  }

  /**
   * Le calcul au bandeau
   * @param {{a: number, b: number}} question
   */
  showQuestion(question) {
    this.question = question;
    const banner = document.querySelector('.arcade-question');
    if (banner) banner.textContent = `${question.a} ${this.operator} ${question.b} = ?`;
  }

  /** Une action n'est possible que sur une partie en cours, hors pause */
  canPlay() {
    return !this.disposed && !isArcadePaused();
  }

  updateScore() {
    try {
      InfoBar.update({ score: this.score }, this.mode);
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
 * Quitte le jeu d'Arcade en cours et ouvre l'écran d'un jeu : bandeau (score, minuteur, sans
 * vies), plateau et « Abandonner », du gabarit commun de l'Arcade
 * @param {string} mode - nom du jeu : ses éléments s'appellent <mode>-canvas,
 *   <mode>-info-score et <mode>-abandon-btn
 */
export function openBoardGameScreen(mode) {
  try {
    stopArcadeMode();
  } catch {
    // Attendu : le mode arcade peut ne pas être actif
  }
  // Le mode est posé avant le changement d'écran, qui sinon arrêterait le lancement
  setStartingMode(mode);
  gameState.gameMode = mode;
  void goToSlide(4);
}

/**
 * Écran du jeu, posé à la place de l'écran précédent
 * @param {string} mode
 */
export function renderBoardGameScreen(mode) {
  const gameScreen = document.getElementById('game');
  while (gameScreen.firstChild) gameScreen.firstChild.remove();
  const frag = InfoBar.createArcadeTemplateElement({
    mode,
    canvasId: `${mode}-canvas`,
    operationId: 'arcade-mult-display',
    scoreId: `${mode}-info-score`,
    livesId: `${mode}-info-lives`,
    timerId: 'arcade-info-timer',
    abandonId: `${mode}-abandon-btn`,
    operationLabel: '',
    abandonLabel: getTranslation('abandon_arcade_button'),
    showLives: false,
    showScore: true,
  });
  gameScreen.appendChild(frag);
  prepareArcadeStage(document.getElementById(`${mode}-canvas`));
}

/**
 * Minuteur du niveau et « Abandonner » (écran de fin avec le score) ; le score du bandeau
 * part de zéro, comme le pose le gabarit
 * @param {string} mode
 * @param {{timeSeconds: number}} settings - réglages du niveau
 * @param {() => number} giveUp - rend la partie en cours et donne son score
 */
export function startBoardGameRound(mode, settings, giveUp) {
  startArcadeTimer(settings.timeSeconds);
  // Le lancement est fini : le mode « en cours de lancement » se retire
  setTimeout(() => setStartingMode(null), 0);
  document.getElementById(`${mode}-abandon-btn`).addEventListener('click', () => {
    showArcadeGameOver(giveUp());
  });
}
