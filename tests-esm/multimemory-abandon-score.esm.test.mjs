/* eslint-env jest, node */
/**
 * MultiMemory lancé depuis le menu de l'Arcade, puis « Abandonner » : la partie est rendue et
 * son score remis à l'écran de fin (showArcadeGameOver), une seule fois. La victoire et la fin
 * du temps sont dans multimemory-keyboard.esm.test.mjs.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'node:fs';
import { fakeCanvasContext } from './helpers/touch-test-helpers.mjs';
import { mockMemoryArcade } from './helpers/module-mocks.mjs';

const showArcadeGameOver = jest.fn();
mockMemoryArcade(jest, '../js', { showArcadeGameOver });
jest.unstable_mockModule('../js/slides.js', () => ({ goToSlide: jest.fn() }));
jest.unstable_mockModule('../js/mode-orchestrator.js', () => ({ setStartingMode: jest.fn() }));
jest.unstable_mockModule('../js/core/userState.js', () => ({
  UserState: {
    getCurrentUserData: () => ({ preferredOperator: '×' }),
    updateUserData: () => false,
  },
}));

const store = await import('../js/i18n-store.js');
const { AudioManager } = await import('../js/core/audio.js');
const { gameState } = await import('../js/game.js');
const { MemoryGame, startMemoryArcade } = await import('../js/arcade-multimemory.js');

const FR = JSON.parse(fs.readFileSync('assets/translations/fr.json', 'utf8'));

/** Lance MultiMemory comme le menu de l'Arcade, et rend la partie créée */
function launch() {
  const started = jest.spyOn(MemoryGame.prototype, 'start');
  startMemoryArcade();
  return started.mock.contexts.at(-1);
}

beforeEach(() => {
  jest.useFakeTimers();
  store.setTranslations(FR);
  store.setCurrentLanguage('fr');
  showArcadeGameOver.mockClear();
  gameState.difficulty = 'debutant';
  jest.spyOn(AudioManager, 'isMuted').mockReturnValue(true);
  jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
  jest.spyOn(console, 'log').mockImplementation(() => {});
  HTMLCanvasElement.prototype.getContext = () =>
    Object.assign(fakeCanvasContext(), { createLinearGradient: () => ({ addColorStop() {} }) });
  const screen = document.createElement('div');
  screen.id = 'game';
  document.body.replaceChildren(screen);
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
  gameState.difficulty = undefined;
});

describe('MultiMemory : « Abandonner »', () => {
  test('le score de la partie est remis à l’écran de fin, une seule fois', () => {
    const game = launch();
    expect(game).toBeInstanceOf(MemoryGame);
    // Trois paires trouvées
    game.score = 30;
    const abandon = document.getElementById('multimemory-abandon-btn');
    abandon.click();
    expect(showArcadeGameOver).toHaveBeenCalledTimes(1);
    expect(showArcadeGameOver).toHaveBeenCalledWith(30);
    // Le bouton ne sert qu'une fois : un second appui n'enregistre rien de plus
    expect(abandon.disabled).toBe(true);
    abandon.click();
    expect(showArcadeGameOver).toHaveBeenCalledTimes(1);
  });

  test('abandon avant la première paire : un score de 0', () => {
    launch();
    document.getElementById('multimemory-abandon-btn').click();
    expect(showArcadeGameOver).toHaveBeenCalledTimes(1);
    expect(showArcadeGameOver).toHaveBeenCalledWith(0);
  });
});
