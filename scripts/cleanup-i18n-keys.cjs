#!/usr/bin/env node
/**
 * Script to remove 19 unused i18n keys identified by consensus analysis
 * Date: 2025-10-05
 * Source: docs/final-unused-keys-list.txt
 */

const fs = require('fs');
const path = require('path');

// List of 19 keys to remove (consensus of 3 AI analyses)
const KEYS_TO_REMOVE = [
  // Category 1: "How to play" section (5 keys)
  'how_to_play_p1',
  'how_to_play_p2',
  'how_to_play_p3',
  'how_to_play_p4',
  'how_to_play_title',

  // Category 2: Old level selection system (6 keys)
  'level_1_label',
  'level_2_label',
  'level_3_label',
  'level_4_label',
  'level_5_label',
  'level_choice_title',

  // Category 3: Preparation screen (2 keys)
  'prepare_game_title',
  'prepare_game_desc',

  // Category 4: Navigation (1 key)
  'next',

  // Category 5: Old theme selector (5 keys)
  'theme_choice_title',
  'forest',
  'mountain',
  'ocean',
  'space',
];

function cleanupTranslationFile(filePath) {
  console.log(`\n📝 Processing: ${path.basename(filePath)}`);

  // Read the file
  const content = fs.readFileSync(filePath, 'utf8');
  const translations = JSON.parse(content);

  // Track removals
  const removed = [];
  const notFound = [];

  // Remove each key
  for (const key of KEYS_TO_REMOVE) {
    if (translations.hasOwnProperty(key)) {
      delete translations[key];
      removed.push(key);
    } else {
      notFound.push(key);
    }
  }

  // Write back with pretty formatting
  const newContent = JSON.stringify(translations, null, 2) + '\n';
  fs.writeFileSync(filePath, newContent, 'utf8');

  // Report
  console.log(`  ✅ Removed: ${removed.length} keys`);
  if (removed.length > 0) {
    console.log(`     ${removed.slice(0, 5).join(', ')}${removed.length > 5 ? '...' : ''}`);
  }

  if (notFound.length > 0) {
    console.log(`  ⚠️  Not found: ${notFound.length} keys`);
    console.log(`     ${notFound.join(', ')}`);
  }

  return { removed: removed.length, notFound: notFound.length };
}

function main() {
  console.log('🧹 i18n Cleanup - Removing 19 unused keys\n');
  console.log('Source: docs/final-unused-keys-list.txt');
  console.log('Consensus: 3 AI analyses + manual verification\n');

  const translationsDir = path.join(__dirname, '..', 'assets', 'translations');
  const files = ['fr.json', 'en.json', 'es.json'];

  let totalRemoved = 0;
  let totalNotFound = 0;

  for (const file of files) {
    const filePath = path.join(translationsDir, file);
    const result = cleanupTranslationFile(filePath);
    totalRemoved += result.removed;
    totalNotFound += result.notFound;
  }

  console.log('\n📊 Summary:');
  console.log(`  Total keys removed: ${totalRemoved}`);
  console.log(`  Total keys not found: ${totalNotFound}`);
  console.log(`  Expected: ${KEYS_TO_REMOVE.length * 3} keys (19 × 3 files)`);

  if (totalRemoved === KEYS_TO_REMOVE.length * 3) {
    console.log('\n✅ Success! All 19 keys removed from all 3 files.');
  } else if (totalRemoved > 0) {
    console.log('\n⚠️  Partial success. Some keys were not found (may already be removed or named differently).');
  } else {
    console.log('\n❌ No keys were removed. Please check the file paths and key names.');
  }

  console.log('\n💡 Next steps:');
  console.log('  1. Review changes: git diff assets/translations/');
  console.log('  2. Test the application: npm run serve');
  console.log('  3. Check console for missing key warnings');
  console.log('  4. Commit if everything works correctly');
}

main();
