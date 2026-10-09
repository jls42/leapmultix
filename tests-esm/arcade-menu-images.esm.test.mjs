/* eslint-env jest, node */
/**
 * Images du menu de l'Arcade : les logos des jeux et les fusées à choisir viennent en WebP,
 * à la taille où ils s'affichent × la densité de l'écran (srcset, sizes), jamais en PNG de
 * 1,9 Mo ; sans variantes générées (développement, CI), le PNG d'origine prend le relais.
 * Avant : 4 logos PNG de 1024 px (14,6 Mo à l'ouverture du menu, chacun chargé deux fois)
 * pour 144 pixels affichés, fusées en PNG de 128 ou 256 px.
 */
import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { existsSync } from 'node:fs';

// GameMode réduit à l'essentiel : le menu seul est testé ici
jest.unstable_mockModule('../js/core/GameMode.js', () => ({
  GameMode: class {
    constructor(modeName) {
      this.modeName = modeName;
      this.state = { isActive: true };
    }
  },
}));
jest.unstable_mockModule('../js/utils-es6.js', () => ({ getTranslation: k => k }));
jest.unstable_mockModule('../js/arcade-message.js', () => ({ showArcadeMessage: jest.fn() }));
jest.unstable_mockModule('../js/game.js', () => ({ gameState: { avatar: 'fox' } }));

const { ArcadeMode } = await import('../js/modes/ArcadeMode.js');
const { attachImageFallbacks } = await import('../js/webp-images.js');

const GENERATED = 'assets/generated-images/arcade/';
let mode;
let screen;

/** Candidats d'un srcset, dans l'ordre */
const candidates = img =>
  img
    .getAttribute('srcset')
    .trim()
    .split(/\s*,\s*/);

beforeEach(async () => {
  document.body.replaceChildren();
  screen = document.createElement('div');
  screen.id = 'game';
  document.body.appendChild(screen);
  mode = new ArcadeMode();
  // Montage du gabarit produit par le mode, sans innerHTML
  const parsed = new DOMParser().parseFromString(await mode.getCustomHTML(), 'text/html');
  screen.append(...parsed.body.childNodes);
  mode.gameScreen = screen;
});

describe('Menu de l’Arcade : images à la taille affichée', () => {
  test('logos des jeux : WebP 128, 256 et 512 pour 144 px affichés (120 sur téléphone)', () => {
    const logos = [...screen.querySelectorAll('img.arcade-logo')];
    expect(logos).toHaveLength(4);
    for (const logo of logos) {
      const name = /logo_multi[a-z]+(?=-256\.webp$)/.exec(logo.getAttribute('src'))?.[0];
      expect(logo.getAttribute('src')).toBe(`${GENERATED}${name}-256.webp`);
      expect(candidates(logo)).toEqual([
        `${GENERATED}${name}-128.webp 128w`,
        `${GENERATED}${name}-256.webp 256w`,
        `${GENERATED}${name}-512.webp 512w`,
      ]);
      expect(logo.getAttribute('sizes')).toBe('(max-width: 480px) 120px, 144px');
      expect(logo.dataset.fallback).toBe(`assets/images/arcade/${name}.png`);
      expect(existsSync(logo.dataset.fallback)).toBe(true);
    }
  });

  test('fusées à choisir : la source haute définition de chaque choix, 70 px affichés', () => {
    const thumbs = [...screen.querySelectorAll('img.spaceship-thumb')];
    expect(thumbs).toHaveLength(2);
    const [lotus, comete] = thumbs;
    expect(candidates(lotus)).toEqual([
      `${GENERATED}renard_vaisseau_2-128.webp 128w`,
      `${GENERATED}renard_vaisseau_2-256.webp 256w`,
    ]);
    expect(candidates(comete)).toEqual([
      `${GENERATED}renard_vaisseau-128.webp 128w`,
      `${GENERATED}renard_vaisseau-256.webp 256w`,
    ]);
    for (const thumb of thumbs) {
      expect(thumb.getAttribute('sizes')).toBe('70px');
      expect(existsSync(thumb.dataset.fallback)).toBe(true);
    }
    expect(lotus.dataset.fallback).toBe('assets/images/arcade/renard_vaisseau_2_256x256.png');
  });

  test('aucun PNG d’origine chargé par le menu tant que les variantes existent', () => {
    const images = [...screen.querySelectorAll('img.arcade-logo, img.spaceship-thumb')];
    for (const img of images) {
      expect(`${img.getAttribute('src')} ${img.getAttribute('srcset')}`).not.toMatch(/\.png/);
    }
  });

  test('variantes absentes (développement, CI) : le PNG d’origine prend le relais', () => {
    // Ce que fait le menu une fois affiché (initializeUI)
    attachImageFallbacks(screen);
    const logo = screen.querySelector('img.arcade-logo');
    logo.dispatchEvent(new Event('error'));
    expect(logo.hasAttribute('srcset')).toBe(false);
    expect(logo.getAttribute('src')).toBe(logo.dataset.fallback);
    // Le PNG en échec à son tour ne relance rien (pas de boucle)
    logo.setAttribute('src', 'autre.png');
    logo.dispatchEvent(new Event('error'));
    expect(logo.getAttribute('src')).toBe('autre.png');
  });
});
