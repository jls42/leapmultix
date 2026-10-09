#!/usr/bin/env node
/*
 * Simple i18n unused keys detector (non-destructive)
 * - Scans JS/HTML for getTranslation('key') and data-translate attributes
 * - Detects template prefixes like getTranslation(`character_intro_${...}`)
 * - Flattens translation JSON and compares to used keys/prefixes
 * - Writes report to assets/translations/unused_keys.txt
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const translationsDir = path.join(root, 'assets', 'translations');
const keepConfigPath = path.join(translationsDir, 'i18n-keep.json');
// codeDirs definition moved inline where it's used

function readJSON(fp) {
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- fp is controlled file path for translation JSON files
  return JSON.parse(fs.readFileSync(fp, 'utf8'));
}

function flatten(obj, prefix = '') {
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(out, flatten(v, key));
    } else {
      // eslint-disable-next-line security/detect-object-injection -- key is constructed from object property names, not user input
      out[key] = v;
    }
  }
  return out;
}

function listFiles(dir) {
  const res = [];
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- d is from controlled directory stack
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) stack.push(p);
      else if (/\.(js|mjs|cjs|html)$/i.test(e.name)) res.push(p);
    }
  }
  return res;
}

function readFileContent(file) {
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- file is from controlled directory traversal
    return fs.readFileSync(file, 'utf8');
  } catch {
    return '';
  }
}

// Patterns whose second group is a translation key
const KEY_PATTERNS = [
  /data-translate(?:-title|-placeholder|-aria-label|-value)?\s*=\s*(["'])(.*?)\1/g, // data-translate attributes
  /getTranslation\(\s*(['"])(.*?)\1\s*[),]/g, // direct calls
  /showArcadeMessage\(\s*(["'])(.*?)\1/g, // arcade messages
  // eslint-disable-next-line security/detect-unsafe-regex -- Regex for extracting i18n translation keys, controlled pattern not user input
  /(["'])([a-z][a-z0-9_]*(?:\.[a-z0-9_]+)+)\1/gi, // key-like strings
];
// Template call getTranslation(`prefix_${…}`): the prefix covers every key starting with it
const TEMPLATE_CALL = /getTranslation\(\s*`([^`]+)`\s*[,)]/g;

function addMatchedKeys(src, pattern, used) {
  for (const m of src.matchAll(pattern)) {
    if (m[2]) used.add(m[2]);
  }
}

function addTemplatePrefixes(src, dynPrefixes) {
  for (const m of src.matchAll(TEMPLATE_CALL)) {
    const idx = m[1].indexOf('${');
    if (idx > 0) dynPrefixes.add(m[1].slice(0, idx));
  }
}

function extractKeysFromContent(src, used, dynPrefixes) {
  KEY_PATTERNS.forEach(pattern => addMatchedKeys(src, pattern, used));
  addTemplatePrefixes(src, dynPrefixes);
}

function extractAvatarKeys(used) {
  const avatarListRegex = /AVATAR_LIST\s*=\s*\[([^\]]+)\]/m;
  const src = readFileContent(path.join(root, 'js', 'main-helpers.js'));
  if (!src) return;

  const m = avatarListRegex.exec(src);
  if (m) {
    const items = m[1].match(/['"]([a-zA-Z0-9_-]+)['"]/g) || [];
    for (const it of items) {
      const id = it.replaceAll(/(^['"])|(['"]$)/g, '');
      if (id) used.add(id);
    }
  }
}

function extractCharacterNames(files, used) {
  const avatarNames = ['fox', 'panda', 'unicorn', 'dragon', 'astronaut'];

  for (const file of files) {
    const src = readFileContent(file);
    if (!src) continue;

    const renderAvatarMatch = /renderAvatarSelector[\s\S]*?getTranslation\(([^)]+)\)/.exec(src);
    if (renderAvatarMatch) {
      avatarNames.forEach(name => used.add(name));
      break; // Only need to find this pattern once
    }
  }
}

function collectUsedKeys() {
  const files = [...listFiles(path.join(root, 'js')), path.join(root, 'index.html')].filter(f =>
    fs.existsSync(f)
  );
  const used = new Set();
  const dynPrefixes = new Set();

  // Process all files for translation keys
  for (const file of files) {
    const src = readFileContent(file);
    if (src) {
      extractKeysFromContent(src, used, dynPrefixes);
    }
  }

  // Extract avatar-related keys
  extractAvatarKeys(used);

  // Extract character names used in avatar selector
  extractCharacterNames(files, used);

  return { used, dynPrefixes };
}

// Default keep/allowlist, merged with assets/translations/i18n-keep.json
const KEEP_DEFAULTS = {
  keys: [
    'fox',
    'panda',
    'unicorn',
    'dragon',
    'astronaut',
    'voice_toggle_on',
    'voice_toggle_off',
    'arcade_try_again',
    'multimiam_new_ghost',
  ],
  prefixes: [
    'character_intro_',
    'mnemonic_',
    'badge_',
    'arcade.controls.',
    'arcade.multiMemory.',
    'arcade.multiMiam.',
  ],
  regexes: [
    String.raw`^level_\d+_(name|desc)$`,
    '^(discovery|quiz|challenge|adventure|arcade)_info_bar_label$',
    '^(discovery|quiz|challenge|adventure|arcade)_mode$',
    '^color_theme_.*$',
    '^info_(score|lives|progress|streak|time|bonus)_label$',
  ],
};

/** All keys of the translation files, flattened */
function collectAllKeys() {
  const allKeys = new Set();
  for (const lang of ['fr', 'en', 'es']) {
    const flat = flatten(readJSON(path.join(translationsDir, `${lang}.json`)));
    Object.keys(flat).forEach(k => allKeys.add(k));
  }
  return allKeys;
}

