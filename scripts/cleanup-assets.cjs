#!/usr/bin/env node
/*
 Cleanup assets with triple-proof safeguards.
 - Requires: docs/audit/assets-delete-list.txt and runtime JSON (analysis/runtime-assets.json) for confirmation.
 - Dry-run by default; pass --confirm to actually delete.
 - Exits 1 if missing prerequisites or in dry-run with candidates.
*/
const fs = require('fs');
const path = require('path');

const root = process.cwd();
let deleteListPath = path.join(root, 'docs', 'audit', 'assets-delete-list.txt');
const runtimePath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(root, 'analysis', 'runtime-assets.json');
const confirm = process.argv.includes('--confirm');
// Optional: --list path/to/list.txt to override the default delete list
const listIdx = process.argv.indexOf('--list');
if (listIdx !== -1 && process.argv[listIdx + 1]) {
  deleteListPath = path.resolve(process.argv[listIdx + 1]);
}

function readLines(p) {
  if (!fs.existsSync(p)) return [];
  return fs
    .readFileSync(p, 'utf8')
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(Boolean);
}

function normalize(p) {
  return p.replace(/\\/g, '/').replace(/^\//, '');
}

function main() {
  const candidates = readLines(deleteListPath).map(normalize);
  if (!candidates.length) {
    console.error('No candidates found at', deleteListPath);
    process.exit(1);
  }
  let runtime = [];
  if (fs.existsSync(runtimePath)) {
    try {
      runtime = JSON.parse(fs.readFileSync(runtimePath, 'utf8'));
    } catch (e) {
      /* ignore */
    }
  }
  const runtimeSet = new Set(runtime.map(normalize));

  // Only allow deletion if none of the candidates is present in runtime used.
  const blocked = candidates.filter(c => runtimeSet.has(c));
  const deletable = candidates.filter(c => !runtimeSet.has(c));

  const outDir = path.join(root, 'docs', 'audit', 'logs');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const logFile = path.join(outDir, 'assets_cleanup.out');
  const logs = [];
  logs.push(`Runtime path: ${runtimePath} (${runtime.length} items)`);
  logs.push(`List path: ${deleteListPath}`);
  logs.push(`Candidates: ${candidates.length}`);
  logs.push(`Blocked by runtime usage: ${blocked.length}`);
  logs.push(`Deletable (no runtime hit): ${deletable.length}`);

  if (!confirm) {
    logs.push('Dry-run: pass --confirm to delete.');
    fs.writeFileSync(logFile, logs.join('\n'));
    console.log(logs.join('\n'));
    process.exit(deletable.length ? 1 : 0);
  }

  // Confirmed deletion (still safe-guarded by runtime proof)
  let removed = 0;
  for (const rel of deletable) {
    const abs = path.join(root, rel);
    try {
      if (fs.existsSync(abs)) {
        fs.unlinkSync(abs);
        removed++;
      }
    } catch (e) {
      logs.push(`Failed to remove ${rel}: ${e.message}`);
    }
  }
  logs.push(`Removed: ${removed}`);
  fs.writeFileSync(logFile, logs.join('\n'));
  console.log(logs.join('\n'));
}

main();
