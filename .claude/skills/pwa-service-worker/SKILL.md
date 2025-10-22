---
name: 'PWA Service Worker Manager'
description: 'Gère les mises à jour du Service Worker de manière sécurisée avec versioning du cache et tests offline. Utiliser lors de modifications du SW, ajout de ressources, ou changements de stratégie de cache'
---

# PWA Service Worker Manager

Cette skill guide la gestion sécurisée du Service Worker pour l'application PWA leapmultix.

## Quand utiliser cette skill

- Modification du Service Worker
- Ajout de nouvelles ressources à cacher
- Changement de stratégie de cache
- Mise à jour de version de l'application
- Correction de bugs du Service Worker
- Tests de fonctionnalité offline

## Architecture PWA actuelle

### Fichiers Service Worker

```
leapmultix/
├── sw.js                    # Service Worker principal
├── js/cache-updater.js      # Gestion versions cache (10 KB)
└── manifest.json            # Manifeste PWA
```

### Stratégie de cache actuelle

Le Service Worker utilise une stratégie **Cache First** avec fallback :

1. Vérifier le cache en premier
2. Si absent, fetch depuis le réseau
3. Mettre en cache la nouvelle ressource

## Commandes disponibles

### Tester le PWA offline

```bash
npm run test:pwa-offline
```

Vérifie que l'application fonctionne hors ligne.

### Désactiver le Service Worker

```bash
npm run sw:disable
```

Désactive temporairement le SW pour debug.

### Réparer le Service Worker

```bash
npm run sw:fix
```

Réinitialise le SW en cas de problèmes.

## Gestion des versions de cache

### Système de versioning

Le cache utilise un système de versioning automatique via `cache-updater.js` :

```javascript
// Version du cache dans sw.js
const CACHE_VERSION = 'v1.2.3';
const CACHE_NAME = `leapmultix-${CACHE_VERSION}`;
```

**Quand incrémenter la version :**

- Changements dans `sw.js` → Incrémenter version
- Ajout/suppression de ressources → Incrémenter version
- Modification de stratégie de cache → Incrémenter version
- Corrections de bugs → Incrémenter patch

### Convention de versioning

Utiliser **SemVer** (Semantic Versioning) :

- **Major** (v2.0.0) : Changements cassants, nouvelle architecture
- **Minor** (v1.2.0) : Nouvelles fonctionnalités, ressources ajoutées
- **Patch** (v1.2.3) : Corrections de bugs, optimisations

```javascript
// Exemple de changements de version
const CACHE_VERSION = 'v1.2.3';

// Major: Nouvelle stratégie de cache complète
const CACHE_VERSION = 'v2.0.0';

// Minor: Ajout de nouvelles ressources
const CACHE_VERSION = 'v1.3.0';

// Patch: Correction bug de cache
const CACHE_VERSION = 'v1.2.4';
```

## Modification du Service Worker

### Processus sécurisé de modification

#### 1. Créer une branche

```bash
git checkout -b feat/update-service-worker
```

#### 2. Modifier sw.js

```javascript
// sw.js

// ✅ TOUJOURS incrémenter la version
const CACHE_VERSION = 'v1.3.0'; // Ancien: v1.2.0
const CACHE_NAME = `leapmultix-${CACHE_VERSION}`;

// Ressources à cacher
const RESOURCES_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/main.js',
  '/js/game.js',
  // Ajouter nouvelles ressources ici
  '/js/new-feature.js',
  '/assets/new-sprite.png',
];
```

#### 3. Tester localement

```bash
# Démarrer serveur local
npm run serve

# Tester offline dans navigateur
# 1. Ouvrir DevTools → Application → Service Workers
# 2. Cocher "Offline"
# 3. Tester navigation
```

#### 4. Tester avec script

```bash
npm run test:pwa-offline
```

#### 5. Vérifier qualité

```bash
npm run format:check
npm run lint
npm test
```

#### 6. Commit et PR

```bash
git add sw.js
git commit -m "Update Service Worker to v1.3.0

- Add caching for new-feature.js
- Add caching for new sprites
- Increment cache version to v1.3.0"

git push -u origin feat/update-service-worker
# Créer PR
```

## Stratégies de cache

### Cache First (stratégie actuelle)

