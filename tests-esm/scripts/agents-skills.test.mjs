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
    return [...skills, ...agents];
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
