// multimiam-layout.js - Orientation du labyrinthe de MultiMiam à l'écran (ESM)
// (c) LeapMultix - 2025
//
// Le labyrinthe fait 19 colonnes sur 15 rangées. Sur un écran en portrait, il se dessine
// transposé (15 × 19 : lignes et colonnes échangées) ; ses cases, presque carrées, prennent
// la largeur et la hauteur qui remplissent le plateau. Ses données, ses règles et les
// positions du jeu ne changent pas : seuls le dessin et la lecture des gestes et des flèches
// passent par ces correspondances.

// La transposition échange haut et gauche, bas et droite ; elle est sa propre inverse
const TRANSPOSED_DIRECTIONS = new Map([
  ['UP', 'LEFT'],
  ['LEFT', 'UP'],
  ['DOWN', 'RIGHT'],
  ['RIGHT', 'DOWN'],
]);

// Une case peut être plus haute que large (ou l'inverse) jusqu'à ce rapport : le labyrinthe
// remplit le plateau sans que les couloirs aient l'air étirés
export const MAX_CELL_STRETCH = 1.25;

/**
 * Cases d'un labyrinthe de `across` × `down` cases à l'écran qui remplissent `box` : largeur
 * et hauteur entières choisies séparément, l'une au plus MAX_CELL_STRETCH fois l'autre.
 * @param {number} across - Cases à l'écran, de gauche à droite
 * @param {number} down - Cases à l'écran, de haut en bas
 * @param {{width: number, height: number}} box - Place du plateau (pixels CSS)
 * @returns {{cellWidth: number, cellHeight: number}}
 */
export function fitMazeCells(across, down, box) {
  const widest = Math.max(1, Math.floor(box.width / across));
  const tallest = Math.max(1, Math.floor(box.height / down));
  const cellWidth = Math.min(widest, Math.floor(tallest * MAX_CELL_STRETCH));
  const cellHeight = Math.min(tallest, Math.floor(cellWidth * MAX_CELL_STRETCH));
  return { cellWidth, cellHeight };
}

/**
 * Orientation et cases qui remplissent le mieux le plateau : la plus grande surface de
 * labyrinthe à l'écran (transposé sur un téléphone en portrait).
 * @param {number} cols - Colonnes du labyrinthe
 * @param {number} rows - Rangées du labyrinthe
 * @param {{width: number, height: number}} box - Place du plateau (pixels CSS)
 * @returns {{transposed: boolean, cellWidth: number, cellHeight: number}}
 */
export function chooseMazeLayout(cols, rows, box) {
  const [upright, transposed] = [false, true].map(isTransposed => {
    const across = isTransposed ? rows : cols;
    const down = isTransposed ? cols : rows;
    const cells = fitMazeCells(across, down, box);
    const area = across * cells.cellWidth * down * cells.cellHeight;
    return { transposed: isTransposed, ...cells, area };
  });
  const best = transposed.area > upright.area ? transposed : upright;
  return { transposed: best.transposed, cellWidth: best.cellWidth, cellHeight: best.cellHeight };
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
