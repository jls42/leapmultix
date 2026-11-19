/* eslint-env jest, node */
/**
 * Découverte : les tables et les niveaux explorés sont écrits dans le profil. Le profil est
 * copié à chaque lecture, comme dans classic-modes-data : ce qui n'est pas réécrit par
 * updateUserData est perdu, et une autre visite ne le retrouve pas.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { mockCopiedProfile, mockDiscoveryShell } from '../helpers/module-mocks.mjs';

const saved = mockCopiedProfile(jest, '../../js');
mockDiscoveryShell(jest, '../../js');

const { DiscoveryMode } = await import('../../js/modes/DiscoveryMode.js');
const { getOperation } = await import('../../js/core/operations/OperationRegistry.js');

const NOW = Date.UTC(2026, 2, 3, 9, 30, 0);

/** Mode Découverte d'une opération, prêt sans passer par start() */
const createMode = (operator = '×') =>
  Object.assign(new DiscoveryMode(), { operator, operation: getOperation(operator) });

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(NOW);
  jest.spyOn(console, 'log').mockImplementation(() => {});
  saved.data = { avatar: 'panda', preferredOperator: '×', coins: 12 };
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('Découverte : ce qui s’enregistre dans le profil', () => {
  test('une table explorée est écrite, avec sa date ; le reste du profil ne bouge pas', () => {
    createMode('×').saveExploredTable(7);
    expect(saved.data).toEqual({
      avatar: 'panda',
      preferredOperator: '×',
      coins: 12,
      discoveryProgress: { exploredTables: [7], lastExplored: NOW },
    });
  });

  test('chaque table explorée s’ajoute, une seule fois', () => {
    const mode = createMode('×');
    mode.saveExploredTable(7);
    mode.saveExploredTable(3);
    mode.saveExploredTable(7);
    expect(saved.data.discoveryProgress.exploredTables).toEqual([7, 3]);
  });

  test('un niveau d’addition est rangé sous son opération, sans effacer les tables', () => {
    createMode('×').saveExploredTable(7);
    createMode('+').saveExploredTable('easy');
    expect(saved.data.discoveryProgress.exploredTables).toEqual([7, '+:easy']);
  });

  test('une autre visite retrouve ce qui a été exploré', () => {
    createMode('×').saveExploredTable(9);
    createMode('÷').saveExploredTable('hard');
    const later = createMode('×');
    later.loadExploredTables();
    expect(later.exploredTables).toEqual([9, '÷:hard']);
  });

  test('une table déjà explorée dans un profil existant est gardée', () => {
    saved.data.discoveryProgress = { exploredTables: [2, 5], lastExplored: 1 };
    createMode('×').saveExploredTable(8);
    expect(saved.data.discoveryProgress).toEqual({ exploredTables: [2, 5, 8], lastExplored: NOW });
  });
});
