/**
 * Mode Chrono : dix bonnes réponses contre un chrono qui ne s’arrête pas, sur les tables
 * choisies, en choisissant ou en tapant la réponse. Les calculs ratés vont dans « Mes
 * calculs à revoir », qu’une révision de dix questions fait travailler.
 */

import { GameMode } from '../core/GameMode.js';
import {
  getTranslation,
  playSound,
  showCoinGainAnimation,
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
  singleActivation,
} from '../ui-feedback.js';
import { goToSlide } from '../slides.js';
import { setGameMode } from '../mode-orchestrator.js';
import { UserState } from '../core/userState.js';
import { gameState, updateDailyChallengeProgress } from '../game.js';
import { classifyTypedAnswer } from '../core/chrono-input.js';
import {
  factKeys,
  pickChronoPair,
  takeNextRevisionFact,
  includedTablesFromExclusions,
  isFullTableSet,
} from '../core/chrono-questions.js';
import { TablePreferences } from '../core/tablePreferences.js';
import { UserManager } from '../userManager.js';
import { getCurrentLanguage } from '../i18n-store.js';
import {
  normalizeChronoStats,
  findBucket,
  sessionAverageMs,
  saveChronoSession,
  chronoShouldContinue,
  CHRONO_GOAL,
  removeFromBasket,
  emptyBasket,
  addManualBasketFact,
  basketDueClass,
  grantChronoCoins,
  listPlayedChronoBuckets,
  parseBucketKey,
  tablesListLabel,
  rankedSessions,
  recentSessions,
  formatDuration,
  formatSessionDate,
  niceDurationMaxMs,
  formatAxisSeconds,
  lastChronoInputMode,
  setLastChronoInputMode,
} from '../core/chrono-stats.js';

const BASE_QUESTIONS = 10;
const FEEDBACK_MS = 800;
const ERROR_HOLD_MS = 2800;
const BAD_SOUND_VOLUME = 0.35;
const ALL_TABLES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function loadChronoStore() {
  const userData = UserState.getCurrentUserData();
  userData.chronoStats = normalizeChronoStats(userData.chronoStats);
  return { userData, store: userData.chronoStats };
}

function persistChronoStore(userData) {
  UserState.updateUserData(userData);
}

