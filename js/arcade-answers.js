/**
 * Calculs et réponses proposées des jeux d'Arcade qui montrent plusieurs réponses à la fois
 * (MultiInvaders, MultiPop, MultiGoal) : les tables et les nombres du niveau, les tables à revoir
 * du joueur tirées plus souvent, et des mauvaises réponses proches ou éloignées selon le
 * niveau.
 */
import { generateQuestion } from './questionGenerator.js';
import { weakTablesFor } from './arcade-learning.js';
import { plausibleWrongAnswers } from './core/wrong-answers.js';
import { shuffleInPlace } from './core/random.js';

/**
 * Calcul d'un jeu d'Arcade (ou résultat d'une mauvaise réponse éloignée) : les tables du niveau en ×, les nombres
 * du niveau (facile, moyen, difficile) en +, − et ÷
 * @param {string} operator
 * @param {{tables: number[], questionDifficulty: string, distractorDistance: string}} settings
 * @param {number[]} [excludeTables] - Tables retirées (multiplication seulement)
 * @returns {Object} Question de generateQuestion
 */
export function drawArcadeQuestion(operator, settings, excludeTables = []) {
  const isMultiplication = operator === '×';
  return generateQuestion({
    type: 'mcq',
    operator, // Support multi-opérations (+, −, ×, ÷)
    difficulty: settings.questionDifficulty,
    tables: isMultiplication ? settings.tables : undefined,
    excludeTables: isMultiplication ? excludeTables : [],
    // Tables à revoir du joueur : tirées plus souvent (jamais une table retirée)
    weakTables: weakTablesFor(operator),
  });
}

// Part des mauvaises réponses proches de la bonne, selon le niveau (difficulty.js) :
// éloignées en Débutant (la bonne se repère), moitié-moitié en Moyen, proches en Difficile
const CLOSE_WRONG_SHARE = new Map([
  ['far', 0],
  ['medium', 0.5],
  ['close', 1],
]);
// Tirages au plus pour trouver les mauvaises réponses éloignées d'une vague
const MAX_FAR_DRAWS = 40;

/**
 * Réponses proposées pour un calcul (monstres d'une vague de MultiInvaders ou d'une sortie de MultiPop, cibles de MultiGoal) : la bonne réponse et des mauvaises, proches
 * (erreurs plausibles d'un enfant : la table à côté, un de plus…) ou éloignées (résultats
 * d'autres calculs du niveau), selon le niveau ; toutes différentes, jamais négatives
 * @param {{a: number, b: number, answer: number}} question
 * @param {string} operator
 * @param {{distractorDistance?: string}} settings - réglages du niveau
 * @param {number} count
 * @returns {number[]} Mélangés
 */
export function arcadeAnswers(question, operator, settings, count) {
  const answers = [question.answer];
  const add = value => {
    if (Number.isFinite(value) && value >= 0 && !answers.includes(value)) answers.push(value);
  };
  const share = CLOSE_WRONG_SHARE.get(settings.distractorDistance) ?? 0;
  const near = { answer: question.answer, operator, a: question.a, b: question.b };
  plausibleWrongAnswers(near, Math.round((count - 1) * share)).forEach(add);
  for (let draw = 0; answers.length < count && draw < MAX_FAR_DRAWS; draw++) {
    add(drawArcadeQuestion(operator, settings).answer);
  }
  // Niveau aux résultats peu variés : toujours une vague complète, de voisins proches
  plausibleWrongAnswers(near, count).forEach(add);
  let next = question.answer;
  while (answers.length < count) add(++next);
  return shuffleInPlace(answers.slice(0, count));
}
