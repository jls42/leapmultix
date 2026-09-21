/* ======================
   MODULE CENTRALISÉ BADGES
   ====================== */

import { UserState } from './core/userState.js';
import { getTranslation, showNotification, playSound } from './utils-es6.js';

/**
 * Liste des badges disponibles dans le jeu.
 * Les noms et descriptions sont traduits dynamiquement.
 */
const badges = {
  quiz_starter: { id: 'quiz_starter', icon: '🎓' },
  challenge_accepted: { id: 'challenge_accepted', icon: '⏱️' },
  adventurer: { id: 'adventurer', icon: '🗺️' },
  perfect_quiz: { id: 'perfect_quiz', icon: '💯' },
  high_scorer: { id: 'high_scorer', icon: '🏆' },
  star_collector: { id: 'star_collector', icon: '⭐' },
  daily_challenger: { id: 'daily_challenger', icon: '📅' },
  // Ajouter d'autres badges ici...
};

/**
 * Retourne la liste complète des badges avec nom et description traduits.
 * @returns {Array} Liste des badges enrichis
 */
function getAllBadges() {
  return Object.values(badges).map(badge => ({
    ...badge,
    name: getTranslation(`badge_${badge.id}_name`),
    description: getTranslation(`badge_${badge.id}_desc`),
  }));
}

/**
 * Vérifie et débloque un badge pour l'utilisateur courant.
 * @param {string} badgeId
 */
function checkAndUnlockBadge(badgeId) {
  const userData = UserState.getCurrentUserData();
  if (!userData.unlockedBadges) userData.unlockedBadges = [];

  if (badges[badgeId] && !userData.unlockedBadges.includes(badgeId)) {
    userData.unlockedBadges.push(badgeId);
    UserState.updateUserData(userData);
    // Toast : titre « Nouveau badge débloqué » puis le nom du badge (texte brut, sans HTML).
    // Deux lignes plutôt qu'une phrase composée : aucune ponctuation propre à une langue.
    showNotification('badge', badges[badgeId].icon, getTranslation(`badge_${badgeId}_name`), {
      title: getTranslation('new_badge_unlocked'),
    });
    // Son de succès
    if (typeof playSound === 'function') playSound('good');
  }
}

export { badges, getAllBadges, checkAndUnlockBadge };

/**
 * @typedef {Object} Badge
 * @property {string} id
 * @property {string} icon
 * @property {string} name
 * @property {string} description
 */
