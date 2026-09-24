/**
 * @jest-environment jsdom
 *
 * Navigation clavier globale : elle ne doit pas voler les touches d'un jeu.
 */
import { afterEach, describe, expect, jest, test } from '@jest/globals';

// Le module installe ses écouteurs sur document dès l'import
await import('../js/keyboard-navigation.js');

/** Ajoute l'élément à la page, à l'abscisse donnée (jsdom ne calcule pas la mise en page) */
function placer(element, left) {
  element.getBoundingClientRect = () => ({
    left,
    right: left + 40,
    top: 0,
    bottom: 40,
    width: 40,
    height: 40,
  });
  document.body.appendChild(element);
  return element;
}

function bouton(texte, left) {
  const element = document.createElement('button');
  element.textContent = texte;
  return placer(element, left);
}

function canevasDeJeu(left) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('tabindex', '0');
  return placer(canvas, left);
}

function appuyer(key) {
  document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

describe('Navigation clavier globale', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  test('les flèches restent au jeu quand son canevas a le focus', () => {
    bouton('Accueil', 0);
    const canvas = canevasDeJeu(100);
    canvas.focus();

    for (const key of ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown']) {
      appuyer(key);
      expect(document.activeElement).toBe(canvas);
    }
  });

  test('tirer avec la barre d’espace ne clique pas le bouton voisin', () => {
    const accueil = bouton('Accueil', 0);
    const clic = jest.fn();
    accueil.addEventListener('click', clic);
    canevasDeJeu(100).focus();

    appuyer('ArrowLeft');
    appuyer(' ');

    expect(clic).not.toHaveBeenCalled();
  });

  test('hors jeu, les flèches passent toujours d’un bouton à l’autre', () => {
    const premier = bouton('Quiz', 0);
    const second = bouton('Défi', 100);
    premier.focus();

    appuyer('ArrowRight');

    expect(document.activeElement).toBe(second);
  });
});
