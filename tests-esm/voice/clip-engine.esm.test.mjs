/* eslint-env jest, node */
/**
 * Voix enregistrée : règles d'activation (js/core/voice-activation.js), adresse de base et
 * index (js/voice-clips.js), moteur des clips et ses replis sur la synthèse.
 */
import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import {
  isSpeechActive,
  recordedVoiceEntry,
  speechEngineFor,
} from '../../js/core/voice-activation.js';
import { voiceKey } from '../../js/core/spoken-text.js';
import {
  VOICE_STORAGE_KEYS,
  applyVoiceParam,
  createClipEngine,
  fetchVoiceIndex,
  resolveVoiceBase,
} from '../../js/voice-clips.js';

/** Réponse HTTP minimale (jsdom n'a pas Response) */
class Response {
  constructor(body = '', { status = 200, headers = {} } = {}) {
    this.body = body;
    this.status = status;
    this.ok = status >= 200 && status < 300;
    const lower = Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]));
    this.headers = { get: name => lower[name.toLowerCase()] ?? null };
  }

  async json() {
    return JSON.parse(this.body);
  }

  async blob() {
    return new Blob([this.body], { type: this.headers.get('content-type') ?? '' });
  }
}

const ENTRY = {
  voice: 'lucie',
  version: 'lucie-v3-1',
  format: 'mp3',
  audience: 'all',
  defaultOn: false,
};
const INDEX = { schema: 'cyrb53-nfc-1', languages: { fr: ENTRY } };

describe('Activation : table de vérité', () => {
  test.each([
    ['index absent', null, 'fr', {}, null],
    ['langue absente (coupe-circuit)', INDEX, 'en', { canPlayMp3: true }, null],
    ['MP3 illisible', INDEX, 'fr', { canPlayMp3: false }, null],
    ['audience « all »', INDEX, 'fr', { canPlayMp3: true }, ENTRY],
  ])('%s', (_label, index, lang, browser, expected) => {
    expect(recordedVoiceEntry(index, lang, browser)).toEqual(expected);
  });

  test('audience « test » : seulement pour un navigateur testeur', () => {
    const index = { ...INDEX, languages: { fr: { ...ENTRY, audience: 'test' } } };
    expect(recordedVoiceEntry(index, 'fr', { canPlayMp3: true })).toBeNull();
    expect(recordedVoiceEntry(index, 'fr', { canPlayMp3: true, tester: true })).toMatchObject({
      audience: 'test',
    });
  });

  test.each([
    [true, null, true],
    [false, { ...ENTRY, defaultOn: true }, false],
    [null, { ...ENTRY, defaultOn: true }, true],
    [null, { ...ENTRY, defaultOn: false }, false],
    [null, null, false],
    [true, null, true],
  ])('choix %p, entrée %j : parole active %p', (voicePreference, entry, active) => {
    expect(isSpeechActive({ voicePreference, entry })).toBe(active);
  });

  test.each([
    [true, ENTRY, null, 'clips'],
    [true, ENTRY, true, 'clips'],
    [true, ENTRY, false, 'synthesis'],
    [true, null, null, 'synthesis'],
    [false, ENTRY, null, 'synthesis'],
  ])(
    'active %p, entrée %j, case %p : moteur %s',
    (speechActive, entry, recordedPreference, engine) => {
      expect(speechEngineFor({ speechActive, entry, recordedPreference })).toBe(engine);
    }
  );

  test('case décochée : la parole reste active (seul le moteur change)', () => {
    const entry = { ...ENTRY, defaultOn: true };
    const speechActive = isSpeechActive({ voicePreference: null, entry });
    expect(speechActive).toBe(true);
    expect(speechEngineFor({ speechActive, entry, recordedPreference: false })).toBe('synthesis');
  });
});

