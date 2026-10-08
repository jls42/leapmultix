/**
 * Compteurs du tableau de bord, par mode et par opération (`modeStats` du profil).
 *
 * Une seule source pour ce que voit le parent : réponses données et justes, parties commencées
 * (dès la première réponse, abandon compris), meilleurs scores des parties terminées (l'Arcade
 * garde aussi le score d'un abandon), fenêtre des 20 dernières réponses de chaque table de
 * multiplication pour « À revoir ». Les anciens champs (quizStats, challengeStats,
 * arcadeScores_<surnom>…) ne sont jamais effacés : la version précédente les relit en cas de
 * retour arrière, et recopie `modeStats` sans y toucher (champ de premier niveau).
 *
 * Profil d'avant la v37 : `modeStats` est amorcé une fois depuis ce qui est enregistré
 * (seedModeStats), à la lecture du profil, avant que `progressHistory` ne soit borné.
 * Ce module ne lit ni n'écrit le stockage : les modes lui passent le profil qu'ils
 * enregistrent eux-mêmes (aucune copie périmée n'écrase ainsi une autre écriture).
 */

export const MODE_STATS_VERSION = 1;
/** Réponses gardées par table pour « À revoir » */
export const REVIEW_WINDOW = 20;
/** Entrées gardées dans l'historique réponse par réponse (progressHistory) */
export const PROGRESS_HISTORY_LIMIT = 100;
/** Données d'avant la v37 dont l'opération n'a pas été enregistrée */
export const UNKNOWN_OPERATOR = '?';
export const ANSWER_MODES = Object.freeze(['quiz', 'challenge', 'adventure', 'chrono']);
export const ARCADE_GAMES = Object.freeze(['invasion', 'multimiam', 'multimemory', 'multisnake']);
export const CHALLENGE_DIFFICULTIES = Object.freeze(['easy', 'medium', 'hard']);

const OPERATORS = ['×', '+', '−', '÷'];
const OPERATOR_KEYS = new Set([...OPERATORS, UNKNOWN_OPERATOR]);
const ARCADE_TOP = 5;
const TABLE_MIN = 1;
const TABLE_MAX = 10;
// Énoncé d'un calcul : « 7 × 8 = ? ». Les gardes autour du premier nombre l'épinglent sur une
// suite de chiffres entière (même motif que stats-utils.js)
const STATEMENT = /(?<!\d)(\d+)(?!\d)\s*([×x+−\-÷])\s*(\d+)/;
const SIGN_TO_OPERATOR = { x: '×', '-': '−' };

const isPlainObject = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const count = value => {
  const number = Math.floor(Number(value));
  return Number.isFinite(number) && number > 0 ? number : 0;
};

/** Champs d'une opération, selon le mode : réponses ; parties ; records */
function emptyEntry(mode) {
  if (ARCADE_GAMES.includes(mode)) return { games: 0, total: 0, best: 0 };
  if (mode === 'challenge') return { games: 0, questions: 0, correct: 0, best: {} };
  if (mode === 'chrono') return { games: 0, questions: 0, correct: 0 };
  return { questions: 0, correct: 0 };
}

/** L'entrée d'une opération dans un mode, créée au besoin */
function entryOf(stats, mode, operator) {
  const op = OPERATOR_KEYS.has(operator) ? operator : '×';
  stats.modes[mode] ??= {};
  stats.modes[mode][op] ??= emptyEntry(mode);
  return stats.modes[mode][op];
}

export function emptyModeStats() {
  return {
    v: MODE_STATS_VERSION,
    modes: {},
    imported: { questions: 0, correct: 0 },
    arcadeTop5: {},
    review: {},
    // Heure de la dernière réponse du journal déjà comptée : les réponses plus récentes (écrites
    // par une version précédente, après un retour arrière) sont rattrapées à la lecture
    countedUntil: 0,
  };
}

/** Meilleur score par difficulté (Défi) : seulement les difficultés connues, nombres positifs */
function cleanBest(raw) {
  const best = {};
  for (const difficulty of CHALLENGE_DIFFICULTIES) {
    const score = count(raw?.[difficulty]);
    if (score > 0) best[difficulty] = score;
  }
  return best;
}

