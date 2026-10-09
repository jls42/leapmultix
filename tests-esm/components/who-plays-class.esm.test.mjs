/* eslint-env jest, node */
/**
 * « Qui joue ? » sur un poste de classe (28 profils) : tuiles triées par prénom dans la langue
 * du jeu, filtre dès 10 joueurs, et « Nouveau joueur » en haut de la liste. Monté sur le vrai
 * écran d'index.html, sans innerHTML.
 */
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { readFileSync } from 'node:fs';

const { UserManager } = await import('../../js/userManager.js');
const { PlayerTools } = await import('../../js/components/playerTools.js');
const store = await import('../../js/i18n-store.js');

const FR = JSON.parse(
  readFileSync(new URL('../../assets/translations/fr.json', import.meta.url), 'utf8')
);
const INDEX = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');

const CLASS = [
  'Zoé',
  'Léa',
  'Tom',
  'Adam',
  'Inès',
  'Lucas',
  'Chloé',
  'Maël',
  'Jade',
  'Noah',
  'Maëlys',
  'Théo',
  'Aïcha',
  'Gabriel',
  'Lina',
  'Raphaël',
  'Anaïs',
  'Louis',
  'Éloïse',
  'Sacha',
  'Mila',
  'Yanis',
  'Hélène',
  'Nathan',
  'Rose',
  'Ethan',
  'Camille',
  'Jean-Luc',
];
const SORTED = [
  'Adam',
  'Aïcha',
  'Anaïs',
  'Camille',
  'Chloé',
  'Éloïse',
  'Ethan',
  'Gabriel',
  'Hélène',
  'Inès',
  'Jade',
  'Jean-Luc',
  'Léa',
  'Lina',
  'Louis',
  'Lucas',
  'Maël',
  'Maëlys',
  'Mila',
  'Nathan',
  'Noah',
  'Raphaël',
  'Rose',
  'Sacha',
  'Théo',
  'Tom',
  'Yanis',
  'Zoé',
];

/** Le vrai écran « Qui joue ? » d'index.html */
function mountWhoPlays() {
  const parsed = new DOMParser().parseFromString(INDEX, 'text/html');
  document.body.replaceChildren(parsed.getElementById('slide0'));
}

function useClass(names) {
  UserManager._players = Object.fromEntries(names.map(name => [name, { nickname: name }]));
  UserManager.refreshUserList();
}

const tileNames = () =>
  [...document.querySelectorAll('#user-list .user-container')].map(item =>
    item.querySelector('.user-tile-name').textContent.trim()
  );
const visibleNames = () =>
  [...document.querySelectorAll('#user-list .user-container:not([hidden])')].map(item =>
    item.querySelector('.user-tile-name').textContent.trim()
  );

