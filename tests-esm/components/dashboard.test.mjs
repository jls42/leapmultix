import { describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import { setTranslations } from '../../js/i18n-store.js';
import { Dashboard } from '../../js/components/dashboard.js';

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
