/* eslint-env jest, node */
/**
 * Les règles de points des modes classiques, chiffrées : points du Quiz et du Défi, pièces,
 * temps gagné, étoiles de l'Aventure, et les records qui ne baissent jamais (meilleure série,
 * étoiles d'un niveau). Le profil est rendu comme par UserManager : l'objet lu reste celui du
 * joueur jusqu'à la lecture suivante, et updateUserData l'écrit.
 */
import { describe, test, expect, beforeAll, beforeEach, afterEach, jest } from '@jest/globals';
import { closeOpenDialog } from '../helpers/confirm-dialog-helpers.mjs';
import {
  frenchTranslations,
  mockClassicModesShell,
  mountGameSlide,
  multiplicationQuestion,
} from '../helpers/module-mocks.mjs';

let profile;
jest.unstable_mockModule('../../js/core/userState.js', () => ({
  UserState: {
    getCurrentUserData: () => {
      profile = { ...profile };
      return profile;
    },
    updateUserData: data => {
      profile = { ...profile, ...JSON.parse(JSON.stringify(data)) };
    },
  },
}));
mockClassicModesShell(jest, '../../js');

const store = await import('../../js/i18n-store.js');
const { AudioManager } = await import('../../js/core/audio.js');
const { QuizMode } = await import('../../js/modes/QuizMode.js');
const { ChallengeMode } = await import('../../js/modes/ChallengeMode.js');
const { AdventureMode } = await import('../../js/modes/AdventureMode.js');

/** Question connue en multiplication, affichée */
function showQuestion(mode, table, num) {
  mode.state.currentQuestion = multiplicationQuestion(table, num);
  mode.displayQuestion();
}

/** Répond juste, ou faux (une unité de trop), à la question affichée */
function reply(mode, correct = true) {
  const { answer } = mode.state.currentQuestion;
  mode.handleAnswer(correct ? answer : answer + 1);
}

beforeAll(() => {
  store.setTranslations(frenchTranslations());
  store.setCurrentLanguage('fr');
});

beforeEach(() => {
  jest.useFakeTimers();
  mountGameSlide();
  globalThis.scrollTo = () => {};
  profile = { preferredOperator: '×', coins: 0, progressHistory: [] };
  jest.spyOn(AudioManager, 'playSound').mockImplementation(() => {});
  for (const level of ['log', 'warn']) jest.spyOn(console, level).mockImplementation(() => {});
});

