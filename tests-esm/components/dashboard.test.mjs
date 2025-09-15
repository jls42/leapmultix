import { describe, beforeEach, afterEach, test, expect } from '@jest/globals';
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
});
/* eslint-env jest, node */
