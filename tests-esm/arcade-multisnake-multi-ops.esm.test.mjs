/**
 * Tests ESM - MultiSnake Multi-Opérations (R4.4)
 * Vérifie que MultiSnake supporte correctement +, −, ×, ÷
 */

import { describe, it, expect } from '@jest/globals';
import {
  computeCorrectAnswer,
  testTableExclusions,
  correctAnswerTestData,
  createConstraintValidationTests,
  victoryConditionTestData,
  createVictoryConditionTest,
} from './helpers/arcade-test-helpers.mjs';

describe('MultiSnake Multi-Opérations (R4.4) - Logique métier', () => {
  describe('Calcul de la réponse correcte par opération', () => {
    it.each(correctAnswerTestData)(
      'devrait calculer correctement $op avec $a et $b = $expected',
      ({ op, a, b, expected }) => {
        expect(computeCorrectAnswer(op, a, b)).toBe(expected);
      }
    );

    it('devrait utiliser multiplication par défaut si opérateur inconnu', () => {
      expect(computeCorrectAnswer('?', 3, 5)).toBe(15);
    });
  });

  describe('Validation des contraintes par opération', () => {
    const tests = createConstraintValidationTests();
    it('devrait valider multiplication (a × b)', tests.multiplication);
    it('devrait valider addition (a + b)', tests.addition);
    it('devrait valider soustraction (a − b, a ≥ b)', tests.subtraction);
    it('devrait valider division (a ÷ b, a % b = 0)', tests.division);
  });

  describe('Condition de victoire (manger la bonne réponse)', () => {
    it.each(victoryConditionTestData)(
      'devrait identifier la bonne bulle pour $op ($a $op $b = $answer)',
      createVictoryConditionTest('bulle')
    );
  });

  describe('Gestion des exclusions de tables', () => {
    const tableTests = testTableExclusions();
    it('ne devrait exclure des tables que pour multiplication', tableTests.onlyForMultiplication);
    it('ne devrait pas passer tables pour +/−/÷', tableTests.noTablesForOtherOps);
    it('devrait passer tables pour ×', tableTests.tablesForMultiplication);
  });
});
