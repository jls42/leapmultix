/**
 * Tests E2E - Bouton « retour » du téléphone dans l'appli Android : l'appli envoie
 * « backbutton » à la page (js/back-navigation.js), qui recule d'un écran, sur les vrais
 * écrans du jeu. L'événement non annulé veut dire que l'appli se ferme.
 * @jest-environment node
 */

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import puppeteer from 'puppeteer';
import { startStaticServer } from '../../tests/utils/static-server.cjs';
import {
  answerGameDialog,
  createUserAndSkipIntro,
  gameDialogState,
  launchArcadeGame,
  pressButton,
} from '../helpers/game-session.mjs';
import { NO_SEASON } from '../../js/core/seasons.js';

const PHONE_VIEWPORT = {
  width: 390,
  height: 844,
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
};

describe('Bouton retour de l’appli (E2E)', () => {
  let browser;
  let page;
  let server;
  let errors;

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

  beforeEach(async () => {
    page = await browser.newPage();
    errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    await page.setViewport(PHONE_VIEWPORT);
    await page.goto(`${server.url}?saison=${NO_SEASON}`, server.gotoOptions);
    await createUserAndSkipIntro(page);
  }, 30000);

  afterEach(async () => {
    expect(errors).toEqual([]);
    await page.close();
  });

  /** Ce que l'appli fait au bouton retour : true si le jeu a reculé */
  const pressBack = () =>
    page.evaluate(() => !document.dispatchEvent(new Event('backbutton', { cancelable: true })));

  /** Attend l'écran et son titre : le retour change d'écran à son rythme */
  const waitForScreen = (slideId, title) =>
    page.waitForFunction(
      (id, text) => {
        const slide = document.querySelector('.slide.active-slide');
        const seen = Array.from(slide?.querySelectorAll('h1, h2') ?? []).find(el =>
          el.checkVisibility({ checkVisibilityCSS: true })
        );
        return slide?.id === id && (!text || seen?.textContent.includes(text));
      },
      { timeout: 10000 },
      slideId,
      title ?? null
    );

  /** Retour pris par le jeu, puis l'écran attendu */
  async function backTo(slideId, title) {
    expect(await pressBack()).toBe(true);
    await waitForScreen(slideId, title);
  }

  test('de l’accueil : « Qui joue ? », puis l’appli se ferme', async () => {
    await backTo('slide0');
    expect(await pressBack()).toBe(false);
  }, 60000);

  test('Découverte : une table, la liste des tables, l’accueil', async () => {
    await pressButton(page, '.mode-btn[data-mode="discovery"]');
    await pressButton(page, '.slide.active-slide [data-table]');
    await page.waitForSelector('#discovery-table-back-btn', { visible: true, timeout: 10000 });
    expect(await pressBack()).toBe(true);
    await page.waitForSelector('.slide.active-slide [data-table]', { visible: true });
    await backTo('slide1');
  }, 60000);

  test('Chrono : les classements, les réglages, l’accueil', async () => {
    await pressButton(page, '.mode-btn[data-mode="chrono"]');
    await pressButton(page, '#chrono-open-stats');
    await page.waitForSelector('#chrono-stats-back-setup', { visible: true, timeout: 10000 });
    expect(await pressBack()).toBe(true);
    await page.waitForSelector('#chrono-start', { visible: true, timeout: 10000 });
    await backTo('slide1');
  }, 60000);

  test('Quiz : la question d’abandon, un second retour la ferme, la partie continue', async () => {
    await pressButton(page, '.mode-btn[data-mode="quiz"]');
    await page.waitForSelector('.slide.active-slide .game-quit button', { visible: true });
    expect(await gameDialogState(page)).toBeNull();
    expect(await pressBack()).toBe(true);
    await page.waitForSelector('[role="alertdialog"]', { visible: true, timeout: 5000 });
    expect((await gameDialogState(page)).focused).toBe('cancel');
    expect(await pressBack()).toBe(true);
    await page.waitForFunction(() => !document.querySelector('[role="alertdialog"]'));
    expect(await page.$eval('.slide.active-slide', slide => slide.id)).toBe('slide4');
    // Abandon confirmé : l'écran de fin, puis l'accueil, jamais la partie
    expect(await pressBack()).toBe(true);
    await answerGameDialog(page, true);
    await waitForScreen('slide5');
    await backTo('slide1');
  }, 60000);

  test('Arcade : une partie, sa fin, le menu Arcade, l’accueil', async () => {
    await pressButton(page, '.mode-btn[data-mode="arcade"]');
    await launchArcadeGame(page, 'multipop');
    expect(await pressBack()).toBe(true);
    await answerGameDialog(page, true);
    await page.waitForSelector('#arcade-back-btn', { visible: true, timeout: 10000 });
    expect(await pressBack()).toBe(true);
    await page.waitForSelector('.arcade-game-card', { visible: true, timeout: 10000 });
    await backTo('slide1');
  }, 60000);

  test('menu ☰ ouvert : le retour le ferme, sans changer d’écran', async () => {
    await pressButton(page, '.slide.active-slide .burger-menu-btn');
    await page.waitForSelector('.slide.active-slide .top-bar-nav.is-open', { timeout: 5000 });
    expect(await pressBack()).toBe(true);
    await page.waitForFunction(() => !document.querySelector('.top-bar-nav.is-open'));
    expect(await page.$eval('.slide.active-slide', slide => slide.id)).toBe('slide1');
  }, 60000);

  test('À propos, confidentialité : le retour remonte chaque page', async () => {
    await page.evaluate(() =>
      document.querySelector('.slide.active-slide .top-bar [data-slide="8"]').click()
    );
    await waitForScreen('slide8');
    await pressButton(page, '.slide.active-slide [data-slide="10"]');
    await waitForScreen('slide10');
    await backTo('slide8');
    await backTo('slide1');
  }, 60000);
});
