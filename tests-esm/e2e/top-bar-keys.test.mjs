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
  test.each([320, 360, 390, 768])(
    'téléphone de %i px : la touche « Son » est dans la barre, qui tient sur une rangée (9 999 pièces, grand texte)',
    async width => {
      page = await chrome.newPage();
      await page.setViewport({ width, height: 800, deviceScaleFactor: 2, isMobile: true });
      await page.goto(`${chrome.server.url}?saison=${NO_SEASON}`, chrome.server.gotoOptions);
      await createUserAndSkipIntro(page);
      await page.click('.mode-btn[data-mode="quiz"]');
      await page.waitForSelector('#quiz-options .option:not([disabled])', { visible: true });
      const row = await page.evaluate(() => {
        for (const count of document.querySelectorAll('.coin-count')) count.textContent = '9999';
        document.body.classList.remove('font-size-small', 'font-size-medium');
        document.body.classList.add('font-size-large');
        const bar = document.querySelector('#slide4 .top-bar');
        const shown = [...bar.children].filter(
          item =>
            item.checkVisibility({ checkVisibilityCSS: true }) && !item.matches('.top-bar-nav')
        );
        const middles = shown.map(item => {
          const box = item.getBoundingClientRect();
          return Math.round(box.top + box.height / 2);
        });
        const quick = bar.querySelector(':scope > .mute-btn-quick').getBoundingClientRect();
        return {
          names: shown.map(
            item =>
              ['home-btn', 'about-btn', 'coin-display', 'mute-btn-quick', 'burger-menu-btn'].find(
                name => item.classList.contains(name)
              ) ?? item.className
          ),
          spread: Math.max(...middles) - Math.min(...middles),
          overflow: bar.scrollWidth - bar.clientWidth,
          quick: [Math.round(quick.width), Math.round(quick.height)],
        };
      });
      expect(row.names).toEqual([
        'home-btn',
        'about-btn',
        'coin-display',
        'mute-btn-quick',
        'burger-menu-btn',
      ]);
      // Une rangée : tous les éléments à la même hauteur, à quelques pixels près
      expect(row.spread).toBeLessThanOrEqual(4);
      expect(row.overflow).toBe(0);
      expect(row.quick).toEqual([44, 44]);
    },
    60000
  );

  test('grand écran : une seule touche « Son » visible, celle de la rangée', async () => {
    page = await chrome.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(`${chrome.server.url}?saison=${NO_SEASON}`, chrome.server.gotoOptions);
    await createUserAndSkipIntro(page);
    const shown = await page.evaluate(() =>
      [...document.querySelectorAll('.slide.active-slide .top-bar .mute-btn')]
        .filter(key => key.checkVisibility({ checkVisibilityCSS: true }))
        .map(key => key.classList.contains('mute-btn-quick'))
    );
    expect(shown).toEqual([false]);
  }, 60000);

  test('son coupé : la touche prend la teinte d’alerte, lisible', async () => {
    page = await chrome.newPage();
    await page.setViewport(SCREENS[0][1]);
    await page.goto(`${chrome.server.url}?saison=${NO_SEASON}`, chrome.server.gotoOptions);
    await createUserAndSkipIntro(page);
    const look = () =>
      page.$eval('.slide.active-slide .mute-btn-quick', key => {
        const style = getComputedStyle(key);
        return {
          off: key.hasAttribute('data-sound-off'),
          background: style.backgroundColor,
          color: style.color,
          name: key.getAttribute('aria-label'),
        };
      });
    const on = await look();
    await page.tap('.slide.active-slide .mute-btn-quick');
    await page.waitForFunction(() =>
      document.querySelector('.slide.active-slide .mute-btn-quick').hasAttribute('data-sound-off')
    );
    const off = await look();
    expect(on.off).toBe(false);
    expect(off.name).not.toBe(on.name);
    expect(off.background).not.toBe(on.background);
    expect(off.color).not.toBe(on.color);
  }, 60000);
});
