/**
 * Classe de base pour tous les modes de jeu LeapMultix
 * Phase 5.1 - Refactorisation des modes de jeu
 *
 * Centralise les patterns communs :
 * - Initialisation et nettoyage
 * - Gestion du score et des statistiques
 * - Génération et validation des questions
 * - Feedback et résultats
 * - Interface avec InfoBar et utils
 *
 * Une erreur est une étape : dans les modes non chronométrés (config.pauseAfterError),
 * l'explication reste affichée et « Continuer » attend l'enfant, sans compte à rebours.
 *
 * Security note: Math.random() is used for generating random questions and shuffling
 * answer options. This is safe - it's an educational game, not security-sensitive.
 */

import {
  speak,
  getTranslation,
  showFeedback,
  updateInfoBar as _updateInfoBar,
  addArrowKeyNavigation as _addArrowKeyNavigation,
} from '../utils-es6.js';
import { recordOperationResult } from './operation-stats.js';
import { UserState } from './userState.js';
import { goToSlide } from '../slides.js';
import { AudioManager } from './audio.js';
import { InfoBar } from '../components/infoBar.js';
import { generateQuestion } from '../questionGenerator.js';
import { gameState } from '../game.js';
import { getTranslations } from '../i18n-store.js';
import { setSafeComplexFeedback } from '../security-utils.js';
import {
  toSpokenForm,
  spokenOperator,
  preferredScrollBehavior,
  keepNumbersTogether,
} from '../ui-feedback.js';

// ======================================
// ÉNONCÉS DE PROBLÈMES
// ======================================

/** Clés des énoncés de problèmes, par opération (même ordre dans toutes les langues) */
const PROBLEM_TEMPLATE_KEYS = {
  '×': 'problem_templates',
  '+': 'problem_templates_addition',
  '−': 'problem_templates_subtraction',
  '÷': 'problem_templates_division',
};

/**
 * Valeurs des gabarits : {table}/{num} pour la multiplication, {a}/{b} sinon
 * @param {Object} question
 * @returns {Object}
 */
function problemParams(question) {
  return question.operator === '×'
    ? { table: question.a, num: question.b }
    : { a: question.a, b: question.b };
}

/**
 * Remplit un gabarit comme le fait i18n-store (première occurrence de chaque clé)
 * @param {string} template
 * @param {Object} params
 * @returns {string}
 */
function fillTemplate(template, params) {
  let text = String(template);
  for (const [key, value] of Object.entries(params)) {
    text = text.replace(`{${key}}`, value);
  }
  return text;
}

/**
 * Gabarits de la langue active pour une opération
 * @param {string} operator
 * @returns {string[]}
 */
function problemTemplates(operator) {
  const list = getTranslations()?.[PROBLEM_TEMPLATE_KEYS[operator]];
  return Array.isArray(list) ? list : [];
}

/**
 * Retrouve le gabarit qui a produit un énoncé, pour le retraduire ou l'expliquer.
 * @param {Object} question
 * @returns {number} Index du gabarit, -1 s'il est introuvable
 */
export function findProblemTemplateIndex(question) {
  if (question?.type !== 'problem') return -1;
  const params = problemParams(question);
  return problemTemplates(question.operator).findIndex(
    template => fillTemplate(template, params) === question.question
  );
}

/**
 * Énoncé de multiplication : dans chaque gabarit, le premier nombre compte les groupes,
 * le second en donne la taille (« 8 groupes de 7 enfants », « 7 boîtes de 8 pommes »).
 * @param {Object} question
 * @returns {{size: number, groups: number}|null} null si le gabarit est inconnu
 */
function problemGroups(question) {
  const index = question.templateIndex ?? findProblemTemplateIndex(question);
  const template = problemTemplates('×')[index];
  if (typeof template !== 'string') return null;
  const tablePos = template.indexOf('{table}');
  const numPos = template.indexOf('{num}');
  if (tablePos < 0 || numPos < 0) return null;
  return tablePos > numPos
    ? { size: question.a, groups: question.b }
    : { size: question.b, groups: question.a };
}

// ======================================
// EXPLICATION D'UNE ERREUR
// ======================================

/**
 * Traduction, ou chaîne vide si la clé manque
 * @param {string} key
 * @param {Object} [params]
 * @returns {string}
 */
function translateOrEmpty(key, params = {}) {
  const value = getTranslation(key, params);
  return typeof value === 'string' && !/^\[.+\]$/.test(value) ? value : '';
}

/**
 * Un calcul qui ne se coupe jamais : « 7 × 8 = 56 » avec des espaces insécables
 * @param {...(number|string)} parts
 * @returns {string}
 */
function formatEquation(...parts) {
  return parts.join('\u00a0');
}

/** Opérandes numériques d'une question (nouveau format a/b ou ancien table/num) */
function operandsOf(question) {
  return {
    a: Number(question.a ?? question.table),
    b: Number(question.b ?? question.num),
  };
}

