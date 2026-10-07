import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from '@jest/globals';

/**
 * Les logos de l'accueil se chargent en WebP 128/256/512 (≈ 17 Ko l'un), jamais en PNG
 * source (≈ 2 Mo l'un). Les WebP ne sont pas versionnés : `npm run assets:generate` les
 * tire des PNG de assets/images/arcade/, d'où la présence exigée du PNG source.
 */
const html = readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
const tiles = [...html.matchAll(/data-mode="([^"]+)"[\s\S]*?<img([\s\S]*?)\/>/g)].map(
  ([, mode, attrs]) => ({ mode, attrs })
);

describe('logos des modes sur l’accueil', () => {
  test('les six modes, Chrono avant Arcade', () => {
    expect(tiles.map(tile => tile.mode)).toEqual([
      'discovery',
      'quiz',
      'challenge',
      'adventure',
      'chrono',
      'arcade',
    ]);
  });

  test.each(tiles)('$mode : WebP 128/256/512 tirés d’un PNG source versionné', ({ attrs }) => {
    const src = /\ssrc="([^"]+)"/.exec(attrs)?.[1];
    expect(src).toMatch(/^assets\/generated-images\/arcade\/logo_mode_[a-z]+-256\.webp$/);
    const name = /(logo_mode_[a-z]+)-256\.webp$/.exec(src)[1];
    const srcset = /\ssrcset="([^"]+)"/
      .exec(attrs)?.[1]
      .trim()
      .split(/\s*,\s*/);
    expect(srcset).toEqual([
      `assets/generated-images/arcade/${name}-128.webp 128w`,
      `assets/generated-images/arcade/${name}-256.webp 256w`,
      `assets/generated-images/arcade/${name}-512.webp 512w`,
    ]);
    expect(existsSync(`assets/images/arcade/${name}.png`)).toBe(true);
    expect(attrs).not.toMatch(/\.png"/);
  });
});
