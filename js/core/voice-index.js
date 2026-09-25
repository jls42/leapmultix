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

const isObject = value => Boolean(value) && typeof value === 'object';
const matches = (value, pattern) => typeof value === 'string' && pattern.test(value);

/** Règles d'une entrée de langue, une par champ */
const LANGUAGE_RULES = [
  ({ voice }) => matches(voice, NAME),
  ({ version }) => matches(version, VERSION),
  ({ format }) => format === 'mp3',
  ({ audience }) => VOICE_AUDIENCES.includes(audience),
  ({ defaultOn }) => typeof defaultOn === 'boolean',
];

/**
 * Entrée de langue validée, ou null
 * @param {unknown} entry
 * @returns {{voice: string, version: string, format: 'mp3', audience: string, defaultOn: boolean}|null}
 */
function parseLanguage(entry) {
  if (!isObject(entry) || !LANGUAGE_RULES.every(rule => rule(entry))) return null;
  const { voice, version, format, audience, defaultOn } = entry;
  return { voice, version, format, audience, defaultOn };
}

/**
 * Index validé : les langues invalides sont écartées ; null si l'index entier ne vaut
 * rien (autre schéma d'empreinte, forme inattendue).
 * @param {unknown} data - JSON lu
 * @returns {{schema: string, languages: Object<string, Object>}|null}
 */
export function parseVoiceIndex(data) {
  if (!isObject(data) || data.schema !== VOICE_KEY_SCHEMA || !isObject(data.languages)) {
    return null;
  }
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
