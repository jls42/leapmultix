/**
 * Mode Découverte : le laboratoire des tables (×) et des opérations (+, −, ÷)
 *
 * - Choix d'une table ou d'un niveau, puis exploration
 * - Égalités à toucher, montrées en points, en bonds (dizaines puis unités) ou en comptage
 * - Astuce de la table, donnée par la mascotte du joueur
 * - Ligne numérique, exploration visuelle et manipulation (poser un nombre)
 *
 * Tous les nombres montrés restent dans les limites du niveau choisi, et les tirages
 * d'une visite (exemples, premier terme de la manipulation) ne changent pas tant que
 * l'enfant reste sur la même table ou le même niveau.
 */

import { GameMode } from '../core/GameMode.js';
import { getTranslation, speak } from '../utils-es6.js';
import { UserState } from '../core/userState.js';
import { getOperation } from '../core/operations/OperationRegistry.js';
import { appendSanitizedHTML } from '../security-utils.js';
import { randomInt } from '../core/random.js';
import {
  keepNumbersTogether,
  preferredScrollBehavior,
  scrollToScreenTop,
  singleActivation,
} from '../ui-feedback.js';

/** Avatars qui ont une tête illustrée (assets/images/arcade/<id>_head_avatar_128x128.png) */
const MASCOT_AVATARS = new Set(['fox', 'panda', 'unicorn', 'dragon', 'astronaut']);

/** Niveaux des opérations +, −, ÷ (le × se choisit par table) */
const LEVELS = ['easy', 'medium', 'hard'];

/** Barres pleines du niveau : il se lit sans savoir lire */
const LEVEL_BARS = { easy: 1, medium: 2, hard: 3 };

/**
 * Plus grand nombre rencontré à chaque niveau, par opération
 * (reflète generateOperands dans js/core/operations/*.js)
 */
const LEVEL_MAX = {
  '+': { easy: 10, medium: 20, hard: 40 },
  '−': { easy: 10, medium: 20, hard: 50 },
  '÷': { easy: 50, medium: 100, hard: 144 },
};

/**
 * Égalités du carrousel (+, −) : chaque niveau commence où finit le précédent,
 * pas de « 1 + 4 » en Difficile. Bornes incluses.
 */
const EXAMPLE_BANDS = {
  '+': {
    easy: { a: [1, 5], b: [1, 5], result: [2, 10] },
    medium: { a: [1, 10], b: [1, 10], result: [11, 20] },
    hard: { a: [1, 20], b: [1, 20], result: [21, 40] },
  },
  '−': {
    easy: { a: [2, 10], b: [1, 9], result: [1, 9] },
    medium: { a: [11, 20], b: [1, 19], result: [1, 19] },
    hard: { a: [21, 50], b: [1, 49], result: [1, 49] },
  },
};

/**
 * Exploration visuelle (+, −) : les plus grands exemples qui se dessinent encore en
 * points (deux groupes de 10 au plus pour +, rangées de 10 pour −)
 */
const VISUAL_BANDS = {
  '+': {
    easy: { a: [1, 5], b: [1, 5], result: [2, 10] },
    medium: { a: [2, 10], b: [2, 10], result: [11, 20] },
    hard: { a: [2, 10], b: [2, 10], result: [11, 20] },
  },
  '−': {
    easy: { a: [2, 10], b: [1, 5], result: [1, 9] },
    medium: { a: [11, 20], b: [2, 10], result: [1, 18] },
    hard: { a: [11, 20], b: [2, 10], result: [1, 18] },
  },
};

/**
 * Division : on explore la « table » d'un diviseur tiré dans la plage du niveau
 * (5 ÷ 5, 10 ÷ 5… 50 ÷ 5) ; le plus grand dividende reste sous le maximum du niveau.
 */
const DIVISION_LEVELS = {
  easy: { divisor: [2, 5], quotient: [1, 10] },
  medium: { divisor: [6, 10], quotient: [1, 10] },
  hard: { divisor: [11, 12], quotient: [3, 12] },
};

/**
 * Manipulation (+, −) : premier terme fixé pour la visite et affiché d'emblée,
 * nombres à poser choisis pour que le résultat reste dans le niveau (jamais négatif).
 */
const DROP_PLANS = {
  '+': {
    easy: { first: [1, 5], items: [1, 5] },
    medium: { first: [6, 10], items: [1, 10] },
    hard: { first: [21, 30], items: [1, 10] },
  },
  '−': {
    easy: { first: [10, 10], items: [1, 10] },
    medium: { first: [11, 20], items: [1, 10] },
    hard: { first: [21, 50], items: [1, 10] },
  },
};

/** Ligne numérique : un exemple par niveau ; en Moyen et Difficile, le bond passe la dizaine */
const NUMBER_LINE_EXAMPLES = {
  '+': { easy: [5, 4], medium: [8, 5], hard: [26, 7] },
  '−': { easy: [9, 4], medium: [14, 6], hard: [42, 7] },
};

/** Graduations d'une ligne numérique de bonds (16 nombres) */
const JUMP_LINE_SPAN = 15;

/** Exemples par écran (carrousel, exploration visuelle) */
const EXAMPLE_COUNT = 10;

/** Déplacement du doigt (px) au-delà duquel un toucher devient un glisser */
const TOUCH_DRAG_THRESHOLD = 8;

const CHECK_ICON =
  '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">' +
  '<path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="currentColor" stroke-width="2.5" ' +
  'stroke-linecap="round" stroke-linejoin="round"/></svg>';

/**
 * Traduit une clé ; si elle manque (getTranslation renvoie alors « [clé] »),
 * renvoie le repli fourni au lieu d'afficher ou de prononcer le nom de la clé.
 * @param {string} key
 * @param {Object} params
 * @param {string} fallback
 * @returns {string}
 */
function translateOr(key, params, fallback) {
  const value = getTranslation(key, params);
  if (typeof value !== 'string' || value === '' || /^\[[^\]]+\]$/.test(value)) {
    return fallback;
  }
  return value;
}

/**
 * Entiers de min à max, bornes incluses
 * @param {number} min
 * @param {number} max
 * @returns {number[]}
 */
function range(min, max) {
  return Array.from({ length: Math.max(0, max - min + 1) }, (_, i) => min + i);
}

/**
 * Points dessinés en CSS (même vocabulaire partout : tuiles, animations, partage)
 * @param {number} count
 * @param {string} [extraClass]
 * @returns {string}
 */
function dotsHTML(count, extraClass = '') {
  const className = extraClass ? `visual-object ${extraClass}` : 'visual-object';
  return `<span class="${className}"></span>`.repeat(Math.max(0, count));
}

/**
 * Flèche décorative d'une suite (« 7 → 14 ») : masquée aux lecteurs d'écran
 * @returns {HTMLSpanElement}
 */
function createArrow() {
  const arrow = document.createElement('span');
  arrow.className = 'calc-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '→';
  return arrow;
}

// Écoute tactile qui peut annuler le défilement (glisser-déposer des nombres)
const TACTILE_ACTIF = { passive: false };

/**
 * Points d'une ligne numérique : chacun porte sa position et son état
 * (départ, arrivée, sur le chemin parcouru).
 * @param {number[]} valeurs
 * @param {{depart: number, arrivee: number, low: number, high: number, position: Function}} options
 * @returns {string[]}
 */
function pointsDeLigne(valeurs, { depart, arrivee, low, high, position }) {
  return valeurs.map(value => {
    const classes = ['number-point'];
    if (value === depart) classes.push('highlight-start');
    if (value === arrivee) classes.push('highlight-end');
    if (value > low && value < high) classes.push('in-path');
    return `
                <div class="${classes.join(' ')}" data-value="${value}" style="left: ${position(value)}%">
                  <div class="point-marker"></div>
                  <div class="point-label">${value}</div>
                </div>`;
  });
}

/**
 * Arcs de saut au-dessus de la ligne, dans le sens de l'opération.
 * @param {Array<{from: number, to: number, step: number}>} sauts
 * @param {{isAddition: boolean, position: Function}} options
 * @returns {string[]}
 */
