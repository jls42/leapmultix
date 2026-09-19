/**
 * Mode Aventure refactorisé avec héritage de GameMode
 * Phase 5.3 - Refactorisation du mode Adventure
 *
 * Fonctionnalités spécifiques:
 * - Progression narrative par niveaux
 * - Système d'étoiles et déblocage séquentiel
 * - Avatar et personnage animé
 * - Sélection de niveau puis jeu
 *
 * Une erreur est une étape : l'explication reste affichée et « Continuer » attend
 * l'enfant, y compris à la dernière question du niveau. Le niveau se termine
 * toujours sur son propre écran de fin (jamais celui d'un autre mode).
 */

import { GameMode } from '../core/GameMode.js';
import { getAdventureLevelsByOperator } from '../core/adventure-data.js';
import { createSafeImage, createSafeElement } from '../security-utils.js';
import {
  getTranslation,
  showCoinGainAnimation,
  showMessage,
  playSound,
  showFeedback,
  speak,
  updateCoinDisplay,
} from '../utils-es6.js';
import {
  markAnswerOptions,
  tagAnswerOptions,
  markQuestionKind,
  formatCorrectCount,
  formatStarsLabel,
  createResultsSummary,
  createResultsActions,
  createStarRating,
  createStarIcon,
  createLockIcon,
  createAvatarPortrait,
  singleActivation,
  mountResults,
  scrollToScreenTop,
} from '../ui-feedback.js';
import { UserState } from '../core/userState.js';
import { checkAndUnlockBadge } from '../badges.js';
import { updateDailyChallengeProgress } from '../game.js';
import { gameState } from '../game.js';

/** Nom des opérations dans les clés de traduction propres à une opération */
const OPERATION_NAMES = { '+': 'addition', '−': 'subtraction', '÷': 'division' };

/** Étoiles au total pour le badge « Collectionneur d'étoiles » (badge_star_collector_desc) */
const STAR_COLLECTOR_THRESHOLD = 10;

/**
 * La clé existe-t-elle dans la langue active ?
 * @param {string} key
 * @returns {boolean}
 */
function hasTranslation(key) {
  const value = getTranslation(key);
  return typeof value === 'string' && value !== '' && !/^\[.+\]$/.test(value);
}

export class AdventureMode extends GameMode {
  constructor() {
    super('adventure', {
      maxQuestions: 10, // 10 questions par niveau
      hasTimer: false,
      hasLives: true,
      hasStreaks: true,
      autoProgress: true,
      // Pas de chrono : après une erreur, l'explication attend « Continuer »
      pauseAfterError: true,
      showScore: true,
      initialLives: 3,
    });

    // Récupérer l'opérateur actuel depuis UserState
    const userData = UserState.getCurrentUserData();
    this.operator = userData?.preferredOperator || '×';

    // Charger les niveaux appropriés selon l'opération
    const levels = getAdventureLevelsByOperator(this.operator);
    this.adventureLevels = levels.map(level => ({ ...level, completed: false }));

    // État spécifique à l'Adventure
    this.currentLevel = null;
    this.totalStars = 0;
    this.sessionBestStreak = 0;
    this.remainingOperands = []; // Plus générique que remainingMultiplicands
    this.phase = 'selection'; // selection, playing, ending, results
  }

  /**
   * Initialisation spécifique de l'Adventure
   */
  async onStart() {
    // Commencer par la sélection de niveau
    this.phase = 'selection';
    this.loadAdventureProgress();
    this.calculateTotalStars();

    // Pas de question générée automatiquement
    // L'utilisateur doit d'abord choisir un niveau
  }

  /**
   * Réinitialisation (nouveau niveau)
   */
  resetState() {
    super.resetState();
    this.sessionBestStreak = 0;
  }

  /**
   * Clé d'un texte de l'histoire : l'addition, la soustraction et la division ont
   * leur propre titre et leur propre introduction (sinon, texte commun).
   * @param {string} baseKey - adventure_title ou adventure_story_intro
   * @returns {string}
   */
  getStoryKey(baseKey) {
    const name = OPERATION_NAMES[this.operator];
    if (!name) return baseKey;
    const key = `${baseKey}_${name}`;
    return hasTranslation(key) ? key : baseKey;
  }

