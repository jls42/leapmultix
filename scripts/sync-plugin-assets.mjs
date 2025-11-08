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
  const safePluginRoot = ensurePathWithinRepo(job.pluginRoot, 'plugin output directory');
  await ensureDir(safePluginRoot);

  const sections = ['commands', 'agents', 'skills'];
  const messages = [];
  for (const section of sections) {
    const selection = getSectionSelection(job.selectionConfig, section);
    // eslint-disable-next-line no-await-in-loop -- sequential to keep logs ordered
    await syncSection(section, selection, safePluginRoot, messages);
  }

  await writePluginManifest(safePluginRoot, job.pluginInfo);
  manifestEntries.push(job.pluginInfo);
  for (const msg of messages) {
    console.log(`- ${msg}`);
  }
}

async function syncSection(section, selection, pluginRoot, messages) {
  const sourceDir = ensurePathWithinBase(
    path.join(sourceRoot, section),
    sourceRoot,
    `${section} source`
  );
  const targetDir = ensurePathWithinBase(
    path.join(pluginRoot, section),
    pluginRoot,
    `${section} target`
  );

  if (!(await pathExists(sourceDir))) {
    messages.push(`${section}: skipped (source directory missing)`);
    await removeIfExists(targetDir);
    return;
  }

  await ensureDir(path.dirname(targetDir));
  await removeIfExists(targetDir);
  if (!selection) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- source/target sanitized via ensurePathWithinBase
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
    const destinationPath = ensurePathWithinBase(
      path.join(targetDir, resolved.relativeName),
      targetDir,
      `${section} destination`
    );
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
  const safeSource = ensurePathWithinRepo(sourcePath, 'copy source');
  const safeDestination = ensurePathWithinRepo(destinationPath, 'copy destination');
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- path sanitized via ensurePathWithinRepo
  const stats = await fs.stat(safeSource);
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- destination sanitized via ensurePathWithinRepo
  await fs.cp(safeSource, safeDestination, { recursive: stats.isDirectory() });
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
  const manifestDir = ensurePathWithinBase(
    path.join(pluginRoot, '.claude-plugin'),
    pluginRoot,
    'plugin manifest dir'
  );
  await ensureDir(manifestDir);
  const manifestPath = ensurePathWithinBase(
    path.join(manifestDir, 'plugin.json'),
    manifestDir,
    'plugin manifest'
  );
  const payload = {
    name: pluginInfo.name,
    description: pluginInfo.description,
    version: pluginInfo.version ?? DEFAULT_VERSION,
    author: pluginInfo.author ?? DEFAULT_AUTHOR,
    ...PROJECT_LINKS,
  };
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- manifestPath sanitized via ensurePathWithinBase
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
    ensurePathWithinRepo(path.join(repoRoot, '.claude-plugin'), 'root marketplace manifest'),
    ensurePathWithinRepo(
      path.join(marketplaceRoot, '.claude-plugin'),
      'local marketplace manifest',
      marketplaceRoot
    ),
  ];

  for (const target of targets) {
    // eslint-disable-next-line no-await-in-loop -- sequential for clarity
    await ensureDir(target);
    const manifestPath = ensurePathWithinRepo(
      path.join(target, 'marketplace.json'),
      'marketplace manifest'
    );
    // eslint-disable-next-line no-await-in-loop -- sequential write is fine
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- manifestPath sanitized via ensurePathWithinRepo
    await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  }
}

