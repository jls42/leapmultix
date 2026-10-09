#!/usr/bin/env node

/**
 * Script de vérification manuelle du code mort
 * Vérifie des fonctions spécifiques suspectes
 */

import fs from 'node:fs';
import path from 'node:path';

const JS_DIR = './js';

function checkFunction(funcName) {
  console.log(`\n🔍 Vérification de: ${funcName}`);

  const files = fs.readdirSync(JS_DIR).filter(file => file.endsWith('.js'));

  const definitions = [];
  const usages = [];

  for (const file of files) {
    const filePath = path.join(JS_DIR, file);
    // eslint-disable-next-line -- Safe file read from controlled filePath in JS_DIR
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    // Chercher les définitions
    lines.forEach((line, index) => {
      if (
        line.includes(`function ${funcName}`) ||
        (line.includes(`${funcName} =`) && (line.includes('function') || line.includes('=>')))
      ) {
        definitions.push({ file, line: index + 1, content: line.trim() });
      }
    });

    // Chercher les usages (appels)
    lines.forEach((line, index) => {
      if (
        line.includes(`${funcName}(`) &&
        !line.trim().startsWith('//') &&
        !line.trim().startsWith('*')
      ) {
        // Exclure si c'est la définition
        if (!line.includes(`function ${funcName}`) && !line.includes(`${funcName} =`)) {
          usages.push({ file, line: index + 1, content: line.trim() });
        }
      }
    });
  }

  console.log(`📍 Définitions (${definitions.length}):`);
  definitions.forEach(def => {
    console.log(`   ${def.file}:${def.line} - ${def.content}`);
  });

  console.log(`📞 Usages réels (${usages.length}):`);
  usages.forEach(usage => {
    console.log(`   ${usage.file}:${usage.line} - ${usage.content}`);
  });

  if (usages.length === 0) {
    console.log(`❌ ${funcName} semble vraiment inutilisée!`);
    return true;
  } else {
    console.log(`✅ ${funcName} est utilisée (${usages.length} fois)`);
    return false;
  }
}

// Vérifier quelques fonctions suspectes
const suspects = ['handleAbandonClick', 'loadMonsters', 'loadAvatars'];

console.log('🕵️ Vérification manuelle du code mort...');

const trulyDead = [];
suspects.forEach(func => {
  if (checkFunction(func)) {
    trulyDead.push(func);
  }
});

console.log(`\n📊 Résumé:`);
console.log(`   Fonctions vraiment mortes: ${trulyDead.length}`);
trulyDead.forEach(func => console.log(`   - ${func}`));
