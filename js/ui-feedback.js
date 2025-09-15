/**
 * UI Feedback helpers (ESM)
 * - showMessage: transient popup message
 * - showFeedback: inline success/error feedback in an element
 * Provides legacy window bridges for compatibility.
 */

export function showMessage(message) {
  const messagePopup = document.createElement('div');
  messagePopup.className = 'message-popup';
  messagePopup.textContent = message;

  document.body.appendChild(messagePopup);

  // Enter animation
  setTimeout(() => {
    messagePopup.classList.add('active');
  }, 10);

  // Auto dismiss
  setTimeout(() => {
    messagePopup.classList.remove('active');
    setTimeout(() => {
      if (document.body.contains(messagePopup)) {
        document.body.removeChild(messagePopup);
      }
    }, 300);
  }, 3000);
}

import { speak } from './speech.js';

export function showFeedback(target, message, type = 'success', speakIt = false) {
  const el = typeof target === 'string' ? document.getElementById(target) : target;
  if (!el) return;
  // Utilise textContent au lieu d'innerHTML pour éviter XSS
  el.textContent = message;
  el.className = `feedback feedback-${type}`;
  el.setAttribute('aria-live', 'polite');
  try {
    if (speakIt) speak(message);
  } catch (e) {
    void e;
  }
}
export default { showMessage, showFeedback };
