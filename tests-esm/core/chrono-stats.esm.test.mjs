import { describe, expect, test } from '@jest/globals';
import { classifyTypedAnswer } from '../../js/core/chrono-input.js';
import {
  chronoPairWeight,
  factKeys,
  pickChronoPair,
  takeNextRevisionFact,
  includedTablesFromExclusions,
  refillRevisionQueue,
  separateRevisionRepeats,
} from '../../js/core/chrono-questions.js';
import {
  tablesKey,
  bucketKey,
  emptyChronoStats,
  lastChronoInputMode,
  normalizeChronoStats,
  sessionAverageMs,
  setLastChronoInputMode,
  listPlayedChronoBuckets,
  parseBucketKey,
  tablesListLabel,
  saveChronoSession,
  rankedSessions,
  recentSessions,
  formatDuration,
  formatSessionDate,
  niceDurationMaxMs,
  formatAxisSeconds,
  addToBasket,
  addManualBasketFact,
  basketDueClass,
  grantChronoCoins,
  chronoShouldContinue,
  findBucket,
  startRevisionTally,
  tallyRevisionAnswer,
  applyRevisionTally,
} from '../../js/core/chrono-stats.js';

const NBSP = ' ';

/** Dernier calcul posé, à partir de sa clé « 6×7 » */
function lastFact(keys) {
  const [a, b] = keys.at(-1).split('×').map(Number);
  return { a, b };
}

/** Une partie terminée, réduite à ce qui compte pour le classement */
function save(store, durationMs, date, { tables = [7], inputMode = 'keypad', facts = [] } = {}) {
  return saveChronoSession(store, { tables, inputMode, durationMs, date, facts });
}

describe('chrono-input', () => {
  test('accepte la valeur dès qu’elle est complète', () => {
    expect(classifyTypedAnswer('3', 36)).toBe('prefix');
    expect(classifyTypedAnswer('36', 36)).toBe('correct');
  });

  test('refuse un chiffre qui ne peut pas être un préfixe', () => {
    expect(classifyTypedAnswer('4', 36)).toBe('wrong');
  });
});

