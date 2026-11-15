/* eslint-env jest, node */
/**
 * MultiPop en jeu : le calcul au bandeau ; taper le monstre de la bonne réponse donne
 * 100 points et le calcul complet au bandeau, puis un autre calcul ; un mauvais retire
 * jusqu'à 50 points, sans vie perdue. Souris ou doigt sur le terrier, ou clavier (flèches
 * pour passer d'un monstre levé à l'autre, Entrée ou Espace pour taper). Rien en pause.
 * Un ami sort parfois avec les monstres : le taper retire aussi jusqu'à 50 points, sans
 * compter comme une erreur de calcul. L'horloge du jeu est avancée à la main (step).
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'node:fs';
import { fakeCanvasContext } from './helpers/touch-test-helpers.mjs';

const showArcadeGameOver = jest.fn();
const startArcadeTimer = jest.fn();
jest.unstable_mockModule('../js/arcade.js', () => ({
  startArcadeTimer,
  stopArcadeMode: jest.fn(),
  showArcadeGameOver,
  isArcadeActive: () => false,
}));
const noteArcadePlay = jest.fn();
jest.unstable_mockModule('../js/arcade-session.js', () => ({
  noteArcadePlay,
  noteArcadeMiss: jest.fn(),
}));
const recordArcadeAnswer = jest.fn();
const showSolvedQuestion = jest.fn();
jest.unstable_mockModule('../js/arcade-learning.js', () => ({
  recordArcadeAnswer,
  showSolvedQuestion,
  SOLVED_PAUSE_MS: 1500,
  weakTablesFor: () => [],
}));

const store = await import('../js/i18n-store.js');
const pause = await import('../js/arcade-time.js');
const { AudioManager } = await import('../js/core/audio.js');
const { InfoBar } = await import('../js/components/infoBar.js');
const { gameState } = await import('../js/game.js');
const { PopGame, CORRECT_POINTS, MISS_PENALTY, FRIEND_PENALTY } = await import(
  '../js/arcade-multipop.js'
);
const { GAP_MS, RISE_MS } = await import('../js/multipop-engine.js');
const { cellParts, cellRect } = await import('../js/multipop-renderer.js');

const FR = JSON.parse(fs.readFileSync('assets/translations/fr.json', 'utf8'));

let game;
let canvas;

const press = key =>
  canvas.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
const status = () => document.querySelector('.multipop-announcer[role="status"]').textContent;
const banner = () => document.querySelector('.arcade-question').textContent;
const shownScore = () => document.getElementById('multipop-info-score').textContent;
const rightMonster = () => game.field.upMonsters().find(monster => monster.correct);
const wrongMonster = () => game.field.upMonsters().find(monster => !monster.correct);

/** Les monstres sortent et finissent de monter */
function raiseMonsters() {
  game.step(GAP_MS);
  game.step(RISE_MS);
}

/** Toucher le milieu de la pancarte d'un terrier */
function tapHole(hole, pointerType = 'mouse') {
  const { sign } = cellParts(cellRect(game.layout, hole));
  const event = new MouseEvent('pointerdown', {
    clientX: sign.x + sign.width / 2,
    clientY: sign.y + sign.height / 2,
    bubbles: true,
    cancelable: true,
  });
  Object.defineProperty(event, 'pointerType', { value: pointerType });
  canvas.dispatchEvent(event);
  return event;
}

beforeEach(() => {
  store.setTranslations(FR);
  store.setCurrentLanguage('fr');
  jest.spyOn(AudioManager, 'isMuted').mockReturnValue(true);
  HTMLCanvasElement.prototype.getContext = () => fakeCanvasContext();
  document.body.replaceChildren(
    InfoBar.createArcadeTemplateElement({
      mode: 'multipop',
      canvasId: 'multipop-canvas',
      scoreId: 'multipop-info-score',
      showLives: false,
      showScore: true,
    })
  );
  canvas = document.getElementById('multipop-canvas');
  canvas.tabIndex = 0;
  // Sans ami, sauf dans les tests qui le font sortir
  game = new PopGame(canvas.id, { difficulty: 'moyen', operator: '×', friendChance: 0 });
  game.start();
  // Plateau affiché à sa taille de jeu, en haut à gauche de l'écran
  jest.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    width: game.layout.width,
    height: game.layout.height,
    right: game.layout.width,
    bottom: game.layout.height,
  });
  for (const mock of [noteArcadePlay, recordArcadeAnswer, showSolvedQuestion]) mock.mockClear();
});

afterEach(() => {
  game.cleanup();
  pause.unmountArcadePause();
  jest.restoreAllMocks();
});

