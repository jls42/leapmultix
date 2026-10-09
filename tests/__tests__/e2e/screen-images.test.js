/**
 * Tests E2E - Illustrations du tableau de bord et de l'Aventure : les logos des 9 rangées du
 * tableau de bord et les cadeaux de l'Aventure viennent en WebP, au moins aussi grands qu'à
 * l'écran × la densité (ordinateur de densité 2, téléphone de densité 3), jamais en PNG de
 * 1024 px ; sans variantes (développement, CI), chaque image passe à son PNG et s'affiche.
 * Avant : PNG de 1,5 à 2,3 Mo, 17,5 Mo pour le tableau de bord, 6,2 Mo pour un niveau
 * d'Aventure.
 * Les têtes des avatars aussi (js/avatar-heads.js), de « Qui joue ? » à l'écran d'échec de
 * l'Aventure : avant, le PNG de 128 px partout (0,44 à 0,89 de la netteté voulue).
 * @jest-environment node
 */

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const puppeteer = require('puppeteer');
const { startStaticServer } = require('../../utils/static-server.cjs');
const { answerGameDialog } = require('../../utils/game-session.cjs');

const ROOT = path.resolve(__dirname, '../../..');
// Sans les variantes du générateur actuel (CI : npm run assets:generate ne tourne qu'au
// déploiement), seul le repli sur les PNG se vérifie
const GENERATED = fs.existsSync(
  path.join(ROOT, 'assets/generated-images/arcade/cadeau_ouvert-512.webp')
);
const describeGenerated = GENERATED ? describe : describe.skip;
const ANDROID_USER_AGENT =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36';
const SCREENS = [
  ['ordinateur, densité 2', { width: 1440, height: 900, deviceScaleFactor: 2 }],
  [
    'téléphone, densité 3',
    { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  ],
];
const DASHBOARD_LOGOS = '#slide7 img.score-logo';

/**
 * Zoé, joueuse de tous les modes (tests-esm/helpers/legacy-profiles.mjs, instantané de
 * localStorage d'une version publiée) : son tableau de bord montre toutes les rangées
 */
function zoeSnapshot() {
  const run = spawnSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      "import { legacySnapshot } from './tests-esm/helpers/legacy-profiles.mjs';" +
        'process.stdout.write(JSON.stringify(legacySnapshot()));',
    ],
    { cwd: ROOT, encoding: 'utf8' }
  );
  return JSON.parse(run.stdout);
}

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

/** Bouton de l'écran affiché (chaque écran a sa barre du haut) */
async function pressShown(page, selector) {
  await page.waitForFunction(
    sel =>
      [...document.querySelectorAll(sel)].some(
        el => el.closest('.slide') && getComputedStyle(el.closest('.slide')).display !== 'none'
      ),
    { timeout: 10000 },
    selector
  );
  await page.evaluate(sel => {
    const shown = [...document.querySelectorAll(sel)].find(
      el => getComputedStyle(el.closest('.slide')).display !== 'none'
    );
    shown.click();
  }, selector);
}

/** Les images d'un sélecteur : adresse, largeur servie, pixels qu'elles occupent à l'écran */
function shownImages(page, selector) {
  return page.evaluate(sel => {
    const ratio = Math.min(3, devicePixelRatio);
    return [...document.querySelectorAll(sel)].map(img => {
      const src = new URL(img.currentSrc).pathname;
      // naturalWidth d'une image de srcset est ramenée à la densité : la largeur est celle
      // de la variante choisie, lue dans son adresse
      const variant = /-(\d+)\.webp$/.exec(src);
      return {
        src,
        served: variant ? Number(variant[1]) : img.naturalWidth,
        needed: Math.round(img.getBoundingClientRect().width * ratio),
        loaded: img.complete && img.naturalWidth > 0,
      };
    });
  }, selector);
}

/** Moins de pixels servis qu'à l'écran (2 % d'arrondi admis) */
const isBlurry = image => image.served < image.needed * 0.98;

/** Têtes de « Qui joue ? » : tuiles des joueurs et formulaire « Nouveau joueur » */
const SLIDE0_HEADS = '#slide0 .user-tile-face, #slide0 .creation-avatar-selector img';
/** Personnalisation : avatar actuel, avatars du joueur et boutique */
const SLIDE6_HEADS = '#current-avatar-img, #slide6 .avatar-btn img';
const HEAD_VARIANT = /^\/assets\/generated-images\/arcade\/[a-z]+_head_avatar-\d+\.webp$/;
const HEAD_PNG = /^\/assets\/images\/arcade\/[a-z]+_head_avatar_128x128\.png$/;

/**
 * Ce qui ne va pas dans des têtes : pas la variante attendue, pas chargée, floue
 * @param {Array<Object>} heads - shownImages
 * @param {RegExp} [expected] - Adresse attendue (variante WebP, ou PNG sans variantes)
 */