  /**
   * HTML personnalisé pour l'Adventure (sélection de niveau)
   */
  async getCustomHTML() {
    if (this.phase === 'selection') {
      // Assurer que la progression est chargée avant de générer le HTML
      try {
        this.loadAdventureProgress();
      } catch {
        /* ignore */
      }
      // Recalcule proactif des étoiles avant rendu
      try {
        this.calculateTotalStars();
      } catch {
        /* ignore */
      }
      const titleKey = this.getStoryKey('adventure_title');
      const introKey = this.getStoryKey('adventure_story_intro');
      // Les tuiles de niveaux sont construites en DOM dans setupLevelSelection()
      return `
                <div class="adventure-container">
                    <div class="adventure-header">
                        <div class="adventure-avatar" id="adventure-avatar"></div>
                        <div class="adventure-info">
                            <div class="adventure-name" id="adventure-name"></div>
                            <div class="adventure-stars" id="adventure-stars">
                                <span data-translate="total_stars_adventure_label">${getTranslation('total_stars_adventure_label')}</span>
                                <span id="total-stars-display">${this.totalStars}</span>
                            </div>
                        </div>
                    </div>
                    <h2 data-translate="${titleKey}">${getTranslation(titleKey)}</h2>
                    <p class="adventure-story-intro" data-translate="${introKey}">${getTranslation(introKey)}</p>
                    <h3 data-translate="adventure_choose_destination">${getTranslation('adventure_choose_destination')}</h3>
                    <div class="adventure-levels" id="adventure-levels"></div>
                </div>
            `;
    } else {
      // Phase de jeu : nom du niveau, scène de progression, puis « Abandonner »
      // (replacé après la zone de réponse dans initializeUI)
      return `
                <div class="adventure-level-header">
                    <h3 data-translate="${this.currentLevel.nameKey}">${getTranslation(this.currentLevel.nameKey)}</h3>
                </div>

                <div class="adventure-scene" role="img" aria-label="${getTranslation('adventure_scene_label')}" data-translate-aria-label="adventure_scene_label">
                    <div class="adventure-character" id="adventure-character">${this.getPlayerAvatar()}</div>
                    <div class="adventure-path" id="adventure-path"></div>
                    <div class="adventure-treasure" id="adventure-treasure">
                        <img src="assets/images/arcade/cadeau_ferme.png" alt="" width="72" height="72">
                    </div>
                </div>

                <div class="game-quit adventure-controls">
                    <button id="adventure-abandon" type="button" class="btn btn-quiet btn-danger" data-translate="abandon_adventure_button">${getTranslation('abandon_adventure_button')}</button>
                </div>
            `;
    }
  }

  /**
   * Configuration post-UI pour l'Adventure
   */
  async initializeUI() {
    if (this.phase === 'selection') {
      // Interface de sélection de niveaux - complètement personnalisée
      this.gameScreen = document.getElementById('game');
      if (!this.gameScreen) {
        throw new Error('Conteneur #game non trouvé !');
      }

      // Nettoyer l'écran de jeu
      this.gameScreen.textContent = '';

      // Créer l'interface de sélection directement
      const card = document.createElement('div');
      card.className = 'content-card';

      const customHTML = await this.getCustomHTML();
      try {
        const { sanitizeHtmlToFragment } = await import('../security-utils.js');
        if (typeof customHTML === 'string' && customHTML) {
          // Justification (Codacy/ESLint): modèle interne passé dans notre sanitizeur
          // pour obtenir un DocumentFragment sûr. Pas une entrée utilisateur.
          const frag = sanitizeHtmlToFragment(customHTML);
          // Justification (Codacy/ESLint): on ajoute un fragment déjà assaini,
          // pas une chaîne HTML brute.
          card.appendChild(frag);
        } else if (
          customHTML &&
          typeof customHTML === 'object' &&
          customHTML !== null &&
          'nodeType' in Object(customHTML)
        ) {
          // Already a DOM Node created internally
          // Justification (Codacy/ESLint): noeud DOM interne validé, pas de HTML brut.
          card.appendChild(customHTML);
        }
      } catch {
        // Safe fallback: text node only
        // Justification (Codacy/ESLint): fallback en texte brut (createTextNode),
        // aucune injection HTML possible ici.
        const text = document.createTextNode(typeof customHTML === 'string' ? customHTML : '');
        card.appendChild(text);
      }

      this.gameScreen.appendChild(card);

      this.setupLevelSelection();
    } else {
      // Phase de jeu - utiliser l'interface parent
      await super.initializeUI();
      this.placeActionsAfterAnswers();
      this.setupGameControls();
    }
  }

  /**
   * « Abandonner » passe après la zone de réponse (et après « Continuer »), discret.
   */
  placeActionsAfterAnswers() {
    const container = this.feedbackElement?.parentElement;
    const controls = container?.querySelector('.adventure-controls');
    if (!container || !controls) return;
    container.appendChild(controls);
  }

  /**
   * Configurer la sélection de niveau
   */
  setupLevelSelection() {
    // Mettre à jour l'avatar et le nom
    this.updateAdventureAvatar();

    const nameEl = document.getElementById('adventure-name');
    if (nameEl) {
      const data = UserState.getCurrentUserData?.() || {};
      nameEl.textContent =
        data.nickname && data.nickname.trim() ? data.nickname : gameState?.nickname || 'Joueur';
    }

    // Une étoile dessinée devant le total (récompense, jamais du texte coloré)
    const starsEl = document.getElementById('adventure-stars');
    if (starsEl && !starsEl.querySelector('.reward-star')) {
      starsEl.insertBefore(createStarIcon(true), starsEl.firstChild);
    }

    this.renderLevelTiles();

    // Vérifier les nouvelles récompenses
    this.checkForNewRewards();
  }

