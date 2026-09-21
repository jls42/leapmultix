/* eslint-env jest, node */
/**
 * getWeakTables lit la table dans l'énoncé de chaque question rejouée.
 * Ce test fige les énoncés reconnus, pour que le motif de lecture puisse être
 * remplacé sans changer ce qui est compris.
 */
import { describe, test, expect, beforeEach, jest } from '@jest/globals';

const userStore = { progressHistory: [] };
jest.unstable_mockModule('../js/core/userState.js', () => ({
  UserState: {
    getCurrentUserData: () => userStore,
    updateUserData: u => Object.assign(userStore, u),
  },
}));

const { getWeakTables } = await import('../js/stats-utils.js');

/** Trois échecs sur une question suffisent à la faire remonter (seuil : 3 essais, 70 %) */
const troisEchecs = question => [
  { question, correct: false },
  { question, correct: false },
  { question, correct: false },
];

describe('getWeakTables : lecture de la table dans l’énoncé', () => {
  beforeEach(() => {
    userStore.progressHistory = [];
  });

  test.each([
    ['7 × 8 = ?', 7],
    ['10 × 10 = ?', 10],
    ['3×4', 3],
    ['1 x 1', 1],
    ['12 × 7 = 84', 12],
  ])('« %s » donne la table %i', (question, table) => {
    userStore.progressHistory = troisEchecs(question);
    expect(getWeakTables()).toEqual([table]);
  });

  test.each(['5 + 3 = ?', '56 ÷ 7 = ?', '9 − 4 = ?', 'abc', '', '× 4', '7 ×'])(
    '« %s » n’est pas une multiplication lisible',
    question => {
      userStore.progressHistory = troisEchecs(question);
      expect(getWeakTables()).toEqual([]);
    }
  );

  test('une table réussie à plus de 70 % ne remonte pas', () => {
    // 3 bonnes réponses sur 4 : 75 %, au-dessus du seuil
    userStore.progressHistory = [
      { question: '4 × 4 = ?', correct: true },
      { question: '4 × 5 = ?', correct: true },
      { question: '4 × 6 = ?', correct: true },
      { question: '4 × 7 = ?', correct: false },
    ];
    expect(getWeakTables()).toEqual([]);
  });

  test('une table réussie à moins de 70 % remonte', () => {
    // 2 bonnes réponses sur 3 : 66,7 %, sous le seuil
    userStore.progressHistory = [
      { question: '6 × 4 = ?', correct: true },
      { question: '6 × 5 = ?', correct: true },
      { question: '6 × 6 = ?', correct: false },
    ];
    expect(getWeakTables()).toEqual([6]);
  });

  test('moins de trois essais : pas assez pour conclure', () => {
    userStore.progressHistory = [
      { question: '8 × 4 = ?', correct: false },
      { question: '8 × 5 = ?', correct: false },
    ];
    expect(getWeakTables()).toEqual([]);
  });

  test('un historique sans énoncé ne fait pas échouer la lecture', () => {
    userStore.progressHistory = [{ correct: false }, { question: null, correct: false }];
    expect(getWeakTables()).toEqual([]);
  });

  test('une longue suite de chiffres sans signe se lit sans ralentissement', () => {
    userStore.progressHistory = troisEchecs('1'.repeat(20000));
    const debut = performance.now();
    expect(getWeakTables()).toEqual([]);
    expect(performance.now() - debut).toBeLessThan(200);
  });
});
