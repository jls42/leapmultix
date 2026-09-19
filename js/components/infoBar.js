/**
 * Composant InfoBar centralisé
 * Gère l'affichage et la mise à jour des barres d'information pour tous les modes de jeu
 * Phase 3.3 - Centralisation des barres d'info dupliquées
 *
 * Barre des modes Quiz, Défi et Aventure : « libellé : valeur » (.info-label,
 * .info-value), un modificateur par élément (.info-item--time…). Les vies sont des
 * cœurs dessinés (pleins ou vides) dans tous les modes, mini-jeux d'Arcade compris,
 * nommés « 2 vies sur 3 » pour les lecteurs d'écran.
 */
import { getTranslation as _getTranslation } from '../i18n.js';
import { getCurrentLanguage } from '../i18n-store.js';

/** Libellé traduit, avec un texte de repli si la clé manque */
function trLabel(key, fallback, params = {}) {
  const value = _getTranslation(key, params);
  return typeof value === 'string' && value !== '' && !value.startsWith('[') ? value : fallback;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const HEART_PATH =
  'M12 20.3s-7.6-4.5-9.3-9.4C1.5 7.6 3.6 4.5 7 4.5c2.2 0 3.9 1.2 5 3 1.1-1.8 2.8-3 5-3 3.4 0 5.5 3.1 4.3 6.4-1.7 4.9-9.3 9.4-9.3 9.4z';
const ARCADE_MODES = ['multisnake', 'multimiam', 'multimemory', 'multiinvaders'];
const MAX_LIVES = 3;

/**
 * Cœur dessiné (plein ou vide), masqué aux technologies d'assistance
 * @param {boolean} filled
 * @returns {SVGSVGElement}
 */
function createHeartIcon(filled) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', filled ? 'info-heart' : 'info-heart is-empty');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', HEART_PATH);
  svg.appendChild(path);
  return svg;
}

/**
 * Nom accessible des vies : « 2 vies sur 3 » (et non « 2/3 », lu « deux tiers »)
 * @param {number} lives
 * @param {number} total
 * @returns {string}
 */
function formatLivesLabel(lives, total) {
  let category = lives === 1 ? 'one' : 'other';
  try {
    category = new Intl.PluralRules(getCurrentLanguage()).select(lives);
  } catch {
    /* repli : règle simple */
  }
  const key = category === 'one' ? 'info_lives_value_one' : 'info_lives_value';
  return trLabel(key, `${lives}/${total}`, { lives, total });
}

/**
 * Libellé réservé aux lecteurs d'écran, retraduit avec la page (data-translate)
 * @param {string} key
 * @param {string} fallback
 * @returns {HTMLSpanElement}
 */
function createHiddenLabel(key, fallback) {
  const label = document.createElement('span');
  label.className = 'sr-only';
  label.setAttribute('data-translate', key);
  label.textContent = trLabel(key, fallback);
  return label;
}

