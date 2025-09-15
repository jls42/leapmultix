// Load translations using CommonJS require (Jest runs tests in CJS by default)
const fr = require('../../../assets/translations/fr.json');
const en = require('../../../assets/translations/en.json');
const es = require('../../../assets/translations/es.json');

function flatten(obj, prefix = '') {
  return Object.entries(obj || {}).reduce((acc, [k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(acc, flatten(v, key));
    } else {
      acc[key] = String(v);
    }
    return acc;
  }, {});
}

function placeholders(str) {
  if (typeof str !== 'string') return [];
  return Array.from(str.matchAll(/\{([^}]+)\}/g))
    .map(m => m[1])
    .sort();
}

describe('i18n governance', () => {
  const f = flatten(fr);
  const e = flatten(en);
  const s = flatten(es);
  const locales = { fr: f, en: e, es: s };
  const keys = new Set([...Object.keys(f), ...Object.keys(e), ...Object.keys(s)]);

  test('all locales expose the same keys', () => {
    const missing = [];
    for (const k of keys) {
      for (const [name, dict] of Object.entries(locales)) {
        if (!Object.prototype.hasOwnProperty.call(dict, k)) {
          missing.push(`${name}:${k}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  test('placeholders within messages are consistent across locales', () => {
    const mismatches = [];
    for (const k of keys) {
      const sets = Object.entries(locales).map(([name, d]) => [name, placeholders(d[k] || '')]);
      const baseline = sets[0][1];
      for (let i = 1; i < sets.length; i++) {
        const [name, s2] = sets[i];
        if (JSON.stringify(s2) !== JSON.stringify(baseline)) {
          mismatches.push(
            `${k} -> ${sets[0][0]}:${JSON.stringify(baseline)} vs ${name}:${JSON.stringify(s2)}`
          );
        }
      }
    }
    expect(mismatches).toEqual([]);
  });
});
/* eslint-env jest, node */
