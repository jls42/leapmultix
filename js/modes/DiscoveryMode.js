/**
 * Mode Découverte refactorisé avec héritage de GameMode
 * Phase 5.5 - Refactorisation du mode Discovery
 *
 * Fonctionnalités spécifiques:
 * - Laboratoire des multiplications
 * - Sélection de table puis exploration
 * - Animations et aides visuelles
 * - Glisser-déposer interactif
 * - Astuces mnémotechniques
 */

import { GameMode } from '../core/GameMode.js';
import { getTranslation, speak, addArrowKeyNavigation } from '../utils-es6.js';
import { UserState } from '../core/userState.js';

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
    this.phase = 'selection'; // selection, exploration
    this.exploredTables = [];
    this.draggedElement = null;
    this.touchClone = null;
  }

  /**
   * Initialisation spécifique du Discovery
   */
  async onStart() {
    // Commencer par la sélection de table
    this.phase = 'selection';
    this.loadExploredTables();

    console.log('🧪 Mode Discovery démarré - Laboratoire des multiplications');
  }

  /**
   * HTML personnalisé pour le Discovery
   */
  async getCustomHTML() {
    if (this.phase === 'selection') {
      return this.getTableSelectionHTML();
    } else {
      return this.getTableExplorationHTML();
    }
  }

  /**
   * HTML de sélection de table
   */
  getTableSelectionHTML() {
    return `
            <div class="discovery-container">
                <div class="discovery-intro">
                    <p>${getTranslation('discovery_lab_intro')}</p>
                </div>
                <div class="lab-selector" id="table-selector">
                    ${Array.from({ length: 10 }, (_, i) => i + 1)
                      .map(
                        num => `
                            <div class="lab-item" data-table="${num}">
                                <div class="lab-icon">🧪</div>
                                <div class="lab-name">${getTranslation('table_of')} ${num}</div>
                                ${this.exploredTables.includes(num) ? '<div class="explored-badge">✅</div>' : ''}
                            </div>
                        `
                      )
                      .join('')}
                </div>
            </div>
        `;
  }

  /**
   * HTML d'exploration de table
   */
  getTableExplorationHTML() {
    if (!this.currentTable) return '';

    return `
            <div class="discovery-container">
                <h2>${getTranslation('discovery_lab_title', { table: this.currentTable })}</h2>
                <div class="lab-experiment">
                    <div class="experiment-intro">
                        <p class="experiment-description">${getTranslation('discovery_explore_intro', { table: this.currentTable })}</p>
                    </div>

                    <!-- Carrousel des multiplications -->
                    <div class="multiplication-carousel">
                        ${this.generateCarouselHTML()}
                    </div>

                    <!-- Zone d'animation dynamique -->
                    <div class="animation-area">
                        <div class="animation-title">${getTranslation('discovery_click_multiplication')}</div>
                        <div id="animation-container" class="animation-container">
                            <!-- L'animation sera insérée ici dynamiquement -->
                        </div>
                    </div>

                    <!-- Astuce mnémotechnique -->
                    <div class="mnemonic-card">
                        <h3>${getTranslation('hint')}</h3>
                        <div class="mnemonic-character">🧙‍♂️</div>
                        <p>${getTranslation(`mnemonic_${this.currentTable}`)}</p>
                    </div>
                </div>

                ${this.generateNumberLineHTML()}
                ${this.generateVisualExplorationHTML()}
                ${this.generateInteractionHTML()}

                <div class="button-row">
                    <button id="discovery-table-back-btn" class="btn">
                        ${getTranslation('back_to_tables')}
                    </button>
                    <button id="discovery-home-btn" class="btn">
                        ${getTranslation('back_to_home')}
                    </button>
                </div>
            </div>
        `;
  }

  /**
   * Générer le carrousel des multiplications
   */
  generateCarouselHTML() {
    let html = '';
    for (let i = 1; i <= 10; i++) {
      html += `
                <div class="carousel-item" data-row="${i}" data-action="trigger-animation" data-a="${this.currentTable}" data-b="${i}">
                    <div class="card-base card-base--clickable equation-card">
                        <div class="equation-display">${this.currentTable} × ${i} = ${this.currentTable * i}</div>
                    </div>
                </div>
            `;
    }
    return html;
  }

  /**
   * Générer la ligne numérique
   */
  generateNumberLineHTML() {
    const table = this.currentTable;
    const maxValue = table * 10;

    return `
            <div class="number-line-section">
                <h3>${getTranslation('number_line_title')}</h3>
                <div class="number-line-container">
                    <div class="number-line">
                        ${Array.from({ length: 11 }, (_, i) => {
                          const value = table * i;
                          return `
                                <div class="number-point ${i === 0 ? 'start' : ''}" 
                                     data-value="${value}" 
                                     style="left: ${(value / maxValue) * 100}%">
                                    <div class="point-marker"></div>
                                    <div class="point-label">${value}</div>
                                    <div class="point-equation">${table}×${i}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
  }

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
   * Générer l'aide visuelle
   */
  generateVisualAid() {
    const table = this.currentTable;
    let html = '';

    for (let multiplicand = 1; multiplicand <= 10; multiplicand++) {
      const result = table * multiplicand;
      html += `
                <div class="visual-item" data-multiplicand="${multiplicand}" data-table="${table}">
                    <div class="visual-equation">${table} × ${multiplicand} = ${result}</div>
                    <div class="visual-representation">
                        ${this.generateVisualObjects(table, multiplicand)}
                    </div>
                </div>
            `;
    }

    return html;
  }

  /**
   * Générer les objets visuels
   */
  generateVisualObjects(table, multiplicand) {
    let html = '<div class="visual-groups">';

    // Créer multiplicand groupes de table objets
    for (let group = 0; group < multiplicand; group++) {
      html += '<div class="visual-group">';
      for (let item = 0; item < table; item++) {
        html += '<span class="visual-object">🔵</span>';
      }
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  /**
   * Générer l'interaction glisser-déposer
   */
  generateInteractionHTML() {
    return `
            <div class="optional-interaction">
                <h3>${getTranslation('manipulation_title')}</h3>
                <div class="interaction-instructions">
                    <p>${getTranslation('manipulation_instructions')}</p>
                </div>
                <div id="drag-area">
                    ${Array.from({ length: 10 }, (_, i) => i + 1)
                      .map(
                        num => `
                            <div class="drag-item" draggable="true" data-number="${num}">${num}</div>
                        `
                      )
                      .join('')}
                </div>
                <div class="lab-dropzone" id="drop-zone" data-table="${this.currentTable}">
                    <div class="dropzone-content">${this.currentTable} × ? = ?</div>
                    <div class="dropzone-flask">🧪</div>
                </div>
            </div>
        `;
  }

  /**
   * Configuration post-UI pour le Discovery
   */
  async initializeUI() {
    await super.initializeUI();

    if (this.phase === 'selection') {
      this.setupTableSelection();
    } else {
      this.setupTableExploration();
    }
  }

  /**
   * Configurer la sélection de table
   */
  setupTableSelection() {
    // Ajouter les écouteurs pour les tables
    document.querySelectorAll('.lab-item[data-table]').forEach(item => {
      item.addEventListener('click', () => {
        const tableNum = parseInt(item.dataset.table);
        this.showTable(tableNum);
      });
    });

    // Navigation clavier
    addArrowKeyNavigation(document.getElementById('table-selector'), '.lab-item');
  }

  /**
   * Configurer l'exploration de table
   */
  setupTableExploration() {
    // Bouton retour aux tables
    const backBtn = document.getElementById('discovery-table-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.returnToTableSelection());
    }

    // Bouton retour à l'accueil
    const homeBtn = document.getElementById('discovery-home-btn');
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        import('../slides.js').then(m => m.goToSlide(1));
      });
    }

    // Configurer le glisser-déposer
    this.setupDragAndDrop();

    // Navigation clavier pour le carrousel
    addArrowKeyNavigation(document.querySelector('.multiplication-carousel'), '.carousel-item');

    // Délégation: clics sur le carrousel (évite inline onclick)
    const carousel = document.querySelector('.multiplication-carousel');
    if (carousel) {
      carousel.addEventListener('click', e => {
        const item = e.target.closest('.carousel-item[data-action="trigger-animation"]');
        if (!item) return;
        const a = parseInt(item.getAttribute('data-a') || '0', 10);
        const b = parseInt(item.getAttribute('data-b') || '0', 10);
        if (!Number.isNaN(a) && !Number.isNaN(b)) this.triggerAnimation(a, b);
      });
    }

    // Délégation: clics sur l'aide visuelle
    const visualGrid = document.getElementById('visual-grid-container');
    if (visualGrid) {
      visualGrid.addEventListener('click', e => {
        const item = e.target.closest('.visual-item');
        if (!item) return;
        const table = parseInt(
          item.getAttribute('data-table') || String(this.currentTable || 0),
          10
        );
        const multiplicand = parseInt(item.getAttribute('data-multiplicand') || '0', 10);
        if (!Number.isNaN(table) && !Number.isNaN(multiplicand))
          this.highlightVisualAid(table, multiplicand);
      });
    }
  }

  /**
   * Afficher une table spécifique
   */
  async showTable(table) {
    this.currentTable = table;
    this.phase = 'exploration';

    // Sauvegarder comme explorée
    this.saveExploredTable(table);

    // Mettre à jour l'interface
    await this.initializeUI();

    // Parler
    speak(`${getTranslation('table_of')} ${table}`);

    console.log(`🧪 Exploration de la table ${table}`);
  }

  /**
   * Retourner à la sélection de table
   */
  async returnToTableSelection() {
    this.phase = 'selection';
    this.currentTable = null;
    await this.initializeUI();
  }

  /**
   * Déclencher l'animation d'une multiplication
   */
  triggerAnimation(a, b) {
    const result = a * b;
    const animContainer = document.getElementById('animation-container');

    if (!animContainer) return;

    // Effacer le contenu précédent (sans innerHTML)
    animContainer.textContent = '';

    const root = document.createElement('div');
    root.className = 'animated-equation';

    const step = document.createElement('div');
    step.className = 'animation-step';
    root.appendChild(step);

    const text = document.createElement('div');
    text.className = 'animation-text';
    text.textContent = a <= 5 ? `${a} × ${b} = ?` : `${a} × ${b}`;
    step.appendChild(text);

    if (a <= 5) {
      // Petites tables: objets groupés
      const objects = document.createElement('div');
      objects.className = 'animation-objects';
      for (let i = 0; i < b; i++) {
        const group = document.createElement('div');
        group.className = 'object-group';
        for (let j = 0; j < a; j++) {
          const span = document.createElement('span');
          span.className = 'object';
          span.textContent = '🍎';
          group.appendChild(span);
        }
        objects.appendChild(group);
      }
      step.appendChild(objects);
    } else {
      // Grandes tables: séquence de calcul
      const calc = document.createElement('div');
      calc.className = 'animation-calculation';
      const cap = document.createElement('div');
      cap.className = 'calc-step';
      cap.textContent = `Compter par ${a} : `;
      calc.appendChild(cap);
      let current = 0;
      for (let i = 1; i <= b; i++) {
        current += a;
        const num = document.createElement('span');
        num.className = 'calc-number';
        num.textContent = String(current);
        calc.appendChild(num);
        if (i < b) {
          const arrow = document.createElement('span');
          arrow.textContent = ' → ';
          calc.appendChild(arrow);
        }
      }
      step.appendChild(calc);
    }

    const resultEl = document.createElement('div');
    resultEl.className = 'animation-result';
    resultEl.textContent = `= ${result}`;
    step.appendChild(resultEl);

    animContainer.appendChild(root);

    // Déclencher les animations CSS (rendre visible)
    try {
      const root2 = animContainer.querySelector('.animated-equation');
      const step2 = animContainer.querySelector('.animation-step');
      const result2 = animContainer.querySelector('.animation-result');
      // Utiliser rAF pour garantir l'insertion avant d'ajouter les classes
      requestAnimationFrame(() => {
        root2?.classList.add('animate');
        step2?.classList.add('animate');
        // Délai léger pour un effet progressif
        setTimeout(() => {
          result2?.classList.add('animate');
        }, 50);
      });
    } catch {
      /* no-op: animation fallback */
    }

    // Parler le résultat
    this.speakMultiplication(a, b);
  }

  /**
   * Mettre en évidence l'aide visuelle
   */
  highlightVisualAid(table, multiplicand) {
    // Retirer les highlights précédents
    document.querySelectorAll('.visual-item').forEach(item => {
      item.classList.remove('highlighted');
    });

    // Ajouter le highlight à l'élément sélectionné
    const targetItem = document.querySelector(`[data-multiplicand="${multiplicand}"]`);
    if (targetItem) {
      targetItem.classList.add('highlighted');
    }

    // Parler l'équation
    this.speakMultiplication(table, multiplicand);
  }

  /**
   * Configurer le glisser-déposer
   */
  setupDragAndDrop() {
    const dragItems = document.querySelectorAll('.drag-item');
    const dropZone = document.getElementById('drop-zone');

    if (!dropZone) return;

    // Événements de glisser
    dragItems.forEach(item => {
      item.addEventListener('dragstart', e => this.handleDragStart(e));

      // Support tactile
      item.addEventListener('touchstart', e => this.handleTouchStart(e), { passive: false });
      item.addEventListener('touchmove', e => this.handleTouchMove(e), { passive: false });
      item.addEventListener('touchend', e => this.handleTouchEnd(e), { passive: false });
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
    this.draggedElement = e.target;
    try {
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        const num = String(e.target?.dataset?.number || '');
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
    const dropZone = document.getElementById('drop-zone');

    if (!dropZone) return;

    dropZone.classList.remove('drag-over');

    // Récupérer le nombre depuis dataTransfer, sinon fallback élément glissé
    let numberStr = '';
    try {
      if (e.dataTransfer) {
        numberStr = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('text') || '';
      }
    } catch {
      /* ignore */
    }

    let number = parseInt(numberStr, 10);
    if (Number.isNaN(number)) {
      number = parseInt(this.draggedElement?.dataset?.number || '0', 10);
    }
    if (Number.isNaN(number) || number <= 0) return;

    const table = parseInt(dropZone.dataset.table, 10);
    if (Number.isNaN(table) || table <= 0) return;

    const result = table * number;

    // Mettre à jour la zone de dépôt
    const label = dropZone.querySelector('.dropzone-content');
    if (label) label.textContent = `${table} × ${number} = ${result}`;

    // Animation de succès
    dropZone.classList.add('success');
    setTimeout(() => {
      dropZone.classList.remove('success');
    }, 1000);

    // Parler le résultat
    this.speakMultiplication(table, number);

    this.draggedElement = null;
  }

  /**
   * Support tactile - début
   */
  handleTouchStart(e) {
    e.preventDefault();
    this.draggedElement = e.target;

    // Créer un clone pour le feedback visuel
    this.touchClone = e.target.cloneNode(true);
    this.touchClone.classList.add('touch-clone');
    document.body.appendChild(this.touchClone);

    const touch = e.touches[0];
    this.positionClone(touch.clientX, touch.clientY);
  }

  /**
   * Support tactile - mouvement
   */
  handleTouchMove(e) {
    e.preventDefault();
    if (!this.touchClone) return;

    const touch = e.touches[0];
    this.positionClone(touch.clientX, touch.clientY);
  }

  /**
   * Support tactile - fin
   */
  handleTouchEnd(e) {
    e.preventDefault();

    if (this.touchClone) {
      document.body.removeChild(this.touchClone);
      this.touchClone = null;
    }

    // Trouver l'élément sous le doigt
    const touch = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);

    if (elementBelow && elementBelow.closest('#drop-zone')) {
      // Simuler un drop
      const fakeEvent = {
        preventDefault: () => {},
        target: elementBelow.closest('#drop-zone'),
      };
      this.handleDrop(fakeEvent);
    }

    this.draggedElement = null;
  }

  /**
   * Positionner le clone tactile
   */
  positionClone(x, y) {
    if (!this.touchClone) return;

    this.touchClone.style.position = 'fixed';
    this.touchClone.style.left = x - 25 + 'px';
    this.touchClone.style.top = y - 25 + 'px';
    this.touchClone.style.zIndex = '9999';
    this.touchClone.style.pointerEvents = 'none';
  }

  /**
   * Parler une multiplication
   */
  speakMultiplication(a, b) {
    // En mode Découverte, on veut révéler le résultat à l'élocution
    const result = a * b;
    speak(`${a} fois ${b} égale ${result}`);
  }

  /**
   * Sauvegarder une table comme explorée
   */
  saveExploredTable(table) {
    if (!this.exploredTables.includes(table)) {
      this.exploredTables.push(table);
    }

    // Sauvegarder dans les données utilisateur
    const userData = UserState.getCurrentUserData();
    if (!userData.discoveryProgress) {
      userData.discoveryProgress = {};
    }

    userData.discoveryProgress.exploredTables = [...this.exploredTables];
    userData.discoveryProgress.lastExplored = Date.now();

    // Sauvegarder
    UserState.updateUserData(userData);

    console.log(`💾 Table ${table} marquée comme explorée`);
  }

  /**
   * Charger les tables explorées
   */
  loadExploredTables() {
    const userData = UserState.getCurrentUserData();

    if (userData.discoveryProgress && userData.discoveryProgress.exploredTables) {
      this.exploredTables = userData.discoveryProgress.exploredTables;
    }
  }

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
    if (this.touchClone && this.touchClone.parentNode) {
      this.touchClone.parentNode.removeChild(this.touchClone);
      this.touchClone = null;
    }

    this.draggedElement = null;
    this.currentTable = null;
  }

  /**
   * Fonction pour rafraîchir les textes après changement de langue
   */
  refreshTexts() {
    // Recharger complètement l'interface avec les nouvelles traductions
    this.initializeUI();
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
    _discoveryModeInstance?.refreshTexts?.();
  } catch {
    /* no-op: not active */
  }
}
