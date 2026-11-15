/* eslint-env jest, node */
/**
 * Lancement de MultiPop depuis le menu de l'Arcade (startPopArcade) : écran du jeu,
 * minuteur du niveau, partie dans l'opération du joueur, consigne selon l'appareil, premières
 * monstres une fois la consigne partie, « Abandonner » (écran de fin avec le score), Accueil
 * (partie rendue sans écran de fin), relance (l'ancienne partie rendue d'abord). La partie est
 * la vraie : elle se joue ici au clavier, et ses monstres se lisent dans l'annonce du plateau.
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
const { INSTRUCTIONS_MS } = await import('../js/arcade-common.js');
const { RISE_MS, BOTTOM_HOLES } = await import('../js/multipop-engine.js');
const { startPopArcade, PopGame, CORRECT_POINTS, FIRST_RAISE_MS } = await import(
  '../js/arcade-multipop.js'
);

const FR = JSON.parse(fs.readFileSync('assets/translations/fr.json', 'utf8'));

const board = () => document.getElementById('multipop-canvas');
const press = key =>
  board().dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
const status = () => document.querySelector('.multipop-announcer').textContent;
const banner = () => document.querySelector('.arcade-question').textContent;
const instructions = () => document.querySelector('.game-instructions p').textContent;

/** Les premiers monstres sortent et finissent de monter */
function waitForMonsters() {
  jest.advanceTimersByTime(FIRST_RAISE_MS + RISE_MS + 200);
}

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

describe('MultiPop : lancement depuis le menu de l’Arcade', () => {
  test('l’écran du jeu, le minuteur du niveau, la partie dans l’opération du joueur', () => {
    startPopArcade();
    expect(stopArcadeMode).toHaveBeenCalledTimes(1);
    expect(setStartingMode).toHaveBeenCalledWith('multipop');
    expect(gameState.gameMode).toBe('multipop');
    expect(goToSlide).toHaveBeenCalledWith(4);
    expect(board()).toBeTruthy();
    expect(document.activeElement).toBe(board());
    expect(document.getElementById('multipop-info-score').textContent).toBe('0');
    expect(document.getElementById('multipop-info-lives')).toBeNull();
    expect(startArcadeTimer).toHaveBeenCalledWith(300);
    expect(banner()).toMatch(/^\d+ \+ \d+ = \?$/);
    // Le mode « en cours de lancement » se retire juste après
    expect(setStartingMode).not.toHaveBeenCalledWith(null);
    jest.advanceTimersByTime(0);
    expect(setStartingMode).toHaveBeenLastCalledWith(null);
  });

  test('la consigne à la souris ; les cinq monstres du niveau sortent après 1,5 s', () => {
    expect(FIRST_RAISE_MS).toBe(1500);
    startPopArcade();
    expect(instructions()).toBe(FR.arcade_pop_instructions_desktop);
    // Le temps de lire le calcul : rien avant 1,5 s (sans attente, ils sortiraient à 400 ms)
    jest.advanceTimersByTime(1000);
    press('ArrowRight');
    expect(status()).toBe('');
    jest.advanceTimersByTime(FIRST_RAISE_MS - 1000 + RISE_MS + 200);
    press('ArrowRight');
    expect(status()).toMatch(/^Monstre 2 sur 5\s: \d+$/);
  });

  test('tant que la consigne est affichée, personne ne sort de la rangée du bas', () => {
    const raised = jest.spyOn(PopGame.prototype, 'onRaised');
    const holes = [];
    raised.mockImplementation(function onRaised() {
      const { monsters, friend } = this.field;
      holes.push({
        shown: !document.querySelector('.game-instructions').hidden,
        bottom: [...monsters, friend].some(figure => figure && BOTTOM_HOLES.includes(figure.hole)),
      });
    });
    startPopArcade();
    // Difficile : une sortie toutes les 2,2 s ; la consigne reste 5 s puis s'efface
    jest.advanceTimersByTime(INSTRUCTIONS_MS + 60_000);
    const covered = holes.filter(sortie => sortie.shown);
    expect(covered.length).toBeGreaterThanOrEqual(2);
    expect(covered.every(sortie => !sortie.bottom)).toBe(true);
    // Ensuite, la rangée du bas sert comme les autres
    expect(holes.some(sortie => !sortie.shown && sortie.bottom)).toBe(true);
  });

  test('sur un appareil tactile : la consigne du doigt', () => {
    globalThis.matchMedia = query => ({
      matches: query === '(pointer: coarse)',
      addEventListener: noop,
      removeEventListener: noop,
    });
    startPopArcade();
    expect(instructions()).toBe(FR.arcade_pop_instructions_touch);
  });

  test('sans niveau choisi : Moyen', () => {
    gameState.difficulty = undefined;
    startPopArcade();
    expect(startArcadeTimer).toHaveBeenCalledWith(180);
    waitForMonsters();
    press('ArrowRight');
    expect(status()).toMatch(/^Monstre 2 sur 4\s: \d+$/);
  });

  test('« Abandonner » : la partie est rendue, l’écran de fin montre son score', () => {
    startPopArcade();
    waitForMonsters();
    // Entrée tape le monstre visé, puis le suivant après un mauvais : le bon finit tapé
    for (let tap = 0; tap < 5; tap++) press('Enter');
    expect(document.getElementById('multipop-info-score').textContent).toBe(String(CORRECT_POINTS));
    const cleanup = jest.spyOn(PopGame.prototype, 'cleanup');
    document.getElementById('multipop-abandon-btn').click();
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(showArcadeGameOver).toHaveBeenCalledWith(CORRECT_POINTS);
  });

  test('Accueil (arcade:stop) : la partie est rendue, sans écran de fin', () => {
    startPopArcade();
    waitForMonsters();
    eventBus.emit('arcade:stop');
    expect(showArcadeGameOver).not.toHaveBeenCalled();
    // Le plateau n'écoute plus le clavier
    press('ArrowRight');
    expect(status()).toBe('');
  });

  test('relancée sans arrêt : l’ancienne partie est rendue avant la nouvelle', () => {
    const cleanup = jest.spyOn(PopGame.prototype, 'cleanup');
    startPopArcade();
    const firstBoard = board();
    startPopArcade();
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(firstBoard.isConnected).toBe(false);
    expect(document.querySelectorAll('#multipop-canvas')).toHaveLength(1);
    waitForMonsters();
    press('ArrowRight');
    expect(status()).toMatch(/^Monstre 2 sur 5\s: \d+$/);
  });
});
