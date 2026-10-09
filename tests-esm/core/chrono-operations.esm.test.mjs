/* eslint-env jest, node */
/**
 * Chrono en addition, soustraction et division : grilles « n + k », « (n + k) − n »,
 * « (n × k) ÷ n », familles de calculs, poids du tirage et révision des deux sens.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals';

// Aléa piloté pour l'ordre des files ; le tirage garde l'aléa réel quand la file est vide
const draws = [];
jest.unstable_mockModule('../../js/core/random.js', () => ({
  randomFloat: () => (draws.length ? draws.shift() : Math.random()),
  randomInt: min => min,
  chance: () => false,
  pickRandom: items => items[0],
  shuffleInPlace: items => items,
}));

const q = await import('../../js/core/chrono-questions.js');

const grid = op =>
  q.chronoTables(op).flatMap(n => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(k => q.chronoFact(op, n, k)));

beforeEach(() => {
  draws.length = 0;
});

describe('Chrono : les grilles de chaque opération', () => {
  test('tables : 1 à 10, sauf la division (2 à 10, pas de ÷ 1)', () => {
    expect(q.chronoTables('×')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(q.chronoTables('+')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(q.chronoTables('−')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(q.chronoTables('÷')).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  test('table 7 : 7 + k, (7 + k) − 7, (7 × k) ÷ 7', () => {
    expect(q.chronoFact('+', 7, 3)).toEqual({ a: 7, b: 3 });
    expect(q.chronoFact('−', 7, 3)).toEqual({ a: 10, b: 7 });
    expect(q.chronoFact('÷', 7, 3)).toEqual({ a: 21, b: 7 });
    expect(q.chronoFact('×', 7, 3)).toEqual({ a: 7, b: 3 });
  });

  test('réponses : 2 à 20 en addition, 1 à 10 en soustraction et en division', () => {
    const answers = op => grid(op).map(({ a, b }) => q.chronoAnswer(op, a, b));
    expect(Math.min(...answers('+'))).toBe(2);
    expect(Math.max(...answers('+'))).toBe(20);
    for (const op of ['−', '÷']) {
      expect(new Set(answers(op))).toEqual(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
    }
    expect(grid('÷')).toHaveLength(90);
    expect(grid('÷').every(({ b }) => b >= 2)).toBe(true);
    expect(grid('÷').every(({ a, b }) => Number.isInteger(a / b))).toBe(true);
  });

  test('jeu complet : 10 tables, 9 en division', () => {
    expect(q.isFullTableSet([2, 3, 4, 5, 6, 7, 8, 9, 10], '÷')).toBe(true);
    expect(q.isFullTableSet([2, 3, 4, 5, 6, 7, 8, 9, 10], '+')).toBe(false);
    expect(q.isFullTableSet([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], '−')).toBe(true);
    // ÷ 1 ne compte pas : il n'existe pas en Chrono
    expect(q.isFullTableSet([1, 2, 3, 4, 5, 6, 7, 8, 9], '÷')).toBe(false);
  });
});

describe('Chrono : familles de calculs', () => {
  test('l’autre membre de la famille, ou rien', () => {
    expect(q.otherFactDirection('×', 6, 7)).toEqual({ a: 7, b: 6 });
    expect(q.otherFactDirection('+', 3, 8)).toEqual({ a: 8, b: 3 });
    expect(q.otherFactDirection('−', 15, 7)).toEqual({ a: 15, b: 8 });
    expect(q.otherFactDirection('÷', 56, 7)).toEqual({ a: 56, b: 8 });
    expect(q.otherFactDirection('×', 7, 7)).toBeNull();
    expect(q.otherFactDirection('+', 4, 4)).toBeNull();
    expect(q.otherFactDirection('−', 14, 7)).toBeNull();
    expect(q.otherFactDirection('÷', 49, 7)).toBeNull();
    // 7 ÷ 7 = 1 : l'autre sens diviserait par 1
    expect(q.otherFactDirection('÷', 7, 7)).toBeNull();
    expect(q.otherFactDirection('÷', 10, 10)).toBeNull();
  });

  test('clés d’une famille, signe de chaque opération (moins U+2212)', () => {
    expect(q.factKeys(15, 7, '−')).toEqual(['15−7', '15−8']);
    expect(q.factKeys(56, 7, '÷')).toEqual(['56÷7', '56÷8']);
    expect(q.factKeys(3, 8, '+')).toEqual(['3+8', '8+3']);
    expect(q.factKeys(7, 7, '÷')).toEqual(['7÷7']);
    // La multiplication garde ses deux clés, même pour 7 × 7
    expect(q.factKeys(7, 7)).toEqual(['7×7', '7×7']);
  });

  test('l’autre sens de chaque calcul de la grille est aussi dans la grille', () => {
    for (const op of ['+', '−', '÷']) {
      const keys = new Set(grid(op).map(({ a, b }) => `${a}${op}${b}`));
      for (const { a, b } of grid(op)) {
        const other = q.otherFactDirection(op, a, b);
        if (other) expect(keys.has(`${other.a}${op}${other.b}`)).toBe(true);
      }
    }
  });
});

describe('Chrono : poids du tirage hors multiplication', () => {
  test('addition et soustraction : le passage de la dizaine pèse quatre fois plus', () => {
    expect(q.chronoFactWeight('+', 8, 7, false)).toBe(12);
    expect(q.chronoFactWeight('+', 2, 3, false)).toBe(3);
    expect(q.chronoFactWeight('+', 10, 5, false)).toBe(3);
    // (8 + 7) − 8 = 15 − 8 : on casse la dizaine ; (10 + 5) − 10 = 15 − 10 : non
    expect(q.chronoFactWeight('−', 8, 7, false)).toBe(12);
    expect(q.chronoFactWeight('−', 10, 5, false)).toBe(3);
    expect(q.chronoFactWeight('−', 7, 10, false)).toBe(3);
  });

  test('toutes les tables : +1, +10, −1 et −10 deviennent rares', () => {
    expect(q.chronoFactWeight('+', 1, 5, true)).toBeCloseTo(3 * 0.06);
    expect(q.chronoFactWeight('+', 5, 10, true)).toBeCloseTo(3 * 0.2);
    expect(q.chronoFactWeight('−', 10, 4, true)).toBeCloseTo(3 * 0.06);
    expect(q.chronoFactWeight('−', 8, 7, true)).toBe(12);
  });

  test('division : le poids de la multiplication sur le diviseur et le quotient', () => {
    for (const n of q.chronoTables('÷')) {
      for (const k of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
        expect(q.chronoFactWeight('÷', n, k, true)).toBe(q.chronoPairWeight(n, k, true));
      }
    }
  });
});

describe('Chrono : tirage d’une course hors multiplication', () => {
  test('chaque calcul tiré est dans la grille de l’opération', () => {
    for (const op of ['+', '−', '÷']) {
      const keys = new Set(grid(op).map(({ a, b }) => `${a}${op}${b}`));
      for (let i = 0; i < 300; i += 1) {
        const { a, b } = q.pickChronoFact(op, q.chronoTables(op));
        expect(keys.has(`${a}${op}${b}`)).toBe(true);
      }
    }
  });

  test('après 15 − 7, ni 15 − 7 ni 15 − 8 dans la même course', () => {
    const avoid = q.factKeys(15, 7, '−');
    for (let i = 0; i < 400; i += 1) {
      const { a, b } = q.pickChronoFact('−', q.chronoTables('−'), avoid);
      expect([`${a}−${b}`]).not.toContain('15−7');
      expect([`${a}−${b}`]).not.toContain('15−8');
    }
  });

  test('l’aléa parcourt la grille dans l’ordre des tables, avec les poids', () => {
    draws.push(0);
    expect(q.pickChronoFact('÷', q.chronoTables('÷'))).toEqual({ a: 2, b: 2 });
    draws.push(0.999999);
    expect(q.pickChronoFact('+', q.chronoTables('+'))).toEqual({ a: 10, b: 10 });
    draws.push(0);
    expect(q.pickChronoFact('−', q.chronoTables('−'))).toEqual({ a: 2, b: 1 });
  });

  test('la multiplication tire comme avant : mêmes tables, même ordre', () => {
    draws.push(0.5);
    const viaFact = q.pickChronoFact('×', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    draws.push(0.5);
    const viaPair = q.pickChronoPair([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(viaFact).toEqual({ a: viaPair.t, b: viaPair.n });
  });
});

describe('Chrono : révision des deux sens, par famille', () => {
  const asText = (queue, op) => queue.map(({ a, b }) => `${a}${op}${b}`);

  test('soustraction : 15 − 7 puis 15 − 8, jamais 7 − 15', () => {
    const queue = q.refillRevisionQueue([], [{ a: 15, b: 7, due: 1 }], '−');
    expect(asText(queue, '−')).toEqual(['15−7', '15−8']);
  });

  test('division : 56 ÷ 7 puis 56 ÷ 8 ; pour 7 ÷ 7, jamais 7 ÷ 1', () => {
    expect(asText(q.refillRevisionQueue([], [{ a: 56, b: 7, due: 1 }], '÷'), '÷')).toEqual([
      '56÷7',
      '56÷8',
    ]);
    expect(asText(q.refillRevisionQueue([], [{ a: 7, b: 7, due: 1 }], '÷'), '÷')).toEqual([
      '7÷7',
      '7÷7',
    ]);
  });

  test('addition : les deux sens, comme la multiplication', () => {
    const queue = q.refillRevisionQueue([], [{ a: 3, b: 8, due: 2 }], '+');
    expect(asText(queue, '+')).toEqual(['3+8', '8+3', '3+8']);
  });

  test('le prochain calcul de révision suit la famille de l’opération', () => {
    const basket = [{ a: 15, b: 7, due: 1 }];
    const queue = [];
    expect(q.takeNextRevisionFact(queue, basket, undefined, '−')).toEqual({ a: 15, b: 7 });
    expect(q.takeNextRevisionFact(queue, basket, { a: 15, b: 7 }, '−')).toEqual({ a: 15, b: 8 });
  });
});
