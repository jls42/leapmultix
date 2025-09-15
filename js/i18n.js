/**
 * i18n helpers (ESM)
 * Now prefers an internal store, while keeping safe fallbacks to legacy window.*
 */
import Storage from './core/storage.js';
import { updateSpeechVoice as esmUpdateSpeechVoice } from './speech.js';
import { translate as storeTranslate, loadIntoStore } from './i18n-store.js';
const _warnedMissing = new Set();
import { eventBus } from './core/eventBus.js';

export function getTranslation(key, params = {}) {
  const v = storeTranslate(key, params);
  if (typeof v === 'string' && /^\[[^\]]+\]$/.test(v)) {
    if (!_warnedMissing.has(key)) {
      _warnedMissing.add(key);
      try {
        console.warn(`i18n: missing key '${key}'`);
      } catch (e) {
        void e;
      }
    }
  }
  return v;
}

export async function loadTranslations(lang) {
  try {
    await loadIntoStore(lang);
    return true;
  } catch {
    return false;
  }
}

export function applyStaticTranslations() {
  try {
    // data-translate: safe text
    document.querySelectorAll('[data-translate]')?.forEach(el => {
      const key = el.getAttribute('data-translate');
      if (!key) return;
      const val = getTranslation(key);
      if (typeof val === 'string' && !val.startsWith('[')) el.textContent = val;
    });
    // data-translate-title
    document.querySelectorAll('[data-translate-title]')?.forEach(el => {
      const key = el.getAttribute('data-translate-title');
      if (!key) return;
      const val = getTranslation(key);
      if (typeof val === 'string' && !val.startsWith('[')) el.title = val;
    });
    // data-translate-placeholder
    document.querySelectorAll('[data-translate-placeholder]')?.forEach(el => {
      const key = el.getAttribute('data-translate-placeholder');
      if (!key) return;
      const val = getTranslation(key);
      if (typeof val === 'string' && !val.startsWith('[')) el.setAttribute('placeholder', val);
    });
    // data-translate-aria-label
    document.querySelectorAll('[data-translate-aria-label]')?.forEach(el => {
      const key = el.getAttribute('data-translate-aria-label');
      if (!key) return;
      const val = getTranslation(key);
      if (typeof val === 'string' && !val.startsWith('[')) el.setAttribute('aria-label', val);
    });
  } catch (e) {
    void e;
  }
}

export function updateLanguageButtons() {
  try {
    const lang = Storage.loadLanguage?.() || 'fr';
    document.querySelectorAll('.lang-btn')?.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  } catch (e) {
    void e;
  }
}

// Use ESM speech helper directly
export const updateSpeechVoice = esmUpdateSpeechVoice;

export async function changeLanguage(langCode) {
  try {
    Storage.saveLanguage(langCode);
  } catch (e) {
    void e;
  }
  try {
    const ok = await loadTranslations(langCode);
    if (ok) {
      try {
        updateSpeechVoice(langCode);
      } catch (e) {
        void e;
      }
      try {
        applyStaticTranslations();
      } catch (e) {
        void e;
      }
      try {
        updateLanguageButtons();
      } catch (e) {
        void e;
      }
      try {
        eventBus.emit('languageChanged', { lang: langCode });
      } catch (e) {
        void e;
      }
      try {
        globalThis.dispatchEvent(
          new CustomEvent('languageChanged', { detail: { lang: langCode } })
        );
      } catch (e) {
        void e;
      }
      return true;
    }
  } catch (e) {
    void e;
  }
  return false;
}

export default {
  getTranslation,
  loadTranslations,
  applyStaticTranslations,
  updateLanguageButtons,
  updateSpeechVoice,
  changeLanguage,
};
