/* eslint-env jest, node */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';

const { OperationSelector } = await import('../../js/components/operationSelector.js');
const { UserManager } = await import('../../js/userManager.js');

describe('OperationSelector : contrôle segmenté compact', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="operation-selector-container"></div>';
    UserManager._players = { Lina: { avatar: 'panda', preferredOperator: '+' } };
    UserManager._currentUser = 'Lina';
  });

  afterEach(() => {
    document.body.innerHTML = '';
    UserManager._players = {};
    UserManager._currentUser = null;
  });

  test('un groupe nommé par son libellé visible, sans panneau imbriqué', () => {
    OperationSelector.inject('operation-selector-container');

    const group = document.querySelector('.operation-selector');
    expect(group.getAttribute('role')).toBe('group');
    const labelId = group.getAttribute('aria-labelledby');
    expect(document.getElementById(labelId)?.classList.contains('operation-selector-label')).toBe(
      true
    );
    expect(document.querySelector('.operation-selector-wrapper')).toBeNull();
  });

  test('quatre options : icône décorative, libellé, coche ; seule l’opération du joueur est pressée', () => {
    OperationSelector.inject('operation-selector-container');

    const buttons = [...document.querySelectorAll('.operation-btn')];
    expect(buttons.map(b => b.dataset.operator)).toEqual(['×', '+', '−', '÷']);
    for (const btn of buttons) {
      expect(btn.type).toBe('button');
      expect(btn.hasAttribute('aria-label')).toBe(false);
      expect(btn.querySelector('img.operation-icon').getAttribute('alt')).toBe('');
      expect(btn.querySelector('.operation-label').textContent).not.toBe('');
      expect(btn.querySelector('svg.operation-check')?.getAttribute('aria-hidden')).toBe('true');
    }
    expect(buttons.map(b => b.getAttribute('aria-pressed'))).toEqual([
      'false',
      'true',
      'false',
      'false',
    ]);
    expect(buttons[1].classList.contains('active')).toBe(true);
  });

  test('choisir une option la presse, enregistre le choix et prévient les modes', () => {
    OperationSelector.inject('operation-selector-container');
    const listener = jest.fn();
    globalThis.addEventListener('operation-changed', listener);

    const division = document.querySelector('.operation-btn[data-operator="÷"]');
    division.click();

    expect(division.getAttribute('aria-pressed')).toBe('true');
    expect(division.classList.contains('active')).toBe(true);
    expect(
      [...document.querySelectorAll('.operation-btn[aria-pressed="true"]')].map(
        b => b.dataset.operator
      )
    ).toEqual(['÷']);
    expect(UserManager.getCurrentUserData().preferredOperator).toBe('÷');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].detail).toEqual({ operator: '÷', oldOperator: '+' });

    globalThis.removeEventListener('operation-changed', listener);
  });

  test('refresh remplace le sélecteur sans le dupliquer', () => {
    OperationSelector.inject('operation-selector-container');
    OperationSelector.refresh('operation-selector-container');

    expect(document.querySelectorAll('.operation-selector')).toHaveLength(1);
    expect(document.querySelectorAll('.operation-btn')).toHaveLength(4);
  });
});
