/* eslint-env jest, node */
/**
 * Défi du jour : la table du jour et l'état du défi (remise à zéro, date de réussite) suivent
 * le même calendrier, celui de l'appareil. Avant, l'état suivait la date UTC : le soir en
 * Amérique (versions en et es), le défi se rejouait ; en France, entre minuit et 2 h, la
 * nouvelle table s'affichait déjà « terminée ».
 * Les dates de test donnent un jour local différent du jour UTC, quel que soit le fuseau de
 * la machine qui lance les tests.
 */
import { describe, test, expect } from '@jest/globals';

const { getCurrentDateString } = await import('../js/core/storage.js');
const { getDailyChallengeTable } = await import('../js/stats-utils.js');

/** Le 15 janvier 2030 au soir sur l'appareil, déjà le 16 en UTC */
const EVENING_IN_AMERICA = {
  getFullYear: () => 2030,
  getMonth: () => 0,
  getDate: () => 15,
  toISOString: () => '2030-01-16T01:00:00.000Z',
};
/** Le 3 mars 2031 à 0 h 30 sur l'appareil, encore le 2 en UTC */
const NIGHT_IN_FRANCE = {
  getFullYear: () => 2031,
  getMonth: () => 2,
  getDate: () => 3,
  toISOString: () => '2031-03-02T23:30:00.000Z',
};

describe('Défi du jour : un seul calendrier, celui de l’appareil', () => {
  test('la date du défi est le jour local, pas le jour UTC', () => {
    expect(getCurrentDateString(EVENING_IN_AMERICA)).toBe('2030-01-15');
    expect(getCurrentDateString(NIGHT_IN_FRANCE)).toBe('2031-03-03');
  });

  test('la table du jour suit ce même jour', () => {
    expect(getDailyChallengeTable(EVENING_IN_AMERICA)).toBe(5);
    expect(getDailyChallengeTable(NIGHT_IN_FRANCE)).toBe(3);
  });

  test('sans date donnée : l’horloge de l’appareil, au format AAAA-MM-JJ', () => {
    const now = new Date();
    const expected = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-');
    expect(getCurrentDateString()).toBe(expected);
    expect(getDailyChallengeTable()).toBe(((now.getDate() - 1) % 10) + 1);
  });
});
