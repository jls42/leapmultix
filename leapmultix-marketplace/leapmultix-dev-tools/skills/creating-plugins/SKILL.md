---
name: creating-plugins
description: Guides creation of Claude Code plugins with marketplace manifests for packaging and distributing commands, agents, skills and hooks. Use when user wants to create, package or share plugins
allowed-tools: Read, Write, Grep, Glob, Bash
---

# Plugin Creator

Guide la création de plugins Claude Code pour empaqueter et distribuer commands, agents, skills et hooks.

## Table des matières

- [Quand utiliser ce Skill](#quand-utiliser-ce-skill)
- [Prérequis](#prérequis)
- [Structure d'un plugin](#structure-dun-plugin)
- [Workflow de création](#workflow-de-création)
- [Fichiers requis](#fichiers-requis)
- [Commandes de gestion](#commandes-de-gestion)
- [Test local et validation](#test-local-et-validation)
- [Distribution en équipe](#distribution-en-équipe)
- [Exemples concrets](#exemples-concrets)
- [Gestion erreurs](#gestion-erreurs)
- [Checklist avant publication](#checklist-avant-publication)
- [En cas de doute](#en-cas-de-doute)

## Quand utiliser ce Skill

- Quand l'utilisateur demande de "créer un plugin", "create a plugin"
- Empaqueter fonctionnalités réutilisables entre projets
- Distribuer commands/agents/skills à une équipe
- Partager des outils avec la communauté
- Transformer un projet existant en plugin

## Prérequis

**Claude Code installé et configuré**

Vérifie : `/help` fonctionne et affiche les commands disponibles

**Projet avec composants à empaqueter**

Au moins un de :

- `.claude/commands/*.md` - Slash commands
- `.claude/agents/*.md` - Subagents
- `.claude/skills/*/SKILL.md` - Skills
- `.claude/hooks/hooks.json` - Event hooks

## Structure d'un plugin

```
plugin-name/
├── .claude-plugin/
│   ├── plugin.json          # Manifest du plugin (REQUIS)
│   └── marketplace.json     # Manifest marketplace (optionnel, pour distribution)
├── commands/                 # Slash commands (copier depuis .claude/commands/)
│   ├── command1.md
│   └── command2.md
├── agents/                   # Subagents (copier depuis .claude/agents/)
│   ├── agent1.md
│   └── agent2.md
├── skills/                   # Skills (copier depuis .claude/skills/)
│   ├── skill1/
│   │   ├── SKILL.md
│   │   └── templates/
│   └── skill2/
│       └── SKILL.md
├── hooks/                    # Event hooks (copier depuis .claude/hooks/)
│   └── hooks.json
└── README.md                 # Documentation (FORTEMENT RECOMMANDÉ)
```

**IMPORTANT :** Les composants sont à la **racine** du plugin, pas dans `.claude-plugin/` !

## Workflow de création

### 1. Analyser le projet source

Identifie tous les composants à inclure dans le plugin :

- Liste commands : Examine `.claude/commands/`
- Liste agents : Examine `.claude/agents/`
- Liste skills : Examine `.claude/skills/`
- Liste hooks : Examine `.claude/hooks/hooks.json`

Décide quels composants empaqueter (tous ou sous-ensemble).

### 2. Créer la structure du plugin

```bash
# Créer dossier racine du plugin
mkdir plugin-name

# Créer sous-dossier .claude-plugin
mkdir plugin-name/.claude-plugin

# Créer dossiers pour composants (selon besoin)
mkdir -p plugin-name/commands
mkdir -p plugin-name/agents
mkdir -p plugin-name/skills
mkdir -p plugin-name/hooks
```

### 3. Copier les composants

**Commands :**

```bash
cp .claude/commands/*.md plugin-name/commands/
```

**Agents :**

```bash
cp .claude/agents/*.md plugin-name/agents/
```

**Skills :**

```bash
cp -r .claude/skills/* plugin-name/skills/
```

**Hooks :**

```bash
cp .claude/hooks/hooks.json plugin-name/hooks/
```

### 4. Créer plugin.json

Utilise le template `templates/plugin.json.template` :

```json
{
  "name": "nom-du-plugin",
  "description": "Description claire et concise du plugin",
  "version": "1.0.0",
  "author": "Julien LE SAUX <contact@jls42.org>"
}
```

Sauvegarde dans `plugin-name/.claude-plugin/plugin.json`

**Règles de nommage :**

- `name` : kebab-case, descriptif
- `description` : Max 1024 caractères, décrit QUOI et QUAND utiliser
- `version` : Semantic versioning (MAJOR.MINOR.PATCH)
- `author` : Toujours `Julien LE SAUX <contact@jls42.org>` (contact officiel du projet)

### 5. Créer README.md

Structure recommandée :

```markdown
# Nom du Plugin

Description détaillée du plugin et de son utilité.

## Installation

\`\`\`bash
/plugin marketplace add ./path/to/marketplace
/plugin install plugin-name@marketplace-name
\`\`\`

## Composants inclus

### Commands

- `/command1` - Description
- `/command2` - Description

### Agents

- `agent1` - Description et quand l'utiliser
- `agent2` - Description et quand l'utiliser

### Skills

- `skill1` - Description
- `skill2` - Description

## Usage

[Exemples d'utilisation concrets]

## Prérequis

[Dépendances, tools nécessaires]

## Troubleshooting

[Solutions aux erreurs courantes]
```

### 6. (Optionnel) Créer marketplace de test

Pour tester et distribuer :

```bash
# Créer dossier marketplace parent
mkdir mon-marketplace

# Déplacer le plugin dedans
mv plugin-name mon-marketplace/

# Créer marketplace.json à la racine
```

Contenu de `mon-marketplace/marketplace.json` :

```json
{
  "name": "mon-marketplace",
  "owner": "organisation-ou-username",
  "plugins": [
    {
      "name": "plugin-name",
      "source": "./plugin-name",
      "description": "Description du plugin"
    }
  ]
}
```

### 7. Tester localement

```bash
# Ajouter le marketplace
/plugin marketplace add ./mon-marketplace

# Installer le plugin
/plugin install plugin-name@mon-marketplace

# Vérifier installation
/help
```

Vérifie que :

- Commands apparaissent dans `/help`
- Agents sont disponibles
- Skills sont détectés automatiquement
- Hooks s'exécutent correctement

### Workflow automatisé LeapMultix (CRITIQUE)

Ce repository dispose d'un pipeline de packaging automatique. **Ne pas copier les fichiers à la main**, utilise le script suivant :

1. **Définir les profils** dans `leapmultix-marketplace/plugin-profiles.json`
   - `target` → dossier plugin (ex. `leapmultix-marketplace/leapmultix-dev-core`)
   - `commands` / `agents` / `skills` → listes (ou `"*"`)
   - `description`, `category` → affichage marketplace
2. **Exécuter la synchro** :
   ```bash
   npm run plugin:sync -- --profile=all,core,audit
   # Bundle personnalisé
   npm run plugin:sync -- --target=leapmultix-marketplace/custom-bundle \
     --agents=code-reviewer --skills=checking-code-quality --commands=audit-config
   ```
3. **Résultat automatique** :
   - Copie des composants depuis `.claude/`
   - Regénération des `plugin.json`
   - Création des plugins unitaires (`leapmultix-agent-*`, `leapmultix-skill-*`, `leapmultix-command-*`)
   - Mise à jour des manifests marketplaces (`.claude-plugin/marketplace.json` + `leapmultix-marketplace/.claude-plugin/marketplace.json`)

✅ **À faire systématiquement** : après toute modification d'un command/agent/skill, relancer `npm run plugin:sync` puis réinstaller le plugin concerné dans Claude pour tester la nouvelle version.

## Fichiers requis

### plugin.json (REQUIS)

Localisation : `.claude-plugin/plugin.json`

Champs obligatoires :

- `name` (string) : Identifiant unique du plugin
- `description` (string) : Description claire
- `version` (string) : Version semantic (ex: "1.0.0")
- `author` (string) : Toujours `Julien LE SAUX <contact@jls42.org>`

Champs optionnels :

- `homepage` (string) : URL du projet
- `repository` (string) : URL du repository git
- `license` (string) : Type de licence (MIT, Apache, etc.)

Exemple complet :

```json
{
  "name": "mon-plugin-awesome",
  "description": "Plugin pour automatiser les workflows de développement avec Claude Code",
  "version": "1.2.3",
  "author": "Julien LE SAUX <contact@jls42.org>",
  "homepage": "https://github.com/jls42/leapmultix",
  "repository": "https://github.com/jls42/leapmultix.git",
  "license": "AGPL-3.0-or-later"
}
```

### marketplace.json (Optionnel, pour distribution)

Localisation : Racine du marketplace (niveau parent des plugins)

Structure :

```json
{
  "name": "marketplace-name",
  "owner": "organisation",
  "plugins": [
    {
      "name": "plugin1",
      "source": "./plugin1",
      "description": "Description courte"
    },
    {
      "name": "plugin2",
      "source": "./plugin2",
      "description": "Description courte"
    }
  ]
}
```

**Notes :**

- Un marketplace peut contenir plusieurs plugins
- `source` : chemin relatif depuis marketplace.json
- `name` dans marketplace doit matcher `name` dans plugin.json

## Commandes de gestion

### Installation et activation

```bash
# Ajouter un marketplace
/plugin marketplace add <path>
# Exemple : /plugin marketplace add ./mon-marketplace
# Exemple : /plugin marketplace add https://github.com/user/marketplace

# Lister marketplaces enregistrés
/plugin marketplace list

# Installer un plugin
/plugin install <name>@<marketplace>
# Exemple : /plugin install mon-plugin@mon-marketplace

# Activer un plugin désactivé (sans réinstaller)
/plugin enable <name>@<marketplace>

# Désactiver temporairement (sans supprimer)
/plugin disable <name>@<marketplace>

# Désinstaller complètement
/plugin uninstall <name>@<marketplace>
```

### Gestion et debug

```bash
# Menu interactif de gestion
/plugin

# Lister commands installées
/help

# Vérifier version d'un plugin
# (lire .claude-plugin/plugin.json du plugin installé)
```

## Test local et validation

### Workflow de test itératif

1. **Modifier plugin**
   - Éditer composants (commands, agents, skills)
   - Mettre à jour version dans plugin.json

2. **Réinstaller**

   ```bash
   /plugin uninstall plugin-name@marketplace-name
   /plugin install plugin-name@marketplace-name
   ```

3. **Valider**
   - Vérifier avec `/help` que les commands apparaissent
   - Tester chaque command individuellement
   - Tester agents sur tâches réelles
   - Vérifier skills sont découverts automatiquement
   - Tester hooks (si applicable)

4. **Valider compliance**

   Utilise le skill `checking-config-compliance` pour valider :
   - Frontmatter des agents corrects
   - Noms en kebab-case
   - Descriptions complètes
   - Structure des skills conforme

### Checklist de test

- [ ] Plugin installe sans erreur
- [ ] Toutes les commands apparaissent dans `/help`
- [ ] Commands s'exécutent correctement avec arguments
- [ ] Agents sont invoqués automatiquement quand approprié
- [ ] Skills sont découverts par contexte
- [ ] Hooks s'exécutent aux bons moments
- [ ] Pas de conflits avec autres plugins
- [ ] Documentation README claire et complète

## Distribution en équipe

### Configuration automatique via .claude/settings.json

Pour déploiement automatique quand équipe trust le repository :

```json
{
  "marketplaces": [
    {
      "path": "./marketplaces/team-plugins"
    }
  ],
  "plugins": [
    {
      "name": "team-workflow",
      "marketplace": "team-marketplace",
      "enabled": true
    },
    {
      "name": "project-helpers",
      "marketplace": "team-marketplace",
      "enabled": true
    }
  ]
}
```

**Workflow équipe :**

1. Créer marketplace dans repository (ex: `./marketplaces/team-plugins/`)
2. Ajouter plugins au marketplace
3. Configurer `.claude/settings.json` dans repository
4. Commiter et pusher
5. Membres équipe : trust le repository
6. Claude Code installe automatiquement les plugins

### Versioning et updates

**Semantic Versioning :**

- **MAJOR** (1.0.0 → 2.0.0) : Breaking changes
- **MINOR** (1.0.0 → 1.1.0) : Nouvelles fonctionnalités rétro-compatibles
- **PATCH** (1.0.0 → 1.0.1) : Bug fixes

**Workflow de mise à jour :**

1. Modifier plugin et incrémenter version dans plugin.json
2. Documenter changements dans README/CHANGELOG
3. Si breaking changes : documenter migration dans README
4. Tester complètement
5. Notifier équipe des updates
6. Équipe désinstalle/réinstalle pour obtenir nouvelle version

## Exemples concrets

### Exemple 1 : Plugin simple (1 command)

```
code-review-plugin/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   └── review.md
└── README.md
```

`plugin.json` :

```json
{
  "name": "code-review",
  "description": "Command pour reviews de code automatisées",
  "version": "1.0.0",
  "author": "Julien LE SAUX <contact@jls42.org>"
}
```

### Exemple 2 : Plugin complet (commands + agents + skills)

```
dev-workflow-plugin/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   ├── test.md
│   ├── deploy.md
│   └── lint.md
├── agents/
│   ├── code-reviewer.md
│   └── test-writer.md
├── skills/
│   ├── checking-code-quality/
│   │   └── SKILL.md
│   └── creating-pull-requests/
│       └── SKILL.md
└── README.md
```

### Exemple 3 : Marketplace avec multiple plugins

```
company-marketplace/
├── marketplace.json
├── security-tools/
│   ├── .claude-plugin/
│   │   └── plugin.json
│   ├── commands/
│   └── README.md
├── testing-tools/
│   ├── .claude-plugin/
│   │   └── plugin.json
│   ├── agents/
│   └── README.md
└── documentation-tools/
    ├── .claude-plugin/
    │   └── plugin.json
    ├── skills/
    └── README.md
```

`marketplace.json` :

```json
{
  "name": "company-tools",
  "owner": "MyCompany",
  "plugins": [
    {
      "name": "security-tools",
      "source": "./security-tools",
      "description": "Outils de sécurité et audit"
    },
    {
      "name": "testing-tools",
      "source": "./testing-tools",
      "description": "Agents et commands pour TDD"
    },
    {
      "name": "documentation-tools",
      "source": "./documentation-tools",
      "description": "Génération automatique de docs"
    }
  ]
}
```

## Gestion erreurs

### Erreur : Plugin not found

**Cause :** Nom plugin ou marketplace incorrect

**Solution :**

```bash
/plugin marketplace list  # Vérifier nom marketplace
# Vérifier que name dans plugin.json match la commande install
```

### Erreur : Invalid plugin.json

**Cause :** JSON malformé ou champs manquants

**Solution :**

- Valider JSON avec un linter
- Vérifier champs requis : name, description, version, author
- Vérifier format semantic versioning pour version

### Erreur : Commands not appearing in /help

**Causes possibles :**

- Plugin désactivé
- Commands dans mauvais dossier (doivent être dans `plugin-name/commands/` pas `.claude-plugin/commands/`)
- Conflits de noms avec autres plugins

**Solution :**

```bash
/plugin enable plugin-name@marketplace-name
# Vérifier structure : commands/ à la racine du plugin
# Renommer commands si conflit
```

### Erreur : Marketplace not accessible

**Cause :** Path incorrect ou permissions

**Solution :**

- Vérifier path est correct (relatif ou absolu)
- Vérifier permissions de lecture sur dossier
- Pour URLs : vérifier connectivité réseau

### Erreur : Plugin installation fails silently

**Cause :** Composants invalides (agents avec mauvais frontmatter, etc.)

**Solution :**

- Valider chaque composant individuellement avant packaging
- Utiliser skill `checking-config-compliance`
- Vérifier logs Claude Code pour détails

## Checklist avant publication

### Structure et fichiers

- [ ] `.claude-plugin/plugin.json` existe et est valide
- [ ] `plugin.json` contient : name, description, version, author
- [ ] Version suit semantic versioning
- [ ] README.md complet avec installation et usage
- [ ] Composants dans bons dossiers (racine, pas dans .claude-plugin/)
- [ ] Pas de fichiers sensibles (secrets, .env, credentials)

### Validation composants

- [ ] Commands testés individuellement
- [ ] Agents avec frontmatter valide (name, description, tools)
- [ ] Skills avec SKILL.md et structure correcte
- [ ] Hooks testés (si applicable)
- [ ] Compliance validée avec skill `checking-config-compliance`

### Documentation

- [ ] README explique clairement utilité du plugin
- [ ] Instructions d'installation claires
- [ ] Exemples d'utilisation fournis
- [ ] Prérequis documentés (dependencies, tools)
- [ ] Troubleshooting pour erreurs communes
- [ ] Breaking changes documentés (si updates)

### Testing

- [ ] Testé cycle complet : uninstall → install → test
- [ ] Testé sur projet réel
- [ ] Testé par au moins une autre personne
- [ ] Pas de conflits avec plugins courants
- [ ] Performance acceptable (pas de ralentissement)

### Distribution (si applicable)

- [ ] marketplace.json créé et valide
- [ ] Plugin référencé dans marketplace.json
- [ ] Marketplace accessible (local ou remote)
- [ ] `.claude/settings.json` configuré pour équipe
- [ ] Équipe notifiée de la disponibilité

## En cas de doute

**Source :** `.claude/BEST_PRACTICES_AGENTS_SKILLS.md` section Plugins

**Templates disponibles :**

- `templates/plugin.json.template` - Structure plugin.json
- `templates/marketplace.json.template` - Structure marketplace.json

**Règles absolues :**

1. **TOUJOURS** créer plugin.json dans `.claude-plugin/`
2. **TOUJOURS** placer composants à la racine (commands/, agents/, skills/)
3. **JAMAIS** commiter secrets ou credentials
4. **TOUJOURS** versionner avec semantic versioning
5. **TOUJOURS** tester avant distribution équipe

**Workflow minimal :**

```bash
# 1. Créer structure
mkdir plugin-name/.claude-plugin
mkdir plugin-name/commands

# 2. Créer plugin.json
# (utiliser template)

# 3. Copier composants
cp .claude/commands/*.md plugin-name/commands/

# 4. Créer README.md

# 5. Tester localement
mkdir marketplace && mv plugin-name marketplace/
# Créer marketplace.json
/plugin marketplace add ./marketplace
/plugin install plugin-name@marketplace
/help  # Vérifier commands

# 6. Valider compliance
# (utiliser skill checking-config-compliance)
```

**Ressources :**

- Documentation officielle : https://code.claude.com/docs/en/plugins
- BEST_PRACTICES section Plugins
- Exemples dans ce SKILL.md
