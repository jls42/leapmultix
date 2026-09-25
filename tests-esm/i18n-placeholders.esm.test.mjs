import { describe, expect, test } from '@jest/globals';
import fs from 'node:fs';
import { messageArguments } from '../js/core/message-format.js';

// Les paramètres d'un message sont les mêmes dans les trois langues. Les noms sont lus
// par le formateur du jeu : « {n, plural, one {# boîte} other {# boîtes}} » compte pour
// « n », et ses branches ne sont pas prises pour des paramètres.

const LANGS = ['fr', 'en', 'es'];

function flatten(obj, prefix = '', acc = {}) {
  for (const [key, value] of Object.entries(obj || {})) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) flatten(value, path, acc);
    else acc[path] = value;
  }
  return acc;
}

/** Paramètres d'une valeur : une chaîne, ou toutes les variantes d'un tableau */
function argumentsOf(value) {
  const texts = Array.isArray(value) ? value : [value];
  const names = new Set(texts.flatMap(text => messageArguments(String(text ?? ''))));
  return [...names].sort((a, b) => a.localeCompare(b));
}

describe('i18n : paramètres des messages', () => {
  const locales = Object.fromEntries(
    LANGS.map(lang => [
      lang,
      flatten(JSON.parse(fs.readFileSync(`assets/translations/${lang}.json`, 'utf8'))),
    ])
  );

  test('chaque message a les mêmes paramètres dans les trois langues', () => {
    const mismatches = [];
    for (const key of Object.keys(locales.fr)) {
      const reference = argumentsOf(locales.fr[key]);
      for (const lang of ['en', 'es']) {
        const other = argumentsOf(locales[lang][key]);
        if (JSON.stringify(other) !== JSON.stringify(reference)) {
          mismatches.push(`${key} : fr ${reference.join(',')} ≠ ${lang} ${other.join(',')}`);
        }
      }
    }
    expect(mismatches).toEqual([]);
  });

  test('les énoncés au pluriel gardent leurs deux paramètres', () => {
    expect(argumentsOf(locales.fr.problem_templates)).toEqual(['num', 'table']);
    expect(argumentsOf(locales.en.problem_templates_addition)).toEqual(['a', 'b']);
  });
});
