/* eslint-env jest, node */
/**
 * MultiPop, le moteur (sans dessin) : neuf terriers ; à chaque sortie, quelques monstres
 * montent ensemble, chacun avec un nombre, un seul porte la bonne réponse. Taper le bon
 * finit le calcul ; un mauvais redescend ; personne de tapé à temps : ils redescendent tous
 * et d'autres sortent, pour le même calcul. Parfois un ami sort avec eux, sans nombre, dans
 * un terrier à lui : le taper le fait redescendre. Le temps est celui du jeu (tick).
 */
import { describe, test, expect } from '@jest/globals';

const { getDifficultySettings } = await import('../js/difficulty.js');
const { HOLES, GAP_MS, RISE_MS, pickHoles, monsterRhythm, MonsterField } = await import(
  '../js/multipop-engine.js'
);

const SOLVED_MS = 1500;
/** Réponses d'un tour : la bonne (12) et des mauvaises, autant que de monstres */
const answersOf = count => () => [12, 5, 30, 7, 44].slice(0, count).reverse();

function fieldOf(level = 'debutant') {
  const field = new MonsterField({
    ...monsterRhythm(getDifficultySettings(level)),
    solvedMs: SOLVED_MS,
  });
  field.ask(12, answersOf(field.count));
  return field;
}

/** Laisse passer les terriers vides : les monstres sortent */
function raise(field) {
  expect(field.tick(GAP_MS)).toBe('raised');
}

describe('MultiPop : terriers et rythme du niveau', () => {
  test('neuf terriers ; une sortie prend des terriers différents, rangés dans l’ordre', () => {
    expect(HOLES).toBe(9);
    for (let draw = 0; draw < 50; draw++) {
      const holes = pickHoles(5);
      expect(new Set(holes).size).toBe(5);
      expect(holes.every(hole => Number.isInteger(hole) && hole >= 0 && hole < 9)).toBe(true);
      expect(holes).toEqual([...holes].sort((a, b) => a - b));
    }
  });

  test('tous les terriers finissent par servir', () => {
    const seen = new Set(Array.from({ length: 60 }, () => pickHoles(3)).flat());
    expect(seen.size).toBe(9);
  });

  test('Débutant 3 monstres pendant 3 s, Moyen 4 pendant 2,5 s, Difficile 5 pendant 1,8 s', () => {
    expect(
      ['debutant', 'moyen', 'difficile'].map(l => monsterRhythm(getDifficultySettings(l)))
    ).toEqual([
      { count: 3, upMs: 3000 },
      { count: 4, upMs: 2500 },
      { count: 5, upMs: 1800 },
    ]);
  });
});

describe('MultiPop : une sortie de monstres', () => {
  test('rien ne sort avant un calcul, ni pendant les terriers vides', () => {
    const field = new MonsterField({ count: 3, upMs: 3000, solvedMs: SOLVED_MS });
    expect(field.tick(10_000)).toBeNull();
    field.ask(12, answersOf(3));
    expect(field.tick(GAP_MS - 1)).toBeNull();
    expect(field.monsters).toEqual([]);
  });

  test('une attente plus longue avant la première sortie (le temps de lire la consigne)', () => {
    const field = new MonsterField({ count: 3, upMs: 3000, solvedMs: SOLVED_MS });
    field.ask(12, answersOf(3), 5000);
    expect(field.tick(4999)).toBeNull();
    expect(field.tick(1)).toBe('raised');
    // Les sorties suivantes reprennent l'attente habituelle
    expect(field.tick(3000)).toBe('escaped');
    expect(field.tick(GAP_MS)).toBe('raised');
  });

  test('les monstres du niveau sortent ensemble, un seul porte la bonne réponse', () => {
    for (const [level, count] of [
      ['debutant', 3],
      ['moyen', 4],
      ['difficile', 5],
    ]) {
      const field = fieldOf(level);
      raise(field);
      expect(field.monsters).toHaveLength(count);
      expect(
        field.monsters.filter(monster => monster.correct).map(monster => monster.value)
      ).toEqual([12]);
      expect(new Set(field.monsters.map(monster => monster.hole)).size).toBe(count);
    }
  });

  test('ils montent, restent, puis redescendent à la fin de leur temps', () => {
    const field = fieldOf('debutant');
    raise(field);
    const [monster] = field.monsters;
    expect(field.heightOf(monster)).toBe(0);
    field.tick(RISE_MS / 2);
    expect(field.heightOf(monster)).toBeCloseTo(0.5);
    field.tick(RISE_MS / 2);
    expect(field.heightOf(monster)).toBe(1);
    field.tick(3000 - RISE_MS - RISE_MS / 2);
    expect(field.heightOf(monster)).toBeCloseTo(0.5);
  });

  test('personne de tapé à temps : ils repartent, d’autres sortent pour le même calcul', () => {
    const field = fieldOf('debutant');
    raise(field);
    expect(field.tick(3000)).toBe('escaped');
    expect(field.monsters).toEqual([]);
    raise(field);
    expect(field.monsters.filter(monster => monster.correct).map(monster => monster.value)).toEqual(
      [12]
    );
  });
});

