/**
 * MultiGoal, le dessin du terrain : la cage en haut, ses cibles rondes qui portent chacune un
 * nombre, le gardien (un monstre) devant elles, le ballon au point de penalty et le héros du
 * joueur à côté. Une cible que le gardien bloque est estompée : on voit quand tirer. Les
 * tailles sont en unités du jeu (pixels CSS du plateau).
 */
import { KEEPER_REACH, REPLAY_MS } from './multigoal-engine.js';
import { drawArcadeSprite, devicePixelsPerUnit } from './arcade-sprites.js';
import { contentBounds } from './arcade-sprite-bounds.js';
import { getCanvasFont, readableCanvasFontSize } from './arcade-common.js';

/** Largeur de la cage rapportée à sa hauteur */
export const GOAL_RATIO = 2;
// Part de la hauteur du plateau que la cage peut prendre, et marge autour d'elle
const GOAL_HEIGHT_SHARE = 0.6;
const BOARD_MARGIN = 10;
// Plus petit plateau dessiné, même sur un écran minuscule
const MIN_BOARD = Object.freeze({ width: 200, height: 220 });
// Rayon d'une cible, en parts de sa case ; un doigt qui tombe un peu à côté la touche quand même
const TARGET_SHARE = 0.4;
const TOUCH_SLACK = 1.25;
// Opacité d'une cible que le gardien bloque
const BLOCKED_ALPHA = 0.38;
// Le gardien : part de la largeur bloquée que prend son dessin, part de la hauteur de la cage
const KEEPER = Object.freeze({ widthShare: 0.92, maxHeight: 0.92 });

const COLORS = Object.freeze({
  pitch: '#6ab04c',
  stripe: '#62a645',
  line: 'rgb(255 255 255 / 0.75)',
  net: '#2f6b33',
  mesh: 'rgb(255 255 255 / 0.32)',
  post: '#ffffff',
  postEdge: '#8b949e',
  disc: '#fff7e0',
  ring: '#1c7ed6',
  ringRight: '#2f9e44',
  ringWrong: '#c92a2a',
  ink: '#22262b',
  cursor: '#ffd400',
  cursorEdge: '#1b1b1b',
  ball: '#ffffff',
  ballInk: '#22262b',
  shape: '#7a5a48',
  label: '#ffffff',
  labelBack: 'rgb(27 27 27 / 0.82)',
});

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/**
 * Plateau pour la place donnée : il la prend toute, la cage en haut au milieu, le point de
 * penalty en bas
 * @param {{width: number, height: number}} box - place disponible
 * @param {number} count - cibles dans la cage (3, 4 ou 6)
 * @returns {{width: number, height: number, goal: {x: number, y: number, width: number,
 *   height: number}, targetRadius: number, ballRadius: number, spot: {x: number, y: number}}}
 */
export function goalLayout(box, count) {
  const width = Math.max(MIN_BOARD.width, Math.floor(box.width));
  const height = Math.max(MIN_BOARD.height, Math.floor(box.height));
  const goalWidth = Math.min(width - 2 * BOARD_MARGIN, height * GOAL_HEIGHT_SHARE * GOAL_RATIO);
  const goalHeight = goalWidth / GOAL_RATIO;
  const rows = count > 3 ? 2 : 1;
  const columns = Math.ceil(count / rows);
  const ballRadius = clamp(goalWidth * 0.05, 9, 26);
  return {
    width,
    height,
    goal: {
      x: (width - goalWidth) / 2,
      y: BOARD_MARGIN + ballRadius,
      width: goalWidth,
      height: goalHeight,
    },
    targetRadius: Math.min(goalWidth / columns, goalHeight / rows) * TARGET_SHARE,
    ballRadius,
    spot: { x: width / 2, y: height - Math.max(ballRadius * 2.4, height * 0.13) },
  };
}

/**
 * Milieu d'une place de la cage sur le plateau
 * @param {ReturnType<typeof goalLayout>} layout
 * @param {{x: number, y: number}} place - en parts de la cage
 * @returns {{x: number, y: number}}
 */
export function goalPoint(layout, place) {
  const { goal } = layout;
  return { x: goal.x + place.x * goal.width, y: goal.y + place.y * goal.height };
}

/**
 * Cible sous un point du plateau : la plus proche, si le point tombe dessus ou tout près
 * @param {ReturnType<typeof goalLayout>} layout
 * @param {import('./multigoal-engine.js').Target[]} targets
 * @param {{x: number, y: number}} point
 * @returns {number} sa place, -1 si le point n'est sur aucune
 */
export function targetAt(layout, targets, point) {
  let best = -1;
  let bestDistance = layout.targetRadius * TOUCH_SLACK;
  for (const target of targets) {
    const center = goalPoint(layout, target);
    const distance = Math.hypot(point.x - center.x, point.y - center.y);
    if (distance <= bestDistance) {
      best = target.slot;
      bestDistance = distance;
    }
  }
  return best;
}

