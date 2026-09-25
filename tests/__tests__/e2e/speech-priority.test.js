/**
 * Tests E2E - File de parole : l'annonce va au bout, la phrase en attente part ensuite,
 * chaque phrase est un énoncé à part (plus de texte recollé).
 * @jest-environment node
 */

const puppeteer = require('puppeteer');
const { createUserAndSkipIntro } = require('../../utils/game-session.cjs');
const { startStaticServer } = require('../../utils/static-server.cjs');

// Synthèse factice : note chaque énoncé et chaque coupure ; un énoncé ne finit que quand
// le test appelle __endUtterance() (le début est signalé tout de suite, comme un navigateur)
const SPEECH_STUB_SOURCE =
  '(() => {' +
  '  const actions = [];' +
  '  globalThis.SpeechSynthesisUtterance = function speechStub(text) {' +
  "    this.text = String(text ?? '');" +
  '    this.volume = 1;' +
  '    this.onstart = null;' +
  '    this.onend = null;' +
  '    this.onerror = null;' +
  '  };' +
  '  let current = null;' +
  '  const speechSynthesis = {' +
  '    speaking: false,' +
  '    pending: false,' +
  '    speak(utterance) {' +
  "      actions.push({ type: 'speak', text: utterance.text });" +
  '      current = utterance;' +
  "      if (typeof utterance.onstart === 'function') utterance.onstart();" +
  '    },' +
  '    cancel() {' +
  "      actions.push({ type: 'cancel' });" +
  '      current = null;' +
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
  '  globalThis.__endUtterance = () => {' +
  '    const utterance = current;' +
  '    current = null;' +
  "    if (utterance && typeof utterance.onend === 'function') utterance.onend();" +
  '  };' +
  '})();';

async function injectSpeechStub(page) {
  await page.evaluateOnNewDocument(SPEECH_STUB_SOURCE);
}

/**
 * La voix est désactivée par défaut : ces tests portent sur un joueur qui l'a activée.
 * @param {import('puppeteer').Page} page
 */
async function enableVoice(page) {
  await page.evaluateOnNewDocument(() => localStorage.setItem('voiceEnabled', 'true'));
}

/** Énoncés et coupures notés, sans l'énoncé vide qui amorce la synthèse au premier geste */
function recordedActions(page) {
  return page.evaluate(() =>
    (globalThis.__speechActions || []).filter(a => a.type !== 'speak' || a.text !== '')
  );
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
    await enableVoice(page);
    await page.goto(baseUrl, gotoOptions);
  });

  afterEach(async () => {
    await page.close();
  });

  test('l’annonce du mode va au bout ; la question l’attend, puis part seule', async () => {
    await createUserAndSkipIntro(page);
    await page.click('.mode-btn[data-mode="quiz"]');

    await page.waitForFunction(
      () =>
        (globalThis.__speechActions || []).some(
          action => action.type === 'speak' && /^Mode/i.test(action.text || '')
        ),
      { timeout: 20000 }
    );
    // La question est affichée pendant l'annonce : elle attend, sans la couper
    await page.waitForSelector('#quiz-question', { visible: true, timeout: 10000 });
    const during = await recordedActions(page);
    const announcementIndex = during.findIndex(a => a.type === 'speak' && /^Mode/i.test(a.text));
    expect(during.slice(announcementIndex + 1)).toEqual([]);

    await page.evaluate(() => globalThis.__endUtterance());
    await page.waitForFunction(
      () =>
        (globalThis.__speechActions || []).filter(a => a.type === 'speak' && a.text).length >= 2,
      { timeout: 5000 }
    );
    const after = await recordedActions(page);
    const next = after.slice(announcementIndex + 1);
    expect(next).toHaveLength(1);
    expect(next[0].type).toBe('speak');
    // Un énoncé à part : jamais « Mode Quiz. Combien font… »
    expect(next[0].text).not.toMatch(/^Mode/i);
    expect(next[0].text.length).toBeGreaterThan(0);
  }, 40000);

  test('une phrase normale coupe la précédente et part seule', async () => {
    await createUserAndSkipIntro(page);

    await page.evaluate(async currentBaseUrl => {
      const modulePath = new URL('./js/speech.js', currentBaseUrl).href;
      const speechModule = await import(modulePath);
      globalThis.__speechActions.length = 0;
      speechModule.speak('Première phrase');
      speechModule.speak('Phrase suivante');
    }, baseUrl);

    const actions = await recordedActions(page);
    expect(actions).toEqual([
      { type: 'speak', text: 'Première phrase' },
      { type: 'cancel' },
      { type: 'speak', text: 'Phrase suivante' },
    ]);
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
