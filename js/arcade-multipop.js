/**
 * MultiPop : le calcul est au bandeau ; des monstres surgissent des neuf terriers, chacun avec
 * un nombre sur sa pancarte. Taper celui qui porte la bonne réponse : 100 points, le calcul
 * complet au bandeau le temps de le lire, puis le calcul suivant. Un mauvais : jusqu'à
 * 50 points de moins, il redescend ; aucune vie perdue, seul le temps compte. Personne de
 * tapé à temps : d'autres monstres sortent pour le même calcul. Parfois un ami (un autre héros
 * du jeu, un cœur sur sa pancarte) sort avec eux : le taper coûte aussi jusqu'à 50 points.
 *
 * Souris, doigt ou clavier (flèches : monstre levé suivant ou précédent ; Entrée ou Espace :
 * le taper ; le clavier ne vise jamais l'ami). À la souris, un maillet remplace le curseur
 * sur le plateau et s'abat à chaque tape ; au doigt et au clavier, il apparaît le temps de la
 * frappe. Le nombre du monstre visé est annoncé aux
 * lecteurs d'écran.
 */
import { gameState } from './game.js';
import { getTranslation, showArcadePoints } from './utils-es6.js';
import { showArcadePenalty } from './arcade-points.js';
import { eventBus } from './core/eventBus.js';
import { noteArcadePlay } from './arcade-session.js';
import { recordArcadeAnswer, SOLVED_PAUSE_MS, showSolvedQuestion } from './arcade-learning.js';
import { drawArcadeQuestion, arcadeAnswers } from './arcade-answers.js';
import { spriteFor, prefetchArcadeSprite } from './arcade-sprites.js';
import { avatarSpec, textureSpec } from './arcade-sprite-catalog.js';
import { normalizeAvatarId } from './avatar-heads.js';
import { pickRandom, shuffleInPlace } from './core/random.js';
import {
  showGameInstructions,
  INSTRUCTIONS_MS,
  INSTRUCTIONS_FADE_MS,
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
import { MonsterField, monsterRhythm, GAP_MS, BOTTOM_HOLES } from './multipop-engine.js';
import { popLayout, cellRect, cellParts, holeAt, drawPopBoard } from './multipop-renderer.js';

/** Points d'une bonne réponse */
export const CORRECT_POINTS = 100;
/** Points retirés au plus pour une mauvaise (jamais plus que le score) */
export const MISS_PENALTY = 50;
/** Points retirés au plus pour un ami tapé (jamais plus que le score) */
export const FRIEND_PENALTY = 50;
/** Durée de la frappe du maillet : abattu à la tape, puis il se relève */
export const MALLET_SWING_MS = 220;
/** Chance qu'un ami sorte avec les monstres d'une sortie */
export const FRIEND_CHANCE = 1 / 3;
/** Attente avant la première sortie : le temps de lire le calcul du bandeau */
export const FIRST_RAISE_MS = 1500;
// La consigne du début est posée sur la rangée du bas, le temps de la lire puis de
// s'effacer : jusque-là, les monstres sortent des deux autres rangées
const INSTRUCTIONS_COVER_MS = INSTRUCTIONS_MS + INSTRUCTIONS_FADE_MS;
// Monstres d'une partie, tirés parmi tous ceux du jeu et chargés d'avance
const CAST_SIZE = 12;
// Amis qui peuvent sortir : tous les héros sauf celui du joueur
const FRIEND_AVATARS = ['fox', 'panda', 'unicorn', 'dragon', 'astronaut'];
// Clavier : monstre levé suivant ou précédent, et taper celui qui est visé
const CURSOR_STEPS = new Map([
  ['ArrowLeft', -1],
  ['ArrowUp', -1],
  ['ArrowRight', 1],
  ['ArrowDown', 1],
]);
const WHACK_KEYS = new Set(['Enter', ' ']);

// Partie en cours (une seule à la fois)
let _popInstance = null;

/** Images des amis : les héros du jeu, sauf celui du joueur */
function friendSprites() {
  const playerAvatar = normalizeAvatarId(gameState?.avatar);
  return FRIEND_AVATARS.filter(name => name !== playerAvatar).map(name =>
    spriteFor(avatarSpec(name))
  );
}

/** Une partie de MultiPop sur son canevas */
export class PopGame extends ArcadeBoardGame {
  /**
   * @param {string} canvasId
   * @param {{difficulty: string, operator: string, introMs?: number, coveredMs?: number,
   *   friendChance?: number}} options - introMs : attente avant la première sortie de
   *   monstres ; coveredMs : temps où la consigne du début couvre la rangée du bas, laissée
   *   vide jusque-là ; friendChance : chance qu'un ami sorte avec eux
   */
  constructor(
    canvasId,
    { difficulty, operator, introMs = 0, coveredMs = 0, friendChance = FRIEND_CHANCE }
  ) {
    super(canvasId, {
      mode: 'multipop',
      difficulty,
      operator,
      keyboardHelpKey: 'arcade.controls.multipop.keyboard',
    });
    this.field = new MonsterField({
      ...monsterRhythm(this.settings),
      solvedMs: SOLVED_PAUSE_MS,
      friendChance,
    });
    this.introMs = introMs;
    this.coveredMs = coveredMs;
    this.cursorHole = null;
    /**
     * Le maillet sur le plateau : son point visé, tenu (il suit la souris) ou non (doigt,
     * clavier : il ne reste que le temps de la frappe), et s'il vient de toucher quelqu'un
     * @type {{x: number, y: number, held: boolean, impact: boolean}|null}
     */
    this.mallet = null;
    /** Temps de frappe qui reste au maillet */
    this.malletSwing = 0;
    this.cast = monsterCast(CAST_SIZE);
    this.friends = friendSprites();
    /** Image du personnage de chaque terrier, pour la sortie en cours */
    this.sprites = new Map();
    this.grassSprite = spriteFor(textureSpec('herbe.png'));
    this.malletSprite = spriteFor(textureSpec('maillet.png'));
    this.layout = popLayout({ width: 300, height: 315 });
  }

  /** Plateau, écouteurs, premier calcul, puis la boucle du jeu */
  start() {
    this.resize();
    this.listen();
    this.setupKeyboard();
    this.nextQuestion(Math.max(GAP_MS, this.introMs));
    this.focusBoard();
    this.run();
  }

  // En plus du socle : le maillet suit la souris sur le plateau et le quitte avec elle
  listen() {
    super.listen();
    this.onPointerMove = event => this.handlePointerMove(event);
    this.onPointerLeave = () => this.dropMallet();
    this.canvas.addEventListener('pointermove', this.onPointerMove);
    this.canvas.addEventListener('pointerleave', this.onPointerLeave);
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
    for (const sprite of [...this.cast, ...this.friends, this.malletSprite]) {
      prefetchArcadeSprite(this.canvas, sprite, figure.width, figure.height);
    }
  }

  /**
   * Calcul suivant : au bandeau, puis ses monstres sortent
   * @param {number} [waitMs] - attente avant la première sortie
   */
  nextQuestion(waitMs = GAP_MS) {
    const question = drawArcadeQuestion(this.operator, this.settings, this.excluded);
    this.field.ask(
      question.answer,
      () => arcadeAnswers(question, this.operator, this.settings, this.field.count),
      waitMs
    );
    this.showQuestion(question);
  }

  /**
   * Avance le jeu de dt millisecondes
   * @param {number} dt
   */
  step(dt) {
    this.swingMallet(dt);
    this.coveredMs = Math.max(0, this.coveredMs - dt);
    this.field.reserved = this.coveredMs > 0 ? BOTTOM_HOLES : [];
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
      mallet: this.malletView(),
      malletSprite: this.malletSprite,
    });
  }

  /**
   * Le maillet à dessiner : où il vise et où en est sa frappe (1 à l'impact, 0 au repos)
   * @returns {{x: number, y: number, swing: number, impact: boolean}|null}
   */
  malletView() {
    if (!this.mallet) return null;
    const swing = this.malletSwing / MALLET_SWING_MS;
    const { x, y, impact } = this.mallet;
    // Mouvements réduits : abattu puis levé, sans les positions entre les deux
    return { x, y, impact, swing: this.reducedMotion ? Math.ceil(swing) : swing };
  }

  // La souris ou le stylet sur le plateau : le maillet prend la place du curseur
  handlePointerMove(event) {
    if (event.pointerType === 'touch') return;
    const point = clientToCanvasPoint(this.canvas, event.clientX, event.clientY);
    this.mallet = { x: point.x, y: point.y, held: true, impact: this.mallet?.impact ?? false };
    this.canvas.classList.add('has-mallet');
  }

  // La souris quitte le plateau (ou la partie est rendue) : plus de maillet, le curseur revient
  dropMallet() {
    this.mallet = null;
    this.canvas?.classList.remove('has-mallet');
  }

  /**
   * Abat le maillet sur un point du plateau
   * @param {{x: number, y: number}} point
   * @param {{held: boolean, impact: boolean}} how - held : il reste ensuite sur le plateau
   *   (souris) ; impact : il a touché un personnage
   */
  strike(point, { held, impact }) {
    this.mallet = { x: point.x, y: point.y, held, impact };
    this.malletSwing = MALLET_SWING_MS;
  }

  // La frappe retombe avec l'horloge du jeu ; au doigt et au clavier, le maillet s'en va
  // ensuite (et le curseur revient, si la souris était restée sur le plateau)
  swingMallet(dt) {
    if (this.malletSwing <= 0) return;
    this.malletSwing = Math.max(0, this.malletSwing - dt);
    if (this.malletSwing > 0 || !this.mallet) return;
    if (this.mallet.held) this.mallet.impact = false;
    else this.dropMallet();
  }

  // Souris, doigt ou stylet : le terrier sous le point
  handlePointer(event) {
    if (event.pointerType === 'touch') event.preventDefault();
    this.keyboardCursor = false;
    if (!this.canPlay()) return;
    const point = clientToCanvasPoint(this.canvas, event.clientX, event.clientY);
    const hole = holeAt(this.layout, point);
    const impact = hole >= 0 && this.whack(hole);
    this.strike(point, { held: event.pointerType !== 'touch', impact });
  }

  handleKeyDown(event) {
    const step = CURSOR_STEPS.get(event.key);
    if (step) {
      event.preventDefault();
      this.moveCursor(step);
    } else if (WHACK_KEYS.has(event.key)) {
      event.preventDefault();
      this.keyboardCursor = true;
      this.whackAimed();
    }
  }

  // Clavier : le maillet s'abat sur le monstre visé
  whackAimed() {
    if (this.cursorHole === null || !this.canPlay()) return;
    const at = this.headPoint(this.cursorHole);
    const impact = this.whack(this.cursorHole);
    this.strike(at, { held: false, impact });
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
   * @returns {boolean} true si un personnage a été tapé
   */
  whack(hole) {
    if (!this.canPlay()) return false;
    const result = this.field.whack(hole);
    if (!result) return false;
    // Un personnage tapé : la partie est jouée (tableau de bord)
    noteArcadePlay();
    const at = this.headPoint(hole);
    if (result.friend) this.onFriend(at);
    else this.onMonster(result, at);
    this.updateScore();
    return true;
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

  /** En plus du socle : le maillet s'en va et la souris n'est plus suivie */
  cleanup() {
    this.canvas?.removeEventListener('pointermove', this.onPointerMove);
    this.canvas?.removeEventListener('pointerleave', this.onPointerLeave);
    this.dropMallet();
    super.cleanup();
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
  openBoardGameScreen('multipop');
  const operator = UserState.getCurrentUserData().preferredOperator || '×';
  cleanupPopGame();
  renderBoardGameScreen('multipop');
  const difficulty = gameState.difficulty || 'moyen';
  startBoardGameRound('multipop', getDifficultySettings(difficulty), cleanupPopGame);
  // Les premiers monstres sortent vite, hors de la rangée du bas tant que la consigne y est
  _popInstance = new PopGame('multipop-canvas', {
    difficulty,
    operator,
    introMs: FIRST_RAISE_MS,
    coveredMs: INSTRUCTIONS_COVER_MS,
  });
  _popInstance.start();
  showPopInstructions(_popInstance.canvas);
  eventBus.on('arcade:stop', cleanupPopGame, { once: true });
}
