#!/usr/bin/env node
/*
 Compare static asset references vs runtime-collected usage to produce deletion candidates.
 Usage:
   node scripts/assets-diff.cjs [path/to/runtime-assets.json]
 If runtime JSON is missing, runs static-only and warns (no triple-proof yet).
 Output:
   - docs/audit/assets-diff-report.json
   - docs/audit/assets-delete-list.txt (one path per line)
*/
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const assetsDirs = [
  path.join(root, 'assets', 'images'),
  path.join(root, 'assets', 'sounds'),
  path.join(root, 'assets', 'videos'),
];

function listFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...listFiles(full));
    else out.push(full);
  }
  return out;
}

function listCodeFiles() {
  const out = [];
  const addIf = p => {
    if (fs.existsSync(p)) out.push(p);
  };
  const scan = dir => {
    if (!fs.existsSync(dir)) return;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) scan(full);
      else if (/\.(js|mjs|cjs|css|html)$/i.test(full)) out.push(full);
    }
  };
  scan(path.join(root, 'js'));
  scan(path.join(root, 'css'));
  addIf(path.join(root, 'index.html'));
  return out;
}

function normalize(relPath) {
  return relPath.replace(/\\/g, '/').replace(/^\//, '');
}

function main() {
  const runtimePath = process.argv[2] ? path.resolve(process.argv[2]) : null;
  let runtimeUsed = new Set();
  let runtimeNote = 'Runtime JSON not provided; static-only analysis.';
  if (runtimePath && fs.existsSync(runtimePath)) {
    try {
      const arr = JSON.parse(fs.readFileSync(runtimePath, 'utf8'));
      if (Array.isArray(arr)) runtimeUsed = new Set(arr.map(normalize));
      runtimeNote = `Runtime set loaded: ${runtimeUsed.size} entries.`;
    } catch (e) {
      runtimeNote = `Failed to parse runtime JSON: ${e.message}`;
    }
  }

  const assetFiles = assetsDirs.flatMap(listFiles).map(p => normalize(path.relative(root, p)));
  const codeFiles = listCodeFiles();
  const codeCache = new Map();
  for (const f of codeFiles) {
    try {
      codeCache.set(f, fs.readFileSync(f, 'utf8'));
    } catch {
      /* ignore */
    }
  }

  const staticUsed = new Set();
  const staticRefs = {};
  for (const af of assetFiles) {
    const name = path.basename(af);
    let hit = false;
    for (const [cf, src] of codeCache) {
      if (src.includes(name)) {
        hit = true;
        (staticRefs[af] ||= []).push(cf);
        if (staticRefs[af].length >= 5) break;
      }
    }
    if (hit) staticUsed.add(af);
  }

  const staticSuspects = assetFiles.filter(p => !staticUsed.has(p));
  const runtimeUsedInAssets = Array.from(runtimeUsed).filter(p => p.startsWith('assets/'));
  const runtimeSet = new Set(runtimeUsedInAssets);
  const candidates = staticSuspects.filter(p => !runtimeSet.has(p));

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalAssets: assetFiles.length,
      staticUsed: staticUsed.size,
      staticSuspects: staticSuspects.length,
      runtimeUsed: runtimeSet.size,
      deletionCandidates: candidates.length,
      runtimeNote,
    },
    candidates,
    sample: candidates.slice(0, 50),
  };

  const outDir = path.join(root, 'docs', 'audit');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'assets-diff-report.json'), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(outDir, 'assets-delete-list.txt'), candidates.join('\n'));

  console.log('Assets diff completed');
  console.log('Summary:', report.summary);
  console.log('Report:', path.join('docs', 'audit', 'assets-diff-report.json'));
  console.log('Delete list:', path.join('docs', 'audit', 'assets-delete-list.txt'));
}

main();