function cleanEntry(mode, raw) {
  const entry = emptyEntry(mode);
  for (const field of Object.keys(entry)) {
    entry[field] =
      field === 'best' && mode === 'challenge' ? cleanBest(raw?.best) : count(raw?.[field]);
  }
  if ('correct' in entry) entry.correct = Math.min(entry.correct, entry.questions);
  return entry;
}

function cleanModes(raw) {
  const modes = {};
  for (const mode of [...ANSWER_MODES, ...ARCADE_GAMES]) {
    if (!isPlainObject(raw?.[mode])) continue;
    for (const [operator, entry] of Object.entries(raw[mode])) {
      if (!OPERATOR_KEYS.has(operator) || !isPlainObject(entry)) continue;
      modes[mode] ??= {};
      modes[mode][operator] = cleanEntry(mode, entry);
    }
  }
  return modes;
}

function cleanTop5(list) {
  const scores = (Array.isArray(list) ? list : []).map(Number).filter(Number.isFinite);
  return scores.sort((left, right) => right - left).slice(0, ARCADE_TOP);
}

function cleanReview(raw) {
  const review = {};
  for (let table = TABLE_MIN; table <= TABLE_MAX; table += 1) {
    const marks = String(raw?.[table] ?? '').replaceAll(/[^01]/g, '');
    if (marks) review[table] = marks.slice(-REVIEW_WINDOW);
  }
  return review;
}

/**
 * `modeStats` d'un profil, nettoyé ; amorcé depuis l'existant s'il n'a pas encore de version.
 * Idempotente : elle tourne à chaque lecture du profil. Une version plus récente (écrite par
 * une version future du jeu) est rendue telle quelle.
 * @param {Object} profile - Profil brut (progressHistory, challengeStats, chronoStats…)
 * @param {(game: string) => number[]} [readLegacyArcade] - Top 5 d'un jeu d'Arcade rangé sous
 *   le surnom (localStorage), pour l'amorçage
 * @returns {Object}
 */
export function normalizeModeStats(profile, readLegacyArcade = () => []) {
  const raw = profile?.modeStats;
  if (isPlainObject(raw) && Number(raw.v) > MODE_STATS_VERSION) return raw;
  try {
    if (!isPlainObject(raw) || Number(raw.v) !== MODE_STATS_VERSION) {
      return seedModeStats(profile, readLegacyArcade);
    }
    return catchUpJournal(cleanModeStats(raw), profile?.progressHistory);
  } catch (error) {
    // Profil abîmé : le jeu reste jouable ; sans version, l'amorçage sera retenté à la
    // lecture suivante plutôt que figé à zéro
    console.warn('[mode-stats] Compteurs non amorcés :', error);
    const unseeded = emptyModeStats();
    delete unseeded.v;
    return unseeded;
  }
}

function cleanModeStats(raw) {
  const arcadeTop5 = {};
  for (const game of ARCADE_GAMES) {
    const top = cleanTop5(raw.arcadeTop5?.[game]);
    if (top.length > 0) arcadeTop5[game] = top;
  }
  return {
    v: MODE_STATS_VERSION,
    modes: cleanModes(raw.modes),
    imported: { questions: count(raw.imported?.questions), correct: count(raw.imported?.correct) },
    arcadeTop5,
    review: cleanReview(raw.review),
    countedUntil: count(raw.countedUntil),
  };
}

/** Opération d'une entrée de progressHistory : son champ, sinon le signe de l'énoncé, sinon × */
function operatorOfEntry(entry) {
  if (OPERATORS.includes(entry?.operator)) return entry.operator;
  const match = STATEMENT.exec(String(entry?.question ?? ''));
  const sign = match?.[2];
  return SIGN_TO_OPERATOR[sign] ?? (OPERATORS.includes(sign) ? sign : '×');
}

/** Table d'un énoncé de multiplication (premier nombre), comme getWeakTables */
function tableOfStatement(entry) {
  const match = STATEMENT.exec(String(entry?.question ?? ''));
  if (!match || !['×', 'x'].includes(match[2])) return null;
  const table = Number(match[1]);
  return table >= TABLE_MIN && table <= TABLE_MAX ? table : null;
}

function pushReview(review, table, isCorrect) {
  review[table] = `${review[table] ?? ''}${isCorrect ? '1' : '0'}`.slice(-REVIEW_WINDOW);
}

/**
 * Une réponse du journal dans les compteurs : son mode et son opération, et la fenêtre en ×
 * @returns {string|null} L'opération si c'est une réponse du Défi
 */
