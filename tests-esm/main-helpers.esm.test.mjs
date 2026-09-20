/* eslint-env jest, node */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';

const helpers = await import('../js/main-helpers.js');
const { UserManager } = await import('../js/userManager.js');

const currentBackground = () => document.body.style.getPropertyValue('--current-bg-image-url');

describe('Fond illustré : un monde fixe par avatar, sans rotation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('aucune minuterie : l’image ne change pas avec le temps', () => {
    const setIntervalSpy = jest.spyOn(globalThis, 'setInterval');

    helpers.startBackgroundRotation('dragon');
    const first = currentBackground();
    expect(first).toMatch(/background_dragon_\d{3}\.png/);

    jest.advanceTimersByTime(10 * 60 * 1000);
    expect(currentBackground()).toBe(first);
    expect(setIntervalSpy).not.toHaveBeenCalled();
  });

  test('même avatar = même monde ; changer d’avatar change de monde ; revenir le retrouve', () => {
    helpers.updateBackgroundByAvatar('unicorn');
    const unicornWorld = currentBackground();
    expect(unicornWorld).toMatch(/background_unicorn_\d{3}\.png/);

    helpers.updateBackgroundByAvatar('unicorn');
    helpers.startBackgroundRotation('unicorn');
    expect(currentBackground()).toBe(unicornWorld);

    helpers.updateBackgroundByAvatar('panda');
    expect(currentBackground()).toMatch(/background_panda_\d{3}\.png/);

    helpers.updateBackgroundByAvatar('licorne');
    expect(currentBackground()).toBe(unicornWorld);
  });
});

describe('Avatars : chemins filtrés et sélecteur de la personnalisation', () => {
  beforeEach(() => {
    document.body.innerHTML =
      '<div class="avatar-selector" id="avatar-choice" role="radiogroup"></div>' +
      '<p id="welcome-message"></p>';
    UserManager._players = {
      Lina: { avatar: 'panda', nickname: 'Lina', unlockedAvatars: ['fox', 'panda'] },
    };
    UserManager._currentUser = 'Lina';
  });

  afterEach(() => {
    document.body.innerHTML = '';
    UserManager._players = {};
    UserManager._currentUser = null;
  });

  test('getAvatarHeadSrc n’accepte que les avatars connus', () => {
    expect(helpers.getAvatarHeadSrc('dragon')).toBe(
      'assets/images/arcade/dragon_head_avatar_128x128.png'
    );
    expect(helpers.getAvatarHeadSrc('renard')).toBe(
      'assets/images/arcade/fox_head_avatar_128x128.png'
    );
    expect(helpers.getAvatarHeadSrc('x" onerror="alert(1)')).toBe(
      'assets/images/arcade/fox_head_avatar_128x128.png'
    );
    expect(helpers.getAvatarHeadSrc(undefined)).toBe(
      'assets/images/arcade/fox_head_avatar_128x128.png'
    );
  });

  test('images décoratives, nom visible, boutons radio natifs et cadenas sans émoji', () => {
    helpers.renderAvatarSelector('#avatar-choice');

    const tiles = [...document.querySelectorAll('#avatar-choice .avatar-btn')];
    expect(tiles).toHaveLength(5);
    for (const tile of tiles) {
      expect(tile.tagName).toBe('LABEL');
      expect(tile.querySelector('.avatar-radio').type).toBe('radio');
      expect(tile.querySelector('img').getAttribute('alt')).toBe('');
      expect(tile.querySelector('.avatar-label').textContent).not.toBe('');
      expect(tile.textContent).not.toContain('🔒');
    }
    const radioOf = id => document.querySelector(`#avatar-choice .avatar-radio[value="${id}"]`);
    expect(radioOf('panda').checked).toBe(true);
    expect(radioOf('fox').checked).toBe(false);

    const unicorn = radioOf('unicorn');
    expect(unicorn.disabled).toBe(true);
    const lock = unicorn.closest('.avatar-btn').querySelector('.lock-icon');
    expect(lock?.getAttribute('aria-hidden')).toBe('true');
    expect(lock?.querySelector('svg')).not.toBeNull();

    // Un seul avatar coché à la fois : c'est le groupe natif qui s'en charge
    radioOf('fox').click();
    expect(radioOf('fox').checked).toBe(true);
    expect(radioOf('panda').checked).toBe(false);
  });

  test('noms et infobulle de verrouillage suivent un changement de langue (data-translate)', () => {
    helpers.renderAvatarSelector('#avatar-choice');

    const buttons = [...document.querySelectorAll('#avatar-choice .avatar-btn')];
    for (const btn of buttons) {
      expect(btn.querySelector('.avatar-label').dataset.translate).toBe(
        btn.querySelector('.avatar-radio').value
      );
    }
    const locked = buttons.filter(b => b.classList.contains('locked'));
    expect(locked.length).toBeGreaterThan(0);
    for (const btn of locked) {
      expect(btn.dataset.translateTitle).toBe('avatar_locked_tooltip');
    }
    const unlocked = buttons.find(b => !b.classList.contains('locked'));
    expect(unlocked.hasAttribute('data-translate-title')).toBe(false);
  });

  test('la mascotte accueille le joueur en une ligne, avec son prénom', async () => {
    await helpers.updateWelcomeMessageUI();

    const message = document.getElementById('welcome-message');
    expect(message.textContent).toContain('Lina');
    expect(message.querySelector('br')).toBeNull();
  });
});
