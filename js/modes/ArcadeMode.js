/**
 * Mode Arcade refactorisé avec héritage de GameMode
 * Phase 5.4 - Refactorisation du mode Arcade
 *
 * Fonctionnalités spécifiques:
 * - Menu de sélection des jeux arcade
 * - Gestion de la difficulté globale
 * - Sélection de vaisseau/avatar
 * - Coordination avec les sous-jeux existants
 */

import { GameMode } from '../core/GameMode.js';
import { getTranslation } from '../utils-es6.js';
import { showArcadeMessage } from '../arcade-message.js';
import { gameState } from '../game.js';

/* Icônes des lignes « Commandes » : des SVG au trait (couleur du texte), décoratifs,
   le mot « Clavier », « Souris » ou « Tactile » étant écrit juste après. */
const CONTROL_ICON_PATHS = {
  keyboard: [
    'M3 7.5A1.5 1.5 0 0 1 4.5 6h15A1.5 1.5 0 0 1 21 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 16.5z',
    'M7 10h.01M11 10h.01M15 10h.01M7 14h.01M17 10h.01M9 14h6M17 14h.01',
  ],
  mouse: ['M12 3a6 6 0 0 1 6 6v6a6 6 0 0 1-12 0V9a6 6 0 0 1 6-6z', 'M12 7v4'],
  touch: [
    'M9 11V5.5a1.5 1.5 0 0 1 3 0V11',
    'M12 10.5a1.5 1.5 0 0 1 3 0V12',
    'M15 11.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-.7a6 6 0 0 1-4.9-2.5L4.2 15.4a1.5 1.5 0 0 1 2.4-1.8L9 16.5',
  ],
};

/** Lignes d'aide de chaque jeu : type de commande et clé de traduction */
const CONTROL_LINES = new Map([
  [
    'invasion',
    [
      ['keyboard', 'arcade.controls.invasion.keyboard'],
      ['mouse', 'arcade.controls.invasion.mouse'],
      ['touch', 'arcade.controls.invasion.touch'],
    ],
  ],
  [
    'multimiam',
    [
      ['keyboard', 'arcade.controls.multimiam.keyboard'],
      ['touch', 'arcade.controls.multimiam.touch'],
    ],
  ],
  [
    'multimemory',
    [
      ['mouse', 'arcade.controls.multimemory.mouse'],
      ['touch', 'arcade.controls.multimemory.touch'],
    ],
  ],
  [
    'multisnake',
    [
      ['keyboard', 'arcade.controls.multisnake.keyboard'],
      ['touch', 'arcade.controls.multisnake.touch'],
    ],
  ],
]);

// Émoji placé en tête d'un ancien texte de traduction (🕹️, ⌨️…) : l'icône est dessinée
const LEADING_EMOJI = /^(?:[\p{Extended_Pictographic}\uFE0F\u200D]+\s*)+/u;

function controlIconSVG(type) {
  const paths = CONTROL_ICON_PATHS[type] || [];
  return `<svg class="arcade-control-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths
    .map(d => `<path d="${d}"/>`)
    .join('')}</svg>`;
}

function prefersReducedMotion() {
  try {
    return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;
  } catch {
    return false;
  }
}

export class ArcadeMode extends GameMode {
  /**
   * Fonction constructor
   */
  constructor() {
    super('arcade', {
      maxQuestions: 0, // Pas de questions directes (délégué aux sous-jeux)
      hasTimer: false,
      hasLives: false,
      hasStreaks: false,
      autoProgress: false,
      showScore: false,
    });

    // État spécifique à l'Arcade
    this.selectedDifficulty = 'moyen';
    this.selectedSpaceship = null;
    this.listElement = null;
    this.listClickHandler = this.handleListClick.bind(this);
    this.availableGames = [
      {
        id: 'invasion',
        nameKey: 'arcade_invasion_title',
        descKey: 'arcade_invasion_desc',
        logo: 'logo_multiinvaders.png',
        startFunction: 'startMultiplicationInvasion',
      },
      {
        id: 'multimiam',
        nameKey: 'arcade_pacman_title',
        descKey: 'arcade_pacman_desc',
        logo: 'logo_multimiam.png',
        startFunction: 'startPacmanArcade',
      },
      {
        id: 'multimemory',
        nameKey: 'arcade_memory_title',
        descKey: 'arcade_memory_desc',
        logo: 'logo_multimemory.png',
        startFunction: 'startMemoryArcade',
      },
      {
        id: 'multisnake',
        nameKey: 'arcade_snake_title',
        descKey: 'arcade_snake_desc',
        logo: 'logo_multisnake.png',
        startFunction: 'startSnakeArcade',
      },
    ];

    // Charger les préférences sauvegardées
    this.loadArcadePreferences();
  }

