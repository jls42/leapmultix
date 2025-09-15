#!/usr/bin/env node
/*
 Generate a conservative list of unused i18n keys across all languages.
 - Scans code for getTranslation('...') and data-translate attributes
 - Compares with assets/translations/{fr,en,es}.json
 - Applies whitelist patterns from assets/translations/whitelist.txt
 - Writes intersection(unused_fr, unused_en, unused_es) to assets/translations/unused_keys.txt
 - Prints a short summary and saves a copy in docs/audit/logs/i18n_unused.out
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
  const outFile = path.join(transDir, 'unused_keys.txt');
  const logDir = path.join(root, 'docs', 'audit', 'logs');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

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

  function computeUnused(lang) {
    const unused = new Set();
    for (const k of keys[lang]) {
      if (matchWhitelist(k, whitelist)) continue;
      if (!used.has(k)) unused.add(k);
    }
    return unused;
  }

  const unusedFR = computeUnused('fr');
  const unusedEN = computeUnused('en');
  const unusedES = computeUnused('es');

  // Intersection across languages for extra safety
  const intersection = [...unusedFR]
    .filter(k => unusedEN.has(k) && unusedES.has(k))
    .sort((a, b) => a.localeCompare(b));

  fs.writeFileSync(outFile, intersection.join('\n') + (intersection.length ? '\n' : ''), 'utf8');

  const summary = `i18n-unused summary\nFR-unused=${unusedFR.size} EN-unused=${unusedEN.size} ES-unused=${unusedES.size}\nIntersection (written to unused_keys.txt) = ${intersection.length}`;
  fs.writeFileSync(path.join(logDir, 'i18n_unused.out'), summary + '\n', 'utf8');
  console.log(summary);
  console.log(`Wrote ${outFile}`);
}

main();
