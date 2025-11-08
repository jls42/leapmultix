---
name: managing-pwa-service-worker
description: Manages Service Worker updates securely with cache versioning and offline tests. Use when modifying SW, adding resources, or changing cache strategy
allowed-tools: Read, Write, Grep, Glob, Bash
---

# PWA Service Worker Manager

Gère Service Worker pour offline play et cache versioning sécurisé.

## Quand utiliser

- Modification Service Worker
- Ajout ressources à cacher
- Changement stratégie cache
- Tests offline
- Correction bugs SW

## Scripts essentiels

```bash
npm run test:pwa-offline    # Tester offline (PRINCIPAL)
npm run sw:disable          # Désactiver SW
npm run sw:fix              # Réparer SW
```

## Versioning et workflow

**SemVer (voir sw.js) :**

- Major : Changements cassants
- Minor : Ressources ajoutées
- Patch : Corrections

**Workflow :**

1. **Modifier :** sw.js (version, ressources, handlers)
2. **Incrémenter :** Version (SemVer)
3. **Tester :** `npm run test:pwa-offline`
4. **Vérifier :** DevTools App tab (Offline mode)
5. **Quality :** format:check, lint, test

## Stratégies de cache

- **Cache First :** Assets (HTML, CSS, JS, images)
- **Network First :** APIs (données fraîches)
- **Cache Only :** Assets immuables
- **Network Only :** Analytics, auth

Trouve stratégie dans sw.js existant.

## Événements SW clés

- **Install :** Créer cache, skipWaiting()
- **Activate :** Nettoyer anciens caches, clients.claim()
- **Fetch :** Appliquer stratégie, gérer erreurs

## Debugging

**Chrome DevTools (F12) → Application → Service Workers :**

- Offline mode → Tester navigation
- caches.keys() en console → Vérifier caches

**Problèmes courants :**

- SW ne s'update → Incrémenter version, skipWaiting() présent
- Ressources manquantes → Ajouter à liste cache
- Cache volumineux → Cacher uniquement ressources critiques

## Checklist

- [ ] Version incrémentée (SemVer)
- [ ] skipWaiting() + clients.claim() présents
- [ ] Nettoyage anciens caches
- [ ] Offline test OK (`npm run test:pwa-offline`)
- [ ] DevTools Offline mode OK
- [ ] format:check, lint, test passent

## En cas de doute

**Règles absolues :**

1. Incrémenter version TOUJOURS
2. Tester offline AVANT commit
3. DevTools Application tab verification
4. `npm run test:pwa-offline` doit passer
5. skipWaiting() + clients.claim() essentiels

**Références :**

- `sw.js` - Service Worker principal
- `manifest.json` - PWA manifest
- Chrome DevTools Application tab
