/* eslint-env jest, node */
/**
 * Profils des joueurs : le vrai UserManager, sur le localStorage de test.
 */
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

const { UserManager } = await import('../js/userManager.js');
const { VideoManager } = await import('../js/VideoManager.js');
const { gameState } = await import('../js/game.js');

const storedPlayers = () => JSON.parse(localStorage.getItem('players'));

/** Une partie terminée, telle que gameState la transmet à saveCurrentUserData */
const partie = overrides => ({
  score: 0,
  wrongAnswers: {},
  progressHistory: [],
  avatar: 'panda',
  theme: 'forest',
  colorTheme: 'default',
  unlockedAvatars: ['panda'],
  volume: 1,
  ...overrides,
});

describe('UserManager : profils des joueurs', () => {
  beforeEach(() => {
    UserManager._players = {};
    UserManager._currentUser = null;
    jest.spyOn(VideoManager, 'playCharacterIntro').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    document.body.replaceChildren();
  });

  describe('création', () => {
    test.each([[''], ['   '], [null], [42]])('refuse le nom %p', name => {
      expect(UserManager.createUser(name)).toBe(false);
      expect(UserManager.getAllPlayers()).toEqual({});
      expect(localStorage.getItem('players')).toBeNull();
    });

    test('refuse un doublon, espaces compris, sans toucher au profil existant', () => {
      expect(UserManager.createUser('Zoé', 'panda')).toBe(true);
      expect(UserManager.createUser('Zoé', 'fox')).toBe(false);
      expect(UserManager.createUser('  Zoé  ', 'fox')).toBe(false);
      expect(Object.keys(storedPlayers())).toEqual(['Zoé']);
      expect(storedPlayers()['Zoé'].avatar).toBe('panda');
    });

    test('crée un profil complet et le sauvegarde', () => {
      UserManager.createUser('Zoé', 'panda');
      expect(storedPlayers()['Zoé']).toMatchObject({
        bestScore: 0,
        coins: 0,
        avatar: 'panda',
        nickname: 'Zoé',
        unlockedAvatars: ['panda'],
        unlockedBadges: [],
        parentalLockEnabled: false,
      });
    });
  });

  describe('sélection', () => {
    test('refuse un joueur inconnu sans changer de joueur courant', () => {
      expect(UserManager.selectUser('Personne')).toBeNull();
      expect(UserManager.getCurrentUser()).toBeNull();
    });

    test('sélectionne un joueur, applique son avatar et le signale', () => {
      UserManager.createUser('Zoé', 'panda');
      const changes = [];
      const onChange = event => changes.push(event.detail.user);
      document.addEventListener('userChanged', onChange);

      const data = UserManager.selectUser('Zoé');
      document.removeEventListener('userChanged', onChange);

      expect(data.avatar).toBe('panda');
      expect(UserManager.getCurrentUser()).toBe('Zoé');
      expect(gameState.avatar).toBe('panda');
      expect(changes).toEqual(['Zoé']);
    });
  });

  describe('données de partie', () => {
    test('sans joueur courant : données par défaut, rien n’est écrit', () => {
      expect(UserManager.getCurrentUserData()).toMatchObject({ bestScore: 0, coins: 0 });
      UserManager.saveCurrentUserData(partie({ score: 50 }));
      expect(localStorage.getItem('players')).toBeNull();
    });

    test('garde le meilleur score et survit à un rechargement', () => {
      UserManager.createUser('Zoé', 'panda');
      UserManager.selectUser('Zoé');
      UserManager.saveCurrentUserData(
        partie({ score: 80, wrongAnswers: { '3x4': 1 }, progressHistory: [{ score: 80 }] })
      );
      UserManager.saveCurrentUserData(partie({ score: 30, volume: 0.5 }));

      UserManager._players = UserManager.loadPlayers();
      const zoe = UserManager.getAllPlayers()['Zoé'];
      expect(zoe.bestScore).toBe(80);
      expect(zoe.wrongAnswers).toEqual({ '3x4': 1 });
      expect(zoe.progressHistory).toEqual([{ score: 80 }]);
      expect(zoe.volume).toBe(0.5);
    });

    test('deux joueurs gardent chacun leurs données', () => {
      UserManager.createUser('Zoé', 'panda');
      UserManager.createUser('Léo', 'fox');
      UserManager.selectUser('Zoé');
      UserManager.updateCurrentUserData({ coins: 12 });
      UserManager.selectUser('Léo');
      UserManager.updateCurrentUserData({ coins: 3 });

      UserManager._players = UserManager.loadPlayers();
      expect(UserManager.getAllPlayers()['Zoé'].coins).toBe(12);
      expect(UserManager.getAllPlayers()['Léo'].coins).toBe(3);
    });
  });

  describe('profil ancien ou incomplet', () => {
    test.each([
      [
        'champs manquants ou mal typés',
        {
          avatar: '',
          volume: '0.3',
          coins: 'beaucoup',
          tablePreferences: { globalExclusions: 'x' },
        },
      ],
      ['profil nul', null],
    ])('complète un profil aux %s', (_label, raw) => {
      UserManager._players = { Zoé: raw };
      UserManager._currentUser = 'Zoé';

      expect(UserManager.getCurrentUserData()).toMatchObject({
        avatar: 'fox',
        nickname: 'Zoé',
        theme: 'forest',
        colorTheme: 'default',
        volume: 1,
        coins: 0,
        bestScore: 0,
        wrongAnswers: {},
        progressHistory: [],
        unlockedAvatars: ['fox'],
        unlockedBadges: [],
        parentalLockEnabled: false,
        preferredOperator: '×',
        tablePreferences: { globalExclusions: [], globalEnabled: false },
      });
    });

    test('conserve les valeurs valides', () => {
      UserManager._players = {
        Zoé: { avatar: 'panda', volume: 0.4, coins: 7, bestScore: 90, parentalLockEnabled: true },
      };
      UserManager._currentUser = 'Zoé';

      expect(UserManager.getCurrentUserData()).toMatchObject({
        avatar: 'panda',
        volume: 0.4,
        coins: 7,
        bestScore: 90,
        parentalLockEnabled: true,
      });
    });
  });

  describe('suppression', () => {
    test('supprime le joueur courant, le déconnecte et le retire du stockage', () => {
      UserManager.createUser('Zoé', 'panda');
      UserManager.createUser('Léo', 'fox');
      UserManager.selectUser('Zoé');

      expect(UserManager.deleteUser('Zoé')).toBe(true);
      expect(UserManager.getCurrentUser()).toBeNull();
      expect(Object.keys(storedPlayers())).toEqual(['Léo']);
    });

    test('refuse un joueur inconnu', () => {
      expect(UserManager.deleteUser('Personne')).toBe(false);
    });
  });

  describe('stockage abîmé', () => {
    test("continue en mémoire quand le navigateur refuse d'écrire", () => {
      jest.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      expect(UserManager.createUser('Zoé', 'panda')).toBe(true);
      expect(UserManager.getAllPlayers()).toHaveProperty('Zoé');
    });
  });
});
