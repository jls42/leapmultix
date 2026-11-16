/**
 * Écran allumé pendant une partie (Screen Wake Lock) : tant que l'écran de jeu est affiché
 * (slide4 : les modes, la carte de l'Aventure, le menu et les six jeux de l'Arcade), le
 * téléphone ou la tablette ne s'assombrit pas pendant que l'enfant réfléchit.
 *
 * - Après IDLE_MS sans toucher ni touche, la veille habituelle revient : une partie oubliée
 *   sur la table ne garde pas l'écran allumé ; le premier geste la reprend.
 * - Le navigateur rend le verrou quand la page est cachée (autre appli, écran éteint) : il se
 *   redemande au retour, si l'écran de jeu est encore affiché.
 * - Sans l'API (navigateur ancien) ou sur un refus (économie d'énergie), rien ne change.
 */

/** Écran de jeu, celui où l'écran reste allumé */
export const GAME_SLIDE = 'slide4';
/** Temps sans geste après lequel la veille habituelle revient (5 min) */
export const IDLE_MS = 5 * 60 * 1000;

let onGameScreen = false;
// Un geste récent (moins de IDLE_MS) : l'écran doit rester allumé
let recentGesture = false;
let lock = null;
let asking = false;
let idleTimer = null;
let installed = false;

function shouldHold() {
  return onGameScreen && recentGesture && document.visibilityState === 'visible';
}

function letGo() {
  const held = lock;
  lock = null;
  held?.release().catch(() => {
    /* verrou déjà rendu par le navigateur (page cachée) : rien de plus à rendre */
  });
}

async function hold() {
  const wakeLock = globalThis.navigator?.wakeLock;
  if (!wakeLock || lock || asking || !shouldHold()) return;
  asking = true;
  try {
    const granted = await wakeLock.request('screen');
    lock = granted;
    granted.addEventListener('release', () => {
      if (lock === granted) lock = null;
    });
    // L'écran de jeu a pu être quitté pendant la demande
    if (!shouldHold()) letGo();
  } catch {
    /* refus (économie d'énergie, page cachée entre-temps) : la veille habituelle reste */
  } finally {
    asking = false;
  }
}

/** Un geste de l'enfant, l'écran de jeu qui s'ouvre ou la page qui revient : IDLE_MS de plus */
function noteActivity() {
  if (!onGameScreen) return;
  recentGesture = true;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    recentGesture = false;
    letGo();
  }, IDLE_MS);
  void hold();
}

function onVisibilityChange() {
  if (document.visibilityState === 'visible') noteActivity();
}

/**
 * L'écran affiché change (watchSlideChanges de core/mainInit.js) : seul l'écran de jeu garde
 * l'écran allumé
 * @param {string} slideId - id de la slide devenue active
 */
export function screenShown(slideId) {
  onGameScreen = slideId === GAME_SLIDE;
  if (onGameScreen) {
    noteActivity();
    return;
  }
  recentGesture = false;
  clearTimeout(idleTimer);
  letGo();
}

/** Gestes et retours sur la page, écoutés une seule fois (core/mainInit.js) */
export function installScreenAwake() {
  if (installed) return;
  installed = true;
  const passive = { capture: true, passive: true };
  document.addEventListener('pointerdown', noteActivity, passive);
  document.addEventListener('keydown', noteActivity, passive);
  document.addEventListener('visibilitychange', onVisibilityChange);
}
