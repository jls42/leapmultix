/**
 * Scores d'Arcade, rangés dans le profil du joueur (`modeStats`, core/mode-stats.js) : les
 * 5 meilleurs scores de chaque jeu pour l'écran de fin, et les compteurs du tableau de bord
 * (parties, total, record), par opération.
 * Avant la v37, ils vivaient dans localStorage sous le SURNOM (arcadeScores_<surnom>) : un
 * changement de surnom les faisait disparaître, deux profils au même surnom les partageaient,
 * et ils survivaient à la suppression du profil. Ces clés sont importées une fois dans le
 * profil (userManager.js) et ne sont plus écrites.
 */
import { UserState } from './core/userState.js';
import { recordArcadeGame, arcadeTopScores, resetArcadeGame } from './core/mode-stats.js';

/**
 * Enregistre une partie jouée : score, opération du lancement
 * @param {number} score
 * @param {string} [game] - invasion, multimiam, multimemory, multisnake
 * @param {string} [operator] - Opération de la partie (celle du profil par défaut)
 */
export function saveArcadeScore(score, game = 'invasion', operator = null) {
  try {
    const userData = UserState.getCurrentUserData();
    recordArcadeGame(userData, {
      game,
      operator: operator || userData.preferredOperator || '×',
      score,
    });
    UserState.updateUserData(userData);
  } catch (error) {
    // Stockage indisponible : l'écran de fin s'affiche quand même
    console.error('[arcade-scores] Score non enregistré :', error);
  }
}

/** Les 5 meilleurs scores d'un jeu, du plus grand au plus petit */
export function getArcadeScores(game = 'invasion') {
  try {
    return arcadeTopScores(UserState.getCurrentUserData(), game);
  } catch {
    return [];
  }
}

/** « Remettre à zéro » : les meilleurs scores et les compteurs de ce jeu */
export function resetArcadeScores(game = 'invasion') {
  try {
    const userData = UserState.getCurrentUserData();
    resetArcadeGame(userData, game);
    UserState.updateUserData(userData);
  } catch (error) {
    console.error('[arcade-scores] Remise à zéro impossible :', error);
  }
}

// Chaque jeu a ses scores
export const saveArcadeScoreSnake = (score, operator) =>
  saveArcadeScore(score, 'multisnake', operator);
export const getArcadeScoresSnake = () => getArcadeScores('multisnake');
export const resetArcadeScoresSnake = () => resetArcadeScores('multisnake');

export const saveArcadeScorePacman = (score, operator) =>
  saveArcadeScore(score, 'multimiam', operator);
export const getArcadeScoresPacman = () => getArcadeScores('multimiam');
export const resetArcadeScoresPacman = () => resetArcadeScores('multimiam');

export const saveArcadeScoreMemory = (score, operator) =>
  saveArcadeScore(score, 'multimemory', operator);
export const getArcadeScoresMemory = () => getArcadeScores('multimemory');
export const resetArcadeScoresMemory = () => resetArcadeScores('multimemory');

export default {
  saveArcadeScore,
  getArcadeScores,
  resetArcadeScores,
  saveArcadeScoreSnake,
  getArcadeScoresSnake,
  resetArcadeScoresSnake,
  saveArcadeScorePacman,
  getArcadeScoresPacman,
  resetArcadeScoresPacman,
  saveArcadeScoreMemory,
  getArcadeScoresMemory,
  resetArcadeScoresMemory,
};
