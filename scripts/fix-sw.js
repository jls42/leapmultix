#!/usr/bin/env node

/**
 * Script pour corriger les erreurs du Service Worker
 * Améliore la gestion d'erreur et la stratégie de cache
 */

import fs from 'fs';

const SW_FILE = './sw.js';

function fixServiceWorker() {
  console.log('🔧 Correction du Service Worker...');

  const improvedSW = `// Service Worker pour LeapMultix - Version corrigée
const CACHE_NAME = 'leapmultix-cache-v2';
const APP_VERSION = '1.0.1';
const SW_VERSION = '2025-05-29-fixed';

// Installation du service worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installation (version ' + SW_VERSION + ')');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression du cache: ' + cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activation - nettoyage des anciens caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activation de la version ' + SW_VERSION);
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Suppression de ancien cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Stratégie de mise en cache améliorée avec gestion d'erreur
self.addEventListener('fetch', event => {
  // Ignorer les requêtes non-HTTP/HTTPS
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Ignorer les requêtes vers les extensions du navigateur
  if (event.request.url.startsWith('chrome-extension://') || 
      event.request.url.startsWith('moz-extension://')) {
    return;
  }

  // Pour les ressources HTML et images, network first
  if (event.request.url.endsWith('.html') || 
      event.request.url.endsWith('/') || 
      event.request.url.match(/\\\\.(png|jpe?g|gif|svg|webp)$/) || 
      event.request.url.includes('/assets/images/')) {
    
    event.respondWith(
      fetch(event.request, { 
        cache: 'no-cache',
        mode: 'cors'
      })
      .then(response => {
        // Vérifier que la réponse est valide
        if (response && response.status === 200 && response.type === 'basic') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone).catch(err => {
              console.log('Erreur cache put:', err);
            });
          }).catch(err => {
            console.log('Erreur cache open:', err);
          });
        }
        return response;
      })
      .catch(error => {
        console.log('Network fetch failed, falling back to cache:', error);
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Retourner une réponse d'erreur appropriée
          return new Response('Resource not available offline', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
    );
    return;
  }
  
  // Pour les autres ressources, cache first avec fallback réseau
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Mettre à jour le cache en arrière-plan (sans attendre)
        fetch(event.request, { mode: 'cors' })
          .then(networkResponse => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, networkResponse.clone()).catch(err => {
                  console.log('Background cache update failed:', err);
                });
              }).catch(err => {
                console.log('Background cache open failed:', err);
              });
            }
          })
          .catch(error => {
            // Ignorer silencieusement les erreurs de mise à jour en arrière-plan
            console.log('Background fetch failed (ignored):', error);
          });
        
        return cachedResponse;
      }
      
      // Si pas dans le cache, récupérer depuis le réseau
      return fetch(event.request, { mode: 'cors' })
        .then(networkResponse => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          
          // Mettre en cache la nouvelle ressource
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone).catch(err => {
              console.log('Cache put failed:', err);
            });
          }).catch(err => {
            console.log('Cache open failed:', err);
          });
          
          return networkResponse;
        })
        .catch(error => {
          console.log('Network fetch failed:', error);
          return new Response('Resource not available', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
    }).catch(error => {
      console.log('Cache match failed:', error);
      return fetch(event.request).catch(() => {
        return new Response('Service unavailable', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
    })
  );
});

// Gestion des messages
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CHECK_VERSION') {
    event.ports[0].postMessage({
      version: APP_VERSION
    });
  }
});

console.log('Service Worker chargé - Version corrigée ' + SW_VERSION);`;

  fs.writeFileSync(SW_FILE, improvedSW);
  console.log("✅ Service Worker corrigé avec gestion d'erreur améliorée");
  console.log('🔄 Le SW corrigé sera utilisé au prochain rechargement');
}

fixServiceWorker();
