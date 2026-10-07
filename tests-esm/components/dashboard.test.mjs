import { describe, beforeEach, afterEach, test, expect, jest } from '@jest/globals';
import { setTranslations } from '../../js/i18n-store.js';
import { Dashboard } from '../../js/components/dashboard.js';
import { UserState } from '../../js/core/userState.js';

describe('Dashboard.generateScoresSection (ESM)', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="dashboard-container content-card">
        <div class="achievements-section"><div id="achievements-list"></div></div>
      </div>
    `;
    localStorage.setItem('arcadeScores_default', JSON.stringify([100, 80, 60]));
    localStorage.setItem('arcadeScores_multisnake_default', JSON.stringify([50, 30]));
    localStorage.setItem('arcadeScores_multimiam_default', JSON.stringify([40, 10]));
    localStorage.setItem('arcadeScores_multimemory_default', JSON.stringify([70]));
  });

  afterEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
  });

  test('inserts a dashboard scores section with expected structure', () => {
    const container = document.querySelector('.dashboard-container');
    expect(container).toBeTruthy();

    Dashboard.generateScoresSection();

    const section = document.getElementById('dashboard-scores-section');
    expect(section).toBeTruthy();
    expect(container.firstElementChild).toBe(section);
    const block = section.querySelector('.scores-block');
    expect(block).toBeTruthy();
    const subs = block.querySelectorAll('.scores-subblock');
    expect(subs.length).toBe(2);
    const arcadeGrid = section.querySelector('.arcade-games-grid');
    expect(arcadeGrid).toBeTruthy();
    expect(arcadeGrid.querySelectorAll('.arcade-game-stats').length).toBe(4);
  });

  test('rangées à plat : logo décoratif, nom, faits « libellé → valeur » ou « Aucun score »', () => {
    setTranslations({
      sessions_count_label: 'Nombre de parties',
      best_score_label: 'Meilleur score',
      average_score_label: 'Score moyen',
      no_scores_yet: 'Aucun score',
    });
    Dashboard.generateScoresSection();

    const rows = document.querySelectorAll('.arcade-games-grid > li.score-row');
    expect(rows.length).toBe(4);
    for (const row of rows) {
      expect(row.querySelector('img.score-logo').getAttribute('alt')).toBe('');
      expect(row.querySelector('.score-row-title').textContent).toBeTruthy();
    }

    // Les scores arcade de ce test sont rangés sous l'utilisateur « default »
    const facts = document.querySelectorAll('.arcade-games-grid .score-facts');
    const empties = document.querySelectorAll('.arcade-games-grid .score-empty');
    expect(facts.length + empties.length).toBe(4);
    for (const empty of empties) expect(empty.textContent).toBe('Aucun score');
    for (const list of facts) {
      expect([...list.querySelectorAll('dt')].map(dt => dt.textContent)).toEqual([
        'Nombre de parties',
        'Meilleur score',
        'Score moyen',
      ]);
    }

    // Plus de médailles en émoji ni de cartes imbriquées
    const section = document.getElementById('dashboard-scores-section');
    expect(/🥇|🥈|🥉/u.test(section.textContent)).toBe(false);
    expect(section.querySelector('.dashboard-scores-card')).toBeNull();
  });
});

describe('Dashboard : étoiles, parcours et badges', () => {
  beforeEach(() => {
    setTranslations({
      table_of: 'Table de',
      table_stars_sr: 'Étoiles : {count} sur 3',
      stat_questions: 'Questions',
      stat_good_answers: 'Bonnes réponses',
      stat_best_streak: 'Meilleure série',
      no_badges_yet: 'Aucun badge débloqué pour le moment.',
    });
    document.body.innerHTML = `
      <div class="dashboard-container content-card">
        <div class="star-summary"><div id="dashboard-stars" class="star-grid"></div></div>
        <div class="history-section">
          <div class="stats-container">
            <div class="stat-box"><div class="stat-value" id="total-questions">0</div></div>
          </div>
        </div>
        <div class="achievements-section"><div id="achievements-list"></div></div>
      </div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('une case par table, étoiles SVG pleines ou vides, texte pour lecteur d’écran', () => {
    Dashboard.generateStarsGrid();
    const grid = document.getElementById('dashboard-stars');
    expect(grid.getAttribute('role')).toBe('list');
    const cells = grid.querySelectorAll('.star-cell');
    expect(cells.length).toBe(10);

    const cell = Dashboard._buildStarCell(7, 2, false);
    const stars = cell.querySelectorAll('svg.star-icon');
    expect(stars.length).toBe(3);
    expect(cell.querySelectorAll('svg.star-icon.is-filled').length).toBe(2);
    expect(cell.querySelector('.star-count').getAttribute('aria-hidden')).toBe('true');
    expect(cell.querySelector('.table-number').textContent).toBe('×7');
    expect(cell.querySelector('.sr-only').textContent).toBe('Table de 7. Étoiles : 2 sur 3');
    expect(/[⭐☆]/u.test(cell.textContent)).toBe(false);
    expect(cell.querySelector('.table-hint')).toBeNull();
  });

  test('une table à revoir porte un mot, pas seulement une couleur', () => {
    const cell = Dashboard._buildStarCell(4, 9, true);
    expect(cell.classList.contains('weak-table')).toBe(true);
    expect(cell.querySelectorAll('svg.star-icon.is-filled').length).toBe(3);
    expect(cell.querySelector('.table-hint').textContent).toBe('À revoir');
  });

  test('« Ton parcours » devient une liste libellé → valeur (identifiants conservés)', () => {
    Dashboard.updateStats();
    const container = document.querySelector('.stats-container');
    expect(container.querySelector('.stat-box')).toBeNull();
    const list = container.querySelector('dl.journey-list');
    expect(list).toBeTruthy();
    expect([...list.querySelectorAll('dt')].map(dt => dt.textContent)).toEqual([
      'Questions',
      'Bonnes réponses',
      'Meilleure série',
    ]);
    expect(list.querySelector('dd#total-questions').textContent).toBe('0');
    expect(list.querySelector('dd#correct-answers')).toBeTruthy();
    expect(list.querySelector('dd#best-streak')).toBeTruthy();
  });

  test('sans badge : une phrase, sans rôle de liste', () => {
    Dashboard.showAchievements();
    const list = document.getElementById('achievements-list');
    expect(list.hasAttribute('role')).toBe(false);
    expect(list.querySelector('.no-achievements').textContent).toBe(
      'Aucun badge débloqué pour le moment.'
    );
  });
});

