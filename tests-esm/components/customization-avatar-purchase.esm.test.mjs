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

const FR = JSON.parse(readFileSync(new URL('../../assets/translations/fr.json', import.meta.url)));
const SLIDE6 = `
  <span class="coin-count">0</span>
  <section id="slide6" class="slide">
    <div class="current-avatar"><img id="current-avatar-img" src="" alt="" /></div>
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
    expect(document.getElementById('current-avatar-img').getAttribute('src')).toContain(
      'dragon_head'
    );
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
