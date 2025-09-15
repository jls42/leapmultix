#!/usr/bin/env node

/**
 * Script d'analyse des commentaires LeapMultix
 * Identifie les commentaires obsolètes, les TODO, et les commentaires à nettoyer
 */

import fs from 'fs';
import path from 'path';

const JS_DIR = './js';
const ANALYSIS_OUTPUT = './analysis';

class CommentAnalyzer {
  constructor() {
    this.files = [];
    this.todos = [];
    this.obsoleteComments = [];
    this.debugComments = [];
    this.unusualComments = [];
  }

  readFiles() {
    const files = fs.readdirSync(JS_DIR).filter(file => file.endsWith('.js'));

    for (const file of files) {
      const filePath = path.join(JS_DIR, file);
      // eslint-disable-next-line -- filePath is constructed from JS_DIR and verified .js file
      const content = fs.readFileSync(filePath, 'utf8');
      this.files.push({
        name: file,
        path: filePath,
        content: content,
        lines: content.split('\n'),
      });
    }

    console.log(`📁 Analysé ${this.files.length} fichiers pour commentaires`);
  }

  analyzeComments() {
    const obsoletePatterns = [
      /console\.log.*commenté/i,
      /TODO.*supprimé/i,
      /deprecated/i,
      /ancienne version/i,
      /plus utilisé/i,
      /obsolète/i,
      /vieux code/i,
      /temporaire/i,
      /FIXME.*résolu/i,
      /hack.*remplacé/i,
    ];

    const debugPatterns = [
      /console\.log.*debug/i,
      /console\.log.*test/i,
      /alert.*debug/i,
      /alert.*test/i,
      /debugger/i,
    ];

    const todoPatterns = [/TODO/i, /FIXME/i, /XXX/i, /HACK/i, /NOTE/i, /BUG/i];

    for (const file of this.files) {
      file.lines.forEach((line, index) => {
        const trimmed = line.trim();

        // Ignorer les lignes vides
        if (!trimmed) return;

        // Analyser seulement les commentaires
        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
          const lineInfo = {
            file: file.name,
            line: index + 1,
            content: trimmed,
          };

          // Chercher TODO/FIXME
          todoPatterns.forEach(pattern => {
            if (pattern.test(trimmed)) {
              this.todos.push({ ...lineInfo, type: pattern.source });
            }
          });

          // Chercher commentaires obsolètes
          obsoletePatterns.forEach(pattern => {
            if (pattern.test(trimmed)) {
              this.obsoleteComments.push({ ...lineInfo, pattern: pattern.source });
            }
          });

          // Chercher debug comments
          debugPatterns.forEach(pattern => {
            if (pattern.test(trimmed)) {
              this.debugComments.push({ ...lineInfo, pattern: pattern.source });
            }
          });

          // Chercher commentaires inhabituels (très longs, répétitifs, etc.)
          if (trimmed.length > 120) {
            this.unusualComments.push({ ...lineInfo, reason: 'Très long' });
          }

          if (/={10,}|={5,}-{5,}|\*{10,}/.test(trimmed)) {
            this.unusualComments.push({ ...lineInfo, reason: 'Séparateur décoratif' });
          }
        }
      });
    }
  }

  generateReport() {
    const report = {
      summary: {
        totalFiles: this.files.length,
        todoCount: this.todos.length,
        obsoleteCount: this.obsoleteComments.length,
        debugCount: this.debugComments.length,
        unusualCount: this.unusualComments.length,
      },
      todos: this.todos,
      obsoleteComments: this.obsoleteComments,
      debugComments: this.debugComments,
      unusualComments: this.unusualComments,
    };

    // Créer le dossier d'analyse s'il n'existe pas
    if (!fs.existsSync(ANALYSIS_OUTPUT)) {
      fs.mkdirSync(ANALYSIS_OUTPUT, { recursive: true });
    }

    // Sauvegarder le rapport JSON
    fs.writeFileSync(
      path.join(ANALYSIS_OUTPUT, 'comments-analysis.json'),
      JSON.stringify(report, null, 2)
    );

    // Générer résumé markdown
    const summary = `# 📝 Analyse des Commentaires LeapMultix

## Résumé
- **Fichiers analysés**: ${report.summary.totalFiles}
- **TODO/FIXME trouvés**: ${report.summary.todoCount}
- **Commentaires obsolètes**: ${report.summary.obsoleteCount}
- **Commentaires de debug**: ${report.summary.debugCount}
- **Commentaires inhabituels**: ${report.summary.unusualCount}

## TODO et FIXME (${this.todos.length})
${this.todos.map(todo => `- **${todo.file}:${todo.line}** [${todo.type}] ${todo.content}`).join('\n')}

## Commentaires potentiellement obsolètes (${this.obsoleteComments.length})
${this.obsoleteComments.map(c => `- **${c.file}:${c.line}** ${c.content}`).join('\n')}

## Commentaires de debug à nettoyer (${this.debugComments.length})
${this.debugComments.map(c => `- **${c.file}:${c.line}** ${c.content}`).join('\n')}

## Commentaires inhabituels (${this.unusualComments.length})
${this.unusualComments.map(c => `- **${c.file}:${c.line}** [${c.reason}] ${c.content}`).join('\n')}

---
*Généré le ${new Date().toISOString()}*
`;

    fs.writeFileSync(path.join(ANALYSIS_OUTPUT, 'comments-summary.md'), summary);

    console.log(`📋 Analyse des commentaires terminée:`);
    console.log(`   TODO/FIXME: ${report.summary.todoCount}`);
    console.log(`   Obsolètes: ${report.summary.obsoleteCount}`);
    console.log(`   Debug: ${report.summary.debugCount}`);
    console.log(`   Inhabituels: ${report.summary.unusualCount}`);

    return report;
  }

  analyze() {
    console.log('📝 Analyse des commentaires...');
    this.readFiles();
    this.analyzeComments();
    return this.generateReport();
  }
}

// Exécuter l'analyse
const analyzer = new CommentAnalyzer();
analyzer.analyze();
