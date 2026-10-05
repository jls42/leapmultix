/* eslint-env jest, node */
/**
 * Mode Chrono, joué de bout en bout :
 * - une erreur affiche le calcul en entier, et son inverse ne suit pas ;
 * - le chrono s'arrête à la 10e bonne réponse, la partie s'enregistre une fois ;
 * - un abandon n'ajoute rien au classement ni à la liste ;
 * - les résultats relancent par l'orchestrateur : aucune partie ne tourne en arrière-plan ;
 * - l'écran de départ suit la langue.
 */
import { describe, test, expect, beforeAll, beforeEach, afterEach, jest } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { createUserStateMock } from '../helpers/mode-test-helpers.mjs';

const userStore = { preferredOperator: '×', coins: 0 };
jest.unstable_mockModule('../../js/core/userState.js', () => createUserStateMock(userStore));
jest.unstable_mockModule('../../js/lazy-loader.js', () => ({
  lazyLoader: { loadForGameMode: async () => {} },
}));
const updateDailyChallengeProgress = jest.fn();
const gameState = { gameMode: null, avatar: 'fox', streak: 0 };
jest.unstable_mockModule('../../js/game.js', () => ({
  gameState,
  default: gameState,
  updateDailyChallengeProgress,
  displayDailyChallenge: jest.fn(),
}));
const speak = jest.fn();
const preloadSpeech = jest.fn();
jest.unstable_mockModule('../../js/speech.js', () => ({
  speak,
  preloadSpeech,
  isVoiceEnabled: () => true,
  updateSpeechVoice: () => {},
  cancelSpeech: () => {},
  whenSpeechEnds: () => Promise.resolve(),
}));

// Navigation comme slides.js : quitter un écran arrête Chrono, sauf pendant son démarrage
// par l'orchestrateur (c'est ce qui protège une relance depuis les résultats)
let orchestrator;
let chronoModule;
const goToSlide = jest.fn(async () => {
  if (orchestrator?.getStartingMode() !== 'chrono') chronoModule?.stopChronoMode();
});
jest.unstable_mockModule('../../js/slides.js', () => ({
  goToSlide,
  showSlide: jest.fn(),
  hideAllSlides: jest.fn(),
  nextSlide: jest.fn(),
  prevSlide: jest.fn(),
}));

const store = await import('../../js/i18n-store.js');
const { formatMessage } = await import('../../js/core/message-format.js');
const { AudioManager } = await import('../../js/core/audio.js');
orchestrator = await import('../../js/mode-orchestrator.js');
chronoModule = await import('../../js/modes/ChronoMode.js');
const { ChronoMode, stopChronoMode, refreshChronoTexts } = chronoModule;

const translations = lang =>
  JSON.parse(readFileSync(new URL(`../../assets/translations/${lang}.json`, import.meta.url)));
const FR = translations('fr');
const EN = translations('en');

/** Instances créées : pour voir qu'aucune ne tourne encore après un retour à l'accueil */
let instances = [];

async function flush(ms = 0) {
  await jest.advanceTimersByTimeAsync(ms);
}

/** Démarre Chrono comme un clic sur sa tuile, puis une partie (ou une révision) */
async function startChrono({ revision = false, inputMode = 'keypad' } = {}) {
  await orchestrator.setGameMode('chrono');
  await flush();
  const chrono = instances.at(-1);
  chrono.setInputMode(inputMode);
  await chrono.beginSession(revision);
  return chrono;
}

/** Question connue, comme le ferait le tirage */
function showQuestion(chrono, a, b) {
  chrono.state.currentQuestion = {
    question: `${a} × ${b} = ?`,
    answer: a * b,
    type: chrono.inputMode === 'mcq' ? 'mcq' : 'classic',
    operator: '×',
    a,
    b,
    table: a,
    num: b,
  };
  chrono.displayQuestion();
  chrono.onQuestionGenerated();
}

/** Répond à la question affichée, juste ou faux, puis laisse passer le retour */
async function answer(chrono, correct = true, waitMs = 800) {
  const { answer: expected } = chrono.state.currentQuestion;
  chrono.handleAnswer(correct ? expected : expected + 1);
  await flush(waitMs);
}

function feedbackText() {
  return document.querySelector('.chrono-feedback')?.textContent ?? '';
}

function resultButton(action) {
  return document.querySelector(`#results [data-action="${action}"]`);
}

function chronoStats() {
  return userStore.chronoStats;
}

beforeAll(() => {
  const realStart = ChronoMode.prototype.start;
  jest.spyOn(ChronoMode.prototype, 'start').mockImplementation(function start(...args) {
    instances.push(this);
    return realStart.apply(this, args);
  });
});

beforeEach(() => {
  store.setTranslations(FR);
  store.setCurrentLanguage('fr');
  document.body.innerHTML = '<div id="game"></div><div id="results"></div>';
  userStore.chronoStats = undefined;
  userStore.coins = 0;
  instances = [];
  speak.mockClear();
  preloadSpeech.mockClear();
  updateDailyChallengeProgress.mockClear();
  goToSlide.mockClear();
  jest.spyOn(AudioManager, 'playSound').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.useFakeTimers();
});

