/**
 * @jest-environment node
 *
 * Une image redessinée sous le même nom refait ses variantes : scripts/generate-responsive-assets.cjs
 * garde une variante déjà produite (dist/assets/images), sauf quand sa source est plus récente.
 * Sans cela, les têtes du serpent de Noël (images d'avant la v63), coiffées d'un bonnet après
 * une première génération, restaient sans bonnet en jeu.
 */
import { afterAll, describe, expect, test } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ResponsiveAssetGenerator = require('../../scripts/generate-responsive-assets.cjs');

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'leapmultix-variantes-'));
const source = path.join(work, 'dessin.png');
const variant = path.join(work, 'dessin-64.webp');
const generator = new ResponsiveAssetGenerator();

const produce = () =>
  generator.generateResolution(source, work, 'dessin', '64', { width: 64, webp: { quality: 90 } });

/** Date de modification d'un fichier, décalée d'une minute */
function shiftedFrom(file, minutes) {
  return new Date(fs.statSync(file).mtimeMs + minutes * 60_000);
}

afterAll(() => fs.rmSync(work, { recursive: true, force: true }));

describe('variantes d’une image redessinée', () => {
  test('une variante plus récente que sa source est gardée, une plus ancienne est refaite', async () => {
    fs.copyFileSync('assets/images/arcade/monstre05_right_128x128.png', source);
    await produce();
    const first = fs.readFileSync(variant);

    // Autre dessin, mais daté d'avant la variante : rien à refaire
    fs.copyFileSync('assets/images/arcade/monstre06_right_128x128.png', source);
    const before = shiftedFrom(variant, -1);
    fs.utimesSync(source, before, before);
    await produce();
    expect(fs.readFileSync(variant).equals(first)).toBe(true);

    // Le même dessin, redessiné après la variante : elle est refaite
    const after = shiftedFrom(variant, 1);
    fs.utimesSync(source, after, after);
    await produce();
    expect(fs.readFileSync(variant).equals(first)).toBe(false);
  });
});
