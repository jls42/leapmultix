#!/usr/bin/env node

/**
 * Script pour désactiver le Service Worker pendant la refactorisation
 * Les erreurs de fetch du SW peuvent interférer avec le développement
 */

import fs from 'node:fs';
// path import removed as it's unused

const SW_FILE = './sw.js';
const SW_BACKUP = './sw.js.backup';

function disableServiceWorker() {
  console.log('🔧 Désactivation du Service Worker pour la refactorisation...');

  // Sauvegarder le SW original
  if (fs.existsSync(SW_FILE)) {
    fs.copyFileSync(SW_FILE, SW_BACKUP);
    console.log('✅ Sauvegarde du SW original dans sw.js.backup');
  }

  // Créer un SW minimal qui ne fait rien
  const minimalSW = `// Service Worker désactivé pendant la refactorisation
console.log('Service Worker désactivé pour la refactorisation');

self.addEventListener('install', event => {
  console.log('SW minimal: Installation');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('SW minimal: Activation');
  // Nettoyer tous les caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          console.log('Suppression du cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  // Ne rien faire - laisser passer toutes les requêtes normalement
  return;
});`;

  fs.writeFileSync(SW_FILE, minimalSW);
  console.log('✅ Service Worker remplacé par une version minimale');
  console.log('🔄 Rechargez votre navigateur et videz le cache (Ctrl+Shift+R)');
}

function restoreServiceWorker() {
  console.log('🔧 Restauration du Service Worker original...');

  if (fs.existsSync(SW_BACKUP)) {
    fs.copyFileSync(SW_BACKUP, SW_FILE);
    fs.unlinkSync(SW_BACKUP);
    console.log('✅ Service Worker original restauré');
    console.log('🔄 Rechargez votre navigateur pour réactiver le SW');
  } else {
    console.error('❌ Impossible de trouver la sauvegarde sw.js.backup');
  }
}

// Vérifier les arguments de ligne de commande
const action = process.argv[2];

if (action === 'disable') {
  disableServiceWorker();
} else if (action === 'restore') {
  restoreServiceWorker();
} else {
  console.log('Usage:');
  console.log('  node scripts/disable-sw.js disable   # Désactiver le SW');
  console.log('  node scripts/disable-sw.js restore   # Restaurer le SW');
}
