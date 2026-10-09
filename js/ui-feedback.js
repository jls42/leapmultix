/**
 * UI Feedback helpers (ESM)
 * - showMessage : message éphémère (toast), annoncé aux lecteurs d'écran
 * - showFeedback : retour de réponse dans un élément
 * - markAnswerOptions / tagAnswerOptions / markQuestionKind : état des tuiles de réponse
 * - formatCorrectCount / createResultsSummary / createResultsActions / createStarRating :
 *   écrans de fin des modes Quiz, Défi et Aventure ; mountResults les affiche, les
 *   garde dans la langue choisie et y place le focus
 * - singleActivation : une seule activation par geste (Entrée déclenche deux clics)
 * - preferredScrollBehavior / scrollToScreenTop : défilement qui respecte le mouvement réduit
 * - keepNumbersTogether : un nombre reste collé à son nom (« 9 sauts »)
 */

import { speak } from './speech.js';
import { getTranslation } from './i18n.js';
import { getCurrentLanguage } from './i18n-store.js';
import { eventBus } from './core/eventBus.js';
import { pluralCategory } from './core/message-format.js';
import {
  spokenEquation,
  spokenGapQuestion,
  spokenOperatorWord,
  spokenQuestion,
} from './core/spoken-text.js';
import { createPathIcon } from './components/icons.js';
import { HEAD_SIZES, setAvatarHead } from './avatar-heads.js';

/** Durée d'affichage d'un message, puis de sa disparition (ms) */
const MESSAGE_DURATION = 3000;
const MESSAGE_EXIT = 300;

/** Un seul message à la fois : le suivant remplace le texte au lieu de s'empiler */
const messageState = { popup: null, dismissTimer: null, removeTimer: null, unfollow: null };

/** Commandes que le message ne doit jamais cacher (« Abandonner », réponses, barre du haut) */
const CONTROL_SELECTOR =
  'button, a[href], input:not([type="hidden"]), select, textarea, [role="button"]';
/** Écart minimal entre le message et une commande, ou le bord de l'écran (px) */
const MESSAGE_GAP = 8;

/**
 * Le message à sa place, en bas, sans le décalage de son apparition (transform) : il est
 * centré dans la largeur de l'écran
 * @param {HTMLElement} popup
 * @returns {{left: number, right: number, top: number, height: number}}
 */
function messageBox(popup) {
  const width = popup.offsetWidth;
  const left = (globalThis.innerWidth - width) / 2;
  return { left, right: left + width, top: popup.offsetTop, height: popup.offsetHeight };
}

/**
 * Commande affichée dans l'écran, dans la largeur du message
 * @param {Element} el
 * @param {{left: number, right: number}} box
 * @returns {DOMRect|null} Sa boîte, ou null
 */
function controlUnder(el, box) {
  if (el.closest('[inert]')) return null;
  const r = el.getBoundingClientRect();
  const onScreen = r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < globalThis.innerHeight;
  return onScreen && r.right > box.left && r.left < box.right ? r : null;
}

/**
 * Hauteurs occupées par les commandes dans la largeur du message, écart compris, de haut en
 * bas
 * @param {{left: number, right: number}} box
 * @returns {Array<[number, number]>}
 */
function controlBands(box) {
  const bands = [];
  for (const el of document.querySelectorAll(CONTROL_SELECTOR)) {
    const r = controlUnder(el, box);
    if (r) bands.push([r.top - MESSAGE_GAP, r.bottom + MESSAGE_GAP]);
  }
  bands.sort((a, b) => a[0] - b[0]);
  return bands;
}

/**
 * Posé à cette hauteur, le message ne touche aucune commande et reste dans l'écran
 * @returns {boolean}
 */
function isFreeAt(top, height, bands) {
  if (top < MESSAGE_GAP || top + height > globalThis.innerHeight - MESSAGE_GAP) return false;
  return bands.every(([start, end]) => end <= top || start >= top + height);
}

/**
 * Juste sous la barre du haut, si elle est à l'écran (elle défile avec la page au
 * téléphone) : là, le message ne couvre que la ligne du score
 * @returns {number|undefined}
 */
function belowTopBar() {
  const bar = document.querySelector('.slide.active-slide .top-bar')?.getBoundingClientRect();
  return bar && bar.bottom > 0 ? bar.bottom + MESSAGE_GAP : undefined;
}

/**
 * La place libre la plus basse, entre les commandes, où le message tient entier
 * @returns {number|undefined}
 */
