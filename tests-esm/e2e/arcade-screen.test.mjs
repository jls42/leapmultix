/**
 * Tests E2E - Écran des jeux d'Arcade : les plateaux prennent la place disponible (téléphone
 * en portrait et tourné, où « Abandonner » monte dans le bandeau), la consigne part sans rien
 * déplacer (posée sur le plateau), le bouton plein écran met toute la partie en plein écran et Échap
 * en sort sans quitter la partie, et le doigt vise toujours la bonne case une fois le plateau
 * mis à l'échelle (carte retournée, serpent dirigé, monstre touché).
 * @jest-environment node
 */

import { afterAll, afterEach, beforeAll, describe, expect, test } from '@jest/globals';
import puppeteer from 'puppeteer';
import { startStaticServer } from '../../tests/utils/static-server.cjs';
import {
  createUserAndSkipIntro,
  pause,
  pressButton,
  launchArcadeGame,
  backToArcadeMenu,
  snakeHead,
  snakeTurnedUp,
} from '../helpers/game-session.mjs';
// Hors fête, quel que soit le jour : les images s'y reconnaissent à leur nom classique
import { NO_SEASON } from '../../js/core/seasons.js';

const PORTRAIT = { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
const LANDSCAPE = { width: 844, height: 390, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
// Téléphone tourné, barres du navigateur affichées (iPhone 13 : 750 × 342 utiles)
const SHORT_LANDSCAPE = {
  width: 750,
  height: 342,
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
};
const DESKTOP = { width: 1280, height: 800, deviceScaleFactor: 1 };
const ANDROID_USER_AGENT =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36';
const ARCADE_GAMES = [
  'invasion',
  'multimiam',
  'multimemory',
  'multisnake',
  'multipop',
  'multigoal',
];

// Dessins des canevas, en unités du jeu, avec la transformation du dessin (t : échelle et
// décalage vers les pixels internes, à la densité de l'écran) : images (dos des cartes,
// monstres), textes (faces des cartes, nombres des monstres) et tirs de
// MultiInvaders
const CANVAS_SPY_SOURCE = `(() => {
  const proto = CanvasRenderingContext2D.prototype;
  const draws = (globalThis.__draws = { images: [], texts: [], shots: [] });
  const keep = list => { if (list.length > 600) list.splice(0, 300); };
  const scaleOf = ctx => { const m = ctx.getTransform(); return [m.a, m.d, m.e, m.f]; };
  const drawImage = proto.drawImage;
  proto.drawImage = function spyImage(image, ...rest) {
    if (rest.length >= 4) {
      // Nom de l'image quelle que soit sa variante (« chemin-128.webp » : « chemin.png »)
      const src = ((image && image.src) || '').split('/').pop().replace(/-\\d+\\.webp$/, '.png');
      draws.images.push({ src, x: rest[0], y: rest[1], w: rest[2], h: rest[3], t: scaleOf(this), canvas: this.canvas.id });
      keep(draws.images);
    }
    return drawImage.call(this, image, ...rest);
  };
  const fillText = proto.fillText;
  proto.fillText = function spyText(text, x, y, ...rest) {
    draws.texts.push({ text: String(text), x, y, t: scaleOf(this), canvas: this.canvas.id });
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
    // Part du plateau couverte par le dessin du jeu (object-fit: contain), cadre exclu
    const canvas = document.querySelector('#game canvas');
    const style = getComputedStyle(canvas);
    const frame = side => Number.parseFloat(style[`border${side}Width`]) || 0;
    const shownWidth = canvas.getBoundingClientRect().width - frame('Left') - frame('Right');
    const shownHeight = canvas.getBoundingClientRect().height - frame('Top') - frame('Bottom');
    const scale = Math.min(shownWidth / canvas.width, shownHeight / canvas.height);
    const drawnShare = (canvas.width * scale * canvas.height * scale) / (shownWidth * shownHeight);
    return {
      board: box(canvas),
      drawnShare,
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

/** Marge du bas de l'écran sous « Abandonner », au plus (px) : au-delà, il n'est plus en bas */
const ABANDON_BOTTOM_GAP_MAX = 40;

/** Part du plateau que couvre le dessin du jeu, au moins : les cases entières laissent un reste */
const DRAWN_SHARE_MIN = 0.95;

/**
 * Ce que montre la consigne affichée, dans les termes de l'écran attendu (spot) : dans le
 * plateau ou à côté, ce que le doigt touche en son milieu, sa place annoncée,
 * « Abandonner » en bas de l'écran quand l'écran le demande, et le dessin du jeu qui
 * couvre le plateau
 */
function noteSpot(during, spot) {
  const seen = {
    inside: isInside(during.note, during.board),
    overlaps: overlaps(during.note, during.board),
    touched: during.underNote,
  };
  if ('placedAsSaid' in spot) seen.placedAsSaid = placedAsSaid(during.note, during.board);
  if ('abandonAtBottom' in spot) {
    seen.abandonAtBottom = during.emptyBelow < ABANDON_BOTTOM_GAP_MAX;
  }
  if ('drawingFillsBoard' in spot) seen.drawingFillsBoard = during.drawnShare >= DRAWN_SHARE_MIN;
  return seen;
}

/**
 * Point de la fenêtre où s'affiche un point du jeu, sur le canevas d'un dessin relevé par
 * l'espion : son canevas et sa transformation t (échelle et décalage vers les pixels internes)
 */
function toScreen(page, drawn, x, y) {
  return page.evaluate(
    ({ canvas: id, t: [sx, sy, tx, ty] }, px, py) => {
      const canvas = document.getElementById(id);
      const rect = canvas.getBoundingClientRect();
      const style = getComputedStyle(canvas);
      const left = rect.left + Number.parseFloat(style.borderLeftWidth);
      const top = rect.top + Number.parseFloat(style.borderTopWidth);
      const width = rect.width - Number.parseFloat(style.borderLeftWidth) * 2;
      const height = rect.height - Number.parseFloat(style.borderTopWidth) * 2;
      const inner = { x: sx * px + tx, y: sy * py + ty };
      return {
        x: left + (inner.x * width) / canvas.width,
        y: top + (inner.y * height) / canvas.height,
      };
    },
    drawn,
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

/** Calculs du plus court au plus long que le bandeau doit montrer en grand, sur sa ligne */
const BANNER_CALCULATIONS = [
  '3 × 4 = ?',
  '12 × 12 = ?',
  '144 ÷ 12 = ?',
  '100 − 100 = ?',
  '12\u00a0×\u00a012\u00a0=\u00a0144',
];

/**
 * Bandeau de la partie : ses trois colonnes, ses boutons, et pour chaque calcul écrit par
 * l'écrivain du jeu (js/arcade-question.js) la taille du texte et la place qu'il prend
 */
function bannerLayout(page, turned = false) {
  return page.evaluate(
    async (calculations, turnedPhone) => {
      const { writeArcadeQuestion } = await import('/js/arcade-question.js');
      const frame = () =>
        new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      // Les largeurs du bandeau se mesurent une fois les polices du jeu arrivées
      await document.fonts.ready;
      await frame();
      const banner = document.querySelector('#arcade-mult-display');
      const box = selector => banner.querySelector(selector)?.getBoundingClientRect() ?? null;
      const overlap = (a, b) =>
        Boolean(a && b) &&
        a.left < b.right &&
        b.left < a.right &&
        a.top < b.bottom &&
        b.top < a.bottom;
      const [score, calc, time] = [
        '.arcade-banner-score',
        '.arcade-banner-calc',
        '.arcade-banner-time',
      ].map(box);
      const buttons = ['.arcade-pause-btn', '.arcade-fullscreen-btn'].map(box);
      const texts = ['[id$="-info-score"]', '.info-hearts', '[id$="-info-timer"]'].map(box);
      // Téléphone tourné : le temps suit le score et les vies à gauche du calcul, les boutons,
      // « Abandonner » compris, sont à droite
      const [points, hearts, timer] = texts;
      const tools = box('.arcade-banner-tools');
      const abandon = box('[id$="-abandon-btn"]');
      const leftEnd = Math.max(points.right, hearts?.right ?? 0);
      const inOrder = turnedPhone
        ? leftEnd <= timer.left && timer.right <= calc.left && calc.right <= tools.left
        : score.right <= calc.left && calc.right <= time.left;
      const sides = turnedPhone ? [points, timer, tools] : [score, time];
      const middle = rect => rect.left + rect.width / 2;
      // Relevé des largeurs, affiché si le calcul n'est pas au milieu : dit quel côté le pousse
      const width = rect => Math.round(rect?.width ?? 0);
      const toolWidths = [...banner.querySelectorAll('.arcade-banner-tools > *')].map(
        tool =>
          `${tool.id || tool.classList.item(tool.classList.length - 1)} ${width(tool.getBoundingClientRect())}`
      );
      const bannerParts = `fenêtre ${innerWidth}, bandeau ${width(banner.getBoundingClientRect())}, score ${width(score)}, temps ${width(timer)}, calcul ${width(calc)}, boutons ${width(tools)} (${toolWidths.join(', ')})`;
      const question = banner.querySelector('.arcade-question');
      const shown = question.textContent;
      const sizes = [];
      for (const text of calculations) {
        writeArcadeQuestion(text, question);
        await frame();
        sizes.push({
          text,
          px: Math.floor(Number.parseFloat(getComputedStyle(question).fontSize)),
          fits: question.scrollWidth <= question.clientWidth,
          bannerHeight: Math.round(banner.getBoundingClientRect().height),
          calcHeight: Math.round(question.getBoundingClientRect().height),
        });
      }
      writeArcadeQuestion(shown, question);
      await frame();
      return {
        inOrder,
        onOneLine: sides.every(side => side.top < calc.bottom && calc.top < side.bottom),
        // « Abandonner » dans le bandeau (téléphone tourné) : entier, à la hauteur de ses voisins
        abandonInBanner:
          Boolean(abandon) &&
          abandon.left >= tools.left &&
          abandon.right <= tools.right + 1 &&
          Math.round(abandon.height) === 44 &&
          !buttons.some(button => overlap(button, abandon)),
        // Écart entre le milieu du calcul et celui du bandeau (px)
        calcOffCentre: Math.round(Math.abs(middle(calc) - middle(banner.getBoundingClientRect()))),
        bannerParts,
        buttonSides: buttons.map(button => Math.round(Math.min(button.width, button.height))),
        buttonsOverText: buttons.some(button => texts.some(text => overlap(button, text))),
        buttonsOverCalc: buttons.some(button => overlap(button, calc)),
        buttonsOverEachOther: overlap(...buttons),
        heights: [...new Set(sizes.map(size => size.bannerHeight))].length,
        calcHeights: [...new Set(sizes.map(size => size.calcHeight))].length,
        sizes: sizes.map(({ text, px, fits }) => ({ text, px, fits })),
      };
    },
    BANNER_CALCULATIONS,
    turned
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
    await page.goto(`${server.url}?saison=${NO_SEASON}`, server.gotoOptions);
    await createUserAndSkipIntro(page);
    await pressButton(page, '.mode-btn[data-mode="arcade"]');
  }

  afterEach(async () => {
    if (page) await page.close();
    page = null;
  });

  // Les jeux dont le plateau suit l'écran (les autres gardent des cases carrées ou leurs
  // proportions) : avec « Abandonner » dans le bandeau, ils prennent toute la largeur
  // (811 px sur 844 ; 571 quand une colonne de côté portait le bouton)
  const FULL_WIDTH_GAMES = new Set(['multimemory', 'multipop', 'multigoal']);
  test('téléphone tourné : chaque plateau prend la largeur, sans faire défiler la page', async () => {
    await openArcade(LANDSCAPE);
    for (const game of ARCADE_GAMES) {
      await launchArcadeGame(page, game);
      await settle(page);
      const { board, overflow } = await screenState(page);
      expect({ game, ...overflow }).toEqual({ game, x: 0, y: 0 });
      expect({ game, wide: board.width > board.height }).toEqual({ game, wide: true });
      if (FULL_WIDTH_GAMES.has(game)) {
        expect({ game, full: board.width >= LANDSCAPE.width - 40 }).toEqual({ game, full: true });
      }
      await backToArcadeMenu(page);
    }
  }, 90000);

  /** Où est « Abandonner » : dans le bandeau ou sous le plateau, et la page déborde-t-elle ? */
  function abandonPlace(shownPage) {
    return shownPage.evaluate(() => {
      const abandon = document.querySelector('#game [id$="abandon-btn"]');
      const board = document.querySelector('#game canvas').getBoundingClientRect();
      const rect = abandon.getBoundingClientRect();
      const root = document.documentElement;
      return {
        parent: abandon.parentElement.className,
        underBoard: rect.top >= board.bottom,
        overflowY: root.scrollHeight - innerHeight,
      };
    });
  }

  test('le téléphone tourne en pleine partie : « Abandonner » passe du bandeau sous le plateau, et retour', async () => {
    await openArcade(LANDSCAPE);
    await launchArcadeGame(page, 'multigoal');
    await settle(page);
    const banner = { parent: 'arcade-banner-tools', underBoard: false, overflowY: 0 };
    expect(await abandonPlace(page)).toEqual(banner);
    await page.setViewport(PORTRAIT);
    await settle(page);
    expect(await abandonPlace(page)).toEqual({
      parent: 'arcade-game-ui',
      underBoard: true,
      overflowY: 0,
    });
    await page.setViewport(LANDSCAPE);
    await settle(page);
    expect(await abandonPlace(page)).toEqual(banner);
    // De sa place dans le bandeau, il pose toujours sa question et quitte la partie
    await backToArcadeMenu(page);
    await page.waitForSelector('.arcade-game-card', { visible: true, timeout: 5000 });
  }, 60000);

  // Les cases vides qui centrent le calcul sur deux rangées (portrait) prenaient sa place sur la
  // ligne unique du téléphone tourné : le calcul s'écrivait un signe par ligne, et le bandeau,
  // trois fois plus haut, recouvrait le haut du plateau
  test('téléphone tourné, barres du navigateur affichées : bandeau sur une ligne, au-dessus du plateau', async () => {
    await openArcade(SHORT_LANDSCAPE);
    for (const game of ARCADE_GAMES) {
      await launchArcadeGame(page, game);
      await settle(page);
      const layout = await page.evaluate(() => {
        const bar = document.querySelector('#arcade-mult-display').getBoundingClientRect();
        // Sur une ligne : chaque morceau (le calcul, puis la case de sa réponse) commence à
        // droite du précédent. Un retour à la ligne ramènerait le suivant vers la gauche
        const question = document.querySelector('#arcade-mult-display .arcade-question');
        const pieces = [...question.childNodes].flatMap(node => {
          if (node.nodeType !== Node.TEXT_NODE) return [node.getBoundingClientRect()];
          const range = document.createRange();
          range.selectNode(node);
          return [...range.getClientRects()];
        });
        const lines = pieces.every((rect, i) => i === 0 || rect.left >= pieces.at(i - 1).right - 1)
          ? 1
          : 2;
        const top = selector => document.querySelector(selector).getBoundingClientRect().top;
        const abandon = document.querySelector('#game [id$="abandon-btn"]').getBoundingClientRect();
        // MultiMemory n'écrit pas de calcul dans le bandeau : aucune ligne
        return {
          questionOnOneLine: lines <= 1,
          barAboveBoard: bar.bottom <= top('#game canvas'),
          abandonInBar: bar.top <= abandon.top && abandon.bottom <= bar.bottom,
        };
      });
      expect({ game, ...layout }).toEqual({
        game,
        questionOnOneLine: true,
        barAboveBoard: true,
        abandonInBar: true,
      });
      // Le plateau tient dans la hauteur qui reste : la page ne défile pas (MultiPop et
      // MultiGoal gardaient un plateau plus haut que la place, de 8 et 38 px)
      const { overflow } = await screenState(page);
      expect({ game, ...overflow }).toEqual({ game, x: 0, y: 0 });
      await backToArcadeMenu(page);
    }
  }, 90000);

  // Le calcul se lisait mal : 31 px sur un téléphone de 390 px, 22 px téléphone tourné, entre
  // le score, le temps, « Pause » et les vies sur deux rangées. Il a sa case au centre d'une
  // seule ligne, en grand, et un calcul long y tient sans changer la hauteur du bandeau
  // Téléphone tourné : le temps passe à gauche avec le score, « Abandonner » rejoint les
  // boutons à droite, et les deux côtés pèsent autant : le calcul reste au milieu de l'écran
  // (il était décalé de 47 px quand il prenait d'abord toute sa largeur)
  test.each([
    ['téléphone en portrait', PORTRAIT, 32, true, false],
    ['téléphone tourné', SHORT_LANDSCAPE, 30, true, true],
    ['téléphone tourné, grand écran', LANDSCAPE, 30, true, true],
    ['ordinateur', DESKTOP, 40, false, false],
  ])(
    '%s : score, calcul en grand et temps sur une ligne, quel que soit le calcul',
    async (_name, viewport, minimum, phone, turned) => {
      await openArcade(viewport, { phone });
      // Un jeu avec des vies, un jeu sans
      for (const game of ['multisnake', 'multigoal']) {
        await launchArcadeGame(page, game);
        await settle(page);
        const { calcOffCentre, bannerParts, ...layout } = await bannerLayout(page, turned);
        // Au milieu de l'écran à 8 px près (en cas d'échec : le dépassement et les largeurs)
        if (turned) {
          const offCentre = Math.max(0, calcOffCentre - 8);
          expect({ game, offCentre, parts: offCentre ? bannerParts : null }).toEqual({
            game,
            offCentre: 0,
            parts: null,
          });
        }
        expect({ game, ...layout, sizes: undefined }).toEqual({
          game,
          inOrder: true,
          onOneLine: true,
          abandonInBanner: turned,
          buttonSides: [44, 44],
          buttonsOverText: false,
          buttonsOverCalc: false,
          buttonsOverEachOther: false,
          heights: 1,
          calcHeights: 1,
          sizes: undefined,
        });
        const small = layout.sizes.filter(size => size.px < minimum || !size.fits);
        expect({ game, small }).toEqual({ game, small: [] });
        // Sur ordinateur, la barre de défilement de la page prend sa largeur : jamais plus
        const { overflow } = await screenState(page);
        expect({ game, x: Math.max(0, overflow.x), y: overflow.y }).toEqual({ game, x: 0, y: 0 });
        await backToArcadeMenu(page);
      }
    },
    60000
  );

  test('téléphone en portrait : plateaux plus hauts que larges, sans défilement', async () => {
    await openArcade(PORTRAIT);
    for (const game of ARCADE_GAMES) {
      await launchArcadeGame(page, game);
      await settle(page);
      const { board, overflow } = await screenState(page);
      expect({ game, ...overflow }).toEqual({ game, x: 0, y: 0 });
      expect({ game, tall: board.height > board.width }).toEqual({ game, tall: true });
      // Presque toute la largeur de l'écran, même avec la consigne affichée
      expect({ game, wide: board.width > 280 }).toEqual({ game, wide: true });
      await backToArcadeMenu(page);
    }
  }, 90000);

  // Le plateau garde sa taille du premier au dernier instant : la consigne, posée dessus, ne
  // lui prend pas de place et part sans rien déplacer. Elle laisse passer le doigt au plateau.
  // Les six jeux sur chaque écran : chacun pose sa consigne à sa place (MultiMemory sur
  // ordinateur a trois rangées, consigne en bas), et chacun a montré le défaut sur ordinateur.
  // Sous le plateau, « Abandonner » reste en bas de l'écran dès le lancement, et le dessin du
  // jeu couvre le plateau (à une case près) : tous les plateaux prennent la place, MultiMiam
  // compris (avant : 346 px vides sous le bouton dans MultiMemory, puis un labyrinthe de
  // 360 × 456 entre deux bandes de mur de 57 px dans MultiMiam en portrait).
  const ON_BOARD = {
    inside: true,
    overlaps: true,
    touched: 'CANVAS',
    placedAsSaid: true,
    abandonAtBottom: true,
    drawingFillsBoard: true,
  };
  // Téléphone tourné : « Abandonner » est dans le bandeau, pas en bas de l'écran
  const ON_BOARD_TURNED = {
    inside: true,
    overlaps: true,
    touched: 'CANVAS',
    placedAsSaid: true,
    drawingFillsBoard: true,
  };
  test.each([
    ['téléphone en portrait', PORTRAIT, true, ON_BOARD, ARCADE_GAMES],
    ['téléphone tourné', LANDSCAPE, true, ON_BOARD_TURNED, ARCADE_GAMES],
    ['ordinateur', DESKTOP, false, ON_BOARD, ARCADE_GAMES],
  ])(
    '%s : la consigne part sans rien déplacer, ni le plateau ni « Abandonner »',
    async (_screen, viewport, phone, spot, games) => {
      await openArcade(viewport, { phone });
      for (const game of games) {
        await launchArcadeGame(page, game);
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
        expect({ game, ...noteSpot(during, spot) }).toEqual({ game, ...spot });
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
    await launchArcadeGame(page, 'multisnake');
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
    await launchArcadeGame(page, 'multimemory');
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
    const point = await toScreen(page, target, target.x + target.w / 2, target.y + target.h / 2);
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
    await launchArcadeGame(page, 'multisnake');
    await enterFullscreen(page);
    const head = await snakeHead(page);
    await page.touchscreen.tap(head.x, head.y - 2.5 * head.cell);
    // La tête regarde vers le haut, au-dessus de sa place de départ
    expect(await snakeTurnedUp(page, head.y)).toBe(true);
  }, 40000);

  test('plein écran, téléphone tourné : MultiInvaders vise la colonne touchée', async () => {
    await openArcade(PORTRAIT);
    await launchArcadeGame(page, 'invasion');
    await enterFullscreen(page);
    await page.setViewport(LANDSCAPE);
    await pause(800);
    // Un monstre qui ne porte pas la bonne réponse : le toucher rapporte 100 points. Son
    // nombre est écrit au-dessus de son centre (unités du jeu)
    const question = await page.$eval('.arcade-question', el => el.textContent);
    const [a, b] = question.match(/\d+/g).map(Number);
    const labels = await page.evaluate(() =>
      globalThis.__draws.texts.filter(t => t.canvas === 'arcade-canvas').slice(-5)
    );
    const wrong = labels.find(label => Number(label.text) !== a * b);
    const point = await toScreen(page, wrong, wrong.x, wrong.y + 60);
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
    await launchArcadeGame(page, 'multimemory');
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
