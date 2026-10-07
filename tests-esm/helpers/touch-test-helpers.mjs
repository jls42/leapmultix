/**
 * Gestes tactiles simulés pour les tests des mini-jeux.
 * jsdom n'a pas de constructeur Touch : chaque geste est un Event qui porte touches et
 * changedTouches, les seules propriétés que lisent les jeux.
 */

/**
 * Événement tactile au point donné (coordonnées de la fenêtre).
 * Un seul doigt par défaut : au lever, touches est vide et changedTouches garde le
 * dernier point. Avec plusieurs doigts, `others` donne ceux qui restent posés.
 * @param {'touchstart'|'touchmove'|'touchend'|'touchcancel'} type
 * @param {{x: number, y: number}} point - Doigt qui se pose, bouge ou se lève
 * @param {Array<{x: number, y: number}>} [others=[]] - Autres doigts posés
 * @returns {Event}
 */
export function touchEvent(type, point, others = []) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  const toTouch = (p, identifier) => ({ identifier, clientX: p.x, clientY: p.y });
  const changed = [toTouch(point, others.length)];
  const resting = others.map(toTouch);
  const lifted = type === 'touchend' || type === 'touchcancel';
  Object.defineProperty(event, 'touches', { value: lifted ? resting : [...resting, ...changed] });
  Object.defineProperty(event, 'changedTouches', { value: changed });
  return event;
}

/**
 * Glissement du doigt de `from` à `to`, en plusieurs pas, puis doigt levé.
 * @param {EventTarget} target
 * @param {{x: number, y: number}} from
 * @param {{x: number, y: number}} to
 * @param {number} [steps=4]
 */
export function swipe(target, from, to, steps = 4) {
  target.dispatchEvent(touchEvent('touchstart', from));
  let point = from;
  for (let i = 1; i <= steps; i++) {
    point = {
      x: from.x + ((to.x - from.x) * i) / steps,
      y: from.y + ((to.y - from.y) * i) / steps,
    };
    target.dispatchEvent(touchEvent('touchmove', point));
  }
  target.dispatchEvent(touchEvent('touchend', point));
}

/**
 * Toucher avec un vrai doigt : il peut trembler de quelques pixels et rester posé un moment.
 * @param {EventTarget} target
 * @param {{x: number, y: number}} point
 * @param {{jitter?: number, holdMs?: number, wait?: (ms: number) => void}} [options]
 *   jitter : déplacement du doigt pendant le toucher (pixels) ;
 *   holdMs et wait : durée du toucher, avancée par l'horloge simulée du test
 */
export function tap(target, point, { jitter = 0, holdMs = 0, wait } = {}) {
  target.dispatchEvent(touchEvent('touchstart', point));
  const end = { x: point.x + jitter, y: point.y + jitter };
  if (jitter) target.dispatchEvent(touchEvent('touchmove', end));
  if (holdMs && wait) wait(holdMs);
  target.dispatchEvent(touchEvent('touchend', end));
}

/**
 * Contexte 2D factice : jsdom ne dessine pas. Toute méthode existe et ne fait rien.
 * @returns {CanvasRenderingContext2D}
 */
export function fakeCanvasContext() {
  const state = {};
  return new Proxy(state, {
    get: (target, prop) => (prop in target ? target[prop] : () => ({ width: 0 })),
    set: (target, prop, value) => {
      target[prop] = value;
      return true;
    },
  });
}

/**
 * Le canevas occupe à l'écran sa taille interne, à partir du coin de la fenêtre
 * (jsdom ne calcule aucune mise en page).
 * @param {HTMLCanvasElement} canvas
 */
export function placeCanvasAtOrigin(canvas) {
  canvas.getBoundingClientRect = () => ({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    width: canvas.width,
    height: canvas.height,
    right: canvas.width,
    bottom: canvas.height,
  });
}
