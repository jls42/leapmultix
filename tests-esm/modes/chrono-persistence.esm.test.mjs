/* eslint-env jest, node */
/**
 * Chrono avec un profil copié à chaque lecture, comme UserManager : ce qui n'est pas
 * réécrit par updateUserData est perdu. On y vérifie que course, révision, pièces et Défi
 * du jour s'enregistrent vraiment, puis « Je tape » de bout en bout (pavé et clavier),
 * le clavier rendu à la page à la sortie, et les tables des Paramètres.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { createSlidesMock } from '../helpers/mode-test-helpers.mjs';
import {
  createLazyLoaderMock,
  createGameMock,
  createSpeechMock,
  createChronoNavigation,
  createChronoDriver,
  trackChronoInstances,
  quietFakeTime,
} from '../helpers/chrono-test-helpers.mjs';

let persisted;
const copy = value => JSON.parse(JSON.stringify(value));
jest.unstable_mockModule('../../js/core/userState.js', () => ({
  UserState: {
    getCurrentUserData: () => copy(persisted),
    updateUserData: data => {
      persisted = { ...persisted, ...copy(data) };
    },
  },
}));
const updateDailyChallengeProgress = jest.fn();
const refs = {};
const goToSlide = createChronoNavigation(jest, refs);
jest.unstable_mockModule('../../js/lazy-loader.js', createLazyLoaderMock);
jest.unstable_mockModule('../../js/game.js', () =>
  createGameMock(jest, updateDailyChallengeProgress)
);
jest.unstable_mockModule('../../js/speech.js', () =>
  createSpeechMock({ speak: jest.fn(), preloadSpeech: jest.fn() })
);
jest.unstable_mockModule('../../js/slides.js', () => ({ ...createSlidesMock(jest), goToSlide }));

const store = await import('../../js/i18n-store.js');
const { AudioManager } = await import('../../js/core/audio.js');
const { TablePreferences } = await import('../../js/core/tablePreferences.js');
refs.orchestrator = await import('../../js/mode-orchestrator.js');
refs.chronoModule = await import('../../js/modes/ChronoMode.js');
const { orchestrator } = refs;
const { ChronoMode, stopChronoMode } = refs.chronoModule;
const FR = JSON.parse(
  readFileSync(new URL('../../assets/translations/fr.json', import.meta.url), 'utf8')
);

let instances = [];
const { flush, startChrono, showQuestion, answer, feedbackText } = createChronoDriver(
  jest,
  refs,
  () => instances
);
const tapKey = key => document.querySelector(`.chrono-key[data-key="${key}"]`).click();
const press = key => {
  const event = new KeyboardEvent('keydown', { key, cancelable: true, bubbles: true });
  document.dispatchEvent(event);
  return event;
};

beforeEach(() => {
  // Repris à chaque test : afterEach restaure tous les espions
  trackChronoInstances(jest, ChronoMode, () => instances);
  store.setTranslations(FR);
  store.setCurrentLanguage('fr');
  document.body.innerHTML = '<div id="game"></div><div id="results"></div>';
  persisted = { preferredOperator: '×', coins: 0 };
  instances = [];
  updateDailyChallengeProgress.mockReset();
  quietFakeTime(jest, AudioManager);
});

afterEach(() => {
  stopChronoMode();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('Chrono : ce qui s’enregistre dans le profil', () => {
  test('une course terminée est écrite : classement et calcul raté', async () => {
    const chrono = await startChrono();
    showQuestion(chrono, 7, 8);
    await answer(chrono, false);
    while (chrono.state.correctAnswers < 10) await answer(chrono);
    await flush(1000);
    expect(persisted.chronoStats.buckets.map(bucket => bucket.count)).toEqual([1]);
    expect(persisted.chronoStats.basket).toEqual([{ a: 7, b: 8, due: 1 }]);
  });

  test('une révision terminée est écrite, avec la pièce du calcul sorti', async () => {
    persisted.chronoStats = { buckets: [], basket: [{ a: 7, b: 8, due: 1 }] };
    const chrono = await startChrono({ revision: true });
    for (let i = 0; i < 10; i += 1) await answer(chrono);
    await flush(1000);
    expect(persisted.chronoStats.basket).toEqual([]);
    expect(persisted.coins).toBe(1);
  });

  test('la pièce s’enregistre avant le Défi du jour, qui garde sa récompense', async () => {
    // Le Défi du jour relit le profil, ajoute 10 pièces et l’écrit, comme game.js
    updateDailyChallengeProgress.mockImplementation(() => {
      const data = copy(persisted);
      data.coins = (Number(data.coins) || 0) + 10;
      persisted = { ...persisted, ...copy(data) };
    });
    const chrono = await startChrono();
    showQuestion(chrono, 5, 7);
    await answer(chrono);
    expect(persisted.coins).toBe(11);
  });

  test('une erreur ne rapporte rien et ne compte pas pour le Défi du jour', async () => {
    const chrono = await startChrono();
    showQuestion(chrono, 5, 7);
    await answer(chrono, false);
    expect(persisted.coins).toBe(0);
    expect(updateDailyChallengeProgress).not.toHaveBeenCalled();
  });
});

describe('Chrono : « Je tape » de bout en bout', () => {
  test('au pavé, la réponse complète se valide seule ; un chiffre impossible est une erreur', async () => {
    const chrono = await startChrono();
    showQuestion(chrono, 7, 8);
    tapKey('5');
    expect(feedbackText()).toBe('');
    tapKey('6');
    expect(feedbackText()).toBe(FR.chrono_feedback_correct);
    await flush(800);
    showQuestion(chrono, 6, 9);
    tapKey('4');
    expect(feedbackText()).toBe(FR.incorrect);
  });

  test('au clavier : chiffres et retour arrière', async () => {
    const chrono = await startChrono();
    showQuestion(chrono, 7, 8);
    press('5');
    expect(document.querySelector('#chrono-typed').textContent).toBe('5');
    press('Backspace');
    expect(document.querySelector('#chrono-typed').textContent).toBe('?');
    press('5');
    press('6');
    expect(feedbackText()).toBe(FR.chrono_feedback_correct);
  });

  test('sortir en pleine question rend les chiffres au reste de la page', async () => {
    await startChrono();
    await goToSlide(1);
    expect(press('5').defaultPrevented).toBe(false);
  });
});

describe('Chrono : tables des Paramètres et façon de répondre', () => {
  test('une course ne pose que les tables gardées, et se classe sous elles', async () => {
    jest.spyOn(TablePreferences, 'isGlobalEnabled').mockReturnValue(true);
    jest
      .spyOn(TablePreferences, 'getActiveExclusions')
      .mockReturnValue([1, 2, 3, 4, 5, 6, 8, 9, 10]);
    const chrono = await startChrono();
    const asked = [];
    while (chrono.state.correctAnswers < 10) {
      const { a, b } = chrono.state.currentQuestion;
      asked.push([a, b]);
      await answer(chrono);
    }
    await flush(1000);
    expect(asked.every(pair => pair.includes(7))).toBe(true);
    // Dix calculs différents : ni répétition ni inverse d’un calcul déjà posé
    expect(new Set(asked.map(pair => [...pair].sort((x, y) => x - y).join('×'))).size).toBe(10);
    expect(persisted.chronoStats.buckets.map(bucket => bucket.key)).toEqual(['7|keypad']);
  });

  test('« Je choisis » aux clics : classement à part, et le choix reste pour la prochaine fois', async () => {
    await orchestrator.setGameMode('chrono');
    await flush();
    document.querySelector('.chrono-input-btn[data-input-mode="mcq"]').click();
    expect(
      document
        .querySelector('.chrono-input-btn[data-input-mode="mcq"]')
        .getAttribute('aria-pressed')
    ).toBe('true');
    expect(persisted.chronoStats.lastInputMode).toBe('mcq');
    document.querySelector('#chrono-start').click();
    await flush();
    const chrono = instances.at(-1);
    while (chrono.state.correctAnswers < 10) {
      const expected = String(chrono.state.currentQuestion.answer);
      [...document.querySelectorAll('.chrono-options .option')]
        .find(tile => tile.dataset.value === expected)
        .click();
      await flush(800);
    }
    await flush(1000);
    expect(persisted.chronoStats.buckets.map(bucket => bucket.key.split('|')[1])).toEqual(['mcq']);

    // Retour au menu : « Je choisis » est déjà sélectionné
    document.querySelector('#results [data-action="chrono-menu"]').click();
    await flush();
    expect(
      document
        .querySelector('.chrono-input-btn[data-input-mode="mcq"]')
        .getAttribute('aria-pressed')
    ).toBe('true');
  });
});
