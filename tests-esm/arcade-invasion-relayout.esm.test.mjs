/**
 * MultiInvaders, téléphone tourné en cours de partie : tant qu'aucun tir n'est parti, le
 * plateau se refait pour la nouvelle place (la vague repart dedans) ; ensuite, seul
 * l'affichage suit, la partie (taille interne, positions) ne change plus.
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

beforeEach(() => {
  jest.useFakeTimers();
  HTMLCanvasElement.prototype.getContext = () => fakeCanvasContext();
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

  test('un tir déjà parti : la taille interne reste, seul l’affichage suit', () => {
    const before = [canvas.width, canvas.height];
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space' }));
    rotate();
    expect([canvas.width, canvas.height]).toEqual(before);
    expect(Number.parseFloat(canvas.style.height)).toBeLessThanOrEqual(390 - 120);
  });
});
