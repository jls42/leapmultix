/* eslint-env jest, node */
/**
 * Modes selon l'opération : depuis la v37, les six modes, Chrono compris, existent pour les
 * quatre opérations. La mécanique d'indisponibilité reste : une tuile désactivée dit pourquoi
 * en texte (un bouton désactivé ne prend pas le focus : une infobulle ne serait vue ni au
 * toucher ni au clavier), et son lancement est refusé.
 */
import { test, expect, beforeEach, afterEach, jest } from '@jest/globals';

let operator = '×';
jest.unstable_mockModule('../../js/core/userState.js', () => ({
  UserState: { getCurrentUserData: () => ({ preferredOperator: operator }) },
}));

const store = await import('../../js/i18n-store.js');
const { isModeAvailable, updateModeButtonsAvailability, canLaunchMode } = await import(
  '../../js/components/operationModeAvailability.js'
);

const NOT_AVAILABLE = 'Ce mode n’existe pas pour cette opération.';
const MODES = ['discovery', 'quiz', 'challenge', 'adventure', 'chrono', 'arcade'];

beforeEach(() => {
  operator = '×';
  store.setTranslations({ mode_not_available_for_operation: NOT_AVAILABLE });
  store.setCurrentLanguage('fr');
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('les six modes, Chrono compris, pour les quatre opérations', () => {
  for (const op of ['×', '+', '−', '÷']) {
    for (const mode of MODES)
      expect([op, mode, isModeAvailable(mode, op)]).toEqual([op, mode, true]);
  }
});

test('la tuile Chrono reste active dans chaque opération, sans note', () => {
  document.body.innerHTML = '<button class="mode-btn" data-mode="chrono"></button>';
  const tile = document.querySelector('.mode-btn');
  for (const op of ['+', '−', '÷', '×']) {
    operator = op;
    updateModeButtonsAvailability();
    expect(tile.disabled).toBe(false);
    expect(tile.querySelector('.mode-unavailable-note')).toBeNull();
  }
});

test('Chrono se lance dans chaque opération, sans message', () => {
  const alert = jest.spyOn(globalThis, 'alert').mockImplementation(() => {});
  for (const op of ['×', '+', '−', '÷']) {
    operator = op;
    expect(canLaunchMode('chrono')).toBe(true);
  }
  expect(alert).not.toHaveBeenCalled();
});

test('une opération inconnue : la tuile est désactivée, dit pourquoi, et ne se lance pas', () => {
  document.body.innerHTML = '<button class="mode-btn" data-mode="quiz"></button>';
  const tile = document.querySelector('.mode-btn');
  const alert = jest.spyOn(globalThis, 'alert').mockImplementation(() => {});
  operator = '%';
  updateModeButtonsAvailability();
  expect(tile.disabled).toBe(true);
  expect(tile.querySelector('.mode-unavailable-note').textContent).toBe(NOT_AVAILABLE);
  expect(canLaunchMode('quiz')).toBe(false);
  expect(alert).toHaveBeenCalledWith(NOT_AVAILABLE);

  operator = '×';
  updateModeButtonsAvailability();
  expect(tile.disabled).toBe(false);
  expect(tile.querySelector('.mode-unavailable-note')).toBeNull();
});
