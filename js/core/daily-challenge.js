/**
 * Défi quotidien (ESM)
 * Fournit loadDailyChallengeData et saveDailyChallengeData,
 * isolés du module storage historique.
 */

import { UserState } from './userState.js';

/**
 * Charger l'état du défi quotidien pour l'utilisateur courant.
 * Retourne un objet par défaut si aucun utilisateur courant.
 */
export function loadDailyChallengeData() {
  const userData = UserState.getCurrentUserData();
  if (!userData.dailyChallenge) {
    // Initialiser en mémoire; mise à jour stockage sera ignorée si aucun utilisateur courant
    userData.dailyChallenge = { completedDate: null, progress: 0, lastPlayedDate: null };
    try {
      UserState.updateUserData(userData);
    } catch (e) {
      void e; /* noop: ignore when no current user */
    }
  }
  // Assurer la présence des propriétés attendues
  userData.dailyChallenge.completedDate = userData.dailyChallenge.completedDate || null;
  userData.dailyChallenge.progress = userData.dailyChallenge.progress || 0;
  userData.dailyChallenge.lastPlayedDate = userData.dailyChallenge.lastPlayedDate || null;
  return userData.dailyChallenge;
}

/**
 * Sauvegarder l'état du défi quotidien pour l'utilisateur courant.
 * Ignore si aucun utilisateur courant.
 */
export function saveDailyChallengeData(data) {
  const userData = UserState.getCurrentUserData();
  userData.dailyChallenge = data;
  try {
    UserState.updateUserData(userData);
  } catch (e) {
    void e; /* noop: ignore when no current user */
  }
}
