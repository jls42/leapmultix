// Prise de vue de la vidéo de la fiche Play Store : Chrome sans fenêtre sur le jeu, en paysage,
// avec trois aides posées avant le chargement de la page : le relevé de ce que les jeux
// écrivent et dessinent sur leur plateau (pour jouer juste, sans toucher au code du jeu) et un
// rond qui montre où le doigt touche.
import puppeteer from 'puppeteer';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
/** Racine du dépôt du jeu */
export const REPO = resolve(HERE, '../../..');
/** Dépôt voisin de l'appli Android (LEAPMULTIX_ANDROID pour un autre emplacement) */
export const APP_REPO = process.env.LEAPMULTIX_ANDROID || resolve(REPO, '../leapmultix-android');
const APP_WWW = join(APP_REPO, 'www');
/** Le jeu filmé : celui que l'appli embarque quand son dépôt est là, sinon le dépôt du jeu */
export const RACINE =
  process.env.RACINE || (existsSync(join(APP_WWW, 'index.html')) ? APP_WWW : REPO);
/** Prises et vidéos : dans analysis/, que git ignore */
export const WORK = resolve(REPO, 'analysis/video-fiche');
export const TAKES = process.env.PRISES || join(WORK, 'prises');
export const OUTPUTS = process.env.SORTIES || join(WORK, 'sorties');

const require = createRequire(import.meta.url);
const { startStaticServer } = require(join(REPO, 'tests/utils/static-server.cjs'));

/** 960 × 540 points à la densité 2 : une image de 1920 × 1080 */
export const VIEW = { width: 960, height: 540, dpr: 2 };
export const PLAYERS = new Map([
  ['fr', 'Léa'],
  ['en', 'Emma'],
  ['es', 'Lucía'],
]);
export const BOARD = '#game canvas';
const UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36';

export const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const OPERATIONS = new Map([
  ['×', (a, b) => a * b],
  ['x', (a, b) => a * b],
  ['+', (a, b) => a + b],
  ['-', (a, b) => a - b],
  ['−', (a, b) => a - b],
  ['÷', (a, b) => a / b],
  [':', (a, b) => a / b],
  ['/', (a, b) => a / b],
]);

/** Résultat du premier calcul écrit dans un texte (« 7 × 8 ») ; null s'il n'y en a pas. */
export function resultOf(text) {
  const m = /(\d+)\s*([×x+\-−÷:/])\s*(\d+)/.exec(text);
  return m ? OPERATIONS.get(m[2])(Number(m[1]), Number(m[3])) : null;
}

/* --- Aides posées dans la page avant son chargement --- */

// Textes écrits sur un plateau : texte, position en pixels du canevas, heure
function recordTexts() {
  const proto = CanvasRenderingContext2D.prototype;
  const fillText = proto.fillText;
  proto.fillText = function record(text, x, y, ...rest) {
    const m = this.getTransform();
    const list = (this.canvas.__texts ||= []);
    list.push({
      t: String(text),
      x: m.a * x + m.c * y + m.e,
      y: m.b * x + m.d * y + m.f,
      at: performance.now(),
    });
    if (list.length > 600) list.splice(0, 300);
    return fillText.call(this, text, x, y, ...rest);
  };
}

// Images posées sur un plateau : fichier, centre et taille en pixels du canevas, heure
function recordImages() {
  const proto = CanvasRenderingContext2D.prototype;
  const drawImage = proto.drawImage;
  proto.drawImage = function record(image, ...rest) {
    const [x, y, w, h] =
      rest.length >= 8
        ? rest.slice(4, 8)
        : [rest[0], rest[1], rest[2] ?? image.width, rest[3] ?? image.height];
    const m = this.getTransform();
    const cx = x + w / 2;
    const cy = y + h / 2;
    const list = (this.canvas.__images ||= []);
    list.push({
      src: String(image.currentSrc || image.src || '')
        .split('/')
        .pop(),
      x: m.a * cx + m.c * cy + m.e,
      y: m.b * cx + m.d * cy + m.f,
      w: Math.abs(m.a * w),
      h: Math.abs(m.d * h),
      at: performance.now(),
    });
    if (list.length > 900) list.splice(0, 450);
    return drawImage.call(this, image, ...rest);
  };
}

// Rond du doigt : il grandit et s'efface en une demi-seconde
function installRipple() {
  window.__ripple = (x, y) => {
    const dot = document.createElement('div');
    dot.style.cssText =
      `position:fixed;left:${x - 22}px;top:${y - 22}px;width:44px;height:44px;border-radius:50%;` +
      'background:rgb(255 255 255 / 0.55);border:3px solid rgb(30 60 120 / 0.75);' +
      'box-sizing:border-box;pointer-events:none;z-index:2147483647;' +
      'transition:transform 380ms ease-out, opacity 380ms ease-out;';
    document.documentElement.append(dot);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        dot.style.transform = 'scale(1.7)';
        dot.style.opacity = '0';
      })
    );
    setTimeout(() => dot.remove(), 520);
  };
}