/**
 * Résultat réel du calcul (utile pour les questions Vrai/Faux)
 * @param {string} operator
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function computeResult(operator, a, b) {
  switch (operator) {
    case '+':
      return a + b;
    case '−':
      return a - b;
    case '÷':
      return b === 0 ? NaN : a / b;
    default:
      return a * b;
  }
}

/** Petit comptage (au plus 12 pas) pour rester lisible */
const MAX_COUNT_STEPS = 12;

/**
 * Comptage de la multiplication : par la taille d'un groupe, autant de fois qu'il y a
 * de groupes. 6 × 7 → « Compter par 6 : 6 → 12 → … → 42 ».
 * @returns {{countBy: Object|null, table: number}}
 */
function multiplicationCount(question, a, b) {
  const groups = question.type === 'problem' ? problemGroups(question) : { size: a, groups: b };
  if (!groups) return { countBy: null, table: a };
  const { size, groups: times } = groups;
  if (!Number.isInteger(size) || !Number.isInteger(times) || size < 1 || times < 1) {
    return { countBy: null, table: size };
  }
  if (times > MAX_COUNT_STEPS) return { countBy: null, table: size };
  const steps = Array.from({ length: times }, (_, i) => size * (i + 1));
  return {
    countBy: { label: translateOrEmpty('feedback_count_by', { step: size }), steps },
    table: size,
  };
}

/**
 * Addition : avancer à partir du plus grand nombre (9 + 2 → « 9 → 10 → 11 »)
 * @returns {Object|null}
 */
function additionCount(a, b) {
  const start = Math.max(a, b);
  const step = Math.min(a, b);
  if (!Number.isInteger(step) || step < 1 || step > 10) return null;
  const steps = Array.from({ length: step + 1 }, (_, i) => start + i);
  return { label: translateOrEmpty('feedback_count_on', { step, start }), steps };
}

/**
 * Soustraction : reculer à partir du premier nombre (15 − 3 → « 15 → 14 → 13 → 12 »)
 * @returns {Object|null}
 */
function subtractionCount(a, b) {
  if (!Number.isInteger(b) || b < 1 || b > 10 || b > a) return null;
  const steps = Array.from({ length: b + 1 }, (_, i) => a - i);
  return { label: translateOrEmpty('feedback_count_back', { step: b, start: a }), steps };
}

/**
 * Ligne « Pour vérifier » : l'opération inverse, ou le calcul complété (question à trou)
 * @returns {{label: string, equation: string}|null}
 */
function checkFact(question, operator, a, b, result) {
  const label = translateOrEmpty('feedback_check');
  if (question.type === 'gap') {
    return { label, equation: formatEquation(a, operator, b, '=', result) };
  }
  if (operator === '−') return { label, equation: formatEquation(result, '+', b, '=', a) };
  if (operator === '÷') return { label, equation: formatEquation(result, '×', b, '=', a) };
  return null;
}

/** Astuce propre à chaque opération */
const OPERATION_HINT_KEYS = {
  '+': 'number_line_addition_explanation',
  '−': 'number_line_subtraction_explanation',
  '÷': 'division_sharing_explanation',
};

/**
 * Ce que fait l'opération : comptage (×, +, −) ou vérification (÷, trou, grands écarts),
 * et l'astuce qui l'accompagne.
 * @returns {{countBy: Object|null, hint: string, fact: Object|null}}
 */
function operationDetails(question, operator, a, b, result) {
  const operationHint = translateOrEmpty(OPERATION_HINT_KEYS[operator] ?? '');

  if (question.type === 'gap') {
    return {
      countBy: null,
      hint: operator === '×' ? translateOrEmpty(`mnemonic_${a}`) : operationHint,
      fact: checkFact(question, operator, a, b, result),
    };
  }
  if (operator === '×') {
    const { countBy, table } = multiplicationCount(question, a, b);
    return { countBy, hint: translateOrEmpty(`mnemonic_${table}`), fact: null };
  }
  if (operator === '+') {
    return { countBy: additionCount(a, b), hint: operationHint, fact: null };
  }
  if (operator === '−') {
    const countBy = subtractionCount(a, b);
    const fact = countBy ? null : checkFact(question, operator, a, b, result);
    return { countBy, hint: operationHint, fact };
  }
  return { countBy: null, hint: operationHint, fact: checkFact(question, operator, a, b, result) };
}

/**
 * Explication d'une erreur (principe « Comprendre avant de réciter ») : la bonne réponse,
 * le vrai résultat d'une question Vrai/Faux, ce que fait l'opération (comptage ou
 * vérification) et une astuce.
 * @param {Object} question - Question courante
 * @returns {{message: string, hint: string, countBy: Object|null, facts: Array<{label: string, equation: string}>}}
 */
