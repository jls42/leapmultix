#!/usr/bin/env node
/**
 * Lightweight assets reference analyzer
 * - Scans assets under assets/{images,sounds,videos}
 * - Greps for exact filename occurrences across js/css/html
 * - Outputs suspected orphans with basic caveats for dynamic usages
 */
const fs = require('fs');
const path = require('path');

function listFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(full));
    else out.push(full);
  }
  return out;
}

function listCodeFiles(root, globs = []) {
  const out = [];
  if (!fs.existsSync(root)) return out;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) {
      out.push(...listCodeFiles(full, globs));
    } else {
      const rel = full.replace(/^.*leapmultix\//, '');
      const ext = path.extname(full).toLowerCase();
      if (['.js', '.mjs', '.cjs', '.css', '.html'].includes(ext)) out.push(full);
    }
  }
  return out;
}

function main() {
  const projectRoot = process.cwd();
  const assetsDirs = [
    path.join(projectRoot, 'assets', 'images'),
    path.join(projectRoot, 'assets', 'sounds'),
    path.join(projectRoot, 'assets', 'videos'),
  ];
  const assetFiles = assetsDirs.flatMap(listFiles);
  const codeFiles = [
    ...listCodeFiles(path.join(projectRoot, 'js')),
    ...listCodeFiles(path.join(projectRoot, 'css')),
    path.join(projectRoot, 'index.html'),
  ]
    .filter(Boolean)
    .filter(fs.existsSync);

  const codeContents = new Map();
  for (const f of codeFiles) {
    try {
      codeContents.set(f, fs.readFileSync(f, 'utf8'));
    } catch {
      /* ignore */
    }
  }

  const findings = [];
  let referencedCount = 0;
  for (const af of assetFiles) {
    const name = path.basename(af);
    let referencedIn = [];
    for (const [cf, content] of codeContents) {
      if (content.includes(name)) {
        referencedIn.push(cf);
        if (referencedIn.length >= 5) break; // cap list for brevity
      }
    }
    const isReferenced = referencedIn.length > 0;
    if (isReferenced) referencedCount++;
    findings.push({ asset: af, name, isReferenced, referencedIn });
  }

  const total = assetFiles.length;
  const orphans = findings.filter(f => !f.isReferenced);

  console.log('Asset Analysis (lite)');
  console.log(`Total assets scanned: ${total}`);
  console.log(`Referenced: ${referencedCount}`);
  console.log(`Suspected orphans (static): ${orphans.length}`);
  console.log('---');

  // Print up to first 50 suspected orphans
  for (const f of orphans.slice(0, 50)) {
    console.log(`ORPHAN? ${path.relative(projectRoot, f.asset)}`);
  }

  console.log('---');
  console.log('Notes:');
  console.log(
    '- This is a static, filename-based check. Dynamic usages (e.g., computed paths) are not detected.'
  );
  console.log('- Validate with dynamic proof (runtime coverage/telemetry) before deletion.');
}

main();
