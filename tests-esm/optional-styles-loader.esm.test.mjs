/* eslint-env jest */
/**
 * js/optional-styles-loader.js : sans requestIdleCallback (Safari, et jsdom ici), les feuilles
 * facultatives (tableau de bord, thèmes, volume…) n'arrivaient qu'avec l'événement load. Or un
 * script tiers qui ne répond pas (plausible.io derrière un pare-feu muet) retient load : mesuré
 * dans WebKit, ces styles arrivaient au bout de 28 s, le temps que la requête échoue. Elles
 * arrivent désormais au même délai qu'avec requestIdleCallback, load ou pas.
 */
import { describe, test, expect, jest } from '@jest/globals';
import { VERSION_PARAM } from '../js/cache-updater.js';

const OPTIONAL_STYLES = [
  'css/parent-controls.css',
  'css/theme-selector.css',
  'css/volume-control.css',
  'css/progress-dashboard.css',
  'css/video.css',
];

describe('Feuilles de style facultatives sans requestIdleCallback', () => {
  test('load qui ne vient plus : les feuilles arrivent au bout de 2,5 s, une fois chacune', async () => {
    // jsdom comme Safari : pas de requestIdleCallback, et load déjà passé, donc l'écouteur
    // posé maintenant ne se déclenchera pas (comme un load retenu)
    expect('requestIdleCallback' in globalThis).toBe(false);
    expect(document.readyState).toBe('complete');
    jest.useFakeTimers();
    await import('../js/optional-styles-loader.js');
    const links = () => [...document.querySelectorAll('link[data-optional-css]')];

    jest.advanceTimersByTime(2499);
    expect(links()).toHaveLength(0);
    jest.advanceTimersByTime(1);
    expect(links().map(link => link.dataset.optionalCss)).toEqual(OPTIONAL_STYLES);
    expect(links().every(link => link.getAttribute('href').endsWith(`?${VERSION_PARAM}`))).toBe(
      true
    );

    // Le repli des 3 s reprogramme un chargement : il ne double aucune feuille
    jest.advanceTimersByTime(10000);
    expect(links()).toHaveLength(OPTIONAL_STYLES.length);
    jest.useRealTimers();
  });
});
