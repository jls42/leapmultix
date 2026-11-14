/**
 * Habits du serpent de MultiSnake : ses couleurs, ses taches et ce qu'il porte, pour chaque
 * fête qui costume le serpent (famille « snake » de js/core/seasons.js). Les couleurs viennent
 * des dessins validés de chaque fête : vert et ventre jaune, violet et orange (Halloween),
 * rouge et or avec un bonnet (Noël), violet et or avec un chapeau pointu (Nouvel An) ; au
 * Nouvel An chinois, il devient un dragon de la danse.
 */

/**
 * @typedef {object} SnakeSkin
 * @property {'snake'|'dragon'} kind - Serpent, ou dragon (cornes, crinière, pattes, crête)
 * @property {string} outline - Contour
 * @property {string} shade - Bord du corps, dans l'ombre
 * @property {string} back - Dos
 * @property {string} shine - Reflet le long du dos
 * @property {string} spots - Taches du dos
 * @property {string} [trim] - Dorures du dragon (crête, franges, cornes, moustaches)
 * @property {'santa'|'party'|null} hat - Chapeau sur la tête
 */

/** @type {Readonly<SnakeSkin>} */
const CLASSIC = Object.freeze({
  kind: 'snake',
  outline: '#0b3b1c',
  shade: '#0c6e30',
  back: '#1ba234',
  shine: '#7fdc5a',
  spots: '#c9d84b',
  hat: null,
});

/** @type {ReadonlyMap<string, Readonly<SnakeSkin>>} */
const SKINS = new Map([
  [
    'halloween',
    Object.freeze({
      kind: 'snake',
      outline: '#2d0730',
      shade: '#650e4f',
      back: '#9717a4',
      shine: '#c46ae0',
      spots: '#f08c2e',
      hat: null,
    }),
  ],
  [
    'christmas',
    Object.freeze({
      kind: 'snake',
      outline: '#3a0d06',
      shade: '#6a2409',
      back: '#c42731',
      shine: '#f0705f',
      spots: '#f2c230',
      hat: 'santa',
    }),
  ],
  [
    'newyear',
    Object.freeze({
      kind: 'snake',
      outline: '#22073a',
      shade: '#4a0b70',
      back: '#6c22b8',
      shine: '#a77df0',
      spots: '#f2c230',
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
