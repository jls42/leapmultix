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

export function speak(text) {
  const Root = getGlobalRoot();
  if (!Root || !('speechSynthesis' in Root) || !isVoiceEnabled()) return;

  try {
    // Stop any ongoing utterance to improve reliability across browsers
    try {
      Root.speechSynthesis.cancel();
    } catch (e) {
      void e;
    }

    const utterance = setupUtterance(text, speechSettings);
    const vol = getVolumeLevel();
    utterance.volume = Math.max(0.1, Math.min(1, Number(vol || 1)));
    Root.speechSynthesis.speak(utterance);
  } catch (e) {
    void e;
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
