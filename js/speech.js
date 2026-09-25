// speech.js - Lecture à voix haute : une seule file de parole.
//
// La file tient deux emplacements, chacun avec son jeton :
// - la phrase active, même pendant qu'un moteur la prépare (un clip qui se télécharge) ;
// - une phrase en attente, une seule.
//
// Règles :
// - une annonce (priority: 'high') coupe la phrase active, annonce précédente comprise,
//   et oublie la phrase en attente : la dernière annonce gagne ;
// - une phrase normale arrivée pendant une annonce ne la coupe pas : elle attend sa fin
//   (en attente, la dernière arrivée gagne). Sinon, elle coupe la phrase active et part
//   tout de suite ;
// - une phrase « queue » (la question qui suit un « Bravo ») attend la fin de la phrase
//   active sans la couper. Elle est oubliée si une autre phrase arrive ou si l'enfant
//   répond (GameMode.handleAnswer appelle cancelSpeech) ;
// - une phrase coupée, remplacée ou oubliée est invalidée : ses événements tardifs (fin,
//   erreur, téléchargement, minuteur) ne font plus rien, ni lecture ni repli ;
// - fin bornée, quel que soit le moteur : au-delà d'une durée estimée d'après le texte,
//   la phrase est tenue pour finie et la file avance. Un son bloqué ne retient rien.
// Chaque phrase part seule vers le moteur : plus aucun texte recollé.
//
// Contrat d'un moteur (setSpeechEngine), pour la voix enregistrée :
//   engine.start(text, { lang, token, volume, onStarted, onEnded, onFailed, setDeadline })
//     → { stop(), setVolume?(volume) }
//   - start lance la phrase ; onStarted() quand le son part ; onEnded() à la fin ;
//     onFailed(error) si la phrase ne peut pas être dite (la file passe à la suite).
//   - setDeadline(ms) fixe la fin bornée à ms depuis maintenant, pour un moteur qui
//     connaît la durée réelle (un clip : sa durée plus 1 s).
//   - stop() coupe le son ; la file ignore ensuite tout rappel de cette phrase.
//   - setVolume(volume) applique le volume à la phrase en cours, si le moteur le peut.
//   - isAvailable() (facultatif) : false si le moteur ne peut rien dire du tout.
//   - unlock() (facultatif) : appelé pendant un geste de l'utilisateur pour déverrouiller
//     le son (iOS) ; rend un booléen ou une promesse de booléen.
//   Le moteur par défaut est la synthèse du navigateur (getSynthesisEngine()).

import Storage from './core/storage.js';
import { AudioManager } from './core/audio.js';
import { eventBus } from './core/eventBus.js';

// Module-level state for volume control
let currentVolume = 1;
let isMuted = false;
let audioSyncInitialized = false;

const preferredVoiceRegistry = new Map([
  [
    'fr',
    {
      local: ['Amelie', 'Chantal', 'Thomas'], // macOS/iOS voices
      remote: ['Google français', 'fr-CA-Standard-A'], // Cloud voices
    },
  ],
  [
    'en',
    {
      local: ['Alex', 'Samantha', 'Daniel'],
      remote: ['Google US English', 'en-US-Standard-A'],
    },
  ],
  [
    'es',
    {
      local: ['Monica', 'Paulina', 'Diego'],
      remote: ['Google español', 'es-US-Standard-A'],
    },
  ],
]);

const defaultPreferredVoices = { local: [], remote: [] };

/**
 * Updates the module's state from an audio event or initial state.
 * Couper le son arrête la parole ; un autre volume s'applique à la phrase en cours.
 * @param {{volume: number, muted: boolean}} audioState - The new audio state.
 */
function updateAudioState(audioState) {
  const { volume, muted } = audioState;
  currentVolume = volume;
  isMuted = muted;

  if (isMuted) {
    cancelSpeech();
    return;
  }
  try {
    active?.handle?.setVolume?.(effectiveVolume());
  } catch {
    /* le moteur ne sait pas changer le volume en cours de phrase */
  }
}

