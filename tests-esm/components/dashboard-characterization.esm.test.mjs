/* eslint-env jest, node */
/**
 * Caractérisation du tableau de bord sur des profils déjà enregistrés (vrai UserManager,
 * vrais modules) : ce qu'affichent aujourd'hui Zoé (× seulement, depuis 2025), Léa (× et +)
 * et Tom (jamais joué). Mêmes valeurs que dans Chrome avec le même instantané. Une valeur qui
 * change ici doit correspondre à une correction voulue et testée à part : chaque changement
 * porte en commentaire le numéro de l'anomalie corrigée (cartographie du 08/10).
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { seedLegacyStorage, legacyPlayers } from '../helpers/legacy-profiles.mjs';

const store = await import('../../js/i18n-store.js');
const { Dashboard } = await import('../../js/components/dashboard.js');
const { UserManager } = await import('../../js/userManager.js');
const FR = JSON.parse(
  readFileSync(new URL('../../assets/translations/fr.json', import.meta.url), 'utf8')
);

const DASHBOARD_HTML = readFileSync(new URL('../../index.html', import.meta.url), 'utf8').match(
  /<section id="slide7"[\s\S]*?<\/section>/
)[0];

// Espaces (insécables compris) ramenés à une espace simple, comme dans la capture Chrome
const txt = el => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();

/** Même relevé que la capture dans Chrome */
function readDashboard() {
  return {
    nickname: txt(document.getElementById('dashboard-nickname')),
    total: txt(document.querySelector('.stars-summary')),
    grid: [...document.querySelectorAll('#dashboard-stars .star-cell')].map(cell => [
      txt(cell.querySelector('.table-number')),
      cell.querySelectorAll('.star-icon.is-filled').length,
      txt(cell.querySelector('.table-hint')),
    ]),
    journey: [...document.querySelectorAll('.journey-list .journey-row')].map(row => [
      txt(row.querySelector('dt')),
      txt(row.querySelector('dd')),
    ]),
    groups: [...document.querySelectorAll('#dashboard-scores-section .scores-subblock')].map(
      group => [
        txt(group.querySelector('.scores-subtitle')),
        [...group.querySelectorAll('li.score-row')].map(row => [
          txt(row.querySelector('.score-row-title')),
          txt(row.querySelector('.score-empty')) ||
            [...row.querySelectorAll('.score-facts > div')].map(div => [
              txt(div.querySelector('dt')),
              txt(div.querySelector('dd')),
            ]),
        ]),
      ]
    ),
    badges: [...document.querySelectorAll('#achievements-list .achievement-name')].map(txt),
    noBadge: txt(document.querySelector('#achievements-list .no-achievements')),
  };
}

function showFor(name) {
  UserManager._players = legacyPlayers();
  UserManager._currentUser = name;
  Dashboard.show();
  return readDashboard();
}

beforeEach(() => {
  store.setTranslations(FR);
  store.setCurrentLanguage('fr');
  localStorage.clear();
  seedLegacyStorage(localStorage);
  document.body.innerHTML = DASHBOARD_HTML;
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
  UserManager._players = {};
  UserManager._currentUser = null;
  localStorage.clear();
  document.body.innerHTML = '';
});

const NO_SCORE = 'Aucun score';

describe('Tableau de bord : Zoé, × seulement, depuis 2025', () => {
  test('en-tête, grille, parcours, scores et succès', () => {
    const view = showFor('Zoé');
    expect(view.nickname).toBe('Zoé');
    expect(view.total).toBe('9 étoiles au total');
    expect(view.grid).toEqual([
      ['×1', 3, ''],
      ['×2', 2, ''],
      ['×3', 0, ''],
      ['×4', 0, ''],
      ['×5', 3, ''],
      ['×6', 0, ''],
      // v37 : « À revoir » sur les 20 dernières réponses de la table (anomalie n°18) : la
      // table de 7, rattrapée depuis 2026, ne l'est plus ; la table de 8 l'est toujours
      ['×7', 0, ''],
      ['×8', 0, 'À revoir'],
      ['×9', 0, ''],
      ['×10', 1, 'À revoir'],
    ]);
    expect(view.journey).toEqual([
      ['Questions', '506'],
      ['Bonnes réponses', '377'],
      ['Meilleure série', '10'],
    ]);
    expect(view.groups).toEqual([
      [
        'Modes classiques',
        [
          [
            'Quiz',
            // v37 : les 31 quiz, plus seulement les 20 derniers (anomalie n°6)
            [
              ['Questions', '310'],
              ['Bonnes réponses', '242'],
            ],
          ],
          [
            'Défi',
            // v37 : la difficulté du meilleur score (anomalie n°13)
            [
              ['Nombre de parties', '9'],
              ['Meilleur score', '210 (Difficile)'],
            ],
          ],
          [
            'Aventure',
            [
              ['Niveaux complétés', '4'],
              ['Étoiles', '9'],
            ],
          ],
          [
            'Chrono',
            [
              ['Nombre de parties', '9'],
              ['Meilleur temps', '19,4 s'],
              ['Calculs à revoir', '3'],
            ],
          ],
          // v37 : deux rangées de plus, la Découverte et le Défi du jour (décision « chaque mode »)
          ['Découverte', [['Déjà exploré', '2 tables sur 10']]],
          ['Défi du jour', [['Défis réussis', '4']]],
        ],
      ],
      [
        'Mode Arcade',
        [
          [
            'MultiInvaders',
            [
              ['Nombre de parties', '5'],
              // v37 : séparateur de milliers de la langue (anomalie n°17)
              ['Meilleur score', '1 500'],
              ['Score moyen', '760'],
            ],
          ],
          [
            'MultiMiam',
            [
              ['Nombre de parties', '5'],
              ['Meilleur score', '640'],
              ['Score moyen', '348'],
            ],
          ],
          [
            'MultiMemory',
            [
              ['Nombre de parties', '2'],
              ['Meilleur score', '140'],
              ['Score moyen', '130'],
            ],
          ],
          [
            'MultiSnake',
            [
              ['Nombre de parties', '3'],
              ['Meilleur score', '900'],
              ['Score moyen', '483'],
            ],
          ],
        ],
      ],
    ]);
    expect(view.badges).toEqual([
      'Apprenti du Quiz',
      'Premiers pas',
      'Quiz parfait',
      'Défi quotidien relevé',
      'Chronomètre accepté',
    ]);
  });
});

