/* eslint-env jest, node */
/**
 * Banc des tests de partie de MultiPop et de MultiGoal : l'Arcade autour du jeu est simulée
 * (minuteur, écran de fin, session, apprentissage), le bandeau et le plateau du jeu sont
 * posés dans la page, et l'horloge du jeu s'avance à la main (step). À importer avant le
 * module du jeu : les modules simulés se déclarent ici.
 */
import { jest } from '@jest/globals';
import fs from 'node:fs';
import { fakeCanvasContext } from './touch-test-helpers.mjs';

export const showArcadeGameOver = jest.fn();
let arcadeActive = false;
/**
 * L'Arcade est-elle « en cours » ? Hors cours (au départ), la boucle d'images du jeu ne tourne
 * pas ; en cours, les pastilles de points jouent leur son
 * @param {boolean} active
 */
export function setArcadeActive(active) {
  arcadeActive = active;
}
jest.unstable_mockModule('../../js/arcade.js', () => ({
  startArcadeTimer: jest.fn(),
  stopArcadeMode: jest.fn(),
  showArcadeGameOver,
  isArcadeActive: () => arcadeActive,
}));
export const noteArcadePlay = jest.fn();
jest.unstable_mockModule('../../js/arcade-session.js', () => ({
  noteArcadePlay,
  noteArcadeMiss: jest.fn(),
}));
export const recordArcadeAnswer = jest.fn();
export const showSolvedQuestion = jest.fn();
jest.unstable_mockModule('../../js/arcade-learning.js', () => ({
  recordArcadeAnswer,
  showSolvedQuestion,
  SOLVED_PAUSE_MS: 1500,
  weakTablesFor: () => [],
}));

const store = await import('../../js/i18n-store.js');
export const pause = await import('../../js/arcade-time.js');
export const { AudioManager } = await import('../../js/core/audio.js');
const { InfoBar } = await import('../../js/components/infoBar.js');
export const { gameState } = await import('../../js/game.js');

export const FR = JSON.parse(fs.readFileSync('assets/translations/fr.json', 'utf8'));

/**
 * Page d'une partie : textes français, bandeau du jeu (score, sans vies) et son plateau
 * @param {string} mode - multipop ou multigoal
 * @returns {HTMLCanvasElement} le plateau, qui peut prendre le focus
 */
export function mountBoard(mode) {
  setArcadeActive(false);
  store.setTranslations(FR);
  store.setCurrentLanguage('fr');
  HTMLCanvasElement.prototype.getContext = () => fakeCanvasContext();
  document.body.replaceChildren(
    InfoBar.createArcadeTemplateElement({
      mode,
      canvasId: `${mode}-canvas`,
      scoreId: `${mode}-info-score`,
      showLives: false,
      showScore: true,
    })
  );
  const canvas = document.getElementById(`${mode}-canvas`);
  canvas.tabIndex = 0;
  return canvas;
}

/**
 * Le plateau affiché à sa taille de jeu, en haut à gauche de l'écran (jsdom ne calcule
 * aucune mise en page) ; les appels notés pendant le lancement sont oubliés
 * @param {HTMLCanvasElement} canvas
 * @param {{width: number, height: number}} layout
 */
export function placeBoard(canvas, layout) {
  jest.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    width: layout.width,
    height: layout.height,
    right: layout.width,
    bottom: layout.height,
  });
  for (const mock of [noteArcadePlay, recordArcadeAnswer, showSolvedQuestion]) mock.mockClear();
}

/**
 * Fin d'un test : la partie est rendue, la pause et les espions retirés
 * @param {{cleanup: () => void}} game
 */
export function unmountBoard(game) {
  game.cleanup();
  pause.unmountArcadePause();
  jest.restoreAllMocks();
}

/** Une touche du clavier sur le plateau */
export function keyOn(canvas, key) {
  canvas.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

/**
 * Souris ou doigt sur un point du plateau
 * @param {HTMLCanvasElement} canvas
 * @param {{x: number, y: number}} point
 * @param {string} [pointerType]
 * @returns {MouseEvent} l'événement envoyé
 */
export function tapAt(canvas, point, pointerType = 'mouse') {
  const event = new MouseEvent('pointerdown', {
    clientX: point.x,
    clientY: point.y,
    bubbles: true,
    cancelable: true,
  });
  Object.defineProperty(event, 'pointerType', { value: pointerType });
  canvas.dispatchEvent(event);
  return event;
}

/** Met l'Arcade en pause, comme le bouton « Pause » du bandeau */
export function pauseArcadeGame() {
  const time = document.createElement('span');
  document.body.appendChild(time);
  pause.mountArcadePause(time);
  pause.pauseArcade();
}
