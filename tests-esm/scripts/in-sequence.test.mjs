/**
 * @jest-environment node
 *
 * Appels en série des scripts (scripts/lib/in-sequence.cjs) : une tâche commence quand la
 * précédente est finie, les résultats gardent l'ordre, le premier échec arrête la suite.
 * Les scripts de la voix s'en servent pour leurs appels payants : jamais deux à la fois.
 */
import { describe, expect, it } from '@jest/globals';
import { inSequence } from '../../scripts/lib/in-sequence.cjs';

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Tâche qui note son début et sa fin, et compte les tâches en cours. La première est la plus
 * lente : lancées ensemble, les tâches finiraient dans l'ordre inverse.
 */
function tracker(count) {
  const events = [];
  let active = 0;
  let maxActive = 0;
  const task = async (item, index) => {
    active++;
    maxActive = Math.max(maxActive, active);
    events.push(`début ${item}`);
    await pause((count - index) * 5);
    events.push(`fin ${item}`);
    active--;
    return `${item}:${index}`;
  };
  return { events, task, maxActive: () => maxActive };
}

describe('inSequence', () => {
  it('attend la fin de chaque tâche avant la suivante et rend les résultats dans l’ordre', async () => {
    const { events, task, maxActive } = tracker(3);
    const results = await inSequence(['a', 'b', 'c'], task);
    expect(results).toEqual(['a:0', 'b:1', 'c:2']);
    expect(events).toEqual(['début a', 'fin a', 'début b', 'fin b', 'début c', 'fin c']);
    expect(maxActive()).toBe(1);
  });

  it('s’arrête au premier échec : les tâches suivantes ne sont jamais appelées', async () => {
    const called = [];
    const failure = new Error('panne sur b');
    const running = inSequence(['a', 'b', 'c'], async item => {
      called.push(item);
      await pause(1);
      if (item === 'b') throw failure;
      return item;
    });
    await expect(running).rejects.toBe(failure);
    await pause(20);
    expect(called).toEqual(['a', 'b']);
  });

  it('change une erreur levée sans promesse en promesse rejetée', async () => {
    const failure = new Error('levée tout de suite');
    const running = inSequence([1], () => {
      throw failure;
    });
    await expect(running).rejects.toBe(failure);
  });

  it('rend une liste vide sans appeler la tâche', async () => {
    const called = [];
    await expect(inSequence([], item => called.push(item))).resolves.toEqual([]);
    expect(called).toEqual([]);
  });

  it('parcourt tout itérable, lu au départ (Map, Set, entrées)', async () => {
    const map = new Map([
      ['x', 1],
      ['y', 2],
    ]);
    const seen = await inSequence(map, ([key, value], index) => `${index}-${key}=${value}`);
    expect(seen).toEqual(['0-x=1', '1-y=2']);
    expect(await inSequence(new Set(['p', 'q']), item => item.toUpperCase())).toEqual(['P', 'Q']);
  });
});
