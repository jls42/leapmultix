/**
 * Tests E2E - Hors ligne après une première visite (wifi d'école coupé) : le service worker a
 * tout gardé, sans qu'aucun mode n'ait été ouvert en ligne. Sans réseau, recharger affiche le
 * jeu (pas « Tu es hors ligne »), chacun des 6 modes et des 4 jeux d'Arcade démarre, et un
 * bruitage se charge. Réseau coupé pour de bon : le serveur ferme toute connexion, et la
 * page se croit hors ligne (navigator.onLine).
 * @jest-environment node
 */

const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer');
const { createUserAndSkipIntro } = require('../../utils/game-session.cjs');
const { startStaticServer } = require('../../utils/static-server.cjs');

const GENERATED_MAP = 'assets/generated-images/image-map.json';
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

/** Clic direct sur un bouton, une fois visible */
async function press(page, selector) {
  const button = await page.waitForSelector(selector, { visible: true, timeout: 10000 });
  await button.evaluate(el => el.click());
}

async function waitForText(page, selector, pattern) {
  await page.waitForFunction(
    (sel, source) => new RegExp(source).test(document.querySelector(sel)?.textContent ?? ''),
    { timeout: 10000 },
    selector,
    pattern.source
  );
}

/** Chaque mode : comment le lancer depuis son écran, et ce qui prouve qu'il a démarré */
const MODES = [
  ['quiz', async page => waitForText(page, '#quiz-question', /\d/)],
  [
    'challenge',
    async page => {
      await press(page, '.difficulty-btn[data-difficulty="easy"]');
      await waitForText(page, '#challenge-question', /\d/);
      await press(page, '#challenge-abandon');
    },
  ],
  [
    'adventure',
    async page => {
      await press(page, '[data-level="1"]');
      await waitForText(page, '#adventure-question', /\d/);
    },
  ],
  ['discovery', async page => press(page, '.lab-item')],
  [
    'chrono',
    async page => {
      await press(page, '#chrono-start');
      await waitForText(page, '#chrono-question', /\?/);
    },
  ],
];
const ARCADE_GAMES = ['invasion', 'multimiam', 'multisnake', 'multimemory'];

async function goHome(page) {
  await page.evaluate(() => {
    const button =
      document.querySelector('.slide.active-slide .home-btn:not([hidden])') ||
      document.querySelector('[data-slide="1"]');
    button?.click();
    // Partie en cours : la fenêtre du jeu demande confirmation (js/game-exit.js)
    document.querySelector('[role="alertdialog"] [data-answer="confirm"]')?.click();
  });
  await page.waitForSelector('.mode-btn[data-mode="quiz"]', { visible: true, timeout: 10000 });
}

/** Coupe le réseau : serveur muet, page hors ligne, service worker hors ligne */
async function cutNetwork(browser, page, server) {
  server.setReachable?.(false);
  await page.setOfflineMode(true);
  const workers = browser.targets().filter(target => target.type() === 'service_worker');
  for (const worker of workers) {
    const session = await worker.createCDPSession();
    await session.send('Network.enable');
    await session.send('Network.emulateNetworkConditions', {
      offline: true,
      latency: 0,
      downloadThroughput: -1,
      uploadThroughput: -1,
    });
  }
}

/** Ouvre le profil créé en ligne ; la vidéo d'accueil, absente hors ligne, se referme seule */
async function openPlayer(page) {
  await press(page, '.user-container .user-tile');
  const intro = await page
    .waitForSelector('#character-intro-modal', { visible: true, timeout: 3000 })
    .catch(() => null);
  if (intro) await page.evaluate(() => document.getElementById('skip-intro-btn')?.click());
  await page.waitForSelector('.mode-btn[data-mode="quiz"]', { visible: true, timeout: 15000 });
}

describe('Hors ligne après une première visite', () => {
  let browser;
  let page;
  let server;
  const failures = [];
  const errors = [];

  beforeAll(async () => {
    server = await startStaticServer('networkidle2');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    const origin = new URL(server.url).origin;
    page.on('requestfailed', request => {
      const reason = request.failure()?.errorText ?? '';
      if (request.url().startsWith(origin) && reason !== 'net::ERR_ABORTED') {
        failures.push(`${request.url().slice(origin.length)} ${reason}`);
      }
    });
    page.on('pageerror', error => errors.push(error.message));
    page.on('dialog', dialog => dialog.accept());

    // Première visite, en ligne : un profil, et le service worker qui a tout préchargé
    await page.goto(server.url, server.gotoOptions);
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null, {
      timeout: 90000,
    });
    await createUserAndSkipIntro(page);
    await cutNetwork(browser, page, server);
  }, 150000);

  afterAll(async () => {
    await browser?.close();
    await server?.stop();
  });

  test('recharger sans réseau affiche le jeu, pas « Tu es hors ligne »', async () => {
    await page.reload({ waitUntil: 'load', timeout: 30000 });
    expect(await page.evaluate(() => navigator.onLine)).toBe(false);
    await page.waitForSelector('.user-container .user-tile', { visible: true, timeout: 15000 });
    expect(await page.title()).not.toMatch(/hors ligne/i);
    await openPlayer(page);
  }, 60000);

  test.each(MODES)(
    '%s démarre sans réseau',
    async (mode, started) => {
      await goHome(page);
      await press(page, `.mode-btn[data-mode="${mode}"]`);
      await started(page);
    },
    30000
  );

  test.each(ARCADE_GAMES)(
    'le jeu d’Arcade %s démarre sans réseau',
    async game => {
      await goHome(page);
      await press(page, '.mode-btn[data-mode="arcade"]');
      // Tuile du jeu dépliée, puis « Jouer »
      const card = `.arcade-game-card[data-game="${game}"]`;
      await page.waitForSelector(card, { visible: true, timeout: 10000 });
      const expanded = await page.$eval(card, el => el.classList.contains('expanded'));
      if (!expanded) await press(page, `${card} .arcade-game-toggle`);
      await press(page, `${card} .play-arcade-btn`);
      await page.waitForSelector('#game canvas', { visible: true, timeout: 10000 });
      await pause(1000);
    },
    30000
  );

  test('un bruitage se charge sans réseau', async () => {
    const sound = await page.evaluate(
      () =>
        new Promise(resolve => {
          const audio = new Audio('assets/sounds/mixkit-electronic-lock-success-beeps-2852.wav');
          audio.addEventListener('canplaythrough', () => resolve({ duration: audio.duration }));
          audio.addEventListener('error', () => resolve({ error: audio.error?.code }));
          audio.load();
          setTimeout(() => resolve({ timeout: true }), 8000);
        })
    );
    expect(sound.duration).toBeGreaterThan(0);
  }, 15000);

  test('aucune requête du site en échec, aucune erreur de page', () => {
    // Sans images générées (CI : npm run assets:generate ne tourne qu'au déploiement), leur
    // carte et leurs variantes n'existent pas : la page prend alors les originaux, gardés
    const generated = fs.existsSync(path.resolve(__dirname, '../../../', GENERATED_MAP));
    const absent = /^\/assets\/(?:generated-images\/|images\/image-map\.json)/;
    expect(failures.filter(failure => generated || !absent.test(failure))).toEqual([]);
    expect(errors).toEqual([]);
  });
});