async function buildManualJob(opts) {
  const target = ensurePathWithinRepo(
    path.resolve(repoRoot, opts.target ?? defaultTarget),
    'manual plugin target'
  );
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
  const profileEntries = Object.entries(profiles);
  const requested = parseListOption(opts.profile) ?? Object.keys(profiles);
  const jobs = [];
  for (const key of requested) {
    const profile = profileEntries.find(([name]) => name === key)?.[1];
    if (!profile) {
      throw new Error(`Unknown profile "${key}" in plugin-profiles.json`);
    }
    const pluginRoot = ensurePathWithinRepo(
      path.resolve(repoRoot, profile.target),
      'profile plugin target'
    );
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
  const profilePath = ensurePathWithinRepo(
    path.join(marketplaceRoot, 'plugin-profiles.json'),
    'plugin profile manifest'
  );
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- profilePath sanitized via ensurePathWithinRepo
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

function getSectionSelection(selectionConfig, section) {
  switch (section) {
    case 'commands':
      return selectionConfig.commands;
    case 'agents':
      return selectionConfig.agents;
    case 'skills':
      return selectionConfig.skills;
    default:
      return null;
  }
}

function parseArgs(args) {
  return args.reduce((acc, raw) => {
    const [key, value] = raw.split('=');
    if (!key.startsWith('--')) {
      return acc;
    }
    const normalizedKey = key.slice(2);
    // eslint-disable-next-line security/detect-object-injection -- CLI options limited to predefined flags
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
      targetBase: ensurePathWithinRepo(
        path.join(marketplaceRoot, 'commands'),
        'commands plugins base'
      ),
      pluginPrefix: 'leapmultix-command',
      category: 'command',
      description: name => `Slash command /${name} from LeapMultix`,
      listItems: listCommandComponents,
      copyItem: copyCommand,
    },
    agents: {
      targetBase: ensurePathWithinRepo(path.join(marketplaceRoot, 'agents'), 'agents plugins base'),
      pluginPrefix: 'leapmultix-agent',
      category: 'agent',
      description: name => `Agent ${name} from LeapMultix`,
      listItems: listAgentComponents,
      copyItem: copyAgent,
    },
    skills: {
      targetBase: ensurePathWithinRepo(path.join(marketplaceRoot, 'skills'), 'skills plugins base'),
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
    let items;
    try {
      items = await config.listItems();
    } catch (error) {
      throw new Error(`Failed to list ${section} components: ${error.message}`);
    }
    if (items.length === 0) {
      continue;
    }

    console.log(`\nSyncing individual ${section}`);
    for (const item of items) {
      try {
        const pluginName = `${config.pluginPrefix}-${item.name}`;
        const pluginRoot = ensurePathWithinRepo(
          path.join(config.targetBase, item.name),
          `${section} plugin root`
        );
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
      } catch (error) {
        throw new Error(`Failed to sync ${section} plugin ${item.name}: ${error.message}`);
      }
    }
  }
}

async function listCommandComponents() {
  const commandsDir = ensurePathWithinBase(
    path.join(sourceRoot, 'commands'),
    sourceRoot,
    'commands dir'
  );
  if (!(await pathExists(commandsDir))) {
    return [];
  }
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- commandsDir sanitized via ensurePathWithinBase
    const entries = await fs.readdir(commandsDir, { withFileTypes: true });
    return entries
      .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
      .map(entry => ({
        name: removeExtension(entry.name),
        sourceName: entry.name,
      }));
  } catch (error) {
    throw new Error(`Failed to list command components: ${error.message}`);
  }
}

async function listAgentComponents() {
  const agentsDir = ensurePathWithinBase(path.join(sourceRoot, 'agents'), sourceRoot, 'agents dir');
  if (!(await pathExists(agentsDir))) {
    return [];
  }
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- agentsDir sanitized via ensurePathWithinBase
    const entries = await fs.readdir(agentsDir, { withFileTypes: true });
    return entries
      .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
      .map(entry => ({
        name: removeExtension(entry.name),
        sourceName: entry.name,
      }));
  } catch (error) {
    throw new Error(`Failed to list agent components: ${error.message}`);
  }
}

async function listSkillComponents() {
  const skillsDir = ensurePathWithinBase(path.join(sourceRoot, 'skills'), sourceRoot, 'skills dir');
  if (!(await pathExists(skillsDir))) {
    return [];
  }
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- skillsDir sanitized via ensurePathWithinBase
    const entries = await fs.readdir(skillsDir, { withFileTypes: true });
    const skills = [];
    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }
      const skillDir = ensurePathWithinBase(
        path.join(skillsDir, entry.name),
        skillsDir,
        'skill directory'
      );
      // eslint-disable-next-line no-await-in-loop -- sequential check is fine
      if (await pathExists(path.join(skillDir, 'SKILL.md'))) {
        skills.push({
          name: entry.name,
          sourceName: entry.name,
        });
      }
    }
    return skills;
  } catch (error) {
    throw new Error(`Failed to list skill components: ${error.message}`);
  }
}

