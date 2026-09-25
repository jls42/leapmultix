/* eslint-env jest, node */
/**
 * La vraie file de parole (js/speech.js) sous les vrais modes : annonce, question, bip,
 * « Bravo », question suivante. Un moteur factice note chaque phrase qu'on lui confie et
 * ne la finit que quand le test le décide.
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
const { setSpeechEngine } = await import('../../js/speech.js');
const { QuizMode } = await import('../../js/modes/QuizMode.js');
const { ChallengeMode } = await import('../../js/modes/ChallengeMode.js');
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

function createFakeEngine() {
  const starts = [];
  return {
    starts,
    texts: () => starts.map(s => s.text),
    last: () => starts.at(-1),
    start(text, ctx) {
      const handle = { stop: jest.fn(), setVolume: jest.fn() };
      starts.push({ text, ctx, handle });
      return handle;
    },
  };
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function showKnownQuestion(mode) {
  mode.state.currentQuestion = { ...KNOWN };
  mode.displayQuestion();
}

function option(mode, wrong) {
  const buttons = [...document.querySelectorAll(`#${mode}-options .option`)];
  return buttons.find(b => (b.dataset.value === '8') !== wrong);
}

let engine;

beforeAll(() => {
  store.setTranslations({
    quiz_mode: 'Mode Quiz',
    challenge_mode: 'Mode Défi',
    incorrect: 'Presque !',
    correct: 'Bravo !',
    feedback_incorrect: 'La bonne réponse est {correctAnswer}.',
    challenge_feedback_incorrect: 'La bonne réponse est {correctAnswer}.',
    challenge_feedback_correct: 'Correct ! +{points} points',
    speech_times: 'fois',
    speech_plus: 'plus',
    speech_minus: 'moins',
    speech_divided_by: 'divisé par',
    speech_equals: 'égale',
    speech_question: 'Combien font {expression} ?',
    speech_gap_question: '{a} {operator} combien égale {result} ?',
    continue: 'Continuer',
    // Énoncés de problèmes : la question tirée au hasard peut en être un
    problem_templates: ['Si j’ai {num} boîtes de {table} pommes, combien de pommes ai-je ?'],
    problem_templates_addition: ['J’ai {a} billes et {b} de plus. Combien en tout ?'],
    problem_templates_subtraction: ['J’ai {a} billes et j’en donne {b}. Combien en reste-t-il ?'],
    problem_templates_division: ['{a} billes dans {b} boîtes. Combien par boîte ?'],
  });
  store.setCurrentLanguage('fr');
});

beforeEach(() => {
  localStorage.setItem('voiceEnabled', 'true');
  document.body.innerHTML =
    '<section id="slide4" class="slide"><div id="game"></div></section><div id="results"></div>';
  globalThis.scrollTo = jest.fn();
  engine = createFakeEngine();
  setSpeechEngine(engine);
  slides.goToSlide.mockReset();
  jest.spyOn(AudioManager, 'playSound').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  setSpeechEngine(null);
  localStorage.removeItem('voiceEnabled');
  jest.restoreAllMocks();
});

describe('Démarrage d’un mode', () => {
  test('l’annonce attend la navigation, qui arrête l’ancien mode', async () => {
    let arrive;
    slides.goToSlide.mockImplementation(
      () =>
        new Promise(resolve => {
          arrive = resolve;
        })
    );
    const quiz = new QuizMode();
    const started = quiz.start();
    await wait(0);
    expect(engine.texts()).toEqual([]);

    arrive();
    await started;
    expect(engine.texts()[0]).toBe('Mode Quiz');
    quiz.stop();
  });

  test('la première question attend la fin de l’annonce, en énoncé séparé', async () => {
    const quiz = new QuizMode();
    await quiz.start();
    const question = quiz.spokenQuestionText();
    expect(engine.texts()).toEqual(['Mode Quiz']);

    engine.starts[0].ctx.onEnded();
    expect(engine.texts()).toEqual(['Mode Quiz', question]);
    quiz.stop();
  });
});

describe('Quiz : bip, « Bravo », question suivante', () => {
  async function quizOnKnownQuestion() {
    const quiz = new QuizMode();
    await quiz.start();
    engine.starts[0].ctx.onEnded();
    showKnownQuestion(quiz);
    quiz.speakQuestion();
    return quiz;
  }

  test('répondre coupe la question ; « Bravo » part après le bip ; la question suivante l’attend', async () => {
    const quiz = await quizOnKnownQuestion();
    const reading = engine.last();
    expect(reading.text).toBe('Combien font 4 fois 2 ?');

    option('quiz', false).click();
    expect(reading.handle.stop).toHaveBeenCalledTimes(1);
    expect(engine.last()).toBe(reading);

    await wait(GOOD_SOUND_MS + 30);
    const bravo = engine.last();
    expect(bravo.text).toBe('Bravo !');

    // Question suivante affichée pendant que « Bravo » parle : elle attend sa fin
    await wait(quiz.config.nextQuestionDelay);
    expect(engine.last()).toBe(bravo);
    expect(bravo.handle.stop).not.toHaveBeenCalled();

    bravo.ctx.onEnded();
    expect(engine.last().text).toBe(quiz.spokenQuestionText());
    quiz.stop();
  });

  test('une réponse donnée avant que la question en file parte l’abandonne', async () => {
    const quiz = await quizOnKnownQuestion();
    option('quiz', false).click();
    await wait(GOOD_SOUND_MS + 30);
    const bravo = engine.last();
    await wait(quiz.config.nextQuestionDelay);

    // L'enfant répond à la question affichée avant d'avoir entendu sa lecture
    const before = engine.starts.length;
    quiz.handleAnswer(quiz.state.currentQuestion.answer);
    expect(bravo.handle.stop).toHaveBeenCalledTimes(1);
    bravo.ctx.onEnded();
    expect(engine.starts.slice(before).map(s => s.text)).toEqual([]);

    await wait(GOOD_SOUND_MS + 30);
    expect(engine.last().text).toBe('Bravo !');
    quiz.stop();
  });

  test('« Continuer » coupe l’explication, même quand la partie s’arrête là', async () => {
    const quiz = await quizOnKnownQuestion();
    // Dernière question : « Continuer » mène à la fin de partie, sans question à lire
    quiz.state.questionCount = quiz.config.maxQuestions - 1;
    option('quiz', true).click();
    const explanation = engine.last();
    expect(explanation.text.startsWith('Presque ! La bonne réponse est 8.')).toBe(true);

    quiz.continueAfterError();
    expect(explanation.handle.stop).toHaveBeenCalledTimes(1);
    expect(engine.last()).toBe(explanation);
    quiz.stop();
  });

  test('sortir du mode coupe la phrase en cours', async () => {
    const quiz = await quizOnKnownQuestion();
    const reading = engine.last();
    quiz.stop();
    expect(reading.handle.stop).toHaveBeenCalledTimes(1);
  });
});

describe('Défi : la question suivante coupe la fin de l’explication', () => {
  test('après une erreur, la question suivante part sans attendre', async () => {
    const challenge = new ChallengeMode();
    await challenge.start();
    document.querySelector('.difficulty-btn[data-difficulty="easy"]').click();
    await wait(20);
    showKnownQuestion(challenge);
    challenge.speakQuestion();

    option('challenge', true).click();
    const explanation = engine.last();
    expect(explanation.text).toBe('Presque ! La bonne réponse est 8.');

    await wait(challenge.config.wrongAnswerDelay + 50);
    expect(explanation.handle.stop).toHaveBeenCalledTimes(1);
    expect(engine.last().text).toBe(challenge.spokenQuestionText());
    challenge.stop();
  }, 10000);
});
