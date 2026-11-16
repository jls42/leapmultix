/* eslint-env jest, node */
/**
 * Écran allumé pendant une partie (js/screen-awake.js) : verrou d'écran (Screen Wake Lock)
 * simulé, horloge simulée pour le délai sans geste.
 */
import { describe, test, expect, beforeAll, beforeEach, afterEach, jest } from '@jest/globals';

const { GAME_SLIDE, IDLE_MS, installScreenAwake, screenShown } = await import(
  '../js/screen-awake.js'
);
const { watchSlideChanges } = await import('../js/core/mainInit.js');

/** navigator.wakeLock simulé : les verrous tenus, les demandes, un refus ou une attente */
function fakeWakeLock() {
  const api = {
    held: new Set(),
    refuse: false,
    waiting: null,
    request: jest.fn(type => {
      if (api.refuse) return Promise.reject(new DOMException('refus', 'NotAllowedError'));
      const sentinel = Object.assign(new EventTarget(), { type, released: false });
      sentinel.release = async () => {
        if (sentinel.released) return;
        sentinel.released = true;
        api.held.delete(sentinel);
        sentinel.dispatchEvent(new Event('release'));
      };
      const grant = () => {
        api.held.add(sentinel);
        return sentinel;
      };
      if (!api.waiting) return Promise.resolve(grant());
      // Demande qui n'aboutit qu'à l'appel de api.waiting.resolve()
      return new Promise(resolve => {
        api.waiting.resolve = () => resolve(grant());
      });
    }),
    /** Le navigateur rend tout verrou quand la page se cache */
    dropAll() {
      // Retirer d'un Set l'élément en cours de parcours ne saute aucun des suivants
      for (const sentinel of api.held) void sentinel.release();
    },
  };
  return api;
}

let wakeLock;
let visibility = 'visible';
const settle = () => jest.advanceTimersByTimeAsync(0);

function setVisibility(state) {
  visibility = state;
  document.dispatchEvent(new Event('visibilitychange'));
}

function tap() {
  document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
}

beforeAll(() => {
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    get: () => visibility,
  });
  installScreenAwake();
});

beforeEach(() => {
  jest.useFakeTimers();
  visibility = 'visible';
  wakeLock = fakeWakeLock();
  Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: wakeLock });
});

afterEach(async () => {
  screenShown('slide0');
  await settle();
  jest.useRealTimers();
});

describe('Écran allumé pendant une partie', () => {
  test("l'écran de jeu garde l'écran allumé, un autre écran rend la veille", async () => {
    screenShown(GAME_SLIDE);
    await settle();
    expect(wakeLock.request).toHaveBeenCalledWith('screen');
    expect(wakeLock.held.size).toBe(1);

    screenShown('slide5');
    await settle();
    expect(wakeLock.held.size).toBe(0);
  });

  test('hors écran de jeu, un geste ne demande rien', async () => {
    screenShown('slide0');
    tap();
    await settle();
    expect(wakeLock.request).not.toHaveBeenCalled();
  });

  test('après 5 minutes sans geste, la veille revient ; le geste suivant la reprend', async () => {
    screenShown(GAME_SLIDE);
    await settle();
    await jest.advanceTimersByTimeAsync(IDLE_MS - 1000);
    expect(wakeLock.held.size).toBe(1);

    await jest.advanceTimersByTimeAsync(1000);
    expect(wakeLock.held.size).toBe(0);

    tap();
    await settle();
    expect(wakeLock.held.size).toBe(1);
  });

  test('chaque geste repousse la veille de 5 minutes', async () => {
    screenShown(GAME_SLIDE);
    await settle();
    await jest.advanceTimersByTimeAsync(IDLE_MS - 1000);
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: '7', bubbles: true }));
    await jest.advanceTimersByTimeAsync(IDLE_MS - 1000);
    expect(wakeLock.held.size).toBe(1);
    expect(wakeLock.request).toHaveBeenCalledTimes(1);
  });

  test('la page cachée rend le verrou ; revenue sur la partie, elle le redemande', async () => {
    screenShown(GAME_SLIDE);
    await settle();
    setVisibility('hidden');
    wakeLock.dropAll();
    await settle();
    expect(wakeLock.held.size).toBe(0);

    setVisibility('visible');
    await settle();
    expect(wakeLock.held.size).toBe(1);
    expect(wakeLock.request).toHaveBeenCalledTimes(2);
  });

  test('revenue sur un autre écran que celui de jeu, la page ne demande rien', async () => {
    screenShown('slide7');
    setVisibility('hidden');
    setVisibility('visible');
    await settle();
    expect(wakeLock.request).not.toHaveBeenCalled();
  });

  test("l'écran de jeu quitté pendant la demande : le verrou obtenu est rendu", async () => {
    wakeLock.waiting = {};
    screenShown(GAME_SLIDE);
    await settle();
    screenShown('slide0');
    wakeLock.waiting.resolve();
    await settle();
    expect(wakeLock.held.size).toBe(0);
  });

  test('un refus (économie d’énergie) ne casse rien, et le geste suivant redemande', async () => {
    wakeLock.refuse = true;
    screenShown(GAME_SLIDE);
    await settle();
    expect(wakeLock.held.size).toBe(0);

    wakeLock.refuse = false;
    tap();
    await settle();
    expect(wakeLock.held.size).toBe(1);
  });

  test("sans l'API (navigateur ancien), rien ne change", async () => {
    Reflect.deleteProperty(navigator, 'wakeLock');
    expect(() => {
      screenShown(GAME_SLIDE);
      tap();
    }).not.toThrow();
    await settle();
  });
});

describe('Branchement sur le changement d’écran (core/mainInit.js)', () => {
  test("ouvrir l'écran de jeu garde l'écran allumé, en sortir le rend", async () => {
    globalThis.scrollTo = () => {};
    const slide = id =>
      Object.assign(document.createElement('section'), { id, className: 'slide' });
    const home = slide('slide0');
    const game = slide(GAME_SLIDE);
    home.classList.add('active-slide');
    document.body.replaceChildren(home, game);
    watchSlideChanges();

    home.classList.remove('active-slide');
    game.classList.add('active-slide');
    await settle();
    expect(wakeLock.held.size).toBe(1);

    game.classList.remove('active-slide');
    home.classList.add('active-slide');
    await settle();
    expect(wakeLock.held.size).toBe(0);
    document.body.replaceChildren();
  });
});
