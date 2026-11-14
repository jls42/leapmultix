/**
 * Géométrie du serpent de MultiSnake, en cases : sa ligne médiane entre deux pas, ses virages
 * arrondis, des points rapprochés le long du corps, le rayon du corps en chaque point et son
 * contour. Rien n'y dessine : js/multisnake-renderer.js s'en sert, les tests aussi.
 *
 * Coordonnées : une case (x, y) a son centre en (x, y) ; le dessin ajoute la demi-case.
 */

/** Rayon du corps, en cases (diamètre 0,68 case) */
export const BODY_RADIUS = 0.34;
/** Rayon du bout de la queue */
const TAIL_TIP_RADIUS = 0.06;
/** Longueur effilée de la queue, en cases (moins sur un serpent court) */
const TAIL_TAPER = 1.8;
/** Bosse d'une pomme avalée : surplus de rayon, demi-largeur (cases) */
const BULGE_RADIUS = 0.1;
const BULGE_SPREAD = 0.42;
/** Pas entre deux points du corps, en cases */
const SAMPLE_STEP = 0.1;
/** Recul du point qui donne le cap de la tête : la tête tourne pendant le pas */
const HEADING_LOOKBACK = 0.45;
/** Écart sous lequel deux points du corps se confondent, en cases */
const MIN_GAP = 0.000001;
/** Contour sans décalage */
const NO_OFFSET = Object.freeze({ x: 0, y: 0 });
/** Marge du dessin au-delà de la ligne médiane (tête, crinière), pour les copies au bord */
const DRAW_MARGIN = 1.3;

/**
 * Écart d'une case à sa voisine sur un axe : au-delà de la moitié du plateau, elles se
 * touchent par le bord opposé.
 * @param {number} delta - Écart de cases
 * @param {number} size - Cases sur cet axe
 * @returns {number}
 */
export function wrappedStep(delta, size) {
  if (Math.abs(delta) > size / 2) return delta < 0 ? 1 : -1;
  return Math.round(delta);
}

const lerp = (a, b, t) => a + (b - a) * t;
const lerpPoint = (a, b, t) => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) });
const sameCell = (a, b) => a.x === b.x && a.y === b.y;

/**
 * Cases du serpent mises bout à bout depuis la tête : un bord franchi ne fait plus de saut,
 * le corps continue au-delà du plateau.
 * @param {{x: number, y: number}[]} cells - De la tête à la queue
 * @param {{cols: number, rows: number}} board
 * @returns {{x: number, y: number}[]}
 */
export function unwrapCells(cells, board) {
  const out = [];
  cells.forEach((cell, index) => {
    const prev = out.at(-1);
    if (!prev) {
      out.push({ x: cell.x, y: cell.y });
      return;
    }
    const before = cells.at(index - 1);
    out.push({
      x: prev.x + wrappedStep(cell.x - before.x, board.cols),
      y: prev.y + wrappedStep(cell.y - before.y, board.rows),
    });
  });
  return out;
}

/**
 * Ce qu'a fait le serpent au dernier pas : avancé, grandi (bonne pomme), ou rien qui s'anime
 * (mauvaise pomme : il reste sur place ; vie perdue ou nouvelle partie : il repart ailleurs).
 * @param {{x: number, y: number}[]} last - Cases avant le pas
 * @param {{x: number, y: number}[]} current - Cases après le pas
 * @returns {'moved'|'grew'|'still'}
 */
export function stepKind(last, current) {
  if (!last?.length || current?.length < 2) return 'still';
  if (!sameCell(current.at(1), last.at(0)) || sameCell(current.at(0), last.at(0))) {
    return 'still';
  }
  if (current.length === last.length) return 'moved';
  return current.length === last.length + 1 ? 'grew' : 'still';
}

/**
 * Ligne médiane du serpent pendant un pas, de la tête à la queue : la tête glisse vers sa
 * nouvelle case, les cases du milieu restent en place, la queue rattrape (sauf s'il grandit).
 * @param {object} state
 * @param {{x: number, y: number}[]} state.last - Cases avant le pas
 * @param {{x: number, y: number}[]} state.current - Cases après le pas
 * @param {number} state.progress - Avancement du pas, de 0 à 1
 * @param {{cols: number, rows: number}} state.board
 * @returns {{x: number, y: number}[]}
 */
