/**
 * Mode Défi refactorisé avec héritage de GameMode
 * Phase 5.3 - Refactorisation du mode Challenge
 */

import { GameMode } from '../core/GameMode.js';
import {
  getTranslation,
  numberToWords,
  showCoinGainAnimation,
  updateCoinDisplay,
  playSound,
  showFeedback,
  speak,
} from '../utils-es6.js';
import { setSafeFeedback, createSafeElement } from '../security-utils.js';
import { goToSlide } from '../slides.js';
import { generateMCQOptions } from '../uiUtils.js';
import { UserState } from '../core/userState.js';
import { checkAndUnlockBadge } from '../badges.js';
import { updateDailyChallengeProgress } from '../game.js';
import { TablePreferences } from '../core/tablePreferences.js';
import { UserManager } from '../userManager.js';
import { getOperation } from '../core/operations/OperationRegistry.js';
import { recordOperationResult } from '../core/operation-stats.js';

export class ChallengeMode extends GameMode {
  /**
   * Fonction constructor
   */
  constructor() {
    super('challenge', {
      maxQuestions: 42, // Limite élevée (temps principal limitant)
      hasTimer: true,
      hasLives: false,
      hasStreaks: true,
      autoProgress: true,
      showScore: true,
      initialTime: 60, // Temps par défaut (modifié selon difficulté)
    });

    // État spécifique au Challenge
    this.difficulty = 'medium';
    this.bonusTimeEarned = 0;
    this.difficultyTimes = {
      easy: 90,
      medium: 60,
      hard: 30,
    };

    // Timer spécifique
    this.timerInterval = null;

    // Phases du challenge
    this.phase = 'selection'; // selection, playing, results
  }

  /**
   * HTML personnalisé pour le Challenge (sélection de difficulté)
   */
  async getCustomHTML() {
    if (this.phase === 'selection') {
      return `
                <div class="challenge-difficulty-selection">
                    <p data-translate="challenge_intro">${getTranslation('challenge_intro')}</p>
                    
                    <div class="difficulty-selector" role="region" aria-label="${getTranslation('choose_difficulty')}">
                        <h3 data-translate="choose_difficulty">${getTranslation('choose_difficulty')}</h3>
                        <button class="btn btn-primary difficulty-btn" data-difficulty="easy">
                            ${getTranslation('challenge_easy')}
                        </button>
                        <button class="btn btn-primary difficulty-btn" data-difficulty="medium">
                            ${getTranslation('challenge_medium')}
                        </button>
                        <button class="btn btn-primary difficulty-btn" data-difficulty="hard">
                            ${getTranslation('challenge_hard')}
                        </button>
                    </div>
                    
                    <p data-translate="challenge_bonus_info">${getTranslation('challenge_bonus_info')}</p>
                </div>
            `;
    } else {
      return `
                <div class="challenge-game-area">
                    <div class="challenge-controls">
                        <button id="challenge-abandon" class="btn btn-secondary" data-translate="abandon_challenge_button">
                            ${getTranslation('abandon_challenge_button')}
                        </button>
                    </div>
                </div>
            `;
    }
  }

  /**
   * Initialisation spécifique du Challenge
   */
  async onStart() {
    // Commencer par la sélection de difficulté
    this.phase = 'selection';

    // Pas de question générée automatiquement
    // L'utilisateur doit d'abord choisir la difficulté
  }

  /**
   * Configuration post-UI pour le Challenge
   */
  async initializeUI() {
    await super.initializeUI();

    /**
     * Fonction if
     * @param {*} this.phase - Description du paramètre
     * @returns {*} Description du retour
     */
    if (this.phase === 'selection') {
      this.setupDifficultySelection();
    } else {
      this.setupGameControls();
    }
  }

  /**
   * Configurer la sélection de difficulté
   */
  setupDifficultySelection() {
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    difficultyBtns.forEach(btn => {
      btn.onclick = () => this.selectDifficulty(btn.dataset.difficulty);
    });
  }

  /**
   * Configurer les contrôles de jeu
   */
  setupGameControls() {
    const abandonBtn = document.getElementById('challenge-abandon');
    if (abandonBtn) {
      abandonBtn.onclick = () => this.confirmAbandon();
    }
  }

