/**
 * Tests E2E - Réseau qui ne répond pas, après une première visite : wifi d'école sans
 * Internet, portail captif, filtre qui retient. Le serveur accepte les connexions mais ne
 * répond jamais ; navigator.onLine reste vrai. Passé le délai du service worker, la copie
 * gardée sert « Qui joue ? », puis un mode et un jeu d'Arcade, chacun dans le délai + 2 s.
 * Sur un réseau lent qui répond (3G bridée), le réseau l'emporte pour la page et les fichiers
 * sans ?v= : aucune copie servie à leur place. Ceux de cette version (?v=, toutes les adresses
 * d'un site déployé) viennent de leur copie préchargée, la même version par construction.
 * @jest-environment node
 */

const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer');
const { createUserAndSkipIntro } = require('../../utils/game-session.cjs');
const { startStaticServer } = require('../../utils/static-server.cjs');

// Délai du service worker (NETWORK_TIMEOUT_MS de sw.js) ; chaque étape a 2 s de plus
const SW_SOURCE = fs.readFileSync(path.resolve(__dirname, '../../../sw.js'), 'utf8');
const NETWORK_TIMEOUT_MS = Number(/const NETWORK_TIMEOUT_MS = (\d+);/.exec(SW_SOURCE)?.[1] ?? 4000);
const STEP_LIMIT_MS = NETWORK_TIMEOUT_MS + 2000;
// Version du service worker : ses adresses ?v=<VERSION> viennent toujours de leur copie
const SW_VERSION = /^const VERSION = '([^']+)';/m.exec(SW_SOURCE)[1];

// 3G de la sonde des réseaux lents (150 ms, 1,6 Mbit/s), simulée par le serveur : elle vaut
// pour la page comme pour le service worker, dans tout navigateur (l'émulation de Chrome ne
// bride pas le réseau du service worker dans toutes ses versions)
const NETWORK_3G = { latencyMs: 150, bytesPerSecond: (1.6 * 1024 * 1024) / 8 };

const visible = (page, selector, timeout) =>
  page.waitForFunction(
    sel => [...document.querySelectorAll(sel)].some(el => el.getClientRects().length > 0),
    { timeout },
    selector
  );
const press = (page, selector) =>
  page.evaluate(
    sel => [...document.querySelectorAll(sel)].find(el => el.getClientRects().length > 0)?.click(),
    selector
  );

/** Première visite en ligne : un joueur, et le service worker aux commandes */
async function firstVisit(browser, server) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  page.on('dialog', dialog => dialog.accept());
  await page.goto(server.url, server.gotoOptions);
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null, {
    timeout: 90000,
  });
  await createUserAndSkipIntro(page);
  return page;
}

/** Ouvre le joueur ; la fenêtre de la vidéo d'avatar, si elle s'ouvre, est passée */
async function openPlayer(page, timeout) {
  await press(page, '.user-container .user-tile');
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const ready = await page.evaluate(() =>
      [...document.querySelectorAll('.mode-btn[data-mode="quiz"]')].some(
        el => el.getClientRects().length > 0
      )
    );
    if (ready) return;
    await page.evaluate(() => document.getElementById('skip-intro-btn')?.click());
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('accueil du joueur absent');
}

/** Une étape chronométrée : rend sa durée, ou échoue au-delà de la limite */
async function timed(step) {
  const start = Date.now();
  await step();
  return Date.now() - start;
}

