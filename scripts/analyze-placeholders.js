#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chargement des fichiers de traduction
const translationsDir = path.join(__dirname, '../assets/translations');
const fr = JSON.parse(fs.readFileSync(path.join(translationsDir, 'fr.json'), 'utf8'));
const en = JSON.parse(fs.readFileSync(path.join(translationsDir, 'en.json'), 'utf8'));
const es = JSON.parse(fs.readFileSync(path.join(translationsDir, 'es.json'), 'utf8'));

// Fonction pour extraire les placeholders d'une chaîne
function extractPlaceholders(str) {
  if (typeof str !== 'string') return [];
  const matches = str.match(/\{([^}]+)\}/g);
  return matches ? matches.map(m => m.slice(1, -1).trim()) : [];
}

/**
 * Vérifie si un placeholder existe dans toutes les langues
 * @param {string} placeholder - Le placeholder à vérifier
 * @param {Set} frSet - Set des placeholders français
 * @param {Set} enSet - Set des placeholders anglais
 * @param {Set} esSet - Set des placeholders espagnols
 * @returns {Object|null} Objet avec les langues manquantes ou null si tout OK
 */
function checkPlaceholderInLanguages(placeholder, frSet, enSet, esSet) {
  const inFr = frSet.has(placeholder);
  const inEn = enSet.has(placeholder);
  const inEs = esSet.has(placeholder);

  if (!(inFr && inEn && inEs)) {
    return {
      placeholder,
      fr: inFr,
      en: inEn,
      es: inEs,
    };
  }
  return null;
}

/**
 * Analyse les placeholders pour une clé donnée
 * @param {string} key - Clé de traduction
 * @param {Object} flatFr - Traductions françaises aplaties
 * @param {Object} flatEn - Traductions anglaises aplaties
 * @param {Object} flatEs - Traductions espagnoles aplaties
 * @returns {Object|null} Informations sur les problèmes ou null si OK
 */
function analyzePlaceholdersForKey(key, flatFr, flatEn, flatEs) {
  const frValue = Array.isArray(flatFr[key]) ? flatFr[key].join(' ') : flatFr[key];
  const enValue = Array.isArray(flatEn[key]) ? flatEn[key].join(' ') : flatEn[key];
  const esValue = Array.isArray(flatEs[key]) ? flatEs[key].join(' ') : flatEs[key];

  const frPlaceholders = extractPlaceholders(frValue);
  const enPlaceholders = extractPlaceholders(enValue);
  const esPlaceholders = extractPlaceholders(esValue);

  const frSet = new Set(frPlaceholders);
  const enSet = new Set(enPlaceholders);
  const esSet = new Set(esPlaceholders);

  const allPlaceholders = new Set([...frPlaceholders, ...enPlaceholders, ...esPlaceholders]);

  if (allPlaceholders.size > 0) {
    const issues = [];

    for (const placeholder of allPlaceholders) {
      const missingLanguages = checkPlaceholderInLanguages(placeholder, frSet, enSet, esSet);
      if (missingLanguages) {
        issues.push(missingLanguages);
      }
    }

    if (issues.length > 0) {
      return {
        key,
        issues,
        values: {
          fr: frValue,
          en: enValue,
          es: esValue,
        },
      };
    }
  }

  return null;
}

