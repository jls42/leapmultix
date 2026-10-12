const http = require('node:http');
const path = require('node:path');
const { inSequence } = require('../../scripts/lib/in-sequence.cjs');
const { serveRequest } = require('../../scripts/lib/site-server.cjs');

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
 * @param {{voiceDir?: string, rootDir?: string}} [options] - voiceDir : dossier servi sous
 *   /voice/ ; rootDir : dépôt servi, celui-ci par défaut
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

  const rootDir = path.resolve(options.rootDir ?? path.join(__dirname, '../..'));
  let network = null;
  const server = http.createServer(async (req, res) => {
    if (!network.state.reachable) {
      req.socket.destroy();
      return;
    }
    // Muet : la requête reste sans réponse, la connexion ouverte
    if (network.state.silent) return;
    network.state.slowLink?.slowDown(res);
    await serveRequest(req, res, { rootDir, voiceDir: options.voiceDir });
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
