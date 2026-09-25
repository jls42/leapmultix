/**
 * Voix enregistrée : le jeu lit des phrases pré-enregistrées (clips MP3) au lieu de la
 * synthèse de l'appareil, qui reste le repli de chaque phrase. Voir docs/voix-enregistree.md.
 *
 * - Adresse de base : balise <meta name="leapmultix-voice-base">, que deploy.sh remplit
 *   avec « /voice/ », seule valeur acceptée. Vide dans le dépôt : forks et développement
 *   local n'envoient aucune requête ; ?voix=local lit /voice/ d'un serveur local.
 * - Index /voice/index.json (js/core/voice-index.js) : langues, versions, audience. La
 *   dernière copie reçue sert hors ligne. ?voix=test marque le navigateur comme testeur,
 *   ?voix=off retire les marques.
 * - Activation (js/core/voice-activation.js) : parole active et moteur.
 * - Moteur des clips (createClipEngine), branché sur la file de js/speech.js : un seul
 *   <audio>, clip téléchargé par fetch() puis joué depuis une URL blob: ; repli sur la
 *   synthèse si le clip manque, n'est pas un MP3, ne démarre pas en 1,5 s, est refusé
 *   par le navigateur, ou si le réseau fait défaut.
 */
import Storage from './core/storage.js';
import { eventBus } from './core/eventBus.js';
import { voiceKey } from './core/spoken-text.js';
import { clipPath, parseVoiceIndex } from './core/voice-index.js';
import { isSpeechActive, recordedVoiceEntry, speechEngineFor } from './core/voice-activation.js';
import { getCurrentLanguage, getTranslations } from './i18n-store.js';
import { getSynthesisEngine, setSpeechEngine, setVoiceEnabledResolver } from './speech.js';

export const ACCEPTED_VOICE_BASE = '/voice/';
const META_NAME = 'leapmultix-voice-base';
/** Un clip qui n'a pas démarré dans ce délai laisse la place à la synthèse */
export const CLIP_START_TIMEOUT_MS = 1500;

export const VOICE_STORAGE_KEYS = {
  index: 'voiceIndexCopy',
  tester: 'voiceTester',
  local: 'voiceLocal',
  recorded: 'recordedVoiceEnabled',
};

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

/**
 * Silence MP3 de 0,1 s (157 octets), joué dans un geste pour déverrouiller l'élément
 * <audio> sur iOS. Inclus ici : pas de réseau, et la CSP refuse les URL data:.
 */
const SILENCE_MP3 =
  '//MQxAAAAANIAAAAAExBTUUzLjEwMFVVVVX/8xLEDQAAA0gAAAAAVVVVVVVVVVVVVVVVVVX/8xDEGwAAA0gAAAAAVVVVVVVVVVVVVVVVVf/zEMQoAAADSAAAAABVVVVVVVVVVVVVVVVV//MQxDUAAANIAAAAAFVVVVVVVVVVVVVVVVX/8xDEQgAAA0gAAAAAVVVVVVVVVVVVVVVVVQ==';

// ---------------------------------------------------------------------------------------
// Adresse de base, marques du navigateur, index
// ---------------------------------------------------------------------------------------

/**
 * Pose ou retire les marques du navigateur (?voix=test, ?voix=local, ?voix=off)
 * @param {string|null} param - Valeur de ?voix=
 * @param {{hostname: string, storage?: Object}} context
 */
export function applyVoiceParam(param, { hostname, storage = Storage }) {
  if (param === 'test') storage.set(VOICE_STORAGE_KEYS.tester, true);
  else if (param === 'local' && LOCAL_HOSTS.has(hostname))
    storage.set(VOICE_STORAGE_KEYS.local, true);
  else if (param === 'off') {
    storage.remove(VOICE_STORAGE_KEYS.tester);
    storage.remove(VOICE_STORAGE_KEYS.local);
  }
}

/**
 * Adresse de base des clips : « /voice/ », ou null (aucune requête)
 * @param {{meta: string|null, localMark: boolean, hostname: string}} context
 */
