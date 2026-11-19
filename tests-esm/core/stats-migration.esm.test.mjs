/* eslint-env jest, node */
/**
 * Migration des anciennes statistiques de multiplication (clé `multiplicationStats`, « 7x8 »)
 * vers `operationStats` (« 7×8 »), sur le vrai module et le vrai stockage : ce qui est recopié,
 * ce qui n'est jamais écrasé, et quand l'ancienne clé peut être retirée (90 jours après la
 * première migration et 30 jours sans migration). L'horloge est simulée.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';

const {
  needsMigration,
  migrateMultiplicationStats,
  canSafelyDeleteOldStats,
  cleanupOldStatsIfSafe,
  autoMigrate,
  resetMigrationFlag,
} = await import('../../js/core/stats-migration.js');

const DAY = 24 * 60 * 60 * 1000;
const START = Date.UTC(2026, 0, 15, 10, 0, 0);

const read = key => JSON.parse(localStorage.getItem(key));
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const OLD_STATS = {
  '7x8': { attempts: 10, errors: 4, lastAttempt: 1_700_000_000_000 },
  '3×5': { attempts: 2, errors: 0 },
};

beforeEach(() => {
  localStorage.clear();
  jest.useFakeTimers();
  jest.setSystemTime(START);
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('stats-migration : faut-il migrer ?', () => {
  test('non sans anciennes statistiques, ni avec un objet vide ; oui dès une entrée', () => {
    expect(needsMigration()).toBeFalsy();
    write('multiplicationStats', {});
    expect(needsMigration()).toBeFalsy();
    write('multiplicationStats', OLD_STATS);
    expect(needsMigration()).toBe(true);
  });
});

describe('stats-migration : ce qui est recopié', () => {
  test('« 7x8 » et « 3×5 » deviennent des entrées de operationStats, compteurs gardés', () => {
    write('multiplicationStats', OLD_STATS);
    expect(migrateMultiplicationStats()).toEqual({ migrated: 2, skipped: 0, errors: 0 });
    expect(read('operationStats')).toEqual({
      '7×8': { operator: '×', a: 7, b: 8, attempts: 10, errors: 4, lastAttempt: 1_700_000_000_000 },
      // Sans date connue, celle de la migration
      '3×5': { operator: '×', a: 3, b: 5, attempts: 2, errors: 0, lastAttempt: START },
    });
  });

  test('les anciennes statistiques restent telles quelles après la migration', () => {
    write('multiplicationStats', OLD_STATS);
    migrateMultiplicationStats();
    expect(read('multiplicationStats')).toEqual(OLD_STATS);
  });

  test('une entrée déjà présente dans operationStats n’est pas écrasée ; une clé illisible est laissée', () => {
    const current = { operator: '×', a: 7, b: 8, attempts: 25, errors: 1, lastAttempt: 42 };
    write('operationStats', { '7×8': current, '4+4': { operator: '+', a: 4, b: 4, attempts: 1 } });
    write('multiplicationStats', { ...OLD_STATS, 'sept fois huit': { attempts: 3, errors: 3 } });
    expect(migrateMultiplicationStats()).toEqual({ migrated: 1, skipped: 2, errors: 0 });
    const stats = read('operationStats');
    expect(stats['7×8']).toEqual(current);
    expect(stats['4+4']).toEqual({ operator: '+', a: 4, b: 4, attempts: 1 });
    expect(Object.keys(stats).sort((a, b) => a.localeCompare(b))).toEqual(['3×5', '4+4', '7×8']);
  });

  test('sans anciennes statistiques : rien n’est écrit', () => {
    expect(migrateMultiplicationStats()).toEqual({ migrated: 0, skipped: 0, errors: 0 });
    expect(localStorage.length).toBe(0);
  });

  test('la première migration note sa date et 90 jours de conservation', () => {
    write('multiplicationStats', OLD_STATS);
    migrateMultiplicationStats();
    expect(read('_statsMigrated')).toEqual({
      done: true,
      firstMigrationDate: START,
      lastMigrationDate: START,
      retentionUntil: START + 90 * DAY,
      totalMigrated: 2,
      totalSkipped: 0,
      totalErrors: 0,
      migrationCount: 1,
    });
  });

  test('relancée, elle ne recopie rien et ne change pas operationStats ; la première date reste', () => {
    write('multiplicationStats', OLD_STATS);
    migrateMultiplicationStats();
    const migratedOnce = read('operationStats');
    jest.setSystemTime(START + 3 * DAY);
    expect(migrateMultiplicationStats()).toEqual({ migrated: 0, skipped: 2, errors: 0 });
    expect(read('operationStats')).toEqual(migratedOnce);
    expect(read('_statsMigrated')).toMatchObject({
      firstMigrationDate: START,
      lastMigrationDate: START + 3 * DAY,
      retentionUntil: START + 90 * DAY,
      totalMigrated: 2,
      totalSkipped: 2,
      migrationCount: 2,
    });
  });
});

describe('stats-migration : au lancement du jeu', () => {
  test('les anciennes statistiques sont recopiées, et gardées', () => {
    write('multiplicationStats', OLD_STATS);
    autoMigrate();
    expect(Object.keys(read('operationStats'))).toEqual(['7×8', '3×5']);
    expect(read('multiplicationStats')).toEqual(OLD_STATS);
  });

  test('121 jours plus tard, un joueur qui relance le jeu garde ses anciennes statistiques', () => {
    write('multiplicationStats', OLD_STATS);
    autoMigrate();
    jest.setSystemTime(START + 121 * DAY);
    autoMigrate();
    expect(read('multiplicationStats')).toEqual(OLD_STATS);
    expect(read('operationStats')['7×8'].attempts).toBe(10);
  });

  test('sans anciennes statistiques, le lancement n’écrit rien', () => {
    autoMigrate();
    expect(localStorage.length).toBe(0);
  });
});

describe('stats-migration : retrait de l’ancienne clé', () => {
  /** Migration faite à START, puis le temps passe sans nouvelle migration */
  function migratedThenWait(days) {
    write('multiplicationStats', OLD_STATS);
    migrateMultiplicationStats();
    jest.setSystemTime(START + days * DAY);
  }

  test('jamais avant la première migration', () => {
    write('multiplicationStats', OLD_STATS);
    expect(canSafelyDeleteOldStats()).toBe(false);
    cleanupOldStatsIfSafe();
    expect(read('multiplicationStats')).toEqual(OLD_STATS);
  });

  test.each([0, 29, 89])('%i jour(s) après la migration : conservée', days => {
    migratedThenWait(days);
    expect(canSafelyDeleteOldStats()).toBe(false);
    cleanupOldStatsIfSafe();
    expect(read('multiplicationStats')).toEqual(OLD_STATS);
  });

  test('90 jours écoulés mais une migration il y a moins de 30 jours : conservée', () => {
    migratedThenWait(80);
    migrateMultiplicationStats();
    jest.setSystemTime(START + 100 * DAY);
    expect(canSafelyDeleteOldStats()).toBe(false);
    cleanupOldStatsIfSafe();
    expect(read('multiplicationStats')).toEqual(OLD_STATS);
  });

  test('90 jours écoulés et 30 jours sans migration : retirée, operationStats intact', () => {
    migratedThenWait(90);
    const migrated = read('operationStats');
    expect(canSafelyDeleteOldStats()).toBe(true);
    cleanupOldStatsIfSafe();
    expect(localStorage.getItem('multiplicationStats')).toBeNull();
    expect(read('operationStats')).toEqual(migrated);
    expect(read('_statsMigrated')).toMatchObject({
      oldStatsDeleted: true,
      deletionDate: START + 90 * DAY,
      firstMigrationDate: START,
    });
  });

  test('oublier la migration (resetMigrationFlag) ne touche à aucune statistique', () => {
    migratedThenWait(1);
    const migrated = read('operationStats');
    resetMigrationFlag();
    expect(localStorage.getItem('_statsMigrated')).toBeNull();
    expect(read('multiplicationStats')).toEqual(OLD_STATS);
    expect(read('operationStats')).toEqual(migrated);
  });
});
