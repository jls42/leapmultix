export { generateQuestion } from './questionGenerator.js';
export { UserManager } from './userManager.js';
export { gameState } from './game.js';
export { updateDailyChallengeProgress, displayDailyChallenge } from './game.js';
export { UserState } from './core/userState.js';
export { checkAndUnlockBadge, getAllBadges } from './badges.js';
export { getDifficultySettings, DIFFICULTY_SETTINGS } from './difficulty.js';
export { Utils } from './core/utils.js';
export * from './utils-es6.js';
export { TopBar } from './components/topBar.js';
export { InfoBar, createInfoBarHTML, updateInfoBar } from './components/infoBar.js';
export {
  Customization,
  showCustomizationScreen,
  setupCustomizationEvents,
  updateColorTheme,
  saveCustomization,
} from './components/customization.js';
export { VideoManager } from './VideoManager.js';
export { AccessibilityManager, accessibilityManager } from './accessibility.js';
export { Logger, LogLevel, logger } from './logger.js';
export { TouchSupportManager, touchSupportManager } from './touch-support.js';
export { generateMCQOptions } from './uiUtils.js';
export {
  renderAvatarSelector,
  updateWelcomeMessageUI,
  updateBackgroundByAvatar,
  startBackgroundRotation,
} from './main-helpers.js';
export { AudioManager } from './core/audio.js';
// Game modes loaded via lazy-loader (see CLAUDE.md architecture guidelines)
export { goToSlide, showSlide, hideAllSlides } from './slides.js';
export {
  arcadeUtils,
  loadSingleAvatar,
  getRandomAvatar,
  getPlayerAvatar,
  getRandomMonsters,
  saveScore,
  getScores,
  resetScores,
  safeShuffleArray,
} from './arcade-utils.js';
export { STORAGE_KEYS, default as Storage } from './core/storage.js';
export { lazyLoader, LazyLoader } from './lazy-loader.js';
export {
  forceDevCacheClear,
  clearCacheAndReload,
  registerServiceWorker,
  addVersionParam,
  versionAllImages,
  versionImageSrc,
  updateBackgroundImage,
} from './cache-updater.js';
export {
  loadMultiplicationStats,
  loadQuizExcludeTables,
  saveQuizExcludeTables,
} from './core/storage.js';
export { getCurrentDateString } from './core/storage.js';
export { recordMultiplicationResult, getMultiplicationStats } from './core/mult-stats.js';
export { loadDailyChallengeData, saveDailyChallengeData } from './core/daily-challenge.js';
export { getChallengeTopScores } from './core/challenge-stats.js';
