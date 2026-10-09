#!/usr/bin/env node

/**
 * Script d'analyse de la documentation JSDoc
 * Phase 9.1 - Documentation du Code
 */

const fs = require('node:fs');
const path = require('node:path');

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
      hasModuleDoc: false,
      quality: 0,
    };

    // Vérifier si le fichier a une documentation de module
    if (content.includes('/**') && lines.slice(0, 10).some(line => line.includes('/**'))) {
      fileInfo.hasModuleDoc = true;
    }

    // Trouver toutes les fonctions
    const functionRegex =
      /^\s*(function\s+(\w+)|(\w+)\s*[:=]\s*function|(\w+)\s*\(\s*.*?\s*\)\s*\{|(\w+)\s*:\s*\(\s*.*?\s*\)\s*=>)/;
    const classMethodRegex = /^\s*(\w+)\s*\([^)]*\)\s*\{/;
    const jsdocRegex = /^\s*\/\*\*/;

    let isInJSDoc = false;
    let lastJSDocLine = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Détecter début/fin JSDoc
      if (jsdocRegex.test(line)) {
        isInJSDoc = true;
        continue;
      }
      if (isInJSDoc && line.includes('*/')) {
        isInJSDoc = false;
        lastJSDocLine = i;
        continue;
      }
      if (isInJSDoc) continue;

      // Détecter fonctions
      const funcMatch = line.match(functionRegex);
      const methodMatch = line.match(classMethodRegex);

      if (funcMatch || methodMatch) {
        const functionName = funcMatch
          ? funcMatch[2] || funcMatch[3] || funcMatch[4] || funcMatch[5]
          : methodMatch[1];

        if (functionName && !functionName.startsWith('_') && functionName !== 'constructor') {
          fileInfo.totalFunctions++;

          // Vérifier si documentée (JSDoc dans les 3 lignes précédentes)
          const isDocumented = lastJSDocLine >= 0 && i - lastJSDocLine <= 3;

          if (isDocumented) {
            fileInfo.documentedFunctions++;
          } else {
            fileInfo.undocumentedFunctions.push({
              name: functionName,
              line: i + 1,
            });
          }
        }
      }
    }

    // Calculer qualité
    if (fileInfo.totalFunctions > 0) {
      fileInfo.quality = Math.round((fileInfo.documentedFunctions / fileInfo.totalFunctions) * 100);
    } else {
      fileInfo.quality = fileInfo.hasModuleDoc ? 100 : 0;
    }

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
