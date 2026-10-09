---
paths:
  - 'assets/translations/*.json'
  - 'js/i18n*.js'
  - 'js/core/message-format.js'
  - 'scripts/*translation*'
  - 'scripts/*i18n*'
---

# Traductions (fr, en, es)

The project includes scripts to maintain translation files synchronization:

**`scripts/compare-translations.cjs`** - Compare translation files with fr.json reference

This script ensures all language files (en.json, es.json) are synchronized with fr.json:

**Features:**

- Flattens nested JSON structures to dot notation (e.g., `arcade.multiMemory.title`)
- Detects missing keys (present in fr.json but absent in other languages)
- Detects extra keys (present in other languages but not in fr.json)
- Identifies empty values (`""`, `null`, `undefined`, `[]`)
- Checks type consistency (string vs array mismatches)
- Generates detailed console report
- Saves JSON report to `docs/translations-comparison-report.json`

**Usage:**

```bash
npm run i18n:compare
```

**Output Example:**

```
🔍 Analyse comparative des fichiers de traduction

📚 Langue de référence: fr.json
✅ fr.json: 335 clés

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Analyse de en.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Total de clés: 335
✅ Aucune clé manquante
✅ Aucune clé supplémentaire
✅ Aucune valeur vide

📊 RÉSUMÉ FINAL
  fr.json: 335 clés
  en.json: 335 clés
  es.json: 335 clés

✅ Tous les fichiers de traduction sont parfaitement synchronisés !
```

**Other i18n scripts:**

- `npm run i18n:verify` - Verify translation keys consistency
- `npm run i18n:unused` - Generate unused translation keys report
- `scripts/cleanup-i18n-keys.cjs` - Remove unused keys from all translation files

**Accord au pluriel :** un message s'accorde avec la syntaxe ICU, lue par
`js/core/message-format.js` pour `translate()` comme pour les énoncés des modes :
`{n, plural, one {# boîte} other {# boîtes}}` (règles de la langue, `#` vaut le nombre).
Les paramètres d'un message doivent être les mêmes dans les trois langues
(`tests-esm/i18n-placeholders.esm.test.mjs`).
