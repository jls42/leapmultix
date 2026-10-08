/* eslint-env jest, node */
/**
 * La pause de l'Arcade arrête aussi les jeux, pas seulement le temps : le serpent de
 * MultiSnake, le personnage et les monstres de MultiMiam ne bougent plus, et rien ne saute
 * à la reprise. Dans MultiMiam, la barre d'espace (déjà sa touche de pause) passe par la
 * même pause, compte à rebours compris ; et son écouteur part avec le jeu : resté branché,
 * il relançait une partie abandonnée depuis n'importe quel écran.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { fakeCanvasContext } from './helpers/touch-test-helpers.mjs';

const pause = await import('../js/arcade-time.js');
const { SnakeGame } = await import('../js/multisnake.js');
const { initPacmanEngine } = await import('../js/multimiam-engine.js');
const { initPacmanControls } = await import('../js/multimiam-controls.js');
const { cleanupGameResources } = await import('../js/game-cleanup.js');

let canvas;

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = () => fakeCanvasContext();
  // Les boucles des jeux tournent à la main, image par image
  jest.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(() => 1);
  const game = document.createElement('div');
  game.id = 'game';
  const time = document.createElement('span');
  time.id = 'arcade-info-timer';
  const stage = document.createElement('div');
  stage.className = 'arcade-game-ui';
  canvas = document.createElement('canvas');
  canvas.id = 'pause-canvas';
  stage.appendChild(canvas);
  game.append(time, stage);
  document.body.replaceChildren(game);
  pause.mountArcadePause(time);
});

afterEach(() => {
  pause.unmountArcadePause();
  jest.restoreAllMocks();
});

const space = target =>
  target.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

describe('MultiSnake en pause', () => {
  test('le serpent ne bouge plus, et repart d’où il était à la reprise', () => {
    const game = new SnakeGame(canvas.id, 'operation', { operator: '×' });
    game.start();
    game.gameLoop(1000);
    const head = { ...game.snake[0] };
    pause.pauseArcade();
    for (const t of [2000, 5000, 9000]) game.gameLoop(t);
    expect(game.snake[0]).toEqual(head);
    pause.resumeArcade();
    game.gameLoop(9100);
    // Le temps de la pause ne compte pas : moins d'un intervalle depuis la reprise
    expect(game.snake[0]).toEqual(head);
    game.gameLoop(9100 + game.moveInterval);
    expect(game.snake[0]).not.toEqual(head);
    game.cleanup();
  });
});

describe('MultiMiam en pause', () => {
  function engineGame() {
    const game = {
      running: true,
      gameOver: false,
      moveInterval: 150,
      multimiam: { x: 1, y: 1 },
      ghosts: [],
      updatePlayerAvatar: () => undefined,
    };
    initPacmanEngine(game);
    Object.assign(game, {
      movePacman: jest.fn(),
      moveGhosts: jest.fn(),
      checkAnswerCollision: jest.fn(),
      checkGhostCollision: jest.fn(),
    });
    return game;
  }

  test('ni le personnage ni les monstres ne bougent, et rien ne saute à la reprise', () => {
    const game = engineGame();
    pause.pauseArcade();
    // Derniers pas très anciens : sans la pause, tout bougerait aussitôt
    game.lastMoveTime = -1e6;
    game.lastGhostMoveTime = -1e6;
    game.update();
    expect(game.movePacman).not.toHaveBeenCalled();
    expect(game.moveGhosts).not.toHaveBeenCalled();
    pause.resumeArcade();
    game.update();
    expect(game.movePacman).not.toHaveBeenCalled();
    game.lastMoveTime -= game.moveInterval * 4;
    game.update();
    expect(game.movePacman).toHaveBeenCalledTimes(1);
  });

  function controlledGame() {
    const game = {
      canvas,
      gameOver: false,
      running: true,
      multimiam: { x: 1, y: 1, isMoving: true },
      canMove: () => true,
      start: jest.fn(),
    };
    initPacmanControls(game);
    return game;
  }

  test('la barre d’espace met l’Arcade en pause et la relance, compte à rebours compris', () => {
    controlledGame();
    space(document.body);
    expect(pause.isArcadePaused()).toBe(true);
    space(document.body);
    expect(pause.isArcadePaused()).toBe(false);
  });

  test('sur un bouton, la barre d’espace reste au bouton', () => {
    controlledGame();
    const button = document.createElement('button');
    document.body.appendChild(button);
    space(button);
    expect(pause.isArcadePaused()).toBe(false);
  });

  test('la partie finie, la barre d’espace ne relance plus rien', () => {
    const game = controlledGame();
    cleanupGameResources(game);
    space(document.body);
    expect(pause.isArcadePaused()).toBe(false);
    expect(game.start).not.toHaveBeenCalled();
  });
});
