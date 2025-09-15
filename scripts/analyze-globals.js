#!/usr/bin/env node
/**
 * Analyze global usage (window.*) per file and window assignments.
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(process.cwd(), 'js');

function listJsFiles(dir) {
  // eslint-disable-next-line -- dir is from controlled directory traversal starting from ROOT
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...listJsFiles(p));
    else if (e.isFile() && p.endsWith('.js')) files.push(p);
  }
  return files;
}

const stats = [];
for (const file of listJsFiles(ROOT)) {
  // eslint-disable-next-line -- file is from controlled directory traversal starting from ROOT
  const src = fs.readFileSync(file, 'utf8');
  const windowUses = (src.match(/\bwindow\./g) || []).length;
  const windowAssigns = (src.match(/\bwindow\.[A-Za-z0-9_]+\s*=\s*/g) || []).length;
  if (windowUses || windowAssigns) {
    stats.push({ file: path.relative(process.cwd(), file), windowUses, windowAssigns });
  }
}

stats.sort((a, b) => b.windowUses + b.windowAssigns - (a.windowUses + a.windowAssigns));

console.log('Global usage by file (window.*):');
for (const s of stats) {
  console.log(`${s.file}: uses=${s.windowUses}, assigns=${s.windowAssigns}`);
}

const top = stats.slice(0, 10).map(s => s.file);
console.log('\nTop candidates to de-globalize:');
top.forEach(f => console.log(` - ${f}`));
