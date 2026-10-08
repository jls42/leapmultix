/* eslint-env jest, node */
/**
 * Profils déjà enregistrés, relus par cette version : chaque champ que lisait la v36 garde
 * exactement sa valeur (empreinte calculée avec le code publié, main 0fea8e5, sur les mêmes
 * profils anciens), et seuls des champs nouveaux s'ajoutent. C'est ce qui permet aussi un
 * retour arrière : la v36 recopie les champs qu'elle ne connaît pas sans y toucher.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { createHash } from 'node:crypto';
import { legacyPlayers, seedLegacyStorage } from './helpers/legacy-profiles.mjs';

const { UserManager } = await import('../js/userManager.js');
const { AdventureMode } = await import('../js/modes/AdventureMode.js');
const { appendProgressHistory, recordModeAnswer } = await import('../js/core/mode-stats.js');
const { getWeakTables } = await import('../js/stats-utils.js');

const sha = value => createHash('sha256').update(JSON.stringify(value)).digest('hex').slice(0, 16);

/**
 * Empreintes v36, champ par champ. Commande qui les a produites : dans une copie détachée de
 * 0fea8e5, UserManager.getCurrentUserData() sur legacyPlayers(), puis sha256 (16 premiers
 * caractères hexadécimaux) de JSON.stringify de chaque valeur.
 */
const V36_FIELDS = {
  Zoé: {
    bestScore: '5feceb66ffc86f38',
    wrongAnswers: '44136fa355b3678a',
    progressHistory: '3642a65f4ca15621',
    avatar: 'f354c6fb4efc659b',
    nickname: '3dd27406b9ab09c2',
    theme: '4d995a942a79d53a',
    colorTheme: '1080a60800d9e5bd',
    unlockedAvatars: '5bcc9c963781f53f',
    unlockedBadges: '466e31039fe6ff03',
    volume: '1e9d7c27c8bbc8dd',
    dailyChallengesCompleted: '4b227777d4dd1fc6',
    parentalLockEnabled: 'b5bea41b6c623f7c',
    starsByTable: 'bd98ee5cabb02f5e',
    coins: 'd6f0c71ef0c88e45',
    preferredOperator: '1d534bfdbf3b8a7c',
    adventureProgress: '0cd240b78182823a',
    quizStats: '326d128e90fb24c7',
    challengeStats: '28b5bc8b9ef45fe5',
    bestStreak: '4a44dc15364204a8',
    dailyChallenge: '39a31dd666d077c9',
    discoveryProgress: '88cc8bd42a8b8b7b',
    tablePreferences: '9b82fabd3e21568c',
    chronoStats: '03de5216fc824338',
  },
  Léa: {
    bestScore: '5feceb66ffc86f38',
    wrongAnswers: '44136fa355b3678a',
    progressHistory: 'c61df2e615f61e67',
    avatar: 'cf843b07ce20554c',
    nickname: '48083224bb7418b1',
    theme: '4d995a942a79d53a',
    colorTheme: '1080a60800d9e5bd',
    unlockedAvatars: '5bcc9c963781f53f',
    unlockedBadges: '3ff04dc00d65d461',
    volume: '6b86b273ff34fce1',
    dailyChallengesCompleted: '5feceb66ffc86f38',
    parentalLockEnabled: 'fcbcf165908dd18a',
    starsByTable: '700ef1b2ed9e746b',
    coins: 'd029fa3a95e174a1',
    preferredOperator: '7297d2085ea0adff',
    adventureProgressByOperator: '8ca3c5ec967c4495',
    quizStats: '914f93c6a1710d61',
    challengeStats: '8445f6ea69147212',
    bestStreak: '19581e27de7ced00',
    dailyChallenge: 'd2d9f6c42aaa17fa',
    discoveryProgress: '695ce26209b80458',
    tablePreferences: 'f48cd42731e2fa33',
    chronoStats: 'b507116021804664',
  },
  Tom: {
    bestScore: '5feceb66ffc86f38',
    wrongAnswers: '44136fa355b3678a',
    progressHistory: '4f53cda18c2baa0c',
    avatar: '3b1f689926de779b',
    nickname: '55923f805984eb75',
    theme: '4d995a942a79d53a',
    colorTheme: '1080a60800d9e5bd',
    unlockedAvatars: '5bcc9c963781f53f',
    unlockedBadges: '4f53cda18c2baa0c',
    volume: '6b86b273ff34fce1',
    dailyChallengesCompleted: '5feceb66ffc86f38',
    parentalLockEnabled: 'fcbcf165908dd18a',
    starsByTable: '44136fa355b3678a',
    coins: '5feceb66ffc86f38',
    preferredOperator: '1d534bfdbf3b8a7c',
    tablePreferences: '9b82fabd3e21568c',
    chronoStats: '40375e24573ea6bb',
  },
};

