/* eslint-env jest, node */
/**
 * Caractérisation du Chrono en multiplication, figée avant l'ouverture aux autres opérations :
 * poids et ordre du tirage, file de révision, clés et normalisation du stockage, profil ancien
 * relu à l'identique. Ces valeurs viennent du code publié (v36) ; un changement de l'une
 * d'elles est une régression du ×, pas une mise à jour de test.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals';

// Aléa piloté : chaque tirage prend la valeur suivante de la file, le mélange ne fait rien
const draws = [];
jest.unstable_mockModule('../../js/core/random.js', () => ({
  randomFloat: () => (draws.length ? draws.shift() : 0),
  randomInt: min => min,
  chance: () => false,
  pickRandom: items => items[0],
  shuffleInPlace: items => items,
}));

const questions = await import('../../js/core/chrono-questions.js');
const stats = await import('../../js/core/chrono-stats.js');
const { legacyPlayers } = await import('../helpers/legacy-profiles.mjs');

const ALL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

beforeEach(() => {
  draws.length = 0;
});

describe('Chrono × : poids du tirage', () => {
  test('jeu complet : la grille des 100 poids', () => {
    const grid = ALL.map(t => ALL.map(n => questions.chronoPairWeight(t, n, true)));
    // Ligne t, colonne n (1 à 10) ; arrondi au millième pour la lecture
    const rounded = grid.map(row => row.map(w => Math.round(w * 1000) / 1000));
    expect(rounded).toEqual([
      [0.012, 0.18, 0.48, 0.54, 0.24, 0.96, 1.08, 0.96, 0.72, 0.012],
      [0.6, 9, 24, 27, 12, 48, 54, 48, 36, 0.6],
      [1.6, 24, 64, 72, 32, 128, 144, 128, 96, 1.6],
      [1.8, 27, 72, 81, 36, 144, 162, 144, 108, 1.8],
      [0.8, 12, 32, 36, 16, 64, 72, 64, 48, 0.8],
      [3.2, 48, 128, 144, 64, 256, 288, 256, 192, 3.2],
      [3.6, 54, 144, 162, 72, 288, 324, 288, 216, 3.6],
      [3.2, 48, 128, 144, 64, 256, 288, 256, 192, 3.2],
      [2.4, 36, 96, 108, 48, 192, 216, 192, 144, 2.4],
      [0.012, 0.18, 0.48, 0.54, 0.24, 0.96, 1.08, 0.96, 0.72, 0.012],
    ]);
  });

  test('tables choisies : 1 et 10 gardent leur poids, sans pénalité', () => {
    expect(questions.chronoPairWeight(1, 1, false)).toBe(1);
    expect(questions.chronoPairWeight(10, 7, false)).toBe(18);
    expect(questions.chronoPairWeight(7, 8, false)).toBe(288);
    expect(questions.chronoPairWeight(2, 5, false)).toBe(12);
  });

  test('jeu complet = les dix tables, ni plus ni moins', () => {
    expect(questions.isFullTableSet(ALL)).toBe(true);
    expect(questions.isFullTableSet([...ALL, 10, '3'])).toBe(true);
    expect(questions.isFullTableSet([2, 3, 4, 5, 6, 7, 8, 9, 10])).toBe(false);
    expect(questions.isFullTableSet([])).toBe(false);
  });

  test('tables des Paramètres : les exclusions ne valent que si elles sont activées', () => {
    expect(questions.includedTablesFromExclusions([1, 10], true)).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
    expect(questions.includedTablesFromExclusions([1, 10], false)).toEqual(ALL);
    expect(questions.includedTablesFromExclusions(ALL, true)).toEqual(ALL);
    expect(questions.includedTablesFromExclusions(undefined, true)).toEqual(ALL);
  });
});

describe('Chrono × : ordre du tirage', () => {
  // Le tirage parcourt les tables puis les multiplicandes dans l'ordre, et s'arrête où le
  // cumul des poids dépasse aléa × total
  const pickAt = (r, tables = ALL, avoid = [], recent = []) => {
    draws.push(r);
    return questions.pickChronoPair(tables, avoid, recent);
  };

  test('jeu complet : le calcul tiré pour quelques valeurs de l’aléa', () => {
    const picked = [0, 0.05, 0.2, 0.35, 0.5, 0.65, 0.8, 0.95, 0.999].map(r => {
      const { t, n } = pickAt(r);
      return `${t}×${n}`;
    });
    expect(picked).toEqual(['1×1', '3×4', '4×8', '6×6', '7×4', '7×9', '8×8', '9×7', '9×10']);
  });

  test('une seule table : le multiplicande suit les poids', () => {
    const picked = [0, 0.3, 0.6, 0.9].map(r => pickAt(r, [7]).n);
    expect(picked).toEqual([1, 6, 7, 9]);
  });

  test('sans table valide, repli sur les tables 2 à 9', () => {
    const { t } = pickAt(0, []);
    expect(t).toBe(2);
  });

  test('un calcul déjà posé (dans un sens ou dans l’autre) n’est plus tiré', () => {
    const avoid = questions.factKeys(1, 1);
    expect(pickAt(0, ALL, avoid)).toEqual({ t: 1, n: 2 });
    expect(questions.factKeys('8', 6)).toEqual(['8×6', '6×8']);
  });

  test('tout est posé : on reprend tout sauf le dernier, puis tout', () => {
    const single = [5];
    const all = ALL.flatMap(n => questions.factKeys(5, n));
    expect(pickAt(0, single, all, questions.factKeys(5, 1))).toEqual({ t: 5, n: 2 });
    const everything = ALL.flatMap(n => questions.factKeys(5, n));
    expect(pickAt(0, single, everything, everything)).toEqual({ t: 5, n: 1 });
  });
});

describe('Chrono × : file de révision', () => {
  test('les copies se partagent les deux sens, puis les doublons d’affilée sont écartés', () => {
    const basket = [
      { a: 6, b: 7, due: 2 },
      { a: 8, b: 8, due: 1 },
      { a: 3, b: 9, due: 1 },
    ];
    const queue = questions.refillRevisionQueue([], basket);
    expect(queue.map(({ a, b }) => `${a}×${b}`)).toEqual([
      '6×7',
      '7×6',
      '6×7',
      '8×8',
      '3×9',
      '8×8',
      '9×3',
    ]);
  });

  test('le prochain calcul évite de reposer le dernier, même sens seulement', () => {
    const basket = [
      { a: 6, b: 7, due: 1 },
      { a: 2, b: 4, due: 1 },
    ];
    const queue = [
      { a: 6, b: 7 },
      { a: 7, b: 6 },
      { a: 2, b: 4 },
    ];
    expect(questions.takeNextRevisionFact(queue, basket, { a: 6, b: 7 })).toEqual({ a: 7, b: 6 });
    expect(questions.takeNextRevisionFact(queue, basket, { a: 9, b: 9 })).toEqual({ a: 6, b: 7 });
    expect(questions.takeNextRevisionFact([], [], undefined)).toBeUndefined();
  });
});

describe('Chrono × : clés du stockage', () => {
  test('classement = tables triées sans doublon, puis la façon de répondre', () => {
    expect(stats.bucketKey(ALL, 'keypad')).toBe('1,2,3,4,5,6,7,8,9,10|keypad');
    expect(stats.bucketKey([7], 'mcq')).toBe('7|mcq');
    expect(stats.bucketKey([9, 2, 2, '3'], 'autre')).toBe('2,3,9|mcq');
    expect(stats.tablesKey([10, 1, 11, 0])).toBe('1,10');
    expect(stats.tablesListLabel([3, 7])).toBe('3, 7');
  });

  test('lecture d’une clé publiée', () => {
    expect(stats.parseBucketKey('1,2,3,4,5,6,7,8,9,10|keypad')).toEqual({
      tables: ALL,
      inputMode: 'keypad',
    });
    expect(stats.parseBucketKey('7|mcq')).toEqual({ tables: [7], inputMode: 'mcq' });
    expect(stats.parseBucketKey('7|autre')).toBeNull();
    expect(stats.parseBucketKey('|keypad')).toBeNull();
  });
});

describe('Chrono × : un profil publié se relit à l’identique', () => {
  test('les classements de Zoé gardent clés, parties, temps et ordre', () => {
    const raw = legacyPlayers()['Zoé'].chronoStats;
    const store = stats.normalizeChronoStats(raw);
    expect(store.buckets.map(b => [b.key, b.count, b.totalMs])).toEqual([
      ['1,2,3,4,5,6,7,8,9,10|keypad', 6, 245600],
      ['7|mcq', 2, 41200],
      ['2,3,4,5,6,7,8,9,10|keypad', 1, 52300],
    ]);
    expect(store.buckets[0].best.map(s => s.durationMs)).toEqual([
      35200, 36800, 39400, 41900, 44100, 48200,
    ]);
    expect(store.buckets[0].recent.map(s => s.durationMs)).toEqual([
      48200, 41900, 39400, 44100, 36800, 35200,
    ]);
    expect(store.lastInputMode).toBe('mcq');
  });

  test('la liste de Zoé : « errors » de la première version devient « due »', () => {
    const store = stats.normalizeChronoStats(legacyPlayers()['Zoé'].chronoStats);
    expect(store.basket).toEqual([
      { a: 6, b: 7, due: 2 },
      { a: 8, b: 9, due: 1 },
      { a: 7, b: 8, due: 2 },
    ]);
  });

  test('normaliser deux fois ne change rien', () => {
    const once = stats.normalizeChronoStats(legacyPlayers()['Zoé'].chronoStats);
    expect(stats.normalizeChronoStats(JSON.parse(JSON.stringify(once)))).toEqual(once);
  });

  test('les parties jouées, de la plus fréquente à la plus rare', () => {
    const store = stats.normalizeChronoStats(legacyPlayers()['Zoé'].chronoStats);
    expect(
      stats.listPlayedChronoBuckets(store).map(row => [row.key, row.games, row.averageMs])
    ).toEqual([
      ['1,2,3,4,5,6,7,8,9,10|keypad', 6, 245600 / 6],
      ['7|mcq', 2, 20600],
      ['2,3,4,5,6,7,8,9,10|keypad', 1, 52300],
    ]);
  });
});

describe('Chrono × : une course enregistrée', () => {
  const race = (store, durationMs, facts = []) =>
    stats.saveChronoSession(store, {
      tables: ALL,
      inputMode: 'keypad',
      durationMs,
      date: 1000 + durationMs,
      facts,
    });

  test('sur le profil de Zoé : record, rang, moyenne, calculs ratés fusionnés', () => {
    const store = stats.normalizeChronoStats(legacyPlayers()['Zoé'].chronoStats);
    const outcome = race(store, 30000, [
      { a: 7, b: 6, correct: false },
      { a: 4, b: 4, correct: false },
      { a: 9, b: 9, correct: true },
    ]);
    expect(outcome).toEqual({
      first: false,
      record: true,
      rank: 1,
      count: 7,
      averageMs: 275600 / 7,
      added: [
        { a: 7, b: 6, correct: false },
        { a: 4, b: 4, correct: false },
      ],
    });
    // 7 × 6 tombe sur la ligne 6 × 7 ; 4 × 4 entre à la fin
    expect(store.basket).toEqual([
      { a: 6, b: 7, due: 3 },
      { a: 8, b: 9, due: 1 },
      { a: 7, b: 8, due: 2 },
      { a: 4, b: 4, due: 1 },
    ]);
    expect(store.buckets[0].best).toHaveLength(7);
  });

  test('première partie d’un classement : ni record ni rang comparé', () => {
    const store = stats.emptyChronoStats();
    expect(race(store, 42000)).toEqual({
      first: true,
      record: false,
      rank: 1,
      count: 1,
      averageMs: 42000,
      added: [],
    });
    expect(store.buckets[0].key).toBe('1,2,3,4,5,6,7,8,9,10|keypad');
  });

  test('ajout à la main, retrait, liste vidée', () => {
    const store = stats.emptyChronoStats();
    expect(stats.addManualBasketFact(store, '6', '7')).toBe(true);
    expect(stats.addManualBasketFact(store, 7, 6)).toBe(true);
    expect(stats.addManualBasketFact(store, 6, 7)).toBe(true);
    expect(stats.addManualBasketFact(store, 11, 2)).toBe(false);
    expect(store.basket).toEqual([
      { a: 6, b: 7, due: 2 },
      { a: 7, b: 6, due: 1 },
    ]);
    stats.removeFromBasket(store, { a: '7', b: '6' });
    expect(store.basket).toEqual([{ a: 6, b: 7, due: 2 }]);
    stats.emptyBasket(store);
    expect(store.basket).toEqual([]);
  });

  test('révision : compteurs en mémoire, puis la liste à la fin', () => {
    const store = stats.normalizeChronoStats(legacyPlayers()['Zoé'].chronoStats);
    const tally = stats.startRevisionTally(store.basket);
    stats.tallyRevisionAnswer(tally, { a: 7, b: 6 }, true);
    stats.tallyRevisionAnswer(tally, { a: 6, b: 7 }, true);
    stats.tallyRevisionAnswer(tally, { a: 9, b: 8 }, true);
    stats.tallyRevisionAnswer(tally, { a: 7, b: 8 }, false);
    expect(stats.applyRevisionTally(store, tally)).toEqual({
      mastered: [
        { a: 6, b: 7 },
        { a: 8, b: 9 },
      ],
      remaining: 1,
    });
    expect(store.basket).toEqual([{ a: 7, b: 8, due: 3 }]);
  });
});
