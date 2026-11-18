/* eslint-env jest, node */
/**
 * MultiGoal, la disposition et le dessin du terrain : le plateau prend toute la place donnée,
 * la cage en haut au milieu, toutes ses cibles dedans sans se toucher, le ballon en bas. Un
 * toucher tout près d'une cible compte pour elle. Le gardien a les pieds sur la ligne de but,
 * la largeur de la zone qu'il bloque, et regarde du côté où il va. Une cible bloquée est
 * estompée ; une bonne réponse arrêtée s'écrit au-dessus du gardien.
 */
import { describe, test, expect, jest } from '@jest/globals';

const { KEEPER_REACH, FLIGHT_MS, REPLAY_MS, Shootout, targetSlots } = await import(
  '../js/multigoal-engine.js'
);
const {
  heroPose,
  GOAL_RATIO,
  goalLayout,
  goalPoint,
  targetAt,
  keeperRect,
  keeperFacing,
  targetFontSize,
  ballPlace,
  drawGoalBoard,
} = await import('../js/multigoal-renderer.js');

// jsdom ne dessine pas : le contour d'une image est alors l'image entière
HTMLCanvasElement.prototype.getContext = () => null;

const PORTRAIT = { width: 366, height: 576 };
const LANDSCAPE = { width: 620, height: 250 };
const DESKTOP = { width: 1182, height: 519 };
// Téléphone tourné, barres du navigateur affichées (iPhone 13 : 750 × 342 utiles)
const SHORT_LANDSCAPE = { width: 453, height: 186 };
const BOXES = [
  ['téléphone en portrait', PORTRAIT],
  ['téléphone tourné', LANDSCAPE],
  ['téléphone tourné, barres du navigateur affichées', SHORT_LANDSCAPE],
  ['ordinateur', DESKTOP],
];
const COUNTS = [3, 4, 6];

function shootoutOf(count) {
  const game = new Shootout({ count, keeperSpeed: 0.3, solvedMs: 1500 });
  game.ask(12, [12, 5, 30, 7, 44, 21].slice(0, count));
  return game;
}

/** Contexte de dessin qui note chaque appel et l'opacité du moment */
function recordingContext() {
  const calls = [];
  const state = { globalAlpha: 1, canvas: document.createElement('canvas') };
  const ctx = new Proxy(state, {
    get(target, prop) {
      if (prop in target) return Reflect.get(target, prop);
      return (...args) => {
        calls.push({ name: prop, args, alpha: target.globalAlpha });
        return { width: 40 };
      };
    },
    set(target, prop, value) {
      return Reflect.set(target, prop, value);
    },
  });
  return { ctx, calls };
}

const fakeSprite = (facing = 'right') => ({
  image: { naturalWidth: 200, naturalHeight: 200 },
  request: jest.fn(),
  facing,
});

function viewOf(game, more = {}) {
  return {
    layout: goalLayout(DESKTOP, game.count),
    game,
    keeperSprite: fakeSprite(),
    heroSprite: null,
    cursorSlot: null,
    savedLabel: 'Arrêté !',
    reducedMotion: false,
    ...more,
  };
}

describe('MultiGoal : la disposition du terrain', () => {
  test.each(BOXES)('%s : le plateau prend toute la place, la cage en haut au milieu', (_n, box) => {
    for (const count of COUNTS) {
      const layout = goalLayout(box, count);
      expect(layout.width).toBe(box.width);
      expect(layout.height).toBe(box.height);
      const { goal, spot, ballRadius } = layout;
      expect(goal.width / goal.height).toBeCloseTo(GOAL_RATIO);
      expect(goal.x).toBeGreaterThanOrEqual(8);
      expect(goal.x + goal.width / 2).toBeCloseTo(box.width / 2);
      expect(goal.y).toBeGreaterThan(0);
      expect(goal.height).toBeLessThanOrEqual(box.height * 0.6 + 1e-9);
      // Le ballon attend sous la cage, en entier sur le terrain
      expect(spot.y - ballRadius).toBeGreaterThan(goal.y + goal.height);
      expect(spot.y + ballRadius).toBeLessThanOrEqual(box.height);
      expect(spot.x).toBeCloseTo(box.width / 2);
    }
  });

  test.each(BOXES)('%s : toutes les cibles tiennent dans la cage, sans se toucher', (_n, box) => {
    for (const count of COUNTS) {
      const layout = goalLayout(box, count);
      const { goal, targetRadius: radius } = layout;
      const centers = targetSlots(count).map(place => goalPoint(layout, place));
      for (const center of centers) {
        expect(center.x - radius).toBeGreaterThanOrEqual(goal.x);
        expect(center.x + radius).toBeLessThanOrEqual(goal.x + goal.width);
        expect(center.y - radius).toBeGreaterThanOrEqual(goal.y);
        expect(center.y + radius).toBeLessThanOrEqual(goal.y + goal.height);
      }
      for (const [index, first] of centers.entries()) {
        for (const second of centers.slice(index + 1)) {
          const gap = Math.hypot(first.x - second.x, first.y - second.y);
          expect(gap).toBeGreaterThan(radius * 2);
        }
      }
      // Assez grande pour un doigt, même sur le plus petit écran
      expect(radius * 2).toBeGreaterThanOrEqual(44);
    }
  });

  test('un écran minuscule garde un plateau jouable', () => {
    const layout = goalLayout({ width: 80, height: 60 }, 6);
    expect(layout.width).toBe(200);
    expect(layout.height).toBe(150);
  });
});

