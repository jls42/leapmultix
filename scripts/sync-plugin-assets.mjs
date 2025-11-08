import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const sourceRoot = path.resolve(repoRoot, '.claude');
const marketplaceRoot = path.join(repoRoot, 'leapmultix-marketplace');
const defaultTarget = path.join(marketplaceRoot, 'leapmultix-dev-tools');

const DEFAULT_VERSION = '1.0.0';
const DEFAULT_AUTHOR = { name: 'LeapMultix Team' };
const MARKETPLACE_INFO = {
  name: 'leapmultix-repo-marketplace',
  owner: { name: 'LeapMultix' },
  schema: 'https://anthropic.com/claude-code/marketplace.schema.json',
};
const PROJECT_LINKS = {
  homepage: 'https://github.com/leapmultix/leapmultix',
  repository: 'https://github.com/leapmultix/leapmultix.git',
  license: 'MIT',
};

const options = parseArgs(process.argv.slice(2));

async function main() {
  await ensurePathExists(sourceRoot, {
    errorMessage: `Source directory not found at ${sourceRoot}. Run from the repository root.`,
  });

  const manifestEntries = [];

  if (needsManualJob(options)) {
    const job = await buildManualJob(options);
    await runJob(job, manifestEntries);
  }

  const profileJobs = await buildProfileJobs(options);
  for (const job of profileJobs) {
    await runJob(job, manifestEntries);
  }

  if (!options['skip-individual']) {
    await syncIndividualComponents(manifestEntries, options);
  }

  await writeMarketplaceManifests(manifestEntries);
  console.log('\nAll syncs complete.');
}

try {
  await main();
} catch (error) {
  console.error(`\nSync failed: ${error.message}`);
  process.exitCode = 1;
}

async function runJob(job, manifestEntries) {
  console.log(`\nSyncing plugin: ${job.label}`);
  await ensureDir(job.pluginRoot);

  const sections = ['commands', 'agents', 'skills'];
  const messages = [];
  for (const section of sections) {
    // eslint-disable-next-line no-await-in-loop -- sequential to keep logs ordered
    await syncSection(section, job.selectionConfig[section], job.pluginRoot, messages);
  }

  await writePluginManifest(job.pluginRoot, job.pluginInfo);
  manifestEntries.push(job.pluginInfo);
  for (const msg of messages) {
    console.log(`- ${msg}`);
  }
}

async function syncSection(section, selection, pluginRoot, messages) {
  const sourceDir = path.join(sourceRoot, section);
  const targetDir = path.join(pluginRoot, section);

  if (!(await pathExists(sourceDir))) {
    messages.push(`${section}: skipped (source directory missing)`);
    await removeIfExists(targetDir);
    return;
  }

  await ensureDir(path.dirname(targetDir));
  await removeIfExists(targetDir);
  if (!selection) {
    await fs.cp(sourceDir, targetDir, { recursive: true });
    const count = await countEntries(targetDir);
    messages.push(`${section}: copied ${count} item${count === 1 ? '' : 's'}`);
    return;
  }

  await ensureDir(targetDir);
  let copied = 0;
  const missing = [];
  for (const entry of selection) {
    // eslint-disable-next-line no-await-in-loop -- deterministic order
    const resolved = await resolveEntry(section, entry, sourceDir);
    if (!resolved) {
      missing.push(entry);
      continue;
    }
    const destinationPath = path.join(targetDir, resolved.relativeName);
    // eslint-disable-next-line no-await-in-loop -- sequential copy
    await copyEntry(resolved.absolutePath, destinationPath);
    copied += 1;
  }

  const baseMessage = `${section}: copied ${copied}/${selection.size} selected item${selection.size === 1 ? '' : 's'}`;
  if (missing.length > 0) {
    messages.push(`${baseMessage} (missing: ${missing.join(', ')})`);
  } else {
    messages.push(baseMessage);
  }
}

async function copyEntry(sourcePath, destinationPath) {
  const stats = await fs.stat(sourcePath);
  await fs.cp(sourcePath, destinationPath, { recursive: stats.isDirectory() });
}

async function resolveEntry(section, entry, sourceDir) {
  const candidates = [entry];
  if (!entry.includes('.') && (section === 'commands' || section === 'agents')) {
    candidates.push(`${entry}.md`);
  }

  for (const candidate of candidates) {
    const candidatePath = path.join(sourceDir, candidate);
    // eslint-disable-next-line no-await-in-loop -- sequential access
    if (await pathExists(candidatePath)) {
      return {
        absolutePath: candidatePath,
        relativeName: candidate,
      };
    }
  }
  return null;
}