/**
 * Initializes the speech module's audio state.
 * Pulls the initial state from AudioManager and then subscribes to updates.
 */
function initializeAudioSync() {
  if (audioSyncInitialized) {
    return;
  }
  audioSyncInitialized = true;

  // Listen for subsequent updates
  eventBus.on('volumeChanged', payload => {
    const detail = payload?.detail ?? payload;
    if (!detail || typeof detail !== 'object') {
      return;
    }
    updateAudioState(detail);
  });

  // Try to get initial state, but don't fail if AudioManager is not ready
  try {
    if (AudioManager) {
      const initialState = {
        volume: AudioManager.getVolume(),
        muted: AudioManager.isMuted(),
      };
      updateAudioState(initialState);
    }
  } catch {
    // This is expected if speech.js is loaded before audio.js due to bundling.
    // The event listener above will handle the state update.
  }
}

/** Règle par défaut : le choix du joueur, voix coupée tant qu'il n'a rien choisi (v21) */
const storedVoiceChoice = () => Boolean(Storage.loadVoiceEnabled());
let voiceEnabledResolver = storedVoiceChoice;

/**
 * Remplace la règle qui dit si la parole est active : la voix enregistrée
 * (js/voice-clips.js) l'active par défaut là où elle est disponible
 * @param {(() => boolean)|null} resolver - null : retour à la règle par défaut
 */
export function setVoiceEnabledResolver(resolver) {
  voiceEnabledResolver = resolver ?? storedVoiceChoice;
}

export function isVoiceEnabled() {
  try {
    return Boolean(voiceEnabledResolver());
  } catch {
    return false;
  }
}

let speechSettings = { lang: 'fr-FR', rate: 0.9, pitch: 1.1 };
let selectedVoice = null;
let waitingForVoiceLoad = false;
let lastAnnouncedVoiceKey = null;
// Une erreur de lecture (souvent : aucune voix installée) n'est signalée qu'une fois
let speechErrorReported = false;
let unavailableReported = false;
const BENIGN_SPEECH_ERRORS = new Set(['interrupted', 'canceled']);
// Marque d'une clé de traduction absente, telle que getTranslation la rend
const MISSING_TRANSLATION = /\[[\w.-]+\]/;

function getGlobalRoot() {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof window !== 'undefined') return window;
  return undefined;
}

/**
 * Filters out known low-quality voices.
 * Based on research from web-speech-recommended-voices project.
 * @param {SpeechSynthesisVoice[]} voices - The list of voices to filter.
 * @returns {SpeechSynthesisVoice[]} Filtered voices without low-quality options.
 */
function filterLowQualityVoices(voices) {
  // Known low-quality voice patterns to exclude
  const lowQualityPatterns = [
    'eSpeak', // Very low quality TTS engine
    'Eloquence', // Apple low-quality voices (8 voices)
    'Albert', // Apple novelty voices
    'Bad News',
    'Bahh',
    'Bells',
    'Boing',
    'Bubbles',
    'Cellos',
    'Good News',
    'Jester',
    'Organ',
    'Superstar',
    'Trinoids',
    'Wobble',
    'Zarvox',
  ];

  return voices.filter(voice => !lowQualityPatterns.some(pattern => voice.name.includes(pattern)));
}

/**
 * Finds a preferred voice from a list of candidates.
 * Prioritizes local high-quality voices, then remote Google voices.
 * @param {SpeechSynthesisVoice[]} voiceCandidates - The list of available voices.
 * @param {string} langPrefix - The language prefix (e.g., 'fr').
 * @returns {SpeechSynthesisVoice | null} The found voice or null.
 */
