import { describe, test, expect, beforeAll, afterEach, jest } from '@jest/globals';
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

describe('Vrai/faux : une proposition jamais négative', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** Nombre proposé dans « a op b = n » */
  const proposed = question => Number(question.question.split('=')[1]);

  test('sous zéro, l’écart part vers le haut : « 1 × 1 = 3 », jamais « = −1 »', () => {
    // Tous les tirages au maximum : proposition fausse, écart vers le bas, de 2
    jest.spyOn(globalThis.crypto, 'getRandomValues').mockImplementation(array => {
      array[0] = 2 ** 32 - 1;
      return array;
    });
    const question = generateQuestion({
      operator: '×',
      type: 'true_false',
      forceTable: 1,
      forceNum: 1,
    });
    expect(question.question).toBe('1 × 1 = 3');
    expect(question.answer).toBe(false);
  });

  test('au hasard, toute proposition fausse est positive et différente du résultat', () => {
    for (let i = 0; i < 300; i++) {
      const question = generateQuestion({ operator: '−', type: 'true_false', difficulty: 'easy' });
      const result = question.a - question.b;
      expect(proposed(question)).toBeGreaterThanOrEqual(0);
      if (question.answer === false) expect(proposed(question)).not.toBe(result);
      else expect(proposed(question)).toBe(result);
    }
  });
});
