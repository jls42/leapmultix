/* eslint-env jest, node */
/**
 * Chrono en addition, soustraction et division, de bout en bout : questions et voix, écran
 * de départ, liste à revoir, « Mes temps », écran de fin, révision des deux sens, Défi du
 * jour, et la multiplication du même profil laissée intacte. Profil copié à chaque lecture,
 * comme UserManager.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { createSlidesMock } from '../helpers/mode-test-helpers.mjs';
import {
  createLazyLoaderMock,
  createGameMock,
  createSpeechMock,
  createChronoNavigation,
  createChronoDriver,
  trackChronoInstances,
  quietFakeTime,
} from '../helpers/chrono-test-helpers.mjs';
import { legacyPlayers } from '../helpers/legacy-profiles.mjs';

let persisted;
const copy = value => JSON.parse(JSON.stringify(value));
jest.unstable_mockModule('../../js/core/userState.js', () => ({
  UserState: {
    getCurrentUserData: () => copy(persisted),
    updateUserData: data => {
      persisted = { ...persisted, ...copy(data) };
    },
  },
}));
const updateDailyChallengeProgress = jest.fn();
const refs = {};
const goToSlide = createChronoNavigation(jest, refs);
jest.unstable_mockModule('../../js/lazy-loader.js', createLazyLoaderMock);
jest.unstable_mockModule('../../js/game.js', () =>
  createGameMock(jest, updateDailyChallengeProgress)
);
const speak = jest.fn();
jest.unstable_mockModule('../../js/speech.js', () =>
  createSpeechMock({ speak, preloadSpeech: jest.fn() })
);
jest.unstable_mockModule('../../js/slides.js', () => ({ ...createSlidesMock(jest), goToSlide }));

const store = await import('../../js/i18n-store.js');
const { AudioManager } = await import('../../js/core/audio.js');
const { TablePreferences } = await import('../../js/core/tablePreferences.js');
refs.orchestrator = await import('../../js/mode-orchestrator.js');
refs.chronoModule = await import('../../js/modes/ChronoMode.js');
const { ChronoMode, stopChronoMode } = refs.chronoModule;
const FR = JSON.parse(
  readFileSync(new URL('../../assets/translations/fr.json', import.meta.url), 'utf8')
);

let instances = [];
const { flush, startChrono, answer } = createChronoDriver(jest, refs, () => instances);
const text = el => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
const MINUS = '−';
const QUESTION = {
  '+': /^(\d+) \+ (\d+) = \?$/,
  '−': /^(\d+) − (\d+) = \?$/,
  '÷': /^(\d+) ÷ (\d+) = \?$/,
};

beforeEach(() => {
  trackChronoInstances(jest, ChronoMode, () => instances);
  store.setTranslations(FR);
  store.setCurrentLanguage('fr');
  document.body.innerHTML = '<div id="game"></div><div id="results"></div>';
  persisted = { preferredOperator: '×', coins: 0 };
  instances = [];
  updateDailyChallengeProgress.mockReset();
  speak.mockReset();
  quietFakeTime(jest, AudioManager);
});

afterEach(() => {
  stopChronoMode();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

async function openMenu(operator) {
  persisted.preferredOperator = operator;
  await refs.orchestrator.setGameMode('chrono');
  await flush();
  return instances.at(-1);
}

/** Une course entière : une erreur, puis dix bonnes réponses */
async function playRace(chrono) {
  const asked = [];
  asked.push(chrono.state.currentQuestion);
  await answer(chrono, false);
  while (chrono.state.correctAnswers < 10) {
    asked.push(chrono.state.currentQuestion);
    await answer(chrono);
  }
  await flush(1000);
  return asked;
}

