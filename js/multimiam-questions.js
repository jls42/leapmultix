// multimiam-questions.js - Génération et placement des questions/réponses pour Pacman
// (c) LeapMultix 2025

import { generateQuestion } from './questionGenerator.js';
import { safeShuffleArray } from './arcade-utils.js';
import { TablePreferences } from './core/tablePreferences.js';
import { UserManager } from './userManager.js';

const isValidIndex = (value, size) => Number.isInteger(value) && value >= 0 && value < size;

/**
 * Détermine les tables à utiliser pour la génération de question
 * @param {Object} game - État du jeu
 * @param {string} operator - Opérateur mathématique
 * @returns {number[]|undefined} Tables à utiliser ou undefined
 */
const getTablesForQuestion = (game, operator) => {
  if (operator !== '×') return undefined;
  if (!Array.isArray(game?.tables)) return undefined;
  return game.tables.length > 0 ? game.tables : undefined;
};

/**
 * Détermine la table forcée pour la génération de question
 * @param {Object} game - État du jeu
 * @param {string} operator - Opérateur mathématique
 * @returns {number|null} Numéro de table forcée ou null
 */
const getForceTable = (game, operator) => {
  if (operator !== '×') return null;
  if (game?.mode !== 'table') return null;
  return game?.tableNumber ?? null;
};

const isFreeLabyrinthCell = (labyrinth, x, y) => {
  if (!Array.isArray(labyrinth) || !isValidIndex(y, labyrinth.length)) {
    return false;
  }

  const row = labyrinth[y];
  if (!Array.isArray(row) || !isValidIndex(x, row.length)) {
    return false;
  }

  return row[x] === 0;
};

