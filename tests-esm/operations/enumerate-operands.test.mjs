/* eslint-env jest, node */
/**
 * enumerateOperands : toutes les paires que generateOperands peut tirer, calculées sur
 * les mêmes bornes. Le corpus de la voix enregistrée s'appuie dessus : un tirage hors
 * de l'énumération serait une phrase sans clip.
 */
import { describe, test, expect } from '@jest/globals';
import { Operation } from '../../js/core/operations/Operation.js';
import { Multiplication } from '../../js/core/operations/Multiplication.js';
import { Addition } from '../../js/core/operations/Addition.js';
import { Subtraction } from '../../js/core/operations/Subtraction.js';
import { Division } from '../../js/core/operations/Division.js';

const OPERATIONS = [new Multiplication(), new Addition(), new Subtraction(), new Division()];
const DIFFICULTIES = ['easy', 'medium', 'hard'];
const DRAWS = 3000;

const key = ({ a, b }) => `${a}|${b}`;

describe('enumerateOperands', () => {
  test('doit être implémentée par les sous-classes', () => {
    class TestOperation extends Operation {
      symbol = 'TEST';
      name = 'test';
    }
    expect(() => new TestOperation().enumerateOperands('easy')).toThrow(
      'enumerateOperands() must be implemented'
    );
  });

  for (const operation of OPERATIONS) {
    describe(operation.name, () => {
      test.each(DIFFICULTIES)('%s : chaque tirage est une paire énumérée', difficulty => {
        const enumerated = new Set(operation.enumerateOperands(difficulty).map(key));
        for (let i = 0; i < DRAWS; i++) {
          expect(enumerated.has(key(operation.generateOperands(difficulty)))).toBe(true);
        }
      });

      test.each(DIFFICULTIES)('%s : chaque paire énumérée est valide et unique', difficulty => {
        const pairs = operation.enumerateOperands(difficulty);
        expect(new Set(pairs.map(key)).size).toBe(pairs.length);
        for (const pair of pairs) expect(operation.isValid(pair.a, pair.b)).toBe(true);
      });
    });
  }

  test('les bornes sont celles des tirages : 12 × 12 en difficile, jamais 13', () => {
    const hard = new Multiplication().enumerateOperands('hard');
    expect(hard).toHaveLength(144);
    expect(hard).toContainEqual({ a: 12, b: 12 });
    expect(new Addition().enumerateOperands('easy').every(({ a, b }) => a + b <= 10)).toBe(true);
    expect(new Subtraction().enumerateOperands('easy')).toContainEqual({ a: 1, b: 1 });
    expect(new Division().enumerateOperands('easy')).toContainEqual({ a: 50, b: 5 });
  });
});
