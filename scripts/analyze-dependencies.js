#!/usr/bin/env node

/**
 * Script d'analyse des dépendances LeapMultix
 * Analyse les fonctions globales et leurs utilisations
 */

import fs from 'node:fs';
import path from 'node:path';

const JS_DIR = './js';
const ANALYSIS_OUTPUT = './analysis';

// Définitions de premier niveau : `function nom`, ou `const|let|var nom = function` ou `= (…) =>`
const FUNCTION_DECLARATION = /^function\s+(\w+)/gm;
const FUNCTION_EXPRESSION = /^(?:const|let|var)\s+(\w+)\s*=\s*(?:function|\(.*?\)\s*=>)/gm;

/**
 * Première définition de fonction à partir de `from` : la plus à gauche des deux formes, comme
 * l'expression unique qu'elles remplacent (S5843). La recherche suivante repart de sa fin.
 * @param {string} content
 * @param {number} from
 * @returns {RegExpExecArray|null}
 */
function nextFunctionDefinition(content, from) {
  FUNCTION_DECLARATION.lastIndex = from;
  FUNCTION_EXPRESSION.lastIndex = from;
  const declaration = FUNCTION_DECLARATION.exec(content);
  const expression = FUNCTION_EXPRESSION.exec(content);
  if (!declaration) return expression;
  if (!expression) return declaration;
  return expression.index < declaration.index ? expression : declaration;
}

/**
 * Fichiers du plus long au plus court, en liste Markdown. Le tri reste fait sur place (S4043 :
 * dans une instruction à part), au même moment qu'avant : après l'écriture du rapport JSON.
 * @param {{name: string, lines: number}[]} files
 * @returns {string}
 */
function filesBySizeMarkdown(files) {
  files.sort((a, b) => b.lines - a.lines);
  return files.map(f => `- **${f.name}**: ${f.lines} lignes`).join('\n');
}

// Créer le dossier d'analyse s'il n'existe pas
if (!fs.existsSync(ANALYSIS_OUTPUT)) {
  fs.mkdirSync(ANALYSIS_OUTPUT, { recursive: true });
}

class DependencyAnalyzer {
  constructor() {
    this.files = [];
    this.globalFunctions = new Map();
    this.globalVariables = new Map();
    this.functionUsages = new Map();
    this.variableUsages = new Map();
  }

  // Lire tous les fichiers JS
  readJSFiles() {
    const files = fs.readdirSync(JS_DIR).filter(file => file.endsWith('.js'));

    for (const file of files) {
      const filePath = path.join(JS_DIR, file);
      // eslint-disable-next-line security/detect-non-literal-fs-filename -- filePath is constructed from JS_DIR and verified .js file
      const content = fs.readFileSync(filePath, 'utf8');

      this.files.push({
        name: file,
        path: filePath,
        content: content,
        lines: content.split('\n'),
      });
    }

    console.log(`📁 Analysé ${this.files.length} fichiers JavaScript`);
  }

  // Extraire les fonctions globales
  extractGlobalFunctions() {
    for (const file of this.files) {
      for (
        let match = nextFunctionDefinition(file.content, 0);
        match !== null;
        match = nextFunctionDefinition(file.content, match.index + match[0].length)
      ) {
        const funcName = match[1];
        if (funcName) {
          if (!this.globalFunctions.has(funcName)) {
            this.globalFunctions.set(funcName, []);
          }
          this.globalFunctions.get(funcName).push({
            file: file.name,
            line: file.content.substring(0, match.index).split('\n').length,
          });
        }
      }
    }

    console.log(`🔧 Trouvé ${this.globalFunctions.size} fonctions globales`);
  }

  // Extraire les variables globales
  extractGlobalVariables() {
    const varRegex = /^(?:const|let|var)\s+(\w+)\s*=/gm;

    for (const file of this.files) {
      let match;
      while ((match = varRegex.exec(file.content)) !== null) {
        const varName = match[1];
        if (varName && !this.globalFunctions.has(varName)) {
          if (!this.globalVariables.has(varName)) {
            this.globalVariables.set(varName, []);
          }
          this.globalVariables.get(varName).push({
            file: file.name,
            line: file.content.substring(0, match.index).split('\n').length,
          });
        }
      }
    }

    console.log(`📊 Trouvé ${this.globalVariables.size} variables globales`);
  }

