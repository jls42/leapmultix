#!/usr/bin/env node
/**
 * Fix console errors detected in browser logs
 * 1. Restore missing i18n keys that were incorrectly removed
 * 2. Fix currentUser ReferenceError in storage.js
 * 3. Add missing level names and descriptions
 */

const fs = require('node:fs');

console.log('🔧 Correction des erreurs console...');

// 1. Ajouter les clés de traduction manquantes
const MISSING_KEYS = {
  home_button_label: 'Accueil',
  level_1_name: 'Table de 1',
  level_2_name: 'Table de 2',
  level_3_name: 'Table de 3',
  level_10_name: 'Table de 10',
  level_1_desc: 'Apprends la table de 1 (tout est égal au nombre)',
  mute_button_label_off: 'Activer le son',
  fox: 'Renard',
  dragon: 'Dragon',
  astronaut: 'Astronaute',
  panda: 'Panda',
  unicorn: 'Licorne',
};

const MISSING_KEYS_EN = {
  home_button_label: 'Home',
  level_1_name: 'Level 1',
  level_2_name: 'Level 2',
  level_3_name: 'Level 3',
  level_10_name: 'Level 10',
  level_1_desc: 'Learn the 1 times table (everything equals the number)',
  mute_button_label_off: 'Turn sound on',
  fox: 'Fox',
  dragon: 'Dragon',
  astronaut: 'Astronaut',
  panda: 'Panda',
  unicorn: 'Unicorn',
};

const MISSING_KEYS_ES = {
  home_button_label: 'Inicio',
  level_1_name: 'Nivel 1',
  level_2_name: 'Nivel 2',
  level_3_name: 'Nivel 3',
  level_10_name: 'Nivel 10',
  level_1_desc: 'Aprende la tabla del 1 (todo es igual al número)',
  mute_button_label_off: 'Activar sonido',
  fox: 'Zorro',
  dragon: 'Dragón',
  astronaut: 'Astronauta',
  panda: 'Panda',
  unicorn: 'Unicornio',
};

// Fonction pour ajouter clés manquantes
function addMissingKeys(filePath, missingKeys, language) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${filePath} introuvable`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const translations = JSON.parse(content);

  let addedCount = 0;
  Object.entries(missingKeys).forEach(([key, value]) => {
    if (!translations[key]) {
      translations[key] = value;
      addedCount++;
      console.log(`  ✅ ${language}: Ajout "${key}": "${value}"`);
    }
  });

  if (addedCount > 0) {
    fs.writeFileSync(filePath, JSON.stringify(translations, null, 4) + '\n');
    console.log(`📝 ${filePath}: ${addedCount} clés ajoutées`);
  }
}

// Ajouter clés manquantes pour toutes les langues
addMissingKeys('assets/translations/fr.json', MISSING_KEYS, 'FR');
addMissingKeys('assets/translations/en.json', MISSING_KEYS_EN, 'EN');
addMissingKeys('assets/translations/es.json', MISSING_KEYS_ES, 'ES');

// 2. Corriger l'erreur currentUser dans storage.js
const storageFile = 'js/storage.js';
if (fs.existsSync(storageFile)) {
  let storageContent = fs.readFileSync(storageFile, 'utf8');

  // Remplacer la ligne problématique
  const oldLine = '  if (!currentUser) return;';
  const newLine = '  const userData = UserState.getCurrentUserData();\n  if (!userData) return;';

  if (storageContent.includes(oldLine)) {
    storageContent = storageContent.replace(oldLine, newLine);
    // Supprimer la ligne suivante qui est maintenant redondante
    storageContent = storageContent.replace(
      '  const userData = UserState.getCurrentUserData();\n  userData.parentalLockEnabled = enabled;',
      '  userData.parentalLockEnabled = enabled;'
    );

    fs.writeFileSync(storageFile, storageContent);
    console.log('🔧 storage.js: Erreur currentUser corrigée');
  }
}

console.log('\n✅ Corrections des erreurs console terminées !');
console.log('🔄 Rechargez la page pour voir les améliorations');
