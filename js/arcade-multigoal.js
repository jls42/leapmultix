/**
 * MultiGoal : une séance de tirs au but. Le calcul est au bandeau ; la cage porte des cibles,
 * chacune avec un nombre, et un monstre gardien va et vient devant elles. Tirer dans la cible
 * de la bonne réponse quand le gardien n'est pas devant : but, 100 points, le calcul complet
 * au bandeau le temps de le lire, puis le calcul suivant avec un nouveau gardien. Bonne
 * réponse tirée sur le gardien : arrêtée, rien ne compte, on retire. Mauvaise réponse :
 * jusqu'à 50 points de moins, la cible tombe, on retire ; aucune vie perdue, seul le temps
 * compte.
 *
 * Souris, doigt ou clavier (flèches : cible suivante ou précédente ; Entrée ou Espace :
 * tirer). La cible visée, le gardien devant elle et un tir arrêté sont annoncés aux lecteurs
 * d'écran.
 */
import { gameState } from './game.js';
import { getTranslation, showArcadePoints } from './utils-es6.js';
import { showArcadePenalty } from './arcade-points.js';
import { eventBus } from './core/eventBus.js';
import { noteArcadePlay } from './arcade-session.js';
import { recordArcadeAnswer, SOLVED_PAUSE_MS, showSolvedQuestion } from './arcade-learning.js';
import { drawArcadeQuestion, arcadeAnswers } from './arcade-answers.js';
import { spriteFor, prefetchArcadeSprite } from './arcade-sprites.js';
import { avatarSpec } from './arcade-sprite-catalog.js';
import { normalizeAvatarId } from './avatar-heads.js';
import {
  showGameInstructions,
  getArcadeCanvasBox,
  clientToCanvasPoint,
  sizeArcadeCanvas,
  isTouchFirstDevice,
} from './arcade-common.js';
import { getDifficultySettings } from './difficulty.js';
import { UserState } from './core/userState.js';
import {
  ArcadeBoardGame,
  monsterCast,
  openBoardGameScreen,
  renderBoardGameScreen,
  startBoardGameRound,
} from './arcade-board-game.js';
import { Shootout, shootoutRhythm } from './multigoal-engine.js';
import {
  goalLayout,
  goalPoint,
  targetAt,
  keeperRect,
  drawGoalBoard,
} from './multigoal-renderer.js';

/** Points d'un but */
export const GOAL_POINTS = 100;
/** Points retirés au plus pour une mauvaise réponse (jamais plus que le score) */
export const MISS_PENALTY = 50;
// Gardiens d'une partie, tirés parmi tous les monstres du jeu et chargés d'avance : un
// nouveau entre dans la cage à chaque calcul
const CAST_SIZE = 12;
// Clavier : cible suivante ou précédente, et tirer sur celle qui est visée
const CURSOR_STEPS = new Map([
  ['ArrowLeft', -1],
  ['ArrowUp', -1],
  ['ArrowRight', 1],
  ['ArrowDown', 1],
]);
const SHOOT_KEYS = new Set(['Enter', ' ']);

// Partie en cours (une seule à la fois)
let _goalInstance = null;

/** Une partie de MultiGoal sur son canevas */
export class GoalGame extends ArcadeBoardGame {
  /**
   * @param {string} canvasId
   * @param {{difficulty: string, operator: string}} options
   */
  constructor(canvasId, { difficulty, operator }) {
    super(canvasId, {
      mode: 'multigoal',
      difficulty,
      operator,
      keyboardHelpKey: 'arcade.controls.multigoal.keyboard',
    });
    this.shootout = new Shootout({
      ...shootoutRhythm(this.settings),
      solvedMs: SOLVED_PAUSE_MS,
    });
    this.penalties = 0;
    this.cursorSlot = null;
    this.cast = monsterCast(CAST_SIZE);
    this.keeperSprite = this.cast.at(0);
    this.heroSprite = spriteFor(avatarSpec(normalizeAvatarId(gameState?.avatar)));
    this.savedLabel = getTranslation('arcade_goal_saved');
    this.layout = goalLayout({ width: 300, height: 340 }, this.shootout.count);
  }