function arcsDeSauts(sauts, { isAddition, position }) {
  const signe = isAddition ? '+' : '−';
  const sens = isAddition ? 'right' : 'left';
  return sauts.map(
    jump => `
                <div class="jump-arrow jump-arrow-${sens}" style="left: ${position(Math.min(jump.from, jump.to))}%; width: ${(jump.step / JUMP_LINE_SPAN) * 100}%;">
                  <span class="jump-label">${signe}${jump.step}</span>
                </div>`
  );
}

/**
 * Nombre lu dans un glisser-déposer, NaN si le transfert n'en porte pas.
 * @param {DataTransfer} [dataTransfer]
 * @returns {number}
 */
function nombreTransfere(dataTransfer) {
  try {
    const texte = dataTransfer?.getData('text/plain') || dataTransfer?.getData('text') || '';
    return Number.parseInt(texte, 10);
  } catch {
    return Number.NaN;
  }
}

// Quand une opération se montre : au-delà, les jetons deviennent illisibles
const VISUALISABLE = {
  '×': (a, b) => a <= 10 && b <= 10,
  '+': (a, b) => a <= 10 && b <= 10,
  '−': (a, b) => a <= 20 && b <= a,
  '÷': (a, b, operation) => a <= 20 && Number.isInteger(operation.compute(a, b)),
};

export class DiscoveryMode extends GameMode {
  constructor() {
    super('discovery', {
      maxQuestions: 0, // Pas de questions directes (exploration libre)
      hasTimer: false,
      hasLives: false,
      hasStreaks: false,
      autoProgress: false,
      showScore: false,
    });

    // État spécifique au Discovery
    this.currentTable = null;
    this.currentLevel = null; // Pour +, −, ÷ : 'easy', 'medium', 'hard'
    this.phase = 'selection'; // selection, exploration
    this.exploredTables = [];
    this.draggedElement = null;
    this.touchClone = null;

    // Opération courante (injectée depuis UserState)
    this.operator = '×'; // Default
    this.operation = null;

    /** Tirages de la visite (exemples, manipulation), gardés au changement de langue */
    this._plan = null;
    /** .content-card du dernier rendu : toutes les recherches du mode s'y limitent */
    this._root = null;
    /** Rendus mis en file : jamais deux constructions de l'écran en même temps.
     *  La file naît au premier rendu, pas ici : un constructeur ne lance rien. */
    this._renderQueue = null;
    /** Mode arrêté : un rendu encore en file ne redessine plus rien */
    this._stopped = false;
    /** Début d'un toucher sur un nombre, pour distinguer un toucher d'un glisser */
    this._touchStart = null;
  }

  /**
   * Démarrer (une instance arrêtée puis relancée redessine de nouveau)
   */
  async start() {
    this._stopped = false;
    return super.start();
  }

  /**
   * Lit l'opération choisie ; un symbole inconnu retombe sur la multiplication
   * @private
   */
  _loadOperation() {
    const userData = UserState.getCurrentUserData();
    this.operation = getOperation(userData?.preferredOperator || '×');
    this.operator = this.operation.symbol;
  }

  /**
   * Initialisation spécifique du Discovery
   */
  async onStart() {
    this._loadOperation();

    // Commencer par la sélection de table/niveau
    this.phase = 'selection';
    this.loadExploredTables();

    console.log(
      `🧪 Mode Discovery démarré - Laboratoire ${this.operation.name} (${this.operator})`
    );
  }

  /**
   * Arrêt : les rendus encore en file sont abandonnés
   */
  onStop() {
    this._stopped = true;
  }

  /**
   * HTML personnalisé pour le Discovery
   */
  async getCustomHTML() {
    // S'assurer que l'opérateur est initialisé
    if (!this.operation) {
      this._loadOperation();
    }

    if (this.phase === 'selection') {
      // GameMode.start() construit l'interface avant onStart() :
      // on relit ici les tables déjà explorées pour afficher leurs coches.
      this.loadExploredTables();
      return this.getTableSelectionHTML();
    }
    return this.getTableExplorationHTML();
  }

  // ======================================
  // RENDU
  // ======================================

  /**
   * Construire l'écran. Les rendus passent un par un : un changement de langue en
   * demande deux d'affilée (eventBus puis window), et GameMode vide #game avant
   * d'attendre un import ; en parallèle, deux écrans s'empilaient.
   * @returns {Promise<void>}
   */
  initializeUI() {
    const render = () => this._renderUI();
    // La file démarre au premier rendu, pas dans le constructeur. L'enchaînement
    // reste le même : chaque rendu attend le précédent, abouti ou non.
    this._renderQueue = (this._renderQueue ?? Promise.resolve()).then(render, render);
    return this._renderQueue;
  }

  /**
   * Un rendu : la carte de GameMode, puis ses écouteurs, posés sur cette carte seulement
   * @private
   */
  async _renderUI() {
    if (this._stopped) return;
    await super.initializeUI();
    const cards = [...(this.gameScreen?.children ?? [])].filter(child =>
      child.classList.contains('content-card')
    );
    this._root = cards[cards.length - 1] ?? null;
    if (!this._root) return;

    if (this.phase === 'selection') {
      this.setupTableSelection(this._root);
    } else {
      this.setupTableExploration(this._root);
    }
  }

  /**
   * Portée des recherches : la carte affichée par ce mode (le document avant le rendu)
   * @returns {ParentNode}
   * @private
   */
  _scope() {
    return this._root?.isConnected ? this._root : document;
  }

  /** @private */
  _find(selector) {
    return this._scope().querySelector(selector);
  }

  /** @private */
  _findAll(selector) {
    return [...this._scope().querySelectorAll(selector)];
  }

  // ======================================
  // CHOIX DE LA TABLE OU DU NIVEAU
  // ======================================

  /**
   * HTML de sélection de table (×) ou niveau (+, −, ÷)
   */
  getTableSelectionHTML() {
    if (this.operator === '×') {
      return `
            <div class="discovery-lab">
                <p class="discovery-intro">${getTranslation('discovery_lab_intro')}</p>
                <div class="lab-selector lab-selector--tables" id="table-selector">
                    ${range(1, 10)
                      .map(num => this._renderTableTile(num))
                      .join('')}
                </div>
            </div>
        `;
    }

    // Addition, soustraction, division : l'écran dit de quelle opération il s'agit
    const name = this.operation.name;
    const title = translateOr(`discovery_levels_title_${name}`, {}, this._getOperationName());
    const intro = translateOr(
      `discovery_levels_intro_${name}`,
      {},
      getTranslation('discovery_lab_intro_operations')
    );
    return `
            <div class="discovery-lab">
                <h2 class="discovery-lab-title" tabindex="-1">${title}</h2>
                <p class="discovery-intro">${intro}</p>
                <div class="lab-selector lab-selector--levels" id="level-selector">
                    ${LEVELS.map(level => this._renderLevelTile(level)).join('')}
                </div>
            </div>
        `;
  }

  /**
   * Tuile d'une table : la quantité en points, le nom, la coche si déjà explorée
   * @param {number} num
   * @returns {string}
   * @private
   */
  _renderTableTile(num) {
    return `
                    <button type="button" class="lab-item" data-table="${num}">
                        ${this._renderQuantityDots(num)}
                        <span class="lab-name">${getTranslation('table_of')}\u00A0${num}</span>
                        ${this._renderExploredMark(num)}
                    </button>
    `;
  }

  /**
   * Tuile d'un niveau : le signe de l'opération, des barres de niveau, le nom et l'étendue
   * @param {string} level - easy, medium ou hard
   * @returns {string}
   * @private
   */
  _renderLevelTile(level) {
    return `
                    <button type="button" class="lab-item" data-level="${level}">
                        <span class="lab-symbol" aria-hidden="true">${this.operation.symbol}</span>
                        ${this._renderLevelBars(level)}
                        <span class="lab-name">${getTranslation(`difficulty_${level}`)}</span>
                        <span class="lab-range">${this._getLevelRangeLabel(level)}</span>
                        ${this._renderExploredMark(level)}
                    </button>
    `;
  }