export const InfoBar = {
  // DOM helpers for arcade template element
  _createPlaceholderSpan() {
    const ph = document.createElement('span');
    ph.className = 'game-stat-display arcade-placeholder';
    ph.style.minWidth = '60px';
    ph.style.opacity = '0';
    ph.setAttribute('aria-hidden', 'true');
    ph.textContent = '0';
    return ph;
  },
  _createTopRow(showScore, scoreId, operationLabel) {
    const top = document.createElement('div');
    top.className = 'arcade-mobile-top';
    top.style.display = 'flex';
    top.style.flexDirection = 'row';
    top.style.alignItems = 'center';
    top.style.justifyContent = 'center';
    top.style.width = '100%';

    // Le score porte un libellé pour les lecteurs d'écran (« Score : 120 »)
    if (showScore) top.appendChild(createHiddenLabel('info_score_label', 'Score'));

    const left = document.createElement('span');
    left.className = `game-stat-display${showScore ? '' : ' arcade-placeholder'}`;
    left.style.minWidth = '60px';
    left.style.textAlign = 'left';
    if (showScore) left.id = scoreId;
    else left.setAttribute('aria-hidden', 'true');
    left.textContent = '0';

    // Seule la question est annoncée quand elle change (pas le chrono, chaque seconde)
    const question = document.createElement('span');
    question.className = 'arcade-question';
    question.setAttribute('aria-live', 'polite');
    question.style.flex = '1';
    question.style.textAlign = 'center';
    question.style.display = 'block';
    question.textContent = operationLabel;

    const rightPlaceholder = this._createPlaceholderSpan();

    top.appendChild(left);
    top.appendChild(question);
    top.appendChild(rightPlaceholder);
    return top;
  },
  _createBottomRow(showLives, livesId, timerId) {
    const bottom = document.createElement('div');
    bottom.className = 'arcade-mobile-bottom';
    bottom.style.display = 'flex';
    bottom.style.flexDirection = 'row';
    bottom.style.alignItems = 'center';
    bottom.style.justifyContent = 'center';
    bottom.style.width = '100%';

    const ph1 = this._createPlaceholderSpan();
    const timer = document.createElement('span');
    timer.id = timerId;
    timer.className = 'game-stat-display';
    timer.style.minWidth = showLives ? '60px' : '120px';
    timer.style.textAlign = 'center';
    timer.textContent = '05:00';

    bottom.appendChild(ph1);
    bottom.appendChild(createHiddenLabel('info_time_label', 'Temps'));
    bottom.appendChild(timer);

    if (showLives) {
      const lives = document.createElement('span');
      lives.id = livesId;
      lives.className = 'game-stat-display';
      lives.style.minWidth = '60px';
      lives.style.textAlign = 'center';
      this.renderLives(lives, MAX_LIVES);
      bottom.appendChild(lives);
    }

    const ph2 = this._createPlaceholderSpan();
    bottom.appendChild(ph2);
    return bottom;
  },
  _createGameUI(canvasId, abandonId, abandonLabel) {
    const gameUI = document.createElement('div');
    gameUI.className = 'arcade-game-ui';
    gameUI.setAttribute('role', 'region');
    gameUI.setAttribute('aria-label', trLabel('arcade_game_area_label', 'Zone de jeu'));
    // Mise en page portée par css/arcade.css (.arcade-game-ui) ; le plateau est
    // dimensionné à la place disponible par js/arcade-common.js
    gameUI.style.width = '100%';

    const canvas = document.createElement('canvas');
    canvas.id = canvasId;
    canvas.setAttribute('tabindex', '0');
    canvas.setAttribute('aria-label', trLabel('arcade_game_screen_label', 'Écran de jeu'));
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    const abandon = document.createElement('button');
    abandon.className = 'btn btn-secondary';
    abandon.id = abandonId;
    abandon.setAttribute('aria-label', abandonLabel);
    abandon.textContent = abandonLabel;

    gameUI.appendChild(canvas);
    gameUI.appendChild(abandon);
    return gameUI;
  },
  // Templates par mode de jeu (le temps gagné du Défi s'ajoute au chrono)
  templates: {
    quiz: ['score', 'progress', 'streak'],
    challenge: ['score', 'streak', 'time'],
    adventure: ['score', 'lives', 'progress', 'streak'],
    discovery: [],
    arcade: ['score', 'lives', 'time'],
    multisnake: ['score', 'lives'],
    multimiam: ['score', 'lives'],
    multimemory: ['score', 'lives'],
    multiinvaders: ['score', 'lives', 'time'],
  },

  /**
   * Initialiser le composant InfoBar
   */
  init() {
    // No initialization needed - InfoBar is created on-demand when injected
  },

  /**
   * Créer le HTML d'une barre d'information (même rendu que createElement)
   * @param {string} mode - Mode de jeu (quiz, challenge, adventure, arcade, etc.)
   * @param {Object} values - Valeurs initiales { score: 0, lives: 3, etc. }
   * @param {Object} options - Options { ariaLabel, ariaLabelKey, customItems }
   * @returns {string} HTML de la barre d'information
   */
  createHTML(mode, values = {}, options = {}) {
    return this.createElement(mode, values, options).outerHTML;
  },

  /**
   * Créer un élément DOM de barre d'information (sans innerHTML)
   * @param {string} mode
   * @param {Object} values
   * @param {Object} options - { ariaLabel, ariaLabelKey (suit la langue), customItems }
   * @returns {HTMLElement}
   */
  createElement(mode, values = {}, options = {}) {
    const template = this.templates[mode] || this.templates.arcade;
    const getTranslation = _getTranslation;

    const root = document.createElement('div');
    root.className = 'game-info-bar';
    root.setAttribute('role', 'region');
    root.setAttribute(
      'aria-label',
      options.ariaLabel || trLabel('game_info_bar_label', 'Informations de la partie')
    );
    if (options.ariaLabelKey) {
      root.setAttribute('data-translate-aria-label', options.ariaLabelKey);
    }

    template.forEach(item => {
      const value = values[item] !== undefined ? values[item] : this.getDefaultValue(item);
      const labelKey = this.getLabelKey(item);
      const id = this.getElementId(item, mode);

      const span = document.createElement('span');
      span.className = `info-item info-item--${item}`;
      const label = document.createElement('span');
      label.className = 'info-label';
      label.setAttribute('data-translate', labelKey);
      label.textContent = getTranslation(labelKey);
      const val = document.createElement('span');
      val.id = id;
      val.className = 'info-value';
      this.renderValue(val, item, value);
      span.appendChild(label);
      span.appendChild(document.createTextNode(' '));
      span.appendChild(val);
      root.appendChild(span);
    });

    if (options.customItems) {
      options.customItems.forEach(customItem => {
        const span = document.createElement('span');
        span.className = 'info-item';
        const label = document.createElement('span');
        label.className = 'info-label';
        label.setAttribute('data-translate', customItem.labelKey);
        label.textContent = getTranslation(customItem.labelKey);
        const val = document.createElement('span');
        val.id = customItem.id;
        val.className = 'info-value';
        val.textContent = String(customItem.value);
        span.appendChild(label);
        span.appendChild(document.createTextNode(' '));
        span.appendChild(val);
        root.appendChild(span);
      });
    }

    return root;
  },

  /**
   * Injecter la barre d'information dans un conteneur
   * @param {string} containerId - ID du conteneur cible
   * @param {string} mode - Mode de jeu
   * @param {Object} values - Valeurs initiales
   * @param {Object} options - Options
   */
  inject(containerId, mode, values = {}, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`📊 InfoBar: Conteneur "${containerId}" non trouvé`);
      return;
    }

    // Supprimer toute barre existante
    const existingBar = container.querySelector('.game-info-bar');
    if (existingBar) {
      existingBar.remove();
    }

    // Injecter une structure DOM sécurisée au début du conteneur
    const el = this.createElement(mode, values, options);
    container.insertBefore(el, container.firstChild);
  },

  /**
   * Mettre à jour les valeurs de la barre d'information
   * @param {Object} updates - Valeurs à mettre à jour { score: 100, lives: 2, etc. }
   * @param {string} mode - Mode de jeu (pour déterminer les IDs)
   */
  update(updates = {}, mode = 'arcade') {
    if (!updates || typeof updates !== 'object') return;
    const allowed = new Set(['score', 'lives', 'progress', 'streak', 'time']);
    Object.keys(updates).forEach(key => {
      if (!allowed.has(key)) return;
      const elementId = this.getElementId(key, mode);
      const element = document.getElementById(elementId);

      if (element && Object.prototype.hasOwnProperty.call(updates, key)) {
        this.renderValue(element, key, updates[key]);
      }
    });
  },

  /**
   * Écrit une valeur dans son élément. Les vies (nombre) sont des cœurs dessinés,
   * pleins ou vides, dans tous les modes ; les autres valeurs restent du texte.
   * @param {HTMLElement} element
   * @param {string} item
   * @param {*} value
   */
  renderValue(element, item, value) {
    if (item === 'lives' && typeof value === 'number') {
      this.renderLives(element, value);
      return;
    }
    element.textContent = this.formatValue(item, value);
  },

  /**
   * Vies en cœurs dessinés : la forme (plein ou vide) porte l'information. Le total
   * retenu est le plus grand nombre de vies vu (au moins 3) : les cœurs perdus
   * restent affichés, vides, et la largeur de la barre ne change pas.
   * Les cœurs et leur nom (« 2 vies sur 3 ») vivent dans un enfant de l'élément :
   * un script qui réécrirait le texte de l'élément les remplace ensemble, sans
   * laisser un nom accessible périmé.
   * @param {HTMLElement} element
   * @param {number} lives
   */
  renderLives(element, lives) {
    const remaining = Math.max(0, Math.floor(lives));
    const known = Number(element.dataset.maxLives) || 0;
    const total = Math.max(MAX_LIVES, remaining, known);
    element.dataset.maxLives = String(total);

    const hearts = document.createElement('span');
    hearts.className = 'info-hearts';
    hearts.setAttribute('role', 'img');
    hearts.setAttribute('aria-label', formatLivesLabel(remaining, total));
    for (let i = 0; i < total; i++) {
      hearts.appendChild(createHeartIcon(i < remaining));
    }
    element.replaceChildren(hearts);
  },

  /**
   * Mini-jeux d'Arcade : identifiants et rendu propres
   * @param {string} mode
   * @returns {boolean}
   */
  isArcadeMode(mode) {
    return ARCADE_MODES.includes(mode);
  },

  /**
   * Obtenir l'ID de l'élément selon le mode
   * @param {string} item - Type d'élément (score, lives, etc.)
   * @param {string} mode - Mode de jeu
   * @returns {string} ID de l'élément
   */
  getElementId(item, mode) {
    // IDs spécifiques aux modes arcade
    if (this.isArcadeMode(mode)) {
      return `${mode}-info-${item}`;
    }

    // IDs génériques pour les autres modes
    return `info-${item}`;
  },

  /**
   * Obtenir la clé de traduction pour un élément
   * @param {string} item - Type d'élément
   * @returns {string} Clé de traduction
   */
  getLabelKey(item) {
    const labelKeys = new Map([
      ['score', 'info_score_label'],
      ['lives', 'info_lives_label'],
      ['progress', 'info_progress_label'],
      ['streak', 'info_streak_label'],
      ['time', 'info_time_label'],
    ]);

    return labelKeys.has(item) ? labelKeys.get(item) : `info_${item}_label`;
  },

  /**
   * Obtenir la valeur par défaut pour un élément
   * @param {string} item - Type d'élément
   * @returns {any} Valeur par défaut
   */
  getDefaultValue(item) {
    const defaultValues = new Map([
      ['score', 0],
      ['lives', MAX_LIVES],
      ['progress', '0/10'],
      ['streak', 0],
      ['time', '00:00'],
    ]);

    return defaultValues.has(item) ? defaultValues.get(item) : 0;
  },

  /**
   * Formater une valeur texte pour l'affichage (les vies numériques sont dessinées)
   * @param {string} item - Type d'élément
   * @param {any} value - Valeur à formater
   * @returns {string} Valeur formatée
   */
  formatValue(item, value) {
    if (item === 'time' && typeof value === 'number') {
      const minutes = Math.floor(value / 60);
      const seconds = value % 60;
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return value === null || value === undefined ? '' : String(value);
  },

  /**
   * Supprimer la barre d'information d'un conteneur
   * @param {string} containerId - ID du conteneur
   */
  remove(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      const infoBar = container.querySelector('.game-info-bar');
      if (infoBar) {
        infoBar.remove();
      }
    }
  },

  /**
   * Zone de jeu arcade avec son bandeau, en HTML (même rendu que la version DOM)
   * @param {Object} config - Configuration identique à createArcadeTemplateElement
   * @returns {string} HTML complet de la zone de jeu arcade avec barre d'info
   */
  createArcadeTemplate(config = {}) {
    const frag = this.createArcadeTemplateElement(config);
    return Array.from(frag.children)
      .map(node => node.outerHTML)
      .join('');
  },

  /**
   * Crée une structure DOM (sans innerHTML) pour la zone arcade : bandeau (score,
   * calcul, temps, vies) puis canevas et « Abandonner ».
   * @param {Object} config Configuration { mode, canvasId, operationId, etc. }
   * @returns {DocumentFragment} Fragment prêt à être inséré
   */
  createArcadeTemplateElement(config = {}) {
    const {
      mode = 'arcade',
      canvasId = 'arcade-canvas',
      operationId = 'arcade-mult-display',
      scoreId = `${mode}-info-score`,
      livesId = `${mode}-info-lives`,
      timerId = `${mode}-info-timer`,
      abandonId = 'arcade-abandon-btn',
      operationLabel = '',
      abandonLabel = _getTranslation('abandon_arcade_button'),
      showLives = true,
      showScore = true,
    } = config;

    const frag = document.createDocumentFragment();

    // Bandeau : aria-live est posé sur la question seule (voir _createTopRow)
    const display = document.createElement('div');
    display.className = 'arcade-mult-display';
    display.id = operationId;
    const top = this._createTopRow(showScore, scoreId, operationLabel);
    const bottom = this._createBottomRow(showLives, livesId, timerId);
    display.appendChild(top);
    display.appendChild(bottom);

    // Game UI container
    const gameUI = this._createGameUI(canvasId, abandonId, abandonLabel);

    frag.appendChild(display);
    frag.appendChild(gameUI);
    return frag;
  },
};

// ESM exports only
const createInfoBarHTML = InfoBar.createHTML.bind(InfoBar);
const updateInfoBar = InfoBar.update.bind(InfoBar);
export { createInfoBarHTML, updateInfoBar };
