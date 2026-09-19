/**
 * User UI helpers extracted from main.js wrappers
 */
import UserManager from '../userManager.js';
import { UserState } from '../core/userState.js';
import { gameState } from '../game.js';
import { goToSlide } from '../slides.js';
import {
  getTranslation,
  updateCoinDisplay,
  updateBackgroundByAvatar,
  updateWelcomeMessageUI,
  showMessage,
} from '../utils-es6.js';
import { updateVolume } from './theme.js';
import { displayDailyChallenge } from '../game.js';

/**
 * Affiche les tuiles « Qui joue ? » (rendu : UserManager.refreshUserList).
 * Si ce rendu échoue, la liste affiche au moins un message lisible.
 */
export function refreshUserList() {
  try {
    UserManager.refreshUserList();
  } catch {
    const userListDiv = document.getElementById('user-list');
    if (userListDiv) {
      const message = getTranslation('no_existing_users');
      userListDiv.textContent =
        typeof message === 'string' && !/^\[.*\]$/.test(message)
          ? message
          : 'Aucun joueur pour l’instant.';
    }
  }
}

export function deleteUser(name) {
  if (UserManager.deleteUser(name)) {
    refreshUserList();
    showMessage(getTranslation('user_deleted_message', { name }));
  }
}

export function selectUser(name) {
  UserManager.selectUser(name);
  const userData = UserState.getCurrentUserData();
  updateVolume(userData.volume !== undefined ? userData.volume : 1);
  gameState.avatar = userData.avatar || 'fox';
  gameState.nickname = userData.nickname || UserManager.getCurrentUser();

  // Un monde illustré fixe par avatar (plus de rotation du fond)
  updateBackgroundByAvatar(userData.avatar || 'fox');

  updateWelcomeMessageUI().catch(e => {
    void e; /* no-op */
  });
  updateCoinDisplay();
  try {
    displayDailyChallenge();
  } catch (e) {
    void e; /* no-op */
  }

  localStorage.removeItem('arcadeScores_default');
  localStorage.removeItem('arcadeScores_multisnake_default');
  localStorage.removeItem('arcadeScores_multimiam_default');
  goToSlide(1);
}
