/**
 * Sauvegarde des joueurs dans un fichier JSON, et reprise sur cet appareil ou sur un autre.
 * Les profils ne vivent que dans le stockage du navigateur : un poste d'école remis à zéro,
 * ou un navigateur vidé, effaçait toute la classe sans recours.
 *
 * Format du fichier : { format: 'leapmultix-players', version: 1, exportedAt, players }, où
 * players reprend tels qu'ils sont rangés les profils de « Qui joue ? » (pas la corbeille).
 * Un fichier relu est vérifié avant d'ajouter quoi que ce soit (UserManager.importPlayers) ;
 * un joueur déjà présent n'est jamais écrasé.
 */

export const BACKUP_FORMAT = 'leapmultix-players';
export const BACKUP_VERSION = 1;

/** Au-delà, ce n'est pas une sauvegarde de joueurs (le stockage du navigateur tient ~5 Mo) */
export const BACKUP_MAX_BYTES = 10 * 1024 * 1024;

/**
 * Prénom qu'une version du jeu a pu ranger : la règle actuelle (checkUsername), ou l'ancienne,
 * qui gardait aussi chiffres, point et tiret bas (« Léa B. », « 7 »). Jamais « __proto__ ».
 */
const STORED_NAME = /^[\p{L}\p{M}\p{N}\p{Zs}'’.·_‌-]{1,50}$/u;

const isPlainObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

/**
 * @param {*} name
 * @returns {boolean}
 */
export function isStoredPlayerName(name) {
  return (
    typeof name === 'string' &&
    name !== '__proto__' &&
    name.trim() === name &&
    STORED_NAME.test(name)
  );
}

/**
 * Contenu du fichier de sauvegarde
 * @param {Object<string, Object>} players - Profils, sous leur prénom
 * @param {Date} [now]
 * @returns {{format: string, version: number, exportedAt: string, players: Object}}
 */
export function buildPlayersBackup(players, now = new Date()) {
  return { format: BACKUP_FORMAT, version: BACKUP_VERSION, exportedAt: now.toISOString(), players };
}

/**
 * Nom du fichier, daté du jour de l'appareil : « leapmultix-joueurs-2026-10-08.json »
 * @param {string} prefix
 * @param {Date} date
 * @returns {string}
 */
export function backupFileName(prefix, date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${prefix}-${date.getFullYear()}-${month}-${day}.json`;
}

/**
 * Relit le texte d'un fichier de sauvegarde.
 * @param {string} text
 * @returns {{error: 'json'|'format'|'version'}|{players: Array<[string, Object]>, rejected: number}}
 *   L'erreur qui le fait refuser, ou les joueurs lisibles et le nombre d'écartés
 */
export function readPlayersBackup(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { error: 'json' };
  }
  if (!isPlainObject(parsed) || parsed.format !== BACKUP_FORMAT) return { error: 'format' };
  if (Number.isInteger(parsed.version) && parsed.version > BACKUP_VERSION) {
    return { error: 'version' };
  }
  if (parsed.version !== BACKUP_VERSION || !isPlainObject(parsed.players)) {
    return { error: 'format' };
  }
  const entries = Object.entries(parsed.players);
  const players = entries.filter(([name, data]) => isStoredPlayerName(name) && isPlainObject(data));
  return { players, rejected: entries.length - players.length };
}

/**
 * Demande au navigateur de ne pas effacer les données du jeu pour faire de la place
 * (navigator.storage.persist). Chrome décide seul ; Firefox peut poser la question.
 * @returns {Promise<boolean>} Vrai si les données sont protégées
 */
export async function requestPersistentStorage() {
  const storage = globalThis.navigator?.storage;
  if (typeof storage?.persist !== 'function') return false;
  try {
    if (await storage.persisted?.()) return true;
    return await storage.persist();
  } catch {
    return false;
  }
}
