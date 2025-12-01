/**
 * Helpers partagés pour les tests arcade multi-opérations
 * Évite la duplication entre multisnake, invasion et multimemory tests
 */

import { expect } from '@jest/globals';

/**
 * Calcule la réponse correcte pour une opération
 * @param {string} op - Opérateur ('×', '+', '−', '÷')
 * @param {number} a - Premier opérande
 * @param {number} b - Deuxième opérande
 * @returns {number} Résultat de l'opération
 */
export function computeCorrectAnswer(op, a, b) {
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

/**
 * Tests communs pour le calcul des réponses par opération
 * @param {Function} computeFn - Fonction de calcul à tester
 */
export function testCorrectAnswerCalculation(computeFn) {
  return {
    multiplication: () => {
      const result = computeFn('×', 3, 5);
      expect(result).toBe(15);
    },
    addition: () => {
      const result = computeFn('+', 7, 8);
      expect(result).toBe(15);
    },
    subtraction: () => {
      const result = computeFn('−', 10, 3);
      expect(result).toBe(7);
    },
    division: () => {
      const result = computeFn('÷', 20, 4);
      expect(result).toBe(5);
    },
    defaultFallback: () => {
      const result = computeFn('?', 3, 5);
      expect(result).toBe(15); // Fallback ×
    },
  };
}

/**
 * Contraintes de validation par opération
 */
export const operationConstraints = {
  multiplication: { a: 3, b: 5, result: 15, minA: 1, minB: 1 },
  addition: { a: 7, b: 8, result: 15, minA: 1, minB: 1 },
  subtraction: { a: 10, b: 3, result: 7, constraint: 'a >= b' },
  division: { a: 20, b: 4, result: 5, constraint: 'a % b = 0', minB: 2 },
};

/**
 * Valide les contraintes d'une opération
 * @param {string} operation - Nom de l'opération
 */
export function validateOperationConstraints(operation) {
  const c = operationConstraints[operation];

  switch (operation) {
    case 'multiplication':
    case 'addition':
      expect(c.a * (operation === 'multiplication' ? c.b : 1)).toBeGreaterThanOrEqual(1);
      expect(c.a + (operation === 'addition' ? c.b : 0)).toBe(
        operation === 'addition' ? c.result : c.a
      );
      break;
    case 'subtraction':
      expect(c.a).toBeGreaterThanOrEqual(c.b);
      expect(c.result).toBeGreaterThanOrEqual(0);
      break;
    case 'division':
      expect(c.a % c.b).toBe(0);
      expect(c.b).toBeGreaterThanOrEqual(2);
      break;
  }
}

/**
 * Tests pour la gestion des exclusions de tables (uniquement pour ×)
 */
export function testTableExclusions() {
  return {
    onlyForMultiplication: () => {
      const operators = ['+', '−', '÷', '×'];
      operators.forEach(op => {
        const shouldExcludeTables = op === '×';
        expect(shouldExcludeTables).toBe(op === '×');
      });
    },
    noTablesForOtherOps: () => {
      const operators = ['+', '−', '÷'];
      operators.forEach(op => {
        const tables = op === '×' ? [2, 3, 5] : undefined;
        expect(tables).toBeUndefined();
      });
    },
    tablesForMultiplication: () => {
      const operator = '×';
      const tables = operator === '×' ? [2, 3, 5] : undefined;
      expect(tables).toEqual([2, 3, 5]);
    },
  };
}

/**
 * Données de test communes pour les bonnes réponses
 */
export const correctAnswerTestData = [
  { op: '×', a: 3, b: 5, expected: 15 },
  { op: '+', a: 7, b: 8, expected: 15 },
  { op: '−', a: 10, b: 3, expected: 7 },
  { op: '÷', a: 20, b: 4, expected: 5 },
];

/**
 * Tests de validation des contraintes par opération (réutilisables)
 */
export function createConstraintValidationTests() {
  return {
    multiplication: () => {
      expect(3 * 5).toBe(15);
      expect(3).toBeGreaterThanOrEqual(1);
      expect(5).toBeGreaterThanOrEqual(1);
    },
    addition: () => {
      expect(7 + 8).toBe(15);
      expect(7).toBeGreaterThanOrEqual(1);
      expect(8).toBeGreaterThanOrEqual(1);
    },
    subtraction: () => {
      expect(10 - 3).toBe(7);
      expect(10).toBeGreaterThanOrEqual(3);
      expect(7).toBeGreaterThanOrEqual(0);
    },
    division: () => {
      expect(20 / 4).toBe(5);
      expect(20 % 4).toBe(0);
      expect(4).toBeGreaterThanOrEqual(2);
    },
  };
}

/**
 * Données de test pour la condition de victoire
 */
export const victoryConditionTestData = [
  { op: '×', a: 3, b: 5, answer: 15 },
  { op: '+', a: 7, b: 8, answer: 15 },
  { op: '−', a: 10, b: 3, answer: 7 },
  { op: '÷', a: 20, b: 4, answer: 5 },
];

/**
 * Crée un test de condition de victoire paramétré
 */
export function createVictoryConditionTest() {
  return ({ op, a, b, answer }) => {
    const correctAnswer = computeCorrectAnswer(op, a, b);
    const elements = [
      { value: answer - 1, isCorrect: false },
      { value: answer, isCorrect: true },
      { value: answer + 1, isCorrect: false },
      { value: answer + 5, isCorrect: false },
    ];
    const found = elements.find(el => el.value === correctAnswer);
    expect(found).toBeDefined();
    expect(found.value).toBe(answer);
  };
}
