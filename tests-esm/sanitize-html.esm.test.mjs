/* eslint-env jest, node */
/**
 * Assainisseur des gabarits (js/security-utils.js) : une valeur venue d'un profil, repris d'un
 * fichier de sauvegarde par exemple, peut finir dans un gabarit. Elle ne doit ni faire naviguer
 * la page (meta refresh), ni changer l'adresse de base des liens, ni charger une feuille de
 * style, ni envoyer un formulaire. Aucun gabarit du jeu n'utilise ces balises : elles partent
 * avec leur contenu. Une adresse en javascript: ne reste sur aucun attribut d'adresse.
 */
import { describe, expect, test } from '@jest/globals';

const { sanitizeHtmlToFragment } = await import('../js/security-utils.js');

/** Le fragment assaini, monté dans un conteneur pour l'interroger */
const sanitized = html => {
  const box = document.createElement('div');
  box.appendChild(sanitizeHtmlToFragment(html));
  return box;
};

describe('Balises qui agissent sur toute la page : retirées', () => {
  // Après un premier élément, comme dans un gabarit : le parseur les range dans le corps
  test.each([
    ['meta refresh', 'meta', '<meta http-equiv="refresh" content="0;url=https://example.test/">'],
    ['base', 'base', '<base href="https://example.test/">'],
    ['feuille de style', 'link', '<link rel="stylesheet" href="https://example.test/x.css">'],
    ['formulaire', 'form', '<form action="https://example.test/"><button>Envoyer</button></form>'],
  ])('%s', (_, tag, html) => {
    const box = sanitized(`<p>Avant</p>${html}<p>Après</p>`);
    expect(box.querySelector(tag)).toBeNull();
    expect(box.textContent).toBe('AvantAprès');
  });
});

describe('Adresses en javascript: : retirées de tout attribut d’adresse', () => {
  test.each(['formaction', 'action', 'href', 'src'])('%s', attribute => {
    const box = sanitized(`<p>Avant</p><button ${attribute}="javascript:alert(1)">OK</button>`);
    expect(box.querySelector('button').hasAttribute(attribute)).toBe(false);
  });

  test('les attributs du jeu restent, data-action compris', () => {
    const box = sanitized(
      '<p>Avant</p><button type="button" data-action="arcade-play" data-game="invasion">Jouer</button>' +
        '<a href="#slide3">Lien</a><img src="assets/images/fox.png" alt="">'
    );
    const button = box.querySelector('button');
    expect([button.dataset.action, button.dataset.game]).toEqual(['arcade-play', 'invasion']);
    expect(box.querySelector('a').getAttribute('href')).toBe('#slide3');
    expect(box.querySelector('img').getAttribute('src')).toBe('assets/images/fox.png');
  });
});
