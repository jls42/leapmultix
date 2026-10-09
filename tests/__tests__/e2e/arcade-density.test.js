/**
 * Tests E2E - Plateaux d'Arcade à la densité de l'écran : sur un ordinateur (densité 1 et 2)
 * et un téléphone (densité 3), la taille interne de chaque canevas est sa taille affichée ×
 * la densité (le dessin est net au lieu d'être agrandi par le navigateur), et la souris comme
 * le doigt visent toujours juste : carte retournée, monstre touché, serpent dirigé, pastille
 * de points posée au-dessus du monstre, voile de pause sur le plateau.
 * Avant : taille interne = taille affichée, quelle que soit la densité (363 × 571 pour
 * 302 × 473 pixels CSS sur un téléphone de densité 3).
 * @jest-environment node
 */

const puppeteer = require('puppeteer');
const { createUserAndSkipIntro, answerGameDialog } = require('../../utils/game-session.cjs');
const { startStaticServer } = require('../../utils/static-server.cjs');

const ANDROID_USER_AGENT =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36';
const DESKTOP_1 = { width: 1280, height: 800, deviceScaleFactor: 1 };
const DESKTOP_2 = { width: 1440, height: 900, deviceScaleFactor: 2 };
const PHONE_3 = { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
const SCREENS = [
  ['ordinateur, densité 1', DESKTOP_1],
  ['ordinateur, densité 2', DESKTOP_2],
  ['téléphone, densité 3', PHONE_3],
];
const ARCADE_GAMES = ['invasion', 'multimiam', 'multisnake', 'multimemory'];

// Ce que dessinent les jeux, en coordonnées de la fenêtre (transformation du contexte et
// affichage du canevas compris) et, pour les textes, en unités du jeu (gx, gy) : images,
// textes et tirs de MultiInvaders (bord gauche de la balle, là où elle est visée)
const CLIENT_SPY_SOURCE = `(() => {
  const proto = CanvasRenderingContext2D.prototype;
  const toClient = (ctx, x, y) => {
    const t = ctx.getTransform();
    const rect = ctx.canvas.getBoundingClientRect();
    const border = parseFloat(getComputedStyle(ctx.canvas).borderLeftWidth) || 0;
    const toCss = ctx.canvas.clientWidth / ctx.canvas.width;
    return {
      x: rect.left + border + (t.a * x + t.c * y + t.e) * toCss,
      y: rect.top + border + (t.b * x + t.d * y + t.f) * toCss,
    };
  };
  const draws = (globalThis.__client = { images: [], texts: [], shots: [] });
  const keep = list => { if (list.length > 600) list.splice(0, 300); };
  const drawImage = proto.drawImage;
  proto.drawImage = function spyImage(image, ...rest) {
    if (rest.length === 4 && image && image.src) {
      const a = toClient(this, rest[0], rest[1]);
      const b = toClient(this, rest[0] + rest[2], rest[1] + rest[3]);
      const src = image.src.split('/').pop().replace(/-\\d+\\.webp$/, '.png');
      draws.images.push({
        src,
        canvas: this.canvas.id,
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2,
        gx: rest[0] + rest[2] / 2,
        gy: rest[1] + rest[3] / 2,
      });
      keep(draws.images);
    }
    return drawImage.call(this, image, ...rest);
  };
  const fillText = proto.fillText;
  proto.fillText = function spyText(text, x, y, ...rest) {
    draws.texts.push({ text: String(text), canvas: this.canvas.id, gx: x, gy: y, ...toClient(this, x, y) });
    keep(draws.texts);
    return fillText.call(this, text, x, y, ...rest);
  };
  const fillRect = proto.fillRect;
  proto.fillRect = function spyRect(x, y, w, h) {
    if (this.fillStyle === '#ffff00') {
      draws.shots.push({ canvas: this.canvas.id, ...toClient(this, x, y) });
      keep(draws.shots);
    }
    return fillRect.call(this, x, y, w, h);
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
  await answerGameDialog(page, true);
  await pressButton(page, '#arcade-back-btn');
}

/**
 * Taille interne du canevas, taille affichée de son dessin (pixels CSS, cadre exclu ; le
 * labyrinthe de MultiMiam est centré par object-fit dans un élément plus haut) et densité
 */
function canvasSizes(page) {
  return page.evaluate(() => {
    const canvas = document.querySelector('#game canvas');
    const aspect = canvas.width / canvas.height;
    const width = Math.min(canvas.clientWidth, canvas.clientHeight * aspect);
    return {
      internal: [canvas.width, canvas.height],
      css: [width, width / aspect],
      ratio: Math.min(3, devicePixelRatio),
    };
  });
}

/** Le doigt sur un téléphone, la souris sur un ordinateur */
async function pointAt(page, viewport, point) {
  if (viewport.hasTouch) await page.touchscreen.tap(point.x, point.y);
  else await page.mouse.click(point.x, point.y);
}

describe('Plateaux d’Arcade à la densité de l’écran (E2E)', () => {
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
    await page.evaluateOnNewDocument(CLIENT_SPY_SOURCE);
    await page.goto(server.url, server.gotoOptions);
    await createUserAndSkipIntro(page);
    await pressButton(page, '.mode-btn[data-mode="arcade"]');
  }

  test.each(SCREENS)(
    '%s : chaque canevas a la taille affichée × la densité',
    async (_name, viewport) => {
      await openArcade(viewport);
      for (const game of ARCADE_GAMES) {
        await launchGame(page, game);
        await pause(400);
        const { internal, css, ratio } = await canvasSizes(page);
        const expected = css.map(side => Math.round(side * ratio));
        const off = internal.map((side, i) => Math.abs(side - expected.at(i)));
        expect({ game, internal, offBy: Math.max(...off) <= 1 }).toEqual({
          game,
          internal,
          offBy: true,
        });
        await backToArcadeMenu(page);
      }
    },
    120000
  );

  test.each(SCREENS)(
    '%s : MultiMemory retourne la carte visée',
    async (_name, viewport) => {
      await openArcade(viewport);
      await launchGame(page, 'multimemory');
      // Plateau posé (bouton plein écran monté, police chargée) : les derniers dos de cartes
      // dessinés avec leur image (centrée sur la carte). Le plateau ne se redessine que s'il
      // change : son dernier dessin est le bon.
      await pause(1500);
      await page.waitForFunction(
        () => globalThis.__client.images.filter(d => d.src.startsWith('chemin')).length >= 8,
        { timeout: 8000 }
      );
      const backs = await page.evaluate(() =>
        globalThis.__client.images.filter(d => d.src.startsWith('chemin')).slice(-8)
      );
      const target = backs.at(5);
      await pointAt(page, viewport, target);
      await pause(250);
      const face = await page.evaluate(
        () =>
          globalThis.__client.texts
            .filter(t => t.canvas === 'multimemory-canvas' && t.text !== '?')
            .slice(-1)[0]
      );
      // La face retournée s'écrit au centre de la carte touchée (unités du jeu)
      expect(Math.abs(face.gx - target.gx)).toBeLessThan(2);
      expect(Math.abs(face.gy - target.gy)).toBeLessThan(2);
    },
    40000
  );

  test.each(SCREENS)(
    '%s : MultiInvaders tire sous le monstre visé, et la pastille se pose au-dessus',
    async (_name, viewport) => {
      await openArcade(viewport);
      await launchGame(page, 'invasion');
      await pause(1500);
      const question = await page.$eval('.arcade-question', el => el.textContent);
      const [a, b] = question.match(/\d+/g).map(Number);
      const labels = await page.evaluate(() =>
        globalThis.__client.texts.filter(t => t.canvas === 'arcade-canvas').slice(-5)
      );
      const wrong = labels.find(label => Number(label.text) !== a * b);
      if (!viewport.hasTouch) await page.mouse.move(wrong.x, wrong.y + 150);
      await pointAt(page, viewport, { x: wrong.x, y: wrong.y + 150 });
      await pause(100);
      const [shot] = await page.evaluate(() => globalThis.__client.shots.slice(-1));
      // La balle part exactement sous le centre du monstre visé (pixels CSS)
      expect(Math.abs(shot.x - wrong.x)).toBeLessThan(2);
      await page.waitForSelector('.arcade-points', { timeout: 8000 });
      const badge = await page.$eval('.arcade-points', el => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, bottom: r.bottom };
      });
      // La pastille « +100 » se pose au-dessus du monstre touché
      expect(Math.abs(badge.x - wrong.x)).toBeLessThan(40);
      expect(badge.bottom).toBeLessThan(wrong.y + 10);
    },
    40000
  );

  test.each([SCREENS[1], SCREENS[2]])(
    '%s : MultiSnake monte quand on vise au-dessus de sa tête',
    async (_name, viewport) => {
      await openArcade(viewport);
      await launchGame(page, 'multisnake');
      await page.waitForFunction(
        () => globalThis.__client.images.some(d => d.src.startsWith('tete_')),
        { timeout: 8000 }
      );
      const head = await page.evaluate(
        () => globalThis.__client.images.filter(d => d.src.startsWith('tete_')).slice(-1)[0]
      );
      await pointAt(page, viewport, { x: head.x, y: head.y - 90 });
      // La tête, redessinée vers le haut, au-dessus de sa place de départ (relevé à chaque
      // image : sur une machine chargée, le serpent finirait par faire le tour du plateau)
      const turned = await page.waitForFunction(
        startY => {
          const last = globalThis.__client.images.filter(d => d.src.startsWith('tete_')).at(-1);
          return last?.src === 'tete_haut.png' && last.y < startY && last;
        },
        { timeout: 3000 },
        head.y
      );
      expect((await turned.jsonValue()).src).toBe('tete_haut.png');
    },
    40000
  );

  test('téléphone, densité 3 : le voile de pause couvre exactement le plateau', async () => {
    await openArcade(PHONE_3);
    await launchGame(page, 'multisnake');
    await pressButton(page, '.arcade-pause-btn');
    await page.waitForSelector('.arcade-pause-overlay', { visible: true, timeout: 5000 });
    const [board, veil] = await page.evaluate(() =>
      ['#game canvas', '.arcade-pause-overlay'].map(selector => {
        const r = document.querySelector(selector).getBoundingClientRect();
        return [r.left, r.top, r.width, r.height].map(Math.round);
      })
    );
    // Au pixel près : le voile se place en pixels entiers (offsetLeft), le plateau centré
    // peut tomber entre deux pixels
    veil.forEach((side, i) => expect(Math.abs(side - board.at(i))).toBeLessThanOrEqual(1));
  }, 40000);
});