describe('Tableau de bord : Léa, × et +, surnom changé', () => {
  test('ce qui s’affiche aujourd’hui', () => {
    const view = showFor('Léa');
    expect(view.nickname).toBe('Léa B.');
    // v37 : les étoiles de l'Aventure en + comptent aussi, comme pour le badge (anomalie n°2)
    expect(view.total).toBe('12 étoiles au total');
    expect(view.grid.map(([table, stars]) => `${table}:${stars}`)).toEqual([
      '×1:3',
      '×2:3',
      '×3:0',
      '×4:0',
      '×5:0',
      '×6:0',
      '×7:0',
      '×8:0',
      '×9:0',
      '×10:0',
    ]);
    expect(view.journey).toEqual([
      ['Questions', '138'],
      ['Bonnes réponses', '103'],
      ['Meilleure série', '9'],
    ]);
    const [classic, arcade] = view.groups;
    // v37 : × et + jouées, chaque rangée se détaille par opération ; le signe se lit, son nom
    // (lecteurs d'écran) suit dans le texte. Défi : parties d'avant la mise à jour, rangées sans
    // opération, donc sans détail. Aventure : enfin la vraie progression (anomalie n°1)
    expect(classic[1].map(([title, facts]) => [title, facts])).toEqual([
      [
        'Quiz',
        [
          ['Questions', '40 (×Multiplication 20 · +Addition 20)'],
          ['Bonnes réponses', '27 (×Multiplication 12 · +Addition 15)'],
        ],
      ],
      [
        'Défi',
        [
          ['Nombre de parties', '2'],
          ['Meilleur score', '140 (Moyen)'],
        ],
      ],
      [
        'Aventure',
        [
          ['Niveaux complétés', '5 (×Multiplication 2 · +Addition 3)'],
          ['Étoiles', '12 (×Multiplication 6 · +Addition 6)'],
        ],
      ],
      [
        'Chrono',
        [
          ['Nombre de parties', '2'],
          ['Meilleur temps', '51,7 s'],
          ['Calculs à revoir', '1'],
        ],
      ],
      ['Découverte', [['Déjà exploré', '2 niveaux sur 3']]],
    ]);
    expect(arcade[1]).toEqual([
      [
        'MultiInvaders',
        [
          ['Nombre de parties', '2'],
          ['Meilleur score', '300'],
          ['Score moyen', '150'],
        ],
      ],
      ['MultiMiam', NO_SCORE],
      ['MultiMemory', NO_SCORE],
      [
        'MultiSnake',
        [
          ['Nombre de parties', '1'],
          ['Meilleur score', '200'],
          ['Score moyen', '200'],
        ],
      ],
    ]);
  });
});

describe('Tableau de bord : Tom, jamais joué', () => {
  test('une phrase d’accueil plutôt qu’une page de zéros ; la grille et les badges restent', () => {
    const view = showFor('Tom');
    // v37 : accord au pluriel du français, « 0 étoile » (anomalie n°17)
    expect(view.total).toBe('0 étoile au total');
    expect(view.grid.every(([, stars, hint]) => stars === 0 && hint === '')).toBe(true);
    // v37 : « Ton parcours » (que des zéros) et les scores (que des « Aucun score ») laissent
    // la place à une phrase d'accueil (question « nouveau joueur » de la cartographie)
    expect(txt(document.querySelector('.dashboard-welcome'))).toBe(
      'Joue une partie : tes progrès s’afficheront ici.'
    );
    expect(document.querySelector('.history-section').hidden).toBe(true);
    expect(view.groups).toEqual([]);
    expect(view.noBadge).toBe('Aucun badge débloqué pour le moment.');
  });
});
