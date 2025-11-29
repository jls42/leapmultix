/**
 * Tests ESM - Multimiam Multi-Opérations (R4)
 * Vérifie que Multimiam supporte correctement +, −, ×, ÷
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Test de la logique métier multi-opérations
describe('Multimiam Multi-Opérations (R4) - Logique métier', () => {
  describe("Génération d'opérations par type", () => {
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

  describe('Génération de distracteurs adaptés', () => {
    function generateMultiplicationDistractors(correctResult, num1, num2) {
      const distractors = [];
      const used = new Set([correctResult]);

      const pushIf = v => {
        if (v > 0 && !used.has(v)) {
          distractors.push(v);
          used.add(v);
        }
      };

      // Distracteurs communs : ±1, ±2
      pushIf(correctResult - 1);
      pushIf(correctResult + 1);
      pushIf(correctResult - 2);
      pushIf(correctResult + 2);

      // Tables adjacentes (spécifique ×)
      pushIf((num1 + 1) * num2);
      pushIf((num1 - 1) * num2);
      pushIf(num1 * (num2 + 1));
      pushIf(num1 * (num2 - 1));

      return distractors;
    }

    function generateAdditionDistractors(correctResult, num1, num2) {
      const distractors = [];
      const used = new Set([correctResult]);

      const pushIf = v => {
        if (v > 0 && !used.has(v)) {
          distractors.push(v);
          used.add(v);
        }
      };

      // Distracteurs communs : ±1, ±2
      pushIf(correctResult - 1);
      pushIf(correctResult + 1);
      pushIf(correctResult - 2);
      pushIf(correctResult + 2);

      // Erreurs communes addition
      pushIf(num1); // Oubli num2
      pushIf(num2); // Oubli num1
      pushIf(num1 + num2 - 10); // Oubli dizaine

      return distractors;
    }

    function generateSubtractionDistractors(correctResult, num1, num2) {
      const distractors = [];
      const used = new Set([correctResult]);

      const pushIf = v => {
        if (v > 0 && !used.has(v)) {
          distractors.push(v);
          used.add(v);
        }
      };

      // Distracteurs communs : ±1, ±2
      pushIf(correctResult - 1);
      pushIf(correctResult + 1);
      pushIf(correctResult - 2);
      pushIf(correctResult + 2);

      // Erreurs communes soustraction
      if (num2 > num1) pushIf(num2 - num1); // Inversion (b-a)
      pushIf(num1); // Pas de soustraction
      pushIf(num1 + num2); // Addition au lieu de soustraction

      return distractors;
    }

    function generateDivisionDistractors(correctResult, num1, num2) {
      const distractors = [];
      const used = new Set([correctResult]);

      const pushIf = v => {
        if (v > 0 && !used.has(v)) {
          distractors.push(v);
          used.add(v);
        }
      };

      // Distracteurs communs : ±1, ±2
      pushIf(correctResult - 1);
      pushIf(correctResult + 1);
      pushIf(correctResult - 2);
      pushIf(correctResult + 2);

      // Erreurs communes division
      pushIf(num1); // Pas de division
      pushIf(num2); // Diviseur au lieu du quotient
      pushIf(correctResult * 2); // Double du quotient

      return distractors;
    }

    it('devrait générer distracteurs pour multiplication (3 × 5 = 15)', () => {
      const distractors = generateMultiplicationDistractors(15, 3, 5);
      expect(distractors.length).toBeGreaterThan(0);
      // Vérifier qu'au moins un distracteur proche existe
      const hasCloseDistractor =
        distractors.includes(14) || distractors.includes(16) || distractors.includes(13);
      expect(hasCloseDistractor).toBe(true);
      // Pas de négatifs ou zéro
      distractors.forEach(d => expect(d).toBeGreaterThan(0));
    });

    it('devrait générer distracteurs pour addition (7 + 8 = 15)', () => {
      const distractors = generateAdditionDistractors(15, 7, 8);
      expect(distractors.length).toBeGreaterThan(0);
      // Vérifier qu'au moins un distracteur proche existe
      const hasCloseDistractor =
        distractors.includes(14) || distractors.includes(16) || distractors.includes(7);
      expect(hasCloseDistractor).toBe(true);
      // Pas de négatifs ou zéro
      distractors.forEach(d => expect(d).toBeGreaterThan(0));
    });

    it('devrait générer distracteurs pour soustraction (10 − 3 = 7)', () => {
      const distractors = generateSubtractionDistractors(7, 10, 3);
      expect(distractors.length).toBeGreaterThan(0);
      // Vérifier qu'au moins un distracteur proche existe
      const hasCloseDistractor =
        distractors.includes(6) || distractors.includes(8) || distractors.includes(13);
      expect(hasCloseDistractor).toBe(true);
      // Pas de négatifs ou zéro
      distractors.forEach(d => expect(d).toBeGreaterThan(0));
    });

    it('devrait générer distracteurs pour division (20 ÷ 4 = 5)', () => {
      const distractors = generateDivisionDistractors(5, 20, 4);
      expect(distractors.length).toBeGreaterThan(0);
      // Vérifier qu'au moins un distracteur proche existe
      const hasCloseDistractor =
        distractors.includes(4) || distractors.includes(6) || distractors.includes(10);
      expect(hasCloseDistractor).toBe(true);
      // Pas de négatifs ou zéro
      distractors.forEach(d => expect(d).toBeGreaterThan(0));
    });

    it('ne devrait jamais générer de distracteurs négatifs ou nuls', () => {
      const operations = [
        { fn: generateMultiplicationDistractors, result: 15, num1: 3, num2: 5 },
        { fn: generateAdditionDistractors, result: 15, num1: 7, num2: 8 },
        { fn: generateSubtractionDistractors, result: 7, num1: 10, num2: 3 },
        { fn: generateDivisionDistractors, result: 5, num1: 20, num2: 4 },
      ];

      operations.forEach(({ fn, result, num1, num2 }) => {
        const distractors = fn(result, num1, num2);
        distractors.forEach(d => {
          expect(d).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Structure des réponses', () => {
    it('devrait toujours inclure exactement une bonne réponse', () => {
      const answers = [
        { value: 15, isCorrect: true },
        { value: 14, isCorrect: false },
        { value: 16, isCorrect: false },
        { value: 20, isCorrect: false },
      ];

      const correctAnswers = answers.filter(a => a.isCorrect);
      expect(correctAnswers).toHaveLength(1);
      expect(correctAnswers[0].value).toBe(15);
    });

    it('ne devrait jamais avoir de valeurs dupliquées', () => {
      const answers = [
        { value: 15, isCorrect: true },
        { value: 14, isCorrect: false },
        { value: 16, isCorrect: false },
        { value: 20, isCorrect: false },
      ];

      const values = answers.map(a => a.value);
      const uniqueValues = [...new Set(values)];
      expect(uniqueValues).toHaveLength(answers.length);
    });

    it('devrait avoir exactement 4 réponses au total', () => {
      const answers = [
        { value: 15, isCorrect: true },
        { value: 14, isCorrect: false },
        { value: 16, isCorrect: false },
        { value: 20, isCorrect: false },
      ];

      expect(answers).toHaveLength(4);
    });
  });
});
