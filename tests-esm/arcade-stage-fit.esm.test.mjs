/**
 * Place du plateau d'Arcade (js/arcade-common.js) : la grille se choisit pour la place
 * qui restera une fois la consigne partie, la consigne et « Abandonner » passent à côté du
 * plateau sur un téléphone tourné, le plein écran ne compte pas les marges de la page, et
 * le plateau suit l'écran (rotation, plein écran, consigne qui part) sans changer la partie.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';

const {
  showGameInstructions,
  getArcadeCanvasBox,
  fitArcadeCanvas,
  readableCanvasFontSize,
  watchArcadeViewport,
  STAGE_CHANGE_EVENT,
} = await import('../js/arcade-common.js');

/** Zone de jeu telle que la crée le gabarit commun (js/components/infoBar.js) */
function renderStage() {
  document.body.replaceChildren();
  const slide = document.createElement('section');
  slide.id = 'slide4';
  slide.className = 'slide active-slide';
  const game = document.createElement('div');
  game.id = 'game';
  const stage = document.createElement('div');
  stage.className = 'arcade-game-ui';
  const canvas = document.createElement('canvas');
  canvas.id = 'c';
  const abandon = document.createElement('button');
  abandon.id = 'abandon';
  abandon.textContent = 'Abandonner';
  stage.append(canvas, abandon);
  game.append(stage);
  slide.append(game);
  document.body.append(slide);
  return { slide, game, stage, canvas, abandon };
}

/** Style calculé décrit par le test (jsdom ne calcule pas la mise en page) */
function computed(style = {}) {
  const { custom = {}, ...rest } = style;
  return {
    ...rest,
    getPropertyValue: name => new Map(Object.entries(custom)).get(name) ?? '',
  };
}

/** Remplace getComputedStyle et getBoundingClientRect des éléments donnés */
function mockLayout(entries) {
  const styles = new Map();
  for (const [el, { rect, style }] of entries) {
    if (rect) {
      const [left, top, width, height] = rect;
      el.getBoundingClientRect = () => ({
        left,
        top,
        width,
        height,
        right: left + width,
        bottom: top + height,
        x: left,
        y: top,
      });
    }
    styles.set(el, computed(style));
  }
  const original = globalThis.getComputedStyle;
  globalThis.getComputedStyle = el => styles.get(el) ?? original(el);
  return () => {
    globalThis.getComputedStyle = original;
  };
}

const FRAME_2PX = {
  borderTopWidth: '2px',
  borderRightWidth: '2px',
  borderBottomWidth: '2px',
  borderLeftWidth: '2px',
};

let previousHeight;

beforeEach(() => {
  previousHeight = globalThis.innerHeight;
  globalThis.innerHeight = 844;
});

afterEach(() => {
  globalThis.innerHeight = previousHeight;
  Reflect.deleteProperty(document, 'fullscreenElement');
  jest.useRealTimers();
});

describe('Place du plateau : la consigne ne compte pas pour choisir la grille', () => {
  test('ignoreInstructions rend la place qui restera quand la consigne sera partie', () => {
    const { stage, canvas, abandon } = renderStage();
    const instructions = showGameInstructions(canvas, 'Glisse le doigt');
    Object.defineProperty(stage, 'clientWidth', { value: 390, configurable: true });
    const restore = mockLayout([
      [stage, { rect: [0, 175, 390, 600], style: { rowGap: '12px' } }],
      [canvas, { style: FRAME_2PX }],
      [instructions, { rect: [0, 0, 351, 66] }],
      [abandon, { rect: [0, 0, 280, 48] }],
    ]);
    try {
      // 844 − 175 − (66 + 12) − (48 + 12) − 4 (cadre)
      expect(getArcadeCanvasBox(canvas).height).toBe(527);
      // La consigne partira : seule « Abandonner » reste sous le plateau
      expect(getArcadeCanvasBox(canvas, { ignoreInstructions: true }).height).toBe(605);
    } finally {
      restore();
    }
  });
});