function formatClock(ms) {
  const totalSeconds = Math.floor(Math.max(0, Number(ms) || 0) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Relance depuis les résultats, par l’orchestrateur comme le Quiz : le mode est marqué
 * « en démarrage », et la navigation vers l’écran de jeu ne l’arrête pas aussitôt. Sans
 * cela, la partie relancée tournait en arrière-plan, hors de portée de l’arrêt.
 * @param {{revision: boolean}} launch
 */
function relaunchChrono({ revision }) {
  setGameMode('chrono', { autoStart: true, revision }).catch(err => {
    console.warn('setGameMode failed', err);
  });
}

export class ChronoMode extends GameMode {
  /**
   * @param {{autoStart?: boolean, revision?: boolean}} [options] - Relance depuis les
   *   résultats : la partie (ou la révision) démarre sans repasser par l’écran de départ
   */
  constructor(options = {}) {
    super('chrono', {
      maxQuestions: 200,
      hasTimer: true,
      hasLives: false,
      hasStreaks: false,
      autoProgress: true,
      pauseAfterError: false,
      nextQuestionDelay: FEEDBACK_MS,
      wrongAnswerDelay: FEEDBACK_MS,
      showScore: false,
      announceOnStart: false,
      initialTime: 0,
    });
    // Hors de resetState : start() réinitialise l’état avant d’appeler onStart()
    this.launch = { autoStart: options?.autoStart === true, revision: options?.revision === true };
    this.phase = 'setup';
    this.selectedTables = [...ALL_TABLES];
    this.inputMode = lastChronoInputMode(loadChronoStore().store);
    this.isRevision = false;
    this.revisionQueue = [];
    this.revisionBasket = [];
    this.sessionOutcome = null;
    this.targetCount = BASE_QUESTIONS;
    this.sessionFacts = [];
    this.sessionStartedAt = 0;
    this.endedAt = null;
    this.questionStartedAt = 0;
    this.typedValue = '';
    this.elapsedMs = 0;
    this.timerInterval = null;
    this._abandoned = false;
    this._holdErrorFeedback = false;
    this._errorHoldGen = 0;
    this._heldErrorFact = null;
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
    this.targetCount = BASE_QUESTIONS;
    this.revisionQueue = [];
    this.revisionBasket = [];
    this.sessionOutcome = null;
    this._abandoned = false;
    this._holdErrorFeedback = false;
    this._errorHoldGen = 0;
    this._heldErrorFact = null;
  }

  async onStart() {
    this.phase = 'setup';
    this.isRevision = false;
    const launch = this.launch;
    this.launch = null;
    if (launch?.autoStart) await this.beginSession(launch.revision);
  }

  getInfoBarData() {
    if (this.phase !== 'playing') return null;
    return {
      time: formatClock(this.elapsedMs),
      progress: this.isRevision
        ? `${this.state.questionCount}/${this.targetCount}`
        : `${this.state.correctAnswers}/${CHRONO_GOAL}`,
    };
  }

  async getCustomHTML() {
    if (this.phase === 'setup') return this.buildSetupPanel();
    if (this.phase === 'stats-pick') return this.buildStatsPickPanel();
    if (this.phase === 'stats-detail') return this.buildStatsDetailPanel();
    const wrap = document.createElement('div');
    wrap.className = 'game-quit chrono-controls';
    const abandon = document.createElement('button');
    abandon.id = 'chrono-abandon';
    abandon.type = 'button';
    abandon.className = 'btn btn-quiet btn-danger';
    abandon.dataset.translate = 'chrono_abandon';
    abandon.textContent = getTranslation('chrono_abandon');
    wrap.appendChild(abandon);
    return wrap;
  }

  async initializeUI() {
    await super.initializeUI();
    this.gameScreen?.classList.toggle('chrono-setup', this.phase !== 'playing');
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
    this.placeActionsAfterAnswers();
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

  placeActionsAfterAnswers() {
    const container = this.feedbackElement?.parentElement;
    const controls = container?.querySelector('.chrono-controls');
    if (!container || !controls) return;
    const customWrap = controls.parentElement;
    container.appendChild(controls);
    if (customWrap && customWrap !== container && customWrap.children.length === 0) {
      customWrap.remove();
    }
  }

  setupGameControls() {
    const abandonBtn = document.getElementById('chrono-abandon');
    if (abandonBtn) abandonBtn.onclick = singleActivation(() => this.confirmAbandon());
  }

  confirmAbandon() {
    const root = globalThis;
    if (!root?.confirm?.(getTranslation('confirm_abandon_chrono'))) return;
    this._abandoned = true;
    this.stop();
    void goToSlide(1);
  }

  buildSetupPanel() {
    const { store } = loadChronoStore();
    const panel = document.createElement('div');
    panel.className = 'chrono-setup-panel';

    const intro = document.createElement('p');
    intro.dataset.translate = 'chrono_intro';
    intro.textContent = getTranslation('chrono_intro');
    panel.appendChild(intro);

    const tablesHint = document.createElement('p');
    tablesHint.className = 'chrono-tables-hint';
    tablesHint.dataset.translate = 'chrono_tables_hint';
    tablesHint.textContent = getTranslation('chrono_tables_hint');
    panel.appendChild(tablesHint);

    panel.appendChild(this.buildInputPicker());
    panel.appendChild(this.buildBasketPanel(store));

    const actions = document.createElement('div');
    actions.className = 'chrono-setup-actions';
    const start = document.createElement('button');
    start.type = 'button';
    start.id = 'chrono-start';
    start.className = 'btn btn-primary';
    start.dataset.translate = 'chrono_start';
    start.textContent = getTranslation('chrono_start');
    actions.appendChild(start);
    const revise = document.createElement('button');
    revise.type = 'button';
    revise.id = 'chrono-start-revision';
    revise.className = 'btn btn-secondary';
    revise.dataset.translate = 'chrono_start_revision';
    revise.textContent = getTranslation('chrono_start_revision');
    revise.disabled = store.basket.length === 0;
    actions.appendChild(revise);
    const stats = document.createElement('button');
    stats.type = 'button';
    stats.id = 'chrono-open-stats';
    stats.className = 'btn btn-secondary chrono-setup-stats';
    stats.dataset.translate = 'chrono_stats_button';
    stats.textContent = getTranslation('chrono_stats_button');
    actions.appendChild(stats);
    panel.appendChild(actions);
    return panel;
  }

  buildInputPicker() {
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'chrono-input-mode';
    const legend = document.createElement('legend');
    legend.dataset.translate = 'chrono_input_legend';
    legend.textContent = getTranslation('chrono_input_legend');
    fieldset.appendChild(legend);
    const row = document.createElement('div');
    row.className = 'chrono-input-options';
    row.appendChild(this.buildInputChoice('mcq', 'chrono_input_mcq'));
    row.appendChild(this.buildInputChoice('keypad', 'chrono_input_keypad'));
    fieldset.appendChild(row);
    return fieldset;
  }

  buildInputChoice(mode, key) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chrono-input-btn';
    btn.dataset.inputMode = mode;
    btn.setAttribute('aria-pressed', this.inputMode === mode ? 'true' : 'false');
    btn.dataset.translate = key;
    btn.textContent = getTranslation(key);
    return btn;
  }

  buildBasketPanel(store) {
    const section = document.createElement('section');
    section.className = 'chrono-basket';
    section.setAttribute('aria-labelledby', 'chrono-basket-title');
    const title = document.createElement('h3');
    title.id = 'chrono-basket-title';
    title.dataset.translate = 'chrono_basket_title';
    title.textContent = getTranslation('chrono_basket_title');
    section.appendChild(title);

    if (store.basket.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'chrono-tables-hint';
      empty.dataset.translate = 'chrono_basket_empty';
      empty.textContent = getTranslation('chrono_basket_empty');
      section.appendChild(empty);
    }

    const list = document.createElement('ul');
    list.className = 'chrono-basket-list';
    const items = [...store.basket].sort((left, right) => {
      const byDue = right.due - left.due;
      if (byDue !== 0) return byDue;
      if (left.a !== right.a) return left.a - right.a;
      return left.b - right.b;
    });
    items.forEach(item => list.appendChild(this.buildBasketItem(item)));
    list.appendChild(this.buildBasketAddChip());
    section.appendChild(list);

    if (store.basket.length > 0) {
      const clear = document.createElement('button');
      clear.type = 'button';
      clear.id = 'chrono-basket-clear';
      clear.className = 'btn btn-quiet btn-danger chrono-basket-clear';
      clear.dataset.translate = 'chrono_basket_clear';
      clear.textContent = getTranslation('chrono_basket_clear');
      section.appendChild(clear);
    }
    return section;
  }

  /** Un calcul de la liste, son badge « à revoir n fois » et sa croix pour l’enlever */
  buildBasketItem(item) {
    const li = document.createElement('li');
    li.className = 'chrono-basket-item';
    const label = document.createElement('span');
    label.className = 'chrono-basket-eq';
    label.textContent = `${item.a} × ${item.b}`;
    const due = document.createElement('span');
    const tone = basketDueClass(item.due);
    due.className = tone ? `chrono-basket-errors ${tone}` : 'chrono-basket-errors';
    due.textContent = `×${item.due}`;
    due.setAttribute('aria-label', getTranslation('chrono_basket_errors', { n: item.due }));
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'chrono-basket-remove';
    remove.dataset.removeA = String(item.a);
    remove.dataset.removeB = String(item.b);
    remove.setAttribute('aria-label', getTranslation('chrono_basket_remove'));
    remove.textContent = '×';
    li.appendChild(label);
    li.appendChild(due);
    li.appendChild(remove);
    return li;
  }

  buildBasketAddChip() {
    const li = document.createElement('li');
    li.className = 'chrono-basket-item chrono-basket-add';
    const a = this.buildFactorSelect('chrono-add-a', getTranslation('chrono_basket_add_a'));
    const times = document.createElement('span');
    times.textContent = '×';
    times.setAttribute('aria-hidden', 'true');
    const b = this.buildFactorSelect('chrono-add-b', getTranslation('chrono_basket_add_b'));
    const add = document.createElement('button');
    add.type = 'button';
    add.id = 'chrono-basket-add';
    add.className = 'chrono-basket-remove';
    add.setAttribute('aria-label', getTranslation('chrono_basket_add'));
    add.textContent = '+';
    li.appendChild(a);
    li.appendChild(times);
    li.appendChild(b);
    li.appendChild(add);
    return li;
  }

  buildFactorSelect(id, label) {
    const select = document.createElement('select');
    select.id = id;
    select.className = 'chrono-basket-factor';
    select.setAttribute('aria-label', label);
    const blank = document.createElement('option');
    blank.value = '';
    blank.textContent = '·';
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
    const a = document.getElementById('chrono-add-a')?.value;
    const b = document.getElementById('chrono-add-b')?.value;
    const { userData, store } = loadChronoStore();
    if (!addManualBasketFact(store, a, b)) return;
    persistChronoStore(userData);
    void this.rebuildSetup();
  }

  bindSetupPanel() {
    this.gameScreen?.querySelectorAll('.chrono-input-btn').forEach(btn => {
      btn.addEventListener('click', () => this.setInputMode(btn.dataset.inputMode));
    });
    this.gameScreen?.querySelectorAll('[data-remove-a]').forEach(btn => {
      btn.addEventListener('click', () => {
        const { userData, store } = loadChronoStore();
        removeFromBasket(store, { a: Number(btn.dataset.removeA), b: Number(btn.dataset.removeB) });
        persistChronoStore(userData);
        void this.rebuildSetup();
      });
    });
    document.getElementById('chrono-basket-add')?.addEventListener('click', () => {
      this.addManualBasketFactFromForm();
    });
    this.gameScreen?.querySelectorAll('.chrono-basket-factor').forEach(select => {
      select.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
          event.preventDefault();
          this.addManualBasketFactFromForm();
        }
      });
    });
    document.getElementById('chrono-basket-clear')?.addEventListener('click', () => {
      const { userData, store } = loadChronoStore();
      emptyBasket(store);
      persistChronoStore(userData);
      void this.rebuildSetup();
    });
    document.getElementById('chrono-start')?.addEventListener(
      'click',
      singleActivation(() => {
        void this.beginSession(false);
      })
    );
    document.getElementById('chrono-start-revision')?.addEventListener(
      'click',
      singleActivation(() => {
        void this.beginSession(true);
      })
    );
    document.getElementById('chrono-open-stats')?.addEventListener('click', () => {
      void this.openStatsPick();
    });
  }

  async openStatsPick() {
    this.phase = 'stats-pick';
    this.statsFocus = null;
    await this.initializeUI();
  }

  async openStatsDetail(key) {
    const parsed = parseBucketKey(key);
    if (!parsed) return;
    this.statsFocus = parsed;
    this.phase = 'stats-detail';
    await this.initializeUI();
  }

  bucketTablesText(tables) {
    if (isFullTableSet(tables)) return getTranslation('chrono_stats_tables_all');
    return getTranslation('chrono_stats_tables', { list: tablesListLabel(tables) });
  }

  bucketModeText(inputMode) {
    return getTranslation(inputMode === 'keypad' ? 'chrono_input_keypad' : 'chrono_input_mcq');
  }

  buildStatsPickPanel() {
    const { store } = loadChronoStore();
    const rows = listPlayedChronoBuckets(store);
    const panel = document.createElement('div');
    panel.className = 'chrono-setup-panel';
    const title = document.createElement('h2');
    title.dataset.translate = 'chrono_stats_pick_title';
    title.textContent = getTranslation('chrono_stats_pick_title');
    panel.appendChild(title);

    if (rows.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'chrono-tables-hint';
      empty.dataset.translate = 'chrono_stats_empty';
      empty.textContent = getTranslation('chrono_stats_empty');
      panel.appendChild(empty);
    } else {
      const hint = document.createElement('p');
      hint.className = 'chrono-tables-hint';
      hint.dataset.translate = 'chrono_stats_pick_hint';
      hint.textContent = getTranslation('chrono_stats_pick_hint');
      panel.appendChild(hint);
      const list = document.createElement('ul');
      list.className = 'chrono-stats-list';
      const openLabel = getTranslation('chrono_stats_open');
      rows.forEach(row => list.appendChild(this.buildStatsRow(row, openLabel)));
      panel.appendChild(list);
    }

    const back = document.createElement('button');
    back.type = 'button';
    back.id = 'chrono-stats-back-setup';
    back.className = 'btn btn-quiet';
    back.dataset.translate = 'chrono_back_to_setup';
    back.textContent = getTranslation('chrono_back_to_setup');
    panel.appendChild(back);
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
    const open = document.createElement('span');
    open.className = 'chrono-stats-open';
    open.dataset.translate = 'chrono_stats_open';
    open.textContent = openLabel;
    btn.setAttribute('aria-label', `${label.textContent}. ${count.textContent}. ${openLabel}`);
    btn.appendChild(copy);
    btn.appendChild(open);
    item.appendChild(btn);
    return item;
  }

  bindStatsPickPanel() {
    this.gameScreen?.querySelectorAll('[data-bucket-key]').forEach(btn => {
      btn.addEventListener('click', () => void this.openStatsDetail(btn.dataset.bucketKey));
    });
    document.getElementById('chrono-stats-back-setup')?.addEventListener('click', () => {
      void this.rebuildSetup();
    });
  }

  buildStatsDetailPanel() {
    const focus = this.statsFocus;
    if (!focus) return this.buildStatsPickPanel();
    const { store } = loadChronoStore();
    const bucket = findBucket(store, focus.tables, focus.inputMode);
    const panel = document.createElement('div');
    panel.className = 'chrono-setup-panel';
    const title = document.createElement('h2');
    title.dataset.translate = 'chrono_stats_title';
    title.textContent = getTranslation('chrono_stats_title');
    panel.appendChild(title);
    const subtitle = document.createElement('p');
    subtitle.className = 'chrono-tables-hint';
    subtitle.textContent = getTranslation('chrono_stats_row', {
      tables: this.bucketTablesText(focus.tables),
      mode: this.bucketModeText(focus.inputMode),
    });
    panel.appendChild(subtitle);
    const averageMs = sessionAverageMs(bucket);
    const average = document.createElement('p');
    average.textContent =
      averageMs == null
        ? getTranslation('chrono_session_average_none')
        : getTranslation('chrono_session_average', {
            time: formatDuration(averageMs, getCurrentLanguage()),
          });
    panel.appendChild(average);
    panel.appendChild(this.buildRanking(rankedSessions(bucket)));
    panel.appendChild(this.buildCurve(recentSessions(bucket), averageMs));
    const back = document.createElement('button');
    back.type = 'button';
    back.id = 'chrono-stats-back-pick';
    back.className = 'btn btn-quiet';
    back.dataset.translate = 'chrono_back_to_setup';
    back.textContent = getTranslation('chrono_back_to_setup');
    panel.appendChild(back);
    return panel;
  }

  bindStatsDetailPanel() {
    document.getElementById('chrono-stats-back-pick')?.addEventListener('click', () => {
      void this.openStatsPick();
    });
  }

  async rebuildSetup() {
    this.phase = 'setup';
    await this.initializeUI();
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

  tablesFromPreferences() {
    const user = UserManager.getCurrentUser();
    const enabled = TablePreferences.isGlobalEnabled(user);
    const exclusions = enabled ? TablePreferences.getActiveExclusions(user) : [];
    return includedTablesFromExclusions(exclusions, enabled);
  }

  async beginSession(revision) {
    if (this.phase !== 'setup') return;
    const { store } = loadChronoStore();
    if (revision) {
      if (store.basket.length === 0) return;
      this.isRevision = true;
      this.revisionBasket = store.basket.map(item => ({ ...item }));
    } else {
      this.selectedTables = this.tablesFromPreferences();
      this.isRevision = false;
      this.revisionBasket = [];
    }
    this.targetCount = BASE_QUESTIONS;
    this.phase = 'playing';
    this.sessionFacts = [];
    this.revisionQueue = [];
    this.sessionStartedAt = Date.now();
    this.endedAt = null;
    this.elapsedMs = 0;
    this._abandoned = false;
    this.sessionOutcome = null;
    await this.initializeUI();
    this.startElapsedTimer();
    this.generateQuestion();
  }

  /** Temps de la partie : il s’arrête à la dernière réponse, pas à l’écran des résultats */
  sessionDurationMs() {
    return (this.endedAt ?? Date.now()) - this.sessionStartedAt;
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

  getQuestionOptions() {
    // Ni un calcul déjà posé, ni son inverse : 6 × 8 ne suit pas 8 × 6, dont la correction
    // est encore affichée
    const avoid = this.sessionFacts.flatMap(fact => factKeys(fact.a, fact.b));
    const last = this.sessionFacts.at(-1);
    const recent = last ? factKeys(last.a, last.b) : [];
    const { t, n } = pickChronoPair(this.selectedTables, avoid, recent);
    return {
      operator: '×',
      type: this.inputMode === 'mcq' ? 'mcq' : 'classic',
      forceTable: t,
      forceNum: n,
      tables: [t],
      minNum: n,
      maxNum: n,
    };
  }

  generateQuestion() {
    if (!this.isRevision) {
      super.generateQuestion();
      return;
    }
    if (!this.state.isActive) return;
    try {
      this.hideContinueButton();
      const fact = takeNextRevisionFact(
        this.revisionQueue,
        this.revisionBasket,
        this.sessionFacts.at(-1)
      );
      if (!fact) {
        this.finish();
        return;
      }
      const a = Number(fact.a);
      const b = Number(fact.b);
      this.state.currentQuestion = {
        question: `${a} × ${b} = ?`,
        answer: a * b,
        type: this.inputMode === 'mcq' ? 'mcq' : 'classic',
        operator: '×',
        a,
        b,
        table: a,
        num: b,
      };
      this.displayQuestion();
      this.onQuestionGenerated();
    } catch (error) {
      this.handleError(error);
    }
  }

  generateOptions() {
    const options = super.generateOptions();
    if (this.state.currentQuestion?.type === 'true_false') return options;
    return options.map(option => ({
      value: option.value,
      display: String(option.value),
    }));
  }

  displayQuestion() {
    this.typedValue = '';
    this.optionsElement?.classList.remove('is-answered');
    super.displayQuestion();
    // La base n’efface que le texte : la classe d’erreur partirait avec la question
    this.clearFeedback();
    if (this._holdErrorFeedback) this.paintFeedback(false, this._heldErrorFact);
  }

  clearFeedback() {
    if (!this.feedbackElement) return;
    this.feedbackElement.textContent = '';
    this.feedbackElement.className = 'feedback chrono-feedback';
  }

  /**
   * Retour d’une réponse. Après une erreur, il reste affiché sous la question suivante :
   * il écrit donc le calcul en entier (« 8 × 6 = 48 »), jamais la seule réponse, qu’on
   * prendrait pour celle de la nouvelle question.
   * @param {boolean} isCorrect
   * @param {{a: number, b: number, answer: number}} [fact] - Calcul raté
   */
  paintFeedback(isCorrect, fact) {
    if (!this.feedbackElement) return;
    this.feedbackElement.textContent = '';
    const mark = isCorrect ? createCheckIcon() : createCrossIcon();
    this.feedbackElement.appendChild(mark);
    const text = document.createElement('span');
    text.textContent = isCorrect
      ? getTranslation('chrono_feedback_correct')
      : `${fact.a} × ${fact.b} = ${fact.answer}`;
    this.feedbackElement.appendChild(text);
    this.feedbackElement.className = `feedback chrono-feedback ${isCorrect ? 'feedback-success' : 'feedback-error'}`;
  }

  releaseErrorHold(generation) {
    if (generation !== this._errorHoldGen) return;
    this._holdErrorFeedback = false;
    this._heldErrorFact = null;
    if (!this.feedbackElement?.classList.contains('feedback-error')) return;
    this.clearFeedback();
  }

  onQuestionGenerated() {
    this.questionStartedAt = Date.now();
    this.typedValue = '';
    markQuestionKind(this.questionElement, this.state.currentQuestion);
    if (this.inputMode === 'mcq') tagAnswerOptions(this.optionsElement);
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
    this.detachKeyboard();
    this.optionsElement.textContent = '';
    const pad = document.createElement('div');
    pad.className = 'chrono-keypad';
    const typed = document.createElement('div');
    typed.className = 'chrono-typed';
    typed.id = 'chrono-typed';
    typed.setAttribute('aria-live', 'polite');
    typed.setAttribute('aria-label', getTranslation('chrono_typed_label'));
    typed.textContent = this.typedValue || '·';
    pad.appendChild(typed);
    const grid = document.createElement('div');
    grid.className = 'chrono-keys';
    const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'back', 0];
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
      }
      btn.addEventListener('click', () => this.applyKey(btn.dataset.key));
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
    if (/^\d$/.test(event.key)) {
      event.preventDefault();
      this.applyKey(event.key);
    }
  }

  applyKey(key) {
    if (!this.state.isActive || !this.state.currentQuestion) return;
    if (this.optionsElement?.classList.contains('is-answered')) return;
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
    if (typed) typed.textContent = this.typedValue || '·';
  }

  disableOptions() {
    super.disableOptions();
    this.optionsElement?.querySelectorAll('.chrono-key').forEach(btn => {
      btn.disabled = true;
    });
  }

  handleAnswer(userAnswer) {
    if (!this.state.isActive || !this.state.currentQuestion) return;
    const now = Date.now();
    const question = this.state.currentQuestion;
    const isCorrect = userAnswer === question.answer;
    this.sessionFacts.push({
      a: question.a ?? question.table,
      b: question.b ?? question.num,
      correct: isCorrect,
      ms: now - this.questionStartedAt,
    });
    this.detachKeyboard();
    super.handleAnswer(userAnswer);
    // La dernière réponse arrête le chrono : l’affichage qui la suit ne compte pas
    if (!this.shouldContinue()) this.endedAt = now;
  }

  onAnswerSubmitted(isCorrect) {
    if (!isCorrect) return;
    const question = this.state.currentQuestion;
    const { userData } = loadChronoStore();
    grantChronoCoins(userData);
    persistChronoStore(userData);
    updateCoinDisplay();
    const coinIcon = document.querySelector('.coin-count');
    if (coinIcon) showCoinGainAnimation(coinIcon);
    // Partie normale seulement : une révision répète les mêmes calculs. Après
    // l’enregistrement : le profil, réécrit en entier, effacerait sa récompense
    if (!this.isRevision) updateDailyChallengeProgress(question.table, question.num);
  }

  showAnswerFeedback(isCorrect, userAnswer) {
    if (!this.feedbackElement) return;
    const question = this.state.currentQuestion;
    const correctAnswer = question.answer;
    if (this.inputMode === 'mcq') {
      markAnswerOptions(this.optionsElement, correctAnswer, userAnswer);
    }
    this.optionsElement?.classList.add('is-answered');
    if (isCorrect) {
      this._holdErrorFeedback = false;
      this._heldErrorFact = null;
      this.paintFeedback(true);
      playSound('good');
      return;
    }
    const fact = {
      a: question.a ?? question.table,
      b: question.b ?? question.num,
      answer: correctAnswer,
    };
    this.paintFeedback(false, fact);
    playSound('bad', { volume: BAD_SOUND_VOLUME });
    this._holdErrorFeedback = true;
    this._heldErrorFact = fact;
    this._errorHoldGen += 1;
    const generation = this._errorHoldGen;
    this.addTimer(() => this.releaseErrorHold(generation), ERROR_HOLD_MS);
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
    if (this._abandoned || this.isRevision) return;
    if (this.sessionFacts.length === 0) return;
    const { userData, store } = loadChronoStore();
    this.sessionOutcome = saveChronoSession(store, {
      tables: this.selectedTables,
      inputMode: this.inputMode,
      durationMs: this.sessionDurationMs(),
      date: Date.now(),
      facts: this.sessionFacts,
    });
    persistChronoStore(userData);
  }

  showResults() {
    const shown = goToSlide(5);
    const resultsScreen = document.getElementById('results');
    if (!resultsScreen) return;
    const { store } = loadChronoStore();
    const bucket = this.isRevision ? null : findBucket(store, this.selectedTables, this.inputMode);
    this.resultsPane = 'session';
    this.lastSnapshot = {
      durationMs: this.sessionDurationMs(),
      facts: [...this.sessionFacts],
      isRevision: this.isRevision,
      outcome: this.sessionOutcome,
      averageMs: sessionAverageMs(bucket),
      ranking: rankedSessions(bucket),
      curve: recentSessions(bucket),
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
   * Phrase sous le temps : le temps moyen, une fois la première partie passée. Une révision
   * n’a pas de classement, donc pas de moyenne.
   * @returns {{message: string, details: string[]}}
   */
  resultsMessages(result, lang) {
    if (result.isRevision) return { message: '', details: [] };
    if (!result.outcome || result.outcome.first) {
      return { message: getTranslation('chrono_session_average_none'), details: [] };
    }
    return {
      message: getTranslation('chrono_session_average', {
        time: formatDuration(result.averageMs, lang),
      }),
      details: [],
    };
  }

  buildSessionActions(result) {
    const buttons = [
      {
        label: getTranslation('chrono_play_again'),
        action: 'play-again',
        primary: true,
        onActivate: () => relaunchChrono({ revision: false }),
      },
    ];
    if (result.basketSize > 0) {
      buttons.push({
        label: getTranslation('chrono_start_revision'),
        action: 'revise',
        onActivate: () => relaunchChrono({ revision: true }),
      });
    }
    if (!result.isRevision) {
      buttons.push({
        label: getTranslation('chrono_stats_button'),
        action: 'stats',
        onActivate: () => this.openResultsPane('stats'),
      });
    }
    buttons.push({
      label: getTranslation('back_to_home'),
      action: 'back-to-home',
      onActivate: () => void goToSlide(1),
    });
    return createResultsActions(buttons);
  }

  renderStats(result) {
    const container = document.createElement('section');
    container.className = 'results-container content-card game-results chrono-results';
    container.setAttribute('aria-label', getTranslation('chrono_stats_title'));
    const title = document.createElement('h2');
    title.dataset.translate = 'chrono_stats_title';
    title.textContent = getTranslation('chrono_stats_title');
    container.appendChild(title);
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
    const wrap = document.createElement('section');
    const title = document.createElement('h3');
    title.dataset.translate = 'chrono_facts_title';
    title.textContent = getTranslation('chrono_facts_title');
    wrap.appendChild(title);
    const list = document.createElement('ol');
    list.className = 'chrono-facts';
    facts.forEach(fact => {
      const li = document.createElement('li');
      li.className = fact.correct ? 'chrono-fact is-correct' : 'chrono-fact is-wrong';
      const equation = document.createElement('span');
      equation.className = 'chrono-fact-eq';
      equation.textContent = `${fact.a} × ${fact.b}`;
      const time = document.createElement('span');
      time.className = 'chrono-fact-time';
      time.textContent = formatDuration(fact.ms, lang);
      const mark = fact.correct ? createCheckIcon() : createCrossIcon();
      mark.classList.add('chrono-fact-mark');
      mark.setAttribute(
        'aria-label',
        getTranslation(fact.correct ? 'chrono_fact_ok' : 'chrono_fact_ko')
      );
      li.appendChild(equation);
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
    const wrap = document.createElement('section');
    const title = document.createElement('h3');
    title.dataset.translate = 'chrono_ranking_title';
    title.textContent = getTranslation('chrono_ranking_title');
    wrap.appendChild(title);
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
    const wrap = document.createElement('section');
    const title = document.createElement('h3');
    title.dataset.translate = 'chrono_curve_title';
    title.textContent = getTranslation('chrono_curve_title');
    wrap.appendChild(title);
    wrap.appendChild(this.drawCurve(sessions, averageMs));
    return wrap;
  }

  drawCurve(sessions, averageMs) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'chrono-curve');
    svg.setAttribute('viewBox', '0 0 340 132');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', getTranslation('chrono_curve_title'));
    if (!sessions.length) return svg;

    const times = sessions.map(session => Number(session.durationMs) || 0);
    const rawMax = Math.max(...times, Number(averageMs) || 0, 1);
    const max = niceDurationMaxMs(rawMax);
    const left = 44;
    const right = 328;
    const top = 10;
    const bottom = 104;
    const plotHeight = bottom - top;
    const plotWidth = right - left;
    const yOf = ms => bottom - (ms / max) * plotHeight;
    const xOf = index =>
      times.length === 1 ? (left + right) / 2 : left + (index / (times.length - 1)) * plotWidth;

    const ticks = 4;
    for (let i = 0; i <= ticks; i += 1) {
      const value = (max * i) / ticks;
      const y = yOf(value);
      svg.appendChild(
        this.svgEl('line', {
          x1: left,
          x2: right,
          y1: y,
          y2: y,
          stroke: 'currentColor',
          'stroke-width': '1',
          opacity: '0.2',
        })
      );
      const label = this.svgEl('text', {
        x: left - 6,
        y,
        'text-anchor': 'end',
        'dominant-baseline': 'middle',
        fill: 'currentColor',
        'font-size': '9',
      });
      label.textContent = formatAxisSeconds(value);
      svg.appendChild(label);
    }

    svg.appendChild(
      this.svgEl('line', {
        x1: left,
        x2: left,
        y1: top,
        y2: bottom,
        stroke: 'currentColor',
        'stroke-width': '1',
        opacity: '0.45',
      })
    );
    svg.appendChild(
      this.svgEl('line', {
        x1: left,
        x2: right,
        y1: bottom,
        y2: bottom,
        stroke: 'currentColor',
        'stroke-width': '1',
        opacity: '0.45',
      })
    );

    times.forEach((_, index) => {
      const label = this.svgEl('text', {
        x: xOf(index),
        y: bottom + 14,
        'text-anchor': 'middle',
        fill: 'currentColor',
        'font-size': '9',
      });
      label.textContent = String(index + 1);
      svg.appendChild(label);
    });

    const polyline = this.svgEl('polyline', {
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      points: times.map((ms, index) => `${xOf(index)},${yOf(ms)}`).join(' '),
    });
    svg.appendChild(polyline);
    // Un point par partie : une seule partie se voit aussi (une ligne d’un point ne se trace pas)
    times.forEach((ms, index) => {
      svg.appendChild(
        this.svgEl('circle', { cx: xOf(index), cy: yOf(ms), r: 3, fill: 'currentColor' })
      );
    });

    if (averageMs != null) {
      const y = yOf(averageMs);
      svg.appendChild(
        this.svgEl('line', {
          x1: left,
          x2: right,
          y1: y,
          y2: y,
          stroke: 'currentColor',
          'stroke-width': '1.5',
          'stroke-dasharray': '4 4',
          opacity: '0.7',
        })
      );
    }
    return svg;
  }

  svgEl(name, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', name);
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, String(value)));
    return el;
  }
}

let _chronoModeInstance = null;

/**
 * @param {{autoStart?: boolean, revision?: boolean}} [options] - Voir le constructeur
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
