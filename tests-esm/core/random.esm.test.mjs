/**
 * @jest-environment jsdom
 */
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import {
  chance,
  pickRandom,
  randomFloat,
  randomInt,
  shuffleInPlace,
} from '../../js/core/random.js';

const MAX_WORD = 2 ** 32 - 1;

/** Fait renvoyer à Web Crypto la suite de mots donnée, en boucle. */
function stubWords(...words) {
  let call = 0;
  return jest.spyOn(globalThis.crypto, 'getRandomValues').mockImplementation(array => {
    array[0] = words[call++ % words.length];
    return array;
  });
}

describe('core/random', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('randomFloat', () => {
    it('tire dans [0, 1) à partir de Web Crypto', () => {
      stubWords(0, MAX_WORD);
      expect(randomFloat()).toBe(0);
      const highest = randomFloat();
      expect(highest).toBeLessThan(1);
      expect(highest).toBeGreaterThan(0.999999);
    });

    it("n'appelle jamais Math.random", () => {
      const mathRandom = jest.spyOn(Math, 'random');
      randomFloat();
      randomInt(1, 6);
      chance(0.5);
      pickRandom([1, 2, 3]);
      shuffleInPlace([1, 2, 3]);
      expect(mathRandom).not.toHaveBeenCalled();
    });
  });

  describe('randomInt', () => {
    it('atteint les deux bornes, incluses', () => {
      stubWords(0, MAX_WORD);
      expect(randomInt(10, 50)).toBe(10);
      expect(randomInt(10, 50)).toBe(50);
    });

    it('reste dans les bornes sur de nombreux tirages', () => {
      const seen = new Set();
      for (let i = 0; i < 2000; i++) {
        const value = randomInt(2, 7);
        expect(Number.isInteger(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(2);
        expect(value).toBeLessThanOrEqual(7);
        seen.add(value);
      }
      expect([...seen].sort((a, b) => a - b)).toEqual([2, 3, 4, 5, 6, 7]);
    });
  });

  describe('chance', () => {
    it('ne réussit jamais à 0 et réussit toujours à 1', () => {
      stubWords(0, MAX_WORD);
      expect(chance(0)).toBe(false);
      expect(chance(0)).toBe(false);
      expect(chance(1)).toBe(true);
      expect(chance(1)).toBe(true);
    });

    it('compare le tirage au seuil', () => {
      stubWords(2 ** 31 - 1, 2 ** 31);
      expect(chance(0.5)).toBe(true);
      expect(chance(0.5)).toBe(false);
    });
  });

  describe('pickRandom', () => {
    it('peut tirer le premier comme le dernier élément', () => {
      stubWords(0, MAX_WORD);
      expect(pickRandom(['a', 'b', 'c'])).toBe('a');
      expect(pickRandom(['a', 'b', 'c'])).toBe('c');
    });

    it('renvoie undefined pour une liste vide', () => {
      expect(pickRandom([])).toBeUndefined();
    });
  });

  describe('shuffleInPlace', () => {
    it('mélange le tableau reçu sans perdre ni ajouter d’élément', () => {
      const items = Array.from({ length: 20 }, (_, i) => i);
      const result = shuffleInPlace(items);
      expect(result).toBe(items);
      expect([...result].sort((a, b) => a - b)).toEqual(Array.from({ length: 20 }, (_, i) => i));
    });

    it('laisse intacts les tableaux vides ou à un élément', () => {
      expect(shuffleInPlace([])).toEqual([]);
      expect(shuffleInPlace(['seul'])).toEqual(['seul']);
    });

    it('sort chaque permutation avec la même fréquence', () => {
      // 60 000 mélanges de trois éléments : 10 000 attendus par permutation,
      // écart-type d'environ 91. La tolérance de ±500 (plus de 5 écarts-types)
      // ne laisse passer aucun mélange biaisé comme sort(() => Math.random() - 0.5).
      const counts = new Map();
      for (let i = 0; i < 60000; i++) {
        const key = shuffleInPlace(['a', 'b', 'c']).join('');
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
      expect(counts.size).toBe(6);
      for (const count of counts.values()) {
        expect(Math.abs(count - 10000)).toBeLessThan(500);
      }
    });
  });
});
