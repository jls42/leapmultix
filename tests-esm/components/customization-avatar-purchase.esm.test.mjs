/* eslint-env jest, node */
/**
 * Avatar acheté dans la personnalisation, sur le vrai profil : l'enfant le porte aussitôt
 * (grille refaite, avatar coché et focalisé, aperçu, profil), un message le dit, et
 * « Enregistrer » ne défait pas l'achat (il réécrit le profil avec gameState).
 */
import { readFileSync } from 'node:fs';
import { describe, test, expect, beforeAll, beforeEach, afterEach } from '@jest/globals';
import { setTranslations } from '../../js/i18n-store.js';

const { Customization } = await import('../../js/components/customization.js');
const { renderAvatarSelector } = await import('../../js/main-helpers.js');
const { UserManager } = await import('../../js/userManager.js');
const { gameState } = await import('../../js/game.js');
const { HEAD_SIZES, avatarHeadAttributes } = await import('../../js/avatar-heads.js');

const FR = JSON.parse(readFileSync(new URL('../../assets/translations/fr.json', import.meta.url)));
// Mascotte et avatar actuel comme dans index.html : le renard, déjà en srcset
const SLIDE6 = `
  <span class="coin-count">0</span>
  <img id="hero-mascot-img" ${avatarHeadAttributes('fox', HEAD_SIZES.mascot)} alt="" />
  <section id="slide6" class="slide">
    <div class="current-avatar">
      <img id="current-avatar-img" ${avatarHeadAttributes('fox', HEAD_SIZES.current)} alt="" />
    </div>
    <div class="avatar-selector" role="radiogroup"></div>
    <div id="avatar-shop" class="avatar-shop" hidden>
      <p id="avatar-shop-intro" class="avatar-shop-intro"></p>
      <div class="avatar-shop-list"></div>
    </div>
  </section>`;

const stored = () => JSON.parse(localStorage.getItem('players')).Zoé;
const radios = () => [...document.querySelectorAll('#slide6 .avatar-radio')];
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

/** Achète un avatar de la boutique : bouton, puis « Débloquer » dans la fenêtre */
async function buy(avatarId) {
  document.querySelector(`#avatar-shop [data-avatar="${avatarId}"]`).click();
  await wait(0);
  [...document.querySelectorAll('[role="alertdialog"] button')]
    .find(b => b.textContent === 'Débloquer')
    .click();
  await wait(0);
}

beforeAll(() => {
  setTranslations(FR);
  Customization.init();
});

beforeEach(() => {
  localStorage.clear();
  document.body.replaceChildren(
    ...new DOMParser().parseFromString(SLIDE6, 'text/html').body.childNodes
  );
  UserManager._players = {
    Zoé: { nickname: 'Zoé', avatar: 'fox', coins: 62, unlockedAvatars: ['fox'] },
  };
  UserManager._currentUser = 'Zoé';
  gameState.avatar = 'fox';
  gameState.nickname = 'Zoé';
  gameState.unlockedAvatars = ['fox'];
  renderAvatarSelector('#slide6 .avatar-selector');
});

afterEach(() => {
  document.body.replaceChildren();
  UserManager._players = {};
  UserManager._currentUser = null;
});

describe('Personnalisation : avatar acheté avec les pièces', () => {
  test('l’enfant le porte aussitôt : coché, focalisé, aperçu et profil à jour', async () => {
    await buy('dragon');
    expect(radios().map(radio => radio.value)).toEqual(['fox', 'dragon']);
    const dragon = radios().find(radio => radio.value === 'dragon');
    expect(dragon.checked).toBe(true);
    expect(document.activeElement).toBe(dragon);
    // Avec un srcset, c'est lui que le navigateur lit : un src seul changé laisserait le renard
    for (const id of ['current-avatar-img', 'hero-mascot-img']) {
      const img = document.getElementById(id);
      expect([id, img.getAttribute('srcset')]).toEqual([id, expect.stringMatching(/dragon/)]);
      expect(img.getAttribute('srcset')).not.toMatch(/fox/);
      expect(img.dataset.fallback).toBe('assets/images/arcade/dragon_head_avatar_128x128.png');
    }
    expect(gameState.avatar).toBe('dragon');
    expect(stored()).toMatchObject({
      avatar: 'dragon',
      coins: 12,
      unlockedAvatars: ['fox', 'dragon'],
    });
    expect(document.querySelector('#avatar-shop [data-avatar="dragon"]')).toBeNull();
  });

  test('un message dit le nouvel avatar', async () => {
    await buy('dragon');
    await wait(20);
    expect(document.querySelector('.message-popup[role="status"]')?.textContent).toBe(
      'Nouvel avatar : Dragon !'
    );
  });

  test('« Enregistrer » après l’achat garde l’avatar débloqué', async () => {
    await buy('dragon');
    Customization.save();
    expect(stored().unlockedAvatars).toEqual(['fox', 'dragon']);
    expect(stored().avatar).toBe('dragon');
  });
});

describe('Profil d’avant : l’avatar porté reste à l’enfant', () => {
  // Avant les pièces, tous les avatars étaient libres : Zoé porte le panda (instantané d'une
  // version publiée, tests-esm/helpers/legacy-profiles.mjs) et sa liste ne dit que le renard
  beforeEach(() => {
    UserManager._players = {
      Zoé: { nickname: 'Zoé', avatar: 'panda', coins: 62, unlockedAvatars: ['fox'] },
    };
    gameState.avatar = 'panda';
    gameState.unlockedAvatars = ['fox'];
    renderAvatarSelector('#slide6 .avatar-selector');
    Customization._wireAvatarSelection();
  });

  test('après l’achat du dragon, le panda reste dans ses avatars, pas dans la boutique', async () => {
    await buy('dragon');
    expect(radios().map(radio => radio.value)).toEqual(['fox', 'panda', 'dragon']);
    expect(document.querySelector('#avatar-shop [data-avatar="panda"]')).toBeNull();
    expect([...stored().unlockedAvatars].sort()).toEqual(['dragon', 'fox', 'panda']);
  });

  test('essayer le renard ne lui retire pas le panda, même après « Enregistrer »', () => {
    const fox = radios().find(radio => radio.value === 'fox');
    fox.checked = true;
    fox.dispatchEvent(new Event('change', { bubbles: true }));
    Customization.save();
    renderAvatarSelector('#slide6 .avatar-selector');
    expect(radios().map(radio => radio.value)).toEqual(['fox', 'panda']);
    expect(stored()).toMatchObject({ avatar: 'fox', unlockedAvatars: ['fox', 'panda'] });
  });
});