  // Analyser l'utilisation des fonctions
  analyzeFunctionUsages() {
    for (const [funcName] of this.globalFunctions) {
      this.functionUsages.set(funcName, []);

      for (const file of this.files) {
        // eslint-disable-next-line security/detect-non-literal-regexp -- funcName is from controlled function analysis, not user input
        const usageRegex = new RegExp(String.raw`\b${funcName}\s*\(`, 'g');
        let match;
        while ((match = usageRegex.exec(file.content)) !== null) {
          this.functionUsages.get(funcName).push({
            file: file.name,
            line: file.content.substring(0, match.index).split('\n').length,
          });
        }
      }
    }
  }

  // Analyser l'utilisation des variables
  analyzeVariableUsages() {
    for (const [varName] of this.globalVariables) {
      this.variableUsages.set(varName, []);

      for (const file of this.files) {
        // eslint-disable-next-line security/detect-non-literal-regexp -- varName is from controlled variable analysis, not user input
        const usageRegex = new RegExp(String.raw`\b${varName}\b`, 'g');
        let match;
        while ((match = usageRegex.exec(file.content)) !== null) {
          this.variableUsages.get(varName).push({
            file: file.name,
            line: file.content.substring(0, match.index).split('\n').length,
          });
        }
      }
    }
  }

  // Identifier le code mort
  findDeadCode() {
    const deadFunctions = [];
    const deadVariables = [];

    for (const [funcName, usages] of this.functionUsages) {
      if (usages.length <= 1) {
        // Seulement la définition
        deadFunctions.push(funcName);
      }
    }

    for (const [varName, usages] of this.variableUsages) {
      if (usages.length <= 1) {
        // Seulement la définition
        deadVariables.push(varName);
      }
    }

    return { deadFunctions, deadVariables };
  }

  // Générer le rapport
  generateReport() {
    const deadCode = this.findDeadCode();

    const report = {
      summary: {
        totalFiles: this.files.length,
        totalFunctions: this.globalFunctions.size,
        totalVariables: this.globalVariables.size,
        deadFunctions: deadCode.deadFunctions.length,
        deadVariables: deadCode.deadVariables.length,
      },
      files: this.files.map(f => ({ name: f.name, lines: f.lines.length })),
      functions: Object.fromEntries(
        Array.from(this.globalFunctions.entries()).map(([name, defs]) => [
          name,
          {
            definitions: defs,
            usages: this.functionUsages.get(name) || [],
            isDead: deadCode.deadFunctions.includes(name),
          },
        ])
      ),
      variables: Object.fromEntries(
        Array.from(this.globalVariables.entries()).map(([name, defs]) => [
          name,
          {
            definitions: defs,
            usages: this.variableUsages.get(name) || [],
            isDead: deadCode.deadVariables.includes(name),
          },
        ])
      ),
      deadCode,
    };

    // Sauvegarder le rapport
    fs.writeFileSync(
      path.join(ANALYSIS_OUTPUT, 'dependency-analysis.json'),
      JSON.stringify(report, null, 2)
    );

    // Générer un résumé lisible
    const summary = `# 📊 Analyse des Dépendances LeapMultix

## Résumé
- **Fichiers analysés**: ${report.summary.totalFiles}
- **Fonctions globales**: ${report.summary.totalFunctions}
- **Variables globales**: ${report.summary.totalVariables}
- **Fonctions mortes**: ${report.summary.deadFunctions}
- **Variables mortes**: ${report.summary.deadVariables}

## Code Mort Identifié

### Fonctions non utilisées (${deadCode.deadFunctions.length})
${deadCode.deadFunctions.map(f => `- \`${f}\``).join('\n')}

### Variables non utilisées (${deadCode.deadVariables.length})
${deadCode.deadVariables.map(v => `- \`${v}\``).join('\n')}

## Fichiers par taille
${filesBySizeMarkdown(report.files)}

---
*Généré le ${new Date().toISOString()}*
`;

    fs.writeFileSync(path.join(ANALYSIS_OUTPUT, 'summary.md'), summary);

    console.log(`📋 Rapport généré dans ${ANALYSIS_OUTPUT}/`);
    console.log(
      `🗑️  Code mort: ${deadCode.deadFunctions.length} fonctions, ${deadCode.deadVariables.length} variables`
    );

    return report;
  }

  // Exécuter l'analyse complète
  analyze() {
    console.log("🔍 Début de l'analyse des dépendances...");

    this.readJSFiles();
    this.extractGlobalFunctions();
    this.extractGlobalVariables();
    this.analyzeFunctionUsages();
    this.analyzeVariableUsages();

    return this.generateReport();
  }
}

// Exécuter l'analyse
const analyzer = new DependencyAnalyzer();
analyzer.analyze();