describe('chrono-stats : classements', () => {
  test('sépare les classements par tables et par saisie', () => {
    expect(tablesKey([7, 3, 3])).toBe('3,7');
    expect(bucketKey([3, 7], 'mcq')).not.toBe(bucketKey([3, 7], 'keypad'));
    expect(parseBucketKey('3,7|keypad')).toEqual({ tables: [3, 7], inputMode: 'keypad' });
    expect(tablesListLabel([7, 3])).toBe('3, 7');
  });

  test('la liste des stats compte les parties par tables et par saisie', () => {
    const store = emptyChronoStats();
    save(store, 10000, 1, { tables: [3], inputMode: 'mcq' });
    save(store, 9000, 2, { tables: [3], inputMode: 'mcq' });
    save(store, 11000, 3, { tables: [2, 3], inputMode: 'keypad' });
    const rows = listPlayedChronoBuckets(store);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ tables: [3], inputMode: 'mcq', games: 2 });
    expect(rows[1]).toMatchObject({ tables: [2, 3], inputMode: 'keypad', games: 1 });
  });

  test('une partie avec des erreurs compte dès 10 justes', () => {
    expect(chronoShouldContinue({ isRevision: false, correctAnswers: 9, questionCount: 11 })).toBe(
      true
    );
    expect(chronoShouldContinue({ isRevision: false, correctAnswers: 10, questionCount: 12 })).toBe(
      false
    );
  });

  test('une révision s’arrête à 10 questions, même avec des erreurs', () => {
    expect(chronoShouldContinue({ isRevision: true, correctAnswers: 6, questionCount: 9 })).toBe(
      true
    );
    expect(chronoShouldContinue({ isRevision: true, correctAnswers: 6, questionCount: 10 })).toBe(
      false
    );
  });

  test('une partie avec erreurs entre au classement', () => {
    const store = emptyChronoStats();
    save(store, 18000, 1, {
      tables: [3],
      inputMode: 'mcq',
      facts: [
        { a: 3, b: 3, ms: 800, correct: false },
        { a: 3, b: 7, ms: 400, correct: true },
      ],
    });
    const bucket = findBucket(store, [3], 'mcq');
    expect(rankedSessions(bucket)).toEqual([{ durationMs: 18000, date: 1 }]);
  });

  test('la moyenne affichée est celle de toutes les parties', () => {
    const store = emptyChronoStats();
    save(store, 10000, 1, { tables: [2] });
    save(store, 20000, 2, { tables: [2] });
    expect(sessionAverageMs(findBucket(store, [2], 'keypad'))).toBe(15000);
  });

  test('le profil ne grossit plus : 10 meilleurs temps, 20 derniers, moyenne exacte', () => {
    const store = emptyChronoStats();
    for (let i = 1; i <= 25; i += 1) save(store, 1000 * i, i);
    const bucket = findBucket(store, [7], 'keypad');
    expect(bucket.count).toBe(25);
    expect(sessionAverageMs(bucket)).toBe(13000);
    expect(rankedSessions(bucket).map(session => session.durationMs)).toEqual(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => n * 1000)
    );
    const recent = recentSessions(bucket).map(session => session.date);
    expect(recent).toHaveLength(20);
    expect(recent[0]).toBe(6);
    expect(recent.at(-1)).toBe(25);
    expect(JSON.stringify(store).length).toBeLessThan(2500);
  });

  test('record et rang se comparent aux parties d’avant, pas à elle-même', () => {
    const store = emptyChronoStats();
    expect(save(store, 30000, 1)).toMatchObject({ first: true, record: false, count: 1 });
    expect(save(store, 25000, 2)).toMatchObject({ first: false, record: true, rank: 1 });
    expect(save(store, 28000, 3)).toMatchObject({ record: false, rank: 2, count: 3 });
    expect(save(store, 25000, 4)).toMatchObject({ record: false, rank: 2 });
  });

  test('au-delà des 10 meilleurs temps, pas de rang', () => {
    const store = emptyChronoStats();
    for (let i = 1; i <= 10; i += 1) save(store, 1000 * i, i);
    expect(save(store, 99000, 11)).toMatchObject({ record: false, rank: null, count: 11 });
  });

  test('lire un classement ne le crée pas', () => {
    const store = emptyChronoStats();
    expect(findBucket(store, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 'mcq')).toBeNull();
    expect(store.buckets).toEqual([]);
  });

  test('le mode de saisie du profil se souvient du dernier choix', () => {
    expect(lastChronoInputMode(emptyChronoStats())).toBe('keypad');
    expect(lastChronoInputMode(normalizeChronoStats({ lastInputMode: 'mcq' }))).toBe('mcq');
    const store = emptyChronoStats();
    setLastChronoInputMode(store, 'mcq');
    expect(lastChronoInputMode(store)).toBe('mcq');
  });
});

describe('chrono-stats : normalisation', () => {
  const raw = {
    buckets: [
      {
        key: '7,3|keypad',
        count: 12,
        totalMs: 240000,
        best: Array.from({ length: 14 }, (_, i) => ({ durationMs: 30000 - i * 1000, date: i })),
        recent: Array.from({ length: 30 }, (_, i) => ({ durationMs: 20000, date: 100 + i })),
        factTimes: [{ a: 7, b: 8, ms: 900 }],
      },
      { key: 'pas-un-classement', count: 3 },
      { key: '3,7|keypad', count: 1, totalMs: 1 },
    ],
    basket: [
      { a: 7, b: 8, due: 2 },
      { a: '6', b: '9', errors: 3 },
      { a: 7, b: 8, due: 9 },
      { a: 12, b: 3, due: 1 },
      { a: 0, b: 5, due: 1 },
      { a: 4, b: 4, due: 0 },
    ],
    lastInputMode: 'mcq',
    inconnu: true,
  };

  test('ne garde que les champs connus, plafonnés, triés et dédoublonnés', () => {
    const store = normalizeChronoStats(raw);
    expect(Object.keys(store).sort()).toEqual(['basket', 'buckets', 'lastInputMode']);
    expect(store.buckets).toHaveLength(1);
    const [bucket] = store.buckets;
    expect(bucket.key).toBe('3,7|keypad');
    expect(Object.keys(bucket).sort()).toEqual(['best', 'count', 'key', 'recent', 'totalMs']);
    expect(bucket.best).toHaveLength(10);
    expect(bucket.best[0].durationMs).toBe(17000);
    expect(bucket.recent).toHaveLength(20);
    expect(bucket.recent[0].date).toBe(110);
    expect(bucket.count).toBe(20);
  });

  test('le panier ne garde que des calculs 1–10 × 1–10, une fois chacun', () => {
    expect(normalizeChronoStats(raw).basket).toEqual([
      { a: 7, b: 8, due: 2 },
      { a: 6, b: 9, due: 3 },
      { a: 4, b: 4, due: 1 },
    ]);
  });

  test('est idempotente : elle tourne à chaque lecture du profil', () => {
    const once = normalizeChronoStats(raw);
    expect(normalizeChronoStats(once)).toEqual(once);
    expect(normalizeChronoStats(normalizeChronoStats(once))).toEqual(once);
  });

  test('un profil sans données Chrono part de zéro', () => {
    expect(normalizeChronoStats(undefined)).toEqual(emptyChronoStats());
    expect(normalizeChronoStats({ buckets: { '7|keypad': { sessions: [] } } })).toEqual(
      emptyChronoStats()
    );
  });
});

