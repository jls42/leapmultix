/* eslint-env jest, node */
/**
 * MultiPop, la disposition du plateau : les neuf terriers prennent toute la place donnée
 * (comme les plateaux des autres jeux : « Abandonner » reste en bas de l'écran, le plateau
 * prend la largeur d'un téléphone tourné) ; chaque personnage et sa pancarte tiennent dans
 * leur case, centrés ; un toucher entre deux cases compte pour la plus proche. Un personnage
 * se cale sur le contour de son dessin : large ou haut, il sort du trou à la même hauteur.
 */
import { describe, test, expect } from '@jest/globals';

const {
  popLayout,
  cellRect,
  cellParts,
  holeAt,
  figureRect,
  alphaBounds,
  malletAngle,
  malletParts,
  drawMallet,
  drawPopBoard,
  BOARD_MARGIN,
} = await import('../js/multipop-renderer.js');
const { MonsterField } = await import('../js/multipop-engine.js');

const PORTRAIT = { width: 366, height: 640 };
const LANDSCAPE = { width: 800, height: 260 };
const DESKTOP = { width: 900, height: 520 };

describe('MultiPop : la disposition des terriers', () => {
  test.each([
    ['téléphone en portrait', PORTRAIT],
    ['téléphone tourné', LANDSCAPE],
    ['ordinateur', DESKTOP],
  ])('%s : le plateau prend toute la place', (_name, box) => {
    const layout = popLayout(box);
    expect(box.width - layout.width).toBeGreaterThanOrEqual(0);
    expect(box.width - layout.width).toBeLessThan(3);
    expect(box.height - layout.height).toBeGreaterThanOrEqual(0);
    expect(box.height - layout.height).toBeLessThan(3);
  });

  test('téléphone tourné : le plateau est plus large que haut', () => {
    const layout = popLayout(LANDSCAPE);
    expect(layout.width).toBeGreaterThan(layout.height);
  });

  test.each([PORTRAIT, LANDSCAPE, DESKTOP])(
    'chaque personnage et sa pancarte tiennent dans leur case, centrés (%o)',
    box => {
      const layout = popLayout(box);
      for (let hole = 0; hole < 9; hole++) {
        const cell = cellRect(layout, hole);
        const { figure, sign, centerX } = cellParts(cell);
        for (const part of [figure, sign]) {
          expect(part.x).toBeGreaterThanOrEqual(cell.x - 0.01);
          expect(part.y).toBeGreaterThanOrEqual(cell.y - 0.01);
          expect(part.x + part.width).toBeLessThanOrEqual(cell.x + cell.width + 0.01);
          expect(part.y + part.height).toBeLessThanOrEqual(cell.y + cell.height + 0.01);
        }
        expect(centerX).toBeCloseTo(cell.x + cell.width / 2);
      }
    }
  );

  test('un toucher : le terrier de la case, ou de la plus proche entre deux cases', () => {
    const layout = popLayout(PORTRAIT);
    for (let hole = 0; hole < 9; hole++) {
      const cell = cellRect(layout, hole);
      expect(holeAt(layout, { x: cell.x + cell.width / 2, y: cell.y + cell.height / 2 })).toBe(
        hole
      );
    }
    const first = cellRect(layout, 0);
    const gap = { x: first.x + first.width + BOARD_MARGIN / 4, y: first.y + 10 };
    expect(holeAt(layout, gap)).toBe(0);
    expect(holeAt(layout, { x: -5, y: 10 })).toBe(-1);
    expect(holeAt(layout, { x: 10, y: layout.height + 20 })).toBe(-1);
  });
});

describe('MultiPop : un personnage calé sur le contour de son dessin', () => {
  const parts = cellParts(cellRect(popLayout(DESKTOP), 4));

  test.each([
    ['haut et mince (2 de large pour 3 de haut)', 2 / 3],
    ['aussi large que haut', 1],
    ['plus large que haut', 1.4],
  ])('%s : dans sa place, centré, un cinquième du corps caché dans le trou', (_name, aspect) => {
    const rect = figureRect(parts, aspect);
    expect(rect.width / rect.height).toBeCloseTo(aspect);
    expect(rect.x + rect.width / 2).toBeCloseTo(parts.centerX);
    // Ce qui dépasse du trou tient dans la place du personnage
    expect(rect.x).toBeGreaterThanOrEqual(parts.figure.x - 0.01);
    expect(rect.x + rect.width).toBeLessThanOrEqual(parts.figure.x + parts.figure.width + 0.01);
    expect(rect.y).toBeGreaterThanOrEqual(parts.figure.y - 0.01);
    // Le bord du trou coupe le dessin aux quatre cinquièmes de sa hauteur
    expect((parts.holeY - rect.y) / rect.height).toBeCloseTo(0.8);
  });

  test('un dessin haut prend toute la hauteur, un dessin large toute la largeur', () => {
    expect(figureRect(parts, 2 / 3).y).toBeCloseTo(parts.figure.y);
    expect(figureRect(parts, 1.4).width).toBeCloseTo(parts.figure.width);
  });

  test('le contour des points visibles d’une image, sans ses marges transparentes', () => {
    // Image de 8 × 6 : un dessin opaque de la colonne 2 à 5 et de la ligne 1 à 4
    const width = 8;
    const height = 6;
    const data = new Uint8ClampedArray(width * height * 4);
    for (let y = 1; y <= 4; y++) {
      for (let x = 2; x <= 5; x++) data.set([0, 0, 0, 255], (y * width + x) * 4);
    }
    // Un point presque transparent, hors du dessin : ignoré
    data.set([0, 0, 0, 6], 0);
    expect(alphaBounds(data, width, height)).toEqual({
      x: 2 / 8,
      y: 1 / 6,
      width: 4 / 8,
      height: 4 / 6,
    });
  });

  test('une image vide n’a pas de contour', () => {
    expect(alphaBounds(new Uint8ClampedArray(4 * 4 * 4), 4, 4)).toBeNull();
  });
});

