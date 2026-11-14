/**
 * Dessin du serpent de MultiSnake, d'un seul tenant : un corps souple qui suit sa ligne
 * médiane (virages arrondis, queue effilée, ombre, reflet, taches), une tête qui tourne en
 * douceur, cligne des yeux et sort la langue, et, selon la fête, un bonnet, un chapeau
 * pointu ou le costume du dragon de la danse (crinière, moustaches, pattes, franges, perles).
 * Tout se dessine en cases : le contexte est mis à l'échelle d'une case, centre de la case
 * (0, 0) en (0, 0).
 */
import {
  BODY_RADIUS,
  bodyOutline,
  bodyRadius,
  headingOf,
  sampleCenterline,
  wrapCopies,
} from './multisnake-path.js';

const OUTLINE = 0.05;
const SHADOW = 'rgb(0 0 0 / 0.2)';
// Lumière venue du haut à gauche de l'écran : reflets et ombres portées
const LIGHT = Object.freeze({ x: -0.07, y: -0.09 });
const SHADOW_OFFSET = Object.freeze({ x: 0.05, y: 0.1 });
// Le dos, un peu vers la lumière : le flanc dans l'ombre se voit davantage en bas à droite
const BACK_OFFSET = Object.freeze({ x: -0.02, y: -0.03 });
const WHITE = '#ffffff';
const PUPIL = '#1a1a1a';
const TONGUE = '#e8364a';
const SANTA_RED = '#d42a2a';
const PARTY_STRIPES = Object.freeze(['#ff5fa2', '#4fc3f7', '#ffd54f', '#ff5fa2', '#4fc3f7']);
const PARTY_POMPOM = '#ffd54f';
// Tête, dans son repère (x devant, y sur le côté) : ovale et yeux
// Tête ronde, à peine plus large que le corps, et grands yeux rapprochés sur le dessus
const HEAD = Object.freeze({ x: 0.06, rx: 0.46, ry: 0.42 });
const EYE = Object.freeze({ x: 0.14, y: 0.17, r: 0.17 });
// Joues roses, un peu devant les yeux, sur les côtés
const CHEEK = Object.freeze({ x: 0.35, y: 0.25, rx: 0.075, ry: 0.06 });
const BLUSH = 'rgb(255 110 140 / 0.75)';
// Tête du dragon, plus longue, et sa crinière autour de l'arrière
const DRAGON_HEAD = Object.freeze({ x: 0.1, rx: 0.54, ry: 0.44 });
const MANE_TUFTS = 5;
// Clignement et langue : période et durée (ms)
const BLINK_PERIOD = 3400;
const BLINK_MS = 130;
const FLICK_PERIOD = 2600;
const FLICK_MS = 380;
// Visage sans animation : yeux ouverts, langue rentrée
const STILL_FACE = Object.freeze({ blink: false, flick: 0 });
// Rien à dessiner : cap nul
const NO_HEADING = Object.freeze({ heading: 0 });

/* --- Outils de tracé --- */

function polygon(ctx, points) {
  ctx.beginPath();
  points.forEach((point, index) =>
    index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y)
  );
  ctx.closePath();
}

function fillPolygon(ctx, points, color) {
  polygon(ctx, points);
  ctx.fillStyle = color;
  ctx.fill();
}

/** Polygone rempli et cerné (cornes, bonnets, crête) */
function inkPolygon(ctx, points, fill, ink) {
  polygon(ctx, points);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineJoin = 'round';
  ctx.lineWidth = OUTLINE;
  ctx.strokeStyle = ink;
  ctx.stroke();
}

