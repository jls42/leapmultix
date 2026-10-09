/**
 * Survol réservé aux appareils qui survolent. Sur un écran tactile, Safari (iPad, iPhone)
 * garde l'état :hover là où le doigt s'est posé : « Abandonner », qui apparaît sous le doigt
 * qui vient de toucher « Jouer », restait teinté (mesuré dans WebKit), comme une touche du pavé
 * après l'avoir touchée. Chaque règle :hover de css/ est donc dans un @media (hover: hover),
 * comme l'étaient déjà les réponses, les modes et les cartes de niveau ; seule exception, la
 * remise à zéro réservée aux écrans tactiles (@media (hover: none)).
 */
import { describe, test, expect } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';

const CSS_DIR = 'css';
const HOVER_DEVICES = /@media[^{]*\(\s*hover\s*:\s*hover\s*\)/;
const TOUCH_ONLY = /@media[^{]*\(\s*hover\s*:\s*none\s*\)/;

/**
 * Blocs d'une feuille, chacun avec ceux qui le contiennent (@media…) et sa ligne. Les
 * commentaires sont blanchis sans changer les numéros de ligne.
 * @param {string} source
 * @returns {{prelude: string, parents: string[], line: number}[]}
 */
function blocksOf(source) {
  const text = source.replace(/\/\*[\s\S]*?\*\//g, comment => comment.replace(/[^\n]/g, ' '));
  const open = [];
  const blocks = [];
  let start = 0;
  for (let i = 0; i < text.length; i += 1) {
    const char = text.charAt(i);
    if (char === '{') {
      const raw = text.slice(start, i);
      const prelude = raw.trim();
      const first = start + Math.max(raw.search(/\S/), 0);
      blocks.push({ prelude, parents: [...open], line: text.slice(0, first).split('\n').length });
      open.push(prelude);
    } else if (char === '}') {
      open.pop();
    }
    if (char === '{' || char === '}' || char === ';') start = i + 1;
  }
  return blocks;
}

/** Règles :hover de css/, gardées ou non par un @media (hover: hover) */
function hoverRules() {
  const files = fs.readdirSync(CSS_DIR).filter(file => file.endsWith('.css'));
  return files.flatMap(file =>
    blocksOf(fs.readFileSync(path.join(CSS_DIR, file), 'utf8'))
      .filter(block => block.prelude.includes(':hover') && !block.prelude.startsWith('@'))
      .map(block => ({
        where: `${file}:${block.line} ${block.prelude.replace(/\s+/g, ' ')}`,
        guarded: block.parents.some(parent => HOVER_DEVICES.test(parent)),
        touchOnly: block.parents.some(parent => TOUCH_ONLY.test(parent)),
      }))
  );
}

describe('Survol des feuilles de style', () => {
  test('chaque règle :hover est réservée aux appareils qui survolent', () => {
    const unguarded = hoverRules().filter(rule => !rule.guarded && !rule.touchOnly);
    expect(unguarded.map(rule => rule.where)).toEqual([]);
  });

  test('le relevé lit bien les règles déjà gardées (réponses, modes, cartes de niveau)', () => {
    const guarded = hoverRules().filter(rule => rule.guarded);
    expect(guarded.map(rule => rule.where)).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^game\.css:\d+ \.option:hover:not\(:disabled\)$/),
      ])
    );
    expect(guarded.length).toBeGreaterThan(15);
  });
});
