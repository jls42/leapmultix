/* eslint-env jest, node */
/**
 * touch-support.js ne simule plus de touches de clavier sur les canevas d'Arcade.
 * initArcadeTouchSupport cherchait un `.arcade-canvas` au chargement de la page : il n'y en a
 * jamais (les jeux créent leur canevas au lancement), il ne s'attachait donc à rien. S'il
 * s'était attaché, chaque glissement aurait envoyé de fausses flèches et chaque toucher une
 * fausse barre d'espace, en plus des gestes des jeux eux-mêmes (js/arcade-touch.js).
 */
import { describe, test, expect } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { swipe, tap, touchEvent } from './helpers/touch-test-helpers.mjs';

describe('touch-support.js et les canevas d’Arcade', () => {
  test('un canevas présent au chargement ne reçoit aucun faux appui de touche', async () => {
    const canvas = document.createElement('canvas');
    canvas.className = 'arcade-canvas';
    document.body.appendChild(canvas);
    await import('../js/touch-support.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const keys = [];
    document.addEventListener('keydown', event => keys.push(event.key));
    swipe(canvas, { x: 100, y: 100 }, { x: 160, y: 100 });
    tap(canvas, { x: 120, y: 120 });

    expect(keys).toEqual([]);
  });
});

describe('pincer pour agrandir', () => {
  test('la page se laisse agrandir : ni plafond de zoom ni user-scalable=no (axe)', () => {
    const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
    const viewport = /<meta\s+name="viewport"\s+content="([^"]+)"/.exec(html)?.[1];
    expect(viewport).toContain('width=device-width');
    expect(viewport).not.toMatch(/maximum-scale|user-scalable=no/);
  });

  /** Deux doigts qui s'écartent sur l'élément : le mouvement est-il empêché ? */
  function pinch(target) {
    const move = touchEvent('touchmove', { x: 160, y: 200 }, [{ x: 100, y: 200 }]);
    target.dispatchEvent(move);
    return move.defaultPrevented;
  }

  test('hors des jeux, le pincement agrandit la page (WCAG 1.4.4) : rien n’est empêché', async () => {
    await import('../js/touch-support.js');
    const text = document.createElement('p');
    document.body.appendChild(text);
    expect(pinch(text)).toBe(false);
  });

  test('sur l’écran d’un jeu d’Arcade, un pincement ne zoome pas par accident', async () => {
    await import('../js/touch-support.js');
    const screen = document.createElement('div');
    screen.className = 'arcade-game-ui';
    const abandon = document.createElement('button');
    screen.appendChild(abandon);
    const bar = document.createElement('div');
    bar.className = 'arcade-mult-display';
    document.body.append(bar, screen);
    expect(pinch(abandon)).toBe(true);
    expect(pinch(bar)).toBe(true);
  });
});
