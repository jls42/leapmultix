# Bonnes Pratiques pour la Conception de Skills et Subagents

> **📚 Documentation officielle (consultez-la pour les spécifications détaillées) :**
>
> - [Skills Overview](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview.md) - Concepts clés et architecture
> - [Best Practices](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices.md) - Recommandations de conception
> - [Subagents Format](https://code.claude.com/docs/en/sub-agents.md) - Structure et configuration
> - [Skills Format](https://code.claude.com/docs/en/skills.md) - Format et organisation
> - [Slash Commands](https://code.claude.com/docs/en/slash-commands.md) - Commandes personnalisées
>
> _Ce document se concentre sur les **insights pratiques** et **patterns d'intégration** pour ce projet._

---

## 📚 Utilisation de la Documentation Officielle

Les liens ci-dessus sont fournis pour **consultation active** par les agents et skills via WebFetch/WebSearch, pas seulement comme référence passive.

### Quand consulter la documentation officielle (via WebFetch/WebSearch)

**✅ Utilisez activement pour :**
- Vérifier les spécifications exactes (limites de caractères : name max 64, description max 1024)
- Valider des règles de nommage spécifiques (gérondif, kebab-case, reserved words)
- Confirmer la syntaxe YAML frontmatter (champs requis, optionnels)
- Découvrir de nouvelles fonctionnalités ou best practices récentes
- Résoudre des ambiguïtés ou cas limites non couverts dans ce document

**❌ Ne PAS utiliser pour :**
- Remplacer la lecture de ce document (TOUJOURS lire BEST_PRACTICES en premier)
- Copier du contenu verbatim (résumer et adapter au contexte du projet)
- Recherches générales (utiliser ce document comme première source)

### Méthode de consultation

**Pour les agents avec WebFetch :**
```
WebFetch(url: "https://code.claude.com/docs/en/skills.md",
         prompt: "Quelle est la limite exacte de caractères pour le champ description?")
```

**Pour les skills avec WebSearch :**
```
WebSearch(query: "Claude Code skills frontmatter description character limit")
```

### Hiérarchie des sources

1. **BEST_PRACTICES_AGENTS_SKILLS.md** (ce fichier) - Consulter EN PREMIER
2. **Documentation officielle** (liens ci-dessus) - Consulter pour specs exactes et nouveautés
3. **Code existant** (.claude/skills/, .claude/agents/) - Consulter pour patterns concrets

## Philosophie Générale

1.  **Enseigner le QUOI, pas le COMMENT (Teach WHAT, not HOW)**
    *   **Principe :** L'IA connaît les commandes de base (`grep`, `ls`, etc.). Donnez-lui l'objectif ("Trouve les fichiers de traduction"), pas la commande exacte.
    *   **Bénéfice :** Rend le prompt plus lisible et moins fragile aux changements d'outils.

2.  **Le Code Vivant est la Source de Vérité**
    *   **Principe :** Ne copiez pas de longs extraits de code dans les prompts. Ils deviennent vite obsolètes. Instruisez l'agent d'aller lire les fichiers pertinents du projet.
    *   **Bénéfice :** L'agent s'adapte toujours à l'état actuel du code, garantissant des actions plus pertinentes.

3.  **La Concision est Fondamentale**
    *   **Principe :** "The context window is a public good" - Gardez `SKILL.md` sous 500 lignes. N'incluez que le contexte que Claude ne possède pas déjà.
    *   **Bénéfice :** Optimise la consommation de jetons et améliore la performance globale du système.

---

## Architecture des Skills : Divulgation Progressive

Comprendre comment les *Skills* gèrent le contexte est la clé de leur efficacité. Le système utilise une architecture de **divulgation progressive** en 3 niveaux pour optimiser la consommation de jetons.

| Niveau | Chargement | Contenu | Consommation de Jetons |
| :--- | :--- | :--- | :--- |
| **Niveau 1** | Toujours (au démarrage) | Métadonnées : `name` et `description` du YAML frontmatter. | Très faible (~100 jetons par Skill). |
| **Niveau 2** | Au déclenchement du Skill | Corps principal de `SKILL.md` (instructions, procédures). | Faible à moyenne (< 5000 jetons). |
| **Niveau 3** | Au besoin (*On-demand*) | Fichiers de ressources, templates, et scripts (`.py`, `.sh`). | Variable. Les jetons ne sont consommés **que si l'agent exécute une commande** (`cat`, `bash`) pour lire ou exécuter ces fichiers. |

Cette architecture permet à l'IA de naviguer et de ne charger que ce qui est strictement nécessaire, rendant le système très performant.

---

## Bonnes Pratiques pour les "Skills"

Les "Skills" sont des blocs de connaissances passifs et réutilisables, découverts automatiquement par Claude.

*   **Rôle :** Agir comme des **templates**, des **librairies de contenu**, ou des **bases de connaissances** statiques.
*   **Contenu :** Doit être focalisé sur une seule chose (ex: le format d'un type de rapport, une checklist standard).
*   **Exemples :**
    *   `processing-pdfs` - Traitement de documents PDF (forme gérondif recommandée)
    *   `analyzing-spreadsheets` - Analyse de feuilles de calcul
    *   `report-template-code-review` - Template de rapport de revue de code

### Configuration YAML

```yaml
---
name: your-skill-name         # Kebab-case, forme gérondif recommandée (-ing)
description: What it does and when to use it (3rd person)
allowed-tools: Read, Grep     # Optionnel : restreindre les outils disponibles
---
```

**Note importante :** Pour les Skills, utilisez `allowed-tools` (avec tiret). Pour les Subagents, utilisez `tools` (sans tiret).

### Contraintes Techniques pour les Skills avec Code

Si un Skill fait référence à des scripts exécutables (`.py`, `.sh`), les contraintes suivantes sont critiques :

*   **Chemins d'accès :** Utilisez **toujours des barres obliques (forward slashes)** (`/`) pour les chemins de fichiers (ex: `scripts/helper.py`), même sous Windows, pour garantir la portabilité.
*   **Environnement d'exécution :** Les scripts s'exécutent dans un conteneur avec des limites strictes : **pas d'accès réseau** et **pas d'installation de dépendances à la volée**. Toutes les dépendances doivent être pré-installées dans l'environnement.

---

## Bonnes Pratiques pour les "Subagents"

Les "Subagents" sont des acteurs autonomes et spécialisés.

### 1. Configuration (Frontmatter YAML)

*   **`name` :** (Obligatoire) Identifiant unique, en minuscules, avec des tirets (kebab-case).
*   **`description` :** (Obligatoire) Phrase claire décrivant le rôle et **quand** l'utiliser. Utilisez des mots comme "proactivement" pour encourager son utilisation.
*   **`tools` :** (Fortement recommandé) **Définissez toujours explicitement les outils.** Appliquez le principe du moindre privilège : n'accordez que les permissions strictement nécessaires à la mission de l'agent.
    *   **Exemple (Réviseur) :** `tools: Read, Grep, Glob, Bash, WebSearch` (pas de droits d'écriture).
    *   **Exemple (Débogueur) :** `tools: Read, Write, Replace, Bash, Grep, Glob` (droits étendus pour corriger).
*   **`model` :** (Recommandé) Utilisez `inherit` pour assurer une cohérence de capacité avec la conversation principale.

### 2. Prompt Système (Le "Cerveau" de l'Agent)

*   **Définir la Persona :** Commencez par une phrase claire : "Vous êtes un expert en..."
*   **Fournir le Contexte Clé :** Donnez les informations essentielles sur le projet (architecture, fichiers clés, objectifs).
*   **Focaliser sur les Principes et Workflows :** Décrivez les règles architecturales et les processus de haut niveau que l'agent doit suivre.
*   **Référencer le Code Vivant :** Instruisez l'agent d'examiner les fichiers existants pour comprendre les patterns (`"Examinez QuizMode.js pour voir un exemple..."`).
*   **Intégrer les Skills :** C'est le lien crucial. Ordonnez explicitement à l'agent de lire et d'utiliser un skill pour standardiser une partie de sa tâche.

    ```markdown
    ## Format de Sortie Requis (CRITIQUE)
    Pour générer votre rapport, tu DOIS :
    1.  Lire le fichier `.claude/skills/NOM-DU-SKILL.md`.
    2.  Utiliser son contenu comme template exact pour ta réponse.
    ```

---

## La Synergie Agent-Skill : Un Résumé

Le modèle optimisé fonctionne comme suit :

1.  **L'Agent (L'Expert) :** Sait **comment** accomplir une tâche complexe (analyser, déboguer, tester). Son prompt contient son expertise, ses principes et son workflow.
2.  **Le Skill (Le Template) :** Définit **quoi** produire de manière standardisée (un rapport, une checklist, une structure de fichier).

Ce flux de travail sépare le "processus de réflexion" de la "mise en forme du résultat", rendant le système global plus robuste et plus facile à maintenir.

### Note sur les Méthodes d'Invocation

Il est utile de distinguer comment les différents composants sont activés :

| Composant | Activation | Usage | Structure |
|-----------|------------|-------|-----------|
| **Skills** | Automatique (découverte contexte) | Capacités complexes multi-fichiers | Dossier avec `SKILL.md` |
| **Subagents** | Auto ou explicite | Tâches spécialisées déléguées | Fichier `.md` avec frontmatter |
| **Slash Commands** | Toujours explicite (`/command`) | Prompts rapides et fréquents | Fichier `.md` simple |

---

## Bonnes Pratiques pour les "Slash Commands"

Les "Slash Commands" sont des prompts réutilisables à invocation explicite, parfaits pour les instructions fréquemment utilisées.

*   **Rôle :** Prompts rapides nécessitant un contrôle explicite de l'utilisateur.
*   **Activation :** Toujours explicite : `/review`, `/optimize`, `/explain`
*   **Structure :** Fichier Markdown simple (avec frontmatter optionnel)

### Quand Utiliser Quoi ?

**Choisissez Slash Commands quand :**
- Vous invoquez répétitivement la même instruction
- Vous voulez un contrôle explicite sur l'exécution
- Prompt simple sans ressources multiples nécessaires

**Choisissez Skills quand :**
- Plusieurs fichiers, scripts ou matériel de référence nécessaires
- Découverte automatique basée sur le contexte souhaitée
- Structure organisée de connaissances réutilisables

**Choisissez Subagents quand :**
- Délégation de tâches spécialisées à un agent indépendant
- Expertise focalisée sur un domaine spécifique
- Nécessité de restreindre les permissions tools

### Structure d'une Slash Command

**Commande simple :**
```markdown
---
description: Review code for security and performance
---

Review the current codebase focusing on:
- Security vulnerabilities
- Performance bottlenecks
- Best practices violations
```

**Avec arguments :**
```markdown
---
description: Explain code in detail
---

Explain the following code: $ARGUMENTS
Focus on architecture, patterns, and key decisions.
```

**Localisation :**
- **Personal** : `~/.claude/commands/command-name.md`
- **Project** : `.claude/commands/command-name.md` (versionné avec git)

---

## Best Practices Additionnelles

### Feedback Loops et Validation

**Pattern de validation :** Pour les opérations critiques, utilisez un cycle de validation :

```markdown
1. Générer le plan/output
2. Valider avec un script ou checklist
3. Si erreurs : corriger et retourner à l'étape 1
4. Si valide : continuer
```

**Bénéfice :** Améliore dramatiquement la qualité des outputs pour les opérations sensibles.

### Gestion des Erreurs

**Principe :** "Solve, don't punt" - Gérez explicitement les conditions d'erreur plutôt que d'attendre que Claude récupère après échec.

**Exemple :**
```python
# ❌ Mauvais : laisse échouer
data = json.load(f)

# ✅ Bon : gestion explicite
try:
    data = json.load(f)
except json.JSONDecodeError:
    data = {"default": "values"}
    print("Using default configuration")
```

### Organisation de l'Information

**Tables des matières :** Pour les fichiers de référence > 100 lignes, incluez une table des matières pour que Claude voie l'information complète même lors de lectures partielles.

**Progressive disclosure :** Organisez par domaines. Pour des Skills avec plusieurs datasets, créez des fichiers de référence séparés : `reference/finance.md`, `reference/sales.md`.

**Références à un niveau :** Évitez les références imbriquées (SKILL.md → advanced.md → details.md). Gardez tout à un niveau de profondeur depuis SKILL.md.

### Testing et Itération

**Testez sur tous les modèles cibles :** Ce qui fonctionne pour Opus peut nécessiter des guidances supplémentaires pour Haiku.

**Pattern de raffinement :**
1. Claude A (Designer) : Aide à concevoir le Skill/Agent
2. Claude B (Tester) : Teste sur des tâches réelles
3. Observez le comportement de Claude B
4. Retournez les insights à Claude A
5. Raffinez et répétez

---

## Résumé des Conventions de Nommage

| Composant | Field | Naming | Exemple |
|-----------|-------|--------|---------|
| **Skill** | `name` | kebab-case, gérondif (-ing) | `processing-pdfs` |
| **Skill** | `description` | 3ème personne | "Processes PDF files..." |
| **Skill** | Tools | `allowed-tools` | `allowed-tools: Read, Grep` |
| **Subagent** | `name` | kebab-case | `code-reviewer` |
| **Subagent** | `description` | 3ème personne + quand utiliser | "Expert reviewer. Use proactively..." |
| **Subagent** | Tools | `tools` | `tools: Read, Grep, Glob` |
| **Slash Cmd** | Nom fichier | kebab-case | `review-code.md` |