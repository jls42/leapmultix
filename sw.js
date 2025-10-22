// Progressive Web App: enhanced service worker
// Strategies:
// - Navigation: network-first, offline fallback
// - Images: cache-first
// - Translations JSON: stale-while-revalidate
// - JS/CSS: network-first with cache fallback (updates take precedence)

const VERSION = 'v8'; // bump to trigger client update
const OFFLINE_CACHE = `leapmultix-offline-${VERSION}`;
const RUNTIME_CACHE = `leapmultix-runtime-${VERSION}`;
const OFFLINE_URL = '/offline.html';
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
  if (request.url.includes('/assets/translations/') && request.url.endsWith('.json')) {
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
          const net = await fetch(request);
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
