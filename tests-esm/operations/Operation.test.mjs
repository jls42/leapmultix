/* eslint-env jest, node */
/**
 * Tests pour les classes d'opération (Operation, Multiplication, Addition, Subtraction)
 * Phase 1.7 - Tests unitaires R1
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { Operation } from '../../js/core/operations/Operation.js';
import { Multiplication } from '../../js/core/operations/Multiplication.js';
import { Addition } from '../../js/core/operations/Addition.js';
import { Subtraction } from '../../js/core/operations/Subtraction.js';

describe('Operation (classe abstraite)', () => {
  test('ne peut pas être instanciée directement', () => {
    expect(() => new Operation()).toThrow('Operation is an abstract class');
  });

  test('compute() doit être implémentée par les sous-classes', () => {
    class TestOperation extends Operation {
      constructor() {
        super();
        this.symbol = 'TEST';
        this.name = 'test';
      }
    }
    const op = new TestOperation();
    expect(() => op.compute(1, 2)).toThrow('compute() must be implemented');
  });

  test('generateOperands() doit être implémentée par les sous-classes', () => {
    class TestOperation extends Operation {
      constructor() {
        super();
        this.symbol = 'TEST';
        this.name = 'test';
      }
    }
    const op = new TestOperation();
    expect(() => op.generateOperands('easy')).toThrow('generateOperands() must be implemented');
  });

  test('isValid() valide les opérandes numériques', () => {
    class TestOperation extends Operation {
      constructor() {
        super();
        this.symbol = 'TEST';
      }
    }
    const op = new TestOperation();

    // Valides
    expect(op.isValid(5, 3)).toBe(true);
    expect(op.isValid(0, 0)).toBe(true);
    expect(op.isValid(-5, 10)).toBe(true);

    // Invalides
    expect(op.isValid('5', 3)).toBe(false);
    expect(op.isValid(5, '3')).toBe(false);
    expect(op.isValid(NaN, 3)).toBe(false);
    expect(op.isValid(5, NaN)).toBe(false);
    expect(op.isValid(Infinity, 3)).toBe(false);
    expect(op.isValid(5, Infinity)).toBe(false);
  });

  test('getSupportedTypes() retourne au minimum classic et mcq', () => {
    class TestOperation extends Operation {
      constructor() {
        super();
        this.symbol = 'TEST';
      }
    }
    const op = new TestOperation();
    const types = op.getSupportedTypes();
    expect(types).toContain('classic');
    expect(types).toContain('mcq');
  });

  test('formatQuestion() formate correctement selon le type', () => {
    class TestOperation extends Operation {
      constructor() {
        super();
        this.symbol = '+';
      }
      compute(a, b) {
        return a + b;
      }
    }
    const op = new TestOperation();

    expect(op.formatQuestion(5, 3, 'classic')).toBe('5 + 3 = ?');
    expect(op.formatQuestion(5, 3, 'gap')).toBe('5 + ? = 8');
    expect(op.formatQuestion(5, 3, 'mcq')).toBe('5 + 3 = ?');
    expect(op.formatQuestion(5, 3, 'true_false', 10)).toBe('5 + 3 = 10');
  });
});

describe('Multiplication', () => {
  let mult;

  beforeEach(() => {
    mult = new Multiplication();
  });

  describe('Propriétés', () => {
    test('a les bonnes propriétés de base', () => {
      expect(mult.symbol).toBe('×');
      expect(mult.name).toBe('multiplication');
      expect(mult.spokenForm).toBe('fois');
      expect(mult.unicodeSymbol).toBe('\u00D7');
    });
  });

  describe('compute()', () => {
    test('calcule correctement le produit', () => {
      expect(mult.compute(7, 8)).toBe(56);
      expect(mult.compute(1, 12)).toBe(12);
      expect(mult.compute(5, 5)).toBe(25);
      expect(mult.compute(0, 10)).toBe(0);
      expect(mult.compute(12, 12)).toBe(144);
    });
  });

  describe('generateOperands()', () => {
    test('génère des opérandes dans les bornes (easy)', () => {
      for (let i = 0; i < 50; i++) {
        const { a, b } = mult.generateOperands('easy');
        expect(a).toBeGreaterThanOrEqual(1);
        expect(a).toBeLessThanOrEqual(5);
        expect(b).toBeGreaterThanOrEqual(1);
        expect(b).toBeLessThanOrEqual(5);
      }
    });

    test('génère des opérandes dans les bornes (medium)', () => {
      for (let i = 0; i < 50; i++) {
        const { a, b } = mult.generateOperands('medium');
        expect(a).toBeGreaterThanOrEqual(1);
        expect(a).toBeLessThanOrEqual(10);
        expect(b).toBeGreaterThanOrEqual(1);
        expect(b).toBeLessThanOrEqual(10);
      }
    });

    test('génère des opérandes dans les bornes (hard)', () => {
      for (let i = 0; i < 50; i++) {
        const { a, b } = mult.generateOperands('hard');
        expect(a).toBeGreaterThanOrEqual(1);
        expect(a).toBeLessThanOrEqual(12);
        expect(b).toBeGreaterThanOrEqual(1);
        expect(b).toBeLessThanOrEqual(12);
      }
    });

    test('utilise medium par défaut', () => {
      const { a, b } = mult.generateOperands();
      expect(a).toBeGreaterThanOrEqual(1);
      expect(a).toBeLessThanOrEqual(10);
      expect(b).toBeGreaterThanOrEqual(1);
      expect(b).toBeLessThanOrEqual(10);
    });
  });

  describe('getSupportedTypes()', () => {
    test('supporte tous les types de questions', () => {
      const types = mult.getSupportedTypes();
      expect(types).toContain('classic');
      expect(types).toContain('gap');
      expect(types).toContain('mcq');
      expect(types).toContain('true_false');
      expect(types).toContain('problem');
    });
  });

  describe('formatQuestion()', () => {
    test('formate correctement le type problem', () => {
      const result = mult.formatQuestion(5, 3, 'problem');
      expect(result).toBe('PROBLEM_TEMPLATE:5:3');
    });

    test('utilise le formatage parent pour les autres types', () => {
      expect(mult.formatQuestion(7, 8, 'classic')).toBe('7 × 8 = ?');
      expect(mult.formatQuestion(7, 8, 'gap')).toBe('7 × ? = 56');
    });
  });
});

describe('Addition', () => {
  let add;

  beforeEach(() => {
    add = new Addition();
  });

  describe('Propriétés', () => {
    test('a les bonnes propriétés de base', () => {
      expect(add.symbol).toBe('+');
      expect(add.name).toBe('addition');
      expect(add.spokenForm).toBe('plus');
      expect(add.unicodeSymbol).toBe('+');
    });
  });

  describe('compute()', () => {
    test('calcule correctement la somme', () => {
      expect(add.compute(5, 3)).toBe(8);
      expect(add.compute(1, 9)).toBe(10);
      expect(add.compute(15, 25)).toBe(40);
      expect(add.compute(0, 10)).toBe(10);
      expect(add.compute(20, 20)).toBe(40);
    });
  });

  describe('generateOperands()', () => {
    test('génère des opérandes respectant maxResult (easy)', () => {
      for (let i = 0; i < 50; i++) {
        const { a, b } = add.generateOperands('easy');
        expect(a).toBeGreaterThanOrEqual(1);
        expect(a).toBeLessThanOrEqual(5);
        expect(b).toBeGreaterThanOrEqual(1);
        expect(b).toBeLessThanOrEqual(5);
        expect(a + b).toBeLessThanOrEqual(10);
      }
    });

    test('génère des opérandes respectant maxResult (medium)', () => {
      for (let i = 0; i < 50; i++) {
        const { a, b } = add.generateOperands('medium');
        expect(a).toBeGreaterThanOrEqual(1);
        expect(a).toBeLessThanOrEqual(10);
        expect(b).toBeGreaterThanOrEqual(1);
        expect(b).toBeLessThanOrEqual(10);
        expect(a + b).toBeLessThanOrEqual(20);
      }
    });

    test('génère des opérandes respectant maxResult (hard)', () => {
      for (let i = 0; i < 50; i++) {
        const { a, b } = add.generateOperands('hard');
        expect(a).toBeGreaterThanOrEqual(1);
        expect(a).toBeLessThanOrEqual(20);
        expect(b).toBeGreaterThanOrEqual(1);
        expect(b).toBeLessThanOrEqual(20);
        expect(a + b).toBeLessThanOrEqual(40);
      }
    });

    test('utilise medium par défaut', () => {
      const { a, b } = add.generateOperands();
      expect(a + b).toBeLessThanOrEqual(20);
    });
  });

  describe('isValid()', () => {
    test('valide les opérandes positifs', () => {
      expect(add.isValid(5, 3)).toBe(true);
      expect(add.isValid(0, 0)).toBe(true);
      expect(add.isValid(20, 20)).toBe(true);
    });

    test('rejette les opérandes négatifs', () => {
      expect(add.isValid(-5, 3)).toBe(false);
      expect(add.isValid(5, -3)).toBe(false);
      expect(add.isValid(-5, -3)).toBe(false);
    });

    test('rejette les résultats trop grands', () => {
      const maxSafe = Number.MAX_SAFE_INTEGER;
      expect(add.isValid(maxSafe, 1)).toBe(false);
    });
  });

  describe('getSupportedTypes()', () => {
    test('supporte classic, mcq, gap, problem (pas true_false en R1)', () => {
      const types = add.getSupportedTypes();
      expect(types).toContain('classic');
      expect(types).toContain('mcq');
      expect(types).toContain('gap');
      expect(types).toContain('problem');
      expect(types).not.toContain('true_false'); // R2
    });
  });
});

describe('Subtraction', () => {
  let sub;

  beforeEach(() => {
    sub = new Subtraction();
  });

  describe('Propriétés', () => {
    test('a les bonnes propriétés de base', () => {
      expect(sub.symbol).toBe('−');
      expect(sub.name).toBe('subtraction');
      expect(sub.spokenForm).toBe('moins');
      expect(sub.unicodeSymbol).toBe('\u2212');
    });
  });

  describe('compute()', () => {
    test('calcule correctement la différence', () => {
      expect(sub.compute(8, 3)).toBe(5);
      expect(sub.compute(10, 1)).toBe(9);
      expect(sub.compute(50, 25)).toBe(25);
      expect(sub.compute(5, 5)).toBe(0);
      expect(sub.compute(20, 15)).toBe(5);
    });
  });

  describe('generateOperands()', () => {
    test('génère toujours a >= b (easy)', () => {
      for (let i = 0; i < 50; i++) {
        const { a, b } = sub.generateOperands('easy');
        expect(a).toBeGreaterThanOrEqual(1);
        expect(a).toBeLessThanOrEqual(10);
        expect(b).toBeGreaterThanOrEqual(1);
        expect(b).toBeLessThanOrEqual(10);
        expect(a).toBeGreaterThanOrEqual(b);
      }
    });

    test('génère toujours a >= b (medium)', () => {
      for (let i = 0; i < 50; i++) {
        const { a, b } = sub.generateOperands('medium');
        expect(a).toBeGreaterThanOrEqual(1);
        expect(a).toBeLessThanOrEqual(20);
        expect(b).toBeGreaterThanOrEqual(1);
        expect(b).toBeLessThanOrEqual(20);
        expect(a).toBeGreaterThanOrEqual(b);
      }
    });

    test('génère toujours a >= b (hard)', () => {
      for (let i = 0; i < 50; i++) {
        const { a, b } = sub.generateOperands('hard');
        expect(a).toBeGreaterThanOrEqual(1);
        expect(a).toBeLessThanOrEqual(50);
        expect(b).toBeGreaterThanOrEqual(1);
        expect(b).toBeLessThanOrEqual(50);
        expect(a).toBeGreaterThanOrEqual(b);
      }
    });

    test('utilise medium par défaut', () => {
      const { a, b } = sub.generateOperands();
      expect(a).toBeGreaterThanOrEqual(b);
    });
  });

  describe('isValid()', () => {
    test('valide uniquement quand a >= b', () => {
      expect(sub.isValid(10, 5)).toBe(true);
      expect(sub.isValid(10, 10)).toBe(true);
      expect(sub.isValid(5, 10)).toBe(false);
    });

    test('rejette les opérandes négatifs', () => {
      expect(sub.isValid(-5, 3)).toBe(false);
      expect(sub.isValid(5, -3)).toBe(false);
      expect(sub.isValid(-10, -5)).toBe(false);
    });

    test('valide que les deux opérandes sont >= 0', () => {
      expect(sub.isValid(0, 0)).toBe(true);
      expect(sub.isValid(10, 0)).toBe(true);
    });
  });

  describe('getSupportedTypes()', () => {
    test('supporte classic, mcq, gap, problem (pas true_false en R1)', () => {
      const types = sub.getSupportedTypes();
      expect(types).toContain('classic');
      expect(types).toContain('mcq');
      expect(types).toContain('gap');
      expect(types).toContain('problem');
      expect(types).not.toContain('true_false'); // R2
    });
  });
});
