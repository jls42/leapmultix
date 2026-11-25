/**
 * Ce qu'une partie rapporte (pièces, badges) et l'annonce de ces gains.
 *
 * Pendant une partie, une bulle « Nouveau badge » ou « Défi du jour terminé » se posait sur
 * le jeu : les réponses, le plateau (retour d'un testeur). Tant qu'une partie est en cours,
 * l'annonce attend : l'écran de fin dit le gain. Une partie quittée avant son écran de fin
 * montre ses annonces à la sortie, pour qu'aucun gain ne passe inaperçu.
 */
import { UserState } from './userState.js';
import { coinBalance } from './avatar-shop.js';

/** null : aucune partie en cours, l'annonce part tout de suite ; sinon les annonces gardées */
let held = null;

/**
 * Pièces et badges du joueur à cet instant
 * @returns {{coins: number, badges: string[]}}
 */
export function rewardsSnapshot() {
  const userData = UserState.getCurrentUserData();
  const badges = Array.isArray(userData?.unlockedBadges) ? userData.unlockedBadges : [];
  return { coins: coinBalance(userData), badges: [...badges] };
}

/**
 * Ce que le joueur a gagné depuis un instantané : tout ce qu'il a vu arriver, la récompense
 * et le badge du défi du jour compris, qu'aucun mode ne donne lui-même.
 * @param {{coins: number, badges: string[]}} [start] - Sans instantané, aucun gain
 * @returns {{coins: number, badges: string[]}}
 */
export function rewardsSince(start) {
  const now = rewardsSnapshot();
  const from = start || now;
  return {
    coins: Math.max(0, now.coins - from.coins),
    badges: now.badges.filter(badgeId => !from.badges.includes(badgeId)),
  };
}

/** Une partie commence : les annonces attendent sa fin (celles déjà gardées restent) */
export function holdRewardAnnouncements() {
  held ??= [];
}

/**
 * Annonce un gain : tout de suite hors partie, sinon à la fin de la partie.
 * @param {() => void} show - Affiche l'annonce (bulle, message)
 * @param {string|null} [noteKey] - Clé de la phrase que l'écran de fin dira à la place,
 *   pour un gain que pièces et badges ne disent pas seuls (défi du jour terminé)
 */
export function announceReward(show, noteKey = null) {
  if (held) held.push({ show, noteKey });
  else show();
}

/**
 * L'écran de fin prend la suite : il dit les gains, les annonces gardées ne s'affichent pas.
 * @returns {string[]} Clés des phrases à dire en plus des pièces et des badges
 */
export function takeRewardNotes() {
  const notes = (held ?? []).map(({ noteKey }) => noteKey).filter(Boolean);
  held = null;
  return notes;
}

/** Partie quittée sans écran de fin : les annonces gardées s'affichent maintenant */
export function releaseRewardAnnouncements() {
  const pending = held ?? [];
  held = null;
  for (const { show } of pending) show();
}
