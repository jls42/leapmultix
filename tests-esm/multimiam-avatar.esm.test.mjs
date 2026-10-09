/* eslint-env jest, node */
/**
 * MultiMiam : updatePlayerAvatar reprend l'avatar choisi (gameState.avatar, « fox » par défaut)
 * parmi les avatars chargés ; un avatar absent laisse l'ancien en place, avec un avertissement.
 */
import { afterEach, describe, expect, jest, test } from '@jest/globals';

const gameState = { avatar: 'fox' };
jest.unstable_mockModule('../js/utils-es6.js', () => ({
  showArcadeMessage: jest.fn(),
  showArcadePoints: jest.fn(),
  getTranslation: key => key,
}));
jest.unstable_mockModule('../js/arcade.js', () => ({ showArcadeGameOver: jest.fn() }));
jest.unstable_mockModule('../js/arcade-points.js', () => ({ showArcadePenalty: jest.fn() }));
jest.unstable_mockModule('../js/game-cleanup.js', () => ({ cleanupGameResources: jest.fn() }));
jest.unstable_mockModule('../js/components/infoBar.js', () => ({
  InfoBar: { update: jest.fn(), renderLives: jest.fn() },
}));
jest.unstable_mockModule('../js/game.js', () => ({ gameState }));
jest.unstable_mockModule('../js/core/operation-stats.js', () => ({
  recordOperationResult: jest.fn(),
}));
jest.unstable_mockModule('../js/userManager.js', () => ({
  UserManager: { getCurrentUser: () => null },
}));
jest.unstable_mockModule('../js/core/tablePreferences.js', () => ({
  TablePreferences: { isGlobalEnabled: () => false, getActiveExclusions: () => [] },
}));

const { PacmanGame } = await import('../js/multimiam.js');

const fox = { name: 'fox' };
const panda = { name: 'panda' };
const otherPanda = { name: 'panda' };

/** Applique updatePlayerAvatar à un jeu réduit à ses avatars */
function update(avatars, selectedAvatar, avatar) {
  gameState.avatar = avatar;
  const game = { avatars, selectedAvatar };
  PacmanGame.prototype.updatePlayerAvatar.call(game);
  return game.selectedAvatar;
}

afterEach(() => jest.restoreAllMocks());

describe('MultiMiam : avatar du joueur', () => {
  test('sans avatars chargés : rien ne change', () => {
    expect(update(undefined, fox, 'panda')).toBe(fox);
    expect(update(null, undefined, 'panda')).toBeUndefined();
  });

  test('l’avatar choisi est pris dans la liste, le premier de ce nom', () => {
    expect(update([fox, panda, otherPanda], fox, 'panda')).toBe(panda);
    expect(update([fox, panda], undefined, 'panda')).toBe(panda);
  });

  test('pas d’avatar choisi : le renard', () => {
    expect(update([panda, fox], panda, '')).toBe(fox);
    expect(update([panda, fox], panda, undefined)).toBe(fox);
  });

  test('déjà le bon nom : l’avatar en place reste, même si un autre porte ce nom', () => {
    expect(update([panda], otherPanda, 'panda')).toBe(otherPanda);
  });

  test('absent de la liste : l’ancien reste, avec un avertissement', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    expect(update([fox], panda, 'dragon')).toBe(panda);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('dragon');
    warn.mockClear();
    expect(update([fox], undefined, 'dragon')).toBeUndefined();
    expect(update([fox], 0, 'dragon')).toBe(0);
    expect(warn).not.toHaveBeenCalled();
  });
});
