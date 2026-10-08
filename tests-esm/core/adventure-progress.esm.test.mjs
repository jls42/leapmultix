/* eslint-env jest, node */
/**
 * Totaux de l'Aventure par opération (core/adventure-progress.js), pour le tableau de bord.
 */
import { describe, test, expect } from '@jest/globals';
import { adventureTotalsByOperator } from '../../js/core/adventure-progress.js';

describe('Aventure : niveaux et étoiles par opération', () => {
  test('une opération compte dès un niveau terminé ou une étoile ; rien sinon', () => {
    expect(
      adventureTotalsByOperator({
        '×': { 1: { completed: true, stars: 3 }, 2: { completed: false, stars: 0 } },
        '+': { 1: { completed: false, stars: 1 } },
        '−': { 1: { completed: false, stars: 0 } },
        '÷': 'abîmé',
      })
    ).toEqual({ '×': { levels: 1, stars: 3 }, '+': { levels: 0, stars: 1 } });
  });

  test('sans progression lisible : aucun total', () => {
    expect(adventureTotalsByOperator(null)).toEqual({});
    expect(adventureTotalsByOperator([])).toEqual({});
  });
});
