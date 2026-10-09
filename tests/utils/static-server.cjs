const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs/promises');
const { inSequence } = require('../../scripts/lib/in-sequence.cjs');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',
};

function contentType(filePath) {
  return MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

/**
 * Voix enregistrée : /voice/ se sert depuis un dossier de test (options.voiceDir), avec un
 * vrai 404 pour un clip absent, jamais le repli sur index.html
 */
async function serveVoice(req, res, pathname, voiceDir) {
  const filePath = voiceDir && path.join(voiceDir, pathname.slice('/voice/'.length));
  let data;
  try {
    // Le séparateur final écarte un dossier voisin qui commencerait par le même nom
    if (!filePath?.startsWith(voiceDir + path.sep)) throw new Error('hors du dossier');
    data = await fs.readFile(filePath);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': contentType(filePath) });
  res.end(req.method === 'HEAD' ? undefined : data);
}

/** Fichier demandé du site : index.html pour la racine ou un dossier */
function sitePath(pathname) {
  if (!pathname || pathname === '/') return '/index.html';
  return pathname.endsWith('/') ? `${pathname}index.html` : pathname;
}

/** Page du site ; un fichier absent retombe sur index.html (navigation par diapositives) */
async function serveSite(req, res, pathname, rootDir) {
  let filePath = path.join(rootDir, sitePath(pathname));
  if (!filePath.startsWith(rootDir + path.sep)) {
    res.writeHead(403).end();
    return;
  }
  let data;
  try {
    data = await fs.readFile(filePath);
  } catch {
    filePath = path.join(rootDir, 'index.html');
    data = await fs.readFile(filePath);
  }
  res.writeHead(200, { 'Content-Type': contentType(filePath) });
  res.end(req.method === 'HEAD' ? undefined : data);
}

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

/** Taille des morceaux d'une réponse envoyée au débit d'un réseau lent */
const SLOW_CHUNK = 16 * 1024;

/**
 * Réseau lent qui répond, simulé côté serveur pour la page comme pour le service worker,
 * dans tout navigateur : chaque réponse attend la latence, puis passe au débit d'un lien
 * partagé par toutes les connexions, comme un réseau mobile bridé.
 * @param {{latencyMs: number, bytesPerSecond: number}} profile
 */
function createSlowLink({ latencyMs, bytesPerSecond }) {
  let freeAt = 0;
  // Le lien est partagé : chaque morceau attend que les précédents soient passés
  const take = bytes => {
    const now = Date.now();
    freeAt = Math.max(now, freeAt) + (bytes / bytesPerSecond) * 1000;
    return pause(freeAt - now);
  };
  return {
    /** res.end ralenti : latence, puis le corps au débit du lien */
    slowDown(res) {
      const write = res.write.bind(res);
      const end = res.end.bind(res);
      res.end = data => {
        const body = data ? Buffer.from(data) : Buffer.alloc(0);
        const chunks = [];
        for (let offset = 0; offset < body.length; offset += SLOW_CHUNK) {
          chunks.push(body.subarray(offset, offset + SLOW_CHUNK));
        }
        void (async () => {
          await pause(latencyMs);
          // Un morceau réserve le lien quand le précédent est passé, jamais tous d'avance
          await inSequence(chunks, async chunk => {
            await take(chunk.length);
            write(chunk);
          });
          end();
        })();
        return res;
      };
    },
  };
}

/**
 * Coupure du réseau pour les tests hors ligne : coupé, le serveur ferme chaque connexion
 * sans répondre, même celles que le navigateur garde ouvertes, comme un wifi d'école privé
 * d'Internet. Ni la page ni le service worker n'obtiennent plus rien.
 * Muet (setSilent), il accepte les connexions et lit les requêtes sans jamais répondre,
 * comme un portail captif ou un filtre qui retient : le navigateur attend.
 * @param {import('node:http').Server} server
 */
function createNetworkSwitch(server) {
  const sockets = new Set();
  const state = { reachable: true, silent: false, slowLink: null };
  server.on('connection', socket => {
    if (!state.reachable) socket.destroy();
    sockets.add(socket);
    socket.on('close', () => sockets.delete(socket));
  });
  const closeAll = () => {
    for (const socket of sockets) socket.destroy();
  };
  return {
    state,
    closeAll,
    setReachable(reachable) {
      state.reachable = reachable;
      if (!reachable) closeAll();
    },
    setSilent(silent) {
      state.silent = silent;
    },
    /** Réseau lent qui répond (createSlowLink) ; null pour le débit normal */
    setSlow(profile) {
      state.slowLink = profile ? createSlowLink(profile) : null;
    },
  };
}

/**
 * @param {string} [networkIdleSetting]
 * @param {{voiceDir?: string}} [options] - voiceDir : dossier servi sous /voice/
 * @returns {Promise<{url: string, gotoOptions: object, stop: () => Promise<void>,
 *   setReachable?: (reachable: boolean) => void, setSilent?: (silent: boolean) => void,
 *   setSlow?: (profile: {latencyMs: number, bytesPerSecond: number}|null) => void}>}
 *   setReachable, setSilent, setSlow : absents pour un site extérieur (E2E_BASE_URL)
 */
async function startStaticServer(networkIdleSetting = 'networkidle2', options = {}) {
  if (process.env.E2E_BASE_URL) {
    const url = process.env.E2E_BASE_URL;
    const waitUntil = url.startsWith('http') ? networkIdleSetting : 'load';
    return {
      url,
      gotoOptions: { waitUntil, timeout: 20000 },
      stop: async () => {},
    };
  }

  const rootDir = path.resolve(__dirname, '../..');
  let network = null;
  const server = http.createServer(async (req, res) => {
    if (!network.state.reachable) {
      req.socket.destroy();
      return;
    }
    // Muet : la requête reste sans réponse, la connexion ouverte
    if (network.state.silent) return;
    network.state.slowLink?.slowDown(res);
    if (!['GET', 'HEAD'].includes(req.method || '')) {
      res.writeHead(405).end();
      return;
    }

    try {
      const requestUrl = new URL(req.url, 'http://localhost');
      const pathname = decodeURIComponent(requestUrl.pathname || '/');
      if (pathname.startsWith('/voice/')) await serveVoice(req, res, pathname, options.voiceDir);
      else await serveSite(req, res, pathname, rootDir);
    } catch (error) {
      res.writeHead(500).end(String(error));
    }
  });

  network = createNetworkSwitch(server);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  return {
    url: 'http://127.0.0.1:' + port + '/index.html',
    gotoOptions: { waitUntil: networkIdleSetting, timeout: 20000 },
    stop: () =>
      new Promise(resolve => {
        // Les connexions laissées sans réponse (muet) empêcheraient la fermeture
        if (network.state.silent) network.closeAll();
        server.close(resolve);
      }),
    setReachable: network.setReachable,
    setSilent: network.setSilent,
    setSlow: network.setSlow,
  };
}

module.exports = { startStaticServer };
