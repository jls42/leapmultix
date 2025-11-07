---
name: config-compliance-checker
description: Validates configuration compliance for Skills, Subagents and Slash Commands against best practices. Use proactively when creating or auditing configuration files.
allowed-tools: Read, Grep, Glob, WebSearch
---

# Config Compliance Checker

Valide la conformité des Skills, Subagents et Slash Commands selon les bonnes pratiques définies dans `BEST_PRACTICES_AGENTS_SKILLS.md`.

## Quand utiliser

- Création d'un nouveau Skill/Subagent/Slash Command
- Audit des configurations existantes
- Avant commit de modifications de config
- Review de PR touchant `.claude/`

## Sources de vérité

**Document de référence principal :** `.claude/BEST_PRACTICES_AGENTS_SKILLS.md`

Ce skill fournit des checklists concrètes pour valider la conformité.

### Consultation de la Documentation Officielle

En cas de doute sur une règle de conformité ou une spécification exacte, consultez la documentation officielle listée dans `BEST_PRACTICES_AGENTS_SKILLS.md` via WebSearch.

**Cas d'usage pour WebSearch :**

- ✅ Vérifier les limites exactes (max 64 chars pour name, max 1024 pour description)
- ✅ Valider une règle de nommage spécifique (gérondif, kebab-case)
- ✅ Confirmer la syntaxe YAML frontmatter
- ✅ Découvrir de nouvelles best practices non encore documentées dans BEST_PRACTICES

**Ne PAS utiliser pour :**

- ❌ Remplacer la lecture de BEST_PRACTICES (toujours lire en premier)
- ❌ Copier du contenu verbatim (résumer et adapter au contexte du projet)

---

## Checklist : Skills

### 1. Frontmatter YAML

**✅ Requis :**

```yaml
---
name: skill-name
description: What it does and when to use it
---
```

**Validations :**

- [ ] `name` : kebab-case, sans guillemets, forme gérondif recommandée (-ing)
- [ ] `description` : 3ème personne, < 1024 chars, sans guillemets
- [ ] `allowed-tools` (optionnel) : liste séparée par virgules

**❌ Erreurs communes :**

```yaml
# MAUVAIS
name: "Validateur d'Accessibilité"  # Guillemets inutiles, pas kebab-case
name: helper                          # Nom vague
description: I process files         # 1ère personne

# BON
name: processing-pdfs
description: Processes PDF files and extracts structured data. Use for document automation.
```

### 2. Structure de fichier

**Recommandé :**

```
skill-name/
├── SKILL.md              # < 500 lignes
├── reference/            # Fichiers de référence
│   └── patterns.md
└── scripts/              # Scripts utilitaires
    └── validator.py
```

**Validations :**

- [ ] SKILL.md < 500 lignes
- [ ] Références à un niveau de profondeur max
- [ ] Scripts utilisent forward slashes (`/`)

### 3. Contenu

**Validations :**

- [ ] Focalisé sur une seule tâche
- [ ] Pas de copie de code (référence au code vivant)
- [ ] Tables des matières si > 100 lignes
- [ ] Exemples concrets (input/output)

---

## Checklist : Subagents

### 1. Frontmatter YAML

**✅ Requis :**

```yaml
---
name: agent-name
description: Expert role and when to use it
tools: Read, Write, Bash
model: inherit
---
```

**Validations :**

- [ ] `name` : kebab-case, sans guillemets
- [ ] `description` : 3ème personne, inclut "quand utiliser", mots comme "proactivement"
- [ ] `tools` : explicitement définis (principe du moindre privilège)
- [ ] `model` : `inherit` recommandé ou alias (sonnet, opus, haiku)

**❌ Erreurs communes :**

```yaml
# MAUVAIS
name: "Code Reviewer"     # Guillemets inutiles, espace
tools: *                  # Trop permissif
description: Reviews code # Manque "quand"

# BON
name: code-reviewer
tools: Read, Grep, Glob, Bash, WebSearch
description: Expert code reviewer specializing in security and performance. Use proactively after code modifications.
model: inherit
```

### 2. Prompt système

**Validations :**

- [ ] Persona clairement définie ("Vous êtes un expert en...")
- [ ] Contexte clé du projet fourni
- [ ] Principes et workflows décrits
- [ ] Référence au code vivant
- [ ] Intégration de skills explicite si applicable

**Exemple d'intégration skill :**

```markdown
## Format de Sortie Requis (CRITIQUE)

Pour générer votre rapport, vous DEVEZ :

1. Lire le fichier `.claude/skills/report-template/SKILL.md`
2. Utiliser son contenu comme template exact
```

---

## Checklist : Slash Commands

### 1. Structure de fichier

**Localisation :**

- Personal : `~/.claude/commands/`
- Project : `.claude/commands/` (versionné)

**Format :**

