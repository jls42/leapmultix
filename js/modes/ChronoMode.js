/**
 * Mode Chrono : dix bonnes réponses contre un chrono qui ne s’arrête pas, dans l’opération
 * choisie à l’accueil, en choisissant ou en tapant la réponse. En multiplication, sur les
 * tables des Paramètres ; en addition, soustraction et division, sur toutes les tables
 * (voir chrono-questions.js). Les calculs ratés vont dans « Mes calculs à revoir » de
 * l’opération, qu’une révision de dix questions fait travailler.
 */

import { GameMode } from '../core/GameMode.js';
import {
  getTranslation,
  playSound,
  showCoinGainAnimation,
  showMessage,
  updateCoinDisplay,
} from '../utils-es6.js';
import {
  markAnswerOptions,
  tagAnswerOptions,
  markQuestionKind,
  createResultsSummary,
  createResultsActions,
  createAvatarPortrait,
  mountResults,
  createCheckIcon,
  createCrossIcon,
  createTrashIcon,
  singleActivation,
} from '../ui-feedback.js';
import { createIcon } from '../components/icons.js';
import { goToSlide } from '../slides.js';
import { setGameMode } from '../mode-orchestrator.js';
import { UserState } from '../core/userState.js';
import { gameState, updateDailyChallengeProgress } from '../game.js';
import { classifyTypedAnswer } from '../core/chrono-input.js';
import {
  CHRONO_OPERATORS,
  chronoAnswer,
  chronoTables,
  factKeys,
  pickChronoFact,
  takeNextRevisionFact,
  includedTablesFromExclusions,
  isFullTableSet,
} from '../core/chrono-questions.js';
import { getOperation } from '../core/operations/OperationRegistry.js';
import { TablePreferences } from '../core/tablePreferences.js';
import { UserManager } from '../userManager.js';
import { getCurrentLanguage } from '../i18n-store.js';
import {
  normalizeChronoStats,
  normalizeChronoStatsByOperator,
  findBucket,
  sessionAverageMs,
  saveChronoSession,
  chronoShouldContinue,
  CHRONO_GOAL,
  removeFromBasket,
  emptyBasket,
  addManualBasketFact,
  grantChronoCoins,
  listPlayedChronoBuckets,
  parseBucketKey,
  tablesListLabel,
  uniqueTables,
  rankedSessions,
  recentSessions,
  formatDuration,
  formatSessionDate,
  niceDurationMaxMs,
  formatAxisSeconds,
  CHRONO_AXIS_TICKS,
  lastChronoInputMode,
  setLastChronoInputMode,
  startRevisionTally,
  tallyRevisionAnswer,
  applyRevisionTally,
} from '../core/chrono-stats.js';

const FEEDBACK_MS = 800;
const BAD_SOUND_VOLUME = 0.35;
const ALL_TABLES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// Ajout à la main d’un calcul : en multiplication et en addition seulement (deux nombres de
// 1 à 10) ; en soustraction et en division, seules les erreurs remplissent la liste
const MANUAL_ADD_OPERATORS = new Set(['×', '+']);
// Phrase de la course hors multiplication : l’opération, sur toutes les tables
const RACE_HINT_KEYS = Object.freeze({
  '+': 'chrono_race_hint_addition',
  '−': 'chrono_race_hint_subtraction',
  '÷': 'chrono_race_hint_division',
});
// Case de réponse vide en « Je tape » : le « ? » de la question (« 8 × 6 = ? »)
const TYPED_PLACEHOLDER = '?';

/**
 * Horloge des durées : monotone, elle ne recule pas quand l'heure de l'appareil change
 * (synchronisation, réglage à la main). Date.now() ne sert qu'à dater une partie.
 */
function clockNow() {
  return performance.now();
}

/**
 * Profil et réserve de l’opération : `chronoStats` pour la multiplication, au format publié,
 * `chronoStatsByOperator[op]` pour les autres. La façon de répondre retenue reste dans
 * `chronoStats`, commune aux quatre opérations.
 * @param {string} [operator]
 */
function loadChronoStore(operator = '×') {
  const userData = UserState.getCurrentUserData();
  userData.chronoStats = normalizeChronoStats(userData.chronoStats);
  if (operator === '×') return { userData, store: userData.chronoStats };
  userData.chronoStatsByOperator = normalizeChronoStatsByOperator(userData.chronoStatsByOperator);
  const stores = new Map(Object.entries(userData.chronoStatsByOperator));
  return { userData, store: stores.get(operator) };
}

/** Opération choisie à l’accueil, multiplication par défaut */
function currentOperator() {
  const operator = UserState.getCurrentUserData()?.preferredOperator;
  return CHRONO_OPERATORS.includes(operator) ? operator : '×';
}

/** « 7 × 8 », « 15 − 7 » : le calcul tel qu’il est posé */
function factText(operator, a, b) {
  return `${a} ${operator} ${b}`;
}

function persistChronoStore(userData) {
  UserState.updateUserData(userData);
}

/**
 * Graphique « Mes dernières parties », en unités de son viewBox : graduations de 14, soit
 * environ 14 px sur un téléphone (le graphique y fait la largeur de la carte)
 */
const CURVE = Object.freeze({
  width: 340,
  height: 136,
  left: 64,
  right: 328,
  top: 10,
  bottom: 104,
  ticks: CHRONO_AXIS_TICKS,
  fontSize: 14,
});
// Au-delà de 10 parties, un numéro sur cinq sous la courbe : les autres se chevaucheraient
const GAME_NUMBERS_ALL_UP_TO = 10;
const GAME_NUMBER_STEP = 5;

/** Numéro écrit sous une partie : tous jusqu'à 10, sinon le premier, le dernier et un sur cinq */
function showsGameNumber(index, count) {
  if (count <= GAME_NUMBERS_ALL_UP_TO || index === 0 || index === count - 1) return true;
  // Un multiple de 5 juste avant le dernier le toucherait (16 parties : « 15 » et « 16 »)
  return (index + 1) % GAME_NUMBER_STEP === 0 && index < count - 2;
}

const SVG_NS = 'http://www.w3.org/2000/svg';

/** Un élément SVG et ses attributs */
function svgElement(name, attrs) {
  const element = document.createElementNS(SVG_NS, name);
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, String(value)));
  return element;
}

const THIN_LINE = Object.freeze({ 'stroke-width': '1' });

/** Un trait du graphique à l’encre du texte : grille, axes ou moyenne, selon son opacité */
function curveLine(x1, y1, x2, y2, opacity, style = THIN_LINE) {
  return svgElement('line', { x1, x2, y1, y2, stroke: 'currentColor', ...style, opacity });
}

/** Une graduation du graphique */
function curveLabel(x, y, text, placement) {
  const label = svgElement('text', {
    x,
    y,
    ...placement,
    fill: 'currentColor',
    'font-size': CURVE.fontSize,
  });
  label.textContent = text;
  return label;
}

// Code d'une touche de chiffre de la rangée du haut : « Digit2 ». Le pavé numérique donne son
// chiffre dans event.key, Verr. Num allumé ; éteint, ses touches déplacent le focus (Fin,
// flèches) pour la navigation clavier, et ne tapent rien
const DIGIT_KEY_CODE = /^Digit(\d)$/;

/**
 * Chiffre d’une touche, quelle que soit la disposition du clavier : en AZERTY, la rangée du
 * haut donne « é » pour 2 sans Maj, mais son code reste Digit2. Un raccourci (Ctrl, Alt,
 * Cmd) ne tape rien.
 * @param {KeyboardEvent} event
 * @returns {string|null}
 */
