/* eslint-env jest, node */
/**
 * Compteurs du tableau de bord (core/mode-stats.js) : écritures, bornes, lectures, amorçage
 * et relecture d'un profil.
 */
import { describe, test, expect, jest } from '@jest/globals';
import {
  emptyModeStats,
  normalizeModeStats,
  seedModeStats,
  recordModeAnswer,
  recordChallengeBest,
  recordArcadeGame,
  resetArcadeGame,
  arcadeTopScores,
  appendProgressHistory,
  weakTablesFrom,
  answerTotals,
  modeEntries,
  PROGRESS_HISTORY_LIMIT,
  REVIEW_WINDOW,
} from '../../js/core/mode-stats.js';

const profile = () => ({ modeStats: emptyModeStats() });

describe('mode-stats : une réponse', () => {
  test('comptée dans son mode et son opération ; une partie à la première', () => {
    const user = profile();
    recordModeAnswer(user, { mode: 'challenge', operator: '+', isCorrect: true, startsGame: true });
    recordModeAnswer(user, { mode: 'challenge', operator: '+', isCorrect: false });
    expect(user.modeStats.modes.challenge['+']).toEqual({
      games: 1,
      questions: 2,
      correct: 1,
      best: {},
    });
  });

  test('le Quiz et l’Aventure ne comptent pas de parties', () => {
    const user = profile();
    recordModeAnswer(user, { mode: 'quiz', operator: '×', isCorrect: true, startsGame: true });
    expect(user.modeStats.modes.quiz['×']).toEqual({ questions: 1, correct: 1 });
  });

  test('en ×, la fenêtre de la table garde les 20 dernières réponses', () => {
    const user = profile();
    for (let i = 0; i < 25; i += 1) {
      recordModeAnswer(user, { mode: 'quiz', operator: '×', table: 7, isCorrect: i >= 5 });
    }
    expect(user.modeStats.review['7']).toHaveLength(REVIEW_WINDOW);
    expect(user.modeStats.review['7']).toBe('1'.repeat(20));
  });

  test('hors ×, ni fenêtre ni table ; un mode inconnu est ignoré', () => {
    const user = profile();
    recordModeAnswer(user, { mode: 'quiz', operator: '÷', table: 7, isCorrect: false });
    recordModeAnswer(user, { mode: 'arcade', operator: '×', table: 7, isCorrect: false });
    expect(user.modeStats.review).toEqual({});
    expect(Object.keys(user.modeStats.modes)).toEqual(['quiz']);
  });

  test('des compteurs à jour mais sans leurs conteneurs (null compris) les retrouvent', () => {
    for (const modeStats of [{ v: 1 }, { v: 1, modes: null, review: null }]) {
      const user = { modeStats };
      recordModeAnswer(user, { mode: 'quiz', operator: '×', table: 7, isCorrect: true });
      expect(user.modeStats).toMatchObject({
        modes: { quiz: { '×': { questions: 1, correct: 1 } } },
        imported: { questions: 0, correct: 0 },
        arcadeTop5: {},
        review: { 7: '1' },
      });
    }
  });

  test('un profil sans compteurs en reçoit', () => {
    const user = {};
    recordModeAnswer(user, { mode: 'chrono', operator: '−', isCorrect: true, startsGame: true });
    expect(user.modeStats.modes.chrono['−']).toEqual({ games: 1, questions: 1, correct: 1 });
  });
});

