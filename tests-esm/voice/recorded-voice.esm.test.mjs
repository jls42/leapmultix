/* eslint-env jest, node */
/**
 * Voix enregistrée branchée dans le jeu (js/voice-clips.js, initRecordedVoice) : décision
 * d'après l'index et les choix du joueur, moteur branché sur la vraie file de parole
 * (js/speech.js), coupe-circuit, langue, case « Voix enregistrée ».
 */
import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import {
  VOICE_STORAGE_KEYS,
  attachRecordedVoiceSetting,
  initRecordedVoice,
  isRecordedVoiceAvailable,
  resetRecordedVoiceForTests,
  setRecordedVoicePreference,
} from '../../js/voice-clips.js';
import {
  cancelSpeech,
  isVoiceEnabled,
  setSpeechEngine,
  setVoiceEnabledResolver,
  speak,
} from '../../js/speech.js';

const ENTRY = {
  voice: 'lucie',
  version: 'lucie-v3-1',
  format: 'mp3',
  audience: 'all',
  defaultOn: true,
};
const indexWith = languages => ({ schema: 'cyrb53-nfc-1', languages });

function memoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    get: (key, fallback = null) => (data.has(key) ? data.get(key) : fallback),
    set: (key, value) => data.set(key, value),
    remove: key => data.delete(key),
  };
}

function fakeBus() {
  const handlers = {};
  return {
    emitted: [],
    on(event, handler) {
      (handlers[event] ??= []).push(handler);
    },
    emit(event, detail) {
      this.emitted.push({ event, detail });
      for (const handler of handlers[event] ?? []) handler({ detail });
    },
  };
}

/** Dépendances factices : index servi (ou réseau coupé), stockage, faux moteurs */
function setup({
  index,
  offline = false,
  stored = {},
  lang = 'fr',
  base = '/voice/',
  translations = { correct: ['Bravo !', 'Super !'] },
} = {}) {
  const ctx = { lang, engines: [], storage: memoryStorage(stored), bus: fakeBus() };
  ctx.deps = {
    base,
    localMark: false,
    storage: ctx.storage,
    eventBus: ctx.bus,
    lang: () => ctx.lang,
    translations: () => translations,
    canPlayMp3: () => true,
    fetchImpl: async () => {
      if (offline) throw new TypeError('Failed to fetch');
      return { ok: true, json: async () => index };
    },
    createAudio: () => ({}),
    createEngine: options => {
      const engine = {
        options,
        spoken: [],
        isAvailable: () => true,
        preload: jest.fn(),
        start(text, handlers) {
          engine.spoken.push(text);
          handlers.onStarted();
          return { stop() {} };
        },
      };
      ctx.engines.push(engine);
      return engine;
    },
  };
  return ctx;
}

/** Ce que dit la file : le texte arrive-t-il au moteur des clips ? */
function saidByClips(ctx, text) {
  cancelSpeech();
  const before = ctx.engines.reduce((n, e) => n + e.spoken.length, 0);
  speak(text);
  const after = ctx.engines.reduce((n, e) => n + e.spoken.length, 0);
  return after > before;
}

beforeEach(() => {
  resetRecordedVoiceForTests();
  setSpeechEngine(null);
  setVoiceEnabledResolver(null);
  localStorage.clear();
  document.body.innerHTML = '';
});

