/**
 * MultiInvaders, téléphone tourné en cours de partie : tant qu'aucun tir n'est parti, le
 * plateau se refait pour la nouvelle place (la vague repart dedans) ; ensuite, seul
 * l'affichage suit, la partie (taille interne, positions) ne change plus. La consigne, posée
 * sur le plateau, ne change rien en partant.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { fakeCanvasContext } from './helpers/touch-test-helpers.mjs';
import { simulateArcadeScreen, useAndroidUserAgent } from './helpers/arcade-screen-helpers.mjs';

jest.unstable_mockModule('../js/arcade.js', () => ({
  startArcadeTimer: jest.fn(),
  showArcadeGameOver: jest.fn(),
  arcadeKeyDown: jest.fn(),
  arcadeKeyUp: jest.fn(),
  arcadeControls: { leftPressed: false, rightPressed: false },
  stopArcadeMode: jest.fn(),
  isArcadeActive: () => true,
}));
jest.unstable_mockModule('../js/utils-es6.js', () => ({
  getTranslation: key => key,
  cleanupGameResources: jest.fn(),
  speak: jest.fn(),
  isVoiceEnabled: () => false,
  playSound: jest.fn(),
  showArcadePoints: jest.fn(),
  updateInfoBar: jest.fn(),
  showArcadeMessage: jest.fn(),
}));
jest.unstable_mockModule('../js/arcade-points.js', () => ({ showArcadePenalty: jest.fn() }));
jest.unstable_mockModule('../js/arcade-message.js', () => ({
  getArcadeText: (key, fallback) => fallback,
}));
jest.unstable_mockModule('../js/game.js', () => ({
  gameState: { difficulty: 'moyen', avatar: 'fox' },
}));
jest.unstable_mockModule('../js/core/userState.js', () => ({
  UserState: { getCurrentUserData: () => ({}) },
}));
jest.unstable_mockModule('../js/userManager.js', () => ({
  UserManager: { getCurrentUser: () => null },
}));
jest.unstable_mockModule('../js/core/tablePreferences.js', () => ({
  TablePreferences: { isGlobalEnabled: () => false, getActiveExclusions: () => [] },
}));
jest.unstable_mockModule('../js/core/operation-stats.js', () => ({
  recordOperationResult: jest.fn(),
}));
jest.unstable_mockModule('../js/arcade-session.js', () => ({ noteArcadePlay: jest.fn() }));
// Gabarit commun : bandeau, puis zone de jeu (canevas, « Abandonner »)
jest.unstable_mockModule('../js/components/infoBar.js', () => ({
  InfoBar: {
    createArcadeTemplateElement: () => {
      const frag = document.createDocumentFragment();
      const banner = document.createElement('div');
      banner.className = 'arcade-mult-display';
      const top = document.createElement('div');
      top.className = 'arcade-mobile-top';
      const question = document.createElement('span');
      question.className = 'arcade-question';
      top.append(question);
      banner.append(top);
      const stage = document.createElement('div');
      stage.className = 'arcade-game-ui';
      const canvas = document.createElement('canvas');
      canvas.id = 'arcade-canvas';
      const abandon = document.createElement('button');
      abandon.id = 'arcade-abandon-btn';
      stage.append(canvas, abandon);
      frag.append(banner, stage);
      return frag;
    },
  },
}));

const { startMultiplicationInvasion } = await import('../js/arcade-invasion.js');

const restorers = [];
let canvas;

/** Téléphone tourné : écran bas et large */
function rotate() {
  restorers.push(simulateArcadeScreen({ width: 620, height: 390, top: 120 }));
  globalThis.dispatchEvent(new Event('resize'));
  jest.advanceTimersByTime(50);
}

// Nombres écrits sur les monstres, image après image
let written = [];

/** Nombres de la dernière vague dessinée */
function waveNumbers() {
  written = [];
  jest.advanceTimersByTime(20);
  return [...new Set(written)].sort((a, b) => a - b);
}

beforeEach(() => {
  jest.useFakeTimers();
  HTMLCanvasElement.prototype.getContext = () => {
    const ctx = fakeCanvasContext();
    ctx.fillText = text => written.push(Number(text));
    return ctx;
  };
  restorers.push(useAndroidUserAgent());
  restorers.push(simulateArcadeScreen({ width: 363, height: 844 }));
  document.body.replaceChildren();
  const game = document.createElement('div');
  game.id = 'game';
  document.body.append(game);
  startMultiplicationInvasion();
  canvas = document.getElementById('arcade-canvas');
});

afterEach(() => {
  document.body.replaceChildren();
  jest.advanceTimersByTime(50);
  while (restorers.length) restorers.pop()();
  jest.useRealTimers();
});

describe('MultiInvaders, téléphone tourné', () => {
  test('aucun tir encore : le plateau se refait, plus large que haut', () => {
    expect(canvas.height).toBeGreaterThan(canvas.width);
    rotate();
    expect(canvas.width).toBeGreaterThan(canvas.height);
    expect(Number.parseFloat(canvas.style.width)).toBeLessThanOrEqual(620);
  });

  test('le plateau refait garde le calcul et les nombres des monstres', () => {
    const question = document.querySelector('.arcade-question').textContent;
    const numbers = waveNumbers();
    expect(numbers).toHaveLength(5);
    rotate();
    expect(document.querySelector('.arcade-question').textContent).toBe(question);
    expect(waveNumbers()).toEqual(numbers);
  });

  test('un tir déjà parti : la taille interne reste, seul l’affichage suit', () => {
    const before = [canvas.width, canvas.height];
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space' }));
    rotate();
    expect([canvas.width, canvas.height]).toEqual(before);
    expect(Number.parseFloat(canvas.style.height)).toBeLessThanOrEqual(390 - 120);
  });
});

describe('MultiInvaders, la consigne posée sur le plateau', () => {
  test('au milieu du plateau : les monstres sont en haut, le vaisseau en bas', () => {
    expect(document.querySelector('.game-instructions').dataset.placement).toBe('middle');
  });

  test('la consigne qui part ne change rien : même plateau à 1 s et à 9 s', () => {
    const plateau = () => ({
      internal: [canvas.width, canvas.height],
      shown: [canvas.style.width, canvas.style.height],
    });
    jest.advanceTimersByTime(1000);
    const at1s = plateau();
    // Sa consigne reste 8 s, plus le fondu
    jest.advanceTimersByTime(8000);
    expect(document.querySelector('.game-instructions').hidden).toBe(true);
    expect(plateau()).toEqual(at1s);
  });
});
