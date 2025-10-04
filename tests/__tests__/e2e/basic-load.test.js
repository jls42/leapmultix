/**
 * Tests E2E - Chargement de base de l'application
 * @jest-environment node
 */

const puppeteer = require('puppeteer');
const { startStaticServer } = require('../../utils/static-server.cjs');

describe('Basic Application Load E2E', () => {
  let browser;
  let page;
  let server;
  let baseUrl;
  let gotoOptions;

  beforeAll(async () => {
    server = await startStaticServer('networkidle2');
    baseUrl = server.url;
    gotoOptions = server.gotoOptions;

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }, 30000);

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }

    if (server) {
      await server.stop();
    }
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  afterEach(async () => {
    if (page) {
      await page.close();
    }
  });

  test('Application loads successfully', async () => {
    await page.goto(baseUrl, gotoOptions);
    const title = await page.title();
    expect(title).toContain('LeapMultix');
  }, 20000);

  test('No JavaScript errors on load', async () => {
    const errors = [];
    page.on('pageerror', err => {
      errors.push(err.message);
    });

    await page.goto(baseUrl, gotoOptions);

    const hasCriticalErrors = errors.some(
      msg => msg.includes('TypeError') || msg.includes('ReferenceError') || msg.includes('is not')
    );
    expect(hasCriticalErrors).toBe(false);
  }, 20000);

  test('Speech synthesis is available', async () => {
    await page.goto(baseUrl, gotoOptions);
    const hasSpeechSynthesis = await page.evaluate(() => 'speechSynthesis' in globalThis);
    expect(hasSpeechSynthesis).toBe(true);
  }, 20000);

  test('Main game elements are present', async () => {
    await page.goto(baseUrl, gotoOptions);

    const slide0Exists = await page.$('#slide0');
    const modeButtons = await page.$$eval('.mode-btn', buttons =>
      buttons.map(btn => btn.dataset.mode)
    );

    expect(slide0Exists).toBeTruthy();
    expect(modeButtons).toEqual(
      expect.arrayContaining(['discovery', 'quiz', 'challenge', 'adventure', 'arcade'])
    );
  }, 20000);
});
