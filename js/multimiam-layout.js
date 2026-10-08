// multimiam-layout.js - Orientation du labyrinthe de MultiMiam à l'écran (ESM)
// (c) LeapMultix - 2025
//
// Le labyrinthe fait 19 colonnes sur 15 rangées. Sur un écran en portrait, il se dessine
// transposé (15 × 19 : lignes et colonnes échangées) pour de plus grandes cases. Ses données,
// ses règles et les positions du jeu ne changent pas : seuls le dessin et la lecture des
// gestes et des flèches passent par ces correspondances.

// La transposition échange haut et gauche, bas et droite ; elle est sa propre inverse
const TRANSPOSED_DIRECTIONS = new Map([
  ['UP', 'LEFT'],
  ['LEFT', 'UP'],
  ['DOWN', 'RIGHT'],
  ['RIGHT', 'DOWN'],
]);

/**
 * Faut-il dessiner le labyrinthe transposé ? Oui s'il y gagne de plus grandes cases.
 * @param {number} cols - Colonnes du labyrinthe
 * @param {number} rows - Rangées du labyrinthe
 * @param {{width: number, height: number}} box - Place du plateau (pixels CSS)
 * @returns {boolean}
 */
export function shouldTransposeMaze(cols, rows, box) {
  const cell = (across, down) => Math.floor(Math.min(box.width / across, box.height / down));
  return cell(rows, cols) > cell(cols, rows);
}

/**
 * Case du labyrinthe → case à l'écran (et inversement : la transposition est sa propre
 * inverse).
 * @param {number} x
 * @param {number} y
 * @param {boolean} transposed
 * @returns {{x: number, y: number}}
 */
export function mazeToScreen(x, y, transposed) {
  return transposed ? { x: y, y: x } : { x, y };
}

/**
 * Direction à l'écran → direction dans le labyrinthe (et inversement).
 * @param {string} direction - UP, DOWN, LEFT ou RIGHT
 * @param {boolean} transposed
 * @returns {string}
 */
export function transposeDirection(direction, transposed) {
  if (!transposed) return direction;
  return TRANSPOSED_DIRECTIONS.get(direction) || direction;
}