export function buildErrorExplanation(question) {
  const operator = question.operator || '×';
  const { a, b } = operandsOf(question);
  const result = computeResult(operator, a, b);
  const isTrueFalse = question.type === 'true_false';

  let message;
  if (isTrueFalse) {
    message = getTranslation(
      question.answer === true ? 'incorrect_answer_was_true' : 'incorrect_answer_was_false'
    );
  } else {
    message = getTranslation('feedback_incorrect', { correctAnswer: question.answer });
  }

  // Vrai/Faux : le vrai résultat est écrit, pas seulement « Faux »
  const facts = [];
  if (isTrueFalse && Number.isFinite(result)) {
    facts.push({
      label: translateOrEmpty('feedback_right_result'),
      equation: formatEquation(a, operator, b, '=', result),
    });
  }

  const { countBy, hint, fact } = operationDetails(question, operator, a, b, result);
  if (fact?.equation) facts.push(fact);

  return { message, hint: keepNumbersTogether(hint), countBy, facts };
}

// ======================================
// RÉPONSES PROPOSÉES
// ======================================

/**
 * Nombre écrit en lettres dans la langue active (« quarante-deux »), sinon en chiffres
 * @param {number} value
 * @returns {string}
 */
function numberInWords(value) {
  const words = getTranslation(`numbers.${value}`);
  return typeof words === 'string' && words !== '' && !words.startsWith('[')
    ? words
    : String(value);
}

/**
 * Chiffres inversés d'un nombre à deux chiffres voisins (56 → 65), sinon null :
 * 16 → 61 serait trop loin pour tromper qui que ce soit.
 * @param {number} value
 * @returns {number|null}
 */
function reverseDigits(value) {
  if (!Number.isInteger(value) || value < 12 || value > 99 || value % 10 === 0) return null;
  const reversed = (value % 10) * 10 + Math.floor(value / 10);
  return Math.abs(reversed - value) === 9 ? reversed : null;
}

/**
 * Mélange de Fisher-Yates
 * @param {Array} list
 * @returns {Array}
 */
function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // NOSONAR - Safe: educational game randomization
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Voisins plausibles selon l'opération : ce que donnerait une erreur d'enfant
 * (un de plus ou de moins, un rang de table à côté, chiffres inversés).
 * @returns {number[]}
 */
function wrongAnswerPool(question, correct) {
  const { a, b } = operandsOf(question);
  const operator = question.operator || '×';
  if (question.type === 'gap') {
    return [correct + 1, correct - 1, correct + 2, correct - 2];
  }
  if (operator === '×') {
    return [
      a * (b + 1),
      a * (b - 1),
      (a + 1) * b,
      (a - 1) * b,
      correct + 1,
      correct - 1,
      reverseDigits(correct),
    ];
  }
  if (operator === '÷') {
    return [correct + 1, correct - 1, b, correct + 2, correct - 2];
  }
  return [
    correct + 1,
    correct - 1,
    correct + 2,
    correct - 2,
    correct + 10,
    correct - 10,
    reverseDigits(correct),
  ];
}

/**
 * Mauvaises réponses plausibles (jamais tirées au hasard entre 1 et 100) :
 * l'enfant ne peut pas trouver la bonne par élimination.
 * @param {Object} question
 * @param {number} [count=3]
 * @returns {number[]}
 */
export function plausibleWrongAnswers(question, count = 3) {
  const correct = Number(question?.answer);
  if (!Number.isFinite(correct)) return [];
  // Résultat de soustraction : 0 est possible ; ailleurs, des nombres à partir de 1
  const min = question.operator === '−' && question.type !== 'gap' ? 0 : 1;
  const max = correct <= 100 ? 100 : Infinity;
  const isValid = (value, list) =>
    Number.isInteger(value) &&
    value >= min &&
    value <= max &&
    value !== correct &&
    !list.includes(value);

  const pool = [];
  for (const value of wrongAnswerPool(question, correct)) {
    if (isValid(value, pool)) pool.push(value);
  }
  const chosen = shuffle(pool).slice(0, count);

  // Repli : voisins plus lointains si le réservoir est trop petit
  for (let offset = 3; chosen.length < count && offset < 50; offset++) {
    for (const value of [correct + offset, correct - offset]) {
      if (chosen.length < count && isValid(value, chosen)) chosen.push(value);
    }
  }
  return chosen;
}

/**
 * Bonne réponse et mauvaises réponses plausibles, mélangées
 * @param {Object} question
 * @param {number} [count=4]
 * @returns {number[]}
 */
export function buildAnswerOptions(question, count = 4) {
  return shuffle([question.answer, ...plausibleWrongAnswers(question, count - 1)]);
}

export class GameMode {
  /**
   * Fonction constructor
   * @param {*} modeName - Description du paramètre
   * @param {*} config - Description du paramètre
   */
  constructor(modeName, config = {}) {
    this.modeName = modeName;
    this.config = {
      // Configuration par défaut
      maxQuestions: 10,
      hasTimer: false,
      hasLives: false,
      hasStreaks: true,
      autoProgress: true,
      // Après une erreur, l'explication attend « Continuer » (modes non chronométrés)
      pauseAfterError: false,
      showScore: true,
      ...config,
    };

    // État du jeu
    this.state = {
      score: 0,
      streak: 0,
      questionCount: 0,
      correctAnswers: 0,
      isActive: false,
      currentQuestion: null,
      timeLeft: null,
      lives: null,
    };

    // Timers et intervalles
    this.timers = new Set();
    this.intervals = new Set();

    // Éléments DOM
    this.gameScreen = null;
    this.questionElement = null;
    this.optionsElement = null;
    this.feedbackElement = null;
    this.continueElement = null;

    // « Continuer » attendu après une erreur ; avance suspendue (fin de niveau…)
    this._continuePending = false;
    this._holdProgress = false;
  }

