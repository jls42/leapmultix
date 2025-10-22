---
name: 'I18n Translation Sync'
description: 'Vérifie la synchronisation des fichiers de traduction (fr.json, en.json, es.json) et détecte les clés manquantes, valeurs vides, et incohérences de types'
---

# I18n Translation Synchronization

Cette skill maintient la synchronisation des fichiers de traduction pour toutes les langues supportées.

## Langues supportées

- Français (fr.json) - Langue de référence
- Anglais (en.json)
- Espagnol (es.json)

## Quand utiliser cette skill

- Ajout de nouveaux textes UI ou messages
- Modification de traductions existantes
- Avant de committer des changements i18n
- Quand `npm run i18n:compare` signale des erreurs

## Processus de vérification

### 1. Exécuter le script de comparaison

```bash
npm run i18n:compare
```

Ce script :

- Aplatit le JSON imbriqué en notation point
- Détecte les clés manquantes
- Détecte les clés supplémentaires
- Identifie les valeurs vides
- Vérifie la cohérence des types (string vs array)

### 2. Problèmes courants

**Clés manquantes :**

- Clé présente dans fr.json mais absente dans en.json ou es.json
- Ajouter la clé manquante avec traduction appropriée

**Clés supplémentaires :**

- Clé présente dans en.json/es.json mais absente dans fr.json
- Soit ajouter à fr.json, soit supprimer des autres langues

**Valeurs vides :**

- Valeur de traduction est "", null, undefined, ou []
- Fournir une traduction réelle

**Incohérences de types :**

- Même clé a string dans un fichier, array dans un autre
- Standardiser le type dans tous les fichiers

### 3. Structure des fichiers de traduction

Fichiers en JSON imbriqué avec accès par notation point :

```json
{
  "arcade": {
    "multiMemory": {
      "title": "Multi Memory",
      "description": "Associer les paires de multiplications"
    }
  }
}
```

Accès via : `getTranslation('arcade.multiMemory.title')`

### 4. Bonnes pratiques

- Toujours utiliser fr.json comme référence
- Maintenir la même structure imbriquée dans tous les fichiers
- Utiliser des clés descriptives (pas génériques)
- Garder les traductions concises pour les éléments UI
- Tester les traductions dans l'UI réelle avant commit

### 5. Règles de sécurité

- Ne jamais committer si i18n:compare montre des erreurs
- Toujours exécuter la vérification avant de créer une PR
- Vérifier les clés manquantes ET supplémentaires
- Vérifier que les valeurs vides sont intentionnelles

### 6. Faux positifs de sécurité

**Problème :** ESLint/SonarCloud alerte sur XSS avec getTranslation()

**Solution :** getTranslation() retourne du contenu interne, pas d'entrée utilisateur. C'est sécurisé.

**Suppression recommandée :**

```javascript
// eslint-disable-next-line security/detect-object-injection, sonarjs/no-unsafe-string-usage -- False positive: getTranslation returns safe internal content
const text = getTranslation('key.path');
```

## Scripts associés

- `npm run i18n:verify` - Vérifier cohérence des clés
- `npm run i18n:unused` - Générer rapport des clés inutilisées
- `npm run i18n:compare` - Comparer tous les fichiers de traduction

## Workflow type

1. Modifier les traductions dans fr.json (référence)
2. Copier la structure dans en.json et es.json
3. Traduire les valeurs (ne pas copier le français)
4. Exécuter `npm run i18n:compare`
5. Corriger les problèmes détectés
6. Tester avec le sélecteur de langue dans l'UI
7. Committer uniquement si aucune erreur

## Expert Agents to Use

Quand tu travailles sur les traductions i18n, utilise cet agent spécialisé :

- **@i18n-coordinator** - Expert traductions multilingues pour :
  - Translation file synchronization (fr/en/es)
  - Missing key detection
  - Quality assurance (empty values, type consistency)
  - Unused key detection and cleanup
  - Translation best practices enforcement
  - Fallback and error handling
  - Translator collaboration workflows
  - Integration avec scripts npm (i18n:compare, i18n:verify, i18n:unused)

Autres agents utiles :

- **@code-reviewer** - Pour review code i18n et best practices
- **@test-writer** - Pour tests i18n (missing keys, fallbacks, edge cases)
- **@accessibility-auditor** - Pour vérifier traductions maintiennent accessibilité

## Voir aussi

- `scripts/compare-translations.cjs` - Script de comparaison utilisé
- `i18n/` - Répertoire des fichiers de traduction
- `js/i18n.js` - Système d'internationalisation
- `js/i18n-store.js` - Stockage des traductions
