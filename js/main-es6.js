/**
 * Point d'entrée ES6 moderne pour LeapMultix
 * Architecture ES6 pure - Migration Phase 6 terminée
 */

// === IMPORTS CORE ===
import './logger.js';
import './core/storage.js';
import './core/audio.js';
// Core utilities loaded via aggregate in main.js and utils-es6.js

// === IMPORTS SYSTÈME ===
import './lazy-loader.js';
import './mode-orchestrator.js';

// === IMPORTS COMPOSANTS ===
import './main-helpers.js';
import './components/topBar.js';
import './components/infoBar.js';
import './components/dashboard.js';
import './components/customization.js';

// === IMPORTS ESSENTIELS ===
import './userManager.js';
import './core/userState.js';
import './VideoManager.js';
import './uiUtils.js';
import './storage.js';
import './imports.js';
import './badges.js';
import './slides.js';
import './game.js';
import './difficulty.js';

// === IMPORTS SUPPORT ===
import './cache-updater.js';
import './accessibility.js';
import './keyboard-navigation.js';
import './security-utils.js';
import './touch-support.js';
import './responsive-image-loader.js';

// === POINT D'ENTRÉE PRINCIPAL ===
import './main.js';

// === BOOTSTRAP ===
import './bootstrap.js';
// === RUNTIME ERROR FILTERS (moved from inline to satisfy CSP) ===
import './error-handlers.js';
