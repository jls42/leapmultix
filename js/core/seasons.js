/**
 * Fêtes du calendrier (Halloween, puis Noël, le Nouvel An…) : quand elles s'appliquent, les
 * deux thèmes de couleur qu'elles proposent (clair et sombre) et les images costumées qu'elles
 * apportent. Sans dépendance ni DOM : le jeu le lit, et sous Node js/arcade-sprite-catalog.js
 * (variantes des images costumées) et scripts/precache-list.mjs (qui les laisse hors du
 * préchargement : inutile de les télécharger toute l'année).
 *
 * Une fête dure du jour `from` au jour `to` inclus ([mois, jour], date de l'appareil) ; un `to`
 * plus tôt dans l'année que `from` passe le 31 décembre. Une fête dont la date change chaque
 * année donne `movable` à la place : son jour de chaque année, et combien de jours elle dure
 * avant et après lui. Marche à suivre pour en ajouter une : skill dressing-for-events
 * (.claude/skills/).
 */

/**
 * @typedef {'heads'|'bodies'|'monsters'|'ships'|'snake'|'miam'|'logos'|'gifts'|'backgrounds'|'hero'} CostumeFamily
 * heads : assets/images/arcade/<avatar>_<fête>_head_avatar.png ;
 * bodies : assets/images/arcade/<avatar>_<fête>.png (MultiMiam) ;
 * monsters : assets/images/arcade/monstre<NN>_right_<fête>.png, les 155 monstres des jeux
 *   d'Arcade (MultiMiam, MultiInvaders, MultiMemory), tournés à droite comme les classiques ;
 * ships : assets/images/arcade/<fusée>_<fête>.png (MultiInvaders) ;
 * snake : MultiSnake, dans assets/images/arcade : les 14 morceaux du serpent
 *   (<morceau>_<fête>.png), la nourriture des réponses (snake_apple_<fête>.png) et l'herbe du
 *   plateau (herbe_<fête>.png) ;
 * miam : MultiMiam, dans assets/images/arcade : les murs du labyrinthe (mur_<fête>.png) et
 *   l'image posée sous les réponses (multimiam_reponse_<fête>.png) ;
 * logos : assets/images/arcade/logo_mode_<mode>_<fête>.png (six modes : cartes de l'accueil)
 *   et logo_multi<jeu>_<fête>.png (quatre jeux : menu de l'Arcade), repris au tableau de bord ;
 * gifts : assets/images/arcade/cadeau_ferme_<fête>.png et cadeau_ouvert_<fête>.png (mode
 *   Aventure : le trésor de la scène, puis celui de la victoire) ;
 * backgrounds : img/background_<avatar>_<fête>_<NNN>.png, de 001 à `worlds` ;
 * hero : assets/social/leapmultix-social-card-<fête>.webp (image des héros de l'accueil).
 */

/**
 * @typedef {Object} MovableDates
 * @property {(year: number) => (readonly [number, number]|undefined)} day - Jour de la fête
 *   [mois, jour] une année donnée ; undefined quand il n'est pas connu
 * @property {number} before - Jours de fête avant ce jour
 * @property {number} after - Jours de fête après ce jour
 */

/**
 * @typedef {Object} Season
 * @property {string} id - Identifiant, aussi suffixe des images costumées
 * @property {readonly [number, number]} [from] - Premier jour [mois, jour], inclus (dates fixes)
 * @property {readonly [number, number]} [to] - Dernier jour [mois, jour], inclus (dates fixes)
 * @property {MovableDates} [movable] - Dates qui changent chaque année, à la place de from et to
 * @property {{light: string, dark: string}} themes - Thèmes de couleur de la fête
 * @property {readonly CostumeFamily[]} costumes - Images costumées que la fête apporte ; une
 *   famille absente garde ses images classiques
 * @property {number} [worlds] - Fonds costumés par avatar (famille backgrounds), un tiré par
 *   session comme les fonds classiques
 */

/**
 * Toutes les familles que le jeu sait costumer : Halloween, Noël et le Nouvel An les portent
 * toutes. Une fête dont une partie reste à dessiner donne sa propre liste.
 * @type {readonly CostumeFamily[]}
 */
