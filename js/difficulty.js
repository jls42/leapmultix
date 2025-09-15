// difficulty.js - Gestion centralisée des niveaux de difficulté (LeapMultix)
// Ce module fournit les paramètres pour chaque niveau, selon le plan validé.
// Toute modification doit être justifiée et documentée.

const DIFFICULTY_SETTINGS = {
  debutant: {
    label: 'Débutant',
    timeSeconds: 120, // 2 min
    penalty: 50,
    enemySpeed: 1,
    tables: [2, 3, 4, 5],
    distractorDistance: 'far',
    pairs: 4,
  },
  moyen: {
    label: 'Moyen',
    timeSeconds: 180, // 3 min
    penalty: 75,
    enemySpeed: 1.3,
    tables: [2, 3, 4, 5, 6, 7, 8],
    distractorDistance: 'medium',
    pairs: 6,
  },
  difficile: {
    label: 'Difficile',
    timeSeconds: 300, // 5 min
    penalty: 100,
    enemySpeed: 1.6,
    tables: [2, 3, 4, 5, 6, 7, 8, 9, 10], // pondération à gérer plus tard
    distractorDistance: 'close',
    pairs: 8,
  },
};

/**
 * Récupère les paramètres pour un niveau donné, avec alias supportés.
 * @param {string} level - 'debutant'/'facile'/'easy', 'moyen'/'medium', 'difficile'/'hard'
 * @returns {object} Paramètres du niveau
 */
function getDifficultySettings(level) {
  const lvl = (level || '').toLowerCase().trim();
  let key;
  if (['debutant', 'facile', 'easy'].includes(lvl)) key = 'debutant';
  else if (['moyen', 'medium'].includes(lvl)) key = 'moyen';
  else if (['difficile', 'hard'].includes(lvl)) key = 'difficile';
  else key = 'moyen';

  return DIFFICULTY_SETTINGS[key];
}

export { getDifficultySettings, DIFFICULTY_SETTINGS };
