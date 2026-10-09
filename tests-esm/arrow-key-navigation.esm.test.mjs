/* eslint-env jest, node */
/**
 * Utils.addArrowKeyNavigation : les flèches parcourent les éléments d'un conteneur (en boucle
 * ou non), Entrée et Espace activent l'élément courant. Décrit touche par touche pour que le
 * gestionnaire puisse être découpé sans rien changer.
 */
import { afterEach, describe, expect, jest, test } from '@jest/globals';

const { Utils } = await import('../js/core/utils.js');

/** Un conteneur de n boutons .opt, chacun compte ses clics */
function grid(n) {
  const container = document.createElement('div');
  const clicks = [];
  for (let i = 0; i < n; i++) {
    const button = document.createElement('button');
    button.className = 'opt';
    button.textContent = String(i);
    button.addEventListener('click', () => clicks.push(i));
    container.appendChild(button);
  }
  document.body.appendChild(container);
  return { container, clicks, items: () => [...container.querySelectorAll('.opt')] };
}

/** Appuie sur une touche dans le conteneur ; rend true si le navigateur ne doit rien faire */
function press(container, key) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
  container.dispatchEvent(event);
  return event.defaultPrevented;
}

const focusedIndex = g => g.items().findIndex(item => item.classList.contains('focused'));

afterEach(() => document.body.replaceChildren());

describe('Navigation par flèches dans un conteneur', () => {
  test('en boucle : avant le premier, le dernier ; après le dernier, le premier', () => {
    const g = grid(3);
    Utils.addArrowKeyNavigation(g.container, '.opt', { autoFocus: false });
    expect(press(g.container, 'ArrowUp')).toBe(true);
    expect(focusedIndex(g)).toBe(2);
    expect(document.activeElement).toBe(g.items()[2]);
    expect(press(g.container, 'ArrowRight')).toBe(true);
    expect(focusedIndex(g)).toBe(0);
    expect(press(g.container, 'ArrowDown')).toBe(true);
    expect(focusedIndex(g)).toBe(1);
    expect(press(g.container, 'ArrowLeft')).toBe(true);
    expect(focusedIndex(g)).toBe(0);
    expect(g.items().filter(item => item.classList.contains('focused'))).toHaveLength(1);
  });

  test('sans boucle : la flèche s’arrête au premier et au dernier', () => {
    const g = grid(3);
    Utils.addArrowKeyNavigation(g.container, '.opt', { autoFocus: false, loop: false });
    press(g.container, 'ArrowUp');
    expect(focusedIndex(g)).toBe(0);
    press(g.container, 'ArrowDown');
    press(g.container, 'ArrowDown');
    press(g.container, 'ArrowDown');
    expect(focusedIndex(g)).toBe(2);
    press(g.container, 'ArrowLeft');
    expect(focusedIndex(g)).toBe(1);
  });

  test('Entrée et Espace : onClick reçoit l’élément et son rang, sinon un clic', () => {
    const g = grid(3);
    const onClick = jest.fn();
    Utils.addArrowKeyNavigation(g.container, '.opt', { autoFocus: false, onClick });
    press(g.container, 'ArrowDown');
    expect(press(g.container, 'Enter')).toBe(true);
    expect(onClick).toHaveBeenCalledWith(g.items()[1], 1);
    expect(g.clicks).toEqual([]);

    const h = grid(2);
    Utils.addArrowKeyNavigation(h.container, '.opt', { autoFocus: false });
    expect(press(h.container, ' ')).toBe(true);
    expect(h.clicks).toEqual([0]);
  });

  test('une autre touche, ou un conteneur vide : rien n’est intercepté', () => {
    const g = grid(2);
    Utils.addArrowKeyNavigation(g.container, '.opt', { autoFocus: false });
    expect(press(g.container, 'a')).toBe(false);
    expect(press(g.container, 'Tab')).toBe(false);
    expect(focusedIndex(g)).toBe(-1);

    const empty = grid(0);
    Utils.addArrowKeyNavigation(empty.container, '.opt', { autoFocus: false });
    expect(press(empty.container, 'ArrowDown')).toBe(false);
    expect(press(empty.container, 'Enter')).toBe(false);
  });

  test('des éléments retirés : Entrée sur une place vide ne fait rien, la flèche revient', () => {
    const g = grid(3);
    Utils.addArrowKeyNavigation(g.container, '.opt', { autoFocus: false, loop: false });
    press(g.container, 'ArrowDown');
    press(g.container, 'ArrowDown');
    g.items()[2].remove();
    g.items()[1].remove();
    expect(press(g.container, 'Enter')).toBe(true);
    expect(g.clicks).toEqual([]);
    press(g.container, 'ArrowDown');
    expect(focusedIndex(g)).toBe(0);
    press(g.container, ' ');
    expect(g.clicks).toEqual([0]);
  });

  test('focus initial au premier élément, et la fonction rendue détache les touches', () => {
    jest.useFakeTimers();
    const g = grid(2);
    const detach = Utils.addArrowKeyNavigation(g.container, '.opt');
    jest.runAllTimers();
    jest.useRealTimers();
    expect(focusedIndex(g)).toBe(0);
    detach();
    expect(press(g.container, 'ArrowDown')).toBe(false);
    expect(focusedIndex(g)).toBe(0);
    expect(Utils.addArrowKeyNavigation('#absent', '.opt')).toBeUndefined();
  });
});
