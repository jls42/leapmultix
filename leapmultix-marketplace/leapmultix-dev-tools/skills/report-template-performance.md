---
name: reporting-performance-analysis
description: Standardized template for performance analysis reports with Lighthouse metrics. Use when generating performance analysis outputs.
---

# Analyse des performances : [Nom du composant/de la page]

## Résumé

**Statut** : ✅ OPTIMAL | ⚠️ A BESOIN D'AMÉLIORATION | ❌ PROBLÈMES CRITIQUES TROUVÉS
**Score Lighthouse** : [Valeur]/100
**LCP** : [Valeur]s (Cible : < 2.5s) [✅|⚠️|❌]
**CLS** : [Valeur] (Cible : < 0.1) [✅|⚠️|❌]
**TBT** : [Valeur]ms (Cible : < 200ms) [✅|⚠️|❌]

---

## Analyse des Core Web Vitals

### Largest Contentful Paint (LCP) : [Valeur]s

- **Élément LCP** : [Description de l'élément]
- **Opportunités d'optimisation** : [Recommandation 1], [Recommandation 2]

### Cumulative Layout Shift (CLS) : [Valeur]

- **Éléments problématiques** : [Lister les éléments causant un décalage]
- **Correctifs suggérés** : [Suggestions pour réserver de l'espace ou optimiser le chargement]

### Total Blocking Time (TBT) : [Valeur]ms

- **Tâches longues identifiées** : [Lister les scripts ou fonctions bloquantes]
- **Stratégies d'optimisation** : [Suggestions pour diviser les tâches ou différer le code]

---

## Goulots d'étranglement des performances

### Critique (À corriger immédiatement)

1. **[Titre du problème]**
   - **Impact sur la métrique** : [Métrique spécifique affectée et de combien]
   - **Cause racine** : [Explication technique]
   - **Solution suggérée** : [Description du correctif]

### Important (À corriger bientôt)

[Même structure que Critique]
