/**
 * Wrapper ES6 pour utils.js
 * Ce fichier permet aux nouveaux modes refactorisés d'importer les fonctions utils
 * tout en préservant la compatibilité des scripts classiques.
 */

import { Utils } from './core/utils.js';
import {
  speak as _speak,
  isVoiceEnabled as _isVoiceEnabled,
  updateSpeechVoice as _updateSpeechVoice,
} from './speech.js';
import {
  getTranslation as _getTranslation,
  loadTranslations as _loadTranslations,
  applyStaticTranslations as _applyStaticTranslations,
  updateLanguageButtons as _updateLanguageButtons,
  changeLanguage as _changeLanguage,
} from './i18n.js';
import {
  saveArcadeScore as _saveArcadeScore,
  getArcadeScores as _getArcadeScores,
  resetArcadeScores as _resetArcadeScores,
  saveArcadeScoreSnake as _saveArcadeScoreSnake,
  getArcadeScoresSnake as _getArcadeScoresSnake,
  resetArcadeScoresSnake as _resetArcadeScoresSnake,
  saveArcadeScorePacman as _saveArcadeScorePacman,
  getArcadeScoresPacman as _getArcadeScoresPacman,
  resetArcadeScoresPacman as _resetArcadeScoresPacman,
  saveArcadeScoreMemory as _saveArcadeScoreMemory,
  getArcadeScoresMemory as _getArcadeScoresMemory,
  resetArcadeScoresMemory as _resetArcadeScoresMemory,
} from './arcade-scores.js';
import {
  updateBackgroundByAvatar as _updateBackgroundByAvatar,
  startBackgroundRotation as _startBackgroundRotation,
  renderAvatarSelector as _renderAvatarSelector,
  updateWelcomeMessageUI as _updateWelcomeMessageUI,
} from './main-helpers.js';
import { updateInfoBar as _updateInfoBar } from './components/infoBar.js';
import { updateCoinDisplay as _updateCoinDisplay } from './coin-display.js';
import {
  cleanupGameResources as _cleanupGameResources,
  getEventListeners as _getEventListeners,
} from './game-cleanup.js';
// ES module utilities aggregation for refactored codebase
// (legacy utils.js is now an ESM facade and no longer attaches globals)

export const getTranslation = _getTranslation;
export const speak = _speak;
export const isVoiceEnabled = _isVoiceEnabled;
import { AudioManager } from './core/audio.js';
export const playSound = (name, options) => AudioManager.playSound(name, options);
export const updateInfoBar = _updateInfoBar;
import { showFeedback as _showFeedback, showMessage as _showMessage } from './ui-feedback.js';
export const showFeedback = _showFeedback;
import { showNotification as _showNotification } from './notifications.js';
import { showArcadePoints as _showArcadePoints } from './arcade-points.js';
import {
  showCoinGainAnimation as _showCoinGainAnimation,
  triggerCoinCountAnimation as _triggerCoinCountAnimation,
} from './coin-effects.js';
import {
  getWeakTables as _getWeakTables,
  getDailyChallengeTable as _getDailyChallengeTable,
} from './stats-utils.js';
export const showNotification = _showNotification;
export const showCoinGainAnimation = _showCoinGainAnimation;
export const triggerCoinCountAnimation = _triggerCoinCountAnimation;
export const showArcadePoints = _showArcadePoints;
// ESM message helper (no window bridge)
import { showArcadeMessage as _showArcadeMessage } from './arcade-message.js';
export const showArcadeMessage = _showArcadeMessage;
export const showMessage = _showMessage;
export const saveArcadeScore = _saveArcadeScore;
export const getArcadeScores = _getArcadeScores;
export const resetArcadeScores = _resetArcadeScores;
export const saveArcadeScoreSnake = _saveArcadeScoreSnake;
export const getArcadeScoresSnake = _getArcadeScoresSnake;
export const resetArcadeScoresSnake = _resetArcadeScoresSnake;
export const saveArcadeScorePacman = _saveArcadeScorePacman;
export const getArcadeScoresPacman = _getArcadeScoresPacman;
export const resetArcadeScoresPacman = _resetArcadeScoresPacman;
export const saveArcadeScoreMemory = _saveArcadeScoreMemory;
export const getArcadeScoresMemory = _getArcadeScoresMemory;
export const resetArcadeScoresMemory = _resetArcadeScoresMemory;
export const getWeakTables = _getWeakTables;
export const getDailyChallengeTable = _getDailyChallengeTable;
export const addArrowKeyNavigation = Utils.addArrowKeyNavigation;

/**
 * Wrapper pour numberToWords qui injecte automatiquement getTranslation
 * Cela permet d'utiliser les fichiers de traduction i18n avec la langue active
 */
export const numberToWords = num => {
  return Utils.numberToWords(num, _getTranslation);
};

export const getStarsHTML = Utils.getStarsHTML;
export const cleanupGameResources = _cleanupGameResources;
export const getEventListeners = _getEventListeners;
// Main.js utilities exposed as globals (bridge for modules)
// Helpers migrés vers ES6 (source: main-helpers.js)
export const updateBackgroundByAvatar = _updateBackgroundByAvatar;
export const startBackgroundRotation = _startBackgroundRotation;
export const renderAvatarSelector = _renderAvatarSelector;
export const updateWelcomeMessageUI = _updateWelcomeMessageUI;

// Plus de pont global: utiliser les imports ESM (main-helpers)

// Petits helpers legacy conservés accessibles via imports
export const updateCoinDisplay = _updateCoinDisplay;

// Plus de bridge global pour updateCoinDisplay; importer depuis './coin-display.js'

// Fonctions supplémentaires qui ne sont pas globales mais définies dans utils.js
export const loadTranslations = _loadTranslations;
export const applyStaticTranslations = _applyStaticTranslations;
export const updateLanguageButtons = _updateLanguageButtons;
export const updateSpeechVoice = _updateSpeechVoice;
export const changeLanguage = _changeLanguage;

// Export de l'objet utilitaire modernisé
export { Utils };
