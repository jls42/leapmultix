// stats-utils.js - ESM helpers for stats and daily challenge

import { UserState } from './core/userState.js';

/**
 * Énoncé d'une multiplication (« 7 × 8 = ? »), table puis multiplicande.
 *
 * Les deux gardes autour du premier nombre l'épinglent sur une suite de chiffres
 * entière : le motif ne peut plus la reprendre chiffre par chiffre sur un énoncé
 * sans signe, ce qui coûtait un temps quadratique. Reculer dans cette suite n'a
 * jamais permis de trouver un signe — on ne retomberait que sur un chiffre — donc
 * les énoncés reconnus restent exactement les mêmes.
 */
const ENONCE_MULTIPLICATION = /(?<!\d)(\d+)(?!\d)\s*[×x]\s*(\d+)/;

/**
 * Calcule les tables "faibles" basées sur l'historique (tous modes).
 * Retourne un tableau de numéros de tables.
 */
export function getWeakTables() {
  const userData = UserState.getCurrentUserData();
  const weakTables = [];
  const tableStats = {};

  (userData.progressHistory || []).forEach(item => {
    const match = item.question && ENONCE_MULTIPLICATION.exec(item.question);
    if (match) {
      const table = Number.parseInt(match[1]);

      if (!tableStats[table]) tableStats[table] = { total: 0, correct: 0 };

      tableStats[table].total++;

      if (item.correct) tableStats[table].correct++;
    }
  });

  let hasStats = false;
  for (const table in tableStats) {
    const stats = tableStats[table];
    if (stats.total >= 3) {
      hasStats = true;
      const successRate = (stats.correct / stats.total) * 100;
      if (successRate < 70) weakTables.push(Number.parseInt(table));
    }
  }
  return hasStats ? weakTables : [];
}

/**
 * Table du jour pour le défi quotidien (1-10 cyclique).
 */
export function getDailyChallengeTable() {
  const dayOfMonth = new Date().getDate();
  return ((dayOfMonth - 1) % 10) + 1;
}
