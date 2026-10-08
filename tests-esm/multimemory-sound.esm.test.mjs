/* eslint-env jest, node */
/**
 * Sons de MultiMemory : ils suivent le volume choisi dans le jeu, comme les autres modes.
 * Avant, MultiMemory jouait ses propres lecteurs à plein volume (seul le son coupé l'arrêtait) :
 * baisser le volume ne changeait rien, et le son d'erreur restait très fort. Le son d'erreur est
 * adouci comme au Chrono.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'node:fs';
import { fakeCanvasContext } from './helpers/touch-test-helpers.mjs';

jest.unstable_mockModule('../js/arcade.js', () => ({
  startArcadeTimer: jest.fn(),
  stopArcadeMode: jest.fn(),
  showArcadeGameOver: jest.fn(),
  isArcadeActive: () => false,
  monsterSprites: Array.from({ length: 16 }, () => ({ complete: false })),
}));
jest.unstable_mockModule('../js/arcade-session.js', () => ({ noteArcadePlay: jest.fn() }));

const store = await import('../js/i18n-store.js');
const { AudioManager } = await import('../js/core/audio.js');
const { MemoryGame } = await import('../js/arcade-multimemory.js');

const FR = JSON.parse(fs.readFileSync('assets/translations/fr.json', 'utf8'));

let game;
/** Sons lancés : adresse du fichier et volume au moment de jouer */
let played;

beforeEach(() => {
  jest.useFakeTimers();
  store.setTranslations(FR);
  played = [];
  jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function play() {
    played.push({ src: this.src, volume: this.volume });
    return Promise.resolve();
  });
  jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
  jest.spyOn(AudioManager, 'savePreferences').mockImplementation(() => undefined);
  AudioManager.setVolume(0.4);
  HTMLCanvasElement.prototype.getContext = () =>
    Object.assign(fakeCanvasContext(), { createLinearGradient: () => ({ addColorStop() {} }) });
  const stage = document.createElement('div');
  stage.className = 'arcade-game-ui';
  const canvas = document.createElement('canvas');
  canvas.id = 'multimemory-canvas';
  stage.appendChild(canvas);
  document.body.replaceChildren(stage);
  game = new MemoryGame(canvas.id, { difficulty: 'debutant', operator: '×', tables: [2, 3] });
  game.start();
});

afterEach(() => {
  game.cleanup();
  AudioManager.setVolume(1);
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('MultiMemory : sons au volume du jeu', () => {
  test('une paire trouvée sonne au volume choisi', () => {
    const [first, second] = game.cards;
    game.onPairFound(first, second);
    expect(played).toHaveLength(1);
    expect(played[0].src).toContain('success');
    expect(played[0].volume).toBeCloseTo(0.4);
  });

  test('une paire ratée sonne plus bas que le volume choisi, comme l’erreur du Chrono', () => {
    const [first, second] = game.cards;
    game.onPairMissed(first, second);
    expect(played).toHaveLength(1);
    expect(played[0].src).toContain('failure');
    expect(played[0].volume).toBeCloseTo(0.4 * 0.35);
  });

  test('son coupé : aucun son', () => {
    AudioManager.setVolume(0);
    const [first, second] = game.cards;
    game.onPairMissed(first, second);
    game.onPairFound(first, second);
    expect(played).toHaveLength(0);
  });
});
