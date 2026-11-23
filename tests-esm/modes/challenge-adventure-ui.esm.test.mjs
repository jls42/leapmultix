/* eslint-env jest, node */
/**
 * Défi : chrono calme (état « temps faible » par classe, jamais de couleur en ligne),
 * un seul départ par geste, pas de badge pour un défi sans réponse, pas de barre
 * d'infos avant le choix de la difficulté.
 * Aventure : niveaux en vrais boutons, écrans de fin en phrase, sans émoji d'interface ;
 * une erreur est expliquée et attend « Continuer », jusqu'à la dernière question ; le
 * niveau se termine toujours sur son propre écran ; badges et verrous justes ; un niveau ou
 * un retour à la carte qui échoue est signalé.
 */
import { describe, test, expect, beforeAll, beforeEach, afterEach, jest } from '@jest/globals';
import { answerDialog, closeOpenDialog } from '../helpers/confirm-dialog-helpers.mjs';

const userStore = { preferredOperator: '×', progressHistory: [], adventureProgressByOperator: {} };
jest.unstable_mockModule('../../js/core/userState.js', () => ({
  UserState: {
    getCurrentUserData: () => userStore,
    updateUserData: u => Object.assign(userStore, u),
  },
}));
jest.unstable_mockModule('../../js/slides.js', () => ({
  goToSlide: jest.fn(),
  showSlide: jest.fn(),
  hideAllSlides: jest.fn(),
  nextSlide: jest.fn(),
  prevSlide: jest.fn(),
}));
const checkAndUnlockBadge = jest.fn();
jest.unstable_mockModule('../../js/badges.js', () => ({
  badges: {},
  getAllBadges: () => [],
  checkAndUnlockBadge,
}));

const store = await import('../../js/i18n-store.js');
const slides = await import('../../js/slides.js');
const { eventBus } = await import('../../js/core/eventBus.js');
const { AudioManager } = await import('../../js/core/audio.js');
const { ChallengeMode } = await import('../../js/modes/ChallengeMode.js');
const { AdventureMode } = await import('../../js/modes/AdventureMode.js');

const EMOJI = /\p{Extended_Pictographic}/u;

const BASE_TRANSLATIONS = {
  results_correct_count: '{correct} bonnes réponses sur {total}',
  results_correct_count_one: '{correct} bonne réponse sur {total}',
  results_score: 'Score : {score}',
  results_best_streak: 'Meilleure série : {streak}',
  results_coins_earned: '{n, plural, one {# pièce gagnée} other {# pièces gagnées}}',
  results_new_badge: 'Nouveau badge : {name}',
  results_coins_to_avatar:
    'Encore {n, plural, one {# pièce} other {# pièces}} pour débloquer un nouvel avatar.',
  results_avatar_ready: 'Tu as assez de pièces pour un nouvel avatar.',
  results_see_badges: 'Voir mes badges',
  badge_adventurer_name: 'Premiers pas',
  badge_daily_challenger_name: 'Défi quotidien relevé',
  stars_earned: '{stars} étoiles sur {total}',
  stars_earned_one: '{stars} étoile sur {total}',
  level_completed: 'Niveau terminé',
  level_failed: 'Pas cette fois',
  adventure_level_success: 'Voici ton trésor !',
  adventure_level_failure: 'Tu as perdu toutes tes vies. Réessaie !',
  level_1_name: 'Table de 1',
  level_2_name: 'Table de 2',
  table_label: 'Table',
  level_locked_message: 'Niveau verrouillé : il te faut {requiredStars} étoiles.',
  incorrect: 'Raté !',
  feedback_incorrect: 'La bonne réponse est {correctAnswer}.',
  feedback_count_by: 'Compter par {step} :',
  continue: 'Continuer',
  adventure_feedback_correct: 'Correct !',
};

beforeAll(() => {
  store.setTranslations(BASE_TRANSLATIONS);
  store.setCurrentLanguage('fr');
});

beforeEach(() => {
  store.setTranslations(BASE_TRANSLATIONS);
  document.body.innerHTML =
    '<section id="slide4" class="slide"><div id="game"></div></section><div id="results"></div>';
  userStore.preferredOperator = '×';
  userStore.adventureProgressByOperator = {};
  userStore.progressHistory = [];
  userStore.coins = 0;
  userStore.avatar = 'fox';
  userStore.unlockedAvatars = ['fox'];
  userStore.unlockedBadges = [];
  slides.goToSlide.mockClear();
  checkAndUnlockBadge.mockReset();
  // jsdom n'implémente pas le défilement de la fenêtre
  globalThis.scrollTo = jest.fn();
  jest.spyOn(AudioManager, 'playSound').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  closeOpenDialog();
  jest.restoreAllMocks();
});

