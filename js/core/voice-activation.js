/**
 * Voix enregistrée : qui l'entend, et avec quel moteur. Règles pures : le jeu leur passe
 * l'index (js/core/voice-index.js), la langue, ce que sait le navigateur et les choix du
 * joueur.
 *
 * - Disponible : la langue est dans l'index, son audience s'ouvre à ce navigateur
 *   (« all », ou « test » pour un navigateur marqué testeur) et il sait lire le MP3.
 * - Parole active : le choix du joueur (bouton de la barre du haut), sinon la voix
 *   enregistrée disponible et activée par défaut (defaultOn) ; sinon, coupée (v21).
 * - Moteur : les clips si la parole est active, la voix disponible et la case « Voix
 *   enregistrée » pas décochée ; la synthèse de l'appareil sinon. La case choisit le
 *   moteur, elle ne coupe jamais la parole.
 *
 * Coupe-circuit : une langue retirée de l'index n'est plus disponible. Un joueur qui
 * avait allumé la voix garde la synthèse ; les autres reviennent au comportement v21.
 */

/**
 * Entrée de l'index pour une langue, si la voix enregistrée y est disponible
 * @param {{languages: Object<string, Object>}|null} index - Index validé
 * @param {string} lang
 * @param {{tester?: boolean, canPlayMp3?: boolean}} [browser]
 * @returns {Object|null}
 */
export function recordedVoiceEntry(index, lang, { tester = false, canPlayMp3 = false } = {}) {
  const entry = index?.languages?.[lang];
  if (!entry || !canPlayMp3) return null;
  if (entry.audience === 'all') return entry;
  return entry.audience === 'test' && tester ? entry : null;
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
