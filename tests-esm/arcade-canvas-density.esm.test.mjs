/**
 * Canevas d'Arcade à la densité de l'écran (js/arcade-common.js) : les jeux dessinent en unités
 * du jeu, la taille interne du canevas est sa taille affichée × la densité (plafonnée à 3, et à
 * 4096 pixels de côté), une transformation ramène le dessin à l'échelle, et le pointeur se
 * convertit toujours en unités du jeu. Avant : taille interne = taille affichée, agrandie par
 * le navigateur sur un écran dense (flou sur téléphone, tablette et écran 4K).
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';

const {
  sizeArcadeCanvas,
  setArcadeCanvasSize,
  getArcadeCanvasSize,
  canvasPixelScale,
  fitArcadeCanvas,
  clientToCanvasPoint,
  canvasToClientPoint,
  readableCanvasFontSize,
  MAX_CANVAS_SIDE,
} = await import('../js/arcade-common.js');
const { initPacmanControls } = await import('../js/multimiam-controls.js');
const { tap } = await import('./helpers/touch-test-helpers.mjs');

const realRatio = globalThis.devicePixelRatio;

/** Canevas dont le contexte note sa transformation */
function canvasWithContext() {
  const canvas = document.createElement('canvas');
  const ctx = { setTransform: jest.fn() };
  canvas.getContext = () => ctx;
  document.body.append(canvas);
  return { canvas, ctx };
}

/** Le canevas s'affiche à sa taille CSS, à partir du point donné (jsdom ne met rien en page) */
function showAt(canvas, left, top) {
  canvas.getBoundingClientRect = () => {
    const width = Number.parseFloat(canvas.style.width);
    const height = Number.parseFloat(canvas.style.height);
    return { left, top, width, height, right: left + width, bottom: top + height, x: left, y: top };
  };
}

beforeEach(() => {
  document.body.replaceChildren();
});

afterEach(() => {
  globalThis.devicePixelRatio = realRatio;
});

describe('taille interne à la densité de l’écran', () => {
  test('affichée en unités du jeu, interne × 3 sur un téléphone, dessin ramené à l’échelle', () => {
    globalThis.devicePixelRatio = 3;
    const { canvas, ctx } = canvasWithContext();
    sizeArcadeCanvas(canvas, 300, 400);
    expect([canvas.style.width, canvas.style.height]).toEqual(['300px', '400px']);
    expect([canvas.width, canvas.height]).toEqual([900, 1200]);
    expect(getArcadeCanvasSize(canvas)).toEqual({ width: 300, height: 400 });
    expect(ctx.setTransform).toHaveBeenLastCalledWith(3, 0, 0, 3, 0, 0);
    expect(canvasPixelScale(canvas)).toBe(3);
  });

  test('densité fractionnaire : pixel entier, transformation exacte', () => {
    globalThis.devicePixelRatio = 1.25;
    const { canvas, ctx } = canvasWithContext();
    sizeArcadeCanvas(canvas, 301, 200);
    expect([canvas.width, canvas.height]).toEqual([376, 250]);
    expect(ctx.setTransform).toHaveBeenLastCalledWith(376 / 301, 0, 0, 250 / 200, 0, 0);
  });

  test('au-delà de 3, la densité est plafonnée (rien ne se voit de plus)', () => {
    globalThis.devicePixelRatio = 4;
    const { canvas } = canvasWithContext();
    sizeArcadeCanvas(canvas, 300, 400);
    expect([canvas.width, canvas.height]).toEqual([900, 1200]);
  });

  test('jamais plus de 4096 pixels de côté (texture garantie des processeurs graphiques)', () => {
    globalThis.devicePixelRatio = 3;
    const { canvas, ctx } = canvasWithContext();
    sizeArcadeCanvas(canvas, 1900, 1000);
    expect(MAX_CANVAS_SIDE).toBe(4096);
    expect(canvas.width).toBe(4096);
    expect(canvas.height).toBe(Math.round(1000 * (4096 / 1900)));
    const [scaleX] = ctx.setTransform.mock.lastCall;
    expect(scaleX).toBeCloseTo(4096 / 1900, 6);
  });

  test('plateau de taille fixe (MultiInvaders) : l’affichage s’ajuste, l’intérieur suit', () => {
    globalThis.devicePixelRatio = 2;
    const { canvas, ctx } = canvasWithContext();
    setArcadeCanvasSize(canvas, 400, 600);
    expect(fitArcadeCanvas(canvas, { width: 300, height: 300 })).toBeCloseTo(0.5, 5);
    expect([canvas.style.width, canvas.style.height]).toEqual(['200px', '300px']);
    expect([canvas.width, canvas.height]).toEqual([400, 600]);
    expect(ctx.setTransform).toHaveBeenLastCalledWith(1, 0, 0, 1, 0, 0);
    // Plein écran : affiché plus grand, toujours net, la partie (unités du jeu) ne change pas
    fitArcadeCanvas(canvas, { width: 1000, height: 900 });
    expect([canvas.style.width, canvas.style.height]).toEqual(['600px', '900px']);
    expect([canvas.width, canvas.height]).toEqual([1200, 1800]);
    expect(ctx.setTransform).toHaveBeenLastCalledWith(3, 0, 0, 3, 0, 0);
    expect(getArcadeCanvasSize(canvas)).toEqual({ width: 400, height: 600 });
  });

  test('un canevas jamais dimensionné garde sa taille interne comme taille du jeu', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 853;
    canvas.height = 640;
    expect(getArcadeCanvasSize(canvas)).toEqual({ width: 853, height: 640 });
    expect(canvasPixelScale(canvas)).toBe(1);
  });
});

describe('pointeur et nombres en unités du jeu, à toute densité', () => {
  test('un point de l’écran tombe au même endroit du jeu, et retour', () => {
    globalThis.devicePixelRatio = 3;
    const { canvas } = canvasWithContext();
    sizeArcadeCanvas(canvas, 300, 400);
    showAt(canvas, 10, 20);
    expect(clientToCanvasPoint(canvas, 160, 220)).toEqual({ x: 150, y: 200 });
    expect(canvasToClientPoint(canvas, 150, 200)).toEqual({ x: 160, y: 220 });
  });

  test('les nombres gardent leur taille : la densité ne compte pas dans l’échelle d’affichage', () => {
    globalThis.devicePixelRatio = 3;
    const { canvas } = canvasWithContext();
    sizeArcadeCanvas(canvas, 300, 400);
    showAt(canvas, 0, 0);
    // Affiché à sa taille : 16 px dans le jeu font 16 px à l'écran (pas 48)
    expect(readableCanvasFontSize(canvas, 12)).toBe(16);
  });

  test('MultiMiam : toucher à gauche du personnage le dirige à gauche, à densité 3', () => {
    globalThis.devicePixelRatio = 3;
    const { canvas } = canvasWithContext();
    canvas.id = 'multimiam-canvas';
    sizeArcadeCanvas(canvas, 300, 300);
    showAt(canvas, 0, 0);
    const game = {
      canvas,
      cellSize: 20,
      gameOver: false,
      multimiam: { x: 7, y: 7, direction: 'RIGHT', nextDirection: 'RIGHT', isMoving: true },
      canMove: () => true,
    };
    initPacmanControls(game);
    // Trois cases à gauche du personnage, au-dessus de sa ligne : la gauche domine
    tap(canvas, { x: (7.5 - 3) * 20, y: (7.5 - 1) * 20 });
    expect(game.multimiam.nextDirection).toBe('LEFT');
  });
});
