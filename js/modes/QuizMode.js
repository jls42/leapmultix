/**
 * Mode Quiz refactorisé avec héritage de GameMode
 * Phase 5.2 - Refactorisation du mode Quiz
 *
 * Une erreur est une étape : la bonne tuile est cochée, l'explication reste
 * affichée et le bouton « Continuer » attend l'enfant (aucun compte à rebours,
 * WCAG 2.2.1). Après une bonne réponse, la partie avance seule.
 */

import { GameMode, GOOD_SOUND_MS } from '../core/GameMode.js';
import { setGameMode } from '../mode-orchestrator.js';
import { getTranslation, getWeakTables, showFeedback, playSound, speak } from '../utils-es6.js';
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

export class QuizMode extends GameMode {
  constructor() {
    super('quiz', {
      maxQuestions: 10,
      hasTimer: false,
      hasLives: false,
      hasStreaks: true,
      // Avance automatique après une bonne réponse ; après une erreur, « Continuer »
      // (créé par GameMode) suspend l'avance jusqu'à ce que l'enfant l'active.
      autoProgress: true,
      pauseAfterError: true,
      showScore: true,
    });

    // État spécifique au Quiz
    this.errors = 0;
    this.sessionBestStreak = 0;
  }

  /**
   * Réinitialisation (nouvelle partie)
   */
  resetState() {
    super.resetState();
    this.errors = 0;
    this.sessionBestStreak = 0;
  }

  /**
   * Barre d'infos : score, progression (« 3/10 ») et série
   */
  getInfoBarData() {
    const data = super.getInfoBarData();
    data.progress = `${this.state.questionCount}/${this.config.maxQuestions}`;
    return data;
  }

  /**
   * Initialisation spécifique du Quiz
   */
  async onStart() {
    // Générer la première question
    this.generateQuestion();
  }

  /**
   * HTML personnalisé pour le Quiz : « Abandonner », replacé après la zone de
   * réponse (et après « Continuer ») dans initializeUI().
   */
  async getCustomHTML() {
    return `
            <div id="quiz-actions" class="game-quit quiz-actions">
                <button id="quiz-abandon" type="button" class="btn btn-quiet btn-danger" data-translate="abandon_quiz_button">${getTranslation('abandon_quiz_button')}</button>
            </div>
        `;
  }

  /**
   * Configuration post-UI pour le Quiz
   */
  async initializeUI() {
    await super.initializeUI();

    this.placeActionsAfterAnswers();

    // Bouton d'abandon
    this.setupGameControls();
  }

  /**
   * Ordre de lecture : question, réponses, retour, « Continuer », puis « Abandonner ».
   * « Abandonner » n'est plus le premier élément visible de la partie.
   */
  placeActionsAfterAnswers() {
    const container = this.feedbackElement?.parentElement;
    const actions = document.getElementById('quiz-actions');
    if (!container || !actions) return;

    const customWrap = actions.parentElement;
    container.appendChild(actions);

    // L'enveloppe du contenu personnalisé, désormais vide, disparaît
    if (customWrap && customWrap !== container && customWrap.children.length === 0) {
      customWrap.remove();
    }
  }

