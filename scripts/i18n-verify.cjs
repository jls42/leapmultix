#!/usr/bin/env node
/*
 i18n-verify: scans code for getTranslation('...') and compares with assets/translations/*.json
 Outputs:
 - Missing keys per language
 - Unused keys per language (static heuristic)
 - Summary counts; exit 0 by default (use --strict to exit 1 on issues)
*/
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
  const keys = loadTranslationKeys(transDir);
  const used = collectUsedKeys(root);
  const whitelist = loadWhitelist(path.join(transDir, 'whitelist.txt'));

  function computeMissing(lang) {
    const missing = [];
    for (const k of used) {
      if (matchWhitelist(k, whitelist)) continue;
      if (!keys[lang].has(k)) missing.push(k);
    }
    return missing.sort((a, b) => a.localeCompare(b));
  }
  function computeUnused(lang) {
    const unused = [];
    for (const k of keys[lang]) {
      if (matchWhitelist(k, whitelist)) continue;
      if (!used.has(k)) unused.push(k);
    }
    return unused.sort((a, b) => a.localeCompare(b));
  }

  const missing = { fr: computeMissing('fr'), en: computeMissing('en'), es: computeMissing('es') };
  const unused = { fr: computeUnused('fr'), en: computeUnused('en'), es: computeUnused('es') };

  function print(lang) {
    console.log(`== ${lang.toUpperCase()} ==`);
    console.log(`Missing: ${missing[lang].length}`);
    if (missing[lang].length) console.log(missing[lang].slice(0, 50).join('\n'));
    console.log(`Unused: ${unused[lang].length}`);
    if (unused[lang].length) console.log(unused[lang].slice(0, 50).join('\n'));
  }
  print('fr');
  print('en');
  print('es');

  const strict = process.argv.includes('--strict');
  const issues =
    missing.fr.length +
    missing.en.length +
    missing.es.length +
    unused.fr.length +
    unused.en.length +
    unused.es.length;
  process.exit(strict && issues ? 1 : 0);
}

main();