  /**
   * Démarrer le mode de jeu
   */
  async start() {
    try {
      // Navigation vers l'écran de jeu
      goToSlide(4);
      gameState.gameMode = this.modeName;

      // Réinitialiser l'état
      this.resetState();

      // Annonce vocale
      const translationKey = this.modeName + '_mode';
      const translatedText = getTranslation(translationKey);
      speak(translatedText, { priority: 'high' });

      // Initialiser l'interface
      await this.initializeUI();

      // Marquer actif AVANT la logique spécifique pour permettre generateQuestion() etc.
      this.state.isActive = true;

      // Démarrer la logique spécifique
      await this.onStart();
    } catch (error) {
      console.error(`❌ Erreur lors du démarrage de ${this.modeName}:`, error);
      this.handleError(error);
    }
  }

  /**
   * Arrêter le mode de jeu
   */
  stop() {
    this.state.isActive = false;

    // Arrêter la synthèse vocale et les sons en cours
    const Root =
      typeof globalThis !== 'undefined'
        ? globalThis
        : typeof window !== 'undefined'
          ? window
          : undefined;
    if (Root && 'speechSynthesis' in Root) {
      Root.speechSynthesis.cancel();
    }
    if (AudioManager && typeof AudioManager.stopAll === 'function') {
      AudioManager.stopAll();
    }

    // Nettoyer les timers et intervalles
    this.cleanup();

    // Logique spécifique d'arrêt
    this.onStop();
  }

  /**
   * Réinitialiser l'état du jeu
   */
  resetState() {
    this.state = {
      score: 0,
      streak: 0,
      questionCount: 0,
      correctAnswers: 0,
      isActive: false,
      currentQuestion: null,
      timeLeft: this.config.hasTimer ? this.config.initialTime : null,
      lives: this.config.hasLives ? this.config.initialLives : null,
    };
    this._continuePending = false;
    this._holdProgress = false;

    gameState.streak = 0;
  }

  /**
   * Initialiser l'interface utilisateur de base
   */
  async initializeUI() {
    this._setupGameScreen();
    await this._setupInfoBar();
    const container = this._createMainContainer();
    await this._addCustomContent(container);
    this._createGameElements(container);
    this._finalizeUI(container);
  }

  /**
   * Configure l'écran de jeu principal
   */
  _setupGameScreen() {
    this.gameScreen = document.getElementById('game');
    if (!this.gameScreen) {
      throw new Error('Conteneur #game non trouvé !');
    }
    // eslint-disable-next-line no-restricted-properties -- Safe: clearing with empty string, no injection risk
    this.gameScreen.innerHTML = '';
  }

  /**
   * Configure la barre d'information (aucune tant qu'il n'y a rien à suivre,
   * par exemple pendant le choix de la difficulté du Défi)
   */
  async _setupInfoBar() {
    const infoBarData = this.getInfoBarData();
    if (infoBarData === null || infoBarData === undefined) return;

    const ariaLabelKey = this.modeName + '_info_bar_label';
    const infoBarOptions = { ariaLabel: getTranslation(ariaLabelKey), ariaLabelKey };
    this._injectInfoBar(infoBarData, infoBarOptions);
  }

  /**
   * Injecte la barre d'information avec fallback
   */
  _injectInfoBar(infoBarData, infoBarOptions) {
    try {
      InfoBar.inject('game', this.modeName, infoBarData, infoBarOptions);
    } catch {
      this._createInfoBarFallback(infoBarData, infoBarOptions);
    }
  }

  /**
   * Crée la barre d'information en fallback
   */
  _createInfoBarFallback(infoBarData, infoBarOptions) {
    try {
      const el = InfoBar.createElement(this.modeName, infoBarData, infoBarOptions);
      this.gameScreen.appendChild(el);
    } catch {
      /* no-op */
    }
  }

  /**
   * Crée le conteneur principal. Titre et nom de région portent leur clé
   * (data-translate) : ils suivent un changement de langue.
   */
  _createMainContainer() {
    const card = document.createElement('div');
    card.className = 'content-card';
    const container = document.createElement('div');
    container.className = `${this.modeName}-container`;
    // Région nommée : l'application fournit déjà le <main> de la page
    const titleKey = this.modeName + '_mode';
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', getTranslation(titleKey));
    container.dataset.translateAriaLabel = titleKey;

    const title = document.createElement('h2');
    title.dataset.translate = titleKey;
    title.textContent = getTranslation(titleKey);
    container.appendChild(title);

    return { card, container };
  }