function countJournalEntry(stats, entry) {
  const operator = operatorOfEntry(entry);
  const isCorrect = entry.correct === true;
  const mode = ANSWER_MODES.includes(entry.mode) ? entry.mode : null;
  const target = mode ? entryOf(stats, mode, operator) : stats.imported;
  target.questions += 1;
  if (isCorrect) target.correct += 1;
  const table = operator === '×' ? tableOfStatement(entry) : null;
  if (table !== null) pushReview(stats.review, table, isCorrect);
  return mode === 'challenge' ? operator : null;
}

/**
 * Rattrapage : les réponses du journal plus récentes que la dernière comptée (écrites par une
 * version précédente pendant un retour arrière) entrent dans les compteurs, une seule fois
 */
function catchUpJournal(stats, history) {
  const entries = Array.isArray(history) ? history : [];
  for (const entry of entries) {
    const at = Number(entry?.timestamp);
    if (!isPlainObject(entry) || !Number.isFinite(at) || at <= stats.countedUntil) continue;
    countJournalEntry(stats, entry);
    stats.countedUntil = at;
  }
  return stats;
}

/** Opérations des réponses du journal */
function journalOperators(profile, played) {
  for (const entry of Array.isArray(profile?.progressHistory) ? profile.progressHistory : []) {
    if (isPlainObject(entry)) played.add(operatorOfEntry(entry));
  }
}

/** Opérations où l'Aventure a des niveaux (l'ancien format est en multiplication) */
function adventureOperators(profile, played) {
  if (isPlainObject(profile?.adventureProgress) && Object.keys(profile.adventureProgress).length) {
    played.add('×');
  }
  for (const [operator, levels] of Object.entries(profile?.adventureProgressByOperator ?? {})) {
    if (OPERATORS.includes(operator) && isPlainObject(levels) && Object.keys(levels).length) {
      played.add(operator);
    }
  }
}

/**
 * Opérations explorées en Découverte (« 7 » : une table de ×, « +:easy » : un niveau ; une
 * ancienne clé sans opération, que la Découverte ignore, ne compte pas) et en Chrono
 */
function discoveryAndChronoOperators(profile, played) {
  const explored = profile?.discoveryProgress?.exploredTables;
  for (const key of Array.isArray(explored) ? explored : []) {
    const [operator, level] = String(key).split(':');
    if (level !== undefined && OPERATORS.includes(operator)) played.add(operator);
    else if (level === undefined && /^\d+$/.test(operator)) played.add('×');
  }
  for (const [operator, store] of Object.entries(profile?.chronoStatsByOperator ?? {})) {
    if (!OPERATORS.includes(operator) || !isPlainObject(store)) continue;
    const used = [store.buckets, store.basket].some(list => Array.isArray(list) && list.length);
    if (used) played.add(operator);
  }
}

/**
 * Opérations jouées, d'après ce que le profil a enregistré : réponses du journal, niveaux
 * d'Aventure, explorations de la Découverte, Chrono hors multiplication.
 */
function playedOperators(profile) {
  const played = new Set();
  journalOperators(profile, played);
  adventureOperators(profile, played);
  discoveryAndChronoOperators(profile, played);
  return played;
}

/** L'opération unique d'un ensemble, sinon « ? » (données anciennes qu'on ne peut pas répartir) */
const singleOperator = operators => (operators.size === 1 ? [...operators][0] : UNKNOWN_OPERATOR);

function seedAnswers(stats, profile) {
  const challengeOperators = new Set();
  for (const entry of Array.isArray(profile?.progressHistory) ? profile.progressHistory : []) {
    if (!isPlainObject(entry)) continue;
    const challengeOperator = countJournalEntry(stats, entry);
    if (challengeOperator) challengeOperators.add(challengeOperator);
    const at = Number(entry.timestamp);
    if (Number.isFinite(at)) stats.countedUntil = Math.max(stats.countedUntil, at);
  }
  return challengeOperators;
}

