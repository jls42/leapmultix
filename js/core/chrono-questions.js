/**
 * Tirage Chrono et file de révision, pour les quatre opérations.
 *
 * Une « table » de Chrono est un nombre n et ses dix calculs, k allant de 1 à 10 :
 * - × : n × k (les tables de multiplication) ;
 * - + : n + k ;
 * - − : (n + k) − n, c’est-à-dire enlever n, réponses de 1 à 10 ;
 * - ÷ : (n × k) ÷ n, c’est-à-dire diviser par n, réponses de 1 à 10, sans ÷ 1 (rien à y
 *   apprendre, et aucune de ces questions n’a de clip de voix).
 * Toutes ces questions ont déjà un clip dans les trois langues : ce sont celles du niveau
 * moyen du Quiz et du Défi.
 *
 * Le tirage favorise les calculs difficiles : 6, 7, 8 et 9 en × et en ÷, le passage de la
 * dizaine en + et en −. Quand toutes les tables sont jouées, les calculs avec 1 ou 10
 * deviennent rares ; dès que l’enfant a retiré des tables dans les Paramètres (× seulement),
 * ils gardent leur poids normal.
 * Une famille de calculs, ce sont les mêmes trois nombres : 6 × 7 et 7 × 6, 3 + 8 et 8 + 3,
 * 15 − 7 et 15 − 8, 56 ÷ 7 et 56 ÷ 8. Une course n’en pose qu’un membre ; la révision pose
 * chaque calcul de la liste dans les deux sens, jamais deux fois d’affilée.
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
const NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// Division : diviseurs de 2 à 10, comme le Quiz, le Défi et la Découverte (Division.js)
const DIVISION_TABLES = [2, 3, 4, 5, 6, 7, 8, 9, 10];
// Addition et soustraction : un calcul qui passe la dizaine (8 + 7, 15 − 8) pèse quatre fois
// plus qu’un autre
const ADD_SUB_WEIGHT = 3;
const TEN_CROSSING_WEIGHT = 12;

/** Opérations de Chrono, dans l’ordre du sélecteur de l’accueil */
export const CHRONO_OPERATORS = Object.freeze(['×', '+', '−', '÷']);

/**
 * Tables d’une opération : 1 à 10, sauf la division (2 à 10)
 * @param {string} [operator]
 * @returns {number[]}
 */
export function chronoTables(operator = '×') {
  return operator === '÷' ? [...DIVISION_TABLES] : [...NUMS];
}

function isChronoTable(n, operator) {
  return chronoTables(operator).includes(Number(n));
}

