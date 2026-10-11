/* eslint-env jest, node */
/**
 * Traceur de Plausible servi par le site : js/vendor/plausible.js est la copie exacte du paquet
 * officiel @plausible-analytics/tracker installé, licence MIT en tête. Une mise à jour du paquet
 * fait échouer ce test tant que la copie n'est pas refaite (npm run vendor:plausible) : le code
 * qui tourne dans le jeu est toujours celui qu'on a relu.
 */
import { describe, expect, test } from '@jest/globals';
import { readFileSync } from 'node:fs';

const { VENDORED_FILE, installedTracker, vendoredTracker } = await import(
  '../scripts/vendor-plausible.mjs'
);

const PACKAGE = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

describe('Traceur de Plausible copié dans js/vendor/', () => {
  test('version exacte dans package.json, celle du paquet installé', () => {
    const declared = PACKAGE.devDependencies['@plausible-analytics/tracker'];
    expect(declared).toMatch(/^\d+\.\d+\.\d+$/);
    expect(declared).toBe(installedTracker().version);
  });

  test('la copie est le module du paquet, précédé de sa licence', () => {
    const tracker = installedTracker();
    const copy = readFileSync(VENDORED_FILE, 'utf8');
    expect(copy).toBe(vendoredTracker(tracker));
    expect(copy.endsWith(tracker.source)).toBe(true);
    expect(copy).toContain('Copyright 2020 Plausible Insights OÜ');
  });

  test('le module ne charge rien d’autre : aucune adresse ni aucun import', () => {
    const { source } = installedTracker();
    expect(source).not.toMatch(/\bimport\s*[({'"]|\bimport\s+[\w{*]/);
    expect(source).not.toMatch(/https?:\/\/(?!plausible\.io\/api\/event)/);
  });
});
