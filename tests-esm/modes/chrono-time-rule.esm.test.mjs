/* eslint-env jest, node */
/**
 * Chrono, la règle du temps : le temps d'une course va de son départ à sa dixième bonne
 * réponse, et une erreur n'y ajoute que le temps passé à y répondre, jamais de pénalité ; une
 * course quittée par la barre du haut (Accueil, Changer de joueur) ne laisse aucun temps,
 * mais compte comme une partie commencée ; un temps illisible ne devient jamais un classement
 * abîmé. Le reste (arrêt à la dixième réponse, record, « Abandonner ») est tenu par
 * chrono-mode, chrono-stats et chrono-persistence.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { answerDialog, closeOpenDialog } from '../helpers/confirm-dialog-helpers.mjs';
import { loadChronoBench, mockCopiedProfile } from '../helpers/module-mocks.mjs';

const saved = mockCopiedProfile(jest, '../../js');
const bench = await loadChronoBench(jest, '../../js');
const { flush, startChrono, showQuestion, answer } = bench;
const { emptyChronoStats, saveChronoSession } = await import('../../js/core/chrono-stats.js');

/** Temps laissé à chaque réponse par le pilote (retour affiché, question suivante) */
const ANSWER_MS = 800;
let topBar;

const buckets = () => saved.data.chronoStats?.buckets ?? [];
const chronoGames = () => saved.data.modeStats?.modes?.chrono?.['×'];

/** Répond juste jusqu'à la dixième bonne réponse, qui termine la course */
async function finishRace(chrono) {
  while (chrono.state.correctAnswers < 10) await answer(chrono, true, ANSWER_MS);
}

beforeEach(() => {
  saved.data = { preferredOperator: '×', coins: 0 };
  topBar = bench.prepare();
});

afterEach(() => {
  closeOpenDialog();
  bench.stop();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('Chrono : le temps d’une course', () => {
  test('une erreur n’ajoute que le temps passé à y répondre : aucune pénalité', async () => {
    // Le temps passé avant le départ de la course ne compte pas
    await flush(3000);
    const chrono = await startChrono();
    showQuestion(chrono, 7, 8);
    await answer(chrono, false, ANSWER_MS);
    await answer(chrono, false, ANSWER_MS);
    await finishRace(chrono);
    await flush(5000);
    expect(chrono.state.questionCount).toBe(12);
    // Deux erreurs et neuf bonnes réponses avant la dixième : onze attentes, rien de plus
    expect(buckets()).toHaveLength(1);
    expect(buckets()[0].best.map(session => session.durationMs)).toEqual([11 * ANSWER_MS]);
    expect(buckets()[0]).toMatchObject({ count: 1, totalMs: 11 * ANSWER_MS });
  });
});

describe('Chrono : une course quittée par la barre du haut', () => {
  test.each([
    ['Accueil', 'home'],
    ['Changer de joueur', 'changePlayer'],
  ])(
    '« %s » : aucun temps au classement, rien à revoir, mais une partie commencée',
    async (_label, exit) => {
      const chrono = await startChrono();
      showQuestion(chrono, 7, 8);
      await answer(chrono, false, ANSWER_MS);
      await answer(chrono, true, ANSWER_MS);
      new Map(Object.entries(topBar)).get(exit).click();
      await answerDialog(true);
      await flush(5000);
      expect(chrono.state.isActive).toBe(false);
      expect(buckets()).toEqual([]);
      expect(saved.data.chronoStats?.basket ?? []).toEqual([]);
      expect(chronoGames()).toMatchObject({ games: 1, questions: 2, correct: 1 });
    }
  );

  test('une course finie sans aucune réponse ne laisse aucun temps', async () => {
    const chrono = await startChrono();
    await flush(4000);
    chrono.finish();
    await flush(1000);
    expect(buckets()).toEqual([]);
    expect(chronoGames()).toBeUndefined();
  });
});

describe('chrono-stats : un temps illisible', () => {
  test('n’entre jamais tel quel au classement : chaque temps gardé est un nombre positif ou nul', () => {
    const store = emptyChronoStats();
    const race = { tables: [2, 3], inputMode: 'keypad', date: 1, facts: [] };
    saveChronoSession(store, { ...race, durationMs: 9000 });
    for (const durationMs of [Number.NaN, -500, 'abc', undefined]) {
      saveChronoSession(store, { ...race, durationMs, date: 2 });
    }
    const [bucket] = store.buckets;
    expect(bucket.count).toBe(5);
    expect(bucket.totalMs).toBe(9000);
    const kept = [...bucket.best, ...bucket.recent].map(session => session.durationMs);
    expect(kept.every(ms => Number.isFinite(ms) && ms >= 0)).toBe(true);
    expect(Math.max(...kept)).toBe(9000);
  });
});
