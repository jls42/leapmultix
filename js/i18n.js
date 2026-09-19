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
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
  } catch (e) {
    void e;
  }
}

/**
 * Langue du document : <html lang> (prononciation des lecteurs d'écran, césure)
 * et titre de l'onglet, qui est aussi le nom de la page pour les lecteurs d'écran.
 * @param {string} langCode - 'fr', 'en' ou 'es'
 */
export function applyDocumentLanguage(langCode) {
  try {
    if (langCode) document.documentElement.lang = langCode;
    const title = getTranslation('document_title');
    if (typeof title === 'string' && title && !title.startsWith('[')) document.title = title;
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
      applyDocumentLanguage(langCode);
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
  applyDocumentLanguage,
  updateLanguageButtons,
  updateSpeechVoice,
  changeLanguage,
};
