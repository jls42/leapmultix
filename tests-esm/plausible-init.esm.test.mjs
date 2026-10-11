/**
 * @jest-environment-options {"url": "https://leapmultix.jls42.org/"}
 *
 * Mesure d'audience (js/plausible-init.js) : le traceur de Plausible, servi par le site, ne
 * démarre qu'avec un nom d'hôte écrit par deploy.sh dans <meta name="plausible-domain">. Les
 * visites et les événements du jeu partent vers l'API de Plausible ; aucun script n'est chargé
 * depuis plausible.io. La page de test a l'adresse du site : le traceur ignore localhost.
 */
/* eslint-env jest, node */
import { afterAll, beforeAll, describe, expect, jest, test } from '@jest/globals';

const META = 'meta[name="plausible-domain"]';
const sent = [];

/** Page dont la balise du domaine contient cette valeur (aucune balise si null) */
const pageWith = content => {
  const doc = document.implementation.createHTMLDocument('page');
  if (content !== null) {
    const meta = doc.createElement('meta');
    meta.name = 'plausible-domain';
    meta.content = content;
    doc.head.appendChild(meta);
  }
  return doc;
};

beforeAll(() => {
  // jsdom n'a pas ResizeObserver, que tout navigateur pris en charge fournit (le jeu s'en sert
  // aussi, arcade-common.js) : le traceur mesure ainsi la hauteur de la page
  globalThis.ResizeObserver ??= class {
    observe() {}
    disconnect() {}
  };
  // Le domaine que deploy.sh écrit en prod, posé avant le chargement du module
  const meta = document.createElement('meta');
  meta.name = 'plausible-domain';
  meta.content = 'leapmultix.jls42.org';
  document.head.appendChild(meta);
  globalThis.fetch = jest.fn((url, options) => {
    sent.push({ url, options, body: JSON.parse(options.body) });
    return Promise.resolve({ status: 202 });
  });
});

afterAll(() => {
  document.querySelector(META)?.remove();
  Reflect.deleteProperty(globalThis, 'fetch');
  Reflect.deleteProperty(globalThis, 'plausible');
});

describe('Domaine lu dans la page', () => {
  test.each([
    ['le domaine du site', 'leapmultix.jls42.org', 'leapmultix.jls42.org'],
    ['des espaces autour', '  leapmultix.jls42.org ', 'leapmultix.jls42.org'],
    ['le gabarit non remplacé (développement)', '{{PLAUSIBLE_DOMAIN}}', ''],
    ['une adresse', 'https://leapmultix.jls42.org/', ''],
    ['un guillemet', 'a.org" onload="x', ''],
    ['un vide', '', ''],
    ['aucune balise', null, ''],
  ])('%s', async (_label, content, expected) => {
    const { plausibleDomain } = await import('../js/plausible-init.js');
    expect(plausibleDomain(pageWith(content))).toBe(expected);
  });

  test('sans domaine valide, le traceur ne démarre pas', async () => {
    const { startAudience } = await import('../js/plausible-init.js');
    const start = jest.fn();
    expect(startAudience(pageWith('{{PLAUSIBLE_DOMAIN}}'), start)).toBe(false);
    expect(start).not.toHaveBeenCalled();
    expect(startAudience(pageWith('leapmultix.jls42.org'), start)).toBe(true);
    expect(start).toHaveBeenCalledWith({ domain: 'leapmultix.jls42.org', logging: false });
  });
});

describe('Traceur démarré : les événements partent vers l’API de Plausible', () => {
  test('la visite est comptée au chargement, pour le domaine de la page', async () => {
    await import('../js/plausible-init.js');
    const pageview = sent.find(event => event.body.n === 'pageview');
    expect(pageview).toBeDefined();
    expect(pageview.url).toBe('https://plausible.io/api/event');
    expect(pageview.options).toMatchObject({ method: 'POST', keepalive: true });
    expect(pageview.body).toMatchObject({ d: 'leapmultix.jls42.org', u: location.href });
  });

  test('window.plausible reçoit les événements du jeu (« Voice fallback »)', async () => {
    await import('../js/plausible-init.js');
    expect(typeof globalThis.plausible).toBe('function');
    globalThis.plausible('Voice fallback', { props: { cause: 'missing', lang: 'fr' } });
    const event = sent.find(entry => entry.body.n === 'Voice fallback');
    expect(event.body).toMatchObject({
      d: 'leapmultix.jls42.org',
      p: { cause: 'missing', lang: 'fr' },
    });
  });
});
