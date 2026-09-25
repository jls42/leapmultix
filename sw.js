// Progressive Web App: enhanced service worker
// Strategies:
// - Navigation: network-first, offline fallback
// - Images: cache-first
// - Translations JSON: stale-while-revalidate
// - JS/CSS: network-first with cache fallback (updates take precedence)
// - Recorded voice: clips cache-first in their own cache (kept across versions),
//   index network-first (kill switch) with an offline copy

const VERSION = 'v26'; // bump to trigger client update
const OFFLINE_CACHE = `leapmultix-offline-${VERSION}`;
const RUNTIME_CACHE = `leapmultix-runtime-${VERSION}`;
const OFFLINE_URL = '/offline.html';

// Voix enregistrée (docs/voix-enregistree.md). Les clips sont immuables : un cache à part,
// épargné par activate, que chaque nouvel index purge des versions périmées.
const VOICE_CACHE = 'leapmultix-voice';
const VOICE_CACHE_LIMIT = 2000;
const VOICE_INDEX = '/voice/index.json';
const VOICE_CLIP = /^\/voice\/([a-z]{2})\/([a-z0-9][a-z0-9.-]*)\/[0-9a-z]+\.mp3$/;
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/assets/icons/panda-192.png',
  '/assets/icons/panda-512.png',
  // Minimal CSS for structure
  '/css/general.css',
  '/css/responsive-unified.css',
];

self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(OFFLINE_CACHE);
      await cache.addAll([OFFLINE_URL, ...APP_SHELL]);
    })()
  );

  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const keys = await caches.keys();
      const oldCaches = keys.filter(
        k =>
          (k.startsWith('leapmultix-offline-') || k.startsWith('leapmultix-runtime-')) &&
          !k.endsWith(VERSION)
      );

      await Promise.all(oldCaches.map(k => caches.delete(k)));

      await self.clients.claim();
    })()
  );
});

/** Un clip ne se garde que s'il est bien un MP3 du site, reçu en entier */
function isStorableClip(response) {
  return (
    response.status === 200 &&
    response.type === 'basic' &&
    !response.redirected &&
    (response.headers.get('content-type') || '').startsWith('audio/mpeg')
  );
}

async function voiceClip(event) {
  const cache = await caches.open(VOICE_CACHE);
  const hit = await cache.match(event.request);
  if (hit) return hit;
  let response;
  try {
    response = await fetch(event.request);
  } catch {
    // Hors ligne et pas en cache : échec immédiat, le jeu passe à la voix de l'appareil
    return Response.error();
  }
  if (isStorableClip(response)) event.waitUntil(cache.put(event.request, response.clone()));
  return response;
}

/**
 * Nouvel index : retire les clips des versions (ou des langues) qu'il n'annonce plus,
 * puis les plus anciens au-delà du plafond. Hors du chemin de la réponse.
 */
async function pruneVoiceCache(index) {
  const languages = index && typeof index.languages === 'object' ? index.languages : null;
  if (!languages) return;
  const cache = await caches.open(VOICE_CACHE);
  const clips = (await cache.keys()).filter(request =>
    VOICE_CLIP.test(new URL(request.url).pathname)
  );
  const isCurrent = request => {
    const [, lang, version] = VOICE_CLIP.exec(new URL(request.url).pathname);
    return languages[lang]?.version === version;
  };
  const stale = clips.filter(request => !isCurrent(request));
  const kept = clips.filter(isCurrent);
  const excess = kept.slice(0, Math.max(0, kept.length - VOICE_CACHE_LIMIT));
  await Promise.all([...stale, ...excess].map(request => cache.delete(request)));
}

async function voiceIndex(event) {
  const cache = await caches.open(VOICE_CACHE);
  try {
    const response = await fetch(event.request);
    if (response.ok) {
      const copy = response.clone();
      event.waitUntil(
        cache
          .put(VOICE_INDEX, copy.clone())
          .then(() => copy.json())
          .then(pruneVoiceCache)
          .catch(() => {})
      );
    } else if ([403, 404, 410].includes(response.status)) {
      // Index retiré : sa copie ne doit pas revenir hors ligne
      event.waitUntil(cache.delete(VOICE_INDEX));
    }
    return response;
  } catch {
    // Hors ligne : la dernière copie de l'index
    return (await cache.match(VOICE_INDEX)) || Response.error();
  }
}

function sameOrigin(url) {
  try {
    return new URL(url, self.location.origin).origin === self.location.origin;
  } catch {
    return false;
  }
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // Navigation: network-first, fallback offline
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          return response;
        } catch {
          const offline = await caches.match(OFFLINE_URL, { cacheName: OFFLINE_CACHE });
          // eslint-disable-next-line no-undef -- Browser API, Response is globally available in service workers
          return offline || Response.error();
        }
      })()
    );
    return;
  }

  if (!sameOrigin(request.url)) return; // skip cross-origin

  const { pathname } = new URL(request.url);
  if (pathname === VOICE_INDEX) {
    event.respondWith(voiceIndex(event));
    return;
  }
  if (VOICE_CLIP.test(pathname)) {
    event.respondWith(voiceClip(event));
    return;
  }

  const dest = request.destination;

  // Images: cache-first
  if (dest === 'image') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(RUNTIME_CACHE);
        const hit = await cache.match(request);
        if (hit) return hit;
        const net = await fetch(request);
        if (net.ok) cache.put(request, net.clone());
        return net;
      })()
    );
    return;
  }

  // Translations JSON: stale-while-revalidate
  // Le chemin seul : les traductions se demandent avec ?v=<version>
  if (pathname.startsWith('/assets/translations/') && pathname.endsWith('.json')) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(RUNTIME_CACHE);
        const cached = await cache.match(request);
        const fetchPromise = fetch(request)
          .then(net => {
            if (net.ok) cache.put(request, net.clone());
            return net;
          })
          .catch(() => null);
        // eslint-disable-next-line no-undef -- Browser API, Response is globally available in service workers
        return cached || (await fetchPromise) || Response.error();
      })()
    );
    return;
  }

  // JS/CSS: network-first with cache fallback
  if (dest === 'script' || dest === 'style') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(RUNTIME_CACHE);
        try {
          const net = await fetch(request, { cache: 'no-store' });
          if (net.ok) cache.put(request, net.clone());
          return net;
        } catch {
          const cached = await cache.match(request);
          // eslint-disable-next-line no-undef -- Browser API, Response is globally available in service workers
          return cached || Response.error();
        }
      })()
    );
  }
});
