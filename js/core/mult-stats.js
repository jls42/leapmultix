/**
 * Statistiques de multiplications (ESM)
 * Centralise l'enregistrement et la lecture des stats par paire (table × num)
 * en s'appuyant sur le module Storage centralisé.
 */

import Storage from './storage.js';

/**
 * Enregistre une réponse à une multiplication (statistiques adaptatives).
 * @param {number} table - La table (ex: 7)
 * @param {number} num - Le multiplicande (ex: 8)
 * @param {boolean} isCorrect - Si la réponse était correcte
 */
export function recordMultiplicationResult(table, num, isCorrect) {
  try {
    const all = Storage.loadMultiplicationStats() || {};
    const key = `${table}x${num}`;

    if (!all[key]) all[key] = { attempts: 0, errors: 0 };

    all[key].attempts++;

    if (!isCorrect) all[key].errors++;
    Storage.saveMultiplicationStats(all);
  } catch {
    /* no-op: stockage indisponible */
  }
}

/**
 * Renvoie les stats d'une multiplication.
 * @param {number} table - La table (ex: 7)
 * @param {number} num - Le multiplicande (ex: 8)
 * @returns {{attempts:number, errors:number}}
 */
export function getMultiplicationStats(table, num) {
  try {
    const all = Storage.loadMultiplicationStats() || {};
    return all[`${table}x${num}`] || { attempts: 0, errors: 0 };
  } catch {
    return { attempts: 0, errors: 0 };
  }
}
