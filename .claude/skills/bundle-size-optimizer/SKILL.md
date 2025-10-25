---
name: 'Optimiseur de Taille de Bundle'
description: "Analyse et réduit la taille des bundles JavaScript pour chargement rapide. Utiliser lors d'ajout de dépendances, avant release, ou si bundle > 200 KB"
---

# Optimiseur de Taille de Bundle

Optimise taille des bundles JavaScript pour chargement rapide et performance mobile.

## Quand utiliser

- Ajout de nouvelles dépendances
- Bundle > 200 KB (gzipped)
- Avant chaque release
- Optimisation mobile (3G/4G)
- Audit de performance

## Cibles de taille

- Bundle initial : < 100 KB (gzipped)
- Bundle total : < 500 KB
- Modules individuels : < 50 KB

## Stratégies essentielles

### Tree Shaking
- Imports nommés (pas `import *`)
- Imports spécifiques de modules externes
- Named exports (pas d'export default d'objets)

### Code Splitting
- Import dynamique avec `import()`
- Lazy loading de composants lourds
- Vérifier lazy loading des modes de jeu

### Minification & Compression
- Minifier actif en production
- Gzip/Brotli sur serveur (-70% taille)
- Source maps pour debug

### Éliminer duplications
- Détecter code similaire entre modules
- Extraire logique partagée
- Cherche jeux arcade avec patterns similaires

## Outils d'analyse

**Scripts npm :**
- `npm run analyze:dependencies` - Dépendances non utilisées
- `npm run dead-code` - Exports/fonctions jamais appelés
- `npm run analyze:globals` - Variables globales
- `npm run analyze:assets` - Assets volumineux

**Mesurer impact :**
- Taille gzippée avant/après
- Lighthouse CI (Performance > 90)
- Tests mobile 3G/4G

## Workflow

1. **Analyser :** Lancer scripts npm d'analyse
2. **Identifier :** Code mort, modules lourds, imports sous-optimaux
3. **Optimiser :** Une stratégie à la fois (lazy loading > tree shaking > minification)
4. **Mesurer :** Taille gzippée, temps chargement, Lighthouse
5. **Valider :** Tests passent, mobile performant

## Checklist

- [ ] Scripts d'analyse exécutés
- [ ] Imports optimisés (spécifiques, pas wildcard)
- [ ] Code mort retiré
- [ ] Lazy loading vérifié
- [ ] Minification/Gzip activés
- [ ] Lighthouse > 90 (Performance)
- [ ] Bundle < 100 KB (gzipped)

## En cas de doute

**Règles absolues :**
1. Toujours mesurer avant/après
2. Une optimisation à la fois
3. Priorité : lazy loading > tree shaking > minification
4. Mobile 3G/4G = référence
5. Tests passent après chaque changement

**Workflow minimal :**
```bash
npm run analyze:dependencies    # Identifier code mort
npm run dead-code              # Vérifier exports non utilisés
npm run analyze:assets         # Vérifier assets volumineux
```