  /**
   * Tuiles de niveaux : de vrais boutons, utilisables au clavier ; un niveau
   * verrouillé explique ce qu'il manque.
   */
  renderLevelTiles() {
    const levelsEl = document.getElementById('adventure-levels');
    if (!levelsEl) return;
    levelsEl.textContent = '';
    levelsEl.appendChild(this.createLevelTiles());

    // Une seule activation par geste
    levelsEl.querySelectorAll('.level-card').forEach(card => {
      card.addEventListener(
        'click',
        singleActivation(() => {
          const levelId = parseInt(card.dataset.level, 10);
          const levelData = this.adventureLevels.find(level => level.id === levelId);
          const reason = levelData ? this.getLockReason(levelData) : null;

          if (reason) {
            showMessage(this.getLockMessage(levelData, reason));
          } else {
            this.startLevel(levelId);
          }
        })
      );
    });
  }

  /**
   * Configurer les contrôles de jeu
   */
  setupGameControls() {
    const abandonBtn = document.getElementById('adventure-abandon');
    if (abandonBtn) {
      abandonBtn.onclick = singleActivation(() => this.confirmAbandon());
    }
  }

  /**
   * Démarrer un niveau spécifique
   */
  async startLevel(levelId) {
    const level = this.adventureLevels.find(l => l.id === levelId);
    if (!level) return;

    // Un niveau précédent a pu laisser une fin programmée : on repart de zéro
    this.cleanup();
    this.currentLevel = level;

    const levelInfo =
      this.operator === '×'
        ? `table ${this.currentLevel.table}`
        : `difficulté ${this.currentLevel.difficulty}`;
    console.log(`🏰 Démarrage niveau Adventure ${levelId} (${levelInfo})`);

    // Réinitialiser l'état pour le niveau
    this.resetState();
    this.state.lives = this.config.initialLives;

    // Pour toutes opérations: initialiser les operandes 1-10
    // La différenciation se fait dans getQuestionOptions() selon l'opérateur
    this.remainingOperands = Array.from({ length: 10 }, (_, i) => i + 1);

    // Passer en phase de jeu
    this.phase = 'playing';

    // Réinitialiser complètement l'UI pour la phase de jeu
    await this.initializeUI();

    // Revenir en haut (la barre du haut reste visible) sans animation imposée
    scrollToScreenTop(this.gameScreen);

    // Afficher le dialogue de début de niveau (non bloquant)
    showMessage(getTranslation(this.currentLevel.descKey));

    // Marquer actif (resetState() l'a mis à false) puis générer la première question immédiatement
    this.state.isActive = true;
    this.generateQuestion();
  }

  /**
   * Demander confirmation d'abandon
   */
  confirmAbandon() {
    const Root =
      typeof globalThis !== 'undefined'
        ? globalThis
        : typeof window !== 'undefined'
          ? window
          : undefined;
    if (Root?.confirm && Root.confirm(getTranslation('confirm_abandon_adventure'))) {
      this.returnToLevelSelection();
    }
  }

  /**
   * Retourner à la sélection de niveau
   */
  async returnToLevelSelection() {
    // Annule toute suite programmée (fin de niveau, question suivante)
    this.cleanup();
    // Réinitialiser complètement l'état du jeu pour éviter les conflits d'affichage
    this.resetState();
    this.phase = 'selection';
    this.currentLevel = null;
    // Recharger l'état des niveaux et recalculer les étoiles avant de régénérer l'UI
    try {
      this.loadAdventureProgress();
    } catch {
      /* ignore */
    }
    try {
      this.calculateTotalStars();
    } catch {
      /* ignore */
    }
    await this.initializeUI();

    // Retour en haut de l'écran, barre du haut comprise
    scrollToScreenTop(this.gameScreen);
  }

  /**
   * Options de génération spécifiques à l'Adventure
   */
  getQuestionOptions() {
    if (!this.currentLevel) return super.getQuestionOptions();

    // Pour la multiplication: utiliser table et multiplicande
    if (this.operator === '×') {
      // Choisir un multiplicande parmi ceux restants
      if (this.remainingOperands.length === 0) {
        this.remainingOperands = Array.from({ length: 10 }, (_, i) => i + 1);
      }

      const randomIndex = Math.floor(Math.random() * this.remainingOperands.length); // NOSONAR - Safe: educational game randomization
      const multiplicand = this.remainingOperands.splice(randomIndex, 1)[0];

      return {
        type: 'mcq',
        operator: this.operator,
        forceTable: this.currentLevel.table,
        forceNum: multiplicand,
      };
    }

    // Pour addition et soustraction: utiliser la difficulté du niveau
    return {
      type: 'mcq',
      operator: this.operator,
      difficulty: this.currentLevel.difficulty || 'easy',
    };
  }

