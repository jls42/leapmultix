/**
 * Mode Quiz refactorisé avec héritage de GameMode
 * Phase 5.2 - Refactorisation du mode Quiz
 */

import { GameMode } from '../core/GameMode.js';
import { setGameMode } from '../mode-orchestrator.js';
import {
  getTranslation,
  numberToWords,
  getWeakTables,
  showFeedback,
  playSound,
  speak,
} from '../utils-es6.js';
import { setSafeFeedback, setSafeComplexFeedback, createSafeElement } from '../security-utils.js';
import { goToSlide } from '../slides.js';
import { UserState } from '../core/userState.js';
import { checkAndUnlockBadge } from '../badges.js';
import { updateDailyChallengeProgress } from '../game.js';
import { saveQuizExcludeTables, loadQuizExcludeTables } from '../core/storage.js';
import { generateMCQOptions } from '../uiUtils.js';

export class QuizMode extends GameMode {
  constructor() {
    super('quiz', {
      maxQuestions: 10,
      hasTimer: false,
      hasLives: false,
      hasStreaks: true,
      // Avance automatique par défaut (cas correct) ;
      // pour les erreurs on affichera un bouton Continuer et on suspendra temporairement l'auto-advance
      autoProgress: true,
      showScore: true,
    });

    // État spécifique au Quiz
    this.excludeTables = [];
    this.errors = 0;
    this.feedbackTimeoutId = null;
    this.feedbackIntervalId = null;
  }

  /**
   * Initialisation spécifique du Quiz
   */
  async onStart() {
    // Générer la première question
    this.generateQuestion();
  }

  /**
   * HTML personnalisé pour le Quiz (filtre de tables)
   */
  async getCustomHTML() {
    return `
            <div class="quiz-filter-section">
                <button id="quiz-filter-toggle" class="btn btn-sm filter-toggle">
                    ${getTranslation('quiz_filter_toggle')}
                </button>
                <div id="quiz-filter" class="quiz-filter hidden">
                    <p class="filter-info">${getTranslation('quiz_filter_info')}</p>
                    <h3>${getTranslation('exclude_tables_title')}</h3>
                    <div class="exclude-table-buttons">
                        ${Array.from({ length: 10 }, (_, i) => i + 1)
                          .map(
                            table =>
                              `<button class="btn exclude-btn" data-table="${table}">${table}</button>`
                          )
                          .join('')}
                    </div>
                </div>
                <div id="quiz-exclusion-message" class="quiz-exclusion-message"></div>
            </div>
            
            <!-- Zone d'astuce (affichée après réponse) -->
            <div id="quiz-hint" class="quiz-hint" style="display:none; margin-top:10px;">
                <strong>${getTranslation('hint')}:</strong>
                <span id="quiz-hint-text"></span>
            </div>
            
            <!-- Bouton Continuer avec compte à rebours -->
            <div id="quiz-continue" class="quiz-continue" style="display:none; margin-top:12px;">
                <button id="quiz-continue-btn" class="btn btn-primary">${getTranslation('continue')}</button>
                <span id="quiz-continue-timer" style="margin-left:8px; opacity:0.8;"></span>
            </div>
            <div id="quiz-actions" class="quiz-actions">
                <button id="quiz-abandon" class="btn btn-secondary" data-translate="abandon_quiz_button">
                    ${getTranslation('abandon_quiz_button')}
                </button>
            </div>
        `;
  }

  /**
   * Configuration post-UI pour le Quiz
   */
  async initializeUI() {
    await super.initializeUI();

    // Charger les exclusions de tables AVANT de configurer l'UI
    this.excludeTables = loadQuizExcludeTables() || [];

    // Configurer les interactions du filtre
    this.setupFilterUI();

    // Afficher le message d'exclusion initial
    this.updateExclusionMessage();

    // Bouton d'abandon
    this.setupGameControls();
  }

  /**
   * Configurer l'interface de filtrage
   */
  setupFilterUI() {
    const filterToggle = document.getElementById('quiz-filter-toggle');
    const quizFilter = document.getElementById('quiz-filter');

    if (filterToggle && quizFilter) {
      filterToggle.onclick = () => quizFilter.classList.toggle('hidden');
    }

    // Configuration des boutons d'exclusion
    const excludeBtns = quizFilter?.querySelectorAll('.exclude-btn');
    excludeBtns?.forEach(btn => {
      const table = parseInt(btn.dataset.table);
      btn.onclick = () => this.toggleTableExclusion(table);

      // Restaurer l'état visuel selon les données sauvegardées
      if (this.excludeTables.includes(table)) {
        btn.classList.add('selected');
      }
    });

    // La sélection des tables enregistre désormais immédiatement
  }

