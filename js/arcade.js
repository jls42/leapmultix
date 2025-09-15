/* ======================
   Mode Arcade (helpers communs) - ESM
   ====================== */
import {
  getTranslation,
  speak,
  isVoiceEnabled,
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
} from './utils-es6.js';
// showArcadeMessage import not needed here
import { gameState as globalGameState } from './game.js';
import { AudioManager } from './core/audio.js';
import { goToSlide } from './slides.js';
import { setGameMode } from './mode-orchestrator.js';
import { eventBus } from './core/eventBus.js';

// =====================
// Fonction de lancement du mode Snake (coordination équipe Snake)
// moved to arcade-multisnake.js

// =====================
// Variables et fonctions de contrôle globales pour l'arcade
export const arcadeControls = {
  leftPressed: false,
  rightPressed: false,
};
// Arcade active state (ESM)
let _arcadeActive = false;
export function isArcadeActive() {
  return _arcadeActive;
}
export function setArcadeActive(v) {
  _arcadeActive = !!v;
}
// La fonction shoot sera définie plus bas, mais doit être accessible globalement
export function arcadeKeyDown(e) {
  if (e.key === 'ArrowLeft') arcadeControls.leftPressed = true;
  if (e.key === 'ArrowRight') arcadeControls.rightPressed = true;
}
export function arcadeKeyUp(e) {
  if (e.key === 'ArrowLeft') arcadeControls.leftPressed = false;
  if (e.key === 'ArrowRight') arcadeControls.rightPressed = false;
}

// Fonction standard pour afficher un message dans les jeux d'arcade
// showArcadeMessage moved to arcade-message.js and imported above
// =====================
// Jeu Invasion des Multiplications
// =====================

// La fonction startMultiplicationInvasion() est maintenant définie dans arcade-invasion.js

// =====================
// Fonctions de gestion des scores déplacées dans arcade-scores.js

// Fonction de lancement du mode Pac-Man
// La fonction startPacmanArcade() est maintenant définie dans arcade-multimiam.js

// Template commun pour tous les jeux arcade
export function getArcadeGameTemplate({
  canvasId = 'arcade-canvas',
  operationId = 'arcade-mult-display',
  scoreId = 'arcade-info-score',
  livesId = 'arcade-info-lives',
  timerId = 'arcade-info-timer',
  abandonId = 'arcade-abandon-btn',
  operationLabel = '',
  abandonLabel = getTranslation('abandon_arcade_button'),
  showLives = true, // Nouveau paramètre optionnel pour afficher/masquer les vies
  showScore = true, // Nouveau paramètre optionnel pour afficher/masquer le score
} = {}) {
  return `
        <div class="arcade-mult-display" id="${operationId}" aria-live="polite">
            <div class="arcade-mobile-top" style="display:flex; flex-direction:row; align-items:center; justify-content:center; width:100%;">
                ${
                  showScore
                    ? `<span id="${scoreId}" class="game-stat-display" style="min-width:60px; text-align:left;">0</span>`
                    : `<span class="game-stat-display arcade-placeholder" style="min-width:60px; opacity:0;">0</span>`
                }
                <span class="arcade-question" style="flex:1; text-align:center; display:block;">${operationLabel}</span>
                <span class="game-stat-display arcade-placeholder" style="min-width:60px; opacity:0;">0</span>
            </div>
            <div class="arcade-mobile-bottom" style="display:flex; flex-direction:row; align-items:center; justify-content:center; width:100%;">
                <span class="game-stat-display arcade-placeholder" style="min-width:60px; opacity:0;">0</span>
                <span id="${timerId}" class="game-stat-display" style="${showLives ? 'min-width:60px;' : 'min-width:120px;'} text-align:center;">05:00</span>
                ${showLives ? `<span id="${livesId}" class="game-stat-display" style="min-width:60px; text-align:center;">❤️❤️❤️</span>` : ''}
                <span class="game-stat-display arcade-placeholder" style="min-width:60px; opacity:0;">0</span>
            </div>
        </div>
        <div class="arcade-game-ui" role="region" aria-label="Zone de jeu" style="margin-top:8px; width:100%; min-height:70vh; display:flex; justify-content:center; align-items:center;">
            <canvas id="${canvasId}" tabindex="0" aria-label="Jeu Arcade" style="width:100%; height:100%;"></canvas>
            <button class="btn btn-secondary" id="${abandonId}" aria-label="${abandonLabel}">${abandonLabel}</button>
        </div>
    `;
}

