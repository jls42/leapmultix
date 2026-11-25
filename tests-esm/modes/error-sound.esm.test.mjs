/* eslint-env jest, node */
/**
 * Un seul signal sonore par erreur, au Quiz, au Défi et en Aventure : la voix quand elle dit
 * « Raté ! La bonne réponse est 8. », sinon le son doux d'erreur. Jamais les deux, et jamais
 * le silence tant que le son est allumé. La vraie file de parole (js/speech.js) sous les
 * vrais modes, avec un moteur factice qui note chaque phrase.
 */
import { describe, test, expect, beforeAll, beforeEach, afterEach, jest } from '@jest/globals';
import { createSlidesMock, createUserStateMock } from '../helpers/mode-test-helpers.mjs';

jest.unstable_mockModule('../../js/core/operation-stats.js', () => ({
  recordOperationResult: () => {},
}));
const userStore = { preferredOperator: '×', progressHistory: [] };
jest.unstable_mockModule('../../js/core/userState.js', () => createUserStateMock(userStore));
const slides = createSlidesMock(jest);
jest.unstable_mockModule('../../js/slides.js', () => slides);
jest.unstable_mockModule('../../js/badges.js', () => ({
  badges: {},
  getAllBadges: () => [],
  checkAndUnlockBadge: () => {},
}));

const store = await import('../../js/i18n-store.js');
const { AudioManager } = await import('../../js/core/audio.js');
const { setSpeechEngine, willSpeak } = await import('../../js/speech.js');
const { QuizMode } = await import('../../js/modes/QuizMode.js');
const { ChallengeMode } = await import('../../js/modes/ChallengeMode.js');
const { AdventureMode } = await import('../../js/modes/AdventureMode.js');

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
const ERROR_PHRASE = 'Raté ! La bonne réponse est 8.';

const wait = ms => jest.advanceTimersByTimeAsync(ms);

/** Les sons demandés au gestionnaire audio, dans l'ordre */
const sounds = () => AudioManager.playSound.mock.calls.map(([name]) => name);

function showKnownQuestion(mode) {
  mode.state.currentQuestion = { ...KNOWN };
  mode.displayQuestion();
}

const wrongOption = mode =>
  [...document.querySelectorAll(`#${mode}-options .option`)].find(b => b.dataset.value !== '8');

let starts;

beforeAll(() => {
  store.setTranslations({
    quiz_mode: 'Mode Quiz',
    challenge_mode: 'Mode Défi',
    incorrect: 'Raté !',
    correct: 'Bravo !',
    feedback_correct_spoken: 'Oui, {answer} !',
    feedback_incorrect: 'La bonne réponse est {correctAnswer}.',
    challenge_feedback_incorrect: 'La bonne réponse est {correctAnswer}.',
    speech_times: 'fois',
    speech_equals: 'égale',
    speech_question: 'Combien font {expression} ?',
    speech_question_short: '{expression} ?',
    continue: 'Continuer',
    problem_templates: ['Si j’ai {num} boîtes de {table} pommes, combien de pommes ai-je ?'],
  });
  store.setCurrentLanguage('fr');
});

beforeEach(() => {
  jest.useFakeTimers();
  document.body.innerHTML =
    '<section id="slide4" class="slide"><div id="game"></div></section><div id="results"></div>';
  globalThis.scrollTo = jest.fn();
  starts = [];
  setSpeechEngine({
    start(text) {
      starts.push(text);
      return { stop: jest.fn(), setVolume: jest.fn() };
    },
  });
  slides.goToSlide.mockReset();
  jest.spyOn(AudioManager, 'playSound').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.useRealTimers();
  setSpeechEngine(null);
  localStorage.removeItem('voiceEnabled');
  jest.restoreAllMocks();
});

/** Le Quiz sur la question connue, une mauvaise réponse donnée */
async function quizWrongAnswer() {
  const quiz = new QuizMode();
  await quiz.start();
  showKnownQuestion(quiz);
  starts.length = 0;
  AudioManager.playSound.mockClear();
  wrongOption('quiz').click();
  return quiz;
}

/** Le Défi sur la question connue, une mauvaise réponse donnée */
async function challengeWrongAnswer() {
  const challenge = new ChallengeMode();
  await challenge.start();
  document.querySelector('.difficulty-btn[data-difficulty="easy"]').click();
  await wait(20);
  showKnownQuestion(challenge);
  starts.length = 0;
  AudioManager.playSound.mockClear();
  wrongOption('challenge').click();
  return challenge;
}

/** L'Aventure : le retour d'une mauvaise réponse à la question connue, sans la carte */
function adventureWrongFeedback() {
  const adventure = new AdventureMode();
  document.getElementById('game').innerHTML =
    '<div id="adventure-options"></div><div id="adventure-feedback"></div>';
  adventure.optionsElement = document.getElementById('adventure-options');
  adventure.feedbackElement = document.getElementById('adventure-feedback');
  adventure.state.currentQuestion = { ...KNOWN };
  jest.spyOn(adventure, 'showContinueButton').mockImplementation(() => {});
  adventure.showAnswerFeedback(false, 6);
  return adventure;
}

describe('willSpeak : la phrase serait-elle dite ?', () => {
  test('oui quand la voix est allumée, non quand elle est éteinte ou la phrase vide', () => {
    localStorage.setItem('voiceEnabled', 'true');
    expect(willSpeak(ERROR_PHRASE)).toBe(true);
    expect(willSpeak('  ')).toBe(false);
    expect(willSpeak(null)).toBe(false);
    localStorage.setItem('voiceEnabled', 'false');
    expect(willSpeak(ERROR_PHRASE)).toBe(false);
  });
});

describe('Voix allumée : elle dit l’erreur, sans son d’erreur', () => {
  beforeEach(() => localStorage.setItem('voiceEnabled', 'true'));

  test('Quiz', async () => {
    const quiz = await quizWrongAnswer();
    expect(starts).toHaveLength(1);
    expect(starts[0].startsWith(ERROR_PHRASE)).toBe(true);
    expect(sounds()).not.toContain('bad');
    quiz.stop();
  });

  test('Défi', async () => {
    const challenge = await challengeWrongAnswer();
    expect(starts).toEqual([ERROR_PHRASE]);
    expect(sounds()).not.toContain('bad');
    challenge.stop();
  }, 10000);

  test('Aventure', () => {
    const adventure = adventureWrongFeedback();
    expect(starts).toHaveLength(1);
    expect(starts[0].startsWith(ERROR_PHRASE)).toBe(true);
    expect(sounds()).not.toContain('bad');
    adventure.stop();
  });
});

describe('Voix éteinte : le son doux d’erreur, une fois, et aucune phrase', () => {
  beforeEach(() => localStorage.setItem('voiceEnabled', 'false'));

  test('Quiz', async () => {
    const quiz = await quizWrongAnswer();
    expect(starts).toEqual([]);
    expect(sounds()).toEqual(['bad']);
    quiz.stop();
  });

  test('Défi', async () => {
    const challenge = await challengeWrongAnswer();
    expect(starts).toEqual([]);
    expect(sounds()).toEqual(['bad']);
    challenge.stop();
  }, 10000);

  test('Aventure', () => {
    const adventure = adventureWrongFeedback();
    expect(starts).toEqual([]);
    expect(sounds()).toEqual(['bad']);
    adventure.stop();
  });
});
