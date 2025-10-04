/* Post-build packager for LeapMultix
 * - Copies CSS and assets to dist/
 * - Rewrites index.html script to hashed Rollup entry
 */
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

async function ensureDir(p) {
  await fsp.mkdir(p, { recursive: true });
}

async function copyDir(src, dest) {
  await ensureDir(dest);
  const entries = await fsp.readdir(src, { withFileTypes: true });
  for (const e of entries) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) await copyDir(s, d);
    else await fsp.copyFile(s, d);
  }
}

async function run() {
  const root = process.cwd(); // leapmultix
  const dist = path.join(root, 'dist');
  await ensureDir(dist);

  // 1) locate built entry file
  const files = await fsp.readdir(dist);
  const entry = files.find(f => /^main-es6-.*\.js$/.test(f));
  if (!entry) {
    console.error('[postbuild] Could not find main-es6-*.js in dist');
    process.exitCode = 1;
    return;
  }

  // 2) rewrite index.html script to hashed entry
  const indexSrcPath = path.join(root, 'index.html');
  const indexOutPath = path.join(dist, 'index.html');
  let html = await fsp.readFile(indexSrcPath, 'utf8');
  html = html.replace(
    /<script\s+type="module"\s+src="js\/main-es6\.js"><\/script>/,
    `<script type="module" src="${entry}"></script>`
  );
  await fsp.writeFile(indexOutPath, html, 'utf8');

  // 3) copy CSS and assets, favicon, sw
  const cssSrc = path.join(root, 'css');
  const assetsSrc = path.join(root, 'assets');
  const cssDest = path.join(dist, 'css');
  const assetsDest = path.join(dist, 'assets');
  try {
    await copyDir(cssSrc, cssDest);
  } catch (e) {}
  try {
    await copyDir(assetsSrc, assetsDest);
  } catch (e) {}
  for (const file of ['favicon.ico', 'favicon.png', 'favicon.svg', 'sw.js']) {
    try {
      await fsp.copyFile(path.join(root, file), path.join(dist, file));
    } catch (e) {}
  }

  console.log(`[postbuild] Packed dist with entry ${entry}`);
}

run().catch(e => {
  console.error('[postbuild] failed', e);
  process.exit(1);
});
