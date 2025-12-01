/**
 * Migration des statistiques localStorage vers le nouveau format multi-opérations
 *
 * CONTEXTE:
 * - Ancien format: localStorage.multiplicationStats = {"3x5": {attempts: 12, errors: 2}}
 * - Nouveau format: localStorage.operationStats = {"3×5": {operator: "×", a: 3, b: 5, attempts: 12, errors: 2}}
 *
 * ARCHITECTURE PROPRE:
 * - Migration CONTINUE : tourne à chaque démarrage pendant toute la période de transition
 * - Ne supprime JAMAIS les anciennes données pendant 90 jours minimum
 * - Migration idempotente (peut tourner 1000 fois sans danger)
 * - Protection multi-device : détecte et migre nouvelles données sur ancien format
 * - Suppression automatique seulement après période de sécurité validée
 */

import Storage from './storage.js';

// Durée minimale de conservation après PREMIÈRE migration (90 jours)
const RETENTION_DAYS = 90;

// Délai d'inactivité sur ancien format avant suppression (30 jours)
const INACTIVITY_THRESHOLD_DAYS = 30;

/**
 * Vérifie si l'utilisateur a besoin d'une migration
 * Migration continue : retourne true tant qu'anciennes données existent
 * @returns {boolean}
 */
export function needsMigration() {
  const oldStats = Storage.get('multiplicationStats');
  // Migration nécessaire si anciennes données présentes (peu importe le flag)
  return oldStats && typeof oldStats === 'object' && Object.keys(oldStats).length > 0;
}

/**
 * Migre les anciennes stats de multiplication vers le nouveau format
 * Idempotent : peut tourner plusieurs fois sans danger
 * @returns {Object} Résultat de la migration {migrated: number, skipped: number, errors: number}
 */
export function migrateMultiplicationStats() {
  const oldStats = Storage.get('multiplicationStats') || {};
  const newStats = Storage.get('operationStats') || {};

  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  const totalOld = Object.keys(oldStats).length;
  if (totalOld === 0) {
    console.log('✓ Aucune ancienne statistique à migrer');
    return { migrated: 0, skipped: 0, errors: 0 };
  }

  console.log(`🔄 Migration continue: ${totalOld} entrées à traiter`);

  // Parcourir toutes les anciennes entrées
  Object.entries(oldStats).forEach(([key, value]) => {
    try {
      // Parse l'ancienne clé "3x5" ou "3×5"
      const match = /^(\d+)[x×](\d+)$/.exec(key);
      if (!match) {
        console.warn(`⚠️ Clé invalide ignorée: ${key}`);
        skipped++;
        return;
      }

      const table = Number.parseInt(match[1], 10);
      const num = Number.parseInt(match[2], 10);

      // Nouvelle clé avec symbole Unicode "3×5"
      const newKey = `${table}×${num}`;

      // Si déjà migré (existe dans newStats), on skip
      if (newStats[newKey]) {
        skipped++;
        return;
      }

      // Migrer l'entrée
      newStats[newKey] = {
        operator: '×',
        a: table,
        b: num,
        attempts: value.attempts || 0,
        errors: value.errors || 0,
        lastAttempt: value.lastAttempt || Date.now(),
      };

      migrated++;
    } catch (err) {
      console.error(`❌ Erreur migration de ${key}:`, err);
      errors++;
    }
  });

  // Sauvegarder les stats migrées
  if (migrated > 0) {
    Storage.set('operationStats', newStats);
    console.log(`✅ ${migrated} entrées migrées avec succès`);
  }

  if (skipped > 0) {
    console.log(`⏭️ ${skipped} entrées déjà migrées (ignorées)`);
  }

  if (errors > 0) {
    console.error(`❌ ${errors} erreurs pendant la migration`);
  }

  // Mettre à jour le flag de migration
  updateMigrationFlag(migrated, skipped, errors);

  return { migrated, skipped, errors };
}

/**
 * Met à jour le flag de migration avec timestamp et stats
 * @param {number} migrated
 * @param {number} skipped
 * @param {number} errors
 */
function updateMigrationFlag(migrated, skipped, errors) {
  const existingFlag = Storage.get('_statsMigrated');

  // Première migration : initialiser le flag avec timestamp
  if (!existingFlag?.firstMigrationDate) {
    const now = Date.now();
    Storage.set('_statsMigrated', {
      done: true,
      firstMigrationDate: now,
      lastMigrationDate: now,
      retentionUntil: now + RETENTION_DAYS * 24 * 60 * 60 * 1000,
      totalMigrated: migrated,
      totalSkipped: skipped,
      totalErrors: errors,
      migrationCount: 1,
    });
    console.log(
      `📅 Première migration enregistrée (rétention jusqu'au ${new Date(now + RETENTION_DAYS * 24 * 60 * 60 * 1000).toLocaleDateString()})`
    );
    return;
  }

  // Migration continue : mettre à jour les stats
  Storage.set('_statsMigrated', {
    ...existingFlag,
    lastMigrationDate: Date.now(),
    totalMigrated: (existingFlag.totalMigrated || 0) + migrated,
    totalSkipped: (existingFlag.totalSkipped || 0) + skipped,
    totalErrors: (existingFlag.totalErrors || 0) + errors,
    migrationCount: (existingFlag.migrationCount || 1) + 1,
  });
}

