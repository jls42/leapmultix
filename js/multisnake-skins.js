/**
 * Habits du serpent de MultiSnake : ses couleurs, ses taches et ce qu'il porte, pour chaque
 * fête qui costume le serpent (famille « snake » de js/core/seasons.js). Le corps prolonge la
 * capuche de sa tête (assets/images/arcade/<avatar>_snake_head[_<fête>].png) : dos de la
 * couleur du tissu, bords de celle du ventre, taches de celle des losanges. Vert et jaune,
 * violet et orange (Halloween), rouge et or (Noël), violet et or (Nouvel An) ; au Nouvel An
 * chinois, un dragon de la danse. Le chapeau ne sert qu'à la tête dessinée, en attendant
 * l'image.
 */

/**
 * @typedef {object} SnakeSkin
 * @property {'snake'|'dragon'} kind - Serpent, ou dragon (cornes, crinière, pattes, crête)
 * @property {string} outline - Contour
 * @property {string} shade - Bord du corps (le ventre de la capuche)
 * @property {string} back - Dos
 * @property {string} shine - Reflet le long du dos
 * @property {string} spots - Taches du dos (les losanges de la capuche)
 * @property {string} [trim] - Dorures du dragon (crête, franges, cornes, moustaches)
 * @property {'santa'|'party'|null} hat - Chapeau sur la tête
 */

/** @type {Readonly<SnakeSkin>} */
const CLASSIC = Object.freeze({
  kind: 'snake',
  outline: '#3c5410',
  shade: '#e2be3a',
  back: '#8fd014',
  shine: '#cdf27a',
  spots: '#2d6a1a',
  hat: null,
});

/** @type {ReadonlyMap<string, Readonly<SnakeSkin>>} */
const SKINS = new Map([
  [
    'halloween',
    Object.freeze({
      kind: 'snake',
      outline: '#3d0a40',
      shade: '#f58a12',
      back: '#b218d8',
      shine: '#d77df0',
      spots: '#5e0786',
      hat: null,
    }),
  ],
  [
    'christmas',
    Object.freeze({
      kind: 'snake',
      outline: '#4a1208',
      shade: '#f5b03a',
      back: '#e01e22',
      shine: '#ff7a6a',
      spots: '#8a0f14',
      hat: 'santa',
    }),
  ],
  [
    'newyear',
    Object.freeze({
      kind: 'snake',
      outline: '#22073a',
      shade: '#f2c230',
      back: '#6c22b8',
      shine: '#a77df0',
      spots: '#3a0a6a',
      hat: 'party',
    }),
  ],
  [
    'lunarnewyear',
    Object.freeze({
      kind: 'dragon',
      outline: '#3a0d06',
      shade: '#e0a21c',
      back: '#d23a2a',
      shine: '#ff8a6a',
      spots: '#f5c537',
      trim: '#f5c537',
      hat: null,
    }),
  ],
]);

/**
 * Habit du serpent pour une fête (null ou une fête sans habit : le serpent vert)
 * @param {string|null} seasonId
 * @returns {Readonly<SnakeSkin>}
 */
export function snakeSkin(seasonId) {
  return SKINS.get(seasonId ?? '') ?? CLASSIC;
}

/** Fêtes qui ont un habit de serpent */
export const SKINNED_SEASONS = Object.freeze([...SKINS.keys()]);
