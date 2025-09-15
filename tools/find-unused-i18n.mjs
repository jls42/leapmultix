#!/usr/bin/env node
/*
 * Simple i18n unused keys detector (non-destructive)
 * - Scans JS/HTML for getTranslation('key') and data-translate attributes
 * - Detects template prefixes like getTranslation(`character_intro_${...}`)
 * - Flattens translation JSON and compares to used keys/prefixes
 * - Writes report to assets/translations/unused_keys.txt
 */
import fs from 'fs';
import path from 'path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const translationsDir = path.join(root, 'assets', 'translations');
const keepConfigPath = path.join(translationsDir, 'i18n-keep.json');
// codeDirs definition moved inline where it's used

function readJSON(fp) {
  // eslint-disable-next-line -- fp is controlled file path for translation JSON files
  return JSON.parse(fs.readFileSync(fp, 'utf8'));
}

function flatten(obj, prefix = '') {
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(out, flatten(v, key));
    } else {
      // eslint-disable-next-line -- key is constructed from object property names, not user input
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
    // eslint-disable-next-line -- d is from controlled directory stack
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
    // eslint-disable-next-line -- file is from controlled directory traversal
    return fs.readFileSync(file, 'utf8');
  } catch {
    return '';
  }
}

function extractKeysFromContent(src, used, dynPrefixes) {
  const regexes = {
    attr: /data-translate(?:-title|-placeholder|-aria-label|-value)?\s*=\s*(["'])(.*?)\1/g,
    call: /getTranslation\(\s*(['"])(.*?)\1\s*[),]/g,
    tmpl: /getTranslation\(\s*`([^`]+)`\s*(?:,|\))/g,
    arcadeMsg: /showArcadeMessage\(\s*(["'])(.*?)\1/g,
    // eslint-disable-next-line -- Regex for extracting i18n translation keys, controlled pattern not user input
    keyLike: /(["'])([a-z][a-z0-9_]*(?:\.[a-z0-9_]+)+)\1/gi,
  };

  // Extract direct attribute keys
  for (const m of src.matchAll(regexes.attr)) {
    if (m[2]) used.add(m[2]);
  }

  // Extract direct call keys
  for (const m of src.matchAll(regexes.call)) {
    if (m[2]) used.add(m[2]);
  }

  // Extract template prefixes
  for (const m of src.matchAll(regexes.tmpl)) {
    const inner = m[1];
    const idx = inner.indexOf('${');
    if (idx > 0) {
      const prefix = inner.slice(0, idx);
      if (prefix) dynPrefixes.add(prefix);
    }
  }

  // Extract arcade message keys
  for (const m of src.matchAll(regexes.arcadeMsg)) {
    if (m[2]) used.add(m[2]);
  }

  // Extract key-like strings
  for (const m of src.matchAll(regexes.keyLike)) {
    if (m[2]) used.add(m[2]);
  }
}

function extractAvatarKeys(used) {
  const avatarListRegex = /AVATAR_LIST\s*=\s*\[([^\]]+)\]/m;
  const src = readFileContent(path.join(root, 'js', 'main-helpers.js'));
  if (!src) return;

  const m = src.match(avatarListRegex);
  if (m) {
    const items = m[1].match(/['"]([a-zA-Z0-9_-]+)['"]/g) || [];
    for (const it of items) {
      const id = it.replace(/^(['"])|(["'])$/g, '');
      if (id) used.add(id);
    }
  }
}

function extractCharacterNames(files, used) {
  const avatarNames = ['fox', 'panda', 'unicorn', 'dragon', 'astronaut'];

  for (const file of files) {
    const src = readFileContent(file);
    if (!src) continue;

    const renderAvatarMatch = src.match(/renderAvatarSelector[\s\S]*?getTranslation\(([^)]+)\)/);
    if (renderAvatarMatch) {
      avatarNames.forEach(name => used.add(name));
      break; // Only need to find this pattern once
    }
  }
}

function collectUsedKeys() {
  const files = [...listFiles(path.join(root, 'js')), path.join(root, 'index.html')].filter(
    fs.existsSync
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

function main() {
  const langs = ['fr', 'en', 'es'];
  const allKeys = new Set();
  const perLangFlat = {};
  for (const lang of langs) {
    const fp = path.join(translationsDir, `${lang}.json`);
    const flat = flatten(readJSON(fp));
    perLangFlat[lang] = flat;
    Object.keys(flat).forEach(k => allKeys.add(k));
  }

  const { used, dynPrefixes } = collectUsedKeys();

  // Hardcode dynamic mode-derived keys used via concatenation
  const modes = ['discovery', 'quiz', 'challenge', 'adventure', 'arcade'];
  for (const m of modes) {
    used.add(`${m}_info_bar_label`);
    used.add(`${m}_mode`);
  }

  // Extract level name/desc keys from AdventureMode configuration
  try {
    // eslint-disable-next-line -- path is constructed from known root and fixed file path
    const advSrc = fs.readFileSync(path.join(root, 'js', 'modes', 'AdventureMode.js'), 'utf8');
    const nameKeys = advSrc.match(/nameKey:\s*['"]([^'"]+)['"]/g) || [];
    const descKeys = advSrc.match(/descKey:\s*['"]([^'"]+)['"]/g) || [];
    const pull = arr => arr.map(s => (s.match(/['"]([^'"]+)['"]/) || [])[1]).filter(Boolean);
    [...pull(nameKeys), ...pull(descKeys)].forEach(k => used.add(k));
  } catch {
    // Ignore if AdventureMode.js file not found or parsing fails
  }

  // Extract name/desc keys from ArcadeMode availableGames
  try {
    // eslint-disable-next-line -- path is constructed from known root and fixed file path
    const arcSrc = fs.readFileSync(path.join(root, 'js', 'modes', 'ArcadeMode.js'), 'utf8');
    const nameKeys = arcSrc.match(/nameKey:\s*['"]([^'"]+)['"]/g) || [];
    const descKeys = arcSrc.match(/descKey:\s*['"]([^'"]+)['"]/g) || [];
    const pull = arr => arr.map(s => (s.match(/['"]([^'"]+)['"]/) || [])[1]).filter(Boolean);
    [...pull(nameKeys), ...pull(descKeys)].forEach(k => used.add(k));
  } catch {
    // Ignore if ArcadeMode.js file not found or parsing fails
  }

  const isUsed = key => {
    if (used.has(key)) return true;
    for (const pfx of dynPrefixes) {
      if (key.startsWith(pfx)) return true;
    }
    return false;
  };

  // Apply keep/allowlist config (prefixes, regexes, explicit keys)
  const keepDefaults = {
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
      '^level_\\d+_(name|desc)$',
      '^(discovery|quiz|challenge|adventure|arcade)_info_bar_label$',
      '^(discovery|quiz|challenge|adventure|arcade)_mode$',
      '^color_theme_.*$',
      '^info_(score|lives|progress|streak|time|bonus)_label$',
    ],
  };
  let keep = keepDefaults;
  try {
    // eslint-disable-next-line -- keepConfigPath is constructed from known paths
    const loaded = JSON.parse(fs.readFileSync(keepConfigPath, 'utf8'));
    // Merge with defaults to be safe
    keep = {
      keys: Array.from(new Set([...(loaded.keys || []), ...keepDefaults.keys])),
      prefixes: Array.from(new Set([...(loaded.prefixes || []), ...keepDefaults.prefixes])),
      regexes: Array.from(new Set([...(loaded.regexes || []), ...keepDefaults.regexes])),
    };
  } catch {
    // Ignore if keep config file not found or parsing fails, use defaults
  }
  // eslint-disable-next-line -- regexes are from configuration file, not user input
  const keepRegexes = (keep.regexes || []).map(r => new RegExp(r));
  const inKeep = key => {
    if ((keep.keys || []).includes(key)) return true;
    if ((keep.prefixes || []).some(p => key.startsWith(p))) return true;
    if (keepRegexes.some(re => re.test(key))) return true;
    return false;
  };

  // Treat explicit keep.keys as used to prevent deletion proposals
  (keep.keys || []).forEach(k => used.add(k));

  const unused = Array.from(allKeys)
    .filter(k => !isUsed(k) && !inKeep(k))
    .sort();

  const reportPath = path.join(translationsDir, 'unused_keys.txt');
  // eslint-disable-next-line -- reportPath is constructed from translationsDir
  fs.writeFileSync(reportPath, unused.join('\n') + '\n', 'utf8');

  console.log(`Scanned ${used.size} direct keys, ${dynPrefixes.size} dynamic prefixes.`);
  console.log(`Total keys: ${allKeys.size}. Unused: ${unused.length}.`);
  console.log(`Updated: ${path.relative(root, reportPath)}`);
}

main();
