/* ======================
   Module de génération de questions (centralisé)
   Supporte toutes les opérations: ×, +, −, ÷

   Security note: This module uses Math.random() for generating random math problems
   and shuffling answer options. This is intentional and safe - it's an educational
   math game for children, not a security-sensitive application.
   ====================== */

import Storage from './core/storage.js';
import { getTranslation } from './utils-es6.js';
import { getOperation } from './core/operations/OperationRegistry.js';

// --- Helpers pour génération d'opérandes ---

/**
 * Génère des opérandes pour la multiplication (mode tables)
 */
function generateMultiplicationOperands(config, weakTables) {
  const { forceTable, tables, excludeTables, minTable, maxTable, forceNum, minNum, maxNum } =
    config;

  const eligibleTables = getEligibleTables({
    forceTable,
    tables,
    excludeTables,
    minTable,
    maxTable,
  });
  const eligibleNums = getEligibleNums({ forceNum, minNum, maxNum });

  if (eligibleTables.length === 0 || eligibleNums.length === 0) {
    throw new Error(
      `generateQuestion: aucune combinaison possible (tables=${eligibleTables.length}, nums=${eligibleNums.length})`
    );
  }

  const { t, n } = pickWeightedPair(eligibleTables, eligibleNums, weakTables);
  return { a: t, b: n };
}

/**
 * Vérifie si le mode multiplication avec tables est actif
 */
function isMultiplicationTableMode(operator, forceTable, tables, weakTables) {
  return operator === '×' && (forceTable !== null || tables.length > 0 || weakTables.length > 0);
}

/**
 * Détermine le type de question à utiliser
 */
function determineQuestionType(type, operation, operator) {
  if (type === 'auto') {
    const supportedTypes = operation.getSupportedTypes();
    return supportedTypes[Math.floor(Math.random() * supportedTypes.length)];
  }

  const supportedTypes = operation.getSupportedTypes();
  if (!supportedTypes.includes(type)) {
    console.warn(
      `[generateQuestion] Type '${type}' non supporté pour ${operator}, fallback 'classic'`
    );
    return 'classic';
  }
  return type;
}

// --- Handlers pour chaque type de question ---

function handleClassicQuestion(operation, a, b, result) {
  return { question: operation.formatQuestion(a, b, 'classic'), answer: result };
}

function handleGapQuestion(operation, a, b, result) {
  return { question: operation.formatQuestion(a, b, 'gap', result), answer: b };
}

function handleMcqQuestion(operation, a, b, result) {
  return { question: operation.formatQuestion(a, b, 'mcq'), answer: result };
}

function handleTrueFalseQuestion(operation, a, b, result) {
  const isTrue = Math.random() > 0.5;
  const offset = Math.random() > 0.5 ? 1 : -1;
  const magnitude = Math.random() > 0.5 ? 1 : 2;
  const proposedAnswer = isTrue ? result : result + offset * magnitude;
  return { question: operation.formatQuestion(a, b, 'true_false', proposedAnswer), answer: isTrue };
}

function handleProblemQuestion(operation, operator, a, b, result) {
  const templateMap = {
    '×': { key: 'problem_templates', params: { table: a, num: b } },
    '+': { key: 'problem_templates_addition', params: { a, b } },
    '−': { key: 'problem_templates_subtraction', params: { a, b } },
    '÷': { key: 'problem_templates_division', params: { a, b } },
  };

  const template = templateMap[operator];
  if (!template) {
    return { question: operation.formatQuestion(a, b, 'classic'), answer: result };
  }

  try {
    return { question: getTranslation(template.key, template.params), answer: result };
  } catch (error) {
    console.warn(`[generateQuestion] Template '${template.key}' non trouvé:`, error);
    return { question: `Problem: ${a} ${operation.symbol} ${b} = ?`, answer: result };
  }
}

/**
 * Génère la question et la réponse selon le type
 */
function generateQuestionByType(chosenType, operation, operator, a, b, result) {
  switch (chosenType) {
    case 'classic':
      return handleClassicQuestion(operation, a, b, result);
    case 'gap':
      return handleGapQuestion(operation, a, b, result);
    case 'mcq':
      return handleMcqQuestion(operation, a, b, result);
    case 'true_false':
      return handleTrueFalseQuestion(operation, a, b, result);
    case 'problem':
      return handleProblemQuestion(operation, operator, a, b, result);
    default:
      return handleClassicQuestion(operation, a, b, result);
  }
}

