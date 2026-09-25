/* eslint-env jest, node */
/**
 * Les vrais modes jouent, dans les trois langues et pour les quatre opérations : tout
 * ce qu'ils passent à speak(), ou chargent d'avance (preloadSpeech), doit figurer dans
 * le corpus de la voix enregistrée (scripts/voice/corpus.mjs). Une phrase absente du
 * corpus n'aurait pas de clip : elle retomberait sur la voix de l'appareil sans que
 * personne ne le voie.
 */
import { describe, test, expect, beforeAll, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'node:fs';
import { createSlidesMock, createUserStateMock } from '../helpers/mode-test-helpers.mjs';

const speak = jest.fn();
const preloadSpeech = jest.fn();
jest.unstable_mockModule('../../js/speech.js', () => ({
  speak,
  preloadSpeech,
  isVoiceEnabled: () => true,
  updateSpeechVoice: () => {},
  cancelSpeech: () => {},
}));
jest.unstable_mockModule('../../js/core/operation-stats.js', () => ({
  recordOperationResult: () => {},
}));
const userStore = { preferredOperator: '×', progressHistory: [] };
jest.unstable_mockModule('../../js/core/userState.js', () => createUserStateMock(userStore));
jest.unstable_mockModule('../../js/slides.js', () => createSlidesMock(jest));
jest.unstable_mockModule('../../js/badges.js', () => ({
  badges: {},
  getAllBadges: () => [],
  checkAndUnlockBadge: () => {},
}));

const store = await import('../../js/i18n-store.js');
const { AudioManager } = await import('../../js/core/audio.js');
const { QuizMode } = await import('../../js/modes/QuizMode.js');
const { ChallengeMode } = await import('../../js/modes/ChallengeMode.js');
const { AdventureMode } = await import('../../js/modes/AdventureMode.js');
const { DiscoveryMode } = await import('../../js/modes/DiscoveryMode.js');
const { buildCorpus } = await import('../../scripts/voice/corpus.mjs');
const { normalizeSpokenText } = await import('../../js/core/spoken-text.js');

const LANGS = ['fr', 'en', 'es'];
const OPERATORS = ['×', '+', '−', '÷'];
const QUESTIONS_PER_MODE = 40;

const translations = Object.fromEntries(
  LANGS.map(lang => [lang, JSON.parse(fs.readFileSync(`assets/translations/${lang}.json`, 'utf8'))])
);

/** Répond à la question affichée : juste une fois sur deux, sinon une autre proposition */
function answer(mode, index) {
  const { answer: expected } = mode.state.currentQuestion;
  const values = [...mode.optionsElement.querySelectorAll('.option')].map(b => b.dataset.value);
  const wrong = values.find(value => value !== String(expected));
  mode.handleAnswer(index % 2 === 0 || wrong === undefined ? expected : coerce(wrong, expected));
}

/** Une proposition garde le type de la réponse (nombre, ou booléen du vrai/faux) */
function coerce(value, expected) {
  if (typeof expected === 'boolean') return value === 'true';
  return typeof expected === 'number' ? Number(value) : value;
}

/** Enchaîne des questions, sans attendre les délais de l'avance automatique */
function playQuestions(mode, count = QUESTIONS_PER_MODE) {
  for (let i = 0; i < count; i++) {
    mode.hideContinueButton();
    mode.state.isActive = true;
    mode.generateQuestion();
    answer(mode, i);
  }
}

function spokenTexts() {
  return speak.mock.calls.map(([text]) => normalizeSpokenText(text));
}

function preloadedTexts() {
  return preloadSpeech.mock.calls.flatMap(([texts]) => texts).map(normalizeSpokenText);
}

/** Une réponse fausse, quelle que soit la forme de la question */
function wrongAnswerFor(expected) {
  if (typeof expected === 'boolean') return !expected;
  return typeof expected === 'number' ? expected + 1 : `${expected}?`;
}

/**
 * Questions toutes ratées : la phrase d'erreur dite doit être l'une de celles chargées
 * d'avance pendant la question (sinon le préchargement ne sert à rien)
 * @returns {{said: string, preloaded: string[]}[]} Les erreurs dites sans préchargement
 */
function errorsWithoutPreload(mode, count) {
  const misses = [];
  for (let i = 0; i < count; i++) {
    mode.hideContinueButton();
    mode.state.isActive = true;
    speak.mockClear();
    preloadSpeech.mockClear();
    mode.generateQuestion();
    const preloaded = preloadedTexts();
    speak.mockClear();
    mode.handleAnswer(wrongAnswerFor(mode.state.currentQuestion.answer));
    const said = spokenTexts();
    if (said.length !== 1 || !preloaded.includes(said[0])) misses.push({ said, preloaded });
  }
  return misses;
}

/** Opérandes d'un élément à glisser : l'élément lui-même et la valeur fixée */
function dropOperands(drop, item) {
  return drop.fixed === 'b' ? [item, drop.value] : [drop.value, item];
}

/** Fait dire tout ce qu'une visite de la découverte dit : exemples, visuel, égalités à glisser */
function speakDiscoveryPlan(mode, plan) {
  for (const { a, b } of [...plan.examples, ...plan.visual]) mode.speakOperation(a, b);
  for (const item of plan.drop.items) {
    const [a, b] = dropOperands(plan.drop, item);
    const result = mode.operation.compute(a, b);
    if (Number.isInteger(result) && result >= 0) mode.speakOperation(a, b);
  }
}

beforeEach(() => {
  document.body.innerHTML =
    '<section id="slide4" class="slide"><div id="game"></div></section><div id="results"></div>';
  globalThis.scrollTo = jest.fn();
  window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  jest.spyOn(AudioManager, 'playSound').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
  speak.mockClear();
});

afterEach(() => {
  jest.restoreAllMocks();
  store.setTranslations({});
  store.setCurrentLanguage('fr');
});

describe.each(LANGS)('%s : les phrases des modes sont toutes dans le corpus', lang => {
  let corpus;

  beforeAll(() => {
    corpus = new Set(buildCorpus(lang).map(entry => entry.text));
  });

  beforeEach(() => {
    store.setTranslations(translations[lang]);
    store.setCurrentLanguage(lang);
    preloadSpeech.mockClear();
  });

  function expectAllInCorpus() {
    const spoken = spokenTexts();
    expect(spoken.length).toBeGreaterThan(0);
    expect(spoken.filter(text => !corpus.has(text))).toEqual([]);
    expect(preloadedTexts().filter(text => !corpus.has(text))).toEqual([]);
  }

  test.each(OPERATORS)('Quiz, %s : questions de toutes formes, bravos et erreurs', async op => {
    userStore.preferredOperator = op;
    const quiz = new QuizMode();
    await quiz.start();
    playQuestions(quiz);
    quiz.stop();
    expectAllInCorpus();
  });

  test.each(OPERATORS)('Défi, %s : questions, bravos et erreurs', async op => {
    userStore.preferredOperator = op;
    const challenge = new ChallengeMode();
    await challenge.start();
    document.querySelector('.difficulty-btn[data-difficulty="easy"]').click();
    await new Promise(resolve => setTimeout(resolve, 20));
    playQuestions(challenge);
    challenge.stop();
    expectAllInCorpus();
  });

  test.each(OPERATORS)('Aventure, %s : chaque niveau, facteurs parfois inversés', async op => {
    userStore.preferredOperator = op;
    const adventure = new AdventureMode();
    await adventure.start();
    for (let level = 1; level <= 10; level++) {
      await adventure.startLevel(level);
      playQuestions(adventure, 12);
    }
    adventure.stop();
    expectAllInCorpus();
  });

  test.each(OPERATORS)('%s : la phrase d’erreur dite est celle chargée d’avance', async op => {
    userStore.preferredOperator = op;
    const quiz = new QuizMode();
    await quiz.start();
    expect(errorsWithoutPreload(quiz, 30)).toEqual([]);
    quiz.stop();

    const challenge = new ChallengeMode();
    await challenge.start();
    document.querySelector('.difficulty-btn[data-difficulty="easy"]').click();
    await new Promise(resolve => setTimeout(resolve, 20));
    expect(errorsWithoutPreload(challenge, 30)).toEqual([]);
    challenge.stop();

    const adventure = new AdventureMode();
    await adventure.start();
    await adventure.startLevel(3);
    expect(errorsWithoutPreload(adventure, 12)).toEqual([]);
    adventure.stop();
  });

  test.each(OPERATORS)('Découverte, %s : tables, niveaux et égalités dites', async op => {
    userStore.preferredOperator = op;
    const mode = new DiscoveryMode();
    await mode.start();
    const choices = op === '×' ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] : ['easy', 'medium', 'hard'];
    for (const choice of choices) {
      if (op === '×') await mode.showTable(choice);
      else await mode.showLevel(choice);
      // Plusieurs visites : diviseur et premier terme sont tirés au hasard
      for (let visit = 0; visit < 8; visit++) speakDiscoveryPlan(mode, mode._buildPlan());
    }
    mode.stop();
    expectAllInCorpus();
  });
});
