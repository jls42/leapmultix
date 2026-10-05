/**
 * Stats Chrono : classements, panier des calculs à revoir.
 * Un classement = les tables jouées + la façon de répondre (mcq | keypad). Il garde le
 * nombre de parties et leur temps total (moyenne exacte), les 10 meilleurs temps et les
 * 20 derniers (courbe) : le profil ne grossit plus à chaque partie.
 * Une partie compte dès que 10 réponses sont justes, même s’il y a eu des erreurs
 * (chaque erreur ajoute un calcul, le chrono ne s’arrête pas).
 */

export const CHRONO_GOAL = 10;
const BEST_LIMIT = 10;
const RECENT_LIMIT = 20;
const MIN_FACTOR = 1;
const MAX_FACTOR = 10;
const DEFAULT_LANG = 'fr';
const NBSP = ' ';

/** Facteur d’un calcul de Chrono : les questions dites ne sortent jamais de 1–10 × 1–10 */
function isFactor(n) {
  return Number.isInteger(n) && n >= MIN_FACTOR && n <= MAX_FACTOR;
}

function factKey(a, b) {
  return `${Number(a)}×${Number(b)}`;
}

export function tablesKey(tables) {
  const list = Array.isArray(tables) ? tables : [];
  const unique = [...new Set(list.map(Number).filter(isFactor))];
  unique.sort((a, b) => a - b);
  return unique.join(',');
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
  if (modePart !== 'keypad' && modePart !== 'mcq') return null;
  const tables = text
    .slice(0, sep)
    .split(',')
    .map(part => Number(part.trim()))
    .filter(isFactor);
  if (tables.length === 0) return null;
  return { tables, inputMode: modePart };
}

