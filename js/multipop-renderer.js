/**
 * MultiPop, le dessin du plateau : neuf terriers sur l'herbe ; un monstre sort du sien (caché
 * sous le bord du trou tant qu'il n'est pas monté), avec devant lui une pancarte en bois qui
 * porte son nombre ; l'ami, lui, a un cœur sur sa pancarte. Chaque personnage est calé sur le
 * contour de son dessin : tous sortent à la même hauteur, quelle que soit la marge de leur
 * image. Les tailles sont en unités du jeu (pixels CSS du plateau).
 */
import { GRID } from './multipop-engine.js';
import { drawArcadeSprite, devicePixelsPerUnit } from './arcade-sprites.js';
import { getCanvasFont, readableCanvasFontSize } from './arcade-common.js';
import { contentBounds } from './arcade-sprite-bounds.js';

export { alphaBounds } from './arcade-sprite-bounds.js';

/** Hauteur du dessin d'un terrier rapportée à sa largeur (la pancarte passe sous le trou) */
export const CELL_RATIO = 1.1;
/** Écart entre les cases et autour d'elles */
export const BOARD_MARGIN = 8;
// Plus petite case dessinée, même sur un écran minuscule ; trois rangées tiennent dans la
// place que laisse un téléphone tourné dont le navigateur montre ses barres (186 px de haut),
// sinon la page défile
const MIN_CELL = 40;
// Personnage, en parts de la largeur du terrier : largeur et hauteur au plus, et part de sa
// hauteur qui dépasse du trou (le reste est caché dedans)
const FIGURE = Object.freeze({ maxWidth: 0.96, maxHeight: 1.1, shown: 0.8 });
// Bord de la pancarte : vert pour la bonne réponse trouvée, rouge pour une mauvaise tapée
const TONE_EDGES = new Map([
  ['right', '#2f9e44'],
  ['wrong', '#c92a2a'],
]);

const COLORS = Object.freeze({
  grass: '#7cc45a',
  holeDeep: '#2e1a0e',
  holeRim: '#5b3a20',
  lip: '#8a5a32',
  shape: '#7a5a48',
  wood: '#f4c76b',
  heart: '#d6336c',
  woodEdge: '#8a5a2b',
  ink: '#3b2414',
  cursor: '#ffd400',
  cursorEdge: '#1b1b1b',
});

/**
 * Taille des cases pour la place donnée : trois colonnes et trois rangées qui prennent toute la
 * place, comme les plateaux des autres jeux (« Abandonner » reste en bas de l'écran ; un
 * téléphone tourné a un plateau large) ; chaque terrier se dessine au milieu de sa case
 * @param {{width: number, height: number}} box - place disponible
 * @returns {{margin: number, cellWidth: number, cellHeight: number, width: number,
 *   height: number}}
 */
export function popLayout(box) {
  const margin = BOARD_MARGIN;
  const side = size => Math.floor((size - margin * (GRID + 1)) / GRID);
  const cellWidth = Math.max(MIN_CELL, side(box.width));
  const cellHeight = Math.max(Math.round(MIN_CELL * CELL_RATIO), side(box.height));
  return {
    margin,
    cellWidth,
    cellHeight,
    width: cellWidth * GRID + margin * (GRID + 1),
    height: cellHeight * GRID + margin * (GRID + 1),
  };
}

/**
 * Case d'un terrier sur le plateau
 * @param {ReturnType<typeof popLayout>} layout
 * @param {number} hole - 0 à 8, ligne par ligne
 * @returns {{x: number, y: number, width: number, height: number}}
 */
export function cellRect(layout, hole) {
  const col = hole % GRID;
  const row = Math.floor(hole / GRID);
  return {
    x: layout.margin + col * (layout.cellWidth + layout.margin),
    y: layout.margin + row * (layout.cellHeight + layout.margin),
    width: layout.cellWidth,
    height: layout.cellHeight,
  };
}

/**
 * Terrier sous un point du plateau ; l'écart entre deux cases compte pour la plus proche
 * (un doigt qui tombe à côté touche quand même)
 * @param {ReturnType<typeof popLayout>} layout
 * @param {{x: number, y: number}} point
 * @returns {number} -1 hors du plateau
 */
export function holeAt(layout, point) {
  const step = (size, value) => Math.floor((value - layout.margin / 2) / (size + layout.margin));
  const col = step(layout.cellWidth, point.x);
  const row = step(layout.cellHeight, point.y);
  if (col < 0 || col >= GRID || row < 0 || row >= GRID) return -1;
  return row * GRID + col;
}

