/**
 * Notification utilities (ESM)
 *
 * Les notifications sont des toasts (style .notification dans css/general.css),
 * empilés dans une zone unique, en bas et au centre (la barre du haut reste
 * visible), qui est aussi une région « live » polie : les lecteurs d'écran
 * annoncent chaque nouveau message.
 */
import { createSafeElement } from './security-utils.js';

const STACK_ID = 'toast-stack';
const VISIBLE_MS = 6000;
const EXIT_MS = 400;

/**
 * Zone d'empilement des toasts, créée au premier besoin.
 * @returns {HTMLElement}
 */
function getToastStack() {
  let stack = document.getElementById(STACK_ID);
  if (!stack) {
    stack = document.createElement('div');
    stack.id = STACK_ID;
    stack.className = 'toast-stack';
    stack.setAttribute('role', 'status');
    stack.setAttribute('aria-live', 'polite');
    document.body.appendChild(stack);
  }
  return stack;
}

/**
 * Contenu d'un toast : image facultative (décorative), titre facultatif, message.
 * @param {HTMLElement} notification
 * @param {string} icon
 * @param {string} message
 * @param {string} title
 */
function fillNotification(notification, icon, message, title) {
  const iconText = String(icon || '').trim();
  if (iconText) {
    notification.appendChild(
      createSafeElement('span', iconText, { class: 'notification-icon', 'aria-hidden': 'true' })
    );
  }
  const body = createSafeElement('span', '', { class: 'notification-body' });
  if (title) {
    body.appendChild(createSafeElement('span', String(title), { class: 'notification-title' }));
  }
  body.appendChild(
    createSafeElement('span', String(message || ''), { class: 'notification-message' })
  );
  notification.appendChild(body);
}

/**
 * Affiche un toast pendant quelques secondes.
 * @param {string} type - Variante : 'badge', 'info'…
 * @param {string} icon - Image courte (émoji du badge), décorative ; vide pour aucune
 * @param {string} message - Texte principal
 * @param {Object} [options]
 * @param {string} [options.title] - Titre affiché au-dessus du message
 * @returns {HTMLElement} Le toast créé
 */
export function showNotification(type, icon, message, options = {}) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  getToastStack().appendChild(notification);

  // Le contenu arrive après l'insertion : la région live l'annonce
  setTimeout(() => {
    fillNotification(notification, icon, message, options.title);
    notification.classList.add('active');
  }, 10);
  setTimeout(() => {
    notification.classList.remove('active');
    setTimeout(() => {
      notification.remove();
    }, EXIT_MS);
  }, VISIBLE_MS);
  return notification;
}
export default { showNotification };