export function showArcadeGameOver(score) {
  setArcadeActive(false);
  // Arrêter le timer pour éviter les doublons de fin de jeu
  stopArcadeTimer();
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      void e;
    }
  }
  try {
    AudioManager.stopAll();
  } catch (e) {
    void e;
  }
  // Gestion de l'historique des scores (par utilisateur)
  const mode = globalGameState?.gameMode ?? 'arcade';
  // Sauvegarder et lire les scores en fonction du mode
  saveScoreForMode(mode, score);
  const arcadeScores = getScoresForMode(mode);
  // Message d'encouragement si score = 0
  let endMessageKey = '';
  let endMessage = '';
  if (score === 0) {
    endMessageKey = 'arcade_try_again';
    endMessage = getTranslation(endMessageKey);
  } else {
    // Pour celui-ci, on ne peut pas utiliser data-translate simple
    // car la valeur du score est dynamique
    endMessageKey = 'arcade_final_score_message';
    endMessage = `${getTranslation('arcade_final_congrats')} ${score} ${getTranslation('points_label')}`;
  }
  // Affichage du top 5
  // Top scores HTML generation removed as it was unused
  const gameScreen = document.getElementById('game');
  if (gameScreen) {
    while (gameScreen.firstChild) gameScreen.removeChild(gameScreen.firstChild);
    gameScreen.appendChild(
      buildGameOverWrapper(mode, score, endMessageKey, endMessage, arcadeScores)
    );
  }
  if (isVoiceEnabled()) {
    speak(endMessage);
  }

  // Délai pour s'assurer que le DOM est rendu avant d'attacher les event listeners
  requestAnimationFrame(() => {
    setTimeout(() => {
      const retryBtn = document.getElementById('arcade-retry-btn');
      if (retryBtn) {
        retryBtn.addEventListener('click', async function () {
          try {
            if (mode === 'multisnake') {
              const mod = await import('./arcade-multisnake.js');
              return mod.startSnakeArcade?.();
            } else if (mode === 'multimiam') {
              const mod = await import('./arcade-multimiam.js');
              return mod.startPacmanArcade?.();
            } else if (mode === 'multimemory') {
              const mod = await import('./arcade-multimemory.js');
              return mod.startMemoryArcade?.();
            } else {
              const mod = await import('./arcade-invasion.js');
              return mod.startMultiplicationInvasion?.();
            }
          } catch (e) {
            console.error('Unable to restart arcade subgame:', e);
          }
        });
        const back = document.getElementById('arcade-back-btn');
        back.addEventListener('click', async () => {
          if (back.dataset.clicked) return; // prevent double-trigger
          back.dataset.clicked = 'true';
          try {
            await setGameMode('arcade');
          } catch {
            try {
              const mod = await import('./modes/ArcadeMode.js');
              mod.startArcadeMode?.();
            } catch (err) {
              console.error('Unable to start arcade menu:', err);
            }
          }
        });
      }

      const homeBtn = document.getElementById('arcade-home-btn');
      if (homeBtn) {
        homeBtn.addEventListener('click', () => {
          goToSlide(1);
        });
      }

      const resetBtn = document.getElementById('arcade-reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', function () {
          const canConfirm =
            typeof globalThis !== 'undefined' && typeof globalThis.confirm === 'function';
          if (canConfirm ? globalThis.confirm(getTranslation('reset_scores_confirm')) : true) {
            if (mode === 'multisnake') {
              resetArcadeScoresSnake();
              showArcadeGameOver(0);
            } else if (mode === 'multimiam') {
              resetArcadeScoresPacman();
              showArcadeGameOver(0);
            } else if (mode === 'multimemory') {
              resetArcadeScoresMemory();
              showArcadeGameOver(0);
            } else {
              resetArcadeScores();
              showArcadeGameOver(0);
            }
          }
        });
      }
    }, 50); // Petit délai pour s'assurer que le DOM est rendu
  });
}

