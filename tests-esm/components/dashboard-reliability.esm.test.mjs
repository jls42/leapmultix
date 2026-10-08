/* eslint-env jest, node */
/**
 * Tableau de bord fiable : ce qu'il affiche correspond à ce qui est enregistré, dans la langue
 * du jeu. Vrai UserManager (profil normalisé à chaque lecture), vrais modules, markup de
 * index.html.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { legacyPlayers, seedLegacyStorage } from '../helpers/legacy-profiles.mjs';

const store = await import('../../js/i18n-store.js');
const { Dashboard } = await import('../../js/components/dashboard.js');
const { UserManager } = await import('../../js/userManager.js');
const read = path => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const LANG = Object.fromEntries(
  ['fr', 'en', 'es'].map(lang => [lang, JSON.parse(read(`assets/translations/${lang}.json`))])
);
const DASHBOARD_HTML = read('index.html').match(/<section id="slide7"[\s\S]*?<\/section>/)[0];

const txt = el => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();

function show(profile, lang = 'fr') {
  store.setTranslations(LANG[lang]);
  store.setCurrentLanguage(lang);
  UserManager._players = { Test: profile };
  UserManager._currentUser = 'Test';
  Dashboard.show();
}

const rowFacts = title => {
  const row = [...document.querySelectorAll('li.score-row')].find(
    item => txt(item.querySelector('.score-row-title')) === title
  );
  if (!row) return null;
  return (
    txt(row.querySelector('.score-empty')) ||
    [...row.querySelectorAll('.score-facts > div')].map(div => [
      txt(div.querySelector('dt')),
      txt(div.querySelector('dd')),
    ])
  );
};

beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = DASHBOARD_HTML;
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
  UserManager._players = {};
  UserManager._currentUser = null;
  store.setCurrentLanguage('fr');
  localStorage.clear();
  document.body.innerHTML = '';
});

describe('Tableau de bord : accords et nombres dans la langue du jeu', () => {
  test.each([
    ['fr', 0, '0 étoile au total'],
    ['fr', 1, '1 étoile au total'],
    ['fr', 2, '2 étoiles au total'],
    ['en', 1, '1 total star'],
    ['en', 0, '0 total stars'],
    ['es', 1, '1 estrella en total'],
    ['es', 3, '3 estrellas en total'],
  ])('%s, %i étoile(s) : « %s »', (lang, stars, expected) => {
    show({ starsByTable: stars ? { 1: stars } : {} }, lang);
    expect(txt(document.querySelector('.stars-summary'))).toBe(expected);
  });

  test('les grands nombres ont leur séparateur de milliers : 1 500 en français, 1,500 en anglais', () => {
    seedLegacyStorage(localStorage);
    const zoe = legacyPlayers()['Zoé'];
    show(zoe, 'fr');
    expect(rowFacts('MultiInvaders')[1]).toEqual(['Meilleur score', '1 500']);
    show(zoe, 'en');
    expect(rowFacts('MultiInvaders')[1]).toEqual(['Best score', '1,500']);
  });

  test('un badge inconnu est signalé dans la console avec un texte de chaque langue', () => {
    for (const lang of ['fr', 'en', 'es']) {
      expect([lang, typeof LANG[lang].badge_info_not_found]).toEqual([lang, 'string']);
      expect(LANG[lang].badge_info_not_found).toContain('{badgeId}');
    }
    show({ unlockedBadges: ['badge_disparu'] });
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('badge_disparu'));
  });
});

const modeStats = modes => ({
  v: 1,
  modes,
  imported: { questions: 0, correct: 0 },
  arcadeTop5: {},
  review: {},
});
const session = (durationMs, date = 1) => ({ durationMs, date });
const played = (key, durations) => ({
  key,
  count: durations.length,
  totalMs: durations.reduce((sum, ms) => sum + ms, 0),
  best: durations.map(ms => session(ms)).sort((x, y) => x.durationMs - y.durationMs),
  recent: durations.map(ms => session(ms)),
});

describe('Tableau de bord : ce qui est enregistré, rien de moins', () => {
  test('Arcade : toutes les parties comptent, la moyenne porte sur toutes (n°5)', () => {
    show({
      modeStats: modeStats({ multisnake: { '×': { games: 8, total: 360, best: 80 } } }),
    });
    expect(rowFacts('MultiSnake')).toEqual([
      ['Nombre de parties', '8'],
      ['Meilleur score', '80'],
      ['Score moyen', '45'],
    ]);
  });

  test('Arcade : un surnom changé ne fait plus disparaître les scores (n°9)', () => {
    localStorage.setItem('arcadeScores_Zozo', JSON.stringify([999]));
    show({
      nickname: 'Zozo',
      modeStats: modeStats({ invasion: { '×': { games: 2, total: 300, best: 200 } } }),
    });
    expect(rowFacts('MultiInvaders')[0]).toEqual(['Nombre de parties', '2']);
  });

  test('« Ton parcours » compte aussi les réponses de Chrono (n°7)', () => {
    show({
      modeStats: modeStats({
        quiz: { '×': { questions: 10, correct: 8 } },
        chrono: { '×': { games: 1, questions: 12, correct: 10 } },
      }),
      bestStreak: 10,
    });
    const journey = [...document.querySelectorAll('.journey-list .journey-row dd')].map(txt);
    expect(journey).toEqual(['22', '18', '10']);
  });

  test('Chrono (D8) : une rangée, ses comptes détaillés par opération comme les autres modes, un temps par opération', () => {
    show({
      modeStats: modeStats({ chrono: { '×': { games: 3 }, '+': { games: 2 } } }),
      chronoStats: { buckets: [played('1,2,3,4,5,6,7,8,9,10|keypad', [25400, 30000])], basket: [] },
      chronoStatsByOperator: {
        '+': { buckets: [played('1,2,3,4,5,6,7,8,9,10|mcq', [18200])], basket: [{ a: 8, b: 7 }] },
      },
    });
    expect(rowFacts('Chrono')).toEqual([
      ['Nombre de parties', '5 (×Multiplication 3 · +Addition 2)'],
      ['Meilleur temps', '×Multiplication 25,4 s · +Addition 18,2 s'],
      ['Calculs à revoir', '1 (×Multiplication 0 · +Addition 1)'],
    ]);
  });

  test('Chrono : une opération qui n’a qu’un calcul ajouté à la main compte pour 0 partie', () => {
    show({
      modeStats: modeStats({ chrono: { '×': { games: 2 } } }),
      chronoStats: { buckets: [played('1,2,3,4,5,6,7,8,9,10|keypad', [25400])], basket: [] },
      chronoStatsByOperator: { '+': { buckets: [], basket: [{ a: 8, b: 7 }] } },
    });
    expect(rowFacts('Chrono')).toEqual([
      ['Nombre de parties', '2 (×Multiplication 2 · +Addition 0)'],
      ['Meilleur temps', '×Multiplication 25,4 s'],
      ['Calculs à revoir', '1 (×Multiplication 0 · +Addition 1)'],
    ]);
  });

  test('Défi : une opération jouée sans partie finie n’a pas de record à afficher', () => {
    show({
      modeStats: modeStats({
        challenge: {
          '×': { games: 1, questions: 12, correct: 10, best: { hard: 90 } },
          '−': { games: 1, questions: 3, correct: 2, best: {} },
        },
      }),
    });
    expect(rowFacts('Défi')).toEqual([
      ['Nombre de parties', '2 (×Multiplication 1 · −Soustraction 1)'],
      ['Meilleur score', '×Multiplication 90 (Difficile)'],
    ]);
  });

  test('Chrono : le temps garde son signe quand une autre opération a été jouée sans temps', () => {
    show({
      modeStats: modeStats({ chrono: { '×': { games: 2 }, '+': { games: 1 } } }),
      chronoStats: { buckets: [played('1,2,3,4,5,6,7,8,9,10|keypad', [25400])], basket: [] },
    });
    expect(rowFacts('Chrono')[1]).toEqual(['Meilleur temps', '×Multiplication 25,4 s']);
  });

  test('un signe ne se sépare pas de sa valeur, une ligne ne commence pas par « · »', () => {
    show({
      modeStats: modeStats({ chrono: { '×': { games: 1 }, '−': { games: 1 } } }),
      chronoStats: { buckets: [played('1,2,3,4,5,6,7,8,9,10|keypad', [19400])], basket: [] },
      chronoStatsByOperator: {
        '−': { buckets: [played('1,2,3,4,5,6,7,8,9,10|keypad', [37900])], basket: [] },
      },
    });
    const best = [...document.querySelectorAll('li.score-row .score-facts > div')].find(
      div => txt(div.querySelector('dt')) === 'Meilleur temps'
    );
    const dd = best.querySelector('dd');
    expect([...dd.querySelectorAll('.score-part')].map(txt)).toEqual([
      '×Multiplication 19,4 s',
      '−Soustraction 37,9 s',
    ]);
    expect(dd.textContent).toContain(' · ');
  });

  test('parties d’avant la mise à jour, sans opération, à côté de parties notées', () => {
    show({
      modeStats: modeStats({
        challenge: {
          '×': { games: 1, questions: 12, correct: 10, best: { hard: 90 } },
          '?': { games: 2, questions: 0, correct: 0, best: { medium: 140 } },
        },
      }),
    });
    expect(rowFacts('Défi')).toEqual([
      ['Nombre de parties', '3 (×Multiplication 1 · avant la mise à jour 2)'],
      ['Meilleur score', '×Multiplication 90 (Difficile) · avant la mise à jour 140 (Moyen)'],
    ]);
  });

  test('Défi du jour : la rangée n’apparaît qu’après un premier défi réussi', () => {
    show({ modeStats: modeStats({ quiz: { '+': { questions: 3, correct: 3 } } }) });
    expect(rowFacts('Défi du jour')).toBeNull();
    show({ dailyChallengesCompleted: 1, modeStats: modeStats({}) });
    expect(rowFacts('Défi du jour')).toEqual([['Défis réussis', '1']]);
  });

  test('Aventure en + : ses niveaux ne s’inscrivent pas dans la grille des tables', () => {
    show({
      adventureProgressByOperator: {
        '+': { 1: { completed: true, stars: 3 }, 3: { completed: true, stars: 3 } },
      },
    });
    const filled = [...document.querySelectorAll('#dashboard-stars .star-cell')].map(
      cell => cell.querySelectorAll('.star-icon.is-filled').length
    );
    expect(filled.every(stars => stars === 0)).toBe(true);
    expect(txt(document.querySelector('.stars-summary'))).toBe('6 étoiles au total');
    expect(rowFacts('Aventure')).toEqual([
      ['Niveaux complétés', '2'],
      ['Étoiles', '6'],
    ]);
  });
});
