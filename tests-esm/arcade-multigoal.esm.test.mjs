/* eslint-env jest, node */
/**
 * MultiGoal en jeu : le calcul au bandeau, ses nombres sur les cibles de la cage. Tirer dans
 * la cible de la bonne réponse quand le gardien est ailleurs : but, 100 points, le calcul
 * complet, puis un autre calcul et un autre gardien. Bonne réponse tirée sur le gardien :
 * arrêtée, ni point ni erreur ni son d'erreur. Mauvaise réponse : jusqu'à 50 points de moins,
 * la cible tombe. Souris ou doigt sur la cible, ou clavier (flèches, Entrée ou Espace). Rien
 * en pause. L'horloge du jeu est avancée à la main (step).
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import {
  FR,
  AudioManager,
  gameState,
  pause,
  showArcadeGameOver,
  noteArcadePlay,
  recordArcadeAnswer,
  showSolvedQuestion,
  setArcadeActive,
  mountBoard,
  placeBoard,
  unmountBoard,
  keyOn,
  tapAt,
  pauseArcadeGame,
} from './helpers/board-game-bench.mjs';

const { GoalGame, GOAL_POINTS, MISS_PENALTY } = await import('../js/arcade-multigoal.js');
const { FLIGHT_MS, REPLAY_MS } = await import('../js/multigoal-engine.js');
const { goalPoint } = await import('../js/multigoal-renderer.js');

let game;
let canvas;
let playSound;

const press = key => keyOn(canvas, key);
const status = () => document.querySelector('.multigoal-announcer[role="status"]').textContent;
const banner = () => document.querySelector('.arcade-question').textContent;
const shownScore = () => document.getElementById('multigoal-info-score').textContent;
const rightTarget = () => game.shootout.targets.find(target => target.correct);
const wrongTarget = () => game.shootout.openTargets().find(target => !target.correct);

/** Le gardien dans la colonne de la cible, ou dans celle du bord opposé */
function keeperOn(target) {
  game.shootout.keeper.x = target.x;
}
function keeperAwayFrom(target) {
  const { shootout } = game;
  shootout.keeper.x = target.x < 0.5 ? shootout.keeperMax : shootout.keeperMin;
}

/** Souris ou doigt au milieu d'une cible */
function tapTarget(target, pointerType = 'mouse') {
  return tapAt(canvas, goalPoint(game.layout, target), pointerType);
}

/** Le ballon arrive sur sa cible */
const land = () => game.step(FLIGHT_MS);

/** Un but : la bonne cible, gardien ailleurs, jusqu'au calcul suivant */
function scoreGoal() {
  keeperAwayFrom(rightTarget());
  tapTarget(rightTarget());
  land();
  game.step(1500);
}

beforeEach(() => {
  canvas = mountBoard('multigoal');
  // Le son n'est pas coupé : les sons demandés se comptent, sans rien jouer
  jest.spyOn(AudioManager, 'isMuted').mockReturnValue(false);
  playSound = jest.spyOn(AudioManager, 'playSound').mockImplementation(() => undefined);
  game = new GoalGame(canvas.id, { difficulty: 'moyen', operator: '×' });
  game.start();
  // La boucle d'images arrêtée, l'Arcade est « en cours » : les tests avancent l'horloge à
  // la main (step) et les pastilles de points jouent leur son
  cancelAnimationFrame(game.frameId);
  setArcadeActive(true);
  placeBoard(canvas, game.layout);
  playSound.mockClear();
});

afterEach(() => unmountBoard(game));

