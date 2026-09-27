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
 *       "version": "lucie-v3-2",              dossier des clips : /voice/fr/lucie-v3-2/
 *       "format": "mp3",
 *       "audience": "test",                   "test" : navigateurs marqués ?voix=test ; "all"
 *       "defaultOn": false,                   parole active par défaut (sans choix du joueur)
 *       "provider": "elevenlabs",             facultatif : service qui a créé la voix
 *       "alternatives": [                     facultatif : autres voix au choix du joueur
 *         { "voice": "…", "version": "…", "format": "mp3", "audience": "all", "provider": "…" }
 *       ]
 *     }
 *   }
 * }
 * Une langue absente n'a de clips pour personne : c'est le coupe-circuit.
 *
 * La voix par défaut reste en tête de l'entrée : une version du jeu qui ne connaît pas les
 * champs facultatifs les ignore et continue de lire cette voix-là.
 */
import { VOICE_KEY_SCHEMA } from './spoken-text.js';

export const VOICE_AUDIENCES = ['test', 'all'];

/** Services qui créent les voix, nommés dans la mention des réglages */
export const VOICE_PROVIDERS = ['elevenlabs', 'google', 'mistral'];

/** Autres voix d'une langue, au plus */
export const MAX_ALTERNATIVES = 4;

const NAME = /^[a-z0-9][a-z0-9-]{0,31}$/;
const VERSION = /^[a-z0-9][a-z0-9.-]{0,63}$/;
const LANG = /^[a-z]{2}$/;

const isObject = value => Boolean(value) && typeof value === 'object';
const matches = (value, pattern) => typeof value === 'string' && pattern.test(value);

/** Règles d'une voix, une par champ */
const VOICE_RULES = [
  ({ voice }) => matches(voice, NAME),
  ({ version }) => matches(version, VERSION),
  ({ format }) => format === 'mp3',
  ({ audience }) => VOICE_AUDIENCES.includes(audience),
];

/** Voix validée, sans son service s'il est inconnu (la voix reste lisible) */
function parseVoice(entry) {
  if (!isObject(entry) || !VOICE_RULES.every(rule => rule(entry))) return null;
  const { voice, version, format, audience } = entry;
  const parsed = { voice, version, format, audience };
  if (VOICE_PROVIDERS.includes(entry.provider)) parsed.provider = entry.provider;
  return parsed;
}

/**
 * Autres voix validées : les invalides, celles qui répètent un nom ou une version déjà vus,
 * et celles au-delà de MAX_ALTERNATIVES sont écartées
 */
function parseAlternatives(list, main) {
  if (!Array.isArray(list)) return [];
  const names = new Set([main.voice]);
  const versions = new Set([main.version]);
  const alternatives = [];
  for (const item of list) {
    const voice = parseVoice(item);
    if (!voice || names.has(voice.voice) || versions.has(voice.version)) continue;
    names.add(voice.voice);
    versions.add(voice.version);
    alternatives.push(voice);
    if (alternatives.length === MAX_ALTERNATIVES) break;
  }
  return alternatives;
}

/**
 * Entrée de langue validée, ou null. Les scripts de publication s'en servent aussi : une
 * entrée que le jeu écarterait n'est jamais publiée. Les champs facultatifs n'apparaissent
 * que s'ils sont valides.
 * @param {unknown} entry
 * @returns {{voice: string, version: string, format: 'mp3', audience: string,
 *   defaultOn: boolean, provider?: string, alternatives?: Object[]}|null}
 */
export function parseLanguage(entry) {
  const main = parseVoice(entry);
  if (!main || typeof entry.defaultOn !== 'boolean') return null;
  const { provider, ...voice } = main;
  const parsed = { ...voice, defaultOn: entry.defaultOn };
  if (provider) parsed.provider = provider;
  const alternatives = parseAlternatives(entry.alternatives, parsed);
  if (alternatives.length) parsed.alternatives = alternatives;
  return parsed;
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
