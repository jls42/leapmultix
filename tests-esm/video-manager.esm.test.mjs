/* eslint-env jest, node */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';

// « Passer » est traduit ; « close_video » manque encore (repli attendu)
jest.unstable_mockModule('../js/utils-es6.js', () => ({
  getTranslation: k => (k === 'skip_video' ? 'Passer' : `[${k}]`),
}));

const { VideoManager } = await import('../js/VideoManager.js');

function freshModal() {
  document.body.innerHTML =
    '<main id="page"><button id="opener">Créer</button></main><div id="announce" aria-live="polite"></div>';
  VideoManager._modal = null;
  VideoManager._inertTargets = [];
  VideoManager._autoplay = true;
  VideoManager.createVideoModal();
  // jsdom ne sait pas lire de vidéo : on neutralise ce qui n'est pas testé ici
  VideoManager._currentVideo.pause = jest.fn();
  VideoManager._currentVideo.load = jest.fn();
  VideoManager._currentVideo.play = jest.fn(() => Promise.resolve());
}

// Écouteurs de la fenêtre recréée pour chaque test (celui du clavier n'est posé qu'une fois)
function withListeners() {
  VideoManager.setupEventListeners();
}

function setReducedMotion(reduce) {
  globalThis.matchMedia = query => ({
    matches: reduce && query.includes('prefers-reduced-motion'),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  });
}

