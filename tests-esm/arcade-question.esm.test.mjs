/**
 * Calcul du bandeau des jeux d'Arcade (js/arcade-question.js) : le « ? », puis la réponse,
 * dans une case ; le texte lu reste celui que le jeu a écrit, au caractère près ; le nombre
 * de chiffres règle la taille du texte dans sa case (css/arcade.css).
 */
import { describe, test, expect, beforeEach } from '@jest/globals';
import { writeArcadeQuestion } from '../js/arcade-question.js';

const NBSP = ' ';
let question;

const box = () => question.querySelector('.arcade-answer-box');
const glyphs = () => question.style.getPropertyValue('--question-glyphs');

beforeEach(() => {
  question = document.createElement('span');
  question.className = 'arcade-question';
  document.body.replaceChildren(question);
});

describe('La question', () => {
  test('le « ? » va dans sa case, le début du calcul reste devant, espace comprise', () => {
    writeArcadeQuestion('7 × 5 = ?', question);
    expect(box().textContent).toBe('?');
    expect(question.firstChild.nodeType).toBe(Node.TEXT_NODE);
    expect(question.firstChild.textContent).toBe('7 × 5 = ');
    expect(question.childNodes).toHaveLength(2);
  });

  test.each(['7 × 5 = ?', '12 × 12 = ?', '144 ÷ 12 = ?', '100 − 100 = ?', '20 + 20 = ?'])(
    '« %s » : le texte lu est celui reçu, au caractère près',
    text => {
      writeArcadeQuestion(text, question);
      expect(question.textContent).toBe(text);
    }
  );

  test('sans élément donné, elle s’écrit dans le calcul du bandeau', () => {
    writeArcadeQuestion('3 × 4 = ?');
    expect(question.textContent).toBe('3 × 4 = ?');
  });

  test('sans bandeau à l’écran, rien ne casse', () => {
    document.body.replaceChildren();
    expect(() => writeArcadeQuestion('3 × 4 = ?')).not.toThrow();
  });
});

describe('Le calcul complet', () => {
  const solved = ['12', '×', '12', '=', '144'].join(NBSP);

  test('la réponse prend la place du « ? », dans la même case', () => {
    writeArcadeQuestion('12 × 12 = ?', question);
    writeArcadeQuestion(solved, question);
    expect(question.querySelectorAll('.arcade-answer-box')).toHaveLength(1);
    expect(box().textContent).toBe('144');
    expect(question.textContent).toBe(solved);
  });

  test('les espaces insécables du calcul complet sont gardées', () => {
    writeArcadeQuestion(solved, question);
    expect(question.firstChild.textContent).toBe(`12${NBSP}×${NBSP}12${NBSP}=${NBSP}`);
  });
});

describe('Ce qui n’est pas un calcul', () => {
  test('texte vide : aucun enfant, la place du calcul reste vide', () => {
    writeArcadeQuestion('3 × 4 = ?', question);
    writeArcadeQuestion('', question);
    expect(question.childNodes).toHaveLength(0);
    expect(glyphs()).toBe('0');
  });

  test.each([[null], [undefined]])('%s : écrit comme un texte vide', value => {
    writeArcadeQuestion(value, question);
    expect(question.textContent).toBe('');
  });

  test.each(['Trouve les paires', '7 × 5 =', '7 × 5 = '])(
    '« %s » : écrit tel quel, sans case',
    text => {
      writeArcadeQuestion(text, question);
      expect(question.textContent).toBe(text);
      expect(box()).toBeNull();
    }
  );
});

describe('La taille du texte', () => {
  test.each([
    ['3 × 4 = ?', '3'],
    ['12 × 12 = ?', '5'],
    ['144 ÷ 12 = ?', '6'],
    ['100 − 100 = ?', '7'],
    [['12', '×', '12', '=', '144'].join(NBSP), '7'],
  ])('« %s » : %s chiffres et « ? » comptés', (text, count) => {
    writeArcadeQuestion(text, question);
    expect(glyphs()).toBe(count);
  });

  test('le compte suit le calcul affiché, pas le précédent', () => {
    writeArcadeQuestion('100 − 100 = ?', question);
    writeArcadeQuestion('3 × 4 = ?', question);
    expect(glyphs()).toBe('3');
  });
});