describe('Réseau muet après une première visite', () => {
  let browser;
  let server;
  let page;

  beforeAll(async () => {
    server = await startStaticServer('networkidle2');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--mute-audio'],
    });
    page = await firstVisit(browser, server);
    server.setSilent(true);
  }, 150000);

  afterAll(async () => {
    await browser?.close();
    await server?.stop();
  });

  test('recharger : « Qui joue ? » dans le délai + 2 s, au lieu d’attendre sans fin', async () => {
    await page.evaluate(() => {
      globalThis.pageAvantRechargement = true;
    });
    const ms = await timed(async () => {
      // La navigation n'aboutira jamais par le réseau : on n'attend que la copie
      page.reload({ waitUntil: 'domcontentloaded', timeout: 0 }).catch(() => {});
      await page.waitForFunction(
        () =>
          !globalThis.pageAvantRechargement &&
          [...document.querySelectorAll('.user-container .user-tile')].some(
            el => el.getClientRects().length > 0
          ),
        { timeout: STEP_LIMIT_MS }
      );
    });
    expect(ms).toBeLessThan(STEP_LIMIT_MS);
    await openPlayer(page, STEP_LIMIT_MS);
  }, 30000);

  test('un mode démarre dans le délai + 2 s', async () => {
    const ms = await timed(async () => {
      await press(page, '.mode-btn[data-mode="quiz"]');
      await visible(page, '#quiz-options .option', STEP_LIMIT_MS);
    });
    expect(ms).toBeLessThan(STEP_LIMIT_MS);
  }, 30000);

  test('un jeu d’Arcade démarre dans le délai + 2 s', async () => {
    await press(page, '.home-btn');
    await page.evaluate(() =>
      document.querySelector('[role="alertdialog"] [data-answer="confirm"]')?.click()
    );
    await visible(page, '.mode-btn[data-mode="arcade"]', STEP_LIMIT_MS);
    const ms = await timed(async () => {
      await press(page, '.mode-btn[data-mode="arcade"]');
      const card = '.arcade-game-card[data-game="multimiam"]';
      await visible(page, card, STEP_LIMIT_MS);
      const expanded = await page.$eval(card, el => el.classList.contains('expanded'));
      if (!expanded) await press(page, `${card} .arcade-game-toggle`);
      await press(page, `${card} .play-arcade-btn`);
      await visible(page, '#multimiam-canvas', STEP_LIMIT_MS);
    });
    expect(ms).toBeLessThan(STEP_LIMIT_MS * 2);
  }, 40000);
});

describe('3G bridée qui répond : le réseau l’emporte', () => {
  let browser;
  let server;
  let page;
  const responses = [];
  let reloadedAt = 0;
  let tilesAfterMs = 0;

  beforeAll(async () => {
    server = await startStaticServer('networkidle2');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--mute-audio'],
    });
    page = await firstVisit(browser, server);
    server.setSlow(NETWORK_3G);
    const pageSession = await page.createCDPSession();
    await pageSession.send('Network.enable');
    // Ce que reçoit la page ; l'en-tête Date dit si la réponse vient d'arriver du serveur
    const origin = new URL(server.url).origin;
    pageSession.on('Network.responseReceived', ({ type, response }) => {
      if (!['Document', 'Script', 'Stylesheet'].includes(type)) return;
      if (!response.url.startsWith(origin)) return;
      const date = Date.parse(response.headers.date ?? response.headers.Date ?? '');
      responses.push({ type, url: response.url, date });
    });
    // La première visite est ancienne : une copie gardée porterait sa date
    await new Promise(resolve => setTimeout(resolve, 3000));
    reloadedAt = Date.now();
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 120000 });
    await visible(page, '.user-container .user-tile', 120000);
    tilesAfterMs = Date.now() - reloadedAt;
    await openPlayer(page, 60000);
    await press(page, '.mode-btn[data-mode="quiz"]');
    await visible(page, '#quiz-options .option', 60000);
  }, 300000);

  afterAll(async () => {
    await browser?.close();
    await server?.stop();
  });

  test('le réseau est bien lent : « Qui joue ? » met plus de 3 s à revenir', () => {
    // Sans ce bridage, le test suivant ne prouverait rien
    expect(tilesAfterMs).toBeGreaterThan(3000);
  });

  // Date à la seconde près : une réponse du serveur date du rechargement ou après
  const fresh = response => response.date >= Math.floor(reloadedAt / 1000) * 1000 - 1000;
  const thisVersion = response => new URL(response.url).searchParams.get('v') === SW_VERSION;

  test('la page et les fichiers sans ?v= viennent du serveur, aucun de la copie', () => {
    // En développement, la page et ses imports n'ont pas de ?v= : le réseau l'emporte
    const unversioned = responses.filter(response => !thisVersion(response));
    expect(unversioned.filter(r => r.type === 'Document')).toHaveLength(1);
    expect(unversioned.length).toBeGreaterThan(50);
    expect(unversioned.filter(response => !fresh(response)).map(r => r.url)).toEqual([]);
  });

  test('les fichiers de cette version (?v=) viennent de leur copie, même quand le réseau répond', () => {
    // Le serveur ignore ?v= : après un déploiement, il servirait sous ces adresses une autre
    // version. Leur copie préchargée est la leur par construction (sw.js, thisVersionFile).
    const versioned = responses.filter(thisVersion);
    expect(versioned.length).toBeGreaterThan(10);
    expect(versioned.filter(fresh).map(r => r.url)).toEqual([]);
  });
});
