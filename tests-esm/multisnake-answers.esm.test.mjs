/* eslint-env jest, node */
/**
 * MultiSnake : les pommes proposent la bonne réponse et trois leurres plausibles, ceux des
 * autres modes. Avant, les leurres valaient toujours c + 1, c − 1 et c + 10 : la bonne
 * réponse était le milieu de trois nombres qui se suivent (devinable sans calculer), et
 * « −1 » s'affichait chaque fois qu'une soustraction valait 0.
 */
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { fakeCanvasContext } from './helpers/touch-test-helpers.mjs';

const { SnakeGame } = await import('../js/multisnake.js');

const QUESTIONS = 600;
const LEVELS = ['debutant', 'moyen', 'difficile'];

let canvasId;
const games = [];

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = () => fakeCanvasContext();
  const stage = document.createElement('div');
  stage.className = 'arcade-game-ui';
  const canvas = document.createElement('canvas');
  canvas.id = 'multisnake-canvas';
  stage.appendChild(canvas);
  document.body.appendChild(stage);
  canvasId = canvas.id;
});

afterAll(() => games.forEach(game => game.cleanup()));

/** Les pommes de QUESTIONS questions tirées par le jeu, tous niveaux confondus */
function applesOf(operator) {
  return LEVELS.flatMap(difficulty => {
    const game = new SnakeGame(canvasId, 'operation', { operator, difficulty });
    games.push(game);
    return Array.from({ length: QUESTIONS / LEVELS.length }, () => {
      game.generateOperation();
      const correct = game.answers.find(answer => answer.isCorrect).value;
      return { correct, values: game.answers.map(answer => answer.value) };
    });
  });
}

/** Rang de la bonne réponse parmi les quatre pommes rangées par ordre croissant */
function rankOf({ correct, values }) {
  const sorted = [...values];
  sorted.sort((x, y) => x - y);
  return sorted.indexOf(correct);
}

/** La bonne réponse et ses deux voisins immédiats sont-ils tous proposés ? */
const isMiddleOfThree = ({ correct, values }) =>
  values.includes(correct - 1) && values.includes(correct + 1);

describe.each(['+', '−', '×', '÷'])('MultiSnake, %s : les leurres', operator => {
  let apples;
  beforeAll(() => {
    apples = applesOf(operator);
  });

  test('quatre pommes différentes, une seule bonne, aucune négative', () => {
    for (const { correct, values } of apples) {
      expect(new Set(values).size).toBe(4);
      expect(values.filter(value => value === correct)).toHaveLength(1);
      expect(values.every(value => Number.isInteger(value) && value >= 0)).toBe(true);
    }
  });

  test('la bonne réponse ne se devine pas à sa place parmi les nombres', () => {
    const middle = apples.filter(isMiddleOfThree).length / apples.length;
    const ranks = apples.map(rankOf);
    const mostFrequentRank = Math.max(
      ...[0, 1, 2, 3].map(rank => ranks.filter(r => r === rank).length)
    );
    // Avant : 100 % des questions, bonne réponse toujours au rang 1
    expect(middle).toBeLessThan(0.5);
    expect(mostFrequentRank / apples.length).toBeLessThan(0.6);
  });
});
