/**
 * Gestes communs des mini-jeux qu'on dirige (js/arcade-touch.js) : seuil du glissement,
 * axe dominant, toucher tolérant, virages en cours de geste et gestes à deux doigts.
 */
import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { swipe, tap, touchEvent } from './helpers/touch-test-helpers.mjs';

const { SWIPE_THRESHOLD_PX, attachDirectionalTouch, swipeDirection } = await import(
  '../js/arcade-touch.js'
);

describe('swipeDirection', () => {
  test('rien tant que le doigt reste sous le seuil', () => {
    const below = SWIPE_THRESHOLD_PX - 1;
    expect(swipeDirection(below, -below)).toBeNull();
  });

  test("l'axe dominant donne la direction", () => {
    expect(swipeDirection(30, -12)).toBe('RIGHT');
    expect(swipeDirection(-30, 12)).toBe('LEFT');
    expect(swipeDirection(5, 40)).toBe('DOWN');
    expect(swipeDirection(-5, -40)).toBe('UP');
  });
});

describe('attachDirectionalTouch', () => {
  let canvas;
  let onSwipe;
  let onTap;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    document.body.replaceChildren(canvas);
    onSwipe = jest.fn();
    onTap = jest.fn();
    attachDirectionalTouch(canvas, { onSwipe, onTap });
  });

  test('le navigateur ne fait rien du geste (ni défilement, ni zoom, ni clic simulé)', () => {
    const events = [
      touchEvent('touchstart', { x: 10, y: 10 }),
      touchEvent('touchmove', { x: 10, y: 40 }),
      touchEvent('touchend', { x: 10, y: 40 }),
    ];
    for (const event of events) canvas.dispatchEvent(event);
    expect(events.map(event => event.defaultPrevented)).toEqual([true, true, true]);
  });

  test('un glissement vers le haut donne des virages vers le haut, et aucun toucher', () => {
    swipe(canvas, { x: 100, y: 100 }, { x: 102, y: 40 });
    expect(onSwipe).toHaveBeenCalled();
    expect(onSwipe.mock.calls.every(([direction]) => direction === 'UP')).toBe(true);
    expect(onTap).not.toHaveBeenCalled();
  });

  test('un doigt qui tremble sous le seuil vaut un toucher, au point où il s’est posé', () => {
    tap(canvas, { x: 50, y: 60 }, { jitter: 3 });
    expect(onTap).toHaveBeenCalledTimes(1);
    expect(onTap).toHaveBeenCalledWith(50, 60);
    expect(onSwipe).not.toHaveBeenCalled();
  });

  test('un doigt qui tourne en cours de geste enchaîne les virages', () => {
    canvas.dispatchEvent(touchEvent('touchstart', { x: 100, y: 100 }));
    canvas.dispatchEvent(touchEvent('touchmove', { x: 101, y: 80 }));
    canvas.dispatchEvent(touchEvent('touchmove', { x: 130, y: 78 }));
    canvas.dispatchEvent(touchEvent('touchend', { x: 130, y: 78 }));
    expect(onSwipe.mock.calls).toEqual([['UP'], ['RIGHT']]);
    expect(onTap).not.toHaveBeenCalled();
  });

  test('deux doigts posés puis levés font un seul toucher, au premier doigt', () => {
    const first = { x: 50, y: 50 };
    const second = { x: 200, y: 200 };
    canvas.dispatchEvent(touchEvent('touchstart', first));
    canvas.dispatchEvent(touchEvent('touchstart', second, [first]));
    canvas.dispatchEvent(touchEvent('touchend', second, [first]));
    canvas.dispatchEvent(touchEvent('touchend', first));
    expect(onTap).toHaveBeenCalledTimes(1);
    expect(onTap).toHaveBeenCalledWith(first.x, first.y);
  });
});
