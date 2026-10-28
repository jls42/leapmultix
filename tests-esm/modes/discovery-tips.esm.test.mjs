/* eslint-env jest, node */
/**
 * Astuces de la division (mode Découverte), sur les vraies traductions : chaque diviseur à
 * critère est tiré par un niveau et a son texte dans les trois langues, et les exemples
 * chiffrés de ces textes sont justes (chiffres, somme, multiple du diviseur).
 */
import { readFileSync } from 'node:fs';
import { describe, test, expect } from '@jest/globals';
import { DIVISIBILITY_RULES, DIVISION_LEVELS } from '../../js/modes/discovery-data.js';

const LANGS = ['fr', 'en', 'es'];
const dictionaries = Object.fromEntries(
  LANGS.map(lang => [
    lang,
    JSON.parse(readFileSync(new URL(`../../assets/translations/${lang}.json`, import.meta.url))),
  ])
);

/** Diviseurs que la Découverte peut tirer, tous niveaux confondus */
const DRAWN_DIVISORS = Object.values(DIVISION_LEVELS).flatMap(({ divisor: [min, max] }) =>
  Array.from({ length: max - min + 1 }, (_, i) => min + i)
);

/**
 * « 345 : 3 + 4 + 5 = 12 », « 729: 7 + 2 + 9 = 18 » : la somme ne se coupe pas en fin de
 * ligne (espaces insécables, comme dans mnemonic_9)
 */
const WORKED_EXAMPLE = /(\d+)\u00a0?: (\d+(?:\u00a0\+\u00a0\d+)+)\u00a0=\u00a0(\d+)/g;

describe('ESM: Découverte, astuces de la division', () => {
  test('chaque diviseur à critère est tiré par un niveau', () => {
    DIVISIBILITY_RULES.forEach(divisor => expect(DRAWN_DIVISORS).toContain(divisor));
  });

  test.each(LANGS)('%s : la ligne des multiples et un critère par diviseur listé', lang => {
    const dictionary = dictionaries[lang];
    expect(dictionary.division_tip_multiples).toContain('{divisor}');
    const ruleKeys = Object.keys(dictionary).filter(key => /^division_tip_\d+$/.test(key));
    expect(ruleKeys.sort()).toEqual(DIVISIBILITY_RULES.map(d => `division_tip_${d}`).sort());
    DIVISIBILITY_RULES.forEach(divisor => {
      expect(dictionary[`division_tip_${divisor}`]).toContain(String(divisor));
    });
  });

  test.each(LANGS)('%s : les exemples chiffrés des critères sont justes', lang => {
    const dictionary = dictionaries[lang];
    const checked = DIVISIBILITY_RULES.flatMap(divisor =>
      [...dictionary[`division_tip_${divisor}`].matchAll(WORKED_EXAMPLE)].map(
        ([, number, digits, sum]) => {
          const terms = digits.split('\u00a0+\u00a0');
          expect(terms.join('')).toBe(number);
          expect(terms.reduce((total, digit) => total + Number(digit), 0)).toBe(Number(sum));
          expect(Number(sum) % divisor).toBe(0);
          expect(Number(number) % divisor).toBe(0);
          return number;
        }
      )
    );
    // 345 pour 3, 729 pour 9 : l'expression régulière les trouve bien
    expect(checked).toEqual(['345', '729']);
  });
});