describe('Adresse de base et marques du navigateur', () => {
  function memoryStorage() {
    const data = new Map();
    return {
      data,
      get: (key, fallback = null) => (data.has(key) ? data.get(key) : fallback),
      set: (key, value) => data.set(key, value),
      remove: key => data.delete(key),
    };
  }

  test.each([
    ['/voice/', '/voice/'],
    ['', null],
    [null, null],
    ['/voice', null],
    ['//autre.example/voice/', null],
    ['https://autre.example/voice/', null],
    ['/voice/../', null],
  ])('balise %p → %p', (meta, base) => {
    expect(resolveVoiceBase({ meta, localMark: false, hostname: 'leapmultix.jls42.org' })).toBe(
      base
    );
  });

  test('marque locale : /voice/ sur un serveur local seulement', () => {
    expect(resolveVoiceBase({ meta: '', localMark: true, hostname: 'localhost' })).toBe('/voice/');
    expect(resolveVoiceBase({ meta: '', localMark: true, hostname: '127.0.0.1' })).toBe('/voice/');
    expect(
      resolveVoiceBase({ meta: '', localMark: true, hostname: 'leapmultix.jls42.org' })
    ).toBeNull();
  });

  test('?voix=test, ?voix=local, ?voix=off', () => {
    const storage = memoryStorage();
    applyVoiceParam('test', { hostname: 'leapmultix.jls42.org', storage });
    applyVoiceParam('local', { hostname: 'leapmultix.jls42.org', storage });
    expect([...storage.data.keys()]).toEqual([VOICE_STORAGE_KEYS.tester]);
    applyVoiceParam('local', { hostname: 'localhost', storage });
    expect(storage.data.get(VOICE_STORAGE_KEYS.local)).toBe(true);
    applyVoiceParam('off', { hostname: 'localhost', storage });
    expect(storage.data.size).toBe(0);
  });

  test('index : validé, absent, illisible, ou réseau coupé', async () => {
    const calls = [];
    const reply = response => async (url, init) => {
      calls.push({ url, init });
      if (response instanceof Error) throw response;
      return response;
    };
    expect(await fetchVoiceIndex('/voice/', reply(new Response(JSON.stringify(INDEX))))).toEqual(
      INDEX
    );
    expect(calls[0]).toEqual({ url: '/voice/index.json', init: { cache: 'no-cache' } });
    expect(await fetchVoiceIndex('/voice/', reply(new Response('', { status: 403 })))).toBeNull();
    expect(await fetchVoiceIndex('/voice/', reply(new Response('<html>')))).toBeNull();
    expect(await fetchVoiceIndex('/voice/', reply(new TypeError('offline')))).toBeUndefined();
  });
});

/** Élément <audio> simulé : lecture pilotée par le test */
class FakeAudio extends EventTarget {
  constructor() {
    super();
    this.src = '';
    this.muted = false;
    this.volume = 1;
    this.duration = 1.5;
    this.plays = [];
    this.paused = 0;
    this.playResult = () => Promise.resolve();
  }

  play() {
    this.plays.push(this.src);
    return this.playResult();
  }

  pause() {
    this.paused++;
  }

  removeAttribute(name) {
    if (name === 'src') this.src = '';
  }

  fire(type) {
    this.dispatchEvent(new Event(type));
  }
}

const flush = () => new Promise(resolve => setTimeout(resolve, 0));