const EVERY_COSTUME = Object.freeze([
  'heads',
  'bodies',
  'monsters',
  'ships',
  'snake',
  'miam',
  'logos',
  'gifts',
  'backgrounds',
  'hero',
]);

/**
 * Premier jour de l'an lunaire, année par année, relevé dans les tables de conversion de
 * l'observatoire de Hong Kong (hko.gov.hk/en/gts/time/calendar/text/files/T<année>e.txt). Le
 * calendrier `chinese` d'Intl s'y trompe : 7 février 2027 au lieu du 6. À prolonger avant 2040
 * depuis les mêmes tables : une année absente n'a pas de Nouvel An chinois.
 */
const LUNAR_NEW_YEAR_DAYS = new Map([
  [2027, Object.freeze([2, 6])],
  [2028, Object.freeze([1, 26])],
  [2029, Object.freeze([2, 13])],
  [2030, Object.freeze([2, 3])],
  [2031, Object.freeze([1, 23])],
  [2032, Object.freeze([2, 11])],
  [2033, Object.freeze([1, 31])],
  [2034, Object.freeze([2, 19])],
  [2035, Object.freeze([2, 8])],
  [2036, Object.freeze([1, 28])],
  [2037, Object.freeze([2, 15])],
  [2038, Object.freeze([2, 4])],
  [2039, Object.freeze([1, 24])],
  [2040, Object.freeze([2, 12])],
]);

/**
 * Jour du Nouvel An chinois une année donnée
 * @param {number} year
 * @returns {readonly [number, number]|undefined} [mois, jour], undefined hors de la table
 */
export function lunarNewYearDay(year) {
  return LUNAR_NEW_YEAR_DAYS.get(year);
}

/** @type {readonly Season[]} */
export const SEASONS = Object.freeze([
  Object.freeze({
    id: 'halloween',
    from: Object.freeze([10, 24]),
    to: Object.freeze([11, 1]),
    themes: Object.freeze({ light: 'pumpkin', dark: 'halloween' }),
    costumes: EVERY_COSTUME,
    worlds: 8,
  }),
  Object.freeze({
    id: 'christmas',
    from: Object.freeze([12, 1]),
    to: Object.freeze([12, 26]),
    themes: Object.freeze({ light: 'snow', dark: 'christmas' }),
    costumes: EVERY_COSTUME,
    worlds: 8,
  }),
  // Du 27 décembre au 6 janvier : passe le 31 décembre, sans année écrite dans les images.
  Object.freeze({
    id: 'newyear',
    from: Object.freeze([12, 27]),
    to: Object.freeze([1, 6]),
    themes: Object.freeze({ light: 'confetti', dark: 'fireworks' }),
    costumes: EVERY_COSTUME,
    worlds: 8,
  }),
  // De la veille du Nouvel An lunaire à la fête des Lanternes (15e jour) : 16 jours, date
  // nouvelle chaque année. Fusées, fonds, monstres et logos des jeux d'Arcade à venir.
  Object.freeze({
    id: 'lunarnewyear',
    movable: Object.freeze({ day: lunarNewYearDay, before: 1, after: 14 }),
    themes: Object.freeze({ light: 'lanterns', dark: 'dragondance' }),
    costumes: Object.freeze(['heads', 'bodies', 'snake', 'miam', 'gifts', 'hero']),
  }),
]);

/** Valeur du paramètre d'essai ?saison= qui retire toute fête */
export const NO_SEASON = 'aucune';

/** Les thèmes de couleur de toutes les fêtes */
export const SEASON_THEMES = Object.freeze(
  SEASONS.flatMap(season => [season.themes.light, season.themes.dark])
);

/** Jour de l'année comparable : 1er novembre → 1101 */
const rank = (month, day) => month * 100 + day;

const todayRank = date => rank(date.getMonth() + 1, date.getDate());

/** Ces dates passent-elles le 31 décembre ? */
const crossesNewYear = ({ from, to }) => rank(...from) > rank(...to);

/**
 * Premier et dernier jour de la fête une année donnée ([mois, jour], inclus)
 * @param {Season} season
 * @param {number} year
 * @returns {{from: readonly [number, number], to: readonly [number, number]}|null} null quand
 *   le jour d'une fête mobile n'est pas connu cette année-là
 */
