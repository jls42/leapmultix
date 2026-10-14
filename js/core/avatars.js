/**
 * Avatars du jeu, sans dépendance : le jeu (têtes, vidéo d'accueil) et le corpus de la voix
 * enregistrée (scripts/voice/corpus.mjs, lancé sous Node) lisent la même liste.
 */

/** La liste blanche des identifiants (une adresse ne se compose qu'avec eux) */
export const AVATAR_IDS = Object.freeze(['fox', 'panda', 'unicorn', 'dragon', 'astronaut']);

/**
 * Clé du message d'accueil d'une mascotte, affiché et dit à l'ouverture de sa vidéo
 * @param {string} avatar - Identifiant de AVATAR_IDS
 * @returns {string}
 */
export const welcomeMessageKey = avatar => `character_intro_${avatar}`;
