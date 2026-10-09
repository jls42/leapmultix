/**
 * Wrapper ES6 pour utils.js
 * Ce fichier permet aux nouveaux modes refactorisés d'importer les fonctions utils
 * tout en préservant la compatibilité des scripts classiques.
 */

import { Utils } from './core/utils.js';
export { speak, isVoiceEnabled, updateSpeechVoice } from './speech.js';
// getTranslation sert aussi ici, à numberToWords
import { getTranslation as _getTranslation } from './i18n.js';
export {
  getTranslation,
  loadTranslations,
  applyStaticTranslations,
  updateLanguageButtons,
  changeLanguage,
} from './i18n.js';
export {
  saveArcadeScore,
  getArcadeScores,
  resetArcadeScores,
  saveArcadeScoreSnake,
  getArcadeScoresSnake,
  resetArcadeScoresSnake,
  saveArcadeScorePacman,
  getArcadeScoresPacman,
  resetArcadeScoresPacman,
  saveArcadeScoreMemory,
  getArcadeScoresMemory,
  resetArcadeScoresMemory,
} from './arcade-scores.js';
export { updateInfoBar } from './components/infoBar.js';
// Petits helpers legacy conservés accessibles via imports
export { updateCoinDisplay } from './coin-display.js';
export { cleanupGameResources, getEventListeners } from './game-cleanup.js';
// ES module utilities aggregation for refactored codebase
// (legacy utils.js is now an ESM facade and no longer attaches globals)

import { AudioManager } from './core/audio.js';
export const playSound = (name, options) => AudioManager.playSound(name, options);
export { showFeedback, showMessage } from './ui-feedback.js';
export { showNotification } from './notifications.js';
export { showArcadePoints } from './arcade-points.js';
export { showCoinGainAnimation, triggerCoinCountAnimation } from './coin-effects.js';
export { getWeakTables, getDailyChallengeTable } from './stats-utils.js';
// ESM message helper (no window bridge)
export { showArcadeMessage } from './arcade-message.js';
export const addArrowKeyNavigation = Utils.addArrowKeyNavigation;

/**
 * Wrapper pour numberToWords qui injecte automatiquement getTranslation
 * Cela permet d'utiliser les fichiers de traduction i18n avec la langue active
 */
export const numberToWords = num => {
  return Utils.numberToWords(num, _getTranslation);
};

export const getStarsHTML = Utils.getStarsHTML;
// Plus de pont global: utiliser les imports ESM (main-helpers)

export {
  updateBackgroundByAvatar,
  startBackgroundRotation,
  renderAvatarSelector,
  updateWelcomeMessageUI,
  updateSeoHeroImage,
} from './main-helpers.js';

// Export de l'objet utilitaire modernisé
export { Utils } from './core/utils.js';