  /**
   * Sélectionner la difficulté et démarrer le jeu
   */
  async selectDifficulty(difficulty) {
    this.difficulty = difficulty;

    this.state.timeLeft = this.difficultyTimes[difficulty];
    this.config.initialTime = this.state.timeLeft;

    console.log(`🎯 Difficulté sélectionnée: ${difficulty} (${this.state.timeLeft}s)`);

    // Passer en phase de jeu
    this.phase = 'playing';

    // Réinitialiser complètement l'UI pour la phase de jeu
    await this.initializeUI();

    // Démarrer le timer
    this.startTimer();

    // Générer la première question
    this.generateQuestion();
  }

  /**
   * Nettoie l'UI contextuelle et énonce la question après génération
   */
  onQuestionGenerated() {
    // Synthèse vocale de la question (ne jamais révéler la bonne réponse)
    if (this.state.currentQuestion) {
      const { operator, a, b, type, question } = this.state.currentQuestion;
      const operation = getOperation(operator);

      if (type === 'true_false') {
        // Lire exactement l'énoncé affiché (ex: "8 × 6 = 47")
        const spoken = String(question)
          .replaceAll('×', ' fois ')
          .replaceAll('+', ' plus ')
          .replaceAll('−', ' moins ')
          .replaceAll('÷', ' divisé par ')
          .replaceAll('=', ' égale ');
        speak(spoken);
      } else if (type === 'gap') {
        // Pour "2 × ? = 18", ne dire que la partie connue
        speak(`${a} ${operation.spokenForm}`);
      } else {
        // Pour classic, mcq, problem: lire l'énoncé sans donner la réponse
        const spoken = (question ? String(question) : `${a} ${operator} ${b} = ?`)
          .replaceAll('×', ' fois ')
          .replaceAll('+', ' plus ')
          .replaceAll('−', ' moins ')
          .replaceAll('÷', ' divisé par ')
          .replaceAll('=', ' égale ');
        speak(spoken);
      }
    }
  }

