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

const drawSnakeScene = jest.fn(() => ({ heading: 0 }));
jest.unstable_mockModule('../js/multisnake-renderer.js', () => ({ drawSnakeScene }));

const { SnakeGame } = await import('../js/multisnake.js');
const { SEASONS, wearSeason } = await import('../js/core/seasons.js');
const { snakeSkin } = await import('../js/multisnake-skins.js');

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

  test('entre deux cases, le serpent est dessiné à mi-chemin, bord franchi compris', () => {
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
    // D'un seul tenant : la tête sort à gauche, le corps la suit au-delà du bord
    expect(drawSnakeScene.mock.lastCall[1].centerline).toEqual([
      { x: -0.5, y: 5 },
      { x: -1, y: 5 },
      { x: -1.5, y: 5 },
    ]);
    game.animationProgress = 1;
    game.drawSnake();
    expect(drawSnakeScene.mock.lastCall[1].centerline).toEqual([
      { x: 0, y: 5 },
      { x: -1, y: 5 },
    ]);
  });

  test('après chaque pas, la direction de la tête est publiée sur le plateau', () => {
    expect(game.canvas.dataset.snakeHeading).toBe('right');
    press('ArrowUp');
    game.updateGameLogic();
    expect(game.canvas.dataset.snakeHeading).toBe('up');
    expect(Number.isFinite(Number(game.canvas.dataset.snakeHeadY))).toBe(true);
  });

  test('une bonne pomme avalée descend le long du corps', () => {
    game.eatGoodApple({ x: 6, y: 5 }, { x: 6, y: 5, isCorrect: true });
    expect(game.swallowedApples()).toEqual([0.6]);
    game.clock += 1000;
    expect(game.swallowedApples()[0]).toBeCloseTo(6.6);
    // Arrivée au bout de tout serpent : oubliée
    game.clock += 20000;
    expect(game.swallowedApples()).toEqual([]);
  });
});

describe('MultiSnake : habit du serpent', () => {
  afterEach(() => wearSeason(null));

  test('sans fête, le serpent vert ; au Nouvel An chinois, le dragon', () => {
    expect(game.skin).toBe(snakeSkin(null));
    wearSeason(SEASONS.find(season => season.id === 'lunarnewyear'));
    expect(frozenGame().skin).toBe(snakeSkin('lunarnewyear'));
  });

  test('une fête qui ne costume pas le serpent le laisse vert', () => {
    wearSeason(Object.freeze({ id: 'lunarnewyear', costumes: Object.freeze(['heads']) }));
    expect(frozenGame().skin).toBe(snakeSkin(null));
  });
});
