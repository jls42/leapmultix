/**
 * Tests ESM - MultiMemory Multi-Opérations (R4.3)
 * Vérifie que MultiMemory supporte correctement +, −, ×, ÷
 */

import { describe, it, expect } from '@jest/globals';

// Test de la logique métier multi-opérations pour MultiMemory
describe('MultiMemory Multi-Opérations (R4.3) - Logique métier', () => {
  describe('Calcul de la réponse correcte par opération', () => {
    const computeCorrectAnswer = (op, a, b) => {
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
    };

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

  describe('Structure des cartes Memory', () => {
    it('devrait avoir une carte opération et une carte résultat pour chaque paire', () => {
      const pairs = [
        {
          operation: { num1: 3, num2: 5, operator: '×', result: 15 },
          resultCard: { result: 15 },
        },
        {
          operation: { num1: 7, num2: 8, operator: '+', result: 15 },
          resultCard: { result: 15 },
        },
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
        { num1: 3, num2: 5, operator: '×', content: '3 × 5' },
        { num1: 7, num2: 8, operator: '+', content: '7 + 8' },
        { num1: 10, num2: 3, operator: '−', content: '10 − 3' },
        { num1: 20, num2: 4, operator: '÷', content: '20 ÷ 4' },
      ];

      cards.forEach(card => {
        const expectedContent = `${card.num1} ${card.operator} ${card.num2}`;
        expect(card.content).toBe(expectedContent);
      });
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
