/**
 * @jest-environment node
 *
 * Skills et agents du dépôt et du marketplace : un skill ne pré-autorise jamais tout Bash, ni
 * une commande qui publie, déploie ou paie (git commit, git push, aws, deploy.sh, voix) ; les
 * copies du marketplace sont celles du dépôt, octet pour octet (.claude/rules/marketplace.md) ;
 * la version d'un plugin est la même dans son plugin.json et dans le catalogue.
 */
import { describe, expect, test } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';

const MARKETPLACE = 'leapmultix-marketplace';

const dirs = parent =>
  fs.existsSync(parent)
    ? fs.readdirSync(parent, { withFileTypes: true }).filter(e => e.isDirectory())
    : [];

const skillFiles = [
  ...dirs('.claude/skills').map(d => path.join('.claude/skills', d.name, 'SKILL.md')),
  ...dirs(MARKETPLACE).flatMap(plugin =>
    dirs(path.join(MARKETPLACE, plugin.name, 'skills')).map(d =>
      path.join(MARKETPLACE, plugin.name, 'skills', d.name, 'SKILL.md')
    )
  ),
].filter(file => fs.existsSync(file));

/** Outils pré-autorisés du frontmatter (allowed-tools), un par entrée */
function allowedTools(file) {
  const line = fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .find(l => l.startsWith('allowed-tools:'));
  if (!line) return [];
  return line
    .slice('allowed-tools:'.length)
    .split(',')
    .map(tool => tool.trim())
    .filter(Boolean);
}

/** Commandes qui publient, déploient ou coûtent : jamais sans la demande de permission */
const GUARDED = /git (commit|push)|\baws\b|deploy\.sh|npm run voice|voice:/;

describe('Outils pré-autorisés des skills', () => {
  test('des skills à vérifier, dans le dépôt et le marketplace', () => {
    expect(skillFiles.length).toBeGreaterThanOrEqual(4);
  });

  test.each(skillFiles)('%s : aucun Bash sans motif, aucune commande gardée', file => {
    const tools = allowedTools(file);
    expect(tools).not.toContain('Bash');
    const bash = tools.filter(tool => tool.startsWith('Bash('));
    expect(bash.filter(tool => GUARDED.test(tool) || /^Bash\(\s*\*?\s*\)$/.test(tool))).toEqual([]);
  });
});

describe('Copies du marketplace', () => {
  const copies = dirs(MARKETPLACE).flatMap(plugin => {
    const root = path.join(MARKETPLACE, plugin.name);
    const skills = dirs(path.join(root, 'skills')).map(d => [
      path.join('.claude/skills', d.name, 'SKILL.md'),
      path.join(root, 'skills', d.name, 'SKILL.md'),
    ]);
    const agentsDir = path.join(root, 'agents');
    const agents = fs.existsSync(agentsDir)
      ? fs
          .readdirSync(agentsDir)
          .map(name => [path.join('.claude/agents', name), path.join(agentsDir, name)])
      : [];
    // Scripts des hooks du plugin (hooks.json, lui, n'existe que dans le plugin)
    const hooksDir = path.join(root, 'hooks');
    const hooks = fs.existsSync(hooksDir)
      ? fs
          .readdirSync(hooksDir)
          .filter(name => name !== 'hooks.json')
          .map(name => [path.join('.claude/hooks', name), path.join(hooksDir, name)])
      : [];
    return [...skills, ...agents, ...hooks];
  });

  test('des copies à comparer', () => {
    expect(copies.length).toBeGreaterThanOrEqual(4);
  });

  test.each(copies)('%s et sa copie %s : identiques', (local, copy) => {
    expect(fs.readFileSync(copy, 'utf8')).toBe(fs.readFileSync(local, 'utf8'));
  });

  test('version de chaque plugin : la même dans plugin.json et dans le catalogue', () => {
    const catalog = JSON.parse(fs.readFileSync('.claude-plugin/marketplace.json', 'utf8'));
    for (const entry of catalog.plugins) {
      const manifest = path.join(entry.source, '.claude-plugin', 'plugin.json');
      expect([entry.name, JSON.parse(fs.readFileSync(manifest, 'utf8')).version]).toEqual([
        entry.name,
        entry.version,
      ]);
    }
  });
});

/** Agents du dépôt et du marketplace */
const agentFiles = [
  ...fs.readdirSync('.claude/agents').map(name => path.join('.claude/agents', name)),
  ...dirs(MARKETPLACE).flatMap(plugin => {
    const dir = path.join(MARKETPLACE, plugin.name, 'agents');
    return fs.existsSync(dir) ? fs.readdirSync(dir).map(name => path.join(dir, name)) : [];
  }),
];

/** Outils de l'agent (tools du frontmatter) ; sans cette ligne, il les aurait tous */
function agentTools(file) {
  const line = fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .find(l => l.startsWith('tools:'));
  return line
    ? line
        .slice('tools:'.length)
        .split(',')
        .map(tool => tool.trim())
        .filter(Boolean)
    : null;
}

const WEB_TOOLS = new Set(['WebFetch', 'WebSearch']);
const LOCAL_TOOLS = new Set(['Read', 'Grep', 'Glob', 'Bash', 'Edit', 'Write', 'NotebookEdit']);
const CHROME_HOOK = 'chrome-localhost-only.mjs';
const NAVIGATION = 'mcp__chrome-devtools__navigate_page|mcp__chrome-devtools__new_page';

describe('Agents : le web ou le poste, jamais les deux', () => {
  test('des agents à vérifier, dans le dépôt et le marketplace', () => {
    expect(agentFiles.length).toBeGreaterThanOrEqual(6);
  });

  // Une page lue peut porter des consignes : un agent qui lit le web ne lit pas les fichiers du
  // poste, sinon une page piégée mènerait de la lecture d'un secret à sa sortie
  test.each(agentFiles)('%s', file => {
    const tools = agentTools(file);
    expect(tools).not.toBeNull();
    const web = tools.filter(tool => WEB_TOOLS.has(tool));
    const local = tools.filter(tool => LOCAL_TOOLS.has(tool));
    expect({ web, local: web.length ? local : [] }).toEqual({ web, local: [] });
  });

  test('l’agent Chrome ne navigue que vers le serveur local : hook de l’agent et du plugin', () => {
    const front = fs
      .readFileSync('.claude/agents/chrome-devtools-tester.md', 'utf8')
      .split('---')[1];
    expect(front).toContain(`matcher: '${NAVIGATION}'`);
    expect(front).toContain(`command: '$\{CLAUDE_PROJECT_DIR}/.claude/hooks/${CHROME_HOOK}'`);
    expect(front).toContain("args: ['--always']");
    expect(front).toContain('onFailure: block');
    // Un agent de plugin ignore les hooks de son frontmatter : le plugin les pose lui-même
    const plugin = path.join(MARKETPLACE, 'chrome-devtools-tester', 'hooks');
    const [entry] = JSON.parse(fs.readFileSync(path.join(plugin, 'hooks.json'), 'utf8')).hooks
      .PreToolUse;
    expect(entry.matcher).toBe(NAVIGATION);
    expect(entry.hooks[0].command).toBe(`$\{CLAUDE_PLUGIN_ROOT}/hooks/${CHROME_HOOK}`);
    for (const script of [
      path.join('.claude/hooks', CHROME_HOOK),
      path.join(plugin, CHROME_HOOK),
    ]) {
      expect(fs.statSync(script).mode & 0o111).not.toBe(0);
    }
  });
});
