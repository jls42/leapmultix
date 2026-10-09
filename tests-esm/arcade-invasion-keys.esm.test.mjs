/* eslint-env jest, node */
/**
 * MultiInvaders : la barre d'espace tire depuis le plateau, pas depuis un bouton. Sur
 * « Reprendre » (voile de pause ou bandeau), elle relançait la partie ET tirait aussitôt
 * (mesuré dans Chrome) ; en pause, elle ne tire pas.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { fakeCanvasContext } from './helpers/touch-test-helpers.mjs';

const noop = () => undefined;
const playSound = jest.fn();
jest.unstable_mockModule('../js/utils-es6.js', () => ({
  // Lus par game.js (importé par arcade.js)
  addArrowKeyNavigation: noop,
  startBackgroundRotation: noop,
  updateBackgroundByAvatar: noop,
  updateCoinDisplay: noop,
  updateWelcomeMessageUI: noop,
  getDailyChallengeTable: () => '3',
  showMessage: noop,
  // Lus par arcade.js et arcade-invasion.js
  getTranslation: k => k,
  cleanupGameResources: noop,
  speak: noop,
  // Le tir se fait entendre : c'est lui que le test compte
  isVoiceEnabled: () => true,
  playSound,
  showArcadePoints: noop,
  updateInfoBar: noop,
  showArcadeMessage: noop,
  saveArcadeScore: noop,
  getArcadeScores: () => [],
  resetArcadeScores: noop,
  saveArcadeScoreSnake: noop,
  getArcadeScoresSnake: () => [],
  resetArcadeScoresSnake: noop,
  saveArcadeScorePacman: noop,
  getArcadeScoresPacman: () => [],
  resetArcadeScoresPacman: noop,
  saveArcadeScoreMemory: noop,
  getArcadeScoresMemory: () => [],
  resetArcadeScoresMemory: noop,
}));
jest.unstable_mockModule('../js/slides.js', () => ({ goToSlide: noop }));
jest.unstable_mockModule('../js/mode-orchestrator.js', () => ({ setGameMode: async () => {} }));
jest.unstable_mockModule('../js/core/audio.js', () => ({ AudioManager: { stopAll: noop } }));

const { startMultiplicationInvasion } = await import('../js/arcade-invasion.js');
const { stopArcadeMode } = await import('../js/arcade.js');
const pause = await import('../js/arcade-time.js');

const space = target =>
  target.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
const shots = () => playSound.mock.calls.filter(([name]) => name === 'shoot').length;

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = () => fakeCanvasContext();
  jest.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(() => 1);
  const game = document.createElement('div');
  game.id = 'game';
  document.body.replaceChildren(game);
  startMultiplicationInvasion();
  playSound.mockClear();
});

afterEach(() => {
  stopArcadeMode();
  jest.restoreAllMocks();
});

describe('MultiInvaders : la barre d’espace', () => {
  test('tire depuis le plateau', () => {
    space(document.getElementById('arcade-canvas'));
    expect(shots()).toBe(1);
  });

  test('ne tire pas en pause', () => {
    pause.pauseArcade();
    space(document.getElementById('arcade-canvas'));
    expect(shots()).toBe(0);
  });

  test('sur « Reprendre » ou un autre bouton, elle reste au bouton : aucun tir', () => {
    pause.pauseArcade();
    space(document.querySelector('.arcade-resume-btn'));
    pause.resumeArcade();
    space(document.querySelector('.arcade-pause-btn'));
    space(document.getElementById('arcade-abandon-btn'));
    expect(shots()).toBe(0);
  });
});
