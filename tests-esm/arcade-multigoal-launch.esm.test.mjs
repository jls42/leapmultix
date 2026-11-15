/* eslint-env jest, node */
/**
 * Lancement de MultiGoal depuis le menu de l'Arcade (startGoalArcade) : écran du jeu,
 * minuteur du niveau, partie dans l'opération du joueur, consigne selon l'appareil, cibles
 * du niveau prêtes tout de suite, « Abandonner » (écran de fin avec le score), Accueil (partie
 * rendue sans écran de fin), relance (l'ancienne partie rendue d'abord). La partie est la
 * vraie : elle se joue ici au clavier, et ses cibles se lisent dans l'annonce du terrain.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'node:fs';
import { fakeCanvasContext } from './helpers/touch-test-helpers.mjs';

const noop = () => undefined;
const startArcadeTimer = jest.fn();
const showArcadeGameOver = jest.fn();
const stopArcadeMode = jest.fn();
jest.unstable_mockModule('../js/arcade.js', () => ({
  startArcadeTimer,
  showArcadeGameOver,
  stopArcadeMode,
  isArcadeActive: () => true,
}));
const goToSlide = jest.fn();
jest.unstable_mockModule('../js/slides.js', () => ({ goToSlide }));
const setStartingMode = jest.fn();
jest.unstable_mockModule('../js/mode-orchestrator.js', () => ({ setStartingMode }));

const store = await import('../js/i18n-store.js');
const { AudioManager } = await import('../js/core/audio.js');
const { UserState } = await import('../js/core/userState.js');
const { gameState } = await import('../js/game.js');
const { eventBus } = await import('../js/core/eventBus.js');
const { FLIGHT_MS } = await import('../js/multigoal-engine.js');
const { startGoalArcade, GoalGame, GOAL_POINTS } = await import('../js/arcade-multigoal.js');

const FR = JSON.parse(fs.readFileSync('assets/translations/fr.json', 'utf8'));

const board = () => document.getElementById('multigoal-canvas');
const press = key =>
  board().dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
const status = () => document.querySelector('.multigoal-announcer').textContent;
const banner = () => document.querySelector('.arcade-question').textContent;
const instructions = () => document.querySelector('.game-instructions p').textContent;

beforeEach(() => {
  jest.useFakeTimers();
  store.setTranslations(FR);
  store.setCurrentLanguage('fr');
  jest.spyOn(AudioManager, 'isMuted').mockReturnValue(true);
  jest.spyOn(UserState, 'getCurrentUserData').mockReturnValue({ preferredOperator: '+' });
  HTMLCanvasElement.prototype.getContext = () => fakeCanvasContext();
  const gameScreen = document.createElement('div');
  gameScreen.id = 'game';
  document.body.replaceChildren(gameScreen);
  for (const mock of [
    startArcadeTimer,
    showArcadeGameOver,
    stopArcadeMode,
    goToSlide,
    setStartingMode,
  ]) {
    mock.mockClear();
  }
  gameState.difficulty = 'difficile';
});

afterEach(() => {
  // La partie en cours est rendue (Accueil) : chaque test part sans partie
  eventBus.emit('arcade:stop');
  gameState.difficulty = undefined;
  delete globalThis.matchMedia;
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('MultiGoal : lancement depuis le menu de l’Arcade', () => {
  test('l’écran du jeu, le minuteur du niveau, la partie dans l’opération du joueur', () => {
    startGoalArcade();
    expect(stopArcadeMode).toHaveBeenCalledTimes(1);
    expect(setStartingMode).toHaveBeenCalledWith('multigoal');
    expect(gameState.gameMode).toBe('multigoal');
    expect(goToSlide).toHaveBeenCalledWith(4);
    expect(board()).toBeTruthy();
    expect(document.activeElement).toBe(board());
    expect(document.getElementById('multigoal-info-score').textContent).toBe('0');
    expect(document.getElementById('multigoal-info-lives')).toBeNull();
    expect(startArcadeTimer).toHaveBeenCalledWith(300);
    expect(banner()).toMatch(/^\d+ \+ \d+ = \?$/);
    // Le mode « en cours de lancement » se retire juste après
    expect(setStartingMode).not.toHaveBeenCalledWith(null);
    jest.advanceTimersByTime(0);
    expect(setStartingMode).toHaveBeenLastCalledWith(null);
  });

  test('la consigne à la souris ; les six cibles du niveau sont prêtes tout de suite', () => {
    startGoalArcade();
    expect(instructions()).toBe(FR.arcade_goal_instructions_desktop);
    press('ArrowRight');
    expect(status()).toMatch(/^Cible 2 sur 6\s: \d+/);
  });

  test('sur un appareil tactile : la consigne du doigt', () => {
    globalThis.matchMedia = query => ({
      matches: query === '(pointer: coarse)',
      addEventListener: noop,
      removeEventListener: noop,
    });
    startGoalArcade();
    expect(instructions()).toBe(FR.arcade_goal_instructions_touch);
  });

  test('sans niveau choisi : Moyen', () => {
    gameState.difficulty = undefined;
    startGoalArcade();
    expect(startArcadeTimer).toHaveBeenCalledWith(180);
    press('ArrowRight');
    expect(status()).toMatch(/^Cible 2 sur 4\s: \d+/);
  });

  test('la boucle du jeu fait bouger le gardien, image après image', () => {
    const step = jest.spyOn(GoalGame.prototype, 'step');
    startGoalArcade();
    jest.advanceTimersByTime(400);
    expect(step.mock.calls.length).toBeGreaterThan(5);
    expect(step.mock.calls.reduce((total, [dt]) => total + dt, 0)).toBeGreaterThan(200);
  });

  test('« Abandonner » : la partie est rendue, l’écran de fin montre son score', () => {
    const land = jest.spyOn(GoalGame.prototype, 'onGoal');
    startGoalArcade();
    // Entrée tire sur la cible visée ; après un raté ou un arrêt, on retire : le but finit
    // par entrer (cinq mauvaises cibles au plus, le gardien ne reste pas devant)
    for (let shot = 0; shot < 40 && land.mock.calls.length === 0; shot++) {
      press('Enter');
      jest.advanceTimersByTime(FLIGHT_MS + 1000);
    }
    expect(land).toHaveBeenCalledTimes(1);
    expect(document.getElementById('multigoal-info-score').textContent).toMatch(/^\d+$/);
    const cleanup = jest.spyOn(GoalGame.prototype, 'cleanup');
    document.getElementById('multigoal-abandon-btn').click();
    expect(cleanup).toHaveBeenCalledTimes(1);
    const [[score]] = showArcadeGameOver.mock.calls;
    expect(score).toBeGreaterThanOrEqual(GOAL_POINTS - 50);
    expect(score).toBeLessThanOrEqual(GOAL_POINTS);
  });

  test('Accueil (arcade:stop) : la partie est rendue, sans écran de fin', () => {
    startGoalArcade();
    eventBus.emit('arcade:stop');
    expect(showArcadeGameOver).not.toHaveBeenCalled();
    // Le terrain n'écoute plus le clavier
    press('ArrowRight');
    expect(status()).toBe('');
  });

  test('relancée sans arrêt : l’ancienne partie est rendue avant la nouvelle', () => {
    const cleanup = jest.spyOn(GoalGame.prototype, 'cleanup');
    startGoalArcade();
    const firstBoard = board();
    startGoalArcade();
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(firstBoard.isConnected).toBe(false);
    expect(document.querySelectorAll('#multigoal-canvas')).toHaveLength(1);
    press('ArrowRight');
    expect(status()).toMatch(/^Cible 2 sur 6\s: \d+/);
  });
});