/**
 * Où se dessine chaque partie d'un terrier dans sa case : à la plus grande taille qui y tient,
 * au milieu
 * @param {{x: number, y: number, width: number, height: number}} cell
 */
export function cellParts(cell) {
  const w = Math.min(cell.width, cell.height / CELL_RATIO);
  const centerX = cell.x + cell.width / 2;
  const top = cell.y + (cell.height - w * CELL_RATIO) / 2;
  const holeY = top + 0.9 * w;
  const signWidth = 0.7 * w;
  const figureWidth = FIGURE.maxWidth * w;
  const figureHeight = FIGURE.shown * FIGURE.maxHeight * w;
  return {
    unit: w,
    centerX,
    holeY,
    holeRx: 0.4 * w,
    holeRy: 0.1 * w,
    // Place du personnage au-dessus du trou, quand il est sorti en entier
    figure: {
      x: centerX - figureWidth / 2,
      y: holeY - figureHeight,
      width: figureWidth,
      height: figureHeight,
    },
    sign: { x: centerX - signWidth / 2, y: holeY - 0.06 * w, width: signWidth, height: 0.25 * w },
  };
}

/**
 * Rectangle où dessiner un personnage sorti en entier : aussi grand que sa place le permet,
 * centré, le bas du corps (un cinquième) sous le bord du trou
 * @param {ReturnType<typeof cellParts>} parts
 * @param {number} aspect - largeur / hauteur du dessin (sans ses marges)
 * @returns {{x: number, y: number, width: number, height: number}}
 */
export function figureRect(parts, aspect) {
  const height = Math.min(FIGURE.maxHeight * parts.unit, (FIGURE.maxWidth * parts.unit) / aspect);
  const width = height * aspect;
  return {
    x: parts.centerX - width / 2,
    y: parts.holeY - FIGURE.shown * height,
    width,
    height,
  };
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

// Le trou, derrière le personnage
function drawHole(ctx, parts) {
  ellipse(ctx, parts.centerX, parts.holeY, parts.holeRx * 1.08, parts.holeRy * 1.4, COLORS.holeRim);
  ellipse(ctx, parts.centerX, parts.holeY, parts.holeRx, parts.holeRy, COLORS.holeDeep);
}

// Le bord de terre devant le trou : il cache le bas du personnage qui sort
function drawLip(ctx, parts) {
  ctx.beginPath();
  ctx.ellipse(parts.centerX, parts.holeY, parts.holeRx * 1.08, parts.holeRy * 1.4, 0, 0, Math.PI);
  ctx.closePath();
  ctx.fillStyle = COLORS.lip;
  ctx.fill();
}

// Forme de repli tant que l'image n'est pas arrivée : une tête ronde
function drawFigureShape(ctx, parts, top) {
  const r = parts.unit * 0.27;
  ellipse(ctx, parts.centerX, top + r * 1.1, r, r * 1.1, COLORS.shape);
}

// L'image du personnage, sans ses marges ; false tant qu'elle n'est pas là
function paintFigure(ctx, parts, sprite, sunk) {
  if (typeof sprite?.request !== 'function') return false;
  const scale = devicePixelsPerUnit(ctx.canvas);
  sprite.request(parts.unit * scale, parts.unit * scale);
  const image = sprite.image;
  if (!image) return false;
  const bounds = contentBounds(sprite);
  const source = {
    x: bounds.x * image.naturalWidth,
    y: bounds.y * image.naturalHeight,
    width: bounds.width * image.naturalWidth,
    height: bounds.height * image.naturalHeight,
  };
  const rect = figureRect(parts, source.width / source.height);
  // L'image entière à la taille de l'écran : son dessin n'en occupe qu'une partie
  sprite.request((rect.width / bounds.width) * scale, (rect.height / bounds.height) * scale);
  ctx.drawImage(
    image,
    source.x,
    source.y,
    source.width,
    source.height,
    rect.x,
    rect.y + sunk,
    rect.width,
    rect.height
  );
  return true;
}

/**
 * Le personnage, monté de « height » (0 au fond, 1 en haut), caché sous le bord du trou
 * @param {CanvasRenderingContext2D} ctx
 * @param {ReturnType<typeof cellParts>} parts
 * @param {import('./arcade-sprites.js').ArcadeSprite|null|undefined} sprite
 * @param {number} height
 */
function drawFigure(ctx, parts, sprite, height) {
  if (height <= 0) return;
  const { figure } = parts;
  const sunk = (1 - height) * figure.height;
  ctx.save();
  ctx.beginPath();
  ctx.rect(figure.x, figure.y, figure.width, figure.height);
  ctx.clip();
  if (!paintFigure(ctx, parts, sprite, sunk)) drawFigureShape(ctx, parts, figure.y + sunk);
  ctx.restore();
}

// Rectangle arrondi (droit sur un navigateur trop ancien pour roundRect)
function roundedRect(ctx, rect, radius) {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(rect.x, rect.y, rect.width, rect.height, radius);
  } else {
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
  }
}

