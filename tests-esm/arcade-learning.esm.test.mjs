/* eslint-env jest, node */
/**
 * Ce que l'Arcade retient d'une partie : la réponse dans les statistiques du calcul, et en
 * multiplication dans la fenêtre « À revoir » de sa table (la table est le premier nombre,
 * comme dans le Quiz) ; les calculs ratés de la partie, une fois chacun, pour l'écran de fin ;
 * les tables à revoir du joueur, pour le tirage.
 */
import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import fs from 'node:fs';

const recordOperationResult = jest.fn();
jest.unstable_mockModule('../js/core/operation-stats.js', () => ({ recordOperationResult }));
let profile;
jest.unstable_mockModule('../js/core/userState.js', () => ({
  UserState: {
    getCurrentUserData: () => profile,
    updateUserData: data => Object.assign(profile, data) && true,
  },
}));

const { recordArcadeAnswer, arcadeWeakTables, weakTablesFor } = await import(
  '../js/arcade-learning.js'
);
const { openArcadeSession, closeArcadeSession, arcadeMisses } = await import(
  '../js/arcade-session.js'
);
const { emptyModeStats } = await import('../js/core/mode-stats.js');
const { generateQuestion } = await import('../js/questionGenerator.js');

beforeEach(() => {
  profile = { modeStats: emptyModeStats(), preferredOperator: '×' };
  recordOperationResult.mockClear();
  openArcadeSession('multisnake');
});

describe('recordArcadeAnswer', () => {
  test('la réponse compte dans les statistiques du calcul', () => {
    recordArcadeAnswer('×', 7, 5, false);
    expect(recordOperationResult).toHaveBeenCalledWith('×', 7, 5, false);
  });

  test('7 × 5 raté marque la table de 7 dans « À revoir », comme le Quiz', () => {
    recordArcadeAnswer('×', 7, 5, false);
    recordArcadeAnswer('×', 7, 3, true);
    expect(profile.modeStats.review).toEqual({ 7: '01' });
  });

  test('trois erreurs sur la table de 8 la font revenir plus souvent au tirage', () => {
    for (let i = 0; i < 3; i += 1) recordArcadeAnswer('×', 8, 4, false);
    expect(arcadeWeakTables()).toEqual([8]);
  });

  test('les tables à revoir ne comptent qu’en multiplication', () => {
    for (let i = 0; i < 3; i += 1) recordArcadeAnswer('×', 8, 4, false);
    expect(weakTablesFor('×')).toEqual([8]);
    expect(weakTablesFor('+')).toEqual([]);
  });
});

describe('calculs ratés de la partie', () => {
  test('chacun une seule fois, dans l’ordre, pour l’écran de fin', () => {
    recordArcadeAnswer('×', 7, 5, false);
    recordArcadeAnswer('×', 6, 8, false);
    recordArcadeAnswer('×', 7, 5, false);
    recordArcadeAnswer('×', 4, 4, true);
    closeArcadeSession();
    expect(arcadeMisses()).toEqual([
      { operator: '×', a: 7, b: 5 },
      { operator: '×', a: 6, b: 8 },
    ]);
  });

  test('une nouvelle partie repart sans calcul raté', () => {
    recordArcadeAnswer('×', 7, 5, false);
    openArcadeSession('multisnake');
    expect(arcadeMisses()).toEqual([]);
  });

  test('six au plus : l’écran de fin reste lisible', () => {
    for (let b = 1; b <= 9; b += 1) recordArcadeAnswer('×', 9, b, false);
    expect(arcadeMisses()).toHaveLength(6);
  });
});

describe('tirage avec les tables à revoir', () => {
  const draw = options =>
    Array.from(
      { length: 600 },
      () => generateQuestion({ type: 'classic', operator: '×', ...options }).a
    );

  test('une table à revoir sort plus souvent que les autres', () => {
    const tables = draw({ tables: [2, 3], weakTables: [3] });
    const threes = tables.filter(t => t === 3).length;
    expect(threes).toBeGreaterThan(tables.length - threes);
  });

  test('une table à revoir que le joueur a retirée ne sort jamais', () => {
    const tables = draw({ tables: [2, 3, 7], excludeTables: [7], weakTables: [7] });
    expect(tables).not.toContain(7);
  });
});

describe('les quatre jeux tirent avec les tables à revoir', () => {
  test.each([
    'js/arcade-invasion.js',
    'js/arcade-multimemory.js',
    'js/multimiam-questions.js',
    'js/multisnake.js',
  ])('%s passe les tables à revoir au tirage', file => {
    expect(fs.readFileSync(file, 'utf8')).toMatch(/weakTables: weakTablesFor\(/);
  });
});
