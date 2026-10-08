/**
 * MultiSnake, caractérisation du comportement actuel : flèches du clavier, pas du serpent
 * (passage d'un bord à l'autre, collision avec lui-même), pommes mangées (bonne, mauvaise),
 * focus au lancement et position dessinée entre deux cases. Ces tests figent le jeu tel
 * qu'il est, pour découper ses fonctions sans rien y changer.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { fakeCanvasContext } from './helpers/touch-test-helpers.mjs';

const showArcadePoints = jest.fn();
const showArcadePenalty = jest.fn();
const recordOperationResult = jest.fn();
const noteArcadePlay = jest.fn();
const updateBar = jest.fn();

jest.unstable_mockModule('../js/utils-es6.js', () => ({
  showArcadeMessage: jest.fn(),
  showArcadePoints,
  getTranslation: key => key,
}));
jest.unstable_mockModule('../js/arcade.js', () => ({ showArcadeGameOver: jest.fn() }));
jest.unstable_mockModule('../js/arcade-points.js', () => ({ showArcadePenalty }));
jest.unstable_mockModule('../js/game-cleanup.js', () => ({ cleanupGameResources: jest.fn() }));
jest.unstable_mockModule('../js/components/infoBar.js', () => ({ InfoBar: { update: updateBar } }));
jest.unstable_mockModule('../js/core/operation-stats.js', () => ({ recordOperationResult }));
jest.unstable_mockModule('../js/arcade-session.js', () => ({ noteArcadePlay }));
jest.unstable_mockModule('../js/userManager.js', () => ({
  UserManager: { getCurrentUser: () => null },
}));
jest.unstable_mockModule('../js/core/tablePreferences.js', () => ({
  TablePreferences: { isGlobalEnabled: () => false, getActiveExclusions: () => [] },
}));
jest.unstable_mockModule('../js/core/GameMode.js', () => ({
  plausibleWrongAnswers: ({ answer }) => [answer + 1, answer + 2, answer + 3],
}));

const { SnakeGame } = await import('../js/multisnake.js');

const RIGHT = { x: 1, y: 0 };
const UP = { x: 0, y: -1 };
let game;

/** Partie figée sur une grille 14 × 11 : le serpent ne bouge que pas à pas */
function frozenGame() {
  game = new SnakeGame('multisnake-canvas', 'operation', { operator: '×' });
  game.start();
  cancelAnimationFrame(game.animationId);
  game.multisnake = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
  ];
  game.snake = game.multisnake;
  game.numberPositions = [];
  return game;
}

/** Appui sur une touche, avec l'action par défaut observable */
function press(key) {
  const event = new KeyboardEvent('keydown', { key, cancelable: true });
  game.handleKeyDown(event);
  return event;
}

beforeEach(() => {
  jest.useFakeTimers();
  HTMLCanvasElement.prototype.getContext = () => fakeCanvasContext();
  document.body.replaceChildren();
  const stage = document.createElement('div');
  stage.className = 'arcade-game-ui';
  const canvas = document.createElement('canvas');
  canvas.id = 'multisnake-canvas';
  canvas.tabIndex = 0;
  stage.append(canvas);
  document.body.append(stage);
  for (const mock of [showArcadePoints, showArcadePenalty, recordOperationResult, noteArcadePlay])
    mock.mockClear();
  frozenGame();
});

afterEach(() => {
  game.cleanup();
  jest.useRealTimers();
});