describe('Chrono hors multiplication : les questions', () => {
  test.each(['+', '−', '÷'])('course en %s : calculs de la grille, voix, réponse', async op => {
    persisted.preferredOperator = op;
    const chrono = await startChrono();
    const asked = await playRace(chrono);
    for (const q of asked) {
      expect(q.operator).toBe(op);
      expect(q.question).toMatch(QUESTION[op]);
      expect(q.table).toBeUndefined();
      expect(q.num).toBeUndefined();
      if (op === '+') expect(q.answer).toBe(q.a + q.b);
      if (op === '−') expect(q.answer).toBe(q.a - q.b);
      if (op === '÷') expect(q.answer).toBe(q.a / q.b);
      expect(Number.isInteger(q.answer)).toBe(true);
      expect(q.answer).toBeGreaterThanOrEqual(1);
      expect(q.answer).toBeLessThanOrEqual(op === '+' ? 20 : 10);
      if (op === '÷') expect(q.b).toBeGreaterThanOrEqual(2);
    }
    // Une course ne pose jamais deux fois la même famille de calculs
    const families = asked.map(({ a, b }) => {
      if (op === '+') return [Math.min(a, b), Math.max(a, b)].join(op);
      if (op === '−') return `${a}${op}${Math.min(b, a - b)}`;
      return `${a}${op}${Math.min(b, a / b)}`;
    });
    expect(new Set(families).size).toBe(families.length);
  });

  test('soustraction : le signe moins U+2212, dit « moins »', async () => {
    persisted.preferredOperator = '−';
    const chrono = await startChrono();
    const { a, b, question } = chrono.state.currentQuestion;
    expect(question).toBe(`${a} ${MINUS} ${b} = ?`);
    expect(speak.mock.calls.at(-1)[0]).toBe(`Combien font ${a} moins ${b} ?`);
  });

  test('division : dit « divisé par », jamais par 1', async () => {
    persisted.preferredOperator = '÷';
    const chrono = await startChrono({ inputMode: 'mcq' });
    const { a, b } = chrono.state.currentQuestion;
    expect(b).toBeGreaterThanOrEqual(2);
    expect(speak.mock.calls.at(-1)[0]).toBe(`Combien font ${a} divisé par ${b} ?`);
    const options = [...document.querySelectorAll('#chrono-options .option')].map(text);
    expect(options).toContain(String(a / b));
  });
});

describe('Chrono hors multiplication : ce qui s’enregistre', () => {
  test('une course de soustraction : sa réserve, et la multiplication intacte', async () => {
    const before = copy(legacyPlayers()['Zoé']);
    persisted = { ...copy(before), preferredOperator: '−' };
    const chrono = await startChrono();
    const [missed] = await playRace(chrono);

    const minus = persisted.chronoStatsByOperator['−'];
    expect(minus.buckets.map(b => [b.key, b.count])).toEqual([['1,2,3,4,5,6,7,8,9,10|keypad', 1]]);
    expect(minus.basket).toEqual([{ a: missed.a, b: missed.b, due: 1 }]);
    expect(persisted.chronoStatsByOperator['+']).toEqual({ buckets: [], basket: [] });
    // La multiplication de Zoé n'a pas bougé (seule la façon de répondre est commune)
    const { lastInputMode, ...xNow } = persisted.chronoStats;
    const { lastInputMode: oldMode, ...xBefore } = copy(before.chronoStats);
    expect(lastInputMode).toBe('keypad');
    expect(oldMode).toBe('mcq');
    expect(xNow.buckets).toEqual(
      xBefore.buckets.map(bucket => ({ ...bucket, best: expect.any(Array) }))
    );
    expect(xNow.buckets.map(b => b.count)).toEqual([6, 2, 1]);
    expect(xNow.basket.map(({ a, b }) => `${a}×${b}`)).toEqual(['6×7', '8×9', '7×8']);
  });

  test('hors multiplication, toutes les tables, même celles retirées dans les Paramètres', async () => {
    jest.spyOn(TablePreferences, 'isGlobalEnabled').mockReturnValue(true);
    jest
      .spyOn(TablePreferences, 'getActiveExclusions')
      .mockReturnValue([1, 2, 3, 4, 5, 6, 8, 9, 10]);
    persisted.preferredOperator = '÷';
    const chrono = await startChrono();
    const asked = await playRace(chrono);
    expect(asked.some(({ b }) => b !== 7)).toBe(true);
    expect(persisted.chronoStatsByOperator['÷'].buckets.map(bucket => bucket.key)).toEqual([
      '2,3,4,5,6,7,8,9,10|keypad',
    ]);
  });

  test('l’écran de fin corrige chaque calcul dans son opération', async () => {
    persisted.preferredOperator = '÷';
    const chrono = await startChrono();
    const asked = await playRace(chrono);
    const facts = [...document.querySelectorAll('#results .chrono-fact-eq')].map(text);
    expect(facts).toHaveLength(asked.length);
    asked.forEach((q, index) => {
      expect(facts[index]).toBe(`${q.a} ÷ ${q.b} = ${q.a / q.b}`);
    });
  });

  test('ni pièce perdue ni Défi du jour : le Défi du jour reste une table de multiplication', async () => {
    persisted.preferredOperator = '+';
    const chrono = await startChrono();
    await answer(chrono);
    await answer(chrono);
    expect(persisted.coins).toBe(2);
    expect(updateDailyChallengeProgress).not.toHaveBeenCalled();
  });

  test('abandon en addition : comme en ×, rien au classement ni à la liste à revoir', async () => {
    persisted.preferredOperator = '+';
    const chrono = await startChrono();
    await answer(chrono, false);
    jest.spyOn(globalThis, 'confirm').mockReturnValue(true);
    chrono.confirmAbandon();
    await flush(2000);
    expect(persisted.chronoStatsByOperator?.['+']?.buckets ?? []).toEqual([]);
    expect(persisted.chronoStatsByOperator?.['+']?.basket ?? []).toEqual([]);
  });
});