  /**
   * Afficher la question avec inversion aléatoire
   */
  displayQuestion() {
    if (!this.state.currentQuestion || !this.questionElement) return;

    const question = this.state.currentQuestion;
    const operator = question.operator || this.operator;

    // Récupérer a et b avec fallback pour compatibilité multiplication
    const a = question.a ?? question.table;
    const b = question.b ?? question.num;

    // Pour la multiplication et l'addition: inversion aléatoire (commutativité)
    if (operator === '×' || operator === '+') {
      if (Math.random() < 0.5) {
        this.questionElement.textContent = `${b} ${operator} ${a} = ?`;
      } else {
        this.questionElement.textContent = `${a} ${operator} ${b} = ?`;
      }
    } else {
      // Pour la soustraction: pas d'inversion (non commutative)
      this.questionElement.textContent = `${a} ${operator} ${b} = ?`;
    }
    markQuestionKind(this.questionElement, question);

    this.displayOptions();

    // Réinitialiser le feedback
    if (this.feedbackElement) {
      this.feedbackElement.textContent = '';
    }
  }

  /**
   * La question affichée est lue à voix haute (sans la réponse)
   */
  onQuestionGenerated() {
    this.speakQuestion(this.questionElement?.textContent);
  }

  /**
   * Tuiles de réponse : nombres en police de titre, mots en police de lecture
   */
  displayOptions() {
    this.optionsElement?.classList.remove('is-answered');
    super.displayOptions();
    tagAnswerOptions(this.optionsElement);
  }

  /**
   * Traiter une réponse avec son et animation
   */
  handleAnswer(userAnswer) {
    if (!this.state.isActive || !this.state.currentQuestion || this._continuePending) return;

    // Son de tir
    playSound('shoot');

    // Traitement standard
    super.handleAnswer(userAnswer);
  }

  /**
   * Logique spécifique après soumission de réponse.
   * Après une erreur, « Continuer » (affiché par showAnswerFeedback) mène à la suite :
   * question suivante, fin du niveau ou écran « Pas cette fois » (voir finish()).
   */
  onAnswerSubmitted(isCorrect, userAnswer) {
    // Enregistrer l'essai dans l'historique quel que soit le résultat
    this.recordProgressHistory(isCorrect, userAnswer);

    if (!isCorrect) return;

    // Attribuer des pièces
    const userData = UserState.getCurrentUserData();
    userData.coins = (userData.coins || 0) + 1;
    UserState.updateUserData(userData);
    updateCoinDisplay();

    const coinIcon = document.querySelector('.coin-count');
    if (coinIcon) showCoinGainAnimation(coinIcon);

    // Une bonne réponse fait avancer le personnage d'un pas
    this.moveAdventureCharacter();

    // Mettre à jour le défi quotidien (seulement pour multiplication)
    if (this.operator === '×') {
      const { table, num } = this.state.currentQuestion;
      updateDailyChallengeProgress(table, num);
    }

    // Dernière question réussie : le trésor s'ouvre, pas de question suivante
    if (this.state.questionCount >= this.config.maxQuestions) {
      this._holdProgress = true;
      this.addTimer(() => this.completeLevel(), 800);
    }
  }

  /**
   * Feedback spécialisé pour l'Adventure
   * @param {boolean} isCorrect
   * @param {*} userAnswer - Réponse choisie (fournie par GameMode.handleAnswer)
   */
  showAnswerFeedback(isCorrect, userAnswer) {
    if (!this.feedbackElement) return;

    // La bonne tuile est cochée, le choix de l'enfant reste enfoncé
    markAnswerOptions(this.optionsElement, this.state.currentQuestion.answer, userAnswer);

    if (isCorrect) {
      this.sessionBestStreak = Math.max(this.sessionBestStreak, this.state.streak);
      // Un seul encouragement à voix haute (le retour écrit n'est pas relu)
      showFeedback(
        this.feedbackElement.id,
        getTranslation('adventure_feedback_correct'),
        'success',
        false
      );
      speak(getTranslation('correct'));
      return;
    }

    // Erreur : explication calme, lue à voix haute, qui attend « Continuer »
    const spoken = this.showErrorExplanation();
    if (spoken) speak(`${spoken.lead} ${spoken.message}`);
    this.showContinueButton();
  }

  /**
   * Fin du niveau (« Continuer » après la dernière erreur, ou vies épuisées).
   * L'Aventure a son propre écran de fin : jamais la slide des résultats, qui
   * afficherait la dernière partie d'un autre mode.
   */
  finish() {
    if (!this.currentLevel || this.phase !== 'playing') return;
    this.state.isActive = false;
    this.hideContinueButton();
    if (this.state.lives <= 0) {
      this.failLevel();
    } else {
      this.completeLevel();
    }
  }

