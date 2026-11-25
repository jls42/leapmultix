/* eslint-env jest, node */
/**
 * Arrêts de la parole hors des modes : navigation, arrêt par le gestionnaire de modes,
 * écran de fin d'arcade, voix coupée depuis la barre du haut. Chacun passe par la file
 * (cancelSpeech) : la phrase en cours s'arrête, rien ne reste en attente.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';

jest.unstable_mockModule('../js/components/dashboard.js', () => ({
  default: { show: () => {} },
  Dashboard: { show: () => {} },
}));
jest.unstable_mockModule('../js/mode-orchestrator.js', () => ({
  getStartingMode: () => null,
  setGameMode: async () => {},
}));

const { speak, setSpeechEngine } = await import('../js/speech.js');
const { goToSlide } = await import('../js/slides.js');
const { GameModeManager } = await import('../js/core/GameModeManager.js');
const { showArcadeGameOver } = await import('../js/arcade.js');
const { TopBar } = await import('../js/components/topBar.js');
const i18n = await import('../js/i18n-store.js');
const { eventBus } = await import('../js/core/eventBus.js');

function createFakeEngine() {
  const starts = [];
  return {
    starts,
    last: () => starts.at(-1),
    start(text, ctx) {
      const handle = { stop: jest.fn() };
      starts.push({ text, ctx, handle });
      return handle;
    },
  };
}

let engine;

beforeEach(() => {
  localStorage.setItem('voiceEnabled', 'true');
  document.body.innerHTML =
    '<section id="slide1" class="slide"></section><section id="slide4" class="slide"><div id="game"></div></section>';
  engine = createFakeEngine();
  setSpeechEngine(engine);
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  setSpeechEngine(null);
  localStorage.removeItem('voiceEnabled');
  jest.restoreAllMocks();
});

/** Une annonce en cours et une phrase qui l'attend */
function speakingWithPending() {
  speak('Mode Quiz', { priority: 'high' });
  const announcement = engine.last();
  speak('Combien font 7 fois 8 ?');
  return announcement;
}

function expectSilenced(announcement) {
  expect(announcement.handle.stop).toHaveBeenCalledTimes(1);
  // La phrase en attente a été oubliée : la fin tardive de l'annonce ne la fait pas partir
  announcement.ctx.onEnded();
  expect(engine.starts.map(s => s.text)).toEqual(['Mode Quiz']);
}

describe('Arrêts de la parole', () => {
  test('la navigation coupe la parole', async () => {
    const announcement = speakingWithPending();
    await goToSlide(1);
    expectSilenced(announcement);
  });

  test('le gestionnaire de modes coupe la parole en arrêtant un mode', async () => {
    const manager = new GameModeManager();
    manager.currentMode = { type: 'refactored', instance: { stop: () => {} } };
    const announcement = speakingWithPending();
    await manager.stopCurrentMode();
    expectSilenced(announcement);
  });

  test('l’écran de fin d’arcade coupe la voix de la partie', () => {
    const announcement = speakingWithPending();
    showArcadeGameOver(0, { persist: false });
    expectSilenced(announcement);
  });

  test('couper la voix dans la barre du haut arrête la phrase en cours', () => {
    TopBar.injectTopBarIntoSlides();
    TopBar.attachVoiceToggles();
    const announcement = speakingWithPending();
    document.querySelector('#slide1 .voice-toggle').click();
    expect(localStorage.getItem('voiceEnabled')).toBe('false');
    expectSilenced(announcement);
  });
});

describe('Voix coupée : elle le dit une dernière fois, puis se tait', () => {
  const { setTranslations } = i18n;
  const changes = [];
  const onChange = payload => changes.push((payload?.detail ?? payload).enabled);

  beforeEach(() => {
    setTranslations({ voice_disabled: 'Voix désactivée', voice_enabled: 'Voix activée' });
    changes.length = 0;
    eventBus.on('voice:preference-changed', onChange);
    TopBar.injectTopBarIntoSlides();
    TopBar.attachVoiceToggles();
  });

  afterEach(() => {
    eventBus.off('voice:preference-changed', onChange);
    setTranslations({});
  });

  const toggle = () => document.querySelector('#slide1 .voice-toggle').click();
  const flush = () => new Promise(resolve => setTimeout(resolve, 0));

  test('la question en cours s’arrête, « Voix désactivée » part, le choix est enregistré', () => {
    const announcement = speakingWithPending();
    toggle();
    expect(announcement.handle.stop).toHaveBeenCalledTimes(1);
    expect(engine.starts.map(s => s.text)).toEqual(['Mode Quiz', 'Voix désactivée']);
    expect(engine.last().handle.stop).not.toHaveBeenCalled();
    expect(localStorage.getItem('voiceEnabled')).toBe('false');
    expect(document.querySelector('#slide1 .voice-toggle').hasAttribute('data-voice-on')).toBe(
      false
    );
  });

  test('pendant sa dernière phrase, rien d’autre ne se dit et elle n’est pas coupée', () => {
    toggle();
    const farewell = engine.last();
    speak('Combien font 7 fois 8 ?');
    speak('Mode Défi', { priority: 'high' });
    expect(engine.last()).toBe(farewell);
    expect(farewell.handle.stop).not.toHaveBeenCalled();
  });

  test('le moteur n’est prévenu qu’à la fin de la phrase : prévenu avant, il la couperait', async () => {
    toggle();
    await flush();
    expect(changes).toEqual([]);

    engine.last().ctx.onEnded();
    await flush();
    expect(changes).toEqual([false]);
    // Et plus rien ne se dit ensuite
    speak('Combien font 7 fois 8 ?');
    expect(engine.starts.map(s => s.text)).toEqual(['Voix désactivée']);
  });

  test('rallumée avant la fin de la phrase : « Voix activée », et le moteur apprend le choix du moment', async () => {
    toggle();
    const farewell = engine.last();
    // Un second geste (le même geste ne bascule qu'une fois : singleActivation)
    await flush();
    toggle();
    expect(localStorage.getItem('voiceEnabled')).toBe('true');
    expect(farewell.handle.stop).toHaveBeenCalledTimes(1);
    expect(engine.last().text).toBe('Voix activée');
    await flush();
    // Jamais « coupée » : la voix a été rallumée avant que la phrase d'adieu finisse
    expect(changes).not.toContain(false);
    expect(changes.at(-1)).toBe(true);
  });

  test('sans phrase à dire (traduction absente), la voix se coupe quand même tout de suite', async () => {
    setTranslations({});
    toggle();
    expect(engine.starts).toEqual([]);
    expect(localStorage.getItem('voiceEnabled')).toBe('false');
    await flush();
    expect(changes).toEqual([false]);
  });
});
