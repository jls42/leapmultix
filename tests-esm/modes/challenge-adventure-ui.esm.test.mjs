/* eslint-env jest, node */
/**
 * Défi : chrono calme (état « temps faible » par classe, jamais de couleur en ligne),
 * un seul départ par geste, pas de badge pour un défi sans réponse, pas de barre
 * d'infos avant le choix de la difficulté.
 * Aventure : niveaux en vrais boutons, écrans de fin en phrase, sans émoji d'interface ;
 * une erreur est expliquée et attend « Continuer », jusqu'à la dernière question ; le
 * niveau se termine toujours sur son propre écran ; badges et verrous justes.
 */
import { describe, test, expect, beforeAll, beforeEach, afterEach, jest } from '@jest/globals';

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
  incorrect: 'Presque !',
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
  slides.goToSlide.mockClear();
  checkAndUnlockBadge.mockClear();
  // jsdom n'implémente pas le défilement de la fenêtre
  globalThis.scrollTo = jest.fn();
  jest.spyOn(AudioManager, 'playSound').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

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

  test('réussite : phrase principale, étoiles dessinées, trésor, sans émoji', () => {
    const adventure = new AdventureMode();
    adventure.gameScreen = document.getElementById('game');
    adventure.currentLevel = adventure.adventureLevels[0];
    adventure.state.correctAnswers = 9;
    adventure.state.questionCount = 10;
    adventure.state.score = 90;
    adventure.showLevelResults(true, 2);

    const results = document.querySelector('.adventure-results');
    expect(results.querySelector('h2').textContent).toBe('Niveau terminé');
    expect(results.querySelector('.results-lead').textContent).toBe('9 bonnes réponses sur 10');
    const rating = results.querySelector('.reward-stars');
    expect(rating.getAttribute('aria-label')).toBe('2 étoiles sur 3');
    expect(rating.querySelectorAll('svg.reward-star.is-earned')).toHaveLength(2);
    expect(results.querySelector('img.results-treasure')).not.toBeNull();
    expect(EMOJI.test(results.textContent)).toBe(false);
  });

  test('échec : ton calme, le personnage reste présent', () => {
    const adventure = new AdventureMode();
    adventure.gameScreen = document.getElementById('game');
    adventure.currentLevel = adventure.adventureLevels[1];
    adventure.state.correctAnswers = 1;
    adventure.state.questionCount = 4;
    adventure.showLevelResults(false, 0);

    const results = document.querySelector('.adventure-results');
    expect(results.querySelector('h2').textContent).toBe('Pas cette fois');
    expect(results.querySelector('.results-lead').textContent).toBe('1 bonne réponse sur 4');
    expect(results.querySelector('img.results-avatar')).not.toBeNull();
    expect(results.querySelector('.reward-stars')).toBeNull();
    expect(EMOJI.test(results.textContent)).toBe(false);
    const primary = results.querySelector('.results-actions .btn:not(.btn-secondary)');
    expect(primary.dataset.action).toBe('adventure-start-level');
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
    expect(panel.querySelector('.feedback-lead').textContent).toBe('Presque !');
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
    expect(results.querySelector('h2').textContent).toBe('Niveau terminé');
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
    expect(results.querySelector('h2').textContent).toBe('Pas cette fois');
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
    const title = document.querySelector('.adventure-container h2');
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
