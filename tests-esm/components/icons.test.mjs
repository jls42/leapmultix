import { describe, test, expect } from '@jest/globals';
import { createIcon, setIcon, ICON_NAMES } from '../../js/components/icons.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

describe('icons (SVG en ligne, style Lucide)', () => {
  test('crée une icône décorative de 24 px au trait de 2 px', () => {
    const icon = createIcon('house');
    expect(icon).toBeTruthy();
    expect(icon.namespaceURI).toBe(SVG_NS);
    expect(icon.getAttribute('width')).toBe('24');
    expect(icon.getAttribute('height')).toBe('24');
    expect(icon.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(icon.getAttribute('stroke')).toBe('currentColor');
    expect(icon.getAttribute('stroke-width')).toBe('2');
    expect(icon.getAttribute('fill')).toBe('none');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.getAttribute('focusable')).toBe('false');
    expect(icon.getAttribute('class')).toBe('icon icon-house');
    expect(icon.getAttribute('data-icon')).toBe('house');
    expect(icon.querySelectorAll('path').length).toBe(2);
  });

  test('chaque icône déclarée produit au moins un tracé', () => {
    expect(ICON_NAMES).toEqual(
      expect.arrayContaining(['house', 'info', 'settings', 'volume-2', 'volume-x', 'speech'])
    );
    for (const name of ICON_NAMES) {
      const icon = createIcon(name);
      expect(icon?.childElementCount).toBeGreaterThan(0);
      for (const child of icon.children) expect(child.namespaceURI).toBe(SVG_NS);
    }
  });

  test('accepte une taille et des classes supplémentaires', () => {
    const icon = createIcon('star', { size: 20, className: 'star-icon is-filled' });
    expect(icon.getAttribute('width')).toBe('20');
    expect(icon.getAttribute('class')).toBe('icon icon-star star-icon is-filled');
  });

  test('renvoie null pour un nom inconnu', () => {
    expect(createIcon('licorne-volante')).toBeNull();
    expect(createIcon('constructor')).toBeNull();
  });

  test('setIcon place, remplace, et ne touche à rien si l’icône est déjà la bonne', () => {
    const button = document.createElement('button');
    button.appendChild(document.createElement('span'));

    const first = setIcon(button, 'volume-2');
    expect(button.firstElementChild).toBe(first);

    expect(setIcon(button, 'volume-2')).toBe(first);
    expect(button.querySelectorAll('svg').length).toBe(1);

    const second = setIcon(button, 'volume-x');
    expect(second).not.toBe(first);
    expect(button.querySelectorAll('svg').length).toBe(1);
    expect(button.firstElementChild.getAttribute('data-icon')).toBe('volume-x');
  });
});