/** Champs ajoutés par cette version : aucun autre n'apparaît */
const NEW_FIELDS = new Set([
  'chronoStatsByOperator',
  'adventureProgressByOperator',
  'modeStats',
  // Statistiques par calcul du joueur (copie de la clé commune pour un profil d'avant)
  'operationStats',
]);

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
  UserManager._players = {};
  UserManager._currentUser = null;
});

function readProfile(name) {
  UserManager._players = legacyPlayers();
  UserManager._currentUser = name;
  return UserManager.getCurrentUserData();
}

describe('Profils anciens : relus comme en v36', () => {
  test.each(['Zoé', 'Léa', 'Tom'])('%s : chaque champ de la v36 est intact', name => {
    const data = readProfile(name);
    for (const [field, digest] of Object.entries(V36_FIELDS[name])) {
      expect([field, sha(data[field])]).toEqual([field, digest]);
    }
  });

  test.each(['Zoé', 'Léa', 'Tom'])('%s : seuls des champs nouveaux s’ajoutent', name => {
    const data = readProfile(name);
    const added = Object.keys(data).filter(field => !(field in V36_FIELDS[name]));
    for (const field of added) expect([field, NEW_FIELDS.has(field)]).toEqual([field, true]);
  });

  test('relire deux fois donne la même chose', () => {
    const first = JSON.stringify(readProfile('Zoé'));
    expect(JSON.stringify(UserManager.getCurrentUserData())).toBe(first);
  });
});

describe('Profils anciens : Chrono hors multiplication', () => {
  test('un profil d’avant la v37 reçoit trois réserves vides', () => {
    expect(readProfile('Zoé').chronoStatsByOperator).toEqual({
      '+': { buckets: [], basket: [] },
      '−': { buckets: [], basket: [] },
      '÷': { buckets: [], basket: [] },
    });
  });
});

describe('Profils anciens : Aventure d’avant les quatre opérations', () => {
  const oldLevels = {
    1: { completed: true, stars: 3, table: 1, lastPlayed: 1, attempts: 2 },
    2: { completed: true, stars: 2, table: 2, lastPlayed: 2, attempts: 1 },
  };

  test('l’ancien format est recopié dans la multiplication, sans être effacé', () => {
    const data = readProfile('Zoé');
    const legacy = legacyPlayers()['Zoé'].adventureProgress;
    expect(data.adventureProgressByOperator['×']).toEqual(legacy);
    expect(data.adventureProgress).toEqual(legacy);
    expect(Object.keys(data.adventureProgressByOperator)).toEqual(['×']);
  });

  test('un niveau × joué depuis ne masque plus les anciens : on garde le meilleur de chaque niveau', () => {
    const players = legacyPlayers();
    players['Zoé'].adventureProgress = oldLevels;
    players['Zoé'].adventureProgressByOperator = {
      '×': {
        1: { completed: true, stars: 1, table: 1, lastPlayed: 9, attempts: 1 },
        4: { completed: true, stars: 2, table: 10, lastPlayed: 10, attempts: 1 },
      },
      '+': { 1: { completed: true, stars: 2, difficulty: 'easy', lastPlayed: 11, attempts: 1 } },
    };
    UserManager._players = players;
    UserManager._currentUser = 'Zoé';
    const byOperator = UserManager.getCurrentUserData().adventureProgressByOperator;
    expect(byOperator['×'][1]).toMatchObject({ completed: true, stars: 3, attempts: 2 });
    expect(byOperator['×'][2]).toEqual(oldLevels[2]);
    expect(byOperator['×'][4]).toMatchObject({ stars: 2, table: 10 });
    expect(byOperator['+']).toEqual(players['Zoé'].adventureProgressByOperator['+']);
  });

  test('l’Aventure en addition ne reprend pas la progression de multiplication', () => {
    const players = legacyPlayers();
    players['Zoé'].preferredOperator = '+';
    UserManager._players = players;
    UserManager._currentUser = 'Zoé';
    document.body.innerHTML = '<div id="game"></div>';
    const adventure = new AdventureMode();
    expect(adventure.operator).toBe('+');
    adventure.loadAdventureProgress();
    expect(adventure.adventureLevels.filter(level => level.completed)).toHaveLength(0);
    expect(adventure.calculateTotalStars()).toBe(0);
  });

  test('l’Aventure en multiplication retrouve les niveaux de l’ancien format', () => {
    UserManager._players = legacyPlayers();
    UserManager._currentUser = 'Zoé';
    document.body.innerHTML = '<div id="game"></div>';
    const adventure = new AdventureMode();
    adventure.loadAdventureProgress();
    expect(adventure.adventureLevels.filter(level => level.completed).map(l => l.id)).toEqual([
      1, 2, 3, 4,
    ]);
    expect(adventure.calculateTotalStars()).toBe(9);
  });
});