function seedChallenge(stats, profile, operator) {
  const legacy = isPlainObject(profile?.challengeStats) ? profile.challengeStats : {};
  let games = 0;
  const best = {};
  for (const difficulty of CHALLENGE_DIFFICULTIES) {
    games += count(legacy[difficulty]?.totalPlayed);
    const score = count(legacy[difficulty]?.bestScore);
    if (score > 0) best[difficulty] = score;
  }
  if (games === 0 && Object.keys(best).length === 0) return;
  const entry = entryOf(stats, 'challenge', operator);
  entry.games += games;
  for (const [difficulty, score] of Object.entries(best)) {
    entry.best[difficulty] = Math.max(entry.best[difficulty] ?? 0, score);
  }
}

function seedChrono(stats, profile) {
  const stores = [['×', profile?.chronoStats]];
  for (const [operator, store] of Object.entries(profile?.chronoStatsByOperator ?? {})) {
    if (OPERATORS.includes(operator) && operator !== '×') stores.push([operator, store]);
  }
  for (const [operator, store] of stores) {
    const buckets = Array.isArray(store?.buckets) ? store.buckets : [];
    const games = buckets.reduce((sum, bucket) => sum + count(bucket?.count), 0);
    if (games > 0) entryOf(stats, 'chrono', operator).games += games;
  }
}

function seedArcade(stats, readLegacyArcade, operator) {
  for (const game of ARCADE_GAMES) {
    const top = cleanTop5(readLegacyArcade(game));
    if (top.length === 0) continue;
    const entry = entryOf(stats, game, operator);
    entry.games += top.length;
    entry.total += top.reduce((sum, score) => sum + Math.max(0, score), 0);
    entry.best = Math.max(entry.best, top[0]);
    stats.arcadeTop5[game] = top;
  }
}

/**
 * Amorçage depuis un profil d'avant la v37, sans rien en effacer. Les réponses du journal
 * sont exactes, par mode et par opération ; les parties et records anciens n'ont pas
 * d'opération : celle du mode dans le journal si elle est unique, sinon celle du profil si
 * l'enfant n'a jamais joué qu'une opération, sinon « ? ».
 * @param {Object} profile
 * @param {(game: string) => number[]} [readLegacyArcade]
 * @returns {Object}
 */
export function seedModeStats(profile, readLegacyArcade = () => []) {
  const stats = emptyModeStats();
  const challengeOperators = seedAnswers(stats, profile);
  const profileOperator = singleOperator(playedOperators(profile));
  const challengeOperator =
    challengeOperators.size > 0 ? singleOperator(challengeOperators) : profileOperator;
  seedChallenge(stats, profile, challengeOperator);
  seedChrono(stats, profile);
  seedArcade(stats, readLegacyArcade, profileOperator);
  // Même forme et même ordre que la relecture : amorcer puis relire ne change rien
  return cleanModeStats(stats);
}

/**
 * Compteurs à écrire : ceux du profil, amorcés s'ils ne l'ont pas été (profil qui n'est pas
 * passé par UserManager), jamais figés à zéro ; null pour une version plus récente du jeu,
 * qu'on ne réécrit pas
 */
function statsOf(userData) {
  const current = userData.modeStats;
  if (isPlainObject(current) && Number(current.v) > MODE_STATS_VERSION) return null;
  if (!isPlainObject(current) || Number(current.v) !== MODE_STATS_VERSION) {
    userData.modeStats = normalizeModeStats(userData);
  }
  const stats = userData.modeStats;
  stats.modes ??= {};
  stats.imported ??= { questions: 0, correct: 0 };
  stats.arcadeTop5 ??= {};
  stats.review ??= {};
  return stats;
}

/**
 * Une réponse : comptée dans son mode et son opération ; une partie de plus si c'est la
 * première de la partie ; en multiplication, la fenêtre de sa table.
 * @param {Object} userData - Profil que l'appelant enregistre ensuite
 * @param {{mode: string, operator: string, table?: number|null, isCorrect: boolean,
 *          startsGame?: boolean}} answer
 */
export function recordModeAnswer(userData, { mode, operator, table, isCorrect, startsGame }) {
  if (!ANSWER_MODES.includes(mode)) return;
  const stats = statsOf(userData);
  if (!stats) return;
  const entry = entryOf(stats, mode, operator);
  entry.questions += 1;
  if (isCorrect) entry.correct += 1;
  if (startsGame && 'games' in entry) entry.games += 1;
  const tableNumber = Number(table);
  if (operator === '×' && Number.isInteger(tableNumber)) {
    if (tableNumber >= TABLE_MIN && tableNumber <= TABLE_MAX) {
      pushReview(stats.review, tableNumber, isCorrect);
    }
  }
}

