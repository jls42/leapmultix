/**
 * @jest-environment jsdom
 *
 * Fenêtre de confirmation du jeu (à la place de window.confirm) : alertdialog modal, titre et
 * texte reliés, focus d'abord sur le bouton sans risque, Échap = annuler, Tab reste dans la
 * fenêtre, page inerte et sourde aux touches pendant la question, focus rendu à l'origine.
 */
import { afterEach, beforeEach, describe, expect, test, jest } from '@jest/globals';

const { confirmDialog } = await import('../../js/components/confirm-dialog.js');

const OPTIONS = {
  title: 'Tu veux vraiment abandonner le quiz ?',
  message: 'Les réponses que tu as déjà données restent comptées.',
  confirmLabel: 'Abandonner',
  cancelLabel: 'Continuer la partie',
};

let origin;
let page;
beforeEach(() => {
  page = document.createElement('main');
  origin = document.createElement('button');
  origin.textContent = 'Abandonner';
  page.appendChild(origin);
  document.body.replaceChildren(page);
  origin.focus();
});

afterEach(() => {
  // Un test qui échoue avant d'avoir répondu ne laisse pas sa question aux suivants
  document.querySelector('[role="alertdialog"] [data-answer="cancel"]')?.click();
  document.body.replaceChildren();
});

const dialog = () => document.querySelector('[role="alertdialog"]');
const button = answer => dialog().querySelector(`[data-answer="${answer}"]`);
const key = (k, extra = {}) =>
  document.activeElement.dispatchEvent(
    new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, ...extra })
  );

