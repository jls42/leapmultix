/* =====================
   Catalogue des images des jeux d'Arcade
   - Chaque image dessinée vient d'une source haute définition d'assets/images/arcade
     (1024 px pour la plupart), dont scripts/generate-responsive-assets.cjs produit des
     variantes WebP de 64 à 1024 px de large : assets/generated-images/arcade/<source>-<l>.webp.
   - Les adresses se construisent ici, sans attendre image-map.json : une image demandée au
     lancement d'un jeu a déjà sa bonne variante.
   - Repli : le petit PNG du dépôt (assets/images/arcade), quand les variantes manquent
     (développement, CI). Jamais la source de 1,5 Mo, sauf l'herbe qui n'a rien d'autre.
   - Module sans DOM : scripts/precache-list.mjs le lit pour la liste hors ligne, et
     tests-esm/scripts/arcade-variants.test.mjs vérifie que chaque taille est générée.
   ===================== */

/** Largeurs des variantes produites par le générateur */
export const VARIANT_WIDTHS = Object.freeze([64, 128, 256, 512, 1024]);
/** Variante de chaque image gardée par le service worker pour jouer hors ligne */
export const OFFLINE_VARIANT_WIDTH = 128;

const GENERATED_DIR = 'assets/generated-images/arcade';
const IMAGE_DIR = 'assets/images/arcade';
// Sources haute définition (1024 px) : toutes les variantes ; morceaux du serpent : 256 au
// plus (sources de 368 à 558 px, dessinés à la taille d'une case)
const HD_MAX_WIDTH = 1024;
const SNAKE_MAX_WIDTH = 256;

/**
 * Description d'une image d'Arcade.
 * @typedef {Object} SpriteSpec
 * @property {string} source - Nom de la source haute définition, sans extension
 * @property {number} maxWidth - Plus grande variante produite pour cette source
 * @property {string[]} fallbacks - Petits PNG du dépôt, essayés dans l'ordre sans variantes
 * @property {'left'|'right'} facing - Côté vers lequel regarde la source
 */

/** @returns {SpriteSpec} */
function spec(source, fallbacks, { maxWidth = HD_MAX_WIDTH, facing = 'right' } = {}) {
  return { source, maxWidth, fallbacks, facing };
}

/**
 * Plus petite variante au moins aussi grande que la taille à l'écran, sur les deux côtés,
 * sans dépasser la plus grande produite pour la source.
 * @param {number} maxWidth - Plus grande variante de la source
 * @param {number} needWidth - Largeur à l'écran (pixels de l'appareil)
 * @param {number} needHeight - Hauteur à l'écran (pixels de l'appareil)
 * @param {number} [aspect=1] - Hauteur / largeur de l'image (1 tant qu'elle n'est pas chargée)
 * @returns {number}
 */
export function variantWidth(maxWidth, needWidth, needHeight, aspect = 1) {
  const available = VARIANT_WIDTHS.filter(width => width <= maxWidth);
  const enough = available.find(width => width >= needWidth && width * aspect >= needHeight);
  return enough ?? available.at(-1);
}

/**
 * Adresse d'une variante WebP.
 * @param {string} source
 * @param {number} width
 * @returns {string}
 */
export function variantUrl(source, width) {
  return `${GENERATED_DIR}/${source}-${width}.webp`;
}

/**
 * Adresse d'un PNG du dépôt (repli).
 * @param {string} file
 * @returns {string}
 */
export function fallbackUrl(file) {
  return `${IMAGE_DIR}/${file}`;
}

/* --- Monstres : sources tournées vers la droite (les « _left » en sont les miroirs) --- */

export const MONSTER_COUNT = 155;

/**
 * @param {number} index - Numéro du monstre, de 1 à 155
 * @returns {SpriteSpec}
 */
export function monsterSpec(index) {
  const number = String(index).padStart(2, '0');
  return spec(`monstre${number}_right`, [`monstre${number}_right_128x128.png`]);
}

/* --- Personnages : le renard et l'astronaute regardent à gauche dans leur source --- */

const AVATARS = new Map([
  ['fox', spec('fox', ['fox_left_128x128.png'], { facing: 'left' })],
  ['panda', spec('panda', ['panda_right_128x128.png'])],
  ['unicorn', spec('unicorn', ['unicorn_right_128x128.png'])],
  ['dragon', spec('dragon', ['dragon_right_128x128.png'])],
  ['astronaut', spec('astronaut', ['astronaut_left_128x128.png'], { facing: 'left' })],
]);

/**
 * @param {string} name - Avatar du joueur (fox, panda, unicorn, dragon, astronaut)
 * @returns {SpriteSpec} Le renard pour un nom inconnu
 */
export function avatarSpec(name) {
  return AVATARS.get(name) ?? AVATARS.get('fox');
}

/* --- Fusées de MultiInvaders --- */

