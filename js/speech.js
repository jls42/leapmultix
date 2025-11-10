// speech.js - ESM wrapper for speech synthesis utilities
// Provides speak() and isVoiceEnabled() without relying on window globals.

import Storage from './core/storage.js';
import { AudioManager } from './core/audio.js';
import { eventBus } from './core/eventBus.js';

// Module-level state for volume control
let currentVolume = 1;
let isMuted = false;
let audioSyncInitialized = false;

/**
 * Updates the module's state from an audio event or initial state.
 * @param {{volume: number, muted: boolean}} audioState - The new audio state.
 */
function updateAudioState(audioState) {
  const { volume, muted } = audioState;
  currentVolume = volume;
  isMuted = muted;

  if (isMuted) {
    const Root = getGlobalRoot();
    if (Root?.speechSynthesis) {
      try {
        Root.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
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

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAudioSync, { once: true });
  } else {
    // DOM is already ready: synchronise immediately for late imports
    initializeAudioSync();
  }
}

export function isVoiceEnabled() {
  try {
    return Storage.loadVoiceEnabled();
  } catch {
    return true;
  }
}

let speechSettings = { lang: 'fr-FR', rate: 0.9, pitch: 1.1 };
let selectedVoice = null;
let currentSpeechPriority = null; // Track priority of current speech
let lastHighText = '';
let pendingHighReplay = null;
let waitingForVoiceLoad = false;
let lastAnnouncedVoiceKey = null;

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
  // Preferred voices organized by priority: local high-quality first, then remote
  const preferredVoices = {
    fr: {
      local: ['Amelie', 'Chantal', 'Thomas'], // macOS/iOS voices
      remote: ['Google français', 'fr-CA-Standard-A'], // Cloud voices
    },
    en: {
      local: ['Alex', 'Samantha', 'Daniel'], // macOS/iOS voices
      remote: ['Google US English', 'en-US-Standard-A'], // Cloud voices
    },
    es: {
      local: ['Monica', 'Paulina', 'Diego'], // macOS/iOS voices
      remote: ['Google español', 'es-US-Standard-A'], // Cloud voices
    },
  };

  // eslint-disable-next-line security/detect-object-injection -- False positive: langPrefix comes from lang.split('-')[0] with controlled values ('fr'|'en'|'es')
  const preferred = preferredVoices[langPrefix] || { local: [], remote: [] };

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

  // Map reason to human-readable label (avoiding Map.get for static analyzer compatibility)
  let label;
  switch (reason) {
    case 'language-change':
      label = 'language change';
      break;
    case 'voiceschanged':
      label = 'voiceschanged';
      break;
    case 'init':
      label = 'boot';
      break;
    case 'auto':
      label = 'auto';
      break;
    default:
      label = reason;
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
  // eslint-disable-next-line no-undef -- Browser global provided by speech synthesis API
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

function ensureSpeechReady(Root) {
  if (!Root || !('speechSynthesis' in Root)) {
    console.warn('[Speech] speechSynthesis API not available');
    return false;
  }

  if (!isVoiceEnabled()) {
    console.warn('[Speech] Voice is disabled (check 🗣️ button in top bar)');
    return false;
  }

  return true;
}

function handleHighPriority(text) {
  currentSpeechPriority = 'high';
  lastHighText = String(text || '');
}

function cancelNormalSpeech(Root) {
  try {
    Root.speechSynthesis.cancel();
  } catch (error) {
    console.warn('[Speech] Error cancelling:', error);
  }
  currentSpeechPriority = null;
}

function interruptHighSpeech(Root) {
  try {
    Root.speechSynthesis.cancel();
  } catch (error) {
    console.warn('[Speech] Error cancelling HIGH speech:', error);
  }
  currentSpeechPriority = null;
  pendingHighReplay = lastHighText;
}

function handleNormalPriority({ Root, allowInterruptHigh, isActive }) {
  if (!isActive) {
    currentSpeechPriority = 'normal';
    return;
  }

  if (currentSpeechPriority === 'high') {
    if (!allowInterruptHigh) {
      return;
    }

    interruptHighSpeech(Root);
    return;
  }

  cancelNormalSpeech(Root);
}

function preparePriorityQueue({ Root, priority, allowInterruptHigh, text }) {
  const isActive = Root.speechSynthesis.speaking || Root.speechSynthesis.pending;

  if (priority === 'high') {
    handleHighPriority(text);
    return;
  }

  handleNormalPriority({ Root, allowInterruptHigh, isActive });
}

function buildFinalText(priority, rawText) {
  const baseText = String(rawText || '');

  if (priority === 'high') {
    pendingHighReplay = null;
    return baseText;
  }

  if (!pendingHighReplay) {
    return baseText;
  }

  const combined = `${pendingHighReplay}. ${baseText}`.trim();
  pendingHighReplay = null;
  return combined;
}

function attachUtteranceEvents(utterance, priority) {
  utterance.onstart = () => {
    currentSpeechPriority = priority;
    if (priority === 'high') {
      pendingHighReplay = null;
    }
  };

  utterance.onend = () => {
    currentSpeechPriority = null;
    if (priority === 'high') {
      pendingHighReplay = null;
    }
  };

  utterance.onerror = event => {
    // Les erreurs 'interrupted' sont normales quand un message en coupe un autre.
    if (event.error === 'interrupted') {
      return; // On ne traite pas cela comme une erreur.
    }

    currentSpeechPriority = null;
    if (priority === 'high') {
      pendingHighReplay = null;
    }
    console.error('[Speech] ❌ Error:', event);
  };
}

export function speak(text, options = {}) {
  const {
    priority = 'normal', // 'high' (mode announcements) or 'normal' (game feedback)
    allowInterruptHigh = true,
  } = options;
  const Root = getGlobalRoot();

  // Abort if muted
  if (isMuted) {
    return;
  }

  if (!ensureSpeechReady(Root)) {
    return;
  }

  try {
    preparePriorityQueue({ Root, priority, allowInterruptHigh, text });

    const spokenText = buildFinalText(priority, text);
    const utterance = setupUtterance(spokenText, speechSettings);

    // Use the live volume from the event bus, and allow it to be 0
    utterance.volume = Math.max(0, Math.min(1, Number(currentVolume || 0)));

    attachUtteranceEvents(utterance, priority);

    Root.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error('[Speech] Exception:', error);
  }
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
  speechSettings = { ...speechSettings, lang: voiceLang };
  // Update the selected voice when the language changes
  updateVoiceSelection('language-change');
}

// Initial voice selection when the module is loaded
updateVoiceSelection('init');
