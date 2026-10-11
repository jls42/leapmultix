/* eslint-env jest, node */
/**
 * Pages publiées : aucun script hors du site (le traceur de Plausible est servi par le site,
 * js/vendor/). index.html porte en plus sa propre CSP en balise meta : en prod, elle s'ajoute
 * à celle de CloudFront ; sur les serveurs locaux, qui n'en envoient aucune, elle est la seule.
 */
import { describe, expect, test } from '@jest/globals';
import { readFileSync } from 'node:fs';

const PAGES = ['index.html', 'parents.html', 'offline.html', 'modes.html', 'pwa.html'];
const CSP = 'meta[http-equiv="Content-Security-Policy"]';
const parse = page =>
  new DOMParser().parseFromString(
    readFileSync(new URL(`../${page}`, import.meta.url), 'utf8'),
    'text/html'
  );

describe('Aucun script hors du site', () => {
  test.each(PAGES)('%s : chaque script vient du site', page => {
    const sources = [...parse(page).querySelectorAll('script[src]')].map(script =>
      script.getAttribute('src')
    );
    expect(sources.filter(src => /^(?:[a-z]+:)?\/\//i.test(src))).toEqual([]);
  });
});

describe('index.html : sa propre CSP', () => {
  const doc = parse('index.html');

  test('scripts du site seulement ; ni objet, ni adresse de base, ni envoi ailleurs', () => {
    const directives = doc
      .querySelector(CSP)
      .content.split(';')
      .map(directive => directive.trim().split(/\s+/))
      .map(([name, ...values]) => [name, values]);
    expect(Object.fromEntries(directives)).toEqual({
      'script-src': ["'self'"],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
    });
  });

  test('avant tout script : elle les couvre tous', () => {
    const first = doc.head.querySelector(`${CSP}, script, link[rel="modulepreload"]`);
    expect(first.matches(CSP)).toBe(true);
  });
});
