/* eslint-env jest, node */
/**
 * Pages juridiques (index.html : #slide9 mentions légales, #slide10 politique de confidentialité) :
 * leur date de révision suit leur texte. Un texte modifié sans nouvelle date ferait dire à la page
 * qu'elle n'a pas changé depuis l'ancienne date (constaté le 09/10/2026 : la politique citait la
 * corbeille et l'événement de la voix depuis la veille, toujours « mise à jour le 15 septembre 2025 »).
 *
 * Le verrou tests-esm/legal-pages.lock.json garde, pour chaque page, ses révisions : une date en fr,
 * en, es et l'empreinte du texte juridique (sans les balises : changer un niveau de titre ne compte
 * pas, changer un mot si). Texte changé : ce test échoue et donne la nouvelle empreinte ; ajouter
 * une révision avec la date du jour, puis la mettre dans index.html et dans la clé de la page.
 */
import { describe, test, expect } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const LOCK = JSON.parse(read('tests-esm/legal-pages.lock.json'));
const PAGE = new DOMParser().parseFromString(read('index.html'), 'text/html');
const LANGS = ['fr', 'en', 'es'];
const TRANSLATIONS = new Map(
  LANGS.map(lang => [
    lang,
    new Map(Object.entries(JSON.parse(read(`assets/translations/${lang}.json`)))),
  ])
);
const PAGES = ['slide9', 'slide10'];

// Espaces, insécables compris (\s les couvre), et retours à la ligne ramenés à une espace simple
const plain = text => String(text).replaceAll(/\s+/g, ' ').trim();
const fingerprint = text => createHash('sha256').update(text).digest('hex');
const entry = id => new Map(Object.entries(LOCK)).get(id);
const lastRevision = id => entry(id).revisions.at(-1);

describe.each(PAGES)('page juridique #%s', id => {
  const section = PAGE.getElementById(id);

  test('le texte est celui de la dernière révision du verrou', () => {
    const text = plain(section.querySelector('.legal-body').textContent);
    const { titre } = entry(id);
    const current = fingerprint(text);
    if (current !== lastRevision(id).empreinte) {
      throw new Error(
        `Le texte de « ${titre} » a changé : ajoutez une révision au verrou ` +
          `(tests-esm/legal-pages.lock.json) avec la date du jour en fr, en, es et l'empreinte ` +
          `${current}, puis mettez cette date dans index.html et dans la clé ${entry(id).cle}.`
      );
    }
    expect(current).toBe(lastRevision(id).empreinte);
  });

  test('la date affichée est celle de la dernière révision, dans les trois langues', () => {
    const { cle } = entry(id);
    const shown = section.querySelector('.last-updated');
    expect(shown.dataset.translate).toBe(cle);
    const dates = new Map(Object.entries(lastRevision(id).date));
    expect(plain(shown.textContent)).toBe(plain(dates.get('fr')));
    for (const lang of LANGS) {
      expect(TRANSLATIONS.get(lang).get(cle)).toBe(dates.get(lang));
    }
  });

  test('chaque révision a sa propre date : un texte changé ne garde pas l’ancienne', () => {
    const dates = entry(id).revisions.map(revision => revision.date.fr);
    expect(new Set(dates).size).toBe(dates.length);
  });
});

test('les deux pages ont chacune leur clé de date (l’une peut changer sans l’autre)', () => {
  const keys = PAGES.map(id => entry(id).cle);
  expect(new Set(keys).size).toBe(PAGES.length);
});