async function copyCommand(item, pluginRoot) {
  const targetDir = ensurePathWithinBase(
    path.join(pluginRoot, 'commands'),
    pluginRoot,
    'commands target'
  );
  await ensureDir(targetDir);
  const destinationPath = ensurePathWithinBase(
    path.join(targetDir, item.sourceName),
    targetDir,
    'command destination file'
  );
  await removeIfExists(destinationPath);
  const sourcePath = ensurePathWithinBase(
    path.join(sourceRoot, 'commands', item.sourceName),
    sourceRoot,
    'command source file'
  );
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- paths sanitized via ensurePathWithinBase
  await fs.copyFile(sourcePath, destinationPath);
}

async function copyAgent(item, pluginRoot) {
  const targetDir = ensurePathWithinBase(
    path.join(pluginRoot, 'agents'),
    pluginRoot,
    'agents target'
  );
  await ensureDir(targetDir);
  const destinationPath = ensurePathWithinBase(
    path.join(targetDir, item.sourceName),
    targetDir,
    'agent destination file'
  );
  await removeIfExists(destinationPath);
  const sourcePath = ensurePathWithinBase(
    path.join(sourceRoot, 'agents', item.sourceName),
    sourceRoot,
    'agent source file'
  );
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- paths sanitized via ensurePathWithinBase
  await fs.copyFile(sourcePath, destinationPath);
}

async function copySkill(item, pluginRoot) {
  const targetDir = ensurePathWithinBase(
    path.join(pluginRoot, 'skills'),
    pluginRoot,
    'skills target'
  );
  await ensureDir(targetDir);
  const destinationPath = ensurePathWithinBase(
    path.join(targetDir, item.sourceName),
    targetDir,
    'skill destination dir'
  );
  await removeIfExists(destinationPath);
  const sourcePath = ensurePathWithinBase(
    path.join(sourceRoot, 'skills', item.sourceName),
    sourceRoot,
    'skill source dir'
  );
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- paths sanitized via ensurePathWithinBase
  await fs.cp(sourcePath, destinationPath, { recursive: true });
}

function removeExtension(filename) {
  return filename.replace(/\.[^/.]+$/, '');
}

async function ensurePathExists(targetPath, { errorMessage }) {
  let exists;
  try {
    exists = await pathExists(targetPath);
  } catch (error) {
    throw new Error(`${errorMessage}: ${error.message}`);
  }

  if (!exists) {
    throw new Error(errorMessage);
  }
}

async function ensureDir(dirPath) {
  const safeDirPath = ensurePathWithinRepo(dirPath, 'directory creation');
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- path sanitized via ensurePathWithinRepo
  await fs.mkdir(safeDirPath, { recursive: true });
}

async function removeIfExists(targetPath) {
  const safeTarget = ensurePathWithinRepo(targetPath, 'removal target');
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- path sanitized via ensurePathWithinRepo
  await fs.rm(safeTarget, { recursive: true, force: true });
}

async function pathExists(checkPath) {
  let safePath;
  try {
    safePath = ensurePathWithinRepo(checkPath, 'path access');
  } catch (error) {
    throw new Error(`Cannot access ${checkPath}: ${error.message}`);
  }
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- path sanitized via ensurePathWithinRepo
    await fs.access(safePath);
    return true;
  } catch (error) {
    if (error?.code === 'ENOENT' || error?.code === 'ENOTDIR') {
      return false;
    }
    throw new Error(`Unable to access ${safePath}: ${error.message}`);
  }
}

async function countEntries(dirPath) {
  const safeDirPath = ensurePathWithinRepo(dirPath, 'directory listing');
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- safeDirPath sanitized via ensurePathWithinRepo
  const entries = await fs.readdir(safeDirPath, { withFileTypes: true });
  return entries.length;
}

function ensurePathWithinRepo(targetPath, description, base = repoRoot) {
  return ensurePathWithinBase(targetPath, base, description);
}

function ensurePathWithinBase(targetPath, base, description) {
  const resolved = path.resolve(targetPath);
  const normalizedBase = path.resolve(base);
  if (resolved === normalizedBase || resolved.startsWith(`${normalizedBase}${path.sep}`)) {
    return resolved;
  }
  throw new Error(
    `Refusing to access ${description ?? 'path'} outside ${normalizedBase}: ${resolved}`
  );
}
