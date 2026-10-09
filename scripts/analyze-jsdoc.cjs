#!/usr/bin/env node

/**
 * Script d'analyse de la documentation JSDoc
 * Phase 9.1 - Documentation du Code
 */

const fs = require('node:fs');
const path = require('node:path');

// Débuts de fonction reconnus, essayés dans cet ordre : le premier qui convient donne le nom
const FUNCTION_PATTERNS = [
  /^\s*function\s+(\w+)/, // function nom
  /^\s*(\w+)\s*[:=]\s*function/, // nom = function, nom: function
  /^\s*(\w+)\s*\(.*\)\s*\{/, // nom(…) {
  /^\s*(\w+)\s*:\s*\(.*\)\s*=>/, // nom: (…) =>
];
const CLASS_METHOD_REGEX = /^\s*(\w+)\s*\([^)]*\)\s*\{/;
const JSDOC_START_REGEX = /^\s*\/\*\*/;

/**
 * Nom de la fonction déclarée sur cette ligne
 * @param {string} line
 * @returns {string|null} null si la ligne ne déclare pas de fonction
 */
function declaredFunctionName(line) {
  for (const pattern of FUNCTION_PATTERNS) {
    const match = pattern.exec(line);
    if (match) return match[1];
  }
  const method = CLASS_METHOD_REGEX.exec(line);
  return method ? method[1] : null;
}

/**
 * Compte une fonction trouvée ligne `index` ; les fonctions privées (_nom) et les constructeurs
 * ne comptent pas
 * @param {object} fileInfo
 * @param {{name: string|null, index: number, isDocumented: boolean}} found
 */
function recordFunction(fileInfo, { name, index, isDocumented }) {
  if (!name || name.startsWith('_') || name === 'constructor') return;
  fileInfo.totalFunctions++;
  if (isDocumented) {
    fileInfo.documentedFunctions++;
  } else {
    fileInfo.undocumentedFunctions.push({ name, line: index + 1 });
  }
}

/**
 * Parcourt les lignes : une fonction est documentée si un bloc JSDoc se ferme dans les 3 lignes
 * qui la précèdent
 * @param {string[]} lines
 * @param {object} fileInfo
 */
function scanFunctions(lines, fileInfo) {
  let isInJSDoc = false;
  let lastJSDocLine = -1;
  lines.forEach((line, index) => {
    // Détecter début/fin JSDoc
    if (JSDOC_START_REGEX.test(line)) {
      isInJSDoc = true;
    } else if (isInJSDoc) {
      if (line.includes('*/')) {
        isInJSDoc = false;
        lastJSDocLine = index;
      }
    } else {
      const isDocumented = lastJSDocLine >= 0 && index - lastJSDocLine <= 3;
      recordFunction(fileInfo, { name: declaredFunctionName(line), index, isDocumented });
    }
  });
}

/**
 * Part des fonctions documentées, en % ; sans fonction, 100 si le module est documenté
 * @param {{totalFunctions: number, documentedFunctions: number, hasModuleDoc: boolean}} fileInfo
 * @returns {number}
 */
function documentationQuality({ totalFunctions, documentedFunctions, hasModuleDoc }) {
  if (totalFunctions > 0) return Math.round((documentedFunctions / totalFunctions) * 100);
  return hasModuleDoc ? 100 : 0;
}

class JSDocAnalyzer {
  constructor() {
    this.stats = {
      totalFiles: 0,
      documentedFiles: 0,
      totalFunctions: 0,
      documentedFunctions: 0,
      fileDetails: [],
    };
  }

  /**
   * Analyser tous les fichiers JS du projet
   */
  analyzeProject() {
    console.log('🔍 Analyse de la documentation JSDoc...\n');

    this.analyzeDirectory('js');
    this.generateReport();
    this.generateImprovementPlan();
  }

  /**
   * Analyser un répertoire récursivement
   * @param {string} dirPath
   */
  analyzeDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        this.analyzeDirectory(fullPath);
      } else if (item.endsWith('.js')) {
        this.analyzeFile(fullPath);
      }
    }
  }

  /**
   * Analyser un fichier JS spécifique
   * @param {string} filePath
   */
  analyzeFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    const fileInfo = {
      path: filePath,
      totalFunctions: 0,
      documentedFunctions: 0,
      undocumentedFunctions: [],
      // Documentation de module : un bloc JSDoc dans les 10 premières lignes
      hasModuleDoc:
        content.includes('/**') && lines.slice(0, 10).some(line => line.includes('/**')),
      quality: 0,
    };

    scanFunctions(lines, fileInfo);
    fileInfo.quality = documentationQuality(fileInfo);
    this.recordFile(fileInfo);
  }

  /**
   * Ajouter un fichier analysé aux statistiques du projet
   * @param {object} fileInfo
   */
  recordFile(fileInfo) {
    this.stats.totalFiles++;
    this.stats.totalFunctions += fileInfo.totalFunctions;
    this.stats.documentedFunctions += fileInfo.documentedFunctions;

    if (fileInfo.quality > 50 || fileInfo.hasModuleDoc) {
      this.stats.documentedFiles++;
    }

    this.stats.fileDetails.push(fileInfo);
  }

  /**
   * Générer le rapport d'analyse
   */
  generateReport() {
    console.log('📊 RÉSULTATS ANALYSE JSDOC\n');

    const filesCoverage = Math.round((this.stats.documentedFiles / this.stats.totalFiles) * 100);
    const funcCoverage =
      this.stats.totalFunctions > 0
        ? Math.round((this.stats.documentedFunctions / this.stats.totalFunctions) * 100)
        : 0;

    console.log(`📁 Fichiers analysés : ${this.stats.totalFiles}`);
    console.log(`📚 Fichiers documentés : ${this.stats.documentedFiles} (${filesCoverage}%)`);
    console.log(`⚙️  Fonctions trouvées : ${this.stats.totalFunctions}`);
    console.log(
      `✅ Fonctions documentées : ${this.stats.documentedFunctions} (${funcCoverage}%)\n`
    );

    // Score global
    const globalScore = Math.round((filesCoverage + funcCoverage) / 2);
    console.log(`🎯 SCORE DOCUMENTATION : ${globalScore}/100`);

    if (globalScore >= 80) console.log('✅ Excellent niveau de documentation');
    else if (globalScore >= 60) console.log('⚠️  Niveau correct, améliorations possibles');
    else console.log('🚨 Documentation insuffisante, intervention nécessaire');

    console.log('\n📋 TOP 10 FICHIERS À DOCUMENTER :\n');

    const filesByPriority = this.stats.fileDetails
      .filter(f => f.totalFunctions > 0 && f.quality < 80)
      .sort((a, b) => b.totalFunctions - a.totalFunctions)
      .slice(0, 10);

    filesByPriority.forEach((file, i) => {
      console.log(
        `${i + 1}. ${file.path} - ${file.quality}% (${file.documentedFunctions}/${file.totalFunctions})`
      );
    });

    // Sauvegarder rapport détaillé
    const reportPath = 'analysis/jsdoc-analysis.json';
    if (!fs.existsSync('analysis')) {
      fs.mkdirSync('analysis', { recursive: true });
    }

    fs.writeFileSync(
      reportPath,
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          summary: {
            globalScore,
            filesCoverage,
            funcCoverage,
            totalFiles: this.stats.totalFiles,
            totalFunctions: this.stats.totalFunctions,
          },
          files: this.stats.fileDetails,
        },
        null,
        2
      )
    );

    console.log(`\n📄 Rapport détaillé sauvegardé : ${reportPath}`);
  }

  /**
   * Générer plan d'amélioration
   */
  generateImprovementPlan() {
    console.log("\n🛠️  PLAN D'AMÉLIORATION :\n");

    // Modules core prioritaires
    const coreFiles = this.stats.fileDetails.filter(
      f => f.path.includes('js/core/') && f.quality < 90
    );

    if (coreFiles.length > 0) {
      console.log('📦 1. MODULES CORE (priorité haute) :');
      coreFiles.forEach(file => {
        console.log(
          `   - ${file.path} : ${file.undocumentedFunctions.length} fonctions à documenter`
        );
      });
      console.log('');
    }

    // Composants UI
    const componentFiles = this.stats.fileDetails.filter(
      f => f.path.includes('js/components/') && f.quality < 90
    );

    if (componentFiles.length > 0) {
      console.log('🖼️  2. COMPOSANTS UI (priorité moyenne) :');
      componentFiles.forEach(file => {
        console.log(
          `   - ${file.path} : ${file.undocumentedFunctions.length} fonctions à documenter`
        );
      });
      console.log('');
    }

    // Modes de jeu
    const modeFiles = this.stats.fileDetails.filter(
      f =>
        (f.path.includes('js/modes/') ||
          f.path.includes('quiz.js') ||
          f.path.includes('adventure.js')) &&
        f.quality < 90
    );

    if (modeFiles.length > 0) {
      console.log('🎮 3. MODES DE JEU (priorité moyenne) :');
      modeFiles.forEach(file => {
        console.log(
          `   - ${file.path} : ${file.undocumentedFunctions.length} fonctions à documenter`
        );
      });
      console.log('');
    }

    console.log('🎯 RECOMMANDATIONS :');
    console.log('1. Commencer par les modules core (impact élevé)');
    console.log('2. Ajouter JSDoc aux fonctions publiques en priorité');
    console.log('3. Documenter les paramètres et valeurs de retour');
    console.log("4. Ajouter exemples d'usage pour les APIs principales");
  }
}

// Exécution
if (require.main === module) {
  const analyzer = new JSDocAnalyzer();
  analyzer.analyzeProject();
}

module.exports = JSDocAnalyzer;
