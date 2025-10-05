# 📊 Rapport d'Analyse des Clés de Traduction Françaises

**Date**: 2025-10-05
**Analyseur**: Claude Code (Sonnet 4.5)
**Fichier analysé**: `assets/translations/fr.json`
**Méthodologie**: Analyse statique conservatrice avec détection de patterns dynamiques

---

## 🎯 Résumé Exécutif

### Statistiques Globales

| Métrique                               | Valeur      |
| -------------------------------------- | ----------- |
| **Total de clés**                      | 384         |
| **Clés confirmées utilisées**          | 379 (98.7%) |
| **Clés potentiellement non utilisées** | 5 (1.3%)    |
| **Niveau de confiance**                | ÉLEVÉ       |

### Conclusion Principale

**Le fichier de traduction est exceptionnellement bien entretenu.**
Seulement 1.3% des clés semblent potentiellement inutilisées, et même pour celles-ci, une vérification manuelle est recommandée avant suppression.

---

## ✅ Catégories de Clés UTILISÉES (à conserver)

### 1. Clés avec Patterns Dynamiques

Ces clés sont générées dynamiquement via des template strings ou des valeurs calculées :

#### 🎮 Modes de jeu

```javascript
// Pattern: ${mode}_mode
getTranslation(this.modeName + '_mode') - // GameMode.js:85
  // Clés générées:
  discovery_mode -
  quiz_mode -
  challenge_mode -
  adventure_mode -
  arcade_mode;
```

#### 📊 Labels de barre d'info

```javascript
// Pattern: ${mode}_info_bar_label
getTranslation(this.modeName + '_info_bar_label') - // GameMode.js:193
  // Clés générées:
  discovery_info_bar_label -
  quiz_info_bar_label -
  challenge_info_bar_label -
  adventure_info_bar_label -
  arcade_info_bar_label;
```

#### 🏔️ Niveaux d'aventure

```javascript
// Pattern: level_${1-10}_name et level_${1-10}_desc
// Utilisés via nameKey et descKey dans adventure-data.js

// Clés générées:
- level_1_name à level_10_name
- level_1_desc à level_10_desc
```

**Fichier source**: `js/core/adventure-data.js:5-78`

#### 🦊 Personnages et avatars

```javascript
// Pattern: character_intro_${avatar}
(getTranslation(`character_intro_${avatar}`) - // VideoManager.js:241
  // Clés générées:
  character_intro_fox -
  character_intro_panda -
  character_intro_unicorn -
  character_intro_dragon -
  character_intro_astronaut -
  // Noms d'avatars (aussi utilisés comme clés)
  fox,
  panda,
  unicorn,
  dragon,
  astronaut);
```

#### 💡 Mnémoniques des tables

```javascript
// Pattern: mnemonic_${1-10}
getTranslation(`mnemonic_${table}`) // DiscoveryMode.js:115, QuizMode.js:387,440

// Clés générées:
- mnemonic_1 à mnemonic_10
```

#### 🏆 Badges et succès

```javascript
// Pattern: badge_${id}_name et badge_${id}_desc
getTranslation(`badge_${badge.id}_name`); // badges.js:30,48
getTranslation(`badge_${badge.id}_desc`) - // badges.js:31
  // Clés générées:
  badge_quiz_starter_name / _desc -
  badge_challenge_accepted_name / _desc -
  badge_adventurer_name / _desc -
  badge_perfect_quiz_name / _desc -
  badge_high_scorer_name / _desc -
  badge_star_collector_name / _desc -
  badge_daily_challenger_name / _desc;
```

#### 🎨 Thèmes de couleur

```javascript
// Pattern: color_theme_${name}
getTranslation(`color_theme_${themeName}`) - // customization.js:331
  // Clés générées:
  color_theme_default -
  color_theme_blue -
  color_theme_dark -
  color_theme_green -
  color_theme_orange;
```

#### 📈 Labels d'information

```javascript
// Pattern: info_${type}_label
// Utilisés dans infoBar.js via data-translate

// Clés générées:
-info_score_label -
  info_lives_label -
  info_progress_label -
  info_streak_label -
  info_time_label -
  info_bonus_label;
```

#### 💬 Messages de feedback

```javascript
// Patterns multiples selon le mode de jeu

// Quiz/General:
-feedback_correct -
  feedback_incorrect -
  feedback_correct_streak -
  // Challenge:
  challenge_feedback_correct -
  challenge_feedback_correct_bonus -
  challenge_feedback_incorrect -
  // Adventure:
  adventure_feedback_correct -
  adventure_feedback_incorrect;
```

---

### 2. Clés avec Structure JSON Imbriquée

Ces clés utilisent la notation pointée (dot notation) pour accéder à des structures imbriquées :

#### 🕹️ Contrôles Arcade

**Fichier source**: `js/modes/ArcadeMode.js:587-600`

