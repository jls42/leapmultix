/**
 * Tests E2E - Écran de téléphone : la page reste hors de l'encoche de caméra (zones sûres,
 * comme dans l'appli Android en plein écran sur Android 15 et plus), et une partie d'Arcade
 * lancée au doigt passe d'elle-même en plein écran.
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

  /** Page du téléphone, avec ou sans encoche, au menu Arcade */
  async function openArcade({ notch }) {
    page = await browser.newPage();
    await page.setUserAgent(ANDROID_USER_AGENT);
    await page.setViewport(PHONE_VIEWPORT);
    if (notch) {
      const client = await page.createCDPSession();
      await client.send('Emulation.setSafeAreaInsetsOverride', {
        insets: { top: NOTCH_PX, topMax: NOTCH_PX, bottom: 0, left: 0, right: 0 },
      });
    }
    await page.goto(`${server.url}?saison=${NO_SEASON}`, server.gotoOptions);
    await createUserAndSkipIntro(page);
    await pressButton(page, '.mode-btn[data-mode="arcade"]');
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

  test('un vrai toucher sur « Jouer » met la partie en plein écran', async () => {
    await openArcade({ notch: false });
    const card = '.arcade-game-card[data-game="multipop"]';
    await pressButton(page, `${card} .arcade-game-toggle`);
    const play = await page.waitForSelector(`${card} .play-arcade-btn`, { visible: true });
    await play.evaluate(el => el.scrollIntoView({ block: 'center' }));
    const box = await play.boundingBox();
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForFunction(() => document.fullscreenElement?.id === 'game', {
      timeout: 10000,
    });
    expect(
      await page.$eval('.arcade-fullscreen-btn', button => button.getAttribute('aria-label'))
    ).toBe('Quitter le plein écran');
  }, 60000);
});
