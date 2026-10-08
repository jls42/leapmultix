/* eslint-env jest, node */
/**
 * Ce que les modes classiques envoient au profil, avec un profil copié à chaque lecture comme
 * UserManager : ce qui n'est pas réécrit par updateUserData est perdu.
 */
import { describe, test, expect, beforeAll, beforeEach, afterEach, jest } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { createSlidesMock } from '../helpers/mode-test-helpers.mjs';

let persisted;
const copy = value => JSON.parse(JSON.stringify(value));
jest.unstable_mockModule('../../js/core/userState.js', () => ({
  UserState: {
    getCurrentUserData: () => copy(persisted),
    updateUserData: data => {
      persisted = { ...persisted, ...copy(data) };
    },
  },
}));
const updateDailyChallengeProgress = jest.fn();
jest.unstable_mockModule('../../js/game.js', () => {
  const gameState = { gameMode: null, avatar: 'fox', streak: 0 };
  return {
    gameState,
    default: gameState,
    updateDailyChallengeProgress,
    displayDailyChallenge: jest.fn(),
  };
});
jest.unstable_mockModule('../../js/slides.js', () => createSlidesMock(jest));
jest.unstable_mockModule('../../js/mode-orchestrator.js', () => ({
  getStartingMode: () => null,
  setStartingMode: jest.fn(),
  setGameMode: jest.fn(async () => {}),
}));

const store = await import('../../js/i18n-store.js');
const { AudioManager } = await import('../../js/core/audio.js');
const { QuizMode } = await import('../../js/modes/QuizMode.js');
const { ChallengeMode } = await import('../../js/modes/ChallengeMode.js');
const { AdventureMode } = await import('../../js/modes/AdventureMode.js');
const { PROGRESS_HISTORY_LIMIT } = await import('../../js/core/mode-stats.js');
const FR = JSON.parse(
  readFileSync(new URL('../../assets/translations/fr.json', import.meta.url), 'utf8')
);

/** Question connue en multiplication : table, multiplicande, réponse */
function showQuestion(mode, table, num) {
  mode.state.currentQuestion = {
    question: `${table} × ${num} = ?`,
    answer: table * num,
    type: 'mcq',
    operator: '×',
    a: table,
    b: num,
    table,
    num,
  };
  mode.displayQuestion();
}

beforeAll(() => {
  store.setTranslations(FR);
  store.setCurrentLanguage('fr');
});

