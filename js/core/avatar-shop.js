/**
 * Avatars débloqués avec les pièces (décision du propriétaire, 08/10/2026). Un joueur commence avec
 * l'avatar choisi à sa création ; les autres s'achètent dans Personnalisation. Les pièces se gagnent
 * en jouant : une par bonne réponse en Chrono et en Aventure, une à trois en Défi selon la série,
 * dix par Défi du jour réussi. Un avatar coûte donc cinq courses de Chrono, par exemple.
 * Ce module ne lit ni n'écrit le stockage : il change le profil que l'appelant enregistre ensuite.
 */

/** Prix d'un avatar, en pièces */
export const AVATAR_PRICE = 50;

/**
 * Pièces du profil : un nombre entier positif, sinon 0
 * @param {Object} userData
 * @returns {number}
 */
export function coinBalance(userData) {
  const coins = Math.floor(Number(userData?.coins));
  return Number.isFinite(coins) && coins > 0 ? coins : 0;
}

/**
 * Pièces qui manquent pour débloquer un avatar (0 : le joueur peut l'acheter)
 * @param {Object} userData
 * @param {number} [price]
 * @returns {number}
 */
export function missingCoins(userData, price = AVATAR_PRICE) {
  return Math.max(0, price - coinBalance(userData));
}

/**
 * Débloque un avatar contre des pièces. Rien ne change s'il est déjà débloqué ou s'il manque des
 * pièces.
 * @param {Object} userData - Profil que l'appelant enregistre ensuite
 * @param {string} avatarId
 * @param {number} [price]
 * @returns {'unlocked'|'already'|'missing'}
 */
export function buyAvatar(userData, avatarId, price = AVATAR_PRICE) {
  const unlocked = Array.isArray(userData.unlockedAvatars) ? userData.unlockedAvatars : [];
  if (unlocked.includes(avatarId)) return 'already';
  if (missingCoins(userData, price) > 0) return 'missing';
  userData.coins = coinBalance(userData) - price;
  userData.unlockedAvatars = [...unlocked, avatarId];
  return 'unlocked';
}