describe('MultiGoal : la cible sous le doigt', () => {
  test('au milieu, tout près, entre deux cibles, et loin de toutes', () => {
    const game = shootoutOf(6);
    const layout = goalLayout(PORTRAIT, 6);
    const radius = layout.targetRadius;
    for (const target of game.targets) {
      const center = goalPoint(layout, target);
      expect(targetAt(layout, game.targets, center)).toBe(target.slot);
      // Un doigt qui tombe juste à côté la touche quand même
      const near = { x: center.x, y: center.y - radius * 1.15 };
      expect(targetAt(layout, game.targets, near)).toBe(target.slot);
    }
    const first = goalPoint(layout, game.targets.at(0));
    const second = goalPoint(layout, game.targets.at(1));
    const closerToSecond = { x: first.x + (second.x - first.x) * 0.55, y: first.y };
    expect([1, -1]).toContain(targetAt(layout, game.targets, closerToSecond));
    expect(targetAt(layout, game.targets, { x: first.x + radius * 1.2, y: first.y })).toBe(0);
    expect(targetAt(layout, game.targets, layout.spot)).toBe(-1);
    // Seules les cibles données répondent (une cible tombée n'y est plus)
    expect(targetAt(layout, game.targets.slice(1), first)).toBe(-1);
  });
});

describe('MultiGoal : le gardien', () => {
  test.each(BOXES)(
    '%s : les pieds sur la ligne de but, jamais plus large que sa zone',
    (_n, box) => {
      for (const count of COUNTS) {
        const layout = goalLayout(box, count);
        const { goal } = layout;
        const blocked = 2 * KEEPER_REACH * goal.width;
        for (const aspect of [0.5, 1, 1.6]) {
          const rect = keeperRect(layout, 0.5, aspect);
          expect(rect.y + rect.height).toBeCloseTo(goal.y + goal.height);
          expect(rect.x + rect.width / 2).toBeCloseTo(goal.x + goal.width / 2);
          expect(rect.width).toBeLessThanOrEqual(blocked);
          expect(rect.height).toBeLessThanOrEqual(goal.height);
          expect(rect.width / rect.height).toBeCloseTo(aspect);
        }
        // Un monstre large prend presque toute la zone bloquée
        expect(keeperRect(layout, 0.5, 1.6).width).toBeGreaterThan(blocked * 0.9);
      }
    }
  );

  test('il suit sa place dans la cage et regarde du côté où il va', () => {
    const layout = goalLayout(DESKTOP, 3);
    const left = keeperRect(layout, 1 / 6, 1);
    const right = keeperRect(layout, 5 / 6, 1);
    expect(right.x - left.x).toBeCloseTo((layout.goal.width * 2) / 3);
    expect(keeperFacing({ direction: 1 })).toBe('right');
    expect(keeperFacing({ direction: -1 })).toBe('left');
  });

  test('son image est retournée quand elle regarde de l’autre côté', () => {
    const flips = sprite => {
      const game = shootoutOf(3);
      game.keeper.direction = -1;
      const { ctx, calls } = recordingContext();
      drawGoalBoard(ctx, viewOf(game, { keeperSprite: sprite }));
      return calls.filter(call => call.name === 'scale').map(call => call.args);
    };
    // Le gardien va à gauche : une image qui regarde à droite est retournée
    expect(flips(fakeSprite('right'))).toEqual([[-1, 1]]);
    expect(flips(fakeSprite('left'))).toEqual([[1, 1]]);
    const game = shootoutOf(3);
    const { ctx, calls } = recordingContext();
    drawGoalBoard(ctx, viewOf(game));
    expect(calls.filter(call => call.name === 'scale').map(call => call.args)).toEqual([[1, 1]]);
  });

  test('sans image encore chargée : une forme à sa place, et l’image est demandée', () => {
    const game = shootoutOf(3);
    const sprite = { image: null, request: jest.fn(), facing: 'right' };
    const { ctx, calls } = recordingContext();
    drawGoalBoard(ctx, viewOf(game, { keeperSprite: sprite }));
    expect(sprite.request).toHaveBeenCalled();
    expect(calls.some(call => call.name === 'ellipse')).toBe(true);
    expect(calls.some(call => call.name === 'drawImage')).toBe(false);
  });
});