describe('MultiGoal : une partie', () => {
  test('le calcul au bandeau ; les quatre cibles du niveau, une seule avec la bonne réponse', () => {
    const { a, b } = game.question;
    expect(banner()).toBe(`${a} × ${b} = ?`);
    expect(game.shootout.openTargets()).toHaveLength(4);
    expect(game.shootout.targets.filter(target => target.correct)).toHaveLength(1);
    expect(rightTarget().value).toBe(a * b);
    expect(new Set(game.shootout.targets.map(target => target.value)).size).toBe(4);
  });

  test('but à la souris : 100 points à l’arrivée du ballon, le calcul complet, puis un autre', () => {
    const { a, b } = game.question;
    keeperAwayFrom(rightTarget());
    tapTarget(rightTarget());
    expect(noteArcadePlay).toHaveBeenCalledTimes(1);
    // Le ballon vole encore : rien ne compte avant qu'il arrive
    expect(game.score).toBe(0);
    expect(recordArcadeAnswer).not.toHaveBeenCalled();
    land();
    expect(game.score).toBe(GOAL_POINTS);
    expect(shownScore()).toBe('100');
    expect(recordArcadeAnswer).toHaveBeenCalledTimes(1);
    expect(recordArcadeAnswer).toHaveBeenCalledWith('×', a, b, true);
    expect(showSolvedQuestion).toHaveBeenCalledWith({ operator: '×', a, b });
    expect(playSound).toHaveBeenCalledWith('good', expect.anything());
    const solved = game.question;
    const keeper = game.keeperSprite;
    game.step(1500);
    expect(game.question).not.toBe(solved);
    expect(banner()).toMatch(/ = \?$/);
    expect(game.shootout.openTargets()).toHaveLength(4);
    // Un autre gardien entre dans la cage
    expect(game.keeperSprite).not.toBe(keeper);
  });

  test('bonne réponse sur le gardien : arrêtée, ni point, ni erreur, ni son d’erreur', () => {
    scoreGoal();
    recordArcadeAnswer.mockClear();
    playSound.mockClear();
    keeperOn(rightTarget());
    tapTarget(rightTarget());
    land();
    expect(game.shootout.phase).toBe('saved');
    expect(game.score).toBe(GOAL_POINTS);
    expect(recordArcadeAnswer).not.toHaveBeenCalled();
    expect(showSolvedQuestion).toHaveBeenCalledTimes(1);
    expect(playSound).not.toHaveBeenCalled();
    expect(status()).toBe(FR.arcade_goal_saved);
    // On retire : la cible est toujours là, le gardien parti le but compte
    const { a, b } = game.question;
    game.step(REPLAY_MS);
    expect(game.shootout.openTargets()).toHaveLength(4);
    keeperAwayFrom(rightTarget());
    tapTarget(rightTarget());
    land();
    expect(game.score).toBe(2 * GOAL_POINTS);
    expect(recordArcadeAnswer).toHaveBeenCalledTimes(1);
    expect(recordArcadeAnswer).toHaveBeenCalledWith('×', a, b, true);
  });

  test('une mauvaise : jusqu’à 50 points de moins, jamais sous zéro, la cible tombe', () => {
    const { a, b } = game.question;
    const missed = wrongTarget();
    tapTarget(missed);
    land();
    expect(game.score).toBe(0);
    expect(recordArcadeAnswer).toHaveBeenCalledWith('×', a, b, false);
    expect(playSound).toHaveBeenCalledWith('bad');
    game.step(REPLAY_MS);
    expect(game.shootout.openTargets()).toHaveLength(3);
    // La cible tombée ne répond plus
    noteArcadePlay.mockClear();
    tapTarget(missed);
    expect(noteArcadePlay).not.toHaveBeenCalled();
    scoreGoal();
    tapTarget(wrongTarget());
    land();
    expect(game.score).toBe(GOAL_POINTS - MISS_PENALTY);
    expect(shownScore()).toBe('50');
    expect(showArcadeGameOver).not.toHaveBeenCalled();
  });

  test('une mauvaise sur le gardien : c’est quand même une erreur', () => {
    const { a, b } = game.question;
    keeperOn(wrongTarget());
    tapTarget(wrongTarget());
    land();
    expect(game.shootout.phase).toBe('missed');
    expect(recordArcadeAnswer).toHaveBeenCalledWith('×', a, b, false);
  });

  test('au doigt : la cible touchée, sans défilement de la page', () => {
    keeperAwayFrom(rightTarget());
    const event = tapTarget(rightTarget(), 'touch');
    expect(event.defaultPrevented).toBe(true);
    land();
    expect(game.score).toBe(GOAL_POINTS);
  });

  test('à côté des cibles, ou pendant le vol du ballon : rien ne se passe', () => {
    canvas.dispatchEvent(
      new MouseEvent('pointerdown', {
        clientX: game.layout.spot.x,
        clientY: game.layout.spot.y,
        bubbles: true,
      })
    );
    expect(noteArcadePlay).not.toHaveBeenCalled();
    keeperAwayFrom(rightTarget());
    tapTarget(wrongTarget());
    tapTarget(rightTarget());
    expect(noteArcadePlay).toHaveBeenCalledTimes(1);
    land();
    expect(game.score).toBe(0);
  });

  test('en pause : aucun tir, et le gardien ne bouge pas', () => {
    pauseArcadeGame();
    keeperAwayFrom(rightTarget());
    tapTarget(rightTarget());
    press('Enter');
    expect(noteArcadePlay).not.toHaveBeenCalled();
    expect(game.shootout.phase).toBe('aiming');
    // Au milieu de la cage : il a de la place pour avancer
    game.shootout.keeper.x = 0.5;
    const x = game.shootout.keeper.x;
    game.lastFrame = 0;
    game.frame(80);
    expect(game.shootout.keeper.x).toBe(x);
    // La pause levée, la même image le fait avancer
    pause.resumeArcade();
    game.frame(160);
    expect(game.shootout.keeper.x).not.toBe(x);
  });

  test('hors pause, le gardien avance avec l’horloge du jeu', () => {
    const x = game.shootout.keeper.x;
    game.step(400);
    expect(game.shootout.keeper.x).not.toBe(x);
  });
});

