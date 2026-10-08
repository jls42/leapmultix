/* eslint-env jest, node */
/**
 * MultiMemory au clavier (WCAG 2.1.1, niveau A). Avant, aucune touche ne retournait de carte.
 * Les flèches déplacent la carte visée, Entrée ou Espace la retournent, et ce que la carte
 * montre est annoncé par une région role="status" (pas par la voix du jeu). Une partie se
 * joue et se gagne entièrement au clavier, et compte au tableau de bord.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'node:fs';
import { fakeCanvasContext } from './helpers/touch-test-helpers.mjs';

const showArcadeGameOver = jest.fn();
const noteArcadePlay = jest.fn();
jest.unstable_mockModule('../js/arcade.js', () => ({
  startArcadeTimer: jest.fn(),
  stopArcadeMode: jest.fn(),
  showArcadeGameOver,
  isArcadeActive: () => false,
  monsterSprites: Array.from({ length: 16 }, () => ({ complete: false })),
}));
jest.unstable_mockModule('../js/arcade-session.js', () => ({ noteArcadePlay }));

const store = await import('../js/i18n-store.js');
const { AudioManager } = await import('../js/core/audio.js');
const { MemoryGame } = await import('../js/arcade-multimemory.js');

const FR = JSON.parse(fs.readFileSync('assets/translations/fr.json', 'utf8'));
const COLS = 4;

let game;
let canvas;

const press = key =>
  canvas.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
const status = () => document.querySelector('.multimemory-announcer[role="status"]').textContent;

/** Flèches jusqu'à la carte de rang `target` */
function moveTo(target) {
  const dRow = Math.floor(target / COLS) - Math.floor(game.cursorIndex / COLS);
  const dCol = (target % COLS) - (game.cursorIndex % COLS);
  for (let i = 0; i < Math.abs(dRow); i++) press(dRow > 0 ? 'ArrowDown' : 'ArrowUp');
  for (let i = 0; i < Math.abs(dCol); i++) press(dCol > 0 ? 'ArrowRight' : 'ArrowLeft');
}

beforeEach(() => {
  jest.useFakeTimers();
  store.setTranslations(FR);
  store.setCurrentLanguage('fr');
  jest.spyOn(AudioManager, 'isMuted').mockReturnValue(true);
  // jsdom ne joue aucun son : la fin de partie arrête quand même les siens
  jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
  HTMLCanvasElement.prototype.getContext = () =>
    Object.assign(fakeCanvasContext(), { createLinearGradient: () => ({ addColorStop() {} }) });
  const stage = document.createElement('div');
  stage.className = 'arcade-game-ui';
  canvas = document.createElement('canvas');
  canvas.id = 'multimemory-canvas';
  canvas.tabIndex = 0;
  stage.appendChild(canvas);
  document.body.replaceChildren(stage);
  game = new MemoryGame(canvas.id, { difficulty: 'debutant', operator: '×', tables: [2, 3] });
  game.start();
  showArcadeGameOver.mockClear();
  noteArcadePlay.mockClear();
});

afterEach(() => {
  game.cleanup();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('MultiMemory au clavier', () => {
  test('le plateau prend le focus au lancement, et dit comment jouer au clavier', () => {
    expect(document.activeElement).toBe(canvas);
    const help = document.getElementById(canvas.getAttribute('aria-describedby'));
    expect(help.textContent).toBe(FR['arcade.controls.multimemory.keyboard']);
  });

  test('les flèches déplacent la carte visée et annoncent sa place', () => {
    press('ArrowRight');
    press('ArrowDown');
    expect(game.cursorIndex).toBe(COLS + 1);
    expect(status()).toBe('Ligne 2, colonne 2\u00a0: carte cachée');
  });

  test('la carte visée ne sort jamais de la grille', () => {
    press('ArrowLeft');
    press('ArrowUp');
    expect(game.cursorIndex).toBe(0);
    moveTo(game.cards.length - 1);
    press('ArrowRight');
    press('ArrowDown');
    expect(game.cursorIndex).toBe(game.cards.length - 1);
  });

  test('Entrée retourne la carte visée et annonce ce qu’elle montre ; Espace aussi', () => {
    press('ArrowRight');
    press('Enter');
    expect(game.cards[1].isFlipped).toBe(true);
    expect(status()).toBe(game.cards[1].content);
    press('ArrowRight');
    press(' ');
    expect(game.cards[2].isFlipped).toBe(true);
    // Deux cartes retournées : la partie compte au tableau de bord
    expect(noteArcadePlay).toHaveBeenCalled();
  });

  test('une partie entière au clavier : toutes les paires, la victoire, le score', () => {
    for (let pairId = 0; pairId < game.pairs; pairId++) {
      for (const card of game.cards.filter(c => c.pairId === pairId)) {
        moveTo(game.cards.indexOf(card));
        press('Enter');
      }
      jest.advanceTimersByTime(1000);
      expect(status()).toBe(FR.arcade.multiMemory.match);
    }
    expect(game.cards.every(card => card.isMatched)).toBe(true);
    jest.advanceTimersByTime(2000);
    // 10 points par paire, 20 par vie gardée (3 vies)
    expect(showArcadeGameOver).toHaveBeenCalledWith(game.pairs * 10 + 60);
  });

  test('deux cartes qui ne vont pas ensemble se retournent, et le jeu le dit', () => {
    const [first] = game.cards;
    const other = game.cards.find(card => card.result !== first.result);
    press('Enter');
    moveTo(game.cards.indexOf(other));
    press('Enter');
    jest.advanceTimersByTime(1000);
    expect(first.isFlipped || other.isFlipped).toBe(false);
    expect(status()).toBe(FR.arcade.multiMemory.mismatch);
  });
});
