/**
 * Corbeille des joueurs supprimés (clé localStorage `playersTrash`) : un profil supprimé y
 * attend TRASH_DAYS jours avec toutes ses données, se restaure depuis « Qui joue ? », puis il
 * est effacé pour de bon au premier lancement qui suit (UserManager.purgeExpiredTrash).
 *
 * Une liste d'entrées { name, deletedAt, data } plutôt qu'un objet par prénom : deux « Léa »
 * supprimées tour à tour y gardent chacune leur place. Clé à part, que la version précédente
 * ignore : un retour arrière ne fait pas réapparaître les joueurs supprimés.
 */
import Storage from './storage.js';

export const PLAYERS_TRASH_KEY = 'playersTrash';

/** Jours passés dans la corbeille avant l'effacement */
export const TRASH_DAYS = 30;

const DAY_MS = 24 * 60 * 60 * 1000;

const isPlainObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

/** Entrée lisible : un prénom, une date de suppression, un profil */
function isTrashEntry(entry) {
  return (
    isPlainObject(entry) &&
    typeof entry.name === 'string' &&
    entry.name !== '' &&
    Number.isFinite(entry.deletedAt) &&
    Object.hasOwn(entry, 'data')
  );
}

/**
 * Entrées lisibles de la corbeille ; une valeur illisible compte pour une corbeille vide
 * @returns {Array<{name: string, deletedAt: number, data: Object}>}
 */
export function loadTrash() {
  const entries = Storage.get(PLAYERS_TRASH_KEY, []);
  return Array.isArray(entries) ? entries.filter(isTrashEntry) : [];
}

/**
 * @param {Array<Object>} entries
 * @returns {boolean} Faux si le navigateur refuse d'écrire
 */
export function saveTrash(entries) {
  return Storage.set(PLAYERS_TRASH_KEY, entries);
}

/**
 * Date de l'effacement pour de bon
 * @param {{deletedAt: number}} entry
 * @returns {number}
 */
export function trashExpiry(entry) {
  return entry.deletedAt + TRASH_DAYS * DAY_MS;
}

/**
 * @param {{deletedAt: number}} entry
 * @param {number} now
 * @returns {boolean}
 */
export function isTrashExpired(entry, now) {
  return now >= trashExpiry(entry);
}

/**
 * Entrées encore restaurables
 * @param {number} [now]
 * @returns {Array<{name: string, deletedAt: number, data: Object}>}
 */
export function restorableTrash(now = Date.now()) {
  return loadTrash().filter(entry => !isTrashExpired(entry, now));
}
