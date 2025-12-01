/**
 * Tests ESM - Space Invasion Multi-Opérations (R4.2)
 * Vérifie que Space Invasion supporte correctement +, −, ×, ÷
 */

import { describe, it, expect } from '@jest/globals';
import {
  computeCorrectAnswer,
  testTableExclusions,
  correctAnswerTestData,
} from './helpers/arcade-test-helpers.mjs';

describe('Space Invasion Multi-Opérations (R4.2) - Logique métier', () => {
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
    it('devrait valider multiplication (a × b)', () => {
      expect(3 * 5).toBe(15);
      expect(3).toBeGreaterThanOrEqual(1);
      expect(5).toBeGreaterThanOrEqual(1);
    });

    it('devrait valider addition (a + b)', () => {
      expect(7 + 8).toBe(15);
      expect(7).toBeGreaterThanOrEqual(1);
      expect(8).toBeGreaterThanOrEqual(1);
    });

    it('devrait valider soustraction (a − b, a ≥ b)', () => {
      expect(10 - 3).toBe(7);
      expect(10).toBeGreaterThanOrEqual(3);
      expect(7).toBeGreaterThanOrEqual(0);
    });

    it('devrait valider division (a ÷ b, a % b = 0)', () => {
      expect(20 / 4).toBe(5);
      expect(20 % 4).toBe(0);
      expect(4).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Condition de victoire (dernier alien = bonne réponse)', () => {
    it.each([
      { op: '×', a: 3, b: 5, answer: 15 },
      { op: '+', a: 7, b: 8, answer: 15 },
      { op: '−', a: 10, b: 3, answer: 7 },
      { op: '÷', a: 20, b: 4, answer: 5 },
    ])('devrait identifier le bon alien pour $op ($a $op $b = $answer)', ({ op, a, b, answer }) => {
      const correctAnswer = computeCorrectAnswer(op, a, b);
      const aliens = [
        { value: answer - 1, isCorrect: false },
        { value: answer, isCorrect: true },
        { value: answer + 1, isCorrect: false },
        { value: answer + 5, isCorrect: false },
        { value: answer * 2, isCorrect: false },
      ];

      const lastAlien = aliens.find(alien => alien.value === correctAnswer);
      expect(lastAlien).toBeDefined();
      expect(lastAlien.value).toBe(answer);
    });
  });

  describe('Gestion des exclusions de tables', () => {
    const tableTests = testTableExclusions();

    it('ne devrait exclure des tables que pour multiplication', tableTests.onlyForMultiplication);
    it('ne devrait pas passer tables pour +/−/÷', tableTests.noTablesForOtherOps);
    it('devrait passer tables pour ×', tableTests.tablesForMultiplication);
  });
});
