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

const OPERATORS = new Set(['×', '+', '−', '÷']);
const OPERATOR_KEYS = new Set([...OPERATORS, UNKNOWN_OPERATOR]);
const ARCADE_TOP = 5;
const TABLE_MIN = 1;
const TABLE_MAX = 10;
// Énoncé d'un calcul : « 7 × 8 = ? ». Les gardes autour du premier nombre l'épinglent sur une
// suite de chiffres entière (même motif que stats-utils.js)
const STATEMENT = /(?<!\d)(\d+)(?!\d)\s*([×x+−\-÷])\s*(\d+)/;
const SIGN_TO_OPERATOR = new Map([
  ['x', '×'],
  ['-', '−'],
]);

const isPlainObject = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const count = value => {
  const number = Math.floor(Number(value));
  return Number.isFinite(number) && number > 0 ? number : 0;
};

/**
 * Valeur propre d'une clé (mode, opération, difficulté, table), jamais une propriété héritée :
 * les compteurs viennent du stockage, ils se lisent par leurs entrées
 * @param {unknown} record
 * @param {string|number} key
 */
function ownValue(record, key) {
  if (!record || typeof record !== 'object') return undefined;
  const name = String(key);
  return Object.entries(record).find(([field]) => field === name)?.[1];
}

/** Range une valeur sous sa clé, et la rend */
function putOwn(record, key, value) {
  Object.assign(record, { [key]: value });
  return value;
}

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
  const byOperator = ownValue(stats.modes, mode) ?? putOwn(stats.modes, mode, {});
  return ownValue(byOperator, op) ?? putOwn(byOperator, op, emptyEntry(mode));
}

/** Les conteneurs des compteurs, vides */
const emptyContainers = () => ({
  modes: {},
  imported: { questions: 0, correct: 0 },
  arcadeTop5: {},
  review: {},
});

export function emptyModeStats() {
  return {
    v: MODE_STATS_VERSION,
    ...emptyContainers(),
    // Heure de la dernière réponse du journal déjà comptée : les réponses plus récentes (écrites
    // par une version précédente, après un retour arrière) sont rattrapées à la lecture
    countedUntil: 0,
  };
}

/** Meilleur score par difficulté (Défi) : seulement les difficultés connues, nombres positifs */
function cleanBest(raw) {
  const scores = CHALLENGE_DIFFICULTIES.map(difficulty => [
    difficulty,
    count(ownValue(raw, difficulty)),
  ]);
  return Object.fromEntries(scores.filter(([, score]) => score > 0));
}

function cleanEntry(mode, raw) {
  const fields = Object.keys(emptyEntry(mode)).map(field => [
    field,
    field === 'best' && mode === 'challenge' ? cleanBest(raw?.best) : count(ownValue(raw, field)),
  ]);
  const entry = Object.fromEntries(fields);
  if ('correct' in entry) entry.correct = Math.min(entry.correct, entry.questions);
  return entry;
}

/** Les opérations connues d'un mode, nettoyées ; null s'il n'en a aucune */
function cleanOperators(mode, raw) {
  if (!isPlainObject(raw)) return null;
  const entries = Object.entries(raw)
    .filter(([operator, entry]) => OPERATOR_KEYS.has(operator) && isPlainObject(entry))
    .map(([operator, entry]) => [operator, cleanEntry(mode, entry)]);
  return entries.length > 0 ? Object.fromEntries(entries) : null;
}

function cleanModes(raw) {
  const modes = [...ANSWER_MODES, ...ARCADE_GAMES]
    .map(mode => [mode, cleanOperators(mode, ownValue(raw, mode))])
    .filter(([, byOperator]) => byOperator !== null);
  return Object.fromEntries(modes);
}

function cleanTop5(list) {
  const scores = (Array.isArray(list) ? list : []).map(Number).filter(Number.isFinite);
  scores.sort((left, right) => right - left);
  return scores.slice(0, ARCADE_TOP);
}

function cleanArcadeTop5(raw) {
  const tops = ARCADE_GAMES.map(game => [game, cleanTop5(ownValue(raw, game))]);
  return Object.fromEntries(tops.filter(([, top]) => top.length > 0));
}

function cleanReview(raw) {
  const review = [];
  for (let table = TABLE_MIN; table <= TABLE_MAX; table += 1) {
    const marks = String(ownValue(raw, table) ?? '').replaceAll(/[^01]/g, '');
    if (marks) review.push([table, marks.slice(-REVIEW_WINDOW)]);
  }
  return Object.fromEntries(review);
}