  /**
   * Déplacer le personnage sur le chemin (transform : pas de propriété de mise en page).
   * Il avance d'un pas par bonne réponse et rejoint le trésor quand le niveau est réussi.
   * @param {boolean} [toTreasure=false]
   */
  moveAdventureCharacter(toTreasure = false) {
    const character = document.getElementById('adventure-character');
    const scene = document.querySelector('.adventure-scene');
    const treasure = document.getElementById('adventure-treasure');
    if (!character || !scene || !treasure) return;

    // Distance entre la position de départ du personnage et le trésor
    const charRect = character.getBoundingClientRect();
    const treasureRect = treasure.getBoundingClientRect();
    const currentOffset = Number(character.dataset.offset) || 0;
    const startLeft = charRect.left - currentOffset;
    const maxOffset = Math.max(0, Math.floor(treasureRect.left - startLeft - charRect.width * 0.5));

    const steps = this.config.maxQuestions;
    const done = toTreasure ? steps : Math.min(this.state.correctAnswers, steps);
    const offset = Math.round((done / steps) * maxOffset);

    character.dataset.offset = String(offset);
    character.style.transform = `translateX(${offset}px)`;
  }

  /**
   * Terminer le niveau avec succès
   */
  completeLevel() {
    if (!this.currentLevel || this.phase !== 'playing') return;
    this.phase = 'ending';
    this.state.isActive = false;

    // Le personnage rejoint le trésor, qui s'ouvre
    this.moveAdventureCharacter(true);
    const treasure = document.getElementById('adventure-treasure');
    if (treasure) {
      const img = treasure.querySelector('img');
      if (img) {
        img.src = 'assets/images/arcade/cadeau_ouvert.png';
      } else {
        treasure.textContent = '';
        const safeImg = createSafeImage('assets/images/arcade/cadeau_ouvert.png', '', {
          width: '72',
          height: '72',
        });
        treasure.appendChild(safeImg);
      }
    }

    this.addTimer(() => {
      // La partie a pu être quittée entre-temps
      if (!this.currentLevel) return;
      console.log(`🏆 Niveau ${this.currentLevel.id} terminé avec succès !`);

      // Calculer les étoiles (basé sur le score/performance)
      const stars = this.calculateStars();

      // Sauvegarder la progression, puis les badges qu'elle débloque
      this.saveAdventureProgress(stars);
      this.checkForNewRewards();

      // Afficher les résultats
      this.showLevelResults(true, stars);
    }, 1800);
  }

  /**
   * Échec du niveau (vies épuisées)
   */
  failLevel() {
    // La partie a pu être quittée entre-temps
    if (!this.currentLevel || this.phase !== 'playing') return;
    this.phase = 'ending';
    this.state.isActive = false;
    console.log(`Niveau ${this.currentLevel.id} non réussi (vies épuisées)`);

    // Afficher les résultats d'échec
    this.showLevelResults(false, 0);
  }

  /**
   * Calculer les étoiles selon la performance
   */
  calculateStars() {
    const successRate = this.state.correctAnswers / this.state.questionCount;

    if (successRate >= 0.9) return 3; // 90%+ = 3 étoiles
    if (successRate >= 0.7) return 2; // 70%+ = 2 étoiles
    if (successRate >= 0.5) return 1; // 50%+ = 1 étoile
    return 0; // Moins de 50% = 0 étoile
  }

  /**
   * Sauvegarder la progression du niveau
   */
  saveAdventureProgress(stars) {
    const userData = UserState.getCurrentUserData();

    // Séparer la progression par opération
    if (!userData.adventureProgressByOperator) {
      userData.adventureProgressByOperator = {};
    }
    if (!userData.adventureProgressByOperator[this.operator]) {
      userData.adventureProgressByOperator[this.operator] = {};
    }

    const operatorProgress = userData.adventureProgressByOperator[this.operator];

    // Sauvegarder ou mettre à jour le niveau
    const existingProgress = operatorProgress[this.currentLevel.id];
    const bestStars = existingProgress ? Math.max(existingProgress.stars, stars) : stars;

    operatorProgress[this.currentLevel.id] = {
      // Un niveau déjà terminé le reste
      completed: Boolean(existingProgress?.completed) || stars > 0,
      stars: bestStars,
      table: this.currentLevel.table, // Pour multiplication
      difficulty: this.currentLevel.difficulty, // Pour addition/soustraction
      lastPlayed: Date.now(),
      attempts: (existingProgress?.attempts || 0) + 1,
    };

    // Pour la multiplication: conserver l'ancien système starsByTable (compatibilité)
    if (this.operator === '×') {
      if (!userData.starsByTable) userData.starsByTable = {};
      const currentTableStars = Number(userData.starsByTable[this.currentLevel.table]) || 0;
      if (bestStars > currentTableStars) {
        userData.starsByTable[this.currentLevel.table] = bestStars;
      }
    }

    // Marquer le niveau comme complété dans la liste
    this.currentLevel.completed = operatorProgress[this.currentLevel.id].completed;

    // Sauvegarder
    UserState.updateUserData(userData);

    console.log(
      `💾 Progression sauvegardée: ${this.operator} Niveau ${this.currentLevel.id}, ${stars} étoiles`
    );
    // Mettre à jour le total d'étoiles après sauvegarde
    try {
      this.calculateTotalStars();
    } catch {
      /* ignore */
    }
  }

