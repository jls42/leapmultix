/* eslint-env jest, node */
/**
 * « Changer de joueur » pendant une partie, avec deux vrais profils (UserManager, stockage du
 * navigateur) : la partie en cours est enregistrée comme un abandon chez celle qui jouait,
 * avant que l'autre joueur ne soit choisi ; rien n'est écrit chez lui, ni à cet instant ni
 * plus tard (temps du Défi qui s'écoule, jeu d'Arcade relancé), et ni score ni pièce ne passe
 * d'un profil à l'autre. Le choix du joueur suit ici la sortie sans délai : c'est l'ordre le
 * plus serré possible.
 */
import { describe, test, expect, beforeAll, beforeEach, afterEach, jest } from '@jest/globals';
import { answerDialog, closeOpenDialog } from './helpers/confirm-dialog-helpers.mjs';
import {
  frenchTranslations,
  mockClassicModesShell,
  mountScreenWithTopBar,
  multiplicationQuestion,
} from './helpers/module-mocks.mjs';

mockClassicModesShell(jest, '../js');

const store = await import('../js/i18n-store.js');
const { AudioManager } = await import('../js/core/audio.js');
const { UserManager } = await import('../js/userManager.js');
const { QuizMode } = await import('../js/modes/QuizMode.js');
const { ChallengeMode } = await import('../js/modes/ChallengeMode.js');
const arcade = await import('../js/arcade.js');
const { noteArcadePlay } = await import('../js/arcade-session.js');
const { gameState } = await import('../js/game.js');

const flush = (ms = 0) => jest.advanceTimersByTimeAsync(ms);
/** Profil d'un joueur tel qu'il est écrit dans le stockage du navigateur */
const stored = name =>
  new Map(Object.entries(JSON.parse(localStorage.getItem('players')))).get(name);

/** Ce que fait la sortie acceptée : la partie s'arrête, puis Tom est choisi aussitôt */
let leaveGame;
let topBar;

/** Léa quitte par « Changer de joueur » et confirme ; Tom prend sa place */
async function changePlayer() {
  topBar.changePlayer.click();
  await answerDialog(true);
  await flush();
  expect(UserManager.getCurrentUser()).toBe('tom');
}

/** Bonne ou mauvaise réponse à une question connue, puis le temps du retour */
async function answerQuestion(mode, num, correct = true) {
  mode.state.currentQuestion = multiplicationQuestion(6, num);
  mode.displayQuestion();
  mode.handleAnswer(correct ? 6 * num : 6 * num + 1);
  mode.continueAfterError?.();
  await flush(3000);
}

beforeAll(() => {
  store.setTranslations(frenchTranslations());
  store.setCurrentLanguage('fr');
});

beforeEach(() => {
  jest.useFakeTimers();
  localStorage.clear();
  globalThis.scrollTo = () => {};
  jest.spyOn(AudioManager, 'playSound').mockImplementation(() => {});
  for (const level of ['log', 'warn', 'debug']) {
    jest.spyOn(console, level).mockImplementation(() => {});
  }
  UserManager._players = {
    lea: { nickname: 'Léa', avatar: 'fox', coins: 3, bestStreak: 1, preferredOperator: '×' },
    tom: { nickname: 'Tom', avatar: 'panda', coins: 7, bestStreak: 6, preferredOperator: '×' },
  };
  // Chaque joueur a déjà joué sur cet appareil : son profil est écrit sous sa forme complète
  UserManager.selectUser('tom');
  UserManager.selectUser('lea');
  UserManager.savePlayers();
  leaveGame = () => UserManager.selectUser('tom');
  topBar = mountScreenWithTopBar(() => leaveGame());
});