function lowestFreeTop(height, bands) {
  let lowest;
  let cursor = MESSAGE_GAP;
  for (const [start, end] of [...bands, [globalThis.innerHeight - MESSAGE_GAP, Infinity]]) {
    if (start - cursor >= height) lowest = start - height;
    cursor = Math.max(cursor, end);
  }
  return lowest;
}

/**
 * Pose le message là où il ne cache aucune commande : à sa place en bas, sinon sous la
 * barre du haut, sinon dans la place libre la plus basse. Nulle part : il reste en bas.
 * @param {HTMLElement} popup
 */
function placeMessage(popup) {
  popup.classList.remove('is-raised');
  const box = messageBox(popup);
  const bands = controlBands(box);
  if (isFreeAt(box.top, box.height, bands)) return;
  const top = [belowTopBar(), lowestFreeTop(box.height, bands)].find(
    candidate => candidate !== undefined && isFreeAt(candidate, box.height, bands)
  );
  if (top === undefined) return;
  popup.style.setProperty('--message-top', `${Math.round(top)}px`);
  popup.classList.add('is-raised');
}

/**
 * Tant qu'il est affiché, le message se repose quand la page défile ou change de taille
 * @param {HTMLElement} popup
 * @returns {() => void} Arrête le suivi
 */
function followPlacement(popup) {
  let frame = 0;
  const replace = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      placeMessage(popup);
    });
  };
  // En capture : la page ou l'écran qui défile (les écrans de jeu ont leur propre défilement)
  document.addEventListener('scroll', replace, { capture: true, passive: true });
  globalThis.addEventListener('resize', replace);
  return () => {
    document.removeEventListener('scroll', replace, { capture: true });
    globalThis.removeEventListener('resize', replace);
    cancelAnimationFrame(frame);
  };
}

export function showMessage(message) {
  clearTimeout(messageState.dismissTimer);
  clearTimeout(messageState.removeTimer);

  let popup = messageState.popup;
  if (!popup || !document.body.contains(popup)) {
    popup = document.createElement('div');
    popup.className = 'message-popup';
    // Région live créée vide puis remplie : les lecteurs d'écran annoncent le texte
    popup.setAttribute('role', 'status');
    document.body.appendChild(popup);
    messageState.popup = popup;
  }

  // Apparition (ou nouveau texte dans le message déjà affiché), là où il ne cache aucune
  // commande : au téléphone, sa place en bas est souvent celle de « Abandonner »
  setTimeout(() => {
    popup.textContent = message;
    popup.classList.add('active');
    placeMessage(popup);
  }, 10);
  messageState.unfollow?.();
  messageState.unfollow = followPlacement(popup);

  // Disparition, repoussée par chaque nouveau message
  messageState.dismissTimer = setTimeout(() => {
    popup.classList.remove('active');
    messageState.removeTimer = setTimeout(() => {
      messageState.unfollow?.();
      messageState.unfollow = null;
      popup.remove();
      if (messageState.popup === popup) messageState.popup = null;
    }, MESSAGE_EXIT);
  }, MESSAGE_DURATION);
}

/**
 * Défilement immédiat si le système demande de réduire les animations
 * @returns {'auto'|'smooth'}
 */
export function preferredScrollBehavior() {
  try {
    return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
      ? 'auto'
      : 'smooth';
  } catch {
    return 'smooth';
  }
}

/**
 * Ramène l'écran en haut (la slide et la page). Contrairement à scrollIntoView sur la
 * zone de jeu, la barre du haut (Accueil, menu) reste visible.
 * @param {HTMLElement} element - Un élément de la slide
 */
export function scrollToScreenTop(element) {
  const behavior = preferredScrollBehavior();
  const slide = element?.closest?.('.slide');
  try {
    if (typeof slide?.scrollTo === 'function') slide.scrollTo({ top: 0, behavior });
  } catch {
    /* défilement facultatif */
  }
  try {
    globalThis.scrollTo?.({ top: 0, behavior });
  } catch {
    /* défilement facultatif */
  }
}

/**
 * Espaces insécables : un nombre reste collé au mot qui le suit (« 9 sauts ») et
 * un signe « = » à ses deux voisins (« une semaine = 7 jours »).
 * @param {string} text
 * @returns {string}
 */
export function keepNumbersTogether(text) {
  if (typeof text !== 'string' || !text) return '';
  return text.replaceAll(' = ', '\u00a0=\u00a0').replaceAll(/(\d) (?=\p{L})/gu, '$1\u00a0');
}

