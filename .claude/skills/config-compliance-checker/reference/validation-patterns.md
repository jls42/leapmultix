# Patterns de Validation Détaillés

Ce document contient des patterns de validation spécifiques et des exemples pour auditer Skills, Subagents et Slash Commands.

## Table des matières

- [Validation des Noms](#validation-des-noms)
- [Validation des Descriptions](#validation-des-descriptions)
- [Validation YAML](#validation-yaml)
- [Exemples Complets](#exemples-complets)

---

## Validation des Noms

### Skills : Forme Gérondif Recommandée

**Pattern :** `[verb]-ing-[context]` ou `[action]-ing-[subject]`

**✅ Excellents exemples :**

- `processing-pdfs` - Verbe + objet
- `analyzing-spreadsheets` - Verbe + objet
- `validating-accessibility` - Verbe + concept
- `managing-dependencies` - Verbe + objet

**✅ Acceptables (pas gérondif mais clairs) :**

- `report-template-code-review` - Template clairement identifié
- `quality-gate` - Concept établi
- `tdd-jest` - Acronyme + outil

**❌ À corriger :**

- `helper` - Trop vague
- `utils` - Trop générique
- `tool` - Non descriptif
- `accessibility-validator` - Préférer `validating-accessibility`

### Subagents : Rôle Clair

**Pattern :** `[role]-[specialization]` ou `[domain]-[specialist]`

**✅ Excellents exemples :**

- `code-reviewer` - Rôle clair
- `performance-analyzer` - Rôle + domaine
- `pwa-expert` - Domaine + expertise
- `accessibility-auditor` - Domaine + rôle

**❌ À corriger :**

- `helper-agent` - Trop vague
- `ai-assistant` - Trop générique
- `tool` - Non descriptif

### Regex de Validation

```regex
# Kebab-case strict
^[a-z0-9]+(-[a-z0-9]+)*$

# Kebab-case sans nombres (recommandé)
^[a-z]+(-[a-z]+)*$

# Validation guillemets (doit échouer)
^["'].*["']$
```

---

## Validation des Descriptions

### Skills : 3ème Personne + Quand

**Structure recommandée :**

```
[Verb]s [object] and [action]. Use for/when [context].
```

**✅ Excellents exemples :**

```
Processes PDF files and extracts structured data. Use for document automation.

Analyzes bundle size and identifies optimization opportunities. Use before releases or when bundle exceeds 200KB.

Validates accessibility compliance against WCAG 2.1 AA. Use when modifying UI or before major releases.
```

**❌ À corriger :**

```
# 1ère personne
I process PDF files  → Processes PDF files

# Impératif
Process PDF files    → Processes PDF files

# Manque contexte d'usage
Processes PDFs       → Processes PDFs. Use for document automation.

# Trop vague
Helps with files    → Processes PDF files and extracts data. Use for automation.
```

### Subagents : 3ème Personne + Quand + Proactivement

**Structure recommandée :**

```
Expert [role] specializing in [domain]. Use [proactively] [when/after/before] [context].
```

**✅ Excellents exemples :**

```
Expert code reviewer specializing in security and performance. Use proactively after code modifications.

PWA specialist for service workers and offline functionality. Use for PWA modifications or before production audits.

Performance analyst for web applications and canvas games. Use proactively for performance issues or before releases.
```

**❌ À corriger :**

```
# Manque "proactivement"
Reviews code for security  → Expert reviewer. Use proactively after modifications.

# Manque contexte "quand"
Expert in accessibility    → Expert auditor. Use proactively after UI changes.

# 1ère personne
I review code             → Expert reviewer specializing in security.
```

### Validation de Longueur

```
Max 1024 caractères

Recommandé : 100-300 caractères pour clarté
```

---

## Validation YAML

### Frontmatter Skills

**✅ Format correct :**

```yaml
---
name: processing-pdfs
description: Processes PDF files and extracts structured data. Use for document automation.
allowed-tools: Read, Grep, Bash
---
```

**❌ Erreurs courantes :**

```yaml
---
# Guillemets inutiles
name: "processing-pdfs"
name: 'processing-pdfs'

# Espace au lieu de tiret
name: processing pdfs

# PascalCase
name: ProcessingPDFs

# Field incorrect pour Skills
tools: Read, Write     # Devrait être allowed-tools

# Description vide
description:
description: ""
---
```

### Frontmatter Subagents

**✅ Format correct :**

```yaml
---
name: code-reviewer
description: Expert code reviewer specializing in security. Use proactively after modifications.
tools: Read, Grep, Glob, Bash, WebSearch
model: inherit
---
```

**❌ Erreurs courantes :**

```yaml
---
# Guillemets inutiles
name: 'code-reviewer'

# Tools non définis (hérite de tout)
# Manque l'application du principe du moindre privilège

# Model non spécifié (perte de cohérence)
# Devrait avoir model: inherit

# Field incorrect pour Subagents
allowed-tools: Read # Devrait être tools (sans tiret)
---
```

### Frontmatter Slash Commands

**✅ Format correct :**

```yaml
---
description: Review code for security and performance issues
tools: Read, Grep, Glob
model: sonnet
---
```

**❌ Erreurs courantes :**

```yaml
---
# name n'est pas nécessaire (nom = nom du fichier)
name: review-code

# Description trop vague
description: Reviews code
---
```

---

## Exemples Complets

### Skill Conforme (Excellent)

**Fichier :** `.claude/skills/processing-invoices/SKILL.md`

```yaml
---
name: processing-invoices
description: Processes invoice PDFs, extracts line items and validates totals. Use for accounting automation.
allowed-tools: Read, Bash
---

# Invoice Processor

Automates invoice processing with validation.

## Quand utiliser

- Traitement de factures PDF
- Extraction de données structurées
- Validation de totaux

## Workflow

1. Lire PDF avec script
2. Extraire données
3. Valider totaux
4. Générer rapport JSON

[... < 500 lignes ...]
```

**Score : 10/10**

### Skill Non Conforme (Nécessite Corrections)

**Fichier :** `.claude/skills/helper/SKILL.md`

```yaml
---
name: 'Helper Tool'
description: Helps with various tasks
---
# Helper

I help you with stuff.

[... contenu vague ...]
```

**Problèmes :**

- ❌ Nom : guillemets, espace, trop vague
- ❌ Description : vague, pas 3ème personne, manque contexte
- ❌ Contenu : 1ère personne, pas focalisé

**Corrections proposées :**

```yaml
---
name: processing-contracts
description: Processes contract documents and extracts key terms. Use for legal document automation.
allowed-tools: Read, Grep
---

# Contract Processor

Automates contract analysis and term extraction.

## Quand utiliser

- Analyse de contrats PDF
- Extraction de clauses clés
- Génération de résumés

[... contenu focalisé ...]
```

**Score après corrections : 9/10**

### Subagent Conforme (Excellent)

**Fichier :** `.claude/agents/security-auditor.md`

```yaml
---
name: security-auditor
description: Expert security auditor specializing in web vulnerabilities and OWASP Top 10. Use proactively before releases or after security-critical changes.
tools: Read, Grep, Glob, Bash, WebSearch
model: inherit
---

Vous êtes un expert en sécurité web avec une connaissance approfondie de OWASP Top 10.

## Mission

Auditer le code pour détecter :
- Vulnérabilités XSS
- Injections SQL
- Failles CSRF
- Dépendances vulnérables

## Workflow

1. Analyser security-utils.js pour patterns
2. Chercher innerHTML avec données externes
3. Vérifier sanitization
4. Auditer dépendances avec npm audit
5. Générer rapport avec score

## Format de Sortie

Pour générer votre rapport, vous DEVEZ :
1. Lire `.claude/skills/security-report-template/SKILL.md`
2. Utiliser son contenu comme template exact
```

**Score : 10/10**

### Subagent Non Conforme (Nécessite Corrections)

**Fichier :** `.claude/agents/helper.md`

```yaml
---
name: 'Code Helper'
description: Helps with code
---
I help you write code.
```

**Problèmes :**

- ❌ Nom : guillemets, espace, vague
- ❌ Description : vague, manque "quand", pas "proactivement"
- ❌ Tools : non définis (trop permissif)
- ❌ Model : non spécifié
- ❌ Contenu : 1ère personne, pas de persona claire

**Corrections proposées :**

```yaml
---
name: code-refactoring-specialist
description: Expert code refactoring specialist for maintainability and performance. Use proactively after adding features or when complexity increases.
tools: Read, Write, Edit, Grep, Glob, Bash
model: inherit
---

Vous êtes un expert en refactoring avec une maîtrise des design patterns.

## Mission

Améliorer la maintenabilité du code :
- Réduire complexité cognitive
- Extraire fonctions réutilisables
- Appliquer SOLID principles
- Optimiser performances

## Workflow

1. Analyser le code existant
2. Identifier les code smells
3. Proposer refactoring patterns
4. Appliquer changements
5. Vérifier que tests passent

## Principes

- Ne jamais casser les tests existants
- Refactorer par petites étapes
- Toujours tester après chaque modification
```

**Score après corrections : 9/10**

---

## Checklist Validation Rapide

### Pour Skills

```
✓ Nom kebab-case sans guillemets
✓ Nom forme gérondif (-ing) recommandée
✓ Description 3ème personne < 1024 chars
✓ Description inclut "Use for/when"
✓ Field: allowed-tools (avec tiret)
✓ SKILL.md < 500 lignes
✓ Pas de copie de code
```

### Pour Subagents

```
✓ Nom kebab-case sans guillemets
✓ Description 3ème personne < 1024 chars
✓ Description inclut "quand" et "proactivement"
✓ Field: tools (sans tiret)
✓ Tools explicitement définis
✓ Model spécifié (inherit recommandé)
✓ Persona claire
✓ Workflow décrit
```

### Pour Slash Commands

```
✓ Nom fichier kebab-case.md
✓ Description claire
✓ Arguments avec $ARGUMENTS
✓ Documentation du comportement
```

---

## Scores de Conformité

### Échelle de notation

**10/10 - Excellent**

- Tous les critères respectés
- Exemples concrets présents
- Documentation complète

**8-9/10 - Très bien**

- Tous critères majeurs respectés
- Quelques suggestions mineures

**6-7/10 - Acceptable**

- Critères majeurs respectés
- Plusieurs avertissements

**4-5/10 - Nécessite corrections**

- Quelques critères critiques non respectés
- Nombreux avertissements

**0-3/10 - Non conforme**

- Plusieurs critères critiques non respectés
- Corrections urgentes nécessaires

### Pondération des critères

**Critiques (bloquer) - 40% :**

- Nom conforme (kebab-case)
- Description conforme (3ème personne)
- Syntaxe YAML correcte

**Importants - 40% :**

- Tools correctement définis
- Contenu focalisé
- Structure appropriée

**Suggestions - 20% :**

- Exemples présents
- Documentation complète
- Optimisations
