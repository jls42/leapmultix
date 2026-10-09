#!/usr/bin/env node

/**
 * Convertit les fonds animés (img/background_*.png) en WebP optimisés.
 * Cette étape permet de servir les backgrounds via image-set tout en gardant les PNG legacy.
 */

const fs = require('node:fs');
const path = require('node:path');
const { inSequence } = require('./lib/in-sequence.cjs');
let sharp = null;

try {
  sharp = require('sharp');
} catch (error) {
  console.error('❌ Le module "sharp" est requis. Lancez `npm install --save-dev sharp`.');
  console.error(`Détail: ${error?.message ?? 'Erreur inconnue'}`);
  process.exit(1);
}

const IMG_DIR = path.resolve('img');
// Qualité 85, couleurs sous-échantillonnées sans bavure (sharp YUV) : en qualité 70, les
// dégradés du fond de l'avatar, visible derrière tous les écrans, se tachaient (33,9 à 36,5 dB
// de la source, 36,7 à 38,8 en qualité 85 ; poids × 2,3 environ, un fond chargé par avatar)
const QUALITY = Number.parseInt(process.env.BACKGROUND_QUALITY ?? '85', 10);

function listBackgrounds() {
  return fs
    .readdirSync(IMG_DIR)
    .filter(name => /^background_.*\.png$/i.test(name))
    .map(name => ({
      input: path.join(IMG_DIR, name),
      output: path.join(IMG_DIR, name.replace(/\.png$/i, '.webp')),
    }));
}

async function convertAll() {
  const files = listBackgrounds();
  console.log(`🎨 Conversion de ${files.length} backgrounds en WebP (qualité ${QUALITY})...`);

  await inSequence(files, async ({ input, output }) => {
    try {
      await sharp(input).webp({ quality: QUALITY, smartSubsample: true, effort: 6 }).toFile(output);
      console.log(`✅ ${path.basename(output)}`);
    } catch (error) {
      console.warn(`⚠️  Impossible de convertir ${path.basename(input)}: ${error.message}`);
    }
  });
}

convertAll().catch(error => {
  console.error('❌ Erreur critique:', error);
  process.exit(1);
});
