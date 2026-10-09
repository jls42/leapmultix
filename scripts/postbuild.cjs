/* Post-build packager for LeapMultix
 * - Copies CSS and assets to dist/
 * - Rewrites index.html script to hashed Rollup entry
 */
const fs = require('node:fs');
const fsp = fs.promises;
const path = require('node:path');
const { inSequence } = require('./lib/in-sequence.cjs');

async function ensureDir(p) {
  await fsp.mkdir(p, { recursive: true });
}

async function copyDir(src, dest) {
  await ensureDir(dest);
  const entries = await fsp.readdir(src, { withFileTypes: true });
  await inSequence(entries, async e => {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) await copyDir(s, d);
    else await fsp.copyFile(s, d);
  });
}

async function run() {
  const root = process.cwd(); // leapmultix
  const dist = path.join(root, 'dist');
  await ensureDir(dist);

  // 1) locate built entry file
  const files = await fsp.readdir(dist);
  const criticalEntry = files.find(f => /^bootstrap-critical-.*\.js$/.test(f));
  if (!criticalEntry) {
    console.error('[postbuild] Could not find bootstrap-critical-*.js in dist');
    process.exitCode = 1;
    return;
  }

  // 2) rewrite index.html script to hashed entry
  const indexSrcPath = path.join(root, 'index.html');
  const indexOutPath = path.join(dist, 'index.html');
  let html = await fsp.readFile(indexSrcPath, 'utf8');
  html = html.replace(
    /<script\s+type="module"\s+src="js\/bootstrap-critical\.js"><\/script>/,
    `<script type="module" src="${criticalEntry}"></script>`
  );
  await fsp.writeFile(indexOutPath, html, 'utf8');

  // 3) copy CSS and assets, favicon, sw
  const cssSrc = path.join(root, 'css');
  const assetsSrc = path.join(root, 'assets');
  const cssDest = path.join(dist, 'css');
  const assetsDest = path.join(dist, 'assets');
  // Copies au mieux : une erreur (dossier ou fichier absent, comme favicon.svg) laisse de côté
  // le reste de cet élément sans arrêter le build
  try {
    await copyDir(cssSrc, cssDest);
  } catch {
    // Copie au mieux (ci-dessus)
  }
  try {
    await copyDir(assetsSrc, assetsDest);
  } catch {
    // Copie au mieux (ci-dessus)
  }
  await inSequence(['favicon.ico', 'favicon.png', 'favicon.svg', 'sw.js'], async file => {
    try {
      await fsp.copyFile(path.join(root, file), path.join(dist, file));
    } catch {
      // Copie au mieux (ci-dessus)
    }
  });

  console.log(`[postbuild] Packed dist with entry ${criticalEntry}`);
}

run().catch(e => {
  console.error('[postbuild] failed', e);
  process.exit(1);
});