  /**
   * Initialisation spécifique de l'Arcade
   */
  async onStart() {
    // Pas de question générée - on affiche le menu de sélection
    console.log('🕹️ Mode Arcade démarré - Menu de sélection');
  }

  /**
   * Nettoyage spécifique de l'Arcade
   */
  onStop() {
    this.detachArcadeListEvents();
    // Nettoyer la classe arcade-wide de la content-card
    const contentCard = document.querySelector('.content-card.arcade-wide');
    if (contentCard) {
      contentCard.classList.remove('arcade-wide');
    }
  }

  /**
   * HTML personnalisé pour l'Arcade (menu de sélection)
   */
  async getCustomHTML() {
    // Le titre « Mode Arcade » et la région principale viennent déjà de GameMode :
    // ici, seulement l'introduction et la liste des jeux.
    return `
            <div class="arcade-container arcade-container-wide">
                <p class="arcade-intro">${getTranslation('arcade_intro')}</p>
                <div class="arcade-games-list">
                    ${this.generateGamesHTML()}
                </div>
            </div>
        `;
  }

  /**
   * Générer le HTML des jeux disponibles
   */
  generateGamesHTML() {
    return this.availableGames
      .map(
        game => `
            <div id="${this.getCardId(game.id)}" class="arcade-game-card collapsed" data-game="${game.id}">
                <div class="game-thumb">
                    <img src="assets/images/arcade/${game.logo}" alt=""
                         class="arcade-logo" onerror="this.src='assets/images/arcade/logo_mode_arcade.png';this.onerror=null;">
                </div>

                <h3 class="game-title">
                    <button type="button" class="arcade-game-toggle" data-action="arcade-toggle"
                            aria-expanded="false" aria-controls="${this.getSettingsId(game.id)}"
                            aria-describedby="${this.getCardId(game.id)}-desc">${this.getGameTitle(game.id)}</button>
                </h3>

                <p class="game-desc" id="${this.getCardId(game.id)}-desc">
                    ${this.getGameDescription(game.id)}
                </p>

                <div class="arcade-game-settings" id="${this.getSettingsId(game.id)}">
                    ${this.getDifficultyHTML(game.id)}
                    ${game.id === 'invasion' ? this.getSpaceshipHTML(game.id) : ''}
                    ${this.getControlsHelpHTML(game.id)}

                    <button type="button" class="btn play-arcade-btn" data-action="arcade-play" data-game="${game.id}">
                        ${getTranslation('play_button')}
                    </button>
                </div>
            </div>
        `
      )
      .join('');
  }

  getSettingsId(id) {
    return `${this.getCardId(id)}-settings`;
  }

  getCardId(id) {
    switch (id) {
      case 'invasion':
        return 'multiplication-invasion-card';
      case 'multimiam':
        return 'multimiam-arcade-card';
      case 'multimemory':
        return 'multimemory-arcade-card';
      case 'multisnake':
        return 'multisnake-arcade-card';
      default:
        return `${id}-arcade-card`;
    }
  }

  getGameTitle(id) {
    switch (id) {
      case 'invasion':
        return getTranslation('arcade_invasion_title') || 'MultiInvaders';
      case 'multisnake':
        return getTranslation('multisnake_title') || getTranslation('arcade_snake_title');
      case 'multimiam':
        return getTranslation('arcade.multiMiam.title') || getTranslation('arcade_pacman_title');
      case 'multimemory':
        return getTranslation('arcade.multiMemory.title');
      default:
        return id;
    }
  }

  getGameDescription(id) {
    switch (id) {
      case 'invasion':
        return getTranslation('multiinvaders_desc');
      case 'multisnake':
        return getTranslation('multisnake_desc');
      case 'multimiam':
        return getTranslation('arcade.multiMiam.description');
      case 'multimemory':
        return getTranslation('arcade.multiMemory.description');
      default:
        return '';
    }
  }

