/* eslint-env jest, node */
/**
 * File de parole (js/speech.js) : deux emplacements, jetons, fin bornée, arrêts. Un
 * moteur factice rend chaque événement déterministe : on décide quand une phrase part,
 * finit ou échoue.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';

const audioState = { volume: 1, muted: false };
const storageState = { voiceEnabled: true };
const busHandlers = [];

jest.unstable_mockModule('../js/core/storage.js', () => ({
  default: { loadVoiceEnabled: () => storageState.voiceEnabled },
}));
jest.unstable_mockModule('../js/core/audio.js', () => ({
  AudioManager: { getVolume: () => audioState.volume, isMuted: () => audioState.muted },
}));
jest.unstable_mockModule('../js/core/eventBus.js', () => ({
  eventBus: { on: (name, handler) => busHandlers.push({ name, handler }) },
}));

const speech = await import('../js/speech.js');
const {
  speak,
  cancelSpeech,
  setSpeechEngine,
  getSynthesisEngine,
  estimateSpeechDurationMs,
  updateSpeechVoice,
  preloadSpeech,
} = speech;

/** Moteur factice : chaque phrase reçue garde ses rappels et sa poignée */
function createFakeEngine() {
  const starts = [];
  return {
    starts,
    texts: () => starts.map(s => s.text),
    last: () => starts.at(-1),
    start(text, ctx) {
      const handle = { stop: jest.fn(), setVolume: jest.fn() };
      starts.push({ text, ctx, handle });
      return handle;
    },
  };
}

function emitVolume(detail) {
  for (const { name, handler } of busHandlers) {
    if (name === 'volumeChanged') handler({ detail });
  }
}

let engine;