```javascript
getTranslation('arcade.controls.invasion.keyboard');
getTranslation('arcade.controls.multimiam.touch');
```

**Clés concernées** (11 clés):

- `arcade.controls.title`
- `arcade.controls.invasion.keyboard`
- `arcade.controls.invasion.mouse`
- `arcade.controls.invasion.touch`
- `arcade.controls.multimiam.keyboard`
- `arcade.controls.multimiam.touch`
- `arcade.controls.multimemory.mouse`
- `arcade.controls.multimemory.touch`
- `arcade.controls.multisnake.keyboard`
- `arcade.controls.multisnake.touch`

#### 🧠 MultiMemory

**Fichier source**: `js/arcade-multimemory.js`

**Clés concernées** (10 clés):

- `arcade.multiMemory.title`
- `arcade.multiMemory.description`
- `arcade.multiMemory.controls.desktop`
- `arcade.multiMemory.controls.mobile`
- `arcade.multiMemory.match`
- `arcade.multiMemory.mismatch`
- `arcade.multiMemory.win`
- `arcade.multiMemory.fail`
- `arcade.multiMemory.welcome`
- `arcade.multiMemory.intro`

#### 👾 MultiMiam

**Fichier source**: `js/modes/ArcadeMode.js`, `js/arcade-multimiam.js`

**Clés concernées** (5 clés):

- `arcade.multiMiam.title`
- `arcade.multiMiam.description`
- `arcade.multiMiam.welcome`
- `arcade.multiMiam.controls.mobile`
- `arcade.multiMiam.controls.desktop`

#### 🐍 MultiSnake

**Fichier source**: `js/multisnake.js`

**Clés concernées** (2 clés):

- `arcade.multiSnake.controls.mobile`
- `arcade.multiSnake.controls.desktop`

---

### 3. Clés Tableaux (Arrays)

Ces clés contiennent des tableaux utilisés pour la sélection aléatoire :

#### 🎉 Messages positifs

```json
"correct": [
  "Bravo, c'est correct !",
  "Super !",
  "Excellent !",
  "Bien joué !",
  "Impressionnant !"
]
```

**Usage**: Sélection aléatoire pour la synthèse vocale dans plusieurs modes

#### 📝 Templates de problèmes

```json
"problem_templates": [
  "Si j'ai {num} boîtes de {table} pommes, combien de pommes ai-je ?",
  "Il y a {table} groupes de {num} enfants. Combien d'enfants au total ?",
  "Une fusée fait {table} sauts de {num} cases. Quelle distance totale ?"
]
```

**Usage**: `questionGenerator.js:71` pour générer des énoncés variés

---

### 4. Clés HTML (data-translate)

Toutes les clés référencées dans `index.html` via les attributs suivants sont utilisées :

- `data-translate="key"` → textContent
- `data-translate-placeholder="key"` → placeholder
- `data-translate-title="key"` → title
- `data-translate-aria-label="key"` → aria-label

**Exemples**:

- `user_selection_title`
- `new_user_placeholder`
- `parental_answer_placeholder`
- `replay_avatar_video`
- Tous les labels de boutons et sections

---

### 5. Clés Protégées (i18n-keep.json)

Le fichier `assets/translations/i18n-keep.json` définit explicitement les clés à protéger :

#### Clés explicites

```json
["fox", "panda", "unicorn", "dragon", "astronaut", "voice_toggle_on", "voice_toggle_off"]
```

#### Préfixes protégés

```json
[
  "character_intro_",
  "mnemonic_",
  "badge_",
  "arcade.controls.",
  "arcade.multiMemory.",
  "arcade.multiMiam."
]
```

#### Regex protégées

```json
[
  "^level_\\d+_(name|desc)$",
  "^(discovery|quiz|challenge|adventure|arcade)_info_bar_label$",
  "^(discovery|quiz|challenge|adventure|arcade)_mode$",
  "^color_theme_.*$"
]
```

---

## ⚠️ Clés Potentiellement Non Utilisées

### Liste des 5 clés suspectes

| Clé             | Valeur                   | Confiance | Recommandation |
| --------------- | ------------------------ | --------- | -------------- |
| `level_1_label` | "Niveau 1 (×1, ×2, ×5)"  | Moyenne   | Vérifier Git   |
| `level_2_label` | "Niveau 2 (×3, ×4)"      | Moyenne   | Vérifier Git   |
| `level_3_label` | "Niveau 3 (×6, ×7)"      | Moyenne   | Vérifier Git   |
| `level_4_label` | "Niveau 4 (×8, ×9, ×10)" | Moyenne   | Vérifier Git   |
| `level_5_label` | "Niveau 5 (Tous)"        | Moyenne   | Vérifier Git   |

### Analyse Détaillée

