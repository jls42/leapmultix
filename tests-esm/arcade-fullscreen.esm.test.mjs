/**
 * Plein écran des jeux d'Arcade (js/arcade-fullscreen.js) : un bouton du bandeau met toute
 * la partie en plein écran et en sort, dit dans quel état il est, rend le plateau au clavier,
 * et Échap sort du plein écran sans ramener à « Qui joue ? ». Sans l'API, aucun bouton.
 */
import { describe, test, expect, beforeEach, afterEach, afterAll, jest } from '@jest/globals';

const LABELS = new Map([
  ['arcade_fullscreen_enter', 'Plein écran'],
  ['arcade_fullscreen_exit', 'Quitter le plein écran'],
]);
jest.unstable_mockModule('../js/i18n.js', () => ({
  getTranslation: key => LABELS.get(key) ?? `[${key}]`,
}));

const { mountArcadeFullscreenButton, isFullscreenAvailable } = await import(
  '../js/arcade-fullscreen.js'
);

let fullscreenElement = null;
let game;
let stage;
let canvas;

/** Écran de jeu d'Arcade tel que le crée le gabarit commun (js/components/infoBar.js) */
function renderGame() {
  document.body.replaceChildren();
  const slide = document.createElement('section');
  slide.id = 'slide4';
  slide.className = 'slide active-slide';
  game = document.createElement('div');
  game.id = 'game';
  slide.append(game);
  document.body.append(slide);
  return renderPlayScreen();
}

/** Bandeau (score, calcul, espace réservé à droite) et zone de jeu, comme une nouvelle partie */
function renderPlayScreen() {
  const banner = document.createElement('div');
  banner.className = 'arcade-mult-display';
  const top = document.createElement('div');
  top.className = 'arcade-mobile-top';
  const score = document.createElement('span');
  score.className = 'game-stat-display';
  const question = document.createElement('span');
  question.className = 'arcade-question';
  const placeholder = document.createElement('span');
  placeholder.className = 'game-stat-display arcade-placeholder';
  top.append(score, question, placeholder);
  banner.append(top);
  stage = document.createElement('div');
  stage.className = 'arcade-game-ui';
  canvas = document.createElement('canvas');
  canvas.tabIndex = 0;
  const abandon = document.createElement('button');
  abandon.textContent = 'Abandonner';
  stage.append(canvas, abandon);
  game.replaceChildren(banner, stage);
  return stage;
}

/** API plein écran telle que la fournit un navigateur qui l'accepte */
function provideFullscreenApi() {
  Object.defineProperty(document, 'fullscreenEnabled', { value: true, configurable: true });
  Object.defineProperty(document, 'fullscreenElement', {
    get: () => fullscreenElement,
    configurable: true,
  });
  game.requestFullscreen = jest.fn(async () => {
    fullscreenElement = game;
    document.dispatchEvent(new Event('fullscreenchange'));
  });
  document.exitFullscreen = jest.fn(async () => {
    fullscreenElement = null;
    document.dispatchEvent(new Event('fullscreenchange'));
  });
}

const flush = async () => {
  for (let i = 0; i < 4; i++) await Promise.resolve();
};

function pressEscape() {
  const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
  document.body.dispatchEvent(event);
  return event;
}

// Une seule horloge simulée pour tout le fichier : le délai de grâce d'Échap se mesure
// d'un test à l'autre sur un temps continu
jest.useFakeTimers();

beforeEach(() => {
  // Loin de toute sortie du plein écran d'un test précédent
  jest.advanceTimersByTime(5000);
  fullscreenElement = null;
  renderGame();
});

afterEach(() => {
  // Sortie du plein écran comme dans un navigateur : le module repart d'un état propre
  fullscreenElement = null;
  document.dispatchEvent(new Event('fullscreenchange'));
  Reflect.deleteProperty(document, 'fullscreenEnabled');
  Reflect.deleteProperty(document, 'fullscreenElement');
  Reflect.deleteProperty(document, 'exitFullscreen');
});

afterAll(() => {
  jest.useRealTimers();
});

describe('Sans API plein écran (iPhone, cadre sans permission)', () => {
  test('aucun bouton, et le bandeau reste tel quel', () => {
    expect(isFullscreenAvailable(game)).toBe(false);
    expect(mountArcadeFullscreenButton(stage)).toBeNull();
    expect(document.querySelector('.arcade-fullscreen-btn')).toBeNull();
    expect(document.querySelector('.arcade-mobile-top').children).toHaveLength(3);
  });
});

