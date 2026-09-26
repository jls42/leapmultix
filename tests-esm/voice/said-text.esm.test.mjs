/**
 * @jest-environment node
 */
/* eslint-env jest, node */
/**
 * Texte dit par la voix enregistrée (scripts/voice/said-text.mjs) : les nombres en 1
 * s'accordent avec le nom qui les suit, l'espagnol dit tous ses nombres en lettres, la liste
 * des mots qui suivent un nombre correspond exactement au corpus, et chaque texte imposé vise
 * une phrase du corpus.
 */
import { describe, test, expect } from '@jest/globals';
import {
  SAID_OVERRIDES,
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
    ['11 cajas', 'once cajas'],
    ['¿Cuánto es 1 por 7?', '¿Cuánto es uno por siete?'],
    ['Hay 1 globo y 1 explota.', 'Hay un globo y uno explota.'],
  ])('es : %s', (text, said) => {
    expect(saidText(text, 'es')).toBe(said);
  });

  test('en : rien ne change', () => {
    expect(saidText('What is 1 times 7? 21 apples', 'en')).toBe('What is 1 times 7? 21 apples');
  });
});

describe('Texte dit : en espagnol, les nombres en lettres', () => {
  test.each([
    ['7 por 8 es igual a 54', 'siete por ocho es igual a cincuenta y cuatro'],
    ['¿90 dividido entre cuánto es 9?', '¿noventa dividido entre cuánto es nueve?'],
    ['¡Casi! La respuesta correcta es 56.', '¡Casi! La respuesta correcta es cincuenta y seis.'],
    ['Tabla del 7', 'Tabla del siete'],
    ['Tengo 16 caramelos y me como 3.', 'Tengo dieciséis caramelos y me como tres.'],
    [
      '0, 15, 16, 21, 22, 30, 44, 99',
      'cero, quince, dieciséis, veintiuno, veintidós, treinta, cuarenta y cuatro, noventa y nueve',
    ],
    [
      '100, 101, 110, 121, 144, 200, 999',
      'cien, ciento uno, ciento diez, ciento veintiuno, ciento cuarenta y cuatro, doscientos, novecientos noventa y nueve',
    ],
    ['Año 2026', 'Año 2026'],
  ])('%s', (text, said) => {
    expect(saidText(text, 'es')).toBe(said);
  });

  test('aucun chiffre ne reste dans le texte dit d’une phrase du corpus espagnol', () => {
    const left = buildCorpus('es')
      .map(phrase => saidText(phrase.text, 'es'))
      .filter(said => /\d/.test(said));
    expect(left).toEqual([]);
  });

  test('le français et l’anglais gardent leurs chiffres', () => {
    expect(saidText('7 fois 8 égale 54', 'fr')).toBe('7 fois 8 égale 54');
    expect(saidText('7 times 8 equals 54', 'en')).toBe('7 times 8 equals 54');
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

describe('Texte dit : textes imposés', () => {
  test('la phrase visée est dite telle qu’imposée, les autres ne changent pas', () => {
    expect(saidText('108 divisé par 12 égale 9', 'fr')).toBe(
      'Cent huit divisé par douze égale neuf'
    );
    expect(saidText('96 divisé par 12 égale 8', 'fr')).toBe('96 divisé par 12 égale 8');
    expect(saidText('108 divisé par 12 égale 9', 'en')).toBe('108 divisé par 12 égale 9');
  });

  test('un texte qui ressemble à une propriété d’objet n’est jamais remplacé', () => {
    for (const text of ['constructor', 'toString', '__proto__', 'hasOwnProperty']) {
      expect(saidText(text, 'fr')).toBe(text);
    }
  });

  test.each(Object.keys(SAID_OVERRIDES))(
    '%s : chaque texte imposé vise une phrase du corpus, et dit autre chose',
    lang => {
      const corpus = new Set(buildCorpus(lang).map(entry => entry.text));
      for (const [text, said] of SAID_OVERRIDES[lang]) {
        expect(corpus.has(text)).toBe(true);
        expect(said.trim()).not.toBe('');
        expect(said).not.toBe(text);
      }
    }
  );
});
