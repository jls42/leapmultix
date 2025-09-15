#!/usr/bin/env node
/*
 i18n-verify: scans code for getTranslation('...') and compares with assets/translations/*.json
 Outputs:
 - Missing keys per language
 - Unused keys per language (static heuristic)
 - Summary counts; exit 0 by default (use --strict to exit 1 on issues)
*/
const fs = require('fs');
const path = require('path');

function walk(dir, pred = () => true, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, pred, out);
    else if (pred(full)) out.push(full);
  }
  return out;
}

function loadJSON(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function keysOf(obj, prefix = '') {
  const out = [];
  if (!obj || typeof obj !== 'object') return out;
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) out.push(...keysOf(v, key));
    else out.push(key);
  }
  return out;
}

function loadWhitelist(p) {
  const list = new Set();
  if (!fs.existsSync(p)) return list;
  const lines = fs
    .readFileSync(p, 'utf8')
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(Boolean);
  for (const line of lines) list.add(line);
  return list;
}

function matchWhitelist(key, wl) {
  if (!wl || wl.size === 0) return false;
  if (wl.has(key)) return true;
  for (const pat of wl) {
    if (pat.endsWith('*')) {
      const pref = pat.slice(0, -1);
      if (key.startsWith(pref)) return true;
    }
  }
  return false;
}

function main() {
  const root = process.cwd();
  const transDir = path.join(root, 'assets', 'translations');
  const fr = loadJSON(path.join(transDir, 'fr.json')) || {};
  const en = loadJSON(path.join(transDir, 'en.json')) || {};
  const es = loadJSON(path.join(transDir, 'es.json')) || {};
  const keys = {
    fr: new Set(keysOf(fr)),
    en: new Set(keysOf(en)),
    es: new Set(keysOf(es)),
  };

  const codeFiles = [
    ...walk(path.join(root, 'js'), f => /\.(mjs|js|cjs)$/.test(f)),
    path.join(root, 'index.html'),
  ].filter(fs.existsSync);

  const used = new Set();
  const dataTranslateUsed = new Set();
  for (const f of codeFiles) {
    const src = fs.readFileSync(f, 'utf8');
    // getTranslation('key')
    const re = /getTranslation\(\s*'([^']+)'\s*\)/g;
    let m;
    while ((m = re.exec(src))) used.add(m[1]);
    // data-translate="key"
    const reDT = /data-translate\s*=\s*"([^"]+)"/g;
    while ((m = reDT.exec(src))) dataTranslateUsed.add(m[1]);
  }
  for (const k of dataTranslateUsed) used.add(k);

  const whitelist = loadWhitelist(path.join(transDir, 'whitelist.txt'));

  function computeMissing(lang) {
    const missing = [];
    for (const k of used) {
      if (matchWhitelist(k, whitelist)) continue;
      if (!keys[lang].has(k)) missing.push(k);
    }
    return missing.sort((a, b) => a.localeCompare(b));
  }
  function computeUnused(lang) {
    const unused = [];
    for (const k of keys[lang]) {
      if (matchWhitelist(k, whitelist)) continue;
      if (!used.has(k)) unused.push(k);
    }
    return unused.sort((a, b) => a.localeCompare(b));
  }

  const missing = { fr: computeMissing('fr'), en: computeMissing('en'), es: computeMissing('es') };
  const unused = { fr: computeUnused('fr'), en: computeUnused('en'), es: computeUnused('es') };

  function print(lang) {
    console.log(`== ${lang.toUpperCase()} ==`);
    console.log(`Missing: ${missing[lang].length}`);
    if (missing[lang].length) console.log(missing[lang].slice(0, 50).join('\n'));
    console.log(`Unused: ${unused[lang].length}`);
    if (unused[lang].length) console.log(unused[lang].slice(0, 50).join('\n'));
  }
  print('fr');
  print('en');
  print('es');

  const strict = process.argv.includes('--strict');
  const issues =
    missing.fr.length +
    missing.en.length +
    missing.es.length +
    unused.fr.length +
    unused.en.length +
    unused.es.length;
  process.exit(strict && issues ? 1 : 0);
}

main();
