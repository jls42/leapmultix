/**
 * @jest-environment node
 *
 * Variantes des images d'Arcade : chaque taille que les jeux peuvent demander
 * (js/arcade-sprite-catalog.js) sort bien de scripts/generate-responsive-assets.cjs, que la CI
 * lance avant chaque déploiement. Sans ce lien, une fusée demandée en 512 px tomberait sur
 * une adresse absente et se replierait sur son petit PNG, floue.
 */
import { describe, expect, test } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import {
  VARIANT_WIDTHS,
  arcadeSpriteSpecs,
  OFFLINE_VARIANT_WIDTH,
} from '../../js/arcade-sprite-catalog.js';

const require = createRequire(import.meta.url);
const ResponsiveAssetGenerator = require('../../scripts/generate-responsive-assets.cjs');

const ARCADE_DIR = 'assets/images/arcade';

/** Largeur et hauteur d'un PNG, lues dans son en-tête (IHDR) */
function pngSize(file) {
  const header = Buffer.alloc(24);
  const fd = fs.openSync(file, 'r');
  try {
    fs.readSync(fd, header, 0, 24, 0);
  } finally {
    fs.closeSync(fd);
  }
  return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
}

// Le générateur lit le catalogue avant de produire les variantes, comme au déploiement
const generator = new ResponsiveAssetGenerator();
await generator.loadArcadeSources();
const specs = arcadeSpriteSpecs();

describe('variantes des images d’Arcade produites par le générateur', () => {
  test('chaque source existe, et ses replis aussi', () => {
    const missing = specs.flatMap(spec =>
      [`${spec.source}.png`, ...spec.fallbacks].filter(
        file => !fs.existsSync(path.join(ARCADE_DIR, file))
      )
    );
    expect(missing).toEqual([]);
  });

  test('chaque largeur demandable est générée (jamais agrandie au-delà de la source)', () => {
    const absent = [];
    for (const spec of specs) {
      const file = path.join(ARCADE_DIR, `${spec.source}.png`);
      const size = pngSize(file);
      const produced = Object.keys(generator.getTargetResolutions(file, size)).map(Number);
      const wanted = VARIANT_WIDTHS.filter(width => width <= spec.maxWidth);
      for (const width of wanted) {
        if (!produced.includes(width) || width > size.width) absent.push(`${spec.source}-${width}`);
      }
    }
    expect(absent).toEqual([]);
  });

  test('logos des jeux au menu de l’Arcade : 128, 256 et 512, comme ceux de l’accueil', () => {
    // Affichés à 144 px (120 sur téléphone) : 512 sur un écran de densité 2 ou 3
    for (const game of ['multiinvaders', 'multimiam', 'multimemory', 'multisnake']) {
      const file = `assets/images/arcade/logo_${game}.png`;
      expect(Object.keys(generator.getTargetResolutions(file, pngSize(file)))).toEqual([
        '128',
        '256',
        '512',
      ]);
    }
  });

  test('cadeaux de l’Aventure : 128, 256 et 512, comme les logos', () => {
    // Affichés à 72 px dans la scène (56 sur téléphone), à 112 px sur l'écran de fin : 336
    // pixels sur un écran de densité 3, au-delà des 256 de la série courte
    for (const gift of ['cadeau_ferme', 'cadeau_ouvert']) {
      const file = `assets/images/arcade/${gift}.png`;
      expect(Object.keys(generator.getTargetResolutions(file, pngSize(file)))).toEqual([
        '128',
        '256',
        '512',
      ]);
    }
  });

  test('têtes des avatars : 128, 256 et 512 depuis leur source de 1024 px', () => {
    // Jusqu'à 96 px à l'écran (écran de fin), 288 pixels sur un écran de densité 3 ; le PNG de
    // 128 px reste le repli, sans variante de plus
    for (const avatar of ['fox', 'panda', 'unicorn', 'dragon', 'astronaut']) {
      const file = `assets/images/arcade/${avatar}_head_avatar.png`;
      expect(Object.keys(generator.getTargetResolutions(file, pngSize(file)))).toEqual([
        '128',
        '256',
        '512',
      ]);
      const small = `assets/images/arcade/${avatar}_head_avatar_128x128.png`;
      expect(Object.keys(generator.getTargetResolutions(small, pngSize(small)))).toEqual([
        '64',
        '128',
      ]);
    }
  });

  test('la variante gardée hors ligne fait partie des variantes de chaque image', () => {
    expect(specs.filter(spec => spec.maxWidth < OFFLINE_VARIANT_WIDTH)).toEqual([]);
  });

  test('les autres images gardent leurs tailles (rien de plus à générer ni à déployer)', () => {
    const sizes = file => Object.keys(generator.getTargetResolutions(file, pngSize(file)));
    expect(sizes('assets/images/arcade/monstre05_right_128x128.png')).toEqual(['64', '128']);
    // Source de 1024 px que les jeux ne dessinent pas (ancien sprite)
    for (const other of ['serpent1_droite']) {
      expect(sizes(`assets/images/arcade/${other}.png`)).toEqual(['64', '128', '256']);
    }
    expect(sizes('assets/images/arcade/logo_mode_quizz.png')).toEqual(['128', '256', '512']);
    expect(sizes('assets/images/arcade/tete_droite.png')).toEqual(['64', '128', '256']);
    // Hors de l'Arcade, une source de plus de 1024 px garde aussi ses trois tailles
    expect(sizes('assets/images/social/leapmultix-social-card-fr.png')).toEqual([
      '64',
      '128',
      '256',
    ]);
  });
});

describe('génération réelle (npm run assets:generate) dans un projet jetable', () => {
  test('une source d’Arcade du catalogue reçoit ses variantes 512 et 1024, et la carte les liste', async () => {
    const sharp = require('sharp');
    const project = fs.mkdtempSync(path.join(os.tmpdir(), 'leapmultix-variantes-'));
    try {
      const arcade = path.join(project, 'assets/images/arcade');
      fs.mkdirSync(arcade, { recursive: true });
      const square = size =>
        sharp({ create: { width: size, height: size, channels: 4, background: '#e67e22' } }).png();
      await square(1024).toFile(path.join(arcade, 'fox.png'));
      await square(1024).toFile(path.join(arcade, 'serpent1_droite.png'));
      const script = path.resolve('scripts/generate-responsive-assets.cjs');
      const run = spawnSync(process.execPath, [script], { cwd: project, encoding: 'utf8' });
      expect(run.status).toBe(0);
      const generated = path.join(project, 'assets/generated-images');
      const map = JSON.parse(fs.readFileSync(path.join(generated, 'image-map.json'), 'utf8'));
      expect(Object.keys(map['arcade/fox'].resolutions)).toEqual([
        '64',
        '128',
        '256',
        '512',
        '1024',
      ]);
      expect(fs.existsSync(path.join(generated, 'arcade/fox-1024.webp'))).toBe(true);
      // Une source hors du catalogue garde ses trois tailles
      expect(Object.keys(map['arcade/serpent1_droite'].resolutions)).toEqual(['64', '128', '256']);
    } finally {
      fs.rmSync(project, { recursive: true, force: true });
    }
  }, 60000);
});
