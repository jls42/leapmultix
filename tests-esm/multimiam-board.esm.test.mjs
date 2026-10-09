/**
 * Plateau de MultiMiam : en portrait, le labyrinthe 19 × 15 se dessine transposé (15 × 19)
 * pour de plus grandes cases ; ses données et ses règles ne changent pas. Le dessin, le
 * doigt, la souris et les flèches suivent : un glissement vers le haut fait monter le
 * personnage à l'écran, un toucher à sa gauche l'envoie à gauche.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import {
  fakeCanvasContext,
  placeCanvasAtOrigin,
  swipe,
  tap,
} from './helpers/touch-test-helpers.mjs';
import {
  renderArcadeStage,
  simulateArcadeScreen,
  useAndroidUserAgent,
} from './helpers/arcade-screen-helpers.mjs';

jest.unstable_mockModule('../js/utils-es6.js', () => ({
  showArcadeMessage: jest.fn(),
  showArcadePoints: jest.fn(),
  getTranslation: key => key,
}));
jest.unstable_mockModule('../js/arcade.js', () => ({ showArcadeGameOver: jest.fn() }));
jest.unstable_mockModule('../js/arcade-points.js', () => ({ showArcadePenalty: jest.fn() }));
jest.unstable_mockModule('../js/game-cleanup.js', () => ({ cleanupGameResources: jest.fn() }));
jest.unstable_mockModule('../js/components/infoBar.js', () => ({
  InfoBar: { update: jest.fn(), renderLives: jest.fn() },
}));
jest.unstable_mockModule('../js/game.js', () => ({ gameState: { avatar: 'fox' } }));
jest.unstable_mockModule('../js/core/operation-stats.js', () => ({
  recordOperationResult: jest.fn(),
}));
jest.unstable_mockModule('../js/userManager.js', () => ({
  UserManager: { getCurrentUser: () => null },
}));
jest.unstable_mockModule('../js/core/tablePreferences.js', () => ({
  TablePreferences: { isGlobalEnabled: () => false, getActiveExclusions: () => [] },
}));

const { shouldTransposeMaze, mazeToScreen, transposeDirection } = await import(
  '../js/multimiam-layout.js'
);
const { initPacmanControls } = await import('../js/multimiam-controls.js');
const { default: PacmanRenderer } = await import('../js/multimiam-renderer.js');
const { PacmanGame } = await import('../js/multimiam.js');
const { showGameInstructions } = await import('../js/arcade-common.js');

const CELL = 20;
const restorers = [];

afterEach(() => {
  while (restorers.length) restorers.pop()();
  jest.useRealTimers();
});

describe('Orientation du labyrinthe', () => {
  test('transposé quand il y gagne de plus grandes cases (téléphone en portrait)', () => {
    expect(shouldTransposeMaze(19, 15, { width: 363, height: 555 })).toBe(true);
    expect(shouldTransposeMaze(19, 15, { width: 1234, height: 469 })).toBe(false);
    expect(shouldTransposeMaze(19, 15, { width: 620, height: 260 })).toBe(false);
  });

  test('case du labyrinthe ↔ case à l’écran : lignes et colonnes échangées', () => {
    expect(mazeToScreen(2, 1, true)).toEqual({ x: 1, y: 2 });
    expect(mazeToScreen(2, 1, false)).toEqual({ x: 2, y: 1 });
  });

  test('directions à l’écran ↔ dans le labyrinthe, aller et retour', () => {
    const pairs = [
      ['UP', 'LEFT'],
      ['LEFT', 'UP'],
      ['DOWN', 'RIGHT'],
      ['RIGHT', 'DOWN'],
    ];
    for (const [screen, maze] of pairs) {
      expect(transposeDirection(screen, true)).toBe(maze);
      expect(transposeDirection(transposeDirection(screen, true), true)).toBe(screen);
      expect(transposeDirection(screen, false)).toBe(screen);
    }
  });
});

describe('Labyrinthe transposé : le doigt et les flèches suivent l’écran', () => {
  let game;
  let canvas;

  /** Point de l'écran à `cells` cases du personnage, vu à l'écran */
  function besideOnScreen(dx, dy, cells = 3) {
    const at = mazeToScreen(game.multimiam.x, game.multimiam.y, true);
    return { x: (at.x + 0.5 + dx * cells) * CELL, y: (at.y + 0.5 + dy * cells) * CELL };
  }

  beforeEach(() => {
    jest.useFakeTimers();
    document.body.replaceChildren();
    canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 380;
    document.body.append(canvas);
    placeCanvasAtOrigin(canvas);
    game = {
      canvas,
      cellSize: CELL,
      transposed: true,
      gameOver: false,
      multimiam: { x: 7, y: 5, direction: 'RIGHT', nextDirection: 'RIGHT', isMoving: true },
      canMove: () => true,
    };
    initPacmanControls(game);
  });

  test('un glissement vers le haut de l’écran fait monter le personnage à l’écran', () => {
    swipe(canvas, { x: 100, y: 200 }, { x: 102, y: 150 });
    expect(transposeDirection(game.multimiam.nextDirection, true)).toBe('UP');
  });

  test('un toucher à sa gauche, à l’écran, l’envoie à gauche à l’écran', () => {
    tap(canvas, besideOnScreen(-1, 0));
    expect(transposeDirection(game.multimiam.nextDirection, true)).toBe('LEFT');
  });

  test('un toucher au-dessous de lui, à l’écran, l’envoie vers le bas à l’écran', () => {
    tap(canvas, besideOnScreen(0, 1));
    expect(transposeDirection(game.multimiam.nextDirection, true)).toBe('DOWN');
  });

  test('la flèche du haut le fait monter à l’écran', () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(transposeDirection(game.multimiam.nextDirection, true)).toBe('UP');
  });
});

