/**
 * Têtes des avatars, partout où le jeu en montre une : « Qui joue ? » (tuiles, formulaire
 * « Nouveau joueur », corbeille), mascotte de l'accueil, Personnalisation (avatar actuel,
 * choix, boutique), tableau de bord, carte de l'Aventure, astuce de la Découverte et écrans
 * de fin. Servies en WebP de 128, 256 et 512 px, tirés de leur source de 1024 px
 * (assets/images/arcade/<id>_head_avatar.png, npm run assets:generate) : le navigateur prend
 * la plus petite qui couvre la taille affichée × la densité de l'écran (js/webp-images.js).
 * Le PNG de 128 px du dépôt reste le repli.
 * Une seule aide pose une tête : setAvatarHead sur une image, avatarHeadAttributes dans un
 * gabarit. Avec un srcset, changer le seul src ne change plus l'image affichée : tout est
 * réécrit à chaque fois.
 */
import { webpImage, webpImageAttributes } from './webp-images.js';

/** Avatars du jeu : la liste blanche des identifiants (une adresse ne se compose qu'avec eux) */
export const AVATAR_IDS = Object.freeze(['fox', 'panda', 'unicorn', 'dragon', 'astronaut']);
const KNOWN_AVATARS = new Set(AVATAR_IDS);
export const DEFAULT_AVATAR = 'fox';
// Anciennes valeurs françaises encore présentes dans certains profils enregistrés
const AVATAR_ALIASES = new Map([
  ['renard', 'fox'],
  ['licorne', 'unicorn'],
  ['astronaute', 'astronaut'],
]);

/**
 * Identifiant actuel d'un ancien nom français ; toute autre valeur, telle quelle
 * @param {string} [avatarId]
 * @returns {string|undefined}
 */
export function resolveAvatarAlias(avatarId) {
  return AVATAR_ALIASES.get(avatarId) || avatarId;
}

/**
 * Ramène un identifiant d'avatar (éventuellement ancien ou inconnu) à un avatar connu.
 * @param {string} [avatarId]
 * @returns {string} Identifiant de la liste AVATAR_IDS (renard par défaut)
 */
export function normalizeAvatarId(avatarId) {
  const resolved = resolveAvatarAlias(avatarId);
  return KNOWN_AVATARS.has(resolved) ? resolved : DEFAULT_AVATAR;
}

/**
 * Taille affichée de la tête à chaque endroit (règle CSS citée), téléphone compris
 */
export const HEAD_SIZES = Object.freeze({
  // css/users.css .user-tile-face
  tile: '72px',
  // css/users.css .trash-entry-face
  trash: '40px',
  // css/home.css .creation-avatar-selector .avatar-btn img : 56 px au plus (48 sur un écran
  // large mais court, moins sur un téléphone étroit : la même variante)
  creation: '56px',
  // css/home.css .mascot-image
  mascot: '(max-width: 599px) 56px, 72px',
  // css/theme-selector.css .current-avatar img
  current: '56px',
  // css/theme-selector.css #slide6 .avatar-btn img : choix et boutique
  choice: '(max-width: 480px) 56px, 72px',
  // css/progress-dashboard.css .dashboard-header .avatar-display
  dashboard: '(max-width: 600px) 72px, 88px',
  // css/adventure.css .adventure-avatar
  adventureMap: '(max-width: 480px) 72px, 88px',
  // css/game.css .results-avatar
  results: '96px',
  // css/discovery-mode.css .mnemonic-mascot
  discovery: '3.5rem',
});

// 96 px en densité 3 : 288 pixels, couverts par la variante de 512
const HEAD_WIDTHS = [128, 256, 512];

/**
 * Arguments de js/webp-images.js pour une tête : PNG de 128 px du dépôt en repli, variantes
 * de la source de 1024 px. Le nom du PNG reste écrit en entier : scripts/precache-list.mjs
 * le trouve dans le code.
 * @param {string} [avatarId]
 * @param {string} sizes
 * @returns {[string, {widths: number[], src: number, sizes: string}, string]}
 */
function headImage(avatarId, sizes) {
  const id = normalizeAvatarId(avatarId);
  return [
    `${id}_head_avatar_128x128.png`,
    { widths: HEAD_WIDTHS, src: 128, sizes },
    `${id}_head_avatar`,
  ];
}

/**
 * Attributs de la tête d'un avatar : srcset, sizes, src (WebP de 128 px) et data-fallback
 * @param {string} [avatarId] - Filtré par la liste blanche (renard sinon)
 * @param {string} sizes - Taille affichée (HEAD_SIZES)
 * @returns {Object<string, string>}
 */
export function avatarHeadImage(avatarId, sizes) {
  return webpImage(...headImage(avatarId, sizes));
}

/**
 * Les mêmes attributs, écrits dans un gabarit HTML : l'écran pose ensuite les replis
 * (attachImageFallbacks), le nettoyage des gabarits retirant onerror
 * @param {string} [avatarId]
 * @param {string} sizes
 * @returns {string}
 */
export function avatarHeadAttributes(avatarId, sizes) {
  return webpImageAttributes(...headImage(avatarId, sizes));
}

/** Repli armé par setAvatarHead sur chaque image : un seul, même après plusieurs têtes */
const armedFallbacks = new WeakMap();

/**
 * Sans sa variante, l'image passe au PNG de la tête qu'elle porte, une fois
 * @param {HTMLImageElement} img
 */
function armFallback(img) {
  img.removeEventListener('error', armedFallbacks.get(img));
  const useFallback = () => {
    armedFallbacks.delete(img);
    img.removeAttribute('srcset');
    img.setAttribute('src', img.dataset.fallback);
  };
  armedFallbacks.set(img, useFallback);
  img.addEventListener('error', useFallback, { once: true });
}

/**
 * Pose la tête d'un avatar sur une image, ou la change : srcset, sizes, src et repli sont
 * tous réécrits, dans cet ordre (le premier choix du navigateur voit le srcset)
 * @param {HTMLImageElement|null|undefined} img
 * @param {string} [avatarId] - Filtré par la liste blanche (renard sinon)
 * @param {string} sizes - Taille affichée (HEAD_SIZES)
 */
export function setAvatarHead(img, avatarId, sizes) {
  if (!img) return;
  for (const [name, value] of Object.entries(avatarHeadImage(avatarId, sizes))) {
    img.setAttribute(name, value);
  }
  armFallback(img);
}
