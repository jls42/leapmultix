/**
 * MultiMiam, caractérisation de la boucle du moteur (game.update) : le personnage avance à
 * son rythme, les monstres au leur (3,5 fois plus lents), chacun suivi de ses collisions ;
 * arrêté à une intersection, le personnage ouvre et ferme la bouche sans avancer. Ces tests
 * figent la boucle telle qu'elle est, pour la découper sans rien y changer.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';

jest.unstable_mockModule('../js/arcade-session.js', () => ({
  arcadeGameOf: jest.fn(),
  openArcadeSession: jest.fn(),
  noteArcadePlay: jest.fn(),
  closeArcadeSession: jest.fn(),
}));
jest.unstable_mockModule('../js/core/operation-stats.js', () => ({
  recordOperationResult: jest.fn(),
}));

const { initPacmanEngine } = await import('../js/multimiam-engine.js');

const MOVE_MS = 150;
let game;

/** Partie en cours ; les déplacements et collisions sont observés, pas joués */
function runningGame() {
  game = {
    running: true,
    gameOver: false,
    moveInterval: MOVE_MS,
    multimiam: {
      x: 2,
      y: 1,
      isMoving: true,
      isAtIntersection: false,
      mouthAngle: 0.2,
      mouthSpeed: 0.15,
    },
    ghosts: [{ x: 9, y: 8 }],
    isInvincible: false,
    updatePlayerAvatar: jest.fn(),
  };
  initPacmanEngine(game);
  Object.assign(game, {
    movePacman: jest.fn(),
    moveGhosts: jest.fn(() => {
      game.ghosts = [{ x: 9, y: 7 }];
    }),
    checkAnswerCollision: jest.fn(),
    checkGhostCollision: jest.fn(),
  });
  return game;
}

/** Les horloges du personnage et des monstres sont en retard de tant de millisecondes */
function clocksBehindBy(pacmanMs, ghostMs) {
  const now = performance.now();
  game.lastMoveTime = now - pacmanMs;
  game.lastGhostMoveTime = now - ghostMs;
  game.lastPacmanPosition = { x: 0, y: 0 };
  game.lastGhostPositions = [{ x: 0, y: 0 }];
  return now;
}

beforeEach(() => {
  jest.useFakeTimers();
  runningGame();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('MultiMiam : boucle du moteur', () => {
  test('pas encore l’heure : l’animation avance, rien ne bouge', () => {
    clocksBehindBy(75, 75);
    game.update();
    expect(game.animationProgress).toBeCloseTo(0.5, 5);
    expect(game.ghostAnimationProgress).toBeCloseTo(75 / (MOVE_MS * 3.5), 5);
    expect(game.movePacman).not.toHaveBeenCalled();
    expect(game.moveGhosts).not.toHaveBeenCalled();
  });

  test('l’heure du personnage : il avance, puis réponses et monstres sont vérifiés', () => {
    const now = clocksBehindBy(MOVE_MS, 0);
    game.update();
    expect(game.lastPacmanPosition).toEqual({ x: 2, y: 1 });
    expect(game.movePacman).toHaveBeenCalledTimes(1);
    expect(game.checkAnswerCollision).toHaveBeenCalledTimes(1);
    expect(game.checkGhostCollision).toHaveBeenCalledTimes(1);
    expect(game.animationProgress).toBe(0);
    expect(game.lastMoveTime).toBe(now);
    expect(game.moveGhosts).not.toHaveBeenCalled();
  });

  test('arrêté à une intersection : la bouche bouge, le personnage n’avance pas', () => {
    Object.assign(game.multimiam, { isAtIntersection: true, isMoving: false, mouthAngle: 0.7 });
    clocksBehindBy(MOVE_MS, 0);
    game.update();
    expect(game.movePacman).not.toHaveBeenCalled();
    // 0,7 + 0,15 dépasse π/4 : la bouche repart dans l'autre sens
    expect(game.multimiam.mouthAngle).toBeCloseTo(0.85, 5);
    expect(game.multimiam.mouthSpeed).toBeCloseTo(-0.15, 5);
    expect(game.checkAnswerCollision).toHaveBeenCalledTimes(1);
  });

  test('l’heure des monstres : ils avancent, puis la collision est vérifiée', () => {
    const now = clocksBehindBy(0, MOVE_MS * 3.5);
    game.update();
    expect(game.lastGhostPositions).toEqual([{ x: 9, y: 8 }]);
    expect(game.moveGhosts).toHaveBeenCalledTimes(1);
    expect(game.checkGhostCollision).toHaveBeenCalledTimes(1);
    expect(game.ghostAnimationProgress).toBe(0);
    expect(game.lastGhostMoveTime).toBe(now);
    expect(game.movePacman).not.toHaveBeenCalled();
  });

  test('partie arrêtée : rien ne se passe', () => {
    clocksBehindBy(MOVE_MS, MOVE_MS * 3.5);
    game.running = false;
    game.update();
    expect(game.movePacman).not.toHaveBeenCalled();
    expect(game.moveGhosts).not.toHaveBeenCalled();
    expect(game.updatePlayerAvatar).not.toHaveBeenCalled();
  });

  test('l’invincibilité finie, le personnage redevient visible', () => {
    clocksBehindBy(0, 0);
    Object.assign(game, {
      isInvincible: true,
      invincibilityEndTime: Date.now() - 1,
      isVisible: false,
    });
    game.update();
    expect(game.isInvincible).toBe(false);
    expect(game.isVisible).toBe(true);
  });
});
