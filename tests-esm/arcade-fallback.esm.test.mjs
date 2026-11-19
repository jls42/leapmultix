/* eslint-env jest, node */
/**
 * Replis des jeux d'Arcade quand un tirage échoue, et signe d'opération inconnu dans un profil :
 * le calcul affiché, la réponse attendue et les réponses proposées restent ceux d'une même
 * opération. Le calcul est relu dans le texte que voit l'enfant, puis refait ici.
 */
import { describe, test, expect, beforeAll, afterAll, afterEach, jest } from '@jest/globals';
import { fakeCanvasContext } from './helpers/touch-test-helpers.mjs';

const { fallbackCalculation } = await import('../js/core/operations/OperationRegistry.js');
const { PacmanQuestions } = await import('../js/multimiam-questions.js');
const { SnakeGame } = await import('../js/multisnake.js');
const { UserManager } = await import('../js/userManager.js');

const OPERATORS = ['×', '+', '−', '÷'];
const COMPUTE = new Map([
  ['×', (a, b) => a * b],
  ['+', (a, b) => a + b],
  ['−', (a, b) => a - b],
  ['÷', (a, b) => a / b],
]);

/** Résultat du calcul écrit « a op b = ? », refait à partir du texte seul */
function solve(text) {
  const [, a, sign, b] = /^(\d+) ([×+−÷]) (\d+) = \?$/.exec(text);
  return COMPUTE.get(sign)(Number(a), Number(b));
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Calcul de repli', () => {
  test.each(OPERATORS)('%s : « 2 op 1 » et son vrai résultat', operator => {
    const fallback = fallbackCalculation(operator);
    expect(fallback).toEqual({
      num1: 2,
      num2: 1,
      operator,
      result: COMPUTE.get(operator)(2, 1),
    });
    expect(Number.isInteger(fallback.result) && fallback.result >= 0).toBe(true);
  });

  test.each(['-', '/', ':', undefined])(
    'signe inconnu %p : la multiplication, signe compris',
    sign => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});
      expect(fallbackCalculation(sign)).toEqual({ num1: 2, num2: 1, operator: '×', result: 2 });
    }
  );
});

describe('MultiMiam : tirage en échec', () => {
  test.each(OPERATORS)('%s : la réponse attendue est celle du calcul rendu', operator => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    let reads = 0;
    const game = {
      get operator() {
        reads += 1;
        if (reads === 1) throw new Error('tirage en panne');
        return operator;
      },
    };
    const drawn = PacmanQuestions.generateOperation(game);
    expect(drawn.operator).toBe(operator);
    expect(drawn.result).toBe(solve(`${drawn.num1} ${drawn.operator} ${drawn.num2} = ?`));
  });
});

describe('MultiSnake : tirage en échec', () => {
  const games = [];
  let banner;

  beforeAll(() => {
    HTMLCanvasElement.prototype.getContext = () => fakeCanvasContext();
    const stage = document.createElement('div');
    stage.className = 'arcade-game-ui';
    banner = document.createElement('div');
    banner.className = 'arcade-question';
    const canvas = document.createElement('canvas');
    canvas.id = 'multisnake-canvas';
    stage.append(banner, canvas);
    document.body.appendChild(stage);
  });

  afterAll(() => {
    games.forEach(game => game.cleanup());
    document.body.replaceChildren();
  });

  test.each(OPERATORS)('%s : le bandeau et les pommes changent ensemble', operator => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const game = new SnakeGame('multisnake-canvas', 'operation', { operator, difficulty: 'moyen' });
    games.push(game);
    game.generateOperation();
    game.questionOptions = () => {
      throw new Error('tirage en panne');
    };
    game.generateOperation();
    const expected = solve(banner.textContent);
    const right = game.answers.filter(answer => answer.isCorrect);
    expect(right.map(answer => answer.value)).toEqual([expected]);
    expect(game.currentOperation.result).toBe(expected);
    const values = game.answers.map(answer => answer.value);
    expect(values).toHaveLength(4);
    expect(new Set(values).size).toBe(4);
  });
});

describe('Profil au signe d’opération inconnu', () => {
  afterEach(() => {
    UserManager._players = {};
    UserManager._currentUser = null;
  });

  test.each(['-', '/', ':', 'x', 42])('%p se lit comme la multiplication', sign => {
    UserManager._players = { Zoé: { preferredOperator: sign } };
    UserManager._currentUser = 'Zoé';
    expect(UserManager.getCurrentUserData().preferredOperator).toBe('×');
  });

  test.each(OPERATORS)('%s est gardé', sign => {
    UserManager._players = { Zoé: { preferredOperator: sign } };
    UserManager._currentUser = 'Zoé';
    expect(UserManager.getCurrentUserData().preferredOperator).toBe(sign);
  });
});
