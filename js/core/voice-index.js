/**
 * Index de la voix enregistrée (/voice/index.json) : quelles langues ont leurs clips, dans
 * quelle version, pour qui. Module pur, partagé par le jeu (qui ne fait confiance qu'à un
 * index valide) et par les scripts qui l'écrivent (scripts/voice/).
 *
 * {
 *   "schema": "cyrb53-nfc-1",                 empreinte des phrases (spoken-text.js)
 *   "languages": {
 *     "fr": {
 *       "voice": "lucie",                     nom de la voix
 *       "version": "lucie-v3-1",              dossier des clips : /voice/fr/lucie-v3-1/
 *       "format": "mp3",
 *       "audience": "test",                   "test" : navigateurs marqués ?voix=test ; "all"
 *       "defaultOn": false                    parole active par défaut (sans choix du joueur)
 *     }
 *   }
 * }
 * Une langue absente n'a de clips pour personne : c'est le coupe-circuit.
 */
import { VOICE_KEY_SCHEMA } from './spoken-text.js';

export const VOICE_AUDIENCES = ['test', 'all'];

const NAME = /^[a-z0-9][a-z0-9-]{0,31}$/;
const VERSION = /^[a-z0-9][a-z0-9.-]{0,63}$/;
const LANG = /^[a-z]{2}$/;

/**
 * Entrée de langue validée, ou null
 * @param {unknown} entry
 * @returns {{voice: string, version: string, format: 'mp3', audience: string, defaultOn: boolean}|null}
 */
function parseLanguage(entry) {
  if (!entry || typeof entry !== 'object') return null;
  const { voice, version, format, audience, defaultOn } = entry;
  const valid =
    typeof voice === 'string' &&
    NAME.test(voice) &&
    typeof version === 'string' &&
    VERSION.test(version) &&
    format === 'mp3' &&
    VOICE_AUDIENCES.includes(audience) &&
    typeof defaultOn === 'boolean';
  return valid ? { voice, version, format, audience, defaultOn } : null;
}

/**
 * Index validé : les langues invalides sont écartées ; null si l'index entier ne vaut
 * rien (autre schéma d'empreinte, forme inattendue).
 * @param {unknown} data - JSON lu
 * @returns {{schema: string, languages: Object<string, Object>}|null}
 */
export function parseVoiceIndex(data) {
  if (!data || typeof data !== 'object' || data.schema !== VOICE_KEY_SCHEMA) return null;
  if (!data.languages || typeof data.languages !== 'object') return null;
  const languages = {};
  for (const [lang, entry] of Object.entries(data.languages)) {
    const parsed = LANG.test(lang) ? parseLanguage(entry) : null;
    if (parsed) languages[lang] = parsed;
  }
  return { schema: VOICE_KEY_SCHEMA, languages };
}

/**
 * Chemin d'un clip, relatif à la base de la voix (« /voice/ »)
 * @param {string} lang
 * @param {{version: string}} entry - Entrée de langue validée
 * @param {string} key - Empreinte de la phrase (voiceKey)
 */
export function clipPath(lang, entry, key) {
  return `${lang}/${entry.version}/${key}.mp3`;
}