export function showFeedback(target, message, type = 'success', speakIt = false) {
  const el = typeof target === 'string' ? document.getElementById(target) : target;
  if (!el) return;
  // Utilise textContent au lieu d'innerHTML pour éviter XSS
  el.textContent = message;
  // Remplace seulement l'état précédent : les classes propres au mode sont conservées
  for (const cls of Array.from(el.classList)) {
    if (cls.startsWith('feedback-')) el.classList.remove(cls);
  }
  el.classList.add('feedback', `feedback-${type}`);
  el.setAttribute('aria-live', 'polite');
  try {
    if (speakIt) speak(message);
  } catch {
    /* ignoré volontairement */
  }
}

const CHECK_PATH = 'M5 12.5l4.5 4.5L19 7';
const CROSS_PATH = 'M7 7l10 10M17 7L7 17';
const STAR_PATH = 'M12 2.8l2.8 5.9 6.4.8-4.7 4.5 1.2 6.4L12 17.3l-5.7 3.1 1.2-6.4-4.7-4.5 6.4-.8z';
const LOCK_PATH =
  'M7 10.5V8a5 5 0 0 1 10 0v2.5M6 10.5h12a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8.5a1 1 0 0 1 1-1z';
const TRASH_PATH = 'M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10.5 11v5.5M13.5 11v5.5';

/** Coche de la bonne réponse. */
export function createCheckIcon() {
  return createPathIcon(CHECK_PATH, 'option-mark');
}

/** Croix du choix erroné : l'enfant retrouve la tuile qu'il a touchée. */
export function createCrossIcon() {
  return createPathIcon(CROSS_PATH, 'option-mark option-mark-wrong');
}

/**
 * Étoile de récompense (remplie si gagnée).
 * @param {boolean} earned
 * @returns {SVGSVGElement}
 */
export function createStarIcon(earned = true) {
  return createPathIcon(STAR_PATH, earned ? 'reward-star is-earned' : 'reward-star');
}

/** Cadenas des niveaux verrouillés. */
export function createLockIcon() {
  return createPathIcon(LOCK_PATH, 'level-lock');
}

/**
 * Poubelle d'un bouton « retirer » : dans un jeu de calcul, une croix se lirait comme le
 * signe × de la multiplication.
 */
export function createTrashIcon() {
  return createPathIcon(TRASH_PATH, 'trash-icon');
}

/** Valeur d'une tuile en texte, ou null s'il n'y en a pas */
function optionText(value) {
  return value === undefined || value === null ? null : String(value);
}

/**
 * Après un choix : la tuile juste reçoit une coche, le choix erroné une croix
 * (jamais la couleur seule) et reste enfoncé. Les deux se repèrent d'un coup d'œil.
 * @param {HTMLElement} container - Conteneur des tuiles `.option`
 * @param {*} correctAnswer - Bonne réponse ; null : aucune tuile n'est montrée comme juste
 * @param {*} chosenAnswer - Réponse choisie par l'enfant
 */
export function markAnswerOptions(container, correctAnswer, chosenAnswer) {
  if (!container) return;
  const correct = optionText(correctAnswer);
  const chosen = optionText(chosenAnswer);

  container.classList.add('is-answered');
  for (const option of container.querySelectorAll('.option')) {
    const value = option.dataset.value;
    markOption(option, value === correct, value === chosen);
  }
}

/**
 * Marque une tuile : coche si elle porte la bonne réponse, croix si c'est le
 * choix de l'enfant, rien sinon.
 * @param {HTMLElement} option
 * @param {boolean} isCorrect
 * @param {boolean} isChosen
 */
function markOption(option, isCorrect, isChosen) {
  const isChosenWrong = isChosen && !isCorrect;
  option.classList.toggle('is-correct', isCorrect);
  option.classList.toggle('is-chosen-wrong', isChosenWrong);
  if (!isCorrect && !isChosenWrong) return;
  if (option.querySelector('.option-mark')) return;
  option.appendChild(isCorrect ? createCheckIcon() : createCrossIcon());
}

/**
 * Les nombres s'affichent en police de titre, les mots (Vrai, Faux, nombres écrits
 * en lettres) en police de lecture.
 * @param {HTMLElement} container
 */
export function tagAnswerOptions(container) {
  if (!container) return;
  for (const option of container.querySelectorAll('.option')) {
    const isNumber = /^-?\d+$/.test(option.textContent.trim());
    option.classList.toggle('is-word', !isNumber);
  }
}

