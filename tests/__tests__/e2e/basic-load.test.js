/**
 * Tests E2E - Chargement de base de l'application
 * @jest-environment node
 */

const puppeteer = require('puppeteer');

describe('Basic Application Load E2E', () => {
  let browser;
  let page;
  const BASE_URL = 'http://localhost:8080/index.html';

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }, 30000);

  afterAll(async () => {
    if (browser) {
      await browser.close();
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
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 15000 });
    const title = await page.title();
    expect(title).toContain('LeapMultix');
  }, 20000);

  test('No JavaScript errors on load', async () => {
    const errors = [];
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 15000 });

    // Vérifier qu'il n'y a pas d'erreurs JS critiques
    const hasCriticalErrors = errors.some(
      msg => msg.includes('TypeError') || msg.includes('ReferenceError') || msg.includes('is not')
    );
    expect(hasCriticalErrors).toBe(false);
  }, 20000);

  test('Speech synthesis is available', async () => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 15000 });
    const hasSpeechSynthesis = await page.evaluate(() => {
      return 'speechSynthesis' in window;
    });
    expect(hasSpeechSynthesis).toBe(true);
  }, 20000);

  test('Main game elements are present', async () => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 15000 });

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
