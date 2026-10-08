/* eslint-env jest, node */
/**
 * Minuteurs de l'Arcade (WCAG 2.2.1). Avant, le temps décomptait sans arrêt possible :
 * le seul bouton du jeu était « Abandonner », et la touche P ne faisait rien.
 * - « Pause » (bouton à côté du temps, ou touche P) arrête le temps et pose un voile sur le
 *   plateau ; « Reprendre » (ou P) relance la partie. Jamais toute seule.
 * - Un onglet masqué met la partie en pause.
 * - Une partie sans limite de temps n'a ni compte à rebours, ni fin au temps.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';

const noop = () => undefined;
jest.unstable_mockModule('../js/utils-es6.js', () => ({
  // Exports lus par game.js (importé par arcade.js)
  addArrowKeyNavigation: noop,
  startBackgroundRotation: noop,
  updateBackgroundByAvatar: noop,
  updateCoinDisplay: noop,
  updateWelcomeMessageUI: noop,
  getDailyChallengeTable: () => '3',
  showMessage: noop,
  getTranslation: k => k,
  speak: noop,
  isVoiceEnabled: () => false,
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

const arcade = await import('../js/arcade.js');
const { isArcadePaused } = await import('../js/arcade-time.js');

let hidden = false;
let canvas;

const timer = () => document.getElementById('arcade-info-timer').textContent;
const pauseButton = () => document.querySelector('.arcade-pause-btn');
const overlay = () => document.querySelector('.arcade-pause-overlay');
const pressKey = (key, options = {}, target = document.body) =>
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...options }));
const seconds = n => jest.advanceTimersByTime(n * 1000);

/** Bandeau (temps) et zone de jeu (canevas, « Abandonner »), comme le gabarit commun */
function buildArcadeScreen() {
  const game = document.createElement('div');
  game.id = 'game';
  const time = document.createElement('span');
  time.id = 'arcade-info-timer';
  const stage = document.createElement('div');
  stage.className = 'arcade-game-ui';
  canvas = document.createElement('canvas');
  canvas.tabIndex = 0;
  const abandon = document.createElement('button');
  abandon.textContent = 'Abandonner';
  stage.append(canvas, abandon);
  game.append(time, stage);
  document.body.replaceChildren(game);
}

beforeEach(() => {
  jest.useFakeTimers();
  hidden = false;
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden });
  buildArcadeScreen();
});

afterEach(() => {
  arcade.stopArcadeMode();
  jest.useRealTimers();
});

describe('Arcade : pause du temps', () => {
  test('« Pause » arrête le temps et cache le plateau ; « Reprendre » relance la partie', () => {
    arcade.startArcadeTimer(120);
    seconds(3);
    expect(timer()).toBe('01:57');
    pauseButton().click();
    expect(isArcadePaused()).toBe(true);
    seconds(30);
    expect(timer()).toBe('01:57');
    const resume = overlay().querySelector('.arcade-resume-btn');
    expect(document.activeElement).toBe(resume);
    expect(pauseButton().textContent).toBe('Reprendre');
    resume.click();
    expect(overlay()).toBeNull();
    expect(document.activeElement).toBe(canvas);
    seconds(1);
    expect(timer()).toBe('01:56');
  });

  test('la touche P met en pause puis relance ; Ctrl+P et P dans un champ, non', () => {
    arcade.startArcadeTimer(60);
    pressKey('p', { ctrlKey: true });
    const field = document.createElement('input');
    document.body.appendChild(field);
    pressKey('p', {}, field);
    expect(isArcadePaused()).toBe(false);
    pressKey('P');
    expect(isArcadePaused()).toBe(true);
    pressKey('p');
    expect(isArcadePaused()).toBe(false);
  });

  test('un onglet masqué met la partie en pause, qui attend le retour de l’enfant', () => {
    arcade.startArcadeTimer(60);
    hidden = true;
    document.dispatchEvent(new Event('visibilitychange'));
    seconds(20);
    hidden = false;
    document.dispatchEvent(new Event('visibilitychange'));
    seconds(5);
    expect(isArcadePaused()).toBe(true);
    expect(timer()).toBe('01:00');
  });

  test('le temps à zéro termine toujours la partie quand elle n’est pas en pause', () => {
    arcade.startArcadeTimer(2);
    seconds(2);
    expect(document.querySelector('.arcade-gameover')).not.toBeNull();
    expect(pauseButton()).toBeNull();
  });

  test('sans limite de temps : ni compte à rebours, ni pause, ni fin au temps', () => {
    arcade.startArcadeTimer(Infinity);
    // Le texte traduit de « Sans limite » (traductions simulées : la clé)
    expect(timer()).toBe('arcade_no_time_limit_short');
    expect(pauseButton()).toBeNull();
    seconds(600);
    pressKey('p');
    expect(isArcadePaused()).toBe(false);
    expect(document.querySelector('.arcade-gameover')).toBeNull();
  });

  test('la partie finie, plus de bouton, de voile ni de touche P', () => {
    arcade.startArcadeTimer(60);
    pressKey('p');
    arcade.stopArcadeMode();
    expect(isArcadePaused()).toBe(false);
    expect(pauseButton()).toBeNull();
    expect(overlay()).toBeNull();
    pressKey('p');
    expect(isArcadePaused()).toBe(false);
  });
});