  /**
   * Afficher les résultats du niveau : le trésor et les étoiles en cas de réussite,
   * puis une phrase « 7 bonnes réponses sur 10 » et une ligne secondaire compacte.
   * Le focus va sur le titre ; l'écran suit un changement de langue.
   */
  showLevelResults(success, stars) {
    if (!this.gameScreen) return;
    this.phase = 'results';
    this.hideContinueButton();

    const result = {
      success,
      stars,
      levelId: this.currentLevel?.id,
      correct: this.state.correctAnswers,
      total: this.state.questionCount,
      score: this.state.score,
      bestStreak: this.sessionBestStreak,
      avatar: gameState?.avatar,
    };
    mountResults(this.gameScreen, () => this.renderLevelResults(result), { scrollTop: true });
  }

  /**
   * Écran de fin d'un niveau, construit à partir d'un instantané
   * @param {Object} result
   * @returns {HTMLElement}
   */
  renderLevelResults(result) {
    const { success, stars } = result;
    const wrapper = document.createElement('section');
    wrapper.className = 'content-card adventure-results game-results';
    wrapper.setAttribute('aria-labelledby', 'adventure-results-title');

    // Échec : le personnage de l'enfant reste présent, pour que l'écran ne sonne pas
    // comme une sanction (la réussite montre le trésor)
    if (!success) {
      const avatar = createAvatarPortrait(result.avatar);
      if (avatar) wrapper.appendChild(avatar);
    }

    const title = createSafeElement(
      'h2',
      getTranslation(success ? 'level_completed' : 'level_failed'),
      { id: 'adventure-results-title' }
    );
    wrapper.appendChild(title);

    wrapper.appendChild(
      createResultsSummary({
        lead: formatCorrectCount(result.correct, result.total),
        leadTag: 'p',
        message: getTranslation(success ? 'adventure_level_success' : 'adventure_level_failure'),
        details: [
          getTranslation('results_score', { score: result.score }),
          result.bestStreak > 0
            ? getTranslation('results_best_streak', { streak: result.bestStreak })
            : '',
        ],
      })
    );

    if (success) {
      // Les étoiles suivent la phrase qui les explique ; le trésor précède son message
      const messageEl = wrapper.querySelector('.results-message');
      wrapper.insertBefore(createStarRating(stars), messageEl);
      wrapper.insertBefore(
        createSafeImage('assets/images/arcade/cadeau_ouvert.png', '', {
          width: '112',
          height: '112',
          class: 'results-treasure',
        }),
        messageEl
      );
    }

    wrapper.appendChild(createResultsActions(this.getResultsButtons(success, result.levelId)));
    return wrapper;
  }

  /**
   * Boutons de fin de niveau : une action principale, les autres secondaires.
   * @param {boolean} success
   * @param {number} [levelId] - Niveau joué (par défaut, le niveau en cours)
   * @returns {Array<Object>}
   */
  getResultsButtons(success, levelId = this.currentLevel?.id) {
    const backToLevels = {
      label: getTranslation('back_to_levels'),
      action: 'adventure-back-to-levels',
      onActivate: () => this.returnToLevelSelection(),
    };

    if (!success) {
      return [
        {
          label: getTranslation('try_again'),
          action: 'adventure-start-level',
          level: levelId,
          primary: true,
          onActivate: () => this.startLevel(levelId),
        },
        backToLevels,
      ];
    }

    const nextLevel = this.adventureLevels.find(level => level.id === levelId + 1);
    const canPlayNext = nextLevel && !this.getLockReason(nextLevel);
    if (!canPlayNext) {
      return [{ ...backToLevels, primary: true }];
    }

    return [
      {
        label: getTranslation('next_level'),
        action: 'adventure-start-level',
        level: nextLevel.id,
        primary: true,
        onActivate: () => this.startLevel(nextLevel.id),
      },
      backToLevels,
    ];
  }

  /**
   * Obtenir le bouton du niveau suivant
   */
  getNextLevelButton() {
    const nextLevel = this.adventureLevels.find(level => level.id === this.currentLevel.id + 1);
    if (!nextLevel) return '';

    const canPlay = this.totalStars >= nextLevel.requiredStars;
    if (!canPlay) return '';

    return `
            <button type="button" class="btn" data-action="adventure-start-level" data-level="${nextLevel.id}">
                ${getTranslation('next_level')}
            </button>
        `;
  }

  /**
   * Enregistrer dans l'historique de progression
   */
  recordProgressHistory(isCorrect, userAnswer) {
    const userData = UserState.getCurrentUserData();
    if (!userData.progressHistory) userData.progressHistory = [];

    const question = this.state.currentQuestion;
    const a = question.a ?? question.table;
    const b = question.b ?? question.num;
    const operator = question.operator || this.operator;

    userData.progressHistory.push({
      question: `${a} ${operator} ${b} = ?`,
      correct: isCorrect,
      timestamp: Date.now(),
      mode: 'adventure',
      operator: operator,
      level: this.currentLevel.id,
      userAnswer: userAnswer,
      correctAnswer: question.answer,
    });

    // Sauvegarder immédiatement
    UserState.updateUserData(userData);
  }

