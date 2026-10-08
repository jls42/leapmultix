/* =====================
   Temps des parties d'Arcade : la pause et la partie sans limite de temps (WCAG 2.2.1)
   - Pause : un bouton à côté du temps, la touche P, et une pause automatique quand l'onglet
     est masqué. En pause, le compte à rebours (arcade.js) ne décompte plus et les jeux ne
     bougent plus : ils lisent isArcadePaused() à chaque pas. La partie ne reprend jamais
     seule : « Reprendre » ou la touche P.
   - Sans limite de temps : un choix de la tuile du jeu (MultiMemory), gardé sur l'appareil
     comme la difficulté.
   ===================== */
// Traductions lues dans le magasin seul : ce module reste léger, sans la voix ni le jeu
import { translate } from './i18n-store.js';
import { createPathIcon } from './components/icons.js';

const PAUSE_KEY = 'p';
const PAUSE_ICON = 'M7 5h3.5v14H7zM13.5 5H17v14h-3.5z';
const RESUME_ICON = 'M8 5.5v13l10.5-6.5z';
// Champs où la lettre P s'écrit : elle ne met pas le jeu en pause
const TEXT_FIELDS = 'input, textarea, select, [contenteditable="true"]';
const CANVAS_SELECTOR = '#game .arcade-game-ui > canvas';

/** Jeux qui proposent une partie sans limite de temps */
export const UNTIMED_GAMES = new Set(['multimemory']);
const NO_TIME_LIMIT_STORAGE = 'arcade.noTimeLimit.';
// Choix de la visite, même si le stockage de l'appareil est indisponible
const noTimeLimitChoices = new Map();

let paused = false;
// Bouton du bandeau, écouteurs et voile de la partie en cours
let controls = null;

/**
 * Traduction, ou texte de repli si la clé manque (getTranslation rend alors « [clé] »)
 * @param {string} key
 * @param {string} fallback
 * @returns {string}
 */
function translated(key, fallback) {
  const value = translate(key);
  return typeof value === 'string' && value && !/^\[[^\]]+\]$/.test(value) ? value : fallback;
}

/** La partie en cours est-elle en pause ? */
export function isArcadePaused() {
  return paused;
}

/**
 * Contenu d'un bouton : une icône (pause ou lecture) et son libellé, retraduit avec la page
 * @param {HTMLButtonElement} button
 * @param {{key: string, fallback: string, icon: string}} label
 */
function setButtonContent(button, { key, fallback, icon }) {
  const text = document.createElement('span');
  text.dataset.translate = key;
  text.textContent = translated(key, fallback);
  button.replaceChildren(createPathIcon(icon, 'arcade-pause-icon'), text);
}

const PAUSE_LABEL = { key: 'arcade_pause_button', fallback: 'Pause', icon: PAUSE_ICON };
const RESUME_LABEL = { key: 'arcade_resume_button', fallback: 'Reprendre', icon: RESUME_ICON };

/**
 * Bouton de pause ou de reprise (la touche P fait de même)
 * @param {string} className
 * @param {Object} label - PAUSE_LABEL ou RESUME_LABEL
 * @param {Function} onClick
 * @returns {HTMLButtonElement}
 */
function createTimeButton(className, label, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.setAttribute('aria-keyshortcuts', 'P');
  setButtonContent(button, label);
  button.addEventListener('click', onClick);
  return button;
}

/**
 * Paragraphe traduit du voile de pause
 * @param {string} className
 * @param {string} key
 * @param {string} fallback
 * @returns {HTMLParagraphElement}
 */
function createPauseText(className, key, fallback) {
  const paragraph = document.createElement('p');
  paragraph.className = className;
  paragraph.id = className;
  paragraph.dataset.translate = key;
  paragraph.textContent = translated(key, fallback);
  return paragraph;
}

/**
 * Voile posé sur le plateau pendant la pause : il le cache, dit que le temps est arrêté et
 * porte « Reprendre » au centre, à portée de doigt
 * @returns {HTMLElement}
 */
function createPauseOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'arcade-pause-overlay';
  overlay.setAttribute('role', 'group');
  overlay.setAttribute('aria-labelledby', 'arcade-pause-title');
  const title = createPauseText('arcade-pause-title', 'arcade_paused_title', 'Pause');
  const message = createPauseText(
    'arcade-pause-text',
    'arcade_paused_text',
    "Le temps est arrêté. Le jeu t'attend\u00a0!"
  );
  const resume = createTimeButton('btn arcade-resume-btn', RESUME_LABEL, resumeArcade);
  resume.setAttribute('aria-describedby', message.id);
  const hint = createPauseText(
    'arcade-pause-hint',
    'arcade_pause_key_hint',
    'Touche P\u00a0: pause ou reprise'
  );
  // Indice pour le clavier, masqué sur un écran tactile (css/arcade.css)
  hint.dataset.input = 'keyboard';
  const card = document.createElement('div');
  card.className = 'arcade-pause-card';
  card.append(title, message, resume, hint);
  overlay.appendChild(card);
  return overlay;
}

