/**
 * Partie d'Arcade en cours, pour le tableau de bord. Elle s'ouvre au lancement d'un jeu
 * (startArcadeTimer), devient « jouée » au premier coup (un monstre touché, une bulle mangée,
 * une réponse croquée, deux cartes retournées) et se ferme une seule fois : à la fin
 * (vies, temps, victoire, « Abandonner ») ou en quittant le jeu (Accueil, autre écran).
 * Une partie sans aucun coup ne compte pas ; une partie jouée compte avec son score,
 * abandon compris.
 */
import { UserState } from './core/userState.js';

const GAMES = new Set(['multimiam', 'multimemory', 'multisnake']);
let session = null;

/**
 * Jeu d'Arcade d'un gameMode : multimiam, multimemory, multisnake, sinon invasion
 * @param {string} mode
 * @returns {string}
 */
export function arcadeGameOf(mode) {
  return GAMES.has(mode) ? mode : 'invasion';
}

/** Une partie commence : son jeu et l'opération choisie à l'accueil, lue au lancement */
export function openArcadeSession(mode) {
  let operator = '×';
  try {
    operator = UserState.getCurrentUserData()?.preferredOperator || '×';
  } catch {
    // Sans profil lisible, l'opération par défaut du jeu
  }
  session = { game: arcadeGameOf(mode), operator, played: false, closed: false };
}

/** Premier coup (ou suivant) de la partie en cours */
export function noteArcadePlay() {
  if (session && !session.closed) session.played = true;
}

/**
 * Ferme la partie en cours, une seule fois
 * @returns {{game: string, operator: string}|null} La partie si elle a été jouée (à compter)
 */
export function closeArcadeSession() {
  if (!session || session.closed) return null;
  session.closed = true;
  return session.played ? { game: session.game, operator: session.operator } : null;
}
