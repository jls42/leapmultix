import { describe, test, expect, beforeAll } from '@jest/globals';
import { generateQuestion } from '../js/questionGenerator.js';

beforeAll(() => {
  global.window = global.window || {};
});

describe('ESM: generateQuestion', () => {
  test('exports function', () => {
    expect(typeof generateQuestion).toBe('function');
  });
});
/* eslint-env jest, node */
