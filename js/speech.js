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

export function speak(text, options = {}) {
  const {
    priority = 'normal', // 'high' (mode announcements) or 'normal' (game feedback)
    allowInterruptHigh = true,
  } = options;
  const Root = getGlobalRoot();

  // Debug: Log all checks
  console.log('[Speech Debug] speak() called with:', text, 'priority:', priority);
  console.log('[Speech Debug] Root available:', !!Root);
  console.log('[Speech Debug] speechSynthesis available:', Root && 'speechSynthesis' in Root);
  console.log('[Speech Debug] isVoiceEnabled():', isVoiceEnabled());
  console.log('[Speech Debug] gameState.volume:', gameState?.volume);

  if (!Root || !('speechSynthesis' in Root)) {
    console.warn('[Speech] speechSynthesis API not available');
    return;
  }

  if (!isVoiceEnabled()) {
    console.warn('[Speech] Voice is disabled (check 🗣️ button in top bar)');
    return;
  }

  // Check available voices
  const voices = Root.speechSynthesis.getVoices();
  console.log(
    '[Speech Debug] Available voices:',
    voices.length,
    voices.map(v => `${v.name} (${v.lang})`)
  );

  try {
    const isSpeaking = Root.speechSynthesis.speaking;
    const hasPending = Root.speechSynthesis.pending;

    // Strategy based on priority:
    // - HIGH priority (mode announcements): Always queue, never cancel
    // - NORMAL priority (game feedback): Cancel previous NORMAL-priority speech to avoid queue buildup
    //   BUT never cancel HIGH priority speech unless explicit override
    if (priority === 'high') {
      // High priority: set tracker immediately and always queue
      currentSpeechPriority = 'high';
      lastHighText = String(text || '');
      if (isSpeaking || hasPending) {
        console.log('[Speech] HIGH priority - queueing after current speech:', text);
      }
    } else {
      // Normal priority: only cancel if current speech is also normal (never cancel high!)
      if (isSpeaking || hasPending) {
        if (currentSpeechPriority === 'high') {
          if (allowInterruptHigh) {
            console.log('[Speech] NORMAL priority - interrupting HIGH priority speech:', text);
            try {
              Root.speechSynthesis.cancel();
              currentSpeechPriority = null;
              pendingHighReplay = lastHighText;
            } catch (e) {
              console.warn('[Speech] Error cancelling HIGH speech:', e);
            }
          } else {
            console.log(
              '[Speech] NORMAL priority - NOT cancelling HIGH priority speech, queueing:',
              text
            );
          }
        } else {
          console.log('[Speech] NORMAL priority - cancelling previous NORMAL speech:', text);
          try {
            Root.speechSynthesis.cancel();
            currentSpeechPriority = null; // Reset after cancel
          } catch (e) {
            console.warn('[Speech] Error cancelling:', e);
          }
        }
      } else {
        // No speech in progress, set to normal
        currentSpeechPriority = 'normal';
      }
    }

    let finalText = String(text || '');
    if (priority !== 'high' && pendingHighReplay) {
      finalText = `${pendingHighReplay}. ${finalText}`.trim();
      pendingHighReplay = null;
    }

    const utterance = setupUtterance(finalText, speechSettings);
    const vol = getVolumeLevel();
    utterance.volume = Math.max(0.1, Math.min(1, Number(vol || 1)));

    console.log('[Speech] Speaking:', {
      text: finalText,
      lang: utterance.lang,
      volume: utterance.volume,
      rate: utterance.rate,
      pitch: utterance.pitch,
      priority,
    });

    // Add event listeners for debugging and priority tracking
    utterance.onstart = () => {
      currentSpeechPriority = priority; // Track current priority
      if (priority === 'high') {
        pendingHighReplay = null;
      }
      console.log('[Speech] ✅ Started speaking:', finalText, `(priority: ${priority})`);
    };
    utterance.onend = () => {
      currentSpeechPriority = null; // Reset when done
      if (priority === 'high') {
        pendingHighReplay = null;
      }
      console.log('[Speech] ✅ Finished speaking:', finalText);
    };
    utterance.onerror = e => {
      currentSpeechPriority = null; // Reset on error
      if (priority === 'high') {
        pendingHighReplay = null;
      }
      console.error('[Speech] ❌ Error:', e);
    };

    Root.speechSynthesis.speak(utterance);
  } catch (e) {
    console.error('[Speech] Exception:', e);
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
