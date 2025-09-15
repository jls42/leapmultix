/**
 * Statistiques liées au Défi (scores, agrégats)
 */

import { UserState } from './userState.js';

/**
 * Obtenir les meilleurs scores du Défi (toutes difficultés confondues)
 * @param {number} limit
 * @returns {number[]}
 */
export function getChallengeTopScores(limit = 5) {
  const userData = UserState.getCurrentUserData();
  const scores = [];
  if (userData.challengeStats) {
    Object.values(userData.challengeStats).forEach(st => {
      if (Array.isArray(st.history)) {
        st.history.forEach(h => scores.push(h.score));
      }
    });
  }
  return scores.sort((a, b) => b - a).slice(0, limit);
}
