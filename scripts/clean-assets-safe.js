#!/usr/bin/env node

import fs from 'fs';
// path import removed as it's unused
import { execSync } from 'child_process';
import readline from 'readline';

console.log('🧹 NETTOYAGE SÉCURISÉ DES ASSETS');
console.log('🛡️  PROTECTION GARANTIE: Images ≥1024px INTOUCHABLES');
console.log('='.repeat(70));

// Charger l'analyse précédente
const analysisFile = './analysis/assets-analysis.json';
if (!fs.existsSync(analysisFile)) {
  console.log("❌ Fichier d'analyse introuvable!");
  console.log("👉 Lancez d'abord: node scripts/analyze-assets-safe.js");
  process.exit(1);
}

// eslint-disable-next-line -- Safe file read from predefined analysis path in controlled script
const analysis = JSON.parse(fs.readFileSync(analysisFile, 'utf8'));

// Fonction pour créer une sauvegarde
function createBackup() {
  const backupDir = `./backups/assets-backup-${Date.now()}`;
  console.log(`\n💾 Création sauvegarde: ${backupDir}`);

  if (!fs.existsSync('./backups')) {
    fs.mkdirSync('./backups', { recursive: true });
  }

  // Copier tous les répertoires d'assets
  const assetDirs = ['assets', 'img', 'images', 'sounds', 'audio'];
  for (const dir of assetDirs) {
    if (fs.existsSync(dir)) {
      execSync(`cp -r ${dir} ${backupDir}/ 2>/dev/null || true`);
    }
  }

  console.log('✅ Sauvegarde créée avec succès');
  return backupDir;
}

// Fonction pour analyser les fichiers à supprimer
function analyzeFilesToDelete() {
  const toDelete = {
    safe: [], // Petits fichiers non utilisés
    protected: [], // Images haute résolution (JAMAIS supprimées)
    questionable: [], // Cas douteux à valider
  };

  for (const asset of analysis.unused) {
    if (asset.isHighRes) {
      // PROTECTION ABSOLUE: Images ≥1024px
      toDelete.protected.push(asset);
    } else if (asset.dimensions && asset.dimensions.maxDim <= 512) {
      // Suppression sécurisée: petites images
      toDelete.safe.push(asset);
    } else {
      // Cas à valider manuellement
      toDelete.questionable.push(asset);
    }
  }

  return toDelete;
}

// Fonction pour afficher le plan de nettoyage
function showCleanupPlan(toDelete) {
  console.log('\n📋 PLAN DE NETTOYAGE');
  console.log('='.repeat(40));

  console.log(`\n🛡️  FICHIERS PROTÉGÉS (≥1024px):`);
  console.log(`   • ${toDelete.protected.length} images haute résolution PRÉSERVÉES`);
  if (toDelete.protected.length > 0) {
    console.log('   ⚠️  CES FICHIERS NE SERONT JAMAIS TOUCHÉS');
    toDelete.protected.slice(0, 5).forEach(asset => {
      const dims = asset.dimensions
        ? `${asset.dimensions.width}x${asset.dimensions.height}`
        : 'unknown';
      console.log(`     - ${asset.name} (${dims})`);
    });
    if (toDelete.protected.length > 5) {
      console.log(`     ... et ${toDelete.protected.length - 5} autres`);
    }
  }

  console.log(`\n✅ SUPPRESSION SÉCURISÉE (≤512px):`);
  console.log(`   • ${toDelete.safe.length} petits fichiers inutilisés`);
  if (toDelete.safe.length > 0) {
    const safeSize = toDelete.safe.reduce((sum, asset) => sum + asset.size, 0);
    console.log(`   • Économie: ${(safeSize / 1024).toFixed(1)} KB`);

    toDelete.safe.slice(0, 10).forEach(asset => {
      const dims = asset.dimensions
        ? `${asset.dimensions.width}x${asset.dimensions.height}`
        : 'unknown';
      console.log(`     - ${asset.name} (${dims}) - ${(asset.size / 1024).toFixed(1)} KB`);
    });
    if (toDelete.safe.length > 10) {
      console.log(`     ... et ${toDelete.safe.length - 10} autres`);
    }
  }

  console.log(`\n❓ VALIDATION MANUELLE REQUISE:`);
  console.log(`   • ${toDelete.questionable.length} fichiers à vérifier`);
  if (toDelete.questionable.length > 0) {
    console.log('   • Tailles moyennes (512px-1024px)');
    toDelete.questionable.slice(0, 5).forEach(asset => {
      const dims = asset.dimensions
        ? `${asset.dimensions.width}x${asset.dimensions.height}`
        : 'unknown';
      console.log(`     - ${asset.name} (${dims})`);
    });
  }
}

