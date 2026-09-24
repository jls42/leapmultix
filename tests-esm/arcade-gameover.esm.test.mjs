/* eslint-env jest, node */
import { describe, test, expect, beforeEach, jest } from '@jest/globals';

const saveArcadeScore = jest.fn();
const resetArcadeScores = jest.fn();
let storedScores = [120, 80];
const noop = () => undefined;
const speak = jest.fn();
let voiceOn = false;

jest.unstable_mockModule('../js/utils-es6.js', () => ({
  // Exports lus par game.js (importé par arcade.js)
  addArrowKeyNavigation: noop,
  startBackgroundRotation: noop,
  updateBackgroundByAvatar: noop,
  updateCoinDisplay: noop,
  updateWelcomeMessageUI: noop,
  getDailyChallengeTable: () => '3',
  showMessage: noop,
  // Les paramètres ({game}) apparaissent après « | » pour pouvoir les vérifier
  getTranslation: (k, params) =>
    params && Object.keys(params).length ? `${k}|${Object.values(params).join(',')}` : k,
  speak,
  isVoiceEnabled: () => voiceOn,
  saveArcadeScore,
  getArcadeScores: () => storedScores,
  resetArcadeScores,
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
const invasionStart = jest.fn();
jest.unstable_mockModule('../js/arcade-invasion.js', () => ({
  startMultiplicationInvasion: invasionStart,
}));

const arcade = await import('../js/arcade.js');
const game = await import('../js/game.js');
const { eventBus } = await import('../js/core/eventBus.js');

beforeEach(() => {
  document.body.innerHTML = '<div id="game"></div>';
  storedScores = [120, 80];
  saveArcadeScore.mockClear();
  resetArcadeScores.mockClear();
  invasionStart.mockClear();
  speak.mockClear();
  voiceOn = false;
  game.gameState.gameMode = 'multiinvaders';
});

describe('Écran de fin d’arcade', () => {
  test('une seule surface, une phrase avec le score, une seule touche primaire', () => {
    arcade.showArcadeGameOver(120);
    const wrapper = document.querySelector('#game .arcade-gameover');
    expect(wrapper.classList.contains('content-card')).toBe(true);
    const sentence = wrapper.querySelector('.arcade-final-score');
    expect(sentence.querySelector('strong').textContent).toBe('120');
    expect(document.getElementById('arcade-retry-btn').className).toBe('btn');
    expect(document.getElementById('arcade-back-btn').className).toBe('btn btn-secondary');
    expect(document.getElementById('arcade-home-btn').className).toBe('btn btn-secondary');
    // La remise à zéro est discrète et rangée avec la liste qu’elle vide
    const reset = document.getElementById('arcade-reset-btn');
    expect(reset.className).toBe('btn btn-quiet btn-danger btn-sm');
    expect(reset.closest('.arcade-top-scores')).toBeTruthy();
    expect(saveArcadeScore).toHaveBeenCalledTimes(1);
  });

  test('la voix félicite sans dire le score, qui reste affiché', () => {
    voiceOn = true;
    arcade.showArcadeGameOver(120);
    expect(speak).toHaveBeenCalledTimes(1);
    expect(speak).toHaveBeenCalledWith('arcade_game_over_spoken');
    expect(document.querySelector('.arcade-final-score strong').textContent).toBe('120');

    speak.mockClear();
    arcade.showArcadeGameOver(0);
    expect(speak).toHaveBeenCalledWith('arcade_try_again');
  });

  test('les libellés passent par les traductions (plus de français codé en dur)', () => {
    arcade.showArcadeGameOver(0);
    expect(document.querySelector('.arcade-gameover h2').textContent).toBe('game_over');
    expect(document.getElementById('arcade-retry-btn').textContent).toBe('retry_button');
    expect(document.querySelector('.arcade-final-score').textContent).toBe('arcade_try_again');
  });

  test('remettre à zéro vide la liste sans réenregistrer de score ni changer le résultat', () => {
    const confirmSpy = jest.fn(() => true);
    globalThis.confirm = confirmSpy;
    arcade.showArcadeGameOver(120);
    storedScores = [];
    document.getElementById('arcade-reset-btn').click();
    expect(confirmSpy).toHaveBeenCalledTimes(1);
    expect(resetArcadeScores).toHaveBeenCalledTimes(1);
    expect(saveArcadeScore).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.arcade-final-score strong').textContent).toBe('120');
    expect(document.querySelector('.arcade-top-scores')).toBeNull();
    expect(document.getElementById('arcade-reset-btn')).toBeNull();
  });

  test('la fin de partie arrête le sous-jeu (arcade:stop) : il ne tourne plus en arrière-plan', () => {
    const stop = jest.fn();
    eventBus.on('arcade:stop', stop, { once: true });
    arcade.setArcadeActive(true);
    arcade.showArcadeGameOver(120);
    expect(stop).toHaveBeenCalledTimes(1);
    expect(arcade.isArcadeActive()).toBe(false);
  });

  test('le focus va sur le titre de l’écran de fin, pas sur « Rejouer »', () => {
    arcade.showArcadeGameOver(40);
    const title = document.querySelector('.arcade-gameover h2');
    expect(document.activeElement).toBe(title);
    expect(title.getAttribute('tabindex')).toBe('-1');
  });

  test('les parties à 0 point ne remplissent pas les meilleurs scores', () => {
    storedScores = [150, 0, 0, 0, 0];
    arcade.showArcadeGameOver(0);
    const items = [...document.querySelectorAll('.arcade-top-scores li')].map(li => li.textContent);
    expect(items).toEqual(['150']);

    storedScores = [0, 0, 0];
    arcade.showArcadeGameOver(0);
    expect(document.querySelector('.arcade-top-scores')).toBeNull();
  });

  test('la confirmation nomme le jeu dont les scores seront effacés, puis le focus va sur « Rejouer »', () => {
    const confirmSpy = jest.fn(() => true);
    globalThis.confirm = confirmSpy;
    arcade.showArcadeGameOver(120);
    document.getElementById('arcade-reset-btn').click();
    expect(confirmSpy).toHaveBeenCalledWith('reset_scores_confirm|arcade_invasion_title');
    expect(document.activeElement).toBe(document.getElementById('arcade-retry-btn'));
  });

  test('deux affichages rapprochés ne doublent pas les actions', async () => {
    arcade.showArcadeGameOver(10);
    arcade.showArcadeGameOver(10);
    document.getElementById('arcade-retry-btn').click();
    await new Promise(r => setTimeout(r, 50));
    expect(invasionStart).toHaveBeenCalledTimes(1);
  });
});