describe('Bouton plein écran', () => {
  beforeEach(provideFullscreenApi);

  test('il apparaît dans le bandeau, nommé « Plein écran », sans décentrer le calcul', () => {
    const button = mountArcadeFullscreenButton(stage);
    expect(button.closest('.arcade-mult-display')).not.toBeNull();
    expect(button.type).toBe('button');
    expect(button.getAttribute('aria-label')).toBe('Plein écran');
    expect(button.dataset.translateAriaLabel).toBe('arcade_fullscreen_enter');
    expect(button.querySelector('svg').getAttribute('aria-hidden')).toBe('true');
    // L'espace réservé à droite du calcul reste : le calcul reste centré
    expect(document.querySelector('.arcade-mobile-top .arcade-placeholder')).not.toBeNull();
  });

  test('un clic met toute la partie en plein écran ; le bouton dit alors comment en sortir', async () => {
    const button = mountArcadeFullscreenButton(stage);
    button.focus();
    button.click();
    await flush();
    expect(game.requestFullscreen).toHaveBeenCalledTimes(1);
    expect(document.fullscreenElement).toBe(game);
    expect(button.getAttribute('aria-label')).toBe('Quitter le plein écran');
    expect(button.dataset.translateAriaLabel).toBe('arcade_fullscreen_exit');
    expect(button.title).toBe('Quitter le plein écran');
    // Le plateau reprend le focus : Espace tire au lieu de rebasculer le plein écran
    expect(document.activeElement).toBe(canvas);
  });

  test('un second clic sort du plein écran', async () => {
    const button = mountArcadeFullscreenButton(stage);
    button.click();
    await flush();
    button.click();
    await flush();
    expect(document.exitFullscreen).toHaveBeenCalledTimes(1);
    expect(document.fullscreenElement).toBeNull();
    expect(button.getAttribute('aria-label')).toBe('Plein écran');
  });

  test('« Rejouer » en plein écran : un seul bouton, déjà dans le bon état', async () => {
    mountArcadeFullscreenButton(stage).click();
    await flush();
    renderPlayScreen();
    mountArcadeFullscreenButton(stage);
    mountArcadeFullscreenButton(stage);
    const buttons = document.querySelectorAll('.arcade-fullscreen-btn');
    expect(buttons).toHaveLength(1);
    expect(buttons[0].getAttribute('aria-label')).toBe('Quitter le plein écran');
  });
});

describe('Échap en plein écran', () => {
  beforeEach(provideFullscreenApi);

  test('il sort du plein écran et ne ramène pas à « Qui joue ? »', async () => {
    mountArcadeFullscreenButton(stage).click();
    await flush();
    // Raccourcis de la page (accessibility.js, confirmation de sortie) : rien ne leur arrive
    const pageShortcut = jest.fn();
    document.addEventListener('keydown', pageShortcut);
    window.addEventListener('keydown', pageShortcut);
    const event = pressEscape();
    await flush();
    document.removeEventListener('keydown', pageShortcut);
    window.removeEventListener('keydown', pageShortcut);
    expect(event.defaultPrevented).toBe(true);
    expect(pageShortcut).not.toHaveBeenCalled();
    expect(document.exitFullscreen).toHaveBeenCalledTimes(1);
    expect(document.fullscreenElement).toBeNull();
  });

  test('le navigateur a déjà quitté le plein écran : la touche reste sans effet sur la page', async () => {
    mountArcadeFullscreenButton(stage).click();
    await flush();
    // Sortie native (vrai clavier), puis la touche arrive à la page
    fullscreenElement = null;
    document.dispatchEvent(new Event('fullscreenchange'));
    jest.advanceTimersByTime(100);
    const event = pressEscape();
    expect(event.defaultPrevented).toBe(true);
    expect(document.exitFullscreen).not.toHaveBeenCalled();
  });

  test('hors plein écran, Échap garde son rôle', async () => {
    mountArcadeFullscreenButton(stage).click();
    await flush();
    mountArcadeFullscreenButton(stage).click();
    await flush();
    jest.advanceTimersByTime(1000);
    expect(pressEscape().defaultPrevented).toBe(false);
  });
});

describe('Un autre élément en plein écran (vidéo)', () => {
  beforeEach(provideFullscreenApi);

  test('il ne touche ni à son plein écran, ni à Échap, ni au bouton', async () => {
    const button = mountArcadeFullscreenButton(stage);
    const video = document.createElement('video');
    document.body.append(video);
    fullscreenElement = video;
    document.dispatchEvent(new Event('fullscreenchange'));
    // Une mutation de la page ne le fait pas sortir du plein écran
    game.replaceChildren(document.createElement('div'));
    await flush();
    expect(document.exitFullscreen).not.toHaveBeenCalled();
    expect(pressEscape().defaultPrevented).toBe(false);
    expect(button.getAttribute('aria-label')).toBe('Plein écran');
    // Sa sortie n'ouvre pas de délai de grâce pour Échap
    fullscreenElement = null;
    document.dispatchEvent(new Event('fullscreenchange'));
    expect(pressEscape().defaultPrevented).toBe(false);
  });
});

describe('Fin du plein écran en quittant la partie', () => {
  beforeEach(provideFullscreenApi);

  test('l’écran de fin garde le plein écran', async () => {
    mountArcadeFullscreenButton(stage).click();
    await flush();
    const end = document.createElement('div');
    end.className = 'arcade-gameover content-card';
    game.replaceChildren(end);
    await flush();
    expect(document.exitFullscreen).not.toHaveBeenCalled();
  });

  test('le menu Arcade sort du plein écran', async () => {
    mountArcadeFullscreenButton(stage).click();
    await flush();
    const menu = document.createElement('div');
    menu.className = 'content-card arcade-wide';
    game.replaceChildren(menu);
    await flush();
    expect(document.exitFullscreen).toHaveBeenCalledTimes(1);
  });

  test('un autre écran (Accueil) sort du plein écran', async () => {
    mountArcadeFullscreenButton(stage).click();
    await flush();
    document.getElementById('slide4').classList.remove('active-slide');
    await flush();
    expect(document.exitFullscreen).toHaveBeenCalledTimes(1);
  });
});
