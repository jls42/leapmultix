/**
 * Illustrations des écrans (logos des modes et des jeux, cadeaux de l'Aventure, fusées à
 * choisir) servies en WebP à la taille où elles s'affichent × la densité de l'écran : le
 * navigateur choisit parmi les variantes de npm run assets:generate (srcset, sizes). Tant que
 * les variantes manquent (développement, CI), le PNG du dépôt prend le relais.
 */
import { createSafeElement } from './security-utils.js';

const GENERATED_DIR = 'assets/generated-images/arcade';
const SOURCE_DIR = 'assets/images/arcade';

/**
 * Attributs d'une illustration WebP, srcset et sizes avant src : le premier choix du
 * navigateur les voit
 * @param {string} file - PNG du dépôt (assets/images/arcade), le repli sans variantes
 * @param {{widths: number[], src: number, sizes: string}} image - Largeurs proposées, celle du
 *   src (navigateur sans srcset) et taille affichée
 * @param {string} [source] - Source des variantes, quand ce n'est pas ce PNG (fusées : source
 *   haute définition du catalogue des images d'Arcade)
 * @returns {{srcset: string, sizes: string, src: string, 'data-fallback': string}}
 */
export function webpImage(file, image, source = file.replace(/\.png$/, '')) {
  const url = width => `${GENERATED_DIR}/${source}-${width}.webp`;
  return {
    srcset: image.widths.map(width => `${url(width)} ${width}w`).join(', '),
    sizes: image.sizes,
    src: url(image.src),
    'data-fallback': `${SOURCE_DIR}/${file}`,
  };
}

/**
 * Les mêmes attributs, écrits dans un gabarit HTML
 * @param {string} file
 * @param {{widths: number[], src: number, sizes: string}} image
 * @param {string} [source]
 * @returns {string}
 */
export function webpImageAttributes(file, image, source) {
  return Object.entries(webpImage(file, image, source))
    .map(([name, value]) => `${name}="${value}"`)
    .join(' ');
}

/**
 * Sans sa variante, l'image passe au PNG du dépôt, une seule fois (un PNG en échec ne relance
 * rien) ; déjà en échec, tout de suite. Une image déjà passée à son PNG n'a plus de srcset.
 * @param {HTMLImageElement} img
 */
export function fallBackToPng(img) {
  if (!img.hasAttribute('srcset')) return;
  const useFallback = () => {
    img.removeAttribute('srcset');
    img.setAttribute('src', img.dataset.fallback);
  };
  if (img.complete && img.naturalWidth === 0) useFallback();
  else img.addEventListener('error', useFallback, { once: true });
}

/**
 * Le repli de chaque illustration WebP d'un écran : le nettoyage des gabarits retire les
 * attributs onerror, l'écouteur se pose une fois l'écran affiché
 * @param {ParentNode|null|undefined} root
 */
export function attachImageFallbacks(root) {
  for (const img of root?.querySelectorAll('img[data-fallback]') ?? []) fallBackToPng(img);
}

/**
 * Une illustration WebP prête à poser, décorative par défaut, son repli compris
 * @param {string} file - PNG du dépôt (assets/images/arcade)
 * @param {{widths: number[], src: number, sizes: string}} image
 * @param {Object<string, string>} [attributes] - Attributs du lieu (classe, taille, alt…)
 * @returns {HTMLImageElement}
 */
export function createWebpImage(file, image, attributes = {}) {
  const img = createSafeElement('img', '', { ...webpImage(file, image), alt: '', ...attributes });
  fallBackToPng(img);
  return img;
}
