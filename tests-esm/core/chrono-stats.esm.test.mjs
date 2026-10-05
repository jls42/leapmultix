import { describe, expect, test } from '@jest/globals';
import { classifyTypedAnswer } from '../../js/core/chrono-input.js';
import {
  chronoPairWeight,
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
  shouldAutoAddFact,
  listPlayedChronoBuckets,
  parseBucketKey,
  tablesListLabel,
  saveChronoSession,
  rankedSessions,
  formatDuration,
  niceDurationMaxMs,
  formatAxisSeconds,
  addToBasket,
  addManualBasketFact,
  basketErrorClass,
  grantChronoCoins,
  chronoShouldContinue,
  getBucket,
} from '../../js/core/chrono-stats.js';

describe('chrono-input', () => {
  test('accepte la valeur dès qu’elle est complète', () => {
    expect(classifyTypedAnswer('3', 36)).toBe('prefix');
    expect(classifyTypedAnswer('36', 36)).toBe('correct');
  });

  test('refuse un chiffre qui ne peut pas être un préfixe', () => {
    expect(classifyTypedAnswer('4', 36)).toBe('wrong');
  });
});

describe('chrono-stats', () => {
  test('sépare les classements par tables et par saisie', () => {
    expect(tablesKey([7, 3, 3])).toBe('3,7');
    expect(bucketKey([3, 7], 'mcq')).not.toBe(bucketKey([3, 7], 'keypad'));
    expect(parseBucketKey('3,7|keypad')).toEqual({ tables: [3, 7], inputMode: 'keypad' });
    expect(tablesListLabel([7, 3])).toBe('3, 7');
  });

  test('la liste des stats compte les parties par tables et par saisie', () => {
    const store = emptyChronoStats();
    const fact = { a: 3, b: 3, ms: 400, correct: true };
    saveChronoSession(store, {
      tables: [3],
      inputMode: 'mcq',
      durationMs: 10000,
      date: 1,
      facts: [fact],
    });
    saveChronoSession(store, {
      tables: [3],
      inputMode: 'mcq',
      durationMs: 9000,
      date: 2,
      facts: [fact],
    });
    saveChronoSession(store, {
      tables: [2, 3],
      inputMode: 'keypad',
      durationMs: 11000,
      date: 3,
      facts: [fact],
    });
    const rows = listPlayedChronoBuckets(store);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ tables: [3], inputMode: 'mcq', games: 2 });
    expect(rows[1]).toMatchObject({ tables: [2, 3], inputMode: 'keypad', games: 1 });
  });

  test('une partie avec des erreurs compte dès 10 justes', () => {
    expect(
      chronoShouldContinue({
        isRevision: false,
        correctAnswers: 9,
        questionCount: 11,
        targetCount: 11,
      })
    ).toBe(true);
    expect(
      chronoShouldContinue({
        isRevision: false,
        correctAnswers: 10,
        questionCount: 12,
        targetCount: 12,
      })
    ).toBe(false);
  });

  test('une révision s’arrête à 10 questions, même avec des erreurs', () => {
    expect(
      chronoShouldContinue({
        isRevision: true,
        correctAnswers: 6,
        questionCount: 9,
        targetCount: 40,
      })
    ).toBe(true);
    expect(
      chronoShouldContinue({
        isRevision: true,
        correctAnswers: 6,
        questionCount: 10,
        targetCount: 40,
      })
    ).toBe(false);
  });

  test('une partie avec erreurs entre au classement', () => {
    const store = emptyChronoStats();
    saveChronoSession(store, {
      tables: [3],
      inputMode: 'mcq',
      durationMs: 18000,
      date: 1,
      facts: [
        { a: 3, b: 3, ms: 800, correct: false },
        { a: 3, b: 7, ms: 400, correct: true },
      ],
    });
    const { bucket } = getBucket(store, [3], 'mcq');
    expect(rankedSessions(bucket)).toHaveLength(1);
    expect(rankedSessions(bucket)[0].durationMs).toBe(18000);
  });

  test('la moyenne affichée est celle de toutes les parties', () => {
    const store = emptyChronoStats();
    saveChronoSession(store, {
      tables: [2],
      inputMode: 'keypad',
      durationMs: 10000,
      date: 1,
      facts: [{ a: 2, b: 2, ms: 400, correct: true }],
    });
    saveChronoSession(store, {
      tables: [2],
      inputMode: 'keypad',
      durationMs: 20000,
      date: 2,
      facts: [{ a: 2, b: 3, ms: 500, correct: true }],
    });
    const { bucket } = { bucket: store.buckets['2|keypad'] };
    expect(sessionAverageMs(bucket)).toBe(15000);
  });

  test('seul un calcul faux entre automatiquement au panier', () => {
    expect(shouldAutoAddFact({ correct: false, ms: 100 })).toBe(true);
    expect(shouldAutoAddFact({ correct: true, ms: 800 })).toBe(false);
    expect(shouldAutoAddFact({ correct: true, ms: 100 })).toBe(false);
    expect(shouldAutoAddFact(null)).toBe(false);
  });

  test('une partie ne met au panier que les erreurs, pas les justes lents', () => {
    const store = emptyChronoStats();
    saveChronoSession(store, {
      tables: [7],
      inputMode: 'keypad',
      durationMs: 4000,
      date: 1,
      facts: [{ a: 7, b: 8, ms: 200, correct: true }],
    });
    saveChronoSession(store, {
      tables: [7],
      inputMode: 'keypad',
      durationMs: 9000,
      date: 2,
      facts: [
        { a: 7, b: 8, ms: 900, correct: true },
        { a: 6, b: 6, ms: 400, correct: false },
      ],
    });
    expect(store.basket).toEqual([{ a: 6, b: 6, errors: 1 }]);
  });

  test('le mode de saisie du profil se souvient du dernier choix', () => {
    expect(lastChronoInputMode(emptyChronoStats())).toBe('keypad');
    expect(lastChronoInputMode(normalizeChronoStats({ lastInputMode: 'mcq' }))).toBe('mcq');
    const store = emptyChronoStats();
    setLastChronoInputMode(store, 'mcq');
    expect(lastChronoInputMode(store)).toBe('mcq');
  });

  test('le classement ordonne du plus rapide au plus lent', () => {
    const ranked = rankedSessions({
      sessions: [
        { durationMs: 9000, date: 2 },
        { durationMs: 4000, date: 1 },
      ],
    });
    expect(ranked[0].durationMs).toBe(4000);
  });

  test('formatte les durées', () => {
    expect(formatDuration(1500)).toBe('1.5 s');
  });

  test('l’échelle du graphique arrondit le maximum', () => {
    expect(niceDurationMaxMs(12000)).toBe(20000);
    expect(formatAxisSeconds(20000)).toBe('20 s');
  });

  test('le panier n’a pas de doublon et compte les erreurs', () => {
    const store = emptyChronoStats();
    addToBasket(store, { a: 7, b: 8, correct: false });
    addToBasket(store, { a: 7, b: 8, correct: false });
    addToBasket(store, { a: 7, b: 8, correct: true });
    expect(store.basket).toHaveLength(1);
    expect(store.basket[0].errors).toBe(2);
  });

  test('un calcul qui entre au panier part de 1 erreur', () => {
    const store = emptyChronoStats();
    addToBasket(store, { a: 4, b: 5, correct: true });
    expect(store.basket).toEqual([{ a: 4, b: 5, errors: 1 }]);
  });

  test('on peut ajouter un calcul à la main, sans doublon', () => {
    const store = emptyChronoStats();
    expect(addManualBasketFact(store, 6, 7)).toBe(true);
    expect(addManualBasketFact(store, 6, 7)).toBe(true);
    expect(addManualBasketFact(store, 0, 5)).toBe(false);
    expect(store.basket).toEqual([{ a: 6, b: 7, errors: 1 }]);
  });

  test('une partie abandonnée ne met pas les calculs non répondus dans le panier', () => {
    const store = emptyChronoStats();
    saveChronoSession(store, {
      tables: [7],
      inputMode: 'keypad',
      durationMs: 5000,
      date: 1,
      facts: [
        { a: 7, b: 8, ms: 900, correct: false },
        { a: 6, b: 6, answered: false },
      ],
    });
    expect(store.basket.some(item => item.a === 6 && item.b === 6)).toBe(false);
    expect(store.basket).toEqual([{ a: 7, b: 8, errors: 1 }]);
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

  test('la file de révision écarte les doublons d’affilée', () => {
    const spread = separateRevisionRepeats([
      { a: 7, b: 8 },
      { a: 7, b: 8 },
      { a: 3, b: 3 },
    ]);
    expect(spread[0].a === spread[1].a && spread[0].b === spread[1].b).toBe(false);
  });

  test('une passe de révision contient chaque calcul, plus souvent s’il a plus d’erreurs', () => {
    const basket = [
      { a: 6, b: 7, errors: 0 },
      { a: 8, b: 9, errors: 2 },
      { a: 4, b: 4, errors: 1 },
    ];
    const queue = [];
    refillRevisionQueue(queue, basket);
    const counts = Object.create(null);
    for (const fact of queue) {
      const key = `${fact.a}×${fact.b}`;
      counts[key] = (counts[key] || 0) + 1;
    }
    expect(counts['6×7']).toBe(1);
    expect(counts['4×4']).toBe(2);
    expect(counts['8×9']).toBe(3);
  });

  test('les questions en plus recommencent une passe complète, pas un seul calcul', () => {
    const basket = [
      { a: 3, b: 3, errors: 1 },
      { a: 7, b: 8, errors: 1 },
    ];
    const queue = [];
    const counts = Object.create(null);
    for (let i = 0; i < 4; i += 1) {
      const fact = takeNextRevisionFact(queue, basket);
      const key = `${fact.a}×${fact.b}`;
      counts[key] = (counts[key] || 0) + 1;
    }
    expect(counts['3×3']).toBe(2);
    expect(counts['7×8']).toBe(2);
  });

  test('la révision ne sort jamais du panier, elle reboucle', () => {
    const basket = [
      { a: 3, b: 4, errors: 1 },
      { a: 7, b: 8, errors: 2 },
    ];
    const allowed = new Set(basket.map(item => `${item.a}×${item.b}`));
    const queue = [];
    for (let i = 0; i < 20; i += 1) {
      const fact = takeNextRevisionFact(queue, basket);
      expect(allowed.has(`${fact.a}×${fact.b}`)).toBe(true);
    }
  });
});

describe('chrono panier et pièces', () => {
  test('le badge d’erreurs est jaune, orange, puis rouge', () => {
    expect(basketErrorClass(1)).toBe('is-err-1');
    expect(basketErrorClass(2)).toBe('is-err-2');
    expect(basketErrorClass(3)).toBe('is-err-3');
    expect(basketErrorClass(9)).toBe('is-err-3');
  });

  test('une bonne réponse Chrono donne une pièce', () => {
    const userData = { coins: 4 };
    expect(grantChronoCoins(userData)).toBe(5);
    expect(userData.coins).toBe(5);
  });
});
