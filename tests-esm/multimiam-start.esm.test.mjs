/* eslint-env jest, node */
/**
 * Lancement de MultiMiam (startPacmanArcade) décrit appel par appel : écran préparé, minuteur
 * du niveau, partie créée avec le niveau, la table ou l'opération, l'opérateur et l'avatar du
 * joueur, puis reliée au bouton Accueil. Sert à découper le lanceur sans rien changer.
 */
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

const log = [];
const note =
  name =>
  (...args) => {
    log.push(
      `${name}(${args.map(a => (typeof a === 'function' ? 'fn' : JSON.stringify(a))).join(', ')})`
    );
  };
const gameState = {};
const userData = {};
let stopThrows = false;

jest.unstable_mockModule('../js/difficulty.js', () => ({
  getDifficultySettings: level => {
    note('getDifficultySettings')(level);
    return { timeSeconds: `${level}-s`, tables: [`${level}-t`], distractorDistance: `${level}-d` };
  },
}));
jest.unstable_mockModule('../js/arcade-utils.js', () => ({
  loadSingleAvatar: name => ({ sprite: name }),
}));
jest.unstable_mockModule('../js/multimiam.js', () => ({
  default: class {
    constructor(...args) {
      note('new PacmanGame')(...args);
      this.score = 7;
    }
    start() {
      note('start')(this.difficultySettings, this.tables, this.distractorDistance, this.avatar);
    }
    pause() {
      note('pause')();
    }
  },
}));
jest.unstable_mockModule('../js/game.js', () => ({ gameState }));
jest.unstable_mockModule('../js/slides.js', () => ({ goToSlide: note('goToSlide') }));
jest.unstable_mockModule('../js/utils-es6.js', () => ({
  getTranslation: key => `«${key}»`,
  cleanupGameResources: note('cleanupGameResources'),
}));
jest.unstable_mockModule('../js/mode-orchestrator.js', () => ({
  setStartingMode: note('setStartingMode'),
}));
jest.unstable_mockModule('../js/arcade.js', () => ({
  startArcadeTimer: note('startArcadeTimer'),
  showArcadeGameOver: note('showArcadeGameOver'),
  stopArcadeMode: () => {
    note('stopArcadeMode')();
    if (stopThrows) throw new Error('pas de mode arcade');
  },
}));
jest.unstable_mockModule('../js/core/eventBus.js', () => ({
  eventBus: { on: note('eventBus.on') },
}));
jest.unstable_mockModule('../js/arcade-common.js', () => ({
  showGameInstructions: (canvas, text) => note('showGameInstructions')(canvas.id, text),
  prepareArcadeStage: canvas => note('prepareArcadeStage')(canvas.id),
}));
jest.unstable_mockModule('../js/components/infoBar.js', () => ({
  InfoBar: {
    createArcadeTemplateElement: options => {
      note('createArcadeTemplateElement')(options);
      const frag = document.createDocumentFragment();
      const canvas = document.createElement('canvas');
      canvas.id = options.canvasId;
      const abandon = document.createElement('button');
      abandon.id = options.abandonId;
      frag.append(canvas, abandon);
      return frag;
    },
  },
}));
jest.unstable_mockModule('../js/core/userState.js', () => ({
  UserState: { getCurrentUserData: () => (note('getCurrentUserData')(), userData) },
}));

const { startPacmanArcade } = await import('../js/arcade-multimiam.js');

beforeEach(() => {
  log.length = 0;
  stopThrows = false;
  for (const o of [gameState, userData])
    for (const k of Object.keys(o)) Reflect.deleteProperty(o, k);
  document.body.replaceChildren(Object.assign(document.createElement('div'), { id: 'game' }));
  jest.useFakeTimers();
  jest.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

const TEMPLATE = {
  mode: 'multimiam',
  canvasId: 'multimiam-canvas',
  operationId: 'arcade-mult-display',
  scoreId: 'multimiam-info-score',
  livesId: 'multimiam-info-lives',
  timerId: 'arcade-info-timer',
  abandonId: 'multimiam-abandon-btn',
  operationLabel: '',
  abandonLabel: '«abandon_arcade_button»',
  showLives: true,
  showScore: true,
};

describe('MultiMiam : lancement', () => {
  test('niveau difficile, table de 7, addition, panda : tout est transmis dans l’ordre', () => {
    Object.assign(gameState, { difficulty: 'difficile', tableNumber: 7, avatar: 'panda' });
    userData.preferredOperator = '+';
    startPacmanArcade();
    expect(gameState.gameMode).toBe('multimiam');
    expect(log).toEqual([
      'stopArcadeMode()',
      'setStartingMode("multimiam")',
      'goToSlide(4)',
      `createArcadeTemplateElement(${JSON.stringify(TEMPLATE)})`,
      'prepareArcadeStage("multimiam-canvas")',
      'showGameInstructions("multimiam-canvas", "«arcade.multiMiam.controls.desktop»")',
      'getDifficultySettings("difficile")',
      'startArcadeTimer("difficile-s")',
      'getDifficultySettings("difficile")',
      'getCurrentUserData()',
      'new PacmanGame("multimiam-canvas", 3, "table", 7, 0, "+")',
      'start({"timeSeconds":"difficile-s","tables":["difficile-t"],"distractorDistance":"difficile-d"}, ["difficile-t"], "difficile-d", {"sprite":"panda"})',
      'eventBus.on("arcade:stop", fn, {"once":true})',
    ]);
    jest.runAllTimers();
    expect(log.at(-1)).toBe('setStartingMode(null)');
  });

  test('sans réglages : niveau moyen (2), opération, multiplication, renard', () => {
    startPacmanArcade();
    expect(log).toContain('getDifficultySettings("moyen")');
    expect(log).toContain('new PacmanGame("multimiam-canvas", 2, "operation", null, 0, "×")');
    expect(log.find(entry => entry.startsWith('start('))).toContain('{"sprite":"fox"}');
  });

  test('niveau débutant : valeur 1 ; un mode arcade absent n’empêche pas le lancement', () => {
    stopThrows = true;
    Object.assign(gameState, { difficulty: 'debutant', avatar: '' });
    startPacmanArcade();
    expect(log).toContain('new PacmanGame("multimiam-canvas", 1, "operation", null, 0, "×")');
    expect(log).toContain('getDifficultySettings("debutant")');
  });

  test('le bouton Abandonner arrête la partie et montre son score', () => {
    startPacmanArcade();
    log.length = 0;
    document.getElementById('multimiam-abandon-btn').click();
    expect(log[0]).toBe('pause()');
    expect(log.at(-1)).toBe('showArcadeGameOver(7)');
  });
});
