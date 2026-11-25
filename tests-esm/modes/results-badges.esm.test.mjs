/* eslint-env jest, node */
/**
 * Fin de partie du Quiz et du Défi, avec de vraies copies des données du joueur
 * (UserManager renvoie une copie normalisée à chaque lecture) :
 * - un badge gagné est enregistré et ne s'annonce qu'une fois ;
 * - l'écran de fin reçoit le focus sur sa phrase principale ;
 * - il se retraduit si la langue change pendant qu'il est affiché ;
 * - un « Rejouer » du Défi qui échoue se signale dans la console ;
 * - pendant une partie, aucune bulle de gain ne se pose sur le jeu : l'écran de fin dit les
 *   pièces, les badges et le défi du jour terminé ; une partie quittée les annonce à la sortie.
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
const orchestrator = await import('../../js/mode-orchestrator.js');
const { checkAndUnlockBadge } = await import('../../js/badges.js');
const { announceReward, releaseRewardAnnouncements } = await import(
  '../../js/core/session-rewards.js'
);

const FR = {
  badge_quiz_starter_name: 'Apprenti du Quiz',
  badge_perfect_quiz_name: 'Quiz parfait',
  badge_challenge_accepted_name: 'Chronomètre accepté',
  badge_daily_challenger_name: 'Défi quotidien relevé',
  badge_high_scorer_name: 'As du score',
  results_new_badge: 'Nouveau badge : {name}',
  results_coins_earned: '{n, plural, one {# pièce gagnée} other {# pièces gagnées}}',
  results_coins_to_avatar: 'Encore {n} pièces pour débloquer un nouvel avatar.',
  results_daily_challenge_done: 'Défi du jour terminé !',
  results_see_badges: 'Voir mes badges',
  good_job: 'Bien joué !',
  keep_practicing: 'Continue à t’entraîner !',
  challenge_easy: 'Facile',
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
  // Aucune partie en cours d'un test à l'autre : rien n'est retenu
  releaseRewardAnnouncements();
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

describe('Écran de fin du Défi', () => {
  test('un « Rejouer » qui échoue se signale dans la console', async () => {
    const challenge = new ChallengeMode();
    challenge.state.questionCount = 5;
    challenge.state.correctAnswers = 4;
    challenge.showResults();
    await new Promise(r => setTimeout(r, 0));

    const failure = new Error('relance impossible');
    jest.mocked(orchestrator.setGameMode).mockRejectedValueOnce(failure);
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    document.querySelector('#results [data-action="play-again"]').click();
    await new Promise(r => setTimeout(r, 0));

    expect(orchestrator.setGameMode).toHaveBeenCalledWith('challenge');
    expect(error).toHaveBeenCalledWith('Unable to restart Challenge via orchestrator:', failure);
  });
});

describe('Gains de la partie : rien sur le jeu, tout à l’écran de fin', () => {
  const rewardLines = () =>
    [...document.querySelectorAll('#results .results-reward')].map(line => line.textContent);
  const actions = () =>
    [...document.querySelectorAll('#results .results-actions button')].map(
      button => button.dataset.action
    );
  const settle = () => new Promise(r => setTimeout(r, 30));

  test('Quiz : défi du jour fini et badges gagnés en partie attendent, l’écran de fin les dit', async () => {
    const quiz = new QuizMode();
    quiz.resetState();

    // En pleine partie : le défi du jour se termine (ce que fait js/game.js), son badge tombe
    const dailyMessage = jest.fn();
    persisted.coins = 10;
    announceReward(dailyMessage, 'results_daily_challenge_done');
    checkAndUnlockBadge('daily_challenger');
    await settle();
    expect(persisted.unlockedBadges).toEqual(['daily_challenger']);
    expect(toastCount()).toBe(0);
    expect(dailyMessage).not.toHaveBeenCalled();

    quiz.state.questionCount = 10;
    quiz.state.correctAnswers = 10;
    quiz.finish();
    await settle();

    expect(rewardLines()).toEqual([
      'Défi du jour terminé !',
      '10 pièces gagnées',
      'Nouveau badge : Défi quotidien relevé',
      'Nouveau badge : Apprenti du Quiz',
      'Nouveau badge : Quiz parfait',
    ]);
    const icons = [...document.querySelectorAll('#results .results-reward svg')];
    expect(icons.map(icon => icon.dataset.icon)).toEqual([
      'calendar',
      'coin',
      'award',
      'award',
      'award',
    ]);
    // Sous l'encouragement, avant la ligne du score : la même place qu'en Aventure
    const block = document.querySelector('#results .results-rewards');
    expect(block.previousElementSibling.className).toBe('results-message');
    expect(block.nextElementSibling.className).toBe('results-details');
    expect(block.querySelector('.results-reward-hint').textContent).toBe(
      'Encore 40 pièces pour débloquer un nouvel avatar.'
    );
    expect(actions()).toEqual(['play-again', 'back-to-home', 'results-see-badges']);

    // Ni bulle ni message, pendant la partie comme après : l'écran de fin a tout dit
    quiz.stop();
    await settle();
    expect(toastCount()).toBe(0);
    expect(dailyMessage).not.toHaveBeenCalled();
  });

  test('Quiz : l’écran de fin retraduit garde ses gains', async () => {
    const quiz = new QuizMode();
    quiz.resetState();
    persisted.coins = 3;
    quiz.state.questionCount = 4;
    quiz.state.correctAnswers = 2;
    quiz.finish();
    await settle();
    expect(rewardLines()).toEqual(['3 pièces gagnées', 'Nouveau badge : Apprenti du Quiz']);

    store.setTranslations({ ...ES, results_new_badge: 'Nuevo logro: {name}' });
    eventBus.emit('languageChanged', { lang: 'es' });
    expect(rewardLines()).toEqual(['3 pièces gagnées', 'Nuevo logro: Apprenti du Quiz']);
  });

  test('Quiz quitté en route : le badge gagné s’annonce à la sortie, une fois', async () => {
    const quiz = new QuizMode();
    quiz.resetState();
    checkAndUnlockBadge('high_scorer');
    await settle();
    expect(toastCount()).toBe(0);

    quiz.stop();
    await settle();
    expect(toastCount()).toBe(1);
    expect(document.querySelector('.notification').textContent).toBe(
      '🏆Nouveau badge débloquéAs du score'
    );
    quiz.stop();
    await settle();
    expect(toastCount()).toBe(1);
  });

  test('Quiz sans gain : aucun bloc, aucun bouton en plus', async () => {
    persisted.unlockedBadges = ['quiz_starter'];
    const quiz = new QuizMode();
    quiz.resetState();
    quiz.state.questionCount = 10;
    quiz.state.correctAnswers = 6;
    quiz.finish();
    await settle();
    expect(document.querySelector('#results .results-rewards')).toBeNull();
    expect(actions()).toEqual(['play-again', 'back-to-home']);
  });

  test('partie suivante : ses gains repartent de zéro', async () => {
    const quiz = new QuizMode();
    quiz.resetState();
    persisted.coins = 10;
    quiz.state.questionCount = 10;
    quiz.state.correctAnswers = 6;
    quiz.finish();
    await settle();
    expect(rewardLines()).toEqual(['10 pièces gagnées', 'Nouveau badge : Apprenti du Quiz']);

    quiz.resetState();
    quiz.state.questionCount = 10;
    quiz.state.correctAnswers = 6;
    quiz.finish();
    await settle();
    expect(document.querySelector('#results .results-rewards')).toBeNull();
  });

  test('Défi : ses pièces et son badge sont dits à la fin, pas pendant la partie', async () => {
    const challenge = new ChallengeMode();
    challenge.resetState();
    challenge.difficulty = 'easy';
    persisted.coins = 7;
    challenge.state.questionCount = 12;
    challenge.state.correctAnswers = 9;
    challenge.finish();
    await settle();

    expect(toastCount()).toBe(0);
    expect(rewardLines()).toEqual(['7 pièces gagnées', 'Nouveau badge : Chronomètre accepté']);
    const block = document.querySelector('#results .results-rewards');
    expect(block.previousElementSibling.className).toBe('results-message');
    expect(actions()).toEqual(['play-again', 'back-to-home', 'results-see-badges']);
  });
});
