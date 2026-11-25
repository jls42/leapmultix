/* eslint-env jest, node */
/**
 * Défi du jour terminé : la récompense s'affiche aussitôt dans le compteur de pièces,
 * quel que soit le mode qui a donné la dernière bonne réponse (Chrono, Défi, Aventure).
 * Profil réel (UserManager) : c'est lui que lit le compteur.
 * Le message « Tu as terminé le défi du jour » s'affiche tout de suite hors partie ; pendant
 * une partie il attend (il se posait sur les réponses), et l'écran de fin le dit à sa place.
 */
import { test, expect, beforeEach, jest } from '@jest/globals';

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
const { setTranslations } = await import('../js/i18n-store.js');
const { AudioManager } = await import('../js/core/audio.js');
const { holdRewardAnnouncements, takeRewardNotes, releaseRewardAnnouncements } = await import(
  '../js/core/session-rewards.js'
);

/** Un joueur à une bonne réponse de la fin du défi du jour */
function playerAboutToFinish() {
  document.body.innerHTML = '<span class="coin-count">5</span>';
  UserManager._players = {
    zoe: {
      nickname: 'zoe',
      coins: 5,
      dailyChallenge: { completedDate: null, progress: 4, lastPlayedDate: getCurrentDateString() },
    },
  };
  UserManager._currentUser = 'zoe';
}

const finishDailyChallenge = () =>
  updateDailyChallengeProgress(Number.parseInt(getDailyChallengeTable(), 10), 3);
const message = () => document.querySelector('.message-popup')?.textContent ?? null;
/** Le message s'écrit un instant après sa pose (annonce aux lecteurs d'écran) */
const shown = () => new Promise(resolve => setTimeout(resolve, 60));

beforeEach(() => {
  releaseRewardAnnouncements();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  // Le badge du défi sonne : jsdom ne joue aucun son
  jest.spyOn(AudioManager, 'playSound').mockImplementation(() => {});
  setTranslations({
    daily_challenge_finished_message: 'Bravo ! Défi du jour terminé : +{reward} pièces.',
  });
});

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

test('hors partie, le message de fin du défi du jour s’affiche tout de suite', async () => {
  playerAboutToFinish();
  finishDailyChallenge();
  await shown();
  expect(message()).toBe('Bravo ! Défi du jour terminé : +10 pièces.');
});

test('pendant une partie, il attend : rien sur le jeu, l’écran de fin en reçoit la phrase', async () => {
  playerAboutToFinish();
  holdRewardAnnouncements();
  finishDailyChallenge();
  await shown();

  // Les pièces, elles, sont là tout de suite (compteur de la barre du haut)
  expect(UserManager.getCurrentUserData().coins).toBe(15);
  expect(message()).toBeNull();
  expect(takeRewardNotes()).toEqual(['results_daily_challenge_done']);
  expect(message()).toBeNull();
});

test('partie quittée avant son écran de fin : le message s’affiche à la sortie', async () => {
  playerAboutToFinish();
  holdRewardAnnouncements();
  finishDailyChallenge();
  await shown();
  expect(message()).toBeNull();

  releaseRewardAnnouncements();
  await shown();
  expect(message()).toBe('Bravo ! Défi du jour terminé : +10 pièces.');
});