const QUESTION = { a: 2, b: 2, operator: '×', answer: 4 };

/** Le badge « Premiers pas » entre dans le profil la première fois, comme le fait js/badges.js */
function unlockFirstSteps(badgeId) {
  if (badgeId === 'adventurer' && !userStore.unlockedBadges.includes(badgeId)) {
    userStore.unlockedBadges.push(badgeId);
  }
}

/** Un niveau d'Aventure prêt à recevoir des réponses, sans son écran de jeu */
function levelInPlay(levelIndex) {
  const adventure = new AdventureMode();
  adventure.gameScreen = document.getElementById('game');
  adventure.currentLevel = adventure.adventureLevels.at(levelIndex);
  adventure.resetState();
  adventure.state.lives = 3;
  adventure.state.currentQuestion = QUESTION;
  return adventure;
}

describe('Défi', () => {
  test('une double activation du choix de difficulté ne lance qu’un chrono', async () => {
    const challenge = new ChallengeMode();
    await challenge.start();
    const spy = jest.spyOn(challenge, 'startTimer');

    const btn = document.querySelector('.difficulty-btn[data-difficulty="hard"]');
    btn.click();
    btn.click();
    await new Promise(r => setTimeout(r, 20));

    expect(spy).toHaveBeenCalledTimes(1);
    expect(challenge.intervals.size).toBe(1);
    challenge.stop();
  });

  test('les dix dernières secondes du chrono : un tic-tac par seconde, rien avant, rien à la fin', async () => {
    jest.useFakeTimers();
    const challenge = new ChallengeMode();
    try {
      await challenge.start();
      jest.spyOn(challenge, 'finish').mockImplementation(() => {});
      const ticks = () => AudioManager.playSound.mock.calls.filter(([name]) => name === 'tick');
      challenge.state.timeLeft = 13;
      challenge.startTimer();
      // 12, puis 11 : pas encore
      jest.advanceTimersByTime(2000);
      expect(ticks()).toHaveLength(0);
      // 10 à 1 : un par seconde
      jest.advanceTimersByTime(10000);
      expect(ticks()).toHaveLength(10);
      // 0 : la fin de la partie, sans tic-tac
      jest.advanceTimersByTime(1000);
      expect(ticks()).toHaveLength(10);
    } finally {
      challenge.stop();
      jest.useRealTimers();
    }
  });

  test('temps faible : classe is-low sur la case du chrono, sans couleur en ligne', async () => {
    const challenge = new ChallengeMode();
    await challenge.start();
    document.querySelector('.difficulty-btn[data-difficulty="easy"]').click();
    await new Promise(r => setTimeout(r, 20));

    const timeValue = document.getElementById('info-time');
    const timeItem = timeValue.closest('.info-item');

    challenge.state.timeLeft = 8;
    challenge.updateTimerDisplay();
    expect(timeItem.classList.contains('is-low')).toBe(true);
    expect(timeValue.getAttribute('style')).toBeNull();

    challenge.state.timeLeft = 30;
    challenge.updateTimerDisplay();
    expect(timeItem.classList.contains('is-low')).toBe(false);
    challenge.stop();
  });

  test('« Abandonner » est discret et suit la zone de réponse', async () => {
    const challenge = new ChallengeMode();
    await challenge.start();
    document.querySelector('.difficulty-btn[data-difficulty="easy"]').click();
    await new Promise(r => setTimeout(r, 20));

    const container = document.querySelector('.challenge-container');
    const children = [...container.children];
    const quitIndex = children.findIndex(el => el.classList.contains('game-quit'));
    const optionsIndex = children.findIndex(el => el.id === 'challenge-options');
    expect(quitIndex).toBeGreaterThan(optionsIndex);
    expect(document.getElementById('challenge-abandon').className).toContain('btn-quiet');
    challenge.stop();
  });

  test('pas de badge pour un défi terminé sans aucune réponse', () => {
    const challenge = new ChallengeMode();
    challenge.state.questionCount = 0;
    challenge.saveResults();
    expect(checkAndUnlockBadge).not.toHaveBeenCalledWith('challenge_accepted');

    challenge.state.questionCount = 3;
    challenge.saveResults();
    expect(checkAndUnlockBadge).toHaveBeenCalledWith('challenge_accepted');
  });
});

