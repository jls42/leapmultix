/**
 * Modules simulés communs à plusieurs fichiers de test. Chaque fonction se lance en tête de
 * fichier, avant les `await import`, avec l'objet `jest` du fichier de test (les chemins se
 * résolvent depuis ce fichier) et le chemin de `js/` vu de lui : '../js' ou '../../js'.
 */
import { readFileSync } from 'node:fs';
import {
  createChronoDriver,
  createChronoNavigation,
  createGameMock,
  createLazyLoaderMock,
  createSpeechMock,
  quietFakeTime,
  trackChronoInstances,
} from './chrono-test-helpers.mjs';
import { createSlidesMock } from './mode-test-helpers.mjs';

const noop = () => undefined;

/** Enregistre un module simulé par chemin, sous `root` */
function mockModules(jestApi, root, modules) {
  for (const [path, factory] of Object.entries(modules)) {
    jestApi.unstable_mockModule(`${root}/${path}`, factory);
  }
}

/**
 * Profil copié à chaque lecture, comme UserManager le rend : ce qui n'est pas réécrit par
 * updateUserData est perdu. Le profil enregistré se lit et se pose dans `data`.
 * @returns {{data: Object}}
 */
export function mockCopiedProfile(jestApi, root) {
  const copy = value => JSON.parse(JSON.stringify(value)); // NOSONAR - structuredClone n'existe pas sous jsdom
  const saved = { data: {} };
  mockModules(jestApi, root, {
    'core/userState.js': () => ({
      UserState: {
        getCurrentUserData: () => copy(saved.data),
        updateUserData: data => {
          saved.data = { ...saved.data, ...copy(data) };
        },
      },
    }),
  });
  return saved;
}

/** Traductions françaises du jeu */
export function frenchTranslations() {
  return JSON.parse(
    readFileSync(new URL('../../assets/translations/fr.json', import.meta.url), 'utf8')
  );
}

/** Question de multiplication connue : table, multiplicande, réponse */
export function multiplicationQuestion(table, num) {
  return {
    question: `${table} × ${num} = ?`,
    answer: table * num,
    type: 'mcq',
    operator: '×',
    a: table,
    b: num,
    table,
    num,
  };
}

/**
 * Exports de utils-es6.js lus par arcade.js, game.js et les jeux d'Arcade : sans effet, sauf
 * ceux donnés dans `overrides` (fonctions espionnes du test)
 */
export function arcadeUtilsExports(overrides = {}) {
  const silent = Object.fromEntries(
    [
      'addArrowKeyNavigation',
      'startBackgroundRotation',
      'updateBackgroundByAvatar',
      'updateCoinDisplay',
      'updateWelcomeMessageUI',
      'showMessage',
      'cleanupGameResources',
      'speak',
      'playSound',
      'showArcadePoints',
      'updateInfoBar',
      'showArcadeMessage',
      'saveArcadeScore',
      'resetArcadeScores',
      'saveArcadeScoreSnake',
      'resetArcadeScoresSnake',
      'saveArcadeScorePacman',
      'resetArcadeScoresPacman',
      'saveArcadeScoreMemory',
      'resetArcadeScoresMemory',
    ].map(name => [name, noop])
  );
  const noScores = Object.fromEntries(
    [
      'getArcadeScores',
      'getArcadeScoresSnake',
      'getArcadeScoresPacman',
      'getArcadeScoresMemory',
    ].map(name => [name, () => []])
  );
  return {
    ...silent,
    ...noScores,
    getDailyChallengeTable: () => '3',
    getTranslation: key => key,
    isVoiceEnabled: () => false,
    ...overrides,
  };
}

/**
 * Ce qui entoure le vrai arcade.js : utils-es6.js (voir arcadeUtilsExports), la navigation
 * et les sons, sans effet
 */
export function mockArcadeShell(jestApi, root, utils = {}) {
  mockModules(jestApi, root, {
    'utils-es6.js': () => arcadeUtilsExports(utils),
    'slides.js': () => ({ goToSlide: noop }),
    'mode-orchestrator.js': () => ({ setGameMode: async () => {} }),
    'core/audio.js': () => ({ AudioManager: { stopAll: noop, playSound: noop } }),
  });
}