beforeEach(() => {
  jest.useFakeTimers();
  freshModal();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('Modale vidéo de l’avatar', () => {
  test('le panneau est une fenêtre de dialogue titrée par la phrase du personnage', () => {
    const dialog = document.querySelector('.video-container');
    expect(dialog.getAttribute('role')).toBe('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-labelledby')).toBe('video-welcome-message');
    expect(document.querySelector('.video-header #video-welcome-message')).toBeTruthy();
  });

  test('« Fermer » a un nom accessible, même sans traduction', () => {
    const close = document.getElementById('video-close-btn');
    expect(close.getAttribute('aria-label')).toBe('Fermer la vidéo');
    expect(close.getAttribute('data-translate-aria-label')).toBe('close_video');
    expect(close.querySelector('svg[aria-hidden="true"]')).toBeTruthy();
  });

  test('« Passer » est la touche secondaire commune, sans émoji', () => {
    const skip = document.getElementById('skip-intro-btn');
    expect(skip.className).toBe('btn btn-secondary skip-btn');
    expect(skip.textContent).toBe('Passer');
    expect(skip.type).toBe('button');
  });

  test('la progression avance par transformation, pas par largeur', () => {
    Object.defineProperty(VideoManager._currentVideo, 'duration', {
      value: 5,
      configurable: true,
    });
    VideoManager._currentVideo.currentTime = 2.5;
    VideoManager.updateProgress();
    const bar = document.getElementById('video-progress-bar');
    expect(bar.style.transform).toBe('scaleX(0.5)');
    expect(bar.style.width).toBe('');
    expect(bar.parentElement.getAttribute('aria-hidden')).toBe('true');
  });

  test('Échap ferme la vidéo sans déclencher les raccourcis globaux de la page', () => {
    withListeners();
    const globalShortcut = jest.fn();
    document.addEventListener('keydown', globalShortcut);
    const done = jest.fn();
    VideoManager._skipCallback = done;
    VideoManager.showModal();

    document
      .getElementById('skip-intro-btn')
      .dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
      );
    expect(done).toHaveBeenCalledTimes(1);
    expect(globalShortcut).not.toHaveBeenCalled();

    // Modale fermée : Échap reprend son rôle habituel
    jest.advanceTimersByTime(200);
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(globalShortcut).toHaveBeenCalledTimes(1);
    document.removeEventListener('keydown', globalShortcut);
  });

  test('ouverture et fermeture par classes, focus sur « Passer » puis rendu', () => {
    const opener = document.getElementById('opener');
    opener.focus();
    VideoManager.showModal();
    const modal = document.getElementById('character-intro-modal');
    expect(modal.style.display).toBe('flex');
    expect(modal.classList.contains('is-open')).toBe(true);
    expect(document.activeElement.id).toBe('skip-intro-btn');

    VideoManager.hideModal();
    expect(modal.classList.contains('is-open')).toBe(false);
    expect(modal.classList.contains('is-closing')).toBe(true);
    jest.advanceTimersByTime(200);
    expect(modal.style.display).toBe('none');
    expect(modal.classList.contains('is-closing')).toBe(false);
    expect(document.activeElement).toBe(opener);
  });

  test('double-clic sur « Créer » : le second clic, sur le voile, ne ferme pas la vidéo', () => {
    withListeners();
    const done = jest.fn();
    VideoManager._skipCallback = done;
    VideoManager.showModal();
    const overlay = document.querySelector('.video-modal-overlay');

    // Second clic d'un double-clic (detail = 2), juste après l'ouverture
    overlay.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 2 }));
    // Un appui isolé dans l'instant qui suit l'ouverture (double appui au doigt)
    overlay.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    expect(done).not.toHaveBeenCalled();
    expect(document.getElementById('character-intro-modal').classList.contains('is-open')).toBe(
      true
    );

    // Plus tard, un vrai clic sur le voile ferme la vidéo, une seule fois
    jest.advanceTimersByTime(700);
    overlay.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    expect(done).toHaveBeenCalledTimes(1);
  });

  test('« Passer » activé dans l’instant de l’ouverture (touche restée enfoncée) est ignoré', () => {
    withListeners();
    const done = jest.fn();
    VideoManager._skipCallback = done;
    VideoManager.showModal();
    document.getElementById('skip-intro-btn').click();
    expect(done).not.toHaveBeenCalled();
    jest.advanceTimersByTime(700);
    document.getElementById('skip-intro-btn').click();
    expect(done).toHaveBeenCalledTimes(1);
  });

  test('Tab et Maj+Tab restent dans la fenêtre, la page derrière est inerte', () => {
    withListeners();
    VideoManager.showModal();
    const close = document.getElementById('video-close-btn');
    const skip = document.getElementById('skip-intro-btn');
    expect(document.activeElement).toBe(skip);

    skip.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
    );
    expect(document.activeElement).toBe(close);
    close.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true })
    );
    expect(document.activeElement).toBe(skip);

    // Le reste de la page ne reçoit plus ni focus ni clic ; les annonces restent actives
    expect(document.getElementById('page').hasAttribute('inert')).toBe(true);
    expect(document.getElementById('announce').hasAttribute('inert')).toBe(false);
    expect(document.getElementById('character-intro-modal').hasAttribute('inert')).toBe(false);

    VideoManager.hideModal();
    expect(document.getElementById('page').hasAttribute('inert')).toBe(false);
  });

  test('moins d’animations demandé : à la création du profil, la vidéo attend « Voir la vidéo »', () => {
    withListeners();
    setReducedMotion(true);
    const done = jest.fn();
    VideoManager.playCharacterIntro('fox', done);
    const play = document.getElementById('play-intro-btn');
    expect(play.hidden).toBe(false);
    expect(document.activeElement).toBe(play);
    expect(document.querySelector('.video-controls').classList.contains('is-waiting')).toBe(true);
    jest.advanceTimersByTime(5000);
    expect(VideoManager._currentVideo.play).not.toHaveBeenCalled();

    // L'enfant lance la lecture : elle démarre, le clavier passe sur « Passer »
    play.click();
    expect(play.hidden).toBe(true);
    expect(document.activeElement.id).toBe('skip-intro-btn');
    VideoManager._currentVideo.dispatchEvent(new Event('canplay'));
    jest.advanceTimersByTime(50);
    expect(VideoManager._currentVideo.play).toHaveBeenCalled();
    setReducedMotion(false);
  });

  test('« Revoir ma vidéo » (demande explicite) démarre tout de suite, même avec moins d’animations', () => {
    withListeners();
    setReducedMotion(true);
    VideoManager.replayCharacterIntro('fox');
    expect(document.getElementById('play-intro-btn').hidden).toBe(true);
    VideoManager._currentVideo.dispatchEvent(new Event('canplay'));
    jest.advanceTimersByTime(50);
    expect(VideoManager._currentVideo.play).toHaveBeenCalled();
    setReducedMotion(false);
  });
});