// --- Helpers (réduisent la complexité de showArcadeGameOver) ---
function saveScoreForMode(mode, score) {
  switch (mode) {
    case 'multisnake':
      return saveArcadeScoreSnake(score);
    case 'multimiam':
      return saveArcadeScorePacman(score);
    case 'multimemory':
      return saveArcadeScoreMemory(score);
    default:
      return saveArcadeScore(score);
  }
}

function getScoresForMode(mode) {
  switch (mode) {
    case 'multisnake':
      return getArcadeScoresSnake();
    case 'multimiam':
      return getArcadeScoresPacman();
    case 'multimemory':
      return getArcadeScoresMemory();
    default:
      return getArcadeScores();
  }
}

function buildGameOverWrapper(mode, score, endMessageKey, endMessage, arcadeScores) {
  const wrapper = document.createElement('div');
  wrapper.className = 'arcade-gameover';

  const h2 = document.createElement('h2');
  h2.setAttribute('data-translate', 'game_over');
  h2.textContent = 'Game Over';
  wrapper.appendChild(h2);

  const scoreRow = document.createElement('div');
  scoreRow.className = 'arcade-final-score';
  scoreRow.style.display = 'flex';
  scoreRow.style.justifyContent = 'center';
  scoreRow.style.margin = '24px 0';
  const scoreSpan = document.createElement('span');
  scoreSpan.className = 'arcade-final-score-bg';
  const scoreLabel = document.createElement('span');
  scoreLabel.setAttribute('data-translate', 'final_score');
  scoreLabel.textContent = 'Score final';
  const strong = document.createElement('strong');
  strong.textContent = String(score);
  scoreSpan.appendChild(scoreLabel);
  scoreSpan.appendChild(document.createTextNode(' : '));
  scoreSpan.appendChild(strong);
  scoreRow.appendChild(scoreSpan);
  wrapper.appendChild(scoreRow);

  const endDiv = document.createElement('div');
  endDiv.className = 'arcade-end-message';
  if (score === 0) endDiv.setAttribute('data-translate', endMessageKey);
  endDiv.textContent = endMessage;
  wrapper.appendChild(endDiv);

  const topWrap = document.createElement('div');
  topWrap.className = 'arcade-top-scores';
  const strongTitle = document.createElement('strong');
  strongTitle.setAttribute('data-translate', 'arcade_top_scores');
  strongTitle.textContent = 'Meilleurs scores :';
  const ol = document.createElement('ol');
  arcadeScores.forEach(s => {
    const li = document.createElement('li');
    li.textContent = String(s);
    ol.appendChild(li);
  });
  topWrap.appendChild(strongTitle);
  topWrap.appendChild(ol);
  wrapper.appendChild(topWrap);

  const retryBtn = document.createElement('button');
  retryBtn.className = 'btn';
  retryBtn.id = 'arcade-retry-btn';
  retryBtn.setAttribute('data-translate', 'retry_button');
  retryBtn.textContent = 'Réessayer';
  const backBtn = document.createElement('button');
  backBtn.className = 'btn';
  backBtn.id = 'arcade-back-btn';
  backBtn.setAttribute('data-translate', 'back_to_arcade_menu');
  backBtn.textContent = 'Retour au menu arcade';
  const homeBtn = document.createElement('button');
  homeBtn.className = 'btn';
  homeBtn.id = 'arcade-home-btn';
  homeBtn.setAttribute('data-translate', 'back_to_home');
  homeBtn.textContent = "Retour à l'accueil";
  const resetBtn = document.createElement('button');
  resetBtn.className = 'btn';
  resetBtn.id = 'arcade-reset-btn';
  resetBtn.setAttribute('data-translate', 'reset_scores_button');
  resetBtn.textContent = 'Réinitialiser les scores';
  wrapper.appendChild(retryBtn);
  wrapper.appendChild(backBtn);
  wrapper.appendChild(homeBtn);
  wrapper.appendChild(resetBtn);
  return wrapper;
}

