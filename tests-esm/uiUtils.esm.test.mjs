import { describe, test, expect, beforeAll } from '@jest/globals';
import { generateMCQOptions } from '../js/uiUtils.js';

beforeAll(() => {
  global.window = global.window || {};
});

describe('ESM: generateMCQOptions', () => {
  test('returns 4 options and includes correct', () => {
    const correct = 7;
    const options = generateMCQOptions(correct, () => Math.floor(Math.random() * 20));
    expect(options).toContain(correct);
    expect(options.length).toBe(4);
  });
});
/* eslint-env jest, node */
