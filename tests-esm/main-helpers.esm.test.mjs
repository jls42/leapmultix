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

  test('images décoratives, nom visible, état radio et cadenas sans émoji', () => {
    helpers.renderAvatarSelector('#avatar-choice');

    const buttons = [...document.querySelectorAll('#avatar-choice .avatar-btn')];
    expect(buttons).toHaveLength(5);
    for (const btn of buttons) {
      expect(btn.getAttribute('role')).toBe('radio');
      expect(btn.querySelector('img').getAttribute('alt')).toBe('');
      expect(btn.querySelector('.avatar-label').textContent).not.toBe('');
      expect(btn.textContent).not.toContain('🔒');
    }
    const byId = id => buttons.find(b => b.dataset.avatar === id);
    expect(byId('panda').getAttribute('aria-checked')).toBe('true');
    expect(byId('fox').getAttribute('aria-checked')).toBe('false');

    const unicorn = byId('unicorn');
    expect(unicorn.disabled).toBe(true);
    const lock = unicorn.querySelector('.lock-icon');
    expect(lock?.getAttribute('aria-hidden')).toBe('true');
    expect(lock?.querySelector('svg')).not.toBeNull();

    byId('fox').click();
    expect(byId('fox').getAttribute('aria-checked')).toBe('true');
    expect(byId('panda').getAttribute('aria-checked')).toBe('false');
  });

  test('noms et infobulle de verrouillage suivent un changement de langue (data-translate)', () => {
    helpers.renderAvatarSelector('#avatar-choice');

    const buttons = [...document.querySelectorAll('#avatar-choice .avatar-btn')];
    for (const btn of buttons) {
      expect(btn.querySelector('.avatar-label').dataset.translate).toBe(btn.dataset.avatar);
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