function fillEllipse(ctx, shape, color) {
  ctx.beginPath();
  ctx.ellipse(shape.x, shape.y, shape.rx, shape.ry, shape.angle ?? 0, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

/** Ovale cerné : contour plus large, puis la couleur */
function inkEllipse(ctx, shape, fill, ink) {
  fillEllipse(ctx, { ...shape, rx: shape.rx + OUTLINE, ry: shape.ry + OUTLINE }, ink);
  fillEllipse(ctx, shape, fill);
}

/** Point du corps à une distance de la tête, avec le sens de la marche (radians) */
function pointAt(samples, s) {
  const found = samples.findIndex(point => point.s >= s);
  const index = found === -1 ? samples.length - 1 : Math.max(1, found);
  const after = samples.at(index);
  const before = samples.at(index - 1);
  const span = after.s - before.s || 1;
  const t = Math.min(1, Math.max(0, (s - before.s) / span));
  return {
    x: before.x + (after.x - before.x) * t,
    y: before.y + (after.y - before.y) * t,
    angle: Math.atan2(before.y - after.y, before.x - after.x),
  };
}

/** Décalage d'écran ramené dans le repère tourné de la tête */
function toHeadFrame(offset, heading) {
  const cos = Math.cos(-heading);
  const sin = Math.sin(-heading);
  return { x: offset.x * cos - offset.y * sin, y: offset.x * sin + offset.y * cos };
}

/** Distances régulières le long du corps, entre deux bornes */
function stations(from, to, gap) {
  const out = [];
  for (let s = from; s <= to; s += gap) out.push(s);
  return out;
}

/** Point à une distance d'un autre, dans une direction (radians) */
function toward(point, angle, distance) {
  return { x: point.x + Math.cos(angle) * distance, y: point.y + Math.sin(angle) * distance };
}

/* --- Corps --- */

/**
 * Corps en couches : ombre portée, contour, flanc (dans l'ombre, ou doré pour le dragon),
 * dos, reflet, taches. Le reflet et les taches restent dans le corps (découpe).
 */
function drawBody(ctx, view) {
  const { samples, radiusAt, skin } = view;
  fillPolygon(
    ctx,
    bodyOutline(samples, s => radiusAt(s) + OUTLINE, SHADOW_OFFSET),
    SHADOW
  );
  if (skin.kind === 'dragon') {
    drawLegs(ctx, view);
    drawFringe(ctx, view);
  }
  fillPolygon(
    ctx,
    bodyOutline(samples, s => radiusAt(s) + OUTLINE),
    skin.outline
  );
  const body = bodyOutline(samples, radiusAt);
  fillPolygon(ctx, body, skin.shade);
  ctx.save();
  polygon(ctx, body);
  ctx.clip();
  fillPolygon(
    ctx,
    bodyOutline(samples, s => radiusAt(s) * 0.76, BACK_OFFSET),
    skin.back
  );
  ctx.globalAlpha = 0.7;
  fillPolygon(
    ctx,
    bodyOutline(samples, s => radiusAt(s) * 0.26, LIGHT),
    skin.shine
  );
  ctx.globalAlpha = 1;
  if (skin.kind === 'snake') drawSpots(ctx, view);
  ctx.restore();
  if (skin.kind === 'dragon') drawDragonBack(ctx, view);
}

/** Taches du serpent, en zigzag le long du dos */
function drawSpots(ctx, view) {
  const { samples, radiusAt, length, skin } = view;
  stations(0.95, length - 0.5, 0.52).forEach((s, index) => {
    const point = pointAt(samples, s);
    const scale = radiusAt(s) / BODY_RADIUS;
    const side = (index % 2 === 0 ? 1 : -1) * 0.09 * scale;
    const spot = toward(point, point.angle + Math.PI / 2, side);
    fillEllipse(
      ctx,
      { ...spot, rx: 0.12 * scale, ry: 0.075 * scale, angle: point.angle },
      skin.spots
    );
  });
}

/* --- Dragon --- */

/** Deux paires de pattes qui trottinent, glissées sous le corps (corps assez long) */
function drawLegs(ctx, view) {
  const { samples, radiusAt, length, skin, time } = view;
  if (length < 2.2) return;
  [0.3, 0.68].forEach((part, pair) => {
    const point = pointAt(samples, length * part);
    const reach = radiusAt(length * part) + 0.14;
    for (const side of [1, -1]) {
      const swing = Math.sin(time / 110 + pair * Math.PI + (side > 0 ? 0 : Math.PI)) * 0.35;
      const angle = point.angle + side * (Math.PI / 2 + 0.3 + swing);
      const foot = toward(point, angle, reach);
      inkEllipse(ctx, { ...foot, rx: 0.13, ry: 0.08, angle }, skin.back, skin.outline);
      fillEllipse(ctx, { ...toward(foot, angle, 0.1), rx: 0.05, ry: 0.075, angle }, skin.trim);
    }
  });
}

/** Franges dorées en dents de scie sur les deux flancs, glissées sous le corps */
function drawFringe(ctx, view) {
  const { samples, radiusAt, length, skin } = view;
  stations(0.7, length - 0.35, 0.24).forEach(s => {
    const point = pointAt(samples, s);
    const radius = radiusAt(s);
    for (const side of [1, -1]) {
      const out = point.angle + (side * Math.PI) / 2;
      const root = toward(point, out, radius * 0.85);
      fillPolygon(
        ctx,
        [
          toward(root, point.angle, 0.13),
          toward(toward(root, out, 0.15), point.angle + Math.PI, 0.08),
          toward(root, point.angle + Math.PI, 0.11),
        ],
        skin.trim
      );
    }
  });
}

/** Perles dorées le long du dos et plumet au bout de la queue */
function drawDragonBack(ctx, view) {
  const { samples, radiusAt, length, skin } = view;
  stations(0.9, length - 0.5, 0.36).forEach(s => {
    const point = pointAt(samples, s);
    const scale = radiusAt(s) / BODY_RADIUS;
    inkEllipse(
      ctx,
      { x: point.x, y: point.y, rx: 0.07 * scale, ry: 0.07 * scale },
      skin.trim,
      skin.outline
    );
  });
  drawTailTuft(ctx, view);
}

/** Plumet en flamme au bout de la queue, qui ondule */
function drawTailTuft(ctx, view) {
  const { samples, skin, time } = view;
  const tip = samples.at(-1);
  const before = pointAt(samples, Math.max(0, tip.s - 0.3));
  const back = Math.atan2(tip.y - before.y, tip.x - before.x);
  const wag = Math.sin(time / 180) * 0.35;
  [
    { spread: -0.5, size: 0.46, color: skin.trim },
    { spread: 0.5, size: 0.46, color: skin.trim },
    { spread: 0, size: 0.52, color: skin.back },
  ].forEach(({ spread, size, color }) => {
    const angle = back + spread + wag;
    const flame = { ...toward(tip, angle, size * 0.45), rx: size * 0.5, ry: size * 0.17, angle };
    inkEllipse(ctx, flame, color, skin.outline);
  });
}

/* --- Tête --- */

/** Œil fermé : paupière de la couleur du dos, fente */
function drawClosedEye(ctx, eye, skin) {
  fillEllipse(ctx, { ...eye, rx: EYE.r - 0.035, ry: EYE.r - 0.035 }, skin.back);
  ctx.strokeStyle = skin.outline;
  ctx.lineWidth = 0.04;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(eye.x - 0.1, eye.y);
  ctx.lineTo(eye.x + 0.1, eye.y);
  ctx.stroke();
}

/** Joues roses et petit sourire au bout du museau */
function drawSmile(ctx, head, front) {
  for (const side of [1, -1]) {
    fillEllipse(ctx, { x: CHEEK.x, y: CHEEK.y * side, rx: CHEEK.rx, ry: CHEEK.ry }, BLUSH);
  }
  ctx.strokeStyle = head.skin.outline;
  ctx.lineWidth = 0.04;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(front - 0.15, 0, 0.1, -1, 1);
  ctx.stroke();
}

/** Yeux : contour, blanc, pupille qui regarde devant, reflet ; paupière au clignement */
function drawEyes(ctx, head) {
  const { skin, blink, light } = head;
  for (const side of [1, -1]) {
    const eye = { x: EYE.x, y: EYE.y * side };
    fillEllipse(ctx, { ...eye, rx: EYE.r, ry: EYE.r }, skin.outline);
    if (blink) {
      drawClosedEye(ctx, eye, skin);
      continue;
    }
    fillEllipse(ctx, { ...eye, rx: EYE.r - 0.035, ry: EYE.r - 0.035 }, WHITE);
    const pupil = { x: eye.x + 0.035, y: eye.y };
    fillEllipse(ctx, { ...pupil, rx: 0.1, ry: 0.1 }, PUPIL);
    // Deux reflets, un grand vers la lumière et un petit à l'opposé : un regard qui pétille
    const sparkle = { x: pupil.x + light.x * 0.45, y: pupil.y + light.y * 0.45 };
    fillEllipse(ctx, { ...sparkle, rx: 0.04, ry: 0.04 }, WHITE);
    const glint = { x: pupil.x - light.x * 0.35, y: pupil.y - light.y * 0.35 };
    fillEllipse(ctx, { ...glint, rx: 0.018, ry: 0.018 }, WHITE);
  }
}

/** Langue fourchue qui sort un instant, de temps en temps */
function drawTongue(ctx, flick) {
  if (flick <= 0) return;
  const reach = 0.5 + 0.26 * flick;
  ctx.strokeStyle = TONGUE;
  ctx.lineCap = 'round';
  ctx.lineWidth = 0.05;
  ctx.beginPath();
  ctx.moveTo(0.46, 0);
  ctx.lineTo(reach, 0);
  ctx.lineTo(reach + 0.07, -0.06);
  ctx.moveTo(reach, 0);
  ctx.lineTo(reach + 0.07, 0.06);
  ctx.stroke();
}

/** Bonnet de Père Noël vu de dessus : dôme rouge sur l'arrière de la tête, bord de fourrure
 * blanc juste derrière les yeux, pointe qui retombe sur le côté, pompon */
function drawSantaHat(ctx, head) {
  const { skin } = head;
  inkPolygon(
    ctx,
    [
      { x: -0.24, y: -0.24 },
      { x: -0.24, y: 0.24 },
      { x: -0.6, y: 0.3 },
      { x: -0.86, y: 0.52 },
      { x: -0.7, y: 0.04 },
    ],
    SANTA_RED,
    skin.outline
  );
  inkEllipse(ctx, { x: -0.14, y: 0, rx: 0.27, ry: 0.36 }, SANTA_RED, skin.outline);
  ctx.lineCap = 'round';
  for (const [color, width] of [
    [skin.outline, 0.15],
    [WHITE, 0.095],
  ]) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.arc(-0.3, 0, 0.38, -0.95, 0.95);
    ctx.stroke();
  }
  inkEllipse(ctx, { x: -0.88, y: 0.54, rx: 0.13, ry: 0.13 }, WHITE, skin.outline);
}

/** Chapeau pointu de fête, à rayures, couché sur l'arrière de la tête, pompon doré */
function drawPartyHat(ctx, head) {
  const tip = { x: -0.88, y: 0 };
  const base = { x: -0.2, half: 0.27 };
  // Point du cône, de la base (0) à la pointe (1), sur un bord ou l'autre
  const at = (k, side) => ({ x: base.x + (tip.x - base.x) * k, y: base.half * side * (1 - k) });
  PARTY_STRIPES.forEach((color, index) => {
    const near = index / PARTY_STRIPES.length;
    const far = (index + 1) / PARTY_STRIPES.length;
    fillPolygon(ctx, [at(near, 1), at(far, 1), at(far, -1), at(near, -1)], color);
  });
  ctx.lineJoin = 'round';
  ctx.lineWidth = OUTLINE;
  ctx.strokeStyle = head.skin.outline;
  polygon(ctx, [at(0, -1), at(0, 1), tip]);
  ctx.stroke();
  inkEllipse(ctx, { ...tip, rx: 0.1, ry: 0.1 }, PARTY_POMPOM, head.skin.outline);
}

/** Chapeau de chaque fête qui en porte un */
const HATS = new Map([
  ['santa', drawSantaHat],
  ['party', drawPartyHat],
]);

/** Ovale de la tête : ombre, contour, côté dans l'ombre, dessus, reflet */
function drawSkull(ctx, head, shape) {
  const { skin, light } = head;
  fillEllipse(
    ctx,
    { x: shape.x + SHADOW_OFFSET.x, y: SHADOW_OFFSET.y, rx: shape.rx, ry: shape.ry },
    SHADOW
  );
  inkEllipse(ctx, { x: shape.x, y: 0, rx: shape.rx, ry: shape.ry }, skin.shade, skin.outline);
  const top = { x: shape.x - 0.02 + light.x * 0.4, y: light.y * 0.4 };
  fillEllipse(ctx, { ...top, rx: shape.rx * 0.84, ry: shape.ry * 0.8 }, skin.back);
  ctx.globalAlpha = 0.7;
  const shine = { x: shape.x - 0.1 + light.x * 1.8, y: light.y * 1.8 };
  fillEllipse(ctx, { ...shine, rx: shape.rx * 0.38, ry: shape.ry * 0.24 }, skin.shine);
  ctx.globalAlpha = 1;
}

/** Tête du serpent, vue de dessus : ronde, joues roses, sourire, grands yeux */
function drawSnakeHead(ctx, head) {
  drawTongue(ctx, head.flick);
  drawSkull(ctx, head, HEAD);
  drawSmile(ctx, head, HEAD.x + HEAD.rx);
  const drawHat = HATS.get(head.skin.hat ?? '');
  if (drawHat) drawHat(ctx, head);
  drawEyes(ctx, head);
}

/** Crinière du dragon : mèches rouges et or autour de l'arrière de la tête, qui ondulent */
function drawMane(ctx, head) {
  const { skin, time } = head;
  for (let index = 0; index < MANE_TUFTS; index++) {
    const spread = (index / (MANE_TUFTS - 1) - 0.5) * 2.4;
    const wave = Math.sin(time / 200 + index) * 0.07;
    const angle = Math.PI + spread + wave;
    const tuft = { ...toward({ x: -0.05, y: 0 }, angle, 0.5), rx: 0.31, ry: 0.17, angle };
    inkEllipse(ctx, tuft, index % 2 === 0 ? skin.trim : skin.back, skin.outline);
  }
}

/** Moustaches dorées qui flottent de part et d'autre du museau */
function drawWhiskers(ctx, head) {
  const { skin, time } = head;
  ctx.lineCap = 'round';
  for (const side of [1, -1]) {
    const sway = Math.sin(time / 260 + (side > 0 ? 0 : 1.3)) * 0.12;
    ctx.beginPath();
    ctx.moveTo(0.55, 0.2 * side);
    ctx.bezierCurveTo(
      0.62,
      (0.56 + sway) * side,
      0.15,
      (0.56 - sway) * side,
      -0.12,
      (0.78 + sway) * side
    );
    ctx.strokeStyle = skin.outline;
    ctx.lineWidth = 0.08;
    ctx.stroke();
    ctx.strokeStyle = skin.trim;
    ctx.lineWidth = 0.045;
    ctx.stroke();
  }
}

/** Tête du dragon de la danse : crinière, museau, narines dorées, moustaches, yeux */
function drawDragonHead(ctx, head) {
  const { skin } = head;
  drawMane(ctx, head);
  drawSkull(ctx, head, DRAGON_HEAD);
  inkEllipse(ctx, { x: 0.5, y: 0, rx: 0.17, ry: 0.25 }, skin.shine, skin.outline);
  for (const side of [1, -1]) {
    inkEllipse(ctx, { x: 0.57, y: 0.1 * side, rx: 0.035, ry: 0.03 }, skin.outline, skin.trim);
    fillEllipse(ctx, { x: CHEEK.x, y: CHEEK.y * side, rx: CHEEK.rx, ry: CHEEK.ry }, BLUSH);
  }
  drawWhiskers(ctx, head);
  drawEyes(ctx, head);
}

/** Clignement (à la fin de chaque période de 3,4 s) et langue (toutes les 2,6 s) */
function liveliness(time, motion) {
  if (!motion) return STILL_FACE;
  const blinkPhase = time % BLINK_PERIOD;
  const flickPhase = (time + 900) % FLICK_PERIOD;
  const flick = flickPhase < FLICK_MS ? Math.sin((Math.PI * flickPhase) / FLICK_MS) : 0;
  return { blink: blinkPhase >= BLINK_PERIOD - BLINK_MS, flick };
}

/** Tête au bout du corps, tournée selon son cap, et son chapeau */
function drawHead(ctx, view) {
  const { samples, heading, skin, time, motion } = view;
  const tip = samples.at(0);
  const head = { skin, time, light: toHeadFrame(LIGHT, heading), ...liveliness(time, motion) };
  ctx.save();
  ctx.translate(tip.x, tip.y);
  ctx.rotate(heading);
  if (skin.kind === 'dragon') drawDragonHead(ctx, head);
  else drawSnakeHead(ctx, head);
  ctx.restore();
}

/**
 * Dessine le serpent
 * @param {CanvasRenderingContext2D} ctx - Contexte en unités du jeu
 * @param {object} scene
 * @param {{x: number, y: number}[]} scene.centerline - Ligne médiane, en cases (snakeCenterline)
 * @param {number} scene.cell - Taille d'une case, en unités du jeu
 * @param {{cols: number, rows: number}} scene.board
 * @param {import('./multisnake-skins.js').SnakeSkin} scene.skin
 * @param {{x: number, y: number}} scene.direction - Direction du jeu
 * @param {number} scene.time - Horloge de l'animation (ms)
 * @param {number[]} [scene.bulges] - Pommes en train de descendre (distance à la tête, cases)
 * @param {boolean} [scene.motion] - Faux : ni clignement, ni langue, ni ondulation
 * @returns {{heading: number}} Cap de la tête (radians)
 */
export function drawSnakeScene(ctx, scene) {
  if (!scene.centerline?.length) return NO_HEADING;
  const samples = sampleCenterline(scene.centerline);
  const length = samples.at(-1).s;
  const motion = scene.motion !== false;
  const view = {
    samples,
    length,
    skin: scene.skin,
    time: motion ? scene.time : 0,
    motion,
    radiusAt: s => bodyRadius(s, length, scene.bulges),
    heading: headingOf(samples, scene.direction),
  };
  for (const shift of wrapCopies(samples, scene.board)) {
    ctx.save();
    ctx.scale(scene.cell, scene.cell);
    ctx.translate(shift.x + 0.5, shift.y + 0.5);
    drawBody(ctx, view);
    drawHead(ctx, view);
    ctx.restore();
  }
  return { heading: view.heading };
}