export function snakeCenterline({ last, current, progress, board }) {
  const cells = unwrapCells(current, board);
  const kind = stepKind(last, current);
  if (kind === 'still' || progress >= 1) return cells;
  const line = [lerpPoint(cells.at(1), cells.at(0), progress), ...cells.slice(1)];
  if (kind === 'grew') return line;
  const tail = cells.at(-1);
  const oldTail = {
    x: tail.x + wrappedStep(last.at(-1).x - current.at(-1).x, board.cols),
    y: tail.y + wrappedStep(last.at(-1).y - current.at(-1).y, board.rows),
  };
  line.push(lerpPoint(oldTail, tail, progress));
  return line;
}

/** Points sans doublon consécutif (une tête au départ de son pas est sur sa case d'avant) */
function withoutRepeats(points) {
  return points.filter((point, index) => {
    const prev = points.at(index - 1);
    return index === 0 || Math.hypot(point.x - prev.x, point.y - prev.y) > MIN_GAP;
  });
}

const midpoint = (a, b) => lerpPoint(a, b, 0.5);

/**
 * Morceaux du tracé : un demi-segment droit à chaque bout, et entre deux milieux de segment
 * une courbe de Bézier quadratique tenue par le coin (droite quand il n'y a pas de virage).
 * @param {{x: number, y: number}[]} points - Au moins deux
 * @returns {{from: object, control: object, to: object}[]}
 */
function curvePieces(points) {
  const first = { from: points.at(0), to: midpoint(points.at(0), points.at(1)) };
  const pieces = [{ ...first, control: midpoint(first.from, first.to) }];
  for (let index = 1; index < points.length - 1; index++) {
    pieces.push({
      from: midpoint(points.at(index - 1), points.at(index)),
      control: points.at(index),
      to: midpoint(points.at(index), points.at(index + 1)),
    });
  }
  const lastFrom = midpoint(points.at(-2), points.at(-1));
  pieces.push({ from: lastFrom, control: midpoint(lastFrom, points.at(-1)), to: points.at(-1) });
  return pieces;
}

/** Point d'une courbe de Bézier quadratique */
function bezierPoint({ from, control, to }, t) {
  const u = 1 - t;
  return {
    x: u * u * from.x + 2 * u * t * control.x + t * t * to.x,
    y: u * u * from.y + 2 * u * t * control.y + t * t * to.y,
  };
}

/**
 * Points rapprochés le long du corps, de la tête à la queue, avec leur distance à la tête
 * (s, en cases)
 * @param {{x: number, y: number}[]} points - Ligne médiane
 * @param {number} [step] - Écart visé entre deux points
 * @returns {{x: number, y: number, s: number}[]}
 */
export function sampleCenterline(points, step = SAMPLE_STEP) {
  const clean = withoutRepeats(points);
  const samples = [{ ...clean.at(0), s: 0 }];
  if (clean.length < 2) return samples;
  for (const piece of curvePieces(clean)) {
    const reach =
      Math.hypot(piece.control.x - piece.from.x, piece.control.y - piece.from.y) +
      Math.hypot(piece.to.x - piece.control.x, piece.to.y - piece.control.y);
    const count = Math.max(1, Math.ceil(reach / step));
    for (let index = 1; index <= count; index++) {
      const point = bezierPoint(piece, index / count);
      const prev = samples.at(-1);
      const length = Math.hypot(point.x - prev.x, point.y - prev.y);
      if (length > MIN_GAP) samples.push({ ...point, s: prev.s + length });
    }
  }
  return samples;
}

/**
 * Cap de la tête (radians, 0 vers la droite, sens horaire à l'écran) : direction d'un point
 * un peu en arrière vers la tête, pour qu'elle tourne en douceur pendant un virage
 * @param {{x: number, y: number, s: number}[]} samples
 * @param {{x: number, y: number}} fallback - Direction du jeu, si le corps est trop court
 * @returns {number}
 */
