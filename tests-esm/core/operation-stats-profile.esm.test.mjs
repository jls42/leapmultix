/* eslint-env jest, node */
/**
 * Statistiques par calcul rangées dans le profil (champ operationStats) : sur un poste
 * partagé, les erreurs d'un élève ne pèsent plus sur le tirage d'un autre. Chaque profil
 * d'avant ce champ part d'une copie de la clé commune à l'appareil, qui reste en place,
 * jamais réécrite, pour un retour à la version précédente.
 */
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { seedLegacyStorage } from '../helpers/legacy-profiles.mjs';

const { UserManager } = await import('../../js/userManager.js');
const { VideoManager } = await import('../../js/VideoManager.js');
const { recordOperationResult, getWeakOperations } = await import(
  '../../js/core/operation-stats.js'
);
const { generateQuestion } = await import('../../js/questionGenerator.js');
const { saveArcadeScore } = await import('../../js/arcade-scores.js');

const stored = () => JSON.parse(localStorage.getItem('players'));
const fact = (operator, a, b, attempts, errors) => ({
  operator,
  a,
  b,
  attempts,
  errors,
  lastAttempt: 1,
});
const DEVICE_STATS = { '7×8': fact('×', 7, 8, 9, 4), '7+4': fact('+', 7, 4, 3, 0) };

/**
 * Tirage d'un nombre fixé, 0,805 de la somme des poids : sur la table de 7, il tombe sur
 * 7 × 9 si les dix calculs pèsent autant, sur 7 × 8 si 7 × 8 pèse 1,5 (une erreur sur deux).
 */
function drawSevenTimes() {
  jest.spyOn(globalThis.crypto, 'getRandomValues').mockImplementation(array => {
    array[0] = Math.floor(0.805 * 2 ** 32);
    return array;
  });
  return generateQuestion({ operator: '×', type: 'classic', forceTable: 7 }).b;
}

beforeEach(() => {
  localStorage.clear();
  UserManager._players = {};
  UserManager._currentUser = null;
  jest.spyOn(VideoManager, 'playCharacterIntro').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
  localStorage.clear();
  UserManager._players = {};
  UserManager._currentUser = null;
});

describe('Une réponse est rangée dans le profil de celui qui joue', () => {
  test('Léa rate 7 × 8 : son profil le garde, ni Tom ni la clé de l’appareil ne bougent', () => {
    localStorage.setItem('operationStats', JSON.stringify(DEVICE_STATS));
    UserManager.createUser('Léa', 'panda');
    UserManager.createUser('Tom', 'fox');
    UserManager._currentUser = 'Léa';

    expect(recordOperationResult('×', 7, 8, false)).toBe(true);
    expect(recordOperationResult('×', 7, 8, true)).toBe(true);

    expect(stored()['Léa'].operationStats['7×8']).toMatchObject({
      operator: '×',
      a: 7,
      b: 8,
      attempts: 2,
      errors: 1,
    });
    expect(stored()['Tom'].operationStats).toEqual({});
    expect(JSON.parse(localStorage.getItem('operationStats'))).toEqual(DEVICE_STATS);
  });

  test('sans joueur choisi, rien n’est compté nulle part', () => {
    expect(recordOperationResult('×', 7, 8, false)).toBe(false);
    expect(localStorage.getItem('operationStats')).toBeNull();
    expect(localStorage.getItem('players')).toBeNull();
  });

  test('les calculs faibles lus sont ceux du joueur courant', () => {
    UserManager.createUser('Léa', 'panda');
    UserManager.createUser('Tom', 'fox');
    UserManager._currentUser = 'Léa';
    for (let i = 0; i < 4; i += 1) recordOperationResult('×', 6, 7, i % 2 === 0);
    expect(getWeakOperations('×').map(weak => weak.key)).toEqual(['6×7']);
    UserManager._currentUser = 'Tom';
    expect(getWeakOperations('×')).toEqual([]);
  });
});

describe('Les écritures du profil qui suivent ne perdent pas les réponses comptées', () => {
  test('partie d’Arcade : deux réponses, puis le score de fin ; tout est gardé', () => {
    UserManager.createUser('Léa', 'panda');
    UserManager._currentUser = 'Léa';
    recordOperationResult('×', 6, 7, false);
    recordOperationResult('×', 6, 7, true);
    saveArcadeScore(120, 'multimiam', '×');

    const lea = stored()['Léa'];
    expect(lea.operationStats['6×7']).toMatchObject({ attempts: 2, errors: 1 });
    expect(lea.modeStats.modes.multimiam['×']).toMatchObject({ games: 1, best: 120 });
  });
});

