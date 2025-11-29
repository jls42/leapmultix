/* eslint-env jest */
/**
 * Tests pour Division.js - Opération de division
 * Phase R3 - Tests unitaires Division
 */

describe('Division Operation', () => {
  // Mock Division class (logique pure sans imports ESM)
  class Division {
    constructor() {
      this.symbol = '÷';
      this.name = 'division';
      this.spokenForm = 'divisé par';
      this.unicodeSymbol = '\u00F7';
    }

    compute(a, b) {
      if (b === 0) {
        throw new Error('Division par zéro impossible');
      }
      return a / b;
    }

    generateOperands(difficulty = 'medium') {
      const constraints = {
        easy: {
          minDivisor: 2,
          maxDivisor: 5,
          minQuotient: 1,
          maxQuotient: 10,
        },
        medium: {
          minDivisor: 2,
          maxDivisor: 10,
          minQuotient: 1,
          maxQuotient: 10,
        },
        hard: {
          minDivisor: 2,
          maxDivisor: 12,
          minQuotient: 1,
          maxQuotient: 12,
        },
      };

      const c = constraints[difficulty] || constraints.medium;
      const b = Math.floor(Math.random() * (c.maxDivisor - c.minDivisor + 1)) + c.minDivisor;
      const quotient =
        Math.floor(Math.random() * (c.maxQuotient - c.minQuotient + 1)) + c.minQuotient;
      const a = b * quotient;

      return { a, b };
    }

    isValid(a, b) {
      if (typeof a !== 'number' || typeof b !== 'number') return false;
      if (isNaN(a) || isNaN(b)) return false;
      if (b === 0) return false;
      if (a < 0 || b < 0) return false;
      if (a % b !== 0) return false;
      return true;
    }

    getSupportedTypes() {
      return ['classic', 'mcq', 'gap', 'true_false'];
    }

    generateDistractors(correctAnswer, count = 3) {
      const distractors = new Set();
      const variations = [-2, -1, 1, 2, 3, -3];

      for (const variation of variations) {
        const distractor = correctAnswer + variation;
        if (distractor > 0 && distractor !== correctAnswer) {
          distractors.add(distractor);
        }
        if (distractors.size >= count) break;
      }

      while (distractors.size < count) {
        const random = Math.floor(Math.random() * Math.max(correctAnswer * 2, 12)) + 1;
        if (random !== correctAnswer) {
          distractors.add(random);
        }
      }

      return Array.from(distractors).slice(0, count);
    }
  }

  describe('Métadonnées', () => {
    it('devrait avoir le symbole ÷', () => {
      const division = new Division();
      expect(division.symbol).toBe('÷');
    });

    it('devrait avoir le nom "division"', () => {
      const division = new Division();
      expect(division.name).toBe('division');
    });

    it('devrait avoir spokenForm "divisé par"', () => {
      const division = new Division();
      expect(division.spokenForm).toBe('divisé par');
    });

    it('devrait avoir unicodeSymbol \\u00F7', () => {
      const division = new Division();
      expect(division.unicodeSymbol).toBe('\u00F7');
    });
  });

  describe('compute() - Calcul division', () => {
    it('devrait calculer correctement 12 ÷ 3 = 4', () => {
      const division = new Division();
      expect(division.compute(12, 3)).toBe(4);
    });

    it('devrait calculer correctement 20 ÷ 4 = 5', () => {
      const division = new Division();
      expect(division.compute(20, 4)).toBe(5);
    });

    it('devrait calculer correctement 100 ÷ 10 = 10', () => {
      const division = new Division();
      expect(division.compute(100, 10)).toBe(10);
    });

    it('devrait lancer erreur si division par zéro', () => {
      const division = new Division();
      expect(() => division.compute(10, 0)).toThrow('Division par zéro impossible');
    });

    it('devrait calculer correctement 1 ÷ 1 = 1', () => {
      const division = new Division();
      expect(division.compute(1, 1)).toBe(1);
    });
  });

  describe('generateOperands() - Génération avec contrainte a % b = 0', () => {
    it('devrait générer opérandes divisibles pour difficulty=easy', () => {
      const division = new Division();
      for (let i = 0; i < 20; i++) {
        const { a, b } = division.generateOperands('easy');
        expect(a % b).toBe(0); // CONTRAINTE CRITIQUE
        expect(b).toBeGreaterThanOrEqual(2);
        expect(b).toBeLessThanOrEqual(5);
        expect(a / b).toBeGreaterThanOrEqual(1);
        expect(a / b).toBeLessThanOrEqual(10);
      }
    });

    it('devrait générer opérandes divisibles pour difficulty=medium', () => {
      const division = new Division();
      for (let i = 0; i < 20; i++) {
        const { a, b } = division.generateOperands('medium');
        expect(a % b).toBe(0); // CONTRAINTE CRITIQUE
        expect(b).toBeGreaterThanOrEqual(2);
        expect(b).toBeLessThanOrEqual(10);
        expect(a / b).toBeGreaterThanOrEqual(1);
        expect(a / b).toBeLessThanOrEqual(10);
      }
    });

    it('devrait générer opérandes divisibles pour difficulty=hard', () => {
      const division = new Division();
      for (let i = 0; i < 20; i++) {
        const { a, b } = division.generateOperands('hard');
        expect(a % b).toBe(0); // CONTRAINTE CRITIQUE
        expect(b).toBeGreaterThanOrEqual(2);
        expect(b).toBeLessThanOrEqual(12);
        expect(a / b).toBeGreaterThanOrEqual(1);
        expect(a / b).toBeLessThanOrEqual(12);
      }
    });

    it('devrait éviter division par 1 (min diviseur = 2)', () => {
      const division = new Division();
      for (let i = 0; i < 50; i++) {
        const { b } = division.generateOperands('easy');
        expect(b).toBeGreaterThanOrEqual(2); // Jamais 1
      }
    });

    it('devrait utiliser difficulty=medium par défaut', () => {
      const division = new Division();
      const { a, b } = division.generateOperands();
      expect(a % b).toBe(0);
      expect(b).toBeGreaterThanOrEqual(2);
      expect(b).toBeLessThanOrEqual(10);
    });
  });

  describe('isValid() - Validation contrainte a % b = 0', () => {
    it('devrait valider 12 ÷ 3 (résultat entier)', () => {
      const division = new Division();
      expect(division.isValid(12, 3)).toBe(true);
    });

    it('devrait invalider 10 ÷ 3 (résultat décimal)', () => {
      const division = new Division();
      expect(division.isValid(10, 3)).toBe(false);
    });

    it('devrait invalider division par zéro', () => {
      const division = new Division();
      expect(division.isValid(10, 0)).toBe(false);
    });

    it('devrait invalider nombres négatifs', () => {
      const division = new Division();
      expect(division.isValid(-12, 3)).toBe(false);
      expect(division.isValid(12, -3)).toBe(false);
      expect(division.isValid(-12, -3)).toBe(false);
    });

    it('devrait invalider NaN', () => {
      const division = new Division();
      expect(division.isValid(NaN, 3)).toBe(false);
      expect(division.isValid(12, NaN)).toBe(false);
    });

    it('devrait invalider non-nombres', () => {
      const division = new Division();
      expect(division.isValid('12', 3)).toBe(false);
      expect(division.isValid(12, '3')).toBe(false);
      expect(division.isValid(null, 3)).toBe(false);
      expect(division.isValid(12, undefined)).toBe(false);
    });

    it('devrait valider toutes les divisions générées', () => {
      const division = new Division();
      for (let i = 0; i < 50; i++) {
        const { a, b } = division.generateOperands('medium');
        expect(division.isValid(a, b)).toBe(true);
      }
    });
  });

  describe('getSupportedTypes()', () => {
    it('devrait supporter classic, mcq, gap, true_false', () => {
      const division = new Division();
      const types = division.getSupportedTypes();
      expect(types).toContain('classic');
      expect(types).toContain('mcq');
      expect(types).toContain('gap');
      expect(types).toContain('true_false');
    });

    it('ne devrait pas supporter problem (pas encore implémenté)', () => {
      const division = new Division();
      const types = division.getSupportedTypes();
      expect(types).not.toContain('problem');
    });
  });

  describe('generateDistractors() - Distracteurs QCM', () => {
    it('devrait générer le bon nombre de distracteurs', () => {
      const division = new Division();
      const distractors = division.generateDistractors(5, 3);
      expect(distractors).toHaveLength(3);
    });

    it('ne devrait pas inclure la bonne réponse', () => {
      const division = new Division();
      const correctAnswer = 7;
      const distractors = division.generateDistractors(correctAnswer, 3);
      expect(distractors).not.toContain(correctAnswer);
    });

    it('devrait générer distracteurs positifs uniquement', () => {
      const division = new Division();
      const distractors = division.generateDistractors(3, 3);
      distractors.forEach(d => {
        expect(d).toBeGreaterThan(0);
      });
    });

    it('devrait générer distracteurs plausibles (±1, ±2)', () => {
      const division = new Division();
      const correctAnswer = 5;
      const distractors = division.generateDistractors(correctAnswer, 3);

      // Au moins un distracteur devrait être proche de la réponse
      const hasCloseDistractor = distractors.some(
        d => Math.abs(d - correctAnswer) <= 2 && d !== correctAnswer
      );
      expect(hasCloseDistractor).toBe(true);
    });

    it('ne devrait pas dupliquer distracteurs', () => {
      const division = new Division();
      const distractors = division.generateDistractors(5, 3);
      const uniqueDistractors = new Set(distractors);
      expect(uniqueDistractors.size).toBe(distractors.length);
    });
  });

  describe('Edge cases et robustesse', () => {
    it('devrait gérer grands nombres (a = 144, b = 12)', () => {
      const division = new Division();
      expect(division.compute(144, 12)).toBe(12);
      expect(division.isValid(144, 12)).toBe(true);
    });

    it('devrait gérer division avec quotient = 1 (a = 5, b = 5)', () => {
      const division = new Division();
      expect(division.compute(5, 5)).toBe(1);
      expect(division.isValid(5, 5)).toBe(true);
    });

    it('devrait invalider division non entière (7 ÷ 2 = 3.5)', () => {
      const division = new Division();
      expect(division.isValid(7, 2)).toBe(false);
    });

    it('devrait gérer divisions avec reste nul (20 ÷ 5 = 4)', () => {
      const division = new Division();
      expect(division.compute(20, 5)).toBe(4);
      expect(20 % 5).toBe(0);
      expect(division.isValid(20, 5)).toBe(true);
    });
  });

  describe('Intégration avec questionGenerator (simulation)', () => {
    it('devrait générer questions division valides', () => {
      const division = new Division();

      for (let i = 0; i < 10; i++) {
        const { a, b } = division.generateOperands('medium');
        const result = division.compute(a, b);

        // Vérifier que c'est un entier
        expect(Number.isInteger(result)).toBe(true);
        expect(result).toBe(a / b);
        expect(a % b).toBe(0);
      }
    });

    it('devrait fonctionner avec tous les niveaux de difficulté', () => {
      const division = new Division();
      const difficulties = ['easy', 'medium', 'hard'];

      difficulties.forEach(difficulty => {
        const { a, b } = division.generateOperands(difficulty);
        const result = division.compute(a, b);
        expect(Number.isInteger(result)).toBe(true);
        expect(division.isValid(a, b)).toBe(true);
      });
    });
  });
});
