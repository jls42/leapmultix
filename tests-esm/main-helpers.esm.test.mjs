/* eslint-env jest, node */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { readFileSync } from 'node:fs';

const helpers = await import('../js/main-helpers.js');
const { UserManager } = await import('../js/userManager.js');
const { setTranslations } = await import('../js/i18n-store.js');

const FR = JSON.parse(readFileSync(new URL('../assets/translations/fr.json', import.meta.url)));
/** Boutique des avatars, telle qu'index.html la pose sous la grille */
const SHOP = `<div id="avatar-shop" class="avatar-shop" hidden>
  <p id="avatar-shop-intro" class="avatar-shop-intro"></p>
  <div class="avatar-shop-list"></div>
</div>`;
const parse = markup => [...new DOMParser().parseFromString(markup, 'text/html').body.childNodes];

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

  test('grille et boutique : la tête de chaque avatar, en WebP à la taille de la grille', () => {
    document.body.append(...parse(SHOP));
    helpers.renderAvatarSelector('#avatar-choice');
    const heads = [...document.querySelectorAll('#avatar-choice img, #avatar-shop img')];
    expect(heads.map(img => img.dataset.fallback)).toEqual(
      ['fox', 'panda', 'unicorn', 'dragon', 'astronaut'].map(
        avatar => `assets/images/arcade/${avatar}_head_avatar_128x128.png`
      )
    );
    for (const img of heads) {
      const avatar = /arcade\/([a-z]+)_head_avatar_128x128/.exec(img.dataset.fallback)[1];
      expect(img.getAttribute('srcset')).toMatch(
        new RegExp(`^assets/generated-images/arcade/${avatar}_head_avatar-128\\.webp 128w, `)
      );
      // css/theme-selector.css #slide6 .avatar-btn img
      expect(img.getAttribute('sizes')).toBe('(max-width: 480px) 56px, 72px');
    }
  });

  test('la grille ne propose que les avatars du joueur, en boutons radio natifs', () => {
    helpers.renderAvatarSelector('#avatar-choice');

    const tiles = [...document.querySelectorAll('#avatar-choice .avatar-btn')];
    expect(tiles.map(tile => tile.querySelector('.avatar-radio').value)).toEqual(['fox', 'panda']);
    for (const tile of tiles) {
      expect(tile.tagName).toBe('LABEL');
      expect(tile.querySelector('.avatar-radio').type).toBe('radio');
      expect(tile.querySelector('.avatar-radio').disabled).toBe(false);
      expect(tile.querySelector('img').getAttribute('alt')).toBe('');
      expect(tile.querySelector('.avatar-label').textContent).not.toBe('');
      expect(tile.querySelector('.lock-icon')).toBeNull();
    }
    const radioOf = id => document.querySelector(`#avatar-choice .avatar-radio[value="${id}"]`);
    expect(radioOf('panda').checked).toBe(true);
    expect(radioOf('fox').checked).toBe(false);

    // Un seul avatar coché à la fois : c'est le groupe natif qui s'en charge
    radioOf('fox').click();
    expect(radioOf('fox').checked).toBe(true);
    expect(radioOf('panda').checked).toBe(false);
  });

  test('les autres avatars passent dans la boutique, chacun avec son prix', () => {
    setTranslations(FR);
    document.body.append(...parse(SHOP));
    helpers.renderAvatarSelector('#avatar-choice');

    const shop = document.getElementById('avatar-shop');
    expect(shop.hidden).toBe(false);
    const offers = [...shop.querySelectorAll('button.avatar-buy-btn')];
    expect(offers.map(button => button.dataset.avatar)).toEqual(['unicorn', 'dragon', 'astronaut']);
    for (const button of offers) {
      expect(button.querySelector('.avatar-price').textContent).toBe('50\u00a0pièces');
      expect(button.querySelector('.lock-icon svg')).not.toBeNull();
    }
    // Le groupe radio ne contient que des boutons radio (aria-required-children)
    expect(document.querySelectorAll('#avatar-choice button')).toHaveLength(0);
  });

  test('les noms suivent un changement de langue (data-translate), grille et boutique', () => {
    document.body.append(...parse(SHOP));
    helpers.renderAvatarSelector('#avatar-choice');

    for (const btn of document.querySelectorAll('#avatar-choice .avatar-btn')) {
      expect(btn.querySelector('.avatar-label').dataset.translate).toBe(
        btn.querySelector('.avatar-radio').value
      );
    }
    for (const btn of document.querySelectorAll('#avatar-shop .avatar-buy-btn')) {
      expect(btn.querySelector('.avatar-label').dataset.translate).toBe(btn.dataset.avatar);
    }
  });

  test('tout débloqué : les cinq avatars dans la grille, plus de boutique', () => {
    document.body.append(...parse(SHOP));
    UserManager._players.Lina.unlockedAvatars = ['fox', 'panda', 'unicorn', 'dragon', 'astronaut'];
    helpers.renderAvatarSelector('#avatar-choice');
    expect(document.querySelectorAll('#avatar-choice .avatar-radio')).toHaveLength(5);
    expect(document.getElementById('avatar-shop').hidden).toBe(true);
    expect(document.querySelectorAll('#avatar-shop button')).toHaveLength(0);
  });

  test('l’avatar que l’enfant porte n’est jamais à acheter (profil hérité)', () => {
    // Profils d'avant : l'avatar choisi à la création manque parfois dans unlockedAvatars
    document.body.append(...parse(SHOP));
    UserManager._players.Lina.unlockedAvatars = ['fox'];
    helpers.renderAvatarSelector('#avatar-choice');
    const panda = document.querySelector('#avatar-choice .avatar-radio[value="panda"]');
    expect(panda.checked).toBe(true);
    expect(document.querySelector('#avatar-shop [data-avatar="panda"]')).toBeNull();
    // Le profil n'est pas réécrit : seul l'affichage change
    expect(UserManager._players.Lina.unlockedAvatars).toEqual(['fox']);
  });

  test('la boutique suit la grille de la personnalisation, et ses textes disent le vrai', () => {
    const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
    const page = new DOMParser().parseFromString(html, 'text/html');
    const shop = page.querySelector('#slide6 .avatar-selector + #avatar-shop');
    expect(shop?.hidden).toBe(true);
    expect(shop.querySelector('#avatar-shop-intro')).not.toBeNull();
    expect(shop.querySelector('.avatar-shop-list')).not.toBeNull();
    for (const lang of ['fr', 'en', 'es']) {
      const t = JSON.parse(
        readFileSync(new URL(`../assets/translations/${lang}.json`, import.meta.url), 'utf8')
      );
      // Les pièces débloquent un avatar ; l'Aventure, elle, n'en débloque aucun
      expect(t.avatar_shop_intro).toMatch(/pièces|coins|monedas/);
      expect(t.avatar_shop_intro).not.toMatch(/Aventura|Adventure|Aventure/i);
    }
  });

  test('la mascotte accueille le joueur en une ligne, avec son prénom', async () => {
    await helpers.updateWelcomeMessageUI();

    const message = document.getElementById('welcome-message');
    expect(message.textContent).toContain('Lina');
    expect(message.querySelector('br')).toBeNull();
  });
});
