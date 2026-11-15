/* eslint-env jest, node */
/**
 * MultiGoal, le moteur (sans dessin) : la cage porte les cibles du niveau, une seule avec la
 * bonne réponse ; un gardien va et vient et arrête tout ballon tiré dans sa colonne au moment
 * du tir. Bonne réponse hors du gardien : but. Bonne réponse devant lui : arrêtée, on retire.
 * Mauvaise réponse : ratée, la cible tombe. Le temps est celui du jeu (tick).
 */
import { describe, test, expect } from '@jest/globals';

const { getDifficultySettings } = await import('../js/difficulty.js');
const { drawArcadeQuestion, arcadeAnswers } = await import('../js/arcade-answers.js');
const { FLIGHT_MS, REPLAY_MS, KEEPER_REACH, targetSlots, shootoutRhythm, Shootout } = await import(
  '../js/multigoal-engine.js'
);

const SOLVED_MS = 1500;
const LEVELS = ['debutant', 'moyen', 'difficile'];
/** Nombres d'un penalty : la bonne réponse (12) sur la première cible */
const valuesOf = count => [12, 5, 30, 7, 44, 21].slice(0, count);

function shootoutOf(level = 'debutant') {
  const game = new Shootout({
    ...shootoutRhythm(getDifficultySettings(level)),
    solvedMs: SOLVED_MS,
  });
  game.ask(12, valuesOf(game.count));
  return game;
}

/** Pose le gardien à un endroit de la cage, sans faire passer le temps */
function keeperAt(game, x) {
  game.keeper.x = x;
}