**Quand utiliser :** Assets statiques (HTML, CSS, JS, images)

```javascript
// sw.js - Cache First
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      // Retourner depuis cache si disponible
      if (cached) {
        return cached;
      }

      // Sinon fetch et mettre en cache
      return fetch(event.request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
```

**Avantages :**

- Performance maximale
- Fonctionne offline
- Réduit utilisation réseau

**Inconvénients :**

- Contenu peut être obsolète
- Nécessite version de cache pour forcer update

### Network First

**Quand utiliser :** API calls, données dynamiques

```javascript
// Network First - Pour données dynamiques
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Mettre en cache après fetch
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          // Fallback sur cache si réseau échoue
          return caches.match(event.request);
        })
    );
  }
});
```

### Cache Only

**Quand utiliser :** Assets qui ne changent jamais

```javascript
// Cache Only - Assets immuables
const IMMUTABLE_ASSETS = ['/assets/logo.svg', '/fonts/roboto.woff2'];

self.addEventListener('fetch', event => {
  if (IMMUTABLE_ASSETS.some(asset => event.request.url.includes(asset))) {
    event.respondWith(caches.match(event.request));
  }
});
```

### Network Only

**Quand utiliser :** Requêtes à ne jamais cacher (analytics, auth)

```javascript
// Network Only - Toujours fetch
const NO_CACHE_URLS = ['/api/auth/', '/analytics/'];

self.addEventListener('fetch', event => {
  if (NO_CACHE_URLS.some(url => event.request.url.includes(url))) {
    event.respondWith(fetch(event.request));
  }
});
```

## Gestion des événements Service Worker

### Install event

```javascript
// sw.js - Installation
self.addEventListener('install', event => {
  console.log('[SW] Installing version', CACHE_VERSION);

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching resources');
      return cache.addAll(RESOURCES_TO_CACHE);
    })
  );

  // Activer immédiatement le nouveau SW
  self.skipWaiting();
});
```

**À faire pendant install :**

- Ouvrir nouveau cache
- Pré-cacher ressources critiques
- Appeler `skipWaiting()` pour activation immédiate

### Activate event

```javascript
// sw.js - Activation
self.addEventListener('activate', event => {
  console.log('[SW] Activating version', CACHE_VERSION);

  event.waitUntil(
    // Nettoyer anciens caches
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => {
            // Supprimer caches qui ne matchent pas la version actuelle
            return name.startsWith('leapmultix-') && name !== CACHE_NAME;
          })
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );

  // Prendre contrôle immédiatement
  return self.clients.claim();
});
```

**À faire pendant activate :**

- Supprimer anciens caches
- Appeler `clients.claim()` pour contrôle immédiat
- Migrations de données si nécessaire

### Fetch event

```javascript
// sw.js - Fetch avec gestion d'erreurs
self.addEventListener('fetch', event => {
  // Ignorer requêtes non-GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches
      .match(event.request)
      .then(cached => {
        if (cached) {
          return cached;
        }

        return fetch(event.request).then(response => {
          // Ne cacher que les réponses OK
          if (!response || response.status !== 200) {
            return response;
          }

          // Cloner avant de cacher
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
      .catch(error => {
        console.error('[SW] Fetch error:', error);

        // Page offline de fallback
        if (event.request.destination === 'document') {
          return caches.match('/offline.html');
        }
      })
  );
});
```

## Cache Updater Integration

### Utilisation de cache-updater.js

Le module `cache-updater.js` gère le versioning automatique des assets :

```javascript
// js/cache-updater.js
import { versionImageSrc, updateBackgroundImage } from './cache-updater.js';

// Ajouter version aux images
const imgSrc = versionImageSrc('/assets/sprite.png');
// Résultat: /assets/sprite.png?v=1.2.3

// Mettre à jour background-image CSS
updateBackgroundImage(element, '/assets/bg.png');
// Applique: background-image: url(/assets/bg.png?v=1.2.3)
```

### Versioning automatique des ressources

```javascript
// Générer URL avec version
function getCachedAssetUrl(path) {
  const version = CACHE_VERSION.replace('v', '');
  return `${path}?v=${version}`;
}

// Utilisation
const cssUrl = getCachedAssetUrl('/css/styles.css');
// Résultat: /css/styles.css?v=1.2.3
```

