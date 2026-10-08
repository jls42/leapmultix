/* eslint-env jest, node */
/**
 * Arcade : le niveau (Débutant, Moyen, Difficile) change les nombres en +, − et ÷ comme il
 * change les tables en ×, dans les quatre jeux. Débutant prend les plages faciles des
 * opérations, Difficile les plages difficiles ; Moyen garde les plages moyennes, celles
 * de tous les niveaux auparavant. La multiplication ne change pas.
 */
import { describe, test, expect, beforeAll } from '@jest/globals';
import { fakeCanvasContext } from './helpers/touch-test-helpers.mjs';

const { getDifficultySettings } = await import('../js/difficulty.js');
const { drawMemoryCalculation } = await import('../js/arcade-multimemory.js');
const { drawInvasionQuestion } = await import('../js/arcade-invasion.js');
const { PacmanQuestions } = await import('../js/multimiam-questions.js');
const { SnakeGame } = await import('../js/multisnake.js');

const LEVELS = ['debutant', 'moyen', 'difficile'];
const DRAWS = 400;

/** Ce que mesure chaque opération, et sa borne par plage (Operation.generateOperands) */
const BOUNDS = {
  '+': { measure: ({ result }) => result, easy: 10, medium: 20, hard: 40 },
  '−': { measure: ({ a }) => a, easy: 10, medium: 20, hard: 50 },
  '÷': { measure: ({ b }) => b, easy: 5, medium: 10, hard: 12 },
};
const RANGE_OF_LEVEL = { debutant: 'easy', moyen: 'medium', difficile: 'hard' };
const RANGE_BELOW = { moyen: 'easy', difficile: 'medium' };

let snakeCanvasId;

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = () => fakeCanvasContext();
  const stage = document.createElement('div');
  stage.className = 'arcade-game-ui';
  const canvas = document.createElement('canvas');
  canvas.id = 'multisnake-canvas';
  stage.appendChild(canvas);
  document.body.appendChild(stage);
  snakeCanvasId = canvas.id;
});

/** Un tirage de chaque jeu, ramené à { a, b, result } */
const GAMES = {
  MultiMemory: (operator, level) => {
    const settings = getDifficultySettings(level);
    const draw = () =>
      drawMemoryCalculation({ operator, level, tables: settings.tables, excludedTables: [] });
    return () => {
      const { num1, num2, result } = draw();
      return { a: num1, b: num2, result };
    };
  },
  MultiInvaders: (operator, level) => () => {
    const { a, b, answer } = drawInvasionQuestion(operator, getDifficultySettings(level));
    return { a, b, result: answer };
  },
  MultiMiam: (operator, level) => () => {
    const settings = getDifficultySettings(level);
    const game = { operator, difficultySettings: settings, tables: settings.tables };
    const { num1, num2, result } = PacmanQuestions.generateOperation(game);
    return { a: num1, b: num2, result };
  },
  MultiSnake: (operator, level) => {
    const options = { operator, difficulty: level, tables: getDifficultySettings(level).tables };
    const game = new SnakeGame(snakeCanvasId, 'operation', options);
    const draw = () => {
      game.generateOperation();
      const { num1, num2, result } = game.currentOperation;
      return { a: num1, b: num2, result };
    };
    draw.cleanup = () => game.cleanup();
    return draw;
  },
};

function drawMany(game, operator, level) {
  const draw = GAMES[game](operator, level);
  const draws = Array.from({ length: DRAWS }, draw);
  draw.cleanup?.();
  return draws;
}

describe('Arcade : niveau et plages de nombres', () => {
  test('chaque niveau donne sa plage aux opérations +, − et ÷', () => {
    expect(LEVELS.map(level => getDifficultySettings(level).questionDifficulty)).toEqual([
      'easy',
      'medium',
      'hard',
    ]);
  });

  describe.each(Object.keys(GAMES))('%s', game => {
    test.each(['+', '−', '÷'])('%s : les nombres suivent le niveau', operator => {
      const { measure, ...limits } = BOUNDS[operator];
      for (const level of LEVELS) {
        const values = drawMany(game, operator, level).map(measure);
        const max = Math.max(...values);
        // Jamais au-delà de la plage du niveau…
        expect({ level, max, within: max <= limits[RANGE_OF_LEVEL[level]] }).toMatchObject({
          within: true,
        });
        // … et au-delà de la plage du niveau du dessous : le niveau change bien les nombres
        const below = RANGE_BELOW[level];
        if (below)
          expect({ level, max, above: max > limits[below] }).toMatchObject({ above: true });
      }
    });

    test('× : les tables du niveau, comme avant', () => {
      for (const level of LEVELS) {
        const tables = new Set(getDifficultySettings(level).tables);
        const draws = drawMany(game, '×', level);
        expect(draws.every(({ a, b }) => tables.has(a) && b >= 1 && b <= 10)).toBe(true);
        expect(new Set(draws.map(({ a }) => a))).toEqual(tables);
      }
    });
  });
});
