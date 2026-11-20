/**
 * Tests E2E - Téléphone tourné (écran large et bas, css/landscape-phone.css) : en partie, la
 * question est à gauche et les réponses à droite, sans défilement ; l'accueil et le menu de
 * l'Arcade tiennent sur un écran. En portrait et sur tablette, rien ne change.
 * @jest-environment node
 */

import { describe, expect, test } from '@jest/globals';
import { chromeSession } from '../helpers/chrome-session.mjs';
import { createUserAndSkipIntro, pause, pressButton } from '../helpers/game-session.mjs';
import { NO_SEASON } from '../../js/core/seasons.js';

const ANDROID_USER_AGENT =
  'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36';
const phone = (width, height) => ({
  width,
  height,
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
// Téléphone Android tourné, barres du système déduites : la hauteur la plus courante
const TURNED = phone(740, 340);
// Téléphone plus grand : au-delà de 768 px de large, l'écran de jeu part d'une autre base
const WIDE = phone(844, 390);
const PORTRAIT = phone(390, 844);
const TABLET = { width: 1024, height: 768, deviceScaleFactor: 1, isMobile: true, hasTouch: true };
// Fenêtre d'ordinateur large et basse (portable à 125 %) : le menu de la barre est déplié
const SHORT_DESKTOP = { width: 1100, height: 500, deviceScaleFactor: 1 };

const GAME = '.slide.active-slide';
const QUESTION = `${GAME} .question`;
const OPTIONS = `${GAME} .options`;
const OPTION = `${GAME} .option`;

/**
 * Boîte du premier élément affiché de chaque sélecteur (null s'il n'y en a pas), et ce que la
 * page laisse à faire défiler
 * @param {import('puppeteer').Page} page
 * @param {Record<string, string>} selectors
 */
function measure(page, selectors) {
  return page.evaluate(named => {
    const shown = selector =>
      [...document.querySelectorAll(selector)].filter(
        element => element.getBoundingClientRect().width > 0
      );
    const plain = element => {
      const { left, right, top, bottom, width, height } = element.getBoundingClientRect();
      return { left, right, top, bottom, width, height };
    };
    const root = document.documentElement;
    const boxes = Object.fromEntries(
      Object.entries(named).map(([name, selector]) => [name, shown(selector).map(plain)])
    );
    return {
      boxes,
      view: { width: innerWidth, height: innerHeight },
      scroll: { x: root.scrollWidth - innerWidth, y: root.scrollHeight - innerHeight },
    };
  }, selectors);
}

/** L'écran est en place : entrée animée finie, page en haut (sinon tout se mesure décalé) */
function settled(page) {
  return page.waitForFunction(
    () =>
      window.scrollY === 0 &&
      document
        .getAnimations()
        .every(a => a.playState !== 'running' || a.effect?.getTiming().iterations === Infinity),
    { timeout: 10000 }
  );
}

/** Répond jusqu'à l'explication d'une erreur ; false si aucune erreur en douze réponses */
async function answerUntilMistake(page) {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    await page.waitForSelector(`${OPTION}:not(:disabled)`, { visible: true, timeout: 10000 });
    await page.evaluate(
      selector => document.querySelector(selector).click(),
      `${OPTION}:not(:disabled)`
    );
    await pause(400);
    if (await page.$(`${GAME} .feedback-explain`)) return true;
  }
  return false;
}

const lowest = boxes => Math.max(...boxes.map(box => Math.ceil(box.bottom)));

/** Sélecteurs de la barre du haut et des infos de la partie (score, vies, progression) */
const BAR = {
  infos: `${GAME} .game-info-bar`,
  bar: `${GAME} .top-bar`,
  barButtons: `${GAME} .top-bar :is(button, .coin-display)`,
};

/** Les infos de la partie sont dans la barre du haut, sans toucher un de ses boutons */
function expectInfosInBar(boxes) {
  const [infos] = boxes.infos;
  const [bar] = boxes.bar;
  expect(infos.top).toBeGreaterThanOrEqual(bar.top);
  expect(infos.bottom).toBeLessThanOrEqual(bar.bottom + 1);
  const over = boxes.barButtons.filter(
    button => button.left < infos.right && infos.left < button.right
  );
  expect(over).toEqual([]);
}

describe('Téléphone tourné (E2E)', () => {
  const session = chromeSession();

  /** Accueil du jeu sur un écran donné, un joueur créé */
  async function openHome(viewport) {
    const page = await session.newPage();
    if (viewport.isMobile) await page.setUserAgent(ANDROID_USER_AGENT);
    await page.setViewport(viewport);
    await page.goto(`${session.server.url}?saison=${NO_SEASON}`, session.server.gotoOptions);
    await createUserAndSkipIntro(page);
    await settled(page);
    return page;
  }

  /** Une question posée dans un mode à réponses à choisir */
  async function openQuestion(viewport, mode, start) {
    const page = await openHome(viewport);
    await pressButton(page, `.mode-btn[data-mode="${mode}"]`);
    if (start) await start(page);
    await page.waitForSelector(`${QUESTION}:not(:empty)`, { visible: true, timeout: 15000 });
    await settled(page);
    return page;
  }

  test('accueil : les six modes sur un écran, en deux rangées de trois', async () => {
    const page = await openHome(TURNED);
    const { boxes, view, scroll } = await measure(page, { modes: '#slide1 .mode-btn' });
    expect(boxes.modes).toHaveLength(6);
    expect(new Set(boxes.modes.map(box => Math.round(box.top))).size).toBe(2);
    expect(lowest(boxes.modes)).toBeLessThanOrEqual(view.height);
    expect(Math.min(...boxes.modes.map(box => Math.floor(box.height)))).toBeGreaterThanOrEqual(44);
    expect(scroll.x).toBeLessThanOrEqual(0);
  }, 60000);

  test.each([
    ['téléphone tourné', TURNED],
    ['grand téléphone tourné', WIDE],
  ])(
    'Quiz, %s : la question à gauche, les réponses à droite, rien à faire défiler',
    async (_name, viewport) => {
      const page = await openQuestion(viewport, 'quiz');
      const { boxes, view, scroll } = await measure(page, {
        question: QUESTION,
        options: OPTIONS,
        option: OPTION,
        quit: `${GAME} .game-quit .btn`,
        ...BAR,
      });
      const [question] = boxes.question;
      const [options] = boxes.options;
      expect(question.right).toBeLessThanOrEqual(options.left);
      expect(lowest([...boxes.option, ...boxes.quit])).toBeLessThanOrEqual(view.height);
      expect(Math.min(...boxes.option.map(box => Math.floor(box.height)))).toBeGreaterThanOrEqual(
        44
      );
      expect({ x: Math.max(0, scroll.x), y: Math.max(0, scroll.y) }).toEqual({ x: 0, y: 0 });
      // Score, progression et série dans la barre du haut, entre ses boutons et les pièces
      expectInfosInBar(boxes);
    },
    60000
  );

  test('Quiz, après une erreur : les réponses ne bougent pas, « Continuer » est visible', async () => {
    const page = await openQuestion(TURNED, 'quiz');
    const before = await measure(page, { options: OPTIONS });
    expect(await answerUntilMistake(page)).toBe(true);
    await page.waitForSelector(`${GAME} .game-continue .btn`, { visible: true, timeout: 5000 });
    const { boxes, view } = await measure(page, {
      options: OPTIONS,
      explain: `${GAME} .feedback-explain`,
      next: `${GAME} .game-continue .btn`,
    });
    const place = ([box]) => ({ left: Math.round(box.left), top: Math.round(box.top) });
    // La question peut avoir changé depuis la première mesure, pas la place de ses réponses
    expect(place(boxes.options)).toEqual(place(before.boxes.options));
    expect(lowest(boxes.next)).toBeLessThanOrEqual(view.height);
    expect(boxes.explain[0].right).toBeLessThanOrEqual(boxes.options[0].left);
  }, 90000);

  test('Aventure : le niveau, la question, les réponses et « Abandonner » sur un écran', async () => {
    const page = await openQuestion(TURNED, 'adventure', start =>
      pressButton(start, '.level-card.is-available')
    );
    const { boxes, view, scroll } = await measure(page, {
      question: QUESTION,
      options: OPTIONS,
      option: OPTION,
      scene: `${GAME} .adventure-scene`,
      quit: `${GAME} .game-quit .btn`,
      ...BAR,
    });
    expect(boxes.scene[0].bottom).toBeLessThanOrEqual(boxes.question[0].top);
    expect(boxes.question[0].right).toBeLessThanOrEqual(boxes.options[0].left);
    expect(lowest([...boxes.question, ...boxes.option, ...boxes.quit])).toBeLessThanOrEqual(
      view.height
    );
    expect({ x: Math.max(0, scroll.x), y: Math.max(0, scroll.y) }).toEqual({ x: 0, y: 0 });
    // Quatre infos (score, vies, progression, série) : le cas le plus large de la barre
    expectInfosInBar(boxes);
  }, 60000);

  test('Chrono, réponse tapée : le clavier à droite de la question, touches de 44 px', async () => {
    const page = await openQuestion(TURNED, 'chrono', async start => {
      await pressButton(start, '.chrono-input-options > :last-child');
      await pressButton(start, '#chrono-start');
    });
    await page.waitForSelector(`${GAME} .chrono-key`, { visible: true, timeout: 15000 });
    const { boxes, view, scroll } = await measure(page, {
      question: QUESTION,
      typed: `${GAME} .chrono-typed`,
      keys: `${GAME} .chrono-key`,
      quit: `${GAME} .game-quit .btn`,
    });
    expect(boxes.keys).toHaveLength(11);
    const leftmost = Math.min(...boxes.keys.map(key => key.left));
    expect(boxes.question[0].right).toBeLessThanOrEqual(leftmost);
    expect(boxes.typed[0].top).toBeGreaterThanOrEqual(boxes.question[0].bottom);
    expect(boxes.typed[0].right).toBeLessThanOrEqual(leftmost);
    const smallest = Math.min(...boxes.keys.flatMap(key => [key.width, key.height]));
    expect(Math.floor(smallest)).toBeGreaterThanOrEqual(44);
    expect(lowest([...boxes.keys, ...boxes.quit])).toBeLessThanOrEqual(view.height);
    expect({ x: Math.max(0, scroll.x), y: Math.max(0, scroll.y) }).toEqual({ x: 0, y: 0 });
  }, 60000);

  test('menu de l’Arcade : les six jeux sur un écran', async () => {
    const page = await openHome(TURNED);
    await pressButton(page, '.mode-btn[data-mode="arcade"]');
    await page.waitForSelector(`${GAME} .arcade-game-card`, { visible: true, timeout: 10000 });
    await settled(page);
    const { boxes, view, scroll } = await measure(page, {
      cards: `${GAME} .arcade-game-card`,
      names: `${GAME} .arcade-game-toggle`,
    });
    expect(boxes.cards).toHaveLength(6);
    expect(lowest(boxes.cards)).toBeLessThanOrEqual(view.height);
    // Chaque nom tient dans sa tuile
    const cut = boxes.names.filter(
      name => !boxes.cards.some(card => card.left <= name.left && name.right <= card.right)
    );
    expect(cut).toEqual([]);
    expect(Math.max(0, scroll.x)).toBe(0);
  }, 60000);

  // Au-delà de 992 px de large, la barre du haut montre tous ses boutons : les infos de la
  // partie gardent leur rangée, sous la barre (posées dedans, elles couvraient les boutons)
  test('fenêtre d’ordinateur large et basse : les infos restent sous la barre du haut', async () => {
    const page = await openQuestion(SHORT_DESKTOP, 'quiz');
    const { boxes, view } = await measure(page, { question: QUESTION, option: OPTION, ...BAR });
    expect(boxes.infos[0].top).toBeGreaterThanOrEqual(boxes.bar[0].bottom);
    expect(boxes.question[0].right).toBeLessThanOrEqual(Math.min(...boxes.option.map(o => o.left)));
    expect(lowest(boxes.option)).toBeLessThanOrEqual(view.height);
  }, 60000);

  test.each([
    ['téléphone en portrait', PORTRAIT],
    ['tablette en paysage', TABLET],
  ])(
    '%s : la question reste au-dessus des réponses, sous le titre et la barre d’infos',
    async (_name, viewport) => {
      const page = await openQuestion(viewport, 'quiz');
      const { boxes } = await measure(page, {
        question: QUESTION,
        options: OPTIONS,
        title: `${GAME} .screen-title`,
        infos: `${GAME} .game-info-bar`,
        bar: `${GAME} .top-bar`,
      });
      expect(boxes.question[0].bottom).toBeLessThanOrEqual(boxes.options[0].top);
      expect(boxes.title[0].height).toBeGreaterThan(20);
      expect(boxes.infos[0].top).toBeGreaterThanOrEqual(boxes.bar[0].bottom);
    },
    60000
  );
});
