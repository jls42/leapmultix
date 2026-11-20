/**
 * css/landscape-phone.css ne parle qu'au téléphone tourné : chaque règle vit dans une media
 * query « paysage et écran bas ». Une règle sortie de ces blocs changerait le portrait, la
 * tablette et l'ordinateur ; la feuille est chargée en dernier, elle l'emporterait partout.
 */
import { describe, expect, test } from '@jest/globals';
import { readFileSync } from 'node:fs';

const css = readFileSync('css/landscape-phone.css', 'utf8').replaceAll(/\/\*[\s\S]*?\*\//g, '');
const html = readFileSync('index.html', 'utf8');

/** Entêtes des blocs de premier niveau de la feuille (« @media … », ou un sélecteur) */
function topLevelPreludes(source) {
  const preludes = [];
  let depth = 0;
  let start = 0;
  for (const [index, char] of [...source].entries()) {
    if (char === '{') {
      if (depth === 0) preludes.push(source.slice(start, index).trim());
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0) start = index + 1;
    }
  }
  return preludes;
}

describe('Feuille du téléphone tourné', () => {
  const preludes = topLevelPreludes(css);

  test('ne contient que des media queries « paysage et écran bas »', () => {
    expect(preludes.length).toBeGreaterThan(0);
    const elsewhere = preludes.filter(prelude => {
      if (!prelude.startsWith('@media')) return true;
      // Chaque condition de la liste (séparée par des virgules) porte les deux limites
      return !prelude
        .slice('@media'.length)
        .split(',')
        .every(
          query =>
            query.includes('(orientation: landscape)') && /\(max-height: (540|360)px\)/.test(query)
        );
    });
    expect(elsewhere).toEqual([]);
  });

  test('la même limite que les jeux d’Arcade (css/arcade.css, js/arcade-common.js)', () => {
    const query = '(orientation: landscape) and (max-height: 540px)';
    expect(css).toContain(`@media ${query}`);
    expect(readFileSync('css/arcade.css', 'utf8')).toContain(`@media ${query}`);
    expect(readFileSync('js/arcade-common.js', 'utf8')).toContain(`'${query}'`);
  });

  test('est chargée après toutes les autres feuilles, avec ou sans JavaScript', () => {
    const [withScripts, withoutScripts] = html.split('<noscript>');
    const sheets = part =>
      [...part.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(m => m[1]);
    expect(sheets(withScripts).at(-1)).toBe('css/landscape-phone.css');
    expect(sheets(withoutScripts.split('</noscript>')[0]).at(-1)).toBe('css/landscape-phone.css');
  });
});
