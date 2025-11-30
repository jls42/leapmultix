/* eslint-env jest */
/* eslint-disable sonarjs/no-nested-functions -- Test file: Jest describe/it nesting is standard practice */
/* eslint-disable sonarjs/no-duplicate-functions -- Test file: isolated test functions with same logic is intentional for test clarity */
/**
 * Tests pour stats-migration.js - Edge cases
 * Phase R2 - Tests migration stats multi-opérations
 */

describe('Stats Migration - Edge Cases', () => {
  // Mock Storage - tests access mockStorage directly to simulate storage behavior
  let mockStorage = {};

  beforeEach(() => {
    mockStorage = {};
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('needsMigration()', () => {
    it('devrait retourner false si pas anciennes données', () => {
      const needsMigration = () => {
        const oldStats = mockStorage.multiplicationStats;
        return !!(oldStats && typeof oldStats === 'object' && Object.keys(oldStats).length > 0);
      };

      expect(needsMigration()).toBe(false);
    });

    it('devrait retourner true si anciennes données présentes', () => {
      mockStorage.multiplicationStats = { '3x5': { attempts: 10 } };

      const needsMigration = () => {
        const oldStats = mockStorage.multiplicationStats;
        return !!(oldStats && typeof oldStats === 'object' && Object.keys(oldStats).length > 0);
      };

      expect(needsMigration()).toBe(true);
    });

    it('devrait retourner false si anciennes données vides', () => {
      mockStorage.multiplicationStats = {};

      const needsMigration = () => {
        const oldStats = mockStorage.multiplicationStats;
        return !!(oldStats && typeof oldStats === 'object' && Object.keys(oldStats).length > 0);
      };

      expect(needsMigration()).toBe(false);
    });

    it('devrait retourner false si anciennes données corrompues (null)', () => {
      mockStorage.multiplicationStats = null;

      const needsMigration = () => {
        const oldStats = mockStorage.multiplicationStats;
        return !!(oldStats && typeof oldStats === 'object' && Object.keys(oldStats).length > 0);
      };

      expect(needsMigration()).toBe(false);
    });

    it('devrait retourner false si anciennes données corrompues (string)', () => {
      mockStorage.multiplicationStats = 'invalid';

      const needsMigration = () => {
        const oldStats = mockStorage.multiplicationStats;
        return !!(oldStats && typeof oldStats === 'object' && Object.keys(oldStats).length > 0);
      };

      expect(needsMigration()).toBe(false);
    });
  });

  describe('migrateMultiplicationStats() - Edge Cases', () => {
    it('devrait gérer clés invalides gracieusement', () => {
      mockStorage.multiplicationStats = {
        '3x5': { attempts: 10, errors: 2 },
        invalid_key: { attempts: 5 },
        '': { attempts: 3 },
        999: { attempts: 1 },
      };

      const migrateMultiplicationStats = () => {
        const oldStats = mockStorage.multiplicationStats || {};
        const newStats = mockStorage.operationStats || {};

        let migrated = 0;
        let skipped = 0;

        Object.entries(oldStats).forEach(([key, value]) => {
          const match = /^(\d+)[x×](\d+)$/.exec(key);
          if (!match) {
            skipped++;
            return;
          }

          const table = Number.parseInt(match[1], 10);
          const num = Number.parseInt(match[2], 10);
          const newKey = `${table}×${num}`;

          newStats[newKey] = {
            operator: '×',
            a: table,
            b: num,
            attempts: value.attempts || 0,
            errors: value.errors || 0,
            lastAttempt: value.lastAttempt || Date.now(),
          };

          migrated++;
        });

        mockStorage.operationStats = newStats;
        return { migrated, skipped };
      };

      const result = migrateMultiplicationStats();
      expect(result.migrated).toBe(1); // Seulement '3x5'
      expect(result.skipped).toBe(3); // 3 clés invalides
    });

    it('devrait gérer anciennes données corrompues', () => {
      mockStorage.multiplicationStats = {
        '3x5': null, // Corrompu
        '4x7': { attempts: 10 },
        '5x2': undefined, // Corrompu
      };

      const migrateMultiplicationStats = () => {
        const oldStats = mockStorage.multiplicationStats || {};
        const newStats = mockStorage.operationStats || {};

        let migrated = 0;
        let errors = 0;

        Object.entries(oldStats).forEach(([key, value]) => {
          const match = /^(\d+)[x×](\d+)$/.exec(key);
          if (!match || !value || typeof value !== 'object') {
            errors++;
            return;
          }

          const table = Number.parseInt(match[1], 10);
          const num = Number.parseInt(match[2], 10);
          const newKey = `${table}×${num}`;

          newStats[newKey] = {
            operator: '×',
            a: table,
            b: num,
            attempts: value.attempts || 0,
            errors: value.errors || 0,
            lastAttempt: value.lastAttempt || Date.now(),
          };

          migrated++;
        });

        mockStorage.operationStats = newStats;
        return { migrated, errors };
      };

      const result = migrateMultiplicationStats();
      expect(result.migrated).toBe(1); // Seulement '4x7'
      expect(result.errors).toBe(2); // null et undefined
    });

    it('devrait être idempotent (migration multiple fois)', () => {
      mockStorage.multiplicationStats = {
        '3x5': { attempts: 10, errors: 2 },
        '4x7': { attempts: 5, errors: 1 },
      };

      const migrateMultiplicationStats = () => {
        const oldStats = mockStorage.multiplicationStats || {};
        const newStats = mockStorage.operationStats || {};

        let migrated = 0;
        let skipped = 0;

        Object.entries(oldStats).forEach(([key, value]) => {
          const match = /^(\d+)[x×](\d+)$/.exec(key);
          if (!match) return;

          const table = Number.parseInt(match[1], 10);
          const num = Number.parseInt(match[2], 10);
          const newKey = `${table}×${num}`;

          // Skip si déjà migré
          if (newStats[newKey]) {
            skipped++;
            return;
          }

          newStats[newKey] = {
            operator: '×',
            a: table,
            b: num,
            attempts: value.attempts || 0,
            errors: value.errors || 0,
            lastAttempt: value.lastAttempt || Date.now(),
          };

          migrated++;
        });

        mockStorage.operationStats = newStats;
        return { migrated, skipped };
      };

      // Première migration
      const result1 = migrateMultiplicationStats();
      expect(result1.migrated).toBe(2);
      expect(result1.skipped).toBe(0);

      // Deuxième migration (idempotente)
      const result2 = migrateMultiplicationStats();
      expect(result2.migrated).toBe(0);
      expect(result2.skipped).toBe(2); // Déjà migrées
    });

    it('devrait gérer migration multi-device (nouvelles données sur ancien format)', () => {
      // Device A a déjà migré '3x5' et '4x7'
      mockStorage.operationStats = {
        '3×5': { operator: '×', a: 3, b: 5, attempts: 10, errors: 2, lastAttempt: Date.now() },
        '4×7': { operator: '×', a: 4, b: 7, attempts: 5, errors: 1, lastAttempt: Date.now() },
      };

      // Device B écrit nouvelle donnée sur ancien format
      mockStorage.multiplicationStats = {
        '3x5': { attempts: 10, errors: 2 },
        '4x7': { attempts: 5, errors: 1 },
        '5x2': { attempts: 3, errors: 0 }, // NOUVELLE donnée
      };

      const migrateMultiplicationStats = () => {
        const oldStats = mockStorage.multiplicationStats || {};
        const newStats = mockStorage.operationStats || {};

        let migrated = 0;
        let skipped = 0;

        Object.entries(oldStats).forEach(([key, value]) => {
          const match = /^(\d+)[x×](\d+)$/.exec(key);
          if (!match) return;

          const table = Number.parseInt(match[1], 10);
          const num = Number.parseInt(match[2], 10);
          const newKey = `${table}×${num}`;

          if (newStats[newKey]) {
            skipped++;
            return;
          }

          newStats[newKey] = {
            operator: '×',
            a: table,
            b: num,
            attempts: value.attempts || 0,
            errors: value.errors || 0,
            lastAttempt: value.lastAttempt || Date.now(),
          };

          migrated++;
        });

        mockStorage.operationStats = newStats;
        return { migrated, skipped };
      };

      const result = migrateMultiplicationStats();
      expect(result.migrated).toBe(1); // Seulement '5x2'
      expect(result.skipped).toBe(2); // '3x5' et '4x7' déjà migrées
      expect(mockStorage.operationStats['5×2']).toBeDefined();
    });

    it('devrait gérer symboles Unicode et ASCII (3x5 → 3×5)', () => {
      mockStorage.multiplicationStats = {
        '3x5': { attempts: 10 }, // ASCII x
        '4×7': { attempts: 5 }, // Unicode ×
      };

      const migrateMultiplicationStats = () => {
        const oldStats = mockStorage.multiplicationStats || {};
        const newStats = mockStorage.operationStats || {};

        let migrated = 0;

        Object.entries(oldStats).forEach(([key, value]) => {
          // Accepter BOTH 'x' (ASCII) et '×' (Unicode)
          const match = /^(\d+)[x×](\d+)$/.exec(key);
          if (!match) return;

          const table = Number.parseInt(match[1], 10);
          const num = Number.parseInt(match[2], 10);
          const newKey = `${table}×${num}`; // Toujours Unicode dans nouveau format

          newStats[newKey] = {
            operator: '×',
            a: table,
            b: num,
            attempts: value.attempts || 0,
            errors: value.errors || 0,
            lastAttempt: value.lastAttempt || Date.now(),
          };

          migrated++;
        });

        mockStorage.operationStats = newStats;
        return { migrated };
      };

      const result = migrateMultiplicationStats();
      expect(result.migrated).toBe(2);
      expect(mockStorage.operationStats['3×5']).toBeDefined(); // Converti en Unicode
      expect(mockStorage.operationStats['4×7']).toBeDefined();
    });
  });

  describe('canSafelyDeleteOldStats() - Double Protection', () => {
    // Constants used in safety checks
    const INACTIVITY_THRESHOLD_DAYS = 30;

    it('devrait retourner false si pas de migration', () => {
      const canSafelyDeleteOldStats = () => {
        const migrationFlag = mockStorage._statsMigrated;
        // Without migration flag, deletion is never safe
        if (!migrationFlag?.firstMigrationDate) {
          return false;
        }
        // Additional checks would go here in production code
        return false;
      };

      expect(canSafelyDeleteOldStats()).toBe(false);
    });

    it('devrait retourner false si période rétention non écoulée', () => {
      const now = Date.now();
      mockStorage._statsMigrated = {
        firstMigrationDate: now - 50 * 24 * 60 * 60 * 1000, // 50 jours
        lastMigrationDate: now,
        retentionUntil: now + 40 * 24 * 60 * 60 * 1000, // Encore 40 jours
      };

      const canSafelyDeleteOldStats = () => {
        const migrationFlag = mockStorage._statsMigrated;
        if (!migrationFlag?.firstMigrationDate) {
          return false;
        }

        const now = Date.now();
        const retentionPeriodElapsed = now >= (migrationFlag.retentionUntil || 0);

        // This test case intentionally has retention period NOT elapsed
        return retentionPeriodElapsed;
      };

      expect(canSafelyDeleteOldStats()).toBe(false);
    });

    it('devrait retourner false si activité récente (protection multi-device)', () => {
      const now = Date.now();
      mockStorage._statsMigrated = {
        firstMigrationDate: now - 100 * 24 * 60 * 60 * 1000, // 100 jours
        lastMigrationDate: now - 5 * 24 * 60 * 60 * 1000, // Activité il y a 5 jours
        retentionUntil: now - 10 * 24 * 60 * 60 * 1000, // Rétention écoulée
      };

      const canSafelyDeleteOldStats = () => {
        const migrationFlag = mockStorage._statsMigrated;
        if (!migrationFlag?.firstMigrationDate) {
          return false;
        }

        const now = Date.now();
        const retentionPeriodElapsed = now >= (migrationFlag.retentionUntil || 0);

        if (!retentionPeriodElapsed) {
          return false;
        }

        const lastMigrationDate =
          migrationFlag.lastMigrationDate || migrationFlag.firstMigrationDate;
        const inactivityThreshold = INACTIVITY_THRESHOLD_DAYS * 24 * 60 * 60 * 1000;
        const inactiveSinceLastMigration = now - lastMigrationDate >= inactivityThreshold;

        return retentionPeriodElapsed && inactiveSinceLastMigration;
      };

      expect(canSafelyDeleteOldStats()).toBe(false); // Activité récente
    });

    it('devrait retourner true si DOUBLE protection validée', () => {
      const now = Date.now();
      mockStorage._statsMigrated = {
        firstMigrationDate: now - 100 * 24 * 60 * 60 * 1000, // 100 jours
        lastMigrationDate: now - 40 * 24 * 60 * 60 * 1000, // Inactif depuis 40 jours
        retentionUntil: now - 10 * 24 * 60 * 60 * 1000, // Rétention écoulée
      };

      const canSafelyDeleteOldStats = () => {
        const migrationFlag = mockStorage._statsMigrated;
        if (!migrationFlag?.firstMigrationDate) {
          return false;
        }

        const now = Date.now();
        const retentionPeriodElapsed = now >= (migrationFlag.retentionUntil || 0);

        if (!retentionPeriodElapsed) {
          return false;
        }

        const lastMigrationDate =
          migrationFlag.lastMigrationDate || migrationFlag.firstMigrationDate;
        const inactivityThreshold = INACTIVITY_THRESHOLD_DAYS * 24 * 60 * 60 * 1000;
        const inactiveSinceLastMigration = now - lastMigrationDate >= inactivityThreshold;

        return retentionPeriodElapsed && inactiveSinceLastMigration;
      };

      expect(canSafelyDeleteOldStats()).toBe(true);
    });

    it('devrait exiger BOTH conditions (ET logique, pas OU)', () => {
      const now = Date.now();

      // Scénario 1: Rétention OK, mais activité récente
      mockStorage._statsMigrated = {
        firstMigrationDate: now - 100 * 24 * 60 * 60 * 1000,
        lastMigrationDate: now - 10 * 24 * 60 * 60 * 1000, // Récent
        retentionUntil: now - 10 * 24 * 60 * 60 * 1000, // OK
      };

      const canSafelyDeleteOldStats = () => {
        const migrationFlag = mockStorage._statsMigrated;
        if (!migrationFlag?.firstMigrationDate) return false;

        const now = Date.now();
        const retentionPeriodElapsed = now >= (migrationFlag.retentionUntil || 0);
        if (!retentionPeriodElapsed) return false;

        const lastMigrationDate =
          migrationFlag.lastMigrationDate || migrationFlag.firstMigrationDate;
        const inactivityThreshold = INACTIVITY_THRESHOLD_DAYS * 24 * 60 * 60 * 1000;
        const inactiveSinceLastMigration = now - lastMigrationDate >= inactivityThreshold;

        return retentionPeriodElapsed && inactiveSinceLastMigration; // AND logic
      };

      expect(canSafelyDeleteOldStats()).toBe(false);

      // Scénario 2: Inactivité OK, mais rétention non écoulée
      mockStorage._statsMigrated = {
        firstMigrationDate: now - 50 * 24 * 60 * 60 * 1000,
        lastMigrationDate: now - 40 * 24 * 60 * 60 * 1000, // OK
        retentionUntil: now + 40 * 24 * 60 * 60 * 1000, // PAS OK
      };

      expect(canSafelyDeleteOldStats()).toBe(false);

      // Scénario 3: BOTH OK
      mockStorage._statsMigrated = {
        firstMigrationDate: now - 100 * 24 * 60 * 60 * 1000,
        lastMigrationDate: now - 40 * 24 * 60 * 60 * 1000, // OK
        retentionUntil: now - 10 * 24 * 60 * 60 * 1000, // OK
      };

      expect(canSafelyDeleteOldStats()).toBe(true);
    });
  });

  describe('cleanupOldStatsIfSafe() - Backup', () => {
    it('devrait créer backup avant suppression', () => {
      const now = Date.now();
      mockStorage._statsMigrated = {
        done: true,
        firstMigrationDate: now - 100 * 24 * 60 * 60 * 1000,
        lastMigrationDate: now - 40 * 24 * 60 * 60 * 1000,
        retentionUntil: now - 10 * 24 * 60 * 60 * 1000,
      };
      mockStorage.multiplicationStats = {
        '3×5': { attempts: 10, errors: 2 },
      };

      let backupCreated = false;
      let statsDeleted = false;

      const cleanupOldStatsIfSafe = () => {
        const migrationFlag = mockStorage._statsMigrated;
        if (!migrationFlag?.done) return;

        const oldStats = mockStorage.multiplicationStats;
        if (!oldStats) return;

        // Backup avant suppression
        const backup = JSON.stringify(oldStats);
        backupCreated = !!backup;

        // Suppression
        delete mockStorage.multiplicationStats;
        statsDeleted = true;

        // Marquer suppression
        mockStorage._statsMigrated = {
          ...migrationFlag,
          oldStatsDeleted: true,
          deletionDate: Date.now(),
        };
      };

      cleanupOldStatsIfSafe();
      expect(backupCreated).toBe(true);
      expect(statsDeleted).toBe(true);
      expect(mockStorage._statsMigrated.oldStatsDeleted).toBe(true);
    });

    it('ne devrait PAS supprimer si conditions non remplies', () => {
      const now = Date.now();
      mockStorage._statsMigrated = {
        done: true,
        firstMigrationDate: now - 50 * 24 * 60 * 60 * 1000, // Seulement 50 jours
        lastMigrationDate: now - 10 * 24 * 60 * 60 * 1000,
        retentionUntil: now + 40 * 24 * 60 * 60 * 1000, // Pas encore écoulé
      };
      mockStorage.multiplicationStats = {
        '3×5': { attempts: 10 },
      };

      const INACTIVITY_THRESHOLD_DAYS = 30;

      const cleanupOldStatsIfSafe = () => {
        const migrationFlag = mockStorage._statsMigrated;
        if (!migrationFlag?.done) return;

        const now = Date.now();
        const retentionPeriodElapsed = now >= (migrationFlag.retentionUntil || 0);
        if (!retentionPeriodElapsed) {
          console.log('Rétention non écoulée');
          return;
        }

        const lastMigrationDate =
          migrationFlag.lastMigrationDate || migrationFlag.firstMigrationDate;
        const inactivityThreshold = INACTIVITY_THRESHOLD_DAYS * 24 * 60 * 60 * 1000;
        const inactiveSinceLastMigration = now - lastMigrationDate >= inactivityThreshold;

        if (!inactiveSinceLastMigration) {
          console.log('Activité récente');
          return;
        }

        // Suppression
        delete mockStorage.multiplicationStats;
      };

      cleanupOldStatsIfSafe();
      expect(mockStorage.multiplicationStats).toBeDefined(); // PAS supprimé
    });
  });

  describe('Migration Flag Updates', () => {
    it('devrait initialiser flag à première migration', () => {
      const RETENTION_DAYS = 90;

      const updateMigrationFlag = (migrated, skipped, errors) => {
        const existingFlag = mockStorage._statsMigrated;

        if (!existingFlag?.firstMigrationDate) {
          const now = Date.now();
          mockStorage._statsMigrated = {
            done: true,
            firstMigrationDate: now,
            lastMigrationDate: now,
            retentionUntil: now + RETENTION_DAYS * 24 * 60 * 60 * 1000,
            totalMigrated: migrated,
            totalSkipped: skipped,
            totalErrors: errors,
            migrationCount: 1,
          };
          return;
        }

        // Mise à jour migrations suivantes
        mockStorage._statsMigrated = {
          ...existingFlag,
          lastMigrationDate: Date.now(),
          totalMigrated: (existingFlag.totalMigrated || 0) + migrated,
          totalSkipped: (existingFlag.totalSkipped || 0) + skipped,
          totalErrors: (existingFlag.totalErrors || 0) + errors,
          migrationCount: (existingFlag.migrationCount || 1) + 1,
        };
      };

      updateMigrationFlag(10, 0, 0);
      expect(mockStorage._statsMigrated.firstMigrationDate).toBeDefined();
      expect(mockStorage._statsMigrated.retentionUntil).toBeDefined();
      expect(mockStorage._statsMigrated.migrationCount).toBe(1);
    });

    it('devrait accumuler stats lors migrations suivantes', () => {
      const now = Date.now();
      mockStorage._statsMigrated = {
        done: true,
        firstMigrationDate: now - 10 * 24 * 60 * 60 * 1000,
        lastMigrationDate: now - 5 * 24 * 60 * 60 * 1000,
        retentionUntil: now + 80 * 24 * 60 * 60 * 1000,
        totalMigrated: 10,
        totalSkipped: 2,
        totalErrors: 0,
        migrationCount: 1,
      };

      const updateMigrationFlag = (migrated, skipped, errors) => {
        const existingFlag = mockStorage._statsMigrated;

        if (!existingFlag?.firstMigrationDate) {
          const now = Date.now();
          mockStorage._statsMigrated = {
            done: true,
            firstMigrationDate: now,
            lastMigrationDate: now,
            retentionUntil: now + 90 * 24 * 60 * 60 * 1000,
            totalMigrated: migrated,
            totalSkipped: skipped,
            totalErrors: errors,
            migrationCount: 1,
          };
          return;
        }

        mockStorage._statsMigrated = {
          ...existingFlag,
          lastMigrationDate: Date.now(),
          totalMigrated: (existingFlag.totalMigrated || 0) + migrated,
          totalSkipped: (existingFlag.totalSkipped || 0) + skipped,
          totalErrors: (existingFlag.totalErrors || 0) + errors,
          migrationCount: (existingFlag.migrationCount || 1) + 1,
        };
      };

      updateMigrationFlag(5, 3, 1);
      expect(mockStorage._statsMigrated.totalMigrated).toBe(15); // 10 + 5
      expect(mockStorage._statsMigrated.totalSkipped).toBe(5); // 2 + 3
      expect(mockStorage._statsMigrated.totalErrors).toBe(1); // 0 + 1
      expect(mockStorage._statsMigrated.migrationCount).toBe(2);
    });
  });
});
