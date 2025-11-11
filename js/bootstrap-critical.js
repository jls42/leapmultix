/**
 * Entrée critique chargée dès le boot.
 * Seuls les modules indispensables au premier affichage sont importés ici.
 * Les modules plus lourds sont chargés de manière différée (voir loadDeferredModules).
 */

// --- Core & services immédiats ---
import './logger.js';
import './core/storage.js';
import './storage.js';
import './userManager.js';
import './core/userState.js';
import './cache-updater.js';
import './accessibility.js';
import './keyboard-navigation.js';
import './security-utils.js';
import './touch-support.js';
import './responsive-image-loader.js';
import './error-handlers.js';

// --- UI de base ---
import './components/topBar.js';
import './components/infoBar.js';
import './slides.js';
import './lazy-loader.js';
import './mode-orchestrator.js';
import './bootstrap.js';

const loadDeferredModules = (() => {
  let deferredPromise = null;
  return () => {
    if (!deferredPromise) {
      deferredPromise = import('./main-es6.js').catch(error => {
        console.error('❌ Échec chargement modules différés:', error);
      });
    }
    return deferredPromise;
  };
})();

const scheduleDeferredLoad = () => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => loadDeferredModules(), { timeout: 1500 });
  } else {
    window.addEventListener('load', () => loadDeferredModules(), { once: true });
  }

  setTimeout(() => {
    loadDeferredModules();
  }, 2500);
};

const primeOnInteraction = () => {
  const trigger = () => loadDeferredModules();
  ['pointerdown', 'keydown', 'scroll', 'visibilitychange'].forEach(event => {
    window.addEventListener(event, trigger, { once: true, passive: true });
  });
};

scheduleDeferredLoad();
primeOnInteraction();
