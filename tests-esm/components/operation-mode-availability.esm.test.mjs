/* eslint-env jest, node */
/**
 * Modes selon l'opération : Chrono n'existe qu'en multiplication. Hors ×, sa tuile est
 * désactivée et dit pourquoi en texte (un bouton désactivé ne prend pas le focus : une
 * infobulle ne serait vue ni au toucher ni au clavier), et son lancement est refusé.
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

const ONLY_TABLES = 'Chrono : seulement les tables de multiplication';

beforeEach(() => {
  operator = '×';
  store.setTranslations({ chrono_multiplication_only: ONLY_TABLES });
  store.setCurrentLanguage('fr');
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('Chrono en multiplication seulement ; le Quiz avec les quatre opérations', () => {
  for (const op of ['×', '+', '−', '÷']) {
    expect(isModeAvailable('chrono', op)).toBe(op === '×');
    expect(isModeAvailable('quiz', op)).toBe(true);
  }
});

test('hors ×, la tuile Chrono est désactivée et dit pourquoi ; la note part au retour en ×', () => {
  document.body.innerHTML = '<button class="mode-btn" data-mode="chrono"></button>';
  const tile = document.querySelector('.mode-btn');
  operator = '+';
  updateModeButtonsAvailability();
  expect(tile.disabled).toBe(true);
  expect(tile.querySelector('.mode-unavailable-note').textContent).toBe(ONLY_TABLES);

  operator = '×';
  updateModeButtonsAvailability();
  expect(tile.disabled).toBe(false);
  expect(tile.querySelector('.mode-unavailable-note')).toBeNull();
});

test('hors ×, Chrono ne se lance pas, et l’enfant sait pourquoi', () => {
  const alert = jest.spyOn(globalThis, 'alert').mockImplementation(() => {});
  operator = '÷';
  expect(canLaunchMode('chrono')).toBe(false);
  expect(alert).toHaveBeenCalledWith(ONLY_TABLES);
  operator = '×';
  expect(canLaunchMode('chrono')).toBe(true);
});