export function tablesListLabel(tables) {
  return tablesKey(tables).replaceAll(',', ', ');
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

function normalizeBucket(raw) {
  const parsed = parseBucketKey(raw?.key);
  if (!parsed) return null;
  const best = sessionList(raw.best).sort(byTimeThenDate).slice(0, BEST_LIMIT);
  const recent = sessionList(raw.recent).sort(byDate).slice(-RECENT_LIMIT);
  const count = Math.max(Math.floor(nonNegative(raw.count)), best.length, recent.length);
  return {
    key: bucketKey(parsed.tables, parsed.inputMode),
    count,
    totalMs: nonNegative(raw.totalMs),
    best,
    recent,
  };
}

function normalizeBuckets(raw) {
  const buckets = [];
  const seen = new Set();
  for (const item of Array.isArray(raw) ? raw : []) {
    const bucket = normalizeBucket(item);
    if (!bucket || seen.has(bucket.key)) continue;
    seen.add(bucket.key);
    buckets.push(bucket);
  }
  return buckets;
}

function normalizeBasketItem(item) {
  if (!item || typeof item !== 'object') return null;
  const a = Number(item.a);
  const b = Number(item.b);
  if (!isFactor(a) || !isFactor(b)) return null;
  const due = Math.floor(Number(item.due ?? item.errors));
  return { a, b, due: Number.isFinite(due) && due > 0 ? due : 1 };
}

function normalizeBasket(raw) {
  const basket = [];
  const seen = new Set();
  for (const item of Array.isArray(raw) ? raw : []) {
    const entry = normalizeBasketItem(item);
    if (!entry || seen.has(factKey(entry.a, entry.b))) continue;
    seen.add(factKey(entry.a, entry.b));
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
    buckets: normalizeBuckets(src.buckets),
    basket: normalizeBasket(src.basket),
    lastInputMode: lastChronoInputMode(src),
  };
}

/** Classement déjà joué, ou null : la lecture ne crée rien */
export function findBucket(store, tables, inputMode) {
  const key = bucketKey(tables, inputMode);
  return (store?.buckets || []).find(bucket => bucket.key === key) ?? null;
}

function ensureBucket(store, tables, inputMode) {
  const existing = findBucket(store, tables, inputMode);
  if (existing) return existing;
  const bucket = { key: bucketKey(tables, inputMode), count: 0, totalMs: 0, best: [], recent: [] };
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
export function listPlayedChronoBuckets(store) {
  const rows = [];
  for (const bucket of store?.buckets || []) {
    const parsed = parseBucketKey(bucket.key);
    if (!parsed || !(bucket.count > 0)) continue;
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

function isMissedFact(fact) {
  return (
    Boolean(fact) && fact.correct === false && isFactor(Number(fact.a)) && isFactor(Number(fact.b))
  );
}

/**
 * Enregistre une partie terminée : moyenne, meilleurs temps, courbe, calculs ratés au
 * panier. Record et rang se calculent avant l’ajout : la partie n’est pas comparée à
 * elle-même.
 * @returns {{ first: boolean, record: boolean, rank: number|null, count: number, averageMs: number, added: Array }}
 */
export function saveChronoSession(store, { tables, inputMode, durationMs, date, facts }) {
  const bucket = ensureBucket(store, tables, inputMode);
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
  const added = (Array.isArray(facts) ? facts : []).filter(isMissedFact);
  added.forEach(fact => addToBasket(store, fact));
  return {
    first,
    record: !first && session.durationMs < previousBest,
    rank: index >= 0 ? index + 1 : null,
    count: bucket.count,
    averageMs: sessionAverageMs(bucket),
    added,
  };
}

/** Un calcul raté entre au panier, ou y est à revoir une fois de plus */
export function addToBasket(store, fact) {
  const a = Number(fact?.a);
  const b = Number(fact?.b);
  if (!isFactor(a) || !isFactor(b)) return store.basket;
  const existing = store.basket.find(entry => entry.a === a && entry.b === b);
  if (existing) existing.due += 1;
  else store.basket.push({ a, b, due: 1 });
  return store.basket;
}

/**
 * Ajout à la main d’un calcul 1–10 × 1–10, à revoir une fois. Doublon : inchangé.
 * @returns {boolean} Le calcul est valide (ajouté ou déjà présent)
 */
export function addManualBasketFact(store, a, b) {
  const left = Number(a);
  const right = Number(b);
  if (!isFactor(left) || !isFactor(right)) return false;
  if (!store.basket.some(entry => entry.a === left && entry.b === right)) {
    store.basket.push({ a: left, b: right, due: 1 });
  }
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

/** Classe du badge d’un calcul de la liste : jaune 1, orange 2, rouge 3 et plus */
export function basketDueClass(due) {
  const count = Number(due) || 0;
  if (count >= 3) return 'is-err-3';
  if (count === 2) return 'is-err-2';
  if (count === 1) return 'is-err-1';
  return '';
}

/**
 * Compteurs d’une révision, en mémoire : le panier enregistré ne change qu’à la fin
 * d’une révision terminée (un abandon n’enregistre rien).
 * @param {Array<{a: number, b: number, due: number}>} basket
 * @returns {Map<string, number>}
 */
export function startRevisionTally(basket) {
  return new Map((basket || []).map(entry => [factKey(entry.a, entry.b), entry.due]));
}

/**
 * Révision : une réussite enlève 1 (jamais sous 0), une erreur ajoute 1. La question peut
 * être l’inverse du calcul de la liste (7 × 6 pour 6 × 7) : elle compte pour lui.
 */
export function tallyRevisionAnswer(tally, fact, isCorrect) {
  const key = [factKey(fact?.a, fact?.b), factKey(fact?.b, fact?.a)].find(k => tally.has(k));
  if (!key) return;
  const due = tally.get(key);
  tally.set(key, isCorrect ? Math.max(0, due - 1) : due + 1);
}

/**
 * Fin d’une révision terminée : les calculs à 0 sortent du panier, les autres gardent
 * leur nouveau compteur.
 * @returns {{ mastered: Array<{a: number, b: number}>, remaining: number }}
 */
export function applyRevisionTally(store, tally) {
  const mastered = [];
  const kept = [];
  for (const entry of store.basket) {
    const key = factKey(entry.a, entry.b);
    const due = tally.has(key) ? tally.get(key) : entry.due;
    if (due <= 0) mastered.push({ a: entry.a, b: entry.b });
    else kept.push({ ...entry, due });
  }
  store.basket = kept;
  return { mastered, remaining: kept.length };
}

/** Pièces : une par bonne réponse en partie, une par calcul sorti du panier en révision */
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

/** Plafond « rond » pour l’axe vertical du graphique (ms). */
export function niceDurationMaxMs(ms) {
  const seconds = Math.max(Number(ms) / 1000, 1);
  const magnitude = 10 ** Math.floor(Math.log10(seconds));
  const unit = [1, 2, 5, 10].map(n => n * magnitude).find(n => n >= seconds) || magnitude * 10;
  return unit * 1000;
}

/** Graduation de l’axe, en secondes entières : « 25 s », « 1 min 40 » */
export function formatAxisSeconds(ms) {
  const total = Math.round(Math.max(0, Number(ms) || 0) / 1000);
  if (total < 60) return `${total}${NBSP}s`;
  const minutes = Math.floor(total / 60);
  const rest = total - minutes * 60;
  return `${minutes}${NBSP}min${NBSP}${String(rest).padStart(2, '0')}`;
}

/** Date d’une partie dans la langue du jeu (« 05/10/2026 22:04 » en français) */
export function formatSessionDate(date, lang = DEFAULT_LANG) {
  const value = new Date(Number(date) || 0);
  const options = { dateStyle: 'short', timeStyle: 'short' };
  try {
    return value.toLocaleString(lang || DEFAULT_LANG, options);
  } catch {
    return value.toLocaleString(DEFAULT_LANG, options);
  }
}
