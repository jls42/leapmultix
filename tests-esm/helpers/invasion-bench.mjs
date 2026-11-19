/**
 * Banc de MultiInvaders joué image par image : le canevas note ce qui est dessiné, la boucle
 * du jeu (requestAnimationFrame) avance à la main, et les monstres se lisent dans la dernière
 * image dessinée.
 */
export function createInvasionBench() {
  /** Ce que la dernière image a dessiné */
  let frame = [];
  let nextFrame = null;
  let clock = 0;

  return {
    /** Avant chaque partie : aucune image dessinée, horloge à zéro */
    reset() {
      frame = [];
      nextFrame = null;
      clock = 0;
    },

    /** Écran de jeu vide, où le jeu pose son bandeau et son plateau */
    mountGameScreen() {
      document.body.replaceChildren(Object.assign(document.createElement('div'), { id: 'game' }));
    },

    /** Contexte 2D qui note chaque dessin */
    context() {
      return new Proxy(
        {},
        {
          get: (target, prop) => {
            if (prop in target) return Reflect.get(target, prop);
            return (...args) => {
              frame.push({ op: prop, args });
              return { width: 10 };
            };
          },
          set: (target, prop, value) => Reflect.set(target, prop, value),
        }
      );
    },

    /** Remplace requestAnimationFrame : l'image suivante attend play() */
    schedule(callback) {
      nextFrame = callback;
      return 1;
    },

    /** Avance le jeu de `count` images de 1/60 s */
    play(count) {
      for (let i = 0; i < count && nextFrame; i++) {
        const callback = nextFrame;
        nextFrame = null;
        frame = [];
        clock += 1000 / 60;
        callback(clock);
      }
    },

    /** Nombres portés par les monstres dessinés à la dernière image, avec leur abscisse */
    labels() {
      return frame
        .filter(drawn => drawn.op === 'fillText')
        .map(drawn => ({ value: Number(drawn.args[0]), x: drawn.args[1] }));
    },

    /** Réponse attendue, lue dans le bandeau (« 7 × 5 = ? ») */
    expectedAnswer() {
      const text = document.querySelector('.arcade-question')?.textContent ?? '';
      const [a, b] = text.match(/\d+/g).map(Number);
      return a * b;
    },

    /** Vise l'abscisse du plateau donnée, et tire */
    shootAt(x) {
      const canvas = document.getElementById('arcade-canvas');
      const at = { clientX: x, clientY: 10, bubbles: true };
      canvas.dispatchEvent(new MouseEvent('mousemove', at));
      canvas.dispatchEvent(new MouseEvent('mousedown', { ...at, button: 0 }));
    },
  };
}
