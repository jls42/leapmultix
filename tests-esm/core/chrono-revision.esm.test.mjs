/* eslint-env jest, node */
/**
 * Révision de Chrono : jamais deux fois de suite le même calcul, tant que la liste en offre
 * un autre (l'autre sens compris). Avant correction, 2,3 à 2,7 % des questions répétaient la
 * précédente (16 000 séries par opération), dont 40 % évitables :
 * - en fin de passe, le tri ne regardait que devant lui et laissait [7 × 6, 6 × 7, 6 × 7] ;
 * - entre deux passes, 9 × 8 à revoir deux fois (9 × 8, 8 × 9, 9 × 8) finissait chaque passe
 *   par 9 × 8, et la suivante n'avait plus que 9 × 8 à poser.
 * Seule une liste d'un calcul sans autre sens (7 × 7, 14 − 7, 49 ÷ 7) se répète encore.
 * L'aléa est réel : ce qui est vérifié vaut pour n'importe quel mélange.
 */
import { describe, test, expect } from '@jest/globals';
import {
  CHRONO_OPERATORS,
  chronoTables,
  factKeys,
  otherFactDirection,
  pickChronoFact,
  refillRevisionQueue,
  separateRevisionRepeats,
  takeNextRevisionFact,
} from '../../js/core/chrono-questions.js';

const same = (left, right) => left?.a === right?.a && left?.b === right?.b;
const hasRepeat = facts => facts.some((fact, i) => i > 0 && same(fact, facts.at(i - 1)));

/** Une passe peut se ranger sans répétition : aucun calcul n'y a plus d'une copie sur deux */
function canAvoidRepeats(pass) {
  const counts = new Map();
  for (const { a, b } of pass) counts.set(`${a}|${b}`, (counts.get(`${a}|${b}`) ?? 0) + 1);
  return Math.max(...counts.values()) <= Math.ceil(pass.length / 2);
}

/** Une révision de 10 questions, avec le dernier calcul posé, comme ChronoMode */
function revise(basket, operator = '×') {
  const queue = [];
  const asked = [];
  for (let i = 0; i < 10; i += 1) {
    asked.push(takeNextRevisionFact(queue, basket, asked.at(-1), operator));
  }
  return asked;
}

/**
 * Liste tirée comme celles du jeu : des calculs de familles différentes, à revoir 1 à 3 fois,
 * le premier `firstDue` fois, les suivants en tournant (2, 3, 1…)
 */
function randomBasket(operator, size, firstDue) {
  const basket = [];
  while (basket.length < size) {
    const avoid = basket.flatMap(item => factKeys(item.a, item.b, operator));
    const fact = pickChronoFact(operator, chronoTables(operator), avoid);
    basket.push({ ...fact, due: 1 + ((firstDue - 1 + basket.length) % 3) });
  }
  return basket;
}

/** Nombre de calculs que la révision peut poser : chaque ligne et son autre sens */
function distinctFacts(basket, operator) {
  const keys = new Set();
  for (const { a, b } of basket) {
    keys.add(`${a}|${b}`);
    const other = otherFactDirection(operator, a, b);
    if (other) keys.add(`${other.a}|${other.b}`);
  }
  return keys.size;
}

describe('Révision : jamais deux fois de suite le même calcul', () => {
  test('fin de passe : la copie restée au bout se glisse plus tôt', () => {
    const spread = separateRevisionRepeats([
      { a: 7, b: 6 },
      { a: 6, b: 7 },
      { a: 6, b: 7 },
    ]);
    expect(spread).toEqual([
      { a: 6, b: 7 },
      { a: 7, b: 6 },
      { a: 6, b: 7 },
    ]);
  });

  test.each([
    ['×', { a: 9, b: 8 }],
    ['+', { a: 3, b: 8 }],
    ['−', { a: 15, b: 7 }],
    ['÷', { a: 56, b: 7 }],
  ])(
    '%s : un calcul à revoir deux fois alterne ses deux sens d’une passe à l’autre',
    (op, fact) => {
      for (let run = 0; run < 20; run += 1) {
        expect(hasRepeat(revise([{ ...fact, due: 2 }], op))).toBe(false);
      }
    }
  );

  test.each(CHRONO_OPERATORS)(
    '%s : une passe se range sans répétition dès que c’est possible',
    op => {
      for (let size = 1; size <= 6; size += 1) {
        for (let firstDue = 1; firstDue <= 3; firstDue += 1) {
          for (let run = 0; run < 20; run += 1) {
            const pass = refillRevisionQueue([], randomBasket(op, size, firstDue), op);
            if (canAvoidRepeats(pass)) expect(hasRepeat(pass)).toBe(false);
          }
        }
      }
    }
  );

  test.each(CHRONO_OPERATORS)('%s : listes tirées au hasard, aucune répétition évitable', op => {
    // Chaque taille de liste (1 à 6) avec chaque premier compteur (1 à 3), 20 fois
    for (let size = 1; size <= 6; size += 1) {
      for (let firstDue = 1; firstDue <= 3; firstDue += 1) {
        for (let run = 0; run < 20; run += 1) {
          const basket = randomBasket(op, size, firstDue);
          if (distinctFacts(basket, op) > 1) expect(hasRepeat(revise(basket, op))).toBe(false);
        }
      }
    }
  });

  test('un seul calcul sans autre sens : il revient, faute d’autre choix', () => {
    expect(revise([{ a: 7, b: 7, due: 1 }])).toEqual(
      Array.from({ length: 10 }, () => ({ a: 7, b: 7 }))
    );
  });
});