// Fonction pour parcourir récursivement un objet JSON
function flattenObject(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

// Aplatissement des objets de traduction
const flatFr = flattenObject(fr);
const flatEn = flattenObject(en);
const flatEs = flattenObject(es);

// 1. Analyse des clés manquantes
console.log('=== ANALYSE DES CLÉS MANQUANTES ===\n');

const allKeys = new Set([...Object.keys(flatFr), ...Object.keys(flatEn), ...Object.keys(flatEs)]);
const missingKeys = {
  fr: [],
  en: [],
  es: [],
};

for (const key of allKeys) {
  if (!(key in flatFr)) missingKeys.fr.push(key);
  if (!(key in flatEn)) missingKeys.en.push(key);
  if (!(key in flatEs)) missingKeys.es.push(key);
}

console.log('Clés manquantes par langue:');
console.log(`FR: ${missingKeys.fr.length} manquantes`);
if (missingKeys.fr.length > 0) {
  console.log('  ' + missingKeys.fr.join('\n  '));
}
console.log(`EN: ${missingKeys.en.length} manquantes`);
if (missingKeys.en.length > 0) {
  console.log('  ' + missingKeys.en.join('\n  '));
}
console.log(`ES: ${missingKeys.es.length} manquantes`);
if (missingKeys.es.length > 0) {
  console.log('  ' + missingKeys.es.join('\n  '));
}

// 2. Analyse des placeholders incohérents
console.log('\n=== ANALYSE DES PLACEHOLDERS INCOHÉRENTS ===\n');

const placeholderIssues = [];

for (const key of allKeys) {
  if (key in flatFr && key in flatEn && key in flatEs) {
    const placeholderIssue = analyzePlaceholdersForKey(key, flatFr, flatEn, flatEs);
    if (placeholderIssue) {
      placeholderIssues.push(placeholderIssue);
    }
  }
}

if (placeholderIssues.length > 0) {
  console.log('Incohérences de placeholders détectées:');
  for (const issue of placeholderIssues) {
    console.log(`\n📍 Clé: "${issue.key}"`);
    console.log(`   FR: "${issue.values.fr}"`);
    console.log(`   EN: "${issue.values.en}"`);
    console.log(`   ES: "${issue.values.es}"`);
    console.log('   Problèmes:');
    for (const prob of issue.issues) {
      console.log(
        `     - Placeholder "{${prob.placeholder}}" présent dans: ${[
          prob.fr && 'FR',
          prob.en && 'EN',
          prob.es && 'ES',
        ]
          .filter(Boolean)
          .join(', ')}`
      );
    }
  }
} else {
  console.log('✅ Aucune incohérence de placeholders détectée');
}

// 3. Statistiques générales
console.log('\n=== STATISTIQUES GÉNÉRALES ===\n');

console.log(`Nombre total de clés uniques: ${allKeys.size}`);
console.log(
  `Clés présentes dans toutes les langues: ${allKeys.size - Math.max(missingKeys.fr.length, missingKeys.en.length, missingKeys.es.length)}`
);

// Compter les clés avec placeholders
let keysWithPlaceholders = 0;
let totalPlaceholders = 0;

for (const key of allKeys) {
  if (key in flatFr) {
    const value = Array.isArray(flatFr[key]) ? flatFr[key].join(' ') : flatFr[key];
    const placeholders = extractPlaceholders(value);
    if (placeholders.length > 0) {
      keysWithPlaceholders++;
      totalPlaceholders += placeholders.length;
    }
  }
}

console.log(`Clés avec placeholders: ${keysWithPlaceholders}`);
console.log(`Total des placeholders: ${totalPlaceholders}`);

// 4. Structures JSON divergentes
console.log('\n=== STRUCTURES JSON DIVERGENTES ===\n');

function getStructure(obj, path = '') {
  const structure = [];
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      structure.push({ path: currentPath, type: 'object' });
      structure.push(...getStructure(value, currentPath));
    } else if (Array.isArray(value)) {
      structure.push({ path: currentPath, type: 'array' });
    } else {
      structure.push({ path: currentPath, type: typeof value });
    }
  }
  return structure;
}

const frStructure = getStructure(fr);
const enStructure = getStructure(en);
const esStructure = getStructure(es);

const structureMap = {
  fr: new Map(frStructure.map(s => [s.path, s.type])),
  en: new Map(enStructure.map(s => [s.path, s.type])),
  es: new Map(esStructure.map(s => [s.path, s.type])),
};

const allStructurePaths = new Set([
  ...structureMap.fr.keys(),
  ...structureMap.en.keys(),
  ...structureMap.es.keys(),
]);
const structureDifferences = [];

for (const path of allStructurePaths) {
  const frType = structureMap.fr.get(path);
  const enType = structureMap.en.get(path);
  const esType = structureMap.es.get(path);

  if (!(frType === enType && enType === esType)) {
    structureDifferences.push({
      path,
      types: { fr: frType || 'absent', en: enType || 'absent', es: esType || 'absent' },
    });
  }
}

if (structureDifferences.length > 0) {
  console.log('Différences de structure détectées:');
  for (const diff of structureDifferences) {
    console.log(`📍 "${diff.path}": FR=${diff.types.fr}, EN=${diff.types.en}, ES=${diff.types.es}`);
  }
} else {
  console.log('✅ Structures JSON cohérentes entre toutes les langues');
}

console.log('\n=== RÉSUMÉ ===\n');
console.log(
  `🔴 Problèmes critiques: ${Math.max(missingKeys.fr.length, missingKeys.en.length, missingKeys.es.length) + placeholderIssues.length + structureDifferences.length}`
);
console.log(`🟡 Clés orphelines potentielles: 94 (selon scripts existants)`);
console.log(
  `✅ Clés cohérentes: ${allKeys.size - Math.max(missingKeys.fr.length, missingKeys.en.length, missingKeys.es.length)}`
);