describe('chrono-stats : calculs à revoir', () => {
  test('seuls les calculs ratés entrent dans la liste', () => {
    const store = emptyChronoStats();
    save(store, 4000, 1, { facts: [{ a: 7, b: 8, ms: 200, correct: true }] });
    save(store, 9000, 2, {
      facts: [
        { a: 7, b: 8, ms: 900, correct: true },
        { a: 6, b: 6, ms: 400, correct: false },
      ],
    });
    expect(store.basket).toEqual([{ a: 6, b: 6, due: 1 }]);
  });

  test('un calcul raté deux fois est à revoir deux fois, sans doublon', () => {
    const store = emptyChronoStats();
    addToBasket(store, { a: 7, b: 8, correct: false });
    addToBasket(store, { a: 7, b: 8, correct: false });
    expect(store.basket).toEqual([{ a: 7, b: 8, due: 2 }]);
  });

  test('un calcul hors de 1–10 × 1–10 n’entre jamais : sa question ne serait pas enregistrée', () => {
    const store = emptyChronoStats();
    addToBasket(store, { a: 11, b: 8, correct: false });
    expect(addManualBasketFact(store, 0, 5)).toBe(false);
    expect(store.basket).toEqual([]);
  });

  test('on peut ajouter un calcul à la main, sans doublon', () => {
    const store = emptyChronoStats();
    expect(addManualBasketFact(store, 6, 7)).toBe(true);
    expect(addManualBasketFact(store, 6, 7)).toBe(true);
    expect(store.basket).toEqual([{ a: 6, b: 7, due: 1 }]);
  });

  test('une partie abandonnée ne met pas les calculs non répondus dans la liste', () => {
    const store = emptyChronoStats();
    save(store, 5000, 1, {
      facts: [
        { a: 7, b: 8, ms: 900, correct: false },
        { a: 6, b: 6, answered: false },
      ],
    });
    expect(store.basket).toEqual([{ a: 7, b: 8, due: 1 }]);
  });

  test('le badge « à revoir » est jaune, orange, puis rouge', () => {
    expect(basketDueClass(1)).toBe('is-err-1');
    expect(basketDueClass(2)).toBe('is-err-2');
    expect(basketDueClass(3)).toBe('is-err-3');
    expect(basketDueClass(9)).toBe('is-err-3');
  });
});