describe('Dashboard : Chrono parmi les modes classiques', () => {
  beforeEach(() => {
    setTranslations({
      chrono_mode_title: 'Chrono',
      sessions_count_label: 'Nombre de parties',
      best_time_label: 'Meilleur temps',
      facts_to_review_label: 'Calculs à revoir',
      no_scores_yet: 'Aucun score',
    });
    document.body.innerHTML = `
      <div class="dashboard-container content-card">
        <div class="achievements-section"><div id="achievements-list"></div></div>
      </div>
    `;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });

  const chronoRow = () => {
    const rows = [...document.querySelectorAll('.classic-game-stats')];
    const row = rows.find(item => item.querySelector('.score-row-title').textContent === 'Chrono');
    return { row, last: rows.at(-1) };
  };

  test('après l’Aventure : parties, meilleur temps et calculs à revoir, tous classements', () => {
    const played = (key, durations) => ({
      key,
      count: durations.length,
      totalMs: durations.reduce((sum, ms) => sum + ms, 0),
      best: durations.map((durationMs, index) => ({ durationMs, date: index + 1 })),
      recent: durations.map((durationMs, index) => ({ durationMs, date: index + 1 })),
    });
    jest.spyOn(UserState, 'getCurrentUserData').mockReturnValue({
      chronoStats: {
        buckets: [played('7|keypad', [31000, 25400, 40000]), played('2,3|mcq', [38000, 45000])],
        basket: [
          { a: 6, b: 7, due: 2 },
          { a: 8, b: 9, due: 1 },
        ],
      },
    });
    Dashboard.generateScoresSection();
    const { row, last } = chronoRow();
    expect(row).toBe(last);
    const facts = [...row.querySelectorAll('.score-facts dt')].map(dt => [
      dt.textContent,
      dt.nextElementSibling.textContent,
    ]);
    expect(facts).toEqual([
      ['Nombre de parties', '5'],
      ['Meilleur temps', '25,4\u00a0s'],
      ['Calculs à revoir', '2'],
    ]);
  });

  test('jamais joué : « Aucun score », comme les autres modes', () => {
    jest.spyOn(UserState, 'getCurrentUserData').mockReturnValue({});
    Dashboard.generateScoresSection();
    const { row } = chronoRow();
    expect(row.querySelector('.score-empty').textContent).toBe('Aucun score');
  });
});
