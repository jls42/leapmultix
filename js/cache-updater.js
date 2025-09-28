/**
 * Gestionnaire de mise à jour et de cache pour LeapMultix
 * Ce script garantit que les utilisateurs ont toujours la dernière version de l'application
 */

// Version globale de l'application - doit correspondre à sw.js
export const APP_VERSION = 'v5';
export const VERSION_PARAM = `v=${APP_VERSION}`;

// Fonction de développement pour forcer le nettoyage complet
export function forceDevCacheClear() {
  console.log('🔧 Nettoyage cache demandé');

  // Unregister service worker
  if (globalThis.navigator && 'serviceWorker' in globalThis.navigator) {
    globalThis.navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister().then(() => {
          console.log('🔧 Service Worker désenregistré');
        });
      });
    });
  }

  // Clear all caches
  const g = typeof globalThis !== 'undefined' ? globalThis : window;
  if (g && g.caches) {
    g.caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            console.log('🔧 Suppression du cache:', cacheName);
            return g.caches.delete(cacheName);
          })
        );
      })
      .then(() => {
        console.log('🔧 Tous les caches supprimés');
      });
  }

  // Clear localStorage/sessionStorage cache-related data
  Object.keys(localStorage).forEach(key => {
    if (key.includes('cache') || key.includes('version')) {
      localStorage.removeItem(key);
      console.log('🔧 Suppression localStorage:', key);
    }
  });
}

// Enregistrement du service worker
export function registerServiceWorker() {
  if (globalThis.navigator && 'serviceWorker' in globalThis.navigator) {
    (typeof globalThis !== 'undefined' ? globalThis : window).addEventListener('load', () => {
      const swUrl =
        '/sw.js' +
        (VERSION_PARAM
          ? VERSION_PARAM.startsWith('v=')
            ? `?${VERSION_PARAM}`
            : `?v=${APP_VERSION}`
          : '');
      globalThis.navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
          console.log('Service Worker enregistré avec succès:', registration.scope);

          // Vérifier les mises à jour automatiquement
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;

            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                globalThis.navigator.serviceWorker.controller
              ) {
                // Mettre à jour automatiquement la page
                typeof globalThis !== 'undefined'
                  ? globalThis.location?.reload()
                  : window.location.reload();
              }
            });
          });
        })
        .catch(error => {
          console.log("Échec d'enregistrement du Service Worker:", error);
        });
    });
  }
}

// Ajouter un paramètre de version aux ressources principales
export function addVersionParam() {
  document
    .querySelectorAll('script:not([src*="?"]), link[rel="stylesheet"]:not([href*="?"])')
    .forEach(el => {
      const urlAttribute = el.tagName === 'SCRIPT' ? 'src' : 'href';
      if (urlAttribute === 'src' && el.src) {
        el.src = `${el.src}?${VERSION_PARAM}`;
      } else if (urlAttribute === 'href' && el.href) {
        el.href = `${el.href}?${VERSION_PARAM}`;
      }
    });
}

// Fonction pour vider manuellement le cache et recharger (fonction interne utilisée par le service worker)
export function clearCacheAndReload() {
  const g = typeof globalThis !== 'undefined' ? globalThis : window;
  if (g && g.caches) {
    g.caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            return g.caches.delete(cacheName);
          })
        );
      })
      .then(() => {
        console.log('Tous les caches ont été supprimés');

        // Stocker l'information de nettoyage dans localStorage pour indiquer au prochain chargement
        // que le cache a été vidé et qu'il faut forcer le rechargement de toutes les images
        localStorage.setItem('cache_cleared_timestamp', APP_VERSION);

        // Ajouter un paramètre versionné (utilise la whitelist CDN)
        const loc = typeof globalThis !== 'undefined' ? globalThis.location : window.location;
        loc.href = `${loc.pathname}?${VERSION_PARAM}`;
      });
  } else {
    // Pour les navigateurs qui ne supportent pas l'API Cache
    localStorage.setItem('cache_cleared_timestamp', APP_VERSION);
    const loc = typeof globalThis !== 'undefined' ? globalThis.location : window.location;
    loc.href = `${loc.pathname}?${VERSION_PARAM}`;
  }
}

// Fonction développement exposée globalement

// Nettoyage automatique seulement si détection de problème de cache
function autoDetectCacheIssues() {
  // Vérifier si on a des scripts obsolètes en mémoire
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const hasVersionedScripts = scripts.some(script => script.src.includes('?v='));
  const hasUnversionedScripts = scripts.some(
    script =>
      !script.src.includes('?v=') && !script.src.includes('localhost') && script.src.includes('.js')
  );

  // Si on a un mélange de scripts versionnés et non-versionnés, nettoyer
  if (hasVersionedScripts && hasUnversionedScripts) {
    console.log('🔧 Détection de problème de cache - Nettoyage automatique');
    forceDevCacheClear();
  }
}

