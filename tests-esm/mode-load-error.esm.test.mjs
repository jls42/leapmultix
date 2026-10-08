/* eslint-env jest, node */
/**
 * Un mode ou un jeu d'Arcade qui ne se charge pas (hors ligne, jamais gardé sur l'appareil) :
 * un avis qui reste affiché, écrit pour l'enfant, au lieu d'un échec muet. Il dit pourquoi
 * (pas d'Internet) et quoi faire, dans la langue du jeu, prend le focus, se ferme au clavier
 * comme au doigt, et disparaît quand un jeu s'ouvre.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'node:fs';

const loadForGameMode = jest.fn();
const startQuizMode = jest.fn();
jest.unstable_mockModule('../js/lazy-loader.js', () => ({ lazyLoader: { loadForGameMode } }));
jest.unstable_mockModule('../js/components/operationModeAvailability.js', () => ({
  canLaunchMode: () => true,
}));
jest.unstable_mockModule('../js/modes/QuizMode.js', () => ({ startQuizMode }));
// GameMode réduit à l'essentiel : seul le lancement d'un jeu d'Arcade est testé ici
jest.unstable_mockModule('../js/core/GameMode.js', () => ({
  GameMode: class {
    constructor(modeName) {
      this.modeName = modeName;
      this.state = { isActive: true };
    }
  },
}));
// Jeu d'Arcade dont le module ne se charge pas (hors ligne)
jest.unstable_mockModule('../js/arcade-invasion.js', () => {
  throw new TypeError('Failed to fetch dynamically imported module: /js/arcade-invasion.js');
});
jest.unstable_mockModule('../js/arcade-message.js', () => ({ showArcadeMessage: jest.fn() }));

const { setTranslations, setCurrentLanguage } = await import('../js/i18n-store.js');
const { applyStaticTranslations } = await import('../js/i18n.js');
const { setGameMode } = await import('../js/mode-orchestrator.js');
const { ArcadeMode } = await import('../js/modes/ArcadeMode.js');

const dictionary = lang => JSON.parse(fs.readFileSync(`assets/translations/${lang}.json`, 'utf8'));
const FR = dictionary('fr');
const notice = () => document.querySelector('[role="alert"].load-error-notice');

function setOnline(online) {
  Object.defineProperty(globalThis.navigator, 'onLine', { configurable: true, get: () => online });
}

/** Bouton de mode de l'accueil, qui a le focus au moment du clic */
function modeButton() {
  const button = document.createElement('button');
  button.className = 'mode-btn';
  button.dataset.mode = 'quiz';
  document.body.appendChild(button);
  button.focus();
  return button;
}

beforeEach(() => {
  document.body.replaceChildren();
  setTranslations(FR);
  setCurrentLanguage('fr');
  loadForGameMode.mockReset();
  startQuizMode.mockReset();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.useRealTimers();
  setOnline(true);
  jest.restoreAllMocks();
});

describe('Un mode qui ne se charge pas', () => {
  test('hors ligne : l’avis dit qu’il faut Internet, reste affiché et prend le focus', async () => {
    jest.useFakeTimers();
    setOnline(false);
    loadForGameMode.mockRejectedValue(new Error('Failed to load script: js/modes/QuizMode.js'));
    const button = modeButton();
    await setGameMode('quiz');
    expect(notice().querySelector('.load-error-message').textContent).toBe(FR.mode_load_error);
    const close = notice().querySelector('button');
    expect(close.textContent).toBe(FR.load_error_close);
    expect(document.activeElement).toBe(close);
    expect(close.getAttribute('aria-describedby')).toBe(notice().querySelector('p').id);
    jest.advanceTimersByTime(60000);
    expect(notice()).not.toBeNull();
    close.click();
    expect(notice()).toBeNull();
    expect(document.activeElement).toBe(button);
  });

  test('module introuvable, réseau présent : la même explication (le chargement a échoué)', async () => {
    loadForGameMode.mockRejectedValue(
      new TypeError('Failed to fetch dynamically imported module: /js/modes/ChronoMode.js')
    );
    await setGameMode('quiz');
    expect(notice().textContent).toContain(FR.mode_load_error);
  });

  test('une autre panne : un message général, sans parler d’Internet', async () => {
    loadForGameMode.mockRejectedValue(new TypeError('x is not a function'));
    await setGameMode('quiz');
    expect(notice().querySelector('.load-error-message').textContent).toBe(FR.mode_start_error);
  });

  test('Échap ferme l’avis sans aller plus loin ; un seul avis à la fois', async () => {
    setOnline(false);
    loadForGameMode.mockRejectedValue(new Error('Failed to load script: js/arcade.js'));
    await setGameMode('quiz');
    await setGameMode('quiz');
    expect(document.querySelectorAll('.load-error-notice')).toHaveLength(1);
    const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    const seen = jest.fn();
    document.addEventListener('keydown', seen);
    notice().querySelector('button').dispatchEvent(escape);
    document.removeEventListener('keydown', seen);
    expect(notice()).toBeNull();
    expect(seen).not.toHaveBeenCalled();
  });

  test('le jeu s’ouvre au second essai : l’avis disparaît', async () => {
    setOnline(false);
    loadForGameMode.mockRejectedValueOnce(
      new Error('Failed to load script: js/questionGenerator.js')
    );
    await setGameMode('quiz');
    expect(notice()).not.toBeNull();
    loadForGameMode.mockResolvedValue();
    await setGameMode('quiz');
    expect(startQuizMode).toHaveBeenCalled();
    expect(notice()).toBeNull();
  });

  test('en anglais et en espagnol, y compris quand la langue change pendant l’affichage', async () => {
    setOnline(false);
    loadForGameMode.mockRejectedValue(new Error('Failed to load script: js/modes/QuizMode.js'));
    const EN = dictionary('en');
    setTranslations(EN);
    setCurrentLanguage('en');
    await setGameMode('quiz');
    expect(notice().querySelector('p').textContent).toBe(EN.mode_load_error);
    const ES = dictionary('es');
    setTranslations(ES);
    setCurrentLanguage('es');
    applyStaticTranslations();
    expect(notice().querySelector('p').textContent).toBe(ES.mode_load_error);
    expect(notice().querySelector('button').textContent).toBe(ES.load_error_close);
  });
});

describe('Un jeu d’Arcade qui ne se charge pas', () => {
  test('hors ligne : le même avis que pour un mode', async () => {
    setOnline(false);
    const screen = document.createElement('div');
    screen.id = 'game';
    document.body.appendChild(screen);
    const mode = new ArcadeMode();
    const parsed = new DOMParser().parseFromString(await mode.getCustomHTML(), 'text/html');
    screen.append(...parsed.body.childNodes);
    mode.gameScreen = screen;
    mode.attachArcadeListEvents();
    screen.querySelector('.play-arcade-btn[data-game="invasion"]').click();
    await new Promise(resolve => setTimeout(resolve, 20));
    expect(notice().querySelector('p').textContent).toBe(FR.mode_load_error);
  });
});
