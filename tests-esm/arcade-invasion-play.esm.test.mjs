/* eslint-env jest, node */
/**
 * MultiInvaders joué image par image : le canevas note ce qui est dessiné, la boucle avance
 * à la main. Bugs constatés à la lecture et reproduits ici avant correction :
 * - un tir qui ne touche rien n'était jamais retiré : dessiné hors du plateau toute la partie ;
 * - tirer sur la bonne réponse effaçait un instant tous les monstres (ils descendaient
 *   pourtant toujours et restaient touchables) ;
 * - une vague ratée comptait une erreur, puis un succès pour le même calcul ;
 * - une flèche tenue à la fin d'une partie faisait dériver la fusée dans la suivante ;
 * - l'ami libéré relançait une question 1,2 s plus tard, même partie arrêtée : dans une
 *   partie relancée entre-temps, la question affichée changeait sous les monstres.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { placeCanvasAtOrigin } from './helpers/touch-test-helpers.mjs';

const noop = () => undefined;
const recordOperationResult = jest.fn();
jest.unstable_mockModule('../js/utils-es6.js', () => ({
  addArrowKeyNavigation: noop,
  startBackgroundRotation: noop,
  updateBackgroundByAvatar: noop,
  updateCoinDisplay: noop,
  updateWelcomeMessageUI: noop,
  getDailyChallengeTable: () => '3',
  showMessage: noop,
  getTranslation: k => k,
  cleanupGameResources: noop,
  speak: noop,
  isVoiceEnabled: () => false,
  playSound: noop,
  showArcadePoints: noop,
  updateInfoBar: noop,
  showArcadeMessage: noop,
  saveArcadeScore: noop,
  getArcadeScores: () => [],
  resetArcadeScores: noop,
  saveArcadeScoreSnake: noop,
  getArcadeScoresSnake: () => [],
  resetArcadeScoresSnake: noop,
  saveArcadeScorePacman: noop,
  getArcadeScoresPacman: () => [],
  resetArcadeScoresPacman: noop,
  saveArcadeScoreMemory: noop,
  getArcadeScoresMemory: () => [],
  resetArcadeScoresMemory: noop,
}));
jest.unstable_mockModule('../js/slides.js', () => ({ goToSlide: noop }));
jest.unstable_mockModule('../js/mode-orchestrator.js', () => ({ setGameMode: async () => {} }));
jest.unstable_mockModule('../js/core/audio.js', () => ({
  AudioManager: { stopAll: noop, playSound: noop },
}));
jest.unstable_mockModule('../js/core/operation-stats.js', () => ({ recordOperationResult }));
// Images toujours « chargées » : chaque dessin d'image note sa source et sa boîte
jest.unstable_mockModule('../js/arcade-sprites.js', () => ({
  devicePixelsPerUnit: () => 1,
  ArcadeSprite: class {},
  spriteFor: spec => ({ spec }),
  fitRect: (fit, box) => box,
  prefetchArcadeSprite: noop,
  drawArcadeSprite: (ctx, sprite, box) => {
    frame.push({ op: 'sprite', source: sprite?.spec?.source ?? '', box: { ...box } });
    return true;
  },
}));

const { startMultiplicationInvasion } = await import('../js/arcade-invasion.js');
const { stopArcadeMode, arcadeControls } = await import('../js/arcade.js');
const { getArcadeCanvasSize } = await import('../js/arcade-common.js');

const YELLOW = '#ffff00';
/** Ce que la dernière image a dessiné */
let frame = [];
let nextFrame = null;
let clock = 0;

/** Contexte 2D qui note chaque dessin avec la couleur en cours */
function recordingContext() {
  const state = { fillStyle: '' };
  return new Proxy(state, {
    get: (target, prop) => {
      if (prop in target) return target[prop];
      return (...args) => {
        frame.push({ op: prop, args, fillStyle: target.fillStyle });
        return { width: 10 };
      };
    },
    set: (target, prop, value) => {
      target[prop] = value;
      return true;
    },
  });
}

/** Avance le jeu de `count` images de 1/60 s */
function play(count) {
  for (let i = 0; i < count && nextFrame; i++) {
    const callback = nextFrame;
    nextFrame = null;
    frame = [];
    clock += 1000 / 60;
    callback(clock);
  }
}

/** Nombres portés par les monstres dessinés à la dernière image, avec leur abscisse */
const labels = () =>
  frame.filter(d => d.op === 'fillText').map(d => ({ value: Number(d.args[0]), x: d.args[1] }));
const bulletsDrawn = () => frame.filter(d => d.op === 'fillRect' && d.fillStyle === YELLOW);
const question = () => document.querySelector('.arcade-question')?.textContent ?? '';