describe('MultiPop : une partie', () => {
  test('le calcul au bandeau ; les monstres du niveau sortent après les terriers vides', () => {
    const { a, b } = game.question;
    expect(banner()).toBe(`${a} × ${b} = ?`);
    expect(game.field.monsters).toEqual([]);
    raiseMonsters();
    expect(game.field.upMonsters()).toHaveLength(4);
    expect(rightMonster().value).toBe(a * b);
  });

  test('au lancement, les premiers monstres attendent le temps demandé', () => {
    const other = new PopGame(canvas.id, { difficulty: 'moyen', operator: '×', introMs: 1500 });
    other.start();
    other.step(GAP_MS);
    expect(other.field.monsters).toEqual([]);
    other.step(1500 - GAP_MS);
    expect(other.field.upMonsters()).toHaveLength(4);
    other.cleanup();
  });

  test('tant que la consigne couvre la rangée du bas, les monstres sortent des autres', () => {
    const other = new PopGame(canvas.id, {
      difficulty: 'difficile',
      operator: '×',
      coveredMs: 5320,
      friendChance: 1,
    });
    other.start();
    const holesUp = () => [...other.field.monsters, other.field.friend].map(figure => figure.hole);
    // Difficile : une sortie toutes les 2,2 s (400 ms d'attente, 1,8 s levés)
    other.step(GAP_MS);
    expect(holesUp().sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5]);
    other.step(1800);
    other.step(GAP_MS);
    expect(holesUp().sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5]);
    other.step(1800);
    // 4,4 s de jeu : encore couverte à la troisième sortie, plus après 5,32 s
    other.step(GAP_MS);
    expect(holesUp().every(hole => hole < 6)).toBe(true);
    other.step(1800);
    expect(other.field.reserved).toEqual([]);
    const seen = new Set();
    for (let sortie = 0; sortie < 40; sortie++) {
      other.step(GAP_MS);
      for (const hole of holesUp()) seen.add(hole);
      other.step(1800);
    }
    expect([6, 7, 8].every(hole => seen.has(hole))).toBe(true);
    other.cleanup();
  });

  test('le bon monstre à la souris : 100 points, le calcul complet, puis un autre calcul', () => {
    raiseMonsters();
    const { a, b } = game.question;
    tapHole(rightMonster().hole);
    expect(game.score).toBe(CORRECT_POINTS);
    expect(shownScore()).toBe('100');
    expect(noteArcadePlay).toHaveBeenCalled();
    expect(recordArcadeAnswer).toHaveBeenCalledWith('×', a, b, true);
    expect(showSolvedQuestion).toHaveBeenCalledWith({ operator: '×', a, b });
    const solved = game.question;
    game.step(1500);
    expect(game.question).not.toBe(solved);
    expect(banner()).toMatch(/ = \?$/);
  });

  test('une mauvaise : jusqu’à 50 points de moins, jamais sous zéro, sans fin de partie', () => {
    raiseMonsters();
    const { a, b } = game.question;
    tapHole(wrongMonster().hole);
    expect(game.score).toBe(0);
    expect(recordArcadeAnswer).toHaveBeenCalledWith('×', a, b, false);
    tapHole(rightMonster().hole);
    game.step(1500);
    raiseMonsters();
    tapHole(wrongMonster().hole);
    expect(game.score).toBe(CORRECT_POINTS - MISS_PENALTY);
    expect(showArcadeGameOver).not.toHaveBeenCalled();
  });

  test('au doigt : le terrier touché, sans défilement de la page', () => {
    raiseMonsters();
    const event = tapHole(rightMonster().hole, 'touch');
    expect(event.defaultPrevented).toBe(true);
    expect(game.score).toBe(CORRECT_POINTS);
  });

  test('un terrier vide ou entre deux sorties : rien ne se passe', () => {
    tapHole(4);
    raiseMonsters();
    const empty = [0, 1, 2, 3, 4, 5, 6, 7, 8].find(
      hole => !game.field.monsters.some(monster => monster.hole === hole)
    );
    tapHole(empty);
    expect(game.score).toBe(0);
    expect(noteArcadePlay).not.toHaveBeenCalled();
  });

  test('en pause : aucun monstre ne se tape, et ils ne bougent pas', () => {
    raiseMonsters();
    const time = document.createElement('span');
    document.body.appendChild(time);
    pause.mountArcadePause(time);
    pause.pauseArcade();
    tapHole(rightMonster().hole);
    press('Enter');
    expect(game.score).toBe(0);
    expect(noteArcadePlay).not.toHaveBeenCalled();
  });
});