function findPreferredVoice(voiceCandidates, langPrefix) {
  const preferred = preferredVoiceRegistry.get(langPrefix) || defaultPreferredVoices;

  // First, try to find a preferred local voice (better reliability, no network)
  for (const voiceName of preferred.local) {
    const found = voiceCandidates.find(v => v.name === voiceName);
    if (found) {
      return found;
    }
  }

  // Then try remote voices (Google voices - high quality but require network)
  for (const voiceName of preferred.remote) {
    const found = voiceCandidates.find(v => v.name === voiceName);
    if (found) {
      return found;
    }
  }

  return null;
}

/**
 * Selects the best available voice for a given language.
 * Strategy prioritizes reliability and quality:
 * 1. Filter out known low-quality voices
 * 2. Search for preferred high-quality voices (local first, then remote)
 * 3. Fallback to any local voice
 * 4. Fallback to any remote voice
 *
 * @param {string} lang - The desired language code (e.g., 'fr-FR').
 * @returns {SpeechSynthesisVoice | null} The best voice found, or null.
 */
function getBestVoice(lang) {
  const Root = getGlobalRoot();
  if (!Root?.speechSynthesis) {
    return null;
  }

  const voices = Root.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) {
    console.warn('[Speech] No voices available.');
    return null;
  }

  const langPrefix = lang.split('-')[0];

  // 1. Filter out low-quality voices and match language
  const qualityCandidates = filterLowQualityVoices(voices).filter(voice =>
    voice.lang.startsWith(langPrefix)
  );

  if (qualityCandidates.length === 0) {
    console.warn(`[Speech] No quality voices found for language: ${lang}`);
    return null;
  }

  // 2. Sort by exact locale match (prefer fr-FR over fr-CA when requesting fr-FR)
  qualityCandidates.sort((a, b) => {
    const aIsExact = a.lang.toLowerCase() === lang.toLowerCase();
    const bIsExact = b.lang.toLowerCase() === lang.toLowerCase();
    if (aIsExact === bIsExact) return 0;
    return aIsExact ? -1 : 1;
  });

  // 3. Try to find a preferred voice (searches both local and remote)
  const preferredVoice = findPreferredVoice(qualityCandidates, langPrefix);
  if (preferredVoice) {
    return preferredVoice;
  }

  // 4. Fallback to first local voice (better reliability for offline use)
  const localVoice = qualityCandidates.find(v => v.localService);
  if (localVoice) {
    return localVoice;
  }

  // 5. Last resort: use first remote voice
  return qualityCandidates[0];
}

function announceVoiceSelection(reason, voice) {
  if (!voice) {
    return;
  }

  const key = `${speechSettings.lang}:${voice.name}`;
  if (lastAnnouncedVoiceKey === key) {
    return;
  }
  lastAnnouncedVoiceKey = key;

  // Map reason to human-readable label using hardcoded strings
  let label = 'unknown';
  if (reason === 'language-change') {
    label = 'language change';
  } else if (reason === 'voiceschanged') {
    label = 'voiceschanged';
  } else if (reason === 'init') {
    label = 'boot';
  } else if (reason === 'auto') {
    label = 'auto';
  }

  console.debug(
    `[Speech] Voice ready (${label}): ${voice.name} (${voice.localService ? 'local' : 'remote'})`
  );
}

function waitForVoiceList(Root) {
  if (waitingForVoiceLoad) {
    return;
  }
  waitingForVoiceLoad = true;

  const handler = () => {
    waitingForVoiceLoad = false;
    if (typeof Root.speechSynthesis.removeEventListener === 'function') {
      Root.speechSynthesis.removeEventListener('voiceschanged', handler);
    } else {
      Root.speechSynthesis.onvoiceschanged = null;
    }
    updateVoiceSelection('voiceschanged');
  };

  if (typeof Root.speechSynthesis.addEventListener === 'function') {
    Root.speechSynthesis.addEventListener('voiceschanged', handler, { once: true });
  } else {
    Root.speechSynthesis.onvoiceschanged = handler;
  }
}

/**
 * Updates the selected voice based on the current language setting.
 */
