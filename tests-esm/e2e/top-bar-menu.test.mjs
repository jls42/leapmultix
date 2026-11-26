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
  test('la touche de la barre coupe tout ; dans le menu, bruitages et voix disent leur état, et les toucher rend le son', async () => {
    page = await chrome.newPage();
    await page.setViewport(PHONE);
    // La voix est allumée par le joueur
    await page.evaluateOnNewDocument(() => localStorage.setItem('voiceEnabled', 'true'));
    await page.goto(`${chrome.server.url}?saison=${NO_SEASON}`, chrome.server.gotoOptions);
    await createUserAndSkipIntro(page);
    await page.click('.mode-btn[data-mode="quiz"]');
    await page.waitForSelector('#quiz-options .option:not([disabled])', { visible: true });

    /** Ce qu'on lit dans le menu : libellé de chaque réglage, et son interrupteur dessiné */
    const menu = () =>
      page.evaluate(() => {
        const nav = document.querySelector('#slide4 .top-bar-nav');
        const row = selector => {
          const key = nav.querySelector(selector);
          const knob = getComputedStyle(key, '::after');
          return {
            label: key.querySelector('.icon-btn-label').textContent,
            shown: key.querySelector('.icon-btn-label').getBoundingClientRect().width > 1,
            // Interrupteur : sa piste (couleur de fond) et la place du curseur
            switch: `${knob.width} ${knob.backgroundColor}`,
            knobAtEnd: knob.backgroundImage.includes('calc(100%'),
            cut: key.hasAttribute('data-cut'),
          };
        };
        const seen = el => el.getBoundingClientRect().width > 1;
        return {
          effects: row('.effects-toggle'),
          voice: row('.voice-toggle'),
          // « Son », qui coupe tout, est dans la barre : le menu garde le curseur et son nom
          soundKeyInMenu: seen(nav.querySelector('.mute-btn')),
          volume: seen(nav.querySelector('.volume-slider'))
            ? nav.querySelector('.volume-caption').textContent
            : null,
        };
      });
    const openMenu = async () => {
      if (await page.$('#slide4 .top-bar-nav.is-open')) return;
      await page.tap('#slide4 .burger-menu-btn');
      await page.waitForSelector('#slide4 .top-bar-nav.is-open', { visible: true });
    };
    const soundBack = () =>
      page.waitForFunction(
        () => !document.querySelector('#slide4 .mute-btn-quick').hasAttribute('data-sound-off')
      );

    await openMenu();
    const on = await menu();
    expect([on.effects.label, on.voice.label]).toEqual(['Bruitages : activés', 'Voix : activée']);
    expect([on.effects.shown, on.voice.shown]).toEqual([true, true]);
    expect([on.effects.knobAtEnd, on.voice.knobAtEnd]).toEqual([true, true]);
    expect(on.effects.switch.startsWith('40px')).toBe(true);
    expect([on.soundKeyInMenu, on.volume]).toEqual([false, 'Volume']);
    await page.keyboard.press('Escape');

    // La touche « Son » de la barre coupe tout
    await page.tap('#slide4 .mute-btn-quick');
    await openMenu();
    const off = await menu();
    expect([off.effects.label, off.voice.label]).toEqual([
      'Bruitages : coupés avec le son',
      'Voix : coupée avec le son',
    ]);
    expect([off.effects.knobAtEnd, off.voice.knobAtEnd]).toEqual([false, false]);
    expect(off.effects.switch).not.toBe(on.effects.switch);
    expect(off.voice.switch).not.toBe(on.voice.switch);
    // Ce n'est pas leur réglage qui est coupé : pas de teinte d'alerte
    expect([off.effects.cut, off.voice.cut]).toEqual([false, false]);

    // Le chemin du retour passe par le menu : toucher « Voix » rend le son, et les deux
    // réglages, restés allumés, reviennent avec lui
    await page.tap('#slide4 .top-bar-nav .voice-toggle');
    await soundBack();
    await openMenu();
    expect(await menu()).toEqual(on);

    // Les bruitages se coupent seuls : la voix reste allumée
    await page.tap('#slide4 .top-bar-nav .effects-toggle');
    await page.waitForFunction(() =>
      document.querySelector('#slide4 .top-bar-nav .effects-toggle').hasAttribute('data-cut')
    );
    await openMenu();
    const effectsOff = await menu();
    expect([effectsOff.effects.label, effectsOff.effects.knobAtEnd]).toEqual([
      'Bruitages : coupés',
      false,
    ]);
    expect(effectsOff.voice).toEqual(on.voice);
    expect(
      await page.$eval('#slide4 .mute-btn-quick', key => key.hasAttribute('data-sound-off'))
    ).toBe(false);
  }, 60000);

  test('téléphone tourné : le menu tient à l’écran sans défiler, « Changer de joueur » compris, même tout coupé', async () => {
    page = await chrome.newPage();
    await page.setViewport({
      width: 844,
      height: 390,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    await page.goto(`${chrome.server.url}?saison=${NO_SEASON}`, chrome.server.gotoOptions);
    await createUserAndSkipIntro(page);
    const menu = async () => {
      if (!(await page.$('#slide1 .top-bar-nav.is-open'))) {
        await page.tap('#slide1 .burger-menu-btn');
        await page.waitForSelector('#slide1 .top-bar-nav.is-open', { visible: true });
      }
      return page.evaluate(() => {
        const nav = document.querySelector('#slide1 .top-bar-nav');
        const last = nav.querySelector('.change-user-btn').getBoundingClientRect();
        return {
          scrolls: nav.scrollHeight > nav.clientHeight + 1,
          lastKeyOnScreen: last.bottom <= innerHeight,
          // Aucun libellé ne dépasse de sa touche
          overflowing: [...nav.querySelectorAll('.icon-btn')].filter(key => {
            const label = key.querySelector('.icon-btn-label').getBoundingClientRect();
            const box = key.getBoundingClientRect();
            return label.top < box.top - 1 || label.bottom > box.bottom + 1;
          }).length,
        };
      });
    };
    expect(await menu()).toEqual({ scrolls: false, lastKeyOnScreen: true, overflowing: 0 });

    // Tout coupé : les libellés « … coupés avec le son » passent sur deux lignes
    await page.keyboard.press('Escape');
    await page.tap('#slide1 .mute-btn-quick');
    expect(await menu()).toEqual({ scrolls: false, lastKeyOnScreen: true, overflowing: 0 });

    // En espagnol, « Efectos: desactivados con el sonido » en prend trois : la touche grandit
    // avec son libellé (le menu défile alors, mais rien ne sort de sa touche)
    await page.tap('#slide1 .top-bar-nav .lang-btn[data-lang="es"]');
    await page.waitForFunction(() =>
      document
        .querySelector('#slide1 .effects-toggle')
        .getAttribute('aria-label')
        .startsWith('Efectos')
    );
    expect((await menu()).overflowing).toBe(0);
  }, 60000);

  test('grand écran : une seule rangée dans les trois langues, en grand texte, avec beaucoup de pièces', async () => {
    page = await chrome.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
    await page.goto(`${chrome.server.url}?saison=${NO_SEASON}`, chrome.server.gotoOptions);
    await createUserAndSkipIntro(page);
    const rows = [];
    for (const lang of ['fr', 'en', 'es']) {
      await page.click(`#slide1 .lang-btn[data-lang="${lang}"]`);
      await page.waitForFunction(
        expected => document.querySelector('#slide1 .lang-btn.active')?.dataset.lang === expected,
        {},
        lang
      );
      for (const width of [1000, 1200, 1240, 1280]) {
        await page.setViewport({ width, height: 800, deviceScaleFactor: 1 });
        rows.push(
          await page.evaluate(() => {
            document.body.classList.remove('font-size-small', 'font-size-medium');
            document.body.classList.add('font-size-large');
            const bar = document.querySelector('#slide1 .top-bar');
            bar.querySelector('.coin-count').textContent = '99999';
            // Les touches (toutes de la même hauteur) : une rangée = un seul haut
            const keys = [...bar.querySelectorAll('button.icon-btn, .change-user-btn')].filter(
              key => key.offsetParent
            );
            const tops = new Set(keys.map(key => Math.round(key.getBoundingClientRect().top)));
            const slider = bar.querySelector('.volume-slider').getBoundingClientRect();
            return {
              oneRow: tops.size === 1,
              overflow: bar.scrollWidth - bar.clientWidth,
              // Le curseur cède de la place, sans descendre sous une cible de 44 px
              sliderOk: slider.width >= 44,
            };
          })
        );
      }
    }
    expect(rows).toEqual(Array(12).fill({ oneRow: true, overflow: 0, sliderOk: true }));
  }, 90000);
});
