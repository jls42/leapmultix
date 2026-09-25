import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import { formatMessage, messageArguments, pluralCategory } from '../../js/core/message-format.js';

const BOITES = '{n, plural, one {# boîte} other {# boîtes}}';

function readTranslations(lang) {
  return JSON.parse(fs.readFileSync(`assets/translations/${lang}.json`, 'utf8'));
}

describe('core/message-format', () => {
  describe('pluralCategory', () => {
    it('suit les règles de chaque langue : 0 est au singulier en français seulement', () => {
      expect(pluralCategory(0, 'fr')).toBe('one');
      expect(pluralCategory(1, 'fr')).toBe('one');
      expect(pluralCategory(2, 'fr')).toBe('other');
      expect(pluralCategory(0, 'en')).toBe('other');
      expect(pluralCategory(1, 'en')).toBe('one');
      expect(pluralCategory(1, 'es')).toBe('one');
      expect(pluralCategory(21, 'es')).toBe('other');
    });

    it('garde ces règles sans Intl.PluralRules', () => {
      const original = Intl.PluralRules;
      Intl.PluralRules = undefined;
      try {
        // Langues encore jamais demandées : aucune règle en cache
        expect(pluralCategory(0, 'fr-CA')).toBe('one');
        expect(pluralCategory(0, 'en-GB')).toBe('other');
        expect(pluralCategory(1, 'es-MX')).toBe('one');
      } finally {
        Intl.PluralRules = original;
      }
    });
  });

  describe('formatMessage', () => {
    it('remplace chaque paramètre, même répété', () => {
      expect(formatMessage('{a} + {b} = {a}', { a: 2, b: 3 })).toBe('2 + 3 = 2');
    });

    it('laisse tel quel un paramètre absent', () => {
      expect(formatMessage('Bonjour {name} !', {})).toBe('Bonjour {name} !');
    });

    it('accorde au singulier et au pluriel, selon la langue', () => {
      expect(formatMessage(BOITES, { n: 1 }, 'fr')).toBe('1 boîte');
      expect(formatMessage(BOITES, { n: 0 }, 'fr')).toBe('0 boîte');
      expect(formatMessage(BOITES, { n: 7 }, 'fr')).toBe('7 boîtes');
      expect(formatMessage('{n, plural, one {# box} other {# boxes}}', { n: 0 }, 'en')).toBe(
        '0 boxes'
      );
    });

    it('préfère une valeur exacte à la catégorie', () => {
      const template = '{n, plural, =0 {aucun ballon} one {# ballon} other {# ballons}}';
      expect(formatMessage(template, { n: 0 }, 'fr')).toBe('aucun ballon');
      expect(formatMessage(template, { n: 1 }, 'fr')).toBe('1 ballon');
    });

    it('remplit les paramètres écrits dans une branche', () => {
      const template = '{n, plural, one {# bille pour {who}} other {# billes pour {who}}}';
      expect(formatMessage(template, { n: 2, who: 'Léa' }, 'fr')).toBe('2 billes pour Léa');
    });

    it('donne à chaque pluriel imbriqué son propre #', () => {
      const template =
        '{b, plural, one {# oiseau {a, plural, one {rejoint # ami} other {rejoint # amis}}} other {# oiseaux}}';
      expect(formatMessage(template, { a: 3, b: 1 }, 'fr')).toBe('1 oiseau rejoint 3 amis');
    });

    it('ne relit jamais une valeur insérée comme un gabarit', () => {
      expect(formatMessage('{x} et {n, plural, other {# fois}}', { x: '{n}', n: '#{x}' })).toBe(
        '{n} et #{x} fois'
      );
    });

    it('rend tel quel un gabarit mal formé', () => {
      expect(formatMessage('reste {n', { n: 1 })).toBe('reste {n');
      expect(formatMessage('{n, plural, one {x}', { n: 1 })).toBe('{n, plural, one {x}');
      expect(formatMessage('{n, plural, bizarre {x}}', { n: 1 })).toBe('{n, plural, bizarre {x}}');
      expect(formatMessage('{n, plural, one {x}}', { n: 5 }, 'fr')).toBe('{n, plural, one {x}}');
    });

    it('accepte un texte vide ou des paramètres absents', () => {
      expect(formatMessage(undefined)).toBe('');
      expect(formatMessage('sans accolade', null)).toBe('sans accolade');
    });
  });

  describe('messageArguments', () => {
    it('liste les paramètres, pluriels et branches compris, sans les sélecteurs', () => {
      expect(messageArguments('{b} puis {a}')).toEqual(['a', 'b']);
      expect(messageArguments(`${BOITES} pour {who} et {n}`)).toEqual(['n', 'who']);
      expect(messageArguments('{n, plural, one {# box} other {{x} boxes}}')).toEqual(['n', 'x']);
      expect(messageArguments('Only one {item} left')).toEqual(['item']);
    });
  });

  describe('énoncés traduits', () => {
    const LANGS = ['fr', 'en', 'es'];
    const KEYS = [
      'problem_templates',
      'problem_templates_addition',
      'problem_templates_subtraction',
    ];

    it.each(LANGS)('%s : aucun énoncé ne garde d’accolade, au singulier comme au pluriel', lang => {
      const translations = readTranslations(lang);
      for (const key of KEYS) {
        for (const template of translations[key]) {
          for (const n of [1, 2, 11]) {
            const params = { table: n, num: n, a: n, b: n };
            expect(formatMessage(template, params, lang)).not.toMatch(/[{}#]/);
          }
        }
      }
    });

    it('accorde les énoncés au singulier dans les trois langues', () => {
      const [fr, en, es] = LANGS.map(readTranslations);
      expect(formatMessage(fr.problem_templates[0], { table: 7, num: 1 }, 'fr')).toBe(
        "Si j'ai 1 boîte de 7 pommes, combien de pommes ai-je\u00a0?"
      );
      expect(formatMessage(en.problem_templates[1], { table: 1, num: 8 }, 'en')).toBe(
        'There is 1 group of 8 children. How many children in total?'
      );
      expect(formatMessage(es.problem_templates_subtraction[1], { a: 5, b: 1 }, 'es')).toBe(
        'Hay 5 globos y 1 explota. ¿Cuántos globos quedan?'
      );
    });
  });
});
