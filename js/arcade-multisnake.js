/* =====================
   Arcade Snake Launcher (MultiSnake)
   - Contient la fonction startSnakeArcade déplacée depuis arcade.js
   - Se repose sur getArcadeGameTemplate (défini dans arcade.js) et SnakeGame (multisnake.js)
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
// Utilise les helpers arcades via window (arcade.js expose des ponts globaux)

// Instance locale du jeu (remplace window._multisnakeInstance)
let _snakeInstance = null;

export function startSnakeArcade() {
  // Couper proprement toute instance arcade précédente
  try {
    stopArcadeMode();
  } catch (e) {
    void e;
  }
  // Définir le mode avant le changement de slide pour éviter les auto-stop
  setStartingMode('multisnake');
  gameState.gameMode = 'multisnake';
  goToSlide(4);

  // Nettoyer les anciennes instances de jeux et leurs ressources
  if (_snakeInstance) {
    // Utiliser la fonction utilitaire centralisée pour un nettoyage complet
    cleanupGameResources(_snakeInstance, {
      cleanAnimations: true,
      cleanEvents: true,
      cleanTimers: true,
    });
    _snakeInstance = null;
  }

  // Nettoyage préventif centralisé via stopArcadeMode (déjà appelé)

  // Nettoyer l'écran jeu
  const gameScreen = document.getElementById('game');
  while (gameScreen.firstChild) gameScreen.removeChild(gameScreen.firstChild);
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
  // Utilisation des paramètres de difficulté (Cascade 2025)
  const difficultySettings = getDifficultySettings(gameState.difficulty || 'moyen');
  // Durée de la partie selon le niveau
  startArcadeTimer(difficultySettings.timeSeconds);

  // Forcer la mise à zéro du score

  try {
    setTimeout(() => setStartingMode(null), 1200);
  } catch (e) {
    void e;
  }
  const scoreElement = document.getElementById('multisnake-info-score');
  if (scoreElement) {
    scoreElement.textContent = '0';
  }

  // Bouton abandon → retour au menu Arcade avec sauvegarde du score
  document.getElementById('multisnake-abandon-btn').addEventListener('click', function () {
    let score = 0;
    if (_snakeInstance && typeof _snakeInstance.score === 'number') {
      score = _snakeInstance.score;
    }

    // Nettoyer toutes les ressources du jeu avant de quitter
    if (_snakeInstance && typeof _snakeInstance.cleanup === 'function') {
      _snakeInstance.cleanup();
    } else {
      // Nettoyage de secours
      if (cleanupGameResources && _snakeInstance) {
        cleanupGameResources(_snakeInstance);
      }
    }
    showArcadeGameOver(score);
  });

  // Initialiser le jeu Snake via le module multisnake
  console.log('Initialisation du jeu Snake');
  _snakeInstance = new SnakeGame('multisnake-canvas', {
    difficulty: gameState.difficulty || 'moyen',
    speed: 100 + difficultySettings.enemySpeed * 50,
    penaltyPoints: difficultySettings.penalty,
    tables: difficultySettings.tables,
    distractorDistance: difficultySettings.distractorDistance,
  });
  console.log('Jeu Snake démarré avec le niveau:', gameState.difficulty || 'moyen');
  _snakeInstance.start();

  // Écouter l'arrêt arcade via EventBus pour nettoyer
  try {
    eventBus.on(
      'arcade:stop',
      () => {
        try {
          _snakeInstance?.cleanup?.();
        } catch (e) {
          void e;
        }
        _snakeInstance = null;
      },
      { once: true }
    );
  } catch (e) {
    void e;
  }
}

// ESM export uniquement