describe('MultiSnake : flèches du clavier', () => {
  test('une flèche qui tourne prend la direction, sans faire défiler la page', () => {
    const event = press('ArrowUp');
    expect(game.nextDirection).toEqual(UP);
    expect(event.defaultPrevented).toBe(true);
  });

  test('une flèche qui ferait faire demi-tour est ignorée (mais ne fait pas défiler)', () => {
    const event = press('ArrowLeft');
    expect(game.nextDirection).toEqual(RIGHT);
    expect(event.defaultPrevented).toBe(true);
    game.direction = UP;
    press('ArrowDown');
    expect(game.nextDirection).toEqual(RIGHT);
  });

  test('chaque flèche permise donne sa direction', () => {
    game.direction = UP;
    press('ArrowLeft');
    expect(game.nextDirection).toEqual({ x: -1, y: 0 });
    press('ArrowRight');
    expect(game.nextDirection).toEqual(RIGHT);
    game.direction = RIGHT;
    press('ArrowDown');
    expect(game.nextDirection).toEqual({ x: 0, y: 1 });
  });

  test('l’enfant change d’avis dans le même pas : la dernière flèche permise l’emporte', () => {
    game.direction = UP;
    press('ArrowLeft');
    press('ArrowUp');
    expect(game.nextDirection).toEqual(UP);
  });

  test('Espace relance une partie finie, et seulement elle', () => {
    const start = jest.spyOn(game, 'start').mockImplementation(() => {});
    expect(press(' ').defaultPrevented).toBe(true);
    expect(start).not.toHaveBeenCalled();
    game.gameOver = true;
    press(' ');
    expect(start).toHaveBeenCalledTimes(1);
  });

  test('une autre touche ne fait rien', () => {
    const event = press('a');
    expect(event.defaultPrevented).toBe(false);
    expect(game.nextDirection).toEqual(RIGHT);
  });
});

describe('MultiSnake : un pas du serpent', () => {
  test('il avance d’une case, la queue suit', () => {
    game.updateGameLogic();
    expect(game.multisnake).toEqual([
      { x: 6, y: 5 },
      { x: 5, y: 5 },
    ]);
    expect(updateBar).toHaveBeenCalled();
  });

  test('il passe d’un bord à l’autre', () => {
    game.multisnake.splice(0, 2, { x: game.cols - 1, y: 0 }, { x: game.cols - 2, y: 0 });
    game.updateGameLogic();
    expect(game.multisnake[0]).toEqual({ x: 0, y: 0 });
    game.nextDirection = UP;
    game.updateGameLogic();
    expect(game.multisnake[0]).toEqual({ x: 0, y: game.rows - 1 });
  });

  test('il se mord : une vie de moins', () => {
    game.multisnake.splice(
      0,
      2,
      { x: 5, y: 5 },
      { x: 5, y: 6 },
      { x: 6, y: 6 },
      { x: 6, y: 5 },
      { x: 7, y: 5 }
    );
    game.updateGameLogic();
    expect(game.lives).toBe(2);
  });

  test('partie finie : rien ne bouge', () => {
    game.gameOver = true;
    game.updateGameLogic();
    expect(game.multisnake[0]).toEqual({ x: 5, y: 5 });
  });
});

describe('MultiSnake : pommes mangées', () => {
  test('la bonne pomme : 100 points, le serpent grandit, un autre calcul, plus vite', () => {
    const { num1, num2 } = game.currentOperation;
    game.numberPositions = [{ x: 6, y: 5, value: 7, isCorrect: true }];
    const generate = jest.spyOn(game, 'generateOperation');
    game.updateGameLogic();
    expect(game.score).toBe(100);
    expect(game.multisnake).toHaveLength(3);
    expect(game.multisnake[0]).toEqual({ x: 6, y: 5 });
    expect(game.moveInterval).toBe(game.initialSpeed - game.speedIncrement);
    expect(noteArcadePlay).toHaveBeenCalledTimes(1);
    expect(recordOperationResult).toHaveBeenCalledWith('×', num1, num2, true);
    expect(showArcadePoints).toHaveBeenCalledWith(100, game.canvas, game.cellPoint({ x: 6, y: 5 }));
    expect(generate).toHaveBeenCalledTimes(1);
    expect(game.numberPositions).toHaveLength(4);
  });

  test('une mauvaise pomme : au plus 50 points retirés, la pomme part, le serpent attend', () => {
    game.score = 30;
    game.numberPositions = [
      { x: 6, y: 5, value: 9, isCorrect: false },
      { x: 2, y: 2, value: 7, isCorrect: true },
    ];
    game.updateGameLogic();
    expect(game.score).toBe(0);
    expect(showArcadePenalty).toHaveBeenCalledWith(30, game.canvas, game.cellPoint({ x: 6, y: 5 }));
    expect(recordOperationResult).toHaveBeenCalledWith(
      '×',
      game.currentOperation.num1,
      game.currentOperation.num2,
      false
    );
    expect(game.numberPositions).toEqual([{ x: 2, y: 2, value: 7, isCorrect: true }]);
    // Ce pas-là, le serpent ne bouge pas
    expect(game.multisnake).toEqual([
      { x: 5, y: 5 },
      { x: 4, y: 5 },
    ]);
  });
});