describe('Profils anciens : compteurs du tableau de bord amorcés depuis l’existant', () => {
  beforeEach(() => {
    localStorage.clear();
    seedLegacyStorage(localStorage);
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('Zoé : réponses exactes par mode, parties et records anciens rangés en ×', () => {
    const { modeStats } = readProfile('Zoé');
    const history = legacyPlayers()['Zoé'].progressHistory;
    const count = mode => history.filter(entry => entry.mode === mode);
    expect(modeStats.v).toBe(1);
    for (const mode of ['quiz', 'challenge', 'adventure']) {
      expect(modeStats.modes[mode]['×']).toMatchObject({
        questions: count(mode).length,
        correct: count(mode).filter(entry => entry.correct).length,
      });
    }
    expect(modeStats.modes.challenge['×']).toMatchObject({
      games: 9,
      best: { easy: 120, medium: 160, hard: 210 },
    });
    expect(modeStats.modes.chrono['×']).toEqual({ games: 9, questions: 0, correct: 0 });
    // Arcade : le top 5 rangé sous son surnom, importé dans son profil, en × (elle n'a joué que ×)
    expect(modeStats.modes.invasion['×']).toEqual({ games: 5, total: 3800, best: 1500 });
    expect(modeStats.arcadeTop5.invasion).toEqual([1500, 1200, 800, 300, 0]);
    expect(Object.keys(modeStats.modes)).not.toContain('?');
  });

  test('Zoé : la fenêtre « À revoir » garde les 20 dernières réponses de chaque table ×', () => {
    const { modeStats } = readProfile('Zoé');
    for (const marks of Object.values(modeStats.review)) {
      expect(marks.length).toBeLessThanOrEqual(20);
    }
    const seven = legacyPlayers()['Zoé'].progressHistory.filter(entry =>
      /^7 × /.test(entry.question)
    );
    expect(modeStats.review['7']).toBe(
      seven
        .slice(-20)
        .map(entry => (entry.correct ? '1' : '0'))
        .join('')
    );
  });

  test('Léa : × et + mêlés, les parties et scores anciens restent « sans opération »', () => {
    const { modeStats } = readProfile('Léa');
    expect(modeStats.modes.quiz['×'].questions).toBe(20);
    expect(modeStats.modes.quiz['+'].questions).toBe(20);
    expect(modeStats.modes.challenge['?']).toMatchObject({ games: 2, best: { medium: 140 } });
    expect(modeStats.modes.challenge['×']).toMatchObject({ games: 0, questions: 14 });
    // Scores rangés sous son surnom actuel (« Léa B. »), pas sous l'ancien (« Léa »)
    expect(modeStats.modes.invasion['?']).toEqual({ games: 2, total: 300, best: 300 });
    expect(modeStats.modes.multisnake['?']).toEqual({ games: 1, total: 200, best: 200 });
  });

  test('Tom : rien joué, rien amorcé', () => {
    const { modeStats } = readProfile('Tom');
    expect(modeStats).toEqual({
      v: 1,
      modes: {},
      imported: { questions: 0, correct: 0 },
      arcadeTop5: {},
      review: {},
      countedUntil: 0,
    });
  });

  test('l’amorçage ne tourne qu’une fois : relu, il ne compte rien en double', () => {
    const first = readProfile('Zoé').modeStats;
    const players = legacyPlayers();
    players['Zoé'].modeStats = JSON.parse(JSON.stringify(first));
    UserManager._players = players;
    UserManager._currentUser = 'Zoé';
    expect(UserManager.getCurrentUserData().modeStats).toEqual(first);
  });
});

describe('Profils : robustesse et suite de vie des compteurs', () => {
  beforeEach(() => {
    localStorage.clear();
    seedLegacyStorage(localStorage);
  });

  afterEach(() => {
    localStorage.clear();
  });

  test.each([
    ['Découverte abîmée', { discoveryProgress: { exploredTables: 7 } }],
    ['classements Chrono abîmés', { chronoStats: { buckets: 'x', basket: 3 } }],
    ['Chrono hors × abîmé', { chronoStatsByOperator: { '+': { buckets: 7 }, '−': 'non' } }],
    ['Aventure abîmée', { adventureProgressByOperator: { '+': 5, '÷': [1] } }],
  ])('%s : le profil se lit, et ses compteurs sont quand même amorcés', (_label, damage) => {
    const players = legacyPlayers();
    Object.assign(players['Zoé'], damage);
    UserManager._players = players;
    UserManager._currentUser = 'Zoé';
    const { modeStats } = UserManager.getCurrentUserData();
    expect(modeStats.v).toBe(1);
    expect(modeStats.modes.quiz['×'].questions).toBe(310);
  });

  test.each([
    ['journal abîmé', { progressHistory: [null, 3, 'texte', { question: 42 }] }],
    ['compteurs abîmés', { modeStats: { v: 1, modes: 'n’importe quoi', review: 5 } }],
  ])('%s : le profil se lit', (_label, damage) => {
    const players = legacyPlayers();
    Object.assign(players['Zoé'], damage);
    UserManager._players = players;
    UserManager._currentUser = 'Zoé';
    expect(() => UserManager.getCurrentUserData()).not.toThrow();
    expect(UserManager.getCurrentUserData().modeStats.modes).toBeDefined();
  });

  test('amorçage, réponse, journal coupé à 100, rechargement : rien n’est perdu ni doublé', () => {
    UserManager._players = UserManager.loadPlayers();
    UserManager._currentUser = 'Zoé';
    // Une réponse de Quiz, écrite comme le fait le jeu (compteurs, puis journal)
    const data = UserManager.getCurrentUserData();
    recordModeAnswer(data, { mode: 'quiz', operator: '×', table: 6, isCorrect: true });
    UserManager.updateCurrentUserData(data);
    const next = UserManager.getCurrentUserData();
    appendProgressHistory(next, {
      question: '6 × 4 = ?',
      correct: true,
      timestamp: Date.now(),
      mode: 'quiz',
      operator: '×',
    });
    UserManager.updateCurrentUserData(next);
    expect(UserManager.getCurrentUserData().modeStats.modes.quiz['×'].questions).toBe(311);
    // Rechargement de la page : le profil est relu depuis le stockage
    UserManager._players = UserManager.loadPlayers();
    const reloaded = UserManager.getCurrentUserData();
    expect(reloaded.progressHistory).toHaveLength(100);
    expect(reloaded.modeStats.modes.quiz['×'].questions).toBe(311);
  });

  test('retour arrière : les réponses écrites entre-temps par la v36 sont rattrapées', () => {
    UserManager._players = UserManager.loadPlayers();
    UserManager._currentUser = 'Zoé';
    UserManager.updateCurrentUserData(UserManager.getCurrentUserData());
    // La v36 ajoute trois réponses au journal, sans toucher aux compteurs qu'elle ignore
    const stored = JSON.parse(localStorage.getItem('players'));
    const later = Date.now() + 1000;
    stored['Zoé'].progressHistory.push(
      { question: '8 × 7 = ?', correct: false, timestamp: later, mode: 'quiz', operator: '×' },
      { question: '8 × 3 = ?', correct: true, timestamp: later + 1, mode: 'quiz', operator: '×' },
      {
        question: '2 + 5 = ?',
        correct: true,
        timestamp: later + 2,
        mode: 'challenge',
        operator: '+',
      }
    );
    localStorage.setItem('players', JSON.stringify(stored));
    UserManager._players = UserManager.loadPlayers();
    const { modeStats } = UserManager.getCurrentUserData();
    expect(modeStats.modes.quiz['×']).toMatchObject({ questions: 312, correct: 243 });
    expect(modeStats.modes.challenge['+']).toMatchObject({ questions: 1, correct: 1 });
    expect(modeStats.review['8'].endsWith('01')).toBe(true);
    // Relu encore une fois : rien n'est compté deux fois
    expect(UserManager.getCurrentUserData().modeStats.modes.quiz['×'].questions).toBe(312);
  });

  test('le tirage du Quiz suit la même fenêtre « À revoir » que le tableau de bord', () => {
    UserManager._players = legacyPlayers();
    UserManager._currentUser = 'Zoé';
    // Zoé a rattrapé la table de 7 en 2026 ; la table de 8 et la table de 10 restent fragiles
    expect(getWeakTables()).toEqual([8, 10]);
  });
});
