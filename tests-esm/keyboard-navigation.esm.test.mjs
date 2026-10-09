/**
 * @jest-environment jsdom
 *
 * Navigation clavier globale : elle ne doit pas voler les touches d'un jeu.
 */
import { afterEach, describe, expect, jest, test } from '@jest/globals';

// Le module installe ses écouteurs sur document dès l'import
await import('../js/keyboard-navigation.js');
const { Utils } = await import('../js/core/utils.js');

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

/** Appui comme dans un navigateur : l'événement remonte et peut être annulé */
function appuyer(key) {
  document.activeElement.dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
  );
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

  test('menu déroulant, curseur, champ de texte : flèches, Début et Fin restent au contrôle', () => {
    bouton('Accueil', 0);
    const select = placer(document.createElement('select'), 100);
    select.append(new Option('Sulafat', 'sulafat'), new Option('Jane', 'jane'));
    const range = placer(Object.assign(document.createElement('input'), { type: 'range' }), 200);
    const text = placer(Object.assign(document.createElement('input'), { type: 'text' }), 300);
    for (const control of [select, range, text]) {
      control.focus();
      for (const key of ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'Home', 'End']) {
        appuyer(key);
        expect(document.activeElement).toBe(control);
      }
    }
  });

  test('hors jeu, les flèches passent toujours d’un bouton à l’autre', () => {
    const premier = bouton('Quiz', 0);
    const second = bouton('Défi', 100);
    premier.focus();

    appuyer('ArrowRight');

    expect(document.activeElement).toBe(second);
  });

  test('une flèche déjà traitée par la grille des réponses ne repart pas vers la barre du haut', () => {
    // Grille de deux réponses (navigation par flèches de GameMode), puis la barre du haut
    // à droite : « Changer de joueur » est le voisin de droite de la seconde réponse
    const grille = document.createElement('div');
    document.body.appendChild(grille);
    const reponses = [16, 20].map((valeur, i) => {
      const option = bouton(String(valeur), i * 100);
      option.className = 'option';
      grille.appendChild(option);
      return option;
    });
    bouton('Changer de joueur', 400);
    Utils.addArrowKeyNavigation(grille, '.option', { autoFocus: false });
    reponses[0].focus();

    appuyer('ArrowRight');
    expect(document.activeElement).toBe(reponses[1]);

    appuyer('ArrowLeft');
    expect(document.activeElement).toBe(reponses[0]);
  });
});
