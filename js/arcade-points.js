// arcade-points.js - ESM module for displaying arcade point popups
// Extracted from utils.js to enable ES module imports and reduce window.* coupling

import { AudioManager } from './core/audio.js';
import { isArcadeActive } from './arcade.js';

/**
 * Affiche les points gagnés ou perdus dans les jeux arcade
 * @param {number} points - Nombre de points (positif pour gain, négatif pour perte)
 * @param {HTMLElement} targetElement - Élément canvas ou autre où afficher l'animation
 */
export function showArcadePoints(points, targetElement) {
  if (!isArcadeActive()) return;

  const messageElement = document.createElement('div');
  messageElement.className = 'arcade-points-message';

  // Style visuel
  messageElement.style.background = 'rgba(255,255,255,0.92)';
  messageElement.style.borderRadius = '14px';
  messageElement.style.padding = '10px 20px';
  messageElement.style.boxShadow = '0 2px 12px rgba(0,0,0,0.13)';
  messageElement.style.border = '1px solid #eee';

  if (document.body.classList.contains('night') || document.body.dataset.theme === 'dark') {
    messageElement.style.background = 'rgba(40,40,40,0.92)';
    messageElement.style.border = '1px solid #444';
  }

  const prefix = points >= 0 ? '+' : '';
  messageElement.textContent = `${prefix}${points}`;
  messageElement.style.color = points >= 0 ? '#4CAF50' : '#F44336';

  messageElement.style.position = 'absolute';
  messageElement.style.top = '50%';
  messageElement.style.left = '50%';
  messageElement.style.transform = 'translate(-50%, -50%)';
  messageElement.style.fontSize = '28px';
  messageElement.style.fontWeight = 'bold';
  messageElement.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
  messageElement.style.zIndex = '100';
  messageElement.style.transition = 'all 0.8s ease-out';

  if (targetElement && targetElement.parentNode) {
    targetElement.parentNode.appendChild(messageElement);
  } else {
    const game = document.getElementById('game');
    if (game) game.appendChild(messageElement);
  }

  setTimeout(() => {
    messageElement.style.opacity = '0';
    messageElement.style.transform = 'translate(-50%, -100px)';
  }, 100);

  setTimeout(() => {
    messageElement.remove();
  }, 900);

  // Feedback audio direct via AudioManager
  if (points >= 0) {
    AudioManager.playSound('good', { volume: 0.4 });
  } else {
    AudioManager.playSound('bad', { volume: 0.4 });
  }
}

// No legacy bridge; import from utils-es6.js in modules
