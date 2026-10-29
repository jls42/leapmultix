/**
 * Ce que chaque fête du registre (js/core/seasons.js) doit fournir pour changer seule le thème
 * par défaut pendant ses dates : des dates valides qui n'empiètent sur aucune autre fête, deux
 * thèmes (clair et sombre) avec leur palette, leur bouton caché et leur nom en fr, en et es, et
 * son identifiant connu du service worker. Ajouter Noël ou le Nouvel An au registre fait
 * échouer ce test tant qu'il manque une pièce (les images : tests-esm/season-images.esm.test.mjs).
 */
import { describe, test, expect } from '@jest/globals';
import fs from 'node:fs';
import vm from 'node:vm';

const { SEASONS, findSeason, isInSeason } = await import('../../js/core/seasons.js');

const css = fs.readFileSync('css/themes.css', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const translations = ['fr', 'en', 'es'].map(lang => [
  lang,
  JSON.parse(fs.readFileSync(`assets/translations/${lang}.json`, 'utf8')),
]);
// Thèmes ordinaires de la Personnalisation : une fête ne réutilise pas leur nom
const ORDINARY_THEMES = ['default', 'blue', 'dark', 'green', 'orange', 'pink'];
// Bloc commun des thèmes sombres de css/themes.css (« .theme-blue, .theme-dark, … { »)
const darkBlock = /((?:\.theme-[a-z]+,\s*)+\.theme-[a-z]+)\s*\{\s*color-scheme: dark;/.exec(css);
const DARK_THEMES = darkBlock[1].split(/,\s*/).map(selector => selector.replace('.theme-', ''));

/** Chaque jour d'une année bissextile, pour que le 29 février compte aussi */
const EVERY_DAY = Array.from({ length: 366 }, (_, index) => new Date(2028, 0, 1 + index, 12));
const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const validDay = ([month, day]) =>
  Number.isInteger(month) &&
  month >= 1 &&
  month <= 12 &&
  day >= 1 &&
  day <= DAYS_IN_MONTH.at(month - 1);

/** Bouton d'un thème dans index.html : sa balise ouvrante, attributs compris */
function buttonOf(theme) {
  const at = html.indexOf(`data-color-theme="${theme}"`);
  if (at < 0) return '';
  return html.slice(html.lastIndexOf('<button', at), html.indexOf('>', at) + 1);
}

describe('Registre', () => {
  test('identifiants uniques, en minuscules sans tiret (suffixe des images, classes)', () => {
    const ids = SEASONS.map(season => season.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.filter(id => !/^[a-z]+$/.test(id))).toEqual([]);
  });

  test('thèmes uniques, en minuscules, distincts des thèmes ordinaires', () => {
    const themes = SEASONS.flatMap(season => [season.themes.light, season.themes.dark]);
    expect(new Set(themes).size).toBe(themes.length);
    expect(themes.filter(theme => !/^[a-z]+$/.test(theme))).toEqual([]);
    expect(themes.filter(theme => ORDINARY_THEMES.includes(theme))).toEqual([]);
  });

  test('deux fêtes ne tombent jamais le même jour : le thème du jour est sans ambiguïté', () => {
    const crowded = EVERY_DAY.filter(
      date => SEASONS.filter(season => isInSeason(season, date)).length > 1
    );
    expect(crowded.map(date => date.toDateString())).toEqual([]);
  });

  test('un jour sans fête rend le thème ordinaire', () => {
    const quiet = EVERY_DAY.filter(date => findSeason(date) === null);
    expect(quiet.length).toBeGreaterThan(0);
  });
});

describe.each(SEASONS.map(season => [season.id, season]))('%s', (id, season) => {
  test('dates valides, chaque jour de la fête la trouve', () => {
    expect(validDay(season.from)).toBe(true);
    expect(validDay(season.to)).toBe(true);
    expect(EVERY_DAY.some(date => findSeason(date) === season)).toBe(true);
  });

  test('fonds costumés : un nombre entier d’au moins un', () => {
    if (!season.costumes.includes('backgrounds')) return;
    expect(Number.isInteger(season.worlds ?? 1)).toBe(true);
    expect(season.worlds ?? 1).toBeGreaterThanOrEqual(1);
  });

  test.each(Object.entries(season.themes))(
    'thème %s (%s) : palette, bouton caché, nom traduit',
    (kind, theme) => {
      expect(css).toContain(`.theme-${theme} {`);
      // Le thème sombre prend aussi les états et ombres communs des thèmes sombres
      expect(DARK_THEMES.includes(theme)).toBe(kind === 'dark');
      const button = buttonOf(theme);
      expect(button).toMatch(/\shidden[\s>]/);
      expect(button).toContain(`data-translate="color_theme_${theme}"`);
      const untranslated = translations.filter(
        ([, keys]) => !Object.hasOwn(keys, `color_theme_${theme}`)
      );
      expect(untranslated.map(([lang]) => lang)).toEqual([]);
    }
  );

  test('connue du service worker, qui sert l’image classique à sa place hors ligne', () => {
    const source = fs.readFileSync('sw.js', 'utf8');
    const ids = vm.runInNewContext(/const SEASON_IDS = (\[[^\]]*\]);/.exec(source)[1]);
    expect(ids).toContain(id);
  });
});