describe('mode-stats : records et Arcade', () => {
  test('meilleur score du Défi par difficulté ; une difficulté inconnue est ignorée', () => {
    const user = profile();
    recordChallengeBest(user, { operator: '×', difficulty: 'hard', score: 90 });
    recordChallengeBest(user, { operator: '×', difficulty: 'hard', score: 60 });
    recordChallengeBest(user, { operator: '×', difficulty: 'expert', score: 999 });
    expect(user.modeStats.modes.challenge['×'].best).toEqual({ hard: 90 });
  });

  test('une partie d’Arcade : parties, total, record, 5 meilleurs scores', () => {
    const user = profile();
    for (const score of [10, 70, 30, 50, 90, 20, -5]) {
      recordArcadeGame(user, { game: 'multisnake', operator: '×', score });
    }
    expect(user.modeStats.modes.multisnake['×']).toEqual({ games: 7, total: 270, best: 90 });
    expect(arcadeTopScores(user, 'multisnake')).toEqual([90, 70, 50, 30, 20]);
  });

  test('« Remettre à zéro » vide les scores et les compteurs de ce jeu seulement', () => {
    const user = profile();
    recordArcadeGame(user, { game: 'invasion', operator: '×', score: 100 });
    recordArcadeGame(user, { game: 'multimiam', operator: '×', score: 40 });
    resetArcadeGame(user, 'invasion');
    expect(arcadeTopScores(user, 'invasion')).toEqual([]);
    expect(user.modeStats.modes.invasion).toBeUndefined();
    expect(arcadeTopScores(user, 'multimiam')).toEqual([40]);
  });

  test('l’historique réponse par réponse reste borné', () => {
    const user = { progressHistory: [] };
    for (let i = 0; i < PROGRESS_HISTORY_LIMIT + 7; i += 1) appendProgressHistory(user, { i });
    expect(user.progressHistory).toHaveLength(PROGRESS_HISTORY_LIMIT);
    expect(user.progressHistory[0]).toEqual({ i: 7 });
  });
});

describe('mode-stats : lectures', () => {
  test('« À revoir » : au moins 3 réponses, moins de 70 % de justes', () => {
    const stats = { review: { 2: '00', 3: '011', 4: '0111111', 5: '0011111111', 6: '110' } };
    // 2 : deux réponses seulement ; 3 : 67 % ; 4 : 86 % ; 5 : 80 % ; 6 : 67 %
    expect(weakTablesFrom(stats)).toEqual([3, 6]);
  });

  test('« Ton parcours » : tous les modes à questions et les réponses anciennes sans mode', () => {
    const stats = {
      modes: {
        quiz: { '×': { questions: 10, correct: 8 } },
        chrono: { '+': { games: 1, questions: 11, correct: 10 } },
        invasion: { '×': { games: 3, total: 300, best: 200 } },
      },
      imported: { questions: 4, correct: 1 },
    };
    expect(answerTotals(stats)).toEqual({ questions: 25, correct: 19 });
  });

  test('les opérations d’un mode, dans l’ordre ×, +, −, ÷ puis « ? »', () => {
    const stats = { modes: { quiz: { '?': {}, '÷': {}, '×': {}, '%': {} } } };
    expect(modeEntries(stats, 'quiz').map(entry => entry.operator)).toEqual(['×', '÷', '?']);
  });
});