  /**
   * Progression de l'opération courante (par identifiant de niveau)
   * @returns {Object}
   */
  getOperatorProgress() {
    const userData = UserState.getCurrentUserData();
    return (
      userData.adventureProgressByOperator?.[this.operator] || userData.adventureProgress || {}
    );
  }

  /**
   * Charger la progression Adventure
   */
  loadAdventureProgress() {
    // Charger la progression selon l'opération actuelle
    const operatorProgress = this.getOperatorProgress();

    // Mettre à jour l'état des niveaux
    this.adventureLevels.forEach(level => {
      level.completed = operatorProgress[level.id]?.completed || false;
    });
  }

  /**
   * Calculer le total d'étoiles
   */
  calculateTotalStars() {
    this.totalStars = 0;

    // Calculer les étoiles pour l'opération actuelle
    const operatorProgress = this.getOperatorProgress();

    if (operatorProgress) {
      Object.values(operatorProgress).forEach(progress => {
        this.totalStars += progress.stars || 0;
      });
    }

    return this.totalStars;
  }

  /**
   * Pourquoi un niveau est verrouillé : le niveau précédent n'est pas terminé
   * (« previous », la raison à régler d'abord) ou il manque des étoiles (« stars »).
   * @param {Object} level
   * @returns {'previous'|'stars'|null}
   */
  getLockReason(level) {
    if (level.id > 1) {
      const prevLevel = this.adventureLevels.find(l => l.id === level.id - 1);
      if (!prevLevel || !prevLevel.completed) return 'previous';
    }
    if (this.totalStars < level.requiredStars) return 'stars';
    return null;
  }

  /**
   * Un niveau est verrouillé tant que les étoiles requises ou le niveau précédent manquent
   * @param {Object} level
   * @returns {boolean}
   */
  isLevelLocked(level) {
    return this.getLockReason(level) !== null;
  }

  /**
   * Message d'un niveau verrouillé : ce qu'il faut faire pour l'ouvrir
   * @param {Object} level
   * @param {'previous'|'stars'} reason
   * @returns {string}
   */
  getLockMessage(level, reason) {
    if (reason === 'previous' && hasTranslation('level_locked_previous')) {
      return getTranslation('level_locked_previous', { level: level.id - 1 });
    }
    return getTranslation('level_locked_message', { requiredStars: level.requiredStars });
  }

  /**
   * Sous-titre d'un niveau : « Table 7 » ou la difficulté (« Facile »)
   * @param {Object} level
   * @returns {string}
   */
  getLevelSubtitle(level) {
    if (this.operator === '×' && level.table) {
      return `${getTranslation('table_label')} ${level.table}`;
    }
    if (level.difficulty) {
      return getTranslation(`difficulty_${level.difficulty}`);
    }
    return '';
  }

  /**
   * Zone d'état d'une tuile : cadenas (et étoiles requises s'il en manque), ou étoiles
   * gagnées. Le sens est donné en texte aux lecteurs d'écran.
   * @param {Object} level
   * @param {'previous'|'stars'|null} lockReason
   * @param {number} earnedStars
   * @returns {HTMLElement|null}
   */
  createLevelStatus(level, lockReason, earnedStars) {
    const status = createSafeElement('span', '', { class: 'level-status' });

    if (lockReason) {
      const visual = createSafeElement('span', '', {
        class: 'reward-stars reward-stars--inline',
        'aria-hidden': 'true',
      });
      visual.appendChild(createLockIcon());
      // Le nombre d'étoiles n'apparaît que s'il est ce qui manque (ou si le message
      // « termine d'abord le niveau N » n'est pas encore traduit : le visuel suit le texte)
      if (lockReason === 'stars' || !hasTranslation('level_locked_previous')) {
        visual.appendChild(createSafeElement('span', String(level.requiredStars)));
        visual.appendChild(createStarIcon(true));
      }
      status.appendChild(visual);
      status.appendChild(
        createSafeElement('span', this.getLockMessage(level, lockReason), { class: 'sr-only' })
      );
      return status;
    }

    if (!level.completed) return null;

    const stars = createSafeElement('span', '', {
      class: 'reward-stars reward-stars--inline',
      'aria-hidden': 'true',
    });
    for (let i = 0; i < 3; i++) {
      stars.appendChild(createStarIcon(i < earnedStars));
    }
    status.appendChild(stars);
    status.appendChild(
      createSafeElement('span', formatStarsLabel(earnedStars), { class: 'sr-only' })
    );
    return status;
  }

