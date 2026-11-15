/**
 * Contour du dessin d'une image d'Arcade, sans ses marges transparentes : les personnages se
 * calent dessus (monstres de MultiPop au bord de leur trou, gardien de MultiGoal dans sa
 * cage), quelle que soit la marge laissée autour de leur dessin.
 */

const FULL_IMAGE = Object.freeze({ x: 0, y: 0, width: 1, height: 1 });
// Largeur de la copie réduite où le contour du dessin est cherché
const SCAN_WIDTH = 64;
// Opacité à partir de laquelle un point fait partie du dessin (sur 255)
const ALPHA_MIN = 16;
// Contour du dessin de chaque image, cherché une seule fois
const boundsBySprite = new WeakMap();

/**
 * Contour des points visibles d'une image, en parts de sa largeur et de sa hauteur
 * @param {Uint8ClampedArray} data - points RGBA, ligne par ligne
 * @param {number} width
 * @param {number} height
 * @returns {{x: number, y: number, width: number, height: number}|null} null : image vide
 */
export function alphaBounds(data, width, height) {
  let left = width;
  let right = -1;
  let top = height;
  let bottom = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data.at((y * width + x) * 4 + 3) < ALPHA_MIN) continue;
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
  }
  if (right < 0) return null;
  return {
    x: left / width,
    y: top / height,
    width: (right - left + 1) / width,
    height: (bottom - top + 1) / height,
  };
}

function measureBounds(image) {
  try {
    const height = Math.max(1, Math.round((SCAN_WIDTH * image.naturalHeight) / image.naturalWidth));
    const canvas = document.createElement('canvas');
    canvas.width = SCAN_WIDTH;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(image, 0, 0, SCAN_WIDTH, height);
    const { data } = ctx.getImageData(0, 0, SCAN_WIDTH, height);
    return alphaBounds(data, SCAN_WIDTH, height) ?? FULL_IMAGE;
  } catch {
    // Points de l'image illisibles (pas de canevas) : l'image entière sert de contour
    return FULL_IMAGE;
  }
}

/**
 * Contour du dessin d'une image chargée, sans ses marges transparentes (cherché une seule fois)
 * @param {{image: HTMLImageElement}} sprite - image d'Arcade chargée (js/arcade-sprites.js)
 * @returns {{x: number, y: number, width: number, height: number}} en parts de l'image
 */
export function contentBounds(sprite) {
  let bounds = boundsBySprite.get(sprite);
  if (!bounds) {
    bounds = measureBounds(sprite.image);
    boundsBySprite.set(sprite, bounds);
  }
  return bounds;
}
