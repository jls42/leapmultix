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

  // 1000 px : entre le menu et les mots sous les icônes (tablette tournée) ; 1280 : les mots
  test.each([1000, 1280])(
    'écran de %i px : une seule rangée de touches, même hauteur, même icône, rien ne déborde',
    async width => {
      page = await chrome.newPage();
      await page.setViewport({ width, height: 800 });
      await page.goto(`${chrome.server.url}?saison=${NO_SEASON}`, chrome.server.gotoOptions);
      await createUserAndSkipIntro(page);
      const keys = await page.evaluate(() =>
        [...document.querySelectorAll('.slide.active-slide .top-bar .btn')]
          .filter(key => key.checkVisibility({ checkVisibilityCSS: true }))
          .map(key => {
            const rect = key.getBoundingClientRect();
            const icon = key.querySelector('svg.icon')?.getBoundingClientRect();
            return {
              name: key.className.split(' ').pop(),
              top: Math.round(rect.top),
              height: Math.round(rect.height),
              overflow: key.scrollHeight - key.clientHeight,
              icon: icon ? Math.round(icon.height) : null,
              // L'icône et le mot tiennent dans la touche
              inside: [...key.querySelectorAll('svg.icon, .icon-btn-caption')].every(part => {
                const box = part.getBoundingClientRect();
                // Le mot n'est affiché que sur grand écran : sans boîte, il ne déborde pas
                if (box.height === 0) return true;
                return box.top >= rect.top && box.bottom <= rect.bottom;
              }),
            };
          })
      );
      // « Changer de joueur » compris : il restait plus bas que les autres, icône coupée
      expect(keys.map(key => key.name)).toContain('change-user-btn');
      const [first] = keys;
      for (const key of keys) {
        expect({ ...key, name: key.name }).toEqual({
          name: key.name,
          top: first.top,
          height: first.height,
          overflow: 0,
          icon: 24,
          inside: true,
        });
      }
    },
    60000
  );
  /** Touches du menu ouvert : leur rangée (haut), et le filet posé au-dessus d'elles */
  const openMenuKeys = async () => {
    await page.click('.slide.active-slide .burger-menu-btn');
    await page.waitForSelector('.slide.active-slide .top-bar-nav.is-open', { visible: true });
    return page.evaluate(() =>
      [...document.querySelectorAll('.slide.active-slide .top-bar-nav.is-open > *')]
        .filter(item => item.checkVisibility({ checkVisibilityCSS: true }))
        .map(item => {
          const key = item.matches('button') ? item : item.querySelector('button');
          const rule = getComputedStyle(item, '::before');
          return {
            name: (key ?? item).className.split(' ').pop(),
            top: Math.round(item.getBoundingClientRect().top),
            left: Math.round(item.getBoundingClientRect().left),
            rule: rule.content !== 'none' && Number.parseFloat(rule.borderTopWidth) > 0,
          };
        })
    );
  };

  test('menu du téléphone : un filet sépare les réglages et « Changer de joueur »', async () => {
    page = await chrome.newPage();
    await page.setViewport(SCREENS[0][1]);
    await page.goto(`${chrome.server.url}?saison=${NO_SEASON}`, chrome.server.gotoOptions);
    await createUserAndSkipIntro(page);
    const keys = await openMenuKeys();
    expect(keys.filter(key => key.rule).map(key => key.name)).toEqual([
      'theme-mode-btn',
      'change-user-btn',
    ]);
    // Une colonne : chaque touche sous la précédente
    expect(new Set(keys.map(key => key.left)).size).toBe(1);
  }, 60000);

  test('menu du téléphone tourné : deux colonnes, les touches d’une rangée à la même hauteur, sans filet', async () => {
    page = await chrome.newPage();
    await page.setViewport(SCREENS[1][1]);
    await page.goto(`${chrome.server.url}?saison=${NO_SEASON}`, chrome.server.gotoOptions);
    await createUserAndSkipIntro(page);
    const keys = await openMenuKeys();
    expect(keys.filter(key => key.rule)).toEqual([]);
    const columns = [...new Set(keys.map(key => key.left))].sort((a, b) => a - b);
    expect(columns).toHaveLength(2);
    // Chaque touche de la colonne de droite a sa voisine de gauche à la même hauteur
    const leftTops = keys.filter(key => key.left === columns[0]).map(key => key.top);
    const lonely = keys.filter(key => key.left === columns[1] && !leftTops.includes(key.top));
    expect(lonely).toEqual([]);
  }, 60000);
});