export function resolveVoiceBase({ meta, localMark, hostname }) {
  if (localMark && LOCAL_HOSTS.has(hostname)) return ACCEPTED_VOICE_BASE;
  return meta === ACCEPTED_VOICE_BASE ? ACCEPTED_VOICE_BASE : null;
}

/**
 * Index publié : validé, null s'il manque ou ne vaut rien, undefined si le réseau fait
 * défaut (on garde alors la dernière copie)
 * @param {string} base
 * @param {typeof fetch} [fetchImpl]
 */
export async function fetchVoiceIndex(base, fetchImpl = fetch) {
  let res;
  try {
    res = await fetchImpl(`${base}index.json`, { cache: 'no-cache' });
  } catch {
    return undefined;
  }
  if (!res.ok) return null;
  try {
    return parseVoiceIndex(await res.json());
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------------------
// Moteur des clips
// ---------------------------------------------------------------------------------------

const isMp3Response = res => (res.headers.get('content-type') ?? '').startsWith('audio/mpeg');

function silenceBlob() {
  const bytes = Uint8Array.from(atob(SILENCE_MP3), char => char.charCodeAt(0));
  return new Blob([bytes], { type: 'audio/mpeg' });
}

/**
 * Moteur de la file de parole (contrat en tête de js/speech.js) qui joue les clips d'une
 * langue et se replie de lui-même sur la synthèse, phrase par phrase.
 * @param {Object} options
 * @param {string} options.base - « /voice/ »
 * @param {string} options.lang
 * @param {{version: string}} options.entry - Entrée de l'index pour la langue
 * @param {Object} options.synthesis - Moteur de repli (getSynthesisEngine())
 * @param {typeof fetch} [options.fetchImpl]
 * @param {HTMLAudioElement} [options.audio]
 * @param {(cause: string) => void} [options.onFallback] - Cause d'un repli
 * @param {number} [options.startTimeoutMs]
 */
export function createClipEngine({
  base,
  lang,
  entry,
  synthesis,
  fetchImpl = (...args) => fetch(...args),
  audio = new Audio(),
  onFallback = () => {},
  startTimeoutMs = CLIP_START_TIMEOUT_MS,
  createObjectURL = blob => URL.createObjectURL(blob),
  revokeObjectURL = url => URL.revokeObjectURL(url),
}) {
  /** Phrases sans clip, retenues pour la session : on ne les redemande pas */
  const absent = new Set();
  const preloaded = new Set();
  /** Phrase qui possède l'élément <audio> */
  let owner = null;

  const urlFor = key => `${base}${clipPath(lang, entry, key)}`;

  function releaseAudio(phrase) {
    if (owner === phrase) {
      owner = null;
      audio.pause();
      audio.removeAttribute('src');
    }
    if (phrase.blobUrl) {
      revokeObjectURL(phrase.blobUrl);
      phrase.blobUrl = null;
    }
  }

  function settle(phrase) {
    if (phrase.done) return false;
    phrase.done = true;
    clearTimeout(phrase.timer);
    return true;
  }

  function finish(phrase) {
    if (!phrase || !settle(phrase)) return;
    releaseAudio(phrase);
    phrase.handlers.onEnded();
  }

  /** Repli sur la synthèse ; keepDownload : le téléchargement continue, pour le cache */
  function fallBack(phrase, cause, { keepDownload = false } = {}) {
    if (!settle(phrase)) return;
    if (!keepDownload) phrase.controller.abort();
    releaseAudio(phrase);
    onFallback(cause);
    phrase.fallback = synthesis.start(phrase.text, phrase.handlers);
  }

  function applyVolume(volume) {
    try {
      // iOS : volume en lecture seule, seul « muted » coupe le son
      audio.muted = volume <= 0;
      audio.volume = Math.min(1, Math.max(0, volume));
    } catch {
      // Élément sans réglage de volume : le son part au volume du système
    }
  }

  function play(phrase, blob) {
    owner = phrase;
    phrase.blobUrl = createObjectURL(blob);
    audio.src = phrase.blobUrl;
    applyVolume(phrase.handlers.volume ?? 1);
    let started;
    try {
      started = audio.play();
    } catch {
      fallBack(phrase, 'refused');
      return;
    }
    Promise.resolve(started).catch(() => {
      if (owner === phrase && !phrase.started) fallBack(phrase, 'refused');
    });
  }

  async function download(phrase, key) {
    let blob;
    try {
      const res = await fetchImpl(urlFor(key), { signal: phrase.controller.signal });
      if (!res.ok || !isMp3Response(res)) {
        absent.add(key);
        fallBack(phrase, 'absent');
        return;
      }
      blob = await res.blob();
    } catch {
      fallBack(phrase, 'network');
      return;
    }
    // Arrivé trop tard (repli déjà fait) ou phrase coupée : le clip a seulement servi au cache
    if (!phrase.done) play(phrase, blob);
  }

  audio.addEventListener('playing', () => {
    const phrase = owner;
    if (!phrase || phrase.done || phrase.started) return;
    phrase.started = true;
    clearTimeout(phrase.timer);
    phrase.handlers.onStarted();
    if (Number.isFinite(audio.duration))
      phrase.handlers.setDeadline?.(audio.duration * 1000 + 1000);
  });
  audio.addEventListener('ended', () => finish(owner));
  audio.addEventListener('error', () => {
    const phrase = owner;
    if (!phrase || phrase.done) return;
    if (phrase.started) finish(phrase);
    else fallBack(phrase, 'error');
  });

  return {
    name: 'clips',

    start(text, handlers) {
      const key = voiceKey(text);
      if (absent.has(key)) {
        onFallback('absent');
        return synthesis.start(text, handlers);
      }
      const phrase = {
        text,
        handlers,
        done: false,
        started: false,
        blobUrl: null,
        fallback: null,
        controller: new AbortController(),
        timer: null,
      };
      phrase.timer = setTimeout(
        () => fallBack(phrase, 'timeout', { keepDownload: true }),
        startTimeoutMs
      );
      download(phrase, key);
      return {
        stop() {
          if (settle(phrase)) {
            phrase.controller.abort();
            releaseAudio(phrase);
          }
          phrase.fallback?.stop();
        },
        setVolume(volume) {
          if (phrase.fallback) phrase.fallback.setVolume?.(volume);
          else if (owner === phrase) applyVolume(volume);
        },
      };
    },

    /** Déverrouille l'élément <audio> (iOS), dans un geste de l'utilisateur */
    unlock() {
      // Une phrase tient l'élément : ne pas le toucher (ce serait couper son clip). Un clip
      // qui joue prouve que l'élément est déjà déverrouillé.
      if (owner) return Promise.resolve(owner.started);
      let url;
      try {
        url = createObjectURL(silenceBlob());
        audio.src = url;
        return Promise.resolve(audio.play()).then(
          () => {
            // Un clip a pu prendre l'élément entre-temps : ne pas l'arrêter
            if (!owner) {
              audio.pause();
              audio.removeAttribute('src');
            }
            revokeObjectURL(url);
            return true;
          },
          () => {
            revokeObjectURL(url);
            return false;
          }
        );
      } catch {
        if (url) revokeObjectURL(url);
        return false;
      }
    },

    /** Télécharge des clips à l'avance, sans les jouer (le service worker les garde) */
    preload(texts) {
      for (const text of texts) {
        const key = voiceKey(text);
        if (absent.has(key) || preloaded.has(key)) continue;
        preloaded.add(key);
        fetchImpl(urlFor(key), { priority: 'low' })
          .then(res => (res.ok && isMp3Response(res) ? res.blob() : absent.add(key)))
          .catch(() => preloaded.delete(key));
      }
    },
  };
}

// ---------------------------------------------------------------------------------------
// Branchement dans le jeu
// ---------------------------------------------------------------------------------------

const state = {
  base: null,
  index: null,
  engine: null,
  engineId: null,
  /** Un moteur par langue et version, gardé pour la session : il se souvient des clips
   * absents et déjà chargés, même si la case est décochée puis recochée */
  engines: new Map(),
  /** Un seul élément <audio> pour tous les moteurs : iOS n'en déverrouille qu'un */
  audio: null,
  deps: null,
};

/** Une cause de repli n'est comptée qu'une fois par session (Plausible) */
const reportedFallbacks = new Set();

function reportFallback(cause) {
  if (reportedFallbacks.has(cause)) return;
  reportedFallbacks.add(cause);
  try {
    globalThis.plausible?.('Voice fallback', { props: { cause } });
  } catch {
    // Mesure d'audience indisponible : rien à faire
  }
}

function canPlayMp3() {
  try {
    return new Audio().canPlayType('audio/mpeg') !== '';
  } catch {
    return false;
  }
}

function browserState(deps) {
  return {
    tester: Boolean(deps.storage.get(VOICE_STORAGE_KEYS.tester, false)) || Boolean(deps.localMark),
    canPlayMp3: deps.canPlayMp3(),
  };
}

/** Entrée de l'index pour la langue du jeu, si la voix enregistrée y est disponible */
function currentEntry() {
  const { deps } = state;
  if (!deps || !state.index) return null;
  return recordedVoiceEntry(state.index, deps.lang(), browserState(deps));
}

/** Choix du joueur pour la parole : true, false, ou null s'il n'en a fait aucun */
function voicePreference() {
  const value = state.deps?.storage.get('voiceEnabled', null);
  return typeof value === 'boolean' ? value : null;
}

/** La voix enregistrée est-elle disponible pour la langue du jeu ? */
export function isRecordedVoiceAvailable() {
  return Boolean(currentEntry());
}

/** Case « Voix enregistrée » : cochée tant que le joueur ne l'a pas décochée */
export function getRecordedVoicePreference() {
  return state.deps?.storage.get(VOICE_STORAGE_KEYS.recorded, null) !== false;
}

/**
 * Parole active, d'après le choix du joueur ou la voix enregistrée activée par défaut ;
 * branché dans js/speech.js (isVoiceEnabled)
 */
export function resolveVoiceEnabled() {
  return isSpeechActive({ voicePreference: voicePreference(), entry: currentEntry() });
}

/** Branche le moteur qui convient (clips ou synthèse), sans couper s'il ne change pas */
export function refreshVoiceEngine() {
  const { deps } = state;
  if (!deps) return;
  const entry = currentEntry();
  const kind = speechEngineFor({
    speechActive: resolveVoiceEnabled(),
    entry,
    recordedPreference: deps.storage.get(VOICE_STORAGE_KEYS.recorded, null),
  });
  const lang = deps.lang();
  const engineId = kind === 'clips' ? `${lang}/${entry.version}` : null;
  if (engineId !== state.engineId) {
    state.engineId = engineId;
    state.engine = engineId ? engineFor(engineId, lang, entry) : null;
    setSpeechEngine(state.engine);
  }
  deps.eventBus.emit('voice:changed', {
    available: Boolean(entry),
    active: resolveVoiceEnabled(),
    engine: kind,
  });
}

/** Les « Bravo » reviennent sans cesse : leurs clips se chargent d'avance */
function preloadCommonPhrases(engine) {
  const correct = state.deps.translations()?.correct;
  const variants = Array.isArray(correct) ? correct : [correct];
  engine.preload?.(variants.filter(text => typeof text === 'string' && text));
}

function engineFor(engineId, lang, entry) {
  if (!state.engines.has(engineId)) {
    state.audio ??= state.deps.createAudio();
    const engine = state.deps.createEngine({
      base: state.base,
      lang,
      entry,
      audio: state.audio,
      synthesis: getSynthesisEngine(),
      onFallback: reportFallback,
    });
    state.engines.set(engineId, engine);
    preloadCommonPhrases(engine);
  }
  return state.engines.get(engineId);
}

/**
 * Coche ou décoche la case « Voix enregistrée »
 * @param {boolean} enabled
 */
export function setRecordedVoicePreference(enabled) {
  state.deps?.storage.set(VOICE_STORAGE_KEYS.recorded, Boolean(enabled));
  refreshVoiceEngine();
}

function saveIndexCopy(index) {
  if (index) state.deps.storage.set(VOICE_STORAGE_KEYS.index, index);
  else state.deps.storage.remove(VOICE_STORAGE_KEYS.index);
}

/**
 * Élément <audio> de la voix enregistrée. Lucie suit la règle des bruitages (eux aussi
 * joués par <audio>) : c'est le bouton muet du jeu qui fait foi, pas le commutateur
 * silencieux de l'iPhone (navigator.audioSession, iOS 16.4 et plus).
 */
function createSharedAudio() {
  try {
    if (globalThis.navigator?.audioSession) globalThis.navigator.audioSession.type = 'playback';
  } catch {
    // Réglage refusé : le navigateur garde son comportement par défaut
  }
  return new Audio();
}

function defaultDeps() {
  const params = new URLSearchParams(globalThis.location?.search ?? '');
  const hostname = globalThis.location?.hostname ?? '';
  applyVoiceParam(params.get('voix'), { hostname });
  const meta = globalThis.document?.querySelector(`meta[name="${META_NAME}"]`)?.content ?? null;
  const localMark = Boolean(Storage.get(VOICE_STORAGE_KEYS.local, false));
  return {
    base: resolveVoiceBase({ meta, localMark, hostname }),
    localMark: localMark && LOCAL_HOSTS.has(hostname),
    storage: Storage,
    eventBus,
    lang: getCurrentLanguage,
    translations: getTranslations,
    canPlayMp3,
    fetchImpl: (...args) => fetch(...args),
    createAudio: createSharedAudio,
    createEngine: options => createClipEngine(options),
  };
}

/**
 * Met en place la voix enregistrée : décision immédiate d'après la dernière copie de
 * l'index, puis d'après l'index reçu. Sans adresse de base (forks, développement), rien
 * ne change : synthèse, voix coupée par défaut.
 * @param {Object} [deps] - Dépendances (tests)
 * @returns {Promise<void>}
 */
export async function initRecordedVoice(deps = defaultDeps()) {
  if (!deps.base) return;
  state.deps = deps;
  state.base = deps.base;
  state.index = parseVoiceIndex(deps.storage.get(VOICE_STORAGE_KEYS.index, null));
  setVoiceEnabledResolver(resolveVoiceEnabled);
  deps.eventBus.on('languageChanged', refreshVoiceEngine);
  deps.eventBus.on('voice:preference-changed', refreshVoiceEngine);
  refreshVoiceEngine();

  const fresh = await fetchVoiceIndex(state.base, deps.fetchImpl);
  if (fresh === undefined) return; // hors ligne : la copie fait foi
  state.index = fresh;
  saveIndexCopy(fresh);
  refreshVoiceEngine();
}

/** Remet le module à zéro (tests) */
export function resetRecordedVoiceForTests() {
  state.base = null;
  state.index = null;
  state.engine = null;
  state.engineId = null;
  state.engines.clear();
  state.audio = null;
  state.deps = null;
  reportedFallbacks.clear();
}

/**
 * Case « Voix enregistrée » (Accessibilité & Contrôles) : visible là où la voix
 * enregistrée est disponible, cochée tant que le joueur ne l'a pas décochée. Décochée,
 * la parole continue avec la voix de l'appareil.
 * @param {Document} [doc]
 */
export function attachRecordedVoiceSetting(doc = globalThis.document) {
  const option = doc?.getElementById('recorded-voice-option');
  const toggle = doc?.getElementById('recorded-voice-toggle');
  if (!option || !toggle || toggle.dataset.recordedVoiceBound) return;
  toggle.dataset.recordedVoiceBound = 'true';
  const sync = () => {
    option.hidden = !isRecordedVoiceAvailable();
    toggle.checked = getRecordedVoicePreference();
  };
  toggle.addEventListener('change', () => setRecordedVoicePreference(toggle.checked));
  (state.deps?.eventBus ?? eventBus).on('voice:changed', sync);
  sync();
}