  /**
   * Générer le HTML de sélection de difficulté
   */
  getDifficultyHTML(gameId) {
    const difficulties = [
      {
        key: 'debutant',
        label: getTranslation('difficulty_beginner') || getTranslation('difficulty_easy'),
      },
      { key: 'moyen', label: getTranslation('difficulty_medium') },
      { key: 'difficile', label: getTranslation('difficulty_hard') },
    ];

    return `
            <div class="improved-difficulty-select" role="group" aria-label="${getTranslation('difficulty_label')}">
                <div class="difficulty-label">${getTranslation('difficulty_label')}</div>
                <div class="difficulty-btn-row">
                    ${difficulties
                      .map(
                        diff => `
                        <button type="button" class="difficulty-btn ${this.selectedDifficulty === diff.key ? 'selected' : ''}"
                                data-level="${diff.key}"
                                aria-pressed="${this.selectedDifficulty === diff.key ? 'true' : 'false'}"
                                data-action="arcade-set-difficulty" data-difficulty="${diff.key}" data-game="${gameId}">
                            ${diff.label}
                        </button>
                    `
                      )
                      .join('')}
                </div>
            </div>
        `;
  }

  /**
   * Générer le HTML de sélection de vaisseau
   */
  getSpaceshipHTML(gameId) {
    const avatar = gameState?.avatar || 'fox';
    const spaceshipVariants = this.getSpaceshipVariants(avatar);
    const valueOf = variant => `${variant.file}|${variant.fallback}`;
    // La fusée choisie la dernière fois reste cochée (sinon la première)
    const savedIndex = spaceshipVariants.findIndex(v => valueOf(v) === this.selectedSpaceship);
    const checkedIndex = savedIndex >= 0 ? savedIndex : 0;
    const titleId = `${this.getCardId(gameId)}-spaceship-title`;

    return `
            <div class="spaceship-select-block" role="radiogroup" aria-labelledby="${titleId}">
                <div class="spaceship-select-title" id="${titleId}">${getTranslation('choose_spaceship')}</div>
                <div class="spaceship-select-row">
                    ${spaceshipVariants
                      .map(
                        (variant, idx) => `
                        <label class="spaceship-option">
                            <input type="radio" name="spaceship-choice-${gameId}"
                                   value="${valueOf(variant)}"
                                   ${idx === checkedIndex ? 'checked' : ''}
                                   data-action="arcade-set-spaceship" data-game="${gameId}"
                                   data-value="${valueOf(variant)}">
                            <img class="spaceship-thumb" src="assets/images/arcade/${variant.file}"
                                 alt=""
                                 onerror="this.src='assets/images/arcade/${variant.fallback}';this.onerror=null;">
                            <span class="spaceship-label">${variant.name}</span>
                        </label>
                    `
                      )
                      .join('')}
                </div>
            </div>
        `;
  }

  // plus de sélecteur global (intégré dans la carte Invasion)

  /**
   * Obtenir les variantes de vaisseau selon l'avatar
   */
  getSpaceshipVariants(avatar) {
    const overrides = {
      fox: { high: 'renard_vaisseau_2_256x256.png', low: 'renard_vaisseau_256x256.png' },
      panda: { high: 'panda_vaisseau_2_256x256.png', low: 'panda_vaisseau_256x256.png' },
      unicorn: { high: 'licorne_vaisseau_2_256x256.png', low: 'licorne_vaisseau_256x256.png' },
      dragon: { high: 'dragon_vaisseau_2_256x256.png', low: 'dragon_vaisseau_256x256.png' },
      astronaut: {
        high: 'astronaute_vaisseau_2_256x256.png',
        low: 'astronaute_vaisseau_256x256.png',
      },
    };

    const o = overrides[avatar] || {};

    return [
      {
        name: getTranslation('spaceship_lotus'),
        file: o.high || `spaceship_${avatar}_2.png`,
        fallback: o.low || 'spaceship_default_2.png',
      },
      {
        name: getTranslation('spaceship_comete'),
        file: `spaceship_${avatar}.png`,
        fallback: 'spaceship_default_128x128.png',
      },
    ];
  }

