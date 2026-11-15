/* eslint-env jest, node */
/**
 * Banc des tests de lancement de MultiPop et de MultiGoal depuis le menu de l'Arcade :
 * l'Arcade autour du jeu est simulée (minuteur, écran de fin, changement d'écran), la page
 * n'a que l'écran du jeu, et le temps est celui des minuteries simulées. La partie lancée est
 * la vraie : elle se joue au clavier, et ce qu'elle montre se lit dans l'annonce du plateau.
 * À importer avant le module du jeu : les modules simulés se déclarent ici.
 */
import { test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'node:fs';
import { fakeCanvasContext } from './touch-test-helpers.mjs';

const noop = () => undefined;
export const startArcadeTimer = jest.fn();
export const showArcadeGameOver = jest.fn();
const stopArcadeMode = jest.fn();
jest.unstable_mockModule('../../js/arcade.js', () => ({
  startArcadeTimer,
  showArcadeGameOver,
  stopArcadeMode,
  isArcadeActive: () => true,
}));
const goToSlide = jest.fn();
jest.unstable_mockModule('../../js/slides.js', () => ({ goToSlide }));
const setStartingMode = jest.fn();
jest.unstable_mockModule('../../js/mode-orchestrator.js', () => ({ setStartingMode }));

const store = await import('../../js/i18n-store.js');
const { AudioManager } = await import('../../js/core/audio.js');
const { UserState } = await import('../../js/core/userState.js');
export const { gameState } = await import('../../js/game.js');
export const { eventBus } = await import('../../js/core/eventBus.js');

export const FR = JSON.parse(fs.readFileSync('assets/translations/fr.json', 'utf8'));

/**
 * Prépare chaque test : textes français, joueur qui a choisi l'addition, niveau Difficile,
 * écran du jeu vide ; après le test, la partie est rendue (Accueil)
 * @param {string} mode - multipop ou multigoal
 * @returns {{board: () => HTMLCanvasElement, press: (key: string) => void,
 *   status: () => string, banner: () => string, instructions: () => string}} de quoi lire et
 *   jouer la partie lancée
 */
export function launchBench(mode) {
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

  const board = () => document.getElementById(`${mode}-canvas`);
  return {
    board,
    press: key =>
      board().dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })),
    status: () => document.querySelector(`.${mode}-announcer`).textContent,
    banner: () => document.querySelector('.arcade-question').textContent,
    instructions: () => document.querySelector('.game-instructions p').textContent,
  };
}

/**
 * Ce que le lancement des deux jeux a en commun
 * @param {{mode: string, start: () => void, Game: Function, bench: ReturnType<typeof launchBench>,
 *   touchKey: string, ready: () => void, second: (count: number) => RegExp}} game - start :
 *   lance le jeu ; Game : sa classe ; touchKey : clé de la consigne du doigt ; ready : laisse
 *   la partie arriver au moment où le clavier vise quelque chose ; second : annonce attendue
 *   après une flèche (« … 2 sur <count> : … »)
 */
export function commonLaunchTests({ mode, start, Game, bench, touchKey, ready, second }) {
  const { board, press, status, banner, instructions } = bench;

  test('l’écran du jeu, le minuteur du niveau, la partie dans l’opération du joueur', () => {
    start();
    expect(stopArcadeMode).toHaveBeenCalledTimes(1);
    expect(setStartingMode).toHaveBeenCalledWith(mode);
    expect(gameState.gameMode).toBe(mode);
    expect(goToSlide).toHaveBeenCalledWith(4);
    expect(board()).toBeTruthy();
    expect(document.activeElement).toBe(board());
    expect(document.getElementById(`${mode}-info-score`).textContent).toBe('0');
    expect(document.getElementById(`${mode}-info-lives`)).toBeNull();
    expect(startArcadeTimer).toHaveBeenCalledWith(300);
    expect(banner()).toMatch(/^\d+ \+ \d+ = \?$/);
    // Le mode « en cours de lancement » se retire juste après
    expect(setStartingMode).not.toHaveBeenCalledWith(null);
    jest.advanceTimersByTime(0);
    expect(setStartingMode).toHaveBeenLastCalledWith(null);
  });

  test('sur un appareil tactile : la consigne du doigt', () => {
    globalThis.matchMedia = query => ({
      matches: query === '(pointer: coarse)',
      addEventListener: noop,
      removeEventListener: noop,
    });
    start();
    expect(instructions()).toBe(Reflect.get(FR, touchKey));
  });

  test('sans niveau choisi : Moyen', () => {
    gameState.difficulty = undefined;
    start();
    expect(startArcadeTimer).toHaveBeenCalledWith(180);
    ready();
    press('ArrowRight');
    expect(status()).toMatch(second(4));
  });

  test('Accueil (arcade:stop) : la partie est rendue, sans écran de fin', () => {
    start();
    ready();
    eventBus.emit('arcade:stop');
    expect(showArcadeGameOver).not.toHaveBeenCalled();
    // Le plateau n'écoute plus le clavier
    press('ArrowRight');
    expect(status()).toBe('');
  });

  test('relancée sans arrêt : l’ancienne partie est rendue avant la nouvelle', () => {
    const cleanup = jest.spyOn(Game.prototype, 'cleanup');
    start();
    const firstBoard = board();
    start();
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(firstBoard.isConnected).toBe(false);
    expect(document.querySelectorAll(`#${mode}-canvas`)).toHaveLength(1);
    ready();
    press('ArrowRight');
    expect(status()).toMatch(second(gameState.difficulty === 'difficile' ? 6 : 4));
  });
}
