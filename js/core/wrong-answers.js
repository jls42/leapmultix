/**
 * Mauvaises réponses plausibles d'une question : les erreurs qu'un enfant ferait vraiment (un
 * de plus ou de moins, un rang de table à côté, chiffres inversés), jamais tirées au hasard
 * entre 1 et 100. Module sans dépendance au jeu : les modes (GameMode) et l'Arcade l'importent.
 */
import { randomInt, shuffleInPlace } from './random.js';

/** Opérandes numériques d'une question (nouveau format a/b ou ancien table/num) */
export function operandsOf(question) {
  return {
    a: Number(question.a ?? question.table),
    b: Number(question.b ?? question.num),
  };
}

/**
 * Chiffres inversés d'un nombre à deux chiffres voisins (56 → 65), sinon null :
 * 16 → 61 serait trop loin pour tromper qui que ce soit.
 * @param {number} value
 * @returns {number|null}
 */
function reverseDigits(value) {
  if (!Number.isInteger(value) || value < 12 || value > 99 || value % 10 === 0) return null;
  const reversed = (value % 10) * 10 + Math.floor(value / 10);
  return Math.abs(reversed - value) === 9 ? reversed : null;
}

/**
 * Copie mélangée d'une liste
 * @param {Array} list
 * @returns {Array}
 */
function shuffle(list) {
  return shuffleInPlace([...list]);
}

/**
 * Voisins plausibles selon l'opération : ce que donnerait une erreur d'enfant
 * (un de plus ou de moins, un rang de table à côté, chiffres inversés).
 * @returns {number[]}
 */
function wrongAnswerPool(question, correct) {
  const { a, b } = operandsOf(question);
  const operator = question.operator || '×';
  if (question.type === 'gap') {
    return [correct + 1, correct - 1, correct + 2, correct - 2];
  }
  if (operator === '×') {
    return [
      a * (b + 1),
      a * (b - 1),
      (a + 1) * b,
      (a - 1) * b,
      correct + 1,
      correct - 1,
      reverseDigits(correct),
    ];
  }
  if (operator === '÷') {
    return [correct + 1, correct - 1, b, correct + 2, correct - 2];
  }
  return [
    correct + 1,
    correct - 1,
    correct + 2,
    correct - 2,
    correct + 10,
    correct - 10,
    reverseDigits(correct),
  ];
}

/**
 * Bornes d'une mauvaise réponse acceptable pour cette question.
 * Résultat de soustraction : 0 est possible ; ailleurs, des nombres à partir de 1.
 * @param {Object} question
 * @param {number} correct
 * @returns {{correct: number, min: number, max: number}}
 */
function wrongAnswerBounds(question, correct) {
  return {
    correct,
    min: question.operator === '−' && question.type !== 'gap' ? 0 : 1,
    max: correct <= 100 ? 100 : Infinity,
  };
}

/**
 * Une valeur est-elle une mauvaise réponse utilisable, pas déjà retenue ?
 * @param {number} value
 * @param {{correct: number, min: number, max: number}} bounds
 * @param {number[]} taken
 * @returns {boolean}
 */
function isUsableWrongAnswer(value, bounds, taken) {
  if (!Number.isInteger(value)) return false;
  if (value < bounds.min || value > bounds.max) return false;
  if (value === bounds.correct) return false;
  return !taken.includes(value);
}

/**
 * Mauvaises réponses d'un côté de la bonne (direction -1 : en dessous, 1 : au-dessus) : celles du
 * réservoir, mélangées, puis des voisins de plus en plus lointains quand il n'en a pas assez.
 * @param {number[]} pool - Réservoir déjà filtré
 * @param {{correct: number, min: number, max: number}} bounds
 * @param {number} direction
 * @returns {number[]}
 */
function wrongAnswersOnSide(pool, bounds, direction) {
  const side = shuffle(pool.filter(value => Math.sign(value - bounds.correct) === direction));
  for (let offset = 3; offset < 50; offset++) {
    const value = bounds.correct + direction * offset;
    if (isUsableWrongAnswer(value, bounds, side)) side.push(value);
  }
  return side;
}

/**
 * Mauvaises réponses plausibles (jamais tirées au hasard entre 1 et 100) :
 * l'enfant ne peut pas trouver la bonne par élimination.
 * @param {Object} question
 * @param {number} [count=3]
 * @returns {number[]}
 */
export function plausibleWrongAnswers(question, count = 3) {
  const correct = Number(question?.answer);
  if (!Number.isFinite(correct)) return [];
  const bounds = wrongAnswerBounds(question, correct);

  const pool = [];
  for (const value of wrongAnswerPool(question, correct)) {
    if (isUsableWrongAnswer(value, bounds, pool)) pool.push(value);
  }
  const below = wrongAnswersOnSide(pool, bounds, -1);
  const above = wrongAnswersOnSide(pool, bounds, 1);
  // La place de la bonne réponse est tirée au sort : autant de leurres en dessous qu'il en faut.
  // Pris au hasard dans un réservoir symétrique, ils la laissaient presque toujours au milieu,
  // jamais la plus grande ni la plus petite : un indice qu'un enfant apprend vite.
  const wanted = Math.min(randomInt(0, count), below.length);
  const fromAbove = Math.min(count - wanted, above.length);
  const fromBelow = Math.min(count - fromAbove, below.length);
  return [...below.slice(0, fromBelow), ...above.slice(0, fromAbove)];
}

/**
 * Bonne réponse et mauvaises réponses plausibles, mélangées
 * @param {Object} question
 * @param {number} [count=4]
 * @returns {number[]}
 */
export function buildAnswerOptions(question, count = 4) {
  return shuffle([question.answer, ...plausibleWrongAnswers(question, count - 1)]);
}
