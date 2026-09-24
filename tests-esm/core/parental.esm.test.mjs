/**
 * @jest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { showParentalLockPopup } from '../../js/core/parental.js';

const MAX_WORD = 2 ** 32 - 1;

function addElement(tag, id) {
  const element = document.createElement(tag);
  element.id = id;
  document.body.appendChild(element);
  return element;
}

describe('Contrôle parental', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    addElement('div', 'parental-lock-popup');
    addElement('p', 'parental-question');
    addElement('input', 'parental-answer');
    addElement('p', 'parental-error');
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    document.body.replaceChildren();
  });

  it('pose une addition dont chaque terme va de 10 à 50', () => {
    const words = [0, MAX_WORD];
    jest.spyOn(globalThis.crypto, 'getRandomValues').mockImplementation(array => {
      array[0] = words.shift();
      return array;
    });

    showParentalLockPopup(() => {});

    expect(document.getElementById('parental-question').textContent).toBe('10 + 50 = ?');
    expect(document.getElementById('parental-answer').dataset.expectedAnswer).toBe('60');
  });

  it('affiche la fenêtre et donne le focus à la réponse', () => {
    showParentalLockPopup(() => {});
    const popup = document.getElementById('parental-lock-popup');
    expect(popup.style.display).toBe('flex');

    jest.advanceTimersByTime(10);
    expect(popup.classList.contains('visible')).toBe(true);
    expect(document.activeElement).toBe(document.getElementById('parental-answer'));
  });
});