function updateVoiceSelection(reason = 'auto') {
  const Root = getGlobalRoot();
  if (!Root?.speechSynthesis) {
    return;
  }

  // Voices may not be loaded yet. getVoices() is async.
  const voices = Root.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) {
    waitForVoiceList(Root);
    return;
  }

  const nextVoice = getBestVoice(speechSettings.lang);
  if (!nextVoice) {
    selectedVoice = null;
    return;
  }

  if (selectedVoice?.name === nextVoice.name) {
    return;
  }

  selectedVoice = nextVoice;
  announceVoiceSelection(reason, selectedVoice);
}

function setupUtterance(text, settings) {
  const utterance = new SpeechSynthesisUtterance(String(text || ''));
  utterance.lang = settings.lang || 'fr-FR';
  utterance.rate = settings.rate ?? 0.9;
  utterance.pitch = settings.pitch ?? 1.1;

  // Assign the selected high-quality voice if available
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  return utterance;
}

function reportSpeechError(reason, detail) {
  if (speechErrorReported) return;
  speechErrorReported = true;
  console.warn(
    `[Speech] Lecture à voix haute indisponible (${reason}) : les textes restent affichés.`,
    detail
  );
}

/**
 * Moteur de synthèse du navigateur (speechSynthesis). Une seule phrase à la fois : la
 * file ne lui confie jamais deux énoncés en même temps.
 */
function createSynthesisEngine() {
  const synthesis = () => getGlobalRoot()?.speechSynthesis;
  return {
    name: 'synthesis',

    isAvailable() {
      return Boolean(synthesis()) && typeof SpeechSynthesisUtterance !== 'undefined';
    },

    start(text, { volume, onStarted, onEnded, onFailed }) {
      const synth = synthesis();
      let done = false;
      const settle = callback => event => {
        if (done) return;
        done = true;
        callback(event);
      };
      if (!synth) {
        settle(onFailed)(new Error('speechSynthesis indisponible'));
        return { stop() {} };
      }
      const utterance = setupUtterance(text, speechSettings);
      utterance.volume = volume;
      utterance.onstart = () => {
        if (!done) onStarted();
      };
      utterance.onend = settle(onEnded);
      utterance.onerror = settle(event => {
        // Une coupure venue d'ailleurs (autre onglet, système) vaut fin de phrase
        if (BENIGN_SPEECH_ERRORS.has(event?.error)) onEnded();
        else onFailed(event);
      });
      synth.speak(utterance);
      return {
        stop() {
          done = true;
          try {
            synth.cancel();
          } catch (error) {
            console.warn('[Speech] Error cancelling:', error);
          }
        },
      };
    },

    /** Amorce la synthèse dans un geste de l'utilisateur (iOS) : un énoncé vide */
    unlock() {
      const synth = synthesis();
      if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return false;
      const primer = new SpeechSynthesisUtterance('');
      primer.volume = 0;
      synth.speak(primer);
      return true;
    },
  };
}

const SYNTHESIS_ENGINE = createSynthesisEngine();
let engine = SYNTHESIS_ENGINE;

/** Moteur de synthèse du navigateur, celui de la file par défaut et du repli */
export function getSynthesisEngine() {
  return SYNTHESIS_ENGINE;
}

/**
 * Branche un autre moteur sur la file (la voix enregistrée), ou revient à la synthèse.
 * La phrase en cours est coupée : elle appartenait à l'ancien moteur.
 * @param {Object|null} next - Moteur (voir le contrat en tête de fichier), null : synthèse
 */
export function setSpeechEngine(next) {
  cancelSpeech();
  engine = next ?? SYNTHESIS_ENGINE;
}

// ---------------------------------------------------------------------------------------
// File de parole
// ---------------------------------------------------------------------------------------