  /**
   * Ajoute le contenu personnalisé
   */
  async _addCustomContent(containerData) {
    const custom = await this.getCustomHTML();
    if (!custom) return;

    const customWrap = document.createElement('div');
    await this._processCustomContent(custom, customWrap);
    containerData.container.appendChild(customWrap);
  }

  /**
   * Traite le contenu personnalisé de façon sécurisée
   */
  async _processCustomContent(custom, customWrap) {
    try {
      const { sanitizeHtmlToFragment } = await import('../security-utils.js');
      if (typeof custom === 'string' && custom) {
        const frag = sanitizeHtmlToFragment(custom);
        customWrap.appendChild(frag);
      } else if (custom !== null && typeof custom === 'object' && 'nodeType' in Object(custom)) {
        customWrap.appendChild(custom);
      }
    } catch {
      const text = document.createTextNode(typeof custom === 'string' ? custom : '');
      customWrap.appendChild(text);
    }
  }

  /**
   * Crée les éléments de jeu : question, réponses, retour, puis « Continuer »
   */
  _createGameElements(containerData) {
    const q = this._createElement('question', 'question_label');
    const opt = this._createElement('options', 'options_label');
    const fb = this._createFeedbackElement();

    containerData.container.appendChild(q);
    containerData.container.appendChild(opt);
    containerData.container.appendChild(fb);

    this.questionElement = q;
    this.optionsElement = opt;
    this.feedbackElement = fb;

    this.continueElement = null;
    if (this.config.pauseAfterError) {
      this.continueElement = this._createContinueElement();
      containerData.container.appendChild(this.continueElement);
    }
  }

  /**
   * Crée un élément avec ID et rôle
   */
  _createElement(type, labelKey) {
    const element = document.createElement('div');
    element.id = `${this.modeName}-${type}`;
    element.className = `${type} ${this.modeName}-${type}`;
    element.setAttribute('role', 'region');
    element.setAttribute('aria-label', getTranslation(labelKey));
    element.dataset.translateAriaLabel = labelKey;
    return element;
  }

  /**
   * Crée l'élément de feedback
   */
  _createFeedbackElement() {
    const fb = document.createElement('div');
    fb.id = `${this.modeName}-feedback`;
    fb.className = `feedback ${this.modeName}-feedback`;
    fb.setAttribute('aria-live', 'polite');
    return fb;
  }

  /**
   * « Continuer » après une erreur : attend l'enfant, aucun minuteur (WCAG 2.2.1)
   * @returns {HTMLElement}
   */
  _createContinueElement() {
    const box = document.createElement('div');
    box.id = `${this.modeName}-continue`;
    box.className = 'game-continue';
    box.hidden = true;

    const btn = document.createElement('button');
    btn.id = `${this.modeName}-continue-btn`;
    btn.type = 'button';
    btn.className = 'btn';
    btn.dataset.translate = 'continue';
    btn.textContent = getTranslation('continue');
    btn.addEventListener('click', e => {
      e.preventDefault();
      this.continueAfterError();
    });

    box.appendChild(btn);
    return box;
  }

  /**
   * Finalise l'interface utilisateur
   */
  _finalizeUI(containerData) {
    containerData.card.appendChild(containerData.container);
    this.gameScreen.appendChild(containerData.card);
  }

  /**
   * Programme une action annulée par cleanup() (fin de partie, abandon)
   * @param {Function} callback
   * @param {number} delay
   * @returns {number}
   */
  addTimer(callback, delay) {
    const timer = setTimeout(() => {
      this.timers.delete(timer);
      callback();
    }, delay);
    this.timers.add(timer);
    return timer;
  }

  /**
   * Générer une nouvelle question
   */
  generateQuestion() {
    if (!this.state.isActive) return;

    try {
      this.hideContinueButton();

      // Utiliser la logique spécifique ou celle par défaut
      const questionOptions = this.getQuestionOptions();
      this.state.currentQuestion = generateQuestion(questionOptions);
      // Gabarit d'un énoncé : pour le retraduire et l'expliquer
      if (this.state.currentQuestion?.type === 'problem') {
        this.state.currentQuestion.templateIndex = findProblemTemplateIndex(
          this.state.currentQuestion
        );
      }

      this.displayQuestion();
      this.onQuestionGenerated();
    } catch (error) {
      console.error(`❌ Erreur lors de la génération de question:`, error);
      this.handleError(error);
    }
  }

  /**
   * Texte affiché d'une question : un énoncé garde chaque nombre collé à son nom
   * (« 9 sauts ») grâce aux espaces insécables.
   * @param {Object} question
   * @returns {string}
   */
  getQuestionText(question) {
    const text = String(question?.question ?? '');
    return question?.type === 'problem' ? keepNumbersTogether(text) : text;
  }

  /**
   * Afficher la question courante
   */
  displayQuestion() {
    if (!this.state.currentQuestion || !this.questionElement) return;

    // Afficher la question
    this.questionElement.textContent = this.getQuestionText(this.state.currentQuestion);

    // Générer les options
    this.displayOptions();

    // Réinitialiser le feedback
    if (this.feedbackElement) {
      this.feedbackElement.textContent = '';
    }
  }

