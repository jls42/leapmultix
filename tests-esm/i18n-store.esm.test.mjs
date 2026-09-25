/* eslint-env jest, node */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';

const {
  fetchTranslations,
  loadIntoStore,
  getCurrentLanguage,
  setCurrentLanguage,
  setTranslations,
  translate,
} = await import('../js/i18n-store.js');

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

describe('i18n-store : une clé à variantes', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    setTranslations({});
  });

  test('tire chaque variante, de la première à la dernière', () => {
    setTranslations({ bravo: ['Bravo !', 'Super !', 'Génial !'] });
    const words = [0, 2 ** 32 - 1];
    jest.spyOn(globalThis.crypto, 'getRandomValues').mockImplementation(array => {
      array[0] = words.shift();
      return array;
    });

    expect(translate('bravo')).toBe('Bravo !');
    expect(translate('bravo')).toBe('Génial !');
  });

  test('applique les paramètres à la variante tirée', () => {
    setTranslations({ salut: ['Salut {nom} !'] });
    expect(translate('salut', { nom: 'Zoé' })).toBe('Salut Zoé !');
  });
});

describe('i18n-store : accord au pluriel', () => {
  afterEach(() => {
    setTranslations({});
    setCurrentLanguage('fr');
  });

  test('accorde selon les règles de la langue active', () => {
    setTranslations({ boites: '{n, plural, one {# boîte} other {# boîtes}}' });
    setCurrentLanguage('fr');
    expect(translate('boites', { n: 0 })).toBe('0 boîte');
    setCurrentLanguage('en');
    expect(translate('boites', { n: 0 })).toBe('0 boîtes');
    expect(translate('boites', { n: 1 })).toBe('1 boîte');
  });

  test('remplace chaque occurrence d’un paramètre', () => {
    setTranslations({ echo: '{x}, encore {x}' });
    expect(translate('echo', { x: 'oui' })).toBe('oui, encore oui');
  });
});