afterEach(() => {
  closeOpenDialog();
  arcade.stopArcadeMode();
  gameState.gameMode = null;
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('Changer de joueur pendant un Quiz', () => {
  test('le quiz est enregistré chez Léa ; le profil de Tom reste tel qu’il était', async () => {
    const tomBefore = stored('tom');
    const quiz = new QuizMode();
    leaveGame = () => {
      quiz.stop();
      UserManager.selectUser('tom');
    };
    await quiz.start();
    await answerQuestion(quiz, 2);
    await answerQuestion(quiz, 3);
    await answerQuestion(quiz, 4, false);
    await changePlayer();

    const lea = stored('lea');
    expect(lea.quizStats).toMatchObject({ totalQuizzes: 1, bestScore: 20 });
    expect(lea.modeStats.modes.quiz['×']).toEqual({ questions: 3, correct: 2 });
    expect(lea).toMatchObject({ coins: 3, bestStreak: 2 });
    expect(stored('tom')).toEqual(tomBefore);

    // Plus tard, rien ne s'écrit encore : ni chez Tom, ni chez Léa
    await flush(120000);
    expect(stored('tom')).toEqual(tomBefore);
    expect(stored('lea')).toEqual(lea);
  });
});

describe('Changer de joueur pendant un Défi', () => {
  test('le défi compte chez Léa comme un abandon, avec ses pièces ; rien chez Tom, même le temps écoulé', async () => {
    const tomBefore = stored('tom');
    const challenge = new ChallengeMode();
    leaveGame = () => {
      challenge.stop();
      UserManager.selectUser('tom');
    };
    await challenge.start();
    document.querySelector('.difficulty-btn[data-difficulty="easy"]').click();
    await flush(20);
    // Trois bonnes réponses de suite : 35 points, et 1 + 1 + 2 pièces
    for (let i = 0; i < 3; i++) challenge.handleAnswer(challenge.state.currentQuestion.answer);
    expect(challenge.state.score).toBe(35);
    await changePlayer();

    const lea = stored('lea');
    expect(lea.coins).toBe(3 + 4);
    const played = lea.modeStats.modes.challenge['×'];
    expect(played).toMatchObject({ games: 1, questions: 3, correct: 3 });
    // Le bilan du défi, que seul l'abandon enregistre : une partie jouée, sans record
    expect(lea.challengeStats.easy).toMatchObject({ totalPlayed: 1, totalQuestions: 3 });
    expect(played.best).toEqual({});
    expect(lea.bestStreak).toBe(3);
    expect(stored('tom')).toEqual(tomBefore);

    // Le temps du Défi quitté finit de s'écouler : ni record chez Léa, ni rien chez Tom
    await flush(120000);
    expect(stored('tom')).toEqual(tomBefore);
    expect(stored('lea')).toEqual(lea);
  });
});

describe('Changer de joueur pendant un jeu d’Arcade', () => {
  /** Écran d'une partie de MultiPop lancée par le joueur courant, score affiché au bandeau */
  function startArcadeGame(score) {
    const board = Object.assign(document.createElement('div'), { className: 'arcade-game-ui' });
    const shown = Object.assign(document.createElement('span'), { id: 'multipop-info-score' });
    shown.textContent = String(score);
    board.append(shown, Object.assign(document.createElement('span'), { id: 'arcade-info-timer' }));
    document.getElementById('game').replaceChildren(board);
    gameState.gameMode = 'multipop';
    arcade.startArcadeTimer(60);
  }
  const multipop = name => stored(name).modeStats?.modes?.multipop;

  test('la partie jouée compte chez Léa avec son score ; rien chez Tom, même s’il relance le jeu', async () => {
    const tomBefore = stored('tom');
    leaveGame = () => {
      arcade.stopArcadeMode();
      UserManager.selectUser('tom');
    };
    startArcadeGame(260);
    noteArcadePlay();
    await changePlayer();

    const lea = stored('lea');
    expect(multipop('lea')['×']).toEqual({ games: 1, total: 260, best: 260 });
    expect(lea.modeStats.arcadeTop5.multipop).toEqual([260]);
    expect(stored('tom')).toEqual(tomBefore);

    // Tom lance le jeu (chaque lancement arrête d'abord l'Arcade) et le quitte sans jouer
    arcade.stopArcadeMode();
    startArcadeGame(260);
    arcade.stopArcadeMode();
    expect(multipop('tom')).toBeUndefined();
    expect(stored('lea')).toEqual(lea);

    // Sa propre partie, jouée, est la sienne ; celle de Léa ne bouge pas
    startArcadeGame(40);
    noteArcadePlay();
    arcade.stopArcadeMode();
    expect(multipop('tom')['×']).toEqual({ games: 1, total: 40, best: 40 });
    expect(stored('tom').coins).toBe(7);
    expect(stored('lea')).toEqual(lea);
  });
});