  /**
   * Afficher les options de réponse
   */
  displayOptions() {
    if (!this.optionsElement || !this.state.currentQuestion) return;

    this.optionsElement.textContent = '';

    const options = this.generateOptions();

    options.forEach(option => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'option';
      // Appliquer style spécifique par mode si nécessaire (ex: adventure)
      if (this.modeName === 'adventure') {
        button.classList.add('option-btn');
      }
      button.dataset.value = option.value;
      button.textContent = option.display;
      button.onclick = () => this.handleAnswer(option.value);

      // Ajouter support clavier
      button.setAttribute('tabindex', '0');
      button.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleAnswer(option.value);
        }
      });

      this.optionsElement.appendChild(button);
    });

    // Ajouter navigation clavier
    this.addKeyboardNavigation();
  }

  /**
   * Traiter une réponse utilisateur
   */
  handleAnswer(userAnswer) {
    if (!this.state.isActive || !this.state.currentQuestion) return;
    // Une réponse par question : l'explication en cours attend « Continuer »
    if (this._continuePending) return;

    // Désactiver les boutons
    this.disableOptions();

    const isCorrect = userAnswer === this.state.currentQuestion.answer;

    // Mettre à jour les statistiques
    this.updateStats(isCorrect);

    // Enregistrer la réponse (une seule fois : les modes ne la réenregistrent pas)
    this.recordAnswer(isCorrect);

    // Afficher le feedback
    this.showAnswerFeedback(isCorrect, userAnswer);

    // Logique spécifique
    this.onAnswerSubmitted(isCorrect, userAnswer);

    // Progression automatique, sauf si l'explication attend l'enfant ou si la fin
    // du niveau est déjà programmée
    if (this.config.autoProgress && !this._continuePending && !this._holdProgress) {
      this.scheduleNextQuestion();
    }
  }

  /**
   * Mettre à jour les statistiques
   */
  updateStats(isCorrect) {
    this.state.questionCount++;

    if (isCorrect) {
      this.state.correctAnswers++;
      this.state.streak++;
      try {
        gameState.streak = this.state.streak;
      } catch {
        // Ignore gameState update errors
      }

      try {
        const userData = UserState.getCurrentUserData();
        const currentBest = Number(userData.bestStreak) || 0;
        if (this.state.streak > currentBest) {
          userData.bestStreak = this.state.streak;
          UserState.updateUserData(userData);
        }
      } catch {
        // Ignore gameState update errors
      }

      // Calcul du score
      const points = this.calculatePoints();
      this.state.score += points;
    } else {
      this.state.streak = 0;
      try {
        gameState.streak = 0;
      } catch {
        // Ignore gameState update errors
      }

      // Gestion des vies
      if (this.config.hasLives && this.state.lives > 0) {
        this.state.lives--;
      }
    }

    // Mettre à jour l'affichage
    this.updateInfoBar();
  }

  /**
   * Calculer les points pour une réponse correcte
   */
  calculatePoints() {
    let points = 10; // Points de base

    // Bonus de série
    if (this.state.streak >= 5) points = 20;
    else if (this.state.streak >= 3) points = 15;

    return points;
  }

  /**
   * Afficher le feedback de réponse
   */
  showAnswerFeedback(isCorrect) {
    if (!this.feedbackElement) return;

    const correctAnswer = this.state.currentQuestion.answer;

    if (isCorrect) {
      // Effet sonore de réussite
      try {
        AudioManager.playSound('good');
      } catch {
        // Ignore gameState update errors
      }
      const points = this.calculatePoints();
      const message =
        this.state.streak >= 3
          ? getTranslation('feedback_correct_streak', { points, streak: this.state.streak })
          : getTranslation('feedback_correct', { points });

      showFeedback(this.feedbackElement.id, message, 'success', true);
    } else {
      // Effet sonore d'erreur
      try {
        AudioManager.playSound('bad');
      } catch {
        // Ignore gameState update errors
      }
      const message = getTranslation('feedback_incorrect', { correctAnswer });
      showFeedback(this.feedbackElement.id, message, 'error', true);
    }
  }

  /**
   * Explication calme d'une erreur dans la zone de retour : « Presque ! », la bonne
   * réponse, puis ce que fait l'opération.
   * @returns {{lead: string, message: string}|null} Textes à lire à voix haute
   */
  showErrorExplanation() {
    const question = this.state.currentQuestion;
    if (!this.feedbackElement || !question) return null;

    const lead = getTranslation('incorrect');
    const { message, hint, countBy, facts } = buildErrorExplanation(question);

    // L'explication remplace un éventuel état « réussite » précédent
    for (const cls of Array.from(this.feedbackElement.classList)) {
      if (cls.startsWith('feedback-')) this.feedbackElement.classList.remove(cls);
    }
    setSafeComplexFeedback(this.feedbackElement, message, hint, '', { lead, countBy, facts });
    return { lead, message };
  }

  /**
   * Affiche « Continuer » et suspend l'avance jusqu'à ce que l'enfant l'active.
   * Le focus y est placé après l'événement clavier en cours, pour qu'Entrée
   * sur une réponse ne valide pas aussitôt l'explication.
   */
  showContinueButton() {
    const box = this.continueElement;
    const btn = box?.querySelector('button');
    if (!box || !btn) return;

    this._continuePending = true;
    btn.textContent = getTranslation('continue');
    if (this.feedbackElement?.id) {
      btn.setAttribute('aria-describedby', this.feedbackElement.id);
    }
    box.hidden = false;

    this.addTimer(() => {
      if (!this._continuePending) return;
      btn.focus({ preventScroll: true });
      box.scrollIntoView?.({ behavior: preferredScrollBehavior(), block: 'nearest' });
    }, 0);
  }

  /**
   * Masque « Continuer » (nouvelle question, fin de partie)
   */
  hideContinueButton() {
    this._continuePending = false;
    if (this.continueElement) this.continueElement.hidden = true;
  }

  /**
   * Passe à la suite après une erreur. Idempotent : Entrée déclenche aujourd'hui
   * deux clics, qui enregistraient deux fois le résultat final.
   */
  continueAfterError() {
    if (!this._continuePending) return;
    this.hideContinueButton();

    if (this.shouldContinue()) {
      this.generateQuestion();
    } else {
      this.finish();
    }
  }

  /**
   * Programmer la prochaine question
   */
  scheduleNextQuestion() {
    const delay = 1200; // Délai standard

    this.addTimer(() => {
      if (this.shouldContinue()) {
        this.generateQuestion();
      } else {
        this.finish();
      }
    }, delay);
  }

  /**
   * Vérifier si le jeu doit continuer
   */
  shouldContinue() {
    // Limite de questions atteinte
    if (this.state.questionCount >= this.config.maxQuestions) {
      return false;
    }

    // Vies épuisées
    if (this.config.hasLives && this.state.lives <= 0) {
      return false;
    }

    // Temps écoulé
    if (this.config.hasTimer && this.state.timeLeft <= 0) {
      return false;
    }

    return true;
  }

  /**
   * Terminer le mode de jeu
   */
  finish() {
    this.state.isActive = false;

    // Sauvegarder les résultats
    this.saveResults();

    // Nettoyer les ressources avant d'afficher les résultats
    this.cleanup();

    // Afficher les résultats
    this.showResults();

    // Logique spécifique de fin
    this.onFinish();
  }

  /**
   * Nettoyer les ressources
   */
  cleanup() {
    // Nettoyer les timers
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();

    // Nettoyer les intervalles
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();

    this._continuePending = false;
  }

  /**
   * Mettre à jour la barre d'information
   */
  updateInfoBar() {
    const data = this.getInfoBarData();
    if (!data) return;
    _updateInfoBar(data, this.modeName);
  }

  /**
   * Obtenir les données pour la barre d'information
   */
  getInfoBarData() {
    const data = {};

    if (this.config.showScore) data.score = this.state.score;
    if (this.config.hasStreaks) data.streak = this.state.streak;
    if (this.config.hasTimer) data.time = this.state.timeLeft;
    if (this.config.hasLives) data.lives = this.state.lives;

    return data;
  }

  /**
   * Désactiver les options de réponse
   */
  disableOptions() {
    if (this.optionsElement) {
      this.optionsElement.querySelectorAll('.option').forEach(btn => {
        btn.disabled = true;
      });
    }
  }

  /**
   * Gestion d'erreur
   */
  handleError(error) {
    console.error(`❌ Erreur dans ${this.modeName}:`, error);

    if (this.feedbackElement) {
      this.feedbackElement.textContent = getTranslation('game_error');
    }

    // Retour au menu après une erreur
    setTimeout(() => {
      goToSlide(1);
    }, 2000);
  }

  // ======================================
  // CHANGEMENT DE LANGUE
  // ======================================

  /**
   * Retraduit la partie en cours (appelé par bootstrap.js au changement de langue).
   * Titres, noms de régions, libellés et boutons portent data-translate et sont déjà
   * retraduits ; restent l'énoncé, les réponses en toutes lettres, les vies et
   * l'explication affichée.
   */
  refreshTexts() {
    if (!this.gameScreen?.isConnected) return;
    this.updateInfoBar();
    this.refreshQuestionText();
    this.relabelOptions();
    if (this._continuePending) this.showErrorExplanation();
  }

  /**
   * Énoncé de problème : même gabarit, dans la nouvelle langue
   */
  refreshQuestionText() {
    const question = this.state.currentQuestion;
    if (question?.type !== 'problem' || !this.questionElement) return;
    const template = problemTemplates(question.operator)[question.templateIndex];
    if (typeof template !== 'string') return;
    question.question = fillTemplate(template, problemParams(question));
    this.questionElement.textContent = this.getQuestionText(question);
  }

  /**
   * Réponses écrites en mots (Vrai, Faux, nombres en lettres) dans la nouvelle langue.
   * Seul le nœud texte change : la coche d'une réponse juste reste en place.
   */
  relabelOptions() {
    if (!this.optionsElement) return;
    for (const button of this.optionsElement.querySelectorAll('.option')) {
      const value = button.dataset.value;
      let label = null;
      if (value === 'true' || value === 'false') {
        label = getTranslation(value);
      } else if (button.classList.contains('is-word') && /^\d+$/.test(String(value))) {
        label = numberInWords(Number(value));
      }
      const textNode = [...button.childNodes].find(node => node.nodeType === 3);
      if (label !== null && textNode) textNode.textContent = label;
    }
  }

  // ======================================
  // MÉTHODES À IMPLÉMENTER PAR LES SOUS-CLASSES
  // ======================================

  /**
   * Logique spécifique de démarrage (à surcharger)
   */
  async onStart() {
    // Démarrer la première question par défaut
    this.generateQuestion();
  }

  /**
   * Logique spécifique d'arrêt (à surcharger)
   */
  onStop() {
    // Implémentation par défaut vide
  }

  /**
   * HTML personnalisé pour le mode (à surcharger)
   */
  async getCustomHTML() {
    return ''; // Pas de HTML supplémentaire par défaut
  }

  /**
   * Options pour la génération de questions (à surcharger)
   */
  getQuestionOptions() {
    return {
      type: 'auto',
      minTable: 1,
      maxTable: 10,
      minNum: 1,
      maxNum: 10,
    };
  }

  /**
   * Réponses proposées : Vrai/Faux, ou la bonne réponse et trois voisines plausibles.
   * En QCM de multiplication ou de division, une fois sur cinq, les nombres
   * s'écrivent en lettres.
   */
  generateOptions() {
    const question = this.state.currentQuestion;

    if (question.type === 'true_false') {
      return [
        { value: true, display: getTranslation('true') },
        { value: false, display: getTranslation('false') },
      ];
    }

    const useWords =
      question.type === 'mcq' && ['×', '÷'].includes(question.operator) && Math.random() < 0.2; // NOSONAR - Safe: educational game randomization

    return buildAnswerOptions(question).map(value => ({
      value,
      display: useWords ? numberInWords(value) : String(value),
    }));
  }

  /**
   * Enregistrer une réponse (à surcharger pour logique spécifique)
   */
  recordAnswer(isCorrect) {
    const question = this.state.currentQuestion;

    // Support nouveau format (operator, a, b) et ancien (table, num)
    const operator = question.operator || '×';
    const a = question.a ?? question.table;
    const b = question.b ?? question.num;

    // Enregistrement stats multi-opérations
    try {
      recordOperationResult(operator, a, b, isCorrect);
    } catch {
      /* no-op: stats optional */
    }
  }

  /**
   * Ajouter navigation clavier (à surcharger si nécessaire)
   */
  addKeyboardNavigation() {
    // Une seule navigation par flèches à la fois : retirer celle de la question précédente
    if (typeof this._removeArrowNavigation === 'function') this._removeArrowNavigation();
    this._removeArrowNavigation = null;
    if (_addArrowKeyNavigation && this.optionsElement) {
      this._removeArrowNavigation = _addArrowKeyNavigation(this.optionsElement, '.option');
    }
  }

  /**
   * Lit la question à voix haute sans jamais donner la réponse
   * @param {string} [displayed] - Texte affiché, s'il diffère de l'énoncé généré
   */
  speakQuestion(displayed) {
    const current = this.state.currentQuestion;
    if (!current) return;
    const { operator, a, b, type, question } = current;

    if (type === 'true_false') {
      // Lire exactement l'énoncé affiché (ex: "8 × 6 = 47")
      speak(toSpokenForm(question));
    } else if (type === 'gap') {
      // Pour "2 × ? = 18", ne dire que la partie connue
      speak(`${a} ${spokenOperator(operator)}`);
    } else {
      // Pour classic, mcq, problem: lire l'énoncé sans donner la réponse
      const text = displayed || (question ? String(question) : `${a} ${operator} ${b} = ?`);
      speak(toSpokenForm(text));
    }
  }

  /**
   * Callback après génération de question (à surcharger)
   */
  onQuestionGenerated() {
    // Implémentation par défaut vide
  }

  /**
   * Callback après soumission de réponse (à surcharger)
   */
  onAnswerSubmitted() {
    // Implémentation par défaut vide
  }

  /**
   * Sauvegarder les résultats (à surcharger)
   */
  saveResults() {
    // Abstract method - override in subclass to save game results
  }

  /**
   * Afficher les résultats (à surcharger)
   */
  showResults() {
    goToSlide(5); // Slide de résultats par défaut
  }

  /**
   * Callback de fin de jeu (à surcharger)
   */
  onFinish() {
    // Implémentation par défaut vide
  }
}

// Export ES6 complet
export default GameMode;
