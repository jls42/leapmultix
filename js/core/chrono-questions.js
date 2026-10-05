/**
 * Tirage Chrono : on favorise les faits difficiles (6, 7, 8, 9).
 * Tables 1 et 10 : rares si toutes les tables sont cochées, normales si l’enfant les a choisies exprès.
 */

import { randomFloat, shuffleInPlace } from './random.js';

const FACTOR_HARDNESS = new Map([
  [1, 1],
  [2, 3],
  [3, 8],
  [4, 9],
  [5, 4],
  [6, 16],
  [7, 18],
  [8, 16],
  [9, 12],
  [10, 1],
]);

const ALL_TABLES_COUNT = 10;
const EASY_TABLE_PENALTY = 0.06;
const EASY_FACTOR_PENALTY = 0.2;

export function isFullTableSet(tables) {
  const unique = uniqueTables(tables);
  return unique.length === ALL_TABLES_COUNT;
}

/**
 * Tables jouées en Chrono : les 1–10 moins les exclusions globales (Paramètres des tables).
 * @param {number[]} [exclusions]
 * @param {boolean} [globalEnabled]
 * @returns {number[]}
 */
export function includedTablesFromExclusions(exclusions, globalEnabled) {
  const skipped = globalEnabled ? new Set((exclusions || []).map(Number)) : new Set();
  const tables = [];
  for (let table = 1; table <= ALL_TABLES_COUNT; table += 1) {
    if (!skipped.has(table)) tables.push(table);
  }
  return tables.length > 0 ? tables : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
}

function uniqueTables(tables) {
  return [...new Set((tables || []).map(Number).filter(n => n >= 1 && n <= 10))];
}

function hardness(n) {
  return FACTOR_HARDNESS.get(Number(n)) ?? 1;
}

/**
 * Poids d’un calcul table × num.
 * @param {number} table
 * @param {number} num
 * @param {boolean} allTables
 * @returns {number}
 */
export function chronoPairWeight(table, num, allTables) {
  let weight = hardness(table) * hardness(num);
  if (allTables) {
    if (table === 1 || table === 10) weight *= EASY_TABLE_PENALTY;
    if (num === 1 || num === 10) weight *= EASY_FACTOR_PENALTY;
  }
  return Math.max(weight, 0.01);
}

function pairKey(t, n) {
  return `${t}×${n}`;
}

/**
 * Les deux sens d’un calcul (`8×6` et `6×8`) : c’est le même calcul, qu’une course ne pose
 * pas deux fois.
 * @param {number} a
 * @param {number} b
 * @returns {string[]}
 */
export function factKeys(a, b) {
  return [pairKey(Number(a), Number(b)), pairKey(Number(b), Number(a))];
}

function pickWeightedPair(pairs) {
  const total = pairs.reduce((sum, pair) => sum + pair.weight, 0);
  let cursor = randomFloat() * total;
  for (const pair of pairs) {
    cursor -= pair.weight;
    if (cursor <= 0) return pair;
  }
  return pairs[0];
}

/**
 * Tire un calcul pas encore posé dans la série. Quand il n’en reste plus (une seule table
 * et des erreurs), on reprend tous les calculs sauf les plus récents.
 * @param {number[]} tables
 * @param {Iterable<string>} [avoidKeys] clés `7×8` déjà posées dans la série
 * @param {Iterable<string>} [recentKeys] clés à écarter même quand tout a été posé
 * @returns {{ t: number, n: number }}
 */
export function pickChronoPair(tables, avoidKeys = [], recentKeys = []) {
  const eligible = uniqueTables(tables);
  const source = eligible.length > 0 ? eligible : [2, 3, 4, 5, 6, 7, 8, 9];
  const allTables = isFullTableSet(source);
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const all = buildAllPairs(source, nums, allTables);
  const avoid = new Set(avoidKeys);
  const recent = new Set(recentKeys);
  const fresh = all.filter(pair => !avoid.has(pairKey(pair.t, pair.n)));
  const notRecent = all.filter(pair => !recent.has(pairKey(pair.t, pair.n)));
  const pool = [fresh, notRecent, all].find(list => list.length > 0);
  const picked = pickWeightedPair(pool);
  return { t: picked.t, n: picked.n };
}

function buildAllPairs(source, nums, allTables) {
  const pairs = [];
  for (const t of source) {
    for (const n of nums) {
      pairs.push({ t, n, weight: chronoPairWeight(t, n, allTables) });
    }
  }
  return pairs;
}

/**
 * Copies dans une passe de révision : une fois le calcul, plus une fois par « à revoir ».
 * @param {number} due
 * @returns {number}
 */
function revisionCopies(due) {
  return 1 + Math.max(0, Math.floor(Number(due) || 0));
}

/**
 * Remplit la file de révision : chaque calcul au moins une fois, davantage s’il est plus
 * souvent à revoir. Les copies alternent les deux sens (6 × 7, puis 7 × 6) : c’est le même
 * fait, vu des deux côtés.
 * @param {Array<{a: number, b: number}>} queue
 * @param {Array<{a: number, b: number, due?: number}>} basket
 * @returns {Array<{a: number, b: number}>}
 */
export function refillRevisionQueue(queue, basket) {
  const round = [];
  for (const item of basket || []) {
    const copies = revisionCopies(item.due);
    for (let i = 0; i < copies; i += 1) {
      const swapped = i % 2 === 1 && item.a !== item.b;
      round.push(swapped ? { a: item.b, b: item.a } : { a: item.a, b: item.b });
    }
  }
  shuffleInPlace(round);
  queue.push(...separateRevisionRepeats(round));
  return queue;
}

/**
 * Évite deux fois le même calcul d’affilée, tant qu’il reste un autre choix.
 * @param {Array<{a: number, b: number}>} round
 * @returns {Array<{a: number, b: number}>}
 */
export function separateRevisionRepeats(round) {
  const items = [...round];
  for (let i = 1; i < items.length; i += 1) {
    const current = items.at(i);
    const previous = items.at(i - 1);
    if (!sameFact(current, previous)) continue;
    const swap = items.findIndex((item, index) => index > i && !sameFact(item, current));
    if (swap < 0) continue;
    const held = items.at(i);
    const other = items.at(swap);
    items.splice(i, 1, other);
    items.splice(swap, 1, held);
  }
  return items;
}

function sameFact(left, right) {
  return left?.a === right?.a && left?.b === right?.b;
}

/**
 * Prochain calcul de révision : une passe complète du panier avant de recommencer.
 * @param {Array<{a: number, b: number}>} queue
 * @param {Array<{a: number, b: number}>} basket
 * @returns {{a: number, b: number}|undefined}
 */
export function takeNextRevisionFact(queue, basket, lastFact) {
  if (!basket || basket.length === 0) return undefined;
  if (queue.length === 0) refillRevisionQueue(queue, basket);
  if (lastFact && queue.length > 1) {
    const index = queue.findIndex(item => !sameFact(item, lastFact));
    if (index > 0) {
      const [picked] = queue.splice(index, 1);
      return picked;
    }
  }
  return queue.shift();
}