  /**
   * Basculer l'exclusion d'une table
   */
  toggleTableExclusion(table) {
    const idx = this.excludeTables.indexOf(table);
    const btn = document.querySelector(`.exclude-btn[data-table="${table}"]`);

    if (idx >= 0) {
      this.excludeTables.splice(idx, 1);
      btn?.classList.remove('selected');
    } else {
      this.excludeTables.push(table);
      btn?.classList.add('selected');
    }

    saveQuizExcludeTables(this.excludeTables);
    this.updateExclusionMessage();
  }

  /**
   * Mettre à jour le message d'exclusion
   */
  updateExclusionMessage() {
    const msgEl = document.getElementById('quiz-exclusion-message');
    if (!msgEl) return;

    if (this.excludeTables.length > 0) {
      const msgText = getTranslation('quiz_excluded_tables', {
        tables: this.excludeTables.join(', '),
      });
      msgEl.textContent = msgText;
      msgEl.style.display = 'block';
    } else {
      msgEl.style.display = 'none';
    }
  }

  /**
   * Configurer le bouton d'abandon
   */
  setupGameControls() {
    const abandonBtn = document.getElementById('quiz-abandon');
    if (abandonBtn) {
      abandonBtn.onclick = () => this.confirmAbandon();
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
      this.finish();
    }
  }

  /**
   * Options de génération spécifiques au Quiz
   */
  getQuestionOptions() {
    const weakTables = getWeakTables();

    // Filtrer les tables autorisées
    const allowedTables = Array.from({ length: 10 }, (_, i) => i + 1).filter(
      t => !this.excludeTables.includes(t)
    );

    // Si aucune table n'est disponible, réinitialiser les exclusions
    if (allowedTables.length === 0) {
      console.warn('Aucune table disponible pour le quiz, annulation des exclusions.');
      this.excludeTables = [];
      this.updateExclusionMessage();
      saveQuizExcludeTables([]);
      return this.getQuestionOptions(); // Récursif pour récupérer toutes les tables
    }

    return {
      weakTables,
      tables: allowedTables,
      type: 'auto',
      minNum: 1,
      maxNum: 10,
    };
  }

  /**
   * Génération des options spécifique au Quiz
   */
  generateOptions() {
    const correctAnswer = this.state.currentQuestion.answer;

    switch (this.state.currentQuestion.type) {
      case 'mcq': {
        // QCM 4 choix avec réponses plausibles
        const options = generateMCQOptions(
          correctAnswer,
          () => (Math.floor(Math.random() * 10) + 1) * (Math.floor(Math.random() * 10) + 1)
        );

        return options.map(value => ({
          value: value,
          display: Math.random() < 0.2 ? numberToWords(value) : value.toString(),
        }));
      }
      case 'true_false':
        // Vrai/Faux
        return [
          { value: true, display: getTranslation('true') },
          { value: false, display: getTranslation('false') },
        ];

      default:
        return super.generateOptions();
    }
  }

  /**
   * Feedback spécialisé pour le Quiz
   */
  showAnswerFeedback(isCorrect) {
    if (!this.feedbackElement) return;

    this._clearPreviousTimeouts();

    if (isCorrect) {
      this._handleCorrectAnswer();
    } else {
      this._handleIncorrectAnswer();
    }
  }

  /**
   * Nettoie les timeouts précédents
   */
  _clearPreviousTimeouts() {
    if (this.feedbackTimeoutId) {
      clearTimeout(this.feedbackTimeoutId);
      this.feedbackTimeoutId = null;
    }
    if (this.feedbackIntervalId) {
      clearInterval(this.feedbackIntervalId);
      this.feedbackIntervalId = null;
    }
  }

