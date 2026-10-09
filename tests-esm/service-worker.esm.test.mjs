/**
 * @jest-environment node
 */
/* eslint-env jest, node */
/**
 * Service worker (sw.js), exécuté tel quel dans un contexte isolé avec un cache et un
 * réseau simulés : routes de la voix enregistrée (clips en cache d'abord, index en réseau
 * d'abord, purge par version et plafond), route des traductions, et le hors ligne
 * (préchargement, page du jeu, modules, sons par plages, images d'une même famille).
 */
import { describe, test, expect, afterEach, jest } from '@jest/globals';
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
    const entries = headers instanceof FakeHeaders ? headers.map : Object.entries(headers);
    this.map = new Map([...entries].map(([k, v]) => [k.toLowerCase(), v]));
  }

  get(name) {
    return this.map.get(name.toLowerCase()) ?? null;
  }

  set(name, value) {
    this.map.set(name.toLowerCase(), value);
  }
}

class FakeResponse {
  constructor(body = '', { status = 200, headers = {}, type = 'basic', redirected = false } = {}) {
    Object.assign(this, { body, status, type, redirected });
    this.ok = status >= 200 && status < 300;
    this.headers = new FakeHeaders(headers);
    this.init = { status, headers: this.headers, type, redirected };
  }

  clone() {
    return new FakeResponse(this.body, this.init);
  }

  async json() {
    return JSON.parse(this.body);
  }

  async text() {
    return typeof this.body === 'string' ? this.body : new TextDecoder().decode(this.body);
  }

  async arrayBuffer() {
    return typeof this.body === 'string' ? new TextEncoder().encode(this.body).buffer : this.body;
  }

  static error() {
    return new FakeResponse('', { status: 0, type: 'error' });
  }
}

/** new Request(url, init) du service worker : adresse relative à son origine */
class FakeRequest {
  constructor(url, { cache = 'default', headers = {} } = {}) {
    this.url = new URL(url, ORIGIN).href;
    this.cache = cache;
    this.headers = new FakeHeaders(headers);
  }
}

const keyOf = request =>
  typeof request === 'string' ? new URL(request, ORIGIN).href : request.url;

class FakeCache {
  constructor(fetchFn) {
    this.entries = new Map();
    this.fetchFn = fetchFn;
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

  /** Comme Cache.addAll : tout ou rien */
  async addAll(requests) {
    const responses = await Promise.all(requests.map(request => this.fetchFn(request)));
    if (responses.some(response => !response.ok)) throw new TypeError('addAll: réponse en échec');
    requests.forEach((request, i) => this.entries.set(keyOf(request), responses.at(i)));
  }
}

class FakeCaches {
  constructor(fetchFn) {
    this.stores = new Map();
    this.fetchFn = fetchFn;
  }

  async open(name) {
    if (!this.stores.has(name)) this.stores.set(name, new FakeCache(this.fetchFn));
    return this.stores.get(name);
  }

  async keys() {
    return [...this.stores.keys()];
  }

  async delete(name) {
    return this.stores.delete(name);
  }

