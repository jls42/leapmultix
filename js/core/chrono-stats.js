/**
 * Stats Chrono : classements, et la liste « Mes calculs à revoir » (`basket` dans le profil).
 * Un classement = les tables jouées + la façon de répondre (mcq | keypad). Il garde le
 * nombre de parties et leur temps total (moyenne exacte), les 10 meilleurs temps et les
 * 20 derniers (courbe) : la place prise dans le profil reste bornée, quel que soit le
 * nombre de parties.
 * Une partie compte dès que 10 réponses sont justes, même s’il y a eu des erreurs
 * (chaque erreur ajoute un calcul, le chrono ne s’arrête pas).
 *
 * Une réserve par opération : la multiplication reste dans `chronoStats`, au format publié
 * (clés « tables|saisie », aucune migration) ; l’addition, la soustraction et la division
 * vont dans `chronoStatsByOperator`, un champ à part que le code d’avant recopie sans y
 * toucher (retour arrière sûr). Les fonctions prennent l’opération en dernier paramètre,
 * multiplication par défaut.
 */

import { otherFactDirection } from './chrono-questions.js';

export const CHRONO_GOAL = 10;
const BEST_LIMIT = 10;
const RECENT_LIMIT = 20;
const MIN_FACTOR = 1;
const MAX_FACTOR = 10;
const DEFAULT_LANG = 'fr';
const NBSP = ' ';

/** Opérations rangées à part, dans `chronoStatsByOperator` */
export const CHRONO_EXTRA_OPERATORS = Object.freeze(['+', '−', '÷']);
const MIN_DIVISOR = 2;

/**
 * Nombre de 1 à 10 : facteur d’une multiplication, terme d’une addition, table et réponse
 * d’une soustraction ou d’une division. La voix enregistrée n’a de clip que pour ces
 * questions (tests-esm/voice/modes-in-corpus).
 */
function isFactor(n) {
  return Number.isInteger(n) && n >= MIN_FACTOR && n <= MAX_FACTOR;
}

/** Table d’une opération : 1 à 10, sauf la division (2 à 10, pas de ÷ 1) */
function isTable(n, operator) {
  return isFactor(n) && (operator !== '÷' || n >= MIN_DIVISOR);
}

/**
 * Un calcul que Chrono pose dans cette opération : 1–10 × 1–10, 1–10 + 1–10,
 * (n + k) − n et (n × k) ÷ n avec n et k de 1 à 10 (diviseur de 2 à 10).
 * @param {string} operator
 * @param {number} a
 * @param {number} b
 * @returns {boolean}
 */
export function isChronoFact(operator, a, b) {
  if (!Number.isInteger(a) || !Number.isInteger(b)) return false;
  if (operator === '−') return isFactor(b) && isFactor(a - b);
  if (operator === '÷') return isTable(b, '÷') && a % b === 0 && isFactor(a / b);
  return isFactor(a) && isFactor(b);
}

function factKey(a, b, operator = '×') {
  return `${Number(a)}${operator}${Number(b)}`;
}

/**
 * Clé de la famille d’un calcul : 6 × 7 et 7 × 6 ont la même, 15 − 7 et 15 − 8 aussi,
 * comme 56 ÷ 7 et 56 ÷ 8. Une erreur compte ainsi sur la ligne de l’autre sens quand le sien
 * n’a pas de ligne.
 */
function sameFactKey(a, b, operator = '×') {
  const x = Number(a);
  const y = Number(b);
  const other = otherFactDirection(operator, x, y);
  if (!other) return factKey(x, y, operator);
  if (operator === '×' || operator === '+') {
    return factKey(Math.min(x, y), Math.max(x, y), operator);
  }
  // Soustraction et division : le premier nombre est commun, le second change de sens
  return factKey(x, Math.min(y, other.b), operator);
}

/** Tables valides, sans doublon, dans l'ordre */
export function uniqueTables(tables, operator = '×') {
  const list = Array.isArray(tables) ? tables : [];
  const unique = [...new Set(list.map(Number).filter(n => isTable(n, operator)))];
  return unique.sort((a, b) => a - b);
}

export function tablesKey(tables, operator = '×') {
  return uniqueTables(tables, operator).join(',');
}

export function bucketKey(tables, inputMode, operator = '×') {
  const mode = inputMode === 'keypad' ? 'keypad' : 'mcq';
  return `${tablesKey(tables, operator)}|${mode}`;
}

