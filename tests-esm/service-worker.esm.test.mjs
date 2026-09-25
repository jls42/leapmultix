/**
 * @jest-environment node
 */
/* eslint-env jest, node */
/**
 * Service worker (sw.js), exécuté tel quel dans un contexte isolé avec un cache et un
 * réseau simulés : routes de la voix enregistrée (clips en cache d'abord, index en réseau
 * d'abord, purge par version et plafond) et route des traductions.
 */
import { describe, test, expect } from '@jest/globals';
import fs from 'node:fs';
import vm from 'node:vm';

const ORIGIN = 'https://leapmultix.jls42.org';
const SOURCE = fs.readFileSync('sw.js', 'utf8');
const clipUrl = (lang, version, key) => `${ORIGIN}/voice/${lang}/${version}/${key}.mp3`;
const INDEX = {
  schema: 'cyrb53-nfc-1',
  languages: {
    fr: { voice: 'lucie', version: 'lucie-v3-2', format: 'mp3', audience: 'all', defaultOn: false },
  },
};

class FakeHeaders {
  constructor(headers = {}) {
    this.map = new Map(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]));
  }

  get(name) {
    return this.map.get(name.toLowerCase()) ?? null;
  }
}

class FakeResponse {
  constructor(body = '', { status = 200, headers = {}, type = 'basic', redirected = false } = {}) {
    Object.assign(this, { body, status, type, redirected });
    this.ok = status >= 200 && status < 300;
    this.headers = new FakeHeaders(headers);
    this.init = { status, headers, type, redirected };
  }

  clone() {
    return new FakeResponse(this.body, this.init);
  }

  async json() {
    return JSON.parse(this.body);
  }

  static error() {
    return new FakeResponse('', { status: 0, type: 'error' });
  }
}

const keyOf = request =>
  typeof request === 'string' ? new URL(request, ORIGIN).href : request.url;

class FakeCache {
  constructor() {
    this.entries = new Map();
  }

  async match(request) {
    return this.entries.get(keyOf(request))?.clone();
  }

  async put(request, response) {
    this.entries.set(keyOf(request), response);
  }

  async keys() {
    return [...this.entries.keys()].map(url => ({ url }));
  }

  async delete(request) {
    return this.entries.delete(keyOf(request));
  }

  async addAll() {}
}

class FakeCaches {
  constructor() {
    this.stores = new Map();
  }

  async open(name) {
    if (!this.stores.has(name)) this.stores.set(name, new FakeCache());
    return this.stores.get(name);
  }

  async keys() {
    return [...this.stores.keys()];
  }

  async delete(name) {
    return this.stores.delete(name);
  }

  async match() {
    return undefined;
  }
}

const mp3 = (body = 'mp3') => new FakeResponse(body, { headers: { 'Content-Type': 'audio/mpeg' } });

/** Charge sw.js ; network(url) répond à chaque fetch (ou lève : hors ligne) */
function loadWorker(network) {
  const listeners = {};
  const worker = { listeners, caches: new FakeCaches(), fetches: [] };
  const context = {
    self: {
      addEventListener: (type, handler) => (listeners[type] = handler),
      location: { origin: ORIGIN },
      skipWaiting() {},
      clients: { claim: async () => {} },
    },
    caches: worker.caches,
    fetch: async request => {
      const url = keyOf(request);
      worker.fetches.push(url);
      return network(url);
    },
    Response: FakeResponse,
    URL,
    console,
  };
  vm.createContext(context);
  vm.runInContext(SOURCE, context);
  return worker;
}

async function request(worker, url, { destination = '', mode = 'cors' } = {}) {
  const waits = [];
  let response;
  worker.listeners.fetch({
    request: { url: new URL(url, ORIGIN).href, method: 'GET', mode, destination },
    respondWith: promise => (response = promise),
    waitUntil: promise => waits.push(promise),
  });
  const result = response ? await response : undefined;
  await Promise.all(waits);
  return result;
}

const voiceCache = async worker => (await worker.caches.open('leapmultix-voice')).entries;

