/**
 * Classe de base pour tous les modes de jeu LeapMultix
 * Phase 5.1 - Refactorisation des modes de jeu
 *
 * Centralise les patterns communs :
 * - Initialisation et nettoyage
 * - Gestion du score et des statistiques
 * - Génération et validation des questions
 * - Feedback et résultats
 * - Interface avec InfoBar et utils
 */

import {
  speak,
  getTranslation,
  showFeedback,
  updateInfoBar as _updateInfoBar,
  addArrowKeyNavigation as _addArrowKeyNavigation,
} from '../utils-es6.js';
import { recordOperationResult } from './operation-stats.js';
import { UserState } from './userState.js';
import { goToSlide } from '../slides.js';
import { AudioManager } from './audio.js';
import { InfoBar } from '../components/infoBar.js';
import { generateQuestion } from '../questionGenerator.js';
import { gameState } from '../game.js';

export class GameMode {
  /**
   * Fonction constructor
   * @param {*} modeName - Description du paramètre
   * @param {*} config - Description du paramètre
   */
  constructor(modeName, config = {}) {
    this.modeName = modeName;
    this.config = {
      // Configuration par défaut
      maxQuestions: 10,
      hasTimer: false,
      hasLives: false,
      hasStreaks: true,
      autoProgress: true,
      showScore: true,
      ...config,
    };

    // État du jeu
    this.state = {
      score: 0,
      streak: 0,
      questionCount: 0,
      correctAnswers: 0,
      isActive: false,
      currentQuestion: null,
      timeLeft: null,
      lives: null,
    };

    // Timers et intervalles
    this.timers = new Set();
    this.intervals = new Set();

    // Éléments DOM
    this.gameScreen = null;
    this.questionElement = null;
    this.optionsElement = null;
    this.feedbackElement = null;
  }

  /**
   * Démarrer le mode de jeu
   */
  async start() {
    try {
      // Navigation vers l'écran de jeu
      goToSlide(4);
      gameState.gameMode = this.modeName;

      // Réinitialiser l'état
      this.resetState();

      // Annonce vocale
      const translationKey = this.modeName + '_mode';
      const translatedText = getTranslation(translationKey);
      speak(translatedText, { priority: 'high' });

      // Initialiser l'interface
      await this.initializeUI();

      // Marquer actif AVANT la logique spécifique pour permettre generateQuestion() etc.
      this.state.isActive = true;

      // Démarrer la logique spécifique
      await this.onStart();
    } catch (error) {
      console.error(`❌ Erreur lors du démarrage de ${this.modeName}:`, error);
      this.handleError(error);
    }
  }

  /**
   * Arrêter le mode de jeu
   */
  stop() {
    this.state.isActive = false;

    // Arrêter la synthèse vocale et les sons en cours
    const Root =
      typeof globalThis !== 'undefined'
        ? globalThis
        : typeof window !== 'undefined'
          ? window
          : undefined;
    if (Root && 'speechSynthesis' in Root) {
      Root.speechSynthesis.cancel();
    }
    if (AudioManager && typeof AudioManager.stopAll === 'function') {
      AudioManager.stopAll();
    }

    // Nettoyer les timers et intervalles
    this.cleanup();

    // Logique spécifique d'arrêt
    this.onStop();
  }

  /**
   * Réinitialiser l'état du jeu
   */
  resetState() {
    this.state = {
      score: 0,
      streak: 0,
      questionCount: 0,
      correctAnswers: 0,
      isActive: false,
      currentQuestion: null,
      timeLeft: this.config.hasTimer ? this.config.initialTime : null,
      lives: this.config.hasLives ? this.config.initialLives : null,
    };

    /**
     * Fonction if
     * @param {*} window.gameState - Description du paramètre
     * @returns {*} Description du retour
     */
    gameState.streak = 0;
  }

