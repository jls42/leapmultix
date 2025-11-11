import { resolveMultimemoryTables } from '../js/arcade-multimemory.js';

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