/* --- Ouverture du jeu --- */

async function createPlayer(page, name) {
  await page.waitForSelector('#new-user-name', { visible: true, timeout: 10000 });
  await page.type('#new-user-name', name);
  await page.click('#create-user-btn');
  await enterAsFirstPlayer(page);
}

const skipIntro = page => page.evaluate(() => document.getElementById('skip-intro-btn')?.click());

async function pickFirstPlayer(page) {
  await page.waitForSelector('.user-container .user-tile', { visible: true, timeout: 10000 });
  await (await page.$$('.user-container .user-tile'))[0].click();
}

// Première entrée d'un joueur : la mascotte se présente, « Passer » la referme
async function enterAsFirstPlayer(page) {
  await pickFirstPlayer(page);
  await page.waitForSelector('#character-intro-modal', { visible: true, timeout: 10000 });
  await skipIntro(page);
  await page.waitForFunction(
    () => document.querySelector('#character-intro-modal')?.style.display === 'none',
    { timeout: 10000 }
  );
}

/** Ouvre le jeu, crée le joueur de la langue, choisit la langue. */
export async function open(lang, view = VIEW) {
  const server = await startStaticServer('networkidle0', { rootDir: RACINE });
  // Sans cette densité forcée, l'enregistrement sort à la taille en points (960 × 540)
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--mute-audio', `--force-device-scale-factor=${view.dpr}`],
  });
  const page = await browser.newPage();
  const problems = [];
  page.on('pageerror', error => problems.push(`pageerror ${error.message}`));
  await page.setUserAgent({ userAgent: UA });
  await page.setViewport({
    width: view.width,
    height: view.height,
    deviceScaleFactor: view.dpr,
    isMobile: true,
    hasTouch: true,
  });
  await page.evaluateOnNewDocument(recordTexts);
  await page.evaluateOnNewDocument(recordImages);
  await page.evaluateOnNewDocument(installRipple);
  // Aucune fête : la fiche ne montre rien de daté
  const url = `${server.url}?saison=aucune`;
  await page.goto(url, server.gotoOptions);
  await createPlayer(page, PLAYERS.get(lang));
  await setLanguage(page, lang);
  const close = async () => {
    await browser.close();
    await server.stop();
  };
  return { page, close, problems, url };
}

/** Retour à l'accueil du joueur (hors champ). */
export async function home(page, url) {
  await page.goto(url, { waitUntil: 'networkidle0' });
  await pickFirstPlayer(page);
  // Au retour, la présentation de la mascotte ne revient pas toujours : la fermer si elle est là
  await wait(600);
  await skipIntro(page);
  await page.waitForSelector('.mode-btn[data-mode="quiz"]', { visible: true, timeout: 10000 });
  await wait(500);
}

/** Le bouton de langue est visible en paysage large ; sinon il est dans le menu. */
export async function setLanguage(page, lang) {
  const button = `.slide.active-slide .lang-btn[data-lang="${lang}"]`;
  const direct = await page.evaluate(
    sel => [...document.querySelectorAll(sel)].some(el => el.offsetParent !== null),
    button
  );
  if (!direct) {
    await clickNow(page, '.slide.active-slide .burger-menu-btn');
    await wait(350);
  }
  await clickNow(page, button);
  await wait(900);
  await page.evaluate(() => {
    document.querySelector('.slide.active-slide .burger-menu-btn[aria-expanded="true"]')?.click();
  });
  await wait(300);
}

/** Lance un jeu d'Arcade depuis l'accueil : sa tuile dépliée, puis « Jouer » (hors champ). */
export async function launchArcade(page, game) {
  const card = `.arcade-game-card[data-game="${game}"]`;
  await clickNow(page, '.mode-btn[data-mode="arcade"]');
  await page.waitForSelector(card, { visible: true, timeout: 10000 });
  const expanded = await page.$eval(card, el => el.classList.contains('expanded'));
  if (!expanded) await clickNow(page, `${card} .arcade-game-toggle`);
  await clickNow(page, `${card} .play-arcade-btn`);
  await page.waitForSelector(BOARD, { visible: true, timeout: 10000 });
}

/* --- Gestes --- */

function waitVisible(page, selector) {
  return page.waitForFunction(
    sel => [...document.querySelectorAll(sel)].some(el => el.offsetParent !== null),
    { timeout: 10000 },
    selector
  );
}

/** Clic direct, sans rond (mise en place hors champ). */
export async function clickNow(page, selector) {
  await waitVisible(page, selector);
  await page.evaluate(sel => {
    [...document.querySelectorAll(sel)].find(el => el.offsetParent !== null).click();
  }, selector);
}

