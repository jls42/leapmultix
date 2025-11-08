# LeapMultix Dev Tools

Plugin de développement professionnel pour Claude Code, extrait du projet LeapMultix. Fournit des outils complets pour la qualité du code, l'audit de sécurité, la création de PRs, et la gestion de plugins.

## Description

Ce plugin empaquette des outils de développement éprouvés utilisés dans le projet LeapMultix (application éducative de mathématiques). Il comprend des skills pour automatiser les workflows de qualité, des agents experts pour la revue de code et la gestion de plugins, ainsi qu'une commande pour auditer la conformité des configurations Claude Code.

## Installation

```bash
# Ajouter le marketplace
/plugin marketplace add ./leapmultix-marketplace

# Installer le plugin voulu (plusieurs packs disponibles)
/plugin install leapmultix-dev-tools@leapmultix-marketplace      # suite complète
# /plugin install leapmultix-dev-core@leapmultix-marketplace     # workflow quotidien
# /plugin install leapmultix-dev-audit@leapmultix-marketplace    # audits & conformité
# /plugin install leapmultix-dev-qa@leapmultix-marketplace       # QA & performance
# /plugin install leapmultix-dev-arcade@leapmultix-marketplace   # outils arcade
# /plugin install leapmultix-agent-code-reviewer@leapmultix-marketplace  # agent seul
# /plugin install leapmultix-skill-checking-code-quality@leapmultix-marketplace  # skill seul
# Synchroniser les agents/skills/commands depuis .claude
npm run plugin:sync
```

### Synchronisation avec `.claude`

Le script `npm run plugin:sync` copie automatiquement les dossiers `.claude/commands`, `.claude/agents` et `.claude/skills` vers les répertoires du plugin (`leapmultix-marketplace/leapmultix-dev-tools`).

- À lancer après toute modification, ajout ou suppression d'un composant.
- Le script peut recevoir `--source` et `--target` pour des chemins personnalisés si besoin.
- Les répertoires existants côté plugin sont remplacés pour rester strictement synchronisés.

#### Copier uniquement certains composants

Besoin d'un sous-ensemble d'agents/skills/commands ? Utilise les options `--commands`, `--agents` et `--skills` (listes séparées par des virgules) :

```bash
# Exemple : ne pousser que 2 agents, 2 skills et 1 commande
npm run plugin:sync -- \
  --agents=code-reviewer,plugin-manager \
  --skills=checking-code-quality,auditing-security \
  --commands=audit-config
```

- Omettre l'option (ou passer `*`) pour copier toute la catégorie.
- Pour les commandes/agents, l'extension `.md` est facultative (`code-reviewer` ≈ `code-reviewer.md`).
- Les éléments non trouvés sont signalés à la fin du script.

Tu peux aussi t'appuyer sur les **profils** définis dans `leapmultix-marketplace/plugin-profiles.json` :

```bash
# Mettre à jour la suite complète + le pack audit
npm run plugin:sync -- --profile=all,audit
```

Chaque profil précise les sélections et la cible (`leapmultix-dev-core`, `leapmultix-dev-audit`, etc.) afin de générer plusieurs plugins prêts à être installés.

Les plugins unitaires (`leapmultix-agent-*`, `leapmultix-skill-*`, `leapmultix-command-*`) sont générés automatiquement lors du sync et ajoutés au marketplace pour installation à la carte.

## Composants inclus

### Slash Commands

- **`/audit-config`** - Audite la conformité des Skills, Subagents et Slash Commands selon les best practices Claude Code

### Agents

- **`code-reviewer`** - Expert en revue de code spécialisé en sécurité, performance et bonnes pratiques. Utiliser de manière proactive après des modifications de code
  - Tools : Read, Grep, Glob, Bash, WebSearch
  - Analyse systématique : sécurité, performance, architecture, tests

- **`plugin-manager`** - Expert en création et gestion de plugins Claude Code avec marketplace manifests. Utiliser proactivement quand l'utilisateur veut créer, packager, configurer ou distribuer des plugins
  - Tools : Read, Write, Grep, Glob, Bash, WebFetch
  - Orchestration complète : analyse, création, configuration, test, distribution

### Skills

#### checking-code-quality

Exécute les vérifications de qualité du code (format:check, ESLint, Jest) avant chaque commit selon les standards du projet.

**Quand utiliser :**

- TOUJOURS avant chaque commit
- Avant de créer une PR
- Après modification JavaScript/CSS

**Workflow :**

1. `npm run format:check` (CRITIQUE)
2. `npm run lint`
3. `npm test`
4. `npm run test:coverage`

#### creating-pull-requests

Automatise la création de Pull Requests GitHub avec descriptions structurées générées depuis les commits.

**Quand utiliser :**

- Quand l'utilisateur demande de créer une PR
- Après commits sur feature branch
- Feature terminée et prête pour review

**Workflow :**

1. Analyser tous les commits depuis main
2. Générer titre et description PR
3. Créer PR avec gh CLI

#### checking-config-compliance

Valide la conformité des Skills, Subagents et Slash Commands contre les best practices Claude Code.

**Quand utiliser :**

- Après création ou modification de Skills/Agents/Commands
- Avant publication de plugins
- Audit systématique du repository

**Validation :**

- Frontmatter YAML correct
- Noms en kebab-case (gerund pour skills)
- Descriptions complètes et conformes
- Structure de fichiers valide

#### auditing-security

Audite la sécurité de l'application (XSS, CSP, vulnérabilités des dépendances, CORS) selon standards OWASP.

**Quand utiliser :**

