/**
 * Parental lock popup + minor avatar style patch
 */

import { randomInt } from './random.js';

export function showParentalLockPopup(callbackOnSuccess) {
  const popup = document.getElementById('parental-lock-popup');
  const questionEl = document.getElementById('parental-question');
  const answerInput = document.getElementById('parental-answer');
  const errorEl = document.getElementById('parental-error');

  if (!popup || !questionEl || !answerInput || !errorEl) return;

  const num1 = randomInt(10, 50);
  const num2 = randomInt(10, 50);
  const expectedAnswer = num1 + num2;

  questionEl.textContent = `${num1} + ${num2} = ?`;
  answerInput.value = '';
  errorEl.textContent = '';
  answerInput.dataset.expectedAnswer = expectedAnswer;
  popup.callbackOnSuccess = callbackOnSuccess;

  popup.style.display = 'flex';
  setTimeout(() => {
    popup.classList.add('visible');
    try {
      answerInput.focus();
    } catch {
      /* no-op */
    }
  }, 10);
}

export function removeAvatarAfterCadenas() {
  const style = document.createElement('style');
  style.textContent = `
    .avatar-btn.locked::after {
      content: '' !important;
      background: none !important;
      display: none !important;
      width: 0 !important;
      height: 0 !important;
      padding: 0 !important;
      border: none !important;
      box-shadow: none !important;
      color: transparent !important;
      font-size: 0 !important;
      line-height: 0 !important;
      position: static !important;
      left: auto !important;
      right: auto !important;
      top: auto !important;
      bottom: auto !important;
      z-index: 0 !important;
      pointer-events: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
    }
  `;
  document.head.appendChild(style);
}

export default { showParentalLockPopup, removeAvatarAfterCadenas };