describe('chrono-stats : révision', () => {
  function revise(basket, answers) {
    const store = { ...emptyChronoStats(), basket: basket.map(entry => ({ ...entry })) };
    const tally = startRevisionTally(store.basket);
    answers.forEach(([a, b, ok]) => tallyRevisionAnswer(tally, { a, b }, ok));
    return { store, outcome: applyRevisionTally(store, tally) };
  }

  test('une réussite enlève 1, et le calcul à 0 sort de la liste', () => {
    const { store, outcome } = revise(
      [
        { a: 7, b: 8, due: 2 },
        { a: 6, b: 9, due: 1 },
      ],
      [
        [7, 8, true],
        [6, 9, true],
        [7, 8, true],
      ]
    );
    expect(outcome).toEqual({
      mastered: [
        { a: 7, b: 8 },
        { a: 6, b: 9 },
      ],
      remaining: 0,
    });
    expect(store.basket).toEqual([]);
  });

  test('une erreur ajoute 1 : rattrapée par des réussites après elle, le calcul sort', () => {
    const { outcome } = revise(
      [{ a: 7, b: 8, due: 1 }],
      [
        [7, 8, false],
        [7, 8, true],
        [7, 8, true],
      ]
    );
    expect(outcome.mastered).toEqual([{ a: 7, b: 8 }]);
  });

  test('réussi au début puis raté à la fin, le calcul reste à revoir', () => {
    const { store, outcome } = revise(
      [{ a: 7, b: 8, due: 1 }],
      [
        [7, 8, true],
        [7, 8, true],
        [7, 8, false],
      ]
    );
    expect(outcome).toEqual({ mastered: [], remaining: 1 });
    expect(store.basket).toEqual([{ a: 7, b: 8, due: 1 }]);
  });

  test('une réussite sur l’inverse compte pour le calcul de la liste', () => {
    const { store, outcome } = revise([{ a: 6, b: 7, due: 1 }], [[7, 6, true]]);
    expect(outcome.mastered).toEqual([{ a: 6, b: 7 }]);
    expect(store.basket).toEqual([]);
  });

  test('un calcul pas posé pendant la révision garde son compteur', () => {
    const { store } = revise(
      [
        { a: 7, b: 8, due: 1 },
        { a: 3, b: 4, due: 2 },
      ],
      [[7, 8, false]]
    );
    expect(store.basket).toEqual([
      { a: 7, b: 8, due: 2 },
      { a: 3, b: 4, due: 2 },
    ]);
  });

  test('pièces : une par bonne réponse en partie, une par calcul sorti en révision', () => {
    const userData = { coins: 4 };
    expect(grantChronoCoins(userData)).toBe(5);
    expect(grantChronoCoins(userData, 3)).toBe(8);
    expect(grantChronoCoins(userData, 0)).toBe(8);
    expect(userData.coins).toBe(8);
  });
});

describe('chrono-stats : formats dans la langue du jeu', () => {
  test('les durées suivent la langue : virgule en français et en espagnol', () => {
    expect(formatDuration(1500, 'fr')).toBe(`1,5${NBSP}s`);
    expect(formatDuration(1500, 'es')).toBe(`1,5${NBSP}s`);
    expect(formatDuration(1500, 'en')).toBe(`1.5${NBSP}s`);
    expect(formatDuration(65600, 'fr')).toBe(`1${NBSP}min${NBSP}05,6${NBSP}s`);
  });

  test('les dixièmes s’arrondissent une fois : jamais « 60,0 s »', () => {
    expect(formatDuration(59960, 'fr')).toBe(`1${NBSP}min${NBSP}00,0${NBSP}s`);
    expect(formatDuration(59940, 'fr')).toBe(`59,9${NBSP}s`);
  });

  test('l’échelle du graphique arrondit le maximum', () => {
    expect(niceDurationMaxMs(12000)).toBe(20000);
    expect(formatAxisSeconds(20000)).toBe(`20${NBSP}s`);
    expect(formatAxisSeconds(100000)).toBe(`1${NBSP}min${NBSP}40`);
  });

  test('la date d’une partie suit la langue du jeu, pas celle du navigateur', () => {
    const date = new Date(2026, 9, 5, 12, 30).getTime();
    expect(formatSessionDate(date, 'fr')).toContain('05/10/2026');
    expect(formatSessionDate(date, 'fr')).not.toBe(formatSessionDate(date, 'en'));
  });
});

