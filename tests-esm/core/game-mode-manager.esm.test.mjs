/* eslint-env jest, node */
/**
 * Gestionnaire de modes : l'arrêt lancé à la fermeture de la page (cleanup) n'est pas
 * attendu, et le mode courant est oublié aussitôt. Un échec de cet arrêt reste signalé,
 * avec le nom du mode, au lieu de devenir une erreur de plus dans son propre signalement.
 */
import { describe, test, expect, afterEach, jest } from '@jest/globals';

jest.unstable_mockModule('../../js/components/dashboard.js', () => ({
  default: { show: () => {} },
  Dashboard: { show: () => {} },
}));
jest.unstable_mockModule('../../js/mode-orchestrator.js', () => ({
  getStartingMode: () => null,
  setGameMode: async () => {},
}));

const { GameModeManager } = await import('../../js/core/GameModeManager.js');

const flush = () => new Promise(resolve => setTimeout(resolve, 0));

describe('Gestionnaire de modes : fermeture de la page', () => {
  afterEach(() => jest.restoreAllMocks());

  test('un arrêt qui échoue est signalé avec le nom du mode, même une fois le mode oublié', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const failure = new Error('arrêt impossible');
    const manager = new GameModeManager();
    manager.currentMode = {
      name: 'quiz',
      type: 'refactored',
      instance: { stop: () => Promise.reject(failure) },
    };

    manager.cleanup();
    await flush();

    expect(manager.currentMode).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('quiz'), failure);
  });
});
