/* =====================
   Gestes tactiles des mini-jeux qu'on dirige (MultiSnake, MultiMiam)
   - Glisser : la direction suit le doigt dès qu'il a parcouru quelques pixels, et un
     même geste peut enchaîner plusieurs virages.
   - Toucher : un doigt levé sans avoir glissé est un toucher, quelle que soit sa durée,
     même s'il a un peu tremblé (un vrai doigt n'est jamais immobile).
   ===================== */

/** Course du doigt (pixels CSS) à partir de laquelle il glisse au lieu de toucher */
export const SWIPE_THRESHOLD_PX = 10;

/**
 * Direction d'un déplacement du doigt, selon son axe dominant.
 * @param {number} dx - Déplacement horizontal (pixels CSS)
 * @param {number} dy - Déplacement vertical (pixels CSS)
 * @param {number} [threshold=SWIPE_THRESHOLD_PX]
 * @returns {'UP'|'DOWN'|'LEFT'|'RIGHT'|null} null tant que le doigt n'a pas assez bougé
 */
export function swipeDirection(dx, dy, threshold = SWIPE_THRESHOLD_PX) {
  if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return null;
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'RIGHT' : 'LEFT';
  return dy > 0 ? 'DOWN' : 'UP';
}

// Le geste appartient au jeu : ni défilement, ni zoom, ni clic simulé par le navigateur
function keepGesture(e) {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
}

/**
 * Branche le glissement et le toucher sur le canevas d'un jeu.
 * @param {HTMLCanvasElement} canvas
 * @param {{onSwipe: (direction: 'UP'|'DOWN'|'LEFT'|'RIGHT') => void,
 *   onTap: (clientX: number, clientY: number) => void}} handlers
 *   onSwipe à chaque virage du doigt ; onTap au lever d'un doigt qui n'a pas glissé,
 *   avec le point où il s'était posé (coordonnées de la fenêtre)
 * @returns {Array<{element: HTMLCanvasElement, type: string, callback: Function, options: object}>}
 *   Écouteurs posés, à retirer au nettoyage du jeu
 */
export function attachDirectionalTouch(canvas, { onSwipe, onTap }) {
  // Point où le doigt s'est posé, et repère du glissement depuis le dernier virage
  let start = null;
  let anchor = null;
  let swiped = false;

  const onTouchStart = e => {
    keepGesture(e);
    const touch = e.touches?.[0];
    if (!touch) return;
    start = { x: touch.clientX, y: touch.clientY };
    anchor = start;
    swiped = false;
  };

  const onTouchMove = e => {
    keepGesture(e);
    const touch = e.touches?.[0];
    if (!touch || !anchor) return;
    const direction = swipeDirection(touch.clientX - anchor.x, touch.clientY - anchor.y);
    if (!direction) return;
    swiped = true;
    anchor = { x: touch.clientX, y: touch.clientY };
    onSwipe(direction);
  };

  const onTouchEnd = e => {
    keepGesture(e);
    const tapped = start && !swiped ? start : null;
    // Geste fini : un deuxième doigt levé ensuite ne vaut pas un second toucher
    start = null;
    anchor = null;
    swiped = false;
    if (tapped) onTap(tapped.x, tapped.y);
  };

  const options = { passive: false };
  const listeners = [
    { element: canvas, type: 'touchstart', callback: onTouchStart, options },
    { element: canvas, type: 'touchmove', callback: onTouchMove, options },
    { element: canvas, type: 'touchend', callback: onTouchEnd, options },
  ];
  for (const { type, callback } of listeners) {
    canvas.addEventListener(type, callback, options);
  }
  return listeners;
}
