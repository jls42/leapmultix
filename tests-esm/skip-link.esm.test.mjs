/**
 * @jest-environment jsdom
 *
 * Lien d'évitement de l'accueil : premier arrêt de tabulation de la page, il mène au titre
 * des modes (focalisable), juste avant les cartes. Sans lui, il fallait 16 tabulations pour
 * atteindre le premier mode.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from '@jest/globals';

const html = readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
const doc = new DOMParser().parseFromString(html, 'text/html');
const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
const translations = lang =>
  JSON.parse(readFileSync(path.join(process.cwd(), `assets/translations/${lang}.json`), 'utf8'));

describe('lien d’évitement « Aller aux modes »', () => {
  const link = doc.querySelector('main .skip-link');

  test('premier élément focalisable de la page', () => {
    expect(link).not.toBeNull();
    expect(doc.querySelector(`main ${FOCUSABLE.split(', ').join(', main ')}`)).toBe(link);
  });

  test('il mène au titre des modes de l’accueil, focalisable, juste avant les cartes', () => {
    const target = doc.getElementById(link.getAttribute('href').slice(1));
    expect(target?.closest('#slide1')).not.toBeNull();
    expect(target.getAttribute('tabindex')).toBe('-1');
    const firstMode = doc.querySelector('#slide1 .mode-btn');
    // Le titre précède la première carte dans l'ordre du document
    expect(target.compareDocumentPosition(firstMode) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
  });

  test.each(['fr', 'en', 'es'])('%s : son libellé est traduit', lang => {
    const key = link.dataset.translate;
    expect(typeof translations(lang)[key]).toBe('string');
    expect(translations(lang)[key].length).toBeGreaterThan(3);
  });
});