describe('Aventure', () => {
  test('les niveaux sont des boutons ; un niveau verrouillé le dit sans émoji', async () => {
    const adventure = new AdventureMode();
    await adventure.start();

    const tiles = [...document.querySelectorAll('.level-card')];
    expect(tiles).toHaveLength(10);
    expect(tiles.every(t => t.tagName === 'BUTTON')).toBe(true);
    expect(tiles[0].classList.contains('is-available')).toBe(true);
    expect(tiles[1].getAttribute('aria-disabled')).toBe('true');
    expect(tiles[1].querySelector('.sr-only').textContent).toBe(
      'Niveau verrouillé : il te faut 2 étoiles.'
    );
    expect(tiles.some(t => EMOJI.test(t.textContent))).toBe(false);
  });

  test('le but du niveau reste affiché sous son nom, sans message surgissant', async () => {
    jest.useFakeTimers();
    try {
      store.setTranslations({ ...BASE_TRANSLATIONS, level_1_desc: 'Apprends la table de 1' });
      const adventure = new AdventureMode();
      await adventure.start();
      await adventure.startLevel(1);
      await jest.advanceTimersByTimeAsync(50);
      const goal = document.querySelector('.adventure-level-header .adventure-level-goal');
      expect(goal?.textContent).toBe('Apprends la table de 1');
      // Il suit un changement de langue
      expect(goal.dataset.translate).toBe('level_1_desc');
      // Un message de 3 s, en bas de l'écran, cachait « Abandonner » sur téléphone
      expect(document.querySelector('.message-popup')).toBeNull();
      adventure.stop();
    } finally {
      jest.useRealTimers();
    }
  });

  test('réussite : phrase principale, étoiles dessinées, trésor, sans émoji', () => {
    const adventure = new AdventureMode();
    adventure.gameScreen = document.getElementById('game');
    adventure.currentLevel = adventure.adventureLevels[0];
    adventure.state.correctAnswers = 9;
    adventure.state.questionCount = 10;
    adventure.state.score = 90;
    adventure.showLevelResults(true, 2);

    const results = document.querySelector('.adventure-results');
    expect(results.querySelector('h1').textContent).toBe('Niveau terminé');
    expect(results.querySelector('.results-lead').textContent).toBe('9 bonnes réponses sur 10');
    const rating = results.querySelector('.reward-stars');
    expect(rating.getAttribute('aria-label')).toBe('2 étoiles sur 3');
    expect(rating.querySelectorAll('svg.reward-star.is-earned')).toHaveLength(2);
    expect(results.querySelector('img.results-treasure')).not.toBeNull();
    expect(EMOJI.test(results.textContent)).toBe(false);
    // Les étoiles gagnées sonnent une fois
    const stars = AudioManager.playSound.mock.calls.filter(([name]) => name === 'star');
    expect(stars).toHaveLength(1);
  });

  test('échec : ton calme, le personnage reste présent', () => {
    const adventure = new AdventureMode();
    adventure.gameScreen = document.getElementById('game');
    adventure.currentLevel = adventure.adventureLevels[1];
    adventure.state.correctAnswers = 1;
    adventure.state.questionCount = 4;
    adventure.showLevelResults(false, 0);

    const results = document.querySelector('.adventure-results');
    expect(results.querySelector('h1').textContent).toBe('Pas cette fois');
    expect(results.querySelector('.results-lead').textContent).toBe('1 bonne réponse sur 4');
    expect(results.querySelector('img.results-avatar')).not.toBeNull();
    expect(results.querySelector('.reward-stars')).toBeNull();
    // Aucune étoile gagnée : aucun son d'étoile
    expect(AudioManager.playSound).not.toHaveBeenCalledWith('star', undefined);
    expect(EMOJI.test(results.textContent)).toBe(false);
    const primary = results.querySelector('.results-actions .btn:not(.btn-secondary)');
    expect(primary.dataset.action).toBe('adventure-start-level');
  });

  test('ce que le niveau a rapporté : pièces, badge gagné à l’instant, et où le retrouver', () => {
    checkAndUnlockBadge.mockImplementation(unlockFirstSteps);
    const adventure = levelInPlay(0);
    adventure.state.questionCount = 10;
    for (let answer = 0; answer < 9; answer++) {
      adventure.state.correctAnswers++;
      adventure.onAnswerSubmitted(true, 4);
    }
    adventure.onAnswerSubmitted(false, 5);
    expect(userStore.coins).toBe(9);
    adventure.saveResults();
    adventure.showLevelResults(true, 2);

    const results = document.querySelector('.adventure-results');
    const rewards = results.querySelector('.results-rewards');
    // Sous « Voici ton trésor ! », avant la ligne du score
    expect(rewards.previousElementSibling.className).toBe('results-message');
    expect(rewards.nextElementSibling.className).toBe('results-details');
    const lines = [...rewards.querySelectorAll('[role="list"] > li')];
    expect(lines.map(line => line.textContent)).toEqual([
      '9 pièces gagnées',
      'Nouveau badge : Premiers pas',
    ]);
    expect(lines.map(line => line.querySelector('svg').dataset.icon)).toEqual(['coin', 'award']);
    expect(rewards.querySelector('.results-reward-hint').textContent).toBe(
      'Encore 41 pièces pour débloquer un nouvel avatar.'
    );
    expect(EMOJI.test(results.textContent)).toBe(false);

    // « Voir mes badges » ouvre « Mes progrès », après les deux boutons habituels
    const buttons = [...results.querySelectorAll('.results-actions button')];
    expect(buttons.map(button => button.dataset.action)).toEqual([
      'adventure-start-level',
      'adventure-back-to-levels',
      'results-see-badges',
    ]);
    expect(buttons.at(-1).className).toBe('btn btn-secondary');
    buttons.at(-1).click();
    expect(slides.goToSlide).toHaveBeenCalledWith(7);
  });

  test('niveau suivant : ses pièces repartent de zéro, le badge déjà gagné ne revient pas', () => {
    checkAndUnlockBadge.mockImplementation(unlockFirstSteps);
    const adventure = levelInPlay(0);
    adventure.state.correctAnswers = 1;
    adventure.onAnswerSubmitted(true, 4);
    adventure.saveResults();
    expect(userStore.unlockedBadges).toEqual(['adventurer']);

    adventure.resetState();
    adventure.state.lives = 3;
    adventure.state.currentQuestion = QUESTION;
    adventure.state.correctAnswers = 1;
    adventure.state.questionCount = 10;
    adventure.onAnswerSubmitted(true, 4);
    adventure.saveResults();
    adventure.showLevelResults(true, 1);

    const results = document.querySelector('.adventure-results');
    const lines = [...results.querySelectorAll('.results-reward')];
    expect(lines.map(line => line.textContent)).toEqual(['1 pièce gagnée']);
    expect(results.querySelector('[data-action="results-see-badges"]')).toBeNull();
  });

  test('défi du jour réussi pendant le niveau : ses pièces et son badge sont comptés', () => {
    const adventure = levelInPlay(0);
    adventure.state.correctAnswers = 1;
    adventure.state.questionCount = 10;
    adventure.onAnswerSubmitted(true, 4);
    // Ce que fait completeDailyChallenge (js/game.js) à la dernière réponse du défi
    userStore.coins += 10;
    userStore.unlockedBadges.push('daily_challenger');
    adventure.showLevelResults(true, 1);

    const lines = [...document.querySelectorAll('.adventure-results .results-reward')];
    expect(lines.map(line => line.textContent)).toEqual([
      '11 pièces gagnées',
      'Nouveau badge : Défi quotidien relevé',
    ]);
    // Le compteur de la barre du haut et l'écran de fin disent le même gain
    expect(userStore.coins).toBe(11);
  });

  test('échec : les pièces gagnées restent dites ; aucune bonne réponse, rien à dire', () => {
    const adventure = levelInPlay(1);
    adventure.state.questionCount = 4;
    adventure.state.correctAnswers = 2;
    adventure.onAnswerSubmitted(true, 4);
    adventure.onAnswerSubmitted(true, 6);
    adventure.showLevelResults(false, 0);
    let results = document.querySelector('.adventure-results');
    expect(results.querySelector('.results-reward').textContent).toBe('2 pièces gagnées');
    expect(results.querySelector('.results-rewards').previousElementSibling.className).toBe(
      'results-message'
    );

    // Les pièces du niveau d'avant ne se redisent pas après un niveau perdu sans bonne réponse
    adventure.resetState();
    adventure.state.lives = 0;
    adventure.state.questionCount = 3;
    adventure.saveResults();
    adventure.showLevelResults(false, 0);
    results = document.querySelector('.adventure-results');
    expect(results.querySelector('.results-rewards')).toBeNull();
  });

  test('tous les avatars débloqués : les pièces se disent sans promettre un avatar', () => {
    userStore.unlockedAvatars = ['fox', 'panda', 'unicorn', 'dragon', 'astronaut'];
    const adventure = levelInPlay(0);
    adventure.state.correctAnswers = 1;
    adventure.state.questionCount = 10;
    adventure.onAnswerSubmitted(true, 4);
    adventure.showLevelResults(true, 1);

    const rewards = document.querySelector('.results-rewards');
    expect(rewards.querySelector('.results-reward').textContent).toBe('1 pièce gagnée');
    expect(rewards.querySelector('.results-reward-hint')).toBeNull();
  });

  test('assez de pièces pour un avatar : l’écran dit où il attend', () => {
    userStore.coins = 49;
    const adventure = levelInPlay(0);
    adventure.state.correctAnswers = 1;
    adventure.state.questionCount = 10;
    adventure.onAnswerSubmitted(true, 4);
    adventure.showLevelResults(true, 1);

    expect(document.querySelector('.results-reward-hint').textContent).toBe(
      'Tu as assez de pièces pour un nouvel avatar.'
    );
  });

  test('la progression s’affiche « 3/10 »', () => {
    const adventure = new AdventureMode();
    adventure.phase = 'playing';
    adventure.state.questionCount = 3;
    expect(adventure.getInfoBarData().progress).toBe('3/10');
  });
});

