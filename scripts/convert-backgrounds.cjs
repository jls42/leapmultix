#!/usr/bin/env node

/**
 * Convertit les fonds animés (img/background_*.png) en WebP optimisés.
 * Cette étape permet de servir les backgrounds via image-set tout en gardant les PNG legacy.
 */

const fs = require('fs');
const path = require('path');
let sharp = null;

try {
  sharp = require('sharp');
} catch (error) {
  console.error('❌ Le module "sharp" est requis. Lancez `npm install --save-dev sharp`.');
  process.exit(1);
}

const IMG_DIR = path.resolve('img');
const QUALITY = parseInt(process.env.BACKGROUND_QUALITY ?? '70', 10);

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

  for (const { input, output } of files) {
    try {
      await sharp(input).webp({ quality: QUALITY, effort: 5 }).toFile(output);
      console.log(`✅ ${path.basename(output)}`);
    } catch (error) {
      console.warn(`⚠️  Impossible de convertir ${path.basename(input)}: ${error.message}`);
    }
  }
}

convertAll().catch(error => {
  console.error('❌ Erreur critique:', error);
  process.exit(1);
});
