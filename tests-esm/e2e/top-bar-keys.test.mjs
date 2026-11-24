/**
 * Tests E2E - Barre du haut : une touche (bouton à tranche, --key-edge) y est centrée avec sa
 * tranche, autant d'espace au-dessus de la touche qu'en dessous de sa tranche. La tranche est
 * une ombre, hors de la boîte du bouton : sans marge pour elle, la barre centrait la boîte et
 * la tranche touchait le bas de la barre au téléphone.
 * @jest-environment node
 */

import { describe, expect, test } from '@jest/globals';
import { chromeSession } from '../helpers/chrome-session.mjs';
import { createUserAndSkipIntro } from '../helpers/game-session.mjs';
import { NO_SEASON } from '../../js/core/seasons.js';

const SCREENS = [
  ['téléphone', { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  [
    'téléphone tourné',
    { width: 844, height: 390, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  ],
  ['ordinateur', { width: 1280, height: 800 }],
];

describe('Barre du haut : touches centrées avec leur tranche (E2E)', () => {
  const chrome = chromeSession();
  let page;

  /** Touches visibles de la rangée de la barre : espace au-dessus, espace sous la tranche */
  const keyGaps = () =>
    page.evaluate(() => {
      const bar = document.querySelector('.slide.active-slide .top-bar');
      const box = bar.getBoundingClientRect();
      const border = Number.parseFloat(getComputedStyle(bar).borderTopWidth);
      const edge = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--key-edge')
      );
      return [...bar.querySelectorAll('.btn')]
        .filter(key => key.checkVisibility({ checkVisibilityCSS: true }))
        .filter(key => !key.closest('.top-bar-nav.is-open'))
        .map(key => {
          const rect = key.getBoundingClientRect();
          return {
            above: Math.round((rect.top - box.top - border) * 10) / 10,
            below: Math.round((box.bottom - border - rect.bottom - edge) * 10) / 10,
            edge,
          };
        });
    });

  test.each(SCREENS)(
    '%s : autant d’espace au-dessus d’une touche que sous sa tranche',
    async (_, viewport) => {
      page = await chrome.newPage();
      await page.setViewport(viewport);
      await page.goto(`${chrome.server.url}?saison=${NO_SEASON}`, chrome.server.gotoOptions);
      await createUserAndSkipIntro(page);
      const gaps = await keyGaps();
      expect(gaps.length).toBeGreaterThan(0);
      for (const { above, below, edge } of gaps) {
        expect(edge).toBeGreaterThan(0);
        expect(above).toBeGreaterThan(0);
        expect(below).toBe(above);
      }
    },
    60000
  );
});