/**
 * Taille du nombre dans sa pancarte : la plus grande qui tient, jamais illisible à l'écran
 * @param {HTMLCanvasElement} canvas
 * @param {{width: number, height: number}} sign
 * @param {string} text
 */
export function signFontSize(canvas, sign, text) {
  const byWidth = (sign.width * 0.86) / (Math.max(1, text.length) * 0.62);
  return readableCanvasFontSize(canvas, Math.min(sign.height * 0.72, byWidth));
}

// Le nombre d'un monstre, au milieu de sa pancarte
function drawSignNumber(ctx, sign, value) {
  const text = String(value);
  ctx.fillStyle = COLORS.ink;
  ctx.font = getCanvasFont(signFontSize(ctx.canvas, sign, text));
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, sign.x + sign.width / 2, sign.y + sign.height * 0.54);
}

// Le cœur de l'ami, au milieu de sa pancarte : pas un nombre, on ne le tape pas
function drawSignHeart(ctx, sign) {
  const cx = sign.x + sign.width / 2;
  const cy = sign.y + sign.height / 2;
  const s = sign.height * 0.36;
  ctx.beginPath();
  ctx.moveTo(cx, cy + s * 0.9);
  ctx.bezierCurveTo(cx - s * 1.5, cy - s * 0.1, cx - s * 0.7, cy - s * 1.2, cx, cy - s * 0.35);
  ctx.bezierCurveTo(cx + s * 0.7, cy - s * 1.2, cx + s * 1.5, cy - s * 0.1, cx, cy + s * 0.9);
  ctx.closePath();
  ctx.fillStyle = COLORS.heart;
  ctx.fill();
}

/**
 * La pancarte, avec le nombre d'un monstre ou le cœur de l'ami ; bord vert pour la bonne
 * réponse trouvée, rouge pour un personnage tapé à tort
 * @param {CanvasRenderingContext2D} ctx
 * @param {{x: number, y: number, width: number, height: number}} sign
 * @param {{value?: number, tone?: 'right'|'wrong'|null, alpha: number}} label - sans
 *   nombre : le cœur
 */
function drawSign(ctx, sign, { value, tone = null, alpha }) {
  ctx.save();
  ctx.globalAlpha = alpha;
  roundedRect(ctx, sign, sign.height * 0.22);
  ctx.fillStyle = COLORS.wood;
  ctx.fill();
  ctx.lineWidth = Math.max(2, sign.height * 0.09);
  ctx.strokeStyle = TONE_EDGES.get(tone) ?? COLORS.woodEdge;
  ctx.stroke();
  if (value === undefined) drawSignHeart(ctx, sign);
  else drawSignNumber(ctx, sign, value);
  ctx.restore();
}

// Contour du monstre visé au clavier, autour de sa pancarte
function drawCursor(ctx, sign) {
  const pad = sign.height * 0.18;
  const ring = {
    x: sign.x - pad,
    y: sign.y - pad,
    width: sign.width + pad * 2,
    height: sign.height + pad * 2,
  };
  ctx.save();
  ctx.lineWidth = Math.max(4, sign.height * 0.16);
  ctx.strokeStyle = COLORS.cursorEdge;
  roundedRect(ctx, ring, sign.height * 0.3);
  ctx.stroke();
  ctx.lineWidth = Math.max(2, sign.height * 0.08);
  ctx.strokeStyle = COLORS.cursor;
  ctx.stroke();
  ctx.restore();
}

/**
 * Bord de la pancarte : le bon monstre trouvé en vert, un mauvais ou l'ami tapé en rouge
 * @param {import('./multipop-engine.js').Monster|import('./multipop-engine.js').Friend} figure
 * @param {string} phase
 */
function signTone(figure, phase) {
  if (figure.value === undefined) return friendTone(figure, phase);
  if (figure.downAt !== null && !figure.correct) return 'wrong';
  if (phase === 'solved' && figure.correct) return 'right';
  return null;
}

// L'ami tapé redescend pendant que les monstres sont encore levés : bord rouge
function friendTone(friend, phase) {
  return friend.downAt !== null && phase === 'up' ? 'wrong' : null;
}

