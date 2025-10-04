const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs/promises');

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
};

async function startStaticServer(networkIdleSetting = 'networkidle2') {
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
  const server = http.createServer(async (req, res) => {
    if (!['GET', 'HEAD'].includes(req.method || '')) {
      res.writeHead(405).end();
      return;
    }

    try {
      const requestUrl = new URL(req.url, 'http://localhost');
      let pathname = decodeURIComponent(requestUrl.pathname || '/');
      if (!pathname || pathname === '/') {
        pathname = '/index.html';
      }
      if (pathname.endsWith('/')) {
        pathname += 'index.html';
      }

      let filePath = path.join(rootDir, pathname);
      if (!filePath.startsWith(rootDir)) {
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

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });

      if ((req.method || '') === 'HEAD') {
        res.end();
        return;
      }

      res.end(data);
    } catch (error) {
      res.writeHead(500).end(String(error));
    }
  });

  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  return {
    url: 'http://127.0.0.1:' + port + '/index.html',
    gotoOptions: { waitUntil: networkIdleSetting, timeout: 20000 },
    stop: () => new Promise(resolve => server.close(resolve)),
  };
}

module.exports = { startStaticServer };
