/* eslint-env jest, node */
/**
 * MultiPop, la disposition du plateau : les neuf terriers prennent toute la place donnée
 * (comme les plateaux des autres jeux : « Abandonner » reste en bas de l'écran, le plateau
 * prend la largeur d'un téléphone tourné) ; chaque personnage et sa pancarte tiennent dans
 * leur case, centrés ; un toucher entre deux cases compte pour la plus proche. Un personnage
 * se cale sur le contour de son dessin : large ou haut, il sort du trou à la même hauteur.
 */
import { describe, test, expect, jest } from '@jest/globals';

const {
  popLayout,
  cellRect,
  cellParts,
  holeAt,
  figureRect,
  alphaBounds,
  malletAngle,
  malletParts,
  malletImageRect,
  drawMallet,
  drawPopBoard,
  squashedHole,
  BOARD_MARGIN,
} = await import('../js/multipop-renderer.js');
const { MonsterField, RISE_MS } = await import('../js/multipop-engine.js');

const PORTRAIT = { width: 366, height: 640 };
const LANDSCAPE = { width: 800, height: 260 };
const DESKTOP = { width: 900, height: 520 };
// Téléphone tourné, barres du navigateur affichées (iPhone 13 : 750 × 342 utiles)
const SHORT_LANDSCAPE = { width: 453, height: 186 };