describe('Place du plateau : un plateau plus étroit que la zone peut regrandir', () => {
  test('les marges automatiques qui centrent le canevas ne prennent pas de place', () => {
    const { stage, canvas, abandon } = renderStage();
    Object.defineProperty(stage, 'clientWidth', { value: 366, configurable: true });
    // Canevas de 312 px centré : le navigateur rend ses marges « auto » en pixels
    const restore = mockLayout([
      [stage, { rect: [12, 175, 366, 600], style: { rowGap: '12px' } }],
      [canvas, { style: { ...FRAME_2PX, marginLeft: '25px', marginRight: '25px' } }],
      [abandon, { rect: [0, 0, 280, 48] }],
    ]);
    try {
      expect(getArcadeCanvasBox(canvas).width).toBe(362);
    } finally {
      restore();
    }
  });
});

describe('Place du plateau : la page défilée ne la fausse pas', () => {
  test('le haut de la zone se mesure comme si la page était en haut', () => {
    const { game, stage, canvas, abandon } = renderStage();
    Object.defineProperty(stage, 'clientWidth', { value: 390, configurable: true });
    // La page a défilé de 30 px : la zone paraît 30 px plus haut qu'elle n'est
    Object.defineProperty(game, 'scrollTop', { value: 30, configurable: true });
    const restore = mockLayout([
      [stage, { rect: [0, 145, 390, 600], style: { rowGap: '12px' } }],
      [canvas, { style: FRAME_2PX }],
      [abandon, { rect: [0, 0, 280, 48] }],
    ]);
    try {
      // 844 − (145 + 30) − (48 + 12) − 4
      expect(getArcadeCanvasBox(canvas).height).toBe(605);
    } finally {
      restore();
    }
  });
});

describe('Place du plateau : téléphone tourné, consigne et « Abandonner » à côté', () => {
  test('la colonne de côté se retire de la largeur, rien ne se retire de la hauteur', () => {
    const { stage, canvas, abandon } = renderStage();
    const instructions = showGameInstructions(canvas, 'Glisse le doigt');
    Object.defineProperty(stage, 'clientWidth', { value: 820, configurable: true });
    globalThis.innerHeight = 390;
    const restore = mockLayout([
      [
        stage,
        {
          rect: [12, 120, 820, 260],
          style: {
            rowGap: '12px',
            columnGap: '16px',
            gridTemplateColumns: '560px 192px',
            custom: { '--arcade-stage-flow': 'row' },
          },
        },
      ],
      [canvas, { style: FRAME_2PX }],
      [instructions, { rect: [0, 0, 192, 120] }],
      [abandon, { rect: [0, 0, 180, 48] }],
    ]);
    try {
      const box = getArcadeCanvasBox(canvas, { minHeight: 100 });
      // 820 − 192 (colonne de côté) − 16 (écart) − 4 (cadre)
      expect(box.width).toBe(608);
      // 390 − 120 − 4 : la consigne et « Abandonner » ne prennent rien en hauteur
      expect(box.height).toBe(266);
    } finally {
      restore();
    }
  });
});

describe('Place du plateau en plein écran', () => {
  test('les marges de la page, hors du plein écran, ne comptent plus', () => {
    const { slide, game, stage, canvas, abandon } = renderStage();
    Object.defineProperty(stage, 'clientWidth', { value: 390, configurable: true });
    const restore = mockLayout([
      [stage, { rect: [0, 100, 390, 600], style: { rowGap: '12px' } }],
      [canvas, { style: FRAME_2PX }],
      [abandon, { rect: [0, 0, 280, 48] }],
      [game, { style: { paddingBottom: '8px' } }],
      [slide, { style: { paddingBottom: '40px' } }],
    ]);
    try {
      // Hors plein écran : 844 − 100 − (48 + 12) − 8 − 40 − 4
      expect(getArcadeCanvasBox(canvas).height).toBe(632);
      Object.defineProperty(document, 'fullscreenElement', { value: game, configurable: true });
      // En plein écran, seule la marge du bas de #game compte
      expect(getArcadeCanvasBox(canvas).height).toBe(672);
    } finally {
      restore();
    }
  });
});

