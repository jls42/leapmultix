/* eslint-env jest, node */
/**
 * Navigation réelle (slides.js, sans simulation) : quitter l'écran de jeu arrête une
 * course de Chrono. Sinon le chrono continuerait en fond et le clavier resterait capté.
 */
import { test, expect, jest } from '@jest/globals';

jest.unstable_mockModule('../../js/components/dashboard.js', () => ({
  default: { show: () => {} },
  Dashboard: { show: () => {} },
}));
jest.unstable_mockModule('../../js/speech.js', () => ({
  speak: jest.fn(),
  preloadSpeech: jest.fn(),
  isVoiceEnabled: () => false,
  updateSpeechVoice: () => {},
  cancelSpeech: () => {},
  whenSpeechEnds: () => Promise.resolve(),
}));

const { goToSlide } = await import('../../js/slides.js');
const { ChronoMode, startChronoMode } = await import('../../js/modes/ChronoMode.js');

test('retour à l’accueil pendant une course : la course s’arrête, le clavier est rendu', async () => {
  document.body.innerHTML =
    '<div id="slide1" class="slide"></div><div id="slide4" class="slide"><div id="game"></div></div><div id="results"></div>';
  jest.spyOn(console, 'log').mockImplementation(() => {});
  let chrono;
  const realStart = ChronoMode.prototype.start;
  jest.spyOn(ChronoMode.prototype, 'start').mockImplementation(function start(...args) {
    chrono = this;
    return realStart.apply(this, args);
  });

  startChronoMode();
  await new Promise(resolve => setTimeout(resolve, 0));
  chrono.setInputMode('keypad');
  await chrono.beginSession(false);
  expect(chrono.state.isActive).toBe(true);

  await goToSlide(1);
  expect(chrono.state.isActive).toBe(false);
  // L'horloge de la course est arrêtée : plus aucun intervalle, et le temps ne bouge plus
  expect(chrono.intervals.size).toBe(0);
  const elapsed = chrono.elapsedMs;
  await new Promise(resolve => setTimeout(resolve, 300));
  expect(chrono.elapsedMs).toBe(elapsed);
  const key = new KeyboardEvent('keydown', { key: '5', cancelable: true, bubbles: true });
  document.dispatchEvent(key);
  expect(key.defaultPrevented).toBe(false);
});