/** Le voile couvre exactement le canevas (cadre compris), pas « Abandonner » */
function placeOverlay() {
  const canvas = document.querySelector(CANVAS_SELECTOR);
  const overlay = controls?.overlay;
  if (!canvas || !overlay) return;
  Object.assign(overlay.style, {
    left: `${canvas.offsetLeft}px`,
    top: `${canvas.offsetTop}px`,
    width: `${canvas.offsetWidth}px`,
    height: `${canvas.offsetHeight}px`,
  });
}

/**
 * Focus posé sans faire défiler la page
 * @param {HTMLElement|null} element
 */
function focusWithoutScroll(element) {
  try {
    element?.focus({ preventScroll: true });
  } catch {
    element?.focus();
  }
}

/** En pause : le bouton dit « Reprendre », le voile couvre le plateau et prend le focus */
function showPaused() {
  setButtonContent(controls.button, RESUME_LABEL);
  const stage = document.querySelector(CANVAS_SELECTOR)?.parentElement;
  if (!stage) return;
  controls.overlay = createPauseOverlay();
  stage.appendChild(controls.overlay);
  placeOverlay();
  globalThis.addEventListener?.('resize', placeOverlay);
  focusWithoutScroll(controls.overlay.querySelector('.arcade-resume-btn'));
}

/** Voile retiré (reprise ou fin de partie) */
function removeOverlay() {
  globalThis.removeEventListener?.('resize', placeOverlay);
  controls?.overlay?.remove();
  if (controls) controls.overlay = null;
}

/** Reprise : le bouton redit « Pause », le plateau retrouve le focus pour jouer au clavier */
function showRunning() {
  setButtonContent(controls.button, PAUSE_LABEL);
  removeOverlay();
  focusWithoutScroll(document.querySelector(CANVAS_SELECTOR));
}

/** Met la partie en pause (sans effet hors d'une partie chronométrée) */
export function pauseArcade() {
  if (!controls || paused) return;
  paused = true;
  showPaused();
}

/** Reprend la partie */
export function resumeArcade() {
  if (!controls || !paused) return;
  paused = false;
  showRunning();
}

/** Pause, ou reprise si la partie est en pause */
export function toggleArcadePause() {
  if (paused) resumeArcade();
  else pauseArcade();
}

/**
 * La touche P, seule (Ctrl+P imprime), hors d'un champ de texte
 * @param {KeyboardEvent} event
 * @returns {boolean}
 */
function isPauseKey(event) {
  if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return false;
  if (String(event.key).toLowerCase() !== PAUSE_KEY) return false;
  return !event.target?.closest?.(TEXT_FIELDS);
}

function onPauseKey(event) {
  if (!isPauseKey(event)) return;
  event.preventDefault();
  toggleArcadePause();
}

// Onglet masqué (autre application, tablette mise en veille) : la partie s'arrête et attend
function onVisibilityChange() {
  if (document.hidden) pauseArcade();
}

/**
 * Pause d'une partie chronométrée : bouton juste après le temps, touche P, onglet masqué
 * @param {HTMLElement|null} timerElement - Temps affiché dans le bandeau
 */
export function mountArcadePause(timerElement) {
  unmountArcadePause();
  if (!timerElement) return;
  const button = createTimeButton(
    'btn btn-secondary btn-sm arcade-pause-btn',
    PAUSE_LABEL,
    toggleArcadePause
  );
  timerElement.after(button);
  document.addEventListener('keydown', onPauseKey);
  document.addEventListener('visibilitychange', onVisibilityChange);
  controls = { button, overlay: null };
}

/** Fin de la partie : plus de bouton, de voile ni d'écouteur, et plus de pause */
export function unmountArcadePause() {
  paused = false;
  if (!controls) return;
  document.removeEventListener('keydown', onPauseKey);
  document.removeEventListener('visibilitychange', onVisibilityChange);
  removeOverlay();
  controls.button.remove();
  controls = null;
}

/**
 * Le joueur a-t-il choisi une partie sans limite de temps pour ce jeu ?
 * @param {string} game - multimemory…
 * @returns {boolean}
 */
export function isNoTimeLimit(game) {
  if (!UNTIMED_GAMES.has(game)) return false;
  if (noTimeLimitChoices.has(game)) return noTimeLimitChoices.get(game);
  try {
    return globalThis.localStorage?.getItem(`${NO_TIME_LIMIT_STORAGE}${game}`) === 'true';
  } catch {
    return false;
  }
}

/**
 * Retient le choix « sans limite de temps » d'un jeu, sur l'appareil
 * @param {string} game
 * @param {boolean} enabled
 */
export function setNoTimeLimit(game, enabled) {
  if (!UNTIMED_GAMES.has(game)) return;
  noTimeLimitChoices.set(game, Boolean(enabled));
  try {
    globalThis.localStorage?.setItem(`${NO_TIME_LIMIT_STORAGE}${game}`, String(Boolean(enabled)));
  } catch {
    // Stockage indisponible : le choix vaut pour cette visite
  }
}
