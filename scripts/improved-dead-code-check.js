#!/usr/bin/env node

/**
 * Script amélioré de détection de code mort
 * Détecte toutes les formes d'usage de fonctions
 */

import fs from 'fs';
import path from 'path';

const JS_DIR = './js';

function getAllFunctionUsages(funcName, content, filename) {
  const usages = [];
  const lines = content.split('\n');

  // Patterns de recherche pour différents types d'usage
  const patterns = [
    `${funcName}\\s*\\(`, // funcName(
    `${funcName}\\s*,`, // funcName,
    `${funcName}\\s*;`, // funcName;
    `addEventListener\\s*\\([^,]*,\\s*${funcName}`, // addEventListener(event, funcName)
    `removeEventListener\\s*\\([^,]*,\\s*${funcName}`, // removeEventListener(event, funcName)
    `setTimeout\\s*\\(\\s*${funcName}`, // setTimeout(funcName, delay)
    `setInterval\\s*\\(\\s*${funcName}`, // setInterval(funcName, delay)
    `\\.onclick\\s*=\\s*${funcName}`, // .onclick = funcName
    `\\.onload\\s*=\\s*${funcName}`, // .onload = funcName
    `window\\.${funcName}`, // window.funcName
    `\\[\\s*['"]${funcName}['"]\\s*\\]`, // ['funcName'] ou ["funcName"]
    `\\.${funcName}\\s*\\(`, // .funcName(
    `:\\s*${funcName}\\s*[,}]`, // : funcName, ou : funcName}
  ];

  lines.forEach((line, index) => {
    // Ignorer commentaires
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;

    // Tester chaque pattern
    patterns.forEach(pattern => {
      // eslint-disable-next-line -- pattern is constructed from controlled strings
      const regex = new RegExp(pattern, 'g');
      if (regex.test(line)) {
        // Vérifier que ce n'est pas la définition
        if (
          !line.includes(`function ${funcName}`) &&
          // eslint-disable-next-line -- funcName is from function parameter, controlled
          !line.match(new RegExp(`^\\s*(const|let|var)\\s+${funcName}\\s*=`))
        ) {
          usages.push({
            file: filename,
            line: index + 1,
            content: line.trim(),
            pattern: pattern,
          });
        }
      }
    });
  });

  return usages;
}

function checkFunctionThoroughly(funcName) {
  console.log(`\n🔍 Vérification approfondie: ${funcName}`);

  const files = fs.readdirSync(JS_DIR).filter(file => file.endsWith('.js'));

  const definitions = [];
  const allUsages = [];

  for (const file of files) {
    const filePath = path.join(JS_DIR, file);
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- filePath is constructed from JS_DIR and verified file
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    // Chercher définitions
    lines.forEach((line, index) => {
      if (
        line.includes(`function ${funcName}`) ||
        // eslint-disable-next-line -- funcName is from function parameter, controlled
        line.match(new RegExp(`^\\s*(const|let|var)\\s+${funcName}\\s*=.*function`)) ||
        // eslint-disable-next-line -- funcName is from function parameter, controlled
        line.match(new RegExp(`^\\s*(const|let|var)\\s+${funcName}\\s*=.*=>`))
      ) {
        definitions.push({ file, line: index + 1, content: line.trim() });
      }
    });

    // Chercher tous les usages
    const usages = getAllFunctionUsages(funcName, content, file);
    allUsages.push(...usages);
  }

  console.log(`📍 Définitions (${definitions.length}):`);
  definitions.forEach(def => {
    console.log(`   ${def.file}:${def.line} - ${def.content}`);
  });

  console.log(`📞 Tous usages trouvés (${allUsages.length}):`);
  allUsages.forEach(usage => {
    console.log(`   ${usage.file}:${usage.line} - ${usage.content} [${usage.pattern}]`);
  });

  if (allUsages.length === 0) {
    console.log(`❌ ${funcName} semble vraiment inutilisée!`);
    return true;
  } else {
    console.log(`✅ ${funcName} est utilisée (${allUsages.length} fois)`);
    return false;
  }
}

// Tester les suspects
const suspects = ['handleAbandonClick', 'getRandomAvatar', 'getPlayerAvatar', 'getRandomMonsters'];

console.log('🕵️ Vérification approfondie du code mort...');

const reallyDead = [];
suspects.forEach(func => {
  if (checkFunctionThoroughly(func)) {
    reallyDead.push(func);
  }
});

console.log(`\n📊 Résumé final:`);
console.log(`   Fonctions vraiment mortes: ${reallyDead.length}`);
reallyDead.forEach(func => console.log(`   - ${func}`));
