/* eslint-env jest, node */
/**
 * MultiMiam : collisions du personnage avec les réponses et les monstres, décrites pas à pas
 * (ordre des appels, état après coup) pour que le moteur puisse être découpé sans rien changer.
 */
import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

const log = [];
const note =
  name =>
  (...args) =>
    log.push(`${name}(${args.map(a => JSON.stringify(a)).join(', ')})`);
jest.unstable_mockModule('../js/utils-es6.js', () => ({
  showArcadeMessage: jest.fn(note('showArcadeMessage')),
  showArcadePoints: jest.fn(note('showArcadePoints')),
}));
jest.unstable_mockModule('../js/arcade-points.js', () => ({
  showArcadePenalty: jest.fn(note('showArcadePenalty')),
  showArcadePoints: jest.fn(note('showArcadePoints')),
}));
jest.unstable_mockModule('../js/arcade-session.js', () => ({
  noteArcadePlay: jest.fn(note('noteArcadePlay')),
}));
jest.unstable_mockModule('../js/core/operation-stats.js', () => ({
  recordOperationResult: jest.fn(note('recordOperationResult')),
}));
jest.unstable_mockModule('../js/arcade-time.js', () => ({ isArcadePaused: () => false }));

const { initPacmanEngine } = await import('../js/multimiam-engine.js');

const NOW = 1_000_000;
const ghost = (x, y, extra = {}) => ({
  x,
  y,
  color: '#123456',
  direction: 'LEFT',
  active: true,
  vulnerable: false,
  ...extra,
});

/** Une partie sur un labyrinthe ouvert de 12 × 12, MultiMiam en (5, 5) */
function newGame(overrides = {}) {
  const game = {
    gameOver: false,
    isInvincible: false,
    running: true,
    graceStartTime: 0,
    graceDuration: 3000,
    invincibilityDuration: 2000,
    lives: 3,
    score: 40,
    goodAnswersCount: 0,
    operator: '×',
    currentOperation: { num1: 3, num2: 4 },
    canvas: null,
    cellWidth: 10,
    cellHeight: 20,
    transposed: false,
    multimiam: { x: 5, y: 5, direction: 'LEFT', nextDirection: 'UP', isMoving: false },
    ghosts: [ghost(1, 1), ghost(6, 6, { active: false }), ghost(7, 7), ghost(8, 8), ghost(9, 9)],
    labyrinth: Array.from({ length: 12 }, () => Array.from({ length: 12 }, () => 2)),
    answerPositions: [
      { x: 2, y: 1, value: 12, isCorrect: true },
      { x: 3, y: 1, value: 11, isCorrect: false },
    ],
    ...overrides,
  };
  initPacmanEngine(game);
  // Après le moteur, qui définit lui-même checkAndActivateGhost
  for (const name of [
    'updateUI',
    'endGame',
    'generateOperation',
    'displayOperationUI',
    'checkAndActivateGhost',
  ]) {
    if (!(name in overrides)) game[name] = jest.fn(note(name));
  }
  return game;
}

/** L'état de la partie, sans ses fonctions */
const stateOf = game => JSON.parse(JSON.stringify(game));