/** Compteurs écrits par une version plus récente du jeu : ni relus, ni réécrits */
const isFutureVersion = stats => isPlainObject(stats) && Number(stats.v) > MODE_STATS_VERSION;
const isCurrentVersion = stats => isPlainObject(stats) && Number(stats.v) === MODE_STATS_VERSION;

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
  if (isFutureVersion(raw)) return raw;
  try {
    if (!isCurrentVersion(raw)) return seedModeStats(profile, readLegacyArcade);
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
  return {
    v: MODE_STATS_VERSION,
    modes: cleanModes(raw.modes),
    imported: { questions: count(raw.imported?.questions), correct: count(raw.imported?.correct) },
    arcadeTop5: cleanArcadeTop5(raw.arcadeTop5),
    review: cleanReview(raw.review),
    countedUntil: count(raw.countedUntil),
  };
}

/** Opération d'une entrée de progressHistory : son champ, sinon le signe de l'énoncé, sinon × */
function operatorOfEntry(entry) {
  if (OPERATORS.has(entry?.operator)) return entry.operator;
  const match = STATEMENT.exec(String(entry?.question ?? ''));
  const sign = match?.[2];
  return SIGN_TO_OPERATOR.get(sign) ?? (OPERATORS.has(sign) ? sign : '×');
}

/** Table d'un énoncé de multiplication (premier nombre), comme getWeakTables */
function tableOfStatement(entry) {
  const match = STATEMENT.exec(String(entry?.question ?? ''));
  if (!match || !['×', 'x'].includes(match[2])) return null;
  const table = Number(match[1]);
  return table >= TABLE_MIN && table <= TABLE_MAX ? table : null;
}