  /**
   * Initialiser l'interface utilisateur de base
   */
  async initializeUI() {
    this._setupGameScreen();
    await this._setupInfoBar();
    const container = this._createMainContainer();
    await this._addCustomContent(container);
    this._createGameElements(container);
    this._finalizeUI(container);
  }

  /**
   * Configure l'écran de jeu principal
   */
  _setupGameScreen() {
    this.gameScreen = document.getElementById('game');
    if (!this.gameScreen) {
      throw new Error('Conteneur #game non trouvé !');
    }
    // eslint-disable-next-line no-restricted-properties -- Safe: clearing with empty string, no injection risk
    this.gameScreen.innerHTML = '';
  }

  /**
   * Configure la barre d'information
   */
  async _setupInfoBar() {
    const infoBarData = this.getInfoBarData();
    if (infoBarData === null || infoBarData === undefined) return;

    const infoBarOptions = { ariaLabel: getTranslation(this.modeName + '_info_bar_label') };
    this._injectInfoBar(infoBarData, infoBarOptions);
  }

  /**
   * Injecte la barre d'information avec fallback
   */
  _injectInfoBar(infoBarData, infoBarOptions) {
    try {
      InfoBar.inject('game', this.modeName, infoBarData, infoBarOptions);
    } catch {
      this._createInfoBarFallback(infoBarData, infoBarOptions);
    }
  }

  /**
   * Crée la barre d'information en fallback
   */
  _createInfoBarFallback(infoBarData, infoBarOptions) {
    try {
      const el = InfoBar.createElement(this.modeName, infoBarData, infoBarOptions);
      this.gameScreen.appendChild(el);
    } catch {
      /* no-op */
    }
  }

  /**
   * Crée le conteneur principal
   */
  _createMainContainer() {
    const card = document.createElement('div');
    card.className = 'content-card';
    const container = document.createElement('div');
    container.className = `${this.modeName}-container`;
    container.setAttribute('role', 'main');
    container.setAttribute('aria-label', getTranslation(this.modeName + '_mode'));

    const title = document.createElement('h2');
    title.textContent = getTranslation(this.modeName + '_mode');
    container.appendChild(title);

    return { card, container };
  }

  /**
   * Ajoute le contenu personnalisé
   */
  async _addCustomContent(containerData) {
    const custom = await this.getCustomHTML();
    if (!custom) return;

    const customWrap = document.createElement('div');
    await this._processCustomContent(custom, customWrap);
    containerData.container.appendChild(customWrap);
  }

  /**
   * Traite le contenu personnalisé de façon sécurisée
   */
  async _processCustomContent(custom, customWrap) {
    try {
      const { sanitizeHtmlToFragment } = await import('../security-utils.js');
      if (typeof custom === 'string' && custom) {
        const frag = sanitizeHtmlToFragment(custom);
        customWrap.appendChild(frag);
      } else if (custom !== null && typeof custom === 'object' && 'nodeType' in Object(custom)) {
        customWrap.appendChild(custom);
      }
    } catch {
      const text = document.createTextNode(typeof custom === 'string' ? custom : '');
      customWrap.appendChild(text);
    }
  }

  /**
   * Crée les éléments de jeu
   */
  _createGameElements(containerData) {
    const q = this._createElement('question', 'question_label');
    const opt = this._createElement('options', 'options_label');
    const fb = this._createFeedbackElement();

    containerData.container.appendChild(q);
    containerData.container.appendChild(opt);
    containerData.container.appendChild(fb);

    this.questionElement = q;
    this.optionsElement = opt;
    this.feedbackElement = fb;
  }

  /**
   * Crée un élément avec ID et rôle
   */
  _createElement(type, labelKey) {
    const element = document.createElement('div');
    element.id = `${this.modeName}-${type}`;
    element.className = `${type} ${this.modeName}-${type}`;
    element.setAttribute('role', 'region');
    element.setAttribute('aria-label', getTranslation(labelKey));
    return element;
  }

