#!/usr/bin/env node
/**
 * Script to compare translation files and identify discrepancies
 * Uses fr.json as the reference source
 * Date: 2025-10-05
 */

const fs = require('node:fs');
const path = require('node:path');

const translationsDir = path.join(__dirname, '..', 'assets', 'translations');
const refLang = 'fr';
const otherLangs = ['en', 'es'];

// Ensure predictable alphabetical ordering regardless of runtime locale settings
const alphabeticalCompare = (a, b) => a.localeCompare(b);
const EMPTY_VALUE_CHECKS = new Set(['', null, undefined]);

/**
 * Flatten nested JSON to dot notation
 * Example: { arcade: { multiMemory: { title: "X" } } } => { "arcade.multiMemory.title": "X" }
 */
function flattenObject(obj, prefix = '') {
  const flattened = {};

  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      // Recursively flatten nested objects
      Object.assign(flattened, flattenObject(value, newKey));
    } else {
      // Leaf node: string, array, number, etc.
      flattened[newKey] = value;
    }
  }

  return flattened;
}

/**
 * Load and flatten a translation file
 */
function loadTranslations(lang) {
  const filePath = path.join(translationsDir, `${lang}.json`);
  const content = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(content);
  return flattenObject(json);
}

/**
 * Main comparison logic
 */
function findMissingKeys(refKeys, langTranslations) {
  const missingKeys = [];
  for (const key of refKeys) {
    if (!(key in langTranslations)) missingKeys.push(key);
  }
  return missingKeys;
}

function findExtraKeys(langKeys, refTranslations) {
  const extraKeys = [];
  for (const key of langKeys) {
    if (!(key in refTranslations)) extraKeys.push(key);
  }
  return extraKeys;
}

function isEmptyValue(value) {
  if (EMPTY_VALUE_CHECKS.has(value)) return true;
  return Array.isArray(value) && value.length === 0;
}

function findEmptyKeys(langKeys, langTranslations) {
  const emptyKeys = [];
  for (const key of langKeys) {
    if (isEmptyValue(langTranslations[key])) emptyKeys.push(key);
  }
  return emptyKeys;
}

function detectTypeMismatches(refKeys, refTranslations, langTranslations) {
  const mismatches = [];
  for (const key of refKeys) {
    if (!(key in langTranslations)) continue;

    const refValue = refTranslations[key];
    const langValue = langTranslations[key];

    const refType = Array.isArray(refValue) ? 'array' : typeof refValue;
    const langType = Array.isArray(langValue) ? 'array' : typeof langValue;

    if (refType !== langType) {
      mismatches.push({
        key,
        refType,
        langType,
        refValue,
        langValue,
      });
    }
  }
  return mismatches;
}

function collectLanguageStats(lang, refTranslations, refKeys) {
  const langTranslations = loadTranslations(lang);
  const langKeys = Object.keys(langTranslations).sort(alphabeticalCompare);

  return {
    langTranslations,
    langKeys,
    missingInLang: findMissingKeys(refKeys, langTranslations),
    extraInLang: findExtraKeys(langKeys, refTranslations),
    emptyInLang: findEmptyKeys(langKeys, langTranslations),
    typeMismatches: detectTypeMismatches(refKeys, refTranslations, langTranslations),
  };
}

function formatPreview(value, length) {
  const stringified = typeof value === 'string' ? value : JSON.stringify(value);
  const trimmed = stringified.substring(0, length);
  return `${trimmed}${stringified.length > length ? '...' : ''}`;
}

function printMissingKeys(missingKeys, refTranslations) {
  if (missingKeys.length === 0) {
    console.log(`\n✅ Aucune clé manquante`);
    return;
  }

  console.log(`\n❌ Clés manquantes (${missingKeys.length}):`);
  for (const key of missingKeys) {
    const preview = formatPreview(refTranslations[key], 50);
    console.log(`  • ${key}`);
    console.log(`    fr: "${preview}"`);
  }
}

function printExtraKeys(lang, extraKeys, langTranslations) {
  if (extraKeys.length === 0) {
    console.log(`\n✅ Aucune clé supplémentaire`);
    return;
  }

  console.log(`\n⚠️  Clés supplémentaires (${extraKeys.length}):`);
  for (const key of extraKeys) {
    const preview = formatPreview(langTranslations[key], 50);
    console.log(`  • ${key}`);
    console.log(`    ${lang}: "${preview}"`);
  }
}

function printEmptyValues(emptyKeys, langTranslations) {
  if (emptyKeys.length === 0) {
    console.log(`\n✅ Aucune valeur vide`);
    return;
  }

  console.log(`\n⚠️  Valeurs vides (${emptyKeys.length}):`);
  for (const key of emptyKeys) {
    console.log(`  • ${key} = ${JSON.stringify(langTranslations[key])}`);
  }
}

