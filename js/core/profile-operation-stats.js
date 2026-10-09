/**
 * Statistiques par calcul d'un profil (champ `operationStats` du joueur), au format de
 * l'ancienne clé commune : { "7×8": { operator, a, b, attempts, errors, lastAttempt } }.
 * operation-stats.js les tient à jour ; le tirage du Quiz y lit les calculs ratés du joueur
 * courant (questionGenerator.js).
 *
 * Jusqu'ici, tout l'appareil partageait la clé localStorage `operationStats` : sur un poste de
 * classe, les erreurs d'un élève orientaient les questions des autres. Un profil qui n'a pas
 * encore ce champ en reçoit une copie, comme chaque profil existant le jour de la mise à jour
 * (aucun joueur courant n'est connu au démarrage : « le profil courant » serait le premier
 * choisi, au hasard). Cette clé n'est plus jamais écrite ni effacée : la version précédente la
 * retrouve telle quelle. stats-migration.js y a déjà versé l'ancienne `multiplicationStats`.
 *
 * Module sans dépendance au profil courant : userManager.js l'importe pour normaliser un profil.
 */
import Storage from './storage.js';

/** Clé localStorage commune à l'appareil, lue seulement pour amorcer un profil */
export const DEVICE_OPERATION_STATS_KEY = 'operationStats';

const OPERATORS = new Set(['×', '+', '−', '÷']);

const isPlainObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

const isCount = value => Number.isInteger(value) && value >= 0;

/** Clé d'un calcul : « 7×8 », « 7+4 » */
export const operationKey = (operator, a, b) => `${a}${operator}${b}`;

/** Opération connue et opérandes numériques */
function hasKnownOperands(entry) {
  return OPERATORS.has(entry.operator) && Number.isFinite(entry.a) && Number.isFinite(entry.b);
}

/** Essais et erreurs entiers, jamais plus d'erreurs que d'essais */
function hasCoherentCounts(entry) {
  return isCount(entry.attempts) && isCount(entry.errors) && entry.errors <= entry.attempts;
}

/** Entrée lisible, rangée sous sa propre clé */
function isReadableEntry([key, entry]) {
  return (
    isPlainObject(entry) &&
    hasKnownOperands(entry) &&
    hasCoherentCounts(entry) &&
    key === operationKey(entry.operator, entry.a, entry.b)
  );
}

/**
 * Copie des entrées lisibles : une valeur abîmée ne casse pas le profil.
 * @param {*} value
 * @returns {Object<string, Object>}
 */
export function normalizeOperationStats(value) {
  if (!isPlainObject(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter(isReadableEntry)
      .map(([key, entry]) => [key, { ...entry }])
  );
}

/**
 * Copie de la clé commune à l'appareil, point de départ d'un profil d'avant ce champ
 * @returns {Object<string, Object>}
 */
export function deviceOperationStats() {
  return normalizeOperationStats(Storage.get(DEVICE_OPERATION_STATS_KEY, {}));
}

/**
 * Statistiques d'un profil enregistré : les siennes, ou, s'il date d'avant ce champ, la copie
 * de celles de l'appareil. Un champ présent mais abîmé n'est pas réamorcé.
 * @param {Object|null|undefined} profile
 * @returns {Object<string, Object>}
 */
export function profileOperationStats(profile) {
  return Object.hasOwn(profile ?? {}, 'operationStats')
    ? normalizeOperationStats(profile.operationStats)
    : deviceOperationStats();
}

/**
 * Compte une réponse dans des statistiques (modifiées sur place).
 * @param {Object<string, Object>} stats
 * @param {{operator: string, a: number, b: number, isCorrect: boolean, now: number}} answer
 * @returns {Object} L'entrée du calcul, à jour
 */
export function countOperationAnswer(stats, { operator, a, b, isCorrect, now }) {
  const key = operationKey(operator, a, b);
  const previous = Object.hasOwn(stats, key) ? Reflect.get(stats, key) : null;
  const entry = previous ?? { operator, a, b, attempts: 0, errors: 0, lastAttempt: null };
  entry.attempts += 1;
  if (!isCorrect) entry.errors += 1;
  entry.lastAttempt = now;
  Object.assign(stats, { [key]: entry });
  return entry;
}