describe('MultiPop : la disposition des terriers', () => {
  test.each([
    ['téléphone en portrait', PORTRAIT],
    ['téléphone tourné', LANDSCAPE],
    ['téléphone tourné, barres du navigateur affichées', SHORT_LANDSCAPE],
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

// jsdom ne dessine pas : le contour d'une image est alors l'image entière
HTMLCanvasElement.prototype.getContext = () => null;

describe('MultiPop : le maillet', () => {
  const malletSprite = () => ({
    image: { naturalWidth: 400, naturalHeight: 500 },
    request: jest.fn(),
  });

  /** Contexte de dessin qui note chaque appel */
  function recordingContext() {
    const calls = [];
    // save() et restore() gardent l'opacité, comme sur un vrai canevas
    const saved = [];
    const keepAlpha = (target, prop) => {
      if (prop === 'save') saved.push(target.globalAlpha);
      if (prop !== 'restore') return;
      const alpha = saved.pop();
      if (alpha === undefined) Reflect.deleteProperty(target, 'globalAlpha');
      else target.globalAlpha = alpha;
    };
    const ctx = new Proxy(
      { canvas: document.createElement('canvas') },
      {
        get(target, prop) {
          if (prop in target) return Reflect.get(target, prop);
          return (...args) => {
            keepAlpha(target, prop);
            // L'opacité du moment de chaque appel : celle du maillet qui s'efface
            calls.push({ name: prop, args, alpha: target.globalAlpha });
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
      expect(size).toBeGreaterThanOrEqual(36);
      expect(size).toBeLessThanOrEqual(72);
      expect(size).toBeLessThanOrEqual(
        Math.max(36, Math.min(layout.cellWidth, layout.cellHeight) * 0.42)
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

  test('son image : le bas du manche sur la poignée, la tête au point visé, dans l’axe', () => {
    const rect = malletImageRect(100, 0.8);
    expect(rect.y + rect.height).toBeCloseTo(0);
    expect(rect.x + rect.width / 2).toBeCloseTo(0);
    expect(rect.width / rect.height).toBeCloseTo(0.8);
    // Le milieu de la tête (à 21 % du haut de l'image) est à 100 de la poignée
    expect(rect.y + rect.height * 0.21).toBeCloseTo(-100);

    const layout = popLayout(DESKTOP);
    const sprite = malletSprite();
    const { ctx, calls } = recordingContext();
    drawMallet(ctx, layout, { x: 200, y: 150, swing: 0, impact: false }, sprite);
    const { length } = malletParts(layout, { x: 200, y: 150 });
    const [image] = named(calls, 'drawImage');
    expect(image.args.slice(5)).toEqual(Object.values(malletImageRect(length, 0.8)));
    expect(sprite.request).toHaveBeenCalled();
    // L'image là, plus de maillet dessiné par le code
    expect(named(calls, 'stroke')).toHaveLength(0);
  });

  test('sans image encore chargée : un maillet dessiné par le code, et l’image est demandée', () => {
    const layout = popLayout(DESKTOP);
    const sprite = { image: null, request: jest.fn() };
    const { ctx, calls } = recordingContext();
    drawMallet(ctx, layout, { x: 200, y: 150, swing: 0, impact: false }, sprite);
    expect(sprite.request).toHaveBeenCalled();
    expect(named(calls, 'drawImage')).toHaveLength(0);
    expect(named(calls, 'stroke')).toHaveLength(2);
  });

  test('un éclat à l’endroit frappé quand il touche un personnage ; sinon son ombre', () => {
    const layout = popLayout(DESKTOP);
    const drawn = mallet => {
      const { ctx, calls } = recordingContext();
      drawMallet(ctx, layout, { x: 200, y: 150, ...mallet });
      return { burst: named(calls, 'lineTo').length, shadow: named(calls, 'ellipse').length };
    };
    expect(drawn({ swing: 1, burst: 1, impact: true })).toEqual({ burst: 16, shadow: 0 });
    expect(drawn({ swing: 1, burst: 1, impact: false })).toEqual({ burst: 0, shadow: 1 });
    // Il descend encore, ou la frappe est retombée : il ne reste que l'ombre du point visé
    expect(drawn({ swing: 0.5, burst: 0, impact: true })).toEqual({ burst: 0, shadow: 1 });
    expect(drawn({ swing: 0, impact: true })).toEqual({ burst: 0, shadow: 1 });
  });

  test('il s’efface tout entier, son ombre et son image avec lui', () => {
    const layout = popLayout(DESKTOP);
    const { ctx, calls } = recordingContext();
    drawMallet(
      ctx,
      layout,
      { x: 200, y: 150, swing: 0, impact: false, alpha: 0.4 },
      malletSprite()
    );
    expect(named(calls, 'drawImage').map(call => call.alpha)).toEqual([0.4]);
    const [shadow] = named(calls, 'fill');
    expect(shadow.alpha).toBeCloseTo(0.4 * 0.28);
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
    const sprite = malletSprite();
    drawPopBoard(withMallet.ctx, {
      ...view,
      mallet: { x: 50, y: 60, swing: 0, impact: false },
      malletSprite: sprite,
    });
    expect(named(withMallet.calls, 'rotate')).toHaveLength(1);
    expect(named(withMallet.calls, 'drawImage')).toHaveLength(1);
    // Après le dernier terrier : rien ne le cache
    const names = withMallet.calls.map(call => call.name);
    expect(names.lastIndexOf('rotate')).toBeGreaterThan(names.lastIndexOf('closePath'));
  });

  test('le personnage touché s’écrase sur le bord de son trou, autant que l’éclat est vif', () => {
    const layout = popLayout(DESKTOP);
    const field = new MonsterField({ count: 3, upMs: 3000, solvedMs: 1500 });
    field.ask(12, () => [12, 15, 18], 0);
    field.tick(1);
    field.tick(RISE_MS);
    const [monster] = field.upMonsters();
    expect(monster).toBeDefined();
    const { sign, centerX, holeY } = cellParts(cellRect(layout, monster.hole));
    const point = { x: sign.x + sign.width / 2, y: sign.y + sign.height / 2 };
    const view = { layout, field, sprites: new Map(), grassSprite: null, cursorHole: null };
    const scales = (mallet, reducedMotion = false) => {
      const { ctx, calls } = recordingContext();
      drawPopBoard(ctx, { ...view, reducedMotion, mallet });
      return { scale: named(calls, 'scale'), translate: named(calls, 'translate') };
    };
    const expectSquash = (calls, wider, lower) => {
      expect(calls).toHaveLength(1);
      const [x, y] = calls.at(0).args;
      expect(x).toBeCloseTo(wider);
      expect(y).toBeCloseTo(lower);
    };
    const struck = { ...point, swing: 1, impact: true, burst: 1 };
    const { scale, translate } = scales(struck);
    expectSquash(scale, 1.12, 0.82);
    // Autour du bas du personnage, au bord du trou : il ne flotte pas
    expect(translate.at(0).args).toEqual([centerX, holeY]);
    expect(squashedHole({ layout, reducedMotion: false, mallet: struck })).toEqual({
      hole: monster.hole,
      squash: 1,
    });
    // À moitié relevé, à moitié écrasé
    expectSquash(scales({ ...struck, burst: 0.5 }).scale, 1.06, 0.91);
    // Rien dans le vide, avant qu'il arrive, ni quand les mouvements sont réduits
    expect(scales({ ...struck, impact: false }).scale).toHaveLength(0);
    expect(scales({ ...struck, burst: 0 }).scale).toHaveLength(0);
    expect(scales(struck, true).scale).toHaveLength(0);
  });
});