export const PacmanQuestions = {
  generateOperation(game) {
    try {
      // Récupérer l'opérateur depuis le jeu (multi-opérations support)
      const operator = game?.operator || '×';

      // Appliquer l'exclusion globale de tables (uniquement pour multiplication)
      const currentUser = UserManager.getCurrentUser();
      const excluded =
        operator === '×' && TablePreferences.isGlobalEnabled(currentUser)
          ? TablePreferences.getActiveExclusions(currentUser)
          : [];

      // Utiliser generateQuestion pour cohérence avec le système centralisé
      const questionData = generateQuestion({
        type: 'classic',
        operator, // Support multi-opérations (+, −, ×, ÷)
        difficulty: game?.difficulty || 'medium',
        excludeTables: operator === '×' ? excluded : [],
        tables: getTablesForQuestion(game, operator),
        forceTable: getForceTable(game, operator),
      });

      return {
        num1: questionData.a,
        num2: questionData.b,
        operator,
        result: questionData.answer,
      };
    } catch (e) {
      console.error('Erreur generateOperation', e);
      const operator = game?.operator || '×';
      return { num1: 1, num2: 1, operator, result: operator === '×' ? 1 : 2 };
    }
  },

  generateAnswers(game, correctResult) {
    const answers = [{ value: correctResult, isCorrect: true }];
    const used = new Set([correctResult]);
    const operator = game?.operator || '×';

    const pushIf = v => {
      if (v > 0 && !used.has(v)) {
        answers.push({ value: v, isCorrect: false });
        used.add(v);
      }
    };

    // Distracteurs communs à toutes les opérations : ±1, ±2
    pushIf(correctResult - 1);
    pushIf(correctResult + 1);
    pushIf(correctResult - 2);
    pushIf(correctResult + 2);

    // Distracteurs spécifiques à chaque opération
    if (operator === '×' && game.currentOperation) {
      const { num1, num2 } = game.currentOperation;
      // Erreurs tables adjacentes
      [(num1 + 1) * num2, (num1 - 1) * num2, num1 * (num2 + 1), num1 * (num2 - 1)].forEach(pushIf);
      // Inversion chiffres (pour résultats ≥ 10)
      if (correctResult >= 10) {
        const rev = parseInt(correctResult.toString().split('').reverse().join(''), 10);
        pushIf(rev);
      }
    } else if (operator === '+' && game.currentOperation) {
      const { num1, num2 } = game.currentOperation;
      // Erreurs communes en addition : somme partielle, oubli retenue
      pushIf(num1 + num2 - 10); // Oubli dizaine
      pushIf(num1); // Oubli du second terme
      pushIf(num2); // Oubli du premier terme
    } else if (operator === '−' && game.currentOperation) {
      const { num1, num2 } = game.currentOperation;
      // Erreurs communes en soustraction : inversion (b-a au lieu de a-b)
      pushIf(num2 - num1);
      pushIf(num1); // Pas de soustraction
      pushIf(num1 + num2); // Addition au lieu de soustraction
    } else if (operator === '÷' && game.currentOperation) {
      const { num1, num2 } = game.currentOperation;
      // Erreurs communes en division : inversion, multiples
      pushIf(num1); // Pas de division
      pushIf(num2); // Diviseur au lieu du quotient
      pushIf(correctResult * 2); // Double du quotient
    }

    // Erreurs communes (tous opérateurs) : ±10
    pushIf(correctResult + 10);
    pushIf(correctResult - 10);

    // Compléter avec des valeurs aléatoires proches
    while (answers.length < 4) {
      const rand =
        correctResult + (Math.random() < 0.5 ? -1 : 1) * (Math.floor(Math.random() * 5) + 3);
      pushIf(rand);
    }

    // Mélanger sauf la vraie réponse
    const correct = answers.shift();
    safeShuffleArray(answers);
    answers.splice(Math.floor(Math.random() * 4), 0, correct);
    return answers;
  },

  getPredefinedPositions() {
    return [
      { x: 8, y: 13 },
      { x: 14, y: 10 },
      { x: 15, y: 13 },
      { x: 4, y: 7 },
      { x: 8, y: 4 },
      { x: 14, y: 4 },
      { x: 3, y: 1 },
      { x: 4, y: 4 },
      { x: 10, y: 10 },
      { x: 16, y: 7 },
      { x: 2, y: 10 },
      { x: 7, y: 7 },
      { x: 5, y: 10 },
      { x: 10, y: 13 },
      { x: 12, y: 4 },
      { x: 6, y: 4 },
      { x: 12, y: 7 },
      { x: 5, y: 13 },
      { x: 17, y: 4 },
      { x: 17, y: 10 },
      { x: 1, y: 4 },
      { x: 1, y: 7 },
      { x: 1, y: 10 },
      { x: 1, y: 13 },
    ];
  },

  getValidPositions(game, multimiamX, multimiamY) {
    const positions = this.getPredefinedPositions();
    safeShuffleArray(positions);
    return positions.filter(p => {
      const isFree = isFreeLabyrinthCell(game.labyrinth, p.x, p.y);
      return (
        isFree &&
        !(p.x === multimiamX && p.y === multimiamY) &&
        !(p.x === multimiamX + 1 && p.y === multimiamY)
      );
    });
  },

  addFallbackPosition(valids, game, multimiamX, multimiamY) {
    if (valids.length > 0) return valids;

    console.warn(
      'Aucune position valide trouvée pour placer les réponses parmi la liste prédéfinie. Tentative avec la position de secours (9, 7).'
    );

    const fallbackX = 9;
    const fallbackY = 7;

    if (
      isFreeLabyrinthCell(game.labyrinth, fallbackX, fallbackY) &&
      !(fallbackX === multimiamX && fallbackY === multimiamY) &&
      !(fallbackX === multimiamX + 1 && fallbackY === multimiamY)
    ) {
      valids.push({ x: fallbackX, y: fallbackY });
    } else {
      console.error('Position de secours invalide ou occupée.');
    }

    return valids;
  },

  placeCorrectAnswer(game, correct, valids) {
    if (valids.length === 0) {
      console.error('Impossible de placer la bonne réponse, aucune position valide trouvée.');
      return valids;
    }

    const correctPos = valids.shift();
    game.answerPositions.push({
      x: correctPos.x,
      y: correctPos.y,
      value: correct.value,
      isCorrect: true,
    });
    game.labyrinth[correctPos.y][correctPos.x] = 3;
    return valids;
  },

  placeIncorrectAnswers(game, valids) {
    const incorrect = game.answers.filter(a => !a.isCorrect);
    safeShuffleArray(incorrect);
    const max = Math.min(3, incorrect.length, valids.length);

    for (let i = 0; i < max; i++) {
      const pos = valids.shift();
      game.answerPositions.push({
        x: pos.x,
        y: pos.y,
        value: incorrect[i].value,
        isCorrect: false,
      });
      game.labyrinth[pos.y][pos.x] = 3;
    }
  },

  placeAnswers(game, multimiamX = -1, multimiamY = -1) {
    game.answerPositions = [];
    clearAnswerCells(game);

    const correct = game.answers.find(a => a.isCorrect);
    if (!correct) return;

    let valids = this.getValidPositions(game, multimiamX, multimiamY);
    valids = this.addFallbackPosition(valids, game, multimiamX, multimiamY);
    valids = this.placeCorrectAnswer(game, correct, valids);
    this.placeIncorrectAnswers(game, valids);
  },
};

export default PacmanQuestions;

function clearAnswerCells(game) {
  for (let y = 0; y < game.rows; y++) {
    for (let x = 0; x < game.cols; x++) {
      if (game.labyrinth[y][x] === 3) game.labyrinth[y][x] = 0;
    }
  }
}