## Debugging du Service Worker

### Chrome DevTools

**Accéder aux DevTools :**

1. Ouvrir DevTools (F12)
2. Aller à l'onglet "Application"
3. Section "Service Workers"

**Actions disponibles :**

- **Unregister** : Supprimer le SW
- **Update** : Forcer mise à jour
- **Offline** : Simuler mode offline
- **Bypass for network** : Ignorer SW temporairement

### Console logs

```javascript
// sw.js - Logs détaillés
console.log('[SW] Installing version', CACHE_VERSION);
console.log('[SW] Cached response for', event.request.url);
console.log('[SW] Fetch error for', event.request.url, error);
```

### Inspecter le cache

```javascript
// Dans la console du navigateur
caches.keys().then(keys => {
  console.log('Caches disponibles:', keys);
});

caches.open('leapmultix-v1.2.3').then(cache => {
  cache.keys().then(requests => {
    console.log(
      'Ressources cachées:',
      requests.map(r => r.url)
    );
  });
});
```

### Nettoyer manuellement le cache

```javascript
// Console navigateur - Supprimer tous les caches
caches
  .keys()
  .then(keys => {
    return Promise.all(keys.map(key => caches.delete(key)));
  })
  .then(() => {
    console.log('Tous les caches supprimés');
  });

// Désinscrire le Service Worker
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister());
});
```

## Tests du Service Worker

### Tests manuels

**Checklist de test offline :**

1. **Première visite (online)**
   - [ ] Ouvrir application avec DevTools ouverts
   - [ ] Vérifier que SW est installé (Application → Service Workers)
   - [ ] Vérifier que ressources sont cachées (Application → Cache Storage)
   - [ ] Noter les ressources cachées

2. **Test offline**
   - [ ] Cocher "Offline" dans DevTools
   - [ ] Recharger la page (Ctrl+R)
   - [ ] Application doit se charger normalement
   - [ ] Tester navigation entre slides
   - [ ] Vérifier que jeux fonctionnent
   - [ ] Vérifier que sons jouent (si cachés)

3. **Test mise à jour**
   - [ ] Modifier CACHE_VERSION dans sw.js
   - [ ] Recharger la page (peut nécessiter 2 rechargements)
   - [ ] Vérifier nouveau SW activé dans DevTools
   - [ ] Vérifier ancien cache supprimé
   - [ ] Tester application fonctionne toujours

4. **Test de fallback**
   - [ ] Mode offline activé
   - [ ] Naviguer vers URL non cachée
   - [ ] Vérifier affichage page offline (si implémenté)

### Tests automatisés

```bash
# Test PWA offline
npm run test:pwa-offline
```

### Tests avec Lighthouse

```bash
# Audit PWA complet
npx lighthouse http://localhost:8000 --view

# Critères PWA vérifiés :
# - Service Worker enregistré
# - Répond en mode offline
# - Manifeste valide
# - HTTPS (en production)
# - Icônes appropriées
```

## Problèmes courants et solutions

### 1. Service Worker ne s'update pas

**Symptômes :**

- Ancien cache toujours utilisé
- Modifications non visibles

**Causes :**

- Version de cache non incrémentée
- `skipWaiting()` non appelé
- Browser cache agressif

**Solutions :**

```javascript
// sw.js - Forcer update
self.addEventListener('install', event => {
  self.skipWaiting(); // ✅ Ajouter cette ligne
});

self.addEventListener('activate', event => {
  self.clients.claim(); // ✅ Ajouter cette ligne
});
```

```javascript
// main.js - Forcer refresh sur update
navigator.serviceWorker.addEventListener('controllerchange', () => {
  window.location.reload();
});
```

### 2. Ressources manquantes offline

**Symptômes :**

- Erreurs 404 en mode offline
- Fonctionnalités ne marchent pas

**Causes :**

- Ressource non dans RESOURCES_TO_CACHE
- Typo dans chemin

**Solutions :**

```javascript
// sw.js - Ajouter ressource manquante
const RESOURCES_TO_CACHE = [
  // ... autres ressources
  '/js/missing-module.js', // ✅ Ajouter
  '/assets/missing-sprite.png', // ✅ Ajouter
];

// ✅ Incrémenter version
const CACHE_VERSION = 'v1.2.4';
```

