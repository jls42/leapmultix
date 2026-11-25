/**
 * Tests E2E - Menu de la barre du haut (téléphone et tablette), ouvert pendant une partie :
 * - toucher à côté du menu le ferme, et rien d'autre : le toucher ne répond pas à la question
 *   qui était dessous (un parent qui referme le menu faisait rater la réponse de l'enfant) ;
 * - au clavier, le focus qui sort du menu le ferme : il n'avance plus sur des boutons que le
 *   menu resté ouvert recouvrait.
 * @jest-environment node
 */

import { describe, expect, test } from '@jest/globals';
import { chromeSession } from '../helpers/chrome-session.mjs';
import { createUserAndSkipIntro } from '../helpers/game-session.mjs';
import { NO_SEASON } from '../../js/core/seasons.js';

const PHONE = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const TABLET = { width: 768, height: 1024, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

describe('Menu de la barre du haut pendant une partie (E2E)', () => {
  const chrome = chromeSession();
  let page;

  /** Un Quiz lancé, sa première question affichée */
  const startQuiz = async viewport => {
    page = await chrome.newPage();
    await page.setViewport(viewport);
    await page.goto(`${chrome.server.url}?saison=${NO_SEASON}`, chrome.server.gotoOptions);
    await createUserAndSkipIntro(page);
    await page.click('.mode-btn[data-mode="quiz"]');
    await page.waitForSelector('#quiz-options .option:not([disabled])', { visible: true });
  };

  /** Où en est la partie : la question, les réponses encore libres, le retour affiché */
  const gameState = () =>
    page.evaluate(() => ({
      question: document.querySelector('#quiz-question').textContent.trim(),
      free: document.querySelectorAll('#quiz-options .option:not([disabled])').length,
      feedback: document.querySelector('#quiz-feedback')?.textContent.trim() ?? '',
      menuOpen: Boolean(document.querySelector('#slide4 .top-bar-nav.is-open')),
      expanded: document.querySelector('#slide4 .burger-menu-btn').getAttribute('aria-expanded'),
    }));

  /** Un point d'une tuile de réponse que le menu ouvert ne recouvre pas */
  const uncoveredAnswerPoint = () =>
    page.evaluate(() => {
      const menu = document.querySelector('#slide4 .top-bar-nav.is-open').getBoundingClientRect();
      for (const tile of document.querySelectorAll('#quiz-options .option')) {
        const box = tile.getBoundingClientRect();
        const y = box.top + box.height / 2;
        for (const x of [box.left + 6, box.left + box.width / 2, box.right - 6]) {
          const inMenu = x >= menu.left && x <= menu.right && y >= menu.top && y <= menu.bottom;
          if (!inMenu) return { x, y };
        }
      }
      return null;
    });

  test.each([
    ['téléphone', PHONE],
    ['tablette', TABLET],
  ])(
    '%s : toucher une réponse à côté du menu ouvert ferme le menu sans répondre',
    async (_, viewport) => {
      await startQuiz(viewport);
      const before = await gameState();
      await page.tap('#slide4 .burger-menu-btn');
      await page.waitForSelector('#slide4 .top-bar-nav.is-open', { visible: true });

      const point = await uncoveredAnswerPoint();
      expect(point).not.toBeNull();
      await page.touchscreen.tap(point.x, point.y);
      await new Promise(resolve => setTimeout(resolve, 400));

      expect(await gameState()).toEqual({ ...before, menuOpen: false, expanded: 'false' });

      // Le menu fermé, la même réponse se touche de nouveau : la partie n'est pas bloquée
      await page.touchscreen.tap(point.x, point.y);
      await page.waitForFunction(
        () => document.querySelectorAll('#quiz-options .option:not([disabled])').length === 0,
        { timeout: 5000 }
      );
    },
    60000
  );

  test('souris : cliquer une réponse à côté du menu ouvert ferme le menu sans répondre', async () => {
    await startQuiz({ width: 768, height: 1024 });
    const before = await gameState();
    await page.click('#slide4 .burger-menu-btn');
    await page.waitForSelector('#slide4 .top-bar-nav.is-open', { visible: true });
    const point = await uncoveredAnswerPoint();
    await page.mouse.click(point.x, point.y);
    await new Promise(resolve => setTimeout(resolve, 400));
    expect(await gameState()).toEqual({ ...before, menuOpen: false, expanded: 'false' });
  }, 60000);

  test('le voile recouvre chaque bouton du jeu, laisse la barre au-dessus, et part avec le menu', async () => {
    await startQuiz(PHONE);
    const veil = () =>
      page.evaluate(() => {
        const element = document.querySelector('.top-bar-veil');
        if (!element) return null;
        const bar = document.querySelector('#slide4 .top-bar');
        const menu = bar.querySelector('.top-bar-nav').getBoundingClientRect();
        const centre = node => {
          const box = node.getBoundingClientRect();
          return [box.left + box.width / 2, box.top + box.height / 2];
        };
        // Les points de chaque bouton du jeu que le menu ne recouvre pas (bord gauche, centre,
        // bord droit) : selon la question tirée, le centre d'une tuile est sous le menu
        const exposed = [...document.querySelectorAll('#game button')]
          .filter(button => button.offsetParent !== null)
          .flatMap(button => {
            const box = button.getBoundingClientRect();
            const y = box.top + box.height / 2;
            return [box.left + 6, box.left + box.width / 2, box.right - 6].map(x => [x, y]);
          })
          .filter(([x, y]) => {
            const onScreen = x >= 0 && x <= innerWidth && y >= 0 && y <= innerHeight;
            const underMenu =
              x >= menu.left && x <= menu.right && y >= menu.top && y <= menu.bottom;
            return onScreen && !underMenu;
          });
        return {
          gameButtons: exposed.length > 0,
          reachable: exposed.filter(point => document.elementFromPoint(...point) !== element)
            .length,
          // Une touche de la barre reste au-dessus du voile : elle se touche encore
          barAbove: bar.contains(
            document.elementFromPoint(...centre(bar.querySelector('.home-btn')))
          ),
          hidden: element.getAttribute('aria-hidden'),
        };
      });
    expect(await veil()).toBeNull();
    await page.tap('#slide4 .burger-menu-btn');
    await page.waitForSelector('#slide4 .top-bar-nav.is-open', { visible: true });
    expect(await veil()).toEqual({
      gameButtons: true,
      reachable: 0,
      barAbove: true,
      hidden: 'true',
    });
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('#slide4 .top-bar-nav.is-open'));
    expect(await veil()).toBeNull();
  }, 60000);

  test('clavier : le focus qui sort du menu le ferme, il ne passe pas sous le menu', async () => {
    await startQuiz({ width: 390, height: 844 });
    await page.focus('#slide4 .burger-menu-btn');
    await page.keyboard.press('Enter');
    await page.waitForSelector('#slide4 .top-bar-nav.is-open', { visible: true });

    // Tab jusqu'à quitter la barre
    let inBar = true;
    for (let press = 0; press < 20 && inBar; press += 1) {
      await page.keyboard.press('Tab');
      inBar = await page.evaluate(() =>
        Boolean(document.activeElement?.closest('#slide4 .top-bar'))
      );
    }
    expect(inBar).toBe(false);
    const after = await page.evaluate(() => {
      const focused = document.activeElement;
      const box = focused.getBoundingClientRect();
      const seen = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
      return {
        menuOpen: Boolean(document.querySelector('#slide4 .top-bar-nav.is-open')),
        expanded: document.querySelector('#slide4 .burger-menu-btn').getAttribute('aria-expanded'),
        veil: Boolean(document.querySelector('.top-bar-veil')),
        // L'élément qui a le focus est bien celui qu'on voit à sa place
        visible: focused === seen || focused.contains(seen),
      };
    });
    expect(after).toEqual({ menuOpen: false, expanded: 'false', veil: false, visible: true });
  }, 60000);
});
