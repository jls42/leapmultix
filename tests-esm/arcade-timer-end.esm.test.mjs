/* eslint-env jest, node */
/**
 * Fin au temps d'une partie d'Arcade (la seule fin de MultiPop et de MultiGoal en dehors de
 * « Abandonner ») : quand le compte à rebours arrive à zéro, le score enregistré et montré à
 * l'écran de fin est celui que le bandeau affiche, une seule fois.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';

const saveArcadeScore = jest.fn();
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
  saveArcadeScore,
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
jest.unstable_mockModule('../js/core/audio.js', () => ({
  AudioManager: { stopAll: noop, playSound: noop },
}));

const arcade = await import('../js/arcade.js');
const { noteArcadePlay } = await import('../js/arcade-session.js');
const game = await import('../js/game.js');

/** Écran d'un jeu en cours : le score du bandeau et la case du temps */
function showBoard(mode, score) {
  const board = document.createElement('div');
  board.id = 'game';
  const scoreEl = document.createElement('span');
  scoreEl.id = `${mode}-info-score`;
  scoreEl.textContent = String(score);
  const timer = document.createElement('span');
  timer.id = 'arcade-info-timer';
  board.append(scoreEl, timer);
  document.body.replaceChildren(board);
  return scoreEl;
}

beforeEach(() => {
  jest.useFakeTimers();
  saveArcadeScore.mockClear();
  jest.spyOn(console, 'debug').mockImplementation(() => {});
});

afterEach(() => {
  arcade.stopArcadeMode();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('Arcade : la fin au temps', () => {
  test.each([
    ['multipop', 260],
    ['multigoal', 1150],
  ])('%s : à zéro, le score affiché est enregistré et montré', (mode, score) => {
    game.gameState.gameMode = mode;
    const scoreEl = showBoard(mode, 0);
    arcade.startArcadeTimer(3);
    noteArcadePlay();
    scoreEl.textContent = String(score);

    jest.advanceTimersByTime(2000);
    expect(saveArcadeScore).not.toHaveBeenCalled();
    expect(document.querySelector('.arcade-gameover')).toBeNull();

    jest.advanceTimersByTime(1000);
    expect(saveArcadeScore).toHaveBeenCalledTimes(1);
    expect(saveArcadeScore.mock.calls[0].slice(0, 3)).toEqual([score, mode, '×']);
    expect(document.querySelector('.arcade-final-score strong').textContent).toBe(String(score));

    // Le temps ne continue pas après la fin : rien n'est enregistré une seconde fois
    jest.advanceTimersByTime(5000);
    expect(saveArcadeScore).toHaveBeenCalledTimes(1);
  });

  test('une partie sans aucun coup finit au temps sans être enregistrée', () => {
    game.gameState.gameMode = 'multipop';
    showBoard('multipop', 0);
    arcade.startArcadeTimer(2);
    jest.advanceTimersByTime(2000);
    expect(saveArcadeScore).not.toHaveBeenCalled();
    expect(document.querySelector('.arcade-gameover')).toBeTruthy();
  });
});
