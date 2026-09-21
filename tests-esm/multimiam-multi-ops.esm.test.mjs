/**
 * Tests ESM - Multimiam Multi-Opérations (R4)
 * Vérifie que Multimiam supporte correctement +, −, ×, ÷.
 */

import { describe, it, expect } from '@jest/globals';
import { Addition } from '../js/core/operations/Addition.js';
import { Division } from '../js/core/operations/Division.js';
import { Multiplication } from '../js/core/operations/Multiplication.js';
import { Subtraction } from '../js/core/operations/Subtraction.js';
import { PacmanQuestions } from '../js/multimiam-questions.js';

const operationCases = [
  ['multiplication', Multiplication, 3, 5, 15],
  ['addition', Addition, 7, 8, 15],
  ['soustraction', Subtraction, 10, 3, 7],
  ['division', Division, 20, 4, 5],
];

const answerCases = [
  ['×', 3, 5, 15, 20],
  ['+', 7, 8, 15, 7],
  ['−', 10, 3, 7, 13],
  ['÷', 20, 4, 5, 10],
];

describe('Multimiam Multi-Opérations (R4) - Logique métier', () => {
  describe("Génération d'opérations par type", () => {
    it.each(operationCases)(
      'calcule et valide une opération de %s',
      (_label, OperationClass, a, b, expected) => {
        const operation = new OperationClass();

        expect(operation.compute(a, b)).toBe(expected);
        expect(operation.isValid(a, b)).toBe(true);
      }
    );

    it('refuse une soustraction négative et une division non entière', () => {
      expect(new Subtraction().isValid(3, 10)).toBe(false);
      expect(new Division().isValid(7, 2)).toBe(false);
    });
  });

  describe('Génération de réponses', () => {
    it.each(answerCases)(
      'produit des réponses valides pour %s',
      (operator, num1, num2, correctResult, operationSpecificDistractor) => {
        const game = { operator, currentOperation: { num1, num2 } };
        const answers = PacmanQuestions.generateAnswers(game, correctResult);
        const correctAnswers = answers.filter(answer => answer.isCorrect);
        const values = answers.map(answer => answer.value);

        expect(correctAnswers).toEqual([{ value: correctResult, isCorrect: true }]);
        expect(new Set(values).size).toBe(values.length);
        expect(values.every(value => value > 0)).toBe(true);
        expect(answers.length).toBeGreaterThanOrEqual(4);
        expect(values).toContain(operationSpecificDistractor);
        expect(
          answers.some(answer => !answer.isCorrect && Math.abs(answer.value - correctResult) <= 2)
        ).toBe(true);
      }
    );
  });
});
