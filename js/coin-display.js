// coin-display.js - ESM helper to update coin counters across the UI

import { UserState } from './core/userState.js';

/**
 * Met à jour l'affichage des pièces dans toutes les zones (TopBar, etc.)
 * @param {number} [count] - Optionnel: valeur explicite; sinon, lit depuis UserState
 */
export function updateCoinDisplay(count) {
  let coins = typeof count === 'number' ? count : 0;
  try {
    if (typeof count !== 'number') {
      const userData = UserState.getCurrentUserData();
      coins = userData && typeof userData.coins === 'number' ? userData.coins : 0;
    }
  } catch {
    // ignore: fallback to 0
  }

  document.querySelectorAll('.coin-count').forEach(el => {
    el.textContent = coins;
  });
}
