/**
 * Plateau de MultiMiam : en portrait, le labyrinthe 19 × 15 se dessine transposé (15 × 19),
 * avec des cases presque carrées (au plus 1,25 fois plus hautes que larges, ou l'inverse)
 * qui remplissent le plateau jusqu'à « Abandonner » ; ses données et ses règles ne changent
 * pas. Le dessin, le doigt, la souris et les flèches suivent : un glissement vers le haut
 * fait monter le personnage à l'écran, un toucher sur la case voisine l'y envoie, et les
 * personnages restent dans un carré, jamais déformés.
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

const { chooseMazeLayout, fitMazeCells, mazeToScreen, transposeDirection } = await import(
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

describe('Orientation et cases du labyrinthe', () => {
  test('téléphone en portrait : transposé, cases de 24 × 30 qui remplissent 360 × 571', () => {
    expect(chooseMazeLayout(19, 15, { width: 360, height: 571 })).toEqual({
      transposed: true,
      cellWidth: 24,
      cellHeight: 30,
    });
  });

  test('ordinateur et téléphone tourné : droit, cases plus larges que hautes', () => {
    expect(chooseMazeLayout(19, 15, { width: 1234, height: 546 })).toEqual({
      transposed: false,
      cellWidth: 45,
      cellHeight: 36,
    });
    expect(chooseMazeLayout(19, 15, { width: 620, height: 260 })).toEqual({
      transposed: false,
      cellWidth: 21,
      cellHeight: 17,
    });
  });

  test('une case reste presque carrée (rapport de 1,25 au plus) et le labyrinthe tient', () => {
    const faults = [];
    for (let width = 200; width <= 1400; width += 37) {
      for (let height = 160; height <= 900; height += 29) {
        for (const [across, down] of [
          [19, 15],
          [15, 19],
        ]) {
          const { cellWidth, cellHeight } = fitMazeCells(across, down, { width, height });
          const stretch = Math.max(cellWidth, cellHeight) / Math.min(cellWidth, cellHeight);
          const fits = across * cellWidth <= width && down * cellHeight <= height;
          if (stretch > 1.25 || !fits)
            faults.push({ width, height, across, cellWidth, cellHeight });
        }
      }
    }
    expect(faults).toEqual([]);
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
      cellWidth: CELL,
      cellHeight: CELL,
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
    const renderer = new PacmanRenderer({
      cellSize: CELL,
      cellWidth: CELL,
      cellHeight: CELL,
      transposed: true,
    });
    expect(renderer.getPacmanPixelCoordinates(2, 1)).toEqual({ pixelX: 30, pixelY: 50 });
  });

  test('cases de 24 × 30 : centre de la case, et personnage dans un carré, jamais déformé', () => {
    const renderer = new PacmanRenderer({
      cellSize: 24,
      cellWidth: 24,
      cellHeight: 30,
      transposed: true,
    });
    // Case (2, 1) du labyrinthe : colonne 1, rangée 2 à l'écran
    expect(renderer.getPacmanPixelCoordinates(2, 1)).toEqual({ pixelX: 36, pixelY: 75 });
    const box = renderer.spriteBox(36, 75);
    expect([box.width, box.height]).toEqual([36, 36]);
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

  test('le plateau va jusqu’à « Abandonner » et le labyrinthe grandit : cases plus hautes que larges', () => {
    // 844 − 175 − 48 − 4 (cadre) : toute la hauteur, comme les autres jeux
    expect(game.canvas.style.height).toBe('617px');
    // 15 cases de large sur 359 px : 23 px ; en hauteur, la case s'allonge jusqu'à 1,25 fois
    expect([game.cellWidth, game.cellHeight]).toEqual([23, 28]);
    expect([game.canvas.width, game.canvas.height]).toEqual([15 * 23, 19 * 28]);
    expect(game.cellSize).toBe(23);
  });

  test('un toucher sur une case voisine, bandes de mur comprises, y envoie le personnage', () => {
    // Murs ignorés ; personnage en bas du plateau ; zone de jeu en haut à 175 px
    game.canMove = () => true;
    Object.assign(game.multimiam, { x: 12, y: 7 });
    // Le labyrinthe (19 × 28 px) laisse une bande de mur en haut et en bas du plateau
    const band = (Number.parseFloat(game.canvas.style.height) - game.boardHeight) / 2;
    expect(band).toBeGreaterThan(30);
    const aimed = [
      [1, 0, 'RIGHT'],
      [-1, 0, 'LEFT'],
      [0, 1, 'DOWN'],
      [0, -1, 'UP'],
    ];
    for (const [dx, dy, expected] of aimed) {
      const at = mazeToScreen(game.multimiam.x, game.multimiam.y, game.transposed);
      tap(game.canvas, {
        x: (at.x + 0.5 + dx) * game.cellWidth,
        y: 175 + band + (at.y + 0.5 + dy) * game.cellHeight,
      });
      const onScreen = transposeDirection(game.multimiam.nextDirection, game.transposed);
      expect({ dx, dy, onScreen }).toEqual({ dx, dy, onScreen: expected });
    }
  });

  test('le labyrinthe se dessine en 15 colonnes sur 19 rangées', () => {
    expect(game.transposed).toBe(true);
    expect([game.cols, game.rows]).toEqual([19, 15]);
    expect(game.canvas.width).toBe(15 * game.cellWidth);
    expect(game.canvas.height).toBe(19 * game.cellHeight);
    // Non transposé, 359 px pour 19 colonnes ne donnaient que des cases de 18 px
    expect(game.cellWidth).toBeGreaterThan(18);
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
    expect(game.canvas.width).toBe(19 * game.cellWidth);
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

describe('MultiMiam sur un téléphone de 390 × 844, place mesurée dans Chrome (360 × 571)', () => {
  let game;

  beforeEach(() => {
    jest.useFakeTimers();
    HTMLCanvasElement.prototype.getContext = () => fakeCanvasContext();
    restorers.push(useAndroidUserAgent());
    // 364 px de zone (360 + cadre) ; 798 − 175 − 48 − 4 = 571 px de haut
    restorers.push(simulateArcadeScreen({ width: 364, height: 798 }));
    renderArcadeStage('multimiam-canvas');
    game = new PacmanGame('multimiam-canvas', 2, 'operation', null, 0, '×');
    game.start();
    game.pause();
  });

  test('cases de 24 × 30 : le labyrinthe remplit tout le plateau, sans bande', () => {
    expect([game.cellWidth, game.cellHeight]).toEqual([24, 30]);
    expect([game.canvas.width, game.canvas.height]).toEqual([360, 570]);
    expect(game.canvas.style.height).toBe('571px');
  });

  test('un toucher sur une case voisine, à l’écran, y envoie le personnage', () => {
    // Murs ignorés : seul compte le point visé ; zone de jeu en haut à 175 px. Personnage
    // loin du coin, en bas du plateau : une erreur sur la hauteur des cases s'y verrait
    game.canMove = () => true;
    Object.assign(game.multimiam, { x: 12, y: 7 });
    const band = (Number.parseFloat(game.canvas.style.height) - game.canvas.height) / 2;
    const screenPoint = (sx, sy) => ({
      x: sx * game.cellWidth,
      y: 175 + band + sy * game.cellHeight,
    });
    const aimed = [
      [1, 0, 'RIGHT'],
      [-1, 0, 'LEFT'],
      [0, 1, 'DOWN'],
      [0, -1, 'UP'],
      // Une case à droite, 0,9 case plus bas : 24 px contre 27 px, le bas l'emporte à l'écran
      [1, 0.9, 'DOWN'],
    ];
    for (const [dx, dy, expected] of aimed) {
      const at = mazeToScreen(game.multimiam.x, game.multimiam.y, game.transposed);
      tap(game.canvas, screenPoint(at.x + 0.5 + dx, at.y + 0.5 + dy));
      const onScreen = transposeDirection(game.multimiam.nextDirection, game.transposed);
      expect({ dx, dy, onScreen }).toEqual({ dx, dy, onScreen: expected });
    }
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
    // moins d'une case près, ses cases un peu plus larges que hautes
    expect(game.canvas.style.height).toBe('546px');
    expect(546 - game.canvas.height).toBeLessThan(game.cellHeight);
    expect(game.cellWidth).toBeGreaterThan(game.cellHeight);
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
      cells: [game.cellWidth, game.cellHeight],
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
  /** Partie où le personnage vient de croquer la bonne réponse, en (3, 1) du labyrinthe */
  async function answerEatenWith(cells) {
    const { showArcadePoints } = await import('../js/utils-es6.js');
    const { initPacmanEngine } = await import('../js/multimiam-engine.js');
    showArcadePoints.mockClear();
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
      ...cells,
      transposed: true,
      score: 0,
      goodAnswersCount: 0,
      updateUI: jest.fn(),
      checkAndActivateGhost: jest.fn(),
      generateOperation: jest.fn(),
    };
    initPacmanEngine(game);
    game.checkAnswerCollision();
    return { showArcadePoints, canvas };
  }

  test('cases de 20 × 25 : la pastille se pose au-dessus de la case croquée, à l’écran', async () => {
    const { showArcadePoints, canvas } = await answerEatenWith({
      cellSize: 20,
      cellWidth: 20,
      cellHeight: 25,
    });
    // Case (3, 1) du labyrinthe : colonne 1, rangée 3 à l'écran
    expect(showArcadePoints).toHaveBeenCalledWith(100, canvas, { x: 1.5 * 20, y: 3 * 25 });
  });

  test('les points gagnés apparaissent au-dessus de la réponse croquée, à l’écran', async () => {
    const { showArcadePoints, canvas } = await answerEatenWith({
      cellSize: CELL,
      cellWidth: CELL,
      cellHeight: CELL,
    });
    // Case (3, 1) du labyrinthe : colonne 1, rangée 3 à l'écran
    expect(showArcadePoints).toHaveBeenCalledWith(100, canvas, { x: 1.5 * CELL, y: 3 * CELL });
  });
});
