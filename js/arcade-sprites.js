/* =====================
   Images des jeux d'Arcade : chargées à la taille où elles s'affichent
   - Une image se demande à sa taille à l'écran (taille dans le jeu × échelle d'affichage du
     canevas × densité de l'écran) : la variante WebP juste au-dessus se charge
     (js/arcade-sprite-catalog.js). Quand la partie grandit (plein écran, téléphone tourné),
     la variante suivante se charge et l'image en place reste dessinée en attendant.
   - Sans variantes (développement, CI), les petits PNG du dépôt prennent le relais.
   - Le dessin garde les proportions de l'image : « contain » (personnages, monstres,
     fusées), « cover » (textures rognées à leur case), « fill » (morceaux du serpent, qui
     doivent se raccorder d'une case à l'autre).
   ===================== */

import { variantUrl, fallbackUrl, variantWidth } from './arcade-sprite-catalog.js';
import { getCanvasDisplayScale, arcadePixelRatio } from './arcade-common.js';

/**
 * Pixels de l'écran par unité du jeu sur ce canevas (densité plafonnée comme celle des
 * canevas, js/arcade-common.js).
 * @param {HTMLCanvasElement} canvas
 * @returns {number}
 */
export function devicePixelsPerUnit(canvas) {
  return getCanvasDisplayScale(canvas) * arcadePixelRatio();
}

/** Une image d'Arcade : la meilleure variante chargée, et la suivante si besoin */
export class ArcadeSprite {
  /** @param {import('./arcade-sprite-catalog.js').SpriteSpec} spec */
  constructor(spec) {
    this.spec = spec;
    this.facing = spec.facing;
    this.current = null;
    // Plus grande variante demandée : jamais redemandée, jamais en dessous
    this.requested = 0;
    // -1 tant que les variantes répondent ; sinon rang du petit PNG essayé
    this.fallbackIndex = -1;
  }

  /** @returns {HTMLImageElement|null} Image prête à dessiner */
  get image() {
    return this.current;
  }

  /** @returns {number} Hauteur / largeur de l'image (1 avant son chargement) */
  get aspect() {
    const image = this.current;
    return image?.naturalWidth ? image.naturalHeight / image.naturalWidth : 1;
  }

  /**
   * Demande une variante au moins aussi grande que la taille à l'écran.
   * @param {number} needWidth - Pixels de l'écran
   * @param {number} needHeight - Pixels de l'écran
   */
  request(needWidth, needHeight) {
    if (this.fallbackIndex >= 0) return;
    const width = variantWidth(this.spec.maxWidth, needWidth, needHeight, this.aspect);
    if (width <= this.requested) return;
    this.requested = width;
    this.load(variantUrl(this.spec.source, width), () => this.variantFailed());
  }

  load(url, onError) {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => this.adopt(image);
    image.onerror = onError;
    image.src = url;
  }

  adopt(image) {
    // Une variante plus petite arrivée après une plus grande ne la remplace pas
    if (this.current && image.naturalWidth < this.current.naturalWidth) return;
    this.current = image;
  }

  // Variante absente : l'image déjà affichée reste ; sans image, les petits PNG
  variantFailed() {
    if (!this.current) this.nextFallback();
  }

  nextFallback() {
    this.fallbackIndex += 1;
    const file = this.spec.fallbacks.at(this.fallbackIndex);
    if (file) this.load(fallbackUrl(file), () => this.nextFallback());
  }
}

// Une image par source, partagée par les jeux et gardée d'une partie à l'autre
const sprites = new Map();

/**
 * @param {import('./arcade-sprite-catalog.js').SpriteSpec} spec
 * @returns {ArcadeSprite}
 */
export function spriteFor(spec) {
  let sprite = sprites.get(spec.source);
  if (!sprite) {
    sprite = new ArcadeSprite(spec);
    sprites.set(spec.source, sprite);
  }
  return sprite;
}

/**
 * Rectangle de l'image entière dans sa case, centré.
 * @param {'contain'|'cover'|'fill'} fit
 * @param {{x: number, y: number, width: number, height: number}} box
 * @param {number} aspect - Hauteur / largeur de l'image
 * @returns {{x: number, y: number, width: number, height: number}}
 */
export function fitRect(fit, box, aspect) {
  if (fit === 'fill') return { x: box.x, y: box.y, width: box.width, height: box.height };
  const taller = aspect > box.height / box.width;
  // contain : le côté qui touche la case ; cover : l'autre
  const byHeight = fit === 'cover' ? !taller : taller;
  const width = byHeight ? box.height / aspect : box.width;
  const height = byHeight ? box.height : box.width * aspect;
  return {
    x: box.x + (box.width - width) / 2,
    y: box.y + (box.height - height) / 2,
    width,
    height,
  };
}

/**
 * Charge à l'avance une image à la taille où elle sera dessinée (prochaine vague, ami caché).
 * @param {HTMLCanvasElement} canvas
 * @param {ArcadeSprite} sprite
 * @param {number} width - Taille de sa case dans le jeu
 * @param {number} height
 */
export function prefetchArcadeSprite(canvas, sprite, width, height) {
  const scale = devicePixelsPerUnit(canvas);
  sprite?.request?.(width * scale, height * scale);
}

function paintMirrored(ctx, image, rect) {
  ctx.save();
  ctx.translate(rect.x + rect.width, rect.y);
  ctx.scale(-1, 1);
  ctx.drawImage(image, 0, 0, rect.width, rect.height);
  ctx.restore();
}

function paintClipped(ctx, image, rect, box) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(box.x, box.y, box.width, box.height);
  ctx.clip();
  ctx.drawImage(image, rect.x, rect.y, rect.width, rect.height);
  ctx.restore();
}

/**
 * Dessine une image d'Arcade dans sa case, à ses proportions, après avoir demandé la
 * variante qui correspond à sa taille à l'écran.
 * @param {CanvasRenderingContext2D} ctx
 * @param {ArcadeSprite} sprite
 * @param {{x: number, y: number, width: number, height: number}} box - Case, unités du jeu
 * @param {{fit?: 'contain'|'cover'|'fill', facing?: 'left'|'right'}} [options]
 *   facing : côté vers lequel l'image doit regarder (retournée si sa source regarde ailleurs)
 * @returns {boolean} false si l'image n'est pas encore là (le jeu dessine sa forme de repli)
 */
export function drawArcadeSprite(ctx, sprite, box, { fit = 'contain', facing } = {}) {
  if (typeof sprite?.request !== 'function') return false;
  const rect = fitRect(fit, box, sprite.aspect);
  const scale = devicePixelsPerUnit(ctx.canvas);
  sprite.request(rect.width * scale, rect.height * scale);
  const image = sprite.image;
  if (!image) return false;
  if (fit === 'cover') paintClipped(ctx, image, rect, box);
  else if (facing && facing !== sprite.facing) paintMirrored(ctx, image, rect);
  else ctx.drawImage(image, rect.x, rect.y, rect.width, rect.height);
  return true;
}