describe('fenêtre de confirmation du jeu', () => {
  test('alertdialog modal, titre et texte reliés, focus sur le bouton sans risque', () => {
    void confirmDialog(OPTIONS);
    const box = dialog();
    expect(box.getAttribute('aria-modal')).toBe('true');
    expect(document.getElementById(box.getAttribute('aria-labelledby')).textContent).toBe(
      OPTIONS.title
    );
    expect(document.getElementById(box.getAttribute('aria-describedby')).textContent).toBe(
      OPTIONS.message
    );
    expect(document.activeElement).toBe(button('cancel'));
    expect(button('cancel').textContent).toBe(OPTIONS.cancelLabel);
    expect(button('confirm').textContent).toBe(OPTIONS.confirmLabel);
    key('Escape');
  });

  test('confirmer rend true, la fenêtre part et le focus revient à l’origine', async () => {
    const answer = confirmDialog(OPTIONS);
    button('confirm').click();
    await expect(answer).resolves.toBe(true);
    expect(dialog()).toBeNull();
    expect(document.activeElement).toBe(origin);
  });

  test('« Continuer la partie » ou Échap : false', async () => {
    const first = confirmDialog(OPTIONS);
    button('cancel').click();
    await expect(first).resolves.toBe(false);
    const second = confirmDialog(OPTIONS);
    key('Escape');
    await expect(second).resolves.toBe(false);
    expect(dialog()).toBeNull();
    expect(document.activeElement).toBe(origin);
  });

  test('ouverte depuis le menu ☰ refermé entre-temps : le focus va au bouton ☰, pas à la page', async () => {
    // Au téléphone, un toucher dans la fenêtre referme le menu de la barre (toucher hors du
    // menu) : son bouton d'origine, caché, ne prend plus le focus
    const bar = document.createElement('div');
    bar.className = 'top-bar';
    const burger = document.createElement('button');
    burger.className = 'burger-menu-btn';
    const nav = document.createElement('div');
    nav.className = 'top-bar-nav';
    const home = document.createElement('button');
    nav.appendChild(home);
    bar.append(burger, nav);
    page.replaceChildren(bar);
    home.focus();
    const answer = confirmDialog(OPTIONS);
    home.checkVisibility = () => false;
    button('cancel').click();
    await expect(answer).resolves.toBe(false);
    expect(document.activeElement).toBe(burger);

    // Bouton d'origine toujours affiché : le focus y revient
    home.focus();
    const again = confirmDialog(OPTIONS);
    home.checkVisibility = () => true;
    key('Escape');
    await expect(again).resolves.toBe(false);
    expect(document.activeElement).toBe(home);
  });

  test('Tab et Maj+Tab restent dans la fenêtre', () => {
    void confirmDialog(OPTIONS);
    key('Tab');
    expect(document.activeElement).toBe(button('confirm'));
    key('Tab');
    expect(document.activeElement).toBe(button('cancel'));
    key('Tab', { shiftKey: true });
    expect(document.activeElement).toBe(button('confirm'));
    key('Escape');
  });

  test('pendant la question, la page est inerte et ne reçoit aucune touche', async () => {
    const pageKeys = jest.fn();
    document.addEventListener('keydown', pageKeys);
    const answer = confirmDialog(OPTIONS);
    expect(page.hasAttribute('inert')).toBe(true);
    key(' ');
    key('p');
    expect(pageKeys).not.toHaveBeenCalled();
    key('Escape');
    await answer;
    expect(page.hasAttribute('inert')).toBe(false);
    document.removeEventListener('keydown', pageKeys);
  });

  test('une seule question à la fois : la seconde demande reçoit la même réponse', async () => {
    const first = confirmDialog(OPTIONS);
    const second = confirmDialog({ ...OPTIONS, title: 'Autre question' });
    expect(document.querySelectorAll('[role="alertdialog"]')).toHaveLength(1);
    button('confirm').click();
    await expect(first).resolves.toBe(true);
    await expect(second).resolves.toBe(true);
  });

  test('par défaut (sortie de partie) : le refus en bouton principal, l’action en secondaire', () => {
    void confirmDialog(OPTIONS);
    expect(button('cancel').className).toBe('btn');
    expect(button('confirm').className).toBe('btn btn-secondary btn-danger');
  });

  test('emphasis « confirm » (un achat) : l’action en bouton principal, le refus garde le focus', () => {
    void confirmDialog({
      ...OPTIONS,
      confirmLabel: 'Débloquer',
      cancelLabel: 'Pas maintenant',
      emphasis: 'confirm',
    });
    expect(button('confirm').className).toBe('btn');
    expect(button('cancel').className).toBe('btn btn-secondary');
    expect([...dialog().querySelectorAll('button')].map(b => b.dataset.answer)).toEqual([
      'cancel',
      'confirm',
    ]);
    expect(document.activeElement).toBe(button('cancel'));
  });

  test('sans confirmLabel, un seul bouton : la fenêtre informe et rend false', async () => {
    const answer = confirmDialog({ title: 'Il te manque 3 pièces.', cancelLabel: 'D’accord' });
    expect(dialog().querySelectorAll('button')).toHaveLength(1);
    expect(dialog().hasAttribute('aria-describedby')).toBe(false);
    key('Tab');
    expect(document.activeElement).toBe(button('cancel'));
    button('cancel').click();
    await expect(answer).resolves.toBe(false);
  });

  describe('en plein écran', () => {
    let game;
    let fullscreen;
    beforeEach(() => {
      game = document.createElement('div');
      origin.before(game);
      game.appendChild(origin);
      fullscreen = game;
      Object.defineProperty(document, 'fullscreenElement', {
        configurable: true,
        get: () => fullscreen,
      });
      origin.focus();
    });
    afterEach(() => {
      delete document.fullscreenElement;
    });

    test('la fenêtre se pose dans l’élément affiché, toute la page autour est inerte', async () => {
      const topBar = document.createElement('nav');
      document.body.prepend(topBar);
      const answer = confirmDialog(OPTIONS);
      expect(game.contains(dialog())).toBe(true);
      expect(origin.closest('[inert]')).not.toBeNull();
      expect(topBar.hasAttribute('inert')).toBe(true);
      key('Escape');
      await answer;
      expect(document.querySelectorAll('[inert]')).toHaveLength(0);
      expect(document.activeElement).toBe(origin);
    });

    test('sortie du plein écran pendant la question : la fenêtre revient dans la page', async () => {
      const answer = confirmDialog(OPTIONS);
      key('Tab');
      fullscreen = null;
      document.dispatchEvent(new Event('fullscreenchange'));
      expect(dialog().closest('.confirm-dialog-layer').parentElement).toBe(document.body);
      expect(page.hasAttribute('inert')).toBe(true);
      expect(document.activeElement).toBe(button('confirm'));
      key('Escape');
      await expect(answer).resolves.toBe(false);
    });
  });
});
