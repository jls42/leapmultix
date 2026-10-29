/**
 * Logos dessinés des modes de jeu (cartes de l'accueil, index.html) et des jeux d'Arcade (menu
 * de l'Arcade), repris par les rangées du tableau de bord. Pendant une fête qui les costume
 * (famille « logos » de js/core/seasons.js), leurs variantes sont celles du logo costumé
 * (« logo_mode_defi_halloween-256.webp ») ; le PNG classique reste le repli, gardé hors ligne,
 * et le service worker sert la variante classique à la place d'une variante de fête jamais
 * gardée.
 */
import { webpImage } from './webp-images.js';
import { costumed } from './core/seasons.js';

/** Logo de chaque mode (data-mode des cartes de l'accueil), dans assets/images/arcade */
export const MODE_LOGOS = new Map([
  ['discovery', 'logo_mode_decouverte.png'],
  ['quiz', 'logo_mode_quizz.png'],
  ['challenge', 'logo_mode_defi.png'],
  ['adventure', 'logo_mode_aventure.png'],
  ['chrono', 'logo_mode_chrono.png'],
  ['arcade', 'logo_mode_arcade.png'],
]);
/** Logos des quatre jeux d'Arcade */
export const ARCADE_LOGOS = Object.freeze([
  'logo_multiinvaders.png',
  'logo_multimiam.png',
  'logo_multimemory.png',
  'logo_multisnake.png',
]);
const LOGO_FILES = new Set([...MODE_LOGOS.values(), ...ARCADE_LOGOS]);

/**
 * Source des variantes d'un logo, costumée pendant une fête si c'est un logo de mode ou de jeu
 * (« logo_mode_defi.png » → « logo_mode_defi_halloween ») ; toute autre image reste classique
 * @param {string} file - PNG du dépôt
 * @returns {string}
 */
export function logoSource(file) {
  const source = file.replace(/\.png$/, '');
  return LOGO_FILES.has(file) ? costumed(source, 'logos') : source;
}

/**
 * Repose les logos des cartes de l'accueil quand le costume change (thème de fête appliqué ou
 * retiré), à la taille que leur donne index.html : srcset, sizes et src réécrits ensemble
 * (avec un srcset, changer le seul src ne change pas l'image affichée). Le menu de l'Arcade et
 * le tableau de bord, construits à chaque ouverture, prennent le costume seuls.
 * @param {ParentNode} [root]
 */
export function repaintModeLogos(root = document) {
  for (const img of root.querySelectorAll('.mode-btn[data-mode] .mode-icon img')) {
    const file = MODE_LOGOS.get(img.closest('.mode-btn').dataset.mode);
    if (!file) continue;
    const sizes = img.getAttribute('sizes') ?? '';
    const { srcset, src } = webpImage(
      file,
      { widths: [128, 256, 512], src: 256, sizes },
      logoSource(file)
    );
    img.setAttribute('srcset', srcset);
    img.setAttribute('sizes', sizes);
    img.setAttribute('src', src);
  }
}
