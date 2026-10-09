/* eslint-env jest, node */
/**
 * Logos du tableau de bord en WebP, à la taille où ils s'affichent (56 px,
 * css/progress-dashboard.css) × la densité de l'écran : 128 jusqu'à la densité 2, 256 à la
 * densité 3 (ou le 512 déjà chargé par l'accueil). Sans variantes (développement, CI), le
 * PNG du dépôt prend le relais.
 * Avant : les PNG de 1024 px, 1,5 à 2,3 Mo chacun, 17,5 Mo pour les 9 rangées.
 */
import { describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import { existsSync } from 'node:fs';
import { Dashboard } from '../../js/components/dashboard.js';

const GENERATED = 'assets/generated-images/arcade/';
// Modes classiques puis jeux d'Arcade, dans l'ordre des rangées
const LOGOS = [
  'logo_mode_quizz',
  'logo_mode_defi',
  'logo_mode_aventure',
  'logo_mode_chrono',
  'logo_mode_decouverte',
  'logo_multiinvaders',
  'logo_multimiam',
  'logo_multimemory',
  'logo_multisnake',
];

/** Candidats d'un srcset, dans l'ordre */
const candidates = img =>
  img
    .getAttribute('srcset')
    .trim()
    .split(/\s*,\s*/);

beforeEach(() => {
  // Le conteneur du tableau de bord, monté sans innerHTML
  const container = document.createElement('div');
  container.className = 'dashboard-container content-card';
  const achievements = document.createElement('div');
  achievements.className = 'achievements-section';
  const list = document.createElement('div');
  list.id = 'achievements-list';
  achievements.append(list);
  container.append(achievements);
  document.body.replaceChildren(container);
  Dashboard.generateScoresSection();
});

afterEach(() => {
  localStorage.clear();
  document.body.replaceChildren();
});

describe('Tableau de bord : logos à la taille affichée', () => {
  test('les 9 rangées : WebP 128 à 512 pour 56 px affichés, PNG du dépôt en repli', () => {
    const logos = [...document.querySelectorAll('img.score-logo')];
    expect(logos).toHaveLength(LOGOS.length);
    for (const [index, img] of logos.entries()) {
      const name = LOGOS.at(index);
      expect(img.getAttribute('src')).toBe(`${GENERATED}${name}-128.webp`);
      // 512 : déjà chargé par l'accueil ou le menu sur un téléphone, le navigateur le reprend
      expect(candidates(img)).toEqual([
        `${GENERATED}${name}-128.webp 128w`,
        `${GENERATED}${name}-256.webp 256w`,
        `${GENERATED}${name}-512.webp 512w`,
      ]);
      expect(img.getAttribute('sizes')).toBe('56px');
      expect(img.dataset.fallback).toBe(`assets/images/arcade/${name}.png`);
      expect(existsSync(img.dataset.fallback)).toBe(true);
      // Toujours chargés à l'approche, et décoratifs : le nom du mode est écrit à côté
      expect(img.getAttribute('loading')).toBe('lazy');
      expect(img.getAttribute('alt')).toBe('');
    }
  });

  test('variantes absentes (développement, CI) : le logo passe à son PNG, une seule fois', () => {
    const logo = document.querySelector('img.score-logo');
    expect(logo.getAttribute('src')).toMatch(/\.webp$/);
    logo.dispatchEvent(new Event('error'));
    expect(logo.hasAttribute('srcset')).toBe(false);
    expect(logo.getAttribute('src')).toBe('assets/images/arcade/logo_mode_quizz.png');
    // Le PNG en échec à son tour ne relance rien
    logo.setAttribute('src', 'autre.png');
    logo.dispatchEvent(new Event('error'));
    expect(logo.getAttribute('src')).toBe('autre.png');
  });
});
