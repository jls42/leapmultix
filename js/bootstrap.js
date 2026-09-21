// ES module bootstrap: replace inline onclick handlers with event listeners
// Prefer ESM imports; fallback to globals when necessary.
import { saveCustomization as _saveCustomization } from './components/customization.js';
import { goToSlide as _goToSlide } from './slides.js';
import { setGameMode as _setGameMode } from './mode-orchestrator.js';
import { TopBar } from './components/topBar.js';
import { updateCoinDisplay, updateWelcomeMessageUI, updateSeoHeroImage } from './utils-es6.js';
import { gameState } from './game.js';
import { eventBus } from './core/eventBus.js';
import { OperationSelector } from './components/operationSelector.js';
import { updateModeButtonsAvailability } from './components/operationModeAvailability.js';

/**
 * Exécute une étape de rafraîchissement sans laisser une erreur interrompre les
 * suivantes : un changement de langue doit aboutir même si un écran manque.
 * @param {string} label - Nom de l'étape, pour le journal
 * @param {() => unknown} step
 */
async function runSafely(label, step) {
  try {
    await step();
  } catch (err) {
    console.warn(`${label} failed during language change`, err);
  }
}

/** Recharge les textes du mode en cours, chaque mode étant chargé à la demande. */
async function refreshActiveModeTexts(mode) {
  const chargeurs = {
    quiz: async () => (await import('./modes/QuizMode.js')).refreshQuizTexts?.(),
    challenge: async () => (await import('./modes/ChallengeMode.js')).refreshChallengeTexts?.(),
    adventure: async () => (await import('./modes/AdventureMode.js')).refreshAdventureTexts?.(),
    discovery: async () => (await import('./modes/DiscoveryMode.js')).refreshDiscoveryTexts?.(),
    arcade: async () => (await import('./modes/ArcadeMode.js')).refreshArcadeTexts?.(),
  };
  await chargeurs[mode]?.();
}

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
      el.dataset.mode = mode;
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
      const slide = Number.parseInt(s[1], 10);
      el.removeAttribute('onclick');
      el.dataset.slide = String(slide);
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
      const mode = el.dataset.mode;
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
      const slide = Number.parseInt(el.dataset.slide || '', 10);
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
      const lang = e?.detail?.lang;
      await runSafely('refresh mode texts', () => refreshActiveModeTexts(gameState?.gameMode));

      // Refresh TopBar labels, language buttons, and coin display
      const steps = [
        ['TopBar.updateTranslations', () => TopBar.updateTranslations()],
        ['TopBar.updateLanguageButtons', () => lang && TopBar.updateLanguageButtons(lang)],
        ['updateCoinDisplay', () => updateCoinDisplay()],
        ['updateWelcomeMessageUI', () => updateWelcomeMessageUI()],
        ['updateSeoHeroImage', () => updateSeoHeroImage(lang)],
        [
          'OperationSelector.refresh',
          () => OperationSelector.refresh('operation-selector-container'),
        ],
        ['updateModeButtonsAvailability', () => updateModeButtonsAvailability()],
        [
          'TopBar.updateTableSettingsButtonVisibility',
          () => TopBar.updateTableSettingsButtonVisibility?.(),
        ],
      ];
      for (const [label, step] of steps) await runSafely(label, step);
    };
    // Un seul abonnement : i18n.js émet aussi l'événement sur window (écouté par
    // i18n-store.js) ; s'y abonner en plus redessinait chaque écran deux fois.
    try {
      eventBus.on('languageChanged', handler);
    } catch (err) {
      console.warn('Failed to attach languageChanged listener to eventBus', err);
    }
  } catch (e) {
    console.warn('Bootstrap wiring failed:', e);
  }
});