describe('Chrono hors multiplication : écran de départ', () => {
  test.each([
    ['+', 'chrono_race_hint_addition'],
    ['−', 'chrono_race_hint_subtraction'],
    ['÷', 'chrono_race_hint_division'],
  ])('en %s : la phrase de l’opération, sans l’engrenage des tables', async (op, key) => {
    await openMenu(op);
    expect(text(document.querySelector('.chrono-race p'))).toBe(FR[key]);
    expect(document.querySelector('.chrono-race .chrono-tables-hint')).toBeNull();
  });

  test('addition : on ajoute un calcul à la main, avec le signe +', async () => {
    await openMenu('+');
    expect(text(document.querySelector('.chrono-basket-times'))).toBe('+');
    document.getElementById('chrono-add-a').value = '7';
    document.getElementById('chrono-add-b').value = '3';
    document.getElementById('chrono-basket-add').click();
    await flush();
    expect(persisted.chronoStatsByOperator['+'].basket).toEqual([{ a: 7, b: 3, due: 1 }]);
    expect(persisted.chronoStats?.basket ?? []).toEqual([]);
    expect(text(document.querySelector('.chrono-basket-eq'))).toBe('7 + 3');
    expect(document.querySelector('.chrono-basket-remove').getAttribute('aria-label')).toBe(
      'Retirer 7 + 3'
    );
  });

  test.each(['−', '÷'])(
    'en %s, pas d’ajout à la main : seules les erreurs remplissent la liste',
    async op => {
      persisted.chronoStatsByOperator = {
        [op]: { basket: op === '−' ? [{ a: 15, b: 7 }] : [{ a: 56, b: 7 }] },
      };
      await openMenu(op);
      expect(document.querySelector('.chrono-basket-add')).toBeNull();
      expect(text(document.querySelector('.chrono-basket-eq'))).toBe(
        op === '−' ? `15 ${MINUS} 7` : '56 ÷ 7'
      );
    }
  );

  test('la liste et « Mes temps » ne montrent que l’opération choisie', async () => {
    persisted = { ...copy(legacyPlayers()['Zoé']), preferredOperator: '÷' };
    persisted.chronoStatsByOperator = {
      '÷': {
        buckets: [
          {
            key: '2,3,4,5,6,7,8,9,10|mcq',
            count: 1,
            totalMs: 30000,
            best: [{ durationMs: 30000, date: 1 }],
            recent: [{ durationMs: 30000, date: 1 }],
          },
        ],
        basket: [],
      },
    };
    const chrono = await openMenu('÷');
    expect(document.querySelectorAll('.chrono-basket-item')).toHaveLength(0);
    await chrono.openStatsPick();
    const labels = [...document.querySelectorAll('.chrono-stats-label')].map(text);
    expect(labels).toEqual(['Toutes les tables · Je choisis']);
  });
});