/**
 * Ce qui entoure les vrais modes à questions (Quiz, Défi, Aventure) : l'état de la partie,
 * le Défi du jour, la navigation
 */
export function mockClassicModesShell(jestApi, root, { updateDailyChallengeProgress } = {}) {
  const gameState = { gameMode: null, avatar: 'fox', streak: 0 };
  mockModules(jestApi, root, {
    'game.js': () => ({
      gameState,
      default: gameState,
      updateDailyChallengeProgress: updateDailyChallengeProgress ?? jestApi.fn(),
      displayDailyChallenge: jestApi.fn(),
    }),
    'slides.js': () => ({
      goToSlide: jestApi.fn(),
      showSlide: jestApi.fn(),
      hideAllSlides: jestApi.fn(),
      nextSlide: jestApi.fn(),
      prevSlide: jestApi.fn(),
    }),
    'mode-orchestrator.js': () => ({
      getStartingMode: () => null,
      setStartingMode: jestApi.fn(),
      setGameMode: jestApi.fn(async () => {}),
    }),
  });
}

/** Ce qui entoure le vrai mode Découverte : textes rendus par leur clé, écran et sons sans effet */
export function mockDiscoveryShell(jestApi, root) {
  mockModules(jestApi, root, {
    'utils-es6.js': () => ({
      getTranslation: key => key,
      speak: noop,
      numberToWords: String,
      addArrowKeyNavigation: noop,
      showFeedback: noop,
      updateInfoBar: noop,
      showMessage: noop,
      getDailyChallengeTable: () => 3,
    }),
    'slides.js': () => ({ goToSlide: noop }),
    'game.js': () => ({ gameState: {} }),
    'core/audio.js': () => ({ AudioManager: { stopAll: noop } }),
    'components/infoBar.js': () => ({
      InfoBar: { inject: noop, createElement: () => document.createElement('div') },
    }),
  });
}

/** Écran de jeu des modes à questions : la slide 4, sa zone de jeu et celle des résultats */
export function mountGameSlide() {
  const game = Object.assign(document.createElement('div'), { id: 'game' });
  const results = Object.assign(document.createElement('div'), { id: 'results' });
  const slide = Object.assign(document.createElement('section'), { id: 'slide4' });
  slide.className = 'slide';
  slide.append(game);
  document.body.replaceChildren(slide, results);
}

/**
 * Ce qui entoure le vrai MultiMemory (arcade-multimemory.js) : l'Arcade à l'arrêt, son écran
 * de fin espionné, la partie en cours sans effet
 */
export function mockMemoryArcade(jestApi, root, { showArcadeGameOver }) {
  mockModules(jestApi, root, {
    'arcade.js': () => ({
      showArcadeGameOver,
      startArcadeTimer: jestApi.fn(),
      stopArcadeMode: jestApi.fn(),
      isArcadeActive: () => false,
      memoryMonsterSprites: () => Array.from({ length: 16 }, () => ({ complete: false })),
    }),
    'arcade-session.js': () => ({ noteArcadePlay: jestApi.fn(), noteArcadeMiss: jestApi.fn() }),
  });
}

/** La voix du jeu, coupée */
export function mockSpeechOff(jestApi, root) {
  mockModules(jestApi, root, {
    'speech.js': () => ({
      speak: jestApi.fn(),
      preloadSpeech: jestApi.fn(),
      isVoiceEnabled: () => false,
      updateSpeechVoice: noop,
      cancelSpeech: noop,
      whenSpeechEnds: () => Promise.resolve(),
    }),
  });
}

/**
 * Ce qui entoure les vraies parties de MultiSnake et de MultiMiam (multisnake.js,
 * multimiam.js) : l'écran de fin espionné, le reste sans effet
 */