  /**
   * Trois barres montantes, remplies jusqu'au niveau (1, 2 ou 3)
   * @param {string} level
   * @returns {string}
   * @private
   */
  _renderLevelBars(level) {
    const filled = LEVEL_BARS[level] || 1;
    const bars = [1, 2, 3]
      .map(i => `<span class="lab-level-bar${i <= filled ? ' is-on' : ''}"></span>`)
      .join('');
    return `<span class="lab-level" aria-hidden="true">${bars}</span>`;
  }

  /**
   * Points représentant la table (7 points pour la table de 7), par rangées de 5
   * @param {number} count
   * @returns {string}
   * @private
   */
  _renderQuantityDots(count) {
    return `<span class="lab-dots" aria-hidden="true">${'<span class="lab-dot"></span>'.repeat(count)}</span>`;
  }

  /**
   * Coche « déjà explorée » : une forme, doublée d'un texte pour les lecteurs d'écran
   * @param {number|string} id - Table (×) ou niveau (+, −, ÷)
   * @returns {string}
   * @private
   */
  _renderExploredMark(id) {
    if (!this.exploredTables.includes(this._exploredKey(id))) return '';
    const generic = translateOr('discovery_explored', {}, '');
    // « Déjà explorée » s'accorde avec la table ; « Déjà exploré » avec le niveau
    const label =
      this.operator === '×' ? translateOr('discovery_explored_table', {}, generic) : generic;
    const srText = label ? `<span class="sr-only">${label}</span>` : '';
    return `<span class="explored-badge">${CHECK_ICON}${srText}</span>`;
  }

  /**
   * Étendue d'un niveau en mots (« jusqu'à 20 ») plutôt qu'en symboles
   * @param {string} levelId - easy, medium ou hard
   * @returns {string}
   * @private
   */
  _getLevelRangeLabel(levelId) {
    const max = LEVEL_MAX[this.operator]?.[levelId];
    if (!max) return '';
    return translateOr('discovery_range_up_to', { max }, `≤\u00A0${max}`);
  }

  /**
   * Nom de l'opération (« Addition », « Soustraction »…)
   * @returns {string}
   * @private
   */
  _getOperationName() {
    const name = this.operation?.name || '';
    return translateOr(`operation_${name}`, {}, name);
  }

  /**
   * Nom de l'opération avec son article (« l'addition », « la division »…)
   * @returns {string}
   * @private
   */
  _getOperationWithArticle() {
    const keys = { '+': 'the_addition', '−': 'the_subtraction', '÷': 'the_division' };
    const key = keys[this.operator];
    return key ? translateOr(key, {}, this.operation.name) : this.operation.name;
  }

  // ======================================
  // EXPLORATION
  // ======================================

  /**
   * HTML d'exploration de table (×) ou niveau (+, −, ÷)
   */
  getTableExplorationHTML() {
    const isMultiplication = this.operator === '×';
    const identifier = isMultiplication ? this.currentTable : this.currentLevel;

    // Si pas de table ni de niveau sélectionné, retourner vide (on reste en sélection)
    if (!identifier) {
      console.warn('⚠️ getTableExplorationHTML appelé sans table ni niveau');
      return '';
    }

    const { title, intro } = this._getExplorationTexts();

    return `
            <div class="discovery-lab">
                <h2 class="discovery-lab-title" tabindex="-1">${title}</h2>
                <div class="lab-experiment">
                    <p class="experiment-description">${intro}</p>

                    <!-- Les égalités de la table (ou des exemples du niveau) -->
                    <div class="multiplication-carousel">
                        ${this.generateCarouselHTML()}
                    </div>

                    <!-- Zone d'animation dynamique -->
                    <div class="animation-area">
                        <p class="animation-title">${getTranslation('discovery_click_operation')}</p>
                        <div id="animation-container" class="animation-container"></div>
                    </div>

                    ${isMultiplication ? this._renderMnemonicHTML() : ''}
                </div>

                ${this.generateNumberLineHTML()}
                ${this.generateVisualExplorationHTML()}
                ${this.generateInteractionHTML()}

                <div class="button-row">
                    <button type="button" id="discovery-table-back-btn" class="btn">
                        ${isMultiplication ? getTranslation('back_to_tables') : getTranslation('back_to_levels')}
                    </button>
                    <button type="button" id="discovery-home-btn" class="btn btn-secondary">
                        ${getTranslation('back_to_home')}
                    </button>
                </div>
            </div>
        `;
  }

  /**
   * Titre et phrase d'accueil de l'exploration
   * @returns {{title: string, intro: string}}
   * @private
   */
  _getExplorationTexts() {
    if (this.operator === '×') {
      return {
        title: getTranslation('discovery_lab_title', { table: this.currentTable }),
        intro: getTranslation('discovery_explore_intro', { table: this.currentTable }),
      };
    }
    // « Addition – Facile » : l'opération d'abord, puis le niveau choisi
    const operation = this._getOperationName();
    const level = getTranslation(`difficulty_${this.currentLevel}`);
    return {
      title: translateOr('discovery_level_title', { operation, level }, `${operation} – ${level}`),
      intro: getTranslation('discovery_explore_intro_operation', {
        operation: this._getOperationWithArticle(),
      }),
    };
  }

  /**
   * Astuce de la table, donnée par la mascotte du joueur. Ses égalités ne se coupent
   * pas en fin de ligne (« une semaine = 7 jours »).
   * @returns {string}
   * @private
   */
  _renderMnemonicHTML() {
    const tip = keepNumbersTogether(getTranslation(`mnemonic_${this.currentTable}`));
    return `
                    <div class="mnemonic-tip">
                        <img class="mnemonic-mascot" src="${this._getMascotHeadSrc()}" alt="" width="56" height="56" />
                        <div class="mnemonic-body">
                            <h3>${getTranslation('hint')}</h3>
                            <p>${tip}</p>
                        </div>
                    </div>
    `;
  }

  /**
   * Tête illustrée de l'avatar du joueur (renard par défaut)
   * @returns {string}
   * @private
   */
  _getMascotHeadSrc() {
    const avatar = UserState.getCurrentUserData()?.avatar;
    const id = MASCOT_AVATARS.has(avatar) ? avatar : 'fox';
    return `assets/images/arcade/${id}_head_avatar_128x128.png`;
  }

  /**
   * Générer le carrousel des opérations : une touche par égalité
   */
  generateCarouselHTML() {
    return this._getPlan()
      .examples.map(
        ({ a, b, result }) => `
                <button type="button" class="carousel-item" data-a="${a}" data-b="${b}">
                    <span class="equation-display">${a} ${this.operation.symbol} ${b} = ${result}</span>
                </button>
            `
      )
      .join('');
  }

  // ======================================
  // TIRAGES D'UNE VISITE
  // ======================================

  /**
   * Tirages de la visite en cours : même table ou même niveau, mêmes exemples
   * (un changement de langue redessine l'écran sans rien tirer de nouveau)
   * @returns {{key: string, examples: Array, visual: Array, drop: Object}}
   * @private
   */
  _getPlan() {
    const key =
      this.operator === '×'
        ? `×:${this.currentTable}`
        : `${this.operator}:${this._currentLevelOrEasy()}`;
    if (this._plan?.key !== key) {
      this._plan = { key, ...this._buildPlan() };
    }
    return this._plan;
  }

  /** @private */
  _currentLevelOrEasy() {
    return LEVELS.includes(this.currentLevel) ? this.currentLevel : 'easy';
  }

  /**
   * @returns {{examples: Array, visual: Array, drop: Object}}
   * @private
   */
  _buildPlan() {
    if (this.operator === '×') {
      const table = this.currentTable;
      const examples = range(1, 10).map(b => this._example(table, b));
      return {
        examples,
        visual: examples,
        drop: { fixed: 'a', value: table, items: range(1, 10) },
      };
    }

    const level = this._currentLevelOrEasy();
    if (this.operator === '÷') {
      const { divisor, quotient } = DIVISION_LEVELS[level];
      const d = randomInt(divisor[0], divisor[1]);
      const examples = range(quotient[0], quotient[1]).map(q => this._example(d * q, d));
      return {
        examples: examples.slice(0, EXAMPLE_COUNT),
        visual: this._pickSorted(this._divisionVisualPool(), EXAMPLE_COUNT),
        drop: { fixed: 'b', value: d, items: examples.map(ex => ex.a).slice(0, EXAMPLE_COUNT) },
      };
    }

    const drop = DROP_PLANS[this.operator][level];
    return {
      examples: this._pickSorted(
        this._bandPool(EXAMPLE_BANDS[this.operator][level]),
        EXAMPLE_COUNT
      ),
      visual: this._pickSorted(this._bandPool(VISUAL_BANDS[this.operator][level]), EXAMPLE_COUNT),
      drop: {
        fixed: 'a',
        value: randomInt(drop.first[0], drop.first[1]),
        items: range(drop.items[0], drop.items[1]),
      },
    };
  }

