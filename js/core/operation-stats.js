/**
 * Statistiques unifiées pour toutes les opérations arithmétiques
 *
 * Architecture R2 (migration automatique):
 * - Structure unique: operationStats avec clés "a×b", "a+b", "a−b"
 * - Migration automatique stats-migration.js convertit anciennes données au démarrage
 * - Plus de double-write (supprimé après R1)
 * - Wrappers de compatibilité conservés pour code legacy
 *
 * Format des stats:
 * {
 *   "3×5": { operator: "×", a: 3, b: 5, attempts: 10, errors: 2, lastAttempt: 1732492800000 },
 *   "7+4": { operator: "+", a: 7, b: 4, attempts: 5, errors: 0, lastAttempt: 1732493200000 },
 *   "10−3": { operator: "−", a: 10, b: 3, attempts: 8, errors: 1, lastAttempt: 1732493600000 }
 * }
 *
 * @module operation-stats
 */

import Storage from './storage.js';

// Clé de stockage pour la nouvelle structure unifiée
const OPERATION_STATS_KEY = 'operationStats';

/**
 * Enregistre le résultat d'une opération arithmétique
 *
 * Format de clé: "a×b", "7+4", "10−3"
 * Structure: { operator, a, b, attempts, errors, lastAttempt }
 *
 * @param {string} operator - Symbole opérateur (×, +, −, ÷)
 * @param {number} a - Premier opérande
 * @param {number} b - Second opérande
 * @param {boolean} isCorrect - Si la réponse était correcte
 * @returns {boolean} True si sauvegarde réussie
 *
 * @example
 * recordOperationResult('×', 3, 5, true);  // 3 × 5 correct
 * recordOperationResult('+', 7, 4, false); // 7 + 4 incorrect
 */
export function recordOperationResult(operator, a, b, isCorrect) {
  try {
    // Charger toutes les stats existantes
    const all = Storage.get(OPERATION_STATS_KEY, {}) || {};

    // Créer la clé unique: "3×5", "7+4", etc.
    const key = `${a}${operator}${b}`;

    // Initialiser si première tentative
    if (!all[key]) {
      all[key] = {
        operator,
        a,
        b,
        attempts: 0,
        errors: 0,
        lastAttempt: null,
      };
    }

    // Mettre à jour les stats
    all[key].attempts++;
    if (!isCorrect) {
      all[key].errors++;
    }
    all[key].lastAttempt = Date.now();

    // Sauvegarder
    const success = Storage.set(OPERATION_STATS_KEY, all);

    if (success) {
      console.log(
        `📊 Stats enregistrées: ${key} (${all[key].attempts} tentatives, ${all[key].errors} erreurs)`
      );
    }

    return success;
  } catch (err) {
    console.error('[operation-stats] Erreur enregistrement stats:', err);
    return false;
  }
}

/**
 * Récupère les statistiques d'une opération spécifique
 *
 * @param {string} operator - Symbole opérateur
 * @param {number} a - Premier opérande
 * @param {number} b - Second opérande
 * @returns {{ operator: string, a: number, b: number, attempts: number, errors: number, lastAttempt: number|null }}
 *
 * @example
 * const stats = getOperationStats('×', 3, 5);
 * // => { operator: '×', a: 3, b: 5, attempts: 12, errors: 2, lastAttempt: 1732492800000 }
 */
export function getOperationStats(operator, a, b) {
  try {
    const all = Storage.get(OPERATION_STATS_KEY, {}) || {};
    const key = `${a}${operator}${b}`;

    return (
      all[key] || {
        operator,
        a,
        b,
        attempts: 0,
        errors: 0,
        lastAttempt: null,
      }
    );
  } catch (err) {
    console.error('[operation-stats] Erreur lecture stats:', err);
    return {
      operator,
      a,
      b,
      attempts: 0,
      errors: 0,
      lastAttempt: null,
    };
  }
}

