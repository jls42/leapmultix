/**
 * i18n-store.js (ESM)
 * Central store for translations and language, independent from window.*
 * Provides helpers to fetch and translate keys. Keeps in sync with legacy i18n when present.
 */

import { VERSION_PARAM } from './cache-updater.js';
import { eventBus } from './core/eventBus.js';
import { pickRandom } from './core/random.js';
import { formatMessage } from './core/message-format.js';

/**
 * Ramène une langue quelconque à une des trois langues livrées avec l'application.
 * La valeur reçue peut venir d'un événement extérieur ou d'un stockage modifié :
 * ce qui ressort est toujours un littéral écrit ici, jamais la valeur d'entrée,
 * pour qu'aucune adresse arbitraire ne puisse être composée.
 * @param {unknown} lang - 'fr', 'en', 'es', ou une variante régionale ('fr-CA')
 * @returns {'fr'|'en'|'es'}
 */
function langueLivree(lang) {
  const demandee = typeof lang === 'string' ? lang.toLowerCase().split('-')[0] : '';
  if (demandee === 'en') return 'en';
  if (demandee === 'es') return 'es';
  return 'fr';
}

let _currentLanguage = 'fr';
let _translations = {};
let _ready = false;

export function getCurrentLanguage() {
  return _currentLanguage;
}

export function setCurrentLanguage(lang) {
  _currentLanguage = lang || 'fr';
}

export function isReady() {
  return _ready;
}

export function setReady(flag) {
  _ready = !!flag;
}

export function getTranslations() {
  return _translations;
}

export function setTranslations(obj) {
  _translations = obj || {};
}

// Utility: resolve nested key like "section.sub.key"
function resolveKey(obj, path) {
  return path.split('.').reduce((acc, seg) => acc?.[seg], obj);
}

// Translate using the local store only
export function translate(key, params = {}) {
  if (!key) return '';
  let value = resolveKey(_translations, key);

  if (value === undefined) value = _translations[key];
  if (value === undefined) return `[${key}]`;
  if (Array.isArray(value)) value = pickRandom(value);
  if (typeof value === 'string' && params && Object.keys(params).length > 0) {
    value = formatMessage(value, params, _currentLanguage);
  }
  return value;
}

// Fetch translations JSON for a language (no global side effects)
export async function fetchTranslations(lang) {
  const l = langueLivree(lang || _currentLanguage);
  const ver = VERSION_PARAM || Date.now();
  const url = `assets/translations/${l}.json?v=${ver}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch translations: ${l}`);
  return await res.json();
}

// Load into store (preferred ESM path)
export async function loadIntoStore(lang) {
  const l = langueLivree(lang);
  const json = await fetchTranslations(l);
  setTranslations(json);
  setCurrentLanguage(l);
  setReady(true);
  return true;
}

// Sync with legacy window store when language changes via legacy path or EventBus
try {
  const g =
    typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : null;
  if (g) {
    // Initial sync if legacy i18n already loaded
    if (g.i18nReady && g.currentTranslations && Object.keys(g.currentTranslations).length) {
      setTranslations(g.currentTranslations);
      try {
        setCurrentLanguage(
          g.loadLanguage ? g.loadLanguage() : localStorage.getItem('language') || 'fr'
        );
      } catch {
        setCurrentLanguage('fr');
      }
      setReady(true);
    }
    // Keep in sync on languageChanged
    g.addEventListener?.('languageChanged', e => {
      try {
        if (g.currentTranslations) setTranslations(g.currentTranslations);
        const lang = e?.detail?.lang || (g.loadLanguage ? g.loadLanguage() : null);
        if (lang) setCurrentLanguage(lang);
        setReady(true);
      } catch {
        /* ignoré volontairement */
      }
    });
  }
} catch {
  /* ignoré volontairement */
}

try {
  eventBus.on('languageChanged', e => {
    try {
      const lang = e?.detail?.lang || null;
      if (lang) setCurrentLanguage(lang);
      setReady(true);
    } catch {
      /* ignoré volontairement */
    }
  });
} catch {
  /* ignoré volontairement */
}

export default {
  getCurrentLanguage,
  setCurrentLanguage,
  isReady,
  setReady,
  getTranslations,
  setTranslations,
  translate,
  fetchTranslations,
  loadIntoStore,
};
