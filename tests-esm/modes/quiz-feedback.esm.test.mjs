/* eslint-env jest, node */
/**
 * Mode Quiz : une erreur est une étape.
 * - la bonne tuile est cochée, le choix de l'enfant reste enfoncé ;
 * - l'explication reste affichée et « Continuer » attend l'enfant (aucun compte à rebours) ;
 * - une double activation (Entrée déclenche deux clics) n'avance et n'enregistre qu'une fois ;
 * - l'écran de fin est une phrase « 7 bonnes réponses sur 10 », sans pourcentage.
 */
import { describe, test, expect, beforeAll, beforeEach, afterEach, jest } from '@jest/globals';

const userStore = { preferredOperator: '×', progressHistory: [] };
jest.unstable_mockModule('../../js/core/userState.js', () => ({
  UserState: {
    getCurrentUserData: () => userStore,
    updateUserData: u => Object.assign(userStore, u),
  },
}));
jest.unstable_mockModule('../../js/slides.js', () => ({
  goToSlide: jest.fn(),
  showSlide: jest.fn(),
  hideAllSlides: jest.fn(),
  nextSlide: jest.fn(),
  prevSlide: jest.fn(),
}));
jest.unstable_mockModule('../../js/mode-orchestrator.js', () => ({
  getStartingMode: () => null,
  setStartingMode: jest.fn(),
  setGameMode: jest.fn(async () => {}),
}));

const store = await import('../../js/i18n-store.js');
const { AudioManager } = await import('../../js/core/audio.js');
const { QuizMode } = await import('../../js/modes/QuizMode.js');
const { setSafeComplexFeedback } = await import('../../js/security-utils.js');
const { formatCorrectCount } = await import('../../js/ui-feedback.js');

// Traductions de test : la valeur rend visible la clé et ses paramètres
const TRANSLATIONS = {
  quiz_mode: 'Mode Quiz',
  continue: 'Continuer',
  abandon_quiz_button: 'Abandonner',
  incorrect: 'Presque !',
  feedback_incorrect: 'La bonne réponse est {correctAnswer}.',
  feedback_correct: 'Correct ! +{points} points',
  feedback_count_by: 'Compter par {step} :',
  hint: 'Indice',
  mnemonic_6: 'Astuce de la table de 6',
  results_correct_count: '{correct} bonnes réponses sur {total}',
  results_correct_count_one: '{correct} bonne réponse sur {total}',
  results_no_answer: 'Aucune réponse cette fois.',
  results_score: 'Score : {score}',
  results_best_streak: 'Meilleure série : {streak}',
  quiz_results: 'Résultats du Quiz',
  keep_practicing: "Continue de t'entraîner !",
  play_again: 'Rejouer',
  back_to_home: "Retour à l'accueil",
};

/** Question connue : 6 × 7 = ? (réponse 42) */
function showKnownQuestion(quiz) {
  quiz.state.currentQuestion = {
    question: '6 × 7 = ?',
    answer: 42,
    type: 'mcq',
    operator: '×',
    a: 6,
    b: 7,
    table: 6,
    num: 7,
  };
  quiz.displayQuestion();
  quiz.onQuestionGenerated();
}

function options() {
  return [...document.querySelectorAll('#quiz-options .option')];
}

async function startQuiz() {
  const quiz = new QuizMode();
  await quiz.start();
  showKnownQuestion(quiz);
  return quiz;
}

beforeAll(() => {
  store.setTranslations(TRANSLATIONS);
  store.setCurrentLanguage('fr');
});

