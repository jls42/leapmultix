/**
 * Tests E2E - Validation du système de priorités de synthèse vocale
 * @jest-environment node
 */

const puppeteer = require('puppeteer');
const { startStaticServer } = require('../../utils/static-server.cjs');

const SPEECH_STUB_SOURCE =
  '(() => {' +
  '  const actions = [];' +
  '  globalThis.SpeechSynthesisUtterance = function speechStub(text) {' +
  "    this.text = String(text ?? '');" +
  "    this.lang = 'fr-FR';" +
  '    this.rate = 0.9;' +
  '    this.pitch = 1.1;' +
  '    this.volume = 1;' +
  '    this.onstart = null;' +
  '    this.onend = null;' +
  '    this.onerror = null;' +
  '  };' +
  '  const speechSynthesis = {' +
  '    speaking: false,' +
  '    pending: false,' +
  '    _currentUtterance: null,' +
  '    speak(utterance) {' +
  "      actions.push({ type: 'speak', text: utterance.text });" +
  '      this.speaking = true;' +
  '      this.pending = false;' +
  '      this._currentUtterance = utterance;' +
  "      if (typeof utterance.onstart === 'function') utterance.onstart();" +
  '    },' +
  '    cancel() {' +
  "      actions.push({ type: 'cancel' });" +
  '      this.speaking = false;' +
  '      this.pending = false;' +
  "      if (this._currentUtterance && typeof this._currentUtterance.onend === 'function') {" +
  '        this._currentUtterance.onend();' +
  '      }' +
  '      this._currentUtterance = null;' +
  '    },' +
  '    getVoices() {' +
  '      return [];' +
  '    },' +
  '  };' +
  "  Object.defineProperty(globalThis, 'speechSynthesis', {" +
  '    configurable: true,' +
  '    writable: true,' +
  '    value: speechSynthesis,' +
  '  });' +
  '  globalThis.__speechActions = actions;' +
  '})();';

async function injectSpeechStub(page) {
  await page.evaluateOnNewDocument(SPEECH_STUB_SOURCE);
}

/**
 * Crée un utilisateur factice et contourne l'intro vidéo pour atteindre le menu principal.
 * @param {import('puppeteer').Page} page
 */
async function createUserAndSkipIntro(page) {
  const userName = 'TestUser-' + Date.now();
  await page.waitForSelector('#new-user-name', { visible: true, timeout: 10000 });
  await page.type('#new-user-name', userName);
  await page.click('#create-user-btn');
  await page.waitForSelector('.user-container .btn:not(.delete-btn)', {
    visible: true,
    timeout: 10000,
  });
  const userButtons = await page.$$('.user-container .btn:not(.delete-btn)');
  await userButtons[0].click();
  await page.waitForSelector('#character-intro-modal', { visible: true, timeout: 10000 });
  await page.evaluate(() => {
    document.getElementById('skip-intro-btn')?.click();
  });
  await page.waitForFunction(
    () => document.querySelector('#character-intro-modal')?.style.display === 'none',
    { timeout: 10000 }
  );
  await page.waitForSelector('.mode-btn[data-mode="quiz"]', { visible: true, timeout: 10000 });
}

describe('Speech Priority System E2E', () => {
  let browser;
  let page;
  let server;
  let baseUrl;
  let gotoOptions;

  beforeAll(async () => {
    server = await startStaticServer('networkidle0');
    baseUrl = server.url;
    gotoOptions = server.gotoOptions;

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }, 30000);

  afterAll(async () => {
    await browser.close();
    if (server) {
      await server.stop();
    }
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await injectSpeechStub(page);
    await page.goto(baseUrl, gotoOptions);
  });

  afterEach(async () => {
    await page.close();
  });

  test('Mode announcement should use high priority', async () => {
    await createUserAndSkipIntro(page);
    await page.click('.mode-btn[data-mode="quiz"]');

    await page.waitForFunction(
      () => {
        const actions = globalThis.__speechActions || [];
        return actions.some(action => action.type === 'speak' && /^Mode/i.test(action.text || ''));
      },
      { timeout: 20000 }
    );

    await page.waitForFunction(
      () => (globalThis.__speechActions || []).some(action => action.type === 'cancel'),
      { timeout: 20000 }
    );

    const interruptInfo = await page.evaluate(() => {
      const actions = globalThis.__speechActions || [];
      const firstModeIndex = actions.findIndex(
        action => action.type === 'speak' && /^Mode/i.test(action.text || '')
      );
      if (firstModeIndex === -1) {
        return { cancelFound: false, nextSpeakText: null };
      }

      let cancelFound = false;
      let nextSpeakText = null;
      for (let i = firstModeIndex + 1; i < actions.length; i += 1) {
        const action = actions[i];
        if (action.type === 'cancel') {
          cancelFound = true;
          continue;
        }
        if (cancelFound && action.type === 'speak') {
          nextSpeakText = action.text;
          break;
        }
      }

      return { cancelFound, nextSpeakText };
    });

    expect(interruptInfo.cancelFound).toBe(true);
    expect(interruptInfo.nextSpeakText).toBeTruthy();
    expect(interruptInfo.nextSpeakText).toMatch(/Mode|fois/i);
  }, 40000);

  test('Game feedback should cancel previous speech', async () => {
    await createUserAndSkipIntro(page);

    await page.evaluate(async currentBaseUrl => {
      const modulePath = new URL('./js/speech.js', currentBaseUrl).href;
      const speechModule = await import(modulePath);
      speechModule.speak('Première annonce', { priority: 'normal' });
      speechModule.speak('Annonce suivante', { priority: 'normal' });
    }, baseUrl);

    const actions = await page.evaluate(() => globalThis.__speechActions || []);
    const cancelCount = actions.filter(action => action.type === 'cancel').length;
    expect(cancelCount).toBeGreaterThanOrEqual(1);
  }, 20000);

  test('Speech synthesis should be available in browser', async () => {
    const hasSpeechSynthesis = await page.evaluate(() => 'speechSynthesis' in globalThis);
    expect(hasSpeechSynthesis).toBe(true);
  }, 10000);

  test('speak() function should be importable', async () => {
    const speakAvailable = await page.evaluate(async currentBaseUrl => {
      const modulePath = new URL('./js/speech.js', currentBaseUrl).href;
      const module = await import(modulePath);
      return typeof module.speak === 'function';
    }, baseUrl);
    expect(speakAvailable).toBe(true);
  }, 10000);
});