function typedDigit(event) {
  if (event.ctrlKey || event.metaKey || event.altKey) return null;
  if (/^\d$/.test(event.key)) return event.key;
  const match = DIGIT_KEY_CODE.exec(String(event.code));
  return match ? match[1] : null;
}

function formatClock(ms) {
  const totalSeconds = Math.floor(Math.max(0, Number(ms) || 0) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/** Un panneau de « Mes temps » sous son titre, où le focus va à l’ouverture */
function createStatsPanel(titleKey) {
  const panel = document.createElement('div');
  panel.className = 'chrono-setup-panel';
  panel.appendChild(translatedElement('h2', titleKey));
  return panel;
}

/** Texte sans paramètre : sa clé reste posée, la passe de traduction globale le relit */
function translatedElement(tag, key, className = '') {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.dataset.translate = key;
  element.textContent = getTranslation(key);
  return element;
}

function translatedButton(id, key, className) {
  const button = translatedElement('button', key, className);
  button.type = 'button';
  button.id = id;
  return button;
}

/** Un bloc de l’écran de départ, nommé par son titre (`chrono-race` → `#chrono-race-title`) */
function createSetupBlock(name, titleKey) {
  const section = document.createElement('section');
  section.className = `chrono-block ${name}`;
  section.setAttribute('aria-labelledby', `${name}-title`);
  const title = translatedElement('h3', titleKey);
  title.id = `${name}-title`;
  section.appendChild(title);
  return section;
}

/** Une section de l’écran de fin ou de « Mes temps » : son titre, sous un filet */
function createResultsSection(titleKey) {
  const section = document.createElement('section');
  section.className = 'chrono-block';
  section.appendChild(translatedElement('h3', titleKey));
  return section;
}

function createBlockActions(buttons) {
  const actions = document.createElement('div');
  actions.className = 'chrono-block-actions';
  buttons.forEach(button => actions.appendChild(button));
  return actions;
}

/**
 * Cible du focus (rendue, pas focalisée) après un ajout, « Tout effacer » ou le retrait du
 * dernier calcul : la ligne d’ajout
 */
function focusAddRow(screen) {
  return screen.querySelector('#chrono-add-a');
}

/**
 * Relance depuis les résultats, par l’orchestrateur comme le Quiz : le mode est marqué
 * « en démarrage », et la navigation vers l’écran de jeu ne l’arrête pas aussitôt. Sans
 * cela, la partie relancée tournait en arrière-plan, hors de portée de l’arrêt.
 * @param {{autoStart?: boolean}} [options] - autoStart : une course repart aussitôt ; sans
 *   lui, retour au menu de Chrono, où la liste à revoir est à jour
 */
function relaunchChrono(options = {}) {
  setGameMode('chrono', options).catch(err => {
    console.warn('setGameMode failed', err);
  });
}

export class ChronoMode extends GameMode {
  /**
   * @param {{autoStart?: boolean}} [options] - « Rejouer » : la course démarre sans
   *   repasser par le menu
   */
  constructor(options = {}) {
    // Pas de maxQuestions : la fin vient de shouldContinue (10 justes, ou 10 questions en
    // révision) ; une course se quitte à tout moment par « Abandonner »
    super('chrono', {
      hasLives: false,
      hasStreaks: false,
      autoProgress: true,
      pauseAfterError: false,
      showScore: false,
      // « Mode Chrono » à l’arrivée au menu, comme les autres modes ; pas sur « Rejouer » :
      // la course repart aussitôt et la première question passerait après l’annonce
      announceOnStart: options?.autoStart !== true,
    });
    // Hors de resetState : start() réinitialise l’état avant d’appeler onStart()
    this.launch = { autoStart: options?.autoStart === true };
    this.phase = 'setup';
    // L’opération est lue une fois, au lancement, comme l’Aventure
    this.operator = currentOperator();
    this.selectedTables = chronoTables(this.operator);
    this.inputMode = lastChronoInputMode(loadChronoStore().store);
    this.isRevision = false;
    this.revisionQueue = [];
    this.revisionBasket = [];
    this.revisionTally = new Map();
    this.revisionOutcome = null;
    this.sessionOutcome = null;
    this.sessionFacts = [];
    this.sessionStartedAt = 0;
    this.endedAt = null;
    this.questionStartedAt = 0;
    this.typedValue = '';
    this.elapsedMs = 0;
    this.timerInterval = null;
    this._abandoned = false;
    this.lastSnapshot = null;
    this.resultsPane = 'session';
    this.statsFocus = null;
    this._onKeyDown = event => this.onPhysicalKey(event);
  }

  resetState() {
    super.resetState();
    this.sessionFacts = [];
    this.typedValue = '';
    this.elapsedMs = 0;
    this.endedAt = null;
    this.revisionQueue = [];
    this.revisionBasket = [];
    this.revisionTally = new Map();
    this.revisionOutcome = null;
    this.sessionOutcome = null;
    this._abandoned = false;
  }

  async onStart() {
    this.phase = 'setup';
    this.isRevision = false;
    const launch = this.launch;
    this.launch = null;
    if (launch?.autoStart) await this.beginSession(false);
  }

  getInfoBarData() {
    if (this.phase !== 'playing') return null;
    // Une course compte les bonnes réponses, une révision ses questions : 10 dans les deux cas
    const done = this.isRevision ? this.state.questionCount : this.state.correctAnswers;
    return { time: formatClock(this.elapsedMs), progress: `${done}/${CHRONO_GOAL}` };
  }

  async getCustomHTML() {
    if (this.phase === 'setup') return this.buildSetupPanel();
    if (this.phase === 'stats-pick') return this.buildStatsPickPanel();
    if (this.phase === 'stats-detail') return this.buildStatsDetailPanel();
    const wrap = document.createElement('div');
    wrap.className = 'game-quit chrono-controls';
    wrap.appendChild(
      translatedButton('chrono-abandon', 'chrono_abandon', 'btn btn-quiet btn-danger')
    );
    return wrap;
  }

  async initializeUI() {
    await super.initializeUI();
    if (this.phase === 'setup') {
      this.bindSetupPanel();
      return;
    }
    if (this.phase === 'stats-pick') {
      this.bindStatsPickPanel();
      return;
    }
    if (this.phase === 'stats-detail') {
      this.bindStatsDetailPanel();
      return;
    }
    this.placeActionsAfterAnswers('.chrono-controls');
    this.setupGameControls();
  }

  /**
   * Changement de langue : les écrans de départ et de statistiques se reconstruisent (leurs
   * textes ont des paramètres) ; la partie suit GameMode ; les résultats se retraduisent
   * seuls (mountResults).
   */
  async refreshTexts() {
    if (!this.gameScreen?.isConnected) return;
    if (this.phase === 'playing') {
      await super.refreshTexts();
      return;
    }
    await this.initializeUI();
  }

  setupGameControls() {
    const abandonBtn = document.getElementById('chrono-abandon');
    if (abandonBtn) abandonBtn.onclick = singleActivation(() => this.confirmAbandon());
  }

  confirmAbandon() {
    if (!globalThis.confirm?.(this.abandonQuestion())) return;
    this.recordAbandon();
    this.stop();
    void goToSlide(1);
  }

  /** Partie en cours (game-exit.js) : une course ou une révision, jusqu'à sa dernière réponse */
  isGameInProgress() {
    return this.state.isActive && this.phase === 'playing' && !this._resultsSaved;
  }

  abandonQuestion() {
    return getTranslation('confirm_abandon_chrono');
  }

  /** Une partie abandonnée n'enregistre ni temps ni liste à revoir */
  recordAbandon() {
    this._abandoned = true;
  }

  /**
   * Écran de départ : deux blocs, chacun avec son bouton. La course se joue sur les tables
   * des Paramètres, la révision sur la liste des calculs à revoir ; « Je choisis / Je tape »
   * vaut pour les deux.
   */
  buildSetupPanel() {
    const { store } = loadChronoStore(this.operator);
    const panel = document.createElement('div');
    panel.className = 'chrono-setup-panel';
    panel.appendChild(this.buildInputPicker());
    panel.appendChild(this.buildRacePanel());
    panel.appendChild(this.buildBasketPanel(store));
    return panel;
  }

  /**
   * La course : 10 bonnes réponses contre le chrono, puis ses temps. Les tables se règlent
   * dans les Paramètres en multiplication seulement : ailleurs, la phrase dit l’opération et
   * que toutes les tables sont jouées.
   */
  buildRacePanel() {
    const section = createSetupBlock('chrono-race', 'chrono_race_title');
    section.appendChild(
      translatedElement('p', RACE_HINT_KEYS[this.operator] ?? 'chrono_race_hint')
    );
    section.appendChild(
      createBlockActions([
        translatedButton('chrono-start', 'chrono_start', 'btn btn-primary'),
        translatedButton('chrono-open-stats', 'chrono_stats_button', 'btn btn-secondary'),
      ])
    );
    // Mention secondaire après les boutons, comme le bonus du Défi
    if (this.operator === '×') {
      section.appendChild(translatedElement('p', 'chrono_tables_hint', 'chrono-tables-hint'));
    }
    return section;
  }

  /**
   * Comment l’enfant répond, pour la course comme pour la révision : un titre de section et
   * deux tuiles, comme le choix de la difficulté du Défi
   */
  buildInputPicker() {
    const group = document.createElement('div');
    group.className = 'chrono-input-mode';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-labelledby', 'chrono-input-title');
    const title = translatedElement('h3', 'chrono_input_legend');
    title.id = 'chrono-input-title';
    group.appendChild(title);
    const row = document.createElement('div');
    row.className = 'chrono-input-options';
    row.appendChild(this.buildInputChoice('mcq', 'chrono_input_mcq'));
    row.appendChild(this.buildInputChoice('keypad', 'chrono_input_keypad'));
    group.appendChild(row);
    return group;
  }

  buildInputChoice(mode, key) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chrono-input-btn';
    btn.dataset.inputMode = mode;
    btn.setAttribute('aria-pressed', this.inputMode === mode ? 'true' : 'false');
    // Libellé à part : la passe de traduction réécrit son texte sans effacer la coche
    btn.appendChild(translatedElement('span', key));
    // Coche du choix actif, montrée par la feuille de style : jamais la couleur seule
    btn.appendChild(createCheckIcon());
    return btn;
  }

  /**
   * Les calculs à revoir et leur révision. Liste vide : on dit d’où viennent les calculs,
   * sans bouton qui ne mènerait nulle part.
   */
  buildBasketPanel(store) {
    const section = createSetupBlock('chrono-basket', 'chrono_basket_title');
    const canAdd = MANUAL_ADD_OPERATORS.has(this.operator);
    if (store.basket.length === 0) {
      section.appendChild(translatedElement('p', 'chrono_basket_empty', 'chrono-tables-hint'));
      if (canAdd) section.appendChild(this.buildBasketAddRow());
      return section;
    }
    section.appendChild(translatedElement('p', 'chrono_revision_hint'));
    section.appendChild(this.buildBasketList(store.basket));
    if (canAdd) section.appendChild(this.buildBasketAddRow());
    section.appendChild(
      createBlockActions([
        translatedButton('chrono-start-revision', 'chrono_start_revision', 'btn btn-secondary'),
        translatedButton('chrono-basket-clear', 'chrono_basket_clear', 'btn btn-quiet btn-danger'),
      ])
    );
    return section;
  }

  buildBasketList(basket) {
    const list = document.createElement('ul');
    list.className = 'chrono-basket-list';
    // Les plus à revoir d’abord, puis dans l’ordre des tables
    const items = [...basket].sort(
      (left, right) => right.due - left.due || left.a - right.a || left.b - right.b
    );
    items.forEach(item => list.appendChild(this.buildBasketItem(item)));
    return list;
  }

  /**
   * Un calcul de la liste : le calcul, « 2 fois » (encore à revoir) et une poubelle pour
   * l’enlever. Aucun signe de calcul ne sert d’icône : un enfant lirait « ×2 » ou « × »
   * comme une multiplication.
   */
  buildBasketItem(item) {
    const fact = factText(this.operator, item.a, item.b);
    const li = document.createElement('li');
    li.className = 'chrono-basket-item';
    const label = document.createElement('span');
    label.className = 'chrono-basket-eq';
    label.textContent = fact;
    const due = document.createElement('span');
    due.className = 'chrono-basket-errors';
    due.textContent = getTranslation('chrono_basket_due', { n: item.due });
    // Un badge n'a pas de rôle qui accepte un nom : la phrase complète se lit en texte
    due.setAttribute('aria-hidden', 'true');
    const dueText = document.createElement('span');
    dueText.className = 'sr-only';
    dueText.textContent = getTranslation('chrono_basket_errors', { n: item.due });
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'chrono-basket-remove';
    remove.dataset.removeA = String(item.a);
    remove.dataset.removeB = String(item.b);
    const removeLabel = `${getTranslation('chrono_basket_remove')} ${fact}`;
    remove.setAttribute('aria-label', removeLabel);
    remove.title = removeLabel;
    remove.appendChild(createTrashIcon());
    li.appendChild(label);
    li.appendChild(due);
    li.appendChild(dueText);
    li.appendChild(remove);
    return li;
  }

  /** Ajout à la main : « Ajouter un calcul : [ ? ] × [ ? ] [Ajouter] » (ou +) */
  buildBasketAddRow() {
    const row = document.createElement('div');
    row.className = 'chrono-basket-add';
    const label = document.createElement('span');
    label.className = 'chrono-basket-add-label';
    label.textContent = getTranslation('chrono_basket_add_label');
    const a = this.buildFactorSelect('chrono-add-a', getTranslation('chrono_basket_add_a'));
    const times = document.createElement('span');
    times.className = 'chrono-basket-times';
    times.textContent = this.operator;
    times.setAttribute('aria-hidden', 'true');
    const b = this.buildFactorSelect('chrono-add-b', getTranslation('chrono_basket_add_b'));
    const add = document.createElement('button');
    add.type = 'button';
    add.id = 'chrono-basket-add';
    add.className = 'btn btn-secondary';
    add.textContent = getTranslation('chrono_basket_add');
    row.appendChild(label);
    row.appendChild(a);
    row.appendChild(times);
    row.appendChild(b);
    row.appendChild(add);
    // Un nombre manque : la phrase s'écrit sous la ligne, comme pour le prénom manquant
    const message = document.createElement('p');
    message.id = 'chrono-add-message';
    message.className = 'chrono-add-message';
    message.setAttribute('role', 'alert');
    message.hidden = true;
    row.appendChild(message);
    return row;
  }

  buildFactorSelect(id, label) {
    const select = document.createElement('select');
    select.id = id;
    select.className = 'chrono-basket-factor';
    select.setAttribute('aria-label', label);
    const blank = document.createElement('option');
    blank.value = '';
    blank.textContent = '?';
    select.appendChild(blank);
    ALL_TABLES.forEach(n => {
      const option = document.createElement('option');
      option.value = String(n);
      option.textContent = String(n);
      select.appendChild(option);
    });
    return select;
  }

  addManualBasketFactFromForm() {
    const selects = ['chrono-add-a', 'chrono-add-b'].map(id => document.getElementById(id));
    // Un nombre manque : une phrase le dit et le focus va dessus, plutôt qu'un bouton qui ne
    // ferait rien
    const missing = selects.filter(select => select?.value === '');
    if (missing.length > 0) {
      this.showAddMissing(missing);
      return;
    }
    const [a, b] = selects.map(select => select?.value);
    const { userData, store } = loadChronoStore(this.operator);
    if (!addManualBasketFact(store, a, b, this.operator)) return;
    persistChronoStore(userData);
    this.screenTask(this.rebuildSetup(focusAddRow));
  }

  /** « Choisis les deux nombres. » sous la ligne d’ajout, relié aux listes à choisir */
  showAddMissing(missing) {
    const message = document.getElementById('chrono-add-message');
    if (message) {
      message.textContent = getTranslation('chrono_basket_add_missing');
      message.hidden = false;
    }
    missing.forEach(select => {
      select.setAttribute('aria-invalid', 'true');
      select.setAttribute('aria-describedby', 'chrono-add-message');
    });
    missing[0].focus();
  }

  /** Un nombre choisi : sa liste n’est plus signalée ; la phrase part quand rien ne manque */
  clearAddMissing(select) {
    select.removeAttribute('aria-invalid');
    select.removeAttribute('aria-describedby');
    const message = document.getElementById('chrono-add-message');
    const stillMissing = this.gameScreen?.querySelector('.chrono-basket-factor[aria-invalid]');
    if (message && !stillMissing) message.hidden = true;
  }

  removeBasketFact(btn, index) {
    const { userData, store } = loadChronoStore(this.operator);
    removeFromBasket(store, { a: Number(btn.dataset.removeA), b: Number(btn.dataset.removeB) });
    persistChronoStore(userData);
    // Le focus va au calcul qui prend la place du retiré (au précédent si c’était le
    // dernier) ; s’il n’en reste aucun, à la ligne d’ajout
    this.screenTask(
      this.rebuildSetup(screen => {
        const left = screen.querySelectorAll('.chrono-basket-remove');
        return left[Math.min(index, left.length - 1)] ?? focusAddRow(screen);
      })
    );
  }

  bindSetupPanel() {
    this.gameScreen?.querySelectorAll('.chrono-input-btn').forEach(btn => {
      btn.addEventListener('click', () => this.setInputMode(btn.dataset.inputMode));
    });
    this.bindBasketControls();
    document.getElementById('chrono-start')?.addEventListener(
      'click',
      singleActivation(() => {
        this.screenTask(this.beginSession(false));
      })
    );
    document.getElementById('chrono-start-revision')?.addEventListener(
      'click',
      singleActivation(() => {
        this.screenTask(this.beginSession(true));
      })
    );
    document.getElementById('chrono-open-stats')?.addEventListener('click', () => {
      this.screenTask(this.openStatsPick());
    });
  }

  /** Liste à revoir : retirer un calcul, en ajouter un, tout effacer */
  bindBasketControls() {
    this.gameScreen?.querySelectorAll('[data-remove-a]').forEach((btn, index) => {
      btn.addEventListener('click', () => this.removeBasketFact(btn, index));
    });
    document.getElementById('chrono-basket-add')?.addEventListener('click', () => {
      this.addManualBasketFactFromForm();
    });
    this.gameScreen?.querySelectorAll('.chrono-basket-factor').forEach(select => {
      select.addEventListener('change', () => this.clearAddMissing(select));
      select.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
          event.preventDefault();
          this.addManualBasketFactFromForm();
        }
      });
    });
    document.getElementById('chrono-basket-clear')?.addEventListener('click', () => {
      // Toute la liste part d'un coup, sans retour : on demande d'abord
      if (!globalThis.confirm?.(getTranslation('confirm_clear_chrono_basket'))) return;
      const { userData, store } = loadChronoStore(this.operator);
      emptyBasket(store);
      persistChronoStore(userData);
      this.screenTask(this.rebuildSetup(focusAddRow));
    });
  }

  /**
   * Liste des temps. Au retour d’un classement, le focus revient sur sa ligne : le clavier
   * n’a pas à retraverser la liste. Sinon, il va sur le titre du panneau.
   * @param {string|null} [returnKey] - Clé du classement qu’on quitte
   */
  async openStatsPick(returnKey = null) {
    this.phase = 'stats-pick';
    this.statsFocus = null;
    await this.initializeUI();
    const rows = this.gameScreen?.querySelectorAll('[data-bucket-key]') ?? [];
    const row = [...rows].find(btn => btn.dataset.bucketKey === returnKey);
    if (row) row.focus();
    else this.focusPanelTitle();
  }

  async openStatsDetail(key) {
    const parsed = parseBucketKey(key, this.operator);
    if (!parsed) return;
    this.statsFocus = { ...parsed, key };
    this.phase = 'stats-detail';
    await this.initializeUI();
    this.focusPanelTitle();
  }

  /**
   * Un écran de Chrono se construit après un clic, sans être attendu : s’il échoue, une
   * bulle dit à l’enfant que le jeu a eu un souci (la zone de retour est masquée sur ces
   * écrans), puis il revient à l’accueil, au lieu d’un bouton sans effet.
   * @param {Promise<unknown>} task
   */
  screenTask(task) {
    task.catch(error => {
      showMessage(getTranslation('game_error'));
      this.handleError(error);
    });
  }

  /** Panneau des temps : le focus va sur son titre, Tab mène ensuite à ses boutons */
  focusPanelTitle() {
    const title = this.gameScreen?.querySelector('.chrono-setup-panel h2');
    if (!title) return;
    title.setAttribute('tabindex', '-1');
    title.focus({ preventScroll: true });
  }

  bucketTablesText(tables) {
    if (isFullTableSet(tables, this.operator)) return getTranslation('chrono_stats_tables_all');
    // « Table 7 », « Tables 3, 7 » : l'accord suit le nombre de tables
    return getTranslation('chrono_stats_tables', {
      count: uniqueTables(tables, this.operator).length,
      list: tablesListLabel(tables, this.operator),
    });
  }

  bucketModeText(inputMode) {
    return getTranslation(inputMode === 'keypad' ? 'chrono_input_keypad' : 'chrono_input_mcq');
  }

  /**
   * Sous le titre de « Mes temps », depuis le menu comme depuis l’écran de fin : le
   * classement (tables, façon de répondre), puis le temps moyen
   * @param {HTMLElement} panel
   * @param {{tables: number[], inputMode: string, averageMs: number|null}} bucket
   */
  appendBucketSummary(panel, { tables, inputMode, averageMs }) {
    const subtitle = document.createElement('p');
    subtitle.className = 'chrono-tables-hint';
    subtitle.textContent = getTranslation('chrono_stats_row', {
      tables: this.bucketTablesText(tables),
      mode: this.bucketModeText(inputMode),
    });
    panel.appendChild(subtitle);
    const average = document.createElement('p');
    average.textContent =
      averageMs == null
        ? getTranslation('chrono_session_average_none')
        : getTranslation('chrono_session_average', {
            time: formatDuration(averageMs, getCurrentLanguage()),
          });
    panel.appendChild(average);
  }

  buildStatsPickPanel() {
    const { store } = loadChronoStore(this.operator);
    const rows = listPlayedChronoBuckets(store, this.operator);
    const panel = createStatsPanel('chrono_stats_pick_title');
    if (rows.length === 0) {
      panel.appendChild(translatedElement('p', 'chrono_stats_empty', 'chrono-tables-hint'));
    } else {
      panel.appendChild(translatedElement('p', 'chrono_stats_pick_hint', 'chrono-tables-hint'));
      const list = document.createElement('ul');
      list.className = 'chrono-stats-list';
      const openLabel = getTranslation('chrono_stats_open');
      rows.forEach(row => list.appendChild(this.buildStatsRow(row, openLabel)));
      panel.appendChild(list);
    }
    panel.appendChild(
      translatedButton('chrono-stats-back-setup', 'chrono_back_to_setup', 'btn btn-quiet')
    );
    return panel;
  }

  /** Une ligne de la liste des classements : tables, façon de répondre, nombre de parties */
  buildStatsRow(row, openLabel) {
    const item = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chrono-stats-row';
    btn.dataset.bucketKey = row.key;
    const copy = document.createElement('span');
    copy.className = 'chrono-stats-copy';
    const label = document.createElement('span');
    label.className = 'chrono-stats-label';
    label.textContent = getTranslation('chrono_stats_row', {
      tables: this.bucketTablesText(row.tables),
      mode: this.bucketModeText(row.inputMode),
    });
    const count = document.createElement('span');
    count.className = 'chrono-stats-count';
    count.textContent = getTranslation('chrono_stats_games', { n: row.games });
    copy.appendChild(label);
    copy.appendChild(count);
    // Le mot porte sa clé et la flèche est à côté : la passe de traduction globale récrit
    // le mot sans effacer la flèche
    const open = document.createElement('span');
    open.className = 'chrono-stats-open';
    open.appendChild(translatedElement('span', 'chrono_stats_open'));
    open.appendChild(createIcon('chevron-right'));
    btn.setAttribute('aria-label', `${label.textContent}. ${count.textContent}. ${openLabel}`);
    btn.appendChild(copy);
    btn.appendChild(open);
    item.appendChild(btn);
    return item;
  }

  bindStatsPickPanel() {
    this.gameScreen?.querySelectorAll('[data-bucket-key]').forEach(btn => {
      btn.addEventListener('click', () =>
        this.screenTask(this.openStatsDetail(btn.dataset.bucketKey))
      );
    });
    document.getElementById('chrono-stats-back-setup')?.addEventListener('click', () => {
      this.screenTask(this.rebuildSetup(screen => screen.querySelector('#chrono-open-stats')));
    });
  }

  buildStatsDetailPanel() {
    const focus = this.statsFocus;
    if (!focus) return this.buildStatsPickPanel();
    const { store } = loadChronoStore(this.operator);
    const bucket = findBucket(store, focus.tables, focus.inputMode, this.operator);
    const panel = createStatsPanel('chrono_stats_title');
    const averageMs = sessionAverageMs(bucket);
    this.appendBucketSummary(panel, { ...focus, averageMs });
    panel.appendChild(this.buildRanking(rankedSessions(bucket)));
    panel.appendChild(this.buildCurve(recentSessions(bucket), averageMs));
    panel.appendChild(
      translatedButton('chrono-stats-back-pick', 'chrono_back_to_setup', 'btn btn-quiet')
    );
    return panel;
  }

  bindStatsDetailPanel() {
    document.getElementById('chrono-stats-back-pick')?.addEventListener('click', () => {
      this.screenTask(this.openStatsPick(this.statsFocus?.key));
    });
  }

  /**
   * Revient à l’écran de départ, reconstruit. `pickFocus` y choisit où remettre le focus :
   * sans lui, le clavier repartirait du haut de la page.
   * @param {(screen: HTMLElement) => HTMLElement|null|undefined} [pickFocus]
   */
  async rebuildSetup(pickFocus) {
    this.phase = 'setup';
    await this.initializeUI();
    if (this.gameScreen && pickFocus) pickFocus(this.gameScreen)?.focus();
  }

  setInputMode(mode) {
    this.inputMode = mode === 'mcq' ? 'mcq' : 'keypad';
    this.gameScreen?.querySelectorAll('.chrono-input-btn').forEach(btn => {
      btn.setAttribute('aria-pressed', btn.dataset.inputMode === this.inputMode ? 'true' : 'false');
    });
    const { userData, store } = loadChronoStore();
    setLastChronoInputMode(store, this.inputMode);
    persistChronoStore(userData);
  }

  /** Tables de la course : celles des Paramètres en multiplication, toutes ailleurs */
  tablesFromPreferences() {
    if (this.operator !== '×') return chronoTables(this.operator);
    const user = UserManager.getCurrentUser();
    const enabled = TablePreferences.isGlobalEnabled(user);
    const exclusions = enabled ? TablePreferences.getActiveExclusions(user) : [];
    return includedTablesFromExclusions(exclusions, enabled);
  }

  async beginSession(revision) {
    if (this.phase !== 'setup') return;
    const { store } = loadChronoStore(this.operator);
    if (revision) {
      if (store.basket.length === 0) return;
      this.isRevision = true;
      this.revisionBasket = store.basket.map(item => ({ ...item }));
      this.revisionTally = startRevisionTally(store.basket, this.operator);
    } else {
      this.selectedTables = this.tablesFromPreferences();
      this.isRevision = false;
      this.revisionBasket = [];
      this.revisionTally = new Map();
    }
    this.phase = 'playing';
    this.sessionFacts = [];
    this.revisionQueue = [];
    // Nouvelle partie : comptée à sa première réponse, enregistrée une fois
    this._statsGameCounted = false;
    this._resultsSaved = false;
    this.sessionStartedAt = clockNow();
    this.endedAt = null;
    this.elapsedMs = 0;
    this._abandoned = false;
    this.sessionOutcome = null;
    this.revisionOutcome = null;
    await this.initializeUI();
    this.startElapsedTimer();
    this.generateQuestion();
  }

  /** Temps de la partie : il s’arrête à la dernière réponse, pas à l’écran des résultats */
  sessionDurationMs() {
    return (this.endedAt ?? clockNow()) - this.sessionStartedAt;
  }

  startElapsedTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.intervals.delete(this.timerInterval);
    }
    this.updateInfoBar();
    this.timerInterval = setInterval(() => {
      this.elapsedMs = this.sessionDurationMs();
      this.updateInfoBar();
    }, 250);
    this.intervals.add(this.timerInterval);
  }

  /**
   * Prochain calcul d’une course : ni un calcul déjà posé, ni l’autre membre de sa famille
   * (6 × 8 après 8 × 6, 15 − 8 après 15 − 7 : c’est le même calcul)
   * @returns {{a: number, b: number}}
   */
  nextRaceFact() {
    const keysOf = fact => factKeys(fact.a, fact.b, this.operator);
    const avoid = this.sessionFacts.flatMap(keysOf);
    const last = this.sessionFacts.at(-1);
    const recent = last ? keysOf(last) : [];
    return pickChronoFact(this.operator, this.selectedTables, avoid, recent);
  }

  /**
   * La question d’un calcul, pour la course comme pour la révision : le texte de
   * l’opération (signe moins U+2212, dont dépendent la voix et son clip), sa réponse, et
   * table et multiplicande en multiplication seulement (Défi du jour, statistiques).
   * @param {number} a
   * @param {number} b
   */
  buildQuestion(a, b) {
    const type = this.inputMode === 'mcq' ? 'mcq' : 'classic';
    const question = {
      question: getOperation(this.operator).formatQuestion(a, b, type),
      answer: chronoAnswer(this.operator, a, b),
      type,
      operator: this.operator,
      a,
      b,
    };
    if (this.operator === '×') Object.assign(question, { table: a, num: b });
    return question;
  }

  generateQuestion() {
    if (!this.state.isActive) return;
    try {
      this.hideContinueButton();
      const fact = this.isRevision
        ? takeNextRevisionFact(
            this.revisionQueue,
            this.revisionBasket,
            this.sessionFacts.at(-1),
            this.operator
          )
        : this.nextRaceFact();
      if (!fact) {
        this.finish();
        return;
      }
      this.state.currentQuestion = this.buildQuestion(Number(fact.a), Number(fact.b));
      this.displayQuestion();
      this.onQuestionGenerated();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Réponses toujours en chiffres, alors que GameMode en écrit une sur cinq en lettres en QCM :
   * en course, elles se lisent d’un coup d’œil. Chrono ne pose pas de « vrai ou faux ».
   */
  generateOptions() {
    return super.generateOptions().map(option => ({
      value: option.value,
      display: String(option.value),
    }));
  }

  displayQuestion() {
    this.typedValue = '';
    this.optionsElement?.classList.remove('is-answered');
    super.displayQuestion();
    // La base n’efface que le texte : sans cela, la classe d’erreur resterait sur la
    // question suivante
    this.clearFeedback();
  }

  clearFeedback() {
    if (!this.feedbackElement) return;
    this.feedbackElement.textContent = '';
    this.feedbackElement.className = 'feedback chrono-feedback';
  }

  /**
   * Retour d’une réponse, le temps de la question seulement : « Juste » ou « Presque ! »,
   * sans le résultat. La correction attend l’écran de fin : affichée sous la question
   * suivante, elle en donnait la réponse quand c’était l’inverse (6 × 8 après 8 × 6).
   * @param {boolean} isCorrect
   */
  paintFeedback(isCorrect) {
    if (!this.feedbackElement) return;
    this.feedbackElement.textContent = '';
    const mark = isCorrect ? createCheckIcon() : createCrossIcon();
    this.feedbackElement.appendChild(mark);
    const text = document.createElement('span');
    text.textContent = getTranslation(isCorrect ? 'chrono_feedback_correct' : 'incorrect');
    this.feedbackElement.appendChild(text);
    this.feedbackElement.className = `feedback chrono-feedback ${isCorrect ? 'feedback-success' : 'feedback-error'}`;
  }

  onQuestionGenerated() {
    this.questionStartedAt = clockNow();
    markQuestionKind(this.questionElement, this.state.currentQuestion);
    if (this.inputMode === 'mcq') tagAnswerOptions(this.optionsElement);
    // Voix activée : la question est lue (« Combien font 8 fois 6 ? »), et une réponse la
    // coupe (GameMode.handleAnswer) : le chrono n’attend jamais la voix
    this.speakQuestion();
  }

  /** Chrono ne dit pas les erreurs : aucune phrase à précharger (GameMode.speakQuestion) */
  spokenErrorText() {
    return null;
  }

  displayOptions() {
    this.optionsElement?.classList.remove('is-answered');
    if (this.inputMode === 'keypad') {
      this.renderKeypad();
      return;
    }
    super.displayOptions();
    tagAnswerOptions(this.optionsElement);
  }

  renderKeypad() {
    if (!this.optionsElement) return;
    this.optionsElement.textContent = '';
    const pad = document.createElement('div');
    pad.className = 'chrono-keypad';
    const typed = document.createElement('div');
    typed.className = 'chrono-typed';
    typed.id = 'chrono-typed';
    // Rôle « status » : une zone annoncée qui peut porter un nom (« Ta réponse »)
    typed.setAttribute('role', 'status');
    typed.setAttribute('aria-live', 'polite');
    typed.setAttribute('aria-label', getTranslation('chrono_typed_label'));
    typed.textContent = this.typedValue || TYPED_PLACEHOLDER;
    pad.appendChild(typed);
    const grid = document.createElement('div');
    grid.className = 'chrono-keys';
    const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'back', 0];
    // Lecteur d'écran : un chiffre qui reçoit le focus est lu avec la question
    const questionId = this.questionElement?.id;
    keys.forEach(key => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chrono-key';
      if (key === 'back') {
        btn.dataset.translate = 'chrono_backspace';
        btn.textContent = getTranslation('chrono_backspace');
        btn.dataset.key = 'back';
      } else {
        btn.textContent = String(key);
        btn.dataset.key = String(key);
        if (questionId) btn.setAttribute('aria-describedby', questionId);
      }
      btn.addEventListener('click', event => {
        // Clic à la souris ou au doigt (detail > 0) : la touche rend le focus, pour qu'Entrée
        // valide ensuite ce qui est tapé au lieu de la retaper. Au clavier (Tab, Entrée),
        // elle le garde.
        if (event.detail > 0) btn.blur();
        this.applyKey(btn.dataset.key);
      });
      grid.appendChild(btn);
    });
    pad.appendChild(grid);
    this.optionsElement.appendChild(pad);
    this.attachKeyboard();
  }

  attachKeyboard() {
    this.detachKeyboard();
    document.addEventListener('keydown', this._onKeyDown);
  }

  detachKeyboard() {
    document.removeEventListener('keydown', this._onKeyDown);
  }

  onPhysicalKey(event) {
    if (this.phase !== 'playing' || this.inputMode !== 'keypad') return;
    if (event.key === 'Backspace') {
      event.preventDefault();
      this.applyKey('back');
      return;
    }
    if (event.key === 'Enter') {
      this.onEnterKey(event);
      return;
    }
    const digit = typedDigit(event);
    if (digit) {
      event.preventDefault();
      this.applyKey(digit);
    }
  }

  /**
   * Entrée valide ce qui est tapé, même incomplet (« 4 » pour 42) ; la réponse se valide
   * déjà seule dès qu’elle est juste ou ne peut plus l’être. Case vide : rien. Sur un
   * bouton, Entrée garde son rôle : une touche du pavé tape son chiffre, « Abandonner »
   * abandonne. La navigation clavier a alors déjà cliqué ce bouton (defaultPrevented).
   */
  onEnterKey(event) {
    if (event.defaultPrevented || event.target?.closest?.('button')) return;
    if (!this.typedValue || !this.canType()) return;
    event.preventDefault();
    this.handleAnswer(Number(this.typedValue));
  }

  /** Une question attend sa réponse : ni partie finie, ni réponse déjà donnée */
  canType() {
    if (!this.state.isActive || !this.state.currentQuestion) return false;
    return !this.optionsElement?.classList.contains('is-answered');
  }

  applyKey(key) {
    if (!this.canType()) return;
    if (key === 'back') {
      this.typedValue = this.typedValue.slice(0, -1);
      this.refreshTyped();
      return;
    }
    this.typedValue += key;
    this.refreshTyped();
    const kind = classifyTypedAnswer(this.typedValue, this.state.currentQuestion.answer);
    if (kind === 'correct' || kind === 'wrong') this.handleAnswer(Number(this.typedValue));
  }

  refreshTyped() {
    const typed = document.getElementById('chrono-typed');
    if (typed) typed.textContent = this.typedValue || TYPED_PLACEHOLDER;
  }

  disableOptions() {
    super.disableOptions();
    this.optionsElement?.querySelectorAll('.chrono-key').forEach(btn => {
      btn.disabled = true;
    });
  }

  handleAnswer(userAnswer) {
    if (!this.state.isActive || !this.state.currentQuestion) return;
    const now = clockNow();
    const question = this.state.currentQuestion;
    const isCorrect = userAnswer === question.answer;
    this.sessionFacts.push({
      a: question.a ?? question.table,
      b: question.b ?? question.num,
      correct: isCorrect,
      ms: now - this.questionStartedAt,
    });
    this.detachKeyboard();
    // La dernière réponse arrête le chrono, avant que la partie s’enregistre (dès cette
    // réponse, GameMode.saveResultsOnce) : l’affichage qui la suit ne compte pas
    if (this.isLastAnswer(isCorrect)) this.endedAt = now;
    super.handleAnswer(userAnswer);
  }

  /** Cette réponse termine-t-elle la partie ? (10 justes en course, 10 questions en révision) */
  isLastAnswer(isCorrect) {
    return !chronoShouldContinue({
      isRevision: this.isRevision,
      correctAnswers: this.state.correctAnswers + (isCorrect ? 1 : 0),
      questionCount: this.state.questionCount + 1,
    });
  }

  /** Une course compte au tableau de bord dès sa première réponse, même abandonnée ; pas une révision */
  countsGames() {
    return !this.isRevision;
  }

  onAnswerSubmitted(isCorrect) {
    const question = this.state.currentQuestion;
    if (this.isRevision) {
      // Révision : les compteurs vivent en mémoire jusqu’à la fin, aucune pièce par réponse
      tallyRevisionAnswer(this.revisionTally, question, isCorrect, this.operator);
      return;
    }
    if (!isCorrect) return;
    const { userData } = loadChronoStore(this.operator);
    grantChronoCoins(userData);
    persistChronoStore(userData);
    updateCoinDisplay();
    const coinIcon = document.querySelector('.coin-count');
    if (coinIcon) showCoinGainAnimation(coinIcon);
    // Après l’enregistrement : le profil, réécrit en entier, effacerait sa récompense. Le Défi
    // du jour porte sur une table de multiplication : les autres opérations ne le font pas
    // avancer, comme dans le Quiz, le Défi et l’Aventure
    if (question.operator === '×') updateDailyChallengeProgress(question.table, question.num);
  }

  showAnswerFeedback(isCorrect, userAnswer) {
    if (!this.feedbackElement) return;
    const question = this.state.currentQuestion;
    const correctAnswer = question.answer;
    if (this.inputMode === 'mcq') {
      // Une erreur ne marque que la tuile choisie : la bonne réponse attend l'écran de fin
      // (en révision, l'inverse suit et se recopierait)
      markAnswerOptions(this.optionsElement, isCorrect ? correctAnswer : null, userAnswer);
    }
    this.optionsElement?.classList.add('is-answered');
    this.paintFeedback(isCorrect);
    if (isCorrect) {
      playSound('good');
      return;
    }
    playSound('bad', { volume: BAD_SOUND_VOLUME });
  }

  scheduleNextQuestion() {
    this.addTimer(() => this.nextQuestionOrFinish(), FEEDBACK_MS);
  }

  shouldContinue() {
    return chronoShouldContinue({
      isRevision: this.isRevision,
      correctAnswers: this.state.correctAnswers,
      questionCount: this.state.questionCount,
    });
  }

  onStop() {
    this.detachKeyboard();
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.intervals.delete(this.timerInterval);
      this.timerInterval = null;
    }
  }

  saveResults() {
    if (this._abandoned) return;
    if (this.isRevision) {
      this.saveRevision();
      return;
    }
    if (this.sessionFacts.length === 0) return;
    const { userData, store } = loadChronoStore(this.operator);
    this.sessionOutcome = saveChronoSession(store, {
      tables: this.selectedTables,
      inputMode: this.inputMode,
      durationMs: this.sessionDurationMs(),
      date: Date.now(),
      facts: this.sessionFacts,
      operator: this.operator,
    });
    persistChronoStore(userData);
  }

  /** Fin d’une révision terminée : la liste évolue, une pièce par calcul qui en sort */
  saveRevision() {
    const { userData, store } = loadChronoStore(this.operator);
    this.revisionOutcome = applyRevisionTally(store, this.revisionTally, this.operator);
    grantChronoCoins(userData, this.revisionOutcome.mastered.length);
    persistChronoStore(userData);
    if (this.revisionOutcome.mastered.length > 0) updateCoinDisplay();
  }

  showResults() {
    const shown = goToSlide(5);
    const resultsScreen = document.getElementById('results');
    if (!resultsScreen) return;
    const { store } = loadChronoStore(this.operator);
    const bucket = this.isRevision
      ? null
      : findBucket(store, this.selectedTables, this.inputMode, this.operator);
    this.resultsPane = 'session';
    this.lastSnapshot = {
      durationMs: this.sessionDurationMs(),
      facts: [...this.sessionFacts],
      isRevision: this.isRevision,
      outcome: this.sessionOutcome,
      revision: this.revisionOutcome,
      averageMs: sessionAverageMs(bucket),
      ranking: rankedSessions(bucket),
      curve: recentSessions(bucket),
      tables: [...this.selectedTables],
      inputMode: this.inputMode,
      basketSize: store.basket.length,
      avatar: gameState?.avatar,
    };
    this.mountResultsPane({ ready: shown });
  }

  mountResultsPane({ ready } = {}) {
    const resultsScreen = document.getElementById('results');
    if (!resultsScreen || !this.lastSnapshot) return;
    const snapshot = this.lastSnapshot;
    mountResults(
      resultsScreen,
      () =>
        this.resultsPane === 'stats' ? this.renderStats(snapshot) : this.renderResults(snapshot),
      { ready }
    );
  }

  openResultsPane(pane) {
    this.resultsPane = pane;
    this.mountResultsPane();
  }

  renderResults(result) {
    const lang = getCurrentLanguage();
    const container = document.createElement('section');
    container.className = 'results-container content-card game-results chrono-results';
    container.setAttribute('aria-label', getTranslation('chrono_results'));
    const avatar = createAvatarPortrait(result.avatar);
    if (avatar) container.appendChild(avatar);
    container.appendChild(
      createResultsSummary({
        lead: getTranslation('chrono_session_time', {
          time: formatDuration(result.durationMs, lang),
        }),
        ...this.resultsMessages(result, lang),
      })
    );
    container.appendChild(this.buildFactsTable(result.facts));
    container.appendChild(this.buildSessionActions(result));
    return container;
  }

  /**
   * Phrases sous le temps : bilan d’une révision, ou record, rang et temps moyen
   * @returns {{message: string, details: string[]}}
   */
  resultsMessages(result, lang) {
    if (result.isRevision) {
      return {
        message: getTranslation('chrono_revision_mastered', {
          n: result.revision?.mastered.length ?? 0,
        }),
        details: [
          getTranslation('chrono_revision_left', {
            n: result.revision?.remaining ?? result.basketSize,
          }),
        ],
      };
    }
    const outcome = result.outcome;
    if (!outcome || outcome.first) {
      return { message: getTranslation('chrono_session_average_none'), details: [] };
    }
    const average = getTranslation('chrono_session_average', {
      time: formatDuration(result.averageMs, lang),
    });
    if (outcome.record) return { message: getTranslation('chrono_new_record'), details: [average] };
    if (outcome.rank) {
      return {
        message: getTranslation('chrono_rank', { rank: outcome.rank, count: outcome.count }),
        details: [average],
      };
    }
    return { message: average, details: [] };
  }

  /**
   * Après une course : la rejouer, ou revenir au menu de Chrono, où l’on voit sa liste à
   * jour et d’où part la révision. Après une révision : le menu, sans « Rejouer », qui
   * lancerait une course.
   */
  buildSessionActions(result) {
    const race = !result.isRevision;
    const buttons = [
      race && {
        label: getTranslation('chrono_play_again'),
        action: 'play-again',
        primary: true,
        onActivate: () => relaunchChrono({ autoStart: true }),
      },
      {
        label: getTranslation('chrono_back_to_menu'),
        action: 'chrono-menu',
        primary: !race,
        onActivate: () => relaunchChrono(),
      },
      race && {
        label: getTranslation('chrono_stats_button'),
        action: 'stats',
        onActivate: () => this.openResultsPane('stats'),
      },
      {
        label: getTranslation('back_to_home'),
        action: 'back-to-home',
        onActivate: () => void goToSlide(1),
      },
    ];
    return createResultsActions(buttons.filter(Boolean));
  }

  renderStats(result) {
    const container = document.createElement('section');
    container.className = 'results-container content-card game-results chrono-results';
    container.setAttribute('aria-label', getTranslation('chrono_stats_title'));
    container.appendChild(translatedElement('h2', 'chrono_stats_title'));
    this.appendBucketSummary(container, result);
    container.appendChild(this.buildRanking(result.ranking));
    container.appendChild(this.buildCurve(result.curve, result.averageMs));
    container.appendChild(
      createResultsActions([
        {
          label: getTranslation('chrono_back_to_results'),
          action: 'back-to-results',
          primary: true,
          onActivate: () => this.openResultsPane('session'),
        },
        {
          label: getTranslation('back_to_home'),
          action: 'back-to-home',
          onActivate: () => void goToSlide(1),
        },
      ])
    );
    return container;
  }

  buildFactsTable(facts) {
    const lang = getCurrentLanguage();
    const wrap = createResultsSection('chrono_facts_title');
    const list = document.createElement('ol');
    list.className = 'chrono-facts';
    facts.forEach(fact => {
      const li = document.createElement('li');
      li.className = fact.correct ? 'chrono-fact is-correct' : 'chrono-fact is-wrong';
      const equation = document.createElement('span');
      equation.className = 'chrono-fact-eq';
      // La correction des erreurs : le calcul complet, ici plutôt qu’en jeu
      const result = chronoAnswer(this.operator, fact.a, fact.b);
      equation.textContent = `${factText(this.operator, fact.a, fact.b)} = ${result}`;
      const time = document.createElement('span');
      time.className = 'chrono-fact-time';
      time.textContent = formatDuration(fact.ms, lang);
      const mark = fact.correct ? createCheckIcon() : createCrossIcon();
      mark.classList.add('chrono-fact-mark');
      // L'icône est masquée aux lecteurs d'écran : « Juste » ou « Faux » s'y lit en texte
      const status = document.createElement('span');
      status.className = 'sr-only';
      status.textContent = getTranslation(fact.correct ? 'chrono_fact_ok' : 'chrono_fact_ko');
      li.appendChild(equation);
      li.appendChild(status);
      li.appendChild(time);
      li.appendChild(mark);
      list.appendChild(li);
    });
    wrap.appendChild(list);
    return wrap;
  }

  /** Les 10 meilleurs temps, avec leur date, dans la langue du jeu */
  buildRanking(sessions) {
    const lang = getCurrentLanguage();
    const wrap = createResultsSection('chrono_ranking_title');
    const list = document.createElement('ol');
    list.className = 'chrono-ranking';
    sessions.forEach(session => {
      const li = document.createElement('li');
      const when = formatSessionDate(session.date, lang);
      li.textContent = `${formatDuration(session.durationMs, lang)} — ${when}`;
      list.appendChild(li);
    });
    wrap.appendChild(list);
    return wrap;
  }

  buildCurve(sessions, averageMs) {
    const wrap = createResultsSection('chrono_curve_title');
    wrap.appendChild(this.drawCurve(sessions, averageMs));
    return wrap;
  }

  drawCurve(sessions, averageMs) {
    const svg = svgElement('svg', {
      class: 'chrono-curve',
      viewBox: `0 0 ${CURVE.width} ${CURVE.height}`,
      role: 'img',
      'aria-label': getTranslation('chrono_curve_title'),
    });
    if (!sessions.length) return svg;

    const times = sessions.map(session => Number(session.durationMs) || 0);
    const rawMax = Math.max(...times, Number(averageMs) || 0, 1);
    const max = niceDurationMaxMs(rawMax);
    const { left, right, top, bottom, ticks } = CURVE;
    const yOf = ms => bottom - (ms / max) * (bottom - top);
    const xOf = index =>
      times.length === 1
        ? (left + right) / 2
        : left + (index / (times.length - 1)) * (right - left);

    // Grille et graduations de l’axe vertical, puis les deux axes
    for (let i = 0; i <= ticks; i += 1) {
      const value = (max * i) / ticks;
      const y = yOf(value);
      svg.appendChild(curveLine(left, y, right, y, '0.2'));
      svg.appendChild(
        curveLabel(left - 6, y, formatAxisSeconds(value), {
          'text-anchor': 'end',
          'dominant-baseline': 'middle',
        })
      );
    }
    svg.appendChild(curveLine(left, top, left, bottom, '0.45'));
    svg.appendChild(curveLine(left, bottom, right, bottom, '0.45'));

    times.forEach((_, index) => {
      if (!showsGameNumber(index, times.length)) return;
      const y = bottom + CURVE.fontSize + 4;
      svg.appendChild(curveLabel(xOf(index), y, String(index + 1), { 'text-anchor': 'middle' }));
    });

    svg.appendChild(
      svgElement('polyline', {
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        points: times.map((ms, index) => `${xOf(index)},${yOf(ms)}`).join(' '),
      })
    );
    // Un point par partie : une seule partie se voit aussi (une ligne d’un point ne se trace pas)
    times.forEach((ms, index) => {
      svg.appendChild(
        svgElement('circle', { cx: xOf(index), cy: yOf(ms), r: 3, fill: 'currentColor' })
      );
    });

    // Le temps moyen, en pointillés
    if (averageMs != null) {
      const y = yOf(averageMs);
      svg.appendChild(
        curveLine(left, y, right, y, '0.7', { 'stroke-width': '1.5', 'stroke-dasharray': '4 4' })
      );
    }
    return svg;
  }
}

let _chronoModeInstance = null;

/**
 * @param {{autoStart?: boolean}} [options] - Voir le constructeur
 */
export function startChronoMode(options = {}) {
  if (_chronoModeInstance) _chronoModeInstance.stop();
  _chronoModeInstance = new ChronoMode(options);
  void _chronoModeInstance.start();
}

export function stopChronoMode() {
  if (_chronoModeInstance) {
    _chronoModeInstance.stop();
    _chronoModeInstance = null;
  }
}

export function refreshChronoTexts() {
  return _chronoModeInstance?.refreshTexts?.();
}

export default ChronoMode;
