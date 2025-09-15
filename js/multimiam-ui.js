// multimiam-ui.js - Gestion de l'affichage (score, vies, opération) (ESM)
// (c) LeapMultix - 2025

/**
 * Initialise l'interface utilisateur pour Pacman.
 * Ajoute deux méthodes sur l'instance du jeu :
 *   - updateUI()           → met à jour score + vies
 *   - displayOperationUI() → met à jour l'opération courante
 * @param {object} game Instance de PacmanGame
 */
export function initPacmanUI(game) {
  if (!game || typeof game !== 'object') return;

  // --- Helpers -----------------------------------------------------------
  function updateScoreAndLives() {
    // Score
    const scoreEl = document.getElementById('multimiam-info-score');
    if (scoreEl) scoreEl.textContent = game.score.toString();

    // Vies (❤️ répété)
    const livesEl = document.getElementById('multimiam-info-lives');
    if (livesEl) livesEl.textContent = '❤️'.repeat(Math.max(0, game.lives));
  }

  function updateOperation() {
    const questionSpan = document.querySelector('.arcade-question');
    if (questionSpan && game.currentOperation) {
      questionSpan.textContent = `${game.currentOperation.num1} ${game.currentOperation.operator} ${game.currentOperation.num2} = ?`;
    }
  }

  // Exposer les méthodes sur l'instance du jeu
  game.updateUI = updateScoreAndLives;
  game.displayOperationUI = updateOperation;

  // Effectuer une mise à jour initiale
  updateScoreAndLives();
  updateOperation();
}
