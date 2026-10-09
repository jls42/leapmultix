/* eslint-env jest, node */
/**
 * Avatars débloqués avec les pièces (core/avatar-shop.js) : assez de pièces, il se débloque et les
 * pièces baissent ; sinon, rien ne change, et le jeu sait combien il en manque.
 */
import { describe, test, expect } from '@jest/globals';
import {
  AVATAR_PRICE,
  buyAvatar,
  keepWornAvatar,
  missingCoins,
} from '../../js/core/avatar-shop.js';

const player = coins => ({ coins, unlockedAvatars: ['fox'] });

describe('Avatars achetés avec les pièces', () => {
  test('assez de pièces : l’avatar se débloque, les pièces baissent du prix', () => {
    const user = player(AVATAR_PRICE + 12);
    expect(buyAvatar(user, 'dragon')).toBe('unlocked');
    expect(user).toEqual({ coins: 12, unlockedAvatars: ['fox', 'dragon'] });
  });

  test('pas assez : rien ne change, et il manque la différence', () => {
    const user = player(AVATAR_PRICE - 13);
    expect(missingCoins(user)).toBe(13);
    expect(buyAvatar(user, 'dragon')).toBe('missing');
    expect(user).toEqual(player(AVATAR_PRICE - 13));
  });

  test('déjà débloqué : rien n’est débité', () => {
    const user = player(200);
    expect(buyAvatar(user, 'fox')).toBe('already');
    expect(user.coins).toBe(200);
  });

  test('pièces absentes ou abîmées : comptées comme zéro', () => {
    expect(missingCoins({})).toBe(AVATAR_PRICE);
    expect(missingCoins({ coins: 'beaucoup' })).toBe(AVATAR_PRICE);
    expect(missingCoins({ coins: -5 })).toBe(AVATAR_PRICE);
    const user = { coins: 'beaucoup' };
    expect(buyAvatar(user, 'panda')).toBe('missing');
    expect(user).toEqual({ coins: 'beaucoup' });
  });
});

describe('Avatar porté (profil d’avant les pièces)', () => {
  test('absent de la liste : il y entre, sans rien retirer', () => {
    const user = { avatar: 'panda', unlockedAvatars: ['fox'] };
    keepWornAvatar(user, 'panda');
    expect(user.unlockedAvatars).toEqual(['fox', 'panda']);
  });

  test('déjà dans la liste, ou liste absente : une seule fois', () => {
    const user = { unlockedAvatars: ['fox', 'panda'] };
    keepWornAvatar(user, 'panda');
    expect(user.unlockedAvatars).toEqual(['fox', 'panda']);
    const old = {};
    keepWornAvatar(old, 'unicorn');
    expect(old.unlockedAvatars).toEqual(['unicorn']);
  });
});
