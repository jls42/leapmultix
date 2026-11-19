/* eslint-env jest, node */
/**
 * Fin de partie par les vies, dans MultiSnake et MultiMiam : le score remis à l'écran de fin
 * (showArcadeGameOver) est celui de la partie, une seule fois. Les fins par « Abandonner »
 * sont dans arcade-multisnake-launch et multimiam-start.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { fakeCanvasContext } from './helpers/touch-test-helpers.mjs';

const showArcadeGameOver = jest.fn();
jest.unstable_mockModule('../js/utils-es6.js', () => ({
  showArcadeMessage: jest.fn(),
  showArcadePoints: jest.fn(),
  getTranslation: key => key,
}));
jest.unstable_mockModule('../js/arcade.js', () => ({ showArcadeGameOver }));
jest.unstable_mockModule('../js/game.js', () => ({ gameState: { avatar: 'fox' } }));
jest.unstable_mockModule('../js/arcade-points.js', () => ({ showArcadePenalty: jest.fn() }));
jest.unstable_mockModule('../js/game-cleanup.js', () => ({ cleanupGameResources: jest.fn() }));
jest.unstable_mockModule('../js/components/infoBar.js', () => ({
  InfoBar: { update: jest.fn(), renderLives: jest.fn() },
}));
jest.unstable_mockModule('../js/core/operation-stats.js', () => ({
  recordOperationResult: jest.fn(),
}));
jest.unstable_mockModule('../js/arcade-session.js', () => ({
  noteArcadePlay: jest.fn(),
  noteArcadeMiss: jest.fn(),
}));
jest.unstable_mockModule('../js/userManager.js', () => ({
  UserManager: { getCurrentUser: () => null },
}));
jest.unstable_mockModule('../js/core/tablePreferences.js', () => ({
  TablePreferences: { isGlobalEnabled: () => false, getActiveExclusions: () => [] },
}));
jest.unstable_mockModule('../js/core/GameMode.js', () => ({
  plausibleWrongAnswers: ({ answer }) => [answer + 1, answer + 2, answer + 3],
}));
jest.unstable_mockModule('../js/multisnake-renderer.js', () => ({
  drawSnakeScene: jest.fn(() => ({ heading: 0 })),
  IMAGE_HEAD_SIZE: 1.5,
}));

const { SnakeGame } = await import('../js/multisnake.js');
const { PacmanGame } = await import('../js/multimiam.js');
const { AudioManager } = await import('../js/core/audio.js');

beforeEach(() => {
  jest.useFakeTimers();
  showArcadeGameOver.mockClear();
  HTMLCanvasElement.prototype.getContext = () => fakeCanvasContext();
  jest.spyOn(AudioManager, 'playSound').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('MultiSnake : la dernière vie perdue', () => {
  /** Partie lancée sur son plateau, serpent à l'arrêt, avec ce score et ces vies */
  function snakeGame(score, lives) {
    const stage = document.createElement('div');
    stage.className = 'arcade-game-ui';
    const canvas = document.createElement('canvas');
    canvas.id = 'multisnake-canvas';
    canvas.tabIndex = 0;
    stage.append(canvas);
    document.body.replaceChildren(stage);
    const game = new SnakeGame('multisnake-canvas', 'operation', { operator: '×' });
    game.start();
    cancelAnimationFrame(game.animationId);
    game.score = score;
    game.lives = lives;
    return game;
  }

  test('il reste des vies : la partie continue, aucun écran de fin', () => {
    const game = snakeGame(260, 2);
    game.loseLife();
    expect(game.lives).toBe(1);
    expect(game.gameOver).toBeFalsy();
    expect(showArcadeGameOver).not.toHaveBeenCalled();
    game.cleanup();
  });

  test('plus de vie : la partie finit et remet son score à l’écran de fin', () => {
    const game = snakeGame(260, 1);
    game.loseLife();
    expect(game.lives).toBe(0);
    expect(game.gameOver).toBe(true);
    expect(showArcadeGameOver).toHaveBeenCalledTimes(1);
    expect(showArcadeGameOver).toHaveBeenCalledWith(260);
  });
});

describe('MultiMiam : la fin de la partie', () => {
  /** La partie telle que la fin la lit : son score, et ce qu'elle arrête */
  const miamGame = score => ({ gameOver: false, running: true, score });

  test('le score de la partie est remis à l’écran de fin, et la partie s’arrête', () => {
    const game = miamGame(480);
    PacmanGame.prototype.endGame.call(game);
    expect(game.gameOver).toBe(true);
    expect(game.running).toBe(false);
    expect(showArcadeGameOver).toHaveBeenCalledTimes(1);
    expect(showArcadeGameOver).toHaveBeenCalledWith(480);
  });

  test('deux collisions dans la même image : une seule fin de partie', () => {
    const game = miamGame(20);
    PacmanGame.prototype.endGame.call(game);
    PacmanGame.prototype.endGame.call(game);
    expect(showArcadeGameOver).toHaveBeenCalledTimes(1);
    expect(showArcadeGameOver).toHaveBeenCalledWith(20);
  });
});
