/* eslint-env jest, node */
/**
 * Défi du jour : cinq bonnes réponses sur la table du jour, pas quatre, donnent la récompense
 * de 10 pièces, une seule fois par jour ; le lendemain, le défi repart de zéro. Profil réel
 * (UserManager), horloge simulée : la table du jour et la date ne dépendent pas du jour du test.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';

jest.unstable_mockModule('../js/speech.js', () => ({
  speak: jest.fn(),
  preloadSpeech: jest.fn(),
  isVoiceEnabled: () => false,
  updateSpeechVoice: () => {},
  cancelSpeech: () => {},
  whenSpeechEnds: () => Promise.resolve(),
}));

const { UserManager } = await import('../js/userManager.js');
const { getDailyChallengeTable } = await import('../js/utils-es6.js');
const { getCurrentDateString } = await import('../js/core/storage.js');
const { updateDailyChallengeProgress } = await import('../js/game.js');

const DAY = 24 * 60 * 60 * 1000;
// Midi, heure de l'appareil : le jour ne change pas pendant le test, quel que soit le fuseau
const NOON = new Date(2026, 4, 12, 12, 0, 0).getTime();

const dailyTable = () => Number.parseInt(getDailyChallengeTable(), 10);
/** Une bonne réponse sur la table du jour */
const answerDailyTable = () => updateDailyChallengeProgress(dailyTable(), 3);
const profile = () => UserManager.getCurrentUserData();

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(NOON);
  localStorage.clear();
  const coins = document.createElement('span');
  coins.className = 'coin-count';
  coins.textContent = '5';
  document.body.replaceChildren(coins);
  jest.spyOn(console, 'log').mockImplementation(() => {});
  UserManager._players = {
    zoe: {
      nickname: 'zoe',
      coins: 5,
      dailyChallenge: { completedDate: null, progress: 0, lastPlayedDate: getCurrentDateString() },
    },
  };
  UserManager._currentUser = 'zoe';
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('Défi du jour : cinq bonnes réponses', () => {
  test('quatre bonnes réponses ne suffisent pas : ni pièce ni défi terminé', () => {
    for (let i = 0; i < 4; i++) answerDailyTable();
    expect(profile().dailyChallenge).toMatchObject({ progress: 4, completedDate: null });
    expect(profile().coins).toBe(5);
    expect(profile().dailyChallengesCompleted ?? 0).toBe(0);
  });

  test('la cinquième termine le défi : 10 pièces, une fois', () => {
    for (let i = 0; i < 5; i++) answerDailyTable();
    expect(profile().dailyChallenge).toMatchObject({
      progress: 5,
      completedDate: getCurrentDateString(),
    });
    expect(profile().coins).toBe(15);
    expect(profile().dailyChallengesCompleted).toBe(1);
    expect(document.querySelector('.coin-count').textContent).toBe('15');

    // Les bonnes réponses suivantes du même jour ne rapportent plus rien
    for (let i = 0; i < 6; i++) answerDailyTable();
    expect(profile().coins).toBe(15);
    expect(profile().dailyChallengesCompleted).toBe(1);
  });

  test('une réponse hors de la table du jour ne compte pas ; le multiplicande du jour, si', () => {
    const other = dailyTable() === 2 ? 3 : 2;
    updateDailyChallengeProgress(other, other);
    expect(profile().dailyChallenge.progress).toBe(0);
    updateDailyChallengeProgress(other, dailyTable());
    expect(profile().dailyChallenge.progress).toBe(1);
  });

  test('le lendemain, le défi repart de zéro et se gagne de nouveau', () => {
    for (let i = 0; i < 5; i++) answerDailyTable();
    jest.setSystemTime(NOON + DAY);
    answerDailyTable();
    expect(profile().dailyChallenge).toMatchObject({
      progress: 1,
      completedDate: expect.any(String),
    });
    expect(profile().coins).toBe(15);
    for (let i = 0; i < 4; i++) answerDailyTable();
    expect(profile().coins).toBe(25);
    expect(profile().dailyChallengesCompleted).toBe(2);
  });
});