  /** Comme caches.match : chaque cache dans l'ordre, ou celui de cacheName */
  async match(request, { cacheName } = {}) {
    const stores = cacheName ? [this.stores.get(cacheName)] : [...this.stores.values()];
    const store = stores.find(candidate => candidate?.entries.has(keyOf(request)));
    return store?.entries.get(keyOf(request)).clone();
  }
}

const mp3 = (body = 'mp3') => new FakeResponse(body, { headers: { 'Content-Type': 'audio/mpeg' } });

/** Charge sw.js ; network(url, request) répond à chaque fetch (ou lève : hors ligne) */
function loadWorker(network) {
  const listeners = {};
  const worker = { listeners, fetches: [], requests: [] };
  const fetchFn = async request => {
    const url = keyOf(request);
    worker.fetches.push(url);
    worker.requests.push(request);
    return network(url, request);
  };
  worker.caches = new FakeCaches(fetchFn);
  const context = {
    self: {
      addEventListener: (type, handler) => (listeners[type] = handler),
      location: { origin: ORIGIN },
      skipWaiting() {},
      clients: { claim: async () => {} },
    },
    caches: worker.caches,
    fetch: fetchFn,
    Response: FakeResponse,
    Request: FakeRequest,
    Headers: FakeHeaders,
    URL,
    console,
    // Passé par une fonction : les minuteries simulées de Jest s'appliquent aussi au worker
    setTimeout: (callback, ms) => setTimeout(callback, ms),
  };
  vm.createContext(context);
  vm.runInContext(SOURCE, context);
  worker.context = context;
  return worker;
}

async function request(
  worker,
  url,
  { destination = '', mode = 'cors', headers = {}, signal = { aborted: false } } = {}
) {
  const waits = [];
  let response;
  worker.listeners.fetch({
    request: {
      url: new URL(url, ORIGIN).href,
      method: 'GET',
      mode,
      destination,
      headers: new FakeHeaders(headers),
      signal,
    },
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

  test('index retiré (403) : sa copie ne revient pas hors ligne', async () => {
    let state = 'publié';
    const worker = loadWorker(() => {
      if (state === 'hors ligne') throw new TypeError('Failed to fetch');
      if (state === 'retiré') return new FakeResponse('', { status: 403 });
      return new FakeResponse(JSON.stringify(INDEX));
    });
    await request(worker, '/voice/index.json');
    state = 'retiré';
    expect((await request(worker, '/voice/index.json')).status).toBe(403);
    state = 'hors ligne';
    expect((await request(worker, '/voice/index.json')).type).toBe('error');
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

  test('français et anglais dans l’index : les clips des deux sont gardés, l’ancienne version purgée', async () => {
    const both = {
      ...INDEX,
      languages: {
        ...INDEX.languages,
        en: {
          voice: 'jane',
          version: 'jane-v1-1',
          format: 'mp3',
          audience: 'all',
          defaultOn: false,
        },
      },
    };
    const worker = loadWorker(url =>
      url.endsWith('index.json') ? new FakeResponse(JSON.stringify(both)) : mp3()
    );
    const french = clipUrl('fr', 'lucie-v3-2', 'a1');
    const english = clipUrl('en', 'jane-v1-1', 'b2');
    const oldEnglish = clipUrl('en', 'jane-v1-0', 'b2');
    for (const url of [french, english, oldEnglish]) await request(worker, url);
    await request(worker, '/voice/index.json');
    expect([...(await voiceCache(worker)).keys()].sort()).toEqual(
      [french, english, `${ORIGIN}/voice/index.json`].sort()
    );
  });

  test('autres voix d’une langue : leurs clips sont gardés, ceux d’une voix retirée purgés', async () => {
    const withJane = {
      ...INDEX,
      languages: {
        ...INDEX.languages,
        en: {
          voice: 'sulafat',
          version: 'sulafat-v1-1',
          format: 'mp3',
          audience: 'all',
          defaultOn: true,
          alternatives: [{ voice: 'jane', version: 'jane-v1-1', format: 'mp3', audience: 'all' }],
        },
      },
    };
    const worker = loadWorker(url =>
      url.endsWith('index.json') ? new FakeResponse(JSON.stringify(withJane)) : mp3()
    );
    const sulafat = clipUrl('en', 'sulafat-v1-1', 'b2');
    const jane = clipUrl('en', 'jane-v1-1', 'b2');
    const retired = clipUrl('en', 'nova-1', 'b2');
    for (const url of [sulafat, jane, retired]) await request(worker, url);
    await request(worker, '/voice/index.json');
    expect([...(await voiceCache(worker)).keys()].sort()).toEqual(
      [sulafat, jane, `${ORIGIN}/voice/index.json`].sort()
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

/** Constante de sw.js (liste de préchargement, noms des caches), copiée hors du contexte */
const constant = (worker, name) => vm.runInContext(name, worker.context);
/** Une liste absente (ancien sw.js) se lit vide : le test échoue alors sur le comportement */
const precacheList = (worker, name) => [
  ...constant(worker, `typeof ${name} === 'undefined' ? [] : ${name}`),
];

const TYPES = new Map([
  ['.js', 'text/javascript'],
  ['.css', 'text/css'],
  ['.json', 'application/json'],
  ['.html', 'text/html'],
  ['.wav', 'audio/wav'],
  ['.woff2', 'font/woff2'],
  ['.png', 'image/png'],
  ['.webp', 'image/webp'],
  ['.ico', 'image/x-icon'],
]);

/** Un fichier du site simulé : son contenu dit son chemin */
function siteFile(url) {
  const { pathname } = new URL(url);
  const type = TYPES.get(pathname.slice(pathname.lastIndexOf('.'))) ?? 'text/plain';
  return new FakeResponse(`contenu de ${pathname}`, { headers: { 'Content-Type': type } });
}

/** Variante WebP d'un original : /assets/images/arcade/x.png → …/arcade/x-128.webp */
const variant = (original, size) =>
  original
    .replace('/assets/images/', '/assets/generated-images/')
    .replace(/\.png$/, `-${size}.webp`);

const ORIGINAL = /^\/assets\/images\/(.+)\.png$/;

/** Carte des images du déploiement : deux variantes par original */
function imageMap(originals) {
  const entries = originals.map(url => {
    const base = ORIGINAL.exec(url)[1];
    const resolutions = { 64: `${base}-64.webp`, 128: `${base}-128.webp` };
    return [base, { original: `${base}.png`, resolutions }];
  });
  return JSON.stringify(Object.fromEntries(entries));
}

/**
 * Site simulé : chaque fichier existe ; les images générées et leur carte sont celles du
 * déploiement, ou (map: false) absentes : un serveur de développement répond alors la page.
 * missing : chemins qui répondent 404.
 */
function siteNetwork({ map = true, missing = [] } = {}) {
  const state = { online: true, originals: [], respond: null };
  const absent = new Set(missing);
  const network = url => {
    // Réseau réglé par le test après l'installation (muet, lent…)
    if (state.respond) return state.respond(url);
    if (!state.online) throw new TypeError('Failed to fetch');
    const { pathname } = new URL(url);
    if (absent.has(pathname)) return new FakeResponse('', { status: 404 });
    if (!pathname.startsWith('/assets/generated-images/')) return siteFile(url);
    if (!map) return siteFile(`${ORIGIN}/index.html`);
    if (!pathname.endsWith('/image-map.json')) return siteFile(url);
    return new FakeResponse(imageMap(state.originals), {
      headers: { 'Content-Type': 'application/json' },
    });
  };
  return { network, state };
}

/** Service worker installé sur le site simulé, puis coupé du réseau */
async function installedOffline(options) {
  const site = siteNetwork(options);
  const worker = loadWorker(site.network);
  site.state.originals = precacheList(worker, 'PRECACHE_IMAGES').filter(url => ORIGINAL.test(url));
  const waits = [];
  worker.listeners.install({ waitUntil: promise => waits.push(promise) });
  await Promise.all(waits);
  site.state.online = false;
  return { worker, site, originals: site.state.originals };
}

const offlineEntries = async worker =>
  (await worker.caches.open(constant(worker, 'OFFLINE_CACHE'))).entries;

describe('Service worker : préchargement', () => {
  test('tout le code, puis les variantes WebP de chaque image, jamais depuis le cache HTTP', async () => {
    const { worker, originals } = await installedOffline();
    const entries = await offlineEntries(worker);
    const core = precacheList(worker, 'PRECACHE_CORE');
    expect(core.length).toBeGreaterThan(100);
    expect(core.filter(url => !entries.has(`${ORIGIN}${url}`))).toEqual([]);
    expect(originals.length).toBeGreaterThan(10);
    expect(originals.filter(url => entries.has(`${ORIGIN}${url}`))).toEqual([]);
    const variants = originals.flatMap(url => [variant(url, 64), variant(url, 128)]);
    expect(variants.filter(url => !entries.has(`${ORIGIN}${url}`))).toEqual([]);
    expect(worker.requests.filter(r => r.cache !== 'reload')).toEqual([]);
  });

  test('sans carte des images (développement) : les originaux, jamais une page à leur place', async () => {
    const worker = (await installedOffline({ map: false })).worker;
    const entries = await offlineEntries(worker);
    const images = precacheList(worker, 'PRECACHE_IMAGES');
    const originals = images.filter(url => ORIGINAL.test(url));
    expect(originals.filter(url => !entries.has(`${ORIGIN}${url}`))).toEqual([]);
    // Une image générée nommée par la page, absente : le serveur répond la page, rien n'est gardé
    const generated = images.filter(url => url.startsWith('/assets/generated-images/'));
    expect(generated.length).toBeGreaterThan(0);
    expect(generated.filter(url => entries.has(`${ORIGIN}${url}`))).toEqual([]);
  });

  test('image servie sans type d’image (S3 qui ne connaît pas .webp) : gardée quand même', async () => {
    const site = siteNetwork();
    const worker = loadWorker((url, req) => {
      const response = site.network(url, req);
      if (!url.endsWith('.webp')) return response;
      return new FakeResponse(response.body, {
        headers: { 'Content-Type': 'binary/octet-stream' },
      });
    });
    site.state.originals = precacheList(worker, 'PRECACHE_IMAGES').filter(url =>
      ORIGINAL.test(url)
    );
    const waits = [];
    worker.listeners.install({ waitUntil: promise => waits.push(promise) });
    await Promise.all(waits);
    const entries = await offlineEntries(worker);
    const [original] = site.state.originals;
    expect(entries.has(`${ORIGIN}${variant(original, 128)}`)).toBe(true);
  });

  test('un fichier du code introuvable : l’installation échoue (la précédente reste en place)', async () => {
    const site = siteNetwork({ missing: ['/js/modes/QuizMode.js'] });
    const worker = loadWorker(site.network);
    const waits = [];
    worker.listeners.install({ waitUntil: promise => waits.push(promise) });
    await expect(Promise.all(waits)).rejects.toThrow();
  });
});

describe('Service worker : hors ligne', () => {
  test('recharger le jeu : la page du jeu, à l’adresse du site comme à index.html', async () => {
    const { worker } = await installedOffline();
    for (const url of ['/', '/index.html', '/?lang=en', '/index.html?v=v37']) {
      const response = await request(worker, url, { mode: 'navigate', destination: 'document' });
      expect(await response.text()).toBe('contenu de /index.html');
    }
  });

  test('une page jamais gardée : offline.html', async () => {
    const { worker } = await installedOffline();
    const response = await request(worker, '/parents.html', { mode: 'navigate' });
    expect(await response.text()).toBe('contenu de /offline.html');
  });

  test('en ligne, la page vient du réseau', async () => {
    const { worker, site } = await installedOffline();
    site.state.online = true;
    const response = await request(worker, '/', { mode: 'navigate' });
    expect(await response.text()).toBe('contenu de /');
  });

  test('un mode jamais ouvert : ses modules préchargés, avec ou sans ?v= de cette version', async () => {
    const { worker } = await installedOffline();
    const version = constant(worker, 'VERSION');
    for (const url of [`/js/modes/QuizMode.js?v=${version}`, '/js/core/GameMode.js']) {
      const response = await request(worker, url, { destination: 'script' });
      expect(await response.text()).toBe(`contenu de ${url.split('?')[0]}`);
    }
    const style = await request(worker, `/css/arcade.css?v=${version}`, { destination: 'style' });
    expect(await style.text()).toBe('contenu de /css/arcade.css');
  });

  test('un module d’une autre version (?v=v1) n’est pas remplacé par celui-ci', async () => {
    const { worker } = await installedOffline();
    const response = await request(worker, '/js/modes/QuizMode.js?v=v1', { destination: 'script' });
    expect(response.type).toBe('error');
  });

  test('traductions jamais demandées en ligne : la copie préchargée', async () => {
    const { worker } = await installedOffline();
    const version = constant(worker, 'VERSION');
    const response = await request(worker, `/assets/translations/es.json?v=v=${version}`);
    expect(await response.text()).toBe('contenu de /assets/translations/es.json');
  });

  test('police : la copie préchargée', async () => {
    const { worker } = await installedOffline();
    const font = precacheList(worker, 'PRECACHE_CORE').find(url => url.endsWith('.woff2'));
    const response = await request(worker, font, { destination: 'font' });
    expect(await response.text()).toBe(`contenu de ${font}`);
  });
});

describe('Service worker : sons hors ligne', () => {
  const sound = worker => precacheList(worker, 'PRECACHE_CORE').find(url => url.endsWith('.wav'));
  const play = (worker, url, range) =>
    request(worker, url, { destination: 'audio', headers: range ? { Range: range } : {} });

  test('servi entier, ou par plages d’octets comme le demande un lecteur audio (206)', async () => {
    const { worker } = await installedOffline();
    const url = sound(worker);
    const body = `contenu de ${url}`;
    const size = new TextEncoder().encode(body).length;
    expect((await play(worker, url)).status).toBe(200);
    const all = await play(worker, url, 'bytes=0-');
    expect(all.status).toBe(206);
    expect(all.headers.get('content-range')).toBe(`bytes 0-${size - 1}/${size}`);
    expect(await all.text()).toBe(body);
    const part = await play(worker, url, 'bytes=2-5');
    expect(await part.text()).toBe(body.slice(2, 6));
    expect(part.headers.get('content-length')).toBe('4');
    expect(await (await play(worker, url, 'bytes=-3')).text()).toBe(body.slice(-3));
  });

  test('plage hors du fichier : 416 ; plage illisible : le fichier entier', async () => {
    const { worker } = await installedOffline();
    const url = sound(worker);
    expect((await play(worker, url, 'bytes=99999-')).status).toBe(416);
    const several = await play(worker, url, 'bytes=0-1, 4-5');
    expect(several.status).toBe(200);
    expect(await several.text()).toBe(`contenu de ${url}`);
  });
});

describe('Service worker : images hors ligne', () => {
  test('un original jamais gardé : la plus grande variante gardée du même sprite', async () => {
    const { worker, originals } = await installedOffline();
    const [original] = originals;
    const response = await request(worker, `${original}?v=v37`, { destination: 'image' });
    expect(await response.text()).toBe(`contenu de ${variant(original, 128)}`);
  });

  test('une taille jamais gardée : une autre taille du même sprite', async () => {
    const { worker, originals } = await installedOffline();
    const [original] = originals;
    const response = await request(worker, variant(original, 256), { destination: 'image' });
    expect(await response.text()).toBe(`contenu de ${variant(original, 128)}`);
  });

  test('un fond tiré au hasard, jamais gardé : un fond gardé du même avatar', async () => {
    const { worker } = await installedOffline();
    const kept = precacheList(worker, 'PRECACHE_CORE').find(url => url.includes('background_fox_'));
    const response = await request(worker, '/img/background_fox_013.png', { destination: 'image' });
    expect(await response.text()).toBe(`contenu de ${kept}`);
  });

  test('une image sans copie ni famille gardée : échec, jamais une autre image', async () => {
    const { worker } = await installedOffline();
    for (const url of ['/img/background_zebre_002.webp', '/assets/social/inconnue.webp']) {
      expect((await request(worker, url, { destination: 'image' })).type).toBe('error');
    }
  });
});

describe('Service worker : image abandonnée par la page', () => {
  test('rechargée pendant son chargement : réponse vide, jamais une erreur', async () => {
    // Firefox signale dans la console chaque réponse en erreur du service worker, même pour
    // une image que la page qui se recharge n'attend plus
    const signal = { aborted: false };
    const worker = loadWorker(async () => {
      signal.aborted = true;
      throw new DOMException('The operation was aborted.', 'AbortError');
    });
    const url = '/assets/generated-images/arcade/logo_multimiam-256.webp';
    const response = await request(worker, url, { destination: 'image', signal });
    expect({ type: response.type, status: response.status }).toEqual({
      type: 'basic',
      status: 204,
    });
  });
});

describe('Service worker : version', () => {
  test('répond sa version à une page du site qui la demande (rechargement après mise à jour)', () => {
    const worker = loadWorker(() => new FakeResponse(''));
    const replies = [];
    const port = { postMessage: message => replies.push({ ...message }) };
    worker.listeners.message?.({ origin: ORIGIN, data: { type: 'version' }, ports: [port] });
    worker.listeners.message?.({ origin: ORIGIN, data: { type: 'autre' }, ports: [port] });
    // Un message venu d'une autre origine ne reçoit rien
    const elsewhere = 'https://ailleurs.example';
    worker.listeners.message?.({ origin: elsewhere, data: { type: 'version' }, ports: [port] });
    expect(replies).toEqual([{ version: constant(worker, 'VERSION') }]);
  });
});

describe('Service worker : réseau', () => {
  test('jamais demandé pour une autre origine que celle du site', async () => {
    const worker = loadWorker(() => new FakeResponse('réseau'));
    const response = await request(worker, 'https://ailleurs.example/page', { mode: 'navigate' });
    expect(response.type).toBe('error');
    expect(worker.fetches).toEqual([]);
  });
});

/** Requête lancée sans attendre ses prolongations (un réseau muet ne les finit jamais) */
function startRequest(worker, url, { destination = '', mode = 'cors' } = {}) {
  let response;
  worker.listeners.fetch({
    request: {
      url: new URL(url, ORIGIN).href,
      method: 'GET',
      mode,
      destination,
      headers: new FakeHeaders({}),
      signal: { aborted: false },
    },
    respondWith: promise => (response = promise),
    waitUntil: () => {},
  });
  const state = { done: false };
  response.then(() => (state.done = true));
  return { response, state };
}

/** Réponse du réseau que le test fait arriver quand il veut */
function later(body) {
  let answer;
  const promise = new Promise(resolve => (answer = () => resolve(siteFile(`${ORIGIN}${body}`))));
  return { promise, answer };
}

const silent = () => new Promise(() => {});

describe('Service worker : réseau qui ne répond pas (wifi d’école, portail captif)', () => {
  afterEach(() => jest.useRealTimers());

  /** Installé, puis le réseau réglé par respond ; minuteries simulées */
  async function installedWith(respond) {
    const installed = await installedOffline();
    installed.site.state.respond = respond;
    installed.timeout = constant(installed.worker, 'NETWORK_TIMEOUT_MS');
    jest.useFakeTimers();
    return installed;
  }

  test('la page du jeu passé le délai, pas avant ; la requête réseau reste en cours', async () => {
    const { worker, timeout } = await installedWith(silent);
    const { response, state } = startRequest(worker, '/', { mode: 'navigate' });
    await jest.advanceTimersByTimeAsync(timeout - 100);
    expect(state.done).toBe(false);
    await jest.advanceTimersByTimeAsync(200);
    expect(await (await response).text()).toBe('contenu de /index.html');
    expect(worker.fetches.at(-1)).toBe(`${ORIGIN}/`);
  });

  test('un module de cette version : sa copie préchargée, sans attendre le réseau muet', async () => {
    const { worker } = await installedWith(silent);
    const version = constant(worker, 'VERSION');
    const url = `/js/modes/QuizMode.js?v=${version}`;
    const { response, state } = startRequest(worker, url, { destination: 'script' });
    await jest.advanceTimersByTimeAsync(10);
    expect(state.done).toBe(true);
    expect(await (await response).text()).toBe('contenu de /js/modes/QuizMode.js');
  });

  test('un module d’une autre version : pas de copie, on attend le réseau', async () => {
    const reply = later('/js/modes/QuizMode.js');
    const { worker, timeout } = await installedWith(() => reply.promise);
    const { response, state } = startRequest(worker, '/js/modes/QuizMode.js?v=v1', {
      destination: 'script',
    });
    await jest.advanceTimersByTimeAsync(timeout * 3);
    expect(state.done).toBe(false);
    reply.answer();
    expect(await (await response).text()).toBe('contenu de /js/modes/QuizMode.js');
  });

  test('un réseau lent qui répond avant le délai l’emporte, et rafraîchit le cache', async () => {
    const reply = later('/js/core/GameMode.js');
    const { worker, timeout } = await installedWith(() => reply.promise);
    const url = '/js/core/GameMode.js?v=frais';
    const { response } = startRequest(worker, url, { destination: 'script' });
    await jest.advanceTimersByTimeAsync(timeout - 500);
    reply.answer();
    expect((await response).body).toBe('contenu de /js/core/GameMode.js');
    await jest.advanceTimersByTimeAsync(0);
    const runtime = await worker.caches.open(constant(worker, 'RUNTIME_CACHE'));
    expect(runtime.entries.has(`${ORIGIN}${url}`)).toBe(true);
  });

  test('déploiement puis réseau moyen : un module de cette version ne vient jamais d’une autre', async () => {
    // Service worker v37 : la page gardée passé le délai, puis le réseau se met à répondre
    // avec le contenu déployé depuis (le serveur ignore ?v= et sert la v38 sous l'adresse v37)
    let answering = false;
    const v38 = url =>
      new FakeResponse(`v38 ${new URL(url).pathname}`, {
        headers: { 'Content-Type': 'text/javascript' },
      });
    // Un réseau moyen : chaque réponse met 50 ms
    const respond = url =>
      answering ? new Promise(resolve => setTimeout(() => resolve(v38(url)), 50)) : silent();
    const { worker, timeout } = await installedWith(respond);
    const version = constant(worker, 'VERSION');
    const page = startRequest(worker, '/', { mode: 'navigate' });
    await jest.advanceTimersByTimeAsync(timeout + 100);
    expect(await (await page.response).text()).toBe('contenu de /index.html');
    answering = true;
    const served = [];
    for (const path of ['/js/game.js', '/js/slides.js', '/css/arcade.css']) {
      const destination = path.endsWith('.css') ? 'style' : 'script';
      const { response } = startRequest(worker, `${path}?v=${version}`, { destination });
      await jest.advanceTimersByTimeAsync(100);
      served.push(await (await response).text());
    }
    expect(served).toEqual([
      'contenu de /js/game.js',
      'contenu de /js/slides.js',
      'contenu de /css/arcade.css',
    ]);
    // Rien du réseau n'est gardé sous une adresse de cette version
    const runtime = await worker.caches.open(constant(worker, 'RUNTIME_CACHE'));
    expect([...runtime.entries.keys()].filter(key => key.includes(`?v=${version}`))).toEqual([]);
  });

  test('après un délai dépassé, la suite sans attendre ; une réponse du réseau rend la main', async () => {
    // Adresses sans ?v= (développement) : réseau d'abord, avec délai. Celles de cette version
    // (site déployé) ne passent pas par là : elles viennent toujours de leur copie.
    const reply = later('/js/game.js');
    let answering = false;
    const { worker, timeout } = await installedWith(() => (answering ? reply.promise : silent()));
    const first = startRequest(worker, '/js/game.js', { destination: 'script' });
    await jest.advanceTimersByTimeAsync(timeout + 100);
    expect(first.state.done).toBe(true);
    // Le réseau est tenu pour muet : le module suivant n'attend pas le délai
    const next = startRequest(worker, '/js/slides.js', { destination: 'script' });
    await jest.advanceTimersByTimeAsync(10);
    expect(await (await next.response).text()).toBe('contenu de /js/slides.js');
    // Le réseau répond de nouveau : il redevient prioritaire
    answering = true;
    const third = startRequest(worker, '/js/game.js', { destination: 'script' });
    reply.answer();
    await jest.advanceTimersByTimeAsync(10);
    expect(third.state.done).toBe(true);
    // Muet de nouveau : le module suivant attend le réseau, jusqu'au délai
    answering = false;
    const fourth = startRequest(worker, '/js/slides.js', { destination: 'script' });
    await jest.advanceTimersByTimeAsync(10);
    expect(fourth.state.done).toBe(false);
  });
});
