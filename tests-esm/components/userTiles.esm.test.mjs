/* eslint-env jest, node */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';

const { UserManager } = await import('../../js/userManager.js');
const { VideoManager } = await import('../../js/VideoManager.js');

const CREATION_MARKUP = `
  <div id="user-list" class="user-list"></div>
  <section class="new-player">
    <div class="new-player-name">
      <label for="new-user-name">Ton prénom</label>
      <input type="text" id="new-user-name" />
      <button type="button" id="show-virtual-keyboard" aria-expanded="false">Clavier</button>
    </div>
    <p id="new-user-message" class="new-player-message" role="alert" hidden></p>
    <div class="avatar-selector creation-avatar-selector" role="radiogroup">
      <button type="button" class="avatar-btn active" data-avatar="fox" role="radio" aria-checked="true"></button>
      <button type="button" class="avatar-btn" data-avatar="panda" role="radio" aria-checked="false"></button>
    </div>
    <button type="button" class="btn" id="create-user-btn">Créer</button>
  </section>
`;

describe('« Qui joue ? » : tuiles des profils (UserManager.refreshUserList)', () => {
  let originalConfirm;

  beforeEach(() => {
    document.body.innerHTML = CREATION_MARKUP;
    UserManager._players = {
      Lina: { avatar: 'panda', nickname: 'Lina' },
      Sam: { avatar: 'astronaute', nickname: 'Sam' },
      Eve: { avatar: '../../../etc/passwd', nickname: 'Eve' },
    };
    UserManager._currentUser = null;
    originalConfirm = globalThis.confirm;
  });

  afterEach(() => {
    globalThis.confirm = originalConfirm;
    document.body.innerHTML = '';
  });

  test('une grande tuile par joueur : visage de son avatar (image décorative) puis prénom', () => {
    UserManager.refreshUserList();

    const items = document.querySelectorAll('#user-list ul.user-tiles > li.user-container');
    expect(items).toHaveLength(3);

    const linaTile = items[0].querySelector('button.user-tile');
    expect(linaTile.type).toBe('button');
    const face = linaTile.querySelector('img.user-tile-face');
    expect(face.getAttribute('src')).toBe('assets/images/arcade/panda_head_avatar_128x128.png');
    expect(face.getAttribute('alt')).toBe('');
    expect(linaTile.querySelector('.user-tile-name').textContent).toBe('Lina');
  });

  test("l'avatar enregistré est filtré : alias français converti, valeur inconnue remplacée", () => {
    UserManager.refreshUserList();

    const [, sam, eve] = document.querySelectorAll('#user-list .user-tile-face');
    expect(sam.getAttribute('src')).toBe('assets/images/arcade/astronaut_head_avatar_128x128.png');
    expect(eve.getAttribute('src')).toBe('assets/images/arcade/fox_head_avatar_128x128.png');
  });

  test('« Supprimer » est un petit bouton séparé de la tuile, nommé avec le prénom', () => {
    UserManager.refreshUserList();

    const item = document.querySelector('#user-list li.user-container');
    const deleteBtn = item.querySelector('.delete-btn');
    expect(deleteBtn).not.toBeNull();
    expect(deleteBtn.closest('.user-tile')).toBeNull();
    expect(deleteBtn.classList.contains('btn-quiet')).toBe(true);
    expect(deleteBtn.classList.contains('btn-danger')).toBe(true);
    expect(deleteBtn.getAttribute('aria-label')).toBe('Supprimer le profil «\u00a0Lina\u00a0»');
    expect(deleteBtn.textContent).toBe('Supprimer');
  });

  test('la suppression passe toujours par la confirmation', () => {
    UserManager.refreshUserList();
    const confirmSpy = jest.fn(() => false);
    globalThis.confirm = confirmSpy;

    document.querySelector('#user-list .delete-btn').click();
    expect(confirmSpy).toHaveBeenCalledTimes(1);
    expect(Object.keys(UserManager._players)).toContain('Lina');

    confirmSpy.mockReturnValue(true);
    document.querySelector('#user-list .delete-btn').click();
    expect(Object.keys(UserManager._players)).not.toContain('Lina');
    expect(document.querySelectorAll('#user-list .user-tile')).toHaveLength(2);
    // Le focus revient sur une tuile restante
    expect(document.activeElement?.classList.contains('user-tile')).toBe(true);
  });

  test('sans joueur, la liste affiche un simple message', () => {
    UserManager._players = {};
    UserManager.refreshUserList();

    expect(document.querySelector('#user-list ul')).toBeNull();
    expect(document.querySelector('#user-list .user-list-empty')).not.toBeNull();
  });
});

