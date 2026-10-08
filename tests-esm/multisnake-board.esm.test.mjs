/**
 * Plateau de MultiSnake : sur téléphone, la grille remplit la place (plus haute que large en
 * portrait, plus large que haute en paysage) ; une fois la partie lancée, l'écran peut
 * changer (consigne qui part, rotation, plein écran) : seul l'affichage suit, la partie
 * (grille, serpent, pommes) ne change pas. Sur ordinateur, la grille reste 14 × 11.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { fakeCanvasContext } from './helpers/touch-test-helpers.mjs';
import {
  renderArcadeStage,
  simulateArcadeScreen,
  useAndroidUserAgent,
  hideInstructions,
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

const { SnakeGame, chooseMobileSnakeGrid } = await import('../js/multisnake.js');

const restorers = [];
let game;

/** Partie lancée puis figée : la boucle d'animation ne fait plus avancer le serpent */
function startFrozenGame() {
  game = new SnakeGame('multisnake-canvas', 'operation', { operator: '×' });
  game.start();
  cancelAnimationFrame(game.animationId);
  return game;
}

/** État de la partie qu'un changement d'écran ne doit pas toucher */
function partie(g) {
  return {
    cols: g.cols,
    rows: g.rows,
    snake: g.snake.map(({ x, y }) => ({ x, y })),
    apples: g.numberPositions.map(({ x, y, value }) => ({ x, y, value })),
  };
}

beforeEach(() => {
  jest.useFakeTimers();
  HTMLCanvasElement.prototype.getContext = () => fakeCanvasContext();
  renderArcadeStage('multisnake-canvas');
});

afterEach(() => {
  game?.cleanup();
  game = null;
  while (restorers.length) restorers.pop()();
  jest.useRealTimers();
});

describe('chooseMobileSnakeGrid : des cases d’environ 30 px qui remplissent la place', () => {
  test('en portrait, plus haute que large', () => {
    expect(chooseMobileSnakeGrid({ width: 363, height: 621 })).toEqual({ cols: 12, rows: 20 });
  });

  test('en paysage, plus large que haute', () => {
    expect(chooseMobileSnakeGrid({ width: 620, height: 320 })).toEqual({ cols: 20, rows: 10 });
  });

  test('jamais moins de 8 cases ni plus de 22 sur un côté', () => {
    expect(chooseMobileSnakeGrid({ width: 150, height: 1200 })).toEqual({ cols: 8, rows: 22 });
  });
});

describe('MultiSnake sur un téléphone de 390 × 844', () => {
  beforeEach(() => {
    restorers.push(useAndroidUserAgent());
    restorers.push(simulateArcadeScreen({ width: 363, height: 844 }));
  });

  test('le plateau est plus haut que large et remplit la place, consigne comprise', () => {
    startFrozenGame();
    expect(game.rows).toBeGreaterThan(game.cols);
    // Avec la consigne : 844 − 175 − 66 − 48 = 555 px de haut
    expect(game.rows * game.cellSize).toBeLessThanOrEqual(555);
    expect(555 - game.rows * game.cellSize).toBeLessThan(game.rows);
    expect(game.cols * game.cellSize).toBeLessThanOrEqual(363);
  });

  test('la consigne partie, le plateau grandit dans la place libérée, sans changer la partie', () => {
    startFrozenGame();
    const before = partie(game);
    const cellBefore = game.cellSize;
    hideInstructions(document.querySelector('.arcade-game-ui'));
    jest.advanceTimersByTime(50);
    expect(partie(game)).toEqual(before);
    expect(game.cellSize).toBeGreaterThan(cellBefore);
    // 844 − 175 − 48 = 621 px de haut
    expect(game.rows * game.cellSize).toBeLessThanOrEqual(621);
    expect(game.canvas.height).toBe(game.rows * game.cellSize);
    expect(game.canvas.style.height).toBe(`${game.canvas.height}px`);
  });

  test('le téléphone tourné en pleine partie : le plateau se met à l’échelle, la partie reste', () => {
    startFrozenGame();
    // Partie entamée : une pomme mangée
    game.score = 100;
    const before = partie(game);
    restorers.push(simulateArcadeScreen({ width: 620, height: 390, top: 120 }));
    globalThis.dispatchEvent(new Event('resize'));
    jest.advanceTimersByTime(50);
    expect(partie(game)).toEqual(before);
    // 390 − 120 − 66 − 48 = 156 px, mais jamais moins de 220 px de place (garde-fou commun)
    expect(game.rows * game.cellSize).toBeLessThanOrEqual(220);
    expect(game.cols * game.cellSize).toBeLessThanOrEqual(620);
  });
});

describe('MultiSnake : plein écran juste après le lancement', () => {
  beforeEach(() => {
    restorers.push(useAndroidUserAgent());
    restorers.push(simulateArcadeScreen({ width: 363, height: 844 }));
  });

  /** Plein écran : plus de barre du haut, la zone de jeu commence plus haut */
  function goFullscreen() {
    restorers.push(simulateArcadeScreen({ width: 374, height: 844, top: 110 }));
    document.dispatchEvent(new Event('fullscreenchange'));
    jest.advanceTimersByTime(50);
  }

  test('rien n’est encore joué : la grille se refait pour la nouvelle place', () => {
    startFrozenGame();
    const rowsBefore = game.rows;
    goFullscreen();
    expect(game.rows).toBeGreaterThan(rowsBefore);
    expect(game.rows * game.cellSize).toBeLessThanOrEqual(844 - 110 - 66 - 48);
    // Le serpent repart du milieu de la nouvelle grille, les pommes y sont toutes
    expect(game.snake[0].y).toBe(Math.floor(game.rows / 2));
    for (const apple of game.numberPositions) expect(apple.y).toBeLessThan(game.rows);
  });

  test('une pomme déjà mangée : la grille ne change plus, seul l’affichage suit', () => {
    startFrozenGame();
    game.score = 100;
    const before = partie(game);
    goFullscreen();
    expect(partie(game)).toEqual(before);
  });
});

describe('MultiSnake sur ordinateur', () => {
  test('la grille reste 14 × 11, comme avant', () => {
    restorers.push(simulateArcadeScreen({ width: 1234, height: 800, top: 202 }));
    startFrozenGame();
    expect([game.cols, game.rows]).toEqual([14, 11]);
  });
});