function pushReview(review, table, isCorrect) {
  const marks = `${ownValue(review, table) ?? ''}${isCorrect ? '1' : '0'}`;
  putOwn(review, table, marks.slice(-REVIEW_WINDOW));
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

const hasEntries = value => isPlainObject(value) && Object.keys(value).length > 0;

/** Opérations où l'Aventure a des niveaux (l'ancien format est en multiplication) */
function adventureOperators(profile, played) {
  if (hasEntries(profile?.adventureProgress)) played.add('×');
  for (const [operator, levels] of Object.entries(profile?.adventureProgressByOperator ?? {})) {
    if (OPERATORS.has(operator) && hasEntries(levels)) played.add(operator);
  }
}

/**
 * Opération d'une clé de la Découverte : « 7 », une table de ×, « +:easy », un niveau ; une
 * ancienne clé sans opération, que la Découverte ignore, n'en a pas (null)
 */
function discoveryOperatorOf(key) {
  const [operator, level] = String(key).split(':');
  if (level !== undefined) return OPERATORS.has(operator) ? operator : null;
  return /^\d+$/.test(operator) ? '×' : null;
}

/** Opérations explorées en Découverte */
function discoveryOperators(profile, played) {
  const explored = profile?.discoveryProgress?.exploredTables;
  for (const key of Array.isArray(explored) ? explored : []) {
    const operator = discoveryOperatorOf(key);
    if (operator) played.add(operator);
  }
}

/** Une réserve de Chrono a servi : un classement ou une liste à revoir */
const chronoStoreUsed = store =>
  [store.buckets, store.basket].some(list => Array.isArray(list) && list.length > 0);

/** Opérations de Chrono hors multiplication */
function chronoOperators(profile, played) {
  for (const [operator, store] of Object.entries(profile?.chronoStatsByOperator ?? {})) {
    if (OPERATORS.has(operator) && isPlainObject(store) && chronoStoreUsed(store)) {
      played.add(operator);
    }
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
  discoveryOperators(profile, played);
  chronoOperators(profile, played);
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

/** Parties et meilleurs scores du Défi d'avant la v37 (challengeStats, sans opération) */
function legacyChallenge(profile) {
  const legacy = isPlainObject(profile?.challengeStats) ? profile.challengeStats : {};
  const byDifficulty = CHALLENGE_DIFFICULTIES.map(difficulty => [
    difficulty,
    ownValue(legacy, difficulty),
  ]);
  const games = byDifficulty.reduce((sum, [, played]) => sum + count(played?.totalPlayed), 0);
  const scores = byDifficulty.map(([difficulty, played]) => [difficulty, count(played?.bestScore)]);
  return { games, best: Object.fromEntries(scores.filter(([, score]) => score > 0)) };
}

/** Garde, pour chaque difficulté, le meilleur des deux scores */
function mergeBest(best, scores) {
  for (const [difficulty, score] of Object.entries(scores)) {
    putOwn(best, difficulty, Math.max(ownValue(best, difficulty) ?? 0, score));
  }
}

function seedChallenge(stats, profile, operator) {
  const { games, best } = legacyChallenge(profile);
  if (games === 0 && Object.keys(best).length === 0) return;
  const entry = entryOf(stats, 'challenge', operator);
  entry.games += games;
  mergeBest(entry.best, best);
}

/** Réserves de Chrono : × dans chronoStats, les autres opérations dans chronoStatsByOperator */
function chronoStores(profile) {
  const others = Object.entries(profile?.chronoStatsByOperator ?? {}).filter(
    ([operator]) => OPERATORS.has(operator) && operator !== '×'
  );
  return [['×', profile?.chronoStats], ...others];
}

/** Courses d'une réserve : la somme des parties de ses classements */
function chronoGames(store) {
  const buckets = Array.isArray(store?.buckets) ? store.buckets : [];
  return buckets.reduce((sum, bucket) => sum + count(bucket?.count), 0);
}

function seedChrono(stats, profile) {
  for (const [operator, store] of chronoStores(profile)) {
    const games = chronoGames(store);
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
    putOwn(stats.arcadeTop5, game, top);
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
  if (isFutureVersion(userData.modeStats)) return null;
  if (!isCurrentVersion(userData.modeStats)) {
    userData.modeStats = normalizeModeStats(userData);
  }
  return withContainers(userData.modeStats);
}

/** Crée les conteneurs absents (null compris) d'un `modeStats` venu d'ailleurs, et le rend */
function withContainers(stats) {
  const missing = Object.entries(emptyContainers()).filter(
    ([name]) => ownValue(stats, name) == null
  );
  return Object.assign(stats, Object.fromEntries(missing));
}

/** Table de la fenêtre « À revoir » : une multiplication, table de 1 à 10 ; sinon null */
function reviewTable(operator, table) {
  const number = Number(table);
  const inRange = Number.isInteger(number) && number >= TABLE_MIN && number <= TABLE_MAX;
  return operator === '×' && inRange ? number : null;
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
  const reviewed = reviewTable(operator, table);
  if (reviewed !== null) pushReview(stats.review, reviewed, isCorrect);
}

/**
 * Meilleur score d'un Défi terminé (pas d'un abandon), dans sa difficulté
 * @param {Object} userData
 * @param {{operator: string, difficulty: string, score: number}} result
 */
export function recordChallengeBest(userData, { operator, difficulty, score }) {
  const stats = statsOf(userData);
  if (!stats || !CHALLENGE_DIFFICULTIES.includes(difficulty)) return;
  mergeBest(entryOf(stats, 'challenge', operator).best, { [difficulty]: count(score) });
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
  const top = cleanTop5([...(ownValue(stats.arcadeTop5, game) ?? []), points]);
  putOwn(stats.arcadeTop5, game, top);
}

/** « Remettre à zéro » un jeu d'Arcade : ses meilleurs scores et ses compteurs */
export function resetArcadeGame(userData, game) {
  const stats = statsOf(userData);
  if (!stats) return;
  Reflect.deleteProperty(stats.modes, game);
  Reflect.deleteProperty(stats.arcadeTop5, game);
}

/** Les 5 meilleurs scores d'un jeu d'Arcade */
export function arcadeTopScores(userData, game) {
  return [...(ownValue(userData?.modeStats?.arcadeTop5, game) ?? [])];
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
    for (const entry of Object.values(ownValue(stats?.modes, mode) ?? {})) {
      totals.questions += count(entry.questions);
      totals.correct += count(entry.correct);
    }
  }
  return totals;
}

/** Entrées d'un mode, par opération, dans l'ordre ×, +, −, ÷, puis « ? » */
export function modeEntries(stats, mode) {
  const byOperator = new Map(Object.entries(ownValue(stats?.modes, mode) ?? {}));
  return [...OPERATORS, UNKNOWN_OPERATOR]
    .filter(operator => isPlainObject(byOperator.get(operator)))
    .map(operator => ({ operator, ...byOperator.get(operator) }));
}
