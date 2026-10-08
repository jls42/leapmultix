/* eslint-env jest, node */
/**
 * Règle de sortie d'une partie en cours (js/game-exit.js) : chaque façon de quitter demande la
 * confirmation de « Abandonner » et enregistre la partie comme lui ; hors partie, rien ne change.
 * Modes réels, profil copié à chaque lecture comme UserManager.
 */
import { describe, test, expect, beforeAll, beforeEach, afterEach, jest } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { createSlidesMock } from './helpers/mode-test-helpers.mjs';

let persisted;
const copy = value => JSON.parse(JSON.stringify(value));
jest.unstable_mockModule('../js/core/userState.js', () => ({
  UserState: {
    getCurrentUserData: () => copy(persisted),
    updateUserData: data => {
      persisted = { ...persisted, ...copy(data) };
    },
  },
}));
jest.unstable_mockModule('../js/game.js', () => {
  const gameState = { gameMode: null, avatar: 'fox', streak: 0 };
  return {
    gameState,
    default: gameState,
    updateDailyChallengeProgress: jest.fn(),
    displayDailyChallenge: jest.fn(),
  };
});
jest.unstable_mockModule('../js/slides.js', () => createSlidesMock(jest));
jest.unstable_mockModule('../js/mode-orchestrator.js', () => ({
  getStartingMode: () => null,
  setStartingMode: jest.fn(),
  setGameMode: jest.fn(async () => {}),
}));

const store = await import('../js/i18n-store.js');
const { AudioManager } = await import('../js/core/audio.js');
const { goToSlide } = await import('../js/slides.js');
const { QuizMode } = await import('../js/modes/QuizMode.js');
const { ChallengeMode } = await import('../js/modes/ChallengeMode.js');
// Échap : le gestionnaire global d'accessibility.js (posé à l'import)
await import('../js/accessibility.js');
const { mountArcadePause, unmountArcadePause, isArcadePaused } = await import(
  '../js/arcade-time.js'
);
const FR = JSON.parse(
  readFileSync(new URL('../assets/translations/fr.json', import.meta.url), 'utf8')
);

/** Écran de jeu et sa barre du haut ; une sortie acceptée arrête le mode, comme goToSlide */
let navigate;
let current;
function mountGameScreen() {
  const slide = document.createElement('section');
  slide.id = 'slide4';
  slide.className = 'slide active-slide';
  const bar = document.createElement('div');
  bar.className = 'top-bar';
  const home = Object.assign(document.createElement('button'), { className: 'home-btn' });
  const dashboard = document.createElement('button');
  dashboard.dataset.slide = '7';
  const english = Object.assign(document.createElement('button'), { className: 'lang-btn' });
  bar.append(home, dashboard, english);
  for (const button of bar.children) button.addEventListener('click', navigate);
  const game = Object.assign(document.createElement('div'), { id: 'game' });
  slide.append(bar, game);
  const results = Object.assign(document.createElement('div'), { id: 'results' });
  document.body.replaceChildren(slide, results);
  return { home, dashboard, english, game };
}

/** Question connue en multiplication */
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

const reply = (mode, correct = true) =>
  mode.handleAnswer(
    correct ? mode.state.currentQuestion.answer : mode.state.currentQuestion.answer + 1
  );

const withoutDate = entry =>
  Object.fromEntries(Object.entries(entry).filter(([k]) => k !== 'date'));

const pressEscape = () =>
  document.body.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
  );

async function startQuiz(answers = [true]) {
  const quiz = new QuizMode();
  current = quiz;
  await quiz.start();
  for (const correct of answers) {
    showQuestion(quiz, 7, 8);
    reply(quiz, correct);
    quiz.continueAfterError();
  }
  return quiz;
}

async function startChallenge() {
  const challenge = new ChallengeMode();
  current = challenge;
  await challenge.start();
  return challenge;
}

beforeAll(() => {
  store.setTranslations(FR);
  store.setCurrentLanguage('fr');
});