describe('MultiPop : le maillet', () => {
  /** Contexte de dessin qui note chaque appel */
  function recordingContext() {
    const calls = [];
    const ctx = new Proxy(
      { canvas: document.createElement('canvas') },
      {
        get(target, prop) {
          if (prop in target) return Reflect.get(target, prop);
          return (...args) => {
            calls.push({ name: prop, args });
            return { width: 40 };
          };
        },
        set: (target, prop, value) => Reflect.set(target, prop, value),
      }
    );
    return { ctx, calls };
  }
  const named = (calls, name) => calls.filter(call => call.name === name);

  test('levé au repos, abattu au moment de la frappe, puis il se relève', () => {
    expect(malletAngle(1)).toBeLessThan(malletAngle(0.5));
    expect(malletAngle(0.5)).toBeLessThan(malletAngle(0));
    // Jamais au-delà de ses deux positions
    expect(malletAngle(3)).toBe(malletAngle(1));
    expect(malletAngle(-1)).toBe(malletAngle(0));
  });

  test.each([PORTRAIT, LANDSCAPE, DESKTOP])(
    'sa tête tombe sur le point visé, sa poignée part en bas à droite (%o)',
    box => {
      const layout = popLayout(box);
      const point = { x: 120, y: 90 };
      const { size, length, pivot } = malletParts(layout, point);
      const angle = malletAngle(1);
      expect(pivot.x + length * Math.sin(angle)).toBeCloseTo(point.x);
      expect(pivot.y - length * Math.cos(angle)).toBeCloseTo(point.y);
      expect(pivot.x).toBeGreaterThan(point.x);
      expect(pivot.y).toBeGreaterThan(point.y);
      // À la taille des cases, sans devenir minuscule ni énorme
      expect(size).toBeGreaterThanOrEqual(30);
      expect(size).toBeLessThanOrEqual(64);
      expect(size).toBeLessThanOrEqual(
        Math.max(30, Math.min(layout.cellWidth, layout.cellHeight) * 0.3)
      );
    }
  );

  test('dessiné autour de sa poignée, à l’angle de la frappe en cours', () => {
    const layout = popLayout(DESKTOP);
    const mallet = { x: 200, y: 150, swing: 0.5, impact: false };
    const { ctx, calls } = recordingContext();
    drawMallet(ctx, layout, mallet);
    const { pivot } = malletParts(layout, mallet);
    expect(named(calls, 'translate').map(call => call.args)).toEqual([[pivot.x, pivot.y]]);
    expect(named(calls, 'rotate').map(call => call.args)).toEqual([[malletAngle(0.5)]]);
  });

  test('un éclat à l’endroit frappé quand il touche un personnage ; sinon son ombre', () => {
    const layout = popLayout(DESKTOP);
    const drawn = mallet => {
      const { ctx, calls } = recordingContext();
      drawMallet(ctx, layout, { x: 200, y: 150, ...mallet });
      return { burst: named(calls, 'lineTo').length, shadow: named(calls, 'ellipse').length };
    };
    expect(drawn({ swing: 1, impact: true })).toEqual({ burst: 16, shadow: 0 });
    expect(drawn({ swing: 1, impact: false })).toEqual({ burst: 0, shadow: 1 });
    // La frappe retombée, il ne reste que l'ombre du point visé
    expect(drawn({ swing: 0, impact: true })).toEqual({ burst: 0, shadow: 1 });
  });

  test('le plateau ne le dessine que s’il est là, par-dessus les terriers', () => {
    const view = {
      layout: popLayout(DESKTOP),
      field: new MonsterField({ count: 3, upMs: 3000, solvedMs: 1500 }),
      sprites: new Map(),
      grassSprite: null,
      cursorHole: null,
      reducedMotion: false,
    };
    const without = recordingContext();
    drawPopBoard(without.ctx, view);
    expect(named(without.calls, 'rotate')).toHaveLength(0);
    const withMallet = recordingContext();
    drawPopBoard(withMallet.ctx, { ...view, mallet: { x: 50, y: 60, swing: 0, impact: false } });
    expect(named(withMallet.calls, 'rotate')).toHaveLength(1);
    // Après le dernier terrier : rien ne le cache
    const names = withMallet.calls.map(call => call.name);
    expect(names.lastIndexOf('rotate')).toBeGreaterThan(names.lastIndexOf('closePath'));
  });
});
