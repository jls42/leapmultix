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
  startBackgroundRotation,
  updateWelcomeMessageUI,
  showMessage,
} from '../utils-es6.js';
import { updateVolume } from './theme.js';
import { displayDailyChallenge } from '../game.js';

export function refreshUserList() {
  try {
    UserManager.refreshUserList();
  } catch {
    const userListDiv = document.getElementById('user-list');
    if (userListDiv)
      userListDiv.textContent = getTranslation('no_existing_users') || 'Aucun utilisateur existant';
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

  updateBackgroundByAvatar(userData.avatar || 'fox');
  startBackgroundRotation(userData.avatar || 'fox');

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