beforeEach(() => {
  document.body.innerHTML = '<div id="game"></div><div id="results"></div>';
  userStore.progressHistory = [];
  userStore.quizStats = undefined;
  jest.spyOn(AudioManager, 'playSound').mockImplementation(() => {});
  // jsdom n'a pas de synthèse vocale : on tait ses avertissements
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('Quiz : retour sur erreur', () => {
  test('« Abandonner » et « Continuer » suivent la zone de réponse', async () => {
    await startQuiz();
    const container = document.querySelector('.quiz-container');
    const order = [...container.children].map(el => el.id || el.className);
    expect(order.indexOf('quiz-options')).toBeLessThan(order.indexOf('quiz-continue'));
    expect(order.indexOf('quiz-continue')).toBeLessThan(order.indexOf('quiz-actions'));
    expect(document.getElementById('quiz-abandon').className).toContain('btn-quiet');
  });

  test('coche la bonne tuile, garde le choix enfoncé, sans son d’alerte', async () => {
    await startQuiz();
    const wrong = options().find(b => b.dataset.value !== '42');
    wrong.click();

    const correct = options().find(b => b.dataset.value === '42');
    expect(correct.classList.contains('is-correct')).toBe(true);
    expect(correct.querySelector('svg.option-mark')).not.toBeNull();
    expect(wrong.classList.contains('is-chosen-wrong')).toBe(true);
    expect(AudioManager.playSound).not.toHaveBeenCalledWith('bad');

    const panel = document.querySelector('#quiz-feedback .feedback-explain');
    expect(panel).not.toBeNull();
    expect(panel.querySelector('.feedback-lead').textContent).toBe('Presque !');
    expect(panel.querySelector('.feedback-answer').textContent).toBe('La bonne réponse est 42.');
    const steps = [...panel.querySelectorAll('.feedback-count-step')].map(s => s.textContent);
    expect(steps).toEqual(['6', '12', '18', '24', '30', '36', '42']);
  });

  test('aucun compte à rebours : l’explication reste jusqu’à « Continuer »', async () => {
    const quiz = await startQuiz();
    options()
      .find(b => b.dataset.value !== '42')
      .click();

    const box = document.getElementById('quiz-continue');
    expect(box.hidden).toBe(false);
    expect(box.textContent).not.toMatch(/\(\d+\)/);

    jest.advanceTimersByTime(30000);

    expect(quiz.state.currentQuestion.answer).toBe(42);
    expect(document.querySelector('#quiz-feedback .feedback-explain')).not.toBeNull();
    expect(box.hidden).toBe(false);
    expect(quiz.state.questionCount).toBe(1);
    // La barre d'infos dit où en est la partie
    expect(document.getElementById('info-progress').textContent).toBe('1/10');
  });

  test('« Continuer » passe à la question suivante une seule fois', async () => {
    const quiz = await startQuiz();
    options()
      .find(b => b.dataset.value !== '42')
      .click();

    const spy = jest.spyOn(quiz, 'generateQuestion');
    const btn = document.getElementById('quiz-continue-btn');
    btn.click();
    btn.click();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(document.getElementById('quiz-continue').hidden).toBe(true);
    expect(quiz.config.autoProgress).toBe(true);
  });

  test('le focus va sur « Continuer » après l’événement en cours', async () => {
    await startQuiz();
    options()
      .find(b => b.dataset.value !== '42')
      .click();

    const btn = document.getElementById('quiz-continue-btn');
    expect(document.activeElement).not.toBe(btn);
    jest.advanceTimersByTime(0);
    expect(document.activeElement).toBe(btn);
    expect(btn.getAttribute('aria-describedby')).toBe('quiz-feedback');
  });
});

describe('Quiz : bonne réponse', () => {
  test('coche la tuile et avance seule après 1,2 s', async () => {
    const quiz = await startQuiz();
    const spy = jest.spyOn(quiz, 'generateQuestion');
    const correct = options().find(b => b.dataset.value === '42');
    correct.click();

    expect(correct.classList.contains('is-correct')).toBe(true);
    expect(document.getElementById('quiz-continue').hidden).toBe(true);
    expect(spy).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1300);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('Quiz : écran de fin', () => {
  test('dernière question : une double activation n’enregistre le résultat qu’une fois', async () => {
    const quiz = await startQuiz();
    quiz.state.questionCount = 9;
    quiz.state.correctAnswers = 7;
    const saveSpy = jest.spyOn(quiz, 'saveResults');

    options()
      .find(b => b.dataset.value !== '42')
      .click();
    const btn = document.getElementById('quiz-continue-btn');
    btn.click();
    btn.click();

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(userStore.quizStats.history).toHaveLength(1);
  });

  test('une phrase principale, une ligne secondaire, aucun pourcentage', async () => {
    const quiz = await startQuiz();
    quiz.state.questionCount = 10;
    quiz.state.correctAnswers = 7;
    quiz.state.score = 85;
    quiz.sessionBestStreak = 4;
    quiz.showResults();

    const results = document.getElementById('results');
    expect(results.querySelector('.results-lead').textContent).toBe('7 bonnes réponses sur 10');
    expect(results.querySelector('.stats-grid')).toBeNull();
    expect(results.textContent).not.toContain('%');
    const details = [...results.querySelectorAll('.results-details span')].map(s => s.textContent);
    expect(details).toEqual(['Score : 85', 'Meilleure série : 4']);
    const buttons = [...results.querySelectorAll('.results-actions button')];
    expect(buttons.map(b => b.className)).toEqual(['btn', 'btn btn-secondary']);
  });
});

describe('Explication (setSafeComplexFeedback)', () => {
  test('panneau calme en texte : mot d’accueil, réponse, comptage puis astuce', () => {
    const el = document.createElement('div');
    setSafeComplexFeedback(el, 'La bonne réponse est 12.', 'Double le nombre', '', {
      lead: 'Presque !',
      countBy: { label: 'Compter par 2 :', steps: [2, 4, 6, 8, 10, 12] },
    });

    const panel = el.firstElementChild;
    expect(panel.className).toBe('feedback-error feedback-explain');
    expect([...panel.children].map(c => c.className)).toEqual([
      'feedback-lead',
      'feedback-answer',
      'feedback-count',
      'quiz-hint-inline',
    ]);
    expect(el.querySelector('[style]')).toBeNull();
    expect(el.querySelectorAll('.feedback-count-arrow[aria-hidden="true"]')).toHaveLength(5);
  });

  test('reste compatible avec l’ancienne signature (message, astuce, texte)', () => {
    const el = document.createElement('div');
    setSafeComplexFeedback(el, 'Message', '', 'Ligne complémentaire');
    expect(el.querySelector('.feedback-answer').textContent).toBe('Message');
    expect(el.querySelector('.feedback-extra').textContent).toBe('Ligne complémentaire');
    expect(el.querySelector('.feedback-lead')).toBeNull();
  });
});

describe('Phrase de fin : accord selon la langue', () => {
  test('français : 0 et 1 au singulier', () => {
    store.setCurrentLanguage('fr');
    expect(formatCorrectCount(0, 10)).toBe('0 bonne réponse sur 10');
    expect(formatCorrectCount(1, 10)).toBe('1 bonne réponse sur 10');
    expect(formatCorrectCount(7, 10)).toBe('7 bonnes réponses sur 10');
  });

  test('anglais : 0 au pluriel', () => {
    store.setCurrentLanguage('en');
    expect(formatCorrectCount(0, 10)).toBe('0 bonnes réponses sur 10');
    store.setCurrentLanguage('fr');
  });

  test('aucune question : une phrase dédiée', () => {
    expect(formatCorrectCount(0, 0)).toBe('Aucune réponse cette fois.');
  });
});
