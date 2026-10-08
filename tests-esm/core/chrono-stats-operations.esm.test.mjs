/* eslint-env jest, node */
/**
 * Stockage de Chrono en addition, soustraction et division : chaque opération a ses
 * classements et sa liste à revoir, rangés à part de la multiplication.
 */
import { describe, test, expect } from '@jest/globals';
import {
  isChronoFact,
  bucketKey,
  parseBucketKey,
  normalizeChronoOperatorStats,
  normalizeChronoStatsByOperator,
  normalizeChronoStats,
  saveChronoSession,
  addToBasket,
  addManualBasketFact,
  startRevisionTally,
  tallyRevisionAnswer,
  applyRevisionTally,
  listPlayedChronoBuckets,
  findBucket,
} from '../../js/core/chrono-stats.js';

const TEN = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const DIV = [2, 3, 4, 5, 6, 7, 8, 9, 10];
const empty = () => ({ buckets: [], basket: [] });

describe('Chrono hors multiplication : calculs valides', () => {
  test('addition : 1–10 + 1–10', () => {
    expect(isChronoFact('+', 7, 3)).toBe(true);
    expect(isChronoFact('+', 10, 10)).toBe(true);
    expect(isChronoFact('+', 11, 3)).toBe(false);
    expect(isChronoFact('+', 0, 3)).toBe(false);
  });

  test('soustraction : (n + k) − n, réponse de 1 à 10', () => {
    expect(isChronoFact('−', 15, 7)).toBe(true);
    expect(isChronoFact('−', 20, 10)).toBe(true);
    expect(isChronoFact('−', 7, 15)).toBe(false);
    expect(isChronoFact('−', 15, 3)).toBe(false); // réponse 12
    expect(isChronoFact('−', 7, 7)).toBe(false); // réponse 0
  });

  test('division : (n × k) ÷ n, diviseur de 2 à 10, quotient de 1 à 10', () => {
    expect(isChronoFact('÷', 56, 7)).toBe(true);
    expect(isChronoFact('÷', 7, 7)).toBe(true);
    expect(isChronoFact('÷', 7, 1)).toBe(false);
    expect(isChronoFact('÷', 56, 9)).toBe(false);
    expect(isChronoFact('÷', 7, 56)).toBe(false);
    expect(isChronoFact('÷', 110, 10)).toBe(false); // quotient 11
  });
});

describe('Chrono hors multiplication : classements', () => {
  test('la division n’a pas de table de 1', () => {
    expect(bucketKey(TEN, 'keypad', '÷')).toBe('2,3,4,5,6,7,8,9,10|keypad');
    expect(parseBucketKey('1,2,3|mcq', '÷')).toEqual({ tables: [2, 3], inputMode: 'mcq' });
    expect(bucketKey(TEN, 'mcq', '+')).toBe('1,2,3,4,5,6,7,8,9,10|mcq');
  });

  test('une course de soustraction : classement, puis les erreurs d’une même famille', () => {
    const store = empty();
    const outcome = saveChronoSession(store, {
      tables: TEN,
      inputMode: 'keypad',
      durationMs: 21000,
      date: 1,
      operator: '−',
      facts: [
        { a: 15, b: 7, correct: false },
        { a: 15, b: 8, correct: false },
        { a: 9, b: 4, correct: true },
        { a: 7, b: 15, correct: false },
      ],
    });
    expect(outcome.first).toBe(true);
    expect(store.buckets.map(b => [b.key, b.count])).toEqual([['1,2,3,4,5,6,7,8,9,10|keypad', 1]]);
    // 15 − 8 tombe sur la ligne 15 − 7 ; 7 − 15 n'est pas un calcul de Chrono
    expect(store.basket).toEqual([{ a: 15, b: 7, due: 2 }]);
    expect(findBucket(store, TEN, 'keypad', '−')?.count).toBe(1);
    expect(listPlayedChronoBuckets(store, '−').map(row => row.key)).toEqual([
      '1,2,3,4,5,6,7,8,9,10|keypad',
    ]);
  });

  test('une course de division se range sans table de 1, même si on la lui donne', () => {
    const store = empty();
    saveChronoSession(store, {
      tables: TEN,
      inputMode: 'mcq',
      durationMs: 30000,
      date: 1,
      operator: '÷',
      facts: [],
    });
    expect(store.buckets.map(b => b.key)).toEqual(['2,3,4,5,6,7,8,9,10|mcq']);
    expect(findBucket(store, DIV, 'mcq', '÷')?.count).toBe(1);
  });

  test('division : 56 ÷ 8 tombe sur la ligne 56 ÷ 7 ; 7 ÷ 7 garde la sienne', () => {
    const store = empty();
    addToBasket(store, { a: 56, b: 7 }, '÷');
    addToBasket(store, { a: 56, b: 8 }, '÷');
    addToBasket(store, { a: 7, b: 7 }, '÷');
    addToBasket(store, { a: 7, b: 1 }, '÷');
    expect(store.basket).toEqual([
      { a: 56, b: 7, due: 2 },
      { a: 7, b: 7, due: 1 },
    ]);
  });

  test('addition : 3 + 8 et 8 + 3 partagent une ligne ; à la main, chacun la sienne', () => {
    const store = empty();
    addToBasket(store, { a: 3, b: 8 }, '+');
    addToBasket(store, { a: 8, b: 3 }, '+');
    expect(store.basket).toEqual([{ a: 3, b: 8, due: 2 }]);
    expect(addManualBasketFact(store, 8, 3, '+')).toBe(true);
    expect(addManualBasketFact(store, 7, 15, '−')).toBe(false);
    expect(store.basket).toEqual([
      { a: 3, b: 8, due: 2 },
      { a: 8, b: 3, due: 1 },
    ]);
  });
});