/**
 * Rectangle du dessin du gardien, les pieds sur la ligne de but : aussi large que la zone
 * qu'il bloque, sans dépasser la hauteur de la cage
 * @param {ReturnType<typeof goalLayout>} layout
 * @param {number} keeperX - sa place, en parts de la largeur de la cage
 * @param {number} aspect - largeur / hauteur de son dessin (sans ses marges)
 * @returns {{x: number, y: number, width: number, height: number}}
 */
export function keeperRect(layout, keeperX, aspect) {
  const { goal } = layout;
  const reach = 2 * KEEPER_REACH * goal.width * KEEPER.widthShare;
  const height = Math.min(goal.height * KEEPER.maxHeight, reach / aspect);
  const width = height * aspect;
  return {
    x: goal.x + keeperX * goal.width - width / 2,
    y: goal.y + goal.height - height,
    width,
    height,
  };
}

/**
 * Taille du nombre dans sa cible : la plus grande qui tient, jamais illisible à l'écran
 * @param {HTMLCanvasElement} canvas
 * @param {number} radius
 * @param {string} text
 */
export function targetFontSize(canvas, radius, text) {
  const byWidth = (radius * 1.62) / (Math.max(1, text.length) * 0.62);
  return readableCanvasFontSize(canvas, Math.min(radius * 1.05, byWidth));
}

function circle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
}

// La pelouse tondue en bandes, la surface de réparation et le point de penalty
function drawPitch(ctx, layout) {
  const { width, height, goal, spot } = layout;
  ctx.fillStyle = COLORS.pitch;
  ctx.fillRect(0, 0, width, height);
  const band = Math.max(24, height / 8);
  ctx.fillStyle = COLORS.stripe;
  for (let y = 0; y < height; y += band * 2) ctx.fillRect(0, y, width, band);
  ctx.strokeStyle = COLORS.line;
  ctx.lineWidth = Math.max(2, goal.width * 0.008);
  const goalLine = goal.y + goal.height;
  const pad = Math.min(goal.width * 0.16, (width - goal.width) / 2 - ctx.lineWidth);
  ctx.strokeRect(goal.x - pad, goalLine, goal.width + pad * 2, (spot.y - goalLine) * 0.45);
  ctx.beginPath();
  ctx.moveTo(0, goalLine);
  ctx.lineTo(width, goalLine);
  ctx.stroke();
  circle(ctx, spot.x, spot.y + layout.ballRadius * 0.7, Math.max(2, layout.ballRadius * 0.22));
  ctx.fillStyle = COLORS.line;
  ctx.fill();
}

// Le fond de la cage et les mailles du filet
function drawNet(ctx, goal) {
  ctx.fillStyle = COLORS.net;
  ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
  ctx.strokeStyle = COLORS.mesh;
  ctx.lineWidth = 1;
  const mesh = Math.max(10, goal.height / 9);
  ctx.beginPath();
  for (let x = goal.x + mesh; x < goal.x + goal.width; x += mesh) {
    ctx.moveTo(x, goal.y);
    ctx.lineTo(x, goal.y + goal.height);
  }
  for (let y = goal.y + mesh; y < goal.y + goal.height; y += mesh) {
    ctx.moveTo(goal.x, y);
    ctx.lineTo(goal.x + goal.width, y);
  }
  ctx.stroke();
}

// Les deux poteaux et la barre, par-dessus le filet
function drawPosts(ctx, goal) {
  const bottom = goal.y + goal.height;
  const frame = () => {
    ctx.beginPath();
    ctx.moveTo(goal.x, bottom);
    ctx.lineTo(goal.x, goal.y);
    ctx.lineTo(goal.x + goal.width, goal.y);
    ctx.lineTo(goal.x + goal.width, bottom);
    ctx.stroke();
  };
  const thick = Math.max(5, goal.width * 0.02);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = COLORS.postEdge;
  ctx.lineWidth = thick + 3;
  frame();
  ctx.strokeStyle = COLORS.post;
  ctx.lineWidth = thick;
  frame();
}

/**
 * Bord d'une cible : vert pour le but, rouge pour une cible ratée
 * @param {import('./multigoal-engine.js').Target} target
 * @param {import('./multigoal-engine.js').Shootout} game
 */
function ringColor(target, game) {
  if (target.out) return COLORS.ringWrong;
  if (game.phase === 'goal' && target.correct) return COLORS.ringRight;
  return COLORS.ring;
}

/**
 * Ce qu'on voit d'une cible : estompée derrière le gardien ; une cible ratée tombe et
 * s'efface pendant qu'on attend de retirer (sans animation : elle s'efface sur place)
 * @returns {{alpha: number, drop: number}|null} null : plus rien à dessiner
 */
