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

const noop = () => undefined;
const updateInfoBar = jest.fn();
const showArcadePoints = jest.fn();
const saveArcadeScore = jest.fn();
jest.unstable_mockModule('../js/utils-es6.js', () => ({
  addArrowKeyNavigation: noop,
  startBackgroundRotation: noop,
  updateBackgroundByAvatar: noop,
  updateCoinDisplay: noop,
  updateWelcomeMessageUI: noop,
  getDailyChallengeTable: () => '3',
  showMessage: noop,
  getTranslation: k => k,
  cleanupGameResources: noop,
  speak: noop,
  isVoiceEnabled: () => false,
  playSound: noop,
  showArcadePoints,
  updateInfoBar,
  showArcadeMessage: noop,
  saveArcadeScore,
  getArcadeScores: () => [],
  resetArcadeScores: noop,
  saveArcadeScoreSnake: noop,
  getArcadeScoresSnake: () => [],
  resetArcadeScoresSnake: noop,
  saveArcadeScorePacman: noop,
  getArcadeScoresPacman: () => [],
  resetArcadeScoresPacman: noop,
  saveArcadeScoreMemory: noop,
  getArcadeScoresMemory: () => [],
  resetArcadeScoresMemory: noop,
}));
jest.unstable_mockModule('../js/slides.js', () => ({ goToSlide: noop }));
jest.unstable_mockModule('../js/mode-orchestrator.js', () => ({ setGameMode: async () => {} }));
jest.unstable_mockModule('../js/core/audio.js', () => ({
  AudioManager: { stopAll: noop, playSound: noop },
}));
jest.unstable_mockModule('../js/core/operation-stats.js', () => ({
  recordOperationResult: noop,
}));
// Images toujours « chargées » : rien à attendre avant de jouer
jest.unstable_mockModule('../js/arcade-sprites.js', () => ({
  devicePixelsPerUnit: () => 1,
  ArcadeSprite: class {},
  spriteFor: spec => ({ spec }),
  fitRect: (_fit, box) => box,
  prefetchArcadeSprite: noop,
  drawArcadeSprite: () => true,
}));

const { startMultiplicationInvasion } = await import('../js/arcade-invasion.js');
const { stopArcadeMode } = await import('../js/arcade.js');
const { gameState } = await import('../js/game.js');

/** Ce que la dernière image a dessiné */
let frame = [];
let nextFrame = null;
let clock = 0;

/** Contexte 2D qui note chaque dessin */
function recordingContext() {
  return new Proxy(
    {},
    {
      get: (target, prop) => {
        if (prop in target) return Reflect.get(target, prop);
        return (...args) => {
          frame.push({ op: prop, args });
          return { width: 10 };
        };
      },
      set: (target, prop, value) => Reflect.set(target, prop, value),
    }
  );
}

/** Avance le jeu de `count` images de 1/60 s */
function play(count) {
  for (let i = 0; i < count && nextFrame; i++) {
    const callback = nextFrame;
    nextFrame = null;
    frame = [];
    clock += 1000 / 60;
    callback(clock);
  }
}

/** Nombres portés par les monstres dessinés à la dernière image, avec leur abscisse */
const labels = () =>
  frame.filter(d => d.op === 'fillText').map(d => ({ value: Number(d.args[0]), x: d.args[1] }));

/** Réponse attendue, lue dans le bandeau (« 7 × 5 = ? ») */
function expectedAnswer() {
  const text = document.querySelector('.arcade-question')?.textContent ?? '';
  const [a, b] = text.match(/\d+/g).map(Number);
  return a * b;
}

/** Score et vies envoyés au bandeau en dernier (0 point et 3 vies avant le premier coup) */
function shown() {
  const last = updateInfoBar.mock.calls.at(-1)?.[0];
  return { score: last?.score ?? 0, lives: last?.lives ?? 3 };
}

/** Vise l'abscisse du plateau donnée, et tire */
function shootAt(x) {
  const canvas = document.getElementById('arcade-canvas');
  canvas.dispatchEvent(new MouseEvent('mousemove', { clientX: x, clientY: 10, bubbles: true }));
  canvas.dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: x, bubbles: true }));
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
  const game = document.createElement('div');
  game.id = 'game';
  document.body.replaceChildren(game);
  startMultiplicationInvasion();
  placeCanvasAtOrigin(document.getElementById('arcade-canvas'));
  play(1);
}

beforeEach(() => {
  frame = [];
  nextFrame = null;
  clock = 0;
  updateInfoBar.mockClear();
  showArcadePoints.mockClear();
  saveArcadeScore.mockClear();
  HTMLCanvasElement.prototype.getContext = () => recordingContext();
  jest.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(callback => {
    nextFrame = callback;
    return 1;
  });
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
