/* eslint-env jest, node */
/**
 * Cadeaux de l'Aventure en WebP, à la taille où ils s'affichent × la densité de l'écran : le
 * cadeau fermé de la scène (72 px, 56 sur téléphone), le cadeau qui s'ouvre quand le niveau
 * est réussi, puis le trésor de l'écran de fin (112 px, 336 pixels à la densité 3). Sans
 * variantes (développement, CI), le PNG du dépôt prend le relais.
 * Avant : les PNG de 1024 px (1,5 et 1,6 Mo) pour ces 72 et 112 px.
 */
import { describe, test, expect, beforeAll, beforeEach, afterEach, jest } from '@jest/globals';
import { existsSync } from 'node:fs';

const userStore = { preferredOperator: '×', progressHistory: [], adventureProgressByOperator: {} };
jest.unstable_mockModule('../../js/core/userState.js', () => ({
  UserState: {
    getCurrentUserData: () => userStore,
    updateUserData: u => Object.assign(userStore, u),
  },
}));
jest.unstable_mockModule('../../js/slides.js', () => ({
  goToSlide: jest.fn(),
  showSlide: jest.fn(),
  hideAllSlides: jest.fn(),
  nextSlide: jest.fn(),
  prevSlide: jest.fn(),
}));
jest.unstable_mockModule('../../js/badges.js', () => ({
  badges: {},
  getAllBadges: () => [],
  checkAndUnlockBadge: jest.fn(),
}));

const store = await import('../../js/i18n-store.js');
const { AudioManager } = await import('../../js/core/audio.js');
const { AdventureMode } = await import('../../js/modes/AdventureMode.js');

const GENERATED = 'assets/generated-images/arcade/';
const SCENE_SIZES = '(max-width: 480px) 56px, 72px';

/** Candidats d'un srcset, dans l'ordre */
const candidates = img =>
  img
    .getAttribute('srcset')
    .trim()
    .split(/\s*,\s*/);

const sceneGift = () => document.querySelector('#adventure-treasure img');

async function startFirstLevel() {
  const adventure = new AdventureMode();
  await adventure.start();
  await adventure.startLevel(1);
  return adventure;
}

beforeAll(() => {
  store.setTranslations({ level_completed: 'Niveau terminé' });
  store.setCurrentLanguage('fr');
});

beforeEach(() => {
  jest.useFakeTimers();
  // L'écran de jeu, monté sans innerHTML
  const slide = document.createElement('section');
  slide.id = 'slide4';
  slide.className = 'slide';
  const game = document.createElement('div');
  game.id = 'game';
  slide.append(game);
  const results = document.createElement('div');
  results.id = 'results';
  document.body.replaceChildren(slide, results);
  userStore.adventureProgressByOperator = {};
  userStore.progressHistory = [];
  // jsdom n'implémente pas le défilement de la fenêtre
  globalThis.scrollTo = jest.fn();
  jest.spyOn(AudioManager, 'playSound').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
  document.body.replaceChildren();
});

describe('Cadeaux de l’Aventure à la taille affichée', () => {
  test('scène : le cadeau fermé en WebP 128 et 256 pour 72 px (56 sur téléphone)', async () => {
    const adventure = await startFirstLevel();
    const gift = sceneGift();
    expect(gift.getAttribute('src')).toBe(`${GENERATED}cadeau_ferme-128.webp`);
    expect(candidates(gift)).toEqual([
      `${GENERATED}cadeau_ferme-128.webp 128w`,
      `${GENERATED}cadeau_ferme-256.webp 256w`,
    ]);
    expect(gift.getAttribute('sizes')).toBe(SCENE_SIZES);
    expect(gift.dataset.fallback).toBe('assets/images/arcade/cadeau_ferme.png');
    expect(existsSync(gift.dataset.fallback)).toBe(true);
    adventure.stop();
  });

  test('niveau réussi : le cadeau de la scène s’ouvre, srcset compris', async () => {
    const adventure = await startFirstLevel();
    adventure.completeLevel();
    const gift = sceneGift();
    // Changer le seul src n'y suffirait pas : le navigateur garde la variante du srcset
    expect(candidates(gift)).toEqual([
      `${GENERATED}cadeau_ouvert-128.webp 128w`,
      `${GENERATED}cadeau_ouvert-256.webp 256w`,
    ]);
    expect(gift.getAttribute('src')).toBe(`${GENERATED}cadeau_ouvert-128.webp`);
    expect(gift.getAttribute('sizes')).toBe(SCENE_SIZES);
    expect(gift.dataset.fallback).toBe('assets/images/arcade/cadeau_ouvert.png');
    adventure.stop();
  });

  test('écran de fin : le trésor en WebP 128, 256 et 512 pour 112 px', () => {
    const adventure = new AdventureMode();
    adventure.gameScreen = document.getElementById('game');
    adventure.currentLevel = adventure.adventureLevels.at(0);
    adventure.state.correctAnswers = 9;
    adventure.state.questionCount = 10;
    adventure.showLevelResults(true, 2);
    const treasure = document.querySelector('.adventure-results img.results-treasure');
    expect(treasure.getAttribute('src')).toBe(`${GENERATED}cadeau_ouvert-256.webp`);
    expect(candidates(treasure)).toEqual([
      `${GENERATED}cadeau_ouvert-128.webp 128w`,
      `${GENERATED}cadeau_ouvert-256.webp 256w`,
      `${GENERATED}cadeau_ouvert-512.webp 512w`,
    ]);
    expect(treasure.getAttribute('sizes')).toBe('112px');
    expect(treasure.dataset.fallback).toBe('assets/images/arcade/cadeau_ouvert.png');
    expect(treasure.getAttribute('alt')).toBe('');
  });

  test('variantes absentes (développement, CI) : chaque cadeau passe à son PNG', async () => {
    const adventure = await startFirstLevel();
    const closed = sceneGift();
    expect(closed.getAttribute('src')).toMatch(/\.webp$/);
    closed.dispatchEvent(new Event('error'));
    expect(closed.hasAttribute('srcset')).toBe(false);
    expect(closed.getAttribute('src')).toBe('assets/images/arcade/cadeau_ferme.png');

    adventure.completeLevel();
    const opened = sceneGift();
    expect(opened.getAttribute('src')).toMatch(/\.webp$/);
    opened.dispatchEvent(new Event('error'));
    expect(opened.hasAttribute('srcset')).toBe(false);
    expect(opened.getAttribute('src')).toBe('assets/images/arcade/cadeau_ouvert.png');

    // Écran de fin, une fois le personnage arrivé
    await jest.advanceTimersByTimeAsync(3000);
    const treasure = document.querySelector('img.results-treasure');
    expect(treasure.getAttribute('src')).toMatch(/\.webp$/);
    treasure.dispatchEvent(new Event('error'));
    expect(treasure.hasAttribute('srcset')).toBe(false);
    expect(treasure.getAttribute('src')).toBe('assets/images/arcade/cadeau_ouvert.png');
    adventure.stop();
  });
});