function targetLook(target, view) {
  const { game } = view;
  if (!target.out) {
    return {
      alpha: game.phase === 'aiming' && game.isBlocked(target) ? BLOCKED_ALPHA : 1,
      drop: 0,
    };
  }
  const falling = game.phase === 'missed' && game.shot?.slot === target.slot;
  if (!falling) return null;
  const progress = clamp(game.elapsed / REPLAY_MS, 0, 1);
  return { alpha: 1 - progress, drop: view.reducedMotion ? 0 : progress };
}

// Une cible ronde et son nombre
function drawTarget(ctx, target, view) {
  const look = targetLook(target, view);
  if (!look) return;
  const { layout } = view;
  const radius = layout.targetRadius;
  const center = goalPoint(layout, target);
  const y = center.y + look.drop * radius * 1.6;
  ctx.save();
  ctx.globalAlpha = look.alpha;
  circle(ctx, center.x, y, radius);
  ctx.fillStyle = COLORS.disc;
  ctx.fill();
  ctx.lineWidth = Math.max(3, radius * 0.16);
  ctx.strokeStyle = ringColor(target, view.game);
  ctx.stroke();
  const text = String(target.value);
  ctx.fillStyle = COLORS.ink;
  ctx.font = getCanvasFont(targetFontSize(ctx.canvas, radius, text));
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, center.x, y + radius * 0.06);
  ctx.restore();
}

// Contour de la cible visée au clavier
function drawCursor(ctx, layout, target) {
  const center = goalPoint(layout, target);
  const radius = layout.targetRadius * 1.2;
  ctx.save();
  circle(ctx, center.x, center.y, radius);
  ctx.lineWidth = Math.max(5, radius * 0.16);
  ctx.strokeStyle = COLORS.cursorEdge;
  ctx.stroke();
  ctx.lineWidth = Math.max(3, radius * 0.09);
  ctx.strokeStyle = COLORS.cursor;
  ctx.stroke();
  ctx.restore();
}