  /**
   * @param {number} a
   * @param {number} b
   * @returns {{a: number, b: number, result: number}}
   * @private
   */
  _example(a, b) {
    return { a, b, result: this.operation.compute(a, b) };
  }

  /**
   * Toutes les égalités d'une bande ; pour l'addition, 3 + 5 et 5 + 3 ne comptent
   * qu'une fois (le plus grand nombre d'abord : on compte à partir de lui)
   * @param {{a: number[], b: number[], result: number[]}} band
   * @returns {Array<{a: number, b: number, result: number}>}
   * @private
   */
  _bandPool(band) {
    const pool = new Map();
    for (const x of range(band.a[0], band.a[1])) {
      for (const y of range(band.b[0], band.b[1])) {
        const pair = this.operator === '+' ? [Math.max(x, y), Math.min(x, y)] : [x, y];
        const example = this._example(pair[0], pair[1]);
        const inBand = example.result >= band.result[0] && example.result <= band.result[1];
        if (inBand) pool.set(`${pair[0]}|${pair[1]}`, example);
      }
    }
    return [...pool.values()];
  }

  /**
   * Petites divisions (au plus 20 points) : de 2 à 5 parts de 1 à 4 points
   * @returns {Array<{a: number, b: number, result: number}>}
   * @private
   */
  _divisionVisualPool() {
    return range(2, 5).flatMap(b => range(1, 4).map(q => this._example(b * q, b)));
  }

  /**
   * Tire sans remise, puis range par premier nombre, puis par second
   * @param {Array<{a: number, b: number}>} pool
   * @param {number} count
   * @returns {Array}
   * @private
   */
  _pickSorted(pool, count) {
    const picked = [...pool];
    const total = Math.min(count, picked.length);
    for (let i = 0; i < total; i++) {
      const j = randomInt(i, picked.length - 1);
      [picked[i], picked[j]] = [picked[j], picked[i]];
    }
    return picked.slice(0, total).sort((x, y) => x.a - y.a || x.b - y.b);
  }

  // ======================================
  // LIGNE NUMÉRIQUE ET PARTAGE
  // ======================================

  /**
   * Générer la ligne numérique ou visualisation adaptée selon l'opération
   */
  generateNumberLineHTML() {
    if (this.operator === '×') {
      return this._generateMultiplicationNumberLine();
    }
    if (this.operator === '÷') {
      return this._generateDivisionVisualization();
    }
    return this._generateJumpNumberLine();
  }

