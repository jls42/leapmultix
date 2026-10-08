/**
 * Tests E2E - Clavier et sorties de partie, dans le vrai jeu :
 * - pendant une partie, Échap pose la question de « Abandonner », et la langue ne se change
 *   pas (le choix revient avec l'écran suivant) ;
 * - les flèches restent dans la grille des réponses ;
 * - sur l'accueil, le premier arrêt de tabulation mène aux modes.
 * @jest-environment node
 */

const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer');
const { createUserAndSkipIntro } = require('../../utils/game-session.cjs');
const { startStaticServer } = require('../../utils/static-server.cjs');

const FR = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../../assets/translations/fr.json'), 'utf8')
);

/** Boutons de langue visibles dans la barre de l'écran affiché */
function visibleLanguages(page) {
  return page.$$eval('.slide.active-slide .top-bar .lang-btn', buttons =>
    buttons.filter(button => button.getClientRects().length > 0).map(button => button.dataset.lang)
  );
}

const focusedMatches = (page, selector) =>
  page.evaluate(s => document.activeElement?.matches(s) || false, selector);

async function startQuiz(page) {
  await page.click('.mode-btn[data-mode="quiz"]');
  await page.waitForSelector('#quiz-options .option:not([disabled])', { visible: true });
}

describe('Clavier et sorties de partie (E2E)', () => {
  let browser;
  let page;
  let server;
  let dialogs;

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
    dialogs = [];
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    page.on('dialog', dialog => {
      dialogs.push(dialog.message());
      return page.__acceptDialogs ? dialog.accept() : dialog.dismiss();
    });
    await page.goto(server.url, server.gotoOptions);
    await createUserAndSkipIntro(page);
  }, 40000);

  afterEach(async () => {
    if (page) await page.close();
  });

  test('pendant le Quiz, Échap pose la question de « Abandonner » ; refusée, la partie continue', async () => {
    await startQuiz(page);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => document.querySelector('#slide4.active-slide'));
    expect(dialogs).toEqual([FR.confirm_abandon_quiz]);
    expect(await page.$('#slide4.active-slide #quiz-options .option')).not.toBeNull();
  }, 30000);

  test('pendant une partie, la langue ne se change pas ; elle revient avec l’écran de fin', async () => {
    expect(await visibleLanguages(page)).toEqual(['fr', 'en', 'es']);
    await startQuiz(page);
    expect(await visibleLanguages(page)).toEqual([]);
    page.__acceptDialogs = true;
    await page.click('#quiz-abandon');
    await page.waitForSelector('#slide5.active-slide', { visible: true });
    expect(await visibleLanguages(page)).toEqual(['fr', 'en', 'es']);
  }, 30000);

  test('les flèches restent dans la grille des réponses', async () => {
    await startQuiz(page);
    await page.waitForFunction(() => document.activeElement?.matches('#quiz-options .option'));
    for (const key of ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'ArrowUp']) {
      await page.keyboard.press(key);
      expect({ key, inGrid: await focusedMatches(page, '#quiz-options .option') }).toEqual({
        key,
        inGrid: true,
      });
    }
  }, 30000);

  test('sur l’accueil, le premier arrêt de tabulation mène aux modes', async () => {
    // Départ du haut de la page
    await page.evaluate(() => {
      const start = document.createElement('div');
      start.tabIndex = -1;
      document.body.prepend(start);
      start.focus();
    });
    await page.keyboard.press('Tab');
    expect(await focusedMatches(page, '.skip-link')).toBe(true);
    const box = await page.$eval('.skip-link', link => link.getBoundingClientRect().top);
    expect(box).toBeGreaterThanOrEqual(0);
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.activeElement?.id === 'home-modes-title');
    await page.keyboard.press('Tab');
    expect(await focusedMatches(page, '.mode-btn[data-mode="discovery"]')).toBe(true);
  }, 30000);
});

describe('Clavier et sorties de partie au téléphone (E2E)', () => {
  let browser;
  let page;
  let server;
  let dialogs;

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
    dialogs = [];
    page = await browser.newPage();
    // Avant le chargement : changer d'écran tactile ensuite rechargerait la page
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    page.on('dialog', dialog => {
      dialogs.push(dialog.message());
      return dialog.dismiss();
    });
    await page.goto(server.url, server.gotoOptions);
    await createUserAndSkipIntro(page);
  }, 40000);

  afterEach(async () => {
    if (page) await page.close();
  });

  test('le menu ouvert pendant un jeu d’Arcade reste au-dessus de son bandeau', async () => {
    await page.$eval('.mode-btn[data-mode="arcade"]', button => button.click());
    const card = '.arcade-game-card[data-game="invasion"]';
    await page.waitForSelector(`${card} .arcade-game-toggle`, { visible: true });
    await page.$eval(`${card} .arcade-game-toggle`, toggle => toggle.click());
    await page.$eval(`${card} .play-arcade-btn`, play => play.click());
    await page.waitForSelector('#slide4.active-slide .arcade-game-ui canvas', { visible: true });
    await page.tap('#slide4 .burger-menu-btn');
    await page.waitForSelector('#slide4 .top-bar-nav.is-open', { visible: true });
    // Sous le doigt, au centre de « Tableau de bord » : le bouton, pas le bandeau du jeu
    const dashboard = '#slide4 .top-bar-nav.is-open [data-slide="7"]';
    const onButton = await page.$eval(dashboard, button => {
      const r = button.getBoundingClientRect();
      return button.contains(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2));
    });
    expect(onButton).toBe(true);
    await page.tap(dashboard);
    await page.waitForFunction(() => document.querySelector('#slide4.active-slide'));
    expect(dialogs).toEqual([FR.confirm_abandon_arcade]);
  }, 40000);
});
