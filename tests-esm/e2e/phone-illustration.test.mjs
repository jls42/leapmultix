/**
 * Tests E2E - Illustration du personnage : sur téléphone, un bandeau en haut de la page,
 * visible entre la barre du haut et la carte hors partie ; sur ordinateur, le fond fixe de
 * toujours, la carte juste sous la barre.
 * @jest-environment node
 */

import { afterAll, afterEach, beforeAll, describe, expect, test } from '@jest/globals';
import puppeteer from 'puppeteer';
import { startStaticServer } from '../../tests/utils/static-server.cjs';
import { createUserAndSkipIntro } from '../helpers/game-session.mjs';
import { NO_SEASON } from '../../js/core/seasons.js';

const PHONE = { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
const DESKTOP = { width: 1280, height: 900 };
const ANDROID_USER_AGENT =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36';

/** L'accueil : écart entre la barre du haut et la carte, et le fond de la page */
function homeLayout(page) {
  return page.evaluate(() => {
    const slide = document.querySelector('.slide.active-slide');
    const bar = slide.querySelector(':scope > .top-bar').getBoundingClientRect();
    const card = slide.querySelector(':scope > .content-card').getBoundingClientRect();
    const style = getComputedStyle(document.body);
    return {
      slide: slide.id,
      gap: Math.round(card.top - bar.bottom),
      // Une valeur par couche : toutes pareilles ici
      attachment: [...new Set(style.backgroundAttachment.split(', '))].join(),
      // Une taille par couche de fond
      layers: style.backgroundSize.split(',').length,
      illustration: /background_[a-z]+_\d+/.test(style.backgroundImage),
    };
  });
}

describe('Illustration du personnage (E2E)', () => {
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

  afterEach(async () => {
    if (page) await page.close();
    page = null;
  });

  async function openHome(viewport, userAgent) {
    page = await browser.newPage();
    if (userAgent) await page.setUserAgent(userAgent);
    await page.setViewport(viewport);
    await page.goto(`${server.url}?saison=${NO_SEASON}`, server.gotoOptions);
    await createUserAndSkipIntro(page);
  }

  test('téléphone : un bandeau illustré, qui défile, entre la barre et la carte', async () => {
    await openHome(PHONE, ANDROID_USER_AGENT);
    const home = await homeLayout(page);
    expect(home.illustration).toBe(true);
    // Le bandeau qui se fond dans la page, puis l'illustration
    expect(home.layers).toBe(2);
    expect(home.attachment).toBe('scroll');
    // La carte s'ouvre plus bas : environ un tiers de la largeur de l'écran
    expect(home.gap).toBeGreaterThan(PHONE.width / 4);
  }, 40000);

  test('ordinateur : le fond fixe de toujours, la carte juste sous la barre', async () => {
    await openHome(DESKTOP);
    const home = await homeLayout(page);
    expect(home.illustration).toBe(true);
    expect(home.layers).toBe(1);
    expect(home.attachment).toBe('fixed');
    expect(home.gap).toBeLessThan(40);
  }, 40000);
});
