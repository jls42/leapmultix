/* eslint-env jest, node */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';

const { fetchTranslations, loadIntoStore, getCurrentLanguage, setCurrentLanguage } = await import(
  '../js/i18n-store.js'
);

/** Adresses demandées au réseau pendant le test */
let adressesDemandees = [];

describe('i18n-store : la langue ne compose jamais librement une adresse', () => {
  beforeEach(() => {
    adressesDemandees = [];
    globalThis.fetch = jest.fn(async url => {
      adressesDemandees.push(String(url));
      return { ok: true, json: async () => ({ hello: 'bonjour' }) };
    });
    setCurrentLanguage('fr');
  });

  afterEach(() => {
    delete globalThis.fetch;
    setCurrentLanguage('fr');
  });

  test.each(['fr', 'en', 'es'])('la langue livrée « %s » est demandée telle quelle', async lang => {
    await fetchTranslations(lang);
    expect(adressesDemandees[0]).toContain(`assets/translations/${lang}.json`);
  });

  test('une variante régionale retombe sur sa langue de base', async () => {
    await fetchTranslations('fr-CA');
    expect(adressesDemandees[0]).toContain('assets/translations/fr.json');
  });

  test.each([
    '../../../etc/passwd',
    '//exemple.invalide/x',
    'https://exemple.invalide/x',
    'de',
    '',
    null,
    undefined,
    42,
    { toString: () => 'en' },
  ])('une langue non livrée (%p) retombe sur le français', async lang => {
    await fetchTranslations(lang);
    expect(adressesDemandees[0]).toContain('assets/translations/fr.json');
    expect(adressesDemandees[0]).not.toContain('exemple.invalide');
    expect(adressesDemandees[0]).not.toContain('passwd');
  });

  test('loadIntoStore enregistre la langue réellement chargée, pas celle demandée', async () => {
    await loadIntoStore('de');
    expect(getCurrentLanguage()).toBe('fr');

    await loadIntoStore('es-MX');
    expect(getCurrentLanguage()).toBe('es');
    expect(adressesDemandees.at(-1)).toContain('assets/translations/es.json');
  });
});
