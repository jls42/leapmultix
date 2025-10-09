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
    const handler = async e => {
      const mode = gameState?.gameMode;
      try {
        switch (mode) {
          case 'quiz':
            (await import('./modes/QuizMode.js')).refreshQuizTexts?.();
            break;
          case 'challenge':
            (await import('./modes/ChallengeMode.js')).refreshChallengeTexts?.();
            break;
          case 'adventure':
            (await import('./modes/AdventureMode.js')).refreshAdventureTexts?.();
            break;
          case 'discovery':
            (await import('./modes/DiscoveryMode.js')).refreshDiscoveryTexts?.();
            break;
          case 'arcade':
            (await import('./modes/ArcadeMode.js')).refreshArcadeTexts?.();
            break;
          default:
            break;
        }
      } catch (err) {
        console.warn('Dynamic module import failed on language change', err);
      }

      // Refresh TopBar labels, language buttons, and coin display
      try {
        TopBar.updateTranslations();
      } catch (err) {
        /* ignore */
      }
      try {
        const lang = e?.detail?.lang;
        if (lang) TopBar.updateLanguageButtons(lang);
      } catch (err) {
        /* ignore */
      }
      try {
        updateCoinDisplay();
      } catch (err) {
        /* ignore */
      }
      try {
        await updateWelcomeMessageUI();
      } catch (err) {
        /* ignore */
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
