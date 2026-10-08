/* eslint-env jest, node */
/**
 * MultiMiam : une réponse croquée compte (anomalie n°20). La partie est jouée (tableau de
 * bord : une partie de plus, même abandonnée ensuite), et le calcul entre dans les
 * statistiques par opération, juste ou faux, comme dans MultiInvaders et MultiSnake.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals';

const noteArcadePlay = jest.fn();
const recordOperationResult = jest.fn();
jest.unstable_mockModule('../js/arcade-session.js', () => ({
  arcadeGameOf: jest.fn(),
  openArcadeSession: jest.fn(),
  noteArcadePlay,
  closeArcadeSession: jest.fn(),
}));
jest.unstable_mockModule('../js/core/operation-stats.js', () => ({
  recordOperationResult,
  getOperationStats: jest.fn(),
  getAllOperationStats: jest.fn(() => ({})),
  getErrorRate: jest.fn(() => 0),
  getWeakOperations: jest.fn(() => []),
  recordMultiplicationResult: jest.fn(),
  getMultiplicationStats: jest.fn(),
  migrateMultiplicationStats: jest.fn(),
  cleanupOldMultiplicationStats: jest.fn(),
}));

const { initPacmanEngine } = await import('../js/multimiam-engine.js');

/** Un plateau d'une ligne, une réponse posée ; MultiMiam sur la case donnée */
function boardWith(answer, multimiamX) {
  const game = {
    operator: '−',
    currentOperation: { num1: 15, num2: 7 },
    multimiam: { x: multimiamX, y: 0 },
    answerPositions: [answer],
    labyrinth: [[2, 2, 2]],
    canvas: null,
    score: 0,
    goodAnswersCount: 0,
    updateUI: jest.fn(),
    checkAndActivateGhost: jest.fn(),
    generateOperation: jest.fn(),
  };
  initPacmanEngine(game);
  return game;
}

beforeEach(() => {
  noteArcadePlay.mockClear();
  recordOperationResult.mockClear();
});

describe('MultiMiam : une réponse croquée compte', () => {
  test('une bonne réponse : partie jouée, calcul compté juste, 100 points', () => {
    const game = boardWith({ x: 1, y: 0, value: 8, isCorrect: true }, 1);
    game.checkAnswerCollision();
    expect(noteArcadePlay).toHaveBeenCalledTimes(1);
    expect(recordOperationResult).toHaveBeenCalledWith('−', 15, 7, true);
    expect(game.score).toBe(100);
  });

  test('une mauvaise réponse : partie jouée, calcul compté faux, réponse retirée', () => {
    const game = boardWith({ x: 1, y: 0, value: 9, isCorrect: false }, 1);
    game.checkAnswerCollision();
    expect(noteArcadePlay).toHaveBeenCalledTimes(1);
    expect(recordOperationResult).toHaveBeenCalledWith('−', 15, 7, false);
    expect(game.answerPositions).toEqual([]);
  });

  test('aucune réponse sous MultiMiam : rien de compté', () => {
    const game = boardWith({ x: 2, y: 0, value: 8, isCorrect: true }, 0);
    game.checkAnswerCollision();
    expect(noteArcadePlay).not.toHaveBeenCalled();
    expect(recordOperationResult).not.toHaveBeenCalled();
  });
});
