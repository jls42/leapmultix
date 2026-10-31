/**
 * Cadeaux du mode Aventure : le trésor fermé de la scène, ouvert à la victoire et sur l'écran des
 * résultats. Pendant une fête qui les costume (famille « gifts » de js/core/seasons.js), leurs
 * variantes sont celles du cadeau costumé (« cadeau_ferme_halloween-128.webp ») ; le PNG classique
 * reste le repli, et le service worker sert la variante classique à la place d'une variante de
 * fête jamais gardée.
 */
import { costumed } from './core/seasons.js';

/** Les deux cadeaux, dans assets/images/arcade */
export const GIFT_FILES = Object.freeze(['cadeau_ferme.png', 'cadeau_ouvert.png']);

/**
 * Source des variantes d'un cadeau, costumée pendant une fête
 * (« cadeau_ferme.png » → « cadeau_ferme_halloween »)
 * @param {string} file - PNG du dépôt
 * @returns {string}
 */
export function giftSource(file) {
  return costumed(file.replace(/\.png$/, ''), 'gifts');
}
