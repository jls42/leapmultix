// ES module bootstrap: replace inline onclick handlers with event listeners
// Prefer ESM imports; fallback to globals when necessary.
import { saveCustomization as _saveCustomization } from './components/customization.js';
import { goToSlide as _goToSlide } from './slides.js';
import { setGameMode as _setGameMode } from './mode-orchestrator.js';
import { TopBar } from './components/topBar.js';
import { updateCoinDisplay, updateWelcomeMessageUI } from './utils-es6.js';
import { gameState } from './game.js';
import { eventBus } from './core/eventBus.js';

function rewireSetGameModeButtons(root = document) {
  const nodes = root.querySelectorAll('[onclick]');
  nodes.forEach(el => {
    const handler = el.getAttribute('onclick');
    if (!handler) return;

    // setGameMode('mode')
    const m = handler.match(/setGameMode\('([^']+)'\)/);
    if (m) {
      const mode = m[1];
      el.removeAttribute('onclick');
      el.setAttribute('data-mode', mode);
      el.addEventListener(
        'click',
        e => {
          e.preventDefault();
          _setGameMode(mode);
        },
        { once: false }
      );
      return;
    }

    // goToSlide(n)
    const s = handler.match(/goToSlide\((\d+)\)/);
    if (s) {
      const slide = parseInt(s[1], 10);
      el.removeAttribute('onclick');
      el.setAttribute('data-slide', String(slide));
      el.addEventListener(
        'click',
        e => {
          e.preventDefault();
          _goToSlide(slide);
        },
        { once: false }
      );
      return;
    }
  });
}

// New: wire elements using data-attributes directly (preferred path)
function wireDataAttributes(root = document) {
  // Mode buttons
  root.querySelectorAll('[data-mode]')?.forEach(el => {
    if (el._modeWired) return;
    el.addEventListener('click', e => {
      const mode = el.getAttribute('data-mode');
      if (!mode) return;
      e.preventDefault();
      _setGameMode(mode);
    });
    el._modeWired = true;
  });

  // Slide navigation
  root.querySelectorAll('[data-slide]')?.forEach(el => {
    if (el._slideWired) return;
    el.addEventListener('click', e => {
      const slide = parseInt(el.getAttribute('data-slide') || '', 10);
      if (Number.isNaN(slide)) return;
      e.preventDefault();
      _goToSlide(slide);
    });
    el._slideWired = true;
  });

  // Custom actions
  root.querySelectorAll('[data-action="save-customization-go-home"]')?.forEach(el => {
    if (el._actionWired) return;
    el.addEventListener('click', e => {
      e.preventDefault();
      // Save customization via ESM
      try {
        _saveCustomization();
      } catch (err) {
        console.warn('saveCustomization failed', err);
      }
      _goToSlide(1);
    });
    el._actionWired = true;
  });
}

// Run after DOM ready to ensure elements exist and globals are defined
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Preferred: wire data-attributes
    wireDataAttributes(document);
    // Back-compat: rewire legacy inline handlers, and convert them to data-*
    rewireSetGameModeButtons(document);
    // Observe future DOM (optional) if content is dynamically injected
    const obs = new MutationObserver(() => {
      wireDataAttributes(document);
      rewireSetGameModeButtons(document);
    });
    obs.observe(document.body, { childList: true, subtree: true });
    // observer kept module-local; no global exposure

    // Refresh active mode texts on language change (ESM wrappers)
    const handler = e => {
      const mode = gameState?.gameMode;
      switch (mode) {
        case 'quiz':
          import('./modes/QuizMode.js').then(m => m.refreshQuizTexts?.());
          break;
        case 'challenge':
          import('./modes/ChallengeMode.js').then(m => m.refreshChallengeTexts?.());
          break;
        case 'adventure':
          import('./modes/AdventureMode.js').then(m => m.refreshAdventureTexts?.());
          break;
        case 'discovery':
          import('./modes/DiscoveryMode.js').then(m => m.refreshDiscoveryTexts?.());
          break;
        case 'arcade':
          import('./modes/ArcadeMode.js').then(m => m.refreshArcadeTexts?.());
          break;
        default:
          break;
      }

      // Refresh TopBar labels, language buttons, and coin display
      try {
        TopBar.updateTranslations();
      } catch (e) {
        void e;
      }
      try {
        const lang = e?.detail?.lang;
        if (lang) TopBar.updateLanguageButtons(lang);
      } catch (err) {
        void err;
      }
      try {
        updateCoinDisplay();
      } catch (e) {
        void e;
      }
      try {
        const maybePromise = updateWelcomeMessageUI();
        if (maybePromise && typeof maybePromise.catch === 'function') {
          maybePromise.catch(() => {});
        }
      } catch (e) {
        void e;
      }
    };
    try {
      eventBus.on('languageChanged', handler);
    } catch (e) {
      void e;
    }
    try {
      globalThis.addEventListener('languageChanged', handler);
    } catch (e) {
      void e;
    }
  } catch (e) {
    console.warn('Bootstrap wiring failed:', e);
  }
});

export {};
