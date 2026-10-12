/*
 Le site tel que deploy.sh le publie, servi en local : par le serveur de développement
 (scripts/serve.cjs, npm run serve) et par celui des tests (tests/utils/static-server.cjs).

 Rien d'autre du dépôt ne sort (fichiers cachés, deploy.config, package.json, .git…), un
 lien qui mène hors du site non plus, et seule une adresse de la boucle locale est
 acceptée dans l'en-tête Host : une page web qui ferait pointer son propre nom vers
 127.0.0.1 (rebinding DNS) ne lit rien.
*/
const path = require('node:path');
const fs = require('node:fs/promises');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
};

function contentType(filePath) {
  return MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

/**
 * Ce que deploy.sh publie (sa liste rsync, comparée par tests/__tests__/static-server.test.js) :
 * le reste du dépôt (fichiers cachés, package.json, clips privés…) n'existe pas en ligne
 */
const PUBLISHED = {
  files: new Set([
    'index.html',
    'parents.html',
    'modes.html',
    'pwa.html',
    'offline.html',
    'sw.js',
    'manifest.json',
    'favicon.svg',
    'favicon.ico',
    'favicon.png',
    'robots.txt',
    'sitemap.xml',
  ]),
  dirs: ['assets/', 'css/', 'js/', 'img/'],
  privateDirs: ['assets/voice/'],
};

/** Fichier de la version construite (npm run build, dist/) : tout, sauf un fichier caché */
function isBuiltFile(relativePath) {
  return !relativePath.split('/').some(part => part.startsWith('.'));
}

/** Chemin relatif que deploy.sh publie, sans fichier caché */
function isPublished(relativePath) {
  if (relativePath.split('/').some(part => part.startsWith('.'))) return false;
  if (PUBLISHED.privateDirs.some(dir => relativePath.startsWith(dir))) return false;
  return (
    PUBLISHED.files.has(relativePath) || PUBLISHED.dirs.some(dir => relativePath.startsWith(dir))
  );
}

/** Contenu d'un fichier resté dans son dossier une fois les liens résolus, null sinon */
async function readInside(dir, filePath) {
  try {
    const [realDir, realFile] = await Promise.all([fs.realpath(dir), fs.realpath(filePath)]);
    // Le séparateur final écarte un dossier voisin qui commencerait par le même nom
    return realFile.startsWith(realDir + path.sep) ? await fs.readFile(realFile) : null;
  } catch {
    // Absent ou illisible : même réponse qu'un fichier absent
    return null;
  }
}

/**
 * Fichier de /voice/ et dossier qui doit le contenir : l'index, ou un clip
 * <langue>/<version>/<clé>.mp3 dans le dossier de sa version, qui peut être un lien vers le
 * dépôt des voix (npm run voice:publish -- local). Tout autre chemin : null.
 */
function voiceTarget(voiceDir, pathname) {
  const parts = pathname.slice('/voice/'.length).split('/');
  if (parts.some(part => part === '' || part.startsWith('.'))) return null;
  if (parts.length === 1 && parts[0] === 'index.json') {
    return { dir: voiceDir, file: path.join(voiceDir, 'index.json') };
  }
  if (parts.length !== 3) return null;
  const versionDir = path.join(voiceDir, parts[0], parts[1]);
  return { dir: versionDir, file: path.join(versionDir, parts[2]) };
}

/**
 * Voix enregistrée : /voice/ se sert depuis options.voiceDir (dossier de test, ou voice/ du
 * dépôt pour ?voix=local), avec un vrai 404 pour un clip absent, jamais le repli sur
 * index.html
 */
async function serveVoice(req, res, pathname, voiceDir) {
  const target = voiceDir ? voiceTarget(voiceDir, pathname) : null;
  const data = target && (await readInside(target.dir, target.file));
  if (!data) {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': contentType(pathname) });
  res.end(req.method === 'HEAD' ? undefined : data);
}

/** Fichier demandé du site : index.html pour la racine ou un dossier */
function sitePath(pathname) {
  if (!pathname || pathname === '/') return '/index.html';
  return pathname.endsWith('/') ? `${pathname}index.html` : pathname;
}

/**
 * Page du site ; un fichier absent, ou hors du site servi (isServed), retombe sur index.html
 * (navigation par diapositives)
 */
async function serveSite(req, res, pathname, rootDir, isServed) {
  const relativePath = sitePath(pathname).slice(1);
  let filePath = path.join(rootDir, relativePath);
  let data = isServed(relativePath) ? await readInside(rootDir, filePath) : null;
  if (!data) {
    filePath = path.join(rootDir, 'index.html');
    data = await fs.readFile(filePath);
  }
  res.writeHead(200, { 'Content-Type': contentType(filePath) });
  res.end(req.method === 'HEAD' ? undefined : data);
}

const LOOPBACK_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]']);

/** En-tête Host qui nomme la boucle locale (localhost, 127.0.0.1 ou [::1], port libre) */
function isLoopbackHost(hostHeader = '') {
  const hostname = hostHeader.startsWith('[')
    ? hostHeader.slice(0, hostHeader.indexOf(']') + 1)
    : hostHeader.split(':')[0];
  return LOOPBACK_HOSTNAMES.has(hostname.toLowerCase());
}

/**
 * Réponse à une requête : GET ou HEAD seulement, Host de la boucle locale ; /voice/ depuis
 * voiceDir, le reste depuis rootDir : ce que deploy.sh publie, ou ce que dit isServed
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 * @param {{rootDir: string, voiceDir?: string | null, isServed?: (relativePath: string) => boolean}} options
 */
async function serveRequest(req, res, { rootDir, voiceDir, isServed = isPublished }) {
  if (!['GET', 'HEAD'].includes(req.method || '')) {
    res.writeHead(405).end();
    return;
  }
  if (!isLoopbackHost(req.headers.host)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' }).end('Host refusé');
    return;
  }
  try {
    const requestUrl = new URL(req.url, 'http://localhost');
    // Normalisé AVANT le choix du dossier : /%2fvoice/… et /js/..%2fvoice/… sont /voice/…
    const pathname = path.posix.normalize(decodeURIComponent(requestUrl.pathname || '/'));
    if (pathname.startsWith('/voice/')) await serveVoice(req, res, pathname, voiceDir);
    else await serveSite(req, res, pathname, rootDir, isServed);
  } catch (error) {
    res.writeHead(500).end(String(error));
  }
}

module.exports = { PUBLISHED, isBuiltFile, isLoopbackHost, serveRequest };
