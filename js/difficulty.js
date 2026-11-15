// difficulty.js - Gestion centralisée des niveaux de difficulté (LeapMultix)
// Ce module fournit les paramètres pour chaque niveau, selon le plan validé.
// Toute modification doit être justifiée et documentée.
//
// Les nombres des questions suivent le niveau dans les quatre opérations : les tables en ×
// (tables), les plages facile, moyenne et difficile des opérations en +, − et ÷
// (questionDifficulty, lue par generateQuestion). Le niveau moyen garde les plages moyennes,
// celles de tous les niveaux avant octobre 2026.
//
// Rythme de l'Arcade : une vague de MultiInvaders met waveSeconds à descendre jusqu'à la
// fusée, sur tous les écrans ; le serpent de MultiSnake avance d'une case toutes les
// snakeStepMs au départ (sur ordinateur). Les monstres de MultiMiam suivent le niveau dans
// js/multimiam-engine.js (ghostsOfLevel).

const DIFFICULTY_SETTINGS = {
  debutant: {
    label: 'Débutant',
    timeSeconds: 120, // 2 min
    penalty: 50,
    waveSeconds: 60,
    snakeStepMs: 500,
    tables: [2, 3, 4, 5],
    questionDifficulty: 'easy',
    distractorDistance: 'far',
    pairs: 4,
  },
  moyen: {
    label: 'Moyen',
    timeSeconds: 180, // 3 min
    penalty: 75,
    waveSeconds: 40,
    snakeStepMs: 400,
    tables: [2, 3, 4, 5, 6, 7, 8],
    questionDifficulty: 'medium',
    distractorDistance: 'medium',
    pairs: 6,
  },
  difficile: {
    label: 'Difficile',
    timeSeconds: 300, // 5 min
    penalty: 100,
    waveSeconds: 25,
    snakeStepMs: 320,
    tables: [2, 3, 4, 5, 6, 7, 8, 9, 10], // pondération à gérer plus tard
    questionDifficulty: 'hard',
    distractorDistance: 'close',
    pairs: 8,
  },
};

/**
 * Nom d'un niveau, alias compris : 'debutant', 'moyen' ou 'difficile' (Moyen si inconnu)
 * @param {string} level - 'debutant'/'facile'/'easy', 'moyen'/'medium', 'difficile'/'hard'
 * @returns {'debutant'|'moyen'|'difficile'}
 */
function difficultyKey(level) {
  const lvl = String(level ?? '')
    .toLowerCase()
    .trim();
  if (['debutant', 'facile', 'easy'].includes(lvl)) return 'debutant';
  if (['difficile', 'hard'].includes(lvl)) return 'difficile';
  return 'moyen';
}

/**
 * Récupère les paramètres pour un niveau donné, avec alias supportés.
 * @param {string} level - 'debutant'/'facile'/'easy', 'moyen'/'medium', 'difficile'/'hard'
 * @returns {object} Paramètres du niveau
 */
function getDifficultySettings(level) {
  return DIFFICULTY_SETTINGS[difficultyKey(level)];
}

export { difficultyKey, getDifficultySettings, DIFFICULTY_SETTINGS };
