---
name: synchronizing-i18n-translations
description: Verifies translation files synchronization (fr.json, en.json, es.json) and detects missing keys, empty values, and type inconsistencies
allowed-tools: Read, Grep, Glob, Bash
---

# I18n Translation Synchronization

Maintient la synchronisation des fichiers de traduction pour toutes les langues supportées.

## Quand utiliser

- Ajout de nouveaux textes UI
- Modification de traductions existantes
- Avant de committer changements i18n
- Quand `npm run i18n:compare` signale erreurs

## Langues supportées

- **fr.json** (référence) - Toujours modifier en premier
- **en.json** (anglais)
- **es.json** (espagnol)

## Scripts disponibles

```bash
npm run i18n:compare  # Compare tous les fichiers (PRINCIPAL)
npm run i18n:verify   # Vérifie cohérence
npm run i18n:unused   # Détecte clés inutilisées
```

## Workflow principal

### 1. Vérifier l'état actuel

```bash
npm run i18n:compare
```

Si erreurs, lire le rapport détaillé.

### 2. Modifier les traductions

**Règle d'or :** Toujours commencer par `fr.json`

1. Modifie `fr.json` d'abord
2. Copie la STRUCTURE (pas les valeurs) dans en.json et es.json
3. Traduis les valeurs

### 3. Vérifier synchronisation

```bash
npm run i18n:compare
```

Doit afficher : "Tous les fichiers de traduction sont parfaitement synchronisés !"

### 4. Tester dans l'UI

Lance l'application et teste le sélecteur de langue.

## Détection automatique

Le script `npm run i18n:compare` détecte :

**Clés manquantes :**

- Clés présentes dans fr.json mais absentes dans en.json/es.json

**Clés supplémentaires :**

- Clés présentes dans en.json/es.json mais absentes dans fr.json

**Valeurs vides :**

- `""`, `null`, `undefined`, `[]`

**Incohérences de types :**

- String vs Array (ex: fr.json = "text", en.json = ["array"])

**Format du rapport :**

- Console détaillée
- JSON exporté dans `docs/translations-comparison-report.json`

## Corriger les erreurs

### Clés manquantes

Ajoute les clés manquantes dans en.json/es.json avec traductions appropriées.

### Clés supplémentaires

Supprime les clés supplémentaires OU ajoute-les dans fr.json si nécessaires.

### Valeurs vides

Remplace les valeurs vides par traductions appropriées.

### Types incohérents

Uniformise le type (soit String partout, soit Array partout).

## Structure des fichiers

**Format JSON :**

```json
{
  "key": "value",
  "nested": {
    "key": "value"
  },
  "array": ["item1", "item2"]
}
```

**Dot notation :**

- `key` → "key"
- `nested.key` → "nested.key"
- `array` → "array"

Le script aplatit la structure en dot notation pour comparaison.

## Checklist i18n

- [ ] fr.json modifié en premier
- [ ] Structure copiée dans en.json et es.json
- [ ] Valeurs traduites correctement
- [ ] `npm run i18n:compare` passe (100% synchronisé)
- [ ] Testé dans UI avec sélecteur de langue
- [ ] Pas de valeurs vides
- [ ] Types cohérents (String ou Array)

## En cas de doute

**Source :** fr.json + npm scripts

**Règles absolues :**

1. Toujours vérifier avec `npm run i18n:compare`
2. fr.json est la référence (pas en.json, pas es.json)
3. Ne jamais committer avec erreurs i18n
4. Tester dans UI avant commit
5. Scripts npm détectent TOUS les problèmes

**Workflow minimal :**

```bash
# Modifier fr.json
npm run i18n:compare  # Vérifier
# Copier structure dans en.json, es.json
# Traduire valeurs
npm run i18n:compare  # DOIT être OK
```