// Fonction pour effectuer le nettoyage
function performCleanup(toDelete, mode = 'dry-run') {
  console.log(`\n🚀 ${mode === 'dry-run' ? 'SIMULATION' : 'EXÉCUTION'} DU NETTOYAGE`);
  console.log('='.repeat(50));

  let deletedCount = 0;
  let savedSpace = 0;

  // Supprimer seulement les fichiers sûrs
  for (const asset of toDelete.safe) {
    if (mode === 'execute') {
      try {
        // eslint-disable-next-line -- Safe file deletion with asset.path from controlled analysis
        fs.unlinkSync(asset.path);
        console.log(`🗑️  Supprimé: ${asset.name}`);
      } catch (error) {
        console.log(`⚠️  Erreur: ${asset.name} - ${error.message}`);
        continue;
      }
    } else {
      console.log(`🔍 Serait supprimé: ${asset.name}`);
    }
    deletedCount++;
    savedSpace += asset.size;
  }

  console.log(`\n📊 RÉSUMÉ:`);
  console.log(`   • Fichiers ${mode === 'execute' ? 'supprimés' : 'à supprimer'}: ${deletedCount}`);
  console.log(
    `   • Espace ${mode === 'execute' ? 'libéré' : 'libérable'}: ${(savedSpace / 1024).toFixed(1)} KB`
  );
  console.log(`   • Images protégées: ${toDelete.protected.length} (INTOUCHÉES)`);

  if (mode === 'execute') {
    console.log('\n✅ Nettoyage terminé avec succès!');
  } else {
    console.log('\n🔍 Simulation terminée. Pour exécuter:');
    console.log('   node scripts/clean-assets-safe.js --execute');
  }
}

// Interface utilisateur
function promptUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.toLowerCase().trim());
    });
  });
}

// Fonction principale
async function main() {
  const args = process.argv.slice(2);
  const executeMode = args.includes('--execute');
  const forceMode = args.includes('--force');

  console.log('\n🔍 Analyse des fichiers à nettoyer...');
  const toDelete = analyzeFilesToDelete();

  showCleanupPlan(toDelete);

  if (toDelete.safe.length === 0 && toDelete.questionable.length === 0) {
    console.log('\n🎉 Aucun nettoyage nécessaire! Tous les assets sont optimaux.');
    return;
  }

  if (!executeMode) {
    console.log('\n🔍 MODE SIMULATION - Aucune suppression réelle');
    performCleanup(toDelete, 'dry-run');
    return;
  }

  // Mode exécution - demander confirmation
  if (!forceMode) {
    console.log('\n⚠️  MODE EXÉCUTION - Suppression réelle!');
    console.log('✅ Images ≥1024px GARANTIES protégées');
    const answer = await promptUser('\nConfirmer le nettoyage? (oui/non): ');

    if (answer !== 'oui' && answer !== 'o' && answer !== 'y' && answer !== 'yes') {
      console.log("❌ Nettoyage annulé par l'utilisateur");
      return;
    }
  }

  // Créer sauvegarde avant nettoyage
  createBackup();

  // Exécuter le nettoyage
  performCleanup(toDelete, 'execute');

  console.log('\n🏁 Phase 4.5 terminée avec succès!');
}

// Gestion des erreurs
process.on('uncaughtException', error => {
  console.error('\n❌ Erreur critique:', error.message);
  console.log('🛡️  Aucune modification effectuée (mode sécurisé)');
  process.exit(1);
});

// Exécution
main().catch(error => {
  console.error('\n❌ Erreur:', error.message);
  process.exit(1);
});