export function headingOf(samples, fallback) {
  const head = samples.at(0);
  const behind = samples.find(point => point.s >= HEADING_LOOKBACK) ?? samples.at(-1);
  if (!behind || behind.s < 0.05) return Math.atan2(fallback.y, fallback.x);
  return Math.atan2(head.y - behind.y, head.x - behind.x);
}

/**
 * Rayon du corps à une distance de la tête : plein, puis effilé vers la queue, gonflé là où
 * passe une pomme avalée
 * @param {number} s - Distance à la tête (cases)
 * @param {number} length - Longueur du corps (cases)
 * @param {number[]} [bulges] - Distances à la tête des pommes en train de descendre
 * @returns {number}
 */
export function bodyRadius(s, length, bulges = []) {
  const taper = Math.min(TAIL_TAPER, length * 0.75);
  const left = length - s;
  const base =
    left >= taper
      ? BODY_RADIUS
      : TAIL_TIP_RADIUS + (BODY_RADIUS - TAIL_TIP_RADIUS) * (Math.max(0, left) / taper) ** 0.65;
  const swell = bulges.reduce(
    (sum, at) => sum + BULGE_RADIUS * Math.exp(-(((s - at) / BULGE_SPREAD) ** 2)),
    0
  );
  return base + swell * (base / BODY_RADIUS);
}

/**
 * Normale (gauche du sens de marche, vers la queue) en chaque point du corps
 * @param {{x: number, y: number}[]} samples
 * @returns {{x: number, y: number}[]}
 */
export function normalsOf(samples) {
  return samples.map((_, index) => {
    const ahead = samples.at(Math.max(0, index - 1));
    const behind = samples.at(Math.min(samples.length - 1, index + 1));
    const dx = ahead.x - behind.x;
    const dy = ahead.y - behind.y;
    const length = Math.hypot(dx, dy) || 1;
    return { x: -dy / length, y: dx / length };
  });
}

/**
 * Contour du corps : un bord, le bout arrondi de la queue, l'autre bord
 * @param {{x: number, y: number, s: number}[]} samples
 * @param {(s: number) => number} radiusAt - Rayon à une distance de la tête
 * @param {{x: number, y: number}} [offset] - Décalage (ombre, reflet)
 * @returns {{x: number, y: number}[]}
 */
export function bodyOutline(samples, radiusAt, offset = NO_OFFSET) {
  const normals = normalsOf(samples);
  const side = sign =>
    samples.map((point, index) => {
      const radius = radiusAt(point.s) * sign;
      return {
        x: point.x + normals.at(index).x * radius + offset.x,
        y: point.y + normals.at(index).y * radius + offset.y,
      };
    });
  return [...side(1), ...tailCap(samples, normals, radiusAt, offset), ...side(-1).reverse()];
}

/** Demi-cercle au bout de la queue, d'un bord à l'autre */
function tailCap(samples, normals, radiusAt, offset) {
  const tip = samples.at(-1);
  const normal = normals.at(-1);
  const radius = radiusAt(tip.s);
  const start = Math.atan2(normal.y, normal.x);
  return Array.from({ length: 7 }, (_, index) => {
    const angle = start + (Math.PI * (index + 1)) / 8;
    return {
      x: tip.x + Math.cos(angle) * radius + offset.x,
      y: tip.y + Math.sin(angle) * radius + offset.y,
    };
  });
}

/**
 * Décalages (en cases) où redessiner le serpent quand il dépasse un bord : la partie qui sort
 * d'un côté réapparaît de l'autre
 * @param {{x: number, y: number}[]} samples
 * @param {{cols: number, rows: number}} board
 * @returns {{x: number, y: number}[]}
 */
export function wrapCopies(samples, board) {
  const xs = samples.map(point => point.x);
  const ys = samples.map(point => point.y);
  const shiftsOn = (values, size) => [
    0,
    ...(Math.min(...values) < DRAW_MARGIN - 0.5 ? [size] : []),
    ...(Math.max(...values) > size - 0.5 - DRAW_MARGIN ? [-size] : []),
  ];
  return shiftsOn(xs, board.cols).flatMap(x => shiftsOn(ys, board.rows).map(y => ({ x, y })));
}
