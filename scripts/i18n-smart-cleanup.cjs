#!/usr/bin/env node
/**
 * Smart i18n cleanup - Remove only truly unused keys
 * Handles dynamic patterns like badge_${id}_name, character_intro_${avatar}
 * Fix F-I18N-01: Conservative cleanup avoiding false positives
 */

const fs = require('node:fs');
const path = require('node:path');

console.log('🧹 Smart i18n cleanup - Conservative approach');

// Keys that are CERTAINLY unused (manually verified)
const CONFIRMED_UNUSED = [
  // These were verified by manual grep as NOT being used anywhere
  'arcade_invasion_desc', // Not found in any js files
  'arcade_memory_desc', // Not found in any js files
  'arcade_pacman_desc', // Not found in any js files
  'arcade_snake_desc', // Not found in any js files
  'astronaut', // Character name, but not used as translation key
  'dragon', // Character name, but not used as translation key
  'fox', // Character name, but not used as translation key
  'home_button_label', // Not found in codebase
  'level_10_desc', // Not found in codebase
  'level_10_name', // Not found in codebase
  'level_1_desc', // Not found in codebase
  'level_1_name', // Not found in codebase
  'level_2_desc', // Not found in codebase (EN/ES only)
  'level_2_name', // Not found in codebase (EN/ES only)
  'level_3_desc', // Not found in codebase (EN/ES only)
  'level_3_name', // Not found in codebase (EN/ES only)
];

// Translation files to clean
const TRANSLATION_FILES = ['fr.json', 'en.json', 'es.json'];

let totalRemoved = 0;

TRANSLATION_FILES.forEach(filename => {
  const filePath = path.join('assets', 'translations', filename);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const translations = JSON.parse(content);
  let removedCount = 0;

  console.log(`\n📁 Processing ${filename}...`);

  CONFIRMED_UNUSED.forEach(key => {
    if (translations[key]) {
      console.log(`  ✂️  Removing: ${key}`);
      delete translations[key];
      removedCount++;
    }
  });

  // Write back cleaned JSON
  fs.writeFileSync(filePath, JSON.stringify(translations, null, 4) + '\n');

  console.log(`✅ ${filename}: ${removedCount} keys removed`);
  totalRemoved += removedCount;
});

console.log(`\n🎉 Smart cleanup complete!`);
console.log(`📊 Total keys removed: ${totalRemoved}`);
console.log(`⚠️  Conservative approach: Only confirmed unused keys removed`);
console.log(`💡 Dynamic patterns (badge_*, character_intro_*, arcade.*) preserved`);
