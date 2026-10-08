/* =====================
   Plein écran des jeux d'Arcade
   - Un bouton du bandeau met toute la partie en plein écran (#game : bandeau, plateau,
     consigne, « Abandonner ») et l'en sort ; le plateau suit (watchArcadeViewport,
     js/arcade-common.js), sans que la partie change.
   - Sans l'API (iPhone, cadre sans permission), aucun bouton : arcade-common.js ne charge
     même pas ce module.
   - Le plein écran dure pendant la partie, son écran de fin et « Rejouer » ; il se quitte
     par le bouton, par Échap, ou en revenant au menu Arcade ou à un autre écran.
   ===================== */
import { getTranslation } from './i18n.js';
import { createPathIcon } from './components/icons.js';

// Tracés « maximize » et « minimize » de Feather (licence MIT, reproduite dans
// js/components/icons.js)
const ENTER_ICON =
  'M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3';
const EXIT_ICON =
  'M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3';
const BUTTON_CLASS = 'arcade-fullscreen-btn';
// Écrans qui gardent le plein écran : la partie et son écran de fin (« Rejouer » y reste)
const PLAY_SCREENS = '.arcade-game-ui, .arcade-gameover';
// Une touche Échap qui arrive juste après la sortie du plein écran a déjà servi à en sortir
const ESCAPE_GRACE_MS = 500;

let lastExitAt = Number.NEGATIVE_INFINITY;
let leaveObserver = null;
let listening = false;
// Élément que ce module met en plein écran (#game) : un autre (vidéo) ne le concerne pas
let arcadeRoot = null;
let arcadeWasFullscreen = false;

/**
 * Le navigateur peut-il mettre cet élément en plein écran ?
 * @param {Element|null} target
 * @returns {boolean}
 */
export function isFullscreenAvailable(target) {
  return Boolean(document.fullscreenEnabled) && typeof target?.requestFullscreen === 'function';
}

/** La partie d'Arcade si c'est elle qui est en plein écran, sinon null */
function fullscreenRoot() {
  const element = document.fullscreenElement;
  return element && element === arcadeRoot ? element : null;
}

/**
 * Libellé du bouton selon l'état (texte de repli si la traduction manque).
 * @param {boolean} active - Plein écran en cours
 * @returns {string}
 */
function labelFor(active) {
  const text = active
    ? getTranslation('arcade_fullscreen_exit')
    : getTranslation('arcade_fullscreen_enter');
  if (typeof text === 'string' && text && !/^\[[^\]]+\]$/.test(text)) return text;
  return active ? 'Quitter le plein écran' : 'Plein écran';
}

/**
 * Nom, info-bulle et icône du bouton : il dit ce qu'il fera (entrer ou quitter). Les clés
 * suivent les changements de langue (data-translate-aria-label, data-translate-title).
 * @param {HTMLButtonElement} button
 * @param {boolean} active
 */
function renderButton(button, active) {
  const key = active ? 'arcade_fullscreen_exit' : 'arcade_fullscreen_enter';
  const label = labelFor(active);
  button.setAttribute('aria-label', label);
  button.title = label;
  button.dataset.translateAriaLabel = key;
  button.dataset.translateTitle = key;
  button.replaceChildren(createPathIcon(active ? EXIT_ICON : ENTER_ICON, 'arcade-fullscreen-icon'));
}

function renderAllButtons() {
  const active = Boolean(fullscreenRoot());
  for (const button of document.querySelectorAll(`.${BUTTON_CLASS}`)) {
    renderButton(button, active);
  }
}

function exitFullscreen() {
  if (typeof document.exitFullscreen !== 'function') return;
  void Promise.resolve(document.exitFullscreen()).catch(error =>
    console.warn('[Arcade] Sortie du plein écran impossible', error)
  );
}

/**
 * Le plateau reprend le focus après la bascule : Espace tire de nouveau dans MultiInvaders
 * au lieu de rebasculer le plein écran.
 * @param {HTMLElement} stage
 */
function focusBoard(stage) {
  const canvas = stage.querySelector('canvas');
  if (canvas?.isConnected) canvas.focus({ preventScroll: true });
}

function toggleFullscreen(root, stage) {
  const request = fullscreenRoot()
    ? document.exitFullscreen()
    : root.requestFullscreen({ navigationUI: 'hide' });
  void Promise.resolve(request)
    .catch(error => console.warn('[Arcade] Plein écran refusé', error))
    .finally(() => focusBoard(stage));
}

/**
 * La partie ou son écran de fin est-il encore à l'écran ?
 * @param {HTMLElement} root - Élément en plein écran (#game)
 * @returns {boolean}
 */
function showsPlayScreen(root) {
  const slide = root.closest('.slide');
  if (slide && !slide.classList.contains('active-slide')) return false;
  return Boolean(root.querySelector(PLAY_SCREENS));
}

/**
 * Pendant le plein écran : retour au menu Arcade ou passage à un autre écran → sortie.
 * Sinon #game, caché avec son écran, laisserait un plein écran vide.
 * @param {HTMLElement} root
 */
function watchLeaving(root) {
  leaveObserver?.disconnect();
  leaveObserver = new MutationObserver(() => {
    if (fullscreenRoot() === root && !showsPlayScreen(root)) exitFullscreen();
  });
  leaveObserver.observe(root, { childList: true, subtree: true });
  const slide = root.closest('.slide');
  if (slide) leaveObserver.observe(slide, { attributes: true, attributeFilter: ['class'] });
}

function onFullscreenChange() {
  const root = fullscreenRoot();
  if (root) {
    arcadeWasFullscreen = true;
    watchLeaving(root);
  } else if (arcadeWasFullscreen) {
    // C'est la partie qui sort du plein écran (pas une vidéo)
    arcadeWasFullscreen = false;
    lastExitAt = Date.now();
    leaveObserver?.disconnect();
    leaveObserver = null;
  }
  renderAllButtons();
}

/**
 * Échap en plein écran (ou juste après en être sorti) sert à sortir du plein écran, et à
 * rien d'autre : sans cela, le raccourci global d'accessibility.js ramènerait à
 * « Qui joue ? ». Hors de ces deux cas, la touche garde son rôle.
 * @param {KeyboardEvent} event
 */
function onEscape(event) {
  if (event.key !== 'Escape') return;
  const root = fullscreenRoot();
  if (!root && Date.now() - lastExitAt > ESCAPE_GRACE_MS) return;
  event.preventDefault();
  if (root) exitFullscreen();
}

function listenOnce() {
  if (listening) return;
  listening = true;
  document.addEventListener('fullscreenchange', onFullscreenChange);
  // En capture : avant les raccourcis de la page
  document.addEventListener('keydown', onEscape, true);
}

/**
 * Pose le bouton plein écran dans le bandeau de la partie, une seule fois par partie.
 * @param {HTMLElement} stage - Zone de jeu (.arcade-game-ui) de la partie
 * @returns {HTMLButtonElement|null} Le bouton, ou null (pas d'API, pas de bandeau)
 */
export function mountArcadeFullscreenButton(stage) {
  const root = stage instanceof Element ? stage.closest('#game') : null;
  const banner = root?.querySelector('.arcade-mult-display');
  if (!banner || !isFullscreenAvailable(root)) return null;
  const existing = banner.querySelector(`.${BUTTON_CLASS}`);
  if (existing) return existing;

  arcadeRoot = root;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `btn btn-secondary ${BUTTON_CLASS}`;
  renderButton(button, Boolean(fullscreenRoot()));
  button.addEventListener('click', () => toggleFullscreen(root, stage));
  banner.append(button);
  listenOnce();
  return button;
}