describe('« Nouveau joueur » : messages sous le champ au lieu de alert()', () => {
  let originalAlert;
  let alertSpy;

  beforeEach(() => {
    document.body.innerHTML = CREATION_MARKUP;
    UserManager._players = { Lina: { avatar: 'panda', nickname: 'Lina' } };
    UserManager._currentUser = null;
    originalAlert = globalThis.alert;
    alertSpy = jest.fn();
    globalThis.alert = alertSpy;
    UserManager.initCreateUserEvents();
  });

  afterEach(() => {
    globalThis.alert = originalAlert;
    document.body.innerHTML = '';
  });

  test('prénom vide : message affiché, champ signalé, aucune alerte native', () => {
    document.getElementById('create-user-btn').click();

    const input = document.getElementById('new-user-name');
    const message = document.getElementById('new-user-message');
    expect(message.hidden).toBe(false);
    expect(message.textContent).toBe('Écris d’abord ton prénom.');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe('new-user-message');
    expect(alertSpy).not.toHaveBeenCalled();
  });

  test('prénom fait de caractères refusés : traité comme vide, aucun profil créé', () => {
    const input = document.getElementById('new-user-name');
    input.value = '😀😀';
    document.getElementById('create-user-btn').click();

    expect(document.getElementById('new-user-message').hidden).toBe(false);
    expect(Object.keys(UserManager._players)).toEqual(['Lina']);
  });

  test('prénom déjà pris (touche Entrée) : message qui renvoie vers sa tuile', () => {
    const input = document.getElementById('new-user-name');
    input.value = 'Lina';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    const message = document.getElementById('new-user-message');
    expect(message.hidden).toBe(false);
    expect(message.textContent).toContain('existe déjà');
    expect(alertSpy).not.toHaveBeenCalled();
  });

  test('corriger le prénom efface le message', () => {
    document.getElementById('create-user-btn').click();
    const input = document.getElementById('new-user-name');
    input.value = 'Zoé';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(document.getElementById('new-user-message').hidden).toBe(true);
    expect(input.hasAttribute('aria-invalid')).toBe(false);
  });

  test('Entrée dans le champ crée le joueur sans remonter à la navigation clavier globale', () => {
    // keyboard-navigation.js écoute keydown sur le document et cliquerait l'élément qui a
    // le focus (« Passer » dans la vidéo qui vient de s'ouvrir)
    const playIntro = jest.spyOn(VideoManager, 'playCharacterIntro').mockImplementation(() => {});
    const documentListener = jest.fn();
    document.addEventListener('keydown', documentListener);
    const input = document.getElementById('new-user-name');
    input.value = 'Zoé';
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    input.dispatchEvent(event);
    document.removeEventListener('keydown', documentListener);
    const introCalls = playIntro.mock.calls.length;
    playIntro.mockRestore();

    expect(event.defaultPrevented).toBe(true);
    expect(documentListener).not.toHaveBeenCalled();
    expect(introCalls).toBe(1);
    expect(Object.keys(UserManager._players)).toContain('Zoé');
  });

  test('les touches du clavier à l’écran effacent le message comme une frappe', () => {
    document.getElementById('create-user-btn').click();
    expect(document.getElementById('new-user-message').hidden).toBe(false);

    document.getElementById('show-virtual-keyboard').click();
    const keyZ = [
      ...document.querySelectorAll('#virtual-keyboard-new-user-name .keyboard-key'),
    ].find(key => key.textContent === 'Z');
    keyZ.click();

    const input = document.getElementById('new-user-name');
    expect(input.value).toBe('Z');
    expect(document.getElementById('new-user-message').hidden).toBe(true);
    expect(input.hasAttribute('aria-invalid')).toBe(false);
  });

  test('supprimer le joueur courant le signale (userChanged sans joueur)', () => {
    UserManager._currentUser = 'Lina';
    const listener = jest.fn();
    document.addEventListener('userChanged', listener);
    UserManager.deleteUser('Lina');
    document.removeEventListener('userChanged', listener);

    expect(UserManager.getCurrentUser()).toBeNull();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].detail.user).toBeNull();
  });

  test('le bouton « Clavier » expose son état avec aria-expanded', () => {
    const toggle = document.getElementById('show-virtual-keyboard');
    toggle.click();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(toggle.getAttribute('aria-controls')).toBe('virtual-keyboard-new-user-name');
    toggle.click();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });
});
