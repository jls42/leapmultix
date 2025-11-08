---
name: reporting-arcade-game-analysis
description: Standardized template for arcade game analysis reports with performance and gameplay metrics. Use when generating arcade game analysis outputs.
---

# Analyse du jeu d'arcade : [Nom du jeu]

## Résumé

**Statut** : ✅ OPTIMAL | ⚠️ ACCEPTABLE | ❌ PROBLÈMES CRITIQUES TROUVÉS
**FPS cible** : 60
**FPS mesuré** : [Valeur FPS moyenne]
**Budget de trame** : 16,6 ms par trame
**Temps de trame réel** : [Moyenne en ms]
**Utilisation de la mémoire** : [Mo]
**Performances de collision** : [vérifications par trame]

[Bref aperçu de 2 à 3 phrases de l'état du jeu et des principales conclusions]

## Analyse des performances

### Performances de rendu

**État actuel** :

- Appels de dessin par image : [nombre]
- Taille du canevas : [largeur x hauteur]
- Couches utilisées : [nombre]
- Mise en cache des sprites : [Oui/Non]

**Conclusions** :

- ✅ Efficace : [Lister les aspects optimisés]
- ⚠️ Préoccupations : [Lister les problèmes potentiels]
- ❌ Problèmes : [Lister les problèmes critiques]

### Performances de la détection de collision

**État actuel** :

- Algorithme : [AABB / Cercle / Au pixel près / Partitionnement spatial]
- Vérifications par trame : [nombre]
- Complexité : [O(n), O(n²), O(n log n)]

**Conclusions** :
[Analyse détaillée de l'efficacité de la détection de collision]

## Recommandations d'optimisation

### Critique (À corriger) - Impact : Élevé, Effort : [Faible/Moyen/Élevé]

1. **[Titre du problème]**
   - **Problème** : [Description]
   - **Impact** : [Chute de FPS, fuite de mémoire, etc.]
   - **Solution** :

   ```javascript
   // Avant
   [Code problématique actuel]

   // Après
   [Code optimisé]
   ```

### Important (Devrait être corrigé) - Impact : Moyen, Effort : [Faible/Moyen/Élevé]

[Même structure que Critique]

## Prochaines étapes

1. **Immédiat** : [Corrections critiques à mettre en œuvre]
2. **À court terme** : [Améliorations importantes]
