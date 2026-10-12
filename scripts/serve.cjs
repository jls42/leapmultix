#!/usr/bin/env node
/*
 Serveur de développement (npm run serve) : le site tel que deploy.sh le publie
 (scripts/lib/site-server.cjs), sur la boucle locale seulement, jamais sur le réseau de la
 maison ou de l'école. Port 8080, ou le suivant libre jusqu'à 8099 ; PORT en impose un
 (0 : un port libre au hasard). /voice/ lit le dossier voice/ que prépare
 « npm run voice:publish -- local » (?voix=local, docs/voix-enregistree.md).
*/
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { serveRequest } = require('./lib/site-server.cjs');

const HOST = '127.0.0.1';
const DEFAULT_PORTS = { first: 8080, last: 8099 };
const ROOT_DIR = path.resolve(__dirname, '..');

/** Ports à essayer : PORT seul s'il est donné, sinon 8080 à 8099 */
function portRange(env) {
  if (env.PORT === undefined || env.PORT === '') return DEFAULT_PORTS;
  const port = Number(env.PORT);
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error(`PORT invalide : ${env.PORT}`);
  }
  return { first: port, last: port };
}

/** Écoute sur la boucle locale au premier port libre de la plage ; rend le port obtenu */
function listenFrom(server, port, last) {
  return new Promise((resolve, reject) => {
    const onListening = () => {
      server.off('error', onError);
      resolve(server.address().port);
    };
    const onError = error => {
      server.off('listening', onListening);
      if (error.code === 'EADDRINUSE' && port < last) resolve(listenFrom(server, port + 1, last));
      else reject(error);
    };
    server.once('error', onError);
    server.once('listening', onListening);
    server.listen(port, HOST);
  });
}

/**
 * @param {{ports?: {first: number, last: number}, rootDir?: string, voiceDir?: string}} [options]
 * @returns {Promise<{server: import('node:http').Server, port: number}>}
 */
async function startDevServer({
  ports = DEFAULT_PORTS,
  rootDir = ROOT_DIR,
  voiceDir = path.join(rootDir, 'voice'),
} = {}) {
  const server = http.createServer((req, res) => serveRequest(req, res, { rootDir, voiceDir }));
  const port = await listenFrom(server, ports.first, ports.last);
  return { server, port };
}

async function main() {
  const { port } = await startDevServer({ ports: portRange(process.env) });
  console.log(`LeapMultix : http://localhost:${port}/ (cet ordinateur seulement)`);
  if (fs.existsSync(path.join(ROOT_DIR, 'voice'))) {
    console.log(`Voix du dossier voice/ : http://localhost:${port}/index.html?voix=local`);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error(`Serveur non démarré : ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = { portRange, startDevServer };