**Hypothèse**: Ces clés semblent être d'anciennes clés de sélection de difficulté, probablement remplacées par le nouveau système de niveaux d'aventure (`level_X_name` / `level_X_desc`).

**Statut**:

- ✅ Absentes du code actuel (recherche exhaustive effectuée)
- ✅ Listées dans `unused_keys.txt` généré par `find-unused-i18n.mjs`
- ⚠️ Pourraient avoir été utilisées dans une version antérieure

**Recommandations**:

1. Vérifier l'historique Git pour confirmer qu'elles ne sont plus utilisées
2. Chercher dans d'autres branches si elles existent
3. Créer un backup avant toute suppression
4. Tester l'application après suppression pour vérifier l'absence de traductions manquantes

---

## 🔍 Points d'Attention Spécifiques

### Clés difficiles à détecter (mais CONFIRMÉES utilisées)

#### voice_toggle_on / voice_toggle_off

```javascript
// topBar.js - Utilisés pour les tooltips dynamiques
const tooltip = isOn ? getTranslation('voice_toggle_off') : getTranslation('voice_toggle_on');
```

#### mute_button_label_on / mute_button_label_off

```javascript
// audio.js, theme.js - Utilisés pour les labels de bouton de son
const label = isMuted ? 'mute_button_label_off' : 'mute_button_label_on';
```

#### arcade_try_again, arcade_life_lost, arcade_load_error

```javascript
// arcade.js, multisnake.js, arcade-invasion.js, multimiam-engine.js
showArcadeMessage('arcade_life_lost');
showArcadeMessage('arcade_try_again');
// ArcadeMode.js - 8 occurrences de arcade_load_error
```

#### congrats1-5

```javascript
// arcade-invasion.js - Utilisés pour varier les messages de félicitation
const messages = ['congrats1', 'congrats2', 'congrats3', 'congrats4', 'congrats5'];
```

---

## 📝 Méthodologie d'Analyse

### Techniques Utilisées

1. **Recherche directe**
   - `getTranslation('key')`
   - Recherche dans tous les fichiers JS/MJS/CJS

2. **Attributs HTML**
   - `data-translate="key"`
   - `data-translate-placeholder="key"`
   - `data-translate-title="key"`
   - `data-translate-aria-label="key"`

3. **Patterns dynamiques**
   - Template strings: ``getTranslation(`prefix_${var}`)``
   - Concaténation: `getTranslation(mode + '_mode')`

4. **Structures imbriquées**
   - Notation pointée: `getTranslation('parent.child.grandchild')`

5. **Références indirectes**
   - Via `nameKey`, `descKey` dans les configurations
   - Via maps et objets de configuration

6. **Exclusions explicites**
   - Fichier `i18n-keep.json`
   - Patterns regex de protection

### Outils Existants Analysés

- ✅ `tools/find-unused-i18n.mjs` - Détecteur avancé avec patterns
- ✅ `scripts/i18n-verify.cjs` - Vérificateur de cohérence
- ✅ `scripts/i18n-generate-unused.cjs` - Générateur de rapport
- ✅ `assets/translations/i18n-keep.json` - Configuration des exclusions

---

## 🎯 Recommandations Finales

### ✅ Actions Recommandées

1. **NE PAS supprimer automatiquement** les 5 clés suspectes
2. **Comparer ce rapport** avec les analyses des autres IAs
3. **Vérifier l'historique Git** pour `level_X_label`
4. **Créer un backup** de `fr.json` avant toute modification
5. **Tester l'application** après suppression éventuelle

### ⚠️ Précautions

- Une IA précédente a supprimé des clés légitimes par erreur
- Les patterns dynamiques rendent l'analyse statique difficile
- La prudence est de mise : **préférer un faux négatif à un faux positif**

### 📊 Qualité du Fichier

Le fichier `fr.json` est **exceptionnellement bien maintenu** :

- 98.7% des clés sont utilisées
- Les patterns dynamiques sont bien documentés dans `i18n-keep.json`
- Les structures imbriquées sont cohérentes
- Les tableaux pour variation sont bien utilisés

---

## 📄 Fichiers Générés

- ✅ `docs/i18n-analysis-report.json` - Rapport détaillé au format JSON
- ✅ `docs/i18n-analysis-report.md` - Ce document (format Markdown)

---

## 🔗 Prochaines Étapes

1. Attendre les rapports des autres IAs
2. Comparer les résultats
3. Décider collectivement des clés à supprimer
4. Créer une branche Git `cleanup/i18n-unused-keys`
5. Supprimer uniquement les clés confirmées inutiles
6. Mettre à jour `en.json` et `es.json` en conséquence
7. Tester tous les modes de jeu
8. Commit avec message détaillé

---

**Date du rapport**: 2025-10-05
**Version de l'application**: Basée sur le commit actuel
**Analyseur**: Claude Code (Sonnet 4.5)