function printTypeMismatches(typeMismatches, lang) {
  if (typeMismatches.length === 0) return;

  console.log(`\n⚠️  Incompatibilités de types (${typeMismatches.length}):`);
  for (const mismatch of typeMismatches) {
    const refPreview = formatPreview(mismatch.refValue, 30);
    const langPreview = formatPreview(mismatch.langValue, 30);
    console.log(`  • ${mismatch.key}`);
    console.log(`    fr (${mismatch.refType}): ${refPreview}`);
    console.log(`    ${lang} (${mismatch.langType}): ${langPreview}`);
  }
}

function printFinalSummary(results) {
  console.log(`\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 RÉSUMÉ FINAL`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  console.log(`Nombre de clés par fichier:`);
  const sortedLangs = Object.keys(results.summary).sort(alphabeticalCompare);
  for (const lang of sortedLangs) {
    console.log(`  ${lang}.json: ${results.summary[lang]} clés`);
  }

  console.log(`\nClés manquantes par langue:`);
  for (const lang of otherLangs) {
    const count = results.missingKeys[lang].length;
    const icon = count === 0 ? '✅' : '❌';
    console.log(`  ${icon} ${lang}.json: ${count} clés manquantes`);
  }

  console.log(`\nClés supplémentaires par langue:`);
  for (const lang of otherLangs) {
    const count = results.extraKeys[lang].length;
    const icon = count === 0 ? '✅' : '⚠️ ';
    console.log(`  ${icon} ${lang}.json: ${count} clés supplémentaires`);
  }

  console.log(`\nValeurs vides par langue:`);
  for (const lang of otherLangs) {
    const count = results.emptyValues[lang].length;
    const icon = count === 0 ? '✅' : '⚠️ ';
    console.log(`  ${icon} ${lang}.json: ${count} valeurs vides`);
  }

  const totalIssues = otherLangs.reduce((sum, lang) => {
    return (
      sum +
      results.missingKeys[lang].length +
      results.extraKeys[lang].length +
      results.emptyValues[lang].length +
      results.typeMismatches[lang].length
    );
  }, 0);

  console.log(`\n\n💡 Conclusion:`);
  if (totalIssues === 0) {
    console.log(`✅ Tous les fichiers de traduction sont parfaitement synchronisés !`);
    return;
  }

  console.log(`⚠️  ${totalIssues} problème(s) détecté(s) nécessitant une correction.`);
  console.log(`\n📝 Prochaines étapes recommandées:`);
  console.log(`  1. Corriger les clés manquantes dans en.json et es.json`);
  console.log(`  2. Supprimer les clés supplémentaires non nécessaires`);
  console.log(`  3. Vérifier et compléter les valeurs vides`);
}

function main() {
  console.log('🔍 Analyse comparative des fichiers de traduction\n');
  console.log(`📚 Langue de référence: ${refLang}.json\n`);

  const refTranslations = loadTranslations(refLang);
  const refKeys = Object.keys(refTranslations).sort(alphabeticalCompare);

  console.log(`✅ ${refLang}.json: ${refKeys.length} clés\n`);

  const results = {
    summary: {
      [refLang]: refKeys.length,
    },
    missingKeys: {},
    extraKeys: {},
    emptyValues: {},
    typeMismatches: {},
  };

  for (const lang of otherLangs) {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📝 Analyse de ${lang}.json`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

    const stats = collectLanguageStats(lang, refTranslations, refKeys);
    results.summary[lang] = stats.langKeys.length;
    results.missingKeys[lang] = stats.missingInLang;
    results.extraKeys[lang] = stats.extraInLang;
    results.emptyValues[lang] = stats.emptyInLang;
    results.typeMismatches[lang] = stats.typeMismatches;

    console.log(`📊 Total de clés: ${stats.langKeys.length}`);
    printMissingKeys(stats.missingInLang, refTranslations);
    printExtraKeys(lang, stats.extraInLang, stats.langTranslations);
    printEmptyValues(stats.emptyInLang, stats.langTranslations);
    printTypeMismatches(stats.typeMismatches, lang);
  }

  printFinalSummary(results);

  const reportPath = path.join(__dirname, '..', 'docs', 'translations-comparison-report.json');
  const reportContent = `${JSON.stringify(results, null, 2)}\n`;
  fs.writeFileSync(reportPath, reportContent, 'utf8');
  console.log(`\n📄 Rapport détaillé sauvegardé: ${reportPath}`);
}

main();
