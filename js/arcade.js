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
import { arcadeSpriteLoader } from './arcade-sprite-loader.js';
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
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault(); // Empêcher le scroll de la page
  }
  if (e.key === 'ArrowLeft') arcadeControls.leftPressed = true;
  if (e.key === 'ArrowRight') arcadeControls.rightPressed = true;
}
export function arcadeKeyUp(e) {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault(); // Empêcher le scroll de la page
  }
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

/**
 * Affiche l'écran de fin d'une partie d'arcade.
 * @param {number} score - Score de la partie
 * @param {{persist?: boolean}} [options] - persist: false pour réafficher l'écran
 *   (après une remise à zéro) sans réenregistrer le score ni le relire à voix haute
 */
/** Coupe la voix en cours : l'écran de fin ne parle pas par-dessus la partie. */
function cancelSpeech() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
  } catch (e) {
    void e;
  }
}

/**
 * Phrase de fin : encouragement à zéro point, félicitations chiffrées sinon.
 * @param {number} score
 * @returns {{key: string, text: string}}
 */
function gameOverMessage(score) {
  if (score === 0) {
    return { key: 'arcade_try_again', text: getTranslation('arcade_try_again') };
  }
  // Le score est dynamique : la phrase se compose, elle ne porte pas data-translate
  return {
    key: 'arcade_final_score_message',
    text: `${getTranslation('arcade_final_congrats')} ${score} ${getTranslation('points_label')}`,
  };
}

export function showArcadeGameOver(score, { persist = true } = {}) {
  // Arrêter le sous-jeu en même temps que le chronomètre : boucles, minuteries et
  // écouteurs (arcade:stop). Sinon, à la fin du temps, la partie continuait sans être
  // vue : messages sur l'écran de fin, second enregistrement du score, touches avalées.
  stopArcadeMode();
  cancelSpeech();

  // Historique des scores, par utilisateur et par mode
  const mode = globalGameState?.gameMode ?? 'arcade';
  if (persist) saveScoreForMode(mode, score);
  const arcadeScores = getScoresForMode(mode);
  const { key: endMessageKey, text: endMessage } = gameOverMessage(score);

  renderGameOverScreen({ mode, score, endMessageKey, endMessage, arcadeScores, persist });
  if (persist && isVoiceEnabled()) speak(endMessage);
}

/**
 * Remplace l'écran de jeu par l'écran de fin et rebranche ses boutons.
 * @param {{mode: string, score: number, endMessageKey: string, endMessage: string,
 *          arcadeScores: Array, persist: boolean}} params
 */
function renderGameOverScreen({ mode, score, endMessageKey, endMessage, arcadeScores, persist }) {
  const gameScreen = document.getElementById('game');
  if (!gameScreen) return;
  while (gameScreen.firstChild) gameScreen.removeChild(gameScreen.firstChild);
  const wrapper = buildGameOverWrapper(mode, score, endMessageKey, endMessage, arcadeScores);
  gameScreen.appendChild(wrapper);
  // Actions liées aux boutons de CET écran : un second affichage rapproché
  // ne peut plus doubler les écouteurs (ni les relances, ni les confirmations)
  bindGameOverActions(wrapper, mode, score);
  // Le canevas qui avait le focus a disparu : le focus va sur le titre de l'écran de
  // fin (pas sur « Rejouer », qu'une barre d'espace encore enfoncée relancerait)
  if (persist) focusGameOverTitle(wrapper);
}

function focusGameOverTitle(wrapper) {
  const title = wrapper.querySelector('h2');
  if (!title) return;
  title.setAttribute('tabindex', '-1');
  try {
    title.focus({ preventScroll: true });
  } catch {
    title.focus();
  }
}

async function restartArcadeGame(mode) {
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
    }
    const mod = await import('./arcade-invasion.js');
    return mod.startMultiplicationInvasion?.();
  } catch (e) {
    console.error('Unable to restart arcade subgame:', e);
  }
}

async function returnToArcadeMenu(button) {
  if (button.dataset.clicked) return; // prevent double-trigger
  button.dataset.clicked = 'true';
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
}

// Nom de chaque jeu (clé de traduction, repli), pour dire quels scores seront effacés
const GAME_TITLES = new Map([
  ['multisnake', ['arcade_snake_title', 'MultiSnake']],
  ['multimiam', ['arcade_pacman_title', 'MultiMiam']],
  ['multimemory', ['arcade.multiMemory.title', 'MultiMemory']],
  ['invasion', ['arcade_invasion_title', 'MultiInvaders']],
]);

function getGameTitle(mode) {
  const [key, fallback] = GAME_TITLES.get(mode) || GAME_TITLES.get('invasion');
  return translated(key, fallback);
}

function confirmAndResetScores(mode, score) {
  const canConfirm = typeof globalThis !== 'undefined' && typeof globalThis.confirm === 'function';
  // Seuls les scores de CE jeu sont effacés : la question le dit
  const question = getTranslation('reset_scores_confirm', { game: getGameTitle(mode) });
  if (canConfirm ? globalThis.confirm(question) : true) {
    resetScoresForMode(mode);
    // Même partie, même score affiché : seule la liste des meilleurs scores se vide
    showArcadeGameOver(score, { persist: false });
    // Le bouton de remise à zéro a disparu avec la liste : le focus va sur « Rejouer »
    const retry = document.getElementById('arcade-retry-btn');
    try {
      retry?.focus({ preventScroll: true });
    } catch {
      retry?.focus();
    }
  }
}

