/* eslint-env jest, node */
/**
 * QCM et bulles de MultiSnake : la place de la bonne réponse parmi les réponses proposées ne la
 * trahit pas. Les leurres étaient tirés au hasard d'un réservoir symétrique (un de plus, un de
 * moins, une ligne de table à côté) : la bonne réponse se retrouvait presque toujours au milieu,
 * et n'était la plus grande ou la plus petite que dans 1 à 5 % des questions.
 */
import { describe, test, expect } from '@jest/globals';
import { buildAnswerOptions, plausibleWrongAnswers } from '../../js/core/GameMode.js';

const between = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i);
const mcq = (operator, a, b, answer) => ({
  question: `${a} ${operator} ${b} = ?`,
  answer,
  type: 'mcq',
  operator,
  a,
  b,
});

/** Questions ordinaires : assez de leurres plausibles de part et d'autre de la bonne réponse */
const QUESTIONS = [
  ...between(3, 9).flatMap(a => between(3, 9).map(b => mcq('×', a, b, a * b))),
  ...between(6, 15).flatMap(a => between(4, 9).map(b => mcq('+', a, b, a + b))),
  ...between(6, 15).flatMap(a => between(4, 9).map(b => mcq('−', a + b, b, a))),
  ...between(3, 9).flatMap(b => between(4, 9).map(q => mcq('÷', b * q, b, q))),
];

/** Rang de la bonne réponse parmi les réponses proposées, de la plus petite (0) à la plus grande */
function rankOf(answer, options) {
  const sorted = [...options];
  sorted.sort((left, right) => left - right);
  return sorted.indexOf(answer);
}

describe('Réponses proposées : la place de la bonne réponse', () => {
  test('chacune des quatre places sort environ une fois sur quatre', () => {
    const counts = new Map([0, 1, 2, 3].map(rank => [rank, 0]));
    for (let round = 0; round < 8; round += 1) {
      for (const question of QUESTIONS) {
        const rank = rankOf(question.answer, buildAnswerOptions(question));
        counts.set(rank, counts.get(rank) + 1);
      }
    }
    const total = QUESTIONS.length * 8;
    for (const [rank, n] of counts) {
      const share = n / total;
      expect([rank, share > 0.18 && share < 0.32]).toEqual([rank, true]);
    }
  });

  test('un seul côté possible (5 − 5, 10 × 10) : les leurres prennent l’autre, toujours trois', () => {
    for (let run = 0; run < 30; run += 1) {
      const zero = plausibleWrongAnswers(mcq('−', 5, 5, 0));
      expect(zero.every(value => value > 0)).toBe(true);
      expect(new Set(zero).size).toBe(3);
      const hundred = plausibleWrongAnswers(mcq('×', 10, 10, 100));
      expect(hundred.every(value => value < 100)).toBe(true);
      expect(new Set(hundred).size).toBe(3);
    }
  });
});
