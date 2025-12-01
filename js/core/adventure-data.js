/**
 * Données des niveaux d'aventure pour toutes les opérations
 * Utilise une fonction génératrice pour éviter la duplication de code
 */

// Configuration des images par niveau (alternance forêt/rivière)
const LEVEL_IMAGES = [
  'forest.png',
  'river.png',
  'forest.png',
  'river.png',
  'forest.png',
  'river.png',
  'forest.png',
  'river.png',
  'forest.png',
  'river.png',
];

// Configuration de la progression des étoiles requises
const REQUIRED_STARS = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18];

// Configuration des difficultés pour les opérations non-multiplication
const DIFFICULTY_PROGRESSION = [
  'easy',
  'easy',
  'easy',
  'medium',
  'medium',
  'medium',
  'hard',
  'hard',
  'hard',
  'hard',
];

// Tables de multiplication dans l'ordre pédagogique
const MULTIPLICATION_TABLES = [1, 2, 5, 10, 3, 4, 6, 7, 8, 9];

/**
 * Génère les niveaux d'aventure pour une opération avec difficulté
 * @param {string} operationPrefix - Préfixe pour les clés de traduction (ex: 'addition', 'subtraction')
 * @returns {Array} Liste des niveaux
 */
function generateDifficultyLevels(operationPrefix) {
  return REQUIRED_STARS.map((stars, index) => ({
    id: index + 1,
    difficulty: DIFFICULTY_PROGRESSION[index],
    nameKey: `${operationPrefix}_level_${index + 1}_name`,
    descKey: `${operationPrefix}_level_${index + 1}_desc`,
    image: LEVEL_IMAGES[index],
    requiredStars: stars,
  }));
}

/**
 * Génère les niveaux d'aventure pour la multiplication (basé sur les tables)
 * @returns {Array} Liste des niveaux
 */
function generateMultiplicationLevels() {
  return MULTIPLICATION_TABLES.map((table, index) => ({
    id: index + 1,
    table,
    nameKey: `level_${index + 1}_name`,
    descKey: `level_${index + 1}_desc`,
    image: LEVEL_IMAGES[index],
    requiredStars: REQUIRED_STARS[index],
  }));
}

// Génération des niveaux pour chaque opération
export const ADVENTURE_LEVELS_MULTIPLICATION = generateMultiplicationLevels();
export const ADVENTURE_LEVELS_ADDITION = generateDifficultyLevels('addition');
export const ADVENTURE_LEVELS_SUBTRACTION = generateDifficultyLevels('subtraction');
export const ADVENTURE_LEVELS_DIVISION = generateDifficultyLevels('division');

// Export par défaut pour compatibilité (multiplication)
export const ADVENTURE_LEVELS = ADVENTURE_LEVELS_MULTIPLICATION;

/**
 * Récupère les niveaux d'aventure selon l'opération
 * @param {string} operator - Symbole de l'opération ('×', '+', '−', '÷')
 * @returns {Array} Liste des niveaux
 */
export function getAdventureLevelsByOperator(operator) {
  const levelsByOperator = {
    '+': ADVENTURE_LEVELS_ADDITION,
    '−': ADVENTURE_LEVELS_SUBTRACTION,
    '÷': ADVENTURE_LEVELS_DIVISION,
    '×': ADVENTURE_LEVELS_MULTIPLICATION,
  };
  return levelsByOperator[operator] || ADVENTURE_LEVELS_MULTIPLICATION;
}
