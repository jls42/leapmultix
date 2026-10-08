/**
 * @jest-environment jsdom
 *
 * Un titre de niveau 1 par écran (axe : page-has-heading-one) : le titre visible de l'écran
 * quand il en a un, sans second titre lu en double. Ici, les écrans écrits dans index.html ;
 * les écrans de jeu ont leurs tests (GameMode, InfoBar, Arcade, Découverte, Aventure).
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from '@jest/globals';

const html = readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
const doc = new DOMParser().parseFromString(html, 'text/html');

const SCREENS = [
  ['slide0', 'user_selection_title'],
  ['slide1', 'app_title'],
  ['slide6', 'personalization_title'],
  ['slide7', 'dashboard_title'],
  ['slide8', 'about_title'],
  ['slide9', 'legal_title'],
  ['slide10', 'privacy_title'],
  ['slide11', 'faq_title'],
];

describe('un titre de niveau 1 par écran de index.html', () => {
  test.each(SCREENS)('%s : un seul h1, le titre de l’écran (%s)', (id, key) => {
    const headings = doc.querySelectorAll(`#${id} h1`);
    expect(headings).toHaveLength(1);
    expect(headings[0].dataset.translate).toBe(key);
  });

  test('l’écran de jeu et celui des résultats reçoivent le leur à l’affichage', () => {
    // Construits par le code (GameMode, écrans de fin) : vides dans index.html
    expect(doc.querySelectorAll('#slide4 h1, #slide5 h1')).toHaveLength(0);
  });
});