describe('MultiGoal : la cage et le rythme du niveau', () => {
  test('Débutant 3 cibles, Moyen 4, Difficile 6 ; le gardien accélère avec le niveau', () => {
    expect(LEVELS.map(level => shootoutRhythm(getDifficultySettings(level)))).toEqual([
      { count: 3, keeperSpeed: 0.22 },
      { count: 4, keeperSpeed: 0.35 },
      { count: 6, keeperSpeed: 0.5 },
    ]);
  });

  test('trois cibles sur une rangée ; quatre et six sur deux rangées, en colonnes', () => {
    expect(targetSlots(3).map(place => [place.x, place.y])).toEqual([
      [1 / 6, 0.5],
      [0.5, 0.5],
      [5 / 6, 0.5],
    ]);
    expect(targetSlots(4).map(place => [place.x, place.y])).toEqual([
      [0.25, 0.27],
      [0.75, 0.27],
      [0.25, 0.73],
      [0.75, 0.73],
    ]);
    const six = targetSlots(6);
    expect(six.map(place => place.slot)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(six.slice(0, 3).map(place => place.x)).toEqual(six.slice(3).map(place => place.x));
    expect(new Set(six.map(place => place.y))).toEqual(new Set([0.27, 0.73]));
  });

  test('six réponses pour un calcul : toutes différentes, une seule bonne (4 opérations)', () => {
    for (const operator of ['×', '+', '−', '÷']) {
      for (const level of LEVELS) {
        const settings = getDifficultySettings(level);
        for (let draw = 0; draw < 60; draw++) {
          const question = drawArcadeQuestion(operator, settings);
          const answers = arcadeAnswers(question, operator, settings, 6);
          expect(new Set(answers).size).toBe(6);
          expect(answers.filter(value => value === question.answer)).toHaveLength(1);
          expect(answers.every(value => Number.isInteger(value) && value >= 0)).toBe(true);
        }
      }
    }
  });

  test('chaque cible est libre au moins 0,6 s d’affilée, et bloquée à un moment', () => {
    for (const level of LEVELS) {
      const game = shootoutOf(level);
      const roundTripMs = ((game.keeperMax - game.keeperMin) * 2 * 1000) / game.keeperSpeed;
      const free = new Map(game.targets.map(target => [target.slot, { now: 0, best: 0 }]));
      const blocked = new Set();
      for (let time = 0; time < roundTripMs * 2; time += 10) {
        game.tick(10);
        for (const target of game.targets) {
          const window = free.get(target.slot);
          if (game.isBlocked(target)) {
            blocked.add(target.slot);
            window.now = 0;
          } else {
            window.now += 10;
            window.best = Math.max(window.best, window.now);
          }
        }
      }
      expect(blocked.size).toBe(game.count);
      for (const window of free.values()) expect(window.best).toBeGreaterThanOrEqual(600);
    }
  });
});

describe('MultiGoal : un penalty', () => {
  test('rien avant un calcul ; les cibles reçoivent leurs nombres, une seule est la bonne', () => {
    const idle = new Shootout({ count: 3, keeperSpeed: 0.22, solvedMs: SOLVED_MS });
    expect(idle.tick(10_000)).toBeNull();
    expect(idle.targets).toEqual([]);
    expect(idle.openTargets()).toEqual([]);
    expect(idle.shoot(0)).toBeNull();
    for (const level of LEVELS) {
      const game = shootoutOf(level);
      expect(game.phase).toBe('aiming');
      expect(game.targets.map(target => target.value)).toEqual(valuesOf(game.count));
      expect(game.targets.filter(target => target.correct).map(target => target.slot)).toEqual([0]);
      expect(game.openTargets()).toHaveLength(game.count);
    }
  });

  test('le gardien va d’une colonne du bord à l’autre, à la vitesse du niveau', () => {
    const game = shootoutOf('debutant');
    expect(game.keeper.x).toBeCloseTo(1 / 6);
    game.tick(1000);
    expect(game.keeper.x).toBeCloseTo(1 / 6 + 0.22);
    // Au bout (5/6) il fait demi-tour, sans jamais dépasser
    for (let step = 0; step < 300; step++) {
      game.tick(20);
      expect(game.keeper.x).toBeGreaterThanOrEqual(1 / 6 - 1e-9);
      expect(game.keeper.x).toBeLessThanOrEqual(5 / 6 + 1e-9);
    }
    const turned = shootoutOf('debutant');
    turned.tick(((5 / 6 - 1 / 6) / 0.22) * 1000 + 5);
    expect(turned.keeper.x).toBeCloseTo(5 / 6);
    expect(turned.keeper.direction).toBe(-1);
    turned.tick(1000);
    expect(turned.keeper.x).toBeCloseTo(5 / 6 - 0.22);
  });

  test('il bloque toute la colonne où il se trouve, les deux rangées', () => {
    const game = shootoutOf('difficile');
    keeperAt(game, 0.5);
    expect(game.targets.filter(target => game.isBlocked(target)).map(t => t.slot)).toEqual([1, 4]);
    keeperAt(game, 1 / 6 + KEEPER_REACH / 2);
    expect(game.targets.filter(target => game.isBlocked(target)).map(t => t.slot)).toEqual([0, 3]);
    // Pile entre deux colonnes : personne
    keeperAt(game, 1 / 3);
    expect(game.targets.some(target => game.isBlocked(target))).toBe(false);
  });

  test('bonne réponse, gardien ailleurs : but, le calcul complet, puis plus de cibles', () => {
    const game = shootoutOf('debutant');
    keeperAt(game, 5 / 6);
    expect(game.shoot(0)).toEqual({ slot: 0, outcome: 'goal' });
    expect(game.phase).toBe('flying');
    expect(game.tick(FLIGHT_MS - 1)).toBeNull();
    expect(game.tick(1)).toBe('goal');
    expect(game.phase).toBe('goal');
    expect(game.tick(SOLVED_MS - 1)).toBeNull();
    expect(game.tick(1)).toBe('goal-done');
    expect(game.phase).toBe('waiting');
    expect(game.targets).toEqual([]);
    expect(game.shot).toBeNull();
  });

  test('bonne réponse, gardien devant : arrêtée, la cible reste, on retire', () => {
    const game = shootoutOf('debutant');
    keeperAt(game, 1 / 6);
    expect(game.shoot(0)).toEqual({ slot: 0, outcome: 'saved' });
    expect(game.tick(FLIGHT_MS)).toBe('saved');
    expect(game.phase).toBe('saved');
    expect(game.tick(REPLAY_MS - 1)).toBeNull();
    expect(game.tick(1)).toBe('replay');
    expect(game.phase).toBe('aiming');
    expect(game.openTargets().map(target => target.slot)).toEqual([0, 1, 2]);
    // Le gardien parti, le même tir marque
    keeperAt(game, 5 / 6);
    expect(game.shoot(0).outcome).toBe('goal');
  });

  test('mauvaise réponse : ratée, gardien devant ou non ; la cible tombe, on retire', () => {
    for (const keeperX of [1 / 6, 0.5]) {
      const game = shootoutOf('debutant');
      keeperAt(game, keeperX);
      expect(game.shoot(1)).toEqual({ slot: 1, outcome: 'missed' });
      expect(game.targets.at(1).out).toBe(false);
      expect(game.tick(FLIGHT_MS)).toBe('missed');
      expect(game.targets.at(1).out).toBe(true);
      expect(game.tick(REPLAY_MS)).toBe('replay');
      expect(game.openTargets().map(target => target.slot)).toEqual([0, 2]);
      // Une cible tombée ne se vise plus
      expect(game.shoot(1)).toBeNull();
      expect(game.phase).toBe('aiming');
    }
  });

  test('le résultat est celui du moment du tir : le gardien ne bouge plus ensuite', () => {
    const game = shootoutOf('difficile');
    keeperAt(game, 1 / 6 + KEEPER_REACH - 0.01);
    game.shoot(0);
    const frozen = game.keeper.x;
    game.tick(FLIGHT_MS);
    expect(game.keeper.x).toBe(frozen);
    expect(game.phase).toBe('saved');
    game.tick(REPLAY_MS / 2);
    expect(game.keeper.x).toBe(frozen);
    game.tick(REPLAY_MS / 2);
    game.tick(100);
    expect(game.keeper.x).not.toBe(frozen);
  });

  test('pas de second tir pendant le vol, l’arrêt ou la fête du but', () => {
    const game = shootoutOf('debutant');
    keeperAt(game, 5 / 6);
    game.shoot(0);
    expect(game.shoot(1)).toBeNull();
    expect(game.openTargets()).toEqual([]);
    game.tick(FLIGHT_MS);
    expect(game.shoot(1)).toBeNull();
    expect(game.shot).toEqual({ slot: 0, outcome: 'goal' });
  });

  test('le ballon avance pendant son vol, puis reste sur la cible jusqu’au tir suivant', () => {
    const game = shootoutOf('debutant');
    expect(game.flight()).toBe(0);
    keeperAt(game, 0.5);
    game.shoot(1);
    expect(game.flight()).toBe(0);
    game.tick(FLIGHT_MS / 2);
    expect(game.flight()).toBeCloseTo(0.5);
    game.tick(FLIGHT_MS / 2);
    expect(game.flight()).toBe(1);
    game.tick(REPLAY_MS);
    expect(game.flight()).toBe(0);
  });

  test('un nouveau calcul : toutes les cibles reviennent, le gardien continue sa course', () => {
    const game = shootoutOf('debutant');
    game.tick(1000);
    const x = game.keeper.x;
    keeperAt(game, x);
    game.shoot(1);
    game.tick(FLIGHT_MS);
    game.tick(REPLAY_MS);
    game.ask(30, valuesOf(3));
    expect(game.openTargets()).toHaveLength(3);
    expect(game.targets.filter(target => target.correct).map(target => target.value)).toEqual([30]);
    expect(game.keeper.x).toBe(x);
  });
});
