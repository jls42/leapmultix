/**
 * Dessin du serpent de MultiSnake (js/multisnake-renderer.js) et ses habits
 * (js/multisnake-skins.js) : chaque habit se dessine, aux couleurs de sa fête ; chaque fête
 * qui costume le serpent a son habit ; la langue sort et l'œil cligne au temps qui passe,
 * jamais quand l'appareil demande moins d'animations ; un serpent au bord se dessine aussi
 * de l'autre côté ; la tête-image (l'avatar sous sa capuche) remplace la tête dessinée une
 * fois chargée, debout, tournée du côté où va le serpent.
 */
import { describe, test, expect } from '@jest/globals';
import { drawSnakeScene, IMAGE_HEAD_SIZE } from '../js/multisnake-renderer.js';
import { SKINNED_SEASONS, snakeSkin } from '../js/multisnake-skins.js';
import { SEASONS } from '../js/core/seasons.js';

const BOARD = { cols: 14, rows: 11 };
const TONGUE = '#e8364a';
// Un serpent de six cases avec un coude, loin des bords
const LONG = [
  { x: 8, y: 3 },
  { x: 7, y: 3 },
  { x: 6, y: 3 },
  { x: 6, y: 4 },
  { x: 6, y: 5 },
  { x: 7, y: 5 },
];

/**
 * Contexte qui retient chaque appel (et ses arguments) et chaque couleur posée, et compte les
 * save/restore
 * @returns {{ctx: object, calls: string[], args: unknown[][], fills: Set<string>, strokes: Set<string>, depth: () => number}}
 */
function recordingContext() {
  const calls = [];
  const args = [];
  const fills = new Set();
  const strokes = new Set();
  let depth = 0;
  const state = {};
  const ctx = new Proxy(state, {
    get: (target, prop) => {
      if (prop in target) return target[prop];
      return (...values) => {
        calls.push(String(prop));
        args.push([String(prop), ...values]);
        if (prop === 'save') depth++;
        if (prop === 'restore') depth--;
      };
    },
    set: (target, prop, value) => {
      target[prop] = value;
      if (prop === 'fillStyle') fills.add(value);
      if (prop === 'strokeStyle') strokes.add(value);
      return true;
    },
  });
  return { ctx, calls, args, fills, strokes, depth: () => depth };
}

function draw(skin, options = {}) {
  const record = recordingContext();
  drawSnakeScene(record.ctx, {
    centerline: options.centerline ?? LONG,
    cell: 40,
    board: BOARD,
    skin,
    direction: { x: 1, y: 0 },
    time: options.time ?? 1000,
    bulges: [2],
    motion: options.motion,
    headImage: options.headImage,
    facing: options.facing,
  });
  return record;
}

describe('habits du serpent', () => {
  test('sans fête : le serpent vert, aux couleurs de la capuche', () => {
    expect(snakeSkin(null)).toMatchObject({ kind: 'snake', back: '#8fd014', hat: null });
    expect(snakeSkin('inconnue')).toBe(snakeSkin(null));
  });

  test('chaque fête qui costume le serpent a son habit, et il a ses couleurs', () => {
    const costumed = SEASONS.filter(season => season.costumes.includes('snake')).map(
      season => season.id
    );
    expect(SKINNED_SEASONS).toEqual(expect.arrayContaining(costumed));
    for (const id of costumed) expect(snakeSkin(id)).not.toBe(snakeSkin(null));
  });

  test('Noël porte un bonnet, le Nouvel An un chapeau pointu, le Nouvel An chinois est un dragon', () => {
    expect(snakeSkin('christmas').hat).toBe('santa');
    expect(snakeSkin('newyear').hat).toBe('party');
    expect(snakeSkin('lunarnewyear')).toMatchObject({ kind: 'dragon', hat: null });
  });
});

