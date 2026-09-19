/* eslint-env jest, node */
import { describe, test, expect, beforeEach, jest } from '@jest/globals';

// GameMode réduit à l'essentiel : le menu seul est testé ici
jest.unstable_mockModule('../js/core/GameMode.js', () => ({
  GameMode: class {
    constructor(modeName) {
      this.modeName = modeName;
      this.state = { isActive: true };
    }
  },
}));
// Les lignes « Commandes » gardent un ancien émoji en tête, comme les traductions actuelles
jest.unstable_mockModule('../js/utils-es6.js', () => ({
  getTranslation: k =>
    k.startsWith('arcade.controls.') && k !== 'arcade.controls.title'
      ? `🕹️ Texte ${k.split('.').pop()}`
      : k,
}));
jest.unstable_mockModule('../js/arcade-message.js', () => ({ showArcadeMessage: jest.fn() }));
jest.unstable_mockModule('../js/game.js', () => ({ gameState: { avatar: 'fox' } }));

const { ArcadeMode } = await import('../js/modes/ArcadeMode.js');

let mode;
let screen;

beforeEach(async () => {
  document.body.innerHTML = '<div id="game"></div>';
  screen = document.getElementById('game');
  mode = new ArcadeMode();
  const template = document.createElement('template');
  template.innerHTML = await mode.getCustomHTML();
  screen.appendChild(template.content);
  mode.gameScreen = screen;
});

describe('Menu Arcade', () => {
  test('pas de second titre à émoji ni de région principale imbriquée', () => {
    expect(screen.querySelector('[role="main"]')).toBeNull();
    expect(screen.textContent).not.toContain('🕹️');
    expect(screen.querySelector('.arcade-intro').tagName).toBe('P');
  });

  test('chaque tuile regroupe ses réglages et un « Jouer » sur la touche commune', () => {
    const cards = screen.querySelectorAll('.arcade-game-card');
    expect(cards).toHaveLength(4);
    cards.forEach(card => {
      const settings = card.querySelector('.arcade-game-settings');
      expect(settings).toBeTruthy();
      expect(settings.querySelector('.improved-difficulty-select')).toBeTruthy();
      const play = settings.querySelector('.play-arcade-btn');
      expect(play.classList.contains('btn')).toBe(true);
      expect(play.getAttribute('type')).toBe('button');
      // Le nom est dans le titre : le logo est décoratif
      expect(card.querySelector('img.arcade-logo').getAttribute('alt')).toBe('');
    });
  });

  test('la difficulté choisie est la même dans toutes les tuiles', () => {
    mode.setDifficulty('difficile', 'invasion');
    const selected = screen.querySelectorAll('.difficulty-btn.selected');
    expect(selected).toHaveLength(4);
    selected.forEach(btn => {
      expect(btn.dataset.difficulty).toBe('difficile');
      expect(btn.getAttribute('aria-pressed')).toBe('true');
    });
    screen.querySelectorAll('.difficulty-btn:not(.selected)').forEach(btn => {
      expect(btn.getAttribute('aria-pressed')).toBe('false');
    });
  });

  test('le nom du jeu est un bouton qui ouvre la tuile au clavier et annonce son état', () => {
    const card = screen.querySelector('#multisnake-arcade-card');
    const toggle = card.querySelector('.game-title > button.arcade-game-toggle');
    expect(toggle.getAttribute('type')).toBe('button');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    const settings = document.getElementById(toggle.getAttribute('aria-controls'));
    expect(settings.classList.contains('arcade-game-settings')).toBe(true);

    mode.handleListClick({ target: toggle });
    expect(card.classList.contains('expanded')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    // Ouvrir une autre tuile referme la première
    const other = screen.querySelector('#multimiam-arcade-card .arcade-game-toggle');
    mode.handleListClick({ target: other });
    expect(card.classList.contains('collapsed')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(other.getAttribute('aria-expanded')).toBe('true');
  });

  test('la fusée choisie reste cochée au retour dans le menu, avec un nom accessible simple', async () => {
    const [, comete] = mode.getSpaceshipVariants('fox');
    mode.selectedSpaceship = `${comete.file}|${comete.fallback}`;
    screen.innerHTML = '';
    const template = document.createElement('template');
    template.innerHTML = await mode.getCustomHTML();
    screen.appendChild(template.content);
    const radios = [...screen.querySelectorAll('input[name="spaceship-choice-invasion"]')];
    expect(radios.map(r => r.checked)).toEqual([false, true]);
    // L'image est décorative : le libellé écrit suffit (plus de « Fusée Lotus Fusée Lotus »)
    screen.querySelectorAll('.spaceship-thumb').forEach(img => {
      expect(img.getAttribute('alt')).toBe('');
    });
  });

  test('sans choix enregistré (ou choix d’un autre avatar), la première fusée est cochée', () => {
    const radios = [...screen.querySelectorAll('input[name="spaceship-choice-invasion"]')];
    expect(radios[0].checked).toBe(true);
  });

  test('« Commandes » : icônes dessinées au lieu d’émojis, une ligne par type de commande', () => {
    const items = [...screen.querySelectorAll('#multiplication-invasion-card .arcade-control')];
    expect(items.map(li => li.dataset.input)).toEqual(['keyboard', 'mouse', 'touch']);
    items.forEach(li => {
      expect(li.textContent).not.toMatch(/\p{Extended_Pictographic}/u);
      const icon = li.querySelector('svg.arcade-control-icon');
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    });
    expect(items[0].textContent.trim()).toBe('Texte keyboard');
    const snake = [...screen.querySelectorAll('#multisnake-arcade-card .arcade-control')];
    expect(snake.map(li => li.dataset.input)).toEqual(['keyboard', 'touch']);
  });

  test('un clic dans les réglages ne referme pas la tuile, un clic sur le titre oui', () => {
    const card = screen.querySelector('#multimiam-arcade-card');
    mode.toggleCard(card);
    expect(card.classList.contains('expanded')).toBe(true);

    const label = card.querySelector('.difficulty-label');
    mode.handleListClick({ target: label });
    expect(card.classList.contains('expanded')).toBe(true);

    mode.handleListClick({ target: card.querySelector('.game-title') });
    expect(card.classList.contains('collapsed')).toBe(true);
  });
});
