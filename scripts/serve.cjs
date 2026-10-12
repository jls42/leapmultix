#!/usr/bin/env node
/*
 Serveur de développement (npm run serve) : le site tel que deploy.sh le publie
 (scripts/lib/site-server.cjs), sur la boucle locale seulement, jamais sur le réseau de la
 maison ou de l'école. Port 8080, ou le suivant libre jusqu'à 8099 ; PORT en impose un
 (0 : un port libre au hasard). /voice/ lit le dossier voice/ que prépare
 « npm run voice:publish -- local » (?voix=local, docs/voix-enregistree.md).

 npm run serve:dist (node scripts/serve.cjs dist) : la version construite par npm run build,
 tout dist/ sauf les fichiers cachés, sans voix ; port 5000, ou le suivant libre jusqu'à 5019.
*/
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { isBuiltFile, serveRequest } = require('./lib/site-server.cjs');

const HOST = '127.0.0.1';
const DEFAULT_PORTS = { first: 8080, last: 8099 };
const DIST_PORTS = { first: 5000, last: 5019 };
const ROOT_DIR = path.resolve(__dirname, '..');

/** Ports à essayer : PORT seul s'il est donné, sinon la plage par défaut */
function portRange(env, defaults = DEFAULT_PORTS) {
  if (env.PORT === undefined || env.PORT === '') return defaults;
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
 * @param {{ports?: {first: number, last: number}, rootDir?: string, voiceDir?: string | null,
 *   isServed?: (relativePath: string) => boolean}} [options]
 * @returns {Promise<{server: import('node:http').Server, port: number}>}
 */
async function startDevServer({
  ports = DEFAULT_PORTS,
  rootDir = ROOT_DIR,
  voiceDir = path.join(rootDir, 'voice'),
  isServed,
} = {}) {
  const server = http.createServer((req, res) =>
    serveRequest(req, res, { rootDir, voiceDir, isServed })
  );
  const port = await listenFrom(server, ports.first, ports.last);
  return { server, port };
}

/** Réglages de npm run serve:dist : tout dist/, sans voix, ports 5000 à 5019 */
function distOptions(env, rootDir = ROOT_DIR) {
  const distDir = path.join(rootDir, 'dist');
  if (!fs.existsSync(path.join(distDir, 'index.html'))) {
    throw new Error('dist/index.html absent : lancer npm run build');
  }
  return {
    rootDir: distDir,
    voiceDir: null,
    isServed: isBuiltFile,
    ports: portRange(env, DIST_PORTS),
  };
}

async function main(args) {
  if (args.length > 1 || (args.length === 1 && args[0] !== 'dist')) {
    throw new Error('usage : node scripts/serve.cjs [dist]');
  }
  const dist = args[0] === 'dist';
  const { port } = await startDevServer(
    dist ? distOptions(process.env) : { ports: portRange(process.env) }
  );
  const what = dist ? 'version construite (dist/)' : 'cet ordinateur seulement';
  console.log(`LeapMultix : http://localhost:${port}/ (${what})`);
  if (!dist && fs.existsSync(path.join(ROOT_DIR, 'voice'))) {
    console.log(`Voix du dossier voice/ : http://localhost:${port}/index.html?voix=local`);
  }
}

if (require.main === module) {
  main(process.argv.slice(2)).catch(error => {
    console.error(`Serveur non démarré : ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = { distOptions, portRange, startDevServer };
