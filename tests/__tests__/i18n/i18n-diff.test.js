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
});
/* eslint-env jest, node */
