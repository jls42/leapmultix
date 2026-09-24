import { describe, test, expect, beforeAll } from '@jest/globals';
import { generateQuestion } from '../js/questionGenerator.js';

beforeAll(() => {
  global.window = global.window || {};
});

describe('ESM: generateQuestion', () => {
  test('exports function', () => {
    expect(typeof generateQuestion).toBe('function');
  });

  test('respecte une table et un multiplicande imposés', () => {
    expect(
      generateQuestion({ operator: '×', type: 'classic', forceTable: 7, forceNum: 3 })
    ).toMatchObject({ operator: '×', type: 'classic', a: 7, b: 3, answer: 21, table: 7, num: 3 });
  });

  test('sans option, pose une multiplication de 1 à 10', () => {
    const question = generateQuestion();
    expect(question.operator).toBe('×');
    expect(question.a).toBeGreaterThanOrEqual(1);
    expect(question.a).toBeLessThanOrEqual(10);
    expect(question.b).toBeGreaterThanOrEqual(1);
    expect(question.b).toBeLessThanOrEqual(10);
  });

  test('une option undefined prend sa valeur par défaut, comme dans MultiInvaders', () => {
    const question = generateQuestion({ operator: '+', type: 'classic', tables: undefined });
    expect(question.operator).toBe('+');
    expect(question.answer).toBe(question.a + question.b);

    const defaut = generateQuestion({ operator: undefined, type: 'classic', forceTable: 4 });
    expect(defaut).toMatchObject({ operator: '×', a: 4 });
  });
});
/* eslint-env jest, node */
