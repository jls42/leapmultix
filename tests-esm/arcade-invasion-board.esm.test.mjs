/**
 * Plateau de MultiInvaders : sa taille interne se choisit au lancement pour toute la place,
 * la consigne posée dessus sans lui en prendre (plus haut que large sur un téléphone en
 * portrait, plus large que haut une fois tourné) ; sur ordinateur, les proportions 4:3 de
 * toujours.
 */
import { describe, test, expect, afterEach } from '@jest/globals';
import {
  renderArcadeStage,
  simulateArcadeScreen,
  useAndroidUserAgent,
} from './helpers/arcade-screen-helpers.mjs';

const {
  calculateCanvasDimensions,
  alienRowLayout,
  clampShipX,
  rowEdgeReach,
  shipDrawScale,
  TOUCH_BOARD,
  DESKTOP_BOARD,
} = await import('../js/arcade-invasion.js');
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
  test('en portrait, le plateau prend toute la largeur et toute la hauteur', () => {
    restorers.push(useAndroidUserAgent());
    restorers.push(simulateArcadeScreen({ width: 363, height: 844 }));
    const { displayWidth, displayHeight, isMobile } =
      calculateCanvasDimensions(stageWithInstructions());
    expect(isMobile).toBe(true);
    expect(displayWidth).toBe(363);
    // 844 − 175 − 48 : la consigne est posée sur le plateau, seule « Abandonner » est dessous
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

describe('MultiInvaders : la rangée de monstres tient dans le plateau', () => {
  /** Bords de la rangée, centrée, avec la taille et l'écart donnés */
  function rowEdges(boardWidth, count, isMobile) {
    const { alienWidth, spacing } = alienRowLayout(
      boardWidth,
      count,
      isMobile ? TOUCH_BOARD : DESKTOP_BOARD
    );
    const total = count * alienWidth + (count - 1) * spacing;
    const startX = (boardWidth - total) / 2;
    return { alienWidth, spacing, left: startX, right: startX + total };
  }

  test('sur un écran d’ordinateur ordinaire : monstres de 100, écarts de 50, comme avant', () => {
    expect(rowEdges(800, 5, false)).toMatchObject({ alienWidth: 100, spacing: 50 });
  });

  test.each([
    ['fenêtre étroite d’ordinateur', 374, false],
    ['fenêtre moyenne', 530, false],
    ['téléphone', 363, true],
  ])('%s (%i) : aucun monstre coupé', (_, width, isMobile) => {
    const { left, right } = rowEdges(width, 5, isMobile);
    expect(left).toBeGreaterThanOrEqual(0);
    expect(right).toBeLessThanOrEqual(width);
  });
});

describe('MultiInvaders : la fusée vise chaque monstre', () => {
  // Fusée de 50 de large ; plateau d'ordinateur dont la rangée remplit la largeur
  const SHIP = 50;
  test.each([733, 530, 374])(
    'plateau de %i : le tir part sous le centre des monstres des bords',
    width => {
      const { alienWidth, spacing } = alienRowLayout(width, 5, DESKTOP_BOARD);
      const reach = rowEdgeReach(width, alienWidth, spacing);
      const scale = shipDrawScale(DESKTOP_BOARD, width);
      const center = x => clampShipX(x - SHIP / 2, SHIP, scale, width, reach) + SHIP / 2;
      expect(center(reach)).toBeCloseTo(reach, 6);
      expect(center(width - reach)).toBeCloseTo(width - reach, 6);
    }
  );

  test('plateau de 800 : la fusée reste entière contre les bords', () => {
    const { alienWidth, spacing } = alienRowLayout(800, 5, DESKTOP_BOARD);
    const reach = rowEdgeReach(800, alienWidth, spacing);
    const scale = shipDrawScale(DESKTOP_BOARD, 800);
    const left = clampShipX(-1000, SHIP, scale, 800, reach) + SHIP / 2 - (scale * SHIP) / 2;
    const right = clampShipX(5000, SHIP, scale, 800, reach) + SHIP / 2 + (scale * SHIP) / 2;
    expect(left).toBeGreaterThanOrEqual(0);
    expect(right).toBeLessThanOrEqual(800);
  });
});
