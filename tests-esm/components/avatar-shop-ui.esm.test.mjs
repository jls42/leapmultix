/* eslint-env jest, node */
/**
 * Avatars à débloquer avec les pièces (components/avatarShop.js), sur le vrai profil et les
 * vrais textes : un bouton par avatar verrouillé, avec son prix ; la fenêtre du jeu demande
 * confirmation, puis l'achat débloque, débite, s'enregistre et prévient la personnalisation.
 * Sans assez de pièces, rien ne change : la fenêtre dit combien il en manque.
 */
import { readFileSync } from 'node:fs';
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { setTranslations } from '../../js/i18n-store.js';

const { renderAvatarShop } = await import('../../js/components/avatarShop.js');
const { UserManager } = await import('../../js/userManager.js');
const { gameState } = await import('../../js/game.js');
const { eventBus } = await import('../../js/core/eventBus.js');

const FR = JSON.parse(readFileSync(new URL('../../assets/translations/fr.json', import.meta.url)));
const EN = JSON.parse(readFileSync(new URL('../../assets/translations/en.json', import.meta.url)));
const SHOP = `
  <span class="coin-count">0</span>
  <div id="avatar-shop" class="avatar-shop" hidden>
    <p id="avatar-shop-intro" class="avatar-shop-intro"></p>
    <div class="avatar-shop-list"></div>
  </div>`;
const headSrc = avatar => `assets/images/arcade/${avatar}_head_avatar_128x128.png`;

const zoe = coins => ({ nickname: 'Zoé', avatar: 'fox', coins, unlockedAvatars: ['fox'] });
const shopButtons = () => [...document.querySelectorAll('#avatar-shop button')];
const buttonNamed = name =>
  [...document.querySelectorAll('button')].find(b => b.textContent === name);
const dialogText = () => document.querySelector('[role="alertdialog"]')?.textContent ?? '';
const flush = () => new Promise(resolve => setTimeout(resolve, 0));

/** Le joueur courant, comme après « Qui joue ? » */
function play(profile) {
  UserManager._players = { Zoé: profile };
  UserManager._currentUser = 'Zoé';
  gameState.unlockedAvatars = [...profile.unlockedAvatars];
}

/** Touche un avatar de la boutique et attend sa fenêtre */
async function touch(avatarName) {
  shopButtons()
    .find(b => b.textContent.trim().startsWith(avatarName))
    .click();
  await flush();
}

let unlocked;
beforeEach(() => {
  setTranslations(FR);
  localStorage.clear();
  document.body.replaceChildren(
    ...new DOMParser().parseFromString(SHOP, 'text/html').body.childNodes
  );
  unlocked = jest.fn();
  eventBus.on('avatarUnlocked', unlocked);
});

afterEach(() => {
  eventBus.off('avatarUnlocked', unlocked);
  document.body.replaceChildren();
});

describe('Boutique des avatars', () => {
  test('un bouton par avatar verrouillé, nommé avec son prix, décrit par le solde', () => {
    play(zoe(62));
    renderAvatarShop(['panda', 'dragon'], headSrc);
    const shop = document.getElementById('avatar-shop');
    expect(shop.hidden).toBe(false);
    expect(document.getElementById('avatar-shop-intro').textContent).toBe(
      'À débloquer avec tes pièces : 50 pièces chacun. Tu as 62 pièces.'
    );
    // Nom accessible : le texte du bouton (image sans texte, cadenas masqué)
    expect(shopButtons().map(b => b.textContent.replace(/ +/g, ' ').trim())).toEqual([
      'Panda 50 pièces',
      'Dragon 50 pièces',
    ]);
    for (const button of shopButtons()) {
      expect(button.type).toBe('button');
      expect(button.getAttribute('aria-describedby')).toBe('avatar-shop-intro');
      expect(button.querySelector('img').getAttribute('alt')).toBe('');
    }
  });

  test('tout est débloqué : la boutique disparaît', () => {
    play(zoe(62));
    renderAvatarShop([], headSrc);
    expect(document.getElementById('avatar-shop').hidden).toBe(true);
    expect(shopButtons()).toHaveLength(0);
  });

  test('assez de pièces : « Débloquer » débloque, débite, enregistre et prévient', async () => {
    play(zoe(62));
    renderAvatarShop(['panda', 'dragon'], headSrc);
    await touch('Dragon');
    expect(dialogText()).toContain('Débloquer l’avatar Dragon pour 50 pièces ?');
    expect(dialogText()).toContain('Il te restera 12 pièces.');
    // Un achat ne détruit rien : « Débloquer » en bouton principal, « Pas maintenant » à côté
    expect(buttonNamed('Débloquer').className).toBe('btn');
    expect(buttonNamed('Pas maintenant').className).toBe('btn btn-secondary');
    buttonNamed('Débloquer').click();
    await flush();
    const saved = JSON.parse(localStorage.getItem('players')).Zoé;
    expect(saved.coins).toBe(12);
    expect(saved.unlockedAvatars).toEqual(['fox', 'dragon']);
    // « Enregistrer » réécrit le profil avec gameState : il connaît l'achat
    expect(gameState.unlockedAvatars).toEqual(['fox', 'dragon']);
    expect(document.querySelector('.coin-count').textContent).toBe('12');
    expect(unlocked).toHaveBeenCalledTimes(1);
    expect(unlocked.mock.calls[0][0].detail).toEqual({ avatar: 'dragon' });
  });

  test('« Pas maintenant » ne change rien', async () => {
    play(zoe(62));
    renderAvatarShop(['dragon'], headSrc);
    await touch('Dragon');
    buttonNamed('Pas maintenant').click();
    await flush();
    expect(UserManager.getCurrentUserData()).toMatchObject({ coins: 62, unlockedAvatars: ['fox'] });
    expect(localStorage.getItem('players')).toBeNull();
    expect(unlocked).not.toHaveBeenCalled();
  });

  test('pas assez de pièces : la fenêtre dit combien il en manque, rien ne change', async () => {
    play(zoe(37));
    renderAvatarShop(['dragon'], headSrc);
    await touch('Dragon');
    expect(dialogText()).toContain('Il te manque 13 pièces pour débloquer l’avatar Dragon.');
    expect(dialogText()).toContain('Chrono');
    expect(
      [...document.querySelectorAll('[role="alertdialog"] button')].map(b => b.textContent)
    ).toEqual(['D’accord']);
    buttonNamed('D’accord').click();
    await flush();
    expect(UserManager.getCurrentUserData()).toMatchObject({ coins: 37, unlockedAvatars: ['fox'] });
    expect(unlocked).not.toHaveBeenCalled();
  });

  test('changement de langue : le solde et les prix suivent', () => {
    play(zoe(1));
    renderAvatarShop(['dragon'], headSrc);
    setTranslations(EN);
    eventBus.emit('languageChanged', { lang: 'en' });
    expect(document.getElementById('avatar-shop-intro').textContent).toBe(
      'Unlock with your coins: 50 coins each. You have 1 coin.'
    );
    expect(document.querySelector('.avatar-price').textContent).toBe('50 coins');
  });
});
