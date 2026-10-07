import { beforeEach, describe, expect, test } from '@jest/globals';
import { findCardAt, resolveMultimemoryTables } from '../js/arcade-multimemory.js';

describe('resolveMultimemoryTables (ESM)', () => {
  test('filtre les tables exclues présentes dans la base', () => {
    expect(resolveMultimemoryTables([2, 3, 4, 5], [3, 5])).toEqual([2, 4]);
  });

  test("bascule sur l'ensemble complet non exclu quand la base est entièrement filtrée", () => {
    expect(resolveMultimemoryTables([2, 3], [2, 3])).toEqual([1, 4, 5, 6, 7, 8, 9, 10]);
  });

  test('retourne la base quand toutes les tables sont exclues (sécurité)', () => {
    expect(resolveMultimemoryTables([2, 3], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toEqual([2, 3]);
  });
});

describe('findCardAt : carte visée au doigt (ESM)', () => {
  // Grille d'un téléphone de 390 px : 4 × 3 cartes de 79 × 78 px, écarts de 6 px,
  // tolérance de 25 px autour des cartes
  const TOLERANCE = 25;
  let cards;

  beforeEach(() => {
    cards = [0, 1, 2].flatMap(row =>
      [0, 1, 2, 3].map(col => ({
        x: 6 + col * 85,
        y: 6 + row * 84,
        width: 79,
        height: 78,
        isMatched: false,
      }))
    );
  });

  test('un toucher en plein centre retourne la carte touchée', () => {
    expect(findCardAt(cards, cards[5].x + 40, cards[5].y + 39, TOLERANCE)).toBe(cards[5]);
  });

  test("un toucher à 8 px du bord gauche d'une carte retourne cette carte, pas sa voisine", () => {
    expect(findCardAt(cards, cards[1].x + 8, cards[1].y + 39, TOLERANCE)).toBe(cards[1]);
  });

  test("un toucher à 8 px du bord haut d'une carte retourne cette carte, pas celle du dessus", () => {
    expect(findCardAt(cards, cards[5].x + 40, cards[5].y + 8, TOLERANCE)).toBe(cards[5]);
  });

  test("dans l'écart entre deux cartes, la carte la plus proche", () => {
    // Écart de 6 px entre les cartes 1 et 2 : 2 px du bord droit de la 1, 4 px de la 2
    const gapX = cards[1].x + cards[1].width + 2;
    expect(findCardAt(cards, gapX, cards[1].y + 39, TOLERANCE)).toBe(cards[1]);
  });

  test('juste à côté de la grille, dans la tolérance, la carte la plus proche', () => {
    expect(findCardAt(cards, cards[0].x - 10, cards[0].y + 39, TOLERANCE)).toBe(cards[0]);
  });

  test('loin de toute carte, aucune', () => {
    expect(findCardAt(cards, cards[0].x - 40, cards[0].y + 39, TOLERANCE)).toBeNull();
  });

  test('une carte déjà trouvée ne se retourne pas, et ne cède pas sa place à sa voisine', () => {
    cards[1].isMatched = true;
    expect(findCardAt(cards, cards[1].x + 8, cards[1].y + 39, TOLERANCE)).toBeNull();
  });
});