  /**
   * Tuiles de niveaux (boutons) : numéro, nom, sous-titre, état.
   * Le prochain niveau à jouer est mis en avant ; un niveau verrouillé reste
   * activable (il explique ce qu'il manque) mais signale aria-disabled.
   * @returns {DocumentFragment}
   */
  createLevelTiles() {
    const frag = document.createDocumentFragment();
    const progress = this.getOperatorProgress();
    let nextFound = false;

    for (const level of this.adventureLevels) {
      const lockReason = this.getLockReason(level);
      const earnedStars = Number(progress[level.id]?.stars) || 0;

      let stateClass = 'is-completed';
      if (lockReason) {
        stateClass = 'is-locked';
      } else if (!level.completed && !nextFound) {
        stateClass = 'is-available';
        nextFound = true;
      } else if (!level.completed) {
        stateClass = 'is-open';
      }

      const tile = createSafeElement('button', '', {
        type: 'button',
        class: `level-card ${stateClass}`,
        'data-level': String(level.id),
      });
      if (lockReason) tile.setAttribute('aria-disabled', 'true');

      tile.appendChild(
        createSafeElement('span', String(level.id), {
          class: 'level-number',
          'aria-hidden': 'true',
        })
      );

      const info = createSafeElement('span', '', { class: 'level-info' });
      info.appendChild(
        createSafeElement('span', getTranslation(level.nameKey), { class: 'level-name' })
      );
      const subtitle = this.getLevelSubtitle(level);
      if (subtitle) {
        info.appendChild(createSafeElement('span', subtitle, { class: 'level-table' }));
      }
      tile.appendChild(info);

      const status = this.createLevelStatus(level, lockReason, earnedStars);
      if (status) tile.appendChild(status);

      frag.appendChild(tile);
    }

    return frag;
  }

  /**
   * Mettre à jour l'avatar d'aventure
   */
  updateAdventureAvatar() {
    const avatarEl = document.getElementById('adventure-avatar');
    if (avatarEl && gameState?.avatar) {
      avatarEl.textContent = '';
      const img = createSafeImage(
        `assets/images/arcade/${gameState.avatar}_head_avatar_128x128.png`,
        getTranslation(gameState.avatar),
        { width: '88', height: '88' }
      );
      avatarEl.appendChild(img);
    }
  }

  /**
   * Obtenir l'avatar du joueur
   */
  getPlayerAvatar() {
    const avatar = gameState?.avatar || 'fox';
    return `<img src="assets/images/arcade/${avatar}_right_128x128.png" width="72" height="72" alt="${getTranslation(avatar)}" />`;
  }

  /**
   * Progression de toutes les opérations (liste des niveaux joués)
   * @returns {Array<Object>}
   */
  getAllLevelProgress() {
    const userData = UserState.getCurrentUserData();
    const byOperator = userData.adventureProgressByOperator || {};
    const sources = Object.values(byOperator);
    // Ancien format (multiplication seule), s'il n'a pas encore été migré
    if (!byOperator['×'] && userData.adventureProgress) sources.push(userData.adventureProgress);
    return sources.flatMap(progress => Object.values(progress || {}));
  }

  /**
   * Badges de l'Aventure (js/badges.js) : « Premiers pas » au premier niveau
   * terminé, « Collectionneur d'étoiles » à 10 étoiles au total.
   */
  checkForNewRewards() {
    const levels = this.getAllLevelProgress();
    if (levels.some(level => level?.completed)) {
      checkAndUnlockBadge('adventurer');
    }
    const allStars = levels.reduce((sum, level) => sum + (Number(level?.stars) || 0), 0);
    if (allStars >= STAR_COLLECTOR_THRESHOLD) {
      checkAndUnlockBadge('star_collector');
    }
  }

  /**
   * Données spéciales pour la barre d'information
   */
  getInfoBarData() {
    const data = super.getInfoBarData();

    // Progression du niveau : « 3/10 »
    if (this.phase !== 'selection') {
      data.progress = `${this.state.questionCount}/${this.config.maxQuestions}`;
    }

    return data;
  }

  /**
   * Vérification personnalisée pour continuer
   */
  shouldContinue() {
    // Vies épuisées
    if (this.state.lives <= 0) {
      return false;
    }

    // Questions terminées
    if (this.state.questionCount >= this.config.maxQuestions) {
      return false;
    }

    return this.state.isActive;
  }

  /**
   * Changement de langue : la carte des niveaux est reconstruite ; en partie, le
   * socle commun retraduit l'explication et les réponses. L'écran de fin se
   * retraduit seul (mountResults).
   */
  refreshTexts() {
    if (this.phase === 'selection') {
      if (document.getElementById('adventure-levels')) this.renderLevelTiles();
      return;
    }
    if (this.phase === 'playing') super.refreshTexts();
  }

  /**
   * Nettoyage spécifique à l'Adventure
   */
  cleanup() {
    super.cleanup();
    this.currentLevel = null;
    this.remainingOperands = [];
  }
}

// Export ES6 pur
export default AdventureMode;
// Start/stop wrappers to manage a single instance (for orchestrator/slide stops)
let _adventureModeInstance = null;
export function startAdventureMode() {
  if (_adventureModeInstance) _adventureModeInstance.stop();
  _adventureModeInstance = new AdventureMode();
  _adventureModeInstance.start();
}
export function stopAdventureMode() {
  if (_adventureModeInstance) {
    _adventureModeInstance.stop();
    _adventureModeInstance = null;
  }
}
export function refreshAdventureTexts() {
  _adventureModeInstance?.refreshTexts?.();
}