// Forme de repli du gardien tant que son image n'est pas arrivée
function drawKeeperShape(ctx, rect) {
  ctx.beginPath();
  ctx.ellipse(
    rect.x + rect.width / 2,
    rect.y + rect.height / 2,
    rect.width * 0.4,
    rect.height * 0.5,
    0,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = COLORS.shape;
  ctx.fill();
}

/**
 * Côté vers lequel regarde le gardien : celui où il va
 * @param {{direction: number}} keeper
 * @returns {'left'|'right'}
 */
export function keeperFacing(keeper) {
  return keeper.direction < 0 ? 'left' : 'right';
}

// Dessine la partie utile d'une image dans un rectangle, retournée si on le demande
function paintCrop(ctx, image, source, rect, mirrored) {
  ctx.save();
  ctx.translate(mirrored ? rect.x + rect.width : rect.x, rect.y);
  ctx.scale(mirrored ? -1 : 1, 1);
  ctx.drawImage(
    image,
    source.x,
    source.y,
    source.width,
    source.height,
    0,
    0,
    rect.width,
    rect.height
  );
  ctx.restore();
}

/**
 * Le gardien, sans les marges de son image : son dessin fait la largeur de la zone bloquée,
 * et il regarde du côté où il va (son image est retournée quand elle regarde ailleurs)
 * @returns {{x: number, y: number, width: number, height: number}} où il est dessiné
 */
function drawKeeper(ctx, view) {
  const { layout, game, keeperSprite: sprite } = view;
  const scale = devicePixelsPerUnit(ctx.canvas);
  const image = sprite?.image;
  if (!image) {
    const rect = keeperRect(layout, game.keeper.x, 1);
    sprite?.request?.(rect.width * scale, rect.height * scale);
    drawKeeperShape(ctx, rect);
    return rect;
  }
  const bounds = contentBounds(sprite);
  const source = {
    x: bounds.x * image.naturalWidth,
    y: bounds.y * image.naturalHeight,
    width: bounds.width * image.naturalWidth,
    height: bounds.height * image.naturalHeight,
  };
  const rect = keeperRect(layout, game.keeper.x, source.width / source.height);
  // L'image entière à la taille de l'écran : son dessin n'en occupe qu'une partie
  sprite.request((rect.width / bounds.width) * scale, (rect.height / bounds.height) * scale);
  paintCrop(ctx, image, source, rect, keeperFacing(game.keeper) !== (sprite.facing ?? 'right'));
  return rect;
}

/**
 * Où est le ballon, et à quelle taille : au point de penalty, en vol vers sa cible, dans le
 * filet après un but, dans les gants du gardien après un arrêt, ou qui revient après un raté
 * @param {Object} view
 * @param {{x: number, y: number, width: number, height: number}} keeper - dessin du gardien
 * @returns {{x: number, y: number, radius: number}}
 */
export function ballPlace(view, keeper) {
  const { layout, game } = view;
  const rest = { ...layout.spot, radius: layout.ballRadius };
  const target = game.shot ? game.targets.at(game.shot.slot) : null;
  if (!target) return rest;
  const far = { ...goalPoint(layout, target), radius: layout.ballRadius * 0.62 };
  if (game.phase === 'saved') {
    return {
      x: keeper.x + keeper.width / 2,
      y: keeper.y + keeper.height * 0.55,
      radius: far.radius,
    };
  }
  if (game.phase === 'goal') return far;
  // En vol vers la cible ; après un raté, le ballon revient au point de penalty
  const back = game.phase === 'missed' ? clamp(game.elapsed / (REPLAY_MS * 0.6), 0, 1) : 0;
  const progress = view.reducedMotion ? Math.round(game.flight() - back) : game.flight() - back;
  const lift = view.reducedMotion ? 0 : Math.sin(progress * Math.PI) * layout.height * 0.04;
  return {
    x: rest.x + (far.x - rest.x) * progress,
    y: rest.y + (far.y - rest.y) * progress - lift,
    radius: rest.radius + (far.radius - rest.radius) * progress,
  };
}

// Un ballon blanc aux pièces sombres
function drawBall(ctx, ball) {
  const { x, y, radius } = ball;
  ctx.save();
  circle(ctx, x, y, radius);
  ctx.fillStyle = COLORS.ball;
  ctx.fill();
  ctx.lineWidth = Math.max(1.5, radius * 0.12);
  ctx.strokeStyle = COLORS.ballInk;
  ctx.stroke();
  ctx.clip();
  ctx.fillStyle = COLORS.ballInk;
  circle(ctx, x, y, radius * 0.34);
  ctx.fill();
  for (let patch = 0; patch < 5; patch++) {
    const angle = -Math.PI / 2 + (patch * Math.PI * 2) / 5;
    circle(ctx, x + Math.cos(angle) * radius, y + Math.sin(angle) * radius, radius * 0.3);
    ctx.fill();
  }
  ctx.restore();
}

// Le héros du joueur, à gauche du ballon, tourné vers lui
function drawHero(ctx, view) {
  const { layout } = view;
  const size = clamp(layout.height * 0.24, 44, layout.goal.width * 0.34);
  const box = {
    x: layout.spot.x - layout.ballRadius * 1.6 - size,
    y: layout.spot.y + layout.ballRadius - size,
    width: size,
    height: size,
  };
  drawArcadeSprite(ctx, view.heroSprite, box, { facing: 'right' });
}

// « Arrêté ! » au-dessus du gardien, le temps de l'arrêt : la réponse était bonne
function drawSavedLabel(ctx, view, keeper) {
  if (view.game.phase !== 'saved' || !view.savedLabel) return;
  const { layout } = view;
  const size = readableCanvasFontSize(ctx.canvas, layout.goal.height * 0.16);
  ctx.save();
  ctx.font = getCanvasFont(size);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const width = ctx.measureText(view.savedLabel).width + size;
  const x = clamp(keeper.x + keeper.width / 2, width / 2 + 4, layout.width - width / 2 - 4);
  const y = Math.max(size, keeper.y - size * 0.2);
  ctx.fillStyle = COLORS.labelBack;
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x - width / 2, y - size * 0.75, width, size * 1.5, size * 0.4);
  } else {
    ctx.rect(x - width / 2, y - size * 0.75, width, size * 1.5);
  }
  ctx.fill();
  ctx.fillStyle = COLORS.label;
  ctx.fillText(view.savedLabel, x, y + size * 0.04);
  ctx.restore();
}

/**
 * Tout le terrain
 * @param {CanvasRenderingContext2D} ctx
 * @param {{layout: ReturnType<typeof goalLayout>, game: import('./multigoal-engine.js').Shootout,
 *   keeperSprite: Object|null, heroSprite: Object|null, cursorSlot: number|null,
 *   savedLabel: string, reducedMotion: boolean}} view - cursorSlot : cible visée au clavier ;
 *   savedLabel : « Arrêté ! », déjà traduit
 */
export function drawGoalBoard(ctx, view) {
  const { layout, game } = view;
  drawPitch(ctx, layout);
  drawNet(ctx, layout.goal);
  for (const target of game.targets) drawTarget(ctx, target, view);
  drawPosts(ctx, layout.goal);
  const keeper = drawKeeper(ctx, view);
  const aimed = game.openTargets().find(target => target.slot === view.cursorSlot);
  if (aimed) drawCursor(ctx, layout, aimed);
  drawHero(ctx, view);
  drawBall(ctx, ballPlace(view, keeper));
  drawSavedLabel(ctx, view, keeper);
}
