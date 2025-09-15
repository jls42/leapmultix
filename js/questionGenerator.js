/* ======================
   Module de génération de questions (centralisé)
   ====================== */

import Storage from './core/storage.js';
import { getTranslation } from './utils-es6.js';

/**
 * Génère une question de multiplication selon les options fournies.
 * @param {Object} options - Options de génération (type, tables faibles, exclusions, etc.)
 * @returns {Object} { question, answer, type, table, num, ... }
 */
export function generateQuestion(options = {}) {
  // Options par défaut
  const {
    type = 'auto', // 'classic', 'gap', 'mcq', 'true_false', 'problem', ou 'auto'
    // weakTables = [], // Array<number> - unused
    excludeTables = [], // Array<number>
    tables = [], // Nouvel argument : liste des tables à piocher
    minTable = 1,
    maxTable = 10,
    minNum = 1,
    maxNum = 10,
    forceTable = null, // Pour forcer une table précise
    forceNum = null, // Pour forcer un multiplicande précis
  } = options;

  // Échantillonnage adaptatif par paire selon l'historique
  const eligibleTables = getEligibleTables({
    forceTable,
    tables,
    excludeTables,
    minTable,
    maxTable,
  });
  const eligibleNums = getEligibleNums({ forceNum, minNum, maxNum });
  const { t: table, n: num } = pickWeightedPair(eligibleTables, eligibleNums);

  // Déterminer le type de question
  let chosenType = type;
  if (type === 'auto') {
    const types = ['classic', 'gap', 'mcq', 'true_false', 'problem'];
    chosenType = types[Math.floor(Math.random() * types.length)];
  }

  // Générer la question selon le type
  let question, answer;
  switch (chosenType) {
    case 'classic':
      question = `${table} × ${num} = ?`;
      answer = table * num;
      break;
    case 'gap':
      question = `${table} × ? = ${table * num}`;
      answer = num;
      break;
    case 'mcq':
      question = `${table} × ${num} = ?`;
      answer = table * num;
      break;
    case 'true_false': {
      const isTrue = Math.random() > 0.5;
      const proposedAnswer = isTrue ? table * num : table * num + (Math.random() > 0.5 ? 1 : -1);
      question = `${table} × ${num} = ${proposedAnswer}`;
      answer = isTrue;
      break;
    }
    case 'problem':
      // Problème de mots localisé via le système de traduction
      try {
        question = getTranslation('problem_templates', { table, num });
      } catch {
        question = `Problem: ${table} × ${num} = ?`;
      }
      answer = table * num;
      break;
    default:
      question = `${table} × ${num} = ?`;
      answer = table * num;
  }

  return {
    question,
    answer,
    type: chosenType,
    table,
    num,
  };
}

// --- Helpers pour réduire la complexité de generateQuestion ---
function getEligibleTables({ forceTable, tables, excludeTables, minTable, maxTable }) {
  if (forceTable !== null) return [forceTable];
  if (Array.isArray(tables) && tables.length > 0)
    return tables.filter(t => !excludeTables.includes(t));
  return Array.from({ length: maxTable - minTable + 1 }, (_, i) => i + minTable).filter(
    t => !excludeTables.includes(t)
  );
}

function getEligibleNums({ forceNum, minNum, maxNum }) {
  if (forceNum !== null) return [forceNum];
  return Array.from({ length: maxNum - minNum + 1 }, (_, i) => i + minNum);
}

function pickWeightedPair(eligibleTables, eligibleNums) {
  const pairs = [];
  for (const t of eligibleTables) {
    for (const n of eligibleNums) {
      let attempts = 0,
        errors = 0;
      try {
        const allStats = Storage.loadMultiplicationStats();
        const stats = allStats?.[`${t}x${n}`] || { attempts: 0, errors: 0 };
        attempts = Number(stats.attempts) || 0;
        errors = Number(stats.errors) || 0;
      } catch {
        // Pas de stats disponibles
      }
      const errRate = attempts > 0 ? errors / attempts : 0;
      pairs.push({ t, n, weight: 1 + errRate });
    }
  }
  const totalWeight = pairs.reduce((sum, p) => sum + p.weight, 0);
  let r = Math.random() * totalWeight;
  for (const p of pairs) {
    r -= p.weight;
    if (r <= 0) return p;
  }
  return pairs[0];
}
