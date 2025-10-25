# Bonnes Pratiques pour la Conception de Skills et Subagents

Ce document résume la stratégie d'optimisation et les meilleures pratiques pour créer des agents et des skills maintenables, sécurisés et efficaces.

## Philosophie Générale

1.  **Enseigner le QUOI, pas le COMMENT (Teach WHAT, not HOW)**
    *   **Principe :** L'IA connaît les commandes de base (`grep`, `ls`, etc.). Donnez-lui l'objectif ("Trouve les fichiers de traduction"), pas la commande exacte.
    *   **Bénéfice :** Rend le prompt plus lisible et moins fragile aux changements d'outils.

2.  **Le Code Vivant est la Source de Vérité**
    *   **Principe :** Ne copiez pas de longs extraits de code dans les prompts. Ils deviennent vite obsolètes. Instruisez l'agent d'aller lire les fichiers pertinents du projet.
    *   **Bénéfice :** L'agent s'adapte toujours à l'état actuel du code, garantissant des actions plus pertinentes.

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

Les "Skills" sont des blocs de connaissances passifs et réutilisables.

*   **Rôle :** Agir comme des **templates**, des **librairies de contenu**, ou des **bases de connaissances** statiques.
*   **Contenu :** Doit être focalisé sur une seule chose (ex: le format d'un type de rapport, une checklist standard).
*   **Exemples :**
    *   `report-template-code-review.md`
    *   `checklist-pre-release.md`

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

*   **Skills :** Déclenchés **automatiquement par le modèle** en fonction du contexte et de la pertinence de leur `description`.
*   **Subagents :** Déclenchés **automatiquement par le modèle** (similaire aux skills) ou **explicitement par l'utilisateur** (`> Use the code-reviewer...`).
*   **Commandes Slash (`/`) :** Déclenchées **toujours explicitement par l'utilisateur**.