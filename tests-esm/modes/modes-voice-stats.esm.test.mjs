/* eslint-env jest, node */
/**
 * Voix et statistiques des modes Quiz, Défi et Aventure.
 * - Défi : après une erreur, la phrase entière est lue (« Presque ! La bonne réponse
 *   est 8. »), rien ne la coupe ; après une bonne réponse, un seul encouragement.
 * - Aventure : chaque question est lue à voix haute, comme au Quiz et au Défi, avec les
 *   facteurs dans l'ordre affiché (« Combien font 7 fois 8 ? »).
 * - Une réponse n'est enregistrée qu'une fois dans les statistiques d'opérations.
 */
import { describe, test, expect, beforeAll, beforeEach, afterEach, jest } from '@jest/globals';
import { createSlidesMock, createUserStateMock } from '../helpers/mode-test-helpers.mjs';

const speak = jest.fn();
jest.unstable_mockModule('../../js/speech.js', () => ({
  speak,
  isVoiceEnabled: () => true,
  updateSpeechVoice: () => {},
  cancelSpeech: () => {},
  preloadSpeech: () => {},
}));
const recordOperationResult = jest.fn();
jest.unstable_mockModule('../../js/core/operation-stats.js', () => ({ recordOperationResult }));
const userStore = { preferredOperator: '×', progressHistory: [] };
jest.unstable_mockModule('../../js/core/userState.js', () => createUserStateMock(userStore));
jest.unstable_mockModule('../../js/slides.js', () => createSlidesMock(jest));
jest.unstable_mockModule('../../js/badges.js', () => ({
  badges: {},
  getAllBadges: () => [],
  checkAndUnlockBadge: jest.fn(),
}));

const store = await import('../../js/i18n-store.js');
const { AudioManager } = await import('../../js/core/audio.js');
const { QuizMode } = await import('../../js/modes/QuizMode.js');
const { ChallengeMode } = await import('../../js/modes/ChallengeMode.js');
const { AdventureMode } = await import('../../js/modes/AdventureMode.js');
const { GOOD_SOUND_MS } = await import('../../js/core/GameMode.js');

const KNOWN = {
  question: '4 × 2 = ?',
  answer: 8,
  type: 'mcq',
  operator: '×',
  a: 4,
  b: 2,
  table: 4,
  num: 2,
};

function showKnownQuestion(mode) {
  mode.state.currentQuestion = { ...KNOWN };
  mode.displayQuestion();
}

function option(mode, wrong) {
  const buttons = [...document.querySelectorAll(`#${mode}-options .option`)];
  return wrong
    ? buttons.find(b => b.dataset.value !== '8')
    : buttons.find(b => b.dataset.value === '8');
}

beforeAll(() => {
  store.setTranslations({
    incorrect: 'Presque !',
    correct: 'Bravo !',
    challenge_feedback_incorrect: 'La bonne réponse est {correctAnswer}.',
    challenge_feedback_correct: 'Correct ! +{points} points',
    feedback_incorrect: 'La bonne réponse est {correctAnswer}.',
    adventure_feedback_correct: 'Correct !',
    speech_times: 'fois',
    speech_equals: 'égale',
    speech_question: 'Combien font {expression} ?',
    speech_gap_question: '{a} {operator} combien égale {result} ?',
    continue: 'Continuer',
  });
  store.setCurrentLanguage('fr');
});

beforeEach(() => {
  document.body.innerHTML =
    '<section id="slide4" class="slide"><div id="game"></div></section><div id="results"></div>';
  globalThis.scrollTo = jest.fn();
  speak.mockClear();
  recordOperationResult.mockClear();
  jest.spyOn(AudioManager, 'playSound').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

async function startChallenge() {
  const challenge = new ChallengeMode();
  await challenge.start();
  document.querySelector('.difficulty-btn[data-difficulty="easy"]').click();
  await new Promise(r => setTimeout(r, 20));
  showKnownQuestion(challenge);
  speak.mockClear();
  return challenge;
}

describe('Défi : la voix', () => {
  test('après une erreur, la phrase entière est lue, rien ne la coupe', async () => {
    const challenge = await startChallenge();
    option('challenge', true).click();

    const spoken = speak.mock.calls.map(([text]) => text);
    expect(spoken).toEqual(['Presque ! La bonne réponse est 8.']);
    challenge.stop();
  });

  test('après une bonne réponse, le bip seul, puis un seul encouragement', async () => {
    const challenge = await startChallenge();
    option('challenge', false).click();

    // « Bravo » ne couvre pas le bip : il part juste après lui
    expect(AudioManager.playSound.mock.calls.map(([name]) => name)).toEqual(['good']);
    expect(speak).not.toHaveBeenCalled();
    await new Promise(r => setTimeout(r, GOOD_SOUND_MS + 20));
    const spoken = speak.mock.calls.map(([text]) => text);
    expect(spoken).toEqual(['Bravo !']);
    challenge.stop();
  });
});

describe('Quiz : chaque forme de question se dit sans la réponse', () => {
  test('question à trou : le nombre connu et le résultat', async () => {
    const quiz = new QuizMode();
    await quiz.start();
    quiz.state.currentQuestion = {
      question: '7 × ? = 56',
      answer: 8,
      type: 'gap',
      operator: '×',
      a: 7,
      b: 8,
    };
    speak.mockClear();
    quiz.speakQuestion();
    expect(speak).toHaveBeenCalledWith('7 fois combien égale 56 ?');
    quiz.stop();
  });

  test('vrai/faux : l’égalité proposée, lue telle quelle', async () => {
    const quiz = new QuizMode();
    await quiz.start();
    quiz.state.currentQuestion = {
      question: '8 × 6 = 47',
      answer: false,
      type: 'true_false',
      operator: '×',
      a: 8,
      b: 6,
    };
    speak.mockClear();
    quiz.speakQuestion();
    expect(speak).toHaveBeenCalledWith('8 fois 6 égale 47');
    quiz.stop();
  });
});

describe('Aventure : la voix', () => {
  test('chaque question est lue à voix haute, sans la réponse, dans l’ordre affiché', async () => {
    const adventure = new AdventureMode();
    await adventure.start();
    speak.mockClear();
    await adventure.startLevel(1);

    const shown = document.getElementById('adventure-question').textContent;
    const [a, , b] = shown.split(' ');
    expect(speak).toHaveBeenCalledWith(`Combien font ${a} fois ${b} ?`);
    adventure.stop();
  });
});

describe('Statistiques d’opérations : une réponse, un enregistrement', () => {
  test('Quiz', async () => {
    const quiz = new QuizMode();
    await quiz.start();
    showKnownQuestion(quiz);
    recordOperationResult.mockClear();
    option('quiz', true).click();
    expect(recordOperationResult).toHaveBeenCalledTimes(1);
    expect(recordOperationResult).toHaveBeenCalledWith('×', 4, 2, false);
    quiz.stop();
  });

  test('Défi', async () => {
    const challenge = await startChallenge();
    recordOperationResult.mockClear();
    option('challenge', false).click();
    expect(recordOperationResult).toHaveBeenCalledTimes(1);
    expect(recordOperationResult).toHaveBeenCalledWith('×', 4, 2, true);
    challenge.stop();
  });
});
