/* eslint-env jest, node */
/**
 * Questions de divisibilité (core/divisibility.js, questionGenerator) :
 * - la liste fixe couvre chaque critère de la Découverte, six divisibles puis six pièges ;
 * - chaque critère a ses pièges (un 5 ailleurs qu'à la fin, un multiple de 3 qui n'est pas
 *   multiple de 9…) ;
 * - ce qu'on regarde pour répondre (dernier chiffre, somme des chiffres) est juste ;
 * - le générateur ne les pose que sur demande, jamais en 'auto'.
 */
import { describe, test, expect, beforeAll } from '@jest/globals';
import fs from 'node:fs';

const store = await import('../../js/i18n-store.js');
const {
  DIVISIBILITY_NUMBERS,
  divisibilityFacts,
  divisibilityPairs,
  divisibilityStatement,
  isDivisible,
  pickDivisibilityPair,
} = await import('../../js/core/divisibility.js');
const { DIVISIBILITY_RULES } = await import('../../js/modes/discovery-data.js');
const { generateQuestion } = await import('../../js/questionGenerator.js');

const NBSP = '\u00a0';
const FR = JSON.parse(fs.readFileSync('assets/translations/fr.json', 'utf8'));

const digitSum = n => [...String(n)].reduce((total, digit) => total + Number(digit), 0);
const lastDigit = n => n % 10;

/** Pièges attendus pour chaque critère : au moins un nombre non divisible de chaque sorte */
const TRAPS = new Map([
  [2, [n => [2, 4, 6, 8].includes(Math.floor(n / 1000) || Math.floor(n / 100))]],
  [3, [n => lastDigit(n) === 3]],
  [5, [n => String(n).slice(0, -1).includes('5')]],
  [6, [n => isDivisible(n, 3), n => isDivisible(n, 2)]],
  [9, [n => isDivisible(n, 3)]],
  [10, [n => lastDigit(n) === 5, n => String(n).slice(0, -1).includes('0')]],
]);

beforeAll(() => {
  store.setTranslations(FR);
  store.setCurrentLanguage('fr');
});

describe('Liste fixe des nombres à juger', () => {
  test('un diviseur par critère de la Découverte', () => {
    expect([...DIVISIBILITY_NUMBERS.keys()].sort((a, b) => a - b)).toEqual(
      [...DIVISIBILITY_RULES].sort((a, b) => a - b)
    );
  });

  test.each([...DIVISIBILITY_NUMBERS])(
    'par %i : douze nombres différents, six divisibles puis six pièges',
    (divisor, numbers) => {
      expect(new Set(numbers).size).toBe(12);
      expect(numbers.slice(0, 6).every(n => isDivisible(n, divisor))).toBe(true);
      expect(numbers.slice(6).some(n => isDivisible(n, divisor))).toBe(false);
      numbers.forEach(n => {
        expect(n).toBeGreaterThanOrEqual(100);
        expect(n).toBeLessThan(10000);
      });
    }
  );

  test.each([...TRAPS])('par %i : chaque sorte de piège est là', (divisor, traps) => {
    const wrong = DIVISIBILITY_NUMBERS.get(divisor).filter(n => !isDivisible(n, divisor));
    traps.forEach(isTrap => expect(wrong.some(isTrap)).toBe(true));
  });

  test('les exemples de la fiche : 2213 n’est pas divisible par 3, 578 pas par 6', () => {
    expect(DIVISIBILITY_NUMBERS.get(3)).toContain(2213);
    expect(isDivisible(2213, 3)).toBe(false);
    expect(DIVISIBILITY_NUMBERS.get(6)).toContain(578);
    expect(isDivisible(578, 6)).toBe(false);
  });

  test('toutes les phrases possibles, pour le corpus de la voix', () => {
    const pairs = divisibilityPairs();
    expect(pairs).toHaveLength(72);
    expect(pairs).toContainEqual({ number: 2213, divisor: 3 });
  });

  test('un tirage reste dans la liste et finit par couvrir chaque diviseur', () => {
    const drawn = new Set();
    for (let i = 0; i < 300; i++) {
      const { number, divisor } = pickDivisibilityPair();
      expect(DIVISIBILITY_NUMBERS.get(divisor)).toContain(number);
      drawn.add(divisor);
    }
    expect(drawn.size).toBe(DIVISIBILITY_NUMBERS.size);
  });
});

describe('Ce qu’on regarde pour répondre', () => {
  test.each([
    [
      2213,
      3,
      [
        [
          'divisibility_digit_sum',
          `2${NBSP}+${NBSP}2${NBSP}+${NBSP}1${NBSP}+${NBSP}3${NBSP}=${NBSP}8`,
        ],
      ],
    ],
    [
      578,
      6,
      [
        ['divisibility_last_digit', '8'],
        ['divisibility_digit_sum', `5${NBSP}+${NBSP}7${NBSP}+${NBSP}8${NBSP}=${NBSP}20`],
      ],
    ],
    [905, 10, [['divisibility_last_digit', '5']]],
    [2467, 2, [['divisibility_last_digit', '7']]],
    [3501, 5, [['divisibility_last_digit', '1']]],
  ])('%i par %i', (number, divisor, expected) => {
    const facts = divisibilityFacts(number, divisor);
    expect(facts.map(({ labelKey, equation }) => [labelKey, equation])).toEqual(expected);
  });

  test.each(divisibilityPairs())(
    '$number par $divisor : somme et dernier chiffre justes',
    ({ number, divisor }) => {
      for (const { labelKey, equation } of divisibilityFacts(number, divisor)) {
        if (labelKey === 'divisibility_last_digit')
          expect(Number(equation)).toBe(lastDigit(number));
        else expect(Number(equation.split(`${NBSP}=${NBSP}`).at(1))).toBe(digitSum(number));
      }
    }
  );
});

describe('Générateur de questions', () => {
  test('« 2213 est divisible par 3 » : la phrase traduite, avec ses deux nombres', () => {
    const translate = (key, params) => `${key}:${params.number}/${params.divisor}`;
    expect(divisibilityStatement(2213, 3, translate)).toBe('divisibility_statement:2213/3');
  });

  test('sur demande : une phrase à juger, réponse calculée', () => {
    for (let i = 0; i < 100; i++) {
      const question = generateQuestion({ type: 'divisibility' });
      expect(question).toMatchObject({ type: 'divisibility', operator: '÷' });
      expect(question.question).toBe(`${question.a} est divisible par ${question.b}`);
      expect(question.answer).toBe(isDivisible(question.a, question.b));
    }
  });

  test('jamais tirée en auto, ni pour la division ni ailleurs', () => {
    for (const operator of ['×', '+', '−', '÷']) {
      for (let i = 0; i < 200; i++) {
        expect(generateQuestion({ operator, type: 'auto' }).type).not.toBe('divisibility');
      }
    }
  });
});
