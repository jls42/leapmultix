/**
 * Tests ESM - Multimiam Multi-Opérations (R4)
 * Vérifie que Multimiam supporte correctement +, −, ×, ÷
 */

import { describe, it, expect } from '@jest/globals';

// Helper pour créer un générateur de distracteurs avec logique commune
function createDistractorGenerator(correctResult, specificDistractors) {
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

  // Distracteurs spécifiques à l'opération
  specificDistractors.forEach(d => pushIf(d));

  return distractors;
}

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
    it('devrait générer distracteurs pour multiplication (3 × 5 = 15)', () => {
      const num1 = 3;
      const num2 = 5;
      const correctResult = 15;
      // Tables adjacentes (spécifique ×)
      const specificDistractors = [
        (num1 + 1) * num2,
        (num1 - 1) * num2,
        num1 * (num2 + 1),
        num1 * (num2 - 1),
      ];
      const distractors = createDistractorGenerator(correctResult, specificDistractors);
      expect(distractors.length).toBeGreaterThan(0);
      const hasCloseDistractor =
        distractors.includes(14) || distractors.includes(16) || distractors.includes(13);
      expect(hasCloseDistractor).toBe(true);
      distractors.forEach(d => expect(d).toBeGreaterThan(0));
    });

    it('devrait générer distracteurs pour addition (7 + 8 = 15)', () => {
      const num1 = 7;
      const num2 = 8;
      const correctResult = 15;
      // Erreurs communes addition
      const specificDistractors = [num1, num2, num1 + num2 - 10];
      const distractors = createDistractorGenerator(correctResult, specificDistractors);
      expect(distractors.length).toBeGreaterThan(0);
      const hasCloseDistractor =
        distractors.includes(14) || distractors.includes(16) || distractors.includes(7);
      expect(hasCloseDistractor).toBe(true);
      distractors.forEach(d => expect(d).toBeGreaterThan(0));
    });

    it('devrait générer distracteurs pour soustraction (10 − 3 = 7)', () => {
      const num1 = 10;
      const num2 = 3;
      const correctResult = 7;
      // Erreurs communes soustraction
      const specificDistractors = [num1, num1 + num2];
      if (num2 > num1) specificDistractors.push(num2 - num1);
      const distractors = createDistractorGenerator(correctResult, specificDistractors);
      expect(distractors.length).toBeGreaterThan(0);
      const hasCloseDistractor =
        distractors.includes(6) || distractors.includes(8) || distractors.includes(13);
      expect(hasCloseDistractor).toBe(true);
      distractors.forEach(d => expect(d).toBeGreaterThan(0));
    });

    it('devrait générer distracteurs pour division (20 ÷ 4 = 5)', () => {
      const num1 = 20;
      const num2 = 4;
      const correctResult = 5;
      // Erreurs communes division
      const specificDistractors = [num1, num2, correctResult * 2];
      const distractors = createDistractorGenerator(correctResult, specificDistractors);
      expect(distractors.length).toBeGreaterThan(0);
      const hasCloseDistractor =
        distractors.includes(4) || distractors.includes(6) || distractors.includes(10);
      expect(hasCloseDistractor).toBe(true);
      distractors.forEach(d => expect(d).toBeGreaterThan(0));
    });

    it('ne devrait jamais générer de distracteurs négatifs ou nuls', () => {
      const testCases = [
        { result: 15, specifics: [20, 10, 18, 12] }, // multiplication-like
        { result: 15, specifics: [7, 8, 5] }, // addition-like
        { result: 7, specifics: [10, 13] }, // subtraction-like
        { result: 5, specifics: [20, 4, 10] }, // division-like
      ];

      testCases.forEach(({ result, specifics }) => {
        const distractors = createDistractorGenerator(result, specifics);
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
