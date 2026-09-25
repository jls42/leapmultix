/**
 * @jest-environment node
 */
/* eslint-env jest, node */
/**
 * Service worker (sw.js), exécuté tel quel dans un contexte isolé avec un cache et un
 * réseau simulés : route des traductions.
 */
import { describe, test, expect } from '@jest/globals';
import fs from 'node:fs';
import vm from 'node:vm';

const ORIGIN = 'https://leapmultix.jls42.org';
const SOURCE = fs.readFileSync('sw.js', 'utf8');

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