describe('dessin', () => {
  test.each([null, ...SKINNED_SEASONS])(
    '%s : dessiné à ses couleurs, contexte rendu intact',
    id => {
      const skin = snakeSkin(id);
      const record = draw(skin);
      expect(record.depth()).toBe(0);
      expect([...record.fills]).toEqual(
        expect.arrayContaining([skin.outline, skin.back, skin.shade])
      );
      expect(record.calls).toContain('fill');
    }
  );

  test('un serpent de deux cases (début de partie) se dessine aussi', () => {
    for (const id of [null, 'lunarnewyear']) {
      const record = draw(snakeSkin(id), {
        centerline: [
          { x: 5, y: 5 },
          { x: 4, y: 5 },
        ],
      });
      expect(record.depth()).toBe(0);
      expect(record.calls).toContain('fill');
    }
  });

  test('rien à dessiner sans ligne médiane', () => {
    const record = draw(snakeSkin(null), { centerline: [] });
    expect(record.calls).toEqual([]);
  });

  test('la langue sort de temps en temps, jamais quand l’appareil veut moins d’animations', () => {
    // Langue dehors 200 ms après le début de sa période (décalée de 900 ms)
    expect(draw(snakeSkin(null), { time: 1900 }).strokes.has(TONGUE)).toBe(true);
    expect(draw(snakeSkin(null), { time: 1000 }).strokes.has(TONGUE)).toBe(false);
    expect(draw(snakeSkin(null), { time: 1900, motion: false }).strokes.has(TONGUE)).toBe(false);
  });

  test('au bord du plateau, le serpent est dessiné une seconde fois de l’autre côté', () => {
    const scales = centerline =>
      draw(snakeSkin(null), { centerline }).calls.filter(call => call === 'scale').length;
    expect(scales(LONG)).toBe(1);
    expect(
      scales([
        { x: 0, y: 5 },
        { x: -1, y: 5 },
        { x: -2, y: 5 },
      ])
    ).toBe(2);
  });
});

describe('tête-image : l’avatar du joueur sous sa capuche', () => {
  // Langue dehors à 1900 ms : la tête dessinée se reconnaît à elle
  const TONGUE_OUT = 1900;
  // Serpent qui descend, tête en bas
  const DOWN = [
    { x: 5, y: 6 },
    { x: 5, y: 5 },
    { x: 5, y: 4 },
  ];

  function withImage(loaded, options = {}) {
    const boxes = [];
    const headImage = (_ctx, box, facing) => {
      boxes.push({ box, facing });
      return loaded;
    };
    const record = draw(snakeSkin(null), { time: TONGUE_OUT, ...options, headImage });
    return { ...record, boxes };
  }

  test('chargée, elle remplace la tête dessinée, à sa taille, centrée sur la tête', () => {
    const { boxes, strokes, depth } = withImage(true);
    const size = IMAGE_HEAD_SIZE * 40;
    expect(boxes).toEqual([
      { box: { x: -size / 2, y: -size / 2, width: size, height: size }, facing: 'right' },
    ]);
    expect(strokes.has(TONGUE)).toBe(false);
    expect(depth()).toBe(0);
  });

  test('pas encore chargée, la tête dessinée la remplace', () => {
    const { boxes, strokes, depth } = withImage(false);
    expect(boxes).toHaveLength(1);
    expect(strokes.has(TONGUE)).toBe(true);
    expect(depth()).toBe(0);
  });

  test('elle se dessine en unités du jeu, pour se charger à sa taille à l’écran', () => {
    const { args } = withImage(true);
    expect(args).toContainEqual(['scale', 1 / 40, 1 / 40]);
  });

  test('debout à l’horizontale, un peu penchée vers où elle va quand le serpent descend', () => {
    const turns = record => record.args.filter(([name]) => name === 'rotate').map(([, a]) => a);
    expect(turns(withImage(true))).toEqual([0]);
    const right = withImage(true, { centerline: DOWN, facing: 'right' });
    const left = withImage(true, { centerline: DOWN, facing: 'left' });
    expect(turns(right)).toHaveLength(1);
    expect(turns(right).at(0)).toBeCloseTo(0.25);
    expect(turns(left).at(0)).toBeCloseTo(-0.25);
    expect(left.boxes.at(0).facing).toBe('left');
  });
});
