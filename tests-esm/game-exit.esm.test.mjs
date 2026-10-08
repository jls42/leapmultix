/* eslint-env jest, node */
/**
 * Règle de sortie d'une partie en cours (js/game-exit.js) : chaque façon de quitter pose la
 * question de « Abandonner », dans la fenêtre du jeu, et enregistre la partie comme lui ; hors
 * partie, rien ne change. Modes réels, profil copié à chaque lecture comme UserManager.
 */
import { describe, test, expect, beforeAll, beforeEach, afterEach, jest } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { createSlidesMock } from './helpers/mode-test-helpers.mjs';
import {
  answerDialog,
  closeOpenDialog,
  dialogQuestion,
  openDialog,
} from './helpers/confirm-dialog-helpers.mjs';

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
  closeOpenDialog();
  current?.stop();
  jest.useRealTimers();
  jest.restoreAllMocks();
  goToSlide.mockClear();
});

describe('Barre du haut pendant une partie', () => {
  test('Accueil pendant un quiz : la question de « Abandonner » ; refusée, la partie continue', async () => {
    const quiz = await startQuiz();
    screen.home.focus();
    screen.home.click();
    expect(dialogQuestion()).toBe(FR.confirm_abandon_quiz);
    expect(navigate).not.toHaveBeenCalled();
    await answerDialog(false);
    expect(navigate).not.toHaveBeenCalled();
    expect(quiz.isGameInProgress()).toBe(true);
    expect(persisted.quizStats).toBeUndefined();
    // Le focus revient au bouton pressé
    expect(document.activeElement).toBe(screen.home);
  });

  test('acceptée : le quiz s’enregistre comme avec « Abandonner », puis l’écran s’ouvre', async () => {
    await startQuiz([true, false]);
    screen.home.click();
    await answerDialog(true);
    expect(navigate).toHaveBeenCalledTimes(1);
    const byHome = persisted.quizStats.history.at(-1);

    // La même partie, quittée par « Abandonner »
    await startQuiz([true, false]);
    document.getElementById('quiz-abandon').click();
    await answerDialog(true);
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
    screen.dashboard.click();
    expect(dialogQuestion()).toBe(FR.confirm_abandon_challenge);
    await answerDialog(true);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(persisted.modeStats.modes.challenge['×']).toMatchObject({
      games: 1,
      questions: 2,
      correct: 1,
      best: {},
    });
    expect(persisted.challengeStats.hard.totalPlayed).toBe(1);
  });

  test('le décompte du Défi attend la réponse à la question, puis repart', async () => {
    const challenge = await startChallenge();
    document.querySelector('.difficulty-btn[data-difficulty="hard"]').click();
    await jest.advanceTimersByTimeAsync(20);
    const timeLeft = challenge.state.timeLeft;
    screen.home.click();
    await jest.advanceTimersByTimeAsync(10000);
    expect(challenge.state.timeLeft).toBe(timeLeft);
    await answerDialog(false);
    await jest.advanceTimersByTimeAsync(3000);
    expect(challenge.state.timeLeft).toBe(timeLeft - 3);
  });

  test('une explication finie pendant la question ne relance pas le décompte', async () => {
    const challenge = await startChallenge();
    document.querySelector('.difficulty-btn[data-difficulty="hard"]').click();
    await jest.advanceTimersByTimeAsync(20);
    reply(challenge, false);
    const timeLeft = challenge.state.timeLeft;
    screen.home.click();
    // L'explication se termine, la question suivante arrive derrière la fenêtre
    await jest.advanceTimersByTimeAsync(20000);
    expect(challenge.state.timeLeft).toBe(timeLeft);
    await answerDialog(false);
    await jest.advanceTimersByTimeAsync(2000);
    expect(challenge.state.timeLeft).toBe(timeLeft - 2);
  });

  test('hors partie (choix de la difficulté du Défi) : rien ne change', async () => {
    await startChallenge();
    screen.home.click();
    expect(openDialog()).toBeNull();
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  test('partie déjà enregistrée (dernière réponse donnée) : l’Accueil ne demande rien', async () => {
    const quiz = new QuizMode();
    current = quiz;
    await quiz.start();
    quiz.state.questionCount = 9;
    showQuestion(quiz, 3, 4);
    reply(quiz);
    screen.home.click();
    expect(openDialog()).toBeNull();
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(persisted.quizStats.totalQuizzes).toBe(1);
  });

  test('une langue n’est pas une sortie', async () => {
    await startQuiz();
    screen.english.click();
    expect(openDialog()).toBeNull();
    expect(navigate).toHaveBeenCalledTimes(1);
  });
});

describe('Échap', () => {
  test('pendant une partie, Échap presse « Abandonner » : refusé, la partie continue', async () => {
    const quiz = await startQuiz();
    pressEscape();
    expect(dialogQuestion()).toBe(FR.confirm_abandon_quiz);
    await answerDialog(false);
    await jest.advanceTimersByTimeAsync(20);
    expect(goToSlide).not.toHaveBeenCalledWith(0);
    expect(quiz.isGameInProgress()).toBe(true);
  });

  test('Échap dans la fenêtre : la partie continue, et rien d’autre (pas de retour au choix du joueur)', async () => {
    const quiz = await startQuiz();
    pressEscape();
    expect(openDialog()).not.toBeNull();
    document.activeElement.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    );
    await jest.advanceTimersByTimeAsync(20);
    expect(openDialog()).toBeNull();
    expect(goToSlide).not.toHaveBeenCalledWith(0);
    expect(quiz.isGameInProgress()).toBe(true);
  });

  test('accepté, la suite de « Abandonner » : l’écran de fin du quiz', async () => {
    const quiz = await startQuiz();
    pressEscape();
    await answerDialog(true);
    await jest.advanceTimersByTimeAsync(20);
    expect(quiz.state.isActive).toBe(false);
    expect(goToSlide).toHaveBeenCalledWith(5);
    expect(goToSlide).not.toHaveBeenCalledWith(0);
    expect(persisted.quizStats.totalQuizzes).toBe(1);
  });

  test('partie finie pendant la question : confirmer ne la refinit pas', async () => {
    const quiz = await startQuiz();
    pressEscape();
    // La fin programmée arrive pendant que la fenêtre attend
    quiz.finish();
    await answerDialog(true);
    await jest.advanceTimersByTimeAsync(20);
    expect(goToSlide.mock.calls.filter(([slide]) => slide === 5)).toHaveLength(1);
    expect(persisted.quizStats.totalQuizzes).toBe(1);
  });

  test('hors partie, Échap ramène toujours au choix du joueur, sans question', async () => {
    await startChallenge();
    pressEscape();
    await jest.advanceTimersByTimeAsync(20);
    expect(openDialog()).toBeNull();
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

  test('« Abandonner » demande confirmation ; refusée, le jeu continue', async () => {
    const { abandon, endGame } = mountArcadeGame();
    abandon.click();
    expect(dialogQuestion()).toBe(FR.confirm_abandon_arcade);
    await answerDialog(false);
    expect(endGame).not.toHaveBeenCalled();
    abandon.click();
    expect(endGame).not.toHaveBeenCalled();
    await answerDialog(true);
    expect(endGame).toHaveBeenCalledTimes(1);
  });

  test('deux activations de suite au clavier (Tab, Espace, Espace) ne quittent pas', async () => {
    const { abandon, endGame } = mountArcadeGame();
    abandon.focus();
    document.activeElement.click();
    // La seconde tombe sur « Continuer la partie », qui a le focus
    expect(document.activeElement.dataset.answer).toBe('cancel');
    expect(document.activeElement.textContent).toBe(FR.exit_dialog_continue);
    document.activeElement.click();
    await jest.advanceTimersByTimeAsync(20);
    expect(openDialog()).toBeNull();
    expect(endGame).not.toHaveBeenCalled();
  });

  test('la question arrête le jeu ; refusée, la partie attend « Reprendre », qui a le focus', async () => {
    const { abandon, endGame } = mountArcadeGame();
    const timer = document.createElement('span');
    screen.game.prepend(timer);
    mountArcadePause(timer);
    abandon.click();
    expect(isArcadePaused()).toBe(true);
    await answerDialog(false);
    expect(endGame).not.toHaveBeenCalled();
    // La partie ne reprend jamais seule : « Reprendre » (touche P) la relance
    expect(isArcadePaused()).toBe(true);
    expect(document.activeElement?.classList.contains('arcade-resume-btn')).toBe(true);
    // Déjà en pause : la question n'y change rien
    screen.home.click();
    await answerDialog(false);
    expect(isArcadePaused()).toBe(true);
    unmountArcadePause();
  });

  test('Échap et Accueil : la même question', async () => {
    const { endGame } = mountArcadeGame();
    pressEscape();
    expect(dialogQuestion()).toBe(FR.confirm_abandon_arcade);
    await answerDialog(false);
    screen.home.click();
    expect(dialogQuestion()).toBe(FR.confirm_abandon_arcade);
    await answerDialog(false);
    expect(endGame).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
    pressEscape();
    await answerDialog(true);
    expect(endGame).toHaveBeenCalledTimes(1);
  });

  test('la fenêtre est traduite : titre, question et boutons', () => {
    mountArcadeGame();
    pressEscape();
    const dialog = openDialog();
    expect(dialog.querySelector('h2').textContent).toBe(FR.exit_dialog_title);
    const labels = [...dialog.querySelectorAll('button')].map(b => b.textContent);
    expect(labels).toEqual([FR.exit_dialog_continue, FR.exit_dialog_quit]);
  });
});
