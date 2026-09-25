#!/usr/bin/env node
// Au déploiement : met le numéro de version dans chaque adresse de module et de feuille de
// style du site, sur la copie que prépare deploy.sh (jamais sur le dépôt).
//
// Pourquoi : les modules s'importent entre eux sans numéro de version, et CloudFront les
// sert avec un cache navigateur d'une semaine. Le navigateur ressert alors ces fichiers
// depuis son cache sans consulter le service worker : après un déploiement, un joueur déjà
// venu mélangeait d'anciens modules et de nouveaux (export absent, le mode ne démarrait
// pas). Avec la version dans chaque adresse, chaque déploiement a les siennes : rien
// d'ancien ne se réutilise. Une adresse qui a déjà un paramètre est laissée telle quelle.
//
// Réécrit :
// - dans js/**/*.js : import … from './a.js', export … from '../b.js', import './c.js',
//   import('./d.js') (chemins relatifs, argument littéral) ;
// - dans index.html : src="js/….js" et href="css/….css" / href="js/….js".
//
// Usage : node scripts/version-module-urls.mjs <dossier du site> <version>

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Version acceptée : celle de js/cache-updater.js (APP_VERSION), « v22 » par exemple */
const VERSION = /^v[0-9A-Za-z.-]{1,40}$/;

/** Chemin relatif d'un module, sans paramètre ni ancre */
const RELATIVE_MODULE = String.raw`\.{1,2}\/[^'"?#\s]+?\.js`;

const IMPORT_PATTERNS = [
  // import … from './a.js' ; export … from '../b.js'
  new RegExp(String.raw`(\bfrom\s*)(['"])(${RELATIVE_MODULE})\2`, 'g'),
  // import './c.js'
  new RegExp(String.raw`(\bimport\s*)(['"])(${RELATIVE_MODULE})\2`, 'g'),
  // import('./d.js')
  new RegExp(String.raw`(\bimport\s*\(\s*)(['"])(${RELATIVE_MODULE})\2`, 'g'),
];

/** Scripts et feuilles de style de la page : src="js/….js", href="css/….css" ou "js/….js" */
const HTML_ASSET = /(\b(?:src|href)=")((?:js\/[^"?#\s]+\.js)|(?:css\/[^"?#\s]+\.css))(")/g;

function assertVersion(version) {
  if (!VERSION.test(version)) throw new Error(`Version invalide : ${version}`);
}

/**
 * Ajoute ?v=<version> aux imports relatifs d'un module
 * @param {string} source
 * @param {string} version
 * @returns {{text: string, count: number}}
 */
export function versionImports(source, version) {
  assertVersion(version);
  let count = 0;
  let text = source;
  for (const pattern of IMPORT_PATTERNS) {
    text = text.replace(pattern, (_match, head, quote, specifier) => {
      count++;
      return `${head}${quote}${specifier}?v=${version}${quote}`;
    });
  }
  return { text, count };
}

/**
 * Ajoute ?v=<version> aux scripts et feuilles de style d'une page
 * @param {string} html
 * @param {string} version
 * @returns {{text: string, count: number}}
 */
export function versionHtmlAssets(html, version) {
  assertVersion(version);
  let count = 0;
  const text = html.replace(HTML_ASSET, (_match, head, url, tail) => {
    count++;
    return `${head}${url}?v=${version}${tail}`;
  });
  return { text, count };
}

/** Fichiers .js d'un dossier, sous-dossiers compris */
function jsFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return jsFiles(full);
    return entry.name.endsWith('.js') ? [full] : [];
  });
}

/**
 * Versionne la copie du site : modules de js/ et page index.html
 * @param {string} siteDir
 * @param {string} version
 * @returns {{files: number, imports: number, htmlAssets: number}}
 */
export function versionSite(siteDir, version) {
  assertVersion(version);
  const report = { files: 0, imports: 0, htmlAssets: 0 };
  for (const file of jsFiles(path.join(siteDir, 'js'))) {
    const { text, count } = versionImports(fs.readFileSync(file, 'utf8'), version);
    if (count === 0) continue;
    fs.writeFileSync(file, text);
    report.files++;
    report.imports += count;
  }
  const page = path.join(siteDir, 'index.html');
  const { text, count } = versionHtmlAssets(fs.readFileSync(page, 'utf8'), version);
  fs.writeFileSync(page, text);
  report.htmlAssets = count;
  return report;
}

function main([siteDir, version]) {
  if (!siteDir || !version) {
    console.error('Usage : node scripts/version-module-urls.mjs <dossier du site> <version>');
    return 1;
  }
  const report = versionSite(siteDir, version);
  console.log(
    `Version ${version} : ${report.imports} imports dans ${report.files} modules, ` +
      `${report.htmlAssets} adresses dans index.html`
  );
  // Rien de réécrit : mauvais dossier, ou forme d'import devenue inconnue
  if (report.imports === 0 || report.htmlAssets === 0) {
    console.error('Aucune adresse réécrite : déploiement arrêté');
    return 1;
  }
  return 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
