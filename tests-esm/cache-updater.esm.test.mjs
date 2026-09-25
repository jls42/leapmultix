/* eslint-env jest */
/**
 * Détection d'un cache incohérent (js/cache-updater.js) : seuls les scripts du site
 * comptent. Le script externe de Plausible n'a jamais de version ; le compter déclenchait
 * un nettoyage complet (service worker désinscrit, caches vidés, voix comprise) à chaque
 * visite, depuis que deploy.sh versionne toutes les adresses du site.
 */
import { describe, test, expect } from '@jest/globals';
import { hasMixedScriptVersions } from '../js/cache-updater.js';

const ORIGIN = 'https://leapmultix.jls42.org';
const scripts = (...srcs) => srcs.map(src => ({ src }));

describe('hasMixedScriptVersions', () => {
  test('prod versionnée avec Plausible externe : pas de mélange, pas de nettoyage', () => {
    const page = scripts(
      `${ORIGIN}/js/optional-styles-loader.js?v=v24`,
      `${ORIGIN}/js/bootstrap-critical.js?v=v24`,
      'https://plausible.io/js/script.js'
    );
    expect(hasMixedScriptVersions(page, ORIGIN)).toBe(false);
  });

  test('scripts du site mélangés : versionnés et non versionnés', () => {
    const page = scripts(`${ORIGIN}/js/a.js?v=v24`, `${ORIGIN}/js/b.js`);
    expect(hasMixedScriptVersions(page, ORIGIN)).toBe(true);
  });

  test.each([
    ['développement : aucun script versionné', scripts('http://localhost:8080/js/a.js')],
    ['tous versionnés', scripts(`${ORIGIN}/js/a.js?v=v24`, `${ORIGIN}/js/b.js?v=v24`)],
    ['aucun script', []],
    ['adresse illisible ignorée', scripts('::', `${ORIGIN}/js/a.js?v=v24`)],
  ])('%s : pas de nettoyage', (_label, page) => {
    const origin = page[0]?.src.startsWith('http://localhost') ? 'http://localhost:8080' : ORIGIN;
    expect(hasMixedScriptVersions(page, origin)).toBe(false);
  });
});
