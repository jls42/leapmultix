/* eslint-env jest, node */
/**
 * touch-support.js ne simule plus de touches de clavier sur les canevas d'Arcade.
 * initArcadeTouchSupport cherchait un `.arcade-canvas` au chargement de la page : il n'y en a
 * jamais (les jeux créent leur canevas au lancement), il ne s'attachait donc à rien. S'il
 * s'était attaché, chaque glissement aurait envoyé de fausses flèches et chaque toucher une
 * fausse barre d'espace, en plus des gestes des jeux eux-mêmes (js/arcade-touch.js).
 */
import { describe, test, expect } from '@jest/globals';
import { swipe, tap } from './helpers/touch-test-helpers.mjs';

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