describe('Service worker : voix enregistrée', () => {
  test('clip absent du cache : réseau, puis gardé ; ensuite servi sans réseau', async () => {
    const worker = loadWorker(() => mp3('clip'));
    const url = clipUrl('fr', 'lucie-v3-2', 'abc123');
    expect((await request(worker, url)).body).toBe('clip');
    expect([...(await voiceCache(worker)).keys()]).toEqual([url]);
    const again = await request(worker, url);
    expect(again.body).toBe('clip');
    expect(worker.fetches).toEqual([url]);
  });

  test.each([
    ['page HTML en 200', new FakeResponse('<html>', { headers: { 'Content-Type': 'text/html' } })],
    ['clip absent (403)', new FakeResponse('', { status: 403 })],
    [
      'réponse redirigée',
      new FakeResponse('mp3', { headers: { 'Content-Type': 'audio/mpeg' }, redirected: true }),
    ],
    [
      'réponse opaque',
      new FakeResponse('mp3', { headers: { 'Content-Type': 'audio/mpeg' }, type: 'opaque' }),
    ],
  ])('%s : transmise, jamais gardée', async (_label, response) => {
    const worker = loadWorker(() => response);
    const url = clipUrl('fr', 'lucie-v3-2', 'abc123');
    expect((await request(worker, url)).status).toBe(response.status);
    expect((await voiceCache(worker)).size).toBe(0);
  });

  test('hors ligne et pas en cache : échec immédiat (le jeu passe à la synthèse)', async () => {
    const worker = loadWorker(() => {
      throw new TypeError('Failed to fetch');
    });
    const response = await request(worker, clipUrl('fr', 'lucie-v3-2', 'abc123'));
    expect(response.type).toBe('error');
  });

  test('index : réseau d’abord, copie gardée pour le hors-ligne', async () => {
    let offline = false;
    const worker = loadWorker(() => {
      if (offline) throw new TypeError('Failed to fetch');
      return new FakeResponse(JSON.stringify(INDEX), {
        headers: { 'Content-Type': 'application/json' },
      });
    });
    expect(await (await request(worker, '/voice/index.json')).json()).toEqual(INDEX);
    offline = true;
    expect(await (await request(worker, '/voice/index.json')).json()).toEqual(INDEX);
  });

  test('nouvel index : les clips d’autres versions ou langues sont purgés', async () => {
    const worker = loadWorker(url =>
      url.endsWith('index.json') ? new FakeResponse(JSON.stringify(INDEX)) : mp3()
    );
    const current = clipUrl('fr', 'lucie-v3-2', 'a1');
    const old = clipUrl('fr', 'lucie-v3-1', 'a1');
    const other = clipUrl('en', 'nova-1', 'b2');
    for (const url of [current, old, other]) await request(worker, url);
    await request(worker, '/voice/index.json');
    expect([...(await voiceCache(worker)).keys()].sort()).toEqual(
      [current, `${ORIGIN}/voice/index.json`].sort()
    );
  });

  test('plafond : au-delà de 2 000 clips, les plus anciens partent', async () => {
    const worker = loadWorker(url =>
      url.endsWith('index.json') ? new FakeResponse(JSON.stringify(INDEX)) : mp3()
    );
    const cache = await worker.caches.open('leapmultix-voice');
    for (let i = 0; i < 2003; i++) await cache.put(clipUrl('fr', 'lucie-v3-2', `k${i}`), mp3());
    await request(worker, '/voice/index.json');
    const clips = [...cache.entries.keys()].filter(url => url.endsWith('.mp3'));
    expect(clips).toHaveLength(2000);
    expect(clips).not.toContain(clipUrl('fr', 'lucie-v3-2', 'k0'));
    expect(clips).toContain(clipUrl('fr', 'lucie-v3-2', 'k2002'));
  });

  test('activation : les anciens caches partent, celui de la voix reste', async () => {
    const worker = loadWorker(() => mp3());
    for (const name of ['leapmultix-runtime-v1', 'leapmultix-offline-v1', 'leapmultix-voice']) {
      await worker.caches.open(name);
    }
    const waits = [];
    worker.listeners.activate({ waitUntil: promise => waits.push(promise) });
    await Promise.all(waits);
    expect(await worker.caches.keys()).toEqual(['leapmultix-voice']);
  });
});

describe('Service worker : traductions', () => {
  test('avec ?v= : gardées, puis servies même hors ligne', async () => {
    let offline = false;
    const worker = loadWorker(() => {
      if (offline) throw new TypeError('Failed to fetch');
      return new FakeResponse('{"a":1}', { headers: { 'Content-Type': 'application/json' } });
    });
    const url = '/assets/translations/fr.json?v=v22';
    expect((await request(worker, url)).body).toBe('{"a":1}');
    offline = true;
    expect((await request(worker, url)).body).toBe('{"a":1}');
  });
});