/** Centre d'un élément visible, en points de la fenêtre. */
export async function centre(page, selector) {
  await waitVisible(page, selector);
  return page.evaluate(sel => {
    const el = [...document.querySelectorAll(sel)].find(e => e.offsetParent !== null);
    el.scrollIntoView({ block: 'nearest' });
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, selector);
}

/** Toucher montré à l'image : le rond, puis le doigt. */
export async function tapAt(page, x, y, pause = 140) {
  await page.evaluate((px, py) => window.__ripple(px, py), x, y);
  await wait(pause);
  await page.touchscreen.tap(x, y);
}

export async function tap(page, selector, pause) {
  const p = await centre(page, selector);
  await tapAt(page, p.x, p.y, pause);
  return p;
}

const SWIPES = new Map([
  ['UP', [0, -1]],
  ['DOWN', [0, 1]],
  ['LEFT', [-1, 0]],
  ['RIGHT', [1, 0]],
]);

/** Glissement du doigt montré à l'image : part de (x, y), `length` points dans la direction. */
export async function swipe(page, x, y, direction, length = 48) {
  const [dx, dy] = SWIPES.get(direction);
  await page.evaluate((px, py) => window.__ripple(px, py), x, y);
  await page.touchscreen.touchStart(x, y);
  await page.touchscreen.touchMove(x + (dx * length) / 2, y + (dy * length) / 2);
  await page.touchscreen.touchMove(x + dx * length, y + dy * length);
  await page.touchscreen.touchEnd();
  await page.evaluate((px, py) => window.__ripple(px, py), x + dx * length, y + dy * length);
}

/* --- Lecture des plateaux --- */

/** Textes écrits sur le plateau depuis moins de `fresh` ms, en points de la fenêtre. */
export function boardTexts(page, selector = BOARD, fresh = 120) {
  return page.evaluate(
    (sel, ms) => {
      const canvas = [...document.querySelectorAll(sel)].find(el => el.offsetParent !== null);
      if (!canvas?.__texts) return [];
      const r = canvas.getBoundingClientRect();
      const now = performance.now();
      const seen = new Map();
      for (const item of canvas.__texts) {
        if (now - item.at > ms) continue;
        const x = r.left + (item.x * r.width) / canvas.width;
        const y = r.top + (item.y * r.height) / canvas.height;
        seen.set(`${item.t}@${Math.round(x / 6)},${Math.round(y / 6)}`, { t: item.t, x, y });
      }
      return [...seen.values()];
    },
    selector,
    fresh
  );
}

/** Images posées sur le plateau depuis moins de `fresh` ms, en points de la fenêtre. */
export function boardImages(page, selector = BOARD, fresh = 120) {
  return page.evaluate(
    (sel, ms) => {
      const canvas = [...document.querySelectorAll(sel)].find(el => el.offsetParent !== null);
      if (!canvas?.__images) return [];
      const r = canvas.getBoundingClientRect();
      const kx = r.width / canvas.width;
      const ky = r.height / canvas.height;
      const now = performance.now();
      const seen = new Map();
      for (const item of canvas.__images) {
        if (now - item.at > ms) continue;
        const x = r.left + item.x * kx;
        const y = r.top + item.y * ky;
        const key = `${item.src}@${Math.round(x / 6)},${Math.round(y / 6)}`;
        seen.set(key, { src: item.src, x, y, w: item.w * kx, h: item.h * ky, at: item.at });
      }
      return [...seen.values()];
    },
    selector,
    fresh
  );
}

/** Place du plateau dans la fenêtre. */
export function boardBox(page, selector = BOARD) {
  return page.evaluate(sel => {
    const canvas = [...document.querySelectorAll(sel)].find(el => el.offsetParent !== null);
    const r = canvas.getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  }, selector);
}

/** Calcul affiché au bandeau des jeux d'Arcade : son texte, sa réponse, s'il est résolu. */
export async function arcadeQuestion(page) {
  const text = await page.evaluate(() =>
    (document.querySelector('#game .arcade-question')?.textContent ?? '')
      .replace(/\s+/g, ' ')
      .trim()
  );
  return { text, answer: resultOf(text), solved: /=\s*\d+\s*$/.test(text) };
}

/** Score affiché au bandeau d'un jeu d'Arcade. */
export function arcadeScore(page) {
  return page.evaluate(() => {
    const text = document.querySelector('#game [id$="-info-score"]')?.textContent ?? '';
    return Number(text.replace(/\D+/g, '')) || 0;
  });
}

/* --- Enregistrement --- */

/** Enregistre ce que fait `play` ; rend le journal des moments marqués (en secondes). */
export async function film(page, path, play) {
  const recorder = await page.screencast({ path });
  const t0 = Date.now();
  const marks = [];
  const mark = (name, extra = {}) =>
    marks.push({ name, t: Math.round((Date.now() - t0) / 10) / 100, ...extra });
  try {
    await play(mark);
  } finally {
    mark('fin');
    await recorder.stop();
  }
  return marks;
}
