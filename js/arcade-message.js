// arcade-message.js - ESM helper to show arcade HUD messages without window bridges
import { getTranslation } from './i18n.js';
import { speak, isVoiceEnabled } from './speech.js';

export function showArcadeMessage(messageKey, color = '#F44336', duration = 1500) {
  const gameContainer = document.getElementById('game');
  if (!gameContainer) return;

  const messageElement = document.createElement('div');
  messageElement.className = 'arcade-message';
  messageElement.style.position = 'absolute';
  messageElement.style.top = '50%';
  messageElement.style.left = '50%';
  messageElement.style.transform = 'translate(-50%, -50%)';
  messageElement.style.background = 'rgba(255,255,255,0.92)';
  messageElement.style.color = color;
  messageElement.style.fontSize = '24px';
  messageElement.style.fontWeight = 'bold';
  messageElement.style.padding = '18px 32px';
  messageElement.style.borderRadius = '14px';
  messageElement.style.boxShadow = '0 2px 12px rgba(0,0,0,0.13)';
  messageElement.style.border = '1px solid #eee';
  messageElement.style.zIndex = '9999';

  if (document.body.classList.contains('night') || document.body.dataset.theme === 'dark') {
    messageElement.style.background = 'rgba(50,50,50,0.92)';
    messageElement.style.border = '1px solid #444';
  }

  messageElement.textContent = getTranslation(messageKey) || messageKey;
  gameContainer.appendChild(messageElement);

  try {
    if (isVoiceEnabled()) speak(messageElement.textContent);
  } catch {
    // Erreur ignorée (non-critique)
  }

  setTimeout(() => {
    if (messageElement.parentNode) messageElement.parentNode.removeChild(messageElement);
  }, duration);
}

export default { showArcadeMessage };
