/* eslint-env jest, node */
/**
 * MultiMiam : l'écouteur de touches part avec le jeu. Il restait branché sur la page après
 * « Abandonner » ou l'écran de fin : la barre d'espace, n'importe où ensuite (menu Arcade,
 * autre jeu), relançait la boucle de la partie abandonnée, en arrière-plan, à 60 images par
 * seconde (mesuré dans Chrome).
 */
import { describe, test, expect, jest } from '@jest/globals';

const { initPacmanControls } = await import('../js/multimiam-controls.js');
const { cleanupGameResources } = await import('../js/game-cleanup.js');

/** Partie de MultiMiam réduite à ce que lisent ses commandes, mise en pause par l'abandon */
function abandonedGame() {
  const game = {
    canvas: document.createElement('canvas'),
    gameOver: false,
    running: false,
    multimiam: { x: 1, y: 1, isMoving: true },
    canMove: () => true,
    start: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
  };
  initPacmanControls(game);
  return game;
}

describe('MultiMiam : touches après la partie', () => {
  test('la partie nettoyée, la barre d’espace ne relance plus la partie abandonnée', () => {
    const game = abandonedGame();
    cleanupGameResources(game);
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(game.resume).not.toHaveBeenCalled();
    expect(game.start).not.toHaveBeenCalled();
    expect(game.multimiam.nextDirection).toBeUndefined();
  });
});
