/* eslint-env jest, node */
/**
 * Annonces aux lecteurs d'écran du gestionnaire d'accessibilité (js/accessibility.js), dans la
 * langue du jeu : Échap hors partie (retour à « Qui joue ? »), Ctrl+M (son coupé ou remis) et
 * l'aide Ctrl+H. Elles étaient écrites en dur en français, quelle que soit la langue.
 */
import { readFileSync } from 'node:fs';
import { describe, test, expect, beforeAll, beforeEach, jest } from '@jest/globals';
import { setTranslations } from '../js/i18n-store.js';

const { AccessibilityManager } = await import('../js/accessibility.js');
const { AudioManager } = await import('../js/core/audio.js');

const read = lang =>
  JSON.parse(readFileSync(new URL(`../assets/translations/${lang}.json`, import.meta.url)));
const EN = read('en');
const ES = read('es');

const polite = () => document.getElementById('aria-announcements').textContent;
const assertive = () => document.getElementById('aria-alerts').textContent;
const press = (key, extra = {}) =>
  document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...extra }));
const settle = () => new Promise(resolve => setTimeout(resolve, 0));

beforeAll(() => {
  document.body.replaceChildren(
    ...new DOMParser().parseFromString(
      '<div id="aria-announcements" aria-live="polite"></div><div id="aria-alerts" aria-live="assertive"></div>',
      'text/html'
    ).body.childNodes
  );
  jest.spyOn(console, 'error').mockImplementation(() => {});
  // Un seul gestionnaire : chaque instance pose ses écouteurs sur le document
  new AccessibilityManager();
});

beforeEach(() => {
  setTranslations(EN);
});

describe('Annonces aux lecteurs d’écran, dans la langue du jeu', () => {
  test('Échap hors partie : retour à « Who’s playing? », pas « Retour au menu principal »', () => {
    press('Escape');
    expect(polite()).toBe(EN.a11y_back_to_players);
    expect(polite()).toContain(EN.user_selection_title);
  });

  test('Ctrl+M : l’annonce dit l’état du son après le changement', async () => {
    jest.spyOn(AudioManager, 'toggleMute').mockImplementation(() => {});
    const muted = jest.spyOn(AudioManager, 'isMuted').mockReturnValue(true);
    press('m', { ctrlKey: true });
    await settle();
    expect(polite()).toBe(EN.a11y_sound_off);
    muted.mockReturnValue(false);
    press('m', { ctrlKey: true });
    await settle();
    expect(polite()).toBe(EN.a11y_sound_on);
  });

  test('Ctrl+H : l’aide des raccourcis, en espagnol quand le jeu est en espagnol', () => {
    setTranslations(ES);
    press('h', { ctrlKey: true });
    expect(assertive()).toBe(ES.a11y_shortcuts_help);
    expect(assertive()).toContain('Ctrl+M');
  });
});
