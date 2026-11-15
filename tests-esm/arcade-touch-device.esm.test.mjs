/**
 * Jeux d'Arcade sur un appareil qu'on joue au doigt. Les quatre jeux reconnaissaient un
 * téléphone à son seul nom de navigateur : un iPad (Safari se présente comme un Mac) ou une
 * tablette Windows recevait la consigne « Utilise les flèches du clavier » et le plateau d'un
 * ordinateur, où les monstres des bords de MultiInvaders sortaient du cadre (vu dans Chrome
 * en 390 px tactile). Le pointeur principal décide désormais aussi.
 */
import { describe, test, expect, afterEach } from '@jest/globals';
import fs from 'node:fs';
import {
  renderArcadeStage,
  simulateArcadeScreen,
  useAndroidUserAgent,
  useCoarsePointer,
} from './helpers/arcade-screen-helpers.mjs';

const { isTouchFirstDevice } = await import('../js/arcade-common.js');
const { calculateCanvasDimensions } = await import('../js/arcade-invasion.js');

const restorers = [];

afterEach(() => {
  while (restorers.length) restorers.pop()();
});

describe('isTouchFirstDevice', () => {
  test('un téléphone Android : au doigt', () => {
    restorers.push(useAndroidUserAgent());
    expect(isTouchFirstDevice()).toBe(true);
  });

  test('un ordinateur à la souris : pas au doigt', () => {
    expect(isTouchFirstDevice()).toBe(false);
  });

  test('un iPad, qui se dit Mac, au pointeur principal tactile : au doigt', () => {
    restorers.push(useCoarsePointer());
    expect(isTouchFirstDevice()).toBe(true);
  });
});

describe('Aucun jeu ne se fie au seul nom du navigateur', () => {
  // Fichiers qui adaptent le jeu à l'appareil (plateau, consigne, vitesse, tolérance du doigt)
  const ADAPTING_FILES = [
    'js/arcade-invasion.js',
    'js/arcade-multimemory.js',
    'js/arcade-multimiam.js',
    'js/multisnake.js',
  ];

  test.each(ADAPTING_FILES)('%s passe par isTouchFirstDevice', file => {
    const source = fs.readFileSync(file, 'utf8');
    expect(source).not.toMatch(/userAgent/);
    expect(source).toMatch(/isTouchFirstDevice\(\)/);
  });

  test('MultiMiam ne garde plus de drapeau « mobile » que rien ne lisait', () => {
    expect(fs.readFileSync('js/multimiam.js', 'utf8')).not.toMatch(/userAgent|isMobile/);
  });
});

describe('MultiInvaders sur un iPad', () => {
  test('le plateau d’un téléphone : toute la largeur et toute la hauteur', () => {
    restorers.push(useCoarsePointer());
    restorers.push(simulateArcadeScreen({ width: 363, height: 844 }));
    const { canvas } = renderArcadeStage('arcade-canvas');
    const { displayWidth, displayHeight, isMobile } = calculateCanvasDimensions(canvas);
    expect(isMobile).toBe(true);
    expect(displayWidth).toBe(363);
    expect(displayHeight).toBeGreaterThan(displayWidth);
  });
});