/**
 * Meilleur score d'un Défi terminé (pas d'un abandon), dans sa difficulté
 * @param {Object} userData
 * @param {{operator: string, difficulty: string, score: number}} result
 */
export function recordChallengeBest(userData, { operator, difficulty, score }) {
  const stats = statsOf(userData);
  if (!stats || !CHALLENGE_DIFFICULTIES.includes(difficulty)) return;
  const entry = entryOf(stats, 'challenge', operator);
  entry.best[difficulty] = Math.max(entry.best[difficulty] ?? 0, count(score));
}

/**
 * Une partie d'Arcade jouée (au moins un coup), terminée ou abandonnée : son score compte
 * pour la moyenne, le record et les 5 meilleurs scores de l'écran de fin.
 * @param {Object} userData
 * @param {{game: string, operator: string, score: number}} result
 */
export function recordArcadeGame(userData, { game, operator, score }) {
  const stats = statsOf(userData);
  if (!stats || !ARCADE_GAMES.includes(game)) return;
  const points = Math.max(0, Number(score) || 0);
  const entry = entryOf(stats, game, operator);
  entry.games += 1;
  entry.total += points;
  entry.best = Math.max(entry.best, points);
  stats.arcadeTop5[game] = cleanTop5([...(stats.arcadeTop5[game] ?? []), points]);
}

/** « Remettre à zéro » un jeu d'Arcade : ses meilleurs scores et ses compteurs */
export function resetArcadeGame(userData, game) {
  const stats = statsOf(userData);
  if (!stats) return;
  delete stats.modes[game];
  delete stats.arcadeTop5[game];
}

/** Les 5 meilleurs scores d'un jeu d'Arcade */
export function arcadeTopScores(userData, game) {
  return [...(userData?.modeStats?.arcadeTop5?.[game] ?? [])];
}

/**
 * Ajoute une réponse à l'historique réponse par réponse, borné aux dernières entrées : il ne
 * sert plus qu'au retour arrière, les compteurs portent le reste.
 * @param {Object} userData
 * @param {Object} entry
 */
export function appendProgressHistory(userData, entry) {
  // Compteurs lus, ou amorcés, avant la coupe : l'amorçage voit tout l'historique
  const stats = statsOf(userData);
  const seeded = stats?.v === MODE_STATS_VERSION;
  const history = Array.isArray(userData.progressHistory) ? userData.progressHistory : [];
  history.push(entry);
  // Coupé seulement une fois l'amorçage réussi : un amorçage à refaire relira tout
  userData.progressHistory = seeded ? history.slice(-PROGRESS_HISTORY_LIMIT) : history;
  // Réponse déjà comptée (GameMode.recordAnswer) : le rattrapage ne la recompte pas
  const at = Number(entry?.timestamp);
  if (seeded && Number.isFinite(at)) stats.countedUntil = Math.max(count(stats.countedUntil), at);
}

/** Tables à revoir : au moins 3 réponses dans la fenêtre, moins de 70 % de justes */
export function weakTablesFrom(stats) {
  const weak = [];
  for (const [table, marks] of Object.entries(stats?.review ?? {})) {
    if (marks.length < 3) continue;
    const correct = [...marks].filter(mark => mark === '1').length;
    if ((correct / marks.length) * 100 < 70) weak.push(Number(table));
  }
  return weak.sort((left, right) => left - right);
}

/** Réponses de « Ton parcours » : Quiz, Défi, Aventure, Chrono et réponses anciennes sans mode */
export function answerTotals(stats) {
  const totals = {
    questions: count(stats?.imported?.questions),
    correct: count(stats?.imported?.correct),
  };
  for (const mode of ANSWER_MODES) {
    for (const entry of Object.values(stats?.modes?.[mode] ?? {})) {
      totals.questions += count(entry.questions);
      totals.correct += count(entry.correct);
    }
  }
  return totals;
}

/** Entrées d'un mode, par opération, dans l'ordre ×, +, −, ÷, puis « ? » */
export function modeEntries(stats, mode) {
  const byOperator = stats?.modes?.[mode] ?? {};
  return [...OPERATORS, UNKNOWN_OPERATOR]
    .filter(operator => isPlainObject(byOperator[operator]))
    .map(operator => ({ operator, ...byOperator[operator] }));
}
