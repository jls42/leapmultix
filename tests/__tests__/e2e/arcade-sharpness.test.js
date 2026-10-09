/**
 * Tests E2E - Netteté des images des jeux d'Arcade : sur un ordinateur (densité 1 et 2) et un
 * téléphone (densité 3), chaque image dessinée garde ses proportions (sauf les morceaux du
 * serpent, qui remplissent leur case pour se raccorder), et, avec les variantes WebP
 * produites par npm run assets:generate, elle a au moins autant de pixels qu'elle en occupe
 * à l'écran, sans jamais venir d'un PNG du dépôt.
 * Avant : fusée de 128 px dessinée sur 175 × 140 (étirée de 25 %), monstres de 128 px sur
 * 300 à 450 pixels d'écran dans MultiMemory, herbe de 1,2 Mo en PNG.
 * @jest-environment node
 */

const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer');
const { createUserAndSkipIntro } = require('../../utils/game-session.cjs');
const { startStaticServer } = require('../../utils/static-server.cjs');

// Sans images générées (CI : npm run assets:generate ne tourne qu'au déploiement), les jeux
// prennent les petits PNG du dépôt : seules les proportions se vérifient alors
const GENERATED = fs.existsSync(
  path.resolve(__dirname, '../../../assets/generated-images/image-map.json')
);
const ANDROID_USER_AGENT =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36';
const SCREENS = [
  ['ordinateur, densité 1', { width: 1280, height: 800, deviceScaleFactor: 1 }],
  ['ordinateur, densité 2', { width: 1440, height: 900, deviceScaleFactor: 2 }],
  [
    'téléphone, densité 3',
    { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  ],
];
const ARCADE_GAMES = ['invasion', 'multimiam', 'multisnake', 'multimemory'];
// Morceaux du serpent : chacun remplit sa case pour se raccorder aux voisins
const TILE = /\/(?:tete|corps|queue)_[a-z_]+[-.]/;
// Plus grande variante produite : une image plus grande à l'écran ne peut pas mieux faire
const LARGEST_VARIANT = 1024;

// Chaque image dessinée : sa taille naturelle et sa plus grande taille à l'écran, en
// pixels de l'appareil (transformation du contexte, affichage du canevas, densité)
const SPRITE_SPY_SOURCE = `(() => {
  const proto = CanvasRenderingContext2D.prototype;
  const drawImage = proto.drawImage;
  const sprites = (globalThis.__sprites = new Map());
  proto.drawImage = function spySprite(image, ...rest) {
    if (rest.length === 4 && image && image.src) {
      const t = this.getTransform();
      const toScreen = (this.canvas.clientWidth / this.canvas.width) * Math.min(3, devicePixelRatio);
      const width = Math.abs(rest[2]) * Math.hypot(t.a, t.b) * toScreen;
      const height = Math.abs(rest[3]) * Math.hypot(t.c, t.d) * toScreen;
      const src = new URL(image.src).pathname;
      const key = this.canvas.id + ' ' + src;
      const known = sprites.get(key);
      if (!known || width * height > known.screen[0] * known.screen[1]) {
        sprites.set(key, {
          src,
          natural: [image.naturalWidth, image.naturalHeight],
          drawn: [Math.abs(rest[2]), Math.abs(rest[3])],
          screen: [width, height],
        });
      }
    }
    return drawImage.call(this, image, ...rest);
  };
  // Nombres écrits sur le plateau, en coordonnées de la fenêtre
  const fillText = proto.fillText;
  const texts = (globalThis.__texts = []);
  proto.fillText = function spyText(text, x, y, ...rest) {
    const t = this.getTransform();
    const rect = this.canvas.getBoundingClientRect();
    const style = getComputedStyle(this.canvas);
    const border = Number.parseFloat(style.borderLeftWidth) || 0;
    const toCss = this.canvas.clientWidth / this.canvas.width;
    texts.push({
      text: String(text),
      canvas: this.canvas.id,
      x: rect.left + border + (t.a * x + t.c * y + t.e) * toCss,
      y: rect.top + border + (t.b * x + t.d * y + t.f) * toCss,
    });
    if (texts.length > 200) texts.splice(0, 100);
    return fillText.call(this, text, x, y, ...rest);
  };
})();`;

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

async function pressButton(page, selector) {
  const button = await page.waitForSelector(selector, { visible: true, timeout: 10000 });
  await button.evaluate(el => el.click());
}

async function launchGame(page, game) {
  const card = `.arcade-game-card[data-game="${game}"]`;
  await page.waitForSelector(card, { visible: true, timeout: 10000 });
  const expanded = await page.$eval(card, el => el.classList.contains('expanded'));
  if (!expanded) await pressButton(page, `${card} .arcade-game-toggle`);
  await pressButton(page, `${card} .play-arcade-btn`);
  await page.waitForSelector('#game canvas', { visible: true, timeout: 10000 });
}

async function backToArcadeMenu(page) {
  await pressButton(page, '#game [id$="abandon-btn"]');
  await pressButton(page, '#arcade-back-btn');
}

/**
 * Images dessinées une fois la partie posée : l'espion repart de zéro après le chargement,
 * puis note quelques dizaines d'images (les variantes plus grandes ont eu le temps d'arriver)
 */
async function settledSprites(page) {
  await pause(2500);
  await page.evaluate(() => globalThis.__sprites.clear());
  await pause(800);
  return page.evaluate(() => [...globalThis.__sprites.values()]);
}

/** Image déformée : rapport largeur / hauteur dessiné différent de celui de l'image (> 3 %) */
function isDistorted({ natural, drawn }) {
  const drawnRatio = drawn[0] / drawn[1];
  const naturalRatio = natural[0] / natural[1];
  return Math.abs(drawnRatio / naturalRatio - 1) > 0.03;
}

/** Image floue : moins de pixels que sur l'écran (au plus grand de ses variantes près) */
function isBlurry({ natural, screen }) {
  if (natural[0] >= LARGEST_VARIANT) return false;
  return natural[0] < screen[0] * 0.98 || natural[1] < screen[1] * 0.98;
}

const describeGenerated = GENERATED ? describe : describe.skip;

describe('Images des jeux d’Arcade (E2E)', () => {
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

  async function openArcade(viewport) {
    page = await browser.newPage();
    await page.setBypassServiceWorker(true);
    if (viewport.isMobile) await page.setUserAgent(ANDROID_USER_AGENT);
    await page.setViewport(viewport);
    await page.evaluateOnNewDocument(SPRITE_SPY_SOURCE);
    await page.goto(server.url, server.gotoOptions);
    await createUserAndSkipIntro(page);
    await pressButton(page, '.mode-btn[data-mode="arcade"]');
  }

  /** Images de chaque jeu sur cet écran : { jeu: [images] } */
  async function spritesOfEachGame(viewport) {
    await openArcade(viewport);
    const byGame = {};
    for (const game of ARCADE_GAMES) {
      await launchGame(page, game);
      byGame[game] = await settledSprites(page);
      await backToArcadeMenu(page);
    }
    return byGame;
  }

  test.each(SCREENS)(
    '%s : chaque image garde ses proportions, et les plus fines sont nettes',
    async (_name, viewport) => {
      const byGame = await spritesOfEachGame(viewport);
      for (const game of ARCADE_GAMES) {
        const sprites = byGame[game];
        // Chaque jeu dessine ses images (fusée, monstres, personnages, serpent, cartes)
        expect({ game, drawn: sprites.length > 0 }).toEqual({ game, drawn: true });
        const distorted = sprites.filter(s => !TILE.test(s.src) && isDistorted(s));
        expect({ game, distorted }).toEqual({ game, distorted: [] });
        if (!GENERATED) continue;
        expect({ game, blurry: sprites.filter(isBlurry) }).toEqual({ game, blurry: [] });
        const notWebp = sprites.filter(s => !s.src.startsWith('/assets/generated-images/arcade/'));
        expect({ game, notWebp }).toEqual({ game, notWebp: [] });
      }
    },
    120000
  );

  describeGenerated('MultiInvaders, ordinateur de densité 2', () => {
    test('la fusée et l’ami caché sont nets et à leurs proportions', async () => {
      await openArcade(SCREENS[1][1]);
      await launchGame(page, 'invasion');
      await pause(1500);
      // Tir sur la bonne réponse : l'ami caché apparaît un instant à la place du monstre
      const question = await page.$eval('.arcade-question', el => el.textContent);
      const [a, b] = question.match(/\d+/g).map(Number);
      const target = await page.evaluate(
        answer =>
          globalThis.__texts
            .filter(t => t.canvas === 'arcade-canvas')
            .slice(-5)
            .find(t => Number(t.text) === answer),
        a * b
      );
      await page.mouse.move(target.x, target.y + 80);
      await page.mouse.down();
      await page.mouse.up();
      const friend = /\/(?:fox|panda|unicorn|dragon|astronaut)[-_.]/;
      await page.waitForFunction(
        source => [...globalThis.__sprites.values()].some(s => new RegExp(source).test(s.src)),
        { timeout: 8000 },
        friend.source
      );
      const sprites = await page.evaluate(() => [...globalThis.__sprites.values()]);
      const shown = sprites.filter(s => friend.test(s.src) || /vaisseau|spaceship/.test(s.src));
      expect(shown.length).toBeGreaterThanOrEqual(2);
      expect(shown.filter(isBlurry)).toEqual([]);
      expect(shown.filter(isDistorted)).toEqual([]);
    }, 40000);
  });
});