export function stopArcadeMode() {
  try {
    console.debug('[Arcade] stopArcadeMode called');
  } catch (e) {
    void e;
  }
  setArcadeActive(false);
  // Arrêt de la boucle d'animation
  // Les sous-jeux gèrent leurs propres boucles via ESM
  // Suppression des listeners clavier
  document.removeEventListener('keydown', arcadeKeyDown);
  document.removeEventListener('keyup', arcadeKeyUp);
  // Notifier les sous-jeux pour qu'ils retirent leurs écouteurs spécifiques
  try {
    eventBus.emit('arcade:stop');
  } catch (e) {
    void e;
  }
  try {
    const Root =
      typeof globalThis !== 'undefined'
        ? globalThis
        : typeof window !== 'undefined'
          ? window
          : undefined;
    if (Root && typeof Event !== 'undefined') {
      Root.dispatchEvent(new Event('arcade:stop'));
    }
  } catch (e) {
    void e;
  }
  // Autres nettoyages éventuels (sons, etc.)
  try {
    AudioManager.stopAll();
  } catch (e) {
    void e;
  }
  stopArcadeTimer(); // arrêter le compte à rebours
}

// Plus d'export global: stopArcadeMode est importable depuis modes/ArcadeMode.js

// --- ENNEMIS : monstres dédiés ---
export const monsterSpriteNames = [];
for (let i = 1; i <= 83; i++) {
  const num = i.toString().padStart(2, '0');
  monsterSpriteNames.push(`monstre${num}_128x128.png`);
}
// Include newly added monsters 146–155
for (let i = 146; i <= 155; i++) {
  const num = i.toString().padStart(2, '0');
  monsterSpriteNames.push(`monstre${num}_128x128.png`);
}
export const monsterSprites = monsterSpriteNames.map(name => {
  const img = new Image();
  img.src = 'assets/images/arcade/' + name;
  return img;
});

// ===== Timer de l'Arcade (compte à rebours) =====
let arcadeTimerIntervalId = null,
  arcadeTimerRemaining = 0;
export function startArcadeTimer(durationSeconds) {
  stopArcadeTimer();
  setArcadeActive(true);
  arcadeTimerRemaining = durationSeconds;
  updateArcadeTimerDisplay();
  arcadeTimerIntervalId = setInterval(() => {
    arcadeTimerRemaining--;
    if (arcadeTimerRemaining <= 0) {
      stopArcadeTimer();
      setArcadeActive(false);
      const scoreEl =
        document.getElementById('arcade-info-score') ||
        document.querySelector('[id$="-info-score"]');
      const finalScore = scoreEl ? parseInt(scoreEl.textContent, 10) : 0;
      showArcadeGameOver(finalScore);
    } else {
      updateArcadeTimerDisplay();
    }
  }, 1000);
}
function updateArcadeTimerDisplay() {
  const m = Math.floor(arcadeTimerRemaining / 60);
  const s = arcadeTimerRemaining % 60;
  const text = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  // Mise à jour du timer dans la zone arcade-mult-row
  const el = document.getElementById('arcade-info-timer');
  if (el) el.textContent = text;
}

// InfoBar updates are handled by subgames via InfoBar.update; no direct helpers here.

export function stopArcadeTimer() {
  if (arcadeTimerIntervalId) {
    clearInterval(arcadeTimerIntervalId);
    arcadeTimerIntervalId = null;
  }
}
// Plus de ponts globaux: utiliser les import ESM dans les sous-jeux

// Removed window.updateInfoBar override; subgames use InfoBar.update directly
