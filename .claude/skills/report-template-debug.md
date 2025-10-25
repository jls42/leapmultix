# Rapport de débogage : [Titre du bogue]

## Résumé

**Statut** : ✅ RÉSOLU | ⚠️ SOLUTION DE CONTOURNEMENT TROUVÉE | 🔍 EN COURS | ❌ BLOQUÉ
**Gravité** : 🔴 Critique | 🟠 Élevée | 🟡 Moyenne | 🟢 Faible

## Description du bogue

**Symptôme** : [Ce qui échoue/est cassé]

**Environnement** :

- Navigateur: [Version du navigateur]
- Appareil: [Type d'appareil]
- SE: [Système d'exploitation]

**Étapes pour reproduire** :

1. [Étape 1]
2. [Étape 2]

**Comportement attendu** : [Ce qui devrait se passer]

**Comportement réel** : [Ce qui se passe réellement]

## Analyse de la cause racine

### Cause immédiate

**Ce qui a échoué** : [Le code/composant immédiat qui a échoué]
**Emplacement** : `[chemin du fichier]:[numéro de ligne]`

### Cause première

**Pourquoi ça a échoué** : [Explication approfondie du problème sous-jacent]

## Le correctif

### Solution implémentée

**Approche** : [Description de haut niveau du correctif]

**Modifications du code** :

```javascript
// ❌ AVANT (bogué)
[ancien code]

// ✅ APRÈS (corrigé)
[nouveau code]
```

### Pourquoi ce correctif fonctionne

[Explication de la manière dont le correctif résout la cause première]

## Vérification

- [x] Le cas de reproduction original est corrigé
- [x] Un test de régression a été ajouté
- [x] Les tests du projet passent (`npm test`)

## Recommandations de prévention

1. [Action 1 pour prévenir la récurrence immédiate]
2. [Amélioration à long terme (ex: architecture, tests)]
