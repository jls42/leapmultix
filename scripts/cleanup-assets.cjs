#!/usr/bin/env node
/*
 Cleanup assets with triple-proof safeguards.
 Usage:
   node scripts/cleanup-assets.cjs [runtime.json] [--list delete-list.txt] [--confirm]
 - Delete list: docs/audit/assets-delete-list.txt by default (written by assets-diff.cjs).
 - Runtime proof: analysis/runtime-assets.json by default. It is mandatory: without a
   readable proof, nothing is deleted.
 - Both files must live inside the project, and every candidate under
   assets/images, assets/sounds or assets/videos; otherwise the whole run is refused.
 - Dry-run by default; pass --confirm to actually delete.
 - Exits 1 if a prerequisite is missing or invalid, or in dry-run with candidates.
*/
const fs = require('fs');
const path = require('path');
const { normalize, resolveInside, readRuntimeProof } = require('./lib/asset-inputs.cjs');

const root = process.cwd();
const DEFAULT_LIST = path.join('docs', 'audit', 'assets-delete-list.txt');
const DEFAULT_RUNTIME = path.join('analysis', 'runtime-assets.json');
const ASSET_DIRS = ['images', 'sounds', 'videos'].map(dir => path.join(root, 'assets', dir));
const USAGE = 'Usage : cleanup-assets.cjs [runtime.json] [--list liste.txt] [--confirm]';

function parseArgs(argv) {
  const options = { confirm: false, list: null, runtime: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--confirm') {
      options.confirm = true;
    } else if (arg === '--list' && i + 1 < argv.length) {
      i++;
      options.list = argv[i];
    } else if (!arg.startsWith('--') && options.runtime === null) {
      options.runtime = arg;
    } else {
      throw new Error(`Argument n°${i + 1} non reconnu. ${USAGE}`);
    }
  }
  return options;
}

function readLines(file) {
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(Boolean);
}

/** Seuls les fichiers des dossiers d'assets peuvent être supprimés. */
function isAssetFile(relPath) {
  const abs = path.resolve(root, relPath);
  return ASSET_DIRS.some(dir => abs.startsWith(dir + path.sep));
}

function removeFiles(relPaths, logs) {
  let removed = 0;
  for (const rel of relPaths) {
    const abs = path.resolve(root, rel);
    try {
      if (fs.existsSync(abs)) {
        fs.unlinkSync(abs);
        removed++;
      }
    } catch (e) {
      logs.push(`Failed to remove ${rel}: ${e.message}`);
    }
  }
  return removed;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const listPath = resolveInside(root, options.list ?? DEFAULT_LIST);
  const runtimePath = resolveInside(root, options.runtime ?? DEFAULT_RUNTIME);

  const candidates = readLines(listPath).map(normalize);
  if (!candidates.length) {
    throw new Error('Aucun candidat dans la liste de suppression.');
  }
  const outsideAssets = candidates.filter(c => !isAssetFile(c)).length;
  if (outsideAssets) {
    throw new Error(
      `${outsideAssets} candidat(s) hors de assets/images, sounds ou videos : liste refusée.`
    );
  }

  const runtime = readRuntimeProof(runtimePath);
  const runtimeSet = new Set(runtime);

  // Only allow deletion if none of the candidates is present in runtime used.
  const blocked = candidates.filter(c => runtimeSet.has(c));
  const deletable = candidates.filter(c => !runtimeSet.has(c));

  const outDir = path.join(root, 'docs', 'audit', 'logs');
  fs.mkdirSync(outDir, { recursive: true });
  const logFile = path.join(outDir, 'assets_cleanup.out');
  const logs = [
    `Runtime proof: ${runtime.length} items`,
    `Candidates: ${candidates.length}`,
    `Blocked by runtime usage: ${blocked.length}`,
    `Deletable (no runtime hit): ${deletable.length}`,
  ];

  if (options.confirm) {
    const removed = removeFiles(deletable, logs);
    logs.push(`Removed: ${removed}`);
  } else {
    logs.push('Dry-run: pass --confirm to delete.');
    process.exitCode = deletable.length ? 1 : 0;
  }
  fs.writeFileSync(logFile, logs.join('\n'));
  console.log(logs.join('\n'));
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
