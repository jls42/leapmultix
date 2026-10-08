/* eslint-env jest, node */
/**
 * Corbeille des joueurs : « Supprimer » range le profil, avec toutes ses données, dans la
 * corbeille de « Qui joue ? ». Il s'y restaure à l'identique pendant 30 jours, puis il est
 * effacé pour de bon au lancement suivant, ses anciens scores d'Arcade avec lui. Rien n'est
 * effacé avant.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { readFileSync } from 'node:fs';
import {
  answerDialog,
  closeOpenDialog,
  dialogLabels,
  dialogQuestion,
  dialogTitle,
} from './helpers/confirm-dialog-helpers.mjs';

const { UserManager } = await import('../js/userManager.js');
const { VideoManager } = await import('../js/VideoManager.js');
const { PlayerTools } = await import('../js/components/playerTools.js');
const { TRASH_DAYS } = await import('../js/core/players-trash.js');
const store = await import('../js/i18n-store.js');

const FR = JSON.parse(readFileSync(new URL('../assets/translations/fr.json', import.meta.url)));
const INDEX = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 9, 8, 12, 0, 0);

const stored = key => JSON.parse(localStorage.getItem(key));
const LEA = {
  avatar: 'unicorn',
  nickname: 'Léa B.',
  coins: 61,
  progressHistory: [{ question: '7 × 8 = ?', correct: false, timestamp: 1, mode: 'quiz' }],
  operationStats: { '7×8': { operator: '×', a: 7, b: 8, attempts: 2, errors: 1, lastAttempt: 1 } },
};
const LEA_ARCADE = ['arcadeScores_Léa B.', 'arcadeScores_multisnake_Léa B.', 'arcadeScores_Léa'];

function seedClass() {
  localStorage.setItem('players', JSON.stringify({ Léa: LEA, Tom: { nickname: 'Tom' } }));
  for (const key of LEA_ARCADE) localStorage.setItem(key, '[300]');
  localStorage.setItem('arcadeScores_Tom', '[100]');
  UserManager._players = UserManager.loadPlayers();
  UserManager._currentUser = null;
}

beforeEach(() => {
  localStorage.clear();
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(VideoManager, 'playCharacterIntro').mockImplementation(() => {});
});

afterEach(() => {
  closeOpenDialog();
  jest.restoreAllMocks();
  localStorage.clear();
  UserManager._players = {};
  UserManager._currentUser = null;
  document.body.replaceChildren();
});

describe('Supprimer range le profil dans la corbeille, sans rien effacer', () => {
  test('le profil quitte la liste avec toutes ses données ; ses scores d’Arcade restent', () => {
    seedClass();
    jest.spyOn(Date, 'now').mockReturnValue(NOW);
    expect(UserManager.deleteUser('Léa')).toBe(true);

    expect(Object.keys(stored('players'))).toEqual(['Tom']);
    expect(stored('playersTrash')).toEqual([{ name: 'Léa', deletedAt: NOW, data: LEA }]);
    for (const key of LEA_ARCADE) expect([key, localStorage.getItem(key)]).toEqual([key, '[300]']);
  });

  test('restaurer rend le profil à l’identique et vide sa place dans la corbeille', () => {
    seedClass();
    jest.spyOn(Date, 'now').mockReturnValue(NOW);
    UserManager.deleteUser('Léa');

    expect(UserManager.restoreFromTrash({ name: 'Léa', deletedAt: NOW })).toEqual({
      ok: true,
      name: 'Léa',
    });
    expect(stored('players')).toEqual({ Tom: { nickname: 'Tom' }, Léa: LEA });
    expect(stored('playersTrash')).toEqual([]);
  });

  test('un prénom repris entre-temps : la restauration est refusée, rien n’est écrasé', () => {
    seedClass();
    jest.spyOn(Date, 'now').mockReturnValue(NOW);
    UserManager.deleteUser('Léa');
    UserManager._players['Léa'] = { nickname: 'Léa', coins: 3 };
    UserManager.savePlayers();

    expect(UserManager.restoreFromTrash({ name: 'Léa', deletedAt: NOW })).toMatchObject({
      ok: false,
      problem: 'exists',
    });
    expect(stored('players')['Léa']).toEqual({ nickname: 'Léa', coins: 3 });
    expect(stored('playersTrash')).toHaveLength(1);
  });

  test('deux « Léa » supprimées tour à tour : chacune garde sa place et se restaure', () => {
    seedClass();
    const now = jest.spyOn(Date, 'now').mockReturnValue(NOW);
    UserManager.deleteUser('Léa');
    UserManager._players['Léa'] = { nickname: 'Léa', coins: 3 };
    now.mockReturnValue(NOW + 1000);
    UserManager.deleteUser('Léa');

    expect(stored('playersTrash').map(entry => entry.data.coins)).toEqual([61, 3]);
    UserManager.restoreFromTrash({ name: 'Léa', deletedAt: NOW });
    expect(stored('players')['Léa'].coins).toBe(61);
  });

  test('une corbeille illisible n’empêche pas de supprimer', () => {
    seedClass();
    localStorage.setItem('playersTrash', '{pas du json');
    expect(UserManager.deleteUser('Tom')).toBe(true);
    expect(stored('playersTrash').map(entry => entry.name)).toEqual(['Tom']);
  });

  test('si la corbeille ne peut pas être écrite, le profil n’est pas supprimé', () => {
    seedClass();
    const setItem = localStorage.setItem.bind(localStorage);
    jest.spyOn(localStorage, 'setItem').mockImplementation((key, value) => {
      if (key === 'playersTrash') throw new Error('QuotaExceededError');
      return setItem(key, value);
    });
    expect(UserManager.deleteUser('Léa')).toBe(false);
    expect(Object.keys(UserManager.getAllPlayers())).toContain('Léa');
    expect(Object.keys(stored('players'))).toContain('Léa');
  });
});

describe(`Au bout de ${TRASH_DAYS} jours, effacé pour de bon`, () => {
  test('la purge efface les entrées trop vieilles et leurs scores d’Arcade, pas les autres', () => {
    seedClass();
    const now = jest.spyOn(Date, 'now').mockReturnValue(NOW - 31 * DAY);
    UserManager.deleteUser('Léa');
    now.mockReturnValue(NOW - 29 * DAY);
    UserManager.deleteUser('Tom');

    expect(UserManager.purgeExpiredTrash(NOW)).toBe(1);
    expect(stored('playersTrash').map(entry => entry.name)).toEqual(['Tom']);
    for (const key of LEA_ARCADE) expect([key, localStorage.getItem(key)]).toEqual([key, null]);
    expect(localStorage.getItem('arcadeScores_Tom')).toBe('[100]');
  });

  test('les scores d’un homonyme, dans la liste ou dans la corbeille, sont gardés', () => {
    seedClass();
    const now = jest.spyOn(Date, 'now').mockReturnValue(NOW - 40 * DAY);
    UserManager.deleteUser('Léa');
    // « Léa Martin » porte le surnom « Léa B. » ; une autre « Léa » attend dans la corbeille
    UserManager._players['Léa Martin'] = { nickname: 'Léa B.' };
    UserManager._players['Léa'] = { nickname: 'Léa' };
    now.mockReturnValue(NOW - DAY);
    UserManager.deleteUser('Léa');

    UserManager.purgeExpiredTrash(NOW);
    for (const key of LEA_ARCADE) expect([key, localStorage.getItem(key)]).toEqual([key, '[300]']);
  });

  test('la purge tourne au lancement (UserManager.init)', () => {
    localStorage.setItem(
      'playersTrash',
      JSON.stringify([{ name: 'Léa', deletedAt: Date.now() - 31 * DAY, data: LEA }])
    );
    localStorage.setItem('arcadeScores_Léa B.', '[300]');
    UserManager.init();
    expect(stored('playersTrash')).toEqual([]);
    expect(localStorage.getItem('arcadeScores_Léa B.')).toBeNull();
  });
});

describe('« Qui joue ? » : la corbeille, en haut de la liste', () => {
  beforeAll(() => {
    store.setTranslations(FR);
    store.setCurrentLanguage('fr');
  });

  beforeEach(() => {
    const parsed = new DOMParser().parseFromString(INDEX, 'text/html');
    document.body.replaceChildren(parsed.getElementById('slide0'));
    seedClass();
    PlayerTools.init();
    UserManager.initCreateUserEvents();
    UserManager.refreshUserList();
  });

  const pressDelete = name =>
    [...document.querySelectorAll('#user-list .user-container')]
      .find(container => container.dataset.player === name)
      .querySelector('.delete-btn')
      .click();

  /** « Supprimer » sur la tuile, puis « Supprimer » dans la fenêtre du jeu */
  const deleteFromTile = async name => {
    pressDelete(name);
    await answerDialog(true);
  };

  test('la fenêtre dit que le profil va à la corbeille, pour 30 jours', () => {
    pressDelete('Léa');
    expect(dialogTitle()).toBe('Supprimer le profil «\u00a0Léa\u00a0»\u00a0?');
    expect(dialogQuestion()).toBe(
      'Il ira dans la corbeille\u00a0: tu pourras le restaurer pendant 30\u00a0jours.'
    );
    expect(dialogLabels()).toEqual(['Garder ce joueur', 'Supprimer']);
  });

  test('« Garder ce joueur » : rien ne change, le focus revient à « Supprimer »', async () => {
    pressDelete('Léa');
    await answerDialog(false);
    expect(Object.keys(stored('players'))).toEqual(['Léa', 'Tom']);
    expect(document.getElementById('player-trash-toggle').hidden).toBe(true);
    expect(document.activeElement.closest('.user-container').dataset.player).toBe('Léa');
    expect(document.activeElement.classList.contains('delete-btn')).toBe(true);
  });

  test('« Supprimer » : le focus va sur la première tuile restante', async () => {
    await deleteFromTile('Léa');
    expect(document.activeElement.closest('.user-container').dataset.player).toBe('Tom');
    expect(document.activeElement.classList.contains('user-tile')).toBe(true);
  });

  test('corbeille vide : pas de bouton ; un profil supprimé : « Corbeille (1) »', async () => {
    const toggle = document.getElementById('player-trash-toggle');
    expect(toggle.hidden).toBe(true);
    await deleteFromTile('Léa');
    expect(toggle.hidden).toBe(false);
    expect(toggle.textContent.trim()).toBe('Corbeille (1)');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.getElementById('user-tools-message').textContent).toBe(
      '« Léa » est dans la corbeille.'
    );
  });

  test('ouvrir la corbeille, restaurer : la tuile revient et reçoit le focus', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(NOW);
    await deleteFromTile('Léa');
    const toggle = document.getElementById('player-trash-toggle');
    toggle.click();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById('player-trash-panel').hidden).toBe(false);

    const entry = document.querySelector('#player-trash-list li');
    expect(entry.querySelector('.trash-entry-name').textContent).toBe('Léa');
    expect(entry.querySelector('.trash-entry-until').textContent).toBe('jusqu’au 7 novembre');
    const restore = entry.querySelector('button');
    expect(restore.getAttribute('aria-label')).toBe('Restaurer « Léa »');
    restore.click();

    expect(Object.keys(stored('players'))).toEqual(['Tom', 'Léa']);
    expect(document.activeElement.closest('.user-container').dataset.player).toBe('Léa');
    expect(toggle.hidden).toBe(true);
    expect(document.getElementById('user-tools-message').textContent).toBe(
      '« Léa » est de retour dans la liste.'
    );
  });

  test('un prénom de la corbeille ne se recrée pas : le message renvoie à la corbeille', async () => {
    await deleteFromTile('Léa');
    document.getElementById('new-user-name').value = 'Léa';
    document.getElementById('create-user-btn').click();
    const message = document.getElementById('new-user-message');
    expect(message.hidden).toBe(false);
    expect(message.textContent).toBe(
      '« Léa » est dans la corbeille, en haut de la liste : restaure ce joueur, ou choisis un autre prénom.'
    );
    expect(Object.keys(stored('players'))).toEqual(['Tom']);
  });

  test('restauration refusée (prénom repris) : le message le dit, l’entrée reste', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(NOW);
    await deleteFromTile('Léa');
    UserManager._players['Léa'] = { nickname: 'Léa' };
    UserManager.refreshUserList();
    document.getElementById('player-trash-toggle').click();
    document.querySelector('#player-trash-list li button').click();
    expect(document.getElementById('user-tools-message').textContent).toBe(
      '« Léa » est déjà dans la liste. Pour restaurer celui de la corbeille, supprime d’abord le joueur de la liste.'
    );
    expect(document.querySelectorAll('#player-trash-list li')).toHaveLength(1);
  });

  test('plus aucun joueur, mais une corbeille : la barre reste, sans « Nouveau joueur »', async () => {
    await deleteFromTile('Léa');
    await deleteFromTile('Tom');
    expect(document.getElementById('user-list-tools').hidden).toBe(false);
    expect(document.getElementById('new-player-shortcut').hidden).toBe(true);
    expect(document.getElementById('player-trash-toggle').textContent.trim()).toBe('Corbeille (2)');
  });
});
