/**
 * MultiSnake au doigt : le serpent suit un glissement, et un toucher compte même quand
 * le doigt tremble un peu ou reste posé (un vrai doigt n'est jamais immobile).
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import {
  fakeCanvasContext,
  placeCanvasAtOrigin,
  swipe,
  tap,
  touchEvent,
} from './helpers/touch-test-helpers.mjs';

jest.unstable_mockModule('../js/utils-es6.js', () => ({
  showArcadeMessage: jest.fn(),
  showArcadePoints: jest.fn(),
  getTranslation: key => key,
}));
jest.unstable_mockModule('../js/arcade.js', () => ({ showArcadeGameOver: jest.fn() }));
jest.unstable_mockModule('../js/arcade-points.js', () => ({ showArcadePenalty: jest.fn() }));
jest.unstable_mockModule('../js/game-cleanup.js', () => ({ cleanupGameResources: jest.fn() }));
jest.unstable_mockModule('../js/components/infoBar.js', () => ({
  InfoBar: { update: jest.fn() },
}));
jest.unstable_mockModule('../js/core/operation-stats.js', () => ({
  recordOperationResult: jest.fn(),
}));
jest.unstable_mockModule('../js/userManager.js', () => ({
  UserManager: { getCurrentUser: () => null },
}));
jest.unstable_mockModule('../js/core/tablePreferences.js', () => ({
  TablePreferences: { isGlobalEnabled: () => false, getActiveExclusions: () => [] },
}));
// Les leurres des pommes viennent des modes (GameMode) : trois pommes de plus, comme en jeu
jest.unstable_mockModule('../js/core/GameMode.js', () => ({
  plausibleWrongAnswers: ({ answer }) => [answer + 1, answer + 2, answer + 3],
}));

const { SnakeGame } = await import('../js/multisnake.js');

const UP = { x: 0, y: -1 };
const RIGHT = { x: 1, y: 0 };
const wait = ms => jest.advanceTimersByTime(ms);

let game;
let canvas;

/** Centre de la tête du serpent, en coordonnées de la fenêtre */
function headPoint() {
  const head = game.snake[0];
  return { x: (head.x + 0.5) * game.cellSize, y: (head.y + 0.5) * game.cellSize };
}

/** Point bien au-dessus de la tête, hors de la zone morte autour du serpent */
function aboveHead() {
  const head = headPoint();
  return { x: head.x, y: head.y - 3 * game.cellSize };
}

beforeEach(() => {
  jest.useFakeTimers();
  document.body.innerHTML =
    '<div id="game"><div class="arcade-game-ui"><canvas id="multisnake-canvas"></canvas></div></div>';
  HTMLCanvasElement.prototype.getContext = () => fakeCanvasContext();
  canvas = document.getElementById('multisnake-canvas');
  game = new SnakeGame('multisnake-canvas', 'operation', { operator: '×' });
  placeCanvasAtOrigin(canvas);
  // Le serpent part vers la droite
  expect(game.direction).toEqual(RIGHT);
});

afterEach(() => {
  game.cleanup();
  jest.useRealTimers();
});

describe('MultiSnake : glissement du doigt', () => {
  test('un glissement vers le haut fait monter le serpent', () => {
    const start = { x: 100, y: 200 };
    swipe(canvas, start, { x: start.x + 3, y: start.y - 60 });
    expect(game.nextDirection).toEqual(UP);
  });

  test('un glissement vers la gauche ne fait pas faire demi-tour au serpent', () => {
    const start = { x: 200, y: 200 };
    swipe(canvas, start, { x: start.x - 60, y: start.y });
    expect(game.nextDirection).toEqual(RIGHT);
  });

  test('le serpent suit le doigt pendant un même glissement : haut, puis gauche', () => {
    canvas.dispatchEvent(touchEvent('touchstart', { x: 200, y: 300 }));
    canvas.dispatchEvent(touchEvent('touchmove', { x: 201, y: 260 }));
    expect(game.nextDirection).toEqual(UP);
    // Le serpent avance d'une case vers le haut ; le doigt, toujours posé, part à gauche
    game.direction = game.nextDirection;
    canvas.dispatchEvent(touchEvent('touchmove', { x: 160, y: 258 }));
    canvas.dispatchEvent(touchEvent('touchend', { x: 160, y: 258 }));
    expect(game.nextDirection).toEqual({ x: -1, y: 0 });
  });
});

describe('MultiSnake : toucher au-dessus, en dessous ou à côté du serpent', () => {
  test('un toucher bref et immobile au-dessus de la tête fait monter le serpent', () => {
    tap(canvas, aboveHead());
    expect(game.nextDirection).toEqual(UP);
  });

  test('un toucher dont le doigt tremble de 2 px compte encore', () => {
    tap(canvas, aboveHead(), { jitter: 2 });
    expect(game.nextDirection).toEqual(UP);
  });

  test('un toucher qui dure 400 ms compte encore', () => {
    tap(canvas, aboveHead(), { holdMs: 400, wait });
    expect(game.nextDirection).toEqual(UP);
  });

  test('un toucher sur la tête même ne change rien (direction ambiguë)', () => {
    tap(canvas, headPoint());
    expect(game.nextDirection).toEqual(RIGHT);
  });
});
