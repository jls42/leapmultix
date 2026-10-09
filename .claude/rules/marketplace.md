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
