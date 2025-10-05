#!/usr/bin/env node
/**
 * Script to compare translation files and identify discrepancies
 * Uses fr.json as the reference source
 * Date: 2025-10-05
 */

const fs = require('fs');
const path = require('path');

const translationsDir = path.join(__dirname, '..', 'assets', 'translations');
const refLang = 'fr';
const otherLangs = ['en', 'es'];

// Ensure predictable alphabetical ordering regardless of runtime locale settings
const alphabeticalCompare = (a, b) => a.localeCompare(b);

/**
 * Flatten nested JSON to dot notation
 * Example: { arcade: { multiMemory: { title: "X" } } } => { "arcade.multiMemory.title": "X" }
 */
function flattenObject(obj, prefix = '') {
  const flattened = {};

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

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
function main() {
  console.log('🔍 Analyse comparative des fichiers de traduction\n');
  console.log(`📚 Langue de référence: ${refLang}.json\n`);

  // Load reference translations
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
    structureDifferences: [],
  };

  // Compare each language
  for (const lang of otherLangs) {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📝 Analyse de ${lang}.json`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

    const langTranslations = loadTranslations(lang);
    const langKeys = Object.keys(langTranslations).sort(alphabeticalCompare);

    results.summary[lang] = langKeys.length;

    // Find missing keys (in ref but not in lang)
    const missingInLang = refKeys.filter(key => !(key in langTranslations));
    results.missingKeys[lang] = missingInLang;

    // Find extra keys (in lang but not in ref)
    const extraInLang = langKeys.filter(key => !(key in refTranslations));
    results.extraKeys[lang] = extraInLang;

    // Find empty values
    const emptyInLang = langKeys.filter(key => {
      const value = langTranslations[key];
      return (
        value === '' ||
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0)
      );
    });
    results.emptyValues[lang] = emptyInLang;

    // Report
    console.log(`📊 Total de clés: ${langKeys.length}`);

    if (missingInLang.length > 0) {
      console.log(`\n❌ Clés manquantes (${missingInLang.length}):`);
      missingInLang.forEach(key => {
        const refValue = refTranslations[key];
        const preview =
          typeof refValue === 'string'
            ? refValue.substring(0, 50)
            : JSON.stringify(refValue).substring(0, 50);
        console.log(`  • ${key}`);
        console.log(`    fr: "${preview}${preview.length >= 50 ? '...' : ''}"`);
      });
    } else {
      console.log(`\n✅ Aucune clé manquante`);
    }

    if (extraInLang.length > 0) {
      console.log(`\n⚠️  Clés supplémentaires (${extraInLang.length}):`);
      extraInLang.forEach(key => {
        const langValue = langTranslations[key];
        const preview =
          typeof langValue === 'string'
            ? langValue.substring(0, 50)
            : JSON.stringify(langValue).substring(0, 50);
        console.log(`  • ${key}`);
        console.log(`    ${lang}: "${preview}${preview.length >= 50 ? '...' : ''}"`);
      });
    } else {
      console.log(`\n✅ Aucune clé supplémentaire`);
    }

    if (emptyInLang.length > 0) {
      console.log(`\n⚠️  Valeurs vides (${emptyInLang.length}):`);
      emptyInLang.forEach(key => {
        console.log(`  • ${key} = ${JSON.stringify(langTranslations[key])}`);
      });
    } else {
      console.log(`\n✅ Aucune valeur vide`);
    }

    // Check type consistency
    const typeMismatches = [];
    for (const key of refKeys) {
      if (!(key in langTranslations)) continue;

      const refValue = refTranslations[key];
      const langValue = langTranslations[key];

      const refType = Array.isArray(refValue) ? 'array' : typeof refValue;
      const langType = Array.isArray(langValue) ? 'array' : typeof langValue;

      if (refType !== langType) {
        typeMismatches.push({
          key,
          refType,
          langType,
          refValue:
            typeof refValue === 'string' ? refValue.substring(0, 30) : JSON.stringify(refValue),
          langValue:
            typeof langValue === 'string' ? langValue.substring(0, 30) : JSON.stringify(langValue),
        });
      }
    }

    if (typeMismatches.length > 0) {
      console.log(`\n⚠️  Incompatibilités de types (${typeMismatches.length}):`);
      typeMismatches.forEach(mismatch => {
        console.log(`  • ${mismatch.key}`);
        console.log(`    fr (${mismatch.refType}): ${mismatch.refValue}`);
        console.log(`    ${lang} (${mismatch.langType}): ${mismatch.langValue}`);
      });
    }
  }

  // Final summary
  console.log(`\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 RÉSUMÉ FINAL`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  console.log(`Nombre de clés par fichier:`);
  for (const lang in results.summary) {
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

  // Determine if action is needed
  const totalIssues = otherLangs.reduce((sum, lang) => {
    return (
      sum +
      results.missingKeys[lang].length +
      results.extraKeys[lang].length +
      results.emptyValues[lang].length
    );
  }, 0);

  console.log(`\n\n💡 Conclusion:`);
  if (totalIssues === 0) {
    console.log(`✅ Tous les fichiers de traduction sont parfaitement synchronisés !`);
  } else {
    console.log(`⚠️  ${totalIssues} problème(s) détecté(s) nécessitant une correction.`);
    console.log(`\n📝 Prochaines étapes recommandées:`);
    console.log(`  1. Corriger les clés manquantes dans en.json et es.json`);
    console.log(`  2. Supprimer les clés supplémentaires non nécessaires`);
    console.log(`  3. Vérifier et compléter les valeurs vides`);
  }

  // Write detailed report to file
  const reportPath = path.join(__dirname, '..', 'docs', 'translations-comparison-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n📄 Rapport détaillé sauvegardé: ${reportPath}`);
}

main();
