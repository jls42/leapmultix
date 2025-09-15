/**
 * Composant InfoBar centralisé
 * Gère l'affichage et la mise à jour des barres d'information pour tous les modes de jeu
 * Phase 3.3 - Centralisation des barres d'info dupliquées
 */
import { getTranslation as _getTranslation } from '../i18n.js';

export const InfoBar = {
  // Helpers to simplify template construction
  _placeholder(width) {
    return `<span class="game-stat-display arcade-placeholder" style="min-width:${width}; opacity:0;">0</span>`;
  },
  _statSpan(id, cls, style, text) {
    return `<span id="${id}" class="${cls}" style="${style}">${text}</span>`;
  },
  _leftStat(showScore, scoreId) {
    return showScore
      ? this._statSpan(scoreId, 'game-stat-display', 'min-width:60px; text-align:left;', '0')
      : this._placeholder('60px');
  },
  _livesStat(showLives, livesId) {
    return showLives
      ? this._statSpan(livesId, 'game-stat-display', 'min-width:60px; text-align:center;', '❤️❤️❤️')
      : '';
  },
  _timerStat(showLives, timerId) {
    const timerWidth = showLives ? 'min-width:60px;' : 'min-width:120px;';
    return this._statSpan(
      timerId,
      'game-stat-display',
      `${timerWidth} text-align:center;`,
      '05:00'
    );
  },
  // DOM helpers for arcade template element
  _createPlaceholderSpan() {
    const ph = document.createElement('span');
    ph.className = 'game-stat-display arcade-placeholder';
    ph.style.minWidth = '60px';
    ph.style.opacity = '0';
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

    const left = document.createElement('span');
    left.className = `game-stat-display${showScore ? '' : ' arcade-placeholder'}`;
    left.style.minWidth = '60px';
    left.style.textAlign = 'left';
    if (showScore) left.id = scoreId;
    left.textContent = '0';

    const question = document.createElement('span');
    question.className = 'arcade-question';
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
    bottom.appendChild(timer);

    if (showLives) {
      const lives = document.createElement('span');
      lives.id = livesId;
      lives.className = 'game-stat-display';
      lives.style.minWidth = '60px';
      lives.style.textAlign = 'center';
      lives.textContent = '❤️❤️❤️';
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
    gameUI.setAttribute('aria-label', 'Zone de jeu');
    gameUI.style.marginTop = '8px';
    gameUI.style.width = '100%';
    gameUI.style.height = '80vh';
    gameUI.style.display = 'flex';
    gameUI.style.justifyContent = 'center';
    gameUI.style.alignItems = 'center';

    const canvas = document.createElement('canvas');
    canvas.id = canvasId;
    canvas.setAttribute('tabindex', '0');
    canvas.setAttribute('aria-label', 'Jeu Arcade');
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
  // Templates par mode de jeu
  templates: {
    quiz: ['score', 'streak'],
    challenge: ['score', 'streak', 'time', 'bonus'],
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
    console.log('📊 Initialisation du composant InfoBar');
  },

  /**
   * Créer le HTML d'une barre d'information
   * @param {string} mode - Mode de jeu (quiz, challenge, adventure, arcade, etc.)
   * @param {Object} values - Valeurs initiales { score: 0, lives: 3, etc. }
   * @param {Object} options - Options { ariaLabel, customItems }
   * @returns {string} HTML de la barre d'information
   */
  createHTML(mode, values = {}, options = {}) {
    const template = this.templates[mode] || this.templates.arcade;
    const getTranslation = _getTranslation;

    let html = `<div class="game-info-bar" role="region" aria-label="${options.ariaLabel || "Barre d'information du jeu"}">`;

    // Générer les éléments selon le template
    template.forEach(item => {
      const value = values[item] !== undefined ? values[item] : this.getDefaultValue(item);
      const labelKey = this.getLabelKey(item);
      const id = this.getElementId(item, mode);

      html += `<span class="info-item">
                <span data-translate="${labelKey}">${getTranslation(labelKey)}</span> 
                <span id="${id}">${this.formatValue(item, value)}</span>
            </span>`;
    });

    // Ajouter des éléments personnalisés si fournis
    /**
     * Fonction if
     * @param {*} options.customItems - Description du paramètre
     * @returns {*} Description du retour
     */
    if (options.customItems) {
      options.customItems.forEach(customItem => {
        html += `<span class="info-item">
                    <span data-translate="${customItem.labelKey}">${getTranslation(customItem.labelKey)}</span> 
                    <span id="${customItem.id}">${customItem.value}</span>
                </span>`;
      });
    }

    html += `</div>`;
    return html;
  },

  /**
   * Créer un élément DOM de barre d'information (sans innerHTML)
   * @param {string} mode
   * @param {Object} values
   * @param {Object} options
   * @returns {HTMLElement}
   */
  createElement(mode, values = {}, options = {}) {
    const template = this.templates[mode] || this.templates.arcade;
    const getTranslation = _getTranslation;

    const root = document.createElement('div');
    root.className = 'game-info-bar';
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', options.ariaLabel || "Barre d'information du jeu");

    template.forEach(item => {
      const value = values[item] !== undefined ? values[item] : this.getDefaultValue(item);
      const labelKey = this.getLabelKey(item);
      const id = this.getElementId(item, mode);

      const span = document.createElement('span');
      span.className = 'info-item';
      const label = document.createElement('span');
      label.setAttribute('data-translate', labelKey);
      label.textContent = getTranslation(labelKey);
      const val = document.createElement('span');
      val.id = id;
      val.textContent = this.formatValue(item, value);
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
        label.setAttribute('data-translate', customItem.labelKey);
        label.textContent = getTranslation(customItem.labelKey);
        const val = document.createElement('span');
        val.id = customItem.id;
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
    /**
     * Fonction if
     * @param {*} existingBar - Description du paramètre
     * @returns {*} Description du retour
     */
    if (existingBar) {
      existingBar.remove();
    }

    // Injecter une structure DOM sécurisée au début du conteneur
    const el = this.createElement(mode, values, options);
    container.insertBefore(el, container.firstChild);

    console.log(`📊 InfoBar injectée dans "${containerId}" (mode: ${mode})`);
  },

  /**
   * Mettre à jour les valeurs de la barre d'information
   * @param {Object} updates - Valeurs à mettre à jour { score: 100, lives: 2, etc. }
   * @param {string} mode - Mode de jeu (pour déterminer les IDs)
   */
  update(updates = {}, mode = 'arcade') {
    const allowed = new Set(['score', 'lives', 'progress', 'streak', 'time', 'bonus']);
    Object.keys(updates).forEach(key => {
      if (!allowed.has(key)) return;
      const elementId = this.getElementId(key, mode);
      const element = document.getElementById(elementId);

      /**
       * Fonction if
       * @param {*} element - Description du paramètre
       * @returns {*} Description du retour
       */
      if (element && Object.prototype.hasOwnProperty.call(updates, key)) {
        element.textContent = this.formatValue(key, updates[key]);
      }
    });
  },

  /**
   * Obtenir l'ID de l'élément selon le mode
   * @param {string} item - Type d'élément (score, lives, etc.)
   * @param {string} mode - Mode de jeu
   * @returns {string} ID de l'élément
   */
  getElementId(item, mode) {
    // IDs spécifiques aux modes arcade
    const arcadeModes = ['multisnake', 'multimiam', 'multimemory', 'multiinvaders'];

    if (arcadeModes.includes(mode)) {
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
      ['bonus', 'info_bonus_label'],
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
      ['lives', 3],
      ['progress', '0/10'],
      ['streak', 0],
      ['time', '00:00'],
      ['bonus', 0],
    ]);

    return defaultValues.has(item) ? defaultValues.get(item) : 0;
  },

  /**
   * Formater une valeur pour l'affichage
   * @param {string} item - Type d'élément
   * @param {any} value - Valeur à formater
   * @returns {string} Valeur formatée
   */
  formatValue(item, value) {
    switch (item) {
      case 'lives':
        /**
         * Fonction if
         * @param {*} typeof - Description du paramètre
         * @returns {*} Description du retour
         */
        if (typeof value === 'number') {
          return '❤️'.repeat(Math.max(0, value)) + '🤍'.repeat(Math.max(0, 3 - value));
        }
        return value;
      case 'time':
        /**
         * Fonction if
         * @param {*} typeof - Description du paramètre
         * @returns {*} Description du retour
         */
        if (typeof value === 'number') {
          const minutes = Math.floor(value / 60);
          const seconds = value % 60;
          return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return value;
      case 'bonus':
        return value > 0 ? `+${value}s` : value;
      default:
        return value;
    }
  },

  /**
   * Supprimer la barre d'information d'un conteneur
   * @param {string} containerId - ID du conteneur
   */
  remove(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      const infoBar = container.querySelector('.game-info-bar');
      /**
       * Fonction if
       * @param {*} infoBar - Description du paramètre
       * @returns {*} Description du retour
       */
      if (infoBar) {
        infoBar.remove();
        console.log(`📊 InfoBar supprimée de "${containerId}"`);
      }
    }
  },

  /**
   * Créer une barre d'information arcade avec template personnalisé
   * @param {Object} config - Configuration { mode, canvasId, operationId, etc. }
   * @returns {string} HTML complet de la zone de jeu arcade avec barre d'info
   */
  createArcadeTemplate(config = {}) {
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

    const leftStat = this._leftStat(showScore, scoreId);
    const livesStat = this._livesStat(showLives, livesId);
    const timerStat = this._timerStat(showLives, timerId);

    return `
            <div class="arcade-mult-display" id="${operationId}" aria-live="polite">
                <div class="arcade-mobile-top" style="display:flex; flex-direction:row; align-items:center; justify-content:center; width:100%;">
                    ${leftStat}
                    <span class="arcade-question" style="flex:1; text-align:center; display:block;">${operationLabel}</span>
                    ${this._placeholder('60px')}
                </div>
                <div class="arcade-mobile-bottom" style="display:flex; flex-direction:row; align-items:center; justify-content:center; width:100%;">
                    ${this._placeholder('60px')}
                    ${timerStat}
                    ${livesStat}
                    ${this._placeholder('60px')}
                </div>
            </div>
            <div class="arcade-game-ui" role="region" aria-label="Zone de jeu" style="margin-top:8px; width:100%; height:80vh; display:flex; justify-content:center; align-items:center;">
                <canvas id="${canvasId}" tabindex="0" aria-label="Jeu Arcade" style="width:100%; height:100%;"></canvas>
                <button class="btn btn-secondary" id="${abandonId}" aria-label="${abandonLabel}">${abandonLabel}</button>
            </div>
        `;
  },

  /**
   * Crée une structure DOM (sans innerHTML) pour la zone arcade
   * @param {Object} config Configuration identique à createArcadeTemplate
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

    // Top display container
    const display = document.createElement('div');
    display.className = 'arcade-mult-display';
    display.id = operationId;
    display.setAttribute('aria-live', 'polite');
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

console.log('📊 Module InfoBar chargé');