describe('MultiSnake : focus et dessin', () => {
  test('au lancement, le plateau prend le focus', () => {
    expect(document.activeElement).toBe(game.canvas);
  });

  test('entre deux cases, chaque segment est dessiné à mi-chemin, bord franchi compris', () => {
    const draw = jest.spyOn(game, 'drawSnakeAtPositions').mockImplementation(() => {});
    game.multisnake = [
      { x: 0, y: 5 },
      { x: game.cols - 1, y: 5 },
    ];
    game.lastPositions = [
      { x: game.cols - 1, y: 5 },
      { x: game.cols - 2, y: 5 },
    ];
    game.animationProgress = 0.5;
    game.drawSnake();
    expect(draw).toHaveBeenCalledWith([
      { x: game.cols - 0.5, y: 5 },
      { x: game.cols - 1.5, y: 5 },
    ]);
    game.animationProgress = 1;
    game.drawSnake();
    expect(draw).toHaveBeenLastCalledWith(game.multisnake);
  });
});

describe('MultiSnake : dessin du corps', () => {
  const DIRS = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ];
  // Virage du corps pour chaque paire de directions (entrée, sortie), dans les deux sens
  const CURVES = new Map([
    ['0,-1|1,0', 'haut-droite'],
    ['1,0|0,-1', 'haut-droite'],
    ['1,0|0,1', 'droite-bas'],
    ['0,1|1,0', 'droite-bas'],
    ['0,1|-1,0', 'bas-gauche'],
    ['-1,0|0,1', 'bas-gauche'],
    ['-1,0|0,-1', 'gauche-haut'],
    ['0,-1|-1,0', 'gauche-haut'],
  ]);

  test('chaque virage a son image, une ligne droite ou un demi-tour aucune', () => {
    for (const dirIn of DIRS) {
      for (const dirOut of DIRS) {
        const key = `${dirIn.x},${dirIn.y}|${dirOut.x},${dirOut.y}`;
        expect({ key, curve: game.getCurveKey(dirIn, dirOut) }).toEqual({
          key,
          curve: CURVES.get(key) ?? null,
        });
      }
    }
  });

  test('directions d’un segment vers ses voisins, par le bord opposé compris', () => {
    const last = game.cols - 1;
    expect(game.calculateSegmentDirections({ x: 6, y: 5 }, { x: 5, y: 5 }, { x: 5, y: 6 })).toEqual(
      { dirIn: { x: 0, y: 1 }, dirOut: { x: 1, y: 0 } }
    );
    // Voisin de l'autre côté du plateau : un pas vers le bord franchi
    expect(
      game.calculateSegmentDirections({ x: 1, y: 5 }, { x: 0, y: 5 }, { x: last, y: 5 })
    ).toEqual({ dirIn: { x: -1, y: 0 }, dirOut: { x: 1, y: 0 } });
    expect(
      game.calculateSegmentDirections({ x: 3, y: game.rows - 1 }, { x: 3, y: 0 }, { x: 3, y: 1 })
    ).toEqual({ dirIn: { x: 0, y: 1 }, dirOut: { x: 0, y: -1 } });
  });
});