describe('Labyrinthe transposé : le dessin suit', () => {
  test('le personnage est dessiné à la case transposée', () => {
    const renderer = new PacmanRenderer({ cellSize: CELL, transposed: true });
    expect(renderer.getPacmanPixelCoordinates(2, 1)).toEqual({ pixelX: 30, pixelY: 50 });
  });
});

describe('MultiMiam sur un téléphone de 390 × 844', () => {
  let game;

  beforeEach(() => {
    jest.useFakeTimers();
    HTMLCanvasElement.prototype.getContext = () => fakeCanvasContext();
    restorers.push(useAndroidUserAgent());
    restorers.push(simulateArcadeScreen({ width: 363, height: 844 }));
    renderArcadeStage('multimiam-canvas');
    game = new PacmanGame('multimiam-canvas', 2, 'operation', null, 0, '×');
    game.start();
    game.pause();
  });

  test('le plateau va jusqu’à « Abandonner », le labyrinthe centré dedans, à cases carrées', () => {
    // 844 − 175 − 48 − 4 (cadre) : toute la hauteur, comme les autres jeux ; le labyrinthe,
    // limité par la largeur (15 cases), garde sa taille et se centre entre deux bandes de mur
    expect(game.canvas.style.height).toBe('617px');
    expect(game.canvas.style.width).toBe(`${game.canvas.width}px`);
    expect(game.canvas.height).toBe(19 * game.cellSize);
    expect(game.canvas.style.objectFit).toBe('contain');
  });

  test('un toucher juste à droite du personnage, à l’écran, l’envoie à droite : bandes comptées', () => {
    // Murs ignorés : seul compte le point visé
    game.canMove = () => true;
    const cell = game.cellSize;
    const at = mazeToScreen(game.multimiam.x, game.multimiam.y, game.transposed);
    // Bande de mur au-dessus du labyrinthe, puis la case à droite du personnage
    const band = (Number.parseFloat(game.canvas.style.height) - game.canvas.height) / 2;
    tap(game.canvas, { x: (at.x + 1.5) * cell, y: 175 + band + (at.y + 0.5) * cell });
    expect(transposeDirection(game.multimiam.nextDirection, game.transposed)).toBe('RIGHT');
  });

  test('le labyrinthe se dessine en 15 colonnes sur 19 rangées, plus grandes cases', () => {
    expect(game.transposed).toBe(true);
    expect([game.cols, game.rows]).toEqual([19, 15]);
    expect(game.canvas.width).toBe(15 * game.cellSize);
    expect(game.canvas.height).toBe(19 * game.cellSize);
    // Non transposé, 363 px pour 19 colonnes ne donnaient que des cases de 19 px
    expect(game.cellSize).toBeGreaterThan(19);
  });

  /** Téléphone tourné : écran bas et large */
  function rotate() {
    restorers.push(simulateArcadeScreen({ width: 620, height: 390, top: 120 }));
    globalThis.dispatchEvent(new Event('resize'));
    jest.advanceTimersByTime(50);
  }

  test('partie nettoyée (Accueil), canevas resté dans la page : un changement d’écran ne fait rien', () => {
    // Ce que fait cleanupGameResources (js/game-cleanup.js) en quittant la partie
    game.canvas = null;
    globalThis.dispatchEvent(new Event('resize'));
    expect(() => jest.advanceTimersByTime(50)).not.toThrow();
  });

  test('rien n’est encore joué : le labyrinthe suit le téléphone tourné', () => {
    rotate();
    expect(game.transposed).toBe(false);
    expect(game.canvas.width).toBe(19 * game.cellSize);
  });

  test('le téléphone tourné en pleine partie : le dessin suit, la partie reste', () => {
    // Partie entamée : une bonne réponse croquée
    game.score = 100;
    game.goodAnswersCount = 1;
    const before = { x: game.multimiam.x, y: game.multimiam.y };
    rotate();
    expect(game.transposed).toBe(true);
    expect({ x: game.multimiam.x, y: game.multimiam.y }).toEqual(before);
    expect(game.canvas.height).toBeLessThanOrEqual(220);
  });
});

