/* =====================
   Arcade Snake Launcher (MultiSnake)
   - Contient la fonction startSnakeArcade déplacée depuis arcade.js
   - Se repose sur InfoBar.createArcadeTemplateElement (components/infoBar.js) et SnakeGame (multisnake.js)
   ===================== */

import { SnakeGame } from './multisnake.js';
import { gameState } from './game.js';
import { goToSlide } from './slides.js';
import { getTranslation, cleanupGameResources } from './utils-es6.js';
import { setStartingMode } from './mode-orchestrator.js';
import { InfoBar } from './components/infoBar.js';
import { getDifficultySettings } from './difficulty.js';
import { startArcadeTimer, showArcadeGameOver, stopArcadeMode } from './arcade.js';
import { eventBus } from './core/eventBus.js';
import { UserState } from './core/userState.js';
import { prepareArcadeStage } from './arcade-common.js';
// Utilise les helpers arcades via window (arcade.js expose des ponts globaux)

// Instance locale du jeu (remplace window._multisnakeInstance)
let _snakeInstance = null;

/**
 * Fonction centralisée de nettoyage du jeu Snake
 * Utilisée à la fois pour le bouton "Abandonner" et pour arcade:stop (bouton accueil)
 * @returns {number} Le score actuel du jeu
 */
function cleanupSnakeGame() {
  if (!_snakeInstance) return 0;

  const score = _snakeInstance.score ?? 0;

  // Nettoyer toutes les ressources du jeu
  try {
    if (typeof _snakeInstance.cleanup === 'function') {
      _snakeInstance.cleanup();
    } else {
      // Nettoyage de secours
      cleanupGameResources(_snakeInstance);
    }
  } catch {
    // Erreur de cleanup non-critique : le jeu continue de fonctionner
    // Erreur ignorée (non-critique)
  }

  _snakeInstance = null;
  return score;
}

/** Quitte le jeu d'Arcade en cours et ouvre l'écran de MultiSnake */
function enterSnakeScreen() {
  // Couper proprement toute instance arcade précédente
  try {
    stopArcadeMode();
  } catch {
    // Attendu : le mode arcade peut ne pas être actif
  }
  // Définir le mode avant le changement de slide pour éviter les auto-stop
  setStartingMode('multisnake');
  gameState.gameMode = 'multisnake';
  void goToSlide(4);
}

/** Une partie restée d'un lancement précédent est rendue (boucle, écouteurs, minuteries) */
function disposePreviousSnake() {
  if (!_snakeInstance) return;
  cleanupGameResources(_snakeInstance, {
    cleanAnimations: true,
    cleanEvents: true,
    cleanTimers: true,
  });
  _snakeInstance = null;
}

/** Écran du jeu : bandeau, plateau et « Abandonner », du gabarit commun de l'Arcade */
function renderSnakeScreen() {
  const gameScreen = document.getElementById('game');
  while (gameScreen.firstChild) gameScreen.firstChild.remove();
  const frag = InfoBar.createArcadeTemplateElement({
    mode: 'multisnake',
    canvasId: 'multisnake-canvas',
    operationId: 'arcade-mult-display',
    scoreId: 'multisnake-info-score',
    livesId: 'multisnake-info-lives',
    timerId: 'arcade-info-timer',
    abandonId: 'multisnake-abandon-btn',
    operationLabel: '',
    abandonLabel: getTranslation('abandon_arcade_button'),
    showLives: true,
    showScore: true,
  });
  gameScreen.appendChild(frag);
  // Haut de page et zone de jeu sans hauteur imposée : le plateau se dimensionne
  // ensuite pour tenir dans l'écran
  prepareArcadeStage(document.getElementById('multisnake-canvas'));
}

/** Minuteur du niveau, score à zéro, « Abandonner » (écran de fin avec le score) */
function startSnakeRound(difficultySettings) {
  startArcadeTimer(difficultySettings.timeSeconds);
  // Le lancement est fini : le mode « en cours de lancement » se retire
  setTimeout(() => setStartingMode(null), 0);
  const scoreElement = document.getElementById('multisnake-info-score');
  if (scoreElement) scoreElement.textContent = '0';
  document.getElementById('multisnake-abandon-btn').addEventListener('click', function () {
    const score = cleanupSnakeGame();
    showArcadeGameOver(score);
  });
}

/**
 * Lance MultiSnake : écran du jeu, minuteur du niveau, puis la partie, avec les réglages du
 * niveau et l'opération choisie à l'accueil ; l'arrêt de l'Arcade (Accueil) la rend sans
 * écran de fin
 */
export function startSnakeArcade() {
  enterSnakeScreen();
  const operator = UserState.getCurrentUserData().preferredOperator || '×';
  disposePreviousSnake();
  renderSnakeScreen();
  const difficulty = gameState.difficulty || 'moyen';
  const difficultySettings = getDifficultySettings(difficulty);
  startSnakeRound(difficultySettings);
  _snakeInstance = new SnakeGame('multisnake-canvas', 'operation', {
    difficulty,
    penaltyPoints: difficultySettings.penalty,
    tables: difficultySettings.tables,
    distractorDistance: difficultySettings.distractorDistance,
    operator,
  });
  _snakeInstance.start();
  eventBus.on('arcade:stop', cleanupSnakeGame, { once: true });
}

// ESM export uniquement
