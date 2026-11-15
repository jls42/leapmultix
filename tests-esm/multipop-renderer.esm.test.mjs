/* eslint-env jest, node */
/**
 * MultiPop, la disposition du plateau : les neuf terriers prennent toute la place donnée
 * (comme les plateaux des autres jeux : « Abandonner » reste en bas de l'écran, le plateau
 * prend la largeur d'un téléphone tourné) ; chaque personnage et sa pancarte tiennent dans
 * leur case, centrés ; un toucher entre deux cases compte pour la plus proche. Un personnage
 * se cale sur le contour de son dessin : large ou haut, il sort du trou à la même hauteur.
 */
import { describe, test, expect } from '@jest/globals';

const { popLayout, cellRect, cellParts, holeAt, figureRect, alphaBounds, BOARD_MARGIN } =
  await import('../js/multipop-renderer.js');

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
