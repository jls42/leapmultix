/**
 * Voix enregistrée : qui l'entend, et avec quel moteur. Règles pures : le jeu leur passe
 * l'index (js/core/voice-index.js), la langue, ce que sait le navigateur et les choix du
 * joueur.
 *
 * - Disponible : la langue est dans l'index, son audience s'ouvre à ce navigateur
 *   (« all », ou « test » pour un navigateur marqué testeur) et il sait lire le MP3.
 * - Voix : celle que le joueur a choisie parmi les voix disponibles de la langue, sinon la
 *   voix par défaut, sinon la première autre voix ouverte à ce navigateur.
 * - Parole active : le choix du joueur (bouton de la barre du haut), sinon la voix
 *   enregistrée disponible et activée par défaut (defaultOn) ; sinon, coupée (v21).
 * - Moteur : les clips si la parole est active, la voix disponible et la case « Voix
 *   enregistrée » pas décochée ; la synthèse de l'appareil sinon. La case choisit le
 *   moteur, elle ne coupe jamais la parole.
 *
 * Coupe-circuit : une langue retirée de l'index n'est plus disponible. Un joueur qui
 * avait allumé la voix garde la synthèse ; les autres reviennent au comportement v21.
 */

/** L'audience d'une voix s'ouvre-t-elle à ce navigateur ? */
const opensTo = (audience, tester) => audience === 'all' || (audience === 'test' && tester);

/**
 * Voix disponibles pour une langue : la voix par défaut, puis les autres, si leur audience
 * s'ouvre à ce navigateur. Chacune porte la parole par défaut (defaultOn) de la langue.
 * @param {{languages: Object<string, Object>}|null} index - Index validé
 * @param {string} lang
 * @param {{tester?: boolean, canPlayMp3?: boolean}} [browser]
 * @returns {Object[]}
 */
export function availableVoices(index, lang, { tester = false, canPlayMp3 = false } = {}) {
  const entry = index?.languages?.[lang];
  if (!entry || !canPlayMp3) return [];
  const { alternatives = [], ...main } = entry;
  const others = alternatives.map(voice => ({ ...voice, defaultOn: entry.defaultOn }));
  return [main, ...others].filter(voice => opensTo(voice.audience, tester));
}

/**
 * Voix de l'index pour une langue, si la voix enregistrée y est disponible : celle que le
 * joueur a choisie, sinon la première disponible
 * @param {{languages: Object<string, Object>}|null} index - Index validé
 * @param {string} lang
 * @param {{tester?: boolean, canPlayMp3?: boolean}} [browser]
 * @param {string|null} [choice] - Nom de la voix choisie par le joueur
 * @returns {Object|null}
 */
export function recordedVoiceEntry(index, lang, browser = {}, choice = null) {
  const voices = availableVoices(index, lang, browser);
  return voices.find(voice => voice.voice === choice) ?? voices[0] ?? null;
}

/**
 * La parole est-elle active ?
 * @param {{voicePreference: boolean|null, entry: Object|null}} state
 *   voicePreference : choix du joueur, null s'il n'en a fait aucun
 * @returns {boolean}
 */
export function isSpeechActive({ voicePreference, entry }) {
  if (typeof voicePreference === 'boolean') return voicePreference;
  return Boolean(entry?.defaultOn);
}

/**
 * Moteur de la parole
 * @param {{speechActive: boolean, entry: Object|null, recordedPreference: boolean|null}} state
 *   recordedPreference : case « Voix enregistrée » (null : jamais touchée, vaut cochée)
 * @returns {'clips'|'synthesis'}
 */
export function speechEngineFor({ speechActive, entry, recordedPreference }) {
  return speechActive && entry && recordedPreference !== false ? 'clips' : 'synthesis';
}
