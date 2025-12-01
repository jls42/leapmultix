/**
 * Gestionnaire de mise à jour et de cache pour LeapMultix
 * Ce script garantit que les utilisateurs ont toujours la dernière version de l'application
 */

// Version globale de l'application - doit correspondre à sw.js
export const APP_VERSION = 'v18';
export const VERSION_PARAM = `v=${APP_VERSION}`;

const runtime = globalThis;

const shouldSkipVersioning = element => {
  if (!element) return false;
  const dataset = element.dataset || {};
  if (!Object.hasOwn(dataset, 'skipVersion')) {
    return false;
  }
  const value = dataset.skipVersion;
  return value === '' || value === 'true';
};

const resolveBaseHref = () =>
  runtime.document?.baseURI ?? runtime.location?.href ?? runtime.location?.origin;

const updateDocumentDataset = docElement => {
  try {
    docElement.dataset.appVersion = APP_VERSION;
    docElement.dataset.versionParam = VERSION_PARAM;
  } catch {
    // dataset not available (e.g., legacy browsers) -> ignore.
  }
};

const dispatchVersionEvent = (doc, docElement) => {
  try {
    const alreadyDispatched = docElement.dataset.versionEventDispatched === 'true';
    if (alreadyDispatched) return;
    docElement.dataset.versionEventDispatched = 'true';
    const detail = { version: APP_VERSION, versionParam: VERSION_PARAM };
    doc.dispatchEvent(new CustomEvent('leapmultix:version-ready', { detail }));
  } catch {
    // Ignore environments without CustomEvent support.
  }
};

const getElementDataset = element => {
  try {
    return element?.dataset ?? null;
  } catch {
    return null;
  }
};

const getSrcAttributeValue = element => {
  if (typeof element.getAttribute !== 'function') {
    return '';
  }
  const value = element.getAttribute('src');
  return typeof value === 'string' ? value : '';
};

const resolveInitialSrcValue = (imgElement, attributeValue) =>
  attributeValue || imgElement.currentSrc || imgElement.src || '';

const buildAbsoluteUrl = (value, baseHref, fallbackSrc) => {
  try {
    return baseHref ? new URL(value, baseHref) : new URL(value);
  } catch {
    try {
      return new URL(fallbackSrc);
    } catch {
      return null;
    }
  }
};

const shouldPreserveRelativePath = value =>
  !!value && !value.startsWith('http') && !value.startsWith('//');

const setImageSrc = (imgElement, value) => {
  if (typeof imgElement.setAttribute === 'function') {
    imgElement.setAttribute('src', value);
  } else {
    imgElement.src = value;
  }
};

const getComputedStyleSafe = element => {
  const getComputedStyleFn = runtime.getComputedStyle;
  if (typeof getComputedStyleFn !== 'function') {
    return null;
  }
  try {
    return getComputedStyleFn.call(runtime, element);
  } catch {
    return null;
  }
};

const extractBackgroundImageUrl = style => {
  if (!style) return '';
  const { backgroundImage } = style;
  if (!backgroundImage || backgroundImage === 'none' || !backgroundImage.includes('url(')) {
    return '';
  }
  const match = backgroundImage.match(/url\(['"]?([^'")]+)['"]?\)/);
  return match?.[1] ?? '';
};

function broadcastAppVersion() {
  runtime.__LEAPMULTIX_APP_VERSION__ = APP_VERSION;
  runtime.__LEAPMULTIX_VERSION_PARAM__ = VERSION_PARAM;

  const doc = runtime.document;
  const docElement = doc?.documentElement;
  if (!docElement) return;

  updateDocumentDataset(docElement);
  dispatchVersionEvent(doc, docElement);
}

broadcastAppVersion();

