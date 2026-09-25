/**
 * Tests E2E - Voix enregistrée : dans un vrai navigateur, une phrase qui a son clip part en
 * clip (MP3 servi sous /voice/, joué depuis une URL blob:), une phrase sans clip part par la
 * synthèse ; à la première visite, la parole attend l'index ; sans voix enregistrée
 * configurée, aucune requête /voice/.
 * @jest-environment node
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const puppeteer = require('puppeteer');
const { startStaticServer } = require('../../utils/static-server.cjs');

// Silence MP3 de 0,157 s, le même que js/voice-clips.js utilise pour déverrouiller le son
function silenceMp3() {
  const source = fs.readFileSync(path.resolve(__dirname, '../../../js/voice-clips.js'), 'utf8');
  return Buffer.from(/const SILENCE_MP3 =\s*'([^']+)'/.exec(source)[1], 'base64');
}

// Synthèse et lecture notées ; la synthèse ne finit jamais d'elle-même
const RECORDERS_SOURCE =
  '(() => {' +
  '  const spoken = [];' +
  '  const played = [];' +
  '  globalThis.SpeechSynthesisUtterance = function speechStub(text) {' +
  "    this.text = String(text ?? '');" +
  '  };' +
  "  Object.defineProperty(globalThis, 'speechSynthesis', {" +
  '    configurable: true,' +
  '    value: {' +
  '      speak(utterance) {' +
  '        spoken.push(utterance.text);' +
  "        if (typeof utterance.onstart === 'function') utterance.onstart();" +
  '      },' +
  '      cancel() {},' +
  '      getVoices: () => [],' +
  '    },' +
  '  });' +
  '  const play = HTMLMediaElement.prototype.play;' +
  '  HTMLMediaElement.prototype.play = function recordedPlay() {' +
  "    played.push(String(this.getAttribute('src') || ''));" +
  '    return play.call(this);' +
  '  };' +
  '  globalThis.__spoken = spoken;' +
  '  globalThis.__played = played;' +
  '})();';

async function createUserAndSkipIntro(page) {
  await page.waitForSelector('#new-user-name', { visible: true, timeout: 10000 });
  await page.type('#new-user-name', 'Voix-' + Date.now());
  await page.click('#create-user-btn');
  await page.waitForSelector('.user-container .user-tile', { visible: true, timeout: 10000 });
  const users = await page.$$('.user-container .user-tile');
  await users[0].click();
  await page.waitForSelector('#character-intro-modal', { visible: true, timeout: 10000 });
  await page.evaluate(() => document.getElementById('skip-intro-btn')?.click());
  await page.waitForFunction(
    () => document.querySelector('#character-intro-modal')?.style.display === 'none',
    { timeout: 10000 }
  );
  await page.waitForSelector('.mode-btn[data-mode="quiz"]', { visible: true, timeout: 10000 });
}

describe('Voix enregistrée E2E', () => {
  let browser;
  let server;
  let voiceDir;
  const voiceRequests = [];

  beforeAll(async () => {
    voiceDir = fs.mkdtempSync(path.join(os.tmpdir(), 'voice-e2e-'));
    server = await startStaticServer('networkidle0', { voiceDir });
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--autoplay-policy=no-user-gesture-required',
        '--mute-audio',
      ],
    });
    // Empreinte de l'annonce du Quiz, calculée par le jeu lui-même
    const page = await browser.newPage();
    await page.goto(server.url, server.gotoOptions);
    const key = await page.evaluate(async base => {
      const { voiceKey } = await import(new URL('./js/core/spoken-text.js', base).href);
      return voiceKey('Mode Quiz');
    }, server.url);
    await page.close();
    fs.mkdirSync(path.join(voiceDir, 'fr', 'e2e-1'), { recursive: true });
    fs.writeFileSync(path.join(voiceDir, 'fr', 'e2e-1', `${key}.mp3`), silenceMp3());
    fs.writeFileSync(
      path.join(voiceDir, 'index.json'),
      JSON.stringify({
        schema: 'cyrb53-nfc-1',
        languages: {
          fr: { voice: 'essai', version: 'e2e-1', format: 'mp3', audience: 'all', defaultOn: true },
        },
      })
    );
  }, 40000);

  afterAll(async () => {
    await browser.close();
    await server.stop();
    fs.rmSync(voiceDir, { recursive: true, force: true });
  });

  async function openGame(query) {
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    await page.evaluateOnNewDocument(RECORDERS_SOURCE);
    page.on('request', request => {
      if (new URL(request.url()).pathname.startsWith('/voice/')) voiceRequests.push(request.url());
    });
    await page.goto(server.url + query, server.gotoOptions);
    return { context, page };
  }

  test('annonce avec clip : jouée en clip ; question sans clip : lue par la synthèse', async () => {
    const { context, page } = await openGame('?voix=local');
    try {
      await createUserAndSkipIntro(page);
      await page.click('.mode-btn[data-mode="quiz"]');
      // La question tirée au hasard (« Combien font… ? », vrai/faux dit comme une affirmation,
      // énoncé) n'a pas de clip : elle est la seule phrase qui passe par la synthèse
      await page.waitForFunction(() => globalThis.__spoken.some(Boolean), { timeout: 20000 });
      const { spoken, played, question } = await page.evaluate(() => ({
        spoken: globalThis.__spoken.filter(Boolean),
        played: globalThis.__played,
        question: document.querySelector('#quiz-question')?.textContent ?? '',
      }));
      // L'annonce n'est pas passée par la synthèse, un clip blob: a été joué
      expect(spoken.some(text => /^Mode/.test(text))).toBe(false);
      expect(played.some(src => src.startsWith('blob:'))).toBe(true);
      // La question affichée, lue par la synthèse, seule : ses nombres sont ceux de l'écran
      expect(spoken).toHaveLength(1);
      expect(spoken[0].match(/\d+/g)).toEqual(question.match(/\d+/g));
      expect(voiceRequests.some(url => url.endsWith('/voice/index.json'))).toBe(true);
    } finally {
      await context.close();
    }
  }, 60000);

  test('première visite, index lent : bouton masqué, phrase retenue puis dite en clip', async () => {
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    await page.evaluateOnNewDocument(RECORDERS_SOURCE);
    // L'index attend le feu vert du test (moins de 1,5 s : au-delà, le jeu décide sans lui)
    let releaseIndex;
    const indexHeld = new Promise(resolve => {
      releaseIndex = resolve;
    });
    await page.setRequestInterception(true);
    page.on('request', async request => {
      if (new URL(request.url()).pathname === '/voice/index.json') await indexHeld;
      request.continue();
    });
    const voiceButtons = () =>
      page.$$eval('.top-bar .voice-toggle', buttons =>
        buttons.map(button => ({
          pending: button.hasAttribute('data-voice-pending'),
          visibility: getComputedStyle(button).visibility,
          pressed: button.getAttribute('aria-pressed'),
        }))
      );
    try {
      await page.goto(server.url + '?voix=local', { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.top-bar .voice-toggle');
      const during = await voiceButtons();
      expect(during.length).toBeGreaterThan(0);
      expect(during.every(b => b.pending && b.visibility === 'hidden')).toBe(true);

      // Une phrase demandée pendant l'attente, par la file du jeu lui-même
      const heldWhileSpeaking = await page.evaluate(async base => {
        const speech = await import(new URL('./js/speech.js', base).href);
        speech.speak('Mode Quiz', { priority: 'high' });
        return speech.isSpeechDecisionPending();
      }, server.url);
      expect(heldWhileSpeaking).toBe(true);
      expect(await page.evaluate(() => globalThis.__played.length)).toBe(0);

      releaseIndex();
      await page.waitForFunction(() => globalThis.__played.some(src => src.startsWith('blob:')), {
        timeout: 10000,
      });
      const spoken = await page.evaluate(() => globalThis.__spoken.filter(Boolean));
      expect(spoken).toEqual([]);
      const after = await voiceButtons();
      expect(after.every(b => !b.pending && b.visibility !== 'hidden')).toBe(true);
      expect(after.every(b => b.pressed === 'true')).toBe(true);
    } finally {
      releaseIndex();
      await context.close();
    }
  }, 60000);

  test('sans voix enregistrée configurée (forks) : aucune requête /voice/, voix coupée', async () => {
    voiceRequests.length = 0;
    const { context, page } = await openGame('');
    try {
      await createUserAndSkipIntro(page);
      await page.click('.mode-btn[data-mode="quiz"]');
      await page.waitForSelector('#quiz-question', { visible: true, timeout: 10000 });
      const spoken = await page.evaluate(() => globalThis.__spoken.filter(Boolean));
      expect(voiceRequests).toEqual([]);
      expect(spoken).toEqual([]);
    } finally {
      await context.close();
    }
  }, 60000);
});