describe('Chrono hors multiplication : révision des deux sens', () => {
  test('soustraction : 15 − 7 et 15 − 8, jamais 7 − 15 ; réussie, la ligne sort', async () => {
    persisted.preferredOperator = '−';
    persisted.chronoStatsByOperator = { '−': { buckets: [], basket: [{ a: 15, b: 7, due: 1 }] } };
    const chrono = await startChrono({ revision: true });
    const seen = new Set();
    for (let i = 0; i < 10; i += 1) {
      seen.add(chrono.state.currentQuestion.question);
      await answer(chrono);
    }
    await flush(1000);
    expect(seen).toEqual(new Set([`15 ${MINUS} 7 = ?`, `15 ${MINUS} 8 = ?`]));
    expect(persisted.chronoStatsByOperator['−'].basket).toEqual([]);
    expect(persisted.coins).toBe(1);
    expect(updateDailyChallengeProgress).not.toHaveBeenCalled();
  });

  test('division : 7 ÷ 7 n’a pas d’autre sens (jamais 7 ÷ 1)', async () => {
    persisted.preferredOperator = '÷';
    persisted.chronoStatsByOperator = { '÷': { buckets: [], basket: [{ a: 7, b: 7, due: 2 }] } };
    const chrono = await startChrono({ revision: true });
    const seen = new Set();
    for (let i = 0; i < 10; i += 1) {
      seen.add(chrono.state.currentQuestion.question);
      await answer(chrono, i % 2 === 0);
    }
    expect(seen).toEqual(new Set(['7 ÷ 7 = ?']));
  });
});

describe('Chrono : ce que voit le tableau de bord', () => {
  test('une course compte dès sa première réponse, même abandonnée', async () => {
    persisted.preferredOperator = '−';
    const chrono = await startChrono();
    await answer(chrono);
    await answer(chrono, false);
    jest.spyOn(globalThis, 'confirm').mockReturnValue(true);
    chrono.confirmAbandon();
    await flush(2000);
    expect(persisted.modeStats.modes.chrono['−']).toEqual({ games: 1, questions: 2, correct: 1 });
  });

  test('une course finie puis quittée aussitôt garde son temps et son classement', async () => {
    persisted.preferredOperator = '×';
    const chrono = await startChrono();
    while (chrono.state.correctAnswers < 9) await answer(chrono);
    // Dixième bonne réponse, puis départ avant l'écran de fin (0,8 s)
    chrono.handleAnswer(chrono.state.currentQuestion.answer);
    stopChronoMode();
    await flush(2000);
    expect(persisted.chronoStats.buckets.map(bucket => bucket.count)).toEqual([1]);
    expect(persisted.modeStats.modes.chrono['×']).toEqual({ games: 1, questions: 10, correct: 10 });
  });

  test('une révision n’est pas une partie, mais ses réponses comptent', async () => {
    persisted.preferredOperator = '+';
    persisted.chronoStatsByOperator = { '+': { buckets: [], basket: [{ a: 8, b: 7, due: 1 }] } };
    const chrono = await startChrono({ revision: true });
    for (let i = 0; i < 10; i += 1) await answer(chrono, i > 0);
    await flush(1000);
    expect(persisted.modeStats.modes.chrono['+']).toEqual({ games: 0, questions: 10, correct: 9 });
  });

  test('comme avant, une course sans faute fait monter la meilleure série', async () => {
    // « Meilleure série » a le même périmètre que « Questions » (Chrono compris) : le
    // comportement de la v36 en multiplication est gardé
    persisted.preferredOperator = '×';
    persisted.bestStreak = 3;
    const chrono = await startChrono();
    while (chrono.state.correctAnswers < 10) await answer(chrono);
    await flush(1000);
    expect(persisted.bestStreak).toBe(10);
  });
});