async function writePluginManifest(pluginRoot, pluginInfo) {
  const manifestDir = path.join(pluginRoot, '.claude-plugin');
  await ensureDir(manifestDir);
  const manifestPath = path.join(manifestDir, 'plugin.json');
  const payload = {
    name: pluginInfo.name,
    description: pluginInfo.description,
    version: pluginInfo.version ?? DEFAULT_VERSION,
    author: pluginInfo.author ?? DEFAULT_AUTHOR,
    ...PROJECT_LINKS,
  };
  await fs.writeFile(manifestPath, `${JSON.stringify(payload, null, 2)}\n`);
}

async function writeMarketplaceManifests(entries) {
  if (entries.length === 0) {
    console.warn('No plugins were generated; marketplace manifest not updated.');
    return;
  }

  const sortedEntries = entries
    .map(entry => ({
      name: entry.name,
      description: entry.description,
      source: entry.source,
      category: entry.category,
      version: entry.version ?? DEFAULT_VERSION,
      author: entry.author ?? DEFAULT_AUTHOR,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const manifest = {
    $schema: MARKETPLACE_INFO.schema,
    name: MARKETPLACE_INFO.name,
    owner: MARKETPLACE_INFO.owner,
    plugins: sortedEntries,
  };

  const targets = [
    path.join(repoRoot, '.claude-plugin'),
    path.join(marketplaceRoot, '.claude-plugin'),
  ];

  for (const target of targets) {
    // eslint-disable-next-line no-await-in-loop -- sequential for clarity
    await ensureDir(target);
    const manifestPath = path.join(target, 'marketplace.json');
    // eslint-disable-next-line no-await-in-loop -- sequential write is fine
    await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  }
}

async function buildManualJob(opts) {
  const target = path.resolve(repoRoot, opts.target ?? defaultTarget);
  const selectionConfig = buildSelectionConfig(opts);
  const pluginName = opts.name ?? path.basename(target);
  const description = opts.description ?? `Custom plugin bundle generated from ${pluginName}`;
  const category = opts.category ?? 'custom';
  return {
    label: pluginName,
    pluginRoot: target,
    selectionConfig,
    pluginInfo: buildPluginInfo({ pluginName, description, category, pluginRoot: target }),
  };
}

async function buildProfileJobs(opts) {
  const profiles = await loadProfiles();
  const requested = parseListOption(opts.profile) ?? Object.keys(profiles);
  const jobs = [];
  for (const key of requested) {
    const profile = profiles[key];
    if (!profile) {
      throw new Error(`Unknown profile "${key}" in plugin-profiles.json`);
    }
    const pluginRoot = path.resolve(repoRoot, profile.target);
    jobs.push({
      label: profile.label ?? key,
      pluginRoot,
      selectionConfig: buildSelectionConfig(profile),
      pluginInfo: buildPluginInfo({
        pluginName: path.basename(profile.target),
        description: profile.description ?? `Bundle generated from profile ${key}`,
        category: profile.category ?? 'bundle',
        pluginRoot,
      }),
    });
  }
  return jobs;
}

async function loadProfiles() {
  const profilePath = path.join(marketplaceRoot, 'plugin-profiles.json');
  const raw = await fs.readFile(profilePath, 'utf-8');
  return JSON.parse(raw);
}

function buildSelectionConfig(opts) {
  return {
    commands: normalizeSelection(opts.commands),
    agents: normalizeSelection(opts.agents),
    skills: normalizeSelection(opts.skills),
  };
}

function normalizeSelection(value) {
  if (!value || value === '*') {
    return null;
  }
  if (value instanceof Set) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.length > 0 ? new Set(value) : new Set();
  }
  if (typeof value === 'string') {
    const list = parseListOption(value);
    return list ? new Set(list) : null;
  }
  return null;
}

function parseArgs(args) {
  return args.reduce((acc, raw) => {
    const [key, value] = raw.split('=');
    if (!key.startsWith('--')) {
      return acc;
    }
    const normalizedKey = key.slice(2);
    acc[normalizedKey] = value ?? true;
    return acc;
  }, {});
}

function parseListOption(rawValue) {
  if (!rawValue || rawValue === '*') {
    return null;
  }
  return rawValue
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean);
}

function needsManualJob(opts) {
  return (
    Boolean(opts.target && opts.target !== defaultTarget) ||
    typeof opts.commands === 'string' ||
    typeof opts.agents === 'string' ||
    typeof opts.skills === 'string'
  );
}

function buildPluginInfo({ pluginName, description, category, pluginRoot }) {
  return {
    name: pluginName,
    description,
    category,
    source: `./${path.relative(repoRoot, pluginRoot)}`,
    version: DEFAULT_VERSION,
    author: DEFAULT_AUTHOR,
  };
}

async function syncIndividualComponents(manifestEntries, opts) {
  const requestedSections = parseListOption(opts.individual);
  const includeAll = !requestedSections;
  const requestedSet = new Set(requestedSections ?? []);

  const componentConfigs = {
    commands: {
      targetBase: path.join(marketplaceRoot, 'commands'),
      pluginPrefix: 'leapmultix-command',
      category: 'command',
      description: name => `Slash command /${name} from LeapMultix`,
      listItems: listCommandComponents,
      copyItem: copyCommand,
    },
    agents: {
      targetBase: path.join(marketplaceRoot, 'agents'),
      pluginPrefix: 'leapmultix-agent',
      category: 'agent',
      description: name => `Agent ${name} from LeapMultix`,
      listItems: listAgentComponents,
      copyItem: copyAgent,
    },
    skills: {
      targetBase: path.join(marketplaceRoot, 'skills'),
      pluginPrefix: 'leapmultix-skill',
      category: 'skill',
      description: name => `Skill ${name} from LeapMultix`,
      listItems: listSkillComponents,
      copyItem: copySkill,
    },
  };

  for (const [section, config] of Object.entries(componentConfigs)) {
    if (!includeAll && !requestedSet.has(section)) {
      continue;
    }
    const items = await config.listItems();
    if (items.length === 0) {
      continue;
    }

    console.log(`\nSyncing individual ${section}`);
    for (const item of items) {
      const pluginName = `${config.pluginPrefix}-${item.name}`;
      const pluginRoot = path.join(config.targetBase, item.name);
      await ensureDir(pluginRoot);
      await config.copyItem(item, pluginRoot);
      const pluginInfo = buildPluginInfo({
        pluginName,
        description: config.description(item.name),
        category: config.category,
        pluginRoot,
      });
      await writePluginManifest(pluginRoot, pluginInfo);
      manifestEntries.push(pluginInfo);
    }
  }
}

async function listCommandComponents() {
  const commandsDir = path.join(sourceRoot, 'commands');
  if (!(await pathExists(commandsDir))) {
    return [];
  }
  const entries = await fs.readdir(commandsDir, { withFileTypes: true });
  return entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
    .map(entry => ({
      name: removeExtension(entry.name),
      sourceName: entry.name,
    }));
}

async function listAgentComponents() {
  const agentsDir = path.join(sourceRoot, 'agents');
  if (!(await pathExists(agentsDir))) {
    return [];
  }
  const entries = await fs.readdir(agentsDir, { withFileTypes: true });
  return entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
    .map(entry => ({
      name: removeExtension(entry.name),
      sourceName: entry.name,
    }));
}

async function listSkillComponents() {
  const skillsDir = path.join(sourceRoot, 'skills');
  if (!(await pathExists(skillsDir))) {
    return [];
  }
  const entries = await fs.readdir(skillsDir, { withFileTypes: true });
  const skills = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    const skillDir = path.join(skillsDir, entry.name);
    // eslint-disable-next-line no-await-in-loop -- sequential check is fine
    if (await pathExists(path.join(skillDir, 'SKILL.md'))) {
      skills.push({
        name: entry.name,
        sourceName: entry.name,
      });
    }
  }
  return skills;
}