describe('Défi : barre d’infos', () => {
  test('aucune barre pendant le choix de la difficulté, puis le vrai temps', async () => {
    const challenge = new ChallengeMode();
    await challenge.start();
    expect(document.querySelector('.game-info-bar')).toBeNull();

    document.querySelector('.difficulty-btn[data-difficulty="easy"]').click();
    await new Promise(r => setTimeout(r, 20));
    expect(document.getElementById('info-time').textContent).toBe('01:30');
    expect(document.getElementById('info-bonus')).toBeNull();
    challenge.stop();
  });
});

/** Place une question connue (4 × 2 = ?) dans un niveau en cours */
function showKnownQuestion(adventure) {
  adventure.state.currentQuestion = {
    question: '4 × 2 = ?',
    answer: 8,
    type: 'mcq',
    operator: '×',
    a: 4,
    b: 2,
    table: 4,
    num: 2,
  };
  adventure.displayQuestion();
}

function answer(value) {
  const options = [...document.querySelectorAll('#adventure-options .option')];
  const option =
    value === 'wrong'
      ? options.find(b => b.dataset.value !== '8')
      : options.find(b => b.dataset.value === String(value));
  option.click();
}

async function startFirstLevel() {
  const adventure = new AdventureMode();
  await adventure.start();
  await adventure.startLevel(1);
  return adventure;
}

