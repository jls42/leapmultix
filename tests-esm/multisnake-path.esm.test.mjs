/**
 * Géométrie du serpent de MultiSnake (js/multisnake-path.js) : ligne médiane pendant un pas
 * (avancé, grandi, immobile, bord franchi), virages arrondis, cap de la tête, rayon du corps,
 * contour et copies au bord du plateau.
 */
import { describe, test, expect } from '@jest/globals';
import {
  BODY_RADIUS,
  bodyOutline,
  bodyRadius,
  headingOf,
  sampleCenterline,
  snakeCenterline,
  stepKind,
  unwrapCells,
  wrapCopies,
  wrappedStep,
} from '../js/multisnake-path.js';

const BOARD = { cols: 14, rows: 11 };
const cells = (...pairs) => pairs.map(([x, y]) => ({ x, y }));
const close = (point, x, y) => {
  expect(point.x).toBeCloseTo(x, 6);
  expect(point.y).toBeCloseTo(y, 6);
};

describe('cases mises bout à bout', () => {
  test('un voisin par le bord opposé est à un pas, pas à tout le plateau', () => {
    expect(wrappedStep(13, 14)).toBe(-1);
    expect(wrappedStep(-13, 14)).toBe(1);
    expect(wrappedStep(1, 14)).toBe(1);
    expect(wrappedStep(0, 14)).toBe(0);
  });

  test('un bord franchi ne fait plus de saut : le corps continue au-delà du plateau', () => {
    expect(unwrapCells(cells([0, 5], [13, 5], [12, 5]), BOARD)).toEqual(
      cells([0, 5], [-1, 5], [-2, 5])
    );
    expect(unwrapCells(cells([3, 10], [3, 0], [3, 1]), BOARD)).toEqual(
      cells([3, 10], [3, 11], [3, 12])
    );
  });
});

describe('ce qu’a fait le serpent au dernier pas', () => {
  const last = cells([5, 5], [4, 5], [3, 5]);

  test('avancé, grandi (bonne pomme), ou immobile', () => {
    expect(stepKind(last, cells([6, 5], [5, 5], [4, 5]))).toBe('moved');
    expect(stepKind(last, cells([6, 5], [5, 5], [4, 5], [3, 5]))).toBe('grew');
    // Mauvaise pomme : il reste sur place ce pas-là
    expect(stepKind(last, last)).toBe('still');
  });

  test('vie perdue, nouvelle partie ou rien d’avant : rien ne s’anime', () => {
    expect(stepKind(last, cells([7, 5], [6, 5]))).toBe('still');
    expect(stepKind([], cells([6, 5], [5, 5]))).toBe('still');
    expect(stepKind(undefined, cells([6, 5], [5, 5]))).toBe('still');
  });
});

describe('ligne médiane pendant un pas', () => {
  const last = cells([5, 5], [4, 5], [3, 5]);

  test('la tête glisse vers sa case, la queue rattrape : longueur constante', () => {
    const line = snakeCenterline({
      last,
      current: cells([6, 5], [5, 5], [4, 5]),
      progress: 0.5,
      board: BOARD,
    });
    expect(line).toHaveLength(4);
    close(line.at(0), 5.5, 5);
    close(line.at(-1), 3.5, 5);
  });

  test('il grandit : la queue reste en place', () => {
    const line = snakeCenterline({
      last,
      current: cells([6, 5], [5, 5], [4, 5], [3, 5]),
      progress: 0.25,
      board: BOARD,
    });
    close(line.at(0), 5.25, 5);
    close(line.at(-1), 3, 5);
  });

  test('pas fini ou immobile : les cases telles quelles', () => {
    const current = cells([6, 5], [5, 5], [4, 5]);
    expect(snakeCenterline({ last, current, progress: 1, board: BOARD })).toEqual(current);
    expect(snakeCenterline({ last, current: last, progress: 0.5, board: BOARD })).toEqual(last);
  });

  test('bord franchi : la tête sort d’un côté, le corps reste d’un seul tenant', () => {
    const line = snakeCenterline({
      last: cells([13, 5], [12, 5]),
      current: cells([0, 5], [13, 5]),
      progress: 0.5,
      board: BOARD,
    });
    expect(line).toHaveLength(3);
    close(line.at(0), -0.5, 5);
    close(line.at(1), -1, 5);
    close(line.at(2), -1.5, 5);
  });
});

