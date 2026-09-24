#!/usr/bin/env node
/*
 Generate a conservative list of unused i18n keys across all languages.
 - Scans code for getTranslation('...') and data-translate attributes
 - Compares with assets/translations/{fr,en,es}.json
 - Applies whitelist patterns from assets/translations/whitelist.txt
 - Writes intersection(unused_fr, unused_en, unused_es) to assets/translations/unused_keys.txt
 - Prints a short summary and saves a copy in docs/audit/logs/i18n_unused.out
*/
const fs = require('node:fs');
const path = require('node:path');
const {
  loadTranslationKeys,
  collectUsedKeys,
  loadWhitelist,
  matchWhitelist,
} = require('./lib/i18n-keys.cjs');

function main() {
  const root = process.cwd();
  const transDir = path.join(root, 'assets', 'translations');
  const outFile = path.join(transDir, 'unused_keys.txt');
  const logDir = path.join(root, 'docs', 'audit', 'logs');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

  const keys = loadTranslationKeys(transDir);
  const used = collectUsedKeys(root);
  const whitelist = loadWhitelist(path.join(transDir, 'whitelist.txt'));

  function computeUnused(lang) {
    const unused = new Set();
    for (const k of keys[lang]) {
      if (matchWhitelist(k, whitelist)) continue;
      if (!used.has(k)) unused.add(k);
    }
    return unused;
  }

  const unusedFR = computeUnused('fr');
  const unusedEN = computeUnused('en');
  const unusedES = computeUnused('es');

  // Intersection across languages for extra safety
  const intersection = [...unusedFR]
    .filter(k => unusedEN.has(k) && unusedES.has(k))
    .sort((a, b) => a.localeCompare(b));

  fs.writeFileSync(outFile, intersection.join('\n') + (intersection.length ? '\n' : ''), 'utf8');

  const summary = `i18n-unused summary\nFR-unused=${unusedFR.size} EN-unused=${unusedEN.size} ES-unused=${unusedES.size}\nIntersection (written to unused_keys.txt) = ${intersection.length}`;
  fs.writeFileSync(path.join(logDir, 'i18n_unused.out'), summary + '\n', 'utf8');
  console.log(summary);
  console.log(`Wrote ${outFile}`);
}

main();