  /**
   * Configuration post-UI pour l'Arcade
   */
  async initializeUI() {
    this.detachArcadeListEvents();
    await super.initializeUI();

    // Ajouter classe pour élargir la content-card
    const contentCard = this.gameScreen.closest('.content-card');
    if (contentCard) {
      contentCard.classList.add('arcade-wide');
    }

    this.attachArcadeListEvents();
  }

  attachArcadeListEvents() {
    const list = this.gameScreen?.querySelector('.arcade-games-list');
    // Idempotency guard: in case this helper is called without a prior detach,
    // always remove the previously registered listener before attaching a new one.
    if (this.listElement) {
      this.listElement.removeEventListener('click', this.listClickHandler);
    }

    this.listElement = list || null;

    if (this.listElement) {
      this.listElement.addEventListener('click', this.listClickHandler);
    }
  }

  detachArcadeListEvents() {
    if (this.listElement) {
      this.listElement.removeEventListener('click', this.listClickHandler);
      this.listElement = null;
    }
  }

  handleListClick(e) {
    const actionEl = e.target.closest('[data-action]');
    if (actionEl) {
      const action = actionEl.getAttribute('data-action');
      if (action === 'arcade-toggle') {
        const toggledCard = actionEl.closest('.arcade-game-card');
        if (toggledCard) this.toggleCard(toggledCard);
        return;
      }
      if (action === 'arcade-play') {
        const gameId = actionEl.getAttribute('data-game');
        if (gameId) this.startGame(gameId);
        return;
      }
      if (action === 'arcade-set-difficulty') {
        const diff = actionEl.getAttribute('data-difficulty');
        const gameId = actionEl.getAttribute('data-game');
        if (diff && gameId) this.setDifficulty(diff, gameId);
        return;
      }
      if (action === 'arcade-set-spaceship') {
        const input = e.target.closest('input[type="radio"]');
        if (input && input.value) this.setSpaceship(input.value);
        return;
      }
    }
    const card = e.target.closest('.arcade-game-card');
    // Un clic dans les réglages d'une tuile ouverte ne la referme pas
    const insideControl = e.target.closest(
      'button,input,label,.arcade-game-settings,.difficulty-btn-row,.spaceship-select-block,.arcade-controls-help'
    );
    if (card && !insideControl) {
      this.toggleCard(card);
    }
  }

  toggleCard(card) {
    const all = this.gameScreen.querySelectorAll('.arcade-game-card');
    all.forEach(c => {
      if (c !== card) this.setCardExpanded(c, false);
    });
    const willExpand = !card.classList.contains('expanded');
    this.setCardExpanded(card, willExpand);
    if (willExpand) this.revealPlayButton(card);
  }

  /**
   * Ouvre ou ferme une tuile et tient à jour l'état annoncé par son bouton.
   */
  setCardExpanded(card, expanded) {
    card.classList.toggle('expanded', expanded);
    card.classList.toggle('collapsed', !expanded);
    card.querySelector('.arcade-game-toggle')?.setAttribute('aria-expanded', String(expanded));
  }

  /**
   * Tuile ouverte : « Jouer » est ramené à l'écran s'il est en dessous.
   */
  revealPlayButton(card) {
    const play = card.querySelector('.play-arcade-btn');
    if (!play || typeof play.scrollIntoView !== 'function') return;
    const reveal = () => {
      try {
        play.scrollIntoView({
          block: 'nearest',
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        });
      } catch {
        play.scrollIntoView(false);
      }
    };
    if (typeof globalThis.requestAnimationFrame === 'function') {
      globalThis.requestAnimationFrame(reveal);
    } else {
      reveal();
    }
  }

  /**
   * Définir la difficulté sélectionnée
   */
  setDifficulty(difficulty, gameId) {
    this.selectedDifficulty = difficulty;
    this.saveArcadePreferences();

    // La difficulté est commune aux quatre jeux : toutes les tuiles affichent le même choix
    const scope =
      this.gameScreen?.querySelector('.arcade-games-list') ||
      document.querySelector(`[data-game="${gameId}"]`);
    if (scope) {
      scope.querySelectorAll('.difficulty-btn').forEach(btn => {
        const isSelected = btn.getAttribute('data-difficulty') === difficulty;
        btn.classList.toggle('selected', isSelected);
        btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      });
    }

    console.log(`🎯 Difficulté sélectionnée: ${difficulty}`);
  }