- Avant chaque release en production
- Après ajout/mise à jour de dépendances npm
- Modifications de security-utils.js
- Warnings eslint-plugin-security

**Domaines couverts :**

- XSS Prevention (via security-utils)
- Content Security Policy (CSP)
- Dependency Vulnerabilities
- HTTPS et Mixed Content
- Secrets et Credentials
- LocalStorage Security

## Usage

### Exemple 1 : Audit complet avant commit

```bash
# Vérifier qualité du code
# (Le skill checking-code-quality sera automatiquement découvert)

# Auditer la conformité de la configuration
/audit-config

# Créer un commit si tout passe
# Créer une PR
# (Le skill creating-pull-requests sera automatiquement découvert)
```

### Exemple 2 : Revue de code avec agent

```bash
# L'agent code-reviewer s'active automatiquement après modifications
# Ou invoquer explicitement pour revue immédiate
```

### Exemple 3 : Créer un nouveau plugin

```bash
# L'agent plugin-manager orchestre la création
# Il lit automatiquement le skill creating-plugins pour les templates
```

### Exemple 4 : Audit de sécurité avant release

```bash
# Utiliser le skill auditing-security
# Exécuter npm audit
# Vérifier CSP dans index.html
# Valider security-utils usage
```

## Prérequis

### Outils requis

- **Node.js** et **npm** (pour commands de qualité)
- **Git** (pour PRs et commits)
- **GitHub CLI (gh)** (pour création de PRs)
  - Installer : https://cli.github.com/
  - Authentifier : `gh auth login`

### Dépendances npm

Ces packages doivent être dans votre projet :

- **ESLint** (linting)
- **Prettier** (formatting)
- **Jest** (testing)
- **eslint-plugin-security** (security checks)

### Configuration projet

Pour utiliser pleinement les skills, votre projet doit avoir :

- `package.json` avec scripts :
  - `npm run format:check`
  - `npm run lint`
  - `npm test`
  - `npm run test:coverage`
  - `npm run verify`
- `.claude/BEST_PRACTICES_AGENTS_SKILLS.md` (pour compliance checks)
- `eslint.config.js` ou `.eslintrc.js`
- `.prettierrc`

## Workflows recommandés

### Workflow 1 : Development Quality Gate

Avant chaque commit :

1. Code modifications
2. Le skill `checking-code-quality` guide les vérifications
3. `npm run format:check` → fix si nécessaire
4. `npm run lint` → fix si nécessaire
5. `npm test` → fix si échecs
6. Commit si tout passe

### Workflow 2 : Pull Request Creation

Après feature complète :

1. Vérifier qualité (workflow 1)
2. Le skill `creating-pull-requests` guide la création
3. Analyser commits depuis main
4. Générer titre/description
5. Créer PR avec gh CLI
6. Review automatique par agent `code-reviewer`

### Workflow 3 : Plugin Development

Pour créer un nouveau plugin :

1. Invoquer agent `plugin-manager`
2. L'agent analyse les composants disponibles
3. Sélectionner composants à empaqueter
4. L'agent crée structure, configs, documentation
5. Test local avec `/plugin install`
6. Validation compliance avec `/audit-config`
7. Distribution

### Workflow 4 : Security Audit

Avant release en production :

1. `npm audit` (dependency scan)
2. Le skill `auditing-security` guide l'audit complet
3. Vérifier XSS, CSP, secrets
4. Lighthouse security audit
5. Fix Critical/High vulnérabilités
6. Documenter exceptions justifiées

## Troubleshooting

### Erreur : "gh not found" lors de création PR

**Cause :** GitHub CLI non installé ou non dans PATH

**Solution :**

```bash
# Installer gh
# macOS
brew install gh

# Windows
winget install GitHub.cli

# Linux
# Voir https://github.com/cli/cli#installation

# Puis authentifier
gh auth login
```

### Erreur : "npm run format:check" fails

**Cause :** Code pas formaté selon Prettier

**Solution :**

```bash
npm run format  # Auto-format
npm run format:check  # Vérifier
```

### Erreur : Compliance audit fails

**Cause :** Skills/Agents/Commands non conformes aux best practices

**Solution :**

```bash
/audit-config  # Voir détails des erreurs
# Corriger selon rapport généré
# Re-run audit
```

### Plugin installation fails

**Cause :** Structure du plugin invalide ou composants corrompus

**Solution :**

1. Vérifier `.claude-plugin/plugin.json` existe et valide
2. Vérifier composants dans bons dossiers (racine du plugin)
3. Réinstaller : `/plugin uninstall` puis `/plugin install`

## Contribuer

Ce plugin est extrait du projet LeapMultix. Pour contribuer :

1. Fork le repository LeapMultix
2. Créer une feature branch
3. Modifier les composants dans `.claude/`
4. Suivre le workflow de qualité (voir ci-dessus)
5. Créer une PR avec le skill `creating-pull-requests`

## Licence

MIT - Voir LICENSE du projet LeapMultix

## Support

Pour questions ou problèmes :

- Ouvrir une issue sur le repository LeapMultix
- Consulter la documentation des skills dans `.claude/skills/`
- Utiliser l'agent `plugin-manager` pour aide sur les plugins
- Utiliser l'agent `code-reviewer` pour questions sur la qualité du code

## Changelog

### 1.0.0 (2025-11-08)

- Initial release
- 4 skills : checking-code-quality, creating-pull-requests, checking-config-compliance, auditing-security
- 2 agents : code-reviewer, plugin-manager
- 1 command : /audit-config
