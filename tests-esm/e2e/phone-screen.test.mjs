/**
 * Tests E2E - Écran de téléphone : la page reste hors de l'encoche de caméra (zones sûres,
 * comme dans l'appli Android en plein écran sur Android 15 et plus), et une partie d'Arcade
 * lancée au doigt passe d'elle-même en plein écran, son bandeau au-dessus du plateau.
 * @jest-environment node
 */

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import puppeteer from 'puppeteer';
import { startStaticServer } from '../../tests/utils/static-server.cjs';
import { createUserAndSkipIntro, pressButton } from '../helpers/game-session.mjs';
import { NO_SEASON } from '../../js/core/seasons.js';

const PHONE_VIEWPORT = {
  width: 390,
  height: 844,
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
};
const ANDROID_USER_AGENT =
  'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36';
// Encoche de caméra en haut de l'écran, comme un téléphone à poinçon
const NOTCH_PX = 40;
// Le même téléphone tourné : l'encoche passe sur le côté gauche
const TURNED_VIEWPORT = { ...PHONE_VIEWPORT, width: 844, height: 390 };
const ARCADE_GAMES = [
  'invasion',
  'multimiam',
  'multimemory',
  'multisnake',
  'multipop',
  'multigoal',
];

/** Haut de la barre du haut de l'écran affiché, en pixels de la fenêtre */
function topBarTop(page) {
  return page.$eval('.slide.active-slide .top-bar', bar =>
    Math.round(bar.getBoundingClientRect().top)
  );
}

