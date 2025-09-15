/* ======================
   GESTION DU STOCKAGE LOCAL
   ====================== */

import { UserState } from './core/userState.js';
// updateDailyChallengeProgress import removed as it's unused
// ESM compatibility re-exports for older arcade modules
import { recordMultiplicationResult, getMultiplicationStats } from './core/mult-stats.js';
export { recordMultiplicationResult, getMultiplicationStats };

// Clés pour le localStorage
const LANGUAGE_KEY = 'language';
// Storage keys moved to core/storage.js where they are used
// const COLOR_THEME_KEY = 'colorTheme';
// const VOICE_ENABLED_KEY = 'voiceEnabled';
// const VOLUME_KEY = 'volume';
// const HIGH_CONTRAST_KEY = 'highContrastEnabled';
// const FONT_SIZE_KEY = 'fontSize';
const MULT_STATS_KEY = 'multiplicationStats';

// loadPlayers moved to core/storage.js where it's used

// savePlayers moved to core/storage.js where it's used

// loadLanguage moved to core/storage.js where it's used

// Sauvegarder la langue préférée
export function saveLanguage(langCode) {
  localStorage.setItem(LANGUAGE_KEY, langCode);
}

// ESM only: callers should import saveLanguage from storage modules

// Tâche 5.1: Sauvegarder l'état d'activation du code parental
function saveParentalLockEnabled(enabled) {
  const userData = UserState.getCurrentUserData();
  if (!userData) return;
  userData.parentalLockEnabled = enabled;
  UserState.updateUserData(userData);
}

// Explorations Discovery gérées dans DiscoveryMode et UserState

// Sauvegarder les stats du Quiz

// Sauvegarder les stats du Défi

// Sauvegarder la progression de l'Aventure

// getCurrentDateString déplacé vers core/storage.js

// Assurer que getCurrentUserData est défini globalement ou importé si nécessaire
// Note: getCurrentUserData est défini dans main.js, assurez-vous que storage.js est chargé après main.js
// ou passez userData en paramètre aux fonctions de sauvegarde.
// Pour l'instant, on suppose qu'il est accessible globalement.

// Sauvegarder les stats du Pac-Man (MultiPac)

// Enregistrement adaptatif des stats de multiplication
function loadMultiplicationStats() {
  const data = localStorage.getItem(MULT_STATS_KEY);
  try {
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error('Erreur parsing multiplicationStats:', e);
    localStorage.removeItem(MULT_STATS_KEY);
    return {};
  }
}

// saveMultiplicationStats moved to core/mult-stats.js where it's used

// Gestion des tables exclues en mode Quiz
/**
 * Charger les tables exclues du Quiz pour l'utilisateur courant.
 * @returns {number[]}
 */
// Quiz exclude tables migrated to core/storage.js

// ESM only: legacy window.* bridges removed

export { loadMultiplicationStats, saveParentalLockEnabled };