describe('Mise à l’échelle du plateau sans changer la partie', () => {
  test('le dessin garde sa taille interne et ses proportions, l’affichage remplit la place', () => {
    const { canvas } = renderStage();
    canvas.width = 400;
    canvas.height = 600;
    expect(fitArcadeCanvas(canvas, { width: 300, height: 300 })).toBeCloseTo(0.5, 5);
    expect([canvas.style.width, canvas.style.height]).toEqual(['200px', '300px']);
    // Plus de place (plein écran) : le plateau grandit, toujours sans déformation
    fitArcadeCanvas(canvas, { width: 1000, height: 900 });
    expect([canvas.style.width, canvas.style.height]).toEqual(['600px', '900px']);
    expect([canvas.width, canvas.height]).toEqual([400, 600]);
  });

  test('les nombres restent lisibles aussitôt après une mise à l’échelle', () => {
    const { canvas } = renderStage();
    canvas.width = 400;
    canvas.height = 600;
    let shown = 400;
    canvas.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: shown,
      height: (shown * 3) / 2,
      right: shown,
      bottom: (shown * 3) / 2,
    });
    // Affiché à sa taille : 12 px internes ne suffisent pas, 16 px oui
    expect(readableCanvasFontSize(canvas, 12)).toBe(16);
    shown = 200;
    fitArcadeCanvas(canvas, { width: 200, height: 300 });
    // Affiché à moitié : il faut 32 px internes pour 16 px à l'écran, tout de suite
    expect(readableCanvasFontSize(canvas, 12)).toBe(32);
  });
});

describe('Le plateau suit l’écran', () => {
  test('une rafale de redimensionnements ne recalcule qu’une fois par image', () => {
    jest.useFakeTimers();
    const { canvas } = renderStage();
    const onChange = jest.fn();
    const stop = watchArcadeViewport(canvas, onChange);
    globalThis.dispatchEvent(new Event('resize'));
    globalThis.dispatchEvent(new Event('resize'));
    document.dispatchEvent(new Event('fullscreenchange'));
    expect(onChange).not.toHaveBeenCalled();
    jest.advanceTimersByTime(50);
    expect(onChange).toHaveBeenCalledTimes(1);
    stop();
  });

  test('la consigne qui part libère de la place : le plateau se recalcule', () => {
    jest.useFakeTimers();
    const { canvas, stage } = renderStage();
    const changes = jest.fn();
    stage.addEventListener(STAGE_CHANGE_EVENT, changes);
    const onChange = jest.fn();
    watchArcadeViewport(canvas, onChange);
    showGameInstructions(canvas, 'Glisse le doigt', 'neutral', 1000);
    jest.advanceTimersByTime(1000 + 320);
    expect(changes).toHaveBeenCalled();
    jest.advanceTimersByTime(50);
    expect(onChange).toHaveBeenCalled();
  });

  test('le bandeau qui change de hauteur (calcul affiché, langue) fait revoir la place', () => {
    jest.useFakeTimers();
    const { game, canvas } = renderStage();
    const banner = document.createElement('div');
    banner.className = 'arcade-mult-display';
    game.prepend(banner);
    const observed = [];
    const saved = globalThis.ResizeObserver;
    globalThis.ResizeObserver = class {
      constructor(callback) {
        this.callback = callback;
      }
      observe(element) {
        observed.push({ element, callback: this.callback });
      }
      disconnect() {}
    };
    try {
      const onChange = jest.fn();
      watchArcadeViewport(canvas, onChange);
      expect(observed.map(entry => entry.element)).toEqual([banner]);
      observed[0].callback([]);
      jest.advanceTimersByTime(50);
      expect(onChange).toHaveBeenCalledTimes(1);
    } finally {
      globalThis.ResizeObserver = saved;
    }
  });

  test('une fois le jeu retiré de la page, plus aucun recalcul', () => {
    jest.useFakeTimers();
    const { canvas } = renderStage();
    const onChange = jest.fn();
    const removeSpy = jest.spyOn(globalThis, 'removeEventListener');
    watchArcadeViewport(canvas, onChange);
    canvas.remove();
    globalThis.dispatchEvent(new Event('resize'));
    jest.advanceTimersByTime(50);
    expect(onChange).not.toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    removeSpy.mockRestore();
  });
});
