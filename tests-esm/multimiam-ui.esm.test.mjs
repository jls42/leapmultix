/**
 * Bandeau de MultiMiam (js/multimiam-ui.js), sur le vrai gabarit des jeux d'Arcade : le
 * calcul avec son « ? » dans une case, le score et les vies, à l'ouverture de la partie puis
 * à chaque appel du jeu.
 */
import { describe, test, expect, beforeEach, jest } from '@jest/globals';

const TEMPLATES = new Map([
  ['info_lives_value', '{lives} vies sur {total}'],
  ['info_lives_value_one', '{lives} vie sur {total}'],
]);
jest.unstable_mockModule('../js/i18n.js', () => ({
  getTranslation: (key, params = {}) =>
    Object.entries(params).reduce(
      (text, [name, value]) => text.replace(`{${name}}`, value),
      TEMPLATES.get(key) ?? key
    ),
}));

const { InfoBar } = await import('../js/components/infoBar.js');
const { initPacmanUI } = await import('../js/multimiam-ui.js');

const question = () => document.querySelector('.arcade-question');
const score = () => document.getElementById('multimiam-info-score').textContent;
const lives = () =>
  document.querySelector('#multimiam-info-lives [role="img"]').getAttribute('aria-label');

function newGame(overrides = {}) {
  return {
    score: 0,
    lives: 3,
    currentOperation: { num1: 6, operator: '×', num2: 7 },
    ...overrides,
  };
}

beforeEach(() => {
  document.body.replaceChildren(
    InfoBar.createArcadeTemplateElement({ mode: 'multimiam', canvasId: 'multimiam-canvas' })
  );
});

describe('MultiMiam : le bandeau de la partie', () => {
  test('à l’ouverture : le calcul avec son « ? » en case, le score et les trois vies', () => {
    initPacmanUI(newGame());
    expect(question().textContent).toBe('6 × 7 = ?');
    expect(question().querySelector('.arcade-answer-box').textContent).toBe('?');
    expect(score()).toBe('0');
    expect(lives()).toBe('3 vies sur 3');
  });

  test('un nouveau calcul remplace l’ancien', () => {
    const game = newGame();
    initPacmanUI(game);
    game.currentOperation = { num1: 15, operator: '−', num2: 7 };
    game.displayOperationUI();
    expect(question().textContent).toBe('15 − 7 = ?');
    expect(question().querySelectorAll('.arcade-answer-box')).toHaveLength(1);
  });

  test('le score et les vies suivent la partie', () => {
    const game = newGame();
    initPacmanUI(game);
    Object.assign(game, { score: 300, lives: 1 });
    game.updateUI();
    expect(score()).toBe('300');
    expect(lives()).toBe('1 vie sur 3');
  });

  test('sans calcul en cours, le bandeau garde ce qu’il montre', () => {
    const game = newGame();
    initPacmanUI(game);
    game.currentOperation = null;
    game.displayOperationUI();
    expect(question().textContent).toBe('6 × 7 = ?');
  });

  test('sans partie, rien ne casse', () => {
    expect(() => initPacmanUI(null)).not.toThrow();
    expect(question().textContent).toBe('');
  });
});
