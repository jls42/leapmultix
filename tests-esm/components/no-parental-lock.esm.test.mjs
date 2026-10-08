/* eslint-env jest, node */
/**
 * Le code parental du tableau de bord est retiré (décision du 08/10) : la case de
 * Personnalisation s'enregistrait, mais rien ne la lisait, et le tableau de bord s'ouvrait
 * sans aucun contrôle. Plus de case qui promet une protection, plus de fenêtre morte, plus de
 * textes orphelins.
 */
import { describe, test, expect } from '@jest/globals';
import { readFileSync, existsSync } from 'node:fs';

const read = path => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const html = read('index.html');

describe('Code parental : retiré', () => {
  test('Personnalisation n’a plus de case « code parental »', () => {
    expect(html).not.toContain('parental-lock-toggle');
    expect(html).not.toContain('enable_parental_lock');
  });

  test('la fenêtre de vérification, jamais ouverte, a disparu', () => {
    expect(html).not.toContain('parental-lock-popup');
    expect(existsSync(new URL('../../js/core/parental.js', import.meta.url))).toBe(false);
  });

  test('le code ne lit ni n’écrit plus parentalLockEnabled', () => {
    for (const file of ['js/components/customization.js', 'js/storage.js', 'js/userManager.js']) {
      expect([file, read(file).includes('parentalLock')]).toEqual([file, false]);
    }
  });

  test('plus aucun texte du code parental dans les trois langues', () => {
    for (const lang of ['fr', 'en', 'es']) {
      const keys = Object.keys(JSON.parse(read(`assets/translations/${lang}.json`)));
      // « validate » ne servait qu'au bouton de la fenêtre de vérification
      const orphans = keys.filter(key => key.includes('parental') || key === 'validate');
      expect([lang, orphans]).toEqual([lang, []]);
    }
  });
});
