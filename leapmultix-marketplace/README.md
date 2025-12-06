# LeapMultix Marketplace

Claude Code plugins for development workflows.

## Available Plugins

### chrome-devtools-tester

Agent for testing web application features in Chrome browser using DevTools MCP integration.

```bash
/plugin install chrome-devtools-tester@leapmultix-marketplace
```

**Features:**

- Automated browser testing via Chrome DevTools Protocol
- Page navigation, screenshots, element interaction
- Console and network request monitoring
- Performance tracing

### expert-claude-code

Expert Claude Code agent that consults official documentation to help create skills, agents, plugins, hooks, and configure Claude Code.

```bash
/plugin install expert-claude-code@leapmultix-marketplace
```

**Features:**

- Consults official Claude Code documentation
- Helps create and configure skills, agents, plugins
- Guides on hooks, MCP servers, and CI/CD integration
- Answers questions about Claude Code CLI and configuration

### helping-with-commits

Skill for automating Git commits with Conventional Commits format and project-specific rules.

```bash
/plugin install helping-with-commits@leapmultix-marketplace
```

**Features:**

- Conventional Commits format enforcement
- Automatic diff analysis
- Quality checks before commit (format, lint, tests)
- Project-specific rules (no AI mentions in commits)

### web-research-specialist

Research agent for documentation and technical information. Uses Context7 MCP first, falls back to WebSearch/WebFetch on official sources only.

```bash
/plugin install web-research-specialist@leapmultix-marketplace
```

**Features:**

- Context7 MCP integration for library documentation
- Falls back to WebSearch/WebFetch on official sources
- Avoids polluting main conversation context
- Focused on authoritative documentation sources

## Installation

Add this marketplace:

```bash
/plugin marketplace add jls42/leapmultix
```

Then install plugins:

```bash
/plugin install chrome-devtools-tester@leapmultix-marketplace
/plugin install expert-claude-code@leapmultix-marketplace
/plugin install helping-with-commits@leapmultix-marketplace
/plugin install web-research-specialist@leapmultix-marketplace
```

### Local Development

For local testing, use the local path instead:

```bash
/plugin marketplace add ./leapmultix-marketplace
```

## License

AGPL-3.0 © Julien LE SAUX

## Links

- **Homepage**: https://github.com/leapmultix/leapmultix
- **Repository**: https://github.com/leapmultix/leapmultix.git