/**
 * Hauteur montrée d'un personnage : sans animation (mouvements réduits), il est en haut ou au
 * fond
 */
function shownHeight(field, figure, reducedMotion) {
  const height = field.heightOf(figure);
  if (!reducedMotion) return height;
  return height > 0 ? 1 : 0;
}

/**
 * Un terrier, et le personnage qui en sort s'il y en a un
 * @param {CanvasRenderingContext2D} ctx
 * @param {{x: number, y: number, width: number, height: number}} cell
 * @param {{figure: import('./multipop-engine.js').Monster|import('./multipop-engine.js').Friend
 *   |undefined, view: Object}} what
 */
function drawBurrow(ctx, cell, { figure, view }) {
  const parts = cellParts(cell);
  drawHole(ctx, parts);
  const height = figure ? shownHeight(view.field, figure, view.reducedMotion) : 0;
  drawFigure(ctx, parts, view.sprites?.get(figure?.hole), height);
  drawLip(ctx, parts);
  if (height <= 0.3) return;
  const alpha = Math.min(1, (height - 0.3) / 0.4);
  drawSign(ctx, parts.sign, {
    value: figure.value,
    tone: signTone(figure, view.field.phase),
    alpha,
  });
  if (view.cursorHole === figure.hole && figure.downAt === null) drawCursor(ctx, parts.sign);
}

// Le maillet : sa taille en parts d'une case, l'angle où il frappe et celui où il attend,
// et dans son image (sans ses marges) le milieu de sa tête, en part de la hauteur
const MALLET = Object.freeze({
  share: 0.3,
  min: 30,
  max: 64,
  hitAngle: -1.03,
  raise: 0.4,
  headCenter: 0.21,
});
const MALLET_COLORS = Object.freeze({
  head: '#e03131',
  handle: '#f5b70a',
  edge: '#3b2414',
  burst: '#ffe066',
});

/**
 * Angle du maillet autour de sa poignée : levé au repos (swing 0), abattu sur le point visé
 * au moment de la frappe (swing 1), puis il se relève
 * @param {number} swing - de 1 (il vient de frapper) à 0 (au repos)
 * @returns {number} radians
 */
export function malletAngle(swing) {
  const struck = Math.min(1, Math.max(0, swing));
  return MALLET.hitAngle + MALLET.raise * (1 - struck);
}

/**
 * Taille et place du maillet : sa tête frappe le point visé, sa poignée part en bas à droite
 * @param {ReturnType<typeof popLayout>} layout
 * @param {{x: number, y: number}} point - point visé (souris, doigt ou monstre du clavier)
 * @returns {{size: number, length: number, pivot: {x: number, y: number}}} size : épaisseur
 *   de la tête ; length : de la poignée au milieu de la tête ; pivot : bout de la poignée
 */
export function malletParts(layout, point) {
  const cell = Math.min(layout.cellWidth, layout.cellHeight);
  const size = Math.min(MALLET.max, Math.max(MALLET.min, cell * MALLET.share));
  const length = size * 1.6;
  return {
    size,
    length,
    // À l'angle de frappe, le milieu de la tête tombe pile sur le point visé
    pivot: {
      x: point.x - length * Math.sin(MALLET.hitAngle),
      y: point.y + length * Math.cos(MALLET.hitAngle),
    },
  };
}