async function copyCommand(item, pluginRoot) {
  const targetDir = path.join(pluginRoot, 'commands');
  await ensureDir(targetDir);
  await removeIfExists(path.join(targetDir, item.sourceName));
  await fs.copyFile(
    path.join(sourceRoot, 'commands', item.sourceName),
    path.join(targetDir, item.sourceName)
  );
}

async function copyAgent(item, pluginRoot) {
  const targetDir = path.join(pluginRoot, 'agents');
  await ensureDir(targetDir);
  await removeIfExists(path.join(targetDir, item.sourceName));
  await fs.copyFile(
    path.join(sourceRoot, 'agents', item.sourceName),
    path.join(targetDir, item.sourceName)
  );
}

async function copySkill(item, pluginRoot) {
  const targetDir = path.join(pluginRoot, 'skills');
  await ensureDir(targetDir);
  await removeIfExists(path.join(targetDir, item.sourceName));
  await fs.cp(
    path.join(sourceRoot, 'skills', item.sourceName),
    path.join(targetDir, item.sourceName),
    { recursive: true }
  );
}

function removeExtension(filename) {
  return filename.replace(/\.[^/.]+$/, '');
}

async function ensurePathExists(targetPath, { errorMessage }) {
  if (!(await pathExists(targetPath))) {
    throw new Error(errorMessage);
  }
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function removeIfExists(targetPath) {
  await fs.rm(targetPath, { recursive: true, force: true });
}

async function pathExists(checkPath) {
  try {
    await fs.access(checkPath);
    return true;
  } catch {
    return false;
  }
}

async function countEntries(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  return entries.length;
}
