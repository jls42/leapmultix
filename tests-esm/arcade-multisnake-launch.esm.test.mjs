/* eslint-env jest, node */
/**
 * Lancement de MultiSnake depuis le menu de l'Arcade (startSnakeArcade), figé avant d'être
 * découpé en fonctions nommées : écran du jeu, minuteur du niveau, partie créée avec les
 * réglages du niveau et l'opération du joueur, « Abandonner » (écran de fin avec le score),
 * Accueil (partie rendue sans écran de fin), relance (l'ancienne partie rendue d'abord).
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';

const noop = () => undefined;
const snakes = [];
class FakeSnake {
  constructor(canvasId, mode, options) {
    Object.assign(this, { canvasId, mode, options, score: 0 });
    this.start = jest.fn();
    this.cleanup = jest.fn();
    snakes.push(this);
  }
}
jest.unstable_mockModule('../js/multisnake.js', () => ({ SnakeGame: FakeSnake }));
const startArcadeTimer = jest.fn();
const showArcadeGameOver = jest.fn();
const stopArcadeMode = jest.fn();
jest.unstable_mockModule('../js/arcade.js', () => ({
  startArcadeTimer,
  showArcadeGameOver,
  stopArcadeMode,
}));
const goToSlide = jest.fn();
jest.unstable_mockModule('../js/slides.js', () => ({ goToSlide }));
const setStartingMode = jest.fn();
jest.unstable_mockModule('../js/mode-orchestrator.js', () => ({ setStartingMode }));
jest.unstable_mockModule('../js/core/userState.js', () => ({
  UserState: { getCurrentUserData: () => ({ preferredOperator: '+' }) },
}));
const cleanupGameResources = jest.fn();
jest.unstable_mockModule('../js/utils-es6.js', () => ({
  // Exports lus par game.js
  addArrowKeyNavigation: noop,
  startBackgroundRotation: noop,
  updateBackgroundByAvatar: noop,
  updateCoinDisplay: noop,
  updateWelcomeMessageUI: noop,
  getDailyChallengeTable: () => '3',
  showMessage: noop,
  getTranslation: key => key,
  cleanupGameResources,
}));

const { startSnakeArcade } = await import('../js/arcade-multisnake.js');
const { gameState } = await import('../js/game.js');
const { eventBus } = await import('../js/core/eventBus.js');

beforeEach(() => {
  jest.useFakeTimers();
  jest.spyOn(console, 'log').mockImplementation(noop);
  document.body.innerHTML = '<div id="game"></div>';
  snakes.length = 0;
  for (const mock of [
    startArcadeTimer,
    showArcadeGameOver,
    stopArcadeMode,
    goToSlide,
    setStartingMode,
    cleanupGameResources,
  ]) {
    mock.mockClear();
  }
  gameState.difficulty = 'difficile';
});

afterEach(() => {
  // La partie en cours est rendue (Accueil) : chaque test part sans partie
  eventBus.emit('arcade:stop');
  gameState.difficulty = undefined;
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('MultiSnake : lancement depuis le menu de l’Arcade', () => {
  test('l’écran du jeu, le minuteur du niveau, la partie créée puis démarrée', () => {
    startSnakeArcade();
    expect(stopArcadeMode).toHaveBeenCalledTimes(1);
    expect(setStartingMode).toHaveBeenCalledWith('multisnake');
    expect(gameState.gameMode).toBe('multisnake');
    expect(goToSlide).toHaveBeenCalledWith(4);
    expect(document.getElementById('multisnake-canvas')).toBeTruthy();
    expect(document.getElementById('multisnake-abandon-btn')).toBeTruthy();
    expect(document.getElementById('multisnake-info-score').textContent).toBe('0');
    expect(startArcadeTimer).toHaveBeenCalledWith(120);
    expect(snakes).toHaveLength(1);
    expect(snakes[0].canvasId).toBe('multisnake-canvas');
    expect(snakes[0].mode).toBe('operation');
    expect(snakes[0].options).toEqual({
      difficulty: 'difficile',
      penaltyPoints: 100,
      tables: [2, 3, 4, 5, 6, 7, 8, 9, 10],
      distractorDistance: 'close',
      operator: '+',
    });
    expect(snakes[0].start).toHaveBeenCalledTimes(1);
    // Le mode « en cours de lancement » se retire juste après
    expect(setStartingMode).not.toHaveBeenCalledWith(null);
    jest.advanceTimersByTime(0);
    expect(setStartingMode).toHaveBeenLastCalledWith(null);
  });

  test('sans niveau choisi : Moyen', () => {
    gameState.difficulty = undefined;
    startSnakeArcade();
    expect(startArcadeTimer).toHaveBeenCalledWith(90);
    expect(snakes[0].options.difficulty).toBe('moyen');
  });

  test('« Abandonner » : la partie est rendue, l’écran de fin montre son score', () => {
    startSnakeArcade();
    snakes[0].score = 340;
    document.getElementById('multisnake-abandon-btn').click();
    expect(snakes[0].cleanup).toHaveBeenCalledTimes(1);
    expect(showArcadeGameOver).toHaveBeenCalledWith(340);
  });

  test('Accueil (arcade:stop) : la partie est rendue, sans écran de fin', () => {
    startSnakeArcade();
    eventBus.emit('arcade:stop');
    expect(snakes[0].cleanup).toHaveBeenCalledTimes(1);
    expect(showArcadeGameOver).not.toHaveBeenCalled();
  });

  test('relancée sans arrêt : l’ancienne partie est rendue avant la nouvelle', () => {
    startSnakeArcade();
    startSnakeArcade();
    expect(cleanupGameResources).toHaveBeenCalledWith(snakes[0], {
      cleanAnimations: true,
      cleanEvents: true,
      cleanTimers: true,
    });
    expect(snakes).toHaveLength(2);
    expect(snakes[1].start).toHaveBeenCalledTimes(1);
  });
});