  /**
   * Définir le vaisseau sélectionné
   */
  setSpaceship(spaceshipData) {
    this.selectedSpaceship = spaceshipData;
    gameState.selectedSpaceship = spaceshipData;
    this.saveArcadePreferences();
    console.log(`🚀 Vaisseau sélectionné: ${spaceshipData}`);
  }

  /**
   * Démarrer un jeu arcade spécifique
   */
  startGame(gameId) {
    const game = this.availableGames.find(g => g.id === gameId);
    if (!game) {
      console.error(`❌ Jeu arcade inconnu: ${gameId}`);
      return;
    }

    console.log(`🎮 Démarrage du jeu arcade: ${gameId}`);

    // Sauvegarder les préférences dans gameState global
    /**
     * Fonction if
     * @param {*} window.gameState - Description du paramètre
     * @returns {*} Description du retour
     */
    gameState.difficulty = this.selectedDifficulty;
    gameState.gameMode = gameId; // Pour que les sous-jeux sachent quel mode ils sont

    // Sauvegarder dans localStorage pour persistance
    localStorage.setItem('gameState.difficulty', this.selectedDifficulty);
    // Prioriser la sélection de fusée dans la carte du jeu (si présente)
    const card = document.querySelector(`[data-game="${gameId}"]`);
    const sel = card
      ? card.querySelector(`input[name="spaceship-choice-${gameId}"]:checked`)
      : null;
    const shipVal =
      sel?.value || this.selectedSpaceship || localStorage.getItem('arcade.selectedSpaceship');
    if (shipVal) this.setSpaceship(shipVal);

    // Démarrer via import ESM; pas de fallback legacy window.*

    switch (gameId) {
      case 'invasion':
        import('../arcade-invasion.js')
          .then(mod => {
            if (typeof mod.startMultiplicationInvasion === 'function')
              return mod.startMultiplicationInvasion();
            console.error('❌ startMultiplicationInvasion non disponible dans arcade-invasion.js');
            showArcadeMessage('arcade_load_error', 'warning', 1800);
          })
          .catch(err => {
            console.error('❌ Import arcade-invasion failed:', err);
            showArcadeMessage('arcade_load_error', 'warning', 1800);
          });
        break;
      case 'multimiam':
        import('../arcade-multimiam.js')
          .then(mod => {
            if (typeof mod.startPacmanArcade === 'function') return mod.startPacmanArcade();
            console.error('❌ startPacmanArcade non disponible dans arcade-multimiam.js');
            showArcadeMessage('arcade_load_error', 'warning', 1800);
          })
          .catch(err => {
            console.error('❌ Import arcade-multimiam failed:', err);
            showArcadeMessage('arcade_load_error', 'warning', 1800);
          });
        break;
      case 'multimemory':
        import('../arcade-multimemory.js')
          .then(mod => {
            if (typeof mod.startMemoryArcade === 'function') return mod.startMemoryArcade();
            console.error('❌ startMemoryArcade non disponible dans arcade-multimemory.js');
            showArcadeMessage('arcade_load_error', 'warning', 1800);
          })
          .catch(err => {
            console.error('❌ Import arcade-multimemory failed:', err);
            showArcadeMessage('arcade_load_error', 'warning', 1800);
          });
        break;
      case 'multisnake':
        import('../arcade-multisnake.js')
          .then(mod => {
            if (typeof mod.startSnakeArcade === 'function') return mod.startSnakeArcade();
            console.error('❌ startSnakeArcade non disponible dans arcade-multisnake.js');
            showArcadeMessage('arcade_load_error', 'warning', 1800);
          })
          .catch(err => {
            console.error('❌ Import arcade-multisnake failed:', err);
            showArcadeMessage('arcade_load_error', 'warning', 1800);
          });
        break;
      default:
        console.error(`❌ Jeu arcade inconnu: ${gameId}`);
    }
  }

