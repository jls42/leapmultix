/* eslint-env jest, node */
/**
 * MultiMemory : une paire ratée montre, pendant la seconde où ses deux cartes restent
 * visibles, le résultat de chaque carte calcul sous son calcul (« 6 × 5 », puis « = 30 ») ;
 * les cartes se retournent ensuite sans lui. Une paire trouvée reste telle quelle. Rien de
 * plus n'est dit à voix haute.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { fakeCanvasContext } from './helpers/touch-test-helpers.mjs';

jest.unstable_mockModule('../js/arcade.js', () => ({
  startArcadeTimer: jest.fn(),
  stopArcadeMode: jest.fn(),
  showArcadeGameOver: jest.fn(),
  isArcadeActive: () => false,
  memoryMonsterSprites: () => Array.from({ length: 16 }, () => ({ complete: false })),
}));
jest.unstable_mockModule('../js/arcade-session.js', () => ({
  noteArcadePlay: jest.fn(),
  noteArcadeMiss: jest.fn(),
}));

const { MemoryGame } = await import('../js/arcade-multimemory.js');

let game;
/** Textes écrits sur le plateau depuis la dernière remise à zéro */
const written = [];

beforeEach(() => {
  jest.useFakeTimers();
  HTMLCanvasElement.prototype.getContext = () =>
    Object.assign(fakeCanvasContext(), {
      createLinearGradient: () => ({ addColorStop() {} }),
      measureText: () => ({ width: 10 }),
      fillText: text => written.push(String(text)),
    });
  const stage = document.createElement('div');
  stage.className = 'arcade-game-ui';
  const canvas = document.createElement('canvas');
  canvas.id = 'multimemory-canvas';
  stage.appendChild(canvas);
  document.body.replaceChildren(stage);
  game = new MemoryGame(canvas.id, { difficulty: 'debutant', operator: '×', tables: [2, 3] });
  game.start();
  written.length = 0;
});

afterEach(() => {
  game.cleanup();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

const operationCard = () => game.cards.find(card => card.type === 'operation');
const resultCard = result => game.cards.find(card => card.type === 'result' && result(card));

describe('MultiMemory : le résultat du calcul sur une paire ratée', () => {
  test('pendant la seconde de la paire ratée, « = résultat » sous le calcul', () => {
    const calculation = operationCard();
    game.flipCard(calculation);
    game.flipCard(resultCard(card => card.result !== calculation.result));
    expect(written).toContain(calculation.content);
    expect(written).toContain(`= ${calculation.result}`);
  });

  test('les cartes retournées, la carte calcul redevient un calcul seul', () => {
    const calculation = operationCard();
    game.flipCard(calculation);
    game.flipCard(resultCard(card => card.result !== calculation.result));
    jest.advanceTimersByTime(1000);
    written.length = 0;
    game.flipCard(calculation);
    expect(written).toContain(calculation.content);
    expect(written).not.toContain(`= ${calculation.result}`);
  });

  test('une paire trouvée : rien de plus sur la carte calcul', () => {
    const calculation = operationCard();
    game.flipCard(calculation);
    game.flipCard(resultCard(card => card.result === calculation.result));
    expect(written).toContain(calculation.content);
    expect(written).not.toContain(`= ${calculation.result}`);
  });
});