  /**
   * Configurer le bouton d'abandon
   */
  setupGameControls() {
    const abandonBtn = document.getElementById('quiz-abandon');
    if (abandonBtn) {
      abandonBtn.onclick = singleActivation(() => this.confirmAbandon());
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
    if (Root?.confirm && Root.confirm(getTranslation('confirm_abandon_quiz'))) {
      this.hideContinueButton();
      this.finish();
    }
  }

  /**
   * Options de génération spécifiques au Quiz
   */
  getQuestionOptions() {
    const weakTables = getWeakTables();
    const currentUser = UserManager.getCurrentUser();
    const userData = UserState.getCurrentUserData();

    // NOUVEAU: Récupérer l'opérateur sélectionné
    const operator = userData.preferredOperator || '×';

    // Pour multiplication: filtrage tables
    if (operator === '×') {
      const globalExclusions = TablePreferences.isGlobalEnabled(currentUser)
        ? TablePreferences.getActiveExclusions(currentUser)
        : [];

      const allowedTables = Array.from({ length: 10 }, (_, i) => i + 1).filter(
        t => !globalExclusions.includes(t)
      );

      if (allowedTables.length === 0) {
        console.warn('⚠️ Aucune table disponible pour le quiz, utilisation du jeu complet.');
        return {
          operator,
          weakTables,
          tables: Array.from({ length: 10 }, (_, i) => i + 1),
          excludeTables: [],
          type: 'auto',
          minNum: 1,
          maxNum: 10,
        };
      }

      return {
        operator,
        weakTables,
        tables: allowedTables,
        excludeTables: globalExclusions,
        type: 'auto',
        minNum: 1,
        maxNum: 10,
      };
    } else {
      // Autres opérations: pas de filtrage tables, utiliser difficulty
      return {
        operator,
        type: 'auto',
        difficulty: 'medium',
      };
    }
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
   * Feedback spécialisé pour le Quiz
   * @param {boolean} isCorrect
   * @param {*} userAnswer - Réponse choisie (fournie par GameMode.handleAnswer)
   */
  showAnswerFeedback(isCorrect, userAnswer) {
    if (!this.feedbackElement) return;

    // La bonne tuile est cochée, le choix de l'enfant reste enfoncé
    markAnswerOptions(this.optionsElement, this.state.currentQuestion.answer, userAnswer);

    if (isCorrect) {
      this.sessionBestStreak = Math.max(this.sessionBestStreak, this.state.streak);
      this._handleCorrectAnswer();
    } else {
      this._handleIncorrectAnswer();
    }
  }

  /**
   * Gère le feedback pour une réponse correcte
   */
  _handleCorrectAnswer() {
    const points = this.calculatePoints();
    const message = this._getCorrectAnswerMessage(points);

    // Le bip, puis « Bravo » juste après lui
    playSound('good');
    this.addTimer(() => speak(getTranslation('correct')), GOOD_SOUND_MS);

    this._displayCorrectFeedback(message);
  }

  /**
   * Génère le message pour une réponse correcte
   */
  _getCorrectAnswerMessage(points) {
    return this.state.streak >= 3
      ? getTranslation('feedback_correct_streak', { points, streak: this.state.streak })
      : getTranslation('feedback_correct', { points });
  }

  /**
   * Affiche le feedback pour une réponse correcte
   */
  _displayCorrectFeedback(message) {
    try {
      showFeedback(this.feedbackElement.id, message, 'success', false);
    } catch {
      this._fallbackCorrectFeedback(message);
    }
  }

  /**
   * Fallback pour l'affichage du feedback correct
   */
  _fallbackCorrectFeedback(message) {
    if (typeof setSafeFeedback !== 'undefined') {
      setSafeFeedback(this.feedbackElement, message, 'success');
    } else {
      this.feedbackElement.textContent = message;
      this.feedbackElement.className = 'feedback-success';
    }
  }

  /**
   * Gère le feedback pour une réponse incorrecte : ton calme, ni son d'alerte
   * ni secousse ; l'explication (GameMode) montre ce que fait l'opération et la
   * voix donne la bonne réponse aux lecteurs débutants.
   */
  _handleIncorrectAnswer() {
    this.errors++;

    if (this.showErrorExplanation()) speak(this.spokenErrorText());

    this.showContinueButton();
  }

  /**
   * Logique spécifique après soumission de réponse
   * (la statistique de l'opération est déjà enregistrée par GameMode.recordAnswer)
   */
  onAnswerSubmitted(isCorrect, userAnswer) {
    const { operator, a, b, table, num } = this.state.currentQuestion;

    // Enregistrer dans l'historique utilisateur
    const userData = UserState.getCurrentUserData();
    if (!userData.progressHistory) userData.progressHistory = [];

    userData.progressHistory.push({
      question: `${a} ${operator} ${b} = ?`,
      correct: isCorrect,
      timestamp: Date.now(),
      mode: 'quiz',
      operator, // NOUVEAU
      userAnswer: userAnswer,
      correctAnswer: this.state.currentQuestion.answer,
    });

    // Sauvegarder immédiatement
    UserState.updateUserData(userData);

    // Mettre à jour le défi quotidien (seulement pour multiplication)
    if (operator === '×' && table !== undefined && num !== undefined) {
      updateDailyChallengeProgress(table, num);
    }
  }

  /**
   * Après génération : calcul en grand ou énoncé en police de lecture, puis la
   * question lue à voix haute (sans jamais révéler la réponse)
   */
  onQuestionGenerated() {
    if (!this.state.currentQuestion) return;
    markQuestionKind(this.questionElement, this.state.currentQuestion);
    this.speakQuestion();
  }

  /**
   * Sauvegarder les résultats du Quiz
   */
  saveResults() {
    const userData = UserState.getCurrentUserData();
    const successRate =
      this.state.questionCount > 0
        ? Math.round((this.state.correctAnswers / this.state.questionCount) * 100)
        : 0;

    // Sauvegarder les statistiques du quiz
    if (!userData.quizStats) userData.quizStats = {};
    if (!userData.quizStats.history) userData.quizStats.history = [];

    userData.quizStats.history.push({
      score: this.state.score,
      correct: this.state.correctAnswers,
      total: this.state.questionCount,
      errors: this.errors,
      successRate: successRate,
      maxStreak: Math.max(userData.bestStreak || 0, this.state.streak),
      date: Date.now(),
      excludedTables: TablePreferences.isGlobalEnabled(UserManager.getCurrentUser())
        ? TablePreferences.getActiveExclusions(UserManager.getCurrentUser())
        : [],
    });

    // Garder seulement les 20 derniers résultats
    userData.quizStats.history = userData.quizStats.history.slice(-20);

    // Mettre à jour les records
    userData.quizStats.bestScore = Math.max(userData.quizStats.bestScore || 0, this.state.score);
    userData.quizStats.totalQuizzes = (userData.quizStats.totalQuizzes || 0) + 1;

    userData.bestStreak = Math.max(userData.bestStreak || 0, this.state.streak);

    // Sauvegarder AVANT les badges : checkAndUnlockBadge enregistre sa propre copie des
    // données ; réécrire ensuite cette copie-ci effacerait le badge tout juste gagné
    UserState.updateUserData(userData);

    // Vérifier les badges (un badge déjà obtenu ne s'annonce plus)
    if (this.state.questionCount > 0) {
      checkAndUnlockBadge('quiz_starter');
    }
    if (successRate === 100 && this.state.questionCount >= 10) {
      checkAndUnlockBadge('perfect_quiz');
    }

    console.log('💾 Résultats Quiz sauvegardés:', {
      score: this.state.score,
      successRate: successRate,
      streak: this.state.streak,
    });
  }

  /**
   * Encouragement de fin de partie (le pourcentage ne s'affiche pas)
   * @param {number} correct
   * @param {number} total
   * @returns {string}
   */
  getResultMessage(correct = this.state.correctAnswers, total = this.state.questionCount) {
    const successRate = total > 0 ? correct / total : 0;

    if (successRate >= 0.9) return getTranslation('excellent');
    if (successRate >= 0.75) return getTranslation('very_good');
    if (successRate >= 0.6) return getTranslation('good_job');
    return getTranslation('keep_practicing');
  }

  /**
   * Écran de fin : une phrase « 7 bonnes réponses sur 10 », un encouragement, puis
   * le score et la meilleure série en ligne secondaire. Construit à partir d'un
   * instantané : il peut être reconstruit dans une autre langue.
   * @param {{correct: number, total: number, score: number, bestStreak: number, avatar: string}} result
   * @returns {HTMLElement}
   */
  renderResults(result) {
    const container = document.createElement('section');
    container.className = 'results-container content-card game-results';
    container.setAttribute('aria-label', getTranslation('quiz_results'));

    const avatar = createAvatarPortrait(result.avatar);
    if (avatar) container.appendChild(avatar);

    container.appendChild(
      createResultsSummary({
        lead: formatCorrectCount(result.correct, result.total),
        message: this.getResultMessage(result.correct, result.total),
        details: [
          getTranslation('results_score', { score: result.score }),
          result.bestStreak > 0
            ? getTranslation('results_best_streak', { streak: result.bestStreak })
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
          onActivate: () => {
            setGameMode('quiz').catch(err => {
              console.warn('setGameMode failed', err);
            });
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
   * Afficher les résultats du Quiz (slide 5). Le focus va sur la phrase principale
   * une fois l'écran affiché ; l'écran suit un changement de langue.
   */
  showResults() {
    const shown = goToSlide(5);

    const resultsScreen = document.getElementById('results');
    if (!resultsScreen) return;

    const result = {
      correct: this.state.correctAnswers,
      total: this.state.questionCount,
      score: this.state.score,
      bestStreak: this.sessionBestStreak,
      avatar: gameState?.avatar,
    };
    mountResults(resultsScreen, () => this.renderResults(result), { ready: shown });
  }
}

// Export ES6 pur
export default QuizMode;
// Start/stop wrappers to manage a single instance (for orchestrator/slide stops)
let _quizModeInstance = null;
export function startQuizMode() {
  if (_quizModeInstance) _quizModeInstance.stop();
  _quizModeInstance = new QuizMode();
  _quizModeInstance.start();
}
export function stopQuizMode() {
  if (_quizModeInstance) {
    _quizModeInstance.stop();
    _quizModeInstance = null;
  }
}
export function refreshQuizTexts() {
  _quizModeInstance?.refreshTexts?.();
}
