/* eslint-env jest, node */
/**
 * Défi du jour terminé : la récompense s'affiche aussitôt dans le compteur de pièces,
 * quel que soit le mode qui a donné la dernière bonne réponse (Chrono, Défi, Aventure).
 * Profil réel (UserManager) : c'est lui que lit le compteur.
 */
import { test, expect, jest } from '@jest/globals';

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

test('la bonne réponse qui termine le Défi du jour met à jour le compteur de pièces', () => {
  document.body.innerHTML = '<span class="coin-count">5</span>';
  jest.spyOn(console, 'log').mockImplementation(() => {});
  UserManager._players = {
    zoe: {
      nickname: 'zoe',
      coins: 5,
      dailyChallenge: { completedDate: null, progress: 4, lastPlayedDate: getCurrentDateString() },
    },
  };
  UserManager._currentUser = 'zoe';

  updateDailyChallengeProgress(Number.parseInt(getDailyChallengeTable(), 10), 3);

  expect(UserManager.getCurrentUserData().coins).toBe(15);
  expect(document.querySelector('.coin-count').textContent).toBe('15');
});
