/* eslint-env jest, node */
/**
 * Illustrations en WebP (js/webp-images.js), commune au menu de l'Arcade, au tableau de bord
 * et à l'Aventure : srcset et sizes posés avant src (le premier choix du navigateur les
 * voit), PNG du dépôt en repli quand les variantes manquent, une seule fois, et tout de suite
 * pour une image déjà en échec.
 */
import { describe, test, expect, beforeEach } from '@jest/globals';

const { webpImage, webpImageAttributes, createWebpImage, attachImageFallbacks } = await import(
  '../js/webp-images.js'
);

const GIFT = { widths: [128, 256, 512], src: 256, sizes: '112px' };

beforeEach(() => {
  document.body.replaceChildren();
});

/** Image dont le chargement a déjà échoué (jsdom ne charge rien) */
function brokenImage(img) {
  Object.defineProperty(img, 'complete', { value: true });
  Object.defineProperty(img, 'naturalWidth', { value: 0 });
  return img;
}

describe('attributs d’une illustration WebP', () => {
  test('variantes du PNG du dépôt, srcset et sizes avant src', () => {
    const attributes = webpImage('cadeau_ouvert.png', GIFT);
    expect(Object.keys(attributes)).toEqual(['srcset', 'sizes', 'src', 'data-fallback']);
    expect(attributes).toEqual({
      srcset:
        'assets/generated-images/arcade/cadeau_ouvert-128.webp 128w, ' +
        'assets/generated-images/arcade/cadeau_ouvert-256.webp 256w, ' +
        'assets/generated-images/arcade/cadeau_ouvert-512.webp 512w',
      sizes: '112px',
      src: 'assets/generated-images/arcade/cadeau_ouvert-256.webp',
      'data-fallback': 'assets/images/arcade/cadeau_ouvert.png',
    });
  });

  test('source des variantes distincte du repli (fusées : source haute définition)', () => {
    const attributes = webpImage(
      'renard_vaisseau_2_256x256.png',
      { widths: [128], src: 128, sizes: '70px' },
      'renard_vaisseau_2'
    );
    expect(attributes.src).toBe('assets/generated-images/arcade/renard_vaisseau_2-128.webp');
    expect(attributes['data-fallback']).toBe('assets/images/arcade/renard_vaisseau_2_256x256.png');
  });

  test('gabarit HTML : les mêmes attributs, dans le même ordre', () => {
    const parsed = new DOMParser().parseFromString(
      `<img ${webpImageAttributes('cadeau_ouvert.png', GIFT)} alt="">`,
      'text/html'
    );
    const img = parsed.querySelector('img');
    expect(img.getAttributeNames()).toEqual(['srcset', 'sizes', 'src', 'data-fallback', 'alt']);
    expect(img.dataset.fallback).toBe('assets/images/arcade/cadeau_ouvert.png');
  });

  test('élément prêt à poser : décoratif par défaut, attributs du lieu ajoutés', () => {
    const img = createWebpImage('cadeau_ouvert.png', GIFT, {
      class: 'results-treasure',
      width: '112',
    });
    expect(img.getAttributeNames().slice(0, 3)).toEqual(['srcset', 'sizes', 'src']);
    expect(img.getAttribute('alt')).toBe('');
    expect(img.className).toBe('results-treasure');
    expect(img.getAttribute('width')).toBe('112');
  });
});

describe('repli sur le PNG du dépôt', () => {
  test('variante absente : le PNG, une seule fois (un PNG en échec ne relance rien)', () => {
    const img = createWebpImage('cadeau_ouvert.png', GIFT);
    img.dispatchEvent(new Event('error'));
    expect(img.hasAttribute('srcset')).toBe(false);
    expect(img.getAttribute('src')).toBe('assets/images/arcade/cadeau_ouvert.png');
    img.setAttribute('src', 'autre.png');
    img.dispatchEvent(new Event('error'));
    expect(img.getAttribute('src')).toBe('autre.png');
  });

  test('image déjà en échec quand l’écran pose ses replis : le PNG tout de suite', () => {
    const parsed = new DOMParser().parseFromString(
      `<div><img ${webpImageAttributes('cadeau_ferme.png', GIFT)} alt=""></div>`,
      'text/html'
    );
    const screen = document.importNode(parsed.body.firstChild, true);
    document.body.append(screen);
    brokenImage(screen.querySelector('img'));
    attachImageFallbacks(screen);
    expect(screen.querySelector('img').getAttribute('src')).toBe(
      'assets/images/arcade/cadeau_ferme.png'
    );
  });

  test('image déjà passée à son PNG : aucun écouteur de plus', () => {
    const img = createWebpImage('cadeau_ferme.png', GIFT);
    img.dispatchEvent(new Event('error'));
    document.body.append(img);
    attachImageFallbacks(document.body);
    img.setAttribute('src', 'autre.png');
    img.dispatchEvent(new Event('error'));
    expect(img.getAttribute('src')).toBe('autre.png');
  });
});
