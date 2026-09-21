/**
 * Tests de l'implémentation réelle de l'opération de division.
 */

import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Division } from '../../js/core/operations/Division.js';

describe('Division Operation', () => {
  let division;

  beforeEach(() => {
    division = new Division();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('expose les métadonnées de la division', () => {
    expect(division).toMatchObject({
      symbol: '÷',
      name: 'division',
      spokenForm: 'divisé par',
      unicodeSymbol: '÷',
    });
  });

  it.each([
    [12, 3, 4],
    [20, 4, 5],
    [100, 10, 10],
    [1, 1, 1],
  ])('calcule %i ÷ %i = %i', (dividend, divisor, expected) => {
    expect(division.compute(dividend, divisor)).toBe(expected);
  });

  it('refuse la division par zéro', () => {
    expect(() => division.compute(10, 0)).toThrow('Division par zéro impossible');
    expect(division.isValid(10, 0)).toBe(false);
  });

  it.each([
    ['easy', 5, 10],
    ['medium', 10, 10],
    ['hard', 12, 12],
  ])('applique les bornes du niveau %s', (difficulty, maxDivisor, maxQuotient) => {
    const randomInt = jest.spyOn(division, '_randomInt').mockImplementation((_min, max) => max);

    expect(division.generateOperands(difficulty)).toEqual({
      a: maxDivisor * maxQuotient,
      b: maxDivisor,
    });
    expect(randomInt.mock.calls).toEqual([
      [2, maxDivisor],
      [1, maxQuotient],
    ]);
  });

  it.each([undefined, 'unknown'])('utilise les bornes medium pour le niveau %s', difficulty => {
    const randomInt = jest.spyOn(division, '_randomInt').mockImplementation((_min, max) => max);

    const operands =
      difficulty === undefined
        ? division.generateOperands()
        : division.generateOperands(difficulty);

    expect(operands).toEqual({ a: 100, b: 10 });
    expect(randomInt.mock.calls).toEqual([
      [2, 10],
      [1, 10],
    ]);
  });

  it.each([
    [12, 3],
    [5, 5],
    [144, 12],
  ])('valide la division entière %i ÷ %i', (dividend, divisor) => {
    expect(division.isValid(dividend, divisor)).toBe(true);
  });

  it.each([
    [10, 3],
    [7, 2],
    [-12, 3],
    [12, -3],
    [-12, -3],
    [Number.NaN, 3],
    [12, Number.NaN],
    ['12', 3],
    [12, '3'],
    [null, 3],
    [12, undefined],
  ])('invalide les opérandes incompatibles %#', (dividend, divisor) => {
    expect(division.isValid(dividend, divisor)).toBe(false);
  });

  it('annonce uniquement les types de questions pris en charge', () => {
    expect(division.getSupportedTypes()).toEqual(['classic', 'mcq', 'gap', 'true_false']);
  });

  it('formate les questions problème et classiques', () => {
    expect(division.formatQuestion(20, 4, 'problem')).toBe('PROBLEM_TEMPLATE:20:4');
    expect(division.formatQuestion(20, 4, 'classic')).toBe('20 ÷ 4 = ?');
  });

  it('génère des distracteurs uniques, positifs et différents de la réponse', () => {
    const correctAnswer = 5;
    const distractors = division.generateDistractors(correctAnswer, 3);

    expect(distractors).toEqual([3, 4, 6]);
    expect(new Set(distractors).size).toBe(distractors.length);
    expect(distractors.every(value => value > 0 && value !== correctAnswer)).toBe(true);
  });

  it('génère des divisions entières et valides pour chaque niveau', () => {
    for (const difficulty of ['easy', 'medium', 'hard']) {
      for (let sample = 0; sample < 10; sample += 1) {
        const { a, b } = division.generateOperands(difficulty);
        const result = division.compute(a, b);

        expect(Number.isInteger(result)).toBe(true);
        expect(division.isValid(a, b)).toBe(true);
      }
    }
  });
});
