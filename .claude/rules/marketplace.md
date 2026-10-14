---
paths:
  - '.claude/skills/**'
  - '.claude/agents/**'
  - 'leapmultix-marketplace/**'
---

# Skills et agents : copie locale et marketplace

When modifying skills or agents that exist in both `.claude/` (local) and `leapmultix-marketplace/` (distribution):

1. **Edit once, copy after** - Edit the local version first, then copy to marketplace
2. **Use cp, not duplicate edits** - Saves tokens and prevents drift

```bash
# Skills: local → marketplace
cp .claude/skills/<skill-name>/SKILL.md \
   leapmultix-marketplace/<skill-name>/skills/<skill-name>/SKILL.md

# Agents: local → marketplace
cp .claude/agents/<agent-name>.md \
   leapmultix-marketplace/<agent-name>/agents/<agent-name>.md
```

3. **Verify sync** after changes: `diff <local> <marketplace>`
4. **Hooks** - A plugin agent ignores the `hooks` of its frontmatter: the plugin declares the same
   script in its `hooks/hooks.json` (marketplace only), which runs for the whole session, so the
   script itself checks `agent_type`. Copy the script, keeping it executable:
   `cp -p .claude/hooks/<script> leapmultix-marketplace/<plugin>/hooks/<script>`
5. **Web or local, never both** - An agent with `WebFetch` or `WebSearch` gets no local file tool
   (`Read`, `Grep`, `Glob`, `Bash`…). Test: `tests-esm/scripts/agents-skills.test.mjs`.
6. **Bump the plugin version** in its `plugin.json` and in `.claude-plugin/marketplace.json`.
