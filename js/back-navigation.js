/**
 * Bouton « retour » du téléphone, dans l'appli Android : il revient à l'écran précédent au
 * lieu de fermer l'appli. L'appli demande à la page (événement `backbutton` sur le document,
 * annulable) ; la page l'annule quand elle a su reculer, sinon l'appli se ferme.
 *
 * Le jeu ne passe pas par l'historique du navigateur : la règle est ici, du plus proche au
 * plus lointain.
 * 1. Une fenêtre ou le menu de la barre du haut est ouvert : le retour le ferme, comme Échap.
 * 2. Une partie est en cours : il presse son « Abandonner » (game-exit.js), qui pose la
 *    question ; un second retour ferme la question et la partie continue.
 * 3. L'écran a son propre bouton de retour (`data-back` : menu de l'Arcade, liste des
 *    tables, carte des niveaux, réglages du Chrono…) : il le presse.
 * 4. Sinon il revient à l'écran d'où l'on venait (le fil des écrans traversés, sans les
 *    écrans de jeu : on ne revient pas dans une partie finie).
 * 5. Sur « Qui joue ? », le premier écran, il ne fait rien : l'appli se ferme.
 *
 * Sur le site, aucun navigateur n'envoie cet événement : rien ne change.
 */
import { accessibilityManager } from './accessibility.js';
import { pressAbandon } from './game-exit.js';

/** Événement que l'appli envoie au document (le nom de Cordova et de Capacitor) */
export const BACK_EVENT = 'backbutton';
/** Premier écran, « Qui joue ? » : le retour y ferme l'appli */
const FIRST_SCREEN = 'slide0';
/** Écrans de jeu et de résultats : le retour n'y ramène jamais */
const GAME_SCREENS = new Set(['slide4', 'slide5']);
const ACTIVE_SCREEN = '.slide.active-slide';
/** Bouton de retour propre à l'écran affiché, posé par les modes */
const OWN_BACK_BUTTON = `${ACTIVE_SCREEN} [data-back]`;

/** Écrans hors jeu traversés, du premier au dernier */
const trail = [];

/**
 * Un écran vient de s'afficher. Revenir sur un écran déjà traversé raccourcit le fil
 * jusqu'à lui : « Retour à l'accueil » puis le retour du téléphone ne tournent pas en rond.
 * @param {string} slideId - id de l'écran devenu actif
 */
export function slideShown(slideId) {
  if (!slideId || GAME_SCREENS.has(slideId)) return;
  const known = trail.indexOf(slideId);
  if (known === -1) trail.push(slideId);
  else trail.length = known + 1;
}

/** Vide le fil des écrans (tests) */
export function forgetScreens() {
  trail.length = 0;
}

/** Un élément que l'enfant voit et peut presser */
function isPressable(element) {
  if (element.disabled) return false;
  return typeof element.checkVisibility === 'function'
    ? element.checkVisibility({ checkVisibilityCSS: true })
    : element.getClientRects().length > 0;
}

/** Échap, pour la fenêtre ouverte : chacune sait se fermer à cette touche */
function pressEscape() {
  const target = document.activeElement ?? document.body;
  target.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
  );
}

/**
 * L'écran où le retour ramène, depuis l'écran affiché
 * @returns {string|null} id de l'écran, ou null sur le premier écran
 */
function previousScreen() {
  const active = document.querySelector(ACTIVE_SCREEN)?.id;
  if (!active || active === FIRST_SCREEN) return null;
  // Depuis un jeu, le dernier écran traversé ; sinon celui d'avant l'écran affiché
  if (GAME_SCREENS.has(active)) return trail.at(-1) ?? FIRST_SCREEN;
  const index = trail.lastIndexOf(active);
  return index > 0 ? trail.at(index - 1) : FIRST_SCREEN;
}

/** Ouvre un écran (slides.js chargé à la demande, comme dans accessibility.js) */
function openScreen(slideId) {
  import('./slides.js')
    .then(m => m.goToSlide(slideId))
    .catch(error => console.error('Retour à l’écran précédent impossible', error));
}

/**
 * Le retour du téléphone
 * @returns {boolean} true si le jeu a reculé ; false sur le premier écran (l'appli se ferme)
 */
export function goBack() {
  if (accessibilityManager.isDialogOpen()) {
    pressEscape();
    return true;
  }
  if (pressAbandon()) return true;
  const button = Array.from(document.querySelectorAll(OWN_BACK_BUTTON)).find(isPressable);
  if (button) {
    button.click();
    return true;
  }
  const target = previousScreen();
  if (!target) return false;
  openScreen(target);
  return true;
}

let installed = false;

/** Écoute le retour de l'appli ; l'écran affiché au chargement ouvre le fil */
export function installBackNavigation() {
  if (installed || typeof document === 'undefined') return;
  installed = true;
  slideShown(document.querySelector(ACTIVE_SCREEN)?.id);
  document.addEventListener(BACK_EVENT, event => {
    if (goBack()) event.preventDefault();
  });
}
