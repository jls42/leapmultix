/**
 * Écran de téléphone ou d'ordinateur simulé pour les plateaux d'Arcade : jsdom ne calcule
 * aucune mise en page, ces aides donnent à la zone de jeu une largeur, un haut, et à la
 * consigne et à « Abandonner » une hauteur, comme dans Chrome.
 */

const ANDROID_UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36';

/** Zone de jeu du gabarit commun : canevas puis « Abandonner » (js/components/infoBar.js) */
export function renderArcadeStage(canvasId) {
  document.body.replaceChildren();
  const game = document.createElement('div');
  game.id = 'game';
  const stage = document.createElement('div');
  stage.className = 'arcade-game-ui';
  const canvas = document.createElement('canvas');
  canvas.id = canvasId;
  const abandon = document.createElement('button');
  abandon.className = 'btn btn-secondary';
  abandon.textContent = 'Abandonner';
  stage.append(canvas, abandon);
  game.append(stage);
  document.body.append(game);
  return { stage, canvas, abandon };
}

function rect(left, top, width, height) {
  return { left, top, width, height, right: left + width, bottom: top + height, x: left, y: top };
}

/**
 * Pose un écran : la zone de jeu commence à `top`, la consigne et « Abandonner » ont leur
 * hauteur ; le canevas s'affiche à sa taille de style (ou interne).
 * @param {{width: number, height: number, top?: number, instructionHeight?: number,
 *   abandonHeight?: number}} screen
 * @returns {() => void} Retour à jsdom
 */
export function simulateArcadeScreen(screen) {
  const { width, height, top = 175, instructionHeight = 66, abandonHeight = 48 } = screen;
  const saved = {
    innerWidth: globalThis.innerWidth,
    innerHeight: globalThis.innerHeight,
    rectOf: HTMLElement.prototype.getBoundingClientRect,
    clientWidth: Object.getOwnPropertyDescriptor(Element.prototype, 'clientWidth'),
  };
  globalThis.innerWidth = width;
  globalThis.innerHeight = height;
  Object.defineProperty(Element.prototype, 'clientWidth', {
    configurable: true,
    get() {
      return this.classList?.contains('arcade-game-ui') ? width : 0;
    },
  });
  HTMLElement.prototype.getBoundingClientRect = function simulatedRect() {
    if (this.classList.contains('arcade-game-ui')) return rect(0, top, width, height - top);
    if (this.classList.contains('game-instructions')) return rect(0, 0, width, instructionHeight);
    if (this.tagName === 'BUTTON') return rect(0, 0, 280, abandonHeight);
    if (this.tagName === 'CANVAS') {
      const w = Number.parseFloat(this.style.width) || this.width;
      const h = Number.parseFloat(this.style.height) || this.height;
      return rect(0, top, w, h);
    }
    return rect(0, 0, 0, 0);
  };
  return () => {
    globalThis.innerWidth = saved.innerWidth;
    globalThis.innerHeight = saved.innerHeight;
    HTMLElement.prototype.getBoundingClientRect = saved.rectOf;
    if (saved.clientWidth)
      Object.defineProperty(Element.prototype, 'clientWidth', saved.clientWidth);
  };
}

/**
 * Agent utilisateur d'un téléphone Android (les jeux reconnaissent un mobile ainsi).
 * @returns {() => void} Retour à l'agent de jsdom
 */
export function useAndroidUserAgent() {
  const saved = Object.getOwnPropertyDescriptor(globalThis.navigator, 'userAgent');
  Object.defineProperty(globalThis.navigator, 'userAgent', {
    value: ANDROID_UA,
    configurable: true,
  });
  return () => {
    if (saved) Object.defineProperty(globalThis.navigator, 'userAgent', saved);
    else Reflect.deleteProperty(globalThis.navigator, 'userAgent');
  };
}
