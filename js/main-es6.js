/**
 * Bundle différé : modules lourds chargés après le bootstrap critique.
 * (voir js/bootstrap-critical.js)
 */

// === COMPOSANTS & UI AVANCÉE ===
import './components/dashboard.js';
import './components/customization.js';
import './VideoManager.js';
import './uiUtils.js';
import './main-helpers.js';
import './main.js';

// === MÉCANISMES DE JEU ===
import './core/audio.js';
import './imports.js';
import './badges.js';
import './game.js';
import './difficulty.js';

// === RUNTIME STABILISATION ===
