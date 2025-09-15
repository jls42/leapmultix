#!/usr/bin/env node
/**
 * Clean up obsolete migration/phase scripts
 */

const fs = require('fs');

// Scripts de migration/phase clairement obsolètes
const OBSOLETE_SCRIPTS = [
  'scripts/convert-phase6-step1.js',
  'scripts/convert-phase6-step2.js',
  'scripts/convert-phase6-step3.js',
  'scripts/test-phase5.js',
  'scripts/phase10-ultimate-finalization.cjs',
  'scripts/demo-phase84.js',
  'scripts/finalize-phase4.js',
  'scripts/fix-phase6-step3-exports.js',
  'scripts/fix-phase6-imports.js',
  'scripts/fix-phase6-exports.js',
  'scripts/test-optimized-css.js',
];

console.log('🧹 Nettoyage scripts obsolètes de migration...');

let removedCount = 0;
OBSOLETE_SCRIPTS.forEach(script => {
  if (fs.existsSync(script)) {
    try {
      fs.unlinkSync(script);
      console.log(`  ✂️  Supprimé: ${script}`);
      removedCount++;
    } catch (error) {
      console.log(`  ❌ Erreur: ${script} - ${error.message}`);
    }
  } else {
    console.log(`  ℹ️  Absent: ${script}`);
  }
});

console.log(`\n✅ Scripts obsolètes supprimés: ${removedCount}`);

// Conserver les scripts utiles
console.log('\n📋 Scripts conservés (utiles):');
const USEFUL_SCRIPTS = [
  'scripts/i18n-verify.cjs',
  'scripts/i18n-smart-cleanup.cjs',
  'scripts/real-cleanup.cjs',
  'scripts/analyze-assets-safe-v2.js',
  'scripts/analyze-dependencies.js',
  'scripts/analyze-globals.js',
];

USEFUL_SCRIPTS.forEach(script => {
  if (fs.existsSync(script)) {
    console.log(`  ✅ ${script}`);
  }
});
