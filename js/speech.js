// speech.js - ESM wrapper for speech synthesis utilities
// Provides speak() and isVoiceEnabled() without relying on window globals.

import Storage from './core/storage.js';
import { gameState } from './game.js';

export function isVoiceEnabled() {
  try {
    return Storage.loadVoiceEnabled();
  } catch {
    return true;
  }
}

let speechSettings = { lang: 'fr-FR', rate: 0.9, pitch: 1.1 };
let currentSpeechPriority = null; // Track priority of current speech
let lastHighText = '';
let pendingHighReplay = null;

function getGlobalRoot() {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof window !== 'undefined') return window;
  return undefined;
}

function setupUtterance(text, settings) {
  // eslint-disable-next-line no-undef -- Browser API, SpeechSynthesisUtterance is globally available
  const utterance = new SpeechSynthesisUtterance(String(text || ''));
  utterance.lang = settings.lang || 'fr-FR';
  utterance.rate = settings.rate ?? 0.9;
  utterance.pitch = settings.pitch ?? 1.1;
  return utterance;
}

function getVolumeLevel() {
  if (!gameState || typeof gameState.volume === 'undefined') return 1;
  return gameState.volume;
}

function logSpeechDebug(Root, text, priority) {
  console.log('[Speech Debug] speak() called with:', text, 'priority:', priority);
  console.log('[Speech Debug] Root available:', !!Root);
  console.log('[Speech Debug] speechSynthesis available:', Root && 'speechSynthesis' in Root);
  console.log('[Speech Debug] isVoiceEnabled():', isVoiceEnabled());
  console.log('[Speech Debug] gameState.volume:', gameState?.volume);
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

function logVoiceAvailability(Root) {
  const voices = Root.speechSynthesis.getVoices();
  console.log(
    '[Speech Debug] Available voices:',
    voices.length,
    voices.map(voice => `${voice.name} (${voice.lang})`)
  );
}

function handleHighPriority(text, isActive) {
  currentSpeechPriority = 'high';
  lastHighText = String(text || '');

  if (isActive) {
    console.log('[Speech] HIGH priority - queueing after current speech:', text);
  }
}

function cancelNormalSpeech(Root, text) {
  console.log('[Speech] NORMAL priority - cancelling previous NORMAL speech:', text);
  try {
    Root.speechSynthesis.cancel();
  } catch (error) {
    console.warn('[Speech] Error cancelling:', error);
  }
  currentSpeechPriority = null;
}

function interruptHighSpeech(Root, text) {
  console.log('[Speech] NORMAL priority - interrupting HIGH priority speech:', text);
  try {
    Root.speechSynthesis.cancel();
  } catch (error) {
    console.warn('[Speech] Error cancelling HIGH speech:', error);
  }
  currentSpeechPriority = null;
  pendingHighReplay = lastHighText;
}

function handleNormalPriority({ Root, allowInterruptHigh, text, isActive }) {
  if (!isActive) {
    currentSpeechPriority = 'normal';
    return;
  }

  if (currentSpeechPriority === 'high') {
    if (!allowInterruptHigh) {
      console.log(
        '[Speech] NORMAL priority - NOT cancelling HIGH priority speech, queueing:',
        text
      );
      return;
    }

    interruptHighSpeech(Root, text);
    return;
  }

  cancelNormalSpeech(Root, text);
}

function preparePriorityQueue({ Root, priority, allowInterruptHigh, text }) {
  const isActive = Root.speechSynthesis.speaking || Root.speechSynthesis.pending;

  if (priority === 'high') {
    handleHighPriority(text, isActive);
    return;
  }

  handleNormalPriority({ Root, allowInterruptHigh, text, isActive });
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

function logSpeechIntent(spokenText, utterance, priority) {
  console.log('[Speech] Speaking:', {
    text: spokenText,
    lang: utterance.lang,
    volume: utterance.volume,
    rate: utterance.rate,
    pitch: utterance.pitch,
    priority,
  });
}

function attachUtteranceEvents(utterance, priority, spokenText) {
  utterance.onstart = () => {
    currentSpeechPriority = priority;
    if (priority === 'high') {
      pendingHighReplay = null;
    }
    console.log('[Speech] ✅ Started speaking:', spokenText, `(priority: ${priority})`);
  };

  utterance.onend = () => {
    currentSpeechPriority = null;
    if (priority === 'high') {
      pendingHighReplay = null;
    }
    console.log('[Speech] ✅ Finished speaking:', spokenText);
  };

  utterance.onerror = error => {
    currentSpeechPriority = null;
    if (priority === 'high') {
      pendingHighReplay = null;
    }
    console.error('[Speech] ❌ Error:', error);
  };
}

export function speak(text, options = {}) {
  const {
    priority = 'normal', // 'high' (mode announcements) or 'normal' (game feedback)
    allowInterruptHigh = true,
  } = options;
  const Root = getGlobalRoot();

  logSpeechDebug(Root, text, priority);

  if (!ensureSpeechReady(Root)) {
    return;
  }

  logVoiceAvailability(Root);

  try {
    preparePriorityQueue({ Root, priority, allowInterruptHigh, text });

    const spokenText = buildFinalText(priority, text);
    const utterance = setupUtterance(spokenText, speechSettings);
    const volume = getVolumeLevel();
    utterance.volume = Math.max(0.1, Math.min(1, Number(volume || 1)));

    logSpeechIntent(spokenText, utterance, priority);
    attachUtteranceEvents(utterance, priority, spokenText);

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
}
