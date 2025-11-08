---
name: reporting-pwa-audit
description: Standardized template for Progressive Web App audit reports with offline and service worker checks. Use when generating PWA audit outputs.
---

# Rapport d'audit PWA : [Nom de la fonctionnalité/modification]

## Résumé

**Statut général** : ✅ PRÊT POUR LA PRODUCTION | ⚠️ PROBLÈMES TROUVÉS | ❌ NON PRÊT
**Scores Lighthouse** : Performance [X], PWA [X], Accessibilité [X]
**Fonctionnalité hors ligne** : ✅ OUI | ❌ NON

---

## Analyse du Service Worker

- **Statut** : ✅ OPTIMAL | ⚠️ A BESOIN D'AMÉLIORATION | ❌ CASSÉ
- **Stratégie de cache** : [cache-first/network-first]
- **Problèmes trouvés** : [Lister les problèmes de SW]

---

## Fonctionnalité hors ligne

- **Statut** : ✅ FONCTIONNE PARFAITEMENT | ⚠️ PARTIEL | ❌ CASSÉ
- **Scénarios testés** : [Chargement initial, navigation, jeu hors ligne]
- **Problèmes** : [Lister les problèmes hors ligne]

---

## Manifeste d'application Web

- **Statut** : ✅ VALIDE | ⚠️ INCOMPLET | ❌ INVALIDE
- **Checklist** : [name, short_name, icons, display: standalone, etc.]

---

## Actions à entreprendre

### Doit être corrigé (Bloquant)

1. [Problème critique 1]

### Devrait être corrigé (Haute priorité)

1. [Problème important 1]