/**
 * Fin bornée de la synthèse : large, pour ne jamais couper une voix lente (Android lit
 * parfois moins de 8 caractères par seconde à ce débit) ; elle ne sert qu'à débloquer un
 * son qui ne signale jamais sa fin. 5 caractères par seconde, plus 3 s.
 */
const MS_PER_CHARACTER = 200;
const END_MARGIN_MS = 3000;
/** Délai accordé au moteur pour faire partir le son (voix distante, clip qui charge) */
const START_ALLOWANCE_MS = 4000;

/**
 * Durée au-delà de laquelle une phrase lue par la synthèse est tenue pour finie
 * @param {string} text
 * @returns {number} millisecondes
 */
export function estimateSpeechDurationMs(text) {
  return END_MARGIN_MS + [...String(text ?? '')].length * MS_PER_CHARACTER;
}

let nextToken = 0;
/** @type {{token: number, text: string, priority: string, handle: Object|null, deadline: any}|null} */
let active = null;
/** @type {{token: number, text: string, priority: string}|null} */
let pending = null;

function effectiveVolume() {
  if (isMuted) return 0;
  return Math.max(0, Math.min(1, Number(currentVolume || 0)));
}

function clearDeadline(phrase) {
  if (phrase?.deadline) {
    clearTimeout(phrase.deadline);
    phrase.deadline = null;
  }
}

/** Coupe et invalide la phrase active */
function stopActive() {
  const phrase = active;
  if (!phrase) return;
  active = null;
  clearDeadline(phrase);
  try {
    phrase.handle?.stop();
  } catch (error) {
    console.warn('[Speech] Arrêt de la phrase impossible :', error);
  }
}

/** Fait partir la phrase en attente, s'il y en a une */
function playPending() {
  const next = pending;
  pending = null;
  if (next) startPhrase(next);
}

/** Fin (ou abandon) de la phrase active : la file passe à la suite */
function finishActive(phrase) {
  if (active !== phrase) return;
  active = null;
  clearDeadline(phrase);
  playPending();
}

function setDeadlineFor(phrase, ms) {
  if (active !== phrase) return;
  clearDeadline(phrase);
  phrase.deadline = setTimeout(() => {
    if (active !== phrase) return;
    // Son bloqué ou fin jamais signalée : la phrase est tenue pour finie
    stopActive();
    playPending();
  }, ms);
}

function startPhrase(phrase) {
  active = phrase;
  const isCurrent = () => active === phrase;
  setDeadlineFor(phrase, START_ALLOWANCE_MS + estimateSpeechDurationMs(phrase.text));
  try {
    const handle = engine.start(phrase.text, {
      lang: speechSettings.lang,
      token: phrase.token,
      volume: effectiveVolume(),
      onStarted: () => {
        if (isCurrent()) setDeadlineFor(phrase, estimateSpeechDurationMs(phrase.text));
      },
      onEnded: () => finishActive(phrase),
      onFailed: error => {
        if (!isCurrent()) return;
        reportSpeechError(error?.error || error?.message || 'unknown', error);
        finishActive(phrase);
      },
      setDeadline: ms => setDeadlineFor(phrase, ms),
    });
    // Une phrase déjà finie pendant start (fin signalée tout de suite) n'a rien à arrêter :
    // stop() couperait la phrase suivante, déjà partie
    if (isCurrent()) phrase.handle = handle;
  } catch (error) {
    console.error('[Speech] Exception:', error);
    finishActive(phrase);
  }
}

/**
 * Coupe la phrase en cours et oublie la phrase en attente : sortie de mode, navigation,
 * « Continuer », changement de langue, voix ou son coupés, onglet caché.
 */
export function cancelSpeech() {
  pending = null;
  stopActive();
}

function canSpeak(text) {
  if (isMuted) return false;
  // Une traduction manquante (« [table_of] 7 ») ne se lit pas : ce serait un nom technique
  if (!text.trim() || MISSING_TRANSLATION.test(text)) return false;
  if (!isVoiceEnabled()) return false;
  if (engine.isAvailable && !engine.isAvailable()) {
    if (!unavailableReported) {
      unavailableReported = true;
      console.warn('[Speech] speechSynthesis API not available');
    }
    return false;
  }
  return true;
}