function bindGameOverActions(wrapper, mode, score) {
  wrapper
    .querySelector('#arcade-retry-btn')
    ?.addEventListener('click', () => restartArcadeGame(mode));
  const backBtn = wrapper.querySelector('#arcade-back-btn');
  backBtn?.addEventListener('click', () => returnToArcadeMenu(backBtn));
  wrapper.querySelector('#arcade-home-btn')?.addEventListener('click', () => goToSlide(1));
  wrapper
    .querySelector('#arcade-reset-btn')
    ?.addEventListener('click', () => confirmAndResetScores(mode, score));
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

function resetScoresForMode(mode) {
  switch (mode) {
    case 'multisnake':
      return resetArcadeScoresSnake();
    case 'multimiam':
      return resetArcadeScoresPacman();
    case 'multimemory':
      return resetArcadeScoresMemory();
    default:
      return resetArcadeScores();
  }
}

/**
 * Traduction avec texte de repli si la clé manque (getTranslation renvoie « [clé] »).
 * @param {string} key - Clé de traduction
 * @param {string} fallback - Texte de repli (français)
 * @returns {string}
 */
function translated(key, fallback) {
  const value = getTranslation(key);
  if (typeof value !== 'string' || !value || /^\[[^\]]+\]$/.test(value)) return fallback;
  return value;
}

/**
 * Bouton traduit (le texte suit aussi les changements de langue via data-translate).
 * @param {{id: string, className: string, key: string, fallback: string}} options
 * @returns {HTMLButtonElement}
 */
function createTranslatedButton({ id, className, key, fallback }) {
  const button = document.createElement('button');
  button.type = 'button';
  button.id = id;
  button.className = className;
  button.setAttribute('data-translate', key);
  button.textContent = translated(key, fallback);
  return button;
}

/**
 * Phrase de résultat : le score est dans la phrase, mis en valeur, pas dans une tuile.
 * @returns {HTMLParagraphElement}
 */
function buildResultSentence(score, endMessageKey, endMessage) {
  const result = document.createElement('p');
  result.className = 'arcade-final-score arcade-end-message';
  if (score === 0) {
    result.setAttribute('data-translate', endMessageKey);
    result.textContent = endMessage;
    return result;
  }
  const strong = document.createElement('strong');
  strong.textContent = String(score);
  result.append(
    `${translated('arcade_final_congrats', 'Bravo ! Tu as marqué')} `,
    strong,
    ` ${translated('points_label', 'points')}`
  );
  return result;
}

/**
 * Meilleurs scores de ce jeu, avec la remise à zéro juste dessous (discrète).
 * @returns {HTMLElement|null} null s'il n'y a encore aucun score
 */
function buildTopScores(arcadeScores) {
  // Une partie à 0 point reste comptée (tableau de bord), mais n'est pas un « meilleur score »
  const bestScores = Array.isArray(arcadeScores)
    ? arcadeScores.map(Number).filter(s => Number.isFinite(s) && s > 0)
    : [];
  if (bestScores.length === 0) return null;
  const topWrap = document.createElement('section');
  topWrap.className = 'arcade-top-scores';
  const title = document.createElement('h3');
  title.setAttribute('data-translate', 'arcade_top_scores');
  title.textContent = translated('arcade_top_scores', 'Meilleurs scores');
  const ol = document.createElement('ol');
  bestScores.forEach(s => {
    const li = document.createElement('li');
    li.textContent = String(s);
    ol.appendChild(li);
  });
  const resetBtn = createTranslatedButton({
    id: 'arcade-reset-btn',
    className: 'btn btn-quiet btn-danger btn-sm',
    key: 'reset_scores_button',
    fallback: 'Remettre à zéro les scores',
  });
  topWrap.append(title, ol, resetBtn);
  return topWrap;
}

function buildGameOverWrapper(mode, score, endMessageKey, endMessage, arcadeScores) {
  // Une seule surface : la content-card commune
  const wrapper = document.createElement('div');
  wrapper.className = 'arcade-gameover content-card';

  const h2 = document.createElement('h2');
  h2.setAttribute('data-translate', 'game_over');
  h2.textContent = translated('game_over', 'Fin de partie !');
  wrapper.appendChild(h2);

  wrapper.appendChild(buildResultSentence(score, endMessageKey, endMessage));

  // Rejouer d'abord (touche primaire), les retours en secondaire
  const actions = document.createElement('div');
  actions.className = 'arcade-gameover-actions';
  actions.append(
    createTranslatedButton({
      id: 'arcade-retry-btn',
      className: 'btn',
      key: 'retry_button',
      fallback: 'Rejouer',
    }),
    createTranslatedButton({
      id: 'arcade-back-btn',
      className: 'btn btn-secondary',
      key: 'back_to_arcade_menu',
      fallback: 'Retour au menu Arcade',
    }),
    createTranslatedButton({
      id: 'arcade-home-btn',
      className: 'btn btn-secondary',
      key: 'back_to_home',
      fallback: "Retour à l'accueil",
    })
  );
  wrapper.appendChild(actions);

  const topScores = buildTopScores(arcadeScores);
  if (topScores) wrapper.appendChild(topScores);
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
  monsterSpriteNames.push(`monstre${num}_right_128x128.png`);
}
// Include newly added monsters 146–155
for (let i = 146; i <= 155; i++) {
  const num = i.toString().padStart(2, '0');
  monsterSpriteNames.push(`monstre${num}_right_128x128.png`);
}
export const monsterSprites = monsterSpriteNames.map(name => {
  // Remove .png extension for sprite loader
  const spriteName = name.replace(/\.png$/, '');
  return arcadeSpriteLoader.loadSpriteSync(spriteName, 'monster');
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
      const finalScore = scoreEl ? Number.parseInt(scoreEl.textContent, 10) : 0;
      showArcadeGameOver(Number.isFinite(finalScore) ? finalScore : 0);
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