// L'ombre du maillet sur le point visé : la souris n'a plus de curseur, on voit où il tape
function drawAim(ctx, point, size) {
  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.fillStyle = MALLET_COLORS.edge;
  ctx.beginPath();
  ctx.ellipse(point.x, point.y, size * 0.62, size * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Éclat jaune à l'endroit frappé, le temps de la frappe
function drawImpact(ctx, point, size, swing) {
  ctx.save();
  ctx.globalAlpha = Math.min(1, swing * 1.4);
  ctx.fillStyle = MALLET_COLORS.burst;
  ctx.beginPath();
  for (let tip = 0; tip < 16; tip++) {
    const radius = tip % 2 === 0 ? size * 0.95 : size * 0.45;
    const angle = (tip * Math.PI) / 8;
    ctx.lineTo(point.x + Math.cos(angle) * radius, point.y + Math.sin(angle) * radius);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Le maillet dessiné par le code, tant que son image n'est pas arrivée : un manche et une
// tête en travers, autour de la poignée (0, 0), la tête vers le haut
function drawMalletShape(ctx, size, length) {
  const head = { x: -size * 0.8, y: -length - size / 2, width: size * 1.6, height: size };
  ctx.lineJoin = 'round';
  ctx.lineWidth = Math.max(2, size * 0.09);
  ctx.strokeStyle = MALLET_COLORS.edge;
  roundedRect(
    ctx,
    { x: -size * 0.14, y: -length, width: size * 0.28, height: length },
    size * 0.12
  );
  ctx.fillStyle = MALLET_COLORS.handle;
  ctx.fill();
  ctx.stroke();
  roundedRect(ctx, head, size * 0.24);
  ctx.fillStyle = MALLET_COLORS.head;
  ctx.fill();
  ctx.stroke();
}

/**
 * Rectangle de l'image du maillet autour de sa poignée (0, 0) : le bas du manche sur la
 * poignée, le milieu de la tête à la distance voulue, le manche dans l'axe
 * @param {number} length - de la poignée au milieu de la tête
 * @param {number} aspect - largeur / hauteur du dessin (sans ses marges)
 * @returns {{x: number, y: number, width: number, height: number}}
 */
export function malletImageRect(length, aspect) {
  const height = length / (1 - MALLET.headCenter);
  const width = height * aspect;
  return { x: -width / 2, y: -height, width, height };
}

// L'image du maillet, sans ses marges ; false tant qu'elle n'est pas là
function paintMalletImage(ctx, sprite, length) {
  if (typeof sprite?.request !== 'function') return false;
  const scale = devicePixelsPerUnit(ctx.canvas);
  sprite.request(length * 2 * scale, length * 2 * scale);
  const image = sprite.image;
  if (!image) return false;
  const bounds = contentBounds(sprite);
  const source = {
    x: bounds.x * image.naturalWidth,
    y: bounds.y * image.naturalHeight,
    width: bounds.width * image.naturalWidth,
    height: bounds.height * image.naturalHeight,
  };
  const rect = malletImageRect(length, source.width / source.height);
  ctx.drawImage(
    image,
    source.x,
    source.y,
    source.width,
    source.height,
    rect.x,
    rect.y,
    rect.width,
    rect.height
  );
  return true;
}

/**
 * Le maillet qui tape les monstres : il suit la souris à la place du curseur et s'abat à
 * chaque tape (au doigt et au clavier, il n'apparaît que le temps de la frappe)
 * @param {CanvasRenderingContext2D} ctx
 * @param {ReturnType<typeof popLayout>} layout
 * @param {{x: number, y: number, swing: number, impact: boolean}} mallet - swing : de 1 (il
 *   vient de frapper) à 0 (au repos) ; impact : il a touché un personnage
 * @param {import('./arcade-sprites.js').ArcadeSprite|null} [sprite] - son image (maillet.png)
 */
export function drawMallet(ctx, layout, mallet, sprite = null) {
  const { size, length, pivot } = malletParts(layout, mallet);
  if (mallet.impact && mallet.swing > 0) drawImpact(ctx, mallet, size, mallet.swing);
  else drawAim(ctx, mallet, size);
  ctx.save();
  ctx.translate(pivot.x, pivot.y);
  ctx.rotate(malletAngle(mallet.swing));
  if (!paintMalletImage(ctx, sprite, length)) drawMalletShape(ctx, size, length);
  ctx.restore();
}

/**
 * Tout le plateau
 * @param {CanvasRenderingContext2D} ctx
 * @param {{layout: ReturnType<typeof popLayout>, field: import('./multipop-engine.js').MonsterField,
 *   sprites: Map<number, Object>, grassSprite: Object|null, cursorHole: number|null,
 *   reducedMotion: boolean, mallet?: {x: number, y: number, swing: number, impact: boolean}
 *   |null, malletSprite?: Object|null}} view - sprites : l'image du personnage de chaque
 *   terrier ; mallet : le maillet à dessiner par-dessus, s'il est sur le plateau, et
 *   malletSprite son image
 */
export function drawPopBoard(ctx, view) {
  const { layout, field } = view;
  const board = { x: 0, y: 0, width: layout.width, height: layout.height };
  ctx.fillStyle = COLORS.grass;
  ctx.fillRect(0, 0, board.width, board.height);
  drawArcadeSprite(ctx, view.grassSprite, board, { fit: 'cover' });
  const figures = new Map(field.monsters.map(monster => [monster.hole, monster]));
  if (field.friend) figures.set(field.friend.hole, field.friend);
  for (let hole = 0; hole < GRID * GRID; hole++) {
    drawBurrow(ctx, cellRect(layout, hole), { figure: figures.get(hole), view });
  }
  if (view.mallet) drawMallet(ctx, layout, view.mallet, view.malletSprite);
}