  /**
   * Crée l'élément de feedback
   */
  _createFeedbackElement() {
    const fb = document.createElement('div');
    fb.id = `${this.modeName}-feedback`;
    fb.className = `feedback ${this.modeName}-feedback`;
    fb.setAttribute('aria-live', 'polite');
    return fb;
  }

  /**
   * Finalise l'interface utilisateur
   */
  _finalizeUI(containerData) {
    containerData.card.appendChild(containerData.container);
    this.gameScreen.appendChild(containerData.card);
  }

  /**
   * Générer une nouvelle question
   */
  generateQuestion() {
    if (!this.state.isActive) return;

    try {
      // Utiliser la logique spécifique ou celle par défaut
      const questionOptions = this.getQuestionOptions();
      this.state.currentQuestion = generateQuestion(questionOptions);

      this.displayQuestion();
      this.onQuestionGenerated();
    } catch (error) {
      console.error(`❌ Erreur lors de la génération de question:`, error);
      this.handleError(error);
    }
  }

  /**
   * Afficher la question courante
   */
  displayQuestion() {
    if (!this.state.currentQuestion || !this.questionElement) return;

    // Afficher la question
    this.questionElement.textContent = this.state.currentQuestion.question;

    // Générer les options
    this.displayOptions();

    // Réinitialiser le feedback
    /**
     * Fonction if
     * @param {*} this.feedbackElement - Description du paramètre
     * @returns {*} Description du retour
     */
    if (this.feedbackElement) {
      this.feedbackElement.textContent = '';
    }
  }

  /**
   * Afficher les options de réponse
   */
  displayOptions() {
    if (!this.optionsElement || !this.state.currentQuestion) return;

    this.optionsElement.textContent = '';

    const options = this.generateOptions();

    options.forEach(option => {
      const button = document.createElement('button');
      button.className = 'option';
      // Appliquer style spécifique par mode si nécessaire (ex: adventure)
      if (this.modeName === 'adventure') {
        button.classList.add('option-btn');
      }
      button.dataset.value = option.value;
      button.textContent = option.display;
      button.onclick = () => this.handleAnswer(option.value);

      // Ajouter support clavier
      button.setAttribute('tabindex', '0');
      button.addEventListener('keydown', e => {
        /**
         * Fonction if
         * @param {*} e.key - Description du paramètre
         * @returns {*} Description du retour
         */
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleAnswer(option.value);
        }
      });

      this.optionsElement.appendChild(button);
    });