  /**
   * Démarrer le timer
   */
  startTimer() {
    this.updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      this.state.timeLeft--;
      this.updateTimerDisplay();

      /**
       * Fonction if
       * @param {*} this.state.timeLeft - Description du paramètre
       * @returns {*} Description du retour
       */
      if (this.state.timeLeft <= 0) {
        this.finish();
      }
    }, 1000);

    this.intervals.add(this.timerInterval);
  }

  /**
   * Mettre à jour l'affichage du timer
   */
  updateTimerDisplay() {
    this.updateInfoBar();

    // Affichage spécial pour les dernières secondes
    /**
     * Fonction if
     * @param {*} this.state.timeLeft - Description du paramètre
     * @returns {*} Description du retour
     */
    if (this.state.timeLeft <= 10 && this.state.timeLeft > 0) {
      const timerEl = document.getElementById('info-time');
      /**
       * Fonction if
       * @param {*} timerEl - Description du paramètre
       * @returns {*} Description du retour
       */
      if (timerEl) {
        timerEl.style.color = '#ff4444';
        timerEl.style.fontWeight = 'bold';
      }
    }
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
    if (Root?.confirm && Root.confirm(getTranslation('confirm_abandon_challenge'))) {
      this.finish();
    }
  }

  /**
   * Options de génération spécifiques au Challenge
   * Applique l'exclusion globale de tables
   */
  getQuestionOptions() {
    const currentUser = UserManager.getCurrentUser();
    const userData = UserState.getCurrentUserData();

    // NOUVEAU: Récupérer l'opérateur sélectionné
    const operator = userData.preferredOperator || '×';

    // Pour multiplication: filtrage tables
    if (operator === '×') {
      const excluded = TablePreferences.isGlobalEnabled(currentUser)
        ? TablePreferences.getActiveExclusions(currentUser)
        : [];

      const allowed = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(t => !excluded.includes(t));

      return {
        operator,
        type: 'mcq', // Toujours QCM pour la rapidité
        tables: allowed,
        excludeTables: excluded,
        minTable: 1,
        maxTable: 10,
        minNum: 1,
        maxNum: 10,
      };
    } else {
      // Autres opérations: pas de filtrage tables
      return {
        operator,
        type: 'mcq', // Toujours QCM
        difficulty: 'medium',
      };
    }
  }

  /**
   * Génération des options spécifique au Challenge
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

    // QCM rapide avec réponses plausibles
    const options = generateMCQOptions(
      correctAnswer,
      () => (Math.floor(Math.random() * 10) + 1) * (Math.floor(Math.random() * 10) + 1)
    );

    // Afficher les nombres en lettres uniquement pour × et ÷ (pas pour + et −)
    const operator = this.state.currentQuestion?.operator;
    const shouldUseWords = Math.random() < 0.2 && ['×', '÷'].includes(operator);

    return options.map(value => ({
      value: value,
      display: shouldUseWords ? numberToWords(value) : value.toString(),
    }));
  }

  /**
   * Calculer les points avec bonus de difficulté
   */
  calculatePoints() {
    let points = 10; // Points de base

    // Bonus de série
    if (this.state.streak >= 5) points = 20;
    else if (this.state.streak >= 3) points = 15;

    // Bonus de difficulté
    const difficultyMultiplier = {
      easy: 1.0,
      medium: 1.2,
      hard: 1.5,
    };

    points = Math.round(points * difficultyMultiplier[this.difficulty]);

    return points;
  }

  /**
   * Logique spécifique après soumission de réponse
   */
  onAnswerSubmitted(isCorrect, userAnswer) {
    const { operator, a, b, table, num } = this.state.currentQuestion;

    // Enregistrer stats opération
    recordOperationResult(operator, a, b, isCorrect);

    if (isCorrect) {
      // Gestion des pièces avec bonus de série
      let coinsEarned = 1; // 1 coin de base
      if (this.state.streak >= 5) coinsEarned += 1; // Bonus pour série >= 5
      if (this.state.streak >= 3) coinsEarned += 1; // Bonus pour série >= 3 (cumulatif)

      const userData = UserState.getCurrentUserData();
      userData.coins = (userData.coins || 0) + coinsEarned;
      updateCoinDisplay();

      const coinIcon = document.querySelector('.coin-count');
      if (coinIcon) showCoinGainAnimation(coinIcon);

      // Ajouter du temps bonus pour les séries
      let timeBonus = 0;
      if (this.state.streak >= 3) {
        timeBonus = Math.min(5, Math.floor(this.state.streak / 3));
        this.state.timeLeft += timeBonus;
        this.bonusTimeEarned += timeBonus;

        console.log(`⏰ Bonus temps: +${timeBonus}s (total: +${this.bonusTimeEarned}s)`);
      }

      // Mettre à jour le défi quotidien (seulement pour multiplication)
      if (operator === '×' && table !== undefined && num !== undefined) {
        updateDailyChallengeProgress(table, num);
      }
    }

    // Enregistrer dans l'historique utilisateur
    const userData = UserState.getCurrentUserData();
    if (!userData.progressHistory) userData.progressHistory = [];

    userData.progressHistory.push({
      question: `${a} ${operator} ${b} = ?`,
      correct: isCorrect,
      timestamp: Date.now(),
      mode: 'challenge',
      difficulty: this.difficulty,
      operator, // NOUVEAU
      userAnswer: userAnswer,
      correctAnswer: this.state.currentQuestion.answer,
    });

    // Sauvegarder immédiatement
    UserState.updateUserData(userData);
  }

  /**
   * Données spéciales pour la barre d'information
   */
  getInfoBarData() {
    const data = super.getInfoBarData();

    // Ajouter le bonus de temps
    /**
     * Fonction if
     * @param {*} this.bonusTimeEarned - Description du paramètre
     * @returns {*} Description du retour
     */
    if (this.bonusTimeEarned > 0) {
      data.bonus = `+${this.bonusTimeEarned}s`;
    }

    return data;
  }

  /**
   * Feedback spécialisé pour le Challenge
   */
  showAnswerFeedback(isCorrect) {
    if (!this.feedbackElement) return;

    const correctAnswer = this.state.currentQuestion.answer;

    /**
     * Fonction if
     * @param {*} isCorrect - Description du paramètre
     * @returns {*} Description du retour
     */
    if (isCorrect) {
      const points = this.calculatePoints();
      let timeBonus = 0;
      /**
       * Fonction if
       * @param {*} this.state.streak - Description du paramètre
       * @returns {*} Description du retour
       */
      if (this.state.streak >= 3) {
        timeBonus = Math.min(5, Math.floor(this.state.streak / 3));
      }

      let message;
      /**
       * Fonction if
       * @param {*} timeBonus - Description du paramètre
       * @returns {*} Description du retour
       */
      if (timeBonus > 0) {
        message = getTranslation('challenge_feedback_correct_bonus', {
          points: points,
          timeBonus: timeBonus,
        });
      } else {
        message = getTranslation('challenge_feedback_correct', { points: points });
      }

      // Affiche feedback + TTS
      try {
        showFeedback(this.feedbackElement.id, message, 'success', true);
      } catch {
        // Fallback sécurisé sans innerHTML
        if (typeof setSafeFeedback !== 'undefined') {
          setSafeFeedback(this.feedbackElement, message, 'success');
        } else {
          this.feedbackElement.textContent = message;
          this.feedbackElement.className = 'feedback-success';
        }
      }
      playSound('good');
      speak(getTranslation('correct'));
    } else {
      let message;
      if (this.state.currentQuestion.type === 'true_false') {
        message =
          correctAnswer === true
            ? getTranslation('incorrect_answer_was_true')
            : getTranslation('incorrect_answer_was_false');
      } else {
        message = getTranslation('challenge_feedback_incorrect', { correctAnswer });
      }
      try {
        showFeedback(this.feedbackElement.id, message, 'error', true);
      } catch {
        // Fallback sécurisé sans innerHTML
        if (typeof setSafeFeedback !== 'undefined') {
          setSafeFeedback(this.feedbackElement, message, 'error');
        } else {
          this.feedbackElement.textContent = message;
          this.feedbackElement.className = 'feedback-error';
        }
      }
      playSound('bad');
      speak(getTranslation('incorrect'));
    }
  }

  /**
   * Sauvegarder les résultats du Challenge
   */
  saveResults() {
    const userData = UserState.getCurrentUserData();
    const successRate =
      this.state.questionCount > 0
        ? Math.round((this.state.correctAnswers / this.state.questionCount) * 100)
        : 0;

    // Sauvegarder les statistiques du challenge
    if (!userData.challengeStats) userData.challengeStats = {};
    /**
     * Fonction if
     * @param {*} !userData.challengeStats[this.difficulty] - Description du paramètre
     * @returns {*} Description du retour
     */
    if (!userData.challengeStats[this.difficulty]) {
      userData.challengeStats[this.difficulty] = {
        bestScore: 0,
        totalPlayed: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        history: [],
      };
    }

    const stats = userData.challengeStats[this.difficulty];
    stats.bestScore = Math.max(stats.bestScore, this.state.score);
    stats.totalPlayed++;
    stats.totalCorrect += this.state.correctAnswers;
    stats.totalQuestions += this.state.questionCount;

    // Ajouter la session au journal
    if (!Array.isArray(stats.history)) stats.history = [];
    stats.history.push({
      score: this.state.score,
      correct: this.state.correctAnswers,
      total: this.state.questionCount,
      successRate: successRate,
      maxStreak: this.state.streak,
      bonusTime: this.bonusTimeEarned,
      date: Date.now(),
    });

    // Conserver uniquement le Top 10 par score décroissant
    stats.history = stats.history.sort((a, b) => b.score - a.score).slice(0, 10);

    // Mettre à jour la meilleure série globale
    userData.bestStreak = Math.max(userData.bestStreak || 0, this.state.streak);

    // Vérifier les badges
    /**
     * Fonction if
     * @param {*} window.checkAndUnlockBadge - Description du paramètre
     * @returns {*} Description du retour
     */
    checkAndUnlockBadge('challenge_accepted');
    if (this.state.score >= 150) {
      checkAndUnlockBadge('high_scorer');
    }

    // Sauvegarder
    UserState.updateUserData(userData);

    console.log('💾 Résultats Challenge sauvegardés:', {
      difficulty: this.difficulty,
      score: this.state.score,
      successRate: successRate,
      bonusTime: this.bonusTimeEarned,
    });
  }

  /**
   * Afficher les résultats du Challenge
   */
  showResults() {
    goToSlide(5);

    const successRate =
      this.state.questionCount > 0
        ? Math.round((this.state.correctAnswers / this.state.questionCount) * 100)
        : 0;

    // Déterminer le message selon le score
    let message;
    /**
     * Fonction if
     * @param {*} this.state.score - Description du paramètre
     * @returns {*} Description du retour
     */
    if (this.state.score >= 150) {
      message = getTranslation('challenge_result_message_extraordinary');
    } else if (this.state.score >= 100) {
      message = getTranslation('challenge_result_message_excellent');
    } else if (this.state.score >= 50) {
      message = getTranslation('challenge_result_message_good');
    } else {
      message = getTranslation('challenge_result_message_keep_practicing');
    }

    // Afficher les résultats
    const resultsScreen = document.getElementById('results');
    /**
     * Fonction if
     * @param {*} resultsScreen - Description du paramètre
     * @returns {*} Description du retour
     */
    if (resultsScreen) {
      resultsScreen.textContent = '';
      const container = document.createElement('div');
      container.className = 'results-container content-card';
      container.setAttribute('role', 'main');
      container.setAttribute('aria-label', getTranslation('challenge_results_title'));

      container.appendChild(createSafeElement('h2', getTranslation('challenge_results_title')));

      const summary = document.createElement('div');
      summary.className = 'challenge-summary';
      const badge = createSafeElement('div', getTranslation('challenge_' + this.difficulty), {
        class: `difficulty-badge ${this.difficulty}`,
      });
      summary.appendChild(badge);
      if (this.bonusTimeEarned > 0) {
        summary.appendChild(
          createSafeElement('div', `+${this.bonusTimeEarned}s bonus`, { class: 'bonus-indicator' })
        );
      }
      container.appendChild(summary);

      const grid = document.createElement('div');
      grid.className = 'stats-grid';
      const mkBox = (value, labelKey) => {
        const box = document.createElement('div');
        box.className = 'stat-box';
        const v = createSafeElement('div', String(value), { class: 'stat-value' });
        const l = createSafeElement('div', getTranslation(labelKey), { class: 'stat-label' });
        box.appendChild(v);
        box.appendChild(l);
        return box;
      };
      grid.appendChild(mkBox(this.state.score, 'your_score'));
      grid.appendChild(mkBox(this.state.correctAnswers, 'stat_good_answers'));
      grid.appendChild(mkBox(this.state.questionCount, 'stat_questions'));
      grid.appendChild(mkBox(`${successRate}%`, 'stat_success_rate'));
      container.appendChild(grid);

      container.appendChild(createSafeElement('div', message, { class: 'message-box' }));

      const btnRow = document.createElement('div');
      btnRow.className = 'button-row';
      const btn = createSafeElement('button', getTranslation('play_again'), {
        class: 'btn btn-primary',
        'data-action': 'play-again',
        'aria-label': getTranslation('play_again'),
      });
      btn.addEventListener('click', async e => {
        e.preventDefault();
        try {
          const mod = await import('../mode-orchestrator.js');
          mod.setGameMode?.('challenge');
        } catch (err) {
          console.error('Unable to restart Challenge via orchestrator:', err);
        }
      });
      btnRow.appendChild(btn);

      const homeBtn = createSafeElement('button', getTranslation('back_to_home'), {
        class: 'btn',
        'data-action': 'back-to-home',
        'aria-label': getTranslation('back_to_home'),
      });
      homeBtn.addEventListener('click', e => {
        e.preventDefault();
        goToSlide(1);
      });
      btnRow.appendChild(homeBtn);

      container.appendChild(btnRow);

      resultsScreen.appendChild(container);
    }
  }

  /**
   * Nettoyage spécifique au Challenge
   */
  cleanup() {
    super.cleanup();

    // Nettoyer le timer spécifique
    /**
     * Fonction if
     * @param {*} this.timerInterval - Description du paramètre
     * @returns {*} Description du retour
     */
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Arrêt spécifique
   */
  onStop() {
    // Nettoyer le timer
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Vérification personnalisée pour continuer
   */
  shouldContinue() {
    // Le temps est le principal limitant
    if (this.state.timeLeft <= 0) {
      return false;
    }

    // Limite de questions très élevée (rarement atteinte)
    /**
     * Fonction if
     * @param {*} this.state.questionCount - Description du paramètre
     * @returns {*} Description du retour
     */
    if (this.state.questionCount >= this.config.maxQuestions) {
      return false;
    }

    return this.state.isActive;
  }
}

// Export ES6 pur
export default ChallengeMode;
// Start/stop wrappers to manage a single instance (for orchestrator/slide stops)
let _challengeModeInstance = null;
export function startChallengeMode() {
  if (_challengeModeInstance) _challengeModeInstance.stop();
  _challengeModeInstance = new ChallengeMode();
  _challengeModeInstance.start();
}
export function stopChallengeMode() {
  if (_challengeModeInstance) {
    _challengeModeInstance.stop();
    _challengeModeInstance = null;
  }
}
export function refreshChallengeTexts() {
  _challengeModeInstance?.refreshTexts?.();
}