describe('MultiGoal : les cibles et leurs nombres', () => {
  test('le nombre tient dans sa cible ; plus il est long, plus il est petit', () => {
    const canvas = document.createElement('canvas');
    const short = targetFontSize(canvas, 40, '7');
    const long = targetFontSize(canvas, 40, '144');
    expect(short).toBeLessThanOrEqual(40 * 1.05);
    expect(long).toBeLessThan(short);
    expect(long * 3 * 0.62).toBeLessThanOrEqual(40 * 2);
  });

  test('une cible derrière le gardien est estompée, les autres non', () => {
    const game = shootoutOf(3);
    game.keeper.x = 0.5;
    const { ctx, calls } = recordingContext();
    drawGoalBoard(ctx, viewOf(game));
    const numbers = calls.filter(call => call.name === 'fillText');
    expect(numbers.map(call => call.args.at(0))).toEqual(['12', '5', '30']);
    expect(numbers.map(call => call.alpha)).toEqual([1, 0.38, 1]);
  });

  test('une cible ratée s’efface en tombant, puis ne se dessine plus', () => {
    const game = shootoutOf(3);
    game.keeper.x = 5 / 6;
    game.shoot(1);
    game.tick(FLIGHT_MS);
    game.tick(REPLAY_MS / 2);
    const drawn = more => {
      const { ctx, calls } = recordingContext();
      drawGoalBoard(ctx, viewOf(game, more));
      return calls.filter(call => call.name === 'fillText');
    };
    const falling = drawn();
    expect(falling.map(call => call.args.at(0))).toEqual(['12', '5', '30']);
    expect(falling.at(1).alpha).toBeCloseTo(0.5);
    const layout = goalLayout(DESKTOP, 3);
    const restY = goalPoint(layout, game.targets.at(1)).y;
    expect(falling.at(1).args.at(2)).toBeGreaterThan(restY + layout.targetRadius * 0.5);
    // Mouvements réduits : elle s'efface sur place
    expect(drawn({ reducedMotion: true }).at(1).args.at(2)).toBeLessThan(
      restY + layout.targetRadius * 0.5
    );
    game.tick(REPLAY_MS / 2);
    expect(drawn().map(call => call.args.at(0))).toEqual(['12', '30']);
  });

  test('le contour du clavier entoure la cible visée, seulement quand on vise', () => {
    const game = shootoutOf(3);
    const strokes = more => {
      const { ctx, calls } = recordingContext();
      drawGoalBoard(ctx, viewOf(game, more));
      return calls.filter(call => call.name === 'stroke').length;
    };
    const without = strokes();
    expect(strokes({ cursorSlot: 1 })).toBe(without + 2);
    game.keeper.x = 5 / 6;
    game.shoot(0);
    expect(strokes({ cursorSlot: 1 })).toBe(without);
  });

  test('« Arrêté ! » s’écrit au-dessus du gardien pendant l’arrêt, pas autrement', () => {
    const game = shootoutOf(3);
    const texts = () => {
      const { ctx, calls } = recordingContext();
      drawGoalBoard(ctx, viewOf(game));
      return calls.filter(call => call.name === 'fillText').map(call => call.args.at(0));
    };
    expect(texts()).not.toContain('Arrêté !');
    game.keeper.x = 1 / 6;
    game.shoot(0);
    game.tick(FLIGHT_MS);
    expect(game.phase).toBe('saved');
    expect(texts()).toContain('Arrêté !');
  });
});

