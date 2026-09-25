/**
 * @jest-environment node
 */
/* eslint-env jest, node */
/**
 * Texte dit par la voix enregistrée (scripts/voice/said-text.mjs) : les nombres en 1
 * s'accordent avec le nom qui les suit, et la liste des mots qui suivent un nombre
 * correspond exactement au corpus.
 */
import { describe, test, expect } from '@jest/globals';
import {
  WORDS_AFTER_NUMBERS,
  saidText,
  wordsAfterNumbers,
} from '../../scripts/voice/said-text.mjs';
import { buildCorpus } from '../../scripts/voice/corpus.mjs';

describe('Texte dit : accord des nombres en 1', () => {
  test.each([
    ['Combien font 1 fois 7\u00a0?', 'Combien font une fois 7\u00a0?'],
    ['1 fois combien égale 7\u00a0?', 'une fois combien égale 7\u00a0?'],
    ['7 fois 1 égale 7', '7 fois 1 égale 7'],
    ['Si j’ai 1 boîte de 21 pommes', 'Si j’ai une boîte de vingt et une pommes'],
    [
      '31 billes, 41 cases, 51 pommes, 61 billes',
      'trente et une billes, quarante et une cases, cinquante et une pommes, soixante et une billes',
    ],
    ['81 cases', 'quatre-vingt-une cases'],
    ['101 pommes et 121 billes', 'cent une pommes et cent vingt et une billes'],
    ['11 boîtes, 71 pommes, 91 billes', '11 boîtes, 71 pommes, 91 billes'],
    ['1 oiseau, puis 1 autre oiseau arrive', '1 oiseau, puis 1 autre oiseau arrive'],
    ['Presque ! La bonne réponse est 21.', 'Presque ! La bonne réponse est 21.'],
  ])('fr : %s', (text, said) => {
    expect(saidText(text, 'fr')).toBe(said);
  });

  test.each([
    ['Si tengo 1 caja de 21 manzanas', 'Si tengo una caja de veintiuna manzanas'],
    ['Hay 21 grupos de 1 niño', 'Hay veintiún grupos de un niño'],
    ['31 canicas y 71 globos', 'treinta y una canicas y setenta y un globos'],
    ['101 casillas, 121 saltos', 'ciento una casillas, ciento veintiún saltos'],
    ['11 cajas', '11 cajas'],
    ['¿Cuánto es 1 por 7?', '¿Cuánto es 1 por 7?'],
    ['Hay 1 globo y 1 explota.', 'Hay un globo y 1 explota.'],
  ])('es : %s', (text, said) => {
    expect(saidText(text, 'es')).toBe(said);
  });

  test('en : rien ne change', () => {
    expect(saidText('What is 1 times 7? 21 apples', 'en')).toBe('What is 1 times 7? 21 apples');
  });
});

describe.each(['fr', 'es'])('%s : mots qui suivent un nombre', lang => {
  const corpus = buildCorpus(lang);
  const seen = new Set(corpus.flatMap(phrase => wordsAfterNumbers(phrase.text)));
  const classified = Object.values(WORDS_AFTER_NUMBERS[lang]).flat();

  test('chaque mot du corpus est classé (féminin, masculin ou autre)', () => {
    expect([...seen].filter(word => !classified.includes(word))).toEqual([]);
  });

  test('chaque mot classé existe dans le corpus (liste exacte)', () => {
    expect(classified.filter(word => !seen.has(word))).toEqual([]);
  });

  test('un mot n’a qu’un genre', () => {
    expect(new Set(classified).size).toBe(classified.length);
  });
});
