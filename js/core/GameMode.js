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
 */

import {
  speak,
  getTranslation,
  showFeedback,
  updateInfoBar as _updateInfoBar,
  addArrowKeyNavigation as _addArrowKeyNavigation,
} from '../utils-es6.js';
import { recordOperationResult } from './operation-stats.js';
import { recordModeAnswer, ANSWER_MODES } from './mode-stats.js';
import { UserState } from './userState.js';
import { goToSlide } from '../slides.js';
import { setActiveMode, clearActiveMode } from '../game-exit.js';
import { cancelSpeech, preloadSpeech, whenSpeechEnds } from '../speech.js';
import { AudioManager } from './audio.js';
import { InfoBar } from '../components/infoBar.js';
import { generateQuestion } from '../questionGenerator.js';
import { gameState } from '../game.js';
import { getTranslations, getCurrentLanguage } from '../i18n-store.js';
import { formatMessage } from './message-format.js';
import { setSafeComplexFeedback } from '../security-utils.js';
import {
  toSpokenForm,
  toSpokenQuestion,
  toSpokenShortQuestion,
  toSpokenGapQuestion,
  preferredScrollBehavior,
  keepNumbersTogether,
  isSentenceQuestion,
} from '../ui-feedback.js';
import { chance } from './random.js';
import { AVATAR_IDS } from './avatars.js';
import { coinsToNextAvatar } from './avatar-shop.js';
import {
  rewardsSnapshot,
  rewardsSince,
  holdRewardAnnouncements,
  takeRewardNotes,
  releaseRewardAnnouncements,
} from './session-rewards.js';
import { buildAnswerOptions, operandsOf } from './wrong-answers.js';

// Mauvaises réponses plausibles : dans wrong-answers.js, que l'Arcade importe sans tout ce module
export { plausibleWrongAnswers, buildAnswerOptions } from './wrong-answers.js';
import { divisibilityFacts, divisibilityStatement } from './divisibility.js';

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
 * Remplit un gabarit comme le fait translate() : paramètres et accord au pluriel,
 * dans la langue active
 * @param {string} template
 * @param {Object} params
 * @returns {string}
 */