### 3. Cache trop volumineux

**Symptômes :**

- Temps d'installation long
- Erreur QuotaExceeded

**Solutions :**

```javascript
// sw.js - Stratégie sélective
const CRITICAL_RESOURCES = ['/', '/index.html', '/css/critical.css', '/js/main.js'];

const OPTIONAL_RESOURCES = [
  '/assets/large-video.mp4', // Ne pas pré-cacher
];

// Pré-cacher seulement critical
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CRITICAL_RESOURCES);
    })
  );
});

// Cacher optional à la demande
self.addEventListener('fetch', event => {
  // Cache on demand pour OPTIONAL_RESOURCES
});
```

### 4. SW bloqué en "waiting"

**Symptômes :**

- Nouveau SW installé mais pas activé
- Reste en état "waiting"

**Solutions :**

```javascript
// main.js - Forcer activation
navigator.serviceWorker.ready.then(registration => {
  registration.addEventListener('updatefound', () => {
    const newWorker = registration.installing;

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // Notifier utilisateur
        if (confirm('Nouvelle version disponible. Recharger ?')) {
          newWorker.postMessage({ type: 'SKIP_WAITING' });
        }
      }
    });
  });
});
```

```javascript
// sw.js - Écouter message SKIP_WAITING
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
```

## Bonnes pratiques

### Do's ✅

1. **Toujours incrémenter CACHE_VERSION** lors de modifications
2. **Tester offline** avant de merger
3. **Nettoyer anciens caches** dans activate
4. **Utiliser skipWaiting()** pour activation immédiate
5. **Logger actions du SW** pour debugging
6. **Versionner les assets** avec cache-updater.js
7. **Tester sur navigateurs multiples** (Chrome, Firefox, Safari)
8. **Inclure page offline** de fallback

### Don'ts ❌

1. **Ne pas oublier skipWaiting()** - SW restera en waiting
2. **Ne pas cacher APIs externes** - Stratégie différente requise
3. **Ne pas cacher assets trop volumineux** - QuotaExceeded
4. **Ne pas cacher requêtes POST/PUT/DELETE** - Uniquement GET
5. **Ne pas oublier de tester offline** - Bugs difficiles à debug
6. **Ne pas committer sans incrémenter version** - Cache obsolète
7. **Ne pas supprimer cache manuellement en prod** - Perte données

## Checklist avant commit

- [ ] CACHE_VERSION incrémenté (SemVer)
- [ ] Toutes ressources nécessaires dans RESOURCES_TO_CACHE
- [ ] skipWaiting() et clients.claim() présents
- [ ] Nettoyage anciens caches dans activate
- [ ] Testé en mode offline (npm run test:pwa-offline)
- [ ] Logs de debugging ajoutés
- [ ] Code formatté (npm run format:check)
- [ ] Lint passé (npm run lint)
- [ ] Tests passent (npm test)
- [ ] Documentation mise à jour si API changée

## Commandes utiles

```bash
# Démarrer serveur local
npm run serve

# Tester PWA offline
npm run test:pwa-offline

# Désactiver SW temporairement
npm run sw:disable

# Réparer SW
npm run sw:fix

# Audit PWA
npx lighthouse http://localhost:8000 --only-categories=pwa

# Build production
npm run build
npm run serve:dist
```

## Ressources

### Fichiers projet

- `sw.js` - Service Worker principal
- `js/cache-updater.js` - Versioning cache (10 KB)
- `manifest.json` - Manifeste PWA

### Scripts npm

- `npm run test:pwa-offline` - Test fonctionnalité offline
- `npm run sw:disable` - Désactiver Service Worker
- `npm run sw:fix` - Réparer Service Worker

### Documentation

- Service Worker API: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- Workbox (alternative): https://developers.google.com/web/tools/workbox
- PWA Checklist: https://web.dev/pwa-checklist/

## Voir aussi

- `code-quality/SKILL.md` - Workflow de qualité avant commit
- `tdd-jest/SKILL.md` - Tests automatisés du SW
- `CLAUDE.md` - Architecture et conventions du projet