/**
 * Un calcul s'affiche en grand ; un énoncé (problème) en police de lecture.
 * @param {HTMLElement} element - Zone de question
 * @param {Object} question - Question courante ({ type })
 */
export function markQuestionKind(element, question) {
  if (!element) return;
  element.classList.toggle('is-sentence', question?.type === 'problem');
}

/**
 * Phrase principale de fin de partie : « 7 bonnes réponses sur 10 ».
 * @param {number} correct
 * @param {number} total
 * @returns {string}
 */
export function formatCorrectCount(correct, total) {
  if (!total) return getTranslation('results_no_answer');
  const key =
    pluralCategory(correct, getCurrentLanguage()) === 'one'
      ? 'results_correct_count_one'
      : 'results_correct_count';
  return getTranslation(key, { correct, total });
}

/**
 * Libellé accessible d'une note en étoiles : « 2 étoiles sur 3 ».
 * @param {number} stars
 * @param {number} total
 * @returns {string}
 */
export function formatStarsLabel(stars, total = 3) {
  const key =
    pluralCategory(stars, getCurrentLanguage()) === 'one' ? 'stars_earned_one' : 'stars_earned';
  return getTranslation(key, { stars, total });
}

/**
 * Note en étoiles (récompense) : remplissage --color-reward, jamais du texte.
 * @param {number} earned
 * @param {number} total
 * @returns {HTMLElement}
 */
export function createStarRating(earned, total = 3) {
  const rating = document.createElement('p');
  rating.className = 'reward-stars';
  rating.setAttribute('role', 'img');
  rating.setAttribute('aria-label', formatStarsLabel(earned, total));
  for (let i = 0; i < total; i++) {
    rating.appendChild(createStarIcon(i < earned));
  }
  return rating;
}

/**
 * Visage du personnage de l'enfant pour un écran de fin (image décorative : alt vide).
 * @param {string} avatar - Identifiant d'avatar (fox, panda, unicorn, dragon, astronaut)
 * @param {number} [size=96]
 * @returns {HTMLImageElement|null}
 */
export function createAvatarPortrait(avatar, size = 96) {
  if (typeof avatar !== 'string' || !/^[a-z]+$/.test(avatar)) return null;
  const img = document.createElement('img');
  img.className = 'results-avatar';
  setAvatarHead(img, avatar, HEAD_SIZES.results);
  img.alt = '';
  img.width = size;
  img.height = size;
  return img;
}

/**
 * Corps d'un écran de fin : phrase principale, message, ligne secondaire compacte.
 * @param {Object} config
 * @param {string} config.lead - Phrase principale (« 7 bonnes réponses sur 10 »)
 * @param {string} [config.leadTag='h1'] - Balise de la phrase principale : le titre de l'écran,
 *   sauf s'il en a un autre (Aventure : « Niveau terminé »)
 * @param {string} [config.message] - Encouragement
 * @param {string[]} [config.details] - Éléments secondaires (score, meilleure série…)
 * @returns {DocumentFragment}
 */
export function createResultsSummary({ lead, leadTag = 'h1', message = '', details = [] }) {
  const frag = document.createDocumentFragment();

  const leadEl = document.createElement(leadTag);
  leadEl.className = 'results-lead';
  leadEl.textContent = lead;
  frag.appendChild(leadEl);

  if (message) {
    const messageEl = document.createElement('p');
    messageEl.className = 'results-message';
    messageEl.textContent = message;
    frag.appendChild(messageEl);
  }

  const items = details.filter(Boolean);
  if (items.length > 0) {
    const detailsEl = document.createElement('p');
    detailsEl.className = 'results-details';
    for (const item of items) {
      const span = document.createElement('span');
      span.textContent = item;
      detailsEl.appendChild(span);
    }
    frag.appendChild(detailsEl);
  }

  return frag;
}

/** Texte traduit, ou null si la clé manque (getTranslation rend alors « [clé] ») */
function translatedOrNull(key, params) {
  const value = getTranslation(key, params);
  return typeof value === 'string' && value && !/^\[.+\]$/.test(value) ? value : null;
}

/**
 * Forme prononcée d'une égalité : « 8 × 6 = 47 » → « 8 fois 6 égale 47 ».
 * @param {string} text
 * @returns {string}
 */
export function toSpokenForm(text) {
  return spokenEquation(text, translatedOrNull);
}

/**
 * Mot prononcé pour un opérateur (« fois », « times », « por »).
 * @param {string} operator
 * @returns {string}
 */