/** Réponse attendue, lue dans le bandeau (« 7 × 5 = ? ») */
function expectedAnswer() {
  const [a, b] = question().match(/\d+/g).map(Number);
  return a * b;
}

/** Vise l'abscisse du plateau donnée, et tire */
function shootAt(x) {
  const canvas = document.getElementById('arcade-canvas');
  canvas.dispatchEvent(new MouseEvent('mousemove', { clientX: x, clientY: 10, bubbles: true }));
  canvas.dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: x, bubbles: true }));
}

function startGame() {
  const game = document.createElement('div');
  game.id = 'game';
  document.body.replaceChildren(game);
  startMultiplicationInvasion();
  placeCanvasAtOrigin(document.getElementById('arcade-canvas'));
  play(1);
}

beforeEach(() => {
  frame = [];
  nextFrame = null;
  clock = 0;
  recordOperationResult.mockClear();
  HTMLCanvasElement.prototype.getContext = () => recordingContext();
  jest.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(callback => {
    nextFrame = callback;
    return 1;
  });
  startGame();
});

afterEach(() => {
  stopArcadeMode();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('MultiInvaders : les tirs', () => {
  test('un tir qui ne touche rien quitte le plateau et n’est plus dessiné', () => {
    // Tout à gauche : la rangée de monstres commence plus loin
    shootAt(0);
    play(5);
    expect(bulletsDrawn()).toHaveLength(1);
    play(200);
    expect(bulletsDrawn()).toHaveLength(0);
  });
});

describe('MultiInvaders : tirer sur la bonne réponse', () => {
  /** Tire sur le monstre de la bonne réponse et avance jusqu'à ce qu'il soit touché */
  function hitTheFriend() {
    const target = labels().find(label => label.value === expectedAnswer());
    shootAt(target.x);
    for (let i = 0; i < 120 && recordOperationResult.mock.calls.length === 0; i++) play(1);
  }

  test('les monstres restent dessinés pendant que l’ami apparaît', () => {
    expect(labels()).toHaveLength(5);
    hitTheFriend();
    expect(recordOperationResult).toHaveBeenCalledTimes(1);
    play(1);
    expect(labels()).toHaveLength(5);
  });

  test('une vague ratée compte une seule fois, comme une erreur', () => {
    const answer = expectedAnswer();
    hitTheFriend();
    play(30);
    // Les quatre mauvaises réponses abattues : l'ami est libéré
    for (const label of labels().filter(l => l.value !== answer)) {
      shootAt(label.x);
      for (let i = 0; i < 120 && labels().some(l => l.value === label.value); i++) play(1);
    }
    play(5);
    expect(recordOperationResult.mock.calls.map(call => call[3])).toEqual([false]);
  });
});

describe('MultiInvaders : d’une partie à l’autre', () => {
  test('une flèche tenue à la fin d’une partie ne fait pas dériver la suivante', () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(arcadeControls.leftPressed).toBe(true);
    stopArcadeMode();
    startGame();
    expect(arcadeControls.leftPressed).toBe(false);
  });

  test('l’ami libéré ne relance pas de question dans une partie arrêtée puis relancée', () => {
    jest.useFakeTimers({ doNotFake: ['requestAnimationFrame', 'performance'] });
    const answer = expectedAnswer();
    for (const label of labels().filter(l => l.value !== answer)) {
      shootAt(label.x);
      for (let i = 0; i < 120 && labels().some(l => l.value === label.value); i++) play(1);
    }
    play(2);
    expect(recordOperationResult.mock.calls.map(call => call[3])).toEqual([true]);
    stopArcadeMode();
    startGame();
    const span = document.querySelector('.arcade-question');
    const observer = new MutationObserver(() => undefined);
    observer.observe(span, { childList: true, characterData: true, subtree: true });
    jest.advanceTimersByTime(1500);
    // Lu tout de suite : le bandeau ne doit avoir reçu aucune écriture
    expect(observer.takeRecords()).toHaveLength(0);
    observer.disconnect();
  });
});

describe('MultiInvaders : tout reste dans le plateau', () => {
  const boxes = () => frame.filter(d => d.op === 'sprite').map(d => d.box);
  /** Dessin de la fusée : la boîte la plus basse */
  const ship = () => boxes().reduce((low, box) => (box.y > low.y ? box : low));

  test.each([
    ['tout à droite', 100000],
    ['tout à gauche', -100000],
  ])('la fusée visée %s reste entière', (_, x) => {
    const { width } = getArcadeCanvasSize(document.getElementById('arcade-canvas'));
    shootAt(x);
    play(2);
    const box = ship();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
  });

  test('la fusée tenue au clavier contre le bord droit reste entière', () => {
    const { width } = getArcadeCanvasSize(document.getElementById('arcade-canvas'));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    play(300);
    const box = ship();
    expect(box.x + box.width).toBeLessThanOrEqual(width);
  });
});
