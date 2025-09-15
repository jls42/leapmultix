#!/usr/bin/env node

/**
 * Script d'amélioration automatique de la documentation JSDoc
 * Phase 9.1 - Amélioration ciblée modules core
 */

const fs = require('fs');
const path = require('path');

class JSDocImprover {
  constructor() {
    this.improvements = 0;
    this.processedFiles = [];
  }

  /**
   * Améliorer la documentation des modules core prioritaires
   */
  improveCore() {
    console.log('🚀 Amélioration automatique JSDoc - Modules Core\n');

    const coreFiles = [
      'js/core/audio.js',
      'js/core/storage.js',
      'js/core/utils.js',
      'js/userManager.js',
    ];

    coreFiles.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        this.processFile(filePath);
      }
    });

    this.generateSummary();
  }

  /**
   * Améliorer la documentation des composants UI et modules étendus
   */
  improveExtended() {
    console.log('🚀 Amélioration automatique JSDoc - Phase 9.2 Étendue\n');

    const extendedFiles = [
      // Composants UI prioritaires
      'js/components/customization.js',
      'js/components/dashboard.js',
      'js/components/infoBar.js',
      'js/components/topBar.js',

      // Modules core étendus
      'js/core/GameMode.js',
      'js/core/GameModeManager.js',

      // Modules utils et main
      'js/utils.js',
      'js/main.js',

      // Modes de jeu sélectionnés
      'js/modes/ArcadeMode.js',
      'js/modes/ChallengeMode.js',
    ];

    extendedFiles.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        this.processFile(filePath);
      }
    });

    this.generateSummary();
  }

  /**
   * Traiter un fichier spécifique
   * @param {string} filePath
   */
  processFile(filePath) {
    console.log(`📄 Amélioration : ${filePath}`);

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const improvedLines = [];

    let functionsImproved = 0;
    let isInJSDoc = false;
    let lastJSDocEnd = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Détecter JSDoc existante
      if (line.trim().startsWith('/**')) {
        isInJSDoc = true;
      }
      if (isInJSDoc && line.includes('*/')) {
        isInJSDoc = false;
        lastJSDocEnd = i;
      }

      // Détecter fonctions sans documentation
      if (!isInJSDoc && this.isFunctionLine(line)) {
        const functionName = this.extractFunctionName(line);

        if (functionName && !functionName.startsWith('_') && i - lastJSDocEnd > 3) {
          // Ajouter JSDoc automatique
          const jsDoc = this.generateJSDoc(functionName, line);
          improvedLines.push(...jsDoc);
          functionsImproved++;
        }
      }

      improvedLines.push(line);
    }

    if (functionsImproved > 0) {
      // Sauvegarder fichier amélioré
      fs.writeFileSync(filePath, improvedLines.join('\n'));
      console.log(`  ✅ ${functionsImproved} fonctions documentées`);

      this.improvements += functionsImproved;
      this.processedFiles.push({
        path: filePath,
        improvements: functionsImproved,
      });
    } else {
      console.log(`  ℹ️  Déjà bien documenté`);
    }
  }

  /**
   * Vérifier si une ligne contient une fonction
   * @param {string} line
   * @returns {boolean}
   */
  isFunctionLine(line) {
    const patterns = [
      /^\s*function\s+\w+/, // function name()
      /^\s*\w+\s*[:=]\s*function/, // name: function() ou name = function()
      /^\s*\w+\s*\([^)]*\)\s*\{/, // name() { (méthode objet)
      /^\s*\w+\s*:\s*\([^)]*\)\s*=>/, // name: () =>
    ];

    return patterns.some(pattern => pattern.test(line));
  }

  /**
   * Extraire le nom de la fonction
   * @param {string} line
   * @returns {string|null}
   */
  extractFunctionName(line) {
    const patterns = [/function\s+(\w+)/, /(\w+)\s*[:=]\s*function/, /(\w+)\s*\(/, /(\w+)\s*:/];

    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  /**
   * Générer JSDoc automatique basique
   * @param {string} functionName
   * @param {string} functionLine
   * @returns {string[]}
   */
  generateJSDoc(functionName, functionLine) {
    const jsDoc = ['    /**', `     * ${this.generateDescription(functionName)}`];

    // Détecter paramètres basiques
    const paramMatch = functionLine.match(/\(([^)]+)\)/);
    if (paramMatch && paramMatch[1].trim()) {
      const params = paramMatch[1]
        .split(',')
        .map(p => p.trim().split(/\s+/)[0])
        .filter(p => p && !p.includes('='));

      params.forEach(param => {
        jsDoc.push(`     * @param {*} ${param} - Description du paramètre`);
      });
    }

    // Ajouter return si pas constructor/init
    if (!['constructor', 'init', 'setup'].includes(functionName)) {
      jsDoc.push('     * @returns {*} Description du retour');
    }

    jsDoc.push('     */');
    return jsDoc;
  }

  /**
   * Générer description automatique basée sur le nom
   * @param {string} functionName
   * @returns {string}
   */
  generateDescription(functionName) {
    const descriptions = {
      init: 'Initialiser le composant',
      setup: 'Configurer le composant',
      start: 'Démarrer le processus',
      stop: 'Arrêter le processus',
      pause: 'Mettre en pause',
      resume: 'Reprendre',
      update: 'Mettre à jour',
      render: 'Effectuer le rendu',
      load: 'Charger les données',
      save: 'Sauvegarder les données',
      get: 'Récupérer une valeur',
      set: 'Définir une valeur',
      add: 'Ajouter un élément',
      remove: 'Supprimer un élément',
      create: 'Créer un nouvel élément',
      delete: 'Supprimer définitivement',
      validate: 'Valider les données',
      generate: 'Générer du contenu',
      calculate: 'Calculer une valeur',
      format: 'Formater les données',
      parse: 'Analyser les données',
      handle: 'Gérer un événement',
    };

    // Chercher correspondance par préfixe
    for (const [prefix, desc] of Object.entries(descriptions)) {
      if (functionName.toLowerCase().startsWith(prefix)) {
        return desc;
      }
    }

    // Description générique
    return `Fonction ${functionName}`;
  }

  /**
   * Générer résumé des améliorations
   */
  generateSummary() {
    console.log('\n📋 RÉSUMÉ AMÉLIORATIONS JSDoc');
    console.log('─'.repeat(40));
    console.log(`✅ Total améliorations : ${this.improvements} fonctions`);
    console.log(`📁 Fichiers traités : ${this.processedFiles.length}`);

    if (this.processedFiles.length > 0) {
      console.log('\n📄 Détail par fichier :');
      this.processedFiles.forEach(file => {
        console.log(`  • ${file.path} : +${file.improvements} JSDoc`);
      });
    }

    console.log('\n🎯 PROCHAINES ÉTAPES :');
    console.log('1. Vérifier la qualité des JSDoc générées');
    console.log('2. Personnaliser les descriptions génériques');
    console.log("3. Ajouter exemples d'usage si nécessaire");
    console.log('4. Exécuter nouvelle analyse : npm run analyze:jsdoc');
  }
}

// Exécution
if (require.main === module) {
  const improver = new JSDocImprover();

  // Vérifier arguments ligne de commande
  const args = process.argv.slice(2);

  if (args.includes('--extended') || args.includes('-e')) {
    improver.improveExtended();
  } else {
    improver.improveCore();
  }
}

module.exports = JSDocImprover;