// Nom des fichiers du menu de l'Arcade (valeur enregistrée « fichier|repli ») → source :
// « spaceship_<avatar> » (Comète) et « spaceship_<avatar>_2 » (Lotus) en sont des réductions
const SPACESHIP_SOURCES = new Map([
  ['spaceship_default', 'spaceship_default'],
  ['spaceship_default_2', 'vaisseau_2'],
  ['spaceship_fox', 'renard_vaisseau'],
  ['spaceship_fox_2', 'renard_vaisseau_2'],
  ['spaceship_panda', 'panda_vaisseau'],
  ['spaceship_panda_2', 'panda_vaisseau_2'],
  ['spaceship_unicorn', 'licorne_vaisseau'],
  ['spaceship_unicorn_2', 'licorne_vaisseau_2'],
  ['spaceship_dragon', 'dragon_vaisseau'],
  ['spaceship_dragon_2', 'dragon_vaisseau_2'],
  ['spaceship_astronaut', 'astronaute_vaisseau'],
  ['spaceship_astronaut_2', 'astronaute_vaisseau_2'],
]);
// Réductions déjà nommées d'après leur source : « renard_vaisseau_2_256x256 »
const REDUCED_SUFFIX = /_(?:128x128|256x256)$/;
const SHIP_SOURCES = new Set(SPACESHIP_SOURCES.values());

/** Source d'un nom de fichier de fusée ; null s'il n'en a pas */
function shipSource(file) {
  const name = String(file || '')
    .trim()
    .replace(/\.png$/i, '');
  const known = SPACESHIP_SOURCES.get(name);
  if (known) return known;
  const unreduced = name.replace(REDUCED_SUFFIX, '');
  return SPACESHIP_SOURCES.get(unreduced) ?? (SHIP_SOURCES.has(unreduced) ? unreduced : null);
}

/**
 * Fusée choisie dans le menu de l'Arcade. La valeur enregistrée ne change pas : la source se
 * déduit du nom de fichier, et les fichiers eux-mêmes servent de repli.
 * @param {string} [selection] - « fichier.png|repli.png » (ou un seul fichier)
 * @returns {SpriteSpec}
 */
export function spaceshipSpec(selection) {
  const files = String(selection || '')
    .split('|')
    .map(file => file.trim())
    .filter(Boolean);
  const source = files.map(shipSource).find(Boolean);
  if (!source) return spec('spaceship_default', ['spaceship_default_128x128.png']);
  return spec(source, files.length ? files : ['spaceship_default_128x128.png']);
}

/* --- MultiSnake et textures --- */

// Morceaux du serpent : leur source sert aussi de repli (comportement d'avant)
const SNAKE_PARTS = new Set([
  'tete_droite.png',
  'tete_gauche.png',
  'tete_haut.png',
  'tete_bas.png',
  'corps_milieu_queue_gauche_tete_droite.png',
  'corps_milieu_queue_bas_tete_haut.png',
  'corps_courbe_droite_bas.png',
  'corps_courbe_haut_droite.png',
  'corps_courbe_gauche_haut.png',
  'corps_courbe_bas_gauche.png',
  'queue_fin_droite.png',
  'queue_fin_gauche.png',
  'queue_fin_haut.png',
  'queue_fin_bas.png',
]);

/**
 * @param {string} file - Morceau du serpent (« tete_droite.png »)
 * @returns {SpriteSpec}
 */
export function snakePartSpec(file) {
  const known = SNAKE_PARTS.has(file) ? file : 'tete_droite.png';
  return spec(known.replace(/\.png$/, ''), [known], { maxWidth: SNAKE_MAX_WIDTH });
}

// Textures et pomme : source de 1024 px, petit PNG en repli (l'herbe n'en a pas)
const TEXTURES = new Map([
  ['herbe.png', spec('herbe', ['herbe.png'])],
  ['mur.png', spec('mur', ['mur_128x128.png'])],
  ['chemin.png', spec('chemin', ['chemin_128x128.png'])],
  ['snake_apple.png', spec('snake_apple', ['snake_apple_128x128.png'])],
]);

/**
 * @param {string} file - herbe.png, mur.png, chemin.png ou snake_apple.png
 * @returns {SpriteSpec}
 */
export function textureSpec(file) {
  return TEXTURES.get(file) ?? TEXTURES.get('chemin.png');
}

/* --- Toutes les images --- */

/**
 * Toutes les images que les jeux d'Arcade peuvent dessiner.
 * @returns {SpriteSpec[]}
 */
export function arcadeSpriteSpecs() {
  const monsters = Array.from({ length: MONSTER_COUNT }, (_, i) => monsterSpec(i + 1));
  const ships = [...new Set(SPACESHIP_SOURCES.values())].map(source => spec(source, []));
  const snake = [...SNAKE_PARTS].map(snakePartSpec);
  return [...monsters, ...AVATARS.values(), ...ships, ...snake, ...TEXTURES.values()];
}

/**
 * Variantes à garder pour jouer hors ligne (scripts/precache-list.mjs) : une par image de
 * 1024 px (monstres, personnages, fusées). Les morceaux du serpent et les textures sont
 * gardés par leur nom de fichier, avec toutes leurs variantes, légères.
 * @returns {string[]} Chemins du site
 */
export function arcadeOfflineImages() {
  const kept = arcadeSpriteSpecs().filter(
    item => item.maxWidth === HD_MAX_WIDTH && !TEXTURES.has(`${item.source}.png`)
  );
  return kept.map(item => `/${variantUrl(item.source, OFFLINE_VARIANT_WIDTH)}`);
}