function typeFilter(text) {
  const input = document.getElementById('user-filter-input');
  input.value = text;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

beforeEach(() => {
  store.setTranslations(FR);
  store.setCurrentLanguage('fr');
  mountWhoPlays();
  UserManager._currentUser = null;
  PlayerTools.init();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
  UserManager._players = {};
  UserManager._currentUser = null;
  document.body.replaceChildren();
  localStorage.clear();
});

describe('Tuiles triées par prénom', () => {
  test('28 profils créés dans le désordre : ordre alphabétique français', () => {
    useClass(CLASS);
    expect(tileNames()).toEqual(SORTED);
  });

  test('un prénom de chiffres passe devant, Ł après L', () => {
    useClass(['Zoé', '7', 'Łukasz', 'Adam', 'Lucas']);
    expect(tileNames()).toEqual(['7', 'Adam', 'Lucas', 'Łukasz', 'Zoé']);
  });

  test('l’ordre suit la langue du jeu : Iñaki avant Inma en français, après en espagnol', () => {
    useClass(['Inma', 'Iñaki']);
    expect(tileNames()).toEqual(['Iñaki', 'Inma']);
    store.setCurrentLanguage('es');
    UserManager.refreshUserList();
    expect(tileNames()).toEqual(['Inma', 'Iñaki']);
  });
});

describe('Filtre des prénoms, dès 10 joueurs', () => {
  test('9 joueurs : pas de filtre ; 10 : le filtre apparaît, avec son étiquette', () => {
    useClass(SORTED.slice(0, 9));
    expect(document.getElementById('user-filter').hidden).toBe(true);
    useClass(SORTED.slice(0, 10));
    expect(document.getElementById('user-filter').hidden).toBe(false);
    const label = document.querySelector('label[for="user-filter-input"]');
    expect(label.textContent.trim()).toBe('Cherche ton prénom');
  });

  test.each([
    ['lé', ['Léa']],
    ['lea', ['Léa']],
    ['ELOISE', ['Éloïse']],
    ['ma', ['Maël', 'Maëlys']],
    ['luc', ['Jean-Luc', 'Lucas']],
    ['  l  ', ['Jean-Luc', 'Léa', 'Lina', 'Louis', 'Lucas']],
  ])('« %s » garde %p', (query, expected) => {
    useClass(CLASS);
    typeFilter(query);
    expect(visibleNames()).toEqual(expected);
    expect(document.getElementById('user-filter-empty').hidden).toBe(true);
  });

  test('aucun prénom trouvé : un message le dit ; effacer le filtre rend les 28', () => {
    useClass(CLASS);
    typeFilter('xyz');
    expect(visibleNames()).toEqual([]);
    const empty = document.getElementById('user-filter-empty');
    expect(empty.hidden).toBe(false);
    expect(empty.textContent).toBe('Aucun prénom ne commence par « xyz ».');
    typeFilter('');
    expect(visibleNames()).toEqual(SORTED);
    expect(empty.hidden).toBe(true);
  });

  test('le filtre tient quand la liste est redessinée (langue, suppression)', () => {
    useClass(CLASS);
    typeFilter('ma');
    UserManager.refreshUserList();
    expect(visibleNames()).toEqual(['Maël', 'Maëlys']);
  });

  test('sous 10 joueurs, le filtre disparaît et ne cache plus rien', () => {
    useClass(SORTED.slice(0, 10));
    typeFilter('zzz');
    useClass(SORTED.slice(0, 9));
    expect(document.getElementById('user-filter-input').value).toBe('');
    expect(visibleNames()).toEqual(SORTED.slice(0, 9));
  });

  test('Entrée dans le filtre mène à la première tuile trouvée, sans la choisir', () => {
    useClass(CLASS);
    typeFilter('lu');
    const documentListener = jest.fn();
    document.addEventListener('keydown', documentListener);
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    document.getElementById('user-filter-input').dispatchEvent(event);
    document.removeEventListener('keydown', documentListener);
    expect(event.defaultPrevented).toBe(true);
    // La navigation clavier globale ne voit pas cette touche : elle cliquerait la tuile
    expect(documentListener).not.toHaveBeenCalled();
    expect(document.activeElement.querySelector('.user-tile-name').textContent).toBe('Jean-Luc');
    expect(UserManager.getCurrentUser()).toBeNull();
  });
});

describe('« Nouveau joueur » en haut de la liste', () => {
  test('aucun joueur : la barre reste cachée, le formulaire est déjà là', () => {
    useClass([]);
    expect(document.getElementById('user-list-tools').hidden).toBe(true);
  });

  test('avec des joueurs, le raccourci précède les tuiles et mène au champ « Ton prénom »', () => {
    useClass(CLASS);
    const shortcut = document.getElementById('new-player-shortcut');
    expect(document.getElementById('user-list-tools').hidden).toBe(false);
    expect(shortcut.textContent.trim()).toBe('Nouveau joueur');
    const tiles = document.getElementById('user-list');
    expect(shortcut.compareDocumentPosition(tiles) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    shortcut.click();
    expect(document.activeElement.id).toBe('new-user-name');
  });
});
