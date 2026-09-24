/**
 * Source unique d'aléa du jeu.
 *
 * Aucun tirage du jeu n'est sensible : on mélange des cartes, on choisit une
 * question ou la direction d'un fantôme. Tout passe pourtant par Web Crypto,
 * pour des raisons de maintenance :
 * - un seul endroit à relire, au lieu d'un appel à Math.random par module ;
 * - des mélanges de Fisher-Yates, là où `sort(() => Math.random() - 0.5)`
 *   sortait certaines permutations bien plus souvent que d'autres ;
 * - plus aucun point de sécurité à justifier ligne par ligne (règle S2245).
 *
 * ESLint refuse tout nouvel appel à Math.random dans js/. crypto.getRandomValues
 * existe dans tous les navigateurs capables de charger des modules ES, ainsi que
 * dans Node et jsdom.
 */

const word = new Uint32Array(1);

/**
 * Réel dans [0, 1), comme Math.random.
 * @returns {number}
 */
export function randomFloat() {
  globalThis.crypto.getRandomValues(word);
  return word[0] / 2 ** 32;
}

/**
 * Entier dans [min, max], bornes comprises.
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomInt(min, max) {
  return min + Math.floor(randomFloat() * (max - min + 1));
}

/**
 * Vrai avec la probabilité donnée.
 * @param {number} probability - De 0 (jamais) à 1 (toujours)
 * @returns {boolean}
 */
export function chance(probability) {
  return randomFloat() < probability;
}

/**
 * Élément tiré au sort ; undefined si la liste est vide.
 * @template T
 * @param {ArrayLike<T>} items
 * @returns {T | undefined}
 */
export function pickRandom(items) {
  return items[Math.floor(randomFloat() * items.length)];
}

/**
 * Mélange de Fisher-Yates, en place.
 * @template T
 * @param {T[]} items
 * @returns {T[]} Le tableau reçu, mélangé
 */
export function shuffleInPlace(items) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