/**
 * @param {string} key
 * @param {string} [operator]
 * @returns {{ tables: number[], inputMode: 'mcq' | 'keypad' } | null}
 */
export function parseBucketKey(key, operator = '×') {
  const text = String(key || '');
  const sep = text.lastIndexOf('|');
  if (sep <= 0) return null;
  const modePart = text.slice(sep + 1);
  if (modePart !== 'keypad' && modePart !== 'mcq') return null;
  const tables = text
    .slice(0, sep)
    .split(',')
    .map(part => Number(part.trim()))
    .filter(n => isTable(n, operator));
  if (tables.length === 0) return null;
  return { tables, inputMode: modePart };
}

export function tablesListLabel(tables, operator = '×') {
  return tablesKey(tables, operator).replaceAll(',', ', ');
}

function byTimeThenDate(left, right) {
  return left.durationMs - right.durationMs || left.date - right.date;
}

function byDate(left, right) {
  return left.date - right.date;
}

function normalizeSession(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const durationMs = Number(raw.durationMs);
  const date = Number(raw.date);
  if (!Number.isFinite(durationMs) || durationMs < 0 || !Number.isFinite(date)) return null;
  return { durationMs, date };
}

function sessionList(raw) {
  return Array.isArray(raw) ? raw.map(normalizeSession).filter(Boolean) : [];
}