describe('Le tirage du Quiz pèse les calculs ratés du joueur courant, et les siens seuls', () => {
  test('7 × 8, raté une fois sur deux par Léa, sort plus souvent pour elle que pour Tom', () => {
    UserManager.createUser('Léa', 'panda');
    UserManager.createUser('Tom', 'fox');
    UserManager._players['Léa'].operationStats = { '7×8': fact('×', 7, 8, 10, 5) };

    UserManager._currentUser = 'Léa';
    expect(drawSevenTimes()).toBe(8);
    UserManager._currentUser = 'Tom';
    expect(drawSevenTimes()).toBe(9);
  });

  test('l’ancienne clé commune « multiplicationStats » ne pèse plus sur le tirage', () => {
    localStorage.setItem(
      'multiplicationStats',
      JSON.stringify({ '7x8': { attempts: 10, errors: 10 } })
    );
    UserManager.createUser('Tom', 'fox');
    UserManager._currentUser = 'Tom';
    expect(drawSevenTimes()).toBe(9);
  });

  test('une réponse fausse enregistrée en jeu alourdit aussitôt le calcul', () => {
    UserManager.createUser('Léa', 'panda');
    UserManager._currentUser = 'Léa';
    expect(drawSevenTimes()).toBe(9);
    recordOperationResult('×', 7, 8, false);
    recordOperationResult('×', 7, 8, true);
    expect(drawSevenTimes()).toBe(8);
  });
});

describe('Profils d’avant ce champ : chacun part de la clé commune, sans rien effacer', () => {
  beforeEach(() => {
    seedLegacyStorage(localStorage);
    UserManager._players = UserManager.loadPlayers();
  });

  test.each(['Zoé', 'Léa', 'Tom'])('%s reçoit la copie de operationStats', name => {
    UserManager._currentUser = name;
    const { operationStats } = UserManager.getCurrentUserData();
    // La clé commune à jour (9 essais), pas l'ancienne multiplicationStats (5)
    expect(operationStats['7×8']).toMatchObject({ attempts: 9, errors: 4 });
    expect(operationStats['7+4']).toMatchObject({ attempts: 3, errors: 0 });
  });

  test('ensuite, chacun diverge ; les deux clés communes restent intactes', () => {
    const deviceBefore = localStorage.getItem('operationStats');
    const legacyBefore = localStorage.getItem('multiplicationStats');
    UserManager._currentUser = 'Zoé';
    recordOperationResult('×', 7, 8, false);
    UserManager._currentUser = 'Léa';

    expect(UserManager.getCurrentUserData().operationStats['7×8'].attempts).toBe(9);
    expect(stored()['Zoé'].operationStats['7×8']).toMatchObject({ attempts: 10, errors: 5 });
    expect(localStorage.getItem('operationStats')).toBe(deviceBefore);
    expect(localStorage.getItem('multiplicationStats')).toBe(legacyBefore);
  });

  test('l’amorçage ne tourne qu’une fois : relu et rechargé, rien n’est compté en double', () => {
    UserManager._currentUser = 'Zoé';
    recordOperationResult('×', 7, 8, true);
    UserManager._players = UserManager.loadPlayers();
    expect(UserManager.getCurrentUserData().operationStats['7×8'].attempts).toBe(10);
  });

  test('un profil créé ensuite part vide, même avec la clé commune présente', () => {
    UserManager.createUser('Noé', 'fox');
    UserManager._currentUser = 'Noé';
    expect(UserManager.getCurrentUserData().operationStats).toEqual({});
  });
});

describe('Valeurs abîmées', () => {
  test('les entrées illisibles sont écartées de la copie, le profil se lit', () => {
    UserManager._players = {
      Zoé: {
        operationStats: {
          '3×4': fact('×', 3, 4, 2, 1),
          '7×8': 'texte',
          '6×7': fact('×', 6, 7, 2, 5),
          '2×2': fact('×', 3, 3, 1, 0),
          '5?5': fact('?', 5, 5, 1, 0),
        },
      },
    };
    UserManager._currentUser = 'Zoé';
    expect(UserManager.getCurrentUserData().operationStats).toEqual({
      '3×4': fact('×', 3, 4, 2, 1),
    });
  });

  test('une clé commune illisible donne une copie vide', () => {
    localStorage.setItem('operationStats', '[1,2,3]');
    UserManager._players = { Zoé: { nickname: 'Zoé' } };
    UserManager._currentUser = 'Zoé';
    expect(UserManager.getCurrentUserData().operationStats).toEqual({});
  });
});
