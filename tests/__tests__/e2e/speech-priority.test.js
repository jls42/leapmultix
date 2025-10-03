/**
 * Tests E2E - Validation du système de priorités de synthèse vocale
 * @jest-environment node
 */

const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:8080/index.html';

/**
 * Attend qu'une condition soit vraie ou échoue après timeout.
 * @param {() => boolean} predicate
 * @param {number} timeout
 * @param {number} interval
 */
async function waitFor(predicate, timeout = 10000, interval = 100) {
  const start = Date.now();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (predicate()) return;
    if (Date.now() - start > timeout) {
      throw new Error('Condition non vérifiée dans le délai imparti');
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
}

/**
 * Injecte un stub minimal pour speechSynthesis afin de tracer les appels.
 * @param {import('puppeteer').Page} page
 */
async function injectSpeechStub(page) {
  await page.evaluateOnNewDocument(() => {
    class FakeSpeechSynthesisUtterance {
      constructor(text) {
        this.text = String(text ?? '');
        this.lang = 'fr-FR';
        this.rate = 0.9;
        this.pitch = 1.1;
        this.volume = 1;
        this.onstart = null;
        this.onend = null;
        this.onerror = null;
      }
    }

    const actions = [];
    const speechSynthesis = {
      speaking: false,
      pending: false,
      _currentUtterance: null,
      speak(utterance) {
        actions.push({ type: 'speak', text: utterance.text });
        this.speaking = true;
        this.pending = false;
        this._currentUtterance = utterance;
        if (typeof utterance.onstart === 'function') utterance.onstart();
      },
      cancel() {
        actions.push({ type: 'cancel' });
        this.speaking = false;
        this.pending = false;
        if (this._currentUtterance && typeof this._currentUtterance.onend === 'function') {
          this._currentUtterance.onend();
        }
        this._currentUtterance = null;
      },
      getVoices() {
        return [];
      },
    };

    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      configurable: true,
      writable: true,
      value: FakeSpeechSynthesisUtterance,
    });
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      writable: true,
      value: speechSynthesis,
    });
    window.__speechActions = actions;
  });
}

/**
 * Crée un utilisateur factice et contourne l'intro vidéo pour atteindre le menu principal.
 * @param {import('puppeteer').Page} page
 */
async function createUserAndSkipIntro(page) {
  const userName = `TestUser-${Date.now()}`;
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

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }, 30000);

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await injectSpeechStub(page);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 20000 });
  });

  afterEach(async () => {
    await page.close();
  });

  test('Mode announcement should use high priority', async () => {
    const speechLogs = [];
    page.on('console', async msg => {
      if (!msg.text().startsWith('[Speech] Speaking:')) return;
      const [, payloadHandle] = msg.args();
      if (!payloadHandle) return;
      try {
        const payload = await payloadHandle.jsonValue();
        speechLogs.push(payload);
      } catch (error) {
        void error;
      }
    });

    await createUserAndSkipIntro(page);
    await page.click('.mode-btn[data-mode="quiz"]');

    await waitFor(() => speechLogs.some(log => log.priority === 'high'), 12000);
    const highPriorityLog = speechLogs.find(log => log.priority === 'high');
    expect(highPriorityLog).toBeTruthy();
    expect(highPriorityLog.text).toContain('Mode');

    await page.waitForFunction(
      () => (window.__speechActions || []).some(action => action.type === 'cancel'),
      { timeout: 12000 }
    );

    const interruptInfo = await page.evaluate(() => {
      const actions = window.__speechActions || [];
      const firstHighIndex = actions.findIndex(
        action => action.type === 'speak' && /Mode/.test(action.text || '')
      );
      if (firstHighIndex === -1) {
        return { cancelFound: false, nextSpeakText: null };
      }

      const subsequent = actions.slice(firstHighIndex + 1);
      const cancelIndex = subsequent.findIndex(action => action.type === 'cancel');
      const nextSpeak =
        cancelIndex >= 0
          ? subsequent.slice(cancelIndex + 1).find(action => action.type === 'speak')
          : null;

      return {
        cancelFound: cancelIndex >= 0,
        nextSpeakText: nextSpeak ? nextSpeak.text : null,
      };
    });

    expect(interruptInfo.cancelFound).toBe(true);
    expect(interruptInfo.nextSpeakText).toBeTruthy();
    expect(interruptInfo.nextSpeakText).toContain('Mode');
  }, 40000);

  test('Game feedback should cancel previous speech', async () => {
    await createUserAndSkipIntro(page);

    await page.evaluate(async () => {
      const speechModule = await import('/js/speech.js');
      speechModule.speak('Première annonce', { priority: 'normal' });
      speechModule.speak('Annonce suivante', { priority: 'normal' });
    });

    const actions = await page.evaluate(() => window.__speechActions || []);
    const cancelCount = actions.filter(action => action.type === 'cancel').length;
    expect(cancelCount).toBeGreaterThanOrEqual(1);
  }, 20000);

  test('Speech synthesis should be available in browser', async () => {
    const hasSpeechSynthesis = await page.evaluate(() => 'speechSynthesis' in window);
    expect(hasSpeechSynthesis).toBe(true);
  }, 10000);

  test('speak() function should be importable', async () => {
    const speakAvailable = await page.evaluate(async () => {
      const module = await import('/js/speech.js');
      return typeof module.speak === 'function';
    });
    expect(speakAvailable).toBe(true);
  }, 10000);
});
