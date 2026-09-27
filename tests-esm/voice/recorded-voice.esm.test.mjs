/* eslint-env jest, node */
/**
 * Voix enregistrée branchée dans le jeu (js/voice-clips.js, initRecordedVoice) : décision
 * d'après l'index et les choix du joueur, moteur branché sur la vraie file de parole
 * (js/speech.js), coupe-circuit, langue, case « Voix enregistrée ».
 */
import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import {
  FIRST_DECISION_TIMEOUT_MS,
  VOICE_STORAGE_KEYS,
  attachRecordedVoiceSetting,
  getRecordedVoiceChoice,
  getRecordedVoiceChoices,
  initRecordedVoice,
  isRecordedVoiceAvailable,
  resetRecordedVoiceForTests,
  setRecordedVoiceChoice,
  setRecordedVoicePreference,
} from '../../js/voice-clips.js';
import {
  cancelSpeech,
  isSpeechDecisionPending,
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

/** Promesse réglée quand le test le décide */
function deferred() {
  let resolve;
  const promise = new Promise(done => {
    resolve = done;
  });
  return { promise, resolve };
}

/**
 * Dépendances factices : index servi (ou réseau coupé, ou retenu jusqu'à gate.resolve()),
 * stockage, faux moteurs
 */
function setup({
  index,
  offline = false,
  gate = null,
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
      if (gate) await gate.promise;
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

  test('français et anglais : chaque langue a son moteur, sa version et son « par défaut »', async () => {
    const JANE = {
      voice: 'jane',
      version: 'jane-v1-1',
      format: 'mp3',
      audience: 'all',
      defaultOn: false,
    };
    document.body.innerHTML = `
      <label id="recorded-voice-option" hidden>
        <input type="checkbox" id="recorded-voice-toggle" checked />
      </label>`;
    const ctx = setup({ index: indexWith({ fr: ENTRY, en: JANE }) });
    await initRecordedVoice(ctx.deps);
    attachRecordedVoiceSetting(document);
    // Français activé par défaut : Lucie parle sans choix du joueur
    expect(saidByClips(ctx, 'Mode Quiz')).toBe(true);
    ctx.lang = 'en';
    ctx.bus.emit('languageChanged', { lang: 'en' });
    // Anglais disponible (case visible), mais pas activé par défaut : voix coupée
    expect(isRecordedVoiceAvailable()).toBe(true);
    expect(document.getElementById('recorded-voice-option').hidden).toBe(false);
    expect(isVoiceEnabled()).toBe(false);
    // Le joueur allume la voix : Jane parle, avec son propre moteur
    ctx.storage.set('voiceEnabled', true);
    ctx.bus.emit('voice:preference-changed', {});
    expect(saidByClips(ctx, 'Quiz Mode')).toBe(true);
    expect(ctx.engines.map(e => [e.options.lang, e.options.entry.version])).toEqual([
      ['fr', 'lucie-v3-1'],
      ['en', 'jane-v1-1'],
    ]);
  });

  test('repli : Plausible reçoit la cause, la langue et la voix, une fois par cause, langue et voix', async () => {
    const JANE = {
      voice: 'jane',
      version: 'jane-v1-1',
      format: 'mp3',
      audience: 'all',
      defaultOn: true,
    };
    globalThis.plausible = jest.fn();
    try {
      const ctx = setup({
        index: indexWith({ fr: ENTRY, en: JANE }),
        stored: { voiceEnabled: true },
      });
      await initRecordedVoice(ctx.deps);
      saidByClips(ctx, 'Mode Quiz');
      ctx.lang = 'en';
      ctx.bus.emit('languageChanged', { lang: 'en' });
      saidByClips(ctx, 'Quiz Mode');
      const [french, english] = ctx.engines;
      french.options.onFallback('absent');
      french.options.onFallback('absent');
      english.options.onFallback('absent');
      english.options.onFallback('slow');
      expect(globalThis.plausible.mock.calls).toEqual([
        ['Voice fallback', { props: { cause: 'absent', lang: 'fr', voice: 'lucie' } }],
        ['Voice fallback', { props: { cause: 'absent', lang: 'en', voice: 'jane' } }],
        ['Voice fallback', { props: { cause: 'slow', lang: 'en', voice: 'jane' } }],
      ]);
    } finally {
      delete globalThis.plausible;
    }
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

  describe('autres voix d’une langue : choix du joueur', () => {
    const SULAFAT = {
      voice: 'sulafat',
      version: 'sulafat-v1-1',
      format: 'mp3',
      audience: 'all',
      defaultOn: true,
      provider: 'google',
    };
    const JANE = {
      voice: 'jane',
      version: 'jane-v1-1',
      format: 'mp3',
      audience: 'all',
      provider: 'mistral',
    };
    const HINTS = {
      recorded_voice_hint_google: 'Voix créée avec Google',
      recorded_voice_hint_mistral: 'Voix créée avec Mistral AI',
    };
    const twoVoices = () => indexWith({ fr: ENTRY, en: { ...SULAFAT, alternatives: [JANE] } });
    const engineVersion = ctx => ctx.engines.at(-1).options.entry.version;

    function mountSetting() {
      document.body.innerHTML = `
        <label id="recorded-voice-option" hidden>
          <input type="checkbox" id="recorded-voice-toggle" checked />
          <small id="recorded-voice-hint" data-translate="recorded_voice_hint">Mention</small>
        </label>
        <div id="recorded-voice-choice-row" hidden>
          <select id="recorded-voice-choice"></select>
        </div>`;
      attachRecordedVoiceSetting(document);
      return {
        row: document.getElementById('recorded-voice-choice-row'),
        select: document.getElementById('recorded-voice-choice'),
        toggle: document.getElementById('recorded-voice-toggle'),
        hint: document.getElementById('recorded-voice-hint'),
      };
    }

    test('Jane choisie : le moteur prend sa version ; le choix ne vaut que pour sa langue', async () => {
      const ctx = setup({ index: twoVoices(), lang: 'en' });
      await initRecordedVoice(ctx.deps);
      expect(engineVersion(ctx)).toBe('sulafat-v1-1');
      setRecordedVoiceChoice('jane');
      expect(ctx.storage.get(VOICE_STORAGE_KEYS.choice)).toEqual({ en: 'jane' });
      expect(engineVersion(ctx)).toBe('jane-v1-1');
      expect(saidByClips(ctx, 'Quiz Mode')).toBe(true);
      expect(getRecordedVoiceChoice()).toEqual({ voice: 'jane', provider: 'mistral' });
      ctx.lang = 'fr';
      ctx.bus.emit('languageChanged', { lang: 'fr' });
      expect(getRecordedVoiceChoice().voice).toBe('lucie');
      expect(getRecordedVoiceChoices()).toHaveLength(1);
    });

    test('voix choisie retirée de l’index : retour à la voix par défaut', async () => {
      const ctx = setup({
        index: indexWith({ en: SULAFAT }),
        stored: { [VOICE_STORAGE_KEYS.choice]: { en: 'jane' } },
        lang: 'en',
      });
      await initRecordedVoice(ctx.deps);
      expect(engineVersion(ctx)).toBe('sulafat-v1-1');
    });

    test('menu : visible dès deux voix, nom et service ; la mention suit la voix choisie', async () => {
      const ctx = setup({ index: twoVoices(), lang: 'en', translations: HINTS });
      await initRecordedVoice(ctx.deps);
      const { row, select, hint } = mountSetting();
      expect(row.hidden).toBe(false);
      expect([...select.options].map(o => [o.value, o.textContent, o.selected])).toEqual([
        ['sulafat', 'Sulafat (Google)', true],
        ['jane', 'Jane (Mistral AI)', false],
      ]);
      expect(hint.dataset.translate).toBe('recorded_voice_hint_google');
      expect(hint.textContent).toBe(HINTS.recorded_voice_hint_google);
      select.value = 'jane';
      select.dispatchEvent(new Event('change'));
      expect(ctx.storage.get(VOICE_STORAGE_KEYS.choice)).toEqual({ en: 'jane' });
      expect(select.value).toBe('jane');
      expect(hint.dataset.translate).toBe('recorded_voice_hint_mistral');
      expect(hint.textContent).toBe(HINTS.recorded_voice_hint_mistral);
    });

    test('menu : désactivé case décochée ; caché là où la langue n’a qu’une voix', async () => {
      const ctx = setup({ index: twoVoices(), lang: 'en', translations: HINTS });
      await initRecordedVoice(ctx.deps);
      const { row, select, toggle, hint } = mountSetting();
      toggle.checked = false;
      toggle.dispatchEvent(new Event('change'));
      expect(select.disabled).toBe(true);
      ctx.lang = 'fr';
      ctx.bus.emit('languageChanged', { lang: 'fr' });
      expect(row.hidden).toBe(true);
      // Sans service dans l'index, la mention de la langue revient
      expect(hint.dataset.translate).toBe('recorded_voice_hint');
    });
  });
});

describe('Première visite : la décision attend l’index (au plus 1,5 s)', () => {
  test('une phrase demandée avant l’index est dite par les clips à son arrivée', async () => {
    const gate = deferred();
    const ctx = setup({ index: indexWith({ fr: ENTRY }), gate });
    const init = initRecordedVoice(ctx.deps);
    expect(isSpeechDecisionPending()).toBe(true);
    speak('Mode Quiz', { priority: 'high' });
    expect(ctx.engines).toHaveLength(0);
    gate.resolve();
    await init;
    expect(isSpeechDecisionPending()).toBe(false);
    expect(ctx.engines[0].spoken).toEqual(['Mode Quiz']);
  });

  test('l’état n’est annoncé décidé qu’à la fin de l’attente (barre du haut)', async () => {
    const gate = deferred();
    const ctx = setup({ index: indexWith({ fr: ENTRY }), gate });
    const pendingAtEmit = [];
    ctx.bus.on('voice:changed', () => pendingAtEmit.push(isSpeechDecisionPending()));
    const init = initRecordedVoice(ctx.deps);
    gate.resolve();
    await init;
    expect(pendingAtEmit.at(-1)).toBe(false);
    expect(ctx.bus.emitted.at(-1)).toEqual({
      event: 'voice:changed',
      detail: { available: true, active: true, engine: 'clips' },
    });
  });

  test('index trop lent : décision sans lui, phrase retenue oubliée ; il agit à son arrivée', async () => {
    jest.useFakeTimers();
    try {
      const gate = deferred();
      const ctx = setup({ index: indexWith({ fr: ENTRY }), gate });
      const init = initRecordedVoice(ctx.deps);
      speak('Mode Quiz', { priority: 'high' });
      jest.advanceTimersByTime(FIRST_DECISION_TIMEOUT_MS - 1);
      expect(isSpeechDecisionPending()).toBe(true);
      jest.advanceTimersByTime(1);
      expect(isSpeechDecisionPending()).toBe(false);
      expect(isVoiceEnabled()).toBe(false);
      expect(ctx.bus.emitted.at(-1).detail.active).toBe(false);
      gate.resolve();
      await init;
      expect(isVoiceEnabled()).toBe(true);
      expect(ctx.engines).toHaveLength(1);
      expect(ctx.engines[0].spoken).toEqual([]);
    } finally {
      jest.useRealTimers();
    }
  });

  test('réseau coupé à la première visite : décision aussitôt, voix coupée (v21)', async () => {
    const ctx = setup({ offline: true });
    await initRecordedVoice(ctx.deps);
    expect(isSpeechDecisionPending()).toBe(false);
    expect(isVoiceEnabled()).toBe(false);
  });

  test.each([
    ['une copie de l’index', { [VOICE_STORAGE_KEYS.index]: indexWith({ fr: ENTRY }) }],
    ['un choix du joueur', { voiceEnabled: false }],
  ])('avec %s, pas d’attente : la décision est immédiate', async (_label, stored) => {
    const gate = deferred();
    const ctx = setup({ index: indexWith({ fr: ENTRY }), gate, stored });
    const init = initRecordedVoice(ctx.deps);
    expect(isSpeechDecisionPending()).toBe(false);
    gate.resolve();
    await init;
  });

  test('remise à zéro (tests) : l’attente est levée sans rien dire', () => {
    const ctx = setup({ index: indexWith({ fr: ENTRY }), gate: deferred() });
    initRecordedVoice(ctx.deps);
    speak('Mode Quiz', { priority: 'high' });
    resetRecordedVoiceForTests();
    expect(isSpeechDecisionPending()).toBe(false);
    expect(ctx.engines).toHaveLength(0);
  });
});
