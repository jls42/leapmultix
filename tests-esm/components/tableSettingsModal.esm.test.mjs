/* eslint-env jest, node */
/**
 * Fenêtre « Paramètres des tables » : ce qui s'affiche est ce qui s'applique.
 * - interrupteur coupé : aucune table n'est barrée (toutes sont jouées) ;
 * - toucher une table quand l'interrupteur est coupé l'allume et retire cette table ;
 * - couper l'interrupteur rend toutes les tables jouables, sans perdre la sélection.
 */
import { describe, test, expect, beforeEach, jest } from '@jest/globals';

let userData;
jest.unstable_mockModule('../../js/userManager.js', () => ({
  UserManager: {
    getCurrentUser: () => 'Test',
    getCurrentUserData: () => userData,
    updateCurrentUserData: data => {
      userData = { ...userData, ...data };
    },
  },
}));

const store = await import('../../js/i18n-store.js');
const { TablePreferences } = await import('../../js/core/tablePreferences.js');
const { TableSettingsModal } = await import('../../js/components/tableSettingsModal.js');

function tableButton(n) {
  return document.querySelector(`.table-btn[data-table="${n}"]`);
}

function barred() {
  return [...document.querySelectorAll('.table-btn.excluded')].map(b => Number(b.dataset.table));
}

function open() {
  TableSettingsModal.modalElement?.remove();
  TableSettingsModal.modalElement = null;
  TableSettingsModal.isOpen = false;
  TableSettingsModal.open();
}

beforeEach(() => {
  store.setTranslations({ table_label: 'Table', excluded_tables_label: 'Tables retirées :' });
  document.body.innerHTML = '<button id="opener">⚙</button>';
  document.getElementById('opener').focus();
  userData = { tablePreferences: { globalExclusions: [3, 4], globalEnabled: false } };
});

describe('Fenêtre des tables', () => {
  test('interrupteur coupé : aucune table barrée, la ligne « Tables retirées » est cachée', () => {
    open();
    expect(document.getElementById('global-exclusion-toggle').checked).toBe(false);
    expect(barred()).toEqual([]);
    expect(tableButton(3).getAttribute('aria-pressed')).toBe('false');
    expect(document.getElementById('exclusion-status').hidden).toBe(true);
  });

  test('toucher une table quand l’interrupteur est coupé l’allume et retire cette table', () => {
    open();
    tableButton(7).click();

    expect(document.getElementById('global-exclusion-toggle').checked).toBe(true);
    expect(TablePreferences.isGlobalEnabled('Test')).toBe(true);
    expect(barred()).toEqual([7]);
    expect(tableButton(7).getAttribute('aria-pressed')).toBe('true');
    expect(TablePreferences.getActiveExclusions('Test')).toEqual([7]);
    const status = document.getElementById('exclusion-status');
    expect(status.hidden).toBe(false);
    expect(document.getElementById('excluded-tables-list').textContent).toBe('7');
  });

  test('allumer l’interrupteur montre la sélection enregistrée, le couper la rend jouable', () => {
    open();
    const toggle = document.getElementById('global-exclusion-toggle');

    toggle.checked = true;
    toggle.dispatchEvent(new Event('change'));
    expect(barred()).toEqual([3, 4]);
    expect(TablePreferences.getActiveExclusions('Test')).toEqual([3, 4]);

    toggle.checked = false;
    toggle.dispatchEvent(new Event('change'));
    expect(barred()).toEqual([]);
    expect(TablePreferences.getActiveExclusions('Test')).toEqual([]);
    // La sélection est gardée pour la prochaine fois
    expect(TablePreferences.getGlobalExclusions('Test')).toEqual([3, 4]);
  });

  test('interrupteur allumé : toucher une table barrée la rend jouable', () => {
    userData.tablePreferences.globalEnabled = true;
    open();
    expect(barred()).toEqual([3, 4]);
    tableButton(3).click();
    expect(barred()).toEqual([4]);
    expect(TablePreferences.getActiveExclusions('Test')).toEqual([4]);
  });
});