afterEach(() => {
  stopChronoMode();
  jest.useRealTimers();
  jest.mocked(AudioManager.playSound).mockRestore();
  jest.mocked(console.warn).mockRestore();
  jest.mocked(console.log).mockRestore();
});

describe('Chrono : une partie', () => {
  test('le départ montre le choix de réponse, sans rien dire', async () => {
    await orchestrator.setGameMode('chrono');
    await flush();
    expect(document.querySelector('.chrono-setup-panel')).not.toBeNull();
    expect(document.querySelector('#chrono-start').textContent).toBe(FR.chrono_start);
    expect(speak).not.toHaveBeenCalled();
  });

  test('une erreur affiche le calcul en entier, et son inverse ne suit pas', async () => {
    const chrono = await startChrono();
    showQuestion(chrono, 8, 6);
    await answer(chrono, false, 0);
    expect(feedbackText()).toBe('8 × 6 = 48');
    await flush(800);
    const next = chrono.state.currentQuestion;
    expect([`${next.a}×${next.b}`]).not.toContain('8×6');
    expect([`${next.a}×${next.b}`]).not.toContain('6×8');
    // Encore affichée sous la nouvelle question, puis effacée
    expect(feedbackText()).toBe('8 × 6 = 48');
    await flush(2000);
    expect(feedbackText()).toBe('');
  });

  test('le chrono s’arrête à la 10e bonne réponse, et la partie s’enregistre une fois', async () => {
    const chrono = await startChrono();
    for (let i = 0; i < 9; i += 1) await answer(chrono);
    chrono.handleAnswer(chrono.state.currentQuestion.answer);
    // Les 0,8 s d'affichage qui suivent la dernière réponse ne comptent pas
    await flush(5000);
    const [bucket] = chronoStats().buckets;
    expect(bucket.count).toBe(1);
    expect(bucket.best[0].durationMs).toBe(9 * 800);
    expect(document.querySelector('#results .results-lead').textContent).toContain('7,2');
  });

  test('une bonne réponse donne une pièce et compte pour le Défi du jour', async () => {
    const chrono = await startChrono();
    showQuestion(chrono, 5, 7);
    await answer(chrono);
    expect(userStore.coins).toBe(1);
    expect(updateDailyChallengeProgress).toHaveBeenCalledWith(5, 7);
  });

  test('un abandon n’ajoute rien au classement ni à la liste à revoir', async () => {
    const chrono = await startChrono();
    showQuestion(chrono, 7, 8);
    await answer(chrono, false);
    globalThis.confirm = () => true;
    chrono.confirmAbandon();
    await flush(5000);
    expect(chronoStats().buckets).toEqual([]);
    expect(chronoStats().basket).toEqual([]);
  });
});

describe('Chrono : résultats', () => {
  async function playGame({ error = false } = {}) {
    const chrono = await startChrono();
    if (error) {
      showQuestion(chrono, 7, 8);
      await answer(chrono, false);
    }
    while (chrono.state.correctAnswers < 10) await answer(chrono);
    await flush(1000);
    return chrono;
  }

  test('« Revoir mes calculs » relance une révision par l’orchestrateur', async () => {
    await playGame({ error: true });
    expect(resultButton('revise').textContent).toBe(FR.chrono_start_revision);
    resultButton('revise').click();
    await flush(10);
    const revision = instances.at(-1);
    expect(revision.isRevision).toBe(true);
    expect(revision.phase).toBe('playing');
    expect(revision.state.currentQuestion).toMatchObject({ a: 7, b: 8 });
  });

  test('sans calcul à revoir, pas de bouton de révision', async () => {
    await playGame();
    expect(resultButton('revise')).toBeNull();
    expect(resultButton('play-again')).not.toBeNull();
  });

  test('« Rejouer » ne laisse aucune partie tourner après un retour à l’accueil', async () => {
    await playGame();
    resultButton('play-again').click();
    await flush(10);
    const replay = instances.at(-1);
    expect(replay.phase).toBe('playing');
    await goToSlide(1);
    expect(instances.every(chrono => chrono.state.isActive === false)).toBe(true);
    expect(instances.every(chrono => chrono.timerInterval === null)).toBe(true);
  });
});

describe('Chrono : langue', () => {
  test('l’écran de départ se retraduit, textes à paramètres compris', async () => {
    seedLanguageTest();
    await orchestrator.setGameMode('chrono');
    await flush();
    store.setTranslations(EN);
    store.setCurrentLanguage('en');
    await refreshChronoTexts();
    expect(document.querySelector('.chrono-setup-panel p').textContent).toBe(EN.chrono_intro);
    expect(document.querySelector('.chrono-basket-errors').getAttribute('aria-label')).toBe(
      formatMessage(EN.chrono_basket_errors, { n: 2 }, 'en')
    );
  });

  function seedLanguageTest() {
    userStore.chronoStats = { buckets: [], basket: [{ a: 7, b: 8, due: 2 }] };
  }
});
