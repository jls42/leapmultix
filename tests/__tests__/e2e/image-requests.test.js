/**
 * Tests E2E - Chaque image ne se télécharge qu'une fois. js/cache-updater.js met la version
 * du jeu (?v=) dans l'adresse des images insérées : la prod les sert 30 jours sans les
 * revérifier, et une image changée sous le même nom resterait sinon l'ancienne. Mais une image
 * dont le chargement a déjà commencé repart alors une seconde fois, à sa nouvelle adresse.
 * Mesuré avant : le mur des bandes de MultiMiam (fond de css/arcade.css, 15,6 Ko).
 * Premier passage, sans service worker : rien ne vient d'un cache.
 * @jest-environment node
 */

const puppeteer = require('puppeteer');
const { createUserAndSkipIntro, answerGameDialog } = require('../../utils/game-session.cjs');
const { startStaticServer } = require('../../utils/static-server.cjs');

const PHONE = { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
const ANDROID_USER_AGENT =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36';
const ARCADE_GAMES = ['invasion', 'multimiam', 'multimemory', 'multisnake'];

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

async function pressButton(page, selector) {
  const button = await page.waitForSelector(selector, { visible: true, timeout: 10000 });
  await button.evaluate(el => el.click());
}

/** Une partie lancée depuis le menu de l'Arcade, puis abandonnée */
async function playAndLeave(page, game) {
  const card = `.arcade-game-card[data-game="${game}"]`;
  await page.waitForSelector(card, { visible: true, timeout: 10000 });
  const expanded = await page.$eval(card, el => el.classList.contains('expanded'));
  if (!expanded) await pressButton(page, `${card} .arcade-game-toggle`);
  await pressButton(page, `${card} .play-arcade-btn`);
  await page.waitForSelector('#game canvas', { visible: true, timeout: 10000 });
  await pause(1500);
  await pressButton(page, '#game [id$="abandon-btn"]');
  await answerGameDialog(page, true);
  await pressButton(page, '#arcade-back-btn');
}

/**
 * Les requêtes d'images de la page, comptées par fichier (sans paramètres) à partir de
 * start() : chaque requête compte, pas seulement chaque adresse
 * @param {import('puppeteer').Page} page
 */
async function countImageRequests(page) {
  const cdp = await page.createCDPSession();
  await cdp.send('Network.enable');
  const counts = new Map();
  let recording = false;
  cdp.on('Network.requestWillBeSent', ({ type, request }) => {
    if (!recording || type !== 'Image' || request.url.startsWith('data:')) return;
    const { pathname } = new URL(request.url);
    counts.set(pathname, (counts.get(pathname) ?? 0) + 1);
  });
  return {
    start: () => {
      recording = true;
    },
    requestedTwice: () =>
      [...counts].filter(([, count]) => count > 1).map(([file, count]) => `${file} ×${count}`),
    files: () => counts.size,
  };
}

describe('Images téléchargées une seule fois (E2E)', () => {
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

  test('menu de l’Arcade et ses quatre jeux : aucune image demandée deux fois', async () => {
    page = await browser.newPage();
    await page.setBypassServiceWorker(true);
    await page.setUserAgent(ANDROID_USER_AGENT);
    await page.setViewport(PHONE);
    const requests = await countImageRequests(page);
    await page.goto(server.url, server.gotoOptions);
    await createUserAndSkipIntro(page);
    requests.start();
    await pressButton(page, '.mode-btn[data-mode="arcade"]');
    for (const game of ARCADE_GAMES) await playAndLeave(page, game);

    expect(requests.files()).toBeGreaterThan(20);
    expect(requests.requestedTwice()).toEqual([]);
  }, 90000);
});