/**
 * Vérifie si les anciennes stats peuvent être supprimées en toute sécurité
 * Critères:
 * - 90 jours écoulés depuis PREMIÈRE migration
 * - ET pas de nouvelles données dans ancien format depuis 30 jours
 * @returns {boolean}
 */
export function canSafelyDeleteOldStats() {
  const migrationFlag = Storage.get('_statsMigrated');

  if (!migrationFlag?.firstMigrationDate) {
    // Pas encore de migration, ne rien supprimer
    return false;
  }

  const now = Date.now();
  const retentionPeriodElapsed = now >= (migrationFlag.retentionUntil || 0);

  if (!retentionPeriodElapsed) {
    // Période de rétention non écoulée
    return false;
  }

  // Vérifier l'inactivité sur ancien format
  const lastMigrationDate = migrationFlag.lastMigrationDate || migrationFlag.firstMigrationDate;
  const inactivityThreshold = INACTIVITY_THRESHOLD_DAYS * 24 * 60 * 60 * 1000;
  const inactiveSinceLastMigration = now - lastMigrationDate >= inactivityThreshold;

  return retentionPeriodElapsed && inactiveSinceLastMigration;
}

/**
 * Nettoie les anciennes stats si les conditions de sécurité sont remplies
 * SÉCURITÉ: Ne supprime que si période de rétention écoulée ET inactivité confirmée
 */
export function cleanupOldStatsIfSafe() {
  const migrationFlag = Storage.get('_statsMigrated');

  if (!migrationFlag?.done) {
    // Pas encore migré, ne rien supprimer
    return;
  }

  if (!canSafelyDeleteOldStats()) {
    const now = Date.now();
    const retentionUntil = migrationFlag.retentionUntil || 0;
    const daysRemaining = Math.ceil((retentionUntil - now) / (24 * 60 * 60 * 1000));

    if (daysRemaining > 0) {
      console.log(`ℹ️ Anciennes stats conservées pendant encore ${daysRemaining} jours (sécurité)`);
    } else {
      console.log('ℹ️ Anciennes stats conservées (activité récente détectée)');
    }
    return;
  }

  // Conditions remplies, suppression sécurisée
  const oldStats = Storage.get('multiplicationStats');
  if (oldStats) {
    // Backup final dans console
    console.log('📦 Backup final avant suppression:', JSON.stringify(oldStats));

    Storage.remove('multiplicationStats');
    console.log('🗑️ Anciennes stats supprimées (période de sécurité écoulée)');

    // Marquer la suppression dans le flag
    Storage.set('_statsMigrated', {
      ...migrationFlag,
      oldStatsDeleted: true,
      deletionDate: Date.now(),
    });
  }
}

/**
 * Exécute la migration automatique au démarrage de l'application
 * Migration continue pendant toute la période de transition
 * Appelé depuis mainInit.js
 */
export function autoMigrate() {
  if (!needsMigration()) {
    // Pas de migration nécessaire, mais vérifier si on peut nettoyer
    cleanupOldStatsIfSafe();
    return;
  }

  console.log('📊 Migration automatique des statistiques...');

  try {
    const result = migrateMultiplicationStats();

    if (result.errors > 0) {
      console.warn(
        `⚠️ Migration terminée avec ${result.errors} erreurs. Les anciennes données sont conservées.`
      );
    } else if (result.migrated > 0) {
      console.log(`✅ Migration réussie : ${result.migrated} entrées migrées`);
    } else {
      console.log(`✓ Aucune nouvelle donnée à migrer`);
    }

    // Vérifier si nettoyage possible
    cleanupOldStatsIfSafe();
  } catch (err) {
    console.error('❌ Erreur critique pendant la migration:', err);
    // En cas d'erreur, les anciennes données restent intactes
  }
}

/**
 * Réinitialise le flag de migration (UNIQUEMENT pour le développement/debug)
 * NE PAS UTILISER EN PRODUCTION
 */
export function resetMigrationFlag() {
  Storage.remove('_statsMigrated');
  console.log('⚠️ Flag de migration réinitialisé (DEV only)');
}