describe('mode-stats : amorçage et relecture', () => {
  test('un journal ancien : opération lue dans l’énoncé, tiret ASCII compris ; mode inconnu à part', () => {
    const stats = seedModeStats({
      progressHistory: [
        { question: '7 × 8 = ?', correct: false, mode: 'quiz' },
        { question: '15 - 7 = ?', correct: true, mode: 'quiz' },
        { question: '6 x 7 = ?', correct: true, mode: 'adventure' },
        { question: '3 + 4 = ?', correct: true, mode: 'ancien' },
      ],
    });
    expect(stats.modes.quiz).toEqual({
      '×': { questions: 1, correct: 0 },
      '−': { questions: 1, correct: 1 },
    });
    expect(stats.modes.adventure).toEqual({ '×': { questions: 1, correct: 1 } });
    expect(stats.imported).toEqual({ questions: 1, correct: 1 });
    expect(stats.review).toEqual({ 6: '1', 7: '0' });
  });

  test('parties anciennes sans opération : celle du profil s’il n’en a joué qu’une, Découverte comprise', () => {
    const arcade = game => (game === 'invasion' ? [300, 100] : []);
    const invasionOperators = exploredTables =>
      Object.keys(seedModeStats({ discoveryProgress: { exploredTables } }, arcade).modes.invasion);
    expect(invasionOperators(['+:easy'])).toEqual(['+']);
    expect(invasionOperators(['7'])).toEqual(['×']);
    expect(invasionOperators(['7', '−:hard'])).toEqual(['?']);
    // Ancienne clé sans opération : la Découverte l'ignore, elle ne dit rien de l'opération
    expect(invasionOperators(['easy'])).toEqual(['?']);
  });

  test('les courses de Chrono hors multiplication sont comptées dans leur opération', () => {
    const stats = seedModeStats({
      chronoStats: { buckets: [{ count: 2 }] },
      chronoStatsByOperator: {
        '+': { buckets: [{ count: 3 }, { count: 1 }] },
        '−': { buckets: [] },
      },
    });
    expect(stats.modes.chrono).toEqual({
      '×': { games: 2, questions: 0, correct: 0 },
      '+': { games: 4, questions: 0, correct: 0 },
    });
  });

  test('une version plus récente du jeu : rendue telle quelle', () => {
    const future = { v: 2, autre: true };
    expect(normalizeModeStats({ modeStats: future })).toBe(future);
  });

  test('des valeurs abîmées sont nettoyées ; la relecture ne change rien', () => {
    const raw = {
      v: 1,
      modes: {
        quiz: { '×': { questions: '12', correct: 99 }, '%': { questions: 3 } },
        challenge: { '+': { games: -2, best: { hard: '50', expert: 9 } } },
        inconnu: { '×': { questions: 1 } },
      },
      imported: { questions: 'x' },
      arcadeTop5: { invasion: [5, 'a', 90, 30, 10, 70, 60] },
      review: { 7: '01x10', 11: '0000' },
    };
    const clean = normalizeModeStats({ modeStats: raw });
    expect(clean.modes).toEqual({
      quiz: { '×': { questions: 12, correct: 12 } },
      challenge: { '+': { games: 0, questions: 0, correct: 0, best: { hard: 50 } } },
    });
    expect(clean.imported).toEqual({ questions: 0, correct: 0 });
    expect(clean.arcadeTop5).toEqual({ invasion: [90, 70, 60, 30, 10] });
    expect(clean.review).toEqual({ 7: '0110' });
    expect(normalizeModeStats({ modeStats: JSON.parse(JSON.stringify(clean)) })).toEqual(clean);
  });
});

describe('mode-stats : filet de sécurité', () => {
  test('une lecture qui échoue rend des compteurs sans version, réamorcés à la lecture suivante', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    const hostile = {
      get progressHistory() {
        throw new Error('stockage illisible');
      },
    };
    const stats = normalizeModeStats(hostile);
    expect(stats.v).toBeUndefined();
    expect(stats.modes).toEqual({});
    expect(console.warn).toHaveBeenCalled();
    jest.restoreAllMocks();
  });

  const journal = length =>
    Array.from({ length }, (_, i) => ({
      question: '2 × 3 = ?',
      correct: true,
      mode: 'quiz',
      timestamp: i + 1,
    }));
  const nextAnswer = { question: '2 × 4 = ?', correct: true, mode: 'quiz', timestamp: 999 };

  test('un profil pas encore amorcé l’est sur tout son historique, avant la coupe à 100', () => {
    const user = { progressHistory: journal(150) };
    appendProgressHistory(user, nextAnswer);
    expect(user.modeStats.modes.quiz['×'].questions).toBe(150);
    expect(user.progressHistory).toHaveLength(PROGRESS_HISTORY_LIMIT);
  });

  test('amorçage en échec : l’historique n’est pas coupé, le prochain amorçage retrouvera tout', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    const user = {
      progressHistory: journal(150),
      get challengeStats() {
        throw new Error('stockage illisible');
      },
    };
    appendProgressHistory(user, nextAnswer);
    expect(user.modeStats.v).toBeUndefined();
    expect(user.progressHistory).toHaveLength(151);
    jest.restoreAllMocks();
  });
});
