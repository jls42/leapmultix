/**
 * UI Utils : Génération d'options QCM et utilitaires UI
 * Note: InfoBar maintenant centralisé dans js/components/infoBar.js
 */

import { Utils } from './utils-es6.js';

/**
 * Génère des options pour un QCM.
 * @param {any} correctAnswer
 * @param {function} wrongGenerator - renvoie une proposition incorrecte
 * @param {number} count - nombre total d'options
 * @param {number} maxAttempts
 * @returns {Array<any>}
 */
export function generateMCQOptions(correctAnswer, wrongGenerator, count = 4, maxAttempts = 50) {
  const options = [correctAnswer];
  let attempts = 0;
  while (options.length < count && attempts < maxAttempts) {
    const wrong = wrongGenerator();
    if (wrong !== correctAnswer && !options.includes(wrong)) {
      options.push(wrong);
    }
    attempts++;
  }
  // Utiliser shuffleArray depuis le module core
  return Utils.shuffleArray(options);
}

// InfoBar : maintenant centralisé dans js/components/infoBar.js
// Les exports window.createInfoBarHTML sont maintenus pour compatibilité rétrograde
