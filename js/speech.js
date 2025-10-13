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

function getGlobalRoot() {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof window !== 'undefined') return window;
  return undefined;
}

/**
 * Selects the best available voice for a given language.
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

  // Validate langPrefix to prevent object injection
  const supportedLanguages = ['fr', 'en', 'es'];
  if (!supportedLanguages.includes(langPrefix)) {
    console.warn(`[Speech] Unsupported language prefix: ${langPrefix}`);
    return null;
  }

  // List of preferred high-quality voices by name for each language
  const preferredVoices = {
    fr: ['Google français', 'Amelie', 'Chantal', 'Thomas', 'fr-CA-Standard-A'],
    en: ['Google US English', 'Alex', 'Samantha', 'Daniel', 'en-US-Standard-A'],
    es: ['Google español', 'Monica', 'Paulina', 'Diego', 'es-US-Standard-A'],
  };

  // 1. Find local voices that match the primary language
  const voiceCandidates = voices.filter(
    voice => voice.localService && voice.lang.startsWith(langPrefix)
  );

  // Prioritize exact locale match over regional variants
  voiceCandidates.sort((a, b) => {
    const aIsExact = a.lang.toLowerCase() === lang.toLowerCase();
    const bIsExact = b.lang.toLowerCase() === lang.toLowerCase();
    if (aIsExact === bIsExact) return 0;
    return aIsExact ? -1 : 1;
  });

  // 2. Try to find a preferred voice from the sorted candidates
  const preferred = preferredVoices[langPrefix] || [];
  for (const voiceName of preferred) {
    const found = voiceCandidates.find(v => v.name === voiceName);
    if (found) {
      console.log(`[Speech] Found preferred voice: ${found.name}`);
      return found;
    }
  }

  // 3. If no preferred voice is found, return the first candidate (best match from sort)
  if (voiceCandidates.length > 0) {
    console.log(
      `[Speech] No preferred voice found, using first available local voice: ${voiceCandidates[0].name}`
    );
    return voiceCandidates[0];
  }

  // 4. If no local voice is available, find any voice matching the primary language
  const anyVoice = voices.find(voice => voice.lang.startsWith(langPrefix));
  if (anyVoice) {
    console.log(
      `[Speech] No local voice found, using first available remote voice: ${anyVoice.name}`
    );
    return anyVoice;
  }

  console.warn(`[Speech] No voice found for language: ${lang}`);
  return null;
}

/**
 * Updates the selected voice based on the current language setting.
 */
function updateVoiceSelection() {
  const Root = getGlobalRoot();
  if (!Root?.speechSynthesis) {
    return;
  }

  // Voices may not be loaded yet. getVoices() is async.
  let voices = Root.speechSynthesis.getVoices();
  if (voices.length === 0) {
    // If voices are not loaded, wait for the onvoiceschanged event
    Root.speechSynthesis.onvoiceschanged = () => {
      voices = Root.speechSynthesis.getVoices();
      selectedVoice = getBestVoice(speechSettings.lang);
      console.log(
        `[Speech] Voice selected onvoiceschanged: ${selectedVoice ? selectedVoice.name : 'default'}`
      );
    };
  } else {
    // If voices are already available, select one immediately
    selectedVoice = getBestVoice(speechSettings.lang);
    console.log(
      `[Speech] Voice selected immediately: ${selectedVoice ? selectedVoice.name : 'default'}`
    );
  }
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
  speechSettings = { ...speechSettings, lang: voiceLang };
  // Update the selected voice when the language changes
  updateVoiceSelection();
}

// Initial voice selection when the module is loaded
updateVoiceSelection();
