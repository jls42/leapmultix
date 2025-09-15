// Orchestrateur modulaire des modes de jeu
// Charge à la demande et démarre les modes via leurs exports ES6

import { lazyLoader } from './lazy-loader.js';
import { getTranslation, showMessage } from './utils-es6.js';
// gameState import removed as it's unused

// Keep import() arguments literal to avoid security tool false-positives.
const MODE_IMPORTS = new Map([
  ['quiz', () => import('./modes/QuizMode.js')],
  ['challenge', () => import('./modes/ChallengeMode.js')],
  ['adventure', () => import('./modes/AdventureMode.js')],
  ['discovery', () => import('./modes/DiscoveryMode.js')],
  ['arcade', () => import('./modes/ArcadeMode.js')],
]);

// Named starter call-backs by mode (when available)
// Use literal property access to avoid object-injection patterns
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
]);

async function startModuleForMode(mod, mode) {
  const starter = STARTERS.get(mode);
  if (starter) {
    starter(mod); // Call the starter function (handles its own instance management)
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

export async function setGameMode(mode) {
  try {
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
    return await startModuleForMode(mod, mode);
  } catch (err) {
    console.error(`Erreur lors du démarrage du mode ${mode}:`, err);
    showMessage?.(getTranslation('mode_start_error', { modeName: mode }));
  } finally {
    startingMode = null;
  }
}

// Plus d'exposition globale: utiliser les imports ESM

console.log('🎛️ Orchestrateur de modes chargé');
