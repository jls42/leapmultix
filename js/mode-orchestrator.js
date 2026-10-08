// Orchestrateur modulaire des modes de jeu
// Charge à la demande et démarre les modes via leurs exports ES6

import { lazyLoader } from './lazy-loader.js';
import { getTranslation, showMessage } from './utils-es6.js';
import { canLaunchMode } from './components/operationModeAvailability.js';
import { hideLoadErrorNotice, showLoadErrorNotice } from './components/loadErrorNotice.js';
// gameState import removed as it's unused

// Keep import() arguments literal to avoid security tool false-positives.
const MODE_IMPORTS = new Map([
  ['quiz', () => import('./modes/QuizMode.js')],
  ['challenge', () => import('./modes/ChallengeMode.js')],
  ['adventure', () => import('./modes/AdventureMode.js')],
  ['discovery', () => import('./modes/DiscoveryMode.js')],
  ['arcade', () => import('./modes/ArcadeMode.js')],
  ['chrono', () => import('./modes/ChronoMode.js')],
]);

// Named starter call-backs by mode (when available)
// Use literal property access to avoid object-injection patterns
// Chrono reçoit les options de setGameMode (relance depuis ses résultats)
const STARTERS = new Map([
  ['quiz', mod => (typeof mod.startQuizMode === 'function' ? mod.startQuizMode() : null)],
  [
    'challenge',
    mod => (typeof mod.startChallengeMode === 'function' ? mod.startChallengeMode() : null),
  ],
  [
    'adventure',
    mod => (typeof mod.startAdventureMode === 'function' ? mod.startAdventureMode() : null),
  ],
  [
    'discovery',
    mod => (typeof mod.startDiscoveryMode === 'function' ? mod.startDiscoveryMode() : null),
  ],
  ['arcade', mod => (typeof mod.startArcadeMode === 'function' ? mod.startArcadeMode() : null)],
  [
    'chrono',
    (mod, options) =>
      typeof mod.startChronoMode === 'function' ? mod.startChronoMode(options) : null,
  ],
]);

async function startModuleForMode(mod, mode, options) {
  const starter = STARTERS.get(mode);
  if (starter) {
    starter(mod, options); // Call the starter function (handles its own instance management)
    return true; // Return success instead of undefined
  }
  // Fallback: default export class with start()
  if (mod?.default) {
    const Instance = mod.default;
    const obj = new Instance();
    if (typeof obj.start === 'function') {
      await obj.start();
      return obj; // Return the instance for direct class usage
    }
  }
  throw new Error(`Starter for mode '${mode}' not found`);
}

let startingMode = null;

export const getStartingMode = () => startingMode;
export function setStartingMode(mode) {
  startingMode = mode;
}

/**
 * Démarre un mode. Passer par ici marque le mode « en démarrage » : la navigation vers
 * l'écran de jeu ne l'arrête pas aussitôt (slides.js).
 * @param {string} mode
 * @param {Object} [options] - Transmises au lanceur du mode (Chrono : { autoStart })
 */
export async function setGameMode(mode, options = {}) {
  try {
    // Vérifier si le mode est disponible pour l'opération actuelle
    if (!canLaunchMode(mode)) {
      console.warn(`[ModeOrchestrator] Mode ${mode} non disponible pour l'opération actuelle`);
      return;
    }

    // Ignore duplicate, in-flight requests for the same mode
    if (startingMode === mode) {
      console.warn(`[ModeOrchestrator] Duplicate setGameMode(${mode}) ignored (in flight).`);
      return;
    }

    // Marquer le mode en cours de démarrage (évite l'auto-stop dans goToSlide)
    startingMode = mode;
    // Ne pas annoncer ici: GameMode.start() gère la synthèse vocale

    // Charger les ressources nécessaires
    await lazyLoader.loadForGameMode(mode);

    // Importer dynamiquement le module du mode et démarrer
    const loader = MODE_IMPORTS.get(mode);
    if (!loader) {
      console.warn(`Mode inconnu: ${mode}`);
      showMessage?.(getTranslation('mode_under_development', { modeName: mode }));
      return;
    }

    const mod = await loader();
    const started = await startModuleForMode(mod, mode, options);
    hideLoadErrorNotice();
    return started;
  } catch (err) {
    console.error(`Erreur lors du démarrage du mode ${mode}:`, err);
    // Un avis qui reste : hors ligne, un mode jamais gardé dit pourquoi il ne s'ouvre pas
    showLoadErrorNotice(err);
  } finally {
    startingMode = null;
  }
}

// Plus d'exposition globale: utiliser les imports ESM
