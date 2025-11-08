---
description: Audits Skills, Subagents or Slash Commands for compliance with best practices
---

# Audit de Conformité

Utilisez l'agent-architecte pour auditer la conformité des composants de configuration.

## Arguments

- `skills` - Auditer tous les Skills
- `agents` ou `subagents` - Auditer tous les Subagents
- `commands` ou `slash` - Auditer tous les Slash Commands
- `all` - Auditer tous les composants
- `[nom-composant]` - Auditer un composant spécifique

## Exemples

```bash
/audit-config skills          # Audite tous les skills
/audit-config agents          # Audite tous les agents
/audit-config all             # Audit complet
/audit-config accessibility   # Audite le skill accessibility
```

---

Je vais maintenant utiliser l'agent-architecte pour auditer : **$ARGUMENTS**

Utilise l'agent `agent-architecte` avec le workflow Mode 2 (Audit de Composants Existants) pour :

1. Identifier les composants concernés ($ARGUMENTS)
2. Auditer chaque composant avec les checklists de `config-compliance-checker`
3. Générer un rapport consolidé avec :
   - Scores de conformité
   - Problèmes classés par criticité (🔴🟡🔵)
   - Top corrections prioritaires
   - Diffs proposés pour corrections

Le rapport doit être structuré et exploitable pour améliorer la qualité des configurations.
