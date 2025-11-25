/* ======================
   Module de génération de questions (centralisé)
   Supporte toutes les opérations: ×, +, −, ÷
   ====================== */

import Storage from './core/storage.js';
import { getTranslation } from './utils-es6.js';
import { getOperation } from './core/operations/OperationRegistry.js';

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
  // Options par défaut
  const {
    operator = '×', // NOUVEAU: opérateur (défaut multiplication)
    type = 'auto',
    difficulty = 'medium', // NOUVEAU: difficulté générique
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

  // Obtenir l'instance de l'opération
  const operation = getOperation(operator);

  // Générer opérandes selon l'opération
  let a, b;

  if (operator === '×' && (forceTable !== null || tables.length > 0 || weakTables.length > 0)) {
    // Mode multiplication classique (avec tables faibles, exclusions, etc.)
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
    a = t;
    b = n;
  } else {
    // Mode opération générique (addition, soustraction, division)
    const operands = operation.generateOperands(difficulty);
    a = operands.a;
    b = operands.b;
  }

  // Déterminer le type de question
  let chosenType = type;
  if (type === 'auto') {
    // Utiliser les types supportés par l'opération
    const supportedTypes = operation.getSupportedTypes();
    chosenType = supportedTypes[Math.floor(Math.random() * supportedTypes.length)];
  } else {
    // Vérifier que le type demandé est supporté par l'opération
    const supportedTypes = operation.getSupportedTypes();
    if (!supportedTypes.includes(type)) {
      console.warn(
        `[generateQuestion] Type '${type}' non supporté pour ${operator}, fallback 'classic'`
      );
      chosenType = 'classic';
    }
  }

  // Calculer le résultat
  const result = operation.compute(a, b);

  // Générer la question selon le type
  let question, answer;

  switch (chosenType) {
    case 'classic':
      question = operation.formatQuestion(a, b, 'classic');
      answer = result;
      break;

    case 'gap':
      question = operation.formatQuestion(a, b, 'gap', result);
      answer = b;
      break;

    case 'mcq':
      question = operation.formatQuestion(a, b, 'mcq');
      answer = result;
      break;

    case 'true_false': {
      const isTrue = Math.random() > 0.5;
      // Générer une réponse fausse plausible (±1 ou ±2)
      const offset = Math.random() > 0.5 ? 1 : -1;
      const magnitude = Math.random() > 0.5 ? 1 : 2;
      const proposedAnswer = isTrue ? result : result + offset * magnitude;
      question = operation.formatQuestion(a, b, 'true_false', proposedAnswer);
      answer = isTrue;
      break;
    }

    case 'problem':
      // Problème de mots localisé (pour l'instant multiplication uniquement)
      if (operator === '×') {
        try {
          question = getTranslation('problem_templates', { table: a, num: b });
        } catch {
          question = `Problem: ${a} ${operation.symbol} ${b} = ?`;
        }
      } else {
        // R2: ajouter templates pour autres opérations
        console.warn(`[generateQuestion] Type 'problem' non supporté pour ${operator}, fallback classic`);
        question = operation.formatQuestion(a, b, 'classic');
      }
      answer = result;
      break;

    default:
      question = operation.formatQuestion(a, b, 'classic');
      answer = result;
  }

  return {
    question,
    answer,
    type: chosenType,
    operator, // NOUVEAU
    a, // NOUVEAU
    b, // NOUVEAU
    // Compatibilité multiplication
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