describe('MultiPop au clavier', () => {
  test('le plateau a le focus et dit comment jouer au clavier', () => {
    expect(document.activeElement).toBe(canvas);
    const help = document.getElementById(canvas.getAttribute('aria-describedby'));
    expect(help.textContent).toBe(FR['arcade.controls.multipop.keyboard']);
  });

  test('les flèches passent d’un monstre levé à l’autre, et le nombre est annoncé', () => {
    raiseMonsters();
    const monsters = game.field.upMonsters();
    press('ArrowRight');
    expect(game.cursorHole).toBe(monsters[1].hole);
    expect(status()).toBe(`Monstre 2 sur 4\u00a0: ${monsters[1].value}`);
    press('ArrowLeft');
    press('ArrowLeft');
    expect(game.cursorHole).toBe(monsters[3].hole);
  });

  test('Entrée tape le monstre visé ; Espace aussi', () => {
    raiseMonsters();
    const monsters = game.field.upMonsters();
    const right = monsters.findIndex(monster => monster.correct);
    // Une mauvaise d'abord (Espace), puis la bonne (Entrée)
    const wrong = monsters.findIndex(monster => !monster.correct);
    while (game.cursorHole !== monsters[wrong].hole) press('ArrowRight');
    press(' ');
    expect(recordArcadeAnswer).toHaveBeenLastCalledWith(
      '×',
      game.question.a,
      game.question.b,
      false
    );
    while (game.cursorHole !== monsters[right].hole) press('ArrowRight');
    press('Enter');
    expect(game.score).toBe(CORRECT_POINTS);
  });

  test('de nouveaux monstres : le premier est visé', () => {
    raiseMonsters();
    press('ArrowRight');
    game.step(2500);
    raiseMonsters();
    expect(game.cursorHole).toBe(game.field.upMonsters()[0].hole);
  });
});

describe('MultiPop : chaque sortie a ses personnages', () => {
  test('un monstre différent par terrier, pris parmi ceux du jeu', () => {
    raiseMonsters();
    const sources = game.field.monsters.map(monster => game.sprites.get(monster.hole).spec.source);
    expect(sources).toHaveLength(4);
    expect(new Set(sources).size).toBe(4);
    for (const source of sources) expect(source).toMatch(/^monstre\d+_right$/);
  });
});

describe('MultiPop : l’ami qui sort avec les monstres', () => {
  beforeEach(() => {
    game.cleanup();
    gameState.avatar = 'panda';
    game = new PopGame(canvas.id, { difficulty: 'moyen', operator: '×', friendChance: 1 });
    game.start();
    for (const mock of [noteArcadePlay, recordArcadeAnswer]) mock.mockClear();
  });

  afterEach(() => {
    gameState.avatar = 'fox';
  });

  test('un héros du jeu, jamais celui du joueur, dans un terrier à lui', () => {
    for (let turn = 0; turn < 12; turn++) {
      raiseMonsters();
      const { friend } = game.field;
      expect(game.field.monsters.map(monster => monster.hole)).not.toContain(friend.hole);
      const { source } = game.sprites.get(friend.hole).spec;
      expect(['fox', 'unicorn', 'dragon', 'astronaut']).toContain(source);
      game.step(2500);
    }
  });

  test('le taper : jusqu’à 50 points de moins, sans erreur de calcul ni fin de partie', () => {
    raiseMonsters();
    tapHole(rightMonster().hole);
    game.step(1500);
    raiseMonsters();
    for (const mock of [noteArcadePlay, recordArcadeAnswer]) mock.mockClear();
    const { friend } = game.field;
    tapHole(friend.hole);
    expect(game.score).toBe(CORRECT_POINTS - FRIEND_PENALTY);
    expect(shownScore()).toBe('50');
    expect(noteArcadePlay).toHaveBeenCalledTimes(1);
    expect(recordArcadeAnswer).not.toHaveBeenCalled();
    expect(showArcadeGameOver).not.toHaveBeenCalled();
    // Il redescend : le retaper ne retire plus rien, et le calcul continue
    tapHole(friend.hole);
    expect(game.score).toBe(CORRECT_POINTS - FRIEND_PENALTY);
    expect(game.field.upMonsters()).toHaveLength(4);
  });

  test('sans point au compteur : rien à retirer, le score reste à zéro', () => {
    raiseMonsters();
    tapHole(game.field.friend.hole);
    expect(game.score).toBe(0);
  });

  test('le clavier ne vise jamais l’ami', () => {
    raiseMonsters();
    const { friend } = game.field;
    expect(game.cursorHole).not.toBe(friend.hole);
    for (let move = 0; move < 8; move++) {
      press('ArrowRight');
      expect(game.cursorHole).not.toBe(friend.hole);
      // L'annonce de cette partie (celle de la partie d'avant reste dans la page)
      expect(game.liveRegion.textContent).toMatch(/^Monstre \d sur 4/);
    }
  });
});

describe('MultiPop : réglages du niveau', () => {
  test('les tables du niveau en ×', () => {
    for (const [level, tables] of [
      ['debutant', [2, 3, 4, 5]],
      ['difficile', [2, 3, 4, 5, 6, 7, 8, 9, 10]],
    ]) {
      gameState.difficulty = level;
      const other = new PopGame(canvas.id, { difficulty: level, operator: '×' });
      for (let draw = 0; draw < 40; draw++) {
        other.nextQuestion();
        expect(tables).toContain(other.question.a);
      }
      other.cleanup();
    }
  });
});
