/* eslint-env jest, node */
/**
 * Promesses écrites : ce que les textes annoncent aux parents et aux enfants est vrai
 * (audit de la v37).
 * - Aventure en +, − et ÷ : « jusqu'à N » vaut le plus grand nombre du niveau, en fr, en, es ;
 * - FAQ : les données structurées (JSON-LD) disent la même chose que la FAQ affichée ;
 * - FAQ « Mes données » : la mesure d'audience (Plausible) est dite, plus « rien n'est envoyé » ;
 * - FAQ « À quel âge » : 6 ans, c'est le CP ;
 * - anglais : une seule orthographe, l'américaine, comme le reste des textes.
 */
import { describe, test, expect } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { Addition } from '../js/core/operations/Addition.js';
import { Subtraction } from '../js/core/operations/Subtraction.js';
import { Division } from '../js/core/operations/Division.js';
import {
  ADVENTURE_LEVELS_ADDITION,
  ADVENTURE_LEVELS_SUBTRACTION,
  ADVENTURE_LEVELS_DIVISION,
} from '../js/core/adventure-data.js';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const texts = lang => new Map(Object.entries(JSON.parse(read(`assets/translations/${lang}.json`))));
const LANGS = new Map(['fr', 'en', 'es'].map(lang => [lang, texts(lang)]));
const FR = LANGS.get('fr');
// Espaces insécables et retours à la ligne ramenés à une espace simple
const plain = text =>
  String(text)
    .replaceAll('&nbsp;', ' ')
    .replaceAll(/[\s  ]+/g, ' ')
    .trim();

const UP_TO = /(?:jusqu['’]à|up to|hasta)\s+(\d+)/i;
const OPERATIONS = [
  ['addition', ADVENTURE_LEVELS_ADDITION, new Addition(), ({ a, b }) => a + b],
  ['soustraction', ADVENTURE_LEVELS_SUBTRACTION, new Subtraction(), ({ a }) => a],
  ['division', ADVENTURE_LEVELS_DIVISION, new Division(), ({ a }) => a],
];

describe('Aventure : « jusqu’à N » est le plus grand nombre du niveau', () => {
  test.each(OPERATIONS)('%s', (_name, levels, operation, largest) => {
    for (const level of levels) {
      const max = Math.max(...operation.enumerateOperands(level.difficulty).map(largest));
      for (const [lang, strings] of LANGS) {
        const announced = UP_TO.exec(strings.get(level.descKey) ?? '');
        if (announced) {
          expect([lang, level.descKey, Number(announced[1])]).toEqual([lang, level.descKey, max]);
        }
      }
    }
  });
});

/** Questions et réponses de la FAQ dans les données structurées d'index.html */
function structuredFaq() {
  const blocks = [
    ...read('index.html').matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
  ];
  const faq = blocks.map(([, json]) => JSON.parse(json)).find(data => data['@type'] === 'FAQPage');
  return faq.mainEntity.map(entry => [plain(entry.name), plain(entry.acceptedAnswer.text)]);
}

/** Réponses de la FAQ affichée (texte de repli d'index.html, remplacé par la traduction) */
function visibleFaq() {
  return [
    ...read('index.html').matchAll(
      /<p itemprop="text" data-translate="(faq_a\d+)">([\s\S]*?)<\/p>/g
    ),
  ].map(([, key, html]) => [key, plain(html)]);
}

describe('FAQ : ce qui est écrit est vrai et partout pareil', () => {
  test('les données structurées reprennent les questions et réponses de la FAQ', () => {
    for (const [index, [question, answer]] of structuredFaq().entries()) {
      const n = index + 1;
      expect([n, question]).toEqual([n, plain(FR.get(`faq_q${n}`))]);
      expect([n, answer]).toEqual([n, plain(FR.get(`faq_a${n}`))]);
    }
  });

  test('la FAQ affichée avant traduction est celle du français', () => {
    for (const [key, text] of visibleFaq()) {
      expect([key, text]).toEqual([key, plain(FR.get(key))]);
    }
  });

  test('« Mes données » : la mesure d’audience est dite dans les trois langues', () => {
    for (const [lang, strings] of LANGS) {
      expect([lang, /Plausible/.test(strings.get('faq_a6'))]).toEqual([lang, true]);
    }
    expect(read('index.html')).not.toMatch(/n'envoie rien à des serveurs tiers/);
    expect(read('parents.html')).not.toMatch(/aucune donnée personnelle collectée/);
  });

  test('« À quel âge » : de 6 à 12 ans, c’est du CP à la 6e', () => {
    expect(FR.get('faq_a1')).toMatch(/du CP à la 6e/);
    expect(read('modes.html')).not.toMatch(/du CE1 à la 6e/);
  });
});

describe('Anglais : l’orthographe américaine, comme le reste des textes', () => {
  test('aucune orthographe britannique', () => {
    const british = /\b(?:practise|maths|colour|favourite|centre|personalis|customis|organis)/i;
    const found = [...LANGS.get('en')].filter(([, text]) => british.test(String(text)));
    expect(found).toEqual([]);
  });
});
