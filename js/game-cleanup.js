// game-cleanup.js - ESM module to clean up game resources between arcade subgames
import { AudioManager } from './core/audio.js';

/**
 * Utilitaire interne pour obtenir les gestionnaires d'événements attachés à un élément.
 * Placeholder: les navigateurs ne fournissent pas d'API standard pour lister les écouteurs.
 */
export function getEventListeners(element, eventType) {
  console.log('Tentative de nettoyage des écouteurs de type', eventType, 'sur', element);
  return [];
}

/**
 * Nettoie les images d'un monstre
 * @param {Object} monster - Instance du monstre
 */
function cleanupMonsterImage(monster) {
  if (!monster) return;

  if (monster.image) {
    monster.image.onload = null;
    monster.image.onerror = null;
    monster.image = null;
  } else if (typeof monster.onload === 'function') {
    monster.onload = null;
    monster.onerror = null;
  }
}

/**
 * Nettoie les ressources des jeux d'arcade pour éviter les fuites mémoire.
 * @param {Object} gameInstance - Instance du jeu à nettoyer
 * @param {Object} options - Options de nettoyage
 */
export function cleanupGameResources(gameInstance, options = {}) {
  const defaultOptions = {
    cleanAnimations: true,
    cleanEvents: true,
    cleanImages: true,
    cleanDOM: true,
    cleanTimers: true,
  };

  const opts = { ...defaultOptions, ...options };
  console.log('Nettoyage des ressources du jeu...');

  try {
    AudioManager.stopAll();
  } catch (e) {
    void e;
  }

  if (opts.cleanAnimations) cleanAnimations(gameInstance);
  if (opts.cleanEvents) cleanEvents(gameInstance);
  if (opts.cleanImages) cleanImages(gameInstance);
  if (opts.cleanDOM) cleanDOMRefs(gameInstance);
  if (opts.cleanTimers) cleanTimers(gameInstance);

  console.log('Nettoyage des ressources terminé');
  return true;
}

// No window bridges; import from this module or via utils-es6

// --- Sous-routines de nettoyage (réduisent la complexité) ---
function cleanAnimations(gameInstance) {
  if (gameInstance && gameInstance.animationId) {
    cancelAnimationFrame(gameInstance.animationId);
    gameInstance.animationId = null;
    console.log("✔️ Boucle d'animation du jeu nettoyée");
  }
}

function cleanEvents(gameInstance) {
  // Les écouteurs clavier communs (flèches) sont retirés via stopArcadeMode().
  try {
    const keydownHandlers = getEventListeners(document, 'keydown');
    if (keydownHandlers && keydownHandlers.length > 0) {
      console.log('Nettoyage global des écouteurs keydown (', keydownHandlers.length, 'trouvés)');
    }
  } catch {
    // En environnement non devtools, ignorer
  }
  if (gameInstance && Array.isArray(gameInstance.eventListeners)) {
    gameInstance.eventListeners.forEach(listener => {
      if (listener.element && listener.type && listener.callback) {
        listener.element.removeEventListener(listener.type, listener.callback);
      }
    });
    gameInstance.eventListeners = [];
    console.log("✔️ Gestionnaires d'événements nettoyés");
  }
}

function cleanImages(gameInstance) {
  if (!gameInstance) return;
  if (Array.isArray(gameInstance.monsters) && gameInstance.monsters.length > 0) {
    for (const monster of gameInstance.monsters) {
      cleanupMonsterImage(monster);
    }
    gameInstance.monsters.length = 0;
    console.log('✔️ Images de monstres nettoyées');
  }
  if (gameInstance.avatar) {
    if (gameInstance.avatar.image) {
      gameInstance.avatar.image.onload = null;
      gameInstance.avatar.image.onerror = null;
      gameInstance.avatar.image = null;
    }
    console.log('✔️ Avatar nettoyé');
  }
  if (gameInstance.wallTexture) {
    gameInstance.wallTexture.onload = null;
    gameInstance.wallTexture = null;
  }
  if (gameInstance.pathTexture) {
    gameInstance.pathTexture.onload = null;
    gameInstance.pathTexture = null;
  }
  if (gameInstance.textures) {
    gameInstance.textures = null;
  }
  console.log('✔️ Textures nettoyées');
}

function cleanDOMRefs(gameInstance) {
  if (!gameInstance) return;
  if (gameInstance.canvas) gameInstance.canvas = null;
  if (gameInstance.ctx) gameInstance.ctx = null;
  if (gameInstance.infoElements) gameInstance.infoElements = null;
  console.log('✔️ Références DOM nettoyées');
}

function cleanTimers(gameInstance) {
  if (!gameInstance) return;
  if (gameInstance._intervalId) {
    clearInterval(gameInstance._intervalId);
    gameInstance._intervalId = null;
  }
  if (gameInstance._timeoutId) {
    clearTimeout(gameInstance._timeoutId);
    gameInstance._timeoutId = null;
  }
  if (Array.isArray(gameInstance.timers)) {
    gameInstance.timers.forEach(id => {
      if (id) {
        try {
          clearTimeout(id);
          clearInterval(id);
        } catch {
          // Ignore timer cleanup errors
        }
      }
    });
    gameInstance.timers = [];
  }
  console.log('✔️ Timers nettoyés');
}