export function isFullTableSet(tables, operator = '×') {
  const unique = uniqueTables(tables, operator);
  return unique.length === (operator === '÷' ? DIVISION_TABLES.length : ALL_TABLES_COUNT);
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

function uniqueTables(tables, operator = '×') {
  return [...new Set((tables || []).map(Number).filter(n => isChronoTable(n, operator)))];
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

/**
 * Le calcul affiché pour la table n et le nombre k : n × k, n + k, (n + k) − n, (n × k) ÷ n
 * @param {string} operator
 * @param {number} n
 * @param {number} k
 * @returns {{a: number, b: number}}
 */
export function chronoFact(operator, n, k) {
  const table = Number(n);
  const other = Number(k);
  if (operator === '−') return { a: table + other, b: table };
  if (operator === '÷') return { a: table * other, b: table };
  return { a: table, b: other };
}

/**
 * Résultat d’un calcul de Chrono
 * @param {string} operator
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function chronoAnswer(operator, a, b) {
  const left = Number(a);
  const right = Number(b);
  if (operator === '+') return left + right;
  if (operator === '−') return left - right;
  if (operator === '÷') return left / right;
  return left * right;
}

/**
 * Passage de la dizaine : 8 + 7 = 15, 15 − 8 = 7 (on « casse » la dizaine). 10 + 3 et 17 − 7
 * ne le passent pas.
 */
function crossesTen(operator, a, b) {
  if (operator === '+') return a < 10 && b < 10 && a + b > 10;
  if (operator === '−') return a > 10 && b < 10 && a % 10 < b;
  return false;
}

/**
 * Poids du calcul de la table n et du nombre k, pour une opération. La multiplication garde
 * exactement son poids d’avant ; la division prend celui de la multiplication sur le
 * diviseur et le quotient ; l’addition et la soustraction favorisent le passage de la dizaine.
 * Les pénalités des calculs avec 1 ou 10 ne valent que quand toutes les tables sont jouées.
 * @param {string} operator
 * @param {number} n - Table
 * @param {number} k - Second nombre de la table (multiplicande, terme, reste, quotient)
 * @param {boolean} allTables
 * @returns {number}
 */
export function chronoFactWeight(operator, n, k, allTables) {
  if (operator === '×' || operator === '÷') return chronoPairWeight(n, k, allTables);
  const { a, b } = chronoFact(operator, n, k);
  const weight = crossesTen(operator, a, b) ? TEN_CROSSING_WEIGHT : ADD_SUB_WEIGHT;
  return Math.max(allTables ? withEasyPenalties(weight, n, k) : weight, 0.01);
}

/** Les calculs avec 1 ou 10, rares quand toutes les tables sont jouées (+ et −) */
function withEasyPenalties(weight, n, k) {
  let result = weight;
  if (n === 1 || n === 10) result *= EASY_TABLE_PENALTY;
  if (k === 1 || k === 10) result *= EASY_FACTOR_PENALTY;
  return result;
}

function pairKey(t, n, operator = '×') {
  return `${t}${operator}${n}`;
}

/**
 * L’autre membre de la famille d’un calcul, ou null s’il n’y en a pas : 7 × 6 pour 6 × 7,
 * 8 + 3 pour 3 + 8, 15 − 8 pour 15 − 7, 56 ÷ 8 pour 56 ÷ 7. Pas d’autre sens quand il
 * redonnerait le même calcul (7 × 7, 14 − 7, 49 ÷ 7), ni quand il diviserait par 1
 * (7 ÷ 7 = 1 : 7 ÷ 1 n’est pas posé).
 * @param {string} operator
 * @param {number} a
 * @param {number} b
 * @returns {{a: number, b: number}|null}
 */
export function otherFactDirection(operator, a, b) {
  const left = Number(a);
  const right = Number(b);
  if (operator === '−') {
    const rest = left - right;
    return rest === right ? null : { a: left, b: rest };
  }
  if (operator === '÷') {
    const quotient = left / right;
    return quotient === right || quotient === 1 ? null : { a: left, b: quotient };
  }
  return left === right ? null : { a: right, b: left };
}

/**
 * Les deux sens d’un calcul (`8×6` et `6×8`, `15−7` et `15−8`) : c’est le même calcul,
 * qu’une course ne pose pas deux fois. La multiplication garde ses deux clés, même pour
 * 7 × 7.
 * @param {number} a
 * @param {number} b
 * @param {string} [operator]
 * @returns {string[]}
 */
export function factKeys(a, b, operator = '×') {
  const left = Number(a);
  const right = Number(b);
  if (operator === '×') return [pairKey(left, right), pairKey(right, left)];
  const other = otherFactDirection(operator, left, right);
  const keys = [pairKey(left, right, operator)];
  if (other) keys.push(pairKey(other.a, other.b, operator));
  return keys;
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
 * et des erreurs), on reprend tous les calculs sauf le dernier posé, dans un sens comme dans
 * l’autre.
 * @param {number[]} tables
 * @param {Iterable<string>} [avoidKeys] clés `7×8` déjà posées dans la série
 * @param {Iterable<string>} [recentKeys] clés à écarter même quand tout a été posé
 * @returns {{ t: number, n: number }}
 */
export function pickChronoPair(tables, avoidKeys = [], recentKeys = []) {
  const eligible = uniqueTables(tables);
  const source = eligible.length > 0 ? eligible : [2, 3, 4, 5, 6, 7, 8, 9];
  const allTables = isFullTableSet(source);
  const all = buildAllPairs(source, NUMS, allTables);
  const picked = pickFromPool(all, avoidKeys, recentKeys);
  return { t: picked.t, n: picked.n };
}

function buildAllPairs(source, nums, allTables) {
  const pairs = [];
  for (const t of source) {
    for (const n of nums) {
      pairs.push({ t, n, key: pairKey(t, n), weight: chronoPairWeight(t, n, allTables) });
    }
  }
  return pairs;
}

/** Un calcul pas encore posé, sinon pas le dernier posé, sinon n’importe lequel */
function pickFromPool(all, avoidKeys, recentKeys) {
  const avoid = new Set(avoidKeys);
  const recent = new Set(recentKeys);
  const fresh = all.filter(pair => !avoid.has(pair.key));
  const notRecent = all.filter(pair => !recent.has(pair.key));
  const pool = [fresh, notRecent, all].find(list => list.length > 0);
  return pickWeightedPair(pool);
}

/**
 * Tire le prochain calcul d’une course, dans la grille de l’opération. La multiplication
 * reprend le tirage d’avant à l’identique (mêmes tables des Paramètres, mêmes poids) ; les
 * autres opérations jouent toutes leurs tables.
 * @param {string} operator
 * @param {number[]} tables - Tables de la course (× : celles des Paramètres)
 * @param {Iterable<string>} [avoidKeys] - Clés des calculs déjà posés (factKeys)
 * @param {Iterable<string>} [recentKeys] - Clés à écarter même quand tout a été posé
 * @returns {{a: number, b: number}}
 */
export function pickChronoFact(operator, tables, avoidKeys = [], recentKeys = []) {
  if (operator === '×') {
    const { t, n } = pickChronoPair(tables, avoidKeys, recentKeys);
    return { a: t, b: n };
  }
  const source = chronoTables(operator);
  const allTables = isFullTableSet(tables, operator);
  const pairs = [];
  for (const n of source) {
    for (const k of NUMS) {
      const fact = chronoFact(operator, n, k);
      pairs.push({
        ...fact,
        key: pairKey(fact.a, fact.b, operator),
        weight: chronoFactWeight(operator, n, k, allTables),
      });
    }
  }
  const picked = pickFromPool(pairs, avoidKeys, recentKeys);
  return { a: picked.a, b: picked.b };
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
 * souvent à revoir. Les copies se partagent les deux sens de la famille (6 × 7 et 7 × 6,
 * 15 − 7 et 15 − 8), puis la passe est mélangée : c’est le même fait, vu des deux côtés.
 * @param {Array<{a: number, b: number}>} queue
 * @param {Array<{a: number, b: number, due?: number}>} basket
 * @param {string} [operator]
 * @returns {Array<{a: number, b: number}>}
 */
export function refillRevisionQueue(queue, basket, operator = '×') {
  const round = [];
  for (const item of basket || []) {
    const copies = revisionCopies(item.due);
    const other = otherFactDirection(operator, item.a, item.b);
    for (let i = 0; i < copies; i += 1) {
      const swapped = i % 2 === 1 && other !== null;
      round.push(swapped ? { a: other.a, b: other.b } : { a: item.a, b: item.b });
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
    const other = items.at(swap);
    items.splice(i, 1, other);
    items.splice(swap, 1, current);
  }
  return items;
}

function sameFact(left, right) {
  return left?.a === right?.a && left?.b === right?.b;
}

/**
 * Prochain calcul de révision : une passe complète de la liste avant de recommencer.
 * @param {Array<{a: number, b: number}>} queue
 * @param {Array<{a: number, b: number}>} basket
 * @param {{a: number, b: number}} [lastFact] - Dernier calcul posé : s’il est en tête de file,
 *   on prend le premier calcul différent (même sens seulement : l’inverse peut suivre)
 * @param {string} [operator]
 * @returns {{a: number, b: number}|undefined}
 */
export function takeNextRevisionFact(queue, basket, lastFact, operator = '×') {
  if (!basket || basket.length === 0) return undefined;
  if (queue.length === 0) refillRevisionQueue(queue, basket, operator);
  if (lastFact && queue.length > 1) {
    const index = queue.findIndex(item => !sameFact(item, lastFact));
    if (index > 0) {
      const [picked] = queue.splice(index, 1);
      return picked;
    }
  }
  return queue.shift();
}
