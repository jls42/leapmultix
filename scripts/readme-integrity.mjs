#!/usr/bin/env node
// Contenu d'une traduction du README (scripts/regen-readme-translations.sh) : le modèle ne
// traduit que la prose. Les blocs de code reviennent à l'identique, dans le même ordre, et les
// liens (adresses, fichiers, images) sont exactement ceux de la source, ancres mises à part :
// scripts/readme-anchors.mjs les réaligne. Une commande changée ou une adresse ajoutée par le
// modèle finirait sinon dans le dépôt, puis dans le marketplace, sans relecture.
//
// Usage :
//   node scripts/readme-integrity.mjs <source> <traduction>   code 1 si le contenu diffère

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const USAGE = 'Usage : node scripts/readme-integrity.mjs <source> <traduction>';

/** Blocs de code (``` en colonne 0, lignes de clôture comprises), dans l'ordre */
export function codeBlocks(text) {
  const blocks = [];
  let current = null;
  for (const line of text.split('\n')) {
    if (!line.startsWith('```')) {
      current?.push(line);
    } else if (current === null) {
      current = [line];
    } else {
      blocks.push([...current, line].join('\n'));
      current = null;
    }
  }
  return blocks;
}

// Cible d'un lien Markdown, adresse entre chevrons, ou adresse nue. Une adresse nue s'arrête au
// premier caractère qu'une URL ne permet pas (accent grave, parenthèse, lettre accentuée…)
const LINK = /\]\(([^)\s]+)\)|<(https?:\/\/[^>\s]+)>|(https?:\/\/[\w\-.~:/?#@!$&'*+,;=%]+)/g;

/** Liens d'un texte, sans les ancres internes ; la ponctuation qui finit une phrase en est ôtée */
export function links(text) {
  const found = new Set();
  for (const [, target, bracketed, bare] of text.matchAll(LINK)) {
    const link = target ?? bracketed ?? bare.replace(/[.,;:!?*']+$/, '');
    if (!link.startsWith('#')) found.add(link);
  }
  return found;
}

/** Écarts de contenu entre la source et sa traduction, vide si aucun */
export function integrityProblems(source, translation) {
  const problems = [];
  const expectedBlocks = codeBlocks(source);
  const blocks = codeBlocks(translation);
  if (blocks.length === expectedBlocks.length) {
    blocks.forEach((block, i) => {
      if (block !== expectedBlocks.at(i)) problems.push(`bloc de code n° ${i + 1} modifié`);
    });
  } else {
    problems.push(`${blocks.length} bloc(s) de code au lieu de ${expectedBlocks.length}`);
  }
  const expectedLinks = links(source);
  const found = links(translation);
  for (const link of found) if (!expectedLinks.has(link)) problems.push(`lien ajouté : ${link}`);
  for (const link of expectedLinks) if (!found.has(link)) problems.push(`lien perdu : ${link}`);
  return problems;
}

function main(argv) {
  if (argv.length !== 2) {
    console.error(USAGE);
    return 1;
  }
  const [source, translation] = argv;
  const problems = integrityProblems(
    fs.readFileSync(source, 'utf8'),
    fs.readFileSync(translation, 'utf8')
  );
  for (const problem of problems) console.error(`${translation} : ${problem}`);
  return problems.length > 0 ? 1 : 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
