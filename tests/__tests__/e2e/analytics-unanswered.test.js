/**
 * Tests E2E - plausible.io qui ne répond pas ne retient pas le jeu. Chargé en defer, le script
 * de mesure d'audience passait avant les modules du jeu, qui attendaient sa réponse. Mesuré
 * avant (requête retenue 28 s, comme l'ERR_TIMED_OUT relevé une fois sur un réseau réel) :
 * « Qui joue ? » affiché tout de suite, mais « Créer » sans effet pendant 28 s, en prod comme
 * en développement. Un pare-feu d'école qui laisse ces requêtes sans réponse le produirait à
 * chaque visite. En async, « Créer » répond en 0,3 s.
 * @jest-environment node
 */

const puppeteer = require('puppeteer');
const { startStaticServer } = require('../../utils/static-server.cjs');

const NAME = 'SansMesure';

describe('plausible.io sans réponse', () => {
  let browser;
  let server;

  beforeAll(async () => {
    server = await startStaticServer('networkidle2');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }, 30000);

  afterAll(async () => {
    if (browser) await browser.close();
    if (server) await server.stop();
  });

  test('le jeu démarre quand même : « Créer » enregistre le joueur', async () => {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (request.isInterceptResolutionHandled()) return;
      // Pare-feu muet : la requête reste sans réponse jusqu'à la fin du test
      if (new URL(request.url()).hostname === 'plausible.io') return;
      request.continue();
    });

    await page.goto(server.url, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForSelector('#new-user-name', { visible: true, timeout: 5000 });
    // Le code du jeu se branche juste après l'affichage : « Créer » est touché jusqu'à son effet
    const saved = await page
      .waitForFunction(
        name => {
          const input = document.getElementById('new-user-name');
          if (input.value !== name) {
            input.value = name;
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
          document.getElementById('create-user-btn').click();
          return Boolean(JSON.parse(localStorage.getItem('players') || '{}')[name]);
        },
        { timeout: 8000, polling: 250 },
        NAME
      )
      .then(
        () => true,
        () => false
      );
    expect(saved).toBe(true);
    await page.close();
  }, 30000);
});