// Fonction de développement pour forcer le nettoyage complet
export function forceDevCacheClear() {
  const navigatorRef = runtime.navigator;
  // Unregister service worker
  if (navigatorRef?.serviceWorker) {
    navigatorRef.serviceWorker.getRegistrations().then(registrations => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
  }

  // Clear all caches
  const cachesApi = runtime.caches;
  if (cachesApi) {
    cachesApi.keys().then(cacheNames => {
      return Promise.all(cacheNames.map(cacheName => cachesApi.delete(cacheName)));
    });
  }

  // Clear localStorage/sessionStorage cache-related data
  for (const key of Object.keys(localStorage)) {
    if (key.includes('cache') || key.includes('version')) {
      localStorage.removeItem(key);
    }
  }
}

const getServiceWorkerUrl = () => {
  const versionSuffix = VERSION_PARAM.startsWith('v=') ? `?${VERSION_PARAM}` : `?v=${APP_VERSION}`;
  return `/sw.js${versionSuffix}`;
};

const handleWorkerStateChange = (newWorker, navigatorRef) => {
  if (newWorker.state !== 'installed') {
    return;
  }

  if (!navigatorRef.serviceWorker?.controller) {
    return;
  }

  runtime.location?.reload?.();
};

const handleUpdateFound = (registration, navigatorRef) => {
  const newWorker = registration.installing;
  if (!newWorker) {
    return;
  }

  const onStateChange = handleWorkerStateChange.bind(null, newWorker, navigatorRef);
  newWorker.addEventListener('statechange', onStateChange);
};

const monitorRegistrationUpdates = (registration, navigatorRef) => {
  const onUpdateFound = handleUpdateFound.bind(null, registration, navigatorRef);
  registration.addEventListener('updatefound', onUpdateFound);
};

const registerAfterLoad = navigatorRef => {
  const swUrl = getServiceWorkerUrl();
  navigatorRef.serviceWorker
    .register(swUrl)
    .then(registration => {
      monitorRegistrationUpdates(registration, navigatorRef);
    })
    .catch(error => {
      console.error("Échec d'enregistrement du Service Worker:", error);
    });
};

// Enregistrement du service worker
export function registerServiceWorker() {
  const navigatorRef = runtime.navigator;
  if (!navigatorRef?.serviceWorker) return;

  const loadHandler = registerAfterLoad.bind(null, navigatorRef);
  runtime.addEventListener('load', loadHandler);
}

// Ajouter un paramètre de version aux ressources principales
export function addVersionParam() {
  for (const script of document.querySelectorAll('script[src]:not([src*="?"])')) {
    script.src = `${script.src}?${VERSION_PARAM}`;
  }

  for (const link of document.querySelectorAll('link[rel="stylesheet"]:not([href*="?"])')) {
    if (shouldSkipVersioning(link)) continue;
    link.href = `${link.href}?${VERSION_PARAM}`;
  }
}

// Fonction pour vider manuellement le cache et recharger (fonction interne utilisée par le service worker)
export function clearCacheAndReload() {
  const cachesApi = runtime.caches;
  const redirectToVersion = () => {
    localStorage.setItem('cache_cleared_timestamp', APP_VERSION);
    const loc = runtime.location;
    if (loc) {
      loc.href = `${loc.pathname}?${VERSION_PARAM}`;
    }
  };

  if (cachesApi) {
    cachesApi
      .keys()
      .then(cacheNames => Promise.all(cacheNames.map(cacheName => cachesApi.delete(cacheName))))
      .then(redirectToVersion);
    return;
  }

  redirectToVersion();
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
    console.warn('🔧 Détection de problème de cache - Nettoyage automatique');
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
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        processNodeForVersioning(node, timestamp);
      }
    }
  });

  // Démarrer l'observation
  observer.observe(document.body, { childList: true, subtree: true });

  // Traiter les images existantes au chargement initial
  for (const img of document.querySelectorAll('img')) {
    versionImageSrc(img, timestamp);
  }

  // Traiter les éléments avec background-image existants
  for (const el of document.querySelectorAll('*')) {
    try {
      updateBackgroundImage(el, timestamp);
    } catch {
      /* ignore style errors */
    }
  }
}

const processNodeForVersioning = (node, timestamp) => {
  if (!node) return;

  if (node.tagName === 'IMG') {
    versionImageSrc(node, timestamp);
  }

  if (typeof node.querySelectorAll !== 'function') {
    return;
  }

  for (const img of node.querySelectorAll('img')) {
    versionImageSrc(img, timestamp);
  }

  for (const element of node.querySelectorAll('*')) {
    updateBackgroundImage(element, timestamp);
  }
};

// Ajouter un paramètre de version à l'URL d'une image
export function versionImageSrc(imgElement, timestamp) {
  if (!imgElement || typeof imgElement !== 'object') return;
  if (shouldSkipVersioning(imgElement)) return;
  const dataset = getElementDataset(imgElement);

  if (dataset?.originalSrc) return;

  const originalAttributeValue = getSrcAttributeValue(imgElement);
  const resolvedOriginalValue = resolveInitialSrcValue(imgElement, originalAttributeValue);
  if (!resolvedOriginalValue) return;

  if (dataset && !dataset.originalSrc) {
    dataset.originalSrc = originalAttributeValue || resolvedOriginalValue;
  }

  const absoluteUrl = buildAbsoluteUrl(resolvedOriginalValue, resolveBaseHref(), imgElement.src);
  if (!absoluteUrl) return;

  absoluteUrl.searchParams.set('v', timestamp);

  const nextValue = shouldPreserveRelativePath(originalAttributeValue)
    ? `${absoluteUrl.pathname}${absoluteUrl.search}${absoluteUrl.hash}`
    : absoluteUrl.href;

  setImageSrc(imgElement, nextValue);
}

// Enregistrer le Service Worker par défaut (PWA activée par défaut)
try {
  registerServiceWorker();
} catch {
  /* no-op */
}

// Mettre à jour une background-image avec un paramètre de version
export function updateBackgroundImage(element, timestamp) {
  if (shouldSkipVersioning(element)) return;
  if (element.dataset.bgProcessed) return; // Déjà traité
  const imageUrl = extractBackgroundImageUrl(getComputedStyleSafe(element));
  if (!imageUrl?.startsWith('http')) {
    return;
  }

  element.dataset.bgProcessed = 'true';

  try {
    const url = new URL(imageUrl);
    url.searchParams.set('v', timestamp);
    element.style.backgroundImage = `url("${url.href}")`;
  } catch {
    /* ignore invalid URL */
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