beforeEach(() => {
  storageState.voiceEnabled = true;
  emitVolume({ volume: 1, muted: false });
  engine = createFakeEngine();
  setSpeechEngine(engine);
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  cancelSpeech();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('Règles de la file', () => {
  test('une phrase part tout de suite quand rien ne parle', () => {
    speak('Bravo !');
    expect(engine.texts()).toEqual(['Bravo !']);
  });

  test('une phrase normale coupe la phrase normale en cours', () => {
    speak('Combien font 7 fois 8 ?');
    const question = engine.last();
    speak('Bravo !');
    expect(question.handle.stop).toHaveBeenCalledTimes(1);
    expect(engine.texts()).toEqual(['Combien font 7 fois 8 ?', 'Bravo !']);
  });

  test('une annonce coupe la phrase en cours, annonce précédente comprise : la dernière gagne', () => {
    speak('Bravo !');
    const bravo = engine.last();
    speak('Mode Quiz', { priority: 'high' });
    const quiz = engine.last();
    speak('Mode Défi', { priority: 'high' });
    expect(bravo.handle.stop).toHaveBeenCalledTimes(1);
    expect(quiz.handle.stop).toHaveBeenCalledTimes(1);
    expect(engine.texts()).toEqual(['Bravo !', 'Mode Quiz', 'Mode Défi']);
  });

  test('une phrase normale attend la fin de l’annonce, sans la couper ni s’y coller', () => {
    speak('Mode Quiz', { priority: 'high' });
    const announcement = engine.last();
    speak('Combien font 7 fois 8 ?');
    expect(announcement.handle.stop).not.toHaveBeenCalled();
    expect(engine.texts()).toEqual(['Mode Quiz']);

    announcement.ctx.onEnded();
    // Deux énoncés distincts : jamais « Mode Quiz. Combien font… »
    expect(engine.texts()).toEqual(['Mode Quiz', 'Combien font 7 fois 8 ?']);
  });

  test('en attente, la dernière phrase arrivée gagne', () => {
    speak('Mode Quiz', { priority: 'high' });
    speak('Combien font 2 fois 3 ?');
    speak('Combien font 7 fois 8 ?');
    engine.last().ctx.onEnded();
    expect(engine.texts()).toEqual(['Mode Quiz', 'Combien font 7 fois 8 ?']);
  });

  test('une phrase en file attend la fin de la phrase en cours sans la couper', () => {
    speak('Bravo !');
    const bravo = engine.last();
    speak('Combien font 7 fois 8 ?', { queue: true });
    expect(bravo.handle.stop).not.toHaveBeenCalled();
    expect(engine.texts()).toEqual(['Bravo !']);

    bravo.ctx.onEnded();
    expect(engine.texts()).toEqual(['Bravo !', 'Combien font 7 fois 8 ?']);
  });

  test('une phrase en file part tout de suite quand rien ne parle', () => {
    speak('Combien font 7 fois 8 ?', { queue: true });
    expect(engine.texts()).toEqual(['Combien font 7 fois 8 ?']);
  });

  test('une phrase en file est oubliée quand une autre phrase arrive', () => {
    speak('Bravo !');
    const bravo = engine.last();
    speak('Combien font 7 fois 8 ?', { queue: true });
    speak('Presque ! La bonne réponse est 56.');
    expect(bravo.handle.stop).toHaveBeenCalledTimes(1);

    engine.last().ctx.onEnded();
    expect(engine.texts()).toEqual(['Bravo !', 'Presque ! La bonne réponse est 56.']);
  });

  test('cancelSpeech coupe la phrase en cours et oublie celle en attente', () => {
    speak('Bravo !');
    const bravo = engine.last();
    speak('Combien font 7 fois 8 ?', { queue: true });
    cancelSpeech();
    expect(bravo.handle.stop).toHaveBeenCalledTimes(1);

    // La fin tardive de la phrase coupée ne fait rien partir
    bravo.ctx.onEnded();
    expect(engine.texts()).toEqual(['Bravo !']);

    // La question oubliée ne ressort pas après la phrase suivante
    speak('Mode Quiz', { priority: 'high' });
    engine.last().ctx.onEnded();
    expect(engine.texts()).toEqual(['Bravo !', 'Mode Quiz']);
  });

  test('les événements tardifs d’une phrase coupée sont ignorés : ni lecture, ni repli signalé', () => {
    speak('Combien font 7 fois 8 ?');
    const question = engine.last();
    speak('Mode Quiz', { priority: 'high' });
    speak('Combien font 2 fois 3 ?');

    question.ctx.onStarted();
    question.ctx.onFailed(new Error('clip absent'));
    question.ctx.onEnded();
    question.ctx.setDeadline(0);
    expect(engine.texts()).toEqual(['Combien font 7 fois 8 ?', 'Mode Quiz']);
    expect(console.warn).not.toHaveBeenCalled();
  });

  test('un échec du moteur fait passer à la suite et ne se signale qu’une fois', () => {
    speak('Mode Quiz', { priority: 'high' });
    speak('Combien font 7 fois 8 ?');
    engine.last().ctx.onFailed(new Error('voix absente'));
    expect(engine.texts()).toEqual(['Mode Quiz', 'Combien font 7 fois 8 ?']);
    engine.last().ctx.onFailed(new Error('voix absente'));
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  test('chaque phrase part seule vers le moteur, avec son propre jeton', () => {
    speak('Mode Quiz', { priority: 'high' });
    speak('Combien font 7 fois 8 ?');
    engine.last().ctx.onEnded();
    const [first, second] = engine.starts;
    expect(second.ctx.token).toBeGreaterThan(first.ctx.token);
  });
});

describe('Fin bornée', () => {
  test('un son bloqué ne retient rien : au-delà de la durée estimée, la file avance', async () => {
    jest.useFakeTimers();
    speak('Mode Quiz', { priority: 'high' });
    const stuck = engine.last();
    speak('Combien font 7 fois 8 ?');
    stuck.ctx.onStarted();

    await jest.advanceTimersByTimeAsync(estimateSpeechDurationMs('Mode Quiz') - 10);
    expect(engine.texts()).toEqual(['Mode Quiz']);
    await jest.advanceTimersByTimeAsync(20);
    expect(stuck.handle.stop).toHaveBeenCalledTimes(1);
    expect(engine.texts()).toEqual(['Mode Quiz', 'Combien font 7 fois 8 ?']);
  });

  test('une phrase qui ne démarre jamais est aussi tenue pour finie', async () => {
    jest.useFakeTimers();
    speak('Mode Quiz', { priority: 'high' });
    const silent = engine.last();
    speak('Combien font 7 fois 8 ?');
    await jest.advanceTimersByTimeAsync(4000 + estimateSpeechDurationMs('Mode Quiz') + 10);
    expect(silent.handle.stop).toHaveBeenCalledTimes(1);
    expect(engine.texts()).toEqual(['Mode Quiz', 'Combien font 7 fois 8 ?']);
  });

  test('le moteur peut fixer lui-même la fin bornée (durée réelle d’un clip)', async () => {
    jest.useFakeTimers();
    speak('Mode Quiz', { priority: 'high' });
    const clip = engine.last();
    speak('Combien font 7 fois 8 ?');
    clip.ctx.setDeadline(300);
    await jest.advanceTimersByTimeAsync(310);
    expect(clip.handle.stop).toHaveBeenCalledTimes(1);
    expect(engine.texts()).toEqual(['Mode Quiz', 'Combien font 7 fois 8 ?']);
  });

  test('la fin estimée grandit avec le texte', () => {
    expect(estimateSpeechDurationMs('Combien font 7 fois 8 ?')).toBeGreaterThan(
      estimateSpeechDurationMs('Bravo !')
    );
  });
});

describe('Arrêts et réglages', () => {
  test('couper le son arrête la phrase en cours ; rien ne se dit tant qu’il est coupé', () => {
    speak('Bravo !');
    const bravo = engine.last();
    emitVolume({ volume: 0, muted: true });
    expect(bravo.handle.stop).toHaveBeenCalledTimes(1);
    speak('Combien font 7 fois 8 ?');
    expect(engine.texts()).toEqual(['Bravo !']);
  });

  test('un nouveau volume s’applique à la phrase en cours', () => {
    speak('Combien font 7 fois 8 ?');
    emitVolume({ volume: 0.4, muted: false });
    expect(engine.last().handle.setVolume).toHaveBeenCalledWith(0.4);
    speak('Bravo !');
    expect(engine.last().ctx.volume).toBe(0.4);
  });

  test('voix coupée : rien ne se dit', () => {
    storageState.voiceEnabled = false;
    speak('Bravo !');
    expect(engine.texts()).toEqual([]);
  });

  test('ni traduction manquante, ni phrase vide', () => {
    speak('[table_of] 7');
    speak('   ');
    speak(undefined);
    expect(engine.texts()).toEqual([]);
  });

  test('changer de langue arrête la phrase en cours ; la même langue ne change rien', () => {
    speak('Bravo !');
    const bravo = engine.last();
    updateSpeechVoice('fr');
    expect(bravo.handle.stop).not.toHaveBeenCalled();
    updateSpeechVoice('en');
    expect(bravo.handle.stop).toHaveBeenCalledTimes(1);
    updateSpeechVoice('fr');
  });

  test('un onglet caché arrête la phrase en cours et oublie celle en attente', () => {
    speak('Mode Quiz', { priority: 'high' });
    const announcement = engine.last();
    speak('Combien font 7 fois 8 ?');
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    try {
      document.dispatchEvent(new Event('visibilitychange'));
    } finally {
      // Retire la valeur posée : le getter de jsdom reprend la main
      delete document.visibilityState;
    }
    expect(announcement.handle.stop).toHaveBeenCalledTimes(1);
    announcement.ctx.onEnded();
    expect(engine.texts()).toEqual(['Mode Quiz']);
  });

  test('changer de moteur coupe la phrase de l’ancien ; null revient à la synthèse', () => {
    speak('Bravo !');
    const bravo = engine.last();
    const other = createFakeEngine();
    setSpeechEngine(other);
    expect(bravo.handle.stop).toHaveBeenCalledTimes(1);
    speak('Combien font 7 fois 8 ?');
    expect(other.texts()).toEqual(['Combien font 7 fois 8 ?']);

    setSpeechEngine(null);
    const synthesis = getSynthesisEngine();
    expect(synthesis.name).toBe('synthesis');
  });
});

describe('Moteur de synthèse', () => {
  let spoken;
  let cancel;

  function installSynthesis() {
    spoken = [];
    cancel = jest.fn();
    globalThis.SpeechSynthesisUtterance = function SpeechSynthesisUtterance(text) {
      this.text = String(text ?? '');
    };
    globalThis.speechSynthesis = {
      speak: utterance => spoken.push(utterance),
      cancel,
      getVoices: () => [],
      speaking: false,
      pending: false,
    };
  }

  afterEach(() => {
    delete globalThis.speechSynthesis;
    delete globalThis.SpeechSynthesisUtterance;
  });

  function startWithSynthesis(text) {
    const events = { started: 0, ended: 0, failed: [] };
    const handle = getSynthesisEngine().start(text, {
      lang: 'fr-FR',
      token: 1,
      volume: 0.5,
      onStarted: () => events.started++,
      onEnded: () => events.ended++,
      onFailed: error => events.failed.push(error),
      setDeadline: () => {},
    });
    return { handle, events, utterance: spoken.at(-1) };
  }

  test('un énoncé par phrase, au volume demandé ; début et fin remontent', () => {
    installSynthesis();
    const { events, utterance } = startWithSynthesis('Bravo !');
    expect(spoken.map(u => u.text)).toEqual(['Bravo !']);
    expect(utterance.volume).toBe(0.5);
    utterance.onstart();
    utterance.onend();
    utterance.onend();
    expect(events).toEqual({ started: 1, ended: 1, failed: [] });
  });

  test('une coupure venue d’ailleurs vaut fin ; une vraie erreur est un échec', () => {
    installSynthesis();
    const first = startWithSynthesis('Bravo !');
    first.utterance.onerror({ error: 'interrupted' });
    expect(first.events.ended).toBe(1);

    const second = startWithSynthesis('Combien font 7 fois 8 ?');
    second.utterance.onerror({ error: 'synthesis-failed' });
    expect(second.events.failed).toHaveLength(1);
    expect(second.events.ended).toBe(0);
  });

  test('stop coupe la synthèse et fait taire les événements suivants', () => {
    installSynthesis();
    const { handle, events, utterance } = startWithSynthesis('Bravo !');
    handle.stop();
    expect(cancel).toHaveBeenCalledTimes(1);
    utterance.onerror({ error: 'canceled' });
    utterance.onend();
    expect(events).toEqual({ started: 0, ended: 0, failed: [] });
  });

  test('sans speechSynthesis, le moteur n’est pas disponible et la phrase échoue', () => {
    expect(getSynthesisEngine().isAvailable()).toBe(false);
    const events = { failed: [] };
    getSynthesisEngine().start('Bravo !', {
      volume: 1,
      onStarted: () => {},
      onEnded: () => {},
      onFailed: error => events.failed.push(error),
      setDeadline: () => {},
    });
    expect(events.failed).toHaveLength(1);
  });

  test('le déverrouillage dit un énoncé vide et muet', () => {
    installSynthesis();
    expect(getSynthesisEngine().unlock()).toBe(true);
    expect(spoken.map(u => [u.text, u.volume])).toEqual([['', 0]]);
  });

  test('la file passe par la synthèse par défaut : un énoncé par speak(), sans collage', () => {
    installSynthesis();
    setSpeechEngine(null);
    speak('Mode Quiz', { priority: 'high' });
    speak('Combien font 7 fois 8 ?');
    expect(spoken.map(u => u.text)).toEqual(['Mode Quiz']);
    spoken[0].onend();
    expect(spoken.map(u => u.text)).toEqual(['Mode Quiz', 'Combien font 7 fois 8 ?']);
  });
});

describe('Préchargement', () => {
  function preloadingEngine() {
    const clips = createFakeEngine();
    clips.preload = jest.fn();
    return clips;
  }

  test('le moteur en place charge les phrases qui peuvent se dire, sans les dire', () => {
    const clips = preloadingEngine();
    setSpeechEngine(clips);
    preloadSpeech(['Presque ! La bonne réponse est 56.', '[incorrect] 56', '  ', null]);
    expect(clips.preload).toHaveBeenCalledWith(['Presque ! La bonne réponse est 56.']);
    expect(clips.texts()).toEqual([]);
  });

  test('voix coupée ou son coupé : rien n’est chargé', () => {
    const clips = preloadingEngine();
    setSpeechEngine(clips);
    storageState.voiceEnabled = false;
    preloadSpeech(['Bravo !']);
    storageState.voiceEnabled = true;
    emitVolume({ volume: 1, muted: true });
    preloadSpeech(['Bravo !']);
    emitVolume({ volume: 1, muted: false });
    expect(clips.preload).not.toHaveBeenCalled();
    preloadSpeech(['Bravo !']);
    expect(clips.preload).toHaveBeenCalledTimes(1);
  });

  test('moteur sans préchargement (synthèse) ou préchargement en échec : rien ne remonte', () => {
    expect(() => preloadSpeech(['Bravo !'])).not.toThrow();
    const clips = preloadingEngine();
    clips.preload.mockImplementation(() => {
      throw new Error('stockage plein');
    });
    setSpeechEngine(clips);
    expect(() => preloadSpeech(['Bravo !'])).not.toThrow();
  });
});
