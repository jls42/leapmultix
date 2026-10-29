/* eslint-env jest, node */
/**
 * Aventure de la division, niveaux 9 et 10 : des phrases de divisibilité à juger
 * (« 2213 est divisible par 3 », Vrai ou Faux), sur les vraies traductions.
 * - seuls ces deux niveaux en posent, une question sur trois en moyenne ;
 * - la phrase s'affiche en police de lecture, se lit à voix haute et se retraduit ;
 * - une erreur montre ce qu'on regarde et le critère du diviseur, jamais « 2213 ÷ 3 » ;
 * - les stats de la division ne comptent pas ces phrases, l'historique les garde.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'node:fs';
import { createSlidesMock, createUserStateMock } from '../helpers/mode-test-helpers.mjs';

const speak = jest.fn();
jest.unstable_mockModule('../../js/speech.js', () => ({
  speak,
  preloadSpeech: () => {},
  isVoiceEnabled: () => true,
  updateSpeechVoice: () => {},
  cancelSpeech: () => {},
  whenSpeechEnds: () => Promise.resolve(),
}));
const recordOperationResult = jest.fn();
jest.unstable_mockModule('../../js/core/operation-stats.js', () => ({ recordOperationResult }));
const userStore = { preferredOperator: '÷', progressHistory: [] };
jest.unstable_mockModule('../../js/core/userState.js', () => createUserStateMock(userStore));
jest.unstable_mockModule('../../js/slides.js', () => createSlidesMock(jest));
jest.unstable_mockModule('../../js/badges.js', () => ({
  badges: {},
  getAllBadges: () => [],
  checkAndUnlockBadge: () => {},
}));

const store = await import('../../js/i18n-store.js');
const { AudioManager } = await import('../../js/core/audio.js');
const { AdventureMode } = await import('../../js/modes/AdventureMode.js');
const { DIVISIBILITY_LEVEL_IDS } = await import('../../js/core/adventure-data.js');
const { isDivisible } = await import('../../js/core/divisibility.js');
const { keepNumbersTogether } = await import('../../js/ui-feedback.js');

const translations = Object.fromEntries(
  ['fr', 'en'].map(lang => [
    lang,
    JSON.parse(fs.readFileSync(`assets/translations/${lang}.json`, 'utf8')),
  ])
);
const FR = translations.fr;
const DRAWS = 300;

/** Questions tirées par un niveau : leurs types */
async function drawnTypes(operator, level) {
  userStore.preferredOperator = operator;
  const adventure = new AdventureMode();
  await adventure.start();
  await adventure.startLevel(level);
  const types = [];
  for (let i = 0; i < DRAWS; i++) {
    types.push(adventure.getQuestionOptions().type);
  }
  adventure.stop();
  return types;
}

/** Une Aventure de la division au niveau 9, sur une question de divisibilité */
async function divisibilityQuestion() {
  userStore.preferredOperator = '÷';
  const adventure = new AdventureMode();
  await adventure.start();
  await adventure.startLevel(9);
  for (let i = 0; i < DRAWS && adventure.state.currentQuestion?.type !== 'divisibility'; i++) {
    adventure.hideContinueButton();
    adventure.state.isActive = true;
    adventure.generateQuestion();
  }
  expect(adventure.state.currentQuestion.type).toBe('divisibility');
  return adventure;
}

const optionLabels = adventure =>
  [...adventure.optionsElement.querySelectorAll('.option')].map(b => b.textContent.trim());

beforeEach(() => {
  document.body.innerHTML =
    '<section id="slide4" class="slide"><div id="game"></div></section><div id="results"></div>';
  globalThis.scrollTo = jest.fn();
  window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  jest.spyOn(AudioManager, 'playSound').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
  store.setTranslations(FR);
  store.setCurrentLanguage('fr');
  userStore.progressHistory = [];
  speak.mockClear();
  recordOperationResult.mockClear();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Quels niveaux posent des questions de divisibilité', () => {
  test.each(DIVISIBILITY_LEVEL_IDS)('division, niveau %i : une question sur trois', async level => {
    const share = (await drawnTypes('÷', level)).filter(t => t === 'divisibility').length / DRAWS;
    expect(share).toBeGreaterThan(0.2);
    expect(share).toBeLessThan(0.47);
  });

  test.each([1, 4, 8])('division, niveau %i : jamais', async level => {
    expect(await drawnTypes('÷', level)).not.toContain('divisibility');
  });

  test.each(['×', '+', '−'])('%s, niveau 10 : jamais', async operator => {
    expect(await drawnTypes(operator, 10)).not.toContain('divisibility');
  });
});