export function mockLivesGamesShell(jestApi, root, { showArcadeGameOver }) {
  mockModules(jestApi, root, {
    'utils-es6.js': () => ({
      showArcadeMessage: jestApi.fn(),
      showArcadePoints: jestApi.fn(),
      getTranslation: key => key,
    }),
    'arcade.js': () => ({ showArcadeGameOver }),
    'game.js': () => ({ gameState: { avatar: 'fox' } }),
    'arcade-points.js': () => ({ showArcadePenalty: jestApi.fn() }),
    'game-cleanup.js': () => ({ cleanupGameResources: jestApi.fn() }),
    'components/infoBar.js': () => ({
      InfoBar: { update: jestApi.fn(), renderLives: jestApi.fn() },
    }),
    'core/operation-stats.js': () => ({ recordOperationResult: jestApi.fn() }),
    'arcade-session.js': () => ({ noteArcadePlay: jestApi.fn(), noteArcadeMiss: jestApi.fn() }),
    'userManager.js': () => ({ UserManager: { getCurrentUser: () => null } }),
    'core/tablePreferences.js': () => ({
      TablePreferences: { isGlobalEnabled: () => false, getActiveExclusions: () => [] },
    }),
    'core/GameMode.js': () => ({
      plausibleWrongAnswers: ({ answer }) => [answer + 1, answer + 2, answer + 3],
    }),
    'multisnake-renderer.js': () => ({
      drawSnakeScene: jestApi.fn(() => ({ heading: 0 })),
      IMAGE_HEAD_SIZE: 1.5,
    }),
  });
}

/**
 * Écran de jeu affiché sous sa barre du haut : « Accueil » et « Changer de joueur », que le
 * garde des sorties (game-exit.js) surveille. `onExit` reçoit le clic d'une sortie acceptée.
 * @param {(event: MouseEvent) => void} onExit
 * @returns {{home: HTMLButtonElement, changePlayer: HTMLButtonElement}}
 */
export function mountScreenWithTopBar(onExit) {
  const home = Object.assign(document.createElement('button'), { className: 'home-btn' });
  const changePlayer = document.createElement('button');
  changePlayer.className = 'change-user-btn';
  changePlayer.dataset.slide = '0';
  const bar = Object.assign(document.createElement('div'), { className: 'top-bar' });
  bar.append(home, changePlayer);
  home.addEventListener('click', onExit);
  changePlayer.addEventListener('click', onExit);
  const slide = Object.assign(document.createElement('section'), { id: 'slide4' });
  slide.className = 'slide active-slide';
  slide.append(bar, Object.assign(document.createElement('div'), { id: 'game' }));
  const results = Object.assign(document.createElement('div'), { id: 'results' });
  document.body.replaceChildren(slide, results);
  return { home, changePlayer };
}

/**
 * Banc du vrai mode Chrono : modules simulés autour de lui (chargement, jeu, voix,
 * navigation), puis le mode importé et son pilote (chrono-test-helpers.mjs). À attendre en
 * tête de fichier ; `prepare()` se lance dans beforeEach, `stop()` dans afterEach.
 */
export async function loadChronoBench(jestApi, root) {
  const refs = {};
  const instances = [];
  const goToSlide = createChronoNavigation(jestApi, refs);
  mockModules(jestApi, root, {
    'lazy-loader.js': createLazyLoaderMock,
    'game.js': () => createGameMock(jestApi, jestApi.fn()),
    'speech.js': () => createSpeechMock({ speak: jestApi.fn(), preloadSpeech: jestApi.fn() }),
    'slides.js': () => ({ ...createSlidesMock(jestApi), goToSlide }),
  });
  const store = await import('../../js/i18n-store.js');
  const { AudioManager } = await import('../../js/core/audio.js');
  refs.orchestrator = await import('../../js/mode-orchestrator.js');
  refs.chronoModule = await import('../../js/modes/ChronoMode.js');
  const { ChronoMode, stopChronoMode } = refs.chronoModule;
  return {
    ...createChronoDriver(jestApi, refs, () => instances),
    goToSlide,
    /** Écran de jeu sous sa barre du haut, textes français, horloge simulée */
    prepare() {
      instances.length = 0;
      trackChronoInstances(jestApi, ChronoMode, () => instances);
      store.setTranslations(frenchTranslations());
      store.setCurrentLanguage('fr');
      quietFakeTime(jestApi, AudioManager);
      return mountScreenWithTopBar(() => stopChronoMode());
    },
    stop: stopChronoMode,
  };
}
