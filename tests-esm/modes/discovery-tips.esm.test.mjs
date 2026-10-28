/* eslint-env jest, node */
/**
 * Astuces du mode Découverte, sur les vraies traductions.
 * Division : chaque diviseur à critère est tiré par un niveau et a son texte dans les trois
 * langues, et les exemples chiffrés de ces textes sont justes (chiffres, somme, multiple du
 * diviseur). Multiplication : ce que disent les astuces des tables 2, 3 et 9 reste vrai pour
 * tous les multiplicandes du jeu, et leurs exemples chiffrés sont justes.
 */
import { readFileSync } from 'node:fs';
import { describe, test, expect } from '@jest/globals';
import {
  DISCOVERY_FACTORS,
  DISCOVERY_TABLES,
  DIVISIBILITY_RULES,
  DIVISION_LEVELS,
} from '../../js/modes/discovery-data.js';

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

/** « 3 × 8 = 24, et 2 + 4 = 6 » : le produit, puis la somme de ses chiffres */
const DIGIT_SUM_EXAMPLE =
  /(\d+)\u00a0×\u00a0(\d+)\u00a0=\u00a0(\d+), \p{L}+ (\d+(?:\u00a0\+\u00a0\d+)+)\u00a0=\u00a0(\d+)/gu;

const digitSum = n => [...String(n)].reduce((total, digit) => total + Number(digit), 0);

describe('ESM: Découverte, astuces de la multiplication', () => {
  test.each(LANGS)('%s : les tables de 2 et de 3 ont une seconde astuce', lang => {
    [2, 3].forEach(table => {
      expect(dictionaries[lang][`mnemonic_${table}`].split('\n')).toHaveLength(2);
    });
  });

  // Les multiplicandes du jeu vont de 1 à 10 (Découverte, Quiz, Défi, Aventure)
  test('table de 2 : résultats pairs ; tables de 3 et de 9 : somme des chiffres annoncée', () => {
    DISCOVERY_FACTORS.forEach(n => {
      expect([0, 2, 4, 6, 8]).toContain((2 * n) % 10);
      expect([3, 6, 9]).toContain(digitSum(3 * n));
      expect(digitSum(9 * n)).toBe(9);
    });
  });

  test.each(LANGS)('%s : les exemples chiffrés des astuces sont justes', lang => {
    const checked = DISCOVERY_TABLES.flatMap(table =>
      [...dictionaries[lang][`mnemonic_${table}`].matchAll(DIGIT_SUM_EXAMPLE)].map(
        ([, a, b, product, digits, sum]) => {
          expect(Number(a)).toBe(table);
          expect(Number(a) * Number(b)).toBe(Number(product));
          const terms = digits.split('\u00a0+\u00a0');
          expect(terms.join('')).toBe(product);
          expect(digitSum(product)).toBe(Number(sum));
          return `${a}×${b}`;
        }
      )
    );
    // 3 × 8 pour la table de 3, 9 × 5 pour la table de 9 : l'expression les trouve bien
    expect(checked).toEqual(['3×8', '9×5']);
  });
});