describe('MultiPop : taper un monstre', () => {
  test('un mauvais : il redescend, les autres restent ; le retaper ne compte plus', () => {
    const field = fieldOf('moyen');
    raise(field);
    field.tick(RISE_MS);
    const wrong = field.monsters.find(monster => !monster.correct);
    expect(field.whack(wrong.hole)).toEqual({ correct: false, value: wrong.value });
    expect(field.upMonsters()).not.toContain(wrong);
    expect(field.upMonsters()).toHaveLength(3);
    field.tick(RISE_MS);
    expect(field.heightOf(wrong)).toBe(0);
    expect(field.whack(wrong.hole)).toBeNull();
  });

  test('le bon : le calcul est fini, les autres redescendent, puis plus rien', () => {
    const field = fieldOf('difficile');
    raise(field);
    field.tick(RISE_MS);
    const right = field.monsters.find(monster => monster.correct);
    expect(field.whack(right.hole)).toEqual({ correct: true, value: 12 });
    expect(field.phase).toBe('solved');
    expect(field.upMonsters()).toEqual([]);
    field.tick(RISE_MS);
    expect(field.heightOf(right)).toBe(1);
    expect(
      field.monsters
        .filter(monster => monster !== right)
        .every(monster => field.heightOf(monster) === 0)
    ).toBe(true);
    expect(field.whack(right.hole)).toBeNull();
    expect(field.tick(SOLVED_MS - RISE_MS - 1)).toBeNull();
    expect(field.tick(1)).toBe('solved-done');
    expect(field.monsters).toEqual([]);
    expect(field.tick(10_000)).toBeNull();
  });

  test('un terrier vide, ou les terriers vides entre deux sorties : rien', () => {
    const field = fieldOf('debutant');
    expect(field.whack(0)).toBeNull();
    raise(field);
    const empty = Array.from({ length: HOLES }, (_, hole) => hole).find(
      hole => !field.monsters.some(monster => monster.hole === hole)
    );
    expect(field.whack(empty)).toBeNull();
  });
});

describe('MultiPop : l’ami qui sort avec les monstres', () => {
  function fieldWithFriend(level = 'moyen') {
    const field = new MonsterField({
      ...monsterRhythm(getDifficultySettings(level)),
      solvedMs: SOLVED_MS,
      friendChance: 1,
    });
    field.ask(12, answersOf(field.count));
    return field;
  }

  test('sans chance d’ami (réglage par défaut), il ne sort jamais', () => {
    const field = fieldOf('moyen');
    for (let turn = 0; turn < 20; turn++) {
      raise(field);
      expect(field.friend).toBeNull();
      expect(field.tick(2500)).toBe('escaped');
    }
  });

  test('il sort dans un terrier à lui, sans nombre, en plus des monstres du niveau', () => {
    for (let turn = 0; turn < 30; turn++) {
      const field = fieldWithFriend('difficile');
      raise(field);
      expect(field.monsters).toHaveLength(5);
      expect(field.friend).toEqual({ hole: expect.any(Number), downAt: null });
      expect(field.monsters.map(monster => monster.hole)).not.toContain(field.friend.hole);
      expect(field.upMonsters()).toHaveLength(5);
    }
  });

  test('il monte et redescend avec les monstres, puis repart avec eux', () => {
    const field = fieldWithFriend();
    raise(field);
    field.tick(RISE_MS / 2);
    expect(field.heightOf(field.friend)).toBeCloseTo(0.5);
    field.tick(RISE_MS / 2);
    expect(field.upFriend()).toBe(field.friend);
    expect(field.tick(2500)).toBe('escaped');
    expect(field.friend).toBeNull();
    expect(field.upFriend()).toBeNull();
  });

  test('le taper : il redescend seul, le calcul continue ; le retaper ne compte plus', () => {
    const field = fieldWithFriend();
    raise(field);
    field.tick(RISE_MS);
    const { friend } = field;
    expect(field.whack(friend.hole)).toEqual({ friend: true });
    expect(field.phase).toBe('up');
    expect(field.upFriend()).toBeNull();
    expect(field.upMonsters()).toHaveLength(4);
    field.tick(RISE_MS);
    expect(field.heightOf(friend)).toBe(0);
    expect(field.whack(friend.hole)).toBeNull();
  });

  test('la bonne réponse trouvée : il redescend avec les mauvais monstres', () => {
    const field = fieldWithFriend();
    raise(field);
    field.tick(RISE_MS);
    const { friend } = field;
    field.whack(field.monsters.find(monster => monster.correct).hole);
    expect(field.whack(friend.hole)).toBeNull();
    field.tick(RISE_MS);
    expect(field.heightOf(friend)).toBe(0);
    field.tick(SOLVED_MS);
    expect(field.friend).toBeNull();
  });

  test('tous les terriers pris par les monstres : pas d’ami', () => {
    const field = new MonsterField({ count: 9, upMs: 3000, solvedMs: SOLVED_MS, friendChance: 1 });
    field.ask(1, () => [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    raise(field);
    expect(field.monsters).toHaveLength(9);
    expect(field.friend).toBeNull();
  });
});