```markdown
---
description: Brief description of what it does
---

Prompt content here with optional $ARGUMENTS
```

**Validations :**

- [ ] Nom fichier : kebab-case.md
- [ ] `description` claire et concise
- [ ] Arguments gérés avec `$ARGUMENTS` ou `$1`, `$2`
- [ ] Documentation du comportement

**Exemple :**

```markdown
---
description: Review code for security issues
---

Review the following code: $ARGUMENTS

Focus on:

- Security vulnerabilities
- Best practices violations
```

---

## Patterns de validation

### Validation du nom (kebab-case)

**Regex :** `^[a-z0-9]+(-[a-z0-9]+)*$`

**✅ Valides :**

- `processing-pdfs`
- `code-reviewer`
- `tdd-jest`

**❌ Invalides :**

- `ProcessingPDFs` (PascalCase)
- `processing_pdfs` (snake_case)
- `"processing-pdfs"` (guillemets)
- `processing pdfs` (espace)

### Validation de la description (3ème personne)

**Patterns ✅ :**

- "Processes PDF files..."
- "Validates configuration..."
- "Expert reviewer specializing in..."

**Patterns ❌ :**

- "I process files..." (1ère personne)
- "Process files..." (impératif)
- "" (vide)

### Validation allowed-tools vs tools

**Skills :**

```yaml
allowed-tools: Read, Grep # Avec tiret
```

**Subagents :**

```yaml
tools: Read, Write, Bash # Sans tiret
```

---

## Rapport d'audit

### Format recommandé

```markdown
# Audit de Conformité : [nom-du-composant]

**Type :** Skill | Subagent | Slash Command
**Fichier :** `.claude/.../nom.md`
**Date :** YYYY-MM-DD

## Score global : [X]/10

## Conformité Frontmatter

- [ ] ✅/❌ Nom conforme (kebab-case, gérondif pour skills)
- [ ] ✅/❌ Description conforme (3ème personne, < 1024 chars)
- [ ] ✅/❌ Tools/allowed-tools correctement défini
- [ ] ✅/❌ Model spécifié (subagents)

## Conformité Contenu

- [ ] ✅/❌ Structure de fichier appropriée
- [ ] ✅/❌ Taille < 500 lignes (skills)
- [ ] ✅/❌ Références au code vivant
- [ ] ✅/❌ Exemples concrets présents

## Problèmes détectés

### 🔴 Critiques

- Description non conforme

### 🟡 Avertissements

- Taille légèrement élevée (520 lignes)

### 🔵 Suggestions

- Ajouter exemples concrets

## Actions recommandées

1. Corriger le nom : `"Code Reviewer"` → `code-reviewer`
2. Réécrire description en 3ème personne
3. Définir explicitement les tools

## Diff proposé

\`\`\`diff

- name: "Code Reviewer"

* name: code-reviewer

- description: Reviews code

* description: Expert code reviewer specializing in security. Use proactively after modifications.
  \`\`\`
```

---

## Workflow d'audit complet

### 1. Identifier les composants

```bash
# Skills
find .claude/skills -name "SKILL.md"

# Subagents
find .claude/agents -name "*.md"

# Slash Commands
find .claude/commands -name "*.md"
```

### 2. Auditer chaque composant

Pour chaque fichier :

1. Lire le frontmatter YAML
2. Valider chaque champ avec la checklist
3. Analyser le contenu
4. Générer le rapport

### 3. Prioriser les corrections

**🔴 Critiques (bloquer) :**

- Nom non conforme (empêche découverte)
- Description invalide
- Syntaxe YAML incorrecte

**🟡 Avertissements (corriger bientôt) :**

- Taille > 500 lignes
- Manque exemples
- Tools trop permissifs

**🔵 Suggestions (amélioration) :**

- Ajouter tables des matières
- Améliorer organisation
- Ajouter tests

### 4. Générer rapport consolidé

```markdown
# Rapport d'Audit Global

**Date :** YYYY-MM-DD
**Composants audités :** X skills, Y agents, Z commands

## Scores moyens

- Skills : 7.5/10
- Subagents : 8.2/10
- Slash Commands : 9.0/10

## Résumé des problèmes

- 🔴 Critiques : 3
- 🟡 Avertissements : 8
- 🔵 Suggestions : 12

## Top 5 corrections prioritaires

1. [skill-name] : Corriger nom et description
2. [agent-name] : Définir tools explicitement
   ...
```

---

## En cas de doute

**Règles absolues :**

1. Toujours consulter `.claude/BEST_PRACTICES_AGENTS_SKILLS.md`
2. Toujours valider kebab-case pour les noms
3. Toujours vérifier 3ème personne pour descriptions
4. Toujours appliquer principe du moindre privilège (tools)

**Documentation officielle :**

Consultez les liens dans `BEST_PRACTICES_AGENTS_SKILLS.md` pour les spécifications exhaustives.
