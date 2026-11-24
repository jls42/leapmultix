/* eslint-env jest, node */
/**
 * Voix et statistiques des modes Quiz, Défi et Aventure.
 * - Défi : après une erreur, la phrase entière est lue (« Raté ! La bonne réponse
 *   est 8. »), rien ne la coupe ; après une bonne réponse, un seul encouragement.
 * - Aventure : chaque question est lue à voix haute, comme au Quiz et au Défi, avec les
 *   facteurs dans l'ordre affiché (« Combien font 7 fois 8 ? »).
 * - Quiz et Aventure : une bonne réponse dit le nombre trouvé puis un bravo (« Oui, 8 ! »,
 *   « Bravo ! »), deux parties d'une même phrase, chargées d'avance ; Vrai/Faux garde le
 *   bravo seul.
 * - Une réponse n'est enregistrée qu'une fois dans les statistiques d'opérations.
 */
import { describe, test, expect, beforeAll, beforeEach, afterEach, jest } from '@jest/globals';
import { createSlidesMock, createUserStateMock } from '../helpers/mode-test-helpers.mjs';

const speak = jest.fn();
const preloadSpeech = jest.fn();
jest.unstable_mockModule('../../js/speech.js', () => ({
  speak,
  isVoiceEnabled: () => true,
  updateSpeechVoice: () => {},
  cancelSpeech: () => {},
  preloadSpeech,
  // Rien n'est dit ici : la parole est toujours déjà tue
  whenSpeechEnds: () => Promise.resolve(),
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
const { GOOD_SOUND_MS, correctAnswerParts } = await import('../../js/core/GameMode.js');

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

const TRANSLATIONS = {
  incorrect: 'Raté !',
  correct: 'Bravo !',
  feedback_correct_spoken: 'Oui, {answer} !',
  challenge_feedback_incorrect: 'La bonne réponse est {correctAnswer}.',
  challenge_feedback_correct: 'Correct ! +{points} points',
  feedback_incorrect: 'La bonne réponse est {correctAnswer}.',
  adventure_feedback_correct: 'Correct !',
  speech_times: 'fois',
  speech_equals: 'égale',
  speech_question: 'Combien font {expression} ?',
  speech_gap_question: '{a} {operator} combien égale {result} ?',
  continue: 'Continuer',
};

beforeAll(() => {
  store.setTranslations(TRANSLATIONS);
  store.setCurrentLanguage('fr');
});

beforeEach(() => {
  document.body.innerHTML =
    '<section id="slide4" class="slide"><div id="game"></div></section><div id="results"></div>';
  globalThis.scrollTo = jest.fn();
  speak.mockClear();
  preloadSpeech.mockClear();
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
    expect(spoken).toEqual(['Raté ! La bonne réponse est 8.']);
    challenge.stop();
  });

  test('après une bonne réponse, le bip seul : la voix n’encourage pas à chaque réponse', async () => {
    const challenge = await startChallenge();
    option('challenge', false).click();

    expect(AudioManager.playSound.mock.calls.map(([name]) => name)).toEqual(['good']);
    await new Promise(r => setTimeout(r, GOOD_SOUND_MS + 20));
    expect(speak).not.toHaveBeenCalled();
    challenge.stop();
  });

  test.each([5, 10])(
    'à la %ie bonne réponse de suite, le bip puis un seul encouragement',
    async streak => {
      const challenge = await startChallenge();
      // La série en est à une réponse du palier
      challenge.state.streak = streak - 1;
      option('challenge', false).click();

      // « Bravo » ne couvre pas le bip : il part juste après lui
      expect(AudioManager.playSound.mock.calls.map(([name]) => name)).toEqual(['good']);
      expect(speak).not.toHaveBeenCalled();
      await new Promise(r => setTimeout(r, GOOD_SOUND_MS + 20));
      const spoken = speak.mock.calls.map(([text]) => text);
      expect(spoken).toEqual(['Bravo !']);
      challenge.stop();
    }
  );

  test.each([1, 4, 6, 9])('à la %ie bonne réponse de suite, pas d’encouragement', async streak => {
    const challenge = await startChallenge();
    challenge.state.streak = streak - 1;
    option('challenge', false).click();
    await new Promise(r => setTimeout(r, GOOD_SOUND_MS + 20));
    expect(speak).not.toHaveBeenCalled();
    challenge.stop();
  });
});

describe('Défi et Chrono ne disent pas le nombre : rien à charger d’avance pour lui', () => {
  test('Défi : seule la phrase de l’erreur se charge, le bravo reste seul', async () => {
    const challenge = await startChallenge();
    preloadSpeech.mockClear();
    challenge.speakQuestion();
    expect(preloadSpeech.mock.calls).toEqual([[['Raté ! La bonne réponse est 8.']]]);
    expect(challenge.spokenCorrectParts()).toBeNull();
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

describe('Bonne réponse : le nombre trouvé, puis un bravo', () => {
  const TRUE_FALSE = {
    question: '8 × 6 = 47',
    answer: false,
    type: 'true_false',
    operator: '×',
    a: 8,
    b: 6,
  };

  test('deux parties, le nombre puis le bravo ; Vrai/Faux et divisibilité gardent le bravo seul', () => {
    expect(correctAnswerParts(KNOWN)).toEqual(['Oui, 8 !', 'Bravo !']);
    expect(correctAnswerParts({ ...KNOWN, type: 'gap', answer: 2 })).toEqual([
      'Oui, 2 !',
      'Bravo !',
    ]);
    expect(correctAnswerParts({ ...KNOWN, answer: 0 })).toEqual(['Oui, 0 !', 'Bravo !']);
    expect(correctAnswerParts(TRUE_FALSE)).toEqual(['Bravo !']);
    expect(correctAnswerParts({ type: 'divisibility', answer: true })).toEqual(['Bravo !']);
  });

  test('Quiz : le bip seul, puis « Oui, 8 ! » et « Bravo ! » en une seule phrase', async () => {
    const quiz = new QuizMode();
    await quiz.start();
    showKnownQuestion(quiz);
    speak.mockClear();
    option('quiz', false).click();

    expect(AudioManager.playSound.mock.calls.map(([name]) => name)).toEqual(['good']);
    expect(speak).not.toHaveBeenCalled();
    await new Promise(r => setTimeout(r, GOOD_SOUND_MS + 20));
    // Un seul appel : les deux parties tiennent ensemble dans la file
    expect(speak.mock.calls.map(([text]) => text)).toEqual([['Oui, 8 !', 'Bravo !']]);
    quiz.stop();
  });

  test('Quiz : ce qui est dit est ce qui a été chargé d’avance, bravo compris', async () => {
    store.setTranslations({ ...TRANSLATIONS, correct: ['Un !', 'Deux !', 'Trois !', 'Quatre !'] });
    try {
      const quiz = new QuizMode();
      await quiz.start();
      const pairs = [];
      for (let round = 0; round < 12; round++) {
        showKnownQuestion(quiz);
        preloadSpeech.mockClear();
        quiz.speakQuestion();
        const [loaded] = preloadSpeech.mock.calls.at(-1);
        expect(loaded.slice(0, 2)).toEqual(['Raté ! La bonne réponse est 8.', 'Oui, 8 !']);
        pairs.push([loaded[2], quiz.spokenCorrectParts()[1]]);
      }
      expect(pairs.filter(([loaded, said]) => loaded !== said)).toEqual([]);
      // Le bravo change d'une question à l'autre
      expect(new Set(pairs.map(([loaded]) => loaded)).size).toBeGreaterThan(1);
      quiz.stop();
    } finally {
      store.setTranslations(TRANSLATIONS);
    }
  });

  test('Quiz, Vrai/Faux : le bravo seul', async () => {
    const quiz = new QuizMode();
    await quiz.start();
    quiz.state.currentQuestion = { ...TRUE_FALSE };
    expect(quiz.spokenCorrectParts()).toEqual(['Bravo !']);
    quiz.stop();
  });

  test('Aventure : « Oui, 8 ! » et « Bravo ! », une seule phrase', async () => {
    const adventure = new AdventureMode();
    await adventure.start();
    await adventure.startLevel(1);
    adventure.state.currentQuestion = { ...KNOWN };
    speak.mockClear();
    adventure.showAnswerFeedback(true, 8);
    expect(speak.mock.calls.map(([text]) => text)).toEqual([['Oui, 8 !', 'Bravo !']]);
    adventure.stop();
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
