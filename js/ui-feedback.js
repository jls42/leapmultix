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

const SVG_NS = 'http://www.w3.org/2000/svg';

/** Durée d'affichage d'un message, puis de sa disparition (ms) */
const MESSAGE_DURATION = 3000;
const MESSAGE_EXIT = 300;

/** Un seul message à la fois : le suivant remplace le texte au lieu de s'empiler */
const messageState = { popup: null, dismissTimer: null, removeTimer: null };

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

  // Apparition (ou nouveau texte dans le message déjà affiché)
  setTimeout(() => {
    popup.textContent = message;
    popup.classList.add('active');
  }, 10);

  // Disparition, repoussée par chaque nouveau message
  messageState.dismissTimer = setTimeout(() => {
    popup.classList.remove('active');
    messageState.removeTimer = setTimeout(() => {
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
  return text.replace(/ = /g, '\u00a0=\u00a0').replace(/(\d) (?=\p{L})/gu, '$1\u00a0');
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
  } catch (e) {
    void e;
  }
}

/**
 * Crée une icône SVG décorative (masquée aux technologies d'assistance).
 * @param {string} className
 * @param {string} pathData
 * @returns {SVGSVGElement}
 */
function createIcon(className, pathData) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', className);
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', pathData);
  svg.appendChild(path);
  return svg;
}

const CHECK_PATH = 'M5 12.5l4.5 4.5L19 7';
const STAR_PATH = 'M12 2.8l2.8 5.9 6.4.8-4.7 4.5 1.2 6.4L12 17.3l-5.7 3.1 1.2-6.4-4.7-4.5 6.4-.8z';
const LOCK_PATH =
  'M7 10.5V8a5 5 0 0 1 10 0v2.5M6 10.5h12a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8.5a1 1 0 0 1 1-1z';

/** Coche de la bonne réponse. */
export function createCheckIcon() {
  return createIcon('option-mark', CHECK_PATH);
}

/**
 * Étoile de récompense (remplie si gagnée).
 * @param {boolean} earned
 * @returns {SVGSVGElement}
 */
export function createStarIcon(earned = true) {
  return createIcon(earned ? 'reward-star is-earned' : 'reward-star', STAR_PATH);
}

/** Cadenas des niveaux verrouillés. */
export function createLockIcon() {
  return createIcon('level-lock', LOCK_PATH);
}

/**
 * Après un choix : la tuile juste reçoit une coche (jamais la couleur seule),
 * le choix erroné de l'enfant reste enfoncé, sur fond neutre.
 * @param {HTMLElement} container - Conteneur des tuiles `.option`
 * @param {*} correctAnswer - Bonne réponse
 * @param {*} chosenAnswer - Réponse choisie par l'enfant
 */
export function markAnswerOptions(container, correctAnswer, chosenAnswer) {
  if (!container) return;
  const correct = String(correctAnswer);
  const chosen = chosenAnswer === undefined || chosenAnswer === null ? null : String(chosenAnswer);

  container.classList.add('is-answered');
  for (const option of container.querySelectorAll('.option')) {
    const value = option.dataset.value;
    const isCorrect = value === correct;
    option.classList.toggle('is-correct', isCorrect);
    option.classList.toggle('is-chosen-wrong', !isCorrect && value === chosen);
    if (isCorrect && !option.querySelector('.option-mark')) {
      option.appendChild(createCheckIcon());
    }
  }
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
 * Catégorie de pluriel de la langue active (fr : 0 et 1 au singulier).
 * @param {number} count
 * @returns {string} 'one' ou 'other'
 */
function pluralCategory(count) {
  try {
    return new Intl.PluralRules(getCurrentLanguage()).select(count);
  } catch {
    return count === 1 ? 'one' : 'other';
  }
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
    pluralCategory(correct) === 'one' ? 'results_correct_count_one' : 'results_correct_count';
  return getTranslation(key, { correct, total });
}

/**
 * Libellé accessible d'une note en étoiles : « 2 étoiles sur 3 ».
 * @param {number} stars
 * @param {number} total
 * @returns {string}
 */
export function formatStarsLabel(stars, total = 3) {
  const key = pluralCategory(stars) === 'one' ? 'stars_earned_one' : 'stars_earned';
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
  img.src = `assets/images/arcade/${avatar}_head_avatar_128x128.png`;
  img.alt = '';
  img.width = size;
  img.height = size;
  return img;
}

/**
 * Corps d'un écran de fin : phrase principale, message, ligne secondaire compacte.
 * @param {Object} config
 * @param {string} config.lead - Phrase principale (« 7 bonnes réponses sur 10 »)
 * @param {string} [config.leadTag='h2'] - Balise de la phrase principale
 * @param {string} [config.message] - Encouragement
 * @param {string[]} [config.details] - Éléments secondaires (score, meilleure série…)
 * @returns {DocumentFragment}
 */
export function createResultsSummary({ lead, leadTag = 'h2', message = '', details = [] }) {
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

/**
 * Mots prononcés pour les symboles d'une question, dans la langue de l'interface.
 * Sans traduction, repli sur les mots français (comportement historique).
 */
const SPOKEN_SYMBOLS = [
  ['×', 'speech_times', 'fois'],
  ['+', 'speech_plus', 'plus'],
  ['−', 'speech_minus', 'moins'],
  ['÷', 'speech_divided_by', 'divisé par'],
  ['=', 'speech_equals', 'égale'],
];

function spokenWord(key, fallback) {
  const value = getTranslation(key);
  return typeof value === 'string' && value && !/^\[.+\]$/.test(value) ? value : fallback;
}

/**
 * Forme prononcée d'une question : « 7 × 8 = ? » → « 7 fois 8 égale ? ».
 * @param {string} text
 * @returns {string}
 */
export function toSpokenForm(text) {
  let spoken = String(text);
  for (const [symbol, key, fallback] of SPOKEN_SYMBOLS) {
    if (spoken.includes(symbol)) {
      spoken = spoken.replaceAll(symbol, ` ${spokenWord(key, fallback)} `);
    }
  }
  return spoken.replace(/\s+/g, ' ').trim();
}

/**
 * Mot prononcé pour un opérateur (« fois », « times », « por »).
 * @param {string} operator
 * @returns {string}
 */
export function spokenOperator(operator) {
  const entry = SPOKEN_SYMBOLS.find(([symbol]) => symbol === operator);
  return entry ? spokenWord(entry[1], entry[2]) : String(operator);
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
