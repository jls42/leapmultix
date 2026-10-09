/**
 * Tests E2E - Écran des jeux d'Arcade : les plateaux prennent la place disponible (téléphone
 * en portrait et tourné), la consigne part sans rien déplacer (posée sur le plateau, ou à côté
 * sur un téléphone tourné), le bouton plein écran met toute la partie en plein écran et Échap
 * en sort sans quitter la partie, et le doigt vise toujours la bonne case une fois le plateau
 * mis à l'échelle (carte retournée, serpent dirigé, monstre touché).
 * @jest-environment node
 */

const puppeteer = require('puppeteer');
const { createUserAndSkipIntro, answerGameDialog } = require('../../utils/game-session.cjs');
const { startStaticServer } = require('../../utils/static-server.cjs');

const PORTRAIT = { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
const LANDSCAPE = { width: 844, height: 390, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
const DESKTOP = { width: 1280, height: 800, deviceScaleFactor: 1 };
const ANDROID_USER_AGENT =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36';
const ARCADE_GAMES = ['invasion', 'multimiam', 'multimemory', 'multisnake'];

// Dessins des canevas, en coordonnées internes : images (tête du serpent, dos des cartes,
// monstres), textes (faces des cartes, nombres des monstres) et tirs de MultiInvaders
const CANVAS_SPY_SOURCE = `(() => {
  const proto = CanvasRenderingContext2D.prototype;
  const draws = (globalThis.__draws = { images: [], texts: [], shots: [] });
  const keep = list => { if (list.length > 600) list.splice(0, 300); };
  const drawImage = proto.drawImage;
  proto.drawImage = function spyImage(image, ...rest) {
    if (rest.length >= 4) {
      const src = ((image && image.src) || '').split('/').pop();
      draws.images.push({ src, x: rest[0], y: rest[1], w: rest[2], h: rest[3], canvas: this.canvas.id });
      keep(draws.images);
    }
    return drawImage.call(this, image, ...rest);
  };
  const fillText = proto.fillText;
  proto.fillText = function spyText(text, x, y, ...rest) {
    draws.texts.push({ text: String(text), x, y, canvas: this.canvas.id });
    keep(draws.texts);
    return fillText.call(this, text, x, y, ...rest);
  };
  const fillRect = proto.fillRect;
  proto.fillRect = function spyRect(x, y, w, h) {
    if (this.fillStyle === '#ffff00') draws.shots.push({ x, y, canvas: this.canvas.id });
    keep(draws.shots);
    return fillRect.call(this, x, y, w, h);
  };
})();`;

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
  // « Abandonner » demande confirmation (règle de sortie, js/game-exit.js)
  await pressButton(page, '#game [id$="abandon-btn"]');
  await answerGameDialog(page, true);
  await pressButton(page, '#arcade-back-btn');
}

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mise en page posée : le bouton plein écran est monté et deux images ont passé (le bandeau
 * prend sa hauteur définitive quand la police est chargée, le plateau suit à l'image suivante)
 */
async function settle(page) {
  await page.waitForSelector('.arcade-fullscreen-btn', { visible: true, timeout: 5000 });
  await page.evaluate(
    () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  );
}

/** Plateau affiché et débordement de la page (0 : pas de défilement) */
function screenState(page) {
  return page.evaluate(() => {
    const canvas = document.querySelector('#game canvas');
    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;
    return {
      board: { width: Math.round(rect.width), height: Math.round(rect.height) },
      overflow: { x: root.scrollWidth - innerWidth, y: root.scrollHeight - innerHeight },
      fullscreen: document.fullscreenElement?.id ?? null,
      slide: document.querySelector('.slide.active-slide')?.id,
    };
  });
}

/**
 * Plateau, « Abandonner » et consigne à l'écran (pixels CSS), ce que le doigt touche au
 * milieu de la consigne, et le débordement de la page
 */
function stageLayout(page) {
  return page.evaluate(() => {
    const box = el => {
      const r = el.getBoundingClientRect();
      return {
        left: Math.round(r.left),
        top: Math.round(r.top),
        width: Math.round(r.width),
        height: Math.round(r.height),
      };
    };
    const note = document.querySelector('#game .game-instructions');
    const shown = note && !note.hidden ? { ...box(note), placement: note.dataset.placement } : null;
    const touched = shown
      ? document.elementFromPoint(shown.left + shown.width / 2, shown.top + shown.height / 2)
      : null;
    const abandon = document.querySelector('#game [id$="abandon-btn"]');
    return {
      board: box(document.querySelector('#game canvas')),
      abandon: box(abandon),
      note: shown,
      underNote: touched?.tagName ?? null,
      emptyBelow: Math.round(innerHeight - abandon.getBoundingClientRect().bottom),
      overflowY: document.documentElement.scrollHeight - innerHeight,
    };
  });
}

/**
 * La consigne est-elle là où le jeu l'a posée : au milieu du plateau, ou en bas, juste
 * au-dessus de son bord ?
 */
function placedAsSaid(note, board) {
  const middleGap = Math.abs(note.top + note.height / 2 - (board.top + board.height / 2));
  const bottomGap = board.top + board.height - (note.top + note.height);
  return note.placement === 'middle' ? middleGap <= 2 : bottomGap > 0 && bottomGap <= 16;
}

/** Le rectangle a est-il entièrement dans b ? */
const isInside = (a, b) =>
  a.left >= b.left &&
  a.top >= b.top &&
  a.left + a.width <= b.left + b.width &&
  a.top + a.height <= b.top + b.height;

/** Les rectangles a et b se chevauchent-ils ? */
const overlaps = (a, b) =>
  a.left < b.left + b.width &&
  b.left < a.left + a.width &&
  a.top < b.top + b.height &&
  b.top < a.top + a.height;

/** Point de la fenêtre où s'affiche un point interne du canevas */
function toScreen(page, canvasId, x, y) {
  return page.evaluate(
    (id, px, py) => {
      const canvas = document.getElementById(id);
      const rect = canvas.getBoundingClientRect();
      const style = getComputedStyle(canvas);
      const left = rect.left + Number.parseFloat(style.borderLeftWidth);
      const top = rect.top + Number.parseFloat(style.borderTopWidth);
      const width = rect.width - Number.parseFloat(style.borderLeftWidth) * 2;
      const height = rect.height - Number.parseFloat(style.borderTopWidth) * 2;
      return { x: left + (px * width) / canvas.width, y: top + (py * height) / canvas.height };
    },
    canvasId,
    x,
    y
  );
}

/** Entrée en plein écran par un vrai toucher sur le bouton du bandeau */
async function enterFullscreen(page) {
  await page.waitForSelector('.arcade-fullscreen-btn', { visible: true, timeout: 5000 });
  await page.tap('.arcade-fullscreen-btn');
  await page.waitForFunction(() => document.fullscreenElement?.id === 'game', { timeout: 5000 });
  await pause(300);
}

/** Dernières images dessinées sur un canevas dont le nom contient `part` */
function lastImages(page, canvasId, part, count) {
  return page.evaluate(
    (id, name, n) =>
      globalThis.__draws.images.filter(d => d.canvas === id && d.src.includes(name)).slice(-n),
    canvasId,
    part,
    count
  );
}

describe('Écran des jeux d’Arcade (E2E)', () => {
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

  async function openArcade(viewport, { phone = true } = {}) {
    page = await browser.newPage();
    if (phone) await page.setUserAgent(ANDROID_USER_AGENT);
    await page.setViewport(viewport);
    await page.evaluateOnNewDocument(CANVAS_SPY_SOURCE);
    await page.goto(server.url, server.gotoOptions);
    await createUserAndSkipIntro(page);
    await pressButton(page, '.mode-btn[data-mode="arcade"]');
  }

  afterEach(async () => {
    if (page) await page.close();
    page = null;
  });

  test('téléphone tourné : chaque plateau prend la largeur, sans faire défiler la page', async () => {
    await openArcade(LANDSCAPE);
    for (const game of ARCADE_GAMES) {
      await launchGame(page, game);
      await settle(page);
      const { board, overflow } = await screenState(page);
      expect({ game, ...overflow }).toEqual({ game, x: 0, y: 0 });
      expect({ game, wide: board.width > board.height }).toEqual({ game, wide: true });
      await backToArcadeMenu(page);
    }
  }, 90000);

  test('téléphone en portrait : plateaux plus hauts que larges, sans défilement', async () => {
    await openArcade(PORTRAIT);
    for (const game of ARCADE_GAMES) {
      await launchGame(page, game);
      await settle(page);
      const { board, overflow } = await screenState(page);
      expect({ game, ...overflow }).toEqual({ game, x: 0, y: 0 });
      expect({ game, tall: board.height > board.width }).toEqual({ game, tall: true });
      // Presque toute la largeur de l'écran, même avec la consigne affichée
      expect({ game, wide: board.width > 280 }).toEqual({ game, wide: true });
      await backToArcadeMenu(page);
    }
  }, 90000);

  // Le plateau garde sa taille du premier au dernier instant : la consigne, posée dessus
  // (à côté sur un téléphone tourné), ne lui prend pas de place et part sans rien déplacer.
  // Dans les deux cas, elle laisse passer le doigt (au plateau, ou à la zone de jeu à côté).
  // En portrait, les quatre jeux : chacun pose sa consigne à sa place. Ailleurs, la mise en
  // page est commune à tous ; MultiMemory sur ordinateur a trois rangées, consigne en bas.
  // Sous le plateau, « Abandonner » reste en bas de l'écran dès le lancement : tous les
  // plateaux prennent la hauteur, MultiMiam compris (avant : 346 px vides sous le bouton dans
  // MultiMemory, puis 139 px dans MultiMiam en portrait).
  const ON_BOARD = {
    inside: true,
    overlaps: true,
    touched: 'CANVAS',
    placedAsSaid: true,
    abandonAtBottom: true,
  };
  const BESIDE_BOARD = { inside: false, overlaps: false, touched: 'DIV' };
  test.each([
    ['téléphone en portrait', PORTRAIT, true, ON_BOARD, ARCADE_GAMES],
    ['téléphone tourné', LANDSCAPE, true, BESIDE_BOARD, ['multisnake']],
    ['ordinateur', DESKTOP, false, ON_BOARD, ['multimemory', 'multisnake']],
  ])(
    '%s : la consigne part sans rien déplacer, ni le plateau ni « Abandonner »',
    async (_screen, viewport, phone, spot, games) => {
      await openArcade(viewport, { phone });
      for (const game of games) {
        await launchGame(page, game);
        await settle(page);
        await pause(700);
        const during = await stageLayout(page);
        // Lisible dès le lancement, sans faire défiler la page ni toucher « Abandonner »
        expect({ game, note: Boolean(during.note), overflowY: during.overflowY }).toEqual({
          game,
          note: true,
          overflowY: 0,
        });
        expect({ game, onAbandon: overlaps(during.note, during.abandon) }).toEqual({
          game,
          onAbandon: false,
        });
        expect({
          game,
          inside: isInside(during.note, during.board),
          overlaps: overlaps(during.note, during.board),
          touched: during.underNote,
          ...('placedAsSaid' in spot && { placedAsSaid: placedAsSaid(during.note, during.board) }),
          ...('abandonAtBottom' in spot && { abandonAtBottom: during.emptyBelow < 40 }),
        }).toEqual({ game, ...spot });
        await page.waitForFunction(
          () => document.querySelector('#game .game-instructions')?.hidden,
          { timeout: 10000 }
        );
        await pause(300);
        const after = await stageLayout(page);
        expect({ game, board: after.board, abandon: after.abandon }).toEqual({
          game,
          board: during.board,
          abandon: during.abandon,
        });
        await backToArcadeMenu(page);
      }
    },
    120000
  );

  test('plein écran : toute la partie, puis Échap en sort sans quitter la partie', async () => {
    await openArcade(PORTRAIT);
    await launchGame(page, 'multisnake');
    const before = await screenState(page);
    await enterFullscreen(page);
    const full = await screenState(page);
    expect(full.fullscreen).toBe('game');
    expect(full.board.height).toBeGreaterThan(before.board.height);
    const inside = await page.evaluate(() =>
      ['.arcade-mult-display', '[id$="abandon-btn"]', 'canvas'].map(selector => {
        const rect = document.querySelector(`#game ${selector}`).getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= innerHeight;
      })
    );
    expect(inside).toEqual([true, true, true]);
    expect(await page.$eval('.arcade-fullscreen-btn', b => b.getAttribute('aria-label'))).toBe(
      'Quitter le plein écran'
    );
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.fullscreenElement, { timeout: 5000 });
    const after = await screenState(page);
    expect(after.slide).toBe('slide4');
    expect(await page.$('#multisnake-canvas')).not.toBeNull();
  }, 40000);

  test('plein écran puis téléphone tourné : la carte touchée est celle qui se retourne', async () => {
    await openArcade(PORTRAIT);
    await launchGame(page, 'multimemory');
    await enterFullscreen(page);
    await page.setViewport(LANDSCAPE);
    await pause(500);
    // Dos des cartes dessinés avec leur image (monstres chargés)
    await page.waitForFunction(
      () =>
        globalThis.__draws.images.filter(
          d => d.canvas === 'multimemory-canvas' && d.src.includes('chemin')
        ).length >= 12,
      { timeout: 5000 }
    );
    const backs = await lastImages(page, 'multimemory-canvas', 'chemin', 12);
    const target = backs[7];
    const point = await toScreen(
      page,
      'multimemory-canvas',
      target.x + target.w / 2,
      target.y + target.h / 2
    );
    await page.touchscreen.tap(point.x, point.y);
    await pause(200);
    // La face retournée s'écrit au centre de la carte touchée
    const face = await page.evaluate(
      () =>
        globalThis.__draws.texts
          .filter(t => t.canvas === 'multimemory-canvas' && t.text !== '?')
          .slice(-1)[0]
    );
    expect(Math.abs(face.x - (target.x + target.w / 2))).toBeLessThan(2);
    expect(Math.abs(face.y - (target.y + target.h / 2))).toBeLessThan(2);
  }, 40000);

  test('plein écran : un toucher au-dessus de la tête fait monter le serpent', async () => {
    await openArcade(PORTRAIT);
    await launchGame(page, 'multisnake');
    await enterFullscreen(page);
    const [head] = await lastImages(page, 'multisnake-canvas', 'tete_', 1);
    const point = await toScreen(
      page,
      'multisnake-canvas',
      head.x + head.w / 2,
      head.y + head.h / 2 - 3 * head.h
    );
    await page.touchscreen.tap(point.x, point.y);
    await page.waitForFunction(
      startY => {
        const last = globalThis.__draws.images
          .filter(d => d.canvas === 'multisnake-canvas' && d.src.includes('tete_'))
          .slice(-1)[0];
        return last?.src === 'tete_haut.png' && last.y < startY;
      },
      { timeout: 3000 },
      head.y
    );
    // La tête redessinée regarde vers le haut, au-dessus de sa place de départ
    const [turned] = await lastImages(page, 'multisnake-canvas', 'tete_', 1);
    expect(turned.src).toBe('tete_haut.png');
    expect(turned.y).toBeLessThan(head.y);
  }, 40000);

  test('plein écran, téléphone tourné : MultiInvaders vise la colonne touchée', async () => {
    await openArcade(PORTRAIT);
    await launchGame(page, 'invasion');
    await enterFullscreen(page);
    await page.setViewport(LANDSCAPE);
    await pause(800);
    // Un monstre qui ne porte pas la bonne réponse : le toucher rapporte 100 points. Son
    // nombre est écrit au-dessus de son centre (coordonnées internes du canevas)
    const question = await page.$eval('.arcade-question', el => el.textContent);
    const [a, b] = question.match(/\d+/g).map(Number);
    const labels = await page.evaluate(() =>
      globalThis.__draws.texts.filter(t => t.canvas === 'arcade-canvas').slice(-5)
    );
    const wrong = labels.find(label => Number(label.text) !== a * b);
    const point = await toScreen(page, 'arcade-canvas', wrong.x, wrong.y + 60);
    await page.touchscreen.tap(point.x, point.y);
    await pause(100);
    const [shot] = await page.evaluate(() =>
      globalThis.__draws.shots.filter(s => s.canvas === 'arcade-canvas').slice(-1)
    );
    // La balle part exactement sous le centre du monstre touché
    expect(Math.abs(shot.x - wrong.x)).toBeLessThan(1.5);
    await page.waitForFunction(
      () => document.getElementById('multiinvaders-info-score')?.textContent === '100',
      { timeout: 8000 }
    );
  }, 40000);

  test('ordinateur : le bouton plein écran agrandit le plateau, Échap le rend', async () => {
    await openArcade(DESKTOP, { phone: false });
    await launchGame(page, 'multimemory');
    const before = await screenState(page);
    await page.waitForSelector('.arcade-fullscreen-btn', { visible: true, timeout: 5000 });
    await page.click('.arcade-fullscreen-btn');
    await page.waitForFunction(() => document.fullscreenElement?.id === 'game', { timeout: 5000 });
    await pause(300);
    const full = await screenState(page);
    expect(full.board.height).toBeGreaterThan(before.board.height);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.fullscreenElement, { timeout: 5000 });
    expect((await screenState(page)).slide).toBe('slide4');
  }, 40000);
});
