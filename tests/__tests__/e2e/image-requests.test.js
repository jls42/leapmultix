/**
 * Tests E2E - Aucune image demandée sous deux adresses. js/cache-updater.js ajoute la version
 * du jeu (?v=) à l'adresse des images insérées, mais une image déjà en chargement repartait
 * alors une seconde fois, à sa nouvelle adresse (deux entrées de cache, deux téléchargements).
 * Mesuré avant : le mur des bandes de MultiMiam (fond de css/arcade.css, 15,6 Ko).
 * La même adresse redemandée n'est pas un doublon : servie par le cache, ou, sans variantes
 * générées (CI), variante en 404 retentée à chaque affichage puis PNG de repli.
 * Premier passage, sans service worker : rien ne vient d'un cache.
 * @jest-environment node
 */

const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer');
const { createUserAndSkipIntro, answerGameDialog } = require('../../utils/game-session.cjs');
const { startStaticServer } = require('../../utils/static-server.cjs');

const ROOT = path.resolve(__dirname, '../../..');
// Variantes WebP du générateur (npm run assets:generate) : absentes en CI, où les jeux
// passent à leurs PNG ; sur un poste qui les a, le passage sans elles se vérifie aussi
const GENERATED = fs.existsSync(
  path.join(ROOT, 'assets/generated-images/arcade/logo_multimiam-512.webp')
);
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
 * Les adresses d'images demandées par la page, rangées par fichier (chemin sans paramètres),
 * à partir de start()
 * @param {import('puppeteer').Page} page
 */
async function watchImageRequests(page) {
  const cdp = await page.createCDPSession();
  await cdp.send('Network.enable');
  const addresses = new Map();
  let recording = false;
  cdp.on('Network.requestWillBeSent', ({ type, request }) => {
    if (!recording || type !== 'Image' || request.url.startsWith('data:')) return;
    const url = new URL(request.url);
    if (!addresses.has(url.pathname)) addresses.set(url.pathname, new Set());
    addresses.get(url.pathname).add(`${url.pathname}${url.search}`);
  });
  return {
    start: () => {
      recording = true;
    },
    /** Fichiers demandés sous plus d'une adresse, avec ces adresses */
    underSeveralAddresses: () =>
      [...addresses.values()].filter(urls => urls.size > 1).map(urls => [...urls].join(' + ')),
    files: () => addresses.size,
  };
}

/** Plus aucune variante générée, dès la première page : le cas de la CI */
async function withoutVariants(page) {
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (request.url().includes('/assets/generated-images/')) {
      request.respond({ status: 404, contentType: 'text/plain', body: 'absent' });
    } else {
      request.continue();
    }
  });
}

const RUNS = [
  ['tel que servi', false],
  ['sans variantes générées (comme en CI)', true],
];

describe('Aucune image demandée sous deux adresses (E2E)', () => {
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

  // Sans variantes sur le poste (CI), le premier passage est déjà celui-là
  const runs = RUNS.filter(([, forced]) => GENERATED || !forced);

  test.each(runs)(
    'menu de l’Arcade et ses quatre jeux, %s',
    async (_label, forced) => {
      page = await browser.newPage();
      await page.setBypassServiceWorker(true);
      await page.setUserAgent(ANDROID_USER_AGENT);
      await page.setViewport(PHONE);
      if (forced) await withoutVariants(page);
      const requests = await watchImageRequests(page);
      await page.goto(server.url, server.gotoOptions);
      await createUserAndSkipIntro(page);
      requests.start();
      await pressButton(page, '.mode-btn[data-mode="arcade"]');
      for (const game of ARCADE_GAMES) await playAndLeave(page, game);

      expect(requests.files()).toBeGreaterThan(20);
      expect(requests.underSeveralAddresses()).toEqual([]);
    },
    90000
  );
});
