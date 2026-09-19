/* eslint-env jest, node */
/**
 * Fin de partie du Quiz et du Défi, avec de vraies copies des données du joueur
 * (UserManager renvoie une copie normalisée à chaque lecture) :
 * - un badge gagné est enregistré et ne s'annonce qu'une fois ;
 * - l'écran de fin reçoit le focus sur sa phrase principale ;
 * - il se retraduit si la langue change pendant qu'il est affiché.
 */
import { describe, test, expect, beforeAll, beforeEach, afterEach, jest } from '@jest/globals';

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
jest.unstable_mockModule('../../js/slides.js', () => ({
  goToSlide: jest.fn(async () => {}),
  showSlide: jest.fn(),
  hideAllSlides: jest.fn(),
  nextSlide: jest.fn(),
  prevSlide: jest.fn(),
}));
jest.unstable_mockModule('../../js/mode-orchestrator.js', () => ({
  getStartingMode: () => null,
  setStartingMode: jest.fn(),
  setGameMode: jest.fn(async () => {}),
}));

const store = await import('../../js/i18n-store.js');
const { eventBus } = await import('../../js/core/eventBus.js');
const { AudioManager } = await import('../../js/core/audio.js');
const { QuizMode } = await import('../../js/modes/QuizMode.js');
const { ChallengeMode } = await import('../../js/modes/ChallengeMode.js');

const FR = {
  badge_quiz_starter_name: 'Apprenti du Quiz',
  badge_perfect_quiz_name: 'Quiz parfait',
  badge_challenge_accepted_name: 'Chronomètre accepté',
  new_badge_unlocked: 'Nouveau badge débloqué',
  results_correct_count: '{correct} bonnes réponses sur {total}',
  results_correct_count_one: '{correct} bonne réponse sur {total}',
  results_score: 'Score : {score}',
  excellent: 'Excellent !',
  play_again: 'Rejouer',
  back_to_home: "Retour à l'accueil",
  quiz_results: 'Résultats du Quiz',
};
const ES = {
  ...FR,
  results_correct_count: '{correct} respuestas correctas de {total}',
  excellent: '¡Excelente!',
  play_again: 'Jugar de nuevo',
};

function toastCount() {
  return document.querySelectorAll('.notification').length;
}

beforeAll(() => {
  store.setCurrentLanguage('fr');
});

beforeEach(() => {
  store.setTranslations(FR);
  persisted = { preferredOperator: '×', progressHistory: [], unlockedBadges: [] };
  document.body.innerHTML = '<div id="game"></div><div id="results"></div>';
  jest.spyOn(AudioManager, 'playSound').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Badges de fin de partie', () => {
  test('Quiz : les badges gagnés restent enregistrés et ne s’annoncent qu’une fois', () => {
    const quiz = new QuizMode();
    quiz.state.questionCount = 10;
    quiz.state.correctAnswers = 10;

    quiz.saveResults();
    expect(persisted.unlockedBadges).toEqual(['quiz_starter', 'perfect_quiz']);
    expect(persisted.quizStats.totalQuizzes).toBe(1);
    const afterFirst = toastCount();
    expect(afterFirst).toBe(2);

    quiz.saveResults();
    expect(persisted.unlockedBadges).toEqual(['quiz_starter', 'perfect_quiz']);
    expect(persisted.quizStats.totalQuizzes).toBe(2);
    expect(toastCount()).toBe(afterFirst);
  });

  test('Défi : « Chronomètre accepté » est enregistré une fois pour toutes', () => {
    const challenge = new ChallengeMode();
    challenge.state.questionCount = 5;
    challenge.state.correctAnswers = 4;

    challenge.saveResults();
    challenge.saveResults();
    expect(persisted.unlockedBadges).toEqual(['challenge_accepted']);
    expect(toastCount()).toBe(1);
  });
});

describe('Écran de fin du Quiz', () => {
  function showQuizResults() {
    const quiz = new QuizMode();
    quiz.state.questionCount = 10;
    quiz.state.correctAnswers = 9;
    quiz.state.score = 95;
    quiz.showResults();
    return quiz;
  }

  test('le focus va sur la phrase principale une fois l’écran affiché', async () => {
    showQuizResults();
    await new Promise(r => setTimeout(r, 0));
    const lead = document.querySelector('#results .results-lead');
    expect(lead.textContent).toBe('9 bonnes réponses sur 10');
    expect(lead.getAttribute('tabindex')).toBe('-1');
    expect(document.activeElement).toBe(lead);
  });

  test('changement de langue : l’écran est retraduit, le bouton garde le focus', async () => {
    showQuizResults();
    await new Promise(r => setTimeout(r, 0));
    document.querySelector('#results [data-action="play-again"]').focus();

    store.setTranslations(ES);
    eventBus.emit('languageChanged', { lang: 'es' });

    expect(document.querySelector('#results .results-lead').textContent).toBe(
      '9 respuestas correctas de 10'
    );
    expect(document.querySelector('#results .results-message').textContent).toBe('¡Excelente!');
    const again = document.querySelector('#results [data-action="play-again"]');
    expect(again.textContent).toBe('Jugar de nuevo');
    expect(document.activeElement).toBe(again);
    expect(document.querySelectorAll('#results .game-results')).toHaveLength(1);
  });

  test('un écran remplacé ne se retraduit plus (aucun écouteur oublié)', async () => {
    showQuizResults();
    await new Promise(r => setTimeout(r, 0));
    document.getElementById('results').textContent = '';

    store.setTranslations(ES);
    eventBus.emit('languageChanged', { lang: 'es' });
    expect(document.querySelector('#results .game-results')).toBeNull();
  });
});