/**
 * Génère une question arithmétique selon les options fournies.
 * @param {Object} options - Options de génération
 * @param {string} options.operator - Opérateur (×, +, −, ÷) - défaut: '×'
 * @param {string} options.type - Type de question ('classic', 'gap', 'mcq', 'true_false', 'problem', ou 'auto')
 * @param {string} options.difficulty - Difficulté ('easy', 'medium', 'hard') - défaut: 'medium'
 * @param {Array<number>} options.weakTables - Tables faibles (multiplication uniquement)
 * @param {Array<number>} options.excludeTables - Tables à exclure (multiplication uniquement)
 * @param {Array<number>} options.tables - Tables spécifiques (multiplication uniquement)
 * @param {number} options.minTable - Table min (multiplication)
 * @param {number} options.maxTable - Table max (multiplication)
 * @param {number} options.minNum - Num min (multiplication)
 * @param {number} options.maxNum - Num max (multiplication)
 * @param {number|null} options.forceTable - Forcer une table (multiplication)
 * @param {number|null} options.forceNum - Forcer un num (multiplication)
 * @returns {Object} { question, answer, type, operator, a, b, table, num }
 */
export function generateQuestion(options = {}) {
  const {
    operator = '×',
    type = 'auto',
    difficulty = 'medium',
    weakTables = [],
    excludeTables = [],
    tables = [],
    minTable = 1,
    maxTable = 10,
    minNum = 1,
    maxNum = 10,
    forceTable = null,
    forceNum = null,
  } = options;

  const operation = getOperation(operator);

  // Générer opérandes selon l'opération
  let a, b;
  if (isMultiplicationTableMode(operator, forceTable, tables, weakTables)) {
    const operands = generateMultiplicationOperands(
      { forceTable, tables, excludeTables, minTable, maxTable, forceNum, minNum, maxNum },
      weakTables
    );
    a = operands.a;
    b = operands.b;
  } else {
    const operands = operation.generateOperands(difficulty);
    a = operands.a;
    b = operands.b;
  }

  const chosenType = determineQuestionType(type, operation, operator);
  const result = operation.compute(a, b);
  const { question, answer } = generateQuestionByType(
    chosenType,
    operation,
    operator,
    a,
    b,
    result
  );

  return {
    question,
    answer,
    type: chosenType,
    operator,
    a,
    b,
    table: operator === '×' ? a : undefined,
    num: operator === '×' ? b : undefined,
  };
}

// --- Helpers pour réduire la complexité de generateQuestion ---
function getEligibleTables({ forceTable, tables, excludeTables, minTable, maxTable }) {
  if (forceTable !== null) return [forceTable];

  const fullRange = Array.from({ length: maxTable - minTable + 1 }, (_, i) => i + minTable);
  const filteredRange = fullRange.filter(t => !excludeTables.includes(t));

  if (Array.isArray(tables) && tables.length > 0) {
    const filteredTables = tables.filter(t => !excludeTables.includes(t));
    if (filteredTables.length === 0) {
      console.warn(
        '[generateQuestion] Toutes les tables explicites sont exclues, ignorance des exclusions pour ce mode.'
      );
      return [...new Set(tables)];
    }
    return filteredTables;
  }

  if (filteredRange.length > 0) return filteredRange;

  console.warn(
    '[generateQuestion] Toutes les tables min/max sont exclues, réutilisation du range complet'
  );
  return fullRange.length > 0 ? fullRange : [minTable || 1];
}

function getEligibleNums({ forceNum, minNum, maxNum }) {
  if (forceNum !== null) return [forceNum];
  return Array.from({ length: maxNum - minNum + 1 }, (_, i) => i + minNum);
}

function getMultiplicationStats(table, num) {
  try {
    const allStats = Storage.loadMultiplicationStats();
    const stats = allStats?.[`${table}x${num}`] || { attempts: 0, errors: 0 };
    return {
      attempts: Number(stats.attempts) || 0,
      errors: Number(stats.errors) || 0,
    };
  } catch {
    return { attempts: 0, errors: 0 };
  }
}

function calculateWeight(table, num, weakTables) {
  const { attempts, errors } = getMultiplicationStats(table, num);
  const errRate = attempts > 0 ? errors / attempts : 0;
  let weight = 1 + errRate;
  if (weakTables.includes(table)) weight += 1;
  return weight;
}

function buildWeightedPairs(eligibleTables, eligibleNums, weakTables) {
  const pairs = [];
  for (const t of eligibleTables) {
    for (const n of eligibleNums) {
      const weight = calculateWeight(t, n, weakTables);
      pairs.push({ t, n, weight });
    }
  }
  return pairs;
}

function selectRandomPair(pairs) {
  const totalWeight = pairs.reduce((sum, p) => sum + p.weight, 0);
  let r = Math.random() * totalWeight;
  for (const p of pairs) {
    r -= p.weight;
    if (r <= 0) return p;
  }
  return pairs[0];
}

function pickWeightedPair(eligibleTables, eligibleNums, weakTables = []) {
  const pairs = buildWeightedPairs(eligibleTables, eligibleNums, weakTables);
  return selectRandomPair(pairs);
}
