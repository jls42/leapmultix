// stats-utils.js - ESM helpers for stats and daily challenge

import { UserState } from './core/userState.js';

/**
 * Calcule les tables "faibles" basées sur l'historique (tous modes).
 * Retourne un tableau de numéros de tables.
 */
export function getWeakTables() {
  const userData = UserState.getCurrentUserData();
  const weakTables = [];
  const tableStats = {};

  (userData.progressHistory || []).forEach(item => {
    const match = item.question && item.question.match(/(\d+)\s*[×x]\s*(\d+)/);
    if (match) {
      const table = parseInt(match[1]);

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
      if (successRate < 70) weakTables.push(parseInt(table));
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
