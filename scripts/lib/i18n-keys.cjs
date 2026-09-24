/*
 Lecture partagée des clés i18n (i18n-verify.cjs, i18n-generate-unused.cjs) :
 clés des fichiers de traduction, clés utilisées par le code, liste blanche.
*/
const fs = require('node:fs');
const path = require('node:path');

const LANGS = ['fr', 'en', 'es'];

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

/**
 * Clés de chaque fichier de traduction.
 * @param {string} transDir - assets/translations
 * @returns {{fr: Set<string>, en: Set<string>, es: Set<string>}}
 */
function loadTranslationKeys(transDir) {
  const keys = {};
  for (const lang of LANGS) {
    keys[lang] = new Set(keysOf(loadJSON(path.join(transDir, `${lang}.json`)) || {}));
  }
  return keys;
}

/**
 * Clés citées par le code : getTranslation('clé') dans js/, data-translate="clé"
 * dans js/ et index.html.
 * @param {string} root - Racine du projet
 * @returns {Set<string>}
 */
function collectUsedKeys(root) {
  const codeFiles = [
    ...walk(path.join(root, 'js'), f => /\.(mjs|js|cjs)$/.test(f)),
    path.join(root, 'index.html'),
  ].filter(f => fs.existsSync(f));

  const used = new Set();
  for (const f of codeFiles) {
    const src = fs.readFileSync(f, 'utf8');
    for (const m of src.matchAll(/getTranslation\(\s*'([^']+)'\s*\)/g)) used.add(m[1]);
    // Une clé interpolée (`data-translate="${key}"` dans un gabarit) n'est connue qu'à l'exécution
    for (const m of src.matchAll(/data-translate\s*=\s*"([^"]+)"/g)) {
      if (!m[1].includes('${')) used.add(m[1]);
    }
  }
  return used;
}

function loadWhitelist(p) {
  if (!fs.existsSync(p)) return new Set();
  return new Set(
    fs
      .readFileSync(p, 'utf8')
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(Boolean)
  );
}

function matchWhitelist(key, wl) {
  if (!wl || wl.size === 0) return false;
  if (wl.has(key)) return true;
  for (const pat of wl) {
    if (pat.endsWith('*') && key.startsWith(pat.slice(0, -1))) return true;
  }
  return false;
}

module.exports = { loadTranslationKeys, collectUsedKeys, loadWhitelist, matchWhitelist };
