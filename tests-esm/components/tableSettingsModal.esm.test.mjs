/* eslint-env jest, node */
/**
 * Fenêtre « Paramètres des tables » : ce qui s'affiche est ce qui s'applique.
 * - interrupteur coupé : aucune table n'est barrée (toutes sont jouées) ;
 * - toucher une table quand l'interrupteur est coupé l'allume et retire cette table ;
 * - couper l'interrupteur rend toutes les tables jouables, sans perdre la sélection ;
 * - la dernière table jouée ne se retire pas, et la fenêtre dit pourquoi : avant, les dix
 *   se retiraient, puis le premier jeu remettait tout à zéro sans rien dire.
 */
import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { readFileSync } from 'node:fs';

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

describe('Fenêtre des tables : le focus revient en se fermant', () => {
  const escape = () =>
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    );

  test('au bouton qui l’a ouverte', () => {
    open();
    expect(document.activeElement.closest('#table-settings-modal')).not.toBeNull();
    escape();
    expect(document.activeElement).toBe(document.getElementById('opener'));
  });

  test('au téléphone, menu ☰ refermé par un toucher dans la fenêtre : au bouton ☰', () => {
    const bar = document.createElement('div');
    bar.className = 'top-bar';
    const burger = document.createElement('button');
    burger.className = 'burger-menu-btn';
    const nav = document.createElement('div');
    nav.className = 'top-bar-nav';
    const opener = document.getElementById('opener');
    nav.appendChild(opener);
    bar.append(burger, nav);
    document.body.appendChild(bar);
    opener.focus();
    open();
    tableButton(7).click();
    // Le menu s'est refermé (toucher hors de la barre) : le bouton d'origine est caché
    opener.checkVisibility = () => false;
    escape();
    expect(document.activeElement).toBe(burger);
  });
});

describe('Fenêtre des tables : au moins une table reste jouée', () => {
  const FR = JSON.parse(
    readFileSync(new URL('../../assets/translations/fr.json', import.meta.url), 'utf8')
  );
  const NINE = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const message = () => document.getElementById('table-settings-message');

  beforeEach(() => {
    store.setTranslations(FR);
    userData = { tablePreferences: { globalExclusions: [], globalEnabled: false } };
    open();
    NINE.forEach(n => tableButton(n).click());
  });

  test('retirer la dernière est refusé : elle reste jouable, rien n’est remis à zéro', () => {
    tableButton(10).click();
    expect(barred()).toEqual(NINE);
    expect(tableButton(10).getAttribute('aria-pressed')).toBe('false');
    expect(TablePreferences.getActiveExclusions('Test')).toEqual(NINE);
    expect(TablePreferences.isGlobalEnabled('Test')).toBe(true);
  });

  test('la fenêtre dit pourquoi, sous les tables, relié à la touche refusée', () => {
    expect(message().hidden).toBe(true);
    tableButton(10).click();
    expect(message().hidden).toBe(false);
    expect(message().textContent).toBe(FR.table_settings_keep_one);
    expect(message().getAttribute('role')).toBe('alert');
    expect(tableButton(10).getAttribute('aria-describedby')).toBe('table-settings-message');
    // Sous les tables, avant la ligne « Tables retirées »
    expect(document.getElementById('tables-grid').nextElementSibling).toBe(message());
  });

  test('le message part dès qu’une table redevient jouable', async () => {
    tableButton(10).click();
    // Le 3 vient d'être touché (beforeEach) : singleActivation ignore un second clic avant
    // la tâche suivante, comme deux touchers distincts
    await new Promise(resolve => setTimeout(resolve, 0));
    tableButton(3).click();
    expect(message().hidden).toBe(true);
    expect(tableButton(10).hasAttribute('aria-describedby')).toBe(false);
    expect(barred()).toEqual([1, 2, 4, 5, 6, 7, 8, 9]);
  });
});