    // Ajouter navigation clavier
    this.addKeyboardNavigation();
  }

  /**
   * Traiter une réponse utilisateur
   */
  handleAnswer(userAnswer) {
    if (!this.state.isActive || !this.state.currentQuestion) return;

    // Désactiver les boutons
    this.disableOptions();

    const isCorrect = userAnswer === this.state.currentQuestion.answer;

    // Mettre à jour les statistiques
    this.updateStats(isCorrect);

    // Enregistrer la réponse
    this.recordAnswer(isCorrect);

    // Afficher le feedback
    this.showAnswerFeedback(isCorrect, userAnswer);

    // Logique spécifique
    this.onAnswerSubmitted(isCorrect, userAnswer);

    // Progression automatique ou manuelle
    /**
     * Fonction if
     * @param {*} this.config.autoProgress - Description du paramètre
     * @returns {*} Description du retour
     */
    if (this.config.autoProgress) {
      this.scheduleNextQuestion();
    }
  }

  /**
   * Mettre à jour les statistiques
   */
  updateStats(isCorrect) {
    this.state.questionCount++;

    /**
     * Fonction if
     * @param {*} isCorrect - Description du paramètre
     * @returns {*} Description du retour
     */
    if (isCorrect) {
      this.state.correctAnswers++;
      this.state.streak++;
      try {
        gameState.streak = this.state.streak;
      } catch {
        // Ignore gameState update errors
      }

      try {
        const userData = UserState.getCurrentUserData();
        const currentBest = Number(userData.bestStreak) || 0;
        if (this.state.streak > currentBest) {
          userData.bestStreak = this.state.streak;
          UserState.updateUserData(userData);
        }
      } catch {
        // Ignore gameState update errors
      }

      // Calcul du score
      const points = this.calculatePoints();
      this.state.score += points;
    } else {
      this.state.streak = 0;
      try {
        gameState.streak = 0;
      } catch {
        // Ignore gameState update errors
      }

      // Gestion des vies
      /**
       * Fonction if
       * @param {*} this.config.hasLives - Description du paramètre
       * @returns {*} Description du retour
       */
      if (this.config.hasLives && this.state.lives > 0) {
        this.state.lives--;
      }
    }

    // Mettre à jour l'affichage
    this.updateInfoBar();
  }

  /**
   * Calculer les points pour une réponse correcte
   */
  calculatePoints() {
    let points = 10; // Points de base

    // Bonus de série
    if (this.state.streak >= 5) points = 20;
    else if (this.state.streak >= 3) points = 15;

    return points;
  }

  /**
   * Afficher le feedback de réponse
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
      // Effet sonore de réussite
      try {
        AudioManager.playSound('good');
      } catch {
        // Ignore gameState update errors
      }
      const points = this.calculatePoints();
      const message =
        this.state.streak >= 3
          ? getTranslation('feedback_correct_streak', { points, streak: this.state.streak })
          : getTranslation('feedback_correct', { points });

      showFeedback(this.feedbackElement.id, message, 'success', true);
    } else {
      // Effet sonore d'erreur
      try {
        AudioManager.playSound('bad');
      } catch {
        // Ignore gameState update errors
      }
      const message = getTranslation('feedback_incorrect', { correctAnswer });
      showFeedback(this.feedbackElement.id, message, 'error', true);
    }
  }

  /**
   * Programmer la prochaine question
   */
  scheduleNextQuestion() {
    const delay = 1200; // Délai standard

    const timer = setTimeout(() => {
      this.timers.delete(timer);

      if (this.shouldContinue()) {
        this.generateQuestion();
      } else {
        this.finish();
      }
    }, delay);

    this.timers.add(timer);
  }

  /**
   * Vérifier si le jeu doit continuer
   */
  shouldContinue() {
    // Limite de questions atteinte
    if (this.state.questionCount >= this.config.maxQuestions) {
      return false;
    }

    // Vies épuisées
    /**
     * Fonction if
     * @param {*} this.config.hasLives - Description du paramètre
     * @returns {*} Description du retour
     */
    if (this.config.hasLives && this.state.lives <= 0) {
      return false;
    }

    // Temps écoulé
    /**
     * Fonction if
     * @param {*} this.config.hasTimer - Description du paramètre
     * @returns {*} Description du retour
     */
    if (this.config.hasTimer && this.state.timeLeft <= 0) {
      return false;
    }

    return true;
  }

  /**
   * Terminer le mode de jeu
   */
  finish() {
    this.state.isActive = false;

    // Sauvegarder les résultats
    this.saveResults();

    // Nettoyer les ressources avant d'afficher les résultats
    this.cleanup();

    // Afficher les résultats
    this.showResults();

    // Logique spécifique de fin
    this.onFinish();
  }

  /**
   * Nettoyer les ressources
   */
  cleanup() {
    // Nettoyer les timers
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();

    // Nettoyer les intervalles
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
  }

  /**
   * Mettre à jour la barre d'information
   */
  updateInfoBar() {
    _updateInfoBar(this.getInfoBarData(), this.modeName);
  }

  /**
   * Obtenir les données pour la barre d'information
   */
  getInfoBarData() {
    const data = {};

    if (this.config.showScore) data.score = this.state.score;
    if (this.config.hasStreaks) data.streak = this.state.streak;
    if (this.config.hasTimer) data.time = this.state.timeLeft;
    if (this.config.hasLives) data.lives = this.state.lives;

    return data;
  }

  /**
   * Désactiver les options de réponse
   */
  disableOptions() {
    if (this.optionsElement) {
      this.optionsElement.querySelectorAll('.option').forEach(btn => {
        btn.disabled = true;
      });
    }
  }

  /**
   * Gestion d'erreur
   */
  handleError(error) {
    console.error(`❌ Erreur dans ${this.modeName}:`, error);

    /**
     * Fonction if
     * @param {*} this.feedbackElement - Description du paramètre
     * @returns {*} Description du retour
     */
    if (this.feedbackElement) {
      this.feedbackElement.textContent = getTranslation('game_error');
    }

    // Retour au menu après une erreur
    setTimeout(() => {
      goToSlide(1);
    }, 2000);
  }

  // ======================================
  // MÉTHODES À IMPLÉMENTER PAR LES SOUS-CLASSES
  // ======================================

  /**
   * Logique spécifique de démarrage (à surcharger)
   */
  async onStart() {
    // Démarrer la première question par défaut
    this.generateQuestion();
  }

  /**
   * Logique spécifique d'arrêt (à surcharger)
   */
  onStop() {
    // Implémentation par défaut vide
  }

  /**
   * HTML personnalisé pour le mode (à surcharger)
   */
  async getCustomHTML() {
    return ''; // Pas de HTML supplémentaire par défaut
  }

  /**
   * Options pour la génération de questions (à surcharger)
   */
  getQuestionOptions() {
    return {
      type: 'auto',
      minTable: 1,
      maxTable: 10,
      minNum: 1,
      maxNum: 10,
    };
  }

  /**
   * Génération des options de réponse (à surcharger)
   */
  generateOptions() {
    const correctAnswer = this.state.currentQuestion.answer;

    // QCM par défaut
    const options = [{ value: correctAnswer, display: correctAnswer }];

    // Ajouter des réponses incorrectes
    /**
     * Fonction while
     * @param {*} options.length - Description du paramètre
     * @returns {*} Description du retour
     */
    while (options.length < 4) {
      const wrong = Math.floor(Math.random() * 100) + 1;
      if (!options.some(opt => opt.value === wrong)) {
        options.push({ value: wrong, display: wrong });
      }
    }

    // Mélanger
    return options.sort(() => Math.random() - 0.5);
  }

  /**
   * Enregistrer une réponse (à surcharger pour logique spécifique)
   */
  recordAnswer(isCorrect) {
    const question = this.state.currentQuestion;

    // Support nouveau format (operator, a, b) et ancien (table, num)
    const operator = question.operator || '×';
    const a = question.a ?? question.table;
    const b = question.b ?? question.num;

    // Enregistrement stats multi-opérations
    try {
      recordOperationResult(operator, a, b, isCorrect);
    } catch {
      /* no-op: stats optional */
    }
  }

  /**
   * Ajouter navigation clavier (à surcharger si nécessaire)
   */
  addKeyboardNavigation() {
    if (_addArrowKeyNavigation && this.optionsElement) {
      _addArrowKeyNavigation(this.optionsElement, '.option');
    }
  }

  /**
   * Callback après génération de question (à surcharger)
   */
  onQuestionGenerated() {
    // Implémentation par défaut vide
  }

  /**
   * Callback après soumission de réponse (à surcharger)
   */
  onAnswerSubmitted() {
    // Implémentation par défaut vide
  }

  /**
   * Sauvegarder les résultats (à surcharger)
   */
  saveResults() {
    // Abstract method - override in subclass to save game results
  }

  /**
   * Afficher les résultats (à surcharger)
   */
  showResults() {
    goToSlide(5); // Slide de résultats par défaut
  }

  /**
   * Callback de fin de jeu (à surcharger)
   */
  onFinish() {
    // Implémentation par défaut vide
  }
}

// Export ES6 complet
export default GameMode;
