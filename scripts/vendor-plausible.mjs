#!/usr/bin/env node
// Traceur de Plausible servi par le site : js/vendor/plausible.js est la copie du paquet
// officiel @plausible-analytics/tracker (version exacte de package.json), précédée de sa
// licence MIT. Aucun script de plausible.io ne tourne ainsi dans le jeu : le code qui mesure
// l'audience est celui du dépôt, relu à chaque mise à jour du paquet. Seuls les événements
// partent vers l'API de Plausible.
//
// Usage : node scripts/vendor-plausible.mjs           réécrit la copie
//         node scripts/vendor-plausible.mjs --check   échoue si la copie n'est pas à jour

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PACKAGE_DIR = path.join(ROOT, 'node_modules', '@plausible-analytics', 'tracker');
export const VENDORED_FILE = path.join(ROOT, 'js', 'vendor', 'plausible.js');

/**
 * Contenu de la copie : la licence du paquet en commentaire, puis son module tel quel
 * @param {{version: string, license: string, source: string}} tracker
 * @returns {string}
 */
export function vendoredTracker({ version, license, source }) {
  const notice = license
    .trim()
    .split('\n')
    .map(line => ` * ${line}`.trimEnd())
    .join('\n');
  return (
    `/*!\n * @plausible-analytics/tracker ${version} (npm run vendor:plausible)\n *\n` +
    `${notice}\n */\n${source}`
  );
}

/**
 * Le paquet installé dans node_modules : version, licence et module
 * @returns {{version: string, license: string, source: string}}
 */
export function installedTracker() {
  const read = name => fs.readFileSync(path.join(PACKAGE_DIR, name), 'utf8');
  return {
    version: JSON.parse(read('package.json')).version,
    license: read('LICENSE.md'),
    source: read('plausible.js'),
  };
}

function main(args) {
  const tracker = installedTracker();
  const expected = vendoredTracker(tracker);
  const relative = path.relative(ROOT, VENDORED_FILE);
  if (args.includes('--check')) {
    const current = fs.existsSync(VENDORED_FILE) ? fs.readFileSync(VENDORED_FILE, 'utf8') : '';
    if (current !== expected) {
      console.error(`${relative} ne correspond pas au paquet installé : npm run vendor:plausible`);
      process.exit(1);
    }
    console.log(`${relative} à jour (${tracker.version})`);
    return;
  }
  fs.mkdirSync(path.dirname(VENDORED_FILE), { recursive: true });
  fs.writeFileSync(VENDORED_FILE, expected);
  console.log(`${relative} : @plausible-analytics/tracker ${tracker.version}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2));
}