describe('Voix enregistrée dans le jeu', () => {
  test('sans adresse de base (forks, développement) : rien ne change, voix coupée (v21)', async () => {
    const ctx = setup({ base: null, index: indexWith({ fr: ENTRY }) });
    await initRecordedVoice(ctx.deps);
    expect(isVoiceEnabled()).toBe(false);
    expect(ctx.engines).toEqual([]);
    expect(ctx.storage.data.size).toBe(0);
  });

  test('première visite, voix activée par défaut : clips branchés, copie de l’index gardée', async () => {
    const ctx = setup({ index: indexWith({ fr: ENTRY }) });
    await initRecordedVoice(ctx.deps);
    expect(isVoiceEnabled()).toBe(true);
    expect(ctx.engines).toHaveLength(1);
    expect(ctx.engines[0].options).toMatchObject({ base: '/voice/', lang: 'fr', entry: ENTRY });
    expect(ctx.engines[0].preload).toHaveBeenCalledWith(['Bravo !', 'Super !']);
    expect(saidByClips(ctx, 'Mode Quiz')).toBe(true);
    expect(ctx.storage.get(VOICE_STORAGE_KEYS.index)).toEqual(indexWith({ fr: ENTRY }));
    expect(ctx.bus.emitted.at(-1)).toEqual({
      event: 'voice:changed',
      detail: { available: true, active: true, engine: 'clips' },
    });
  });

  test('clips chargés d’avance : les annonces de mode, puis les « Bravo »', async () => {
    const ctx = setup({
      index: indexWith({ fr: ENTRY }),
      translations: {
        quiz_mode: 'Mode Quiz',
        challenge_mode: 'Mode Défi',
        adventure_mode: 'Mode Aventure',
        discovery_mode: 'Mode Découverte',
        arcade_mode: 'Mode Arcade',
        correct: ['Bravo !', 'Super !'],
      },
    });
    await initRecordedVoice(ctx.deps);
    expect(ctx.engines[0].preload).toHaveBeenCalledWith([
      'Mode Quiz',
      'Mode Défi',
      'Mode Aventure',
      'Mode Découverte',
      'Mode Arcade',
      'Bravo !',
      'Super !',
    ]);
  });

  test('voix coupée par le joueur : elle le reste, même activée par défaut', async () => {
    const ctx = setup({ index: indexWith({ fr: ENTRY }), stored: { voiceEnabled: false } });
    await initRecordedVoice(ctx.deps);
    expect(isVoiceEnabled()).toBe(false);
    expect(saidByClips(ctx, 'Mode Quiz')).toBe(false);
  });

  test('pas activée par défaut : voix coupée tant que le joueur ne l’allume pas, puis clips', async () => {
    const ctx = setup({ index: indexWith({ fr: { ...ENTRY, defaultOn: false } }) });
    await initRecordedVoice(ctx.deps);
    expect(isVoiceEnabled()).toBe(false);
    ctx.storage.set('voiceEnabled', true);
    ctx.bus.emit('voice:preference-changed', { enabled: true });
    expect(isVoiceEnabled()).toBe(true);
    expect(saidByClips(ctx, 'Mode Quiz')).toBe(true);
  });

  test('audience « test » : seulement pour un navigateur marqué testeur', async () => {
    const index = indexWith({ fr: { ...ENTRY, audience: 'test' } });
    const visitor = setup({ index });
    await initRecordedVoice(visitor.deps);
    expect(isRecordedVoiceAvailable()).toBe(false);
    expect(isVoiceEnabled()).toBe(false);

    resetRecordedVoiceForTests();
    const tester = setup({ index, stored: { [VOICE_STORAGE_KEYS.tester]: true } });
    await initRecordedVoice(tester.deps);
    expect(isRecordedVoiceAvailable()).toBe(true);
    expect(saidByClips(tester, 'Mode Quiz')).toBe(true);
  });

  test('hors ligne : la dernière copie de l’index décide', async () => {
    const ctx = setup({
      offline: true,
      stored: { [VOICE_STORAGE_KEYS.index]: indexWith({ fr: ENTRY }) },
    });
    await initRecordedVoice(ctx.deps);
    expect(isVoiceEnabled()).toBe(true);
    expect(saidByClips(ctx, 'Mode Quiz')).toBe(true);
  });

  test('coupe-circuit : langue retirée de l’index, retour à la synthèse ou à la voix coupée', async () => {
    const copy = { [VOICE_STORAGE_KEYS.index]: indexWith({ fr: ENTRY }) };
    const implicit = setup({ index: indexWith({}), stored: copy });
    await initRecordedVoice(implicit.deps);
    expect(isVoiceEnabled()).toBe(false);
    expect(implicit.storage.get(VOICE_STORAGE_KEYS.index)).toEqual(indexWith({}));

    resetRecordedVoiceForTests();
    const explicit = setup({ index: indexWith({}), stored: { ...copy, voiceEnabled: true } });
    await initRecordedVoice(explicit.deps);
    expect(isVoiceEnabled()).toBe(true);
    expect(saidByClips(explicit, 'Mode Quiz')).toBe(false);
  });

  test('changement de langue : pas de clips en anglais, retour aux clips en français', async () => {
    const ctx = setup({ index: indexWith({ fr: ENTRY }), stored: { voiceEnabled: true } });
    await initRecordedVoice(ctx.deps);
    ctx.lang = 'en';
    ctx.bus.emit('languageChanged', { lang: 'en' });
    expect(isRecordedVoiceAvailable()).toBe(false);
    expect(saidByClips(ctx, 'Quiz Mode')).toBe(false);
    ctx.lang = 'fr';
    ctx.bus.emit('languageChanged', { lang: 'fr' });
    expect(saidByClips(ctx, 'Mode Quiz')).toBe(true);
    expect(ctx.engines).toHaveLength(1);
  });

  test('case décochée : synthèse, parole toujours active ; recochée : le même moteur revient', async () => {
    const ctx = setup({ index: indexWith({ fr: ENTRY }) });
    await initRecordedVoice(ctx.deps);
    setRecordedVoicePreference(false);
    expect(ctx.storage.get(VOICE_STORAGE_KEYS.recorded)).toBe(false);
    expect(isVoiceEnabled()).toBe(true);
    expect(saidByClips(ctx, 'Mode Quiz')).toBe(false);
    setRecordedVoicePreference(true);
    expect(saidByClips(ctx, 'Mode Quiz')).toBe(true);
    expect(ctx.engines).toHaveLength(1);
  });

  test('réglage : case visible là où la voix est disponible, suit la langue et le choix', async () => {
    document.body.innerHTML = `
      <label id="recorded-voice-option" hidden>
        <input type="checkbox" id="recorded-voice-toggle" checked />
      </label>`;
    const ctx = setup({ index: indexWith({ fr: ENTRY }) });
    await initRecordedVoice(ctx.deps);
    attachRecordedVoiceSetting(document);
    const option = document.getElementById('recorded-voice-option');
    const toggle = document.getElementById('recorded-voice-toggle');
    expect(option.hidden).toBe(false);
    expect(toggle.checked).toBe(true);
    toggle.checked = false;
    toggle.dispatchEvent(new Event('change'));
    expect(ctx.storage.get(VOICE_STORAGE_KEYS.recorded)).toBe(false);
    ctx.lang = 'en';
    ctx.bus.emit('languageChanged', { lang: 'en' });
    expect(option.hidden).toBe(true);
  });
});