  /**
   * Ligne numérique pour multiplication (sauts de multiples)
   * @private
   */
  _generateMultiplicationNumberLine() {
    const table = this.currentTable;
    const maxValue = table * 10;

    return `
      <div class="number-line-section">
        <h3>${getTranslation('number_line_title')}</h3>
        <div class="number-line-container">
          <div class="number-line">
            ${range(0, 10)
              .map(i => {
                const value = this.operation.compute(table, i);
                return `
                <div class="number-point ${i === 0 ? 'start' : ''}"
                     data-value="${value}"
                     style="left: ${(value / maxValue) * 100}%">
                  <div class="point-marker"></div>
                  <div class="point-label">${value}</div>
                  <div class="point-equation">${table}${this.operation.symbol}${i}</div>
                </div>
              `;
              })
              .join('')}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Bonds d'un calcul sur la ligne numérique : les dizaines d'abord, puis les unités,
   * avec un arrêt à la dizaine ronde quand on la franchit
   * (16 + 17 : 16 → 26 → 30 → 33 ; 23 − 8 : 23 → 20 → 15).
   * @param {number} a
   * @param {number} b
   * @returns {Array<{from: number, to: number, step: number}>}
   */
  getJumps(a, b) {
    const sign = this.operator === '−' ? -1 : 1;
    const jumps = [];
    let current = a;
    const leap = step => {
      jumps.push({ from: current, to: current + sign * step, step });
      current += sign * step;
    };

    const tens = Math.floor(b / 10) * 10;
    if (tens > 0) leap(tens);

    let units = b % 10;
    const toRoundTen = sign > 0 ? (10 - (current % 10)) % 10 : current % 10;
    if (toRoundTen > 0 && units > toRoundTen) {
      leap(toRoundTen);
      units -= toRoundTen;
    }
    if (units > 0) leap(units);
    return jumps;
  }

  /**
   * Ligne numérique d'addition (bonds vers la droite) ou de soustraction (vers la
   * gauche), sur 16 graduations qui contiennent le départ et l'arrivée
   * @private
   */
  _generateJumpNumberLine() {
    const isAddition = this.operator === '+';
    const examples = NUMBER_LINE_EXAMPLES[this.operator];
    const [a, b] = examples[this.currentLevel] ?? examples.easy;
    const result = this.operation.compute(a, b);
    const end = Math.max(JUMP_LINE_SPAN, Math.ceil(Math.max(a, result) / 5) * 5);
    const start = end - JUMP_LINE_SPAN;
    const position = value => ((value - start) / JUMP_LINE_SPAN) * 100;
    const low = Math.min(a, result);
    const high = Math.max(a, result);

    const points = pointsDeLigne(range(start, end), {
      depart: a,
      arrivee: result,
      low,
      high,
      position,
    });
    const arcs = arcsDeSauts(this.getJumps(a, b), { isAddition, position });

    const titleKey = isAddition ? 'number_line_addition_title' : 'number_line_subtraction_title';
    const explanationKey = isAddition
      ? 'number_line_addition_explanation'
      : 'number_line_subtraction_explanation';

    return `
      <div class="number-line-section">
        <h3>${getTranslation(titleKey)}</h3>
        <p class="operation-explanation">${getTranslation(explanationKey)}</p>
        <div class="number-line-container number-line-interactive">
          <div class="number-line">${points.join('')}${arcs.join('')}</div>
        </div>
        <div class="example-equation">
          <span class="equation">
            <span class="eq-number">${a}</span>
            <span class="eq-operator">${this.operation.symbol}</span>
            <span class="eq-number">${b}</span>
            <span class="eq-equals">=</span>
            <span class="eq-result">${result}</span>
          </span>
        </div>
      </div>
    `;
  }

  /**
   * Visualisation de partage pour division : les mêmes points que partout ailleurs,
   * masqués aux lecteurs d'écran (les phrases disent déjà « 12 objets à partager »…)
   * @private
   */
  _generateDivisionVisualization() {
    const dividend = 12; // Exemple : 12 ÷ 3 = 4
    const divisor = 3;
    const quotient = dividend / divisor;

    const groupsHTML = range(1, divisor)
      .map(
        g => `
            <div class="share-group">
              <span class="share-items" aria-hidden="true">${dotsHTML(quotient)}</span>
              <span class="share-label">${getTranslation('group')}\u00A0${g}</span>
            </div>`
      )
      .join('');

    return `
      <div class="number-line-section division-visualization">
        <h3>${getTranslation('division_sharing_title')}</h3>
        <p class="operation-explanation">${getTranslation('division_sharing_explanation')}</p>

        <div class="division-demo">
          <div class="division-total">
            <span class="total-label">${dividend}\u00A0${getTranslation('items_to_share')}</span>
            <span class="total-items" aria-hidden="true">${dotsHTML(dividend)}</span>
          </div>

          <div class="division-arrow">
            <span class="arrow-symbol" aria-hidden="true">↓</span>
            <span class="arrow-label">${getTranslation('share_in')}\u00A0${divisor}\u00A0${getTranslation('groups')}</span>
          </div>

          <div class="division-groups">
            ${groupsHTML}
          </div>
        </div>

        <div class="example-equation">
          <span class="equation">
            <span class="eq-number">${dividend}</span>
            <span class="eq-operator">÷</span>
            <span class="eq-number">${divisor}</span>
            <span class="eq-equals">=</span>
            <span class="eq-result">${quotient}</span>
          </span>
          <span class="eq-explanation">(${quotient}\u00A0${getTranslation('per_group')})</span>
        </div>
      </div>
    `;
  }

  // ======================================
  // EXPLORATION VISUELLE
  // ======================================

  /**
   * Générer l'exploration visuelle
   */
  generateVisualExplorationHTML() {
    return `
            <div class="visual-exploration">
                <h3>${getTranslation('visual_exploration_title')}</h3>
                <div class="visual-grid" id="visual-grid-container">
                    ${this.generateVisualAid()}
                </div>
            </div>
        `;
  }

  /**
   * Générer l'aide visuelle : une touche par égalité, ses points dessous
   */
  generateVisualAid() {
    return this._getPlan()
      .visual.map(
        ({ a, b, result }) => `
                <button type="button" class="visual-item" data-a="${a}" data-b="${b}" style="--per-row: ${this._dotsPerRow(a, b)}">
                    <span class="visual-equation">${a} ${this.operation.symbol} ${b} = ${result}</span>
                    <span class="visual-representation" aria-hidden="true">
                        ${this.generateVisualObjects(a, b)}
                    </span>
                </button>
            `
      )
      .join('');
  }

  /**
   * Nombre de points de la rangée la plus longue d'une visualisation,
   * pour dimensionner les points à la place disponible (voir --per-row en CSS)
   * @param {number} a
   * @param {number} b
   * @returns {number}
   * @private
   */
  _dotsPerRow(a, b) {
    if (this.operator === '×' || this.operator === '−') return Math.max(1, Math.min(a, 10));
    if (this.operator === '+') return Math.max(1, Math.min(Math.max(a, b), 10));
    return 10; // Division : parts côte à côte, on garde des points compacts
  }

  /**
   * Générer les objets visuels selon l'opération
   */
  generateVisualObjects(a, b) {
    if (this.operator === '×') {
      return this._generateMultiplicationVisual(a, b);
    }
    if (this.operator === '+') {
      return this._generateAdditionVisual(a, b);
    }
    if (this.operator === '÷') {
      return this._generateDivisionVisual(a, b);
    }
    return this._generateSubtractionVisual(a, b);
  }

  /**
   * Générer un message simple pour les grandes valeurs
   * @private
   */
  _generateSimpleMessage(a, b) {
    return `<span class="visual-message">${a} ${this.operation.symbol} ${b} = ${this.operation.compute(a, b)}</span>`;
  }

  /**
   * Multiplication : une rangée de a points par groupe, b groupes
   * @private
   */
  _generateMultiplicationVisual(a, b) {
    if (a > 10 || b > 10) {
      return this._generateSimpleMessage(a, b);
    }
    const rows = `<span class="visual-group">${dotsHTML(a)}</span>`.repeat(b);
    return `<span class="visual-groups">${rows}</span>`;
  }

  /**
   * Addition : un groupe de points pleins, « + », un groupe de points creux.
   * La forme distingue les deux nombres ; le vert reste réservé à « juste ».
   * @private
   */
  _generateAdditionVisual(a, b) {
    if (a > 10 || b > 10) {
      return this._generateSimpleMessage(a, b);
    }
    return `<span class="visual-groups visual-addition">
      <span class="visual-group visual-group-first">${dotsHTML(a)}</span>
      <span class="visual-operator">+</span>
      <span class="visual-group visual-group-second">${dotsHTML(b)}</span>
    </span>`;
  }

  /**
   * Soustraction : le total (a) par rangées de 10, ce qui reste en points pleins,
   * ce qu'on enlève en points vides barrés
   * @private
   */
  _generateSubtractionVisual(a, b) {
    const result = this.operation.compute(a, b);
    if (a > 20 || result < 0) {
      return this._generateSimpleMessage(a, b);
    }
    return `<span class="visual-groups visual-subtraction">
      <span class="visual-group">${dotsHTML(result)}${dotsHTML(b, 'visual-object-removed')}</span>
    </span>`;
  }

  /**
   * Division : b parts contenant chacune (quotient) points
   * @private
   */
  _generateDivisionVisual(a, b) {
    const quotient = this.operation.compute(a, b);
    // Limiter pour éviter trop d'objets visuels
    if (a > 20 || !Number.isInteger(quotient)) {
      return this._generateSimpleMessage(a, b);
    }
    const parts =
      `<span class="visual-group visual-group-share">${dotsHTML(quotient)}</span>`.repeat(b);
    return `<span class="visual-groups visual-division">${parts}</span>`;
  }

  // ======================================
  // MANIPULATION
  // ======================================

  /**
   * Nombres à poser et terme fixe de la manipulation
   * @returns {{fixed: 'a'|'b', value: number, items: number[]}}
   * @private
   */
  _getDropPlan() {
    return this._getPlan().drop;
  }

  /**
   * Générer l'interaction : des nombres à poser à la place du « ? »
   * (glisser, toucher ou clavier)
   */
  generateInteractionHTML() {
    const plan = this._getDropPlan();
    const items = plan.items
      .map(
        num =>
          `<div class="drag-item" role="button" tabindex="0" draggable="true" data-number="${num}">${num}</div>`
      )
      .join('');
    const slot = '<span class="drop-slot">?</span>';
    const equation =
      plan.fixed === 'b'
        ? `${slot} ${this.operation.symbol} ${plan.value} = ?`
        : `${plan.value} ${this.operation.symbol} ${slot} = ?`;

    return `
            <div class="optional-interaction">
                <h3>${getTranslation('manipulation_title')}</h3>
                <p class="interaction-instructions">${getTranslation('manipulation_instructions')}</p>
                <div id="drag-area">${items}</div>
                <div class="lab-dropzone" id="drop-zone">
                    <div class="dropzone-content" aria-live="polite">${equation}</div>
                </div>
            </div>
        `;
  }

  // ======================================
  // ÉCOUTEURS
  // ======================================

  /**
   * Configurer la sélection de table (×) ou niveau (+, −, ÷).
   * Les tuiles sont des boutons : clavier et lecteurs d'écran les atteignent.
   * @param {ParentNode} [root] - Carte affichée (les écouteurs ne sortent pas de cette carte)
   */
  setupTableSelection(root = this._scope()) {
    root.querySelectorAll('.lab-item[data-table]').forEach(item => {
      item.addEventListener(
        'click',
        singleActivation(() => this.showTable(Number.parseInt(item.dataset.table, 10)))
      );
    });
    root.querySelectorAll('.lab-item[data-level]').forEach(item => {
      item.addEventListener(
        'click',
        singleActivation(() => this.showLevel(item.dataset.level))
      );
    });
  }

  /**
   * Configurer l'exploration de table
   * @param {ParentNode} [root] - Carte affichée (les écouteurs ne sortent pas de cette carte)
   */
  setupTableExploration(root = this._scope()) {
    root.querySelector('#discovery-table-back-btn')?.addEventListener(
      'click',
      singleActivation(() => this.returnToTableSelection())
    );
    root.querySelector('#discovery-home-btn')?.addEventListener(
      'click',
      singleActivation(() => {
        import('../slides.js').then(m => m.goToSlide(1));
      })
    );

    this.setupDragAndDrop(root);

    // Délégation : une touche du carrousel lance son animation
    const carousel = root.querySelector('.multiplication-carousel');
    carousel?.addEventListener(
      'click',
      singleActivation(e => {
        const item = e.target.closest('.carousel-item');
        const operands = this._readOperands(item);
        if (!operands) return;
        this._markCurrentCarouselItem(carousel, item);
        this.triggerAnimation(operands.a, operands.b);
      })
    );

    // Délégation : un panneau de l'exploration visuelle se met en évidence
    const visualGrid = root.querySelector('#visual-grid-container');
    visualGrid?.addEventListener(
      'click',
      singleActivation(e => {
        const item = e.target.closest('.visual-item');
        const operands = this._readOperands(item);
        if (operands) this.highlightVisualAid(operands.a, operands.b, item);
      })
    );
  }

  /**
   * Opérandes portés par une touche (data-a, data-b)
   * @param {HTMLElement|null} item
   * @returns {{a: number, b: number}|null}
   * @private
   */
  _readOperands(item) {
    if (!item) return null;
    const a = Number.parseInt(item.dataset.a, 10);
    const b = Number.parseInt(item.dataset.b, 10);
    return Number.isNaN(a) || Number.isNaN(b) ? null : { a, b };
  }

  /**
   * Marquer l'égalité montrée dans la zone d'animation
   * @param {HTMLElement} carousel
   * @param {HTMLElement} item
   * @private
   */
  _markCurrentCarouselItem(carousel, item) {
    carousel.querySelectorAll('.carousel-item.is-current').forEach(el => {
      el.classList.remove('is-current');
      el.removeAttribute('aria-current');
    });
    item.classList.add('is-current');
    item.setAttribute('aria-current', 'true');
  }

  // ======================================
  // NAVIGATION DANS LE MODE
  // ======================================

  /**
   * Afficher une table spécifique (×)
   */
  async showTable(table) {
    this.currentTable = table;
    this.currentLevel = null;
    this.phase = 'exploration';
    this._plan = null;

    this.saveExploredTable(table);
    await this.initializeUI();
    if (this._stopped) return;
    this._showScreenTop();

    speak(`${getTranslation('table_of')} ${table}`);
    console.log(`🧪 Exploration de la table ${table}`);
  }

  /**
   * Afficher un niveau spécifique (+, −, ÷)
   */
  async showLevel(level) {
    this.currentLevel = level;
    this.currentTable = null;
    this.phase = 'exploration';
    this._plan = null;

    this.saveExploredTable(level);
    await this.initializeUI();
    if (this._stopped) return;
    this._showScreenTop();

    // « Addition, facile » : la voix confirme l'opération autant que le niveau
    const nomDuNiveau = getTranslation(`difficulty_${level}`);
    speak(`${this._getOperationName()}, ${nomDuNiveau}`);
    console.log(`🧪 Exploration du niveau ${level} (${this.operation.name})`);
  }

  /**
   * Retourner à la sélection : la tuile qu'on vient d'explorer reprend le focus
   */
  async returnToTableSelection() {
    const previous = this.operator === '×' ? this.currentTable : this.currentLevel;
    const attribute = this.operator === '×' ? 'data-table' : 'data-level';
    this.phase = 'selection';
    this.currentTable = null;
    this.currentLevel = null;
    this._plan = null;

    await this.initializeUI();
    if (this._stopped || previous === null || previous === undefined) return;
    const tile = this._find(`.lab-item[${attribute}="${previous}"]`);
    tile?.focus({ preventScroll: true });
    tile?.scrollIntoView?.({ block: 'nearest', behavior: preferredScrollBehavior() });
  }

  /**
   * Nouvel écran : on le montre depuis son début, focus sur son titre (sans défilement)
   * @private
   */
  _showScreenTop() {
    if (!this._root?.isConnected) return;
    scrollToScreenTop(this._root);
    this._find('.discovery-lab-title')?.focus({ preventScroll: true });
  }

  // ======================================
  // ANIMATION D'UNE ÉGALITÉ
  // ======================================

  /**
   * Déclencher l'animation d'une opération ; sur téléphone, la zone d'animation
   * (sous le carrousel) est amenée à l'écran.
   */
  triggerAnimation(a, b) {
    const animContainer = this._find('#animation-container');
    if (!animContainer) return;

    animContainer.textContent = '';
    const { root, step } = this._createAnimationContainer(a, b);
    this._appendAnimationContent(step, a, b);
    this._appendAnimationResult(step, a, b);
    animContainer.appendChild(root);
    this._triggerAnimationClasses(animContainer);
    this._bringIntoView(animContainer.closest('.animation-area') ?? animContainer);
    this.speakOperation(a, b);
  }

  /**
   * Amène un élément entièrement à l'écran, sans défiler s'il y est déjà
   * @param {HTMLElement} element
   * @private
   */
  _bringIntoView(element) {
    if (typeof element?.scrollIntoView !== 'function') return;
    element.scrollIntoView({ block: 'nearest', behavior: preferredScrollBehavior() });
  }

  /**
   * Créer le conteneur d'animation
   * @private
   */
  _createAnimationContainer(a, b) {
    const root = document.createElement('div');
    root.className = 'animated-equation';
    const step = document.createElement('div');
    step.className = 'animation-step';
    root.appendChild(step);
    const text = document.createElement('div');
    text.className = 'animation-text';
    text.textContent = `${a} ${this.operation.symbol} ${b} = ?`;
    step.appendChild(text);
    return { root, step };
  }

  /**
   * Ajouter le contenu d'animation selon l'opération : des points quand les nombres
   * sont petits, sinon un comptage (×, ÷) ou des bonds par dizaines (+, −)
   * @private
   */
  _appendAnimationContent(step, a, b) {
    const content = this._createAnimationContent(a, b);
    if (content) step.appendChild(content);
  }

  /**
   * @returns {HTMLElement}
   * @private
   */
  _createAnimationContent(a, b) {
    if (this.operator === '×') {
      return a <= 5
        ? this._createSmallMultiplicationAnimation(a, b)
        : this._createCountAnimation(a, b);
    }
    if (this._canVisualize(a, b)) {
      return this._createObjectsAnimation(a, b);
    }
    if (this.operator === '÷') {
      // Combien de bonds de b pour arriver à a ? Le nombre de bonds est le résultat.
      return this._createCountAnimation(b, this.operation.compute(a, b));
    }
    return this._createJumpAnimation(a, b);
  }

  /**
   * Les nombres sont-ils assez petits pour être dessinés en points ?
   * (mêmes limites que les _generate*Visual)
   * @param {number} a
   * @param {number} b
   * @returns {boolean}
   * @private
   */
  _canVisualize(a, b) {
    const regle = VISUALISABLE[this.operator];
    return regle ? regle(a, b, this.operation) : false;
  }

  /**
   * Les points de l'égalité, masqués aux lecteurs d'écran (l'égalité est écrite au-dessus)
   * @private
   */
  _createObjectsAnimation(a, b) {
    const calc = document.createElement('div');
    calc.className = 'animation-objects';
    calc.setAttribute('aria-hidden', 'true');
    appendSanitizedHTML(calc, this.generateVisualObjects(a, b));
    return calc;
  }

  /**
   * Petites multiplications : b groupes de a points, chacun dans son cadre
   * @private
   */
  _createSmallMultiplicationAnimation(a, b) {
    const objects = document.createElement('div');
    objects.className = 'animation-objects';
    objects.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < b; i++) {
      const group = document.createElement('span');
      group.className = 'object-group';
      for (let j = 0; j < a; j++) {
        const dot = document.createElement('span');
        dot.className = 'visual-object';
        group.appendChild(dot);
      }
      objects.appendChild(group);
    }
    return objects;
  }

  /**
   * Compter de n en n : « Compte de 7 en 7 : 7 → 14 → 21 ». Sous chaque nombre, son
   * rang (1, 2, 3…) : pour ×, le dernier rang est le multiplicateur ; pour ÷, le
   * nombre de bonds est le résultat.
   * @param {number} stepValue - Taille d'un bond
   * @param {number} count - Nombre de bonds
   * @private
   */
  _createCountAnimation(stepValue, count) {
    const calc = document.createElement('div');
    calc.className = 'animation-calculation';

    const countBy = translateOr('discovery_count_by', { n: stepValue, step: stepValue }, '');
    const caption =
      this.operator === '÷'
        ? translateOr(
            'discovery_count_to',
            { n: stepValue, step: stepValue, target: stepValue * count },
            countBy
          )
        : countBy;
    if (caption) calc.appendChild(this._createCaption(caption));

    const line = document.createElement('div');
    line.className = 'calc-line';
    for (let i = 1; i <= count; i++) {
      const hop = document.createElement('span');
      hop.className = 'calc-hop';
      const station = document.createElement('span');
      station.className = 'calc-station';
      const num = document.createElement('span');
      num.className = 'calc-number';
      num.textContent = String(stepValue * i);
      const rank = document.createElement('span');
      rank.className = 'calc-index';
      rank.setAttribute('aria-hidden', 'true');
      rank.textContent = String(i);
      station.append(num, rank);
      hop.appendChild(station);
      // La flèche reste collée au nombre qui la précède : une ligne ne commence jamais par elle
      if (i < count) hop.appendChild(createArrow());
      line.appendChild(hop);
    }
    calc.appendChild(line);
    return calc;
  }

  /**
   * Addition ou soustraction de grands nombres : les bonds sur la ligne numérique,
   * dizaines puis unités (« 16 → +10 → 26 → +4 → 30 → +3 → 33 »)
   * @private
   */
  _createJumpAnimation(a, b) {
    const calc = document.createElement('div');
    calc.className = 'animation-calculation';
    const isAddition = this.operator === '+';
    const caption = translateOr(
      isAddition ? 'discovery_jumps_forward' : 'discovery_jumps_backward',
      {},
      ''
    );
    if (caption) calc.appendChild(this._createCaption(caption));

    const line = document.createElement('div');
    line.className = 'calc-line';
    const jumps = this.getJumps(a, b);
    const sign = isAddition ? '+' : '−';
    [a, ...jumps.map(jump => jump.to)].forEach((value, index) => {
      const hop = document.createElement('span');
      hop.className = 'calc-hop';
      const num = document.createElement('span');
      num.className = 'calc-number';
      num.textContent = String(value);
      hop.appendChild(num);

      const jump = jumps[index];
      if (jump) {
        const leap = document.createElement('span');
        leap.className = 'calc-leap';
        const label = document.createElement('span');
        label.className = 'calc-leap-label';
        label.textContent = `${sign}${jump.step}`;
        leap.append(label, createArrow());
        hop.appendChild(leap);
      }
      line.appendChild(hop);
    });
    calc.appendChild(line);
    return calc;
  }

  /**
   * Légende d'un comptage ou de bonds
   * @param {string} text
   * @returns {HTMLParagraphElement}
   * @private
   */
  _createCaption(text) {
    const caption = document.createElement('p');
    caption.className = 'calc-step';
    caption.textContent = text;
    return caption;
  }

  /**
   * Ajouter le résultat de l'animation
   * @private
   */
  _appendAnimationResult(step, a, b) {
    const result = this.operation.compute(a, b);
    const resultEl = document.createElement('div');
    resultEl.className = 'animation-result';
    resultEl.textContent = `= ${result}`;
    step.appendChild(resultEl);
  }

  /**
   * Déclencher les classes d'animation CSS
   * @private
   */
  _triggerAnimationClasses(animContainer) {
    try {
      const root2 = animContainer.querySelector('.animated-equation');
      const step2 = animContainer.querySelector('.animation-step');
      const result2 = animContainer.querySelector('.animation-result');
      requestAnimationFrame(() => {
        root2?.classList.add('animate');
        step2?.classList.add('animate');
        setTimeout(() => {
          result2?.classList.add('animate');
        }, 50);
      });
    } catch {
      /* no-op: animation fallback */
    }
  }

  /**
   * Mettre en évidence l'aide visuelle
   * @param {number} a
   * @param {number} b
   * @param {HTMLElement|null} clickedItem - Panneau touché (sinon, celui de ces opérandes)
   */
  highlightVisualAid(a, b, clickedItem = null) {
    this._findAll('.visual-item.highlighted').forEach(item => {
      item.classList.remove('highlighted');
    });

    const targetItem = clickedItem || this._find(`.visual-item[data-a="${a}"][data-b="${b}"]`);
    targetItem?.classList.add('highlighted');

    // Parler l'équation
    this.speakOperation(a, b);
  }

  // ======================================
  // POSER UN NOMBRE (glisser, toucher, clavier)
  // ======================================

  /**
   * Configurer le glisser-déposer, le toucher et le clavier
   * @param {ParentNode} [root] - Carte affichée
   */
  setupDragAndDrop(root = this._scope()) {
    const dropZone = root.querySelector('#drop-zone');
    if (!dropZone) return;

    root.querySelectorAll('.drag-item').forEach(item => {
      const place = () => this._placeNumber(Number.parseInt(item.dataset.number, 10));
      item.addEventListener('dragstart', e => this.handleDragStart(e));
      item.addEventListener('dragend', () => {
        this.draggedElement = null;
        dropZone.classList.remove('drag-over');
      });
      // Un clic (ou Entrée, Espace) pose le nombre sans avoir à le glisser
      item.addEventListener('click', place);
      item.addEventListener('keydown', e => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        place();
      });

      // Support tactile : le glissement prend la main sur le défilement
      item.addEventListener('touchstart', e => this.handleTouchStart(e), TACTILE_ACTIF);
      item.addEventListener('touchmove', e => this.handleTouchMove(e), TACTILE_ACTIF);
      item.addEventListener('touchend', e => this.handleTouchEnd(e), TACTILE_ACTIF);
      item.addEventListener('touchcancel', () => this._endTouch());
    });

    // Événements de déposer
    dropZone.addEventListener('dragover', e => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('drag-over');
    });
    dropZone.addEventListener('drop', e => this.handleDrop(e));
  }

  /**
   * Gérer le début du glisser
   */
  handleDragStart(e) {
    this.draggedElement = e.currentTarget || e.target;
    try {
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        const num = String(this.draggedElement?.dataset?.number || '');
        // Préférer text/plain pour compatibilité
        e.dataTransfer.setData('text/plain', num);
        // Fallback additionnel
        e.dataTransfer.setData('text', num);
      }
    } catch {
      // no-op (fallback via this.draggedElement dans handleDrop)
    }
  }

  /**
   * Gérer le déposer
   */
  handleDrop(e) {
    e.preventDefault();
    this._find('#drop-zone')?.classList.remove('drag-over');

    const number = this._extractDroppedNumber(e);
    if (number) this._placeNumber(number);
    this.draggedElement = null;
  }

  /**
   * Extraire le nombre glissé depuis l'événement
   * @private
   */
  _extractDroppedNumber(e) {
    const transfere = nombreTransfere(e.dataTransfer);
    const nombre = Number.isNaN(transfere)
      ? Number.parseInt(this.draggedElement?.dataset?.number || '0', 10)
      : transfere;
    return Number.isNaN(nombre) || nombre <= 0 ? null : nombre;
  }

  /**
   * Poser un nombre à la place du « ? » : le calcul se complète et se dit
   * @param {number} number
   * @private
   */
  _placeNumber(number) {
    const dropZone = this._find('#drop-zone');
    if (!dropZone || !Number.isInteger(number)) return;
    const operands = this._calculateDropOperands(number);
    if (!operands) return;
    this._updateDropZone(dropZone, operands);
    this.speakOperation(operands.a, operands.b);
  }

  /**
   * Calcul complété par le nombre posé. Le terme fixe ne change pas pendant la visite
   * et le résultat reste dans le niveau : jamais négatif, jamais de reste.
   * @param {number} number
   * @returns {{a: number, b: number, result: number}|null}
   * @private
   */
  _calculateDropOperands(number) {
    const plan = this._getDropPlan();
    if (!plan.items.includes(number)) return null;
    const a = plan.fixed === 'b' ? number : plan.value;
    const b = plan.fixed === 'b' ? plan.value : number;
    const result = this.operation.compute(a, b);
    if (!Number.isInteger(result) || result < 0) return null;
    return { a, b, result };
  }

  /**
   * Mettre à jour la zone de dépôt : le nombre posé prend la place du « ? ».
   * Aucune couleur de réussite : poser un nombre n'est pas une bonne réponse.
   * @private
   */
  _updateDropZone(dropZone, { a, b, result }) {
    const label = dropZone.querySelector('.dropzone-content');
    if (!label) return;

    const placedFirst = this._getDropPlan().fixed === 'b';
    const symbol = this.operation.symbol;
    const placed = document.createElement('span');
    placed.className = 'drop-placed';
    placed.textContent = String(placedFirst ? a : b);

    label.textContent = '';
    if (placedFirst) {
      label.append(placed, ` ${symbol} ${b} = ${result}`);
    } else {
      label.append(`${a} ${symbol} `, placed, ` = ${result}`);
    }

    dropZone.classList.add('is-filled');
    // Relancer l'apparition du calcul à chaque nombre posé : lire la mise en page
    // sépare le retrait de la classe de son ajout, sinon le navigateur groupe les deux
    label.classList.remove('is-new');
    label.getBoundingClientRect();
    label.classList.add('is-new');
  }

  /**
   * Support tactile - début : un simple toucher posera le nombre
   */
  handleTouchStart(e) {
    e.preventDefault();
    this.draggedElement = e.currentTarget || e.target;
    const touch = e.touches[0];
    this._touchStart = { x: touch.clientX, y: touch.clientY };
  }

  /**
   * Support tactile - mouvement : au-delà de quelques pixels, le nombre suit le doigt
   */
  handleTouchMove(e) {
    e.preventDefault();
    if (!this.draggedElement || !this._touchStart) return;

    const touch = e.touches[0];
    if (!this.touchClone) {
      const moved = Math.hypot(
        touch.clientX - this._touchStart.x,
        touch.clientY - this._touchStart.y
      );
      if (moved < TOUCH_DRAG_THRESHOLD) return;
      this._createTouchClone(this.draggedElement);
    }
    this.positionClone(touch.clientX, touch.clientY);
  }

  /**
   * Support tactile - fin : toucher = poser ; glisser = poser si lâché sur la zone
   */
  handleTouchEnd(e) {
    e.preventDefault();
    const wasDragging = Boolean(this.touchClone);
    const number = Number.parseInt(this.draggedElement?.dataset?.number || '', 10);
    this._endTouch();

    if (!wasDragging) {
      this._placeNumber(number);
      return;
    }
    const touch = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    if (elementBelow?.closest('#drop-zone')) {
      this._placeNumber(number);
    }
  }

  /**
   * Copie qui suit le doigt (position et empilement : .touch-clone en CSS)
   * @param {HTMLElement} source
   * @private
   */
  _createTouchClone(source) {
    this.touchClone = source.cloneNode(true);
    this.touchClone.classList.add('touch-clone');
    this.touchClone.removeAttribute('tabindex');
    this.touchClone.setAttribute('aria-hidden', 'true');
    document.body.appendChild(this.touchClone);
    this.touchCloneHalf = (this.touchClone.offsetWidth || 50) / 2;
  }

  /**
   * Fin (ou annulation) d'un toucher : la copie disparaît
   * @private
   */
  _endTouch() {
    this.touchClone?.remove();
    this.touchClone = null;
    this._touchStart = null;
    this.draggedElement = null;
  }

  /**
   * Positionner le clone tactile
   */
  positionClone(x, y) {
    if (!this.touchClone) return;

    // Le nombre reste centré sous le doigt
    const half = this.touchCloneHalf || 25;
    this.touchClone.style.left = `${x - half}px`;
    this.touchClone.style.top = `${y - half}px`;
  }

  // ======================================
  // VOIX
  // ======================================

  /**
   * Parler une opération
   */
  speakOperation(a, b) {
    // En mode Découverte, on veut révéler le résultat à l'élocution
    const result = this.operation.compute(a, b);
    speak(this.getSpokenEquation(a, b, result));
  }

  /**
   * Phrase prononcée pour une égalité, dans la langue de l'interface
   * (« 7 fois 3 égale 21 », « 7 times 3 equals 21 », « 7 por 3 es igual a 21 »).
   * Sans traduction, la synthèse lit l'égalité en symboles dans sa propre langue.
   * @param {number} a
   * @param {number} b
   * @param {number} result
   * @returns {string}
   */
  getSpokenEquation(a, b, result) {
    const symbolic = `${a} ${this.operation.symbol} ${b} = ${result}`;
    return translateOr(`discovery_speech_${this.operation.name}`, { a, b, result }, symbolic);
  }

  // ======================================
  // PROGRESSION
  // ======================================

  /**
   * Clé de progression : la table (×), ou « opération:niveau » (+, −, ÷) pour que
   * « Addition > Facile » ne coche pas aussi la soustraction et la division
   * @param {number|string} id
   * @returns {number|string}
   * @private
   */
  _exploredKey(id) {
    return this.operator === '×' ? id : `${this.operator}:${id}`;
  }

  /**
   * Sauvegarder une table (ou un niveau de l'opération courante) comme explorée
   */
  saveExploredTable(table) {
    this.loadExploredTables();
    const key = this._exploredKey(table);
    if (!this.exploredTables.includes(key)) {
      this.exploredTables.push(key);
    }

    // Sauvegarder dans les données utilisateur
    const userData = UserState.getCurrentUserData();
    if (!userData) return;
    userData.discoveryProgress = {
      ...userData.discoveryProgress,
      exploredTables: [...this.exploredTables],
      lastExplored: Date.now(),
    };
    UserState.updateUserData(userData);

    console.log(`💾 Exploration enregistrée : ${key}`);
  }

  /**
   * Charger les tables explorées. Anciennes données : un niveau enregistré sans son
   * opération (« easy ») ne dit pas laquelle a été explorée ; on l'écarte plutôt que de
   * cocher à tort les trois opérations. La prochaine visite le range sous la bonne.
   */
  loadExploredTables() {
    const explored = UserState.getCurrentUserData()?.discoveryProgress?.exploredTables;
    if (Array.isArray(explored)) {
      this.exploredTables = explored.filter(id => !LEVELS.includes(id));
    }
  }

  // ======================================
  // CONTRAT GAMEMODE
  // ======================================

  /**
   * Pas de génération de question pour le Discovery
   */
  generateQuestion() {
    // Le Discovery ne génère pas de questions
  }

  /**
   * Pas d'options pour le Discovery
   */
  generateOptions() {
    return [];
  }

  /**
   * Pas de traitement de réponse pour le Discovery
   */
  handleAnswer() {
    // Le Discovery ne traite pas de réponses
  }

  /**
   * Données pour la barre d'information (minimales)
   */
  getInfoBarData() {
    return {
      // Pas de score/streak/timer pour le mode découverte
    };
  }

  /**
   * Vérification pour continuer (toujours actif)
   */
  shouldContinue() {
    return this.state.isActive;
  }

  /**
   * Sauvegarder les résultats
   */
  saveResults() {
    // Le Discovery sauvegarde la progression d'exploration
    console.log('💾 Progression Discovery sauvegardée');
  }

  /**
   * Afficher les résultats
   */
  showResults() {
    // Le Discovery n'a pas de résultats à afficher
    console.log('📊 Discovery - Mode exploration libre');
  }

  /**
   * Nettoyage spécifique au Discovery
   */
  cleanup() {
    super.cleanup();

    // Nettoyer les éléments tactiles
    this._endTouch();
    this.currentTable = null;
  }

  /**
   * Rafraîchir les textes après un changement de langue : l'écran est reconstruit
   * (une fois par demande, jamais en parallèle) avec les mêmes tirages.
   * @returns {Promise<void>}
   */
  async refreshTexts() {
    // Écran remplacé par un autre mode : rien à retraduire ici
    if (this._stopped || (this._root && !this._root.isConnected)) {
      return;
    }
    await this.initializeUI().catch(error => {
      console.warn('Découverte : textes non rafraîchis', error);
    });
  }
}

// Export ES6 pur
export default DiscoveryMode;

// Start/stop wrappers to manage a single instance (for orchestrator/slide stops)
let _discoveryModeInstance = null;
export function startDiscoveryMode() {
  if (_discoveryModeInstance) _discoveryModeInstance.stop();
  _discoveryModeInstance = new DiscoveryMode();
  _discoveryModeInstance.start();
}
export function stopDiscoveryMode() {
  if (_discoveryModeInstance) {
    _discoveryModeInstance.stop();
    _discoveryModeInstance = null;
  }
}
export function refreshDiscoveryTexts() {
  try {
    return _discoveryModeInstance?.refreshTexts?.();
  } catch {
    /* no-op: not active */
    return undefined;
  }
}
