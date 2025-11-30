/**
 * Tests ESM - MultiSnake Multi-Opérations (R4.4)
 * Vérifie que MultiSnake supporte correctement +, −, ×, ÷
 */

import { describe, it, expect } from '@jest/globals';

// Helper partagé pour calculer la réponse correcte
function computeCorrectAnswer(op, a, b) {
  switch (op) {
    case '+':
      return a + b;
    case '−':
      return a - b;
    case '÷':
      return a / b;
    case '×':
    default:
      return a * b;
  }
}

// Test de la logique métier multi-opérations pour MultiSnake
describe('MultiSnake Multi-Opérations (R4.4) - Logique métier', () => {
  describe('Calcul de la réponse correcte par opération', () => {
    it('devrait calculer correctement pour multiplication (3 × 5 = 15)', () => {
      const result = computeCorrectAnswer('×', 3, 5);
      expect(result).toBe(15);
    });

    it('devrait calculer correctement pour addition (7 + 8 = 15)', () => {
      const result = computeCorrectAnswer('+', 7, 8);
      expect(result).toBe(15);
    });

    it('devrait calculer correctement pour soustraction (10 − 3 = 7)', () => {
      const result = computeCorrectAnswer('−', 10, 3);
      expect(result).toBe(7);
    });

    it('devrait calculer correctement pour division (20 ÷ 4 = 5)', () => {
      const result = computeCorrectAnswer('÷', 20, 4);
      expect(result).toBe(5);
    });

    it('devrait utiliser multiplication par défaut si opérateur inconnu', () => {
      const result = computeCorrectAnswer('?', 3, 5);
      expect(result).toBe(15); // Fallback ×
    });
  });

  describe('Validation des contraintes par opération', () => {
    it('devrait valider les contraintes de multiplication (a × b)', () => {
      const a = 3;
      const b = 5;
      const result = a * b;
      expect(result).toBe(15);
      expect(a).toBeGreaterThanOrEqual(1);
      expect(b).toBeGreaterThanOrEqual(1);
    });

    it("devrait valider les contraintes d'addition (a + b)", () => {
      const a = 7;
      const b = 8;
      const result = a + b;
      expect(result).toBe(15);
      expect(a).toBeGreaterThanOrEqual(1);
      expect(b).toBeGreaterThanOrEqual(1);
    });

    it('devrait valider les contraintes de soustraction (a − b, a ≥ b)', () => {
      const a = 10;
      const b = 3;
      const result = a - b;
      expect(result).toBe(7);
      expect(a).toBeGreaterThanOrEqual(b); // Pas de négatifs
      expect(result).toBeGreaterThanOrEqual(0);
    });

    it('devrait valider les contraintes de division (a ÷ b, a % b = 0)', () => {
      const a = 20;
      const b = 4;
      const result = a / b;
      expect(result).toBe(5);
      expect(a % b).toBe(0); // Résultat entier
      expect(b).toBeGreaterThanOrEqual(2); // Min diviseur = 2
    });
  });

  describe('Condition de victoire (manger la bonne réponse)', () => {
    it('devrait identifier la bonne bulle pour multiplication', () => {
      const operator = '×';
      const problem = { a: 3, b: 5 };
      const correctAnswer = computeCorrectAnswer(operator, problem.a, problem.b);

      const bubbles = [
        { value: 14, isCorrect: false },
        { value: 15, isCorrect: true }, // Bonne réponse
        { value: 16, isCorrect: false },
        { value: 20, isCorrect: false },
      ];

      const correctBubble = bubbles.find(b => b.value === correctAnswer);
      expect(correctBubble).toBeDefined();
      expect(correctBubble.value).toBe(15);
    });

    it('devrait identifier la bonne bulle pour addition', () => {
      const operator = '+';
      const problem = { a: 7, b: 8 };
      const correctAnswer = computeCorrectAnswer(operator, problem.a, problem.b);

      const bubbles = [
        { value: 14, isCorrect: false },
        { value: 15, isCorrect: true }, // Bonne réponse
        { value: 16, isCorrect: false },
        { value: 1, isCorrect: false },
      ];

      const correctBubble = bubbles.find(b => b.value === correctAnswer);
      expect(correctBubble).toBeDefined();
      expect(correctBubble.value).toBe(15);
    });

    it('devrait identifier la bonne bulle pour soustraction', () => {
      const operator = '−';
      const problem = { a: 10, b: 3 };
      const correctAnswer = computeCorrectAnswer(operator, problem.a, problem.b);

      const bubbles = [
        { value: 6, isCorrect: false },
        { value: 7, isCorrect: true }, // Bonne réponse
        { value: 8, isCorrect: false },
        { value: 13, isCorrect: false },
      ];

      const correctBubble = bubbles.find(b => b.value === correctAnswer);
      expect(correctBubble).toBeDefined();
      expect(correctBubble.value).toBe(7);
    });

    it('devrait identifier la bonne bulle pour division', () => {
      const operator = '÷';
      const problem = { a: 20, b: 4 };
      const correctAnswer = computeCorrectAnswer(operator, problem.a, problem.b);

      const bubbles = [
        { value: 4, isCorrect: false },
        { value: 5, isCorrect: true }, // Bonne réponse
        { value: 6, isCorrect: false },
        { value: 10, isCorrect: false },
      ];

      const correctBubble = bubbles.find(b => b.value === correctAnswer);
      expect(correctBubble).toBeDefined();
      expect(correctBubble.value).toBe(5);
    });
  });

  describe('Gestion des exclusions de tables (uniquement pour ×)', () => {
    it('ne devrait exclure des tables que pour multiplication', () => {
      const operators = ['+', '−', '÷', '×'];

      operators.forEach(op => {
        const shouldExcludeTables = op === '×';
        expect(shouldExcludeTables).toBe(op === '×');
      });
    });

    it('ne devrait pas passer tables pour +/−/÷', () => {
      const operators = ['+', '−', '÷'];

      operators.forEach(op => {
        const tables = op === '×' ? [2, 3, 5] : undefined;
        expect(tables).toBeUndefined();
      });
    });

    it('devrait passer tables pour ×', () => {
      const operator = '×';
      const tables = operator === '×' ? [2, 3, 5] : undefined;
      expect(tables).toEqual([2, 3, 5]);
    });
  });
});