describe('Une phrase à juger', () => {
  test('affichée en phrase, lue telle quelle, avec Vrai et Faux pour réponses', async () => {
    const adventure = await divisibilityQuestion();
    const { question, a, b } = adventure.state.currentQuestion;
    expect(question).toBe(`${a} est divisible par ${b}`);
    expect(adventure.questionElement.textContent).toBe(keepNumbersTogether(question));
    expect(adventure.questionElement.classList.contains('is-sentence')).toBe(true);
    expect(optionLabels(adventure)).toEqual(['Vrai', 'Faux']);
    expect(adventure.spokenQuestionText(adventure.questionElement.textContent)).toBe(question);
    adventure.stop();
  });

  test('une erreur : ce qu’on regarde et le critère, jamais le quotient', async () => {
    const adventure = await divisibilityQuestion();
    const { a, b, answer } = adventure.state.currentQuestion;
    speak.mockClear();
    adventure.handleAnswer(!answer);
    const feedback = adventure.feedbackElement.textContent;
    expect(feedback).toContain(
      answer ? 'La bonne réponse est Vrai.' : 'La bonne réponse est Faux.'
    );
    expect(feedback).toContain(keepNumbersTogether(FR[`division_tip_${b}`]));
    const looked = [b === 3 || b === 9 ? 'Somme des chiffres' : 'Dernier chiffre'];
    looked.forEach(label => expect(feedback).toContain(label));
    expect(feedback).not.toContain('÷');
    expect(feedback).not.toContain(String(a / b));
    // Dit : la phrase d'erreur du vrai/faux, déjà enregistrée
    const said = speak.mock.calls.map(([text]) => text);
    expect(said).toContain(
      `${FR.incorrect} ${answer ? FR.incorrect_answer_was_true : FR.incorrect_answer_was_false}`
    );
    adventure.stop();
  });

  test('pas de stats de la division, mais l’historique garde la phrase', async () => {
    const adventure = await divisibilityQuestion();
    const { question, a, b } = adventure.state.currentQuestion;
    recordOperationResult.mockClear();
    adventure.handleAnswer(isDivisible(a, b));
    expect(recordOperationResult).not.toHaveBeenCalled();
    expect(userStore.progressHistory.at(-1)).toMatchObject({
      question,
      correct: true,
      operator: '÷',
      level: 9,
    });
    adventure.stop();
  });

  test('une division ordinaire du même niveau compte toujours dans les stats', async () => {
    userStore.preferredOperator = '÷';
    const adventure = new AdventureMode();
    await adventure.start();
    await adventure.startLevel(9);
    for (let i = 0; i < DRAWS && adventure.state.currentQuestion?.type !== 'mcq'; i++) {
      adventure.hideContinueButton();
      adventure.state.isActive = true;
      adventure.generateQuestion();
    }
    const { a, b, answer } = adventure.state.currentQuestion;
    recordOperationResult.mockClear();
    adventure.handleAnswer(answer);
    expect(recordOperationResult).toHaveBeenCalledWith('÷', a, b, true);
    adventure.stop();
  });

  test('un changement de langue retraduit la phrase et les réponses', async () => {
    const adventure = await divisibilityQuestion();
    const { a, b } = adventure.state.currentQuestion;
    store.setTranslations(translations.en);
    store.setCurrentLanguage('en');
    await adventure.refreshTexts();
    expect(adventure.state.currentQuestion.question).toBe(`${a} is divisible by ${b}`);
    expect(adventure.questionElement.textContent).toBe(
      keepNumbersTogether(`${a} is divisible by ${b}`)
    );
    expect(optionLabels(adventure)).toEqual(['True', 'False']);
    adventure.stop();
  });
});