describe('points le long du corps', () => {
  // Un coude : de (3, 3) vers le haut, puis vers la droite jusqu'à (5, 1)
  const elbow = cells([5, 1], [4, 1], [3, 1], [3, 2], [3, 3]);

  test('de la tête à la queue, distance croissante, longueur proche du tracé', () => {
    const samples = sampleCenterline(elbow);
    close(samples.at(0), 5, 1);
    close(samples.at(-1), 3, 3);
    samples.slice(1).forEach((point, index) => {
      expect(point.s).toBeGreaterThan(samples.at(index).s);
    });
    // Le virage arrondi raccourcit un peu les 4 cases du tracé
    expect(samples.at(-1).s).toBeGreaterThan(3.7);
    expect(samples.at(-1).s).toBeLessThan(4);
  });

  test('le virage est arrondi : le corps ne passe pas par le coin', () => {
    const corner = elbow.at(2);
    const nearest = Math.min(
      ...sampleCenterline(elbow).map(point => Math.hypot(point.x - corner.x, point.y - corner.y))
    );
    expect(nearest).toBeGreaterThan(0.1);
  });

  test('une tête sur sa case d’avant ne fait pas de point en double', () => {
    const samples = sampleCenterline(cells([4, 1], [4, 1], [3, 1]));
    expect(samples.at(0).s).toBe(0);
    expect(samples.at(1).s).toBeGreaterThan(0);
  });
});

describe('cap de la tête', () => {
  test('droit devant : le sens de la marche', () => {
    expect(headingOf(sampleCenterline(cells([5, 1], [4, 1], [3, 1])), { x: 1, y: 0 })).toBeCloseTo(
      0
    );
    expect(headingOf(sampleCenterline(cells([3, 1], [3, 2], [3, 3])), { x: 0, y: -1 })).toBeCloseTo(
      -Math.PI / 2
    );
  });

  test('dans un virage, la tête tourne en douceur', () => {
    // Vient de tourner vers la droite, à mi-pas : entre le haut (−90°) et la droite (0°)
    const heading = headingOf(sampleCenterline(cells([3.5, 1], [3, 1], [3, 2], [3, 3])), {
      x: 1,
      y: 0,
    });
    expect(heading).toBeGreaterThan(-Math.PI / 2);
    expect(heading).toBeLessThan(0);
  });

  test('corps trop court : la direction du jeu', () => {
    expect(headingOf(sampleCenterline(cells([3, 1])), { x: 0, y: 1 })).toBeCloseTo(Math.PI / 2);
  });
});

describe('rayon et contour du corps', () => {
  test('plein près de la tête, effilé jusqu’au bout de la queue', () => {
    expect(bodyRadius(0, 6)).toBe(BODY_RADIUS);
    expect(bodyRadius(5.8, 6)).toBeLessThan(BODY_RADIUS / 2);
    expect(bodyRadius(6, 6)).toBeGreaterThan(0);
  });

  test('une pomme avalée gonfle le corps là où elle passe', () => {
    expect(bodyRadius(2, 6, [2])).toBeGreaterThan(bodyRadius(2, 6));
    expect(bodyRadius(4, 6, [2])).toBeCloseTo(bodyRadius(4, 6), 3);
  });

  test('contour fermé : un bord, le bout arrondi de la queue, l’autre bord', () => {
    const samples = sampleCenterline(cells([5, 1], [4, 1], [3, 1]));
    const outline = bodyOutline(samples, () => 0.3);
    expect(outline).toHaveLength(samples.length * 2 + 7);
    // Le bout de la queue dépasse un peu sa case vers l'arrière
    expect(Math.min(...outline.map(point => point.x))).toBeCloseTo(2.7, 1);
  });
});

describe('copies au bord du plateau', () => {
  test('loin des bords : une seule fois', () => {
    expect(wrapCopies(sampleCenterline(cells([7, 5], [6, 5])), BOARD)).toEqual([{ x: 0, y: 0 }]);
  });

  test('qui dépasse à gauche : aussi de l’autre côté', () => {
    const copies = wrapCopies(sampleCenterline(cells([0, 5], [-1, 5])), BOARD);
    expect(copies).toEqual([
      { x: 0, y: 0 },
      { x: 14, y: 0 },
    ]);
  });

  test('dans un coin : les quatre copies', () => {
    expect(wrapCopies(sampleCenterline(cells([0, 0], [-1, 0], [-1, -1])), BOARD)).toHaveLength(4);
  });
});