// Exécuter la détection automatique
autoDetectCacheIssues();

// Fonction pour ajouter une version à toutes les URL d'images
export function versionAllImages() {
  const timestamp = localStorage.getItem('cache_cleared_timestamp') || APP_VERSION;

  // Observer les changements dans le DOM pour détecter les nouvelles images
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach(node => {
          // Vérifier si le node a des descendants
          if (node.querySelectorAll) {
            // Appliquer aux images
            const images = node.querySelectorAll('img');
            images.forEach(img => versionImageSrc(img, timestamp));

            // Appliquer aux éléments avec background-image
            const elementsWithBg = node.querySelectorAll('*');
            elementsWithBg.forEach(el => {
              const style =
                typeof globalThis !== 'undefined' && globalThis.getComputedStyle
                  ? globalThis.getComputedStyle(el)
                  : null;
              if (
                style &&
                style.backgroundImage &&
                style.backgroundImage !== 'none' &&
                style.backgroundImage.includes('url(')
              ) {
                updateBackgroundImage(el, timestamp);
              }
            });
          }

          // Si le node lui-même est une image
          if (node.tagName === 'IMG') {
            versionImageSrc(node, timestamp);
          }
        });
      }
    });
  });

  // Démarrer l'observation
  observer.observe(document.body, { childList: true, subtree: true });

  // Traiter les images existantes au chargement initial
  document.querySelectorAll('img').forEach(img => versionImageSrc(img, timestamp));

  // Traiter les éléments avec background-image existants
  document.querySelectorAll('*').forEach(el => {
    try {
      const style =
        typeof globalThis !== 'undefined' && globalThis.getComputedStyle
          ? globalThis.getComputedStyle(el)
          : null;
      if (
        style &&
        style.backgroundImage &&
        style.backgroundImage !== 'none' &&
        style.backgroundImage.includes('url(')
      ) {
        updateBackgroundImage(el, timestamp);
      }
    } catch {
      // Ignorer les erreurs potentielles de getComputedStyle
    }
  });
}

// Ajouter un paramètre de version à l'URL d'une image
export function versionImageSrc(imgElement, timestamp) {
  if (imgElement.dataset.originalSrc) return; // Déjà traité

  if (imgElement.src && imgElement.src.startsWith('http')) {
    // Sauvegarder l'URL originale
    imgElement.dataset.originalSrc = imgElement.src;

    // Ajouter le paramètre de version
    const url = new URL(imgElement.src);
    url.searchParams.set('v', timestamp);
    imgElement.src = url.href;
  }
}

// Enregistrer le Service Worker par défaut (PWA activée par défaut)
try {
  registerServiceWorker();
} catch {
  /* no-op */
}

// Mettre à jour une background-image avec un paramètre de version
export function updateBackgroundImage(element, timestamp) {
  if (element.dataset.bgProcessed) return; // Déjà traité

  const style =
    typeof globalThis !== 'undefined' && globalThis.getComputedStyle
      ? globalThis.getComputedStyle(element)
      : null;
  const bgImage = style.backgroundImage;

  if (bgImage && bgImage !== 'none' && bgImage.includes('url(')) {
    // Extraire l'URL de l'image
    const urlMatch = bgImage.match(/url\(['"]?([^'")]+)['"]?\)/);
    if (urlMatch && urlMatch[1]) {
      const imageUrl = urlMatch[1];

      if (imageUrl.startsWith('http')) {
        element.dataset.bgProcessed = 'true';
        try {
          // Construire la nouvelle URL avec paramètre de version
          const url = new URL(imageUrl);
          url.searchParams.set('v', timestamp);

          // Appliquer la nouvelle URL
          element.style.backgroundImage = `url("${url.href}")`;
        } catch {
          /* ignore invalid URL */
        }
      }
    }
  }
}

// Exécuter au chargement
registerServiceWorker();
addVersionParam();

// Activer le versionnage des images après le chargement complet du DOM
document.addEventListener('DOMContentLoaded', () => {
  versionAllImages();
});

// La gestion du cache est maintenant entièrement automatique
// Le bouton d'actualisation a été supprimé car plus nécessaire

export default {
  forceDevCacheClear,
  registerServiceWorker,
  addVersionParam,
  clearCacheAndReload,
  versionAllImages,
  versionImageSrc,
  updateBackgroundImage,
};