let screen;
beforeEach(() => {
  persisted = { preferredOperator: '×', coins: 0, progressHistory: [] };
  current = null;
  navigate = jest.fn(() => current?.stop());
  screen = mountGameScreen();
  globalThis.scrollTo = () => {};
  jest.spyOn(AudioManager, 'playSound').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.useFakeTimers();
});

afterEach(() => {
  current?.stop();
  jest.useRealTimers();
  jest.restoreAllMocks();
  goToSlide.mockClear();
});

describe('Barre du haut pendant une partie', () => {
  test('Accueil pendant un quiz : la question de « Abandonner » ; refusée, la partie continue', async () => {
    const quiz = await startQuiz();
    const confirm = jest.spyOn(globalThis, 'confirm').mockReturnValue(false);
    screen.home.click();
    expect(confirm).toHaveBeenCalledWith(FR.confirm_abandon_quiz);
    expect(navigate).not.toHaveBeenCalled();
    expect(quiz.isGameInProgress()).toBe(true);
    expect(persisted.quizStats).toBeUndefined();
  });

  test('acceptée : le quiz s’enregistre comme avec « Abandonner », puis l’écran s’ouvre', async () => {
    jest.spyOn(globalThis, 'confirm').mockReturnValue(true);
    await startQuiz([true, false]);
    screen.home.click();
    expect(navigate).toHaveBeenCalledTimes(1);
    const byHome = persisted.quizStats.history.at(-1);

    // La même partie, quittée par « Abandonner »
    await startQuiz([true, false]);
    document.getElementById('quiz-abandon').click();
    const byButton = persisted.quizStats.history.at(-1);
    // Même bilan, à la date près
    const homeEntry = withoutDate(byHome);
    expect(homeEntry).toEqual(withoutDate(byButton));
    expect(homeEntry).toMatchObject({ correct: 1, total: 2 });
    expect(persisted.quizStats.totalQuizzes).toBe(2);
    // Le tableau de bord comptait déjà les réponses : rien de plus
    expect(persisted.modeStats.modes.quiz['×']).toEqual({ questions: 4, correct: 2 });
  });

  test('Défi quitté par le tableau de bord : compté comme un abandon, sans record', async () => {
    const challenge = await startChallenge();
    document.querySelector('.difficulty-btn[data-difficulty="hard"]').click();
    await jest.advanceTimersByTimeAsync(20);
    reply(challenge);
    reply(challenge, false);
    jest.spyOn(globalThis, 'confirm').mockReturnValue(true);
    screen.dashboard.click();
    expect(globalThis.confirm).toHaveBeenCalledWith(FR.confirm_abandon_challenge);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(persisted.modeStats.modes.challenge['×']).toMatchObject({
      games: 1,
      questions: 2,
      correct: 1,
      best: {},
    });
    expect(persisted.challengeStats.hard.totalPlayed).toBe(1);
  });

  test('hors partie (choix de la difficulté du Défi) : rien ne change', async () => {
    await startChallenge();
    const confirm = jest.spyOn(globalThis, 'confirm');
    screen.home.click();
    expect(confirm).not.toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  test('partie déjà enregistrée (dernière réponse donnée) : l’Accueil ne demande rien', async () => {
    const quiz = new QuizMode();
    current = quiz;
    await quiz.start();
    quiz.state.questionCount = 9;
    showQuestion(quiz, 3, 4);
    reply(quiz);
    const confirm = jest.spyOn(globalThis, 'confirm');
    screen.home.click();
    expect(confirm).not.toHaveBeenCalled();
    expect(persisted.quizStats.totalQuizzes).toBe(1);
  });

  test('une langue n’est pas une sortie', async () => {
    await startQuiz();
    const confirm = jest.spyOn(globalThis, 'confirm');
    screen.english.click();
    expect(confirm).not.toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledTimes(1);
  });
});

describe('Échap', () => {
  test('pendant une partie, Échap presse « Abandonner » : refusé, la partie continue', async () => {
    const quiz = await startQuiz();
    const confirm = jest.spyOn(globalThis, 'confirm').mockReturnValue(false);
    pressEscape();
    await jest.advanceTimersByTimeAsync(20);
    expect(confirm).toHaveBeenCalledWith(FR.confirm_abandon_quiz);
    expect(goToSlide).not.toHaveBeenCalledWith(0);
    expect(quiz.isGameInProgress()).toBe(true);
  });

  test('accepté, la suite de « Abandonner » : l’écran de fin du quiz', async () => {
    const quiz = await startQuiz();
    jest.spyOn(globalThis, 'confirm').mockReturnValue(true);
    pressEscape();
    await jest.advanceTimersByTimeAsync(20);
    expect(quiz.state.isActive).toBe(false);
    expect(goToSlide).toHaveBeenCalledWith(5);
    expect(goToSlide).not.toHaveBeenCalledWith(0);
    expect(persisted.quizStats.totalQuizzes).toBe(1);
  });

  test('hors partie, Échap ramène toujours au choix du joueur, sans question', async () => {
    await startChallenge();
    const confirm = jest.spyOn(globalThis, 'confirm');
    pressEscape();
    await jest.advanceTimersByTimeAsync(20);
    expect(confirm).not.toHaveBeenCalled();
    expect(goToSlide).toHaveBeenCalledWith(0);
  });
});

describe('Jeu d’Arcade', () => {
  /** Écran d'un jeu (components/infoBar.js) : canevas et « Abandonner », dont le jeu gère le clic */
  function mountArcadeGame() {
    const ui = Object.assign(document.createElement('div'), { className: 'arcade-game-ui' });
    const canvas = document.createElement('canvas');
    const abandon = Object.assign(document.createElement('button'), { id: 'arcade-abandon-btn' });
    const endGame = jest.fn();
    abandon.addEventListener('click', endGame);
    ui.append(canvas, abandon);
    screen.game.replaceChildren(ui);
    return { abandon, endGame };
  }

  test('« Abandonner » demande confirmation ; refusée, le jeu continue', () => {
    const { abandon, endGame } = mountArcadeGame();
    const confirm = jest.spyOn(globalThis, 'confirm').mockReturnValue(false);
    abandon.click();
    expect(confirm).toHaveBeenCalledWith(FR.confirm_abandon_arcade);
    expect(endGame).not.toHaveBeenCalled();
    confirm.mockReturnValue(true);
    abandon.click();
    expect(endGame).toHaveBeenCalledTimes(1);
  });

  test('la question arrête le jeu ; refusée, la partie attend « Reprendre », sans bond', () => {
    const { abandon, endGame } = mountArcadeGame();
    const timer = document.createElement('span');
    screen.game.prepend(timer);
    mountArcadePause(timer);
    let pausedWhileAsking = null;
    jest.spyOn(globalThis, 'confirm').mockImplementation(() => {
      pausedWhileAsking = isArcadePaused();
      return false;
    });
    abandon.click();
    expect(pausedWhileAsking).toBe(true);
    expect(endGame).not.toHaveBeenCalled();
    // La partie ne reprend jamais seule : le jeu ne bondit pas du temps passé à lire
    expect(isArcadePaused()).toBe(true);
    expect(document.activeElement?.classList.contains('arcade-resume-btn')).toBe(true);
    // Déjà en pause : la question n'y change rien
    screen.home.click();
    expect(isArcadePaused()).toBe(true);
    unmountArcadePause();
  });

  test('Échap et Accueil : la même question', () => {
    const { endGame } = mountArcadeGame();
    const confirm = jest.spyOn(globalThis, 'confirm').mockReturnValue(false);
    pressEscape();
    screen.home.click();
    expect(confirm.mock.calls).toEqual([[FR.confirm_abandon_arcade], [FR.confirm_abandon_arcade]]);
    expect(endGame).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
    confirm.mockReturnValue(true);
    pressEscape();
    expect(endGame).toHaveBeenCalledTimes(1);
  });
});
