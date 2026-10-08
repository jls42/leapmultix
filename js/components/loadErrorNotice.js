/**
 * Avis d'un jeu qui n'a pas pu s'ouvrir (mode ou jeu d'Arcade) : au lieu d'un échec muet,
 * un message écrit pour l'enfant, qui reste affiché jusqu'à « D'accord » ou jusqu'au jeu
 * suivant. Quand le chargement a échoué (hors ligne, jeu jamais gardé sur l'appareil), il
 * dit pourquoi et quoi faire. Annoncé aux lecteurs d'écran, il prend le focus et le rend
 * en se fermant ; les textes suivent la langue du jeu (data-translate).
 */
// Dépendances légères : l'avis doit s'afficher même quand un mode n'a pas pu se charger
import { translate } from '../i18n-store.js';

const NOTICE_ID = 'load-error-notice';
const MESSAGE_ID = 'load-error-message';

/** Message d'un script ou d'un module qui n'a pas pu se charger, selon le navigateur */
const LOAD_FAILURE =
  /failed to load script|dynamically imported module|importing a module script failed|failed to fetch|networkerror|load failed/i;

/** Élément qui avait le focus avant l'avis, pour le lui rendre */
let focusBeforeNotice = null;

/**
 * Le jeu n'a pas pu se charger (réseau absent, fichier introuvable), par opposition à une
 * panne du jeu lui-même
 * @param {unknown} error
 * @returns {boolean}
 */
export function isLoadFailure(error) {
  if (globalThis.navigator?.onLine === false) return true;
  return LOAD_FAILURE.test(errorText(error));
}

/** Texte d'une erreur : son message, ou la chaîne reçue ; vide pour le reste */
function errorText(error) {
  if (typeof error === 'string') return error;
  return typeof error?.message === 'string' ? error.message : '';
}

/** Clé du message : chargement impossible (Internet), ou panne générale */
function messageKey(error) {
  return isLoadFailure(error) ? 'mode_load_error' : 'mode_start_error';
}

/** Retire l'avis affiché, sans toucher au focus */
function removeNotice() {
  document.getElementById(NOTICE_ID)?.remove();
}

/** Ferme l'avis et rend le focus à l'élément qui l'avait (le bouton du jeu) */
export function hideLoadErrorNotice() {
  const notice = document.getElementById(NOTICE_ID);
  if (!notice) return;
  const hadFocus = notice.contains(document.activeElement);
  notice.remove();
  if (hadFocus && focusBeforeNotice?.isConnected) focusBeforeNotice.focus({ preventScroll: true });
  focusBeforeNotice = null;
}

/** Élément au texte traduit, retraduit si la langue change pendant l'affichage */
function translatedElement(tagName, key) {
  const element = document.createElement(tagName);
  element.textContent = translate(key);
  element.dataset.translate = key;
  return element;
}

/** Échap ferme l'avis, sans aller plus loin (Échap ramène sinon à « Qui joue ? ») */
function closeOnEscape(event) {
  if (event.key !== 'Escape') return;
  event.preventDefault();
  event.stopPropagation();
  hideLoadErrorNotice();
}

/**
 * Affiche l'avis (un seul à la fois) et place le focus sur « D'accord »
 * @param {unknown} error - Erreur du chargement ou du démarrage
 */
export function showLoadErrorNotice(error) {
  const active = document.activeElement;
  if (!document.getElementById(NOTICE_ID)?.contains(active)) focusBeforeNotice = active;
  removeNotice();
  const key = messageKey(error);
  const notice = document.createElement('div');
  notice.id = NOTICE_ID;
  notice.className = 'load-error-notice';
  notice.setAttribute('role', 'alert');
  const message = translatedElement('p', key);
  message.id = MESSAGE_ID;
  message.className = 'load-error-message';
  const close = translatedElement('button', 'load_error_close');
  close.type = 'button';
  close.className = 'btn btn-secondary';
  close.setAttribute('aria-describedby', MESSAGE_ID);
  close.addEventListener('click', hideLoadErrorNotice);
  notice.addEventListener('keydown', closeOnEscape);
  notice.append(message, close);
  document.body.appendChild(notice);
  close.focus({ preventScroll: true });
}