describe('Chrono hors multiplication : révision', () => {
  test('soustraction : réussir 15 − 8 compte pour la ligne 15 − 7', () => {
    const store = { buckets: [], basket: [{ a: 15, b: 7, due: 1 }] };
    const tally = startRevisionTally(store.basket, '−');
    tallyRevisionAnswer(tally, { a: 15, b: 8 }, true, '−');
    expect(applyRevisionTally(store, tally, '−')).toEqual({
      mastered: [{ a: 15, b: 7 }],
      remaining: 0,
    });
  });

  test('division : une erreur sur 56 ÷ 8 ajoute 1 à la ligne 56 ÷ 7', () => {
    const store = { buckets: [], basket: [{ a: 56, b: 7, due: 1 }] };
    const tally = startRevisionTally(store.basket, '÷');
    tallyRevisionAnswer(tally, { a: 56, b: 8 }, false, '÷');
    applyRevisionTally(store, tally, '÷');
    expect(store.basket).toEqual([{ a: 56, b: 7, due: 2 }]);
  });
});

describe('Chrono hors multiplication : normalisation du profil', () => {
  test('une réserve par opération, rien d’autre, et la même chose à la relecture', () => {
    const raw = {
      '+': {
        buckets: [
          { key: '1,2,3,4,5,6,7,8,9,10|mcq', count: 2, totalMs: 40000, best: [], recent: [] },
        ],
        basket: [
          { a: 7, b: 3, due: 2 },
          { a: 7, b: 3, due: 1 },
          { a: 12, b: 3, due: 1 },
        ],
        inconnu: true,
      },
      '−': {
        basket: [
          { a: 15, b: 7 },
          { a: 7, b: 15 },
        ],
      },
      '÷': {
        basket: [
          { a: 56, b: 7, due: 3 },
          { a: 7, b: 1, due: 1 },
        ],
        buckets: 'n’importe quoi',
      },
      '×': { basket: [{ a: 6, b: 7 }] },
      autre: 1,
    };
    const store = normalizeChronoStatsByOperator(raw);
    expect(Object.keys(store)).toEqual(['+', '−', '÷']);
    expect(store['+'].basket).toEqual([{ a: 7, b: 3, due: 2 }]);
    expect(store['+'].buckets.map(b => [b.key, b.count])).toEqual([
      ['1,2,3,4,5,6,7,8,9,10|mcq', 2],
    ]);
    expect(store['−']).toEqual({ buckets: [], basket: [{ a: 15, b: 7, due: 1 }] });
    expect(store['÷']).toEqual({ buckets: [], basket: [{ a: 56, b: 7, due: 3 }] });
    expect(normalizeChronoStatsByOperator(JSON.parse(JSON.stringify(store)))).toEqual(store);
  });

  test('profil sans Chrono hors multiplication : trois réserves vides', () => {
    expect(normalizeChronoStatsByOperator(undefined)).toEqual({
      '+': empty(),
      '−': empty(),
      '÷': empty(),
    });
    expect(normalizeChronoOperatorStats(null, '÷')).toEqual(empty());
  });

  test('la multiplication ne lit jamais un calcul d’une autre opération', () => {
    const store = normalizeChronoStats({
      buckets: [],
      basket: [
        { a: 15, b: 7, due: 1 },
        { a: 56, b: 7, due: 1 },
        { a: 6, b: 7, due: 1 },
      ],
    });
    expect(store.basket).toEqual([{ a: 6, b: 7, due: 1 }]);
    expect(DIV).toHaveLength(9);
  });
});
