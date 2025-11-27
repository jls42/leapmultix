import { describe, test, expect, beforeEach, jest } from '@jest/globals';

// Minimal mocks for dependencies used by arcade.js
jest.unstable_mockModule('../js/utils-es6.js', () => ({
  // eslint-disable-next-line no-empty-function -- Mock function for testing
  addArrowKeyNavigation: () => {},
  // eslint-disable-next-line no-empty-function -- Mock function for testing
  startBackgroundRotation: () => {},
  // eslint-disable-next-line no-empty-function -- Mock function for testing
  updateBackgroundByAvatar: () => {},
  // eslint-disable-next-line no-empty-function -- Mock function for testing
  updateCoinDisplay: () => {},
  // eslint-disable-next-line no-empty-function -- Mock function for testing
  updateWelcomeMessageUI: () => {},
  getDailyChallengeTable: () => '3',
  // eslint-disable-next-line no-empty-function -- Mock function for testing
  showMessage: () => {},
  getTranslation: k => k,
  // eslint-disable-next-line no-empty-function -- Mock function for testing
  speak: () => {},
  isVoiceEnabled: () => false,
  // eslint-disable-next-line no-empty-function -- Mock function for testing
  saveArcadeScore: () => {},
  getArcadeScores: () => [10, 8, 5],
  // eslint-disable-next-line no-empty-function -- Mock function for testing
  resetArcadeScores: () => {},
  // eslint-disable-next-line no-empty-function -- Mock function for testing
  saveArcadeScoreSnake: () => {},
  getArcadeScoresSnake: () => [9, 7],
  // eslint-disable-next-line no-empty-function -- Mock function for testing
  resetArcadeScoresSnake: () => {},
  // eslint-disable-next-line no-empty-function -- Mock function for testing
  saveArcadeScorePacman: () => {},
  getArcadeScoresPacman: () => [6, 3],
  // eslint-disable-next-line no-empty-function -- Mock function for testing
  resetArcadeScoresPacman: () => {},
  // eslint-disable-next-line no-empty-function -- Mock function for testing
  saveArcadeScoreMemory: () => {},
  getArcadeScoresMemory: () => [4, 2],
  // eslint-disable-next-line no-empty-function -- Mock function for testing
  resetArcadeScoresMemory: () => {},
}));
// eslint-disable-next-line no-empty-function -- Mock function for testing
jest.unstable_mockModule('../js/slides.js', () => ({ goToSlide: () => {} }));
// eslint-disable-next-line no-empty-function -- Mock function for testing
jest.unstable_mockModule('../js/mode-orchestrator.js', () => ({ setGameMode: async () => {} }));
// eslint-disable-next-line no-empty-function -- Mock function for testing
jest.unstable_mockModule('../js/core/audio.js', () => ({ AudioManager: { stopAll: () => {} } }));

// Dynamic-imported arcade subgames (mocked per test)
const snakeStartMock = jest.fn();
const miamStartMock = jest.fn();
jest.unstable_mockModule('../js/arcade-multisnake.js', () => ({
  startSnakeArcade: snakeStartMock,
}));
jest.unstable_mockModule('../js/arcade-multimiam.js', () => ({ startPacmanArcade: miamStartMock }));
jest.unstable_mockModule('../js/arcade-multimemory.js', () => ({ startMemoryArcade: jest.fn() }));
jest.unstable_mockModule('../js/arcade-invasion.js', () => ({
  startMultiplicationInvasion: jest.fn(),
}));

// Import after mocks
const arcade = await import('../js/arcade.js');
const game = await import('../js/game.js');

beforeEach(() => {
  document.body.innerHTML = '<div id="game"></div>';
  // Ensure requestAnimationFrame schedules callbacks in tests
  global.requestAnimationFrame = cb => setTimeout(cb, 0);
  snakeStartMock.mockClear();
  miamStartMock.mockClear();
});

describe('ESM: Arcade retry button', () => {
  test('relaunches MultiMiam on retry', async () => {
    game.gameState.gameMode = 'multimiam';
    arcade.showArcadeGameOver(0);
    const btn = document.getElementById('arcade-retry-btn');
    expect(btn).toBeTruthy();
    // Wait for listener attachment (rAF + setTimeout in arcade.js)
    await new Promise(r => setTimeout(r, 100));
    btn.click();
    // Allow async dynamic import to complete
    await new Promise(r => setTimeout(r, 100));
    expect(miamStartMock).toHaveBeenCalled();
  });

  test('relaunches MultiSnake on retry', async () => {
    game.gameState.gameMode = 'multisnake';
    arcade.showArcadeGameOver(0);
    const btn = document.getElementById('arcade-retry-btn');
    expect(btn).toBeTruthy();
    // Wait for listener attachment
    await new Promise(r => setTimeout(r, 100));
    btn.click();
    // Allow async dynamic import to complete
    await new Promise(r => setTimeout(r, 100));
    expect(snakeStartMock).toHaveBeenCalled();
  });
});
/* eslint-env jest, node */
