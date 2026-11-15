/**
 * Ce que l'Arcade retient d'une partie pour la suite de l'apprentissage : chaque réponse va
 * dans les statistiques du calcul et, en multiplication, dans la fenêtre « À revoir » de sa
 * table (tableau de bord, révision du Chrono) ; les calculs ratés sont montrés à l'écran de
 * fin ; les tables à revoir reviennent plus souvent au tirage. MultiMemory n'y passe pas :
 * une paire ratée est un oubli de place, pas une erreur de calcul.
 */
import { recordOperationResult } from './core/operation-stats.js';
import { recordReviewAnswer, weakTablesFrom } from './core/mode-stats.js';
import { UserState } from './core/userState.js';
import { noteArcadeMiss } from './arcade-session.js';

/**
 * Une réponse de la partie : `a` est la table du calcul, comme dans le Quiz
 * @param {string} operator
 * @param {number} a
 * @param {number} b
 * @param {boolean} isCorrect
 */
export function recordArcadeAnswer(operator, a, b, isCorrect) {
  recordOperationResult(operator, a, b, isCorrect);
  if (!isCorrect) noteArcadeMiss({ operator, a, b });
  try {
    const userData = UserState.getCurrentUserData();
    recordReviewAnswer(userData, { operator, table: a, isCorrect });
    UserState.updateUserData(userData);
  } catch {
    // Profil illisible : la fenêtre « À revoir » attendra, la partie continue
  }
}

// Résultat d'un calcul, selon l'opération
const RESULT_OF = new Map([
  ['+', (a, b) => a + b],
  ['−', (a, b) => a - b],
  ['÷', (a, b) => a / b],
  ['×', (a, b) => a * b],
]);

/**
 * Calcul complet, « 7 × 5 = 35 », sans retour à la ligne au milieu
 * @param {{operator: string, a: number, b: number}} calculation
 * @returns {string}
 */
export function solvedCalculation({ operator, a, b }) {
  const result = (RESULT_OF.get(operator) ?? RESULT_OF.get('×'))(a, b);
  return [a, operator, b, '=', result].join('\u00a0');
}

/**
 * Tables à revoir du joueur (« À revoir » du tableau de bord), favorisées au tirage
 * @returns {number[]}
 */
export function arcadeWeakTables() {
  try {
    return weakTablesFrom(UserState.getCurrentUserData()?.modeStats);
  } catch {
    // Profil illisible : tirage ordinaire
    return [];
  }
}

/**
 * Tables à favoriser au tirage d'une question : celles à revoir, en multiplication seulement
 * @param {string} operator
 * @returns {number[]}
 */
export function weakTablesFor(operator) {
  return operator === '×' ? arcadeWeakTables() : [];
}
