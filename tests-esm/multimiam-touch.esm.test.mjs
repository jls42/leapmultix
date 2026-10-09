/**
 * MultiMiam au doigt : le glissement dirige le personnage, et toucher à côté de lui le
 * dirige aussi (aide du menu), même quand le doigt tremble un peu ou reste posé.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { placeCanvasAtOrigin, swipe, tap } from './helpers/touch-test-helpers.mjs';

const { initPacmanControls } = await import('../js/multimiam-controls.js');

const CELL = 20;
const wait = ms => jest.advanceTimersByTime(ms);

let game;
let canvas;

/** Point à `cells` cases du personnage, dans la direction donnée (coordonnées de la fenêtre) */
function besideFox(dx, dy, cells = 3) {
  const { x, y } = game.multimiam;
  return { x: (x + 0.5 + dx * cells) * CELL, y: (y + 0.5 + dy * cells) * CELL };
}

beforeEach(() => {
  jest.useFakeTimers();
  document.body.innerHTML = '<canvas id="multimiam-canvas" width="300" height="300"></canvas>';
  canvas = document.getElementById('multimiam-canvas');
  placeCanvasAtOrigin(canvas);
  // Personnage au milieu d'un labyrinthe ouvert, déjà en route vers la droite
  game = {
    canvas,
    cellSize: CELL,
    cellWidth: CELL,
    cellHeight: CELL,
    boardWidth: 300,
    boardHeight: 300,
    gameOver: false,
    multimiam: { x: 7, y: 7, direction: 'RIGHT', nextDirection: 'RIGHT', isMoving: true },
    canMove: () => true,
  };
  initPacmanControls(game);
});

afterEach(() => {
  jest.useRealTimers();
});

describe('MultiMiam : glissement du doigt', () => {
  test('un glissement vers le haut dirige le personnage vers le haut', () => {
    swipe(canvas, { x: 100, y: 200 }, { x: 102, y: 150 });
    expect(game.multimiam.nextDirection).toBe('UP');
  });
});

describe('MultiMiam : toucher à côté du personnage', () => {
  test('un toucher bref et immobile à sa gauche le dirige vers la gauche', () => {
    tap(canvas, besideFox(-1, 0));
    expect(game.multimiam.nextDirection).toBe('LEFT');
  });

  test('un toucher dont le doigt tremble de 2 px compte encore', () => {
    tap(canvas, besideFox(-1, 0), { jitter: 2 });
    expect(game.multimiam.nextDirection).toBe('LEFT');
  });

  test('un toucher qui dure 400 ms compte encore', () => {
    tap(canvas, besideFox(0, 1), { holdMs: 400, wait });
    expect(game.multimiam.nextDirection).toBe('DOWN');
  });

  test("un mur sur l'axe dominant : il part sur l'autre axe", () => {
    const { x, y } = game.multimiam;
    game.canMove = (nx, ny) => !(nx === x - 1 && ny === y);
    // Loin à gauche, un peu au-dessus : la gauche est murée, il monte
    const point = besideFox(-1, 0);
    tap(canvas, { x: point.x, y: point.y - CELL });
    expect(game.multimiam.nextDirection).toBe('UP');
  });

  test('aucune des deux directions possible : il tournera à la prochaine intersection', () => {
    game.canMove = () => false;
    tap(canvas, besideFox(-1, 0));
    expect(game.multimiam.nextDirection).toBe('LEFT');
  });
});
