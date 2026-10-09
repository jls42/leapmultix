/**
 * Sortie d'une partie en cours : une seule règle, quelle que soit la façon de quitter.
 *
 * Une partie est en cours de sa première question à son enregistrement (dernière réponse,
 * temps écoulé, vies épuisées) ; un jeu d'Arcade, tant que son écran de jeu est affiché.
 * Pendant ce temps, quitter pose la question du bouton « Abandonner » du mode, dans la
 * fenêtre du jeu (components/confirm-dialog.js), le focus sur « Continuer la partie » :
 * - « Abandonner », et Échap qui le presse (accessibility.js) : confirmé, la suite habituelle
 *   du mode (écran de fin, carte des niveaux, fin de partie de l'Arcade…) ;
 * - Accueil, À propos, Tableau de bord, Personnalisation et Changer de joueur (barre du
 *   haut) : confirmé, la partie s'enregistre comme un abandon, puis l'écran demandé s'ouvre.
 * Refusé, la partie continue. Hors partie, rien ne change.
 */
import { getTranslation } from './i18n.js';
import { pauseArcade } from './arcade-time.js';
import { confirmDialog } from './components/confirm-dialog.js';

/** Boutons de la barre du haut qui changent d'écran */
const TOP_BAR_EXITS = '.top-bar .home-btn, .top-bar [data-slide]';
/** Écran d'un jeu d'Arcade en cours et son « Abandonner » (components/infoBar.js) */
const ARCADE_SCREEN = '.slide.active-slide .arcade-game-ui';
const ARCADE_ABANDON = `${ARCADE_SCREEN} [id$="-abandon-btn"]`;
/** « Abandonner » de la partie affichée : celui d'un mode à questions, ou d'un jeu d'Arcade */
const ABANDON_BUTTON = `.slide.active-slide .game-quit button, ${ARCADE_ABANDON}`;

/**
 * Jeu d'Arcade en cours. La question le met d'abord en pause : refusée, la partie attend
 * « Reprendre » (touche P), qui retrouve le focus que la pause lui avait donné. Son
 * « Abandonner » enregistre la partie et affiche la fin ; quitter par la barre du haut
 * l'enregistre aussi (stopArcadeMode) : rien à enregistrer de plus ici.
 */
const arcadeGame = {
  abandonQuestion: () => getTranslation('confirm_abandon_arcade'),
  beforeAsking: pauseArcade,
  focusAfterQuestion: () => document.querySelector('.arcade-resume-btn'),
};

/**
 * Mode affiché (GameMode). Ceux qui ont « Abandonner » (Quiz, Défi, Aventure, Chrono) disent
 * si leur partie est en cours (isGameInProgress), leur question (abandonQuestion), ce qui
 * attend pendant la question (beforeAsking, afterAsking) et ce qu'un abandon enregistre
 * avant de quitter (recordAbandon) ; les autres n'ont jamais de partie.
 */
let activeMode = null;

/**
 * Le mode qui vient de démarrer (GameMode.start)
 * @param {{isGameInProgress?: () => boolean}} mode
 */
export function setActiveMode(mode) {
  activeMode = mode;
}

/** Le mode s'arrête (GameMode.stop) ; un autre a déjà pu prendre sa place */
export function clearActiveMode(mode) {
  if (activeMode === mode) activeMode = null;
}

/**
 * La partie en cours, s'il y en a une
 * @returns {{abandonQuestion: () => string, beforeAsking?: () => void,
 *   afterAsking?: (leaving: boolean) => void, focusAfterQuestion?: () => HTMLElement|null,
 *   recordAbandon?: () => void}|null}
 */
export function gameInProgress() {
  if (activeMode?.isGameInProgress?.()) return activeMode;
  if (globalThis.document?.querySelector(ARCADE_SCREEN)) return arcadeGame;
  return null;
}

/**
 * Pose la question de sortie de la partie, qui attend la réponse (beforeAsking, puis
 * afterAsking). Le focus revient ensuite au bouton pressé, ou là où la partie l'attend
 * (focusAfterQuestion).
 * @param {{abandonQuestion: () => string, beforeAsking?: () => void,
 *   afterAsking?: (leaving: boolean) => void, focusAfterQuestion?: () => HTMLElement|null}} game
 * @param {HTMLElement|null} [origin] - Le bouton pressé
 * @returns {Promise<boolean>} true si l'enfant quitte la partie
 */
export async function askToLeave(game, origin = document.activeElement) {
  game.beforeAsking?.();
  const leaving = await confirmDialog({
    title: getTranslation('exit_dialog_title'),
    message: game.abandonQuestion(),
    confirmLabel: getTranslation('exit_dialog_quit'),
    cancelLabel: getTranslation('exit_dialog_continue'),
    returnFocusTo: game.focusAfterQuestion?.() ?? origin,
  });
  game.afterAsking?.(leaving);
  return leaving;
}

/**
 * Échap pendant une partie : presse son « Abandonner » (même confirmation, même suite)
 * @returns {boolean} true si une partie était en cours : Échap ne fait alors rien d'autre
 */
export function pressAbandon() {
  if (!gameInProgress()) return false;
  document.querySelector(ABANDON_BUTTON)?.click();
  return true;
}

/** Sortie confirmée, rejouée par le garde : son clic passe */
let replaying = false;

/**
 * Sortie cliquée pendant une partie : le clic s'arrête le temps de la question. Confirmée,
 * la partie s'enregistre comme un abandon, puis le clic repart vers son bouton.
 * @param {MouseEvent} event
 */
function guardExit(event) {
  const target = event.target;
  if (replaying || !(target instanceof Element)) return;
  const exit = target.closest(TOP_BAR_EXITS) ?? target.closest(ARCADE_ABANDON);
  const game = exit && gameInProgress();
  if (!game) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  leaveIfConfirmed(exit, game).catch(error => console.error('Sortie de partie impossible', error));
}

/**
 * Pose la question ; confirmée, la sortie a lieu, si son bouton est encore là
 * @param {HTMLElement} exit
 * @param {{abandonQuestion: () => string, recordAbandon?: () => void}} game
 * @returns {Promise<void>}
 */
async function leaveIfConfirmed(exit, game) {
  if (!(await askToLeave(game, exit)) || !exit.isConnected) return;
  if (gameInProgress() === game) game.recordAbandon?.();
  replaying = true;
  try {
    exit.click();
  } finally {
    replaying = false;
  }
}

let guardInstalled = false;

/** Garde des sorties, en capture : il passe avant les écouteurs des boutons */
export function installExitGuard() {
  if (guardInstalled || typeof document === 'undefined') return;
  document.addEventListener('click', guardExit, true);
  guardInstalled = true;
}

installExitGuard();