beforeEach(() => {
  log.length = 0;
  jest.spyOn(Date, 'now').mockReturnValue(NOW);
  jest.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

describe('MultiMiam : collision avec un monstre', () => {
  test('partie finie, invincible ou encore en période de grâce : rien ne se passe', () => {
    for (const overrides of [
      { gameOver: true },
      { isInvincible: true },
      { graceStartTime: NOW - 2999 },
    ]) {
      const game = newGame({ ...overrides, ghosts: [ghost(5, 5)] });
      const before = stateOf(game);
      game.checkGhostCollision();
      expect(stateOf(game)).toEqual(before);
    }
    expect(log).toEqual([]);
  });

  test('un monstre inactif sur la case est ignoré', () => {
    const game = newGame({ ghosts: [ghost(5, 5, { active: false })] });
    const before = stateOf(game);
    game.checkGhostCollision();
    expect(stateOf(game)).toEqual(before);
    expect(log).toEqual([]);
  });

  test('un monstre vulnérable est croqué : retour en (9, 8), 20 points', () => {
    const game = newGame({ ghosts: [ghost(5, 5, { vulnerable: true }), ghost(1, 2)] });
    game.checkGhostCollision();
    expect(game.ghosts[0]).toEqual(ghost(9, 8, { vulnerable: false }));
    expect(game.score).toBe(60);
    expect(game.lives).toBe(3);
    expect(log).toEqual(['updateUI()']);
  });

  test('une vie perdue : message neutre, MultiMiam repart de (2, 1), monstres replacés', () => {
    const game = newGame({
      ghosts: [ghost(5, 5), ghost(6, 6, { active: false }), ghost(7, 7, { active: false })],
    });
    game.checkGhostCollision();
    expect(log).toEqual([
      'updateUI()',
      'showArcadeMessage("arcade_life_lost", "neutral")',
      'generateOperation(2, 1)',
      'displayOperationUI()',
    ]);
    expect(game.lives).toBe(2);
    expect(game.isInvincible).toBe(true);
    expect(game.invincibilityEndTime).toBe(NOW + 2000);
    expect(game.multimiam).toEqual({
      x: 2,
      y: 1,
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      isMoving: true,
    });
    expect(game.labyrinth[1][2]).toBe(0);
    expect(game.answerPositions).toEqual([{ x: 3, y: 1, value: 11, isCorrect: false }]);
    // Cinq monstres même s'il n'y en avait que trois ; chacun garde son état actif
    expect(stateOf(game).ghosts).toEqual([
      { x: 9, y: 8, color: '#FF0000', direction: 'UP', vulnerable: false, active: true },
      { x: 10, y: 8, color: '#FFB8FF', direction: 'UP', vulnerable: false, active: false },
      { x: 8, y: 8, color: '#00FFFF', direction: 'UP', vulnerable: false, active: false },
      { x: 9, y: 7, color: '#FFB852', direction: 'UP', vulnerable: false },
      { x: 10, y: 7, color: '#800080', direction: 'UP', vulnerable: false },
    ]);
    expect(Object.keys(game.ghosts[0])).toEqual([
      'x',
      'y',
      'color',
      'direction',
      'vulnerable',
      'active',
    ]);
  });

  test('un monstre croqué puis un autre sur la même case : 20 points, puis une vie perdue', () => {
    const game = newGame({ ghosts: [ghost(5, 5, { vulnerable: true }), ghost(5, 5)] });
    game.checkGhostCollision();
    expect(game.score).toBe(60);
    expect(game.lives).toBe(2);
    expect(log.slice(0, 3)).toEqual([
      'updateUI()',
      'updateUI()',
      'showArcadeMessage("arcade_life_lost", "neutral")',
    ]);
  });

  test('la dernière vie : fin de partie, sans réapparition', () => {
    const game = newGame({ lives: 1, ghosts: [ghost(5, 5), ghost(5, 5)] });
    game.checkGhostCollision();
    expect(log).toEqual([
      'updateUI()',
      'showArcadeMessage("arcade_life_lost", "neutral")',
      'endGame()',
    ]);
    expect(game.lives).toBe(0);
    expect(game.isInvincible).toBe(false);
    expect(game.multimiam).toEqual({
      x: 5,
      y: 5,
      direction: 'LEFT',
      nextDirection: 'UP',
      isMoving: false,
    });
  });

  test('partie arrêtée, sans affichage du calcul : ni message ni erreur', () => {
    const game = newGame({ running: false, displayOperationUI: undefined, ghosts: [ghost(5, 5)] });
    game.checkGhostCollision();
    expect(log).toEqual(['updateUI()', 'generateOperation(2, 1)']);
    expect(game.lives).toBe(2);
  });
});

describe('MultiMiam : collision avec une réponse', () => {
  test('la bonne réponse : 100 points affichés, monstre peut-être activé, nouveau calcul', () => {
    const canvas = { id: 'board' };
    const game = newGame({ canvas, multimiam: { x: 2, y: 1, direction: 'RIGHT' } });
    game.checkAnswerCollision();
    expect(log).toEqual([
      'noteArcadePlay()',
      'recordOperationResult("×", 3, 4, true)',
      'showArcadePoints(100, {"id":"board"}, {"x":25,"y":20})',
      'updateUI()',
      'checkAndActivateGhost()',
      'generateOperation(2, 1)',
      'displayOperationUI()',
    ]);
    expect(game.score).toBe(140);
    expect(game.goodAnswersCount).toBe(1);
    expect(game.labyrinth[1][2]).toBe(0);
    expect(game.answerPositions).toHaveLength(2);
  });

  test('une mauvaise réponse : seuls les points vraiment retirés, réponse retirée', () => {
    const game = newGame({
      canvas: { id: 'board' },
      score: 30,
      transposed: true,
      multimiam: { x: 3, y: 1 },
    });
    game.checkAnswerCollision();
    expect(log).toEqual([
      'noteArcadePlay()',
      'recordOperationResult("×", 3, 4, false)',
      'showArcadePenalty(30, {"id":"board"}, {"x":15,"y":60})',
      'updateUI()',
    ]);
    expect(game.score).toBe(0);
    expect(game.goodAnswersCount).toBe(0);
    expect(game.labyrinth[1][3]).toBe(0);
    expect(game.answerPositions).toEqual([{ x: 2, y: 1, value: 12, isCorrect: true }]);
  });

  test('deux réponses sur la même case, la mauvaise d’abord : seule la mauvaise compte', () => {
    const answerPositions = [
      { x: 4, y: 4, value: 11, isCorrect: false },
      { x: 9, y: 9, value: 10, isCorrect: false },
      { x: 4, y: 4, value: 12, isCorrect: true },
    ];
    const game = newGame({ answerPositions: [...answerPositions], multimiam: { x: 4, y: 4 } });
    game.checkAnswerCollision();
    expect(game.score).toBe(0);
    expect(game.answerPositions).toEqual(answerPositions.slice(1));
    expect(log.filter(entry => entry.startsWith('recordOperationResult'))).toHaveLength(1);
  });

  test('deux réponses sur la même case, la bonne d’abord : seule la bonne compte', () => {
    const answerPositions = [
      { x: 4, y: 4, value: 12, isCorrect: true },
      { x: 4, y: 4, value: 11, isCorrect: false },
    ];
    const game = newGame({ answerPositions: [...answerPositions], multimiam: { x: 4, y: 4 } });
    game.checkAnswerCollision();
    expect(game.score).toBe(140);
    expect(game.answerPositions).toEqual(answerPositions);
    expect(log.filter(entry => entry.startsWith('recordOperationResult'))).toHaveLength(1);
  });

  test('sans affichage du calcul ni plateau : la bonne réponse compte sans erreur', () => {
    const game = newGame({ displayOperationUI: undefined, multimiam: { x: 2, y: 1 } });
    game.checkAnswerCollision();
    expect(log.slice(-2)).toEqual(['checkAndActivateGhost()', 'generateOperation(2, 1)']);
    expect(game.score).toBe(140);
  });
});
