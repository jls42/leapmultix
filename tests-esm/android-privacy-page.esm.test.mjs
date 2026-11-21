/* eslint-env jest, node */
/**
 * Politique de confidentialité de l'appli Android (confidentialite-android.html) : l'adresse
 * donnée à la console Google Play. Une page seule, sans script, qui nomme l'éditeur et dit que
 * l'appli ne collecte rien ; liée depuis nulle part sur le site.
 *
 * Comme les pages juridiques du jeu, sa date suit son texte : le verrou
 * tests-esm/legal-pages.lock.json garde ses révisions (date en fr et en, empreinte du texte).
 * Texte changé : ce test échoue et donne la nouvelle empreinte ; ajouter une révision avec la
 * date du jour, puis la mettre dans la page, en français et en anglais.
 */
import { describe, expect, test } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const FILE = 'confidentialite-android.html';
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const SOURCE = read(FILE);
const PAGE = new DOMParser().parseFromString(SOURCE, 'text/html');
const LOCK = new Map(Object.entries(JSON.parse(read('tests-esm/legal-pages.lock.json'))));
const REVISIONS = LOCK.get('confidentialite-android').revisions;
const LAST = REVISIONS.at(-1);

const plain = text => String(text).replaceAll(/\s+/g, ' ').trim();
const fingerprint = text => createHash('sha256').update(text).digest('hex');
const article = lang => PAGE.querySelector(`article.legal-body[lang="${lang}"]`);
const legalText = () =>
  plain([...PAGE.querySelectorAll('article.legal-body')].map(el => el.textContent).join(' '));

describe('Politique de confidentialité de l’appli Android', () => {
  test('le texte est celui de la dernière révision du verrou', () => {
    const current = fingerprint(legalText());
    if (current !== LAST.empreinte) {
      throw new Error(
        `Le texte de ${FILE} a changé : ajoutez une révision au verrou ` +
          `(tests-esm/legal-pages.lock.json, « confidentialite-android ») avec la date du jour ` +
          `en fr et en et l'empreinte ${current}, puis mettez ces dates dans la page.`
      );
    }
    expect(current).toBe(LAST.empreinte);
  });

  test.each(['fr', 'en'])('date affichée en %s : celle de la dernière révision', lang => {
    const shown = plain(article(lang).querySelector('.last-updated').textContent);
    expect(shown).toBe(new Map(Object.entries(LAST.date)).get(lang));
  });

  test('chaque révision a sa propre date', () => {
    const dates = REVISIONS.map(revision => revision.date.fr);
    expect(new Set(dates).size).toBe(dates.length);
  });

  test.each(['fr', 'en'])('en %s : un titre de politique, l’éditeur et son contact', lang => {
    const text = plain(article(lang).textContent);
    expect(article(lang).querySelector('h1').textContent).toMatch(/confidentialité|privacy/i);
    expect(text).toContain('Julien Le Saux');
    expect(article(lang).querySelector('a[href="mailto:contact@jls42.org"]')).not.toBeNull();
  });

  test('elle dit que rien n’est collecté ni transmis', () => {
    expect(plain(article('fr').textContent)).toContain(
      "L'appli ne transmet aucune donnée, ni à l'éditeur ni à un tiers."
    );
    expect(plain(article('en').textContent)).toContain(
      'The app sends no data, neither to the publisher nor to any third party.'
    );
  });

  test('une page seule : ni script, et sa feuille de style tenue par son empreinte', () => {
    expect(PAGE.querySelectorAll('script')).toHaveLength(0);
    const csp = PAGE.querySelector('meta[http-equiv="Content-Security-Policy"]').content;
    expect(csp).toContain("default-src 'none'");
    const style = /<style>([\s\S]*?)<\/style>/.exec(SOURCE)[1];
    const hash = createHash('sha256').update(style).digest('base64');
    expect(csp).toContain(`style-src 'sha256-${hash}'`);
  });

  test('sa feuille de style suit les règles du dépôt (stylelint, comme les fichiers de css/)', async () => {
    const { default: stylelint } = await import('stylelint');
    const style = /<style>([\s\S]*?)<\/style>/.exec(SOURCE)[1];
    const { results } = await stylelint.lint({
      code: style,
      codeFilename: new URL('../css/confidentialite-android.css', import.meta.url).pathname,
    });
    expect(results[0].warnings.map(warning => warning.text)).toEqual([]);
  });

  test('liée depuis nulle part sur le site, ni indexée', () => {
    expect(PAGE.querySelector('meta[name="robots"]').content).toBe('noindex');
    expect(read('sitemap.xml')).not.toContain(FILE);
    for (const page of ['index.html', 'parents.html', 'modes.html', 'pwa.html', 'offline.html']) {
      expect(read(page)).not.toContain(FILE);
    }
  });
});