export function spokenOperator(operator) {
  return spokenOperatorWord(operator, translatedOrNull);
}

/**
 * Question lue à voix haute : « 7 × 8 = ? » → « Combien font 7 fois 8 ? ».
 * @param {string} text - Question affichée
 * @returns {string}
 */
export function toSpokenQuestion(text) {
  return spokenQuestion(text, translatedOrNull);
}

/**
 * Question à trou lue à voix haute : « 7 × ? = 56 » → « 7 fois combien égale 56 ? ».
 * @param {string} text - Question affichée
 * @returns {string}
 */
export function toSpokenGapQuestion(text) {
  return spokenGapQuestion(text, translatedOrNull);
}

/**
 * Enveloppe un gestionnaire de clic pour ignorer une seconde activation dans la même
 * tâche : Entrée sur un bouton déclenche aujourd'hui deux clics (accessibility.js et
 * mainInit.js), ce qui relançait une partie ou enregistrait deux fois un résultat.
 * @param {Function} handler
 * @returns {Function}
 */
export function singleActivation(handler) {
  let busy = false;
  return function guarded(...args) {
    if (busy) return undefined;
    busy = true;
    setTimeout(() => {
      busy = false;
    }, 0);
    return handler.apply(this, args);
  };
}

/**
 * Rangée de boutons d'un écran de fin : une action principale, les autres secondaires.
 * @param {Array<{label: string, action: string, onActivate: Function, primary?: boolean, level?: number}>} buttons
 * @returns {HTMLElement}
 */
export function createResultsActions(buttons) {
  const row = document.createElement('div');
  row.className = 'results-actions button-row';
  for (const { label, action, onActivate, primary = false, level } of buttons) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = primary ? 'btn' : 'btn btn-secondary';
    btn.dataset.action = action;
    if (level !== undefined) btn.dataset.level = String(level);
    btn.textContent = label;
    btn.addEventListener(
      'click',
      singleActivation(e => {
        e.preventDefault();
        onActivate(e);
      })
    );
    row.appendChild(btn);
  }
  return row;
}

/**
 * Place le focus sur le titre d'un écran de fin (tabindex -1) : un lecteur d'écran
 * annonce que la partie est finie, et Tab mène directement aux boutons.
 * @param {HTMLElement} screen
 */
function focusResultsHeading(screen) {
  const heading = screen?.querySelector('h1, h2, h3');
  if (!heading) return;
  heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: true });
}

/** Écran de fin affiché par conteneur : fonction qui le détache */
const mountedResults = new WeakMap();

/**
 * Affiche un écran de fin et le garde dans la langue choisie : la fonction de rendu
 * est rappelée au changement de langue tant que l'écran reste affiché. Le focus va
 * ensuite sur son titre.
 * @param {HTMLElement} host - Conteneur (#results, #game)
 * @param {() => HTMLElement} render - Construit l'écran, sans autre effet
 * @param {Object} [options]
 * @param {Promise|undefined} [options.ready] - Navigation à attendre avant le focus
 * @param {boolean} [options.scrollTop=false] - Ramener l'écran en haut
 * @returns {HTMLElement|null} L'écran affiché
 */
export function mountResults(host, render, { ready, scrollTop = false } = {}) {
  if (!host || typeof render !== 'function') return null;
  mountedResults.get(host)?.();

  let screen = render();
  host.replaceChildren(screen);

  const onLanguageChanged = () => {
    if (!screen.isConnected) {
      detach();
      return;
    }
    const active = document.activeElement;
    const action = screen.contains(active) ? active.closest?.('[data-action]')?.dataset.action : '';
    const headingHadFocus = active?.matches?.('h1, h2, h3') && screen.contains(active);
    const next = render();
    screen.replaceWith(next);
    screen = next;
    if (action) {
      next.querySelector(`[data-action="${action}"]`)?.focus({ preventScroll: true });
    } else if (headingHadFocus) {
      focusResultsHeading(next);
    }
  };
  const detach = () => {
    eventBus.off('languageChanged', onLanguageChanged);
    if (mountedResults.get(host) === detach) mountedResults.delete(host);
  };
  eventBus.on('languageChanged', onLanguageChanged);
  mountedResults.set(host, detach);

  Promise.resolve(ready)
    .then(() => {
      if (!screen.isConnected) return;
      if (scrollTop) scrollToScreenTop(host);
      focusResultsHeading(screen);
    })
    .catch(() => {
      /* focus facultatif */
    });

  return screen;
}

export default { showMessage, showFeedback };