/** Quoted value of each `nameKey: 'value'` match */
function quotedValues(matches) {
  return matches.map(s => /['"]([^'"]+)['"]/.exec(s)?.[1]).filter(Boolean);
}

/** Name/desc keys declared in a mode configuration (nameKey, descKey) */
function addModeConfigKeys(file, used) {
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- file is AdventureMode.js or ArcadeMode.js, fixed paths under js/modes
    const src = fs.readFileSync(file, 'utf8');
    const nameKeys = src.match(/nameKey:\s*['"]([^'"]+)['"]/g) || [];
    const descKeys = src.match(/descKey:\s*['"]([^'"]+)['"]/g) || [];
    [...quotedValues(nameKeys), ...quotedValues(descKeys)].forEach(k => used.add(k));
  } catch {
    // Ignore if the mode file is not found or parsing fails
  }
}

/**
 * Keep/allowlist config of the repository (keys, prefixes, regexes), merged with the defaults
 * @returns {{keys: string[], prefixes: string[], regexes: string[]}}
 */
function loadKeepConfig() {
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- keepConfigPath is constructed from known paths
    const loaded = JSON.parse(fs.readFileSync(keepConfigPath, 'utf8'));
    // Merge with defaults to be safe
    return {
      keys: Array.from(new Set([...(loaded.keys || []), ...KEEP_DEFAULTS.keys])),
      prefixes: Array.from(new Set([...(loaded.prefixes || []), ...KEEP_DEFAULTS.prefixes])),
      regexes: Array.from(new Set([...(loaded.regexes || []), ...KEEP_DEFAULTS.regexes])),
    };
  } catch {
    // Ignore if keep config file not found or parsing fails, use defaults
    return KEEP_DEFAULTS;
  }
}

/** Kept-key predicate: explicit key, prefix or regex of the keep config */
function keepPredicate(keep) {
  // eslint-disable-next-line security/detect-non-literal-regexp -- regexes are from configuration file, not user input
  const keepRegexes = (keep.regexes || []).map(r => new RegExp(r));
  return key =>
    (keep.keys || []).includes(key) ||
    (keep.prefixes || []).some(p => key.startsWith(p)) ||
    keepRegexes.some(re => re.test(key));
}

/** Key quoted as is in the code, or starting with a template prefix */
function isUsedKey(key, used, dynPrefixes) {
  if (used.has(key)) return true;
  for (const pfx of dynPrefixes) {
    if (key.startsWith(pfx)) return true;
  }
  return false;
}

function main() {
  const allKeys = collectAllKeys();
  const { used, dynPrefixes } = collectUsedKeys();

  // Hardcode dynamic mode-derived keys used via concatenation
  const modes = ['discovery', 'quiz', 'challenge', 'adventure', 'arcade', 'chrono'];
  for (const m of modes) {
    used.add(`${m}_info_bar_label`);
    used.add(`${m}_mode`);
  }

  // Level name/desc keys from AdventureMode, game name/desc keys from ArcadeMode availableGames
  addModeConfigKeys(path.join(root, 'js', 'modes', 'AdventureMode.js'), used);
  addModeConfigKeys(path.join(root, 'js', 'modes', 'ArcadeMode.js'), used);

  // Apply keep/allowlist config (prefixes, regexes, explicit keys)
  const keep = loadKeepConfig();
  const inKeep = keepPredicate(keep);

  // Treat explicit keep.keys as used to prevent deletion proposals
  (keep.keys || []).forEach(k => used.add(k));

  const unused = Array.from(allKeys)
    .filter(k => !isUsedKey(k, used, dynPrefixes) && !inKeep(k))
    .sort((a, b) => a.localeCompare(b));

  const reportPath = path.join(translationsDir, 'unused_keys.txt');
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- reportPath is constructed from translationsDir
  fs.writeFileSync(reportPath, unused.join('\n') + '\n', 'utf8');

  console.log(`Scanned ${used.size} direct keys, ${dynPrefixes.size} dynamic prefixes.`);
  console.log(`Total keys: ${allKeys.size}. Unused: ${unused.length}.`);
  console.log(`Updated: ${path.relative(root, reportPath)}`);
}

main();
