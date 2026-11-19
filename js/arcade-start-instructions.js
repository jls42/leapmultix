/* =====================
   Consigne du début d'une partie d'Arcade
   - Montrée les premières parties de chaque jeu, le temps d'apprendre le geste ; ensuite,
     seulement dite aux lecteurs d'écran, qui n'ont pas d'autre moyen de l'avoir.
   - Elle part au premier geste du joueur (js/arcade-common.js, showGameInstructions).
   ===================== */

import { UserState } from './core/userState.js';
import { arcadeGamesPlayed } from './core/mode-stats.js';
import { INSTRUCTIONS_MS, showGameInstructions } from './arcade-common.js';

/** Parties d'un jeu (au moins un coup) après lesquelles sa consigne ne se montre plus */
export const INSTRUCTIONS_GAMES = 3;

/**
 * Le joueur a-t-il déjà joué assez de parties de ce jeu pour se passer de la consigne ?
 * @param {string} game - invasion, multimiam, multimemory, multisnake, multipop, multigoal
 * @returns {boolean}
 */
function knowsGame(game) {
  try {
    return arcadeGamesPlayed(UserState.getCurrentUserData(), game) >= INSTRUCTIONS_GAMES;
  } catch {
    // Profil illisible : la consigne se montre, comme à un nouveau joueur
    return false;
  }
}

/**
 * Consigne du début de partie : visible les INSTRUCTIONS_GAMES premières parties du jeu, puis
 * réservée aux lecteurs d'écran (sr-only)
 * @param {HTMLCanvasElement} canvas - Canevas du jeu
 * @param {string} message - Consigne déjà traduite
 * @param {{game: string, placement?: string}} options - Jeu (ses parties comptées dans le
 *   profil) et place sur le plateau (bottom | middle)
 * @returns {HTMLElement|undefined}
 */
export function showStartInstructions(canvas, message, { game, placement = 'bottom' }) {
  const element = showGameInstructions(canvas, message, 'neutral', INSTRUCTIONS_MS, placement);
  element?.classList.toggle('sr-only', knowsGame(game));
  return element;
}