describe('MultiMiam sur ordinateur, la consigne posée sur le labyrinthe', () => {
  test('le plateau va jusqu’à « Abandonner », comme les autres jeux', () => {
    jest.useFakeTimers();
    HTMLCanvasElement.prototype.getContext = () => fakeCanvasContext();
    restorers.push(simulateArcadeScreen({ width: 1234, height: 800, top: 202 }));
    renderArcadeStage('multimiam-canvas');
    const game = new PacmanGame('multimiam-canvas', 2, 'operation', null, 0, '×');
    game.start();
    game.pause();
    // 800 − 202 − 48 − 4 (cadre) : le labyrinthe (15 rangées de cases entières) y tient à
    // moins d'une case près
    expect(game.canvas.style.height).toBe('546px');
    expect(546 - game.canvas.height).toBeLessThan(game.cellSize);
  });

  test('la consigne qui part ne change rien : même labyrinthe à 1 s et à 7 s', () => {
    jest.useFakeTimers();
    HTMLCanvasElement.prototype.getContext = () => fakeCanvasContext();
    restorers.push(simulateArcadeScreen({ width: 1234, height: 800, top: 202 }));
    // Comme au lancement (js/arcade-multimiam.js) : la consigne, puis le jeu
    const { canvas } = renderArcadeStage('multimiam-canvas');
    showGameInstructions(canvas, 'Utilise les flèches du clavier');
    const game = new PacmanGame('multimiam-canvas', 2, 'operation', null, 0, '×');
    game.start();
    game.pause();
    const labyrinthe = () => ({
      cellSize: game.cellSize,
      internal: [canvas.width, canvas.height],
      shown: [canvas.style.width, canvas.style.height],
    });
    jest.advanceTimersByTime(1000);
    const at1s = labyrinthe();
    jest.advanceTimersByTime(6000);
    expect(document.querySelector('.game-instructions').hidden).toBe(true);
    expect(labyrinthe()).toEqual(at1s);
  });
});

describe('Labyrinthe transposé : la pastille de points se pose sur la bonne case', () => {
  test('les points gagnés apparaissent au-dessus de la réponse croquée, à l’écran', async () => {
    const { showArcadePoints } = await import('../js/utils-es6.js');
    const { initPacmanEngine } = await import('../js/multimiam-engine.js');
    const canvas = document.createElement('canvas');
    const game = {
      operator: '×',
      currentOperation: { num1: 2, num2: 4 },
      multimiam: { x: 3, y: 1 },
      answerPositions: [{ x: 3, y: 1, value: 8, isCorrect: true }],
      labyrinth: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      canvas,
      cellSize: CELL,
      transposed: true,
      score: 0,
      goodAnswersCount: 0,
      updateUI: jest.fn(),
      checkAndActivateGhost: jest.fn(),
      generateOperation: jest.fn(),
    };
    initPacmanEngine(game);
    game.checkAnswerCollision();
    // Case (3, 1) du labyrinthe : colonne 1, rangée 3 à l'écran
    expect(showArcadePoints).toHaveBeenCalledWith(100, canvas, { x: 1.5 * CELL, y: 3 * CELL });
  });
});