  /** Terrain, écouteurs, premier calcul, puis la boucle du jeu */
  start() {
    this.resize();
    this.listen();
    this.setupKeyboard();
    this.nextQuestion();
    this.focusBoard();
    this.run();
  }

  // Taille du terrain pour la place sous le bandeau ; à chaque changement d'écran
  resize() {
    if (!this.canvas?.isConnected) return;
    this.layout = goalLayout(getArcadeCanvasBox(this.canvas), this.shootout.count);
    sizeArcadeCanvas(this.canvas, this.layout.width, this.layout.height);
    this.prefetchKeepers();
    this.draw();
  }

  // Gardiens de la partie, chargés à la taille de la cage avant d'y entrer
  prefetchKeepers() {
    const { width, height } = keeperRect(this.layout, 0.5, 1);
    for (const sprite of this.cast) prefetchArcadeSprite(this.canvas, sprite, width, height);
  }

  /** Calcul suivant : au bandeau, ses nombres sur les cibles, un nouveau gardien dans la cage */
  nextQuestion() {
    const question = drawArcadeQuestion(this.operator, this.settings, this.excluded);
    const { count } = this.shootout;
    this.shootout.ask(
      question.answer,
      arcadeAnswers(question, this.operator, this.settings, count)
    );
    this.keeperSprite = this.cast.at(this.penalties % this.cast.length);
    this.penalties += 1;
    this.showQuestion(question);
    this.aimFirstTarget();
  }

  /**
   * Avance le jeu de dt millisecondes
   * @param {number} dt
   */
  step(dt) {
    const event = this.shootout.tick(dt);
    if (event === 'goal') this.onGoal();
    else if (event === 'saved') this.onSaved();
    else if (event === 'missed') this.onMissed();
    else if (event === 'replay') this.aimFirstTarget();
    else if (event === 'goal-done') this.nextQuestion();
  }

  // Nouvelles cibles, ou cible visée tombée : le clavier vise la première qui reste
  aimFirstTarget() {
    const targets = this.shootout.openTargets();
    const kept = targets.some(target => target.slot === this.cursorSlot);
    if (!kept) this.cursorSlot = targets.at(0)?.slot ?? null;
    if (this.keyboardCursor) this.announceCursor();
  }

  draw() {
    if (!this.ctx || !this.canvas?.isConnected) return;
    drawGoalBoard(this.ctx, {
      layout: this.layout,
      game: this.shootout,
      keeperSprite: this.keeperSprite,
      heroSprite: this.heroSprite,
      cursorSlot: this.keyboardCursor ? this.cursorSlot : null,
      savedLabel: this.savedLabel,
      reducedMotion: this.reducedMotion,
    });
  }

  // Souris, doigt ou stylet : la cible sous le point
  handlePointer(event) {
    if (event.pointerType === 'touch') event.preventDefault();
    this.keyboardCursor = false;
    const point = clientToCanvasPoint(this.canvas, event.clientX, event.clientY);
    const slot = targetAt(this.layout, this.shootout.openTargets(), point);
    if (slot >= 0) this.shoot(slot);
  }

  handleKeyDown(event) {
    const step = CURSOR_STEPS.get(event.key);
    if (step) {
      event.preventDefault();
      this.moveCursor(step);
    } else if (SHOOT_KEYS.has(event.key)) {
      event.preventDefault();
      this.keyboardCursor = true;
      if (this.cursorSlot !== null) this.shoot(this.cursorSlot);
    }
  }

  /**
   * Vise la cible suivante (1) ou précédente (-1) parmi celles qui restent, en boucle
   * @param {number} step
   */
  moveCursor(step) {
    this.keyboardCursor = true;
    const targets = this.shootout.openTargets();
    if (targets.length === 0) return;
    const index = targets.findIndex(target => target.slot === this.cursorSlot);
    const next = index === -1 ? 0 : (index + step + targets.length) % targets.length;
    this.cursorSlot = targets.at(next).slot;
    this.announceCursor();
  }