describe('Écran de téléphone (E2E)', () => {
  let browser;
  let page;
  let server;

  beforeAll(async () => {
    server = await startStaticServer('networkidle0');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }, 30000);

  afterAll(async () => {
    if (browser) await browser.close();
    if (server) await server.stop();
  });

  /** Page du téléphone, avec ou sans encoche (en haut, ou à gauche s'il est tourné), au menu Arcade */
  async function openArcade({ notch, turned = false }) {
    page = await browser.newPage();
    await page.setUserAgent(ANDROID_USER_AGENT);
    await page.setViewport(turned ? TURNED_VIEWPORT : PHONE_VIEWPORT);
    if (notch) {
      const client = await page.createCDPSession();
      const insets = { top: 0, bottom: 0, left: 0, right: 0 };
      if (turned) Object.assign(insets, { left: NOTCH_PX, leftMax: NOTCH_PX });
      else Object.assign(insets, { top: NOTCH_PX, topMax: NOTCH_PX });
      await client.send('Emulation.setSafeAreaInsetsOverride', { insets });
    }
    await page.goto(`${server.url}?saison=${NO_SEASON}`, server.gotoOptions);
    await createUserAndSkipIntro(page);
    await pressButton(page, '.mode-btn[data-mode="arcade"]');
    // Mesures sur l'écran de l'Arcade installé : affiché, page remise en haut, entrée animée
    // terminée (sinon, sur une machine lente, la barre se mesure en cours de route)
    await page.waitForFunction(
      () =>
        document.querySelector('#slide4.active-slide .top-bar') !== null &&
        window.scrollY === 0 &&
        document
          .getAnimations()
          .every(a => a.playState !== 'running' || a.effect?.getTiming().iterations === Infinity),
      { timeout: 10000 }
    );
  }

  beforeEach(() => {
    page = null;
  });

  afterEach(async () => {
    if (page) await page.close();
  });

  test('sans encoche, la page commence en haut ; avec, juste en dessous', async () => {
    await openArcade({ notch: false });
    const plain = await topBarTop(page);
    await page.close();
    await openArcade({ notch: true });
    expect(await topBarTop(page)).toBe(plain + NOTCH_PX);
  }, 60000);

  test('avec l’encoche, une partie d’Arcade tient toujours dans l’écran', async () => {
    await openArcade({ notch: true });
    const card = '.arcade-game-card[data-game="multipop"]';
    await pressButton(page, `${card} .arcade-game-toggle`);
    await pressButton(page, `${card} .play-arcade-btn`);
    await page.waitForSelector('#game canvas', { visible: true, timeout: 10000 });
    const overflow = await page.evaluate(
      ({ width, height }) => {
        const root = document.documentElement;
        return { x: root.scrollWidth - width, y: root.scrollHeight - height };
      },
      { width: PHONE_VIEWPORT.width, height: PHONE_VIEWPORT.height }
    );
    expect(overflow).toEqual({ x: 0, y: 0 });
    // Le bandeau du jeu reste sous l'encoche
    const bannerTop = await page.$eval('.arcade-mult-display', el =>
      Math.round(el.getBoundingClientRect().top)
    );
    expect(bannerTop).toBeGreaterThanOrEqual(NOTCH_PX);
  }, 60000);

  /** Lance un jeu par un vrai toucher sur « Jouer » : la partie passe en plein écran */
  async function tapPlay(game) {
    const card = `.arcade-game-card[data-game="${game}"]`;
    await pressButton(page, `${card} .arcade-game-toggle`);
    const play = await page.waitForSelector(`${card} .play-arcade-btn`, { visible: true });
    await play.evaluate(el => el.scrollIntoView({ block: 'center' }));
    const box = await play.boundingBox();
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForFunction(() => document.fullscreenElement?.id === 'game', {
      timeout: 10000,
    });
  }

  test('un vrai toucher sur « Jouer » met la partie en plein écran', async () => {
    await openArcade({ notch: false });
    await tapPlay('multipop');
    expect(
      await page.$eval('.arcade-fullscreen-btn', button => button.getAttribute('aria-label'))
    ).toBe('Quitter le plein écran');
  }, 60000);

  /**
   * La partie en plein écran, en pixels de la fenêtre : bandeau, zone de jeu, plateau et
   * « Abandonner », ce qu'un doigt touche en haut du plateau, et ce qui défile
   */
  async function fullscreenLayout() {
    await page.waitForSelector('#game canvas', { visible: true, timeout: 10000 });
    // Bouton plein écran monté, puis deux images : le bandeau et le plateau ont leur place
    await page.waitForSelector('.arcade-fullscreen-btn', { visible: true, timeout: 5000 });
    await page.evaluate(
      () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    );
    return page.evaluate(() => {
      const game = document.querySelector('#game');
      const banner = document.querySelector('.arcade-mult-display');
      const canvas = game.querySelector('canvas');
      const box = el => {
        const r = el.getBoundingClientRect();
        return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
      };
      const board = box(canvas);
      const bar = box(banner);
      const touched = document.elementFromPoint((board.left + board.right) / 2, board.top + 2);
      return {
        banner: bar,
        board,
        abandon: box(game.querySelector('[id$="-abandon-btn"]')),
        // Écart entre le bas du bandeau et le haut de la zone de jeu, et celui que la feuille
        // de style demande
        gap: Math.round(box(canvas.closest('.arcade-game-ui')).top - bar.bottom),
        wanted: Math.round(Number.parseFloat(getComputedStyle(banner).marginBottom)),
        topOfBoard: touched?.tagName ?? null,
        scroll: game.scrollHeight - game.clientHeight,
        view: { width: innerWidth, height: innerHeight },
      };
    });
  }

  /** Rien ne recouvre le plateau, rien ne défile, tout reste à l'écran et hors de l'encoche */
  function expectClearBoard(seen, { top = 0, left = 0 } = {}) {
    expect(seen.gap).toBe(seen.wanted);
    expect(seen.topOfBoard).toBe('CANVAS');
    expect(seen.banner.bottom).toBeLessThanOrEqual(seen.board.top);
    expect(seen.banner.top).toBeGreaterThanOrEqual(top);
    expect(Math.min(seen.banner.left, seen.board.left)).toBeGreaterThanOrEqual(left);
    expect(seen.scroll).toBe(0);
    expect(seen.board.bottom).toBeLessThanOrEqual(seen.view.height);
    expect(seen.abandon.bottom).toBeLessThanOrEqual(seen.view.height);
  }

  test('plein écran sans encoche : le bandeau reste au-dessus du plateau de MultiInvaders', async () => {
    await openArcade({ notch: false });
    await tapPlay('invasion');
    expectClearBoard(await fullscreenLayout());
  }, 60000);

  test.each(ARCADE_GAMES)(
    'plein écran avec l’encoche, %s : le bandeau reste au-dessus du plateau, sous l’encoche',
    async game => {
      await openArcade({ notch: true });
      await tapPlay(game);
      expectClearBoard(await fullscreenLayout(), { top: NOTCH_PX });
    },
    60000
  );

  test.each(ARCADE_GAMES)(
    'plein écran, téléphone tourné, encoche à gauche, %s : bandeau et plateau à côté de l’encoche',
    async game => {
      await openArcade({ notch: true, turned: true });
      await tapPlay(game);
      expectClearBoard(await fullscreenLayout(), { left: NOTCH_PX });
    },
    60000
  );
});