describe('chrono-questions', () => {
  test('avec toutes les tables, 1 et 10 sont beaucoup plus rares que 7×8', () => {
    const hard = chronoPairWeight(7, 8, true);
    expect(chronoPairWeight(1, 1, true) / hard).toBeLessThan(0.01);
    expect(chronoPairWeight(10, 10, true) / hard).toBeLessThan(0.01);
    expect(chronoPairWeight(1, 7, true) / hard).toBeLessThan(0.05);
  });

  test('si la table de 1 est choisie exprès, elle n’est pas écrasée comme en jeu complet', () => {
    const allTables = chronoPairWeight(1, 7, true);
    const chosen = chronoPairWeight(1, 7, false);
    expect(chosen).toBeGreaterThan(allTables * 5);
  });

  test('7×8 pèse plus que 2×5, même hors jeu complet', () => {
    expect(chronoPairWeight(7, 8, false)).toBeGreaterThan(chronoPairWeight(2, 5, false));
  });

  test('les tables de Chrono suivent les exclusions globales', () => {
    expect(includedTablesFromExclusions([1, 10], true)).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
    expect(includedTablesFromExclusions([7], false)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  test('une série n’a pas deux fois le même calcul tant qu’il en reste d’autres', () => {
    const seen = [];
    for (let i = 0; i < 10; i += 1) {
      const pair = pickChronoPair(
        [2],
        seen.map(item => `${item.t}×${item.n}`)
      );
      const key = `${pair.t}×${pair.n}`;
      expect(seen.some(item => `${item.t}×${item.n}` === key)).toBe(false);
      seen.push(pair);
    }
    const extra = pickChronoPair(
      [2],
      seen.map(item => `${item.t}×${item.n}`)
    );
    expect(extra.t).toBe(2);
  });

  test('après 8 × 6, ni 8 × 6 ni 6 × 8 : la correction affichée donnerait la réponse', () => {
    expect(factKeys(8, 6)).toEqual(['8×6', '6×8']);
    const tables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (let i = 0; i < 300; i += 1) {
      const { t, n } = pickChronoPair(tables, factKeys(8, 6));
      expect([`${t}×${n}`]).not.toContain('8×6');
      expect([`${t}×${n}`]).not.toContain('6×8');
    }
  });

  test('une seule table et tout déjà posé : le dernier calcul n’est pas reposé', () => {
    const asked = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].flatMap(n => factKeys(7, n));
    for (let i = 0; i < 300; i += 1) {
      const { t, n } = pickChronoPair([7], asked, factKeys(7, 6));
      expect(t).toBe(7);
      expect(n).not.toBe(6);
    }
  });

  test('la file de révision écarte les doublons d’affilée', () => {
    const spread = separateRevisionRepeats([
      { a: 7, b: 8 },
      { a: 7, b: 8 },
      { a: 3, b: 3 },
    ]);
    expect(spread[0].a === spread[1].a && spread[0].b === spread[1].b).toBe(false);
  });

  test('une passe de révision contient chaque calcul, plus souvent s’il est plus à revoir', () => {
    const basket = [
      { a: 6, b: 7, due: 0 },
      { a: 8, b: 9, due: 2 },
      { a: 4, b: 4, due: 1 },
    ];
    const queue = [];
    refillRevisionQueue(queue, basket);
    // Un calcul et son inverse comptent ensemble : 8 × 9 et 9 × 8 sont le même fait
    const count = (a, b) =>
      queue.filter(fact => (fact.a === a && fact.b === b) || (fact.a === b && fact.b === a)).length;
    expect(count(6, 7)).toBe(1);
    expect(count(4, 4)).toBe(2);
    expect(count(8, 9)).toBe(3);
    expect(queue.some(fact => fact.a === 9 && fact.b === 8)).toBe(true);
  });

  test('la révision pose aussi l’inverse : 6 × 7 puis 7 × 6, jamais deux fois d’affilée', () => {
    const basket = [{ a: 6, b: 7, due: 1 }];
    const queue = [];
    const keys = [];
    for (let i = 0; i < 10; i += 1) {
      const fact = takeNextRevisionFact(queue, basket, keys.length ? lastFact(keys) : undefined);
      keys.push(`${fact.a}×${fact.b}`);
    }
    expect(new Set(keys)).toEqual(new Set(['6×7', '7×6']));
    expect(keys.some((key, i) => i > 0 && key === keys[i - 1])).toBe(false);
  });

  test('les questions en plus recommencent une passe complète, pas un seul calcul', () => {
    const basket = [
      { a: 3, b: 3, due: 1 },
      { a: 7, b: 8, due: 1 },
    ];
    const queue = [];
    const keys = [];
    for (let i = 0; i < 4; i += 1) {
      const fact = takeNextRevisionFact(queue, basket);
      keys.push(`${fact.a}×${fact.b}`);
    }
    expect(keys.filter(key => key === '3×3')).toHaveLength(2);
    expect(keys.filter(key => key === '7×8' || key === '8×7')).toHaveLength(2);
  });

  test('la révision ne sort jamais de la liste, elle reboucle', () => {
    const basket = [
      { a: 3, b: 4, due: 1 },
      { a: 7, b: 8, due: 2 },
    ];
    const allowed = new Set(basket.flatMap(item => [`${item.a}×${item.b}`, `${item.b}×${item.a}`]));
    const queue = [];
    for (let i = 0; i < 20; i += 1) {
      const fact = takeNextRevisionFact(queue, basket);
      expect(allowed.has(`${fact.a}×${fact.b}`)).toBe(true);
    }
  });
});