  // « Cible 2 sur 3 : 42 », et si le gardien est devant, pour les lecteurs d'écran (pas la
  // voix du jeu)
  announceCursor() {
    const targets = this.shootout.openTargets();
    const index = targets.findIndex(target => target.slot === this.cursorSlot);
    if (index === -1 || !this.liveRegion) return;
    const target = targets.at(index);
    const key = this.shootout.isBlocked(target)
      ? 'arcade_goal_cursor_blocked'
      : 'arcade_goal_cursor';
    this.liveRegion.textContent = getTranslation(key, {
      index: index + 1,
      count: targets.length,
      value: target.value,
    });
  }

  /**
   * Tire sur une cible ; rien en pause, ni pendant qu'un ballon vole
   * @param {number} slot
   */
  shoot(slot) {
    if (!this.canPlay() || !this.shootout.shoot(slot)) return;
    // Un tir : la partie est jouée (tableau de bord)
    noteArcadePlay();
  }

  // Point du terrain où poser une pastille de points : sur la cible du tir
  shotPoint() {
    return goalPoint(this.layout, this.shootout.targets.at(this.shootout.shot.slot));
  }

  // But : 100 points, le calcul complet au bandeau le temps de le lire
  onGoal() {
    const { a, b } = this.question;
    recordArcadeAnswer(this.operator, a, b, true);
    this.score += GOAL_POINTS;
    // La pastille joue aussi le son de la bonne réponse
    showArcadePoints(GOAL_POINTS, this.canvas, this.shotPoint());
    showSolvedQuestion({ operator: this.operator, a, b });
    this.updateScore();
  }

  // Bonne réponse arrêtée par le gardien : ni point, ni erreur, ni son d'erreur ; on retire
  onSaved() {
    if (this.liveRegion) this.liveRegion.textContent = this.savedLabel;
  }

  // Mauvaise réponse : jusqu'à 50 points de moins, jamais sous zéro ; aucune vie perdue
  onMissed() {
    const { a, b } = this.question;
    recordArcadeAnswer(this.operator, a, b, false);
    const removed = Math.min(this.score, MISS_PENALTY);
    this.score -= removed;
    // Le son de l'erreur, même sans point à retirer
    showArcadePenalty(removed, this.canvas, this.shotPoint());
    this.updateScore();
  }
}

/**
 * Rend la partie en cours (« Abandonner » ou arrêt de l'Arcade)
 * @returns {number} Son score
 */
function cleanupGoalGame() {
  const score = _goalInstance?.score ?? 0;
  _goalInstance?.cleanup();
  _goalInstance = null;
  return score;
}

// Consigne du début, selon l'appareil (elle n'est pas lue à voix haute) : posée en bas du
// terrain, sur le ballon, elle ne couvre aucune cible
function showGoalInstructions(canvas) {
  const key = isTouchFirstDevice()
    ? 'arcade_goal_instructions_touch'
    : 'arcade_goal_instructions_desktop';
  showGameInstructions(canvas, getTranslation(key));
}

/**
 * Lance MultiGoal : écran du jeu, minuteur du niveau, puis la partie, avec les réglages du
 * niveau et l'opération choisie à l'accueil ; l'arrêt de l'Arcade (Accueil) la rend sans
 * écran de fin
 */
export function startGoalArcade() {
  openBoardGameScreen('multigoal');
  const operator = UserState.getCurrentUserData().preferredOperator || '×';
  cleanupGoalGame();
  renderBoardGameScreen('multigoal');
  const difficulty = gameState.difficulty || 'moyen';
  startBoardGameRound('multigoal', getDifficultySettings(difficulty), cleanupGoalGame);
  _goalInstance = new GoalGame('multigoal-canvas', { difficulty, operator });
  _goalInstance.start();
  showGoalInstructions(_goalInstance.canvas);
  eventBus.on('arcade:stop', cleanupGoalGame, { once: true });
}
