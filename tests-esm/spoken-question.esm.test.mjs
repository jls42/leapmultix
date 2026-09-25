/* eslint-env jest, node */
/**
 * Questions lues à voix haute, avec les vraies traductions : « Combien font 7 fois 8 ? »
 * (jamais « … égale ? », que l'oreille n'entend pas comme une question), question à
 * trou sans la réponse, égalité du vrai/faux lue telle quelle.
 */
import { describe, test, expect, afterAll } from '@jest/globals';
import fs from 'node:fs';

const store = await import('../js/i18n-store.js');
const { toSpokenForm, toSpokenQuestion, toSpokenGapQuestion, spokenOperator } = await import(
  '../js/ui-feedback.js'
);

const TRANSLATIONS = Object.fromEntries(
  ['fr', 'en', 'es'].map(lang => [
    lang,
    JSON.parse(fs.readFileSync(`assets/translations/${lang}.json`, 'utf8')),
  ])
);

function useLanguage(lang) {
  store.setTranslations(TRANSLATIONS[lang]);
  store.setCurrentLanguage(lang);
}

afterAll(() => {
  store.setTranslations({});
  store.setCurrentLanguage('fr');
});

describe('Question classique', () => {
  test.each([
    ['fr', '7 × 8 = ?', 'Combien font 7 fois 8\u00a0?'],
    ['en', '7 × 8 = ?', 'What is 7 times 8?'],
    ['es', '7 × 8 = ?', '¿Cuánto es 7 por 8?'],
    ['fr', '15 − 9 = ?', 'Combien font 15 moins 9\u00a0?'],
    ['en', '56 ÷ 7 = ?', 'What is 56 divided by 7?'],
    ['es', '3 + 4 = ?', '¿Cuánto es 3 más 4?'],
  ])('%s : « %s » se dit « %s »', (lang, shown, spoken) => {
    useLanguage(lang);
    expect(toSpokenQuestion(shown)).toBe(spoken);
  });

  test('garde l’ordre affiché des facteurs', () => {
    useLanguage('fr');
    expect(toSpokenQuestion('8 × 7 = ?')).toBe('Combien font 8 fois 7\u00a0?');
  });

  test('lit tel quel un texte d’une autre forme, comme un énoncé de problème', () => {
    useLanguage('fr');
    const problem = 'Il y a 3 ballons et 1 éclate. Combien de ballons reste-t-il\u00a0?';
    // Seuls les blancs sont ramenés à une espace simple, comme pour toute phrase lue
    expect(toSpokenQuestion(problem)).toBe(problem.replace('\u00a0', ' '));
  });

  test('sans la phrase traduite, retombe sur la forme lue symbole par symbole', () => {
    store.setTranslations({ speech_times: 'fois', speech_equals: 'égale' });
    store.setCurrentLanguage('fr');
    expect(toSpokenQuestion('7 × 8 = ?')).toBe('7 fois 8 égale ?');
  });
});

describe('Question à trou', () => {
  test.each([
    ['fr', '7 × ? = 56', '7 fois combien égale 56\u00a0?'],
    ['en', '7 × ? = 56', '7 times what equals 56?'],
    ['es', '56 ÷ ? = 7', '¿56 dividido entre cuánto es 7?'],
  ])('%s : « %s » se dit « %s », sans la réponse', (lang, shown, spoken) => {
    useLanguage(lang);
    expect(toSpokenGapQuestion(shown)).toBe(spoken);
  });
});

describe('Égalité lue telle quelle', () => {
  test('le vrai/faux lit la proposition affichée', () => {
    useLanguage('fr');
    expect(toSpokenForm('8 × 6 = 47')).toBe('8 fois 6 égale 47');
  });

  test('sans traduction, le symbole reste : jamais un mot français dans une autre langue', () => {
    store.setTranslations({});
    store.setCurrentLanguage('en');
    expect(toSpokenForm('8 × 6 = 47')).toBe('8 × 6 = 47');
    expect(spokenOperator('×')).toBe('×');
  });
});