  /**
   * Gère le feedback pour une réponse correcte
   */
  _handleCorrectAnswer() {
    const points = this.calculatePoints();
    const message = this._getCorrectAnswerMessage(points);

    // Audio feedback pour réponse correcte
    playSound('good');
    speak(getTranslation('correct'));

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
      showFeedback(this.feedbackElement.id, message, 'success', true);
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
   * Gère le feedback pour une réponse incorrecte
   */
  _handleIncorrectAnswer() {
    this.errors++;

    const message = this._getIncorrectAnswerMessage();

    // Audio feedback pour réponse incorrecte
    playSound('bad');
    speak(getTranslation('incorrect'));

    this._displayIncorrectFeedback(message);
    this._setupContinueButton();
  }

  /**
   * Génère le message pour une réponse incorrecte
   */
  _getIncorrectAnswerMessage() {
    const correctAnswer = this.state.currentQuestion.answer;

    if (this.state.currentQuestion.type === 'true_false') {
      return correctAnswer === true
        ? getTranslation('incorrect_answer_was_true')
        : getTranslation('incorrect_answer_was_false');
    } else {
      return getTranslation('feedback_incorrect', { correctAnswer });
    }
  }

  /**
   * Affiche le feedback complexe pour une réponse incorrecte
   */
  _displayIncorrectFeedback(message) {
    const { table, num } = this.state.currentQuestion;
    const hintText = this._getHintText(table);
    const numberLineText = this.generateNumberLineText(
      table,
      num,
      this.state.currentQuestion.answer
    );

    setSafeComplexFeedback(this.feedbackElement, message, hintText, numberLineText);
  }

  /**
   * Récupère le texte d'astuce pour une table
   */
  _getHintText(table) {
    const t = getTranslation(`mnemonic_${table}`);
    if (typeof t !== 'string' || (t.startsWith('[') && t.endsWith(']'))) {
      return '';
    }
    return t;
  }

  /**
   * Configure le bouton Continuer avec timer
   */
  _setupContinueButton() {
    this._autoWas = this.config.autoProgress;
    this.config.autoProgress = false;
    this.showContinueWithTimer(5);
  }

  /**
   * Logique spécifique après soumission de réponse
   */
  onAnswerSubmitted(isCorrect, userAnswer) {
    // Enregistrer dans l'historique utilisateur
    const userData = UserState.getCurrentUserData();
    if (!userData.progressHistory) userData.progressHistory = [];

    const { table, num } = this.state.currentQuestion;
    userData.progressHistory.push({
      question: `${table} × ${num} = ?`,
      correct: isCorrect,
      timestamp: Date.now(),
      mode: 'quiz',
      userAnswer: userAnswer,
      correctAnswer: this.state.currentQuestion.answer,
    });

    // Sauvegarder immédiatement
    const userData2 = UserState.getCurrentUserData();
    UserState.updateUserData(userData2);

    // Mettre à jour le défi quotidien
    updateDailyChallengeProgress(table, num);
  }

  /**
   * Génère et affiche une astuce pour la question courante
   */
  renderHint() {
    const hintBox = document.getElementById('quiz-hint');
    const hintText = document.getElementById('quiz-hint-text');
    if (!hintBox || !hintText || !this.state.currentQuestion) return;

    const { table, num } = this.state.currentQuestion;
    // Utiliser les mnémoniques existants (même sources que l'ancien quiz)
    // Clé: mnemonic_<table>
    let text = getTranslation(`mnemonic_${table}`);
    if (typeof text !== 'string' || (text.startsWith('[') && text.endsWith(']'))) {
      // Fallback minimal si traduction manquante
      text = `${table} × ${num} = ${table * num}`;
    }

    hintText.textContent = text;
    hintBox.style.display = 'block';
    hintBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Affiche un bouton Continuer avec compte à rebours avant passage auto
   * @param {number} seconds
   */
  showContinueWithTimer(seconds = 5) {
    const box = document.getElementById('quiz-continue');
    const btn = document.getElementById('quiz-continue-btn');
    const timerEl = document.getElementById('quiz-continue-timer');
    if (!box || !btn || !timerEl) return;

    // Assainir tout timer précédent
    if (this.feedbackIntervalId) {
      clearInterval(this.feedbackIntervalId);
      this.feedbackIntervalId = null;
    }
    if (this.feedbackTimeoutId) {
      clearTimeout(this.feedbackTimeoutId);
      this.feedbackTimeoutId = null;
    }

    let remaining = Math.max(1, seconds);
    const render = () => {
      btn.textContent = `${getTranslation('continue')}`;
      timerEl.textContent = `(${remaining})`;
    };
    render();

    box.style.display = 'block';
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const proceed = () => {
      // Nettoyage
      if (this.feedbackIntervalId) {
        clearInterval(this.feedbackIntervalId);
        this.feedbackIntervalId = null;
      }
      if (this.feedbackTimeoutId) {
        clearTimeout(this.feedbackTimeoutId);
        this.feedbackTimeoutId = null;
      }
      box.style.display = 'none';
      const hintBox = document.getElementById('quiz-hint');
      if (hintBox) hintBox.style.display = 'none';

      // Restaurer l'auto-advance par défaut
      if (typeof this._autoWas === 'boolean') {
        this.config.autoProgress = this._autoWas;
        delete this._autoWas;
      }

      // Avancer
      if (this.shouldContinue()) {
        this.generateQuestion();
      } else {
        this.finish();
      }
    };

    btn.onclick = e => {
      e.preventDefault();
      proceed();
    };

    this.feedbackIntervalId = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        proceed();
      } else {
        render();
      }
    }, 1000);
  }

  /**
   * Version texte sécurisée de la ligne numérique
   */
  generateNumberLineText(table, multiplicand, correctAnswer) {
    if (typeof correctAnswer === 'boolean' || this.state.currentQuestion.type === 'gap') return '';
    return (
      getTranslation('number_line_explanation', { table, multiplicand, result: correctAnswer }) ||
      `${table} × ${multiplicand} = ${correctAnswer}`
    );
  }

  /**
   * Génère le HTML d'une ligne numérique animée (héritée de l'ancien quiz)
   */
  generateNumberLineHTML(table, multiplicand, correctAnswer) {
    if (typeof correctAnswer === 'boolean' || this.state.currentQuestion.type === 'gap') return '';

    let html = '<div class="feedback-number-line-container">';
    html += `<h4 data-translate="number_line_feedback_title" data-translate-params='{"table": ${table}, "multiplicand": ${multiplicand}}'>${getTranslation('number_line_feedback_title', { table, multiplicand })}</h4>`;
    html += '<div class="feedback-number-line">';
    const maxResult = Math.max(correctAnswer, table * 10);
    const step = Math.ceil(maxResult / 10);
    html += '<div class="line"></div>';

    for (let i = 0; i <= maxResult; i += step) {
      if (i < correctAnswer && i + step > correctAnswer && correctAnswer % step !== 0) {
        const pos = (correctAnswer / maxResult) * 100;
        html += `<div class="tick" style="left: ${pos}%"><span class="label">${correctAnswer}</span></div>`;
      }
      const pos = (i / maxResult) * 100;
      if (i > 0 || step === 1) {
        html += `<div class="tick" style="left: ${pos}%"><span class="label">${i}</span></div>`;
      }
    }
    if (maxResult % step !== 0 && Math.floor(maxResult / step) * step !== maxResult) {
      html += `<div class="tick" style="left: 100%"><span class="label">${maxResult}</span></div>`;
    }
    html += `<div class="tick" style="left: 0%"><span class="label">0</span></div>`;

    for (let i = 1; i <= multiplicand; i++) {
      const startPercent = (((i - 1) * table) / maxResult) * 100;
      const widthPercent = (table / maxResult) * 100;
      const arcHeight = 10 + i * 1.5;
      const effectiveWidthPercent = Math.min(widthPercent, 100 - startPercent);
      if (effectiveWidthPercent > 0.1) {
        const delay = (i - 1) * 0.1;
        html += `<div class="arc" style="left: ${startPercent}%; width: ${effectiveWidthPercent}%; height: ${arcHeight}px; animation-delay: ${delay}s;">`;
        if (widthPercent > 5) {
          html += `<span class="arc-label">+${table}</span>`;
        }
        html += `</div>`;
      }
    }

    html += '</div></div>';
    return html;
  }

  /**
   * Nettoie l'UI contextuelle après génération de question
   */
  onQuestionGenerated() {
    const hintBox = document.getElementById('quiz-hint');
    const contBox = document.getElementById('quiz-continue');
    if (hintBox) hintBox.style.display = 'none';
    if (contBox) contBox.style.display = 'none';

    // Synthèse vocale de la question (ne jamais révéler la bonne réponse)
    if (this.state.currentQuestion) {
      const { table, num, type, question } = this.state.currentQuestion;

      if (type === 'true_false') {
        // Lire exactement l'énoncé affiché (ex: "8 × 6 = 47")
        const spoken = String(question).replace(/×/g, ' fois ').replace(/=/g, ' égale ');
        speak(spoken);
      } else if (type === 'gap') {
        // Pour "2 × ? = 18", ne dire que la partie connue
        speak(`${table} fois`);
      } else {
        // Pour classic, mcq, problem: lire l'énoncé sans donner la réponse
        // Préfère l'énoncé si disponible, sinon fallback simple
        const spoken = (question ? String(question) : `${table} × ${num} = ?`)
          .replace(/×/g, ' fois ')
          .replace(/=/g, ' égale ');
        speak(spoken);
      }
    }
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
      excludedTables: [...this.excludeTables],
    });

    // Garder seulement les 20 derniers résultats
    userData.quizStats.history = userData.quizStats.history.slice(-20);

    // Mettre à jour les records
    userData.quizStats.bestScore = Math.max(userData.quizStats.bestScore || 0, this.state.score);
    userData.quizStats.totalQuizzes = (userData.quizStats.totalQuizzes || 0) + 1;

    // Vérifier les badges
    checkAndUnlockBadge('quiz_starter');
    if (successRate === 100 && this.state.questionCount >= 10) {
      checkAndUnlockBadge('perfect_quiz');
    }

    // Sauvegarder
    UserState.updateUserData(userData);

    console.log('💾 Résultats Quiz sauvegardés:', {
      score: this.state.score,
      successRate: successRate,
      streak: this.state.streak,
    });
  }

  /**
   * Afficher les résultats du Quiz
   */
  showResults() {
    goToSlide(5);

    const successRate =
      this.state.questionCount > 0
        ? Math.round((this.state.correctAnswers / this.state.questionCount) * 100)
        : 0;

    // Déterminer le message de félicitations
    let message;
    if (successRate >= 90) {
      message = getTranslation('excellent');
    } else if (successRate >= 75) {
      message = getTranslation('very_good');
    } else if (successRate >= 60) {
      message = getTranslation('good_job');
    } else {
      message = getTranslation('keep_practicing');
    }

    // Afficher les résultats
    const resultsScreen = document.getElementById('results');
    if (resultsScreen) {
      resultsScreen.textContent = '';
      const container = document.createElement('div');
      container.className = 'results-container content-card';
      container.setAttribute('role', 'main');
      container.setAttribute('aria-label', getTranslation('quiz_results'));

      const h2 = createSafeElement('h2', getTranslation('quiz_results'));
      container.appendChild(h2);

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

      const msg = createSafeElement('div', message, { class: 'message-box' });
      container.appendChild(msg);

      const btnRow = document.createElement('div');
      btnRow.className = 'button-row';
      const btn = createSafeElement('button', getTranslation('play_again'), {
        class: 'btn btn-primary',
        'data-action': 'play-again',
        'aria-label': getTranslation('play_again'),
      });
      btn.addEventListener('click', e => {
        e.preventDefault();
        setGameMode('quiz').catch(e2 => {
          console.warn('setGameMode failed', e2);
        });
      });
      btnRow.appendChild(btn);
      container.appendChild(btnRow);

      resultsScreen.appendChild(container);
    }
  }

  /**
   * Nettoyage spécifique au Quiz
   */
  cleanup() {
    super.cleanup();

    // Nettoyer les timeouts spécifiques
    if (this.feedbackTimeoutId) {
      clearTimeout(this.feedbackTimeoutId);
      this.feedbackTimeoutId = null;
    }
    if (this.feedbackIntervalId) {
      clearInterval(this.feedbackIntervalId);
      this.feedbackIntervalId = null;
    }
  }

  /**
   * Fonction pour rafraîchir les textes après changement de langue
   */
  refreshTexts() {
    const toggle = document.getElementById('quiz-filter-toggle');
    if (toggle) toggle.textContent = getTranslation('quiz_filter_toggle');

    const info = document.querySelector('#quiz-filter .filter-info');
    if (info) info.textContent = getTranslation('quiz_filter_info');

    const title = document.querySelector('#quiz-filter h3');
    if (title) title.textContent = getTranslation('exclude_tables_title');

    this.updateExclusionMessage();
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