function headProblems(heads, expected = HEAD_VARIANT) {
  return {
    count: heads.length > 0,
    unexpected: heads.filter(img => !expected.test(img.src)),
    broken: heads.filter(img => !img.loaded),
    blurry: expected === HEAD_VARIANT ? heads.filter(isBlurry) : [],
  };
}
const HEADS_OK = { count: true, unexpected: [], broken: [], blurry: [] };

/** Avatar que montrent des têtes, lu dans l'adresse affichée (currentSrc) */
const avatarsOf = heads => heads.map(img => /\/([a-z]+)_head_avatar/.exec(img.src)?.[1]);

/** Têtes qui suivent l'avatar porté : mascotte, avatar actuel, tuile de Zoé */
const WORN_HEADS = '#hero-mascot-img, #current-avatar-img, [data-player="Zoé"] .user-tile-face';

describe('Illustrations du tableau de bord et de l’Aventure (E2E)', () => {
  let browser;
  let page;
  let server;
  const snapshot = zoeSnapshot();

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

  /**
   * Le jeu ouvert pour Zoé
   * @param {Object} viewport
   * @param {{withoutVariants?: boolean}} [options] - aucune variante servie, dès la première
   *   page (comme avant npm run assets:generate) : rien ne vient d'une image déjà chargée
   */
  async function openAsZoe(viewport, options) {
    await openGame(viewport, options);
    await chooseZoe();
  }

  /**
   * « Qui joue ? » affiché avec les joueurs de l'instantané, avant tout choix
   * @param {Object} viewport
   * @param {{withoutVariants?: boolean}} [options]
   */
  async function openGame(viewport, { withoutVariants = false } = {}) {
    page = await browser.newPage();
    await page.setBypassServiceWorker(true);
    if (viewport.isMobile) await page.setUserAgent(ANDROID_USER_AGENT);
    await page.setViewport(viewport);
    if (withoutVariants) {
      await page.setRequestInterception(true);
      page.on('request', request => {
        if (request.url().includes('/assets/generated-images/')) {
          request.respond({ status: 404, contentType: 'text/plain', body: 'absent' });
        } else {
          request.continue();
        }
      });
    }
    await page.goto(server.url, server.gotoOptions);
    await page.evaluate(entries => {
      localStorage.clear();
      for (const [key, value] of Object.entries(entries)) {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      }
    }, snapshot);
    await page.reload(server.gotoOptions);
    await page.waitForSelector('.user-container .user-tile', { visible: true, timeout: 10000 });
  }

  async function chooseZoe() {
    await page.evaluate(() =>
      [...document.querySelectorAll('.user-container .user-tile')]
        .find(tile => tile.textContent.includes('Zoé'))
        .click()
    );
    await page.waitForSelector('.mode-btn[data-mode="quiz"]', { visible: true, timeout: 10000 });
  }

  /** Les images d'un sélecteur, une fois toutes chargées ou en échec */
  async function settledImages(selector) {
    await page.waitForFunction(
      sel => {
        const images = [...document.querySelectorAll(sel)];
        return images.length > 0 && images.every(img => img.complete);
      },
      { timeout: 15000 },
      selector
    );
    // Un repli vers le PNG relance le chargement : le laisser aboutir
    await pause(300);
    await page.waitForFunction(
      sel => [...document.querySelectorAll(sel)].every(img => img.complete),
      { timeout: 15000 },
      selector
    );
    return shownImages(page, selector);
  }

  /** Personnalisation ouverte (avatar actuel, grille, boutique) */
  async function openPersonalization() {
    await pressShown(page, '.top-bar .personalization-btn');
    await page.waitForFunction(
      () => getComputedStyle(document.getElementById('slide6')).display !== 'none',
      { timeout: 10000 }
    );
  }

  /** Réponses fausses jusqu'à l'écran d'échec du niveau */
  async function loseLevel() {
    for (let turn = 0; turn < 12; turn++) {
      if (await page.$('.adventure-results')) break;
      const question = await page.$eval('#adventure-question', el => el.textContent);
      const [, a, b] = /(\d+)\s*×\s*(\d+)/.exec(question) ?? [];
      const wrong = await page.$$eval(
        '#adventure-options .option[data-value]',
        (options, right) => options.map(o => o.dataset.value).find(v => v !== String(right)),
        a * b
      );
      if (wrong)
        await page.$eval(`#adventure-options .option[data-value="${wrong}"]`, o => o.click());
      await pause(400);
      const next = await page.$('#adventure-continue-btn');
      if (next && (await next.evaluate(el => el.getClientRects().length > 0))) {
        await next.evaluate(el => el.click());
      }
      await nextScreen(question);
    }
    await page.waitForSelector('.adventure-results .results-avatar', { timeout: 15000 });
  }

  /** Tableau de bord ouvert, chaque rangée passée à l'écran (logos chargés à l'approche) */
  async function openDashboard() {
    await pressShown(page, '.top-bar .dashboard-btn');
    await page.waitForFunction(
      selector => document.querySelectorAll(selector).length === 9,
      { timeout: 10000 },
      DASHBOARD_LOGOS
    );
    for (let index = 0; index < 9; index++) {
      await page.evaluate(
        (selector, n) => document.querySelectorAll(selector)[n].scrollIntoView({ block: 'center' }),
        DASHBOARD_LOGOS,
        index
      );
      await pause(100);
    }
    await page.waitForFunction(
      selector =>
        [...document.querySelectorAll(selector)].every(img => img.complete && img.naturalWidth),
      { timeout: 15000 },
      DASHBOARD_LOGOS
    );
    return shownImages(page, DASHBOARD_LOGOS);
  }

  async function startFirstAdventureLevel() {
    await pressShown(page, '.mode-btn[data-mode="adventure"]');
    await page.waitForSelector('.level-card[data-level="1"]', { visible: true, timeout: 10000 });
    await page.$eval('.level-card[data-level="1"]', card => card.click());
    await page.waitForSelector('#adventure-options .option', { visible: true, timeout: 10000 });
    await page.waitForFunction(() => document.querySelector('#adventure-treasure img')?.complete, {
      timeout: 10000,
    });
  }

  /** Réponse juste à la question affichée, lue à l'écran (« a × b = ? ») */
  async function answerShownQuestion() {
    const question = await page.$eval('#adventure-question', el => el.textContent);
    const [, a, b] = /(\d+)\s*×\s*(\d+)/.exec(question) ?? [];
    const option = a ? await page.$(`#adventure-options .option[data-value="${a * b}"]`) : null;
    if (option) await option.evaluate(button => button.click());
    return question;
  }

  /** La question suivante, ou l'écran de fin */
  function nextScreen(previous) {
    return page
      .waitForFunction(
        question =>
          document.querySelector('.results-treasure') ||
          document.querySelector('#adventure-question')?.textContent !== question,
        { timeout: 8000 },
        previous
      )
      .catch(() => null);
  }

  /** Les dix questions du niveau, chacune juste, jusqu'au trésor de l'écran de fin */
  async function winLevel() {
    for (let turn = 0; turn < 20; turn++) {
      if (await page.$('.results-treasure')) break;
      await nextScreen(await answerShownQuestion());
    }
    await page.waitForFunction(
      () => {
        const img = document.querySelector('.results-treasure');
        return img?.complete && img.naturalWidth > 0;
      },
      { timeout: 15000 }
    );
  }

  describeGenerated('En WebP, aussi nettes qu’à l’écran', () => {
    test.each(SCREENS)(
      '%s : les 9 logos du tableau de bord',
      async (_name, viewport) => {
        await openAsZoe(viewport);
        const logos = await openDashboard();
        expect(logos).toHaveLength(9);
        const notWebp = logos.filter(img => !img.src.startsWith('/assets/generated-images/'));
        expect({
          notWebp,
          broken: logos.filter(img => !img.loaded),
          blurry: logos.filter(isBlurry),
        }).toEqual({ notWebp: [], broken: [], blurry: [] });
      },
      60000
    );

    test.each(SCREENS)(
      '%s : le cadeau de la scène, puis le trésor de l’écran de fin',
      async (_name, viewport) => {
        await openAsZoe(viewport);
        await startFirstAdventureLevel();
        const [closed] = await shownImages(page, '#adventure-treasure img');
        expect(closed.src).toMatch(/^\/assets\/generated-images\/arcade\/cadeau_ferme-\d+\.webp$/);
        expect({ loaded: closed.loaded, blurry: isBlurry(closed) }).toEqual({
          loaded: true,
          blurry: false,
        });
        await winLevel();
        const [treasure] = await shownImages(page, '.results-treasure');
        expect(treasure.src).toMatch(
          /^\/assets\/generated-images\/arcade\/cadeau_ouvert-\d+\.webp$/
        );
        expect({ loaded: treasure.loaded, blurry: isBlurry(treasure) }).toEqual({
          loaded: true,
          blurry: false,
        });
      },
      90000
    );
  });

  describeGenerated('Têtes des avatars en WebP, aussi nettes qu’à l’écran', () => {
    test.each(SCREENS)(
      '%s : « Qui joue ? », accueil et Personnalisation',
      async (_name, viewport) => {
        await openGame(viewport);
        const slide0 = await settledImages(SLIDE0_HEADS);
        // Trois tuiles (Zoé, Léa, Tom) et les cinq avatars du formulaire
        expect(slide0).toHaveLength(8);
        expect(headProblems(slide0)).toEqual(HEADS_OK);
        await chooseZoe();
        const mascot = await settledImages('#hero-mascot-img');
        expect({ problems: headProblems(mascot), avatars: avatarsOf(mascot) }).toEqual({
          problems: HEADS_OK,
          avatars: ['panda'],
        });
        await openPersonalization();
        const slide6 = await settledImages(SLIDE6_HEADS);
        // Avatar actuel, puis les cinq avatars : ceux de Zoé et ceux de la boutique
        expect(slide6).toHaveLength(6);
        expect(headProblems(slide6)).toEqual(HEADS_OK);
        expect(avatarsOf(slide6)).toEqual([
          'panda',
          'fox',
          'panda',
          'unicorn',
          'dragon',
          'astronaut',
        ]);
      },
      60000
    );

    test.each(SCREENS)(
      '%s : acheter puis choisir un avatar change toutes les têtes qui le montrent',
      async (_name, viewport) => {
        await openAsZoe(viewport);
        await openPersonalization();
        await page.$eval('#avatar-shop [data-avatar="dragon"]', button => button.click());
        await answerGameDialog(page, true);
        // L'avatar acheté est porté aussitôt : mascotte, avatar actuel, tuile de « Qui joue ? »
        expect(avatarsOf(await settledImages(WORN_HEADS))).toEqual(['dragon', 'dragon', 'dragon']);
        await page.$eval('#slide6 .avatar-radio[value="fox"]', radio => radio.click());
        const worn = await settledImages(WORN_HEADS);
        expect({ problems: headProblems(worn), avatars: avatarsOf(worn) }).toEqual({
          problems: HEADS_OK,
          avatars: ['fox', 'fox', 'fox'],
        });
      },
      60000
    );

    test.each(SCREENS)(
      '%s : tableau de bord, carte de l’Aventure et écran d’échec',
      async (_name, viewport) => {
        await openAsZoe(viewport);
        await pressShown(page, '.top-bar .dashboard-btn');
        const dashboard = await settledImages('#dashboard-avatar img');
        expect([headProblems(dashboard), avatarsOf(dashboard)]).toEqual([HEADS_OK, ['panda']]);
        await pressShown(page, '.home-btn');
        await pressShown(page, '.mode-btn[data-mode="adventure"]');
        await page.waitForSelector('.level-card[data-level="1"]', {
          visible: true,
          timeout: 10000,
        });
        const map = await settledImages('#adventure-avatar img');
        expect([headProblems(map), avatarsOf(map)]).toEqual([HEADS_OK, ['panda']]);
        await page.$eval('.level-card[data-level="1"]', card => card.click());
        await page.waitForSelector('#adventure-options .option', { visible: true, timeout: 10000 });
        // Le personnage de la scène : sa source haute définition (catalogue des images d'Arcade)
        const [character] = await settledImages('#adventure-character img');
        expect(character.src).toMatch(/^\/assets\/generated-images\/arcade\/panda-\d+\.webp$/);
        expect({ loaded: character.loaded, blurry: isBlurry(character) }).toEqual({
          loaded: true,
          blurry: false,
        });
        await loseLevel();
        const results = await settledImages('.results-avatar');
        expect([headProblems(results), avatarsOf(results)]).toEqual([HEADS_OK, ['panda']]);
      },
      90000
    );
  });

  test('sans variantes (développement, CI) : chaque image passe à son PNG et s’affiche', async () => {
    await openGame({ width: 1280, height: 800, deviceScaleFactor: 1 }, { withoutVariants: true });
    expect(headProblems(await settledImages(SLIDE0_HEADS), HEAD_PNG)).toEqual(HEADS_OK);
    await chooseZoe();
    expect(headProblems(await settledImages('#hero-mascot-img'), HEAD_PNG)).toEqual(HEADS_OK);
    await openPersonalization();
    expect(headProblems(await settledImages(SLIDE6_HEADS), HEAD_PNG)).toEqual(HEADS_OK);
    const logos = await openDashboard();
    expect(logos.filter(img => !img.loaded || !img.src.endsWith('.png'))).toEqual([]);
    expect(headProblems(await settledImages('#dashboard-avatar img'), HEAD_PNG)).toEqual(HEADS_OK);
    await pressShown(page, '.home-btn');
    await startFirstAdventureLevel();
    const [closed] = await shownImages(page, '#adventure-treasure img');
    expect(closed).toMatchObject({ src: '/assets/images/arcade/cadeau_ferme.png', loaded: true });
    const [character] = await settledImages('#adventure-character img');
    expect(character).toMatchObject({
      src: '/assets/images/arcade/panda_right_128x128.png',
      loaded: true,
    });
  }, 90000);
});
