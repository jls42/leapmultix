/* eslint-env jest, node */
/**
 * MultiInvaders, les points : 100 par monstre abattu, la pénalité du niveau pour un tir sur
 * l'ami (50, 75 ou 100, jamais plus que le score), une vie de moins, et le score de la partie
 * remis à l'écran de fin, par « Abandonner » comme par les vies épuisées. Le jeu avance image
 * par image, comme dans arcade-invasion-play.esm.test.mjs ; le score et les vies sont lus dans
 * ce que le jeu envoie au bandeau.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { placeCanvasAtOrigin } from './helpers/touch-test-helpers.mjs';
import { createInvasionBench } from './helpers/invasion-bench.mjs';
import { mockArcadeShell } from './helpers/module-mocks.mjs';

const updateInfoBar = jest.fn();
const showArcadePoints = jest.fn();
const saveArcadeScore = jest.fn();
mockArcadeShell(jest, '../js', { updateInfoBar, showArcadePoints, saveArcadeScore });
jest.unstable_mockModule('../js/core/operation-stats.js', () => ({
  recordOperationResult: () => undefined,
}));
// Images toujours « chargées » : rien à attendre avant de jouer
jest.unstable_mockModule('../js/arcade-sprites.js', () => ({
  devicePixelsPerUnit: () => 1,
  ArcadeSprite: class {},
  spriteFor: spec => ({ spec }),
  fitRect: (_fit, box) => box,
  prefetchArcadeSprite: () => undefined,
  drawArcadeSprite: () => true,
}));

const { startMultiplicationInvasion } = await import('../js/arcade-invasion.js');
const { stopArcadeMode } = await import('../js/arcade.js');
const { gameState } = await import('../js/game.js');

const bench = createInvasionBench();
const { play, labels, expectedAnswer, shootAt } = bench;

/** Score et vies envoyés au bandeau en dernier (0 point et 3 vies avant le premier coup) */
function shown() {
  const last = updateInfoBar.mock.calls.at(-1)?.[0];
  return { score: last?.score ?? 0, lives: last?.lives ?? 3 };
}

/** Abat un monstre qui porte une mauvaise réponse */
function hitMonster() {
  const answer = expectedAnswer();
  const target = labels().find(label => label.value !== answer);
  const before = shown().score;
  shootAt(target.x);
  for (let i = 0; i < 120 && shown().score === before; i++) play(1);
}

/** Tire sur l'ami (la bonne réponse), puis laisse son apparition se terminer */
function hitFriend() {
  const target = labels().find(label => label.value === expectedAnswer());
  const before = shown().lives;
  shootAt(target.x);
  for (let i = 0; i < 120 && shown().lives === before; i++) play(1);
  play(40);
}

function startGame(difficulty) {
  gameState.difficulty = difficulty;
  bench.mountGameScreen();
  startMultiplicationInvasion();
  placeCanvasAtOrigin(document.getElementById('arcade-canvas'));
  play(1);
}

beforeEach(() => {
  bench.reset();
  updateInfoBar.mockClear();
  showArcadePoints.mockClear();
  saveArcadeScore.mockClear();
  HTMLCanvasElement.prototype.getContext = () => bench.context();
  jest.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(bench.schedule);
  jest.useFakeTimers({ doNotFake: ['requestAnimationFrame', 'performance'] });
});

afterEach(() => {
  stopArcadeMode();
  gameState.difficulty = undefined;
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('MultiInvaders : les points', () => {
  test('un monstre abattu : 100 points, les vies ne bougent pas', () => {
    startGame();
    hitMonster();
    expect(shown()).toEqual({ score: 100, lives: 3 });
    expect(showArcadePoints).toHaveBeenCalledTimes(1);
    expect(showArcadePoints.mock.calls[0][0]).toBe(100);
    hitMonster();
    expect(shown()).toEqual({ score: 200, lives: 3 });
  });

  test.each([
    [undefined, 50],
    ['debutant', 50],
    ['moyen', 75],
    ['difficile', 100],
  ])('tir sur l’ami, niveau %s : %i points de moins et une vie de moins', (level, penalty) => {
    startGame(level);
    hitMonster();
    hitMonster();
    hitFriend();
    expect(shown()).toEqual({ score: 200 - penalty, lives: 2 });
  });

  test('sans point au compteur, le tir sur l’ami ne retire qu’une vie : le score reste à 0', () => {
    startGame('moyen');
    hitFriend();
    expect(shown()).toEqual({ score: 0, lives: 2 });
  });

  test('la pénalité ne retire jamais plus que le score : 100, puis 25, puis 0', () => {
    startGame('moyen');
    hitMonster();
    hitFriend();
    expect(shown()).toEqual({ score: 25, lives: 2 });
    hitFriend();
    expect(shown()).toEqual({ score: 0, lives: 1 });
  });
});

describe('MultiInvaders : le score remis à l’écran de fin', () => {
  test('« Abandonner » : le score de la partie est enregistré et affiché', () => {
    startGame();
    hitMonster();
    hitMonster();
    hitMonster();
    document.getElementById('arcade-abandon-btn').click();
    expect(saveArcadeScore).toHaveBeenCalledTimes(1);
    expect(saveArcadeScore.mock.calls[0].slice(0, 3)).toEqual([300, 'invasion', '×']);
    expect(document.querySelector('.arcade-final-score').textContent).toContain('300');
  });

  test('vies épuisées : la partie s’arrête, son score est enregistré et affiché', () => {
    startGame();
    hitMonster();
    hitMonster();
    hitMonster();
    hitFriend();
    hitFriend();
    expect(saveArcadeScore).not.toHaveBeenCalled();
    hitFriend();
    expect(shown()).toEqual({ score: 150, lives: 0 });
    play(2);
    jest.advanceTimersByTime(700);
    expect(saveArcadeScore).toHaveBeenCalledTimes(1);
    expect(saveArcadeScore.mock.calls[0].slice(0, 3)).toEqual([150, 'invasion', '×']);
    expect(document.querySelector('.arcade-final-score').textContent).toContain('150');
  });
});
