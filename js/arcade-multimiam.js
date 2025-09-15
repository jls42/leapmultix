/* =====================
   Arcade Pacman Launcher (MultiPac)
   - Contient la fonction startPacmanArcade déplacée depuis arcade.js
   - Dépend de getArcadeGameTemplate (arcade.js) et PacmanGame (multimiam-engine.js & co.)
   ===================== */

import { getDifficultySettings } from './difficulty.js';
import { loadSingleAvatar } from './arcade-utils.js';
import PacmanGame from './multimiam.js';
import { gameState } from './game.js';
import { goToSlide } from './slides.js';
import { getTranslation, cleanupGameResources } from './utils-es6.js';
import { setStartingMode } from './mode-orchestrator.js';
import { startArcadeTimer, showArcadeGameOver, stopArcadeMode } from './arcade.js';
import { eventBus } from './core/eventBus.js';
import { showGameInstructions } from './arcade-common.js';
import { InfoBar } from './components/infoBar.js';
// Utilise les helpers ESM

// Instance locale du jeu (remplace window.multimiamGame)
let _pacmanGame = null;

function cleanupExistingPacmanGame() {
  if (_pacmanGame) {
    cleanupGameResources(_pacmanGame, {
      cleanAnimations: true,
      cleanEvents: true,
      cleanImages: true,
      cleanTimers: true,
    });
    _pacmanGame = null;
  }
}

function renderPacmanUI() {
  const gameScreen = document.getElementById('game');
  while (gameScreen.firstChild) gameScreen.removeChild(gameScreen.firstChild);
  const frag = InfoBar.createArcadeTemplateElement({
    mode: 'multimiam',
    canvasId: 'multimiam-canvas',
    operationId: 'arcade-mult-display',
    scoreId: 'multimiam-info-score',
    livesId: 'multimiam-info-lives',
    timerId: 'arcade-info-timer',
    abandonId: 'multimiam-abandon-btn',
    operationLabel: '',
    abandonLabel: getTranslation('abandon_arcade_button'),
    showLives: true,
    showScore: true,
  });
  gameScreen.appendChild(frag);
}

function attachAbandonHandler() {
  document.getElementById('multimiam-abandon-btn').addEventListener('click', function () {
    let score = 0;
    if (_pacmanGame && typeof _pacmanGame.score === 'number') {
      score = _pacmanGame.score;
      if (typeof _pacmanGame.endGame === 'function') {
        _pacmanGame.endGame();
      } else {
        _pacmanGame.pause?.();
        cleanupGameResources?.(_pacmanGame);
      }
      _pacmanGame = null;
    }
    showArcadeGameOver(score);
  });
}

function getInstructions() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    globalThis.navigator?.userAgent || ''
  );
  if (isMobile) {
    return (
      getTranslation('arcade.multiMiam.controls.mobile') ||
      'Glisse avec ton doigt dans la direction souhaitée pour déplacer le personnage'
    );
  }
  return (
    getTranslation('arcade.multiMiam.controls.desktop') ||
    'Utilise les flèches du clavier pour déplacer le personnage'
  );
}

export function startPacmanArcade() {
  // Couper toute instance arcade éventuellement active
  try {
    stopArcadeMode();
  } catch (e) {
    void e;
  }
  // Définir le mode avant le changement de slide pour éviter les auto-stop
  setStartingMode('multimiam');
  gameState.gameMode = 'multimiam';
  goToSlide(4);

  // Nettoyer les anciennes instances de jeux et leurs ressources
  cleanupExistingPacmanGame();

  // Nettoyage préventif centralisé via stopArcadeMode (déjà appelé)

  // Nettoyer l'écran jeu et rendre l'UI
  renderPacmanUI();
  // Utilisation des paramètres de difficulté (Cascade 2025)
  const difficultySettings = getDifficultySettings(gameState.difficulty || 'moyen');
  // Durée de la partie selon le niveau
  startArcadeTimer(difficultySettings.timeSeconds);

  // Bouton d'abandon du jeu
  attachAbandonHandler();

  // Initialisation du jeu
  if (typeof PacmanGame !== 'undefined') {
    console.log('Initialisation du jeu MultiMiam');
    // Conversion du niveau de difficulté texte en valeur numérique pour PacmanGame (Cascade 2025)
    const difficultySettings = getDifficultySettings(gameState.difficulty || 'moyen');

    // Conversion de la difficulté textuelle en valeur numérique pour PacmanGame
    // Débutant = 1, Moyen = 2, Difficile = 3
    let difficultyValue = 2; // Défaut = moyen
    if (gameState.difficulty === 'debutant') difficultyValue = 1;
    if (gameState.difficulty === 'difficile') difficultyValue = 3;

    const tableNumber = gameState.tableNumber || null;
    const mode = tableNumber ? 'table' : 'operation';

    // Récupérer l'avatar courant
    const playerAvatar =
      typeof gameState !== 'undefined' && gameState.avatar ? gameState.avatar : 'fox';
    console.log('Avatar du joueur:', playerAvatar);
    console.log(
      'MultiMiam lancé avec niveau:',
      gameState.difficulty,
      '(valeur:',
      difficultyValue,
      ')'
    );

    // Passage des paramètres au constructeur PacmanGame
    _pacmanGame = new PacmanGame('multimiam-canvas', difficultyValue, mode, tableNumber);

    // Ajout des paramètres de difficulté avancés
    _pacmanGame.difficultySettings = difficultySettings;
    _pacmanGame.tables = difficultySettings.tables;
    _pacmanGame.distractorDistance = difficultySettings.distractorDistance;
    // Appliquer l'avatar personnalisé via arcadeUtils
    _pacmanGame.avatar = loadSingleAvatar(playerAvatar);
    _pacmanGame.start();

    try {
      setTimeout(() => setStartingMode(null), 0);
    } catch (e) {
      void e;
    }

    // Nettoyage à l'arrêt arcade
    try {
      eventBus.on(
        'arcade:stop',
        () => {
          try {
            _pacmanGame?.endGame?.();
          } catch {
            try {
              _pacmanGame?.pause?.();
            } catch {
              // Ignore errors during cleanup
            }
          }
          _pacmanGame = null;
        },
        { once: true }
      );
    } catch (e) {
      void e;
    }

    // Afficher les instructions du jeu
    showGameInstructions(
      document.getElementById('multimiam-canvas'),
      getInstructions(),
      '#FFB700',
      5000
    );
  } else {
    console.error('Erreur: MultiMiam non défini');
  }
}

export default startPacmanArcade;
// ESM export uniquement
