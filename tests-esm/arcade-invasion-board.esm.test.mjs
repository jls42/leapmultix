/**
 * Plateau de MultiInvaders : sa taille interne se choisit au lancement pour la place qui
 * restera une fois la consigne partie (plus haut que large sur un téléphone en portrait,
 * plus large que haut une fois tourné) ; sur ordinateur, les proportions 4:3 de toujours.
 */
import { describe, test, expect, afterEach } from '@jest/globals';
import {
  renderArcadeStage,
  simulateArcadeScreen,
  useAndroidUserAgent,
} from './helpers/arcade-screen-helpers.mjs';

const { calculateCanvasDimensions } = await import('../js/arcade-invasion.js');
const { showGameInstructions } = await import('../js/arcade-common.js');

const restorers = [];

afterEach(() => {
  while (restorers.length) restorers.pop()();
});

/** Zone de jeu avec la consigne affichée, comme au lancement */
function stageWithInstructions() {
  const { canvas } = renderArcadeStage('arcade-canvas');
  showGameInstructions(canvas, 'Tire sur les mauvaises réponses');
  return canvas;
}

describe('MultiInvaders sur un téléphone', () => {
  test('en portrait, le plateau prend toute la largeur et la hauteur qui restera', () => {
    restorers.push(useAndroidUserAgent());
    restorers.push(simulateArcadeScreen({ width: 363, height: 844 }));
    const { displayWidth, displayHeight, isMobile } =
      calculateCanvasDimensions(stageWithInstructions());
    expect(isMobile).toBe(true);
    expect(displayWidth).toBe(363);
    // 844 − 175 − 48 : la consigne partira, sa place revient au plateau
    expect(displayHeight).toBe(621);
  });

  test('tourné, le plateau est plus large que haut', () => {
    restorers.push(useAndroidUserAgent());
    restorers.push(simulateArcadeScreen({ width: 612, height: 390, top: 60 }));
    const { displayWidth, displayHeight } = calculateCanvasDimensions(stageWithInstructions());
    expect(displayWidth).toBeGreaterThan(displayHeight);
    expect(displayHeight).toBeLessThanOrEqual(390 - 60 - 48);
    expect(displayWidth).toBeLessThanOrEqual(612);
  });
});

describe('MultiInvaders sur ordinateur', () => {
  test('les proportions 4:3 de toujours, à la hauteur disponible', () => {
    restorers.push(simulateArcadeScreen({ width: 1234, height: 800, top: 202 }));
    const { displayWidth, displayHeight, isMobile } =
      calculateCanvasDimensions(stageWithInstructions());
    expect(isMobile).toBe(false);
    expect(displayHeight).toBe(800 - 202 - 48);
    expect(displayWidth).toBe(Math.floor(displayHeight / 0.75));
  });
});
