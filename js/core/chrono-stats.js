/**
 * Stats Chrono : parties, moyenne historique, panier de révision.
 * Clé de classement = tables triées + mode d’entrée (mcq | keypad).
 * Une partie compte dès que 10 réponses sont justes, même s’il y a eu des erreurs
 * (chaque erreur ajoute un calcul, le chrono ne s’arrête pas).
 */

export const CHRONO_GOAL = 10;

export function tablesKey(tables) {
  const list = Array.isArray(tables) ? tables : [];
  const unique = [...new Set(list.map(Number).filter(n => n >= 1 && n <= 10))];
  unique.sort((a, b) => a - b);
  return unique.join(',');
}

export function factKey(a, b) {
  return `${Number(a)}×${Number(b)}`;
}

const FACT_KEY_PATTERN = /^(\d+)×(\d+)$/;

export function parseFactKey(key) {
  const match = FACT_KEY_PATTERN.exec(String(key));
  if (!match) return null;
  return { a: Number(match[1]), b: Number(match[2]) };
}

export function bucketKey(tables, inputMode) {
  const mode = inputMode === 'keypad' ? 'keypad' : 'mcq';
  return `${tablesKey(tables)}|${mode}`;
}

/**
 * @param {string} key
 * @returns {{ tables: number[], inputMode: 'mcq' | 'keypad' } | null}
 */
export function parseBucketKey(key) {
  const text = String(key || '');
  const sep = text.lastIndexOf('|');
  if (sep <= 0) return null;
  const modePart = text.slice(sep + 1);
  let inputMode = null;
  if (modePart === 'keypad' || modePart === 'mcq') inputMode = modePart;
  if (!inputMode) return null;
  const tables = text
    .slice(0, sep)
    .split(',')
    .map(part => Number(part.trim()))
    .filter(n => Number.isInteger(n) && n >= 1 && n <= 10);
  if (tables.length === 0) return null;
  return { tables, inputMode };
}

export function tablesListLabel(tables) {
  return tablesKey(tables).replaceAll(',', ', ');
}

/**
 * Classements déjà joués, avec le nombre de parties, du plus fréquent au plus rare.
 * @param {{ buckets?: Record<string, { sessions?: unknown[] }> }} store
 * @returns {Array<{ key: string, tables: number[], inputMode: 'mcq' | 'keypad', games: number, averageMs: number|null }>}
 */
export function listPlayedChronoBuckets(store) {
  const buckets = store?.buckets && typeof store.buckets === 'object' ? store.buckets : {};
  const rows = [];
  for (const [key, bucket] of Object.entries(buckets)) {
    const parsed = parseBucketKey(key);
    if (!parsed) continue;
    const games = Array.isArray(bucket?.sessions) ? bucket.sessions.length : 0;
    if (games === 0) continue;
    rows.push({
      key,
      tables: parsed.tables,
      inputMode: parsed.inputMode,
      games,
      averageMs: sessionAverageMs(bucket),
    });
  }
  rows.sort((left, right) => {
    const byGames = right.games - left.games;
    if (byGames !== 0) return byGames;
    return left.key.localeCompare(right.key);
  });
  return rows;
}

export function emptyChronoStats() {
  return { buckets: {}, basket: [], lastInputMode: 'keypad' };
}

export function lastChronoInputMode(store) {
  return store?.lastInputMode === 'mcq' ? 'mcq' : 'keypad';
}

export function setLastChronoInputMode(store, mode) {
  store.lastInputMode = mode === 'mcq' ? 'mcq' : 'keypad';
  return store.lastInputMode;
}

export function normalizeChronoStats(raw) {
  const src = raw && typeof raw === 'object' ? raw : {};
  const buckets =
    src.buckets && typeof src.buckets === 'object' && !Array.isArray(src.buckets)
      ? { ...src.buckets }
      : {};
  const basket = Array.isArray(src.basket)
    ? src.basket.map(normalizeBasketItem).filter(Boolean)
    : [];
  return { buckets, basket, lastInputMode: lastChronoInputMode(src) };
}

function normalizeBasketItem(item) {
  if (!item || typeof item !== 'object') return null;
  const a = Number(item.a);
  const b = Number(item.b);
  if (!Number.isInteger(a) || !Number.isInteger(b)) return null;
  const errors = Number(item.errors);
  return { a, b, errors: Number.isFinite(errors) && errors > 0 ? Math.floor(errors) : 1 };
}

function ensureBucket(store, key) {
  const buckets = store.buckets;
  if (!Object.hasOwn(buckets, key)) {
    Object.assign(buckets, { [key]: { sessions: [], factTimes: [] } });
  }
  const entry = Object.entries(buckets).find(([name]) => name === key);
  const bucket = entry ? entry[1] : { sessions: [], factTimes: [] };
  if (!Array.isArray(bucket.sessions)) bucket.sessions = [];
  if (!Array.isArray(bucket.factTimes)) bucket.factTimes = [];
  return bucket;
}

export function getBucket(store, tables, inputMode) {
  const key = bucketKey(tables, inputMode);
  return { key, bucket: ensureBucket(store, key) };
}

/**
 * Partie normale : on continue tant qu’on n’a pas 10 justes.
 * Révision : 10 questions, erreurs comprises, pas davantage.
 * @param {{ isRevision: boolean, correctAnswers: number, questionCount: number, targetCount: number }} state
 * @returns {boolean}
 */