afterEach(() => {
  closeOpenDialog();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('Quiz : les points d’une bonne réponse', () => {
  /** Une bonne réponse à une question connue, puis la question suivante attendue */
  async function answerRight(quiz, num) {
    showQuestion(quiz, 6, num);
    reply(quiz);
    await jest.advanceTimersByTimeAsync(3000);
  }

  test('10 points, 15 dès la troisième de suite, 20 dès la cinquième ; une erreur repart de 10', async () => {
    const quiz = new QuizMode();
    await quiz.start();
    const totals = [];
    for (const num of [1, 2, 3, 4, 5, 6]) {
      await answerRight(quiz, num);
      totals.push(quiz.state.score);
    }
    // 10, 10, 15, 15, 20, 20
    expect(totals).toEqual([10, 20, 35, 50, 70, 90]);

    showQuestion(quiz, 6, 7);
    reply(quiz, false);
    expect(quiz.state.score).toBe(90);
    expect(quiz.state.streak).toBe(0);
    quiz.continueAfterError();
    await jest.advanceTimersByTimeAsync(3000);
    await answerRight(quiz, 8);
    expect(quiz.state.score).toBe(100);
    quiz.stop();
  });

  test('le Quiz ne donne pas de pièces', async () => {
    const quiz = new QuizMode();
    await quiz.start();
    await answerRight(quiz, 2);
    await answerRight(quiz, 3);
    expect(profile.coins).toBe(0);
    quiz.stop();
  });
});

describe('Meilleure série du profil', () => {
  test('une série plus courte ne l’écrase pas ; une plus longue la remplace', async () => {
    profile.bestStreak = 2;
    const quiz = new QuizMode();
    await quiz.start();
    showQuestion(quiz, 4, 1);
    reply(quiz);
    await jest.advanceTimersByTimeAsync(3000);
    expect(profile.bestStreak).toBe(2);
    showQuestion(quiz, 4, 2);
    reply(quiz);
    await jest.advanceTimersByTimeAsync(3000);
    expect(profile.bestStreak).toBe(2);
    showQuestion(quiz, 4, 3);
    reply(quiz);
    await jest.advanceTimersByTimeAsync(3000);
    expect(profile.bestStreak).toBe(3);

    // Une erreur, puis une série qui repart de 1 : le record reste
    showQuestion(quiz, 4, 4);
    reply(quiz, false);
    quiz.continueAfterError();
    await jest.advanceTimersByTimeAsync(3000);
    showQuestion(quiz, 4, 5);
    reply(quiz);
    expect(profile.bestStreak).toBe(3);
    quiz.stop();
  });
});

describe('Défi : points, pièces et temps gagné', () => {
  async function startChallenge(difficulty) {
    const challenge = new ChallengeMode();
    await challenge.start();
    document.querySelector(`.difficulty-btn[data-difficulty="${difficulty}"]`).click();
    await jest.advanceTimersByTimeAsync(20);
    return challenge;
  }

  /** Scores cumulés après chaque bonne réponse d'une série */
  function scoresOfStreak(challenge, length) {
    const totals = [];
    for (let i = 0; i < length; i++) {
      reply(challenge);
      totals.push(challenge.state.score);
    }
    return totals;
  }

  test.each([
    // 10, 10, 15, 15, 20, 20
    ['easy', [10, 20, 35, 50, 70, 90]],
    // × 1,2 : 12, 12, 18, 18, 24, 24
    ['medium', [12, 24, 42, 60, 84, 108]],
    // × 1,5 arrondi : 15, 15, 23, 23, 30, 30
    ['hard', [15, 30, 53, 76, 106, 136]],
  ])('%s : les points de six bonnes réponses de suite', async (difficulty, expected) => {
    const challenge = await startChallenge(difficulty);
    expect(scoresOfStreak(challenge, 6)).toEqual(expected);
    challenge.stop();
  });

  test('une erreur ne retire rien et la série repart : 10 points à la bonne réponse suivante', async () => {
    const challenge = await startChallenge('easy');
    scoresOfStreak(challenge, 3);
    reply(challenge, false);
    expect(challenge.state.score).toBe(35);
    reply(challenge);
    expect(challenge.state.score).toBe(45);
    challenge.stop();
  });

  test('pièces : 1 par bonne réponse, 2 dès la troisième de suite, 3 dès la cinquième ; aucune pour une erreur', async () => {
    const challenge = await startChallenge('easy');
    const coins = [];
    for (let i = 0; i < 6; i++) {
      reply(challenge);
      coins.push(profile.coins);
    }
    // 1, 1, 2, 2, 3, 3
    expect(coins).toEqual([1, 2, 4, 6, 9, 12]);
    reply(challenge, false);
    expect(profile.coins).toBe(12);
    reply(challenge);
    expect(profile.coins).toBe(13);
    challenge.stop();
  });

  test.each([
    ['easy', 5],
    ['medium', 4],
    ['hard', 3],
  ])(
    'temps gagné (%s) : +%i s à chaque série de trois bonnes réponses, rien entre',
    async (difficulty, bonus) => {
      const challenge = await startChallenge(difficulty);
      const start = challenge.state.timeLeft;
      const gained = [];
      for (let i = 0; i < 18; i++) {
        reply(challenge);
        gained.push(challenge.state.timeLeft - start);
      }
      // Le temps ne tombe qu'à la 3e, 6e, 9e… bonne réponse de suite
      const expected = Array.from({ length: 18 }, (_, i) => Math.floor((i + 1) / 3) * bonus);
      expect(gained).toEqual(expected);
      expect(challenge.bonusTimeEarned).toBe(6 * bonus);
      challenge.stop();
    }
  );

  test('temps gagné : une erreur remet la série à zéro, il faut trois nouvelles bonnes réponses', async () => {
    const challenge = await startChallenge('hard');
    const start = challenge.state.timeLeft;
    reply(challenge);
    reply(challenge);
    reply(challenge, false);
    reply(challenge);
    reply(challenge);
    expect(challenge.state.timeLeft - start).toBe(0);
    reply(challenge);
    expect(challenge.state.timeLeft - start).toBe(3);
    challenge.stop();
  });

  test('une série rend moins de temps qu’elle n’en coûte, même au joueur le plus rapide', async () => {
    // Trois questions coûtent trois attentes entre deux questions (nextQuestionDelay), plus le
    // temps de lire et de répondre : personne ne le fait en moins d'une demi-seconde. Avant la
    // v108, chaque bonne réponse rendait jusqu'à 5 s : le chrono remontait au lieu de descendre.
    const FASTEST_ANSWER_SECONDS = 0.5;
    for (const difficulty of ['easy', 'medium', 'hard']) {
      const challenge = await startChallenge(difficulty);
      const cost = 3 * (challenge.config.nextQuestionDelay / 1000 + FASTEST_ANSWER_SECONDS);
      reply(challenge);
      reply(challenge);
      const before = challenge.state.timeLeft;
      reply(challenge);
      const given = challenge.state.timeLeft - before;
      expect(given).toBeGreaterThan(0);
      expect(given).toBeLessThan(cost);
      challenge.stop();
    }
  });
});

describe('Aventure : étoiles et pièces', () => {
  async function startLevel1() {
    const adventure = new AdventureMode();
    await adventure.start();
    await adventure.startLevel(1);
    return adventure;
  }

  /** Dernière bonne réponse d'un niveau de 10 questions, avec ce nombre de bonnes réponses */
  async function finishLevel(adventure, correct) {
    adventure.state.questionCount = 9;
    adventure.state.correctAnswers = correct - 1;
    reply(adventure);
    await jest.advanceTimersByTimeAsync(5000);
  }

  test.each([
    [100, 100, 3],
    [90, 100, 3],
    [89, 100, 2],
    [70, 100, 2],
    [69, 100, 1],
    [50, 100, 1],
    [49, 100, 0],
    [0, 100, 0],
    [9, 10, 3],
    [8, 10, 2],
    [7, 10, 2],
    [5, 10, 1],
  ])('%i bonnes réponses sur %i : %i étoile(s)', async (correct, total, stars) => {
    const adventure = await startLevel1();
    adventure.state.correctAnswers = correct;
    adventure.state.questionCount = total;
    expect(adventure.calculateStars()).toBe(stars);
    adventure.stop();
  });

  test('un niveau fini à 8 sur 10 s’enregistre avec 2 étoiles', async () => {
    const adventure = await startLevel1();
    await finishLevel(adventure, 8);
    expect(profile.adventureProgressByOperator['×'][1]).toMatchObject({
      completed: true,
      stars: 2,
      attempts: 1,
    });
    expect(profile.starsByTable).toEqual({ 1: 2 });
    adventure.stop();
  });

  test('une pièce par bonne réponse, aucune pour une erreur', async () => {
    const adventure = await startLevel1();
    reply(adventure);
    expect(profile.coins).toBe(1);
    await jest.advanceTimersByTimeAsync(3000);
    reply(adventure, false);
    expect(profile.coins).toBe(1);
    adventure.stop();
  });

  test('rejouer un niveau moins bien ne lui retire pas ses étoiles', async () => {
    profile.adventureProgressByOperator = {
      '×': { 1: { completed: true, stars: 3, table: 1, lastPlayed: 1, attempts: 1 } },
    };
    profile.starsByTable = { 1: 3 };
    const adventure = await startLevel1();
    await finishLevel(adventure, 8);
    expect(profile.adventureProgressByOperator['×'][1]).toMatchObject({
      completed: true,
      stars: 3,
      attempts: 2,
    });
    expect(profile.starsByTable).toEqual({ 1: 3 });
    adventure.stop();
  });

  test('rejouer un niveau mieux lui donne ses nouvelles étoiles', async () => {
    profile.adventureProgressByOperator = {
      '×': { 1: { completed: true, stars: 1, table: 1, lastPlayed: 1, attempts: 4 } },
    };
    profile.starsByTable = { 1: 1 };
    const adventure = await startLevel1();
    await finishLevel(adventure, 10);
    expect(profile.adventureProgressByOperator['×'][1]).toMatchObject({ stars: 3, attempts: 5 });
    expect(profile.starsByTable).toEqual({ 1: 3 });
    adventure.stop();
  });

  // Math.max(undefined, 3) vaudrait NaN : le niveau serait enregistré sans étoiles
  test('un niveau enregistré sans champ « stars » reçoit les étoiles gagnées', async () => {
    profile.adventureProgressByOperator = { '×': { 1: { completed: true, table: 1 } } };
    const adventure = await startLevel1();
    await finishLevel(adventure, 10);
    expect(profile.adventureProgressByOperator['×'][1].stars).toBe(3);
    adventure.stop();
  });
});