/**
 * Récupère toutes les statistiques (optionnellement filtrées par opérateur)
 *
 * @param {string|null} operatorFilter - Filtre optionnel par opérateur (×, +, −, ÷)
 * @returns {Object} Objet avec toutes les stats { "3×5": {...}, "7+4": {...}, ... }
 *
 * @example
 * // Toutes les stats
 * const all = getAllOperationStats();
 *
 * // Seulement les multiplications
 * const multiplications = getAllOperationStats('×');
 */
export function getAllOperationStats(operatorFilter = null) {
  try {
    const all = Storage.get(OPERATION_STATS_KEY, {}) || {};

    // Sans filtre: retourner tout
    if (!operatorFilter) {
      return all;
    }

    // Avec filtre: filtrer par opérateur
    return Object.fromEntries(
      Object.entries(all).filter(([, stats]) => stats.operator === operatorFilter)
    );
  } catch (err) {
    console.error('[operation-stats] Erreur lecture toutes stats:', err);
    return {};
  }
}

/**
 * Calcule le taux d'erreur pour une opération
 *
 * @param {string} operator
 * @param {number} a
 * @param {number} b
 * @returns {number} Taux d'erreur entre 0 et 1 (0.25 = 25% erreurs)
 *
 * @example
 * const errorRate = getErrorRate('×', 7, 8);
 * // => 0.15 (15% d'erreurs sur 7 × 8)
 */
export function getErrorRate(operator, a, b) {
  const stats = getOperationStats(operator, a, b);

  if (stats.attempts === 0) {
    return 0;
  }

  return stats.errors / stats.attempts;
}

/**
 * Récupère les opérations faibles (taux d'erreur élevé)
 *
 * @param {string} operator - Opérateur à analyser
 * @param {number} threshold - Seuil de taux d'erreur (défaut: 0.3 = 30%)
 * @param {number} minAttempts - Minimum de tentatives pour considérer (défaut: 3)
 * @returns {Array<{key: string, errorRate: number, attempts: number}>} Opérations faibles triées
 *
 * @example
 * const weak = getWeakOperations('×', 0.4, 5);
 * // => [{ key: '7×8', errorRate: 0.5, attempts: 10 }, ...]
 */
export function getWeakOperations(operator, threshold = 0.3, minAttempts = 3) {
  const all = getAllOperationStats(operator);
  const weak = [];

  for (const [key, stats] of Object.entries(all)) {
    if (stats.attempts >= minAttempts) {
      const errorRate = stats.errors / stats.attempts;

      if (errorRate >= threshold) {
        weak.push({
          key,
          errorRate,
          attempts: stats.attempts,
          errors: stats.errors,
        });
      }
    }
  }

  // Trier par taux d'erreur décroissant
  return weak.sort((a, b) => b.errorRate - a.errorRate);
}

// ========================================
// WRAPPERS DE COMPATIBILITÉ (R1 temporaire)
// TODO R2: Supprimer après migration complète
// ========================================

/**
 * Wrapper de compatibilité pour recordMultiplicationResult
 * R2: Migration automatique gère la conversion, plus besoin de double-write
 *
 * @deprecated Utiliser recordOperationResult('×', table, num, isCorrect) à la place
 * @param {number} table - Table de multiplication (ex: 7 pour table de 7)
 * @param {number} num - Multiplicande (ex: 8 pour 7 × 8)
 * @param {boolean} isCorrect - Si la réponse était correcte
 * @returns {boolean} True si sauvegarde réussie
 */
export function recordMultiplicationResult(table, num, isCorrect) {
  // Simple wrapper vers le nouveau système (plus de double-write)
  return recordOperationResult('×', table, num, isCorrect);
}

/**
 * Wrapper de compatibilité pour getMultiplicationStats
 * R1: Lit depuis nouvelle structure en priorité, fallback ancien format
 *
 * @deprecated Utiliser getOperationStats('×', table, num) à la place
 * @param {number} table
 * @param {number} num
 * @returns {{ attempts: number, errors: number }}
 */
