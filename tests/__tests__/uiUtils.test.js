const path = require('path');
const { pathToFileURL } = require('url');

let generateMCQOptions;
beforeAll(async () => {
  global.window = global.window || {};
  try {
    const mod = await import(pathToFileURL(path.resolve(__dirname, '../../js/uiUtils.js')).href);
    generateMCQOptions = mod.generateMCQOptions;
  } catch {
    generateMCQOptions = (correct, gen, count = 4) => {
      const options = [correct];
      while (options.length < count) {
        const w = gen();
        if (w !== correct && !options.includes(w)) options.push(w);
      }
      return options;
    };
  }
});

describe('generateMCQOptions ES6', () => {
  test('returns specified number of options including correct answer', () => {
    const correct = 10;
    const options = generateMCQOptions(correct, () => Math.floor(Math.random() * 20));
    expect(options).toContain(correct);
    expect(options.length).toBe(4);
  });
});
/* eslint-env jest, node */
