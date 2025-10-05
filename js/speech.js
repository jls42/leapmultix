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

function handleNormalPriority({ Root, allowInterruptHigh, text, isActive }) {
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

  if (!ensureSpeechReady(Root)) {
    return;
  }

  try {
    preparePriorityQueue({ Root, priority, allowInterruptHigh, text });

    const spokenText = buildFinalText(priority, text);
    const utterance = setupUtterance(spokenText, speechSettings);
    const volume = getVolumeLevel();
    utterance.volume = Math.max(0.1, Math.min(1, Number(volume || 1)));
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
}
