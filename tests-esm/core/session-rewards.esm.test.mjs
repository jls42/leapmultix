/* eslint-env jest, node */
/**
 * Gains d'une partie (js/core/session-rewards.js) : ce qu'elle a rapporté depuis son départ,
 * et l'annonce de ces gains, retenue tant que la partie dure (une bulle se posait sur le jeu).
 */
import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { createUserStateMock } from '../helpers/mode-test-helpers.mjs';

const userStore = { coins: 4, unlockedBadges: ['quiz_starter'] };
jest.unstable_mockModule('../../js/core/userState.js', () => createUserStateMock(userStore));

const {
  rewardsSnapshot,
  rewardsSince,
  holdRewardAnnouncements,
  announceReward,
  takeRewardNotes,
  releaseRewardAnnouncements,
} = await import('../../js/core/session-rewards.js');

beforeEach(() => {
  // Aucune partie en cours d'un test à l'autre
  releaseRewardAnnouncements();
  userStore.coins = 4;
  userStore.unlockedBadges = ['quiz_starter'];
});

describe('Ce que la partie a rapporté', () => {
  test('pièces et badges gagnés depuis l’instantané, jamais ceux d’avant', () => {
    const start = rewardsSnapshot();
    expect(rewardsSince(start)).toEqual({ coins: 0, badges: [] });

    userStore.coins = 17;
    userStore.unlockedBadges = ['quiz_starter', 'daily_challenger', 'perfect_quiz'];
    expect(rewardsSince(start)).toEqual({
      coins: 13,
      badges: ['daily_challenger', 'perfect_quiz'],
    });
  });

  test('l’instantané est une copie : un badge ajouté ensuite ne s’y glisse pas', () => {
    const start = rewardsSnapshot();
    userStore.unlockedBadges.push('adventurer');
    expect(start.badges).toEqual(['quiz_starter']);
    expect(rewardsSince(start).badges).toEqual(['adventurer']);
  });

  test('un achat pendant la partie ne donne pas un gain négatif ; sans instantané, rien', () => {
    const start = rewardsSnapshot();
    userStore.coins = 1;
    expect(rewardsSince(start).coins).toBe(0);
    expect(rewardsSince()).toEqual({ coins: 0, badges: [] });
  });

  test('profil sans badge ni pièce : zéro, pas une erreur', () => {
    delete userStore.coins;
    delete userStore.unlockedBadges;
    expect(rewardsSnapshot()).toEqual({ coins: 0, badges: [] });
  });
});

describe('L’annonce d’un gain', () => {
  test('hors partie, elle part tout de suite', () => {
    const show = jest.fn();
    announceReward(show);
    expect(show).toHaveBeenCalledTimes(1);
  });

  test('pendant une partie, elle attend ; l’écran de fin la remplace et dit ses phrases', () => {
    const badge = jest.fn();
    const daily = jest.fn();
    holdRewardAnnouncements();
    announceReward(badge);
    announceReward(daily, 'results_daily_challenge_done');
    expect(badge).not.toHaveBeenCalled();
    expect(daily).not.toHaveBeenCalled();

    expect(takeRewardNotes()).toEqual(['results_daily_challenge_done']);
    // Les bulles retenues ne s'affichent plus : l'écran de fin a dit les gains
    releaseRewardAnnouncements();
    expect(badge).not.toHaveBeenCalled();
    expect(daily).not.toHaveBeenCalled();

    // La partie est finie : l'annonce suivante part tout de suite
    const later = jest.fn();
    announceReward(later);
    expect(later).toHaveBeenCalledTimes(1);
  });

  test('partie quittée avant son écran de fin : les annonces s’affichent, dans l’ordre', () => {
    const order = [];
    holdRewardAnnouncements();
    announceReward(() => order.push('message'), 'results_daily_challenge_done');
    announceReward(() => order.push('badge'));
    expect(order).toEqual([]);

    releaseRewardAnnouncements();
    expect(order).toEqual(['message', 'badge']);
    // Une seule fois
    releaseRewardAnnouncements();
    expect(order).toEqual(['message', 'badge']);
    expect(takeRewardNotes()).toEqual([]);
  });

  test('une partie relancée garde les annonces déjà retenues', () => {
    const show = jest.fn();
    holdRewardAnnouncements();
    announceReward(show);
    holdRewardAnnouncements();
    releaseRewardAnnouncements();
    expect(show).toHaveBeenCalledTimes(1);
  });

  test('sans partie, l’écran de fin n’a aucune phrase en plus', () => {
    expect(takeRewardNotes()).toEqual([]);
  });
});
