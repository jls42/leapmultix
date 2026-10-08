/**
 * Sortie d'une partie en cours : une seule règle, quelle que soit la façon de quitter.
 *
 * Une partie est en cours de sa première question à son enregistrement (dernière réponse,
 * temps écoulé, vies épuisées) ; un jeu d'Arcade, tant que son écran de jeu est affiché.
 * Pendant ce temps, quitter demande la confirmation du bouton « Abandonner » du mode, la
 * même fenêtre du navigateur :
 * - « Abandonner », et Échap qui le presse (accessibility.js) : confirmé, la suite habituelle
 *   du mode (écran de fin, carte des niveaux, fin de partie de l'Arcade…) ;
 * - Accueil, À propos, Tableau de bord, Personnalisation et Changer de joueur (barre du
 *   haut) : confirmé, la partie s'enregistre comme un abandon, puis l'écran demandé s'ouvre.
 * Refusé, la partie continue. Hors partie, rien ne change.
 */
import { getTranslation } from './i18n.js';
import { pauseArcade } from './arcade-time.js';

/** Boutons de la barre du haut qui changent d'écran */
const TOP_BAR_EXITS = '.top-bar .home-btn, .top-bar [data-slide]';
/** Écran d'un jeu d'Arcade en cours et son « Abandonner » (components/infoBar.js) */
const ARCADE_SCREEN = '.slide.active-slide .arcade-game-ui';
const ARCADE_ABANDON = `${ARCADE_SCREEN} [id$="-abandon-btn"]`;
/** « Abandonner » de la partie affichée : celui d'un mode à questions, ou d'un jeu d'Arcade */
const ABANDON_BUTTON = `.slide.active-slide .game-quit button, ${ARCADE_ABANDON}`;

/**
 * Jeu d'Arcade en cours. La question le met d'abord en pause : refusée, la partie attend
 * « Reprendre » (touche P) au lieu de repartir d'un bond du temps passé à lire. Son
 * « Abandonner » enregistre la partie et affiche la fin ; quitter par la barre du haut
 * l'enregistre aussi (stopArcadeMode) : rien à enregistrer de plus ici.
 */
const arcadeGame = {
  abandonQuestion: () => getTranslation('confirm_abandon_arcade'),
  beforeAsking: pauseArcade,
};

/**
 * Mode affiché (GameMode). Ceux qui ont « Abandonner » (Quiz, Défi, Aventure, Chrono) disent
 * si leur partie est en cours (isGameInProgress), leur question (abandonQuestion) et ce qu'un
 * abandon enregistre avant de quitter (recordAbandon) ; les autres n'ont jamais de partie.
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
 *   recordAbandon?: () => void}|null}
 */
export function gameInProgress() {
  if (activeMode?.isGameInProgress?.()) return activeMode;
  if (globalThis.document?.querySelector(ARCADE_SCREEN)) return arcadeGame;
  return null;
}

/**
 * Peut-on quitter ? Oui sans partie en cours ; sinon après la confirmation de « Abandonner »,
 * et la partie est alors enregistrée comme un abandon.
 * @returns {boolean}
 */
export function confirmLeavingGame() {
  const game = gameInProgress();
  if (!game) return true;
  game.beforeAsking?.();
  if (!globalThis.confirm?.(game.abandonQuestion())) return false;
  game.recordAbandon?.();
  return true;
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

/** Sortie cliquée pendant une partie : la confirmation d'abord ; refusée, le clic s'arrête là */
function guardExit(event) {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (!target.closest(TOP_BAR_EXITS) && !target.closest(ARCADE_ABANDON)) return;
  if (confirmLeavingGame()) return;
  event.preventDefault();
  event.stopImmediatePropagation();
}

let guardInstalled = false;

/** Garde des sorties, en capture : il passe avant les écouteurs des boutons */
export function installExitGuard() {
  if (guardInstalled || typeof document === 'undefined') return;
  document.addEventListener('click', guardExit, true);
  guardInstalled = true;
}

installExitGuard();
