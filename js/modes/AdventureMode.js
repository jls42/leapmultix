/**
 * Mode Aventure refactorisé avec héritage de GameMode
 * Phase 5.3 - Refactorisation du mode Adventure
 *
 * Fonctionnalités spécifiques:
 * - Progression narrative par niveaux
 * - Système d'étoiles et déblocage séquentiel
 * - Avatar et personnage animé
 * - Sélection de niveau puis jeu
 */

import { GameMode } from '../core/GameMode.js';
import { ADVENTURE_LEVELS } from '../core/adventure-data.js';
import { createSafeImage, createSafeElement } from '../security-utils.js';
import {
  getTranslation,
  numberToWords,
  showCoinGainAnimation,
  showMessage,
  playSound,
  showFeedback,
  speak,
  updateCoinDisplay,
} from '../utils-es6.js';
import { generateQuestion } from '../questionGenerator.js';
import { UserState } from '../core/userState.js';
import { checkAndUnlockBadge } from '../badges.js';
import { updateDailyChallengeProgress } from '../game.js';
import { generateMCQOptions } from '../uiUtils.js';
import { gameState } from '../game.js';

export class AdventureMode extends GameMode {
  constructor() {
    super('adventure', {
      maxQuestions: 10, // 10 questions par niveau
      hasTimer: false,
      hasLives: true,
      hasStreaks: true,
      autoProgress: true,
      showScore: true,
      initialLives: 3,
    });

    // Définition des niveaux d'aventure
    this.adventureLevels = ADVENTURE_LEVELS.map(level => ({ ...level, completed: false }));

    // État spécifique à l'Adventure
    this.currentLevel = null;
    this.totalStars = 0;
    this.remainingMultiplicands = [];
    this.phase = 'selection'; // selection, playing
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
      return `
                <div class="adventure-container">
                    <div class="adventure-header">
                        <div class="adventure-avatar" id="adventure-avatar"></div>
                        <div class="adventure-info">
                            <div class="adventure-name" id="adventure-name"></div>
                            <div class="adventure-stars">
                                <span data-translate="total_stars_adventure_label">${getTranslation('total_stars_adventure_label')}</span> 
                                <span id="total-stars-display">${this.totalStars}</span>
                            </div>
                        </div>
                    </div>
                    <h2 data-translate="adventure_title">${getTranslation('adventure_title')}</h2>
                    <p class="adventure-story-intro" data-translate="adventure_story_intro">
                        ${getTranslation('adventure_story_intro')}
                    </p>
                    <h3 data-translate="adventure_choose_destination">${getTranslation('adventure_choose_destination')}</h3>
                    <div class="adventure-levels">
                        ${this.generateLevelsHTML()}
                    </div>
                </div>
            `;
    } else {
      // Phase de jeu
      return `
                <div class="adventure-level-header" role="region" aria-label="${getTranslation(this.currentLevel.nameKey)}">
                    <h2>${getTranslation(this.currentLevel.nameKey)}</h2>
                </div>
                
                <div class="adventure-scene" role="region" aria-label="${getTranslation('adventure_scene_label')}">
                    <div class="adventure-character" id="adventure-character">${this.getPlayerAvatar()}</div>
                    <div class="adventure-path" id="adventure-path"></div>
                    <div class="adventure-treasure" id="adventure-treasure">
                        <img src="assets/images/arcade/cadeau_ferme.png" alt="cadeau fermé">
                    </div>
                </div>
                
                <div class="adventure-controls" role="region" aria-label="${getTranslation('adventure_controls_label')}">
                    <button id="adventure-abandon" class="btn" data-translate="abandon_adventure_button" aria-label="${getTranslation('abandon_adventure_button')}">
                        ${getTranslation('abandon_adventure_button')}
                    </button>
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
      this.setupGameControls();
    }
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

    // Ajouter les écouteurs pour les niveaux
    document.querySelectorAll('.level-card').forEach(card => {
      card.addEventListener('click', () => {
        const levelId = parseInt(card.dataset.level);
        const levelData = this.adventureLevels.find(level => level.id === levelId);

        if (card.classList.contains('locked')) {
          showMessage(
            getTranslation('level_locked_message', { requiredStars: levelData.requiredStars })
          );
        } else {
          this.startLevel(levelId);
        }
      });
    });

    // Vérifier les nouvelles récompenses
    this.checkForNewRewards();
  }

  /**
   * Configurer les contrôles de jeu
   */
  setupGameControls() {
    const abandonBtn = document.getElementById('adventure-abandon');
    if (abandonBtn) {
      abandonBtn.onclick = () => this.confirmAbandon();
    }
  }

  /**
   * Démarrer un niveau spécifique
   */
  async startLevel(levelId) {
    this.currentLevel = this.adventureLevels.find(level => level.id === levelId);
    if (!this.currentLevel) return;

    console.log(`🏰 Démarrage niveau Adventure ${levelId} (table ${this.currentLevel.table})`);

    // Réinitialiser l'état pour le niveau
    this.resetState();
    this.state.lives = this.config.initialLives;
    this.remainingMultiplicands = Array.from({ length: 10 }, (_, i) => i + 1);

    // Passer en phase de jeu
    this.phase = 'playing';

    // Réinitialiser complètement l'UI pour la phase de jeu
    await this.initializeUI();

    // Revenir en haut pour éviter d'avoir à scroller après un enchaînement
    this.gameScreen?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    (typeof globalThis !== 'undefined'
      ? globalThis
      : typeof window !== 'undefined'
        ? window
        : undefined
    )?.scrollTo?.({ top: 0, behavior: 'smooth' });

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

    // Assurer le retour en haut de la page après "Retour aux niveaux"
    this.gameScreen?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    (typeof globalThis !== 'undefined'
      ? globalThis
      : typeof window !== 'undefined'
        ? window
        : undefined
    )?.scrollTo?.({ top: 0, behavior: 'smooth' });
  }

  /**
   * Options de génération spécifiques à l'Adventure
   */
  getQuestionOptions() {
    if (!this.currentLevel) return super.getQuestionOptions();

    // Choisir un multiplicande parmi ceux restants
    if (this.remainingMultiplicands.length === 0) {
      this.remainingMultiplicands = Array.from({ length: 10 }, (_, i) => i + 1);
    }

    const randomIndex = Math.floor(Math.random() * this.remainingMultiplicands.length);
    const multiplicand = this.remainingMultiplicands.splice(randomIndex, 1)[0];

    return {
      type: 'mcq',
      forceTable: this.currentLevel.table,
      forceNum: multiplicand,
    };
  }

  /**
   * Génération des options spécifique à l'Adventure
   */
  generateOptions() {
    const correctAnswer = this.state.currentQuestion.answer;

    // Gestion spéciale pour les questions vrai/faux
    if (this.state.currentQuestion.type === 'true_false') {
      return [
        { value: true, display: getTranslation('true') },
        { value: false, display: getTranslation('false') },
      ];
    }

    // QCM avec réponses plausibles
    const options = generateMCQOptions(
      correctAnswer,
      () =>
        generateQuestion({
          type: 'mcq',
          minTable: 1,
          maxTable: 10,
          minNum: 1,
          maxNum: 10,
        }).answer
    );

    return options.map(value => ({
      value: value,
      display: Math.random() < 0.2 ? numberToWords(value) : value.toString(),
    }));
  }

  /**
   * Afficher la question avec inversion aléatoire
   */
  displayQuestion() {
    if (!this.state.currentQuestion || !this.questionElement) return;

    const { table, num } = this.state.currentQuestion;

    // Inversion aléatoire pour commutativité
    if (Math.random() < 0.5) {
      this.questionElement.textContent = `${num} × ${table} = ?`;
    } else {
      this.questionElement.textContent = `${table} × ${num} = ?`;
    }

    this.displayOptions();

    // Réinitialiser le feedback
    if (this.feedbackElement) {
      this.feedbackElement.textContent = '';
    }
  }

  /**
   * Traiter une réponse avec son et animation
   */
  handleAnswer(userAnswer) {
    if (!this.state.isActive || !this.state.currentQuestion) return;

    // Son de tir
    playSound('shoot');

    // Traitement standard
    super.handleAnswer(userAnswer);
  }

  /**
   * Logique spécifique après soumission de réponse
   */
  onAnswerSubmitted(isCorrect, userAnswer) {
    // Enregistrer l'essai dans l'historique quel que soit le résultat
    this.recordProgressHistory(isCorrect, userAnswer);

    if (isCorrect) {
      // Attribuer des pièces
      const userData = UserState.getCurrentUserData();
      userData.coins = (userData.coins || 0) + 1;
      updateCoinDisplay();

      const coinIcon = document.querySelector('.coin-count');
      if (coinIcon) showCoinGainAnimation(coinIcon);

      // Déplacer le personnage
      this.moveAdventureCharacter();

      // Mettre à jour le défi quotidien
      const { table, num } = this.state.currentQuestion;
      updateDailyChallengeProgress(table, num);

      // Vérifier si le niveau est terminé
      if (this.state.questionCount >= this.config.maxQuestions) {
        // Empêcher la planification automatique d'une prochaine question
        this._autoWas = this.config.autoProgress;
        this.config.autoProgress = false;
        setTimeout(() => this.completeLevel(), 800);
        return;
      }
    } else if (this.state.lives <= 0) {
      // Réponse incorrecte - les vies sont déjà décrémentées par GameMode.updateStats()
      // Empêcher la planification automatique d'une prochaine question
      this._autoWas = this.config.autoProgress;
      this.config.autoProgress = false;
      setTimeout(() => this.failLevel(), 600);
      return;
    }
  }

  /**
   * Feedback spécialisé pour l'Adventure
   */
  showAnswerFeedback(isCorrect) {
    if (!this.feedbackElement) return;

    if (isCorrect) {
      showFeedback(
        this.feedbackElement.id,
        getTranslation('adventure_feedback_correct'),
        'success',
        true
      );
      speak(getTranslation('correct'));
    } else {
      const correctAnswer = this.state.currentQuestion.answer;
      let message;
      if (this.state.currentQuestion.type === 'true_false') {
        message =
          correctAnswer === true
            ? getTranslation('incorrect_answer_was_true')
            : getTranslation('incorrect_answer_was_false');
      } else {
        message = getTranslation('adventure_feedback_incorrect', { correctAnswer });
      }
      showFeedback(this.feedbackElement.id, message, 'error', true);
    }
  }

  /**
   * Déplacer le personnage sur le chemin
   */
  moveAdventureCharacter() {
    const character = document.getElementById('adventure-character');
    const scene = document.querySelector('.adventure-scene');
    const treasure = document.getElementById('adventure-treasure');
    if (!character || !scene || !treasure) return;

    // Mesures en pixels pour adapter à l'écran/canvas
    const sceneRect = scene.getBoundingClientRect();
    const charRect = character.getBoundingClientRect();
    const treasureRect = treasure.getBoundingClientRect();

    // Position maximale cible: juste avant le trésor
    const maxLeftPx = Math.max(
      0,
      Math.floor(treasureRect.left - sceneRect.left - charRect.width * 0.5)
    );

    // Avancée proportionnelle: rejoindre le cadeau uniquement à la DERNIÈRE question
    const steps = this.config.maxQuestions;
    const clampedCount = Math.min(this.state.questionCount, steps);
    const ratio = clampedCount / steps;
    const leftPx = Math.round(ratio * maxLeftPx);

    character.style.left = `${leftPx}px`;
  }

  /**
   * Terminer le niveau avec succès
   */
  completeLevel() {
    const treasure = document.getElementById('adventure-treasure');
    if (treasure) {
      const img = treasure.querySelector('img');
      if (img) {
        img.src = 'assets/images/arcade/cadeau_ouvert.png';
        img.alt = 'cadeau ouvert';
      } else {
        treasure.textContent = '';
        const safeImg = createSafeImage('assets/images/arcade/cadeau_ouvert.png', 'cadeau ouvert');
        treasure.appendChild(safeImg);
      }
    }

    setTimeout(() => {
      console.log(`🏆 Niveau ${this.currentLevel.id} terminé avec succès !`);

      // Calculer les étoiles (basé sur le score/performance)
      const stars = this.calculateStars();

      // Sauvegarder la progression
      this.saveAdventureProgress(stars);

      // Afficher les résultats
      this.showLevelResults(true, stars);
    }, 1800);
  }

  /**
   * Échec du niveau (vies épuisées)
   */
  failLevel() {
    console.log(`💀 Niveau ${this.currentLevel.id} échoué (vies épuisées)`);

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

    if (!userData.adventureProgress) {
      userData.adventureProgress = {};
    }

    // Sauvegarder ou mettre à jour le niveau
    const existingProgress = userData.adventureProgress[this.currentLevel.id];
    const bestStars = existingProgress ? Math.max(existingProgress.stars, stars) : stars;

    userData.adventureProgress[this.currentLevel.id] = {
      completed: stars > 0,
      stars: bestStars,
      table: this.currentLevel.table,
      lastPlayed: Date.now(),
      attempts: (existingProgress?.attempts || 0) + 1,
    };

    if (!userData.starsByTable) userData.starsByTable = {};
    const currentTableStars = Number(userData.starsByTable[this.currentLevel.table]) || 0;
    if (bestStars > currentTableStars) {
      userData.starsByTable[this.currentLevel.table] = bestStars;
    }

    // Marquer le niveau comme complété dans la liste
    this.currentLevel.completed = stars > 0;

    // Sauvegarder
    UserState.updateUserData(userData);

    console.log(`💾 Progression sauvegardée: Niveau ${this.currentLevel.id}, ${stars} étoiles`);
    // Mettre à jour le total d'étoiles après sauvegarde
    try {
      this.calculateTotalStars();
    } catch {
      /* ignore */
    }
  }

  /**
   * Afficher les résultats du niveau
   */
  showLevelResults(success, stars) {
    if (this.gameScreen) {
      this.gameScreen.textContent = '';
      const wrapper = document.createElement('div');
      wrapper.className = 'content-card adventure-results';

      if (success) {
        const ok = document.createElement('div');
        ok.className = 'adventure-success';
        ok.appendChild(createSafeElement('h2', `🏆 ${getTranslation('level_completed')}`));
        const starsDiv = createSafeElement('div', `${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}`, {
          class: 'stars-earned',
        });
        ok.appendChild(starsDiv);
        const msg = getTranslation('adventure_level_success', {
          score: this.state.score,
          correct: this.state.correctAnswers,
          total: this.state.questionCount,
        });
        ok.appendChild(createSafeElement('p', msg));
        const btns = document.createElement('div');
        btns.className = 'adventure-results-buttons';
        const back = createSafeElement('button', getTranslation('back_to_levels'), {
          class: 'btn btn-primary',
          'data-action': 'adventure-back-to-levels',
        });
        btns.appendChild(back);
        // Next level button if available
        const nextLevel = this.adventureLevels.find(level => level.id === this.currentLevel.id + 1);
        const canPlay = nextLevel && this.totalStars >= nextLevel.requiredStars;
        if (canPlay) {
          const next = createSafeElement('button', getTranslation('next_level'), {
            class: 'btn btn-success',
            'data-action': 'adventure-start-level',
          });
          next.setAttribute('data-level', String(nextLevel.id));
          btns.appendChild(next);
        }
        ok.appendChild(btns);
        wrapper.appendChild(ok);
      } else {
        const fail = document.createElement('div');
        fail.className = 'adventure-failure';
        fail.appendChild(createSafeElement('h2', `💀 ${getTranslation('level_failed')}`));
        fail.appendChild(createSafeElement('p', getTranslation('adventure_level_failure')));
        const btns = document.createElement('div');
        btns.className = 'adventure-results-buttons';
        const retry = createSafeElement('button', getTranslation('try_again'), {
          class: 'btn btn-primary',
          'data-action': 'adventure-start-level',
        });
        retry.setAttribute('data-level', String(this.currentLevel.id));
        const back = createSafeElement('button', getTranslation('back_to_levels'), {
          class: 'btn btn-secondary',
          'data-action': 'adventure-back-to-levels',
        });
        btns.appendChild(retry);
        btns.appendChild(back);
        fail.appendChild(btns);
        wrapper.appendChild(fail);
      }

      this.gameScreen.appendChild(wrapper);
      // Wire results buttons
      const backBtns = this.gameScreen.querySelectorAll('[data-action="adventure-back-to-levels"]');
      backBtns.forEach(btn =>
        btn.addEventListener('click', e => {
          e.preventDefault();
          this.returnToLevelSelection();
        })
      );
      const startBtns = this.gameScreen.querySelectorAll('[data-action="adventure-start-level"]');
      startBtns.forEach(btn =>
        btn.addEventListener('click', e => {
          e.preventDefault();
          const lvl = parseInt(btn.getAttribute('data-level') || '0', 10);
          if (!Number.isNaN(lvl)) this.startLevel(lvl);
        })
      );

      // Fallback de sécurité: si aucun bouton n'est présent, injecter un bouton retour
      const anyBtn = this.gameScreen.querySelector('.adventure-results-buttons button');
      if (!anyBtn) {
        const fb = document.createElement('div');
        fb.className = 'adventure-results-buttons';
        const btn = createSafeElement('button', getTranslation('back_to_levels'), {
          class: 'btn btn-primary',
          'data-action': 'adventure-back-to-levels',
        });
        btn.addEventListener('click', e => {
          e.preventDefault();
          this.returnToLevelSelection();
        });
        fb.appendChild(btn);
        this.gameScreen.firstElementChild?.appendChild(fb);
      }

      this.gameScreen.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Restaurer l'auto-advance par défaut pour le prochain démarrage
      if (typeof this._autoWas === 'boolean') {
        this.config.autoProgress = this._autoWas;
        delete this._autoWas;
      } else {
        this.config.autoProgress = true;
      }
    }
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
            <button class="btn btn-success" data-action="adventure-start-level" data-level="${nextLevel.id}">
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

    const { table, num } = this.state.currentQuestion;
    userData.progressHistory.push({
      question: `${table} × ${num} = ?`,
      correct: isCorrect,
      timestamp: Date.now(),
      mode: 'adventure',
      level: this.currentLevel.id,
      userAnswer: userAnswer,
      correctAnswer: this.state.currentQuestion.answer,
    });

    // Sauvegarder immédiatement
    UserState.updateUserData(userData);
  }

  /**
   * Charger la progression Adventure
   */
  loadAdventureProgress() {
    const userData = UserState.getCurrentUserData();

    // Mettre à jour l'état des niveaux
    this.adventureLevels.forEach(level => {
      level.completed = userData.adventureProgress?.[level.id]?.completed || false;
    });
  }

  /**
   * Calculer le total d'étoiles
   */
  calculateTotalStars() {
    const userData = UserState.getCurrentUserData();
    this.totalStars = 0;

    if (userData.adventureProgress) {
      Object.values(userData.adventureProgress).forEach(progress => {
        this.totalStars += progress.stars || 0;
      });
    }

    return this.totalStars;
  }

  /**
   * Générer le HTML des niveaux
   */
  generateLevelsHTML() {
    return this.adventureLevels
      .map(level => {
        // Vérifier le déblocage séquentiel ET les étoiles
        const prevLevel = this.adventureLevels.find(l => l.id === level.id - 1);
        const isLocked =
          this.totalStars < level.requiredStars ||
          (level.id > 1 && (!prevLevel || !prevLevel.completed));

        let statusClass = '';
        let statusIcon = '';

        if (isLocked) {
          statusClass = 'locked';
          statusIcon = '🔒';
        } else if (level.completed) {
          statusClass = 'completed';
          statusIcon = '⭐';
        } else {
          statusClass = 'available';
          statusIcon = '🎯';
        }

        return `
                <div class="level-card ${statusClass}" data-level="${level.id}">
                    <div class="level-icon">${statusIcon}</div>
                    <div class="level-info">
                        <h4>${getTranslation(level.nameKey)}</h4>
                        <p class="level-table">${getTranslation('table_label')} ${level.table}</p>
                        ${isLocked ? `<p class="level-requirement">${level.requiredStars} ⭐</p>` : ''}
                    </div>
                </div>
            `;
      })
      .join('');
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
        { width: '100', height: '100' }
      );
      avatarEl.appendChild(img);
    }
  }

  /**
   * Obtenir l'avatar du joueur
   */
  getPlayerAvatar() {
    const avatar = gameState?.avatar || 'fox';
          return `<img src="assets/images/arcade/${avatar}_right_128x128.png" width="40" height="40" alt="${getTranslation(avatar)}" />`;  }

  /**
   * Vérifier les nouvelles récompenses
   */
  checkForNewRewards() {
    // Logique de vérification des badges basée sur les étoiles
    if (this.totalStars >= 5) {
      checkAndUnlockBadge('adventure_starter');
    }
    if (this.totalStars >= 15) {
      checkAndUnlockBadge('adventure_master');
    }
  }

  /**
   * Données spéciales pour la barre d'information
   */
  getInfoBarData() {
    const data = super.getInfoBarData();

    // Ajouter le progrès du niveau
    if (this.phase === 'playing') {
      data.progress = this.state.questionCount;
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
   * Nettoyage spécifique à l'Adventure
   */
  cleanup() {
    super.cleanup();
    this.currentLevel = null;
    this.remainingMultiplicands = [];
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