describe('MultiGoal au clavier', () => {
  test('le terrain a le focus et dit comment jouer au clavier', () => {
    expect(document.activeElement).toBe(canvas);
    const help = document.getElementById(canvas.getAttribute('aria-describedby'));
    expect(help.textContent).toBe(FR['arcade.controls.multigoal.keyboard']);
  });

  test('les flèches passent d’une cible à l’autre, en boucle, et le nombre est annoncé', () => {
    keeperOn(game.shootout.targets.at(1));
    const values = game.shootout.targets.map(target => target.value);
    press('ArrowRight');
    expect(game.cursorSlot).toBe(1);
    // Le gardien est devant la deuxième colonne
    expect(status()).toBe(`Cible 2 sur 4\u00a0: ${values.at(1)}, le gardien est devant`);
    press('ArrowDown');
    expect(status()).toBe(`Cible 3 sur 4\u00a0: ${values.at(2)}`);
    press('ArrowRight');
    press('ArrowRight');
    expect(game.cursorSlot).toBe(0);
    press('ArrowLeft');
    expect(game.cursorSlot).toBe(3);
    press('ArrowUp');
    expect(game.cursorSlot).toBe(2);
  });

  test('Entrée tire sur la cible visée ; Espace aussi', () => {
    const right = rightTarget();
    keeperAwayFrom(right);
    game.cursorSlot = right.slot;
    press('Enter');
    land();
    expect(game.score).toBe(GOAL_POINTS);
    game.step(1500);
    keeperAwayFrom(rightTarget());
    game.cursorSlot = rightTarget().slot;
    press(' ');
    land();
    expect(game.score).toBe(2 * GOAL_POINTS);
  });

  test('la cible visée tombe : le clavier vise la première qui reste, et l’annonce', () => {
    const missed = wrongTarget();
    game.cursorSlot = missed.slot;
    press('Enter');
    land();
    game.step(REPLAY_MS);
    const first = game.shootout.openTargets().at(0);
    expect(game.cursorSlot).toBe(first.slot);
    expect(status()).toMatch(/^Cible 1 sur 3\s: \d+/);
  });

  test('à la souris, pas d’annonce ni de contour : le clavier seul les montre', () => {
    tapTarget(wrongTarget());
    land();
    game.step(REPLAY_MS);
    expect(status()).toBe('');
    expect(game.keyboardCursor).toBe(false);
  });
});

describe('MultiGoal : gardiens et réglages', () => {
  test('douze gardiens différents par partie, le héros du joueur près du ballon', () => {
    expect(new Set(game.cast).size).toBe(12);
    expect(game.cast).toContain(game.keeperSprite);
    gameState.avatar = 'panda';
    const other = new GoalGame(canvas.id, { difficulty: 'debutant', operator: '+' });
    expect(other.heroSprite.spec.source).toMatch(/^panda/);
    expect(other.shootout.count).toBe(3);
    gameState.avatar = undefined;
  });

  test('sans opération donnée : la multiplication', () => {
    const other = new GoalGame(canvas.id, { difficulty: 'moyen' });
    other.start();
    expect(other.operator).toBe('×');
    expect(banner()).toMatch(/^\d+ × \d+ = \?$/);
    other.cleanup();
  });

  test('Difficile : six cibles ; le nettoyage arrête la partie, deux fois sans erreur', () => {
    const other = new GoalGame(canvas.id, { difficulty: 'difficile', operator: '÷' });
    other.start();
    expect(other.shootout.openTargets()).toHaveLength(6);
    other.cleanup();
    other.cleanup();
    expect(other.disposed).toBe(true);
    tapTarget(other.shootout.targets.at(0));
    expect(other.shootout.phase).toBe('aiming');
  });
});