export function seasonDays(season, year) {
  if (!season.movable) return { from: season.from, to: season.to };
  const { day, before, after } = season.movable;
  const anchor = day(year);
  if (!anchor) return null;
  const [month, date] = anchor;
  const shifted = offset => {
    const shiftedDate = new Date(year, month - 1, date + offset);
    return Object.freeze([shiftedDate.getMonth() + 1, shiftedDate.getDate()]);
  };
  return { from: shifted(-before), to: shifted(after) };
}

/**
 * La fête s'applique-t-elle ce jour-là ?
 * @param {Season} season
 * @param {Date} date
 * @returns {boolean}
 */
export function isInSeason(season, date) {
  const days = seasonDays(season, date.getFullYear());
  if (!days) return false;
  const today = todayRank(date);
  const from = rank(...days.from);
  const to = rank(...days.to);
  return crossesNewYear(days) ? today >= from || today <= to : today >= from && today <= to;
}

/**
 * La fête du jour, ou celle que demande le paramètre d'essai ?saison= (une fête hors de ses
 * dates, ou « aucune »)
 * @param {Date} [date]
 * @param {string|null} [forced] - Valeur de ?saison=
 * @returns {Season|null}
 */
export function findSeason(date = new Date(), forced = null) {
  if (forced === NO_SEASON) return null;
  const asked = forced ? SEASONS.find(season => season.id === forced) : undefined;
  return asked ?? SEASONS.find(season => isInSeason(season, date)) ?? null;
}

/**
 * Édition d'une fête : son identifiant et l'année où elle commence (« halloween-2026 »). Un
 * choix fait pendant une fête ne vaut que pour son édition : refuser Halloween en 2026 ne le
 * refuse pas en 2027.
 * @param {Season} season
 * @param {Date} date
 * @returns {string}
 */
export function seasonEdition(season, date) {
  const days = seasonDays(season, date.getFullYear());
  const startedLastYear =
    days !== null && crossesNewYear(days) && todayRank(date) <= rank(...days.to);
  return `${season.id}-${date.getFullYear() - (startedLastYear ? 1 : 0)}`;
}

/**
 * La fête dont c'est l'un des thèmes
 * @param {string} theme
 * @returns {Season|null}
 */
export function seasonOfTheme(theme) {
  return SEASONS.find(season => Object.values(season.themes).includes(theme)) ?? null;
}

/* --- Costume porté par les images --- */

/** Fête dont les images portent le costume ; null tant qu'aucun thème de fête n'est appliqué */
let worn = null;

/**
 * Habille les images d'une fête, ou les rend à leur dessin classique (null). Seul js/core/theme.js
 * l'appelle, quand il applique un thème : sans lui, tout reste classique (tests compris).
 * @param {Season|null} season
 */
export function wearSeason(season) {
  worn = season ?? null;
}

/** @returns {Season|null} La fête dont les images portent le costume */
export function wornSeason() {
  return worn;
}

/**
 * Nom costumé d'une image, si la fête portée apporte cette famille d'images :
 * costumed('fox', 'bodies') → « fox_halloween » ; sinon le nom tel quel
 * @param {string} name
 * @param {CostumeFamily} family
 * @returns {string}
 */
export function costumed(name, family) {
  return worn?.costumes.includes(family) ? `${name}_${worn.id}` : name;
}

/**
 * Numéros des fonds costumés d'une fête, de 1 à `worlds` (un seul quand elle n'en dit rien)
 * @param {Season} season
 * @returns {number[]}
 */
export function seasonWorlds(season) {
  return Array.from({ length: season.worlds ?? 1 }, (_, index) => index + 1);
}

/** Marques d'une image de fête dans un nom de fichier : « _halloween_ », « -halloween. »… */
const SEASONAL_MARKS = SEASONS.flatMap(({ id }) =>
  ['_', '-'].flatMap(before => ['_', '-', '.'].map(after => `${before}${id}${after}`))
);

/**
 * Le nom d'un fichier est-il celui d'une image de fête (« fox_halloween_head_avatar.png »,
 * « leapmultix-social-card-halloween.webp ») ?
 * @param {string} fileName
 * @returns {boolean}
 */
export function isSeasonalImage(fileName) {
  return SEASONAL_MARKS.some(mark => fileName.includes(mark));
}
