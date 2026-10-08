/* eslint-env jest, node */
/**
 * Soustraction : les calculs triviaux restent possibles mais rares. On enlève tout (7 − 7),
 * on enlève 1 (7 − 1), ou les deux nombres se suivent (7 − 6) : au niveau facile, c'est la
 * moitié des 55 calculs, et le tirage d'avant en faisait près de deux questions sur trois.
 * Chaque autre calcul a la même chance, comme en addition, en multiplication et en division.
 */
import { describe, test, expect } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { Subtraction } from '../../js/core/operations/Subtraction.js';

const DRAWS = 20000;
const sub = new Subtraction();

const isTrivial = ({ a, b }) => b === a || b === 1 || a - b === 1;
const key = ({ a, b }) => `${a}−${b}`;

/** Nombre de tirages de chaque calcul */
function drawCounts(difficulty) {
  const counts = new Map();
  for (let i = 0; i < DRAWS; i += 1) {
    const drawn = key(sub.generateOperands(difficulty));
    counts.set(drawn, (counts.get(drawn) ?? 0) + 1);
  }
  return counts;
}

function trivialShare(counts) {
  let trivial = 0;
  for (const [drawn, count] of counts) {
    const [a, b] = drawn.split('−').map(Number);
    if (isTrivial({ a, b })) trivial += count;
  }
  return trivial / DRAWS;
}

describe('Soustraction : tirage des calculs', () => {
  test('niveau facile (Aventure, niveaux 1 à 3) : environ une question triviale sur dix', () => {
    // 8,8 % attendus : 27 calculs triviaux pesant 0,1 face à 28 autres
    const share = trivialShare(drawCounts('easy'));
    expect(share).toBeGreaterThan(0.06);
    expect(share).toBeLessThan(0.12);
  });

  test('niveau moyen (Quiz, Défi) : moins d’une question triviale sur vingt', () => {
    // 3,6 % attendus
    const share = trivialShare(drawCounts('medium'));
    expect(share).toBeGreaterThan(0.02);
    expect(share).toBeLessThan(0.06);
  });

  test('chaque calcul du niveau facile peut encore sortir, triviaux compris', () => {
    const counts = drawCounts('easy');
    const all = sub.enumerateOperands('easy').map(key);
    expect(all.filter(pair => !counts.has(pair))).toEqual([]);
    for (const trivial of ['7−7', '7−1', '7−6', '1−1']) {
      expect(counts.get(trivial)).toBeGreaterThan(0);
    }
  });

  test('les exemples des niveaux faciles de l’Aventure sont des calculs que le niveau pose', () => {
    const easy = new Set(sub.enumerateOperands('easy').map(key));
    for (const lang of ['fr', 'en', 'es']) {
      const texts = JSON.parse(
        readFileSync(new URL(`../../assets/translations/${lang}.json`, import.meta.url), 'utf8')
      );
      for (const level of [1, 2, 3]) {
        const desc = texts[`subtraction_level_${level}_desc`];
        for (const [, a, b] of desc.matchAll(/(\d+)-(\d+)/g)) {
          const pair = { a: Number(a), b: Number(b) };
          expect({ lang, level, pair, posé: easy.has(key(pair)) }).toEqual({
            lang,
            level,
            pair,
            posé: true,
          });
          expect({ lang, level, pair, trivial: isTrivial(pair) }).toEqual({
            lang,
            level,
            pair,
            trivial: false,
          });
        }
      }
    }
  });

  test('deux calculs ordinaires ont la même chance, petit ou grand premier terme', () => {
    // 3,3 % chacun ; avant : 2,5 % pour 4 − 2 et 1 % pour 10 − 5
    const counts = drawCounts('easy');
    const small = counts.get('4−2') ?? 0;
    const large = counts.get('10−5') ?? 0;
    expect(Math.abs(small - large)).toBeLessThan(200);
  });
});