/**
 * Lit une phrase à voix haute, selon les règles de la file (en tête de fichier).
 * @param {string} text - Phrase telle qu'elle doit être dite
 * @param {{priority?: 'high'|'normal', queue?: boolean}} [options]
 *   priority 'high' : annonce de mode ; queue : attendre la fin de la phrase en cours
 */
export function speak(text, options = {}) {
  const { priority = 'normal', queue = false } = options;
  const phraseText = String(text ?? '');
  if (!canSpeak(phraseText)) return;

  const phrase = { token: ++nextToken, text: phraseText, priority, handle: null, deadline: null };
  if (priority === 'high') {
    cancelSpeech();
    startPhrase(phrase);
    return;
  }
  if (queue || active?.priority === 'high') {
    if (active) {
      pending = phrase;
      return;
    }
  } else {
    cancelSpeech();
  }
  startPhrase(phrase);
}

export function updateSpeechVoice(langCode) {
  let voiceLang;
  switch (langCode) {
    case 'en':
      voiceLang = 'en-US';
      break;
    case 'es':
      voiceLang = 'es-ES';
      break;
    default:
      voiceLang = 'fr-FR';
  }
  if (speechSettings.lang === voiceLang) {
    return;
  }
  // Une phrase de l'ancienne langue ne continue pas dans la nouvelle
  cancelSpeech();
  speechSettings = { ...speechSettings, lang: voiceLang };
  // Update the selected voice when the language changes
  updateVoiceSelection('language-change');
}

// ---------------------------------------------------------------------------------------
// Déverrouillage du son (iOS) : la première lecture doit partir d'un geste
// ---------------------------------------------------------------------------------------

// click, touchend et keydown : pour un doigt, WebKit ne compte pas pointerdown comme un
// geste qui autorise le son
const UNLOCK_EVENTS = ['click', 'touchend', 'keydown'];
let unlockTried = false;
let unlocked = false;

function removeUnlockListeners() {
  for (const type of UNLOCK_EVENTS) {
    document.removeEventListener(type, onUnlockGesture, true);
  }
}

function settleUnlock(ok) {
  if (ok) {
    unlocked = true;
    removeUnlockListeners();
  } else {
    // Échec : le prochain geste réessaie
    unlockTried = false;
  }
}

function unlockEngines() {
  const engines = [...new Set([SYNTHESIS_ENGINE, engine])];
  const results = engines.map(candidate => {
    try {
      return candidate.unlock ? candidate.unlock() : true;
    } catch {
      return false;
    }
  });
  return Promise.all(results.map(result => Promise.resolve(result).catch(() => false))).then(list =>
    list.every(Boolean)
  );
}

function onUnlockGesture() {
  if (unlocked || unlockTried) return;
  // Voix coupée : rien à déverrouiller, un geste suivant s'en chargera
  if (isMuted || !isVoiceEnabled()) return;
  // Posé tout de suite, dans le geste : touchend puis click, ou une touche répétée,
  // n'empilent pas d'énoncés vides
  unlockTried = true;
  unlockEngines().then(settleUnlock, () => settleUnlock(false));
}

function initializeSpeechLifecycle() {
  for (const type of UNLOCK_EVENTS) {
    document.addEventListener(type, onUnlockGesture, { capture: true, passive: true });
  }
  // Onglet caché : la parole s'arrête (elle ne reprend pas au retour)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') cancelSpeech();
  });
}

if (typeof document !== 'undefined') {
  initializeSpeechLifecycle();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAudioSync, { once: true });
  } else {
    // DOM is already ready: synchronise immediately for late imports
    initializeAudioSync();
  }
}

// Initial voice selection when the module is loaded
updateVoiceSelection('init');
