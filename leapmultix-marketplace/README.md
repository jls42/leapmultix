# LeapMultix Marketplace

Ce répertoire regroupe les plugins distribués par le projet LeapMultix pour Claude Code. Chaque plugin est empaqueté dans son propre dossier avec un manifeste `.claude-plugin/plugin.json` et un sous-ensemble d'agents/skills/commands issus de `.claude/`.

## Plugins disponibles

| Plugin                  | Description                                                | Contenu principal                                                                                      |
| ----------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `leapmultix-dev-tools`  | Suite complète (tous les agents, skills et slash commands) | 12 agents, 20+ skills, `/audit-config`                                                                 |
| `leapmultix-dev-core`   | Workflow quotidien (code review, plugin manager, qualité)  | Agents `code-reviewer`, `plugin-manager`, skills qualité/PR                                            |
| `leapmultix-dev-audit`  | Audits et conformité (accessibilité, i18n, sécurité, PWA)  | Agents `accessibility-auditor`, `i18n-coordinator`, `web-research-specialist`, `pwa-expert`            |
| `leapmultix-dev-qa`     | Tests et performance                                       | Agents `agent-architecte`, `chrome-devtools-tester`, `debugger`, `performance-analyzer`, `test-writer` |
| `leapmultix-dev-arcade` | Aide au développement des modes arcade                     | Agent `arcade-specialist`, skills `creating-arcade-games`, `sprite-management`, etc.                   |

### Plugins unitaires (1 composant = 1 plugin)

Chaque agent, skill et slash command est aussi empaqueté individuellement pour que tu puisses installer exactement ce qu’il te faut. Les plugins suivent la nomenclature :

- `leapmultix-agent-<nom>` – agents (`./leapmultix-marketplace/agents/<nom>`)
- `leapmultix-skill-<nom>` – skills (`./leapmultix-marketplace/skills/<nom>`)
- `leapmultix-command-<nom>` – commandes (`./leapmultix-marketplace/commands/<nom>`)

Exemples :

```bash
/plugin install leapmultix-agent-code-reviewer@leapmultix-marketplace
/plugin install leapmultix-skill-checking-code-quality@leapmultix-marketplace
/plugin install leapmultix-command-audit-config@leapmultix-marketplace
```

Ces plugins unitaires sont générés automatiquement par `npm run plugin:sync` : le script copie le composant depuis `.claude/` vers le dossier `leapmultix-marketplace/<type>/<nom>` et maintient les manifests à jour.

## Synchronisation depuis `.claude`

Utiliser `npm run plugin:sync` pour copier les composants locaux dans un plugin ciblé. Quelques exemples :

```bash
# Mettre à jour la suite complète uniquement
npm run plugin:sync -- --profile=all

# Mettre à jour les plugins core + audit + QA d'un coup
npm run plugin:sync -- --profile=core,audit,qa

# Forcer un chemin personnalisé (comportement historique)
npm run plugin:sync -- --target=leapmultix-marketplace/leapmultix-dev-tools
```

Les profils sont définis dans `leapmultix-marketplace/plugin-profiles.json`. Chaque profil liste :

- `target` : dossier plugin à alimenter
- `commands` / `agents` / `skills` : listes à inclure (`[]` pour aucun, `"*"` pour tout)

Tu peux ajouter/ajuster des profils pour créer de nouveaux plugins, puis référencer ces dossiers dans `.claude-plugin/marketplace.json`.
