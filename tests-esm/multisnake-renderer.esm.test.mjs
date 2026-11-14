/**
 * Dessin du serpent de MultiSnake (js/multisnake-renderer.js) et ses habits
 * (js/multisnake-skins.js) : chaque habit se dessine, aux couleurs de sa fête ; chaque fête
 * qui costume le serpent a son habit ; la langue sort et l'œil cligne au temps qui passe,
 * jamais quand l'appareil demande moins d'animations ; un serpent au bord se dessine aussi
 * de l'autre côté.
 */
import { describe, test, expect } from '@jest/globals';
import { drawSnakeScene } from '../js/multisnake-renderer.js';
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
 * Contexte qui retient chaque appel et chaque couleur posée, et compte les save/restore
 * @returns {{ctx: object, calls: string[], fills: Set<string>, strokes: Set<string>, depth: () => number}}
 */
function recordingContext() {
  const calls = [];
  const fills = new Set();
  const strokes = new Set();
  let depth = 0;
  const state = {};
  const ctx = new Proxy(state, {
    get: (target, prop) => {
      if (prop in target) return target[prop];
      return () => {
        calls.push(String(prop));
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
  return { ctx, calls, fills, strokes, depth: () => depth };
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
  });
  return record;
}

describe('habits du serpent', () => {
  test('sans fête : le serpent vert', () => {
    expect(snakeSkin(null)).toMatchObject({ kind: 'snake', back: '#1ba234', hat: null });
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
