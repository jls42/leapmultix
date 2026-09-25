/**
 * Mode Défi refactorisé avec héritage de GameMode
 * Phase 5.3 - Refactorisation du mode Challenge
 *
 * Chrono calme : en fin de temps, la case du chrono change d'état (pastille
 * d'avertissement), sans clignotement. La bonne tuile est cochée après chaque choix.
 */

import { GameMode, GOOD_SOUND_MS } from '../core/GameMode.js';
import {
  getTranslation,
  showCoinGainAnimation,
  updateCoinDisplay,
  playSound,
  showFeedback,
  speak,
} from '../utils-es6.js';
import { setSafeFeedback } from '../security-utils.js';
import {
  markAnswerOptions,
  tagAnswerOptions,
  markQuestionKind,
  formatCorrectCount,
  createResultsSummary,
  createResultsActions,
  singleActivation,
  createAvatarPortrait,
  mountResults,
} from '../ui-feedback.js';
import { goToSlide } from '../slides.js';
import { UserState } from '../core/userState.js';
import { checkAndUnlockBadge } from '../badges.js';
import { gameState, updateDailyChallengeProgress } from '../game.js';
import { TablePreferences } from '../core/tablePreferences.js';
import { UserManager } from '../userManager.js';

/** Seuil (en secondes) à partir duquel le chrono passe en état « temps faible ». */
const LOW_TIME_SECONDS = 10;

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
    this.sessionBestStreak = 0;
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

                    <div class="difficulty-selector" role="group" aria-labelledby="challenge-difficulty-title">
                        <h3 id="challenge-difficulty-title" data-translate="choose_difficulty">${getTranslation('choose_difficulty')}</h3>
                        <div class="difficulty-options">
                            <button type="button" class="difficulty-btn" data-difficulty="easy" data-translate="challenge_easy">${getTranslation('challenge_easy')}</button>
                            <button type="button" class="difficulty-btn" data-difficulty="medium" data-translate="challenge_medium">${getTranslation('challenge_medium')}</button>
                            <button type="button" class="difficulty-btn" data-difficulty="hard" data-translate="challenge_hard">${getTranslation('challenge_hard')}</button>
                        </div>
                    </div>

                    <p data-translate="challenge_bonus_info">${getTranslation('challenge_bonus_info')}</p>
                </div>
            `;
    } else {
      return `
                <div class="game-quit challenge-controls">
                    <button id="challenge-abandon" type="button" class="btn btn-quiet btn-danger" data-translate="abandon_challenge_button">${getTranslation('abandon_challenge_button')}</button>
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
   * Réinitialisation (nouvelle partie)
   */
  resetState() {
    super.resetState();
    this.sessionBestStreak = 0;
  }

  /**
   * Configuration post-UI pour le Challenge
   */
  async initializeUI() {
    await super.initializeUI();

    if (this.phase === 'selection') {
      this.setupDifficultySelection();
    } else {
      this.placeActionsAfterAnswers();
      this.setupGameControls();
    }
  }

  /**
   * « Abandonner » passe après la zone de réponse, discret.
   */
  placeActionsAfterAnswers() {
    const container = this.feedbackElement?.parentElement;
    const controls = container?.querySelector('.challenge-controls');
    if (!container || !controls) return;

    const customWrap = controls.parentElement;
    container.appendChild(controls);
    if (customWrap && customWrap !== container && customWrap.children.length === 0) {
      customWrap.remove();
    }
  }

  /**
   * Configurer la sélection de difficulté
   */
  setupDifficultySelection() {
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    difficultyBtns.forEach(btn => {
      // Une seule activation : Entrée déclenchait deux départs (chrono deux fois plus rapide)
      btn.onclick = singleActivation(() => this.selectDifficulty(btn.dataset.difficulty));
    });
  }

  /**
   * Configurer les contrôles de jeu
   */
  setupGameControls() {
    const abandonBtn = document.getElementById('challenge-abandon');
    if (abandonBtn) {
      abandonBtn.onclick = singleActivation(() => this.confirmAbandon());
    }
  }

  /**
   * Sélectionner la difficulté et démarrer le jeu
   */
  async selectDifficulty(difficulty) {
    if (this.phase !== 'selection') return;

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
   * Tuiles de réponse : nombres en police de titre, mots en police de lecture
   */
  displayOptions() {
    this.optionsElement?.classList.remove('is-answered');
    super.displayOptions();
    tagAnswerOptions(this.optionsElement);
  }

  /**
   * Après génération : calcul en grand, puis la question lue à voix haute
   * (sans jamais révéler la réponse)
   */
  onQuestionGenerated() {
    if (!this.state.currentQuestion) return;
    markQuestionKind(this.questionElement, this.state.currentQuestion);
    this.speakQuestion();
  }

  /**
   * Démarrer le timer
   */
  startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.intervals.delete(this.timerInterval);
    }

    this.updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      this.state.timeLeft--;
      this.updateTimerDisplay();

      if (this.state.timeLeft <= 0) {
        this.finish();
      }
    }, 1000);

    this.intervals.add(this.timerInterval);
  }

  /**
   * Mettre à jour l'affichage du timer. Temps faible : la case du chrono passe
   * en état d'avertissement (classe is-low, css/timer.css), sans clignotement.
   */
  updateTimerDisplay() {
    this.updateInfoBar();

    const timeItem = document.getElementById('info-time')?.closest('.info-item');
    if (timeItem) {
      const isLow = this.state.timeLeft > 0 && this.state.timeLeft <= LOW_TIME_SECONDS;
      timeItem.classList.toggle('is-low', isLow);
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
   * (la statistique de l'opération est déjà enregistrée par GameMode.recordAnswer)
   */
  onAnswerSubmitted(isCorrect, userAnswer) {
    const { operator, a, b, table, num } = this.state.currentQuestion;

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
   * Barre d'infos : score, série et chrono. Aucune barre pendant le choix de la
   * difficulté (le temps n'est pas encore connu). Le temps gagné s'ajoute au chrono
   * et s'annonce dans le retour : pas de case à part qui décalerait les tuiles.
   */
  getInfoBarData() {
    if (this.phase === 'selection') return null;
    return super.getInfoBarData();
  }

  /**
   * Feedback spécialisé pour le Challenge
   * @param {boolean} isCorrect
   * @param {*} userAnswer - Réponse choisie (fournie par GameMode.handleAnswer)
   */
  showAnswerFeedback(isCorrect, userAnswer) {
    if (!this.feedbackElement) return;

    const correctAnswer = this.state.currentQuestion.answer;

    // La bonne tuile est cochée, le choix de l'enfant reste enfoncé
    markAnswerOptions(this.optionsElement, correctAnswer, userAnswer);

    if (isCorrect) {
      this.sessionBestStreak = Math.max(this.sessionBestStreak, this.state.streak);
      this.showCorrectFeedback();
    } else {
      this.showIncorrectFeedback(correctAnswer);
    }
  }

  /**
   * Réponse juste : points (et temps gagné pendant une série)
   */
  showCorrectFeedback() {
    const points = this.calculatePoints();
    const timeBonus = this.state.streak >= 3 ? Math.min(5, Math.floor(this.state.streak / 3)) : 0;

    const message =
      timeBonus > 0
        ? getTranslation('challenge_feedback_correct_bonus', { points, timeBonus })
        : getTranslation('challenge_feedback_correct', { points });

    // Le retour s'affiche sans être lu : la voix dit un seul encouragement
    this.displayFeedback(message, 'success', false);
    // Le bip, puis « Bravo » juste après lui
    playSound('good');
    this.addTimer(() => speak(getTranslation('correct')), GOOD_SOUND_MS);
  }

  /**
   * Réponse fausse : ton calme, sans son d'alerte ; la bonne tuile est déjà cochée
   * @param {*} correctAnswer
   */
  showIncorrectFeedback(correctAnswer) {
    let message;
    if (this.state.currentQuestion.type === 'true_false') {
      message =
        correctAnswer === true
          ? getTranslation('incorrect_answer_was_true')
          : getTranslation('incorrect_answer_was_false');
    } else {
      message = getTranslation('challenge_feedback_incorrect', { correctAnswer });
    }

    // La phrase entière est lue : « Presque ! La bonne réponse est 8. »
    const lead = getTranslation('incorrect');
    this.displayFeedback(`${lead} ${message}`, 'error', true);
  }

  /**
   * Affiche un retour (texte seul, sans HTML)
   * @param {string} message
   * @param {'success'|'error'} type
   * @param {boolean} [speakIt=true] - Lire le message à voix haute
   */
  displayFeedback(message, type, speakIt = true) {
    try {
      showFeedback(this.feedbackElement.id, message, type, speakIt);
    } catch {
      // Fallback sécurisé sans innerHTML
      if (typeof setSafeFeedback !== 'undefined') {
        setSafeFeedback(this.feedbackElement, message, type);
      } else {
        this.feedbackElement.textContent = message;
        this.feedbackElement.className = `feedback-${type}`;
      }
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

    // Sauvegarder AVANT les badges : checkAndUnlockBadge enregistre sa propre copie des
    // données ; réécrire ensuite cette copie-ci effacerait le badge tout juste gagné
    UserState.updateUserData(userData);

    // Vérifier les badges : un défi sans aucune réponse ne rapporte pas de badge
    if (this.state.questionCount > 0) {
      checkAndUnlockBadge('challenge_accepted');
    }
    if (this.state.score >= 150) {
      checkAndUnlockBadge('high_scorer');
    }

    console.log('💾 Résultats Challenge sauvegardés:', {
      difficulty: this.difficulty,
      score: this.state.score,
      successRate: successRate,
      bonusTime: this.bonusTimeEarned,
    });
  }

  /**
   * Encouragement de fin de partie selon le score
   * @param {number} [score]
   * @returns {string}
   */
  getResultMessage(score = this.state.score) {
    if (score >= 150) return getTranslation('challenge_result_message_extraordinary');
    if (score >= 100) return getTranslation('challenge_result_message_excellent');
    if (score >= 50) return getTranslation('challenge_result_message_good');
    return getTranslation('challenge_result_message_keep_practicing');
  }

  /**
   * Afficher les résultats du Challenge (slide 5). Le focus va sur la phrase
   * principale une fois l'écran affiché ; l'écran suit un changement de langue.
   */
  showResults() {
    const shown = goToSlide(5);

    const resultsScreen = document.getElementById('results');
    if (!resultsScreen) return;

    const result = {
      correct: this.state.correctAnswers,
      total: this.state.questionCount,
      score: this.state.score,
      difficulty: this.difficulty,
      bestStreak: this.sessionBestStreak,
      bonusTime: this.bonusTimeEarned,
      avatar: gameState?.avatar,
    };
    mountResults(resultsScreen, () => this.renderResults(result), { ready: shown });
  }

  /**
   * Écran de fin : une phrase « 7 bonnes réponses sur 10 », un encouragement, puis
   * difficulté, score, meilleure série et temps gagné. Construit à partir d'un
   * instantané : il peut être reconstruit dans une autre langue.
   * @param {Object} result
   * @returns {HTMLElement}
   */
  renderResults(result) {
    const container = document.createElement('section');
    container.className = 'results-container content-card game-results';
    container.setAttribute('aria-label', getTranslation('challenge_results_title'));

    const avatar = createAvatarPortrait(result.avatar);
    if (avatar) container.appendChild(avatar);

    container.appendChild(
      createResultsSummary({
        lead: formatCorrectCount(result.correct, result.total),
        message: this.getResultMessage(result.score),
        details: [
          getTranslation(`challenge_${result.difficulty}`),
          getTranslation('results_score', { score: result.score }),
          result.bestStreak > 0
            ? getTranslation('results_best_streak', { streak: result.bestStreak })
            : '',
          result.bonusTime > 0
            ? getTranslation('results_time_bonus', { seconds: result.bonusTime })
            : '',
        ],
      })
    );

    container.appendChild(
      createResultsActions([
        {
          label: getTranslation('play_again'),
          action: 'play-again',
          primary: true,
          onActivate: async () => {
            try {
              const mod = await import('../mode-orchestrator.js');
              mod.setGameMode?.('challenge');
            } catch (err) {
              console.error('Unable to restart Challenge via orchestrator:', err);
            }
          },
        },
        {
          label: getTranslation('back_to_home'),
          action: 'back-to-home',
          onActivate: () => goToSlide(1),
        },
      ])
    );

    return container;
  }

  /**
   * Lire la bonne réponse ne coûte pas de temps : le décompte s'arrête pendant
   * la pause qui suit une erreur, puis repart avec la question suivante.
   * @param {number} delay - Durée de la pause en millisecondes
   */
  onWrongAnswerPause(delay) {
    if (!this.timerInterval) return;
    clearInterval(this.timerInterval);
    this.intervals.delete(this.timerInterval);
    this.timerInterval = null;
    this.addTimer(() => {
      if (this.state.isActive && this.state.timeLeft > 0) this.startTimer();
    }, delay);
  }

  /**
   * Nettoyage spécifique au Challenge
   */
  cleanup() {
    super.cleanup();

    // Nettoyer le timer spécifique
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