beforeEach(() => {
  document.body.innerHTML =
    '<section id="slide4" class="slide"><div id="game"></div></section><div id="results"></div>';
  globalThis.scrollTo = () => {};
  persisted = { preferredOperator: '×', coins: 0, progressHistory: [] };
  updateDailyChallengeProgress.mockReset();
  jest.spyOn(AudioManager, 'playSound').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('Quiz : Défi du jour', () => {
  test('une réponse fausse ne fait pas avancer le Défi du jour ; une bonne, si', async () => {
    const quiz = new QuizMode();
    await quiz.start();
    showQuestion(quiz, 6, 7);
    quiz.handleAnswer(41);
    expect(updateDailyChallengeProgress).not.toHaveBeenCalled();
    quiz.continueAfterError();
    await jest.advanceTimersByTimeAsync(3000);
    showQuestion(quiz, 6, 8);
    quiz.handleAnswer(48);
    expect(updateDailyChallengeProgress).toHaveBeenCalledTimes(1);
    expect(updateDailyChallengeProgress).toHaveBeenCalledWith(6, 8);
    quiz.stop();
  });
});

/** Répond juste ou faux à la question affichée */
const reply = (mode, correct = true) =>
  mode.handleAnswer(
    correct ? mode.state.currentQuestion.answer : mode.state.currentQuestion.answer + 1
  );

describe('Quiz : ce qui s’enregistre pour le tableau de bord', () => {
  test('chaque réponse compte dans son opération ; en ×, dans la fenêtre de sa table', async () => {
    const quiz = new QuizMode();
    await quiz.start();
    showQuestion(quiz, 7, 8);
    reply(quiz, false);
    quiz.continueAfterError();
    await jest.advanceTimersByTimeAsync(3000);
    showQuestion(quiz, 7, 3);
    reply(quiz);
    expect(persisted.modeStats.modes.quiz['×']).toEqual({ questions: 2, correct: 1 });
    expect(persisted.modeStats.review['7']).toBe('01');
    quiz.stop();
  });

  test('l’historique réponse par réponse reste borné', async () => {
    persisted.progressHistory = Array.from({ length: PROGRESS_HISTORY_LIMIT }, (_, i) => ({
      question: `2 × ${(i % 10) + 1} = ?`,
      correct: true,
      timestamp: i,
      mode: 'quiz',
    }));
    const quiz = new QuizMode();
    await quiz.start();
    showQuestion(quiz, 6, 9);
    reply(quiz);
    expect(persisted.progressHistory).toHaveLength(PROGRESS_HISTORY_LIMIT);
    expect(persisted.progressHistory.at(-1)).toMatchObject({
      question: '6 × 9 = ?',
      correct: true,
    });
    expect(persisted.progressHistory[0].timestamp).toBe(1);
    quiz.stop();
  });

  test('un quiz fini puis quitté aussitôt (Accueil) est enregistré, badges compris', async () => {
    const quiz = new QuizMode();
    await quiz.start();
    quiz.state.questionCount = 9;
    quiz.state.correctAnswers = 9;
    showQuestion(quiz, 3, 4);
    reply(quiz);
    // L'enfant quitte pendant l'affichage de la dernière réponse, avant l'écran de fin
    quiz.stop();
    await jest.advanceTimersByTimeAsync(5000);
    expect(persisted.quizStats?.totalQuizzes).toBe(1);
    expect(persisted.unlockedBadges).toEqual(
      expect.arrayContaining(['quiz_starter', 'perfect_quiz'])
    );
  });

  test('l’écran de fin n’enregistre pas une seconde fois', async () => {
    const quiz = new QuizMode();
    await quiz.start();
    quiz.state.questionCount = 9;
    quiz.state.correctAnswers = 9;
    showQuestion(quiz, 3, 4);
    reply(quiz);
    await jest.advanceTimersByTimeAsync(5000);
    expect(persisted.quizStats.totalQuizzes).toBe(1);
    expect(persisted.quizStats.history).toHaveLength(1);
  });
});

describe('Défi : parties et records', () => {
  async function startChallenge(difficulty = 'medium') {
    const challenge = new ChallengeMode();
    await challenge.start();
    document.querySelector(`.difficulty-btn[data-difficulty="${difficulty}"]`).click();
    await jest.advanceTimersByTimeAsync(20);
    return challenge;
  }

  test('une partie compte dès sa première réponse, même abandonnée, sans record', async () => {
    const challenge = await startChallenge('hard');
    reply(challenge);
    reply(challenge, false);
    jest.spyOn(globalThis, 'confirm').mockReturnValue(true);
    challenge.confirmAbandon();
    const entry = persisted.modeStats.modes.challenge['×'];
    expect(entry).toMatchObject({ games: 1, questions: 2, correct: 1 });
    expect(entry.best).toEqual({});
  });

  test('un défi sans aucune réponse ne compte pas', async () => {
    const challenge = await startChallenge('easy');
    await jest.advanceTimersByTimeAsync(95000);
    expect(challenge.state.isActive).toBe(false);
    expect(persisted.modeStats?.modes?.challenge).toBeUndefined();
  });

  test('un défi mené au bout du temps : son meilleur score, dans sa difficulté', async () => {
    const challenge = await startChallenge('hard');
    reply(challenge);
    reply(challenge);
    const score = challenge.state.score;
    expect(score).toBeGreaterThan(0);
    await jest.advanceTimersByTimeAsync(40000);
    expect(challenge.state.isActive).toBe(false);
    expect(persisted.modeStats.modes.challenge['×']).toMatchObject({
      games: 1,
      best: { hard: score },
    });
  });

  test('en addition, la partie est rangée en addition', async () => {
    persisted.preferredOperator = '+';
    const challenge = await startChallenge('easy');
    expect(challenge.state.currentQuestion.operator).toBe('+');
    reply(challenge);
    expect(persisted.modeStats.modes.challenge['+']).toMatchObject({ games: 1, questions: 1 });
    expect(persisted.modeStats.review).toEqual({});
    // Mené au bout du temps : son record est un record d'addition, pas de multiplication
    const score = challenge.state.score;
    await jest.advanceTimersByTimeAsync(95000);
    expect(persisted.modeStats.modes.challenge['+'].best).toEqual({ easy: score });
    expect(persisted.modeStats.modes.challenge['×']).toBeUndefined();
  });
});

describe('Aventure : un niveau réussi n’est plus perdu en quittant pendant le trésor', () => {
  async function startLevel1() {
    const adventure = new AdventureMode();
    await adventure.start();
    await adventure.startLevel(1);
    return adventure;
  }

  test('dernière bonne réponse puis Accueil : le niveau et ses étoiles sont enregistrés', async () => {
    const adventure = await startLevel1();
    adventure.state.questionCount = 9;
    adventure.state.correctAnswers = 9;
    reply(adventure);
    adventure.stop();
    await jest.advanceTimersByTimeAsync(5000);
    expect(persisted.adventureProgressByOperator['×'][1]).toMatchObject({
      completed: true,
      stars: 3,
    });
    expect(persisted.starsByTable).toEqual({ 1: 3 });
  });

  test('vies épuisées : rien n’est enregistré, mais les réponses comptent', async () => {
    const adventure = await startLevel1();
    adventure.state.lives = 1;
    reply(adventure, false);
    expect(persisted.adventureProgressByOperator?.['×']).toBeUndefined();
    expect(persisted.modeStats.modes.adventure['×']).toEqual({ questions: 1, correct: 0 });
    adventure.stop();
  });
});
