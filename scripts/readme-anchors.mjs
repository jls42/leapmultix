#!/usr/bin/env node
// Ancres internes des README : chaque lien « [texte](#ancre) » doit viser un titre du même
// fichier. Sinon le clic ne mène nulle part, sans que rien ne le signale.
//
// Ancre d'un titre, calculée comme GitHub (comparée à son rendu, en six langues) : le texte
// en minuscules, sans rien d'autre que lettres, marques, chiffres, « _ », « - » et espaces,
// puis les espaces changées en tirets ; un doublon reçoit -1, -2… Un émoji disparaît, mais
// pas son sélecteur de variante invisible (U+FE0F, une marque) : « 🏗️ Architecture » donne
// « ️-architecture », et le lien « #-architecture » ne mène nulle part.
//
// Une traduction (scripts/regen-readme-translations.sh) nomme parfois un titre autrement que
// son lien dans la table des matières. --fix réaligne chaque lien cassé de la traduction sur
// le titre de même rang que celui que vise, dans le README source, le lien de même rang.
//
// Usage :
//   node scripts/readme-anchors.mjs <README>...                  contrôle : code 1 si un lien est cassé
//   node scripts/readme-anchors.mjs --fix <source> <traduction>  réaligne la traduction, puis la contrôle

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

/** Bloc de code : ses « # » de commentaire ne sont pas des titres */
const FENCE = /^\x60\x60\x60[\s\S]*?^\x60\x60\x60/gm;
// Une espace après les « # », puis tout le reste de la ligne (rogné ensuite) : aucun retour
// arrière possible, quelle que soit la ligne
const HEADING = /^#{1,6}[ \t](.*)$/gm;
const LINK = /\]\(#([^)\s]+)\)/g;

/** Ancre GitHub d'un titre, sans le suffixe des doublons */
export function slugify(title) {
  return (
    title
      .replaceAll(/\x60([^\x60]*)\x60/g, '$1')
      // Crochets et parenthèses exclus des classes : chaque essai s'arrête au suivant
      .replaceAll(/\[([^[\]]*)\]\([^()]*\)/g, '$1')
      .toLowerCase()
      .replaceAll(/[^\p{L}\p{M}\p{N}_\- ]/gu, '')
      .replaceAll(' ', '-')
  );
}

/** Positions des blocs de code : [début, fin[ */
function fenceRanges(text) {
  return [...text.matchAll(FENCE)].map(match => [match.index, match.index + match[0].length]);
}

/** Ancres des titres, dans l'ordre, doublons suffixés comme GitHub */
export function headingAnchors(text) {
  const seen = new Map();
  return [...text.replaceAll(FENCE, '').matchAll(HEADING)].map(([, title]) => {
    const slug = slugify(title.trim());
    const count = seen.get(slug) ?? 0;
    seen.set(slug, count + 1);
    return count ? `${slug}-${count}` : slug;
  });
}

/** Liens internes hors blocs de code, dans l'ordre : ancre visée et position */
function internalLinks(text) {
  const fences = fenceRanges(text);
  return [...text.matchAll(LINK)]
    .filter(match => !fences.some(([start, end]) => match.index >= start && match.index < end))
    .map(match => ({ anchor: match[1], index: match.index }));
}

/** Ancre telle que GitHub la compare : un lien peut l'écrire encodée (%C3%A9) */
function decoded(anchor) {
  try {
    return decodeURIComponent(anchor);
  } catch {
    return anchor;
  }
}

/** Liens internes cassés : leur ancre ne vise aucun titre du fichier */
export function brokenLinks(text) {
  const anchors = new Set(headingAnchors(text));
  return internalLinks(text)
    .filter(link => !anchors.has(decoded(link.anchor)))
    .map(link => link.anchor);
}

/**
 * Réaligne les liens cassés d'une traduction : son lien de rang i vise le titre de même
 * rang que celui que vise le lien de rang i du source. Titres et liens doivent être aussi
 * nombreux des deux côtés ; un lien déjà cassé dans le source reste tel quel.
 * @returns {{text: string, fixed: number}}
 */
export function alignLinks(source, translation) {
  const sourceAnchors = headingAnchors(source);
  const targetAnchors = headingAnchors(translation);
  const sourceLinks = internalLinks(source);
  const targetLinks = internalLinks(translation);
  if (sourceAnchors.length !== targetAnchors.length || sourceLinks.length !== targetLinks.length) {
    throw new Error(
      `Structure différente du source : ${targetAnchors.length} titres et ${targetLinks.length} liens ` +
        `pour ${sourceAnchors.length} et ${sourceLinks.length}`
    );
  }
  const valid = new Set(targetAnchors);
  let text = translation;
  let fixed = 0;
  // De la fin vers le début : un remplacement ne décale pas les liens qui restent à voir
  for (let rank = targetLinks.length - 1; rank >= 0; rank--) {
    const { anchor, index } = targetLinks[rank];
    const heading = sourceAnchors.indexOf(decoded(sourceLinks[rank].anchor));
    if (valid.has(decoded(anchor)) || heading === -1) continue;
    const start = index + '](#'.length;
    text = text.slice(0, start) + targetAnchors[heading] + text.slice(start + anchor.length);
    fixed++;
  }
  return { text, fixed };
}

const USAGE = 'Usage : node scripts/readme-anchors.mjs <README>... | --fix <source> <traduction>';

/** Contrôle des fichiers : nombre de liens cassés, chacun nommé sur la sortie d'erreur */
function report(files) {
  let broken = 0;
  for (const file of files) {
    const links = brokenLinks(fs.readFileSync(file, 'utf8'));
    broken += links.length;
    if (links.length) console.error(`${file} : lien(s) sans titre : ${links.join(', ')}`);
  }
  return broken;
}

function main(argv) {
  const fix = argv[0] === '--fix';
  const files = fix ? argv.slice(1) : argv;
  if (files.length === 0 || (fix && files.length !== 2)) {
    console.error(USAGE);
    return 1;
  }
  if (fix) {
    const [source, target] = files;
    const { text, fixed } = alignLinks(
      fs.readFileSync(source, 'utf8'),
      fs.readFileSync(target, 'utf8')
    );
    if (fixed) fs.writeFileSync(target, text);
    console.log(`${target} : ${fixed} lien(s) réaligné(s)`);
  }
  return report(files) ? 1 : 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