export function chronoShouldContinue({ isRevision, correctAnswers, questionCount }) {
  if (isRevision) return Number(questionCount) < CHRONO_GOAL;
  return Number(correctAnswers) < CHRONO_GOAL;
}

export function sessionAverageMs(bucket) {
  const sessions = Array.isArray(bucket?.sessions) ? bucket.sessions : [];
  if (sessions.length === 0) return null;
  const total = sessions.reduce((sum, session) => sum + Number(session.durationMs || 0), 0);
  return total / sessions.length;
}

export function factAverageMs(bucket) {
  const times = Array.isArray(bucket?.factTimes) ? bucket.factTimes : [];
  if (times.length === 0) return null;
  const total = times.reduce((sum, fact) => sum + Number(fact.ms || 0), 0);
  return total / times.length;
}

/** Un calcul entre au panier seulement s’il est faux. */
export function shouldAutoAddFact(fact) {
  return Boolean(fact) && fact.correct === false;
}

export function saveChronoSession(store, { tables, inputMode, durationMs, date, facts }) {
  const { bucket } = getBucket(store, tables, inputMode);
  const historicalMean = factAverageMs(bucket);
  const stamp = Number(date) || Date.now();
  const list = (Array.isArray(facts) ? facts : []).filter(isAnsweredFact);
  const toAdd = list.filter(fact => shouldAutoAddFact(fact));

  bucket.sessions.push({ durationMs: Number(durationMs) || 0, date: stamp });
  for (const fact of list) {
    bucket.factTimes.push({
      a: Number(fact.a),
      b: Number(fact.b),
      ms: Number(fact.ms) || 0,
      correct: fact.correct === true,
      date: stamp,
    });
  }

  for (const fact of toAdd) addToBasket(store, fact);
  return { historicalMean, added: toAdd };
}

function isAnsweredFact(fact) {
  if (!fact || typeof fact !== 'object') return false;
  if (fact.answered === false) return false;
  if (typeof fact.correct !== 'boolean') return false;
  return Number.isInteger(Number(fact.a)) && Number.isInteger(Number(fact.b));
}

export function addToBasket(store, fact) {
  const a = Number(fact.a);
  const b = Number(fact.b);
  const extraErrors = fact.correct === false ? 1 : 0;
  const existing = store.basket.find(entry => entry.a === a && entry.b === b);
  if (existing) {
    existing.errors = (Number(existing.errors) || 0) + extraErrors;
    return store.basket;
  }
  store.basket.push({ a, b, errors: extraErrors > 0 ? extraErrors : 1 });
  return store.basket;
}

/**
 * Ajout manuel d’un calcul 1–10 × 1–10. Doublon : inchangé.
 * @param {{basket: Array}} store
 * @param {unknown} a
 * @param {unknown} b
 * @returns {boolean}
 */
export function addManualBasketFact(store, a, b) {
  const left = Number(a);
  const right = Number(b);
  if (!Number.isInteger(left) || !Number.isInteger(right)) return false;
  if (left < 1 || left > 10 || right < 1 || right > 10) return false;
  addToBasket(store, { a: left, b: right, correct: true });
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

/** Classe du badge ×n : jaune 1, orange 2, rouge 3+. */
export function basketErrorClass(errors) {
  const count = Number(errors) || 0;
  if (count >= 3) return 'is-err-3';
  if (count === 2) return 'is-err-2';
  if (count === 1) return 'is-err-1';
  return '';
}

/** +1 pièce par bonne réponse (comme l’Aventure). */
export function grantChronoCoins(userData) {
  if (!userData || typeof userData !== 'object') return 0;
  const next = (Number(userData.coins) || 0) + 1;
  userData.coins = next;
  return next;
}

export function rankedSessions(bucket) {
  const sessions = Array.isArray(bucket?.sessions) ? [...bucket.sessions] : [];
  sessions.sort((left, right) => {
    const byTime = Number(left.durationMs) - Number(right.durationMs);
    if (byTime !== 0) return byTime;
    return Number(left.date) - Number(right.date);
  });
  return sessions;
}

export function recentSessions(bucket, limit = 20) {
  const sessions = Array.isArray(bucket?.sessions) ? [...bucket.sessions] : [];
  sessions.sort((left, right) => Number(left.date) - Number(right.date));
  if (sessions.length <= limit) return sessions;
  return sessions.slice(sessions.length - limit);
}

export function formatDuration(ms) {
  const total = Math.max(0, Number(ms) || 0);
  const seconds = total / 1000;
  if (seconds < 60) return `${seconds.toFixed(1)} s`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds - minutes * 60;
  return `${minutes}:${rest.toFixed(1).padStart(4, '0')}`;
}

/** Plafond « rond » pour l’axe vertical du graphique (ms). */
export function niceDurationMaxMs(ms) {
  const seconds = Math.max(Number(ms) / 1000, 1);
  const magnitude = 10 ** Math.floor(Math.log10(seconds));
  const unit = [1, 2, 5, 10].map(n => n * magnitude).find(n => n >= seconds) || magnitude * 10;
  return unit * 1000;
}

export function formatAxisSeconds(ms) {
  const seconds = Math.max(0, Number(ms) || 0) / 1000;
  if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60);
    const rest = Math.round(seconds - minutes * 60);
    return `${minutes}:${String(rest).padStart(2, '0')}`;
  }
  return `${Math.round(seconds)} s`;
}