describe('Aventure : une erreur est une étape, jusqu’à la dernière question', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('après une erreur, l’explication reste et « Continuer » attend l’enfant', async () => {
    const adventure = await startFirstLevel();
    showKnownQuestion(adventure);
    answer('wrong');

    const panel = document.querySelector('#adventure-feedback .feedback-explain');
    expect(panel.querySelector('.feedback-lead').textContent).toBe('Raté !');
    expect(panel.querySelector('.feedback-answer').textContent).toBe('La bonne réponse est 8.');
    const box = document.getElementById('adventure-continue');
    expect(box.hidden).toBe(false);

    const spy = jest.spyOn(adventure, 'generateQuestion');
    jest.advanceTimersByTime(30000);
    expect(spy).not.toHaveBeenCalled();
    expect(document.querySelector('#adventure-feedback .feedback-explain')).not.toBeNull();

    // « Continuer » suit la zone de réponse et précède « Abandonner »
    const children = [...document.querySelector('.adventure-container').children];
    const at = id => children.findIndex(el => el.id === id || el.classList.contains(id));
    expect(at('adventure-feedback')).toBeLessThan(at('adventure-continue'));
    expect(at('adventure-continue')).toBeLessThan(at('adventure-controls'));

    document.getElementById('adventure-continue-btn').click();
    expect(spy).toHaveBeenCalledTimes(1);
    adventure.stop();
  });

  test('dernière question fausse avec des vies : le niveau se termine sur son écran', async () => {
    const adventure = await startFirstLevel();
    adventure.state.questionCount = 9;
    adventure.state.correctAnswers = 9;
    showKnownQuestion(adventure);
    answer('wrong');

    // Rien ne part tout seul vers l'écran de résultats d'un autre mode
    jest.advanceTimersByTime(5000);
    expect(slides.goToSlide).not.toHaveBeenCalledWith(5);
    expect(document.querySelector('.adventure-results')).toBeNull();

    document.getElementById('adventure-continue-btn').click();
    jest.advanceTimersByTime(2000);

    const results = document.querySelector('.adventure-results');
    expect(results).not.toBeNull();
    expect(results.querySelector('h1').textContent).toBe('Niveau terminé');
    expect(results.querySelector('.results-lead').textContent).toBe('9 bonnes réponses sur 10');
    expect(results.querySelector('.reward-stars').getAttribute('aria-label')).toBe(
      '3 étoiles sur 3'
    );
    expect(slides.goToSlide).not.toHaveBeenCalledWith(5);
    // La progression est enregistrée
    expect(userStore.adventureProgressByOperator['×'][1]).toMatchObject({
      completed: true,
      stars: 3,
    });
    expect(checkAndUnlockBadge).toHaveBeenCalledWith('adventurer');
  });

  test('dernière question juste : le trésor s’ouvre sans « Continuer »', async () => {
    const adventure = await startFirstLevel();
    adventure.state.questionCount = 9;
    adventure.state.correctAnswers = 8;
    showKnownQuestion(adventure);
    answer(8);

    expect(document.getElementById('adventure-continue').hidden).toBe(true);
    jest.advanceTimersByTime(3000);
    const results = document.querySelector('.adventure-results');
    expect(results.querySelector('.results-lead').textContent).toBe('9 bonnes réponses sur 10');
    expect(slides.goToSlide).not.toHaveBeenCalledWith(5);
  });

  test('vies épuisées : « Continuer » mène à « Pas cette fois »', async () => {
    const adventure = await startFirstLevel();
    adventure.state.lives = 1;
    adventure.state.questionCount = 4;
    showKnownQuestion(adventure);
    answer('wrong');

    expect(document.getElementById('adventure-continue').hidden).toBe(false);
    document.getElementById('adventure-continue-btn').click();

    const results = document.querySelector('.adventure-results');
    expect(results.querySelector('h1').textContent).toBe('Pas cette fois');
    expect(userStore.adventureProgressByOperator['×']).toBeUndefined();
  });

  test('abandon pendant la fin programmée : aucun écran de fin fantôme', async () => {
    const adventure = await startFirstLevel();
    adventure.state.questionCount = 9;
    adventure.state.correctAnswers = 9;
    showKnownQuestion(adventure);
    answer(8);

    await adventure.returnToLevelSelection();
    jest.advanceTimersByTime(5000);
    expect(document.querySelector('.adventure-results')).toBeNull();
    expect(document.querySelectorAll('.level-card')).toHaveLength(10);
    // Le niveau suivant avance encore tout seul après une bonne réponse
    await adventure.startLevel(1);
    showKnownQuestion(adventure);
    const spy = jest.spyOn(adventure, 'generateQuestion');
    answer(8);
    jest.advanceTimersByTime(1300);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('Aventure : carte des niveaux', () => {
  test('un niveau qui ne démarre pas est signalé, pas perdu en silence', async () => {
    const adventure = new AdventureMode();
    await adventure.start();
    const failure = new Error('niveau illisible');
    jest.spyOn(adventure, 'startLevel').mockRejectedValue(failure);
    const handled = jest.spyOn(adventure, 'handleError').mockImplementation(() => {});

    document.querySelector('.level-card[data-level="1"]').click();
    await new Promise(r => setTimeout(r, 0));
    expect(handled).toHaveBeenCalledWith(failure);
  });

  test('un abandon dont le retour à la carte échoue est signalé', async () => {
    const adventure = await startFirstLevel();
    const failure = new Error('carte illisible');
    jest.spyOn(adventure, 'returnToLevelSelection').mockRejectedValue(failure);
    const handled = jest.spyOn(adventure, 'handleError').mockImplementation(() => {});

    const abandon = adventure.confirmAbandon();
    await answerDialog(true);
    await abandon;
    expect(handled).toHaveBeenCalledWith(failure);
  });

  test('verrou du niveau précédent : message dédié, sans nombre d’étoiles trompeur', async () => {
    store.setTranslations({
      ...BASE_TRANSLATIONS,
      level_locked_previous: 'Niveau verrouillé : termine d’abord le niveau {level}.',
    });
    // Niveaux 1 et 2 à 3 étoiles : le niveau 4 attend encore le niveau 3
    userStore.adventureProgressByOperator = {
      '×': { 1: { completed: true, stars: 3 }, 2: { completed: true, stars: 3 } },
    };
    const adventure = new AdventureMode();
    await adventure.start();

    const tile4 = document.querySelector('.level-card[data-level="4"]');
    expect(tile4.getAttribute('aria-disabled')).toBe('true');
    expect(tile4.querySelector('.sr-only').textContent).toBe(
      'Niveau verrouillé : termine d’abord le niveau 3.'
    );
    // Visuel : le cadenas seul (le nombre d'étoiles n'est pas ce qui manque)
    const visual = tile4.querySelector('.level-status [aria-hidden="true"]');
    expect(visual.querySelector('.level-lock')).not.toBeNull();
    expect(visual.textContent).not.toMatch(/\d/);
    const tile3 = document.querySelector('.level-card[data-level="3"]');
    expect(tile3.classList.contains('is-available')).toBe(true);
  });

  test('badges : « Premiers pas » et « Collectionneur d’étoiles » (identifiants de badges.js)', async () => {
    userStore.adventureProgressByOperator = {
      '×': { 1: { completed: true, stars: 3 }, 2: { completed: true, stars: 3 } },
      '+': { 1: { completed: true, stars: 2 }, 2: { completed: true, stars: 2 } },
    };
    const adventure = new AdventureMode();
    await adventure.start();
    expect(checkAndUnlockBadge).toHaveBeenCalledWith('adventurer');
    expect(checkAndUnlockBadge).toHaveBeenCalledWith('star_collector');
    expect(checkAndUnlockBadge).not.toHaveBeenCalledWith('adventure_starter');
  });

  test('en addition, le titre et l’histoire parlent d’addition', async () => {
    store.setTranslations({
      ...BASE_TRANSLATIONS,
      adventure_title: 'L’aventure des tables perdues',
      adventure_title_addition: 'L’aventure des additions',
      adventure_story_intro: 'Les tables de multiplication…',
      adventure_story_intro_addition: 'Les trésors du royaume sont éparpillés…',
    });
    userStore.preferredOperator = '+';
    const adventure = new AdventureMode();
    await adventure.start();
    const title = document.querySelector('.adventure-container h1');
    expect(title.textContent).toBe('L’aventure des additions');
    expect(title.getAttribute('data-translate')).toBe('adventure_title_addition');
    expect(document.querySelector('.adventure-story-intro').textContent).toMatch(/trésors/);
  });

  test('changement de langue : les noms de niveaux sont retraduits', async () => {
    const adventure = new AdventureMode();
    await adventure.start();
    store.setTranslations({ ...BASE_TRANSLATIONS, level_1_name: 'Level 1', table_label: 'Times' });
    adventure.refreshTexts();
    const first = document.querySelector('.level-card[data-level="1"]');
    expect(first.querySelector('.level-name').textContent).toBe('Level 1');
    expect(first.querySelector('.level-table').textContent).toBe('Times 1');
  });

  test('changement de langue sur l’écran de fin : il est retraduit et garde le focus', async () => {
    const adventure = new AdventureMode();
    adventure.gameScreen = document.getElementById('game');
    adventure.currentLevel = adventure.adventureLevels[0];
    adventure.state.correctAnswers = 9;
    adventure.state.questionCount = 10;
    adventure.showLevelResults(true, 3);
    await Promise.resolve();
    await Promise.resolve();
    expect(document.activeElement.id).toBe('adventure-results-title');

    store.setTranslations({ ...BASE_TRANSLATIONS, level_completed: 'Level completed' });
    eventBus.emit('languageChanged', { lang: 'en' });
    const title = document.getElementById('adventure-results-title');
    expect(title.textContent).toBe('Level completed');
    expect(document.activeElement).toBe(title);
    expect(document.querySelectorAll('.adventure-results')).toHaveLength(1);
  });
});