  /**
   * Charger les préférences arcade sauvegardées
   */
  loadArcadePreferences() {
    // Charger la difficulté
    const savedDifficulty = localStorage.getItem('gameState.difficulty');
    /**
     * Fonction if
     * @param {*} savedDifficulty - Description du paramètre
     * @returns {*} Description du retour
     */
    if (savedDifficulty) {
      this.selectedDifficulty = savedDifficulty;
    }

    // Charger le vaisseau (si sauvegardé)
    const savedSpaceship = localStorage.getItem('arcade.selectedSpaceship');
    /**
     * Fonction if
     * @param {*} savedSpaceship - Description du paramètre
     * @returns {*} Description du retour
     */
    if (savedSpaceship) {
      this.selectedSpaceship = savedSpaceship;
      gameState.selectedSpaceship = savedSpaceship;
    }
  }

  /**
   * Sauvegarder les préférences arcade
   */
  saveArcadePreferences() {
    localStorage.setItem('gameState.difficulty', this.selectedDifficulty);

    /**
     * Fonction if
     * @param {*} this.selectedSpaceship - Description du paramètre
     * @returns {*} Description du retour
     */
    if (this.selectedSpaceship) {
      localStorage.setItem('arcade.selectedSpaceship', this.selectedSpaceship);
    }
  }

  /**
   * Pas de génération de question pour l'Arcade (menu seulement)
   */
  generateQuestion() {
    // L'Arcade ne génère pas de questions directement
    // Les sous-jeux s'en chargent
  }

  /**
   * Pas d'options pour l'Arcade
   */
  generateOptions() {
    return [];
  }

  /**
   * Pas de traitement de réponse pour l'Arcade
   */
  handleAnswer() {
    // L'Arcade ne traite pas de réponses directement
  }

  /**
   * Données pour la barre d'information (minimales)
   */
  getInfoBarData() {
    // Pas d'InfoBar pour le menu arcade (seulement dans les jeux)
    return null;
  }

  /**
   * Vérification pour continuer (toujours actif pour le menu)
   */
  shouldContinue() {
    return this.state.isActive;
  }

  /**
   * Sauvegarder les résultats (délégué aux sous-jeux)
   */
  saveResults() {
    // Les sous-jeux gèrent leurs propres résultats
    console.log('💾 Résultats Arcade délégués aux sous-jeux');
  }

  /**
   * Afficher les résultats (délégué aux sous-jeux)
   */
  showResults() {
    // Les sous-jeux gèrent leur propre affichage de résultats
    console.log('📊 Affichage des résultats délégué aux sous-jeux');
  }

  /**
   * Fonction pour rafraîchir les textes après changement de langue
   */
  refreshTexts() {
    // Recharger complètement l'interface avec les nouvelles traductions
    this.initializeUI();
  }

  /**
   * Aide visuelle des commandes par jeu (i18n)
   */
  getControlsHelpHTML(gameId) {
    const title = getTranslation('arcade.controls.title');
    const lines = (CONTROL_LINES.get(gameId) || [])
      .map(([type, key]) => [type, getTranslation(key)])
      .filter(
        ([, text]) => typeof text === 'string' && text && !/^\[?arcade\.controls\./.test(text)
      )
      // Chaque ligne dit sa commande (data-input) : le CSS n'affiche que celles de l'appareil
      .map(
        ([type, text]) =>
          `<li class="arcade-control" data-input="${type}">${controlIconSVG(type)}<span>${text.replace(LEADING_EMOJI, '')}</span></li>`
      )
      .join('');

    if (!lines) return '';
    return `<div class="arcade-controls-help"><strong>${title}</strong><ul>${lines}</ul></div>`;
  }
}

// Optionally expose a texts refresher for language changes (no start/stop globals)
let _arcadeModeInstance = null;
export function startArcadeMode() {
  if (_arcadeModeInstance) _arcadeModeInstance.stop();
  _arcadeModeInstance = new ArcadeMode();
  _arcadeModeInstance.start();
}
export function stopArcadeMode() {
  if (_arcadeModeInstance) {
    _arcadeModeInstance.stop();
    _arcadeModeInstance = null;
  }
}
export function refreshArcadeTexts() {
  if (_arcadeModeInstance) {
    _arcadeModeInstance.refreshTexts?.();
  }
}

// Plus de pont global; importer la fonction via ESM si nécessaire

export default ArcadeMode;