describe('Moteur des clips', () => {
  let audio;
  let synthesis;
  let fetches;
  let fallbacks;
  let revoked;
  let respond;

  function handlers() {
    return {
      volume: 1,
      onStarted: jest.fn(),
      onEnded: jest.fn(),
      onFailed: jest.fn(),
      setDeadline: jest.fn(),
    };
  }

  function makeEngine(options = {}) {
    return createClipEngine({
      base: '/voice/',
      lang: 'fr',
      entry: ENTRY,
      synthesis,
      audio,
      fetchImpl: (url, init) => {
        fetches.push({ url, init });
        return respond(url, init);
      },
      onFallback: cause => fallbacks.push(cause),
      createObjectURL: blob => `blob:${blob.size}:${fetches.length}`,
      revokeObjectURL: url => revoked.push(url),
      ...options,
    });
  }

  const mp3 = () =>
    new Response(new Uint8Array([0xff, 0xfb, 1, 2]), { headers: { 'Content-Type': 'audio/mpeg' } });

  beforeEach(() => {
    audio = new FakeAudio();
    synthesis = { start: jest.fn(() => ({ stop: jest.fn(), setVolume: jest.fn() })) };
    fetches = [];
    fallbacks = [];
    revoked = [];
    respond = async () => mp3();
  });

  test('clip présent : adresse de la phrase, départ, fin bornée à sa durée + 1 s, puis fin', async () => {
    const engine = makeEngine();
    const h = handlers();
    engine.start('Mode Quiz', h);
    await flush();
    expect(fetches[0].url).toBe(`/voice/fr/lucie-v3-1/${voiceKey('Mode Quiz')}.mp3`);
    expect(audio.plays).toHaveLength(1);
    audio.fire('playing');
    expect(h.onStarted).toHaveBeenCalledTimes(1);
    expect(h.setDeadline).toHaveBeenCalledWith(2500);
    audio.fire('ended');
    expect(h.onEnded).toHaveBeenCalledTimes(1);
    expect(revoked).toHaveLength(1);
    expect(synthesis.start).not.toHaveBeenCalled();
  });

  test('clip absent (403) : repli sur la synthèse, et plus jamais redemandé', async () => {
    respond = async () => new Response('', { status: 403 });
    const engine = makeEngine();
    const h = handlers();
    engine.start('Mode Quiz', h);
    await flush();
    expect(synthesis.start).toHaveBeenCalledWith('Mode Quiz', h);
    expect(fallbacks).toEqual(['absent']);
    engine.start('Mode Quiz', handlers());
    expect(fetches).toHaveLength(1);
    expect(synthesis.start).toHaveBeenCalledTimes(2);
  });

  test('réponse 200 qui n’est pas un MP3 (page HTML) : clip tenu pour absent', async () => {
    respond = async () => new Response('<html>', { headers: { 'Content-Type': 'text/html' } });
    const engine = makeEngine();
    engine.start('Mode Quiz', handlers());
    await flush();
    expect(fallbacks).toEqual(['absent']);
    expect(audio.plays).toEqual([]);
  });

  test('réseau coupé : repli, sans retenir le clip comme absent', async () => {
    respond = async () => {
      throw new TypeError('Failed to fetch');
    };
    const engine = makeEngine();
    engine.start('Mode Quiz', handlers());
    await flush();
    expect(fallbacks).toEqual(['network']);
    respond = async () => mp3();
    engine.start('Mode Quiz', handlers());
    await flush();
    expect(fetches).toHaveLength(2);
    expect(audio.plays).toHaveLength(1);
  });

  test('lecture refusée par le navigateur : repli', async () => {
    audio.playResult = () => Promise.reject(new DOMException('no', 'NotAllowedError'));
    const engine = makeEngine();
    const h = handlers();
    engine.start('Mode Quiz', h);
    await flush();
    await flush();
    expect(fallbacks).toEqual(['refused']);
    expect(synthesis.start).toHaveBeenCalledWith('Mode Quiz', h);
  });

  test('clip trop lent (1,5 s) : repli, le téléchargement continue pour le cache sans rien jouer', async () => {
    let release;
    respond = () => new Promise(resolve => (release = () => resolve(mp3())));
    const engine = makeEngine({ startTimeoutMs: 20 });
    const h = handlers();
    engine.start('Mode Quiz', h);
    await new Promise(resolve => setTimeout(resolve, 40));
    expect(fallbacks).toEqual(['timeout']);
    expect(synthesis.start).toHaveBeenCalledWith('Mode Quiz', h);
    expect(fetches[0].init.signal.aborted).toBe(false);
    release();
    await flush();
    await flush();
    expect(audio.plays).toEqual([]);
  });

  test('phrase coupée pendant le téléchargement : requête abandonnée, rien joué, aucun repli', async () => {
    let release;
    respond = () => new Promise(resolve => (release = () => resolve(mp3())));
    const engine = makeEngine();
    const h = handlers();
    const handle = engine.start('Mode Quiz', h);
    handle.stop();
    expect(fetches[0].init.signal.aborted).toBe(true);
    release();
    await flush();
    await flush();
    expect(audio.plays).toEqual([]);
    expect(synthesis.start).not.toHaveBeenCalled();
    expect(h.onEnded).not.toHaveBeenCalled();
  });

  test('phrase coupée pendant la lecture : son arrêté, URL libérée, fin tardive ignorée', async () => {
    const engine = makeEngine();
    const h = handlers();
    const handle = engine.start('Mode Quiz', h);
    await flush();
    audio.fire('playing');
    handle.stop();
    expect(audio.paused).toBe(1);
    expect(audio.src).toBe('');
    expect(revoked).toHaveLength(1);
    audio.fire('ended');
    expect(h.onEnded).not.toHaveBeenCalled();
  });

  test('erreur avant le départ : repli ; erreur en cours de lecture : fin de phrase', async () => {
    const engine = makeEngine();
    const first = handlers();
    engine.start('Mode Quiz', first);
    await flush();
    audio.fire('error');
    expect(fallbacks).toEqual(['error']);
    const second = handlers();
    engine.start('Mode Défi', second);
    await flush();
    audio.fire('playing');
    audio.fire('error');
    expect(second.onEnded).toHaveBeenCalledTimes(1);
    expect(fallbacks).toEqual(['error']);
  });

  test('volume : 0 coupe (iOS ne règle pas le volume), le repli reçoit le volume', async () => {
    const engine = makeEngine();
    const handle = engine.start('Mode Quiz', handlers());
    await flush();
    handle.setVolume(0);
    expect(audio.muted).toBe(true);
    handle.setVolume(0.5);
    expect(audio.muted).toBe(false);
    expect(audio.volume).toBe(0.5);

    respond = async () => new Response('', { status: 404 });
    const fallbackHandle = engine.start('Mode Défi', handlers());
    await flush();
    fallbackHandle.setVolume(0.3);
    expect(synthesis.start.mock.results[0].value.setVolume).toHaveBeenCalledWith(0.3);
  });

  test('déverrouillage : un silence MP3 joué depuis une URL blob:', async () => {
    const blobs = [];
    const engine = makeEngine({
      createObjectURL: blob => {
        blobs.push(blob);
        return 'blob:silence';
      },
    });
    expect(await engine.unlock()).toBe(true);
    expect(blobs[0].type).toBe('audio/mpeg');
    expect(blobs[0].size).toBe(157);
    expect(audio.plays).toEqual(['blob:silence']);
    expect(revoked).toEqual(['blob:silence']);
    audio.playResult = () => Promise.reject(new Error('refusé'));
    expect(await engine.unlock()).toBe(false);
  });

  test('déverrouillage pendant qu’une phrase tient l’élément : son clip n’est pas coupé', async () => {
    const engine = makeEngine();
    const h = handlers();
    engine.start('Mode Quiz', h);
    await flush();
    audio.fire('playing');
    const playing = audio.src;
    expect(await engine.unlock()).toBe(true);
    expect(audio.src).toBe(playing);
    expect(audio.paused).toBe(0);
    expect(audio.plays).toHaveLength(1);
  });

  test('clip démarré pendant le silence de déverrouillage : le clip n’est pas arrêté', async () => {
    let resolveSilence;
    audio.playResult = () => new Promise(resolve => (resolveSilence = resolve));
    const engine = makeEngine();
    const unlocking = engine.unlock();
    audio.playResult = () => Promise.resolve();
    engine.start('Mode Quiz', handlers());
    await flush();
    const clip = audio.src;
    resolveSilence();
    expect(await unlocking).toBe(true);
    expect(audio.src).toBe(clip);
    expect(audio.paused).toBe(0);
  });

  test('préchargement : une requête par clip, en priorité basse ; un absent n’est plus demandé', async () => {
    respond = async url =>
      url.includes(voiceKey('Mode Défi')) ? new Response('', { status: 404 }) : mp3();
    const engine = makeEngine();
    engine.preload(['Mode Quiz', 'Mode Défi', 'Mode Quiz']);
    await flush();
    await flush();
    expect(fetches.map(f => f.init)).toEqual([{ priority: 'low' }, { priority: 'low' }]);
    engine.start('Mode Défi', handlers());
    expect(fetches).toHaveLength(2);
    expect(synthesis.start).toHaveBeenCalledTimes(1);
  });
});
