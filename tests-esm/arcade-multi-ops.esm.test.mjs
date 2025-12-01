/**
 * Tests ESM - Arcade Games Multi-Opérations (R4)
 * Tests paramétrés pour Space Invasion (R4.2), MultiMemory (R4.3), MultiSnake (R4.4)
 * Vérifie que les jeux arcade supportent correctement +, −, ×, ÷
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

// Configuration des jeux arcade avec leurs spécificités
const arcadeGames = [
  { name: 'Space Invasion', requirement: 'R4.2', element: 'alien' },
  { name: 'MultiSnake', requirement: 'R4.4', element: 'bulle' },
];

describe.each(arcadeGames)(
  '$name Multi-Opérations ($requirement) - Logique métier',
  ({ element }) => {
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

    describe(`Condition de victoire (${element})`, () => {
      it.each(victoryConditionTestData)(
        `devrait identifier le bon ${element} pour $op ($a $op $b = $answer)`,
        createVictoryConditionTest()
      );
    });

    describe('Gestion des exclusions de tables', () => {
      const tableTests = testTableExclusions();
      it('ne devrait exclure des tables que pour multiplication', tableTests.onlyForMultiplication);
      it('ne devrait pas passer tables pour +/−/÷', tableTests.noTablesForOtherOps);
      it('devrait passer tables pour ×', tableTests.tablesForMultiplication);
    });
  }
);

// Tests spécifiques à MultiMemory (structure de cartes unique)
describe('MultiMemory Multi-Opérations (R4.3) - Logique métier', () => {
  describe('Calcul de la réponse correcte par opération', () => {
    it.each(correctAnswerTestData)(
      'devrait calculer correctement $op avec $a et $b = $expected',
      ({ op, a, b, expected }) => {
        expect(computeCorrectAnswer(op, a, b)).toBe(expected);
      }
    );
  });

  describe('Validation des contraintes par opération', () => {
    const tests = createConstraintValidationTests();
    it('devrait valider multiplication (a × b)', tests.multiplication);
    it('devrait valider addition (a + b)', tests.addition);
    it('devrait valider soustraction (a − b, a ≥ b)', tests.subtraction);
    it('devrait valider division (a ÷ b, a % b = 0)', tests.division);
  });

  describe('Structure des cartes Memory', () => {
    it('devrait avoir une carte opération et une carte résultat pour chaque paire', () => {
      const pairs = [
        { operation: { num1: 3, num2: 5, operator: '×', result: 15 }, resultCard: { result: 15 } },
        { operation: { num1: 7, num2: 8, operator: '+', result: 15 }, resultCard: { result: 15 } },
      ];

      pairs.forEach(pair => {
        expect(pair.operation.result).toBe(pair.resultCard.result);
        expect(pair.operation.num1).toBeDefined();
        expect(pair.operation.num2).toBeDefined();
        expect(pair.operation.operator).toBeDefined();
      });
    });

    it('devrait formater correctement le contenu de la carte opération', () => {
      const cards = [
        { num1: 3, num2: 5, operator: '×' },
        { num1: 7, num2: 8, operator: '+' },
        { num1: 10, num2: 3, operator: '−' },
        { num1: 20, num2: 4, operator: '÷' },
      ];

      cards.forEach(card => {
        const content = `${card.num1} ${card.operator} ${card.num2}`;
        expect(content).toMatch(/^\d+ [×+−÷] \d+$/);
      });
    });
  });

  describe('Gestion des exclusions de tables', () => {
    const tableTests = testTableExclusions();
    it('ne devrait exclure des tables que pour multiplication', tableTests.onlyForMultiplication);
    it('ne devrait pas passer tables pour +/−/÷', tableTests.noTablesForOtherOps);
    it('devrait passer tables pour ×', tableTests.tablesForMultiplication);
  });
});