function nonNegative(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function normalizeBucket(raw, operator) {
  const parsed = parseBucketKey(raw?.key, operator);
  if (!parsed) return null;
  const best = sessionList(raw.best).sort(byTimeThenDate).slice(0, BEST_LIMIT);
  const recent = sessionList(raw.recent).sort(byDate).slice(-RECENT_LIMIT);
  const count = Math.max(Math.floor(nonNegative(raw.count)), best.length, recent.length);
  return {
    key: bucketKey(parsed.tables, parsed.inputMode, operator),
    count,
    totalMs: nonNegative(raw.totalMs),
    best,
    recent,
  };
}

function normalizeBuckets(raw, operator) {
  const buckets = [];
  const seen = new Set();
  for (const item of Array.isArray(raw) ? raw : []) {
    const bucket = normalizeBucket(item, operator);
    if (!bucket || seen.has(bucket.key)) continue;
    seen.add(bucket.key);
    buckets.push(bucket);
  }
  return buckets;
}

/**
 * Compteur « à revoir » : un entier positif, 1 par défaut. `errors` est son nom dans la
 * première version de la PR, jamais publiée : les profils de ceux qui l’ont essayée gardent
 * ainsi leur compteur, sans migration à écrire.
 */
function normalizeDue(item) {
  const due = Math.floor(Number(item.due ?? item.errors));
  return Number.isFinite(due) && due > 0 ? due : 1;
}

function normalizeBasketItem(item, operator) {
  if (!item || typeof item !== 'object') return null;
  const a = Number(item.a);
  const b = Number(item.b);
  if (!isChronoFact(operator, a, b)) return null;
  return { a, b, due: normalizeDue(item) };
}

/** Une ligne par sens au plus : un ajout à la main peut garder 6 × 7 et 7 × 6 */
function normalizeBasket(raw, operator) {
  const basket = [];
  const seen = new Set();
  for (const item of Array.isArray(raw) ? raw : []) {
    const entry = normalizeBasketItem(item, operator);
    if (!entry || seen.has(factKey(entry.a, entry.b, operator))) continue;
    seen.add(factKey(entry.a, entry.b, operator));
    basket.push(entry);
  }
  return basket;
}

export function emptyChronoStats() {
  return { buckets: [], basket: [], lastInputMode: 'keypad' };
}

export function lastChronoInputMode(store) {
  return store?.lastInputMode === 'mcq' ? 'mcq' : 'keypad';
}

export function setLastChronoInputMode(store, mode) {
  store.lastInputMode = mode === 'mcq' ? 'mcq' : 'keypad';
  return store.lastInputMode;
}

/**
 * Ne garde que les champs connus, plafonnés et triés. Idempotente : elle tourne à
 * chaque lecture du profil.
 */
export function normalizeChronoStats(raw) {
  const src = raw && typeof raw === 'object' ? raw : {};
  return {
    buckets: normalizeBuckets(src.buckets, '×'),
    basket: normalizeBasket(src.basket, '×'),
    lastInputMode: lastChronoInputMode(src),
  };
}

/**
 * Réserve d’une opération hors multiplication : classements et liste à revoir. La façon de
 * répondre retenue reste commune, dans `chronoStats`.
 * @param {unknown} raw
 * @param {string} operator - '+', '−' ou '÷'
 * @returns {{buckets: Array, basket: Array}}
 */
export function normalizeChronoOperatorStats(raw, operator) {
  const src = raw && typeof raw === 'object' ? raw : {};
  return {
    buckets: normalizeBuckets(src.buckets, operator),
    basket: normalizeBasket(src.basket, operator),
  };
}

/**
 * `chronoStatsByOperator` du profil : une réserve par opération hors multiplication. Comme
 * normalizeChronoStats, idempotente : elle tourne à chaque lecture du profil.
 * @param {unknown} raw
 * @returns {Record<string, {buckets: Array, basket: Array}>}
 */
export function normalizeChronoStatsByOperator(raw) {
  const src = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  return Object.fromEntries(
    CHRONO_EXTRA_OPERATORS.map(op => [op, normalizeChronoOperatorStats(src[op], op)])
  );
}

/** Classement déjà joué, ou null : la lecture ne crée rien */
export function findBucket(store, tables, inputMode, operator = '×') {
  const key = bucketKey(tables, inputMode, operator);
  return (store?.buckets || []).find(bucket => bucket.key === key) ?? null;
}

function ensureBucket(store, tables, inputMode, operator) {
  const existing = findBucket(store, tables, inputMode, operator);
  if (existing) return existing;
  const key = bucketKey(tables, inputMode, operator);
  const bucket = { key, count: 0, totalMs: 0, best: [], recent: [] };
  store.buckets.push(bucket);
  return bucket;
}

export function sessionAverageMs(bucket) {
  return bucket?.count > 0 ? bucket.totalMs / bucket.count : null;
}

/**
 * Classements déjà joués, avec le nombre de parties, du plus fréquent au plus rare.
 * @returns {Array<{ key: string, tables: number[], inputMode: 'mcq' | 'keypad', games: number, averageMs: number|null }>}
 */
export function listPlayedChronoBuckets(store, operator = '×') {
  const rows = [];
  for (const bucket of store?.buckets || []) {
    const parsed = parseBucketKey(bucket.key, operator);
    if (!parsed || bucket.count <= 0) continue;
    rows.push({
      key: bucket.key,
      tables: parsed.tables,
      inputMode: parsed.inputMode,
      games: bucket.count,
      averageMs: sessionAverageMs(bucket),
    });
  }
  rows.sort((left, right) => right.games - left.games || left.key.localeCompare(right.key));
  return rows;
}

/**
 * Partie normale : on continue tant qu’on n’a pas 10 justes.
 * Révision : 10 questions, erreurs comprises, pas davantage.
 * @param {{ isRevision: boolean, correctAnswers: number, questionCount: number }} state
 * @returns {boolean}
 */
export function chronoShouldContinue({ isRevision, correctAnswers, questionCount }) {
  if (isRevision) return Number(questionCount) < CHRONO_GOAL;
  return Number(correctAnswers) < CHRONO_GOAL;
}

function isMissedFact(fact, operator) {
  return (
    Boolean(fact) &&
    fact.correct === false &&
    isChronoFact(operator, Number(fact.a), Number(fact.b))
  );
}

/**
 * Enregistre une partie terminée : moyenne, meilleurs temps, courbe, calculs ratés dans la
 * liste à revoir. Le record se juge contre le meilleur temps d’avant l’ajout (la partie
 * n’est pas comparée à elle-même) ; le rang est sa place parmi les 10 meilleurs temps,
 * une fois ajoutée (null au-delà).
 * @returns {{ first: boolean, record: boolean, rank: number|null, count: number, averageMs: number, added: Array }}
 */
export function saveChronoSession(
  store,
  { tables, inputMode, durationMs, date, facts, operator = '×' }
) {
  const bucket = ensureBucket(store, tables, inputMode, operator);
  const session = {
    durationMs: Math.max(0, Number(durationMs) || 0),
    date: Number(date) || Date.now(),
  };
  const first = bucket.count === 0;
  const previousBest = bucket.best[0]?.durationMs;
  bucket.count += 1;
  bucket.totalMs += session.durationMs;
  bucket.best = [...bucket.best, session].sort(byTimeThenDate).slice(0, BEST_LIMIT);
  bucket.recent = [...bucket.recent, session].sort(byDate).slice(-RECENT_LIMIT);
  const index = bucket.best.indexOf(session);
  const added = (Array.isArray(facts) ? facts : []).filter(fact => isMissedFact(fact, operator));
  added.forEach(fact => addToBasket(store, fact, operator));
  return {
    first,
    record: !first && session.durationMs < previousBest,
    rank: index >= 0 ? index + 1 : null,
    count: bucket.count,
    averageMs: sessionAverageMs(bucket),
    added,
  };
}

/** Un calcul raté entre dans la liste à revoir, ou y est à revoir une fois de plus */
export function addToBasket(store, fact, operator = '×') {
  const a = Number(fact?.a);
  const b = Number(fact?.b);
  if (!isChronoFact(operator, a, b)) return store.basket;
  // La ligne de ce sens, sinon celle de l’autre sens : 6 × 7 et 7 × 6 sont le même calcul,
  // comme 15 − 7 et 15 − 8
  const key = sameFactKey(a, b, operator);
  const existing =
    store.basket.find(entry => entry.a === a && entry.b === b) ??
    store.basket.find(entry => sameFactKey(entry.a, entry.b, operator) === key);
  if (existing) existing.due += 1;
  else store.basket.push({ a, b, due: 1 });
  return store.basket;
}

/**
 * Ajout à la main d’un calcul 1–10 × 1–10 : à revoir une fois de plus à chaque ajout,
 * comme une erreur (6 × 6 ajouté trois fois : « 3 fois »). L’autre sens a sa propre
 * ligne : une ligne pose déjà les deux sens en révision, la seconde les fait revenir
 * plus souvent.
 * @returns {boolean} Le calcul est valide
 */
export function addManualBasketFact(store, a, b, operator = '×') {
  const left = Number(a);
  const right = Number(b);
  if (!isChronoFact(operator, left, right)) return false;
  const existing = store.basket.find(entry => entry.a === left && entry.b === right);
  if (existing) existing.due += 1;
  else store.basket.push({ a: left, b: right, due: 1 });
  return true;
}

export function removeFromBasket(store, { a, b }) {
  store.basket = store.basket.filter(entry => !(entry.a === Number(a) && entry.b === Number(b)));
  return store.basket;
}

export function emptyBasket(store) {
  store.basket = [];
  return store.basket;
}

/**
 * Compteurs d’une révision, en mémoire : la liste enregistrée ne change qu’à la fin
 * d’une révision terminée (un abandon n’enregistre rien).
 * @param {Array<{a: number, b: number, due: number}>} basket
 * @returns {Map<string, number>}
 */
export function startRevisionTally(basket, operator = '×') {
  return new Map((basket || []).map(entry => [factKey(entry.a, entry.b, operator), entry.due]));
}

/**
 * Révision : une réussite enlève 1 (jamais sous 0), une erreur ajoute 1. La question peut
 * être l’inverse d’une ligne de la liste (7 × 6 pour 6 × 7). Une erreur compte pour la
 * ligne de son sens, sinon pour celle de l’inverse. Une réussite aussi, tant que cette
 * ligne est à revoir ; à 0, elle compte pour l’autre sens, qui peut l’être encore.
 */
export function tallyRevisionAnswer(tally, fact, isCorrect, operator = '×') {
  const other = otherFactDirection(operator, Number(fact?.a), Number(fact?.b));
  // Multiplication : l’inverse, même pour 7 × 7 (deux fois la même clé, comme avant)
  const otherKey =
    operator === '×' ? factKey(fact?.b, fact?.a) : other && factKey(other.a, other.b, operator);
  const lines = [factKey(fact?.a, fact?.b, operator), otherKey].filter(k => k && tally.has(k));
  if (lines.length === 0) return;
  if (!isCorrect) {
    tally.set(lines[0], tally.get(lines[0]) + 1);
    return;
  }
  const key = lines.find(k => tally.get(k) > 0);
  if (key) tally.set(key, tally.get(key) - 1);
}

/**
 * Fin d’une révision terminée : les calculs à 0 sortent de la liste, les autres gardent
 * leur nouveau compteur.
 * @returns {{ mastered: Array<{a: number, b: number}>, remaining: number }}
 */
export function applyRevisionTally(store, tally, operator = '×') {
  const mastered = [];
  const kept = [];
  for (const entry of store.basket) {
    const key = factKey(entry.a, entry.b, operator);
    const due = tally.has(key) ? tally.get(key) : entry.due;
    if (due <= 0) mastered.push({ a: entry.a, b: entry.b });
    else kept.push({ ...entry, due });
  }
  store.basket = kept;
  return { mastered, remaining: kept.length };
}

/** Pièces : une par bonne réponse en partie, une par calcul sorti de la liste en révision */
export function grantChronoCoins(userData, count = 1) {
  if (!userData || typeof userData !== 'object') return 0;
  const gained = Math.max(0, Math.floor(Number(count) || 0));
  userData.coins = (Number(userData.coins) || 0) + gained;
  return userData.coins;
}

/** Les 10 meilleurs temps, du plus rapide au plus lent */
export function rankedSessions(bucket) {
  return Array.isArray(bucket?.best) ? [...bucket.best] : [];
}

/** Les 20 dernières parties, de la plus ancienne à la plus récente */
export function recentSessions(bucket) {
  return Array.isArray(bucket?.recent) ? [...bucket.recent] : [];
}

function numberFormat(lang, options) {
  try {
    return new Intl.NumberFormat(lang || DEFAULT_LANG, options);
  } catch {
    // Code de langue refusé par Intl (les options sont fixes) : format français plutôt
    // qu'une exception au milieu de l'écran de fin
    return new Intl.NumberFormat(DEFAULT_LANG, options);
  }
}

/**
 * Durée dans la langue du jeu : « 7,5 s », « 1 min 05,6 s ». Les dixièmes s’arrondissent
 * une seule fois : 59,96 s s’écrit « 1 min 00,0 s », jamais « 60,0 s ».
 * @param {number} ms
 * @param {string} [lang]
 * @returns {string}
 */
export function formatDuration(ms, lang = DEFAULT_LANG) {
  const tenths = Math.round(Math.max(0, Number(ms) || 0) / 100);
  const minutes = Math.floor(tenths / 600);
  const seconds = (tenths - minutes * 600) / 10;
  const decimals = { minimumFractionDigits: 1, maximumFractionDigits: 1 };
  if (minutes === 0) return `${numberFormat(lang, decimals).format(seconds)}${NBSP}s`;
  const padded = numberFormat(lang, { ...decimals, minimumIntegerDigits: 2 }).format(seconds);
  return `${minutes}${NBSP}min${NBSP}${padded}${NBSP}s`;
}

// Pas de graduation ronds (s) ; au-delà de 150 s, des minutes entières
const AXIS_STEPS_S = [5, 10, 15, 20, 25, 30, 45, 60, 90, 120, 150];
/** Nombre de pas de l’axe vertical : le graphique trace autant de graduations, plus le zéro */
export const CHRONO_AXIS_TICKS = 4;

/**
 * Plafond de l’axe vertical du graphique (ms) : quatre pas ronds, en secondes entières.
 * Le plus petit qui contient la partie la plus lente : 52 s donne 1 min (pas de 15 s), et la
 * courbe occupe le graphique au lieu d’en tasser le bas.
 */
export function niceDurationMaxMs(ms) {
  const minStep = Math.max(Number(ms) || 0, 1000) / 1000 / CHRONO_AXIS_TICKS;
  const step = AXIS_STEPS_S.find(seconds => seconds >= minStep) ?? Math.ceil(minStep / 60) * 60;
  return step * CHRONO_AXIS_TICKS * 1000;
}

/** Graduation de l’axe, en secondes entières : « 25 s », « 1 min 40 » */
export function formatAxisSeconds(ms) {
  const total = Math.round(Math.max(0, Number(ms) || 0) / 1000);
  if (total < 60) return `${total}${NBSP}s`;
  const minutes = Math.floor(total / 60);
  const rest = total - minutes * 60;
  // « 10 min » plutôt que « 10 min 00 » : la graduation tient dans la marge du graphique
  if (rest === 0) return `${minutes}${NBSP}min`;
  return `${minutes}${NBSP}min${NBSP}${String(rest).padStart(2, '0')}`;
}

/** Date d’une partie dans la langue du jeu (« 05/10/2026 22:04 » en français) */
export function formatSessionDate(date, lang = DEFAULT_LANG) {
  const value = new Date(Number(date) || 0);
  const options = { dateStyle: 'short', timeStyle: 'short' };
  try {
    return value.toLocaleString(lang || DEFAULT_LANG, options);
  } catch {
    // Même repli que numberFormat : langue inconnue d'Intl, date en français
    return value.toLocaleString(DEFAULT_LANG, options);
  }
}
