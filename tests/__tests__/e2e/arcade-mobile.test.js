/**
 * Tests E2E - L'Arcade sur un téléphone (390 × 844, tactile) : chaque mini-jeu tient dans
 * l'écran sans faire défiler la page, et le serpent suit un vrai glissement du doigt.
 * @jest-environment node
 */

const puppeteer = require('puppeteer');
const { createUserAndSkipIntro } = require('../../utils/game-session.cjs');
const { startStaticServer } = require('../../utils/static-server.cjs');

// Téléphone : les jeux reconnaissent un mobile à son agent utilisateur
const PHONE_VIEWPORT = {
  width: 390,
  height: 844,
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
};
const ANDROID_USER_AGENT =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36';
const ARCADE_GAMES = ['invasion', 'multimiam', 'multimemory', 'multisnake'];

// Dernière tête du serpent dessinée : son image dit la direction prise (tete_haut, tete_droite…),
// quelle que soit sa variante (« tete_haut-128.webp » se lit « tete_haut.png »)
const SNAKE_HEAD_SPY_SOURCE =
  '(() => {' +
  '  const draw = CanvasRenderingContext2D.prototype.drawImage;' +
  '  CanvasRenderingContext2D.prototype.drawImage = function spy(image, ...rest) {' +
  "    const src = (image && image.src) || '';" +
  "    const name = src.split('/').pop().replace(/-\\d+\\.webp$/, '.png');" +
  "    if (src.includes('/tete_')) globalThis.__lastSnakeHead = name;" +
  '    return draw.call(this, image, ...rest);' +
  '  };' +
  '})();';

/**
 * Appuie sur un bouton de navigation. Clic direct : juste après un changement d'écran,
 * l'émulation décale un instant la zone visible et un toucher calculé tomberait à côté.
 * Seuls les gestes testés passent par l'écran tactile.
 */
async function pressButton(page, selector) {
  const button = await page.waitForSelector(selector, { visible: true, timeout: 10000 });
  await button.evaluate(el => el.click());
}

/** Lance un mini-jeu depuis le menu Arcade : déplier sa tuile, puis « Jouer » */
async function launchGame(page, game) {
  const card = `.arcade-game-card[data-game="${game}"]`;
  await page.waitForSelector(card, { visible: true, timeout: 10000 });
  const expanded = await page.$eval(card, el => el.classList.contains('expanded'));
  if (!expanded) await pressButton(page, `${card} .arcade-game-toggle`);
  await pressButton(page, `${card} .play-arcade-btn`);
  await page.waitForSelector('#game canvas', { visible: true, timeout: 10000 });
}

/** Retour au menu Arcade : « Abandonner », puis « Retour au menu Arcade » */
async function backToArcadeMenu(page) {
  await pressButton(page, '#game [id$="abandon-btn"]');
  await pressButton(page, '#arcade-back-btn');
}

/**
 * Ce qui dépasse de l'écran du téléphone, en pixels (0 : la page ne défile pas).
 * Mesuré contre l'écran et non contre innerWidth : une page trop large élargit la
 * fenêtre de mise en page (Chrome dézoome), ce qui masquerait le débordement.
 */
function pageOverflow(page) {
  return page.evaluate(
    ({ width, height }) => {
      const root = document.documentElement;
      return { x: root.scrollWidth - width, y: root.scrollHeight - height };
    },
    { width: PHONE_VIEWPORT.width, height: PHONE_VIEWPORT.height }
  );
}

describe('Arcade sur téléphone (E2E)', () => {
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

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setUserAgent(ANDROID_USER_AGENT);
    await page.setViewport(PHONE_VIEWPORT);
    await page.evaluateOnNewDocument(SNAKE_HEAD_SPY_SOURCE);
    await page.goto(server.url, server.gotoOptions);
    await createUserAndSkipIntro(page);
    await pressButton(page, '.mode-btn[data-mode="arcade"]');
  }, 40000);

  afterEach(async () => {
    if (page) await page.close();
  });

  test("chaque mini-jeu tient dans l'écran, sans faire défiler la page", async () => {
    for (const game of ARCADE_GAMES) {
      await launchGame(page, game);
      // Mesure aussitôt : la consigne s'affiche quelques secondes sous le plateau
      expect({ game, ...(await pageOverflow(page)) }).toEqual({ game, x: 0, y: 0 });
      await backToArcadeMenu(page);
    }
  }, 90000);

  test('le serpent suit un glissement du doigt', async () => {
    await launchGame(page, 'multisnake');
    const center = await page.$eval('#multisnake-canvas', canvas => {
      const rect = canvas.getBoundingClientRect();
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    });
    // Le serpent part vers la droite ; le doigt glisse de 48 px vers le haut
    await page.touchscreen.touchStart(center.x, center.y);
    for (let step = 1; step <= 4; step++) {
      await page.touchscreen.touchMove(center.x, center.y - 12 * step);
    }
    await page.touchscreen.touchEnd();
    // Un pas du serpent dure moins d'une demi-seconde
    await page
      .waitForFunction(() => globalThis.__lastSnakeHead === 'tete_haut.png', { timeout: 3000 })
      .catch(() => null);
    expect(await page.evaluate(() => globalThis.__lastSnakeHead)).toBe('tete_haut.png');
  }, 40000);
});