export function getMultiplicationStats(table, num) {
  // Priorité: nouvelle structure
  const newStats = getOperationStats('×', table, num);
  if (newStats.attempts > 0) {
    return {
      attempts: newStats.attempts,
      errors: newStats.errors,
    };
  }

  // Fallback: ancienne structure
  try {
    const old = Storage.loadMultiplicationStats() || {};
    const key = `${table}x${num}`;
    return old[key] || { attempts: 0, errors: 0 };
  } catch (err) {
    console.error('[operation-stats] Erreur lecture stats multiplication:', err);
    return { attempts: 0, errors: 0 };
  }
}

// ========================================
// MIGRATION (R2 one-shot)
// ========================================

/**
 * Migre les anciennes stats de multiplication vers la nouvelle structure
 * À appeler manuellement ou au démarrage de l'application (R2)
 *
 * Stratégie:
 * - Lit multiplicationStats (format "3x5")
 * - Convertit vers operationStats (format "3×5")
 * - Ne surcharge PAS si la paire existe déjà (priorité aux nouvelles stats)
 * - Log le nombre de migrations effectuées
 *
 * @returns {{ migrated: number, skipped: number, total: number }} Résultat de la migration
 *
 * @example
 * const result = migrateMultiplicationStats();
 * // => { migrated: 42, skipped: 3, total: 45 }
 * console.log(`Migré ${result.migrated} entrées sur ${result.total}`);
 */
export function migrateMultiplicationStats() {
  try {
    const old = Storage.loadMultiplicationStats() || {};
    const neu = Storage.get(OPERATION_STATS_KEY, {}) || {};

    let migrated = 0;
    let skipped = 0;
    const total = Object.keys(old).length;

    console.log(`🔄 Début migration stats: ${total} entrées à traiter`);

    for (const [key, stats] of Object.entries(old)) {
      // Parse "3x5" → a=3, b=5
      const [aStr, bStr] = key.split('x');
      const a = Number(aStr);
      const b = Number(bStr);

      // Valider parsing
      if (Number.isNaN(a) || Number.isNaN(b)) {
        console.warn(`⚠️ Clé invalide ignorée: ${key}`);
        skipped++;
        continue;
      }

      // Nouvelle clé: "3×5"
      const newKey = `${a}×${b}`;

      // Ne pas écraser si existe déjà (priorité aux nouvelles stats)
      if (neu[newKey]) {
        console.log(`⏭️  Clé existante conservée: ${newKey}`);
        skipped++;
        continue;
      }

      // Migrer
      neu[newKey] = {
        operator: '×',
        a,
        b,
        attempts: stats.attempts || 0,
        errors: stats.errors || 0,
        lastAttempt: null, // Pas d'info timestamp dans ancien format
      };

      migrated++;
    }

    // Sauvegarder
    Storage.set(OPERATION_STATS_KEY, neu);

    const result = { migrated, skipped, total };

    console.log(`✅ Migration terminée:`, result);
    console.log(`   - Migré: ${migrated} entrées`);
    console.log(`   - Ignoré: ${skipped} entrées`);
    console.log(`   - Total: ${total} entrées`);

    return result;
  } catch (err) {
    console.error('❌ Erreur migration stats:', err);
    return { migrated: 0, skipped: 0, total: 0, error: err.message };
  }
}

/**
 * Supprime l'ancienne structure multiplicationStats (R2 après validation)
 * ⚠️ ATTENTION: Opération irréversible, faire backup avant
 *
 * @param {boolean} confirmDelete - Protection: doit être true pour exécuter
 * @returns {boolean} True si suppression réussie
 */
export function cleanupOldMultiplicationStats(confirmDelete = false) {
  if (!confirmDelete) {
    console.warn('⚠️ cleanupOldMultiplicationStats() nécessite confirmDelete=true pour exécuter');
    return false;
  }

  try {
    // Backup dans console pour récupération manuelle si besoin
    const old = Storage.loadMultiplicationStats();
    console.log('📦 Backup avant suppression:', JSON.stringify(old));

    // Suppression
    localStorage.removeItem('multiplicationStats');

    console.log('✅ Ancienne structure multiplicationStats supprimée');
    return true;
  } catch (err) {
    console.error('❌ Erreur suppression ancienne structure:', err);
    return false;
  }
}