describe('MultiGoal : le ballon', () => {
  const keeper = { x: 500, y: 100, width: 100, height: 120 };

  test('au point de penalty, en vol vers sa cible, puis dans le filet après un but', () => {
    const game = shootoutOf(3);
    const view = viewOf(game);
    const { spot, ballRadius } = view.layout;
    expect(ballPlace(view, keeper)).toEqual({ ...spot, radius: ballRadius });
    game.keeper.x = 5 / 6;
    game.shoot(0);
    const target = goalPoint(view.layout, game.targets.at(0));
    game.tick(FLIGHT_MS / 2);
    const mid = ballPlace(view, keeper);
    expect(mid.x).toBeCloseTo((spot.x + target.x) / 2);
    // Le ballon s'élève un peu en vol, et rapetisse en s'éloignant
    expect(mid.y).toBeLessThan((spot.y + target.y) / 2);
    expect(mid.radius).toBeLessThan(ballRadius);
    game.tick(FLIGHT_MS / 2);
    const inNet = ballPlace(view, keeper);
    expect(inNet.x).toBeCloseTo(target.x);
    expect(inNet.y).toBeCloseTo(target.y);
    expect(inNet.radius).toBeLessThan(view.layout.targetRadius);
  });

  test('arrêté : dans les bras du gardien ; raté : il revient au point de penalty', () => {
    const saved = shootoutOf(3);
    saved.keeper.x = 1 / 6;
    saved.shoot(0);
    saved.tick(FLIGHT_MS);
    const held = ballPlace(viewOf(saved), keeper);
    expect(held.x).toBe(550);
    expect(held.y).toBeGreaterThan(keeper.y);
    expect(held.y).toBeLessThan(keeper.y + keeper.height);

    const missed = shootoutOf(3);
    missed.shoot(1);
    missed.tick(FLIGHT_MS);
    const view = viewOf(missed);
    const target = goalPoint(view.layout, missed.targets.at(1));
    expect(ballPlace(view, keeper).y).toBeCloseTo(target.y);
    missed.tick(REPLAY_MS * 0.6);
    const back = ballPlace(view, keeper);
    expect(back.x).toBeCloseTo(view.layout.spot.x);
    expect(back.y).toBeCloseTo(view.layout.spot.y);
  });

  test('mouvements réduits : pas de courbe, le ballon va droit', () => {
    const game = shootoutOf(3);
    game.keeper.x = 5 / 6;
    game.shoot(1);
    game.tick(FLIGHT_MS * 0.75);
    const view = viewOf(game, { reducedMotion: true });
    const target = goalPoint(view.layout, game.targets.at(1));
    const place = ballPlace(view, keeper);
    expect([view.layout.spot.y, target.y].some(y => Math.abs(place.y - y) < 1e-6)).toBe(true);
  });
});

describe('MultiGoal : le tireur', () => {
  const pose = (phase, elapsed, reducedMotion = false) =>
    heroPose({ phase, elapsed }, reducedMotion);

  test('au repos pendant qu’on vise : ni élan, ni saut, face au ballon', () => {
    expect(pose('aiming', 400)).toEqual({ shift: 0, lift: 0, angle: 0, turn: 1, squash: 0 });
  });

  test('au tir : il s’élance vers le ballon en se penchant, au plus fort au contact, puis revient', () => {
    const start = pose('flying', 0);
    const contact = pose('flying', FLIGHT_MS * 0.35);
    const end = pose('flying', FLIGHT_MS);
    expect(start.shift).toBeCloseTo(0);
    expect(contact.shift).toBeGreaterThan(1.3);
    expect(contact.angle).toBeGreaterThan(0.28);
    expect(pose('flying', FLIGHT_MS * 0.2).shift).toBeLessThan(contact.shift);
    expect(pose('flying', FLIGHT_MS * 0.7).shift).toBeLessThan(contact.shift);
    expect(end.shift).toBeCloseTo(0);
    expect(end.angle).toBeCloseTo(0);
  });

  test('au but : un tour sur lui-même avec un petit saut, puis il retombe face au ballon', () => {
    // À mi-tour, il est de dos (largeur retournée) et en haut du saut
    const half = pose('goal', 300);
    expect(half.turn).toBeCloseTo(-1);
    expect(half.lift).toBeGreaterThan(0.1);
    expect(pose('goal', 150).turn).toBeCloseTo(0);
    expect(pose('goal', 600)).toEqual(pose('aiming', 0));
    expect(pose('goal', 1200)).toEqual(pose('aiming', 0));
  });

  test('arrêté ou raté : un petit balancement qui s’éteint, jamais de saut ni de tour', () => {
    for (const phase of ['saved', 'missed']) {
      const sway = pose(phase, 75);
      expect(Math.abs(sway.angle)).toBeGreaterThan(0.05);
      expect(sway.lift).toBe(0);
      expect(sway.turn).toBe(1);
      expect(pose(phase, 600)).toEqual(pose('aiming', 0));
    }
  });

  test('mouvements réduits : le tireur ne bouge jamais', () => {
    for (const [phase, elapsed] of [
      ['flying', FLIGHT_MS * 0.35],
      ['goal', 300],
      ['saved', 75],
    ]) {
      expect(pose(phase, elapsed, true)).toEqual(pose('aiming', 0));
    }
  });
});