function fillTemplate(template, params) {
  return formatMessage(template, params, getCurrentLanguage());
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
  // Le paramètre peut porter un pluriel : « {table} » ou « {table, plural, … } »
  const tablePos = template.search(/\{\s*table\s*[,}]/);
  const numPos = template.search(/\{\s*num\s*[,}]/);
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
      return b === 0 ? Number.NaN : a / b;
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
// Ce que chaque opération sait montrer : un comptage, un indice, une vérification
const DETAILS_BY_OPERATOR = {
  '×': ({ question, a, b }) => {
    const { countBy, table } = multiplicationCount(question, a, b);
    return { countBy, hint: translateOrEmpty(`mnemonic_${table}`), fact: null };
  },
  '+': ({ a, b, operationHint }) => ({
    countBy: additionCount(a, b),
    hint: operationHint,
    fact: null,
  }),
  '−': ({ question, operator, a, b, result, operationHint }) => {
    const countBy = subtractionCount(a, b);
    return {
      countBy,
      hint: operationHint,
      fact: countBy ? null : checkFact(question, operator, a, b, result),
    };
  },
};

function operationDetails(question, operator, a, b, result) {
  const operationHint = translateOrEmpty(OPERATION_HINT_KEYS[operator] ?? '');

  // Nombre manquant : l'enfant cherche un facteur, pas un résultat
  if (question.type === 'gap') {
    return {
      countBy: null,
      hint: operator === '×' ? translateOrEmpty(`mnemonic_${a}`) : operationHint,
      fact: checkFact(question, operator, a, b, result),
    };
  }

  const build = DETAILS_BY_OPERATOR[operator];
  if (build) return build({ question, operator, a, b, result, operationHint });
  return { countBy: null, hint: operationHint, fact: checkFact(question, operator, a, b, result) };
}

/**
 * Ce qui se dit après une bonne réponse : le nombre trouvé, puis un bravo (« Oui, 42 ! »,
 * « Super ! »). Deux parties, deux clips : les bravos restent indépendants des nombres.
 * Entendre le résultat le fixe, comme après une erreur. Vrai/Faux et divisibilité n'ont pas
 * de nombre à dire : le bravo seul.
 * Le bravo peut manquer (praise: false) : dit après chaque bonne réponse, il lassait ; les
 * modes le gardent pour les paliers d'une série (config.praiseEvery).
 * @param {Object} question - Question courante
 * @param {Object} [options]
 * @param {boolean} [options.praise=true] - Le bravo suit-il le nombre ?
 * @returns {string[]} Parties à dire l'une après l'autre (speak les tient pour une phrase) ;
 *   vide quand il n'y a ni nombre ni bravo à dire
 */
export function correctAnswerParts(question, { praise = true } = {}) {
  const bravo = praise ? [getTranslation('correct')] : [];
  const hasNumber = !['true_false', 'divisibility'].includes(question?.type);
  if (!hasNumber || !Number.isFinite(Number(question?.answer))) return bravo;
  return [getTranslation('feedback_correct_spoken', { answer: question.answer }), ...bravo];
}

/**
 * Explication d'une erreur (principe « Comprendre avant de réciter ») : la bonne réponse,
 * le vrai résultat d'une question Vrai/Faux, ce que fait l'opération (comptage ou
 * vérification) et une astuce.
 * @param {Object} question - Question courante
 * @returns {{message: string, hint: string, countBy: Object|null, facts: Array<{label: string, equation: string}>}}
 */
export function buildErrorExplanation(question) {
  if (question.type === 'divisibility') return divisibilityExplanation(question);
  const operator = question.operator || '×';
  const { a, b } = operandsOf(question);
  const result = computeResult(operator, a, b);
  const isTrueFalse = question.type === 'true_false';

  const message = isTrueFalse
    ? trueFalseMessage(question)
    : getTranslation('feedback_incorrect', { correctAnswer: question.answer });

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

/** « La bonne réponse est Vrai. » ou « … Faux. » */
function trueFalseMessage(question) {
  return getTranslation(
    question.answer === true ? 'incorrect_answer_was_true' : 'incorrect_answer_was_false'
  );
}

/**
 * Divisibilité : ce qu'on regarde (dernier chiffre, somme des chiffres) et le critère du
 * diviseur, jamais le quotient (« 2213 ÷ 3 » ne tombe pas juste)
 * @param {Object} question - { a: nombre, b: diviseur, answer }
 */
function divisibilityExplanation(question) {
  const { a: number, b: divisor } = operandsOf(question);
  const facts = divisibilityFacts(number, divisor).map(({ labelKey, equation }) => ({
    label: translateOrEmpty(labelKey),
    equation,
  }));
  const hint = keepNumbersTogether(translateOrEmpty(`division_tip_${divisor}`));
  return { message: trueFalseMessage(question), hint, countBy: null, facts };
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
 * Durée audible du bip de bonne réponse (son « good ») : le « Bravo » part juste après
 * lui, jamais par-dessus, sans attendre la fin du fichier.
 */
export const GOOD_SOUND_MS = 200;

/**
 * Après la pause d'une erreur, attente au plus de la fin de l'explication avant la question
 * suivante : filet de sécurité si la fin n'était jamais signalée (la file borne déjà chaque
 * phrase d'après son texte)
 */
export const EXPLANATION_WAIT_MAX_MS = 6000;

/**
 * Phrase d'une question dans la langue active, ou null si elle n'en a pas (un calcul)
 * @param {Object} question
 * @returns {string|null}
 */
function retranslatedQuestion(question) {
  if (question.type === 'divisibility') {
    return divisibilityStatement(question.a, question.b, getTranslation);
  }
  if (question.type !== 'problem') return null;
  const template = problemTemplates(question.operator)[question.templateIndex];
  return typeof template === 'string' ? fillTemplate(template, problemParams(question)) : null;
}

/** Table d'une question pour « À revoir » au tableau de bord : en multiplication seulement */
function reviewTableOf(question, operator) {
  return operator === '×' ? (question.table ?? question.a) : null;
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
      // Enchaînement automatique : une erreur laisse le temps de lire la bonne réponse
      nextQuestionDelay: 1200,
      wrongAnswerDelay: 2400,
      showScore: true,
      announceOnStart: true,
      // Une bonne réponse dit le nombre trouvé avant le bravo (Quiz, Aventure). Les modes
      // chronométrés gardent le bravo seul, ou rien : le nombre les ralentirait
      saysCorrectAnswer: false,
      // Le bravo suit le nombre toutes les praiseEvery bonnes réponses de suite (1 : à chacune)
      praiseEvery: 1,
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
      // Navigation vers l'écran de jeu, attendue : elle arrête l'ancien mode, et cet arrêt
      // couperait l'annonce du nouveau s'il arrivait après elle
      await goToSlide(4);
      gameState.gameMode = this.modeName;
      // Règle de sortie (game-exit.js) : ce mode dit si une partie est en cours
      setActiveMode(this);

      // Réinitialiser l'état
      this.resetState();

      // Annonce vocale, désactivable : une course relancée aussitôt (« Rejouer » du Chrono)
      // ne fait pas attendre sa première question derrière l'annonce
      if (this.config.announceOnStart !== false) {
        const translationKey = this.modeName + '_mode';
        const translatedText = getTranslation(translationKey);
        speak(translatedText, { priority: 'high' });
      }

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
    clearActiveMode(this);

    // Arrêter la voix et les sons en cours
    cancelSpeech();
    if (AudioManager && typeof AudioManager.stopAll === 'function') {
      AudioManager.stopAll();
    }

    // Nettoyer les timers et intervalles
    this.cleanup();

    // Partie quittée avant son écran de fin : ses gains s'annoncent maintenant
    releaseRewardAnnouncements();

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
    this._queueNextQuestionSpeech = false;
    // Tableau de bord : la partie compte dès sa première réponse ; son bilan s'enregistre une fois
    this._statsGameCounted = false;
    this._statsOperator = null;
    this._resultsSaved = false;
    this._countedQuestion = null;
    // Pièces et badges au départ : l'écran de fin dit ce que la partie y a ajouté, et d'ici
    // là aucune bulle de gain ne se pose sur le jeu
    this._rewardsStart = rewardsSnapshot();
    holdRewardAnnouncements();

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

    // Titre de niveau 1 de l'écran de jeu (un par écran), à la taille d'un titre de carte
    const title = document.createElement('h1');
    title.className = 'screen-title';
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
   * Ordre de lecture : question, réponses, retour, « Continuer », puis les actions de la
   * partie (« Abandonner »), discrètes. L'enveloppe du contenu personnalisé, vidée, disparaît.
   * @param {string} selector - Bloc d'actions, cherché dans la zone de jeu
   */
  placeActionsAfterAnswers(selector) {
    const container = this.feedbackElement?.parentElement;
    const actions = container?.querySelector(selector);
    if (!container || !actions) return;

    const customWrap = actions.parentElement;
    container.appendChild(actions);
    if (customWrap && customWrap !== container && customWrap.children.length === 0) {
      customWrap.remove();
    }
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
   * Texte affiché d'une question : une phrase garde chaque nombre collé à son nom
   * (« 9 sauts ») grâce aux espaces insécables.
   * @param {Object} question
   * @returns {string}
   */
  getQuestionText(question) {
    const text = String(question?.question ?? '');
    return isSentenceQuestion(question) ? keepNumbersTogether(text) : text;
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
      // Lecteur d'écran : la réponse qui reçoit le focus est lue avec sa question, sans
      // annonce de plus par-dessus la voix du jeu
      if (this.questionElement?.id) {
        button.setAttribute('aria-describedby', this.questionElement.id);
      }
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

    // L'enfant a répondu : la question en cours de lecture s'arrête, aucune phrase en
    // attente ne part après (même un clip encore en chargement)
    cancelSpeech();

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

    // Partie jouée jusqu'au bout : son bilan s'enregistre tout de suite, l'écran de fin
    // peut attendre. Quitter pendant l'animation (Accueil, changement de joueur) ne la perd plus
    if (!this.shouldContinue()) this.saveResultsOnce();

    // Progression automatique, sauf si l'explication attend l'enfant ou si la fin
    // du niveau est déjà programmée
    if (this.config.autoProgress && !this._continuePending && !this._holdProgress) {
      this.scheduleNextQuestion(isCorrect);
    }
  }

  /**
   * Mettre à jour les statistiques
   */
  updateStats(isCorrect) {
    this.state.questionCount++;
    // La série compte désormais cette question (voir praiseDue)
    this._countedQuestion = this.state.currentQuestion;

    if (isCorrect) {
      this.state.correctAnswers++;
      this.state.streak++;
      try {
        gameState.streak = this.state.streak;
      } catch {
        // Ignore gameState update errors
      }

      // Meilleure série du tableau de bord, tous modes à questions confondus (Chrono compris,
      // comme pour « Questions » : hasStreaks ne règle que la barre d'infos)
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
   * Explication calme d'une erreur dans la zone de retour : « Raté ! », la bonne
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
   * Phrase dite après une erreur sur la question en cours : « Raté ! », puis la bonne
   * réponse (l'explication affichée par showErrorExplanation)
   * @returns {string|null}
   */
  spokenErrorText() {
    const question = this.state.currentQuestion;
    if (!question) return null;
    return `${getTranslation('incorrect')} ${buildErrorExplanation(question).message}`;
  }

  /**
   * Parties dites après une bonne réponse à la question en cours (correctAnswerParts). Le
   * bravo est tiré une seule fois par question : ce qui est chargé d'avance est ce qui sera
   * dit. Rien dans un mode qui ne dit pas le nombre (config.saysCorrectAnswer) : il n'a alors
   * rien à charger d'avance.
   * @returns {string[]|null}
   */
  spokenCorrectParts() {
    const question = this.state.currentQuestion;
    if (!question || !this.config.saysCorrectAnswer) return null;
    if (this._correctSpeech?.question !== question) {
      const parts = correctAnswerParts(question, { praise: this.praiseDue(question) });
      this._correctSpeech = { question, parts };
    }
    return this._correctSpeech.parts;
  }

  /**
   * Une bonne réponse à cette question mérite-t-elle un bravo ? Oui aux paliers de la série
   * (config.praiseEvery : 3, 6, 9… de suite). Avant la réponse, la série compte une bonne
   * réponse de plus : la phrase se prépare pendant que la question est lue.
   * @param {Object} question
   * @returns {boolean}
   */
  praiseDue(question) {
    const every = this.config.praiseEvery;
    if (!(every > 1)) return true;
    const reached = this._countedQuestion === question ? this.state.streak : this.state.streak + 1;
    return reached > 0 && reached % every === 0;
  }

  /**
   * Ce que la partie a rapporté, pour son écran de fin : pièces et badges gagnés depuis son
   * départ, phrases en plus (défi du jour terminé) et pièces qui manquent pour un avatar.
   * L'écran de fin prend ainsi la suite des bulles retenues pendant la partie.
   * @returns {{coins: number, badges: string[], notes: string[], coinsToAvatar: number|null}}
   */
  sessionRewards() {
    return {
      ...rewardsSince(this._rewardsStart),
      notes: takeRewardNotes(),
      coinsToAvatar: coinsToNextAvatar(UserState.getCurrentUserData(), AVATAR_IDS),
    };
  }

  /**
   * Bouton « Voir mes badges » d'un écran de fin, quand la partie en a rapporté un
   * @param {string[]} [badges] - Badges gagnés pendant la partie
   * @returns {Object[]} Zéro ou un bouton, à ajouter à ceux de l'écran (createResultsActions)
   */
  badgesButtons(badges = []) {
    if (badges.length === 0) return [];
    return [
      {
        label: getTranslation('results_see_badges'),
        action: 'results-see-badges',
        onActivate: () => void goToSlide(7),
      },
    ];
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
    // « Continuer » coupe la fin de l'explication
    cancelSpeech();

    if (this.shouldContinue()) {
      this.generateQuestion();
    } else {
      this.finish();
    }
  }

  /**
   * Programmer la prochaine question. Une erreur tient plus longtemps à l'écran :
   * la bonne réponse vient d'être marquée, elle doit être lue avant de disparaître.
   * @param {boolean} isCorrect - La réponse donnée était-elle juste
   */
  scheduleNextQuestion(isCorrect = true) {
    const delay = isCorrect ? this.config.nextQuestionDelay : this.config.wrongAnswerDelay;

    // La question suivante attend la fin de la phrase en cours (« Bravo », explication)
    // au lieu de la couper
    this._queueNextQuestionSpeech = true;

    // Les modes chronométrés suspendent leur décompte pendant la lecture de l'explication
    if (!isCorrect) this.onWrongAnswerPause();

    this.addTimer(() => {
      if (isCorrect) {
        this.nextQuestionOrFinish();
        return;
      }
      // Après une erreur, la bonne réponse se dit en entier : la question suivante attend
      // la fin de la phrase, puis le décompte repart
      this.afterExplanation(() => {
        this.onWrongAnswerResume();
        this.nextQuestionOrFinish();
      });
    }, delay);
  }

  /** Question suivante, ou fin de partie */
  nextQuestionOrFinish() {
    if (this.shouldContinue()) {
      this.generateQuestion();
    } else {
      this.finish();
    }
  }

  /**
   * Appelle next quand la parole s'est tue (whenSpeechEnds), au plus tard après
   * EXPLANATION_WAIT_MAX_MS, une seule fois, et seulement si la partie continue : une
   * sortie de mode entre-temps coupe la parole, ce qui tiendrait l'attente.
   * @param {() => void} next
   */
  afterExplanation(next) {
    let done = false;
    const go = () => {
      if (done || !this.state.isActive) return;
      done = true;
      next();
    };
    void whenSpeechEnds().then(go, go);
    this.addTimer(go, EXPLANATION_WAIT_MAX_MS);
  }

  /**
   * Pause de lecture après une erreur : un mode chronométré y arrête son décompte
   * (voir ChallengeMode), jusqu'à onWrongAnswerResume.
   */
  onWrongAnswerPause() {}

  /** Fin de la pause d'une erreur, juste avant la question suivante : le décompte repart */
  onWrongAnswerResume() {}

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

    // Sauvegarder les résultats (déjà fait à la dernière réponse si la partie est allée au bout)
    this.saveResultsOnce();

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
      void goToSlide(1);
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
   *
   * Asynchrone par contrat : certains modes reconstruisent leur écran (Découverte, Arcade,
   * écrans de départ et de temps du Chrono), les autres rendent une promesse déjà tenue.
   * @returns {Promise<void>}
   */
  async refreshTexts() {
    if (!this.gameScreen?.isConnected) return;
    this.updateInfoBar();
    this.refreshQuestionText();
    this.relabelOptions();
    if (this._continuePending) this.showErrorExplanation();
  }

  /**
   * Phrase de la question dans la nouvelle langue : même gabarit pour un énoncé, même
   * nombre et même diviseur pour une divisibilité
   */
  refreshQuestionText() {
    const question = this.state.currentQuestion;
    if (!question || !this.questionElement) return;
    const text = retranslatedQuestion(question);
    if (typeof text !== 'string') return;
    question.question = text;
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

    if (question.type === 'true_false' || question.type === 'divisibility') {
      return [
        { value: true, display: getTranslation('true') },
        { value: false, display: getTranslation('false') },
      ];
    }

    const useWords =
      question.type === 'mcq' && ['×', '÷'].includes(question.operator) && chance(0.2);

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

    // Enregistrement stats multi-opérations ; une divisibilité n'est pas un calcul
    // (« 2213 ÷ 3 » fausserait les stats de la division)
    try {
      if (question.type !== 'divisibility') recordOperationResult(operator, a, b, isCorrect);
    } catch {
      /* no-op: stats optional */
    }

    this.recordAnswerStats(isCorrect);
  }

  /**
   * Compteurs du tableau de bord (core/mode-stats.js) : la réponse, dans son mode et son
   * opération, et la fenêtre « À revoir » de sa table en multiplication. La première réponse
   * d'une partie la compte, même si elle est ensuite abandonnée.
   * @param {boolean} isCorrect
   */
  recordAnswerStats(isCorrect) {
    if (!ANSWER_MODES.includes(this.modeName)) return;
    const question = this.state.currentQuestion;
    const operator = question.operator || '×';
    const startsGame = this.countsGames() && !this._statsGameCounted;
    if (startsGame) {
      this._statsGameCounted = true;
      this._statsOperator = operator;
    }
    try {
      const userData = UserState.getCurrentUserData();
      recordModeAnswer(userData, {
        mode: this.modeName,
        operator,
        table: reviewTableOf(question, operator),
        isCorrect,
        startsGame,
      });
      UserState.updateUserData(userData);
    } catch {
      /* no-op: statistiques facultatives, le jeu continue */
    }
  }

  /**
   * Le mode compte-t-il ses parties au tableau de bord ? (Défi, course Chrono)
   * @returns {boolean}
   */
  countsGames() {
    return false;
  }

  /** Enregistre le bilan de la partie une seule fois : à la dernière réponse, sinon à la fin */
  saveResultsOnce() {
    if (this._resultsSaved) return;
    this._resultsSaved = true;
    this.saveResults();
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
   * Texte dit pour la question affichée, sans jamais donner la réponse
   * @param {string} [displayed] - Question telle qu'elle est affichée
   * @returns {string|null}
   */
  spokenQuestionText(displayed) {
    const current = this.state.currentQuestion;
    if (!current) return null;
    const { operator, a, b, type, question } = current;
    // Divisibilité : la phrase à juger, « 2213 est divisible par 3 »
    if (type === 'divisibility') return String(question);
    // Vrai/faux : l'égalité proposée telle quelle, « 8 fois 6 égale 47 »
    if (type === 'true_false') return toSpokenForm(question);
    // « 2 × ? = 18 » : « 2 fois combien égale 18 ? », sans la réponse
    if (type === 'gap') return toSpokenGapQuestion(question);
    // classic, mcq : « Combien font 7 fois 8 ? » à la première question de la partie, puis
    // « 7 fois 8 ? » : la formule répétée à chaque question lasse ; problem : l'énoncé tel quel
    const text = displayed || (question ? String(question) : `${a} ${operator} ${b} = ?`);
    return this.state.questionCount === 0 ? toSpokenQuestion(text) : toSpokenShortQuestion(text);
  }

  /**
   * Lit la question à voix haute. Après une réponse, elle attend la fin du « Bravo » ou
   * de l'explication (voir scheduleNextQuestion) ; sinon elle coupe la phrase en cours.
   * @param {string} [displayed] - Question telle qu'elle est affichée
   */
  speakQuestion(displayed) {
    const queued = this._queueNextQuestionSpeech === true;
    this._queueNextQuestionSpeech = false;
    const text = this.spokenQuestionText(displayed);
    if (!text) return;
    if (queued) speak(text, { queue: true });
    else speak(text);
    // Les phrases de la réponse (erreur, bonne réponse) se chargent d'avance (voix
    // enregistrée), après le démarrage de la question : dites dès la réponse, elles
    // n'attendent pas le réseau
    const answerTexts = [this.spokenErrorText(), ...(this.spokenCorrectParts() ?? [])];
    const toLoad = answerTexts.filter(Boolean);
    if (toLoad.length) preloadSpeech(toLoad);
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
    void goToSlide(5); // Slide de résultats par défaut
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
